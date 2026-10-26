import { describe, expect, it } from 'vitest';

import { benchRibbonCount, padRibbons, percentile } from './bench.ts';
import type { RibbonPaint } from './ribbonInk.ts';

function ribbon(id: string): RibbonPaint {
  return {
    id,
    familyId: 'andean',
    name: id,
    dates: '1–2 CE',
    confidence: 'conventional',
    verification: 'unverified',
    d: 'M0 0',
    fill: '#2F6F5A',
    edge: '#204a3c',
    ariaLabel: id,
    y0: 10,
    y1: 40,
    x: 0,
    fadePx: 0,
    dashPath: '',
    dashArray: '',
    gradientId: '',
  };
}

describe('ribbon bench', () => {
  it('pads to the requested count with unique ids in the same window', () => {
    const source = [ribbon('a'), ribbon('b')];
    expect(padRibbons(source, 2)).toHaveLength(2);
    const padded = padRibbons(source, 5);
    expect(padded.map((item) => item.id)).toEqual(['a', 'b', 'a~1', 'b~1', 'a~2']);
    expect(new Set(padded.map((item) => item.id)).size).toBe(5);
    expect(padded.every((item) => item.y0 === 10 && item.y1 === 40)).toBe(true);
    expect(padRibbons([], 4)).toEqual([]);
  });

  it('reads a capped bench count and a 95th percentile', () => {
    expect(benchRibbonCount('')).toBe(0);
    expect(benchRibbonCount('?bench=320')).toBe(320);
    expect(benchRibbonCount('?bench=0')).toBe(0);
    expect(benchRibbonCount('?bench=nope')).toBe(0);
    expect(benchRibbonCount('?bench=5000')).toBe(800);
    expect(percentile([], 0.95)).toBe(Number.POSITIVE_INFINITY);
    const samples = Array.from({ length: 100 }, (_, index) => index + 1);
    expect(percentile(samples, 0.95)).toBe(95);
    expect(percentile([4], 0.95)).toBe(4);
  });
});
