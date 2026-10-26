import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  ribbonPath,
  sampleCenterline,
  withWidthProfile,
  type RibbonPoint,
} from './ribbonGeometry.ts';

const straight: RibbonPoint[] = [
  { y: 0, x: 100, width: 20 },
  { y: 100, x: 100, width: 20 },
];

const rising: RibbonPoint[] = [
  { y: 0, x: 0, width: 10 },
  { y: 10, x: 10, width: 10 },
  { y: 20, x: 30, width: 10 },
];

describe('ribbon geometry', () => {
  it('keeps a rising centerline inside each span', () => {
    const samples = sampleCenterline(rising, 4);
    expect(samples[0]).toMatchObject({ y: 0, x: 0 });
    expect(samples.at(-1)).toMatchObject({ y: 20, x: 30 });
    for (let index = 1; index < samples.length; index += 1) {
      const previous = samples[index - 1];
      const current = samples[index];
      if (!previous || !current) continue;
      expect(current.y).toBeGreaterThan(previous.y);
      expect(current.x).toBeGreaterThanOrEqual(previous.x - 1e-6);
    }
  });

  it('does not overshoot a peak', () => {
    const samples = sampleCenterline(
      [
        { y: 0, x: 10, width: 12 },
        { y: 10, x: 50, width: 12 },
        { y: 20, x: 10, width: 12 },
      ],
      8,
    );
    for (const sample of samples) {
      expect(sample.x).toBeGreaterThanOrEqual(10 - 1e-6);
      expect(sample.x).toBeLessThanOrEqual(50 + 1e-6);
    }
  });

  it('applies a width profile and ignores a repeated y', () => {
    const points = withWidthProfile(
      [
        { y: 0, x: 0, width: 10 },
        { y: 0, x: 5, width: 99 },
        { y: 100, x: 40, width: 10 },
      ],
      [{ y: 50, width: 30 }],
    );
    expect(points.map((point) => point.y)).toEqual([0, 50, 100]);
    expect(points[1]).toMatchObject({ x: 20, width: 30 });
  });

  it('draws a straight ribbon with rounded caps and matches the golden path', () => {
    const path = ribbonPath(straight);
    expect(path).toContain('0.00 110.00');
    expect(path).toContain('100.00 -10.00');
    expect(path.endsWith('Z')).toBe(true);
    const golden = readFileSync(
      'src/layout/__fixtures__/ribbon-straight.path.txt',
      'utf8',
    ).trim();
    expect(path).toBe(golden);
  });

  it('returns an empty path when a ribbon has no length', () => {
    expect(ribbonPath([])).toBe('');
    expect(ribbonPath([{ y: 5, x: 5, width: 8 }])).toBe('');
  });
});
