import { readdirSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { mediaSrcFileSchema } from '../../src/data/schema/mediaSrc.ts';
import { gateFirst, queueMarkdown } from './queue.ts';

describe('media queue', () => {
  it('marks the first 60 source rows queued-gated and leaves the rest', () => {
    const rows = mediaSrcFileSchema.parse(
      JSON.parse(readFileSync('src/data/media-src.json', 'utf8')) as unknown,
    );
    expect(rows).toHaveLength(84);
    expect(rows.slice(0, 60).every((row) => row.status === 'queued-gated')).toBe(true);
    expect(rows.slice(60).every((row) => row.status === 'candidate')).toBe(true);
    const again = gateFirst(rows, 60);
    expect(again[0]?.status).toBe('queued-gated');
    expect(again[60]?.status).toBe('candidate');
    expect(again[0]?.sourceUrl).toBe(rows[0]?.sourceUrl);
    const markdown = queueMarkdown(rows, 60);
    expect(readFileSync('docs/media-queue.md', 'utf8')).toBe(markdown);
    expect(markdown).toContain(rows[0]?.sourceUrl ?? '');
    expect(markdown).toContain(rows[0]?.credit.accession ?? '');
    expect(markdown).not.toContain('.jpg');
    expect(markdown).toContain('No image file was downloaded.');
    const callouts = readdirSync('src/data/callouts').filter((name) =>
      name.endsWith('.json'),
    );
    for (const name of callouts) {
      expect(readFileSync(`src/data/callouts/${name}`, 'utf8')).not.toContain(
        'mediaId',
      );
    }
  });
});
