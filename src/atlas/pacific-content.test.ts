/** Persistent Pacific evidence boundaries; batch-wide mutation is checked in its receipt. */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import { validateCorpus } from './validate';
import { familyMedia } from './family-media';
import { chapterComparisonDimensions, chapterSourceRows } from './chapter-sources';
import reviewedLabels from './reviewed-interval-labels.json';
import baseline from './pacific-baseline.json';
import contract from './pacific-contract.json';

const intervalLabels: Readonly<Record<string, string>> = reviewedLabels;
const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const subject = (id: string) => c.subjects.find((row) => row.id === id)!;
const media = (id: string) => c.media.find((row) => row.id === id)!;
const source = (id: string) => c.sources.find((row) => row.id === id)!;
const context = (id: string) => c.contexts!.find((row) => row.id === id)!;
const journey = () => c.journeys.find((row) => row.id === 'goods-work-coercion')!;
const reading = (id: string) => {
  const s = subject(id);
  return [
    s.summary,
    ...s.sections.map((row) => row.text),
    ...(s.deeperReading ?? []).map((row) => row.text),
    ...(s.evidenceReading?.items ?? []).flatMap((row) => [
      row.text,
      row.interpretation,
    ]),
    s.familyActivity?.explanation ?? '',
  ].join('\n');
};

