import { readFileSync } from 'node:fs';
import { createElement, useState } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Corpus, RuntimeCorpus } from './model';
import { distanceFromInterval } from './chronology';
import { explorationSelection, regionalStartingPoints, timeTicks } from './exploration';
import { LivingTimeline } from './LivingTimeline';
import { StoryPreview } from './StoryPreview';
import { TimeNavigator } from './TimeExplorer';
import { initialLocation, locationQuery, readLocation } from './navigation';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const index: RuntimeCorpus = JSON.parse(
  readFileSync('public/atlas/index.json', 'utf8'),
);
afterEach(() => cleanup());

describe('living timeline exploration', () => {
  it('suggests the nearest available case per region without widening dates or changing the corpus', () => {
    const before = JSON.stringify(index);
    for (const year of [-3300, -1, 1, 200, 1200, 1950, 2000]) {
      const suggestions = regionalStartingPoints(index.subjects, year);
      expect(new Set(suggestions.map((s) => s.region)).size).toBe(suggestions.length);
      for (const subject of suggestions) {
        expect(distanceFromInterval(subject.interval, year)).toBeLessThanOrEqual(150);
        expect(distanceFromInterval(subject.interval, year)).toBe(
          Math.min(
            ...index.subjects
              .filter((s) => s.region === subject.region)
              .map((s) => distanceFromInterval(s.interval, year)),
          ),
        );
      }
    }
    expect(JSON.stringify(index)).toBe(before);
  });

  it('uses calendar multiples in full history and each chapter window', () => {
    expect(timeTicks({ start: -3300, end: 2000 })).toEqual([
      -3000, -2000, -1000, 1000, 2000,
    ]);
    const expected = [
      [-3250, -3000, -2750, -2500, -2250, -2000],
      [-2000, -1750, -1500, -1250, -1000],
      [-1000, -750, -500, -250],
      [100, 200, 300, 400, 500],
      [500, 600, 700, 800, 900, 1000],
      [1000, 1100, 1200, 1300, 1400, 1500],
      [1500, 1600, 1700, 1800],
      [1800, 1850, 1900, 1950, 2000],
    ];
    for (const [i, pack] of index.packs.entries()) {
      expect(timeTicks(pack.displayWindow ?? pack), pack.id).toEqual(expected[i]);
    }
  });

  it('preserves a shared preview selection while respecting chapter and region filters', () => {
    const location = { ...initialLocation, preview: 'roman-world' };
    expect(readLocation(locationQuery(location))).toEqual(location);
    expect(explorationSelection(index, index.subjects, 200, location.preview)?.id).toBe(
      'roman-world',
    );
    const filtered = index.subjects.filter(
      (s) => s.region === 'East Asia' && s.packs.includes('C4'),
    );
    expect(explorationSelection(index, filtered, 200, location.preview)?.id).toBe(
      'eastern-han',
    );
    expect(timeTicks({ start: -1, end: 1 })).toEqual([-1, 1]);
  });

  it('previews a selected case without opening a dossier, then carries the draft moment into reading or comparison', () => {
    const openSubject = vi.fn(),
      compareWorld = vi.fn();
    function Explorer() {
      const [location, setLocation] = useState(initialLocation);
      return createElement(LivingTimeline, {
        corpus: index,
        location,
        pack: index.packs.find((p) => p.id === 'C4')!,
        openSubject,
        compareWorld,
        goYear: vi.fn(),
        openPack: vi.fn(),
        previewSubject: (id) => setLocation({ ...location, preview: id }),
      });
    }
    render(createElement(Explorer));
    const row = document.querySelector('.living-track[data-subject="roman-world"]')!;
    fireEvent.click(row);
    expect(openSubject).not.toHaveBeenCalled();
    const preview = screen.getByRole('complementary', {
      name: 'Selected timeline story',
    });
    expect(within(preview).getByRole('heading')).toHaveTextContent(
      'How did an imperial family make itself visible?',
    );
    fireEvent.change(screen.getByRole('slider'), { target: { value: '150' } });
    expect(
      within(preview).getByText('Different dates: this case does not span 150 CE.'),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Compare this moment ↗' }));
    expect(compareWorld).toHaveBeenCalledWith(150, 'roman-world');
    fireEvent.click(within(preview).getByRole('button', { name: 'Read this story →' }));
    expect(openSubject).toHaveBeenCalledWith(
      index.subjects.find((s) => s.id === 'roman-world'),
      expect.any(String),
      150,
    );
  });

  it('keeps imageless cases available in the full chapter directory', () => {
    render(
      createElement(LivingTimeline, {
        corpus: index,
        location: { ...initialLocation, pack: 'C2', year: -1200 },
        pack: index.packs.find((p) => p.id === 'C2')!,
        openSubject: vi.fn(),
        openPack: vi.fn(),
        goYear: vi.fn(),
        previewSubject: vi.fn(),
        compareWorld: vi.fn(),
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Browse all/ }));
    expect(
      document.querySelector('.living-track[data-subject="uluburun"]'),
    ).toBeVisible();
    expect(document.querySelectorAll('.living-track')).toHaveLength(
      index.subjects.filter((s) => s.packs.includes('C2')).length,
    );
  });

  it('shows the original case, image and source qualifications in the preview', async () => {
    const subject = corpus.subjects.find((s) => s.id === 'eastern-han')!;
    const object = corpus.media.find((m) => m.id === subject.objectIds[0])!;
    render(
      createElement(StoryPreview, { corpus, subject, year: 200, openSubject: vi.fn() }),
    );
    fireEvent.click(screen.getByText('Dates, image & source notes'));
    expect(await screen.findByText(object.caption)).toBeVisible();
    expect(screen.getByText(subject.interval.note)).toBeVisible();
    expect(screen.getByText(object.date.note)).toBeVisible();
    expect(screen.getByText(object.credit)).toBeVisible();
    expect(screen.getByText(object.rights)).toBeVisible();
    if (object.datingNote) expect(screen.getByText(object.datingNote)).toBeVisible();
    fireEvent.click(screen.getByText('Story overview'));
    expect(screen.getByText(subject.summary)).toBeVisible();
  });
});

describe('time controls', () => {
  it('previews across BCE and CE without year zero and only commits on Explore', () => {
    const goYear = vi.fn(),
      onPreview = vi.fn();
    render(
      createElement(TimeNavigator, {
        corpus: index,
        year: -1,
        region: 'all',
        goYear,
        onPreview,
        range: { start: -1, end: 1 },
      }),
    );
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    expect(onPreview).toHaveBeenCalledWith(1);
    expect(screen.getByLabelText('Go to year')).toHaveValue('1 CE');
    expect(goYear).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Explore 1 CE' }));
    expect(goYear).toHaveBeenCalledWith(1);
  });

  it('rejects year zero and out-of-range text without changing the chosen moment', () => {
    const goYear = vi.fn();
    render(
      createElement(TimeNavigator, { corpus: index, year: 200, region: 'all', goYear }),
    );
    fireEvent.click(screen.getByText('More date controls'));
    for (const value of ['0', '3301 BCE', '2001 CE']) {
      fireEvent.change(screen.getByLabelText('Go to year'), { target: { value } });
      fireEvent.click(screen.getByRole('button', { name: 'Go' }));
      expect(screen.getByRole('alert')).toHaveTextContent('There is no year zero.');
    }
    expect(goYear).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Go to year'), {
      target: { value: '1200 BCE' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(goYear).toHaveBeenCalledWith(-1200);
  });
});
