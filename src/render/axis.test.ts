import { createElement } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { posterWorld } from '../camera/camera.ts';
import { AXIS_END, AXIS_START } from '../layout/constants.ts';
import { cameraFromScroll } from './visible.ts';
import { Stage } from './Stage.tsx';
import { axisDensity, axisMarks, tickYears } from './axis.ts';

describe('axis and era bands', () => {
  it('steps the ticks with the scale and never emits year 0', () => {
    expect(axisDensity(1.4)).toEqual({ tick: 50, label: 100 });
    expect(axisDensity(0.8)).toEqual({ tick: 100, label: 500 });
    expect(axisDensity(0.2)).toEqual({ tick: 500, label: 500 });

    const centuries = tickYears(AXIS_START, AXIS_END, 100);
    expect(centuries).not.toContain(0);
    expect(centuries[0]).toBe(AXIS_START);
    expect(centuries.at(-1)).toBe(AXIS_END);
    expect(tickYears(-100, 100, 100)).toEqual([-100, 100]);
    expect(tickYears(10, 0, 100)).toEqual([]);

    const wide = axisMarks(1.4);
    expect(wide.labels).toContain(100);
    expect(wide.labels).not.toContain(50);
    expect(wide.ticks).toContain(50);
    expect(axisMarks(0.2).labels).not.toContain(100);
    expect(axisMarks(0.2).labels).toContain(1500);
    expect(axisMarks(0.2).labels).toContain(AXIS_START);
    expect(axisMarks(0.2).labels).toContain(AXIS_END);
  });

  it('draws six bands in both gutters and labels years for the scale', () => {
    const world = posterWorld();
    const view = render(
      createElement(Stage, {
        camera: cameraFromScroll(0, 0, 1),
        viewport: { width: 800, height: 600 },
        scale: 1,
        world,
      }),
    );
    expect(screen.getAllByText('Early Bronze')).toHaveLength(2);
    expect(screen.getAllByText('Modern')).toHaveLength(2);
    expect(view.container.querySelectorAll('.era-band')).toHaveLength(6);
    expect(view.container.querySelectorAll('.grid-major').length).toBeGreaterThan(5);
    expect(screen.getByText('1500 CE')).toBeInTheDocument();
    expect(screen.queryByText('100 CE')).not.toBeInTheDocument();
    expect(view.container.textContent).not.toMatch(/(^|\s)0(\s|$)/);

    view.rerender(
      createElement(Stage, {
        camera: cameraFromScroll(0, 0, 1.4),
        viewport: { width: 800, height: 600 },
        scale: 1.4,
        world,
      }),
    );
    expect(screen.getByText('100 CE')).toBeInTheDocument();
    expect(screen.queryByText('50 CE')).not.toBeInTheDocument();
  });
});
