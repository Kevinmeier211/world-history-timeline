import { createElement as h } from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { AnnotatedImage, AnnotationNotes } from './AnnotatedImage';
import { MediaFigure } from './MediaFigure';
import { ReaderPrint } from './ReaderPrint';
import { PrintAtlas } from './PrintAtlas';
import { Dossier } from './Dossier';
import { initialLocation } from './navigation';
import { loadMediaDetails, loadSubject } from './data';
import { regions } from './model';
import type {
  Corpus,
  Media,
  MediaAnnotations,
  MediaSummary,
  Pack,
  Source,
  Subject,
} from './model';

vi.mock('./data', () => ({
  asset: (url: string) => `/portable/${url.replace(/^\//, '')}`,
  loadMediaDetails: vi.fn(),
  loadSubject: vi.fn(),
  loadReferenceContexts: vi.fn(),
  loadSourceScopes: vi.fn().mockResolvedValue({}),
}));

const source: Source = {
  id: 'photo-record',
  title: 'Photograph catalogue',
  institution: 'Museum',
  url: 'https://museum.example/photo',
  type: 'catalogue',
  accessed: '2026-10-29',
  scope: 'Selected object record.',
};
const annotationSource: Source = {
  ...source,
  id: 'annotation-only-source',
  title: 'Consulted weaving study',
  url: 'https://museum.example/study',
  scope: 'Selected construction discussion.',
};
const annotations: MediaAnnotations = {
  createdOn: '2026-10-29',
  credit: 'Chronos editorial callouts.',
  rights: 'Annotations CC BY 4.0.',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  items: [
    {
      id: 'threads',
      label: 'Crossing threads',
      x: 0.55,
      y: 0.42,
      text: 'Visible threads do not establish a thread count.',
      citations: [
        { source: annotationSource.id, locator: 'Construction paragraph, page 4' },
      ],
    },
    {
      id: 'paint',
      label: 'Painted form',
      x: 0.65,
      y: 0.545,
      text: 'The red form is visible; its material identification uses the catalogue.',
      citations: [{ source: source.id, locator: 'Medium and description' }],
    },
  ],
};
function media(): Media {
  return {
    id: 'cloth',
    subject: 'case',
    source: source.id,
    accession: 'Museum object 1',
    title: 'A textile fragment',
    creator: 'Maker unrecorded',
    date: {
      start: -400,
      end: -200,
      label: 'Fourth–third centuries BCE',
      note: 'Catalogue range.',
      precision: 'approximate',
    },
    place: 'Reported regional origin',
    material: 'Painted cotton',
    image: '/atlas/media/cloth.webp',
    thumbnail: '/atlas/media/cloth-thumb.webp',
    width: 1600,
    height: 832,
    alt: 'Unaltered textile photograph.',
    caption: 'The photographed cloth retains its own date and uncertainty.',
    notice: ['Follow a painted edge.'],
    rights: 'Photograph public domain; CC0.',
    credit: 'Museum photograph credit.',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    sourceImage: 'https://museum.example/original.jpg',
    depiction: 'object photograph',
    relevance: 'Material and imagery.',
    additionalImages: ['/atlas/media/cloth-reverse.webp'],
    hasAnnotations: true,
    annotations,
  };
}
function subject(): Subject {
  return {
    id: 'case',
    name: 'A selected textile',
    aliases: [],
    kind: 'object',
    region: 'Americas',
    place: 'Reported region',
    coordinates: [-75, -14],
    geographicPrecision: 'Regional locator.',
    interval: {
      start: -400,
      end: -200,
      label: 'Fourth–third centuries BCE',
      note: 'Object chronology.',
      precision: 'approximate',
    },
    packs: ['C3'],
    question: 'What does the material establish?',
    summary: 'A bounded object inquiry.',
    sections: [
      {
        title: 'Material evidence',
        text: 'Keep observation and interpretation distinct.',
        citations: [{ source: source.id, locator: 'Description' }],
      },
    ],
    claims: [],
    objectIds: ['cloth'],
    terms: [],
    dimensions: {},
    status: 'published',
    returnPrompt: 'Keep one uncertainty.',
  };
}
function corpus(m = media()): Corpus {
  return {
    subjects: [subject()],
    media: [m],
    sources: [source, annotationSource],
    relations: [],
    packs: [],
    journeys: [],
    glossary: [],
    contexts: [],
  };
}
function summary(m = media()): MediaSummary {
  const { annotations: omitted, ...remaining } = m;
  void omitted;
  return remaining;
}
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
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  window.history.replaceState({}, '', '/');
});

