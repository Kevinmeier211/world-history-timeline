import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { bundledGeography } from '../data/catalog.ts';
import type { Callout, Polity, Relation } from '../data/schema/index.ts';
import type { MacroRegion } from '../data/schema/primitives.ts';
import { MIN_RIBBON_W, PX_PER_YEAR } from './constants.ts';
import { yOfYear } from './drift.ts';
import { stableHash } from './hash.ts';
import { clearLayoutCache, layout } from './index.ts';
import { ribbonOverlap } from './metrics.ts';
import type { LayoutInput, LayoutResult } from './types.ts';
import { uncertaintyGeometry } from './uncertainty.ts';

function load(name: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(`src/layout/__fixtures__/${name}.json`, 'utf8'),
  ) as Record<string, unknown>;
}

function polity(
  id: string,
  start: number,
  end: number,
  longitude: number,
  extra: Partial<Polity> = {},
): Polity {
  return {
    id,
    name: id,
    family: 'latin_west',
    start,
    end,
    confidence: 'approximate',
    importance: 3,
    weight: 0.3,
    kind: 'state',
    anchor: [{ year: start, geo: [longitude, 40] }],
    summary: 'A synthetic polity for a layout fixture.',
    keyFacts: ['Synthetic.'],
    sourceIds: ['note'],
    verification: 'unverified',
    ...extra,
  };
}

function relation(
  id: string,
  type: Relation['type'],
  year: number,
  from: string[],
  to: string[],
): Relation {
  return {
    id,
    from,
    to,
    year,
    type,
    confidence: 'approximate',
    verification: 'unverified',
    sourceIds: ['note'],
  };
}

function run(
  polities: Polity[],
  relations: Relation[] = [],
  callouts: Callout[] = [],
): LayoutResult {
  const input: LayoutInput = {
    polities,
    relations,
    callouts,
    bands: [],
    geography: bundledGeography(),
    overrides: { ribbons: [], callouts: [] },
    viewport: { width: 1500, height: 900, zoomX: 1, zoomY: 1 },
    visibleFamilies: [],
    visibleMacroRegions: [],
  };
  clearLayoutCache();
  const first = layout(input);
  clearLayoutCache();
  const second = layout(input);
  expect(digest(first)).toBe(digest(second));
  return second;
}

function digest(value: unknown): string {
  return createHash('sha256').update(stableHash(value)).digest('hex');
}

function moves(path: string | undefined): number {
  return path ? path.split('M ').length - 1 : 0;
}

