import { existsSync, readFileSync } from 'node:fs';

import { createElement } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { COMPARE_STORAGE_KEY } from '../state/compares.ts';
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
    localStorage.removeItem(COMPARE_STORAGE_KEY);
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
    expect(screen.queryByRole('button', { name: 'Lock year' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
    expect(screen.queryByRole('region', { name: /World in/ })).toBeNull();
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
    expect(document.querySelector('.ribbons')).toHaveAttribute('opacity', '1');
    expect(document.querySelector('.arc')).toBeNull();

    const search = screen.getByRole('searchbox', { name: 'Search' });
    await user.type(search, 'Rome');
    expect(search).toHaveValue('Rome');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Lens' }), 'trade');
    expect(document.querySelector('.poster-frame')).toHaveAttribute(
      'data-lens',
      'trade',
    );
    expect(document.querySelector('.ribbons')).toHaveAttribute('opacity', '0.55');
    expect(document.querySelector('.arc-trade')).toBeTruthy();
    expect(document.querySelector('.cross-band-climate')).toHaveAttribute(
      'opacity',
      '0.4',
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

  it('opens search from slash and flies to the chosen state', async () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const user = userEvent.setup();
    render(createElement(PosterApp));
    await user.keyboard('/');
    expect(screen.getByRole('dialog', { name: 'Search' })).toHaveTextContent('44 BCE');
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveFocus();
    await user.keyboard('Han');
    const option = await screen.findByRole('option', { name: /Qin & Han Dynasties/ });
    await user.click(option);
    await waitFor(() => {
      expect(window.location.hash).toBe('#y=-221&sel=han_dynasty');
    });
    expect(screen.queryByRole('dialog', { name: 'Search' })).toBeNull();
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('');
    await user.keyboard('/');
    expect(screen.getByRole('option', { name: 'Han' })).toBeInTheDocument();
  });

  it('keeps the dossier closed until a ribbon is chosen', async () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const user = userEvent.setup();
    render(createElement(PosterApp));
    expect(screen.queryByRole('dialog', { name: 'Dossier' })).toBeNull();
    const ribbon = screen.getAllByRole('button').find((button) => {
      const label = button.getAttribute('aria-label') ?? '';
      return label.includes('BCE') || label.includes('CE');
    });
    expect(ribbon).toBeTruthy();
    const name = (ribbon?.getAttribute('aria-label') ?? '').split(',')[0] ?? '';
    if (!ribbon) return;
    await user.click(ribbon);
    const dossier = screen.getByRole('dialog', { name: 'Dossier' });
    expect(dossier).toHaveTextContent(name);
    expect(dossier).toHaveTextContent('No image is attached');
    expect(dossier).toHaveTextContent(/Not yet cross-checked|Cross-checked/);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Dossier' })).toBeNull();
  });

  it('folds and pins columns without making a dialog', async () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const user = userEvent.setup();
    render(createElement(PosterApp));
    expect(screen.queryByRole('region', { name: 'Columns' })).toBeNull();
    const before = document
      .querySelector('.stage-host')
      ?.getAttribute('data-ribbon-count');
    await user.click(screen.getByRole('button', { name: 'Columns' }));
    expect(screen.getByRole('region', { name: 'Columns' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Columns' })).toBeNull();
    await user.keyboard('/');
    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close search' }));
    expect(screen.queryByRole('dialog', { name: 'Search' })).toBeNull();
    expect(screen.getByRole('region', { name: 'Columns' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fold Chinese' }));
    expect(window.location.hash).toBe('#fold=chinese');
    await waitFor(() => {
      const count = document
        .querySelector('.stage-host')
        ?.getAttribute('data-ribbon-count');
      expect(count).not.toBe(before);
      expect(Number(count)).toBeGreaterThan(0);
    });
    const folded = document
      .querySelector('.stage-host')
      ?.getAttribute('data-ribbon-count');
    await user.click(screen.getByRole('button', { name: 'Pin Americas' }));
    expect(window.location.hash).toBe('#fold=chinese&pin=americas');
    await waitFor(() => {
      const count = Number(
        document.querySelector('.stage-host')?.getAttribute('data-ribbon-count'),
      );
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThan(Number(folded));
    });
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('region', { name: 'Columns' })).toBeNull();
  });

  it('applies a migrated preset and restores a saved compare', async () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const user = userEvent.setup();
    const first = render(createElement(PosterApp));
    await user.click(screen.getByRole('button', { name: 'Columns' }));
    await user.click(screen.getByRole('button', { name: 'Rome vs. Han China' }));
    expect(window.location.hash).toBe('#y=100&pin=east_asia,europe,west_central_asia');
    expect(screen.queryByRole('button', { name: 'Invented preset' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'All 11 World Regions' }));
    expect(window.location.hash).toBe('#y=100');
    await user.click(screen.getByRole('button', { name: 'Pin Americas' }));
    await user.type(
      screen.getByRole('textbox', { name: 'Compare name' }),
      'My Americas',
    );
    await user.click(screen.getByRole('button', { name: 'Save compare' }));
    first.unmount();
    resetView();
    window.history.replaceState(null, '', '/');
    render(createElement(PosterApp));
    await user.click(screen.getByRole('button', { name: 'Columns' }));
    await user.click(screen.getByRole('button', { name: 'My Americas' }));
    expect(window.location.hash).toBe('#pin=americas');
  });

  it('filters and sorts the table, then opens the dossier from a row', async () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const user = userEvent.setup();
    render(createElement(PosterApp));
    await user.selectOptions(screen.getByRole('combobox', { name: 'View' }), 'table');
    const table = screen.getByRole('table', { name: 'Polities and callouts' });
    expect(table).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Starts' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await user.click(screen.getByRole('button', { name: 'Starts' }));
    expect(screen.getByRole('columnheader', { name: 'Starts' })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    await user.type(
      screen.getByRole('searchbox', { name: 'Filter table' }),
      'Qin & Han',
    );
    const han = screen.getByRole('button', { name: 'Qin & Han Dynasties' });
    expect(han).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Invented polity' })).toBeNull();
    await user.click(han);
    expect(window.location.hash).toContain('sel=han_dynasty');
    expect(screen.getByRole('dialog', { name: 'Dossier' })).toHaveTextContent(
      'Qin & Han Dynasties',
    );
  });

  it('plays a migrated tour and leaves the other stories uninvented', async () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    const user = userEvent.setup();
    render(createElement(PosterApp));
    await user.click(screen.getByRole('button', { name: 'Stories' }));
    const panel = screen.getByRole('region', { name: 'Stories' });
    expect(panel).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Stories' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Silk Roads' })).toBeNull();
    await user.click(
      screen.getByRole('button', { name: '1177 BCE: The Late Bronze Age Collapse' }),
    );
    expect(window.location.hash).toBe(
      '#y=-1350&z=1.5&sel=egypt_new_kingdom&lens=trade',
    );
    expect(panel).toHaveTextContent('Amarna Letters');
    expect(screen.getByRole('link', { name: 'Cambridge Histories' })).toHaveAttribute(
      'href',
      'https://www.cambridge.org/core/publications/collections/cambridge-histories',
    );
    expect(screen.queryByRole('dialog', { name: 'Dossier' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Next stop' }));
    expect(window.location.hash).toBe('#y=-1274&z=1.8&sel=hittites');
    expect(panel).toHaveTextContent('Kadesh');
    await user.click(screen.getByRole('button', { name: 'Fit width' }));
    expect(window.location.hash).toBe('#y=-1274&sel=hittites');
    await user.keyboard('/');
    expect(screen.getByRole('dialog', { name: 'Search' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close search' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('region', { name: 'Stories' })).toBeNull();
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
