import type { Corpus, HistoricalContext, Source, Subject } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'bukhara-manuscript-work-2023',
    title:
      'Lording over the Centre of Asia: Manuscript Arts of the Abu’l-Khayrid (Uzbek) Khans',
    author: 'Jaimee Comstock-Skipp',
    institution: 'International Institute for Asian Studies, The Newsletter 95',
    url: 'https://www.iias.asia/the-newsletter/article/lording-over-centre-asia-manuscript-arts-abul-khayrid-uzbek-khans',
    type: 'scholarship',
    published: 'Summer 2023; exact day unstated',
    accessed: consulted,
    scope:
      'Opening framing, naming discussion, sixteenth-century manuscript section and selected discussion of twentieth-century classification read. Summer 2023 issue/author and figure captions 1–4 read; source image pixels not inspected. The author distinguishes courtly and commercial production, layered manuscripts, invited and captured artisans, and workshop standardization. Her interpretation does not identify this selected folio’s staff, purchaser or secure workshop. Samarqand’s early political primacy and Bukhara’s later capital role remain qualified to this account. Original manuscripts, linked books and archival workshop records not consulted. No figure, design diagram or map copied; no new reuse licence inferred.',
  },
  {
    id: 'bukhara-irrigation-economy',
    title: 'CENTRAL ASIA xi. Economy from the Timurids until the 18th Century',
    author: 'Robert D. McChesney',
    institution: 'Encyclopaedia Iranica V/2, pp. 216–221',
    url: 'https://www.iranicaonline.org/articles/central-asia-xi/',
    type: 'scholarship',
    published: '1990-12-15; displayed update 2017-12-15',
    accessed: consulted,
    scope:
      'Opening framing, Water supply section and selected Agriculture passages concerning endowment income, grain infrastructure and Bukhara-area purchases read. Canals, drainage, maintenance and investment are a regional synthesis, with particular Bukhara examples. The 1569 canal-quality sales and 1566 Karmine-area purchase are mediated through this author; original deeds and editions not read. The large requisitioned-labor example is explicitly in the Vakhsh basin, not evidence of the crew building a Bukhara reservoir. No exact maintenance rota, water entitlement, labor census, canal course or universal voluntary cooperation recovered. No map, source image, geometry or new numeric locator adopted.',
  },
  {
    id: 'bukhara-juybari-endowments',
    title: 'JUYBĀRIS',
    author: 'Robert D. McChesney',
    institution: 'Encyclopaedia Iranica XV/3, pp. 262–268',
    url: 'https://www.iranicaonline.org/articles/juybaris-a-prominent-bukharan-family-dynasty-for-more-than-500-years/',
    type: 'scholarship',
    published: '2009-09-15; displayed update 2012-10-15',
    accessed: consulted,
    scope:
      'Opening family/commercial/learning context, source discussion, selected rivalry passages, administration paragraphs and Monuments and public works section read. Supports endowed income and institutional employees, maintenance/repair, and intertwined family/institutional interests. Biographies can be partisan. The 1671 Ay Padshah Bibi madrasa/water-tank example is the author’s account of an archival document, not an original deed freshly read. Manuscript biographies, original accounts, purchase affidavits and endowment deeds were not independently consulted. The reported employee count is not independently verified or needed here. No equal access, household consensus or purely disinterested charity inferred. Text-only use; no manuscript image, plan or geometry copied.',
  },
  {
    id: 'bukhara-book-material-tasks',
    title: 'The Production of Miniature Painting',
    author: 'Alanna M. Benham',
    institution:
      'Brown University Library, Center for Digital Scholarship, Minassian Collection',
    url: 'https://library.brown.edu/cds/minassian/essay_production.html',
    type: 'scholarship',
    accessed: consulted,
    scope:
      'Painting Ateliers, Paper, Pigments and selected Media opening read. Undated web essay; no date inferred from crawl/copyright. Use is limited to a general Persian/Mughal material-work comparison: smoothing paper, grinding pigments and adding binders are distinct tasks. Not technical analysis of this folio, its exact pigments, a particular Bukharan apprenticeship, a family workshop or staff list. Sweeping religious claims, paper-origin chronology, universal family secrecy and categorical materials claims are not adopted. Underlying treatises and cited technical books not read. No figure copied or production layout reconstructed.',
  },
];

