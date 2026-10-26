import { readFileSync, readdirSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { wordCount } from './schema/primitives.ts';

interface Callout {
  id: string;
  year: number;
  attachTo?: string;
  importance: number;
  blurb: string;
  mediaId?: string;
  sourceIds: string[];
  verification: string;
  evidence: string;
}

interface Polity {
  id: string;
  start: number;
  end: number;
  sourceIds: string[];
}

const FILES = [
  'src/data/callouts/fanout-01.json',
  'src/data/callouts/fanout-02.json',
  'src/data/callouts/fanout-03.json',
  'src/data/callouts/fanout-04.json',
  'src/data/callouts/fanout-05.json',
  'src/data/callouts/fanout-06.json',
  'src/data/callouts/fanout-07.json',
  'src/data/callouts/fanout-08.json',
  'src/data/callouts/fanout-09.json',
  'src/data/callouts/fanout-10.json',
  'src/data/callouts/fanout-11.json',
  'src/data/callouts/fanout-12.json',
  'src/data/callouts/fanout-13.json',
  'src/data/callouts/fanout-14.json',
  'src/data/callouts/fanout-15.json',
];

function callouts(): Callout[] {
  return FILES.flatMap((file) => JSON.parse(readFileSync(file, 'utf8')) as Callout[]);
}

function polities(): Map<string, Polity> {
  const rows = readdirSync('src/data/polities')
    .filter((name) => name.endsWith('.json'))
    .flatMap(
      (name) =>
        JSON.parse(readFileSync(`src/data/polities/${name}`, 'utf8')) as Polity[],
    );
  return new Map(rows.map((row) => [row.id, row]));
}

describe('fan-out callouts', () => {
  it('restates a checklist year and stays unverified', () => {
    const byId = polities();
    const rows = callouts();
    expect(rows.length).toBeGreaterThanOrEqual(55);
    for (const row of rows) {
      const polity = byId.get(row.attachTo ?? '');
      expect(polity, row.id).toBeTruthy();
      expect(row.year, row.id).toBeGreaterThanOrEqual(polity?.start ?? 0);
      expect(row.year, row.id).toBeLessThanOrEqual(polity?.end ?? 0);
      expect(wordCount(row.blurb), row.id).toBeLessThanOrEqual(14);
      expect(wordCount(row.blurb), row.id).toBeGreaterThan(0);
      expect(row.blurb, row.id).toMatch(/Appendix B/);
      expect(row.importance, row.id).toBeLessThanOrEqual(3);
      expect(row.mediaId, row.id).toBeUndefined();
      expect(row.verification, row.id).toBe('unverified');
      expect(row.evidence, row.id).toContain('not opened');
      expect(row.sourceIds, row.id).toEqual(polity?.sourceIds);
    }
  });
});
