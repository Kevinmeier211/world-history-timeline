import { readFileSync } from 'node:fs';
import { createElement } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { resetFocus } from '../state/focus.ts';
import { Ribbons } from './Ribbons.tsx';
import { Tooltip } from './Tooltip.tsx';
import type { RibbonPaint } from './ribbonInk.ts';

function ribbon(id: string, familyId: string): RibbonPaint {
  return {
    id,
    familyId,
    name: id === 'rome' ? 'Roman Empire' : 'Han Dynasty',
    dates: id === 'rome' ? 'c. 27 BCE – 476 CE' : '206 BCE – 220 CE',
    confidence: id === 'rome' ? 'approximate' : 'conventional',
    verification: 'unverified',
    d: 'M10 10 L30 10 L30 80 L10 80 Z',
    fill: '#652399',
    edge: '#531d7d',
    ariaLabel: id,
    y0: 10,
    y1: 80,
    fadePx: 0,
    dashPath: '',
    dashArray: '',
    gradientId: `uncertainty-${id}`,
  };
}

describe('lineage focus', () => {
  afterEach(() => {
    resetFocus();
  });

  it('dims the other family and shows name, dates, glyph, and verification dot', () => {
    const css = readFileSync('src/render/stage.css', 'utf8');
    expect(css).toContain('200ms');
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);

    render(
      createElement(
        'div',
        null,
        createElement(Ribbons, {
          ribbons: [ribbon('rome', 'latin_west'), ribbon('han', 'chinese')],
          labels: [],
        }),
        createElement(Tooltip),
      ),
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'rome' }), {
      clientX: 40,
      clientY: 50,
    });
    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveTextContent('Roman Empire');
    expect(tip).toHaveTextContent('c. 27 BCE – 476 CE');
    expect(tip).toHaveTextContent('c.');
    expect(tip.querySelector('.verify-unverified')).not.toBeNull();
    expect(document.querySelector('[data-polity="rome"]')).not.toHaveClass(
      'ribbon-dim',
    );
    expect(document.querySelector('[data-polity="han"]')).toHaveClass('ribbon-dim');

    fireEvent.pointerLeave(screen.getByRole('button', { name: 'rome' }), {
      relatedTarget: null,
    });
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(document.querySelector('[data-polity="han"]')).not.toHaveClass('ribbon-dim');
  });
});
