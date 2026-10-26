import { createElement } from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { yOfYear } from '../layout/drift.ts';
import { Arcs } from './Arcs.tsx';
import { arcPath } from './arcs.ts';

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
  });

  it('reveals trade and migration arcs only for the trade lens', () => {
    const { container, unmount } = render(createElement(Arcs, { lens: 'all' }));
    expect(container.querySelector('.arc')).toBeNull();
    unmount();
    const trade = render(createElement(Arcs, { lens: 'trade' }));
    const bronze = trade.container.querySelector('[data-route="route_bronze_trade"]');
    expect(bronze?.getAttribute('d')?.startsWith('M ')).toBe(true);
    expect(trade.container.querySelectorAll('.arc-migration').length).toBeGreaterThan(
      0,
    );
    trade.unmount();
    const climate = render(createElement(Arcs, { lens: 'climate' }));
    expect(climate.container.querySelector('.arc')).toBeNull();
  });
});
