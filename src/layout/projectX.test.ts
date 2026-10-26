import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { interpolatePosterX } from '../data/geography.ts';
import { geographySchema } from '../data/schema/geography.ts';
import { toT } from '../lib/years.ts';
import { projectX } from './projectX.ts';

const knots = geographySchema.parse(
  JSON.parse(readFileSync('src/data/geography.json', 'utf8')),
).knots;

const fixture = [
  { longitude: -125, x: 0 },
  { longitude: 0, x: 0.5 },
  { longitude: 180, x: 1 },
];

describe('projectX', () => {
  it('is monotone and hits 0 and 1 at the knot ends', () => {
    expect(projectX({ knots, longitude: -125 })).toBe(0);
    expect(projectX({ knots, longitude: 180 })).toBe(1);
    expect(projectX({ knots: fixture, longitude: -125 })).toBe(0);
    expect(projectX({ knots: fixture, longitude: 180 })).toBe(1);
    let previous = -1;
    for (let longitude = -125; longitude <= 180; longitude += 5) {
      const x = projectX({ knots, longitude });
      expect(x).toBeGreaterThanOrEqual(previous);
      expect(x).toBeLessThanOrEqual(1);
      previous = x;
    }
  });

  it('adds family bias and clamps the ends', () => {
    expect(projectX({ knots: fixture, longitude: 0, familyBias: 0.1 })).toBeCloseTo(
      0.6,
    );
    expect(projectX({ knots: fixture, longitude: 180, familyBias: 0.1 })).toBe(1);
    expect(projectX({ knots: fixture, longitude: -125, familyBias: -0.1 })).toBe(0);
    let previous = -1;
    for (let longitude = -125; longitude <= 180; longitude += 10) {
      const x = projectX({ knots, longitude, familyBias: 0.04 });
      expect(x).toBeGreaterThanOrEqual(previous);
      previous = x;
    }
  });

  it('interpolates override pins in continuous time and ignores geography inside the span', () => {
    const xOverride = [
      { year: -5, x: 0.2 },
      { year: 5, x: 0.8 },
    ];
    const span = toT(5) - toT(-5);
    const t = (toT(1) - toT(-5)) / span;
    expect(projectX({ knots: fixture, longitude: -125, year: -5, xOverride })).toBe(
      0.2,
    );
    expect(projectX({ knots: fixture, longitude: -125, year: 5, xOverride })).toBe(0.8);
    expect(
      projectX({ knots: fixture, longitude: -125, year: 1, xOverride }),
    ).toBeCloseTo(0.2 + t * 0.6);
    expect(projectX({ knots: fixture, longitude: -125, year: -20, xOverride })).toBe(0);
  });

  it('projects an xKey anchor through its column longitude', () => {
    expect(
      projectX({
        knots,
        anchors: [{ year: -100, xKey: 'andean' }],
        year: -100,
      }),
    ).toBeCloseTo(interpolatePosterX(-72, knots));
    expect(() =>
      projectX({
        knots,
        anchors: [{ year: -100, xKey: 'atlantis' }],
        year: -100,
      }),
    ).toThrow(/xKey/);
  });
});
