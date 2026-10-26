import { describe, expect, it } from 'vitest';

import {
  fontProblems,
  hasSelectableTitle,
  pageSizeOk,
  parsePdfFonts,
  parsePdfInfo,
} from './parse.ts';

const HEADER =
  'name                                 type              encoding         emb sub uni object ID';

function fontLine(name: string, type: string, embedded: 'yes' | 'no'): string {
  const typeAt = HEADER.indexOf('type');
  const embAt = HEADER.indexOf('emb');
  const chars = Array.from({ length: HEADER.length }, () => ' ');
  [...name].forEach((char, index) => {
    chars[index] = char;
  });
  [...type].forEach((char, index) => {
    chars[typeAt + index] = char;
  });
  [...embedded].forEach((char, index) => {
    chars[embAt + index] = char;
  });
  return chars.join('');
}

describe('pdf parsers', () => {
  it('reads the emb column from a pdffonts table', () => {
    const text = [
      HEADER,
      '-'.repeat(HEADER.length),
      fontLine('ABCDEF+BarlowCondensed-SemiBold', 'CID TrueType', 'yes'),
      fontLine('Arial', 'TrueType', 'no'),
    ].join('\n');
    const rows = parsePdfFonts(text);
    expect(rows).toEqual([
      { name: 'ABCDEF+BarlowCondensed-SemiBold', type: 'CID TrueType', embedded: true },
      { name: 'Arial', type: 'TrueType', embedded: false },
    ]);
    expect(fontProblems(rows)).toEqual(['Arial emb=no']);
    expect(fontProblems([])).toEqual(['pdffonts listed no fonts']);
    expect(parsePdfFonts('no table here')).toEqual([]);
  });

  it('reads page size in points', () => {
    const letter = parsePdfInfo(
      'Pages:          1\nPage size:      612 x 792 pts (letter)\n',
    );
    expect(letter).toEqual({ widthPt: 612, heightPt: 792, pages: 1 });
    expect(letter && pageSizeOk(letter, 8.5, 11)).toBe(true);
    expect(letter && pageSizeOk(letter, 24, 36)).toBe(false);
    const poster = parsePdfInfo(
      'Pages:          1\nPage size:      1728.2 x 2591.4 pts\n',
    );
    expect(poster && pageSizeOk(poster, 24, 36)).toBe(true);
    expect(parsePdfInfo('Pages: 1\n')).toBeNull();
    expect(hasSelectableTitle('Chronos Atlas\nStates and peoples')).toBe(true);
    expect(hasSelectableTitle('CHRONOS ATLAS')).toBe(true);
    expect(hasSelectableTitle('')).toBe(false);
  });
});
