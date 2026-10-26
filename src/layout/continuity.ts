import {
  LEFT_GUTTER,
  MAX_DRIFT,
  MIN_GAP,
  MIN_RIBBON_W,
  PLOT_WIDTH,
} from './constants.ts';
import { packLaneCenters } from './laneSolver.ts';
import { seatNewcomers, shrinkToCenters } from './seatGaps.ts';

/**
 * A centerline sample at one year. `easeCenterlines` writes `x` and `width`.
 * Packing a full row from the gutter on every year re-slots a ribbon when
 * its neighbors appear or leave, which is the 184px kink. This walk keeps a
 * ribbon that is already placed, and spends width before it spends that place.
 */
export interface CenterSample {
  id: string;
  y: number;
  x: number;
  width: number;
}

interface Lane {
  id: string;
  seed: number;
  /** Continuing ribbons may move only inside this drift window. */
  lo: number;
  hi: number;
  x: number;
  base: number;
  /** Width already drawn for this ribbon. Absent when the ribbon is new. */
  held: number | undefined;
  width: number;
  flexible: boolean;
  sample: CenterSample;
}

/** Thickness that still holds the 10px label floor (`floor(0.62 * w) >= 10`). */
const READABLE_W = 10 / 0.62 + 1e-4;

const PLOT_RIGHT = LEFT_GUTTER + PLOT_WIDTH;

function clamp(value: number, lo: number, hi: number): number {
  if (hi < lo) return (lo + hi) / 2;
  return Math.min(hi, Math.max(lo, value));
}

function edgeGap(left: Lane, right: Lane): number {
  return right.x - right.width / 2 - (left.x + left.width / 2);
}

function span(lanes: readonly Lane[]): number {
  let left = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  for (const lane of lanes) {
    left = Math.min(left, lane.x - lane.width / 2);
    right = Math.max(right, lane.x + lane.width / 2);
  }
  if (!Number.isFinite(left) || !Number.isFinite(right)) return 0;
  return right - left;
}

function gapsOk(lanes: readonly Lane[]): boolean {
  const ordered = [...lanes].sort(
    (left, right) => left.x - right.x || left.id.localeCompare(right.id),
  );
  for (let index = 0; index < ordered.length - 1; index += 1) {
    const left = ordered[index];
    const right = ordered[index + 1];
    if (!left || !right) continue;
    if (edgeGap(left, right) < MIN_GAP - 1e-3) return false;
  }
  return true;
}

function inside(lanes: readonly Lane[]): boolean {
  for (const lane of lanes) {
    if (lane.x - lane.width / 2 < LEFT_GUTTER - 0.05) return false;
    if (lane.x + lane.width / 2 > PLOT_RIGHT + 0.05) return false;
  }
  return true;
}

function rowOk(lanes: readonly Lane[]): boolean {
  return gapsOk(lanes) && inside(lanes);
}

function shiftIntoPlot(lanes: readonly Lane[]): void {
  if (lanes.length === 0) return;
  let left = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  for (const lane of lanes) {
    left = Math.min(left, lane.x - lane.width / 2);
    right = Math.max(right, lane.x + lane.width / 2);
  }
  let delta = 0;
  if (right > PLOT_RIGHT) delta = PLOT_RIGHT - right;
  if (left + delta < LEFT_GUTTER) delta = LEFT_GUTTER - left;
  if (delta === 0) return;
  for (const lane of lanes) lane.x += delta;
}

function chainLength(lanes: readonly Lane[]): number {
  const widths = lanes.reduce((sum, lane) => sum + lane.width, 0);
  return widths + Math.max(0, lanes.length - 1) * MIN_GAP;
}

/**
 * Shrink every ribbon toward `floor` until a tight chain fits the plot.
 * One exact scale, not a fixed series of 0.9 steps that overshoots the label floor.
 */
function shrinkChain(lanes: Lane[], floor: number): boolean {
  const gaps = Math.max(0, lanes.length - 1) * MIN_GAP;
  for (let guard = 0; guard < 12; guard += 1) {
    if (chainLength(lanes) <= PLOT_WIDTH + 1e-3) return true;
    let fixed = 0;
    let flex = 0;
    const open: Lane[] = [];
    for (const lane of lanes) {
      const limit = Math.max(MIN_RIBBON_W, Math.min(lane.width, lane.base, floor));
      if (lane.width > limit + 1e-4) {
        flex += lane.width;
        open.push(lane);
      } else fixed += lane.width;
    }
    const room = PLOT_WIDTH - gaps - fixed;
    if (open.length === 0 || room <= 0) return false;
    const scale = room / flex;
    let changed = false;
    for (const lane of open) {
      const limit = Math.max(MIN_RIBBON_W, Math.min(lane.width, lane.base, floor));
      const next = Math.max(limit, lane.width * scale);
      if (next < lane.width - 1e-6) changed = true;
      lane.width = next;
    }
    if (!changed) return false;
  }
  return chainLength(lanes) <= PLOT_WIDTH + 1e-3;
}

