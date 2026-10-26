import { describe, expect, it } from 'vitest';

import { assessPdf } from './assess.ts';
import type { PdfObject } from './strokes.ts';

const HEADER =
  'name                                 type              encoding         emb sub uni object ID';

function fontTable(embedded: 'yes' | 'no'): string {
  const embAt = HEADER.indexOf('emb');
  const typeAt = HEADER.indexOf('type');
  const chars = Array.from({ length: HEADER.length }, () => ' ');
  [...'TestFont'].forEach((char, index) => {
    chars[index] = char;
  });
  [...'TrueType'].forEach((char, index) => {
    chars[typeAt + index] = char;
  });
  [...embedded].forEach((char, index) => {
    chars[embAt + index] = char;
  });
  return `${HEADER}\n${chars.join('')}\n`;
}

const IMAGE_HEADER =
  'page   num  type   width height color comp bpc  enc interp  object ID x-ppi y-ppi size ratio';

function objectsWithStroke(width: number): Map<number, PdfObject> {
  return new Map<number, PdfObject>([
    [
      1,
      {
        id: 1,
        dict: '<< /Type /Page /Contents 2 0 R >>',
        stream: null,
      },
    ],
    [
      2,
      {
        id: 2,
        dict: '',
        stream: `${width} w\n0 0 10 10 re\nS\n`,
      },
    ],
  ]);
}

describe('pdf assessment', () => {
  const base = {
    infoText: 'Pages: 1\nPage size: 1728 x 2592 pts\n',
    fontText: fontTable('yes'),
    imageText: `${IMAGE_HEADER}\n${'-'.repeat(10)}\n`,
    objects: objectsWithStroke(0.5),
    widthIn: 24,
    heightIn: 36,
    enforceStroke: true,
  };

  it('passes a poster with embedded fonts, no images, and a 0.5 pt stroke', () => {
    const result = assessPdf(base);
    expect(result.problems).toEqual([]);
    expect(result.minStrokePt).toBeCloseTo(0.5);
    expect(result.imageCount).toBe(0);
    expect(result.fontCount).toBe(1);
  });

  it('fails a thin poster stroke, a missing font embed, a low-dpi image, and a wrong page', () => {
    const result = assessPdf({
      ...base,
      infoText: 'Pages: 1\nPage size: 612 x 792 pts\n',
      fontText: fontTable('no'),
      imageText: `${IMAGE_HEADER}\n${' '.repeat(IMAGE_HEADER.indexOf('x-ppi'))}150   150\n`,
      objects: objectsWithStroke(0.1),
    });
    expect(result.problems.join('\n')).toContain('612');
    expect(result.problems.join('\n')).toContain('emb=no');
    expect(result.problems.join('\n')).toContain('150');
    expect(result.problems.join('\n')).toContain('0.100 pt');
  });

  it('reports a thin letter stroke without failing the poster floor', () => {
    const result = assessPdf({
      ...base,
      infoText: 'Pages: 1\nPage size: 612 x 792 pts\n',
      widthIn: 8.5,
      heightIn: 11,
      enforceStroke: false,
      objects: objectsWithStroke(0.181),
    });
    expect(result.problems).toEqual([]);
    expect(result.minStrokePt).toBeCloseTo(0.181);
  });

  it('fails closed when a tool result or every stroke is missing', () => {
    const result = assessPdf({
      ...base,
      infoText: null,
      fontText: null,
      imageText: null,
      objects: null,
    });
    expect(result.problems).toContain('pdfinfo did not run');
    expect(result.problems).toContain('pdffonts did not run');
    expect(result.problems).toContain('pdfimages did not run');
    expect(result.problems).toContain('stroke parser did not run');
  });
});
