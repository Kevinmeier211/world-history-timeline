import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, HistoricalInterval } from './model';
import { chapterComparisonDimensions, chapterSourceRows } from './chapter-sources';
import { familyMedia } from './family-media';

const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));

// Exact selected-case conventions from sealed C2 f8ebde9293aa1604c0d1ecfe306087f9c0b7ea90.
// Keep fixtures independent of the new authoring modules and later context frames.
const originals: Record<
  string,
  {
    interval: HistoricalInterval;
    coordinates: [number, number];
    objectIds: string[];
  }
> = {
  'kerma-potters': {
    interval: {
      start: -2050,
      end: -1500,
      label: 'c. 2050–1500 BCE',
      note: 'Middle and Classical Kerma frame in the regional chronology; not the full history of Nubia.',
      precision: 'approximate',
    },
    coordinates: [30.41, 19.6],
    objectIds: ['met-545772'],
  },
  'nimrud-palace': {
    interval: {
      start: -883,
      end: -859,
      label: 'Reign of Ashurnasirpal II, 883–859 BCE',
      note: 'Selected palace-building and representational context; not the full duration of Assyria or Nimrud.',
      precision: 'approximate',
    },
    coordinates: [43.33, 36.1],
    objectIds: ['met-322614'],
  },
  taharqo: {
    interval: {
      start: -690,
      end: -664,
      label: 'Taharqo’s reign, c. 690–664 BCE',
      note: 'Catalogue reign dates; the figure is attributed to this period, not one exact production year.',
      precision: 'approximate',
    },
    coordinates: [31.9, 18.56],
    objectIds: ['met-544883'],
  },
};

function subject(id: string) {
  const result = c.subjects.find((s) => s.id === id);
  expect(result, `Compiled subject ${id}`).toBeDefined();
  return result!;
}

function media(id: string) {
  const result = c.media.find((m) => m.id === id);
  expect(result, `Compiled media ${id}`).toBeDefined();
  return result!;
}

function source(id: string) {
  const result = c.sources.find((s) => s.id === id);
  expect(result, `Compiled source ${id}`).toBeDefined();
  return result!;
}

function journey() {
  const result = c.journeys.find((j) => j.id === 'makers-supplies-royal-claims');
  expect(result, 'Compiled institutional-work inquiry').toBeDefined();
  return result!;
}

