import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { posterWorld } from '../camera/camera.ts';
import { PRINT_SHEETS, fitPrint } from '../print/sheet.ts';
import { AtlasRoot } from './root.tsx';

function stageSvg(): SVGSVGElement | null {
  const node = document.querySelector('svg.stage');
  return node instanceof SVGSVGElement ? node : null;
}

describe('print route', () => {
  afterEach(() => {
    cleanup();
  });

  it('draws the 24×36 sheet with the title and without screen chrome', () => {
    const fit = fitPrint(
      PRINT_SHEETS.poster,
      posterWorld().width,
      posterWorld().height,
    );
    render(createElement(AtlasRoot, { search: '?print=1' }));

    expect(
      screen.getByRole('heading', { name: 'States and peoples' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Chronos Atlas')).toBeInTheDocument();
    expect(screen.queryByRole('searchbox', { name: 'Search' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'How to read this' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Zoom in' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Skip to chart' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Columns' })).toBeNull();

    const sheet = document.querySelector('.poster-print');
    expect(sheet?.getAttribute('data-print')).toBe('poster');
    expect(sheet?.getAttribute('style')).toContain('24in');
    expect(sheet?.getAttribute('style')).toContain('36in');

    const svg = stageSvg();
    expect(svg?.getAttribute('viewBox')).toContain('0 0 1500');
    expect(svg?.style.width.endsWith('in')).toBe(true);
    expect(svg?.style.height.endsWith('in')).toBe(true);
    expect(svg?.style.getPropertyValue('--sheet-boost')).toBe('1');
    expect(fit.boost).toBe(1);

    const fonts = [...document.querySelectorAll('.ribbon-label')].map((node) =>
      Number(node.getAttribute('font-size')),
    );
    expect(fonts.length).toBeGreaterThan(0);
    for (const size of fonts) expect(size).toBeGreaterThanOrEqual(10);

    const titles = [...document.querySelectorAll('.callout-title')].map((node) =>
      Number(node.getAttribute('font-size')),
    );
    expect(titles.length).toBeGreaterThan(0);
    for (const size of titles) expect(size).toBeGreaterThanOrEqual(11);
  });

  it('keeps poster type on the letter sheet', () => {
    const world = posterWorld();
    const fit = fitPrint(PRINT_SHEETS.letter, world.width, world.height);
    render(createElement(AtlasRoot, { search: '?print=1&size=letter' }));

    expect(document.querySelector('.poster-print')?.getAttribute('data-print')).toBe(
      'letter',
    );
    expect(document.querySelector('.poster-print')?.getAttribute('style')).toContain(
      '8.5in',
    );
    expect(document.querySelector('.poster-print')?.getAttribute('style')).toContain(
      '11in',
    );
    expect(stageSvg()?.style.getPropertyValue('--sheet-boost')).toBe('1');
    expect(10 * fit.pointsPerPx).toBeLessThan(6);

    const fonts = [...document.querySelectorAll('.ribbon-label')].map((node) =>
      Number(node.getAttribute('font-size')),
    );
    expect(fonts.length).toBeGreaterThan(0);
    for (const size of fonts) expect(size).toBeGreaterThanOrEqual(10);
  });

  it('adds 0.125 in of bleed and eight crop marks on the poster', () => {
    render(createElement(AtlasRoot, { search: '?print=1&bleed=1' }));
    const sheet = document.querySelector('.poster-print');
    expect(sheet?.getAttribute('data-bleed')).toBe('1');
    expect(sheet?.getAttribute('style')).toContain('24.25in');
    expect(sheet?.getAttribute('style')).toContain('36.25in');
    expect(document.querySelectorAll('.crop-marks line')).toHaveLength(8);
    expect(
      document.querySelector('.poster-print-sheet')?.getAttribute('style'),
    ).toContain('24in');
  });
});
