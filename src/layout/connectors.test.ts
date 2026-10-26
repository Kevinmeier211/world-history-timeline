import { describe, expect, it } from 'vitest';

import {
  buildConnector,
  type ConnectorEndpoint,
  type ConnectorFlow,
} from './connectors.ts';

function ends(rows: readonly ConnectorEndpoint[]): Map<string, ConnectorEndpoint> {
  return new Map(rows.map((row) => [row.id, row]));
}

function edge(flow: ConnectorFlow, end: 'source' | 'target'): string {
  const x = end === 'source' ? flow.x0 : flow.x1;
  return (x - flow.width / 2).toFixed(2);
}

describe('connectors', () => {
  it('conserves a split and places shares by child x', () => {
    const result = buildConnector(
      {
        id: 'split-rome',
        type: 'split',
        from: ['empire'],
        to: ['east', 'west'],
        share: [0.4, 0.6],
      },
      ends([
        { id: 'empire', x: 500, y: 100, width: 100 },
        { id: 'west', x: 420, y: 200, width: 80 },
        { id: 'east', x: 640, y: 200, width: 80 },
      ]),
    );
    expect(result.flows.map((flow) => flow.id)).toEqual(['west', 'east']);
    expect(result.flows.map((flow) => flow.width)).toEqual([60, 40]);
    expect(result.flows.reduce((sum, flow) => sum + flow.width, 0)).toBeLessThanOrEqual(
      100,
    );
    expect(result.flows[0]?.x0).toBeCloseTo(480);
    expect(result.flows[1]?.x0).toBeCloseTo(530);
    expect(result.sideAttach).toBe(false);
    expect(result.d).toContain('150.00');
    expect(result.d).toContain(edge(result.flows[0]!, 'source'));
  });

  it('shrinks a flow to the child and scales shares that sum past 1', () => {
    const narrow = buildConnector(
      { id: 'succ', type: 'succession', from: ['a'], to: ['b'] },
      ends([
        { id: 'a', x: 200, y: 10, width: 80 },
        { id: 'b', x: 210, y: 40, width: 20 },
      ]),
    );
    expect(narrow.flows).toHaveLength(1);
    expect(narrow.flows[0]?.width).toBe(20);
    expect(narrow.flows[0]?.slotWidth).toBe(80);

    const scaled = buildConnector(
      { id: 'wide', type: 'split', from: ['p'], to: ['c', 'd'], share: [0.8, 0.8] },
      ends([
        { id: 'p', x: 100, y: 0, width: 100 },
        { id: 'c', x: 40, y: 50, width: 90 },
        { id: 'd', x: 160, y: 50, width: 90 },
      ]),
    );
    expect(scaled.flows.map((flow) => flow.slotWidth)).toEqual([50, 50]);
    expect(scaled.flows.reduce((sum, flow) => sum + flow.width, 0)).toBeLessThanOrEqual(
      100,
    );
  });

  it('fans a merge into the child without exceeding the child width', () => {
    const result = buildConnector(
      { id: 'spain', type: 'merge', from: ['aragon', 'castile'], to: ['spain'] },
      ends([
        { id: 'castile', x: 120, y: 100, width: 40 },
        { id: 'aragon', x: 280, y: 100, width: 40 },
        { id: 'spain', x: 200, y: 180, width: 50 },
      ]),
    );
    expect(result.flows.map((flow) => flow.id)).toEqual(['castile', 'aragon']);
    expect(result.flows.map((flow) => flow.width)).toEqual([25, 25]);
    expect(result.flows.reduce((sum, flow) => sum + flow.width, 0)).toBeLessThanOrEqual(
      50,
    );
    expect(result.flows[0]!.x1).toBeLessThan(result.flows[1]!.x1);
    expect(result.d).toContain('140.00');
  });

  it('attaches an overlapping child to the parent side', () => {
    const result = buildConnector(
      { id: 'overlap', type: 'succession', from: ['parent'], to: ['child'] },
      ends([
        { id: 'parent', x: 500, y: 100, width: 100 },
        { id: 'child', x: 200, y: 80, width: 30 },
      ]),
    );
    expect(result.sideAttach).toBe(true);
    expect(result.flows[0]?.sideAttach).toBe(true);
    expect(result.flows[0]?.width).toBe(30);
    expect(result.d).toContain('450.00');
    expect(result.d).toContain(edge(result.flows[0]!, 'target'));
  });

  it('is deterministic and skips a missing endpoint', () => {
    const relation = { id: 'part', type: 'split', from: ['p'], to: ['kept', 'gone'] };
    const known = ends([
      { id: 'p', x: 10, y: 0, width: 20 },
      { id: 'kept', x: 12, y: 30, width: 8 },
    ]);
    const once = buildConnector(relation, known);
    const twice = buildConnector(relation, known);
    expect(twice).toEqual(once);
    expect(once.flows.map((flow) => flow.id)).toEqual(['kept']);
    const missing = buildConnector(
      { id: 'none', type: 'split', from: ['missing'], to: ['kept'] },
      known,
    );
    expect(missing.d).toBe('');
  });
});
