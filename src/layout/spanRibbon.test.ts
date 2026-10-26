import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { toT } from '../lib/years.ts';
import { MIN_GAP, ribbonWidth } from './constants.ts';
import {
  spanLaneWidth,
  taperYear,
  wideRibbon,
  type WideSample,
  type ZoneSpan,
} from './spanRibbon.ts';

function loadZones(): { children: string[]; zones: ZoneSpan[] } {
  return JSON.parse(
    readFileSync('src/layout/__fixtures__/mongol-empire.json', 'utf8'),
  ) as { children: string[]; zones: ZoneSpan[] };
}

function at(samples: readonly WideSample[], year: number): WideSample {
  const found = samples.find((sample) => sample.year === year);
  if (!found) throw new Error(`no sample at ${year}`);
  return found;
}

describe('multi-zone ribbons', () => {
  it('stacks span lanes with the ordinary gap', () => {
    expect(spanLaneWidth(1, 1)).toBe(92);
    expect(spanLaneWidth(3, 1)).toBe(92 * 3 + MIN_GAP * 2);
  });

  it('widens the Mongol ribbon as zones join and tapers when one leaves', () => {
    const fixture = loadZones();
    expect(fixture.children).toEqual(['yuan', 'ilkhanate', 'chagatai', 'golden_horde']);
    const samples = wideRibbon(fixture.zones);
    const east = ribbonWidth(0.5);
    expect(at(samples, 1206).width).toBeCloseTo(east);
    expect(at(samples, 1206).x).toBeCloseTo(1100);
    const peak = samples.reduce((best, sample) => Math.max(best, sample.width), 0);
    expect(peak).toBeGreaterThan(east * 2);
    const afterRus = samples.filter((sample) => sample.year > 1300);
    expect(afterRus.length).toBeGreaterThan(0);
    expect(Math.max(...afterRus.map((sample) => sample.width))).toBeLessThan(peak);
    let previous = -4000;
    for (const sample of samples) {
      expect(toT(sample.year)).toBeGreaterThan(previous);
      previous = toT(sample.year);
    }
    const join = samples.findIndex((sample) => sample.year === 1218);
    const tapered = samples[join + 1];
    expect(tapered).toBeDefined();
    if (!tapered) return;
    expect(toT(tapered.year) - toT(1218)).toBeLessThanOrEqual(40);
    expect(tapered.width).toBeGreaterThan(at(samples, 1218).width);
  });

  it('keeps a short taper off year 0', () => {
    expect(taperYear(-5, 5)).toBe(4);
    const samples = wideRibbon([
      { id: 'early', start: -30, end: 30, x: 400, weight: 0.2 },
      { id: 'late', start: -2, end: 30, x: 520, weight: 0.2 },
    ]);
    expect(samples.some((sample) => sample.year === 0)).toBe(false);
    expect(samples.map((sample) => sample.year)).toContain(-2);
  });
});
