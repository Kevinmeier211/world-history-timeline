import { describe, expect, it } from 'vitest';

import { politySchema } from '../src/data/schema/index.ts';
import {
  FAMILY_OVERRIDES,
  REGION_FAMILY,
  familyForV1,
  kindFromV1,
  migratePolity,
  type V1Polity,
} from './migrate-v1-map.ts';

function sample(overrides: Partial<V1Polity> = {}): V1Polity {
  return {
    id: 'norte_chico',
    name: 'Norte Chico',
    startYear: -3100,
    endYear: -1800,
    primaryRegionId: 'andean',
    spans: [{ regionId: 'andean', startYear: -3100, endYear: -1800, weight: 0.48 }],
    rulers: [],
    summary: 'A coastal Andean complex migrated for the skeleton.',
    keyAchievements: ['Platform mounds'],
    wikipediaTitle: 'Caral–Supe_civilization',
    ...overrides,
  };
}

describe('migratePolity', () => {
  it('maps a column by default and an override by id', () => {
    expect(familyForV1(sample())).toBe('andean');
    expect(
      familyForV1(sample({ id: 'mongol_empire', primaryRegionId: 'china_east_asia' })),
    ).toBe('turkic_mongol');
    expect(
      familyForV1(sample({ id: 'sumer_akkad', primaryRegionId: 'mesopotamia_persia' })),
    ).toBe('mesopotamian');
    for (const family of Object.values(REGION_FAMILY)) {
      expect(family.length).toBeGreaterThan(0);
    }
    expect(Object.keys(FAMILY_OVERRIDES)).toContain('british_empire');
  });

  it('keeps an unverified skeleton inside the schema, with an xKey instead of a fake coordinate', () => {
    const long = Array.from({ length: 80 }, (_, index) => `word${index}`).join(' ');
    const polity = migratePolity(
      sample({
        summary: long,
        uncertaintyYears: 150,
        nativeOrAltName: 'Caral',
        spans: [
          { regionId: 'andean', startYear: -3100, endYear: -1800, weight: 0.2 },
          { regionId: 'egypt_levant', startYear: -2000, endYear: -1800, weight: 0.9 },
        ],
      }),
    );
    expect(politySchema.safeParse(polity).success).toBe(true);
    expect(polity.verification).toBe('unverified');
    expect(polity.confidence).toBe('approximate');
    expect(polity.importance).toBe(3);
    expect(polity.anchor[0]?.xKey).toBe('andean');
    expect(polity.anchor[0]).not.toHaveProperty('geo');
    expect(polity.summary.split(/\s+/)).toHaveLength(60);
    expect(polity.sourceIds).toEqual(['museo_larco', 'field_museum']);
    expect(polity.weight).toBe(0.9);
    expect(polity.spans?.[0]?.macroRegion).toBe('africa');
    expect(polity.startUncertainty).toBe(150);
    expect(polity.altNames).toEqual(['Caral']);
  });

  it('classifies empires, cultures, and states from the v1 wording', () => {
    expect(kindFromV1('Inca Empire')).toBe('empire');
    expect(kindFromV1('Chavín Culture')).toBe('culture');
    expect(kindFromV1('Roman Republic')).toBe('state');
    expect(kindFromV1('Haudenosaunee Confederacy')).toBe('confederation');
    expect(kindFromV1('Vedic period')).toBe('period');
  });
});
