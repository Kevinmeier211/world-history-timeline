import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import {
  posterEntries,
  posterNoteGroups,
  posterNoteHeight,
  posterNotePageBudget,
  posterRows,
  posterSources,
  type PosterEntry,
} from './poster-layout';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const entries = posterEntries(corpus);
const sources = posterSources(corpus);

function shortEntry(key: number): PosterEntry {
  const entry = structuredClone(entries[0]!);
  entry.key = key;
  entry.context = undefined;
  entry.subject.name = 'A short case';
  entry.subject.summary = 'A bounded example.';
  entry.subject.place = 'A named place';
  entry.subject.interval.label = '100–200 CE';
  entry.subject.interval.note = 'A qualified interval.';
  entry.interval = entry.subject.interval;
  return entry;
}

describe('Adaptive regional poster-note pagination', () => {
  it('keeps short entries together, with at most two per page and no empty sheets', () => {
    const input = Array.from({ length: 5 }, (_, i) => shortEntry(i + 1));
    const groups = posterNoteGroups(input, []);
    expect(groups.map((group) => group.length)).toEqual([2, 2, 1]);
    expect(groups.flat()).toEqual(input);
    expect(posterNoteGroups([], [])).toEqual([]);
  });

  it('separates the measured overfull Abbasid/Ottoman pair without altering either record', () => {
    const input = ['abbasid-craft', 'ottoman-workshops'].map((id) =>
      entries.find((entry) => entry.subject.id === id),
    );
    expect(input.every(Boolean)).toBe(true);
    const pair = input as PosterEntry[];
    const before = JSON.stringify(pair);
    const groups = posterNoteGroups(pair, sources);
    expect(groups).toHaveLength(2);
    expect(groups[0]![0]).toBe(pair[0]);
    expect(groups[1]![0]).toBe(pair[1]);
    expect(JSON.stringify(pair)).toBe(before);
  });

  it('budgets titles, reference prose and both date explanations, rather than entry count alone', () => {
    const original = structuredClone(entries.find((entry) => entry.context)!);
    const mutations: ((entry: PosterEntry) => void)[] = [
      (entry) => {
        entry.context!.title = 'Long title '.repeat(100);
      },
      (entry) => {
        entry.context!.summary = 'Long reference explanation '.repeat(100);
      },
      (entry) => {
        entry.interval = {
          ...entry.interval,
          label: 'Qualified reference dates '.repeat(100),
        };
      },
      (entry) => {
        entry.interval = {
          ...entry.interval,
          note: 'Reference date uncertainty '.repeat(100),
        };
      },
      (entry) => {
        entry.subject.interval.note = 'Retained case date uncertainty '.repeat(100);
      },
      (entry) => {
        entry.subject.name = 'A long case title '.repeat(100);
      },
      (entry) => {
        entry.subject.place = 'A qualified place description '.repeat(100);
      },
    ];
    for (const mutate of mutations) {
      const long = structuredClone(original);
      mutate(long);
      expect(posterNoteHeight(long, sources)).toBeGreaterThan(posterNotePageBudget);
      expect(posterNoteGroups([long, shortEntry(90)], sources)).toEqual([
        [long],
        [shortEntry(90)],
      ]);
    }
  });

  it('includes printed source keys in the budget and preserves an oversized singleton intact', () => {
    const entry = shortEntry(1);
    const manySources = Array.from({ length: 500 }, (_, i) => ({
      number: i + 1,
      uses: [{ key: 1, locators: ['A retained source locator'] }],
    }));
    expect(posterNoteHeight(entry, manySources)).toBeGreaterThan(posterNotePageBudget);
    const groups = posterNoteGroups([entry, shortEntry(2)], manySources);
    expect(groups.map((group) => group.length)).toEqual([1, 1]);
    expect(groups[0]![0]).toBe(entry);
    expect(entry.subject.interval.note).toBe('A qualified interval.');
  });

  it('retains every regional entry, citation and complete date record in chronological order', () => {
    const before = JSON.stringify(corpus);
    for (const row of posterRows(corpus)) {
      const groups = posterNoteGroups(row.entries, sources);
      expect(groups.flat()).toEqual(row.entries);
      for (const [i, entry] of groups.flat().entries()) {
        expect(entry).toBe(row.entries[i]);
      }
      for (const group of groups) {
        expect(group.length).toBeGreaterThan(0);
        expect(group.length).toBeLessThanOrEqual(2);
        if (group.length === 2) {
          // The published budget reserves spacing as well as text, so the
          // combined card heights must leave room rather than consume it all.
          expect(
            group.reduce(
              (height, entry) => height + posterNoteHeight(entry, sources),
              0,
            ),
          ).toBeLessThan(posterNotePageBudget);
        }
      }
    }
    expect(JSON.stringify(corpus)).toBe(before);
  });

  it('accounts for a long unbroken title rather than treating it as one line', () => {
    const entry = shortEntry(1);
    const shortHeight = posterNoteHeight(entry, []);
    entry.subject.name = 'W'.repeat(3000);
    expect(posterNoteHeight(entry, [])).toBeGreaterThan(
      shortHeight + posterNotePageBudget,
    );
    expect(
      posterNoteGroups([entry, shortEntry(2)], []).map((group) => group.length),
    ).toEqual([1, 1]);
  });
});
