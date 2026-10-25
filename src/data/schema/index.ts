import { z } from 'zod';

import { familySchema, politySchema } from './polity.ts';
import {
  bandSchema,
  calloutSchema,
  eraRegionNoteSchema,
  mediaSchema,
  presetSchema,
  relationSchema,
  routeSchema,
  sourceSchema,
  tourSchema,
} from './records.ts';

export const datasetSchema = z.object({
  families: z.array(familySchema),
  polities: z.array(politySchema),
  relations: z.array(relationSchema),
  callouts: z.array(calloutSchema),
  bands: z.array(bandSchema),
  routes: z.array(routeSchema),
  sources: z.array(sourceSchema),
  media: z.array(mediaSchema),
  notes: z.array(eraRegionNoteSchema),
  tours: z.array(tourSchema),
  presets: z.array(presetSchema),
});

export type Dataset = z.infer<typeof datasetSchema>;

export * from './primitives.ts';
export * from './polity.ts';
export * from './records.ts';
export * from './geography.ts';
