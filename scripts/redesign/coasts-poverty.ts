import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, interval, sec } from './content-helpers';

const chronology = 'pp-chronology-2023';
const booklet = 'pp-louisiana';
const sources: Source[] = [
  {
    id: chronology,
    title:
      'Convergence at Poverty Point: a revised chronology of the Late Archaic Lower Mississippi Valley',
    author: 'Seth B. Grooms, Grace M.V. Ward and Tristram R. Kidder',
    institution: 'Antiquity 97(396), 1453–1469; Cambridge University Press',
    published: '25 October 2023',
    url: 'https://www.cambridge.org/core/journals/antiquity/article/convergence-at-poverty-point-a-revised-chronology-of-the-late-archaic-lower-mississippi-valley/121431E2E3469A819185F44BF7AB81EA',
    type: 'archaeology',
    accessed: '2026-10-28',
    scope:
      'Selected publisher HTML: Abstract, Introduction, Overview, Poverty Point chronology, Jaketown description, Field/Chronological modelling methods, selected Phase 3 construction, Discussion and Conclusion. Not the entire bibliography, supplementary tables or underlying excavation reports; no model rerun or independent sample-exclusion audit. The modeled earlier Jaketown sequence is not assigned to Poverty Point or used to extend the stable case. The authors distinguish similar material traits, site-specific dates and a proposed convergence interpretation; political organization and the pace of the whole Poverty Point complex remain debated. No exact universal construction duration, recovered trade itinerary or demonstrated complete social equality inferred. Actual Figure 2 pixels and caption inspected: modern LiDAR elevation model by K. Ervin, five labeled mounds A/B/C/E/F, six ridges and plaza. Mound D is not labeled. Source legend gives NAD 83, a 0–420 m scale and 50 cm contour interval; acquisition date not supplied. Article CC BY 4.0, with no separate figure restriction identified; the figure is credited and converted without cropping or graphic enhancement.',
  },
  {
    id: 'pp-heritage',
    title: 'Monumental Earthworks of Poverty Point',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/1435/',
    type: 'archaeology',
    accessed: '2026-10-28',
    scope:
      'Description/Brief synthesis and published property-reference coordinates consulted through the web source. A later direct HTML snapshot request returned 403; that failed download is not a complete dossier reading. N32°38′13″ W91°24′23″ is a property/site reference, not a mound centroid or excavation position; no datum or metre accuracy inferred. No nomination-volume, cadastral-boundary or all linked bibliography consultation claimed. No UNESCO photograph or plan copied; page-text licensing is not a blanket image permission.',
  },
  {
    id: 'jaketown-locator',
    title: 'Jaketown — Mississippi Mound Trail',
    institution: 'Mississippi Department of Archives and History',
    url: 'https://trails.mdah.ms.gov/jaketown',
    type: 'catalogue',
    accessed: '2026-10-28',
    scope:
      'Named archaeological-site page and its published map GeoJSON/POINT locator read. Source coordinates [-90.486136,33.23694373] are rounded for a regional site pin, not an individual mound or sampled unit. The similarly named modern hamlet is not substituted. Older narrative chronology/period labels are not silently combined with the 2023 primary chronological model; use that study for the comparison. No source map, photograph, route or protected geometry copied.',
  },
];

