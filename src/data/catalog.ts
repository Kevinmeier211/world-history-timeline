import families from './families.json';
import geographyJson from './geography.json';
import { toT } from '../lib/years.ts';
import {
  datasetSchema,
  type Dataset,
  type Polity,
  type Relation,
} from './schema/index.ts';
import { geographySchema, type Geography } from './schema/geography.ts';

export const ERA_BINS = [
  { id: '3300_2000bce', start: -3300, end: -2000 },
  { id: '2000_1000bce', start: -2000, end: -1000 },
  { id: '1000_1bce', start: -1000, end: -1 },
  { id: '1_500ce', start: 1, end: 500 },
  { id: '500_1000ce', start: 500, end: 1000 },
  { id: '1000_1500ce', start: 1000, end: 1500 },
  { id: '1500_1800ce', start: 1500, end: 1800 },
  { id: '1800_2000ce', start: 1800, end: 2000 },
] as const;

export interface Catalog {
  dataset: Dataset;
  geography: Geography;
  byId: ReadonlyMap<string, Polity>;
  byFamily: ReadonlyMap<string, readonly Polity[]>;
  relationsFrom: ReadonlyMap<string, readonly Relation[]>;
  relationsTo: ReadonlyMap<string, readonly Relation[]>;
  childrenOf: ReadonlyMap<string, readonly string[]>;
  parentsOf: ReadonlyMap<string, readonly string[]>;
  byEra: ReadonlyMap<string, readonly Polity[]>;
}

const cache = new WeakMap<Dataset, Catalog>();

function pushMap<T>(map: Map<string, T[]>, key: string, value: T): void {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

function overlaps(polity: Polity, start: number, end: number): boolean {
  return toT(polity.start) <= toT(end) && toT(polity.end) >= toT(start);
}

export function buildCatalog(dataset: Dataset, geography: Geography): Catalog {
  const hit = cache.get(dataset);
  if (hit) return hit;

  const byId = new Map(dataset.polities.map((polity) => [polity.id, polity]));
  const byFamily = new Map<string, Polity[]>();
  const byEra = new Map<string, Polity[]>();
  for (const polity of dataset.polities) {
    pushMap(byFamily, polity.family, polity);
    for (const era of ERA_BINS) {
      if (overlaps(polity, era.start, era.end)) pushMap(byEra, era.id, polity);
    }
  }

  const relationsFrom = new Map<string, Relation[]>();
  const relationsTo = new Map<string, Relation[]>();
  const childrenOf = new Map<string, string[]>();
  const parentsOf = new Map<string, string[]>();
  for (const relation of dataset.relations) {
    for (const source of relation.from) {
      pushMap(relationsFrom, source, relation);
      for (const target of relation.to) pushMap(childrenOf, source, target);
    }
    for (const target of relation.to) {
      pushMap(relationsTo, target, relation);
      for (const source of relation.from) pushMap(parentsOf, target, source);
    }
  }

  const catalog: Catalog = {
    dataset,
    geography,
    byId,
    byFamily,
    relationsFrom,
    relationsTo,
    childrenOf,
    parentsOf,
    byEra,
  };
  cache.set(dataset, catalog);
  return catalog;
}

export function emptyLists(): Pick<
  Dataset,
  | 'polities'
  | 'relations'
  | 'callouts'
  | 'bands'
  | 'routes'
  | 'sources'
  | 'media'
  | 'notes'
  | 'tours'
  | 'presets'
> {
  return {
    polities: [],
    relations: [],
    callouts: [],
    bands: [],
    routes: [],
    sources: [],
    media: [],
    notes: [],
    tours: [],
    presets: [],
  };
}

export function bundledDataset(): Dataset {
  return datasetSchema.parse({ families, ...emptyLists() });
}

export function bundledGeography(): Geography {
  return geographySchema.parse(geographyJson);
}

let bundled: Catalog | null = null;

export function getBundledCatalog(): Catalog {
  if (!bundled) bundled = buildCatalog(bundledDataset(), bundledGeography());
  return bundled;
}
