import type { MediaSrc } from './schema/mediaSrc.ts';

export interface ShippedCredit {
  id: string;
  creator: string;
  title: string;
  institution: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

/** Credits for files that were actually processed. An empty list ships no names. */
export function shippedCredits(
  images: readonly { id: string }[],
  sources: readonly MediaSrc[],
): ShippedCredit[] {
  const byId = new Map(sources.map((source) => [source.id, source]));
  const rows: ShippedCredit[] = [];
  for (const image of images) {
    const source = byId.get(image.id);
    if (!source) continue;
    rows.push({
      id: source.id,
      creator: source.credit.creator,
      title: source.credit.title,
      institution: source.credit.institution,
      license: source.license,
      licenseUrl: source.licenseUrl,
      sourceUrl: source.sourceUrl,
    });
  }
  return rows;
}

export function creditsLines(rows: readonly ShippedCredit[]): string[] {
  if (rows.length === 0) {
    return [
      'No image files are shipped.',
      'Fetch is queued-gated while downloads are off.',
      'Pictograms stand in for plates.',
    ];
  }
  return rows.map(
    (row) =>
      `${row.title}. ${row.creator}. ${row.institution}. ${row.license}. ${row.sourceUrl}`,
  );
}

export function colophonText(rows: readonly ShippedCredit[]): string {
  return ['Chronos Atlas', ...creditsLines(rows), ''].join('\n');
}
