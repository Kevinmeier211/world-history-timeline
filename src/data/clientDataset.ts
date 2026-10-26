import { bundledDataset } from './catalog.ts';
import overridesJson from './layoutOverrides.json' with { type: 'json' };
import { datasetSchema, type Dataset } from './schema/index.ts';
import { layoutOverridesSchema, type LayoutOverrides } from './schema/overrides.ts';

type JsonModule = Record<string, unknown>;

function rows(modules: JsonModule): unknown[] {
  return Object.keys(modules)
    .sort()
    .flatMap((key) => {
      const value = modules[key];
      if (!Array.isArray(value)) throw new Error(`${key} must be a JSON array`);
      return value;
    });
}

const polityFiles = import.meta.glob('./polities/*.json', {
  eager: true,
  import: 'default',
}) as JsonModule;
const relationFiles = import.meta.glob('./relations/*.json', {
  eager: true,
  import: 'default',
}) as JsonModule;
const calloutFiles = import.meta.glob('./callouts/*.json', {
  eager: true,
  import: 'default',
}) as JsonModule;
const bandFiles = import.meta.glob('./bands/*.json', {
  eager: true,
  import: 'default',
}) as JsonModule;
const routeFiles = import.meta.glob('./routes/*.json', {
  eager: true,
  import: 'default',
}) as JsonModule;
const noteFiles = import.meta.glob('./notes/*.json', {
  eager: true,
  import: 'default',
}) as JsonModule;
const tourFiles = import.meta.glob('./tours/*.json', {
  eager: true,
  import: 'default',
}) as JsonModule;
const presetFiles = import.meta.glob('./presets.json', {
  eager: true,
  import: 'default',
}) as JsonModule;
const sourceFiles = import.meta.glob('./sources.json', {
  eager: true,
  import: 'default',
}) as JsonModule;
const mediaFiles = import.meta.glob('./media.json', {
  eager: true,
  import: 'default',
}) as JsonModule;

let cached: Dataset | null = null;

/** The roster the poster paints. Same files as `scripts/load-dataset.ts`. */
export function clientDataset(): Dataset {
  if (cached) return cached;
  const base = bundledDataset();
  cached = datasetSchema.parse({
    ...base,
    polities: rows(polityFiles),
    relations: rows(relationFiles),
    callouts: rows(calloutFiles),
    bands: rows(bandFiles),
    routes: rows(routeFiles),
    notes: rows(noteFiles),
    tours: rows(tourFiles),
    presets: rows(presetFiles),
    sources: rows(sourceFiles),
    media: rows(mediaFiles),
  });
  return cached;
}

export function clientOverrides(): LayoutOverrides {
  return layoutOverridesSchema.parse(overridesJson);
}
