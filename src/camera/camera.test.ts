import { zoomIdentity } from 'd3-zoom';
import { describe, expect, it } from 'vitest';

import { AXIS_END, BOTTOM_PAD, DESIGN_WIDTH } from '../layout/constants.ts';
import { yOfYear } from '../layout/drift.ts';
import {
  FLY_MS,
  FIT_MAX,
  FIT_MIN,
  SCALE_MAX,
  SCALE_MIN,
  clampCamera,
  fitOverview,
  fitWidth,
  flyFrame,
  flyTarget,
  identityCamera,
  inertiaStep,
  pinchTransform,
  posterWorld,
  screenAt,
  uniformZoom,
  wheelAt,
  wheelFactor,
  worldAt,
  type Camera,
} from './camera.ts';

const view = { width: 800, height: 600 };
const sheet = { x: 0, y: 0, width: 2000, height: 4000 };

describe('camera', () => {
  it('matches a d3 zoom transform and the wheel factor', () => {
    const camera: Camera = { x: 12, y: -40, kx: 1.5, ky: 1.5 };
    const zoom = uniformZoom(camera);
    const applied = zoomIdentity
      .translate(camera.x, camera.y)
      .scale(camera.kx)
      .apply([10, 20]);
    expect(screenAt(camera, { x: 10, y: 20 })).toEqual({
      x: applied[0],
      y: applied[1],
    });
    expect(zoom.k).toBe(1.5);
    expect(wheelFactor(-100, 0, false)).toBeCloseTo(2 ** 0.2, 10);
    expect(wheelFactor(120, 1, false)).toBeCloseTo(2 ** -6, 10);
    expect(wheelFactor(-10, 0, true)).toBeCloseTo(2 ** 0.2, 10);
  });

  it('keeps the world point under the pointer fixed while the scale changes', () => {
    const start = identityCamera();
    const pointer = { x: 120, y: 80 };
    const before = worldAt(start, pointer);
    const zoomed = wheelAt(
      start,
      pointer,
      { deltaY: -100, deltaMode: 0, ctrlKey: false, shiftKey: false },
      view,
      sheet,
    );
    const after = worldAt(zoomed, pointer);
    expect(zoomed.kx).toBeCloseTo(wheelFactor(-100), 10);
    expect(zoomed.ky).toBe(zoomed.kx);
    expect(after.x).toBeCloseTo(before.x, 8);
    expect(after.y).toBeCloseTo(before.y, 8);

    const shifted = wheelAt(
      zoomed,
      pointer,
      { deltaY: -100, deltaMode: 0, ctrlKey: false, shiftKey: true },
      view,
      sheet,
    );
    expect(shifted.kx).toBeCloseTo(zoomed.kx, 8);
    expect(shifted.ky).toBeGreaterThan(zoomed.ky);
    expect(worldAt(shifted, pointer).y).toBeCloseTo(worldAt(zoomed, pointer).y, 6);
  });

  it('clamps panning to the sheet and centers a small sheet', () => {
    const pulled = clampCamera({ x: 400, y: 50, kx: 1, ky: 1 }, view, sheet);
    expect(pulled.x).toBe(0);
    const pushed = clampCamera({ x: -5000, y: -5000, kx: 1, ky: 1 }, view, sheet);
    expect(pushed.x).toBeCloseTo(view.width - sheet.width, 6);
    expect(pushed.y).toBeCloseTo(view.height - sheet.height, 6);
    const tiny = clampCamera({ x: 0, y: 0, kx: 1, ky: 1 }, view, {
      x: 0,
      y: 0,
      width: 100,
      height: 80,
    });
    expect(tiny.x).toBeCloseTo((view.width - 100) / 2, 6);
    expect(tiny.y).toBeCloseTo((view.height - 80) / 2, 6);
    expect(clampCamera(identityCamera(), { width: 0, height: 10 }, sheet)).toEqual(
      identityCamera(),
    );
  });

  it('fits the poster width inside 0.8–1.6 and the overview to the whole sheet', () => {
    const wide = fitWidth({ width: DESIGN_WIDTH, height: 900 }, posterWorld());
    expect(wide.kx).toBe(1);
    expect(wide.ky).toBe(1);
    expect(wide.x).toBe(0);
    expect(wide.y).toBe(0);

    const narrow = fitWidth({ width: 600, height: 900 }, posterWorld());
    expect(narrow.kx).toBe(FIT_MIN);
    expect(narrow.x).toBe(0);

    const huge = fitWidth({ width: DESIGN_WIDTH * 3, height: 900 }, posterWorld());
    expect(huge.kx).toBe(FIT_MAX);
    expect(huge.x).toBeGreaterThan(0);

    const overview = fitOverview({ width: 1440, height: 900 }, posterWorld());
    const world = posterWorld();
    const limit = Math.min(1440 / world.width, 900 / world.height);
    expect(overview.kx).toBeCloseTo(limit, 8);
    expect(overview.ky).toBe(overview.kx);
    expect(limit).toBeLessThan(FIT_MIN);
    const top = screenAt(overview, { x: 0, y: 0 });
    const bottom = screenAt(overview, { x: world.width, y: world.height });
    expect(top.y).toBeGreaterThanOrEqual(-0.5);
    expect(bottom.y).toBeLessThanOrEqual(900.5);
    expect(world.height).toBeCloseTo(yOfYear(AXIS_END) + BOTTOM_PAD, 6);
  });

  it('pinch-zooms around the finger midpoint', () => {
    const start = identityCamera();
    const next = pinchTransform(
      start,
      [
        { screen: { x: 100, y: 200 }, world: { x: 100, y: 200 } },
        { screen: { x: 300, y: 200 }, world: { x: 300, y: 200 } },
      ],
      view,
      sheet,
    );
    expect(next.kx).toBeCloseTo(1, 8);
    const wider = pinchTransform(
      start,
      [
        { screen: { x: 0, y: 200 }, world: { x: 100, y: 200 } },
        { screen: { x: 400, y: 200 }, world: { x: 300, y: 200 } },
      ],
      view,
      sheet,
    );
    expect(wider.kx).toBeCloseTo(2, 8);
    const mid = worldAt(wider, { x: 200, y: 200 });
    expect(mid.x).toBeCloseTo(200, 6);
    expect(mid.y).toBeCloseTo(200, 6);
  });

  it('flies to a year in at most 600 ms and coasts to a stop', () => {
    const from = identityCamera();
    const content = posterWorld();
    const to = flyTarget({
      year: 1,
      x: 750,
      zoom: 1,
      viewport: { width: 800, height: 600 },
      content,
    });
    expect(worldAt(to, { x: 400, y: 300 }).y).toBeCloseTo(yOfYear(1), 5);
    expect(worldAt(to, { x: 400, y: 300 }).x).toBeCloseTo(750, 5);
    expect(flyFrame(from, to, 0, false)).toEqual(from);
    expect(flyFrame(from, to, FLY_MS, false)).toEqual(to);
    expect(flyFrame(from, to, 0, true)).toEqual(to);
    const mid = flyFrame(from, to, FLY_MS / 2, false);
    expect(Math.abs(mid.y - from.y)).toBeGreaterThan(Math.abs(to.y - from.y) / 2);

    let coast = inertiaStep(identityCamera(), { x: -2, y: 0 }, 16, view, sheet);
    expect(coast.camera.x).toBeLessThan(0);
    let guard = 0;
    while (!coast.done && guard < 80) {
      coast = inertiaStep(coast.camera, coast.velocity, 16, view, sheet);
      guard += 1;
    }
    expect(coast.done).toBe(true);
    expect(coast.camera.x).toBeGreaterThanOrEqual(view.width - sheet.width - 0.01);
    expect(
      wheelAt(identityCamera(), { x: 1, y: 1 }, { deltaY: -5000 }, view, sheet).kx,
    ).toBe(SCALE_MAX);
    expect(
      wheelAt(identityCamera(), { x: 1, y: 1 }, { deltaY: 5000 }, view, sheet).kx,
    ).toBe(SCALE_MIN);
  });
});
