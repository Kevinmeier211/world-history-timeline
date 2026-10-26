import { fromT, toT } from '../lib/years.ts';
import { MIN_GAP, ribbonWidth } from './constants.ts';

/** One geographic zone of a multi-zone empire. */
export interface ZoneSpan {
  id: string;
  start: number;
  end: number;
  /** Zone centerline in design px. */
  x: number;
  weight: number;
}

/** Center and outer width of the wide ribbon at one year. */
export interface WideSample {
  year: number;
  x: number;
  width: number;
}

/** Continuous years of a width change. Shorter slices taper inside the slice. */
export const TAPER_YEARS = 40;

function measure(zones: readonly ZoneSpan[]): { x: number; width: number } {
  let left = Infinity;
  let right = -Infinity;
  for (const zone of zones) {
    const half = ribbonWidth(zone.weight) / 2;
    left = Math.min(left, zone.x - half);
    right = Math.max(right, zone.x + half);
  }
  return { x: (left + right) / 2, width: right - left };
}

function yearsOf(zones: readonly ZoneSpan[]): number[] {
  const years = new Set<number>();
  for (const zone of zones) {
    years.add(zone.start);
    years.add(zone.end);
  }
  return [...years].sort((left, right) => toT(left) - toT(right));
}

/** A year `taperYears` later, strictly before `end`. */
export function taperYear(
  start: number,
  end: number,
  taperYears = TAPER_YEARS,
): number {
  const span = toT(end) - toT(start);
  const step = Math.max(1, Math.min(taperYears, span - 1));
  return fromT(toT(start) + step);
}

/**
 * Width of `lanes` copies of one ribbon, including the gaps between them.
 * `spanLanes` of 1 is an ordinary ribbon.
 */
export function spanLaneWidth(lanes: number, weight: number): number {
  const count = Math.max(1, Math.round(lanes));
  return count * ribbonWidth(weight) + Math.max(0, count - 1) * MIN_GAP;
}

/**
 * One wide ribbon. Its center is the midpoint of the active zones' outer edges.
 * When a zone joins or leaves, the width eases across `TAPER_YEARS` instead of stepping.
 */
export function wideRibbon(zones: readonly ZoneSpan[]): WideSample[] {
  const years = yearsOf(zones);
  const samples: WideSample[] = [];
  let previous: { x: number; width: number } | undefined;
  for (let index = 0; index < years.length - 1; index += 1) {
    const start = years[index];
    const end = years[index + 1];
    if (start === undefined || end === undefined) continue;
    if (toT(end) - toT(start) <= 0) continue;
    const active = zones.filter((zone) => zone.start <= start && zone.end >= end);
    if (active.length === 0) {
      previous = undefined;
      continue;
    }
    const next = measure(active);
    if (!previous) {
      samples.push({ year: start, ...next });
    } else if (previous.width !== next.width || previous.x !== next.x) {
      samples.push({ year: start, ...previous });
      samples.push({ year: taperYear(start, end), ...next });
    }
    previous = next;
  }
  const last = years.at(-1);
  if (last !== undefined && previous) samples.push({ year: last, ...previous });
  return samples;
}
