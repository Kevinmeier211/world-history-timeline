import {
  FAMILY_SOURCES,
  REGION_FAMILY,
  REGION_MACRO,
  clipWords,
  type V1Polity,
} from './migrate-v1-map.ts';
import type { Band, Callout, Preset, Route, Tour } from '../src/data/schema/index.ts';

export const MIGRATED_EVIDENCE =
  'Migrated from gemini-v1. Bibliography pointer only; the page was not opened for this row.';

/** Poster-x inside the geography zone for that v1 column. Not a longitude. */
export const REGION_POSTER_X: Record<keyof typeof REGION_FAMILY, number> = {
  andean: 0.08,
  mesoamerica: 0.11,
  north_america: 0.05,
  sub_saharan_africa: 0.27,
  western_europe: 0.28,
  eastern_med_europe: 0.42,
  egypt_levant: 0.38,
  mesopotamia_persia: 0.52,
  indus_india: 0.69,
  china_east_asia: 0.83,
  austronesia_japan_sea: 0.93,
};

const ALL_MACROS = [
  'americas',
  'europe',
  'africa',
  'west_central_asia',
  'south_asia',
  'east_asia',
  'se_asia_oceania',
] as const;

const CALLOUT_KIND = {
  MONUMENT: 'monument',
  ARTIFACT: 'monument',
  WAR: 'event',
  RULER: 'person',
  INVENTION: 'invention',
  PHILOSOPHY: 'text',
  CLIMATE: 'climate',
  TRADE: 'trade',
} as const;

const BAND_TYPE = {
  CLIMATE: 'climate',
  COLLAPSE: 'collapse',
  GOLDEN_AGE: 'golden_age',
  PANDEMIC: 'pandemic',
  EPOCH: 'epoch',
  GLOBAL_WAR: 'war',
} as const;

const ROUTE_TYPE = {
  TRADE: 'trade',
  MIGRATION: 'migration',
  CULTURAL: 'cultural',
} as const;

const LENS = {
  GEOPOLITICS: 'politics',
  TRADE_MIGRATION: 'trade',
  CLIMATE_PANDEMIC: 'climate',
  SCIENCE_WRITING: 'technology',
  PHILOSOPHY_ART: 'art',
} as const;

const IMPORTANCE = { 1: 4, 2: 3, 3: 2 } as const;

export interface V1Node {
  id: string;
  title: string;
  year: number;
  endYear?: number;
  regionId: string;
  polityId?: string;
  category: keyof typeof CALLOUT_KIND;
  minZoomTier: 1 | 2 | 3;
  description: string;
  significance: string;
}

export interface V1Band {
  id: string;
  title: string;
  startYear: number;
  endYear: number;
  type: keyof typeof BAND_TYPE;
  regionIds: string[];
  description: string;
}

export interface V1Route {
  id: string;
  name: string;
  type: keyof typeof ROUTE_TYPE;
  startYear: number;
  endYear: number;
  waypoints: { regionId: string; year: number; label?: string }[];
  description: string;
  commodities: string[];
}

export interface V1Tour {
  id: string;
  title: string;
  subtitle: string;
  waypoints: {
    title: string;
    year: number;
    selectedPolityId?: string;
    selectedNodeId?: string;
    zoomLevel: number;
    lens?: string;
    narrative: string;
  }[];
}

export interface V1Preset {
  id: string;
  name: string;
  description: string;
  regionIds: string[];
  focusYear?: number;
}

export interface V1ClimatePoint {
  year: number;
  tempDeltaC: number;
  label?: string;
}

function sourceForRegion(regionId: string): string {
  const family = REGION_FAMILY[regionId as keyof typeof REGION_FAMILY];
  const pair = family ? FAMILY_SOURCES[family] : undefined;
  if (!pair) throw new Error(`no source for region ${regionId}`);
  return pair[0];
}

function macrosFor(regionIds: string[]): string[] {
  const macros = new Set<string>();
  for (const regionId of regionIds) {
    const macro = REGION_MACRO[regionId as keyof typeof REGION_MACRO];
    if (!macro) throw new Error(`no macro for region ${regionId}`);
    macros.add(macro);
  }
  return ALL_MACROS.filter((macro) => macros.has(macro));
}

