import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Corpus, Journey, JourneySummary, RuntimeCorpus } from './model';
import { buildJourneyBootstrap } from '../../scripts/redesign/bootstrap-journeys';
import { loadCorpus, loadJourneyDetails } from './data';
import { useJourneyDetails } from './use-journey-details';
import { Atlas } from './App';
import chapterLearning from './chapter-learning.json';

vi.mock('./data', () => ({
  loadCorpus: vi.fn(),
  loadJourneyDetails: vi.fn(),
  loadSubject: vi.fn(),
  loadSourceScopes: vi.fn(),
  asset: (url: string) => url,
}));
vi.mock('./Timeline', () => ({ Timeline: () => null }));
vi.mock('./WorldContext', () => ({ WorldContext: () => null }));
vi.mock('./Dossier', () => ({
  Dossier: () =>
    createElement(
      'section',
      { 'data-testid': 'case-reading' },
      'Case and source reading',
    ),
}));
vi.mock('./Compare', () => ({ Compare: () => null }));

const canonical: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const bootstrap = buildJourneyBootstrap(canonical);
const full = canonical.journeys.find((j) => j.id === 'objects-places-associations')!;
const brief = () => structuredClone(bootstrap.journeys.find((j) => j.id === full.id)!);
const load = vi.mocked(loadJourneyDetails);
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function runtime(deferred = true): RuntimeCorpus {
  return {
    ...structuredClone(canonical),
    journeyDetailsDeferred: deferred ? true : undefined,
    journeys: deferred
      ? structuredClone(bootstrap.journeys)
      : structuredClone(canonical.journeys),
  };
}
function route(step = 0) {
  const stop = full.stops[step]!;
  window.history.replaceState(
    null,
    '',
    `/?journey=${full.id}&step=${step}&pack=C4&subject=${stop.subject}&scale=local&year=${stop.year}`,
  );
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
  vi.mocked(loadCorpus).mockResolvedValue(runtime());
});
afterEach(() => cleanup());

describe('journey reading state', () => {
  it('needs no request for a full corpus or no selected journey', () => {
    const { result, rerender } = renderHook(
      ({ selected, deferred }) => useJourneyDetails(selected, deferred),
      {
        initialProps: {
          selected: undefined as JourneySummary | undefined,
          deferred: true,
        },
      },
    );
    expect(result.current.status).toBe('idle');
    rerender({ selected: full, deferred: false });
    expect(result.current).toMatchObject({ status: 'ready', journey: full });
    expect(load).not.toHaveBeenCalled();
  });

  it.each([undefined, 'bad-revision', 'A'.repeat(64)])(
    'identifies malformed bootstrap revision %s as reload-needed without a no-op retry',
    (revision) => {
      const missingRevision = brief();
      if (revision === undefined) delete missingRevision.detailsRevision;
      else missingRevision.detailsRevision = revision;
      const { result, rerender } = renderHook(
        ({ selected, deferred }) => useJourneyDetails(selected, deferred),
        { initialProps: { selected: missingRevision, deferred: true } },
      );
      expect(result.current).toMatchObject({ status: 'failed', recovery: 'reload' });
      rerender({ selected: brief(), deferred: false });
      expect(result.current).toMatchObject({ status: 'failed', recovery: 'reload' });
      expect(load).not.toHaveBeenCalled();
    },
  );

  it('supports failure and retry without retaining a previous attempt’s reading', async () => {
    load.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce(full);
    const selected = brief();
    const { result } = renderHook(() => useJourneyDetails(selected, true));
    await waitFor(() => expect(result.current.status).toBe('failed'));
    act(() => result.current.retry());
    await waitFor(() =>
      expect(result.current).toMatchObject({ status: 'ready', journey: full }),
    );
    expect(load).toHaveBeenCalledTimes(2);
  });

  it.each(['resolve', 'reject'] as const)(
    'ignores an older journey’s late %s after navigation',
    async (settlement) => {
      const older = deferred<Journey>();
      const newer = deferred<Journey>();
      load.mockReturnValueOnce(older.promise).mockReturnValueOnce(newer.promise);
      const nextFull = canonical.journeys.find((j) => j.id !== full.id)!;
      const nextBrief = structuredClone(
        bootstrap.journeys.find((j) => j.id === nextFull.id)!,
      );
      const { result, rerender } = renderHook(
        ({ selected }) => useJourneyDetails(selected, true),
        { initialProps: { selected: brief() } },
      );
      rerender({ selected: nextBrief });
      expect(result.current.status).toBe('loading');
      await act(async () => newer.resolve(nextFull));
      expect(result.current).toMatchObject({ status: 'ready', journey: nextFull });
      await act(async () =>
        settlement === 'resolve'
          ? older.resolve(full)
          : older.reject(new Error('Older failed')),
      );
      expect(result.current).toMatchObject({ status: 'ready', journey: nextFull });
    },
  );
});

