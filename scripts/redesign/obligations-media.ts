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
  height = 650,
): Media => ({
  id,
  subject,
  source,
  title,
  alt,
  caption,
  representedDate,
  accession: 'Chronos original teaching diagram, C6, 28 October 2026',
  creator: 'Chronos / Codex; source-based editorial diagram',
  date: interval(
    2026,
    2026,
    'Teaching diagram made 28 October 2026',
    'Modern creation date, separate from represented historical evidence.',
    'exact',
  ),
  place:
    'Modern conceptual guide; no surveyed site, measured flow or particular worker reconstructed',
  material: 'Original SVG diagram',
  image: `/atlas/media/${id}.svg`,
  thumbnail: `/atlas/media/${id}-thumb.webp`,
  width: 600,
  height,
  printWidthMm: 145,
  printCaption: caption,
  printCredit: 'Chronos / Codex, 2026. CC BY 4.0; original conceptual guide.',
  notice: [
    'Trace the labeled tasks or relationships.',
    'Distinguish the source’s stated arrangement from evidence of a particular household’s experience.',
  ],
  rights: 'CC BY 4.0; original artwork, no source figure reproduced.',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  credit: 'Chronos / Codex, 2026. Sources in dossier.',
  sourceImage: `/atlas/media/${id}.svg`,
  depiction: 'explanatory diagram',
  relevance:
    'Explains timing or divided work without inventing measured quantities, consent or a workshop history.',
});
export const obligationMedia: Media[] = [
  diagram(
    'song-loan-diagram',
    'song-art',
    'song-crop-loans',
    'Song crop loans: proposed timing',
    'Two panels show reserves supplying a household before harvest and repayment with tax collection after harvest. An arrow indicates timing. A note asks readers to test choice, harvest and repayment; this is a modern proposal guide, not an outcome study.',
    'Modern guide to the 1069 proposal: resources before harvest, repayment later. No measured flow or outcome is shown.',
    '1069 CE memorial; modern diagram created in 2026.',
    300,
  ),
  diagram(
    'inka-work-diagram',
    'inca-weaving',
    'inka-labor',
    'Inca work: household, obligation and provisioning',
    'Three labeled settings distinguish household production, state work demands and stores/provisioning. Arrows show conceptual relationships, not measured equal exchanges. The guide cannot identify the selected tunic’s maker or labor category.',
    'Modern institutional guide: household work, state demands and provisioning. Arrows do not imply equal returns or identify this tunic’s maker.',
    'Selected fifteenth–sixteenth-century institutions, not the exact production history of the 1450–1550 tunic.',
  ),
  {
    id: 'catalan-musa-detail',
    subject: 'mali-networks',
    source: 'catalan-musa-detail',
    title: 'Mansa Musa in a supplied detail of the Catalan Atlas',
    accession: 'BnF, MS Espagnol 30; Commons supplied image detail',
    creator: 'Attributed to Abraham Cresques; BnF / Gallica reproduction',
    date: interval(
      1375,
      1375,
      'About 1375 CE: conventional atlas date',
      'Approximate conventional date; attribution qualified. The later digital reproduction has no new historical observation date.',
    ),
    representedDate:
      'A later foreign depiction of Mansa Musa, whose Cairo pilgrimage anchor is 1324; not a portrait made from life.',
    place:
      'Atlas made in Majorca; represents Mali within a foreign geographical imagination',
    material: 'Digital reproduction of illuminated parchment; supplied detail',
    image: '/atlas/media/catalan-musa-detail.webp',
    thumbnail: '/atlas/media/catalan-musa-detail-thumb.webp',
    width: 1600,
    height: 1141,
    printWidthMm: 155,
    alt: 'A seated dark-skinned ruler wears a gold-colored crown and holds a round gold-colored object and a staff. Nearby are stylized place signs, lettering and intersecting red and green lines. The supplied detail cuts off parts of the surrounding map.',
    caption:
      'A foreign royal image, conventionally dated about 1375. Crown, staff and gold foreground rulership and wealth; they do not measure a fortune or record the ruler’s appearance from life. This supplied detail is not the full atlas panel.',
    printCaption:
      'Supplied atlas detail, about 1375: a foreign royal image, not an observed portrait or audited fortune.',
    notice: [
      'Find the crown, staff and gold-colored round object.',
      'Ask whose work is absent from the royal image.',
      'The supplied detail already crops the larger atlas; no further crop or reconstructed writing is added.',
    ],
    rights:
      'Faithful reproduction of public-domain two-dimensional art; Commons PD-Art / Public Domain Mark 1.0. Reproduction status can differ by jurisdiction. Resized and WebP-encoded; no further crop or retouch.',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    credit:
      'Attributed to Abraham Cresques, about 1375. BnF / Gallica, MS Espagnol 30, via Wikimedia Commons (Aa77zz upload, 2015). PD-Art / Public Domain Mark; resized and WebP-encoded, no further crop.',
    printCredit:
      'Attributed to A. Cresques, c.1375. BnF / Gallica via Commons. PD-Art / PDM 1.0; resized/WebP.',
    sourceImage:
      'https://upload.wikimedia.org/wikipedia/commons/e/ea/Catalan_Atlas_BNF_Sheet_6_Mansa_Musa.jpg',
    depiction: 'later depiction',
    relevance:
      'Makes foreign royal imagery directly inspectable while separating representation from local institutions and household production.',
  },
];
