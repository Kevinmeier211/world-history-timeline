import { FIT_MAX, type Camera, type Size, type WorldBox } from '../camera/camera.ts';

/** One extra viewport of geometry stays mounted above and below the window. */
export const VISIBLE_PAD = 1;

export interface YSpan {
  id: string;
  y0: number;
  y1: number;
}

/** Scroll position as a camera translation. Design px are the SVG viewBox units. */
export function cameraFromScroll(
  scrollLeft: number,
  scrollTop: number,
  scale: number,
): Camera {
  return { x: -scrollLeft, y: -scrollTop, kx: scale, ky: scale };
}

/**
 * Scale that fits the design width across the column, capped at the fit-width maximum.
 * Narrow columns shrink below 0.8 so the sheet does not scroll sideways.
 */
export function stageScale(columnWidth: number, worldWidth: number): number {
  if (columnWidth <= 0 || worldWidth <= 0) return 1;
  return Math.min(FIT_MAX, columnWidth / worldWidth);
}

export function visibleWorld(
  camera: Camera,
  viewport: Size,
  padScreens = VISIBLE_PAD,
): WorldBox {
  const pad = Math.max(0, padScreens);
  const near = {
    x: (-viewport.width * pad - camera.x) / camera.kx,
    y: (-viewport.height * pad - camera.y) / camera.ky,
  };
  const far = {
    x: (viewport.width * (1 + pad) - camera.x) / camera.kx,
    y: (viewport.height * (1 + pad) - camera.y) / camera.ky,
  };
  const x = Math.min(near.x, far.x);
  const y = Math.min(near.y, far.y);
  return { x, y, width: Math.abs(far.x - near.x), height: Math.abs(far.y - near.y) };
}

export function hitsY(span: YSpan, world: WorldBox): boolean {
  return span.y1 >= world.y && span.y0 <= world.y + world.height;
}

export function cullY<T extends YSpan>(items: readonly T[], world: WorldBox): T[] {
  return items.filter((item) => hitsY(item, world));
}
