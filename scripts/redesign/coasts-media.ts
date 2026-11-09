import type { Corpus, Media, Source } from '../../src/atlas/model';
import { interval } from './content-helpers';

const ccBy = 'https://creativecommons.org/licenses/by/4.0/';
const cc0 = 'https://creativecommons.org/publicdomain/zero/1.0/';
const castImage =
  'https://collectionapi.metmuseum.org/api/collection/v1/iiif/314215/649446/main-image';
const terrainImage =
  'https://static.cambridge.org/binary/version/id/urn:cambridge.org:id:binary:20240119220228685-0045:S0003598X23001552:S0003598X23001552_fig2.png?pub-status=live';

const castSource: Source = {
  id: 'met-314215-cast',
  title: 'Cast of a Pot Sherd',
  institution: 'The Metropolitan Museum of Art',
  url: 'https://www.metmuseum.org/art/collection/search/314215',
  type: 'catalogue',
  accessed: '2026-10-28',
  scope:
    'Artwork Details, Public Domain and Open Access information read; actual 1056 × 775 image inspected. Accession 1980.153.2, Rogers Fund 1980: a plaster reproduction described as mid-twentieth century, not the original ancient clay sherd. Catalogue geography is Solomon Islands, Santa Cruz Islands, Temotu province; no original sherd production date, precise excavation findspot or named cast maker is supplied. The verbal date is retained without invented numeric endpoints. The official image endpoint was checked against the saved source photograph and its bytes match. Met Open Access image is CC0; catalogue text has separate rights. WebP conversion retains image bounds without cropping, enhancement or upscaling.',
};

function guide(
  id: string,
  subject: string,
  source: string,
  title: string,
  representedDate: string,
  alt: string,
  caption: string,
  printCaption: string,
  notice: string[],
): Media {
  return {
    id,
    title,
    subject,
    source,
    accession: 'Chronos original teaching diagram, C2 material work, 28 October 2026',
    creator: 'Chronos / Codex; source-based editorial diagram',
    date: interval(
      2026,
      2026,
      'Teaching diagram made 28 October 2026',
      'Modern creation date, separate from the historical evidence being explained.',
      'exact',
    ),
    representedDate,
    place: 'Modern teaching guide; no measured ancient site or workshop reconstructed',
    material: 'Original SVG diagram',
    image: `/atlas/media/${id}.svg`,
    thumbnail: `/atlas/media/${id}-thumb.webp`,
    width: 600,
    height: 360,
    printWidthMm: 145,
    alt,
    caption,
    printCaption,
    notice,
    rights: 'CC BY 4.0; original artwork, no source figure copied or traced.',
    licenseUrl: ccBy,
    credit: 'Chronos / Codex, 2026. Original teaching guide; cited sources in dossier.',
    printCredit: 'Chronos / Codex, 2026. CC BY 4.0; original guide.',
    sourceImage: `/atlas/media/${id}.svg`,
    depiction: 'explanatory diagram',
    relevance:
      'Explains a source-based operation with independently arranged symbols, without asserting measured geometry, quantities or a recovered individual action.',
    additionalImages: [],
  };
}

