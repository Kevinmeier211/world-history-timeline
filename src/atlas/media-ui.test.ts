import { createElement } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
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
import type { Media, MediaSummary, RuntimeCorpus, Source, Subject } from './model';
import { Dossier } from './Dossier';
import { MediaFigure, ObjectImage } from './MediaFigure';
import { initialLocation } from './navigation';
import { loadMediaDetails, loadSubject } from './data';

vi.mock('./data', () => ({
  asset: (url: string) => `/portable/${url.replace(/^\//, '')}`,
  loadSubject: vi.fn(),
  loadMediaDetails: vi.fn(),
  loadReferenceContexts: vi.fn(),
  loadSourceScopes: vi.fn(),
}));
const loadMedia = vi.mocked(loadMediaDetails);
const loadReading = vi.mocked(loadSubject);
const source: Source = {
  id: 'museum',
  title: 'Original museum record',
  institution: 'Museum',
  url: 'https://example.test/record',
  type: 'catalogue',
  accessed: '2026-10-29',
  scope: 'Selected catalogue fields.',
};
function media(id = 'alpha-image', owner = 'alpha'): Media {
  return {
    id,
    subject: owner,
    source: source.id,
    title: `${id} title`,
    accession: `${id} accession`,
    creator: `${id} maker`,
    date: {
      start: -100,
      end: -100,
      label: `${id} date`,
      note: 'An approximate object date.',
      precision: 'approximate',
    },
    place: `${id} place`,
    material: `${id} material`,
    image: `/atlas/media/${id}.webp`,
    thumbnail: `/atlas/media/${id}-thumb.webp`,
    width: 600,
    height: 400,
    alt: `${id} accessible image`,
    caption: `${id} complete interpretation.`,
    notice: [`${id} authored notice.`],
    rights: `${id} image rights`,
    credit: `${id} image credit`,
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceImage: `https://images.example.test/${id}.jpg`,
    depiction: 'object photograph',
    relevance: `${id} evidence relevance`,
  };
}
function summary(m: Media): MediaSummary {
  const {
    caption,
    notice,
    creator,
    place,
    material,
    representedDate,
    relevance,
    datingNote,
    additionalImages,
    printWidthMm,
    printCaption,
    printCredit,
    ...brief
  } = m;
  void [
    caption,
    notice,
    creator,
    place,
    material,
    representedDate,
    relevance,
    datingNote,
    additionalImages,
    printWidthMm,
    printCaption,
    printCredit,
  ];
  return brief;
}
function subject(id = 'alpha', objects = [`${id}-image`]): Subject {
  return {
    id,
    name: `${id} subject`,
    aliases: [],
    kind: 'object',
    region: 'Africa',
    place: `${id} region`,
    coordinates: [31, 18],
    geographicPrecision: 'Regional reference.',
    interval: {
      start: -100,
      end: -100,
      label: 'Around100BCE',
      note: 'Selected context.',
      precision: 'approximate',
    },
    packs: ['C3'],
    question: 'What does this source support?',
    summary: `${id} summary`,
    sections: [
      { title: `${id} reading`, text: `${id} researched text.`, citations: [] },
    ],
    claims: [],
    objectIds: objects,
    terms: [],
    dimensions: {},
    status: 'published',
    returnPrompt: 'What further evidence would help?',
  };
}
function corpus(
  records = [media()],
  subjects = [subject()],
  deferred = true,
): RuntimeCorpus {
  return {
    ...(deferred ? { mediaDetailsDeferred: true, mediaRevision: 'revision-a' } : {}),
    subjects,
    media: deferred ? records.map(summary) : records,
    sources: [source],
    relations: [],
    packs: [],
    journeys: [],
    glossary: [],
  };
}
function pending<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}
function props(
  c: RuntimeCorpus,
  id = 'alpha',
  object: string | null = null,
  onReady = vi.fn(),
) {
  return {
    corpus: c,
    location: { ...initialLocation, subject: id, object },
    close: vi.fn(),
    navigate: vi.fn(),
    openSubject: vi.fn(),
    save: vi.fn(),
    onReady,
  };
}
const oldShow = Object.getOwnPropertyDescriptor(
  HTMLDialogElement.prototype,
  'showModal',
);
const oldClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');
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
      if (!this.open) return;
      this.open = false;
      this.dispatchEvent(new Event('close'));
    },
  });
});
afterAll(() => {
  for (const [key, descriptor] of [
    ['showModal', oldShow],
    ['close', oldClose],
  ] as const)
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, key, descriptor);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, key);
});
beforeEach(() => {
  loadMedia.mockReset();
  loadReading.mockReset();
});
afterEach(cleanup);

