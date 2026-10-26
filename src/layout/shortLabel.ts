import { LEFT_GUTTER, MIN_GAP, PLOT_WIDTH } from './constants.ts';
import { labelFit, type TextMeasurer } from './labelFit.ts';
import type { LabelForce } from './overrides.ts';

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

function insideLabel(
  ribbon: ShortRibbon,
  measure: TextMeasurer,
  orient?: 'rotated' | 'horizontal',
): PlacedRibbonLabel {
  const fitted = labelFit(
    ribbon.name,
    ribbon.shortName,
    { w: ribbon.width, h: ribbon.height },
    measure,
    orient,
  );
  if (!fitted) {
    const fallback =
      orient ?? (ribbon.height >= 1.4 * ribbon.width ? 'rotated' : 'horizontal');
    return hoverOnly(ribbon, fallback);
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

function outsideLabel(
  ribbon: ShortRibbon,
  measure: TextMeasurer,
  plotRight: number,
  boxW = OUTSIDE_LABEL_W,
): PlacedRibbonLabel {
  const fitted = labelFit(
    ribbon.name,
    boxW === OUTSIDE_LABEL_W ? ribbon.shortName : undefined,
    { w: boxW, h: OUTSIDE_LABEL_H },
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

/**
 * Place a ribbon label. Short ribbons sit beside the ribbon with a leader.
 * The right side is preferred until the label would leave the plot.
 * `along` is the rotated ribbon label.
 */
interface AnchorPoint {
  x: number;
  y: number;
  width: number;
  breakBefore?: boolean;
}

/** The longest drawn piece. A gap between runs is not part of the ribbon. */
function longestRun(points: readonly AnchorPoint[]): AnchorPoint[] {
  const runs: AnchorPoint[][] = [];
  let current: AnchorPoint[] = [];
  for (const point of points) {
    if (point.breakBefore && current.length > 0) {
      runs.push(current);
      current = [];
    }
    current.push(point);
  }
  if (current.length > 0) runs.push(current);
  let best = runs[0] ?? [];
  let bestSpan = -1;
  for (const run of runs) {
    const first = run[0];
    const last = run.at(-1);
    const span = first && last ? last.y - first.y : -1;
    if (span > bestSpan) {
      bestSpan = span;
      best = run;
    }
  }
  return best;
}

/** One label per drawn ribbon. A missing frame is skipped. */
export function placeRibbonLabels(
  polities: readonly { id: string; name: string; shortName?: string }[],
  frames: ReadonlyMap<string, readonly AnchorPoint[]>,
  measure: TextMeasurer,
  forces: ReadonlyMap<string, LabelForce> = new Map(),
): PlacedRibbonLabel[] {
  return polities.flatMap((polity) => {
    const run = longestRun(frames.get(polity.id) ?? []);
    const first = run[0];
    const last = run.at(-1);
    if (!first || !last) return [];
    return [
      placeRibbonLabel(
        {
          id: polity.id,
          name: polity.name,
          shortName: polity.shortName,
          x: first.x,
          y: first.y,
          width: first.width,
          height: Math.max(0, last.y - first.y),
        },
        measure,
        undefined,
        forces.get(polity.id),
      ),
    ];
  });
}

export function placeRibbonLabel(
  ribbon: ShortRibbon,
  measure: TextMeasurer,
  plotRight = LEFT_GUTTER + PLOT_WIDTH,
  force?: 'along' | 'horizontal' | 'outside',
): PlacedRibbonLabel {
  if (force === 'outside') {
    const advance = measure.measure(ribbon.name, 10);
    const wide = outsideLabel(
      ribbon,
      measure,
      plotRight,
      Math.max(OUTSIDE_LABEL_W, advance + 8),
    );
    if (wide.fitted && wide.text === ribbon.name) return wide;
    return outsideLabel(ribbon, measure, plotRight);
  }
  if (force === undefined && ribbon.height < SHORT_RIBBON_PX) {
    return outsideLabel(ribbon, measure, plotRight);
  }
  if (force === 'along') return insideLabel(ribbon, measure, 'rotated');
  if (force === 'horizontal') return insideLabel(ribbon, measure, 'horizontal');
  const inside = insideLabel(ribbon, measure);
  if (inside.fitted && inside.text === ribbon.name) return inside;
  const advance = measure.measure(ribbon.name, 10);
  const wide = outsideLabel(
    ribbon,
    measure,
    plotRight,
    Math.max(OUTSIDE_LABEL_W, advance + 8),
  );
  if (wide.fitted && wide.text === ribbon.name) return wide;
  return inside;
}
