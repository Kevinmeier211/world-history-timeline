import process from 'node:process';
/* global console */
import fs from 'node:fs/promises';
import sharp from 'sharp';
const c = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const out = process.env.ATLAS_REPORT_DIR ?? 'output/redesign/final';
await fs.mkdir(out, { recursive: true });
const results = [];
for (const m of c.media)
  for (const url of [m.image, m.thumbnail, ...(m.additionalImages ?? [])]) {
    const image = sharp(`public${url}`);
    const metadata = await image.metadata();
    await image.raw().toBuffer();
    if (url === m.image && (metadata.width !== m.width || metadata.height !== m.height))
      throw Error(`Dimensions differ: ${m.id}`);
    results.push({
      media: m.id,
      url,
      width: metadata.width,
      height: metadata.height,
      decoded: true,
    });
  }
await fs.writeFile(`${out}/media-decoding.json`, JSON.stringify(results, null, 2));
console.log(
  `Decoded all ${results.length} local image derivatives across ${c.media.length} object records.`,
);
