import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import sharp from 'sharp';
const text = (x, y, lines, cl = '') =>
  `<text x="${x}" y="${y}" class="${cl}">${lines.map((l, i) => `<tspan x="${x}" dy="${i ? 34 : 0}">${l}</tspan>`).join('')}</text>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><title>An arrival requires more than sailing</title><style>text{font-family:Arial,sans-serif;font-size:24px;fill:#182d24}.head{font-size:30px;font-weight:700}.label{font-weight:700}</style><rect width="600" height="300" fill="#fffdf6"/><rect x="25" y="75" width="255" height="125" rx="10" fill="#edf2f0" stroke="#33483e" stroke-width="3"/><rect x="320" y="75" width="255" height="125" rx="10" fill="#eadfb5" stroke="#33483e" stroke-width="3"/>${text(25, 43, ['An arrival requires local knowledge'], 'head')}${text(40, 109, ['MALINDI'], 'label')}${text(40, 147, ['Supplies', 'and a pilot'])}<path d="M286,138L312,138L304,132M312,138L304,144" fill="none" stroke="#33483e" stroke-width="4"/>${text(335, 109, ['CALICUT'], 'label')}${text(335, 147, ['Interpreters and', 'a court audience'])}${text(25, 244, ['Narrative sequence, not an exact ship track.', 'Assistance does not establish free choice.'])}</svg>`;
await fs.writeFile('public/atlas/media/voyage-mediation-diagram.svg', svg);
await sharp(Buffer.from(svg))
  .resize({ width: 300 })
  .webp({ quality: 86 })
  .toFile('public/atlas/media/voyage-mediation-diagram-thumb.webp');
