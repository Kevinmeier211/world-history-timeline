import type { Corpus, PlaceStudy } from '../../src/atlas/model';
import { cite } from './content-helpers';
const studies: Record<string, PlaceStudy> = {
  'benin-ivory': {
    title: 'Benin City and a coast-facing court economy',
    description:
      'Approximate regional locators distinguish the Edo court in present-day Nigeria from the modern Republic of Benin. The coast point orients contact, not a particular landing, saltcellar route, workshop or findspot. No reconstructed kingdom boundary is drawn.',
    background: 'coastline',
    bounds: [4.4, 5, 7.1, 7],
    points: [
      {
        id: 'benin-city',
        label: 'Benin City — Edo court area',
        coordinates: [5.62, 6.34],
        text: 'Court orientation for the qualified Benin attribution. This point does not locate the selected carver’s workshop.',
        citations: [
          cite('benin-court-guilds', 'Court history'),
          cite('met-309900', 'Culture: court of Benin (?)'),
        ],
      },
      {
        id: 'regional-coast',
        label: 'Regional coast — orientation only',
        coordinates: [5.3, 5.6],
        text: 'A broad coastal orientation for the museum account of Portuguese contact. It is not an identified port, landing or exact route.',
        citations: [cite('benin-court-guilds', 'Conquest and contact')],
      },
    ],
    features: [],
  },
  'kongo-translation': {
    title: 'A royal center and the Atlantic setting',
    description:
      'Approximate city and coast locators orient Mbanza Kongo and the wider Atlantic setting. They are not the crucifix’s findspot, a missionary itinerary or a surveyed kingdom outline. Modern country borders do not define historical Kongo.',
    background: 'coastline',
    bounds: [11, -8, 16, -4],
    points: [
      {
        id: 'mbanza-kongo',
        label: 'Mbanza Kongo — royal center',
        coordinates: [14.25, -6.27],
        text: 'The capital area orients royal and religious history. No original owner or user of this crucifix is placed here.',
        citations: [cite('kongo-christianity', 'Royal center and later movement')],
      },
      {
        id: 'atlantic-coast',
        label: 'Atlantic coast — regional orientation',
        coordinates: [12.4, -6],
        text: 'A coast-area locator for contacts and trafficking in the consulted accounts, not an exact departure point for a person or object.',
        citations: [cite('kongo-interview', 'Portuguese encounters and trafficking')],
      },
    ],
    features: [],
  },
  'portuguese-voyage': {
    title: 'Selected voyage places, without an invented ship track',
    description:
      'Rounded city-area locators identify departure, selected encounters and the separate 1510 Goa episode. The large region preserves relative location, not a navigation chart. No connecting line claims an exact course, distance, anchorage or return itinerary.',
    background: 'coastline',
    bounds: [-15, -38, 82, 44],
    points: [
      {
        id: 'lisbon',
        label: 'Lisbon — voyage departure',
        coordinates: [-9.14, 38.72],
        text: 'Departure orientation for the 1497–1499 voyage, not a reconstructed berth or fleet track.',
        citations: [
          cite(
            'gama-journal-1898',
            'Printed p. 1: departure; editorial Lisbon heading',
          ),
        ],
      },
      {
        id: 'malindi',
        label: 'Malindi — negotiation and pilotage',
        coordinates: [40.12, -3.22],
        text: 'The journal records meetings, detention and a pilot here. It does not identify that pilot by name in the selected passage.',
        citations: [cite('gama-journal-1898', 'Printed pp. 39–46')],
      },
      {
        id: 'calicut',
        label: 'Calicut / Kozhikode — encounters and audience',
        coordinates: [75.78, 11.26],
        text: 'A city-area locator. The journal distinguishes offshore anchorages and travel to the ruler; this point is not one exact anchorage.',
        citations: [cite('gama-journal-1898', 'Printed pp. 47–57')],
      },
      {
        id: 'goa',
        label: 'Goa — separate 1510 conquest',
        coordinates: [73.91, 15.5],
        text: 'A later reference episode beyond the preserved 1497–1499 case interval; this is not another stop assigned to the first voyage.',
        citations: [cite('interwoven', 'India 1510')],
      },
    ],
    features: [],
  },
};
export function applyEncounterPlaces(corpus: Corpus) {
  for (const [id, study] of Object.entries(studies))
    corpus.subjects.find((s) => s.id === id)!.placeStudy = study;
}
