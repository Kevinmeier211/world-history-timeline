/* global fetch, Buffer, console, AbortSignal */
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { format } from 'prettier';
import process from 'node:process';
const batch = process.argv[2] ?? 'expansion';
if (!['expansion', 'northern', 'woodlands'].includes(batch))
  throw Error('Unknown media batch');
const folder = batch === 'expansion' ? 'expansion' : `${batch}-expansion`;
const specs = JSON.parse(
  await fs.readFile(`scripts/redesign/${batch}-media-specs.json`, 'utf8'),
);
const media = [],
  sources = [],
  receipts = [];
await fs.mkdir(`media-cache/redesign/${folder}`, { recursive: true });
await fs.mkdir('public/atlas/media', { recursive: true });
for (const s of specs) {
  let obj;
  if (s.met) {
    const record =
      batch === 'northern'
        ? `output/redesign/${folder}/research/met-${s.met}.json`
        : `output/redesign/research/met-${s.met}.json`;
    obj = JSON.parse(await fs.readFile(record, 'utf8'));
    if (!obj.isPublicDomain || !obj.primaryImage)
      throw Error(`Uncleared media ${s.met}`);
  }
  const urls = obj
    ? [obj.primaryImage, ...obj.additionalImages.slice(0, s.views ?? 0)]
    : [s.url];
  const images = [];
  let primary;
  for (let i = 0; i < urls.length; i++) {
    const urlKey = crypto
      .createHash('sha256')
      .update(urls[i])
      .digest('hex')
      .slice(0, 12);
    const original = `media-cache/redesign/${folder}/${s.key}-${i}-${urlKey}.img`;
    let bytes;
    try {
      bytes = await fs.readFile(original);
    } catch {
      if (s.localImage && i === 0) bytes = await fs.readFile(s.localImage);
      else {
        const r = await fetch(urls[i], { signal: AbortSignal.timeout(45000) });
        if (!r.ok) throw Error(`${s.key} ${r.status}`);
        bytes = Buffer.from(await r.arrayBuffer());
      }
      await fs.writeFile(original, bytes);
    }
    const image = `/atlas/media/${s.key}-${i}.webp`;
    const info = await sharp(bytes)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(`public${image}`);
    images.push(image);
    if (i === 0) {
      primary = { image, width: info.width, height: info.height };
      await sharp(bytes)
        .rotate()
        .resize({ width: 480, height: 480, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(`public/atlas/media/${s.key}-thumb.webp`);
    }
    receipts.push({
      id: s.key,
      url: urls[i],
      downloaded: '2026-10-27',
      bytes: bytes.length,
      sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      derivative: image,
      rights: s.rights ?? 'Public domain / Met Open Access CC0',
      source: s.source,
      extraction: s.extraction,
      documentSha256: s.documentSha256,
    });
  }
  let date = s.date;
  if (obj) {
    const bounds = s.dateOverride ?? [
      obj.objectBeginDate || null,
      obj.objectEndDate || null,
    ];
    date = {
      start: bounds[0],
      end: bounds[1],
      label: obj.objectDate,
      precision: 'range',
      note:
        s.dateNote ??
        (s.dateOverride
          ? 'Visible catalogue wording used instead of the API’s wider search envelope. Approximate production range, not exact manufacture dates.'
          : 'Catalogue production range; not the date when every represented event occurred.'),
    };
    sources.push({
      id: s.source,
      title: obj.title,
      institution: 'The Metropolitan Museum of Art',
      url: obj.objectURL,
      type: 'catalogue',
      accessed: '2026-10-27',
      scope: `Accession ${obj.accessionNumber}; description, Artwork Details, attribution and Public Domain image statement consulted.`,
    });
  }
  media.push({
    id: s.key,
    subject: s.subject,
    source: s.source,
    title: s.title ?? obj.title,
    accession: s.accession ?? obj.accessionNumber,
    creator: s.creator ?? (obj.artistDisplayName || 'Maker not recorded'),
    date,
    representedDate: s.representedDate,
    place: s.place,
    material: s.material ?? obj.medium,
    ...primary,
    thumbnail: `/atlas/media/${s.key}-thumb.webp`,
    additionalImages: images.slice(1),
    alt: s.alt,
    additionalImageAlts: s.additionalImageAlts,
    caption: s.caption,
    printCaption: s.printCaption,
    printCredit: s.printCredit,
    notice: s.notice,
    relevance: s.relevance,
    licenseUrl: s.licenseUrl,
    rights: s.rights ?? 'Public domain; The Met Open Access (CC0)',
    credit:
      s.credit ??
      `The Metropolitan Museum of Art. ${obj.creditLine}. ${obj.accessionNumber}.`,
    sourceImage: urls[0],
    depiction: s.depiction ?? 'object photograph',
    datingNote:
      s.dateNote ??
      (s.dateOverride
        ? 'Museum API envelopes are wider; the visible catalogue dates are retained.'
        : s.date?.note),
  });
  console.log(s.key, primary.width, primary.height);
}
await fs.writeFile(
  `scripts/redesign/${batch}-media.json`,
  await format(JSON.stringify({ media, sources }), { parser: 'json' }),
);
await fs.writeFile(
  `output/redesign/${folder}/research/media-receipts.json`,
  JSON.stringify(receipts, null, 2),
);
