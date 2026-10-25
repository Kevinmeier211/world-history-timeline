export type RegionId =
  | 'andean'
  | 'mesoamerica'
  | 'north_america'
  | 'sub_saharan_africa'
  | 'western_europe'
  | 'eastern_med_europe'
  | 'egypt_levant'
  | 'mesopotamia_persia'
  | 'indus_india'
  | 'china_east_asia'
  | 'austronesia_japan_sea';

export type NodeCategory =
  | 'MONUMENT'
  | 'ARTIFACT'
  | 'WAR'
  | 'RULER'
  | 'INVENTION'
  | 'PHILOSOPHY'
  | 'CLIMATE'
  | 'TRADE';

export type LensMode =
  | 'ALL'
  | 'GEOPOLITICS'
  | 'TRADE_MIGRATION'
  | 'CLIMATE_PANDEMIC'
  | 'SCIENCE_WRITING'
  | 'PHILOSOPHY_ART';

export type TimeScaleMode = 'POSTER_WARPED' | 'LINEAR';

export interface Region {
  id: RegionId;
  name: string;
  shortName: string;
  subtitle: string;
  subRegions: string[];
  color: string;
  /** Geographic anchor on the world map [longitude, latitude] */
  mapCenter: [number, number];
  /** Simplified SVG path or polygon points in normalized map coordinates (0..1000 x 0..500) */
  mapPolygon: string;
}

export interface PolitySpan {
  regionId: RegionId;
  startYear: number;
  endYear: number;
  /** 0.15 to 1.0 width proportion within the region column */
  weight: number;
  /** Horizontal sub-lane offset within the column (-0.35 to +0.35) for parallel states */
  laneOffset?: number;
}

export interface RulerInfo {
  name: string;
  reign: string;
  title?: string;
}

export interface Polity {
  id: string;
  name: string;
  nativeOrAltName?: string;
  startYear: number;
  endYear: number;
  /** Years of chronological uncertainty for early/archaeological cultures (renders fuzzy gradient cap) */
  uncertaintyYears?: number;
  color: string;
  primaryRegionId: RegionId;
  spans: PolitySpan[];
  parentIds: string[];
  childIds: string[];
  capital?: string;
  peakAreaKm2?: string;
  estimatedPopulation?: string;
  governmentType?: string;
  rulers: RulerInfo[];
  summary: string;
  keyAchievements: string[];
  wikipediaTitle: string;
}

export interface HistoricalNode {
  id: string;
  title: string;
  year: number;
  endYear?: number;
  regionId: RegionId;
  polityId?: string;
  category: NodeCategory;
  /** 1 = visible even zoomed out (Macro), 2 = visible at default/medium zoom (Meso), 3 = visible when zoomed in (Micro) */
  minZoomTier: 1 | 2 | 3;
  laneOffset?: number;
  description: string;
  significance: string;
  wikipediaTitle?: string;
  customAdded?: boolean;
}

export interface CrossCuttingBand {
  id: string;
  title: string;
  subtitle: string;
  startYear: number;
  endYear: number;
  type: 'CLIMATE' | 'COLLAPSE' | 'GOLDEN_AGE' | 'PANDEMIC' | 'EPOCH' | 'GLOBAL_WAR';
  regionIds: RegionId[];
  description: string;
  color: string;
}

export interface TradeRouteWaypoint {
  regionId: RegionId;
  year: number;
  label?: string;
}

export interface TradeOrMigrationRoute {
  id: string;
  name: string;
  type: 'TRADE' | 'MIGRATION' | 'CULTURAL';
  startYear: number;
  endYear: number;
  waypoints: TradeRouteWaypoint[];
  description: string;
  commodities: string[];
  color: string;
}

export interface HistoricalEra {
  id: string;
  name: string;
  shortName: string;
  startYear: number;
  endYear: number;
  color: string;
  description: string;
}

export interface StoryWaypoint {
  title: string;
  year: number;
  focusRegionIds?: RegionId[];
  selectedPolityId?: string;
  selectedNodeId?: string;
  zoomLevel: number;
  lens?: LensMode;
  narrative: string;
  keyTakeaway: string;
}

export interface StoryTour {
  id: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  badge: string;
  waypoints: StoryWaypoint[];
}

export interface ComparisonPreset {
  id: string;
  name: string;
  description: string;
  regionIds: RegionId[];
  focusYear?: number;
}
