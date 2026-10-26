import families from '../data/families.json';
import type { Polity, Relation } from '../data/schema/index.ts';
import type { Geography } from '../data/schema/geography.ts';
import type { MacroRegion } from '../data/schema/primitives.ts';
import { fromT, formatYear, toT } from '../lib/years.ts';
import { placeCallouts } from './calloutPlacer.ts';
import { buildConnector, type ConnectorEndpoint } from './connectors.ts';
import {
  AXIS_END,
  AXIS_START,
  GRID_MAJOR,
  GRID_MINOR,
  LEFT_GUTTER,
  PLOT_WIDTH,
} from './constants.ts';
import { cullToFit } from './cull.ts';
import { applyDrift, yOfYear } from './drift.ts';
import { ribbonRuns, sampleAt, type DatedPoint } from './frames.ts';
import { stableHash } from './hash.ts';
import { canvasTextMeasurer } from './labelFit.ts';
import { solveLanes, type LaneSliceInput } from './laneSolver.ts';
import { selectLod, type LodItem } from './lod.ts';
import { projectX } from './projectX.ts';
import { ribbonPath } from './ribbonGeometry.ts';
import { placeRibbonLabel } from './shortLabel.ts';
import { buildSlices } from './slices.ts';
import type {
  LayoutInput,
  LayoutLabel,
  LayoutResult,
  LayoutRibbon,
  LayoutTick,
} from './types.ts';

const FAMILY_MACRO = new Map(
  (families as readonly { id: string; macroRegion: MacroRegion }[]).map((family) => [
    family.id,
    family.macroRegion,
  ]),
);

const measure = canvasTextMeasurer();
const cache = new Map<string, LayoutResult>();
const CACHE_LIMIT = 4;

/** Drop cached results. Tests use this so a fresh run is not a cache hit. */
export function clearLayoutCache(): void {
  cache.clear();
}

