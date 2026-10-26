import { describe, expect, it } from 'vitest';

import { clientDataset } from '../data/clientDataset.ts';
import families from '../data/families.json';
import { POSTER_ERAS } from './frame.ts';
import { eraAt, politiesInEra } from './eraReading.ts';

describe('era reading', () => {
  it('picks the poster era and the polities that meet it', () => {
    expect(eraAt(-1350, POSTER_ERAS)?.name).toBe('Bronze');
    expect(eraAt(-3300, POSTER_ERAS)?.id).toBe('early_bronze');
    expect(eraAt(2000, POSTER_ERAS)?.id).toBe('modern');
    expect(eraAt(2001, POSTER_ERAS)).toBeNull();
    const bronze = eraAt(-1350, POSTER_ERAS);
    const rows = politiesInEra(clientDataset().polities, families, bronze);
    expect(rows.some((row) => row.name === 'Egyptian New Kingdom')).toBe(true);
    expect(rows.some((row) => row.name === 'Invented polity')).toBe(false);
    expect(rows.map((row) => row.start)).toEqual(
      [...rows.map((row) => row.start)].sort((left, right) => left - right),
    );
    expect(politiesInEra([], families, null)).toEqual([]);
  });
});
