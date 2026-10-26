import type { Polity } from '../data/schema/index.ts';
import type { Geography } from '../data/schema/geography.ts';
import { fromT, toT } from '../lib/years.ts';
import { LEFT_GUTTER, PLOT_WIDTH, ribbonWidth } from './constants.ts';
import { yOfYear } from './drift.ts';
import { withWidthProfile, type RibbonPoint } from './ribbonGeometry.ts';
import { wideRibbon, type ZoneSpan } from './spanRibbon.ts';

/** A centerline sample that still knows which year it came from. */
export interface DatedPoint extends RibbonPoint {
  year: number;
}

function regionCenter(macro: string, geography: Geography): number {
  const region = geography.macroRegions.find((item) => item.id === macro);
  const zones = geography.xZones.filter((zone) => region?.xZones.includes(zone.id));
  if (zones.length === 0) return LEFT_GUTTER + PLOT_WIDTH / 2;
  const x0 = Math.min(...zones.map((zone) => zone.x0));
  const x1 = Math.max(...zones.map((zone) => zone.x1));
  return LEFT_GUTTER + ((x0 + x1) / 2) * PLOT_WIDTH;
}

function spanZones(polity: Polity, geography: Geography): ZoneSpan[] {
  return (polity.spans ?? []).map((span) => ({
    id: `${polity.id}-${span.macroRegion}`,
    start: span.start,
    end: span.end,
    x: regionCenter(span.macroRegion, geography),
    weight: span.weight ?? polity.weight,
  }));
}

function yearNear(start: number, end: number, y: number, zoomY: number): number {
  const y0 = yOfYear(start, zoomY);
  const y1 = yOfYear(end, zoomY);
  if (Math.abs(y - y0) <= 0.01) return start;
  if (Math.abs(y - y1) <= 0.01) return end;
  if (y1 === y0) return start;
  const t = (y - y0) / (y1 - y0);
  return fromT(Math.round(toT(start) + t * (toT(end) - toT(start))));
}

/** Drop samples that sit on the line between their neighbors, within 1 design px. */
function simplify(points: readonly DatedPoint[]): DatedPoint[] {
  const first = points[0];
  const last = points.at(-1);
  if (!first || !last || points.length < 3) return [...points];
  const kept: DatedPoint[] = [first];
  let anchor = 0;
  for (let index = 1; index < points.length - 1; index += 1) {
    const start = points[anchor];
    const end = points[index + 1];
    const current = points[index];
    if (!start || !end || !current) continue;
    const span = end.y - start.y;
    const t = span === 0 ? 0 : (current.y - start.y) / span;
    const xLine = start.x + (end.x - start.x) * t;
    const wLine = start.width + (end.width - start.width) * t;
    if (Math.abs(current.x - xLine) > 1 || Math.abs(current.width - wLine) > 1) {
      kept.push(current);
      anchor = index;
    }
  }
  kept.push(last);
  return kept;
}

function finishRun(
  polity: Polity,
  dated: DatedPoint[],
  geography: Geography,
  zoomY: number,
): DatedPoint[] {
  const wide = wideRibbon(spanZones(polity, geography));
  const profile = [
    ...(polity.widthProfile ?? []).map((key) => ({
      y: yOfYear(key.year, zoomY),
      width: ribbonWidth(key.w),
    })),
    ...wide.map((sample) => ({ y: yOfYear(sample.year, zoomY), width: sample.width })),
  ];
  const shaped = withWidthProfile(dated, profile);
  let cursor = 0;
  const datedShape = shaped.map((point) => {
    while (
      cursor < dated.length - 1 &&
      (dated[cursor + 1]?.y ?? Number.POSITIVE_INFINITY) < point.y
    ) {
      cursor += 1;
    }
    const left = dated[cursor];
    const right = dated[Math.min(cursor + 1, dated.length - 1)];
    const year =
      left && (!right || Math.abs(point.y - left.y) <= Math.abs(point.y - right.y))
        ? left.year
        : (right?.year ?? left?.year ?? polity.start);
    return { ...point, year };
  });
  return simplify(datedShape);
}

/**
 * One run per stretch of slices the polity survived culling.
 * A skipped slice starts a new run so the path does not cut across the gap.
 */
export function ribbonRuns(
  polity: Polity,
  slices: readonly { start: number; end: number }[],
  frames: readonly { id: string; y: number; x: number; width: number }[][],
  geography: Geography,
  zoomY: number,
): DatedPoint[][] {
  const runs: DatedPoint[][] = [];
  let current: DatedPoint[] = [];
  let previous = -2;
  slices.forEach((slice, index) => {
    const mine = (frames[index] ?? []).filter((frame) => frame.id === polity.id);
    if (mine.length === 0) return;
    if (current.length > 0 && index !== previous + 1) {
      runs.push(finishRun(polity, current, geography, zoomY));
      current = [];
    }
    previous = index;
    for (const frame of mine) {
      current.push({
        ...frame,
        year: yearNear(slice.start, slice.end, frame.y, zoomY),
      });
    }
  });
  if (current.length > 0) runs.push(finishRun(polity, current, geography, zoomY));
  return runs;
}

/** Centerline sample at `y`, clamped to the ribbon's ends. */
export function sampleAt(
  points: readonly DatedPoint[],
  y: number,
): DatedPoint | undefined {
  const first = points[0];
  const last = points.at(-1);
  if (!first || !last) return undefined;
  if (y <= first.y) return first;
  if (y >= last.y) return last;
  for (let index = 0; index < points.length - 1; index += 1) {
    const left = points[index];
    const right = points[index + 1];
    if (!left || !right || y > right.y) continue;
    const span = right.y - left.y;
    const t = span === 0 ? 0 : (y - left.y) / span;
    return {
      y,
      x: left.x + (right.x - left.x) * t,
      width: left.width + (right.width - left.width) * t,
      year: t < 0.5 ? left.year : right.year,
    };
  }
  return last;
}
