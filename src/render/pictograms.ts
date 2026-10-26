import type { CalloutKind } from '../data/schema/records.ts';

/** Design-grid stroke. Every icon uses this weight and a 24px grid. */
export const PICTOGRAM_STROKE = 1.5;

export const PICTOGRAM_VIEW = 24;

/**
 * In-house line icons. One grid, one stroke, no fill.
 * Paths stay inside a 2px inset so the stroke is not clipped.
 */
export const PICTOGRAMS = {
  pyramid: 'M4 20 L12 4 L20 20 Z',
  ziggurat: 'M3 20 H21 M5 16 H19 M7 12 H17 M9 8 H15 M11 5 H13',
  temple: 'M4 20 V10 H20 V20 M4 10 L12 4 L20 10 M12 20 V13',
  ship: 'M3 14 H21 L17 19 H7 Z M12 14 V5 M12 5 L18 11',
  scroll: 'M7 4 H16 A2 2 0 0 1 18 6 V20 H8 A2 2 0 0 1 6 18 V6 M9 9 H15 M9 13 H15',
  coin: 'M12 4 A8 8 0 1 0 12.01 4 M12 8 V16 M9 12 H15',
  crown: 'M4 17 L7 8 L12 13 L17 8 L20 17 Z',
  tablet: 'M7 3 H17 V21 H7 Z M9 8 H15 M9 12 H15 M9 16 H13',
  head: 'M12 5 A4 4 0 1 0 12 13 A4 4 0 1 0 12 5 M8 20 C8 16 16 16 16 20',
  mask: 'M7 5 H17 V12 C17 18 7 18 7 12 Z M10 10 H10.1 M14 10 H14.1 M10 14 H14',
  book: 'M4 5 H12 V20 H4 Z M12 5 H20 V20 H12 M6 9 H10 M14 9 H18',
  column: 'M8 4 H16 M7 20 H17 M10 4 V20 M14 4 V20',
  gate: 'M4 20 V8 H20 V20 M4 8 L12 3 L20 8 M10 20 V14 H14 V20',
  wheel: 'M12 5 A7 7 0 1 0 12.01 5 M12 5 V19 M5 12 H19 M7 7 L17 17 M17 7 L7 17',
  quill: 'M18 4 C12 8 8 14 6 20 M6 20 C10 16 14 10 18 4 M8 16 L14 14',
  seal: 'M12 3 A9 9 0 1 0 12.01 3 M9 9 H15 V15 H9 Z',
  leaf: 'M5 19 C5 9 12 4 20 4 C20 12 14 19 5 19 M8 16 C12 12 16 8 20 4',
  sun: 'M12 8 A4 4 0 1 0 12.01 8 M12 3 V5 M12 19 V21 M3 12 H5 M19 12 H21 M5.5 5.5 L7 7 M17 17 L18.5 18.5 M18.5 5.5 L17 7 M7 17 L5.5 18.5',
  moon: 'M15 4 A8 8 0 1 0 15 20 A5.5 5.5 0 1 1 15 4',
  star: 'M12 3 L14 9 H21 L15.5 13 L18 20 L12 16 L6 20 L8.5 13 L3 9 H10 Z',
  wall: 'M3 8 H21 M3 14 H21 M3 20 H21 M8 8 V14 M14 14 V20 M6 14 V20 M16 8 V14',
  bridge: 'M3 16 H21 M3 16 V12 H21 V16 M7 12 V9 A5 5 0 0 1 17 9 V12',
  steam:
    'M6 20 H18 V12 H6 Z M9 12 V9 H15 V12 M8 6 C8 4 10 4 10 6 M12 5 C12 3 14 3 14 5 M16 6 C16 4 18 4 18 6',
  bell: 'M8 16 H16 L15 8 A3.5 3.5 0 0 0 9 8 Z M12 16 V19 M10 19 H14 M12 5 V7',
  route:
    'M4 18 C8 18 8 6 12 6 C16 6 16 18 20 18 M4 18 A1.2 1.2 0 1 0 4.01 18 M20 18 A1.2 1.2 0 1 0 20.01 18',
  urn: 'M9 4 H15 M10 4 V7 H14 V4 M8 9 H16 L15 20 H9 Z M8 9 A4 2 0 0 1 16 9',
} as const;

export type PictogramName = keyof typeof PICTOGRAMS;

const KIND_ICON: Record<CalloutKind, PictogramName> = {
  event: 'seal',
  person: 'crown',
  invention: 'wheel',
  monument: 'temple',
  text: 'scroll',
  climate: 'leaf',
  trade: 'ship',
};

/** Default plate mark for a callout kind. A real image replaces this later. */
export function pictogramForKind(kind: CalloutKind): PictogramName {
  const icon = KIND_ICON[kind];
  if (!icon) throw new Error(`no pictogram for ${kind}`);
  return icon;
}
