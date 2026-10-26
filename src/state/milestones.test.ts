import { describe, expect, it } from 'vitest';

import {
  addMilestone,
  MILESTONE_LIMIT,
  placeMilestones,
  readMilestones,
  removeMilestone,
  writeMilestones,
} from './milestones.ts';

function memory(): Storage {
  const bag = new Map<string, string>();
  return {
    get length() {
      return bag.size;
    },
    clear: () => bag.clear(),
    getItem: (key) => bag.get(key) ?? null,
    key: (index) => [...bag.keys()][index] ?? null,
    removeItem: (key) => bag.delete(key),
    setItem: (key, value) => bag.set(key, value),
  };
}

describe('custom milestones', () => {
  it('keeps a named year, drops year 0, and survives a blocked store', () => {
    const store = memory();
    const saved = writeMilestones(store, addMilestone([], -221, '  Family note  '));
    expect(saved).toEqual([
      { id: expect.any(String), year: -221, label: 'Family note' },
    ]);
    expect(readMilestones(store)).toEqual(saved);
    expect(addMilestone(saved, 0, 'Missing year')).toEqual(saved);
    expect(addMilestone(saved, -3301, 'Too early')).toEqual(saved);
    expect(addMilestone(saved, 2001, 'Too late')).toEqual(saved);
    expect(addMilestone(saved, 1.5, 'Fraction')).toEqual(saved);
    expect(addMilestone(saved, 44, '   ')).toEqual(saved);
    const blocked = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    expect(readMilestones(blocked)).toEqual([]);
    expect(writeMilestones(blocked, saved)).toEqual(saved);
    expect(readMilestones(null)).toEqual([]);
  });

  it('replaces the same mark, caps the list, and stacks one year', () => {
    let rows = addMilestone([], 800, 'Later');
    rows = addMilestone(rows, -221, 'Family note');
    rows = addMilestone(rows, -221, 'Family note');
    rows = addMilestone(rows, -221, 'Another note');
    expect(rows.filter((row) => row.label === 'Family note')).toHaveLength(1);
    const placed = placeMilestones(rows);
    expect(placed.map((row) => row.year)).toEqual([-221, -221, 800]);
    const sameYear = placed.filter((row) => row.year === -221);
    expect(sameYear.map((row) => row.stack)).toEqual([0, 1]);
    let full = rows;
    for (let year = 1; year <= MILESTONE_LIMIT + 2; year += 1) {
      full = addMilestone(full, year, `Note ${year}`);
    }
    expect(full).toHaveLength(MILESTONE_LIMIT);
    expect(removeMilestone(full, full[0]?.id ?? '')).toHaveLength(MILESTONE_LIMIT - 1);
    expect(readMilestones(memoryFrom('{"no":"array"}'))).toEqual([]);
    expect(readMilestones(memoryFrom('[{ "year": 0, "label": "nope" }]'))).toEqual([]);
  });
});

function memoryFrom(raw: string): Storage {
  const store = memory();
  store.setItem('chronos-milestones', raw);
  return store;
}
