import { describe, expect, it } from 'vitest';

import presets from '../data/presets.json';
import {
  COMPARE_LIMIT,
  applyPreset,
  readCompares,
  saveCompare,
  writeCompares,
} from './compares.ts';

const regions = [
  'americas',
  'europe',
  'africa',
  'west_central_asia',
  'south_asia',
  'east_asia',
  'se_asia_oceania',
];

function memory(initial = ''): Storage {
  const bag = new Map<string, string>();
  if (initial) bag.set('chronos-compares', initial);
  return {
    getItem: (key) => bag.get(key) ?? null,
    setItem: (key, value) => {
      bag.set(key, value);
    },
    removeItem: (key) => {
      bag.delete(key);
    },
    clear: () => bag.clear(),
    key: () => null,
    length: 0,
  };
}

describe('presets and compares', () => {
  it('applies the five migrated presets and does not invent the rest', () => {
    expect(presets).toHaveLength(5);
    const rome = presets.find((preset) => preset.id === 'rome_vs_han');
    expect(rome).toBeDefined();
    expect(applyPreset(rome ?? {}, regions)).toEqual({
      fold: [],
      pin: ['east_asia', 'europe', 'west_central_asia'],
      y: 100,
    });
    const all = presets.find((preset) => preset.id === 'all_regions');
    expect(applyPreset(all ?? {}, regions)).toEqual({ fold: [], pin: [] });
    expect(applyPreset({ year: 0, macroRegions: ['europe'] }, regions)).toEqual({
      fold: [],
      pin: ['europe'],
    });
    expect(applyPreset({ year: -2500, familyIds: ['chinese'] }, regions)).toEqual({
      fold: [],
      pin: ['chinese'],
      y: -2500,
    });
  });

  it('stores a named compare and ignores a broken or full store', () => {
    expect(readCompares(null)).toEqual([]);
    expect(readCompares(memory('{'))).toEqual([]);
    const saved = saveCompare([], 'My Americas', ['americas', 'Nope'], []);
    expect(saved).toEqual([
      { id: 'user_my_americas', name: 'My Americas', pin: ['americas'], fold: [] },
    ]);
    expect(saveCompare(saved, '   ', ['europe'], [])).toEqual(saved);
    expect(saveCompare([], '!!!', ['europe'], [])).toEqual([]);
    expect(saveCompare([], 'Empty', [], [])).toEqual([]);
    const store = memory();
    expect(writeCompares(store, saved)).toEqual(saved);
    expect(readCompares(store)).toEqual(saved);
    const blocked: Storage = {
      ...memory(),
      setItem: () => {
        throw new Error('full');
      },
    };
    expect(writeCompares(blocked, saved)).toEqual(saved);
    const raw = JSON.stringify([
      { name: 'Keep', pin: ['europe', 'Nope'], fold: 'nope' },
      { name: '  ' },
      'bad',
    ]);
    expect(readCompares(memory(raw))).toEqual([
      { id: 'user_keep', name: 'Keep', pin: ['europe'], fold: [] },
    ]);
    let many = saved;
    for (let index = 0; index <= COMPARE_LIMIT; index += 1) {
      many = saveCompare(many, `Set ${index}`, ['europe'], []);
    }
    expect(many).toHaveLength(COMPARE_LIMIT);
    expect(many[0]?.name).toBe(`Set ${COMPARE_LIMIT}`);
  });
});
