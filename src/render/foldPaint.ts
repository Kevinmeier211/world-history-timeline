import { interpolateRibbons } from '../layout/interpolate.ts';
import type { PosterPaint } from './posterModel.ts';
import type { RibbonPaint } from './ribbonInk.ts';

function frameRibbon(
  base: RibbonPaint,
  d: string,
  y0: number,
  y1: number,
  opacity: number | undefined,
): RibbonPaint {
  return {
    ...base,
    d,
    y0,
    y1,
    fadePx: 0,
    dashPath: '',
    opacity: opacity !== undefined && opacity < 1 ? opacity : undefined,
  };
}

/**
 * One frame of a fold tween. Endpoints are the solved paints. In between,
 * ribbon centerlines move and arrivals and departures fade. Labels and
 * connectors wait until the layout has settled.
 */
export function paintFrame(from: PosterPaint, to: PosterPaint, t: number): PosterPaint {
  if (t <= 0) return from;
  if (t >= 1) return to;
  const motion = interpolateRibbons(from.result.ribbons, to.result.ribbons, t);
  const paints = new Map<string, RibbonPaint>();
  for (const ribbon of to.ribbons) paints.set(ribbon.id, ribbon);
  for (const ribbon of from.ribbons) {
    if (!paints.has(ribbon.id)) paints.set(ribbon.id, ribbon);
  }
  const ribbons = motion.flatMap((ribbon) => {
    const base = paints.get(ribbon.polityId);
    const first = ribbon.keyframes[0];
    const last = ribbon.keyframes.at(-1);
    if (!base || !ribbon.d || !first || !last) return [];
    const ys = ribbon.keyframes.map((point) => point.y);
    return [
      frameRibbon(base, ribbon.d, Math.min(...ys), Math.max(...ys), ribbon.opacity),
    ];
  });
  return { ...to, ribbons, labels: [], connectors: [], callouts: [] };
}
