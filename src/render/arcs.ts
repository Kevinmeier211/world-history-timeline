import { LEFT_GUTTER, PLOT_WIDTH } from '../layout/constants.ts';
import { yOfYear } from '../layout/drift.ts';
import { toT } from '../lib/years.ts';

export interface ArcWaypoint {
  year: number;
  x: number;
}

function num(value: number): string {
  return String(Math.round(value * 100) / 100);
}

export interface ArcStyle {
  width: number;
  dash: string;
}

/** Static hairline. Hover drops the dash and thickens the stroke. */
export function arcStyle(
  type: 'trade' | 'migration' | 'cultural',
  hot: boolean,
): ArcStyle {
  if (hot) return { width: 2.5, dash: '' };
  if (type === 'migration') return { width: 1.25, dash: '2 3' };
  if (type === 'cultural') return { width: 1.5, dash: '1 2.5' };
  return { width: 1.5, dash: '6 4' };
}

/** A hairline through waypoints, ordered down the poster. Fewer than two points draw nothing. */
export function arcPath(waypoints: readonly ArcWaypoint[]): string {
  const ordered = waypoints
    .filter((point) => point.year !== 0 && point.x >= 0 && point.x <= 1)
    .sort((a, b) => toT(a.year) - toT(b.year));
  if (ordered.length < 2) return '';
  return ordered
    .map((point, index) => {
      const x = LEFT_GUTTER + point.x * PLOT_WIDTH;
      const y = yOfYear(point.year);
      return `${index === 0 ? 'M' : 'L'} ${num(x)} ${num(y)}`;
    })
    .join(' ');
}
