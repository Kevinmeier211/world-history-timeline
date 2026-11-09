import { createElement as h } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { MediaFigure } from './MediaFigure';
import { AnnotatedImage } from './AnnotatedImage';
import type { Media, MediaSummary } from './model';

vi.mock('./data', () => ({ asset: (url: string) => url }));

const object: Media = {
  id: 'portrait',
  subject: 'case',
  source: 'museum',
  title: 'A source image',
  accession: 'Test accession',
  creator: 'Maker unknown',
  place: 'Catalogue place',
  material: 'Catalogue material',
  date: {
    start: 1000,
    end: 1100,
    label: 'An approximate object date',
    precision: 'range',
    note: 'Not the photograph date.',
  },
  image: '/portrait.webp',
  thumbnail: '/portrait-thumb.webp',
  width: 1200,
  height: 1600,
  alt: 'Source photograph',
  caption: 'A catalogue interpretation.',
  notice: ['Look closely.'],
  credit: 'Museum credit.',
  rights: 'Image rights retained.',
  sourceImage: 'https://example.test/source.jpg',
  depiction: 'object photograph',
  relevance: 'Evidence description.',
  additionalImages: ['/landscape.webp'],
  hasAnnotations: true,
  annotations: {
    createdOn: '2026-10-29',
    credit: 'Editorial annotation.',
    rights: 'CC BY 4.0.',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    items: [
      {
        id: 'point',
        label: 'A feature',
        x: 0.4,
        y: 0.6,
        text: 'A visible feature.',
        citations: [{ source: 'museum', locator: 'Photograph' }],
      },
    ],
  },
};
const { additionalImages: _additional, annotations: _annotations, ...brief } = object;
const summary: MediaSummary = brief;
let regionWidth = 1000;
let regionHeight = 500;
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
  for (const [name, descriptor] of [
    ['showModal', showModal],
    ['close', close],
  ] as const) {
    if (descriptor)
      Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, name);
  }
});
beforeEach(() => {
  regionWidth = 1000;
  regionHeight = 500;
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.classList.contains('inspection-scroll') ? regionWidth : 0;
  });
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.classList.contains('inspection-scroll') ? regionHeight : 0;
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function load(image: HTMLImageElement, width: number, height: number) {
  Object.defineProperties(image, {
    naturalWidth: { configurable: true, value: width },
    naturalHeight: { configurable: true, value: height },
  });
  fireEvent.load(image);
}
function open() {
  fireEvent.click(screen.getByRole('button', { name: /Inspect object:/ }));
  const dialog = screen.getByRole('dialog');
  const inside = within(dialog);
  const region = inside.getByRole('region', { name: 'Zoomed object image' });
  return { dialog, inside, region, image: region.querySelector('img')! };
}

