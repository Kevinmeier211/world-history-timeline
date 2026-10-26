import { createElement } from 'react';
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { yOfYear } from '../layout/drift.ts';
import { Arcs } from './Arcs.tsx';
import { arcPath, arcStyle } from './arcs.ts';

describe('route arcs', () => {
  afterEach(() => {
    cleanup();
  });

  it('orders waypoints down the poster and skips a lone point', () => {
    expect(arcPath([{ year: -100, x: 0.2 }])).toBe('');
    const path = arcPath([
      { year: -100, x: 0.2 },
      { year: -300, x: 0.6 },
    ]);
    const [first, second] = path.split('L');
    expect(first?.startsWith('M ')).toBe(true);
    expect(Number(first?.split(' ')[2])).toBeCloseTo(yOfYear(-300), 1);
    expect(Number(second?.trim().split(' ')[1])).toBeCloseTo(yOfYear(-100), 1);
    expect(arcStyle('trade', false)).toEqual({ width: 1.5, dash: '6 4' });
    expect(arcStyle('migration', false).width).toBeLessThan(1.5);
    expect(arcStyle('trade', true)).toEqual({ width: 2.5, dash: '' });
  });

  it('reveals trade and migration arcs only for the trade lens', async () => {
    const { container, unmount } = render(createElement(Arcs, { lens: 'all' }));
    expect(container.querySelector('.arc')).toBeNull();
    unmount();
    const trade = render(createElement(Arcs, { lens: 'trade' }));
    const bronze = trade.container.querySelector('[data-route="route_bronze_trade"]');
    expect(bronze?.querySelector('.arc')?.getAttribute('d')?.startsWith('M ')).toBe(
      true,
    );
    expect(trade.container.querySelectorAll('.arc-migration').length).toBeGreaterThan(
      0,
    );
    const path = trade.container.querySelector('.arc-trade');
    expect(path?.getAttribute('stroke-dasharray')).toBe('6 4');
    const hit = bronze?.querySelector('.arc-hit');
    if (!(hit instanceof Element) || !(path instanceof Element)) {
      throw new Error('missing trade arc');
    }
    await userEvent.hover(hit);
    expect(path.classList.contains('arc-hot')).toBe(true);
    expect(path.getAttribute('stroke-width')).toBe('2.5');
    await userEvent.unhover(hit);
    expect(path.classList.contains('arc-hot')).toBe(false);
    trade.unmount();
    const climate = render(createElement(Arcs, { lens: 'climate' }));
    expect(climate.container.querySelector('.arc')).toBeNull();
  });
});
