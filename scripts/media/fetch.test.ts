import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import { runFetch, sha256Hex } from './fetch.ts';

const ABC = new TextEncoder().encode('abc');

describe('media fetch', () => {
  it('hashes a buffer and does not touch the network while downloads are off', async () => {
    expect(sha256Hex(ABC)).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
    const head = vi.fn(() => Promise.resolve(200));
    const get = vi.fn(() => Promise.resolve(ABC));
    const outcomes = await runFetch({
      allowDownload: false,
      rows: [{ id: 'cma_2024_27', sourceUrl: 'https://example.test/should-not-fetch' }],
      cacheDir: path.join(tmpdir(), 'unused-media-cache'),
      io: { head, get },
    });
    expect(outcomes).toEqual([{ id: 'cma_2024_27', status: 'queued-gated' }]);
    expect(head).not.toHaveBeenCalled();
    expect(get).not.toHaveBeenCalled();
  });

  it('stores a body only after HEAD succeeds and the hash matches', async () => {
    const cacheDir = mkdtempSync(path.join(tmpdir(), 'media-cache-'));
    const head = vi.fn(() => Promise.resolve(200));
    const get = vi.fn(() => Promise.resolve(ABC));
    const stored = await runFetch({
      allowDownload: true,
      rows: [{ id: 'plate_bytes', sourceUrl: 'https://example.test/bytes' }],
      cacheDir,
      io: { head, get },
      expected: new Map([
        [
          'plate_bytes',
          'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
        ],
      ]),
    });
    expect(stored[0]?.status).toBe('cached');
    expect(readFileSync(stored[0]?.cachePath ?? '').toString()).toBe('abc');

    const missed = await runFetch({
      allowDownload: true,
      rows: [{ id: 'plate_miss', sourceUrl: 'https://example.test/miss' }],
      cacheDir,
      io: {
        head: () => Promise.resolve(404),
        get: () => Promise.reject(new Error('body should not be read')),
      },
    });
    expect(missed[0]?.status).toBe('head-failed');

    const mismatch = await runFetch({
      allowDownload: true,
      rows: [{ id: 'plate_bad', sourceUrl: 'https://example.test/bad' }],
      cacheDir,
      io: { head: () => Promise.resolve(200), get: () => Promise.resolve(ABC) },
      expected: new Map([['plate_bad', '0000']]),
    });
    expect(mismatch[0]?.status).toBe('hash-mismatch');
    expect(mismatch[0]?.cachePath).toBeUndefined();
  });

  it('exits queued-gated from the command while the switch is off', () => {
    const result = spawnSync(
      path.resolve('node_modules/.bin/tsx'),
      ['scripts/media/fetch.ts'],
      { encoding: 'utf8' },
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('queued-gated');
    expect(result.stdout).toContain('No files downloaded');
  });
});
