import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite } from './content-helpers';

/** Selected consultation only; access limits are part of each source record. */
export const lapitaSources: Source[] = [
  {
    id: 'lapita-rove-temper',
    title:
      'Petrography of Sand Tempers in Lapita Potsherds from the Rove Peninsula, Viti Levu, Fiji',
    institution: 'Journal of Pacific Archaeology',
    author: 'William R. Dickinson and Patrick D. Nunn',
    url: 'https://pacificarchaeology.org/index.php/journal/article/view/DickinsonNunn',
    published: '2013-01-27',
    accessed: '2026-10-28',
    type: 'archaeology',
    scope:
      "Abstract only. Published pagination 15–31 is metadata, not a claim those pages were read. Appendix not consulted. Suggested nonlocal source islands are proposals. Shared designs do not make every object imported or recover an intermediary's itinerary. Landing page specifies CC BY 4.0. No paper figure copied.",
  },
  {
    id: 'lapita-teouma-diet',
    title:
      'Lapita Diet in Remote Oceania: New Stable Isotope Evidence from the 3000-Year-Old Teouma Site, Efate Island, Vanuatu',
    institution: 'PLOS ONE',
    author: 'Rebecca Kinaston and colleagues',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0090376',
    published: '2014-03-05',
    accessed: '2026-10-28',
    type: 'archaeology',
    scope:
      "Abstract; isotope/paleodiet reconstruction; site context; selected human-diet interpretation; Conclusions. Supplementary individual data not read or reanalyzed. No exact diet percentages, universal island economy, proven gendered task division or complete absence of gardening inferred. Article's linked licence verified as CC BY 4.0. Figure 2 retained solely for source/locator inspection; its inset's underlying cartographic credit is not independently established. Figure 2 pixels inspected as a source locator only; its inset cartographic credit was not independently established and no source map is reproduced.",
  },
  {
    id: 'lapita-nukuleka-uth',
    title: 'High Precision U/Th Dating of First Polynesian Settlement',
    institution: 'PLOS ONE',
    author: 'David Burley, Marshall I. Weisler and Jian-xin Zhao',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0048769',
    published: '2012-11-07',
    accessed: '2026-10-28',
    type: 'archaeology',
    scope:
      'Abstract; Nukuleka location; Sample Context; methods alteration screening; Results; Discussion. Supporting-information files not read. Date precision does not establish a departure point, boat track or the individual manufacture date of every associated sherd. Article explicitly states Creative Commons Attribution, without a versioned link on the consulted page. Do not silently relabel it CC BY 4.0. Figure 1 is a research map, not evidence of a precise sailing line. The actual medium-size Figure 1 map was inspected; the larger download was stopped at a 4 MB limit. Original excavation supplementary maps and individual analytic tables were not inspected.',
  },
  {
    id: 'lapita-tonga-dating',
    title:
      'Bayesian Modeling and Chronological Precision for Polynesian Settlement of Tonga',
    institution: 'PLOS ONE',
    author: 'David Burley, Kevan Edinborough, Marshall Weisler and Jian-xin Zhao',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0120795',
    published: '2015-03-23',
    accessed: '2026-10-28',
    type: 'archaeology',
    scope:
      "Sample selection; Bayesian Overlap Model; Discussion conclusions 1–3. Figure captions read; no model output reproduced, supplement downloaded or analysis rerun. Study used SHCal13. Its probability levels and author interpretation must remain attributed; not a fresh recalibration or final chronology. Article's linked CC BY 4.0 licence verified. No figure copied.",
  },
  {
    id: 'lapita-tonga-ceramic-change',
    title:
      'Early cessation of ceramic production for ancestral Polynesian society in Tonga',
    institution: 'PLOS ONE',
    author: 'David V. Burley, Sean P. Connaughton and Geoffrey Clark',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0193166',
    published: '2018-02-23',
    accessed: '2026-10-28',
    type: 'archaeology',
    scope:
      "Abstract; Context; chronology boundary and Discussion; settlement distribution; concluding ceramic-loss interpretation. Supporting files not read. Tongan result, not universal Pacific endpoint. Proposed mechanisms for ceramic loss are not established causes. Later date is contextual follow-through beyond the unchanged case endpoint. Article's linked CC BY 4.0 licence verified. No figure copied.",
  },
  {
    id: 'lapita-oceanic-linguistics',
    title: 'Locating Proto Oceanic, The lexicon of Proto Oceanic, volume 2',
    institution:
      'The lexicon of Proto Oceanic, edited by Malcolm Ross, Andrew Pawley and Meredith Osmond; CLLD / Max Planck Institute online edition',
    author: 'Andrew Pawley',
    url: 'https://tlopo.clld.org/contributions/2-2',
    accessed: '2026-10-28',
    type: 'scholarship',
    scope:
      'Sections 2–4, especially shared linguistic innovations, subgroup distributions and pots reaching non-Austronesian communities; selected section 5. Not all lexicon volumes or underlying original studies consulted. Historical scholarly reconstruction with disagreements. Do not equate all pottery users with a single language or contemporary identity. Online edition explicitly CC BY 4.0. No map image extracted.',
  },
];

