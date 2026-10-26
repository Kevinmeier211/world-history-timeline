import { readFileSync } from 'node:fs';

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
});
