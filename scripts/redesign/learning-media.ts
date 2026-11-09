import type { Media } from '../../src/atlas/model';
import { interval } from './content-helpers';
const diagram = (
  id: string,
  subject: string,
  source: string,
  title: string,
  alt: string,
  caption: string,
  representedDate: string,
  height = 780,
  printCaption?: string,
): Media => ({
  id,
  subject,
  source,
  title,
  alt,
  caption,
  representedDate,
  accession: 'Chronos original teaching diagram, C5, 28 October 2026',
  creator: 'Chronos / Codex; source-based editorial diagram',
  date: interval(
    2026,
    2026,
    'Teaching diagram made 28 October 2026',
    'Modern creation date, distinct from represented historical evidence.',
    'exact',
  ),
  place: 'Modern functional guide; not a surveyed plan, facsimile or exact recipe',
  material: 'Original SVG diagram',
  image: `/atlas/media/${id}.svg`,
  thumbnail: `/atlas/media/${id}-thumb.webp`,
  width: 600,
  height,
  printCaption,
  printCredit: 'Chronos / Codex, 2026. Original guide; CC BY 4.0.',
  printWidthMm: 145,
  notice: [
    'Trace the relationship between the separate labeled settings or tasks.',
    'Distinguish what the guide explains from what the historical source establishes.',
  ],
  rights: 'CC BY 4.0; original artwork, no source figure reproduced.',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  credit: 'Chronos / Codex, 2026. Original guide; sources in dossier.',
  sourceImage: `/atlas/media/${id}.svg`,
  depiction: 'explanatory diagram',
  relevance:
    'Makes access or skilled work visible without inventing an ancient plan, text or workshop history.',
});
export const learningMedia: Media[] = [
  diagram(
    'tang-access-diagram',
    'tang-city',
    'tang-wards',
    'Chang’an: an errand through a ward gate',
    'A generic residential ward connects through a gate to a public street and a market. The arrow traces a hypothetical daytime errand. Labels say the settings are functional, not a measured city plan; gate rules need evidence of actual practice.',
    'Modern functional guide. A ward gate constrains an imagined errand; the placement and shape of every setting are schematic. No named resident or exact street is reconstructed.',
    'Tang capital context, 618–907 CE; source is a 2019 seminar summary.',
    400,
    'Modern functional guide: ward gate, public street and market. No measured plan or named errand.',
  ),
  diagram(
    'abbasid-work-diagram',
    'abbasid-craft',
    'abbasid-workshops',
    'Lustre pottery: body, surface and controlled firing',
    'Three diagrams distinguish forming an earthenware body, an opaque glazed surface, and lustre decoration with controlled firing. A note names skill, kilns, fuel and failures; no recipe or workshop is assigned to the selected bowl.',
    'Modern process guide. Forming, glazing and lustre firing are different tasks. The simplified sequence is not a tested recipe, a reconstruction of this bowl’s workshop or evidence of royal sponsorship.',
    'Mainly ninth–tenth-century Iraqi pottery; selected Met bowl is tenth century.',
  ),
  {
    id: 'nalanda-brick-photo',
    title: 'Brick walls and doorways in conserved Nalanda remains',
    subject: 'nalanda',
    source: 'nalanda-photo',
    accession: 'Nalanda Ruins (41).jpg; Commons photographer record',
    creator: 'Sumit Surai / Sumitsurai',
    date: interval(
      2023,
      2023,
      'Photographed 9 October 2023',
      'Modern photograph date from the photographer’s record; not a construction date.',
      'exact',
    ),
    representedDate:
      'Conserved archaeological remains with multiple construction and repair phases; individual bricks are not dated from appearance.',
    place:
      'Nalanda, Bihar, India; Commons category identifies Monastery 1, without identifying a particular teaching room',
    material: 'Digital photograph of conserved brick remains',
    image: '/atlas/media/nalanda-brick-photo.webp',
    thumbnail: '/atlas/media/nalanda-brick-photo-thumb.webp',
    width: 1600,
    height: 1202,
    printWidthMm: 155,
    alt: 'A brick doorway seen from within high brick walls, with several smaller openings above, another wall beyond and open sky. No ancient roof or people engaged in teaching are shown.',
    caption:
      'Brick walls and doorways photographed in 2023. Ancient fabric and later conservation require documentation; this view does not identify Yijing’s room or show the monastery occupied.',
    printCaption:
      'Doorways and brickwork in conserved remains, photographed in 2023; no particular medieval classroom is identified.',
    notice: [
      'Find a doorway, brick courses and open sky.',
      'Distinguish a visible feature from an account of an ancient activity.',
      'The modern photograph does not date every brick or reconstruct the missing roof.',
    ],
    rights:
      'CC BY-SA 4.0; photograph resized and WebP-encoded, without cropping or retouching.',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    credit:
      'Sumit Surai (Sumitsurai), 9 October 2023, via Wikimedia Commons. CC BY-SA 4.0. Resized and encoded as WebP; no crop or retouch.',
    printCredit: 'Sumit Surai / Wikimedia Commons, 2023. CC BY-SA 4.0; resized/WebP.',
    sourceImage:
      'https://upload.wikimedia.org/wikipedia/commons/1/1c/Nalanda_Ruins_%2841%29.jpg',
    depiction: 'object photograph',
    relevance:
      'Provides a directly inspectable modern view of architectural remains, alongside explicitly different dated textual evidence.',
  },
];
