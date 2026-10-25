import { z } from 'zod';

import { verificationSchema, yearSchema } from './primitives.ts';

export const climatePointSchema = z.object({
  year: yearSchema,
  tempDeltaC: z.number().finite(),
  label: z.string().min(1).optional(),
});

export const climateCurveSchema = z.object({
  baseline: z.string().min(1),
  verification: verificationSchema,
  evidence: z.string().min(1),
  points: z.array(climatePointSchema).min(2),
});

export type ClimateCurve = z.infer<typeof climateCurveSchema>;
