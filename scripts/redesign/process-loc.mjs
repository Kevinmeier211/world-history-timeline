/* global fetch, Buffer, console, AbortSignal */
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const specs = [
  {
    id: '2018674890',
    key: 'loc-hine',
    subject: 'hine-labor',
    source: 'hine',
    title: 'A young spinner at Mollahan Mills',
    creator: 'Lewis Wickes Hine',
    year: 1908,
    label: '3 December 1908',
    precision: 'exact',
    dateNote: 'Hine’s caption card dates the photograph to 3 December 1908.',
    rights:
      'Library of Congress records no known restrictions on publication. The National Child Labor Committee placed no restrictions on use of the Hine material when donating the collection.',
    place: 'Newberry, South Carolina, United States',
    caption:
      'Hine’s photograph and caption record different kinds of evidence. The overseer’s denial is reported by Hine; hours and age cannot be read directly from the image.',
    alt: 'A young girl stands beside a long row of spinning machinery in a cotton mill.',
    notice: [
      'Compare the person’s height with the machinery.',
      'What can the image show without its caption?',
    ],
    relevance:
      'Work, reform and the different evidentiary roles of a photograph and its caption.',
    credit:
      'Lewis Wickes Hine. National Child Labor Committee collection, Library of Congress, Prints and Photographs Division. Hine 358; LC-DIG-nclc-01451.',
  },
  {
    id: '2002708941',
    key: 'loc-war-poster',
    subject: 'world-war-one',
    source: 'war-poster',
    title: 'Woman your country needs you!',
    creator: 'Maker not identified in the consulted catalogue',
    year: 1917,
    label: '[1917]',
    precision: 'approximate',
    dateNote:
      'The Library of Congress supplies the year in brackets. The imprint gives no exact date.',
    rights:
      'Library of Congress records no known restrictions on publication for this U.S. World War I poster.',
    place: 'United States',
    caption:
      'A 1917 wartime recruiting appeal. Persuasive language is evidence of the desired response, not proof of actual participation.',
    alt: 'Liberty presents a sword marked Service to a younger woman; a shield names State and National Councils of Defense.',
    notice: ['Who is being addressed?', 'Which response does the poster seek?'],
    relevance: 'Mass mobilization, persuasion and the limits of a public appeal.',
    credit:
      'Library of Congress, Prints and Photographs Division. LC-USZC4-9547; item 2002708941.',
  },
];
const media = [],
  receipts = [];
for (const s of specs) {
  const j = JSON.parse(await fs.readFile(`output/redesign/research/loc-${s.id}.json`));
  const i = j.item?.item ?? j.item;
  const rights = i.rights_information ?? i.rights_advisory;
  if (!rights?.startsWith('No known restrictions on publication'))
    throw Error(`Rights not verified: ${s.id}`);
  let url = i.service_medium;
  if (s.id === '2018674890')
    url = 'https://tile.loc.gov/storage-services/service/pnp/nclc/01400/01451v.jpg';
  const original = `media-cache/redesign/${s.key}.jpg`;
  let buf;
  try {
    buf = await fs.readFile(original);
  } catch {
    const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!r.ok) throw Error(r.status);
    buf = Buffer.from(await r.arrayBuffer());
    await fs.writeFile(original, buf);
  }
  const image = `/atlas/media/${s.key}.webp`,
    thumbnail = `/atlas/media/${s.key}-thumb.webp`;
  const info = await sharp(buf)
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(`public${image}`);
  await sharp(buf)
    .resize({ width: 480, height: 480, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`public${thumbnail}`);
  media.push({
    id: s.key,
    title: s.title,
    subject: s.subject,
    source: s.source,
    accession: s.id,
    creator: s.creator,
    date: {
      start: s.year,
      end: s.year,
      label: s.label,
      precision: s.precision,
      note: s.dateNote,
    },
    place: s.place,
    material:
      s.id === '2018674890'
        ? 'Digitized photographic print from a glass-negative photograph'
        : 'Digitized printed poster',
    image,
    thumbnail,
    width: info.width,
    height: info.height,
    alt: s.alt,
    caption: s.caption,
    notice: s.notice,
    rights: s.rights,
    credit: s.credit,
    sourceImage: url,
    depiction: 'contemporary document',
    relevance: s.relevance,
  });
  receipts.push({
    id: s.key,
    url,
    objectPage: `https://www.loc.gov/item/${s.id}/`,
    downloaded: '2026-10-26',
    rights,
    sha256: crypto.createHash('sha256').update(buf).digest('hex'),
    bytes: buf.length,
    derivative: image,
    derivativeBytes: info.size,
  });
}
await fs.writeFile('scripts/redesign/loc-media.json', JSON.stringify(media, null, 2));
await fs.writeFile(
  'output/redesign/research/loc-media-receipts.json',
  JSON.stringify(receipts, null, 2),
);
console.log('Prepared two catalogue-verified Library of Congress images.');
