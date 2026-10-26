import { describe, expect, it } from 'vitest';

import { formatRange, formatYear, fromT, parseYearQuery, toT } from './years.ts';

describe('continuous time', () => {
  it('maps the missing year 0 so -1 and 1 are one year apart', () => {
    expect(toT(-1)).toBe(0);
    expect(toT(1)).toBe(1);
    expect(toT(1) - toT(-1)).toBe(1);
    expect(toT(5) - toT(-5)).toBe(9);
    expect(fromT(toT(-3300))).toBe(-3300);
    expect(fromT(toT(2000))).toBe(2000);
    expect(fromT(0)).toBe(-1);
  });
});

describe('formatYear and formatRange', () => {
  it('prints BCE and CE and never a year 0', () => {
    expect(formatYear(-44)).toBe('44 BCE');
    expect(formatYear(1066)).toBe('1066 CE');
    expect(formatYear(-1)).toBe('1 BCE');
    expect(formatYear(1)).toBe('1 CE');
    expect(() => formatYear(0)).toThrow(/year 0/);
  });

  it('prefixes c. only when the date is not secure', () => {
    expect(formatRange(-27, 476, 'secure')).toBe('27 BCE – 476 CE');
    expect(formatRange(-500, -323, 'approximate')).toBe('c. 500–323 BCE');
    expect(formatRange(-44, 14, 'debated')).toBe('c. 44 BCE – 14 CE');
    expect(formatRange(800, 1200, 'conventional')).toBe('c. 800–1200 CE');
  });
});

describe('parseYearQuery', () => {
  it('parses the examples from the plan and rejects year 0', () => {
    expect(parseYearQuery('44 BCE')).toBe(-44);
    expect(parseYearQuery('1066')).toBe(1066);
    expect(parseYearQuery('c. 500 BCE')).toBe(-500);
    expect(parseYearQuery('c.500 bc')).toBe(-500);
    expect(parseYearQuery('AD 14')).toBe(14);
    expect(parseYearQuery('1 CE')).toBe(1);
    expect(parseYearQuery('0')).toBeNull();
    expect(parseYearQuery('year of four emperors')).toBeNull();
  });
});
