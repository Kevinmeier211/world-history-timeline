import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import console from 'node:console';
import sharp from 'sharp';
const input = process.argv[2] ?? 'output/c4-exchange-2026-10-28/research/fig4.jpg';
const original = await fs.readFile(input);
const meta = await sharp(original).metadata();
const out = 'public/atlas/media';
await fs.mkdir(out, { recursive: true });
await sharp(original)
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 90 })
  .toFile(path.join(out, 'beta-samati-coins.webp'));
await sharp(original)
  .resize({ width: 300, withoutEnlargement: true })
  .webp({ quality: 84 })
  .toFile(path.join(out, 'beta-samati-coins-thumb.webp'));
console.log(
  JSON.stringify({
    originalBytes: original.length,
    width: meta.width,
    height: meta.height,
    derivatives: ['beta-samati-coins.webp', 'beta-samati-coins-thumb.webp'],
    operations:
      'Resize without enlargement and WebP encoding; no crop, retouching, labels or reconstructed detail.',
  }),
);
