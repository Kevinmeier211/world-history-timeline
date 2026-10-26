import type { LabelPaint } from './ribbonInk.ts';

const SLACK = 0.5;

/** User-unit multiplier that keeps a design pixel at least its own size on screen. */
export function sheetBoost(scale: number): number {
  if (!(scale > 0) || scale >= 1) return 1;
  return 1 / scale;
}

/** Design px, grown when the sheet is smaller than 1 screen px per unit. */
export function counterScaledPx(designPx: number, scale: number): number {
  return designPx * sheetBoost(scale);
}

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

function grown(label: LabelPaint, boost: number): Box {
  if (label.orientation === 'rotated') {
    const width = label.width * boost;
    const height = label.height * boost;
    const cx = label.x + label.width / 2;
    const cy = label.y + label.height / 2;
    return { x: cx - width / 2, y: cy - height / 2, width, height };
  }
  return {
    x: label.x,
    y: label.y,
    width: label.width * boost,
    height: label.height * boost,
  };
}

function overlaps(left: Box, right: Box): boolean {
  const ox =
    Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x);
  const oy =
    Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y);
  return ox > SLACK && oy > SLACK;
}

/**
 * Keep label type readable when the sheet is zoomed out.
 * Below scale 1 the font grows by `1 / scale`, and a name that would
 * cover a more important name is left off until the reader zooms in.
 */
export function labelsAtScale(
  labels: readonly LabelPaint[],
  scale: number,
  pinnedId?: string,
): LabelPaint[] {
  const boost = sheetBoost(scale);
  if (boost === 1) return [...labels];
  const ranked = [...labels].sort((left, right) => {
    if (left.polityId === pinnedId) return -1;
    if (right.polityId === pinnedId) return 1;
    const byImportance = (right.importance ?? 2) - (left.importance ?? 2);
    if (byImportance !== 0) return byImportance;
    if (right.height !== left.height) return right.height - left.height;
    return left.polityId.localeCompare(right.polityId);
  });
  const kept: { box: Box; label: LabelPaint }[] = [];
  for (const label of ranked) {
    const box = grown(label, boost);
    if (kept.some((item) => overlaps(item.box, box))) continue;
    kept.push({ box, label: { ...label, fontSize: label.fontSize * boost } });
  }
  return kept.map((item) => item.label);
}
