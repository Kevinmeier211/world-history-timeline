import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { Corpus } from './model';
import { latestConsultationDate } from './consultation-date';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
describe('dated print consultation', () => {
  it('includes fresh source consultation without falsely redating preserved claims', () => {
    const c = structuredClone(corpus);
    for (const s of c.subjects) {
      s.review = undefined;
      for (const claim of s.claims) claim.checkedOn = '2026-10-28';
    }
    for (const source of c.sources) source.accessed = '2026-10-28';
    c.sources[0]!.accessed = '2026-10-29';
    expect(latestConsultationDate(c)).toBe('2026-10-29');
    expect(
      c.subjects.flatMap((s) => s.claims).every((c) => c.checkedOn === '2026-10-28'),
    ).toBe(true);
  });
  it('honors a separately dated author review while preserving the source records', () => {
    const c = structuredClone(corpus);
    for (const source of c.sources) source.accessed = '2026-10-28';
    for (const subject of c.subjects) {
      for (const claim of subject.claims) claim.checkedOn = '2026-10-28';
      if (subject.review) subject.review.consultedOn = '2026-10-28';
    }
    const before = structuredClone(c.sources);
    c.subjects.find((s) => s.review)!.review!.consultedOn = '2026-11-01';
    expect(latestConsultationDate(c)).toBe('2026-11-01');
    expect(c.sources).toEqual(before);
  });
  it('does not invent a date when no consultation is recorded', () => {
    expect(
      latestConsultationDate({ ...corpus, subjects: [], sources: [] }),
    ).toBeUndefined();
  });
});
