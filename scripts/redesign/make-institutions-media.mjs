import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import sharp from 'sharp';

const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const text = (x, y, lines, center = false, head = false) =>
  `<text x="${x}" y="${y}"${center ? ' text-anchor="middle"' : ''}${head ? ' class="head"' : ''}>${lines.map((line, i) => `<tspan x="${x}" dy="${i ? 35 : 0}">${escape(line)}</tspan>`).join('')}</text>`;
const panel = (x, fill = '#edf2f0') =>
  `<rect x="${x}" y="78" width="170" height="178" rx="9" fill="${fill}" stroke="#33483e" stroke-width="3"/>`;
const arrow = (a, b) => `<path d="M${a},190H${b}m-7,-6l7,6l-7,6" class="shape"/>`;
const svg = (title, description, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360" role="img"><title>${escape(title)}</title><desc>${escape(description)}</desc><style>text{font-family:Arial,sans-serif;font-size:32px;fill:#182d24}.head{font-weight:700}.shape{fill:none;stroke:#33483e;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}</style><rect width="600" height="360" fill="#fffdf6"/>${body}</svg>`;
const kerma = svg(
  'A surface takes skilled work',
  'Original modern action guide to the museum account of Kerma pottery. Generic vessel symbols represent shaping by hand, surface coating and polishing, and controlled firing. No excavated kiln, measured ancient vessel profile, firing temperature, workshop location or precise sequence of atmosphere changes is reconstructed. The drawing uses teaching colors rather than a material analysis.',
  `${text(18, 41, ['A surface takes skilled work'], false, true)}${panel(18)}${panel(215, '#eadfb5')}${panel(412)}${text(103, 120, ['Shape'], true)}${text(300, 120, ['Polish'], true)}${text(497, 120, ['Fire'], true)}${arrow(194, 209)}${arrow(391, 406)}<path class="shape" d="M55,165Q62,229 103,232Q144,229 151,165M55,165Q103,179 151,165M55,165Q103,151 151,165"/><path class="shape" d="M252,180Q258,232 300,234Q342,232 348,180M252,180Q300,192 348,180M267,169L311,154"/><path d="M293,156L323,146L331,160L302,170Z" fill="#d5c796" stroke="#33483e" stroke-width="3"/><path d="M449,165Q456,232 497,234Q538,232 545,165Z" fill="#d5c796" stroke="#33483e" stroke-width="3"/><path d="M449,165Q497,151 545,165L540,187Q497,199 454,187Z" fill="#33483e"/><path class="shape" d="M460,145q-7,-9 0,-17m33,17q-7,-9 0,-17m33,17q-7,-9 0,-17"/>${text(18, 302, ['Modern guide to making.'])}${text(18, 343, ['No excavated kiln is shown.'])}`,
);
const evidence = svg(
  'Different records, different tests',
  'Original modern comparison guide: a generic royal record supports interpreting a claim, a generic instruction supports interpreting an order, and a question mark asks what would establish an outcome. The icons are not an ancient inscription, tablet, plan, receipt or translation. Arrows connect questions in a modern investigation, not historical institutions, travel or transmission.',
  `${text(18, 41, ['Different records, different tests'], false, true)}${panel(18)}${panel(215, '#eadfb5')}${panel(412)}${text(103, 120, ['Claim'], true)}${text(300, 120, ['Order'], true)}${text(497, 120, ['Outcome?'], true)}${arrow(194, 209)}${arrow(391, 406)}<rect x="65" y="153" width="76" height="80" rx="5" fill="#fffdf6" stroke="#33483e" stroke-width="3"/><path class="shape" d="M80,173H125M80,191H125M80,209H114"/><rect x="258" y="153" width="84" height="80" rx="5" fill="#fffdf6" stroke="#33483e" stroke-width="3"/><path class="shape" d="M272,173H328M272,191H320M272,209H310"/><path class="shape" d="M272,222H310"/>${text(497, 221, ['?'], true, true)}${text(18, 302, ['An order is not a receipt.'])}${text(18, 343, ['Modern guide, not a record.'])}`,
);
for (const [id, content] of [
  ['kerma-making-guide', kerma],
  ['institution-evidence-guide', evidence],
]) {
  await fs.writeFile(`public/atlas/media/${id}.svg`, content);
  await sharp(Buffer.from(content))
    .resize({ width: 300 })
    .webp({ quality: 86 })
    .toFile(`public/atlas/media/${id}-thumb.webp`);
}
