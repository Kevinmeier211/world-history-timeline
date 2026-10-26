import { describe, expect, it } from 'vitest';

import { PRINT_BLEED_IN, PRINT_SHEETS, paperSizeIn } from './sheet.ts';
import { cropSegments, segmentStaysOutsideTrim } from './crop.ts';

describe('crop marks', () => {
  it('draws eight marks in the poster bleed and none when the bleed is too small', () => {
    const paper = paperSizeIn(PRINT_SHEETS.poster, true);
    expect(paper).toEqual({
      widthIn: 24 + 2 * PRINT_BLEED_IN,
      heightIn: 36 + 2 * PRINT_BLEED_IN,
    });
    const lines = cropSegments(paper.widthIn, paper.heightIn, 24, 36);
    expect(lines).toHaveLength(8);
    for (const line of lines) {
      expect(Math.hypot(line.x2 - line.x1, line.y2 - line.y1)).toBeGreaterThan(0);
      expect(segmentStaysOutsideTrim(line, paper.widthIn, paper.heightIn, 24, 36)).toBe(
        true,
      );
    }
    expect(cropSegments(24, 36, 24, 36)).toEqual([]);
  });
});
