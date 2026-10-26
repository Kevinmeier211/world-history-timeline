import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

/** Appendix E: the poster JavaScript stays under 400 KB gzipped. */
export const JS_GZIP_LIMIT = 400 * 1000;

export function gzippedBytes(files: readonly Uint8Array[]): number {
  return files.reduce((sum, file) => sum + gzipSync(file).length, 0);
}

export function jsAssets(dir: string): Uint8Array[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith('.js'))
    .sort()
    .map((name) => readFileSync(join(dir, name)));
}

if (process.argv[1]?.includes('bundle-size.ts')) {
  const files = jsAssets('dist/assets');
  const bytes = gzippedBytes(files);
  const kb = (bytes / 1000).toFixed(2);
  console.log(`bundle: ${files.length} js file(s), ${kb} KB gzipped (${bytes} bytes)`);
  if (files.length === 0 || bytes > JS_GZIP_LIMIT) {
    console.error(`bundle: expected at least one JS file under ${JS_GZIP_LIMIT} bytes`);
    process.exit(1);
  }
}