describe('selected journey interface', () => {
  it('keeps navigation/save/case reading available pending and preserves the focused heading on hydration', async () => {
    const pending = deferred<Journey>();
    load.mockReturnValue(pending.promise);
    route();
    render(createElement(Atlas));
    const heading = await screen.findByRole('heading', { name: full.stops[0]!.title });
    const section = heading.closest('.journey-context')!;
    expect(section).toHaveAttribute('data-journey-status', 'loading');
    expect(within(section as HTMLElement).getByRole('status')).toHaveTextContent(
      'Loading journey reading',
    );
    expect(await screen.findByTestId('case-reading')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save journey' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next stop →' })).toBeEnabled();
    act(() => heading.focus());
    expect(heading).toHaveFocus();
    await act(async () => pending.resolve(full));
    expect(section).toHaveAttribute('data-journey-status', 'ready');
    expect(screen.getByRole('heading', { name: full.stops[0]!.title })).toBe(heading);
    expect(heading).toHaveFocus();
    expect(
      within(section as HTMLElement).getByText(full.stops[0]!.narrative),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Next stop →' }));
    expect(await screen.findByRole('heading', { name: full.stops[1]!.title })).toBe(
      heading,
    );
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('shows a failure/retry and no partial quiz, then restores the complete final reading', async () => {
    load.mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce(full);
    route(full.stops.length - 1);
    render(createElement(Atlas));
    const retry = await screen.findByRole('button', { name: 'Retry journey reading' });
    const ending = document.getElementById('journey-ending')!;
    expect(ending).toHaveAttribute('data-journey-status', 'failed');
    expect(within(ending).queryByText(full.evidence.prompt)).not.toBeInTheDocument();
    expect(within(ending).getByText(full.returnPrompt)).toBeVisible();
    expect(screen.getByRole('button', { name: 'Previous stop' })).toBeEnabled();
    const heading = screen.getByRole('heading', { name: full.stops.at(-1)!.title });
    retry.focus();
    fireEvent.click(retry);
    expect(heading).toHaveFocus();
    expect(
      await screen.findByRole('heading', { name: full.evidence.prompt }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: full.stops.at(-1)!.title })).toBe(
      heading,
    );
    expect(heading).toHaveFocus();
    for (const option of full.evidence.options)
      expect(within(ending).getByRole('button', { name: option.text })).toBeVisible();
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('shows explicit reload recovery for an index missing its revision', async () => {
    const malformed = runtime();
    delete malformed.journeys.find((j) => j.id === full.id)!.detailsRevision;
    vi.mocked(loadCorpus).mockResolvedValue(malformed);
    route();
    render(createElement(Atlas));
    expect(await screen.findByRole('button', { name: 'Reload atlas' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Retry journey reading' }),
    ).not.toBeInTheDocument();
    expect(load).not.toHaveBeenCalled();
  });

  it('lists an authored task and estimated duration for every route before loading details', async () => {
    window.history.replaceState(null, '', '/?page=journeys');
    render(createElement(Atlas));
    expect(await screen.findByRole('heading', { name: full.title })).toBeVisible();
    for (const j of canonical.journeys) {
      const card = screen.getByRole('heading', { name: j.title }).closest('article')!;
      const outcome =
        chapterLearning.find((row) => row.journey === j.id)?.deeperOutcome ??
        j.returnPrompt;
      expect(card).toHaveAccessibleName(j.title);
      expect(
        within(card).getByRole('button', { name: 'Begin investigation →' }),
      ).toHaveAccessibleDescription(j.title);
      expect(card).toHaveTextContent(outcome);
      expect(card).toHaveTextContent(`${j.duration} (estimated)`);
    }
    expect(load).not.toHaveBeenCalled();
  });

  it('continues only the saved route at its stored stop from its library card', async () => {
    const stop = full.stops[1]!;
    localStorage.setItem(
      'chronos.resume',
      `?journey=${full.id}&step=1&pack=C4&subject=${stop.subject}&scale=local&year=${stop.year}`,
    );
    window.history.replaceState(null, '', '/?page=journeys');
    load.mockResolvedValue(full);
    render(createElement(Atlas));
    const saved = await screen.findByRole('button', { name: /Continue at stop/ });
    expect(saved.closest('article')).toHaveTextContent(full.title);
    fireEvent.click(saved);
    expect(await screen.findByRole('heading', { name: stop.title })).toBeVisible();
    const params = new URLSearchParams(window.location.search);
    expect(params.get('journey')).toBe(full.id);
    expect(params.get('step')).toBe('1');
  });
});
