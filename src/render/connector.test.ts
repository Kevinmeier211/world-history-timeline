import { createElement } from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { posterWorld } from '../camera/camera.ts';
import { Connectors } from './Connectors.tsx';
import { Stage } from './Stage.tsx';
import { cameraFromScroll } from './visible.ts';
import type { ConnectorPaint } from './connectorInk.ts';

function paint(
  type: ConnectorPaint['type'],
  extra: Partial<ConnectorPaint> = {},
): ConnectorPaint {
  return {
    id: `rel_${type}`,
    d: 'M 10 100 L 30 200 Z',
    type,
    fill: '#652399',
    dasharray: '',
    hatch: false,
    y0: 100,
    y1: 200,
    ...extra,
  };
}

describe('connector components', () => {
  it('draws solid, dashed, and hatched flows', () => {
    const { container } = render(
      createElement(Connectors, {
        connectors: [
          paint('succession'),
          paint('disputed', { dasharray: '4 3' }),
          paint('migration', { dasharray: '1 2.5' }),
          paint('conquest', { hatch: true }),
        ],
      }),
    );
    const solid = container.querySelector('.connector-succession .connector-flow');
    expect(solid?.getAttribute('fill')).toBe('#652399');
    expect(solid?.getAttribute('stroke')).toBe('none');
    const dashed = container.querySelector('.connector-disputed .connector-flow');
    expect(dashed?.getAttribute('fill')).toBe('none');
    expect(dashed?.getAttribute('stroke-dasharray')).toBe('4 3');
    expect(
      container
        .querySelector('.connector-migration .connector-flow')
        ?.getAttribute('stroke-dasharray'),
    ).toBe('1 2.5');
    expect(container.querySelector('.connector-hatch')).not.toBeNull();
    expect(container.querySelector('#connector-hatch')).not.toBeNull();
  });

  it('mounts a connector only inside the window and paints it under the ribbons', () => {
    const world = posterWorld();
    const { container } = render(
      createElement(Stage, {
        camera: cameraFromScroll(0, 0, 1),
        viewport: { width: 400, height: 300 },
        scale: 1,
        world,
        connectors: [paint('split'), paint('merge', { y0: 5000, y1: 5200, id: 'far' })],
        ribbons: [],
      }),
    );
    expect(container.querySelectorAll('.connector')).toHaveLength(1);
    expect(container.querySelector('[data-relation="far"]')).toBeNull();
    const nodes = [...container.querySelector('svg')!.children].map(
      (node) => (node as SVGElement).className.baseVal,
    );
    expect(nodes.indexOf('connectors')).toBeLessThan(nodes.indexOf('ribbons'));
  });
});
