/** Persistent evidence boundaries for the three cities; batch-wide preservation is receipted separately. */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import { validateCorpus } from './validate';
import { familyMedia } from './family-media';
import { chapterComparisonDimensions, chapterSourceRows } from './chapter-sources';
import reviewedLabels from './reviewed-interval-labels.json';
import baseline from './cities-baseline.json';
import contract from './cities-contract.json';

const intervalLabels: Readonly<Record<string, string>> = reviewedLabels;
const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const subject = (id: string) => c.subjects.find((row) => row.id === id)!;
const media = (id: string) => c.media.find((row) => row.id === id)!;
const source = (id: string) => c.sources.find((row) => row.id === id)!;
const context = (id: string) => c.contexts!.find((row) => row.id === id)!;
describe('Households, books and city work: preservation and evidence boundaries', () => {
  it('requires a real finalized baseline contract and preserves original intervals with the reviewed label spacing corrections', () => {
    expect(baseline.baseCommit).toMatch(/^[0-9a-f]{40}$/);
    expect(contract.finalized).toBe(true);
    expect(validateCorpus(c)).toEqual([]);
    expect(c.subjects.map((s) => s.id)).toEqual(baseline.intervals.map((s) => s.id));
    for (const old of baseline.intervals) {
      const expected = {
        ...old.interval,
        label: intervalLabels[old.id] ?? old.interval.label,
      };
      expect(subject(old.id).interval).toEqual(expected);
    }
    for (const old of baseline.subjects) {
      const current = subject(old.id);
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
        'objectIds',
        'terms',
      ] as const)
        expect(current[key], `${old.id}/${key}`).toEqual(old[key]);
      for (const [key, value] of Object.entries(old.dimensions))
        expect(current.dimensions[key]).toEqual(value);
      expect(current.dimensions['place-work']!.citations.length).toBeGreaterThan(0);
      expect(current.evidenceReading!.items).toHaveLength(3);
      expect(current.review!.reviewer).toMatch(/not independent/i);
    }
    expect(c.relations).toEqual(baseline.relations);
  });

  it('checks selected media, the reviewed Zand wording and all 221 image files', () => {
    expect(baseline.media).toHaveLength(104);
    const changed = contract.mediaChanges['met-681122'];
    expect(Object.keys(changed).length).toBeGreaterThan(0);
    expect(
      Object.keys(changed).every((key) =>
        ['alt', 'caption', 'printCaption', 'additionalImageAlts'].includes(key),
      ),
    ).toBe(true);
    const selectedObjects = new Set(baseline.subjects.flatMap((row) => row.objectIds));
    for (const old of baseline.media.filter((row) => selectedObjects.has(row.id))) {
      expect(media(old.id)).toEqual(
        old.id === 'met-681122' ? { ...old, ...changed } : old,
      );
    }
    expect(baseline.imageBytes).toHaveLength(221);
    // The rights audit replaced the two Partition reproductions with source-reference cards.
    const referenceCardHashes: Record<string, string> = {
      '/atlas/media/partition-punjab-map-thumb.webp':
        '844b08242470da485e875c1b23101b29de2e4617864bb837285a76f89940bc76',
      '/atlas/media/partition-punjab-map.webp':
        'fea034707ac71d206ae46e7625f204953806dbe5f5df7d25b2ad1f3809722e03',
      '/atlas/media/partition-telegram-thumb.webp':
        '36f7691a2bc2fb9af3eea44ac24e39b26e88da4834c231cfcedf9bddf2532ecd',
      '/atlas/media/partition-telegram.webp':
        '56b5edca027899bc8e59868662d32a9e466077733175d18ae68a96673bf332da',
    };
    for (const image of baseline.imageBytes)
      expect(
        createHash('sha256')
          .update(readFileSync(`public${image.path}`))
          .digest('hex'),
        image.path,
      ).toBe(referenceCardHashes[image.path] ?? image.sha256);
    expect(media('met-451028').date).toEqual(
      baseline.media.find((m) => m.id === 'met-451028')!.date,
    );
    expect([media('met-451028').date.start, media('met-451028').date.end]).toEqual([
      1601, 1700,
    ]);
    expect([media('met-452671').date.start, media('met-452671').date.end]).toEqual([
      1525, 1535,
    ]);
    expect(media('met-681122').date).toEqual(
      baseline.media.find((m) => m.id === 'met-681122')!.date,
    );
    expect(media('met-681122').date.precision).toBe('range');
  });

  it('keeps exact earlier source scopes and separates later records from case and object dates', () => {
    expect(contract.newSourceIDs).toHaveLength(10);
    expect(contract.renewedSourceIDs).toHaveLength(9);
    for (const old of baseline.sources) {
      const current = source(old.id);
      const { scope: oldScope, accessed: oldAccessed, ...identity } = old;
      const { scope, accessed, ...currentIdentity } = current;
      expect(currentIdentity).toEqual(identity);
      if (contract.renewedSourceIDs.includes(old.id)) {
        expect(accessed).toBe('2026-10-29');
        expect(
          scope.startsWith(
            `Prior consultation, ${oldAccessed} (retained): ${oldScope} `,
          ),
        ).toBe(true);
      } else expect(current).toEqual(old);
    }
    for (const [id, start, end] of [
      ['isfahan-julfa-households-context', 1604, 1747],
      ['bukhara-learning-water-work-context', 1500, 1700],
      ['zand-political-context', 1747, 1794],
    ] as const) {
      const row = context(id);
      expect([row.interval.start, row.interval.end]).toEqual([start, end]);
      expect(
        row.phases.every(
          (phase) =>
            phase.year >= start && phase.year <= end && phase.citations.length > 0,
        ),
      ).toBe(true);
    }
    expect(context('isfahan-julfa-households-context').interval.note).toMatch(
      /1747.*later.*case/i,
    );
    expect(subject('isfahan-silk').interval.end).toBe(1722);
    expect(subject('bukhara-books').interval.end).toBe(1785);
    expect(subject('zand-iran').interval.start).toBe(1751);
  });

  it('distinguishes the selected book from classrooms and specifically located labor evidence', () => {
    const s = subject('bukhara-books');
    expect(s.sections.map((section) => section.text).join(' ')).toMatch(
      /likely.*Herat.*probably.*Bukhara/is,
    );
    const repair = s.evidenceReading!.items.find((item) =>
      item.citations.some((ref) => ref.source === 'bukhara-monuments'),
    )!;
    expect(repair.text).toMatch(/1417.*1585/);
    expect(repair.interpretation).toMatch(/restoration.*does not date/is);
    const labor = s.deeperReading!.find((section) => /Vakhsh/.test(section.text))!;
    expect(labor.text).toMatch(/another location.*not.*Bukhara/is);
    expect(s.familyActivity!.steps.join(' ')).toMatch(
      /Seen in the image.*Learned from a source/,
    );
  });

  it('keeps catalogue-described Zand imagery distinct from the actually supplied views', () => {
    const s = subject('zand-iran');
    const text = s.sections.map((section) => section.text).join(' ');
    expect(text).toMatch(/1789.*after Karim Khan/is);
    expect(text).toMatch(/gathering.*absent from.*supplied views/is);
    expect(media('met-681122').alt).not.toMatch(/courtly gathering/i);
    expect(s.familyActivity!.explanation).toMatch(
      /catalogue.*gathering.*do not show/is,
    );
  });

  it('limits the new geography to two published property references with no river, route or household geometry', () => {
    const study = subject('isfahan-silk').placeStudy!;
    expect(study.points.map(({ id, coordinates }) => [id, coordinates])).toEqual(
      Object.entries(contract.isfahanPoints),
    );
    expect(study.features).toEqual([]);
    expect(study.background).toBeUndefined();
    expect(study.points[0]!.text).toMatch(/not a workshop/i);
    expect(study.points[1]!.text).toMatch(/not.*extent.*quarter/is);
    expect(study.points[1]!.text).toMatch(/not.*inscribed World Heritage/is);
    expect(subject('isfahan-silk').review!.scope).toMatch(
      /two modern published property references/i,
    );
    expect(subject('isfahan-silk').review!.limitations.join(' ')).not.toMatch(
      /No measured plan, new geographic point/i,
    );
    for (const p of study.points)
      for (const citation of p.citations) expect(source(citation.source)).toBeDefined();
    expect(subject('bukhara-books').placeStudy).toBeUndefined();
    expect(subject('zand-iran').placeStudy).toBeUndefined();
  });

  it('carries the complete inquiry evidence into source sheets and an answerable family source capsule', () => {
    const journey = c.journeys.find((row) => row.id === 'households-books-city-work')!;
    expect(
      journey.stops.map(({ subject, object, year }) => [subject, object, year]),
    ).toEqual([
      ['bukhara-books', 'met-452671', 1530],
      ['isfahan-silk', 'met-451028', 1700],
      ['zand-iran', 'met-681122', 1789],
    ]);
    expect(familyMedia(c, journey)?.id).toBe('met-452671');
    const pair = [subject('isfahan-silk'), subject('bukhara-books')];
    expect(chapterComparisonDimensions(pair)[0]).toBe('place-work');
    const rows = chapterSourceRows(c, journey, pair);
    const refs = [
      ...journey.evidence.citations,
      ...journey.familyEvidence!.citations,
      ...journey.stops.flatMap((stop) =>
        subject(stop.subject).sections.flatMap((section) => section.citations),
      ),
    ];
    for (const ref of refs)
      expect(rows.find((row) => row.source.id === ref.source)!.locators).toContain(
        ref.locator,
      );
    expect(journey.familyEvidence!.text).toMatch(
      /likely copying.*later illustration.*probably/is,
    );
    expect(journey.familyEvidence!.feedback).toMatch(
      /catalogue research.*does not identify every maker or household/is,
    );
    expect(journey.evidence.options.some((option) => option.supported)).toBe(true);
    expect(journey.evidence.options.some((option) => !option.supported)).toBe(true);
  });
});
