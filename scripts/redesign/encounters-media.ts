import type { Media } from '../../src/atlas/model';
import { interval } from './content-helpers';
export const encounterMedia: Media[] = [
  {
    id: 'voyage-mediation-diagram',
    subject: 'portuguese-voyage',
    source: 'gama-journal-1898',
    title: 'An arrival requires more than sailing',
    accession: 'Chronos original teaching diagram, C7, 28 October 2026',
    creator: 'Chronos / Codex; source-based editorial diagram',
    date: interval(
      2026,
      2026,
      'Teaching diagram made 28 October 2026',
      'Modern creation date, separate from represented evidence.',
      'exact',
    ),
    representedDate:
      'Selected Malindi and Calicut encounters in the 1498 narrative; English edition 1898.',
    place: 'Modern task sequence, not a ship track or surveyed harbor plan',
    material: 'Original SVG diagram',
    image: '/atlas/media/voyage-mediation-diagram.svg',
    thumbnail: '/atlas/media/voyage-mediation-diagram-thumb.webp',
    width: 600,
    height: 300,
    printWidthMm: 145,
    alt: 'Two panels distinguish supplies and a pilot at Malindi from interpreters and a court audience at Calicut. An arrow follows the narrative, not an exact ship track. A note says assistance does not establish free choice.',
    caption:
      'Modern guide to work in the selected 1498 narrative. An arrow follows the account, not an exact sailing line; assistance does not establish free choice.',
    printCaption:
      'Modern guide: supplies, pilotage and interpretation. Narrative sequence, not an exact route or proof of free choice.',
    notice: [
      'Name a task that sailing alone could not complete.',
      'Keep the journal’s detention episodes alongside its accounts of assistance.',
    ],
    rights: 'CC BY 4.0; original artwork, no source figure reproduced.',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    credit:
      'Chronos / Codex, 2026. Based on anonymous journal, English ed. Ravenstein 1898, pp. 39–57.',
    printCredit:
      'Chronos / Codex, 2026. CC BY 4.0. Journal, English ed. 1898, pp. 39–57.',
    sourceImage: '/atlas/media/voyage-mediation-diagram.svg',
    depiction: 'explanatory diagram',
    relevance:
      'Makes necessary tasks explicit while keeping coercion and the source’s perspective visible.',
  },
];
