/** One ribbon end the connector can attach to. `y` is the end for a source and the start for a target. */
export interface ConnectorEndpoint {
  id: string;
  x: number;
  y: number;
  width: number;
}

/** Split, merge, or succession. `share` follows `to` and is scaled so the sum is at most 1. */
export interface ConnectorRelation {
  id: string;
  type: string;
  from: readonly string[];
  to: readonly string[];
  share?: readonly number[];
}

/** One conserved leg. `width` is the drawn flow. `slotWidth` is its place on the divided edge. */
export interface ConnectorFlow {
  id: string;
  width: number;
  slotWidth: number;
  sideAttach: boolean;
  /** Center of this leg on the source. */
  x0: number;
  y0: number;
  /** Center of this leg on the target. */
  x1: number;
  y1: number;
  /** Parent ribbon center and width, used when the leg leaves a side. */
  sourceX: number;
  sourceWidth: number;
}

/** A relation curve. `sideAttach` is true when any leg meets a side instead of an end. */
export interface ConnectorResult {
  relationId: string;
  type: string;
  d: string;
  sideAttach: boolean;
  flows: readonly ConnectorFlow[];
}

function fmt(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  if (Object.is(rounded, -0)) return '0.00';
  return rounded.toFixed(2);
}

/** Shares aligned with `ids`. Missing shares are equal. A sum above 1 is scaled down. */
export function flowShares(
  ids: readonly string[],
  share?: readonly number[],
): number[] {
  if (ids.length === 0) return [];
  const equal = ids.map(() => 1 / ids.length);
  if (!share || share.length !== ids.length) return equal;
  const sum = share.reduce((total, part) => total + part, 0);
  if (sum <= 0) return equal;
  if (sum > 1) return share.map((part) => part / sum);
  return [...share];
}

function cubic(x0: number, y0: number, x1: number, y1: number, midY: number): string {
  return `C ${fmt(x0)} ${fmt(midY)} ${fmt(x1)} ${fmt(midY)} ${fmt(x1)} ${fmt(y1)}`;
}

function legPath(flow: ConnectorFlow): string {
  const midY = (flow.y0 + flow.y1) / 2;
  const half = flow.width / 2;
  if (flow.sideAttach) {
    const sideX =
      flow.x1 < flow.sourceX
        ? flow.sourceX - flow.sourceWidth / 2
        : flow.sourceX + flow.sourceWidth / 2;
    const top = flow.y1 - half;
    const bottom = flow.y1 + half;
    return [
      `M ${fmt(sideX)} ${fmt(top)}`,
      cubic(sideX, top, flow.x1 - half, flow.y1, midY),
      `L ${fmt(flow.x1 + half)} ${fmt(flow.y1)}`,
      cubic(flow.x1 + half, flow.y1, sideX, bottom, midY),
      'Z',
    ].join(' ');
  }
  const left0 = flow.x0 - half;
  const right0 = flow.x0 + half;
  const left1 = flow.x1 - half;
  const right1 = flow.x1 + half;
  return [
    `M ${fmt(left0)} ${fmt(flow.y0)}`,
    cubic(left0, flow.y0, left1, flow.y1, midY),
    `L ${fmt(right1)} ${fmt(flow.y1)}`,
    cubic(right1, flow.y1, right0, flow.y0, midY),
    'Z',
  ].join(' ');
}

interface LegDraft {
  id: string;
  source: ConnectorEndpoint;
  target: ConnectorEndpoint;
  share: number;
  /** The edge that is divided into slots. */
  divided: ConnectorEndpoint;
}

function drafts(
  relation: ConnectorRelation,
  endpoints: ReadonlyMap<string, ConnectorEndpoint>,
): LegDraft[] {
  if (relation.type === 'merge') {
    const target = endpoints.get(relation.to[0] ?? '');
    if (!target) return [];
    const sources = relation.from.flatMap((id) => {
      const source = endpoints.get(id);
      return source ? [source] : [];
    });
    const budget = Math.min(1, Math.max(0, relation.share?.[0] ?? 1));
    const shares = flowShares(
      sources.map((source) => source.id),
      undefined,
    );
    return sources
      .slice()
      .sort((left, right) => left.x - right.x || left.id.localeCompare(right.id))
      .map((source, index) => ({
        id: source.id,
        source,
        target,
        share: (shares[index] ?? 0) * budget,
        divided: target,
      }));
  }
  const source = endpoints.get(relation.from[0] ?? '');
  if (!source) return [];
  const shares = flowShares(relation.to, relation.share);
  const legs: LegDraft[] = [];
  relation.to.forEach((id, index) => {
    const target = endpoints.get(id);
    if (!target) return;
    legs.push({ id, source, target, share: shares[index] ?? 0, divided: source });
  });
  return legs.sort(
    (left, right) => left.target.x - right.target.x || left.id.localeCompare(right.id),
  );
}

/**
 * Split and succession divide the parent end. Merge divides the child start.
 * A leg's drawn width is the smaller of its slot and the other ribbon, so the
 * legs cannot add up to more than the divided edge.
 */
export function buildConnector(
  relation: ConnectorRelation,
  endpoints: ReadonlyMap<string, ConnectorEndpoint>,
): ConnectorResult {
  const legs = drafts(relation, endpoints);
  const flows: ConnectorFlow[] = [];
  let cursor = 0;
  let started = false;
  for (const leg of legs) {
    if (!started) {
      cursor = leg.divided.x - leg.divided.width / 2;
      started = true;
    }
    const slotWidth = leg.divided.width * leg.share;
    const slotCenter = cursor + slotWidth / 2;
    cursor += slotWidth;
    const other = leg.divided === leg.source ? leg.target.width : leg.source.width;
    const width = Math.min(other, slotWidth);
    if (width <= 0) continue;
    const merge = leg.divided === leg.target;
    flows.push({
      id: leg.id,
      width,
      slotWidth,
      sideAttach: leg.target.y < leg.source.y,
      x0: merge ? leg.source.x : slotCenter,
      y0: leg.source.y,
      x1: merge ? slotCenter : leg.target.x,
      y1: leg.target.y,
      sourceX: leg.source.x,
      sourceWidth: leg.source.width,
    });
  }
  return {
    relationId: relation.id,
    type: relation.type,
    d: flows.map((flow) => legPath(flow)).join(' '),
    sideAttach: flows.some((flow) => flow.sideAttach),
    flows,
  };
}
