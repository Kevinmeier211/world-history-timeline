import type { Relation, RelationType } from './schema/index.ts';
import { CHECKLIST_TWINS } from './lineage-twins.ts';
import { RELATION_YEAR_TOLERANCE } from './validate.ts';
import { toT } from '../lib/years.ts';

export { CHECKLIST_TWINS };

/** Shared boundary, or one empty year when no checklist row is still current. */
export const ABUTMENT_GAP = 1;

export interface LineagePolity {
  id: string;
  family: string;
  start: number;
  end: number;
  sourceIds: readonly string[];
  /** v1 bundle kept beside the checklist. It does not block a one-year handoff. */
  overlay?: boolean;
}

export interface ParentLink {
  id: string;
  parentIds: readonly string[];
}

export interface TwinLink {
  from: string;
  to: string;
  note: string;
}

export interface SkippedParent {
  parent: string;
  child: string;
  reason: 'missing-parent' | 'missing-child' | 'no-shared-year';
}

export interface RootEntry {
  id: string;
  reason: string;
}

export interface LineageResult {
  relations: Relation[];
  roots: RootEntry[];
  skippedParents: SkippedParent[];
}

const SUCCESSION_NOTE =
  'Unique same-family handoff on a shared year, or across one empty year. Pages were not opened.';
const SPLIT_NOTE =
  'Several same-family polities start on this handoff. Pages were not opened.';
const DISPUTED_NOTE =
  'More than one same-family polity meets this start. No single predecessor was chosen. Pages were not opened.';
const V1_NOTE =
  'Copied from gemini-v1 parentIds. Typed cultural continuity because v1 did not classify the edge. Pages were not opened.';

function gap(end: number, start: number): number {
  return toT(start) - toT(end);
}

function contains(polity: LineagePolity, year: number): boolean {
  return (
    year !== 0 &&
    year >= polity.start - RELATION_YEAR_TOLERANCE &&
    year <= polity.end + RELATION_YEAR_TOLERANCE
  );
}

function pickYear(
  from: readonly LineagePolity[],
  to: readonly LineagePolity[],
): number | null {
  const preferred = [
    ...to.map((polity) => polity.start),
    ...from.map((polity) => polity.end),
  ];
  for (const year of preferred) {
    if (
      from.every((polity) => contains(polity, year)) &&
      to.every((polity) => contains(polity, year))
    )
      return year;
  }
  return null;
}

function relation(input: {
  id: string;
  from: string[];
  to: string[];
  year: number;
  type: RelationType;
  note: string;
  sourceIds: readonly string[];
}): Relation {
  if (input.sourceIds.length === 0) throw new Error(`${input.id} has no sources`);
  return {
    id: input.id,
    from: input.from,
    to: input.to,
    year: input.year,
    type: input.type,
    note: input.note,
    sourceIds: [...input.sourceIds],
    confidence: 'debated',
    verification: 'unverified',
    evidence: input.note,
  };
}

function checklistCurrent(
  rows: readonly LineagePolity[],
  polity: LineagePolity,
): boolean {
  return rows.some(
    (other) =>
      other.id !== polity.id &&
      !other.overlay &&
      toT(other.start) <= toT(polity.start) &&
      toT(other.end) >= toT(polity.start),
  );
}

