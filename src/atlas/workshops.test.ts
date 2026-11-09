import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import baseline from './workshops-baseline.json';
import { chapterComparisonDimensions, chapterSourceRows } from './chapter-sources';
import { dimensionLabels } from './comparisons';
import { familyMedia } from './family-media';
import { validateCorpus } from './validate';

const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const subject = (id: string) => c.subjects.find((row) => row.id === id)!;
const source = (id: string) => c.sources.find((row) => row.id === id)!;
const media = (id: string) => c.media.find((row) => row.id === id)!;
const context = (id: string) => c.contexts!.find((row) => row.id === id)!;
const evidenceFrom = (id: string, sourceId: string) =>
  subject(id).evidenceReading!.items.find((item) =>
    item.citations.some((ref) => ref.source === sourceId),
  )!;

// Independently extracted while C6 was in validation. Every selected original
// case/source/media record and all nine image files match sealed C5 commit
// 01e97998a0ef0e9ed2512fde5b14fde844e7df41. This is not a claimed C7 seal.
describe('Makers, patrons and markets: evidence boundaries', () => {
  it('validates the corpus and preserves complete original cases, claims and comparison meanings', () => {
    expect(validateCorpus(c)).toEqual([]);
    for (const original of baseline.subjects) {
      const s = subject(original.id);
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
      ] as const)
        expect(s[key], `${s.id}: ${key}`).toEqual(original[key]);
      expect(s.objectIds).toEqual(original.objectIds);
      for (const [key, dimension] of Object.entries(original.dimensions))
        expect(s.dimensions[key], `${s.id}: earlier ${key}`).toEqual(dimension);
      for (const term of original.terms) expect(s.terms).toContain(term);
      expect(s.placeStudy).toBeUndefined();
      expect(s.evidenceReading!.items).toHaveLength(3);
      expect(s.review!.reviewer).toMatch(/not independent/i);
    }
    for (const original of baseline.oldComparisons)
      expect(c.comparisons!.find((pair) => pair.id === original.id)).toEqual(original);
    const selected = baseline.subjects.map((s) => s.id);
    expect(
      c.relations.filter(
        (row) => selected.includes(row.from) || selected.includes(row.to),
      ),
    ).toEqual(baseline.oldRelations);
  });

  it('preserves four media records, the reviewed Iznik alternate description and nine image files', () => {
    for (const original of baseline.media) {
      const expected =
        original.id === 'met-451490'
          ? {
              ...original,
              additionalImageAlts: [
                'Another overhead view of the dish, showing both birds, the flower stems and the blue border around the rim.',
              ],
            }
          : original;
      expect(media(original.id)).toEqual(expected);
    }
    for (const image of baseline.imageBytes)
      expect(
        createHash('sha256')
          .update(readFileSync(`public${image.path}`))
          .digest('hex'),
        image.path,
      ).toBe(image.sha256);
    expect([media('met-42549').date.start, media('met-42549').date.end]).toEqual([
      1534, 1566,
    ]);
    expect(media('met-42549').date.label).toBe('mid-16th century');
    expect([media('met-448183').date.start, media('met-448183').date.end]).toEqual([
      1565, 1620,
    ]);
    expect(media('met-448183').date.label).toBe('ca. 1590–95');
    expect(media('met-448183').representedDate).toMatch(/no historical event year/i);
    expect([media('met-451490').date.start, media('met-451490').date.end]).toEqual([
      1575, 1590,
    ]);
    expect([media('met-449533').date.start, media('met-449533').date.end]).toEqual([
      1555, 1560,
    ]);
    expect(media('met-451490').additionalImages).toHaveLength(1);
  });

  it('renews only selected source scopes while retaining their exact earlier dated meaning', () => {
    for (const original of baseline.sources) {
      const current = source(original.id);
      if (baseline.selectedRenewals.includes(original.id)) {
        const { scope: oldScope, accessed: oldAccessed, ...oldIdentity } = original;
        const { scope, accessed, ...identity } = current;
        expect(identity).toEqual(oldIdentity);
        if (['ming', 'mughal'].includes(original.id)) {
          expect(accessed).toBe('2026-11-04');
          expect(scope).toContain('2026-10-29');
          expect(scope).toContain('Additional consultation 4 November:');
        } else expect(accessed).toBe('2026-10-29');
        expect(scope).toContain(`Prior consultation, ${oldAccessed} (retained):`);
        expect(scope).toContain(oldScope);
      } else expect(current).toEqual(original);
    }
    expect(source('stonepaste-tech').accessed).toBe('2026-10-27');
    for (const [id, contextId, start, end] of [
      ['ming-workshops', 'ming-kilns-markets-context', 1368, 1644],
      ['mughal-books', 'mughal-books-workshop-context', 1562, 1617],
      ['ottoman-workshops', 'ottoman-makers-markets-context', 1549, 1700],
    ] as const) {
      const ctx = context(contextId);
      expect(subject(id).contextIds).toContain(contextId);
      expect([ctx.interval.start, ctx.interval.end]).toEqual([start, end]);
      for (const phase of ctx.phases) {
        expect(phase.citations.length).toBeGreaterThan(0);
        for (const ref of phase.citations) expect(source(ref.source)).toBeDefined();
      }
    }
  });

  it('does not assign the 1542 related-jar order or a mediated work account to this jar’s actual makers', () => {
    const object = evidenceFrom('ming-workshops', 'met-42549');
    expect(object.text).toMatch(/similar jars in 1542/i);
    expect(object.interpretation).toMatch(
      /does not identify.*batch.*maker.*customer.*voyage/i,
    );
    const work = evidenceFrom('ming-workshops', 'ming-workshop-texts-2013');
    expect(work.text).toMatch(/Pierson.*Shao Bao.*Stephen Little/i);
    expect(work.interpretation).toMatch(/mediated.*without becoming.*every worker/i);
    expect(work.interpretation).toMatch(
      /original Chinese edition.*not independently consulted/i,
    );
    expect(source('ming-workshop-texts-2013').scope).toMatch(/not the whole.*preview/i);
    const period = context('ming-kilns-markets-context');
    const order = period.phases.find((phase) => phase.year === 1542)!;
    expect(order.text).toMatch(
      /does not make accession 17\.127\.2.*member of that order/i,
    );
    const stoppage = period.phases.find((phase) => phase.year === 1608)!;
    expect(stoppage.text).toMatch(
      /imperial.kiln operations ceased.*private production/i,
    );
    expect(stoppage.text).toMatch(/not a shutdown of every kiln/i);
  });

  it('keeps Mughal translation, copies, workshop roles, imperial argument and story time distinct', () => {
    const ctx = context('mughal-books-workshop-context');
    expect(ctx.phases.find((phase) => phase.year === 1582)!.text).toMatch(
      /1582.*c\.1585–86.*not one date/i,
    );
    expect(ctx.phases.find((phase) => phase.year === 1587)!.text).toMatch(
      /interpretation.*not measurement of universal agreement/i,
    );
    expect(ctx.phases.find((phase) => phase.year === 1616)!.text).toMatch(
      /beyond the Akbar case.*not transferred/i,
    );
    expect(source('mughal-razmnama-copy').scope).toMatch(/images.*unavailable/i);
    expect(source('mughal-razmnama-copy').scope).toMatch(
      /no.*colophon.*original Persian/i,
    );
    expect(source('mughal-workshop-network').scope).toMatch(
      /abstract.*PDF returned 403/i,
    );
    const roles = evidenceFrom('mughal-books', 'mughal-workshop-network');
    expect(roles.interpretation).toMatch(
      /do not.*other manuscript.*named hands.*this folio/i,
    );
    const argument = evidenceFrom('mughal-books', 'mughal-preface-politics');
    expect(argument.interpretation).toMatch(
      /attributed interpretation.*rather than.*universal tolerance/i,
    );
    expect(argument.interpretation).toMatch(
      /original Persian preface.*not independently translated/i,
    );
    const story = evidenceFrom('mughal-books', 'met-448183');
    expect(story.interpretation).toMatch(/neither supplies an event year.*eyewitness/i);
    expect(subject('mughal-books').familyActivity!.explanation).toMatch(
      /probably to Lahore.*without naming a maker/i,
    );
    expect(source('mughal-workshops-va').scope).toMatch(
      /Ramayana as Razmnama.*excluded/i,
    );
  });

  it('keeps Musli’s separate lamp, abstract-only science and mediated market evidence bounded', () => {
    const named = evidenceFrom('ottoman-workshops', 'ottoman-musli-lamp');
    expect(named.text).toMatch(/Musli.*1549.*separate lamp/i);
    expect(named.interpretation).toMatch(
      /does not transfer.*signature.*unsigned vessel/i,
    );
    const science = source('ottoman-iznik-technology-2004');
    expect(science.scope).toMatch(/abstract.*modern glaze replication/i);
    expect(science.scope).toMatch(/no examination of this Met dish.*universal recipe/i);
    const residues = source('ottoman-kiln-residues-2025');
    expect(residues.scope).toMatch(/English abstract.*six tile finds/i);
    expect(residues.scope).toMatch(/full fourteen.page.*not read/i);
    expect(residues.scope).toMatch(/licence.*not.*cleared source.plan adoption/i);
    expect(source('ottoman-iznik-course').scope).toMatch(
      /Covel.*mediated excerpt.*original diary.*not read/i,
    );
    expect(context('ottoman-makers-markets-context').interval.note).toMatch(
      /1700.*century.level.*not a kiln closure/i,
    );
    expect(subject('ottoman-workshops').familyActivity!.explanation).toMatch(
      /different lamp dated 1549.*cannot be transferred to the dish/i,
    );
  });

  it('prints the organizing-work dimension with provenance and keeps the supplied family object in this inquiry', () => {
    const j = c.journeys.find((row) => row.id === 'makers-patrons-markets')!;
    expect(j.title).toBe('Makers, patrons and markets');
    expect(j.question).toBe('How did makers, patrons and markets organize work?');
    expect(new Set(j.stops.map((stop) => stop.subject))).toEqual(
      new Set(baseline.subjects.map((s) => s.id)),
    );
    // Stop order/years and question-specific capsule assertions await actual
    // central authoring; this draft does not turn a tentative itinerary into fact.
    expect(j.leadObject).toBe('met-42549');
    expect(j.familyEvidence!.object).toBe('met-42549');
    expect(familyMedia(c, j)?.id).toBe('met-42549');
    const pair = ['ming-workshops', 'ottoman-workshops'].map(subject);
    expect(chapterComparisonDimensions(pair)[0]).toBe('work-organization');
    expect(dimensionLabels['work-organization']).toBe('Organizing work');
    expect(c.glossary.some((term) => term.id === 'workshop')).toBe(true);
    const rows = chapterSourceRows(c, j, pair);
    for (const ref of j.familyEvidence!.citations)
      expect(rows.find((row) => row.source.id === ref.source)!.locators).toContain(
        ref.locator,
      );
    const copy = structuredClone(c);
    const copiedPair = pair.map((s) => copy.subjects.find((row) => row.id === s.id)!);
    copiedPair[0]!.dimensions['work-organization']!.citations = [
      {
        source: 'caral-project-2005',
        locator: 'Workshop dimension-only source fixture',
      },
    ];
    expect(
      chapterSourceRows(copy, j, copiedPair).find(
        (row) => row.source.id === 'caral-project-2005',
      )!.locators,
    ).toContain('Workshop dimension-only source fixture');
  });
});
