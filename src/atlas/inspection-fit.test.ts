import { describe, expect, it } from 'vitest';
import { inspectionCentre, inspectionLayout, inspectionScroll } from './inspection-fit';

describe('Complete-image inspection fit and pan', () => {
  it('fits a portrait into the height and centres its narrow axis', () => {
    const layout = inspectionLayout(
      { width: 1200, height: 1600 },
      { width: 1040, height: 520 },
      1,
    )!;
    expect(layout.fit).toEqual({ width: 390, height: 520 });
    expect(layout.stage).toEqual({ width: 1040, height: 520 });
    expect(layout.offset).toEqual({ x: 325, y: 0 });
    expect(inspectionScroll(layout, { x: 0.5, y: 0.5 })).toEqual({ x: 0, y: 0 });
  });
  it('fits a landscape into the width and centres its short axis', () => {
    const layout = inspectionLayout(
      { width: 1600, height: 800 },
      { width: 320, height: 520 },
      1,
    )!;
    expect(layout.fit).toEqual({ width: 320, height: 160 });
    expect(layout.offset).toEqual({ x: 0, y: 180 });
    expect(inspectionCentre(layout, { x: 0, y: 0 })).toEqual({ x: 0.5, y: 0.5 });
  });
  it('caps a small original at its natural pixels, while explicit zoom can enlarge it', () => {
    const fit = inspectionLayout(
      { width: 399, height: 268 },
      { width: 1040, height: 520 },
      1,
    )!;
    const zoomed = inspectionLayout({ width: 399, height: 268 }, fit.viewport, 1.5)!;
    expect(fit.fit).toEqual({ width: 399, height: 268 });
    expect(zoomed.image).toEqual({ width: 598.5, height: 402 });
  });
  it('preserves the viewport-centre point after zooming a manually panned image', () => {
    const from = inspectionLayout(
      { width: 1600, height: 1000 },
      { width: 400, height: 300 },
      2,
    )!;
    const anchor = inspectionCentre(from, { x: 210, y: 70 });
    const to = inspectionLayout({ width: 1600, height: 1000 }, from.viewport, 3)!;
    const scroll = inspectionScroll(to, anchor);
    expect(inspectionCentre(to, scroll).x).toBeCloseTo(anchor.x);
    expect(inspectionCentre(to, scroll).y).toBeCloseTo(anchor.y);
    expect(scroll.x).toBeCloseTo(415);
    expect(scroll.y).toBeCloseTo(180);
  });
  it('zooms a complete portrait around its centre instead of its upper background', () => {
    const layout = inspectionLayout(
      { width: 1200, height: 1600 },
      { width: 1040, height: 520 },
      1.5,
    )!;
    expect(layout.image).toEqual({ width: 585, height: 780 });
    expect(inspectionScroll(layout, { x: 0.5, y: 0.5 })).toEqual({ x: 0, y: 130 });
  });
  it('clamps the desired centre at an edge and resets all pan at fit', () => {
    const layout = inspectionLayout(
      { width: 1000, height: 1000 },
      { width: 400, height: 300 },
      2,
    )!;
    expect(inspectionScroll(layout, { x: 0, y: 1 })).toEqual({ x: 0, y: 300 });
    const fit = inspectionLayout({ width: 1000, height: 1000 }, layout.viewport, 1)!;
    expect(inspectionScroll(fit, { x: 0, y: 1 })).toEqual({ x: 0, y: 0 });
  });
  it('uses the newly selected source ratio and supports a changed viewport', () => {
    const portrait = inspectionLayout(
      { width: 600, height: 1200 },
      { width: 500, height: 400 },
      2,
    )!;
    const landscape = inspectionLayout(
      { width: 1200, height: 600 },
      portrait.viewport,
      1,
    )!;
    expect(landscape.fit).toEqual({ width: 500, height: 250 });
    const resized = inspectionLayout(
      { width: 600, height: 1200 },
      { width: 300, height: 300 },
      2,
    )!;
    const point = inspectionCentre(portrait, { x: 0, y: 180 });
    const pan = inspectionScroll(resized, point);
    expect(inspectionCentre(resized, pan).y).toBeCloseTo(point.y);
  });
  it.each([0, -1, NaN, Infinity])(
    'does not manufacture fit geometry from invalid dimensions %s',
    (width) => {
      expect(
        inspectionLayout({ width, height: 100 }, { width: 400, height: 300 }, 1),
      ).toBeNull();
      expect(
        inspectionLayout({ width: 100, height: 100 }, { width, height: 300 }, 1),
      ).toBeNull();
    },
  );
});
