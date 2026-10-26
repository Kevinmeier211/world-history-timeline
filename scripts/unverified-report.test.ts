import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { climateCurveSchema, datasetSchema } from '../src/data/schema/index.ts';
import { loadDataset } from './load-dataset.ts';
import {
  claimsFrom,
  unverifiedMarkdown,
  type ReportClaim,
} from './unverified-report.ts';

const fixture: ReportClaim[] = [
  {
    kind: 'polities',
    id: 'akkad',
    verification: 'unverified',
    importance: 4,
    family: 'mesopotamian',
    start: -2334,
    end: -2000,
  },
  {
    kind: 'polities',
    id: 'ur_iii',
    verification: 'cross-checked',
    importance: 2,
    family: 'mesopotamian',
    start: -2112,
    end: -2004,
  },
  {
    kind: 'callouts',
    id: 'giza',
    verification: 'unverified',
    importance: 5,
    family: 'nile_egyptian',
    start: -2500,
    end: -2500,
  },
  {
    kind: 'tour stops',
    id: 'tour_bronze_collapse:1',
    verification: 'unverified',
    start: -1177,
    end: -1177,
  },
];

describe('unverified report', () => {
  it('counts an edge year in both bins and lists importance ≥ 4', () => {
    const markdown = unverifiedMarkdown(fixture, ['mesopotamian', 'nile_egyptian']);
    expect(markdown).toContain('| polities | 1 | 1 | 0 | 2 |');
    expect(markdown).toContain('| callouts | 1 | 0 | 0 | 1 |');
    expect(markdown).toContain('| polities | 4 | 1 | 0 | 0 |');
    expect(markdown).toContain('| callouts | 5 | 1 | 0 | 0 |');
    expect(markdown).toContain('importance>=4 unverified: 2 of 2');
    expect(markdown).toContain('| polities | akkad | 4 |');
    expect(markdown).toContain('| callouts | giza | 5 |');
    expect(markdown).not.toContain('ur_iii');
    expect(markdown).toContain('| 3300_2000bce | 1 | 1 | 0 | 0 | 0 | 0 |');
    expect(markdown).toContain('| 2000_1000bce | 1 | 0 | 0 | 0 | 0 | 1 |');
    expect(markdown).toContain('| 1000_1bce | 0 | 0 | 0 | 0 | 0 | 0 |');
    expect(markdown).toContain('| mesopotamian | 1 | 0 |');
    expect(markdown).toContain('| nile_egyptian | 0 | 1 |');
    expect(markdown).toContain('Unverified callouts with no family: 0.');
  });

  it('matches the generated docs/UNVERIFIED.md', () => {
    const dataset = datasetSchema.parse(loadDataset());
    const climate = climateCurveSchema.parse(
      JSON.parse(readFileSync('src/data/climate.json', 'utf8')),
    );
    const markdown = unverifiedMarkdown(
      claimsFrom(dataset, climate),
      dataset.families.map((family) => family.id),
    );
    expect(readFileSync('docs/UNVERIFIED.md', 'utf8')).toBe(markdown);
  });
});