describe('makers, supplies and royal claims', () => {
  it('preserves whole selected intervals and original object selection when adding evidence', () => {
    for (const [id, original] of Object.entries(originals)) {
      const s = subject(id);
      expect(s.interval).toEqual(original.interval);
      expect(s.coordinates).toEqual(original.coordinates);
      expect(s.objectIds.slice(0, original.objectIds.length)).toEqual(
        original.objectIds,
      );
      expect(new Set(s.objectIds).size).toBe(s.objectIds.length);
      for (const object of original.objectIds) expect(media(object).subject).toBe(id);
    }
  });

  it('gives the separate contexts their own source-qualified dates and phases', () => {
    for (const [id, contextId, start, end] of [
      ['kerma-potters', 'kerma-city-context', -2500, -1500],
      ['nimrud-palace', 'nimrud-government-context', -883, -612],
      ['taharqo', 'kushite-temple-work-context', -747, -656],
    ] as const) {
      const ctx = c.contexts!.find((x) => x.id === contextId)!;
      expect(subject(id).contextIds).toContain(contextId);
      expect(ctx.interval.start).toBe(start);
      expect(ctx.interval.end).toBe(end);
      expect(ctx.interval).not.toEqual(subject(id).interval);
      expect(ctx.citations.length).toBeGreaterThan(0);
      for (const phase of ctx.phases) {
        expect(phase.citations.length).toBeGreaterThan(0);
        for (const citation of phase.citations) source(citation.source);
      }
    }
  });

  it('supplies sustained reading and cited evidence rather than orphaned new paragraphs', () => {
    for (const id of Object.keys(originals)) {
      const s = subject(id);
      const mainWords = s.sections.flatMap((x) => x.text.split(/\s+/)).length;
      const deepWords = s.deeperReading!.flatMap((x) => x.text.split(/\s+/)).length;
      expect(mainWords).toBeGreaterThanOrEqual(350);
      expect(mainWords).toBeLessThanOrEqual(450);
      expect(deepWords).toBeGreaterThanOrEqual(200);
      expect(deepWords).toBeLessThanOrEqual(300);
      const passages = [
        ...s.sections,
        ...s.deeperReading!,
        ...s.evidenceReading!.items,
      ];
      for (const passage of passages) {
        expect(passage.citations.length).toBeGreaterThan(0);
        for (const citation of passage.citations) {
          source(citation.source);
          expect(citation.locator.trim()).not.toBe('');
        }
      }
      expect(s.review!.consultedOn).toBe('2026-10-29');
      expect(s.review!.reviewer).toMatch(/not independent/i);
    }
  });

  it('keeps a royal settlement claim separate from the later captives command and completed delivery', () => {
    const s = subject('nimrud-palace');
    const royal = s.sections.find((x) =>
      x.citations.some((ref) => ref.source === 'nimrud-standard-inscription'),
    )!;
    expect(royal.text).toMatch(/claim|ruler’s account/i);
    const later = s.sections.find((x) =>
      x.citations.some((ref) => ref.source === 'nimrud-captives-letter'),
    )!;
    expect(later.text).toMatch(/732/);
    expect(later.text).toMatch(/later|eighth-century/i);
    expect(later.text).toMatch(/does not prove|does not establish/i);
    expect(later.text).toMatch(/complied|fulfilled|delivery|outcome/i);
    const letter = source('nimrud-captives-letter');
    expect(letter.type).toBe('primary');
    expect(letter.scope).toMatch(/undated/i);
    expect(letter.scope).toMatch(/proposed date.*732/i);
    const ctx = c.contexts!.find((x) => x.id === 'nimrud-government-context')!;
    const phase = ctx.phases.find((x) =>
      x.citations.some((ref) => ref.source === letter.id),
    )!;
    expect(phase.year).toBeGreaterThan(s.interval.end!);
    expect(phase.label).toMatch(/proposed/i);
  });

  it('retains the beaker date and Egyptian findspot without assigning a pot an owner identity', () => {
    const beaker = media('met-545772');
    expect([beaker.date.start, beaker.date.end]).toEqual([-1802, -1640]);
    expect(beaker.place).toMatch(/Abydos.*525/i);
    const passage = subject('kerma-potters').sections.find((x) => /525/.test(x.text))!;
    expect(passage.text).toMatch(/propos|possib|might/i);
    expect(passage.text).toMatch(
      /does not identify|does not establish|does not automatically/i,
    );
  });

  it('distinguishes the reign-attributed granite figure from broadly dated Sanam faience evidence', () => {
    const granite = media('met-544883');
    expect([granite.date.start, granite.date.end]).toEqual([-690, -664]);
    expect(granite.material).toMatch(/granite/i);
    expect(granite.place).toMatch(/probabl.*Nuri/i);
    const match = media('sanam-mould-match');
    expect(match.depiction).toBe('object photograph');
    expect(match.material).toMatch(/faience/i);
    expect(match.material).toMatch(/clay.*mould/i);
    expect(match.date.start).toBeNull();
    expect(match.date.end).toBeNull();
    expect(match.representedDate).toMatch(/Napatan/i);
    expect(match.caption).toMatch(/uninscribed/i);
    expect(match.caption).toMatch(/does not name Taharqo/i);
    expect(match.caption).toMatch(/different material and object/i);
    expect(match.source).toBe('sanam-production-2026');
    expect(match.licenseUrl).toBe('https://creativecommons.org/licenses/by/4.0/');
    const workshop = media('sanam-workshop-view');
    expect(workshop.depiction).toBe('annotated excavation photograph');
    expect([workshop.date.start, workshop.date.end]).toEqual([2026, 2026]);
    expect(workshop.date.label).toMatch(/published|publication/i);
    expect(workshop.date.note).toMatch(/do not establish.*acquisition/i);
    expect(workshop.caption).toMatch(/No north arrow/i);
    expect(workshop.caption).toMatch(/does not.*origin.*granite/i);
    expect([workshop.width, workshop.height]).toEqual([1063, 1115]);
    expect([match.width, match.height]).toEqual([512, 469]);
  });

  it('keeps the composite palace plan, attribution and unknown drawing date intact', () => {
    const plan = media('nimrud-palace-plan');
    expect(plan.date.start).toBeNull();
    expect(plan.date.end).toBeNull();
    expect([plan.width, plan.height]).toEqual([460, 926]);
    expect(plan.caption).toMatch(/composite/i);
    expect(plan.caption).toMatch(/not a single 883–859/i);
    expect(plan.caption).toMatch(/anteroom F/i);
    expect(plan.caption).toMatch(/courtyard Y/i);
    expect(plan.caption).toMatch(/50 m/);
    expect(plan.licenseUrl).toBe('https://creativecommons.org/licenses/by-sa/3.0/');
    expect(plan.credit).toMatch(/BSAI\/BISI/);
    expect(plan.credit).toMatch(/AHRC/);
    expect(plan.source).toBe('nimrud-palace-project');
    expect(source('nimrud-plan-rights').scope).toMatch(/third-party.*separate/i);
  });

  it('keeps modern guides legible and distinct from recovered records or measured ancient objects', () => {
    for (const id of ['kerma-making-guide', 'institution-evidence-guide']) {
      const m = media(id);
      expect(m.depiction).toBe('explanatory diagram');
      expect([m.width, m.height]).toEqual([600, 360]);
      expect([m.date.start, m.date.end]).toEqual([2026, 2026]);
      expect(m.date.note).toMatch(/Modern creation date/i);
      expect(m.licenseUrl).toBe('https://creativecommons.org/licenses/by/4.0/');
      const svg = readFileSync(`public${m.image}`, 'utf8');
      const fonts = [
        ...svg.matchAll(/font-size\s*:\s*([\d.]+)px/g),
        ...svg.matchAll(/font-size=["']([\d.]+)(?:px)?["']/g),
      ].map((match) => Number(match[1]));
      expect(fonts.length).toBeGreaterThan(0);
      expect(Math.min(...fonts)).toBeGreaterThanOrEqual(32);
    }
    expect(media('institution-evidence-guide').caption).toMatch(
      /modern icons.*not copies or translations/i,
    );
  });

  it('prints the underlying sources and supplies an open family task using the authored guide', () => {
    const j = journey();
    const pair = ['kerma-potters', 'nimrud-palace'].map(subject);
    expect(chapterComparisonDimensions(pair)).toContain('material-work');
    expect(chapterSourceRows(c, j, pair).map((row) => row.source.id)).toEqual(
      expect.arrayContaining([
        'kerma-doukki-aibl',
        'kerma-city-project',
        'kerma-history-project',
        'nimrud-standard-inscription',
        'nimrud-captives-letter',
        'kawa-work-2024',
        'sanam-production-2026',
        'met-544883',
      ]),
    );
    expect(j.familyEvidence!.object).toBe('institution-evidence-guide');
    expect(familyMedia(c, j)?.id).toBe('institution-evidence-guide');
    expect(j.familyEvidence!.claimPrompt).toBeTruthy();
    expect(j.familyEvidence!.claimPrompt).not.toBe(j.evidence.prompt);
    expect(j.familyEvidence!.text).toMatch(/claim|order|instruction/i);
    expect(j.familyEvidence!.citations.length).toBeGreaterThan(0);
    expect(j.evidence.options.filter((option) => option.supported)).toHaveLength(1);
  });

  it('makes a comparative inquiry without adding historical contact or a connecting route', () => {
    const j = journey();
    const participating = Object.keys(originals);
    expect(new Set(j.stops.map((s) => s.subject))).toEqual(new Set(participating));
    expect(j.introduction).toMatch(/not.*(?:contact|route)|no.*contact/i);
    expect(
      c.relations.filter(
        (r) => participating.includes(r.from) && participating.includes(r.to),
      ),
    ).toEqual([]);
    expect(c.relations.map((r) => r.id)).toEqual([
      'palmyra-network',
      'pacific-exchange',
    ]);
    for (const id of participating)
      expect(
        subject(id).placeStudy!.features.filter((f) => f.kind === 'route'),
      ).toEqual([]);
  });
});
