import type { LayoutOverrides } from '../data/schema/overrides.ts';
import type { PlacedCallout } from './calloutPlacer.ts';

/** Ribbon override label. `along` is drawn rotated. */
export type LabelForce = 'along' | 'horizontal' | 'outside';

export interface OverrideIndex {
  /** Poster-x pins that replace a polity's own `xOverride`. */
  pins: ReadonlyMap<string, readonly { year: number; x: number }[]>;
  /** Forced label orientation by polity id. */
  labels: ReadonlyMap<string, LabelForce>;
  /** Callout nudges in design px. */
  nudges: ReadonlyMap<string, { dx: number; dy: number }>;
}

/** Index the override file once per layout. */
export function indexOverrides(overrides: LayoutOverrides): OverrideIndex {
  const pins = new Map<string, readonly { year: number; x: number }[]>();
  const labels = new Map<string, LabelForce>();
  for (const row of overrides.ribbons) {
    if (row.x) pins.set(row.polityId, row.x);
    if (row.label) labels.set(row.polityId, row.label);
  }
  return {
    pins,
    labels,
    nudges: new Map(
      overrides.callouts.map((row) => [row.calloutId, { dx: row.dx, dy: row.dy }]),
    ),
  };
}

/**
 * Shift a placed card and its plate. The leader start stays on the ribbon.
 * A dropped card is left where the placer put it.
 */
export function nudgeCallout(
  card: PlacedCallout,
  nudge: { dx: number; dy: number } | undefined,
): PlacedCallout {
  if (!nudge || (!card.placed && !card.marker)) return card;
  const { dx, dy } = nudge;
  return {
    ...card,
    x: card.x + dx,
    y: card.y + dy,
    leader: card.leader
      ? {
          ...card.leader,
          x2: card.leader.x2 + dx,
          y2: card.leader.y2 + dy,
        }
      : undefined,
    plate: card.plate
      ? { ...card.plate, x: card.plate.x + dx, y: card.plate.y + dy }
      : undefined,
  };
}
