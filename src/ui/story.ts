import { SCALE_MAX, SCALE_MIN } from '../camera/camera.ts';
import type { Tour } from '../data/schema/records.ts';
import type { ViewLink } from '../state/hashUrl.ts';
import type { LensId } from './frame.ts';

export const NARRATIVE_WORD_LIMIT = 70;

/**
 * Tour lenses that already exist on the chart.
 * Politics and technology have no chart lens, so those stops stay on All.
 * Art is the ideas lens.
 */
const CHART_LENS: Readonly<Record<string, LensId>> = {
  trade: 'trade',
  climate: 'climate',
  art: 'ideas',
};

export interface StoryStop {
  title: string;
  narrative: string;
  words: number;
  year: number;
  zoom?: number;
  lens?: LensId;
  highlight?: string;
  calloutId?: string;
  sourceIds: readonly string[];
}

export interface StorySource {
  id: string;
  title: string;
  url: string;
}

export function narrativeWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function chartLens(lens: string | undefined): LensId | undefined {
  if (!lens) return undefined;
  return CHART_LENS[lens];
}

export function clampStoryZoom(zoom: number | undefined): number | undefined {
  if (zoom === undefined || !Number.isFinite(zoom) || zoom <= 0) return undefined;
  const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, zoom));
  return Math.round(clamped * 1000) / 1000;
}

/** A stop highlights its polity, or the polity a callout is attached to. */
export function resolveStop(
  waypoint: Tour['waypoints'][number],
  attachTo: ReadonlyMap<string, string>,
): StoryStop {
  const highlight =
    waypoint.polityId ??
    (waypoint.calloutId ? attachTo.get(waypoint.calloutId) : undefined);
  return {
    title: waypoint.title,
    narrative: waypoint.narrative,
    words: narrativeWords(waypoint.narrative),
    year: waypoint.year,
    zoom: clampStoryZoom(waypoint.zoom),
    lens: chartLens(waypoint.lens),
    highlight,
    calloutId: waypoint.calloutId,
    sourceIds: waypoint.sourceIds,
  };
}

export function tourStops(
  tour: Tour,
  attachTo: ReadonlyMap<string, string>,
): StoryStop[] {
  return tour.waypoints.map((stop) => resolveStop(stop, attachTo));
}

/** Camera, lens, and highlight for one stop. Fold and pin stay as they are. */
export function applyStop(link: ViewLink, stop: StoryStop): ViewLink {
  const next: ViewLink = { ...link, fold: [...link.fold], y: stop.year };
  if (link.pin) next.pin = [...link.pin];
  if (stop.zoom !== undefined) next.z = stop.zoom;
  if (stop.highlight) next.sel = stop.highlight;
  else delete next.sel;
  if (stop.lens) next.lens = stop.lens;
  else delete next.lens;
  return next;
}

/** Index of the stop that matches the current camera, or -1. */
export function matchStop(stops: readonly StoryStop[], link: ViewLink): number {
  return stops.findIndex((stop) => {
    if (link.y !== stop.year) return false;
    if ((link.sel ?? undefined) !== stop.highlight) return false;
    if ((link.lens ?? undefined) !== stop.lens) return false;
    if (stop.zoom !== undefined && link.z !== stop.zoom) return false;
    return true;
  });
}

/** Titles for source ids that are in the catalog. Missing ids are omitted. */
export function storySources(
  ids: readonly string[],
  catalog: readonly { id: string; title: string; url: string }[],
): StorySource[] {
  const byId = new Map(catalog.map((source) => [source.id, source]));
  return ids.flatMap((id) => {
    const source = byId.get(id);
    return source ? [{ id: source.id, title: source.title, url: source.url }] : [];
  });
}
