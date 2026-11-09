import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { HistoricalContext } from './model';

const context: HistoricalContext = {
  id: 'alpha-context',
  title: 'Alpha reference',
  region: 'Europe',
  interval: {
    start: -200,
    end: -100,
    label: '200–100 BCE',
    note: 'A selected frame.',
    precision: 'range',
  },
  summary: 'An immediate reference summary.',
  citations: [{ source: 'alpha-source', locator: 'Context overview' }],
  subjectIds: ['alpha'],
  phases: [
    {
      year: -150,
      title: 'A dated change',
      text: 'The complete reference reading.',
      citations: [{ source: 'alpha-source', locator: 'Selected phase account' }],
    },
  ],
};
const response = (data: unknown, ok = true) =>
  ({ ok, json: async () => data }) as Response;

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

describe('Deferred reference context loader', () => {
  it('shares the local request and caches a complete response', async () => {
    let resolve!: (value: Response) => void;
    const fetcher = vi.fn(() => new Promise<Response>((done) => (resolve = done)));
    vi.stubGlobal('fetch', fetcher);
    const { loadReferenceContexts } = await import('./data');
    const first = loadReferenceContexts();
    const second = loadReferenceContexts(['alpha-context']);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith('/atlas/contexts.json');
    resolve(response([context]));
    await expect(first).resolves.toEqual([context]);
    await expect(second).resolves.toEqual([context]);
    await expect(loadReferenceContexts(['alpha-context'])).resolves.toEqual([context]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('clears a failed request so a subsequent retry can succeed', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response(null, false))
      .mockResolvedValueOnce(response([context]));
    vi.stubGlobal('fetch', fetcher);
    const { loadReferenceContexts } = await import('./data');
    await expect(loadReferenceContexts()).rejects.toThrow('could not be loaded');
    await expect(loadReferenceContexts()).resolves.toEqual([context]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it.each([
    ['empty phases', { ...context, phases: [] }],
    ['deferred prose', { ...context, phases: [{ ...context.phases[0]!, text: '' }] }],
    ['year zero', { ...context, phases: [{ ...context.phases[0]!, year: 0 }] }],
    ['nonfinite year', { ...context, phases: [{ ...context.phases[0]!, year: NaN }] }],
    [
      'missing phase evidence',
      { ...context, phases: [{ ...context.phases[0]!, citations: [] }] },
    ],
  ])('rejects %s and permits a fresh request', async (_label, incomplete) => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response([incomplete]))
      .mockResolvedValueOnce(response([context]));
    vi.stubGlobal('fetch', fetcher);
    const { loadReferenceContexts } = await import('./data');
    await expect(loadReferenceContexts()).rejects.toThrow('incomplete');
    await expect(loadReferenceContexts()).resolves.toEqual([context]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('does not treat a stale response missing the requested context as complete', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response([context]));
    vi.stubGlobal('fetch', fetcher);
    const { loadReferenceContexts } = await import('./data');
    await expect(loadReferenceContexts(['alpha-context'])).rejects.toThrow(
      'incomplete',
    );
    await expect(loadReferenceContexts(['alpha-context'])).resolves.toEqual([context]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
