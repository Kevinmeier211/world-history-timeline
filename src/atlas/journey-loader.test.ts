import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildJourneyBootstrap } from '../../scripts/redesign/bootstrap-journeys';
import type { Corpus, JourneySummary } from './model';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const bootstrap = buildJourneyBootstrap(corpus);
const brief = () => structuredClone(bootstrap.journeys[0]!);
const body = () => structuredClone(bootstrap.records[0]!);
const response = (value: unknown, ok = true) =>
  ({ ok, json: async () => value }) as Response;
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((yes) => {
    resolve = yes;
  });
  return { promise, resolve };
}
beforeEach(() => vi.resetModules());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('selected journey delivery', () => {
  it('deduplicates requests while merging each caller’s retained metadata afresh', async () => {
    const pending = deferred<Response>();
    const fetcher = vi.fn(() => pending.promise);
    vi.stubGlobal('fetch', fetcher);
    const { loadJourneyDetails } = await import('./data');
    const first = loadJourneyDetails(brief());
    const current = brief();
    current.title = 'Current caller title';
    current.evidence.citations = [
      { source: 'current-source', locator: 'Current scope' },
    ];
    const second = loadJourneyDetails(current);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(
      `/atlas/journey-records/${encodeURIComponent(current.id)}.json?revision=${current.detailsRevision}`,
    );
    pending.resolve(response(body()));
    expect((await first).title).toBe(brief().title);
    const hydrated = await second;
    expect(hydrated.title).toBe(current.title);
    expect(hydrated.evidence.citations).toEqual(current.evidence.citations);
    hydrated.evidence.options[0]!.feedback = 'Caller edit';
    hydrated.stops[0]!.narrative = 'Caller edit';
    const cached = await loadJourneyDetails(current);
    expect(cached.stops[0]!.narrative).toBe(body().stops[0]!.narrative);
    expect(cached.evidence.options[0]!.feedback).toBe(
      body().evidence.options[0]!.feedback,
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it.each(['network', 'http', 'json', 'partial', 'revision', 'identity', 'injection'])(
    'evicts a %s failure so an explicit retry can recover',
    async (failure) => {
      const fetcher = vi.fn();
      if (failure === 'network') fetcher.mockRejectedValueOnce(new Error('Offline'));
      else if (failure === 'http') fetcher.mockResolvedValueOnce(response({}, false));
      else if (failure === 'json')
        fetcher.mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error('Bad JSON');
          },
        });
      else {
        const invalid: Record<string, unknown> = body();
        if (failure === 'partial') invalid.conclusion = '';
        if (failure === 'revision') invalid.revision = 'earlier-release';
        if (failure === 'identity') invalid.journey = 'another-journey';
        if (failure === 'injection') invalid.returnPrompt = 'Replaced question';
        fetcher.mockResolvedValueOnce(response(invalid));
      }
      fetcher.mockResolvedValueOnce(response(body()));
      vi.stubGlobal('fetch', fetcher);
      const { loadJourneyDetails } = await import('./data');
      await expect(loadJourneyDetails(brief())).rejects.toThrow();
      const recovered = await loadJourneyDetails(brief());
      expect(recovered.conclusion).toBe(body().conclusion);
      expect(fetcher).toHaveBeenCalledTimes(2);
    },
  );

  it('evicts an exact-stop-count mismatch and keeps revision and ID caches separate', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response({ ...body(), stops: body().stops.slice(0, 1) }));
    fetcher.mockResolvedValueOnce(response(body()));
    const next = brief();
    next.detailsRevision = 'b'.repeat(64);
    fetcher.mockResolvedValueOnce(
      response({ ...body(), revision: next.detailsRevision }),
    );
    const other = brief();
    other.id = 'other-journey';
    fetcher.mockResolvedValueOnce(response({ ...body(), journey: other.id }));
    vi.stubGlobal('fetch', fetcher);
    const { loadJourneyDetails } = await import('./data');
    await expect(loadJourneyDetails(brief())).rejects.toThrow('incomplete');
    await expect(loadJourneyDetails(brief())).resolves.toBeDefined();
    await expect(loadJourneyDetails(next)).resolves.toBeDefined();
    await expect(loadJourneyDetails(other)).resolves.toMatchObject({ id: other.id });
    expect(fetcher).toHaveBeenCalledTimes(4);
  });

  it('rejects malformed bootstrap before fetching and respects a portable base URL', async () => {
    const fetcher = vi.fn().mockResolvedValue(response(body()));
    vi.stubGlobal('fetch', fetcher);
    vi.stubEnv('BASE_URL', '/portable/');
    const { loadJourneyDetails } = await import('./data');
    const malformed = brief();
    delete malformed.detailsRevision;
    await expect(loadJourneyDetails(malformed)).rejects.toThrow('incomplete');
    await expect(
      loadJourneyDetails({ ...brief(), stops: [] } as JourneySummary),
    ).rejects.toThrow('incomplete');
    expect(fetcher).not.toHaveBeenCalled();
    await loadJourneyDetails(brief());
    expect(fetcher).toHaveBeenCalledWith(
      `/portable/atlas/journey-records/${encodeURIComponent(brief().id)}.json?revision=${brief().detailsRevision}`,
    );
  });
});
