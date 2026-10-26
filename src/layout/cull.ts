import { MIN_GAP, PLOT_WIDTH, ribbonWidth } from './constants.ts';
import type { LaneRibbon } from './laneSolver.ts';

/**
 * Drop the lowest-importance ribbons until the slice can pack into the plot.
 * Equal importance keeps the earlier id. The solver then has room for the gap.
 */
export function cullToFit(ribbons: readonly LaneRibbon[]): LaneRibbon[] {
  const ordered = [...ribbons].sort(
    (left, right) =>
      right.importance - left.importance || left.id.localeCompare(right.id),
  );
  const kept: LaneRibbon[] = [];
  let used = 0;
  for (const ribbon of ordered) {
    const width = ribbonWidth(ribbon.weight);
    const next = kept.length === 0 ? width : used + MIN_GAP + width;
    if (next > PLOT_WIDTH - 1) continue;
    kept.push(ribbon);
    used = next;
  }
  return kept;
}