describe('Deferred dossier media', () => {
  it('starts both requests from bootstrap and retains attribution while metadata is pending', async () => {
    const reading = pending<Subject>();
    const details = pending<Media[]>();
    loadReading.mockReturnValue(reading.promise);
    loadMedia.mockReturnValue(details.promise);
    const onReady = vi.fn();
    const c = corpus();
    const { container } = render(
      createElement(Dossier, props(c, 'alpha', null, onReady)),
    );
    const image = container.querySelector('.image-open img');
    expect(loadReading).toHaveBeenCalledWith('alpha');
    expect(loadMedia).toHaveBeenCalledWith('alpha', 'revision-a', c.media);
    const caption = within(container.querySelector('figcaption')!);
    expect(caption.getByRole('status')).toHaveTextContent('Loading image information');
    expect(caption.getByText('alpha-image date')).toBeVisible();
    expect(caption.getByText(/alpha-image image credit/)).toHaveTextContent(
      'alpha-image image rights',
    );
    expect(
      caption.getByRole('link', { name: /Read the image licence/ }),
    ).toHaveAttribute('href', media().licenseUrl);
    expect(caption.getByRole('link', { name: /Open source image/ })).toHaveAttribute(
      'href',
      media().sourceImage,
    );
    expect(caption.queryByText('alpha-image material')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Look first' }),
    ).not.toBeInTheDocument();
    expect(container.querySelector('.dossier')).toHaveAttribute(
      'data-reading-ready',
      'false',
    );
    await act(async () => reading.resolve(subject()));
    expect(onReady).not.toHaveBeenCalled();
    await act(async () => details.resolve([media()]));
    expect(caption.getByText('alpha-image complete interpretation.')).toBeVisible();
    expect(screen.getByText('alpha-image authored notice.')).toBeVisible();
    expect(container.querySelector('.image-open img')).toBe(image);
    expect(container.querySelector('.object-figure')).toHaveAttribute(
      'data-media-status',
      'ready',
    );
    expect(container.querySelector('.dossier')).toHaveAttribute(
      'data-reading-ready',
      'true',
    );
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('retries within an open inspection without remounting, resetting zoom or notifying focus twice', async () => {
    const retry = pending<Media[]>();
    loadReading.mockResolvedValue(subject());
    loadMedia
      .mockRejectedValueOnce(Error('Offline'))
      .mockReturnValueOnce(retry.promise);
    const onReady = vi.fn();
    const { container } = render(
      createElement(Dossier, props(corpus(), 'alpha', null, onReady)),
    );
    await screen.findByRole('button', { name: 'Retry image information' });
    await waitFor(() => {
      expect(container.querySelector('.dossier')).toHaveAttribute(
        'data-reading-ready',
        'true',
      );
      expect(onReady).toHaveBeenCalledTimes(1);
    });
    expect(container.querySelector('.object-figure')).toHaveAttribute(
      'data-media-status',
      'failed',
    );
    fireEvent.click(screen.getByRole('button', { name: /Inspect object/ }));
    const dialog = container.querySelector('dialog')!;
    const inside = within(dialog);
    const image = dialog.querySelector('.inspection-scroll img');
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    const zoomButton = inside.getByRole('button', { name: 'Zoom in' });
    zoomButton.focus();
    expect(inside.getByText('150%')).toBeVisible();
    expect(inside.getByText(/alpha-image image credit/)).toHaveTextContent(
      'alpha-image image rights',
    );
    fireEvent.click(inside.getByRole('button', { name: 'Retry image information' }));
    expect(inside.getByText('Loading image information…')).toHaveAttribute(
      'role',
      'status',
    );
    await act(async () => retry.resolve([media()]));
    expect(container.querySelector('dialog')).toBe(dialog);
    expect(dialog).toHaveAttribute('open');
    expect(dialog.querySelector('.inspection-scroll img')).toBe(image);
    expect(inside.getByText('150%')).toBeVisible();
    expect(inside.getByText('alpha-image complete interpretation.')).toBeVisible();
    expect(document.activeElement).toBe(zoomButton);
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(loadMedia).toHaveBeenCalledTimes(2);
  });

  it('uses complete corpus media synchronously without a detail request', () => {
    loadReading.mockReturnValue(pending<Subject>().promise);
    const { container } = render(
      createElement(Dossier, props(corpus([media()], [subject()], false))),
    );
    expect(
      within(container.querySelector('figcaption')!).getByText(
        'alpha-image complete interpretation.',
      ),
    ).toBeVisible();
    expect(container.querySelector('.object-figure')).toHaveAttribute(
      'data-media-status',
      'ready',
    );
    expect(loadMedia).not.toHaveBeenCalled();
  });

  it('does not request media for a case without images', async () => {
    const empty = subject('empty', []);
    loadReading.mockResolvedValue(empty);
    const onReady = vi.fn();
    const { container } = render(
      createElement(Dossier, props(corpus([], [empty]), 'empty', null, onReady)),
    );
    await act(async () => {});
    expect(loadMedia).not.toHaveBeenCalled();
    expect(container.querySelector('.object-figure')).toBeNull();
    expect(container.querySelector('.dossier')).toHaveAttribute(
      'data-media-status',
      'ready',
    );
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('loads all related objects once and settles each object navigation once', async () => {
    const first = media(),
      second = media('second-image');
    const s = subject('alpha', [first.id, second.id]);
    const c = corpus([first, second], [s]);
    loadReading.mockResolvedValue(s);
    loadMedia.mockResolvedValue([first, second]);
    const onReady = vi.fn();
    const base = props(c, 'alpha', first.id, onReady);
    const { container, rerender } = render(createElement(Dossier, base));
    await screen.findByText('alpha-image authored notice.');
    expect(onReady).toHaveBeenCalledTimes(1);
    rerender(
      createElement(Dossier, {
        ...base,
        location: { ...base.location, object: second.id },
      }),
    );
    expect(
      within(container.querySelector('figcaption')!).getByText(
        'second-image complete interpretation.',
      ),
    ).toBeVisible();
    expect(
      within(container.querySelector('figcaption')!).queryByText(
        'alpha-image complete interpretation.',
      ),
    ).toBeNull();
    expect(onReady).toHaveBeenCalledTimes(2);
    expect(loadMedia).toHaveBeenCalledTimes(1);
  });

  it('ignores late media and reading from a previous case', async () => {
    const aReading = pending<Subject>(),
      bReading = pending<Subject>();
    const aMedia = pending<Media[]>(),
      bMedia = pending<Media[]>();
    loadReading.mockImplementation((id) =>
      id === 'alpha' ? aReading.promise : bReading.promise,
    );
    loadMedia.mockImplementation((id) =>
      id === 'alpha' ? aMedia.promise : bMedia.promise,
    );
    const c = corpus(
      [media(), media('beta-image', 'beta')],
      [subject(), subject('beta')],
    );
    const onReady = vi.fn();
    const base = props(c, 'alpha', null, onReady);
    const { container, rerender } = render(createElement(Dossier, base));
    rerender(
      createElement(Dossier, {
        ...base,
        location: { ...base.location, subject: 'beta' },
      }),
    );
    await act(async () => {
      aReading.resolve(subject());
      aMedia.resolve([media()]);
    });
    expect(container.querySelector('.object-figure')).toHaveAttribute(
      'data-media-id',
      'beta-image',
    );
    expect(container.querySelector('.object-figure')).toHaveAttribute(
      'data-media-status',
      'loading',
    );
    expect(screen.queryByText('alpha-image complete interpretation.')).toBeNull();
    expect(onReady).not.toHaveBeenCalled();
    await act(async () => {
      bReading.resolve(subject('beta'));
      bMedia.resolve([media('beta-image', 'beta')]);
    });
    expect(
      within(container.querySelector('figcaption')!).getByText(
        'beta-image complete interpretation.',
      ),
    ).toBeVisible();
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('does not carry a failed subject error into the next case', async () => {
    loadReading
      .mockRejectedValueOnce(Error('Alpha reading failed'))
      .mockReturnValueOnce(pending<Subject>().promise);
    loadMedia.mockImplementation(async (_id, _revision, records) =>
      records.map((m) => media(m.id, m.subject)),
    );
    const c = corpus(
      [media(), media('beta-image', 'beta')],
      [subject(), subject('beta')],
    );
    const base = props(c);
    const { rerender } = render(createElement(Dossier, base));
    await screen.findByRole('alert');
    rerender(
      createElement(Dossier, {
        ...base,
        location: { ...base.location, subject: 'beta' },
      }),
    );
    expect(screen.queryByText('Alpha reading failed')).toBeNull();
    expect(
      document.querySelector('.object-figure figcaption [role="status"]'),
    ).toHaveTextContent('Loading image information');
  });

  it('ignores completion after unmount', async () => {
    const reading = pending<Subject>(),
      details = pending<Media[]>();
    loadReading.mockReturnValue(reading.promise);
    loadMedia.mockReturnValue(details.promise);
    const onReady = vi.fn();
    const { unmount } = render(
      createElement(Dossier, props(corpus(), 'alpha', null, onReady)),
    );
    unmount();
    await act(async () => {
      reading.resolve(subject());
      details.resolve([media()]);
    });
    expect(onReady).not.toHaveBeenCalled();
  });

  it('hides previous rich prose when the same object receives a new media revision', async () => {
    const next = pending<Media[]>();
    loadReading.mockResolvedValue(subject());
    loadMedia.mockResolvedValueOnce([media()]).mockReturnValueOnce(next.promise);
    const c = corpus();
    const onReady = vi.fn();
    const base = props(c, 'alpha', null, onReady);
    const { container, rerender } = render(createElement(Dossier, base));
    await screen.findByText('alpha-image authored notice.');
    const image = container.querySelector('.image-open img');
    rerender(
      createElement(Dossier, {
        ...base,
        corpus: { ...c, mediaRevision: 'revision-b' },
      }),
    );
    const caption = within(container.querySelector('figcaption')!);
    expect(caption.queryByText('alpha-image complete interpretation.')).toBeNull();
    expect(container.querySelector('.object-figure')).toHaveAttribute(
      'data-media-status',
      'loading',
    );
    expect(container.querySelector('.image-open img')).toBe(image);
    await act(async () =>
      next.resolve([{ ...media(), caption: 'Verified revised interpretation.' }]),
    );
    expect(caption.getByText('Verified revised interpretation.')).toBeVisible();
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('requires atlas reload for an unmarked incomplete record instead of a no-op retry', () => {
    loadReading.mockReturnValue(pending<Subject>().promise);
    const c = corpus();
    delete c.mediaDetailsDeferred;
    const { container } = render(createElement(Dossier, props(c)));
    expect(container.querySelector('.object-figure')).toHaveAttribute(
      'data-media-status',
      'failed',
    );
    expect(screen.getByRole('button', { name: 'Reload atlas' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Retry image information' }),
    ).toBeNull();
    expect(container.querySelector('.object-figure')).toHaveAttribute(
      'data-media-recovery',
      'reload',
    );
    expect(loadMedia).not.toHaveBeenCalled();
  });

  it('requires atlas reload when the deferred bootstrap has no usable revision', () => {
    loadReading.mockReturnValue(pending<Subject>().promise);
    const c = corpus();
    delete c.mediaRevision;
    const { container } = render(createElement(Dossier, props(c)));
    expect(container.querySelector('.object-figure')).toHaveAttribute(
      'data-media-status',
      'failed',
    );
    expect(screen.getByRole('button', { name: 'Reload atlas' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Retry image information' }),
    ).toBeNull();
    expect(loadMedia).not.toHaveBeenCalled();
  });
});

describe('Image-file failure is separate from interpretation loading', () => {
  it('keeps a main-image fallback outside the inspect button and retries without losing metadata', () => {
    const m = media();
    const { container } = render(
      createElement(MediaFigure, {
        object: summary(m),
        details: { status: 'ready', object: m },
        source,
      }),
    );
    const open = screen.getByRole('button', { name: /Inspect object/ });
    fireEvent.error(within(open).getByRole('img'));
    expect(within(open).queryByRole('link')).toBeNull();
    expect(within(open).queryByRole('button')).toBeNull();
    expect(container.querySelector('.object-figure')).toHaveAttribute(
      'data-media-status',
      'ready',
    );
    expect(
      within(container.querySelector('figcaption')!).getByText(m.caption),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: /Open source image/ })).toHaveAttribute(
      'href',
      m.sourceImage,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry image' }));
    expect(within(open).getByRole('img')).toHaveAttribute(
      'src',
      '/portable/atlas/media/alpha-image.webp',
    );
  });

  it('recovers an alternate inspection image independently while retaining credits', () => {
    const m = { ...media(), additionalImages: ['/atlas/media/alternate.webp'] };
    const { container } = render(
      createElement(MediaFigure, {
        object: summary(m),
        details: { status: 'ready', object: m },
        source,
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Inspect object/ }));
    const dialog = within(container.querySelector('dialog')!);
    fireEvent.change(dialog.getByRole('combobox'), { target: { value: '1' } });
    fireEvent.error(dialog.getByRole('img'));
    expect(dialog.getByText('Image unavailable.')).toBeVisible();
    expect(dialog.getByText(/alpha-image image credit/)).toHaveTextContent(
      'alpha-image image rights',
    );
    fireEvent.change(dialog.getByRole('combobox'), { target: { value: '0' } });
    expect(dialog.getByRole('img')).toHaveAttribute(
      'src',
      '/portable/atlas/media/alpha-image.webp',
    );
    expect(dialog.queryByText('Image unavailable.')).toBeNull();
  });

  it('resolves a local source fallback through the asset base and does not inherit another URL failure', () => {
    const a = { ...media(), sourceImage: '/atlas/media/original.svg' };
    const b = media('beta-image', 'beta');
    const { rerender } = render(createElement(ObjectImage, { object: summary(a) }));
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByRole('link', { name: /Open source image/ })).toHaveAttribute(
      'href',
      '/portable/atlas/media/original.svg',
    );
    rerender(createElement(ObjectImage, { object: summary(b) }));
    expect(screen.getByRole('img')).toHaveAttribute('alt', b.alt);
    expect(screen.queryByText('Image unavailable.')).toBeNull();
  });

  it.each([
    '//images.example.test/protocol-relative.jpg',
    'https://images.example.test/absolute.jpg',
  ])('preserves the external source URL %s', (sourceImage) => {
    render(
      createElement(ObjectImage, { object: summary({ ...media(), sourceImage }) }),
    );
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByRole('link', { name: /Open source image/ })).toHaveAttribute(
      'href',
      sourceImage,
    );
  });

  it('keeps keyboard retry focus on a stable inspection control while details change', () => {
    const m = media();
    const retry = vi.fn();
    const base = { object: summary(m), source };
    const { container, rerender } = render(
      createElement(MediaFigure, {
        ...base,
        details: { status: 'failed', recovery: 'retry', retry },
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Inspect object/ }));
    const dialog = container.querySelector('dialog')!;
    const inside = within(dialog);
    fireEvent.click(inside.getByRole('button', { name: 'Zoom in' }));
    const trigger = inside.getByRole('button', { name: 'Retry image information' });
    trigger.focus();
    fireEvent.click(trigger);
    const close = inside.getByRole('button', { name: 'Close inspection' });
    expect(close).toHaveFocus();
    expect(retry).toHaveBeenCalledTimes(1);
    rerender(
      createElement(MediaFigure, { ...base, details: { status: 'loading', retry } }),
    );
    rerender(
      createElement(MediaFigure, { ...base, details: { status: 'ready', object: m } }),
    );
    expect(container.querySelector('dialog')).toBe(dialog);
    expect(dialog).toHaveAttribute('open');
    expect(close).toHaveFocus();
    expect(inside.getByText('150%')).toBeVisible();
    expect(inside.getByRole('link', { name: 'Image licence ↗' })).toHaveAttribute(
      'href',
      m.licenseUrl,
    );
  });

  it('invokes explicit atlas recovery from the reader and an open inspection', () => {
    const m = media();
    const reload = vi.fn();
    const { container } = render(
      createElement(MediaFigure, {
        object: summary(m),
        details: { status: 'failed', recovery: 'reload', reload },
        source,
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reload atlas' }));
    expect(reload).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: /Inspect object/ }));
    const inside = within(container.querySelector('dialog')!);
    expect(inside.getByText(/alpha-image image credit/)).toHaveTextContent(
      'alpha-image image rights',
    );
    fireEvent.click(inside.getByRole('button', { name: 'Reload atlas' }));
    expect(reload).toHaveBeenCalledTimes(2);
    expect(
      inside.queryByRole('button', { name: 'Retry image information' }),
    ).toBeNull();
  });

  it('keeps the named image scrolling region focusable through metadata recovery', () => {
    const m = media();
    const retry = vi.fn();
    const base = { object: summary(m), source };
    const { container, rerender } = render(
      createElement(MediaFigure, {
        ...base,
        details: { status: 'failed', recovery: 'retry', retry },
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Inspect object/ }));
    const dialog = within(container.querySelector('dialog')!);
    expect(screen.getByRole('dialog', { name: m.title })).toBeVisible();
    const region = dialog.getByRole('region', { name: 'Zoomed object image' });
    expect(region).toHaveAttribute('tabindex', '0');
    region.focus();
    expect(region).toHaveFocus();
    rerender(
      createElement(MediaFigure, { ...base, details: { status: 'loading', retry } }),
    );
    rerender(
      createElement(MediaFigure, { ...base, details: { status: 'ready', object: m } }),
    );
    expect(dialog.getByRole('region', { name: 'Zoomed object image' })).toBe(region);
    expect(region).toHaveFocus();
  });
});
