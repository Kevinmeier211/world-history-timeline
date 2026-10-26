import { createElement } from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { posterWorld } from '../camera/camera.ts';
import { Stage } from './Stage.tsx';
import { cameraFromScroll } from './visible.ts';
import { counterScaledPx, labelsAtScale, sheetBoost } from './labelScale.ts';
import type { LabelPaint, RibbonPaint } from './ribbonInk.ts';

function paint(id: string, y: number, importance: number, height = 40): LabelPaint {
  return {
    polityId: id,
    text: id,
    x: 100,
    y,
    width: 10,
    height,
    fontSize: 10,
    orientation: 'rotated',
    fill: '#2a241c',
    fitted: true,
    importance,
  };
}

function ribbon(id: string, y0: number, y1: number): RibbonPaint {
  return {
    id,
    familyId: 'latin_west',
    name: id,
    dates: '1–2',
    confidence: 'secure',
    verification: 'unverified',
    d: 'M0 0',
    fill: '#888888',
    edge: '#666666',
    ariaLabel: id,
    y0,
    y1,
    x: 100,
    fadePx: 0,
    dashPath: '',
    dashArray: '',
    gradientId: `g-${id}`,
  };
}

describe('overview label scale', () => {
  it('holds a 10px label at 10 screen px when the sheet is fit to the port', () => {
    expect(sheetBoost(1)).toBe(1);
    expect(sheetBoost(1.4)).toBe(1);
    expect(sheetBoost(0)).toBe(1);
    expect(counterScaledPx(10, 0.2) * 0.2).toBeCloseTo(10);
    expect(counterScaledPx(13, 1)).toBe(13);
    expect(counterScaledPx(12, 0.5)).toBe(24);
  });

  it('drops the less important name when the grown boxes overlap', () => {
    const kept = labelsAtScale([paint('low', 100, 2), paint('high', 120, 3)], 0.2);
    expect(kept.map((label) => label.polityId)).toEqual(['high']);
    expect(kept[0]?.fontSize).toBe(50);
  });

  it('keeps both names when the grown boxes are apart, and keeps a pinned name', () => {
    const apart = labelsAtScale([paint('low', 100, 2), paint('high', 800, 3)], 0.2);
    expect(apart.map((label) => label.polityId).sort()).toEqual(['high', 'low']);
    const pinned = labelsAtScale(
      [paint('low', 100, 2), paint('high', 120, 3)],
      0.2,
      'low',
    );
    expect(pinned.map((label) => label.polityId)).toEqual(['low']);
    expect(labelsAtScale([paint('a', 0, 2), paint('b', 0, 3)], 1)).toHaveLength(2);
    const fitted = labelsAtScale([paint('low', 100, 2), paint('high', 120, 3)], 0.9);
    expect(fitted).toHaveLength(2);
    expect(fitted[0]?.fontSize).toBeCloseTo(10 / 0.9);
  });

  it('paints the grown font on the stage at overview scale', () => {
    const { container } = render(
      createElement(Stage, {
        camera: cameraFromScroll(0, 0, 1),
        viewport: { width: 400, height: 300 },
        scale: 0.2,
        world: posterWorld(),
        ribbons: [ribbon('high', 100, 200), ribbon('low', 110, 210)],
        labels: [paint('low', 110, 2), paint('high', 100, 3)],
      }),
    );
    const svg = container.querySelector('svg');
    expect(svg?.style.getPropertyValue('--sheet-boost')).toBe('5');
    const texts = [...container.querySelectorAll('.ribbon-label')];
    expect(texts.map((node) => node.textContent)).toEqual(['high']);
    expect(texts[0]?.getAttribute('font-size')).toBe('50');
  });

  it('uses the print boost for type and the sheet size in inches', () => {
    const { container } = render(
      createElement(Stage, {
        camera: cameraFromScroll(0, 0, 1),
        viewport: { width: 1500, height: 4000 },
        scale: 1,
        world: posterWorld(),
        ribbons: [ribbon('high', 100, 200)],
        labels: [paint('high', 100, 3)],
        print: { boost: 2, widthIn: 4, heightIn: 8 },
      }),
    );
    const svg = container.querySelector('svg');
    expect(svg?.style.width).toBe('4in');
    expect(svg?.style.height).toBe('8in');
    expect(svg?.style.getPropertyValue('--sheet-boost')).toBe('2');
    expect(container.querySelector('.ribbon-label')?.getAttribute('font-size')).toBe(
      '20',
    );
  });
});
