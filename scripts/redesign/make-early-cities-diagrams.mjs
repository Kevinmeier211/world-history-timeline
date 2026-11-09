import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import sharp from 'sharp';
const dir = 'public/atlas/media';
const text = (x, y, lines, cls = '') =>
  `<text x="${x}" y="${y}" class="${cls}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? 40 : 0}">${line}</tspan>`).join('')}</text>`;
const box = (x, y, w, h, dashed = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${dashed ? '#fff9ed' : '#edf2f0'}" stroke="#33483e" stroke-width="3" ${dashed ? 'stroke-dasharray="10 7"' : ''}/>`;
const frame = (title, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="780" viewBox="0 0 600 780"><title>${title}</title><style>text{font-family:Arial,sans-serif;font-size:30px;fill:#182d24}.title{font-size:35px;font-weight:700}.head{font-weight:700}.small{font-size:30px}.note{font-size:26px}</style><rect width="600" height="780" fill="#fffdf6"/>${body}</svg>`;
const diagrams = {
  'uruk-accounting-diagram': frame(
    'An account selects information',
    text(30, 52, ['An account selects', 'information'], 'title') +
      box(30, 125, 540, 120) +
      text(52, 170, ['1 · Category', 'What is being recorded?'], 'head') +
      text(283, 290, ['+'], 'head') +
      box(30, 315, 540, 120) +
      text(52, 360, ['2 · Quantity', 'How much is recorded?'], 'head') +
      box(30, 470, 540, 120) +
      text(
        52,
        515,
        ['3 · Durable record', 'Information survives the moment.'],
        'head',
      ) +
      text(
        30,
        635,
        ['What might be left out?', 'People, preparation, decisions.'],
        'head',
      ) +
      text(
        30,
        720,
        ['Concept guide, not a translation.', 'See the actual tablet for its marks.'],
        'note',
      ),
  ),
  'dholavira-water-diagram': frame(
    'Dholavira water components',
    text(30, 42, ['Dholavira', 'Water and urban space'], 'title') +
      text(
        30,
        125,
        ['North ↑     East →', 'Schematic: no scale or flow arrows.'],
        'note',
      ) +
      box(30, 200, 270, 165) +
      text(48, 245, ['CASTLE', 'Well · C6', 'Drain · C7'], 'small') +
      box(330, 200, 240, 165) +
      text(350, 245, ['EAST', 'RESERVOIR'], 'head') +
      box(30, 405, 540, 85) +
      text(50, 455, ['SOUTH RESERVOIRS'], 'head') +
      box(30, 530, 540, 135, true) +
      text(
        50,
        568,
        [
          'East of the East Reservoir:',
          'GPR research area',
          'Unconfirmed water structures.',
        ],
        'small',
      ) +
      text(
        30,
        710,
        ['Solid: recorded components.', 'Dashed: proposals need excavation.'],
        'note',
      ),
  ),
  'liangzhu-water-diagram': frame(
    'Liangzhu materials water production',
    text(30, 42, ['Liangzhu', 'Work across a landscape'], 'title') +
      box(30, 120, 540, 115) +
      text(52, 164, ['BUILD', 'Grass-wrapped clay in dams.'], 'head') +
      box(30, 270, 540, 115) +
      text(52, 314, ['MANAGE WATER', 'Storage · dams · channels.'], 'head') +
      box(30, 420, 540, 145) +
      text(
        52,
        464,
        ['PRODUCE AND MOVE', 'Rice cultivation; movement of', 'people and materials.'],
        'head',
      ) +
      text(
        30,
        622,
        ['Who carried the materials?', 'Who decided how to share benefits?'],
        'note',
      ) +
      text(
        30,
        710,
        ['Conceptual relationships, not a canal', 'map or a reconstructed workday.'],
        'note',
      ),
  ),
};
await fs.mkdir(dir, { recursive: true });
for (const [name, svg] of Object.entries(diagrams)) {
  await fs.writeFile(`${dir}/${name}.svg`, svg);
  await sharp(Buffer.from(svg))
    .resize({ width: 300 })
    .webp({ quality: 90 })
    .toFile(`${dir}/${name}-thumb.webp`);
}
process.stdout.write('Wrote three original SVG diagrams and their thumbnails.\n');
