import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'moche-production-2009',
    title: 'La producción especializada de la cerámica doméstica y ritual Mochica',
    author: 'Hélène Bernier',
    institution: 'Estudios Atacameños 37, pp. 157–178; Universidad Católica del Norte',
    url: 'https://www.scielo.cl/scielo.php?pid=S0718-10432009000100010&script=sci_arttext',
    type: 'archaeology',
    published: '2009',
    accessed: consulted,
    scope:
      'Selected Spanish publisher-repository HTML: Los Mochicas; archaeological workshop evidence; consumption, Cerámica utilitaria and Cerámica fina o ritual through the initial domestic-use discussion; Figure 2–10 captions and Tables 1–2; selected Producción afiliada o independiente paragraphs reread for the explicit limit on confirming independence. Figure pixels, the complete article, underlying excavation reports and cited experiments were not comprehensively consulted. Metadata, DOI and January 2009 acceptance support issue 37/2009; an inconsistent body banner says issue 36/2008. Southern political organization is the author’s model, not a universal Moche state. Fineware workshop partly excavated across three Moche IV floors; utilitarian production area identified from surface evidence, not excavated. Independent utilitarian production remains an interpretation that the text says cannot yet be conclusively demonstrated. No known workshop or findspot assigned to the selected Met vessels. English passages are editorial paraphrases. No reusable image/plan licence verified; no source image copied or traced.',
  },
  {
    id: 'moche-households-2009',
    title:
      'Domestic Life in and around the Urban Sector of the Huacas of Moche Site, Northern Peru',
    author: 'Claude Chapdelaine',
    institution:
      'In Manzanilla and Chapdelaine, eds., Domestic Life in Prehispanic Capitals, chapter 9, pp. 181–196; University of Michigan Museum of Anthropology, Memoir 46',
    url: 'https://www.iia.unam.mx/sites/default/files/archivos/MANL510125/2009_ManzanillaChapdelaine-DomesticLifePrehispanicCapitals.pdf',
    type: 'archaeology',
    published: '2009',
    accessed: consulted,
    scope:
      'Actual volume title/copyright/contents and selected chapter text, printed pp. 183–190: urban compounds, production, grinding/food supply, storage and exchange. Not the complete chapter/volume, original artifact database or linked excavation reports. Compound layout and artifact distributions support differently qualified interpretations; one compound need not represent one nuclear family. The exchange system remains poorly understood, and possible plaza exchange, brewing, corrals and particular worker arrangements are not established universal institutions. Local Phase IV frame is given as approximately 400/450–700/800 CE; continued occupation challenges an abrupt 600 CE abandonment. No population guess, exact production quota, invented route or market location adopted. Copyright 2009 Regents of the University of Michigan, all rights reserved; source plans/photos not copied or traced.',
  },
  {
    id: 'moche-regions-2012',
    title:
      'The multidimensional relations between the Wari and the Moche states of Northern Peru',
    author: 'Luis Jaime Castillo; Francesca Fernandini; Luis Muro',
    institution:
      'Boletín de Arqueología PUCP 16; Pontificia Universidad Católica del Perú',
    url: 'https://revistas.pucp.edu.pe/index.php/boletindearqueologia/en/article/view/9164/0',
    type: 'archaeology',
    published: '2012-07-01',
    accessed: consulted,
    scope:
      'Publisher abstract, author/date/licence metadata and actual canonical publisher PDF selected text, printed pp. 53–62, especially pp. 60–62 on political and ceramic variation. The /en/ PDF download timed out; the canonical download without /en/ was readable. Not the complete 25-page paper or underlying regional datasets. PDF pagination is 53–77; publisher citation instead gives 53–78. Publisher states CC BY 4.0 and a 2016 copyright line, distinct from the 2012 publication date. Intermittent valley coordination and opportunistic states are the authors’ interpretive model, not surveyed political borders. Their selected San José de Moro Late Moche frame is 700–800 CE. Figure 1 and Figure 5 captions credit the San José de Moro Archaeological Program; screenshot request returned cache miss, so actual figure pixels and separate credit details remain uninspected. No map/image reused or traced, and no contact or route assigned to either museum vessel.',
  },
  {
    id: 'moche-moro-2023',
    title:
      'Moche deathscapes: performance, politics, and the creation of myth in Huaca La Capilla–San José de Moro (AD 650–740)',
    author: 'Luis A. Muro Ynoñán',
    institution: 'Journal of Social Archaeology 23(3); SAGE',
    url: 'https://journals.sagepub.com/eprint/45I7EWCA9EHM7IXDJNFU/full',
    type: 'archaeology',
    published: '2023-06-29',
    accessed: consulted,
    scope:
      'Selected publisher HTML Abstract, Introduction and Death in the Moche world and San José de Moro, with exposed captions. Not the complete article, original excavation archive or cited theoretical/archaeological works. La Capilla’s 650–740 CE construction frame differs from the broader San José de Moro 650–850 CE elite cemetery/ceremonial frame. The paper also uses a broader general 200–900 CE Moche frame; neither replaces the retained 1–800 CE case. Architectural resemblance to a vessel scene is an interpretive argument, not direct proof that a depicted ceremony occurred exactly as drawn or was shared by every household. No figure pixels inspected or source illustration reused; no Creative Commons statement found in this selected scope.',
  },
];