/** Prefer the readable floor. Drop to the minimum only when that chain still overflows. */
function fitChain(lanes: Lane[]): void {
  if (chainLength(lanes) <= PLOT_WIDTH + 1e-3) return;
  const saved = lanes.map((lane) => lane.width);
  if (shrinkChain(lanes, READABLE_W)) return;
  lanes.forEach((lane, index) => {
    lane.width = saved[index] ?? lane.width;
  });
  shrinkChain(lanes, MIN_RIBBON_W);
}

function pairNeed(left: Lane, right: Lane): number {
  return (left.width + right.width) / 2 + MIN_GAP;
}

/**
 * Open gaps by moving a ribbon inside its drift window.
 * A new ribbon has an open window. A continuing ribbon does not jump.
 */
function resolve(lanes: Lane[]): void {
  const ordered = [...lanes].sort(
    (left, right) => left.x - right.x || left.id.localeCompare(right.id),
  );
  for (let index = 0; index < ordered.length - 1; index += 1) {
    const left = ordered[index];
    const right = ordered[index + 1];
    if (!left || !right) continue;
    const need = pairNeed(left, right);
    if (right.x - left.x >= need - 1e-6) continue;
    const pushed = left.x + need;
    if (pushed <= right.hi + 1e-6)
      right.x = Math.min(right.hi, Math.max(right.x, pushed));
  }
  for (let index = ordered.length - 2; index >= 0; index -= 1) {
    const left = ordered[index];
    const right = ordered[index + 1];
    if (!left || !right) continue;
    const need = pairNeed(left, right);
    if (right.x - left.x >= need - 1e-6) continue;
    const pulled = right.x - need;
    if (pulled >= left.lo - 1e-6) left.x = Math.max(left.lo, Math.min(left.x, pulled));
  }
  for (let index = 0; index < ordered.length - 1; index += 1) {
    const left = ordered[index];
    const right = ordered[index + 1];
    if (!left || !right) continue;
    const need = pairNeed(left, right);
    if (right.x - left.x >= need - 1e-6) continue;
    const pushed = left.x + need;
    if (pushed <= right.hi + 1e-6)
      right.x = Math.min(right.hi, Math.max(right.x, pushed));
  }
}

function packFlexible(lanes: Lane[]): void {
  fitChain(lanes);
  const x = new Map(lanes.map((lane) => [lane.id, lane.x]));
  packLaneCenters(
    lanes.map((lane) => ({ id: lane.id, width: lane.width })),
    x,
  );
  for (const lane of lanes) lane.x = x.get(lane.id) ?? lane.x;
  if (span(lanes) <= PLOT_WIDTH + 0.05) shiftIntoPlot(lanes);
}

/**
 * Open a tight pair by moving the right ribbon only.
 * Pulling both ways oscillates a ribbon that sits between two neighbors
 * and lands it on top of one of them.
 */
function clearOverlaps(lanes: Lane[]): void {
  const seeds = new Map(lanes.map((lane) => [lane.id, lane.x]));
  for (let attempt = 0; attempt < 6; attempt += 1) {
    for (const lane of lanes) lane.x = seeds.get(lane.id) ?? lane.x;
    lanes.sort((left, right) => left.x - right.x || left.id.localeCompare(right.id));
    for (let index = 0; index < lanes.length - 1; index += 1) {
      const left = lanes[index];
      const right = lanes[index + 1];
      if (!left || !right) continue;
      const need = (left.width + right.width) / 2 + MIN_GAP;
      if (right.x - left.x < need) right.x = left.x + need;
    }
    if (inside(lanes)) return;
    let changed = false;
    for (const lane of lanes) {
      const next = Math.max(MIN_RIBBON_W, lane.width * 0.9);
      if (next < lane.width - 1e-6) changed = true;
      lane.width = next;
    }
    if (!changed) return;
  }
}

