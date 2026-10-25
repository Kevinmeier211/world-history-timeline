import { familyIdSchema, type Polity } from '../src/data/schema/index.ts';
import { wordCount } from '../src/data/schema/primitives.ts';

export interface V1Span {
  regionId: string;
  startYear: number;
  endYear: number;
  weight: number;
}

export interface V1Polity {
  id: string;
  name: string;
  nativeOrAltName?: string;
  startYear: number;
  endYear: number;
  uncertaintyYears?: number;
  primaryRegionId: string;
  spans: V1Span[];
  governmentType?: string;
  rulers: { name: string; reign: string; title?: string }[];
  summary: string;
  keyAchievements: string[];
  wikipediaTitle?: string;
}

/** v1 column → v2 family. Mixed columns are corrected in `FAMILY_OVERRIDES`. */
export const REGION_FAMILY = {
  andean: 'andean',
  mesoamerica: 'mesoamerican',
  north_america: 'north_american',
  sub_saharan_africa: 'sub_saharan',
  western_europe: 'latin_west',
  eastern_med_europe: 'greek_byzantine',
  egypt_levant: 'nile_egyptian',
  mesopotamia_persia: 'persian_iranian',
  indus_india: 'indian',
  china_east_asia: 'chinese',
  austronesia_japan_sea: 'southeast_oceanian',
} as const;

export const REGION_MACRO = {
  andean: 'americas',
  mesoamerica: 'americas',
  north_america: 'americas',
  sub_saharan_africa: 'africa',
  western_europe: 'europe',
  eastern_med_europe: 'europe',
  egypt_levant: 'africa',
  mesopotamia_persia: 'west_central_asia',
  indus_india: 'south_asia',
  china_east_asia: 'east_asia',
  austronesia_japan_sea: 'se_asia_oceania',
} as const;

/** Rows whose v1 column is not their lineage. */
export const FAMILY_OVERRIDES: Record<string, (typeof familyIdSchema.options)[number]> =
  {
    megalithic_celts: 'celtic_germanic_norse',
    british_empire: 'celtic_germanic_norse',
    russia_soviet: 'slavic_steppe',
    hittites: 'mesopotamian',
    phoenicia_israel: 'levantine_semitic',
    ptolemaic_seleucid: 'greek_byzantine',
    umayyad_abbasid: 'islamic_arab',
    ottoman_empire: 'islamic_arab',
    sumer_akkad: 'mesopotamian',
    babylon_assyria: 'mesopotamian',
    neo_assyria_babylon: 'mesopotamian',
    mongol_empire: 'turkic_mongol',
    korea_dynasties: 'korean_japanese',
    japan_timeline: 'korean_japanese',
  };

const FAMILY_MACRO: Record<string, string> = {
  andean: 'americas',
  mesoamerican: 'americas',
  north_american: 'americas',
  sub_saharan: 'africa',
  nile_egyptian: 'africa',
  mesopotamian: 'west_central_asia',
  persian_iranian: 'west_central_asia',
  levantine_semitic: 'west_central_asia',
  greek_byzantine: 'europe',
  latin_west: 'europe',
  celtic_germanic_norse: 'europe',
  slavic_steppe: 'europe',
  islamic_arab: 'west_central_asia',
  turkic_mongol: 'west_central_asia',
  indian: 'south_asia',
  chinese: 'east_asia',
  korean_japanese: 'east_asia',
  southeast_oceanian: 'se_asia_oceania',
};

/** Two real bibliography pointers per family. Not a claim that the page was opened. */
const FAMILY_SOURCES: Record<string, [string, string]> = {
  andean: ['museo_larco', 'field_museum'],
  mesoamerican: ['inah', 'field_museum'],
  north_american: ['field_museum', 'dpla'],
  sub_saharan: ['unesco_gha', 'british_library'],
  nile_egyptian: ['louvre', 'unesco_gha'],
  mesopotamian: ['cdli', 'isac'],
  persian_iranian: ['isac', 'louvre'],
  levantine_semitic: ['louvre', 'british_library'],
  greek_byzantine: ['louvre', 'cambridge_histories'],
  latin_west: ['cambridge_histories', 'british_library'],
  celtic_germanic_norse: ['british_library', 'cambridge_histories'],
  slavic_steppe: ['cambridge_histories', 'british_library'],
  islamic_arab: ['unesco_gha', 'cambridge_histories'],
  turkic_mongol: ['cambridge_histories', 'unesco_mow'],
  indian: ['british_library', 'cambridge_histories'],
  chinese: ['chgis', 'cambridge_histories'],
  korean_japanese: ['korea_national', 'tokyo_national'],
  southeast_oceanian: ['field_museum', 'unesco_mow'],
};

