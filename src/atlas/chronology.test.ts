import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { distanceFromInterval, includesYear, worldAtTime } from './chronology';
import { regionalStartingPoints } from './exploration';
import type { RuntimeCorpus } from './model';

const index: RuntimeCorpus = JSON.parse(
  readFileSync('public/atlas/index.json', 'utf8'),
);
const subject = (id: string) => index.subjects.find((item) => item.id === id)!;

describe('case interval semantics', () => {
  it('includes years from Kongo’s documented start with no assigned end', () => {
    const { interval } = subject('kongo-translation');
    expect(includesYear(interval, 1490)).toBe(false);
    expect(includesYear(interval, 1600)).toBe(true);
    expect(distanceFromInterval(interval, 1600)).toBe(0);
  });

  it('uses Ozette’s rival dates as separate possibilities', () => {
    const { interval } = subject('ozette-makah');
    expect(includesYear(interval, 1560)).toBe(true);
    expect(includesYear(interval, 1700)).toBe(true);
    expect(includesYear(interval, 1600)).toBe(false);
    expect(distanceFromInterval(interval, 1600)).toBe(40);
    expect(distanceFromInterval(interval, 1690)).toBe(10);
    expect(includesYear({ ...interval, label: '1560–1700; disputed' }, 1600)).toBe(
      true,
    );
    expect(includesYear({ ...interval, label: '1560 or 1800; disputed' }, 1600)).toBe(
      true,
    );
    expect(includesYear({ ...interval, precision: 'range' }, 1600)).toBe(true);
  });

  it('never selects undated Ocmulgee as current or nearby, even without a cap', () => {
    const ocmulgee = subject('ocmulgee-council');
    const corpus = { ...index, subjects: [ocmulgee] };
    for (const year of [1015, 1160, 1600]) {
      expect(includesYear(ocmulgee.interval, year)).toBe(false);
      expect(distanceFromInterval(ocmulgee.interval, year)).toBe(Infinity);
      expect(worldAtTime(corpus, year, 'all', Infinity).nearby).toEqual([]);
      expect(regionalStartingPoints(corpus.subjects, year, Infinity)).toEqual([]);
    }
  });

  it('uses the same inclusive 150-year limit for both sets of suggestions', () => {
    const skara = subject('skara-brae');
    const corpus = { ...index, subjects: [skara] };
    for (const [year, expected] of [
      [-2350, [skara]],
      [-2349, []],
      [-1684, []],
    ] as const) {
      expect(regionalStartingPoints(corpus.subjects, year)).toEqual(expected);
      expect(worldAtTime(corpus, year, 'Europe').nearby).toEqual(expected);
    }
    expect(regionalStartingPoints(index.subjects, -1684)).not.toContain(skara);
    expect(regionalStartingPoints(corpus.subjects, -2349, 151)).toEqual([skara]);
    expect(worldAtTime(corpus, -2349, 'Europe', 151).nearby).toEqual([skara]);
  });
});
