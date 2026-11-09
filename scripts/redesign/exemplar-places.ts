import type { Corpus, Media } from '../../src/atlas/model';
import { cite, interval } from './content-helpers';

const media: Media[] = [
  {
    id: 'angkor-aster',
    title: 'Angkor from orbit',
    subject: 'angkor',
    source: 'angkor-nasa',
    accession: 'Earth Observatory image 4995',
    creator: 'Jesse Allen, NASA Earth Observatory; ASTER science team',
    date: interval(
      2004,
      2004,
      '17 February 2004',
      'Date of satellite acquisition, not of the structures visible in the image.',
      'exact',
    ),
    representedDate: 'Surviving landscape incorporating many historical periods',
    place: 'Angkor and the northern shore of Tonle Sap, Cambodia',
    material: 'ASTER simulated natural-color satellite image',
    image: '/atlas/media/angkor-aster.webp',
    thumbnail: '/atlas/media/angkor-aster-thumb.webp',
    width: 1200,
    height: 1200,
    alt: 'Satellite view: a large dark rectangular reservoir lies west of a square enclosure; a smaller dark square lies south of it. Fields and settlements extend toward the lake at the bottom.',
    caption:
      'West Baray is the large dark rectangle left of center. Angkor Thom is the square enclosure to its east, and Angkor Wat the smaller dark square just south. This modern image makes the scale of the surrounding landscape visible; it does not show a single medieval moment.',
    notice: [
      'Find the reservoir before the temple.',
      'Compare the size of the enclosures with the surrounding fields and settlements.',
      'Color is processed satellite information: it is not the view a medieval resident saw.',
    ],
    rights:
      'NASA educational/informational media use; acknowledge the supplied credit. No endorsement implied.',
    credit:
      'NASA image by Jesse Allen, Earth Observatory, using data courtesy of NASA/GSFC/METI/ERSDAC/JAROS and the U.S./Japan ASTER Science Team.',
    sourceImage:
      'https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/4000/4995/aster_angorwat_17feb04_15m.jpg',
    depiction: 'satellite image',
    relevance:
      'Shows the relative positions and scale of water works, temple enclosures and a wider inhabited landscape.',
    printCredit:
      'NASA Earth Observatory / Jesse Allen; NASA/GSFC/METI/ERSDAC/JAROS and U.S./Japan ASTER Science Team.',
  },
  {
    id: 'partition-punjab-map',
    title: 'Archive reference for the 1947 Punjab boundary map',
    subject: 'partition-1947',
    source: 'partition-map',
    accession: 'CO 1054/76',
    creator: 'Map held by The National Archives. Reference card by Chronos Atlas.',
    date: interval(
      1947,
      1947,
      '1947',
      'The archival map key dates the award to 17 August 1947. The atlas card refers to that document.',
      'exact',
    ),
    place: 'Punjab',
    material: 'Atlas reference card for a printed map held by The National Archives',
    image: '/atlas/media/partition-punjab-map.webp',
    thumbnail: '/atlas/media/partition-punjab-map-thumb.webp',
    width: 900,
    height: 679,
    alt: 'Text reference card for the Punjab boundary map at The National Archives, CO 1054/76.',
    caption:
      'Open the archive image to see the map key. The solid line marks the awarded Punjab boundary. The dashed line marks a Sikh demand extending toward the River Chenab.',
    notice: [
      'On the linked map, find the solid and dashed lines in the key.',
      'Locate Lahore and Amritsar.',
      'Ask whose concerns a border line records and whose daily lives it cannot show.',
    ],
    rights:
      'Chronos Atlas reference card. The archive requires Image Library permission for public reproduction of its scan. View the original at The National Archives.',
    credit:
      'Reference card by Chronos Atlas. Original map held by The National Archives, CO 1054/76.',
    printCredit:
      'Chronos Atlas reference card. Original map held by The National Archives, CO 1054/76.',
    printCaption:
      'The linked map distinguishes the awarded boundary from a Sikh demand. Look for its solid and dashed lines.',
    sourceImage:
      'https://www.nationalarchives.gov.uk/media/images/CO105.max-900x900.format-jpeg.jpegquality-60.bgcolor-fff.jpg',
    depiction: 'archive reference card',
    relevance:
      'Preserves a distinction between the boundary award and a competing territorial demand.',
  },
  {
    id: 'partition-telegram',
    title: 'Archive reference for the September 1947 telegram',
    subject: 'partition-1947',
    source: 'partition',
    accession: 'DO 142/416',
    creator:
      'UK High Commissioner in India to the Secretary of State for Commonwealth Relations. Reference card by Chronos Atlas.',
    date: interval(
      1947,
      1947,
      '23 September 1947',
      'The archival telegram was sent on 23 September and received on 24 September. The atlas card refers to that document.',
      'exact',
    ),
    place: 'Sent from New Delhi; reports Punjab and Delhi',
    material: 'Atlas reference card for a typed telegram held by The National Archives',
    image: '/atlas/media/partition-telegram.webp',
    thumbnail: '/atlas/media/partition-telegram-thumb.webp',
    width: 546,
    height: 900,
    alt: 'Text reference card for the telegram sent on 23 September 1947, The National Archives, DO 142/416.',
    caption:
      'Read the excerpt in the dossier or open the archive for the telegram. Its heading and numbered paragraphs organize reports from Punjab and Delhi for an official audience.',
    notice: [
      'In the linked telegram or its transcript, identify the sender, recipient and date.',
      'Notice how places and incidents are numbered.',
      'Compare the report’s administrative language with a later personal memory.',
    ],
    rights:
      'Chronos Atlas reference card. View the scan at The National Archives. Its Crown text can be quoted under the Open Government Licence v3.0. Public reproduction of the scan requires separate permission.',
    credit:
      'Reference card by Chronos Atlas. Original telegram held by The National Archives, DO 142/416.',
    printCredit:
      'Chronos Atlas reference card. Original telegram held by The National Archives, DO 142/416.',
    printCaption:
      'The telegram was sent on 23 September and received on 24 September 1947. The dossier gives an excerpt.',
    sourceImage:
      'https://www.nationalarchives.gov.uk/media/images/DO-14.max-900x900.format-jpeg.jpegquality-60.bgcolor-fff.jpg',
    depiction: 'archive reference card',
    relevance:
      'Time-specific evidence that displacement and attacks continued after the August ceremonies and boundary announcements.',
  },
];

