import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { FAMILY_SOURCES } from './migrate-v1-map.ts';
import { wordCount, type FamilyId } from '../src/data/schema/primitives.ts';
import type { Confidence, Importance, Polity } from '../src/data/schema/index.ts';

export const FAMILY_MINIMUM: Record<FamilyId, number> = {
  andean: 23,
  mesoamerican: 19,
  north_american: 14,
  sub_saharan: 35,
  nile_egyptian: 18,
  mesopotamian: 14,
  persian_iranian: 14,
  levantine_semitic: 14,
  greek_byzantine: 18,
  latin_west: 45,
  celtic_germanic_norse: 12,
  slavic_steppe: 14,
  islamic_arab: 12,
  turkic_mongol: 14,
  indian: 28,
  chinese: 32,
  korean_japanese: 28,
  southeast_oceanian: 28,
};

const FAMILY_XKEY: Record<FamilyId, string> = {
  andean: 'andean',
  mesoamerican: 'mesoamerica',
  north_american: 'north_america',
  sub_saharan: 'sub_saharan_africa',
  nile_egyptian: 'egypt_levant',
  mesopotamian: 'mesopotamia_persia',
  persian_iranian: 'mesopotamia_persia',
  levantine_semitic: 'egypt_levant',
  greek_byzantine: 'eastern_med_europe',
  latin_west: 'western_europe',
  celtic_germanic_norse: 'western_europe',
  slavic_steppe: 'eastern_med_europe',
  islamic_arab: 'egypt_levant',
  turkic_mongol: 'china_east_asia',
  indian: 'indus_india',
  chinese: 'china_east_asia',
  korean_japanese: 'austronesia_japan_sea',
  southeast_oceanian: 'austronesia_japan_sea',
};

export interface RosterRow {
  id: string;
  name: string;
  altNames?: string[];
  family: FamilyId;
  start: number;
  end: number;
  kind: Polity['kind'];
  confidence?: Confidence;
  importance?: Importance;
  dateNote?: string;
  endpoints?: { label: string; year: number; note?: string }[];
}

export function skeletonSummary(name: string): string {
  return `${name} is an Appendix B checklist skeleton. Dates are not re-verified.`;
}

export function skeletonPolity(row: RosterRow): Polity {
  const summary = skeletonSummary(row.name);
  if (wordCount(summary) > 30) throw new Error(`${row.id} summary exceeds 30 words`);
  if (row.start >= row.end) throw new Error(`${row.id} has an empty span`);
  const sources = FAMILY_SOURCES[row.family];
  if (!sources) throw new Error(`no sources for ${row.family}`);
  const polity: Polity = {
    id: row.id,
    name: row.name,
    family: row.family,
    start: row.start,
    end: row.end,
    confidence: row.confidence ?? 'approximate',
    dateNote: row.dateNote ?? 'Appendix B checklist span; not re-verified.',
    importance: row.importance ?? 2,
    weight: 0.35,
    kind: row.kind,
    anchor: [{ year: row.start, xKey: FAMILY_XKEY[row.family] }],
    summary,
    keyFacts: ['Checklist skeleton.'],
    sourceIds: [...sources],
    verification: 'unverified',
    evidence: 'Appendix B checklist. The cited pages were not opened for this row.',
  };
  if (row.altNames) polity.altNames = row.altNames;
  if (row.endpoints) polity.endpoints = row.endpoints;
  return polity;
}

const SKELETON_CHUNK = 12;

export function writeSkeleton(family: FamilyId, rows: RosterRow[]): Polity[] {
  const polities = rows.map(skeletonPolity);
  for (let index = 0; index < polities.length; index += SKELETON_CHUNK) {
    const part = index / SKELETON_CHUNK + 1;
    const suffix = part === 1 ? '' : `-${part}`;
    const file = path.join('src/data/polities', `${family}-skeleton${suffix}.json`);
    writeFileSync(
      file,
      `${JSON.stringify(polities.slice(index, index + SKELETON_CHUNK), null, 2)}\n`,
    );
  }
  return polities;
}

export function readPolityFile(file: string): Polity[] {
  return JSON.parse(readFileSync(file, 'utf8')) as Polity[];
}
