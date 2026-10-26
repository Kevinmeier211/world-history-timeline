import type { Polity } from '../data/schema/index.ts';
import type { Geography } from '../data/schema/geography.ts';
import { fromT, toT } from '../lib/years.ts';
import { easeCenterlines } from './continuity.ts';
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

/** A span may be wider than the lane. The drawn width stays inside the lane. */
export function clipToLaneWidth(
  lane: readonly { y: number; width: number }[],
  points: readonly RibbonPoint[],
): RibbonPoint[] {
  return points.map((point) => ({
    ...point,
    width: Math.min(point.width, widthAt(lane, point.y)),
  }));
}

function widthAt(lane: readonly { y: number; width: number }[], y: number): number {
  const first = lane[0];
  const last = lane.at(-1);
  if (!first || !last) return Number.POSITIVE_INFINITY;
  if (y <= first.y) return first.width;
  if (y >= last.y) return last.width;
  for (let index = 0; index < lane.length - 1; index += 1) {
    const left = lane[index];
    const right = lane[index + 1];
    if (!left || !right || y > right.y) continue;
    const span = right.y - left.y;
    const t = span === 0 ? 0 : (y - left.y) / span;
    return left.width + (right.width - left.width) * t;
  }
  return last.width;
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
  const shaped = clipToLaneWidth(dated, withWidthProfile(dated, profile));
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

/**
 * Drift can land two ribbons on the same column. Sample every ribbon at
 * every keyframe y, then ease the centers so a membership change does not
 * rebuild the row from the gutter.
 */
function snapRuns(runs: ReadonlyMap<string, DatedPoint[][]>): void {
  for (const ribbon of runs.values()) {
    for (const run of ribbon) {
      for (const point of run) point.y = Math.round(point.y * 100) / 100;
      const collapsed: DatedPoint[] = [];
      for (const point of run) {
        const previous = collapsed.at(-1);
        if (previous && previous.y === point.y) {
          previous.width = Math.max(previous.width, point.width);
          continue;
        }
        collapsed.push(point);
      }
      run.length = 0;
      run.push(...collapsed);
    }
  }
}

export function separateRuns(runs: ReadonlyMap<string, DatedPoint[][]>): void {
  snapRuns(runs);
  const seenY = new Set<number>();
  const marks: number[] = [];
  for (const ribbon of runs.values()) {
    for (const run of ribbon) {
      for (const point of run) {
        if (seenY.has(point.y)) continue;
        seenY.add(point.y);
        marks.push(point.y);
      }
    }
  }
  marks.sort((left, right) => left - right);
  for (const ribbon of runs.values()) {
    for (const run of ribbon) {
      const extra: DatedPoint[] = [];
      let cursor = 0;
      for (let index = 0; index < run.length - 1; index += 1) {
        const left = run[index];
        const right = run[index + 1];
        if (!left || !right || right.y <= left.y) continue;
        while (cursor < marks.length && (marks[cursor] ?? 0) <= left.y) cursor += 1;
        for (let look = cursor; look < marks.length; look += 1) {
          const y = marks[look] ?? 0;
          if (y >= right.y) break;
          const t = (y - left.y) / (right.y - left.y);
          extra.push({
            y,
            x: left.x + (right.x - left.x) * t,
            width: left.width + (right.width - left.width) * t,
            year: t < 0.5 ? left.year : right.year,
          });
        }
      }
      if (extra.length > 0) {
        run.push(...extra);
        run.sort((left, right) => left.y - right.y);
      }
    }
  }
  const samples: { id: string; y: number; x: number; width: number }[] = [];
  const mirrors = new Map<string, DatedPoint[]>();
  for (const [id, ribbon] of runs) {
    for (const run of ribbon) {
      for (const point of run) {
        const key = `${id}\0${point.y}`;
        const list = mirrors.get(key);
        if (list) {
          list.push(point);
          continue;
        }
        mirrors.set(key, [point]);
        samples.push({ id, y: point.y, x: point.x, width: point.width });
      }
    }
  }
  easeCenterlines(samples);
  for (const sample of samples) {
    const list = mirrors.get(`${sample.id}\0${sample.y}`);
    if (!list) continue;
    for (const point of list) {
      point.x = sample.x;
      point.width = sample.width;
    }
  }
  snapRuns(runs);
}
