import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, SearchEntry } from './model';
import { worldAtTime } from './chronology';
import { sharedDimensions, comparisonDefinition } from './comparisons';
import { searchSubjects } from './search-index';
import { validateCorpus } from './validate';
const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const subject = (id: string) => c.subjects.find((s) => s.id === id)!;
describe('C7 makers, intermediaries and choice', () => {
  it('keeps case, object and reference dates on their own clocks', () => {
    expect(subject('benin-ivory').interval).toMatchObject({ start: 1525, end: 1600 });
    expect(c.media.find((m) => m.id === 'met-309900')!.date).toMatchObject({
      start: 1520,
      end: 1600,
    });
    expect(subject('kongo-translation').interval).toMatchObject({
      start: 1491,
      end: null,
      precision: 'exact',
    });
    expect(subject('portuguese-voyage').interval).toMatchObject({
      start: 1497,
      end: 1499,
    });
    const at1510 = worldAtTime(c, 1510, 'South Asia');
    expect(at1510.contexts.map((x) => x.id)).toContain('ocean-encounters-context');
    expect(at1510.current.map((x) => x.id)).not.toContain('portuguese-voyage');
    expect(
      c.contexts!.find((x) => x.id === 'kongo-christian-context')!.interval.end,
    ).toBe(1706);
  });
  it('does not invent a track, object findspot or a pilot identity', () => {
    const s = subject('portuguese-voyage');
    expect(s.placeStudy!.features).toEqual([]);
    expect(s.placeStudy!.points.map((p) => p.id)).toEqual([
      'lisbon',
      'malindi',
      'calicut',
      'goa',
    ]);
    expect(s.placeStudy!.points.find((p) => p.id === 'goa')!.text).toContain(
      'not another stop',
    );
    expect(subject('kongo-translation').placeStudy!.description).toContain(
      'not the crucifix’s findspot',
    );
    const diagram = c.media.find((m) => m.id === 'voyage-mediation-diagram')!;
    expect(diagram.date).toMatchObject({ start: 2026, end: 2026 });
    expect(diagram.depiction).toBe('explanatory diagram');
    expect(diagram.representedDate).toContain('1498');
    expect(s.objectIds).toContain(diagram.id);
  });
  it('retains translation and attribution limits rather than claiming a complete source consultation', () => {
    expect(c.sources.find((s) => s.id === 'afonso-letters-1526')!.scope).toContain(
      'not identified',
    );
    expect(c.sources.find((s) => s.id === 'gama-journal-1898')!.scope).toContain(
      'Anonymous',
    );
    expect(c.sources.find((s) => s.id === 'met-309900')!.scope).toContain(
      '1897 removal',
    );
    expect(c.sources.find((s) => s.id === 'met-318323')!.scope).toContain(
      'introduction chronology is excluded',
    );
    expect(subject('kongo-translation').review!.limitations.join(' ')).toContain(
      'unresolved',
    );
  });
  it('offers authored questions and an inquiry without inventing a historical relationship', () => {
    for (const id of ['benin-ivory', 'kongo-translation']) {
      expect(sharedDimensions(subject(id), subject('portuguese-voyage'))).toContain(
        'mediation',
      );
      expect(comparisonDefinition(c, id, 'portuguese-voyage')?.question).toBeTruthy();
    }
    const j = c.journeys.find((j) => j.id === 'makers-interpreters-encounters')!;
    expect(j.stops.map((s) => s.subject)).toEqual([
      'portuguese-voyage',
      'benin-ivory',
      'kongo-translation',
    ]);
    expect(j.evidence!.options.filter((o) => o.supported)).toHaveLength(1);
    expect(j.introduction).toContain('not a single causal route');
    expect(c.relations).toHaveLength(2);
  });
  it('indexes new explanation, provides all layers and validates the corpus', () => {
    const index: SearchEntry[] = JSON.parse(
      readFileSync('public/atlas/search.json', 'utf8'),
    );
    expect(searchSubjects(c.subjects, index, 'Malindi').map((s) => s.id)).toContain(
      'portuguese-voyage',
    );
    for (const id of ['benin-ivory', 'kongo-translation', 'portuguese-voyage']) {
      const s = subject(id);
      expect(s.deeperReading).toHaveLength(3);
      expect(s.evidenceReading!.items).toHaveLength(3);
      expect(s.familyActivity!.steps).toHaveLength(3);
      expect(s.review!.consultedOn).toBe('2026-10-28');
    }
    expect(validateCorpus(c)).toEqual([]);
  });
});