describe('Fitted image inspection without metadata state loss', () => {
  it('fits the full primary image and zooms its centre on the same mounted image', () => {
    render(h(MediaFigure, { object: summary, details: { status: 'ready', object } }));
    const { region, inside, image } = open();
    load(image, 1200, 1600);
    expect(image).toHaveStyle({ width: '100%' });
    expect(region.querySelector('.annotated-image--inspection')).toHaveStyle({
      width: '375px',
    });
    expect(region.querySelector('.annotation-canvas')).toHaveStyle({
      aspectRatio: '1200 / 1600',
    });
    expect([region.scrollLeft, region.scrollTop]).toEqual([0, 0]);
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    expect(region.querySelector('img')).toBe(image);
    expect(region.querySelector('.annotated-image--inspection')).toHaveStyle({
      width: '562.5px',
    });
    expect(region.scrollTop).toBe(125);
    region.scrollTop = 150;
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    expect(region.scrollTop).toBeCloseTo(283.333333);
    expect(inside.getByText('200%')).toBeVisible();
  });

  it('uses each alternate’s actual natural ratio, resets fit/pan, and ignores the old image load', () => {
    render(h(MediaFigure, { object: summary, details: { status: 'ready', object } }));
    const { region, inside, image: primary } = open();
    load(primary, 1200, 1600);
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    region.scrollTop = 200;
    fireEvent.change(inside.getByLabelText('View'), { target: { value: '1' } });
    const alternate = region.querySelector('img')!;
    expect(alternate).not.toBe(primary);
    load(alternate, 1800, 600);
    expect(inside.getByText('100%')).toBeVisible();
    expect(region.querySelector('.annotated-image--inspection')).toHaveStyle({
      width: '1000px',
    });
    expect(region.querySelector('.annotation-canvas')).toHaveStyle({
      aspectRatio: '1800 / 600',
    });
    expect(region.querySelectorAll('.annotation-pin')).toHaveLength(0);
    expect([region.scrollLeft, region.scrollTop]).toEqual([0, 0]);
    load(primary, 10000, 1);
    expect(region.querySelector('.annotation-canvas')).toHaveStyle({
      aspectRatio: '1800 / 600',
    });
    fireEvent.change(inside.getByLabelText('View'), { target: { value: '0' } });
    load(region.querySelector('img')!, 1200, 1600);
    expect(inside.getByText('100%')).toBeVisible();
    expect(region.querySelector('.annotated-image--inspection')).toHaveStyle({
      width: '375px',
    });
    expect(region.querySelectorAll('.annotation-pin')).toHaveLength(1);
  });

  it('preserves selected alternate, image identity, zoom, pan and focus through metadata failure/retry', () => {
    const retry = vi.fn();
    const { rerender } = render(
      h(MediaFigure, { object: summary, details: { status: 'ready', object } }),
    );
    const { dialog, region, inside } = open();
    fireEvent.change(inside.getByLabelText('View'), { target: { value: '1' } });
    const alternate = region.querySelector('img')!;
    load(alternate, 1800, 600);
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    region.scrollLeft = 630;
    region.scrollTop = 100;
    region.focus();
    rerender(
      h(MediaFigure, {
        object: summary,
        details: { status: 'failed', recovery: 'retry', retry },
      }),
    );
    expect(region).toHaveFocus();
    expect(region.querySelector('img')).toBe(alternate);
    expect(inside.getByLabelText('View')).toHaveValue('1');
    const retryButton = inside.getByRole('button', { name: 'Retry image information' });
    retryButton.focus();
    fireEvent.click(retryButton);
    expect(retry).toHaveBeenCalledOnce();
    const closeButton = inside.getByRole('button', { name: 'Close inspection' });
    expect(closeButton).toHaveFocus();
    rerender(
      h(MediaFigure, { object: summary, details: { status: 'loading', retry } }),
    );
    rerender(
      h(MediaFigure, {
        object: summary,
        details: { status: 'ready', object: { ...object } },
      }),
    );
    expect(screen.getByRole('dialog')).toBe(dialog);
    expect(region.querySelector('img')).toBe(alternate);
    expect(inside.getByLabelText('View')).toHaveValue('1');
    expect(inside.getByText('200%')).toBeVisible();
    expect([region.scrollLeft, region.scrollTop]).toEqual([630, 100]);
    expect(closeButton).toHaveFocus();
  });

  it('retains annotation registration and pan when pending primary metadata hydrates', () => {
    const retry = vi.fn();
    const { rerender } = render(
      h(MediaFigure, { object: summary, details: { status: 'loading', retry } }),
    );
    const { region, inside, image } = open();
    load(image, 1200, 1600);
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    region.scrollTop = 170;
    region.focus();
    const canvas = region.querySelector('.annotation-canvas');
    rerender(h(MediaFigure, { object: summary, details: { status: 'ready', object } }));
    expect(region.querySelector('img')).toBe(image);
    expect(region.querySelector('.annotation-canvas')).toBe(canvas);
    expect(region.querySelector('.annotation-pin')).toHaveStyle({
      left: '40%',
      top: '60%',
      fontSize: '18px',
    });
    expect(region.scrollTop).toBe(170);
    expect(region).toHaveFocus();
  });

  it('caps a small loaded source and resets zoom/pan when the object changes', () => {
    const { rerender } = render(
      h(MediaFigure, { object: summary, details: { status: 'ready', object } }),
    );
    const { region, inside, image } = open();
    load(image, 399, 268);
    expect(region.querySelector('.annotated-image--inspection')).toHaveStyle({
      width: '399px',
    });
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    const other = {
      ...object,
      id: 'other',
      image: '/other.webp',
      width: 800,
      height: 400,
      additionalImages: [],
    };
    rerender(
      h(MediaFigure, { object: other, details: { status: 'ready', object: other } }),
    );
    expect(inside.getByText('100%')).toBeVisible();
    expect(region.querySelector('img')).not.toBe(image);
    expect(region.querySelector('.annotated-image--inspection')).toHaveStyle({
      width: '800px',
    });
    expect([region.scrollLeft, region.scrollTop]).toEqual([0, 0]);
  });

  it('refits a changed region while retaining the visible image point', () => {
    render(h(MediaFigure, { object: summary, details: { status: 'ready', object } }));
    const { region, inside, image } = open();
    load(image, 1200, 1600);
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    region.scrollTop = 200;
    regionWidth = 800;
    regionHeight = 400;
    fireEvent(window, new Event('resize'));
    expect(region.querySelector('.annotated-image--inspection')).toHaveStyle({
      width: '600px',
    });
    expect(region.scrollTop).toBeCloseTo(160);
    expect(region.querySelector('img')).toBe(image);
  });

  it('allows explicit inspection pixels without changing AnnotatedImage’s default percentage contract', () => {
    const props = {
      object: summary,
      mode: 'inspection' as const,
      zoom: 1.5,
      children: h('img', { src: '/same.webp', alt: 'Source' }),
    };
    const { container, rerender } = render(h(AnnotatedImage, props));
    const image = screen.getByRole('img');
    expect(container.querySelector('.annotated-image--inspection')).toHaveStyle({
      width: '150%',
    });
    rerender(h(AnnotatedImage, { ...props, inspectionWidthPx: 562.5 }));
    expect(container.querySelector('.annotated-image--inspection')).toHaveStyle({
      width: '562.5px',
    });
    expect(screen.getByRole('img')).toBe(image);
  });
});