const context: HistoricalContext = {
  id: 'poverty-earthworks-context',
  title: 'Poverty Point: building, provisioning and maintaining a place',
  region: 'Americas',
  interval: interval(
    -1700,
    -1100,
    'Main-site orientation, c.1700–1100 BCE',
    'Selected NPS/Louisiana main-complex frame, not the lifespan of a people or the full regional archaeological tradition. Broad phase anchors do not precisely date every earthwork. The booklet rounds Mound A to 1350 BCE on p. 4 and 1300 BCE on p. 10; recent scholarship debates the pace of the whole complex. Earlier Jaketown and later Mound D have their own histories outside this frame.',
  ),
  summary:
    'A large earthwork landscape depended on earthmoving, food, materials and continuing care. Different mounds, sampled deposits and later surface alterations require distinct histories.',
  subjectIds: ['poverty-point'],
  citations: [
    cite('pp-nps', 'Residential/ceremonial earthworks and 1700–1100 BCE frame'),
    cite(booklet, 'Printed pp. 4, 10–13 and 17: sequence, different mounds and upkeep'),
    cite(chronology, 'The chronology of the Poverty Point site'),
  ],
  phases: [
    {
      year: -1700,
      label: 'Around 1700 BCE: selected early earthwork orientation',
      title: 'Mound B and earlier activity',
      text: 'The state account places the beginning of Mound B around this time. Building involved prepared ground and successive layers. This is a selected mound history, not one founding day for the entire community.',
      citations: [cite(booklet, 'Printed pp. 4 and 12: Mound B')],
    },
    {
      year: -1500,
      label: 'Across the main occupation, c.1700–1100 BCE',
      title: 'Ridges, plaza and continuing work',
      text: 'People occupied and changed a landscape of mounds, ridges and open space. The plaza required filling low areas and controlling gullies. This broad orientation does not settle the debated timing of all ridge construction or assign every feature to one moment.',
      citations: [
        cite(booklet, 'Printed pp. 4 and 17: sequence and plaza upkeep'),
        cite(chronology, 'The chronology of the Poverty Point site'),
      ],
    },
    {
      year: -1300,
      label: 'Later second millennium BCE: approximate Mound A orientation',
      title: 'Peak, platform and ramp have a sequence',
      text: 'The booklet uses approximate 1350 and 1300 BCE orientations in different passages and distinguishes the peak, platform and connecting ramp. A rapid episode proposed for one part is not a single measured duration for every earthwork.',
      citations: [
        cite(booklet, 'Printed p. 4 and pp. 10–11: Mound A and its parts'),
        cite(chronology, 'Overview; The chronology of the Poverty Point site'),
      ],
    },
    {
      year: -1200,
      label: 'Around 1200 BCE in the state sequence',
      title: 'Mound F belongs to the later main-complex story',
      text: 'The booklet places Mound F late in its Late Archaic sequence. This is different from Mound D, built around 700 CE long after the main frame; similar-looking surface features need not share a date.',
      citations: [cite(booklet, 'Printed pp. 4 and 13: Mounds F and D')],
    },
    {
      year: -1100,
      label: 'End of the selected main-site frame, c.1100 BCE',
      title: 'A teaching boundary does not end Indigenous history',
      text: 'The retained frame bounds this inquiry. Later building, land use and archaeological research remain part of the place’s history, rather than extending every old object to one continuous period.',
      citations: [
        cite('pp-nps', 'Main-site dates and modern naming'),
        cite(booklet, 'Printed p. 13: later Mound D and nineteenth-century land use'),
      ],
    },
  ],
};

