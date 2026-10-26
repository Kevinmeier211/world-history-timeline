import { readFileSync } from 'node:fs';

import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { LEFT_GUTTER } from '../layout/constants.ts';
import { PosterApp } from './PosterApp.tsx';
import { applyTheme, posterSpan } from './frame.ts';

describe('poster shell', () => {
  afterEach(() => {
    applyTheme('system', document.documentElement);
  });

  it('renders the frame, both era gutters, and the slim bar', async () => {
    const user = userEvent.setup();
    render(createElement(PosterApp));

    expect(
      screen.getByRole('heading', { name: 'States and peoples' }),
    ).toBeInTheDocument();
    expect(screen.getByText(posterSpan())).toBeInTheDocument();
    expect(screen.getAllByText('Early Bronze')).toHaveLength(2);
    expect(screen.getAllByText('Classical Antiquity')).toHaveLength(2);
    expect(screen.getAllByText('Modern')).toHaveLength(2);
    expect(document.querySelector('.chronos-app-shell')).toBeNull();
    expect(document.querySelector('.poster-frame')).toHaveStyle({
      '--gutter': `${LEFT_GUTTER}px`,
    });

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
