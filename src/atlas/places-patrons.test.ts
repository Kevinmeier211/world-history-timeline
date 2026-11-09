import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import originals from './places-patrons-baseline.json';
import { chapterComparisonDimensions, chapterSourceRows } from './chapter-sources';
import { dimensionLabels } from './comparisons';
import { familyMedia } from './family-media';
import { validateCorpus } from './validate';

const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const subject = (id: string) => c.subjects.find((s) => s.id === id)!;
const media = (id: string) => c.media.find((m) => m.id === id)!;
const source = (id: string) => c.sources.find((s) => s.id === id)!;
const journey = () => c.journeys.find((j) => j.id === 'places-patrons-work')!;
const evidenceFrom = (id: string, sourceId: string) =>
  subject(id).evidenceReading!.items.find((item) =>
    item.citations.some((ref) => ref.source === sourceId),
  )!;

// Fixture extracted from the pre-C5 case-baseline.json at sealed 32330d981c26841e152117679836d1ee36162952,
// independently of the new authoring modules and compiled context intervals.
describe('Places, patrons and practical work: evidence boundaries', () => {
  it('validates the canonical corpus and preserves complete original cases and comparison meanings', () => {
    expect(validateCorpus(c)).toEqual([]);
    for (const original of originals) {
      const s = subject(original.id);
      for (const key of [
        'id',
        'name',
        'kind',
        'region',
        'place',
        'aliases',
        'coordinates',
        'geographicPrecision',
        'interval',
        'packs',
        'claims',
        'question',
        'returnPrompt',
        'status',
      ] as const)
        expect(s[key], `${s.id}: ${key}`).toEqual(original[key]);
      expect(s.objectIds.slice(0, original.objectIds.length)).toEqual(
        original.objectIds,
      );
      expect(new Set(s.objectIds).size).toBe(s.objectIds.length);
      for (const [key, dimension] of Object.entries(original.dimensions))
        expect(s.dimensions[key], `${s.id}: earlier ${key}`).toEqual(dimension);
      expect(s.dimensionKeys).toContain('place-work');
      expect(s.evidenceReading!.items).toHaveLength(3);
      expect(s.review!.reviewer).toMatch(/not independent/i);
    }
  });

  it('keeps source-qualified contexts apart from full cases, object envelopes and modern image creation', () => {
    for (const [id, contextId, start, end] of [
      ['byzantium', 'constantinople-material-work-context', 843, 1204],
      ['borobudur', 'central-java-religious-landscapes', 700, 1000],
      ['maya-vessel', 'maya-courts-households-context', 250, 900],
    ] as const) {
      const ctx = c.contexts!.find((row) => row.id === contextId)!;
      expect(subject(id).contextIds).toContain(contextId);
      expect([ctx.interval.start, ctx.interval.end]).toEqual([start, end]);
      expect(ctx.interval).not.toEqual(subject(id).interval);
      for (const phase of ctx.phases) {
        expect(phase.citations.length).toBeGreaterThan(0);
        for (const ref of phase.citations) expect(source(ref.source)).toBeDefined();
      }
    }
    expect([media('met-464428').date.start, media('met-464428').date.end]).toEqual([
      925, 975,
    ]);
    expect([media('met-316711').date.start, media('met-316711').date.end]).toEqual([
      600, 800,
    ]);
    // These are object envelopes; the underlying cameras' dates remain unknown.
    for (const id of ['met-464428', 'met-316711'])
      expect(source(id).scope).toMatch(/photograph(?:y)?.*date/i);
    expect(media('borobudur-schematic-plan').date.start).toBe(2007);
    expect(media('borobudur-conserved-monument').date.start).toBe(2008);
    expect(media('borobudur-conserved-monument').date.note).toMatch(/12 June 2008/);
    expect(media('borobudur-conserved-monument').date.note).toMatch(/7 June 2008/);
    expect(media('borobudur-conserved-monument').datingNote).toMatch(
      /disagree.*northwest\/northeast/i,
    );
  });

  it('distinguishes YK14 wood, construction, repairs and deposition without inventing ivory cargo', () => {
    const item = evidenceFrom('byzantium', 'byzantium-yenikapi-2015');
    expect(item.text).toMatch(/planks.*caulking.*repairs/i);
    expect(item.text).toMatch(/construction.*differs.*pottery/i);
    expect(item.interpretation).toMatch(/wood age.*construction.*repair.*deposition/i);
    expect(item.interpretation).toMatch(/no recovered cargo.*ivory/i);
    const report = source('byzantium-yenikapi-2015');
    expect(report.scope).toMatch(
      /first.half.ninth.century.*construction|construction.*first.half.ninth.century/i,
    );
    expect(report.scope).toMatch(/late.ninth\/early.tenth/i);
    expect(report.scope).toMatch(/likely associated/i);
    expect(report.scope).toMatch(/not the entire 35.page/i);
    const reading = evidenceFrom('byzantium', 'byzantium-hades-reading-1974');
    expect(reading.text).toMatch(/Hades and Adam/);
    expect(reading.interpretation).toMatch(/attributed comparative argument/i);
    expect(reading.interpretation).toMatch(/different from a new direct translation/i);
  });

  it('retains Maya ownership uncertainty and separates Cerén evidence from the cup and modern notes', () => {
    const ownership = evidenceFrom('maya-vessel', 'met-316711');
    expect(ownership.text).toMatch(/name uncertain/i);
    expect(ownership.text).toMatch(/no polity/i);
    expect(ownership.text).toMatch(/possibly the owner/i);
    expect(ownership.interpretation).toMatch(/Baje\(\?\).*Kaan\/Chan/);
    const contents = evidenceFrom('maya-vessel', 'maya-drinking-cup-2014');
    expect(contents.interpretation).toMatch(/no residue assay/i);
    const households = evidenceFrom('maya-vessel', 'maya-ceren-households-2000');
    expect(households.interpretation).toMatch(/separately excavated village/i);
    expect(households.interpretation).toMatch(/without locating this cup there/i);
    expect(source('maya-ceren-households-2000').scope).toMatch(/abstract/i);
    expect(source('maya-ceren-plants-2020').scope).toMatch(/search.index text only/i);
    const cup = media('met-316711');
    expect(cup.image).toBe('/atlas/media/316711-0.webp');
    expect(cup.licenseUrl).toBe('https://creativecommons.org/publicdomain/zero/1.0/');
    expect(cup.annotations!.createdOn).toBe('2026-10-29');
    expect(cup.annotations!.licenseUrl).toBe(
      'https://creativecommons.org/licenses/by/4.0/',
    );
    expect(cup.annotations!.items).toHaveLength(3);
    expect(cup.annotations!.items.map((note) => note.text).join(' ')).toMatch(
      /no new pigment analysis/i,
    );
  });

  it('keeps the licensed Borobudur schematic separate from a measured plan, ancient paint or route', () => {
    const plan = media('borobudur-schematic-plan');
    expect(plan.depiction).toBe('explanatory diagram');
    expect([plan.width, plan.height]).toEqual([800, 800]);
    expect(plan.creator).toMatch(/Indon/);
    expect(plan.caption).toMatch(/no north arrow.*scale/i);
    expect(plan.caption).toMatch(/no underlying measured archaeological survey/i);
    expect(plan.caption).toMatch(/colours do not establish ancient paint/i);
    expect(plan.caption).toMatch(/does not prove.*ancient route/i);
    expect(plan.licenseUrl).toBe('https://creativecommons.org/licenses/by-sa/3.0/');
    expect(media('borobudur-conserved-monument').licenseUrl).toBe(plan.licenseUrl);
    expect(media('met-464428').annotations!.licenseUrl).not.toBe(plan.licenseUrl);
    expect(media('met-464428').annotations!.rights).toMatch(
      /underlying photograph.*separate/i,
    );
    const upkeep = evidenceFrom('borobudur', 'borobudur-inscription-context-2018');
    expect(upkeep.text).toMatch(/different Kayumwungan/i);
    expect(upkeep.interpretation).toMatch(/institutional interpretation/i);
    expect(upkeep.interpretation).toMatch(/does not establish a certain founder/i);
    expect(source('borobudur').scope).toMatch(/Prior consultation,.*retained/i);
  });

  it('maps only sourced component or comparison references without an inferred travel line', () => {
    const java = subject('borobudur').placeStudy!;
    expect(java.points).toHaveLength(3);
    expect(java.features).toEqual([]);
    for (const point of java.points)
      expect(
        point.citations.some((ref) => ref.source === 'borobudur-component-locations'),
      ).toBe(true);
    const ceren = subject('maya-vessel').placeStudy!;
    expect(ceren.points).toHaveLength(1);
    expect(ceren.points[0]!.coordinates).toEqual([-89.369, 13.828]);
    expect(ceren.points[0]!.citations.map((ref) => ref.source)).toContain(
      'maya-ceren-unesco',
    );
    expect(ceren.points[0]!.text).toMatch(/no Met.vessel findspot.*route/i);
    expect(ceren.features).toEqual([]);
    const selected = originals.map((s) => s.id);
    expect(
      c.relations.filter((r) => selected.includes(r.from) || selected.includes(r.to)),
    ).toEqual([]);
  });

  it('prints the authored work dimension and supplies an answerable observation/source-capsule inquiry', () => {
    const j = journey();
    expect(j.stops.map((stop) => stop.subject)).toEqual([
      'maya-vessel',
      'borobudur',
      'byzantium',
    ]);
    expect(j.introduction).toMatch(/do not establish contact.*travel route/i);
    for (const subjects of [
      ['byzantium', 'borobudur'],
      ['byzantium', 'maya-vessel'],
    ])
      expect(
        c.comparisons!.some(
          (pair) => JSON.stringify(pair.subjects) === JSON.stringify(subjects),
        ),
      ).toBe(true);
    const pair = ['byzantium', 'borobudur'].map(subject);
    expect(chapterComparisonDimensions(pair)[0]).toBe('place-work');
    expect(dimensionLabels['place-work']).toBe('People, work and places');
    const f = j.familyEvidence!;
    expect(familyMedia(c, j)?.id).toBe('borobudur-schematic-plan');
    expect(f.object).toBe(j.leadObject);
    expect(f.text).toMatch(/square.*circular/i);
    expect(f.text).toMatch(/no north arrow.*scale.*colour legend/i);
    expect(f.claimPrompt).toMatch(/visible relationship.*another source/i);
    const supported = j.evidence.options.filter((option) => option.supported);
    expect(supported).toHaveLength(1);
    expect(supported[0]!.text).toMatch(
      /square and circular.*route needs further.*evidence/i,
    );
    const rows = chapterSourceRows(c, j, pair);
    for (const ref of f.citations)
      expect(rows.find((row) => row.source.id === ref.source)!.locators).toContain(
        ref.locator,
      );
    // An otherwise unrelated locator appearing only on the authored dimension
    // must reach the chapter bibliography, not disappear behind another key.
    const copy = structuredClone(c);
    const copiedPair = ['byzantium', 'borobudur'].map((id) =>
      copy.subjects.find((s) => s.id === id)!,
    );
    copiedPair[0]!.dimensions['place-work']!.citations = [
      { source: 'caral-project-2005', locator: 'Dimension-only source fixture' },
    ];
    expect(
      chapterSourceRows(copy, j, copiedPair).find(
        (row) => row.source.id === 'caral-project-2005',
      )!.locators,
    ).toContain('Dimension-only source fixture');
  });
});
