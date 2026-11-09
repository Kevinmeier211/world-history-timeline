import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import process from 'node:process';
import sharp from 'sharp';
const dir = 'public/atlas/media';
const text = (x, y, lines, cls = '') =>
  `<text x="${x}" y="${y}" class="${cls}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? 40 : 0}">${line}</tspan>`).join('')}</text>`;
const box = (y, h, dashed = false) =>
  `<rect x="30" y="${y}" width="540" height="${h}" rx="10" fill="${dashed ? '#fff9ed' : '#edf2f0'}" stroke="#33483e" stroke-width="3" ${dashed ? 'stroke-dasharray="10 7"' : ''}/>`;
const frame = (title, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="780" viewBox="0 0 600 780"><title>${title}</title><style>text{font-family:Arial,sans-serif;font-size:30px;fill:#182d24}.title{font-size:35px;font-weight:700}.head{font-weight:700}.note{font-size:26px}</style><rect width="600" height="780" fill="#fffdf6"/>${body}</svg>`;
const diagrams = {
  'hattusha-evidence-diagram': frame(
    'Hattusha evidence and time',
    text(30, 42, ['Hattusha', 'Keep the clocks apart'], 'title') +
      box(120, 150) +
      text(
        50,
        164,
        ['CAPITAL ORIENTATION', 'c. 1650–1180 BCE', 'Buildings have different phases.'],
        'head',
      ) +
      box(290, 155) +
      text(
        50,
        334,
        [
          'GORDION TIMBERS',
          'Drought: c. 1198–1196 BCE',
          'Dating uncertainty: ±3 years.',
        ],
        'head',
      ) +
      box(485, 155, true) +
      text(
        50,
        529,
        [
          'POLITICAL EXPLANATION',
          'Which institutions withdrew?',
          'Direct causation unproved.',
        ],
        'head',
      ) +
      text(
        30,
        685,
        [
          'The proxy is not a rainfall gauge',
          'at the capital. No climate values',
          'or automatic causal arrow drawn.',
        ],
        'note',
      ),
  ),
  'uluburun-evidence-diagram': frame(
    'Uluburun evidence categories',
    text(30, 42, ['Uluburun', 'Different levels of evidence'], 'title') +
      box(120, 110) +
      text(50, 164, ['FINDSPOT: OFF KAŞ', 'Wreck c. 1320 BCE ±15 years.'], 'head') +
      box(265, 110) +
      text(
        50,
        309,
        ['RECOVERED ASSOCIATION', 'Copper · tin · containers · hull.'],
        'head',
      ) +
      box(410, 155, true) +
      text(
        50,
        454,
        [
          'ORIGINS INFERRED',
          'Samples and comparisons.',
          'Tin sources remain contested.',
        ],
        'head',
      ) +
      box(575, 110) +
      text(50, 619, ['STILL UNRESOLVED', 'Itinerary · ownership · crew.'], 'head') +
      text(30, 735, ['Evidence guide, not a sailing route.'], 'note'),
  ),
  'shang-practices-diagram': frame(
    'Shang making and recording',
    text(30, 42, ['Shang', 'Making and recording'], 'title') +
      box(120, 200) +
      text(
        50,
        164,
        [
          'MAKING A HOLLOW VESSEL',
          'Model → clay mold sections',
          'Reassemble with an inner core.',
          'A cavity remains in the casting.',
        ],
        'head',
      ) +
      box(365, 200) +
      text(
        50,
        409,
        [
          'RECORDING DIVINATION',
          'Topic or charge',
          'Crack interpretation',
          'A possible recorded outcome',
        ],
        'head',
      ) +
      text(
        30,
        635,
        [
          'Different activities, different evidence.',
          'No ancient signs or translation',
          'of the selected bone are supplied.',
        ],
        'note',
      ) +
      text(30, 755, ['Modern guide; not a workshop plan.'], 'note'),
  ),
};
const receipts = [];
for (const [id, svg] of Object.entries(diagrams)) {
  await fs.writeFile(`${dir}/${id}.svg`, svg);
  await sharp(Buffer.from(svg))
    .resize({ width: 300 })
    .webp({ quality: 90 })
    .toFile(`${dir}/${id}-thumb.webp`);
}
const original = 'output/c2-networks-2026-10-28/research/met-44781-source.jpg';
const input = await fs.readFile(original);
for (const thumb of [false, true]) {
  const output = `${dir}/44781${thumb ? '-thumb' : '-0'}.webp`;
  const info = await sharp(input)
    .resize({
      width: thumb ? 480 : 1600,
      height: thumb ? 480 : 1600,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: thumb ? 82 : 92 })
    .toFile(output);
  receipts.push({
    source: original,
    sourceSha256: createHash('sha256').update(input).digest('hex'),
    output,
    width: info.width,
    height: info.height,
    bytes: info.size,
    sha256: createHash('sha256')
      .update(await fs.readFile(output))
      .digest('hex'),
  });
}
await fs.writeFile(
  'output/c2-networks-2026-10-28/media-processing.json',
  JSON.stringify(receipts, null, 2),
);
process.stdout.write(
  'Created three original diagrams and converted the inspected public-domain gong photograph.\n',
);
