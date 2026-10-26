import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

import { colophonText, shippedCredits } from '../../src/data/credits.ts';
import { mediaSrcFileSchema } from '../../src/data/schema/mediaSrc.ts';

export function colophonFor(generatedText: string, sourceText: string): string {
  const generated = JSON.parse(generatedText) as { images?: { id: string }[] };
  const sources = mediaSrcFileSchema.parse(JSON.parse(sourceText) as unknown);
  return colophonText(shippedCredits(generated.images ?? [], sources));
}

const invoked =
  process.argv[1]?.endsWith('credits.ts') || process.argv[1]?.endsWith('credits.js');

if (invoked) {
  const text = colophonFor(
    readFileSync('src/data/media.generated.json', 'utf8'),
    readFileSync('src/data/media-src.json', 'utf8'),
  );
  mkdirSync('docs/print', { recursive: true });
  writeFileSync('docs/print/colophon.txt', text);
  const shipped = text.split('\n').filter((line) => line.includes('http')).length;
  console.log(`media:credits: ${shipped} shipped images.`);
}
