import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import type { Corpus } from './model';
import { regionalSnapshot, snapshotYears } from './snapshot';
import { includesYear, distanceFromInterval } from './chronology';
const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
describe('regional snapshot date contract', () => {
  for (const year of snapshotYears)
    it(`preserves dated scope at ${year}`, () => {
      const rows = regionalSnapshot(corpus, year, 'all');
      expect(rows).toHaveLength(7);
      for (const row of rows) {
        expect(row.selectedYear).toBe(year);
        for (const frame of row.frames)
          expect(includesYear(frame.interval, year)).toBe(true);
        for (const subject of row.cases)
          expect(includesYear(subject.interval, year)).toBe(true);
        for (const near of row.nearby) {
          expect(near.yearsFromCase).toBeGreaterThan(0);
          expect(includesYear(near.subject.interval, year)).toBe(false);
        }
        expect(row.status === 'frame-gap').toBe(
          row.frames.length === 0 && !row.reading,
        );
      }
    });
  it('distinguishes 1950 readings from case intervals and leaves the adjacent unresearched year sparse', () => {
    const rows = regionalSnapshot(corpus, 1950, 'all');
    expect(rows.every((row) => row.reading?.year === 1950)).toBe(true);
    const adjacent = regionalSnapshot(corpus, 1951, 'all');
    expect(adjacent.every((row) => !row.reading)).toBe(true);
    expect(adjacent.some((row) => row.status === 'frame-gap')).toBe(true);
    expect(
      rows
        .flatMap((row) => row.cases)
        .some((subject) => subject.id === 'factory-reform'),
    ).toBe(false);
  });
  it('counts the BCE/CE boundary without inventing year zero', () => {
    expect(
      distanceFromInterval(
        {
          start: -1,
          end: -1,
          label: '1 BCE',
          note: 'Boundary fixture',
          precision: 'exact',
        },
        1,
      ),
    ).toBe(1);
  });
});
