import { z } from 'zod';

import { idSchema } from './primitives.ts';
import { xOverrideSchema } from './polity.ts';

/** How labelFit may be forced. T2.19 applies the value; this task only stores it. */
export const labelOrientationSchema = z.enum(['along', 'horizontal', 'outside']);

const reasonSchema = z.string().trim().min(8);

export const ribbonOverrideSchema = z
  .object({
    polityId: idSchema,
    x: z.array(xOverrideSchema).min(1).optional(),
    label: labelOrientationSchema.optional(),
    reason: reasonSchema,
  })
  .refine((row) => row.x !== undefined || row.label !== undefined, {
    message: 'ribbon override needs an x pin or a label orientation',
  })
  .refine(
    (row) => {
      const pins = row.x ?? [];
      for (let index = 1; index < pins.length; index += 1) {
        const prev = pins[index - 1];
        const next = pins[index];
        if (!prev || !next || next.year <= prev.year) return false;
      }
      return true;
    },
    { message: 'x pins must move forward in time' },
  );

export const calloutNudgeSchema = z.object({
  calloutId: idSchema,
  dx: z.number().finite(),
  dy: z.number().finite(),
  reason: reasonSchema,
});

export const layoutOverridesSchema = z
  .object({
    ribbons: z.array(ribbonOverrideSchema),
    callouts: z.array(calloutNudgeSchema),
  })
  .refine(
    (file) =>
      new Set(file.ribbons.map((row) => row.polityId)).size === file.ribbons.length,
    { message: 'ribbon overrides repeat a polity' },
  )
  .refine(
    (file) =>
      new Set(file.callouts.map((row) => row.calloutId)).size === file.callouts.length,
    { message: 'callout overrides repeat a callout' },
  );

export type LayoutOverrides = z.infer<typeof layoutOverridesSchema>;

export function overrideTargetIssues(
  overrides: LayoutOverrides,
  polityIds: ReadonlySet<string>,
  calloutIds: ReadonlySet<string>,
): string[] {
  const issues: string[] = [];
  for (const row of overrides.ribbons) {
    if (!polityIds.has(row.polityId))
      issues.push(`ribbon override ${row.polityId} is not a polity`);
  }
  for (const row of overrides.callouts) {
    if (!calloutIds.has(row.calloutId))
      issues.push(`callout override ${row.calloutId} is not a callout`);
  }
  return issues;
}
