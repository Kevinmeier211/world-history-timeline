import { describe, expect, it } from 'vitest';

import { eraShortfalls, validateDataset } from '../src/data/validate.ts';
import { loadDataset, loadRoots } from './load-dataset.ts';

describe('era floors on the roster', () => {
  it('leaves only 3300–2000 BCE under the §7 floor of 35', () => {
    const { coverage } = validateDataset(loadDataset(), loadRoots());
    const short = eraShortfalls(coverage?.byEra ?? {});
    expect(short.map((gap) => gap.id)).toEqual(['3300_2000bce']);
    // Dated Appendix B spans plus bounded unnamed intervals. Raise the count
    // when another such row is added. The floor stays 35.
    expect(short[0]).toEqual({ id: '3300_2000bce', count: 26, floor: 35 });
  });
});
