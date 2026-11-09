import type {
  Corpus,
  HistoricalContext,
  Journey,
  Source,
  Subject,
} from '../../src/atlas/model';
import { cite, claim, interval, sec } from './content-helpers';
import { earlyCitiesMedia } from './early-cities-media';

const consulted = '2026-10-28';
const source = (
  id: string,
  title: string,
  institution: string,
  url: string,
  type: Source['type'],
  scope: string,
): Source => ({ id, title, institution, url, type, scope, accessed: consulted });
const sources: Source[] = [
  source(
    'uruk-dai',
    'Uruk (Warka): excavation results',
    'Deutsches Archäologisches Institut, Orient Department',
    'https://www.dainst.org/forschung/projekte/noslug/2604?cHash=c5bacb961e0c52001e097819eb71e24a&tx_wfdaiprojects_projects%5Bnav%5D=open&tx_wfdaiprojects_projects%5Bsection%5D=results',
    'archaeology',
    'German Ergebnisse section consulted: emphasis on monumental architecture; late-fourth-millennium buildings, later residential excavations and third-millennium walls. Later house and palace evidence is not backdated to the selected tablet. No full excavation-volume review or fourth-millennium household census.',
  ),
  source(
    'dholavira-plan',
    'Dholavira site plan, January 2020',
    'Archaeological Survey of India; World Heritage nomination map',
    'https://whc.unesco.org/document/189006',
    'archaeology',
    'PDF p. 1: indexed labels and component key consulted, including C1/C6/C7, C5 (Stage VI), B2, M3, East/South reservoirs and D1. Direct download returned 403 and the web screenshot supplied no viewable pixels. Used for labelled components, not traced geometry or a measured reconstruction. The teaching diagram is an original schematic; this map is linked, not reproduced.',
  ),
  source(
    'dholavira-gpr',
    'Archaeological studies at Dholavira using GPR',
    'Indian Institute of Technology Gandhinagar; Current Science 114 (2018), 879–887',
    'https://asc.iitgn.ac.in/assets/research/completed_projects/Archaeological_studies_at_Dholavira_using_GPR_Agrawal_Majumder_Bisht_Prashant.pdf',
    'archaeology',
    'Silky Agrawal, Mantu Majumder, R. S. Bisht and Amit Prashant. Downloaded nine-page paper; pp. 879–880 and 884–886 read, Fig. 1 and interpretation/conclusion inspected. Excavated East Reservoir is distinct from proposed buried water structures requiring excavation. Opening chronology ends at c1700 BCE, unlike UNESCO’s c1500 endpoint; neither is a precise abandonment date. Conflicting survey-area totals in the paper are not adopted.',
  ),
  source(
    'liangzhu-hydraulics',
    'Earliest hydraulic enterprise in China, 5,100 years ago',
    'Bin Liu and colleagues; PNAS 114 (2017), 13637–13642',
    'https://www.pnas.org/doi/10.1073/pnas.1710516114',
    'archaeology',
    'Publisher HTML consulted: Defining the Liangzhu Hydraulic Landscape, chronology, construction/labor discussion, Conclusion, Methods and figure captions. Article text is accessible despite PMC/Europe PMC full-text retrieval failures. No downloaded PDF, supplement or figure-pixel inspection claimed. Calibrated BP uses 1950 as present; diagram is conceptual, not a traced figure. Reservoir capacities must use the 2018 correction. Labor totals are modeled estimates, not a census.',
  ),
  source(
    'liangzhu-correction',
    'Correction: Earliest hydraulic enterprise in China, 5,100 years ago',
    'PNAS 115 (2018), E841',
    'https://www.pnas.org/doi/10.1073/pnas.1722309115',
    'primary',
    'Full publisher correction consulted. Replaces the two reservoir-capacity estimates on p. 13641 with about 14.98 and 50.72 million cubic metres, respectively. These are modeled capacities, not measured ancient annual supply; the original HTML still displays the superseded values.',
  ),
];
const review = (limitations: string[]): Subject['review'] => ({
  consultedOn: consulted,
  reviewer:
    'Codex source consultation and self-review; not independent historian approval',
  scope:
    'Bounded early-city teaching account with main/deeper reading, source interpretation, reference chronology and an original explanatory diagram.',
  limitations,
});
const fact = (id: string, text: string, sourceId: string, locator: string) => ({
  ...claim(id, text, [cite(sourceId, locator)]),
  checkedOn: consulted,
});
const dim = (text: string, sourceId: string, locator: string) => ({
  text,
  citations: [cite(sourceId, locator)],
});

