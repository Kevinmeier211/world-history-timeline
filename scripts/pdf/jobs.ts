import { paperSizeIn, PRINT_SHEETS, type PrintSheetId } from '../../src/print/sheet.ts';

/** Chart and reference PDFs. Gitignored. */
export const DIST_PRINT = 'dist-print';

/** CSS pixels per inch. Playwright viewports use this so `in` maps 1:1. */
export const CSS_PX_PER_IN = 96;
export const PT_PER_IN = 72;
/** pdfinfo may round a page edge by a fraction of a point. */
export const PAGE_SIZE_TOLERANCE_PT = 1;

export interface PdfJob {
  key: string;
  id: PrintSheetId;
  file: string;
  bleed: boolean;
}

/** Trim sheets. An empty export still prints these three. */
export const PDF_JOBS: readonly PdfJob[] = [
  { key: 'letter', id: 'letter', file: 'chronos-letter.pdf', bleed: false },
  { key: 'tabloid', id: 'tabloid', file: 'chronos-tabloid.pdf', bleed: false },
  { key: 'poster', id: 'poster', file: 'chronos-poster.pdf', bleed: false },
];

/** 24×36 plus 0.125 in on every side. Crop marks are drawn by the print route. */
export const POSTER_BLEED_JOB: PdfJob = {
  key: 'poster-bleed',
  id: 'poster',
  file: 'chronos-poster-bleed.pdf',
  bleed: true,
};

const JOBS = new Map<string, PdfJob>(
  [...PDF_JOBS, POSTER_BLEED_JOB].map((job) => [job.key, job]),
);

export function selectJobs(names: readonly string[]): readonly PdfJob[] {
  if (names.length === 0) return PDF_JOBS;
  return names.map((name) => {
    const job = JOBS.get(name);
    if (!job) throw new Error(`unknown pdf job ${name}`);
    return job;
  });
}

export function printPath(id: PrintSheetId, bleed = false): string {
  const params = new URLSearchParams({ print: '1', size: id });
  if (bleed) params.set('bleed', '1');
  return `/?${params.toString()}`;
}

export function paperInches(
  id: PrintSheetId,
  bleed = false,
): { widthIn: number; heightIn: number } {
  return paperSizeIn(PRINT_SHEETS[id], bleed);
}

export function viewportPx(
  widthIn: number,
  heightIn: number,
): { width: number; height: number } {
  return {
    width: Math.round(widthIn * CSS_PX_PER_IN),
    height: Math.round(heightIn * CSS_PX_PER_IN),
  };
}

export function expectedPoints(
  widthIn: number,
  heightIn: number,
): { widthPt: number; heightPt: number } {
  return { widthPt: widthIn * PT_PER_IN, heightPt: heightIn * PT_PER_IN };
}

export function boxNear(
  measured: { width: number; height: number },
  widthIn: number,
  heightIn: number,
  tolerancePx = 2,
): boolean {
  const expected = viewportPx(widthIn, heightIn);
  return (
    Math.abs(measured.width - expected.width) <= tolerancePx &&
    Math.abs(measured.height - expected.height) <= tolerancePx
  );
}
