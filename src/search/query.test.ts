import { describe, expect, it } from 'vitest';

import { clientDataset } from '../data/clientDataset.ts';
import { pushRecent, recordsFromDataset, searchRecords } from './query.ts';

const records = recordsFromDataset({
  polities: [
    {
      id: 'rome',
      name: 'Roman Republic',
      altNames: ['SPQR'],
      start: -509,
      end: -27,
      importance: 3,
      rulers: [{ name: 'Julius Caesar', title: 'Dictator' }],
    },
    {
      id: 'empire',
      name: 'Roman Empire',
      start: -27,
      end: 476,
      importance: 3,
    },
    {
      id: 'cordoba',
      name: 'Córdoba',
      start: 756,
      end: 1031,
      importance: 2,
    },
  ],
  callouts: [
    {
      id: 'ides',
      title: 'Assassination of Caesar',
      year: -44,
      importance: 3,
      attachTo: 'rome',
      blurb: 'Caesar is killed in the senate',
    },
  ],
  bands: [
    {
      id: 'pax',
      title: 'Pax Romana',
      start: -27,
      end: 180,
      importance: 2,
    },
  ],
});

describe('search records', () => {
  it('matches names, alternate names, people, and diacritics', () => {
    const byName = searchRecords(records, 'Roman Republic');
    expect(byName[0]?.id).toBe('rome');
    expect(searchRecords(records, 'SPQR')[0]?.id).toBe('rome');
    const caesar = searchRecords(records, 'Julius Caesar');
    expect(caesar[0]?.kind).toBe('person');
    expect(caesar[0]?.polityId).toBe('rome');
    expect(caesar[0]?.year).toBe(-509);
    expect(searchRecords(records, 'cordoba')[0]?.id).toBe('cordoba');
    expect(searchRecords(records, 'pax')[0]?.id).toBe('pax');
    expect(searchRecords(records, '')).toEqual([]);
  });

  it('treats a year as a time query and flies to that year', () => {
    const hits = searchRecords(records, '44 BCE');
    const ids = hits.map((hit) => hit.id);
    expect(ids).toContain('rome');
    expect(ids).toContain('ides');
    expect(ids).not.toContain('empire');
    expect(hits.find((hit) => hit.id === 'rome')?.year).toBe(-44);
    expect(searchRecords(records, '0')).toEqual([]);
    expect(searchRecords(records, 'year of four emperors')).toEqual([]);
  });

  it('keeps recent queries newest first and drops blanks', () => {
    const once = pushRecent([], '  Rome  ');
    expect(once).toEqual(['Rome']);
    const again = pushRecent(pushRecent(once, 'Han'), 'rome');
    expect(again).toEqual(['rome', 'Han']);
    const many = Array.from({ length: 10 }, (_, index) => `q${index}`);
    expect(pushRecent(many, 'next')).toHaveLength(8);
    expect(pushRecent(once, '   ')).toEqual(['Rome']);
  });

  it('finds the roster by name, person, and year', () => {
    const roster = recordsFromDataset(clientDataset());
    expect(searchRecords(roster, 'Han').some((hit) => hit.id === 'han_dynasty')).toBe(
      true,
    );
    expect(
      searchRecords(roster, 'Julius Caesar').some(
        (hit) => hit.kind === 'person' && hit.polityId === 'roman_republic',
      ),
    ).toBe(true);
    const year = searchRecords(roster, '44 BCE');
    expect(year.length).toBeGreaterThan(0);
    expect(year.every((hit) => hit.year === -44)).toBe(true);
    expect(year.some((hit) => hit.id === 'roman_empire')).toBe(false);
    expect(
      searchRecords(roster, 'Rome').some((hit) => hit.id === 'roman_republic'),
    ).toBe(true);
    expect(
      searchRecords(roster, 'SPQR').some((hit) => hit.id === 'roman_republic'),
    ).toBe(true);
  });
});
