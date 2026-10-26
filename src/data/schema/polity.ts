import { z } from 'zod';

import {
  atMostWords,
  confidenceSchema,
  familyIdSchema,
  hexColorSchema,
  idSchema,
  importanceSchema,
  macroRegionSchema,
  sourceIdListSchema,
  verificationSchema,
  yearSchema,
} from './primitives.ts';

export const anchorSchema = z
  .object({
    year: yearSchema,
    geo: z
      .tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)])
      .optional(),
    xKey: z.string().min(1).optional(),
  })
  .refine((anchor) => anchor.geo !== undefined || anchor.xKey !== undefined, {
    message: 'anchor needs geo or xKey',
  });

export const widthKeyframeSchema = z.object({
  year: yearSchema,
  w: z.number().min(0.05).max(1),
});

export const xOverrideSchema = z.object({
  year: yearSchema,
  x: z.number().min(0).max(1),
});

export const multiRegionSpanSchema = z
  .object({
    macroRegion: macroRegionSchema,
    start: yearSchema,
    end: yearSchema,
    weight: z.number().min(0.05).max(1).optional(),
  })
  .refine((span) => span.start < span.end, {
    message: 'span start must be before end',
  });

export const rulerSchema = z.object({
  name: z.string().min(1),
  reign: z.string().min(1),
  title: z.string().min(1).optional(),
});

export const endpointNoteSchema = z.object({
  label: z.string().min(1),
  year: yearSchema,
  note: z.string().min(1).optional(),
});

export const politySchema = z
  .object({
    id: idSchema,
    name: z.string().min(1),
    shortName: z.string().min(1).optional(),
    altNames: z.array(z.string().min(1)).optional(),
    family: familyIdSchema,
    start: yearSchema,
    end: yearSchema,
    startUncertainty: z.number().nonnegative().optional(),
    endUncertainty: z.number().nonnegative().optional(),
    confidence: confidenceSchema,
    dateNote: z.string().min(1).optional(),
    importance: importanceSchema,
    weight: z.number().min(0.05).max(1),
    kind: z.enum(['state', 'culture', 'period', 'empire', 'confederation', 'people']),
    anchor: z.array(anchorSchema).min(1),
    widthProfile: z.array(widthKeyframeSchema).optional(),
    spans: z.array(multiRegionSpanSchema).optional(),
    spanLanes: z.number().positive().optional(),
    ownerLane: z.string().min(1).optional(),
    group: z.string().min(1).optional(),
    summary: z
      .string()
      .refine(atMostWords(60), { message: 'summary must be 1–60 words' }),
    keyFacts: z.array(z.string().min(1)),
    sourceIds: sourceIdListSchema,
    rulers: z.array(rulerSchema).optional(),
    wikipediaTitle: z.string().min(1).optional(),
    mediaId: idSchema.optional(),
    verification: verificationSchema,
    evidence: z.string().min(1).optional(),
    xOverride: z.array(xOverrideSchema).optional(),
    endpoints: z.array(endpointNoteSchema).optional(),
  })
  .refine((polity) => polity.start < polity.end, {
    message: 'start must be before end',
  });

export const familySchema = z.object({
  id: familyIdSchema,
  name: z.string().min(1),
  color: hexColorSchema,
  macroRegion: macroRegionSchema,
  xBias: z.number().min(-0.2).max(0.2).optional(),
  xZones: z.array(z.string().regex(/^[a-z0-9_]+$/)).min(1),
});

export type Polity = z.infer<typeof politySchema>;
export type Family = z.infer<typeof familySchema>;
export type Anchor = z.infer<typeof anchorSchema>;
