// Selected Maya vessel continuation with separately sourced household comparisons.
import type {
  Corpus,
  HistoricalContext,
  MediaAnnotation,
  PlaceStudy,
  Source,
} from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'maya-drinking-cup-2014',
    title: 'The Drinking Cup of a Classic Maya Noble',
    institution: 'The Metropolitan Museum of Art',
    author: 'James Doyle',
    url: 'https://www.metmuseum.org/perspectives/maya-drinking-cup',
    type: 'scholarship',
    published: '2014-09-25',
    accessed: '2026-10-29',
    scope:
      'Selected main text on the Primary Standard Sequence; accession 1992.4 ownership and text/image relationship; cacao-serving comparisons; Tabasco/Jonuta/Comalcalco argument and 1961/1964 publication history; captions to Figs.1–7. No linked Berlin paper, brick edition, Kerr database, 1961/1964 volume or full technical epigraphic study read. The current catalogue’s possible identification of the seated figure is retained over this essay’s more assertive wording. Shared dipping remains presumable; no residue assay for this specimen. Fig.5 rollout is explicitly ©Justin Kerr; Fig.2 drawing credited Diane Griffiths Peck and Figs.3/6 James Doyle are not covered by the collection photograph’s CC0 status. No article figure copied or traced; no new figure-pixel inspection claimed.',
  },
  {
    id: 'maya-painted-ceramics',
    title: 'Ancient Maya Painted Ceramics',
    institution: 'The Metropolitan Museum of Art',
    author: 'James Doyle',
    url: 'https://www.metmuseum.org/essays/ancient-maya-painted-ceramic',
    type: 'scholarship',
    published: '2017-04-01',
    accessed: '2026-10-29',
    scope:
      'Selected main essay paragraphs on hand-building, clay/temper/slip choices; c. 250–900 Classic-period ceramic/court context; food, patronage, diplomatic gifts and calligraphy; concluding ninth-century political-change convention. Contributor/citation metadata checked; bibliography and linked technical studies not read. These are broader ceramic contexts, not the selected cup’s measured fabric, firing recipe, workshop, named maker or documented gift event. Court sponsorship remains qualified; possible performance/poetry functions are not independently established. No universal simultaneous collapse or end of Maya peoples inferred. No source figure copied or blanket text/image CC0 assumed.',
  },
  {
    id: 'maya-ceren-households-2000',
    title:
      'Provisioning the Ceren Household: The vertical economy, village economy, and household economy in the southeastern Maya periphery',
    institution: 'Ancient Mesoamerica 11(2),pp. 217–230; Cambridge University Press',
    author: 'Payson Sheets',
    url: 'https://www.cambridge.org/core/journals/ancient-mesoamerica/article/abs/provisioning-the-ceren-household/2EB7D6F6216169EB16CCE318F6A833C5',
    type: 'archaeology',
    published: '2000-07',
    accessed: '2026-10-29',
    scope:
      'Complete exposed publisher abstract and author/issue/pages/DOI/copyright metadata; same abstract also read on CU Experts profile https://experts.colorado.edu/display/pubid_65274. DOI 10.1017/S0956536100112039; July 2000 issue is distinct from 7 February 2001 online posting. Abstract supports the author’s model of intrahousehold production, part-time village specialization/exchange and acquisition through elite centers. Full 14-page paper, detailed household inventories, chemical analyses, images and plans not read; Calgary PDF request returned 502. One southeastern-periphery village is not a universal Maya economic model or the selected cup’s findspot. ©2000 Cambridge University Press; no source figure copied.',
  },
  {
    id: 'maya-ceren-plants-2020',
    title:
      'Landscape management and polyculture in the ancient gardens and fields at Joya de Cerén, El Salvador',
    institution:
      'Journal of Anthropological Archaeology 59, article 101191; primary copy hosted by University of Colorado Boulder',
    author: 'Venicia Slotten; David Lentz; Payson Sheets',
    url: 'https://www.colorado.edu/anthropology/sites/default/files/attached-files/slotten_lentz_sheets_2020_ceren_polyculture.pdf',
    type: 'archaeology',
    published: '2020-09',
    accessed: '2026-10-29',
    scope:
      'Primary university-hosted PDF search-index text only: first-page title/authors, abstract, opening Introduction through recovery of plant remains and copyright footer. DOI 10.1016/j.jaa.2020.101191. Full web PDF open failed the 10,739,434-byte limit; publisher open 403 and eScholarship 429. No full methods/results, figures, tables, original calibration or local PDF download/render. Abstract uses c. 660 CE; opening Introduction attributes 592–660 CE (2 standard deviations, AA105791) to Slotten 2015 p. 72. That is a reported value, not a newly verified calibration. Gardens/outfields and varied plant remains concern this separate household site; they supply no Met-cup contents/findspot. First-page footer identifies CC BY-NC-ND 4.0; no source image or plan copied, altered or traced.',
  },
  {
    id: 'maya-ceren-unesco',
    title: 'Joya de Cerén Archaeological Site',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/675/',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      'Selected English Description, Brief Synthesis, Criteria (iii)/(iv), Integrity/Authenticity and location metadata under Dossier 675/Department of La Libertad: N 13 49 39 W 89 22 9. No nomination dossier, measured plan or source image consulted. Description uses c. AD 600 and OUV describes seventh-century preservation; the 2020 research abstract uses c. 660 CE. No silent reconciliation or adoption of older Ilopango chronology/current excavation counts. Preserved household context is a separate comparison, never an origin for 1992.4. Numeric location is a modern property/site reference rounded for orientation, not an excavation coordinate or route. English description displays CC BY-SA IGO 3.0; no blanket image/map licence applied.',
  },
  {
    id: 'maya-ik-painters-2012',
    title: 'Dancing into Dreams: Maya Vase Painting of the Ik’ Kingdom',
    institution: 'Princeton University Art Museum',
    author:
      'Exhibition curated by Bryan Just; separate webpage prose byline not identified',
    url: 'https://artmuseum.princeton.edu/exhibitions-events/exhibitions/dancing-dreams-maya-vase-painting-ik-kingdom',
    type: 'scholarship',
    published: '2012–2013 exhibition',
    accessed: '2026-10-29',
    scope:
      'Selected exhibition description, curator credit and opening caption for dish y1993-19: attributed to Mo?-n Buluch Laj, patron Yajawte’ K’ihnich, c. 755, Ik’a/Motul de San José or vicinity. Exhibition dates 29 September 2012–17 February 2013 are modern, not object dates. No exhibition catalogue, full inscription edition or image pixels read. Specific attributed maker/patron and signed-vessel discussion are comparisons; neither identifies the selected cup’s maker, court, polity or workshop. Preserve uncertainty and vicinity. No open image licence established, and no source image downloaded or reused.',
  },
];

