import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'kawa-work-2024',
    title: 'The “Libyan Family” at Kawa: Fashion as a Political Statement of Taharqo',
    author: 'Aleksandra Hallmann',
    institution:
      'In Scalf and Muhs, eds., A Master of Secrets in the Chamber of Darkness, Studies in Ancient Cultures 3, pp. 121–138; University of Chicago',
    url: 'https://isac.uchicago.edu/publications/master-secrets-chamber-darkness-egyptological-studies-honor-robert-k-ritner-presented',
    type: 'scholarship',
    published: '2024',
    accessed: '2026-10-29',
    scope:
      'Selected chapter text, printed pp. 121 and 131–133 (PDF pp. 152 and 162–164), especially Kawa IV lines 21–22 through Hallmann’s discussion following Ritner’s 2009 translation, and Kawa III line 22. Actual printed p. 132 rendered and visually inspected; printed pp. 122–123 figure captions extracted without figure-pixel inspection. Not the full chapter/book or fresh consultation of the underlying Macadam/Ritner originals. Royal workforce/gift language and the author’s iconographic interpretation are attributed; no numerical workforce, individual status/payment or first-person worker account inferred. Publisher page states CC BY-NC-ND 4.0; PDF front matter © 2024 University of Chicago and individual figure courtesy credits do not establish adaptation permission. No chapter image copied or traced.',
  },
  {
    id: 'sanam-production-2026',
    title:
      'Crafting power in Kush: faience production and state control in the Napatan region',
    author: 'Rennan Lemos; Kathryn Howley; Siobhan Shinn; Shadia Abdu Rabo',
    institution: 'Antiquity / Cambridge University Press',
    url: 'https://www.cambridge.org/core/journals/antiquity/article/crafting-power-in-kush-faience-production-and-state-control-in-the-napatan-region/A15CF88886CC39E3C6D4110DD58B94A5',
    type: 'scholarship',
    published: '2026-10-19',
    accessed: '2026-10-29',
    scope:
      'Publisher HTML Abstract, Introduction, New excavations, workshop, production/consumption, state-discussion and Conclusion read, with captions; actual PDF pp. 10 and 13 checked for ceramic dating and the mould match. Original Figure 4 and Figure 10 pixels inspected. Not the underlying excavation publications, experiments, chemical analyses, Howley dissertation or supplementary datasets. Abstract uses mid-seventh-century BCE; body discusses later eighth–seventh-century marl parallels and seventh–sixth-century local ceramic counterparts, then an Early–Middle Napatan use frame. No exact workshop year, demonstrated manufacture wholly within/after Taharqo’s reign, or origin of Met granite shabti 18.2.10 inferred. Institutional control is the excavators’ argument; proposed personnel roles and broader household/state organization remain qualified. Article CC BY 4.0, © authors 2026; Figures 4 and 10 credited authors with no separate exclusion found. Figure 10’s matching faience fragment is uninscribed and the small source scale has no readable unit; Figure 4 is a modern annotated orthophoto, not a reconstructed ancient plan, and has no visible north arrow.',
  },
  {
    id: 'ashmolean-shrine',
    title: 'Taharqa’s Shrine: Information sheet',
    institution: 'Ashmolean Museum Education Department',
    url: 'https://www.ashmolean.org/files/learnpdftaharqasshrinepdf',
    type: 'catalogue',
    accessed: '2026-10-29',
    scope:
      'Three-page teaching PDF text consulted for the c. 680 BCE temple/shrine, Memphis craftspeople, divine-statue service and offering imagery; actual p. 3 rendered and visually inspected. Undated information sheet: PDF creation 2009/modification 2014 are not demonstrated publication dates. Its royal-visit narrative and four-year building account are institutional interpretation, not a builder-authored diary. No universal household belief inferred. Erroneous transport-distance wording is not used. No image-specific reuse licence established; no photograph/map copied or traced.',
  },
  {
    id: 'bm-taharqo-shabti',
    title: 'Shabti of Taharqo, EA55483',
    institution: 'The British Museum',
    url: 'https://www.britishmuseum.org/collection/object/Y_EA55483',
    type: 'catalogue',
    accessed: '2026-10-29',
    scope:
      'Detailed indexed museum record Description, Production date, Findspot and Materials read through the web search tool; direct collection-page request returned 403. Accession EA55483 is calcite, dated 690–664 BCE, excavated by Reisner at Taharqo’s Nuri pyramid; its fuller older spell wording concerns that distinct object. This comparison does not supply a translation of Met 18.2.10 or overwrite its material/probable findspot. No image pixels inspected or reused; no fresh reading of the cited Dunham or Taylor/Strudwick books claimed.',
  },
];

