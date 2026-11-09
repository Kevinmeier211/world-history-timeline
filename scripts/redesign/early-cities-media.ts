import type { Media } from '../../src/atlas/model';
import { interval } from './content-helpers';

const base = (
  id: string,
  subject: string,
  source: string,
  title: string,
  alt: string,
  caption: string,
): Media => ({
  id,
  subject,
  source,
  title,
  alt,
  caption,
  accession: 'Chronos original teaching diagram, C1, 28 October 2026',
  creator: 'Chronos / Codex; source-based editorial diagram',
  date: interval(
    2026,
    2026,
    'Teaching diagram made 28 October 2026',
    'Modern explanatory diagram; represented ancient dates belong to the dossier and source records, not to the creation of this graphic.',
    'exact',
  ),
  place: 'Modern editorial schematic; no surveyed coordinates',
  material: 'Original SVG diagram',
  image: `/atlas/media/${id}.svg`,
  thumbnail: `/atlas/media/${id}-thumb.webp`,
  width: 600,
  height: 780,
  printWidthMm: 145,
  notice: [
    'Read the convention note before following the diagram.',
    'Separate a component or task from an inferred social relationship.',
  ],
  rights: 'CC BY 4.0; original artwork, no source figure reproduced.',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  credit: 'Chronos / Codex, 2026. Original schematic; sources in dossier.',
  sourceImage: `/atlas/media/${id}.svg`,
  depiction: 'explanatory diagram',
  relevance:
    'Makes a mechanism or evidence distinction inspectable without presenting an imagined ancient scene as evidence.',
});
export const earlyCitiesMedia: Media[] = [
  {
    ...base(
      'uruk-accounting-diagram',
      'uruk-accounts',
      'met-327384',
      'An account selects information',
      'Modern diagram separates categories, quantities and a durable clay record; the final panel asks about people and work omitted. No ancient signs, numbers or translations are invented.',
      'Modern concept guide to categories, quantities and durable records. No ancient signs, numerical values or complete translation are supplied.',
    ),
    representedDate:
      'Selected tablet c. 3100–2900 BCE; administrative mechanism is schematic.',
  },
  {
    ...base(
      'dholavira-water-diagram',
      'dholavira',
      'dholavira-plan',
      'Dholavira: water components and a research question',
      'Solid boxes show the castle well and storm drain west of the East Reservoir, with South reservoirs below. A separate dashed note under the boxes describes a radar study east of the East Reservoir. Its proposed water structures await excavation. The figure combines phases and gives no scale or flow directions.',
      'Component schematic combining phases. Solid: recorded features. Dashed: radar study area with unconfirmed interpretations. No scale, connecting flow network or simultaneous operation is asserted.',
    ),
    representedDate:
      'Components across Dholavira’s occupation; modern ASI plan (2020) and GPR study (2018).',
    printCaption:
      'Recorded components and an unconfirmed radar study area, shown schematically. Different phases are combined; no water connection is asserted.',
  },
  {
    ...base(
      'liangzhu-water-diagram',
      'liangzhu',
      'liangzhu-hydraulics',
      'Liangzhu: materials, water and production',
      'Concept diagram has three panels: grass-wrapped clay in dams, storage and channels, and rice production with movement of people and materials. A final question distinguishes practical coordination from evidence of household obligations. It is not a canal map.',
      'Modern concept guide to construction, water management and production. It is not a surveyed canal map, flow model or reconstructed workday.',
    ),
    representedDate:
      'Liangzhu landscape c. 3300–2300 BCE; individual dam samples have separate distributions.',
  },
];
