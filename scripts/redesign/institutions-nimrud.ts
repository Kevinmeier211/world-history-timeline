import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';

const sources: Source[] = [
  {
    id: 'nimrud-palace-project',
    title: 'The Northwest Palace',
    author: 'Eleanor Robson',
    institution:
      'Nimrud: Materialities of Assyrian Knowledge Production, Oracc; AHRC-funded Nimrud Project',
    published: '18 December 2019 last modification',
    url: 'https://oracc.museum.upenn.edu/nimrud/ancientkalhu/thecity/northwestpalace/index.html',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      'Selected project account read: Managing the palace, Encapsulating empire, Receiving guests, Behind the scenes and After Assurnasirpal, plus Image 1 and footnote 1. The named kitchen Room ZZ, storage, later ZT4 archive and alterations inform an account of practical work in a long-used building; room functions and staff identities remain interpretations. The universal slave-labor wording is not adopted. Actual Image 1 pixels inspected: BSAI/BISI composite excavated plan, 460×926 source pixels, near-upward north arrow and 0–50 m scale. It includes later Sargon/Adad-nerari features and is not a single 883–859 BCE phase plan. Its cited Oates/Oates 2001 figures 15/33 and linked 128 MB book were not consulted independently. No complete excavation archive or underlying volumes claimed read. Small source detail is not recovered by enlargement.',
  },
  {
    id: 'nimrud-standard-inscription',
    title: 'Ashurnasirpal II 023 — RIMA 2 A.0.101.23, the Standard Inscription',
    author:
      'A. Kirk Grayson; online adaptation by Jamie Novotny, updated by Nathan Morello',
    institution:
      'Royal Inscriptions of Assyria online, Oracc; OIMEA Project, Ludwig-Maximilians-Universität München',
    published: '1991 edition; online adaptation 2015–16, update 2016–17',
    url: 'https://oracc.museum.upenn.edu/riao/Q004477',
    type: 'primary',
    accessed: '2026-10-29',
    scope:
      'Saved online annotated edition: complete translated lines 1–22 and editorial credit read. Selected use: titles/divine favor 1–5a; rebuilding Kalhu 14b–15a; conquered people brought and settled 15b–17a; palace/material/booty claims 17b–22. These are royal claims, not independent confirmation of every victory, quantity, successful work outcome or worker status. Q004477 combines textual exemplars; it is not a fresh line-by-line reading of the selected Met panel. Annotated edition explicitly CC BY-SA 3.0; no entire RIMA volume or every exemplar consulted.',
  },
  {
    id: 'nimrud-captives-letter',
    title: 'SAA 19 006 — Take up your Responsibility!',
    author: 'Mikko Luukko',
    institution:
      'State Archives of Assyria online, Oracc; University College London AHRC communication project',
    published: '2012',
    url: 'https://oracc.museum.upenn.edu/saao/saa19/P224478',
    type: 'primary',
    accessed: '2026-10-29',
    scope:
      'Selected tablet edition, catalogue, full translation/transliteration and credit read: ND02735 / IM064143, CTN 5 p. 304, Northwest Palace Room ZT4. Catalogue assigns Tiglath-pileser III 744–727 BCE, explicitly undated, proposed date (732). Obverse 1–15 concerns officials, captives and provisions; reverse 2′–13′ provision, threat against neglect and care of sick captives. Broken/restored passages remain distinct from secure words. Orders and intended provision do not demonstrate fulfillment, consent, survival or benign captivity. This later administrative record contextualizes, but does not extend, the 883–859 case. Annotated edition explicitly CC BY-SA 3.0; no complete SAA 19 volume or entire palace archive claimed read.',
  },
  {
    id: 'nimrud-plan-rights',
    title: 'About this website — Nimrud Project copyright and licensing',
    institution: 'Nimrud Project, Oracc; British Institute for the Study of Iraq',
    published: '18 December 2019 last modification',
    url: 'https://oracc.museum.upenn.edu/nimrud/aboutthiswebsite/index.html',
    type: 'catalogue',
    accessed: '2026-10-29',
    scope:
      'Saved Copyright and licensing text read. Default project content uses CC BY-SA 3.0; images specifically credited BSAI/BISI are explicitly released CC BY-SA 3.0 courtesy BISI. This covers the credited Image 1 palace plan; third-party images have separate terms. Required attribution includes project/author where relevant, BSAI/BISI and AHRC funding. Source image licensing is separate from any new artwork, adaptation notice or reader presentation. No blanket permission for all linked images inferred.',
  },
];

