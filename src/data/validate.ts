import { toT } from '../lib/years.ts';
import { ERA_BINS } from './catalog.ts';
import { macroRegionSchema, wordCount } from './schema/primitives.ts';
import {
  datasetSchema,
  type Dataset,
  type Polity,
  type Source,
} from './schema/index.ts';

export const RELATION_YEAR_TOLERANCE = 50;

export interface ValidationIssue {
  level: 'error' | 'warning';
  message: string;
}

export interface CoverageReport {
  byEra: Record<string, number>;
  byFamily: Record<string, number>;
  byMacroRegion: Record<string, number>;
  byImportance: Record<string, number>;
}

export interface LaneColorPair {
  leftColor: string;
  rightColor: string;
}

function push(
  issues: ValidationIssue[],
  level: ValidationIssue['level'],
  message: string,
): void {
  issues.push({ level, message });
}

function duplicates(ids: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  return [...dupes];
}

function withinLife(polity: Polity, year: number): boolean {
  return (
    year >= polity.start - RELATION_YEAR_TOLERANCE &&
    year <= polity.end + RELATION_YEAR_TOLERANCE
  );
}

function overlapsEra(polity: Polity, start: number, end: number): boolean {
  return toT(polity.start) <= toT(end) && toT(polity.end) >= toT(start);
}

function isWikipedia(source: Source): boolean {
  return (
    source.id.startsWith('wikipedia') ||
    /wikipedia/i.test(source.publisher) ||
    /wikipedia\.org/i.test(source.url)
  );
}

export function coverageOf(dataset: Dataset): CoverageReport {
  const byEra: Record<string, number> = {};
  for (const era of ERA_BINS) byEra[era.id] = 0;
  const byFamily: Record<string, number> = {};
  const byMacroRegion: Record<string, number> = {};
  for (const region of macroRegionSchema.options) byMacroRegion[region] = 0;
  const byImportance: Record<string, number> = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
  };
  const familyRegion = new Map(
    dataset.families.map((family) => [family.id, family.macroRegion]),
  );
  for (const polity of dataset.polities) {
    byFamily[polity.family] = (byFamily[polity.family] ?? 0) + 1;
    byImportance[String(polity.importance)] =
      (byImportance[String(polity.importance)] ?? 0) + 1;
    const regions = new Set<string>();
    const home = familyRegion.get(polity.family);
    if (home) regions.add(home);
    for (const span of polity.spans ?? []) regions.add(span.macroRegion);
    for (const region of regions) {
      byMacroRegion[region] = (byMacroRegion[region] ?? 0) + 1;
    }
    for (const era of ERA_BINS) {
      if (overlapsEra(polity, era.start, era.end))
        byEra[era.id] = (byEra[era.id] ?? 0) + 1;
    }
  }
  return { byEra, byFamily, byMacroRegion, byImportance };
}

/** Adjacent-lane color rule from §6.3. Layout supplies the pairs (T2). */
export function adjacentLaneColorWarnings(
  pairs: readonly LaneColorPair[],
): ValidationIssue[] {
  if (pairs.length === 0) return [];
  let same = 0;
  for (const pair of pairs) {
    if (pair.leftColor.toLowerCase() === pair.rightColor.toLowerCase()) same += 1;
  }
  if (same / pairs.length > 0.25) {
    return [
      {
        level: 'warning',
        message: `adjacent lanes repeat a family color on ${same}/${pairs.length} edges (>25%)`,
      },
    ];
  }
  return [];
}

function requireSources(
  issues: ValidationIssue[],
  label: string,
  ids: readonly string[],
  known: ReadonlySet<string>,
): void {
  for (const sourceId of ids) {
    if (!known.has(sourceId))
      push(issues, 'error', `${label} source ${sourceId} missing`);
  }
}

function warnWikipediaOnly(
  issues: ValidationIssue[],
  label: string,
  importance: number,
  ids: readonly string[],
  sources: ReadonlyMap<string, Source>,
): void {
  if (importance < 3 || ids.length === 0) return;
  const cited = ids
    .map((id) => sources.get(id))
    .filter((source) => source !== undefined);
  if (cited.length === ids.length && cited.every((source) => isWikipedia(source))) {
    push(issues, 'warning', `${label} importance ${importance} cites only Wikipedia`);
  }
}

