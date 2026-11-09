import type { Source, Subject, HistoricalContext } from '../../src/atlas/model';
import { cite } from './content-helpers';
export const skaraSources: Source[] = [
  {
    id: 'skara-significance-2024',
    title: 'Skara Brae: Statement of Significance',
    institution: 'Historic Environment Scotland',
    url: 'https://app-hes-pubs-prod-neu-01.azurewebsites.net/api/file/703982e8-be07-4f7a-9265-b11e0121c461',
    type: 'archaeology',
    published: '2024',
    accessed: '2026-10-28',
    scope:
      'Selected text in 89-page PDF: printed pp. 15–17 (PDF 17–19), pp. 60–62 (PDF 62–64), pp. 67–69 (PDF 69–71), plus copyright on PDF 2. Pixels inspected on PDF 2/17/19/70, including the 1879 Dryden drawing after Petrie’s earlier plan, with its explicit courtesy/permission caption. Occupation boundaries, early crop phase, changing passages, modern House 1 rebuilding and source-specific monument chronology retained. Not the full bibliography, all excavation reports or every figure reviewed. Information is OGL v3 except images/logos/third-party material. No source plan/photo traced or reproduced; original feature guide is nonmeasured.',
  },
  {
    id: 'skara-crops-2022',
    title:
      'Scotland’s first farmers: new insights into early farming practices in North-west Europe',
    institution: 'Antiquity 96(389),1087–1104; Cambridge University Press',
    author: 'Rosie R. Bishop and colleagues',
    url: 'https://www.cambridge.org/core/journals/antiquity/article/scotlands-first-farmers-new-insights-into-early-farming-practices-in-northwest-europe/7C027B8A129F68533E558FAB47B63027',
    type: 'scholarship',
    published: '14 September 2022',
    accessed: '2026-10-28',
    scope:
      'Publisher HTML abstract, introductory method overview and Skara Brae/Braes of Ha’Breck section read; metadata/licence checked. Skara’s small cereal assemblage and low/moderate-manuring interpretation concern underlying Phase 0, before main surviving houses. The article’s c. 3360–3160 cal BCE label is kept separate from a full phase duration; HES’s detailed statement treats these as possible beginning-boundary dates. Earlier evidence is identified explicitly, not a new pre-3300 BCE atlas dossier. The article’s main-house phase ranges differ slightly from the HES 2024 reference ranges; they are not silently merged. Ha’Breck’s very large burned grain deposit and extreme isotope values are not assigned to Skara. Supplement, individual table rows and figure pixels not independently inspected. No precise sample/outcome values or figure copied. CC BY 4.0 article.',
  },
  {
    id: 'orkney-neolithic',
    title: 'Heart of Neolithic Orkney',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/514/',
    type: 'archaeology',
    accessed: '2026-10-28',
    scope:
      'Description and Brief synthesis consulted for regional grouping of Skara Brae, Maeshowe, Stenness and Brodgar. A heritage grouping does not establish a single governing institution, identical builders or complete contemporaneity. HES detailed statement separately qualifies Brodgar’s possible overlap with Skara Brae. No source image/plan reproduced; general page licence is not assumed to cover every photograph.',
  },
];
export const skaraContext: HistoricalContext = {
  id: 'skara-households-context',
  title: 'Skara Brae: households and a changing landscape',
  region: 'Europe',
  interval: {
    start: -3300,
    end: -2440,
    label: '3300–2440 BCE: selected archaeological orientation',
    precision: 'disputed',
    note: 'The left edge is the atlas’s display boundary, not a foundation date. The modeled beginning of earlier activity, within 3360–3160 cal BCE, can precede it. Occupation was interrupted; modeled final boundary 2545–2440 cal BCE is not one exact end year. The original case remains c. 3180–2500 BCE with its full conflict note.',
  },
  summary:
    'Standing houses gather several Neolithic phases and modern conservation changes. Earlier cereal evidence, changing passages and nearby monuments require their own contexts.',
  subjectIds: ['skara-brae'],
  citations: [
    {
      source: 'skara-significance-2024',
      locator: 'Printed pp. 15–17,60–62 and67–69',
    },
    {
      source: 'skara-crops-2022',
      locator: 'Skara Brae and the Braes of Ha’Breck',
    },
  ],
  phases: [
    {
      year: -3300,
      label: 'Modeled beginning within 3360–3160 cal BCE; display edge 3300 BCE',
      title: 'Evidence beneath the surviving houses',
      text: 'Phase 0 cereal material precedes the main standing settlement. The 3300 marker is an atlas display boundary within a source uncertainty range, not a dated founding event.',
      citations: [
        {
          source: 'skara-crops-2022',
          locator: 'Skara Brae and the Braes of Ha’Breck: underlying Phase 0',
        },
        {
          source: 'skara-significance-2024',
          locator: 'Printed p. 17',
        },
      ],
    },
    {
      year: -2920,
      label: 'Modeled beginning boundary 2920–2885 cal BCE',
      title: 'Earliest surviving house phase begins',
      text: 'HES reports a range for the beginning of the earliest houses that survive today. It is not the complete duration of a house or a precise year for every wall.',
      citations: [
        {
          source: 'skara-significance-2024',
          locator: 'Printed p. 17',
        },
      ],
    },
    {
      year: -2870,
      label: 'Apparent interruption associated with 2870–2760 cal BCE',
      title: 'A discontinuous sequence',
      text: 'The report identifies an apparent interruption, possibly associated with sand. Boundary uncertainties overlap; they are not exact nonoverlapping reign-like periods.',
      citations: [
        {
          source: 'skara-significance-2024',
          locator: 'Printed p. 17',
        },
      ],
    },
    {
      year: -2840,
      label: 'Renewed occupation modeled within 2840–2685 cal BCE',
      title: 'New houses and remodeling',
      text: 'New structures and altered older houses form a later phase. Passages also changed over time; some acquired roof slabs during occupation rather than belonging to one original complete plan.',
      citations: [
        {
          source: 'skara-significance-2024',
          locator: 'Printed pp. 17 and61–62',
        },
      ],
    },
    {
      year: -2545,
      label: 'Modeled ending boundary 2545–2440 cal BCE',
      title: 'Later village use ends, later activity remains',
      text: 'This modeled boundary spans the retained case’s approximate 2500 BCE endpoint. Later traces and modern excavation are separate histories; no single sudden disaster is established here.',
      citations: [
        {
          source: 'skara-significance-2024',
          locator: 'Printed p. 17',
        },
      ],
    },
  ],
};
export function applySkara(s: Subject) {
  s.summary =
    'Stone furnishings make household tasks visible at Skara Brae. A home needed heat, storage, food and continuing maintenance, while its links with neighboring houses changed. The surviving interiors bring together several ancient phases and modern repair; they are not a single untouched moment.';
  s.sections = [
    {
      title: 'A home needed places for different tasks',
      text: 'Skara Brae brings household space into view through stone. A central hearth, slab-built enclosures and a shelved structure conventionally called a dresser organize the surviving interiors. These features invite practical questions: where could heat be supplied, belongings kept and people accommodated? The names help us begin, while their particular uses need interpretation. A stone frame survives differently from the bedding, fuel, food and other materials that people brought into a home.',
      citations: [
        {
          source: 'skara-houses',
          locator: 'Village houses and furniture',
        },
      ],
    },
    {
      title: 'Building made a settlement, not just separate rooms',
      text: 'The houses used flat slabs and stood within accumulated midden material. Their occupants worked within a built environment that changed through occupation. Moving between houses also required passages and entrances. These connections were not simply one complete plan laid down at the beginning: gaps developed into passages, and roofing was added during occupation. Maintaining a home therefore involved relationships with adjacent buildings as well as work inside its walls.',
      citations: [
        {
          source: 'skara-houses',
          locator: 'Village houses and furniture: slabs and midden',
        },
        {
          source: 'skara-significance-2024',
          locator: 'Printed pp. 17 and61–62: house sequence and changing passages',
        },
        {
          source: 'skara-significance-2024',
          locator: 'Printed pp. 61–62: development of passages and roofing',
        },
      ],
    },
    {
      title: 'Food required work beyond the house',
      text: 'Cereal remains also open an inquiry into cultivation, harvesting and processing. The sampled grains in the recent crop study belong to an underlying early phase, before the principal surviving houses. They cannot simply become the contents of every later household’s store. HES also describes farming, hunting and fishing within village life. Reading these different records together connects domestic space with work in the surrounding landscape, without pretending that one sample supplies a complete menu.',
      citations: [
        {
          source: 'skara-crops-2022',
          locator: "Skara Brae and the Braes of Ha'Breck: underlying Phase 0 sample",
        },
        {
          source: 'skara-houses',
          locator: "Inhabitants' activities and artefacts",
        },
      ],
    },
    {
      title: 'Rebuilding changed the available space',
      text: 'Earlier and later houses belong to a sequence of building and rebuilding. The detailed archaeological chronology also identifies an apparent interruption and renewed occupation. A visitor’s single view gathers remains from that history; it cannot show every phase simultaneously. Ask which walls and connections belonged together before imagining a household’s route through them. Changes in access could alter how people moved materials and shared space, even when familiar stone furnishings continued to be used.',
      citations: [
        {
          source: 'skara-significance-2024',
          locator: 'Printed pp. 17 and61–62: house sequence and changing passages',
        },
        {
          source: 'skara-significance-2024',
          locator: 'Printed p. 17: modeled occupation sequence',
        },
      ],
    },
    {
      title: 'The wider landscape has its own histories',
      text: 'Skara Brae belongs within Orkney’s wider Neolithic landscape, alongside places such as Maeshowe and the standing stones at Stenness and Brodgar. These monuments make different activities visible from the rooms of a house. Their individual dates matter: regional proximity does not establish identical builders or full contemporaneity. The coast changed too. The present shore should orient a visitor today, rather than serve as an exact drawing of the environment experienced during village occupation.',
      citations: [
        {
          source: 'orkney-neolithic',
          locator: 'Description and Brief synthesis',
        },
        {
          source: 'skara-significance-2024',
          locator:
            'Printed pp. 15 and 60–62: location, changing landscape and monument chronologies',
        },
      ],
    },
  ];
  s.deeperReading = [
    {
      title: 'The visible interior also has a modern history',
      text: 'HES’s detailed statement documents nineteenth-century changes to House 1, including omitted cells and an introduced window. Some furnishings may also have been rearranged. Those observations change how an apparently complete stone interior should be read. Ask which details are excavated fabric, which record later repair, and which arrangement helps a visitor understand the house today. The goal is a better account of the object being examined: an archaeological structure with a history of investigation and presentation, rather than an untouched room awaiting its occupants’ return.',
      citations: [
        {
          source: 'skara-significance-2024',
          locator:
            'Printed pp. 67–69 / PDF pp. 69–71: House 1 rebuilding and furnishings',
        },
      ],
    },
    {
      title: 'Keep the early crop sample in its own phase',
      text: 'Bishop and colleagues identify mainly naked barley, with some emmer and hulled barley, in the sampled early material. Their isotope interpretation concerns cultivation conditions, including low or moderate manuring. It does not identify every household’s fields. The sample predates the main visible houses, while later assemblages preserve different material. Compare its context with the question being asked. The Braes of Ha’Breck provides another important comparison, but that site’s large burned store cannot become evidence for communal storage at Skara Brae.',
      citations: [
        {
          source: 'skara-crops-2022',
          locator: "Skara Brae and the Braes of Ha'Breck; introduction/method overview",
        },
      ],
    },
    {
      title: 'Compare places without merging their communities',
      text: 'A regional heritage grouping helps place domestic buildings, a chambered tomb and stone circles within one landscape. It does not recover one institution governing all those places. Comparing them can instead ask how space organized movement, gathering and access, and which evidence supports each interpretation. Keep the village’s sequence beside each monument’s chronology. Shared regional context is useful precisely because it allows different kinds of activity to be investigated together while preserving their separate dates and records.',
      citations: [
        {
          source: 'orkney-neolithic',
          locator: 'Description and Brief synthesis; constituent sites',
        },
      ],
    },
  ];

  s.contextIds = ['skara-households-context'];
  s.objectIds = [...s.objectIds, 'skara-household-guide'];
  s.evidenceReading = {
    title: 'A phase, an object name and a modern arrangement',
    introduction:
      'These editorial paraphrases keep different kinds of archaeological interpretation separate. The linked records retain their own dates and limits.',
    items: [
      {
        label: 'Earlier crops, later visible houses',
        text: 'The sampled cereals came from underlying Phase 0, before the main surviving houses. HES models the beginning of earlier occupation within 3360–3160 cal BCE: an uncertain boundary, not that phase’s duration. Some early evidence precedes this atlas’s 3300 BCE display edge.',
        interpretation:
          'A small early crop sample supports a cultivation inquiry. It does not supply every later household’s menu or extend this atlas into a new prehistoric dossier.',
        citations: [
          cite(
            'skara-crops-2022',
            'Skara Brae and the Braes of Ha’Breck: Phase 0 context',
          ),
          cite('skara-significance-2024', 'Printed p. 17: modeled beginning boundary'),
        ],
      },
      {
        label: 'A tool name can contain a hypothesis',
        text: 'The notched sandstone object X.HA.668 has a proposed identification as a hand-held rake; the catalogue leaves its function uncertain.',
        interpretation:
          'Use the proposal to ask about wear, context and comparable objects. Resemblance does not establish one confirmed use, and no tool image is supplied here.',
        citations: [
          cite('skara-tool', 'Current Trove Summary and Further details; function'),
        ],
      },
      {
        label: 'A room’s modern history matters',
        text: 'HES documents nineteenth-century rebuilding of House 1, omitted cells and a modern window. Some furnishings may have been rearranged.',
        interpretation:
          'The feature guide identifies relationships from the text. It is not a measured plan, a tracing of the protected figures or a complete reconstruction of an untouched ancient interior.',
        citations: [cite('skara-significance-2024', 'Printed pp. 67–69 / PDF 69–71')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Bring fuel to the hearth',
    duration: '10–15 minutes',
    steps: [
      'Find the entrance and hearth on the modern feature guide. An adult can read the labels aloud.',
      'Trace an imagined trip carrying fuel. Point, talk or draw; name a feature that could affect your movement.',
      'Explain what evidence would help test how people actually used the room. Keep its modern rebuilding in mind.',
    ],
    explanation:
      'A practical task helps explore space. The guide does not identify an actual resident, gendered work role, roof, exact route or complete ancient arrangement.',
  };
  s.dimensions.maintenance = {
    text: 'Household work and changes to entrances, passages and interiors sustained a settlement through rebuilding. Ancient use, archaeological inference and modern restoration remain distinct.',
    citations: [cite('skara-significance-2024', 'Printed pp. 17,61–62 and67–69')],
  };
  s.review = {
    consultedOn: '2026-10-28',
    reviewer:
      'Codex source consultation and self-review; not independent historian approval',
    scope:
      'Bounded household/landscape account, earlier crop interpretation, phase-qualified reference, family inquiry and original feature guide. Entire existing case interval preserved.',
    limitations: [
      'The source’s modeled boundary ranges are uncertainties, not exact dates or the duration of every phase; no continuous occupation claimed.',
      'Earlier Phase 0 cereal evidence partly precedes the atlas display window and is distinct from the main surviving houses. Ha’Breck results are not transferred to Skara.',
      'HES’s detailed statement qualifies the brief covered-passage/workshop account. Brodgar’s overlap with village use is uncertain.',
      'An independently drawn nonmeasured guide is narrower than the registry’s verified annotated site-plan task; protected source figures are not reproduced.',
      'The current tool-page redirect displays different numeric Date made values from the retained earlier convention; no reconciliation or case-date change is inferred.',
      'No independent historian, real family/adult, screen-reader/device or physical print acceptance is claimed.',
    ],
  };
}
