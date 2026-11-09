import type { Corpus, Source } from '../../src/atlas/model';
import { cite } from './content-helpers';
const accessed = '2026-10-29';
const sources: Source[] = [
  {
    id: 'kerma-location-tentative',
    title: 'Kerma — Tentative List submission 6594',
    institution: 'UNESCO World Heritage Centre / Sudan',
    url: 'https://whc.unesco.org/en/tentativelists/6594/',
    type: 'archaeology',
    accessed,
    scope:
      'Coordinates and opening Kerma description consulted. Published N19 36 2.89 E30 24 35.03 gives approximately [30.40973,19.60080]; the panel deliberately retains a rounded regional reference near the inherited case anchor. This is a Tentative List submission, not World Heritage inscription or an exact workshop coordinate. No source-map geometry, site boundary or protected image copied.',
  },
  {
    id: 'abydos-location-tentative',
    title: 'Abydos — Tentative List submission 1823',
    institution: 'UNESCO World Heritage Centre / Egypt',
    url: 'https://whc.unesco.org/en/tentativelists/1823/',
    type: 'archaeology',
    accessed,
    scope:
      'Published coordinate/submission metadata consulted. Coordinates 26°11′N /31°55′E have only arcminute resolution; converted and rounded to [31.917,26.183] for regional orientation. This is not Tomb 525, a sub-kilometre grave location or an established vessel route. A Tentative List record does not mean World Heritage inscription. No map or boundary copied.',
  },
  ...(
    [
      [
        'nimrud-geonames',
        'Kalhu / Nimrud',
        'x000002130.html',
        '43.3275,36.099167',
        '894019',
      ],
      [
        'nineveh-geonames',
        'Nineveh',
        'x000002140.html',
        '43.151937,36.358684',
        '874621',
      ],
      [
        'dur-sharrukin-geonames',
        'Dur-Šarrukin / Khorsabad',
        'D.html',
        '43.228261,36.510016',
        '874458',
      ],
    ] as const
  ).map(([id, name, page, coordinates, pleiades]) => ({
    id,
    title: `${name} — Oracc geographical name record`,
    institution: 'Oracc; Pleiades-linked reference gazetteer',
    url: `https://oracc.museum.upenn.edu/geonames/cbd/qpn/${page}`,
    type: 'catalogue' as const,
    accessed,
    scope: `Named entry and its Pleiades-linked coordinates read in directly saved Oracc HTML: [${coordinates}], Pleiades ${pleiades}. Rounded for a city/site reference, not a particular doorway, ancient river bankline or imperial border. Initial web opens failed; later direct HTML succeeded. No source map copied. The Pleiades page itself returned an anti-bot challenge and is not claimed as directly read. Capital roles require the separately cited Met historical account.`,
  })),
  {
    id: 'napatan-locations',
    title: 'Gebel Barkal and the Sites of the Napatan Region — geographical data',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/1073/maps/',
    type: 'archaeology',
    accessed,
    scope:
      'Geographical data table only, especially components 1073-003 Nuri (N18 33 50.00 E31 55 0.00) and 1073-004 Sanam (N18 28 56.00 E31 49 8.00). Converted to [31.917,18.564] and [31.819,18.482] for rounded property references. No datum, exact centroid, excavation trench, tomb location or metre precision inferred. Original Taharqo case anchor remains unchanged; the selected object’s Nuri association remains probable. Nomination and component map PDFs not newly read or copied.',
  },
];
export function applyInstitutionPlaces(c: Corpus) {
  c.sources.push(...sources);
  c.subjects.find((s) => s.id === 'kerma-potters')!.placeStudy = {
    title: 'Kerma and Abydos: distinguish a capital from a findspot',
    description:
      'Two regional references connect different kinds of evidence: a city with excavated craft and institutional spaces, and the area where this beaker was actually found. Coordinates alone do not identify a potter, owner, house or journey. The Nile and any route are not reconstructed in this locator diagram.',
    bounds: [29.8, 19.1, 32.5, 26.8],
    points: [
      {
        id: 'kerma',
        label: 'Kerma — regional capital setting',
        coordinates: [30.41, 19.6],
        text: 'The project describes residential areas, craft activity and institutional buildings at Kerma. This broad reference near the inherited case anchor does not locate the selected vessel’s workshop. The beaker’s recorded grave context is elsewhere, at Abydos.',
        citations: [
          cite('kerma-location-tentative', 'Coordinates; opening Description'),
          cite(
            'kerma-city-project',
            'City of Kerma: excavated city and institutional/craft spaces',
          ),
        ],
      },
      {
        id: 'abydos',
        label: 'Abydos — recorded findspot region',
        coordinates: [31.917, 26.183],
        text: 'The catalogue records Tomb 525 at Abydos. This minute-resolution regional point is not that grave’s surveyed position. A vessel’s style and its findspot do not by themselves identify the owner’s origin or reconstruct a journey between these points.',
        citations: [
          cite('abydos-location-tentative', 'Coordinates; submission metadata'),
          cite('met-545772', 'Description and Geography: Abydos, Tomb 525'),
        ],
      },
    ],
    features: [],
  };
  c.subjects.find((s) => s.id === 'nimrud-palace')!.placeStudy = {
    title: 'Different Assyrian royal centres in time',
    description:
      'Three city references orient the Met account of changing royal capitals. Their roles belong to different reigns. The separate composite palace plan supplies architectural detail at Kalhu; this regional panel does not reconstruct that plan, a military route, an ancient river bankline or imperial borders.',
    bounds: [42.9, 35.9, 43.6, 36.7],
    points: [
      {
        id: 'kalhu',
        label: 'Kalhu / Nimrud — selected palace setting',
        coordinates: [43.328, 36.099],
        text: 'Ashurnasirpal’s Northwest Palace belongs to this city. The original dossier’s broader anchor remains. This rounded gazetteer reference is not an original doorway or the precise position of the selected relief.',
        citations: [
          cite('nimrud-geonames', 'Named entry; coordinates linked to Pleiades 894019'),
          cite('nimrud', 'Northwest Palace and capital setting'),
        ],
      },
      {
        id: 'dur-sharrukin',
        label: 'Dur-Šarrukin — a later royal capital',
        coordinates: [43.228, 36.51],
        text: 'The Met places the later move to Dur-Šarrukin under Sargon II. Its palace is not the same building or reign as Ashurnasirpal’s at Kalhu. The point identifies the ancient city region, not a route or simultaneous capital.',
        citations: [
          cite(
            'dur-sharrukin-geonames',
            'D index, Dur-Šarrukin entry; Pleiades 874458',
          ),
          cite('nimrud', 'Later capitals under Sargon II and Sennacherib'),
        ],
      },
      {
        id: 'nineveh',
        label: 'Nineveh — another later royal centre',
        coordinates: [43.152, 36.359],
        text: 'Sennacherib subsequently made Nineveh a royal capital in the Met account. The continued history of Kalhu and this later capital are different questions. No line between these locators is presented as an excavated journey.',
        citations: [
          cite(
            'nineveh-geonames',
            'Named entry; coordinates linked to Pleiades 874621',
          ),
          cite('nimrud', 'Later capital and continued local use'),
        ],
      },
    ],
    features: [],
  };
  c.subjects.find((s) => s.id === 'taharqo')!.placeStudy = {
    title: 'Nuri and Sanam: burial and production evidence',
    description:
      'Two published property references near the Fourth Cataract orient different evidence. A probable association of the Met figure with Nuri is not converted into an exact grave findspot. Sanam’s excavated workshop has a broader chronology. Kawa’s building account concerns another place outside this local window; no connecting route or ancient Nile geometry is drawn.',
    bounds: [31.72, 18.36, 32.03, 18.65],
    points: [
      {
        id: 'nuri',
        label: 'Nuri — probable royal burial association',
        coordinates: [31.917, 18.564],
        text: 'The Met calls the selected granite figure probably from Nuri. The property reference is a different, rounded orientation point from the preserved original dossier anchor. Neither locates the object’s excavation or turns an attribution into a documented findspot.',
        citations: [
          cite('napatan-locations', 'Geographical data: component 1073-003 Nuri'),
          cite('met-544883', 'Description and Geography'),
        ],
      },
      {
        id: 'sanam',
        label: 'Sanam — excavated production setting',
        coordinates: [31.819, 18.482],
        text: 'The primary study describes workshop remains, manufacturing debris and a mould matching an uninscribed faience fragment. Its institutional interpretation concerns that material and context; it does not identify where the Met granite figure was made or name the fragment’s intended king.',
        citations: [
          cite('napatan-locations', 'Geographical data: component 1073-004 Sanam'),
          cite(
            'sanam-production-2026',
            'New excavations; workshop and production discussion; Figures 4 and 10',
          ),
        ],
      },
    ],
    features: [],
  };
}