export const MIGRATION_NOTE = 'Migrated from gemini-v1; not re-verified.';

export function familyForV1(polity: Pick<V1Polity, 'id' | 'primaryRegionId'>): string {
  return (
    FAMILY_OVERRIDES[polity.id] ??
    REGION_FAMILY[polity.primaryRegionId as keyof typeof REGION_FAMILY]
  );
}

export function kindFromV1(name: string, governmentType?: string): Polity['kind'] {
  const text = `${name} ${governmentType ?? ''}`.toLowerCase();
  if (/\bempire\b|caliphate/.test(text)) return 'empire';
  if (/confeder/.test(text)) return 'confederation';
  if (/culture|tradition|horizon|megalith/.test(text)) return 'culture';
  if (/\bpeople\b|tribes|nations/.test(text)) return 'people';
  if (/republic|kingdom|viceroyalty|dynasty|sultanate/.test(text)) return 'state';
  return 'period';
}

export function clipWords(text: string, max: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, max).join(' ');
}

export function migratePolity(polity: V1Polity): Polity {
  const family = familyForV1(polity);
  if (!family)
    throw new Error(`no family for ${polity.id} (${polity.primaryRegionId})`);
  const sources = FAMILY_SOURCES[family];
  if (!sources) throw new Error(`no sources for family ${family}`);
  const home = FAMILY_MACRO[family];
  const extra = new Map<string, { start: number; end: number }>();
  let weight = 0.4;
  for (const span of polity.spans) {
    weight = Math.max(weight, span.weight);
    const macro = REGION_MACRO[span.regionId as keyof typeof REGION_MACRO];
    if (!macro || macro === home || span.startYear >= span.endYear) continue;
    const prior = extra.get(macro);
    if (!prior) extra.set(macro, { start: span.startYear, end: span.endYear });
    else {
      prior.start = Math.min(prior.start, span.startYear);
      prior.end = Math.max(prior.end, span.endYear);
    }
  }
  const summary = clipWords(polity.summary, 60);
  const keyFacts = polity.keyAchievements.map((fact) => fact.trim()).filter(Boolean);
  const migrated: Polity = {
    id: polity.id,
    name: polity.name,
    family: family as Polity['family'],
    start: polity.startYear,
    end: polity.endYear,
    confidence: 'approximate',
    dateNote: MIGRATION_NOTE,
    importance: 3,
    weight: Math.min(1, Math.max(0.05, weight)),
    kind: kindFromV1(polity.name, polity.governmentType),
    anchor: [{ year: polity.startYear, xKey: polity.primaryRegionId }],
    summary: summary || 'Migrated from gemini-v1 without a summary.',
    keyFacts: keyFacts.length > 0 ? keyFacts : ['Migrated from gemini-v1.'],
    sourceIds: [...sources],
    verification: 'unverified',
    evidence:
      'Bibliography pointers only. The cited pages were not opened for this row.',
  };
  if (polity.nativeOrAltName) migrated.altNames = [polity.nativeOrAltName];
  if (polity.uncertaintyYears !== undefined)
    migrated.startUncertainty = polity.uncertaintyYears;
  if (polity.rulers.length > 0) migrated.rulers = polity.rulers;
  if (polity.wikipediaTitle) migrated.wikipediaTitle = polity.wikipediaTitle;
  const spans = [...extra.entries()]
    .filter(([, range]) => range.start < range.end)
    .map(([macroRegion, range]) => ({
      macroRegion: macroRegion as NonNullable<Polity['spans']>[number]['macroRegion'],
      start: range.start,
      end: range.end,
    }));
  if (spans.length > 0) migrated.spans = spans;
  if (wordCount(migrated.summary) > 60) {
    throw new Error(`${polity.id} summary still exceeds 60 words`);
  }
  return migrated;
}
