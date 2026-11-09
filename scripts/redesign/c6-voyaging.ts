import type { Corpus, HistoricalContext, Journey, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const voyagingEvidenceSources: Source[] = [
  {
    id: 'voyaging-rat-seeds-2008',
    title:
      'Dating the late prehistoric dispersal of Polynesians to New Zealand using the commensal Pacific rat',
    author:
      'Janet M. Wilmshurst; Atholl J. Anderson; Thomas F. G. Higham; Trevor H. Worthy',
    institution:
      'Proceedings of the National Academy of Sciences 105(22), pp. 7676–7680; PMC',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2409139/',
    type: 'archaeology',
    published: '2008-06-03',
    accessed: consulted,
    scope:
      'Selected HTML abstract, introduction, Results and Discussion subsections on redating bones and rat-gnawed seeds, Conclusions and Materials and Methods. DOI 10.1073/pnas.0801507105. The authors infer introduced-rat arrival around 1280 from their material and methods; this is not an exact human landing or a named canoe. Figures, supplementary tables and individual samples were not independently inspected/reanalysed. ©2008 National Academy of Sciences; free online availability is not an adopted image/adaptation licence. No figure or source geometry copied.',
  },
  {
    id: 'voyaging-chronology-2022',
    title:
      'A new chronology for the Māori settlement of Aotearoa (NZ) and the potential role of climate change in demographic developments',
    author: 'Magdalena M. E. Bunbury; Fiona Petchey; Simon H. Bickler',
    institution:
      'PNAS 119(46), e 2207609119; James Cook University ResearchOnline published-version copy',
    url: 'https://researchonline.jcu.edu.au/76732/',
    type: 'archaeology',
    published: '2022-11-07',
    accessed: consulted,
    scope:
      'Institutional abstract/metadata/licence and selected linked eight-page PDF text: abstract (p. 1), settlement/model discussion and Timing of Polynesian Arrival (pp. 2–3), Dataset opening (p. 5) and Bayesian Analysis/Frequency Analysis (p. 7). DOI 10.1073/pnas.2207609119. North 1250–1275 and South 1280–1295 are attributed model HPDs, normally reported at 68%, not exact landfalls. Supplementary data/code, population/climate causal claims and modeled sailing paths not adopted. Publisher DOI access returned 403; PMC returned a browser challenge. Public institutional copy was read, not those inaccessible views. PDF screenshot requests timed out/cache-missed: no figure pixels inspected. Repository identifies CC BY-NC-ND 4.0; no figure/geometry reused.',
  },
  {
    id: 'voyaging-tuaupiki-2022',
    title: 'Research into ancestral sea voyaging',
    institution: 'University of Waikato',
    url: 'https://www.waikato.ac.nz/news-events/news/research-into-ancestral-sea-voyaging/',
    type: 'primary',
    published: '2022-02-17',
    accessed: consulted,
    scope:
      'Selected institutional report and attributed statements by Haki Tuaupiki: te reo Māori narrative research, environmental/seasonal knowledge, scattered books/recordings, work with Jack Thatcher, and sharing through hui/marae. It reports a research project in 2022, not its verified 2026 status or completion of a proposed app. Original waiata/karakia, complete recordings and research corpus not independently read, translated or reproduced. Particular seasonal and canoe interpretations are not a universal consensus or exact route. No photo pixels or reuse licence established; no image copied.',
  },
  {
    id: 'voyaging-pvs-modern',
    title:
      'Polynesian Wayfinding: Modern Methods and Techniques of Non-Instrument Navigation',
    institution: 'Polynesian Voyaging Society',
    url: 'https://hokulea.com/polynesian-wayfinding/',
    type: 'primary',
    accessed: consulted,
    scope:
      'Selected modern-practice account: Mau Piailug/Nainoa Thompson teaching,1976/1980 voyages, three components of modern wayfinding and star-compass framing. Page publication date unverified; footer copyright is not a publication date. This is the organization’s attributed teaching account, not a medieval voyage log or universal Pacific curriculum. The page identifies Thompson’s Hawaiian star compass as modern and expressly requires permission for reproduction. No compass/image copied, traced, redrawn or newly licensed; detailed named-house geometry is not adopted as an Aotearoa chart.',
  },
  {
    id: 'voyaging-thatcher-2021',
    title: 'Jack Thatcher',
    institution:
      'Science Learning Hub – Pokapū Akoranga Pūtaiao, University of Waikato',
    url: 'https://www.sciencelearn.org.nz/resources/634-jack-thatcher',
    type: 'primary',
    published: '2014-11-13; updated 2021-06-08',
    accessed: consulted,
    scope:
      'Selected profile/training history, attributed perspective and explicit 2014/2021 publication note read. It describes Thatcher joining Te Aurere in 1992 and subsequent navigation training after an invitation from Hekenukumai Busby. Contemporary roles are reported at the source’s date, not verified current offices. Linked audio, video, complete 2024 UNESCO paper and original voyage records not read. Different media credits include Creative NZ CC BY-ND 2.0 and New Zealand Māori Arts and Crafts Institute; no pixels inspected and no image or general page licence inferred.',
  },
];

export const voyagingKnowledgeContext: HistoricalContext = {
  id: 'voyaging-dating-knowledge-context',
  title: 'Settlement of Aotearoa: dated evidence and navigation knowledge',
  region: 'Southeast Asia/Oceania',
  interval: {
    start: 1250,
    end: 1300,
    label: 'Selected settlement-dating window, c. 1250–1300 CE',
    precision: 'approximate',
    note: 'A source-qualified archaeological orientation, preserving the separate complete case interval unchanged. The dated phases below locate published model windows, not recovered canoe departures, an exact first landing, one Great Fleet, or the lifespan of Māori identity. Modern practice, teaching and research-publication dates remain outside this medieval frame.',
  },
  summary:
    'Dated materials help investigate settlement, while attributed accounts of practiced knowledge explain navigation and its transmission. Their evidence and dates can be compared without turning a statistical range or modern sailing achievement into one recovered ancestral itinerary.',
  subjectIds: ['polynesian-voyaging'],
  citations: [
    cite('nz-settlement', 'The date debate: Reaching New Zealand'),
    cite(
      'voyaging-chronology-2022',
      'PDF pp. 2–3: Timing of Polynesian Arrival; p. 7: HPDs',
    ),
  ],
  phases: [
    {
      year: 1250,
      label: '1250–1275: a published North Island model window',
      title: 'A range belongs to an analysis',
      text: 'Bunbury, Petchey and Bickler’s 2022 analysis places North Island settlement in a modeled 1250–1275 window. Its standard reporting uses 68% highest-probability-density intervals. The phase marker orients that attributed window; it does not identify a named canoe or make 1250 an exact landing.',
      citations: [
        cite(
          'voyaging-chronology-2022',
          'PDF p. 2: Timing of Polynesian Arrival; p. 7: Bayesian Analysis',
        ),
      ],
    },
    {
      year: 1280,
      label: '1280–1295: a separate South Island model window',
      title: 'Different materials do not become one voyage',
      text: 'The same study reports a South Island window of 1280–1295. The older 2008 rat-and-seed analysis inferred introduced-rat arrival around 1280 using a different evidence stream. These remain attributed findings, not a crew’s exact travel time or a route between two landfalls. The broader orientation around 1300 does not end voyaging or Māori history.',
      citations: [
        cite(
          'voyaging-chronology-2022',
          'PDF pp. 2–3: settlement and rat-proxy discussion',
        ),
        cite('voyaging-rat-seeds-2008', 'Abstract; Conclusions'),
      ],
    },
  ],
};

export const voyagingWorkDimension = {
  text: 'Voyaging joined canoe preparation, stored supplies, remembered observations and judgment at sea. Modern accounts make teaching and practice visible; dated settlement materials investigate a different question and do not recover every ancestral crew’s work.',
  citations: [
    cite('navigation', 'Ocean voyaging: Preparing to sail; Navigation at sea'),
    cite('voyaging-pvs-modern', 'Modern Methods: three components; teaching history'),
    cite('voyaging-tuaupiki-2022', 'Narrative research and sharing knowledge'),
  ],
};

/** Optional supplied text card for a later, separately authored journey. */
export const voyagingFamilyEvidence: NonNullable<Journey['familyEvidence']> = {
  title: 'A practiced skill, a material trace and a model',
  object: null,
  text: 'Taonui describes preparing food and water and using remembered stars and swells for navigation. The Polynesian Voyaging Society records Mau Piailug navigating Hōkūleʻa to Tahiti in 1976, and later teaching. A 2008 study used rat bones and gnawed seeds to infer introduced-rat arrival around 1280. A 2022 study modeled different North and South Island settlement windows. Practice, a dated trace, an inference and a modern voyage are different kinds of evidence; none supplies one exact ancestral crew or route.',
  citations: [
    cite('navigation', 'Ocean voyaging: preparation and navigation'),
    cite('voyaging-pvs-modern', 'Mau Piailug,1976 voyage and teaching'),
    cite('voyaging-rat-seeds-2008', 'Abstract; Conclusions'),
    cite('voyaging-chronology-2022', 'PDF pp. 2–3; p. 7: model reporting'),
  ],
  notice: [
    'Find a preparation task, an environmental sign and a dated material in the capsule.',
    'Separate the approximate settlement evidence from the 1976 voyage and the 2008/2022 study dates.',
  ],
  claimPrompt:
    'Explain what a practiced skill can show and what a dated seed can help investigate. Why does neither identify an exact ancestral canoe journey?',
  returnPrompt:
    'Name a skill learned by practice in your own family or community, and the evidence it might leave.',
  feedback:
    'Teaching and practice explain how knowledge can work and continue. Dated material supports an archaeological inference. A modern successful voyage does not date a medieval landing, and a seed does not identify a crew.',
};

export function applyEvidenceVoyaging(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'polynesian-voyaging');
  if (!s) throw new Error('Voyaging continuation requires the existing case');
  for (const source of voyagingEvidenceSources) {
    const index = c.sources.findIndex((row) => row.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  const renewals = {
    'nz-settlement':
      'Selected print-view The date debate/Reaching New Zealand, Genealogical dating/Drawbacks, Radiocarbon dating and rat-bone/gnawed-seed discussion reread. These older synthesis passages are distinguished from the 2008/2022 studies; broad global dates, speculative early visitors, DNA/identity conclusions and exact reconstructed sailing sequence are not newly adopted. No figure reused.',
    navigation:
      'Selected print-view Ocean voyaging (Preparing to sail; Navigation at sea), Locating land and Decline and renaissance reread. Practical signs and provisions are described as a synthesis, without exact universal crew/load/speed/distance figures. Modern 1976/1980 teaching history is checked against PVS; no 1976 instrument-free return claim adopted. No source compass, photograph, chart or cultural performance reproduced.',
  };
  for (const [id, scope] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw new Error(`Missing retained source ${id}`);
    const marker = `Voyaging selected consultation, ${consulted}: `;
    if (!source.scope.includes(marker)) {
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker}${scope}`;
      source.scope +=
        id === 'navigation'
          ? ' On 4 November the Navigation at sea passage was rechecked for stars and swells.'
          : ' On 4 November the settlement summary was rechecked for the approximate arrival window.';
      source.accessed = '2026-11-04';
    }
  }
  c.contexts ??= [];
  const contextIndex = c.contexts.findIndex(
    (row) => row.id === voyagingKnowledgeContext.id,
  );
  if (contextIndex < 0) c.contexts.push(voyagingKnowledgeContext);
  else c.contexts[contextIndex] = voyagingKnowledgeContext;
  s.contextIds = [...new Set([...(s.contextIds ?? []), voyagingKnowledgeContext.id])];
  s.summary =
    'Reaching Aotearoa depended on boats, provisions and learned judgment at sea. Archaeological dates investigate settlement; attributed accounts of teaching and practice explain knowledge that need not take the form of a written chart. Those sources have different purposes, and modern voyaging has its own history.';
  s.sections = [
    sec(
      'Preparation made sailing possible',
      'A canoe needed more than a destination. Taonui describes food taken aboard, water stored in gourds and rain caught during a voyage. Preparing and managing supplies made a continuing journey possible. His account also describes directions held in memory or song and departure bearings judged against land and stars. These are connected tasks: making a seaworthy vessel, provisioning it and learning how to keep a course. They explain practical work without assigning one cargo, crew size or departure point to every ancestral voyage.',
      cite('navigation', 'Ocean voyaging: Preparing to sail'),
    ),
    sec(
      'Keeping direction was practiced judgment',
      'The Polynesian Voyaging Society describes modern wayfinding as planning a reference course, tracking movement and finding land near the destination. Its account brings stars, sun and swells together, rather than treating one sign as an infallible instruction. It also names teachers: Mau Piailug of Satawal guided Hōkūleʻa to Tahiti in 1976; Nainoa Thompson learned with him and later navigated voyages. This documented modern practice shows knowledge being taught and used. It does not reproduce a particular medieval journey to Aotearoa.',
      cite(
        'voyaging-pvs-modern',
        'Modern Methods: teaching history and three components',
      ),
    ),
    sec(
      'A small trace can test a large date claim',
      'Wilmshurst and colleagues investigated an earlier-settlement argument by redating rat bones and comparing gnawed and intact seed cases. Their 2008 study linked introduced-rat presence around 1280 with human arrival. The material, its context and its preparation mattered to the conclusion. A 2022 analysis by Bunbury, Petchey and Bickler incorporated marine and terrestrial dates and distinguished modeled settlement windows for the North and South islands. Research can refine chronology while leaving the exact first landing, named crews and individual experiences unresolved.',
      cite('voyaging-rat-seeds-2008', 'Results and Discussion; Conclusions'),
      cite('voyaging-chronology-2022', 'PDF pp. 2–3: materials and settlement windows'),
    ),
    sec(
      'Knowledge continues through people',
      'In a 2022 account, Māori researcher Haki Tuaupiki describes examining waiata, proverbs and other narratives in te reo Māori, alongside work with navigator Jack Thatcher. He explains environmental and seasonal knowledge and sharing research at hui and marae. This makes language, teaching and community relationships part of the explanation, beyond a list of stars. A separately dated profile describes Thatcher joining Te Aurere in 1992 and being invited to train as a navigator. These are attributed perspectives and histories, rather than one account speaking for every Pacific community.',
      cite(
        'voyaging-tuaupiki-2022',
        'Narrative research; Thatcher; sharing at hui/marae',
      ),
      cite(
        'voyaging-thatcher-2021',
        'Crew membership and navigation-training paragraphs',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'A chronology depends on its materials and assumptions',
      'The 2022 paper does not simply average every published date. It screens contexts and materials, uses calibration curves and compares models. Its North Island 1250–1275 and South Island 1280–1295 windows are highest-probability-density intervals, normally reported at 68%, with model ages rounded to five years. They should not become certain years of departure and arrival. The authors also caution that small rat datasets and traces not directly associated with human activity need careful interpretation. This later analysis and the 2008 rat study are related evidence streams, not identical methods or interchangeable claims.',
      cite(
        'voyaging-chronology-2022',
        'PDF pp. 2–3: settlement/rat discussion; p. 7: Bayesian Analysis',
      ),
    ),
    sec(
      'Relationships do not become a simple calendar',
      'Te Ara explains how converting generations to years depends on assumptions about their length and selection. A changing calculation need not erase the relationships or meanings carried by a tradition. Tuaupiki’s account instead shows a scholar working through language, scattered records and conversations with a practicing navigator. Only that published account was consulted here: no complete waiata or tribal history has been independently translated. A reader should ask who is speaking, how the knowledge is transmitted and what question an archaeological date can actually answer.',
      cite('nz-settlement', 'Genealogical dating; Drawbacks of genealogical dating'),
      cite(
        'voyaging-tuaupiki-2022',
        'Literature, language expertise and work with Thatcher',
      ),
    ),
    sec(
      'Modern success is evidence with its own date',
      'The 1976 voyage demonstrates the working possibility of learned wayfinding under documented modern conditions. It is not a medieval crew list or proof of one ancestral route. Thompson’s Hawaiian star compass is a particular teaching system; its maker requires permission for reproduction. No compass is copied here.',
      cite(
        'voyaging-pvs-modern',
        'Teaching history; The Star Compass; reproduction notice',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'Practiced knowledge, a proxy and a dated model',
    introduction:
      'These are editorial paraphrases of selected publications, not a new translation of an ancestral narrative or a reanalysis of archaeological samples.',
    items: [
      {
        label: 'A rat-gnawed seed is a dated material, not a voyage log',
        text: 'The 2008 study compares dated rat bones and seed cases and infers introduced-rat arrival around 1280.',
        interpretation:
          'The human-arrival inference depends on the relationship between transported rats, deposits and measured ages. The trace does not identify a crew, exact landing, canoe or course; later studies can revise the model.',
        citations: [
          cite('voyaging-rat-seeds-2008', 'Abstract; rat/seed Results; Conclusions'),
        ],
      },
      {
        label: 'A range belongs to a specified model',
        text: 'The 2022 analysis separates North and South Island settlement windows and normally reports 68% highest-probability-density intervals.',
        interpretation:
          'The intervals are probabilistic estimates from selected material and assumptions. They are neither exact event dates nor a measured travel time between islands. The complete 1250–1300 case remains unchanged.',
        citations: [
          cite('voyaging-chronology-2022', 'PDF pp. 2–3; p. 7: Bayesian Analysis'),
        ],
      },
      {
        label: 'A named account makes teaching visible',
        text: 'Tuaupiki describes researching narratives in te reo Māori, working with Thatcher and sharing knowledge through community meetings.',
        interpretation:
          'This published account supports a particular explanation of practice and transmission. It is not a complete oral corpus, universal community position or permission to reproduce cultural knowledge, and it does not imply approval of this atlas.',
        citations: [
          cite(
            'voyaging-tuaupiki-2022',
            'Narrative research; language expertise; hui/marae',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Match the evidence to the question',
    duration: 'About 10 minutes',
    steps: [
      'Read the supplied capsule together. Write four cards: preparing supplies; practicing navigation; dating a seed; interpreting a model.',
      'Match each card to a question: how can a voyage be sustained; how can direction be judged; when was a material alive; what settlement window does the analysis support?',
      'Separate the approximate medieval settlement window, the 1976 modern voyage and the 2008/2022 study dates. Explain why a paper’s date is not a canoe’s date.',
      'Name a familiar skill learned through practice in your own family or community. What could another person observe, and what would they still need to learn from a teacher?',
    ],
    explanation: `Source capsule — editorial paraphrase: ${voyagingFamilyEvidence.text} The task uses the supplied text, not an absent image. It does not teach navigation at sea, copy a star compass or reenact a cultural performance. A dated seed informs a chronology only through context and interpretation; a practicing person can explain a working skill without supplying an exact medieval event date.`,
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian or Māori/community approval',
    scope:
      'Five new selected sources, two explicitly retained-and-renewed source scopes, layered explanation, a source-qualified reference and text-supplied family inquiry. The 1250–1300 interval is an estimate for settlement. The 4 November claim review separates the dating evidence from evidence of navigation. No new map, media, annotation, source figure or reconstructed voyage is added.',
    limitations: [
      'Only selected 2008 HTML and selected 2022 PDF text were consulted. Supplementary samples, calibration/code and original excavations were not independently reanalysed; PDF screenshots failed, so no figure pixels are claimed inspected.',
      'The complete ancestral narratives, original waiata, restricted knowledge and full research/recording corpus were not read, translated or performed. Attributed contemporary accounts are not all-Polynesian consensus or community approval.',
      'Modern PVS and Thatcher accounts retain their own periods. No single Great Fleet, exact ancestral course, named medieval crew, universal provisions or precise first landing is recovered.',
      'There is no existing image in this dossier. Te Papa’s Te Aurere page was encountered principally in te reo Māori, and source captions identify modern voyages/photos; no unverified translation, exposure date, reuse licence or new asset is adopted.',
      'PVS expressly requires permission to reproduce Thompson’s Hawaiian star compass. No source compass or geometry is copied or supplied as an ancient Aotearoa chart.',
      'The selected reference does not end voyaging or Māori identity at 1300. Independent historical/community review, real family use, screen-reader/device behavior and physical print remain open.',
    ],
  };
}
