import type { Band, Dataset } from '../data/schema/index.ts';
import type { Geography } from '../data/schema/geography.ts';
import { LEFT_GUTTER, PLOT_WIDTH, RIGHT_GUTTER } from '../layout/constants.ts';
import type { LayoutBand } from '../layout/types.ts';

export type BandHatch = 'horizontal' | 'dots' | 'collapse' | 'war' | 'none';

export interface BandPaint {
  id: string;
  type: Band['type'];
  hatch: BandHatch;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string | null;
  rotated: boolean;
}

const ROTATE_AT = 48;
const LABEL_SIZE = 11;

const HATCH: Record<Band['type'], BandHatch> = {
  climate: 'horizontal',
  pandemic: 'dots',
  collapse: 'collapse',
  war: 'war',
  epoch: 'none',
  golden_age: 'none',
  era: 'none',
};

export function bandHatch(type: Band['type']): BandHatch {
  return HATCH[type];
}

/** Plot span for a band. An unknown scope falls back to the full plot. */
export function bandBox(
  scope: Band['scope'],
  geography: Geography,
): { x: number; width: number } {
  if (scope === 'global') return { x: LEFT_GUTTER, width: PLOT_WIDTH };
  const zones = new Map(geography.xZones.map((zone) => [zone.id, zone]));
  const regions = new Map(geography.macroRegions.map((region) => [region.id, region]));
  let x0 = 1;
  let x1 = 0;
  for (const id of scope) {
    const region = regions.get(id);
    if (!region) continue;
    for (const zoneId of region.xZones) {
      const zone = zones.get(zoneId);
      if (!zone) continue;
      x0 = Math.min(x0, zone.x0);
      x1 = Math.max(x1, zone.x1);
    }
  }
  if (x1 <= x0) return { x: LEFT_GUTTER, width: PLOT_WIDTH };
  return { x: LEFT_GUTTER + x0 * PLOT_WIDTH, width: (x1 - x0) * PLOT_WIDTH };
}

/** Barlow Condensed caps are narrow, so a rotated margin title can keep more words. */
function textWidth(text: string): number {
  return text.length * LABEL_SIZE * 0.34;
}

function ellipsize(text: string, limit: number): string | null {
  if (limit < LABEL_SIZE) return null;
  if (textWidth(text) <= limit) return text;
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  let chosen = '';
  for (const word of words) {
    const next = chosen ? `${chosen} ${word}` : word;
    if (textWidth(`${next}…`) > limit) break;
    chosen = next;
  }
  if (chosen) return `${chosen}…`;
  let cut = text;
  while (cut.length > 1 && textWidth(`${cut.slice(0, -1)}…`) > limit)
    cut = cut.slice(0, -1);
  const clipped = cut.length > 1 ? `${cut.slice(0, -1)}…` : null;
  return clipped && textWidth(clipped) <= limit ? clipped : null;
}

/** Margin title. Tall bands rotate; short ones sit horizontally in the gutter. */
export function fitBandTitle(
  title: string,
  height: number,
): { text: string | null; rotated: boolean } {
  const rotated = height >= ROTATE_AT;
  const gutter = RIGHT_GUTTER - 16;
  const text = ellipsize(title, rotated ? height - 8 : gutter);
  if (text) return { text, rotated };
  return { text: ellipsize(title, gutter), rotated: false };
}

/** Cross-cutting bands. Poster era rows stay with the gutter guides. */
export function bandPaints(
  dataset: Dataset,
  layoutBands: readonly LayoutBand[],
  geography: Geography,
): BandPaint[] {
  const byId = new Map(dataset.bands.map((band) => [band.id, band]));
  return layoutBands.flatMap((span) => {
    const band = byId.get(span.bandId);
    if (!band || band.type === 'era') return [];
    const box = bandBox(band.scope, geography);
    const height = Math.max(0, span.y1 - span.y0);
    const label = fitBandTitle(band.title, height);
    return [
      {
        id: band.id,
        type: band.type,
        hatch: bandHatch(band.type),
        x: box.x,
        y: span.y0,
        width: box.width,
        height,
        label: label.text,
        rotated: label.rotated,
      },
    ];
  });
}
