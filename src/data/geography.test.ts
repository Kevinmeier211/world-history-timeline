import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { familySchema } from './schema/polity.ts';
import { geographySchema } from './schema/geography.ts';
import { interpolatePosterX } from './geography.ts';

const geography = geographySchema.parse(
  JSON.parse(readFileSync('src/data/geography.json', 'utf8')),
);
const families = familySchema
  .array()
  .parse(JSON.parse(readFileSync('src/data/families.json', 'utf8')));

describe('geography knots', () => {
  it('is schema-valid and monotone from the Atlantic edge to the date line', () => {
    expect(interpolatePosterX(-125, geography.knots)).toBe(0);
    expect(interpolatePosterX(180, geography.knots)).toBe(1);
    expect(interpolatePosterX(-200, geography.knots)).toBe(0);
    expect(interpolatePosterX(200, geography.knots)).toBe(1);
    let previous = -1;
    for (let longitude = -125; longitude <= 180; longitude += 5) {
      const x = interpolatePosterX(longitude, geography.knots);
      expect(x).toBeGreaterThanOrEqual(previous);
      previous = x;
    }
  });

  it('keeps family bias aligned with families.json', () => {
    for (const family of families) {
      expect(geography.familyBias[family.id]).toBe(family.xBias ?? 0);
    }
  });
});
