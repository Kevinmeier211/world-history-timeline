import { describe, expect, it } from 'vitest';

import { ERA_FLOORS, eraShortfalls, validateDataset } from '../src/data/validate.ts';
import { loadDataset, loadRoots } from './load-dataset.ts';

describe('era floors on the roster', () => {
  it('meets every §7 floor, including 35 polities in 3300–2000 BCE', () => {
    const { coverage } = validateDataset(loadDataset(), loadRoots());
    const byEra = coverage?.byEra ?? {};
    expect(eraShortfalls(byEra)).toEqual([]);
    expect(ERA_FLOORS['3300_2000bce']).toBe(35);
    // Appendix B, bounded intervals, and twelve widely cited cultures.
    // Raise the count when another dated row is added. The floor stays 35.
    expect(byEra['3300_2000bce']).toBe(38);
  });
});
