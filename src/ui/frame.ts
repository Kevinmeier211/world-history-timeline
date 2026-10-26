import { AXIS_END, AXIS_START, LEFT_GUTTER } from '../layout/constants.ts';
import { formatYear, toT } from '../lib/years.ts';

/** Slim bar in §4.1. 40px is under 12% of a 390px-tall viewport. */
export const TOP_BAR_PX = 40;

export const POSTER_KICKER = 'Chronos Atlas';
export const POSTER_TITLE = 'States and peoples';

export const LENSES = [
  { id: 'all', label: 'All' },
  { id: 'trade', label: 'Trade' },
  { id: 'climate', label: 'Climate' },
  { id: 'ideas', label: 'Ideas' },
] as const;

export const VIEWS = [
  { id: 'chart', label: 'Chart' },
  { id: 'table', label: 'Table' },
] as const;

export type LensId = (typeof LENSES)[number]['id'];
export type ViewId = (typeof VIEWS)[number]['id'];
export type ThemeChoice = 'system' | 'light' | 'dark';

export interface EraBand {
  id: string;
  name: string;
  start: number;
  end: number;
}

/** Six bands from §4.9, tiled across the poster axis. Modern stops at 2000 CE. */
export const POSTER_ERAS: readonly EraBand[] = [
  { id: 'early_bronze', name: 'Early Bronze', start: -3300, end: -2100 },
  { id: 'bronze', name: 'Bronze', start: -2100, end: -1200 },
  { id: 'iron', name: 'Iron', start: -1200, end: -600 },
  { id: 'classical', name: 'Classical Antiquity', start: -600, end: 500 },
  { id: 'middle_ages', name: 'Middle Ages', start: 500, end: 1500 },
  { id: 'modern', name: 'Modern', start: 1500, end: 2000 },
];

export function posterSpan(): string {
  return `${formatYear(AXIS_START)} \u2013 ${formatYear(AXIS_END)}`;
}

export function eraShare(era: EraBand): number {
  const span = toT(AXIS_END) - toT(AXIS_START);
  return (toT(era.end) - toT(era.start)) / span;
}

/** Share of the viewport taken by the top bar. The title band is part of the poster. */
export function chromeShare(viewportHeight: number, barPx = TOP_BAR_PX): number {
  if (viewportHeight <= 0) return 1;
  return barPx / viewportHeight;
}

export function gutterPx(): number {
  return LEFT_GUTTER;
}

export function isLensId(value: string): value is LensId {
  return LENSES.some((item) => item.id === value);
}

export function isViewId(value: string): value is ViewId {
  return VIEWS.some((item) => item.id === value);
}

export function nextTheme(current: ThemeChoice): ThemeChoice {
  if (current === 'system') return 'light';
  if (current === 'light') return 'dark';
  return 'system';
}

export function themeLabel(choice: ThemeChoice): string {
  if (choice === 'light') return 'Light';
  if (choice === 'dark') return 'Dark';
  return 'System';
}

export const THEME_STORAGE_KEY = 'chronos-theme';

export function isThemeChoice(value: string | null): value is ThemeChoice {
  return value === 'system' || value === 'light' || value === 'dark';
}

/** Missing, garbage, or blocked storage stays on the system theme. */
export function readStoredTheme(storage: Pick<Storage, 'getItem'> | null): ThemeChoice {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY) ?? null;
    return isThemeChoice(value) ? value : 'system';
  } catch {
    return 'system';
  }
}

/** A failed write still leaves the choice applied for this session. */
export function writeStoredTheme(
  choice: ThemeChoice,
  storage: Pick<Storage, 'setItem'> | null,
): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // private mode and disabled storage
  }
}

export function applyTheme(choice: ThemeChoice, root: HTMLElement): void {
  if (choice === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', choice);
}
