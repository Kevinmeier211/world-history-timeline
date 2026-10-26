import type { RibbonPaint } from './ribbonInk.ts';

/** Copies keep the source y span so a pan still has to paint them. */
export function padRibbons(
  ribbons: readonly RibbonPaint[],
  count: number,
): RibbonPaint[] {
  if (count <= ribbons.length) return [...ribbons];
  const out: RibbonPaint[] = [];
  let copy = 0;
  while (out.length < count) {
    for (const ribbon of ribbons) {
      if (out.length >= count) break;
      out.push(
        copy === 0
          ? ribbon
          : {
              ...ribbon,
              id: `${ribbon.id}~${copy}`,
            },
      );
    }
    copy += 1;
    if (ribbons.length === 0) break;
  }
  return out;
}

export function benchRibbonCount(search: string): number {
  const raw = new URLSearchParams(search).get('bench');
  if (!raw) return 0;
  const count = Number(raw);
  if (!Number.isFinite(count) || count <= 0) return 0;
  return Math.min(800, Math.floor(count));
}

/** Nearest-rank percentile. `p` is 0–1. */
export function percentile(samples: readonly number[], p: number): number {
  if (samples.length === 0) return Number.POSITIVE_INFINITY;
  const sorted = [...samples].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil(sorted.length * p) - 1),
  );
  return sorted[index] ?? Number.POSITIVE_INFINITY;
}
