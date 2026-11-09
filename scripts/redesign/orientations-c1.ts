import type { Corpus, RegionalOrientation, Source } from '../../src/atlas/model';

const ref = (source: string, locator: string) => ({ source, locator });
const sources: Source[] = [
  {
    id: 'orientation-an-son',
    title: 'The An Sơn Excavation of 2009',
    institution: 'ANU Press',
    author: 'Catherine Sarjeant',
    type: 'archaeology',
    accessed: '2026-11-04',
    url: 'https://press-files.anu.edu.au/downloads/press/p302491/html/ch04.xhtml',
    scope:
      'Selected Introduction, Stratigraphy and Chronology paragraphs consulted in HTML. Initial occupation estimate 2500–2200 cal BCE, later occupation and burials kept separate. Ground-level house interpretation and inability to recover precise plans retained. No complete monograph, figures or recalibration reviewed; no images reproduced.',
  },
  {
    id: 'orientation-mohenjodaro',
    title: 'Archaeological Ruins at Moenjodaro',
    institution: 'UNESCO World Heritage Centre',
    type: 'archaeology',
    accessed: '2026-11-04',
    url: 'https://whc.unesco.org/en/list/138/',
    scope:
      'English Brief synthesis and Integrity consulted for brick construction, streets, wells, drainage and the extent of excavation. Traditional identifications as a college of priests or granary, priority rankings and a single political constitution are not adopted. Broad third-millennium orientation, not a synchronized construction plan.',
  },
];