const renewals: Record<string, string> = {
  'met-452671':
    'Visible title/artist/author, description, Artwork Details object information, medium/dimensions/geography/credit/accession, Public Domain and Open Access notice read. Sa‘di’s poem was completed in 1257; copying likely occurred in Herat, followed by painting for an Uzbek patron, probably in Bukhara in the 1530s. The visible ca.1525–35 object range and qualified geography remain intact. Provenance/exhibition/reference tabs and linked resources not consulted. Existing native local main image actually viewed; main/thumb bytes checked unchanged. Modern photographic exposure date and fresh remote-original byte parity remain unestablished.',
  'bukhara-monuments':
    'Selected actual text on the 1417 Ulugh Beg madrasa’s courtyard, cells, classroom and mosque, its 1585 restoration; Shaibanid/Janid construction and trade; Mir-i Arab 1535–36; Qush madrasas, differing commercial-building dates; Lab-i Hauz 1619–23 and the 1651–52 madrasa read. Current published 2000-01-01/updated 2013-05-06 header and printed IV/5, pp.525–527 identified. Earlier passages encountered are not renewed comprehensive verification. The classroom layout belongs to an older building later restored, not a sixteenth-century foundation. Original Narshakhi, cited architectural monographs, excavation archive and building inscriptions not read. No source plan/image/coordinates copied.',
};

export const bukharaWorkContext: HistoricalContext = {
  id: 'bukhara-learning-water-work-context',
  title: 'Bukhara: making books and sustaining urban institutions',
  region: 'West/Central Asia',
  interval: {
    start: 1500,
    end: 1700,
    label: 'Sixteenth–seventeenth-century bookwork and urban institutions',
    precision: 'approximate',
    note: 'Century-level orientation for selected manuscript work, restored teaching spaces, foundations and water infrastructure; not the city’s or a polity’s lifespan. The complete original 1500–1785 case and the selected folio’s ca.1525–35 range remain separate. Building ranges and restoration years do not recover a timetable for every teacher, maker or water worker.',
  },
  summary:
    'Books, classrooms, markets and reservoirs required continuing work. A painted folio, architectural descriptions and records of endowed property reveal different tasks and interests within a changing city.',
  subjectIds: ['bukhara-books'],
  citations: [
    cite('met-452671', 'Description and Artwork Details'),
    cite(
      'bukhara-monuments',
      'Selected sixteenth/seventeenth-century building and restoration passages',
    ),
    cite('bukhara-irrigation-economy', 'Water supply'),
    cite('bukhara-juybari-endowments', 'Monuments and public works'),
  ],
  phases: [
    {
      year: 1530,
      label: '1530s: a probable painting setting',
      title: 'A copied text acquires a painted reception',
      text: 'The Met places the manuscript’s painting probably in Bukhara in the 1530s, after likely copying in Herat. The decade marker is an orientation within the retained ca.1525–35 catalogue range, not a recovered manufacture year. The much older poem and modern photograph keep their own dates.',
      citations: [
        cite('met-452671', 'Description; visible date and qualified geography'),
      ],
    },
    {
      year: 1536,
      label: '1535–36: Mir-i Arab construction',
      title: 'Teaching gains another built setting',
      text: 'The architectural account dates Mir-i Arab to 1535–36. It belongs to a city with older teaching institutions, rather than the invention of learning there. This range does not establish an exact opening day, a complete curriculum or every student’s experience.',
      citations: [cite('bukhara-monuments', 'Shaibanid construction: Mir-i Arab')],
    },
    {
      year: 1585,
      label: '1585: restoring an older madrasa',
      title: 'Continued use can require repair',
      text: 'The Ulugh Beg madrasa was built in 1417, outside this reference frame, and restored in 1585. Its described courtyard, cells, classroom and mosque connect education to material spaces. Restoration is a separate event from the building’s first construction.',
      citations: [
        cite(
          'bukhara-monuments',
          'Ulugh Beg madrasa: plan description and restoration',
        ),
      ],
    },
    {
      year: 1623,
      label: '1619–23: the Lab-i Hauz complex',
      title: 'Water storage joins institutions and public space',
      text: 'The architectural synthesis groups a khanaqah, madrasa and reservoir within a 1619–23 building range. The marker uses that range’s later edge. It does not reconstruct every canal connection, worker or resident’s right to draw water.',
      citations: [cite('bukhara-monuments', 'Janid period: Lab-i Hauz')],
    },
    {
      year: 1671,
      label: '1671: a foundation known through a written record',
      title: 'An endowment can outlast its buildings',
      text: 'McChesney cites a document for Ay Padshah Bibi’s madrasas and water tank in 1671 among works no longer surviving as buildings. His account connects physical provision to endowed resources, while leaving the original deed and its precise obligations for further consultation.',
      citations: [
        cite(
          'bukhara-juybari-endowments',
          'Monuments and public works: Ay Padshah Bibi',
        ),
      ],
    },
  ],
};

