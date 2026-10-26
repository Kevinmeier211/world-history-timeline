import { PRINT_SHEETS, type PrintSheetId } from '../../src/print/sheet.ts';

/** CSS pixels per inch. Playwright viewports use this so `in` maps 1:1. */
export const CSS_PX_PER_IN = 96;
export const PT_PER_IN = 72;
/** pdfinfo may round a page edge by a fraction of a point. */
export const PAGE_SIZE_TOLERANCE_PT = 1;

export interface PdfJob {
  id: PrintSheetId;
  file: string;
}

/** Trim sheets. Bleed is a later job, not one of these three. */
export const PDF_JOBS: readonly PdfJob[] = [
  { id: 'letter', file: 'chronos-letter.pdf' },
  { id: 'tabloid', file: 'chronos-tabloid.pdf' },
  { id: 'poster', file: 'chronos-poster.pdf' },
];

export function selectJobs(names: readonly string[]): readonly PdfJob[] {
  if (names.length === 0) return PDF_JOBS;
  return names.map((name) => {
    const job = PDF_JOBS.find((item) => item.id === name);
    if (!job) throw new Error(`unknown pdf job ${name}`);
    return job;
  });
}

export function printPath(id: PrintSheetId): string {
  return `/?print=1&size=${id}`;
}

export function paperInches(id: PrintSheetId): { widthIn: number; heightIn: number } {
  const sheet = PRINT_SHEETS[id];
  return { widthIn: sheet.widthIn, heightIn: sheet.heightIn };
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
