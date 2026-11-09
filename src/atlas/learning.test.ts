import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, SearchEntry, Source } from './model';
import { worldAtTime } from './chronology';
import { searchSubjects } from './search-index';
import { sharedDimensions } from './comparisons';
import { validateCorpus } from './validate';
const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const search: SearchEntry[] = JSON.parse(
  readFileSync('public/atlas/search.json', 'utf8'),
);
const find = (id: string) => c.subjects.find((s) => s.id === id)!;
describe('C5 distinguishes institutions, practices and source dates', () => {
  it('keeps every consultation scope available in the deferred local source file', () => {
    const index: Corpus = JSON.parse(readFileSync('public/atlas/index.json', 'utf8'));
    const records: Source[] = JSON.parse(
      readFileSync('public/atlas/source-records.json', 'utf8'),
    );
    const scopes: Record<string, string> = JSON.parse(
      readFileSync('public/atlas/source-scopes.json', 'utf8'),
    );
    expect(records.map((record) => record.id)).toEqual(c.sources.map((s) => s.id));
    for (const source of c.sources) {
      expect(scopes[source.id]).toBe(source.scope);
      const stub = index.sources.find((s) => s.id === source.id);
      expect(stub?.scope).toBe('');
      expect(stub).not.toHaveProperty('url');
      expect(stub).not.toHaveProperty('title');
      const record = records.find((item) => item.id === source.id)!;
      expect(record.scope).toBe('');
      expect(record.url).toBe(source.url);
      expect(record.title).toBe(source.title);
      expect(record.institution).toBe(source.institution);
      expect(record.accessed).toBe(source.accessed);
      expect(record.author).toBe(source.author);
      expect(record.type).toBe(source.type);
      expect(record.published).toBe(source.published);
    }
  });
  it('retains case frames and separates earlier Tang capital context', () => {
    expect(find('tang-city').interval).toMatchObject({ start: 618, end: 907 });
    expect(find('abbasid-craft').interval).toMatchObject({ start: 750, end: 1258 });
    expect(find('nalanda').interval).toMatchObject({ start: 400, end: 1300 });
    expect(worldAtTime(c, 600, 'East Asia').contexts.map((x) => x.id)).toContain(
      'tang-changan-context',
    );
    expect(worldAtTime(c, 600, 'East Asia').current.map((x) => x.id)).not.toContain(
      'tang-city',
    );
    expect(worldAtTime(c, 1301, 'South Asia').contexts.map((x) => x.id)).not.toContain(
      'nalanda-institution-context',
    );
    for (const ctx of c.contexts!.filter((x) =>
      [
        'tang-changan-context',
        'abbasid-iraq-context',
        'nalanda-institution-context',
      ].includes(x.id),
    ))
      expect(ctx.phases.every((p) => p.label)).toBe(true);
  });
  it('keeps translated settings, conservation and modern photo date apart', () => {
    expect(find('nalanda').deeperReading![0]!.text).toContain('Tamralipti');
    expect(find('nalanda').evidenceReading!.items[0]!.interpretation).toContain(
      'not silently',
    );
    expect(c.media.find((m) => m.id === 'nalanda-brick-photo')!.date).toMatchObject({
      start: 2023,
      end: 2023,
    });
    expect(c.media.find((m) => m.id === 'nalanda-brick-photo')!.licenseUrl).toBe(
      'https://creativecommons.org/licenses/by-sa/4.0/',
    );
    expect(find('tang-city').deeperReading![0]!.text).toContain('Luoyang');
  });
  it('keeps manufacture and find context distinct and makes the new work searchable', () => {
    for (const [q, id] of [
      ['curfew', 'tang-city'],
      ['Murwab', 'abbasid-craft'],
      ['Tamralipti', 'nalanda'],
    ])
      expect(searchSubjects(c.subjects, search, q!).map((s) => s.id)).toContain(id);
    expect(sharedDimensions(find('tang-city'), find('abbasid-craft'))).toContain(
      'coordination',
    );
    expect(sharedDimensions(find('abbasid-craft'), find('nalanda'))).toContain(
      'coordination',
    );
    expect(find('abbasid-craft').sections[2]!.text).toContain('not automatically');
    expect(find('abbasid-craft').deeperReading![0]!.text).toContain(
      'not chemical testing',
    );
  });
  it('supplies a thematic inquiry and a question tied to its first pictured task', () => {
    const j = c.journeys.find((j) => j.id === 'spaces-skills-learning')!;
    expect(j.leadObject).toBe('tang-access-diagram');
    expect(j.stops.map((s) => s.year)).toEqual([700, 950, 680]);
    expect(j.stops[0]!.object).toBe('tang-access-diagram');
    expect(j.evidence.prompt).toContain('gate closed');
    expect(j.stops.every((s) => !s.relation)).toBe(true);
    expect(c.relations).toHaveLength(2);
    for (const id of ['tang-city', 'abbasid-craft', 'nalanda'])
      expect(find(id).placeStudy!.features).toEqual([]);
    const invalid = structuredClone(c);
    invalid.journeys.find((item) => item.id === j.id)!.leadObject = 'met-44800';
    expect(validateCorpus(invalid)).toContain(
      `${j.id}: print lead must be a supplied stop object`,
    );
  });
});
