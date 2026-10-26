import RBush from 'rbush';

import { DESIGN_WIDTH } from './constants.ts';

/** Appendix G card width. */
export const CALLOUT_W = 132;
/** Two text lines plus padding. Appendix G does not set a height. */
export const CALLOUT_H = 48;
/** Appendix G thumbnail reserved beside a card that has an image. */
export const THUMB = 56;
/** Space between the ribbon edge and the card. */
export const CALLOUT_EDGE = 4;
/** Minimum space between a card and another card or a ribbon label. */
export const BOX_GAP = 4;

const DY = [0, -24, 24, -48, 48, -72, 72] as const;
const PAD = BOX_GAP / 2;

export interface CalloutAnchor {
  id: string;
  importance: number;
  /** Ribbon-edge x the leader leaves from. */
  x: number;
  /** Y of the callout on that ribbon. */
  y: number;
  /** When set, a thumbnail is reserved on the outer side of the card. */
  mediaId?: string;
}

export interface ObstacleBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ObstacleLeader {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface CalloutLeader {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface CalloutPlate {
  mediaId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlacedCallout {
  calloutId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  placed: boolean;
  marker: boolean;
  leader?: CalloutLeader;
  plate?: CalloutPlate;
}

export interface ScoreInput {
  importance: number;
  dy: number;
  dist: number;
  collisions: number;
  labelOverlaps: number;
  leaderCrosses: number;
}

interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface Candidate {
  side: 'right' | 'left';
  dy: number;
  x: number;
  y: number;
  width: number;
  height: number;
  leader: CalloutLeader;
  plate?: CalloutPlate;
}

/** Appendix G score. Higher is a better slot. */
export function calloutScore(input: ScoreInput): number {
  return (
    10 * input.importance -
    0.2 * Math.abs(input.dy) -
    0.05 * input.dist -
    1000 * input.collisions -
    500 * input.labelOverlaps -
    100 * input.leaderCrosses
  );
}

function inflate(box: ObstacleBox, pad: number): BBox {
  return {
    minX: box.x - pad,
    minY: box.y - pad,
    maxX: box.x + box.width + pad,
    maxY: box.y + box.height + pad,
  };
}

function overlaps(a: BBox, b: BBox): boolean {
  return (
    a.minX < b.maxX - 1e-6 &&
    a.maxX > b.minX + 1e-6 &&
    a.minY < b.maxY - 1e-6 &&
    a.maxY > b.minY + 1e-6
  );
}

function orient(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): number {
  return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}

function segmentsCross(a: CalloutLeader, b: ObstacleLeader): boolean {
  const o1 = orient(a.x1, a.y1, a.x2, a.y2, b.x1, b.y1);
  const o2 = orient(a.x1, a.y1, a.x2, a.y2, b.x2, b.y2);
  const o3 = orient(b.x1, b.y1, b.x2, b.y2, a.x1, a.y1);
  const o4 = orient(b.x1, b.y1, b.x2, b.y2, a.x2, a.y2);
  return o1 * o2 < 0 && o3 * o4 < 0;
}

function inside(x: number, y: number, box: ObstacleBox): boolean {
  return x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height;
}

function hitsBox(line: ObstacleLeader, box: ObstacleBox): boolean {
  if (inside(line.x1, line.y1, box) || inside(line.x2, line.y2, box)) return true;
  const edges: ObstacleLeader[] = [
    { x1: box.x, y1: box.y, x2: box.x + box.width, y2: box.y },
    {
      x1: box.x,
      y1: box.y + box.height,
      x2: box.x + box.width,
      y2: box.y + box.height,
    },
    { x1: box.x, y1: box.y, x2: box.x, y2: box.y + box.height },
    { x1: box.x + box.width, y1: box.y, x2: box.x + box.width, y2: box.y + box.height },
  ];
  return edges.some((edge) => segmentsCross(line, edge));
}

function candidate(
  anchor: CalloutAnchor,
  side: 'right' | 'left',
  dy: number,
): Candidate | undefined {
  const thumb = anchor.mediaId !== undefined;
  const unionW = CALLOUT_W + (thumb ? THUMB : 0);
  const unionH = thumb ? Math.max(CALLOUT_H, THUMB) : CALLOUT_H;
  const centerY = anchor.y + dy;
  const unionX =
    side === 'right' ? anchor.x + CALLOUT_EDGE : anchor.x - CALLOUT_EDGE - unionW;
  const unionY = centerY - unionH / 2;
  if (unionX < 0 || unionX + unionW > DESIGN_WIDTH || unionY < 0) return undefined;
  const cardX = side === 'right' ? unionX : unionX + (thumb ? THUMB : 0);
  const cardY = centerY - CALLOUT_H / 2;
  const faceX = side === 'right' ? cardX : cardX + CALLOUT_W;
  const plate: CalloutPlate | undefined = anchor.mediaId
    ? {
        mediaId: anchor.mediaId,
        x: side === 'right' ? cardX + CALLOUT_W : unionX,
        y: centerY - THUMB / 2,
        width: THUMB,
        height: THUMB,
      }
    : undefined;
  return {
    side,
    dy,
    x: cardX,
    y: cardY,
    width: CALLOUT_W,
    height: CALLOUT_H,
    leader: { x1: anchor.x, y1: anchor.y, x2: faceX, y2: centerY },
    plate,
  };
}

function unionBox(slot: Candidate): ObstacleBox {
  const left = slot.plate ? Math.min(slot.x, slot.plate.x) : slot.x;
  const top = slot.plate ? Math.min(slot.y, slot.plate.y) : slot.y;
  const right = slot.plate
    ? Math.max(slot.x + slot.width, slot.plate.x + slot.plate.width)
    : slot.x + slot.width;
  const bottom = slot.plate
    ? Math.max(slot.y + slot.height, slot.plate.y + slot.plate.height)
    : slot.y + slot.height;
  return { id: 'union', x: left, y: top, width: right - left, height: bottom - top };
}

function marker(anchor: CalloutAnchor): PlacedCallout {
  return {
    calloutId: anchor.id,
    x: anchor.x - 3,
    y: anchor.y - 3,
    width: 6,
    height: 6,
    placed: false,
    marker: true,
  };
}

function dropped(anchor: CalloutAnchor): PlacedCallout {
  return {
    calloutId: anchor.id,
    x: anchor.x,
    y: anchor.y,
    width: 0,
    height: 0,
    placed: false,
    marker: false,
  };
}

/**
 * Place callouts greedily by importance. A slot that still collides becomes a
 * marker dot when importance is at least 4, and is dropped otherwise.
 */
export function placeCallouts(
  callouts: readonly CalloutAnchor[],
  labels: readonly ObstacleBox[] = [],
  leaders: readonly ObstacleLeader[] = [],
): PlacedCallout[] {
  const ordered = [...callouts].sort(
    (left, right) =>
      right.importance - left.importance || left.id.localeCompare(right.id),
  );
  const tree = new RBush<BBox>();
  const placedLeaders: ObstacleLeader[] = [...leaders];
  const results: PlacedCallout[] = [];
  for (const anchor of ordered) {
    let best: { slot: Candidate; score: number; blocked: boolean } | undefined;
    for (const side of ['right', 'left'] as const) {
      for (const dy of DY) {
        const slot = candidate(anchor, side, dy);
        if (!slot) continue;
        const box = unionBox(slot);
        const region = inflate(box, PAD);
        const collisions = tree
          .search(region)
          .filter((hit) => overlaps(region, hit)).length;
        const labelOverlaps = labels.filter((label) =>
          overlaps(region, inflate(label, PAD)),
        ).length;
        const leaderCrosses =
          placedLeaders.filter((line) => segmentsCross(slot.leader, line)).length +
          placedLeaders.filter((line) => hitsBox(line, box)).length;
        const blocked = collisions > 0 || labelOverlaps > 0;
        const score = calloutScore({
          importance: anchor.importance,
          dy,
          dist: Math.hypot(CALLOUT_EDGE, dy),
          collisions,
          labelOverlaps,
          leaderCrosses,
        });
        if (!best || score > best.score) best = { slot, score, blocked };
      }
    }
    if (!best || best.blocked) {
      results.push(anchor.importance >= 4 ? marker(anchor) : dropped(anchor));
      continue;
    }
    const box = unionBox(best.slot);
    tree.insert(inflate(box, PAD));
    placedLeaders.push(best.slot.leader);
    results.push({
      calloutId: anchor.id,
      x: best.slot.x,
      y: best.slot.y,
      width: best.slot.width,
      height: best.slot.height,
      placed: true,
      marker: false,
      leader: best.slot.leader,
      plate: best.slot.plate,
    });
  }
  return results;
}
