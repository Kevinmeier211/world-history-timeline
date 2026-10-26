import { describe, expect, it } from 'vitest';

import {
  PDF_JOBS,
  boxNear,
  expectedPoints,
  paperInches,
  printPath,
  selectJobs,
  viewportPx,
} from './jobs.ts';

describe('pdf jobs', () => {
  it('names the three trim sheets', () => {
    expect(PDF_JOBS.map((job) => job.file)).toEqual([
      'chronos-letter.pdf',
      'chronos-tabloid.pdf',
      'chronos-poster.pdf',
    ]);
    expect(paperInches('letter')).toEqual({ widthIn: 8.5, heightIn: 11 });
    expect(paperInches('tabloid')).toEqual({ widthIn: 11, heightIn: 17 });
    expect(paperInches('poster')).toEqual({ widthIn: 24, heightIn: 36 });
    expect(printPath('poster')).toBe('/?print=1&size=poster');
    expect(viewportPx(8.5, 11)).toEqual({ width: 816, height: 1056 });
    expect(viewportPx(24, 36)).toEqual({ width: 2304, height: 3456 });
    expect(expectedPoints(8.5, 11)).toEqual({ widthPt: 612, heightPt: 792 });
    expect(expectedPoints(24, 36)).toEqual({ widthPt: 1728, heightPt: 2592 });
    expect(selectJobs([])).toEqual(PDF_JOBS);
    expect(selectJobs(['tabloid']).map((job) => job.id)).toEqual(['tabloid']);
    expect(() => selectJobs(['a4'])).toThrow(/unknown pdf job/);
    expect(boxNear({ width: 817, height: 1055 }, 8.5, 11)).toBe(true);
    expect(boxNear({ width: 800, height: 1056 }, 8.5, 11)).toBe(false);
  });
});
