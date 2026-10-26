import { LEFT_GUTTER, MIN_GAP, MIN_RIBBON_W, PLOT_WIDTH } from './constants.ts';

/** A ribbon the gap seater can move. Extra fields on a lane are ignored. */
export interface GapLane {
  id: string;
  seed: number;
  x: number;
  base: number;
  width: number;
  flexible: boolean;
}

const PLOT_RIGHT = LEFT_GUTTER + PLOT_WIDTH;

function clamp(value: number, lo: number, hi: number): number {
  if (hi < lo) return (lo + hi) / 2;
  return Math.min(hi, Math.max(lo, value));
}

interface Gap {
  edgeLeft: number;
  edgeRight: number;
  leftRibbon: boolean;
  rightRibbon: boolean;
}

function gapsBetween(occupied: readonly GapLane[]): Gap[] {
  const edges = [...occupied].sort(
    (left, right) => left.x - right.x || left.id.localeCompare(right.id),
  );
  const gaps: Gap[] = [];
  let cursor = LEFT_GUTTER;
  let afterRibbon = false;
  for (const lane of edges) {
    gaps.push({
      edgeLeft: cursor,
      edgeRight: lane.x - lane.width / 2,
      leftRibbon: afterRibbon,
      rightRibbon: true,
    });
    cursor = lane.x + lane.width / 2;
    afterRibbon = true;
  }
  gaps.push({
    edgeLeft: cursor,
    edgeRight: PLOT_RIGHT,
    leftRibbon: afterRibbon,
    rightRibbon: false,
  });
  return gaps;
}

function maxWidth(gap: Gap): number {
  return (
    gap.edgeRight -
    gap.edgeLeft -
    (gap.leftRibbon ? MIN_GAP : 0) -
    (gap.rightRibbon ? MIN_GAP : 0)
  );
}

/** Put a ribbon that just appeared into the nearest gap that can hold it. */
export function seatNewcomers(lanes: GapLane[]): void {
  const occupied = lanes.filter((lane) => !lane.flexible);
  const newcomers = lanes
    .filter((lane) => lane.flexible)
    .sort((left, right) => left.seed - right.seed || left.id.localeCompare(right.id));
  for (const lane of newcomers) {
    let best: { x: number; width: number; dist: number } | undefined;
    for (const gap of gapsBetween(occupied)) {
      const room = maxWidth(gap);
      const width = Math.min(lane.base, Math.max(MIN_RIBBON_W, room));
      const fits = room >= width - 1e-4;
      const lo = gap.edgeLeft + width / 2 + (gap.leftRibbon ? MIN_GAP : 0);
      const hi = gap.edgeRight - width / 2 - (gap.rightRibbon ? MIN_GAP : 0);
      if (fits && hi < lo) continue;
      const x = fits ? clamp(lane.seed, lo, hi) : (gap.edgeLeft + gap.edgeRight) / 2;
      const dist = Math.abs(x - lane.seed) + (fits ? 0 : 10000);
      if (!best || dist < best.dist)
        best = { x, width: fits ? width : lane.width, dist };
    }
    if (!best) continue;
    lane.x = best.x;
    lane.width = best.width;
    occupied.push(lane);
  }
}

/** Narrow neighbors until their existing centers can hold the gap. */
export function shrinkToCenters(lanes: readonly GapLane[]): void {
  const ordered = [...lanes].sort(
    (left, right) => left.x - right.x || left.id.localeCompare(right.id),
  );
  for (let pass = 0; pass < ordered.length; pass += 1) {
    let changed = false;
    for (let index = 0; index < ordered.length - 1; index += 1) {
      const left = ordered[index];
      const right = ordered[index + 1];
      if (!left || !right) continue;
      const limit = right.x - left.x - MIN_GAP;
      const half = (left.width + right.width) / 2;
      if (half <= limit + 1e-4 || limit <= 0) continue;
      const scale = limit / half;
      const nextLeft = Math.max(MIN_RIBBON_W, left.width * scale);
      const nextRight = Math.max(MIN_RIBBON_W, right.width * scale);
      if (nextLeft < left.width - 1e-6 || nextRight < right.width - 1e-6)
        changed = true;
      left.width = nextLeft;
      right.width = nextRight;
    }
    if (!changed) break;
  }
}
