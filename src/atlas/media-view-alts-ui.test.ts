import { createElement as h } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Media, MediaSummary } from './model';
import { MediaFigure } from './MediaFigure';

vi.mock('./data', () => ({ asset: (url: string) => url }));
const summary: MediaSummary = {
  id: 'case-image',
  title: 'A practical case',
  subject: 'case',
  source: 'museum',
  accession: 'Test object',
  date: {
    start: 1789,
    end: 1789,
    label: 'Test object date',
    note: 'Separate from image exposure.',
    precision: 'exact',
  },
  image: '/main.webp',
  thumbnail: '/main-thumb.webp',
  width: 600,
  height: 400,
  alt: 'Primary view with its mirror exposed.',
  credit: 'Museum credit.',
  rights: 'Image rights.',
  sourceImage: 'https://example.test/main.jpg',
  depiction: 'object photograph',
};
const complete: Media = {
  ...summary,
  creator: 'Catalogue maker',
  place: 'Catalogue place',
  material: 'Catalogue material',
  caption: 'A bounded catalogue description.',
  notice: ['Look closely.'],
  relevance: 'Evidence.',
  additionalImages: ['/outer.webp', '/drawer.webp'],
  additionalImageAlts: [
    'Outer painted surface with birds and flowers.',
    'Empty fitted drawer with shaped recesses.',
  ],
};
const showModal = Object.getOwnPropertyDescriptor(
  HTMLDialogElement.prototype,
  'showModal',
);
const close = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.open = true;
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event('close'));
    },
  });
});
afterAll(() => {
  for (const [name, original] of [
    ['showModal', showModal],
    ['close', close],
  ] as const)
    if (original) Object.defineProperty(HTMLDialogElement.prototype, name, original);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, name);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
function open() {
  fireEvent.click(screen.getByRole('button', { name: /Inspect object:/ }));
  const dialog = screen.getByRole('dialog');
  const inside = within(dialog);
  const region = inside.getByRole('region', { name: 'Zoomed object image' });
  return { dialog, inside, region };
}

describe('Each selected image has its own accessible description', () => {
  it('pairs authored descriptions with paths and restores the unchanged primary alt', () => {
    render(
      h(MediaFigure, {
        object: summary,
        details: { status: 'ready', object: complete },
      }),
    );
    const { inside, region } = open();
    expect(inside.getByRole('img')).toHaveAttribute('alt', summary.alt);
    fireEvent.change(inside.getByLabelText('View'), { target: { value: '1' } });
    expect(
      inside.getByRole('img', { name: complete.additionalImageAlts![0] }),
    ).toHaveAttribute('src', '/outer.webp');
    fireEvent.change(inside.getByLabelText('View'), { target: { value: '2' } });
    expect(
      inside.getByRole('img', { name: complete.additionalImageAlts![1] }),
    ).toHaveAttribute('src', '/drawer.webp');
    fireEvent.change(inside.getByLabelText('View'), { target: { value: '0' } });
    expect(region.querySelector('img')).toHaveAttribute('alt', summary.alt);
    expect(region.querySelector('img')).toHaveAttribute('src', summary.image);
  });

  it('uses a neutral legacy fallback without copying primary-only features', () => {
    const legacy = { ...complete };
    delete legacy.additionalImageAlts;
    render(
      h(MediaFigure, { object: summary, details: { status: 'ready', object: legacy } }),
    );
    const { inside } = open();
    fireEvent.change(inside.getByLabelText('View'), { target: { value: '1' } });
    const image = inside.getByRole('img', {
      name: 'Additional view of A practical case',
    });
    expect(image).not.toHaveAttribute('alt', summary.alt);
    expect(image.getAttribute('alt')).not.toMatch(/mirror/);
  });

  it('caches verified paths and descriptions atomically through metadata failure and retry', () => {
    const retry = vi.fn();
    const { rerender } = render(
      h(MediaFigure, {
        object: summary,
        details: { status: 'ready', object: complete },
      }),
    );
    const { dialog, inside, region } = open();
    fireEvent.change(inside.getByLabelText('View'), { target: { value: '2' } });
    const image = inside.getByRole('img');
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    region.scrollLeft = 41;
    region.scrollTop = 53;
    const zoom = inside.getByRole('button', { name: 'Zoom in' });
    zoom.focus();
    rerender(
      h(MediaFigure, {
        object: summary,
        details: { status: 'failed', recovery: 'retry', retry },
      }),
    );
    expect(inside.getByRole('img')).toBe(image);
    expect(image).toHaveAttribute('src', '/drawer.webp');
    expect(image).toHaveAttribute('alt', complete.additionalImageAlts![1]);
    expect(zoom).toHaveFocus();
    fireEvent.click(inside.getByRole('button', { name: 'Retry image information' }));
    rerender(
      h(MediaFigure, { object: summary, details: { status: 'loading', retry } }),
    );
    rerender(
      h(MediaFigure, {
        object: summary,
        details: { status: 'ready', object: { ...complete } },
      }),
    );
    expect(screen.getByRole('dialog')).toBe(dialog);
    expect(inside.getByRole('img')).toBe(image);
    expect(image).toHaveAttribute('alt', complete.additionalImageAlts![1]);
    expect(inside.getByLabelText('View')).toHaveValue('2');
    expect(inside.getByText('150%')).toBeVisible();
    expect([region.scrollLeft, region.scrollTop]).toEqual([41, 53]);
    expect(zoom).toHaveFocus();
    expect(retry).toHaveBeenCalledOnce();
  });

  it('updates a description without remounting the same source image', () => {
    const legacy = { ...complete };
    delete legacy.additionalImageAlts;
    const { rerender } = render(
      h(MediaFigure, { object: summary, details: { status: 'ready', object: legacy } }),
    );
    const { inside } = open();
    fireEvent.change(inside.getByLabelText('View'), { target: { value: '1' } });
    const image = inside.getByRole('img');
    rerender(
      h(MediaFigure, {
        object: summary,
        details: { status: 'ready', object: complete },
      }),
    );
    expect(inside.getByRole('img')).toBe(image);
    expect(image).toHaveAttribute('alt', complete.additionalImageAlts![0]);
  });

  it('does not pair a reordered path with a stale cached description', () => {
    const { rerender } = render(
      h(MediaFigure, {
        object: summary,
        details: { status: 'ready', object: complete },
      }),
    );
    const { inside } = open();
    fireEvent.change(inside.getByLabelText('View'), { target: { value: '1' } });
    const reordered = {
      ...complete,
      additionalImages: [...complete.additionalImages!].reverse(),
      additionalImageAlts: [...complete.additionalImageAlts!].reverse(),
    };
    rerender(
      h(MediaFigure, {
        object: summary,
        details: { status: 'ready', object: reordered },
      }),
    );
    rerender(
      h(MediaFigure, {
        object: summary,
        details: { status: 'failed', recovery: 'retry', retry: vi.fn() },
      }),
    );
    expect(inside.getByRole('img')).toHaveAttribute('src', '/drawer.webp');
    expect(inside.getByRole('img')).toHaveAttribute(
      'alt',
      complete.additionalImageAlts![1],
    );
  });
});
