import type { Media } from '../../src/atlas/model';
import { interval } from './content-helpers';

export const citizenshipMedia: Media[] = [
  {
    id: 'indonesia-proclamation',
    printWidthMm: 100,
    title: 'Indonesian independence proclamation: typed facsimile',
    subject: 'indonesia-independence',
    source: 'indonesia-proclamation-image',
    accession: 'Wikimedia Commons: Proklamasi.png; document dated 17 August 1945',
    creator:
      'Proclamation signed by Sukarno and Mohammad Hatta; digital facsimile via Wikimedia Commons',
    date: interval(
      1945,
      1945,
      '17 August 1945',
      'Date of the represented proclamation. This digital facsimile is not the handwritten ANRI draft or a newly photographed original.',
      'exact',
    ),
    place: 'Jakarta, Indonesia',
    material: 'Typed text and signatures, reproduced as a digital image',
    image: '/atlas/media/indonesia-proclamation.webp',
    thumbnail: '/atlas/media/indonesia-proclamation-thumb.webp',
    width: 399,
    height: 268,
    alt: 'Short Indonesian text headed Proklamasi, with a Jakarta date and Sukarno and Hatta signatures beneath.',
    caption:
      'A brief declaration with two signatures. Its text announces independence and addresses the transfer of power. This typed version and the handwritten ANRI draft are different forms of the same proclamation.',
    printCaption:
      'Typed proclamation, distinct from the handwritten ANRI draft. A declaration does not itself establish control of territory.',
    notice: [
      'Find the signatures and the dated line.',
      'Distinguish the proclamation’s words from evidence of control over territory.',
      'This small facsimile has limited resolution; use the evidence paraphrase and archival reference for reading.',
    ],
    rights:
      'Wikimedia Commons identifies the government-issued proclamation as public domain in Indonesia under Article 43 of Law 28 of 2014.',
    credit:
      'Indonesian independence proclamation, via Wikimedia Commons. Converted to WebP at the original dimensions.',
    printCredit:
      'Indonesian government document, via Wikimedia Commons; WebP conversion only.',
    sourceImage: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Proklamasi.png',
    depiction: 'contemporary document',
    relevance:
      'An actual proclamation makes the difference between a political declaration and subsequent implementation visible.',
  },
  {
    id: 'ghana-independence-stamp',
    printWidthMm: 120,
    title: 'Independence overprinted on a Gold Coast stamp',
    subject: 'ghana-independence',
    source: 'ghana-stamp-image',
    accession:
      'Gold Coast 1-shilling stamp, Ghana independence overprint, 1957; Commons scan',
    creator: 'British government postal issue; scan uploaded by Philafrenzy',
    date: interval(
      1957,
      1957,
      'Independence overprint, 6 March 1957',
      'Date announced by the overprint. The underlying Gold Coast design predates this change; digital scan uploaded in 2016.',
      'exact',
    ),
    place: 'Gold Coast / Ghana',
    material: 'Printed and overprinted postage stamp; digital scan',
    image: '/atlas/media/ghana-independence-stamp.webp',
    thumbnail: '/atlas/media/ghana-independence-stamp-thumb.webp',
    width: 611,
    height: 460,
    alt: 'Red Gold Coast stamp with Elizabeth II, people breaking cocoa pods, and black text reading Ghana Independence 6th March 1957.',
    caption:
      'The overprint announces a new name and independence date. The older royal portrait and cocoa scene remain visible. Ghana initially retained the monarchy; the republic followed in 1960.',
    notice: [
      'Separate the black overprint from the older red design.',
      'Find the work scene and its label.',
      'Ask what the image can show about public messaging, and what it cannot establish about workers’ lives.',
    ],
    rights:
      'Public domain: expired UK government Crown copyright, as recorded on the source file page.',
    credit:
      'British government postal issue; scan via Philafrenzy / Wikimedia Commons. Resized and converted to WebP; no design alteration.',
    sourceImage:
      'https://upload.wikimedia.org/wikipedia/commons/7/7e/Ghana_Independence_overprint_on_Gold_Coast_1s_stamp_1957.jpg',
    depiction: 'contemporary document',
    relevance:
      'Layers on a single public object connect political change with continuing institutions and agricultural work.',
  },
  {
    id: 'mandela-voting',
    printWidthMm: 90,
    title: 'Nelson Mandela casts his ballot, April 1994',
    subject: 'south-africa-rights',
    source: 'sa-voting-image',
    accession:
      'Paul Weinberg election photograph; Commons permission record 2013062010004691',
    creator:
      'Paul Weinberg, official photographer for the Independent Electoral Commission',
    date: interval(
      1994,
      1994,
      'April 1994 election',
      'Photograph of the 1994 vote, not the 1996 constitution signing. The selected file record dates it to April 1994.',
      'exact',
    ),
    place: 'Ohlange School, Inanda, near Durban, South Africa',
    material: 'Black-and-white documentary photograph; digital reproduction',
    image: '/atlas/media/mandela-voting.webp',
    thumbnail: '/atlas/media/mandela-voting-thumb.webp',
    width: 538,
    height: 800,
    alt: 'Nelson Mandela smiles while lowering a ballot into a box, with other people behind him inside a polling room.',
    caption:
      'Paul Weinberg photographed Mandela voting at Ohlange School. The photograph records a particular act in the democratic election; it does not show the later constitution-making or measure the realization of rights.',
    notice: [
      'Describe the ballot, box and setting before interpreting the expression.',
      'Identify the photographer and occasion.',
      'Keep the photograph’s 1994 date separate from the 1996–1997 constitutional milestones.',
    ],
    rights: 'CC BY-SA 3.0. The derivative remains under the same licence.',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    credit:
      '© Paul Weinberg / Wikimedia Commons, CC BY-SA 3.0. Resized and converted to WebP; no cropping or content alteration.',
    sourceImage:
      'https://upload.wikimedia.org/wikipedia/commons/7/73/Mandela_voting_in_1994.jpg',
    depiction: 'contemporary document',
    relevance:
      'A documented voting act introduces political participation and the separate work of making and enforcing a constitution.',
  },
];
