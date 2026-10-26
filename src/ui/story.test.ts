import { describe, expect, it } from 'vitest';

import { SCALE_MAX } from '../camera/camera.ts';
import { clientDataset } from '../data/clientDataset.ts';
import type { Tour } from '../data/schema/records.ts';
import {
  applyStop,
  chartLens,
  matchStop,
  NARRATIVE_WORD_LIMIT,
  narrativeWords,
  resolveStop,
  storySources,
  tourStops,
} from './story.ts';

const attach = new Map<string, string>([['node_sea_peoples', 'minoans_mycenaeans']]);

function waypoint(
  partial: Partial<Tour['waypoints'][number]> &
    Pick<Tour['waypoints'][number], 'title'>,
): Tour['waypoints'][number] {
  return {
    year: -1350,
    narrative: 'A short stop.',
    sourceIds: ['cambridge_histories'],
    ...partial,
  };
}

describe('story stops', () => {
  it('keeps the migrated tours and the era tours inside the word limit', () => {
    const tours = clientDataset().tours;
    expect(tours.map((tour) => tour.id)).toEqual([
      'tour_bronze_collapse',
      'tour_axial_age',
      'tour_rome_han',
      'tour_industrial',
      'tour_decolonization',
      'tour_columbian',
      'tour_atlantic',
    ]);
    for (const tour of tours) {
      expect(tour.waypoints.length).toBeGreaterThan(0);
      for (const stop of tour.waypoints) {
        const words = narrativeWords(stop.narrative);
        expect(words).toBeGreaterThan(0);
        expect(words).toBeLessThanOrEqual(NARRATIVE_WORD_LIMIT);
      }
    }
  });

  it('moves the camera, the chart lens, and the highlight', () => {
    expect(chartLens('trade')).toBe('trade');
    expect(chartLens('climate')).toBe('climate');
    expect(chartLens('art')).toBe('ideas');
    expect(chartLens('politics')).toBeUndefined();
    expect(chartLens('technology')).toBeUndefined();
    expect(chartLens(undefined)).toBeUndefined();

    const bronze = clientDataset().tours[0];
    expect(bronze).toBeDefined();
    if (!bronze) return;
    const stops = tourStops(bronze, attach);
    expect(stops[0]).toMatchObject({
      year: -1350,
      zoom: 1.5,
      lens: 'trade',
      highlight: 'egypt_new_kingdom',
    });
    expect(stops[1]?.lens).toBeUndefined();
    expect(stops[1]?.highlight).toBe('hittites');
    expect(stops[2]).toMatchObject({
      year: -1177,
      zoom: 1.8,
      lens: 'climate',
      highlight: 'minoans_mycenaeans',
      calloutId: 'node_sea_peoples',
    });
    expect(stops[3]?.lens).toBeUndefined();

    const axial = clientDataset().tours.find((tour) => tour.id === 'tour_axial_age');
    expect(tourStops(axial ?? bronze, attach)[0]?.lens).toBe('ideas');

    const kadesh = stops[1];
    expect(kadesh).toBeDefined();
    if (!kadesh) return;
    const link = applyStop(
      { fold: ['chinese'], pin: ['americas'], y: 100, lens: 'trade', sel: 'han' },
      kadesh,
    );
    expect(link).toMatchObject({
      fold: ['chinese'],
      pin: ['americas'],
      y: -1274,
      z: 1.8,
      sel: 'hittites',
    });
    expect(link.lens).toBeUndefined();
    expect(matchStop(stops, link)).toBe(1);

    const cleared = applyStop(link, resolveStop(waypoint({ title: 'Bare' }), attach));
    expect(cleared.sel).toBeUndefined();
    expect(cleared.lens).toBeUndefined();
    expect(cleared.z).toBe(1.8);
    expect(resolveStop(waypoint({ title: 'Huge', zoom: 99 }), attach).zoom).toBe(
      SCALE_MAX,
    );
  });

  it('names sources that exist and skips the rest', () => {
    const named = storySources(
      ['cambridge_histories', 'missing_source'],
      clientDataset().sources,
    );
    expect(named).toEqual([
      {
        id: 'cambridge_histories',
        title: 'Cambridge Histories',
        url: 'https://www.cambridge.org/core/publications/collections/cambridge-histories',
      },
    ]);
    expect(narrativeWords('  one   two ')).toBe(2);
    expect(narrativeWords('')).toBe(0);
  });
});
