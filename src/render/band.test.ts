import { createElement } from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { posterWorld } from '../camera/camera.ts';
import { Bands } from './Bands.tsx';
import { Stage } from './Stage.tsx';
import type { BandPaint } from './bandInk.ts';
import { cameraFromScroll } from './visible.ts';

const climate: BandPaint = {
  id: 'band_42_kiloyear',
  type: 'climate',
  hatch: 'horizontal',
  x: 84,
  y: 120,
  width: 400,
  height: 70,
  label: '4.2 KILOYEAR',
  rotated: true,
};

describe('band components', () => {
  it('hatches a climate band and writes the margin label', () => {
    const { container } = render(createElement(Bands, { bands: [climate] }));
    expect(container.querySelector('.band-hatch')?.getAttribute('fill')).toBe(
      'url(#band-horizontal)',
    );
    expect(container.querySelector('.band-label')?.textContent).toBe('4.2 KILOYEAR');
    expect(container.querySelector('.band-label')?.getAttribute('transform')).toContain(
      'rotate(-90',
    );
  });

  it('paints bands under connectors and drops a band outside the window', () => {
    const { container } = render(
      createElement(Stage, {
        camera: cameraFromScroll(0, 0, 1),
        viewport: { width: 400, height: 300 },
        scale: 1,
        world: posterWorld(),
        bands: [climate, { ...climate, id: 'far', y: 5000, height: 40, label: null }],
      }),
    );
    expect(container.querySelectorAll('.cross-band')).toHaveLength(1);
    const nodes = [...container.querySelector('svg')!.children].map(
      (node) => (node as SVGElement).className.baseVal,
    );
    expect(nodes.indexOf('cross-bands')).toBeLessThan(nodes.indexOf('connectors'));
    expect(nodes.indexOf('connectors')).toBeLessThan(nodes.indexOf('ribbons'));
  });
});
