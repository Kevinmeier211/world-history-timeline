import { describe, expect, it } from 'vitest';

import { blockedEntry } from './blocked.ts';

describe('blocked print notes', () => {
  it('keeps the tool error verbatim', () => {
    const note = blockedEntry('pdffonts', 'T7.02', 'spawn pdffonts ENOENT');
    expect(note).toContain('Blocked — pdffonts (T7.02)');
    expect(note).toContain('spawn pdffonts ENOENT');
    expect(note).toContain('Affects tasks: T7.02.');
  });
});
