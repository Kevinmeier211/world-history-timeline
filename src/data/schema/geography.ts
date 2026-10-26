import { z } from 'zod';

import { familyIdSchema, macroRegionSchema } from './primitives.ts';

export const posterKnotSchema = z.object({
  longitude: z.number().min(-180).max(180),
  x: z.number().min(0).max(1),
});

export const xZoneGuideSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9_]+$/),
    name: z.string().min(1),
    x0: z.number().min(0).max(1),
    x1: z.number().min(0).max(1),
  })
  .refine((zone) => zone.x0 < zone.x1, { message: 'zone x0 must be left of x1' });

export const geographySchema = z
  .object({
    knots: z.array(posterKnotSchema).min(2),
    macroRegions: z
      .array(
        z.object({
          id: macroRegionSchema,
          name: z.string().min(1),
          xZones: z.array(z.string().regex(/^[a-z0-9_]+$/)).min(1),
        }),
      )
      .length(7),
    xZones: z.array(xZoneGuideSchema).min(1),
    familyBias: z.partialRecord(familyIdSchema, z.number().min(-0.2).max(0.2)),
  })
  .refine(
    (geo) => {
      for (let i = 1; i < geo.knots.length; i += 1) {
        const prev = geo.knots[i - 1];
        const next = geo.knots[i];
        if (!prev || !next) return false;
        if (next.longitude <= prev.longitude || next.x < prev.x) return false;
      }
      return true;
    },
    { message: 'knots must increase in longitude and not decrease in x' },
  );

export type Geography = z.infer<typeof geographySchema>;
export type PosterKnot = z.infer<typeof posterKnotSchema>;
