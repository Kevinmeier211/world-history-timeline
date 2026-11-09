import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Source } from './model';
import { parseSourceRecords } from './data';

const record = (id: string, extra: Partial<Source> = {}): Source => ({
  id,
  title: `Title ${id}`,
  institution: 'Example institution',
  url: `https://example.test/${id}`,
  type: 'catalogue',
  accessed: '2026-10-29',
  scope: '',
  ...extra,
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

describe('source record validation', () => {
  it('accepts the deferred bibliography, including empty scope and omitted optional fields', () => {
    const records = JSON.parse(
      readFileSync('public/atlas/source-records.json', 'utf8'),
    );
    const index = JSON.parse(readFileSync('public/atlas/index.json', 'utf8'));
    const parsed = parseSourceRecords(
      records,
      index.sources.map((source: Source) => source.id),
    );
    expect(parsed).toHaveLength(records.length);
    expect(parsed.every((source) => source.scope === '')).toBe(true);
    const authored = records.find((source: Source) => source.id === 'han');
    const anonymous = records.find(
      (source: Source) => source.id === 'kanishka-chronology',
    );
    expect(parsed.find((source) => source.id === 'han')).toMatchObject({
      author: authored.author,
      published: authored.published,
      title: authored.title,
      url: authored.url,
    });
    const kept = parsed.find((source) => source.id === 'kanishka-chronology');
    expect(kept?.title).toBe(anonymous.title);
    expect(kept).not.toHaveProperty('author');
    expect(anonymous).not.toHaveProperty('author');
  });

  const { scope: _scope, ...missingScope } = record('a');
  void _scope;
  const invalid: [string, unknown][] = [
    ['an object', {}],
    ['a string', 'record'],
    ['null', null],
    ['a non-object row', [null]],
    ['a missing id', [{ ...record('a'), id: '' }]],
    ['a duplicate id', [record('a'), record('a')]],
    ['a missing title', [{ ...record('a'), title: ' ' }]],
    ['a missing institution', [{ ...record('a'), institution: '' }]],
    ['a missing consultation date', [{ ...record('a'), accessed: '' }]],
    ['a missing scope', [missingScope]],
    ['a non-http url', [{ ...record('a'), url: 'ftp://example.test/a' }]],
    ['an unknown type', [{ ...record('a'), type: 'book' }]],
    ['a non-string author', [{ ...record('a'), author: 12 }]],
  ];
  it.each(invalid)('rejects %s', (_label, value) => {
    expect(() => parseSourceRecords(value, ['a'])).toThrow(
      'Source records could not be loaded.',
    );
  });

  it('rejects a missing or extra id without inventing metadata', () => {
    expect(() => parseSourceRecords([record('a')], ['a', 'b'])).toThrow(
      /could not be loaded/,
    );
    expect(() => parseSourceRecords([record('a'), record('b')], ['a'])).toThrow(
      /could not be loaded/,
    );
    const parsed = parseSourceRecords([{ ...record('a'), note: 'ignore' }], ['a']);
    expect(parsed[0]).not.toHaveProperty('note');
    expect(parsed[0]).not.toHaveProperty('author');
  });
});

describe('deferred source-record loader', () => {
  it('shares one request and caches a complete response', async () => {
    const pending = deferred<Response>();
    const fetcher = vi.fn(() => pending.promise);
    vi.stubGlobal('fetch', fetcher);
    const { loadSourceRecords } = await import('./data');
    const first = loadSourceRecords(['b', 'a']);
    const second = loadSourceRecords(['a', 'b']);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith('/atlas/source-records.json');
    pending.resolve(response([record('a'), record('b')]));
    await expect(first).resolves.toEqual([record('a'), record('b')]);
    await expect(second).resolves.toEqual([record('a'), record('b')]);
    await expect(loadSourceRecords(['b', 'a'])).resolves.toHaveLength(2);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['http', response(null, false)],
    [
      'malformed json',
      {
        ok: true,
        json: async () => {
          throw Error('not json');
        },
      },
    ],
    ['wrong shape', response({})],
    ['missing id', response([{ ...record('a'), id: undefined }])],
    ['duplicate id', response([record('a'), record('a')])],
    ['missing required id', response([record('a')])],
  ])('clears a %s failure so an explicit retry can succeed', async (_label, failed) => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(failed)
      .mockResolvedValueOnce(response([record('a'), record('b')]));
    vi.stubGlobal('fetch', fetcher);
    const { loadSourceRecords } = await import('./data');
    await expect(loadSourceRecords(['a', 'b'])).rejects.toThrow(/could not be loaded/);
    await expect(loadSourceRecords(['b', 'a'])).resolves.toEqual([
      record('a'),
      record('b'),
    ]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('does not let an older rejection evict a newer retry', async () => {
    const pending = deferred<Response>();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response({}))
      .mockReturnValueOnce(pending.promise);
    vi.stubGlobal('fetch', fetcher);
    const { loadSourceRecords } = await import('./data');
    const rejected = loadSourceRecords(['a']);
    const concurrent = loadSourceRecords(['a']);
    const handled = concurrent.catch(() => undefined);
    const retry = rejected.catch(() => loadSourceRecords(['a']));
    await handled;
    await Promise.resolve();
    const sameRetry = loadSourceRecords(['a']);
    expect(fetcher).toHaveBeenCalledTimes(2);
    pending.resolve(response([record('a')]));
    await expect(retry).resolves.toEqual([record('a')]);
    await expect(sameRetry).resolves.toEqual([record('a')]);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('fetches again when the required ids change', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(response([record('a')]))
      .mockResolvedValueOnce(response([record('a'), record('b')]));
    vi.stubGlobal('fetch', fetcher);
    const { loadSourceRecords } = await import('./data');
    await expect(loadSourceRecords(['a'])).resolves.toHaveLength(1);
    await expect(loadSourceRecords(['a', 'b'])).resolves.toHaveLength(2);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('rejects duplicate requested ids before fetching', async () => {
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const { loadSourceRecords } = await import('./data');
    await expect(loadSourceRecords(['a', 'a'])).rejects.toThrow(/could not be loaded/);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('uses the configured BASE_URL', async () => {
    vi.stubEnv('BASE_URL', '/nested/');
    const fetcher = vi.fn().mockResolvedValue(response([record('a')]));
    vi.stubGlobal('fetch', fetcher);
    const { loadSourceRecords } = await import('./data');
    await loadSourceRecords(['a']);
    expect(fetcher).toHaveBeenCalledWith('/nested/atlas/source-records.json');
  });
});