describe('Aspect-correct modern annotations', () => {
  it('returns the original image markup for an unannotated record', () => {
    const { container } = render(
      h(AnnotatedImage, {
        object: { width: 100, height: 50 },
        children: h('img', { src: '/unchanged.webp', alt: 'Original image' }),
      }),
    );
    expect(container.innerHTML).toBe(
      '<img alt="Original image" src="/unchanged.webp">',
    );
    expect(container.querySelector('.annotated-image-frame')).toBeNull();
  });

  it('keeps one image and aspect surface through metadata loading, success and retry', () => {
    const object = summary();
    const child = h('img', { src: object.image, alt: object.alt });
    const { container, rerender } = render(
      h(AnnotatedImage, { object, status: 'loading', children: child }),
    );
    const image = screen.getByRole('img');
    const canvas = container.querySelector('.annotation-canvas');
    expect(canvas).toHaveStyle({ aspectRatio: '1600 / 832' });
    expect(canvas?.firstElementChild).toBe(image);
    expect(container.querySelectorAll('.annotation-pin')).toHaveLength(0);
    rerender(
      h(AnnotatedImage, { object, annotations, status: 'ready', children: child }),
    );
    expect(screen.getByRole('img')).toBe(image);
    expect(container.querySelector('.annotation-canvas')).toBe(canvas);
    const pins = container.querySelectorAll<HTMLElement>('.annotation-pin');
    expect([...pins].map((pin) => pin.textContent)).toEqual(['1', '2']);
    expect(Number.parseFloat(pins[0]!.style.left)).toBeCloseTo(55);
    expect(Number.parseFloat(pins[0]!.style.top)).toBeCloseTo(42);
    expect(pins[0]!.style.fontSize).toBe('18px');
    expect(Number.parseFloat(pins[1]!.style.left)).toBeCloseTo(65);
    expect(pins[0]?.closest('.annotation-canvas')).toBe(canvas);
    expect(pins[0]?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(pins[0]?.hasAttribute('tabindex')).toBe(false);
    rerender(h(AnnotatedImage, { object, status: 'failed', children: child }));
    expect(screen.getByRole('img')).toBe(image);
    expect(container.querySelectorAll('.annotation-pin')).toHaveLength(0);
  });

  it('hides pins after a source-image failure and restores them only after image load', () => {
    const { container } = render(
      h(AnnotatedImage, {
        object: summary(),
        annotations,
        children: h('img', { src: '/cloth.webp', alt: 'Original image' }),
      }),
    );
    const image = screen.getByRole('img');
    fireEvent.error(image);
    expect(container.querySelectorAll('.annotation-pin')).toHaveLength(0);
    expect(
      container.querySelector('[data-annotation-status="image-failed"]'),
    ).not.toBeNull();
    fireEvent.load(image);
    expect(container.querySelectorAll('.annotation-pin')).toHaveLength(2);
  });

  it('scales the inspection surface while keeping labels in screen units', () => {
    const { container, rerender } = render(
      h(AnnotatedImage, {
        object: summary(),
        annotations,
        mode: 'inspection',
        zoom: 1.5,
        children: h('img', { src: '/cloth.webp', alt: 'Original image' }),
      }),
    );
    const image = screen.getByRole('img');
    expect(container.querySelector('.annotated-image--inspection')).toHaveStyle({
      width: '150%',
    });
    expect(container.querySelector('.annotation-pin')).toHaveStyle({
      fontSize: '18px',
    });
    rerender(
      h(AnnotatedImage, {
        object: summary(),
        annotations,
        mode: 'inspection',
        zoom: 2,
        active: false,
        children: h('img', { src: '/cloth.webp', alt: 'Original image' }),
      }),
    );
    expect(screen.getByRole('img')).toBe(image);
    expect(container.querySelectorAll('.annotation-pin')).toHaveLength(0);
  });

  it('uses physical print label units and transfers the authored width ceiling to the frame', () => {
    const { container } = render(
      h(AnnotatedImage, {
        object: summary(),
        annotations,
        mode: 'reader',
        widthMm: 80,
        children: h('img', { src: '/cloth.webp', alt: 'Original image' }),
      }),
    );
    const frame = container.querySelector<HTMLElement>('.annotation-natural-size')!;
    expect(frame.style.width).toBe('80mm');
    expect(frame.style.maxWidth).toBe('100%');
    expect(frame.style.height).toBe('auto');
    expect(
      container.querySelector<HTMLElement>('.annotation-pin')?.style.fontSize,
    ).toBe('10pt');
  });
});

describe('Separate annotation notes and provenance', () => {
  it('renders descriptive ordered notes, exact citations and distinct modern rights', () => {
    const { container } = render(
      h(AnnotationNotes, { annotations, sources: [source, annotationSource] }),
    );
    expect(
      screen.getByRole('heading', { name: 'Modern image annotations' }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll('ol > li')).toHaveLength(2);
    expect(screen.getByText(annotations.items[0]!.text)).toBeInTheDocument();
    expect(screen.getByText(/Construction paragraph, page 4/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Consulted weaving study/ }),
    ).toHaveAttribute('href', annotationSource.url);
    expect(screen.getByText(/Modern annotations · 2026-10-29/)).toHaveTextContent(
      annotations.rights,
    );
    expect(screen.getByRole('link', { name: 'Annotation licence' })).toHaveAttribute(
      'href',
      annotations.licenseUrl,
    );
  });

  it('keeps compact print numbers, labels and credit without the long notes', () => {
    const { container } = render(h(AnnotationNotes, { annotations, compact: true }));
    expect(container.querySelector('ol')).toHaveTextContent('1. Crossing threads');
    expect(container.querySelector('ol')).toHaveTextContent('2. Painted form');
    expect(screen.queryByText(annotations.items[0]!.text)).not.toBeInTheDocument();
    expect(container.querySelector('.annotation-credit')).toHaveTextContent(
      annotations.credit,
    );
    expect(container.querySelector('.annotation-credit')).toHaveTextContent(
      annotations.rights,
    );
  });

  it('hydrates an open inspection without replacing its image, zoom or focus', () => {
    const object = summary();
    const { container, rerender } = render(
      h(MediaFigure, {
        object,
        details: { status: 'loading', retry: vi.fn() },
        source,
        sources: [source, annotationSource],
      }),
    );
    const mainImage = container.querySelector('.image-open img');
    fireEvent.click(screen.getByRole('button', { name: /Inspect object/ }));
    const dialog = screen.getByRole('dialog');
    const zoomed = within(dialog).getByRole('img');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Zoom in' }));
    const closeButton = within(dialog).getByRole('button', {
      name: 'Close inspection',
    });
    closeButton.focus();
    rerender(
      h(MediaFigure, {
        object,
        details: { status: 'ready', object: media() },
        source,
        sources: [source, annotationSource],
      }),
    );
    expect(container.querySelector('.image-open img')).toBe(mainImage);
    expect(within(dialog).getByRole('img')).toBe(zoomed);
    expect(within(dialog).getByText('150%')).toBeInTheDocument();
    expect(document.activeElement).toBe(closeButton);
    expect(dialog.querySelector('.annotated-image--inspection')).toHaveStyle({
      width: '150%',
    });
    expect(dialog.querySelectorAll('.annotation-pin')).toHaveLength(2);
    expect(
      container.querySelector('.image-open')?.querySelectorAll('button,a'),
    ).toHaveLength(0);
    expect(
      container.querySelector('.image-open')?.querySelectorAll('.annotation-pin'),
    ).toHaveLength(0);
    expect(
      container
        .querySelector('.image-open')
        ?.parentElement?.querySelectorAll(':scope > .annotation-pins .annotation-pin'),
    ).toHaveLength(2);
    expect(within(dialog).getByText(/Museum photograph credit/)).toHaveTextContent(
      'Photograph public domain; CC0.',
    );
    expect(within(dialog).getByText(/Modern annotations ·/)).toHaveTextContent(
      'Annotations CC BY 4.0.',
    );
    fireEvent.change(within(dialog).getByLabelText('View'), { target: { value: '1' } });
    expect(dialog.querySelectorAll('.annotation-pin')).toHaveLength(0);
    expect(
      within(dialog).queryByRole('heading', { name: 'Modern image annotations' }),
    ).not.toBeInTheDocument();
    expect(within(dialog).getByRole('img')).toHaveAttribute(
      'src',
      '/portable/atlas/media/cloth-reverse.webp',
    );
  });

  it('passes the dossier source records through to annotation citations', async () => {
    const c = corpus();
    vi.mocked(loadSubject).mockResolvedValue(c.subjects[0]!);
    vi.mocked(loadMediaDetails).mockResolvedValue([c.media[0]!]);
    render(
      h(Dossier, {
        corpus: {
          ...c,
          media: [summary()],
          mediaDetailsDeferred: true,
          mediaRevision: 'revision-a',
        },
        location: { ...initialLocation, subject: 'case' },
        close: vi.fn(),
        navigate: vi.fn(),
        openSubject: vi.fn(),
        save: vi.fn(),
        onReady: vi.fn(),
      }),
    );
    await waitFor(() =>
      expect(
        screen.getAllByRole('link', { name: /Consulted weaving study/ }).length,
      ).toBeGreaterThan(0),
    );
    expect(
      screen.getAllByRole('link', { name: /Consulted weaving study/ })[0],
    ).toHaveAttribute('href', annotationSource.url);
  });

  it('does not restore failed primary-image pins when an alternate view loads', () => {
    const object = media();
    render(
      h(MediaFigure, {
        object,
        details: { status: 'ready', object },
        source,
        sources: [source, annotationSource],
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Inspect object/ }));
    const dialog = screen.getByRole('dialog');
    fireEvent.error(within(dialog).getByRole('img'));
    expect(dialog.querySelectorAll('.annotation-pin')).toHaveLength(0);
    fireEvent.change(within(dialog).getByLabelText('View'), { target: { value: '1' } });
    fireEvent.load(within(dialog).getByRole('img'));
    fireEvent.change(within(dialog).getByLabelText('View'), { target: { value: '0' } });
    expect(within(dialog).queryByRole('img')).not.toBeInTheDocument();
    expect(dialog.querySelectorAll('.annotation-pin')).toHaveLength(0);
    expect(within(dialog).getByText('Image unavailable.')).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Retry image' }));
    expect(dialog.querySelectorAll('.annotation-pin')).toHaveLength(0);
    fireEvent.load(within(dialog).getByRole('img'));
    expect(dialog.querySelectorAll('.annotation-pin')).toHaveLength(2);
  });
});

describe('Annotation print integration', () => {
  it('gives reader notes their own flowing section and includes annotation-only sources', () => {
    const { container } = render(
      h(ReaderPrint, { corpus: corpus(), subjectId: 'case' }),
    );
    const figure = container.querySelector('.reader-image');
    const notes = container.querySelector('.annotation-notes');
    expect(figure?.contains(notes)).toBe(false);
    expect(notes?.previousElementSibling).toBe(figure);
    expect(notes).toHaveTextContent(annotations.items[0]!.text);
    expect(notes?.querySelector('.reader-refs')).toHaveTextContent(
      '[2] Construction paragraph, page 4',
    );
    expect(container.querySelector('.reader-bibliography')).toHaveTextContent(
      annotationSource.title,
    );
    expect(notes).not.toHaveTextContent('[0]');
  });

  it('leaves an unannotated reader figure with its original direct image child', () => {
    const m = media();
    delete m.annotations;
    delete m.hasAnnotations;
    const { container } = render(
      h(ReaderPrint, { corpus: corpus(m), subjectId: 'case' }),
    );
    expect(container.querySelector('.reader-image')?.firstElementChild?.tagName).toBe(
      'IMG',
    );
    expect(container.querySelector('.annotation-notes')).toBeNull();
  });

  it('prints a family image with the compact legend and unchanged original photo credit', async () => {
    const c = corpus();
    c.journeys = [
      {
        id: 'inquiry',
        title: 'Materials and images',
        question: 'What do you notice?',
        duration: 'Ten minutes',
        introduction: 'Look carefully.',
        stops: [
          {
            subject: 'case',
            year: -300,
            title: 'Cloth',
            narrative: 'Inspect the cloth.',
            object: 'cloth',
          },
        ],
        conclusion: 'Keep uncertainty.',
        evidence: {
          prompt: 'Make a supported claim.',
          options: [
            {
              text: 'Observe first.',
              supported: true,
              feedback: 'Use a visible feature.',
            },
          ],
          citations: [],
        },
        returnPrompt: 'Look again.',
      },
    ];
    const p: Pack = {
      id: 'C3',
      title: 'Images',
      start: -1000,
      end: -1,
      anchor: -300,
      question: 'What does an image show?',
      orientation: 'A selected inquiry.',
      journey: 'inquiry',
      comparison: ['case', 'case'],
      geography: 'Regional context.',
      limits: 'Selective.',
      coverage: Object.fromEntries(
        regions.map((region) => [
          region,
          { status: 'limited', reason: 'A case.', subjects: ['case'] },
        ]),
      ) as Pack['coverage'],
    };
    c.packs = [p];
    window.history.replaceState({}, '', '/?print=family&pack=C3');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => c }),
    );
    const { container } = render(h(PrintAtlas));
    await screen.findByRole('heading', { name: 'Look closely. Ask a good question.' });
    expect(
      container.querySelector('.family-sheet .annotated-image--print'),
    ).not.toBeNull();
    expect(
      container.querySelector<HTMLElement>('.annotation-pin')?.style.fontSize,
    ).toBe('10pt');
    expect(container.querySelector('.annotation-notes--compact')).toHaveTextContent(
      '1. Crossing threads',
    );
    expect(container.querySelector('.annotation-notes--compact')).not.toHaveTextContent(
      annotations.items[0]!.text,
    );
    expect(container.querySelector('.print-object figcaption')).toHaveTextContent(
      'Museum photograph credit. Photograph public domain; CC0.',
    );
    expect(container.querySelectorAll('.writing-space')).toHaveLength(2);
  });
});
