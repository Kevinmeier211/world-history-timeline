import type { Corpus, HistoricalContext, Source, Subject } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'ottoman-musli-lamp',
    title: 'Mosque-lamp: British Museum 1887,0516.1',
    institution: 'The British Museum, Islamic Gallery',
    url: 'https://islamicworld.britishmuseum.org/collection/RRM10384/',
    type: 'catalogue',
    accessed: consulted,
    scope:
      'Description, object number/date/place/material/technique, acquisition and Curator’s comments, including the supplied inscription translation, read. Undated living record. AH 956/1549 and the name Musli belong to this separate lamp; the translation identifies a painter/decorator, not the maker of the selected Met dish. No independent inscription transcription, complete lamp biography, route, payroll or cited Carswell/Atasoy–Raby volumes consulted. The canonical collection-object request returned 403; this readable British Museum gallery record is the consulted source. No lamp-image pixels inspected or figure-reuse licence established; no image or geometry copied.',
  },
  {
    id: 'ottoman-iznik-course',
    title: 'An Introduction to the Iznik industry',
    author: 'Mariam Rosser-Owen, credited course author',
    institution: 'Ashmolean Museum, University of Oxford',
    url: 'https://islamicceramics.ashmolean.org/Iznik/intro.htm',
    type: 'scholarship',
    published: '2000–2001 teaching course; individual chapter date unstated',
    accessed: consulted,
    scope:
      'B.1 short introduction and frontispiece author/copyright/inactive-course notice read. Frontispiece last updated 27 October 2001, not a new archaeological result. Covel’s 1670s market/material account is a mediated excerpt; original diary/edition not read. Resources and differing wares support practical explanation. Older kiln-form uncertainties, conquest shorthand, cultural rankings and a general decay story are not adopted as current comprehensive findings. B.5 selected text was also consulted but its attribution/design-transmission proposals are not used in this account. Contents link cache-missed; linked books and other chapters not read. Oxford/Ashmolean reserves copyright; no source image pixels or geometry copied/traced.',
  },
  {
    id: 'ottoman-kiln-residues-2025',
    title:
      'Some Tile Samples, Encountered in 17th Century Istanbul Architecture Among the Tile Finds Unearthed in the Iznik Tile Kilns Excavation',
    author: 'V. Belgin Demirsar Arlı; Hakan Arlı; Şennur Kaya',
    institution: 'Höyük 16, pp. 235–248; Türk Tarih Kurumu',
    url: 'https://www.hoyuk.gov.tr/eng/abstarct/138/eng',
    type: 'archaeology',
    published: '2025, issue 16; exact online day unverified',
    accessed: consulted,
    scope:
      'Complete English abstract, authors/affiliations, issue/pages, DOI 10.37879/hoyuk.2025.2.235 and article-specific CC BY-NC 4.0 notice read. Authors report kiln remains, firing supports, defective pieces and semi-finished tiles, comparing six tile finds with specified Istanbul buildings. These production associations do not identify the selected Met dish’s kiln, maker, buyer or route. Full-text/PDF links cache-missed; full fourteen-page Turkish article, context tables, illustrated finds, plans and bibliography not read. No current census of every kiln or worker adopted. Figure pixels and figure-specific third-party notices were not inspected, so the article licence is not presented as a cleared source-plan adoption.',
  },
  {
    id: 'ottoman-iznik-technology-2004',
    title: 'The production technology of Iznik pottery—a reassessment',
    author: 'S. Paynter; F. Okyar; S. Wolf; M. S. Tite',
    institution: 'Archaeometry 46(3), pp. 421–437; Wiley',
    url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1475-4754.2004.00166.x',
    type: 'archaeology',
    published: '2004-09-07',
    accessed: consulted,
    scope:
      'Complete exposed abstract, author/affiliation and issue/page/DOI metadata read. Current First published header displays 7 September 2004; no independent original-release archive check. DOI 10.1111/j.1475-4754.2004.00166.x. Microscopy/chemical analysis of samples and associated glass is supplemented by modern glaze replication. Body/glaze distinctions are sample-based results; the proposed opacity function remains suggested. No examination of this Met dish, universal recipe, exact firing schedule or every workshop’s supply inferred. Full-text link cache-missed; full seventeen-page methods/results/tables, figures and supplements not consulted. No open figure licence established or source figure/table copied.',
  },
];

