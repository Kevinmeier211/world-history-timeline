import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { PX_PER_YEAR } from './constants.ts';
import type { RibbonPoint } from './ribbonGeometry.ts';
import { UNCERTAINTY_DASH, uncertaintyGeometry } from './uncertainty.ts';

function load(): { id: string; uncertaintyYears: number; points: RibbonPoint[] } {
  return JSON.parse(
    readFileSync('src/layout/__fixtures__/olmec-uncertain.json', 'utf8'),
  ) as {
    id: string;
    uncertaintyYears: number;
    points: RibbonPoint[];
  };
}

describe('uncertainty caps', () => {
  it('gives the Olmec start a stable gradient and a dashed edge', () => {
    const fixture = load();
    const once = uncertaintyGeometry(
      fixture.id,
      fixture.points,
      fixture.uncertaintyYears,
    );
    const twice = uncertaintyGeometry(
      fixture.id,
      fixture.points,
      fixture.uncertaintyYears,
    );
    expect(once.gradientId).toBe('uncertainty-olmec');
    expect(twice.gradientId).toBe(once.gradientId);
    expect(once.fadePx).toBeCloseTo(150 * PX_PER_YEAR);
    expect(once.dashArray).toBe(UNCERTAINTY_DASH);
    expect(once.dashPath).toContain('M 266.00 200.00');
    expect(once.dashPath).toContain('M 294.00 200.00');
    expect(once.dashPath).toContain('293.00');
    expect(once.dashPath).toBe(twice.dashPath);
  });

  it('leaves a secure ribbon solid, and zoom lengthens the fade', () => {
    const fixture = load();
    const solid = uncertaintyGeometry(fixture.id, fixture.points, 0);
    expect(solid.fadePx).toBe(0);
    expect(solid.dashPath).toBe('');
    expect(solid.gradientId).toBe('uncertainty-olmec');
    const zoomed = uncertaintyGeometry(fixture.id, fixture.points, 150, 2);
    expect(zoomed.fadePx).toBeCloseTo(150 * PX_PER_YEAR * 2);
    expect(zoomed.dashPath).toContain('386.00');
  });
});
