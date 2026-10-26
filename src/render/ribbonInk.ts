import type { Confidence, Verification } from '../data/schema/primitives.ts';
import type { Dataset, Polity } from '../data/schema/index.ts';
import { uncertaintyGeometry } from '../layout/uncertainty.ts';
import type { LayoutLabel, LayoutResult, LayoutRibbon } from '../layout/types.ts';
import { formatRange } from '../lib/years.ts';

/** Parchment ink and paper. Ribbon fills do not change with the theme. */
export const LABEL_INK = '#2a241c';
export const LABEL_PAPER = '#f1e8d2';

const EDGE_DARKEN = 0.18;
const CAP_LIMIT = 10;

export interface RibbonPaint {
  id: string;
  familyId: string;
  name: string;
  dates: string;
  confidence: Confidence;
  verification: Verification;
  d: string;
  fill: string;
  edge: string;
  ariaLabel: string;
  y0: number;
  y1: number;
  fadePx: number;
  dashPath: string;
  dashArray: string;
  gradientId: string;
}

export interface LabelPaint {
  polityId: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  orientation: LayoutLabel['orientation'];
  fill: string;
  fitted: boolean;
  leader?: LayoutLabel['leader'];
}

function channels(hex: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const raw = match?.[1];
  if (!raw) return null;
  const value = Number.parseInt(raw, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function toHex(rgb: readonly [number, number, number]): string {
  return `#${rgb
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

/** 1px edge: the ribbon fill darkened 18%. An unreadable color is left as-is. */
export function darkenHex(fill: string, amount = EDGE_DARKEN): string {
  const rgb = channels(fill);
  if (!rgb) return fill;
  const scale = 1 - amount;
  return toHex([rgb[0] * scale, rgb[1] * scale, rgb[2] * scale]);
}

/** Rounded cap radius. The path already uses this; the rule stays explicit. */
export function capRadius(width: number): number {
  return Math.min(Math.max(0, width) / 2, CAP_LIMIT);
}

function linear(channel: number): number {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number | null {
  const rgb = channels(hex);
  if (!rgb) return null;
  return 0.2126 * linear(rgb[0]) + 0.7152 * linear(rgb[1]) + 0.0722 * linear(rgb[2]);
}

function contrast(left: string, right: string): number {
  const a = luminance(left);
  const b = luminance(right);
  if (a === null || b === null) return 0;
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
}

/** Ink or paper, whichever reads on the ribbon. Falls back to ink. */
export function labelFill(fill: string, ink: string, paper: string): string {
  if (!channels(fill)) return ink;
  return contrast(fill, paper) > contrast(fill, ink) ? paper : ink;
}

export function ribbonAria(
  name: string,
  start: number,
  end: number,
  confidence: Confidence,
  familyName: string,
): string {
  return `${name}, ${formatRange(start, end, confidence)}, ${familyName}`;
}

function paintOne(
  ribbon: LayoutRibbon,
  polity: Polity,
  familyName: string,
  fill: string,
): RibbonPaint | null {
  const first = ribbon.keyframes[0];
  const last = ribbon.keyframes.at(-1);
  if (!ribbon.d || !first || !last) return null;
  const years = polity.startUncertainty ?? 0;
  const cap = uncertaintyGeometry(
    ribbon.polityId,
    ribbon.keyframes.map((point) => ({ y: point.y, x: point.x, width: point.width })),
    years,
  );
  const ys = ribbon.keyframes.map((point) => point.y);
  return {
    id: ribbon.polityId,
    familyId: ribbon.familyId,
    name: polity.name,
    dates: formatRange(polity.start, polity.end, polity.confidence),
    confidence: polity.confidence,
    verification: polity.verification,
    d: ribbon.d,
    fill,
    edge: darkenHex(fill),
    ariaLabel: ribbonAria(
      polity.name,
      polity.start,
      polity.end,
      polity.confidence,
      familyName,
    ),
    y0: Math.min(...ys),
    y1: Math.max(...ys),
    fadePx: cap.fadePx,
    dashPath: cap.dashPath,
    dashArray: cap.dashArray,
    gradientId: cap.gradientId,
  };
}

/** Ribbons and fitted labels ready for the stage. Hover-only labels stay off the sheet. */
export function posterPaint(
  dataset: Dataset,
  result: LayoutResult,
): { ribbons: RibbonPaint[]; labels: LabelPaint[] } {
  const families = new Map<string, (typeof dataset.families)[number]>(
    dataset.families.map((family) => [family.id, family]),
  );
  const polities = new Map(dataset.polities.map((polity) => [polity.id, polity]));
  const ribbons = result.ribbons.flatMap((ribbon) => {
    const polity = polities.get(ribbon.polityId);
    const family = families.get(ribbon.familyId);
    if (!polity || !family) return [];
    const painted = paintOne(ribbon, polity, family.name, family.color);
    return painted ? [painted] : [];
  });
  const fills = new Map(ribbons.map((ribbon) => [ribbon.id, ribbon.fill]));
  const labels = result.labels.flatMap((label) => {
    if (!label.fitted) return [];
    const fill = fills.get(label.polityId);
    if (!fill) return [];
    return [
      {
        polityId: label.polityId,
        text: label.text,
        x: label.x,
        y: label.y,
        width: label.width,
        height: label.height,
        fontSize: label.fontSize,
        orientation: label.orientation,
        fill: labelFill(fill, LABEL_INK, LABEL_PAPER),
        fitted: true,
        leader: label.leader,
      },
    ];
  });
  return { ribbons, labels };
}
