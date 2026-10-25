import { describe, expect, it } from 'vitest';

import {
  buildCatalog,
  bundledDataset,
  ERA_BINS,
  getBundledCatalog,
} from './catalog.ts';
import { bundledGeography } from './catalog.ts';
import type { Dataset, Polity, Relation } from './schema/index.ts';

function polity(
  partial: Partial<Polity> & Pick<Polity, 'id' | 'start' | 'end' | 'family'>,
): Polity {
  return {
    name: partial.id,
    confidence: 'conventional',
    importance: 3,
    weight: 0.4,
    kind: 'state',
    anchor: [{ year: partial.start, geo: [0, 0] }],
    summary: 'A placeholder polity used only by the catalog test.',
    keyFacts: [],
    sourceIds: ['met_essay'],
    verification: 'unverified',
    ...partial,
  };
}

function relation(
  partial: Pick<Relation, 'id' | 'from' | 'to' | 'year' | 'type'>,
): Relation {
  return {
    sourceIds: ['met_essay'],
    confidence: 'conventional',
    verification: 'unverified',
    ...partial,
  };
}

function dataset(polities: Polity[], relations: Relation[]): Dataset {
  const base = bundledDataset();
  return { ...base, polities, relations };
}

describe('buildCatalog', () => {
  const rome = polity({ id: 'rome', family: 'latin_west', start: -27, end: 476 });
  const west = polity({ id: 'west', family: 'latin_west', start: 395, end: 476 });
  const east = polity({ id: 'east', family: 'greek_byzantine', start: 395, end: 1453 });
  const han = polity({ id: 'han', family: 'chinese', start: -206, end: 220 });
  const data = dataset(
    [rome, west, east, han],
    [
      relation({
        id: 'rome_split',
        from: ['rome'],
        to: ['west', 'east'],
        year: 395,
        type: 'split',
      }),
    ],
  );
  const geography = bundledGeography();

  it('indexes family, relations, children, and eras, and memoizes', () => {
    const catalog = buildCatalog(data, geography);
    expect(catalog.byId.get('han')?.name).toBe('han');
    expect(catalog.byFamily.get('latin_west')?.map((item) => item.id)).toEqual([
      'rome',
      'west',
    ]);
    expect(catalog.relationsFrom.get('rome')).toHaveLength(1);
    expect(catalog.relationsTo.get('east')).toHaveLength(1);
    expect(catalog.childrenOf.get('rome')).toEqual(['west', 'east']);
    expect(catalog.parentsOf.get('west')).toEqual(['rome']);
    expect(
      catalog.byEra
        .get('1_500ce')
        ?.map((item) => item.id)
        .sort(),
    ).toEqual(['east', 'han', 'rome', 'west']);
    expect(catalog.byEra.get('1800_2000ce')).toBeUndefined();
    expect(buildCatalog(data, geography)).toBe(catalog);
    expect(ERA_BINS).toHaveLength(8);
  });

  it('loads the bundled family roster', () => {
    expect(bundledDataset().families).toHaveLength(18);
    expect(getBundledCatalog().byId.size).toBe(0);
  });
});
