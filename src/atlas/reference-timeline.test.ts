import { createElement } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Corpus, HistoricalContext, Subject } from './model';
import { loadReferenceContexts } from './data';
import { ReferenceTimeline } from './ReferenceTimeline';

vi.mock('./data', () => ({
  loadReferenceContexts: vi.fn(),
  loadSourceScopes: vi.fn(),
}));
const load = vi.mocked(loadReferenceContexts);
const phaseContext = (id: string): HistoricalContext => ({
  id: `${id}-context`,
  title: `${id} reference title`,
  region: 'Europe',
  interval: {
    start: -200,
    end: -100,
    label: '200–100 BCE',
    note: 'A selected frame.',
    precision: 'range',
  },
  summary: `${id} summary stays available.`,
  citations: [{ source: 'reference-source', locator: 'Context overview' }],
  subjectIds: [id],
  phases: [
    {
      year: -150,
      label: 'Around 150 BCE',
      title: `${id} phase title`,
      text: `${id} complete phase reading.`,
      citations: [{ source: 'reference-source', locator: 'Selected phase account' }],
    },
  ],
});
function corpus(deferred = true, contexts = [phaseContext('alpha')]): Corpus {
  return {
    ...(deferred ? { contextDetailsDeferred: true } : {}),
    contexts: contexts.map((context) => ({
      ...context,
      phases: context.phases.map((phase) =>
        deferred ? { ...phase, title: '', text: '', citations: [] } : phase,
      ),
    })),
    subjects: [],
    sources: [
      {
        id: 'reference-source',
        title: 'Linked reference source',
        institution: 'Archive',
        url: 'https://example.org/reference',
        type: 'scholarship',
        accessed: '2026-10-28',
        scope: 'Selected source account.',
      },
    ],
    media: [],
    relations: [],
    packs: [],
    journeys: [],
    glossary: [],
  };
}
const subject = (id = 'alpha') => ({ id, contextIds: [`${id}-context`] }) as Subject;
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => (resolve = done));
  return { promise, resolve };
}
beforeEach(() => load.mockReset());
afterEach(cleanup);

describe('Reference reading with a deferred bootstrap', () => {
  it('retains summaries and citations while phases load, then renders the reading', async () => {
    const pending = deferred<HistoricalContext[]>();
    load.mockReturnValue(pending.promise);
    const c = corpus();
    const { container } = render(
      createElement(ReferenceTimeline, { subject: subject(), corpus: c }),
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading reference reading');
    expect(screen.getByText('alpha summary stays available.')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'alpha reference title' }),
    ).toBeVisible();
    expect(container.querySelector('.citations a')).toHaveAttribute(
      'href',
      'https://example.org/reference',
    );
    expect(container.querySelectorAll('ol li')).toHaveLength(0);
    await act(async () => pending.resolve([phaseContext('alpha')]));
    expect(screen.getByText('alpha complete phase reading.')).toBeVisible();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(container.querySelectorAll('ol li')).toHaveLength(1);
    expect(c.contexts![0]!.phases[0]!.text).toBe('');
  });

  it('shows an explicit retry after failure while the summary remains usable', async () => {
    load
      .mockRejectedValueOnce(new Error('Unavailable'))
      .mockResolvedValueOnce([phaseContext('alpha')]);
    const { container } = render(
      createElement(ReferenceTimeline, { subject: subject(), corpus: corpus() }),
    );
    const retry = await screen.findByRole('button', {
      name: 'Retry reference reading',
    });
    expect(screen.getByText('alpha summary stays available.')).toBeVisible();
    expect(container.querySelectorAll('ol li')).toHaveLength(0);
    fireEvent.click(retry);
    expect(await screen.findByText('alpha complete phase reading.')).toBeVisible();
    expect(load).toHaveBeenCalledTimes(2);
    expect(
      screen.queryByRole('button', { name: 'Retry reference reading' }),
    ).toBeNull();
  });

  it('renders full-corpus phases synchronously without requesting another file', () => {
    render(
      createElement(ReferenceTimeline, {
        subject: subject(),
        corpus: corpus(false),
      }),
    );
    expect(screen.getByText('alpha complete phase reading.')).toBeVisible();
    expect(screen.queryByRole('status')).toBeNull();
    expect(load).not.toHaveBeenCalled();
  });

  it('does not fetch when the subject has no matching reference context', () => {
    const { container } = render(
      createElement(ReferenceTimeline, {
        subject: subject('unmatched'),
        corpus: corpus(),
      }),
    );
    expect(container).toBeEmptyDOMElement();
    expect(load).not.toHaveBeenCalled();
  });

  it.each([undefined, []])(
    'does not fetch for absent context IDs: %s',
    (contextIds) => {
      const { container } = render(
        createElement(ReferenceTimeline, {
          subject: { ...subject(), contextIds },
          corpus: corpus(),
        }),
      );
      expect(container).toBeEmptyDOMElement();
      expect(load).not.toHaveBeenCalled();
    },
  );

  it('ignores a late result for the previous subject', async () => {
    const first = deferred<HistoricalContext[]>();
    const second = deferred<HistoricalContext[]>();
    load.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const c = corpus(true, [phaseContext('alpha'), phaseContext('beta')]);
    const view = render(
      createElement(ReferenceTimeline, { subject: subject(), corpus: c }),
    );
    view.rerender(
      createElement(ReferenceTimeline, { subject: subject('beta'), corpus: c }),
    );
    await act(async () => first.resolve([phaseContext('alpha')]));
    expect(screen.queryByText('alpha complete phase reading.')).toBeNull();
    expect(screen.getByText('beta summary stays available.')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Loading reference reading');
    await act(async () => second.resolve([phaseContext('beta')]));
    expect(screen.getByText('beta complete phase reading.')).toBeVisible();
    expect(screen.queryByText('alpha complete phase reading.')).toBeNull();
  });

  it('does not update the component after an outstanding request is unmounted', async () => {
    const pending = deferred<HistoricalContext[]>();
    load.mockReturnValue(pending.promise);
    const view = render(
      createElement(ReferenceTimeline, { subject: subject(), corpus: corpus() }),
    );
    view.unmount();
    await act(async () => pending.resolve([phaseContext('alpha')]));
    expect(view.container).toBeEmptyDOMElement();
  });
});
