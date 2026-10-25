import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { wordCount, type FamilyId } from '../src/data/schema/primitives.ts';
import { politySchema } from '../src/data/schema/index.ts';
import { loadDataset } from './load-dataset.ts';
import { FAMILY_MINIMUM, skeletonPolity, skeletonSummary } from './roster.ts';
import { ROWS as ANDEAN } from './roster/andean.ts';

describe('skeleton rows', () => {
  it('keeps the checklist summary inside 30 words and the schema', () => {
    expect(
      wordCount(skeletonSummary('Viceroyalty of the Río de la Plata')),
    ).toBeLessThanOrEqual(30);
    for (const row of ANDEAN) {
      expect(politySchema.safeParse(skeletonPolity(row)).success).toBe(true);
      expect(row.family).toBe('andean');
    }
    expect(new Set(ANDEAN.map((row) => row.id)).size).toBe(ANDEAN.length);
  });

  it('meets the family minimum once a skeleton file exists', () => {
    const dataset = loadDataset() as { polities: { family: string }[] };
    const dir = 'src/data/polities';
    for (const name of readdirSync(dir)) {
      if (!name.endsWith('-skeleton.json')) continue;
      const family = name.slice(0, -'-skeleton.json'.length) as FamilyId;
      const minimum = FAMILY_MINIMUM[family];
      const count = dataset.polities.filter(
        (polity) => polity.family === family,
      ).length;
      expect(count, family).toBeGreaterThanOrEqual(minimum);
      const raw = JSON.parse(readFileSync(path.join(dir, name), 'utf8')) as unknown[];
      expect(existsSync(path.join(dir, name))).toBe(true);
      expect(raw.length).toBeGreaterThan(0);
    }
  });
});
