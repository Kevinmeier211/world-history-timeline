import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { mediaSrcFileSchema } from '../../src/data/schema/mediaSrc.ts';
import { curateHit, curateHits } from './curate.ts';
import type { PlanHit } from './plan.ts';

const hit: PlanHit = {
  institution: 'Cleveland Museum of Art',
  sourceUrl: 'https://clevelandart.org/art/1944.90',
  creator: 'Rembrandt van Rijn (Dutch, 1606–1669)',
  title: 'Portrait of a Woman',
  date: '1635 or earlier',
  accession: '1944.90',
  culture: '',
  license: 'CC0',
  licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  kept: true,
  reason: 'CC0 and a creator are both in the payload',
};

describe('curate', () => {
  it('copies payload fields and does not claim the page was opened', () => {
    const row = curateHit(hit);
    expect(row?.id).toBe('cma_1944_90');
    expect(row?.sourceUrl).toBe(hit.sourceUrl);
    expect(row?.credit.accession).toBe('1944.90');
    expect(row?.depiction).toBe('later');
    expect(row?.caption).toContain('not opened');
    expect(curateHit({ ...hit, kept: false })).toBeUndefined();
    expect(curateHits([hit, hit])).toHaveLength(1);
  });

  it('writes a source list that validates and stays under the 120 target', () => {
    const file = mediaSrcFileSchema.parse(
      JSON.parse(readFileSync('src/data/media-src.json', 'utf8')),
    );
    expect(file.length).toBeGreaterThan(0);
    expect(file.length).toBeLessThan(120);
    expect(
      file.every(
        (row) => row.license === 'CC0' && row.licenseUrl.startsWith('https://'),
      ),
    ).toBe(true);
  });
});
