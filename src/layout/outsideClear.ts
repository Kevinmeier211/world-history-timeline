import { LEFT_GUTTER, MIN_GAP, PLOT_WIDTH } from './constants.ts';

interface Point {
  x: number;
  y: number;
  width: number;
  breakBefore?: boolean;
}

interface SideLabel {
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: string;
  fitted: boolean;
}

function sampleAt(
  points: readonly Point[],
  y: number,
): { x: number; width: number } | undefined {
  const runs: Point[][] = [];
  let current: Point[] = [];
  for (const point of points) {
    if (point.breakBefore && current.length > 0) {
      runs.push(current);
      current = [];
    }
    current.push(point);
  }
  if (current.length > 0) runs.push(current);
  for (const run of runs) {
    const first = run[0];
    const last = run.at(-1);
    if (!first || !last || y < first.y - 0.05 || y > last.y + 0.05) continue;
    const clamped = Math.min(last.y, Math.max(first.y, y));
    for (let index = 0; index < run.length - 1; index += 1) {
      const left = run[index];
      const right = run[index + 1];
      if (!left || !right || clamped > right.y) continue;
      const span = right.y - left.y;
      const t = span === 0 ? 0 : (clamped - left.y) / span;
      return {
        x: left.x + (right.x - left.x) * t,
        width: left.width + (right.width - left.width) * t,
      };
    }
    return { x: last.x, width: last.width };
  }
  return undefined;
}

/**
 * Slide an outside name along x until it clears other names.
 * The string and the fit stay put. The nearer ribbon edge keeps the leader.
 */
export function clearOutside<T extends SideLabel>(
  label: T,
  points: readonly Point[],
  hits: (label: T) => number,
): T {
  if (label.orientation !== 'outside' || !label.fitted) return label;
  const before = hits(label);
  if (before === 0) return label;
  const midY = label.y + label.height / 2;
  const sample = sampleAt(points, midY);
  if (!sample) return label;
  const rightEdge = sample.x + sample.width / 2;
  const leftEdge = sample.x - sample.width / 2;
  const plotRight = LEFT_GUTTER + PLOT_WIDTH;
  let best = label;
  let bestHits = before;
  let bestDist = 0;
  const start = Math.max(LEFT_GUTTER, leftEdge - MIN_GAP - label.width);
  const end = Math.min(plotRight - label.width, rightEdge + MIN_GAP);
  for (let x = start; x <= end + 0.05; x += 4) {
    const towardRight = x + label.width / 2 >= sample.x;
    const next = {
      ...label,
      x,
      leader: {
        x1: towardRight ? rightEdge : leftEdge,
        y1: midY,
        x2: towardRight ? rightEdge + MIN_GAP : leftEdge - MIN_GAP,
        y2: midY,
      },
    };
    const count = hits(next);
    const dist = Math.abs(x - label.x);
    if (count < bestHits || (count === bestHits && count < before && dist < bestDist)) {
      best = next;
      bestHits = count;
      bestDist = dist;
    }
  }
  return bestHits === 0 ? best : stackOne(best, hits, bestHits);
}

interface Leader {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function leaderOf(label: SideLabel): Leader | undefined {
  if (!('leader' in label)) return undefined;
  const leader = (label as { leader?: Leader }).leader;
  return leader;
}

function moveTo<T extends SideLabel>(label: T, y: number): T {
  const leader = leaderOf(label);
  if (!leader) return { ...label, y };
  return {
    ...label,
    y,
    leader: { ...leader, y2: y + label.height / 2 },
  };
}

/**
 * Try rows above and below an outside name when a sideways slide still hits.
 * The string and the fit stay put.
 */
function stackOne<T extends SideLabel>(
  label: T,
  hits: (label: T) => number,
  bestHits: number,
): T {
  const pitch = label.height + 2;
  let best = label;
  for (let lane = 1; lane <= 12; lane += 1) {
    for (const sign of [1, -1]) {
      const next = moveTo(label, label.y + sign * lane * pitch);
      const count = hits(next);
      if (count < bestHits) {
        best = next;
        bestHits = count;
        if (count === 0) return best;
      }
    }
  }
  return best;
}