export function migrateNode(node: V1Node, polityIds: ReadonlySet<string>): Callout {
  const blurb = clipWords(node.significance || node.description, 14);
  const callout: Callout = {
    id: node.id,
    title: node.title,
    year: node.year,
    kind: CALLOUT_KIND[node.category],
    importance: IMPORTANCE[node.minZoomTier],
    blurb: blurb || 'Migrated from gemini-v1.',
    sourceIds: [sourceForRegion(node.regionId)],
    confidence: 'approximate',
    verification: 'unverified',
    evidence: MIGRATED_EVIDENCE,
  };
  if (node.endYear !== undefined) callout.endYear = node.endYear;
  if (node.polityId && polityIds.has(node.polityId)) callout.attachTo = node.polityId;
  return callout;
}

export function migrateBand(band: V1Band): Band {
  const macros = macrosFor(band.regionIds);
  return {
    id: band.id,
    title: band.title,
    start: band.startYear,
    end: band.endYear,
    scope: macros.length >= ALL_MACROS.length ? 'global' : (macros as Band['scope']),
    type: BAND_TYPE[band.type],
    importance: 3,
    description: clipWords(band.description, 60),
    sourceIds: ['cambridge_histories', 'unesco_gha'],
    verification: 'unverified',
    evidence: MIGRATED_EVIDENCE,
  };
}

export function migrateRoute(route: V1Route): Route {
  return {
    id: route.id,
    name: route.name,
    type: ROUTE_TYPE[route.type],
    start: route.startYear,
    end: route.endYear,
    waypoints: route.waypoints.map((waypoint) => {
      const x = REGION_POSTER_X[waypoint.regionId as keyof typeof REGION_POSTER_X];
      if (x === undefined) throw new Error(`no poster x for ${waypoint.regionId}`);
      return { year: waypoint.year, x, label: waypoint.label ?? waypoint.regionId };
    }),
    description: clipWords(route.description, 40),
    commodities: route.commodities,
    importance: 3,
    sourceIds: ['cambridge_histories'],
    confidence: 'approximate',
    verification: 'unverified',
    evidence: MIGRATED_EVIDENCE,
  };
}

export function migrateTour(tour: V1Tour): Tour {
  return {
    id: tour.id,
    title: tour.title,
    subtitle: tour.subtitle,
    waypoints: tour.waypoints.map((waypoint) => ({
      title: waypoint.title,
      year: waypoint.year,
      zoom: waypoint.zoomLevel,
      ...(waypoint.lens && waypoint.lens in LENS
        ? { lens: LENS[waypoint.lens as keyof typeof LENS] }
        : {}),
      ...(waypoint.selectedPolityId ? { polityId: waypoint.selectedPolityId } : {}),
      ...(waypoint.selectedNodeId ? { calloutId: waypoint.selectedNodeId } : {}),
      narrative: clipWords(waypoint.narrative, 70),
      sourceIds: ['cambridge_histories'],
      verification: 'unverified' as const,
    })),
  };
}

export function migratePreset(preset: V1Preset): Preset {
  const migrated: Preset = {
    id: preset.id,
    name: preset.name,
    description: preset.description,
    macroRegions: macrosFor(preset.regionIds) as Preset['macroRegions'],
    evidence: MIGRATED_EVIDENCE,
  };
  if (preset.focusYear !== undefined && preset.focusYear !== 0)
    migrated.year = preset.focusYear;
  return migrated;
}

export function migrateClimate(points: V1ClimatePoint[]) {
  return {
    baseline: 'Degrees Celsius relative to 1900, as recorded on gemini-v1.',
    verification: 'unverified' as const,
    evidence:
      'Curve copied from gemini-v1 PALEOCLIMATE_CURVE. Temperatures were not re-checked.',
    points,
  };
}

export function polityIdsFrom(polities: Pick<V1Polity, 'id'>[]): Set<string> {
  return new Set(polities.map((polity) => polity.id));
}
