import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const sources: Source[] = [
  {
    id: 'teot-patt-households',
    title: 'Household Archaeology',
    institution: 'Proyecto Arqueológico Tlajinga Teotihuacan; Boston University',
    url: 'https://sites.bu.edu/patt/research/household-archaeology/',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      'Short project page text and image captions consulted on 29 October 2026: Compounds 17:S3E1, 18:S3E1 and earlier Tlajinga 33; craft interpretations, building materials, grid alignment, courtyards, drains and access to imported goods. Undated project synthesis, not a current completion report. Linked bibliography and original residential, health or demographic datasets were not consulted. Occupant status and some craft functions are excavators’ interpretations; no household census, gendered allocation of tasks or legal status is established. Page photographs were not inspected or reused; no reusable image licence was verified.',
  },
  {
    id: 'teot-patt-economy',
    title: 'Domestic Economy',
    institution: 'Proyecto Arqueológico Tlajinga Teotihuacan; Boston University',
    url: 'https://sites.bu.edu/patt/research/domestic-economy/',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      'Short project page text and image captions consulted on 29 October 2026: Compound 17 blade production, the 2013 excavation sample, cores and byproducts, skill variation interpreted as apprenticeship, and exchange for other goods. Undated page: statements about ongoing analyses are not treated as 2026 progress reports. Sample mass is not annual output or a whole-city total; skill variation does not identify an apprentice’s age or gender. The proposed economic attraction of migration is not a recovered individual motive. No original laboratory tables or linked reports consulted; page photographs not copied or licensed for reuse.',
  },
  {
    id: 'teot-tlajinga-2026',
    title:
      'Disentangling Community and Domestic Uses of Space in Teotihuacan’s Tlajinga District',
    author:
      'David M. Carballo, Luis Barba Pingarrón, Agustin Ortiz, Jorge Blancas, A. Gabriel Vicencio, Daniela Hernández Sariñana and Jorge Nukyen Archer Velasco',
    institution:
      'Latin American Antiquity; Cambridge University Press on behalf of the Society for American Archaeology',
    url: 'https://www.cambridge.org/core/journals/latin-american-antiquity/article/disentangling-community-and-domestic-uses-of-space-in-teotihuacans-tlajinga-district/2949C67FEBA7F7F90D105F83157CC47E',
    type: 'archaeology',
    published: '2026-09-18',
    accessed: '2026-10-29',
    scope:
      'Selected HTML sections consulted on 29 October 2026: Abstract; The Tlajinga District and Its Neighborhood Center; Complexes 2 and 4 excavation, substructure/fill and phasing passages; Comparing the Neighborhood Center and Apartments; Figures 1–5 captions; copyright and Data Availability. First View report, pages 1–12, DOI 10.1017/laq.2026.10207. Figure 1 source PNG actually inspected: 1650 × 2345 composite city/district map based on Millon et al. 1973 with later PATT and Widmer/Storey fieldwork, not a single-phase household plan. Its generated Long Description misnumbers/misnames several labels; actual pixels and scholarly caption take precedence. Figures 2–5 pixels and original datasets were not inspected: Figure 2 includes hypothetical architecture and Figure 4 combines substructure and last-occupation floors. Floor chemistry, artifacts and architectural differences support qualified local functions; pottery-form differences alone are not statistically significant. Individual radiocarbon sample ranges are not exact building boundaries. Article CC BY-NC 4.0; commercial use requires the rights holder’s permission. Linked tDAR reports and bibliography are not treated as consulted.',
  },
  {
    id: 'teot-obsidian-2019-abstract',
    title: 'Excavation of an Obsidian Craft Workshop at Teotihuacan, Mexico',
    author:
      'Kenneth G. Hirth, David M. Carballo, Mark Dennison, Sean Carr, Sarah Imfeld and Eric Dyrdahl',
    institution:
      'Penn State institutional publication record; Ancient Mesoamerica 30(1), 163–179',
    url: 'https://pure.psu.edu/en/publications/excavation-of-an-obsidian-craft-workshop-at-teotihuacan-mexico/',
    type: 'archaeology',
    published: '2019',
    accessed: '2026-10-29',
    scope:
      'Institutional abstract and citation metadata consulted on 29 October 2026; DOI 10.1017/S0956536118000561. Abstract-level use only: surface workshop identifications, the need for subsurface testing, confirmation of production in Compound 17:S3E1 and the explicit single-test-case limit. OpenBU full-text retrieval returned 403, so none of the complete 17-page article, workshop extent, original statistics, technical sequences or figures is claimed as read or reused.',
  },
];

