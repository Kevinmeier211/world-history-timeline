import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import type { Corpus, SearchEntry } from './model';
import { createSubjectSearch, explainSearchMatch } from './search-index';
import { parseYearQuery } from '../lib/years';
const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const entries: SearchEntry[] = JSON.parse(
  readFileSync('public/atlas/search.json', 'utf8'),
);
const fixtures: {
  id: string;
  category: string;
  query: string;
  subject?: string;
  subjects?: string[];
  year?: number | null;
}[] = JSON.parse(readFileSync('docs/redesign/search-acceptance.json', 'utf8'));
const findSubjects = createSubjectSearch(corpus.subjects, entries);
describe('fixed discovery acceptance examples', () => {
  for (const fixture of fixtures)
    it(`${fixture.id}: ${fixture.query}`, () => {
      if (fixture.category === 'date_or_bce_ce_boundary') {
        expect(parseYearQuery(fixture.query)).toBe(fixture.year);
        return;
      }
      const hits = findSubjects(fixture.query);
      if (fixture.subject) {
        expect(hits.map((s) => s.id)).toContain(fixture.subject);
        const subject = corpus.subjects.find((s) => s.id === fixture.subject)!;
        const match = explainSearchMatch(subject, entries, fixture.query);
        const original = [
          subject.name,
          ...subject.aliases,
          subject.question,
          subject.place,
          subject.summary,
          entries.find((e) => e.id === subject.id)?.text ?? '',
        ];
        expect(
          original.some((text) => text.includes(match.text.replace(/^…|…$/g, ''))),
        ).toBe(true);
      } else expect(hits.map((s) => s.id)).toEqual(fixture.subjects);
    });
});
