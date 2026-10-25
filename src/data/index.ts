import { POLITIES_WEST } from './politiesWest';
import { POLITIES_EAST } from './politiesEast';
import { Polity } from '../types/history';

export {
  REGIONS,
  HISTORICAL_ERAS,
  CROSS_CUTTING_BANDS,
  TRADE_AND_MIGRATION_ROUTES,
  COMPARISON_PRESETS,
  STORY_TOURS,
  PALEOCLIMATE_CURVE,
} from './regionsAndEras';

export { HISTORICAL_NODES } from './historicalNodes';

export const ALL_POLITIES: Polity[] = [...POLITIES_WEST, ...POLITIES_EAST];

export const POLITY_BY_ID: Record<string, Polity> = Object.fromEntries(
  ALL_POLITIES.map((p) => [p.id, p])
);
