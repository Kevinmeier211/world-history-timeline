import { createElement } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Dossier, useSubject } from './Dossier';
import { Compare } from './Compare';
import { loadSubject } from './data';
import { initialLocation } from './navigation';
import type { RuntimeCorpus, Subject } from './model';

vi.mock('./data', async () => ({
  ...(await vi.importActual<typeof import('./data')>('./data')),
  loadSubject: vi.fn(),
}));
function subject(id: string, full = false): Subject {
  return {
    id,
    name: id + ' subject',
    aliases: [],
    kind: 'place',
    region: 'Africa',
    place: 'Selected region',
    coordinates: [31, 18],
    geographicPrecision: 'Regional reference',
    interval: {
      start: 100,
      end: 200,
      label: '100–200 CE',
      precision: 'range',
      note: 'Selected range',
    },
    packs: ['C4'],
    question: 'What evidence survives?',
    summary: id + ' available summary',
    sections: full
      ? [{ title: id + ' reading', text: id + ' complete reading', citations: [] }]
      : [],
    claims: [],
    objectIds: [],
    terms: [],
    dimensions: {},
    status: 'published',
    returnPrompt: 'What supports this?',
  };
}
const corpus: RuntimeCorpus = {
  subjects: [subject('alpha'), subject('beta')],
  media: [],
  sources: [],
  relations: [],
  packs: [],
  journeys: [],
  glossary: [],
};
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
beforeEach(() => vi.clearAllMocks());
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('keeps the summary and focus through an explicit dossier retry', async () => {
  const pending = deferred<Subject>();
  vi.mocked(loadSubject)
    .mockRejectedValueOnce(new Error('Failed to fetch'))
    .mockReturnValueOnce(pending.promise);
  const props = {
    corpus,
    location: { ...initialLocation, subject: 'alpha' },
    close: vi.fn(),
    navigate: vi.fn(),
    openSubject: vi.fn(),
    save: vi.fn(),
    onReady: vi.fn(),
  };
  const view = render(createElement(Dossier, props));
  const button = await screen.findByRole('button', { name: 'Retry dossier reading' });
  expect(screen.getByText('alpha available summary')).toBeVisible();
  expect(screen.getByRole('alert')).toHaveTextContent(
    'The researched dossier could not load. Try again.',
  );
  expect(screen.queryByText('Failed to fetch')).toBeNull();
  view.rerender(
    createElement(Dossier, {
      ...props,
      location: { ...props.location, evidence: true },
    }),
  );
  expect(loadSubject).toHaveBeenCalledTimes(1);
  button.focus();
  fireEvent.click(button);
  expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent(
    'Loading the researched dossier',
  );
  expect(screen.queryByRole('button', { name: 'Retry dossier reading' })).toBeNull();
  await act(async () => pending.resolve(subject('alpha', true)));
  expect(screen.getByText('alpha complete reading')).toBeVisible();
  expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
  expect(loadSubject).toHaveBeenCalledTimes(2);
});

it.each(['success', 'failure'] as const)(
  'ignores late retry %s after changing subjects',
  async (outcome) => {
    const pending = deferred<Subject>();
    const next = deferred<Subject>();
    vi.mocked(loadSubject)
      .mockRejectedValueOnce(new Error('Offline'))
      .mockReturnValueOnce(pending.promise)
      .mockReturnValueOnce(next.promise);
    const { result, rerender } = renderHook(({ id }) => useSubject(id, corpus), {
      initialProps: { id: 'alpha' },
    });
    await waitFor(() => expect(result.current.error).toBeTruthy());
    act(() => result.current.retry());
    expect(result.current.loading).toBe(true);
    rerender({ id: 'beta' });
    await act(async () => next.resolve(subject('beta', true)));
    await act(async () => {
      if (outcome === 'success') pending.resolve(subject('alpha', true));
      else pending.reject(new Error('Old failure'));
    });
    expect(result.current.subject?.id).toBe('beta');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  },
);

it('retries only the failed comparison side and holds focus on the comparison title', async () => {
  const pending = deferred<Subject>();
  vi.mocked(loadSubject).mockImplementation((id) =>
    id === 'alpha'
      ? Promise.resolve(subject(id, true))
      : Promise.reject(new Error('Failed to fetch')),
  );
  render(
    createElement(Compare, {
      corpus,
      left: 'alpha',
      right: 'beta',
      setRight: vi.fn(),
      close: vi.fn(),
      save: vi.fn(),
    }),
  );
  const button = await screen.findByRole('button', {
    name: 'Retry beta subject reading',
  });
  expect(screen.getByText('alpha available summary')).toBeVisible();
  expect(screen.getByText('beta available summary')).toBeVisible();
  expect(
    screen.queryByText(/current dossiers do not support the same comparison dimension/),
  ).toBeNull();
  vi.mocked(loadSubject).mockReturnValueOnce(pending.promise);
  fireEvent.click(button);
  expect(
    screen.getByRole('heading', { name: 'Compare without ranking' }),
  ).toHaveFocus();
  expect(vi.mocked(loadSubject).mock.calls.map(([id]) => id)).toEqual([
    'alpha',
    'beta',
    'beta',
  ]);
  await act(async () => pending.resolve(subject('beta', true)));
  expect(screen.queryByRole('alert')).toBeNull();
  expect(
    screen.getByRole('heading', { name: 'Compare without ranking' }),
  ).toHaveFocus();
});

it('evicts an incorrect subject response so an explicit retry can fetch the correct dossier', async () => {
  const actual = await vi.importActual<typeof import('./data')>('./data');
  const fetch = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => subject('wrong') })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => subject('cache-retry', true),
    });
  vi.stubGlobal('fetch', fetch);
  await expect(actual.loadSubject('cache-retry')).rejects.toThrow(
    'The researched dossier could not load.',
  );
  await expect(actual.loadSubject('cache-retry')).resolves.toMatchObject({
    id: 'cache-retry',
  });
  expect(fetch).toHaveBeenCalledTimes(2);
});
