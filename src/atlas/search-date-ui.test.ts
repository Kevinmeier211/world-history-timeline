import { readFileSync } from 'node:fs';
import { createElement, createRef } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { Search, SearchLayer, type SearchHandle } from './Search';
import { loadSearchIndex } from './data';
import type { RuntimeCorpus, SearchEntry } from './model';

vi.mock('./data', () => ({ loadSearchIndex: vi.fn() }));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

it('announces a valid date and corrects zero without returning lexical matches', async () => {
  const corpus: RuntimeCorpus = JSON.parse(
    readFileSync('public/atlas/index.json', 'utf8'),
  );
  const entries: SearchEntry[] = JSON.parse(
    readFileSync('public/atlas/search.json', 'utf8'),
  );
  vi.mocked(loadSearchIndex).mockResolvedValue(entries);
  const showModal = Object.getOwnPropertyDescriptor(
    HTMLDialogElement.prototype,
    'showModal',
  );
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
  });
  try {
    const goYear = vi.fn();
    render(
      createElement(Search, {
        corpus,
        goYear,
        close: vi.fn(),
        openSubject: vi.fn(),
        startJourney: vi.fn(),
      }),
    );
    await waitFor(() =>
      expect(screen.queryByText(/Opening full-text search/)).toBeNull(),
    );
    const input = screen.getByRole('searchbox');
    const status = screen.getByRole('status');
    for (const value of ['0 CE', '0 BCE', '0000', 'AD 0']) {
      fireEvent.change(input, { target: { value } });
      expect(status).toHaveTextContent('There is no year zero. Try 1 BCE or 1 CE.');
      expect(screen.getAllByRole('button')).toHaveLength(1);
    }
    fireEvent.change(input, { target: { value: '2000 CE' } });
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Go to 2000 CE by date.');
    fireEvent.click(screen.getByRole('button', { name: 'Go to 2000 CE' }));
    expect(goYear).toHaveBeenCalledWith(2000);
  } finally {
    if (showModal)
      Object.defineProperty(HTMLDialogElement.prototype, 'showModal', showModal);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  }
});

it('opens search without rerendering its parent, resets on reopen, and closes for navigation', async () => {
  const corpus: RuntimeCorpus = JSON.parse(
    readFileSync('public/atlas/index.json', 'utf8'),
  );
  vi.mocked(loadSearchIndex).mockResolvedValue([]);
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLDialogElement.prototype,
    'showModal',
  );
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value() {
      this.setAttribute('open', '');
    },
  });
  const ref = createRef<SearchHandle>();
  const close = vi.fn();
  let renders = 0;
  function Parent() {
    renders++;
    return createElement(
      'div',
      null,
      createElement('button', { onClick: () => ref.current?.open() }, 'Open search'),
      createElement('button', { onClick: () => ref.current?.close() }, 'Navigate'),
      createElement(SearchLayer, {
        ref,
        corpus,
        close,
        goYear: vi.fn(),
        openSubject: vi.fn(),
        startJourney: vi.fn(),
      }),
    );
  }
  try {
    render(createElement(Parent));
    expect(loadSearchIndex).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Open search'));
    await waitFor(() =>
      expect(screen.queryByText(/Opening full-text search/)).toBeNull(),
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Han' } });
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: false }));
    expect(close).toHaveBeenCalledOnce();
    expect(screen.queryByRole('searchbox')).toBeNull();
    fireEvent.click(screen.getByText('Open search'));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    fireEvent.click(screen.getByText('Navigate'));
    expect(screen.queryByRole('searchbox')).toBeNull();
    expect(renders).toBe(1);
  } finally {
    if (descriptor)
      Object.defineProperty(HTMLDialogElement.prototype, 'showModal', descriptor);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  }
});
