import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import type { Corpus } from './model';
import { chapterComparisonDimensions, chapterSourceRows } from './chapter-sources';
const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const originalIntervals = {
  'old-kingdom': {
    start: -2649,
    end: -2130,
    label: 'c. 2649–2130 BCE',
    note: 'Approximate period convention in the current 2019 essay, whose URL retains an older endpoint.',
    precision: 'approximate',
  },
  caral: {
    start: -3000,
    end: -1800,
    label: 'c. 3000–1800 BCE',
    note: 'UNESCO’s radiocarbon-based development range is followed. A current Peruvian government orientation gives 3000–1900 BCE; different endpoints are retained.',
    precision: 'disputed',
    alternatives: [
      {
        label: '3000–1900 BCE in the Peruvian government orientation',
        citations: [
          {
            source: 'caral-peru',
            locator: 'Opening orientation',
          },
        ],
      },
    ],
  },
  'skara-brae': {
    start: -3180,
    end: -2500,
    label: 'c. 3180–2500 BCE',
    note: 'Structured date in HES’s selected tool record gives the contextual range. Its narrative instead says 3100–2400; house-history page places the end around 2500. Boundaries are approximate.',
    precision: 'disputed',
  },
};
const ids = ['old-kingdom', 'caral', 'skara-brae'];
describe('Households, provisioning and renewal', () => {
  it('retains complete original case intervals and their conflicting-source explanations', () => {
    for (const id of ids)
      expect(c.subjects.find((s) => s.id === id)!.interval).toEqual(
        originalIntervals[id as keyof typeof originalIntervals],
      );
  });
  it('keeps uncertain archaeological boundaries distinct from the case and display window', () => {
    const s = c.subjects.find((s) => s.id === 'skara-brae')!;
    const ctx = c.contexts!.find((x) => s.contextIds!.includes(x.id))!;
    expect(s.interval.end).toBe(-2500);
    expect(ctx.interval.end).toBe(-2440);
    expect(ctx.interval.note).toContain('not a foundation date');
    expect(ctx.phases[0]!.year).toBe(-3300);
    expect(ctx.phases[0]!.label).toContain('3360–3160');
    expect(ctx.phases[0]!.text).toContain('display boundary');
    expect(ctx.phases.at(-1)!.label).toContain('2545–2440');
    expect(
      c.subjects.every((s) => s.interval.start === null || s.interval.start >= -3300),
    ).toBe(true);
  });
  it('separates modern guide creation from historical representation and preserves the old photograph date', () => {
    for (const id of [
      'giza-provisioning-diagram',
      'caral-renewal-diagram',
      'skara-household-guide',
    ]) {
      const m = c.media.find((m) => m.id === id)!;
      expect(m.date.start).toBe(2026);
      expect(m.date.end).toBe(2026);
      expect(m.depiction).toBe('explanatory diagram');
      expect(m.representedDate!.length).toBeGreaterThan(30);
      expect(m.licenseUrl).toBe('https://creativecommons.org/licenses/by/4.0/');
    }
    expect(c.media.find((m) => m.id === 'met-543914')!.date.start).toBe(-2465);
    expect(c.media.find((m) => m.id === 'met-543914')!.date.end).toBe(-2389);
  });
  it('preserves the two-site sample denominator and avoids presenting it as a Caral household census', () => {
    const s = c.subjects.find((s) => s.id === 'caral')!;
    const sample = s.evidenceReading!.items.find(
      (i) => i.label === 'A selected sample from two sites',
    )!;
    expect(sample.text).toMatch(
      /twenty teeth from nine Áspero individuals and one Caral individual/,
    );
    expect(sample.interpretation).toContain('neither percentages of all Caral meals');
    expect(sample.citations.every((ref) => ref.source === 'caral-starch-2023')).toBe(
      true,
    );
  });
  it('prints the supported maintenance comparison and includes its specific source records', () => {
    const j = c.journeys.find((j) => j.id === 'homes-provision-renewal')!;
    const pair = ['caral', 'skara-brae'].map((id) =>
      c.subjects.find((s) => s.id === id)!,
    );
    expect(chapterComparisonDimensions(pair)[0]).toBe('maintenance');
    expect(chapterSourceRows(c, j, pair).map((r) => r.source.id)).toEqual(
      expect.arrayContaining([
        'giza-provisioning',
        'giza-settlement',
        'giza-cult-town',
        'merer-logbook',
        'met-543914',
        'caral-project-2005',
        'caral-starch-2023',
        'skara-significance-2024',
        'skara-crops-2022',
      ]),
    );
  });
  it('supplies the new family guide while keeping a thematic path separate from historical connections', () => {
    const j = c.journeys.find((j) => j.id === 'homes-provision-renewal')!;
    expect(j.stops.map((s) => s.subject)).toEqual(ids);
    expect(j.familyEvidence!.object).toBe('skara-household-guide');
    expect(j.stops.some((s) => s.object === j.leadObject)).toBe(true);
    expect(j.familyEvidence!.claimPrompt).not.toBe(j.evidence.prompt);
    expect(
      c.relations.filter((r) => ids.includes(r.from) && ids.includes(r.to)),
    ).toEqual([]);
  });
});
