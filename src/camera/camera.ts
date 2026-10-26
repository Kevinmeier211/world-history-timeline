import { easeCubicOut } from 'd3-ease';
import { zoomIdentity, type ZoomTransform } from 'd3-zoom';

import { AXIS_END, BOTTOM_PAD, DESIGN_WIDTH } from '../layout/constants.ts';
import { yOfYear } from '../layout/drift.ts';

/** Wheel and pinch stay inside this range. Overview may sit below the fit-width clamp. */
export const SCALE_MIN = 0.2;
export const SCALE_MAX = 6;
/** Appendix G default fit-to-width. */
export const FIT_MIN = 0.8;
export const FIT_MAX = 1.6;
export const FLY_MS = 600;
const INERTIA_HALFLIFE_MS = 180;
const INERTIA_STOP = 0.02;

export interface Camera {
  x: number;
  y: number;
  kx: number;
  ky: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WorldBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WheelInput {
  deltaY: number;
  deltaMode?: number;
  ctrlKey?: boolean;
  shiftKey?: boolean;
}

export interface TouchPointer {
  screen: Point;
  world: Point;
}

export function identityCamera(): Camera {
  return {
    x: zoomIdentity.x,
    y: zoomIdentity.y,
    kx: zoomIdentity.k,
    ky: zoomIdentity.k,
  };
}

export function posterWorld(): WorldBox {
  return {
    x: 0,
    y: 0,
    width: DESIGN_WIDTH,
    height: yOfYear(AXIS_END) + BOTTOM_PAD,
  };
}

export function screenAt(camera: Camera, world: Point): Point {
  return { x: world.x * camera.kx + camera.x, y: world.y * camera.ky + camera.y };
}

export function worldAt(camera: Camera, screen: Point): Point {
  return { x: (screen.x - camera.x) / camera.kx, y: (screen.y - camera.y) / camera.ky };
}

/** Uniform cameras are a d3 zoom transform. Split x/y scales are not. */
export function uniformZoom(camera: Camera): ZoomTransform {
  return zoomIdentity.translate(camera.x, camera.y).scale(camera.kx);
}

/** Same exponent d3-zoom uses for `wheelDelta`, then `2 ** delta`. */
export function wheelFactor(deltaY: number, deltaMode = 0, ctrlKey = false): number {
  const delta =
    -deltaY * (deltaMode === 1 ? 0.05 : deltaMode ? 1 : 0.002) * (ctrlKey ? 10 : 1);
  return 2 ** delta;
}

function clampScale(k: number): number {
  if (!Number.isFinite(k)) return 1;
  return Math.min(SCALE_MAX, Math.max(SCALE_MIN, k));
}

function usable(viewport: Size, content: WorldBox): boolean {
  return (
    viewport.width > 0 && viewport.height > 0 && content.width > 0 && content.height > 0
  );
}

/** d3-zoom's constrain, applied per axis so time scale can differ from width scale. */
function constrainAxis(
  offset: number,
  k: number,
  view0: number,
  view1: number,
  world0: number,
  world1: number,
): number {
  const d0 = (view0 - offset) / k - world0;
  const d1 = (view1 - offset) / k - world1;
  const fix = d1 > d0 ? (d0 + d1) / 2 : Math.min(0, d0) || Math.max(0, d1);
  return offset + k * fix;
}

export function clampCamera(camera: Camera, viewport: Size, content: WorldBox): Camera {
  if (!usable(viewport, content)) return identityCamera();
  const kx = clampScale(camera.kx);
  const ky = clampScale(camera.ky);
  return {
    kx,
    ky,
    x: constrainAxis(
      camera.x,
      kx,
      0,
      viewport.width,
      content.x,
      content.x + content.width,
    ),
    y: constrainAxis(
      camera.y,
      ky,
      0,
      viewport.height,
      content.y,
      content.y + content.height,
    ),
  };
}

export function panBy(
  camera: Camera,
  dx: number,
  dy: number,
  viewport: Size,
  content: WorldBox,
): Camera {
  return clampCamera(
    { ...camera, x: camera.x + dx, y: camera.y + dy },
    viewport,
    content,
  );
}

export function wheelAt(
  camera: Camera,
  pointer: Point,
  input: WheelInput,
  viewport: Size,
  content: WorldBox,
): Camera {
  const factor = wheelFactor(
    input.deltaY,
    input.deltaMode ?? 0,
    input.ctrlKey ?? false,
  );
  const world = worldAt(camera, pointer);
  const kx = input.shiftKey ? camera.kx : clampScale(camera.kx * factor);
  const ky = clampScale(camera.ky * factor);
  return clampCamera(
    {
      kx,
      ky,
      x: pointer.x - world.x * kx,
      y: pointer.y - world.y * ky,
    },
    viewport,
    content,
  );
}

export function pinchTransform(
  start: Camera,
  pointers: readonly TouchPointer[],
  viewport: Size,
  content: WorldBox,
): Camera {
  const first = pointers[0];
  const second = pointers[1];
  if (!first) return clampCamera(start, viewport, content);
  if (!second) {
    return clampCamera(
      {
        ...start,
        x: first.screen.x - first.world.x * start.kx,
        y: first.screen.y - first.world.y * start.ky,
      },
      viewport,
      content,
    );
  }
  const screenSpan = Math.hypot(
    second.screen.x - first.screen.x,
    second.screen.y - first.screen.y,
  );
  const worldSpan = Math.hypot(
    second.world.x - first.world.x,
    second.world.y - first.world.y,
  );
  const k = worldSpan === 0 ? start.kx : clampScale(screenSpan / worldSpan);
  const screenMid = {
    x: (first.screen.x + second.screen.x) / 2,
    y: (first.screen.y + second.screen.y) / 2,
  };
  const worldMid = {
    x: (first.world.x + second.world.x) / 2,
    y: (first.world.y + second.world.y) / 2,
  };
  return clampCamera(
    {
      kx: k,
      ky: k,
      x: screenMid.x - worldMid.x * k,
      y: screenMid.y - worldMid.y * k,
    },
    viewport,
    content,
  );
}

export function fitWidth(viewport: Size, content: WorldBox): Camera {
  if (!usable(viewport, content)) return identityCamera();
  const k = Math.min(FIT_MAX, Math.max(FIT_MIN, viewport.width / content.width));
  return clampCamera(
    { x: -content.x * k, y: -content.y * k, kx: k, ky: k },
    viewport,
    content,
  );
}

export function fitOverview(viewport: Size, content: WorldBox): Camera {
  if (!usable(viewport, content)) return identityCamera();
  const k = clampScale(
    Math.min(viewport.width / content.width, viewport.height / content.height),
  );
  return clampCamera(
    {
      x: (viewport.width - content.width * k) / 2 - content.x * k,
      y: (viewport.height - content.height * k) / 2 - content.y * k,
      kx: k,
      ky: k,
    },
    viewport,
    content,
  );
}

export function flyTarget(request: {
  year: number;
  x: number;
  zoom: number;
  viewport: Size;
  content: WorldBox;
  focus?: Point;
}): Camera {
  const focus = request.focus ?? {
    x: request.viewport.width / 2,
    y: request.viewport.height / 2,
  };
  const k = clampScale(request.zoom);
  const worldY = yOfYear(request.year);
  return clampCamera(
    {
      x: focus.x - request.x * k,
      y: focus.y - worldY * k,
      kx: k,
      ky: k,
    },
    request.viewport,
    request.content,
  );
}

export function flyFrame(
  from: Camera,
  to: Camera,
  elapsedMs: number,
  reducedMotion: boolean,
): Camera {
  if (reducedMotion || elapsedMs >= FLY_MS) return to;
  const t = easeCubicOut(Math.max(0, elapsedMs) / FLY_MS);
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
    kx: from.kx + (to.kx - from.kx) * t,
    ky: from.ky + (to.ky - from.ky) * t,
  };
}

export function inertiaStep(
  camera: Camera,
  velocity: Point,
  dtMs: number,
  viewport: Size,
  content: WorldBox,
): { camera: Camera; velocity: Point; done: boolean } {
  if (dtMs <= 0 || Math.hypot(velocity.x, velocity.y) < INERTIA_STOP) {
    return { camera, velocity: { x: 0, y: 0 }, done: true };
  }
  const decay = 0.5 ** (dtMs / INERTIA_HALFLIFE_MS);
  const nextVelocity = { x: velocity.x * decay, y: velocity.y * decay };
  const moved = panBy(
    camera,
    nextVelocity.x * dtMs,
    nextVelocity.y * dtMs,
    viewport,
    content,
  );
  const done = Math.hypot(nextVelocity.x, nextVelocity.y) < INERTIA_STOP;
  return {
    camera: moved,
    velocity: done ? { x: 0, y: 0 } : nextVelocity,
    done,
  };
}
