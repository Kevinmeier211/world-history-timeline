import type { TextMeasurer } from './labelFit.ts';
import type { LayoutGlyph } from './types.ts';

/**
 * Rotated names stay one vertical column. The column is pinned to the
 * ribbon centerline at the middle of the name. A name that still crosses
 * another name slides along its own ribbon. Letters are not pulled apart
 * to follow a bend.
 */

export interface TrackPoint {
  x: number;
  y: number;
  width: number;
  breakBefore?: boolean;
}

export interface InkRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Seatable {
  polityId: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  orientation: 'rotated' | 'horizontal' | 'outside';
  fitted: boolean;
  glyphs?: readonly LayoutGlyph[];
}

type Seated<T> = T & { glyphs?: readonly LayoutGlyph[] };

const SEARCH_STEP = 8;
const BUCKET = 48;
const SLACK = 0.5;

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

/** Graphemes in reading order. A combining mark stays with its base. */
export function graphemes(text: string): string[] {
  return [...segmenter.segment(text)]
    .map((part) => part.segment)
    .filter((part) => part.length > 0);
}

/** Split a centerline on cull breaks. */
export function centerlineRuns(points: readonly TrackPoint[]): TrackPoint[][] {
  const runs: TrackPoint[][] = [];
  let current: TrackPoint[] = [];
  for (const point of points) {
    if (point.breakBefore && current.length > 0) {
      runs.push(current);
      current = [];
    }
    current.push(point);
  }
  if (current.length > 0) runs.push(current);
  return runs;
}

/** Centerline sample at `y`, or undefined when `y` is outside the run. */
export function sampleCenter(
  run: readonly TrackPoint[],
  y: number,
): { x: number; width: number } | undefined {
  const first = run[0];
  const last = run.at(-1);
  if (!first || !last) return undefined;
  if (y < first.y - 0.05 || y > last.y + 0.05) return undefined;
  const clamped = Math.min(last.y, Math.max(first.y, y));
  for (let index = 0; index < run.length - 1; index += 1) {
    const left = run[index];
    const right = run[index + 1];
    if (!left || !right || clamped > right.y) continue;
    const span = right.y - left.y;
    const t = span === 0 ? 0 : (clamped - left.y) / span;
    return {
      x: left.x + (right.x - left.x) * t,
      width: left.width + (right.width - left.width) * t,
    };
  }
  return { x: last.x, width: last.width };
}

function runCovering(
  runs: readonly (readonly TrackPoint[])[],
  top: number,
  height: number,
): readonly TrackPoint[] | undefined {
  const bottom = top + height;
  return runs.find((run) => {
    const first = run[0];
    const last = run.at(-1);
    return Boolean(first && last && first.y <= top + 0.05 && last.y + 0.05 >= bottom);
  });
}

/**
 * Place each grapheme of `text` in one vertical column on the centerline,
 * at the middle of `[top, top + height]`. Undefined when no single run
 * covers that span, so the caller keeps the column it already has.
 */
export function seatGlyphs(
  points: readonly TrackPoint[],
  top: number,
  height: number,
  text: string,
  fontSize: number,
  measure: TextMeasurer,
): LayoutGlyph[] | undefined {
  if (!(height > 0) || !(fontSize > 0)) return undefined;
  const run = runCovering(centerlineRuns(points), top, height);
  if (!run) return undefined;
  const anchor = sampleCenter(run, top + height / 2);
  if (!anchor) return undefined;
  const parts = graphemes(text);
  if (parts.length === 0) return undefined;
  const raw = parts.map((char) => Math.max(0, measure.measure(char, fontSize)));
  const sum = raw.reduce((total, advance) => total + advance, 0);
  if (!(sum > 0)) return undefined;
  const scale = height / sum;
  const glyphs: LayoutGlyph[] = [];
  let cursor = top;
  for (let index = 0; index < parts.length; index += 1) {
    const char = parts[index];
    const advance = (raw[index] ?? 0) * scale;
    if (!char || !(advance > 0)) return undefined;
    glyphs.push({ char, x: anchor.x, y: cursor + advance / 2, advance });
    cursor += advance;
  }
  return glyphs;
}

