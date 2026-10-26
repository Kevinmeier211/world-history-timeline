/** Crop marks sit in the bleed and stop short of the trim. */

export const CROP_MARK_PT = 0.5;
/** Clearance between a mark and the trim, so the stroke stays outside the sheet. */
export const CROP_GAP_IN = 0.02;
/** Inset from the paper edge so a mark is not clipped. */
export const CROP_INSET_IN = 0.01;

export interface CropSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Eight marks, two at each corner. Units are inches. An empty list means the bleed is too small. */
export function cropSegments(
  paperWidthIn: number,
  paperHeightIn: number,
  trimWidthIn: number,
  trimHeightIn: number,
): CropSegment[] {
  const left = (paperWidthIn - trimWidthIn) / 2;
  const top = (paperHeightIn - trimHeightIn) / 2;
  const right = left + trimWidthIn;
  const bottom = top + trimHeightIn;
  if (!(left > CROP_GAP_IN + CROP_INSET_IN) || !(top > CROP_GAP_IN + CROP_INSET_IN)) {
    return [];
  }
  const gap = CROP_GAP_IN;
  const inset = CROP_INSET_IN;
  return [
    { x1: inset, y1: top, x2: left - gap, y2: top },
    { x1: left, y1: inset, x2: left, y2: top - gap },
    { x1: right + gap, y1: top, x2: paperWidthIn - inset, y2: top },
    { x1: right, y1: inset, x2: right, y2: top - gap },
    { x1: inset, y1: bottom, x2: left - gap, y2: bottom },
    { x1: left, y1: bottom + gap, x2: left, y2: paperHeightIn - inset },
    { x1: right + gap, y1: bottom, x2: paperWidthIn - inset, y2: bottom },
    { x1: right, y1: bottom + gap, x2: right, y2: paperHeightIn - inset },
  ];
}

/** True when the centerline does not enter the trim rectangle. */
export function segmentStaysOutsideTrim(
  segment: CropSegment,
  paperWidthIn: number,
  paperHeightIn: number,
  trimWidthIn: number,
  trimHeightIn: number,
): boolean {
  const left = (paperWidthIn - trimWidthIn) / 2;
  const top = (paperHeightIn - trimHeightIn) / 2;
  const right = left + trimWidthIn;
  const bottom = top + trimHeightIn;
  const minX = Math.min(segment.x1, segment.x2);
  const maxX = Math.max(segment.x1, segment.x2);
  const minY = Math.min(segment.y1, segment.y2);
  const maxY = Math.max(segment.y1, segment.y2);
  const crossesX = maxX > left && minX < right;
  const crossesY = maxY > top && minY < bottom;
  return !(crossesX && crossesY);
}