/** Restore prominence when the row already has room. Returns false if the held row does not fit. */
function adoptBaseWidths(lanes: Lane[]): boolean {
  if (!rowOk(lanes)) return false;
  const kept = lanes.map((lane) => lane.width);
  let changed = false;
  for (const lane of lanes) {
    if (lane.base <= lane.width + 1e-6) continue;
    lane.width = lane.base;
    changed = true;
  }
  if (!changed || rowOk(lanes)) return true;
  lanes.forEach((lane, index) => {
    lane.width = kept[index] ?? lane.width;
  });
  return true;
}

function trimEdges(lanes: readonly Lane[]): void {
  for (const lane of lanes) {
    const overflow = Math.max(
      0,
      LEFT_GUTTER - (lane.x - lane.width / 2),
      lane.x + lane.width / 2 - PLOT_RIGHT,
    );
    if (overflow <= 0) continue;
    lane.width = Math.max(MIN_RIBBON_W, lane.width - overflow * 2);
  }
}

function readableWidth(lane: Lane): number {
  const desired = lane.held ?? lane.base;
  return Math.min(desired, Math.max(MIN_RIBBON_W, Math.min(lane.base, READABLE_W)));
}

/**
 * Keep a row that is already clear. Otherwise spend width before spending
 * a continuing ribbon's place. A readable chain that fits stays wide enough
 * for a 10px name. The crush-to-minimum path is only the fallback.
 */
function place(lanes: Lane[]): void {
  for (const lane of lanes) {
    lane.x = lane.seed;
    lane.width = lane.held ?? lane.base;
  }
  if (lanes.every((lane) => lane.flexible)) {
    packFlexible(lanes);
    return;
  }
  if (adoptBaseWidths(lanes)) return;
  const saved = lanes.map((lane) => ({ x: lane.x, width: lane.width }));
  fitChain(lanes);
  resolve(lanes);
  if (!rowOk(lanes)) {
    for (const lane of lanes) {
      lane.x = lane.seed;
      lane.width = readableWidth(lane);
    }
    if (chainLength(lanes) <= PLOT_WIDTH + 1e-3) resolve(lanes);
  }
  if (!rowOk(lanes)) {
    lanes.forEach((lane, index) => {
      lane.x = saved[index]?.x ?? lane.seed;
      lane.width = saved[index]?.width ?? lane.width;
    });
    seatNewcomers(lanes);
    shrinkToCenters(lanes);
    clearOverlaps(lanes);
  }
  trimEdges(lanes);
}

function dedupe(row: readonly CenterSample[]): CenterSample[] {
  const byId = new Map<string, CenterSample>();
  for (const sample of row) {
    const prior = byId.get(sample.id);
    if (!prior || sample.width > prior.width) byId.set(sample.id, sample);
  }
  return [...byId.values()];
}

/**
 * Repack each year from the centers already drawn.
 * A continuing ribbon may follow its sample by at most `MAX_DRIFT`
 * per px of y. Neighbors that appear or leave do not rebuild the row
 * from the left gutter.
 */
export function easeCenterlines(samples: readonly CenterSample[]): void {
  const byY = new Map<number, CenterSample[]>();
  for (const sample of samples) {
    const row = byY.get(sample.y);
    if (row) row.push(sample);
    else byY.set(sample.y, [sample]);
  }
  const years = [...byY.keys()].sort((left, right) => left - right);
  const carried = new Map<string, number>();
  const carriedWidth = new Map<string, number>();
  let previousY = years[0] ?? 0;
  for (const y of years) {
    const dy = Math.max(0, y - previousY);
    const lanes: Lane[] = dedupe(byY.get(y) ?? []).map((sample) => {
      const prior = carried.get(sample.id);
      const flexible = prior === undefined;
      const budget = MAX_DRIFT * dy;
      const lo =
        flexible || prior === undefined ? Number.NEGATIVE_INFINITY : prior - budget;
      const hi =
        flexible || prior === undefined ? Number.POSITIVE_INFINITY : prior + budget;
      const seed = flexible || prior === undefined ? sample.x : clamp(sample.x, lo, hi);
      return {
        id: sample.id,
        seed,
        lo,
        hi,
        x: seed,
        base: sample.width,
        held: flexible ? undefined : carriedWidth.get(sample.id),
        width: sample.width,
        flexible,
        sample,
      };
    });
    lanes.sort(
      (left, right) => left.seed - right.seed || left.id.localeCompare(right.id),
    );
    place(lanes);
    for (const lane of lanes) {
      lane.sample.x = lane.x;
      lane.sample.width = lane.width;
      carried.set(lane.id, lane.x);
      carriedWidth.set(lane.id, lane.width);
    }
    previousY = y;
  }
}