/** Ink of one seated grapheme. The box matches a 90° rotation about the center. */
export function glyphInk(glyphs: readonly LayoutGlyph[], fontSize: number): InkRect[] {
  if (!(fontSize > 0)) return [];
  return glyphs.flatMap((glyph) =>
    glyph.advance > 0
      ? [
          {
            x: glyph.x - fontSize / 2,
            y: glyph.y - glyph.advance / 2,
            width: fontSize,
            height: glyph.advance,
          },
        ]
      : [],
  );
}

function columnInk(label: Seatable): InkRect[] {
  if (!label.fitted || !(label.width > 0) || !(label.height > 0)) return [];
  if (label.glyphs && label.glyphs.length > 0)
    return glyphInk(label.glyphs, label.fontSize);
  return [{ x: label.x, y: label.y, width: label.width, height: label.height }];
}

function overlaps(left: InkRect, right: InkRect): boolean {
  const ox =
    Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x);
  const oy =
    Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y);
  return ox > SLACK && oy > SLACK;
}

interface Tagged {
  id: string;
  rect: InkRect;
}

function indexRects(labels: readonly Seatable[]): Map<number, Tagged[]> {
  const buckets = new Map<number, Tagged[]>();
  for (const label of labels) {
    for (const rect of columnInk(label)) {
      const start = Math.floor(rect.y / BUCKET);
      const end = Math.floor((rect.y + rect.height) / BUCKET);
      for (let key = start; key <= end; key += 1) {
        const tagged = { id: label.polityId, rect };
        const list = buckets.get(key);
        if (list) list.push(tagged);
        else buckets.set(key, [tagged]);
      }
    }
  }
  return buckets;
}

function hitsFor(
  id: string,
  rects: readonly InkRect[],
  buckets: ReadonlyMap<number, Tagged[]>,
): number {
  const seen = new Set<string>();
  for (const rect of rects) {
    const start = Math.floor(rect.y / BUCKET);
    const end = Math.floor((rect.y + rect.height) / BUCKET);
    for (let key = start; key <= end; key += 1) {
      for (const other of buckets.get(key) ?? []) {
        if (other.id === id || seen.has(other.id)) continue;
        if (overlaps(rect, other.rect)) seen.add(other.id);
      }
    }
  }
  return seen.size;
}

/** Fitted labels whose ink overlaps on both axes by more than half a pixel. */
export function labelHitPairs(labels: readonly Seatable[]): [string, string][] {
  const buckets = indexRects(labels);
  const pairs = new Set<string>();
  for (const label of labels) {
    for (const rect of columnInk(label)) {
      const start = Math.floor(rect.y / BUCKET);
      const end = Math.floor((rect.y + rect.height) / BUCKET);
      for (let key = start; key <= end; key += 1) {
        for (const other of buckets.get(key) ?? []) {
          if (other.id === label.polityId || !overlaps(rect, other.rect)) continue;
          const [left, right] =
            label.polityId < other.id
              ? [label.polityId, other.id]
              : [other.id, label.polityId];
          pairs.add(`${left}|${right}`);
        }
      }
    }
  }
  return [...pairs].map((pair) => {
    const [left, right] = pair.split('|');
    return [left ?? '', right ?? ''];
  });
}

/** Callout obstacles. Glyph ink is used once a rotated name is seated. */
export function labelObstacleBoxes(
  labels: readonly Seatable[],
): { id: string; x: number; y: number; width: number; height: number }[] {
  return labels.flatMap((label) =>
    columnInk(label).map((rect, index) => ({
      id:
        label.glyphs && label.glyphs.length > 0
          ? `${label.polityId}#${index}`
          : label.polityId,
      ...rect,
    })),
  );
}

function stripGlyphs<T extends Seatable>(label: T): Seated<T> {
  if (!label.glyphs) return label;
  const next = { ...label };
  delete next.glyphs;
  return next;
}

