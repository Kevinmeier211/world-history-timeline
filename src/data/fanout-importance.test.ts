import { readdirSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

interface Callout {
  id: string;
  importance: number;
}

describe('1800 fan-out importance', () => {
  it('leaves the new callouts at importance 2', () => {
    const files = [
      'src/data/callouts/fanout-01.json',
      'src/data/callouts/fanout-02.json',
    ];
    const rows = files.flatMap(
      (file) => JSON.parse(readFileSync(file, 'utf8')) as Callout[],
    );
    expect(rows.length).toBe(36);
    for (const row of rows) expect(row.importance, row.id).toBe(2);
  });

  it('leaves the added-state callouts at importance 2', () => {
    const rows = JSON.parse(
      readFileSync('src/data/callouts/fanout-03.json', 'utf8'),
    ) as Callout[];
    expect(rows.length).toBe(25);
    for (const row of rows) expect(row.importance, row.id).toBe(2);
  });
});

const SPINE = [
  'united_states',
  'united_kingdom',
  'ottoman',
  'ussr',
  'india',
  'prc',
  'empire_of_japan',
  'brazil',
] as const;

describe('1800 fan-out weight', () => {
  it('widens the modern spine and keeps the two clusters narrow', () => {
    const rows = readdirSync('src/data/polities')
      .filter((name) => name.endsWith('.json'))
      .flatMap(
        (name) =>
          JSON.parse(readFileSync(`src/data/polities/${name}`, 'utf8')) as {
            id: string;
            importance: number;
            weight: number;
          }[],
      );
    const byId = new Map(rows.map((row) => [row.id, row]));
    for (const id of SPINE) {
      expect(byId.get(id)?.importance, id).toBe(3);
      expect(byId.get(id)?.weight, id).toBe(0.48);
    }
    for (const id of ['gulf_states', 'central_asian_republics']) {
      expect(byId.get(id)?.importance, id).toBe(2);
      expect(byId.get(id)?.weight, id).toBe(0.22);
    }
  });
});
