import type { Corpus, PlaceStudy, Source } from '../../src/atlas/model';
import { cite } from './content-helpers';

const consulted = '2026-10-28';
const sources: Source[] = [
  ...[
    [
      'sic-san-lorenzo',
      'San Lorenzo Tenochtitlan',
      '113',
      '17.750568443517,-94.761692364953',
    ],
    ['sic-la-venta', 'La Venta', '100', '18.102359196781,-94.040095152319'],
    ['sic-tres-zapotes', 'Tres Zapotes', '116', '18.465787824243,-95.440245587379'],
  ].map(([id, name, number, pin]) => ({
    id: id!,
    title: `${name}: archaeological-site record`,
    institution: 'Sistema de Información Cultural, Secretaría de Cultura / INAH',
    url: `https://sic.cultura.gob.mx/ficha.php?table=zona_arqueologica&table_id=${number}`,
    type: 'catalogue' as const,
    accessed: consulted,
    scope: `Named official archaeological-site record and its “abrir en google maps” href consulted for identity and visitor/reference location. Published href q=${pin} (latitude,longitude) is rounded for regional orientation. Not an excavated house, offering, ancient site extent or surveyed workshop position. Visitor settings can differ from a monument centroid. Chronological narrative and exact travel directions are not adopted from this locator record; use the separately cited research/INAH account. No photograph, source-map geometry, political boundary or route copied.`,
  })),
  {
    id: 'tonga-lapita-tentative',
    title: 'Lapita Pottery Archaeological Sites: Tentative List submission',
    institution: 'Tonga National Commission for UNESCO; UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/tentativelists/5168/',
    published: '9 August 2007',
    accessed: consulted,
    type: 'archive',
    scope:
      'Coordinates, submission metadata and named island groups read. S20 00 W175 00 supplies a deliberately broad Tongan-islands reference, not Nukuleka or another excavation’s coordinates. A Tentative List submission is not an inscribed World Heritage property. Its mixed chronological claims are not adopted; use the selected dated studies for site/phase histories. No map or photograph copied, exact voyage inferred or institutional endorsement invented.',
  },
];

