/**
 * Level of detail. Zoom bands are a layout default: the plan names a
 * threshold and a group collapse, and it does not set the zoom numbers.
 */

export interface LodPolity {
  id: string;
  importance: number;
  start: number;
  end: number;
  group?: string;
}

export interface LodItem {
  id: string;
  importance: number;
  start: number;
  end: number;
  collapsed: boolean;
  memberIds: readonly string[];
  /** 0 hides the draw. 1 is fully visible. */
  opacity: number;
}

export interface Crossfade {
  /** 0 is the collapsed group. 1 is the expanded members. */
  expand: number;
  collapsedOpacity: number;
  expandedOpacity: number;
}

/** Below this zoom, grouped polities draw as one ribbon. */
export const COLLAPSE_ZOOM = 0.85;
/** Half-width of the crossfade, in zoom units. */
export const CROSSFADE_BAND = 0.08;

/** Lowest importance still drawn at `zoom`. 1 shows everything. */
export function importanceThreshold(zoom: number): number {
  if (!Number.isFinite(zoom) || zoom <= 0) return 5;
  if (zoom >= 2) return 1;
  if (zoom >= 1.25) return 2;
  if (zoom >= 0.85) return 3;
  if (zoom >= 0.5) return 4;
  return 5;
}

/** Opacity of the collapsed ribbon and of its members around `COLLAPSE_ZOOM`. */
export function crossfade(zoom: number): Crossfade {
  const start = COLLAPSE_ZOOM - CROSSFADE_BAND;
  const end = COLLAPSE_ZOOM + CROSSFADE_BAND;
  const expand = Math.min(1, Math.max(0, (zoom - start) / (end - start)));
  return { expand, collapsedOpacity: 1 - expand, expandedOpacity: expand };
}

/**
 * Polities to draw at `zoom`. A group becomes one ribbon while the view is
 * collapsed. Members stay hidden until they clear the importance threshold,
 * then fade in across the boundary. An ungrouped polity has no fade.
 */
export function selectLod(polities: readonly LodPolity[], zoom: number): LodItem[] {
  const threshold = importanceThreshold(zoom);
  const fade = crossfade(zoom);
  const items: LodItem[] = [];
  const groups = new Map<string, LodPolity[]>();
  for (const polity of polities) {
    if (polity.group) {
      const members = groups.get(polity.group) ?? [];
      members.push(polity);
      groups.set(polity.group, members);
    }
    if (polity.importance < threshold) continue;
    const opacity = polity.group ? fade.expandedOpacity : 1;
    if (opacity <= 0) continue;
    items.push({
      id: polity.id,
      importance: polity.importance,
      start: polity.start,
      end: polity.end,
      collapsed: false,
      memberIds: [polity.id],
      opacity,
    });
  }
  if (fade.collapsedOpacity > 0) {
    for (const [group, members] of groups) {
      const sorted = [...members].sort((left, right) =>
        left.id.localeCompare(right.id),
      );
      items.push({
        id: `group:${group}`,
        importance: Math.max(...sorted.map((member) => member.importance)),
        start: Math.min(...sorted.map((member) => member.start)),
        end: Math.max(...sorted.map((member) => member.end)),
        collapsed: true,
        memberIds: sorted.map((member) => member.id),
        opacity: fade.collapsedOpacity,
      });
    }
  }
  return items.sort((left, right) => left.id.localeCompare(right.id));
}
