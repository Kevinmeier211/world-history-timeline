import type { Callout } from '../data/schema/records.ts';
import type { LayoutCallout, LayoutPlate } from '../layout/types.ts';
import { formatYear } from '../lib/years.ts';
import type { CalloutViewModel } from './calloutView.ts';
import { pictogramForKind } from './pictograms.ts';

export interface InkBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Extra room around a label so a marker dot does not sit on the painted glyphs. */
const MARKER_PAD = 12;

/** True when two boxes share more than `slack` px on both axes. */
export function boxesOverlap(a: InkBox, b: InkBox, slack = 0.5): boolean {
  return (
    a.x + a.width > b.x + slack &&
    b.x + b.width > a.x + slack &&
    a.y + a.height > b.y + slack &&
    b.y + b.height > a.y + slack
  );
}

function inflate(box: InkBox, pad: number): InkBox {
  return {
    id: box.id,
    x: box.x - pad,
    y: box.y - pad,
    width: box.width + pad * 2,
    height: box.height + pad * 2,
  };
}

function boxesOf(model: CalloutViewModel): InkBox[] {
  const boxes: InkBox[] = [
    {
      id: model.id,
      x: model.x,
      y: model.y,
      width: model.width,
      height: model.height,
    },
  ];
  if (model.plate) {
    boxes.push({
      id: `${model.id}:plate`,
      x: model.plate.x,
      y: model.plate.y,
      width: model.plate.width,
      height: model.plate.height,
    });
  }
  return boxes;
}

/** Join catalog copy to the placer. Dropped cards stay off the sheet. */
export function calloutModels(
  catalog: readonly Callout[],
  placed: readonly LayoutCallout[],
  plates: readonly LayoutPlate[],
): CalloutViewModel[] {
  const byId = new Map(catalog.map((callout) => [callout.id, callout]));
  const plateOf = new Map(plates.map((plate) => [plate.calloutId, plate]));
  const models: CalloutViewModel[] = [];
  for (const card of placed) {
    if (!card.placed && !card.marker) continue;
    const row = byId.get(card.calloutId);
    if (!row) continue;
    const plate = plateOf.get(card.calloutId);
    models.push({
      id: row.id,
      title: row.title,
      yearLabel: formatYear(row.year),
      blurb: row.blurb,
      importance: row.importance,
      x: card.x,
      y: card.y,
      width: card.width,
      height: card.height,
      marker: card.marker,
      leader: card.leader,
      pictogram: pictogramForKind(row.kind),
      plate: plate
        ? { x: plate.x, y: plate.y, width: plate.width, height: plate.height }
        : undefined,
    });
  }
  return models;
}

/**
 * Cards stay. A marker that would cover a card, a plate, or a label is omitted.
 * The placer already keeps cards clear of labels.
 */
export function seatedCallouts(
  models: readonly CalloutViewModel[],
  labels: readonly InkBox[],
): CalloutViewModel[] {
  const cards = models.filter((model) => !model.marker);
  const occupied = cards.flatMap(boxesOf).map((box) => inflate(box, MARKER_PAD));
  const paddedLabels = labels.map((label) => inflate(label, MARKER_PAD));
  const kept = [...cards];
  for (const marker of models) {
    if (!marker.marker) continue;
    const box = boxesOf(marker)[0];
    if (!box) continue;
    const hit =
      occupied.some((other) => boxesOverlap(box, other)) ||
      paddedLabels.some((label) => boxesOverlap(box, label));
    if (hit) continue;
    kept.push(marker);
    occupied.push(inflate(box, MARKER_PAD));
  }
  return kept;
}

/** Pairs of painted callout boxes, and each of those against a label. */
export function calloutHits(
  models: readonly CalloutViewModel[],
  labels: readonly InkBox[],
): string[] {
  const boxes = models.flatMap(boxesOf);
  const hits: string[] = [];
  for (let i = 0; i < boxes.length; i += 1) {
    const left = boxes[i];
    if (!left) continue;
    for (let j = i + 1; j < boxes.length; j += 1) {
      const right = boxes[j];
      if (right && boxesOverlap(left, right)) hits.push(`${left.id} x ${right.id}`);
    }
    for (const label of labels) {
      if (boxesOverlap(left, label)) hits.push(`${left.id} x ${label.id}`);
    }
  }
  return hits;
}
