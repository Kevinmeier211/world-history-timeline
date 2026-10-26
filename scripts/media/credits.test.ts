import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { colophonText, creditsLines, shippedCredits } from '../../src/data/credits.ts';
import type { MediaSrc } from '../../src/data/schema/mediaSrc.ts';
import { colophonFor } from './credits.ts';

const source = {
  id: 'plate_example',
  subject: 'example',
  sourceUrl: 'https://example.test/object/1',
  credit: {
    creator: 'Test Creator',
    title: 'Test Object',
    date: 'n.d.',
    institution: 'Example museum',
  },
  license: 'CC0',
  licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  licenseApproved: false,
  alt: 'A square.',
  caption: 'Test Object, n.d., Example museum.',
  depiction: 'later',
  status: 'candidate',
} as const satisfies MediaSrc;

describe('credits', () => {
  it('credits a shipped id and skips one that is not in the source list', () => {
    const rows = shippedCredits(
      [{ id: 'plate_example' }, { id: 'missing_plate' }],
      [source],
    );
    expect(rows).toHaveLength(1);
    expect(creditsLines(rows)[0]).toContain('Test Creator');
    expect(creditsLines(rows)[0]).toContain('https://example.test/object/1');
  });

  it('writes an empty colophon while no derivative is shipped', () => {
    const generated = readFileSync('src/data/media.generated.json', 'utf8');
    const sources = readFileSync('src/data/media-src.json', 'utf8');
    const text = colophonFor(generated, sources);
    expect(JSON.parse(generated)).toEqual({ images: [] });
    expect(text).toBe(colophonText([]));
    expect(text).not.toContain('clevelandart.org');
    expect(text).toContain('No image files are shipped.');
    expect(readFileSync('docs/print/colophon.txt', 'utf8')).toBe(text);
  });
});
