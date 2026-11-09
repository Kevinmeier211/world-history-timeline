import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import type { Corpus, MediaDetails, MediaSummary, RuntimeCorpus } from './model';

const summary = (id = 'image-a'): MediaSummary => ({
  id,
  title: id,
  subject: 'alpha',
  source: 'catalogue',
  accession: 'Accession A',
  date: {
    start: -500,
    end: -400,
    label: 'Catalogue range',
    note: 'Not an exact year.',
    precision: 'range',
  },
  image: '/atlas/media/image.webp',
  thumbnail: '/atlas/media/thumb.webp',
  width: 600,
  height: 400,
  alt: 'Visible source image.',
  rights: 'Rights retained.',
  credit: 'Credit retained.',
  licenseUrl: 'https://example.org/licence',
  sourceImage: 'https://example.org/original',
  depiction: 'object photograph',
});
const details = (id = 'image-a'): MediaDetails => ({
  id,
  caption: 'The full caption.',
  notice: ['An observation.'],
  creator: 'Unrecorded',
  place: 'Recorded place',
  material: 'Stone',
  relevance: 'A concrete question.',
});
const body = (revision = 'revision-a', subject = 'alpha', media = [details()]) => ({
  subject,
  revision,
  media,
});
const response = (data: unknown, ok = true) =>
  ({ ok, json: async () => data }) as Response;
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
beforeEach(() => vi.resetModules());
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('local media-details loader', () => {
  it('shares one request, caches deltas, and merges every caller’s current summaries/order', async () => {
    const pending = deferred<Response>();
    const fetcher = vi.fn(() => pending.promise);
    vi.stubGlobal('fetch', fetcher);
    const { loadMediaDetails } = await import('./data');
    const first = loadMediaDetails('alpha', 'revision-a', [
      summary(),
      summary('image-b'),
    ]);
    const fresh = {
      ...summary(),
      title: 'Current title',
      credit: 'Current credit',
      date: { ...summary().date, note: 'Current note.' },
    };
    const second = loadMediaDetails('alpha', 'revision-a', [summary('image-b'), fresh]);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(
      '/atlas/media-records/alpha.json?revision=revision-a',
    );
    pending.resolve(
      response(body('revision-a', 'alpha', [details(), details('image-b')])),
    );
    expect((await first).map((m) => m.id)).toEqual(['image-a', 'image-b']);
    const resolved = await second;
    expect(resolved.map((m) => m.id)).toEqual(['image-b', 'image-a']);
    expect(resolved[1]).toMatchObject(fresh);
    resolved[0]!.notice.push('Caller mutation.');
    const cached = await loadMediaDetails('alpha', 'revision-a', [
      fresh,
      summary('image-b'),
    ]);
    expect(cached[1]!.notice).toEqual(['An observation.']);
    expect(cached[0]).toMatchObject(fresh);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('isolates cache entries by subject and global revision', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response(body()))
      .mockResolvedValueOnce(response(body('revision-b')))
      .mockResolvedValueOnce(response(body('revision-a', 'beta')));
    vi.stubGlobal('fetch', fetcher);
    const { loadMediaDetails } = await import('./data');
    await loadMediaDetails('alpha', 'revision-a', [summary()]);
    await loadMediaDetails('alpha', 'revision-b', [summary()]);
    await loadMediaDetails('beta', 'revision-a', [summary()]);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it.each(['network', 'http', 'json', 'partial', 'stale', 'malformed'])(
    'evicts a %s failure so explicit retry can recover',
    async (failure) => {
      const fetcher = vi.fn();
      if (failure === 'network') fetcher.mockRejectedValueOnce(new Error('Offline'));
      if (failure === 'http') fetcher.mockResolvedValueOnce(response(null, false));
      if (failure === 'json')
        fetcher.mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw Error('HTML fallback');
          },
        });
      if (failure === 'partial')
        fetcher.mockResolvedValueOnce(response(body('revision-a', 'alpha', [])));
      if (failure === 'stale')
        fetcher.mockResolvedValueOnce(response(body('old-revision')));
      if (failure === 'malformed')
        fetcher.mockResolvedValueOnce(response({ ...body(), media: [null] }));
      fetcher.mockResolvedValueOnce(response(body()));
      vi.stubGlobal('fetch', fetcher);
      const { loadMediaDetails } = await import('./data');
      await expect(
        loadMediaDetails('alpha', 'revision-a', [summary()]),
      ).rejects.toThrow();
      await expect(
        loadMediaDetails('alpha', 'revision-a', [summary()]),
      ).resolves.toEqual([{ ...summary(), ...details() }]);
      expect(fetcher).toHaveBeenCalledTimes(2);
    },
  );

  it('does not let an older caller rejection evict a newer retry', async () => {
    const pending = deferred<Response>();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response(body('revision-a', 'alpha', [])))
      .mockReturnValueOnce(pending.promise);
    vi.stubGlobal('fetch', fetcher);
    const { loadMediaDetails } = await import('./data');
    const rejected = loadMediaDetails('alpha', 'revision-a', [summary()]);
    const concurrent = loadMediaDetails('alpha', 'revision-a', [summary()]);
    const handled = concurrent.catch(() => undefined);
    const retry = rejected.catch(() =>
      loadMediaDetails('alpha', 'revision-a', [summary()]),
    );
    await handled;
    await Promise.resolve();
    const sameRetry = loadMediaDetails('alpha', 'revision-a', [summary()]);
    expect(fetcher).toHaveBeenCalledTimes(2);
    pending.resolve(response(body()));
    await expect(retry).resolves.toHaveLength(1);
    await expect(sameRetry).resolves.toHaveLength(1);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('rejects changed membership instead of returning a cached partial list', async () => {
    const fetcher = vi.fn().mockResolvedValue(response(body()));
    vi.stubGlobal('fetch', fetcher);
    const { loadMediaDetails } = await import('./data');
    await loadMediaDetails('alpha', 'revision-a', [summary()]);
    await expect(
      loadMediaDetails('alpha', 'revision-a', [summary(), summary('image-b')]),
    ).rejects.toThrow('incomplete');
  });

  it('handles a valid imageless subject without fetching or poisoning a later request', async () => {
    const fetcher = vi.fn().mockResolvedValue(response(body()));
    vi.stubGlobal('fetch', fetcher);
    const { loadMediaDetails } = await import('./data');
    await expect(loadMediaDetails('alpha', 'revision-a', [])).resolves.toEqual([]);
    expect(fetcher).not.toHaveBeenCalled();
    await loadMediaDetails('alpha', 'revision-a', [summary()]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('rejects duplicate requested IDs before starting a request', async () => {
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const { loadMediaDetails } = await import('./data');
    await expect(
      loadMediaDetails('alpha', 'revision-a', [summary(), summary()]),
    ).rejects.toThrow('incomplete');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('uses the configured BASE_URL and encodes request identity', async () => {
    vi.stubEnv('BASE_URL', '/nested/');
    const fetcher = vi
      .fn()
      .mockResolvedValue(response(body('revision a', 'alpha case')));
    vi.stubGlobal('fetch', fetcher);
    const { loadMediaDetails } = await import('./data');
    await loadMediaDetails('alpha case', 'revision a', [summary()]);
    expect(fetcher).toHaveBeenCalledWith(
      '/nested/atlas/media-records/alpha%20case.json?revision=revision%20a',
    );
  });

  it('keeps full-corpus and bootstrap loading distinct without fetching media details', async () => {
    const fetcher = vi.fn().mockResolvedValue(response({ media: [] }));
    vi.stubGlobal('fetch', fetcher);
    const { loadCorpus } = await import('./data');
    const runtime = loadCorpus();
    const full = loadCorpus(true);
    expectTypeOf(runtime).toEqualTypeOf<Promise<RuntimeCorpus>>();
    expectTypeOf(full).toEqualTypeOf<Promise<Corpus>>();
    await Promise.all([runtime, full]);
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
      '/atlas/index.json',
      '/atlas/corpus.json',
    ]);
  });
});