const context: HistoricalContext = {
  id: 'teotihuacan-neighborhood-context',
  title: 'Teotihuacan: building a city and organizing neighborhood work',
  region: 'Americas',
  interval: {
    start: -100,
    end: 650,
    label: 'c.100 BCE–650 CE: selected urban and neighborhood reference',
    precision: 'approximate',
    note: 'Selected teaching frame, not a lifespan or uniform polity. The case remains c.100 BCE–800 CE. The 650 edge lies within Barnes’s reduced-population period (600–800), not a collapse/abandonment date. Monuments, neighborhoods, samples and mask keep separate dates.',
  },
  summary:
    'Monuments and apartments developed at different times. Household production, shared spaces and changing construction explain urban organization without supplying a recovered list of rulers.',
  subjectIds: ['teotihuacan'],
  citations: [
    cite('teotihuacan', 'Introduction; Residential Architecture'),
    cite(
      'teot-tlajinga-2026',
      'The Tlajinga District and Its Neighborhood Center; Complexes 2 and 4',
    ),
  ],
  phases: [
    {
      year: -100,
      label: 'Around 100 BCE: broad city chronology begins',
      title: 'A broad frame is not the date of every building',
      text: 'Barnes uses approximately 100 BCE–800 CE for Teotihuacan. This selected reference begins with that broad convention; it does not assign the later apartments or surviving mask to the first year.',
      citations: [cite('teotihuacan', 'Introduction')],
    },
    {
      year: 100,
      label: 'Around 100–250 CE: major monumental building',
      title: 'Monuments and streets organize public space',
      text: 'Barnes places major monumental construction in this interval. The orderly layout allows questions about coordination, but a single original master plan remains one interpretation rather than a demonstrated construction schedule.',
      citations: [
        cite(
          'teotihuacan',
          'Introduction; City Layout and Monumental Architecture: master-plan alternatives',
        ),
      ],
    },
    {
      year: 250,
      label: 'Around 250–550 CE: apartments and local urban expansion',
      title: 'Household space becomes central to the urban account',
      text: 'Barnes’s broad apartment-building range differs in scale from the Tlajinga report’s local transition to dense apartment occupation around the mid-third century. Compounds 17 and 18 preserve evidence of craft, domestic space and links to the street. These are selected excavated settings, not a complete household census.',
      citations: [
        cite('teotihuacan', 'Introduction; Residential Architecture'),
        cite(
          'teot-tlajinga-2026',
          'The Tlajinga District and Its Neighborhood Center: local settlement transition',
        ),
        cite(
          'teot-patt-households',
          'Compounds 17 and 18; grid alignment, courtyards and drains',
        ),
      ],
    },
    {
      year: 550,
      label: 'Around 550 CE: burning of core monuments',
      title: 'A changed center does not identify its destroyers',
      text: 'Barnes reports burning by unidentified people around this time. The event does not by itself establish its cause, the people responsible, or an immediate end to life in every neighborhood.',
      citations: [cite('teotihuacan', 'Introduction: burning and later population')],
    },
    {
      year: 600,
      label: 'After 600 CE: reduced population within a longer history',
      title: 'Occupation continues beyond the main monumental phase',
      text: 'Barnes describes markedly reduced population during 600–800 CE. The selected reference stops at 650 within that broader interval; the complete case continues to 800. Neither endpoint means that a people disappeared.',
      citations: [cite('teotihuacan', 'Introduction: 600–800 CE')],
    },
  ],
};

