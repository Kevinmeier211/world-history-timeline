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
  isViewId,
  nextTheme,
  posterSpan,
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

  it('cycles theme and lens ids without persisting', () => {
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
});
