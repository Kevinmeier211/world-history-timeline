import { describe, expect, it } from 'vitest';

import { bundledGeography } from '../data/catalog.ts';
import type { Polity, Relation } from '../data/schema/index.ts';
import { buildConnector, flowShares } from './connectors.ts';
import { clipToLaneWidth, sampleAt, type DatedPoint } from './frames.ts';
import { stableHash } from './hash.ts';
import { clearLayoutCache, layout } from './index.ts';
import { canvasTextMeasurer, labelFit } from './labelFit.ts';
import { solveLanes, stableLaneOrder, type LaneRibbon } from './laneSolver.ts';
import { convergeParents, lineageSeedMap, packSplitSeeds } from './lineageSeed.ts';
import { droppedCallouts } from './metrics.ts';
import { nudgeCallout } from './overrides.ts';
import { projectX } from './projectX.ts';
import {
  monotoneTangents,
  ribbonPath,
  sampleCenterline,
  withWidthProfile,
} from './ribbonGeometry.ts';
import { placeRibbonLabel } from './shortLabel.ts';
import { buildSlices } from './slices.ts';
import { wideRibbon } from './spanRibbon.ts';
import type { LayoutInput } from './types.ts';
import { uncertaintyGeometry } from './uncertainty.ts';

const knots = bundledGeography().knots;

function lane(id: string, desiredX: number): LaneRibbon {
  return { id, familyId: 'latin_west', weight: 0.3, importance: 3, desiredX };
}

