import { imageProblems, parsePdfImages } from './images.ts';
import { fontProblems, pageSizeOk, parsePdfFonts, parsePdfInfo } from './parse.ts';
import {
  MIN_STROKE_PT,
  strokeHits,
  thinnestStroke,
  type PdfObject,
} from './strokes.ts';

export const MIN_IMAGE_PPI = 300;

export interface PdfAssessment {
  problems: string[];
  minStrokePt: number | null;
  strokeCount: number;
  imageCount: number;
  fontCount: number;
}

/** One PDF against §4.13 and §5.7. A missing tool result is a problem, not a pass. */
export function assessPdf(input: {
  infoText: string | null;
  fontText: string | null;
  imageText: string | null;
  objects: Map<number, PdfObject> | null;
  widthIn: number;
  heightIn: number;
  /** Letter is a reduction of the poster drawing, so its strokes are thinner. */
  enforceStroke: boolean;
}): PdfAssessment {
  const problems: string[] = [];
  let fontCount = 0;
  let imageCount = 0;
  let minStrokePt: number | null = null;
  let strokeCount = 0;

  if (input.infoText === null) {
    problems.push('pdfinfo did not run');
  } else {
    const box = parsePdfInfo(input.infoText);
    if (!box) problems.push('pdfinfo did not report a page size');
    else if (!pageSizeOk(box, input.widthIn, input.heightIn)) {
      problems.push(
        `page ${box.widthPt} x ${box.heightPt} pt, expected ${input.widthIn} x ${input.heightIn} in`,
      );
    }
  }

  if (input.fontText === null) {
    problems.push('pdffonts did not run');
  } else {
    const fonts = parsePdfFonts(input.fontText);
    fontCount = fonts.length;
    problems.push(...fontProblems(fonts));
  }

  if (input.imageText === null) {
    problems.push('pdfimages did not run');
  } else {
    const images = parsePdfImages(input.imageText);
    imageCount = images.length;
    problems.push(...imageProblems(images, MIN_IMAGE_PPI));
  }

  if (input.objects === null) {
    problems.push('stroke parser did not run');
  } else {
    const hits = strokeHits(input.objects);
    strokeCount = hits.length;
    minStrokePt = thinnestStroke(hits);
    if (hits.length === 0) problems.push('stroke parser found no strokes');
    else if (
      input.enforceStroke &&
      minStrokePt !== null &&
      minStrokePt < MIN_STROKE_PT - 1e-6
    ) {
      problems.push(
        `thinnest stroke ${minStrokePt.toFixed(3)} pt is below ${MIN_STROKE_PT} pt`,
      );
    }
  }

  return { problems, minStrokePt, strokeCount, imageCount, fontCount };
}
