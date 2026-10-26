import { writeFileSync } from 'node:fs';

/** Appendix B callout seeds, used only as search text. */
export const PLAN_SEEDS = [
  'cuneiform',
  'pyramid',
  'oracle bone',
  'Olmec',
  'Phoenician',
  'terracotta army',
  'Parthenon',
  'astrolabe',
  'printing press',
  'steam engine',
  'Hagia Sophia',
  'manuscript',
] as const;

/** Deed for a payload that already says CC0. Not used for any other flag. */
export const CC0_DEED = 'https://creativecommons.org/publicdomain/zero/1.0/';

export interface PlanHit {
  institution: string;
  sourceUrl: string;
  creator: string;
  title: string;
  date: string;
  accession: string;
  culture: string;
  license: 'CC0' | 'PD';
  /** Set only when the payload named CC0. */
  licenseUrl?: string;
  kept: boolean;
  reason: string;
}

interface ClevelandCreator {
  description?: string;
}

interface ClevelandArtwork {
  title?: string;
  creation_date?: string;
  accession_number?: string;
  url?: string;
  share_license_status?: string;
  creators?: ClevelandCreator[];
  culture?: string[];
}

interface MetObject {
  title?: string;
  artistDisplayName?: string;
  objectDate?: string;
  accessionNumber?: string;
  objectURL?: string;
  isPublicDomain?: boolean;
  repository?: string;
  culture?: string;
}

function text(value: string | undefined): string {
  return (value ?? '').trim();
}

/** A Cleveland row is kept only when the payload says CC0 and names a creator. */
export function fromCleveland(item: ClevelandArtwork): PlanHit | undefined {
  const title = text(item.title);
  const sourceUrl = text(item.url);
  if (!title || !sourceUrl) return undefined;
  const creator = text(
    item.creators?.find((row) => text(row.description))?.description,
  );
  const license = text(item.share_license_status);
  const kept = license === 'CC0' && creator.length > 0;
  let reason = 'CC0 and a creator are both in the payload';
  if (license !== 'CC0') reason = `license field is "${license || 'empty'}"`;
  else if (!creator) reason = 'no creator in the payload';
  return {
    institution: 'Cleveland Museum of Art',
    sourceUrl,
    creator,
    title,
    date: text(item.creation_date),
    accession: text(item.accession_number),
    culture: (item.culture ?? [])
      .map((part) => text(part))
      .filter(Boolean)
      .join('; '),
    license: 'CC0',
    licenseUrl: license === 'CC0' ? CC0_DEED : undefined,
    kept,
    reason,
  };
}

/** A Met row is recorded from isPublicDomain and is not given a license URL. */
export function fromMet(item: MetObject): PlanHit | undefined {
  const title = text(item.title);
  const sourceUrl = text(item.objectURL);
  if (!title || !sourceUrl) return undefined;
  const creator = text(item.artistDisplayName);
  const pd = item.isPublicDomain === true;
  const kept = false;
  let reason = 'public-domain flag is set, and the payload has no license URL';
  if (!pd) reason = 'isPublicDomain is not true';
  else if (!creator)
    reason = 'public-domain flag is set, no creator, and no license URL';
  return {
    institution: text(item.repository) || 'Metropolitan Museum of Art',
    sourceUrl,
    creator,
    title,
    date: text(item.objectDate),
    accession: text(item.accessionNumber),
    culture: text(item.culture),
    license: 'PD',
    kept,
    reason,
  };
}

export function curationMarkdown(hits: readonly PlanHit[]): string {
  const kept = hits.filter((hit) => hit.kept);
  const lines = [
    '# Media curation',
    '',
    'Dry run. No image file was downloaded. A row is kept only when the payload names CC0 and a creator. The Met public-domain flag has no license URL in the payload, so those rows stay out of `media-src.json`. `licenseUrl` on a kept row is the Creative Commons CC0 deed for the license string the payload already used.',
    '',
    `Kept: ${kept.length}. Seen: ${hits.length}.`,
    '',
    '## Kept',
    '',
  ];
  if (kept.length === 0) lines.push('None.', '');
  for (const hit of kept) {
    lines.push(
      `- ${hit.title} (${hit.date || 'date not in payload'}). ${hit.creator}. ${hit.culture || 'culture not in payload'}. ${hit.institution}, ${hit.accession || 'no accession'}. ${hit.license}. ${hit.sourceUrl}`,
    );
  }
  lines.push('', '## Not copied', '');
  const skipped = hits.filter((hit) => !hit.kept);
  if (skipped.length === 0) lines.push('None.', '');
  for (const hit of skipped) {
    lines.push(`- ${hit.institution}: ${hit.title || hit.sourceUrl}. ${hit.reason}.`);
  }
  lines.push('');
  return lines.join('\n');
}

async function readJson(url: string): Promise<unknown> {
  const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json() as Promise<unknown>;
}

async function clevelandSeed(seed: string): Promise<PlanHit[]> {
  const hits: PlanHit[] = [];
  for (const skip of [0, 20]) {
    const url = `https://openaccess-api.clevelandart.org/api/artworks/?cc0=1&limit=20&skip=${skip}&q=${encodeURIComponent(seed)}`;
    const body = (await readJson(url)) as { data?: ClevelandArtwork[] };
    for (const item of body.data ?? []) {
      const hit = fromCleveland(item);
      if (hit) hits.push(hit);
    }
  }
  return hits;
}

async function metSeed(seed: string): Promise<PlanHit[]> {
  const search = (await readJson(
    `https://collectionapi.metmuseum.org/public/collection/v1.1/search?hasImages=true&isPublicDomain=true&q=${encodeURIComponent(seed)}`,
  )) as { objectIDs?: number[] };
  const ids = (search.objectIDs ?? []).slice(0, 2);
  const hits: PlanHit[] = [];
  for (const id of ids) {
    const object = (await readJson(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
    )) as MetObject;
    const hit = fromMet(object);
    if (hit) hits.push(hit);
  }
  return hits;
}

export async function collectPlan(): Promise<PlanHit[]> {
  const hits: PlanHit[] = [];
  const seen = new Set<string>();
  for (const seed of PLAN_SEEDS) {
    const batch = [
      ...(await clevelandSeed(seed).catch(() => [] as PlanHit[])),
      ...(await metSeed(seed).catch(() => [] as PlanHit[])),
    ];
    for (const hit of batch) {
      if (seen.has(hit.sourceUrl)) continue;
      seen.add(hit.sourceUrl);
      hits.push(hit);
    }
  }
  return hits;
}

const invoked =
  process.argv[1]?.endsWith('plan.ts') || process.argv[1]?.endsWith('plan.js');
if (invoked) {
  const hits = await collectPlan();
  const kept = hits.filter((hit) => hit.kept);
  writeFileSync('docs/media-curation.md', curationMarkdown(hits));
  writeFileSync('docs/media-candidates.json', `${JSON.stringify(kept, null, 2)}\n`);
  console.log(
    `media:plan: ${kept.length} kept, ${hits.length} seen. No files downloaded.`,
  );
}
