import { readFileSync } from 'node:fs';

import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

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
    applyTheme('system', document.documentElement);
    localStorage.removeItem(THEME_STORAGE_KEY);
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

  it('keeps v1 off the default module path', () => {
    const main = readFileSync('src/main.tsx', 'utf8');
    const spec = readFileSync('tests/e2e/v1-baseline.spec.ts', 'utf8');
    expect(main).toContain('PosterApp');
    expect(main).not.toMatch(/import '\.\/styles\/app\.css'/);
    expect(main).toContain("import('./styles/app.css')");
    expect(main).toContain("has('v1')");
    expect(spec).toContain('/?v1=1');
  });
});
