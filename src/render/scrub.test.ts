import { createElement, useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { clientDataset } from '../data/clientDataset.ts';
import { addMilestone, removeMilestone, type Milestone } from '../state/milestones.ts';
import type { MacroRegion } from '../data/schema/primitives.ts';
import { yOfYear } from '../layout/drift.ts';
import { ScrubberView } from './Scrubber.tsx';
import {
  designYFromClient,
  FAMILY_MACRO,
  lineOffset,
  MACRO_REGIONS,
  nextLapseYear,
  yearAtDesignY,
  worldAtYear,
  type SnapshotPolity,
} from './scrub.ts';

const regions: readonly { id: MacroRegion; name: string }[] = [
  { id: 'americas', name: 'Americas' },
  { id: 'europe', name: 'Europe' },
];

const familyMacro = new Map<string, MacroRegion>([
  ['latin_west', 'europe'],
  ['mesoamerican', 'americas'],
]);

const polities: readonly SnapshotPolity[] = [
  {
    id: 'rome',
    name: 'Roman Republic',
    family: 'latin_west',
    start: -509,
    end: -27,
    importance: 3,
  },
  {
    id: 'olmec',
    name: 'Olmecs',
    family: 'mesoamerican',
    start: -1400,
    end: -400,
    importance: 2,
  },
  {
    id: 'maya',
    name: 'Maya',
    family: 'mesoamerican',
    start: -200,
    end: 900,
    importance: 3,
    spans: [{ macroRegion: 'europe', start: -100, end: 100 }],
  },
];

describe('year scrubber', () => {
  afterEach(() => {
    cleanup();
  });

  it('maps a design y back to a year and never returns 0', () => {
    expect(yearAtDesignY(yOfYear(-221))).toBe(-221);
    expect(yearAtDesignY(yOfYear(-1))).toBe(-1);
    expect(yearAtDesignY(yOfYear(1))).toBe(1);
    expect(yearAtDesignY(yOfYear(-3300))).toBe(-3300);
    expect(yearAtDesignY(yOfYear(2000))).toBe(2000);
    expect(yearAtDesignY(0)).toBe(-3300);
    expect(yearAtDesignY(yOfYear(2000) + 400)).toBe(2000);
    expect(yearAtDesignY(10, 0)).toBeNull();
    const mid = (yOfYear(-1) + yOfYear(1)) / 2;
    const year = yearAtDesignY(mid);
    expect(year).not.toBe(0);
    expect([-1, 1]).toContain(year);
    expect(designYFromClient(10, 0, 2, 0)).toBe(5);
    expect(lineOffset(100, 50, 2, 20, 0)).toBe(230);
    expect(nextLapseYear(-30)).toBe(-5);
    expect(nextLapseYear(-10)).toBe(16);
    expect(nextLapseYear(1980)).toBe(2000);
    expect(nextLapseYear(2000)).toBeNull();
    expect(nextLapseYear(0)).toBeNull();
  });

  it('lists importance 3 states per macro-region, including a span', () => {
    const atRome = worldAtYear(-50, polities, regions, familyMacro);
    expect(
      atRome.find((region) => region.id === 'europe')?.polities.map((item) => item.id),
    ).toEqual(['maya', 'rome']);
    expect(
      atRome
        .find((region) => region.id === 'americas')
        ?.polities.map((item) => item.id),
    ).toEqual(['maya']);
    const early = worldAtYear(-221, polities, regions, familyMacro);
    expect(
      early.find((region) => region.id === 'europe')?.polities.map((item) => item.id),
    ).toEqual(['rome']);
    expect(early.find((region) => region.id === 'americas')?.polities).toEqual([]);
    expect(
      worldAtYear(0, polities, regions, familyMacro).every(
        (region) => region.polities.length === 0,
      ),
    ).toBe(true);
  });

  it('keeps the roster snapshot to importance 3 and the home region', () => {
    const shot = worldAtYear(
      -221,
      clientDataset().polities,
      MACRO_REGIONS,
      FAMILY_MACRO,
    );
    const importance = new Map(
      clientDataset().polities.map((polity) => [polity.id, polity.importance]),
    );
    expect(shot).toHaveLength(7);
    expect(
      shot
        .find((region) => region.id === 'east_asia')
        ?.polities.some((item) => item.id === 'han_dynasty'),
    ).toBe(true);
    expect(
      shot
        .find((region) => region.id === 'europe')
        ?.polities.some((item) => item.id === 'roman_republic'),
    ).toBe(true);
    const low = clientDataset().polities.find(
      (polity) => polity.importance < 3 && polity.start <= -221 && polity.end >= -221,
    );
    expect(low).toBeTruthy();
    for (const region of shot) {
      for (const polity of region.polities) {
        expect(importance.get(polity.id)).toBeGreaterThanOrEqual(3);
      }
      expect(region.polities.some((polity) => polity.id === low?.id)).toBe(false);
    }
  });

  it('opens the snapshot only after the year is locked', async () => {
    const user = userEvent.setup();
    const onPick = vi.fn();
    function Harness() {
      const [locked, setLocked] = useState(false);
      return createElement(ScrubberView, {
        year: -221,
        locked,
        regions: worldAtYear(-221, polities, regions, familyMacro),
        playing: false,
        reduced: false,
        onPlay: () => {},
        onPause: () => {},
        onLock: () => setLocked(true),
        onUnlock: () => setLocked(false),
        onPick,
      });
    }
    render(createElement(Harness));
    expect(screen.queryByRole('region', { name: 'World in 221 BCE' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Lock year' }));
    const card = screen.getByRole('region', { name: 'World in 221 BCE' });
    expect(card).toHaveTextContent('Roman Republic');
    expect(card).toHaveTextContent('None');
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Roman Republic' }));
    expect(onPick).toHaveBeenCalledWith('rome');
    await user.click(screen.getByRole('button', { name: 'Unlock' }));
    expect(screen.queryByRole('region', { name: 'World in 221 BCE' })).toBeNull();
  });

  it('adds and removes a mark on the locked year', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [marks, setMarks] = useState<Milestone[]>([]);
      return createElement(ScrubberView, {
        year: -221,
        locked: true,
        playing: false,
        reduced: false,
        regions: [],
        milestones: marks,
        onAddMilestone: (year: number, label: string) => {
          setMarks((rows) => addMilestone(rows, year, label));
        },
        onRemoveMilestone: (id: string) => {
          setMarks((rows) => removeMilestone(rows, id));
        },
        onLock: () => {},
        onUnlock: () => {},
        onPick: () => {},
        onPlay: () => {},
        onPause: () => {},
      });
    }
    render(createElement(Harness));
    await user.type(
      screen.getByRole('textbox', { name: 'Mark this year' }),
      'Family note',
    );
    await user.click(screen.getByRole('button', { name: 'Add mark' }));
    expect(screen.getByText('Family note')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Remove Family note' }));
    expect(screen.queryByText('Family note')).toBeNull();
  });

  it('disables time-lapse when motion is reduced', async () => {
    const user = userEvent.setup();
    const onPlay = vi.fn();
    render(
      createElement(ScrubberView, {
        year: -221,
        locked: true,
        playing: false,
        reduced: true,
        regions: [],
        onLock: () => {},
        onUnlock: () => {},
        onPick: () => {},
        onPlay,
        onPause: () => {},
      }),
    );
    const play = screen.getByRole('button', { name: 'Play' });
    expect(play).toBeDisabled();
    await user.click(play);
    expect(onPlay).not.toHaveBeenCalled();
  });
});
