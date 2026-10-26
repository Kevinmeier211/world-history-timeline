import { z } from 'zod';

import { idSchema } from './primitives.ts';

/** Licenses the pipeline may store. NC and ND are not in the list. */
export const mediaLicenseSchema = z.enum(['CC0', 'PD', 'CC-BY', 'CC-BY-SA']);

export const mediaSrcSchema = z
  .object({
    id: idSchema,
    subject: z.string().min(1),
    sourceUrl: z.url(),
    credit: z.object({
      creator: z.string().min(1),
      title: z.string().min(1),
      date: z.string().min(1),
      institution: z.string().min(1),
      accession: z.string().min(1).optional(),
    }),
    license: mediaLicenseSchema,
    licenseUrl: z.url(),
    licenseApproved: z.boolean(),
    alt: z.string().min(1),
    caption: z.string().min(1),
    depiction: z.enum(['contemporary', 'later', 'reconstruction', 'photo']),
    status: z.enum(['candidate', 'queued-gated', 'rejected']),
  })
  .refine(
    (item) => item.license === 'CC0' || item.license === 'PD' || item.licenseApproved,
    { message: 'CC-BY and CC-BY-SA require licenseApproved' },
  );

export const mediaSrcFileSchema = z.array(mediaSrcSchema);

export type MediaSrc = z.infer<typeof mediaSrcSchema>;