const renewals: Record<string, string> = {
  'met-451490':
    'Selected renewal on 29 October: visible title/date ca.1575–90, description, Artwork Details object information, accession 59.69.1, Iznik attribution, medium/dimensions/credit, Public Domain label and complete exposed Overview: Iznik Ceramics transcript read. Other catalogue/provenance/history/reference tabs not consulted. Transcript superlatives and one-factory implications are not adopted as universal findings. Buyer, signature, original use occasion and photographic exposure date remain unknown. Existing local main/alternate images inspected and hashed unchanged; no new remote-byte parity established.',
  'met-449533':
    'Selected renewal on 29 October: visible title/date ca.1555–60, description of specialist drawing and selected illumination, Artwork Details object information, accession 38.149.1, Istanbul attribution, medium/dimensions/credit, Public Domain label and exposed children’s audio transcript read. Other catalogue/inscription/provenance/reference tabs and embedded videos not consulted. No new transcription from pixels or claim Süleyman drew the emblem himself. Native local image inspected/hashed unchanged; exposure date and fresh remote-image byte parity remain unstated.',
  'ottoman-before':
    'Selected renewal on 29 October: actual essay body on multifunctional Istanbul foundations, artists, Sinan, changing patrons and provincial ceramic/silk/book centers, plus author/contributor and displayed 1 October 2002 header read. Evaluative superlatives and exact worker/building totals are not adopted. Linked books, object catalogues and imperial account books not read; no figure reused.',
  'ottoman-after':
    'Selected renewal on 29 October: short essay main body, contributor and displayed 1 October 2003 header read. Use is limited to attributed court-price/open-market incentives, later patrons and the 1748–55 Nur-u Osmaniye example. Universal decline/quality rankings, payroll totals and a single inflation explanation are not adopted as every workshop’s experience. Current date header is display metadata, not independent historical-release proof. Linked books and archival edicts not read; no figure reused.',
};

export const ottomanWorkshopContext: HistoricalContext = {
  id: 'ottoman-makers-markets-context',
  title: 'Ottoman makers: signatures, workshop remains and markets',
  region: 'West/Central Asia',
  interval: {
    start: 1549,
    end: 1700,
    label: 'Selected maker and market evidence, 1549–seventeenth century',
    precision: 'approximate',
    note: 'Begins with the separately inscribed 1549 lamp and groups selected sixteenth-century objects, seventeenth-century tile comparisons and a traveler’s 1670s market account. The 1700 edge is a century-level orientation, not a kiln closure, end of making or polity boundary. The complete original 1500–1755 case, both selected object ranges and the later 1748–55 building example remain separate. Modern photographs, archaeological publication and laboratory replication have their own dates.',
  },
  summary:
    'A named decorator, an official emblem, a painted dish and production remains reveal different parts of skilled work. Markets and commissions could overlap without assigning every maker to a palace or every object to one known workshop.',
  subjectIds: ['ottoman-workshops'],
  citations: [
    cite('ottoman-musli-lamp', 'Date, production place and Curator’s comments'),
    cite(
      'ottoman-kiln-residues-2025',
      'English abstract: seventeenth-century comparisons',
    ),
    cite('ottoman-iznik-course', 'B.1: mediated Covel account of the 1670s'),
  ],
  phases: [
    {
      year: 1549,
      label: '1549: a name on a separate lamp',
      title: 'An inscription makes one decorator visible',
      text: 'The British Museum records AH 956/1549, Iznik and Musli in its account of the lamp’s inscription. The supplied translation identifies a painter. This dated comparison gives one maker a name without assigning the selected, unsigned Met dish to him or recovering everyone involved in preparing and firing the lamp.',
      citations: [
        cite('ottoman-musli-lamp', 'Date/place and supplied inscription translation'),
      ],
    },
    {
      year: 1555,
      label: 'c.1555–60: the selected tughra’s catalogue range',
      title: 'Drawing and illumination make an official emblem',
      text: 'The Met distinguishes a specialist drawing the standard form from an illuminator decorating certain imperial documents. The marker begins the selected emblem’s approximate catalogue range, not every document’s issue date or the moment the tughra form was invented.',
      citations: [cite('met-449533', 'Visible date; description of specialist roles')],
    },
    {
      year: 1575,
      label: 'c.1575–90: the selected dish’s catalogue range',
      title: 'Material and design belong to a particular vessel',
      text: 'The painted stonepaste dish retains its Iznik attribution and approximate production range. Its round border and plant ornament can be observed, but the museum record does not name its buyer or original occasion of use. Broader design exchange does not recover this vessel’s itinerary.',
      citations: [cite('met-451490', 'Artwork Details; Overview transcript')],
    },
    {
      year: 1600,
      label: 'Seventeenth century: production remains and building comparisons',
      title: 'Unfinished tiles connect a product to making',
      text: 'The excavation authors compare six tile finds with seventeenth-century buildings in Istanbul. Kiln debris, firing equipment and unfinished pieces support production questions. The 1600 marker orients a century-level comparison; it does not date every kiln, identify all workers or link the selected Met dish to one excavated context.',
      citations: [cite('ottoman-kiln-residues-2025', 'Complete English abstract')],
    },
    {
      year: 1670,
      label: '1670s: a traveler’s market account, mediated by a later course',
      title: 'A buyer’s setting enters the evidence',
      text: 'The Ashmolean teaching course excerpts John Covel describing a weekly market, local ceramic materials and vessels in use. This is a particular observer’s account, not a workshop census. Neither his judgments nor a later economic synthesis supplies every potter’s earnings or a single universal course of decline.',
      citations: [
        cite('ottoman-iznik-course', 'B.1: Covel excerpt and introductory framing'),
        cite('ottoman-after', 'Attributed court-price and open-market explanation'),
      ],
    },
  ],
};

