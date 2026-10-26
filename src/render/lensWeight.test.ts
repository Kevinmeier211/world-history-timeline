import { describe, expect, it } from 'vitest';

import { arcsForLens, bandRole, lensOpacity, type LensRole } from './lensWeight.ts';

const roles: readonly LensRole[] = [
  'polity',
  'trade',
  'migration',
  'cultural',
  'climate',
  'pandemic',
  'collapse',
  'golden_age',
  'other',
];

describe('lens weight', () => {
  it('keeps every layer visible and emphasizes the active lens', () => {
    for (const role of roles) {
      expect(lensOpacity('all', role)).toBe(1);
      expect(lensOpacity('trade', role)).toBeGreaterThan(0);
      expect(lensOpacity('climate', role)).toBeGreaterThan(0);
      expect(lensOpacity('ideas', role)).toBeGreaterThan(0);
    }
    expect(lensOpacity('trade', 'trade')).toBe(1);
    expect(lensOpacity('trade', 'migration')).toBe(1);
    expect(lensOpacity('trade', 'polity')).toBe(0.55);
    expect(lensOpacity('trade', 'climate')).toBe(0.4);
    expect(lensOpacity('climate', 'pandemic')).toBe(1);
    expect(lensOpacity('climate', 'collapse')).toBe(1);
    expect(lensOpacity('ideas', 'golden_age')).toBe(1);
    expect(lensOpacity('ideas', 'cultural')).toBe(1);
    expect(bandRole('war')).toBe('other');
    expect(bandRole('climate')).toBe('climate');
    expect(arcsForLens('all')).toEqual([]);
    expect(arcsForLens('climate')).toEqual([]);
    expect(arcsForLens('trade')).toEqual(['trade', 'migration']);
    expect(arcsForLens('ideas')).toEqual(['cultural']);
  });
});
