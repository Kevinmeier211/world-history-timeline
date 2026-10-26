import families from '../data/families.json';
import geography from '../data/geography.json';
import type { MacroRegion } from '../data/schema/primitives.ts';
import { AXIS_END, AXIS_START, PX_PER_YEAR, TOP_PAD } from '../layout/constants.ts';
import { fromT, toT } from '../lib/years.ts';

export interface SnapshotPolity {
  id: string;
  name: string;
  family: string;
  start: number;
  end: number;
  importance: number;
  spans?: readonly { macroRegion: MacroRegion; start: number; end: number }[];
}

export interface RegionSnapshot {
  id: MacroRegion;
  name: string;
  polities: readonly { id: string; name: string }[];
}

const familyRows = families as readonly { id: string; macroRegion: MacroRegion }[];

export const FAMILY_MACRO = new Map(
  familyRows.map((family) => [family.id, family.macroRegion]),
);

export const MACRO_REGIONS = (
  geography as { macroRegions: readonly { id: MacroRegion; name: string }[] }
).macroRegions;

/** Historical year under a design-space y. Year 0 is never returned. */
export function yearAtDesignY(y: number, zoomY = 1): number | null {
  if (!Number.isFinite(y) || !(zoomY > 0)) return null;
  const minT = toT(AXIS_START);
  const maxT = toT(AXIS_END);
  const t = minT + (y - TOP_PAD) / (PX_PER_YEAR * zoomY);
  if (!Number.isFinite(t)) return null;
  return fromT(Math.min(maxT, Math.max(minT, Math.round(t))));
}

/** Design y under a viewport clientY. `scale` is screen px per design px. */
export function designYFromClient(
  clientY: number,
  svgTop: number,
  scale: number,
  worldY = 0,
): number {
  if (!(scale > 0) || !Number.isFinite(clientY) || !Number.isFinite(svgTop))
    return worldY;
  return worldY + (clientY - svgTop) / scale;
}

/** Viewport y of a design y, relative to a host top of 0 when the line is fixed. */
export function lineOffset(
  designY: number,
  svgTop: number,
  scale: number,
  hostTop = 0,
  worldY = 0,
): number {
  return svgTop + (designY - worldY) * scale - hostTop;
}

function covers(start: number, end: number, year: number): boolean {
  return year !== 0 && start <= year && year <= end;
}

/**
 * Importance ≥ 3 polities active in each macro-region.
 * A polity is listed in its family region and in any span that covers the year.
 */
export function worldAtYear(
  year: number,
  polities: readonly SnapshotPolity[],
  regions: readonly { id: MacroRegion; name: string }[],
  familyMacro: ReadonlyMap<string, MacroRegion>,
): RegionSnapshot[] {
  const buckets = new Map<MacroRegion, { id: string; name: string }[]>();
  for (const region of regions) buckets.set(region.id, []);
  if (year !== 0) {
    for (const polity of polities) {
      if (polity.importance < 3 || !covers(polity.start, polity.end, year)) continue;
      const homes = new Set<MacroRegion>();
      const home = familyMacro.get(polity.family);
      if (home) homes.add(home);
      for (const span of polity.spans ?? []) {
        if (covers(span.start, span.end, year)) homes.add(span.macroRegion);
      }
      for (const region of homes) {
        const list = buckets.get(region);
        if (!list || list.some((item) => item.id === polity.id)) continue;
        list.push({ id: polity.id, name: polity.name });
      }
    }
  }
  return regions.map((region) => ({
    id: region.id,
    name: region.name,
    polities: [...(buckets.get(region.id) ?? [])].sort(
      (a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id),
    ),
  }));
}
