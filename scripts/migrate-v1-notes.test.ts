import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  bandSchema,
  calloutSchema,
  climateCurveSchema,
  presetSchema,
  routeSchema,
  tourSchema,
} from '../src/data/schema/index.ts';
import { loadDataset } from './load-dataset.ts';
import {
  migrateBand,
  migrateClimate,
  migrateNode,
  migratePreset,
  migrateRoute,
  migrateTour,
} from './migrate-v1-notes.ts';

describe('migrate v1 notes', () => {
  it('clips a callout blurb, keeps importance, and drops an unknown polity link', () => {
    const callout = migrateNode(
      {
        id: 'node_cuneiform',
        title: 'Invention of Cuneiform Writing',
        year: -3200,
        regionId: 'mesopotamia_persia',
        polityId: 'missing_polity',
        category: 'INVENTION',
        minZoomTier: 1,
        description: 'A long description that should not become the blurb.',
        significance: Array.from({ length: 20 }, () => 'word').join(' '),
      },
      new Set(['sumer_akkad']),
    );
    expect(calloutSchema.safeParse(callout).success).toBe(true);
    expect(callout.blurb.split(/\s+/)).toHaveLength(14);
    expect(callout.importance).toBe(4);
    expect(callout.attachTo).toBeUndefined();
    expect(callout.verification).toBe('unverified');
    expect(callout.sourceIds).toEqual(['isac']);
  });

  it('marks a full-width band global and a regional band as one macro-region', () => {
    const regions = [
      'andean',
      'mesoamerica',
      'north_america',
      'sub_saharan_africa',
      'western_europe',
      'eastern_med_europe',
      'egypt_levant',
      'mesopotamia_persia',
      'indus_india',
      'china_east_asia',
      'austronesia_japan_sea',
    ];
    const globalBand = migrateBand({
      id: 'band_42_kiloyear',
      title: '4.2 ka',
      startYear: -2200,
      endYear: -2100,
      type: 'CLIMATE',
      regionIds: regions,
      description: 'A drought.',
    });
    const localBand = migrateBand({
      id: 'band_greek_dark_ages',
      title: 'Greek dark ages',
      startYear: -1100,
      endYear: -750,
      type: 'EPOCH',
      regionIds: ['eastern_med_europe'],
      description: 'Script loss.',
    });
    expect(bandSchema.safeParse(globalBand).success).toBe(true);
    expect(globalBand.scope).toBe('global');
    expect(localBand.scope).toEqual(['europe']);
  });

  it('places a route waypoint on poster-x and clips the description', () => {
    const route = migrateRoute({
      id: 'route_silk_road',
      name: 'Silk Road',
      type: 'TRADE',
      startYear: -200,
      endYear: 1400,
      waypoints: [
        { regionId: 'china_east_asia', year: -100, label: 'Chang’an' },
        { regionId: 'western_europe', year: 100, label: 'Rome' },
      ],
      description: Array.from({ length: 50 }, () => 'word').join(' '),
      commodities: ['Silk'],
    });
    expect(routeSchema.safeParse(route).success).toBe(true);
    expect(route.waypoints[0]?.x).toBeGreaterThan(route.waypoints[1]?.x ?? 1);
    expect(route.description.split(/\s+/)).toHaveLength(40);
    expect(route.verification).toBe('unverified');
  });

  it('maps tour lenses and preset regions without inventing a year 0', () => {
    const tour = migrateTour({
      id: 'tour_bronze_collapse',
      title: 'Collapse',
      subtitle: 'A short tour',
      waypoints: [
        {
          title: 'Start',
          year: -1177,
          zoomLevel: 1.5,
          lens: 'ALL',
          selectedNodeId: 'node_sea_peoples',
          narrative: 'A drought and a migration.',
        },
      ],
    });
    expect(tourSchema.safeParse(tour).success).toBe(true);
    expect(tour.waypoints[0]?.lens).toBeUndefined();
    expect(tour.waypoints[0]?.calloutId).toBe('node_sea_peoples');
    expect(tour.waypoints[0]?.verification).toBe('unverified');

    const preset = migratePreset({
      id: 'rome_vs_han',
      name: 'Rome vs Han',
      description: 'A comparison.',
      regionIds: ['western_europe', 'china_east_asia'],
      focusYear: 100,
    });
    expect(presetSchema.safeParse(preset).success).toBe(true);
    expect(preset.macroRegions).toEqual(['europe', 'east_asia']);
    expect(preset.year).toBe(100);
  });

  it('copies climate points through the schema', () => {
    const curve = migrateClimate([
      { year: -3300, tempDeltaC: 0.45, label: 'Holocene' },
      { year: 2025, tempDeltaC: 1.25 },
    ]);
    expect(climateCurveSchema.safeParse(curve).success).toBe(true);
    expect(curve.verification).toBe('unverified');
  });
});

describe('migrated annotation files', () => {
  it('matches the rows that actually exist on tag gemini-v1', () => {
    const data = loadDataset() as {
      callouts: unknown[];
      bands: unknown[];
      routes: unknown[];
      tours: unknown[];
      presets: unknown[];
    };
    const callouts = data.callouts as { evidence?: string }[];
    expect(
      callouts.filter((callout) =>
        callout.evidence?.includes('Migrated from gemini-v1'),
      ),
    ).toHaveLength(58);
    const migrated = JSON.parse(
      readFileSync('src/data/bands/migrated-01.json', 'utf8'),
    ) as unknown[];
    expect(migrated).toHaveLength(11);
    expect(data.bands).toHaveLength(13);
    expect(data.bands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'band_mongol_conquests' }),
        expect.objectContaining({ id: 'band_decolonization' }),
      ]),
    );
    expect(data.routes).toHaveLength(6);
    expect(data.tours).toHaveLength(10);
    expect(data.tours).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'tour_bronze_collapse' }),
        expect.objectContaining({ id: 'tour_axial_age' }),
        expect.objectContaining({ id: 'tour_rome_han' }),
        expect.objectContaining({ id: 'tour_industrial' }),
        expect.objectContaining({ id: 'tour_decolonization' }),
        expect.objectContaining({ id: 'tour_columbian' }),
        expect.objectContaining({ id: 'tour_atlantic' }),
        expect.objectContaining({ id: 'tour_islamic' }),
        expect.objectContaining({ id: 'tour_mongol' }),
        expect.objectContaining({ id: 'tour_silk_roads' }),
      ]),
    );
    expect(data.presets).toHaveLength(5);
  });
});
