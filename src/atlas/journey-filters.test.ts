import { readFileSync } from 'node:fs';
import { createElement, useState } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Corpus, RuntimeCorpus } from './model';
import { buildJourneyBootstrap } from '../../scripts/redesign/bootstrap-journeys';
import {
  defaultJourneyFilters,
  matchesJourneyFilters,
  normalizeJourneyFilters,
} from './journey-filters';
import {
  initialLocation,
  locationQuery,
  readLocation,
  type Location,
} from './navigation';
import { JourneyLibrary } from './JourneyLibrary';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const runtime: RuntimeCorpus = {
  ...corpus,
  journeys: buildJourneyBootstrap(corpus).journeys,
};
afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('journey filters and their navigation state', () => {
  it('keeps default links compact and validates independently named library filters', () => {
    const ordinary = locationQuery(initialLocation);
    expect(
      locationQuery({ ...initialLocation, journeyFilters: defaultJourneyFilters }),
    ).toBe(ordinary);
    const chosen = normalizeJourneyFilters({
      query: 'water & work',
      chapter: 'C1',
      region: 'South Asia',
      duration: '40',
      theme: 'THEME03',
      track: 'family',
    });
    const route = {
      ...initialLocation,
      destination: 'journeys' as const,
      journeyFilters: chosen,
    };
    expect(readLocation(locationQuery(route))).toEqual(route);
    expect(
      readLocation(
        '?page=journeys&jtrack=other&jchapter=C99&jregion=Moon&jduration=-1&jtheme=UNKNOWN',
      ).journeyFilters,
    ).toBeUndefined();
    expect(normalizeJourneyFilters({ query: 'x'.repeat(500) }).query).toHaveLength(200);
  });

  it('applies all selected conditions and uses the upper duration estimate', () => {
    const journey = runtime.journeys.find((j) => j.id === 'cities-work-water')!;
    expect(
      matchesJourneyFilters(
        journey,
        runtime,
        normalizeJourneyFilters({
          query: 'WORK',
          chapter: 'C1',
          region: 'South Asia',
          duration: '40',
          track: 'family',
        }),
      ),
    ).toBe(true);
    expect(
      matchesJourneyFilters(
        journey,
        runtime,
        normalizeJourneyFilters({ chapter: 'C8' }),
      ),
    ).toBe(false);
    expect(
      matchesJourneyFilters(
        { ...journey, duration: '35–50 minutes' },
        runtime,
        normalizeJourneyFilters({ duration: '40' }),
      ),
    ).toBe(false);
    expect(
      matchesJourneyFilters(
        { ...journey, duration: 'unknown' },
        runtime,
        normalizeJourneyFilters({ duration: '40' }),
      ),
    ).toBe(false);
    expect(
      matchesJourneyFilters(
        journey,
        runtime,
        normalizeJourneyFilters({ theme: 'THEME01' }),
      ),
    ).toBe(false);
  });

  it('derives family eligibility from authored tasks without claiming a route is age tested', () => {
    expect(corpus.journeys.every((j) => !!j.familyEvidence)).toBe(true);
    expect(runtime.journeys.every((j) => j.hasFamilyActivity)).toBe(true);
    expect(
      runtime.journeys.filter((j) =>
        matchesJourneyFilters(j, runtime, normalizeJourneyFilters({ track: 'family' })),
      ),
    ).toHaveLength(33);
    const adultOnly = {
      ...runtime.journeys[0]!,
      id: 'adult-only',
      hasFamilyActivity: false,
    };
    expect(matchesJourneyFilters(adultOnly, runtime, defaultJourneyFilters)).toBe(true);
    expect(
      matchesJourneyFilters(
        adultOnly,
        runtime,
        normalizeJourneyFilters({ track: 'family' }),
      ),
    ).toBe(false);
  });

  it('renders restored filters and their matching cards, then resets all choices', () => {
    function Library() {
      const [location, setLocation] = useState<Location>({
        ...initialLocation,
        destination: 'journeys',
        journeyFilters: normalizeJourneyFilters({
          query: 'WATER',
          chapter: 'C1',
          track: 'family',
        }),
      });
      return createElement(JourneyLibrary, {
        corpus: runtime,
        location,
        changeFilters: (journeyFilters) => setLocation({ ...location, journeyFilters }),
        start: vi.fn(),
        navigate: vi.fn(),
        openActivity: vi.fn(),
      });
    }
    render(createElement(Library));
    expect(
      screen.getByRole('searchbox', { name: 'Find an investigation' }),
    ).toHaveValue('WATER');
    expect(screen.getByRole('combobox', { name: 'Reading track' })).toHaveValue(
      'family',
    );
    expect(screen.getByRole('combobox', { name: 'Period / chapter' })).toHaveValue(
      'C1',
    );
    expect(screen.getAllByRole('button', { name: 'Open short activity' })).toHaveLength(
      3,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByRole('combobox', { name: 'Reading track' })).toHaveValue(
      'adult',
    );
    expect(
      screen.getByRole('searchbox', { name: 'Find an investigation' }),
    ).toHaveValue('');
    expect(
      screen.getAllByRole('button', { name: 'Begin investigation →' }),
    ).toHaveLength(33);
  });

  it('replaces search edits while recording dropdown choices separately', () => {
    const changeFilters = vi.fn();
    render(
      createElement(JourneyLibrary, {
        corpus: runtime,
        location: initialLocation,
        changeFilters,
        start: vi.fn(),
        navigate: vi.fn(),
        openActivity: vi.fn(),
      }),
    );
    fireEvent.change(screen.getByRole('searchbox', { name: 'Find an investigation' }), {
      target: { value: 'work' },
    });
    expect(changeFilters).toHaveBeenLastCalledWith(
      { ...defaultJourneyFilters, query: 'work' },
      true,
    );
    fireEvent.change(screen.getByRole('combobox', { name: 'Reading track' }), {
      target: { value: 'family' },
    });
    expect(changeFilters).toHaveBeenLastCalledWith(
      { ...defaultJourneyFilters, track: 'family' },
      false,
    );
  });

  it('resets the reading position while retaining notebook content', () => {
    const journey = corpus.journeys[0]!;
    const stop = journey.stops[1]!;
    localStorage.setItem(
      'chronos.resume',
      locationQuery({
        ...initialLocation,
        journey: journey.id,
        step: 1,
        subject: stop.subject,
      }),
    );
    localStorage.setItem('chronos.household.v1', '{"version":1,"notes":[]}');
    const navigate = vi.fn();
    render(
      createElement(JourneyLibrary, {
        corpus: runtime,
        location: initialLocation,
        changeFilters: vi.fn(),
        start: vi.fn(),
        navigate,
        openActivity: vi.fn(),
      }),
    );
    const button = screen.getByRole('button', { name: /Continue at stop 2/ });
    expect(within(button.closest('article')!).getByRole('heading')).toHaveTextContent(
      journey.title,
    );
    fireEvent.click(button);
    expect(navigate).toHaveBeenCalledWith(
      expect.objectContaining({ journey: journey.id, step: 1 }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reset reading position' }));
    expect(localStorage.getItem('chronos.resume')).toBeNull();
    expect(localStorage.getItem('chronos.household.v1')).toBe(
      '{"version":1,"notes":[]}',
    );
    expect(screen.queryByRole('button', { name: /Continue at stop/ })).toBeNull();
  });
});
