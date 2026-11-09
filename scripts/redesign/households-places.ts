import type { Corpus, Source, PlaceStudy } from '../../src/atlas/model';
export const householdPlaceSources: Source[] = [
  {
    id: 'pyramid-field-locators',
    title: 'Memphis and its Necropolis: geographical data for serial components',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/86/maps/',
    type: 'archive',
    accessed: '2026-10-28',
    scope:
      'Geographical data table consulted for components 86-001 (Site of Memphis) and86-002 (Pyramid fields from Giza to Dahshur). Published DMS reference coordinates converted to decimal and rounded for orientation. Component 86-002 is a broad property reference, not the precise Heit el-Ghurab excavation or bakery. Linked cadastral maps/boundaries not inspected or copied. No ancient channel, exact route or political boundary inferred.',
  },
  {
    id: 'orkney-brodgar-locator',
    title: 'Ring of Brodgar: HES/Trove location metadata',
    institution:
      'Historic Environment Scotland, National Record of the Historic Environment 1696',
    url: 'https://www.trove.scot/place/1696',
    type: 'catalogue',
    accessed: '2026-10-28',
    scope:
      'Search-indexed Location Details consulted: latitude 59.00140,longitude −3.22977,NGR HY 2945 1335. Direct page open returned 403; no complete archaeology notes or bibliography read. Rounded regional locator only. HES visitor page NGR HY 294134 separately agrees at regional scale. This metadata does not establish Neolithic contemporaneity, a route or a surveyed boundary. No image copied.',
  },
  {
    id: 'orkney-stenness-locator',
    title: 'Stones of Stenness: HES/Trove location metadata',
    institution:
      'Historic Environment Scotland, National Record of the Historic Environment 2105',
    url: 'https://www.trove.scot/place/2105',
    type: 'catalogue',
    accessed: '2026-10-28',
    scope:
      'Search-indexed Location Details consulted for monument record 2105: latitude 58.99415,longitude −3.20828,NGR HY 3067 1252. Direct page open returned 403; no complete archaeology notes or bibliography read. Nearby similarly named record 283778 concerns other remains and is not used. HES visitor page NGR HY 306126 agrees at regional scale. Rounded locator only, not a surveyed boundary or date of construction; no image copied.',
  },
];
const studies: Record<string, PlaceStudy> = {
  'old-kingdom': {
    title: 'Saqqara, Giza and Memphis: different record contexts',
    description:
      'Regional locators distinguish the selected wall’s Saqqara burial context, a UNESCO pyramid-field reference near Giza and the Memphis reference area. The Giza point is not the Heit el-Ghurab bakery’s precise position. No ancient Nile channel, voyage track, settlement plan or political border is drawn.',
    bounds: [31.06, 29.79, 31.34, 30.04],
    points: [
      {
        id: 'saqqara-wall',
        label: 'Saqqara — selected chapel context',
        coordinates: [31.22, 29.87],
        text: 'The inherited approximate dossier locator orients the documented Saqqara burial context. The wall is now in a museum; this is not its modern display position.',
        citations: [
          {
            source: 'met-543914',
            locator: 'Artwork Details: Saqqara,Tomb QS 915',
          },
        ],
      },
      {
        id: 'giza-reference',
        label: 'Giza area — pyramid-field reference',
        coordinates: [31.13, 29.976],
        text: 'Rounded UNESCO serial-component reference coordinate for the pyramid fields. AERA’s support-settlement account concerns the wider Giza area; this marker does not identify one excavated workshop or crew’s home.',
        citations: [
          {
            source: 'pyramid-field-locators',
            locator: 'Component 86-002 geographical coordinate',
          },
          {
            source: 'giza-settlement',
            locator: 'Fourth Dynasty site and provisioning account',
          },
        ],
      },
      {
        id: 'memphis-reference',
        label: 'Memphis — regional administrative setting',
        coordinates: [31.261, 29.855],
        text: 'Rounded UNESCO Site of Memphis reference coordinate. The translated logbook discussion places the work within the wider Memphite region; this is not a recovered office address.',
        citations: [
          {
            source: 'pyramid-field-locators',
            locator: 'Component 86-001 geographical coordinate',
          },
          {
            source: 'merer-logbook',
            locator: 'English annex,printed p. 152: Memphite region',
          },
        ],
      },
    ],
    features: [],
  },
  caral: {
    title: 'Caral and Áspero: valley and coastal records',
    description:
      'Rounded modern WGS84 site locators are derived from the 2023 study’s published coordinates. They distinguish inland Caral from coastal Áspero and the study’s different sample sites. This is a locator diagram: no shoreline, exchange route or political territory is drawn. The source account supplies the inland/coastal distinction.',
    bounds: [-77.8, -10.96, -77.45, -10.75],
    points: [
      {
        id: 'caral-inland',
        label: 'Caral — inland settlement and one study individual',
        coordinates: [-77.522, -10.892],
        text: 'The study locates Caral inland in the Supe Valley. Only one individual in its dental-calculus sample came from Caral; aggregate results are not a household census here.',
        citations: [
          {
            source: 'caral-starch-2023',
            locator: 'Study area; Burial contexts',
          },
        ],
      },
      {
        id: 'aspero-coastal',
        label: 'Áspero — coastal settlement and nine study individuals',
        coordinates: [-77.742, -10.814],
        text: 'The study’s other nine individuals came from Áspero. The 2005 project account describes complementary valley materials and marine foods; neither this map nor the small study measures every person’s diet or exact exchange route.',
        citations: [
          {
            source: 'caral-starch-2023',
            locator: 'Study area; Burial contexts',
          },
          {
            source: 'caral-project-2005',
            locator: 'Printed p.14 / PDF 16: Organización económica',
          },
        ],
      },
    ],
    features: [],
  },
  'skara-brae': {
    title: 'Skara Brae in a wider Orkney landscape',
    description:
      'This regional locator diagram links a domestic settlement inquiry with two distinct ceremonial monuments. The Skara point preserves its inherited approximate locator; monument coordinates are rounded from HES/Trove metadata. No coast, loch outline or travel route is drawn. Proximity does not establish common builders or complete contemporaneity. Maeshowe remains a textual destination rather than an unverified plotted point.',
    bounds: [-3.39, 58.97, -3.16, 59.08],
    points: [
      {
        id: 'skara-houses',
        label: 'Skara Brae — household settlement',
        coordinates: [-3.34, 59.05],
        text: 'The inherited site-area locator orients the southern Bay of Skaill. Coastal erosion and changing settlement phases mean the modern shore is not an exact Neolithic setting.',
        citations: [
          {
            source: 'skara-significance-2024',
            locator: 'Printed pp.15–17 and60: site,landscape and chronology',
          },
        ],
      },
      {
        id: 'brodgar-circle',
        label: 'Ring of Brodgar — a separate monument history',
        coordinates: [-3.23, 59.001],
        text: 'Rounded HES/Trove locator. HES’s detailed Skara account says it is unclear whether the ring was constructed during the village’s lifetime; a regional grouping alone does not settle that question.',
        citations: [
          {
            source: 'orkney-brodgar-locator',
            locator: 'Search-indexed Location Details,NGR HY 2945 1335',
          },
          {
            source: 'skara-significance-2024',
            locator: 'Printed p.60,note 196',
          },
        ],
      },
      {
        id: 'stenness-circle',
        label: 'Stones of Stenness — ceremonial context',
        coordinates: [-3.208, 58.994],
        text: 'Rounded HES/Trove monument locator for record 2105. UNESCO groups it with settlement and funerary sites in the region; that designation does not identify one institution governing every place.',
        citations: [
          {
            source: 'orkney-stenness-locator',
            locator: 'Search-indexed Location Details,NGR HY 3067 1252',
          },
          {
            source: 'orkney-neolithic',
            locator: 'Description; Brief synthesis',
          },
        ],
      },
    ],
    features: [],
  },
};
export function applyHouseholdPlaces(c: Corpus) {
  for (const [id, study] of Object.entries(studies))
    c.subjects.find((s) => s.id === id)!.placeStudy = study;
}