const context: HistoricalContext = {
  id: 'nimrud-government-context',
  title: 'A palace through changing Assyrian government',
  region: 'West/Central Asia',
  interval: {
    start: -883,
    end: -612,
    label: 'Selected ninth–seventh-century contexts, 883–612 BCE',
    note: 'A reference frame around the Northwest Palace and later administration, not the complete life of Kalhu or an imperial border. Selected phase anchors have gaps; they do not establish a continuous universal sequence. The case remains 883–859 BCE.',
    precision: 'approximate',
  },
  summary:
    'Making a palace, staging royal authority, administering people and sustaining practical work left different evidence. Later letters and alterations belong to their own dates.',
  subjectIds: ['nimrud-palace'],
  citations: [
    {
      source: 'nimrud',
      locator: 'Ninth/eighth-century capital and later history',
    },
    {
      source: 'nimrud-palace-project',
      locator: 'Managing the palace; Behind the scenes; After Assurnasirpal',
    },
    {
      source: 'nimrud-captives-letter',
      locator: 'Catalogue and proposed date (732)',
    },
  ],
  phases: [
    {
      year: -883,
      label: '883–859 BCE: the selected reign',
      title: 'Ashurnasirpal’s palace setting',
      text: 'Building and royal display establish the selected ninth-century case. The recurring inscription represents the king’s rebuilding, conquest and settlement claims.',
      citations: [
        {
          source: 'nimrud',
          locator: 'Ashurnasirpal II, 883–859; Northwest Palace',
        },
        {
          source: 'nimrud-standard-inscription',
          locator: 'Lines 14b–22',
        },
      ],
    },
    {
      year: -732,
      label: 'Around 732 BCE: an editorial proposed date',
      title: 'A later reign in the palace archive',
      text: 'The catalogue assigns SAA 19 006 to Tiglath-pileser III’s reign; its more precise date, about 732 BCE, is proposed rather than written on the tablet.',
      citations: [
        {
          source: 'nimrud-captives-letter',
          locator: 'Date metadata and Room ZT4 archive provenance',
        },
      ],
    },
    {
      year: -674,
      label: 'The 670s BCE: a later alteration',
      title: 'Selected alterations in the 670s',
      text: 'Robson’s account describes removal of sculptures from the West Suite under Esarhaddon in the 670s. This later work helps explain why an excavated plan is not a single original interior.',
      citations: [
        {
          source: 'nimrud-palace-project',
          locator: 'After Assurnasirpal: Esarhaddon and dismantling in the 670s BC',
        },
      ],
    },
    {
      year: -612,
      label: '612 BCE in the project account',
      title: 'Sack and institutional rupture',
      text: 'The project account places the sack of Kalhu in 612 BCE after continued use of palace offices and stores. This endpoint concerns the selected palace context; it does not claim all later settlement disappeared.',
      citations: [
        {
          source: 'nimrud-palace-project',
          locator: 'After Assurnasirpal',
        },
        {
          source: 'nimrud',
          locator: 'Empire’s fall and later history',
        },
      ],
    },
  ],
};

