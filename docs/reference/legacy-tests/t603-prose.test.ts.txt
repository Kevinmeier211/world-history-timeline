import { readFileSync, readdirSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { wordCount } from './schema/primitives.ts';

interface Row {
  id: string;
  start: number;
  end: number;
  summary: string;
  keyFacts: string[];
  verification: string;
  evidence: string;
  dateNote?: string;
}

function rows(): Row[] {
  return readdirSync('src/data/polities')
    .filter((name) => name.endsWith('.json'))
    .flatMap(
      (name) => JSON.parse(readFileSync(`src/data/polities/${name}`, 'utf8')) as Row[],
    );
}

describe('500–1500 skeleton prose', () => {
  it('restates checklist years and stays unverified', () => {
    const medieval = rows().filter(
      (row) =>
        row.start < 1500 &&
        row.end > 500 &&
        row.evidence.includes('Appendix B checklist'),
    );
    expect(medieval.length).toBeGreaterThanOrEqual(89);
    for (const row of medieval) {
      expect(wordCount(row.summary), row.id).toBeGreaterThan(0);
      expect(wordCount(row.summary), row.id).toBeLessThanOrEqual(60);
      expect(row.keyFacts.length, row.id).toBeGreaterThanOrEqual(2);
      expect(row.keyFacts.length, row.id).toBeLessThanOrEqual(4);
      expect(row.summary, row.id).not.toMatch(/checklist skeleton/);
      expect(row.summary, row.id).toMatch(/Appendix B/);
      expect(row.verification, row.id).toBe('unverified');
      expect(row.evidence, row.id).toContain('not opened');
      expect(row.dateNote ?? '', row.id).not.toContain('gives no single year');
    }
    expect(medieval.find((row) => row.id === 'visigoths')?.start).toBe(418);
  });
});
