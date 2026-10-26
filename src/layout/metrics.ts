import type {
  LayoutCallout,
  LayoutConnector,
  LayoutLabel,
  LayoutRibbon,
} from './types.ts';

/** Solver slack. A gap above this is not an overlap. */
const OVERLAP_SLACK = 0.5;

export interface RibbonOverlap {
  /** Pairs whose drawn edges cross by more than the slack. */
  overlaps: number;
  /** Smallest adjacent edge gap. Null when nothing sits beside anything. */
  minGap: number | null;
}

interface Segment {
  id: string;
  y0: number;
  y1: number;
  x0: number;
  x1: number;
  w0: number;
  w1: number;
}

function segments(ribbons: readonly LayoutRibbon[]): Segment[] {
  const built: Segment[] = [];
  for (const ribbon of ribbons) {
    const frames = ribbon.keyframes;
    for (let index = 0; index < frames.length - 1; index += 1) {
      const left = frames[index];
      const right = frames[index + 1];
      if (!left || !right || right.breakBefore || right.y <= left.y) continue;
      built.push({
        id: ribbon.polityId,
        y0: left.y,
        y1: right.y,
        x0: left.x,
        x1: right.x,
        w0: left.width,
        w1: right.width,
      });
    }
  }
  return built;
}

/** Adjacent drawn ribbons. A shared endpoint is not a second sample. */
export function ribbonOverlap(ribbons: readonly LayoutRibbon[]): RibbonOverlap {
  const pieces = segments(ribbons);
  const marks = [...new Set(pieces.flatMap((piece) => [piece.y0, piece.y1]))].sort(
    (left, right) => left - right,
  );
  const pairs = new Set<string>();
  let minGap: number | null = null;
  for (const y of marks) {
    const present = new Map<string, { x: number; width: number }>();
    for (const piece of pieces) {
      if (y < piece.y0 || y > piece.y1) continue;
      const span = piece.y1 - piece.y0;
      const t = span === 0 ? 0 : (y - piece.y0) / span;
      present.set(piece.id, {
        x: piece.x0 + (piece.x1 - piece.x0) * t,
        width: piece.w0 + (piece.w1 - piece.w0) * t,
      });
    }
    const row = [...present.entries()].sort(
      (left, right) => left[1].x - right[1].x || left[0].localeCompare(right[0]),
    );
    for (let index = 0; index < row.length - 1; index += 1) {
      const left = row[index];
      const right = row[index + 1];
      if (!left || !right) continue;
      const gap = right[1].x - right[1].width / 2 - (left[1].x + left[1].width / 2);
      if (minGap === null || gap < minGap) minGap = gap;
      if (gap < -OVERLAP_SLACK) pairs.add([left[0], right[0]].sort().join('|'));
    }
  }
  return { overlaps: pairs.size, minGap };
}

export interface FitTier {
  fitted: number;
  total: number;
  rate: number;
}

/** Fitted labels divided by labels, per importance. Missing ids are skipped. */
export function labelFitByImportance(
  labels: readonly LayoutLabel[],
  importance: ReadonlyMap<string, number>,
): Map<number, FitTier> {
  const tiers = new Map<number, FitTier>();
  for (const label of labels) {
    const tier = importance.get(label.polityId);
    if (tier === undefined) continue;
    const row = tiers.get(tier) ?? { fitted: 0, total: 0, rate: 1 };
    row.total += 1;
    if (label.fitted) row.fitted += 1;
    row.rate = row.total === 0 ? 1 : row.fitted / row.total;
    tiers.set(tier, row);
  }
  return tiers;
}

export interface RoutingCounts {
  /** Drawn endpoints whose curve is missing or empty. */
  unroutable: number;
  /** Relations with an endpoint that was not drawn. */
  omitted: number;
}

export function relationRouting(
  relations: readonly { id: string; from: readonly string[]; to: readonly string[] }[],
  ribbons: readonly LayoutRibbon[],
  connectors: readonly LayoutConnector[],
): RoutingCounts {
  const drawn = new Set(ribbons.map((ribbon) => ribbon.polityId));
  const curves = new Map(
    connectors.map((connector) => [connector.relationId, connector]),
  );
  let unroutable = 0;
  let omitted = 0;
  for (const relation of relations) {
    const ends = [...relation.from, ...relation.to];
    if (!ends.every((id) => drawn.has(id))) {
      omitted += 1;
      continue;
    }
    const curve = curves.get(relation.id);
    if (!curve || curve.d.length === 0) unroutable += 1;
  }
  return { unroutable, omitted };
}

/** Steepest drawn centerline, in px of x per px of y. */
export function maxRibbonDrift(ribbons: readonly LayoutRibbon[]): number {
  let worst = 0;
  for (const ribbon of ribbons) {
    const frames = ribbon.keyframes;
    for (let index = 0; index < frames.length - 1; index += 1) {
      const left = frames[index];
      const right = frames[index + 1];
      if (!left || !right || right.breakBefore) continue;
      const dy = right.y - left.y;
      if (dy <= 0) continue;
      worst = Math.max(worst, Math.abs(right.x - left.x) / dy);
    }
  }
  return worst;
}

export function droppedCallouts(callouts: readonly LayoutCallout[]): {
  dropped: number;
  markers: number;
  placed: number;
} {
  return {
    dropped: callouts.filter((card) => !card.placed && !card.marker).length,
    markers: callouts.filter((card) => card.marker).length,
    placed: callouts.filter((card) => card.placed).length,
  };
}

export interface GateInput {
  overlaps: number;
  unroutable: number;
  /** Share of importance ≥ 3 labels that fitted. 1 when that tier is empty. */
  importance3Fit: number;
  /** Second layout pass, after the runtime has warmed up. */
  warmMs: number;
}

/** Names of the §6.4 gates that failed. Empty means the report may exit 0. */
export function gateFailures(input: GateInput): string[] {
  const failed: string[] = [];
  if (input.overlaps !== 0) failed.push('overlaps');
  if (input.unroutable !== 0) failed.push('unroutable');
  if (input.importance3Fit < 0.9) failed.push('importance3Fit');
  if (!(input.warmMs < 150)) failed.push('runtimeMs');
  return failed;
}
