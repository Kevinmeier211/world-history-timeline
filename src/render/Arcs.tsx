import { clientDataset } from '../data/clientDataset.ts';
import type { LensId } from '../ui/frame.ts';
import { arcPath } from './arcs.ts';
import { arcsForLens } from './lensWeight.ts';

export function Arcs({ lens }: { lens: LensId }) {
  const shown = new Set(arcsForLens(lens));
  const routes = clientDataset().routes.filter((route) => shown.has(route.type));
  if (routes.length === 0) return null;
  return (
    <g className="arcs">
      {routes.map((route) => {
        const d = arcPath(
          route.waypoints.flatMap((point) =>
            point.x === undefined ? [] : [{ year: point.year, x: point.x }],
          ),
        );
        if (!d) return null;
        return (
          <path
            key={route.id}
            className={`arc arc-${route.type}`}
            data-route={route.id}
            d={d}
          />
        );
      })}
    </g>
  );
}
