import { describe, expect, it } from 'vitest';

import { manifestJson, pageInches, printManifest } from './manifest.ts';

describe('print manifest', () => {
  it('keeps the timestamp it was given and the measured page inches', () => {
    const stamp = '2026-10-26T21:00:00.000Z';
    const manifest = printManifest(stamp, [
      {
        path: 'dist-print/chronos-poster-bleed.pdf',
        bytes: 12,
        widthIn: pageInches(1746, 0),
        heightIn: pageInches(2610, 0),
        pages: 1,
      },
      {
        path: 'dist-print/chronos-letter.pdf',
        bytes: 4,
        widthIn: pageInches(null, 8.5),
        heightIn: pageInches(null, 11),
        pages: null,
      },
    ]);
    expect(manifest.generatedAt).toBe(stamp);
    expect(manifest.files[0]?.widthIn).toBe(24.25);
    expect(manifest.files[0]?.heightIn).toBe(36.25);
    expect(manifest.files[1]?.widthIn).toBe(8.5);
    expect(manifest.files[1]?.pages).toBeNull();
    const parsed = JSON.parse(manifestJson(manifest)) as { generatedAt: string };
    expect(parsed.generatedAt).toBe(stamp);
  });
});
