import { describe, expect, it } from 'vitest';

import { bundledGeography } from '../data/catalog.ts';
import type { LayoutInput, LayoutResult } from './types.ts';

const result: LayoutResult = {
  ribbons: [
    {
      polityId: 'rome',
      familyId: 'latin_west',
      d: '',
      keyframes: [{ y: 120, x: 400, width: 24 }],
    },
  ],
  connectors: [
    { relationId: 'rome_west', type: 'succession', d: '', sideAttach: false },
  ],
  labels: [
    {
      polityId: 'rome',
      text: 'Rome',
      x: 390,
      y: 140,
      width: 40,
      height: 12,
      fontSize: 11,
      orientation: 'horizontal',
      fitted: true,
    },
  ],
  callouts: [],
  plates: [],
  bands: [],
  axis: { ticks: [{ year: -27, y: 200, label: '27 BCE', major: true }] },
  debug: { lanes: [], boxes: [], violations: [] },
};

describe('layout types', () => {
  it('round-trips a result through JSON', () => {
    const again = JSON.parse(JSON.stringify(result)) as LayoutResult;
    expect(again.ribbons[0]?.polityId).toBe('rome');
    expect(again.ribbons[0]?.keyframes[0]?.width).toBe(24);
    expect(again.connectors[0]?.type).toBe('succession');
    expect(again.labels[0]?.fitted).toBe(true);
    expect(again.axis.ticks[0]?.year).toBe(-27);
    expect(again.debug.violations).toEqual([]);
  });

  it('accepts an empty roster as solver input', () => {
    const input: LayoutInput = {
      polities: [],
      relations: [],
      callouts: [],
      bands: [],
      geography: bundledGeography(),
      overrides: { ribbons: [], callouts: [] },
      viewport: { width: 1500, height: 900, zoomX: 1, zoomY: 1 },
      visibleFamilies: [],
      visibleMacroRegions: [],
    };
    const again = JSON.parse(JSON.stringify(input)) as LayoutInput;
    expect(again.viewport.zoomY).toBe(1);
    expect(again.geography.knots.length).toBeGreaterThan(1);
    expect(again.polities).toEqual([]);
  });
});
