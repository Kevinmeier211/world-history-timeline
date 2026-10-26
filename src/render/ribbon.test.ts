import { createElement } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { posterWorld } from '../camera/camera.ts';
import { cameraFromScroll } from './visible.ts';
import { Ribbon } from './Ribbon.tsx';
import { RibbonLabel } from './RibbonLabel.tsx';
import { Stage } from './Stage.tsx';
import type { LabelPaint, RibbonPaint } from './ribbonInk.ts';

const ribbon: RibbonPaint = {
  id: 'rome',
  d: 'M10 80 L30 80 L30 200 L10 200 Z',
  fill: '#652399',
  edge: '#531d7d',
  ariaLabel: 'Roman Empire, 27 BCE – 476 CE, Latin West',
  y0: 80,
  y1: 200,
  fadePx: 24,
  dashPath: 'M10 80 L10 104',
  dashArray: '1.5 2.5',
  gradientId: 'uncertainty-rome',
};

const label: LabelPaint = {
  polityId: 'rome',
  text: 'Roman Empire',
  x: 90,
  y: 100,
  width: 20,
  height: 160,
  fontSize: 12,
  orientation: 'rotated',
  fill: '#f1e8d2',
  fitted: true,
};

describe('ribbon components', () => {
  afterEach(() => {
    cleanup();
  });

  it('is a focusable button with a faded cap and a rotated label', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const world = posterWorld();
    render(
      createElement(Stage, {
        camera: cameraFromScroll(0, 0, 1),
        viewport: { width: 400, height: 300 },
        scale: 1,
        world,
        ribbons: [ribbon],
        labels: [label],
        onSelect,
      }),
    );

    const button = screen.getByRole('button', { name: ribbon.ariaLabel });
    expect(button).toHaveAttribute('tabindex', '0');
    button.focus();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('rome');

    const text = document.querySelector('.ribbon-label');
    expect(text?.textContent).toBe('Roman Empire');
    expect(text?.getAttribute('transform')).toBe('rotate(90 100 180)');
    expect(text?.getAttribute('font-size')).toBe('12');
    expect(
      document.querySelector('.ribbon-uncertain')?.getAttribute('stroke-dasharray'),
    ).toBe('1.5 2.5');
    expect(document.querySelector('.ribbon-fade')).not.toBeNull();
  });

  it('drops a ribbon that sits outside the window and skips an unfit label', () => {
    const hidden = render(
      createElement(Stage, {
        camera: cameraFromScroll(0, 0, 1),
        viewport: { width: 100, height: 80 },
        scale: 1,
        world: posterWorld(),
        ribbons: [{ ...ribbon, y0: 4000, y1: 4200 }],
        labels: [{ ...label, fitted: false, orientation: 'outside' }],
      }),
    );
    expect(hidden.queryByRole('button', { name: ribbon.ariaLabel })).toBeNull();
    expect(hidden.container.querySelector('.ribbon-label')).toBeNull();
    cleanup();
    const unfit = render(
      createElement(RibbonLabel, { label: { ...label, fitted: false } }),
    );
    expect(unfit.container.querySelector('.ribbon-label')).toBeNull();
    cleanup();
    const dimmed = render(createElement(Ribbon, { ribbon, dimmed: true }));
    expect(dimmed.container.querySelector('.ribbon-dim')).not.toBeNull();
  });
});