export const coastMedia: Media[] = [
  guide(
    'olmec-dating-guide',
    'olmec',
    'olmec-sampling-2020',
    'Olmec evidence: dates change the question',
    'A modern guide to revising a San Lorenzo household interpretation using the selected 2020 archaeological account; no ancient census or measured floor is depicted.',
    'Three panels show a generic surface form, a layered sample and notes about local history. Arrows connect appearance, dated evidence and interpretation. The mound outline, layers, spacing and marks are independently drawn symbols, not observed San Lorenzo features, sampled quantities or a population count.',
    'A surface form, dated sample and interpretation answer different questions. A changed period assignment can overturn an earlier estimate. These generic symbols are not a measured mound, excavated floor, survey or census; no source figure is copied or traced.',
    'Modern guide: surface appearance, dated evidence and interpretation. No measured survey or census.',
    [
      'Identify what each panel contributes to an interpretation.',
      'Explain why changing a feature’s date could change the question about households.',
    ],
  ),
  guide(
    'lapita-stamp-guide',
    'lapita',
    'lapita',
    'Lapita making: small marks make a pattern',
    'A modern demonstration of repeated toothed stamping described in the museum essay; not a particular ancient tool, vessel or authentic motif.',
    'Three panels show a hypothetical three-tooth tool, one press leaving three marks in a band, and the same action repeated. Tool, band, marks and spacing are independently drawn teaching symbols. They do not copy an ancient Lapita motif, a source figure or the pattern on the photographed plaster cast.',
    'Small repeated actions can build a larger pattern. This hypothetical tool and band explain toothed stamping before firing; they do not reconstruct a recovered ancient tool, a particular vessel, the cast’s pattern or a motif’s meaning.',
    'Modern stamping guide with a hypothetical tool and pattern; not an ancient vessel or copied motif.',
    [
      'Find the tool, one impression and the repeated impressions.',
      'Explain how changing spacing or direction could change your own paper pattern.',
    ],
  ),
  {
    id: 'met-314215-cast',
    title: 'Modern plaster cast of a pot sherd',
    subject: 'lapita',
    source: 'met-314215-cast',
    accession: '1980.153.2',
    creator: 'Cast maker not recorded in the consulted catalogue',
    date: interval(
      null,
      null,
      'Mid-20th-century plaster cast',
      'The catalogue supplies this verbal date, not exact numeric endpoints. The 1980 acquisition credit is not a manufacture date; no 1940–1960 range is inferred.',
      'unknown',
    ),
    representedDate:
      'Modern reproduction of patterned pottery; the catalogue does not supply the original sherd’s precise production date or excavated findspot.',
    place:
      'Catalogue geography: Solomon Islands, Santa Cruz Islands, Temotu province; not a verified excavation locus for the original sherd.',
    material: 'Plaster reproduction; not ancient clay',
    image: '/atlas/media/met-314215-cast.webp',
    thumbnail: '/atlas/media/met-314215-cast-thumb.webp',
    width: 1056,
    height: 775,
    printWidthMm: 100,
    alt: 'Photograph of a grey plaster reproduction with repeated circles, bands of short tooth-like marks and larger angular lines across its irregular surface. The photographed object is a modern cast, not an ancient clay fragment.',
    caption:
      'Mid-twentieth-century plaster cast of a pot sherd. Its visible circles, bands and angular forms support observation of a reproduced pattern. The record does not provide the original sherd’s precise date or excavated findspot. Converted to WebP at the original image bounds, without cropping, enhancement or upscaling.',
    printCaption:
      'Mid-twentieth-century plaster cast, not ancient clay. Original sherd date and excavated findspot are not supplied.',
    notice: [
      'Find repeated small marks and larger shapes on the reproduced surface.',
      'Separate what the photograph shows from what the original sherd’s context would need to establish.',
    ],
    rights: 'Public domain; The Met Open Access (CC0).',
    licenseUrl: cc0,
    credit: 'The Metropolitan Museum of Art. Rogers Fund, 1980. 1980.153.2.',
    printCredit:
      'The Metropolitan Museum of Art. Rogers Fund, 1980; 1980.153.2. Public domain / CC0.',
    sourceImage: castImage,
    depiction: 'object photograph',
    relevance:
      'Lets a reader inspect a reproduced pattern while keeping the modern cast, unknown ancient object context and source-based making explanation distinct.',
    datingNote:
      'Catalogue date is mid-20th century for the plaster cast. No exact numeric cast date or original sherd date is supplied.',
    additionalImages: [],
  },
  {
    id: 'poverty-terrain-model',
    title: 'Poverty Point: a modern terrain model',
    subject: 'poverty-point',
    source: 'pp-chronology-2023',
    accession: 'Grooms, Ward and Kidder 2023, Figure 2, printed p. 1456',
    creator: 'K. Ervin; published in Grooms, Ward and Kidder (2023)',
    date: interval(
      2023,
      2023,
      'Terrain figure published in 2023; LiDAR acquisition date unstated',
      'This year identifies the article publication, not the LiDAR acquisition or construction of an ancient earthwork. The later image-server version does not establish a survey date.',
      'exact',
    ),
    representedDate:
      'Surviving modern ground surface with earthworks and later alterations from different periods; individual feature dates cannot be read from the elevation model alone.',
    place: 'Poverty Point, West Carroll Parish, Louisiana; modern mapped surface',
    material:
      'Published LiDAR digital elevation model; WebP conversion of source figure',
    image: '/atlas/media/poverty-terrain-model.webp',
    thumbnail: '/atlas/media/poverty-terrain-model-thumb.webp',
    width: 1583,
    height: 1239,
    printWidthMm: 165,
    alt: 'Modern elevation model of Poverty Point. Mound A lies west of six curved ridges numbered 1–6, with a plaza inside the ridges. Mounds B, C, E and F are also labeled; Mound D is not labeled. Lighter areas indicate higher ground and dark green lower ground. North is up; a metre scale and elevation legend accompany the image.',
    caption:
      'K. Ervin’s modern elevation model labels mounds A, B, C, E and F, six ridges and the plaza; Mound D is not labeled. Lighter colors show higher ground and dark green lower ground, not ancient building materials or dates. North is up. The scale bar spans 0–420 m, contours are 0.5 m, and displayed elevations are roughly 19–55 m above sea level. The source names the Pioneer quadrangle, West Carroll Parish, and NAD 83. Its small original legend needs zoom or this text equivalent. This is a modern surface, not one ancient construction phase; the LiDAR acquisition date is unstated. Converted without cropping, enhancement or upscaling.',
    printCaption:
      'Modern ground height, not ancient material or a single construction phase. Lighter is higher, dark green lower; north is up, scale 0–420 m, contours 0.5 m, elevations about 19–55 m, datum NAD 83. Mounds A/B/C/E/F, six ridges and the plaza are labeled; D is not. LiDAR acquisition date unstated; the small source legend has this text equivalent.',
    notice: [
      'Find Mound A west of the ridges and the plaza inside them.',
      'Which differences are heights, and what separate evidence would date the features?',
    ],
    rights: '© The Authors, 2023. CC BY 4.0; source figure credited to K. Ervin.',
    licenseUrl: ccBy,
    credit:
      'K. Ervin, Figure 2 in Seth B. Grooms, Grace M.V. Ward and Tristram R. Kidder, Convergence at Poverty Point, Antiquity 97(396), 1453–1469 (2023), DOI 10.15184/aqy.2023.155. © The Authors, 2023; CC BY 4.0. WebP conversion; original image bounds retained.',
    printCredit:
      'K. Ervin; Grooms, Ward and Kidder 2023, fig. 2, p. 1456; DOI 10.15184/aqy.2023.155. © Authors 2023, CC BY 4.0. WebP conversion.',
    sourceImage: terrainImage,
    depiction: 'modern terrain model',
    relevance:
      'Makes surviving ground height and relative arrangement inspectable, while separate archaeological evidence explains construction, maintenance and later changes.',
    additionalImages: [],
  },
];

export function applyCoastMedia(c: Corpus) {
  const sourceIndex = c.sources.findIndex((source) => source.id === castSource.id);
  if (sourceIndex < 0) c.sources.push({ ...castSource });
  else c.sources[sourceIndex] = { ...castSource };
  for (const media of coastMedia) {
    const index = c.media.findIndex((item) => item.id === media.id);
    if (index < 0) c.media.push({ ...media });
    else c.media[index] = { ...media };
    const subject = c.subjects.find((item) => item.id === media.subject);
    if (!subject)
      throw new Error(`Missing subject for coastal media: ${media.subject}`);
    subject.objectIds = [...new Set([...subject.objectIds, media.id])];
  }
  const figure = c.media.find((media) => media.id === 'met-314609');
  if (figure) figure.licenseUrl = cc0;
}
