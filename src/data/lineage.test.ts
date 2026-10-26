import { describe, expect, it } from 'vitest';

import { buildLineage, type LineagePolity, type TwinLink } from './lineage.ts';
import { RELATION_YEAR_TOLERANCE } from './validate.ts';

function polity(id: string, family: string, start: number, end: number): LineagePolity {
  return { id, family, start, end, sourceIds: ['louvre', 'unesco_gha'] };
}

describe('buildLineage', () => {
  it('links a unique shared boundary and refuses a 3-year gap', () => {
    const result = buildLineage(
      [
        polity('old', 'nile', -300, -200),
        polity('mid', 'nile', -200, -100),
        polity('venice', 'latin', 697, 1797),
        polity('belgium', 'latin', 1800, 2000),
        polity('other', 'steppe', 1797, 1800),
      ],
      [],
      [],
    );
    expect(
      result.relations.map((item) => [item.type, item.from, item.to, item.year]),
    ).toEqual([['succession', ['old'], ['mid'], -200]]);
    expect(result.roots.map((root) => root.id)).toEqual([
      'belgium',
      'old',
      'other',
      'venice',
    ]);
    expect(result.roots.find((root) => root.id === 'belgium')?.reason).toContain(
      'gap of 3',
    );
    expect(result.roots.find((root) => root.id === 'belgium')?.reason).toContain(
      'venice',
    );
    expect(result.relations.some((item) => item.type === 'conquest')).toBe(false);
  });

  it('treats the missing year 0 as a 1-year abutment and a 2-year gap as none', () => {
    const result = buildLineage(
      [
        polity('before', 'greek', -80, -1),
        polity('after', 'greek', 1, 40),
        polity('later', 'greek', 80, 120),
      ],
      [],
      [],
    );
    expect(result.relations.map((item) => item.id)).toEqual(['abut_before_after']);
    expect(result.relations[0]?.year).toBe(1);
    expect(result.roots.map((root) => root.id)).toEqual(['before', 'later']);
  });

  it('emits one split, and one disputed relation when several ends meet', () => {
    const result = buildLineage(
      [
        polity('mid', 'nile', -200, -100),
        polity('east', 'nile', -100, -40),
        polity('west', 'nile', -100, -50),
        polity('pred_a', 'greek', -180, -100),
        polity('pred_b', 'greek', -160, -100),
        polity('child', 'greek', -100, -20),
      ],
      [],
      [],
    );
    const split = result.relations.find((item) => item.type === 'split');
    const disputed = result.relations.find((item) => item.type === 'disputed');
    expect(split?.from).toEqual(['mid']);
    expect(split?.to).toEqual(['east', 'west']);
    expect(split?.share).toEqual([0.5, 0.5]);
    expect(disputed?.from).toEqual(['pred_a', 'pred_b']);
    expect(disputed?.to).toEqual(['child']);
    expect(result.roots.map((root) => root.id)).toEqual(['mid', 'pred_a', 'pred_b']);
  });

  it('does not hand a no-single-year cluster to the polity that ends on that edge', () => {
    const cluster = (id: string): LineagePolity => ({
      ...polity(id, 'andean', 1810, 2000),
      clusterStart: true,
    });
    const result = buildLineage(
      [
        polity('rio', 'andean', 1776, 1810),
        cluster('argentina'),
        cluster('chile'),
        polity('mughal', 'turkic', 1526, 1857),
        polity('india_1857', 'indian', 1857, 1858),
      ],
      [],
      [],
    );
    expect(result.relations.some((item) => item.to.includes('argentina'))).toBe(false);
    expect(
      result.relations.some((item) => item.id === 'bridge_mughal_india_1857'),
    ).toBe(true);
    const songhai = buildLineage(
      [
        polity('songhai_empire', 'sub_saharan', 1464, 1591),
        polity('saadi_morocco', 'sub_saharan', 1549, 1659),
      ],
      [],
      [],
    );
    expect(
      songhai.relations.some(
        (item) =>
          item.id === 'bridge_songhai_empire_saadi_morocco' && item.year === 1591,
      ),
    ).toBe(true);
    expect(result.roots.find((root) => root.id === 'argentina')?.reason).toContain(
      'no single year',
    );
    expect(result.roots.some((root) => root.id === 'india_1857')).toBe(false);
  });

  it('copies a v1 parent only when one year sits inside both lifetimes', () => {
    const result = buildLineage(
      [
        polity('old', 'nile', -300, -200),
        polity('mid', 'nile', -200, -100),
        polity('bundle', 'latin', -1000, -900),
        polity('far', 'latin', -100, -50),
        polity('near', 'steppe', 800, 1200),
        polity('heir', 'india', 900, 1100),
      ],
      [
        { id: 'mid', parentIds: ['old'] },
        { id: 'far', parentIds: ['bundle', 'missing'] },
        { id: 'heir', parentIds: ['near'] },
        { id: 'gone', parentIds: ['old'] },
      ],
      [],
    );
    expect(result.relations.map((item) => item.id)).toEqual([
      'abut_old_mid',
      'v1_near_heir',
    ]);
    expect(result.relations.find((item) => item.id === 'v1_near_heir')?.type).toBe(
      'cultural_continuity',
    );
    expect(result.skippedParents).toEqual([
      { parent: 'bundle', child: 'far', reason: 'no-shared-year' },
      { parent: 'missing', child: 'far', reason: 'missing-parent' },
      { parent: 'old', child: 'gone', reason: 'missing-child' },
    ]);
    const far = result.roots.find((root) => root.id === 'far');
    expect(far?.reason).toContain('bundle');
    expect(far?.reason).toContain(String(RELATION_YEAR_TOLERANCE));
    expect(result.roots.some((root) => root.id === 'heir')).toBe(false);
  });

  it('keeps a one-year gap only when the checklist column is empty', () => {
    const crowded = buildLineage(
      [
        polity('habsburg', 'latin', 1516, 1700),
        polity('spain', 'latin', 1700, 2000),
        polity('prussia', 'latin', 1701, 1947),
        polity('france', 'latin', 987, 2000),
      ],
      [],
      [],
    );
    expect(crowded.relations.map((item) => item.id)).toEqual(['abut_habsburg_spain']);
    expect(crowded.roots.find((root) => root.id === 'prussia')?.reason).toContain(
      'still current',
    );

    const overlay = { ...polity('zhou', 'chinese', -1046, -221), overlay: true };
    const open = buildLineage(
      [
        overlay,
        polity('western', 'chinese', -1046, -771),
        polity('spring', 'chinese', -770, -476),
      ],
      [],
      [],
    );
    expect(open.relations.map((item) => item.id)).toEqual(['abut_western_spring']);
    const blocked = buildLineage(
      [
        polity('zhou', 'chinese', -1046, -221),
        polity('western', 'chinese', -1046, -771),
        polity('spring', 'chinese', -770, -476),
      ],
      [],
      [],
    );
    expect(blocked.relations).toEqual([]);
  });

  it('does not invent a year in the tolerance gap between two spans', () => {
    const result = buildLineage(
      [polity('chavin', 'andean', -900, -200), polity('nazca', 'andean', -100, 750)],
      [{ id: 'nazca', parentIds: ['chavin'] }],
      [],
    );
    expect(result.relations).toEqual([]);
    expect(result.skippedParents).toEqual([
      { parent: 'chavin', child: 'nazca', reason: 'no-shared-year' },
    ]);
    expect(result.roots.map((root) => root.id)).toEqual(['chavin', 'nazca']);
  });

  it('records an explicit two-family checklist twin', () => {
    const twins: TwinLink[] = [
      {
        from: 'yuan',
        to: 'yuan_china',
        note: 'Same Appendix B span stored in two families.',
      },
    ];
    const result = buildLineage(
      [
        polity('yuan', 'turkic', 1271, 1368),
        polity('yuan_china', 'chinese', 1271, 1368),
      ],
      [],
      twins,
    );
    expect(result.relations).toHaveLength(1);
    expect(result.relations[0]).toMatchObject({
      id: 'twin_yuan_yuan_china',
      type: 'cultural_continuity',
      from: ['yuan'],
      to: ['yuan_china'],
      year: 1271,
    });
    expect(result.roots.map((root) => root.id)).toEqual(['yuan']);
  });

  it('emits the Roman split and the Spanish merge instead of abutment edges', () => {
    const result = buildLineage(
      [
        polity('roman_empire', 'latin_west', -27, 395),
        polity('western_roman_empire', 'latin_west', 395, 476),
        polity('eastern_roman_empire', 'greek_byzantine', 395, 476),
        polity('aragon', 'latin_west', 1137, 1469),
        polity('castile', 'latin_west', 1230, 1469),
        polity('spain_union', 'latin_west', 1469, 1516),
      ],
      [],
      [],
    );
    const split = result.relations.find((item) => item.type === 'split');
    const merge = result.relations.find((item) => item.type === 'merge');
    expect(split).toMatchObject({
      from: ['roman_empire'],
      to: ['eastern_roman_empire', 'western_roman_empire'],
      year: 395,
      share: [0.5, 0.5],
    });
    expect(merge).toMatchObject({
      from: ['aragon', 'castile'],
      to: ['spain_union'],
      year: 1469,
    });
    expect(
      result.relations.some(
        (item) =>
          item.type === 'succession' && item.to.includes('western_roman_empire'),
      ),
    ).toBe(false);
    expect(result.relations.some((item) => item.type === 'disputed')).toBe(false);
  });
});
