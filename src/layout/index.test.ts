import { describe, expect, it } from 'vitest';

import { bundledGeography } from '../data/catalog.ts';
import type { Polity, Relation } from '../data/schema/index.ts';
import type { LayoutInput } from './types.ts';
import { ribbonWidth } from './constants.ts';
import { clearLayoutCache, layout } from './index.ts';

function polity(
  id: string,
  start: number,
  end: number,
  longitude: number,
  family = 'latin_west',
): Polity {
  return {
    id,
    name: id,
    family: family as Polity['family'],
    start,
    end,
    confidence: 'approximate',
    importance: 3,
    weight: 0.3,
    kind: 'state',
    anchor: [{ year: start, geo: [longitude, 40] }],
    summary: 'A synthetic polity for the layout bench.',
    keyFacts: ['Synthetic.'],
    sourceIds: ['note'],
    verification: 'unverified',
  };
}

function input(polities: Polity[], extra: Partial<LayoutInput> = {}): LayoutInput {
  return {
    polities,
    relations: [],
    callouts: [],
    bands: [],
    geography: bundledGeography(),
    overrides: { ribbons: [], callouts: [] },
    viewport: { width: 1500, height: 900, zoomX: 1, zoomY: 1 },
    visibleFamilies: [],
    visibleMacroRegions: [],
    ...extra,
  };
}

describe('layout orchestrator', () => {
  it('draws a ribbon, a label, and an axis with no year 0', () => {
    clearLayoutCache();
    const result = layout(input([polity('rome', -509, 476, 12)]));
    expect(result.ribbons).toHaveLength(1);
    expect(result.ribbons[0]?.d.startsWith('M ')).toBe(true);
    expect(result.labels[0]?.fitted).toBe(true);
    expect(result.axis.ticks.some((tick) => tick.year === 0)).toBe(false);
    expect(
      result.axis.ticks.some((tick) => tick.major && tick.label.endsWith('BCE')),
    ).toBe(true);
  });

  it('keeps a split child to the left and caches the same object', () => {
    clearLayoutCache();
    const relation: Relation = {
      id: 'split_rome',
      from: ['empire'],
      to: ['west', 'east'],
      year: 395,
      type: 'split',
      confidence: 'approximate',
      verification: 'unverified',
      sourceIds: ['note'],
    };
    const once = layout(
      input(
        [
          polity('empire', -27, 395, 12),
          polity('west', 395, 476, 2),
          polity('east', 395, 1453, 29),
        ],
        { relations: [relation] },
      ),
    );
    const twice = layout(
      input(
        [
          polity('empire', -27, 395, 12),
          polity('west', 395, 476, 2),
          polity('east', 395, 1453, 29),
        ],
        { relations: [relation] },
      ),
    );
    expect(twice).toBe(once);
    const west = once.ribbons.find((ribbon) => ribbon.polityId === 'west');
    const east = once.ribbons.find((ribbon) => ribbon.polityId === 'east');
    expect(west?.keyframes[0]?.x).toBeLessThan(east?.keyframes[0]?.x ?? 0);
    expect(once.connectors[0]?.d.length).toBeGreaterThan(0);
    expect(once.connectors[0]?.type).toBe('split');
  });

  it('draws a collapsed group and fades both layers at the boundary', () => {
    clearLayoutCache();
    const grouped = (
      id: string,
      start: number,
      end: number,
      longitude: number,
    ): Polity => ({
      ...polity(id, start, end, longitude, 'chinese'),
      group: 'imperial_china',
    });
    const far = layout(
      input([grouped('han', -206, 220, 114), grouped('tang', 618, 907, 108)], {
        viewport: { width: 1500, height: 900, zoomX: 1, zoomY: 0.4 },
      }),
    );
    expect(far.ribbons.map((ribbon) => ribbon.polityId)).toEqual([
      'group:imperial_china',
    ]);
    expect(far.ribbons[0]?.opacity).toBeUndefined();
    const mid = layout(
      input([grouped('han', -206, 220, 114), grouped('tang', 618, 907, 108)], {
        viewport: { width: 1500, height: 900, zoomX: 1, zoomY: 0.85 },
      }),
    );
    expect(
      mid.ribbons.find((ribbon) => ribbon.polityId === 'han')?.opacity,
    ).toBeCloseTo(0.5);
    expect(
      mid.ribbons.find((ribbon) => ribbon.polityId === 'group:imperial_china')?.opacity,
    ).toBeCloseTo(0.5);
  });

  it('clips a multi-zone span to the lane width', () => {
    clearLayoutCache();
    const mongol = {
      ...polity('mongol', 1200, 1400, 110, 'turkic_mongol'),
      weight: 0.5,
      spans: [
        { macroRegion: 'europe' as const, start: 1200, end: 1400 },
        { macroRegion: 'east_asia' as const, start: 1200, end: 1400 },
      ],
    };
    const result = layout(input([mongol]));
    const widths = result.ribbons[0]?.keyframes.map((frame) => frame.width) ?? [];
    expect(Math.max(...widths)).toBeLessThanOrEqual(ribbonWidth(0.5) + 1e-6);
  });

  it('hides a family that the viewport filtered out', () => {
    clearLayoutCache();
    const result = layout(
      input(
        [polity('inca', 1400, 1533, -72, 'andean'), polity('rome', -509, 476, 12)],
        {
          visibleFamilies: ['andean'],
        },
      ),
    );
    expect(result.ribbons.map((ribbon) => ribbon.polityId)).toEqual(['inca']);
  });

  it('lays out 300 ribbons in under 150 ms', () => {
    clearLayoutCache();
    const polities = Array.from({ length: 300 }, (_, index) => {
      const start = -3300 + (index % 40) * 80;
      const safeStart = start === 0 ? 1 : start;
      const end = Math.min(2000, safeStart + 160);
      return polity(
        `p${index}`,
        safeStart,
        end <= safeStart ? safeStart + 2 : end,
        ((index % 36) - 18) * 8,
      );
    });
    const bench = input(polities);
    const started = performance.now();
    const result = layout(bench);
    expect(performance.now() - started).toBeLessThan(150);
    expect(result.ribbons).toHaveLength(300);
    expect(result.ribbons.every((ribbon) => ribbon.d.length > 0)).toBe(true);
  });
});
