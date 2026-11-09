import type {
  Corpus,
  HistoricalContext,
  Journey,
  Source,
  Subject,
} from '../../src/atlas/model';
import { cite, claim, interval, sec } from './content-helpers';
import { bronzeInstitutionsMedia } from './bronze-institutions-media';
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
    'hattusha-dai',
    'Ḫattuša/Boğazköy: the Hittite capital',
    'Deutsches Archäologisches Institut, Istanbul Department',
    'https://www.dainst.org/forschung/projekte/noslug/2280',
    'archaeology',
    'German project overview consulted: capital/cult and administrative centre c1650–1180 BCE, temples, palace, archives and later occupation. Broad orientation, not a map of one simultaneous phase or a complete institutional history.',
  ),
  source(
    'hattusha-houses',
    'The Excavations at Boğazköy-Hattuša in 2015',
    'Andreas Schachner; Archäologischer Anzeiger 2016, 1–47',
    'https://publications.dainst.org/journals/aa/article/view/1929',
    'archaeology',
    'Abstract only: northern Lower City residential excavation, three construction layers from kārum into Hittite periods, housing and an official building. No house plans or full excavation text consulted; Roman remains discussed in the abstract are not backdated.',
  ),
  source(
    'uluburun-1990',
    'Ulu Burun: 1990 Excavation Campaign',
    'Cemal Pulak; INA Newsletter 17(4), 1990',
    'https://nauticalarch.org/wp-content/uploads/2016/01/INAQ1990-17-4.pdf',
    'archaeology',
    'Original issue downloaded. Printed pp. 8–11 read and inspected: recovered cargo, hull, joints, anchors, weights, slope movement, excavation and tentative identifications. An interim field report; partial totals and contemporary dating are not silently substituted for the later project account. Research PDF and photographs are not redistributed in the atlas.',
  ),
  source(
    'uluburun-tin-2022',
    'Tin from Uluburun shipwreck shows small-scale commodity exchange fueled continental tin supply across Late Bronze Age Eurasia',
    'Wayne Powell and colleagues; Science Advances 8 (2022), eabq3766',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC9710885/',
    'archaeology',
    'Full body retrieved through PMC: Introduction, Results, Discussion subsections and Methods consulted. Chemical/isotopic comparison and source assignments are interpretations. Central Asian/Anatolian allocations are contested by Berger et al. (2023); no reconstructed trade route or percentage allocation is adopted as settled.',
  ),
  source(
    'uluburun-tin-2023',
    'Why Central Asia’s Mushiston is not a source for the Late Bronze Age tin ingots from the Uluburun shipwreck',
    'Daniel Berger, Kai Kaniuth, Gerhard Brügmann and Ernst Pernicka; Frontiers in Earth Science 11 (2023)',
    'https://www.frontiersin.org/journals/earth-science/articles/10.3389/feart.2023.1211478/full',
    'archaeology',
    'Publisher abstract consulted; full critique body and figures not inspected. Challenges the 2022 source assignments and proposes alternatives; its preferred sources are not converted into a confirmed itinerary.',
  ),
  source(
    'uluburun-tin-2025',
    'From Land’s End to the Levant: did Britain’s tin sources transform the Bronze Age in Europe and the Mediterranean?',
    'R. Alan Williams and colleagues; Antiquity 99 (2025), 708–726',
    'https://doi.org/10.15184/aqy.2025.41',
    'archaeology',
    'Nineteen-page primary paper downloaded. Printed pp. 717–719, especially p. 718 on Uluburun, read with the lead/trace-element discussion. Contamination and possible remelting complicate Uluburun lead provenance; findings for other wrecks are not automatically assigned to this cargo. No supplement review or decisive ore-source assignment claimed.',
  ),
  source(
    'shang-yinxu',
    'Yin Xu',
    'UNESCO World Heritage Centre',
    'https://whc.unesco.org/en/list/1114/',
    'archaeology',
    'Description and Brief synthesis consulted: selected late capital c1300–1046 BCE, Huan River, palace/ancestral shrine and royal tomb areas, Fu Hao, oracle bones and burial assemblages. Human remains are described as interpreted sacrificial victims. Universal priority claims and praise are not adopted.',
  ),
  source(
    'shang-divination',
    'Making Sense of the Future: The Oracle Bone and Shang Dynasty Divination',
    'Smithsonian National Museum of Asian Art',
    'https://asia.si.edu/education/educator-resources/teaching-china-with-the-smithsonian/lesson-plans/making-sense-of-the-future-the-oracle-bone-and-shang-dynasty-divination/',
    'scholarship',
    'Indexed museum lesson passages consulted: materials, rain/hunt topics and distinction among introduction, charge, prognostication and verification. Direct page retrieval failed and direct download returned 403. Its collection fragment and the separate translated hunt example are not the selected Met bone. No full-page or original object inspection claimed.',
  ),
  source(
    'met-44781',
    'Wine pouring vessel (Gong), 43.25.4',
    'The Metropolitan Museum of Art',
    'https://www.metmuseum.org/art/collection/search/44781',
    'catalogue',
    'Description, Artwork Details, public-domain image label and audio transcript consulted. Bronze, 13th–11th century BCE, Henan Province, possibly Anyang; no secure excavated findspot asserted. Primary image visually inspected. Transcript discusses multiple vessels; details of another turquoise-inlaid vessel are not assigned to this gong.',
  ),
];
const review = (limitations: string[]): Subject['review'] => ({
  consultedOn: consulted,
  reviewer:
    'Codex source consultation and self-review; not independent historian approval',
  scope:
    'Bounded C2 account with main/deeper/evidence reading, separate reference chronology, family entry and source-labelled visuals.',
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
function deepenHattusha(s: Subject) {
  s.contextIds = ['hattusha-capital-context'];
  s.summary =
    'Hattusha was a place of government, worship, building and provisioning before it became a problem of collapse. Its royal administration depended on people moving food and maintaining institutions across a changing city. Evidence for severe drought near the political transformation adds a possible stress to that history. It does not turn the end of the central administration into the disappearance of everyone in the region.';
  s.sections = [
    sec(
      'A capital coordinated more than royal display',
      'The DAI describes a capital and cult centre with a palace, temples and cuneiform archives. These institutions coordinated decisions, ritual obligations and resources. Maintaining their buildings required recurring work and supplies, connecting royal authority with builders and providers. The broad c. 1650–1180 BCE capital orientation is separate from this dossier’s 13th-century case. It does not describe the settlement’s whole lifespan or an unchanging arrangement of districts.',
      cite('hattusha-dai', 'Project overview: capital, cult, palace and archives'),
    ),
    sec(
      'Houses and open ground belong in the city',
      'Excavation in the northern Lower City traces residential construction from the earlier kārum period into Hittite phases and identifies housing alongside an official building. Schachner’s later synthesis describes settled areas moving and changing intensity through time. Dense districts could stand beside older ruins or open ground. A combined site plan is therefore a record assembled from different phases. It should not be read as a complete map of all the people, streets and buildings operating on the day the central government withdrew.',
      cite('hattusha-houses', 'Abstract: residential district and construction layers'),
      cite(
        'hattusha-research',
        '2024 abstract: changing occupation and idealized overall plan',
      ),
    ),
    sec(
      'Food could be stored, but resilience had limits',
      'The drought study discusses cereals as a food and tax base, with storage helping communities manage variable harvests. Repeated shortages pose a different problem from one bad season: using stored food leaves less protection if another crop fails. This is a proposed mechanism linking environmental stress to provisioning and political vulnerability. It is not a calculation of the grain left in every household or proof that all districts lacked alternatives. Distribution, access and decisions still matter when interpreting a material shortfall.',
      cite(
        'hittite-drought',
        'Printed pp. 720–722, subsistence/storage and Discussion',
      ),
    ),
    sec(
      'The tree record has its own location and clock',
      'Manning and colleagues analyzed juniper timbers recovered at Gordion, about 230 km west of Hattusha. Ring widths and carbon isotopes indicate moisture conditions, rather than directly measuring decisions at the capital. They identify a severe dry episode around 1198–1196 BCE, with a ±3-year dating uncertainty. The central estimate falls just after the case endpoint of about 1200 BCE. The dating uncertainty can overlap that endpoint, so the wider reference frame shows the episode with its own dates. The authors acknowledge that direct causation remains unproved; abandonment of the royal centre also needs to be distinguished from later burning.',
      cite(
        'hittite-drought',
        'Printed pp. 719–722: Gordion, dating and causation limit',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'Separate a withdrawal from an empty landscape',
      'A central administration can cease to operate while people and practices continue at other scales. The drought paper distinguishes the emptied royal centre and later burning, and discusses continuation and adaptation elsewhere in former Hittite territories. Schachner’s archaeological abstract offers another reason to resist a single dramatic snapshot: Hattusha’s occupied areas had changed long before the final political transition. A next investigation should ask which buildings stopped functioning, which activities moved and which evidence dates each change. The end of a document series is a consequential institutional event, but not a census proving that every resident left at once.',
      cite('hittite-drought', 'Printed pp. 719–720, archaeological/historical context'),
      cite('hattusha-research', 'Abstract'),
    ),
    sec(
      'A proxy is evidence with an argument behind it',
      'Tree growth responds to more than one influence. The researchers compare samples, remove growth trends and use isotope evidence to strengthen the moisture interpretation. Their record is not a rainfall gauge at Hattusha, and its precision is not unlimited. A plausible causal account must connect this regional stress with dated provisioning, institutions and human decisions. The diagram keeps those steps separate instead of drawing an automatic arrow from drought to collapse. Household access to stores, labor demands and different coping strategies remain questions for further evidence rather than reconstructed conversations among imaginary residents.',
      cite('hittite-drought', 'Methods: tree-ring and stable isotope data; Discussion'),
    ),
  ];
  s.familyActivity = {
    title: 'Keep three clocks apart',
    duration: 'About 5 minutes',
    steps: [
      'Find the capital frame, Gordion samples and political question in the diagram. Say which is a place, a measurement or an interpretation.',
      'Find the case endpoint and the estimated drought years. How does the three-year uncertainty affect their timing?',
      'Finish: “Dry conditions could make ___ harder, but to explain a decision we would also need ___.”',
    ],
    explanation:
      'The diagram is a modern evidence guide, not a plotted climate series or a picture of the city on one day. A possible mechanism is stronger when its missing steps are visible.',
  };
  s.evidenceReading = {
    title: 'From a measured proxy to a historical claim',
    introduction:
      'These are source paraphrases. None is a quotation from a Hittite witness describing the last day of the capital.',
    items: [
      {
        label: 'Where the timbers were recovered',
        text: 'The analyzed juniper timbers came from archaeological contexts at Gordion, west of Hattusha; growth rings preserve an earlier environmental record.',
        interpretation:
          'The place and date of timber recovery, the years in which the trees grew and the city whose history is being discussed are different units. Gordion is not silently relabelled Hattusha.',
        citations: [cite('hittite-drought', 'Printed p. 721; Methods: tree-ring data')],
      },
      {
        label: 'What the date can support',
        text: 'The paper identifies unusually severe dryness around 1198–1196 BCE, with ±3-year dating uncertainty, and explicitly says it cannot establish direct causation.',
        interpretation:
          'The dates sharpen a proposed historical connection without proving one event caused every political change. The figure here contains no invented annual rainfall values.',
        citations: [cite('hittite-drought', 'Abstract; printed p. 722, Discussion')],
      },
      {
        label: 'What a whole-site plan conceals',
        text: 'The archaeological synthesis describes continuous changes in occupied areas and calls the overall plan a modern reconstruction.',
        interpretation:
          'Treat a plan as evidence to date and interpret. Do not turn every visible foundation into simultaneous late-13th-century occupation.',
        citations: [cite('hattusha-research', 'Abstract, final sentences')],
      },
    ],
  };
  s.dimensions['Work and coordination'] = dim(
    'Palace, temples, archives and provisioning connected recurring work. Proxy evidence for moisture stress is separate from proof of how institutions responded.',
    'hattusha-dai',
    'Capital, cult centre and administrative archives',
  );
  s.returnPrompt =
    'Which dated evidence would help connect a regional food stress with the withdrawal of a particular institution?';
  s.review = review([
    'The 2024 city synthesis and 2015 residential report were consulted as abstracts, not full excavation publications.',
    'The drought paper was downloaded; main text, Discussion and relevant Methods were read. Household-level distribution and a direct causal account remain unresolved.',
  ]);
}
function deepenUluburun(s: Subject) {
  s.contextIds = ['uluburun-exchange-context'];
  s.summary =
    'The Uluburun wreck preserves a shipment and traces of the people and skills that kept a ship working. Copper, tin, containers and valuable goods occurred together near the Anatolian coast. That association is secure evidence of movement, but recovering objects is different from identifying their ore sources, owners or destinations. The findspot, cargo and proposed origins need different visual and verbal labels.';
  s.sections = [
    sec(
      'One archaeological association, several kinds of work',
      'INA’s account identifies copper and tin ingots alongside pottery, foodstuffs and luxury materials. Raw metal could move toward later manufacture while finished objects travelled for other uses. A shipment thus joins production, packing, transport and exchange rather than representing one self-contained craft. The excavators’ date, c. 1320 BCE ±15 years, remains an approximate wreck window. Neither that window nor a mixed cargo identifies every port visited, the intended buyer or the political arrangement behind the voyage.',
      cite('uluburun', 'Date header; cargo and economic exchange'),
    ),
    sec(
      'The hull was equipment, not just a container',
      'Cedar planking, pegged mortise-and-tenon joints and anchors reveal material arrangements that made maritime transport possible. Pulak’s 1990 report records exposed hull members, tools and objects interpreted cautiously as possible raw material or spare parts. Such details bring building and maintenance into view beside the prestige goods. They do not provide a complete workday or a roster of specialists. Personal effects can support proposals about people aboard, but a vessel style or weapon should not become a certain nationality or a named passenger.',
      cite('uluburun', 'Hull, anchors and personal effects'),
      cite('uluburun-1990', 'Printed pp. 9–10; Fig. 2 and possible spare material'),
    ),
    sec(
      'The seabed is not an untouched loading plan',
      'Excavators worked through sediment and encrustation across a steep site. The campaign report describes objects rolling or falling downslope and distinguishes exposed hull structure from loose material. The association still matters, but the position in which an object was recovered is not automatically its original stowage position. A useful reconstruction must explain preservation and movement as well as cargo categories. The teaching diagram therefore groups evidential questions; it does not draw invented stacks in a reconstructed hold.',
      cite('uluburun-1990', 'Printed p. 9, catchment and slope movement; pp. 10–11'),
    ),
    sec(
      'A chemical match is an argument about origin',
      'A 2022 study linked tin samples with Central Asian and Anatolian sources. A 2023 critique challenged those assignments and offered alternatives. Work published in 2025 adds evidence concerning contamination and remelting, complicating the interpretation of the Uluburun material. These analyses make the history richer without providing a universally agreed ore-source map. The diagram marks origins as inferred and contested. It leaves the ship’s complete itinerary unresolved and keeps the securely located wreck separate from proposed paths to it.',
      cite('uluburun-tin-2022', 'Results and Discussion: source assignments'),
      cite('uluburun-tin-2023', 'Abstract'),
      cite('uluburun-tin-2025', 'Printed pp. 717–719, especially p. 718'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Do not turn every cargo into a royal gift',
      'The project page frames the shipment in relation to elite exchange and wealthy audiences. Pulak’s earlier report describes a possible royal connection rather than an identified owner. Balance weights, varied goods, tools and hull remains can support questions about trade and shipboard practice without proving one model of ownership for every object. Palace demand and merchants’ work need not be treated as mutually exclusive explanations before the evidence is examined. A future account should investigate the financing and stages of exchange with precisely dated texts rather than supplying an invented manifest or a universal Bronze Age market.',
      cite('uluburun', 'Elite shipment and cargo interpretation'),
      cite(
        'uluburun-1990',
        'Printed pp. 8–10, tentative royal attribution and weights',
      ),
    ),
    sec(
      'Recycling can complicate a geological fingerprint',
      'Comparing an ingot with an ore depends on what happened between extraction and recovery. Contamination, mixing and recasting can alter the signals being compared. Williams and colleagues discuss these problems specifically for Uluburun; their stronger source arguments for other Mediterranean wrecks cannot simply be copied onto this cargo. Keep the 2022 analysis and later challenges together when evaluating a claim. No exact Central Asian, Anatolian or British share is presented here as settled, and even a well-supported source region would not establish every intermediary or the route taken by the ship.',
      cite('uluburun-tin-2025', 'Printed pp. 717–719'),
      cite('uluburun-tin-2023', 'Abstract: proposed alternatives'),
    ),
  ];
  s.familyActivity = {
    title: 'Sort found, inferred and unknown',
    duration: 'About 5 minutes',
    steps: [
      'Find the wreck location and recovered materials in the solid part of the diagram. Name two things found together.',
      'Find the dashed origin panel. Explain what extra work is needed to argue where a metal came from.',
      'Name one question the wreck does not settle, such as the full itinerary or the owner of every object.',
    ],
    explanation:
      'The diagram groups types of evidence. It is not a map of a confirmed sailing route, a stowage plan or a passenger list.',
  };
  s.evidenceReading = {
    title: 'Read a shipment through changing investigations',
    introduction:
      'Paraphrases distinguish a field report, a later project summary and competing laboratory interpretations.',
    items: [
      {
        label: 'A campaign report is an interim record',
        text: 'The 1990 report describes excavated material and interpretation during an unfinished excavation, including objects displaced downslope.',
        interpretation:
          'Its observations help explain recovery. Interim cargo totals and provisional identifications should not be relabelled as the final excavation inventory.',
        citations: [cite('uluburun-1990', 'Printed pp. 8–11')],
      },
      {
        label: 'Source assignments are contested',
        text: 'Powell and colleagues proposed specific tin-source regions in 2022; Berger and colleagues challenged key assignments in 2023.',
        interpretation:
          'A laboratory dataset and the historical geography argued from it are different levels of claim. A disputed source allocation is not a confirmed shipping route.',
        citations: [
          cite('uluburun-tin-2022', 'Results and Discussion'),
          cite('uluburun-tin-2023', 'Abstract'),
        ],
      },
      {
        label: 'A newer paper does not make all wrecks identical',
        text: 'The 2025 study discusses variable lead contamination and possible remelting in Uluburun ingots while making source arguments for other wrecks.',
        interpretation:
          'Read the Uluburun-specific qualification on p. 718. Do not transfer another assemblage’s stronger attribution to this ship.',
        citations: [cite('uluburun-tin-2025', 'Printed p. 718')],
      },
    ],
  };
  s.dimensions['Work and coordination'] = dim(
    'Cargo, anchors, joints and tools connect different stages of production and transport. Ownership, crew identity and every stop remain interpretive questions.',
    'uluburun',
    'Hull, cargo and personal effects',
  );
  s.claims.push(
    fact(
      'uluburun-origin-limit',
      'Recent studies offer competing interpretations of the tin’s origins; no complete ship itinerary is established here.',
      'uluburun-tin-2025',
      'Printed pp. 717–719',
    ),
  );
  s.returnPrompt =
    'Choose one object category: what is secure about its association, what is inferred about its origin, and what remains unknown about its movement?';
  s.review = review([
    'No licensed historical wreck photograph was added; the new image is a modern evidence diagram.',
    'Crew, ownership, destination and tin provenance remain qualified. The 2022 paper’s figures and supplements were not visually inspected.',
    'The 1990 issue and specified 2025 paper pages were read, not every publication in the excavation bibliography.',
  ]);
}
function deepenShang(s: Subject) {
  s.contextIds = ['shang-centres-context'];
  s.summary =
    'Shang rulers and specialists used ritual, writing and bronze to organize relationships among people, ancestors and authority. Divination records preserve selected questions and interpretations; vessels reveal skilled manufacture and ceremonial use. The late capital at Yin Xu belongs within a longer Shang frame. The two museum objects shown here retain their own broad dates and uncertain findspots rather than being assigned to a documented palace or tomb.';
  s.sections = [
    sec(
      'A late capital is not the whole dynasty',
      'The conventional museum frame is c. 1600–1046 BCE. Yin Xu, near Anyang, is a selected late capital dated by UNESCO to c. 1300–1046 BCE, with palace and ancestral shrine remains, royal tombs and inscribed bones. Its monumental and burial evidence concentrates attention on powerful institutions. It also includes pits with human remains interpreted as sacrificial victims. Authority involved unequal power and coercion as well as ceremony; the surviving elite record should not stand for an equal share in that power for every resident.',
      cite('shang-zhou', 'Chronology'),
      cite(
        'shang-yinxu',
        'Description and Brief synthesis: palace, tombs and human remains',
      ),
    ),
    sec(
      'A question became a selected record',
      'The Smithsonian lesson distinguishes the topic or charge, an interpretation of cracks and an outcome that might be recorded, alongside introductory information. Its examples concern rain and hunting. These categories help a reader distinguish a request about the future from a later report of what happened. They are not a translation of the Met fragment. That bone’s record gives only a Shang attribution and inscribed material; no precise findspot, named diviner or narrow object date is supplied in the record used here.',
      cite(
        'shang-divination',
        'Indexed lesson: topic, prognostication and verification',
      ),
      cite('met-42045', 'Title, Period and Medium'),
    ),
    sec(
      'Casting put several skills into one vessel',
      'Piece-mold casting required a model, clay mold sections and, for a hollow vessel, an internal core. Arranging the parts created a space for the metal and a cavity in the finished object. Decoration could be worked into the mold, linking surface design with the making process. The new gong photograph gives a concrete object to inspect: a spout, a handle and densely worked animal forms. It is a pouring vessel, not the excavated mold for this particular casting or proof of one workshop’s entire organization.',
      cite('shang-zhou', 'Piece-mold process and decoration'),
      cite('met-44781', 'Description and Artwork Details'),
    ),
    sec(
      'Offerings joined craft with authority',
      'Food and wine vessels belonged to ritual settings associated with elite power. On this gong, the museum identifies an owl-like form, serpent wings and other creatures. Those identifications should not be converted into a certain explanation of every motif’s meaning. The catalogue says Henan Province, possibly Anyang, and dates the object to the 13th–11th centuries BCE. A possible place attribution is not an excavated burial context, and the broad date label does not establish that it was used in one named king’s ceremony.',
      cite(
        'met-44781',
        'Description; Artwork Details; audio transcript on this vessel',
      ),
      cite('shang-zhou', 'Motif interpretation limits'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Whose activities are recorded?',
      'A record made for a royal ritual can preserve practical concerns while filtering them through the questions of those entitled to ask. Rain matters for production, but a rain inquiry is not a farmer’s own account of work or a measurement of the whole harvest. The supplied lesson’s categories offer a method for reading a particular inscription once a reliable translation exists. The museum bone shown here still lacks such a translation in the consulted record. To extend the story, seek dated workshops, domestic deposits and translated records that can be connected securely to their own contexts.',
      cite(
        'shang-divination',
        'Indexed lesson: rain/hunt topics and inscription elements',
      ),
      cite('met-42045', 'Catalogue scope'),
    ),
    sec(
      'Production, ritual and inequality require different evidence',
      'A hollow cast vessel proves a technical achievement, while identifying its makers and labor arrangements requires more than admiration for the finished surface. The site’s palace and burial assemblages provide social context, but they do not assign every unprovenanced museum object to the same household or ritual. Fu Hao’s tomb is a documented royal context within Yin Xu; neither selected Met object is presented as a find from it. Set technique, context and interpretation beside one another. Shang’s continuation beyond 1200 BCE also prevents Anatolia’s proposed drought episode from becoming a universal end to all Bronze Age societies.',
      cite('shang-yinxu', 'Description: Fu Hao and burial assemblages'),
      cite('met-44781', 'Place attribution'),
      cite('shang-zhou', 'Chronology and casting'),
    ),
  ];
  s.familyActivity = {
    title: 'Make a careful claim from a surface',
    duration: 'About 5 minutes',
    steps: [
      'Compare the bone and gong photographs. Describe one visible feature of each without supplying a translation or symbolic meaning.',
      'In the diagram, distinguish making a hollow vessel from recording a divination question.',
      'Make three short statements about the bone or gong. Begin one with “I can see…”, one with “The museum identifies…”, and one with “I would need more evidence to know…”.',
    ],
    explanation:
      'Observation, catalogue identification and interpretation do different work. Neither museum object is assigned to Fu Hao’s excavated tomb or to a named ceremony.',
  };
  s.evidenceReading = {
    title: 'Read the attribution before telling the story',
    introduction:
      'Museum identifications and the lesson’s paraphrased examples are kept separate from a translation or findspot for the selected objects.',
    items: [
      {
        label: 'The bone’s record is broad',
        text: 'The Met identifies inscribed bone within the Shang period, without a narrower displayed date or a translation in the consulted record.',
        interpretation:
          'The late-capital timeline does not turn this fragment into a securely provenanced Yin Xu excavation find.',
        citations: [cite('met-42045', 'Period, Medium and Artwork Details')],
      },
      {
        label: 'A lesson example belongs to its own source',
        text: 'The Smithsonian lesson distinguishes charge, crack interpretation and reported outcome, with rain and hunting examples.',
        interpretation:
          'Those examples explain a practice. They are not the writing on this Met bone; the diagram supplies no invented ancient signs.',
        citations: [cite('shang-divination', 'Indexed teaching passage')],
      },
      {
        label: 'Possibly Anyang is not an excavation label',
        text: 'The gong record gives Henan Province, possibly Anyang, a 13th–11th-century BCE date and bronze as its material.',
        interpretation:
          'Read the spout and handle as visible features. Do not infer a named owner, workshop or excavated tomb from a broad cultural attribution.',
        citations: [cite('met-44781', 'Date, Culture and Medium')],
      },
    ],
  };
  s.dimensions['Work and coordination'] = dim(
    'A model, sectional molds and core required coordinated skilled production. Ritual records and burial contexts address authority through different evidence.',
    'shang-zhou',
    'Casting method and ritual context',
  );
  s.claims.push(
    fact(
      'shang-yinxu-frame',
      'Yin Xu’s c1300–1046 BCE late-capital frame is narrower than the conventional c1600–1046 BCE Shang period.',
      'shang-yinxu',
      'Description',
    ),
  );
  s.returnPrompt =
    'What would let you connect a particular object with a maker, a place of production or a named ritual rather than only a broad cultural label?';
  s.review = review([
    'The selected bone has no supplied translation or precise findspot. The gong is only possibly from Anyang.',
    'The Smithsonian lesson was consulted through indexed passages; direct retrieval failed. No independent reading of the original inscription is claimed.',
    'Detailed workshop organization, household/gender histories and the social status of workers need dedicated evidence.',
  ]);
}
const contexts: HistoricalContext[] = [
  {
    id: 'hattusha-capital-context',
    title: 'Hattusha: settlement, capital and transformation',
    region: 'West/Central Asia',
    interval: interval(
      -2000,
      -1180,
      'c. 2000–1180 BCE: selected settlement and capital orientation',
      'The frame opens before the Hittite capital and ends with an approximate capital-era endpoint in the DAI overview. It is not the settlement’s entire lifespan or one exact destruction date.',
    ),
    summary:
      'The original 13th-century inquiry remains a case within a longer institutional and settlement history. Gordion’s drought record and the capital’s political transition have their own dates and limits.',
    subjectIds: ['hattusha-change'],
    citations: [
      cite('hattusha-dai', 'Project overview'),
      cite('hattusha-research', 'Abstract'),
    ],
    phases: [
      {
        year: -1900,
        label: 'Before the Hittite capital (orientation)',
        title: 'Earlier settlement and trade',
        text: 'The excavated residential sequence extends from the kārum period into Hittite phases. The viewing year is an approximate orientation, not a source date for a specific house or the late royal administration.',
        citations: [cite('hattusha-houses', 'Abstract')],
      },
      {
        year: -1650,
        label: 'From around 1650 BCE',
        title: 'A capital and cult centre',
        text: 'The DAI’s broad capital orientation begins here, with palace, temples and archives as institutional evidence. It does not imply an unchanging court or uniform occupation.',
        citations: [cite('hattusha-dai', 'Project overview')],
      },
      {
        year: -1300,
        label: '13th century BCE, approaching c. 1200',
        title: 'The preserved case window',
        text: 'The dossier’s original interval remains unchanged. The overall city plan must still be read as a composite of phases.',
        citations: [cite('hattusha-research', 'Abstract')],
      },
      {
        year: -1198,
        label: 'Around 1198–1196 BCE (±3 years)',
        title: 'A severe dry episode in the Gordion record',
        text: 'The central estimate follows the approximate case endpoint. Its three-year uncertainty can overlap that boundary. It supplies a possible environmental stress, not an exact year for every institutional ending.',
        citations: [cite('hittite-drought', 'Abstract and printed pp. 721–722')],
      },
      {
        year: -1180,
        label: 'Around 1180 BCE: broad orientation endpoint',
        title: 'Capital-era transition, with later lives',
        text: 'The project overview’s capital frame ends approximately here. Royal withdrawal, later burning and continued settlement histories must not be merged into the disappearance of a whole population.',
        citations: [
          cite('hattusha-dai', 'Capital frame and later occupation'),
          cite('hittite-drought', 'Printed pp. 719–722'),
        ],
      },
    ],
  },
  {
    id: 'uluburun-exchange-context',
    title: 'Uluburun within eastern Mediterranean exchange',
    region: 'West/Central Asia',
    interval: interval(
      -1500,
      -1200,
      'c. 1500–1200 BCE: selected exchange orientation',
      'An authored regional teaching window around the wreck and later transformations, not the lifespan of one trade network or a confirmed shipping itinerary.',
    ),
    summary:
      'Place a single shipment within a wider history of manufacture, transport and exchange. Objects travelled together, but proposed origins and routes require separate arguments.',
    subjectIds: ['uluburun'],
    citations: [
      cite('uluburun', 'Project account'),
      cite('uluburun-tin-2022', 'Introduction and regional context'),
    ],
    phases: [
      {
        year: -1500,
        label: 'Later second millennium BCE',
        title: 'Production and exchange before the wreck',
        text: 'The frame opens within a period of regional movement of raw materials and finished goods. No single founding event for a unified network is asserted.',
        citations: [cite('uluburun-tin-2022', 'Introduction')],
      },
      {
        year: -1335,
        label: 'c. 1335–1305 BCE: the case envelope',
        title: 'An approximate wreck window',
        text: 'These bounds express the INA account’s c1320 BCE ±15 estimate. They do not identify the exact year of sailing or sinking.',
        citations: [cite('uluburun', 'Date of wreck header')],
      },
      {
        year: -1320,
        label: 'Around 1320 BCE (±15 years)',
        title: 'One cargo association',
        text: 'Copper, tin, containers and other goods were recovered in association with a hull and anchors. Not every recovery position is an original stowage position.',
        citations: [
          cite('uluburun', 'Cargo, hull and anchors'),
          cite('uluburun-1990', 'Printed pp. 8–11'),
        ],
      },
      {
        year: -1200,
        label: 'Around 1200 BCE',
        title: 'A later set of regional transformations',
        text: 'The earlier wreck cannot prove all maritime exchange stopped at this later date or explain every political transition.',
        citations: [
          cite('hittite-drought', 'Discussion: regional differences and continuation'),
        ],
      },
    ],
  },
  {
    id: 'shang-centres-context',
    title: 'Shang institutions and the late capital at Yin Xu',
    region: 'East Asia',
    interval: interval(
      -1600,
      -1046,
      'c. 1600–1046 BCE: conventional Shang orientation',
      'The wider period convention is distinct from Yin Xu’s c1300–1046 BCE frame and the dates/provenance of individual objects. Neither selected Met object is assigned to an excavated royal tomb.',
    ),
    summary:
      'Separate a dynasty label, a late capital, divination practices and specific objects. Their overlapping dates do not make them one archive or one documented workshop.',
    subjectIds: ['shang-ritual'],
    citations: [cite('shang-zhou', 'Chronology'), cite('shang-yinxu', 'Description')],
    phases: [
      {
        year: -1600,
        label: 'Around 1600 BCE: conventional period start',
        title: 'The broader Shang frame',
        text: 'This is the museum period convention, not the founding date of the late capital or a narrow date for the selected bone.',
        citations: [cite('shang-zhou', 'Shang chronology')],
      },
      {
        year: -1300,
        label: 'c. 1300–1046 BCE',
        title: 'The late-capital orientation',
        text: 'Yin Xu’s palace/ancestral shrine and royal tomb areas provide dated archaeological contexts within the broader period.',
        citations: [cite('shang-yinxu', 'Description and Brief synthesis')],
      },
      {
        year: -1200,
        label: 'Within the 13th–11th centuries BCE',
        title: 'The selected pouring vessel',
        text: 'The gong’s date is broad and its Anyang attribution qualified. This viewing anchor does not date a known casting event to 1200 BCE.',
        citations: [cite('met-44781', 'Date and Culture')],
      },
      {
        year: -1046,
        label: 'Around 1046 BCE: conventional transition',
        title: 'A different political transition',
        text: 'The Met chronology places the Shang–Zhou change here, later than the transformations around 1200 in Anatolia. It is not evidence for one global collapse.',
        citations: [cite('shang-zhou', 'Shang and Zhou chronology')],
      },
    ],
  },
];
const journey: Journey = {
  id: 'institutions-shipment-ritual',
  title: 'Institutions, shipments and ritual',
  question: 'How far can a record take us from materials to people?',
  duration: 'About 20–30 minutes',
  printSourcesPerPage: 3,
  introduction:
    'Read a wreck, a capital and ritual objects in thematic order. Their evidence reveals work and power in different ways. This is not a confirmed route between the three cases or a single worldwide collapse story.',
  stops: [
    {
      subject: 'uluburun',
      year: -1320,
      title: 'Separate findspot, cargo and proposed origin',
      narrative:
        'Use the evidence diagram to identify recovered association, laboratory inference and unresolved itinerary. Explain why none is a substitute for the others.',
      compare: 'hattusha-change',
    },
    {
      subject: 'hattusha-change',
      year: -1200,
      title: 'Place a stress within institutions',
      narrative:
        'Keep the capital’s phases separate from Gordion’s environmental proxy. Ask what would connect a crop stress with a dated institutional decision.',
      compare: 'uluburun',
    },
    {
      subject: 'shang-ritual',
      year: -1200,
      title: 'Look at making, then at attribution',
      narrative:
        'Compare bone and gong, and follow the casting/divination guide. Distinguish visible features, a catalogue attribution and a claim that needs a known findspot or translation.',
      object: 'met-44781',
      compare: 'uluburun',
    },
  ],
  conclusion:
    'A secure association does not settle origins; a dated stress does not decide causation; a ritual object does not preserve every participant’s experience. State one supported mechanism and identify the evidence still needed to connect it with particular people.',
  evidence: {
    prompt: 'Which claim respects the different records?',
    options: [
      {
        text: 'The wreck, proxy and ritual objects support different arguments; each needs contextual evidence to identify particular people, decisions or routes.',
        supported: true,
        feedback:
          'Yes. A recovered association, moisture proxy and museum attribution are different kinds of knowledge. Match the inference to the source and preserve its limits.',
      },
      {
        text: 'The measured drought proves the Uluburun ship sank and Shang society ended in the same worldwide event.',
        supported: false,
        feedback:
          'The wreck is earlier, Shang’s conventional endpoint is later, and the drought source cannot establish direct causation even for the Hittite transformation.',
      },
      {
        text: 'A possible Anyang attribution and a suggested tin source can both be treated as documented excavation findspots.',
        supported: false,
        feedback:
          'The documented wreck location is different from an inferred material origin or a qualified museum place attribution. Keep those labels separate.',
      },
    ],
    citations: [
      cite('uluburun', 'Wreck date and association'),
      cite('hittite-drought', 'Printed pp. 721–722, causation limit'),
      cite('met-44781', 'Qualified Culture field'),
    ],
  },
  returnPrompt:
    'Choose two cases. Name what is observed or recovered, what is inferred about organization, and one new source that could test the inference.',
};
export function applyBronzeInstitutions(corpus: Corpus) {
  corpus.sources.push(...sources);
  deepenHattusha(corpus.subjects.find((s) => s.id === 'hattusha-change')!);
  deepenUluburun(corpus.subjects.find((s) => s.id === 'uluburun')!);
  deepenShang(corpus.subjects.find((s) => s.id === 'shang-ritual')!);
  corpus.contexts = [...(corpus.contexts ?? []), ...contexts];
  corpus.media.push(...bronzeInstitutionsMedia);
  for (const m of bronzeInstitutionsMedia)
    corpus.subjects.find((s) => s.id === m.subject)!.objectIds.push(m.id);
  corpus.journeys.push(journey);
  corpus.journeys.find((j) => j.id === 'networks-disruption')!.printSourcesPerPage = 3;
  const drought = corpus.sources.find((s) => s.id === 'hittite-drought')!;
  drought.author = 'Sturt W. Manning, Cindy Kocik, Brita Lorentzen and Jed P. Sparks';
  drought.url = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9946833/';
  drought.scope =
    'Publisher PDF downloaded (24 pages including Methods/extended data); main text pp. 719–722, Discussion and relevant Methods read. First four PDF pages visually inspected. Gordion juniper timbers, moisture-sensitive proxies, 1198–1196 BCE ±3-year dating and explicit direct-causation limit. The record does not quantify rainfall at Hattusha. Author metadata corrected from Charlotte to Cindy Kocik against the original first page. Not an exhaustive supplement audit.';
  for (const id of [
    'hattusha',
    'hattusha-research',
    'hittite-drought',
    'uluburun',
    'shang-zhou',
    'met-42045',
  ])
    corpus.sources.find((s) => s.id === id)!.accessed = consulted;
  corpus.sources.find((s) => s.id === 'uluburun')!.scope =
    'Full excavators’ project account consulted: c1320 BCE ±15 wreck estimate, cargo, cedar hull, joints, anchors and personal-effects interpretation. The site’s suggested crew/passengers are not a passenger list. Compared with specified original 1990 campaign pages and later contested provenance studies; photographs are linked, not reproduced.';
  const pack = corpus.packs.find((p) => p.id === 'C2')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['uluburun', 'shang-ritual'],
      start: -1600,
      end: -1046,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Keep the documented wreck off southwestern Anatolia, the central Anatolian capital/Gordion proxy and the Chinese objects’ qualified attributions distinct. No connecting route is drawn.',
      limits:
        'Three expanded inquiries within a wider selective chapter. Domestic histories, detailed phase maps and independent/human acceptance remain open. Kerma, Olmec, Lapita and other regional reference frameworks are not completed by this batch.',
    },
  ];
  pack.coverage['West/Central Asia'].reason =
    'Expanded Hattusha and Uluburun accounts distinguish capital phases, Gordion drought proxy, wreck association and contested tin provenance. These do not supply a full eastern Mediterranean or inland Asian reference history.';
  pack.coverage['East Asia'].reason =
    'Expanded Shang account separates the conventional period, Yin Xu late capital, ritual/casting practice and object-specific attribution. Household and wider regional coverage remain limited; no shared Anatolian collapse is inferred.';
}
