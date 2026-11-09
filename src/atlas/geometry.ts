import { toT } from '../lib/years';
/** Display projection only. It never mutates a subject's historical interval. */
export function projectInterval(
  start: number | null,
  end: number | null,
  window: { start: number; end: number },
) {
  if (start === null && end === null) return null;
  const lo = toT(window.start),
    hi = toT(window.end),
    a = toT(start ?? end!),
    b = toT(end ?? start!);
  if (a > hi || b < lo) return null;
  return {
    left: (100 * (Math.max(lo, a) - lo)) / (hi - lo),
    width: (100 * (Math.min(hi, b) - Math.max(lo, a))) / (hi - lo),
    clippedStart: a < lo,
    clippedEnd: b > hi,
    unknownStart: start === null,
    unknownEnd: end === null,
  };
}
/** Split a schematic geographic path at the date line instead of drawing across the map. */
export function splitDateLine(route: [number, number][]): [number, number][][] {
  if (!route.length) return [];
  const segments: [number, number][][] = [[route[0]!]];
  for (let i = 1; i < route.length; i++) {
    const previous = route[i - 1]!,
      point = route[i]!;
    if (Math.abs(point[0] - previous[0]) > 180) {
      const goingEast = previous[0] > 0;
      const nextLon = point[0] + (goingEast ? 360 : -360);
      const edge = goingEast ? 180 : -180;
      const lat =
        previous[1] +
        ((point[1] - previous[1]) * (edge - previous[0])) / (nextLon - previous[0]);
      segments.at(-1)!.push([edge, lat]);
      segments.push([[-edge, lat], point]);
    } else segments.at(-1)!.push(point);
  }
  return segments;
}