const context: HistoricalContext = {
  id: 'maya-courts-households-context',
  title: 'Classic Maya courts, makers and households',
  region: 'Americas',
  interval: {
    start: 250,
    end: 900,
    label: 'Selected Classic-period orientation, c. 250–900 CE',
    precision: 'approximate',
    note: 'Follows Doyle’s broad Classic-period ceramic/courtly frame across varied communities, not one state or the lifespan of Maya peoples. The selected cup keeps its entire 600–800 CE case. Cerén and Ik’ are separately sourced comparisons; neither supplies this cup’s findspot, workshop or recovered route.',
  },
  summary:
    'Potters, artists, patrons and households connected made objects with food, representation and exchange. A named owner’s cup and separately documented household and painter contexts reveal different scales of that work.',
  subjectIds: ['maya-vessel'],
  citations: [
    {
      source: 'maya-painted-ceramics',
      locator:
        'Classic Period, c. 250–900 paragraph; production and diplomatic-gift paragraphs',
    },
    {
      source: 'maya-ceren-households-2000',
      locator: 'Exposed publisher abstract',
    },
  ],
  phases: [
    {
      year: 250,
      label: 'Around 250 CE: beginning of the selected source frame',
      title: 'A broader ceramic and courtly orientation',
      text: 'Doyle describes the Classic period approximately 250–900 CE, with artists developing varied painted vessels and possible royal sponsorship. This is a scholarly orientation, not a founding date or proof that all makers worked for courts.',
      citations: [
        {
          source: 'maya-painted-ceramics',
          locator: 'Classic Period paragraph',
        },
      ],
    },
    {
      year: 600,
      label: '600–800 CE: the selected catalogue object range',
      title: 'A cup with its own date and ownership reading',
      text: 'The museum assigns this vessel to the seventh–eighth centuries. Its ownership text and imagery support a specific elite-object inquiry, while maker, exact production year and polity remain unidentified in the consulted record.',
      citations: [
        {
          source: 'met-316711',
          locator: 'Artwork Details; Description ownership and polity paragraphs',
        },
      ],
    },
    {
      year: 660,
      label: 'A separate Cerén context: c. 600 in UNESCO; c. 660 in 2020 abstract',
      title: 'Household work preserved by volcanic burial',
      text: 'UNESCO’s Description dates burial approximately 600 CE and its synthesis describes seventh-century preservation; the 2020 botanical abstract uses approximately 660 CE. These source conventions remain distinct. Preserved domestic materials support a separate farming and provisioning comparison, not a findspot for the cup.',
      citations: [
        {
          source: 'maya-ceren-unesco',
          locator: 'English Description; Brief Synthesis',
        },
        {
          source: 'maya-ceren-plants-2020',
          locator: 'Primary abstract',
        },
      ],
    },
    {
      year: 755,
      label: 'Around 755 CE: a separate Ik’ dish attribution',
      title: 'A named patron and an attributed painter',
      text: 'The Princeton exhibition caption attributes dish y1993-19 to Mo?-n Buluch Laj and names patron Yajawte’ K’ihnich. The place is Ik’a/Motul de San José or vicinity. This source-qualified comparison does not identify the selected cup’s maker or court.',
      citations: [
        {
          source: 'maya-ik-painters-2012',
          locator: 'Opening caption, y1993-19',
        },
      ],
    },
    {
      year: 900,
      label: 'Around 900 CE: end of the selected Classic frame',
      title: 'An orientation ends; Maya peoples continue',
      text: 'The reference ends with Doyle’s selected Classic-period frame. It does not make regional political changes simultaneous, terminate all ceramic practices or end the history of Maya peoples. Modern publications, acquisition and photography belong outside these ancient phases.',
      citations: [
        {
          source: 'maya-painted-ceramics',
          locator: 'Classic-period frame and concluding political-change convention',
        },
      ],
    },
  ],
};

