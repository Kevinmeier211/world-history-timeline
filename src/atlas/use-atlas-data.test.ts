import { readFileSync } from 'node:fs';
import { createElement, StrictMode } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadCorpus, loadSourceRecords } from './data';
import type { RuntimeCorpus, Source } from './model';
import { useAtlasData } from './use-atlas-data';

vi.mock('./data', () => ({ loadCorpus: vi.fn(), loadSourceRecords: vi.fn() }));
const index = JSON.parse(
  readFileSync('public/atlas/index.json', 'utf8'),
) as RuntimeCorpus;
const sources: Source[] = index.sources.map((source) => ({
  ...source,
  url: `https://example.test/${source.id}`,
}));
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
let idleCallbacks: Map<number, IdleRequestCallback>;
let frameCallbacks: Map<number, FrameRequestCallback>;
let callbackId: number;
async function runIdle() {
  const callbacks = [...idleCallbacks.values()];
  idleCallbacks.clear();
  await act(async () => {
    callbacks.forEach((callback) =>
      callback({ didTimeout: false, timeRemaining: () => 10 }),
    );
  });
}
async function runFrame() {
  const callbacks = [...frameCallbacks.values()];
  frameCallbacks.clear();
  await act(async () => callbacks.forEach((callback) => callback(0)));
}
beforeEach(() => {
  vi.resetAllMocks();
  window.history.replaceState(null, '', '/');
  idleCallbacks = new Map();
  frameCallbacks = new Map();
  callbackId = 0;
  vi.mocked(loadCorpus).mockResolvedValue(index);
  vi.mocked(loadSourceRecords).mockImplementation(() => new Promise(() => undefined));
  vi.stubGlobal(
    'requestIdleCallback',
    vi.fn((callback: IdleRequestCallback) => {
      idleCallbacks.set(++callbackId, callback);
      return callbackId;
    }),
  );
  vi.stubGlobal(
    'cancelIdleCallback',
    vi.fn((id: number) => idleCallbacks.delete(id)),
  );
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      frameCallbacks.set(++callbackId, callback);
      return callbackId;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((id: number) => frameCallbacks.delete(id)),
  );
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { ready: Promise.resolve() },
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe('atlas data loading', () => {
  it('bounds the wait for a removed image and starts only one first request', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    document.body.innerHTML = '<div class="living-preview"><img></div>';
    const image = document.querySelector('img')!;
    Object.defineProperty(image, 'complete', { value: false });
    renderHook(() => useAtlasData());
    await act(async () => undefined);
    image.remove();
    await act(async () => vi.advanceTimersByTimeAsync(1499));
    expect(window.requestIdleCallback).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTimeAsync(1));
    expect(window.requestIdleCallback).toHaveBeenCalledTimes(1);
    expect(loadSourceRecords).not.toHaveBeenCalled();
    fireEvent.load(image);
    await runIdle();
    expect(loadSourceRecords).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['load', 'unmount'])(
    'clears the image fallback timer on %s',
    async (event) => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      document.body.innerHTML = '<div class="living-preview"><img></div>';
      const image = document.querySelector('img')!;
      Object.defineProperty(image, 'complete', { value: false });
      const view = renderHook(() => useAtlasData());
      await act(async () => undefined);
      expect(vi.getTimerCount()).toBe(1);
      if (event === 'load') fireEvent.load(image);
      else view.unmount();
      expect(vi.getTimerCount()).toBe(0);
      await act(async () => vi.advanceTimersByTimeAsync(1500));
      expect(window.requestIdleCallback).toHaveBeenCalledTimes(
        event === 'load' ? 1 : 0,
      );
    },
  );

  it.each(['success', 'failure'] as const)(
    'ignores a late initial %s after effect cleanup',
    async (outcome) => {
      const obsolete = deferred<RuntimeCorpus>();
      vi.mocked(loadCorpus).mockReturnValueOnce(obsolete.promise);
      const { result } = renderHook(() => useAtlasData(), { wrapper: StrictMode });
      await waitFor(() => expect(result.current.corpus).toBe(index));
      await act(async () => {
        if (outcome === 'success') obsolete.resolve({ ...index, sources: [] });
        else obsolete.reject(new Error('Stale failure'));
      });
      expect(result.current.corpus).toBe(index);
      expect(result.current.error).toBe('');
    },
  );

  it('reports an initial failure and ignores resolution after unmount', async () => {
    vi.mocked(loadCorpus).mockRejectedValueOnce(new Error('Index unavailable'));
    const failed = renderHook(() => useAtlasData());
    await waitFor(() => expect(failed.result.current.error).toBe('Index unavailable'));
    failed.unmount();
    const pending = deferred<RuntimeCorpus>();
    vi.mocked(loadCorpus).mockReturnValue(pending.promise);
    const cancelled = renderHook(() => useAtlasData());
    cancelled.unmount();
    await act(async () => pending.resolve(index));
    expect(window.requestIdleCallback).not.toHaveBeenCalled();
    expect(loadSourceRecords).not.toHaveBeenCalled();
  });

  it.each(['load', 'error'])(
    'waits for the first image %s, then schedules exactly one idle request',
    async (event) => {
      document.body.innerHTML = '<div class="living-preview"><img></div>';
      const image = document.querySelector('img')!;
      Object.defineProperty(image, 'complete', { value: false });
      const { result } = renderHook(() => useAtlasData());
      await waitFor(() => expect(result.current.corpus).toBe(index));
      expect(window.requestIdleCallback).not.toHaveBeenCalled();
      fireEvent(image, new Event(event));
      fireEvent(image, new Event(event === 'load' ? 'error' : 'load'));
      expect(window.requestIdleCallback).toHaveBeenCalledTimes(1);
      expect(loadSourceRecords).not.toHaveBeenCalled();
      await runIdle();
      expect(loadSourceRecords).toHaveBeenCalledExactlyOnceWith(
        index.sources.map((source) => source.id),
      );
    },
  );

  it('cleans up image listeners and an idle callback before either starts loading', async () => {
    document.body.innerHTML = '<div class="story-gallery"><img></div>';
    const image = document.querySelector('img')!;
    Object.defineProperty(image, 'complete', { value: false, configurable: true });
    const first = renderHook(() => useAtlasData());
    await waitFor(() => expect(first.result.current.corpus).toBe(index));
    first.unmount();
    fireEvent.load(image);
    expect(window.requestIdleCallback).not.toHaveBeenCalled();
    Object.defineProperty(image, 'complete', { value: true });
    const second = renderHook(() => useAtlasData());
    await waitFor(() => expect(second.result.current.corpus).toBe(index));
    const callback = [...idleCallbacks.values()][0]!;
    second.unmount();
    expect(window.cancelIdleCallback).toHaveBeenCalled();
    await act(async () => callback({ didTimeout: true, timeRemaining: () => 0 }));
    expect(loadSourceRecords).not.toHaveBeenCalled();
  });

  it('loads without idle support and avoids fetching a complete bibliography', async () => {
    vi.stubGlobal('requestIdleCallback', undefined);
    const first = renderHook(() => useAtlasData());
    await waitFor(() => expect(loadSourceRecords).toHaveBeenCalledTimes(1));
    first.unmount();
    vi.mocked(loadCorpus).mockResolvedValue({ ...index, sources });
    const second = renderHook(() => useAtlasData());
    await waitFor(() => expect(second.result.current.corpus?.sources).toBe(sources));
    expect(loadSourceRecords).toHaveBeenCalledTimes(1);
  });

  it('keeps failure until explicit retry and rejects an obsolete source response', async () => {
    const first = deferred<Source[]>();
    const second = deferred<Source[]>();
    const third = deferred<Source[]>();
    vi.mocked(loadSourceRecords)
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise)
      .mockReturnValueOnce(third.promise);
    const { result, rerender } = renderHook(() => useAtlasData());
    await waitFor(() => expect(result.current.corpus).toBe(index));
    await runIdle();
    await act(async () => first.reject(new Error('Offline')));
    window.history.replaceState(null, '', '/?subject=angkor');
    rerender();
    expect(result.current.bibliography).toBe('failed');
    expect(loadSourceRecords).toHaveBeenCalledTimes(1);
    act(() => result.current.retryBibliography());
    expect(result.current.bibliography).toBe('loading');
    act(() => result.current.retryBibliography());
    await act(async () => second.resolve(sources));
    expect(result.current.corpus).toBe(index);
    expect(result.current.bibliography).toBe('loading');
    await act(async () => third.resolve(sources));
    expect(result.current.corpus?.sources).toBe(sources);
    expect(result.current.bibliography).toBe('ready');
  });
});

