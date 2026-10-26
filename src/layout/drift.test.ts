import { describe, expect, it } from 'vitest';

import { MAX_DRIFT, MIN_TRANSITION, PX_PER_YEAR, TOP_PAD } from './constants.ts';
import { HYSTERESIS, applyDrift, yOfYear, type DriftKeyframe } from './drift.ts';

function slope(frames: readonly DriftKeyframe[]): number {
  let worst = 0;
  for (let index = 0; index < frames.length - 1; index += 1) {
    const left = frames[index];
    const right = frames[index + 1];
    if (!left || !right || left.id !== right.id) continue;
    const dy = right.y - left.y;
    if (dy <= 0) continue;
    worst = Math.max(worst, Math.abs(right.x - left.x) / dy);
  }
  return worst;
}

describe('drift limiting', () => {
  it('places the first slice on the year axis and does not invent a kink', () => {
    expect(HYSTERESIS).toBe(0.25);
    expect(yOfYear(-3300)).toBe(TOP_PAD);
    const [frames] = applyDrift([
      { start: -3300, end: -3200, span: 100, lanes: [{ id: 'a', x: 400, width: 20 }] },
    ]);
    expect(frames?.map((frame) => [frame.y, frame.x, frame.intermediate])).toEqual([
      [TOP_PAD, 400, false],
      [TOP_PAD + 100 * PX_PER_YEAR, 400, false],
    ]);
  });

  it('springs a small move toward the previous x', () => {
    const slices = applyDrift([
      { start: -500, end: -400, span: 100, lanes: [{ id: 'a', x: 200, width: 20 }] },
      { start: -400, end: -300, span: 100, lanes: [{ id: 'a', x: 210, width: 20 }] },
    ]);
    const second = slices[1] ?? [];
    expect(second.some((frame) => frame.intermediate)).toBe(false);
    expect(second[0]?.x).toBeCloseTo(200);
    expect(second.at(-1)?.x).toBeCloseTo(200 + (1 - HYSTERESIS) * 10);
    expect(slope(second)).toBeLessThanOrEqual(MAX_DRIFT + 1e-9);
  });

  it('caps a large move and inserts a keyframe one transition in', () => {
    const slices = applyDrift([
      { start: -500, end: -400, span: 100, lanes: [{ id: 'a', x: 200, width: 24 }] },
      { start: -400, end: -300, span: 100, lanes: [{ id: 'a', x: 800, width: 24 }] },
    ]);
    const second = slices[1] ?? [];
    const height = 100 * PX_PER_YEAR;
    const limit = MAX_DRIFT * height;
    const intermediate = second.find((frame) => frame.intermediate);
    expect(intermediate).toBeDefined();
    expect(intermediate?.y).toBeCloseTo(second[0]!.y + MIN_TRANSITION);
    expect(intermediate?.x).toBeCloseTo(200 + MAX_DRIFT * MIN_TRANSITION);
    expect(second.at(-1)?.x).toBeCloseTo(200 + limit);
    expect(slope(second)).toBeLessThanOrEqual(MAX_DRIFT + 1e-6);
  });

  it('skips the intermediate keyframe when the slice is shorter than the transition', () => {
    const slices = applyDrift([
      { start: 1000, end: 1010, span: 10, lanes: [{ id: 'a', x: 200, width: 20 }] },
      { start: 1010, end: 1020, span: 10, lanes: [{ id: 'a', x: 800, width: 20 }] },
    ]);
    const second = slices[1] ?? [];
    expect(second.some((frame) => frame.intermediate)).toBe(false);
    expect(second.at(-1)?.x).toBeCloseTo(200 + MAX_DRIFT * 10 * PX_PER_YEAR);
    expect(second.at(-1)!.y - second[0]!.y).toBeCloseTo(10 * PX_PER_YEAR);
  });

  it('treats a returned ribbon as new, and a taller zoom allows a steeper year-span', () => {
    const gapped = applyDrift([
      { start: 1, end: 50, span: 49, lanes: [{ id: 'a', x: 200, width: 20 }] },
      { start: 50, end: 80, span: 30, lanes: [] },
      { start: 80, end: 120, span: 40, lanes: [{ id: 'a', x: 600, width: 20 }] },
    ]);
    const returned = gapped[2] ?? [];
    expect(returned.every((frame) => frame.x === 600)).toBe(true);
    expect(returned.some((frame) => frame.intermediate)).toBe(false);

    const zoomed = applyDrift(
      [
        { start: -200, end: -100, span: 100, lanes: [{ id: 'a', x: 200, width: 20 }] },
        { start: -100, end: 1, span: 100, lanes: [{ id: 'a', x: 230, width: 20 }] },
      ],
      2,
    );
    const moved = zoomed[1] ?? [];
    expect(moved.some((frame) => frame.intermediate)).toBe(false);
    expect(moved.at(-1)?.x).toBeCloseTo(200 + (1 - HYSTERESIS) * 30);
    expect(moved.at(-1)!.y - moved[0]!.y).toBeCloseTo(100 * PX_PER_YEAR * 2);
  });
});