export const bukharaWorkDimension: Subject['dimensions'][string] = {
  text: 'Copying, painting, teaching, administration and water maintenance were different tasks. Manuscript study and endowed-property records expose some of their organization without identifying every workshop, laborer or household’s access.',
  citations: [
    cite('bukhara-manuscript-work-2023', 'Sixteenth-century manuscript organization'),
    cite('bukhara-irrigation-economy', 'Water supply'),
    cite('bukhara-juybari-endowments', 'Administration; Monuments and public works'),
  ],
};

export function applyCitiesBukhara(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'bukhara-books');
  if (!s) throw new Error('Bukhara continuation requires the existing case');
  for (const [id, scope] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw new Error(`Missing inherited Bukhara source: ${id}`);
    const marker = 'Bukhara selected consultation, 2026-10-29:';
    if (!source.scope.includes(marker)) {
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker} ${scope}`;
    }
    source.accessed = consulted;
  }
  for (const source of sources) {
    const index = c.sources.findIndex((row) => row.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  c.contexts = [
    ...(c.contexts ?? []).filter((row) => row.id !== bukharaWorkContext.id),
    bukharaWorkContext,
  ];
  s.contextIds = [...new Set([...(s.contextIds ?? []), bukharaWorkContext.id])];
  s.summary =
    'A painted book, restored teaching spaces and water infrastructure reveal work behind an urban setting. Copyists, painters, teachers, administrators and people sustaining water systems appear through different sources, with unequal visibility and distinct dates.';
  s.sections = [
    sec(
      'A book made through several acts',
      'This folio joins writing, painted figures, patterned surfaces and gold on paper. The Met attributes its painting to Shaikh Zada. The manuscript was likely copied in Herat, then illustrated for an Uzbek patron, probably in Bukhara in the 1530s. Sa‘di’s poem, completed in 1257, was older than both acts. Words had to be copied and a painted scene arranged on a bounded page. Those tasks did not happen at the poem’s composition. The reception gives selected forms of luxury a place within a literary image; it does not supply a survey of ordinary homes.',
      cite('met-452671', 'Description; Artwork Details'),
    ),
    sec(
      'Skills moved, and workshops organized work',
      'Comstock-Skipp describes invited and captured artists contributing to manuscripts in sixteenth-century Bukhara. Movement could involve coercion as well as opportunity. She interprets repeated figures and compositions in later books as evidence of organized production, challenging the assumption that repetition simply means inferior art. A general material account adds practical tasks: smoothing paper and preparing pigment with a binder precede controlled brushwork. These help explain skilled making without identifying this folio’s complete staff, exact pigments or workshop recipe.',
      cite(
        'bukhara-manuscript-work-2023',
        'Abu’l-Khayrid manuscripts in the sixteenth century',
      ),
      cite(
        'bukhara-book-material-tasks',
        'Paper; Pigments; Media, as a general comparison',
      ),
    ),
    sec(
      'Teaching used rooms that needed care',
      'Learning also depended on built places. The architectural account describes the older Ulugh Beg madrasa with a courtyard, cells, a classroom and a mosque. Built in 1417, it was restored in 1585. Learning and prayer thus depended on physical spaces within an institution whose fabric could be repaired. Mir-i Arab, dated 1535–36, added another foundation to the city. These descriptions make education more concrete than a list of famous monuments, while leaving daily timetables and the experience of particular students unresolved.',
      cite(
        'bukhara-monuments',
        'Ulugh Beg madrasa layout and restoration; Mir-i Arab construction',
      ),
    ),
    sec(
      'Water and income sustained institutions',
      'Canals supplied fields, while drainage carried away runoff and helped manage salts. McChesney explains why construction, maintenance and investment mattered, with Bukhara examples in a wider regional account. Urban reservoirs belonged to this work of provision: the Lab-i Hauz complex brought a reservoir together with a madrasa and khanaqah in 1619–23. Endowed property supplied income for institutions and their employees. The wealthy Juybari family sponsored repairs, canals and learning foundations while also preserving family influence. Books and buildings therefore lead to people managing resources, not only the patrons whose names survive.',
      cite('bukhara-irrigation-economy', 'Water supply'),
      cite('bukhara-monuments', 'Lab-i Hauz complex'),
      cite('bukhara-juybari-endowments', 'Monuments and public works'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A foundation had records as well as walls',
      'McChesney distinguishes purchase records, endowment deeds and biographies favorable to the Juybari family. They do different work as evidence. Property income could support public institutions, while establishing an endowment also helped perpetuate the family. His account of administrative roles includes scribes and supervision of household and workshop accounts. Such records bring calculation and supervision into view alongside monumental patronage. They do not make every employee’s voice equally audible. A biography praising its patron and a deed defining resources should not be treated as interchangeable descriptions of a shared experience. Here the original manuscripts and deeds remain unread; the explanation uses the historian’s selected analysis.',
      cite(
        'bukhara-juybari-endowments',
        'Source discussion; administration; Monuments and public works',
      ),
    ),
    sec(
      'Maintenance also raises a question about power',
      'A canal was not useful simply because someone once ordered it built. Continued water flow depended on maintenance and resources, and land value varied with access to the system. This practical relationship linked fields, food and urban institutions. It could also create unequal obligations. McChesney describes requisitioned labor in a large project in the Vakhsh basin. That example belongs to another location; it is not a recovered crew for Bukhara’s reservoir. It does show why useful infrastructure should not automatically be called voluntary cooperation. The present sources explain investment and institutional support more clearly than household water rights, everyday cleaning routines or the conditions of particular workers.',
      cite(
        'bukhara-irrigation-economy',
        'Water supply: investment, land value and specifically located corvee example',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'A page, a building description and an institutional record',
    introduction:
      'These are modern paraphrases of selected sources, not translations of inscriptions, manuscript text or endowment deeds.',
    items: [
      {
        label: 'The selected folio and its catalogue',
        text: 'The catalogue distinguishes an older poem, likely copying in Herat and later painting probably in Bukhara. The visible page brings writing, figures and patterned surfaces into one composition.',
        interpretation:
          'An image can support observations about represented goods and artistic choices. Its architecture is not a measured Bukharan house or madrasa, and its reception is not evidence of every household’s experience.',
        citations: [
          cite('met-452671', 'Description; Artwork Details; native local image'),
        ],
      },
      {
        label: 'Restoration is a dated activity',
        text: 'The architectural account gives 1417 for the Ulugh Beg madrasa’s construction and 1585 for restoration, alongside a description of its courtyard, cells, classroom and mosque.',
        interpretation:
          'A building can combine older design with later care. The restoration date does not date every surviving component or prove an unchanged curriculum. This is evidence of an institution continuing through work on material fabric.',
        citations: [cite('bukhara-monuments', 'Ulugh Beg madrasa paragraph')],
      },
      {
        label: 'Resources supported people as well as structures',
        text: 'McChesney’s endowment analysis connects property income with institutional functions and employees, while also identifying the family’s interests in preserving its position.',
        interpretation:
          'Funding helps explain how a foundation could continue after its construction. The selected analysis does not establish equal benefit or reveal every obligation; it should be compared with household and worker testimony when such evidence becomes available.',
        citations: [cite('bukhara-juybari-endowments', 'Monuments and public works')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Seen on the page, learned from another source',
    duration: '8–10 minutes',
    steps: [
      'Find one writing panel, one painted figure and one repeated pattern in the selected image. Describe what you see before naming any person or place.',
      'Read this capsule: The catalogue separates copying from later painting. Other sources describe teaching rooms, canals needing maintenance and endowed income supporting institutional employees. None of those water systems is pictured here.',
      'Make two columns: “Seen in the image” and “Learned from a source.” Put your three observations and two capsule facts in the appropriate columns. Add one question that neither source answers about a particular worker or household.',
    ],
    explanation:
      'Writing, figures and pattern are observable. Copying/painting stages and institutional maintenance require other evidence. A strong answer keeps these distinctions and does not identify a real madrasa, reservoir or worker from the literary reception scene.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author review; not independent historian or community approval',
    scope:
      'Selected museum catalogue, architectural synthesis, manuscript scholarship and institutional/economic analysis. Original case dates, claims, object order, full media metadata and image bytes are retained.',
    limitations: [
      'No complete original endowment deed, manuscript biography, workshop account or cited architectural monograph freshly read. Selected claims mediated through named modern scholars remain attributed.',
      'The folio’s likely copying and probable painting place remain qualified; its depicted architecture is not a recovered school, workshop, home or water system.',
      'Household water rights, particular maintenance routines, exact working conditions and the experience of students and workers remain incompletely documented here. The Vakhsh labor example is not relocated to Bukhara.',
      'No new photograph, historical plan, route, border, numeric locator or source-derived diagram is added. Full family usability, screen-reader behavior, physical print and independent historical acceptance remain separate tasks.',
    ],
  };
}
