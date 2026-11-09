// Offline references to the two externally hosted archive scans.
import { Buffer } from 'node:buffer';
import sharp from 'sharp';

const cards = [
  {
    id: 'partition-punjab-map',
    reference: 'CO 1054/76',
    lines: ['Punjab', 'boundary map'],
    width: 900,
    height: 679,
  },
  {
    id: 'partition-telegram',
    reference: 'DO 142/416',
    lines: ['Punjab', 'telegram'],
    width: 546,
    height: 900,
  },
];

for (const { id, reference, lines, width, height } of cards) {
  const left = Math.round(width * 0.085);
  const font = Math.round(width * 0.09);
  const middle = Math.round(height * 0.44);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#f7f3e9"/>
    <g fill="#203a33" font-family="Arial, sans-serif">
      <text x="${left}" y="${middle - font * 1.55}" font-size="${font * 0.39}">THE NATIONAL ARCHIVES</text>
      <text x="${left}" y="${middle}" font-family="Georgia, serif" font-size="${font}">${lines[0]}</text>
      <text x="${left}" y="${middle + font * 1.1}" font-family="Georgia, serif" font-size="${font}">${lines[1]}</text>
      <text x="${left}" y="${middle + font * 2.05}" font-size="${font * 0.53}">${reference}</text>
      <text x="${left}" y="${height * 0.86}" font-size="${font * 0.36}">View the original at the archive</text>
    </g>
  </svg>`;
  const input = Buffer.from(svg);
  const path = `public/atlas/media/${id}`;
  await sharp(input)
    .webp({ quality: 92 })
    .toFile(path + '.webp');
  await sharp(input)
    .resize({ width: 480, height: 480, fit: 'inside' })
    .webp({ quality: 88 })
    .toFile(path + '-thumb.webp');
}