const studies: Record<string, PlaceStudy> = {
  olmec: {
    title: 'Several Gulf Coast centres, different histories',
    description:
      'Rounded official visitor/reference pins orient San Lorenzo, La Venta and Tres Zapotes. They are not ancient borders, an exact political succession or a route between workshops. The selected ceramic figure has no excavated findspot in its catalogue; none of these pins supplies one.',
    bounds: [-95.65, 17.5, -93.8, 18.7],
    points: [
      {
        id: 'san-lorenzo-reference',
        label: 'San Lorenzo — site-area reference',
        coordinates: [-94.762, 17.751],
        text: 'An official SIC reference pin orients the named settlement. The original dossier’s broader regional anchor stays separate. Prepared floors, filling and terrace work come from the archaeological accounts, rather than an exact workshop position recovered from this pin.',
        citations: [
          cite('sic-san-lorenzo', 'Named record; abrir en google maps href'),
          cite('olmec-sampling-2020', 'Printed pp. 130, 135 and 140–141'),
        ],
      },
      {
        id: 'la-venta-reference',
        label: 'La Venta — a different monumental setting',
        coordinates: [-94.04, 18.102],
        text: 'Rounded official site reference. INAH’s conventional 800–400 BCE peak belongs to this centre; its platforms and buried greenstone offerings do not prove a single exact transfer of power from San Lorenzo.',
        citations: [
          cite('sic-la-venta', 'Named record; abrir en google maps href'),
          cite('olmec-regional-inah', 'Introductoria: two conventional peaks'),
          cite('olmec', 'La Venta platforms and greenstone offerings'),
        ],
      },
      {
        id: 'tres-zapotes-reference',
        label: 'Tres Zapotes — regional visitor reference',
        coordinates: [-95.44, 18.466],
        text: 'This modern visitor/reference pin is not an ancient boundary. Doyle notes continuing production at Tres Zapotes after La Venta’s selected ending. That comparison does not extend every object or the original dossier to one continuous period.',
        citations: [
          cite('sic-tres-zapotes', 'Named record; abrir en google maps href'),
          cite('olmec', 'After 400 B.C.: production at other centres'),
        ],
      },
    ],
    features: [],
  },
  lapita: {
    title: 'Different island settings across the Pacific',
    description:
      'This regional locator diagram crosses the 180° meridian. Three coarse island settings orient different sources; they are not one recovered canoe journey or a set of exact excavation positions. No shoreline, route, political territory or claim of the same community on every island is drawn. Rove and Nukuleka remain named research settings without invented site coordinates.',
    bounds: [145, -25, -170, 0],
    crossesAntimeridian: true,
    points: [
      {
        id: 'bismarck-orientation',
        label: 'Bismarck Archipelago — broad regional orientation',
        coordinates: [151, -5],
        text: 'The inherited broad regional anchor orients Irwin’s approximate 1500 BCE account. It does not identify a single starting village, recovered departure point or shared first arrival on every island.',
        citations: [cite('lapita-voyaging', 'Page 3: opening Bismarck orientation')],
      },
      {
        id: 'efate-orientation',
        label: 'Efate — Teouma study’s island setting',
        coordinates: [168.4, -17.7],
        text: 'A coarse island point read from the study map’s graticule, accurate only at tens-of-kilometres scale. It is not the cemetery’s GPS position or an access locator. The dietary-protein study concerns Teouma’s selected early community, not every Pacific island.',
        citations: [
          cite(
            'lapita-teouma-diet',
            'Figure 2, visually inspected; The site and skeletal sample',
          ),
        ],
      },
      {
        id: 'tonga-orientation',
        label: 'Tongan island groups — regional reference',
        coordinates: [-175, -20],
        text: 'The submission’s S20 W175 point is deliberately regional, spanning named island groups. It must not stand for Nukuleka’s sampled beach or the location of a particular coral file. Selected Tongan site studies carry their own overlapping chronological estimates.',
        citations: [
          cite('tonga-lapita-tentative', 'Coordinates; State, Province or Region'),
          cite('lapita-nukuleka-uth', 'Nukuleka setting; Sample Context'),
          cite('lapita-tonga-dating', 'Bayesian Overlap Model; Discussion'),
        ],
      },
    ],
    features: [],
  },
  'poverty-point': {
    title: 'Poverty Point and Jaketown: compare local sequences',
    description:
      'Two modern archaeological-site references orient the primary study’s regional comparison. Their occupations, sampled deposits and mound histories remain distinct. Points show neither an exact trade itinerary nor a boundary around a people. The accompanying terrain figure supplies a different, local surface view of Poverty Point.',
    bounds: [-91.65, 32.4, -90.25, 33.45],
    points: [
      {
        id: 'poverty-property-reference',
        label: 'Poverty Point — property reference',
        coordinates: [-91.406, 32.637],
        text: 'Rounded from UNESCO’s published property coordinate; no datum, mound centroid or metre accuracy is inferred. The original dossier locator is preserved. The selected main earthwork frame remains about 1700–1100 BCE.',
        citations: [
          cite('pp-heritage', 'Property coordinates: N32°38′13″ W91°24′23″'),
          cite('pp-nps', 'Main residential/ceremonial frame'),
        ],
      },
      {
        id: 'jaketown-site-reference',
        label: 'Jaketown — a separately dated archaeological site',
        coordinates: [-90.486, 33.237],
        text: 'Rounded from the state page’s own archaeological-site map point, rather than a similarly named hamlet. The 2023 study’s modeled earlier related practices challenge assuming that every similar assemblage spread outward from Poverty Point. This pin does not locate an individual sampled trench.',
        citations: [
          cite('jaketown-locator', 'Published GeoJSON Point and POINT value'),
          cite('pp-chronology-2023', 'Abstract; Discussion; Conclusion'),
        ],
      },
    ],
    features: [],
  },
};

export function applyCoastPlaces(c: Corpus) {
  for (const source of sources) {
    const existing = c.sources.find((s) => s.id === source.id);
    if (existing) Object.assign(existing, source);
    else c.sources.push(source);
  }
  for (const [id, study] of Object.entries(studies))
    c.subjects.find((s) => s.id === id)!.placeStudy = study;
}
