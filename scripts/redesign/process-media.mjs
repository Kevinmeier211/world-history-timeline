/* global fetch, Buffer, console */
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const specs = JSON.parse(
  await fs.readFile('scripts/redesign/media-specs.json', 'utf8'),
);
const media = [],
  sources = [],
  receipts = [];
await fs.mkdir('public/atlas/media', { recursive: true });
await fs.mkdir('media-cache/redesign', { recursive: true });
for (const s of specs) {
  const obj = JSON.parse(
    await fs.readFile(`output/redesign/research/met-${s.id}.json`, 'utf8'),
  );
  if (!obj.isPublicDomain || !obj.primaryImage)
    throw Error(`Rights or image missing ${s.id}`);
  const urls = [obj.primaryImage, ...obj.additionalImages.slice(0, s.views ?? 0)];
  let primary;
  const additional = [];
  for (let n = 0; n < urls.length; n++) {
    const original = `media-cache/redesign/${s.id}-${n}.jpg`;
    let buf;
    try {
      buf = await fs.readFile(original);
    } catch {
      const r = await fetch(urls[n]);
      if (!r.ok) throw Error(`${s.id} image ${r.status}`);
      buf = Buffer.from(await r.arrayBuffer());
      await fs.writeFile(original, buf);
    }
    const local = `/atlas/media/${s.id}-${n}.webp`;
    const info = await sharp(buf)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 86 })
      .toFile(`public${local}`);
    if (!n) {
      primary = { image: local, width: info.width, height: info.height };
      await sharp(buf)
        .rotate()
        .resize({ width: 480, height: 480, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(`public/atlas/media/${s.id}-thumb.webp`);
    } else additional.push(local);
    receipts.push({
      id: s.id,
      view: n,
      url: urls[n],
      downloaded: '2026-10-26',
      bytes: buf.length,
      sha256: crypto.createHash('sha256').update(buf).digest('hex'),
      derivative: local,
      derivativeBytes: info.size,
      rights: 'Public domain / Met Open Access CC0',
      objectPage: obj.objectURL,
    });
  }
  const date = {
    start: obj.objectBeginDate === 0 ? null : obj.objectBeginDate,
    end: obj.objectEndDate === 0 ? null : obj.objectEndDate,
    label: obj.objectDate,
    precision: 'range',
    note: 'Catalogue wording retained. Numeric bounds are museum search envelopes, not exact production dates.',
  };
  media.push({
    id: `met-${s.id}`,
    title: obj.title,
    subject: s.subject,
    source: `met-${s.id}`,
    accession: obj.accessionNumber,
    creator: obj.artistDisplayName || 'Maker not recorded',
    date: s.dateOverride ?? date,
    place: s.place,
    material: obj.medium,
    ...primary,
    thumbnail: `/atlas/media/${s.id}-thumb.webp`,
    alt: s.alt,
    additionalImageAlts: s.additionalImageAlts,
    caption: s.caption,
    notice: s.notice,
    rights: 'Public domain; The Met Open Access (CC0)',
    credit: `The Metropolitan Museum of Art. ${obj.creditLine}. ${obj.accessionNumber}.`,
    sourceImage: obj.primaryImage,
    depiction: 'object photograph',
    representedDate: s.representedDate,
    relevance: s.relevance,
    datingNote: s.datingNote,
    additionalImages: additional,
  });
  sources.push({
    id: `met-${s.id}`,
    title: obj.title,
    institution: 'The Metropolitan Museum of Art',
    url: obj.objectURL,
    type: 'catalogue',
    accessed: '2026-10-26',
    scope: `Accession ${obj.accessionNumber}; Description, Artwork Details, provenance and Public Domain image statement.`,
  });
  console.log(`${s.id} ${obj.title}`);
}
await fs.writeFile(
  'scripts/redesign/media-data.json',
  JSON.stringify({ media, sources }, null, 2),
);
await fs.writeFile(
  'output/redesign/research/media-receipts.json',
  JSON.stringify(receipts, null, 2),
);
