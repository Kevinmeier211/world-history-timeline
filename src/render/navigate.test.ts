import { createElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SCALE_MAX, SCALE_MIN } from '../camera/camera.ts';
import { ZoomBar } from './ZoomBar.tsx';
import {
  anchoredScroll,
  chartCommand,
  minimapHeight,
  overlayOffsets,
  panScroll,
  scrollFromMinimap,
  sheetMinWidth,
  steppedScale,
  viewportRect,
} from './navigate.ts';

describe('chart navigation', () => {
  it('steps the zoom and keeps the center still', () => {
    expect(steppedScale(1, 1)).toBeCloseTo(1.2);
    expect(steppedScale(1, -1)).toBeCloseTo(1 / 1.2);
    expect(steppedScale(SCALE_MAX, 1)).toBe(SCALE_MAX);
    expect(steppedScale(SCALE_MIN, -1)).toBe(SCALE_MIN);
    expect(anchoredScroll(100, 200, 1, 2)).toBeCloseTo(300);
    expect(chartCommand('+', false)).toBe('in');
    expect(chartCommand('=', false)).toBe('in');
    expect(chartCommand('-', false)).toBe('out');
    expect(chartCommand('ArrowDown', false)).toBe('down');
    expect(chartCommand('Home', false)).toBe('home');
    expect(chartCommand('End', false)).toBe('end');
    expect(chartCommand('+', true)).toBeNull();
    expect(chartCommand('a', false)).toBeNull();
  });

  it('pans inside the sheet and maps the minimap', () => {
    expect(
      panScroll(
        'home',
        { top: 40, left: 0 },
        { width: 100, height: 80 },
        { width: 100, height: 400 },
      ),
    ).toEqual({ top: 0, left: 0 });
    expect(
      panScroll(
        'end',
        { top: 0, left: 0 },
        { width: 100, height: 80 },
        { width: 100, height: 400 },
      ).top,
    ).toBe(320);
    expect(
      panScroll(
        'down',
        { top: 0, left: 0 },
        { width: 100, height: 100 },
        { width: 100, height: 400 },
      ).top,
    ).toBe(20);
    expect(
      panScroll(
        'up',
        { top: 5, left: 0 },
        { width: 100, height: 100 },
        { width: 100, height: 400 },
      ).top,
    ).toBe(0);
    expect(minimapHeight(1500, 3000)).toBeCloseTo(112);
    expect(viewportRect(0, 100, 1, 1000, 100)).toEqual({ y: 0, height: 10 });
    expect(scrollFromMinimap(0.5, 1000, 100, 2)).toBeCloseTo(950);
    expect(sheetMinWidth(1412, 1412)).toBe(0);
    expect(sheetMinWidth(400, 1412)).toBe(0);
    expect(sheetMinWidth(1694, 1412)).toBe(1694);
    expect(
      overlayOffsets(
        { top: 100, right: 1400, bottom: 860 },
        { width: 1440, height: 900 },
      ),
    ).toEqual({ top: 108, right: 48, bottom: 48 });
  });

  it('the zoom buttons call their handlers', async () => {
    const user = userEvent.setup();
    const onIn = vi.fn();
    const onOverview = vi.fn();
    render(
      createElement(ZoomBar, {
        onIn,
        onOut: vi.fn(),
        onFit: vi.fn(),
        onOverview,
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    await user.click(screen.getByRole('button', { name: 'Overview' }));
    expect(onIn).toHaveBeenCalledOnce();
    expect(onOverview).toHaveBeenCalledOnce();
  });
});