/** Add selected reading while leaving the original case, objects and claims intact. */
export function applyImagesWorkTeotihuacan(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'teotihuacan');
  const essay = c.sources.find((row) => row.id === 'teotihuacan');
  const mask = c.sources.find((row) => row.id === 'met-312736');
  if (!s || !essay || !mask) {
    throw new Error('Teotihuacan expansion requires the existing case and sources');
  }

  essay.accessed = '2026-10-29';
  essay.published = '2024-03-01';
  essay.scope =
    'Selected Introduction, City Layout and Monumental Architecture, Residential Architecture and first Arts paragraphs through the stone-mask discussion reconsulted on 29 October 2026; contributor and publication date checked. The original c.100 BCE–800 CE case is preserved. Broad monument/apartment ranges, population decline, master-plan alternatives, uncertain market function and the limited excavated residential sample retain their scopes. Patrilocality, political organization and mask meaning remain interpretations. Not every Arts subsection, linked book, original excavation dataset or bibliography was consulted.';
  mask.accessed = '2026-10-29';
  mask.scope =
    'Official rendered Description, Artwork Details and Public Domain/Open Access wording reconsulted on 29 October 2026: accession 1979.206.527, third–seventh century, Mexico/Mesoamerica, greenstone (chlorite schist), dimensions, credit, eye/mouth depressions, side attachment perforations and qualified function. Existing 1600 × 1200 photograph actually inspected without changing its bytes. The rendered provenance tab did not expose its content; the earlier provenance consultation is not claimed as freshly repeated. No secure excavated findspot, named owner, exact neighborhood, proven deity or recovered original attachment is supplied. Linked further reading is not automatically adopted.';
  for (const source of sources) {
    const existing = c.sources.find((row) => row.id === source.id);
    if (existing) Object.assign(existing, source);
    else c.sources.push({ ...source });
  }
  const contextIndex = (c.contexts ?? []).findIndex((row) => row.id === context.id);
  if (contextIndex < 0) c.contexts = [...(c.contexts ?? []), context];
  else c.contexts![contextIndex] = context;
  s.contextIds = [...new Set([...(s.contextIds ?? []), context.id])];

  s.summary =
    'Teotihuacan was made through public construction and the work of households. At Tlajinga, blade production, courtyards and drains connect modest residences to a larger urban system. Nearby platform buildings had different materials and activities. These remains explain practical organization and change while leaving the identities and exact powers of many decision makers uncertain.';
  s.sections = [
    sec(
      'A city was built at different moments',
      'Teotihuacan’s great monuments and apartment compounds belong to different phases of urban life. Barnes places major monumental building around 100–250 CE and apartment development especially around 250–550. Rooms, courtyards and streets therefore need dates as well as positions on a plan. The city’s broad history continues into a period of reduced population after 600. A single drawing cannot make every building contemporary, and a later artifact cannot be fixed to the year 200 merely because it appears beside that view.',
      cite('teotihuacan', 'Introduction; Residential Architecture'),
    ),
    sec(
      'A household could also make tools',
      'In the southern district of Tlajinga, excavators investigated parts of Compounds 17 and 18. Compound 17 preserves cores and byproducts from making obsidian blades, sharp cutting tools used widely in the city. Producing these useful goods helped residents obtain things they did not make themselves. The project interprets differences in skill as evidence of apprenticeship and work across generations. That gives production a household setting, although it does not identify an individual apprentice, their age, or the rules by which work was assigned.',
      cite(
        'teot-patt-economy',
        'Blade production, 2013 sample and exchange paragraphs',
      ),
      cite('teot-patt-households', 'Compounds 17:S3E1 and 18:S3E1'),
    ),
    sec(
      'Shared spaces linked homes to the street',
      'Building materials varied: some walls used cut stone, others smaller stones, rubble or adobe. Courtyards provided space for gatherings and domestic ritual, while drains from Compounds 17 and 18 emptied toward the Street of the Dead. These connections made household life part of the city’s physical organization. Modest construction did not mean isolation: residents also obtained some greenstone, shell, mica and decorated pottery. Different kinds of access and material work could coexist within the same district.',
      cite(
        'teot-patt-households',
        'Construction materials; courtyards, drains and imported goods',
      ),
    ),
    sec(
      'A neighborhood center had a changing role',
      'Across the street, elevated platform buildings used more elaborate surfaces and decoration. Recent research compares their floors, tools and pottery with nearby apartments. Greater domestic residues and grinding-tool densities in the apartments support different food-related activities. At Complex 2, earlier structures were covered with fill before raised buildings were constructed. Excavators interpret its later use as more civic-ceremonial, within the areas investigated. Such changes reveal organization at the neighborhood scale without supplying the names of its decision makers or proving that every household had equal power.',
      cite(
        'teot-tlajinga-2026',
        'Complexes 2 and 4; Comparing the Neighborhood Center and Apartments',
      ),
    ),
    sec(
      'The mask answers another kind of question',
      'The selected greenstone face has its own third–seventh-century date. Its recessed eyes and mouth may once have held inlays. Weight, absent viewing holes and side perforations lead the museum to suggest attachment to another object rather than wearing by a living person. Possible figures, bundles and religious meanings remain interpretations. The mask makes skilled shaping visible; it does not identify a ruler or connect this particular object to a household excavated at Tlajinga.',
      cite('met-312736', 'Description; Artwork Details: Date, Medium and Dimensions'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Move carefully between the scale of a home and a city',
      'A compound can show how shared space, materials and productive work were arranged, but an excavated sample is not the city in miniature. Barnes notes that only a small fraction of the suspected apartment compounds have been investigated. Tlajinga supplies particular evidence of modest construction and craft alongside access to imported goods. The project’s placement of its residents within a socioeconomic spectrum is an interpretation of that evidence, not a list of everyone’s wealth, origin or legal status. These observations allow social variation to enter the account without treating a shared architectural form as proof of identical lives.',
      cite('teotihuacan', 'Residential Architecture: excavated sample'),
      cite(
        'teot-patt-households',
        'Materials, status interpretation and imported goods',
      ),
    ),
    sec(
      'Test a function with evidence that could disagree',
      'Tlajinga’s platform buildings invite several explanations: temples, civic spaces, elite residences or combinations of these. The recent study compares architecture with floor chemistry and artifacts. Its pottery-form differences are not statistically significant; those pots alone cannot establish the proposed contrast in activities. Grinding tools and the distribution of food-related residues carry other parts of the argument. Building elaboration and buried earlier structures add a sequence. Combining such evidence makes the interpretation testable while leaving mixed functions and unexcavated areas open.',
      cite(
        'teot-tlajinga-2026',
        'Comparing the Neighborhood Center and Apartments: Figures 4–5 discussion and conclusion',
      ),
    ),
    sec(
      'A map and an object keep different kinds of time',
      'The inspected 2026 city-and-district map combines the earlier Teotihuacan Mapping Project with later fieldwork. Its spatial relationships are useful, but the composite is not a photograph of one ancient year or a single-phase household plan. The selected mask has a separate catalogue range and no secure excavated findspot in the consulted record. Reading the two together therefore compares kinds of evidence; it cannot place the mask in a named apartment or convert urban coordination into a recovered royal biography.',
      cite('teot-tlajinga-2026', 'Figure 1 caption and inspected source image'),
      cite('met-312736', 'Description; Artwork Details: Date and Geography'),
    ),
  ];
  s.evidenceReading = {
    title: 'How do remains become an explanation of work?',
    introduction:
      'These are editorial paraphrases of modern archaeological and museum accounts, not ancient quotations. Each interpretation depends on the scale and context of the evidence.',
    items: [
      {
        label: 'A workshop tested below the surface',
        text: 'The 2019 abstract reports that subsurface excavation confirmed obsidian production at Compound 17, after earlier workshop identifications from surface debris had been questioned.',
        interpretation:
          'Excavation tests whether a concentration belongs to production in that location. One confirmed compound does not establish that every surface concentration is a workshop. Only this abstract was consulted, not the article’s complete technical analysis.',
        citations: [
          cite(
            'teot-obsidian-2019-abstract',
            'Abstract: subsurface test and single-case limit',
          ),
          cite('teot-patt-economy', 'Compound 17: cores and production byproducts'),
        ],
      },
      {
        label: 'Different indicators of food-related activity',
        text: 'The recent study compares food-related floor residues and tools in apartments and platform buildings; its pottery-form differences alone are not statistically significant.',
        interpretation:
          'The proposed difference in activities depends on several kinds of evidence. A more decorated building is not automatically a temple, and chemical residues do not recover an exact meal. Function remains qualified for the areas and phases investigated.',
        citations: [
          cite(
            'teot-tlajinga-2026',
            'Comparing the Neighborhood Center and Apartments: floor chemistry, Figures 4–5 and conclusion',
          ),
        ],
      },
      {
        label: 'A carved face and a proposed attachment',
        text: 'The photograph shows facial depressions and a side perforation. The catalogue adds weight, dimensions and the absence of viewing holes to its argument that the mask probably was not worn by living people.',
        interpretation:
          'Visible recesses should not be mistaken for demonstrated through-holes. Attachment to a figure or bundle is a proposal, not a recovered original mounting. The object does not identify a ruler, its exact place of use or a Tlajinga household.',
        citations: [
          cite(
            'met-312736',
            'Description; Artwork Details; actual existing local photograph inspected',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Draw a relationship; keep a question open',
    duration: '10–15 minutes',
    steps: [
      'Read the supplied paragraph about shared spaces, with an adult if useful. Draw symbols for nearby rooms, a shared courtyard and a drain leading toward the street. Label this a modern relationship sketch, not a measured ancient plan.',
      'Choose one shared feature. Explain why its use or maintenance might involve more than one household. Mark that explanation as an inference rather than a recovered rule.',
      'Add a separate work note from the blade-making account: cores and byproducts support production at Compound 17. Finish with one question about who decided or performed the work that the supplied evidence cannot answer.',
    ],
    explanation:
      'The supplied text supports the spatial relationships and work example. The sketch does not invent exact rooms, task locations, household numbers or decision makers.',
  };
  s.dimensions['material-work'] = {
    text: 'Household craft, varied building materials, courtyards and drains connect work to urban organization. Differences between apartments and platform buildings require contextual evidence rather than a presumed single ruler or identical household lives.',
    citations: [
      cite('teot-patt-households', 'Materials, courtyards and drains'),
      cite('teot-patt-economy', 'Blade production and exchange'),
      cite('teot-tlajinga-2026', 'Comparing the Neighborhood Center and Apartments'),
    ],
  };
  s.dimensionKeys = Object.keys(s.dimensions);
  s.terms = [...new Set([...s.terms, 'provenance'])];
  s.review = {
    consultedOn: '2026-10-29',
    reviewer:
      'Codex source consultation and author self-review; not independent historian approval',
    scope:
      'Selected neighborhood-based account of household craft, shared space, sampled platform functions and separate mask interpretation; distinct c.100 BCE–650 CE teaching reference, deeper reading, three evidence readings and a text-supported family sketch. Existing case interval, objects, claims and comparison dimensions remain intact. An original relationship guide and the separately licensed composite source map accompany the account; no measured household reconstruction is supplied.',
    limitations: [
      'The full c.100 BCE–800 CE case survives. The reference’s 650 teaching edge is not a collapse or abandonment date. Broad city chronology, local phases, individual radiocarbon samples, composite mapping and the mask’s third–seventh-century range are not reconciled into one event.',
      'Two short undated PATT pages and selected 2026 report passages were consulted, not the complete residential literature, linked tDAR reports, original chemistry/isotope tables, household census or a citywide labor history. Statements about ongoing work on undated pages are not current 2026 analysis reports.',
      'The 2019 workshop article is used at abstract level only; full-text access failed. Subsurface confirmation in one compound is not validation of all surface workshops or evidence for production rates. Apprenticeship, social status and civic-ceremonial function remain qualified archaeological interpretations.',
      'The existing mask image and official details/rights were checked; its provenance tab was not freshly exposed. Precise findspot, original attachment, named owner, ruler, household membership and specific deity remain unresolved. Original image bytes and object IDs are preserved.',
      'The inspected Figure 1 is composite mapping, with CC BY-NC 4.0 rights and earlier mapping attribution. Its generated Long Description contains incorrect legend labels; actual pixels and caption take precedence. The supplied figure is converted losslessly, without cropping, enhancement or tracing. Small labels retain a readable text equivalent. No single-phase household plan or new numeric neighborhood locator is claimed.',
      'Shared architecture and coordinated work establish neither a homogeneous population nor equal power, one recovered constitution, voluntary labor or a known list of rulers. No contact or causal sequence with Chavín or Moche is inferred. Wider gender, coercion, migration and resident perspectives remain open research.',
      'Independent archaeological/source review, real adult/family use, screen-reader and physical-device behavior, physical print and human acceptance remain open.',
    ],
  };
}
