import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, RuntimeCorpus } from './model';
import { chapterSourceRows, chapterSourceGroups } from './chapter-sources';
import { validateCorpus } from './validate';
import { familyMedia } from './family-media';
const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
describe('Print evidence is supplied for the task', () => {
  it('includes every source cited in the rendered comparison columns', () => {
    for (const pack of c.packs)
      for (const entry of [
        pack,
        ...(pack.investigations ?? []).map((i) => ({ ...pack, ...i })),
      ]) {
        const journey = c.journeys.find((j) => j.id === entry.journey)!;
        const pair = entry.comparison.map((id) => c.subjects.find((s) => s.id === id)!);
        const ids = chapterSourceRows(c, journey, pair).map((r) => r.source.id);
        const shown = Object.keys(pair[0]!.dimensions)
          .filter((d) => pair[1]!.dimensions[d])
          .slice(0, 2);
        for (const d of shown)
          for (const s of pair)
            for (const ref of s.dimensions[d]!.citations)
              expect(ids).toContain(ref.source);
      }
  });
  it('includes sources from every stop, including those outside the comparison pair', () => {
    for (const journey of c.journeys) {
      const rows = chapterSourceRows(c, journey, []);
      const ids = rows.map((r) => r.source.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const stop of journey.stops) {
        const s = c.subjects.find((s) => s.id === stop.subject)!;
        for (const ref of [
          ...s.sections.flatMap((s) => s.citations),
          ...s.claims.flatMap((cl) => cl.citations),
        ])
          expect(ids).toContain(ref.source);
      }
      for (const ref of journey.familyEvidence?.citations ?? [])
        expect(ids).toContain(ref.source);
      const groups = chapterSourceGroups(rows, journey.printSourcesPerPage ?? 3);
      expect(groups.flat().map((r) => r.source.id)).toEqual(ids);
      expect(
        groups.every(
          (g) => g.length > 0 && g.length <= (journey.printSourcesPerPage ?? 3),
        ),
      ).toBe(true);
      expect(
        rows.every(
          (r) =>
            r.source.scope && r.source.accessed && r.source.url && r.locators.length,
        ),
      ).toBe(true);
    }
  });
  it('keeps the C7 letter and Benin evidence alongside the voyage guide', () => {
    const rows = chapterSourceRows(
      c,
      c.journeys.find((j) => j.id === 'makers-interpreters-encounters')!,
      [],
    );
    expect(rows.map((r) => r.source.id)).toEqual(
      expect.arrayContaining([
        'gama-journal-1898',
        'afonso-letters-1526',
        'met-309900',
        'kongo-christianity',
      ]),
    );
  });
  it('supplies open family tasks with relevant images or explicit text cards for every journey', () => {
    const selected = c.journeys.filter((j) => j.familyEvidence);
    expect(selected).toHaveLength(c.journeys.length);
    expect(
      c.journeys.find((j) => j.id === 'networks-disruption')!.familyEvidence!.object,
    ).toBeNull();
    expect(
      c.journeys.find((j) => j.id === 'institutions-images')!.familyEvidence!.object,
    ).toBe('nalanda-brick-photo');
    expect(
      c.journeys.find((j) => j.id === 'knowledge-networks')!.familyEvidence!.object,
    ).toBe('met-313152');
    expect(
      selected.every(
        (j) =>
          j.familyEvidence!.citations.length &&
          j.familyEvidence!.notice.length &&
          j.familyEvidence!.claimPrompt !== j.evidence.prompt,
      ),
    ).toBe(true);
    expect(validateCorpus(c)).toEqual([]);
  });
  it('cannot select the unrelated C8 jar when the rights inquiry has no explicit image', () => {
    const rights = structuredClone(c.journeys.find((j) => j.id === 'promises-rights')!);
    expect(familyMedia(c, rights)).toBeUndefined();
    delete rights.familyEvidence;
    const image = familyMedia(c, rights)!;
    expect(image.id).not.toBe('met-9198');
    expect(
      rights.stops.some((stop) =>
        c.subjects.find((s) => s.id === stop.subject)!.objectIds.includes(image.id),
      ),
    ).toBe(true);
    const withoutParticipatingMedia = {
      ...c,
      media: c.media.filter((m) => m.id === 'met-9198'),
    };
    expect(familyMedia(withoutParticipatingMedia, rights)).toBeUndefined();
  });
  it('rejects a valid collection image assigned to an unrelated family inquiry', () => {
    const bad = structuredClone(c);
    bad.journeys.find((j) => j.id === 'war-signals')!.familyEvidence!.object =
      'met-327384';
    expect(
      validateCorpus(bad).some((s) => s.includes('family object must belong')),
    ).toBe(true);
  });
  it('rejects an unsupported family summary and keeps print-only notes out of the initial index', () => {
    const bad = structuredClone(c);
    bad.journeys.find(
      (j) => j.id === 'networks-disruption',
    )!.familyEvidence!.citations = [];
    expect(
      validateCorpus(bad).some((s) => s.includes('/family: missing evidence')),
    ).toBe(true);
    const index: RuntimeCorpus = JSON.parse(
      readFileSync('public/atlas/index.json', 'utf8'),
    );
    expect(index.journeys.every((j) => !('familyEvidence' in j))).toBe(true);
  });
});
