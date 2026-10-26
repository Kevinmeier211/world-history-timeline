import { createElement } from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Callout } from './Callout.tsx';
import {
  calloutBlurb,
  calloutType,
  textLengthFor,
  type CalloutViewModel,
} from './calloutView.ts';
import { PICTOGRAMS } from './pictograms.ts';

const blurb =
  'Marks the traditional boundary between prehistory and recorded history today.';

function model(extra: Partial<CalloutViewModel> = {}): CalloutViewModel {
  return {
    id: 'node_cuneiform',
    title: 'Invention of Cuneiform Writing',
    yearLabel: '3200 BCE',
    blurb,
    importance: 4,
    x: 200,
    y: 80,
    width: 132,
    height: 48,
    marker: false,
    leader: { x1: 160, y1: 104, x2: 200, y2: 104 },
    pictogram: 'scroll',
    ...extra,
  };
}

describe('callout', () => {
  it('rejects a blurb longer than 14 words', () => {
    expect(calloutBlurb(blurb).split(/\s+/)).toHaveLength(10);
    expect(() => calloutBlurb(`${blurb} extra words that do not fit the card`)).toThrow(
      /14 words/,
    );
  });

  it('sizes the title with importance and keeps the body at 11', () => {
    expect(calloutType(5).title).toBe(13);
    expect(calloutType(4).title).toBe(12);
    expect(calloutType(2)).toEqual({ title: 11, body: 11, rule: 1, icon: 18 });
    expect(textLengthFor('Hi', 11, 80)).toBeUndefined();
    expect(textLengthFor('Invention of Cuneiform Writing', 12, 90)).toBe(90);
  });

  it('paints the year, the full blurb, a pictogram, and a leader', () => {
    const view = render(createElement(Callout, { model: model() }));
    const card = view.container.querySelector('[data-callout-card]');
    expect(card?.getAttribute('aria-label')).toContain(blurb);
    expect(view.container.querySelector('.callout-year')?.textContent).toBe('3200 BCE');
    expect(
      view.container.querySelector('.callout-title')?.getAttribute('font-size'),
    ).toBe('12');
    expect(view.container.querySelector('.callout-leader')?.getAttribute('x1')).toBe(
      '160',
    );
    expect(view.container.querySelector('path')?.getAttribute('d')).toBe(
      PICTOGRAMS.scroll,
    );
    view.unmount();
  });

  it('reserves a plate and still draws the pictogram there', () => {
    const view = render(
      createElement(Callout, {
        model: model({
          plate: { x: 332, y: 76, width: 56, height: 56 },
        }),
      }),
    );
    const plate = view.container.querySelector('[data-plate]');
    expect(plate?.querySelector('path')?.getAttribute('d')).toBe(PICTOGRAMS.scroll);
    expect(view.container.querySelector('[data-callout-card] path')).toBeNull();
    view.unmount();
  });

  it('draws a marker without a card when the placer could not seat it', () => {
    const view = render(
      createElement(Callout, {
        model: model({ marker: true, width: 6, height: 6, leader: undefined }),
      }),
    );
    expect(view.container.querySelector('[data-callout-marker]')).toBeTruthy();
    expect(view.container.querySelector('[data-callout-card]')).toBeNull();
    expect(view.container.querySelector('.callout-leader')).toBeNull();
    view.unmount();
  });
});