export const lapitaContext: HistoricalContext = {
  id: 'lapita-islands-context',
  title: 'Lapita island communities and changing pottery',
  region: 'Southeast Asia/Oceania',
  interval: {
    start: -1500,
    end: -400,
    label: 'c. 1500–400 BCE: selected island sequences and later Tongan change',
    precision: 'approximate',
    note: 'A teaching frame across different islands, not one polity or continuous voyage. The broad Bismarck orientation differs in precision from site-specific models. Later Tongan ceramic change extends beyond the unchanged c. 1500–500 BCE case. Cal BP denotes years before 1950; BCE equivalents are rounded. Regional phases overlap.',
  },
  summary:
    'Pottery production, coastal provisioning and dated settlement evidence reveal different parts of island community history. A change in ceramic practice is not the end of a people, while each island retains its own sequence.',
  subjectIds: ['lapita'],
  citations: [
    {
      source: 'lapita-voyaging',
      locator: 'Page 3: regional sequence and provisioning',
    },
    {
      source: 'lapita-tonga-dating',
      locator: 'Bayesian Overlap Model; Discussion',
    },
    {
      source: 'lapita-tonga-ceramic-change',
      locator: 'Abstract; Context; Discussion: latest phase boundary',
    },
  ],
  phases: [
    {
      year: -1500,
      label: 'Around 1500 BCE: broad regional orientation',
      title: 'Bismarck communities and the pottery complex',
      text: 'The institutional synthesis places Lapita emergence in the Bismarcks. This marker does not identify one starting village, a first-ever inhabitant or an exact founding year.',
      citations: [
        {
          source: 'lapita-voyaging',
          locator: 'Opening paragraph',
        },
      ],
    },
    {
      year: -1100,
      label: 'Broad 1100–800 BCE expansion window',
      title: 'Different settings in Remote Oceania',
      text: 'The regional account describes movement toward Fiji and West Polynesia through several generations. Settlement, food procurement and introduced resources varied; not every island began the same economy at once.',
      citations: [
        {
          source: 'lapita-voyaging',
          locator:
            'Lapita in Remote Oceania: migration window, coastal settlement and food',
        },
      ],
    },
    {
      year: -900,
      label: 'Around 900–750 BCE: rounded orientation to Tongan site models',
      title: 'Tongan island groups have their own dated sequences',
      text: 'The 2015 analysis places early Tongatapu occupation before expansion to other principal groups, with overlapping first-settlement estimates for Ha’apai and Vava’u. Site samples and probability levels require their own explanation; no crew’s itinerary is reconstructed.',
      citations: [
        {
          source: 'lapita-tonga-dating',
          locator: 'Bayesian Overlap Model; Discussion conclusions 1–3',
        },
      ],
    },
    {
      year: -750,
      label: 'Around 750–400 BCE: selected later Tongan context',
      title: 'Plainware continues after decorated pottery',
      text: 'Undecorated ceramics continued in the Tongan sequence. The 2018 authors argue that manufacture had ceased by about 400 BCE. That latest bound is contextual follow-through beyond this case, not a universal Pacific endpoint or established cause of change.',
      citations: [
        {
          source: 'lapita-tonga-ceramic-change',
          locator: 'Abstract; Discussion: maximum 2700–2350 cal BP phase interval',
        },
      ],
    },
  ],
};

