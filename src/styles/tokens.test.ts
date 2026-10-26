import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

describe('poster tokens', () => {
  it('loads self-hosted faces and the parchment palette', () => {
    const html = readFileSync('index.html', 'utf8');
    const main = readFileSync('src/main.tsx', 'utf8');
    const css = readFileSync('src/styles/tokens.css', 'utf8');
    expect(html).not.toMatch(/fonts\.googleapis|fonts\.gstatic|typekit/);
    expect(main).toContain('@fontsource/barlow-condensed/700.css');
    expect(main).toContain('@fontsource/source-sans-3/400.css');
    expect(main).toContain('@fontsource/source-serif-4/600.css');
    expect(css).toContain('--paper: #f1e8d2');
    expect(css).toContain('--ink: #2a241c');
    expect(css).toContain("data-theme='dark'");
    expect(css).toContain('prefers-color-scheme: dark');
    expect(css).toContain(":not([data-theme='light'])");
    expect(css).toContain('--paper: #14161b');
  });
});
