import { readFileSync } from 'node:fs';
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
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RuntimeCorpus, Source } from './model';
import { loadCorpus, loadSourceRecords, loadSourceScopes } from './data';
import { Citations } from './Evidence';
import { Atlas } from './App';

vi.mock('./data', async () => {
  const actual = await vi.importActual<typeof import('./data')>('./data');
  return {
    ...actual,
    loadCorpus: vi.fn(),
    loadSourceRecords: vi.fn(),
    loadSourceScopes: vi.fn(),
  };
});
vi.mock('./Timeline', () => ({ Timeline: () => null }));
vi.mock('./WorldContext', () => ({ WorldContext: () => null }));
vi.mock('./Compare', () => ({ Compare: () => null }));
vi.mock('./Search', () => ({ SearchLayer: () => null }));
vi.mock('./Dossier', () => ({
  Dossier: () =>
    createElement('h1', { 'data-reading-title': true, tabIndex: -1 }, 'Case reading'),
}));

const index = JSON.parse(
  readFileSync('public/atlas/index.json', 'utf8'),
) as RuntimeCorpus;
const loadRecords = vi.mocked(loadSourceRecords);
const records: Source[] = index.sources.map((source) => ({
  id: source.id,
  title: `Title ${source.id}`,
  institution: 'Example institution',
  url: `https://example.test/${source.id}`,
  type: 'catalogue',
  accessed: '2026-10-29',
  scope: '',
}));
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
beforeAll(() => {
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
  HTMLElement.prototype.scrollIntoView = vi.fn();
  window.scrollTo = vi.fn();
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
});
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  window.requestIdleCallback = ((callback: IdleRequestCallback) => {
    callback({ didTimeout: false, timeRemaining: () => 0 });
    return 1;
  }) as typeof window.requestIdleCallback;
  window.cancelIdleCallback = () => undefined;
  Object.defineProperty(HTMLImageElement.prototype, 'complete', {
    configurable: true,
    get: () => true,
  });
  vi.mocked(loadCorpus).mockResolvedValue(index);
  loadRecords.mockImplementation(() => new Promise(() => undefined));
});
afterEach(() => cleanup());

