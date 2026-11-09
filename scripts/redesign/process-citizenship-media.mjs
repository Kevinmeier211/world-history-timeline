import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import process from 'node:process';
const root =
  process.env.ATLAS_RESEARCH_DIR ?? 'output/c8-citizenship-2026-10-28/research';
const rows = [
  [
    'indonesia-proclamation.png',
    'indonesia-proclamation',
    '8692ac8ec5e2c05b5b2c15750bed697a00e1b7e62c443add1dba444ebc37baff',
  ],
  [
    'ghana-stamp.jpg',
    'ghana-independence-stamp',
    'd4572c045d92e88b52b5601651006a1f8d9a64a6a70b5e6e60e3c264976b01c2',
  ],
  [
    'mandela-voting.jpg',
    'mandela-voting',
    '50bf8897c639d737ed02e64910d337d844936f97e5f007ec1cf2b0f6ce29519b',
  ],
];
const receipts = [];
for (const [file, id, expected] of rows) {
  const bytes = await fs.readFile(root + '/' + file);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  if (sha256 !== expected) throw new Error('Source image changed: ' + file);
  for (const thumb of [false, true]) {
    const output = 'public/atlas/media/' + id + (thumb ? '-thumb' : '') + '.webp';
    const info = await sharp(bytes)
      .rotate()
      .resize({
        width: thumb ? 480 : 1600,
        height: thumb ? 480 : 1600,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: thumb ? 82 : 92 })
      .toFile(output);
    receipts.push({
      source: file,
      sourceSha256: sha256,
      output,
      width: info.width,
      height: info.height,
      bytes: info.size,
      sha256: crypto
        .createHash('sha256')
        .update(await fs.readFile(output))
        .digest('hex'),
    });
  }
}
await fs.writeFile(root + '/media-derivatives.json', JSON.stringify(receipts, null, 2));
