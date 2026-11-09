import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import sharp from 'sharp';
const text = (x, y, words, size = 32, bold = false) =>
  `<text x="${x}" y="${y}" font-size="${size}"${bold ? ' font-weight="700"' : ''}>${words}</text>`;
const panel = (x, heading, lines) =>
  `<rect x="${x}" y="91" width="230" height="145" rx="10" fill="#edf2f0" stroke="#33483e" stroke-width="3"/>${text(x + 14, 131, heading, 32, true)}${lines.map((line, i) => text(x + 14, 173 + i * 39, line)).join('')}`;
const frame = (title, left, right, bottom, note) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360"><title>${title}</title><style>text{font-family:Arial,sans-serif;fill:#182d24}</style><rect width="600" height="360" fill="#fffdf6"/>${text(20, 43, title, 36, true)}${left}<path d="M260 163H340" fill="none" stroke="#62776b" stroke-width="4"/>${right}${text(24, 285, bottom)}${text(24, 336, note)}</svg>`;
const diagrams = {
  'teotihuacan-household-guide': frame(
    'Tlajinga: work and space',
    panel(20, 'ROOMS', ['Make blades', 'Compound 17']),
    panel(350, 'COURTYARD', ['Gathering', 'Shared space']),
    'Drains connect to the street',
    'Relations, not a measured plan',
  ),
  'moche-evidence-guide': frame(
    'Moche: compare evidence',
    panel(20, 'OBJECT', ['See form', 'See surface']),
    panel(350, 'EXCAVATION', ['Find tools', 'Find debris']),
    'Compare evidence of making',
    'Separate objects and contexts',
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
  'Created two original image/work guides; no source illustration copied.\n',
);
