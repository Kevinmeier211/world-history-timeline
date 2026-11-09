import type { Corpus, PlaceStudy } from '../../src/atlas/model';
import { cite } from './content-helpers';
const studies: Record<string, PlaceStudy> = {
  palmyra: {
    title: 'Palmyra: a city within an exchange network',
    background: 'coastline',
    description:
      'Approximate city locators follow the consulted account’s trading-post sequence. The dashed connection is schematic: it does not reproduce an excavated road, every intermediary or the journey of Zabdibol’s family. Civic transactions and local supply also mattered within the city.',
    bounds: [34.5, 30.5, 46, 38],
    points: [
      {
        id: 'antioch',
        label: 'Antioch — Mediterranean-facing exchange',
        coordinates: [36.16, 36.2],
        text: 'The Met describes routes from Antioch across the Syrian Desert through Palmyra to Ctesiphon. The point marks Antioch’s city area. The route account gives no findspot for a particular cargo.',
        citations: [cite('trade', 'Trading-post sequence beginning at Antioch')],
      },
      {
        id: 'palmyra',
        label: 'Palmyra — families and civic exchange',
        coordinates: [38.27, 34.56],
        text: 'The memorial, local tax regulation and caravan records belong to different activities. None establishes the selected family’s occupation or a complete itinerary.',
        citations: [
          cite('met-322375', 'Family inscription'),
          cite('palmyra-tax', 'Printed pp. 173–175'),
        ],
      },
      {
        id: 'ctesiphon',
        label: 'Ctesiphon — a Mesopotamian trading setting',
        coordinates: [44.58, 33.09],
        text: 'The Met names Ctesiphon in the wider sequence of distribution. A line between these locators is not evidence that one person carried a shipment through every place.',
        citations: [cite('trade', 'Trading posts and distribution')],
      },
    ],
    features: [
      {
        label: 'Selected trading-post sequence',
        kind: 'route',
        points: [
          [36.16, 36.2],
          [38.27, 34.56],
          [44.58, 33.09],
        ],
        note: 'Author-drawn schematic linking the Met account’s named places; not an exact ancient road, continuous single journey or route of the pictured family.',
        citations: [cite('trade', 'Antioch, Palmyra and Ctesiphon paragraph')],
      },
    ],
  },
  'kushan-contexts': {
    title: 'Kushan settings: centers and a temple-inscription region',
    description:
      'Peshawar and Mathura are approximate city locators. The third point deliberately marks the broader Baghlan temple-inscription region, not exact coordinates of Rabatak, Surkh Kotal or a coin find. No imperial polygon or reconstructed itinerary joins them.',
    bounds: [66.5, 25.5, 79, 38],
    points: [
      {
        id: 'peshawar',
        label: 'Peshawar / Purushapura — regional center',
        coordinates: [71.57, 34.01],
        text: 'The consulted overview identifies Purushapura, modern Peshawar, as one of Kanishka’s centers. This does not supply a findspot for the selected Met coin.',
        citations: [cite('kushan', 'Kanishka centers paragraph')],
      },
      {
        id: 'mathura',
        label: 'Mathura — a different urban setting',
        coordinates: [77.67, 27.5],
        text: 'Mathura is named separately in the overview. Connections between political centers do not make their local institutions or communities identical.',
        citations: [cite('kushan', 'Kanishka centers paragraph')],
      },
      {
        id: 'baghlan',
        label: 'Baghlan region — Rabatak and Surkh Kotal',
        coordinates: [68.5, 36.1],
        text: 'Sims-Williams locates the two temple records in this region. The deliberately broad point avoids presenting a speculative modern map coordinate as the precise location of either ancient inscription.',
        citations: [
          cite('kushan-inscriptions', 'Printed pp. 77–78, site descriptions'),
        ],
      },
    ],
    features: [],
  },
  aksum: {
    title: 'Aksum: highland city, coastal outlet and inland research',
    background: 'coastline',
    description:
      'Approximate locators distinguish different functions and dates. The Yeha-district point orients the Beta Samati discussion; it is not the exact excavation coordinate. The map draws no precise mountain road or territorial boundary and does not make later deposits contemporary with the first-century port account.',
    bounds: [38.2, 13.6, 40.2, 15.8],
    points: [
      {
        id: 'aksum',
        label: 'Aksum — highland center',
        coordinates: [38.72, 14.13],
        text: 'The capital locator is inland. Its connection with Adulis does not make Aksum a coastal harbor, nor date every surviving monument to 200 CE.',
        citations: [
          cite('aksum-world', 'Excerpt pp. 5–7'),
          cite('aksum', 'Architecture and stelae chronology'),
        ],
      },
      {
        id: 'adulis',
        label: 'Adulis — Red Sea outlet',
        coordinates: [39.66, 15.26],
        text: 'Binyam and Krebs place Adulis near the Gulf of Zula and discuss the Periplus’s port/inland connection. Ancient landing places and shorelines require separate archaeological investigation.',
        citations: [cite('aksum-world', 'Excerpt pp. 5–7')],
      },
      {
        id: 'yeha-research',
        label: 'Yeha district — Beta Samati research area',
        coordinates: [39.0, 14.3],
        text: 'The excavators locate Beta Samati northeast of Yeha and document multiple periods. This rounded district locator is not a surveyed excavation point or a claim that every shipment passed through the town.',
        citations: [
          cite(
            'beta-samati',
            'Printed pp. 1534–1535: Yeha-region study and site location',
          ),
        ],
      },
    ],
    features: [],
  },
};
export function applyExchangePlaces(corpus: Corpus) {
  for (const [id, placeStudy] of Object.entries(studies))
    corpus.subjects.find((s) => s.id === id)!.placeStudy = placeStudy;
}