export const ottomanWorkDimension: Subject['dimensions'][string] = {
  text: 'Writing, ceramic preparation and decoration involved distinct tasks. A named decorator, production debris and accounts of commissions and markets reveal particular working relationships without identifying every maker, buyer or condition of labor.',
  citations: [
    cite('met-449533', 'Specialist drawing and illumination'),
    cite('ottoman-musli-lamp', 'Supplied inscription translation'),
    cite('ottoman-kiln-residues-2025', 'English abstract'),
    cite('ottoman-after', 'Court payments and open-market incentives'),
  ],
};

export function applyWorkshopsOttoman(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'ottoman-workshops');
  if (!s) throw new Error('Ottoman continuation requires the existing workshop case');
  for (const [id, scope] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw new Error(`Missing inherited Ottoman source: ${id}`);
    const marker = 'Ottoman selected consultation, 2026-10-29:';
    if (!source.scope.includes(marker))
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker} ${scope}`;
    source.accessed = consulted;
  }
  for (const source of sources) {
    const index = c.sources.findIndex((row) => row.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  c.contexts = [
    ...(c.contexts ?? []).filter((row) => row.id !== ottomanWorkshopContext.id),
    ottomanWorkshopContext,
  ];
  s.contextIds = [...new Set([...(s.contextIds ?? []), ottomanWorkshopContext.id])];
  s.summary =
    'A tughra, a painted dish and workshop remains reveal different kinds of skilled work. Named decorators, material study and accounts of commissions and markets connect production with people while keeping the particular maker and buyer of an unsigned object unknown.';
  s.sections = [
    sec(
      'Writing through shared tasks',
      'An official emblem could require more than one pair of hands. The Met distinguishes the specialist who drew a tughra’s standard form from an illuminator who decorated certain imperial documents. In the selected example, tall shafts, loops and blue-and-gold ornament organize the paper surface. The writing represents Süleyman’s authority through names, titles and a claim of victory. It is work performed for a ruler, rather than proof that he drew every emblem himself or that everyone receiving a document could read it.',
      cite('met-449533', 'Description; Artwork Details; exposed children’s transcript'),
    ),
    sec(
      'Making a ceramic surface',
      'The round Iznik dish joins a formed body, painted design and transparent glazed surface. Stonepaste is a prepared ceramic material, rather than Chinese porcelain. The museum dates this vessel around 1575–90 and describes a local design language that adapted admired Chinese examples. A study of other Iznik samples identified different glasses used to prepare their bodies. Choosing and combining materials helped makers obtain a body suitable for a finished vessel. Makers arranged plants and birds within a bounded circular field. Preparing a usable material and fitting decoration to a shape were different problems. Neither the pattern nor the catalogue identifies this dish’s particular workshop, buyer or original meal.',
      cite('met-451490', 'Artwork Details; Overview: Iznik Ceramics transcript'),
      cite('stonepaste-tech', 'Retained 27 October opening material definition'),
      cite(
        'ottoman-iznik-technology-2004',
        'Publisher abstract: studied body materials',
      ),
    ),
    sec(
      'Names and production remains',
      'Other objects and excavations make workers’ tasks more visible. A separate British Museum lamp bears a date equivalent to 1549 and names Musli as its decorator. That is evidence about this lamp, not a signature on the selected dish. Excavation authors at Iznik report firing equipment, defective pieces and semi-finished tiles. Such remains connect finished-looking designs with preparation, firing and things that went wrong. Comparisons with tiles in seventeenth-century buildings help investigate production and dating without supplying a complete roster of makers.',
      cite('ottoman-musli-lamp', 'Date and supplied inscription translation'),
      cite(
        'ottoman-kiln-residues-2025',
        'English abstract: production residues and comparisons',
      ),
    ),
    sec(
      'Work for patrons and buyers',
      'Court commissions were one source of work among others. An Ashmolean course excerpts John Covel’s 1670s description of a weekly market and ceramic materials. Sardar’s later synthesis explains how fixed court payments could make open-market work more attractive. These are attributed accounts, not every workshop’s balance sheet. Religious foundations and urban building also required continuing production and upkeep. Eighteenth-century patrons commissioned new works, including the 1748–55 Nur-u Osmaniye Mosque. Keeping these settings distinct explains changing opportunities without making all ceramics market goods or all writing palace labor.',
      cite('ottoman-iznik-course', 'B.1: mediated Covel market/material account'),
      cite(
        'ottoman-before',
        'Multifunctional foundations and provincial production centers',
      ),
      cite('ottoman-after', 'Court-price/open-market explanation; 1748–55 example'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A material study is not a workshop recipe book',
      'Paynter and colleagues examined pottery and tile samples with associated glass and used laboratory replicas to investigate their interpretation. Their abstract distinguishes body and glaze compositions and reports separate glasses in the studied stonepaste bodies. This makes material selection an active part of skilled production. It does not identify the complete recipe, fuel, firing schedule or supplier of the selected Met dish. A chemical result can support a manufacturing explanation while leaving wages, ownership and division of labor unresolved.',
      cite('ottoman-iznik-technology-2004', 'Complete exposed publisher abstract'),
    ),
    sec(
      'A market account has a speaker',
      'Covel’s description reaches this inquiry through Rosser-Owen’s teaching-course excerpt, rather than a freshly read manuscript. It records a visitor’s market and material observations. His comparative judgments do not measure the experience of every potter. Sardar’s court-payment explanation is a separate modern synthesis; it does not replace workshop accounts or direct reading of the cited edicts. A signature, archaeological residue and economic account answer related questions through different evidence.',
      cite('ottoman-iznik-course', 'B.1: attributed traveler excerpt'),
      cite('ottoman-after', 'Court payments/open-market paragraph'),
    ),
    sec(
      'Dates belong to different records',
      'The lamp’s recorded 1549 inscription differs from the selected objects’ approximate catalogue ranges. A seventeenth-century building comparison, a 1670s visit, an old teaching course and a 2025 excavation article have other clocks. None gives the photographic exposure dates of the unchanged Met images or makes the full 1500–1755 case a single workshop generation.',
      cite('ottoman-musli-lamp', 'Inscribed date as interpreted by the museum'),
      cite('ottoman-kiln-residues-2025', 'Issue metadata and English abstract'),
      cite('ottoman-iznik-course', 'B.1 and frontispiece date/maintenance notice'),
    ),
  ];
  s.evidenceReading = {
    title: 'Roles, a signature and the remains of making',
    introduction:
      'These passages are editorial paraphrases. A curator’s interpretation, an inscription on a separate object and archaeological production remains support different steps in explanation.',
    items: [
      {
        label: 'Separate tasks within an official image',
        text: 'The Met distinguishes drawing the standard tughra from illuminating selected imperial documents.',
        interpretation:
          'An image can represent one ruler through several people’s work. This does not identify every draughtsman or illuminator, or show that all recipients understood the writing.',
        citations: [
          cite('met-449533', 'Description: specialist draughtsman and illuminator'),
        ],
      },
      {
        label: 'A name belongs to its recorded object',
        text: 'The British Museum identifies Musli and AH 956/1549 through its account of a separate lamp’s inscription; the selected dish’s record names no maker.',
        interpretation:
          'The lamp makes one decorator visible. Similar place, period or ornament does not transfer his signature to an unsigned vessel or prove that he performed every manufacturing task.',
        citations: [
          cite('ottoman-musli-lamp', 'Curator’s comments and supplied translation'),
          cite('met-451490', 'Description and Artwork Details'),
        ],
      },
      {
        label: 'Production can leave unfinished things',
        text: 'Excavation authors describe firing equipment, defective pieces and semi-finished tiles, while the material study examines samples and uses modern replication.',
        interpretation:
          'These records make production questions testable. They do not locate this dish in a particular kiln, recover every working condition or turn a modern experiment into a complete ancient instruction.',
        citations: [
          cite('ottoman-kiln-residues-2025', 'English abstract'),
          cite('ottoman-iznik-technology-2004', 'Publisher abstract'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What can a pattern tell us about work?',
    duration: '10–15 minutes',
    steps: [
      'Find the dish’s border, a bird and a plant. Describe a repeated shape and a color without guessing its buyer or meal.',
      'Draw a circle on paper and fit a plant pattern inside it. Explain one decision needed to make a design fit the edge.',
      'Ask an adult to read the capsule. Sort these statements: decoration fits a round surface; Musli decorated this particular dish; another dated lamp names Musli. Which can the image show, which is unsupported and which needs the separate record?',
      'Compare the tughra if available, or use the capsule: name drawing and illuminating as two tasks. Return with a question that would need a workshop account rather than a prettier picture.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the selected dish is painted stonepaste dated around 1575–90; its particular maker and buyer are not named. The British Museum records Musli as a decorator on a different lamp dated 1549. The Met explains that a specialist drew a standard tughra and an illuminator could decorate it. The dish image supports observations about its round border and ornament. The lamp record supplies a separate maker’s name, which cannot be transferred to the dish. Pay, ownership and who supplied materials would need further relevant records. The drawing activity explores fitting a design, not a reconstruction of a historical workshop.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian or maker/community approval',
    scope:
      'Selected explanation of specialist writing, ceramic surfaces, a separately named decorator, archaeological production remains and attributed market/patronage accounts. Four new sources and four selected inherited-source renewals; each prior dated scope retained. The shared stonepaste source retains its actual 27 October consultation. One separate maker/market reference, three evidence readings and an answerable image/source-capsule family inquiry. Original case identity, complete 1500–1755 interval, both object ranges, claim, dimensions, object order and all existing media records/bytes preserved.',
    limitations: [
      'Both scholarly technical/excavation sources were read at exposed abstract/metadata level, not full methods, context tables, illustrated finds, laboratory data, plans or supplements. Full-text requests cache-missed. No universal recipe, exact firing schedule, full kiln census or association between this Met dish and one excavated workshop inferred.',
      'The British Museum gallery’s inscription interpretation was consulted; the canonical collection URL returned 403. No independent inscription transcription, maker biography, lamp route or cited catalogue volumes read. Musli is not assigned the selected dish or every stage of the lamp’s production.',
      'The Ashmolean teaching course is explicitly no longer maintained. Covel is mediated through its excerpt; the original manuscript/edition and imperial edicts/payrolls/guild registers were not read. Proposed design transmission, broad economic narratives and comparative aesthetic rankings do not establish every workshop’s experience.',
      'The existing Met catalogue dates, attribution, medium and Public Domain statements were renewed through visible records. Other catalogue/provenance/reference tabs and embedded videos were not consulted. Current remote-byte parity and modern exposure dates are unverified. No new image, source geometry, numeric locator, route or annotation adopted.',
      'Internal source checking is not independent historian/conservator, real adult/family, human screen-reader, physical-device or physical-print acceptance. No maker/community approval, external contact or agreement with this atlas is represented.',
    ],
  };
}