describe('bibliography status', () => {
  it('keeps older saved questions visible when their source metadata was unavailable', async () => {
    const first = {
      id: 'existing',
      title: 'An earlier question',
      question: 'What evidence supports this?',
      answer: 'Keep my first answer.',
      collection: 'Household',
      saved: '2026-10-29T10:00:00Z',
      location: '?subject=tang-city&year=700',
      kind: 'question',
    };
    localStorage.setItem(
      'chronos.household.v1',
      JSON.stringify({
        version: 1,
        notes: [
          {
            ...first,
            id: 'during-outage',
            title: 'A question saved during an outage',
            context: {
              label: 'Chang’an · 700 CE',
              subject: 'tang-city',
              compare: null,
              object: null,
              year: 700,
              journey: null,
              step: 0,
              sources: [{ id: 'tang-changan', locator: 'Successive capitals' }],
            },
          },
          first,
        ],
      }),
    );
    window.history.replaceState(null, '', '/?page=notebook');
    render(createElement(Atlas));
    expect(await screen.findByRole('heading', { name: 'Your notebook' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'An earlier question' })).toBeVisible();
    fireEvent.click(screen.getByText('Saved sources and context'));
    const saved = document.querySelector('.saved-context') as HTMLElement;
    expect(
      within(saved).getByText(/details were unavailable when this question was saved/),
    ).toBeVisible();
    expect(within(saved).getByText('tang-changan')).toBeVisible();
    expect(within(saved).getByText('Successive capitals')).toBeVisible();
    expect(within(saved).queryByRole('link')).not.toBeInTheDocument();
    expect(within(saved).queryByText(/Consultation recorded/)).not.toBeInTheDocument();
  });

  it('explains a delayed bibliography without blocking reading, then recovers on an explicit retry', async () => {
    window.history.replaceState(null, '', '/?view=stories');
    const pending = deferred<Source[]>();
    loadRecords.mockReturnValue(pending.promise);
    render(createElement(Atlas));
    expect(
      await screen.findByRole('heading', { name: /world made by people/i }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Search the atlas' })).toBeEnabled();
    expect(
      await screen.findByText(/Loading source titles and record links/),
    ).toBeVisible();
    const heading = screen.getByRole('heading', { name: /world made by people/i });
    heading.focus();
    expect(loadRecords).toHaveBeenCalledTimes(1);
    expect(loadRecords.mock.calls[0]?.[0]).toHaveLength(index.sources.length);
    pending.reject(new Error('503'));
    const retry = await screen.findByRole('button', { name: 'Retry source records' });
    expect(heading).toHaveFocus();
    const feature = document.querySelector('.story-feature');
    expect(feature).toBeTruthy();
    fireEvent.click(within(feature as HTMLElement).getByText('Image & source'));
    expect(
      within(feature as HTMLElement).queryByRole('link', { name: /original record/ }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Living timeline' }));
    fireEvent.click(screen.getByRole('button', { name: 'Stories & objects' }));
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    });
    expect(loadRecords).toHaveBeenCalledTimes(1);
    const recovery = deferred<Source[]>();
    loadRecords.mockReturnValue(recovery.promise);
    retry.focus();
    fireEvent.click(retry);
    expect(
      await screen.findByText(/Loading source titles and record links/),
    ).toBeVisible();
    expect(document.querySelector('.bibliography-status')).toHaveFocus();
    recovery.resolve(records);
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Retry source records' }),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        document.querySelector('.story-gallery [data-context-title]'),
      ).toHaveFocus(),
    );
    const recovered = document.querySelector('.story-feature');
    expect(recovered).toBeTruthy();
    fireEvent.click(within(recovered as HTMLElement).getByText('Image & source'));
    expect(
      within(recovered as HTMLElement).getByRole('link', { name: /original record/ }),
    ).toHaveAttribute('href', expect.stringMatching(/^https:\/\//));
    expect(loadRecords).toHaveBeenCalledTimes(2);
  });
});

describe('citation bibliography', () => {
  const citations = [{ source: 'alpha', locator: 'Selected pages' }];
  function open(source: Partial<Source>) {
    render(
      createElement(Citations, {
        citations,
        sources: [{ id: 'alpha', scope: '', ...source } as Source],
      }),
    );
    fireEvent.click(screen.getByText('Evidence and source notes'));
  }

  it('does not present a raw id as a source link or claim that records remain linked', async () => {
    vi.mocked(loadSourceScopes).mockRejectedValue(new Error('unavailable'));
    open({});
    expect(
      await screen.findByRole('button', { name: 'Retry source details' }),
    ).toBeVisible();
    expect(
      screen.queryByText(/Original records remain linked/),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText(/Consulted/)).not.toBeInTheDocument();
    expect(screen.getByText('alpha')).toBeVisible();
    expect(screen.getByText('Selected pages')).toBeVisible();
  });

  it('restores the title, consultation metadata, working url, and scope retry', async () => {
    vi.mocked(loadSourceScopes)
      .mockRejectedValueOnce(new Error('unavailable'))
      .mockResolvedValueOnce({ alpha: 'Full university essay' });
    open({
      title: 'Catalogue title',
      institution: 'Museum',
      url: 'https://example.test/alpha',
      type: 'catalogue',
      accessed: '2026-10-29',
    });
    expect(screen.getByRole('link', { name: /Catalogue title/ })).toHaveAttribute(
      'href',
      'https://example.test/alpha',
    );
    expect(screen.getByText('Consulted 2026-10-29; catalogue.')).toBeVisible();
    expect(screen.getByText(/Museum · Selected pages/)).toBeVisible();
    expect(await screen.findByText(/Original records remain linked/)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Retry source details' }));
    expect(await screen.findByText(/Full university essay/)).toBeVisible();
  });
});