export const c1Orientations: RegionalOrientation[] = [
  {
    id: 'C1-R1',
    chapter: 'C1',
    region: 'Americas',
    title: 'Supe Valley: public buildings and the work of feeding people',
    question:
      'How can buildings and food traces tell different parts of a community’s history?',
    summary: {
      title: 'Coast and valley',
      text: 'Caral’s platforms and circular courts place collective building beside a less visible history of food production. Coastal Áspero offers a second setting in the Supe Valley. Comparing them connects monumental spaces with the plants people used, without assuming that every household had the same diet or role.',
      citations: [
        ref('caral', 'Brief synthesis: platforms and recessed circular courts'),
        ref('caral-starch-2023', 'Abstract: Áspero and Caral samples'),
      ],
    },
    sections: [
      {
        title: 'Provisioning leaves several kinds of evidence',
        text: 'The dental-calculus study recovered plant starches from nine people at Áspero and one at Caral. These traces bring food use into an account otherwise dominated by large buildings. The authors consider exchange as one possible explanation for access to some plants. Starch presence is not a measure of the calories supplied by a crop.',
        citations: [
          ref(
            'caral-starch-2023',
            'Abstract; Discussion: exchange and limits of starch ubiquity',
          ),
        ],
      },
      {
        title: 'Buildings accumulated over time',
        text: 'Caral’s urban plan and ceremonial architecture developed over centuries within the broad 3000–1800 BCE frame. A visitor’s view gathers different building episodes. The arrangement supports questions about organized work, but cannot by itself tell us who assigned tasks, whether people volunteered, or how work varied between households.',
        citations: [
          ref('caral', 'Brief synthesis, criterion (ii), Integrity and Authenticity'),
        ],
      },
    ],
    perspectives:
      'Builders and food producers left material traces, not a complete set of personal accounts. A small sample of human remains cannot speak for all valley residents.',
    scope:
      'A coastal–inland comparison within the Supe Valley, not an account of every American community. Burial samples and building phases have their own dates within the wider site frame.',
    contextIds: ['caral-community-context'],
    subjectIds: ['caral'],
    activity: {
      prompt:
        'Use the account above to choose evidence for two questions: what plants some people consumed, and how public gathering spaces were arranged. What could neither source tell you?',
      response:
        'Starches address plant use; platforms and courts address spatial arrangement. Neither supplies every household’s diet or a named worker’s explanation of their obligations. Explain the mismatch rather than treating the two sources as interchangeable.',
    },
    snapshots: [
      {
        orientation: 'C1-R1',
        region: 'Americas',
        year: -2400,
        text: 'Around 2400 BCE lies within Caral’s broadly dated development. Platforms and circular gathering spaces orient us to the Supe Valley’s built landscape. They do not establish the same layout or activity in every year; the linked coastal food study has separately dated burial contexts.',
        citations: [
          ref('caral', 'Integrity and Authenticity: 3000–1800 BCE; criterion (ii)'),
        ],
      },
    ],
  },
  {
    id: 'C1-R2',
    chapter: 'C1',
    region: 'Africa',
    title: 'Nile communities: building, supply and different centres of power',
    question: 'What had to happen around a monument to keep people working?',
    summary: {
      title: 'Giza, Saqqara and Kerma',
      text: 'Royal monuments depended on food, tools, storage and skilled labor. Giza’s excavated settlement exposes some of that supporting work; Saqqara’s chapel wall presents elite commemoration. Farther south, Kerma developed as a distinct Nubian centre. These places belong to connected Nile histories, not one undifferentiated Egyptian society.',
      citations: [
        ref('giza-settlement', 'Fourth Dynasty settlement and support staff'),
        ref('met-543914', 'Description and Geography'),
        ref('kerma-city-project', 'City of Kerma: foundation'),
      ],
    },
    sections: [
      {
        title: 'Supply was part of construction',
        text: 'AERA identifies bakeries, kitchens, workshops and storage at Giza. Grain held in royal silos could be distributed for bread and beer; raw materials also arrived for tools and furnishings. This explains a chain of provisioning behind construction. It does not identify every worker’s legal status or make one crew representative of all labor in Egypt.',
        citations: [
          ref(
            'giza-settlement',
            'Settlement account: support staff, materials and grain silos',
          ),
        ],
      },
      {
        title: 'Changing places, separate dates',
        text: 'The selected Saqqara wall dates to about 2465–2389 BCE, later than much Fourth Dynasty pyramid building. Kerma’s project dates its city’s foundation around 2500 BCE, while warning that continuity from the earlier Pre-Kerma settlement is unproved. Neither the wall nor a later Kerma beaker dates the beginning of an entire society.',
        citations: [
          ref('met-543914', 'Artwork Details: Date'),
          ref('old-kingdom', 'Dynasties 4–5'),
          ref(
            'kerma-city-project',
            'City of Kerma: foundation and uncertain continuity',
          ),
        ],
      },
    ],
    perspectives:
      'Excavated work spaces and an elite tomb image answer different questions. The surviving records do not give equal access to administrators, cooks, craftspeople and their families.',
    scope:
      'Selected Egyptian and Nubian settings in the later third millennium BCE. Kerma’s later urban layout and the beaker’s second-millennium date are not projected back to 2400 BCE.',
    contextIds: ['old-kingdom-work-context', 'kerma-city-context'],
    subjectIds: ['old-kingdom', 'kerma-potters'],
    activity: {
      prompt:
        'Explain one link between grain storage and monument building. Then name a question about the workers that a grain silo cannot settle.',
      response:
        'Storage could support regular food preparation for a workforce. That material connection does not reveal a particular worker’s motives, freedom, household circumstances or membership in a named crew.',
    },
    snapshots: [
      {
        orientation: 'C1-R2',
        region: 'Africa',
        year: -2400,
        text: 'Around 2400 BCE falls within the selected Saqqara wall’s museum date range and after Kerma’s approximate foundation. The chapel is evidence of elite funerary representation; Kerma offers a distinct Nubian urban history. The later beaker is a next reading, not an object from this same moment.',
        citations: [
          ref('met-543914', 'Date: c2465–2389 BCE'),
          ref('kerma-city-project', 'City of Kerma: c2500 BCE foundation'),
        ],
      },
    ],
  },
  {
    id: 'C1-R3',
    chapter: 'C1',
    region: 'Europe',
    title: 'Orkney: homes, gathering places and a landscape beyond one village',
    question: 'Why does the end of a settlement not end the history of its landscape?',
    summary: {
      title: 'More than the standing houses',
      text: 'Skara Brae’s stone rooms and connected passages reveal domestic arrangements. Maeshowe, the Stones of Stenness and the Ring of Brodgar provide different kinds of built spaces in Orkney. Reading homes alongside burial and ceremonial monuments expands the inquiry beyond one village, while keeping each site’s chronology separate.',
      citations: [
        ref('skara-houses', 'Village houses and furniture'),
        ref('orkney-neolithic', 'Description and Brief synthesis'),
      ],
    },
    sections: [
      {
        title: 'Construction connects household and communal work',
        text: 'The village’s fitted stone furnishings organize cooking, storage and sleeping within compact rooms. Larger tombs and stone circles required different construction tasks. Comparing these remains helps us distinguish domestic from communal settings; the surviving stones do not recover every ceremony or the identity of those who directed the work.',
        citations: [
          ref('skara-houses', 'Village houses and furniture'),
          ref('orkney-neolithic', 'Brief synthesis: monument types'),
        ],
      },
      {
        title: 'A later landscape is not a longer village occupation',
        text: 'UNESCO describes an Orkney cultural-landscape tradition around 3000–2000 BCE. That broader range continues after the selected Skara Brae occupation. Some standing stones were re-erected in modern times. Today’s view therefore combines prehistoric construction, losses and conservation rather than presenting one unchanged Neolithic moment.',
        citations: [ref('orkney-neolithic', 'Criterion (iii); Authenticity')],
      },
    ],
    perspectives:
      'Architecture reveals possible activities more readily than people’s names or beliefs. A ceremonial interpretation is not a recovered script for the event.',
    scope:
      'Orkney is a justified local focus: unusually varied surviving domestic and monumental evidence makes comparison possible. It does not represent every European farming community.',
    contextIds: ['skara-households-context'],
    subjectIds: ['skara-brae'],
    activity: {
      prompt:
        'Separate three statements: a stone bed survives; people probably slept there; we know who slept there. Which is observation, which is interpretation, and which needs evidence not supplied?',
      response:
        'The bed’s form is material evidence; sleeping is a functional interpretation. A named occupant needs further evidence. Apply the same distinction when interpreting a stone circle.',
    },
    snapshots: [
      {
        orientation: 'C1-R3',
        region: 'Europe',
        year: -2400,
        text: 'The 2400 BCE view uses Orkney’s broader 3000–2000 BCE monumental-landscape frame. It does not extend Skara Brae’s village occupation to this date. Read the earlier houses alongside burial and ceremonial monuments, whose individual construction histories remain separate.',
        citations: [
          ref('orkney-neolithic', 'Criterion (iii): cultural tradition c3000–2000 BCE'),
          ref(
            'skara-significance-2024',
            'Printed p17: modeled village ending 2545–2440 cal BCE',
          ),
        ],
      },
    ],
  },
  {
    id: 'C1-R4',
    chapter: 'C1',
    region: 'West/Central Asia',
    title: 'Southern Mesopotamia: institutions, work and durable accounts',
    question: 'How did counting goods become part of organizing a city?',
    summary: {
      title: 'Uruk and its surrounding settlements',
      text: 'Uruk grew within a landscape of rivers, farming and neighboring settlements. Large institutions handled goods and workers’ rations. Recording quantities on clay made some transactions durable, leaving an unusually visible administrative history alongside buildings and crafted objects.',
      citations: [
        ref('uruk', 'Opening urban account and pictographs'),
        ref('writing', 'Settlement expansion and institutional accounting'),
      ],
    },
    sections: [
      {
        title: 'An account serves a practical task',
        text: 'The museum’s writing essay connects early tablets with the recording and distribution of resources. Grain, fish and animals could be counted with signs, while names and actions were harder to interpret. This supports an explanation of record keeping as institutional work; it does not make every tablet a complete narrative of a transaction.',
        citations: [
          ref('writing', 'Accounting; signs for rations and interpretive limits'),
        ],
      },
      {
        title: 'Political forms changed while cities continued',
        text: 'The Uruk account distinguishes late-fourth-millennium growth from the later Early Dynastic city-states, conventionally about 2900–2350 BCE. It describes rulers seeking imported luxury goods through trade or conquest. A tablet dated about 3100–2900 BCE therefore cannot name the rulers or record all political relations of the 2400 BCE world.',
        citations: [
          ref('uruk', 'Early Dynastic paragraph'),
          ref('met-327384', 'Artwork Details: Date'),
        ],
      },
    ],
    perspectives:
      'Administrative records privilege what institutions counted. They are thinner evidence for unrecorded household labor and for people’s own explanations of their lives.',
    scope:
      'A local urban–hinterland focus explains accounting through related settlement and institutional evidence. It is not a claim that writing arose once, or that all West and Central Asia followed Uruk’s sequence.',
    contextIds: ['uruk-urban-context'],
    subjectIds: ['uruk-accounts'],
    activity: {
      prompt:
        'A tablet counts grain but gives no clear action word. Give one defensible conclusion and one conclusion that would need more evidence.',
      response:
        'It records a quantity associated with grain. Whether that quantity was received, owed or issued may remain uncertain; a particular worker’s biography is still farther beyond the account.',
    },
    snapshots: [
      {
        orientation: 'C1-R4',
        region: 'West/Central Asia',
        year: -2400,
        text: 'Around 2400 BCE sits within the museum’s Early Dynastic city-state frame. Uruk continued after the earlier spread of its material culture. The selected grain tablet is older: use it to investigate accounting practices, not as a direct record of this selected year.',
        citations: [
          ref('uruk', 'Early Dynastic period, 2900–2350 BCE'),
          ref('met-327384', 'Date'),
        ],
      },
    ],
  },
  {
    id: 'C1-R5',
    chapter: 'C1',
    region: 'South Asia',
    title: 'Indus settlements: managing water in different places',
    question: 'How did water problems shape the work of building a city?',
    summary: {
      title: 'Dholavira and Mohenjo-daro',
      text: 'Dholavira stood on arid Khadir Island, where seasonal streams and storage mattered. Mohenjo-daro developed beside the Indus, with brick streets, wells and drainage. Their surviving structures let us compare ways of organizing water and inhabited space without assuming identical environments or government.',
      citations: [
        ref('dholavira', 'Description: seasonal streams and water management'),
        ref('orientation-mohenjodaro', 'Brief synthesis: location, wells and drainage'),
      ],
    },
    sections: [
      {
        title: 'Storage and drainage answer different needs',
        text: 'At Dholavira, capturing scarce seasonal water was part of the city’s infrastructure. At Mohenjo-daro, wells and drains formed part of its built layout. Keeping water available and moving unwanted water away are distinct practical tasks. Their remains invite questions about construction and maintenance, but do not identify one ruler who controlled every system.',
        citations: [
          ref('dholavira', 'Description and Brief synthesis'),
          ref('orientation-mohenjodaro', 'Brief synthesis: sanitation and drainage'),
        ],
      },
      {
        title: 'A plan gathers several histories',
        text: 'Dholavira’s long occupation and the selected seal’s narrower date range should not be merged. Nor does the regional seal’s collection attribution make it a Dholavira excavation find. Mohenjo-daro’s later Buddhist stupa is a separate addition to the ancient city landscape; it belongs to a different period from the third-millennium urban remains.',
        citations: [
          ref('dholavira', 'Description: c3000–1500 BCE'),
          ref('met-324062', 'Date and Geography'),
          ref(
            'orientation-mohenjodaro',
            'Brief synthesis: second-century CE Buddhist stupa',
          ),
        ],
      },
    ],
    perspectives:
      'Buildings and workshop remains expose practical activities. Without a fully deciphered script, they do not supply every resident’s account of authority, rights or maintenance duties.',
    scope:
      'Two named settlements in different parts of the Indus world. Modern composite plans are not photographs of one simultaneous city layout, and regional object dates are not local construction dates.',
    contextIds: ['dholavira-urban-context'],
    subjectIds: ['dholavira'],
    activity: {
      prompt:
        'Explain why a reservoir and a drain might both belong in a city. What extra evidence would you need to name the people responsible for maintaining them?',
      response:
        'Storage retains water for use; drainage carries water away. Their presence supports different infrastructure needs. Administrative records or securely contextualized evidence of labor would be needed to identify particular maintenance arrangements.',
    },
    snapshots: [
      {
        orientation: 'C1-R5',
        region: 'South Asia',
        year: -2400,
        text: 'Around 2400 BCE falls within the broad third-millennium Indus urban setting. Compare water management at Dholavira with wells and drainage at Mohenjo-daro. The view marks a regional comparison, not a claim that every visible structure at either site was operating in that exact year.',
        citations: [
          ref('dholavira', 'Description and site chronology'),
          ref(
            'orientation-mohenjodaro',
            'Brief synthesis: third-millennium settlement and urban systems',
          ),
        ],
      },
    ],
  },
  {
    id: 'C1-R6',
    chapter: 'C1',
    region: 'East Asia',
    title: 'Lower Yangtze: cultivated land, waterworks and unequal burials',
    question: 'How do landscapes and objects reveal different kinds of organization?',
    summary: {
      title: 'Liangzhu and its surrounding landscape',
      text: 'Liangzhu’s city, peripheral waterworks and cemeteries belong to a lower-Yangtze landscape supported by rice cultivation. The city site and Yaoshan burial area offer different evidence: built spaces show organized investment, while differences between graves support interpretations of social distinction.',
      citations: [
        ref('liangzhu', 'Description; Brief synthesis: four component areas'),
      ],
    },
    sections: [
      {
        title: 'Infrastructure and social interpretation',
        text: 'Water-control works connect cultivated land with the settlement’s surroundings. UNESCO interprets the city layout and differentiated burials as evidence of a regional state. That is an archaeological interpretation of surviving patterns, not a contemporary constitution or a recovered list of everyone’s duties.',
        citations: [ref('liangzhu', 'Brief synthesis and criteria (iii)–(iv)')],
      },
      {
        title: 'A jade has its own chronology and limits',
        text: 'The selected cong is dated around 2400 BCE. Its wider museum culture label extends beyond the city’s approximately 3300–2300 BCE frame. The catalogue treats the object’s exact function and meaning as uncertain; wealth and status are proposed associations. It cannot identify every belief or the experiences of people outside richly furnished graves.',
        citations: [
          ref('met-72376', 'Description; Date and Period'),
          ref('liangzhu', 'Authenticity: city-site range'),
        ],
      },
    ],
    perspectives:
      'Elaborate objects and differentiated graves make some social distinctions visible. They do not provide equal testimony from farmers, waterworks laborers and those buried with fewer goods.',
    scope:
      'A justified local focus compares city, waterworks and burial evidence within one documented landscape. Other East Asian settings require their own histories; this is not a universal sequence from farming to statehood.',
    contextIds: ['liangzhu-landscape-context'],
    subjectIds: ['liangzhu'],
    activity: {
      prompt:
        'Which question is better answered by a dam system, and which by a burial object: how water was managed, or how objects marked distinctions among the dead? Name a limit of each.',
      response:
        'Dams address water management but do not name every laborer. Burial objects address funerary distinctions but do not reconstruct every living person’s beliefs. Neither alone is a complete social history.',
    },
    snapshots: [
      {
        orientation: 'C1-R6',
        region: 'East Asia',
        year: -2400,
        text: 'Around 2400 BCE lies within Liangzhu’s city-site frame and matches the approximate date assigned to the selected jade. Those overlapping dates make comparison possible; they do not establish that this museum object came from the city excavation or that every waterwork was built at this moment.',
        citations: [
          ref('liangzhu', 'Authenticity: c3300–2300 BCE'),
          ref('met-72376', 'Date and catalogue attribution'),
        ],
      },
    ],
  },
  {
    id: 'C1-R7',
    chapter: 'C1',
    region: 'Southeast Asia/Oceania',
    title: 'Kuk and An Sơn: reading work in buried landscapes',
    question:
      'How can ditches, floors and dated deposits reveal different settlement histories?',
    summary: {
      title: 'Kuk in the upper Wahgi Valley',
      text: 'At Kuk, connected ditches and larger channels redirected water at a wetland margin. Archaeologists interpret this as deliberate preparation for cultivation. This highland setting offers a food-production history whose evidence is different from a city plan, a written account or the later Lapita pottery of island settlements.',
      citations: [
        ref(
          'completion-kuk-ditches',
          'Summary of palaeochannels and ditch articulation; drainage for cultivation',
        ),
        ref('lapita', 'Chronology and geographic setting'),
      ],
    },
    sections: [
      {
        title: 'A mainland comparison with its own sequence',
        text: 'At An Sơn in southern Vietnam, the excavators estimate initial occupation around 2500–2200 calibrated BCE. Much of the excavated occupation is later, and the burials later still. Alternating floors and occupation layers suggest houses at ground level, but precise house plans could not be reconstructed. These remains offer a mainland comparison with Kuk; they do not establish migration between the two places.',
        citations: [
          ref(
            'orientation-an-son',
            'Introduction: 1997 floors and house interpretation; Chronology: initial and later occupation',
          ),
        ],
      },
      {
        title: 'A network is more than a single cut',
        text: 'The investigators describe larger channels receiving water from smaller ditches. Some networks contain right-angled junctions and divisions; others branch differently. Connected cuts make planned drainage a stronger interpretation than an isolated depression would. Shallow cultivation features survive less clearly, so the network does not identify every crop or plot boundary.',
        citations: [
          ref(
            'completion-kuk-ditches',
            'Earliest ditch networks; Summary; early network 353',
          ),
        ],
      },
      {
        title: 'Dating a sequence does not fill every year',
        text: 'The introduction’s table gives the early Phase 3 range as 4350–3980 calibrated years before 1950, approximately 2400–2030 BCE. Other ditch episodes belong later. The authors lack the precision to date every use of each location. A gap in the dated record cannot simply be filled with an invented uninterrupted sequence.',
        citations: [
          ref('completion-kuk-sequence', 'Calibration convention and Table 1.2'),
          ref(
            'completion-kuk-ditches',
            'Subphases: spatial variation and insufficient archaeological precision',
          ),
        ],
      },
    ],
    perspectives:
      'Earthworks preserve traces of planning and repeated work. They do not name the cultivators or establish their land rights. Modern communities are not represented by archaeological interpretation alone.',
    scope:
      'Two separate settings: the New Guinea highlands and a southern Vietnamese mound. Their overlapping broad dates are not a route or shared political history. Lapita is a later reading destination, not evidence of a 2400 BCE island migration.',
    contextIds: ['kuk-wetland-context'],
    subjectIds: ['lapita'],
    activity: {
      prompt:
        'Explain why linked channels support a drainage interpretation. Then distinguish the approximate date range from a claim that every plot was cultivated every year.',
      response:
        'Smaller ditches joining larger channels provide a route for water to leave the margin. Dated fills and stratigraphy place episodes in broad ranges; they do not establish continuous annual use of every field.',
    },
    snapshots: [
      {
        orientation: 'C1-R7',
        region: 'Southeast Asia/Oceania',
        year: -2400,
        text: 'Around 2400 BCE is near Kuk’s rounded early Phase 3 boundary and within An Sơn’s estimated initial-occupation range. These are independent archaeological chronologies, not exact events in the selected year. An Sơn’s later houses and burials cannot all be assigned to its beginning. Lapita remains a later comparison.',
        citations: [
          ref('completion-kuk-sequence', 'Table 1.2: 4350–3980 cal BP; 1950 baseline'),
          ref('orientation-an-son', 'Chronology: initial occupation 2500–2200 cal BCE'),
        ],
      },
    ],
  },
];

export function applyC1Orientations(corpus: Corpus) {
  corpus.sources.push(...structuredClone(sources));
  (corpus.orientations ??= []).push(...structuredClone(c1Orientations));
}
