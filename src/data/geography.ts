import type { PosterKnot } from './schema/geography.ts';

/** Piecewise-linear longitude → poster x. Clamps outside the first and last knots. */
export function interpolatePosterX(
  longitude: number,
  knots: readonly PosterKnot[],
): number {
  const first = knots[0];
  const last = knots[knots.length - 1];
  if (!first || !last) throw new Error('poster knots are empty');
  if (longitude <= first.longitude) return first.x;
  if (longitude >= last.longitude) return last.x;
  for (let i = 1; i < knots.length; i += 1) {
    const right = knots[i];
    const left = knots[i - 1];
    if (!right || !left) continue;
    if (longitude > right.longitude) continue;
    const span = right.longitude - left.longitude;
    const t = span === 0 ? 0 : (longitude - left.longitude) / span;
    return left.x + t * (right.x - left.x);
  }
  return last.x;
}
