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

const EARLY_IDS = [
  'akkadian_empire',
  'early_dynastic_egypt',
  'first_intermediate_egypt',
  'liangzhu',
  'mesopotamia_2154',
  'old_kingdom_egypt',
  'sumerian_city_states',
  'ur_iii',
] as const;

function rows(): Row[] {
  return readdirSync('src/data/polities')
    .filter((name) => name.endsWith('.json'))
    .flatMap(
      (name) => JSON.parse(readFileSync(`src/data/polities/${name}`, 'utf8')) as Row[],
    );
}

describe('3300–2000 BCE skeleton prose', () => {
  it('restates checklist years and stays unverified', () => {
    const byId = new Map(rows().map((row) => [row.id, row]));
    expect(EARLY_IDS).toHaveLength(8);
    for (const id of EARLY_IDS) {
      const row = byId.get(id);
      expect(row, id).toBeTruthy();
      expect(wordCount(row?.summary ?? ''), id).toBeGreaterThan(0);
      expect(wordCount(row?.summary ?? ''), id).toBeLessThanOrEqual(60);
      expect(row?.keyFacts.length, id).toBeGreaterThanOrEqual(2);
      expect(row?.keyFacts.length, id).toBeLessThanOrEqual(4);
      expect(row?.summary, id).not.toMatch(/checklist skeleton/);
      expect(row?.summary, id).toMatch(/Appendix B/);
      expect(row?.verification, id).toBe('unverified');
      expect(row?.evidence, id).toContain('not opened');
      expect(row?.dateNote ?? '', id).not.toContain('gives no single year');
    }
    const still = rows().filter(
      (row) =>
        row.start < -2000 &&
        row.end > -3300 &&
        row.summary.includes('checklist skeleton'),
    );
    expect(still.map((row) => row.id)).toEqual([]);
  });
});
