import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import console from 'node:console';
import sharp from 'sharp';
const tx = (x, y, lines, cl = '') =>
  `<text x="${x}" y="${y}" class="${cl}">${lines.map((l, i) => `<tspan x="${x}" dy="${i ? 36 : 0}">${l}</tspan>`).join('')}</text>`;
const box = (y, fill) =>
  `<rect x="30" y="${y}" width="540" height="120" rx="10" fill="${fill}" stroke="#33483e" stroke-width="3"/>`;
const arrow = (y) =>
  `<path d="M300,${y}L300,${y + 27}" stroke="#33483e" stroke-width="4" marker-end="url(#arrow)"/>`;
const frame = (title, body, height = 650) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${height}" viewBox="0 0 600 ${height}"><title>${title}</title><style>text{font-family:Arial,sans-serif;font-size:29px;fill:#182d24}.head{font-size:34px;font-weight:700}.small{font-size:24px}.label{font-weight:700}.stage{font-size:24px;font-weight:700}</style><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0L0,6L8,3Z" fill="#33483e"/></marker></defs><rect width="600" height="${height}" fill="#fffdf6"/>${body}</svg>`;
const diagrams = {
  'song-loan-diagram': frame(
    'Song crop loans: proposed timing',
    tx(30, 45, ['Song crop loans · 1069'], 'head') +
      '<rect x="30" y="75" width="250" height="130" rx="10" fill="#edf2f0" stroke="#33483e" stroke-width="3"/><rect x="320" y="75" width="250" height="130" rx="10" fill="#eadfb5" stroke="#33483e" stroke-width="3"/>' +
      tx(45, 111, ['BEFORE HARVEST'], 'stage') +
      tx(45, 151, ['Reserves supply', 'a household.'], 'small') +
      '<path d="M285,145L312,145" stroke="#33483e" stroke-width="4" marker-end="url(#arrow)"/>' +
      tx(335, 111, ['AFTER HARVEST'], 'stage') +
      tx(335, 151, ['Repay with tax', 'collection.'], 'small') +
      tx(
        30,
        250,
        [
          'Test: choice, harvest and repayment.',
          'Modern proposal guide; no outcome measured.',
        ],
        'small',
      ),
    300,
  ),
  'inka-work-diagram': frame(
    'Inca work: household, obligation and provisioning',
    tx(30, 45, ['Inca work', 'Tasks and obligations'], 'head') +
      box(120, '#edf2f0') +
      tx(50, 158, ['HOUSEHOLD / SPECIALIST WORK'], 'label') +
      tx(50, 204, ['Care, food, fiber and skilled making'], 'small') +
      arrow(247) +
      box(290, '#eadfb5') +
      tx(50, 328, ['STATE DEMANDS'], 'label') +
      tx(50, 374, ['Service, construction and supplies'], 'small') +
      arrow(417) +
      box(460, '#edf2f0') +
      tx(50, 498, ['STORES / PROVISIONING'], 'label') +
      tx(50, 537, ['Collect, keep and distribute resources'], 'small') +
      tx(30, 608, ['Modern guide. Arrows imply no equal return.'], 'small'),
  ),
};
for (const [id, svg] of Object.entries(diagrams)) {
  await fs.writeFile(`public/atlas/media/${id}.svg`, svg);
  await sharp(Buffer.from(svg))
    .resize({ width: 300 })
    .webp({ quality: 86 })
    .toFile(`public/atlas/media/${id}-thumb.webp`);
}
const raw = await fs.readFile(
  'output/c6-work-institutions-2026-10-28/research/catalan-atlas-musa-original.jpg',
);
const image = await sharp(raw)
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 88 })
  .toFile('public/atlas/media/catalan-musa-detail.webp');
await sharp(raw)
  .resize({ width: 300, withoutEnlargement: true })
  .webp({ quality: 84 })
  .toFile('public/atlas/media/catalan-musa-detail-thumb.webp');
console.log(
  JSON.stringify(
    {
      image,
      diagrams: Object.keys(diagrams),
      operations:
        'Two original diagrams; supplied historical detail resized and encoded, with no further crop, retouch or reconstructed text.',
    },
    null,
    2,
  ),
);
