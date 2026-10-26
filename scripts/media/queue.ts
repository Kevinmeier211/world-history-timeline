import type { MediaSrc } from '../../src/data/schema/mediaSrc.ts';

/** Mark the first rows queued-gated. Later rows keep the status they already have. */
export function gateFirst(rows: readonly MediaSrc[], count: number): MediaSrc[] {
  return rows.map((row, index) =>
    index < count ? { ...row, status: 'queued-gated' } : { ...row },
  );
}

/**
 * List the queued rows with the URL and accession already on the row.
 * The chart keeps pictograms. This file does not add a source.
 */
export function queueMarkdown(rows: readonly MediaSrc[], count = 60): string {
  const gated = rows.slice(0, count);
  const lines = [
    '# Media queue',
    '',
    'Fetch is queued-gated. `ALLOW_MEDIA_DOWNLOAD` is false. No image file was downloaded.',
    `The first ${count} source rows are \`queued-gated\`. Plates on the chart stay pictograms.`,
    'The URL and accession on each line are the ones already stored on that row.',
    '',
    '| id | accession | source | status |',
    '| --- | --- | --- | --- |',
    ...gated.map((row) => {
      const accession = row.credit.accession ?? '';
      return `| ${row.id} | ${accession} | ${row.sourceUrl} | queued-gated |`;
    }),
    '',
  ];
  return lines.join('\n');
}
