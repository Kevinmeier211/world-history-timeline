import { SCALE_MAX, SCALE_MIN } from '../camera/camera.ts';
import { yOfYear } from '../layout/drift.ts';

const ZOOM_STEP = 1.2;
const PAN_FRACTION = 0.2;

export const MINIMAP_WIDTH = 56;

export type ChartCommand =
  'in' | 'out' | 'up' | 'down' | 'left' | 'right' | 'home' | 'end';

export function steppedScale(scale: number, direction: 1 | -1): number {
  const next = scale * (direction > 0 ? ZOOM_STEP : 1 / ZOOM_STEP);
  return Math.min(SCALE_MAX, Math.max(SCALE_MIN, next));
}

export function pointerDistance(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Scale after a two-finger pinch. A zero distance leaves the scale alone. */
export function pinchScale(
  startScale: number,
  startDistance: number,
  distance: number,
): number {
  if (!(startScale > 0) || !(startDistance > 0) || !(distance > 0)) return startScale;
  return Math.min(
    SCALE_MAX,
    Math.max(SCALE_MIN, startScale * (distance / startDistance)),
  );
}

/** Hash zoom is the camera scale. Otherwise the local multiplier rides on fit. */
export function cameraScale(fit: number, localZoom: number, hashZoom?: number): number {
  const raw =
    hashZoom !== undefined && Number.isFinite(hashZoom) ? hashZoom : fit * localZoom;
  if (!Number.isFinite(raw)) return SCALE_MIN;
  return Math.min(SCALE_MAX, Math.max(SCALE_MIN, raw));
}

/** Keep the same world point under the middle of the viewport. */
export function anchoredScroll(
  scroll: number,
  port: number,
  fromScale: number,
  toScale: number,
): number {
  if (fromScale <= 0) return 0;
  const center = (scroll + port / 2) / fromScale;
  return center * toScale - port / 2;
}

export function clampScroll(value: number, sheet: number, port: number): number {
  const max = Math.max(0, sheet - port);
  return Math.min(max, Math.max(0, value));
}

export function chartCommand(key: string, typing: boolean): ChartCommand | null {
  if (typing) return null;
  if (key === '+' || key === '=' || key === 'Add') return 'in';
  if (key === '-' || key === '_' || key === 'Subtract') return 'out';
  if (key === 'ArrowUp') return 'up';
  if (key === 'ArrowDown') return 'down';
  if (key === 'ArrowLeft') return 'left';
  if (key === 'ArrowRight') return 'right';
  if (key === 'Home') return 'home';
  if (key === 'End') return 'end';
  return null;
}

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

export function panScroll(
  command: ChartCommand,
  scroll: { top: number; left: number },
  port: { width: number; height: number },
  sheet: { width: number; height: number },
): { top: number; left: number } {
  const stepY = port.height * PAN_FRACTION;
  const stepX = port.width * PAN_FRACTION;
  if (command === 'home') return { top: 0, left: scroll.left };
  if (command === 'end')
    return {
      top: clampScroll(sheet.height, sheet.height, port.height),
      left: scroll.left,
    };
  if (command === 'up')
    return {
      top: clampScroll(scroll.top - stepY, sheet.height, port.height),
      left: scroll.left,
    };
  if (command === 'down')
    return {
      top: clampScroll(scroll.top + stepY, sheet.height, port.height),
      left: scroll.left,
    };
  if (command === 'left')
    return {
      top: scroll.top,
      left: clampScroll(scroll.left - stepX, sheet.width, port.width),
    };
  if (command === 'right')
    return {
      top: scroll.top,
      left: clampScroll(scroll.left + stepX, sheet.width, port.width),
    };
  return scroll;
}

export function minimapHeight(worldWidth: number, worldHeight: number): number {
  if (worldWidth <= 0) return MINIMAP_WIDTH;
  return MINIMAP_WIDTH * (worldHeight / worldWidth);
}

export function viewportRect(
  scrollTop: number,
  portHeight: number,
  scale: number,
  worldHeight: number,
  mapHeight: number,
): { y: number; height: number } {
  if (scale <= 0 || worldHeight <= 0 || mapHeight <= 0)
    return { y: 0, height: mapHeight };
  const y0 = (scrollTop / scale / worldHeight) * mapHeight;
  const span = (portHeight / scale / worldHeight) * mapHeight;
  return { y: y0, height: Math.max(2, span) };
}

/** Extra sheet width only when the painted chart is wider than the column. */
export function sheetMinWidth(sheetWidth: number, columnWidth: number): number {
  if (sheetWidth <= columnWidth + 1) return 0;
  return sheetWidth;
}

export interface OverlayOffsets {
  top: number;
  right: number;
  bottom: number;
}

/** Pin chart chrome to the scrollport. `right` and `bottom` are viewport insets. */
export function overlayOffsets(
  port: { top: number; right: number; bottom: number },
  view: { width: number; height: number },
  margin = 8,
): OverlayOffsets {
  return {
    top: port.top + margin,
    right: Math.max(margin, view.width - port.right + margin),
    bottom: Math.max(margin, view.height - port.bottom + margin),
  };
}

const FLY_SCROLL_MS = 600;

/** Scroll so `year` sits at the vertical center of the port. */
export function scrollTopForYear(
  year: number,
  scale: number,
  portHeight: number,
  sheetHeight: number,
): number {
  if (!Number.isInteger(year) || year === 0 || scale <= 0) return 0;
  return clampScroll(yOfYear(year) * scale - portHeight / 2, sheetHeight, portHeight);
}

/** Ease toward a scroll offset. Reduced motion arrives immediately. */
export function approachScroll(
  from: number,
  to: number,
  elapsedMs: number,
  reducedMotion: boolean,
): number {
  if (reducedMotion || elapsedMs >= FLY_SCROLL_MS || from === to) return to;
  const t = Math.max(0, elapsedMs) / FLY_SCROLL_MS;
  const eased = 1 - (1 - t) ** 3;
  return from + (to - from) * eased;
}

/** `fraction` is 0 at the top of the minimap and 1 at the bottom. */
export function scrollFromMinimap(
  fraction: number,
  worldHeight: number,
  portHeight: number,
  scale: number,
): number {
  const worldY = Math.min(1, Math.max(0, fraction)) * worldHeight;
  return worldY * scale - portHeight / 2;
}
