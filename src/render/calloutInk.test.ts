import { describe, expect, it } from 'vitest';

import { wordCount } from '../data/schema/primitives.ts';
import { posterModel } from './posterModel.ts';
import { calloutHits } from './calloutInk.ts';

describe('callout ink', () => {
  it('paints seated cards clear of each other and of ribbon labels', () => {
    const paint = posterModel();
    const labels = paint.labels
      .filter((label) => label.fitted)
      .map((label) => ({
        id: label.polityId,
        x: label.x,
        y: label.y,
        width: label.width,
        height: label.height,
      }));
    expect(paint.callouts.length).toBeGreaterThan(0);
    expect(paint.callouts.some((callout) => !callout.marker && callout.leader)).toBe(
      true,
    );
    for (const callout of paint.callouts) {
      expect(wordCount(callout.blurb)).toBeLessThanOrEqual(14);
      expect(wordCount(callout.blurb)).toBeGreaterThan(0);
    }
    expect(calloutHits(paint.callouts, labels)).toEqual([]);
  });
});
