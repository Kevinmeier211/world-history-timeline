import { describe, expect, it } from 'vitest';

import { confidenceGlyph, ribbonDimmed, verificationClass } from './focusTip.ts';

describe('focus marks', () => {
  it('gives each confidence a glyph and each verification a dot class', () => {
    expect(confidenceGlyph('secure')).toBe('●');
    expect(confidenceGlyph('conventional')).toBe('○');
    expect(confidenceGlyph('approximate')).toBe('c.');
    expect(confidenceGlyph('debated')).toBe('?');
    expect(verificationClass('unverified')).toBe('verify-unverified');
    expect(verificationClass('cross-checked')).toBe('verify-cross');
    expect(verificationClass('primary-checked')).toBe('verify-primary');
  });

  it('dims every family except the one under the pointer', () => {
    expect(ribbonDimmed('latin_west', null)).toBe(false);
    expect(ribbonDimmed('latin_west', 'latin_west')).toBe(false);
    expect(ribbonDimmed('chinese', 'latin_west')).toBe(true);
  });
});
