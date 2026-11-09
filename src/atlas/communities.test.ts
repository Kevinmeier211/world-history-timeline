import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import baseline from './communities-baseline.json';
import { chapterComparisonDimensions, chapterSourceRows } from './chapter-sources';
import { dimensionLabels } from './comparisons';
import { familyMedia } from './family-media';
import { validateCorpus } from './validate';

const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const subject = (id: string) => c.subjects.find((s) => s.id === id)!;
const media = (id: string) => c.media.find((m) => m.id === id)!;
const source = (id: string) => c.sources.find((s) => s.id === id)!;
const journey = () => c.journeys.find((j) => j.id === 'buildings-food-continuity')!;
const evidenceFrom = (id: string, sourceId: string) =>
  subject(id).evidenceReading!.items.find((item) =>
    item.citations.some((ref) => ref.source === sourceId),
  )!;
const prose = (id: string) =>
  [...subject(id).sections, ...(subject(id).deeperReading ?? [])]
    .map((section) => section.text)
    .join(' ');

// Fixture independently extracted from sealed C5 commit 01e97998a0ef0e9ed2512fde5b14fde844e7df41.
// Unknown/disputed endpoints, old claims and comparison meanings are protected in full.
describe('Buildings, food and continuing connections: evidence boundaries', () => {
  it('validates the corpus and preserves complete original cases and comparison meanings', () => {
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
      expect(s.objectIds.slice(0, original.objectIds.length)).toEqual(
        original.objectIds,
      );
      expect(new Set(s.objectIds).size).toBe(s.objectIds.length);
      for (const [key, dimension] of Object.entries(original.dimensions))
        expect(s.dimensions[key], `${s.id}: earlier ${key}`).toEqual(dimension);
      for (const term of original.terms) expect(s.terms).toContain(term);
      // This batch supplies building records, not newly verified numeric geography.
      expect(s.placeStudy).toBeUndefined();
      expect(s.dimensionKeys).toContain('place-work');
      expect(s.evidenceReading!.items).toHaveLength(3);
      expect(s.review!.reviewer).toMatch(/not independent/i);
    }
    for (const original of baseline.oldComparisons)
      expect(c.comparisons!.find((pair) => pair.id === original.id)).toEqual(original);
    for (const original of baseline.retainedSources)
      expect(source(original.id)).toEqual(original);
  });

  it('preserves the original images and their separate modern depiction clocks', () => {
    for (const original of baseline.media) expect(media(original.id)).toEqual(original);
    for (const image of baseline.imageBytes)
      expect(
        createHash('sha256')
          .update(readFileSync(`public${image.path}`))
          .digest('hex'),
        image.path,
      ).toBe(image.sha256);
    for (const id of ['chaco-corner-door', 'ocmulgee-floor', 'ocmulgee-exterior']) {
      expect(media(id).date.precision).toBe('unknown');
      expect([media(id).date.start, media(id).date.end]).toEqual([null, null]);
    }
    expect([
      media('cahokia-view-1907').date.start,
      media('cahokia-view-1907').date.end,
    ]).toEqual([1907, 1907]);
    expect(media('ocmulgee-floor').width).toBe(526);
    expect(media('ocmulgee-exterior').date.label).toMatch(/reconstruct/i);
    expect(media('ocmulgee-exterior').caption).toMatch(/modern walls and roof/i);
    for (const id of ['chaco-plan-1850', 'ocmulgee-earthlodge-feature-plan']) {
      expect(media(id).annotations).toBeUndefined();
      expect(media(id).hasAnnotations).toBeUndefined();
    }
  });

  it('separates source-qualified reference phases from complete cases and sample constraints', () => {
    for (const [id, contextId, start, end] of [
      ['chaco-communities', 'chaco-community-work-context', 700, 1300],
      ['cahokia-city', 'cahokia-neighborhoods-making-context', 1050, 1200],
      ['ocmulgee-council', 'ocmulgee-public-buildings-context', 1000, 1715],
    ] as const) {
      const ctx = c.contexts!.find((row) => row.id === contextId)!;
      expect(subject(id).contextIds).toContain(contextId);
      expect([ctx.interval.start, ctx.interval.end]).toEqual([start, end]);
      expect(ctx.interval).not.toEqual(subject(id).interval);
      for (const phase of ctx.phases) {
        expect(phase.citations.length).toBeGreaterThan(0);
        for (const ref of phase.citations) expect(source(ref.source)).toBeDefined();
      }
    }
    const room = subject('ocmulgee-council');
    expect([room.interval.start, room.interval.end, room.interval.precision]).toEqual([
      null,
      null,
      'disputed',
    ]);
    expect(room.interval.alternatives).toHaveLength(2);
    const ctx = c.contexts!.find(
      (row) => row.id === 'ocmulgee-public-buildings-context',
    )!;
    const timber = ctx.phases.find((phase) => phase.year === 1160)!;
    expect(timber.label).toMatch(/after about 1160.*not a completion date/i);
    const maize = ctx.phases.find((phase) => phase.year === 1324)!;
    expect(maize.text).toMatch(/UGA 61307.*1324–1415 at 68%.*1315–1425 at 95%/);
    expect(maize.text).toMatch(/double peak/);
    expect(maize.text).toMatch(/does not.*date use of the Earthlodge/i);
    expect(ctx.phases.find((phase) => phase.year === 1715)!.text).toMatch(
      /not a disappearance date/i,
    );
  });

  it('connects Chaco building and food evidence without universal access, a route or implied assent', () => {
    expect(prose('chaco-communities')).toMatch(/rubble cores.*outer masonry/i);
    expect(prose('chaco-communities')).toMatch(/smaller habitation.*storage/i);
    expect(prose('chaco-communities')).toMatch(/do not form.*continuous route/i);
    const cacao = evidenceFrom('chaco-communities', 'chaco-cacao');
    expect(cacao.text).toMatch(
      /five vessels.*three probable cylinder jars.*theobromine/i,
    );
    expect(cacao.interpretation).toMatch(
      /not evidence of universal access.*exact route/i,
    );
    const statement = evidenceFrom('chaco-communities', 'chaco-pueblo-council');
    expect(statement.text).toMatch(/Page 1.*2025-02.*including Hopi/i);
    expect(statement.interpretation).toMatch(/does not date a wall.*community assent/i);
    expect(source('chaco-pueblo-council').scope).toMatch(
      /Prior consultation.*retained/,
    );
    expect(source('chaco-pueblo-council').scope).toMatch(
      /remaining page pixels.*not adopted/i,
    );
    expect(source('chaco-cacao').accessed).toBe('2026-10-27');
  });

  it('keeps Cahokia processes, local environmental tests and attributed modern accounts bounded', () => {
    expect(prose('cahokia-city')).toMatch(/eight unfinished copper pieces.*backdirt/i);
    const copper = evidenceFrom('cahokia-city', 'cahokia-copper-2011');
    expect(copper.text).toMatch(/modern replication.*repeated working and heating/i);
    expect(copper.interpretation).toMatch(/without recovering an exact schedule/i);
    expect(source('cahokia-copper-2011').scope).toMatch(/1956.*backdirt/);
    expect(source('cahokia-copper-2011').scope).toMatch(/not newly calibrated/i);
    expect(source('cahokia-neighborhoods-2019').scope).toMatch(/abstract.*not read/i);
    const soils = evidenceFrom('cahokia-city', 'cahokia-soils-2021');
    expect(soils.interpretation).toMatch(
      /does not prove every landscape was unaffected/i,
    );
    expect(soils.interpretation).toMatch(/separate Horseshoe Lake/i);
    expect(source('cahokia-osage-history-2013').scope).toMatch(
      /attributed.*not.*one modern identity/i,
    );
    expect(source('cahokia-peoria-visit-2022').scope).toMatch(
      /publication is not an exact visit date/i,
    );
    expect(source('cahokia-peoria-visit-2022').scope).toMatch(/not.*universal assent/i);
    expect(evidenceFrom('cahokia-city', 'cahokia-loc-1907').interpretation).toMatch(
      /not proof that a people disappeared/i,
    );
  });

  it('retains distinct source-plan rights, creation dates and excavation-state qualifications', () => {
    const chaco = media('chaco-plan-1850');
    expect([chaco.width, chaco.height]).toEqual([1536, 1098]);
    expect([chaco.date.start, chaco.date.end]).toEqual([1850, 1850]);
    expect(chaco.date.note).toMatch(/does not.*scan creation/i);
    expect(chaco.caption).toMatch(/no measured scale bar/i);
    expect(chaco.caption).toMatch(/not recovered ancient room names/i);
    expect(chaco.rights).toMatch(/public domain.*provider scan licence.*separate/i);
    expect(chaco.licenseUrl).toBe('https://creativecommons.org/licenses/by-nc-sa/3.0/');
    const ocmulgee = media('ocmulgee-earthlodge-feature-plan');
    expect([ocmulgee.width, ocmulgee.height]).toEqual([1600, 1725]);
    expect([ocmulgee.date.start, ocmulgee.date.end]).toEqual([null, null]);
    expect(ocmulgee.date.note).toMatch(/19 December 2025.*January 2026/);
    expect(ocmulgee.representedDate).toMatch(/fallen timber.*not a standing.roof/i);
    expect(ocmulgee.alt).toMatch(
      /bench seats.*fallen roof posts.*central fire pit.*bird.shaped platform.*cane entrance.*supports/i,
    );
    expect(ocmulgee.alt).toMatch(/north symbol and zero.to.six.feet scale/i);
    expect(ocmulgee.caption).toMatch(/Council Chamber 2 caption conflicts.*D.1/i);
    expect(source('ocmu-earthlodge-plan').scope).toMatch(/internal panel mismatch/i);
    expect(source('ocmu-earthlodge-plan').scope).toMatch(
      /qualified D.1.*never assign.*Council Chamber 2/i,
    );
    expect(ocmulgee.licenseUrl).toBe('https://creativecommons.org/licenses/by/4.0/');
    expect(ocmulgee.credit).toMatch(/Fairbanks 1946.*Figure X/i);
    expect(ocmulgee.printCaption).toMatch(/fallen roof posts are not a standing roof/i);
  });

  it('prints the work comparison and an answerable source-plan inquiry without creating historical connections', () => {
    const j = journey();
    expect(j.stops.map((stop) => [stop.subject, stop.year])).toEqual([
      ['chaco-communities', 1000],
      ['cahokia-city', 1100],
      ['ocmulgee-council', 1200],
    ]);
    expect(j.introduction).toMatch(/does not establish contact.*travel route/i);
    for (const ids of [
      ['chaco-communities', 'ocmulgee-council'],
      ['cahokia-city', 'ocmulgee-council'],
    ])
      expect(
        c.comparisons!.some(
          (pair) => JSON.stringify(pair.subjects) === JSON.stringify(ids),
        ),
      ).toBe(true);
    const pair = ['chaco-communities', 'ocmulgee-council'].map(subject);
    expect(chapterComparisonDimensions(pair)[0]).toBe('place-work');
    expect(dimensionLabels['place-work']).toBe('People, work and places');
    const family = j.familyEvidence!;
    expect(familyMedia(c, j)?.id).toBe('chaco-plan-1850');
    expect(family.object).toBe(j.leadObject);
    expect(family.text).toMatch(/1850.*room marks.*open space/i);
    expect(family.claimPrompt).toMatch(/visible relationship.*other evidence/i);
    expect(family.feedback).toMatch(
      /room uses and ancient dates requires additional evidence/i,
    );
    expect(j.evidence.options.filter((option) => option.supported)).toHaveLength(1);
    const rows = chapterSourceRows(c, j, pair);
    for (const ref of family.citations)
      expect(rows.find((row) => row.source.id === ref.source)!.locators).toContain(
        ref.locator,
      );
    for (const id of ['chaco-plan-1850', 'ocmu-earthlodge-plan'])
      expect(rows.some((row) => row.source.id === id)).toBe(true);
    const copy = structuredClone(c);
    const copiedPair = pair.map((s) => copy.subjects.find((row) => row.id === s.id)!);
    copiedPair[0]!.dimensions['place-work']!.citations = [
      {
        source: 'caral-project-2005',
        locator: 'Community dimension-only source fixture',
      },
    ];
    expect(
      chapterSourceRows(copy, j, copiedPair).find(
        (row) => row.source.id === 'caral-project-2005',
      )!.locators,
    ).toContain('Community dimension-only source fixture');
    const selected = baseline.subjects.map((s) => s.id);
    expect(
      c.relations.filter(
        (relation) =>
          selected.includes(relation.from) || selected.includes(relation.to),
      ),
    ).toEqual([]);
  });
});
