import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import sharp from 'sharp';
const text = (x, y, lines, cls = '') =>
  `<text x="${x}" y="${y}" class="${cls}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? 40 : 0}">${line}</tspan>`).join('')}</text>`;
const panel = (y, lines) =>
  `<rect x="30" y="${y}" width="540" height="155" rx="10" fill="#edf2f0" stroke="#33483e" stroke-width="3"/>` +
  text(50, y + 44, lines, 'head');
const frame = (title, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="780" viewBox="0 0 600 780"><title>${title}</title><style>text{font-family:Arial,sans-serif;font-size:30px;fill:#182d24}.title{font-size:35px;font-weight:700}.head{font-weight:700}.note{font-size:26px}</style><rect width="600" height="780" fill="#fffdf6"/>${body}</svg>`;
const diagrams = {
  'qin-records-diagram': frame(
    'Qin devices, records and practice',
    text(30, 42, ['Qin', 'Devices, records and practice'], 'title') +
      panel(120, [
        'INSCRIBED DEVICES',
        'Balance weight: mass.',
        'Capacity measure: volume.',
      ]) +
      panel(310, [
        'ADMINISTRATIVE RECORDS',
        'Grain and responsibility.',
        'Required facts; varied layout.',
      ]) +
      panel(500, [
        'TEST LOCAL PRACTICE',
        'Compare material and format.',
        'Separate rule from outcome.',
      ]) +
      text(
        30,
        685,
        [
          'Modern guide, not a tablet facsimile.',
          'No ancient signs or quantities',
          'are invented.',
        ],
        'note',
      ),
  ),
  'ashoka-messages-diagram': frame(
    'Ashoka regional messages',
    text(30, 42, ['Ashoka', 'Place, audience and action'], 'title') +
      panel(120, [
        'GIRNAR: ROCK EDICT II',
        'Provision, planting and wells.',
        'People and cattle.',
      ]) +
      panel(310, [
        'DHAULI: SEPARATE EDICT I',
        'Judicial officials addressed.',
        'Impartiality is commanded.',
      ]) +
      panel(500, [
        'KANDAHAR: LANGUAGES',
        'Greek and Aramaic material.',
        'Regional communication.',
      ]) +
      text(
        30,
        685,
        [
          'Selected records, not one text.',
          'Royal announcements need',
          'evidence of their effects.',
        ],
        'note',
      ),
  ),
};
for (const [id, svg] of Object.entries(diagrams)) {
  await fs.writeFile(`public/atlas/media/${id}.svg`, svg);
  await sharp(Buffer.from(svg))
    .resize({ width: 300 })
    .webp({ quality: 90 })
    .toFile(`public/atlas/media/${id}-thumb.webp`);
}
process.stdout.write(
  'Created two original C3 diagrams; no source figure reproduced.\n',
);
