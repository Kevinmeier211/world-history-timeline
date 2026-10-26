import { toT } from '../lib/years.ts';
import { MAX_DRIFT, MIN_TRANSITION, PX_PER_YEAR, TOP_PAD } from './constants.ts';

/**
 * Share of a move given back to the previous centerline.
 * The rest follows the solver. Drift limiting still caps the slant.
 */
export const HYSTERESIS = 0.25;

export interface DriftLane {
  id: string;
  x: number;
  width: number;
}

export interface DriftSlice {
  start: number;
  end: number;
  /** Continuous years between `start` and `end`. Year 0 is already omitted. */
  span: number;
  lanes: readonly DriftLane[];
}

export interface DriftKeyframe {
  id: string;
  y: number;
  x: number;
  width: number;
  /** True when this sample exists only to keep the slant under `MAX_DRIFT`. */
  intermediate: boolean;
}

/** Design-px y for a historical year. Zoom 1 matches Appendix G. */
export function yOfYear(year: number, zoomY = 1): number {
  return TOP_PAD + (toT(year) - toT(-3300)) * PX_PER_YEAR * zoomY;
}

function blend(previous: number, solved: number): number {
  return previous + (1 - HYSTERESIS) * (solved - previous);
}

/**
 * Cap each ribbon's centerline at `MAX_DRIFT` px of x per px of y.
 * A move that does not fit gets a keyframe `MIN_TRANSITION` px down the slice
 * and the leftover waits for a later slice.
 */
export function applyDrift(
  slices: readonly DriftSlice[],
  zoomY = 1,
): DriftKeyframe[][] {
  const previous = new Map<string, number>();
  return slices.map((slice) => {
    const y0 = yOfYear(slice.start, zoomY);
    const height = Math.max(0, slice.span) * PX_PER_YEAR * zoomY;
    const y1 = y0 + height;
    const next = new Map<string, number>();
    const frames: DriftKeyframe[] = [];
    const proposed = slice.lanes.map((lane) => {
      const prior = previous.get(lane.id);
      if (prior === undefined)
        return { lane, prior, endX: lane.x, capped: false, delta: 0 };
      const target = blend(prior, lane.x);
      const limit = MAX_DRIFT * height;
      const delta = target - prior;
      const capped = height > 0 && Math.abs(delta) > limit;
      const endX = capped ? prior + Math.sign(delta) * limit : target;
      return { lane, prior, endX, capped, delta };
    });
    for (const item of proposed) next.set(item.lane.id, item.endX);
    for (const item of proposed) {
      const { lane, prior, capped, delta } = item;
      const endX = next.get(lane.id) ?? item.endX;
      if (prior === undefined) {
        frames.push({
          id: lane.id,
          y: y0,
          x: endX,
          width: lane.width,
          intermediate: false,
        });
        if (height > 0) {
          frames.push({
            id: lane.id,
            y: y1,
            x: endX,
            width: lane.width,
            intermediate: false,
          });
        }
        continue;
      }
      frames.push({
        id: lane.id,
        y: y0,
        x: prior,
        width: lane.width,
        intermediate: false,
      });
      const step = Math.min(MIN_TRANSITION, height);
      if (capped && step > 0 && step < height) {
        frames.push({
          id: lane.id,
          y: y0 + step,
          x: prior + Math.sign(delta) * MAX_DRIFT * step,
          width: lane.width,
          intermediate: true,
        });
      }
      if (height > 0) {
        frames.push({
          id: lane.id,
          y: y1,
          x: endX,
          width: lane.width,
          intermediate: false,
        });
      }
    }
    previous.clear();
    for (const [id, x] of next) previous.set(id, x);
    return frames;
  });
}
