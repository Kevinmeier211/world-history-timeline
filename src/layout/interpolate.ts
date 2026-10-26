import type { LayoutKeyframe, LayoutRibbon } from './types.ts';
import { ribbonPath } from './ribbonGeometry.ts';

/** Ribbon tween. Reduced motion uses 0 and jumps. */
export const FOLD_MS = 300;

export function foldDuration(reduced: boolean): number {
  return reduced ? 0 : FOLD_MS;
}

function at(
  frames: readonly LayoutKeyframe[],
  y: number,
): { x: number; width: number } | null {
  const first = frames[0];
  const last = frames.at(-1);
  if (!first || !last || y < first.y || y > last.y) return null;
  for (let index = 0; index < frames.length - 1; index += 1) {
    const left = frames[index];
    const right = frames[index + 1];
    if (!left || !right || y > right.y) continue;
    const span = right.y - left.y;
    const u = span === 0 ? 0 : (y - left.y) / span;
    return {
      x: left.x + (right.x - left.x) * u,
      width: left.width + (right.width - left.width) * u,
    };
  }
  return { x: last.x, width: last.width };
}

function blend(
  left: LayoutRibbon,
  right: LayoutRibbon,
  u: number,
): LayoutRibbon | null {
  const ys = [
    ...new Set([...left.keyframes, ...right.keyframes].map((frame) => frame.y)),
  ].sort((a, b) => a - b);
  const points = ys.flatMap((y) => {
    const start = at(left.keyframes, y);
    const end = at(right.keyframes, y);
    if (start && end) {
      return [
        {
          y,
          x: start.x + (end.x - start.x) * u,
          width: start.width + (end.width - start.width) * u,
        },
      ];
    }
    const only = start ?? end;
    return only ? [{ y, x: only.x, width: only.width }] : [];
  });
  const d = ribbonPath(points);
  if (!d) return null;
  return {
    ...right,
    d,
    keyframes: points,
    opacity: right.opacity ?? left.opacity,
  };
}

/**
 * Centerlines move from `from` to `to`. `t` is 0 at the start and 1 at the
 * end. A ribbon that exists on only one side fades. The endpoints are the
 * inputs themselves, so their paths are not rebuilt.
 */
export function interpolateRibbons(
  from: readonly LayoutRibbon[],
  to: readonly LayoutRibbon[],
  t: number,
): readonly LayoutRibbon[] {
  if (!Number.isFinite(t) || t <= 0) return from;
  if (t >= 1) return to;
  const fromMap = new Map(from.map((ribbon) => [ribbon.polityId, ribbon]));
  const toMap = new Map(to.map((ribbon) => [ribbon.polityId, ribbon]));
  const ordered = [
    ...to.map((ribbon) => ribbon.polityId),
    ...from.map((ribbon) => ribbon.polityId).filter((id) => !toMap.has(id)),
  ];
  return ordered.flatMap((id) => {
    const left = fromMap.get(id);
    const right = toMap.get(id);
    if (left && right) {
      const next = blend(left, right, t);
      return next ? [next] : [];
    }
    if (left) return [{ ...left, opacity: (left.opacity ?? 1) * (1 - t) }];
    if (right) return [{ ...right, opacity: (right.opacity ?? 1) * t }];
    return [];
  });
}