export function applyNimrudInstitutions(c: Corpus) {
  for (const source of sources) c.sources.push(source);
  const nimrud = c.sources.find((source) => source.id === 'nimrud')!;
  nimrud.accessed = '2026-10-29';
  nimrud.published = '2016-11';
  nimrud.scope =
    'Named Met essay main body and contributor/citation block read again: Northwest Palace, local gypsum/relief production, protective imagery and Standard Inscription, ninth/eighth-century capital and later capital/occupation history. Its citation block gives November 2016, correcting inherited 2016-04 metadata. Royal claims and likely magical/protective functions remain interpretations. Further-reading books and current site damage were not independently surveyed.';
  const court = c.sources.find((source) => source.id === 'assyrian-court')!;
  court.accessed = '2026-10-29';
  court.published = '2016-12; updated 2022-01';
  court.scope =
    'Named Met essay main body and contributor/citation metadata read again: Gallery 401 combines material from different rooms; mud brick/local gypsum, quarrying, transport, carving/paint, protective figures, throne-room contrast and original gateways. Citation block gives December 2016, updated January 2022, correcting inherited 2022-10 metadata. The almost 70,000 banquet claim is explicitly probably exaggerated; no literal census adopted. Gallery tiles/roof/display are not an untouched ancient room; further-reading volumes not consulted.';
  const panel = c.sources.find((source) => source.id === 'met-322614')!;
  panel.accessed = '2026-10-29';
  panel.scope =
    'Parent source consultation renewed official Description, Artwork Details and Public Domain/Open Access statement on 29 October 2026 after earlier direct 429/tool failures. Accession 32.143.7, ca. 883–859 BCE, gypsum alabaster, Nimrud Northwest Palace, Rockefeller 1932; eagle-headed figure facing left, bucket and cone whose exact nature is uncertain, proposed purification/protection, and Standard Inscription context. Existing local full image separately visually inspected. No fresh panel transcription, definite cone material/function or exact original doorway inferred. Prior access gaps remain documented in the output-only research packet.';
  c.contexts = [...(c.contexts ?? []), context];
  const s = c.subjects.find((subject) => subject.id === 'nimrud-palace')!;
  s.contextIds = [...(s.contextIds ?? []), context.id];
  s.summary =
    'At Kalhu, now Nimrud, making a royal palace joined skilled material work, protective imagery and claims about conquest and settlement. A later archive also preserves administrative commands concerning captives. These different sources explain how royal institutions represented power and sought practical results, while keeping the people subjected to those decisions distinct from the official voices that survive.';
  s.sections = [
    {
      title: 'Making a royal centre',
      text: 'Ashurnasirpal II made Kalhu, now Nimrud, a royal capital during his reign of 883–859 BCE. His Northwest Palace gathered rooms and courtyards into a setting for royal business, ceremony and residence. Building such a place joined materials and skilled work: mud brick formed its walls, while large slabs of local gypsum lined selected interiors. Quarrying, moving, carving and painting those slabs made authority into a substantial environment that people could enter.',
      citations: [
        {
          source: 'nimrud',
          locator: 'Northwest Palace and stone reliefs',
        },
        {
          source: 'assyrian-court',
          locator:
            'Making the palace: mud brick, local gypsum, quarrying, transport, carving and paint',
        },
      ],
    },
    {
      title: 'Protection around the ruler',
      text: 'The surviving panel shows a bird-headed winged figure wearing patterned clothing and holding a bucket. The museum interprets such figures as protective beings. Doorways and rooms made their placement consequential: protection and royal power were presented together as people moved through the building. The throne room also carried scenes of warfare and hunting, while protective imagery appeared widely elsewhere. The palace therefore offered more than a record of events; its makers arranged a particular account of power.',
      citations: [
        {
          source: 'met-322614',
          locator:
            '32.143.7: Description, Artwork Details and inspected local full image',
        },
        {
          source: 'assyrian-court',
          locator: 'Protective figures, throne-room imagery and doorways',
        },
      ],
    },
    {
      title: 'The king claims a city',
      text: 'Writing ran across many reliefs. In the recurring Standard Inscription, the king named divine supporters, victories and palace materials. He also claimed to have rebuilt Kalhu and settled there people taken from conquered territories. That passage connects the splendid building programme to coercive movement of people. It supplies the ruler’s account of settlement, rather than the voices of those moved. Neither a carved figure nor this text identifies the legal status of every quarry worker, carver or palace servant.',
      citations: [
        {
          source: 'nimrud-standard-inscription',
          locator: 'Q004477, lines 1–5a, 14b–17a and 17b–22',
        },
      ],
    },
    {
      title: 'Keeping the institution working',
      text: 'The palace was also a place of storage, preparation and administration. Excavated rooms and finds help researchers identify these practical activities: Room ZZ contained an oven and cooking vessels, while other areas held stores and archives. These remains come from a building used and altered over generations. Their dates matter. A plan can locate rooms and show relationships between them, but a composite excavated plan cannot make every room or activity contemporary with Ashurnasirpal.',
      citations: [
        {
          source: 'nimrud-palace-project',
          locator:
            'Managing the palace; Behind the scenes, Room ZZ; After Assurnasirpal; Image 1 composite palace plan',
        },
      ],
    },
    {
      title: 'Another official voice survives',
      text: 'A later letter from the palace archive, assigned by its editors to about 732 BCE, orders officials to provision captives and care for sick people among them. It reveals responsibilities and threats inside imperial administration. The order does not prove that its recipients complied. This eighth-century record expands the reference context without changing this case’s ninth-century dates. Reading wall, plan and letter together exposes different institutional purposes; none gives everyone governed by Assyria an equal voice.',
      citations: [
        {
          source: 'nimrud-captives-letter',
          locator:
            'SAA 19 006 / P224478, proposed date (732), obverse 1–15 and reverse 2′–13′; NW Palace Room ZT4 catalogue provenance',
        },
      ],
    },
  ];
  s.deeperReading = [
    {
      title: 'Read an arrangement, then ask about its date',
      text: 'A palace plan lets us ask how activities were placed in relation to one another. The published Northwest Palace drawing locates the throne room B, courtyards and southern service spaces. Robson’s account links Room ZZ with an oven and cooking vessels, and identifies northern areas with administration and storage. These functional readings combine architecture and finds; a room label is not an ancient sign naming its occupants. The drawing also includes later features. It should be read as a composite of excavated remains, with the north arrow and scale retained, rather than a snapshot of one reign. The modern museum arrangement creates another layer: gathering panels from different rooms helps visitors compare them, but changes their architectural relationships. That useful display should be distinguished from evidence of an intact ancient room.',
      citations: [
        {
          source: 'nimrud-palace-project',
          locator:
            'Image 1; Managing the palace; Encapsulating empire; Behind the scenes',
        },
        {
          source: 'assyrian-court',
          locator:
            'Gallery 401 combines panels from different original rooms; not full reconstruction',
        },
      ],
    },
    {
      title: 'An order is evidence of a system, not its successful outcome',
      text: 'The later letter names two officials and makes captives their responsibility. Its surviving text combines provision with a threat against neglect. That detail shows how the king sought to make subordinates answerable within a coercive institution. The words do not establish that food reached everyone, that sick people recovered or that those moved consented. Its damaged passages and the editors’ proposed date must travel with any excerpt. Comparing it with the Standard Inscription reveals a useful difference: a public royal claim celebrates achievement, while an administrative command seeks action. Both speak from positions of authority. People subjected to those decisions are present in their content, but their own accounts are absent from these selected sources.',
      citations: [
        {
          source: 'nimrud-captives-letter',
          locator:
            'SAA 19 006, obverse 1–15, reverse 2′–13′ and undated/proposed-date metadata',
        },
        {
          source: 'nimrud-standard-inscription',
          locator:
            'Q004477, royal titles and first-person claims, especially lines 14b–22',
        },
      ],
    },
  ];
  s.evidenceReading = {
    title: 'What different official sources can establish',
    introduction:
      'These editorial paraphrases distinguish visible detail, royal claims and administrative commands. They are not quotations. The later letter is separate from the selected ninth-century case.',
    items: [
      {
        label: 'A visible figure and an interpreted purpose',
        text: 'The selected photograph visibly preserves a bird head, wings, patterned garments, a bucket and a horizontal band of writing.',
        interpretation:
          'The Met places this figure within protective palace imagery. Its purpose follows from specialist interpretation and architectural context, not from a photograph alone. A learner can support a claim about deliberate visual detail, then identify which further claim requires the museum’s contextual explanation.',
        citations: [
          {
            source: 'met-322614',
            locator:
              '32.143.7: inspected full image; renewed Description and Artwork Details',
          },
          {
            source: 'assyrian-court',
            locator: 'Protective imagery and placement',
          },
        ],
      },
      {
        label: 'People in the king’s building claim',
        text: 'The edited Standard Inscription states that the ruler rebuilt Kalhu and settled conquered people there.',
        interpretation:
          'The claim makes forced relocation part of the king’s representation of a successful capital. It does not establish every relocated person’s task or status. The passage prevents a building account from treating resources and labor as if they arrived without political decisions or consequences for people.',
        citations: [
          {
            source: 'nimrud-standard-inscription',
            locator: 'Q004477, lines 14b–17a',
          },
        ],
      },
      {
        label: 'Commands and outcomes are different evidence',
        text: 'SAA 19 006 assigns responsibility for captives and threatens officials against neglect; its reverse also directs care of sick captives.',
        interpretation:
          'This is evidence of intended administration and compulsion, rather than proof that every instruction was fulfilled or that captivity was benign. Ask what a receipt, material distribution record or a captive’s account might add. Do not invent one of those missing sources.',
        citations: [
          {
            source: 'nimrud-captives-letter',
            locator: 'Catalogue; obverse 1–15; reverse 2′–13′',
          },
        ],
      },
      {
        label: 'A plan gathers different dates',
        text: 'The published plan identifies rooms and courtyards, but also includes later features from the palace’s long history. Its north arrow points near the upper edge and its printed scale runs 0–50 m.',
        interpretation:
          'Room positions and architectural relationships can be discussed without making every drawn feature contemporary. The source plan must retain its date/scale explanation and cannot be treated as a recovered route through one untouched room.',
        citations: [
          {
            source: 'nimrud-palace-project',
            locator:
              'Actual Image 1 pixels, caption and footnote 1; After Assurnasirpal',
          },
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What can the panel show?',
    duration: '10–15 minutes',
    steps: [
      'Find two details on the figure and the band of writing. Describe their shapes before deciding what they meant.',
      'Use one visible detail to explain how carefully the figure was made. Then use the supplied caption to make a separate claim about its protective purpose.',
      'Point to the visible evidence for your first claim. For the second, identify the museum explanation you needed. Explain why the picture alone cannot tell us whether people taken to Kalhu agreed to move.',
    ],
    explanation:
      'Accept different observed details. A supported answer separates a visible feature from a contextual interpretation; it need not guess the figure’s individual identity or translate its writing.',
  };
  s.dimensions['material-work'] = {
    text: 'Royal display depended on quarrying, transport, carving and paint, while the long-used palace also required storage and food preparation. These tasks do not establish one legal status for all workers.',
    citations: [
      {
        source: 'assyrian-court',
        locator: 'Palace materials and making',
      },
      {
        source: 'nimrud-palace-project',
        locator: 'Managing the palace; Behind the scenes, Room ZZ',
      },
    ],
  };
  s.review = {
    consultedOn: '2026-10-29',
    reviewer:
      'Codex selected-source consultation and internal author QA; not independent historian approval',
    scope:
      'Bounded main/deeper account, paired royal and administrative source interpretation, inspected local figure and composite source plan, concrete supplied-image inquiry and separate phased reference context. Full original case interval, original objects, coordinates, dimensions and existing claims preserved.',
    limitations: [
      'Selected project webpages and two online primary editions, not whole excavation books, every inscription exemplar, full SAA 19 volume or a complete archive. Q004477 is a composite scholarly edition, not a fresh transcription from Met 32.143.7.',
      'The captives letter is undated with proposed c.732 BCE placement, later than the selected reign. Orders, threats, consent and successful outcomes remain distinct; broken/restored passages are not treated as complete secure text. No universal slave status for all palace workers inferred.',
      'The small 460×926 palace plan is composite and includes later features. It is not a single 883–859 phase survey; internal room coordinates, exact visitor itineraries and newly recovered image detail are not supplied. The unmodified drawing carries CC BY-SA 3.0 attribution and a readable room/phase text equivalent; its original small labels remain small.',
      'Earlier direct Met catalogue access returned 429/tool failures; subsequent consultation renewed the official Description, Artwork Details and Public Domain statement. Source-access failures remain in dated research notes rather than being presented as successful earlier consultation.',
      'No newly inferred contact with Kerma or Taharqo, complete imperial history, independent historian review, real adult/family session, human screen-reader, physical-device or physical-print acceptance claimed.',
    ],
  };
}
