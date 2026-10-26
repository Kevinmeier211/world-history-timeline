import { readFileSync, readdirSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { wordCount } from './schema/primitives.ts';

interface Band {
  id: string;
  start: number;
  end: number;
  description: string;
  verification: string;
  evidence?: string;
}

function bands(): Band[] {
  return readdirSync('src/data/bands')
    .filter((name) => name.endsWith('.json'))
    .flatMap(
      (name) => JSON.parse(readFileSync(`src/data/bands/${name}`, 'utf8')) as Band[],
    );
}

describe('1800 fan-out bands', () => {
  it('uses the African independence years and does not split the bundled war span', () => {
    const rows = bands();
    const decolonization = rows.find((band) => band.id === 'band_decolonization');
    const wars = rows.find((band) => band.id === 'band_world_wars');
    const industrial = rows.find((band) => band.id === 'band_enlightenment_industrial');
    expect(decolonization).toMatchObject({
      start: 1950,
      end: 1975,
      verification: 'unverified',
    });
    expect(wordCount(decolonization?.description ?? '')).toBeLessThanOrEqual(60);
    expect(decolonization?.evidence).toContain('not opened');
    expect(wars).toMatchObject({ start: 1914, end: 1991 });
    expect(industrial).toMatchObject({ start: 1700, end: 1900 });
    expect(rows.some((band) => band.id === 'band_wwi')).toBe(false);
    expect(rows.some((band) => band.id === 'band_wwii')).toBe(false);
    expect(rows.some((band) => band.id === 'band_cold_war')).toBe(false);
  });
});
