import { describe, expect, it } from 'vitest';

import { loadDataset } from '../../scripts/load-dataset.ts';
import { datasetSchema } from './schema/index.ts';
import { clientDataset, clientOverrides } from './clientDataset.ts';

describe('client dataset', () => {
  it('matches the files the validator loads', () => {
    const fromDisk = datasetSchema.parse(loadDataset());
    const fromBundle = clientDataset();
    const ids = (rows: { id: string }[]) => rows.map((row) => row.id).sort();
    expect(ids(fromBundle.polities)).toEqual(ids(fromDisk.polities));
    expect(ids(fromBundle.relations)).toEqual(ids(fromDisk.relations));
    expect(ids(fromBundle.bands)).toEqual(ids(fromDisk.bands));
    expect(fromBundle.polities.length).toBeGreaterThan(100);
    expect(clientOverrides().ribbons).toEqual([]);
  });
});
