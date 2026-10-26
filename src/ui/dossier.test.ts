import { describe, expect, it } from 'vitest';

import { clientDataset } from '../data/clientDataset.ts';
import { dossierFor } from './dossier.ts';

describe('dossier model', () => {
  it('returns nothing for an unknown id', () => {
    expect(dossierFor('missing', clientDataset())).toBeNull();
  });

  it('assembles dates, lineage, notes, sources, and an empty figure', () => {
    const model = dossierFor('han_dynasty', clientDataset());
    expect(model?.name).toBe('Qin & Han Dynasties');
    expect(model?.dates.startsWith('c. ')).toBe(true);
    expect(model?.dates).toContain('221 BCE');
    expect(model?.confidence).toBe('Approximate');
    expect(model?.summary.length).toBeGreaterThan(20);
    expect(model?.keyFacts.length).toBeGreaterThan(0);
    expect(model?.rulers.some((ruler) => ruler.name === 'Qin Shi Huang')).toBe(true);
    expect(model?.lineage.some((chip) => chip.label.startsWith('Disputed'))).toBe(true);
    expect(model?.callouts.some((chip) => chip.label.includes('Qin Unification'))).toBe(
      true,
    );
    expect(model?.sources.some((source) => source.id === 'chgis')).toBe(true);
    expect(model?.verification).toBe('Not yet cross-checked');
    expect(model?.mediaNote).toBe('No image is attached.');
    expect(dossierFor('roman_republic', clientDataset())?.wikipediaTitle).toBe(
      'Roman_Republic',
    );
  });
});
