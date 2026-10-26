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

const cited = {
  sourceIds: sourceIdListSchema,
  confidence: confidenceSchema,
  verification: verificationSchema,
  evidence: z.string().min(1).optional(),
};

export const relationTypeSchema = z.enum([
  'succession',
  'split',
  'merge',
  'conquest',
  'vassalage',
  'cultural_continuity',
  'migration',
  'disputed',
]);

export const relationSchema = z
  .object({
    id: idSchema,
    from: z.array(idSchema).min(1),
    to: z.array(idSchema).min(1),
    year: yearSchema,
    type: relationTypeSchema,
    share: z.array(z.number().positive().max(1)).optional(),
    note: z.string().min(1).optional(),
    ...cited,
  })
  .refine(
    (relation) => {
      if (!relation.share) return true;
      const sum = relation.share.reduce((total, part) => total + part, 0);
      return relation.share.length === relation.to.length && sum <= 1 + 1e-6;
    },
    { message: 'share must align with targets and sum to at most 1' },
  );

export const calloutKindSchema = z.enum([
  'event',
  'person',
  'invention',
  'monument',
  'text',
  'climate',
  'trade',
]);

export type CalloutKind = z.infer<typeof calloutKindSchema>;

export const calloutSchema = z
  .object({
    id: idSchema,
    title: z.string().min(1),
    year: yearSchema,
    endYear: yearSchema.optional(),
    kind: calloutKindSchema,
    attachTo: idSchema.optional(),
    geo: z.tuple([z.number(), z.number()]).optional(),
    importance: importanceSchema,
    blurb: z.string().refine(atMostWords(14), { message: 'blurb must be 1–14 words' }),
    mediaId: idSchema.optional(),
    ...cited,
  })
  .refine(
    (callout) => callout.endYear === undefined || callout.endYear >= callout.year,
    {
      message: 'endYear must not precede year',
    },
  );

export const bandTypeSchema = z.enum([
  'era',
  'epoch',
  'climate',
  'pandemic',
  'collapse',
  'golden_age',
  'war',
]);

export const bandSchema = z
  .object({
    id: idSchema,
    title: z.string().min(1),
    start: yearSchema,
    end: yearSchema,
    scope: z.union([z.literal('global'), z.array(macroRegionSchema).min(1)]),
    type: bandTypeSchema,
    importance: importanceSchema,
    description: z
      .string()
      .refine(atMostWords(60), { message: 'description must be 1–60 words' }),
    sourceIds: sourceIdListSchema,
    verification: verificationSchema,
    evidence: z.string().min(1).optional(),
  })
  .refine((band) => band.start < band.end, { message: 'start must be before end' });

export const routeSchema = z
  .object({
    id: idSchema,
    name: z.string().min(1),
    type: z.enum(['trade', 'migration', 'cultural']),
    start: yearSchema,
    end: yearSchema,
    waypoints: z
      .array(
        z.object({
          year: yearSchema,
          geo: z.tuple([z.number(), z.number()]).optional(),
          x: z.number().min(0).max(1).optional(),
          label: z.string().min(1).optional(),
        }),
      )
      .min(2),
    description: z
      .string()
      .refine(atMostWords(40), { message: 'route description must be 1–40 words' }),
    commodities: z.array(z.string().min(1)).optional(),
    importance: importanceSchema,
    ...cited,
  })
  .refine((route) => route.start < route.end, { message: 'start must be before end' });

export const sourceSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.union([z.literal(''), z.url()]),
  accessedISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  kind: z.enum(['museum', 'university', 'handbook', 'govt', 'encyclopedia']),
});

export const mediaSchema = z
  .object({
    id: idSchema,
    src: z.string().min(1),
    credit: z.object({
      creator: z.string().min(1),
      title: z.string().min(1),
      date: z.string().min(1),
      institution: z.string().min(1),
      accession: z.string().min(1).optional(),
    }),
    license: z.enum(['CC0', 'PD', 'CC-BY', 'CC-BY-SA']),
    licenseUrl: z.url(),
    licenseApproved: z.boolean(),
    retrieved: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
    crop: z.object({
      ratio: z.enum(['1:1', '4:5', '3:2']),
      focal: z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]),
      cutout: z.boolean().optional(),
    }),
    alt: z.string().min(1),
    caption: z.string().min(1),
    depiction: z.enum(['contemporary', 'later', 'reconstruction', 'photo']),
    color: hexColorSchema.optional(),
  })
  .refine(
    (item) => item.license === 'CC0' || item.license === 'PD' || item.licenseApproved,
    { message: 'CC-BY and CC-BY-SA require licenseApproved' },
  );

export const eraRegionNoteSchema = z.object({
  eraId: idSchema,
  macroRegion: macroRegionSchema,
  entries: z
    .array(
      z.object({
        range: z.string().min(1),
        text: z
          .string()
          .refine(atMostWords(60), { message: 'note text must be 1–60 words' }),
        sourceIds: sourceIdListSchema,
      }),
    )
    .min(1),
  whyItMatters: z
    .string()
    .refine(atMostWords(40), { message: 'whyItMatters must be 1–40 words' }),
  connections: z.array(z.string().min(1)).optional(),
});

export const lensSchema = z.enum([
  'politics',
  'trade',
  'climate',
  'technology',
  'religion',
  'art',
]);

export const tourSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  subtitle: z.string().min(1).optional(),
  waypoints: z
    .array(
      z.object({
        title: z.string().min(1),
        year: yearSchema,
        x: z.number().min(0).max(1).optional(),
        zoom: z.number().positive().optional(),
        lens: lensSchema.optional(),
        polityId: idSchema.optional(),
        calloutId: idSchema.optional(),
        narrative: z
          .string()
          .refine(atMostWords(70), { message: 'narrative must be 1–70 words' }),
        sourceIds: sourceIdListSchema,
        verification: verificationSchema.optional(),
      }),
    )
    .min(1),
});

export const presetSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  familyIds: z.array(familyIdSchema).optional(),
  macroRegions: z.array(macroRegionSchema).optional(),
  year: yearSchema.optional(),
  evidence: z.string().min(1).optional(),
});

export type Relation = z.infer<typeof relationSchema>;
export type Callout = z.infer<typeof calloutSchema>;
export type Band = z.infer<typeof bandSchema>;
export type Route = z.infer<typeof routeSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type MediaItem = z.infer<typeof mediaSchema>;
export type EraRegionNote = z.infer<typeof eraRegionNoteSchema>;
export type Tour = z.infer<typeof tourSchema>;
export type Preset = z.infer<typeof presetSchema>;
export type RelationType = z.infer<typeof relationTypeSchema>;
