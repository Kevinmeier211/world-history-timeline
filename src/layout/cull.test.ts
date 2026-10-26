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

  it('swaps a fork endpoint in for an equal-importance ribbon', () => {
    const ribbons = Array.from({ length: 30 }, (_, index) =>
      ribbon(`n${String(index).padStart(2, '0')}`, 2, 0.35),
    );
    const bare = cullToFit(ribbons);
    expect(bare.some((item) => item.id === 'n29')).toBe(false);
    const kept = cullToFit(ribbons, new Set(['n29']));
    expect(kept.some((item) => item.id === 'n29')).toBe(true);
    expect(kept).toHaveLength(bare.length);
    expect(kept.some((item) => item.id === 'n28')).toBe(false);
    expect(kept[0]?.id).toBe('n00');
  });

  it('does not drop a higher-importance ribbon to save an endpoint', () => {
    const ribbons = [
      ...Array.from({ length: 16 }, (_, index) => ribbon(`h${index}`, 3)),
      ribbon('child', 2),
    ];
    const kept = cullToFit(ribbons, new Set(['child']));
    expect(kept.some((item) => item.id === 'child')).toBe(false);
    expect(kept.every((item) => item.importance === 3)).toBe(true);
  });
});
