import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { mediaSrcFileSchema } from '../../src/data/schema/mediaSrc.ts';
import { parseRunConfig } from '../runConfig.ts';

export interface FetchRow {
  id: string;
  sourceUrl: string;
}

export interface FetchOutcome {
  id: string;
  status: 'queued-gated' | 'cached' | 'head-failed' | 'hash-mismatch';
  sha256?: string;
  cachePath?: string;
}

export interface FetchIO {
  head: (url: string) => Promise<number>;
  get: (url: string) => Promise<Uint8Array>;
}

/** SHA-256 of the bytes that would be stored. No network. */
export function sha256Hex(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

/**
 * When downloads are off, every row is queued-gated and `io` is not called.
 * When they are on, HEAD must succeed before the body is read and hashed.
 */
export async function runFetch(options: {
  allowDownload: boolean;
  rows: readonly FetchRow[];
  cacheDir: string;
  io?: FetchIO;
  expected?: ReadonlyMap<string, string>;
}): Promise<FetchOutcome[]> {
  if (!options.allowDownload) {
    return options.rows.map((row) => ({ id: row.id, status: 'queued-gated' }));
  }
  const io = options.io;
  if (!io) throw new Error('fetch io is required when downloads are allowed');
  mkdirSync(options.cacheDir, { recursive: true });
  const outcomes: FetchOutcome[] = [];
  for (const row of options.rows) {
    const status = await io.head(row.sourceUrl);
    if (status < 200 || status >= 300) {
      outcomes.push({ id: row.id, status: 'head-failed' });
      continue;
    }
    const bytes = await io.get(row.sourceUrl);
    const sha256 = sha256Hex(bytes);
    const expected = options.expected?.get(row.id);
    if (expected && expected !== sha256) {
      outcomes.push({ id: row.id, status: 'hash-mismatch', sha256 });
      continue;
    }
    const cachePath = path.join(options.cacheDir, `${row.id}.${sha256.slice(0, 12)}`);
    writeFileSync(cachePath, bytes);
    outcomes.push({ id: row.id, status: 'cached', sha256, cachePath });
  }
  return outcomes;
}

const invoked =
  process.argv[1]?.endsWith('fetch.ts') || process.argv[1]?.endsWith('fetch.js');

if (invoked) {
  const config = parseRunConfig(readFileSync('docs/RUN_CONFIG.md', 'utf8'));
  const rows = mediaSrcFileSchema.parse(
    JSON.parse(readFileSync('src/data/media-src.json', 'utf8')) as unknown,
  );
  const outcomes = await runFetch({
    allowDownload: config.ALLOW_MEDIA_DOWNLOAD,
    rows: rows.map((row) => ({ id: row.id, sourceUrl: row.sourceUrl })),
    cacheDir: 'media-cache',
    io: config.ALLOW_MEDIA_DOWNLOAD
      ? {
          head: async (url) => {
            const response = await fetch(url, { method: 'HEAD' });
            return response.status;
          },
          get: async (url) => {
            const response = await fetch(url);
            return new Uint8Array(await response.arrayBuffer());
          },
        }
      : undefined,
  });
  const gated = outcomes.every((row) => row.status === 'queued-gated');
  if (gated) {
    console.log(
      `media:fetch: queued-gated (${outcomes.length} rows). No files downloaded.`,
    );
  } else {
    const cached = outcomes.filter((row) => row.status === 'cached').length;
    console.log(`media:fetch: cached ${cached} of ${outcomes.length}.`);
  }
}
