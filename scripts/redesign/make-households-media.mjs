import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import sharp from 'sharp';

const escape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const text = (x, y, lines, { center = false, head = false, step = 34 } = {}) =>
  `<text x="${x}" y="${y}"${center ? ' text-anchor="middle"' : ''}${head ? ' class="head"' : ''}>${lines.map((line, index) => `<tspan x="${x}" dy="${index ? step : 0}">${escape(line)}</tspan>`).join('')}</text>`;
const arrow = (x1, x2, y) =>
  `<path d="M${x1},${y}H${x2}m-7,-6l7,6l-7,6" fill="none" stroke="#33483e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
const panel = (x, y, width, height, fill = '#edf2f0') =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="9" fill="${fill}" stroke="#33483e" stroke-width="3"/>`;
const svg = (title, description, height, size, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${height}" viewBox="0 0 600 ${height}" role="img"><title>${escape(title)}</title><desc>${escape(description)}</desc><style>text{font-family:Arial,sans-serif;font-size:${size}px;fill:#182d24}.head{font-size:32px;font-weight:700}.shape{fill:none;stroke:#33483e;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.stone{fill:#d5c796;stroke:#33483e;stroke-width:2}</style><rect width="600" height="${height}" fill="#fffdf6"/>${body}</svg>`;

const giza = svg(
  'Food involved several kinds of work',
  'Original modern functional guide. Grain storage connects to preparation and baking, then meals and work. Generic symbols show no quantities, measured flow, recipe or surveyed plan.',
  300,
  24,
  `${text(18, 39, ['Food involved several kinds of work'], { head: true })}
${panel(18, 75, 170, 127)}${panel(215, 75, 170, 127, '#eadfb5')}${panel(412, 75, 170, 127)}
${text(103, 111, ['Grain', 'storage'], { center: true, step: 31 })}
${text(300, 111, ['Prepare', 'and bake'], { center: true, step: 31 })}
${text(497, 111, ['Meals', 'and work'], { center: true, step: 31 })}
${arrow(194, 209, 135)}${arrow(391, 406, 135)}
<path class="shape" d="M76,158v30h54v-30m-54,0q27,-13 54,0q-27,13 -54,0"/><path class="shape" d="M84,171h38m-38,9h38"/>
<path class="shape" d="M273,166q27,40 54,0Zm4,-10q10,-9 19,0m1,0q10,-9 19,0"/>
<circle cx="482" cy="163" r="8" class="stone"/><path class="shape" d="M470,189v-10q12,-12 24,0v10m10,-11h23m-25,0q10,17 20,0"/>
${text(18, 241, ['Symbols show tasks, not quantities.'])}
${text(18, 279, ['Relationships, not a recipe or site plan.'])}`,
);

const caral = svg(
  'Rooms changed through repeated work',
  'Original conceptual guide to earlier space, subdivision, and fill beneath renewed building. Stone-filled bag symbols indicate a type of material, not a measured quantity. This is not a surveyed plan or a universal sequence.',
  360,
  28,
  `${text(18, 40, ['Rooms changed through work'], { head: true })}
${panel(18, 78, 170, 182)}${panel(215, 78, 170, 182)}${panel(412, 78, 170, 182, '#eadfb5')}
${text(103, 112, ['Earlier', 'space'], { center: true, step: 34 })}
${text(300, 112, ['Divide', 'space'], { center: true, step: 34 })}
${text(497, 112, ['Fill and', 'renew'], { center: true, step: 34 })}
${arrow(194, 209, 177)}${arrow(391, 406, 177)}
<path class="shape" d="M49,176v64h108v-64"/>
<path class="shape" d="M246,176v64h108v-64m-54,0v64"/>
<path class="shape" d="M442,166v35h109v-35m-121,43h134v36H430Z"/>
<path d="M439,232q-5,-17 13,-17q18,0 13,17q-1,10 -13,10q-12,0 -13,-10m42,0q-5,-17 13,-17q18,0 13,17q-1,10 -13,10q-12,0 -13,-10m42,0q-5,-17 13,-17q18,0 13,17q-1,10 -13,10q-12,0 -13,-10" fill="#fffdf6" stroke="#33483e" stroke-width="2"/>
<circle class="stone" cx="449" cy="226" r="4"/><circle class="stone" cx="457" cy="233" r="4"/><circle class="stone" cx="491" cy="226" r="4"/><circle class="stone" cx="499" cy="233" r="4"/><circle class="stone" cx="533" cy="226" r="4"/><circle class="stone" cx="541" cy="233" r="4"/>
${text(18, 299, ['Modern guide, not a surveyed plan.'])}
${text(18, 339, ['Stages vary; symbols show no amounts.'])}`,
);

const skara = svg(
  'House 1: features, not a measured plan',
  'Independent modern relationship guide from textual information, not a traced source plan. Central hearth, shelving beyond, entrance, and four side slab enclosures shown as two on each side. A separate, fifth enclosure left of the entrance is wider. Nineteenth-century rebuilding omitted recorded cells. Box sizes and dashed links are symbolic; no dimensions, orientation, roof or gendered occupants are reconstructed.',
  400,
  32,
  `${text(18, 39, ['House 1: features, not a plan'], { head: true })}
${panel(193, 61, 214, 77)}
${text(300, 93, ['Stone', 'shelving'], { center: true, step: 34 })}
${text(103, 160, ['Enclosures'], { center: true })}${text(497, 160, ['Enclosures'], { center: true })}
${panel(18, 173, 170, 44)}${panel(18, 226, 170, 44)}
${panel(412, 173, 170, 44)}${panel(412, 226, 170, 44)}
${text(103, 205, ['Slab'], { center: true })}${text(103, 258, ['Slab'], { center: true })}
${text(497, 205, ['Slab'], { center: true })}${text(497, 258, ['Slab'], { center: true })}
${panel(231, 181, 138, 69, '#eadfb5')}${text(300, 224, ['Hearth'], { center: true })}
${panel(213, 275, 174, 43)}${text(300, 307, ['Entrance'], { center: true })}
${panel(18, 275, 190, 43)}${text(113, 307, ['Wider'], { center: true })}
<path d="M300,145v29m0,83v18" fill="none" stroke="#33483e" stroke-width="3" stroke-dasharray="6 6"/>
${text(18, 351, ['Modern guide, not a measured plan.'])}
${text(18, 389, ['Room includes 1800s rebuilding.'])}`,
);

for (const [id, content] of [
  ['giza-provisioning-diagram', giza],
  ['caral-renewal-diagram', caral],
  ['skara-household-guide', skara],
]) {
  await fs.writeFile(`public/atlas/media/${id}.svg`, content);
  await sharp(Buffer.from(content))
    .resize({ width: 300 })
    .webp({ quality: 86 })
    .toFile(`public/atlas/media/${id}-thumb.webp`);
}