describe('Goods, work and coercion: particular records and distinct dates', () => {
  it('preserves all 77 case intervals with the reviewed label spacing corrections', () => {
    expect(baseline.baseCommit).toMatch(/^[0-9a-f]{40}$/);
    expect(contract.finalized).toBe(true);
    expect(validateCorpus(c)).toEqual([]);
    expect(c.subjects.map((row) => row.id)).toEqual(
      baseline.intervals.map((row) => row.id),
    );
    for (const old of baseline.intervals) {
      const expected = {
        ...old.interval,
        label: intervalLabels[old.id] ?? old.interval.label,
      };
      expect(subject(old.id).interval).toEqual(expected);
    }
    for (const old of baseline.subjects) {
      const row = subject(old.id);
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
        expect(row[key], `${old.id}/${key}`).toEqual(old[key]);
      for (const [key, value] of Object.entries(old.dimensions))
        expect(row.dimensions[key]).toEqual(value);
      expect(row.dimensions['work-organization']!.citations.length).toBeGreaterThan(0);
      expect(row.evidenceReading!.items).toHaveLength(3);
      expect(row.review!.reviewer).toMatch(/not independent/i);
    }
    expect(subject('manila-network').interval.start).toBe(1565);
    expect(subject('manila-network').interval.end).toBe(1815);
    expect(subject('banda-1621').interval.start).toBe(1621);
    expect(subject('banda-1621').interval.end).toBe(1621);
  });

  it('retains the selected Mexican jar identity/date/rights with only the three approved reading fields', () => {
    const old = baseline.media.find((row) => row.id === 'met-9198')!;
    const changes = contract.mediaChanges['met-9198'];
    expect(Object.keys(changes).sort()).toEqual(['caption', 'notice', 'relevance']);
    expect(media('met-9198')).toEqual({ ...old, ...changes });
    expect(media('met-9198').title).toMatch(/\bjar\b/i);
    expect(media('met-9198').title).not.toMatch(/\bplate\b/i);
    expect(media('met-9198').accession).toBe('11.87.36');
    expect(media('met-9198').date.start).toBe(1680);
    expect(media('met-9198').date.end).toBe(1700);
    expect(media('met-9198').caption).toMatch(/not identified.*1595.*1726/is);
    expect(media('met-9198').notice.join(' ')).not.toContain(
      'the Chinese porcelain jar',
    );
    expect(subject('banda-1621').objectIds).toEqual([]);
  });

  it('keeps 1595 archaeology, 1618/1619 official reports and 1726 registration separate from object identity', () => {
    const text = reading('manila-network');
    for (const date of ['1595', '1618', '1619', '1680', '1726'])
      expect(text).toContain(date);
    expect(text).toMatch(/smaller private ships|smaller.*regional/is);
    expect(text).toMatch(/stated wage|wages.*not.*paid/is);
    expect(text).toMatch(/not.*workers[’'] own|without supplying the workers/is);
    expect(text).toMatch(
      /not.*delivery|not.*successful delivery|registration.*does not/is,
    );
    expect(source('manila-santo-cristo-2022').scope).toMatch(
      /not.*original manuscript|not.*arrival receipt/is,
    );
    expect(source('manila-santo-cristo-2022').scope).toMatch(
      /no page pixels|no.*pixels inspected/is,
    );
    expect(source('manila-shipbuilding-1618-1619').scope).toMatch(
      /smaller.*not every galleon/is,
    );
    const ref = context('manila-ships-people-context');
    expect([ref.interval.start, ref.interval.end]).toEqual([1565, 1726]);
    expect(ref.phases.map((phase) => phase.year)).toEqual([
      1565, 1595, 1618, 1619, 1680, 1726,
    ]);
  });

  it('treats attributed living Banda voices and restricted knowledge as different evidence', () => {
    const text = reading('banda-1621');
    expect(text).toMatch(/cultivation|processing/);
    expect(text).toContain('2021');
    expect(text).toMatch(/not a 1621 eyewitness|not an eyewitness account of 1621/is);
    expect(text).toMatch(
      /not every community|not.*every Bandanese|not universal community/is,
    );
    expect(text).toMatch(/does not reproduce|not reproduced|must not be documented/is);
    expect(source('banda-language-tana-2019').scope).toMatch(
      /not copied, transcribed|not.*performed/is,
    );
    expect(source('banda-wandan-statement-2021').scope).toMatch(
      /no reuse licence|no.*licence established/is,
    );
    expect(source('banda-wandan-statement-2021').scope).toMatch(
      /no page pixels|no.*pixels/is,
    );
    expect(
      context('banda-food-displacement-context').phases.every(
        (phase) => phase.year <= 1630,
      ),
    ).toBe(true);
  });

  it('uses exactly three published modern island references without adding historical movement geometry', () => {
    const study = subject('banda-1621').placeStudy!;
    expect(study.points.map((point) => point.id)).toEqual([
      'banda-besar-reference',
      'banda-neira-reference',
      'banda-rhun-reference',
    ]);
    expect(
      Object.fromEntries(study.points.map((point) => [point.id, point.coordinates])),
    ).toEqual(contract.bandaPoints);
    expect(study.features).toEqual([]);
    expect(study.background).toBeUndefined();
    expect(study.description).toMatch(/modern|2021/i);
    expect(study.description).toMatch(/not.*1621|No coast/is);
    for (const point of study.points)
      expect(point.citations.some((ref) => ref.source === 'banda-gazetteer-2021')).toBe(
        true,
      );
    expect(source('banda-gazetteer-2021').scope).toMatch(/three.*rows only/is);
    expect(source('banda-gazetteer-2021').scope).toMatch(/no.*table pixels/is);
    expect(subject('manila-network').placeStudy).toEqual(
      (
        baseline.subjects.find(
          (row) => row.id === 'manila-network',
        ) as unknown as Corpus['subjects'][number]
      ).placeStudy,
    );
  });

  it('authors one true two-dossier comparison and resolves its supplied family object at the second stop', () => {
    const j = journey();
    expect(j.stops.map(({ subject, object, year }) => [subject, object, year])).toEqual(
      [
        ['banda-1621', undefined, 1621],
        ['manila-network', 'met-9198', 1726],
      ],
    );
    expect(
      c.comparisons!.filter(
        (pair) =>
          pair.subjects.includes('banda-1621') &&
          pair.subjects.includes('manila-network'),
      ),
    ).toHaveLength(1);
    expect(j.introduction).toMatch(/not a shared route.*causal sequence/is);
    expect(j.familyEvidence!.object).toBe('met-9198');
    expect(j.familyEvidence!.text).toMatch(
      /does not identify this jar|not identified/is,
    );
    expect(j.familyEvidence!.text).toContain('1726');
    expect(j.familyEvidence!.text).toContain('1680');
    expect(j.evidence.options.some((option) => option.supported)).toBe(true);
    expect(j.evidence.options.some((option) => !option.supported)).toBe(true);
    // Use the actual helper contract after adoption; the object may belong to a later stop.
    expect(familyMedia(c, j)?.id).toBe('met-9198');
    const pair = [subject('banda-1621'), subject('manila-network')];
    expect(chapterComparisonDimensions(pair)).toContain('work-organization');
    const refs = chapterSourceRows(c, j, pair);
    expect(refs.some((row) => row.source.id === 'manila-santo-cristo-2022')).toBe(true);
    expect(refs.some((row) => row.source.id === 'banda-archive')).toBe(true);
  });
});
