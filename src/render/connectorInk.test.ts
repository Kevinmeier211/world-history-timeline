import { describe, expect, it } from 'vitest';

import { bundledDataset } from '../data/catalog.ts';
import type { RelationType } from '../data/schema/index.ts';
import { connectorStyle } from '../layout/connectors.ts';
import type { LayoutConnector } from '../layout/types.ts';
import { connectorPaints, pathYs } from './connectorInk.ts';

const TYPES: RelationType[] = [
  'succession',
  'split',
  'merge',
  'conquest',
  'vassalage',
  'cultural_continuity',
  'migration',
  'disputed',
];

function connector(type: RelationType): LayoutConnector {
  return {
    relationId: `rel_${type}`,
    type,
    d: 'M 10 100 C 10 140 20 160 20 200 L 40 200 C 40 160 30 140 30 100 Z',
    sideAttach: false,
  };
}

describe('connector ink', () => {
  it('reads the vertical span from the path', () => {
    expect(pathYs('M 10 40 L 12 80 Z')).toEqual({ y0: 40, y1: 80 });
    expect(pathYs('')).toEqual({ y0: 0, y1: 0 });
  });

  it('styles every relation type', () => {
    const dataset = bundledDataset();
    dataset.relations.push(
      ...TYPES.map((type) => ({
        id: `rel_${type}`,
        from: ['rome'],
        to: ['child'],
        type,
        year: -27,
        confidence: 'secure' as const,
        importance: 3 as const,
        sourceIds: ['note'],
        verification: 'unverified' as const,
      })),
    );
    dataset.polities.push({
      id: 'rome',
      name: 'Roman Empire',
      family: 'latin_west',
      start: -27,
      end: 476,
      confidence: 'secure',
      importance: 4,
      weight: 0.5,
      kind: 'empire',
      anchor: [{ year: -27, geo: [12, 42] }],
      summary: 'A synthetic source for connector color.',
      keyFacts: ['Synthetic.'],
      sourceIds: ['note'],
      verification: 'unverified',
    });
    const paints = connectorPaints(
      dataset,
      TYPES.map((type) => connector(type)),
    );
    expect(paints.map((row) => row.type)).toEqual(TYPES);
    for (const row of paints) {
      const style = connectorStyle(row.type);
      expect(row.dasharray).toBe(style.dasharray);
      expect(row.hatch).toBe(style.hatch);
      expect(row.fill).toBe('#652399');
      expect(row.y0).toBe(100);
      expect(row.y1).toBe(200);
    }
    expect(paints.find((row) => row.type === 'succession')?.dasharray).toBe('');
    expect(paints.find((row) => row.type === 'conquest')?.hatch).toBe(true);
    expect(paints.find((row) => row.type === 'disputed')?.dasharray).toBe('4 3');
    expect(paints.find((row) => row.type === 'migration')?.dasharray).toBe('1 2.5');
  });
});