const context: HistoricalContext = {
  id: 'moche-valleys-work-context',
  title: 'Moche regional societies: valleys, skilled work and changing coordination',
  region: 'Americas',
  interval: {
    start: 100,
    end: 850,
    label: 'c. 100–850 CE: selected object and regional histories',
    precision: 'approximate',
    note: 'A selected teaching frame, not the beginning/end of one Moche kingdom. The start orients the selected bottle’s broad second–fifth-century attribution; it is not an exact year of manufacture or cultural origin. The complete case remains 1–800 CE. Huacas de Moche Phase IV, La Capilla’s 650–740 frame and San José de Moro’s broader 650–850 frame retain separate scopes. Castillo and colleagues use 700–800 for their selected Late Moche discussion. The endpoint does not terminate every regional community.',
  },
  summary:
    'River valleys supported different Moche communities. Archaeological traces of making, domestic work and local coordination explain institutions that cannot be recovered from decorated vessels alone.',
  subjectIds: ['moche'],
  citations: [
    cite('moche', 'Opening geographic/production paragraphs'),
    cite('met-316721', 'Artwork Details: second–fifth-century attribution'),
    cite('moche-households-2009', 'Printed pp. 183–190: local sequence and work'),
    cite('moche-regions-2012', 'Printed pp. 53–62: regional variation'),
    cite('moche-moro-2023', 'Abstract; Death in the Moche world and San José de Moro'),
  ],
  phases: [
    {
      year: 100,
      label: 'Second–fifth centuries CE: the selected snake bottle’s broad date',
      title: 'A vessel has its own horizon',
      text: 'The museum attributes the snake bottle to the second–fifth centuries. This broad object range supplies the beginning of our selected orientation, not a founding event. Its regional attribution is Moche, but the catalogue does not identify an excavated valley or workshop. The seated figure retains a separate 200–500 CE range.',
      citations: [
        cite('met-316721', 'Artwork Details: Date and Geography'),
        cite('met-307474', 'Artwork Details: Date and Geography'),
      ],
    },
    {
      year: 450,
      label: 'c. 400/450–700/800 CE: Chapdelaine’s local Phase IV frame',
      title: 'Compounds join production and domestic work',
      text: 'Chapdelaine describes the later Huacas de Moche occupations through a broad local Phase IV frame. Compounds, workshops and grinding/storage evidence reveal practical urban activities. His continued occupation sequence challenges a rapid abandonment around 600 CE. This local ceramic chronology does not supply a universal sequence for every northern valley.',
      citations: [cite('moche-households-2009', 'Printed pp. 183, 185, 187–190')],
    },
    {
      year: 650,
      label: '650–740 CE at La Capilla; 650–850 at the wider ceremonial center',
      title: 'A northern place has a different sequence',
      text: 'In the Jequetepeque region, Muro Ynoñán examines La Capilla’s changing monumental spaces within San José de Moro. His building frame is narrower than the site’s broader elite cemetery and ceremonial history. These independently dated northern contexts cannot be assigned to the selected museum bottles merely because all are called Moche.',
      citations: [
        cite(
          'moche-moro-2023',
          'Abstract; Death in the Moche world and San José de Moro',
        ),
      ],
    },
    {
      year: 800,
      label: 'Around 800–850 CE: compare the sources’ selected endpoints',
      title: 'Regional change does not end on one date',
      text: 'Castillo and colleagues discuss a selected San José de Moro Late Moche frame of 700–800 CE; Muro uses a broader 650–850 ceremonial frame. Read those conventions beside the retained case’s 800 CE endpoint. They organize different evidence and questions, rather than demonstrating one simultaneous collapse across the north coast.',
      citations: [
        cite('moche-regions-2012', 'Printed pp. 53–54: selected local frames'),
        cite('moche-moro-2023', 'Death in the Moche world and San José de Moro'),
      ],
    },
  ],
};

