import { readFileSync } from 'node:fs';

import { mediaSrcFileSchema } from '../../src/data/schema/mediaSrc.ts';

export function validateMediaSrcText(text: string): { count: number } {
  const parsed = mediaSrcFileSchema.safeParse(JSON.parse(text) as unknown);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(issue?.message ?? 'media-src invalid');
  }
  return { count: parsed.data.length };
}

const text = readFileSync('src/data/media-src.json', 'utf8');
const result = validateMediaSrcText(text);
console.log(`media-src: ${result.count} rows`);
