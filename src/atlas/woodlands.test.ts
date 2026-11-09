import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import type { Corpus } from './model';
import { validateCorpus } from './validate';
import { projectInterval } from './geometry';
const c = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8')) as Corpus;
describe('Eastern Woodlands historical publication contract', () => {
  it('keeps the full investigation in teaching and print without duplicating Hopewell', () => {
    expect(validateCorpus(c, true)).toEqual([]);
    const j = c.journeys.find((j) => j.id === 'eastern-woodlands')!;
    expect(j.stops.map((s) => s.subject)).toEqual([
      'ocmulgee-council',
      'hopewell-earthworks',
      'wendat-laine',
      'haudenosaunee-canandaigua',
      'cherokee-print',
      'ojibwe-manoomin',
    ]);
    expect(c.subjects.filter((s) => s.id === 'hopewell-earthworks')).toHaveLength(1);
    expect(j.printBreakAfter).toEqual([3]);
    expect(
      c.packs
        .find((p) => p.id === 'C8')!
        .investigations!.some((i) => i.journey === j.id),
    ).toBe(true);
  });
  it('does not fabricate a construction span from Ocmulgee’s old median and newer timber limit', () => {
    const d = c.subjects.find((s) => s.id === 'ocmulgee-council')!.interval;
    expect(d.start).toBeNull();
    expect(d.end).toBeNull();
    expect(d.precision).toBe('disputed');
    expect(projectInterval(d.start, d.end, { start: 1000, end: 1500 })).toBeNull();
    expect(d.alternatives).toHaveLength(2);
    expect(d.note).toMatch(/sometime after/);
  });
  it('distinguishes a modern ambiguous model figure from preferred Wendat village dates', () => {
    const s = c.subjects.find((s) => s.id === 'wendat-laine')!;
    expect(s.interval).toMatchObject({ start: 1595, end: 1626 });
    expect(s.interval.alternatives![0]!.label).toContain('1500–1530');
    const m = c.media.find((m) => m.id === 'laine-radiocarbon-2022')!;
    expect(m.date.start).toBe(2022);
    expect(m.rights).toContain('CC BY 4.0');
    expect(m.caption).toMatch(/not that final result/);
    expect(s.interval.note).not.toMatch(/95\.4%/);
  });
  it('preserves signing, ratification and different newspaper-issue dates', () => {
    const h = c.subjects.find((s) => s.id === 'haudenosaunee-canandaigua')!;
    expect(h.interval).toMatchObject({ start: 1794, end: 1795 });
    expect(c.media.find((m) => m.id === 'canandaigua-ratification')!.date.start).toBe(
      1795,
    );
    const p = c.media.find((m) => m.id === 'phoenix-april-1828')!;
    expect(p.date.label).toContain('10 April 1828');
    expect(p.caption).toContain('not the February first issue');
  });
  it('keeps reconstruction and archive-location uncertainty in the release', () => {
    const floor = c.media.find((m) => m.id === 'ocmulgee-floor')!;
    expect(floor.date.start).toBeNull();
    expect(floor.date.precision).toBe('unknown');
    expect(floor.width).toBe(526);
    const rice = c.media.find((m) => m.id === 'rice-linde-1913')!;
    expect(rice.place).toMatch(/Probably Ontario/);
    expect(rice.caption).toMatch(/unnamed/);
    expect(rice.rights).toMatch(/No known restrictions/);
  });
  it('documents exclusions and coercion alongside political assertions', () => {
    const s = c.subjects.find((s) => s.id === 'cherokee-print')!;
    const reading = [
      s.summary,
      ...s.sections.map((section) => section.text),
      s.familyActivity?.explanation ?? '',
    ].join(' ');
    expect(reading).toMatch(/African descent/);
    expect(
      s.sections.some(
        (section) =>
          /enslaved|ancestry|African descent/.test(section.text) &&
          section.citations.some((row) => row.source === 'phoenix-constitution'),
      ),
    ).toBe(true);
    expect(
      s.sections.some(
        (section) =>
          /unauthorized 1835|troops enforcing removal/.test(section.text) &&
          section.citations.some((row) => row.source === 'cherokee-nation-history'),
      ),
    ).toBe(true);
  });
  it('accounts for inherited broad labels without turning a treaty into a confederacy lifespan', () => {
    const ledger = JSON.parse(
      readFileSync('public/atlas/legacy-disposition.json', 'utf8'),
    ) as { id: string; targets: string[]; reason: string }[];
    expect(ledger).toHaveLength(1274);
    expect(ledger.find((r) => r.id === 'haudenosaunee')!.targets).toEqual([
      'haudenosaunee-canandaigua',
    ]);
    expect(ledger.find((r) => r.id === 'haudenosaunee')!.reason).toContain(
      'not a researched lifespan',
    );
    expect(ledger.find((r) => r.id === 'iroquois_indigenous_nations')!.targets).toEqual(
      ['haudenosaunee-canandaigua', 'wendat-laine', 'ojibwe-manoomin'],
    );
  });
  it('rejects bibliography group sizes that would omit sources or fail pagination', () => {
    for (const size of [0, -1, 1.5, Infinity]) {
      const bad = structuredClone(c);
      bad.journeys.find((j) => j.id === 'eastern-woodlands')!.printSourcesPerPage =
        size;
      expect(validateCorpus(bad, true)).toContain(
        'eastern-woodlands: invalid print source page size',
      );
    }
  });
});
