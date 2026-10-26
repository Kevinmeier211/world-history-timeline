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

const EUROPE_MORE = [
  'great_britain',
  'united_kingdom',
  'denmark',
  'sweden',
  'norway',
  'hre',
  'papal_states',
  'spain_after_habsburg',
  'portugal',
  'capetian_france',
  'greece',
  'russian_empire',
  'russia_1917',
  'ussr',
  'russia',
] as const;

const AFRICA = [
  'ethiopia_solomonic',
  'kongo',
  'oyo',
  'ashanti',
  'sokoto',
  'zulu',
  'european_partition_africa',
  'african_independence',
  'south_africa_union',
  'south_africa_apartheid',
  'ghana_republic',
  'nigeria',
  'senegal',
  'kenya',
  'tanzania',
  'angola',
  'congo_kinshasa',
  'kanem_bornu',
  'benin_kingdom',
  'ottoman_egypt',
  'muhammad_ali_egypt',
  'egypt_republic',
] as const;

const WEST_ASIA = [
  'ottoman',
  'saudi_arabia',
  'ottoman_levant',
  'levant_mandates',
  'israel',
  'syria',
  'lebanon',
  'jordan',
  'iraq',
  'qajar',
  'pahlavi',
  'islamic_republic_iran',
] as const;

const ASIA_PACIFIC = [
  'viceroyalty_new_granada',
  'rio_de_la_plata',
  'qing',
  'roc',
  'prc',
  'india_1857',
  'maratha',
  'sikh_empire',
  'british_raj',
  'india',
  'pakistan',
  'bangladesh',
  'mughal',
  'tokugawa',
  'meiji',
  'empire_of_japan',
  'japan',
  'ryukyu',
  'joseon',
  'korean_empire',
  'korea_under_japan',
  'korea_1945',
  'north_korea',
  'south_korea',
  'philippines',
  'dutch_east_indies',
  'indonesia',
  'thailand',
  'vietnam',
  'nsw_colony',
  'new_zealand',
  'australia',
  'pacific_microstates',
  'champa',
  'dai_viet',
  'konbaung',
  'nguyen',
  'spanish_philippines',
] as const;

const SOURCES: Record<string, readonly string[]> = {
  ...Object.fromEntries(
    EUROPE.map((id) => [id, ['cambridge_histories', 'british_library']]),
  ),
  ...Object.fromEntries(
    ['great_britain', 'united_kingdom', 'denmark', 'sweden', 'norway'].map((id) => [
      id,
      ['british_library', 'cambridge_histories'],
    ]),
  ),
  ...Object.fromEntries(
    [
      'hre',
      'papal_states',
      'spain_after_habsburg',
      'portugal',
      'capetian_france',
      'russian_empire',
      'russia_1917',
      'ussr',
      'russia',
    ].map((id) => [id, ['cambridge_histories', 'british_library']]),
  ),
  greece: ['louvre', 'cambridge_histories'],
  ...Object.fromEntries(
    AFRICA.filter(
      (id) => !['ottoman_egypt', 'muhammad_ali_egypt', 'egypt_republic'].includes(id),
    ).map((id) => [id, ['unesco_gha', 'british_library']]),
  ),
  ...Object.fromEntries(
    ['ottoman_egypt', 'muhammad_ali_egypt', 'egypt_republic'].map((id) => [
      id,
      ['louvre', 'unesco_gha'],
    ]),
  ),
  ...Object.fromEntries(
    ['ottoman', 'saudi_arabia'].map((id) => [
      id,
      ['unesco_gha', 'cambridge_histories'],
    ]),
  ),
  ...Object.fromEntries(
    [
      'ottoman_levant',
      'levant_mandates',
      'israel',
      'syria',
      'lebanon',
      'jordan',
      'iraq',
    ].map((id) => [id, ['louvre', 'british_library']]),
  ),
  ...Object.fromEntries(
    ['qajar', 'pahlavi', 'islamic_republic_iran'].map((id) => [id, ['isac', 'louvre']]),
  ),
  ...Object.fromEntries(
    ['viceroyalty_new_granada', 'rio_de_la_plata'].map((id) => [
      id,
      ['museo_larco', 'field_museum'],
    ]),
  ),
  ...Object.fromEntries(
    ['qing', 'roc', 'prc'].map((id) => [id, ['chgis', 'cambridge_histories']]),
  ),
  ...Object.fromEntries(
    [
      'india_1857',
      'maratha',
      'sikh_empire',
      'british_raj',
      'india',
      'pakistan',
      'bangladesh',
    ].map((id) => [id, ['british_library', 'cambridge_histories']]),
  ),
  mughal: ['cambridge_histories', 'unesco_mow'],
  ...Object.fromEntries(
    [
      'tokugawa',
      'meiji',
      'empire_of_japan',
      'japan',
      'ryukyu',
      'joseon',
      'korean_empire',
      'korea_under_japan',
      'korea_1945',
      'north_korea',
      'south_korea',
    ].map((id) => [id, ['korea_national', 'tokyo_national']]),
  ),
  ...Object.fromEntries(
    [
      'philippines',
      'dutch_east_indies',
      'indonesia',
      'thailand',
      'vietnam',
      'nsw_colony',
      'new_zealand',
      'australia',
      'pacific_microstates',
      'champa',
      'dai_viet',
      'konbaung',
      'nguyen',
      'spanish_philippines',
    ].map((id) => [id, ['field_museum', 'unesco_mow']]),
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
    'src/data/polities/andean-skeleton-2.json',
    'src/data/polities/celtic_germanic_norse-skeleton.json',
    'src/data/polities/latin_west-skeleton.json',
    'src/data/polities/greek_byzantine-skeleton-2.json',
    'src/data/polities/slavic_steppe-skeleton.json',
    'src/data/polities/sub_saharan-skeleton.json',
    'src/data/polities/sub_saharan-skeleton-2.json',
    'src/data/polities/sub_saharan-skeleton-3.json',
    'src/data/polities/nile_egyptian-skeleton-2.json',
    'src/data/polities/islamic_arab-skeleton.json',
    'src/data/polities/levantine_semitic-skeleton.json',
    'src/data/polities/levantine_semitic-skeleton-2.json',
    'src/data/polities/persian_iranian-skeleton.json',
    'src/data/polities/chinese-skeleton-3.json',
    'src/data/polities/indian-skeleton-2.json',
    'src/data/polities/turkic_mongol-skeleton.json',
    'src/data/polities/korean_japanese-skeleton.json',
    'src/data/polities/korean_japanese-skeleton-2.json',
    'src/data/polities/korean_japanese-skeleton-3.json',
    'src/data/polities/southeast_oceanian-skeleton.json',
    'src/data/polities/southeast_oceanian-skeleton-2.json',
    'src/data/polities/southeast_oceanian-skeleton-3.json',
  ];
  return files.flatMap((file) => JSON.parse(readFileSync(file, 'utf8')) as Row[]);
}

describe('1800 fan-out prose', () => {
  it('keeps the written rows unverified and inside 60 words', () => {
    const byId = new Map(rows().map((row) => [row.id, row]));
    for (const id of [
      ...EUROPE,
      ...AMERICAS,
      ...EUROPE_MORE,
      ...AFRICA,
      ...WEST_ASIA,
      ...ASIA_PACIFIC,
    ]) {
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
