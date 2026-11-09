import { createElement, useCallback, type ComponentProps } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { NotebookLoader } from './NotebookLoader';
import { useAtlasNavigation } from './use-atlas-navigation';
import { readLocation } from './navigation';
import type { Note, NoteDraft } from './notebook-data';

type ViewModule = Pick<typeof import('./Notebook'), 'NotebookView'>;
type LoaderProps = ComponentProps<typeof NotebookLoader>;
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function deferredNotebook() {
  const pending = deferred<ViewModule>();
  const requested = vi.fn(() => pending.promise);
  vi.doMock('./Notebook', requested);
  return { ...pending, requested };
}
const note: Note = {
  id: 'saved-question',
  title: 'A saved question',
  question: 'What can the evidence show?',
  answer: 'The first answer',
  collection: 'Household',
  saved: '2026-11-06T10:00:00Z',
  location: '?subject=nalanda',
  kind: 'question',
};
const draft: NoteDraft = {
  id: note.id,
  base: note,
  mode: 'thinking',
  title: note.title,
  question: note.question,
  collection: note.collection,
  answer: 'An unsaved revision',
  reflection: 'Still considering this',
  evidence: '',
};
function props(): LoaderProps {
  return {
    book: { version: 1, notes: [note] },
    session: { draft: null, removed: [] },
    persisted: true,
    onChange: vi.fn().mockResolvedValue(true),
    navigate: vi.fn(),
    onSessionChange: vi.fn(),
    onImport: vi.fn().mockResolvedValue(true),
    onRecovered: vi.fn(),
    onReady: vi.fn(),
  };
}
function Reader({ initial }: { initial: LoaderProps }) {
  const { location, navigate, focusReading, requestReadingTarget } =
    useAtlasNavigation(true);
  const ready = useCallback(
    (editing: boolean) => {
      if (editing) requestReadingTarget(null);
      else focusReading();
    },
    [requestReadingTarget, focusReading],
  );
  return createElement(
    'main',
    null,
    createElement(
      'button',
      { onClick: () => navigate(readLocation('?page=notebook')) },
      'Notebook',
    ),
    location.destination === 'notebook'
      ? createElement(NotebookLoader, { ...initial, onReady: ready })
      : createElement('h1', null, 'Atlas'),
  );
}
beforeEach(() => {
  history.replaceState(null, '', '/');
  localStorage.clear();
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
  HTMLElement.prototype.scrollIntoView = vi.fn();
  window.scrollTo = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.doUnmock('./Notebook');
  vi.clearAllMocks();
});

it('waits for controls and passes the latest saved book, draft and callbacks', async () => {
  const pending = deferredNotebook();
  const initial = props();
  const view = render(createElement(NotebookLoader, initial));
  const heading = screen.getByRole('heading', { name: 'Opening your notebook…' });
  expect(heading.closest('section')).toHaveAttribute('data-reading-ready', 'false');
  expect(initial.onReady).not.toHaveBeenCalled();
  const latest = {
    ...initial,
    book: { ...initial.book, notes: [{ ...note, answer: 'A newer saved answer' }] },
    session: { draft, removed: [{ note, position: 0 }] },
    persisted: false,
    onChange: vi.fn().mockResolvedValue(false),
  };
  view.rerender(createElement(NotebookLoader, latest));
  const reader = vi.fn((received: Omit<LoaderProps, 'onReady'>) =>
    createElement('h1', null, received.persisted ? 'Saved notebook' : 'Your notebook'),
  );
  await waitFor(() => expect(pending.requested).toHaveBeenCalledOnce());
  await act(async () => {
    pending.resolve({ NotebookView: reader });
    await vi.dynamicImportSettled();
  });
  expect(await screen.findByRole('heading', { name: 'Your notebook' })).toBeVisible();
  const { onReady, ...forwarded } = latest;
  expect(reader.mock.calls[0]?.[0]).toEqual(forwarded);
  expect(onReady).toHaveBeenCalledWith(true);
  expect(latest.session.draft).toEqual(draft);
});

