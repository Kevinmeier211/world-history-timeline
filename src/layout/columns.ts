import families from '../data/families.json';
import geography from '../data/geography.json';

/** Sentinel family id. The solver treats an empty list as "every family". */
export const NO_COLUMNS = '__none__';

export interface ColumnChoice {
  id: string;
  name: string;
  kind: 'region' | 'family';
  macroRegion?: string;
}

export interface FamilyColumn {
  id: string;
  macroRegion: string;
}

/** Regions first, then families, in catalog order. */
export function columnChoices(): ColumnChoice[] {
  const regions = geography.macroRegions.map((region) => ({
    id: region.id,
    name: region.name,
    kind: 'region' as const,
  }));
  const rows = families.map((family) => ({
    id: family.id,
    name: family.name,
    kind: 'family' as const,
    macroRegion: family.macroRegion,
  }));
  return [...regions, ...rows];
}

export function familyColumns(): FamilyColumn[] {
  return families.map((family) => ({
    id: family.id,
    macroRegion: family.macroRegion,
  }));
}

function listed(ids: readonly string[]): string[] {
  return [...new Set(ids)].sort((left, right) => left.localeCompare(right));
}

/**
 * Families still drawn. A folded family is hidden. A folded region hides its
 * families unless that family is pinned. With any pin, only pinned families
 * and pinned regions remain. Fold wins when one id is in both lists.
 */
export function visibleFamilyIds(
  columns: readonly FamilyColumn[],
  fold: readonly string[],
  pin: readonly string[],
): string[] {
  const folded = new Set(fold);
  const pinned = new Set(pin);
  const isolating = pinned.size > 0;
  return columns
    .filter((column) => {
      if (folded.has(column.id)) return false;
      const regionFolded = folded.has(column.macroRegion);
      if (!isolating) return !regionFolded;
      if (pinned.has(column.id)) return true;
      if (regionFolded) return false;
      return pinned.has(column.macroRegion);
    })
    .map((column) => column.id)
    .sort((left, right) => left.localeCompare(right));
}

/** Empty means every family. A folded-away chart passes the sentinel. */
export function familiesForLayout(
  visible: readonly string[],
  familyCount: number,
): string[] {
  if (familyCount > 0 && visible.length >= familyCount) return [];
  if (visible.length === 0) return [NO_COLUMNS];
  return [...visible];
}

/** Toggle fold. Folding an id takes it off the pin list. */
export function withFold(
  fold: readonly string[],
  pin: readonly string[],
  id: string,
): { fold: string[]; pin: string[] } {
  const folding = !fold.includes(id);
  return {
    fold: listed(folding ? [...fold, id] : fold.filter((item) => item !== id)),
    pin: listed(folding ? pin.filter((item) => item !== id) : pin),
  };
}

/** Toggle pin. Pinning an id takes it off the fold list. */
export function withPin(
  fold: readonly string[],
  pin: readonly string[],
  id: string,
): { fold: string[]; pin: string[] } {
  const pinning = !pin.includes(id);
  return {
    fold: listed(pinning ? fold.filter((item) => item !== id) : fold),
    pin: listed(pinning ? [...pin, id] : pin.filter((item) => item !== id)),
  };
}
