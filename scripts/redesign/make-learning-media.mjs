import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import console from 'node:console';
import sharp from 'sharp';
const tx = (x, y, lines, cl = '') =>
  `<text x="${x}" y="${y}" class="${cl}">${lines.map((l, i) => `<tspan x="${x}" dy="${i ? 36 : 0}">${l}</tspan>`).join('')}</text>`;
const frame = (title, body, height = 780) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${height}" viewBox="0 0 600 ${height}"><title>${title}</title><style>text{font-family:Arial,sans-serif;font-size:29px;fill:#182d24}.head{font-size:34px;font-weight:700}.small{font-size:25px}.label{font-weight:700}</style><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0L0,6L8,3Z" fill="#33483e"/></marker></defs><rect width="600" height="${height}" fill="#fffdf6"/>${body}</svg>`;
const diagrams = {
  'tang-access-diagram': frame(
    'Chang’an: an errand through a ward gate',
    tx(25, 40, ['Chang’an', 'Access through a gate'], 'head') +
      `<rect x="25" y="115" width="210" height="145" rx="8" fill="#edf2f0" stroke="#33483e" stroke-width="4"/>` +
      tx(43, 155, ['WARD'], 'label') +
      tx(43, 191, ['Homes /', 'institutions'], 'small') +
      `<rect x="227" y="185" width="16" height="42" fill="#fffdf6"/><path d="M232,185L250,197M232,227L250,215" stroke="#33483e" stroke-width="3"/><rect x="280" y="165" width="115" height="80" rx="6" fill="#dde5e9"/>` +
      tx(287, 194, ['PUBLIC', 'STREET'], 'small') +
      `<path d="M180,206L272,206M397,206L425,206" fill="none" stroke="#33483e" stroke-width="4" marker-end="url(#arrow)"/><rect x="430" y="115" width="145" height="145" rx="8" fill="#eadfb5" stroke="#33483e" stroke-width="3"/>` +
      tx(440, 155, ['MARKET'], 'label') +
      tx(182, 288, ['GATE'], 'small') +
      tx(285, 288, ['Daytime errand'], 'small') +
      tx(
        25,
        345,
        [
          'Functional settings; no scale or exact route.',
          'Modern guide. Rules need evidence of practice.',
        ],
        'small',
      ),
    400,
  ),
  'abbasid-work-diagram': frame(
    'Lustre pottery: body, surface and controlled firing',
    tx(30, 45, ['Lustre pottery', 'Work behind a surface'], 'head') +
      `<rect x="30" y="120" width="540" height="155" rx="10" fill="#edf2f0" stroke="#33483e" stroke-width="3"/><path d="M55,175Q110,265 165,175" fill="none" stroke="#a46a42" stroke-width="14"/>` +
      tx(195, 160, ['1. BODY'], 'label') +
      tx(195, 203, ['Prepare and form', 'the earthenware.'], 'small') +
      `<path d="M300,280L300,308" stroke="#33483e" stroke-width="4" marker-end="url(#arrow)"/><rect x="30" y="325" width="540" height="155" rx="10" fill="#edf2f0" stroke="#33483e" stroke-width="3"/><path d="M55,380Q110,470 165,380" fill="none" stroke="#a46a42" stroke-width="14"/><path d="M55,375Q110,465 165,375" fill="none" stroke="#ffffff" stroke-width="8"/>` +
      tx(195, 365, ['2. SURFACE'], 'label') +
      tx(195, 408, ['Opaque glaze', 'and firing.'], 'small') +
      `<path d="M300,485L300,513" stroke="#33483e" stroke-width="4" marker-end="url(#arrow)"/><rect x="30" y="530" width="540" height="155" rx="10" fill="#edf2f0" stroke="#33483e" stroke-width="3"/><path d="M55,585Q110,675 165,585" fill="none" stroke="#a46a42" stroke-width="14"/><path d="M55,580Q110,670 165,580" fill="none" stroke="#ffffff" stroke-width="8"/><path d="M58,581Q110,658 162,581" fill="none" stroke="#9c7c31" stroke-width="4"/>` +
      tx(195, 570, ['3. LUSTRE'], 'label') +
      tx(195, 613, ['Decorate; control', 'the firing atmosphere.'], 'small') +
      tx(
        30,
        725,
        ['Skill, kiln, fuel and failures.', 'Simplified tasks; not a tested recipe.'],
        'small',
      ),
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
  'output/c5-learning-2026-10-28/research/nalanda-photo.jpg',
);
const photo = await sharp(raw)
  .resize({ width: 1600, withoutEnlargement: true })
  .webp({ quality: 88 })
  .toFile('public/atlas/media/nalanda-brick-photo.webp');
await sharp(raw)
  .resize({ width: 300, withoutEnlargement: true })
  .webp({ quality: 84 })
  .toFile('public/atlas/media/nalanda-brick-photo-thumb.webp');
console.log(
  JSON.stringify({
    photo,
    operations:
      'Original diagrams. Photo resized and WebP encoded; no crop, retouching, labels or reconstructed detail.',
    files: [...Object.keys(diagrams), 'nalanda-brick-photo'],
  }),
);
