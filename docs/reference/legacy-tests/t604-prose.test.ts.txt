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

describe('600 BCE–500 CE skeleton prose', () => {
  it('restates checklist years and stays unverified', () => {
    const classical = rows().filter(
      (row) =>
        row.start < 500 &&
        row.end > -600 &&
        row.evidence.includes('Appendix B checklist'),
    );
    expect(classical.length).toBeGreaterThanOrEqual(51);
    for (const row of classical) {
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
  });
});
