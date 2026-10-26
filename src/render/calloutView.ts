import { atMostWords } from '../data/schema/primitives.ts';
import type { PictogramName } from './pictograms.ts';

export interface CalloutLeader {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface CalloutPlateBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** One card, marker, or plate the stage can draw. */
export interface CalloutViewModel {
  id: string;
  title: string;
  yearLabel: string;
  blurb: string;
  importance: number;
  x: number;
  y: number;
  width: number;
  height: number;
  marker: boolean;
  leader?: CalloutLeader;
  pictogram: PictogramName;
  plate?: CalloutPlateBox;
}

export interface CalloutType {
  title: number;
  body: number;
  rule: number;
  icon: number;
}

/** Higher importance uses a larger title and a heavier rule. Body stays at 11px. */
export function calloutType(importance: number): CalloutType {
  if (importance >= 5) return { title: 13, body: 11, rule: 1.5, icon: 22 };
  if (importance >= 4) return { title: 12, body: 11, rule: 1.25, icon: 20 };
  return { title: 11, body: 11, rule: 1, icon: 18 };
}

/** A callout blurb is one to fourteen words. Longer copy is not drawn. */
export function calloutBlurb(blurb: string): string {
  if (!atMostWords(14)(blurb)) throw new Error('blurb must be 1–14 words');
  return blurb.trim();
}

/** Compress a line only when the half-em estimate is wider than the box. */
export function textLengthFor(
  text: string,
  fontSize: number,
  width: number,
): number | undefined {
  if (text.length * fontSize * 0.5 <= width) return undefined;
  return width;
}
