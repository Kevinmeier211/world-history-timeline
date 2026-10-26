import { MIN_GAP, PLOT_WIDTH, ribbonWidth } from './constants.ts';
import type { LaneRibbon } from './laneSolver.ts';

function packWidth(kept: readonly LaneRibbon[]): number {
  let used = 0;
  for (const ribbon of kept) {
    const width = ribbonWidth(ribbon.weight);
    used = used === 0 ? width : used + MIN_GAP + width;
  }
  return used;
}

function fits(kept: readonly LaneRibbon[], ribbon: LaneRibbon): boolean {
  const width = ribbonWidth(ribbon.weight);
  const next = kept.length === 0 ? width : packWidth(kept) + MIN_GAP + width;
  return next <= PLOT_WIDTH - 1;
}

/**
 * Drop the lowest-importance ribbons until the slice can pack into the plot.
 * Equal importance keeps the earlier id. Ids in `protect` are fork endpoints:
 * each one swaps out the lowest unprotected ribbon of no higher importance
 * when that is what makes it fit. The solver then has room for the gap.
 */
export function cullToFit(
  ribbons: readonly LaneRibbon[],
  protect: ReadonlySet<string> = new Set(),
): LaneRibbon[] {
  const ordered = [...ribbons].sort(
    (left, right) =>
      right.importance - left.importance || left.id.localeCompare(right.id),
  );
  const kept: LaneRibbon[] = [];
  for (const ribbon of ordered) {
    if (!fits(kept, ribbon)) continue;
    kept.push(ribbon);
  }
  if (protect.size === 0) return kept;
  const rank = new Map(ordered.map((ribbon, index) => [ribbon.id, index]));
  const waiting = ordered.filter(
    (ribbon) => protect.has(ribbon.id) && !kept.some((item) => item.id === ribbon.id),
  );
  for (const need of waiting) {
    let trial = [...kept];
    while (!fits(trial, need)) {
      const victim = [...trial]
        .reverse()
        .find((item) => !protect.has(item.id) && item.importance <= need.importance);
      if (!victim) break;
      trial = trial.filter((item) => item.id !== victim.id);
    }
    if (!fits(trial, need)) continue;
    trial.push(need);
    trial.sort((left, right) => (rank.get(left.id) ?? 0) - (rank.get(right.id) ?? 0));
    kept.length = 0;
    kept.push(...trial);
  }
  return kept;
}