function labelHalf(label: Seatable): number {
  return label.orientation === 'horizontal' ? label.width / 2 : label.fontSize / 2;
}

/** Left edge of a label centered on the ribbon, or undefined. */
function columnLeft(
  points: readonly TrackPoint[],
  top: number,
  height: number,
  half: number,
): number | undefined {
  if (!(height > 0) || !(half > 0)) return undefined;
  const run = runCovering(centerlineRuns(points), top, height);
  if (!run) return undefined;
  const anchor = sampleCenter(run, top + height / 2);
  if (!anchor) return undefined;
  return anchor.x - half;
}

function canPin(label: Seatable): boolean {
  return (
    label.fitted &&
    (label.orientation === 'rotated' || label.orientation === 'horizontal')
  );
}

function pinColumn<T extends Seatable>(
  label: T,
  tracks: ReadonlyMap<string, readonly TrackPoint[]>,
  y = label.y,
): Seated<T> {
  const next = stripGlyphs({ ...label, y });
  if (!canPin(label)) return next;
  const x = columnLeft(
    tracks.get(label.polityId) ?? [],
    y,
    label.height,
    labelHalf(label),
  );
  if (x === undefined) return next;
  return { ...next, x };
}

function slideClear<T extends Seatable>(
  label: T,
  buckets: ReadonlyMap<number, Tagged[]>,
  tracks: ReadonlyMap<string, readonly TrackPoint[]>,
): Seated<T> {
  const currentHits = hitsFor(label.polityId, columnInk(label), buckets);
  if (currentHits === 0) return label;
  const points = tracks.get(label.polityId) ?? [];
  let best = label;
  let bestHits = currentHits;
  for (const run of centerlineRuns(points)) {
    const first = run[0];
    const last = run.at(-1);
    if (!first || !last) continue;
    const room = last.y - first.y - label.height;
    if (room < -0.05) continue;
    const end = first.y + Math.max(0, room);
    const stops = new Set<number>([label.y, end]);
    for (let y = first.y; y <= end + 0.05; y += SEARCH_STEP)
      stops.add(Math.min(y, end));
    const ordered = [...stops].sort(
      (left, right) => Math.abs(left - label.y) - Math.abs(right - label.y),
    );
    for (const y of ordered) {
      const x = columnLeft(points, y, label.height, labelHalf(label));
      if (x === undefined) continue;
      const candidate = stripGlyphs({ ...label, y, x });
      const hits = hitsFor(label.polityId, columnInk(candidate), buckets);
      if (hits < bestHits) {
        bestHits = hits;
        best = candidate;
        if (hits === 0) return best;
      }
    }
  }
  return bestHits < currentHits ? best : label;
}

/**
 * Pin fitted names to their ribbons. A rotated name stays one straight
 * column. A horizontal name stays one line. A name that still crosses
 * another fitted label slides along its ribbon. Text, size, and fit stay put.
 */
export function parkRotatedLabels<T extends Seatable>(
  labels: readonly T[],
  tracks: ReadonlyMap<string, readonly TrackPoint[]>,
): Seated<T>[] {
  let seated = labels.map((label) => pinColumn(label, tracks));
  for (let pass = 0; pass < 6; pass += 1) {
    const colliding = new Set(labelHitPairs(seated).flat());
    if (colliding.size === 0) break;
    let moved = false;
    const order = seated
      .map((label, index) => ({ label, index }))
      .filter((item) => colliding.has(item.label.polityId) && canPin(item.label))
      .sort((left, right) => left.label.polityId.localeCompare(right.label.polityId));
    for (const item of order) {
      const current = seated[item.index];
      if (!current) continue;
      const next = slideClear(current, indexRects(seated), tracks);
      if (next.y === current.y && next.x === current.x) continue;
      seated = seated.map((label, index) => (index === item.index ? next : label));
      moved = true;
    }
    if (!moved) break;
  }
  return seated;
}
