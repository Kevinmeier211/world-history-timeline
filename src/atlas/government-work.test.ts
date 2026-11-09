import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, SearchEntry } from './model';
import { worldAtTime } from './chronology';
import { searchSubjects } from './search-index';
import { sharedDimensions } from './comparisons';
const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const search: SearchEntry[] = JSON.parse(
  readFileSync('public/atlas/search.json', 'utf8'),
);
const find = (id: string) => corpus.subjects.find((s) => s.id === id)!;
describe('C3 keeps rules, local practice and public work distinct', () => {
  it('preserves case dates and permits earlier reference evidence without stretching them', () => {
    expect(find('qin-administration').interval).toMatchObject({
      start: -221,
      end: -206,
    });
    expect(find('qin-administration').interval.alternatives?.[0]?.label).toContain(
      '221–207',
    );
    const world = worldAtTime(corpus, -240, 'East Asia');
    expect(world.current.map((s) => s.id)).not.toContain('qin-administration');
    expect(world.contexts.map((s) => s.id)).toContain('qin-state-context');
    expect(find('ashoka-messages').interval).toMatchObject({ start: -268, end: -232 });
    expect(find('athens-water').interval).toMatchObject({ start: -600, end: -300 });
    expect(corpus.media.find((m) => m.id === 'met-247244')!.date).toMatchObject({
      start: -510,
      end: -500,
    });
  });
  it('preserves the specific source and object distinctions that prevent misleading histories', () => {
    expect(find('qin-administration').evidenceReading!.items[1]!.text).toContain(
      'unprovenanced',
    );
    expect(
      find('qin-administration').evidenceReading!.items[1]!.interpretation,
    ).toContain('not identify');
    expect(find('ashoka-messages').evidenceReading!.items[2]!.text).toContain(
      'XI–XIII',
    );
    expect(find('athens-water').deeperReading![0]!.text).toContain('Würzburg');
    expect(find('athens-water').deeperReading![0]!.text).toContain('not translations');
    expect(find('athens-water').evidenceReading!.items[1]!.interpretation).toContain(
      'late-fourth-century',
    );
  });
  it('identifies teaching diagrams separately from ancient evidence and keeps place maps free of inferred routes', () => {
    for (const id of ['qin-records-diagram', 'ashoka-messages-diagram']) {
      const m = corpus.media.find((m) => m.id === id)!;
      expect(m.depiction).toBe('explanatory diagram');
      expect(m.date.start).toBe(2026);
      expect(m.representedDate).toBeTruthy();
    }
    for (const id of ['qin-administration', 'ashoka-messages', 'athens-water']) {
      expect(find(id).placeStudy!.features).toEqual([]);
      expect(find(id).placeStudy!.points.length).toBeGreaterThan(2);
    }
    expect(corpus.media.find((m) => m.id === 'met-247244')!.licenseUrl).toBe(
      'https://creativecommons.org/publicdomain/zero/1.0/',
    );
  });
  it('connects searchable concepts and comparison without creating a historical relation', () => {
    for (const [q, id] of [
      ['Yuelu', 'qin-administration'],
      ['Tosali', 'ashoka-messages'],
      ['enrollment', 'athens-water'],
    ])
      expect(searchSubjects(corpus.subjects, search, q!).map((s) => s.id)).toContain(
        id,
      );
    expect(
      sharedDimensions(find('qin-administration'), find('ashoka-messages')),
    ).toContain('coordination');
    const j = corpus.journeys.find((j) => j.id === 'rules-messages-public-work')!;
    expect(j.stops.map((s) => s.subject)).toEqual([
      'qin-administration',
      'ashoka-messages',
      'athens-water',
    ]);
    expect(j.stops.every((s) => !s.relation)).toBe(true);
    expect(j.introduction).toContain('thematic order');
  });
  it('exposes three useful terms at the relevant dossiers', () => {
    for (const [id, term] of [
      ['qin-administration', 'standardization'],
      ['ashoka-messages', 'dhamma'],
      ['athens-water', 'deme'],
    ]) {
      expect(find(id!).terms).toContain(term);
      expect(corpus.glossary.find((g) => g.id === term)).toBeTruthy();
    }
  });
});