function RecoveryHarness() {
  const state = useAtlasData();
  return createElement(
    'div',
    null,
    createElement('h1', { 'data-reading-title': true, tabIndex: -1 }, 'Reading'),
    state.bibliography !== 'ready' &&
      createElement(
        'div',
        { ref: state.bibliographyNotice, role: 'status', tabIndex: -1 },
        state.bibliography,
        state.bibliography === 'failed' &&
          createElement(
            'button',
            { ref: state.bibliographyRetry, onClick: state.retryBibliography },
            'Retry',
          ),
      ),
  );
}
async function failedRecovery() {
  vi.mocked(loadSourceRecords).mockRejectedValueOnce(new Error('Offline'));
  const view = render(createElement(RecoveryHarness));
  await waitFor(() => expect(idleCallbacks.size).toBe(1));
  await runIdle();
  await screen.findByRole('button', { name: 'Retry' });
  return view;
}
describe('bibliography recovery focus', () => {
  it.each(['success', 'failure'] as const)(
    'preserves focus after navigation during retry %s',
    async (outcome) => {
      await failedRecovery();
      const pending = deferred<Source[]>();
      vi.mocked(loadSourceRecords).mockReturnValueOnce(pending.promise);
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      expect(screen.getByRole('status')).toHaveFocus();
      window.history.pushState(null, '', '/?page=notebook');
      const notebook = document.createElement('button');
      notebook.textContent = 'Edit saved answer';
      document.body.append(notebook);
      notebook.focus();
      await act(async () => {
        if (outcome === 'success') pending.resolve(sources);
        else pending.reject(new Error('Still offline'));
      });
      await runFrame();
      await runFrame();
      expect(notebook).toHaveFocus();
    },
  );

  it('honors a URL change without a focus event before recovery completes', async () => {
    await failedRecovery();
    const pending = deferred<Source[]>();
    vi.mocked(loadSourceRecords).mockReturnValueOnce(pending.promise);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    window.history.pushState(null, '', '/?page=notebook');
    await act(async () => pending.resolve(sources));
    expect(frameCallbacks.size).toBe(0);
  });

  it.each(['focus', 'pointer', 'keyboard', 'history'] as const)(
    'honors later %s intent while font loading delays recovery',
    async (intent) => {
      const fonts = deferred<void>();
      Object.defineProperty(document, 'fonts', { value: { ready: fonts.promise } });
      await failedRecovery();
      vi.mocked(loadSourceRecords).mockResolvedValueOnce(sources);
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
      await runFrame();
      const button = document.createElement('button');
      document.body.append(button);
      if (intent === 'focus') {
        button.focus();
        button.blur();
      } else if (intent === 'pointer') fireEvent.pointerDown(button);
      else if (intent === 'keyboard') fireEvent.keyDown(document, { key: 'Tab' });
      else window.dispatchEvent(new PopStateEvent('popstate'));
      const focus = vi.spyOn(HTMLElement.prototype, 'focus');
      await act(async () => fonts.resolve());
      await runFrame();
      expect(focus).not.toHaveBeenCalled();
      focus.mockRestore();
    },
  );

  it('moves focus through loading and repeat failure, then restores reading', async () => {
    await failedRecovery();
    const retry = deferred<Source[]>();
    vi.mocked(loadSourceRecords).mockReturnValueOnce(retry.promise);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByRole('status')).toHaveFocus();
    await act(async () => retry.reject(new Error('Still offline')));
    expect(screen.getByRole('button', { name: 'Retry' })).toHaveFocus();
    vi.mocked(loadSourceRecords).mockResolvedValueOnce(sources);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
    await runFrame();
    expect(screen.getByRole('heading')).not.toHaveFocus();
    await runFrame();
    expect(screen.getByRole('heading')).toHaveFocus();
  });

  it.each(['fonts', 'second frame'])(
    'cancels recovery focus after unmount while waiting for %s',
    async (stage) => {
      const fonts = deferred<void>();
      Object.defineProperty(document, 'fonts', { value: { ready: fonts.promise } });
      const view = await failedRecovery();
      vi.mocked(loadSourceRecords).mockResolvedValueOnce(sources);
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
      await runFrame();
      if (stage === 'second frame') await act(async () => fonts.resolve());
      view.unmount();
      const focus = vi.spyOn(HTMLElement.prototype, 'focus');
      document.body.innerHTML = '<h1 data-reading-title tabindex="-1">New route</h1>';
      await act(async () => fonts.resolve());
      await runFrame();
      expect(focus).not.toHaveBeenCalled();
      focus.mockRestore();
    },
  );

  it('keeps focus in an open dialog when recovery finishes', async () => {
    await failedRecovery();
    vi.mocked(loadSourceRecords).mockResolvedValueOnce(sources);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
    const dialog = document.createElement('dialog');
    dialog.open = true;
    dialog.tabIndex = -1;
    document.body.append(dialog);
    dialog.focus();
    await runFrame();
    await runFrame();
    expect(dialog).toHaveFocus();
  });
});
