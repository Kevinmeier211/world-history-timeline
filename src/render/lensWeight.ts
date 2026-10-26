import type { LensId } from '../ui/frame.ts';

/** A lens dims what it is not about. It never returns 0, so the chart stays visible. */
export const LENS_FLOOR = 0.4;
export const POLITY_DIM = 0.55;

export type LensRole =
  | 'polity'
  | 'trade'
  | 'migration'
  | 'cultural'
  | 'climate'
  | 'pandemic'
  | 'collapse'
  | 'golden_age'
  | 'other';

const EMPHASIS: Record<Exclude<LensId, 'all'>, ReadonlySet<LensRole>> = {
  trade: new Set(['trade', 'migration']),
  climate: new Set(['climate', 'pandemic', 'collapse']),
  ideas: new Set(['golden_age', 'cultural']),
};

export function lensOpacity(lens: LensId, role: LensRole): number {
  if (lens === 'all') return 1;
  if (EMPHASIS[lens].has(role)) return 1;
  if (role === 'polity') return POLITY_DIM;
  return LENS_FLOOR;
}

export function bandRole(type: string): LensRole {
  if (
    type === 'climate' ||
    type === 'pandemic' ||
    type === 'collapse' ||
    type === 'golden_age'
  ) {
    return type;
  }
  return 'other';
}

/** Route types a lens reveals. All and climate draw no arcs. */
export function arcsForLens(lens: LensId): readonly LensRole[] {
  if (lens === 'trade') return ['trade', 'migration'];
  if (lens === 'ideas') return ['cultural'];
  return [];
}
