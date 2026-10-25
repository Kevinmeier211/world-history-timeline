import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { sourceSchema } from '../src/data/schema/index.ts';
import { sourcesMarkdown } from './sources-md.ts';

const sources = z
  .array(sourceSchema)
  .parse(JSON.parse(readFileSync('src/data/sources.json', 'utf8')));

describe('sources.json', () => {
  it('lists at least 50 unique sources with https URLs checked on 2026-10-25', () => {
    expect(sources.length).toBeGreaterThanOrEqual(50);
    expect(new Set(sources.map((source) => source.id)).size).toBe(sources.length);
    expect(sources.every((source) => source.url.startsWith('https://'))).toBe(true);
    expect(sources.every((source) => source.accessedISO === '2026-10-25')).toBe(true);
  });

  it('matches the generated LICENSES/SOURCES.md page', () => {
    expect(readFileSync('LICENSES/SOURCES.md', 'utf8')).toBe(sourcesMarkdown(sources));
  });
});
