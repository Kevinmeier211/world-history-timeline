import { useEffect, useRef, useState } from 'react';

import { clientDataset } from '../data/clientDataset.ts';
import type { LensId } from '../ui/frame.ts';
import { arcPath, arcStyle } from './arcs.ts';
import { arcsForLens } from './lensWeight.ts';

function arcAt(
  svg: SVGSVGElement,
  root: SVGGElement,
  clientX: number,
  clientY: number,
): string | null {
  if (typeof svg.createSVGPoint !== 'function') return null;
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;
  const local = point.matrixTransform(matrix.inverse());
  for (const node of root.querySelectorAll('.arc-hit')) {
    if (!(node instanceof SVGPathElement) || typeof node.isPointInStroke !== 'function')
      continue;
    try {
      if (node.isPointInStroke(local)) {
        return node.closest('[data-route]')?.getAttribute('data-route') ?? null;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function Arcs({ lens }: { lens: LensId }) {
  const [hot, setHot] = useState<string | null>(null);
  const root = useRef<SVGGElement>(null);
  const shown = new Set(arcsForLens(lens));
  const routes = clientDataset().routes.filter((route) => shown.has(route.type));
  useEffect(() => {
    const group = root.current;
    const svg = group?.ownerSVGElement;
    if (!group || !svg) return;
    const onMove = (event: PointerEvent) => {
      const next = arcAt(svg, group, event.clientX, event.clientY);
      setHot((prev) => (prev === next ? prev : next));
    };
    svg.addEventListener('pointermove', onMove);
    return () => svg.removeEventListener('pointermove', onMove);
  }, [lens, routes.length]);
  if (routes.length === 0) return null;
  return (
    <g className="arcs" ref={root}>
      {routes.map((route) => {
        const d = arcPath(
          route.waypoints.flatMap((point) =>
            point.x === undefined ? [] : [{ year: point.year, x: point.x }],
          ),
        );
        if (!d) return null;
        const style = arcStyle(route.type, hot === route.id);
        const hotClass = hot === route.id ? ' arc-hot' : '';
        return (
          <g key={route.id} className={`arc-group${hotClass}`} data-route={route.id}>
            <path
              className="arc-hit"
              d={d}
              strokeWidth={14}
              onPointerEnter={() => setHot(route.id)}
              onPointerLeave={() => setHot(null)}
            >
              <title>{route.name}</title>
            </path>
            <path
              className={`arc arc-${route.type}${hotClass}`}
              d={d}
              strokeWidth={style.width}
              strokeDasharray={style.dash || undefined}
            />
          </g>
        );
      })}
    </g>
  );
}
