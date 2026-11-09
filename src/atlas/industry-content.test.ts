/** Future industry evidence boundaries; adopt only after the Pacific seal and reviewed media contract. */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import { validateCorpus } from './validate';
import { familyMedia } from './family-media';
import { chapterComparisonDimensions, chapterSourceRows } from './chapter-sources';
import reviewedLabels from './reviewed-interval-labels.json';
import baseline from './industry-baseline.json';
import contract from './industry-contract.json';

const intervalLabels: Readonly<Record<string, string>> = reviewedLabels;
const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const subject = (id: string) => c.subjects.find((row) => row.id === id)!;
const media = (id: string) => c.media.find((row) => row.id === id)!;
const source = (id: string) => c.sources.find((row) => row.id === id)!;
const reference = (id: string) => c.contexts!.find((row) => row.id === id)!;
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

describe('Skills, records and protection: different evidence, different dates', () => {
  it('preserves corrected case intervals and selected identities without freezing other reading bodies', () => {
    expect(contract.finalized).toBe(true);
    expect(baseline.baseCommit).toMatch(/^[0-9a-f]{40}$/);
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
      const s = subject(old.id);
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
        'question',
        'returnPrompt',
        'status',
        'terms',
      ] as const)
        expect(s[key], `${old.id}/${key}`).toEqual(old[key]);
      const expectedClaims = old.claims.map((claim) =>
        claim.id === 'factory-reform-checked'
          ? {
              ...claim,
              text: 'The archival investigation pairs the 1833 law with an 1836 inspector report to test enforcement.',
              citations: [
                {
                  source: 'factory-act',
                  locator: 'Teacher’s Notes, p. 3, and Source 1, pp. 8–9',
                },
              ],
              checkedOn: '2026-11-04',
            }
          : claim,
      );
      expect(s.claims).toEqual(expectedClaims);
      expect(s.objectIds).toEqual(
        old.id === 'tomioka'
          ? [...old.objectIds, 'tomioka-reeling-print']
          : old.objectIds,
      );
      for (const [key, value] of Object.entries(old.dimensions))
        expect(s.dimensions[key]).toEqual(value);
      expect(s.dimensions['work-organization']!.citations.length).toBeGreaterThan(0);
      expect(s.evidenceReading!.items).toHaveLength(3);
    }
    expect(subject('factory-reform').objectIds).toEqual([]);
    expect(subject('hine-labor').objectIds).toEqual(['loc-hine']);
  });

  it('keeps statutory categories and investigation distinct from completed enforcement', () => {
    const text = reading('factory-reform');
    expect(text).toContain('Nine Hours');
    expect(text).toContain('Eight Hours');
    expect(text).toMatch(/defined age groups/);
    expect(text).toMatch(/schooling provisions/);
    expect(text).toMatch(/does not.*book.*findings|does not.*book.*contained/is);
    expect(text).toMatch(
      /intention cannot be counted as an enforced penalty|not.*completed penalty/is,
    );
    expect(text).toContain('Hindley');
    expect(text).toContain('1927');
    expect(source('factory-inspection-1836').scope).toMatch(/403/);
    expect(source('factory-inspection-1836').scope).toMatch(
      /no original parliamentary volume/is,
    );
    expect(source('factory-act-1833-primary').scope).toMatch(
      /Nine Hours.*Eight Hours/is,
    );
    expect(source('factory-spinning-process').scope).toMatch(/1927.*distinct/is);
  });

  it('treats the NDL print as an attributed artistic representation with separate reproduction and rights clocks', () => {
    const m = media('tomioka-reeling-print');
    expect(m).toEqual(contract.newMediaRecord);
    expect(m.subject).toBe('tomioka');
    expect(m.date.start).toBe(1872);
    expect(m.date.precision).toBe('approximate');
    expect(m.date.label).toContain('[1872]');
    expect(m.date.note).toContain('1873');
    expect(m.date.note).toMatch(/copy\/state relationship.*not.*established/is);
    expect(m.material).toMatch(/woodblock print.*three-sheet/is);
    expect(m.depiction).toBe('contemporary document');
    expect(m.alt).toMatch(/not a photograph/);
    expect(m.rights).toContain('PDM');
    expect(m.rights).toMatch(/rights-status mark.*not.*licence/is);
    expect(m.licenseUrl).toBe('https://www.ndl.go.jp/en/use/reproduction');
    expect(m.credit).toContain('10.11501/1305876');
    expect(m.datingNote).toMatch(/unknown modern digitization date/);
    expect(m.caption).toMatch(/hours and freedom remain unestablished/);
    expect(m.hasAnnotations).toBeUndefined();
  });

  it('keeps modern component references and later training/storage/law dates outside the opening event', () => {
    const s = subject('tomioka'),
      ref = reference('tomioka-skill-work-context');
    expect([ref.interval.start, ref.interval.end]).toEqual([1872, 1916]);
    expect(ref.phases.map((phase) => phase.year)).toEqual([
      1872, 1874, 1884, 1905, 1911, 1916,
    ]);
    expect(s.interval.label).toContain('1872');
    expect(
      Object.fromEntries(
        s.placeStudy!.points.map((point) => [point.id, point.coordinates]),
      ),
    ).toEqual(contract.tomiokaPoints);
    expect(s.placeStudy!.features).toEqual([]);
    expect(s.placeStudy!.points).toHaveLength(4);
    expect(s.placeStudy!.description).toMatch(/modern property locators/);
    expect(s.placeStudy!.description).toMatch(/No shipment route/);
    expect(reading('tomioka')).toMatch(/later|retrospect|much later/i);
    expect(source('tomioka-local').scope).toContain('Prior consultation');
  });

  it('keeps the actual Hine image, reported caption and later administrative sample distinct', () => {
    const original = baseline.media.find((row) => row.id === 'loc-hine')!;
    expect(media('loc-hine')).toEqual({
      ...original,
      date: {
        ...original.date,
        note: 'Hine’s caption card dates the photograph to 3 December 1908.',
      },
      rights:
        'Library of Congress records no known restrictions on publication. The National Child Labor Committee placed no restrictions on use of the Hine material when donating the collection.',
    });
    expect(subject('hine-labor').interval.label).toBe('3 December 1908');
    const text = reading('hine-labor');
    expect(text).toMatch(/She just happened in/);
    expect(text).toMatch(/not.*statewide census/is);
    expect(text).toMatch(/exact age unknown|do not verify.*exact age/is);
    expect(source('hine').accessed).toBe(
      baseline.sources.find((row) => row.id === 'hine')!.accessed,
    );
    expect(source('hine').scope).toMatch(/403/);
    expect(source('hine-mollahan-group').scope).toMatch(/indexed.*only/is);
    expect(source('hine-mollahan-group').scope).toMatch(
      /image pixels.*not.*inspected/is,
    );
    expect(source('hine-federal-administration-1921').scope).toMatch(
      /HTML transcription\/OCR/,
    );
    expect(source('hine-federal-administration-1921').scope).toMatch(
      /PDF returned a maintenance page/,
    );
    expect(reference('hine-labor-reform-context').interval.end).toBe(1918);
  });

  it('adds one pair and a supplied three-stop family inquiry while retaining the older four-stop journey', () => {
    const j = c.journeys.find((row) => row.id === 'skills-records-protection')!;
    expect(j.stops.map(({ subject, object, year }) => [subject, object, year])).toEqual(
      [
        ['factory-reform', undefined, 1836],
        ['tomioka', 'tomioka-reeling-print', 1872],
        ['hine-labor', 'loc-hine', 1908],
      ],
    );
    expect(c.journeys.find((row) => row.id === 'machines-work')).toEqual(
      baseline.journeys.find((row) => row.id === 'machines-work'),
    );
    expect(c.journeys.find((row) => row.id === 'machines-work')!.stops).toHaveLength(4);
    expect(
      c.comparisons!.filter(
        (row) =>
          row.subjects.includes('factory-reform') && row.subjects.includes('tomioka'),
      ),
    ).toHaveLength(1);
    expect(j.introduction).toMatch(/not a route/);
    expect(familyMedia(c, j)?.id).toBe('tomioka-reeling-print');
    expect(j.familyEvidence!.text).toMatch(/not a photograph/);
    expect(j.familyEvidence!.text).toMatch(/hours|leave/);
    const pair = [subject('factory-reform'), subject('tomioka')];
    expect(chapterComparisonDimensions(pair)).toContain('work-organization');
    const sources = chapterSourceRows(c, j, pair).map((row) => row.source.id);
    expect(sources).toContain('tomioka-ndl-print');
    expect(sources).toContain('hine-federal-administration-1921');
  });
});
