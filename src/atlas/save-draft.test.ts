import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Corpus } from './model';
import type { Notebook } from './notebook-data';
import { loadCorpus, loadSubject } from './data';
import { persistNotebook } from './notebook-persistence';
import { Atlas } from './App';

vi.mock('./data', () => ({
  loadCorpus: vi.fn(),
  loadSubject: vi.fn(),
  loadSourceScopes: vi.fn(),
  asset: (url: string) => url,
}));
vi.mock('./notebook-persistence', async (original) => ({
  ...(await original<typeof import('./notebook-persistence')>()),
  persistNotebook: vi.fn(),
}));
vi.mock('./Timeline', () => ({ Timeline: () => null }));
vi.mock('./WorldContext', () => ({ WorldContext: () => null }));
vi.mock('./Dossier', () => ({ Dossier: () => null }));

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const journey = corpus.journeys[0]!;
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((yes) => {
    resolve = yes;
  });
  return { promise, resolve };
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
  sessionStorage.clear();
  const stop = journey.stops[0]!;
  window.history.replaceState(
    null,
    '',
    `/?journey=${journey.id}&step=0&subject=${stop.subject}&year=${stop.year}`,
  );
  vi.mocked(loadCorpus).mockResolvedValue(corpus);
  vi.mocked(loadSubject).mockImplementation(async (id) =>
    corpus.subjects.find((s) => s.id === id)!,
  );
});
afterEach(() => cleanup());

describe('question draft persistence lifecycle', () => {
  it('locks the submitted fields and preserves a newer draft when an earlier write finishes', async () => {
    const pending = deferred<Notebook>();
    vi.mocked(persistNotebook).mockReturnValueOnce(pending.promise);
    render(createElement(Atlas));
    fireEvent.click(await screen.findByRole('button', { name: 'Save journey' }));
    const question = screen.getByRole('textbox', { name: 'Question' });
    const answer = screen.getByRole('textbox', {
      name: 'Your thinking, if you want to record it',
    });
    const collection = screen.getByRole('textbox', { name: 'Collection' });
    fireEvent.change(question, { target: { value: 'First submitted question' } });
    fireEvent.change(answer, { target: { value: 'First submitted thinking' } });
    fireEvent.change(collection, { target: { value: 'First collection' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save on this device' }));
    await waitFor(() => expect(persistNotebook).toHaveBeenCalledTimes(1));
    expect(question).toBeDisabled();
    expect(answer).toBeDisabled();
    expect(collection).toBeDisabled();
    const submitted = vi.mocked(persistNotebook).mock.calls[0]![1];
    expect(submitted.notes[0]).toMatchObject({
      question: 'First submitted question',
      answer: 'First submitted thinking',
      collection: 'First collection',
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save journey' }));
    fireEvent.change(question, { target: { value: 'New unsaved question' } });
    fireEvent.change(answer, { target: { value: 'New unsaved thinking' } });
    await act(async () => pending.resolve(submitted));
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(question).toBeEnabled();
    expect(question).toHaveValue('New unsaved question');
    expect(answer).toHaveValue('New unsaved thinking');
    expect(JSON.parse(sessionStorage.getItem('chronos.question-draft')!)).toMatchObject(
      {
        question: 'New unsaved question',
        answer: 'New unsaved thinking',
      },
    );
    expect(
      screen.queryByText('Saved on this device. Revisit it from Notebook.'),
    ).not.toBeInTheDocument();
  });
});
