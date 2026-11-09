import type { Media } from '../../src/atlas/model';
import { interval } from './content-helpers';

const diagram = (
  id: string,
  subject: string,
  source: string,
  title: string,
  height: number,
  representedDate: string,
  alt: string,
  caption: string,
  printCaption: string,
  notice: string[],
): Media => ({
  id,
  subject,
  source,
  title,
  accession: 'Chronos original teaching diagram, C1 households, 28 October 2026',
  creator: 'Chronos / Codex; source-based editorial diagram',
  date: interval(
    2026,
    2026,
    'Teaching diagram made 28 October 2026',
    'Modern creation date, separate from represented historical evidence.',
    'exact',
  ),
  representedDate,
  place: 'Modern functional guide; no surveyed plan or exact historical dimensions',
  material: 'Original SVG diagram',
  image: `/atlas/media/${id}.svg`,
  thumbnail: `/atlas/media/${id}-thumb.webp`,
  width: 600,
  height,
  printWidthMm: 145,
  alt,
  caption,
  printCaption,
  notice,
  rights: 'CC BY 4.0; original artwork, no source figure reproduced.',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  credit: 'Chronos / Codex, 2026. Original functional guide; sources in dossier.',
  printCredit: 'Chronos / Codex, 2026. CC BY 4.0; original guide.',
  sourceImage: `/atlas/media/${id}.svg`,
  depiction: 'explanatory diagram',
  relevance:
    'Makes practical tasks and relationships visible without inventing a measured ancient plan, individual worker or complete social arrangement.',
});

export const householdMedia: Media[] = [
  diagram(
    'giza-provisioning-diagram',
    'old-kingdom',
    'giza-provisioning',
    'Giza: food required several kinds of work',
    300,
    'Fourth Dynasty Giza provisioning; archaeological evidence and modern bakery experiments described by AERA.',
    'Three panels connect grain storage, preparation and baking, and meals and work. Generic grain, bowl and person symbols show relationships, not quantities, a particular ancient recipe or a surveyed settlement plan.',
    'Modern functional guide. Grain storage, preparation and meals connect different tasks. Symbols show no quantities; arrows are relationships rather than a recipe, measured flow or surveyed site plan.',
    'Modern guide: storage, preparation and meals. No quantities, recipe or surveyed plan.',
    [
      'Name work needed between storing grain and providing a meal.',
      'Which quantities or individual workers cannot be recovered from this guide?',
    ],
  ),
  diagram(
    'caral-renewal-diagram',
    'caral',
    'caral-project-2005',
    'Caral: rooms changed through repeated work',
    360,
    'Selected Caral-Supe construction and renewal described in the 2005 project booklet; no one room or universal sequence reconstructed.',
    'Three conceptual panels show an earlier space, subdivision, and stone-filled bag symbols beneath renewed construction. The panels separate relationships in the project account; they supply no surveyed dimensions, measured quantities or universal sequence.',
    'Modern conceptual guide. Subdivision, filling and renewal explain how earlier space can enter later construction. Shapes and bag symbols are not a surveyed room, measured volume or sequence applying to every building.',
    'Modern guide: subdivision, filling and renewal. Not a surveyed plan or universal sequence.',
    [
      'Find the earlier space, subdivision and construction fill.',
      'Explain which tasks are needed before building over filled space.',
    ],
  ),
  {
    ...diagram(
      'skara-household-guide',
      'skara-brae',
      'skara-significance-2024',
      'Skara Brae: House 1 features and practical tasks',
      400,
      'Neolithic House 1 features and nineteenth-century rebuilding described by HES in 2024; this modern guide does not date each feature.',
      'An independently arranged relationship guide places stone shelving beyond a central hearth and entrance. Four side slab enclosures appear as two on each side. A separate, fifth enclosure labeled Wider sits left of the entrance. Separate boxes and dashed links are teaching symbols, not measured walls, orientation, roof form or an untouched ancient room. Nineteenth-century rebuilding omitted recorded cells.',
      'Modern, nonmeasured relationship guide from HES’s textual description. House 1 has a central hearth, shelving beyond, two slab enclosures per side and an additional wider enclosure left of the entrance: five enclosures in total. Nineteenth-century rebuilding omitted recorded cells; the present interior differs from the excavation record. No source plan or photograph was copied.',
      'Modern relationship guide; no measured plan. The present room includes nineteenth-century rebuilding.',
      [
        'Find the entrance, hearth, shelving and side enclosures.',
        'Imagine bringing fuel to the hearth, keeping the guide separate from an exact ancient route.',
        'Which later changes would need documentation before interpreting the present interior?',
      ],
    ),
    rights:
      'Original artwork CC BY 4.0. HES textual information is under Open Government Licence v3.0; its images are excluded from that licence and none is copied.',
    credit:
      'Chronos / Codex, 2026. Original artwork CC BY 4.0. Contains Historic Environment Scotland information © HES 2024, licensed under Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/. Textual information from Statement of Significance, printed p. 68 / PDF p. 70. HES source images are excluded and not reproduced.',
    printCredit:
      'Chronos / Codex, 2026; CC BY 4.0. HES 2024 text: OGL v3; source images excluded.',
  },
];
