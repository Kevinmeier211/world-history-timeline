import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import type { Corpus } from './model';
import {
  posterEntries,
  posterRows,
  posterPosition,
  posterSources,
  posterCitations,
  posterRange,
  posterWidth,
  posterLabelWidth,
  posterSourceGroups,
} from './poster-layout';
import { PosterNotes } from './WorldPoster';

const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
describe('Proportional world poster and its source companion', () => {
  it('balances growing source notes without dropping, duplicating or reordering records', () => {
    const sources = posterSources(c);
    const groups = posterSourceGroups(sources);
    expect(groups.flat()).toEqual(sources);
    expect(groups.every((group) => group.length >= 2 && group.length <= 3)).toBe(true);
    expect(posterSourceGroups([])).toEqual([]);
    expect(posterSourceGroups(['only'])).toEqual([['only']]);
  });
  it('retains 25 anchors and seven regions without modifying source dates', () => {
    const before = JSON.stringify(c);
    expect(posterEntries(c)).toHaveLength(25);
    expect(posterRows(c)).toHaveLength(7);
    expect(new Set(posterEntries(c).map((e) => e.key)).size).toBe(25);
    expect(JSON.stringify(c)).toBe(before);
  });
  it('uses continuous elapsed time across BCE/CE without a year zero', () => {
    expect(posterPosition(2000)).toBe(1);
    expect(posterPosition(-3300)).toBe(0);
    expect(posterPosition(1) - posterPosition(-1)).toBeCloseTo(1 / 5299, 12);
    expect(posterPosition(-1000) - posterPosition(-2000)).toBeCloseTo(
      posterPosition(2000) - posterPosition(1000),
      12,
    );
    expect(() => posterPosition(0)).toThrow('no year 0');
  });
  it('keeps late clustered labels inside the page and apart on each track', () => {
    for (const row of posterRows(c)) {
      for (const track of [0, 1]) {
        const entries = row.entries.filter((e) => e.track === track);
        for (const [i, entry] of entries.entries()) {
          expect(entry.labelLeft).toBeGreaterThanOrEqual(0);
          expect(entry.labelLeft + posterLabelWidth).toBeLessThanOrEqual(posterWidth);
          if (i)
            expect(entry.labelLeft).toBeGreaterThanOrEqual(
              entries[i - 1]!.labelLeft + posterLabelWidth + 3,
            );
        }
      }
    }
  });
  it('distinguishes a reference frame from its retained narrower case', () => {
    const ghana = posterEntries(c).find((e) => e.subject.id === 'ghana-independence')!;
    expect(ghana.interval.start).toBe(1948);
    expect(ghana.interval.end).toBe(1964);
    expect(ghana.subject.interval.end).toBe(1960);
    expect(ghana.context).toBeDefined();
    const tomioka = posterEntries(c).find((e) => e.subject.id === 'tomioka')!;
    expect(tomioka.context?.id).toBe('tomioka-skill-work-context');
    expect(posterRange(tomioka)).toBe('1872-1916 CE');
    expect(tomioka.subject.interval.start).toBe(1872);
    expect(tomioka.subject.interval.end).toBe(1872);
    const factory = posterEntries(c).find((e) => e.subject.id === 'factory-reform')!;
    expect(factory.context?.id).toBe('factory-work-inspection-context');
    expect(posterRange(factory)).toBe('1833-1836 CE');
    expect(factory.subject.interval.precision).toBe('approximate');
    expect(posterRange(ghana)).toBe('1948-1964 CE');
  });
  it('carries every selected date source, locator and consultation scope into print', () => {
    const sources = posterSources(c);
    expect(sources.map((source) => source.id)).toEqual(
      expect.arrayContaining([
        'factory-act-1833-primary',
        'factory-inspection-1836',
        'factory-hansard-1836',
        'tomioka-arafune-2020',
        'tomioka-factory-act-archives',
      ]),
    );
    const html = renderToStaticMarkup(createElement(PosterNotes, { c, footer: null }));
    for (const entry of posterEntries(c)) {
      for (const citation of posterCitations(entry.subject, entry.context)) {
        const source = sources.find((s) => s.id === citation.source)!;
        expect(source.uses.find((use) => use.key === entry.key)!.locators).toContain(
          citation.locator,
        );
      }
    }
    for (const source of sources) {
      expect(source.scope).toBe(c.sources.find((s) => s.id === source.id)!.scope);
      expect(html).toContain(source.url.replaceAll('&', '&amp;'));
    }
    expect(html).toContain('The case:');
  });
});
