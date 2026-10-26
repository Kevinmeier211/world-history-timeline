import { describe, expect, it } from 'vitest';

import {
  backView,
  forwardView,
  parseView,
  pushView,
  replaceView,
  serializeView,
  viewAt,
  type ViewTrail,
} from './hashUrl.ts';

const sample = {
  y: -221,
  z: 1.4,
  sel: 'han',
  lens: 'trade' as const,
  fold: ['chinese'],
};

describe('hash url', () => {
  it('round-trips the share link from the plan', () => {
    const hash = serializeView(sample);
    expect(hash).toBe('#y=-221&z=1.4&sel=han&lens=trade&fold=chinese');
    expect(parseView(hash)).toEqual(sample);
  });

  it('drops a blank link, year 0, and an unknown lens', () => {
    expect(serializeView({ fold: [] })).toBe('');
    expect(parseView('#y=0&z=nope&sel=Han&lens=nope&fold=')).toEqual({ fold: [] });
    expect(parseView('#fold=chinese,andean,chinese').fold).toEqual([
      'andean',
      'chinese',
    ]);
    expect(parseView(serializeView({ y: -221, z: 9, lens: 'all', fold: [] }))).toEqual({
      y: -221,
      z: 6,
      fold: [],
    });
  });

  it('round-trips a pin and drops an id that is not a token', () => {
    const view = { fold: ['chinese'], pin: ['east_asia', 'europe'] };
    expect(serializeView(view)).toBe('#fold=chinese&pin=east_asia,europe');
    expect(parseView('#fold=chinese&pin=east_asia,europe')).toEqual(view);
    expect(parseView('#pin=Nope,europe').pin).toEqual(['europe']);
    expect(parseView('#pin=')).not.toHaveProperty('pin');
  });

  it('walks back and forward without growing the stack on replace', () => {
    let trail: ViewTrail = { entries: [''], index: 0 };
    trail = pushView(trail, sample);
    trail = pushView(trail, { ...sample, lens: 'climate' });
    expect(trail.entries).toHaveLength(3);
    trail = backView(trail);
    expect(viewAt(trail).lens).toBe('trade');
    trail = backView(trail);
    expect(viewAt(trail)).toEqual({ fold: [] });
    trail = backView(trail);
    expect(trail.index).toBe(0);
    trail = forwardView(trail);
    expect(viewAt(trail).sel).toBe('han');
    const replaced = replaceView(trail, { ...sample, lens: 'ideas' });
    expect(replaced.entries).toHaveLength(trail.entries.length);
    expect(viewAt(replaced).lens).toBe('ideas');
    expect(pushView(replaced, { ...sample, lens: 'ideas' })).toBe(replaced);
  });
});
