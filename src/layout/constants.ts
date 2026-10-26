/** Appendix G design coordinates. Tune only with a decision log entry. */

export const DESIGN_WIDTH = 1500;
export const LEFT_GUTTER = 84;
export const RIGHT_GUTTER = 84;
export const PLOT_WIDTH = 1332;
export const TOP_PAD = 120;
export const BOTTOM_PAD = 96;
export const PX_PER_YEAR = 0.62;
export const MIN_RIBBON_W = 12;
export const MAX_RIBBON_W = 92;
export const MIN_GAP = 6;
/** Centerline drift limit, design px of x per design px of y. */
export const MAX_DRIFT = 0.35;
export const MIN_TRANSITION = 60;
/** Major tick spacing, in years. */
export const GRID_MAJOR = 500;
/** Minor tick spacing, in years. */
export const GRID_MINOR = 100;
/** First and last years of the poster axis. */
export const AXIS_START = -3300;
export const AXIS_END = 2000;

/** Ribbon width from Appendix G. Weight is clamped to [0.05, 1]. */
export function ribbonWidth(weight: number): number {
  const clamped = Math.min(1, Math.max(0.05, weight));
  return MIN_RIBBON_W + (MAX_RIBBON_W - MIN_RIBBON_W) * clamped;
}

/** Heavier and more important ribbons move less during relaxation. */
export function laneMass(weight: number, importance: number): number {
  return 0.5 + weight + 0.25 * importance;
}
