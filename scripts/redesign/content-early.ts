import { cite, claim, interval, metEssay, sec, subject } from './content-helpers';
import type { Source, Subject, Journey } from '../../src/atlas/model';
export const earlySources: Source[] = [
  metEssay(
    'uruk',
    'Uruk: The First City',
    'uruk-the-first-city',
    'Urban growth, management of goods and labor; superlative title is not adopted as a universal ranking.',
    'Department of Ancient Near Eastern Art',
    '2003-10',
  ),
  metEssay(
    'writing',
    'The Origins of Writing',
    'the-origins-of-writing',
    'Accounting, materials and qualified alternatives about early writing.',
    'Ira Spar',
    '2004-10',
  ),
  metEssay(
    'old-kingdom',
    'Egypt in the Old Kingdom (ca. 2649–2130 B.C.)',
    'egypt-in-the-old-kingdom-ca-2649-2150-b-c',
    '2019 essay title and introduction; funerary evidence, social change and daily-life scenes. Slug endpoint is older than displayed title.',
    'Tara Prakash',
    '2019-02',
  ),
  {
    id: 'dholavira',
    title: 'Dholavira: a Harappan City',
    institution:
      'UNESCO World Heritage Centre; Archaeological Survey of India nomination',
    url: 'https://whc.unesco.org/en/list/1645/',
    type: 'archaeology',
    accessed: '2026-10-26',
    scope:
      'Description and Brief synthesis: c3000–1500 BCE occupation, reservoirs, different residential areas, craft work and exchange.',
  },
  {
    id: 'caral',
    title: 'Sacred City of Caral-Supe',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/1269/',
    type: 'archaeology',
    accessed: '2026-10-26',
    scope:
      'Brief synthesis and Integrity/Authenticity: architecture and radiocarbon-based 3000–1800 BCE development range. Superlatives and quipu priority are not adopted.',
  },
  {
    id: 'caral-peru',
    title: 'Ciudad Sagrada de Caral',
    institution: 'Zona Arqueológica Caral, Gobierno del Perú',
    url: 'https://www.gob.pe/10734-ciudad-sagrada-de-caral',
    type: 'archaeology',
    accessed: '2026-10-26',
    scope:
      'Official orientation gives 3000–1900 BCE; preserve difference from UNESCO’s development range.',
  },
  {
    id: 'liangzhu',
    title: 'Archaeological Ruins of Liangzhu City',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/1592/',
    type: 'archaeology',
    accessed: '2026-10-26',
    scope:
      'Description and Brief synthesis: city c3300–2300 BCE, waterworks, rice cultivation and differentiated burials.',
  },
  {
    id: 'skara-houses',
    title: 'Skara Brae: history and stories',
    institution: 'Historic Environment Scotland',
    url: 'https://www.historicenvironment.scot/visit/all/skara-brae/history-and-stories/',
    type: 'archaeology',
    accessed: '2026-10-26',
    scope:
      'Village houses and furniture; artefacts; end of village life around 2500 BCE with uncertain mechanism.',
  },
  {
    id: 'skara-tool',
    title: 'Stone tool, X.HA.668, Skara Brae',
    institution: 'Historic Environment Scotland; National Museums Scotland loan',
    url: 'https://historicenvironment.scot/archives-and-research/archives-and-collections/properties-in-care-collections/object/stone-tool-3180-bc-2500-bc-neolithic-skara-brae-9194',
    type: 'catalogue',
    accessed: '2026-10-26',
    scope:
      'Structured Date Made 3180–2500 BCE; narrative says 3100–2400 BCE. Uncertain function; stone material and context.',
  },
];
export const earlySubjects: Subject[] = [
  subject({
    id: 'uruk-accounts',
    name: 'Uruk and the work of recordkeeping',
    aliases: ['Uruk', 'Sumer', 'Proto-cuneiform'],
    kind: 'object',
    region: 'West/Central Asia',
    place: 'Southern Mesopotamia; probably Uruk, modern Iraq',
    coordinates: [45.64, 31.32],
    geographicPrecision:
      'Uruk city locator; selected tablet is only probably from Uruk.',
    interval: interval(
      -3100,
      -2900,
      'c. 3100–2900 BCE',
      'Date of the selected administrative tablet, not the beginning or end of Uruk.',
      'range',
    ),
    packs: ['C1'],
    question: 'Why would a city need marks on clay?',
    summary:
      'A small clay tablet connects writing with food and organized work. The selected record probably concerns deliveries and distributions of grain. In growing urban settings, durable marks could store information beyond one person’s memory. Yet reading these earliest accounts is difficult: we should distinguish a plausible interpretation from a complete translation of every sign.',
    sections: [
      sec(
        'Look at marks and impressions',
        'The tablet combines drawn signs and circular numerical impressions. The museum identifies it as an early account probably involving barley and emmer. It explicitly notes that the absence of verbs makes interpretation uncertain. Notice the marks before turning them into a confident story about who received how much.',
        cite('met-327384', 'Description'),
      ),
      sec(
        'Records belong to institutions',
        'The Uruk essay connects early pictographs with managing goods and allocating workers’ rations. The writing essay links accounting to temple estates and urban growth. Those records make some kinds of work visible because institutions wanted to track them. They are not the thoughts of every worker or a complete history of the city.',
        cite('uruk', 'Urban growth and pictographs paragraphs'),
        cite('writing', 'Temple estates and economic data'),
      ),
      sec(
        'An invention with a history',
        'Clay was a useful available surface, but the development of writing was not a single isolated moment that explains every later script. Spar discusses complexity and competing archaeological possibilities in the early record. Compare this tablet with an Indus seal: both preserve signs, yet the evidence permits different levels of reading.',
        cite('writing', 'Materials and qualified archaeological alternatives'),
        cite('met-324062', 'Inscription and decipherment discussion'),
      ),
    ],
    claims: [
      claim(
        'uruk-tablet-date',
        'The selected tablet is dated approximately 3100–2900 BCE.',
        [cite('met-327384', 'Date')],
      ),
      claim(
        'uruk-tablet-reading',
        'Its grain-account interpretation is probable, with uncertainty arising from early textual form.',
        [cite('met-327384', 'Final descriptive paragraph')],
      ),
    ],
    objectIds: ['met-327384'],
    terms: ['evidence', 'inscription', 'archive'],
    dimensions: {
      'Urban work': {
        text: 'Accounts record goods and rations in an institutional setting; the full experience of workers is less directly accessible.',
        citations: [
          cite('uruk', 'Pictographs and workers’ rations'),
          cite('writing', 'Temple estates'),
        ],
      },
      'Surviving evidence': {
        text: 'A probable grain account can be partly interpreted, while missing verbs constrain a full reading.',
        citations: [cite('met-327384', 'Description')],
      },
    },
    returnPrompt:
      'Why might the information an institution records differ from what a worker would want us to remember?',
  }),
  subject({
    id: 'old-kingdom',
    name: 'Old Kingdom Egypt: lives in a tomb wall',
    aliases: ['Egypt Old Kingdom', 'Saqqara'],
    kind: 'period',
    region: 'Africa',
    place: 'Nile Valley; Saqqara as the selected object’s context',
    coordinates: [31.22, 29.87],
    geographicPrecision:
      'Saqqara burial context is documented for the relief; the period extends beyond this site.',
    interval: interval(
      -2649,
      -2130,
      'c. 2649–2130 BCE',
      'Approximate period convention in the current 2019 essay, whose URL retains an older endpoint.',
      'approximate',
    ),
    packs: ['C1'],
    question: 'Why put scenes of work and play beside the dead?',
    summary:
      'A chapel wall shows offerings, musicians and a game alongside images of Nikauhor and Sekhemhathor. It makes human activities visible within an elite funerary setting. Those scenes helped provide for and commemorate the dead. They are valuable evidence of social life, but their setting and purpose prevent us from treating them as an unbiased picture of every household.',
    sections: [
      sec(
        'A wall has a history',
        'The catalogue identifies the couple, their religious roles and two false-door niches. It also describes traces of an erased scene. Some elements have been displaced in the museum arrangement. Close inspection therefore involves asking how an object changed, not simply naming what appears in a single photograph.',
        cite('met-543914', 'Description: couple, displaced stela and erased scene'),
      ),
      sec(
        'Ordinary activities, selected for a purpose',
        'The wall includes offerings, music and senet. The museum relates the game to an interpretation of passage through the afterworld. Prakash’s period account emphasizes how much surviving evidence comes from tombs. That imbalance can make elite commemoration appear more representative of society than it really is.',
        cite('met-543914', 'Description and audio transcript on senet'),
        cite('old-kingdom', 'Introduction on funerary evidence'),
      ),
      sec(
        'A period contains change',
        'The Old Kingdom was not one frozen arrangement of power and art. Prakash describes changes in officials’ wealth, burial spaces and representation. The period label is a tool for investigating those changes, not an enduring ethnic “family” flowing toward a modern country.',
        cite('old-kingdom', 'Dynasty 5 discussion of officials and tombs'),
      ),
    ],
    claims: [
      claim(
        'old-kingdom-range',
        'The current essay uses approximately 2649–2130 BCE for the Old Kingdom.',
        [cite('old-kingdom', 'Title and opening')],
      ),
      claim(
        'chapel-range',
        'The chapel wall is dated approximately 2465–2389 BCE and has a documented Saqqara context.',
        [cite('met-543914', 'Artwork Details: Date and Geography')],
      ),
    ],
    objectIds: ['met-543914'],
    terms: ['tomb', 'afterlife', 'ritual', 'evidence'],
    dimensions: {
      'Urban work': {
        text: 'Depicted offerings, music and games belong to a tomb’s commemorative program, not a neutral household survey.',
        citations: [cite('met-543914', 'Description')],
      },
      'Surviving evidence': {
        text: 'Funerary preservation strongly shapes the surviving material; traces of recarving reveal changes within one object.',
        citations: [
          cite('old-kingdom', 'Introduction'),
          cite('met-543914', 'Erased scene'),
        ],
      },
    },
    returnPrompt:
      'What might become invisible if we learned a society’s history only from elite tombs?',
  }),
  subject({
    id: 'dholavira',
    name: 'Dholavira: a city built around water',
    aliases: ['Harappa', 'Indus civilization', 'Harappan'],
    kind: 'place',
    region: 'South Asia',
    place: 'Khadir island, Gujarat, India',
    coordinates: [70.21, 23.89],
    geographicPrecision:
      'Archaeological city locator. The displayed Indus seal is regional evidence, not claimed as a Dholavira find.',
    interval: interval(
      -3000,
      -1500,
      'c. 3000–1500 BCE',
      'Occupation range in the UNESCO site account; mature urban phases and individual objects have narrower dates.',
      'approximate',
    ),
    packs: ['C1', 'C2'],
    question: 'What makes water part of a city’s design?',
    summary:
      'Dholavira’s reservoirs, drains and different residential areas reveal an urban society working with scarce seasonal water. Workshops connect that built environment to skilled production. An Indus stamp seal opens another question about marks, status and exchange, while its partly unread signs remind us that buildings and texts do not give the same access to the past.',
    sections: [
      sec(
        'Read the built landscape',
        'UNESCO describes a walled city, different residential sectors and a series of reservoirs. The seasonal streams and arid setting make water capture part of urban organization. A reservoir is evidence of construction and intended water management; it does not by itself name the people who decided, maintained or benefited from it.',
        cite('dholavira', 'Description; Brief synthesis; water-management discussion'),
      ),
      sec(
        'Skill, movement and unequal visibility',
        'The site account identifies bead-processing workshops and varied materials. These place craft workers in the city’s history alongside its larger structures. Regional exchange connected Dholavira with other places. A city plan can reveal differentiated space without providing a complete account of each resident’s legal or social status.',
        cite('dholavira', 'Craft workshops; differentiated residential areas'),
      ),
      sec(
        'Signs we cannot confidently read',
        'The displayed seal comes from the Indus region and dates approximately 2600–1900 BCE. The photograph includes a modern impression. Its animal and signs are visible, but the catalogue notes that the script has not been fully deciphered. Do not turn an imagined translation into a historical claim, or assume this particular seal was excavated in Dholavira.',
        cite('met-324062', 'Description; Date, Geography and title'),
      ),
    ],
    claims: [
      claim(
        'dholavira-range',
        'The site account dates occupation approximately 3000–1500 BCE.',
        [cite('dholavira', 'Description')],
      ),
      claim(
        'indus-seal-reading',
        'The selected Indus seal contains signs whose script has not been fully deciphered.',
        [cite('met-324062', 'Description')],
      ),
    ],
    objectIds: ['met-324062'],
    terms: ['irrigation', 'archaeology', 'inference'],
    dimensions: {
      'Urban work': {
        text: 'Reservoirs, drainage and craft workshops reveal organized construction and production in an arid setting.',
        citations: [cite('dholavira', 'Description and Brief synthesis')],
      },
      'Surviving evidence': {
        text: 'Built remains and regionally attributed seals answer different questions. A modern impression makes ancient carving legible but is not itself ancient.',
        citations: [
          cite('dholavira', 'Archaeological remains'),
          cite('met-324062', 'Title and inscription'),
        ],
      },
    },
    returnPrompt: 'Which questions would you ask of a reservoir, and which of a seal?',
  }),
  subject({
    id: 'liangzhu',
    name: 'Liangzhu: waterworks, rice and jade',
    aliases: ['Liangzhu City', 'Cong'],
    kind: 'place',
    region: 'East Asia',
    place: 'Lower Yangtze region near Hangzhou, China',
    coordinates: [119.99, 30.4],
    geographicPrecision:
      'Archaeological city region. The cong is not assigned a findspot at this city.',
    interval: interval(
      -3300,
      -2300,
      'c. 3300–2300 BCE',
      'UNESCO’s city/site range. The Met’s broader Liangzhu culture label c3200–2000 BCE has a different scope.',
      'approximate',
    ),
    packs: ['C1'],
    question: 'How can waterworks and burials tell different parts of a story?',
    summary:
      'Liangzhu’s city, dams and rice-growing landscape show organized work on a large scale. Differentiated burials and carved jade offer another view of status and belief. These kinds of evidence belong together without answering identical questions. A jade cong’s exact meaning remains uncertain even when its skilled manufacture and archaeological associations are clear.',
    sections: [
      sec(
        'A landscape deliberately organized',
        'UNESCO treats city planning, water conservation and rice cultivation as connected parts of the site. The dams and urban layout required coordinated action. They do not automatically reveal a list of rulers or prove that every inhabitant experienced authority in the same way.',
        cite('liangzhu', 'Description and Brief synthesis'),
      ),
      sec(
        'Close looking at a difficult material',
        'The selected cong has a circular bore within a square outer form, with small faces carved at the corners. It is nephrite jade, catalogued around 2400 BCE. The museum calls its function and meaning enigmatic and proposes wealth and status as likely associations. Preserve that confidence level while inspecting its geometry and surface.',
        cite('met-72376', 'Description; Date and Medium'),
      ),
      sec(
        'Site, culture and object are different units',
        'The city account’s 3300–2300 range and the museum’s 3200–2000 culture label should not be flattened into one exact political lifespan. A cultural grouping, a city and a particular artifact each need a defined scope. Nor is the museum’s cong identified here as a find from the city’s own excavations.',
        cite('liangzhu', 'City/site chronology'),
        cite('met-72376', 'Period and Date'),
      ),
    ],
    claims: [
      claim(
        'liangzhu-range',
        'The UNESCO city account uses approximately 3300–2300 BCE.',
        [cite('liangzhu', 'Description')],
      ),
      claim(
        'cong-meaning',
        'The selected cong’s function and meaning remain uncertain; status is a proposed association.',
        [cite('met-72376', 'Description')],
      ),
    ],
    objectIds: ['met-72376'],
    terms: ['irrigation', 'ritual', 'material culture'],
    dimensions: {
      'Urban work': {
        text: 'Water conservation systems and a rice-growing landscape connect coordinated work with urban life.',
        citations: [cite('liangzhu', 'Brief synthesis')],
      },
      'Surviving evidence': {
        text: 'Urban works, differentiated burials and jade preserve different aspects of social organization; the selected cong is not tied to a city findspot.',
        citations: [
          cite('liangzhu', 'Description'),
          cite('met-72376', 'Artwork Details'),
        ],
      },
    },
    returnPrompt:
      'Why should the date of a city, a culture label and an object remain separate?',
  }),
  subject({
    id: 'caral',
    name: 'Caral-Supe: building a shared place',
    aliases: ['Caral', 'Norte Chico'],
    kind: 'place',
    region: 'Americas',
    place: 'Supe Valley, coastal Peru',
    coordinates: [-77.52, -10.89],
    geographicPrecision:
      'Archaeological site locator; no continental political boundary implied.',
    interval: {
      ...interval(
        -3000,
        -1800,
        'c. 3000–1800 BCE',
        'UNESCO’s radiocarbon-based development range is followed. A current Peruvian government orientation gives 3000–1900 BCE; different endpoints are retained.',
        'disputed',
      ),
      alternatives: [
        {
          label: '3000–1900 BCE in the Peruvian government orientation',
          citations: [cite('caral-peru', 'Opening orientation')],
        },
      ],
    },
    packs: ['C1', 'C2'],
    question: 'What does a public building help people do together?',
    summary:
      'Caral’s platform mounds and sunken circular courts make a complex social landscape visible in coastal Peru. Built spaces developed over time rather than appearing in one founding moment. Their scale invites questions about labor, gatherings and authority. The surviving plan is powerful evidence, but it does not preserve the words of every builder or visitor.',
    sections: [
      sec(
        'Start with a plan, not a ranking',
        'The site account emphasizes mounds, courts and the relationship between architectural components. These features help us investigate organized activity in the Supe Valley. Calling a site “first” or ranking it against distant cities adds a different claim, requiring definitions and evidence beyond simply noticing substantial architecture.',
        cite('caral', 'Brief synthesis and criteria on architecture'),
      ),
      sec(
        'Buildings grow through time',
        'UNESCO reports radiocarbon work supporting development between 3000 and 1800 BCE. The range describes a sequence, not a precise birth date. A current Peruvian orientation ends the range at 1900 BCE. This atlas follows the UNESCO range for the site while preserving the difference instead of inventing a reconciled endpoint.',
        cite('caral', 'Integrity and Authenticity'),
        cite('caral-peru', 'Opening paragraph'),
      ),
      sec(
        'Compare questions rather than civilizations’ worth',
        'Set Caral beside Liangzhu. Both sites invite questions about coordinated building and social organization, but their environments and surviving evidence differ. No relationship edge follows from their overlapping ranges. A fair comparison asks which evidence supports each answer and what remains unavailable.',
        cite('caral', 'Architecture and site account'),
        cite('liangzhu', 'Description and Brief synthesis'),
      ),
    ],
    claims: [
      claim(
        'caral-range',
        'UNESCO gives a development range of 3000–1800 BCE.',
        [cite('caral', 'Integrity and Authenticity')],
        'The Peruvian orientation gives 3000–1900 BCE; no precise terminal event is asserted.',
      ),
      claim(
        'caral-courts',
        'Monumental platforms and recessed circular courts form part of Caral’s urban plan.',
        [cite('caral', 'Brief synthesis')],
      ),
    ],
    objectIds: [],
    terms: ['archaeology', 'chronology', 'inference'],
    dimensions: {
      'Urban work': {
        text: 'Platforms, courts and an organized plan show investment in built gathering places, while individual builders are harder to recover.',
        citations: [cite('caral', 'Architecture and spatial components')],
      },
      'Surviving evidence': {
        text: 'Architectural remains and radiocarbon chronology support a changing site; published endpoints are not fully identical.',
        citations: [
          cite('caral', 'Integrity and Authenticity'),
          cite('caral-peru', 'Opening'),
        ],
      },
    },
    returnPrompt:
      'What could a gathering place tell us, and what would we still want to learn about its builders?',
  }),
  subject({
    id: 'skara-brae',
    name: 'Skara Brae: households in stone',
    aliases: ['Orkney'],
    kind: 'place',
    region: 'Europe',
    place: 'Sandwick, Orkney, Scotland',
    coordinates: [-3.34, 59.05],
    geographicPrecision:
      'Settlement locator; today’s coast is not a reconstruction of its original setting.',
    interval: interval(
      -3180,
      -2500,
      'c. 3180–2500 BCE',
      'Structured date in HES’s selected tool record gives the contextual range. Its narrative instead says 3100–2400; house-history page places the end around 2500. Boundaries are approximate.',
      'disputed',
    ),
    packs: ['C1'],
    question: 'What survives when a household was built in stone?',
    summary:
      'Stone walls, furniture, passageways and tools let us investigate households beyond a sequence of states. Skara Brae’s inhabitants farmed, hunted and fished. Some objects and spaces remain difficult to interpret. The preservation is unusual: a surviving stone interior tells us a great deal, but does not mean all prehistoric households were made or organized the same way.',
    sections: [
      sec(
        'A home within a changing landscape',
        'HES describes the village originally beside a freshwater loch, with stone-built houses joined by covered passages. Hearths and box-beds are recognizable domestic features. The modern sea view is part of the site’s later history, so a contemporary photograph should not be mistaken for a precise reconstruction of the Neolithic landscape.',
        cite('skara-houses', 'Village houses and furniture'),
      ),
      sec(
        'A tool without an agreed purpose',
        'The catalogued notched sandstone slab has a proposed identification as a hand-held rake, but its precise function is unclear. Familiarity can tempt us to name an unfamiliar object too quickly. Treat “rake” as a possibility to test against wear, context and comparable tools, rather than a fact established by resemblance alone.',
        cite('skara-tool', 'Overview and Details'),
      ),
      sec(
        'Preservation is selective',
        'HES lists pottery, tools and ornaments as well as household structures. It also preserves uncertainty about why village life ended. A record of surviving material is shaped by what people made, what survived and what archaeologists recovered. A gap in evidence should invite a question before it becomes a confident story of sudden disaster.',
        cite('skara-houses', 'Artefacts and remains; End of village life'),
      ),
    ],
    claims: [
      claim(
        'skara-homes',
        'The village had stone-built houses with covered passages and fitted furnishings.',
        [cite('skara-houses', 'Village houses and furniture')],
      ),
      claim(
        'skara-tool-function',
        'The notched sandstone tool’s exact use is uncertain.',
        [cite('skara-tool', 'Overview')],
      ),
    ],
    objectIds: [],
    terms: ['archaeology', 'inference', 'material culture'],
    dimensions: {
      'Urban work': {
        text: 'Households, farming, fishing and crafted tools make non-state daily life visible without requiring an imperial chronology.',
        citations: [cite('skara-houses', 'Houses; inhabitants’ activities')],
      },
      'Surviving evidence': {
        text: 'Exceptional stone preservation leaves detailed interiors; uncertain tool use and ending mechanisms resist a complete reconstruction.',
        citations: [
          cite('skara-houses', 'Preservation and ending'),
          cite('skara-tool', 'Overview'),
        ],
      },
    },
    returnPrompt:
      'Which parts of your own home would survive if only stone remained? What might a future observer misunderstand?',
  }),
];
export const earlyJourney: Journey = {
  id: 'cities-evidence',
  title: 'What makes a community visible?',
  question: 'Can we recover work, belief and authority from things?',
  duration: '25–40 minutes',
  introduction:
    'Compare a grain account, a tomb wall, reservoirs, jade, public courts and a stone household. These are different windows into early communities, not steps in a universal ladder.',
  stops: [
    {
      subject: 'uruk-accounts',
      year: -3000,
      title: 'Information pressed into clay',
      narrative:
        'Inspect the signs and numerical impressions. Keep the probable grain interpretation separate from a complete translation.',
      object: 'met-327384',
    },
    {
      subject: 'old-kingdom',
      year: -2400,
      title: 'Work and play beside the dead',
      narrative:
        'Find scenes of offerings and music. Ask why an elite funerary wall selected these activities.',
      object: 'met-543914',
    },
    {
      subject: 'dholavira',
      year: -2400,
      title: 'A city needs water',
      narrative:
        'Locate the arid island setting. Compare what reservoirs reveal with what the seal’s unread signs cannot yet tell us.',
      object: 'met-324062',
      compare: 'uruk-accounts',
    },
    {
      subject: 'liangzhu',
      year: -2400,
      title: 'Different evidence, different scales',
      narrative:
        'Inspect the jade’s geometry and then think about waterworks and burials. Do not give a city, culture and artifact one artificial lifespan.',
      object: 'met-72376',
    },
    {
      subject: 'caral',
      year: -2400,
      title: 'A public place across the ocean',
      narrative:
        'Imagine questions you could ask of platforms and sunken courts. The comparison with Liangzhu implies no historical contact.',
      compare: 'liangzhu',
    },
    {
      subject: 'skara-brae',
      year: -2800,
      title: 'Bring households into the atlas',
      narrative:
        'Consider hearths, beds and a tool of uncertain use. Explain which evidence supports a conclusion and what may be missing.',
    },
  ],
  conclusion:
    'Early communities become visible through many kinds of evidence. Records, monuments and surviving houses illuminate different people and activities. A serious atlas can compare them without ranking their worth or pretending they share one political lineage.',
  evidence: {
    prompt: 'Which statement makes the strongest supported distinction?',
    options: [
      {
        text: 'Every ancient sign can be translated if we imagine what its maker wanted.',
        supported: false,
        feedback:
          'Imagination is not a translation method. The Indus signs remain incompletely read, while even the grain tablet’s interpretation has limits.',
      },
      {
        text: 'A building, a tablet and a burial object can support different questions about a society.',
        supported: true,
        feedback:
          'Their materials, contexts and purposes preserve different information. Compare the questions each can answer.',
      },
      {
        text: 'Monumental buildings prove that everyone in a community had equal power.',
        supported: false,
        feedback:
          'Coordinated work does not establish equality. Differentiated spaces and burials may instead prompt questions about hierarchy.',
      },
    ],
    citations: [
      cite('met-327384', 'Description'),
      cite('met-324062', 'Decipherment'),
      cite('liangzhu', 'Differentiated burials'),
    ],
  },
  returnPrompt:
    'Choose two kinds of evidence. What can each show, and what does each leave difficult to know?',
};
