import { gzipSync } from 'node:zlib';

import { describe, expect, it } from 'vitest';

import { gzippedBytes, JS_GZIP_LIMIT } from './bundle-size.ts';

describe('bundle size', () => {
  it('sums gzipped files and keeps the limit at 400 KB', () => {
    const left = new Uint8Array([1, 2, 3, 4]);
    const right = new Uint8Array([5, 6, 7]);
    expect(gzippedBytes([left, right])).toBe(
      gzipSync(left).length + gzipSync(right).length,
    );
    expect(JS_GZIP_LIMIT).toBe(400 * 1000);
  });
});