const context: HistoricalContext = {
  id: 'kushite-temple-work-context',
  title: 'Kushite and Egyptian power: temples, skilled work and royal claims',
  region: 'Africa',
  interval: {
    start: -747,
    end: -656,
    label: 'c. 747–656 BCE: selected Dynasty 25 orientation',
    precision: 'approximate',
    note: 'Uses the 2026 Sanam article’s approximate Dynasty 25 frame, not the whole history of Kush or a continuous unchanged state. The retained case remains Taharqo’s c. 690–664 BCE reign. Kawa’s c. 680 BCE temple/shrine, individual shabti dates and the broadly dated Sanam workshop answer different questions. The workshop is not assigned an exact year or wholly to this reign; its ceramic discussion includes broader seventh–sixth-century parallels beyond this frame.',
  },
  summary:
    'Kushite rulers linked power in Egypt and Nubia with temple building, ritual service and the organisation of people and materials. Royal inscriptions, surviving objects and excavated production remains reveal different parts of those institutions.',
  subjectIds: ['taharqo'],
  citations: [
    {
      source: 'sanam-production-2026',
      locator:
        'Introduction: Dynasty 25 frame, Taharqo and temple institutions; workshop dating discussion, PDF p. 10',
    },
    {
      source: 'met-544883',
      locator:
        'Description and Artwork Details: reign, material and probable Nuri attribution',
    },
    {
      source: 'ashmolean-shrine',
      locator: 'Information sheet pp. 1–3: c. 680 BCE temple/shrine and service',
    },
  ],
  phases: [
    {
      year: -747,
      label: 'c. 747 BCE: approximate beginning of the selected dynastic frame',
      title: 'Kushite kingship extended into Egypt',
      text: 'The Sanam article places Piankhy’s conquest of Egypt within the beginning of Dynasty 25, which it dates approximately 747–656 BCE. This convention frames changing political relationships across the Nile valley; it is not an exact date for every conquest, settlement or temple. The later Taharqo figure belongs to one reign within that wider history.',
      citations: [
        {
          source: 'sanam-production-2026',
          locator: 'Introduction: Piankhy, Dynasty 25 and the c. 747–656 BCE frame',
        },
      ],
    },
    {
      year: -690,
      label: 'c. 690–664 BCE: Taharqo’s retained reign interval',
      title: 'A king commissioned and presented institutions',
      text: 'The Met dates the selected granite figure to Taharqo’s reign. At Kawa, inscriptions described a king providing people and resources for a temple; Hallmann discusses his claim to have sent crews, skilled craftspeople and an overseer while he remained in Memphis. A royal assertion of provision is different from a builder’s account of the work.',
      citations: [
        {
          source: 'met-544883',
          locator: 'Artwork Details: Date and Reign',
        },
        {
          source: 'kawa-work-2024',
          locator:
            'Printed p. 132 / PDF p. 163: mediated discussion of Kawa IV lines 21–22',
        },
      ],
    },
    {
      year: -680,
      label: 'Around 680 BCE: the museum’s Kawa building orientation',
      title: 'Temple service joined materials, images and repeated tasks',
      text: 'The Ashmolean places the Kawa temple and shrine around 680 BCE. Its teaching account links skilled building to the shrine’s offering imagery and priests’ care for the divine statue. The published date is a broad building orientation; it does not date each carving, each worker’s service or the manufacture of the Met’s shabti.',
      citations: [
        {
          source: 'ashmolean-shrine',
          locator:
            'Information sheet pp. 1–3: building, shrine imagery and divine-statue service',
        },
      ],
    },
    {
      year: -656,
      label: 'c. 656 BCE: end of the selected Egyptian dynastic convention',
      title: 'One dynastic boundary does not date every institution',
      text: 'The Sanam article ends its Dynasty 25 convention around 656 BCE, after the selected Taharqo reign. Its faience-workshop evidence has its own broad ceramic chronology and is not reduced to a single king’s lifetime. Compare that excavated production context with a reign-attributed granite figure and a probable Nuri origin, keeping the different materials, dates and levels of certainty visible.',
      citations: [
        {
          source: 'sanam-production-2026',
          locator:
            'Introduction: dynastic frame; The Sanam Temple faience workshop, PDF pp. 10 and 13',
        },
        {
          source: 'met-544883',
          locator: 'Description and Artwork Details: date, material and probable Nuri',
        },
      ],
    },
  ],
};