it('focuses the notebook heading only after in-app navigation has loaded controls', async () => {
  const pending = deferredNotebook();
  render(createElement(Reader, { initial: props() }));
  fireEvent.click(screen.getByRole('button', { name: 'Notebook' }));
  const loading = screen.getByRole('heading', { name: 'Opening your notebook…' });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  expect(loading).not.toHaveFocus();
  await waitFor(() => expect(pending.requested).toHaveBeenCalledOnce());
  const real = await vi.importActual<ViewModule>('./Notebook');
  await act(async () => {
    pending.resolve(real);
    await vi.dynamicImportSettled();
  });
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: 'Your notebook' })).toHaveFocus(),
  );
});

it('lets a restored editor retain focus even when deferred heading work settles later', async () => {
  const pending = deferredNotebook();
  const fonts = deferred<void>();
  Object.defineProperty(document, 'fonts', { value: { ready: fonts.promise } });
  const initial = { ...props(), session: { draft, removed: [] } };
  render(createElement(Reader, { initial }));
  fireEvent.click(screen.getByRole('button', { name: 'Notebook' }));
  await waitFor(() => expect(pending.requested).toHaveBeenCalledOnce());
  const real = await vi.importActual<ViewModule>('./Notebook');
  await act(async () => {
    pending.resolve(real);
    await vi.dynamicImportSettled();
  });
  const editor = screen.getByRole('textbox', { name: 'Your thinking now' });
  expect(editor).toHaveValue(draft.answer);
  expect(editor).toHaveFocus();
  await act(async () => {
    fonts.resolve();
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
  expect(editor).toHaveFocus();
  expect(initial.onChange).not.toHaveBeenCalled();
  expect(initial.onSessionChange).not.toHaveBeenCalled();
});

it('focuses an explained failure with reload recovery even when a draft is retained', async () => {
  vi.doMock('./Notebook', () => Promise.reject(new Error('Chunk offline')));
  const initial = { ...props(), persisted: false, session: { draft, removed: [] } };
  render(createElement(Reader, { initial }));
  fireEvent.click(screen.getByRole('button', { name: 'Notebook' }));
  const heading = await screen.findByRole('heading', {
    name: 'The notebook controls could not open',
  });
  await waitFor(() => expect(heading).toHaveFocus());
  expect(heading.closest('section')).toHaveAttribute('data-reading-ready', 'true');
  expect(screen.getByRole('alert')).toHaveTextContent('entries and drafts remain');
  expect(screen.getByRole('button', { name: 'Reload atlas' })).toBeEnabled();
  fireEvent.click(screen.getByText('Copy notebook and drafts before reloading'));
  expect(screen.getByRole('textbox', { name: 'Notebook JSON for import' })).toHaveValue(
    JSON.stringify(initial.book, null, 2),
  );
  expect(
    screen.getByRole('textbox', { name: 'Draft and undo history JSON' }),
  ).toHaveValue(JSON.stringify(initial.session, null, 2));
  expect(initial.session.draft).toEqual(draft);
  expect(initial.onChange).not.toHaveBeenCalled();
  expect(initial.onSessionChange).not.toHaveBeenCalled();
});

it.each(['success', 'failure'])(
  'ignores late %s after leaving the notebook',
  async (outcome) => {
    const pending = deferredNotebook();
    const initial = props();
    const view = render(createElement(NotebookLoader, initial));
    await waitFor(() => expect(pending.requested).toHaveBeenCalledOnce());
    view.unmount();
    await act(async () => {
      if (outcome === 'success')
        pending.resolve({ NotebookView: () => createElement('h1', null, 'Late view') });
      else pending.reject(new Error('Late failure'));
      await vi.dynamicImportSettled();
    });
    expect(screen.queryByRole('heading', { name: 'Late view' })).toBeNull();
    expect(initial.onReady).not.toHaveBeenCalled();
    expect(initial.onChange).not.toHaveBeenCalled();
    expect(initial.onSessionChange).not.toHaveBeenCalled();
  },
);
