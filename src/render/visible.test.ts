import { createElement } from 'react';

import { render, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DESIGN_WIDTH } from '../layout/constants.ts';
import { posterWorld } from '../camera/camera.ts';
import { Stage } from './Stage.tsx';
import { useVisibleSpans } from './useVisibleSpans.ts';
import {
  cameraFromScroll,
  cullY,
  stageScale,
  visibleWorld,
  type YSpan,
} from './visible.ts';

const spans: YSpan[] = [
  { id: 'above', y0: 0, y1: 40 },
  { id: 'edge', y0: 90, y1: 100 },
  { id: 'shown', y0: 120, y1: 180 },
  { id: 'overlap', y0: 190, y1: 240 },
  { id: 'below', y0: 400, y1: 480 },
];

describe('stage visibility', () => {
  it('maps scroll to design y and drops spans outside the padded window', () => {
    expect(stageScale(DESIGN_WIDTH, DESIGN_WIDTH)).toBe(1);
    expect(stageScale(DESIGN_WIDTH * 3, DESIGN_WIDTH)).toBe(1.6);
    expect(stageScale(300, DESIGN_WIDTH)).toBeCloseTo(300 / DESIGN_WIDTH, 8);
    expect(stageScale(0, DESIGN_WIDTH)).toBe(1);

    const camera = cameraFromScroll(0, 200, 2);
    const world = visibleWorld(camera, { width: 100, height: 80 }, 0);
    expect(world.y).toBeCloseTo(100, 8);
    expect(world.height).toBeCloseTo(40, 8);

    const window = visibleWorld(
      cameraFromScroll(0, 100, 1),
      { width: 50, height: 100 },
      0,
    );
    const kept = cullY(spans, window);
    expect(kept.map((span) => span.id)).toEqual(['edge', 'shown', 'overlap']);

    const padded = cullY(
      spans,
      visibleWorld(cameraFromScroll(0, 100, 1), { width: 50, height: 100 }, 1),
    );
    expect(padded.map((span) => span.id)).toContain('above');
    expect(padded.map((span) => span.id)).not.toContain('below');
  });

  it('mounts only the spans inside the hook window', () => {
    const camera = cameraFromScroll(0, 100, 1);
    const viewport = { width: 50, height: 100 };
    const { result } = renderHook(() => useVisibleSpans(camera, viewport, spans, 0));
    expect(result.current.map((span) => span.id)).toEqual(['edge', 'shown', 'overlap']);

    const world = posterWorld();
    const view = render(
      createElement(Stage, {
        camera,
        viewport,
        scale: 1,
        world,
        spans,
        padScreens: 0,
      }),
    );
    const svg = view.container.querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe(`0 0 ${world.width} ${world.height}`);
    expect(svg?.getAttribute('width')).toBe(String(world.width));
    expect(view.container.querySelectorAll('[data-span]').length).toBe(3);
    expect(view.container.querySelector('[data-span="below"]')).toBeNull();
    expect(view.container.querySelector('[data-span="shown"]')).not.toBeNull();
  });
});