function deepenUruk(s: Subject) {
  s.contextIds = ['uruk-urban-context'];
  s.summary =
    'Making a city work meant bringing food, materials and labor together. At Uruk, marks on clay helped institutions retain information about goods and their allocation. The selected tablet, dated c. 3100–2900 BCE and only probably from Uruk, makes this work tangible. It is a small administrative object within a much longer urban history, not a founding certificate for writing or civilization.';
  s.sections = [
    sec(
      'Food and skilled work behind the monuments',
      'Southern Mesopotamian communities farmed, fished and used river landscapes long before the selected tablet was made. By around 3200 BCE, Uruk had large mud-brick buildings and elaborate crafts. Building and supplying such places brought producers, makers and administrators into relationships of dependence. Accounts of goods and workers’ rations give one view of that organization. They make the institution’s requirements unusually visible, while a household’s own priorities are harder to recover from these records.',
      cite('uruk', 'Opening and pictographs/rations paragraphs'),
    ),
    sec(
      'A record separates a thing from its amount',
      'Look first at the photograph: some marks were cut into the surface, others pressed as round depressions, and lines divide parts of the clay. The catalogue identifies pictographs and numerical impressions. It interprets the tablet as probably concerning grain deliveries and distributions, but warns that missing verbs make a precise reading difficult. The diagram separates categories, quantities and recordkeeping as analytical tasks. It supplies no numerical translation, named recipient or complete itinerary for this particular account.',
      cite('met-327384', 'Description and Artwork Details'),
    ),
    sec(
      'Storage, allocation and power',
      'Clay gave an account a durable, movable surface. Recording an obligation or allocation could make it available beyond the moment of exchange and to someone who was not there. Spar links early economic recording with large institutional estates. That is a mechanism connecting administration with food and work, not proof that all grain passed through one central store. Nor does the presence of rations alone tell us whether a particular person was enslaved, employed seasonally or supported as a dependent.',
      cite('writing', 'Temple estates, clay as medium and economic data'),
    ),
    sec(
      'The city continued after this tablet',
      'The end of the object’s date range is not the end of Uruk. Later city rulers, walls and literary traditions belong to different evidence and dates. Excavators also studied residential quarters, especially from later millennia. Those houses can enrich the city’s long history, but cannot simply be projected backward as the homes of the people represented by this account. Compare Uruk with Dholavira and Liangzhu by asking who coordinated work and what survives of it.',
      cite('uruk-dai', 'Ergebnisse: residential quarters and city wall'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A household is more than an administrative category',
      'An allocation records something an institution chose to count. It does not describe all the effort needed to turn grain into food, care for dependents or maintain a dwelling. Those are questions to investigate through domestic deposits, tools and dated building contexts, rather than answers supplied by the tablet. The DAI account explains why the surviving research picture is uneven: much excavation concentrated on monumental architecture, while the residential quarters it discusses are predominantly later. The absence of a person’s voice in an account should therefore shape the question we ask, not license an invented biography.',
      cite(
        'uruk-dai',
        'Ergebnisse: excavation emphasis and later residential quarters',
      ),
      cite('met-327384', 'Probable account and interpretive limits'),
    ),
    sec(
      'Writing developed rather than arriving complete',
      'A sign can indicate a category without recording a full spoken sentence. Spar distinguishes early signs, numerical recording and later systematic use of sounds. His discussion also keeps alternative archaeological histories open. This is why a partly understood early account should not be read like a later letter. Ask separately what an observer sees, what specialists identify and what an interpretation proposes. Similar-looking recordkeeping needs in distant societies do not prove that one borrowed from another, or that all communities needed the same institutions to organize work.',
      cite(
        'writing',
        'Abstract signs, rebus principle and alternatives about early writing',
      ),
    ),
  ];
  s.familyActivity = {
    title: 'What would your record leave out?',
    duration: 'About 5 minutes',
    steps: [
      'Find one round impression and one incised mark in the tablet photograph. Describe their shapes without translating them.',
      'Imagine recording a shared meal. Choose a category to track and an amount; use words or your own marks on paper.',
      'Name one thing your account omits, such as preparation work or who made a decision.',
    ],
    explanation:
      'Your paper is a classroom invention, not ancient writing. The exercise shows how a record can preserve useful information while leaving other work out. The museum’s grain reading remains probable.',
  };
  s.evidenceReading = {
    title: 'Read an account without inventing its sentence',
    introduction:
      'The passages below are paraphrases of modern source interpretations, not translations of the tablet.',
    items: [
      {
        label: 'What the catalogue identifies',
        text: 'Incised pictographs occur beside circular numerical impressions; grain deliveries and distributions are the proposed subject.',
        interpretation:
          'Shape is directly observable. Assigning categories and actions requires specialist interpretation; the catalogue’s missing-verbs warning rules out a confident complete sentence.',
        citations: [cite('met-327384', 'Description, especially final paragraph')],
      },
      {
        label: 'What a later house cannot supply',
        text: 'The excavation overview discusses domestic quarters from the late third/early second and first millennia BCE.',
        interpretation:
          'This is useful household evidence for those periods. It is not a dated house associated with the c. 3100–2900 BCE tablet, and the selected tablet’s Uruk findspot is itself only probable.',
        citations: [
          cite('uruk-dai', 'Ergebnisse: Wohnviertel'),
          cite('met-327384', 'Geography and Date'),
        ],
      },
    ],
  };
  s.dimensions['Work and coordination'] = dim(
    'Accounts and rations expose institutional coordination; this does not reconstruct every household economy or the legal status of workers.',
    'uruk',
    'Pictographs and workers’ rations',
  );
  s.returnPrompt =
    'Which part of a city’s work could an account make easier to organize, and whose experience would you still need to investigate?';
  s.review = review([
    'Fourth-millennium household organization, gender, recruitment and coercion need dedicated archaeological research.',
    'The selected tablet is only probably from Uruk; no complete sign-by-sign translation is supplied.',
  ]);
}
function deepenDholavira(s: Subject) {
  s.contextIds = ['dholavira-urban-context'];
  s.summary =
    'Dholavira joined reservoirs, drainage, housing and skilled production in an arid island setting. Seasonal water had to be captured and stored; stone-built remains let us investigate how this work fitted into the city. Different sectors and workshops reveal organized activity without identifying every resident’s status. Its c. 3000–1500 BCE occupation range is wider than the dates of the regional Indus seal shown here.';
  s.sections = [
    sec(
      'A city needs water between rains',
      'Khadir’s seasonal streams supplied an urban settlement in a dry setting. Reservoirs to the east and south of the citadel, together with drains, made water management part of the built city. Capture and storage address different problems: water must first reach a place where it can be held, and the store must remain usable. The remains establish investment in those tasks; they do not preserve a complete operating manual or tell us how much each household received.',
      cite('dholavira', 'Description; Brief synthesis: reservoirs and drainage'),
    ),
    sec(
      'Read components before drawing a complete system',
      'The ASI plan’s key names a castle well, a water chute and storm-water drain, as well as East and South reservoirs. The teaching diagram keeps those components visible and distinguishes their positions around the castle. It is schematic, combines features recorded from different phases and does not draw a verified pipe or canal between every feature. In particular, a workshop explicitly labelled Stage VI should not be assigned automatically to every stage of the city.',
      cite('dholavira-plan', 'PDF p. 1, components C1, C5–C7 and reservoir labels'),
    ),
    sec(
      'Makers and residents used the city too',
      'Bead workshops and objects of shell, stone, copper and other materials bring skilled production into the account. Making an ornament involved more than the finished object: raw material, tools and working space had to come together. Housing varied in size and quality, and distinct fortified sectors structured movement and access. Such differences support questions about inequality. They do not give us a census of occupations, a named ruler or proof that every person within one sector had the same social position.',
      cite(
        'dholavira',
        'Description; Brief synthesis: crafts, houses and spatial differentiation',
      ),
    ),
    sec(
      'A radar image is a proposal to test',
      'In 2015 researchers surveyed ground east of the excavated East Reservoir. Their radar reflections suggested additional water-related structures, with alternative interpretations including small reservoirs and check dams. The paper says excavation is needed to confirm their existence. An inferred buried wall is therefore different evidence from an exposed reservoir. Keeping that distinction visible prevents a tidy modern diagram from making the ancient system appear more fully known than it is.',
      cite('dholavira-gpr', 'Printed pp. 880, 884–886; interpretation and Conclusion'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Bring household questions to public infrastructure',
      'A reservoir is a public-scale structure, but water also enters questions about preparation, cleaning and the demands of making things. These are useful lines of inquiry, not reconstructed routines for a named Dholavira family. The site account’s residential units and workshop spaces offer starting points for investigating how activity was distributed. More detailed work would need dated domestic assemblages and evidence of access. A large store does not prove equal availability; differences among houses do not by themselves identify an exact caste, occupation or legal category. Keep the practical problem and the social question together.',
      cite(
        'dholavira',
        'Authenticity: residential units and workshops; Brief synthesis: differentiated space',
      ),
    ),
    sec(
      'A regional seal cannot name this city’s government',
      'The Met seal and its modern impression belong to the wider Indus world. Their signs have not been securely deciphered, and this object is not identified as a Dholavira find. Its material and carved surface support close looking at manufacture; they do not translate the institutions that maintained the reservoirs. The modern impression is also a separate act of reproduction. Compare the two surfaces to see reversal, then ask which claim needs context beyond the image. Architecture, survey and seals become stronger evidence when their distinct provenances remain visible.',
      cite('met-324062', 'Description, geography and inscription discussion'),
    ),
  ];
  s.familyActivity = {
    title: 'Sort what is found from what is proposed',
    duration: 'About 5 minutes',
    steps: [
      'Find the well, East Reservoir and South reservoirs in the schematic. Name two different jobs water structures could perform.',
      'Find the dashed box east of the reservoir. Read why radar interpretations are shown differently.',
      'Complete two sentences: “The exposed reservoir shows…” and “We would need excavation to test…”',
    ],
    explanation:
      'The solid components come from the site record; the dashed box identifies a research area, not confirmed reservoir outlines. The diagram has no scale and does not show all structures operating at once.',
  };
  s.evidenceReading = {
    title: 'Three records, three different kinds of knowledge',
    introduction:
      'These are source paraphrases and diagram conventions, not an ancient description of the city.',
    items: [
      {
        label: 'A labelled plan is a composite record',
        text: 'The ASI key lists the castle well and drain, reservoirs, and a bead workshop attributed to Stage VI.',
        interpretation:
          'Use the labels to identify components. Their appearance on one modern sheet does not establish contemporaneity, flow rates or a single construction event.',
        citations: [cite('dholavira-plan', 'PDF p. 1, C1/C5/C6/C7 and SR key')],
      },
      {
        label: 'Reflections need interpretation',
        text: 'The radar team proposes water structures east of the East Reservoir and says excavation is needed for confirmation.',
        interpretation:
          'The diagram marks the study area as proposed evidence. No hypothetical reservoir is drawn with the same solid outline as the excavated components.',
        citations: [
          cite(
            'dholavira-gpr',
            'Printed pp. 884–886, Figs. 8–9 and final interpretation',
          ),
        ],
      },
      {
        label: 'Chronologies have different endpoints',
        text: 'UNESCO uses c. 3000–1500 BCE for occupation; the radar paper’s introduction gives c. 3000–1700 BCE.',
        interpretation:
          'The original dossier range remains intact. The difference is recorded rather than silently reconciled into an exact abandonment year.',
        citations: [
          cite('dholavira', 'Description'),
          cite('dholavira-gpr', 'Printed p. 879'),
        ],
      },
    ],
  };
  s.dimensions['Work and coordination'] = dim(
    'Reservoirs, drains, workshops and housing connect construction with recurring urban needs. Unequal spaces do not identify every resident’s occupation or access to water.',
    'dholavira',
    'Description and Brief synthesis',
  );
  s.claims.push(
    fact(
      'dholavira-radar-limit',
      'The proposed buried water structures in the 2018 GPR study require archaeological excavation for confirmation.',
      'dholavira-gpr',
      'Printed p. 886, final interpretation',
    ),
  );
  s.returnPrompt =
    'What would you need to discover to connect a city reservoir with the water available to a particular household?';
  s.review = review([
    'The ASI plan’s component key was consulted as indexed text; a full-resolution plan was not visually available.',
    'Detailed household routines, water allocation and phased reservoir operation remain research gaps.',
    'The regional seal is not assigned a Dholavira findspot.',
  ]);
}
function deepenLiangzhu(s: Subject) {
  s.contextIds = ['liangzhu-landscape-context'];
  s.summary =
    'Liangzhu’s rice-growing communities changed a wet landscape with dams, channels and earthen construction. Water control supported production and movement, while elaborate burials and jade reveal unequal status. These are related ways into the city’s history, with different kinds of evidence behind each. Neither a dam nor the selected cong gives a direct account of the decisions, household labor or beliefs of every resident.';
  s.sections = [
    sec(
      'The city belonged to a wider landscape',
      'The archaeological property includes high dams near valley mouths, low dams on the plain, the city and Yaoshan. Rice cultivation supported this regional society. The city’s earthen monuments and differentiated cemeteries put authority and belief into the landscape alongside farming. Looking beyond the urban centre matters: a large built place depended on work and resources beyond its monumental core. The UNESCO frame of c. 3300–2300 BCE describes a site sequence, rather than the life of one unchanging government.',
      cite('liangzhu', 'Description; Brief synthesis and property components'),
    ),
    sec(
      'Engineering involved materials and repeated work',
      'Excavators identified clay wrapped in grass bundles within dams. Such construction turns a general claim about coordination into a material question: people gathered, carried and placed things. Channels and controlled access points also helped move people and materials. The conceptual diagram identifies storage, channels and productive activity without supplying a traced ancient canal route. Building and maintaining a system would have had to coexist with agricultural work; the paper’s proposed labor totals are estimates based on assumptions, not surviving attendance lists.',
      cite(
        'liangzhu-hydraulics',
        'Defining the Hydraulic Landscape; construction and labor assumptions',
      ),
    ),
    sec(
      'Jade gives another view of work and status',
      'The selected nephrite cong has a round opening inside a squared, tapering outer form. Faces occupy its corners. Close carving and finishing made it a demanding object to produce; the Met proposes associations with wealth and status while leaving its exact meaning uncertain. Differentiated burials provide contextual evidence of social hierarchy at the archaeological property. This museum object, however, has no documented findspot at the city in the record used here. It illustrates a cultural form, not a particular excavated burial.',
      cite('met-72376', 'Description; Artwork Details; audio transcript'),
      cite('liangzhu', 'Differentiated cemeteries'),
    ),
    sec(
      'Several clocks run through the same story',
      'The jade is catalogued around 2400 BCE, within a broader museum culture range that differs from the site’s range. Dam samples have their own radiocarbon distributions. Treating these dates as separate evidence makes it possible to ask what was built earlier, what was modified and what coexisted. It prevents a display from turning all Liangzhu works into one instant or using a late object as a photograph of an earlier construction project.',
      cite('met-72376', 'Date and Period'),
      cite('liangzhu-hydraulics', 'Chronological sequence and Fig. 5 caption'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Coordination does not name the agreement',
      'Earthen construction and rice production establish substantial practical tasks. Burial differences add evidence that people did not hold identical social positions. Together they support an inquiry into political organization; they do not preserve the exact relationships between leaders, specialists and households. Nor does a water-control system alone prove one universal form of coercive government. A next investigation should test how benefits, burdens and access varied, rather than treating the finished dam as an explanation of its own labor arrangements. Household and gender histories need more direct evidence than this bounded set currently supplies.',
      cite('liangzhu', 'Criteria (iii)–(iv) and burial differentiation'),
      cite(
        'liangzhu-hydraulics',
        'Conclusion: limits on reconstructing social categories',
      ),
    ),
    sec(
      'A correction changes what can be repeated',
      'The original paper’s online body still contains superseded reservoir capacities. The 2018 correction gives about 14.98 and 50.72 million cubic metres for the high and low reservoirs respectively. These are reconstructed capacities, not measured annual water consumption or a count of people served. The source and its correction must travel together. This example shows why a visually impressive number is not enough: establish its units, whether it is a measurement or estimate, and whether later corrections change it before using it in an explanation.',
      cite('liangzhu-correction', 'Correction of p. 13641, left column'),
    ),
  ];
  s.familyActivity = {
    title: 'Follow materials, then ask about people',
    duration: 'About 5 minutes',
    steps: [
      'In the diagram, find grass-wrapped clay, water storage and rice production. Say which is a material, a structure or an activity.',
      'Look at the cong photograph. Describe its opening and corners before reading the proposed meaning.',
      'Choose one question the objects cannot answer directly: who gave an order, who carried clay, or how a household used its share of food.',
    ],
    explanation:
      'The diagram is a modern concept guide, not a surveyed plan or a picture of an ancient workday. Shape and material can be observed; beliefs and social relationships need contextual evidence.',
  };
  s.evidenceReading = {
    title: 'Material evidence, dated samples and estimates',
    introduction:
      'The following paraphrases distinguish what was found from what a modern analysis infers.',
    items: [
      {
        label: 'A dated material is not the whole city',
        text: 'The paper dates short-lived plants and charcoal associated with dams; it reports different clusters for high and low dams.',
        interpretation:
          'The source uses calibrated years BP, with 1950 as present. Approximate BCE equivalents are orientation aids, not new exact dates for each structure or for every phase of the city.',
        citations: [
          cite('liangzhu-hydraulics', 'Chronological sequence; Methods and Fig. 5'),
        ],
      },
      {
        label: 'Read the corrected capacity',
        text: 'The correction replaces the high/low reservoir estimates with about 14.98/50.72 million cubic metres.',
        interpretation:
          'The two figures describe reconstructed storage capacities. They must not be repeated as excavated grain volumes, population counts or annual water use.',
        citations: [cite('liangzhu-correction', 'Full correction notice')],
      },
      {
        label: 'A cong is not a decoded belief system',
        text: 'The museum identifies nephrite, a squared tube and carved faces, but describes the object’s meaning as uncertain.',
        interpretation:
          'The city’s burials offer evidence for differentiation. They do not establish this particular object’s burial context or a certain translation of its motifs.',
        citations: [
          cite('met-72376', 'Description and Artwork Details'),
          cite('liangzhu', 'Description: socially differentiated burials'),
        ],
      },
    ],
  };
  s.dimensions['Work and coordination'] = dim(
    'Rice cultivation, earthworks and channels involved coordinated activity; archaeological hierarchy does not identify exact household obligations or recruitment arrangements.',
    'liangzhu',
    'Brief synthesis; criteria (iii)–(iv)',
  );
  s.claims.push(
    fact(
      'liangzhu-capacity-correction',
      'The 2018 correction gives estimated high/low reservoir capacities of about 14.98/50.72 million cubic metres.',
      'liangzhu-correction',
      'Correction of p. 13641',
    ),
  );
  s.returnPrompt =
    'Which evidence would help distinguish organizing a useful water system from controlling who benefited from it?';
  s.review = review([
    'Dam functions and labor arrangements involve archaeological interpretation; no precise household social categories are reconstructed.',
    'Publisher text and figure captions were consulted; the supplement and original figure pixels were not inspected.',
    'Independent archaeological review and family testing remain open.',
  ]);
}

const contexts: HistoricalContext[] = [
  {
    id: 'uruk-urban-context',
    title: 'Uruk: urban growth and later city-states',
    region: 'West/Central Asia',
    interval: interval(
      -3300,
      -2350,
      'c. 3300–2350 BCE: selected urban and Early Dynastic orientation',
      'A bounded teaching frame spanning later-fourth-millennium growth and the conventional 2900–2350 BCE Early Dynastic period; neither boundary is the lifespan of Uruk.',
    ),
    summary:
      'Place the tablet within a city that grew before it and continued afterward. Urban institutions, later walls and changing rulers have separate chronologies.',
    subjectIds: ['uruk-accounts'],
    citations: [
      cite('uruk', 'Urban growth and Early Dynastic paragraphs'),
      cite('uruk-dai', 'Ergebnisse: late Uruk buildings and walls'),
    ],
    phases: [
      {
        year: -3300,
        label: 'Later fourth millennium BCE',
        title: 'Urban growth before the selected object',
        text: 'The frame opens within the era of expanding settlements and monumental building. It is not a foundation year.',
        citations: [cite('writing', 'Later-fourth-millennium settlement expansion')],
      },
      {
        year: -3200,
        label: 'Around 3200 BCE',
        title: 'A large urban centre',
        text: 'The museum describes monumental mud-brick construction, crafts and institutional accounting at Uruk.',
        citations: [cite('uruk', 'Opening and pictographs paragraphs')],
      },
      {
        year: -3100,
        label: 'c. 3100–2900 BCE',
        title: 'The selected grain account',
        text: 'This is the object’s date range. Its provenance is only probably Uruk; the account reading remains qualified.',
        citations: [cite('met-327384', 'Date, Geography and Description')],
      },
      {
        year: -2900,
        label: 'c. 2900–2350 BCE',
        title: 'Early Dynastic city-states',
        text: 'Later political changes, walls and traditions about rulers belong to the continuing city, not to a securely identified author of the selected tablet.',
        citations: [
          cite('uruk', 'Early Dynastic paragraph'),
          cite('uruk-dai', 'Ergebnisse: third-millennium wall'),
        ],
      },
    ],
  },
  {
    id: 'dholavira-urban-context',
    title: 'Dholavira: a changing settlement within the Indus world',
    region: 'South Asia',
    interval: interval(
      -3000,
      -1500,
      'c. 3000–1500 BCE occupation orientation',
      'UNESCO’s broad site range is retained. The GPR paper gives an approximate 1700 BCE endpoint; phase anchors below are broad orientation labels, not independently dated construction events.',
    ),
    summary:
      'The city changed in layout and use over a long occupation. The regional seal has a narrower date range; the plan is a modern composite, not one frozen urban moment.',
    subjectIds: ['dholavira'],
    citations: [
      cite('dholavira', 'Description; criteria (iii)–(iv)'),
      cite('dholavira-gpr', 'Printed p. 879'),
    ],
    phases: [
      {
        year: -3000,
        label: 'From around 3000 BCE',
        title: 'Early occupation',
        text: 'UNESCO traces the earliest settlement evidence to this approximate date. Later urban features are not all assigned to it.',
        citations: [cite('dholavira', 'Criterion (iii)')],
      },
      {
        year: -2600,
        label: 'c. 2600–1900 BCE: regional object range',
        title: 'The seal’s narrower window',
        text: 'The selected Met seal is dated within the broader occupation. Its Indus Valley attribution does not make it a find from Dholavira.',
        citations: [cite('met-324062', 'Date and Geography')],
      },
      {
        year: -2000,
        label: 'Across the third and second millennia BCE',
        title: 'Changing spaces and activities',
        text: 'Excavation records growth, change and later contraction. The orientation anchor does not date every reservoir, house or workshop to 2000 BCE.',
        citations: [
          cite('dholavira', 'Criterion (iii); changes in city configuration'),
        ],
      },
      {
        year: -1500,
        label: 'c. 1500 BCE: UNESCO range endpoint',
        title: 'An approximate end to this site frame',
        text: 'The shorter c. 1700 BCE endpoint in the radar paper remains visible as a source difference. Neither is treated as one precisely dated collapse event.',
        citations: [
          cite('dholavira', 'Description'),
          cite('dholavira-gpr', 'Printed p. 879'),
        ],
      },
    ],
  },
  {
    id: 'liangzhu-landscape-context',
    title: 'Liangzhu: city, dams and objects on different clocks',
    region: 'East Asia',
    interval: interval(
      -3300,
      -2300,
      'c. 3300–2300 BCE site orientation',
      'The site frame follows UNESCO. Dam distributions in calibrated BP are not exact phase boundaries; the Met’s c3200–2000 BCE culture label has a wider endpoint.',
    ),
    summary:
      'Waterworks developed in phases within a rice-producing landscape. A city frame, dam samples and an individual jade must remain separate chronological units.',
    subjectIds: ['liangzhu'],
    citations: [
      cite('liangzhu', 'Description and Brief synthesis'),
      cite('liangzhu-hydraulics', 'Chronological sequence'),
    ],
    phases: [
      {
        year: -3300,
        label: 'c. 3300 BCE: site frame opens',
        title: 'A regional landscape',
        text: 'The World Heritage frame encompasses the city, waterworks and differentiated cemeteries. It does not date every feature to the opening year.',
        citations: [cite('liangzhu', 'Description and property components')],
      },
      {
        year: -3250,
        label: 'c. 3250–2850 BCE: approximate conversion',
        title: 'High-dam sample cluster',
        text: 'The paper reports most high-dam results at 5200–4800 calibrated BP. Subtracting from the 1950 BP baseline gives this rounded BCE orientation; outliers and construction phases remain.',
        citations: [cite('liangzhu-hydraulics', 'Chronological sequence and Fig. 5')],
      },
      {
        year: -3050,
        label: 'c. 3050–2850 BCE: approximate conversion',
        title: 'Low dams and levees',
        text: 'Most low-dam/levee dates cluster at 5000–4800 calibrated BP. Overlapping date distributions do not prove simultaneous construction.',
        citations: [cite('liangzhu-hydraulics', 'Chronological sequence')],
      },
      {
        year: -2400,
        label: 'Around 2400 BCE',
        title: 'The selected cong',
        text: 'The museum dates this object separately and does not identify it as a city excavation find.',
        citations: [cite('met-72376', 'Date and Artwork Details')],
      },
      {
        year: -2300,
        label: 'Around 2300 BCE',
        title: 'The site orientation ends',
        text: 'This is the UNESCO range endpoint, not the disappearance of every community or all Liangzhu cultural forms.',
        citations: [
          cite('liangzhu', 'Description'),
          cite('met-72376', 'Broader cultural period'),
        ],
      },
    ],
  },
];
const journey: Journey = {
  id: 'cities-work-water',
  title: 'Who did the work? Accounts, reservoirs and rice',
  question: 'What evidence connects everyday work with a city’s organization?',
  duration: 'About 20–30 minutes',
  printSourcesPerPage: 3,
  introduction:
    'Follow three investigations in thematic order. This is a comparison of evidence, not a travel route, a claim of contact or a sequence of stages toward one civilization. Read each source interpretation before deciding what the works reveal about people.',
  stops: [
    {
      subject: 'uruk-accounts',
      year: -3000,
      title: 'An account makes selected work visible',
      narrative:
        'Look at the tablet, then the diagram. Separate an incised sign, a numerical impression and the proposed grain-account reading. List one task an institution might track and one kind of work the record leaves out.',
      object: 'met-327384',
      compare: 'dholavira',
    },
    {
      subject: 'dholavira',
      year: -2400,
      title: 'A water system has components and uncertainties',
      narrative:
        'Find the well, East/South reservoirs and dashed research area. Explain why excavated structures and radar interpretations use different conventions. Ask what evidence would connect a household to access to water.',
      object: 'dholavira-water-diagram',
      compare: 'liangzhu',
    },
    {
      subject: 'liangzhu',
      year: -2800,
      title: 'Materials, farming and unequal status',
      narrative:
        'Use the landscape diagram and cong photograph to distinguish construction, food production and burial evidence. Then read the reservoir correction. Decide which conclusions concern practical work and which require social interpretation.',
      object: 'liangzhu-water-diagram',
      compare: 'uruk-accounts',
    },
  ],
  conclusion:
    'Each case connects material work with larger institutions through a different surviving record. Write one supported explanation and one question requiring new evidence. Shared needs do not establish one origin, equal access or a direct connection between these places.',
  evidence: {
    prompt: 'Which explanation best fits the supplied evidence?',
    options: [
      {
        text: 'The records and works show different kinds of coordination, while household obligations and access need further evidence.',
        supported: true,
        feedback:
          'Yes. Match the grain account, excavated reservoirs and water/production landscape to the claims each supports. None supplies a full household census or recruitment record.',
      },
      {
        text: 'All the Dholavira features in the radar interpretation can be treated as excavated reservoirs.',
        supported: false,
        feedback:
          'The proposed structures require excavation. The diagram’s dashed research area must not become a confirmed ancient plan.',
      },
      {
        text: 'The shared need to organize work proves that writing and cities spread from Uruk to the other two sites.',
        supported: false,
        feedback:
          'Functional comparison is not transmission evidence. This route adds no historical contact or causal relationship.',
      },
    ],
    citations: [
      cite('met-327384', 'Qualified account reading'),
      cite('dholavira-gpr', 'Printed p. 886, excavation requirement'),
      cite('liangzhu', 'Burial differentiation and regional state'),
    ],
  },
  returnPrompt:
    'Choose two cases. For each, name the practical task, the evidence for organization and one household-level question the source cannot answer.',
};

export function applyEarlyCities(corpus: Corpus) {
  corpus.sources.push(...sources);
  deepenUruk(corpus.subjects.find((s) => s.id === 'uruk-accounts')!);
  deepenDholavira(corpus.subjects.find((s) => s.id === 'dholavira')!);
  deepenLiangzhu(corpus.subjects.find((s) => s.id === 'liangzhu')!);
  corpus.contexts = [...(corpus.contexts ?? []), ...contexts];
  corpus.media.push(...earlyCitiesMedia);
  for (const m of earlyCitiesMedia)
    corpus.subjects.find((s) => s.id === m.subject)!.objectIds.push(m.id);
  corpus.journeys.push(journey);
  for (const id of [
    'uruk',
    'writing',
    'dholavira',
    'liangzhu',
    'met-327384',
    'met-324062',
    'met-72376',
  ])
    corpus.sources.find((s) => s.id === id)!.accessed = consulted;
  const pack = corpus.packs.find((p) => p.id === 'C1')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: 'Accounts, reservoirs and rice',
      journey: journey.id,
      comparison: ['dholavira', 'liangzhu'],
      start: -3300,
      end: -2000,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Southern Mesopotamia, Khadir island and the lower Yangtze. Existing site locators orient the inquiry; original diagrams explain components and tasks without invented political borders or connecting routes.',
      limits:
        'Three expanded investigations within the six-case chapter. Household detail and independent archaeological review remain open; Egypt, Caral, Orkney and missing regional frameworks are not completed by this batch.',
    },
  ];
  pack.coverage['West/Central Asia'].reason =
    'Expanded Uruk account with distinct urban chronology, accounting diagram and source interpretation. Later residential evidence is not backdated; wider Mesopotamian and household histories remain open.';
  pack.coverage['South Asia'].reason =
    'Expanded Dholavira water/work inquiry separates excavated components from proposed radar features. The regional seal has no asserted Dholavira findspot. Wider Indus reference history remains open.';
  pack.coverage['East Asia'].reason =
    'Expanded Liangzhu account joins rice, waterworks and jade while preserving separate dates and corrected capacity estimates. Household relations and wider East Asian histories remain open.';
}
