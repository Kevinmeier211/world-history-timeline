import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import { validateCorpus } from './validate';

const c = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8')) as Corpus;
const subject = (id: string) => c.subjects.find((row) => row.id === id)!;
const source = (id: string) => c.sources.find((row) => row.id === id)!;
const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

describe('Plains and community authority: work, gardens and witnesses', () => {
  it('keeps the three case intervals and adds separate reference frames', () => {
    expect(validateCorpus(c)).toEqual([]);
    expect(subject('blackfoot-bison').interval).toMatchObject({
      start: 1700,
      end: 1850,
    });
    expect(subject('hidatsa-villages').interval).toMatchObject({
      start: 1600,
      end: 1845,
    });
    expect(subject('kwakwakawakw-potlatch').interval).toMatchObject({
      start: 1884,
      end: 1980,
    });
    expect(
      c.contexts!.find((row) => row.id === 'blackfoot-work-interpretation-context')!
        .interval,
    ).toMatchObject({ start: 1700, end: 2008 });
    expect(
      c.contexts!.find((row) => row.id === 'hidatsa-gardens-relocation-context'),
    ).toBeTruthy();
    const kwak = c.contexts!.find(
      (row) => row.id === 'kwakwakawakw-witnesses-return-context',
    )!;
    expect(kwak.interval.end).toBeGreaterThan(1980);
    expect(kwak.interval.note).toMatch(/1884–1980 case remains unchanged/);
  });

  it('explains preparation and processing without turning the photograph into a hunt', () => {
    const s = subject('blackfoot-bison');
    const text = [s.summary, ...s.sections.map((row) => row.text)].join(' ');
    expect(words(text)).toBeGreaterThan(350);
    expect(text).toMatch(/drive lanes/i);
    expect(text).toMatch(/drying/);
    expect(text).toMatch(/Hide preparation/);
    expect(s.deeperReading!.map((row) => row.text).join(' ')).toMatch(
      /Hazel Big Smoke/,
    );
    expect(s.deeperReading!.map((row) => row.text).join(' ')).toMatch(/cattle bones/);
    expect(s.objectIds).toEqual(['hsi-cliff-2005']);
    expect(source('blackfoot-collaborative-hunt').accessed).toBe('2026-10-29');
    expect(source('hsi-brink').accessed).not.toBe('2026-10-29');
    expect(s.familyActivity!.steps.join(' ')).toMatch(/Do not stage a hunt/);
  });

  it('keeps Hidatsa gardens, a later woman’s account and displacement on different clocks', () => {
    const s = subject('hidatsa-villages');
    const text = [
      s.summary,
      ...s.sections.map((row) => row.text),
      ...s.deeperReading!.map((row) => row.text),
    ].join(' ');
    expect(text).toMatch(/Maxi/);
    expect(text).toMatch(/Goodbird/);
    expect(text).toMatch(/1917/);
    expect(text).toMatch(/1845/);
    expect(text).toMatch(/Like-a-Fishhook|Like a Fishhook/);
    expect(s.interval.end).toBe(1845);
    expect(c.media.find((row) => row.id === 'knife-earthlodge')!.depiction).toBe(
      'later depiction',
    );
    expect(c.media.find((row) => row.id === 'knife-garden-tools')!.date.precision).toBe(
      'unknown',
    );
  });

  it('names particular Kwakwaka’wakw witnesses and keeps 1980 as the case endpoint', () => {
    const s = subject('kwakwakawakw-potlatch');
    expect(s.sections[1]!.text).toContain('1 January 1885');
    expect(s.sections[1]!.citations.map((row) => row.source)).toContain('umista-ban');
    const text = [
      s.summary,
      ...s.sections.map((row) => row.text),
      ...s.deeperReading!.map((row) => row.text),
    ].join(' ');
    expect(text).toMatch(/Vera Newman/);
    expect(text).toMatch(/Bill Cranmer/);
    expect(text).toMatch(/Florence/);
    expect(text).toMatch(/2003/);
    expect(text).toMatch(/not establish every missing link|do not establish every/);
    expect(s.interval.end).toBe(1980);
    expect(source('umista-return-voices').type).toBeTruthy();
    expect(c.relations).toHaveLength(2);
  });
});
