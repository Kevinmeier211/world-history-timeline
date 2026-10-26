import { createElement } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Legend } from './Legend.tsx';
import { READING_KEY, readingText } from './reading.ts';

describe('reading key', () => {
  it('explains the chart in our own words', () => {
    const text = readingText();
    expect(text).toMatch(/prominent/i);
    expect(text).toMatch(/not land area/i);
    expect(text).toMatch(/lineage/i);
    expect(text).toMatch(/does not paint a region/i);
    expect(text).toMatch(/faded or dashed top/i);
    expect(text).toMatch(/disputed succession/i);
    expect(text).toMatch(/cultural continuity/i);
    expect(text).toContain('c.');
    expect(text).toMatch(/peoples outlast states/i);
    expect(text).not.toMatch(/usefulcharts|timeline of world history/i);
    expect(READING_KEY).toHaveLength(6);
  });

  it('lists lineage swatches and closes from the button or escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      createElement(Legend, {
        families: [{ id: 'andean', name: 'Andean', color: '#2F6F5A' }],
        onClose,
      }),
    );
    expect(
      screen.getByRole('dialog', { name: 'How to read this' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/peoples outlast states/i)).toBeInTheDocument();
    const swatch = screen.getByText('Andean').querySelector('.legend-swatch');
    expect(swatch?.getAttribute('style')).toContain('rgb(47, 111, 90)');
    await user.click(screen.getByRole('button', { name: /^Close$/ }));
    expect(onClose).toHaveBeenCalledOnce();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
