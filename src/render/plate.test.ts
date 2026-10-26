import { createElement } from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { localMediaHref } from '../lib/localMedia.ts';
import { MediaFigure } from '../ui/MediaFigure.tsx';
import { Callout } from './Callout.tsx';
import { Plate } from './Plate.tsx';
import { PICTOGRAMS } from './pictograms.ts';

describe('plate', () => {
  it('keeps a remote address off the plate and reserves the box', () => {
    expect(localMediaHref('https://clevelandart.org/art/2024.27')).toBeUndefined();
    expect(localMediaHref('media/plate.webp')).toBe('media/plate.webp');
    const remote = render(
      createElement(Plate, {
        id: 'node_cuneiform',
        x: 10,
        y: 12,
        width: 56,
        height: 56,
        name: 'scroll',
        icon: 20,
        href: 'https://example.test/plate.webp',
      }),
    );
    const plate = remote.container.querySelector('[data-plate]');
    expect(plate?.getAttribute('data-lazy')).toBe('viewport');
    expect(plate?.querySelector('.plate-reserve')?.getAttribute('width')).toBe('56');
    expect(plate?.querySelector('path')?.getAttribute('d')).toBe(PICTOGRAMS.scroll);
    expect(plate?.querySelector('image')).toBeNull();
    remote.unmount();

    const local = render(
      createElement(Plate, {
        id: 'node_cuneiform',
        x: 0,
        y: 0,
        width: 56,
        height: 56,
        name: 'scroll',
        icon: 20,
        href: 'media/plate.webp',
      }),
    );
    const image = local.container.querySelector('image');
    expect(image?.getAttribute('href')).toBe('media/plate.webp');
    expect(image?.getAttribute('width')).toBe('56');
    expect(local.container.querySelector('path')).toBeNull();
    local.unmount();
  });

  it('still ships the pictogram from a callout plate', () => {
    const view = render(
      createElement(Callout, {
        model: {
          id: 'node_cuneiform',
          title: 'Invention of Cuneiform Writing',
          yearLabel: '3200 BCE',
          blurb:
            'Marks the traditional boundary between prehistory and recorded history today.',
          importance: 4,
          x: 200,
          y: 80,
          width: 132,
          height: 48,
          marker: false,
          pictogram: 'scroll',
          plate: { x: 332, y: 76, width: 56, height: 56 },
        },
      }),
    );
    expect(
      view.container.querySelector('[data-plate="node_cuneiform"] path'),
    ).toBeTruthy();
    view.unmount();
  });

  it('shows caption and credit only for a local dossier file', () => {
    const empty = render(createElement(MediaFigure, { note: 'No image is attached.' }));
    expect(empty.container).toHaveTextContent('No image is attached.');
    expect(empty.container.querySelector('img')).toBeNull();
    empty.unmount();

    const remote = render(
      createElement(MediaFigure, {
        note: 'No image is attached.',
        figure: {
          src: 'https://example.test/plate.webp',
          alt: 'A plate.',
          caption: 'Example, later.',
          credit: 'Example museum. CC0.',
          width: 320,
          height: 320,
        },
      }),
    );
    expect(remote.container.querySelector('img')).toBeNull();
    remote.unmount();

    const local = render(
      createElement(MediaFigure, {
        note: 'No image is attached.',
        figure: {
          src: 'media/plate.webp',
          alt: 'A red and blue test plate.',
          caption: 'Synthetic plate, not an object.',
          credit: 'Generated for the pipeline test.',
          width: 320,
          height: 320,
        },
      }),
    );
    const img = local.container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('media/plate.webp');
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(img?.getAttribute('decoding')).toBe('async');
    expect(img?.getAttribute('width')).toBe('320');
    expect(local.container).toHaveTextContent('Synthetic plate, not an object.');
    expect(local.container).toHaveTextContent('Generated for the pipeline test.');
    local.unmount();
  });
});
