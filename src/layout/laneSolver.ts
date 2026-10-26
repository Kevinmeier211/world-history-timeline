import {
  laneMass,
  LEFT_GUTTER,
  MIN_GAP,
  PLOT_WIDTH,
  ribbonWidth,
} from './constants.ts';
import {
  convergeParents,
  lineageSeedMap,
  type LineageRelation,
} from './lineageSeed.ts';

/** One ribbon in one time slice. `desiredX` is a design-px centerline. */
export interface LaneRibbon {
  id: string;
  familyId: string;
  weight: number;
  importance: number;
  desiredX: number;
}

/** Ribbons alive between two event years. */
export interface LaneSliceInput {
  start: number;
  end: number;
  ribbons: readonly LaneRibbon[];
}

/** Settled centerline for one ribbon. */
export interface SolvedLane {
  id: string;
  x: number;
  width: number;
}

/** One slice after ordering and relaxation. `lanes` is left to right. */
export interface SolvedSlice {
  start: number;
  end: number;
  lanes: readonly SolvedLane[];
}

const ITERATIONS = 40;
const OVERLAP_LIMIT = 0.5;
const GEO_PULL = 0.15;

function centerMin(width: number): number {
  return LEFT_GUTTER + width / 2;
}

function centerMax(width: number): number {
  return LEFT_GUTTER + PLOT_WIDTH - width / 2;
}

function clampCenter(x: number, width: number): number {
  const min = centerMin(width);
  const max = centerMax(width);
  if (min >= max) return (min + max) / 2;
  return Math.min(max, Math.max(min, x));
}

function compareRibbon(left: LaneRibbon, right: LaneRibbon): number {
  return (
    left.desiredX - right.desiredX ||
    left.familyId.localeCompare(right.familyId) ||
    left.id.localeCompare(right.id)
  );
}

/**
 * Keep the previous order of ribbons that are still alive. Insert each
 * newcomer where its desired x fits. Equal desired x breaks ties by family, then id.
 */
export function stableLaneOrder(
  previous: readonly string[],
  ribbons: readonly LaneRibbon[],
): string[] {
  const byId = new Map(ribbons.map((ribbon) => [ribbon.id, ribbon]));
  const kept = previous.filter((id) => byId.has(id));
  const seen = new Set(kept);
  const newcomers = ribbons
    .filter((ribbon) => !seen.has(ribbon.id))
    .sort(compareRibbon);
  const order = [...kept];
  for (const ribbon of newcomers) {
    let at = order.length;
    for (let index = 0; index < order.length; index += 1) {
      const other = byId.get(order[index] ?? '');
      if (other && compareRibbon(ribbon, other) < 0) {
        at = index;
        break;
      }
    }
    order.splice(at, 0, ribbon.id);
  }
  return order;
}

function maxOverlap(
  order: readonly string[],
  x: ReadonlyMap<string, number>,
  byId: ReadonlyMap<string, LaneRibbon>,
): number {
  let worst = 0;
  for (let index = 0; index < order.length - 1; index += 1) {
    const leftId = order[index];
    const rightId = order[index + 1];
    if (leftId === undefined || rightId === undefined) continue;
    const left = byId.get(leftId);
    const right = byId.get(rightId);
    if (!left || !right) continue;
    const need = (ribbonWidth(left.weight) + ribbonWidth(right.weight)) / 2 + MIN_GAP;
    const overlap = need - ((x.get(rightId) ?? 0) - (x.get(leftId) ?? 0));
    if (overlap > worst) worst = overlap;
  }
  return worst;
}

function separate(
  order: readonly string[],
  x: Map<string, number>,
  byId: ReadonlyMap<string, LaneRibbon>,
): void {
  for (let index = 0; index < order.length - 1; index += 1) {
    const leftId = order[index];
    const rightId = order[index + 1];
    if (leftId === undefined || rightId === undefined) continue;
    const left = byId.get(leftId);
    const right = byId.get(rightId);
    if (!left || !right) continue;
    const need = (ribbonWidth(left.weight) + ribbonWidth(right.weight)) / 2 + MIN_GAP;
    const overlap = need - ((x.get(rightId) ?? 0) - (x.get(leftId) ?? 0));
    if (overlap <= 0) continue;
    const leftMass = laneMass(left.weight, left.importance);
    const rightMass = laneMass(right.weight, right.importance);
    const total = leftMass + rightMass;
    x.set(leftId, (x.get(leftId) ?? 0) - overlap * (rightMass / total));
    x.set(rightId, (x.get(rightId) ?? 0) + overlap * (leftMass / total));
  }
}

function pullTowardDesired(
  order: readonly string[],
  x: Map<string, number>,
  byId: ReadonlyMap<string, LaneRibbon>,
): void {
  for (const id of order) {
    const ribbon = byId.get(id);
    if (!ribbon) continue;
    const mass = laneMass(ribbon.weight, ribbon.importance);
    const current = x.get(id) ?? ribbon.desiredX;
    x.set(id, current + (GEO_PULL * (ribbon.desiredX - current)) / mass);
  }
}

function clampAll(
  order: readonly string[],
  x: Map<string, number>,
  byId: ReadonlyMap<string, LaneRibbon>,
): void {
  for (const id of order) {
    const ribbon = byId.get(id);
    if (!ribbon) continue;
    x.set(id, clampCenter(x.get(id) ?? ribbon.desiredX, ribbonWidth(ribbon.weight)));
  }
}

function relax(
  order: readonly string[],
  x: Map<string, number>,
  byId: ReadonlyMap<string, LaneRibbon>,
): void {
  for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
    separate(order, x, byId);
    pullTowardDesired(order, x, byId);
    clampAll(order, x, byId);
    if (maxOverlap(order, x, byId) < OVERLAP_LIMIT) return;
  }
  // The geographic pull is soft. A last separation pass restores the hard gap.
  for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
    if (maxOverlap(order, x, byId) < OVERLAP_LIMIT) return;
    separate(order, x, byId);
    clampAll(order, x, byId);
  }
}

/** Order each slice, then relax centers. A continuing ribbon seeds from its previous x. */
export function solveLanes(
  slices: readonly LaneSliceInput[],
  relations: readonly LineageRelation[] = [],
): SolvedSlice[] {
  let previousOrder: string[] = [];
  const previousX = new Map<string, number>();
  const solved: SolvedSlice[] = [];
  for (let index = 0; index < slices.length; index += 1) {
    const slice = slices[index];
    if (!slice) continue;
    const upcoming = slices.slice(index + 1).flatMap((item) => item.ribbons);
    const ribbons = convergeParents(slice.ribbons, relations, slice.end, upcoming);
    const byId = new Map(ribbons.map((ribbon) => [ribbon.id, ribbon]));
    const seeds = lineageSeedMap(ribbons, relations, slice.start, previousX);
    const order = stableLaneOrder(previousOrder, slice.ribbons);
    const x = new Map<string, number>();
    for (const id of order) {
      const ribbon = byId.get(id);
      if (!ribbon) continue;
      const seeded = previousX.get(id) ?? seeds.get(id) ?? ribbon.desiredX;
      x.set(id, clampCenter(seeded, ribbonWidth(ribbon.weight)));
    }
    relax(order, x, byId);
    previousOrder = order;
    previousX.clear();
    for (const id of order) {
      const settled = x.get(id);
      if (settled !== undefined) previousX.set(id, settled);
    }
    solved.push({
      start: slice.start,
      end: slice.end,
      lanes: order.map((id) => ({
        id,
        x: x.get(id) ?? 0,
        width: ribbonWidth(byId.get(id)?.weight ?? 0),
      })),
    });
  }
  return solved;
}
