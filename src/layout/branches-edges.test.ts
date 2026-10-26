import { describe, expect, it } from 'vitest';

import { bundledGeography } from '../data/catalog.ts';
import type { Polity } from '../data/schema/index.ts';
import { buildConnector } from './connectors.ts';
import { layoutDebug } from './debug.ts';
import { yOfYear } from './drift.ts';
import { ribbonRuns, sampleAt } from './frames.ts';
import { selectLod } from './lod.ts';
import { maxRibbonDrift, ribbonOverlap } from './metrics.ts';
import { nudgeCallout } from './overrides.ts';
import { projectX } from './projectX.ts';
import { placeRibbonLabel } from './shortLabel.ts';
import { wideRibbon } from './spanRibbon.ts';
import type { LayoutRibbon } from './types.ts';
import { uncertaintyGeometry } from './uncertainty.ts';

const knots = bundledGeography().knots;

describe('layout branch edges', () => {
  it('covers a flat debug ribbon, a zero-share merge, and a pin outside its span', () => {
    const flat = layoutDebug({
      lanes: [],
      ribbons: [
        {
          polityId: 'a',
          familyId: 'f',
          d: '',
          keyframes: [{ y: 1, x: 1, width: 4 }],
        },
      ],
      labels: [
        {
          polityId: 'a',
          text: 'A',
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          fontSize: 10,
          orientation: 'horizontal',
          fitted: true,
        },
      ],
      callouts: [],
      plates: [],
      relations: [],
      connectors: [],
      importance: new Map(),
    });
    expect(flat.boxes).toEqual([]);
    expect(flat.violations).toEqual([]);
    const joined = buildConnector(
      { id: 'm', type: 'merge', from: ['a', 'missing'], to: ['child'], share: [-1] },
      new Map([
        ['a', { id: 'a', x: 10, y: 0, width: 20 }],
        ['child', { id: 'child', x: 30, y: 40, width: 20 }],
      ]),
    );
    expect(joined.flows).toEqual([]);
    const pinned = projectX({
      knots,
      longitude: 12,
      year: -50,
      xOverride: [
        { year: 1, x: 0.2 },
        { year: 1, x: 0.9 },
        { year: 20, x: 0.8 },
      ],
    });
    expect(pinned).toBeGreaterThanOrEqual(0);
    expect(
      projectX({
        knots,
        longitude: 12,
        year: 1,
        xOverride: [
          { year: 1, x: 0.2 },
          { year: 1, x: 0.9 },
        ],
      }),
    ).toBeCloseTo(0.2);
    const faded = uncertaintyGeometry('e', [], 20, 1);
    expect(faded.fadePx).toBeGreaterThan(0);
    expect(faded.dashPath).toBe('');
    const dashed = uncertaintyGeometry(
      'z',
      [
        { y: 0, x: -0.001, width: 0 },
        { y: 40, x: -0.001, width: 0 },
      ],
      10,
    );
    expect(dashed.gradientId).toBe('uncertainty-z');
  });

  it('splits a ribbon run across a gap and samples the middle', () => {
    const rome: Polity = {
      id: 'rome',
      name: 'Rome',
      family: 'latin_west',
      start: 1,
      end: 4,
      confidence: 'approximate',
      importance: 3,
      weight: 0.4,
      kind: 'state',
      anchor: [{ year: 1, geo: [12, 40] }],
      summary: 'A synthetic polity for a branch test.',
      keyFacts: ['Synthetic.'],
      sourceIds: ['note'],
      verification: 'unverified',
      widthProfile: [{ year: 2, w: 0.2 }],
      spans: [{ macroRegion: 'europe', start: 1, end: 3 }],
    };
    const y0 = yOfYear(1, 1);
    const y1 = yOfYear(2, 1);
    const runs = ribbonRuns(
      rome,
      [
        { start: 1, end: 2 },
        { start: 2, end: 3 },
        { start: 3, end: 4 },
      ],
      [
        [{ id: 'rome', y: y0, x: 100, width: 20 }],
        [],
        [
          { id: 'rome', y: yOfYear(3, 1), x: 110, width: 20 },
          { id: 'rome', y: yOfYear(4, 1), x: 120, width: 24 },
        ],
      ],
      bundledGeography(),
      1,
    );
    expect(runs).toHaveLength(2);
    const mid = sampleAt(
      [
        { y: y0, x: 0, width: 10, year: 1 },
        { y: y1, x: 20, width: 30, year: 2 },
      ],
      (y0 + y1) / 2,
    );
    expect(mid?.x).toBeGreaterThan(0);
    expect(mid?.year).toBe(2);
  });

  it('hits equal-x sorts, a hidden member, and a gap between zones', () => {
    const end = { id: 'a', x: -0.004, y: 10, width: 2 };
    const next = { id: 'b', x: -0.004, y: 40, width: 2 };
    const curve = buildConnector(
      { id: 'neg', type: 'succession', from: ['a'], to: ['b'] },
      new Map([
        ['a', end],
        ['b', next],
      ]),
    );
    expect(curve.d).toContain('0.00');
    const sameX = buildConnector(
      { id: 'join', type: 'merge', from: ['a', 'b'], to: ['c'], share: [1] },
      new Map([
        ['a', { id: 'a', x: 10, y: 0, width: 8 }],
        ['b', { id: 'b', x: 10, y: 0, width: 8 }],
        ['c', { id: 'c', x: 10, y: 30, width: 16 }],
      ]),
    );
    expect(sameX.flows).toHaveLength(2);
    const tied = buildConnector(
      { id: 'split', type: 'split', from: ['a'], to: ['b', 'c'] },
      new Map([
        ['a', { id: 'a', x: 10, y: 0, width: 20 }],
        ['b', { id: 'b', x: 10, y: 20, width: 8 }],
        ['c', { id: 'c', x: 10, y: 20, width: 8 }],
      ]),
    );
    expect(tied.flows).toHaveLength(2);
    const emptyFrom = buildConnector(
      { id: 'none', type: 'split', from: [], to: ['b'] },
      new Map([['b', next]]),
    );
    expect(emptyFrom.d).toBe('');
    const ribbon = (id: string): LayoutRibbon => ({
      polityId: id,
      familyId: 'f',
      d: '',
      keyframes: [
        { y: 0, x: 10, width: 20 },
        { y: 0, x: 12, width: 20 },
        { y: 10, x: 10, width: 20 },
      ],
    });
    expect(ribbonOverlap([ribbon('a'), ribbon('b')]).overlaps).toBe(1);
    expect(maxRibbonDrift([ribbon('a')]).slope).toBeGreaterThan(0);
    const hidden = selectLod(
      [{ id: 'han', importance: 5, start: 1, end: 2, group: 'imperial' }],
      0.2,
    );
    expect(hidden.map((item) => item.id)).toEqual(['group:imperial']);
    const measure = { measure: (text: string, size: number) => text.length * size };
    const wide = placeRibbonLabel(
      {
        id: 'long',
        name: 'Antidisestablishmentarianism',
        x: 100,
        y: 0,
        width: 100,
        height: 50,
      },
      measure,
    );
    expect(wide.fitted).toBe(false);
    expect(wide.orientation).toBe('horizontal');
    const gap = wideRibbon([
      { id: 'east', start: 1, end: 10, x: 100, weight: 0.3 },
      { id: 'west', start: 20, end: 30, x: 40, weight: 0.3 },
    ]);
    expect(gap.length).toBeGreaterThan(0);
    const marked = nudgeCallout(
      {
        calloutId: 'dot',
        x: 1,
        y: 2,
        width: 6,
        height: 6,
        placed: false,
        marker: true,
      },
      { dx: 3, dy: 4 },
    );
    expect(marked.x).toBe(4);
    expect(marked.leader).toBeUndefined();
  });
});
