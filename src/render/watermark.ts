import { LEFT_GUTTER, PLOT_WIDTH } from '../layout/constants.ts';
import { interpolatePosterX } from '../data/geography.ts';
import type { PosterKnot } from '../data/schema/geography.ts';

/** Map frame. Antarctica below this is dropped so it does not become a bar. */
const NORTH = 84;
const SOUTH = -58;

export interface MapBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

type Ring = readonly (readonly [number, number])[];
type Polygon = readonly Ring[];

export function watermarkBox(sheetHeight: number): MapBox {
  const height = PLOT_WIDTH * ((NORTH - SOUTH) / 360);
  return {
    x: LEFT_GUTTER,
    y: Math.max(0, (sheetHeight - height) / 2),
    width: PLOT_WIDTH,
    height,
  };
}

function splitRing(ring: Ring): Ring[] {
  const parts: [number, number][][] = [];
  let current: [number, number][] = [];
  for (const point of ring) {
    const prev = current[current.length - 1];
    if (prev && Math.abs(point[0] - prev[0]) > 180 && current.length > 0) {
      parts.push(current);
      current = [];
    }
    current.push([point[0], point[1]]);
  }
  if (current.length > 0) parts.push(current);
  return parts;
}

function command(ring: Ring, knots: readonly PosterKnot[], box: MapBox): string | null {
  const pts: string[] = [];
  for (const [lon, lat] of ring) {
    if (lat < SOUTH || lat > NORTH) continue;
    const x = box.x + interpolatePosterX(lon, knots) * box.width;
    const y = box.y + ((NORTH - lat) / (NORTH - SOUTH)) * box.height;
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  if (pts.length < 3) return null;
  return `M${pts.join('L')}Z`;
}

/** Land rings to one SVG path in design px. Longitude uses the poster knots. */
export function landPath(
  polygons: readonly Polygon[],
  knots: readonly PosterKnot[],
  box: MapBox,
): string {
  const parts: string[] = [];
  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (const piece of splitRing(ring)) {
        const path = command(piece, knots, box);
        if (path) parts.push(path);
      }
    }
  }
  return parts.join('');
}