export function applyPovertyPoint(c: Corpus) {
  for (const source of sources) c.sources.push(source);
  const nps = c.sources.find((s) => s.id === 'pp-nps')!;
  nps.accessed = '2026-10-28';
  nps.published = '23 July 2020 page update';
  nps.scope =
    'Named NPS article read again: complete main account of the elevated site,1700–1100 BCE residential/ceremonial frame, hunter-fisher-gatherer food sources, materials and ongoing research. Its speculative capital/status interpretation and exact earth-volume/distance/priority claims are not adopted. The lead Susan Guice photograph is not reused on the assumption that every NPS-hosted image is public domain. No linked nomination or complete excavation archive read.';
  const state = c.sources.find((s) => s.id === booklet)!;
  state.accessed = '2026-10-28';
  state.author =
    'Robert Connolly, Diana Greenlee, Nancy Hawkins, Chip McGimsey and Joel Zovar';
  state.published = '1 October 2014';
  state.scope =
    'Selected 32-page state booklet: printed/PDF pages 2, 4, 7, 10–13, 17, 24–25 and 32 inspected as actual pixels; trade/travel text on pp. 5–6 also read. Printed and PDF numbering match. Food is p. 7; pp. 22–23 concern other artifact classes, while pottery/PPO preparation is pp. 24–25. Text columns interleave around p. 12, so staged-mound statements were checked against pixels. Mound A’s approximate 1350/p. 4 and 1300/p. 10 orientations are retained as source conventions, not forced into an exact date. A proposed rapid platform episode is not assigned to the whole complex; broader pace remains debated. Mound D around 700 CE, old artifacts redeposited in later fill, nineteenth-century road damage and plaza maintenance remain distinct. No priority, universal abundance/equality, exact worker/basket census or astronomical-alignment claim adopted. Copyright 2014 Louisiana Division of Archaeology; individual photographs/reconstructions have credits. No booklet photograph, Herb Roe painting, measured geometry or source figure copied or traced; no blanket reusable image licence verified.';
  const gibson = c.sources.find((s) => s.id === 'pp-gibson')!;
  gibson.accessed = '2026-10-28';
  gibson.published = '1983; corrected printing 1985';
  gibson.scope =
    'Selected Food Preparation text, printed pp. 21–22, Figure 10 caption and edition/rights metadata read again. Earlier p. 20 consultation is not presented as a new full-page reading. The inherited Brian Cockerham photograph was visually inspected and its bytes preserved. It shows six labeled heating-object shapes but supplies no individual manufacture dates or findspots. Modern cooking experiments are summarized by this older synthesis; the 1975 original reports were not consulted. No exact temperature, universal menu, invented earth-oven priority or all-regional agricultural system inferred. The older regional chronological category remains separate from the narrower current main-site frame. Digital catalogue identifies public-domain status in the USA; that is not a newly established worldwide copyright determination.';
  c.contexts = [...(c.contexts ?? []), context];
  const s = c.subjects.find((s) => s.id === 'poverty-point')!;
  s.contextIds = [...(s.contextIds ?? []), context.id];
  s.summary =
    'Poverty Point’s American Indian builders joined monumental earthmoving with the continuing work of obtaining food, making tools and maintaining shared space. Local soil became both building material and shaped heating objects. The surviving landscape and small objects explain different parts of that work; neither supplies a complete political system or one construction date.';
  s.sections = [
    sec(
      'A raised place beside useful lowlands',
      'People built the complex on Macon Ridge above nearby floodplain environments. Wetlands, woods and rivers offered different foods and materials, while the elevated ground supported settlement. The NPS bounds the main residential and ceremonial earthworks around 1700–1100 BCE. This is the history of a selected place, not the lifespan of an Indigenous people or every site grouped under the archaeological name Poverty Point.',
      cite('pp-nps', 'Site setting, main dates and hunter-fisher-gatherer resources'),
    ),
    sec(
      'Moving earth required a sequence of tasks',
      'The state account describes builders preparing the ground for Mound B, adding layers and finally covering its surface. Such work involved obtaining, carrying and placing soil, with decisions about where each addition belonged. Mound A had a peak, platform and connecting ramp with a different sequence. A finished outline gathers these histories into one view; it does not show that every part was made together or reveal exactly how workers were recruited.',
      cite(booklet, 'Printed pp. 10–12: Mounds A andB'),
    ),
    sec(
      'Open space also had to be maintained',
      'The central plaza was built and cared for, rather than simply left empty between the ridges. People filled low spots and checked spreading gullies. Buried postholes record repeated setting of large wooden posts. These observations connect gathering space with recurring physical work. A modern LiDAR terrain model shows surviving surface forms; excavated deposits help establish changes that no overhead view can date alone.',
      cite(booklet, 'Printed p. 17: plaza maintenance and posts'),
      cite(chronology, 'Figure 2 and caption; Overview'),
    ),
    sec(
      'Soil could help turn gathered food into meals',
      'The selected photograph shows shaped, baked-earth heating objects. The state account explains how heated examples supplied stored heat in earth ovens; their placement and number affected cooking. Hunting, fishing and gathered plants supplied food without the crop dependence often assumed necessary for monumental building. Charred plant remains and surviving bones support that account, while poor bone preservation limits a complete menu. Preparing and sharing meals belonged alongside earthmoving in community life.',
      cite(booklet, 'Printed p. 7: food and preservation; pp. 24–25: heating objects'),
      cite('pp-gibson', 'Food Preparation, printed p21 and Figure 10'),
    ),
    sec(
      'Useful materials connected different places',
      'Not all desired stone was readily available near the site. People acquired nonlocal material for tools and ornaments; the state account discusses both bringing goods in and traveling to obtain them. Material identification helps investigate those relationships without recovering a single trader’s itinerary. Recent dating at Jaketown also challenges the assumption that similar objects everywhere must have spread outward from Poverty Point, the type-site that gives the archaeological category its name.',
      cite(booklet, 'Printed pp. 5–6: Trade and Travel'),
      cite(chronology, 'Abstract; Discussion; Conclusion'),
    ),
  ];
  s.deeperReading = [
    sec(
      'An old object can enter later fill',
      'Mound D was built around 700 CE, long after this case’s main earthwork period. Builders reused surface soil containing older Poverty Point artifacts. An old object therefore cannot by itself date the mound that contains it. Excavated relationships and later land-use evidence matter alongside artifact type. The supplied terrain figure does not label Mound D and must not become a complete ancient plan.',
      cite(booklet, 'Printed p. 13: Mound D and redeposited older artifacts'),
      cite(chronology, 'Figure 2: actual labels and modern terrain model'),
    ),
    sec(
      'Different work leaves different evidence',
      'Gibson’s older synthesis summarizes modern experiments with heating objects. Those experiments investigate a proposed function by testing how heat behaves; the photograph itself shows shapes. The original experimental reports have not been consulted here, so no measured temperature or recovered recipe is supplied. Compare that question with plaza maintenance: filled depressions and buried posts concern changes to space, rather than the performance of one cooking object.',
      cite('pp-gibson', 'Printed pp. 21–22: modern experiments and Figure 10'),
      cite(booklet, 'Printed p. 17: plaza upkeep'),
    ),
    sec(
      'Construction pace depends on what is being dated',
      'The state booklet separates Mound A’s peak, platform and later ramp. Recent scholarship reports rapid episodes but also records disagreement about the pace of the whole complex. Ask whether an argument concerns one mound part, one sampled ridge segment or centuries of site use. Soil layers and signs of surface exposure can constrain a sequence without naming every builder, a recruitment rule or the same duration for all features.',
      cite(booklet, 'Printed pp. 10–11: Mound A parts and proposed platform episode'),
      cite(chronology, 'The chronology of the Poverty Point site'),
    ),
    sec(
      'A named archaeological category does not dictate an origin',
      'Grooms, Ward and Kidder connect dated deposits at Jaketown with practices later visible at Poverty Point. Their chronological model challenges a simple outward-diffusion account. The methods describe sample selection and overlapping modeled ranges; the supplementary exclusions were not independently audited here. Keep the researchers’ convergence interpretation separate from the dates and material observations supporting it. An earlier related practice does not make every later community identical or resolve Poverty Point’s political organization.',
      cite(chronology, 'Chronological modelling methods; Discussion; Conclusion'),
    ),
  ];
  s.evidenceReading = {
    title: 'Match a claim with the scale of its evidence',
    introduction:
      'These editorial paraphrases separate an observed shape, a tested function, a surface model and an archaeological interpretation. They are not quotations.',
    items: [
      {
        label: 'A photograph and a functional test',
        text: 'The old Figure 10 labels six baked-clay shapes. Gibson separately summarizes modern cooking experiments.',
        interpretation:
          'The image supports observing grooves and outlines. Function requires context and testing; the image does not preserve an exact recipe, individual date or named cook.',
        citations: [cite('pp-gibson', 'Printed p21 and Figure 10')],
      },
      {
        label: 'A modern surface with a longer history',
        text: 'Ervin’s LiDAR figure labels mounds A, B, C, E and F, six ridges and the plaza. It models ground height, with a north arrow and scale; Mound D is not labeled.',
        interpretation:
          'Colour represents elevation, not ancient building materials. Modern surface geometry cannot assign every feature to one date. The booklet’s later Mound D and road damage show why separate historical evidence matters.',
        citations: [
          cite(chronology, 'Figure 2: actual pixels, caption and legend'),
          cite(booklet, 'Printed p. 13: later building, redeposition and road'),
        ],
      },
      {
        label: 'Earlier material does not prove outward diffusion',
        text: 'The 2023 study models an earlier related sequence at Jaketown and questions treating every similar assemblage as simultaneous with the type-site.',
        interpretation:
          'Local dating changes the proposed historical explanation. Earlier layers, later mound fill and a named regional category remain different evidence; the model is not a recovered journey or a complete account of governance.',
        citations: [cite(chronology, 'Abstract; Methods; Discussion; Conclusion')],
      },
    ],
  };
  s.familyActivity = {
    title: 'A small shape can open a practical question',
    duration: '10–15 minutes',
    steps: [
      'Find a grooved shape and a smoother shape in the supplied heating-object photograph. Point or describe them; an adult can read the caption.',
      'Use the explanation to tell how heated objects could help prepare food. Draw or talk through the task without inventing a recipe.',
      'Choose one question the photograph cannot answer. Name the kind of evidence you would need next.',
    ],
    explanation:
      'Observing a shape and explaining a proposed use are different steps. The photograph and cited experimental summary start the inquiry without identifying a particular cook or meal.',
  };
  s.dimensions.maintenance = {
    text: 'Filling plaza depressions and controlling gullies sustained shared space. Building and maintaining it required recurring work, while particular labor obligations remain uncertain.',
    citations: [cite(booklet, 'Printed p. 17: plaza upkeep')],
  };
  s.dimensions['material-work'] = {
    text: 'People shaped local fine soil into heating objects while acquiring valued stone from elsewhere. Material choice and testing help distinguish a practical function from appearance alone.',
    citations: [
      cite(booklet, 'Printed pp. 5–7 and 24–25'),
      cite('pp-gibson', 'Printed p21: modern experiments and Figure 10'),
    ],
  };
  s.returnPrompt =
    'Choose a heating object and a built space. What work can you explain from each, and what new source would improve that explanation?';
  s.review = {
    consultedOn: '2026-10-28',
    reviewer:
      'Codex source consultation and internal author QA; not independent historian approval',
    scope:
      'Bounded main/deeper/evidence account, concrete family inquiry, separate phased context and selected modern terrain/source interpretation. Existing full case interval, claims and inherited photograph preserved.',
    limitations: [
      'Selected state booklet pages and primary article sections only; underlying 1975 experiments, full excavation reports and supplementary chronology tables not independently consulted or reanalyzed.',
      'No precise whole-site construction duration, exact recruitment system, universal social equality, complete menu or all-regional origin established. Similar objects require local dating.',
      'The LiDAR figure is a modern elevation model with an unreported acquisition date and a small original legend; its readable caption/text equivalent is essential. No protected booklet figure is copied.',
      'No independent historian, real adult/family, human screen-reader, physical-device or physical-print acceptance claimed. Broader regional and continuing community histories remain research tasks.',
    ],
  };
}
