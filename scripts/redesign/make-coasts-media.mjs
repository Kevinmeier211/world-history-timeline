import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import sharp from 'sharp';

const escape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const text = (x, y, lines, { center = false, head = false, step = 35 } = {}) =>
  `<text x="${x}" y="${y}"${center ? ' text-anchor="middle"' : ''}${head ? ' class="head"' : ''}>${lines.map((line, index) => `<tspan x="${x}" dy="${index ? step : 0}">${escape(line)}</tspan>`).join('')}</text>`;
const arrow = (x1, x2, y) =>
  `<path d="M${x1},${y}H${x2}m-7,-6l7,6l-7,6" fill="none" stroke="#33483e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
const panel = (x, fill = '#edf2f0') =>
  `<rect x="${x}" y="78" width="170" height="178" rx="9" fill="${fill}" stroke="#33483e" stroke-width="3"/>`;
const svg = (title, description, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360" role="img"><title>${escape(title)}</title><desc>${escape(description)}</desc><style>text{font-family:Arial,sans-serif;font-size:32px;fill:#182d24}.head{font-weight:700}.shape{fill:none;stroke:#33483e;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.mark{fill:#33483e}</style><rect width="600" height="360" fill="#fffdf6"/>${body}</svg>`;

const olmec = svg(
  'Dates change the question',
  'Original modern relationship guide to a change in archaeological interpretation. A generic surface mound symbol leads to a generic layered sample and then to notes about local history. The shapes, layers, spacing and number of marks are illustrative, not an observed San Lorenzo mound, measured cross-section, house plan, survey or census. No source figure is copied.',
  `${text(18, 41, ['Dates change the question'], { head: true })}
${panel(18)}${panel(215, '#eadfb5')}${panel(412)}
${text(103, 113, ['Surface', 'form'], { center: true })}
${text(300, 113, ['Dated', 'sample'], { center: true })}
${text(497, 113, ['Local', 'history'], { center: true })}
${arrow(194, 209, 190)}${arrow(391, 406, 190)}
<path class="shape" d="M43,226H163M48,226Q75,216 82,200Q100,171 125,207Q137,222 158,226"/>
<rect x="272" y="173" width="56" height="61" fill="#fffdf6" stroke="#33483e" stroke-width="3"/>
<path d="M274,192H326M274,213H326" stroke="#33483e" stroke-width="3"/>
<path d="M275,175H325V190H275Z" fill="#d5c796"/>
<path d="M275,194H325V211H275Z" fill="#edf2f0"/>
<path d="M275,215H325V232H275Z" fill="#d5c796"/>
<rect x="445" y="171" width="105" height="66" rx="5" fill="#fffdf6" stroke="#33483e" stroke-width="3"/>
<circle class="mark" cx="459" cy="187" r="4"/><circle class="mark" cx="459" cy="204" r="4"/><circle class="mark" cx="459" cy="221" r="4"/>
<path class="shape" d="M473,187H535M473,204H526M473,221H535"/>
${text(18, 315, ['Guide, not a survey or census.'])}`,
);

const lapita = svg(
  'Small marks make a pattern',
  'Original modern action guide. A hypothetical tool has three rectangular teeth. One downward press leaves three short marks in a generic band; repeating the action produces three groups of three marks. This is not a copied Lapita motif, the pattern of a photographed cast, an archaeologically recovered tool or an ancient vessel reconstruction. Tool, band and marks are illustrative rather than measured.',
  `${text(18, 41, ['Small marks make a pattern'], { head: true })}
${panel(18)}${panel(215, '#eadfb5')}${panel(412)}
${text(103, 119, ['Tool'], { center: true })}
${text(300, 119, ['Press'], { center: true })}
${text(497, 119, ['Repeat'], { center: true })}
${arrow(194, 209, 190)}${arrow(391, 406, 190)}
<path d="M76,157H130V173H120V202H110V173H98V202H88V173H76V202H66V157Z" fill="#d5c796" stroke="#33483e" stroke-width="3" stroke-linejoin="round"/>
<path class="shape" d="M300,147V169m-7,-7l7,7l7,-7"/>
<rect x="243" y="180" width="114" height="48" rx="5" fill="#fffdf6" stroke="#33483e" stroke-width="3"/>
<rect class="mark" x="286" y="192" width="6" height="24" rx="2"/><rect class="mark" x="297" y="192" width="6" height="24" rx="2"/><rect class="mark" x="308" y="192" width="6" height="24" rx="2"/>
<rect x="425" y="180" width="144" height="48" rx="5" fill="#fffdf6" stroke="#33483e" stroke-width="3"/>
<rect class="mark" x="433" y="192" width="6" height="24" rx="2"/><rect class="mark" x="444" y="192" width="6" height="24" rx="2"/><rect class="mark" x="455" y="192" width="6" height="24" rx="2"/>
<rect class="mark" x="482" y="192" width="6" height="24" rx="2"/><rect class="mark" x="493" y="192" width="6" height="24" rx="2"/><rect class="mark" x="504" y="192" width="6" height="24" rx="2"/>
<rect class="mark" x="531" y="192" width="6" height="24" rx="2"/><rect class="mark" x="542" y="192" width="6" height="24" rx="2"/><rect class="mark" x="553" y="192" width="6" height="24" rx="2"/>
${text(18, 301, ['Hypothetical tool and pattern.'])}
${text(18, 343, ['Modern guide, not a vessel.'])}`,
);

for (const [id, content] of [
  ['olmec-dating-guide', olmec],
  ['lapita-stamp-guide', lapita],
]) {
  await fs.writeFile(`public/atlas/media/${id}.svg`, content);
  await sharp(Buffer.from(content))
    .resize({ width: 300 })
    .webp({ quality: 86 })
    .toFile(`public/atlas/media/${id}-thumb.webp`);
}
