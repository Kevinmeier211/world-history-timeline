import { describe, expect, it } from 'vitest';

import { LEFT_GUTTER, PLOT_WIDTH } from '../layout/constants.ts';
import { landPath, watermarkBox } from './watermark.ts';

const knots = [
  { longitude: -180, x: 0 },
  { longitude: 180, x: 1 },
] as const;

describe('watermark projection', () => {
  it('places a ring with the poster x knots and drops the far south', () => {
    const box = watermarkBox(3000);
    expect(box.x).toBe(LEFT_GUTTER);
    expect(box.width).toBe(PLOT_WIDTH);
    expect(box.y).toBeGreaterThan(0);
    expect(box.height).toBeLessThan(3000);

    const path = landPath(
      [
        [
          [
            [0, 0],
            [0, 10],
            [10, 0],
            [0, 0],
          ],
        ],
        [
          [
            [20, -70],
            [21, -70],
            [21, -69],
            [20, -70],
          ],
        ],
      ],
      knots,
      box,
    );
    const mid = box.x + box.width / 2;
    expect(path.match(/M/g)).toHaveLength(1);
    expect(path).toContain(mid.toFixed(1));
  });
});
