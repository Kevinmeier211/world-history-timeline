import { MIN_GAP, ribbonWidth } from './constants.ts';
import type { LaneRibbon } from './laneSolver.ts';

/** A split or merge the seeder can see. Other relation types are ignored. */
export interface LineageRelation {
  type: string;
  year: number;
  from: readonly string[];
  to: readonly string[];
}

function byDesired(left: LaneRibbon, right: LaneRibbon): number {
  return (
    left.desiredX - right.desiredX ||
    left.familyId.localeCompare(right.familyId) ||
    left.id.localeCompare(right.id)
  );
}

function average(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Pack children left to right, centered on the parent. Lower desired x stays left.
 * The returned centers are the seeds, before relaxation.
 */
export function packSplitSeeds(
  parentX: number,
  children: readonly LaneRibbon[],
): Map<string, number> {
  const ordered = [...children].sort(byDesired);
  const widths = ordered.map((ribbon) => ribbonWidth(ribbon.weight));
  const total =
    widths.reduce((sum, width) => sum + width, 0) +
    MIN_GAP * Math.max(0, ordered.length - 1);
  let cursor = parentX - total / 2;
  const seeds = new Map<string, number>();
  ordered.forEach((ribbon, index) => {
    const width = widths[index] ?? 0;
    seeds.set(ribbon.id, cursor + width / 2);
    cursor += width + MIN_GAP;
  });
  return seeds;
}

/**
 * Seeds for ribbons that have no center of their own yet.
 * A split packs the children on the parent. A merge starts the child at the parents' mean.
 */
export function lineageSeedMap(
  ribbons: readonly LaneRibbon[],
  relations: readonly LineageRelation[],
  sliceStart: number,
  previousX: ReadonlyMap<string, number>,
): Map<string, number> {
  const seeds = new Map<string, number>();
  for (const relation of relations) {
    if (relation.year !== sliceStart) continue;
    if (relation.type === 'split') {
      const parentId = relation.from[0];
      const parentX = parentId === undefined ? undefined : previousX.get(parentId);
      if (parentX === undefined) continue;
      const children = relation.to.flatMap((id) => {
        const ribbon = ribbons.find((item) => item.id === id);
        return ribbon ? [ribbon] : [];
      });
      for (const [id, x] of packSplitSeeds(parentX, children)) seeds.set(id, x);
    }
    if (relation.type === 'merge') {
      const parentXs = relation.from.flatMap((id) => {
        const x = previousX.get(id);
        return x === undefined ? [] : [x];
      });
      if (parentXs.length === 0) continue;
      const meet = average(parentXs);
      for (const id of relation.to) {
        if (ribbons.some((ribbon) => ribbon.id === id)) seeds.set(id, meet);
      }
    }
  }
  return seeds;
}

/**
 * On the slice that ends at a merge, each parent aims at the child's desired x.
 * The lane solver still keeps their order and the minimum gap.
 */
export function convergeParents(
  ribbons: readonly LaneRibbon[],
  relations: readonly LineageRelation[],
  sliceEnd: number,
  upcoming: readonly LaneRibbon[],
): LaneRibbon[] {
  const meetAt = new Map<string, number>();
  for (const relation of relations) {
    if (relation.type !== 'merge' || relation.year !== sliceEnd) continue;
    const targets = relation.to.flatMap((id) => {
      const desired = upcoming.find((ribbon) => ribbon.id === id)?.desiredX;
      return desired === undefined ? [] : [desired];
    });
    if (targets.length === 0) continue;
    const meet = average(targets);
    for (const id of relation.from) meetAt.set(id, meet);
  }
  return ribbons.map((ribbon) => {
    const meet = meetAt.get(ribbon.id);
    return meet === undefined ? ribbon : { ...ribbon, desiredX: meet };
  });
}
