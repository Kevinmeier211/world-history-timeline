import { toT } from '../lib/years.ts';
import {
  LEFT_GUTTER,
  MIN_GAP,
  MIN_RIBBON_W,
  PLOT_WIDTH,
  PX_PER_YEAR,
} from './constants.ts';
import { SHORT_RIBBON_PX } from './shortLabel.ts';

/**
 * Slices from this year on may spend width so the bottom edge can
 * hold more states. Earlier rivers keep the centers they already had.
 */
export const MODERN_FANOUT_YEAR = 1900;

/** These states keep a seat ahead of other importance-2 extras. */
const PREFERRED_MODERN = new Set(['india', 'pakistan', 'north_korea', 'south_korea']);

/** Thickness that still holds the 10px label floor (`floor(0.62 * w) >= 10`). */
export const READABLE_W = 10 / 0.62 + 1e-4;

export interface SeatLane {
  id: string;
  x: number;
  width: number;
  /** Shrink stops here. A zero slack lane does not move. */
  minWidth: number;
}

export interface SeatExtra {
  id: string;
  desiredX: number;
  width: number;
  importance: number;
}

interface Placed {
  id: string;
  x: number;
  width: number;
}

function clamp(value: number, lo: number, hi: number): number {
  if (hi < lo) return (lo + hi) / 2;
  return Math.min(hi, Math.max(lo, value));
}

function seatInto(lanes: readonly Placed[], extras: readonly SeatExtra[]): Placed[] {
  const placed = [...lanes].sort(
    (left, right) => left.x - right.x || left.id.localeCompare(right.id),
  );
  const waiting = [...extras].sort(
    (left, right) =>
      right.importance - left.importance || left.id.localeCompare(right.id),
  );
  const plotRight = LEFT_GUTTER + PLOT_WIDTH;
  for (const extra of waiting) {
    const width = Math.max(MIN_RIBBON_W, extra.width);
    let bestX = Number.NaN;
    let bestDist = Number.POSITIVE_INFINITY;
    let insertAt = -1;
    let edge = LEFT_GUTTER;
    for (let index = 0; index <= placed.length; index += 1) {
      const right = placed[index];
      const bound = right ? right.x - right.width / 2 - MIN_GAP : plotRight;
      if (bound - edge >= width - 1e-6) {
        const x = clamp(extra.desiredX, edge + width / 2, bound - width / 2);
        const dist = Math.abs(x - extra.desiredX);
        if (dist < bestDist - 1e-6) {
          bestDist = dist;
          bestX = x;
          insertAt = index;
        }
      }
      if (!right) break;
      edge = right.x + right.width / 2 + MIN_GAP;
    }
    if (insertAt < 0) continue;
    placed.splice(insertAt, 0, { id: extra.id, x: bestX, width });
  }
  return placed;
}

function shrunk(lanes: readonly SeatLane[], keep: number): Placed[] {
  return lanes.map((lane) => {
    const floor = Math.min(lane.width, Math.max(MIN_RIBBON_W, lane.minWidth));
    const width = floor + (lane.width - floor) * keep;
    return { id: lane.id, x: lane.x, width };
  });
}

/** Extra ribbons one slice may add. More than this crowds the modern labels. */
const ADDED_CAP = 6;

/**
 * Keep each lane on its center and spend only its spare width.
 * Extras sit in the gaps that open. A lane never moves in x.
 * Shrink stops once the slice has seated `ADDED_CAP` extras.
 */
export function seatFanout(
  lanes: readonly SeatLane[],
  extras: readonly SeatExtra[],
): Placed[] {
  if (extras.length === 0) {
    return lanes.map((lane) => ({ id: lane.id, x: lane.x, width: lane.width }));
  }
  const cap = Math.min(extras.length, ADDED_CAP);
  let best = shrunk(lanes, 1);
  let bestCount = 0;
  for (let step = 0; step <= 8; step += 1) {
    const seated = seatInto(shrunk(lanes, 1 - step / 8), extras);
    const added = seated.length - lanes.length;
    if (added > bestCount) {
      bestCount = added;
      best = seated;
    }
    if (added >= cap) return seated;
  }
  return best;
}

/** Ribbon width that still leaves room for a fitted name. */
export function labelFloor(start: number, end: number): number {
  const height = Math.max(0, toT(end) - toT(start)) * PX_PER_YEAR;
  return height < SHORT_RIBBON_PX ? MIN_RIBBON_W : READABLE_W;
}

export interface FanSpec {
  waiting: SeatExtra[];
  floor: ReadonlyMap<string, number>;
  importance: ReadonlyMap<string, number>;
}

/** Extras for one modern slice, with fork endpoints seated first. */
export function buildFanSpec(
  start: number,
  end: number,
  ribbons: readonly { id: string; importance: number; desiredX: number }[],
  keptIds: ReadonlySet<string>,
  spans: ReadonlyMap<string, { start: number; end: number }>,
  protect: ReadonlySet<string>,
): FanSpec | undefined {
  if (end <= MODERN_FANOUT_YEAR && start < MODERN_FANOUT_YEAR) return undefined;
  const floor = new Map<string, number>();
  const importance = new Map<string, number>();
  const waiting: SeatExtra[] = [];
  for (const ribbon of ribbons) {
    const span = spans.get(ribbon.id);
    const width = span ? labelFloor(span.start, span.end) : READABLE_W;
    floor.set(ribbon.id, width);
    importance.set(ribbon.id, ribbon.importance);
    if (keptIds.has(ribbon.id)) continue;
    waiting.push({
      id: ribbon.id,
      desiredX: ribbon.desiredX,
      width,
      importance:
        ribbon.importance +
        (protect.has(ribbon.id) ? 10 : 0) +
        (PREFERRED_MODERN.has(ribbon.id) ? 5 : 0),
    });
  }
  return { waiting, floor, importance };
}

function minWidthFor(
  lane: { id: string; width: number },
  spec: FanSpec | undefined,
): number {
  const floor = spec?.floor.get(lane.id) ?? lane.width;
  if ((spec?.importance.get(lane.id) ?? 0) >= 3)
    return Math.max(floor, lane.width * 0.5);
  return Math.min(lane.width, floor);
}

function asSeats(
  lanes: readonly { id: string; x: number; width: number }[],
  spec: FanSpec | undefined,
): SeatLane[] {
  return lanes.map((lane) => ({
    id: lane.id,
    x: lane.x,
    width: lane.width,
    minWidth: minWidthFor(lane, spec),
  }));
}

/**
 * Each slice spends its own spare width. A keep that fits the busiest
 * year leaves a tighter year empty, so the search is not shared.
 */
export function fanLayout(
  slices: readonly {
    lanes: readonly { id: string; x: number; width: number }[];
    spec?: FanSpec;
  }[],
): Placed[][] {
  return slices.map((slice) => {
    if (!slice.spec || slice.spec.waiting.length === 0) {
      return slice.lanes.map((lane) => ({ id: lane.id, x: lane.x, width: lane.width }));
    }
    return seatFanout(asSeats(slice.lanes, slice.spec), slice.spec.waiting);
  });
}
