import type { Dataset } from '../data/schema/index.ts';
import { connectorStyle } from '../layout/connectors.ts';
import type { LayoutConnector } from '../layout/types.ts';

export interface ConnectorPaint {
  id: string;
  d: string;
  type: LayoutConnector['type'];
  fill: string;
  dasharray: string;
  hatch: boolean;
  y0: number;
  y1: number;
}

/** Vertical extent of an SVG path. Coordinates are x y pairs. */
export function pathYs(d: string): { y0: number; y1: number } {
  const nums = d.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
  const ys: number[] = [];
  for (let index = 1; index < nums.length; index += 2) {
    const y = nums[index];
    if (y !== undefined && Number.isFinite(y)) ys.push(y);
  }
  if (ys.length === 0) return { y0: 0, y1: 0 };
  return { y0: Math.min(...ys), y1: Math.max(...ys) };
}

/**
 * One paint record per routed connector. The hue is the source polity's family.
 * Stroke and hatch follow `connectorStyle`.
 */
export function connectorPaints(
  dataset: Dataset,
  connectors: readonly LayoutConnector[],
): ConnectorPaint[] {
  const families = new Map<string, string>(
    dataset.families.map((family) => [family.id, family.color]),
  );
  const familyOf = new Map(
    dataset.polities.map((polity) => [polity.id, polity.family]),
  );
  const relations = new Map(
    dataset.relations.map((relation) => [relation.id, relation]),
  );
  return connectors.flatMap((connector) => {
    if (!connector.d) return [];
    const relation = relations.get(connector.relationId);
    const source = relation?.from[0];
    const family = source ? familyOf.get(source) : undefined;
    const fill = (family ? families.get(family) : undefined) ?? '#6b6154';
    const style = connectorStyle(connector.type);
    const span = pathYs(connector.d);
    return [
      {
        id: connector.relationId,
        d: connector.d,
        type: connector.type,
        fill,
        dasharray: style.dasharray,
        hatch: style.hatch,
        y0: span.y0,
        y1: span.y1,
      },
    ];
  });
}
