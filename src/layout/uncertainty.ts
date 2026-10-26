import { PX_PER_YEAR } from './constants.ts';
import { sampleCenterline, type RibbonPoint } from './ribbonGeometry.ts';

/** Dash pattern for an uncertain edge, in design px. */
export const UNCERTAINTY_DASH = '1.5 2.5';

export interface UncertaintyGeometry {
  /** Stable paint-server id. The same polity always gets the same id. */
  gradientId: string;
  /** How far the fade runs down the ribbon, in design px. */
  fadePx: number;
  dashArray: string;
  /** Dashed left and right edges of the uncertain start. Empty when there is no fade. */
  dashPath: string;
}

function fmt(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  if (Object.is(rounded, -0)) return '0.00';
  return rounded.toFixed(2);
}

function pointAt(samples: readonly RibbonPoint[], y: number): RibbonPoint | undefined {
  if (samples.length === 0) return undefined;
  const first = samples[0];
  const last = samples.at(-1);
  if (!first || !last) return undefined;
  if (y <= first.y) return first;
  if (y >= last.y) return last;
  for (let index = 0; index < samples.length - 1; index += 1) {
    const left = samples[index];
    const right = samples[index + 1];
    if (!left || !right || y > right.y) continue;
    const t = (y - left.y) / (right.y - left.y);
    return {
      y,
      x: left.x + (right.x - left.x) * t,
      width: left.width + (right.width - left.width) * t,
    };
  }
  return last;
}

function edge(points: readonly RibbonPoint[], side: -1 | 1): string {
  return points
    .map((point, index) => {
      const x = point.x + side * (point.width / 2);
      return `${index === 0 ? 'M' : 'L'} ${fmt(x)} ${fmt(point.y)}`;
    })
    .join(' ');
}

/**
 * Gradient fade and a dashed edge for an uncertain start.
 * `uncertaintyYears` is the ± span. Zero years leaves the ribbon solid.
 */
export function uncertaintyGeometry(
  id: string,
  points: readonly RibbonPoint[],
  uncertaintyYears: number,
  zoomY = 1,
): UncertaintyGeometry {
  const gradientId = `uncertainty-${id}`;
  const fadePx = Math.max(0, uncertaintyYears) * PX_PER_YEAR * Math.max(0, zoomY);
  if (fadePx === 0) {
    return { gradientId, fadePx: 0, dashArray: UNCERTAINTY_DASH, dashPath: '' };
  }
  const samples = sampleCenterline(points, 8);
  const start = samples[0];
  if (!start) {
    return { gradientId, fadePx, dashArray: UNCERTAINTY_DASH, dashPath: '' };
  }
  const endY = start.y + fadePx;
  const inside = samples.filter((sample) => sample.y < endY);
  const end = pointAt(samples, endY);
  const faded = end ? [...inside, end] : inside;
  if (faded.length < 2) {
    return { gradientId, fadePx, dashArray: UNCERTAINTY_DASH, dashPath: '' };
  }
  return {
    gradientId,
    fadePx,
    dashArray: UNCERTAINTY_DASH,
    dashPath: `${edge(faded, -1)} ${edge(faded, 1)}`,
  };
}
