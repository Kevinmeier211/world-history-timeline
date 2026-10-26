import { describe, expect, it } from 'vitest';

import { imageProblems, parsePdfImages } from './images.ts';
import {
  MIN_STROKE_PT,
  parsePdfObjects,
  strokeHits,
  thinnestStroke,
  type PdfObject,
} from './strokes.ts';

function obj(
  id: number,
  dict: string,
  stream: string | null = null,
): [number, PdfObject] {
  return [id, { id, dict, stream }];
}

describe('pdf strokes and images', () => {
  it('scales a stroke by the CTM and skips a fill', () => {
    const objects = new Map<number, PdfObject>([
      obj(1, '1 0 obj\n<< /Type /Page /Contents 2 0 R >>\n'),
      obj(2, '', '2 0 0 2 0 0 cm\n0.2 w\n0 0 10 10 re\nS\n1 w\n0 0 4 4 re\nf\n'),
    ]);
    const hits = strokeHits(objects);
    expect(hits).toHaveLength(1);
    expect(hits[0]?.widthPt).toBeCloseTo(0.4);
    expect(thinnestStroke(hits)).toBeCloseTo(0.4);
    expect(thinnestStroke([])).toBeNull();
  });

  it('reads an ExtGState width through a form placed on the page', () => {
    const objects = new Map<number, PdfObject>([
      obj(
        1,
        '<< /Type /Page /Contents 2 0 R /Resources << /XObject << /Fm 4 0 R >> >> >>',
      ),
      obj(2, '', '0.5 0 0 0.5 0 0 cm\n/Fm Do\n'),
      obj(3, '<< /LW 1 >>'),
      obj(
        4,
        '<< /Subtype /Form /Matrix [2 0 0 2 0 0] /Resources << /ExtGState << /Gs 3 0 R >> >> >>',
        '/Gs gs\n0 0 10 10 re\nS\n',
      ),
    ]);
    const hits = strokeHits(objects);
    expect(hits).toHaveLength(1);
    expect(hits[0]?.widthPt).toBeCloseTo(1);
    expect(MIN_STROKE_PT).toBe(0.25);
  });

  it('inflates a tiny uncompressed page object', () => {
    const pdf = Buffer.from(
      '1 0 obj\n<< /Type /Page /Contents 2 0 R >>\nendobj\n2 0 obj\n<< /Length 4 >>\nstream\n1 w\nendstream\nendobj\n',
      'latin1',
    );
    const objects = parsePdfObjects(pdf);
    expect(objects.get(2)?.stream).toBe('1 w');
    expect(strokeHits(objects)).toEqual([]);
  });

  it('reads pdfimages rows and ignores a header with no images', () => {
    const header =
      'page   num  type   width height color comp bpc  enc interp  object ID x-ppi y-ppi size ratio';
    expect(parsePdfImages(`${header}\n${'-'.repeat(20)}\n`)).toEqual([]);
    const line = ' '.repeat(header.indexOf('x-ppi')) + '150   300';
    const rows = parsePdfImages(`${header}\n${line}\n`);
    expect(rows).toEqual([{ xPpi: 150, yPpi: 300 }]);
    expect(imageProblems(rows, 300)).toEqual(['image 150 x 300 ppi is below 300']);
    expect(imageProblems([], 300)).toEqual([]);
  });
});
