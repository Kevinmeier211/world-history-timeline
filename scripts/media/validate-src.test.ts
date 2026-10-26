import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { mediaSrcSchema } from '../../src/data/schema/mediaSrc.ts';
import { validateMediaSrcText } from './validate-src.ts';

const approved = {
  id: 'plate_example',
  subject: 'example',
  sourceUrl: 'https://example.test/object/1',
  credit: {
    creator: 'Unknown',
    title: 'Example object',
    date: 'n.d.',
    institution: 'Example museum',
  },
  license: 'CC-BY',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  licenseApproved: true,
  alt: 'A square plate.',
  caption: 'Example object, n.d., Example museum.',
  depiction: 'photo',
  status: 'candidate',
} as const;

describe('media-src', () => {
  it('accepts the checked-in file and rejects an unapproved share-alike row', () => {
    const file = readFileSync('src/data/media-src.json', 'utf8');
    expect(validateMediaSrcText(file).count).toBe(0);
    expect(mediaSrcSchema.safeParse(approved).success).toBe(true);
    expect(
      mediaSrcSchema.safeParse({ ...approved, licenseApproved: false }).success,
    ).toBe(false);
    expect(
      mediaSrcSchema.safeParse({ ...approved, license: 'NC', licenseApproved: true })
        .success,
    ).toBe(false);
    expect(
      mediaSrcSchema.safeParse({
        ...approved,
        license: 'CC0',
        licenseApproved: false,
        alt: '',
      }).success,
    ).toBe(false);
  });
});
