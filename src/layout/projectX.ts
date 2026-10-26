import { interpolatePosterX } from '../data/geography.ts';
import type { PosterKnot } from '../data/schema/geography.ts';
import { toT } from '../lib/years.ts';

/**
 * Heartland longitude for a v1 column key. These are layout defaults so an
 * anchor that has no geo can enter the knot map. They are not site coordinates.
 */
export const COLUMN_LONGITUDE: Record<string, number> = {
  andean: -72,
  mesoamerica: -99,
  north_america: -90,
  sub_saharan_africa: 10,
  western_europe: 2,
  eastern_med_europe: 23,
  egypt_levant: 31,
  mesopotamia_persia: 44,
  indus_india: 77,
  china_east_asia: 114,
  austronesia_japan_sea: 135,
};

export interface ProjectAnchor {
  year: number;
  geo?: readonly [number, number];
  xKey?: string;
}

export interface ProjectXInput {
  knots: readonly PosterKnot[];
  /** Used when no anchor list is passed. */
  longitude?: number;
  /** Keyframed anchors. The sample at `year` is projected, then bias is added. */
  anchors?: readonly ProjectAnchor[];
  /** Sample year. Defaults to the first anchor year, or is unused for a bare longitude. */
  year?: number;
  /** Added to the geographic x, then clamped. Not added on top of an override. */
  familyBias?: number;
  /** Absolute poster-x pins. Inside their span they replace geography. */
  xOverride?: readonly { year: number; x: number }[];
}

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function longitudeOf(anchor: ProjectAnchor): number {
  if (anchor.geo) return anchor.geo[0];
  if (anchor.xKey) {
    const longitude = COLUMN_LONGITUDE[anchor.xKey];
    if (longitude === undefined) throw new Error(`unknown anchor xKey ${anchor.xKey}`);
    return longitude;
  }
  throw new Error('anchor needs geo or xKey');
}

function sampleX(
  frames: readonly { year: number; x: number }[],
  year: number,
  outside: 'clamp' | 'none',
): number | undefined {
  if (frames.length === 0) return undefined;
  const sorted = [...frames].sort((a, b) => a.year - b.year);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) return undefined;
  if (year < first.year || year > last.year) {
    if (outside === 'none') return undefined;
    return year < first.year ? first.x : last.x;
  }
  for (let index = 1; index < sorted.length; index += 1) {
    const right = sorted[index];
    const left = sorted[index - 1];
    if (!right || !left || year > right.year) continue;
    const span = toT(right.year) - toT(left.year);
    const t = span === 0 ? 0 : (toT(year) - toT(left.year)) / span;
    return left.x + t * (right.x - left.x);
  }
  return last.x;
}

/** Poster x in [0, 1] for one polity at one year. */
export function projectX(input: ProjectXInput): number {
  const bias = input.familyBias ?? 0;
  const year = input.year;
  if (year !== undefined && input.xOverride) {
    const pinned = sampleX(input.xOverride, year, 'none');
    if (pinned !== undefined) return clamp01(pinned);
  }

  if (input.anchors && input.anchors.length > 0) {
    const frames = input.anchors.map((anchor) => ({
      year: anchor.year,
      x: clamp01(interpolatePosterX(longitudeOf(anchor), input.knots) + bias),
    }));
    const first = frames[0];
    if (!first) throw new Error('anchor projection is empty');
    const sampled = sampleX(frames, year ?? first.year, 'clamp');
    if (sampled === undefined) throw new Error('anchor projection is empty');
    return sampled;
  }

  if (input.longitude === undefined)
    throw new Error('projectX needs a longitude or an anchor');
  return clamp01(interpolatePosterX(input.longitude, input.knots) + bias);
}
