import { describe, expect, it } from 'vitest';

import { canvasTextMeasurer, labelFit, type TextMeasurer } from './labelFit.ts';

/** Each character is half a font-size wide, so the tests pick sizes by arithmetic. */
function fakeMeasure(em = 0.5): TextMeasurer {
  return {
    measure(text, fontSize) {
      return text.length * fontSize * em;
    },
  };
}

describe('labelFit', () => {
  const measure = fakeMeasure();

  it('keeps a name horizontal and uses the largest size that fits', () => {
    const fitted = labelFit('Roman Empire', undefined, { w: 80, h: 20 }, measure);
    expect(fitted).toEqual({
      text: 'Roman Empire',
      size: 12,
      orient: 'horizontal',
      truncated: false,
    });
  });

  it('keeps a forced horizontal label horizontal on a tall box', () => {
    const fitted = labelFit('Ab', undefined, { w: 20, h: 100 }, measure, 'horizontal');
    expect(fitted).toMatchObject({ text: 'Ab', orient: 'horizontal', size: 12 });
  });

  it('rotates when the ribbon is much taller than it is wide', () => {
    const fitted = labelFit('Roman Empire', 'Rome', { w: 20, h: 100 }, measure);
    expect(fitted?.orient).toBe('rotated');
    expect(fitted?.text).toBe('Roman Empire');
    expect(fitted?.size).toBe(12);
  });

  it('shrinks the full name before it switches to the short name', () => {
    const fitted = labelFit('ABCDEFGHIJ', 'AB', { w: 58, h: 30 }, measure);
    expect(fitted).toMatchObject({ text: 'ABCDEFGHIJ', size: 10, truncated: false });
  });

  it('uses the short name when the full name cannot fit at 10', () => {
    const fitted = labelFit('Roman Empire and more', 'Rome', { w: 80, h: 20 }, measure);
    expect(fitted).toMatchObject({ text: 'Rome', size: 12, orient: 'horizontal' });
  });

  it('ellipsizes on a word boundary and keeps diacritics', () => {
    const fitted = labelFit('Nāṣer the Great', undefined, { w: 40, h: 16 }, measure);
    expect(fitted).toEqual({
      text: 'Nāṣer…',
      size: 10,
      orient: 'horizontal',
      truncated: true,
    });
  });

  it('returns null when a single word cannot fit', () => {
    expect(
      labelFit('Mesopotamia', 'Mesopotamia', { w: 40, h: 16 }, measure),
    ).toBeNull();
    expect(labelFit('', undefined, { w: 80, h: 40 }, measure)).toBeNull();
  });

  it('is deterministic', () => {
    const box = { w: 80, h: 20 };
    expect(labelFit('Roman Empire', 'Rome', box, measure)).toEqual(
      labelFit('Roman Empire', 'Rome', box, measure),
    );
  });

  it('measures with a canvas when one exists', () => {
    const width = canvasTextMeasurer().measure('Rome', 12);
    expect(width).toBeGreaterThan(0);
    expect(Number.isFinite(width)).toBe(true);
  });
});