export function applyImagesWorkMoche(c: Corpus): void {
  for (const source of sources) {
    const index = c.sources.findIndex((existing) => existing.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  const essay = c.sources.find((source) => source.id === 'moche')!;
  essay.accessed = consulted;
  essay.scope =
    'Main body read again from the geographic/labor opening through production, imagery and domestic/funerary-use paragraphs. Hélène Bernier, 1 August 2009. This institutional essay synthesizes specialized production, mold-making, wear/repair and residential uses; its linked Donnan books and underlying excavation reports were not read. A depicted scene is not automatically a record of everyday practice. No claim that either selected museum bottle has a known excavated household or workshop.';
  const snake = c.sources.find((source) => source.id === 'met-316721')!;
  snake.accessed = consulted;
  snake.scope =
    'Description, Artwork Details and Public Domain/Open Access statement read again for accession 1992.60.9: second–fifth century, ceramic, Peru/Moche attribution and 1992 Landmann gift. Existing local photograph pixels inspected unchanged: modeled serpent, painted circles and arched spout. Proposed mythological identity, possible handle and renewal symbolism remain qualified interpretations. No specific excavated findspot, workshop, named maker or original use established. Provenance-tab custody content was not exposed; public API unavailable and current main-image request did not establish raw-original byte parity. No linked book or new archival provenance research claimed.';
  const figure = c.sources.find((source) => source.id === 'met-307474')!;
  figure.accessed = consulted;
  figure.scope =
    'Description, Artwork Details and Public Domain/Open Access statement read again for accession 82.1.30: 200–500 CE, Moche artist(s), ceramic, Peru and 1882 Marquand gift. Existing local photograph pixels inspected unchanged: seated figure, animal-fronted headdress, ornaments and stirrup-spout form. Rank/profession, former inlays and evaporation function remain suggestions, not demonstrated identity/use. No excavated valley or workshop supplied. Provenance-tab custody content was not exposed; public API unavailable and linked current image request timed out. No raw-original image parity or linked publication consultation claimed.';
  c.contexts = [
    ...(c.contexts ?? []).filter((existing) => existing.id !== context.id),
    context,
  ];
  const s = c.subjects.find((subject) => subject.id === 'moche')!;
  s.contextIds = [...new Set([...(s.contextIds ?? []), context.id])];
  s.summary =
    'Moche vessels preserve skilled shaping and powerful imagery, while excavated compounds reveal making, cooking, storage and social gatherings. Different river valleys followed changing political histories. Compare the two museum bottles with workshop and household evidence to investigate how people supplied practical needs and presented identities, without turning an image into a complete account of society.';
  s.sections = [
    sec(
      'River valleys, different communities',
      'On Peru’s northern desert coast, rivers descending from the Andes made irrigated farming possible. Communities supplied food and materials while skilled makers produced pottery, textiles and metalwork. Shared imagery connects many places called Moche, but it does not identify one permanent kingdom. Research distinguishes the southern Moche and Chicama valleys from northern Piura, Lambayeque and Jequetepeque histories, with differences within individual valleys. In Jequetepeque, Castillo and colleagues argue that local groups sometimes joined for regional rituals and irrigation administration, then separated again. Coordinating water and ceremonies could bring people together without placing every community under one enduring capital. This is an interpretation of local evidence, rather than a recovered constitutional document.',
      cite('moche', 'Opening geographic, specialization and labor paragraphs'),
      cite(
        'moche-regions-2012',
        'Printed pp. 60–62: local polities and intermittent coordination',
      ),
    ),
    sec(
      'Making more than decorated bottles',
      'At Huacas de Moche, archaeologists identified specialized production through tools, molds, unfired pieces, firing remains and damaged products. A partially excavated fineware workshop occupied several successive floors. Its makers prepared clay, formed and decorated objects, dried them and fired them. A separate utilitarian production area was recognized from surface remains and had not been excavated in the consulted study. Cooking pots and large storage jars met repeated practical demands, while finer vessels carried modeled or painted designs. These different products required knowledge of materials and techniques. The assemblages show making at this site; they do not identify the workshops of the two museum bottles.',
      cite(
        'moche-production-2009',
        'Talleres de producción; Cerámica utilitaria; Figures 2–5 captions',
      ),
    ),
    sec(
      'Household work sustained the city',
      'Urban compounds joined living, making, storage and gathering. Grinding stones show food processing, while rooms and jars supplied places to keep materials. Chapdelaine interprets the city’s food supply through relationships with nearby farming and fishing communities; its exchange arrangements remain incompletely understood. A compound could contain several activities and need not equal one nuclear family. Decorated vessels also occur in residential settings. Wear and repairs on some vessels found in graves indicate earlier use. Making, maintaining and using pottery therefore connected practical needs with household meetings, feasts and displays of identity, rather than serving only burial ceremonies.',
      cite(
        'moche-households-2009',
        'Printed pp. 185, 187–190: compounds, processing and supply',
      ),
      cite(
        'moche',
        'Residential discoveries, wear/repair and household-use paragraphs',
      ),
    ),
    sec(
      'Look closely at the selected bottles',
      'The snake bottle combines a raised serpent with painted circles and an arched spout. Its head has features unlike an ordinary snake. The Met proposes a mythological creature while leaving the imagery’s meaning uncertain. The seated figure bottle combines a human body, ornaments and an animal-fronted headdress with the container. The museum suggests rank or profession, without identifying a named individual. Both objects make technical and imaginative choices visible. Their broad dates and Peru/Moche attributions remain distinct; neither catalogue supplies an excavated findspot. Visible form starts a question, while archaeological context is needed to test who made, used or understood it.',
      cite('met-316721', 'Description and Artwork Details'),
      cite('met-307474', 'Description and Artwork Details'),
    ),
  ];
  s.deeperReading = [
    sec(
      'What would establish an exchange system?',
      'Grinding tools, storage spaces and manufactured objects help reconstruct work, but they do not reveal every transaction. Chapdelaine discusses exchange in small plazas as a possibility, while stressing that the wider system remained poorly understood. Food and raw materials linked urban consumers with producers elsewhere; deciding whether particular goods were tribute, gifts or negotiated exchanges requires further contextual evidence. Likewise, different products need not imply identical working arrangements. Bernier’s suggested independence of utilitarian potters was not conclusively established in the consulted study.',
      cite(
        'moche-households-2009',
        'Printed pp. 187–190: supply, storage and exchange hypotheses',
      ),
      cite(
        'moche-production-2009',
        'Utilitarian production discussion: limits on confirming independence',
      ),
    ),
    sec(
      'A region is more than a pottery style',
      'Castillo and colleagues question the use of one ceramic sequence as the history of all Moche communities. Northern valleys and places within Jequetepeque differed in political organization and relationships with outsiders. Their model of intermittent coordination explains how local groups could cooperate without remaining one centralized state. It also directs attention to whose evidence survives: elite tombs can make certain relationships especially visible. A shared design does not by itself establish a common ruler, an identical household economy or the route taken by a particular vessel.',
      cite(
        'moche-regions-2012',
        'Printed pp. 53–62, especially regional/ceramic variation on pp. 60–62',
      ),
    ),
    sec(
      'An architectural resemblance is an argument',
      'At La Capilla within San José de Moro, Muro Ynoñán compares monumental spaces with architecture represented in a Moche vessel scene. He interprets their resemblance through performances associated with elite funerals. The comparison is valuable because it brings imagery into conversation with excavated places. It remains an argument: resemblance cannot turn the image into an eyewitness record, prove every action occurred as shown, or describe the beliefs of every family. The building and wider ceremonial center also retain different date ranges.',
      cite(
        'moche-moro-2023',
        'Abstract, Introduction; Death in the Moche world and San José de Moro',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'From a vessel’s appearance to evidence of work and coordination',
    introduction:
      'The source passages below are editorial paraphrases. Catalogue interpretations, excavated traces and arguments about political organization have different evidential roles.',
    items: [
      {
        label: 'A catalogue preserves uncertainty',
        text: 'The Met describes feline-like features on the snake bottle and proposes a mythological creature, while leaving the meaning of snake imagery unclear. Its seated-figure catalogue suggests a headdress associated with rank or profession.',
        interpretation:
          'These readings distinguish visible features from proposed meanings. Neither object alone identifies a ruler, a particular performance, its original household or its place of manufacture. Keep both catalogue ranges and the absent excavated findspots visible when comparing them.',
        citations: [
          cite(
            'met-316721',
            'Description: proposed creature and uncertain meaning; Artwork Details',
          ),
          cite('met-307474', 'Description: headdress interpretation; Artwork Details'),
        ],
      },
      {
        label: 'Making leaves a different collection of traces',
        text: 'Bernier reports molds, tools, unfired or failed objects and firing evidence at Huacas de Moche. The fineware workshop was partially excavated; the utilitarian production area was recognized from surface remains.',
        interpretation:
          'The combination supports on-site manufacture more strongly than a finished vessel alone. Excavated and surface contexts carry different limits. This evidence neither assigns the museum bottles to these workshops nor establishes every potter’s status or payment.',
        citations: [
          cite(
            'moche-production-2009',
            'Datos arqueológicos en Huacas de Moche: Talleres de producción',
          ),
        ],
      },
      {
        label: 'Valley coordination is a model to examine',
        text: 'Castillo and colleagues argue that Jequetepeque contained varied local polities, with larger coordination recurring around regional rituals and irrigation administration rather than one permanent valley-wide government.',
        interpretation:
          'The argument explains a mechanism for cooperation while allowing political change and local differences. It is not a contemporary administrative register or a surveyed boundary. Household and workshop evidence from Huacas de Moche should not silently become evidence for every northern community.',
        citations: [
          cite(
            'moche-regions-2012',
            'Printed pp. 60–62: political variation and intermittent coordination',
          ),
          cite(
            'moche-households-2009',
            'Printed pp. 185, 187–190: selected site-specific domestic evidence',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What can we see, and what needs another source?',
    duration: '10–15 minutes',
    steps: [
      'Open the snake bottle and the seated figure. Find one shaped detail and one painted or surface detail; describe each before giving it a meaning.',
      'Use the capsule to sort three claims: a potter worked at Huacas de Moche; this snake represents renewal; all Moche valleys shared one ruler. Which has material support, which is a suggestion, and which goes beyond these sources?',
      'Point to the arched spout on each photograph. Explain why sharing a vessel form cannot tell us that both came from one workshop.',
      'Make one claim about pottery work using the photos and capsule. Propose a further find that could strengthen it, and explain one question your claim still leaves open.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the Met suggests a mythological snake and offers renewal as a possible meaning, while leaving the imagery uncertain. At Huacas de Moche, combinations of molds, tools, unfired/failed pieces and firing remains support pottery manufacture; they do not locate either museum bottle’s workshop. The regional study argues for different local polities and intermittent cooperation. The photos show choices of shape and surface; they do not establish one ruler or a maker’s identity. Renewal is a suggestion, production has material support at the excavated site, and one ruler for every valley is not supported here.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian approval',
    scope:
      'Layered main/deeper reading, three consequential evidence readings, supplied family capsule and separately dated regional reference. Complete original 1–800 CE case, identity, coordinates, packs, original object order, claims and prior comparison text retained. Only the three actually reread inherited sources receive renewed access dates.',
    limitations: [
      'Selected texts only: Bernier workshop/consumption and selected production-affiliation passages, Chapdelaine printed pp. 183–190, regional paper pp. 53–62 and Muro abstract/introduction/local context. Complete books, excavation archives, artifact datasets and linked bibliographies were not read.',
      'Local ceramic and ceremonial frames differ; no single Moche founding/collapse date, universal kingdom, known market/payment system or every household’s beliefs inferred. The selected pots retain broad dates and no stated excavated findspots or workshops.',
      'Existing photo pixels and visible catalogue descriptions/details/rights were renewed; full provenance tabs, public API and raw-original image-byte parity were unavailable. No source plan/image copied or traced, no new numeric locator accepted and no political border or route invented.',
      'Source-specific dating and access qualifications remain in the citations and source records. No independent historian, real family, human screen-reader, physical-device or physical-print acceptance claimed.',
    ],
  };
  s.terms = [...new Set([...s.terms, 'archaeology', 'provisioning', 'ritual'])];
  s.dimensions['material-work'] = {
    text: 'Specialized pottery production met practical and social demands at Huacas de Moche. Workshop debris, grinding tools and storage reveal different tasks, while the organization of exchange and individual labor remains incompletely known.',
    citations: [
      cite(
        'moche-production-2009',
        'Workshop evidence; utilitarian and fineware consumption',
      ),
      cite(
        'moche-households-2009',
        'Printed pp. 185, 187–190: domestic work, supply and exchange',
      ),
    ],
  };
  s.dimensionKeys = [
    ...new Set([...(s.dimensionKeys ?? Object.keys(s.dimensions)), 'material-work']),
  ];
}
