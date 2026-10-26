import { describe, expect, it } from 'vitest';

import { tabOrder } from './tabOrder.ts';

describe('tab order', () => {
  it('reads down the poster, then left to right', () => {
    expect(
      tabOrder([
        { id: 'right', y0: 10, x: 80 },
        { id: 'later', y0: 40, x: 10 },
        { id: 'left', y0: 10, x: 20 },
        { id: 'tie-b', y0: 10, x: 20 },
        { id: 'tie-a', y0: 10, x: 20 },
      ]).map((item) => item.id),
    ).toEqual(['left', 'tie-a', 'tie-b', 'right', 'later']);
  });
});
