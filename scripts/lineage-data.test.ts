import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { POLITIES_EAST } from '../src/data/politiesEast.ts';
import { POLITIES_WEST } from '../src/data/politiesWest.ts';
import { buildLineage, CHECKLIST_TWINS } from '../src/data/lineage.ts';
import { datasetSchema, type Polity, type Relation } from '../src/data/schema/index.ts';
import { validateDataset } from '../src/data/validate.ts';
import { loadDataset, loadRoots } from './load-dataset.ts';

function lineCount(file: string): number {
  return readFileSync(file, 'utf8').split('\n').length;
}

describe('generated lineage files', () => {
  it('matches the abutment, v1-parent, and checklist-twin rules', () => {
    const dataset = datasetSchema.parse(loadDataset());
    const polities = dataset.polities.map((polity: Polity) => ({
      id: polity.id,
      family: polity.family,
      start: polity.start,
      end: polity.end,
      sourceIds: polity.sourceIds,
      overlay: polity.dateNote?.includes('Migrated from gemini-v1') ?? false,
    }));
    const built = buildLineage(
      polities,
      [...POLITIES_WEST, ...POLITIES_EAST].map((polity) => ({
        id: polity.id,
        parentIds: polity.parentIds,
      })),
      CHECKLIST_TWINS,
    );
    const loaded = dataset.relations as Relation[];
    expect(loaded).toEqual(built.relations);
    expect(loadRoots()).toEqual(built.roots);
    expect(built.roots.length).toBeGreaterThan(0);
    expect(built.roots.length).toBeLessThan(dataset.polities.length);
    expect(built.relations.length).toBeGreaterThan(150);

    const result = validateDataset(dataset, built.roots);
    expect(result.issues.filter((issue) => issue.level === 'error')).toEqual([]);
    expect(
      result.issues.some((issue) => issue.message.includes('no inbound relation')),
    ).toBe(false);

    const families = new Map(polities.map((polity) => [polity.id, polity.family]));
    expect(
      built.relations.some((item) => {
        const seen = new Set(item.from.concat(item.to).map((id) => families.get(id)));
        return seen.size > 1 && item.type === 'cultural_continuity';
      }),
    ).toBe(true);
    expect(
      built.relations.every((item) =>
        ['succession', 'split', 'merge', 'disputed', 'cultural_continuity'].includes(
          item.type,
        ),
      ),
    ).toBe(true);
    for (const twin of CHECKLIST_TWINS) {
      expect(
        built.relations.some((item) => item.id === `twin_${twin.from}_${twin.to}`),
      ).toBe(true);
    }
    expect(
      built.relations.some(
        (item) =>
          (item.from.includes('mughal') && item.to.includes('mughal_empire')) ||
          (item.from.includes('mughal_empire') && item.to.includes('mughal')),
      ),
    ).toBe(false);
    expect(built.roots.find((root) => root.id === 'belgium')?.reason).toContain(
      'venice',
    );
    expect(built.roots.find((root) => root.id === 'muromachi')?.reason).toContain(
      'kamakura',
    );
    expect(
      built.relations.some(
        (item) =>
          (item.from.includes('voc') &&
            (item.to.includes('thailand') ||
              item.to.includes('pacific_microstates'))) ||
          (item.from.includes('habsburg_spain') && item.to.includes('prussia')),
      ),
    ).toBe(false);
    expect(
      built.relations.some(
        (item) =>
          item.from.includes('western_zhou') && item.to.includes('spring_autumn'),
      ),
    ).toBe(true);
    expect(
      built.relations.some(
        (item) =>
          item.from.includes('spring_autumn') && item.to.includes('warring_states'),
      ),
    ).toBe(true);
    expect(built.skippedParents.map((item) => `${item.parent}>${item.child}`)).toEqual([
      'hopewell_tradition>ancestral_puebloans',
      'toltecs>aztec_empire',
      'roman_empire>british_empire',
      'norte_chico>chavin_culture',
      'minoans_mycenaeans>classical_greece',
      'egypt_old_kingdom>egypt_middle_kingdom',
      'egypt_middle_kingdom>egypt_new_kingdom',
      'roman_empire>franks_charlemagne',
      'nok_culture>ghana_mali_songhai',
      'poverty_point>hopewell_tradition',
      'wari_tiwanaku>inca_empire',
      'ancestral_puebloans>iroquois_indigenous_nations',
      'hopewell_tradition>mississippian_culture',
      'ghana_mali_songhai>modern_africa',
      'great_zimbabwe_swahili>modern_africa',
      'mughal_empire>modern_india',
      'chavin_culture>nazca_moche',
      'roman_empire>spain_portugal',
      'han_dynasty>tang_song_dynasty',
      'zapotec_teotihuacan>toltecs',
    ]);

    for (const dir of ['src/data/relations', 'src/data/roots']) {
      const files = readdirSync(dir).filter((name) => name.endsWith('.json'));
      expect(files.length).toBeGreaterThan(0);
      for (const name of files) {
        expect(lineCount(path.join(dir, name)), name).toBeLessThanOrEqual(400);
      }
    }
  });
});