export function applyExemplarPlaces(corpus: Corpus) {
  for (const m of media)
    if (!corpus.media.some((item) => item.id === m.id)) corpus.media.push(m);
  const angkor = corpus.subjects.find((s) => s.id === 'angkor')!;
  angkor.objectIds = ['angkor-aster'];
  angkor.placeStudy = {
    title: 'Angkor: read the landscape',
    description:
      'Select a numbered place, then compare its position with the satellite image. Positions and water shapes are simplified orientation aids, not a reconstruction of one reign.',
    bounds: [103.73, 13.27, 104.01, 13.52],
    points: [
      {
        id: 'wat',
        label: 'Angkor Wat',
        coordinates: [103.87, 13.41],
        text: 'The temple lies south of Angkor Thom. Its later history includes continuing religious use; an enclosing wall does not define the whole settlement.',
        citations: [
          cite('angkor-nasa', 'Image and Angkor Wat paragraph'),
          cite('angkor-occupation', 'Life history of the temple'),
        ],
      },
      {
        id: 'thom',
        label: 'Angkor Thom',
        coordinates: [103.86, 13.45],
        text: 'A large enclosure north of Angkor Wat. The contrast with surrounding settlement helps distinguish a monumental center from the full urban landscape.',
        citations: [cite('angkor-nasa', 'Angkor Thom paragraph')],
      },
      {
        id: 'west-baray',
        label: 'West Baray',
        coordinates: [103.8, 13.44],
        text: 'A large reservoir west of Angkor Thom, associated with the eleventh century. Read storage together with the channels and maintenance that make a network work.',
        citations: [
          cite('angkor-nasa', 'Western Baray paragraph'),
          cite('angkor-network', 'Water distribution network'),
        ],
      },
      {
        id: 'east-baray',
        label: 'East Baray',
        coordinates: [103.92, 13.44],
        text: 'An older reservoir enclosure east of Angkor Thom. Its visible form in a modern image does not establish how much water it held in every historical period.',
        citations: [cite('angkor-nasa', 'Eastern Baray paragraph')],
      },
      {
        id: 'lake',
        label: 'Toward Tonle Sap',
        coordinates: [103.88, 13.29],
        text: 'The lake lies south of the monumental core. The inhabited and cultivated plain connects the famous temples to a much wider environment.',
        citations: [cite('angkor-nasa', 'Opening and satellite image')],
      },
    ],
    features: [
      {
        label: 'Reservoir footprints',
        kind: 'water',
        points: [
          [103.765, 13.429],
          [103.835, 13.429],
          [103.835, 13.447],
          [103.765, 13.447],
          [103.765, 13.429],
        ],
        note: 'A simplified West Baray rectangle derived from the satellite orientation; dimensions are not survey data.',
        citations: [cite('angkor-nasa', 'Satellite image')],
      },
      {
        label: 'East Baray enclosure',
        kind: 'area',
        points: [
          [103.888, 13.432],
          [103.953, 13.432],
          [103.953, 13.45],
          [103.888, 13.45],
          [103.888, 13.432],
        ],
        note: 'An enclosure outline, not a claim that it was filled at the same time as the modern image of West Baray.',
        citations: [cite('angkor-nasa', 'Eastern Baray')],
      },
      {
        label: 'Lakeward direction',
        kind: 'water',
        points: [
          [103.74, 13.29],
          [103.8, 13.28],
          [103.87, 13.285],
          [103.94, 13.27],
          [104.0, 13.275],
        ],
        note: 'A schematic edge indicating the lakeward side of the plain, not a historical shoreline.',
        citations: [cite('angkor-nasa', 'Image')],
      },
    ],
  };
  const partition = corpus.subjects.find((s) => s.id === 'partition-1947')!;
  partition.objectIds = ['partition-punjab-map', 'partition-telegram'];
  partition.placeStudy = {
    background: 'coastline',
    title: 'Partition: two regions, different histories',
    description:
      'A geographic locator for the Punjab and Bengal evidence. Boxes identify reading areas only. Use the linked archival Punjab map to examine its actual boundary claim; no current political borders or individual migration routes are drawn here.',
    bounds: [65, 19, 96, 36],
    points: [
      {
        id: 'lahore',
        label: 'Lahore · Punjab',
        coordinates: [74.36, 31.55],
        text: 'A major place of attachment in the Punjab investigation. The archival map places Lahore west of the awarded boundary.',
        citations: [
          cite('partition-map', 'Lahore on the map'),
          cite('partition', 'Source 3 introduction'),
        ],
      },
      {
        id: 'amritsar',
        label: 'Amritsar · Punjab',
        coordinates: [74.87, 31.63],
        text: 'Near Lahore geographically, but on the other side of the 1947 award. At this scale the markers are close together; the labelled list offers the same selection.',
        citations: [cite('partition-map', 'Amritsar on the map')],
      },
      {
        id: 'delhi',
        label: 'Delhi',
        coordinates: [77.21, 28.61],
        text: 'The September telegram was sent from New Delhi. Its reports describe places beyond the office that sent it.',
        citations: [cite('partition', 'Source 1: sender, date and contents')],
      },
      {
        id: 'barrackpore',
        label: 'Barrackpore · Bengal',
        coordinates: [88.37, 22.76],
        text: 'The museum summary places visits to Sunil Chandra Ghosh’s father here after the family’s move from East Pakistan. This is a place in one remembered relationship, not an endpoint for all refugees.',
        citations: [cite('partition-oral', 'Sunil Chandra Ghosh summary')],
      },
      {
        id: 'mymensingh',
        label: 'Mymensingh · East Bengal',
        coordinates: [90.41, 24.75],
        text: 'The place associated with Ila Banerjee’s family before their departure in 1950, according to the museum summary. Later movement matters to the chronology.',
        citations: [cite('partition-oral', 'Ila Banerjee summary')],
      },
    ],
    features: [
      {
        label: 'Punjab reading area',
        kind: 'area',
        points: [
          [72, 29],
          [76, 29],
          [76, 33],
          [72, 33],
          [72, 29],
        ],
        note: 'An approximate reading-area box, not the limits of Punjab or any state.',
        citations: [cite('partition-map', 'Geographic scope')],
      },
      {
        label: 'Bengal reading area',
        kind: 'area',
        points: [
          [86, 21],
          [92, 21],
          [92, 26],
          [86, 26],
          [86, 21],
        ],
        note: 'An approximate reading-area box locating the eastern examples; it is not a proposed or current border.',
        citations: [cite('partition-oral', 'East Pakistan and Bengal summaries')],
      },
    ],
  };
}
