import { describe, expect, it } from 'vitest';

import {
  NO_COLUMNS,
  columnChoices,
  familiesForLayout,
  visibleFamilyIds,
  withFold,
  withPin,
  type FamilyColumn,
} from './columns.ts';

const columns: readonly FamilyColumn[] = [
  { id: 'andean', macroRegion: 'americas' },
  { id: 'chinese', macroRegion: 'east_asia' },
  { id: 'korean_japanese', macroRegion: 'east_asia' },
  { id: 'latin_west', macroRegion: 'europe' },
];

describe('column fold and pin', () => {
  it('hides a folded family or region and lets a pin isolate the chart', () => {
    expect(visibleFamilyIds(columns, [], [])).toEqual([
      'andean',
      'chinese',
      'korean_japanese',
      'latin_west',
    ]);
    expect(visibleFamilyIds(columns, ['chinese'], [])).toEqual([
      'andean',
      'korean_japanese',
      'latin_west',
    ]);
    expect(visibleFamilyIds(columns, ['east_asia'], [])).toEqual([
      'andean',
      'latin_west',
    ]);
    expect(visibleFamilyIds(columns, ['nope'], [])).toHaveLength(4);
    expect(visibleFamilyIds(columns, [], ['americas'])).toEqual(['andean']);
    expect(visibleFamilyIds(columns, ['east_asia'], ['chinese'])).toEqual(['chinese']);
    expect(visibleFamilyIds(columns, ['chinese'], ['east_asia'])).toEqual([
      'korean_japanese',
    ]);
    expect(visibleFamilyIds(columns, ['chinese'], ['chinese'])).toEqual([]);
    expect(visibleFamilyIds(columns, [], ['nope'])).toEqual([]);
    expect(
      visibleFamilyIds(
        columns,
        columns.map((column) => column.id),
        [],
      ),
    ).toEqual([]);
  });

  it('maps a full chart to every family and an empty one to the sentinel', () => {
    expect(familiesForLayout(['a', 'b'], 2)).toEqual([]);
    expect(familiesForLayout(['a', 'b', 'c'], 2)).toEqual([]);
    expect(familiesForLayout(['a'], 2)).toEqual(['a']);
    expect(familiesForLayout([], 2)).toEqual([NO_COLUMNS]);
    expect(familiesForLayout([], 0)).toEqual([NO_COLUMNS]);
  });

  it('toggles fold and pin without leaving an id on both lists', () => {
    expect(withFold([], ['chinese'], 'chinese')).toEqual({
      fold: ['chinese'],
      pin: [],
    });
    expect(withFold(['chinese'], [], 'chinese')).toEqual({ fold: [], pin: [] });
    expect(withPin(['chinese'], [], 'chinese')).toEqual({
      fold: [],
      pin: ['chinese'],
    });
    expect(withPin([], ['americas', 'americas'], 'europe')).toEqual({
      fold: [],
      pin: ['americas', 'europe'],
    });
    expect(withPin([], ['europe'], 'europe')).toEqual({ fold: [], pin: [] });
    expect(columnChoices().filter((row) => row.kind === 'region')).toHaveLength(7);
    expect(
      columnChoices().some((row) => row.id === 'chinese' && row.kind === 'family'),
    ).toBe(true);
    expect(
      columnChoices().some((row) => row.id === 'americas' && row.name === 'Americas'),
    ).toBe(true);
  });
});