/** Modern observation targets on the unchanged 1369×1600 Met photograph. */
export const mayaAnnotationDraft: MediaAnnotation[] = [
  {
    id: 'incised-blocks',
    label: 'Inscribed forms',
    x: 0.274,
    y: 0.407,
    text: 'Block-like forms sit beside the figure. The ownership reading comes from the museum’s decipherment; a visible sign is not itself a translated word.',
    citations: [
      {
        source: 'met-316711',
        locator:
          'Description ownership/text-image paragraphs; existing main photograph, left side',
      },
    ],
  },
  {
    id: 'figure-and-text',
    label: 'Figure and text meet',
    x: 0.35,
    y: 0.569,
    text: 'The figure’s outlined arm meets the group of signs. The museum interprets an overlap between image and text; the photograph alone does not identify the owner’s polity.',
    citations: [
      {
        source: 'met-316711',
        locator:
          'Description text-image discussion and polity paragraph; existing main photograph',
      },
    ],
  },
  {
    id: 'rim-traces',
    label: 'Colour near the rim',
    x: 0.458,
    y: 0.169,
    text: 'Pale and bluish traces remain near the upper rim. The catalogue proposes a painted-stucco finish; this observation adds no new pigment analysis or restoration.',
    citations: [
      {
        source: 'met-316711',
        locator:
          'Description final-ornamentation paragraph; existing main photograph, upper band',
      },
    ],
  },
];

/** Separate household comparison; never a recovered origin or route for the cup. */
export const mayaPlaceStudy: PlaceStudy = {
  title: 'Cerén: a separate household comparison',
  description:
    'The single point is a modern UNESCO site reference in El Salvador, rounded to 0.001 degree. It locates the excavated household comparison, never the cup’s origin or a direct journey from its proposed Tabasco association. The original broad cup locator remains unchanged.',
  bounds: [-90, 13.3, -88.8, 14.4],
  points: [
    {
      id: 'maya-ceren-comparison',
      label: 'Joya de Cerén: household comparison',
      coordinates: [-89.369, 13.828],
      text: 'Published UNESCO reference N 13 49 39 W 89 22 9, arithmetically converted and rounded for orientation. This separately excavated village supplies household evidence; no Met-vessel findspot, workshop or route is implied.',
      citations: [
        {
          source: 'maya-ceren-unesco',
          locator: 'Dossier 675 location metadata, Department of La Libertad',
        },
      ],
    },
  ],
  features: [],
};

