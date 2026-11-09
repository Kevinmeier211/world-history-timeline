import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, Media } from './model';
import originals from './images-work-baseline.json';
import { chapterSourceRows } from './chapter-sources';
import { validateCorpus } from './validate';

const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const subject = (id: string) => c.subjects.find((s) => s.id === id)!;
const media = (id: string) => c.media.find((m) => m.id === id)!;
const source = (id: string) => c.sources.find((s) => s.id === id)!;
const main = (id: string) =>
  subject(id)
    .sections.map((s) => s.text)
    .join(' ');

describe('Images, spaces and work: source and identity boundaries', () => {
  it('preserves complete cases, claims, anchors, old comparison meanings and old object order', () => {
    for (const original of originals) {
      const s = subject(original.id);
      for (const key of [
        'name',
        'interval',
        'coordinates',
        'geographicPrecision',
        'aliases',
        'packs',
        'claims',
        'question',
        'returnPrompt',
      ] as const)
        expect(s[key], `${s.id}: ${key}`).toEqual(original[key]);
      expect(s.objectIds.slice(0, original.objectIds.length)).toEqual(
        original.objectIds,
      );
      for (const [key, dimension] of Object.entries(original.dimensions))
        expect(s.dimensions[key]).toEqual(dimension);
      expect(s.dimensionKeys).toContain('material-work');
    }
  });

  it('keeps selected contexts distinct from the object and full case chronologies', () => {
    for (const [id, contextId, start, end] of [
      ['chavin-textile', 'chavin-images-context', -1500, -200],
      ['teotihuacan', 'teotihuacan-neighborhood-context', -100, 650],
      ['moche', 'moche-valleys-work-context', 100, 850],
    ] as const) {
      const ctx = c.contexts!.find((context) => context.id === contextId)!;
      expect(subject(id).contextIds).toContain(contextId);
      expect([ctx.interval.start, ctx.interval.end]).toEqual([start, end]);
      expect(ctx.interval).not.toEqual(subject(id).interval);
      for (const phase of ctx.phases) {
        expect(phase.citations.length).toBeGreaterThan(0);
        for (const ref of phase.citations) expect(source(ref.source)).toBeDefined();
      }
    }
    expect(media('met-315784').date.start).toBe(-400);
    expect(media('met-315784').date.end).toBe(-200);
    expect(media('met-312736').date.label).toMatch(/3rd–7th/);
    expect(media('met-316721').date.label).toMatch(/2nd–5th/);
    expect(subject('chavin-textile').placeStudy!.points).toHaveLength(1);
    expect(subject('chavin-textile').placeStudy!.description).toMatch(
      /not an excavated textile findspot/,
    );
  });

  it('makes Teotihuacan household work concrete while retaining the tested function and sample limits', () => {
    expect(main('teotihuacan')).toMatch(/cores and byproducts/);
    expect(main('teotihuacan')).toMatch(/drains.*Street of the Dead/);
    expect(main('teotihuacan')).toMatch(/interprets.*apprenticeship/);
    expect(main('teotihuacan')).toMatch(/earlier structures were covered with fill/);
    const deeper = subject('teotihuacan')
      .deeperReading!.map((s) => s.text)
      .join(' ');
    expect(deeper).toMatch(/not statistically significant/);
    expect(deeper).toMatch(/not the city in miniature/);
    expect(source('teot-obsidian-2019-abstract').scope).toMatch(
      /Abstract-level use only/,
    );
    expect(subject('teotihuacan').evidenceReading!.items[0]!.interpretation).toMatch(
      /Only this abstract was consulted/,
    );
  });

  it('keeps Moche regional coordination, production and object provenance at their evidential scopes', () => {
    expect(main('moche')).toMatch(
      /southern Moche and Chicama.*northern Piura, Lambayeque and Jequetepeque/,
    );
    expect(main('moche')).toMatch(/partially excavated fineware workshop/);
    expect(main('moche')).toMatch(/surface remains and had not been excavated/);
    expect(main('moche')).toMatch(/need not equal one nuclear family/);
    expect(main('moche')).toMatch(/neither catalogue supplies an excavated findspot/);
    expect(
      subject('moche')
        .deeperReading!.map((s) => s.text)
        .join(' '),
    ).toMatch(/independence.*not conclusively established/);
    expect(source('moche-moro-2023').scope).toMatch(/650–740.*650–850/);
  });

  it('retains the focused textile inquiry and separates photographed observation from catalogue interpretation', () => {
    expect(main('chavin-textile')).toMatch(/woven surface|crossing threads/i);
    expect(main('chavin-textile')).toMatch(/missing cloth should remain blank/);
    expect(
      subject('chavin-textile')
        .deeperReading!.map((s) => s.text)
        .join(' '),
    ).toMatch(
      /need a published measurement linked to its museum number, 1987\.394\.704/,
    );
    expect(source('chavin-weaving-abstraction').author).toBe(
      'Iria Candela and Joanne Pillsbury',
    );
    expect(source('chavin-weaving-abstraction').scope).toMatch(
      /Embracing the Grid.*Infinite Pattern/,
    );
    const m = media('met-315784');
    expect([m.image, m.width, m.height, m.accession]).toEqual([
      '/atlas/media/315784-0.webp',
      1600,
      832,
      '1987.394.704',
    ]);
    expect(m.rights).toMatch(/Public domain.*CC0/);
    expect(m.annotations!.items.map((note) => note.id)).toEqual([
      'crossing-threads',
      'painted-form',
      'turning-boundary',
      'fragmentary-edge',
    ]);
    expect(m.annotations!.createdOn).toBe('2026-10-29');
    expect(m.annotations!.rights).toMatch(/Modern annotations.*underlying photograph/);
  });

  it('keeps original guides and the licensed composite map materially different', () => {
    for (const id of ['teotihuacan-household-guide', 'moche-evidence-guide']) {
      const m = media(id);
      expect(m.depiction).toBe('explanatory diagram');
      expect([m.date.start, m.date.end, m.width, m.height]).toEqual([
        2026, 2026, 600, 360,
      ]);
      expect(m.licenseUrl).toBe('https://creativecommons.org/licenses/by/4.0/');
      expect(m.caption).toMatch(/not|without|neither/);
    }
    const map = media('teotihuacan-tlajinga-map');
    expect(map.date.start).toBeNull();
    expect(map.date.precision).toBe('unknown');
    expect(map.date.label).toMatch(/2026.*unstated/);
    expect([map.width, map.height]).toEqual([1650, 2345]);
    expect(map.licenseUrl).toBe('https://creativecommons.org/licenses/by-nc/4.0/');
    expect(map.rights).toMatch(/Commercial use requires permission/);
    expect(map.caption).toMatch(
      /composite locator map, not a single-phase household plan/,
    );
    expect(map.alt).toMatch(/east.*west/);
    expect(source('teot-tlajinga-2026').scope).toMatch(/Figure 1 is reused locally/);
    expect(source('teot-tlajinga-2026').scope).not.toMatch(
      /No artwork or plan reproduced/,
    );
  });

  it('makes the thematic family task answerable and includes annotation-only sources in chapter references', () => {
    const copy = structuredClone(c);
    const j = copy.journeys.find((j) => j.id === 'images-spaces-work')!;
    expect(j.stops.map((stop) => stop.subject)).toEqual([
      'chavin-textile',
      'teotihuacan',
      'moche',
    ]);
    expect(j.introduction).toMatch(/does not establish contact/);
    expect(j.leadObject).toBe('met-315784');
    expect(j.familyEvidence!.object).toBe(j.leadObject);
    expect(j.familyEvidence!.text).toMatch(
      /Crossing threads, red forms and incomplete edges are visible/,
    );
    expect(j.familyEvidence!.claimPrompt).toMatch(/show in the photograph/);
    expect(j.evidence.options.filter((option) => option.supported)).toHaveLength(1);
    const special = copy.sources.find(
      (s) => !j.evidence.citations.some((r) => r.source === s.id),
    )!;
    copy.media.find((m) => m.id === 'met-315784')!.annotations!.items[0]!.citations = [
      { source: special.id, locator: 'Annotation-only fixture locator' },
    ];
    expect(
      chapterSourceRows(copy, j, []).find((row) => row.source.id === special.id)!
        .locators,
    ).toContain('Annotation-only fixture locator');
  });

  it('rejects invalid dates, sparse note arrays and unresolved annotation references in the full corpus', () => {
    for (const mutate of [
      (m: Media) => {
        m.annotations!.createdOn = '2026-02-30';
      },
      (m: Media) => {
        m.annotations!.items = new Array(1);
      },
      (m: Media) => {
        m.annotations!.items[0]!.citations = new Array(1);
      },
      (m: Media) => {
        m.annotations!.items[0]!.citations[0]!.source = 'unresolved-annotation-source';
      },
    ]) {
      const copy = structuredClone(c);
      mutate(copy.media.find((m) => m.id === 'met-315784')!);
      expect(
        validateCorpus(copy).some((message) => message.includes('met-315784')),
      ).toBe(true);
    }
  });
});
