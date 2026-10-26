import { describe, expect, it } from 'vitest';

import { clientDataset } from '../data/clientDataset.ts';
import families from '../data/families.json';
import {
  buildTableRows,
  filterTable,
  rowWindow,
  sortTable,
  type TableFamily,
  type TableRow,
} from './table.ts';

const catalog = families as readonly TableFamily[];

function row(
  partial: Pick<TableRow, 'id' | 'name' | 'start' | 'end'> & Partial<TableRow>,
): TableRow {
  return {
    kind: 'polity',
    familyId: 'latin_west',
    familyName: 'Latin West',
    importance: 2,
    ...partial,
  };
}

describe('table rows', () => {
  it('follows fold and pin and keeps callouts with their polity', () => {
    const rows = buildTableRows(
      clientDataset().polities,
      clientDataset().callouts,
      catalog,
      [],
      [],
    );
    const han = rows.find((item) => item.id === 'han_dynasty');
    expect(han?.name).toBe('Qin & Han Dynasties');
    expect(han?.familyName).toBe('Chinese');
    const sea = rows.find((item) => item.id === 'node_sea_peoples');
    expect(sea?.kind).toBe('callout');
    expect(sea?.familyName).toBe('Greek and Byzantine');
    const folded = buildTableRows(
      clientDataset().polities,
      clientDataset().callouts,
      catalog,
      ['chinese'],
      [],
    );
    expect(folded.some((item) => item.familyId === 'chinese')).toBe(false);
    const pinned = buildTableRows(
      clientDataset().polities,
      clientDataset().callouts,
      catalog,
      [],
      ['americas'],
    );
    expect(pinned.every((item) => item.familyId !== 'chinese')).toBe(true);
    expect(pinned.some((item) => item.familyId === 'andean')).toBe(true);
  });

  it('sorts by year without a year 0 and filters by name', () => {
    const rows = [
      row({ id: 'late', name: 'Later', start: 1, end: 20, importance: 2 }),
      row({ id: 'early', name: 'Earlier', start: -1, end: 5, importance: 4 }),
      row({
        id: 'han',
        name: 'Qin & Han Dynasties',
        start: -221,
        end: 220,
        familyName: 'Chinese',
      }),
    ];
    expect(sortTable(rows, 'start', 'asc').map((item) => item.id)).toEqual([
      'han',
      'early',
      'late',
    ]);
    expect(sortTable(rows, 'importance', 'desc').map((item) => item.id)[0]).toBe(
      'early',
    );
    expect(filterTable(rows, '  han dyn ')).toEqual([
      rows.find((item) => item.id === 'han'),
    ]);
    expect(filterTable(rows, '')).toHaveLength(3);
    expect(filterTable(rows, 'callout')).toEqual([]);
  });

  it('windows the painted rows', () => {
    expect(rowWindow(0, 0, 400)).toEqual({ start: 0, end: 0 });
    expect(rowWindow(100, 0, 0)).toEqual({ start: 0, end: 24 });
    expect(rowWindow(100, 360, 180, 36, 0)).toEqual({ start: 10, end: 15 });
    expect(rowWindow(12, 0, 400, 36, 6).end).toBe(12);
  });
});