export function applyPlacesMaya(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'maya-vessel');
  if (!s) throw new Error('Maya continuation requires the existing maya-vessel case');
  const catalogue = c.sources.find((row) => row.id === 'met-316711');
  if (!catalogue) throw new Error('Maya continuation requires Met 316711');
  const marker = 'Maya selected renewal, 2026-10-29:';
  if (!catalogue.scope.includes(marker)) {
    catalogue.scope = `Prior consultation, ${catalogue.accessed} (retained): ${catalogue.scope} ${marker} Visible Description through the 1961/1964 publication-history paragraphs, byline, Artwork Details and Public Domain statement for accession 1992.4. The Provenance heading appeared but complete tab contents were not supplied; no comprehensive renewed custody-chain consultation. Baje(?) and Kaan (or Chan) Took’ remain uncertain, the seated figure is only possibly the owner, and no polity is named. The proposed Tabasco association uses a similar Comalcalco name and Jonuta ceramic comparisons, not a newly established excavation. Cacao use/dipping is comparative interpretation, not a residue result. Original 1369×1600 local image pixels actually inspected and bytes retained; no new remote-image parity or photography-date verification. Met eligible-image CC0 policy read separately; copyrighted article rollouts/drawings not reused.`;
  }
  catalogue.accessed = consulted;
  for (const source of sources) {
    const index = c.sources.findIndex((row) => row.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  c.contexts = [...(c.contexts ?? []).filter((row) => row.id !== context.id), context];
  s.contextIds = [...new Set([...(s.contextIds ?? []), context.id])];
  s.summary =
    'A made container joined food, imagery and a named owner. Its courtly interpretation becomes more useful beside evidence for ceramic making, attributed painters and household provisioning elsewhere. Each source keeps its own date, place and limits.';
  s.sections = [
    sec(
      'A container joined several kinds of work',
      'This large ceramic cup brings making and representation together. Fine incised outlines run across its pale surface, while the catalogue proposes a painted-stucco finish near the rim. Doyle’s wider account describes Maya potters forming vessels by hand and choosing clay, additives and surfaces before firing. Such choices made containers durable and gave artists a working surface. They supply a production context for this cup, while its particular clay recipe, workshop and maker remain unrecorded.',
      cite(
        'met-316711',
        'Artwork Details; Description: incisions and rim ornamentation; existing photograph',
      ),
      cite('maya-painted-ceramics', 'Hand-building, clay/temper and slip paragraphs'),
    ),
    sec(
      'Naming a relationship',
      'The museum reads the short text as identifying a drinking cup belonging to Baje(?) Kaan, or Chan, Took’, a ruler or noble. Part of that reading remains uncertain. It makes ownership a visible social relationship: a named person could be connected with a container used for serving and display. The figure and signs also share the same composition. The catalogue considers it possible that the seated figure represents the named owner; the text supplies no polity.',
      cite(
        'met-316711',
        'Description: ownership text; text-image relationship; polity paragraph',
      ),
    ),
    sec(
      'Food, display and exchange',
      'Doyle relates the cup’s form to cacao preparation scenes on other vessels, where pouring makes froth. Shared dipping is a proposed reconstruction of use. The museum reads imagery of agricultural fertility as connecting the represented ruler with food and renewal. In the wider Classic-period account, finely made vessels also served as diplomatic gifts between courts and governors. Their circulation could carry skilled work and messages about relationships, without establishing a particular gift event for this cup.',
      cite('met-316711', 'Description: cacao comparisons; agricultural imagery'),
      cite('maya-drinking-cup-2014', 'Cacao preparation and presumable shared dipping'),
      cite('maya-painted-ceramics', 'Diplomatic-gift paragraph'),
    ),
    sec(
      'Makers and patrons can enter the record',
      'Some other vessels allow the maker-patron relationship to be studied more closely. Princeton’s account attributes an Ik’ dish around 755 CE to Mo?-n Buluch Laj and names Yajawte’ K’ihnich as patron. It also describes signed cups from that courtly setting. These records make skilled people visible beside their patrons. They do not supply a maker for the selected vessel or prove that its owner made it.',
      cite(
        'maya-ik-painters-2012',
        'Opening caption, y1993-19; exhibition description',
      ),
    ),
    sec(
      'Other households produced and exchanged',
      'A separate excavated village, Cerén in present-day El Salvador, brings households into view. Sheets describes people producing food and goods for their own use, making surplus through part-time specialties and exchanging products with neighbors or at elite centers. Groundstone tools, painted gourds and plant fibers enter that account. A later botanical study documents productive gardens and outfields. This evidence explains daily work beyond courtly imagery; it does not locate this museum cup at Cerén.',
      cite(
        'maya-ceren-households-2000',
        'Exposed publisher abstract: three provisioning domains',
      ),
      cite('maya-ceren-plants-2020', 'Exposed primary abstract: gardens and outfields'),
    ),
  ];
  s.deeperReading = [
    sec(
      'An argued origin is different from a findspot',
      'The Tabasco association rests on comparisons in the museum’s account: a similar name on a Comalcalco brick and incised cylinders described from Jonuta. The original brick edition and Berlin study were not consulted here. The cup’s appearance in Europe in 1961 and a Swiss collection notice in 1964 belong to its modern documentary history. Those notices neither record its excavation nor establish a complete ancient itinerary. The current provenance-tab text was not exposed.',
      cite(
        'met-316711',
        'Description: Comalcalco/Jonuta hypothesis and 1961/1964 publication history',
      ),
      cite('maya-drinking-cup-2014', 'Tabasco hypothesis; modern publication history'),
    ),
    sec(
      'Ownership, contents and making ask different questions',
      'Doyle explains that texts on other vessels can name their type, contents, owner or giver. This cup’s short ownership statement does not provide all those answers. An artist signature would address another relationship again. Distinguishing these statements keeps the named owner from becoming an invented maker and the broader cacao interpretation from becoming a translation of a word absent from the supplied ownership reading.',
      cite(
        'maya-drinking-cup-2014',
        'Primary Standard Sequence introduction; selected ownership text',
      ),
      cite('met-316711', 'Description: short ownership reading'),
    ),
    sec(
      'Preservation shapes the household comparison',
      'Cerén’s volcanic burial preserved domestic contexts unusually well. UNESCO’s Description uses approximately 600 CE, while the 2020 research abstract uses approximately 660 CE. These conventions remain attributed. The consulted research abstracts support a bounded household comparison, rather than a complete reconstruction of every residence or all Maya economies. A decorated courtly object and a preserved village make different work visible.',
      cite(
        'maya-ceren-unesco',
        'English Description; Brief Synthesis; Criteria (iii)/(iv)',
      ),
      cite('maya-ceren-plants-2020', 'Primary abstract; first-page introductory text'),
      cite('maya-ceren-households-2000', 'Exposed publisher abstract'),
    ),
  ];
  s.evidenceReading = {
    title: 'Ownership, contents and household context',
    introduction:
      'These supplied passages paraphrase the consulted sources. Visible outlines, a museum decipherment, a use interpretation and an excavated household comparison support different claims.',
    items: [
      {
        label: 'A deciphered ownership relationship',
        text: 'The museum reads a named person’s drinking cup, with part of the name uncertain, and says the inscription gives no polity. It considers the pictured figure possibly the owner.',
        interpretation:
          'The photograph supplies incised forms; the ownership reading depends on the museum’s epigraphic interpretation. Keep Baje(?) and Kaan/Chan alternatives. A named owner does not identify the maker or establish a complete court scene.',
        citations: [
          {
            source: 'met-316711',
            locator:
              'Description: ownership, text-image relationship and polity paragraphs',
          },
        ],
      },
      {
        label: 'Cacao use is argued by comparison',
        text: 'Doyle compares the vessel form with cacao preparation depicted on other cups, and describes shared dipping as presumable. The selected short ownership phrase does not itself identify cacao.',
        interpretation:
          'This is a curatorial interpretation connecting form, imagery and other scenes. No residue assay for this specimen was consulted. Do not turn a reconstructed serving practice into an observed event or copy the separately copyrighted rollout/drawings.',
        citations: [
          {
            source: 'maya-drinking-cup-2014',
            locator: 'Cacao comparison and presumable dipping paragraphs',
          },
          {
            source: 'met-316711',
            locator: 'Description: ownership phrase and proposed function',
          },
        ],
      },
      {
        label: 'Households supplied goods through several domains',
        text: 'Sheets’s Cerén abstract distinguishes production for household use, part-time surplus exchange with other households and acquisition of some goods through elite centers. The 2020 botanical abstract describes gardens and outfields.',
        interpretation:
          'These are source-qualified findings from a separately excavated village. They extend the inquiry to provisioning and exchange without locating this cup there or making all Maya households alike. Only exposed abstracts/selected first-page text were read.',
        citations: [
          {
            source: 'maya-ceren-households-2000',
            locator: 'Exposed publisher abstract',
          },
          {
            source: 'maya-ceren-plants-2020',
            locator: 'Primary abstract',
          },
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What can we see, and what must we read?',
    duration: '10–15 minutes',
    steps: [
      'Find one incised outline and a group of sign-like forms in the supplied photograph. Describe where each lies without translating a sign.',
      'Read the source capsule together. Choose one visible feature and one museum interpretation; explain the different evidence each uses.',
      'Make one supported claim about the cup using a feature or a source statement. Name a question about makers or household food work that this cup cannot answer alone.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the museum reads this as a named person’s drinking cup, with part of the name uncertain, and says the text gives no polity. It interprets cacao use through comparisons. At separately excavated Cerén, households produced food and goods and exchanged some products; those finds do not locate this cup. Incised outlines can be observed, while ownership requires decipherment and contents require interpretation. A maker, exact findspot and every household’s menu remain unestablished.',
  };
  s.review = {
    consultedOn: '2026-10-29',
    reviewer:
      'Codex selected primary/institutional source consultation and internal author review; not independent historian, epigrapher or community approval',
    scope:
      'Selected ceramic, food and ownership account, separately sourced courts and households, three evidence readings, supplied family capsule, attributed reference phases and modern photograph observations. The entire original case interval, identity, claims, object IDs/order, image bytes and prior dimensions remain intact. The Cerén location is a separately sourced household comparison.',
    limitations: [
      'The Met catalogue and 2014/2017 museum texts are attributed interpretations. No new decipherment, named polity, maker, secure excavated origin, residue assay, measured ceramic recipe or workshop identified for 1992.4. The Comalcalco brick edition, Berlin paper, Kerr database and original epigraphic technical works were not consulted.',
      'Current complete provenance-tab text, conservation history, photograph creation date and remote-byte parity were not exposed or verified. Earlier 26 October source scope is retained rather than presented as comprehensively renewed. 1961/1964 documentation and 1992 acquisition belong outside ancient reference phases.',
      'Sheets 2000 was read at exposed abstract/metadata scope. Slotten/Lentz/Sheets 2020 was read through the primary PDF search-index abstract/first-page Introduction and rights footer; full PDF exceeded tool size, publisher 403 and eScholarship 429 were not bypassed. No full methods/results, figures, inventories or original calibration consulted.',
      'UNESCO c. 600 and 2020 abstract c. 660 conventions remain attributed; the first-page reported 592–660 interval is not a new calibration. Cerén is a separate comparison and a modern UNESCO reference point, never this cup’s findspot, route or a universal Maya household. Named/attributed Ik’ painter and patron belong to a different object and place.',
      'The existing collection photograph is eligible public-domain/CC0 imagery; the ©Justin Kerr rollout and separately credited article drawings are excluded. Modern observation markers are a separate editorial layer with their own credit, date and licence. They preserve the underlying photograph and do not supply a new decipherment, pigment analysis or reconstruction.',
      'Independent historian/epigrapher/community review, real family use, human screen-reader behavior, physical devices and physical print quality remain open.',
    ],
  };
  s.dimensions['place-work'] = {
    text: 'A drinking cup’s named owner and proposed courtly use differ from an excavated household’s provisioning evidence. Ceramic work, patronage and exchange can be compared across these contexts without turning a regional attribution into a findspot or assigning this cup a maker from another object.',
    citations: [
      {
        source: 'met-316711',
        locator: 'Description: ownership and regional hypothesis',
      },
      {
        source: 'maya-painted-ceramics',
        locator: 'Production and diplomatic-gift paragraphs',
      },
      {
        source: 'maya-ceren-households-2000',
        locator: 'Exposed publisher abstract',
      },
      {
        source: 'maya-ik-painters-2012',
        locator: 'Opening caption and exhibition description',
      },
    ],
  };
  s.dimensionKeys = [
    ...new Set([...(s.dimensionKeys ?? Object.keys(s.dimensions)), 'place-work']),
  ];
}