describe('golden fixtures', () => {
  it('fixture A keeps West left of East with two split curves', () => {
    expect(load('split-rome').name).toBe('A');
    const result = run(
      [
        polity('republic', -509, -27, 12, { weight: 0.4 }),
        polity('empire', -27, 395, 12, { weight: 0.5, importance: 4 }),
        polity('west', 395, 476, 2, { weight: 0.3 }),
        polity('east', 395, 1453, 29, { weight: 0.35, importance: 4 }),
      ],
      [
        relation('republic_empire', 'split', -27, ['republic'], ['empire']),
        relation('empire_halves', 'split', 395, ['empire'], ['west', 'east']),
      ],
    );
    const west = result.ribbons.find((ribbon) => ribbon.polityId === 'west');
    const east = result.ribbons.find((ribbon) => ribbon.polityId === 'east');
    expect(west?.keyframes[0]?.x).toBeLessThan(east?.keyframes[0]?.x ?? 0);
    expect(result.connectors.map((connector) => connector.type)).toEqual([
      'split',
      'split',
    ]);
    expect(ribbonOverlap(result.ribbons).overlaps).toBe(0);
    expect(digest(result)).toMatchInlineSnapshot(
      `"945a536e4c9c5ad2e7f11bff4e93741a0837da4724961e4ac85656a01557ba03"`,
    );
  });

  it('fixture B draws the Mongol ribbon and four successor legs', () => {
    const fixture = load('mongol-empire');
    expect(fixture.name).toBe('B');
    expect(fixture.children).toEqual(['yuan', 'ilkhanate', 'chagatai', 'golden_horde']);
    const spans: { macroRegion: MacroRegion; start: number; end: number }[] = [
      { macroRegion: 'east_asia', start: 1206, end: 1368 },
      { macroRegion: 'west_central_asia', start: 1218, end: 1368 },
      { macroRegion: 'west_central_asia', start: 1256, end: 1335 },
      { macroRegion: 'europe', start: 1240, end: 1300 },
    ];
    const result = run(
      [
        polity('mongol', 1206, 1368, 110, {
          name: 'Mongol Empire',
          family: 'turkic_mongol',
          weight: 0.6,
          importance: 4,
          spans,
        }),
        polity('yuan', 1368, 1500, 114, { family: 'turkic_mongol' }),
        polity('ilkhanate', 1368, 1500, 50, { family: 'turkic_mongol' }),
        polity('chagatai', 1368, 1500, 70, { family: 'turkic_mongol' }),
        polity('golden_horde', 1368, 1500, 45, { family: 'turkic_mongol' }),
      ],
      [
        relation(
          'mongol_successors',
          'split',
          1368,
          ['mongol'],
          ['yuan', 'ilkhanate', 'chagatai', 'golden_horde'],
        ),
      ],
    );
    expect(result.ribbons.map((ribbon) => ribbon.polityId)).toContain('mongol');
    expect(result.labels.find((label) => label.polityId === 'mongol')?.fitted).toBe(
      true,
    );
    expect(moves(result.connectors[0]?.d)).toBe(4);
    expect(ribbonOverlap(result.ribbons).overlaps).toBe(0);
    expect(digest(result)).toMatchInlineSnapshot(
      `"2036f0f0d90c76b4378186b125ea7288abfed44cf9146b0f1916f10c671d3690"`,
    );
  });

  it('fixture C packs a sixty-state fan-out without overlaps', () => {
    const fixture = load('dense-fanout');
    expect(fixture.name).toBe('C');
    const parents = 8;
    const children = 60;
    const polities: Polity[] = [];
    const relations: Relation[] = [];
    for (let index = 0; index < parents; index += 1) {
      const id = `p${index}`;
      polities.push(polity(id, 1700, 1800, -100 + index * 28, { weight: 0.25 }));
      const kids: string[] = [];
      const count =
        Math.floor(children / parents) + (index < children % parents ? 1 : 0);
      for (let child = 0; child < count; child += 1) {
        const childId = `c${index}${child}`;
        kids.push(childId);
        polities.push(
          polity(childId, 1800, 2000, -120 + (index * 8 + child) * 4, { weight: 0.2 }),
        );
      }
      relations.push(relation(`split_${id}`, 'split', 1800, [id], kids));
    }
    expect(polities).toHaveLength(parents + children);
    const input: LayoutInput = {
      polities,
      relations,
      callouts: [],
      bands: [],
      geography: bundledGeography(),
      overrides: { ribbons: [], callouts: [] },
      viewport: { width: 1500, height: 900, zoomX: 1, zoomY: 1 },
      visibleFamilies: [],
      visibleMacroRegions: [],
    };
    clearLayoutCache();
    const first = layout(input);
    clearLayoutCache();
    const started = performance.now();
    const result = layout(input);
    expect(digest(first)).toBe(digest(result));
    expect(performance.now() - started).toBeLessThan(100);
    const widths = result.ribbons.flatMap((ribbon) =>
      ribbon.keyframes.map((frame) => frame.width),
    );
    expect(Math.min(...widths)).toBeGreaterThanOrEqual(MIN_RIBBON_W - 1e-6);
    expect(ribbonOverlap(result.ribbons).overlaps).toBe(0);
    const drawn = result.labels.filter((label) => label.fitted || label.leader).length;
    expect(drawn / result.labels.length).toBeGreaterThanOrEqual(0.85);
    expect(digest(result)).toMatchInlineSnapshot(
      `"23be75d0ceae449010d387264ef05df20dfb68592370309af9dc805b41045ee9"`,
    );
  });

  it('fixture D keeps the Olmec gradient id and a 150-year fade', () => {
    const fixture = load('olmec-uncertain');
    expect(fixture.name).toBe('D');
    expect(fixture.uncertaintyYears).toBe(150);
    const result = run([
      polity('olmec', -1400, -400, -96, {
        family: 'mesoamerican',
        startUncertainty: 150,
      }),
    ]);
    const ribbon = result.ribbons[0];
    expect(ribbon).toBeDefined();
    if (!ribbon) return;
    const cap = uncertaintyGeometry(ribbon.polityId, ribbon.keyframes, 150);
    expect(cap.gradientId).toBe('uncertainty-olmec');
    expect(cap.fadePx).toBeCloseTo(150 * PX_PER_YEAR);
    expect(cap.dashArray).toBe('1.5 2.5');
    expect(cap.dashPath.length).toBeGreaterThan(0);
    expect(digest(cap)).toMatchInlineSnapshot(
      `"7dfd0afe6bdeeb26b19da51f9bd6477d3f7125a607b7b020965d69356409c0c7"`,
    );
  });

  it('fixture E crosses the missing year as nine years of pixels', () => {
    const fixture = load('bce-ce');
    expect(fixture.name).toBe('E');
    const result = run([polity('boundary', -5, 5, 12)]);
    const frames = result.ribbons[0]?.keyframes ?? [];
    const first = frames[0];
    const last = frames.at(-1);
    expect(last && first ? last.y - first.y : 0).toBeCloseTo(9 * PX_PER_YEAR);
    expect(yOfYear(1) - yOfYear(-1)).toBeCloseTo(PX_PER_YEAR);
    expect(result.axis.ticks.some((tick) => tick.year === 0)).toBe(false);
    expect(digest(result)).toMatchInlineSnapshot(
      `"f7061f00b9f5697541f8a8203dd4b39cd569f193d1159d06056335a5dcf2bda7"`,
    );
  });

  it('fixture F merges Castile and Aragon without a crossing', () => {
    expect(load('merge-spain').name).toBe('F');
    const result = run(
      [
        polity('castile', 1230, 1516, -4, { weight: 0.35 }),
        polity('aragon', 1230, 1516, 2, { weight: 0.35 }),
        polity('spain', 1516, 1700, -1, { weight: 0.45, importance: 4 }),
      ],
      [relation('spain_union', 'merge', 1516, ['castile', 'aragon'], ['spain'])],
    );
    const castile = result.ribbons.find((ribbon) => ribbon.polityId === 'castile');
    const aragon = result.ribbons.find((ribbon) => ribbon.polityId === 'aragon');
    const mean = (ribbon: { keyframes: readonly { x: number }[] } | undefined) => {
      const frames = ribbon?.keyframes ?? [];
      return frames.reduce((sum, frame) => sum + frame.x, 0) / frames.length;
    };
    expect(mean(castile)).toBeLessThan(mean(aragon));
    expect(result.connectors.map((connector) => connector.type)).toEqual(['merge']);
    expect(ribbonOverlap(result.ribbons).overlaps).toBe(0);
    expect(digest(result)).toMatchInlineSnapshot(
      `"d01901051281b1a8897b6290129ec5b9972f31809b98aaea9695f6bbbb6f1d0d"`,
    );
  });

  it('fixture G meets the conqueror on the side while Babylon continues', () => {
    expect(load('conquest-babylon').name).toBe('G');
    const result = run(
      [
        polity('achaemenid', -550, -330, 52, {
          family: 'persian_iranian',
          weight: 0.5,
        }),
        polity('neo_babylonian', -626, -400, 44, {
          family: 'mesopotamian',
          weight: 0.25,
        }),
      ],
      [
        relation(
          'achaemenid_babylon',
          'conquest',
          -539,
          ['achaemenid'],
          ['neo_babylonian'],
        ),
      ],
    );
    const babylon = result.ribbons.find(
      (ribbon) => ribbon.polityId === 'neo_babylonian',
    );
    const last = babylon?.keyframes.at(-1)?.y ?? 0;
    expect(last).toBeGreaterThan(yOfYear(-539));
    expect(result.connectors[0]?.type).toBe('conquest');
    expect(result.connectors[0]?.sideAttach).toBe(true);
    expect(ribbonOverlap(result.ribbons).overlaps).toBe(0);
    expect(digest(result)).toMatchInlineSnapshot(
      `"aa429ea5b3ec19c60d841928d35ad1894c05e6fbf25d3a3726eccde415039a33"`,
    );
  });

  it('fixture H puts a diacritic ellipsis outside a short ribbon', () => {
    const fixture = load('short-labels');
    expect(fixture.name).toBe('H');
    const ribbons = fixture.ribbons as { name: string }[];
    const name = ribbons[0]?.name ?? '';
    const result = run([polity('naser', 1900, 1930, 44, { name })]);
    const label = result.labels[0];
    expect(label?.orientation).toBe('outside');
    expect(label?.leader).toBeDefined();
    expect(label?.text).toContain('ā');
    expect(label?.text.endsWith('…')).toBe(true);
    expect(digest(result)).toMatchInlineSnapshot(
      `"7ddc57ad4830d91baab011372e2fda53811d9d40598223bd5aef2da64b66b02b"`,
    );
  });
});
