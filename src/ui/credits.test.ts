import { createElement } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { isCreditsHash, publishView } from '../state/hashUrl.ts';
import { resetView, useView } from '../state/view.ts';
import { PosterApp } from './PosterApp.tsx';

class FakeResizeObserver {
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    Object.defineProperty(target, 'clientWidth', { configurable: true, value: 900 });
    Object.defineProperty(target, 'clientHeight', { configurable: true, value: 600 });
    this.callback([], this as unknown as ResizeObserver);
  }

  unobserve(): void {}

  disconnect(): void {}
}

describe('credits page', () => {
  afterEach(() => {
    cleanup();
    resetView();
    window.history.replaceState(null, '', '/');
  });

  it('does not treat the credits hash as a chart view', () => {
    expect(isCreditsHash('#/credits')).toBe(true);
    expect(isCreditsHash('#y=-221')).toBe(false);
    useView.setState({ link: { y: -221, fold: ['chinese'] } });
    window.history.pushState(null, '', '/#/credits');
    useView.getState().readHash();
    expect(useView.getState().link).toEqual({ y: -221, fold: ['chinese'] });
    publishView({ y: 1800, fold: [] });
    expect(window.location.hash).toBe('#/credits');
  });

  it('opens from the title band and restores the year', async () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    window.history.replaceState(null, '', '/#y=-221');
    useView.setState({ link: { y: -221, fold: [] } });
    const user = userEvent.setup();
    render(createElement(PosterApp));
    await user.click(screen.getByRole('link', { name: 'Credits' }));
    expect(screen.getByRole('region', { name: 'Credits' })).toHaveTextContent(
      'No image files are shipped.',
    );
    expect(useView.getState().link.y).toBe(-221);
    await user.click(screen.getByRole('button', { name: 'Back to the chart' }));
    expect(screen.queryByRole('region', { name: 'Credits' })).toBeNull();
    expect(window.location.hash).toContain('y=-221');
  });
});