/** Memoized layout. The same input returns the same object. */
export function layout(input: LayoutInput): LayoutResult {
  const key = stableHash(input);
  const hit = cache.get(key);
  if (hit) return hit;
  const result = computeLayout(input);
  cache.set(key, result);
  if (cache.size > CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  return result;
}

interface ShownPolity {
  polity: Polity;
  opacity: number;
}

function shownPolities(input: LayoutInput): ShownPolity[] {
  const selected = input.polities.filter((polity) => {
    if (
      input.visibleFamilies.length > 0 &&
      !input.visibleFamilies.includes(polity.family)
    ) {
      return false;
    }
    if (input.visibleMacroRegions.length === 0) return true;
    const macro = FAMILY_MACRO.get(polity.family);
    return macro !== undefined && input.visibleMacroRegions.includes(macro);
  });
  const lod = selectLod(selected, input.viewport.zoomY);
  const byId = new Map(selected.map((polity) => [polity.id, polity]));
  return lod.flatMap((item) => {
    if (!item.collapsed) {
      const polity = byId.get(item.id);
      return polity ? [{ polity, opacity: item.opacity }] : [];
    }
    const members = item.memberIds.flatMap((id) => {
      const polity = byId.get(id);
      return polity ? [polity] : [];
    });
    const collapsed = collapsedPolity(item, members);
    return collapsed ? [{ polity: collapsed, opacity: item.opacity }] : [];
  });
}

function collapsedPolity(
  item: LodItem,
  members: readonly Polity[],
): Polity | undefined {
  const first = members[0];
  if (!first) return undefined;
  const importance = Math.min(5, Math.max(1, item.importance)) as Polity['importance'];
  return {
    ...first,
    id: item.id,
    name: item.id.replace(/^group:/, '').replaceAll('_', ' '),
    shortName: undefined,
    start: item.start,
    end: item.end,
    importance,
    weight: Math.max(...members.map((member) => member.weight)),
    group: undefined,
    spans: undefined,
    widthProfile: undefined,
  };
}

function midYear(start: number, end: number): number {
  return fromT(Math.round((toT(start) + toT(end)) / 2));
}

function desiredX(polity: Polity, year: number, geography: Geography): number {
  return (
    LEFT_GUTTER +
    projectX({
      knots: geography.knots,
      anchors: polity.anchor,
      year,
      familyBias: geography.familyBias[polity.family] ?? 0,
      xOverride: polity.xOverride,
    }) *
      PLOT_WIDTH
  );
}

function axisTicks(zoomY: number): LayoutTick[] {
  const ticks: LayoutTick[] = [];
  for (let year = AXIS_START; year <= AXIS_END; year += GRID_MINOR) {
    if (year === 0) continue;
    const major = year % GRID_MAJOR === 0;
    ticks.push({
      year,
      y: yOfYear(year, zoomY),
      label: major ? formatYear(year) : '',
      major,
    });
  }
  return ticks;
}

function endpoint(
  id: string,
  year: number,
  frames: ReadonlyMap<string, DatedPoint[]>,
  zoomY: number,
): ConnectorEndpoint | undefined {
  const points = frames.get(id);
  if (!points) return undefined;
  const sample = sampleAt(points, yOfYear(year, zoomY));
  if (!sample) return undefined;
  return { id, x: sample.x, y: sample.y, width: sample.width };
}

function computeLayout(input: LayoutInput): LayoutResult {
  const zoomY = input.viewport.zoomY;
  const shown = shownPolities(input);
  const polities = shown.map((item) => item.polity);
  const opacityById = new Map(shown.map((item) => [item.polity.id, item.opacity]));
  const byId = new Map(polities.map((polity) => [polity.id, polity]));
  const drawn = new Set(byId.keys());
  const relations = input.relations.filter(
    (relation) =>
      relation.from.every((id) => drawn.has(id)) &&
      relation.to.every((id) => drawn.has(id)),
  );
  const slices = buildSlices(polities, relations);
  const laneSlices: LaneSliceInput[] = slices
    .map((slice) => ({
      start: slice.start,
      end: slice.end,
      ribbons: slice.activeIds.flatMap((id) => {
        const polity = byId.get(id);
        if (!polity) return [];
        return [
          {
            id,
            familyId: polity.family,
            weight: polity.weight,
            importance: polity.importance,
            desiredX: desiredX(
              polity,
              midYear(slice.start, slice.end),
              input.geography,
            ),
          },
        ];
      }),
    }))
    .map((slice) => ({ ...slice, ribbons: cullToFit(slice.ribbons) }));
  const solved = solveLanes(laneSlices, relations);
  const drifted = applyDrift(
    solved.map((slice, index) => ({
      start: slice.start,
      end: slice.end,
      span: slices[index]?.span ?? 0,
      lanes: slice.lanes,
    })),
    zoomY,
  );
  const frames = new Map<string, DatedPoint[]>();
  const ribbons: LayoutRibbon[] = polities.flatMap((polity) => {
    const runs = ribbonRuns(polity, slices, drifted, input.geography, zoomY);
    const points = runs.flat();
    if (points.length === 0) return [];
    frames.set(polity.id, points);
    const opacity = opacityById.get(polity.id) ?? 1;
    return [
      {
        polityId: polity.id,
        familyId: polity.family,
        d: runs.map((run) => ribbonPath(run)).join(' '),
        ...(opacity < 1 ? { opacity } : {}),
        keyframes: runs.flatMap((run, runIndex) =>
          run.map((point, pointIndex) => ({
            y: point.y,
            x: point.x,
            width: point.width,
            ...(runIndex > 0 && pointIndex === 0 ? { breakBefore: true } : {}),
          })),
        ),
      },
    ];
  });
  const labels = labelPlacements(polities, frames);
  const connectors = relations.flatMap((relation) => {
    const built = connect(relation, byId, frames, zoomY);
    return built ? [built] : [];
  });
  const callouts = placeCallouts(
    input.callouts.map((callout) => ({
      id: callout.id,
      importance: callout.importance,
      x: anchorX(callout.attachTo, callout.year, frames, zoomY),
      y: yOfYear(callout.year, zoomY),
      mediaId: callout.mediaId,
    })),
    labels
      .filter((label) => label.fitted)
      .map((label) => ({
        id: label.polityId,
        x: label.x,
        y: label.y,
        width: label.width,
        height: label.height,
      })),
  );
  return {
    ribbons,
    connectors,
    labels,
    callouts: callouts.map((card) => ({
      calloutId: card.calloutId,
      x: card.x,
      y: card.y,
      width: card.width,
      height: card.height,
      placed: card.placed,
      marker: card.marker,
      leader: card.leader,
    })),
    plates: callouts.flatMap((card) =>
      card.plate ? [{ ...card.plate, calloutId: card.calloutId }] : [],
    ),
    bands: input.bands.map((band) => ({
      bandId: band.id,
      y0: yOfYear(band.start, zoomY),
      y1: yOfYear(band.end, zoomY),
    })),
    axis: { ticks: axisTicks(zoomY) },
    debug: {
      lanes: solved.flatMap((slice) =>
        slice.lanes.map((lane) => ({
          polityId: lane.id,
          x: lane.x,
          y0: yOfYear(slice.start, zoomY),
          y1: yOfYear(slice.end, zoomY),
        })),
      ),
      boxes: [],
      violations: [],
    },
  };
}

function labelPlacements(
  polities: readonly Polity[],
  frames: ReadonlyMap<string, DatedPoint[]>,
): LayoutLabel[] {
  return polities.flatMap((polity) => {
    const points = frames.get(polity.id);
    const first = points?.[0];
    const last = points?.at(-1);
    if (!points || !first || !last) return [];
    const placed = placeRibbonLabel(
      {
        id: polity.id,
        name: polity.name,
        shortName: polity.shortName,
        x: first.x,
        y: first.y,
        width: first.width,
        height: Math.max(0, last.y - first.y),
      },
      measure,
    );
    return [
      {
        polityId: placed.polityId,
        text: placed.text,
        x: placed.x,
        y: placed.y,
        width: placed.width,
        height: placed.height,
        fontSize: placed.fontSize,
        orientation: placed.orientation,
        fitted: placed.fitted,
        leader: placed.leader,
      },
    ];
  });
}

function connect(
  relation: Relation,
  byId: ReadonlyMap<string, Polity>,
  frames: ReadonlyMap<string, DatedPoint[]>,
  zoomY: number,
): LayoutResult['connectors'][number] | undefined {
  const ids = [...relation.from, ...relation.to];
  if (ids.some((id) => !frames.has(id))) return undefined;
  const endpoints = new Map<string, ConnectorEndpoint>();
  for (const id of relation.from) {
    const polity = byId.get(id);
    if (!polity) continue;
    const end = endpoint(id, polity.end, frames, zoomY);
    if (end) endpoints.set(id, end);
  }
  for (const id of relation.to) {
    const polity = byId.get(id);
    if (!polity) continue;
    const start = endpoint(id, polity.start, frames, zoomY);
    if (start) endpoints.set(id, start);
  }
  const built = buildConnector(relation, endpoints);
  return {
    relationId: relation.id,
    type: relation.type,
    d: built.d,
    sideAttach: built.sideAttach,
  };
}

function anchorX(
  attachTo: string | undefined,
  year: number,
  frames: ReadonlyMap<string, DatedPoint[]>,
  zoomY: number,
): number {
  if (!attachTo) return LEFT_GUTTER + PLOT_WIDTH / 2;
  const sample = sampleAt(frames.get(attachTo) ?? [], yOfYear(year, zoomY));
  return sample?.x ?? LEFT_GUTTER + PLOT_WIDTH / 2;
}
