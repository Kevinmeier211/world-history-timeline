import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import originals from './regional-contexts-baseline.json';
import { chapterComparisonDimensions, chapterSourceRows } from './chapter-sources';
import { validateCorpus } from './validate';

const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const subject = (id: string) => c.subjects.find((s) => s.id === id)!;
const media = (id: string) => c.media.find((m) => m.id === id)!;

describe('Objects and documented places', () => {
  it('preserves complete case identities and prior claims while adding context', () => {
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
      for (const [key, value] of Object.entries(original.dimensions))
        expect(s.dimensions[key]).toEqual(value);
      expect(s.deeperReading?.length).toBeGreaterThan(0);
      expect(s.evidenceReading?.items).toHaveLength(3);
    }
    expect(validateCorpus(c)).toEqual([]);
  });

  it('keeps media and case date conventions distinct, including the Colima alternative', () => {
    expect(subject('dongson').interval).not.toEqual(media('met-39209').date);
    expect([media('met-39209').date.start, media('met-39209').date.end]).toEqual([
      -510, 310,
    ]);
    expect([
      subject('dongson').interval.start,
      subject('dongson').interval.end,
    ]).toEqual([-500, 300]);
    expect([subject('colima').interval.start, subject('colima').interval.end]).toEqual([
      -200, 200,
    ]);
    expect(
      subject('colima')
        .deeperReading!.map((s) => s.text)
        .join(' '),
    ).toMatch(/200 BCE–300 CE/);
    expect([
      subject('hopewell-earthworks').interval.start,
      subject('hopewell-earthworks').interval.end,
    ]).toEqual([1, 400]);
    expect(media('hopewell-restored-mound').date.start).toBe(2013);
    expect(media('hopewell-survey-1848').date.start).toBe(1848);
    expect(media('hopewell-moundcity-1848').date.start).toBe(1848);
    expect(media('hopewell-moundcity-1848').place).toMatch(/Mound City/);
    expect(media('hopewell-survey-1848').place).toMatch(/Hopewell Mound Group/);
  });

  it('uses qualified reference points and supplies no inferred travel lines or boundaries', () => {
    for (const id of ['dongson', 'hopewell-earthworks']) {
      const map = subject(id).placeStudy!;
      expect(map.points.length).toBeGreaterThan(2);
      expect(map.features).toEqual([]);
      for (const point of map.points) {
        expect(point.citations.length).toBeGreaterThan(0);
        expect(point.text).toMatch(/reference|locator|locality|complex/i);
      }
    }
    expect(subject('hopewell-earthworks').placeStudy!.points).toHaveLength(8);
  });

  it('separates modern observation annotations from both the photograph and a proposed use', () => {
    const m = media('met-317600');
    expect(m.image).toBe('/atlas/media/317600-0.webp');
    expect(m.annotations!.items).toHaveLength(3);
    expect(m.annotations!.rights).toMatch(/underlying photograph has separate/);
    expect(m.annotations!.items.map((n) => n.text).join(' ')).toMatch(
      /proposed.*use|proposed.*lid/,
    );
    expect(m.rights).toMatch(/Public domain.*CC0/);
    expect([
      media('hopewell-moundcity-1848').width,
      media('hopewell-moundcity-1848').height,
    ]).toEqual([450, 607]);
    expect(media('hopewell-moundcity-1848').printWidthMm).toBeLessThanOrEqual(55);
  });

  it('prints the authored comparison and its evidence without inferring contact', () => {
    const j = c.journeys.find((j) => j.id === 'objects-places-associations')!;
    const pair = ['colima', 'hopewell-earthworks'].map(subject);
    expect(j.introduction).toMatch(/no contact/);
    expect(j.familyEvidence!.object).toBe('met-317600');
    expect(j.familyEvidence!.text).toMatch(/no precise excavation findspot/);
    expect(j.evidence.options.filter((o) => o.supported)).toHaveLength(1);
    expect(chapterComparisonDimensions(pair)[0]).toBe('place-context');
    for (const id of ['dongson--hopewell-earthworks', 'colima--hopewell-earthworks'])
      expect(c.comparisons!.find((pair) => pair.id === id)).toBeDefined();
    const rows = chapterSourceRows(c, j, pair);
    for (const ref of j.familyEvidence!.citations)
      expect(rows.some((row) => row.source.id === ref.source)).toBe(true);
    expect(
      c.relations.some((r) =>
        j.stops.some((s) => s.subject === r.from || s.subject === r.to),
      ),
    ).toBe(false);
  });
});
