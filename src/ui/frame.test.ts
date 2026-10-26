import { readFileSync } from 'node:fs';

import { wcagContrast } from 'culori';
import { describe, expect, it } from 'vitest';

import { AXIS_END, AXIS_START } from '../layout/constants.ts';
import {
  LENSES,
  POSTER_ERAS,
  POSTER_KICKER,
  POSTER_TITLE,
  TOP_BAR_PX,
  VIEWS,
  applyTheme,
  chromeShare,
  eraShare,
  isLensId,
  isThemeChoice,
  isViewId,
  nextTheme,
  posterSpan,
  readStoredTheme,
  THEME_STORAGE_KEY,
  writeStoredTheme,
} from './frame.ts';

describe('poster frame', () => {
  it('uses our masthead and six eras that tile the axis', () => {
    expect(POSTER_KICKER).toBe('Chronos Atlas');
    expect(POSTER_TITLE.toLowerCase()).not.toBe('timeline of world history');
    expect(posterSpan()).toBe('3300 BCE \u2013 2000 CE');
    expect(POSTER_ERAS.map((era) => era.name)).toEqual([
      'Early Bronze',
      'Bronze',
      'Iron',
      'Classical Antiquity',
      'Middle Ages',
      'Modern',
    ]);
    expect(POSTER_ERAS[0]?.start).toBe(AXIS_START);
    expect(POSTER_ERAS[POSTER_ERAS.length - 1]?.end).toBe(AXIS_END);
    for (let i = 1; i < POSTER_ERAS.length; i += 1) {
      expect(POSTER_ERAS[i]?.start).toBe(POSTER_ERAS[i - 1]?.end);
    }
    const sum = POSTER_ERAS.reduce((total, era) => total + eraShare(era), 0);
    expect(sum).toBeCloseTo(1, 8);
  });

  it('keeps the top bar under 12% of a short viewport', () => {
    expect(TOP_BAR_PX).toBe(40);
    expect(chromeShare(390)).toBeLessThanOrEqual(0.12);
    expect(chromeShare(800)).toBeLessThan(chromeShare(390));
    expect(chromeShare(0)).toBe(1);
    expect(chromeShare(-20)).toBe(1);
  });

  it('cycles theme and lens ids', () => {
    expect(nextTheme('system')).toBe('light');
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('system');
    const root = document.createElement('div');
    applyTheme('dark', root);
    expect(root.getAttribute('data-theme')).toBe('dark');
    applyTheme('light', root);
    expect(root.getAttribute('data-theme')).toBe('light');
    applyTheme('system', root);
    expect(root.hasAttribute('data-theme')).toBe(false);
    expect(isLensId('trade')).toBe(true);
    expect(isLensId('map')).toBe(false);
    expect(isViewId('table')).toBe(true);
    expect(isViewId('dossier')).toBe(false);
    expect(LENSES.map((item) => item.id)).toEqual(['all', 'trade', 'climate', 'ideas']);
    expect(VIEWS.map((item) => item.id)).toEqual(['chart', 'table']);
  });

  it('stores the theme and ignores a blocked or garbage value', () => {
    const saved = new Map<string, string>();
    const storage = {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => {
        saved.set(key, value);
      },
    };
    expect(readStoredTheme(null)).toBe('system');
    expect(readStoredTheme(storage)).toBe('system');
    writeStoredTheme('dark', storage);
    expect(saved.get(THEME_STORAGE_KEY)).toBe('dark');
    expect(readStoredTheme(storage)).toBe('dark');
    saved.set(THEME_STORAGE_KEY, 'neon');
    expect(isThemeChoice('neon')).toBe(false);
    expect(readStoredTheme(storage)).toBe('system');
    const blocked = {
      getItem(): string | null {
        throw new Error('denied');
      },
      setItem(): void {
        throw new Error('denied');
      },
    };
    expect(readStoredTheme(blocked)).toBe('system');
    expect(() => writeStoredTheme('light', blocked)).not.toThrow();
    expect(() => writeStoredTheme('light', null)).not.toThrow();
  });

  it('keeps ink readable on parchment and on the night atlas', () => {
    const css = readFileSync('src/styles/tokens.css', 'utf8');
    const light = tokenBlock(css, ':root');
    const dark = tokenBlock(css, ":root[data-theme='dark']");
    const systemDark = tokenBlock(css, ":root:not([data-theme='light'])");
    expect(dark['--ink']).toBe(systemDark['--ink']);
    expect(dark['--paper']).toBe(systemDark['--paper']);
    for (const theme of [light, dark]) {
      const ink = theme['--ink'];
      const muted = theme['--ink-muted'];
      const paper = theme['--paper'];
      expect(ink).toBeTruthy();
      expect(muted).toBeTruthy();
      expect(paper).toBeTruthy();
      expect(wcagContrast(ink ?? '', paper ?? '')).toBeGreaterThanOrEqual(4.5);
      expect(wcagContrast(muted ?? '', paper ?? '')).toBeGreaterThanOrEqual(4.5);
    }
  });
});

function tokenBlock(css: string, selector: string): Record<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const body = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
  const vars: Record<string, string> = {};
  for (const match of body.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    const name = match[1];
    const color = match[2];
    if (name && color) vars[name] = color;
  }
  return vars;
}
