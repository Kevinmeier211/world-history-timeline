import { createElement } from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Pictogram } from './Pictogram.tsx';
import { PICTOGRAM_STROKE, PICTOGRAMS, pictogramForKind } from './pictograms.ts';

describe('pictograms', () => {
  it('keeps at least 24 icons on one grid and one stroke', () => {
    const names = Object.keys(PICTOGRAMS);
    expect(names.length).toBeGreaterThanOrEqual(24);
    for (const name of names) {
      const path = PICTOGRAMS[name as keyof typeof PICTOGRAMS];
      expect(path.length).toBeGreaterThan(8);
      expect(path).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    }
    expect(PICTOGRAM_STROKE).toBe(1.5);
  });

  it('maps every callout kind to an icon in the set', () => {
    const kinds = [
      'event',
      'person',
      'invention',
      'monument',
      'text',
      'climate',
      'trade',
    ] as const;
    for (const kind of kinds) {
      expect(PICTOGRAMS[pictogramForKind(kind)]).toBeTruthy();
    }
  });

  it('draws the path at the shared stroke weight', () => {
    const view = render(createElement(Pictogram, { name: 'pyramid' }));
    const path = view.container.querySelector('path');
    expect(path?.getAttribute('stroke-width')).toBe('1.5');
    expect(path?.getAttribute('fill')).toBe('none');
    expect(path?.getAttribute('d')).toBe(PICTOGRAMS.pyramid);
    view.unmount();
  });
});
