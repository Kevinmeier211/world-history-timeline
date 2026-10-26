import type { Geography } from '../../src/data/schema/geography.ts';

/**
 * Display names for the six era-note ids. The years are the pass names in
 * Appendix E and the accuracy-checklist titles. An id that is not in this
 * list is printed as stored.
 */
const ERA_LABELS: readonly (readonly [string, string])[] = [
  ['era_3300bce_2000', '3300–2000 BCE'],
  ['era_2000bce_600', '2000–600 BCE'],
  ['era_600bce_500', '600 BCE–500 CE'],
  ['era_500_1500', '500–1500 CE'],
  ['era_1500_1800', '1500–1800 CE'],
  ['era_1800_2000', '1800–2000 CE'],
];

export function eraLabel(id: string): string {
  const row = ERA_LABELS.find((item) => item[0] === id);
  return row ? row[1] : id;
}

function eraIndex(id: string): number {
  const at = ERA_LABELS.findIndex((item) => item[0] === id);
  return at < 0 ? ERA_LABELS.length : at;
}

export function compareEras(a: string, b: string): number {
  const delta = eraIndex(a) - eraIndex(b);
  if (delta !== 0) return delta;
  return a < b ? -1 : a > b ? 1 : 0;
}

export function regionName(id: string, geography: Geography): string {
  const region = geography.macroRegions.find((item) => item.id === id);
  return region ? region.name : id;
}

function regionIndex(id: string, geography: Geography): number {
  const at = geography.macroRegions.findIndex((item) => item.id === id);
  return at < 0 ? geography.macroRegions.length : at;
}

export function compareRegions(a: string, b: string, geography: Geography): number {
  const delta = regionIndex(a, geography) - regionIndex(b, geography);
  if (delta !== 0) return delta;
  return a < b ? -1 : a > b ? 1 : 0;
}