export function validateDataset(input: unknown): {
  issues: ValidationIssue[];
  dataset: Dataset | null;
  coverage: CoverageReport | null;
} {
  const parsed = datasetSchema.safeParse(input);
  if (!parsed.success) {
    return {
      issues: parsed.error.issues.map((issue) => ({
        level: 'error' as const,
        message: `${issue.path.join('.') || 'dataset'}: ${issue.message}`,
      })),
      dataset: null,
      coverage: null,
    };
  }
  const dataset = parsed.data;
  const issues: ValidationIssue[] = [];
  const groups = [
    ['family', dataset.families.map((item) => item.id)],
    ['polity', dataset.polities.map((item) => item.id)],
    ['relation', dataset.relations.map((item) => item.id)],
    ['callout', dataset.callouts.map((item) => item.id)],
    ['band', dataset.bands.map((item) => item.id)],
    ['route', dataset.routes.map((item) => item.id)],
    ['source', dataset.sources.map((item) => item.id)],
    ['media', dataset.media.map((item) => item.id)],
    ['tour', dataset.tours.map((item) => item.id)],
    ['preset', dataset.presets.map((item) => item.id)],
  ] as const;
  for (const [label, ids] of groups) {
    for (const id of duplicates(ids))
      push(issues, 'error', `duplicate ${label} id ${id}`);
  }
  for (const key of duplicates(
    dataset.notes.map((note) => `${note.eraId}:${note.macroRegion}`),
  )) {
    push(issues, 'error', `duplicate era note ${key}`);
  }

  const sourceIds = new Set(dataset.sources.map((source) => source.id));
  const sources = new Map(dataset.sources.map((source) => [source.id, source]));
  const mediaIds = new Set(dataset.media.map((item) => item.id));
  const familyIds = new Set(dataset.families.map((family) => family.id));
  const polities = new Map(dataset.polities.map((polity) => [polity.id, polity]));

  for (const source of dataset.sources) {
    if (source.url === '')
      push(issues, 'warning', `source ${source.id} has an empty url`);
  }

  for (const relation of dataset.relations) {
    for (const id of [...relation.from, ...relation.to]) {
      const polity = polities.get(id);
      if (!polity) {
        push(issues, 'error', `relation ${relation.id} endpoint ${id} does not exist`);
        continue;
      }
      if (!withinLife(polity, relation.year)) {
        push(
          issues,
          'error',
          `relation ${relation.id} year ${relation.year} is outside ${id}`,
        );
      }
    }
    requireSources(issues, `relation ${relation.id}`, relation.sourceIds, sourceIds);
  }

  for (const polity of dataset.polities) {
    if (!familyIds.has(polity.family))
      push(issues, 'error', `${polity.id} family ${polity.family} missing`);
    if (wordCount(polity.summary) > 60)
      push(issues, 'error', `${polity.id} summary exceeds 60 words`);
    requireSources(issues, polity.id, polity.sourceIds, sourceIds);
    warnWikipediaOnly(issues, polity.id, polity.importance, polity.sourceIds, sources);
    if (polity.mediaId && !mediaIds.has(polity.mediaId))
      push(issues, 'error', `${polity.id} media ${polity.mediaId} missing`);
    if (polity.start < -1000 && polity.sourceIds.length < 2) {
      push(
        issues,
        'warning',
        `${polity.id} before 1000 BCE has fewer than two sources`,
      );
    }
  }

  for (const callout of dataset.callouts) {
    if (wordCount(callout.blurb) > 14)
      push(issues, 'error', `${callout.id} blurb exceeds 14 words`);
    requireSources(issues, callout.id, callout.sourceIds, sourceIds);
    warnWikipediaOnly(
      issues,
      callout.id,
      callout.importance,
      callout.sourceIds,
      sources,
    );
    if (callout.attachTo && !polities.has(callout.attachTo))
      push(issues, 'error', `${callout.id} attachTo ${callout.attachTo} missing`);
    if (callout.mediaId && !mediaIds.has(callout.mediaId))
      push(issues, 'error', `${callout.id} media ${callout.mediaId} missing`);
  }

  for (const band of dataset.bands)
    requireSources(issues, band.id, band.sourceIds, sourceIds);
  for (const route of dataset.routes)
    requireSources(issues, route.id, route.sourceIds, sourceIds);
  for (const note of dataset.notes) {
    for (const entry of note.entries)
      requireSources(issues, `note ${note.eraId}`, entry.sourceIds, sourceIds);
  }
  for (const tour of dataset.tours) {
    for (const waypoint of tour.waypoints)
      requireSources(issues, `tour ${tour.id}`, waypoint.sourceIds, sourceIds);
  }

  const inbound = new Set(dataset.relations.flatMap((relation) => relation.to));
  for (const polity of dataset.polities) {
    if (!inbound.has(polity.id))
      push(issues, 'warning', `${polity.id} has no inbound relation`);
  }
  return { issues, dataset, coverage: coverageOf(dataset) };
}
