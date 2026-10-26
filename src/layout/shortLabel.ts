import { LEFT_GUTTER, MIN_GAP, PLOT_WIDTH } from './constants.ts';
import { labelFit, type TextMeasurer } from './labelFit.ts';

/**
 * A ribbon shorter than this, in design px, gets an outside label.
 * Fixture H uses 40. `LABEL_MIN_H` in Appendix G stays 44 for inside comfort.
 */
export const SHORT_RIBBON_PX = 40;

/** Horizontal budget for an outside label. Narrow enough that long names ellipsize. */
export const OUTSIDE_LABEL_W = 72;
/** Tall enough that 0.62 × height still reaches the 10 px font floor. */
export const OUTSIDE_LABEL_H = 18;

export interface ShortRibbon {
  id: string;
  name: string;
  shortName?: string;
  /** Centerline x in design px. */
  x: number;
  /** Top of the ribbon in design px. */
  y: number;
  width: number;
  /** Ribbon height in design px. */
  height: number;
}

export interface LabelLeader {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface PlacedRibbonLabel {
  polityId: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  orientation: 'rotated' | 'horizontal' | 'outside';
  fitted: boolean;
  leader?: LabelLeader;
}

function hoverOnly(
  ribbon: ShortRibbon,
  orientation: PlacedRibbonLabel['orientation'],
): PlacedRibbonLabel {
  return {
    polityId: ribbon.id,
    text: ribbon.name,
    x: ribbon.x,
    y: ribbon.y,
    width: 0,
    height: 0,
    fontSize: 10,
    orientation,
    fitted: false,
  };
}

function insideLabel(ribbon: ShortRibbon, measure: TextMeasurer): PlacedRibbonLabel {
  const fitted = labelFit(
    ribbon.name,
    ribbon.shortName,
    { w: ribbon.width, h: ribbon.height },
    measure,
  );
  if (!fitted) {
    const orient = ribbon.height >= 1.4 * ribbon.width ? 'rotated' : 'horizontal';
    return hoverOnly(ribbon, orient);
  }
  const advance = measure.measure(fitted.text, fitted.size);
  if (fitted.orient === 'rotated') {
    return {
      polityId: ribbon.id,
      text: fitted.text,
      x: ribbon.x - fitted.size / 2,
      y: ribbon.y + (ribbon.height - advance) / 2,
      width: fitted.size,
      height: advance,
      fontSize: fitted.size,
      orientation: 'rotated',
      fitted: true,
    };
  }
  return {
    polityId: ribbon.id,
    text: fitted.text,
    x: ribbon.x - advance / 2,
    y: ribbon.y + (ribbon.height - fitted.size) / 2,
    width: advance,
    height: fitted.size,
    fontSize: fitted.size,
    orientation: 'horizontal',
    fitted: true,
  };
}

/**
 * Place a ribbon label. Short ribbons sit beside the ribbon with a leader.
 * The right side is preferred until the label would leave the plot.
 */
export function placeRibbonLabel(
  ribbon: ShortRibbon,
  measure: TextMeasurer,
  plotRight = LEFT_GUTTER + PLOT_WIDTH,
): PlacedRibbonLabel {
  if (ribbon.height >= SHORT_RIBBON_PX) return insideLabel(ribbon, measure);
  const fitted = labelFit(
    ribbon.name,
    ribbon.shortName,
    { w: OUTSIDE_LABEL_W, h: OUTSIDE_LABEL_H },
    measure,
  );
  if (!fitted) return hoverOnly(ribbon, 'outside');
  const advance = measure.measure(fitted.text, fitted.size);
  const midY = ribbon.y + ribbon.height / 2;
  const rightEdge = ribbon.x + ribbon.width / 2;
  const roomOnRight = plotRight - (rightEdge + MIN_GAP + advance) >= 0;
  const y = midY - fitted.size / 2;
  if (roomOnRight) {
    const x = rightEdge + MIN_GAP;
    return {
      polityId: ribbon.id,
      text: fitted.text,
      x,
      y,
      width: advance,
      height: fitted.size,
      fontSize: fitted.size,
      orientation: 'outside',
      fitted: true,
      leader: { x1: rightEdge, y1: midY, x2: x, y2: midY },
    };
  }
  const leftEdge = ribbon.x - ribbon.width / 2;
  const x2 = leftEdge - MIN_GAP;
  const x = x2 - advance;
  return {
    polityId: ribbon.id,
    text: fitted.text,
    x,
    y,
    width: advance,
    height: fitted.size,
    fontSize: fitted.size,
    orientation: 'outside',
    fitted: true,
    leader: { x1: leftEdge, y1: midY, x2, y2: midY },
  };
}
