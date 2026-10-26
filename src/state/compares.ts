/** Saved column compares. The five migrated presets stay in `presets.json`. */

export const COMPARE_STORAGE_KEY = 'chronos-compares';
export const COMPARE_LIMIT = 8;

export interface PresetColumns {
  macroRegions?: readonly string[];
  familyIds?: readonly string[];
  year?: number;
}

export interface PresetApply {
  fold: string[];
  pin: string[];
  y?: number;
}

export interface CompareSet {
  id: string;
  name: string;
  pin: string[];
  fold: string[];
}

const ID_RE = /^[a-z][a-z0-9_]*$/;

function listed(ids: readonly string[]): string[] {
  return [...new Set(ids.filter((id) => ID_RE.test(id)))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function slug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);
}

/**
 * A preset replaces the column filter. Naming every macro-region clears the
 * pin, which is the full chart. A focus year is kept when it is not zero.
 */
export function applyPreset(
  preset: PresetColumns,
  regions: readonly string[],
): PresetApply {
  const chosen = preset.macroRegions ?? [];
  const families = preset.familyIds ?? [];
  const coversAll =
    families.length === 0 &&
    regions.length > 0 &&
    regions.every((id) => chosen.includes(id));
  const next: PresetApply = {
    fold: [],
    pin: coversAll ? [] : listed([...chosen, ...families]),
  };
  if (preset.year !== undefined && preset.year !== 0 && Number.isInteger(preset.year)) {
    next.y = preset.year;
  }
  return next;
}

function cleanSet(value: unknown): CompareSet | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as { id?: unknown; name?: unknown; pin?: unknown; fold?: unknown };
  if (typeof row.name !== 'string' || row.name.trim().length === 0) return null;
  const name = row.name.trim().slice(0, 40);
  const id =
    typeof row.id === 'string' && ID_RE.test(row.id) ? row.id : `user_${slug(name)}`;
  if (!ID_RE.test(id)) return null;
  return {
    id,
    name,
    pin: listed(Array.isArray(row.pin) ? row.pin.map(String) : []),
    fold: listed(Array.isArray(row.fold) ? row.fold.map(String) : []),
  };
}

export function readCompares(storage: Storage | null): CompareSet[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(COMPARE_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .flatMap((row) => {
        const clean = cleanSet(row);
        return clean ? [clean] : [];
      })
      .slice(0, COMPARE_LIMIT);
  } catch {
    return [];
  }
}

export function writeCompares(
  storage: Storage | null,
  sets: readonly CompareSet[],
): CompareSet[] {
  const next = sets.slice(0, COMPARE_LIMIT);
  if (!storage) return [...next];
  try {
    storage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    return [...next];
  }
  return [...next];
}

/** Remember the current columns under `name`. A blank name or an empty chart is ignored. */
export function saveCompare(
  sets: readonly CompareSet[],
  name: string,
  pin: readonly string[],
  fold: readonly string[],
): CompareSet[] {
  const trimmed = name.trim().slice(0, 40);
  const nextPin = listed(pin);
  const nextFold = listed(fold);
  const stem = slug(trimmed);
  if (!trimmed || !stem || (nextPin.length === 0 && nextFold.length === 0)) {
    return [...sets];
  }
  const id = `user_${stem}`;
  const row: CompareSet = { id, name: trimmed, pin: nextPin, fold: nextFold };
  return [row, ...sets.filter((item) => item.id !== id)].slice(0, COMPARE_LIMIT);
}