function polity(id: string, start: number, end: number, importance = 3): Polity {
  return {
    id,
    name: id,
    family: 'latin_west',
    start,
    end,
    confidence: 'approximate',
    importance: importance as Polity['importance'],
    weight: 0.3,
    kind: 'state',
    anchor: [{ year: start, geo: [12, 40] }],
    summary: 'A synthetic polity for a branch test.',
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

describe('layout branch gaps', () => {
  it('evicts the oldest cached layout and filters by macro-region', () => {
    clearLayoutCache();
    const first = layout(input([polity('a', 1000, 1100)]));
    for (let index = 0; index < 4; index += 1) {
      layout(input([polity(`b${index}`, 1200 + index, 1300 + index)]));
    }
    clearLayoutCache();
    const again = layout(input([polity('a', 1000, 1100)]));
    expect(again).not.toBe(first);
    const europe = layout(
      input(
        [
          polity('rome', 1000, 1100),
          { ...polity('inca', 1000, 1100), family: 'andean' },
        ],
        { visibleMacroRegions: ['europe'] },
      ),
    );
    expect(europe.ribbons.map((ribbon) => ribbon.polityId)).toEqual(['rome']);
  });

  it('breaks a ribbon that was culled out of a crowded middle slice', () => {
    clearLayoutCache();
    const crowd = Array.from({ length: 16 }, (_, index) => ({
      ...polity(`c${index}`, 1100, 1150, 5),
      weight: 1,
      anchor: [{ year: 1100, geo: [-20 + index, 40] as [number, number] }],
    }));
    const result = layout(
      input([{ ...polity('thin', 1000, 1300, 2), weight: 1 }, ...crowd]),
    );
    const thin = result.ribbons.find((ribbon) => ribbon.polityId === 'thin');
    expect(thin?.keyframes.some((frame) => frame.breakBefore)).toBe(true);
  });

  it('places an unattached callout and a plate', () => {
    clearLayoutCache();
    const result = layout(
      input([polity('rome', -200, 200)], {
        callouts: [
          {
            id: 'note',
            title: 'Note',
            year: 1,
            kind: 'event',
            importance: 4,
            blurb: 'A short note.',
            mediaId: 'seal',
            sourceIds: ['note'],
            confidence: 'approximate',
            verification: 'unverified',
          },
          {
            id: 'loose',
            title: 'Loose',
            year: 50,
            kind: 'event',
            importance: 3,
            blurb: 'No ribbon anchor.',
            sourceIds: ['note'],
            confidence: 'approximate',
            verification: 'unverified',
          },
        ],
      }),
    );
    expect(result.plates[0]?.mediaId).toBe('seal');
    expect(result.callouts.map((card) => card.calloutId).sort()).toEqual([
      'loose',
      'note',
    ]);
  });

  it('counts dropped, marked, and placed callouts', () => {
    const counts = droppedCallouts([
      {
        calloutId: 'a',
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        placed: true,
        marker: false,
      },
      {
        calloutId: 'b',
        x: 0,
        y: 0,
        width: 6,
        height: 6,
        placed: false,
        marker: true,
      },
      {
        calloutId: 'c',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        placed: false,
        marker: false,
      },
    ]);
    expect(counts).toEqual({ placed: 1, markers: 1, dropped: 1 });
    const kept = nudgeCallout(
      {
        calloutId: 'a',
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        placed: true,
        marker: false,
      },
      undefined,
    );
    expect(kept.x).toBe(1);
  });

  it('hashes undefined and ignores an undefined field', () => {
    expect(stableHash(undefined)).toBe('null');
    expect(stableHash({ b: 1, a: undefined })).toBe('{"b":1}');
  });

  it('rejects a projection with nothing to place and an unknown column', () => {
    expect(() => projectX({ knots })).toThrow(/longitude or an anchor/);
    expect(() => projectX({ knots, anchors: [{ year: 1, xKey: 'atlantis' }] })).toThrow(
      /unknown anchor/,
    );
    expect(() => projectX({ knots, anchors: [{ year: 1 }] })).toThrow(/geo or xKey/);
    expect(projectX({ knots, longitude: 10, familyBias: 5 })).toBe(1);
    expect(projectX({ knots, longitude: 10, familyBias: -5 })).toBe(0);
  });

  it('fits a forced horizontal label and a box that is too small', () => {
    const measure = { measure: (text: string, size: number) => text.length * size };
    const horizontal = placeRibbonLabel(
      { id: 'rome', name: 'Rome', x: 200, y: 0, width: 40, height: 200 },
      measure,
      undefined,
      'horizontal',
    );
    expect(horizontal.orientation).toBe('horizontal');
    const hover = placeRibbonLabel(
      {
        id: 'rome',
        name: 'Antidisestablishmentarianism',
        x: 200,
        y: 0,
        width: 8,
        height: 80,
      },
      measure,
      undefined,
      'along',
    );
    expect(hover.fitted).toBe(false);
    expect(labelFit('Rome', undefined, { w: 4, h: 4 }, measure)).toBeNull();
    const text = canvasTextMeasurer();
    expect(text.measure('Ab', 10)).toBeGreaterThan(0);
    expect(text.measure('Ab', 10)).toBe(text.measure('Ab', 10));
  });

  it('covers empty curves, a matched width, and a negative zero', () => {
    expect(withWidthProfile([], [{ y: 5, width: 10 }])).toEqual([]);
    expect(
      withWidthProfile(
        [
          { y: 0, x: 0, width: 10 },
          { y: 10, x: 0, width: 10 },
        ],
        [
          { y: -5, width: 4 },
          { y: 0, width: 8 },
          { y: 5, width: 12 },
        ],
      ).map((point) => point.width),
    ).toEqual([8, 12, 10]);
    expect(sampleCenterline([])).toEqual([]);
    expect(sampleCenterline([{ y: 0, x: 1, width: 2 }])).toEqual([
      { y: 0, x: 1, width: 2 },
    ]);
    expect(monotoneTangents([0, 10], [5, 5])).toEqual([0, 0]);
    expect(monotoneTangents([0, 1, 2], [0, 10, 0])[1]).toBe(0);
    expect(ribbonPath([{ y: 0, x: -0.001, width: 10 }])).toBe('');
    expect(ribbonPath([])).toBe('');
  });

  it('seeds nothing when the parent or the child is missing', () => {
    const ribbons = [lane('child', 100)];
    expect(
      lineageSeedMap(
        ribbons,
        [{ type: 'split', year: 1, from: [], to: ['child'] }],
        1,
        new Map(),
      ).size,
    ).toBe(0);
    expect(
      lineageSeedMap(
        ribbons,
        [{ type: 'merge', year: 1, from: ['gone'], to: ['child'] }],
        1,
        new Map(),
      ).size,
    ).toBe(0);
    expect(
      lineageSeedMap(
        ribbons,
        [{ type: 'merge', year: 1, from: ['parent'], to: ['missing'] }],
        1,
        new Map([['parent', 40]]),
      ).size,
    ).toBe(0);
    const aimed = convergeParents(
      [lane('parent', 10)],
      [{ type: 'merge', year: 5, from: ['parent'], to: ['missing'] }],
      5,
      [],
    );
    expect(aimed[0]?.desiredX).toBe(10);
    expect(packSplitSeeds(100, []).size).toBe(0);
    expect(stableLaneOrder(['gone'], [lane('a', 1)])).toEqual(['a']);
  });

  it('scales shares and skips a connector with no target', () => {
    expect(flowShares([])).toEqual([]);
    expect(flowShares(['a', 'b'], [0, 0])).toEqual([0.5, 0.5]);
    expect(flowShares(['a', 'b'], [2, 2])).toEqual([0.5, 0.5]);
    const missing = buildConnector(
      { id: 'gone', type: 'split', from: ['parent'], to: ['child'] },
      new Map([['parent', { id: 'parent', x: 10, y: 10, width: 20 }]]),
    );
    expect(missing.d).toBe('');
    const merge = buildConnector(
      { id: 'join', type: 'merge', from: ['a'], to: [] },
      new Map(),
    );
    expect(merge.flows).toEqual([]);
  });

  it('samples an empty lane, a flat ribbon, and a zero-length slice', () => {
    const point: DatedPoint = { y: 10, x: 4, width: 6, year: 1 };
    expect(clipToLaneWidth([], [point])[0]?.width).toBe(6);
    expect(clipToLaneWidth([{ y: 0, width: 2 }], [{ ...point, y: -5 }])[0]?.width).toBe(
      2,
    );
    expect(sampleAt([], 0)).toBeUndefined();
    expect(sampleAt([point], 0)?.y).toBe(10);
    expect(sampleAt([point, { ...point, y: 20, year: 2 }], 30)?.y).toBe(20);
    const cap = uncertaintyGeometry('olmec', [], 150, -1);
    expect(cap.dashPath).toBe('');
    expect(cap.fadePx).toBe(0);
    expect(buildSlices([{ id: 'a', start: 5, end: 5 }])).toEqual([]);
    expect(wideRibbon([])).toEqual([]);
    const solved = solveLanes([
      {
        start: 1,
        end: 2,
        ribbons: [lane('a', 10)],
      },
    ]);
    expect(solved[0]?.lanes[0]?.id).toBe('a');
  });

  it('drops a relation whose polity was not drawn', () => {
    clearLayoutCache();
    const relation: Relation = {
      id: 'missing',
      from: ['rome'],
      to: ['gone'],
      year: 100,
      type: 'succession',
      confidence: 'approximate',
      verification: 'unverified',
      sourceIds: ['note'],
    };
    const result = layout(input([polity('rome', 1, 200)], { relations: [relation] }));
    expect(result.connectors).toEqual([]);
  });
});
