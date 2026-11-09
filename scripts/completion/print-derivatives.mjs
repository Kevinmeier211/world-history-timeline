import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const output = 'public/atlas/print-media';
await fs.mkdir(output, { recursive: true });
const rows = [];
for (const source of [
  ...new Set(corpus.media.flatMap((m) => [m.image, ...(m.additionalImages ?? [])])),
]) {
  const input = await fs.readFile(path.join('public', source));
  const hash = createHash('sha256').update(input).digest('hex');
  if (source.endsWith('.svg')) {
    rows.push({
      source,
      path: source,
      sourceSHA256: hash,
      sha256: hash,
      treatment: 'Original vector retained',
    });
    continue;
  }
  const destination = `/atlas/print-media/${hash.slice(0, 20)}.jpg`;
  const converted = await sharp(input)
    .flatten({ background: '#ffffff' })
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toBuffer();
  await fs.writeFile(path.join('public', destination), converted);
  const meta = await sharp(converted).metadata();
  rows.push({
    source,
    path: destination,
    sourceSHA256: hash,
    sha256: createHash('sha256').update(converted).digest('hex'),
    bytes: converted.length,
    width: meta.width,
    height: meta.height,
    treatment:
      'Print-only JPEG, quality 92, full chroma, maximum 2400 px, no enlargement; white paper background. Original retained.',
  });
}
await fs.writeFile(
  'src/atlas/print-media-index.json',
  JSON.stringify(
    Object.fromEntries(rows.map((row) => [row.source, row.path])),
    null,
    2,
  ) + '\n',
);
await fs.writeFile(
  'docs/redesign/PRINT-DERIVATIVES.json',
  JSON.stringify({ status: 'generated_for_render_review', images: rows }, null, 2) +
    '\n',
);