export function applyTaharqoInstitutions(c: Corpus) {
  for (const source of sources) {
    const index = c.sources.findIndex((existing) => existing.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  const met = c.sources.find((source) => source.id === 'met-544883')!;
  met.accessed = consulted;
  met.scope =
    'Visible catalogue Description, Artwork Details and Public Domain/Open Access statement read again. Accession 18.2.10: 690–664 BCE, granite described as a Nubian variety, height 20.3 cm, probably from Nuri; the visible range is retained instead of the API’s repeated end year. Actual existing front photograph inspected: crossed hands, headgear and carved inscription; no inscription translation inferred from pixels. No individual maker, exact manufacture year, later manufacture/reuse or documented excavation location established by this scope. No linked bibliography or complete archival provenance research claimed.';
  const shabti = c.sources.find((source) => source.id === 'shabti-context')!;
  shabti.accessed = consulted;
  shabti.scope =
    'Visible Description and Artwork Details of Seti I shabti 26.7.919 read again: general funerary substitution, manual tasks and tools, with c. 1299–1290 BCE catalogue date. This earlier object supplies contextual explanation, not a translation of Taharqo’s particular granite figure. No audio listened to; a transcript was unavailable on the page. No universal belief or object-specific Taharqo spell wording inferred.';
  c.contexts = [
    ...(c.contexts ?? []).filter((existing) => existing.id !== context.id),
    context,
  ];
  const s = c.subjects.find((subject) => subject.id === 'taharqo')!;
  s.contextIds = [...new Set([...(s.contextIds ?? []), context.id])];
  s.summary =
    'Taharqo’s royal institutions joined temple building and service with skilled production and claims over people and materials. A granite shabti attributed to his reign, probably from Nuri, connects that practical work with elite expectations of labor after death. Royal inscriptions, excavated faience production and a museum object label explain different parts of the history.';
  s.sections = [
    {
      title: 'A kingdom supported through temples',
      text: 'Taharqo ruled Egypt and Kush in the Nile valley, with his reign conventionally dated to about 690–664 BCE. At Kawa, in present-day Sudan, he commissioned a sandstone temple and a shrine for Amun. The shrine’s reliefs showed him presenting offerings and wearing royal headgear. The Ashmolean’s teaching account describes priests caring for the god’s statue: awakening it, clothing it and presenting food. A temple therefore connected royal display with repeated practical tasks. People had to supply materials, make and maintain sacred objects, and perform ceremonies. These activities helped present the king’s relationship with Amun as a source of legitimate power.',
      citations: [
        {
          source: 'met-544883',
          locator: 'Description and Artwork Details',
        },
        {
          source: 'ashmolean-shrine',
          locator:
            'Information sheet pp. 1–3, especially “Why did he build the shrine?” and “What can you see on the shrine?”',
        },
      ],
    },
    {
      title: 'Organising people and skilled work',
      text: 'Kawa’s inscriptions also make claims about how the work was organised. In a passage discussed by Aleksandra Hallmann, Taharqo says that he sent work crews, craftspeople and a construction overseer while he remained in Memphis. This is a king announcing his provision, rather than a surviving diary kept by the builders. Another temple inscription lists male and female servants among his gifts. Such wording places people within royal resource claims and makes compulsion a necessary question; it does not tell us every worker’s status, payment or experience.',
      citations: [
        {
          source: 'kawa-work-2024',
          locator:
            'Hallmann, printed pp. 132–133 / PDF pp. 163–164; Kawa IV lines 21–22 and Kawa III line 22 as discussed there',
        },
      ],
    },
    {
      title: 'A workshop makes the connection tangible',
      text: 'Excavations at another temple founded by Taharqo, Sanam, uncovered firing pits, mudbrick basins, beads and damaged products from making faience, a manufactured quartz-rich material with a glazed surface. A clay mould from inside the temple matches an uninscribed green faience shabti fragment from the workshop. The excavators interpret this seventh-century production as evidence that temple institutions helped organise goods for royal funerary use. It brings skilled making into the explanation of power. This faience evidence concerns a different material and archaeological context from the granite figure shown here; it does not locate this particular figure’s workshop.',
      citations: [
        {
          source: 'faience-material',
          locator:
            'Technical Description of Faience; Making Faience: general material and mould shaping',
        },
        {
          source: 'sanam-production-2026',
          locator:
            'Abstract; “The Sanam Temple faience workshop”; PDF pp. 10, 13 and Figure 10',
        },
      ],
    },
    {
      title: 'Work imagined beyond life',
      text: 'The selected figure is the Met’s granite shabti of Taharqo, only 20.3 centimetres high, probably associated with his pyramid at Nuri. Shabtis were intended to answer demands for work after death. The Met’s separate Seti I example explains tasks such as cultivation, irrigation and moving sand. That earlier object supplies general context, not a translation of Taharqo’s inscription. Here, a named king was commemorated through an object concerned with service and labor. Its material, carved writing and royal identity connect skilled production with elite expectations of the afterlife, while leaving ordinary households’ beliefs outside what this object alone can establish.',
      citations: [
        {
          source: 'met-544883',
          locator:
            'Description and Artwork Details: date, material, height, probable geography',
        },
        {
          source: 'shabti-context',
          locator:
            'Description of accession 26.7.919; general shabti labor-spell context only',
        },
      ],
    },
  ];
  s.deeperReading = [
    {
      title: 'Old words can be a deliberate choice',
      text: 'A second Taharqo shabti in the British Museum, EA55483, is calcite and has a recorded Nuri findspot. Its catalogue explains that its spell uses fuller, older wording instead of the shortened versions then common. An older model does not automatically make the object older, and borrowing an old text is not evidence that a figure was made after the king died. This comparison shows why material, wording, attributed production date and findspot should be investigated separately. It does not supply a transcription of the Met’s granite figure.',
      citations: [
        {
          source: 'bm-taharqo-shabti',
          locator:
            'Description, Production date, Findspot and Materials; indexed museum record, direct page access returned 403',
        },
      ],
    },
    {
      title: 'Images claim a place in political history',
      text: 'Hallmann examines Kawa scenes in which the king appears as a sphinx overcoming enemies. She argues that their artists used older Egyptian compositions but changed the clothing of the depicted Libyan families to make a contemporary political statement. The reliefs consequently give evidence for the way kingship was presented; they need comparison with other sources before describing a particular battle. Read this interpretation alongside the king’s account of crews and temple gifts: both made resources and people visible through a royal voice. They support a history of institutions while leaving the workers’ own accounts largely unheard.',
      citations: [
        {
          source: 'kawa-work-2024',
          locator:
            'Printed pp. 121 and 131–133 / PDF pp. 152 and 162–164; author’s iconographic interpretation',
        },
      ],
    },
    {
      title: 'Keep the object’s open questions open',
      text: 'The consulted sources do not establish later manufacture or reuse of accession 18.2.10. Its reign attribution and probable Nuri origin remain qualified catalogue statements. Further research into the inscription or a secure excavation context could refine either. A shared royal name alone cannot settle when an object was made or how it was used.',
      citations: [
        {
          source: 'met-544883',
          locator:
            'Visible Description and Artwork Details; no later manufacture/use claim found in the consulted scope',
        },
      ],
    },
  ];
  s.evidenceReading = {
    title: 'Follow a claim from royal words to excavated work',
    introduction:
      'These are editorial paraphrases of the consulted sources, not translations of the displayed figure or quotations from ancient inscriptions.',
    items: [
      {
        label: 'A king says that he provided workers',
        text: 'Hallmann discusses Kawa IV lines 21–22, in which Taharqo claims to have sent work crews, craftspeople and an overseer while he remained in Memphis. She also discusses Kawa III line 22, which lists male and female servants among temple gifts.',
        interpretation:
          'The passages make organised work and claims over people part of royal presentation. They do not give a numerical workforce or establish that every worker shared one legal status, received payment or chose the work. The ancient wording is reached through Hallmann’s discussion following a published translation, not a fresh translation here.',
        citations: [
          {
            source: 'kawa-work-2024',
            locator:
              'Printed pp. 132–133 / PDF pp. 163–164; Kawa IV lines 21–22 and Kawa III line 22 through Hallmann',
          },
        ],
      },
      {
        label: 'A mould match supports manufacture',
        text: 'The Sanam excavators report a clay mould from inside the temple matching an uninscribed green faience shabti fragment found in the workshop. Firing pits, basins and production debris supply the wider excavated context.',
        interpretation:
          'Together these observations support making faience objects near the temple; the authors argue that institutions organised royal funerary production. A similar function does not make faience and granite the same material, identify the Met figure’s workshop or turn the broad ceramic chronology into one exact production year.',
        citations: [
          {
            source: 'sanam-production-2026',
            locator:
              'The Sanam Temple faience workshop; PDF pp. 10 and 13; Figure 10 and caption',
          },
        ],
      },
      {
        label: 'A qualified label changes the comparison',
        text: 'The Met identifies accession 18.2.10 as a granite shabti of Taharqo, attributed to 690–664 BCE and probably associated with Nuri. The British Museum’s separate calcite example EA55483 has a recorded Nuri excavation and uses older spell wording.',
        interpretation:
          'Findspot confidence, attributed date, material and textual model are separate evidence. An older text is not proof of an older or later physical object. The comparison establishes neither a later manufacture date nor a history of reuse for the selected figure.',
        citations: [
          {
            source: 'met-544883',
            locator: 'Description and Artwork Details: Date, Geography and Medium',
          },
          {
            source: 'bm-taharqo-shabti',
            locator:
              'Indexed Description, Production date, Findspot and Materials; direct page 403',
          },
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Who made the king’s power visible?',
    duration: '10–15 minutes',
    steps: [
      'Look at the granite figure. Find two details that required skilled making, and describe what you can see before interpreting their purpose.',
      'Use the source capsule to match three questions to evidence: Who claimed to organise building work? Where is there excavated manufacturing evidence? How certain is this granite figure’s findspot?',
      'Compare the materials named in the object captions: granite, clay and faience. Explain why a mould matching a faience fragment does not locate the granite figure’s workshop.',
      'Choose one further source you would want before describing an individual worker’s life. Explain which unanswered question it could address.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: Hallmann reports Taharqo’s royal claim to send crews and craftspeople to Kawa. At Sanam, excavated firing pits and a clay mould matching an uninscribed faience fragment support manufacture; the authors interpret temple organisation. The Met’s granite shabti is attributed to his reign and probably to Nuri. Carved writing, headgear and crossed hands are visible details; the photograph supplies no translation. Royal claims, excavated production and a probable museum attribution answer different questions.',
  };
  s.review = {
    consultedOn: '2026-10-29',
    reviewer:
      'Codex source consultation and internal author QA; not independent historian approval',
    scope:
      'Bounded main, deeper reading, consequential evidence interpretation, supplied family source capsule and distinct phased reference. Complete original interval, stable identity fields, coordinates, packs, original object IDs, claims and existing dimensions preserved. Existing Met catalogue sources renewed only within actually read scopes.',
    limitations: [
      'Selected Hallmann chapter passages and museum teaching/catalogue scopes only; underlying Macadam/Ritner editions, original experiments, chemical analyses and older excavation records not independently consulted. British Museum details were available through its indexed record; direct page access returned 403.',
      'The Sanam publication’s mid-seventh-century abstract and broader ceramic discussion are retained as source conventions, not one exact workshop year or proof of manufacture wholly within/after Taharqo’s reign. Faience evidence does not locate the selected granite figure’s workshop.',
      'No evidence in the consulted scope establishes later manufacture/reuse of Met 18.2.10, an exact excavated findspot, its maker, every worker’s status or universal household belief. These remain questions for further inscription, excavation and social-history research.',
      'No independent historian, real adult/family, human screen-reader, physical-device or physical-print acceptance claimed. No Ashmolean or ISAC source illustration copied or traced; the Sanam excavation view and mould photograph retain separate dates, credit, CC BY 4.0 rights and natural-size ceilings. Exact photograph acquisition dates and the small mould-image scale unit remain unstated.',
    ],
  };
  s.terms = [
    ...new Set([...s.terms, 'afterlife', 'inscription', 'ritual', 'provisioning']),
  ];
  s.dimensions['material-work'] = {
    text: 'Temple building and service required people, skills and materials; royal workforce claims and excavated faience manufacture reveal different evidence for that organisation. Neither identifies the selected granite figure’s workshop or every worker’s status.',
    citations: [
      {
        source: 'kawa-work-2024',
        locator: 'Printed pp. 132–133: mediated workforce/gift passages',
      },
      {
        source: 'sanam-production-2026',
        locator: 'Workshop and production/consumption sections; PDF pp. 10 and 13',
      },
    ],
  };
  s.dimensionKeys = [
    ...new Set([...(s.dimensionKeys ?? Object.keys(s.dimensions)), 'material-work']),
  ];
}
