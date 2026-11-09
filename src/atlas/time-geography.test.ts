import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import { adjacentMoments, timeMoments } from './time-navigation';
import { fitMapView, worldXY } from './map-view';
import { fromT, toT } from '../lib/years';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));

describe('time navigation uses existing dates', () => {
  it('orders and deduplicates anchors/phases without creating year zero or changing the corpus', () => {
    const original = JSON.stringify(corpus);
    const moments = timeMoments(corpus, 'all');
    expect(moments[0]).toBe(-3300);
    expect(moments.at(-1)).toBe(2000);
    expect(moments).not.toContain(0);
    expect(new Set(moments).size).toBe(moments.length);
    expect(moments).toEqual([...moments].sort((a, b) => toT(a) - toT(b)));
    expect(moments).toContain(-246);
    expect(JSON.stringify(corpus)).toBe(original);
  });
  it('respects region filters for context phases while retaining chapter viewing anchors', () => {
    expect(timeMoments(corpus, 'East Asia')).toContain(-246);
    expect(timeMoments(corpus, 'Africa')).not.toContain(-246);
    for (const pack of corpus.packs)
      expect(timeMoments(corpus, 'Africa')).toContain(pack.anchor);
  });
  it('steps over BCE/CE and disables navigation at the program endpoints', () => {
    const moments = [-3300, -1, 1, 2000];
    expect(adjacentMoments(moments, -1)).toEqual({ earlier: -3300, later: 1 });
    expect(adjacentMoments(moments, 1)).toEqual({ earlier: -1, later: 2000 });
    expect(adjacentMoments(moments, -3300).earlier).toBeUndefined();
    expect(adjacentMoments(moments, 2000).later).toBeUndefined();
    expect(fromT(toT(-1) + 1)).toBe(1);
    expect(fromT(toT(1) - 1)).toBe(-1);
  });
});

describe('map fitting does not relocate the evidence', () => {
  it('fits related locators with margins inside a stable world coordinate system', () => {
    const coordinates: [number, number][] = [
      [108.8, 34.4],
      [109.3, 28.8],
    ];
    const original = structuredClone(coordinates);
    const [x, y, width, height] = fitMapView(coordinates);
    expect(width).toBeLessThan(720);
    expect(width / height).toBe(2);
    for (const point of coordinates) {
      const [px, py] = worldXY(point);
      expect(px).toBeGreaterThan(x);
      expect(px).toBeLessThan(x + width);
      expect(py).toBeGreaterThan(y);
      expect(py).toBeLessThan(y + height);
    }
    expect(coordinates).toEqual(original);
  });
  it('keeps dateline-separated places in view and clamps polar/edge focus', () => {
    expect(
      fitMapView([
        [179, 30],
        [-179, 30],
      ]),
    ).toEqual([0, 0, 720, 360]);
    expect(fitMapView([])).toEqual([0, 0, 720, 360]);
    for (const coordinates of [[[-180, 90]], [[180, -90]]] as [number, number][][]) {
      const [x, y, width, height] = fitMapView(coordinates);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(x + width).toBeLessThanOrEqual(720);
      expect(y + height).toBeLessThanOrEqual(360);
    }
  });
});
