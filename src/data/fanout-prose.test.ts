import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { wordCount } from './schema/primitives.ts';

const IDS = [
  'french_revolution',
  'first_french_republic',
  'first_french_empire',
  'belgium',
  'switzerland',
  'western_european_microstates',
  'prussia',
  'german_empire',
  'germany_1918',
  'weimar',
  'nazi_germany',
  'germany_1945',
  'east_germany',
  'west_germany',
  'germany',
  'italy',
  'netherlands',
  'austria_hungary',
  'austria',
  'hungary',
] as const;

interface Row {
  id: string;
  summary: string;
  keyFacts: string[];
  verification: string;
  evidence: string;
  sourceIds: string[];
}

function rows(): Row[] {
  const files = [
    'src/data/polities/latin_west-skeleton-2.json',
    'src/data/polities/latin_west-skeleton-3.json',
    'src/data/polities/latin_west-skeleton-4.json',
  ];
  return files.flatMap((file) => JSON.parse(readFileSync(file, 'utf8')) as Row[]);
}

describe('1800 fan-out prose', () => {
  it('keeps the Latin West rows unverified and inside 60 words', () => {
    const byId = new Map(rows().map((row) => [row.id, row]));
    for (const id of IDS) {
      const row = byId.get(id);
      expect(row, id).toBeTruthy();
      expect(wordCount(row?.summary ?? ''), id).toBeLessThanOrEqual(60);
      expect(wordCount(row?.summary ?? ''), id).toBeGreaterThan(0);
      expect(row?.keyFacts.length, id).toBeGreaterThanOrEqual(2);
      expect(row?.keyFacts.length, id).toBeLessThanOrEqual(4);
      expect(row?.summary, id).not.toMatch(/checklist skeleton/);
      expect(row?.verification, id).toBe('unverified');
      expect(row?.evidence, id).toContain('not opened');
      expect(row?.sourceIds, id).toEqual(['cambridge_histories', 'british_library']);
    }
  });
});
