import { z } from 'zod';

export const confidenceSchema = z.enum([
  'secure',
  'conventional',
  'approximate',
  'debated',
]);

export const verificationSchema = z.enum([
  'unverified',
  'cross-checked',
  'primary-checked',
]);

export const importanceSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const macroRegionSchema = z.enum([
  'americas',
  'europe',
  'africa',
  'west_central_asia',
  'south_asia',
  'east_asia',
  'se_asia_oceania',
]);

export const familyIdSchema = z.enum([
  'andean',
  'mesoamerican',
  'north_american',
  'sub_saharan',
  'nile_egyptian',
  'mesopotamian',
  'persian_iranian',
  'levantine_semitic',
  'greek_byzantine',
  'latin_west',
  'celtic_germanic_norse',
  'slavic_steppe',
  'islamic_arab',
  'turkic_mongol',
  'indian',
  'chinese',
  'korean_japanese',
  'southeast_oceanian',
]);

export const idSchema = z.string().regex(/^[a-z][a-z0-9_]*$/, 'lowercase id');

export const yearSchema = z
  .number()
  .int()
  .refine((year) => year !== 0, { message: 'no year 0' });

export const sourceIdListSchema = z.array(idSchema).min(1);

export const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function atMostWords(max: number) {
  return (text: string) => wordCount(text) <= max && wordCount(text) >= 1;
}

export type Confidence = z.infer<typeof confidenceSchema>;
export type Verification = z.infer<typeof verificationSchema>;
export type Importance = z.infer<typeof importanceSchema>;
export type MacroRegion = z.infer<typeof macroRegionSchema>;
export type FamilyId = z.infer<typeof familyIdSchema>;