const renewedScopes: Record<string, string> = {
  lapita:
    'Named 2002 Wagelie essay read again on 28 October 2026: title/frame, toothed stamping before firing and proposed food-related uses. Further-reading books not read. Broad ancestral equations, exact recovered voyages, certain motif meanings and a direct equation with contemporary designs are not adopted. The full existing c. 1500–500 BCE case interval, including note and precision, is preserved. No essay image copied; its displayed later Fijian barkcloth is not presented as Lapita pottery.',
  'lapita-voyaging':
    'Geoff Irwin’s named Te Ara page 3 read again on 28 October 2026: opening Bismarck orientation, broad 1100–800 BCE movement toward Fiji/West Polynesia, coastal settlement, transported plants/animals and differing early subsistence interpretations. No full migration volume, exact sailing route or uniform transported farming package inferred. Genetic claims, motivations and universal population-growth assertions are not adopted. No Te Ara image or map copied.',
};

/** Preserve the bounded case and objects while adding separate reading/reference layers. */
export function applyLapita(c: Corpus) {
  const s = c.subjects.find((subject) => subject.id === 'lapita');
  if (!s) throw new Error('Lapita expansion requires the existing lapita dossier');
  for (const [id, scope] of Object.entries(renewedScopes)) {
    const source = c.sources.find((source) => source.id === id);
    if (!source) throw new Error(`Lapita expansion requires existing source ${id}`);
    source.scope = scope;
    source.accessed = '2026-10-28';
  }
  for (const source of lapitaSources) {
    const existing = c.sources.find((row) => row.id === source.id);
    if (existing) Object.assign(existing, source);
    else c.sources.push({ ...source });
  }
  const contextIndex = (c.contexts ?? []).findIndex(
    (context) => context.id === lapitaContext.id,
  );
  if (contextIndex < 0) c.contexts = [...(c.contexts ?? []), lapitaContext];
  else c.contexts![contextIndex] = lapitaContext;
  s.contextIds = [...new Set([...(s.contextIds ?? []), lapitaContext.id])];
  s.question = 'What work turned a sea crossing into a lasting island community?';
  s.summary =
    'Potters, navigators and food producers helped establish communities across different island environments. Stamped designs, raw materials, dated tools and food evidence reveal different parts of that work. Their histories continued when decorated pottery changed; a shared pattern is a starting point for investigation, rather than a recovered voyage.';
  s.sections = [
    {
      title: 'A repeated mark became a larger design',
      text: 'Lapita decoration began with practical actions. A potter pressed a toothed tool into clay before firing, combining small impressions into repeated bands and more elaborate figures. The Met describes vessels that may have cooked, served or stored food. Making such an object joined a useful container with choices about its surface. Repetition required control of spacing and direction: a pattern was something a maker constructed, rather than a label that appeared automatically on every pot.',
      citations: [
        {
          source: 'lapita',
          locator: 'Ceramic technique and proposed vessel uses',
        },
      ],
    },
    {
      title: 'Settlement joined voyaging with provisioning',
      text: 'Irwin’s regional account places the Lapita complex in the Bismarck Archipelago around 1500 BCE and movement toward Fiji and West Polynesia especially around 1100–800 BCE. These were different communities and stages, not one arrival everywhere. Coastal settings offered access to boats and marine resources. Transporting useful plants and animals could help establish livelihoods, while catching and gathering food sustained people locally. The timing and combination differed: the earliest eastern communities cannot simply be assigned an identical, fully established farming package.',
      citations: [
        {
          source: 'lapita-voyaging',
          locator:
            'Emergence; Lapita in Remote Oceania; transported foods and differing subsistence interpretations',
        },
      ],
    },
    {
      title: 'Potters also worked with local materials',
      text: 'A shared decorative tradition did not require every vessel to arrive by canoe. Dickinson and Nunn examined sand temper in pottery from Fiji’s Rove Peninsula. Most sampled sherds used related local sands; a few contained nonlocal volcanic material. The authors interpret the latter as ceramic transfer. Distinguish that interpretation from the observed temper: identifying nonlocal material does not by itself rule out movement of raw ingredients or name a carrier. Looking inside the fabric changes the question from whether two designs resemble each other to how particular materials and finished objects may have moved.',
      citations: [
        {
          source: 'lapita-rove-temper',
          locator: 'Published abstract: local temper groups and three nonlocal sherds',
        },
      ],
    },
    {
      title: 'Meals made an island habitable',
      text: 'At Teouma on Efate, researchers investigated dietary protein through bone-collagen isotopes and local food baselines. Their interpretation combines reef and inshore resources, wild terrestrial animals and domestic animals. This makes food acquisition and animal care part of settlement history, alongside navigation. It does not supply a complete menu: low-protein plant foods can be less visible in this kind of measurement. The study concerns one early Vanuatu community and must retain that setting when compared with other islands.',
      citations: [
        {
          source: 'lapita-teouma-diet',
          locator:
            'Abstract; Stable isotope analysis and paleodietary reconstruction; Conclusions',
        },
      ],
    },
    {
      title: 'Changing pottery did not end community history',
      text: 'Tonga’s sequence shows why the pottery frame needs a longer context. Decorated vessels gave way to plain forms, while settlements occupied a wider range of places, including island interiors. A 2018 study argues that local ceramic production had ceased by about 2350 calibrated years before 1950, approximately 400 BCE. That estimate falls after this dossier’s 500 BCE endpoint. It marks a proposed change in material practice, not the disappearance of islanders or a universal stage that every Pacific society had to follow.',
      citations: [
        {
          source: 'lapita-tonga-ceramic-change',
          locator:
            'Abstract; Context; Ancestral Polynesian society and its implications: settlement distribution',
        },
      ],
    },
  ];
  s.deeperReading = [
    {
      title: 'A dated tool is not a dated voyage',
      text: 'At Nukuleka, researchers dated Acropora coral files using uranium–thorium measurements. A sample from beach sand below a midden helped position early occupation near 890 BCE. The argument connects material, use and stratigraphic context; it does not date a ship’s departure. The study screened for alteration, and some dates were rejected. Samples redeposited in a later mound cannot be treated as if they remained in their original occupation layer.',
      citations: [
        {
          source: 'lapita-nukuleka-uth',
          locator: 'Sample Context; Materials and Methods; Results: Strata II–IV',
        },
      ],
    },
    {
      title: 'An island sequence has overlapping uncertainties',
      text: 'The 2015 Tongan analysis combined different dated materials and modeled the principal island groups separately. Its estimates placed expansion beyond Tongatapu within succeeding generations, while the first-settlement ranges for Ha’apai and Vava’u overlapped. Limited Vava’u samples constrained the proposed order. A useful timeline therefore displays an attributed model and uncertainty, rather than turning three named islands into an exact recovered itinerary for one crew.',
      citations: [
        {
          source: 'lapita-tonga-dating',
          locator: 'Bayesian Overlap Model; Discussion, conclusions 2–3',
        },
      ],
    },
    {
      title: 'Pottery and language answer related questions differently',
      text: 'Pawley argues for connections between Lapita archaeology and Oceanic language history through distributions, shared linguistic innovations and material terminology. He also notes that pottery could enter communities speaking other languages. A sherd does not record its maker’s speech. Keep the linguistic argument visible as a reconstruction, rather than use a decorative style as an ethnic badge or an automatic identification of every person who handled it.',
      citations: [
        {
          source: 'lapita-oceanic-linguistics',
          locator:
            'Section 4: subgroup distribution, shared innovations and pottery in non-Austronesian communities',
        },
      ],
    },
    {
      title: 'Follow a mechanism across the comparison',
      text: 'Compare how a community obtained useful materials, supplied meals and renewed practical skills. Those questions connect this case with the other coastal inquiries without turning their different histories into one route. For each answer, name the evidence that makes the proposed work visible.',
      citations: [
        {
          source: 'lapita-rove-temper',
          locator: 'Abstract',
        },
        {
          source: 'lapita-voyaging',
          locator: 'Settlement and food',
        },
      ],
    },
  ];
  s.evidenceReading = {
    title: 'Materials, dates and food need different readings',
    introduction:
      'These are editorial paraphrases of the selected studies, not ancient quotations. Match the inference to the material and context actually examined.',
    items: [
      {
        label: 'Observed temper and interpreted transfer',
        text: 'The Rove abstract identifies mostly local temper and a few sherds containing nonlocal volcanic material. Its authors interpret the latter as transfer of pottery.',
        interpretation:
          'Keep the interpretation attributed. Material identification alone neither names a carrier nor rules out movement of raw ingredients; a decorative resemblance is a different observation.',
        citations: [
          {
            source: 'lapita-rove-temper',
            locator:
              'Published abstract: local temper groups and three nonlocal sherds',
          },
        ],
      },
      {
        label: 'A coral tool in a deposit',
        text: 'The Nukuleka study used uranium–thorium measurements on coral files, screened alteration and distinguished primary occupation deposits from redeposited mound fill.',
        interpretation:
          'An associated tool and its deposition help position settlement. This is not an exact departure date, the age of every sherd or a record of one sailing course.',
        citations: [
          {
            source: 'lapita-nukuleka-uth',
            locator: 'Sample Context; Materials and Methods; Results: Strata II–IV',
          },
        ],
      },
      {
        label: 'Protein sources rather than every meal',
        text: 'The Teouma study analyzed forty-nine adults against food baselines and declined exact dietary percentages.',
        interpretation:
          'The result investigates dietary protein in this community. It is not a complete menu, an individual recipe or an identical provisioning system for every island.',
        citations: [
          {
            source: 'lapita-teouma-diet',
            locator:
              'Abstract; Stable isotope analysis and paleodietary reconstruction: exact-proportion limitation',
          },
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Make a repeat; investigate a connection',
    duration: '10–15 minutes',
    steps: [
      'Read the first section’s description of toothed stamping. An adult can read it aloud. Draw your own small three-mark shape.',
      'Repeat your mark across a paper band. Change its spacing or direction, then explain how the small actions make a larger pattern.',
      'Read the Rove material-study paraphrase. Name evidence needed before using two actual pottery finds to investigate movement between places.',
    ],
    explanation:
      'Your paper band demonstrates a possible making action, not a recovered ancient motif or tool. The supplied account describes a technique; dated archaeological contexts and material study support different questions about movement. No particular voyage is reconstructed.',
  };
  s.dimensions['material-work'] = {
    text: 'Pottery manufacture and food procurement combined practical skills with local resources and some moved materials. Shared decoration, material origin and the work of provisioning require different evidence.',
    citations: [
      cite('lapita', 'Ceramic technique and proposed uses'),
      cite('lapita-rove-temper', 'Published abstract'),
      cite('lapita-teouma-diet', 'Conclusions'),
    ],
  };
  s.dimensionKeys = Object.keys(s.dimensions);
  s.terms = [...new Set([...s.terms, 'provisioning', 'stratigraphy'])];
  s.returnPrompt =
    'Choose one making or provisioning task. Name its evidence and explain what additional record would help investigate movement between places.';
  s.review = {
    consultedOn: '2026-10-28',
    reviewer:
      'Codex source consultation and self-review; not independent historian approval',
    scope:
      'Bounded manufacturing, provisioning and island-sequence account; main/deeper/evidence reading, text-supplied family inquiry and separate phased context. The entire original case interval, object IDs, dimensions and claims remain; no media or historical relation is added by this module.',
    limitations: [
      'The complete c. 1500–500 BCE case interval remains untouched, including its existing note and precision. The separate context extends to a later attributed Tongan ceramic boundary.',
      'Rove consultation is limited to the published abstract and metadata; the article body and appendix were not read. Ceramic transfer is the authors’ interpretation rather than an automatic conclusion from nonlocal temper.',
      'Selected publisher HTML sections support the chronological and dietary accounts. Supplementary individual tables and models were not reanalyzed; older calibration choices and differing probability levels remain part of the studies.',
      'The isotope study concerns dietary protein in forty-nine Teouma adults. No complete menu, exact diet percentages, universal island subsistence or fixed gendered work roles inferred.',
      'Linguistic reconstruction, pottery classification and contemporary identities remain distinct. No sherd is treated as a transcript of its user’s speech.',
      'No exact voyage, named crew, boat reconstruction, original motif meaning, complete governing system or single cause of ceramic cessation established.',
      'No image is supplied by this module. The family task uses the supplied technique/material text and an original paper exercise. A modern plaster cast, if selected separately, must retain its own modern date/material rather than become ancient clay.',
      'Geographic locators and any modern artwork require separate source/rights and rendering checks. No independent historian/community, real family, screen-reader, physical-device or physical-print acceptance established.',
    ],
  };
}
