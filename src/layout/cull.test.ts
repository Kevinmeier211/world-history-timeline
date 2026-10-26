import { describe, expect, it } from 'vitest';

import { cullToFit } from './cull.ts';
import type { LaneRibbon } from './laneSolver.ts';

function ribbon(id: string, importance: number, weight = 1): LaneRibbon {
  return { id, familyId: 'latin_west', weight, importance, desiredX: 400 };
}

describe('cull to fit', () => {
  it('keeps a higher-importance ribbon and drops the ones that do not fit', () => {
    const ribbons = [
      ...Array.from({ length: 13 }, (_, index) => ribbon(`a${index}`, 2)),
      ribbon('hero', 5),
    ];
    const kept = cullToFit(ribbons);
    expect(kept.map((item) => item.id)).toContain('hero');
    expect(kept).toHaveLength(13);
    expect(kept.some((item) => item.importance === 2)).toBe(true);
  });

  it('breaks an importance tie by id and keeps a slice that already fits', () => {
    const fitted = cullToFit([ribbon('b', 2, 0.2), ribbon('a', 2, 0.2)]);
    expect(fitted.map((item) => item.id).sort()).toEqual(['a', 'b']);
    const tight = cullToFit(
      Array.from({ length: 20 }, (_, index) =>
        ribbon(`n${String(index).padStart(2, '0')}`, 2),
      ),
    );
    expect(tight.length).toBeLessThan(20);
    expect(tight[0]?.id).toBe('n00');
  });
});
