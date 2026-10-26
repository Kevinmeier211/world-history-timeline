import type { Relation } from './schema/index.ts';
import type { LineagePolity } from './lineage.ts';

/** Stop once the generated set reaches the §7 relation floor. */
export const RELATION_FLOOR = 450;

const OVERLAP_NOTE =
  'Both rows are current in this year. This edge does not name a succession or a conquest. Pages were not opened.';

const BLOCKED_TARGETS = new Set(['belgium', 'muromachi']);

interface OverlapCandidate {
  from: LineagePolity;
  to: LineagePolity;
  year: number;
}

function forbiddenPair(from: string, to: string): boolean {
  if (BLOCKED_TARGETS.has(to)) return true;
  if (
    (from === 'mughal' && to === 'mughal_empire') ||
    (from === 'mughal_empire' && to === 'mughal')
  ) {
    return true;
  }
  if (from === 'voc' && (to === 'thailand' || to === 'pacific_microstates')) {
    return true;
  }
  return from === 'habsburg_spain' && to === 'prussia';
}

function insideLife(polity: LineagePolity, year: number): boolean {
  return year !== 0 && year >= polity.start && year <= polity.end;
}

function candidates(
  polities: readonly LineagePolity[],
  seen: ReadonlySet<string>,
): OverlapCandidate[] {
  const byFamily = new Map<string, LineagePolity[]>();
  for (const polity of polities) {
    const rows = byFamily.get(polity.family);
    if (rows) rows.push(polity);
    else byFamily.set(polity.family, [polity]);
  }
  const found: OverlapCandidate[] = [];
  for (const rows of byFamily.values()) {
    for (const earlier of rows) {
      for (const later of rows) {
        if (earlier.id === later.id || earlier.start >= later.start) continue;
        if (later.clusterStart) continue;
        const year = later.start;
        if (!insideLife(earlier, year) || !insideLife(later, year)) continue;
        if (forbiddenPair(earlier.id, later.id)) continue;
        if (seen.has(`${earlier.id}>${later.id}`)) continue;
        if (later.sourceIds.length === 0) continue;
        found.push({ from: earlier, to: later, year });
      }
    }
  }
  found.sort((left, right) => {
    const leftAncient = left.year <= -2000 ? 1 : 0;
    const rightAncient = right.year <= -2000 ? 1 : 0;
    if (leftAncient !== rightAncient) return leftAncient - rightAncient;
    return `${left.from.id}>${left.to.id}`.localeCompare(
      `${right.from.id}>${right.to.id}`,
    );
  });
  return found;
}

/** Same-family overlap edges, capped so the relation count meets the floor. */
export function overlapRelations(
  polities: readonly LineagePolity[],
  seen: ReadonlySet<string>,
  needed: number,
  relate: (input: {
    id: string;
    from: string[];
    to: string[];
    year: number;
    type: 'cultural_continuity';
    note: string;
    sourceIds: readonly string[];
  }) => Relation,
): Relation[] {
  if (needed <= 0) return [];
  return candidates(polities, seen)
    .slice(0, needed)
    .map((item) =>
      relate({
        id: `overlap_${item.from.id}_${item.to.id}`,
        from: [item.from.id],
        to: [item.to.id],
        year: item.year,
        type: 'cultural_continuity',
        note: OVERLAP_NOTE,
        sourceIds: item.to.sourceIds,
      }),
    );
}