function abutmentPreds(
  rows: readonly LineagePolity[],
  succ: LineagePolity,
): LineagePolity[] {
  const open = !checklistCurrent(rows, succ);
  return rows
    .filter((pred) => {
      if (pred.id === succ.id || toT(pred.start) >= toT(succ.start)) return false;
      const distance = gap(pred.end, succ.start);
      if (distance === 0) return true;
      return open && distance === ABUTMENT_GAP;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function abutmentRelations(polities: readonly LineagePolity[]): Relation[] {
  const byFamily = new Map<string, LineagePolity[]>();
  for (const polity of polities) {
    const rows = byFamily.get(polity.family);
    if (rows) rows.push(polity);
    else byFamily.set(polity.family, [polity]);
  }
  const relations: Relation[] = [];
  const singles: { from: LineagePolity; to: LineagePolity }[] = [];
  for (const rows of byFamily.values()) {
    for (const succ of rows) {
      const preds = abutmentPreds(rows, succ);
      const first = preds[0];
      if (!first) continue;
      if (preds.length > 1) {
        const year = pickYear(preds, [succ]);
        if (year === null) continue;
        relations.push(
          relation({
            id: `disputed_${succ.id}`,
            from: preds.map((pred) => pred.id),
            to: [succ.id],
            year,
            type: 'disputed',
            note: DISPUTED_NOTE,
            sourceIds: succ.sourceIds,
          }),
        );
      } else singles.push({ from: first, to: succ });
    }
  }
  const groups = new Map<string, { from: LineagePolity; to: LineagePolity[] }>();
  for (const pair of singles) {
    const group = groups.get(pair.from.id) ?? { from: pair.from, to: [] };
    group.to.push(pair.to);
    groups.set(pair.from.id, group);
  }
  for (const group of groups.values()) {
    const targets = group.to.sort((a, b) => a.id.localeCompare(b.id));
    const first = targets[0];
    if (!first) continue;
    if (targets.length === 1) {
      const year = pickYear([group.from], [first]);
      if (year === null) continue;
      relations.push(
        relation({
          id: `abut_${group.from.id}_${first.id}`,
          from: [group.from.id],
          to: [first.id],
          year,
          type: 'succession',
          note: SUCCESSION_NOTE,
          sourceIds: first.sourceIds,
        }),
      );
      continue;
    }
    const shared = pickYear([group.from], targets);
    if (shared !== null) {
      relations.push(
        relation({
          id: `split_${group.from.id}_${targets.map((polity) => polity.id).join('_')}`,
          from: [group.from.id],
          to: targets.map((polity) => polity.id),
          year: shared,
          type: 'split',
          note: SPLIT_NOTE,
          sourceIds: first.sourceIds,
        }),
      );
      continue;
    }
    for (const succ of targets) {
      const year = pickYear([group.from], [succ]);
      if (year === null) continue;
      relations.push(
        relation({
          id: `abut_${group.from.id}_${succ.id}`,
          from: [group.from.id],
          to: [succ.id],
          year,
          type: 'succession',
          note: SUCCESSION_NOTE,
          sourceIds: succ.sourceIds,
        }),
      );
    }
  }
  return relations;
}

function pairSet(relations: readonly Relation[]): Set<string> {
  const pairs = new Set<string>();
  for (const item of relations) {
    for (const source of item.from) {
      for (const target of item.to) pairs.add(`${source}>${target}`);
    }
  }
  return pairs;
}

function rootReason(
  polity: LineagePolity,
  rows: readonly LineagePolity[],
  parentIds: readonly string[],
): string {
  const named =
    parentIds.length > 0
      ? `gemini-v1 parents ${[...parentIds].sort().join(', ')} have no year inside both lifetimes ± ${RELATION_YEAR_TOLERANCE}`
      : 'gemini-v1 names no parent';
  const ends = rows
    .filter((other) => other.id !== polity.id && toT(other.start) < toT(polity.start))
    .map((other) => ({ id: other.id, distance: gap(other.end, polity.start) }))
    .filter((item) => item.distance >= 0)
    .sort((a, b) => a.distance - b.distance || a.id.localeCompare(b.id));
  const nearest = ends[0];
  if (!nearest)
    return `${named}; no earlier same-family polity ends on or before this start.`;
  const tied = ends
    .filter((item) => item.distance === nearest.distance)
    .map((item) => item.id);
  const openGap = nearest.distance === ABUTMENT_GAP && !checklistCurrent(rows, polity);
  if (nearest.distance === 0 || openGap) {
    return `${named}; same-family end ${tied.join(', ')} meets this start but no relation year fits both lifetimes.`;
  }
  if (nearest.distance === ABUTMENT_GAP) {
    return `${named}; nearest same-family end is ${tied.join(', ')} at a gap of 1 continuous year, while other polities in the family are still current.`;
  }
  return `${named}; nearest same-family end is ${tied.join(', ')} at a gap of ${nearest.distance} continuous years, outside a shared-boundary handoff.`;
}

export function buildLineage(
  polities: readonly LineagePolity[],
  parents: readonly ParentLink[],
  twins: readonly TwinLink[] = CHECKLIST_TWINS,
): LineageResult {
  const byId = new Map(polities.map((polity) => [polity.id, polity]));
  const relations = abutmentRelations(polities);
  const seen = pairSet(relations);
  const skippedParents: SkippedParent[] = [];
  const parentIds = new Map<string, string[]>();

  for (const link of parents) {
    const child = byId.get(link.id);
    const uniqueParents = [...new Set(link.parentIds)].sort();
    if (!child) {
      for (const parent of uniqueParents) {
        skippedParents.push({ parent, child: link.id, reason: 'missing-child' });
      }
      continue;
    }
    parentIds.set(child.id, uniqueParents);
    for (const parentId of uniqueParents) {
      const parent = byId.get(parentId);
      if (!parent || parent.id === child.id) {
        skippedParents.push({
          parent: parentId,
          child: child.id,
          reason: 'missing-parent',
        });
        continue;
      }
      if (seen.has(`${parent.id}>${child.id}`)) continue;
      const year = pickYear([parent], [child]);
      if (year === null) {
        skippedParents.push({
          parent: parent.id,
          child: child.id,
          reason: 'no-shared-year',
        });
        continue;
      }
      relations.push(
        relation({
          id: `v1_${parent.id}_${child.id}`,
          from: [parent.id],
          to: [child.id],
          year,
          type: 'cultural_continuity',
          note: V1_NOTE,
          sourceIds: child.sourceIds,
        }),
      );
      seen.add(`${parent.id}>${child.id}`);
    }
  }

  for (const twin of twins) {
    const from = byId.get(twin.from);
    const to = byId.get(twin.to);
    if (!from || !to || from.id === to.id || seen.has(`${twin.from}>${twin.to}`))
      continue;
    const year = pickYear([from], [to]);
    if (year === null) continue;
    relations.push(
      relation({
        id: `twin_${twin.from}_${twin.to}`,
        from: [twin.from],
        to: [twin.to],
        year,
        type: 'cultural_continuity',
        note: twin.note,
        sourceIds: to.sourceIds,
      }),
    );
    seen.add(`${twin.from}>${twin.to}`);
  }

  const inbound = new Set(relations.flatMap((item) => item.to));
  const roots = polities
    .filter((polity) => !inbound.has(polity.id))
    .map((polity) => ({
      id: polity.id,
      reason: rootReason(
        polity,
        polities.filter((other) => other.family === polity.family),
        parentIds.get(polity.id) ?? [],
      ),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  relations.sort((a, b) => a.id.localeCompare(b.id));
  skippedParents.sort(
    (a, b) => a.child.localeCompare(b.child) || a.parent.localeCompare(b.parent),
  );
  return { relations, roots, skippedParents };
}
