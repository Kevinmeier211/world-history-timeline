import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { wordCount } from './schema/primitives.ts';

const EUROPE = [
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

const AMERICAS = [
  'haudenosaunee',
  'united_states',
  'canada',
  'russian_america',
  'mexico',
  'united_provinces_central_america',
  'guatemala',
  'el_salvador',
  'honduras',
  'nicaragua',
  'costa_rica',
  'argentina',
  'chile',
  'peru_republic',
  'bolivia',
  'ecuador',
  'colombia',
  'venezuela',
  'paraguay',
  'uruguay',
] as const;

const SOURCES: Record<string, readonly string[]> = {
  ...Object.fromEntries(
    EUROPE.map((id) => [id, ['cambridge_histories', 'british_library']]),
  ),
  ...Object.fromEntries(
    ['haudenosaunee', 'united_states', 'canada', 'russian_america'].map((id) => [
      id,
      ['field_museum', 'dpla'],
    ]),
  ),
  ...Object.fromEntries(
    [
      'mexico',
      'united_provinces_central_america',
      'guatemala',
      'el_salvador',
      'honduras',
      'nicaragua',
      'costa_rica',
    ].map((id) => [id, ['inah', 'field_museum']]),
  ),
  ...Object.fromEntries(
    [
      'argentina',
      'chile',
      'peru_republic',
      'bolivia',
      'ecuador',
      'colombia',
      'venezuela',
      'paraguay',
      'uruguay',
    ].map((id) => [id, ['museo_larco', 'field_museum']]),
  ),
};

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
    'src/data/polities/north_american-skeleton.json',
    'src/data/polities/mesoamerican-skeleton.json',
    'src/data/polities/andean-skeleton.json',
  ];
  return files.flatMap((file) => JSON.parse(readFileSync(file, 'utf8')) as Row[]);
}

describe('1800 fan-out prose', () => {
  it('keeps the written rows unverified and inside 60 words', () => {
    const byId = new Map(rows().map((row) => [row.id, row]));
    for (const id of [...EUROPE, ...AMERICAS]) {
      const row = byId.get(id);
      expect(row, id).toBeTruthy();
      expect(wordCount(row?.summary ?? ''), id).toBeLessThanOrEqual(60);
      expect(wordCount(row?.summary ?? ''), id).toBeGreaterThan(0);
      expect(row?.keyFacts.length, id).toBeGreaterThanOrEqual(2);
      expect(row?.keyFacts.length, id).toBeLessThanOrEqual(4);
      expect(row?.summary, id).not.toMatch(/checklist skeleton/);
      expect(row?.verification, id).toBe('unverified');
      expect(row?.evidence, id).toContain('not opened');
      expect(row?.sourceIds, id).toEqual(SOURCES[id]);
    }
  });
});
