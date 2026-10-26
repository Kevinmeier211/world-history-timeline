import { readFileSync, readdirSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { wordCount } from './schema/primitives.ts';

const EARLY_MODERN = [
  'kingdom_of_england',
  'kalmar_union',
  'ming',
  'vijayanagara',
  'delhi_sultanate',
  'mamluk_sultanate',
  'muromachi',
  'azuchi_momoyama',
  'venice',
  'spain_union',
  'habsburg_spain',
  'dutch_republic',
  'maya_postclassic',
  'tarascan',
  'mamluk_egypt',
  'new_france',
  'thirteen_colonies',
  'timurid_iran',
  'safavid_dynasty',
  'afsharid',
  'poland_lithuania',
  'golden_horde',
  'rus_1502',
  'tsardom_of_russia',
  'voc',
  'majapahit',
  'ayutthaya',
  'mali_empire',
  'songhai_empire',
  'dzungar',
  'golden_horde_turkic',
  'timurid',
  'sweden_1523',
  'denmark_norway',
  'saadi_morocco',
] as const;

interface Row {
  id: string;
  start: number;
  end: number;
  summary: string;
  keyFacts: string[];
  verification: string;
  evidence: string;
  confidence: string;
  dateNote?: string;
}

function rows(): Row[] {
  return readdirSync('src/data/polities')
    .filter((name) => name.endsWith('.json'))
    .flatMap(
      (name) => JSON.parse(readFileSync(`src/data/polities/${name}`, 'utf8')) as Row[],
    );
}

describe('1500–1800 skeleton prose', () => {
  it('restates checklist years and stays unverified', () => {
    const byId = new Map(rows().map((row) => [row.id, row]));
    for (const id of EARLY_MODERN) {
      const row = byId.get(id);
      expect(row, id).toBeTruthy();
      expect(row && row.start < 1800 && row.end > 1500, id).toBe(true);
      expect(wordCount(row?.summary ?? ''), id).toBeGreaterThan(0);
      expect(wordCount(row?.summary ?? ''), id).toBeLessThanOrEqual(60);
      expect(row?.keyFacts.length, id).toBeGreaterThanOrEqual(2);
      expect(row?.keyFacts.length, id).toBeLessThanOrEqual(4);
      expect(row?.summary, id).not.toMatch(/checklist skeleton/);
      expect(row?.summary, id).toMatch(/Appendix B/);
      expect(row?.verification, id).toBe('unverified');
      expect(row?.evidence, id).toContain('not opened');
      if (id === 'sweden_1523' || id === 'denmark_norway' || id === 'saadi_morocco') {
        expect(['approximate', 'debated'], id).toContain(row?.confidence);
      }
      expect(row?.dateNote ?? '', id).not.toContain('gives no single year');
    }
  });
});
