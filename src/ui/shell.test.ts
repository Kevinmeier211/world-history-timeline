import { existsSync, readFileSync } from 'node:fs';

import { createElement } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { resetView } from '../state/view.ts';
import { PosterApp } from './PosterApp.tsx';
import { applyTheme, posterSpan, THEME_STORAGE_KEY } from './frame.ts';

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

describe('poster shell', () => {
  afterEach(() => {
    cleanup();
    applyTheme('system', document.documentElement);
    localStorage.removeItem(THEME_STORAGE_KEY);
    resetView();
    window.history.replaceState(null, '', '/');
    vi.unstubAllGlobals();
  });

  it('renders the frame, both era gutters, and the slim bar', async () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const user = userEvent.setup();
    render(createElement(PosterApp));

    expect(
      screen.getByRole('heading', { name: 'States and peoples' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'How to read this' }));
    const key = screen.getByRole('dialog', { name: 'How to read this' });
    expect(key).toHaveTextContent('Peoples outlast states');
    expect(key).toHaveTextContent('Andean');
    await user.click(screen.getByRole('button', { name: /^Close$/ }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText(posterSpan())).toBeInTheDocument();
    expect(screen.getAllByText('Early Bronze')).toHaveLength(2);
    expect(screen.getAllByText('Classical Antiquity')).toHaveLength(2);
    expect(screen.getAllByText('Modern')).toHaveLength(2);
    expect(screen.getByText('1500 CE')).toBeInTheDocument();
    expect(document.querySelector('.chronos-app-shell')).toBeNull();
    expect(document.querySelector('svg.stage')?.getAttribute('viewBox')).toContain(
      '0 0 1500',
    );

    const search = screen.getByRole('searchbox', { name: 'Search' });
    await user.type(search, 'Rome');
    expect(search).toHaveValue('Rome');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Lens' }), 'trade');
    expect(document.querySelector('.poster-frame')).toHaveAttribute(
      'data-lens',
      'trade',
    );

    await user.selectOptions(screen.getByRole('combobox', { name: 'View' }), 'table');
    expect(
      screen.getByText('Table view lists the same polities, one row each.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Theme: system' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    await user.click(screen.getByRole('button', { name: 'Theme: light' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    await user.click(screen.getByRole('button', { name: 'Theme: dark' }));
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
  });

  it('restores the stored theme', async () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const user = userEvent.setup();
    render(createElement(PosterApp));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    await user.click(screen.getByRole('button', { name: 'Theme: dark' }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('writes the lens into the hash and reads it back', async () => {
    const trade = '#y=-221&z=1.4&sel=han&lens=trade&fold=chinese';
    const ideas = '#y=-221&z=1.4&sel=han&lens=ideas&fold=chinese';
    window.history.replaceState(null, '', `/${trade}`);
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const user = userEvent.setup();
    render(createElement(PosterApp));
    const lens = screen.getByRole('combobox', { name: 'Lens' });
    expect(lens).toHaveValue('trade');
    expect(document.querySelector('.poster-frame')).toHaveAttribute(
      'data-lens',
      'trade',
    );
    await user.selectOptions(lens, 'ideas');
    expect(window.location.hash).toBe(ideas);
    window.history.back();
    await waitFor(() => {
      expect(window.location.hash).toBe(trade);
      expect(screen.getByRole('combobox', { name: 'Lens' })).toHaveValue('trade');
    });
    window.history.forward();
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Lens' })).toHaveValue('ideas');
    });
    window.location.hash = '#lens=climate';
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Lens' })).toHaveValue('climate');
    });
  });

  it('mounts the poster and leaves the v1 canvas deleted', () => {
    const main = readFileSync('src/main.tsx', 'utf8');
    expect(main).toContain('PosterApp');
    expect(main).not.toContain('app.css');
    expect(main).not.toContain("has('v1')");
    expect(existsSync('src/App.tsx')).toBe(false);
    expect(existsSync('src/utils/timeLayout.ts')).toBe(false);
    expect(existsSync('src/styles/app.css')).toBe(false);
    expect(existsSync('src/components/TimelineCanvas.tsx')).toBe(false);
    expect(existsSync('tests/e2e/v1-baseline.spec.ts')).toBe(false);
    expect(existsSync('docs/shots/v1')).toBe(true);
  });
});
