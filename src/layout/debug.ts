import { MAX_DRIFT } from './constants.ts';
import { maxRibbonDrift, relationRouting, ribbonOverlap } from './metrics.ts';
import type {
  LayoutBox,
  LayoutCallout,
  LayoutConnector,
  LayoutDebug,
  LayoutLabel,
  LayoutLane,
  LayoutPlate,
  LayoutRibbon,
  LayoutViolation,
} from './types.ts';

function box(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
): LayoutBox | undefined {
  if (!(width > 0) || !(height > 0)) return undefined;
  return { id, x, y, width, height };
}

function ribbonBox(ribbon: LayoutRibbon): LayoutBox | undefined {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const frame of ribbon.keyframes) {
    minX = Math.min(minX, frame.x - frame.width / 2);
    maxX = Math.max(maxX, frame.x + frame.width / 2);
    minY = Math.min(minY, frame.y);
    maxY = Math.max(maxY, frame.y);
  }
  if (!Number.isFinite(minX) || maxY <= minY) return undefined;
  return box(`ribbon:${ribbon.polityId}`, minX, minY, maxX - minX, maxY - minY);
}

/** Lanes, collision boxes, and the failures the overlay should draw. */
export function layoutDebug(input: {
  lanes: readonly LayoutLane[];
  ribbons: readonly LayoutRibbon[];
  labels: readonly LayoutLabel[];
  callouts: readonly LayoutCallout[];
  plates: readonly LayoutPlate[];
  relations: readonly { id: string; from: readonly string[]; to: readonly string[] }[];
  connectors: readonly LayoutConnector[];
  importance: ReadonlyMap<string, number>;
}): LayoutDebug {
  const boxes: LayoutBox[] = [];
  for (const ribbon of input.ribbons) {
    const bounds = ribbonBox(ribbon);
    if (bounds) boxes.push(bounds);
  }
  for (const label of input.labels) {
    const bounds = box(
      `label:${label.polityId}`,
      label.x,
      label.y,
      label.width,
      label.height,
    );
    if (bounds) boxes.push(bounds);
  }
  for (const card of input.callouts) {
    const bounds = box(
      `callout:${card.calloutId}`,
      card.x,
      card.y,
      card.width,
      card.height,
    );
    if (bounds) boxes.push(bounds);
  }
  for (const plate of input.plates) {
    const bounds = box(
      `plate:${plate.calloutId}`,
      plate.x,
      plate.y,
      plate.width,
      plate.height,
    );
    if (bounds) boxes.push(bounds);
  }
  const violations: LayoutViolation[] = [];
  for (const pair of ribbonOverlap(input.ribbons).pairs) {
    violations.push({
      code: 'overlap',
      message: `${pair[0]} overlaps ${pair[1]}`,
      ids: pair,
    });
  }
  const routing = relationRouting(input.relations, input.ribbons, input.connectors);
  for (const id of routing.unroutableIds) {
    violations.push({
      code: 'unroutable',
      message: `${id} has no curve`,
      ids: [id],
    });
  }
  for (const label of input.labels) {
    const tier = input.importance.get(label.polityId);
    if (tier === undefined || tier < 3 || label.fitted) continue;
    violations.push({
      code: 'unfit',
      message: `${label.polityId} label did not fit`,
      ids: [label.polityId],
    });
  }
  for (const card of input.callouts) {
    if (card.placed || card.marker) continue;
    violations.push({
      code: 'dropped',
      message: `${card.calloutId} was dropped`,
      ids: [card.calloutId],
    });
  }
  const drift = maxRibbonDrift(input.ribbons);
  if (drift.polityId && drift.slope > MAX_DRIFT) {
    violations.push({
      code: 'drift',
      message: `${drift.polityId} slants at ${drift.slope.toFixed(2)}`,
      ids: [drift.polityId],
    });
  }
  return { lanes: input.lanes, boxes, violations };
}
