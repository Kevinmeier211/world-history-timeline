import { readFileSync, writeFileSync } from 'node:fs';

import { mediaSrcFileSchema, type MediaSrc } from '../../src/data/schema/mediaSrc.ts';
import type { PlanHit } from './plan.ts';

function slug(accession: string): string {
  const body = accession
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `cma_${body}`;
}

/**
 * Copy a kept payload into the source list.
 * Depiction stays `later` because the object page was not opened.
 */
export function curateHit(hit: PlanHit): MediaSrc | undefined {
  if (!hit.kept || hit.license !== 'CC0' || !hit.licenseUrl) return undefined;
  if (!hit.accession || !hit.creator || !hit.sourceUrl || !hit.title) return undefined;
  const id = slug(hit.accession);
  if (!/^[a-z][a-z0-9_]*$/.test(id)) return undefined;
  const date = hit.date || 'date not in the payload';
  const culture = hit.culture || 'culture not in the payload';
  return {
    id,
    subject: hit.title,
    sourceUrl: hit.sourceUrl,
    credit: {
      creator: hit.creator,
      title: hit.title,
      date,
      institution: hit.institution,
      accession: hit.accession,
    },
    license: 'CC0',
    licenseUrl: hit.licenseUrl,
    licenseApproved: false,
    alt: hit.title,
    caption: `${hit.title}, ${culture}, ${date}, ${hit.institution}. The object page was not opened.`,
    depiction: 'later',
    status: 'candidate',
  };
}

export function curateHits(hits: readonly PlanHit[]): MediaSrc[] {
  const seen = new Set<string>();
  const rows: MediaSrc[] = [];
  for (const hit of hits) {
    const row = curateHit(hit);
    if (!row || seen.has(row.id)) continue;
    seen.add(row.id);
    rows.push(row);
  }
  return rows;
}

const invoked =
  process.argv[1]?.endsWith('curate.ts') || process.argv[1]?.endsWith('curate.js');
if (invoked) {
  const hits = JSON.parse(
    readFileSync('docs/media-candidates.json', 'utf8'),
  ) as PlanHit[];
  const rows = curateHits(hits);
  const parsed = mediaSrcFileSchema.parse(rows);
  writeFileSync('src/data/media-src.json', `${JSON.stringify(parsed, null, 2)}\n`);
  console.log(`media-src: ${parsed.length} curated rows. Target 120 was not met.`);
}
