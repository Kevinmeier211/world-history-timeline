import { cite, claim, interval, metEssay, sec, subject } from './content-helpers';
import type { Source, Subject, Journey } from '../../src/atlas/model';
export const bronzeSources: Source[] = [
  {
    id: 'hattusha',
    title: 'Hattusha: the Hittite Capital',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/377/',
    type: 'archaeology',
    accessed: '2026-10-26',
    scope:
      'City organization, temples, residences and fortifications; not an exact reconstruction of all phases.',
  },
  {
    id: 'hattusha-research',
    title:
      'A new look at an ancient city: chronological and urban development of Ḫattuša',
    author: 'Andreas Schachner',
    institution: 'Anatolian Studies / Deutsches Archäologisches Institut',
    url: 'https://www.cambridge.org/core/journals/anatolian-studies/article/abs/new-look-at-an-ancient-city-an-outline-of-the-chronological-and-urban-development-of-the-hittite-capital-hattusa/871EDFEBD924576F4FCA67BA0F0CD265',
    type: 'scholarship',
    published: '2024-04-30',
    accessed: '2026-10-26',
    scope:
      'Abstract only: changing settled areas, continued use, and idealized overall site plan. No claims from inaccessible full text.',
  },
  {
    id: 'hittite-drought',
    title:
      'Severe multi-year drought coincident with Hittite collapse around 1198–1196 BC',
    author: 'Sturt W. Manning, Charlotte Kocik, Brita Lorentzen and Jed P. Sparks',
    institution: 'Nature 614, 719–724',
    url: 'https://doi.org/10.1038/s41586-022-05693-y',
    type: 'scholarship',
    published: '2023-02-08',
    accessed: '2026-10-26',
    scope:
      'Indexed full primary text consulted: juniper tree-ring and isotope evidence; explicit inability to establish direct causation; abandonment/burning distinction. Direct HTML redirected to an inaccessible authorization endpoint.',
  },
  {
    id: 'uluburun',
    title: 'Uluburun Late Bronze Age Shipwreck Excavation',
    institution: 'Institute of Nautical Archaeology',
    url: 'https://nauticalarch.org/projects/uluburun-late-bronze-age-shipwreck-excavation/',
    type: 'archaeology',
    accessed: '2026-10-26',
    scope:
      'Excavators’ project account: wreck date c1320±15 BCE, copper/tin cargo, varied goods, hull and interpretive limits. Indexed primary account consulted; direct open timed out.',
  },
  metEssay(
    'shang-zhou',
    'Shang and Zhou Dynasties: The Bronze Age of China',
    'shang-and-zhou-dynasties-the-bronze-age-of-china',
    'Chronology; ritual bronze; piece-mold casting; unknown motif meanings. Aesthetic rankings are not adopted.',
    'Department of Asian Art',
    '2004-10',
  ),
  metEssay(
    'chinese-music',
    'Music and Art of China',
    'music-and-art-of-china',
    'Shang oracle-bone references to ritual dance and music.',
    'J. Kenneth Moore',
    '2009-09',
  ),
  {
    id: 'kerma',
    title: 'Sudan, 2000–1000 B.C.',
    institution: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/fr/toah/ht/03/afs.html',
    type: 'scholarship',
    accessed: '2026-10-26',
    scope:
      'Middle/Classical Kerma chronology and trade; broad aesthetic superlatives are not adopted.',
  },
  metEssay(
    'olmec',
    'Olmec Art',
    'olmec-art',
    '1200–400 BCE cultural/artistic frame, building work, materials and explicit research limits.',
    'James Doyle',
    '2017-02',
  ),
  metEssay(
    'lapita',
    'Lapita Pottery (ca. 1500–500 B.C.)',
    'lapita-pottery-ca-1500-500-b-c',
    'Pottery-style frame, toothed-stamp technique and proposed uses. Broad ancestral equations are qualified.',
    'Jennifer Wagelie',
    '2002-10',
  ),
  {
    id: 'lapita-voyaging',
    title: 'Pacific migrations: Into Remote Oceania, Lapita people',
    author: 'Geoff Irwin',
    institution: 'Te Ara, Ministry for Culture and Heritage, New Zealand',
    url: 'https://teara.govt.nz/en/pacific-migrations/page-3',
    type: 'scholarship',
    accessed: '2026-10-26',
    scope:
      'c1500 BCE Bismarck emergence; 1100–800 BCE movement to Fiji and West Polynesia; differing subsistence interpretations.',
  },
];
export const bronzeSubjects: Subject[] = [
  subject({
    id: 'hattusha-change',
    name: 'Hattusha and the problem of collapse',
    aliases: ['Hittites', 'Hattusa', '1200 BCE'],
    kind: 'period',
    region: 'West/Central Asia',
    place: 'Central Anatolia, present-day Türkiye',
    coordinates: [34.62, 40.02],
    geographicPrecision: 'Capital-site locator; no reconstructed imperial border.',
    interval: interval(
      -1300,
      -1200,
      '13th century BCE, approaching c. 1200',
      'Investigation window for the late capital and political transformation; not the city’s entire occupation or an exact destruction year.',
      'approximate',
    ),
    packs: ['C2'],
    question: 'Does evidence for drought explain a political ending?',
    summary:
      'Hattusha’s temples, residences and walls reveal a capital whose built areas changed over time. Near 1200 BCE, the central Hittite political order broke apart. A tree-ring study identifies severe drought near that transition, yet its authors explicitly cannot establish direct causation. Dating a stress and explaining a political outcome are different historical tasks.',
    sections: [
      sec(
        'A plan can combine different moments',
        'UNESCO describes the capital’s monumental remains. Schachner’s 2024 abstract emphasizes changing occupied areas and warns that the familiar overall plan is an idealized reconstruction: the whole city probably never looked exactly like that at one time. A site map needs the same chronological criticism as a written account.',
        cite('hattusha', 'Brief synthesis'),
        cite('hattusha-research', 'Abstract, final sentences'),
      ),
      sec(
        'A specific environmental finding',
        'Manning and colleagues identify unusually dry conditions around 1198–1196 BCE from central Anatolian juniper tree-ring and isotope evidence. Their analysis concerns moisture and possible stress on food systems. It is not a measurement of the temperature of the entire world, and it cannot by itself prove which decisions caused the central administration to end.',
        cite(
          'hittite-drought',
          'Results and discussion: drought episode and direct-causation limitation',
        ),
      ),
      sec(
        'Collapse of what, and for whom?',
        'The study distinguishes abandonment of the royal center from later burning and notes continued forms of political and cultural life elsewhere. Political fragmentation is not the disappearance of everyone who lived in a region. Compare the surviving capital with a shipwreck from the preceding century, then ask what intervening evidence would be needed to connect their stories.',
        cite('hittite-drought', 'Historical context and concluding discussion'),
        cite('uluburun', 'Wreck date and cargo account'),
      ),
    ],
    claims: [
      claim(
        'hittite-proxy',
        'The primary study identifies drought around 1198–1196 BCE but cannot establish direct causation for collapse.',
        [cite('hittite-drought', 'Discussion, explicit causation limitation')],
      ),
      claim(
        'hattusha-plan',
        'The archaeological abstract warns that the combined site plan does not represent one fully occupied moment.',
        [cite('hattusha-research', 'Abstract')],
      ),
    ],
    objectIds: [],
    terms: ['evidence', 'inference', 'archaeology'],
    dimensions: {
      'Surviving evidence': {
        text: 'Architecture and environmental proxies support different questions. A coincident drought is not a sufficient political explanation.',
        citations: [
          cite('hattusha-research', 'Abstract'),
          cite('hittite-drought', 'Causation limitation'),
        ],
      },
      'Work and production': {
        text: 'A large capital required provisioning; severe drought is a proposed stress on those systems, not a complete explanation of political action.',
        citations: [cite('hittite-drought', 'Subsistence and storage discussion')],
      },
    },
    returnPrompt:
      'What extra evidence would turn a coincidence in time into a stronger causal explanation?',
  }),
  subject({
    id: 'uluburun',
    name: 'Uluburun: a cargo beneath the sea',
    aliases: ['Bronze Age trade', 'Shipwreck'],
    kind: 'place',
    region: 'West/Central Asia',
    place: 'Off Kaş, eastern Mediterranean coast of Türkiye',
    coordinates: [29.68, 36.13],
    geographicPrecision:
      'Wreck-region locator in southwestern Anatolia; no exact ship track is reconstructed.',
    interval: interval(
      -1335,
      -1305,
      'c. 1320 BCE ±15 years',
      'Dating reported by the excavators’ project page; not an exact sailing or sinking year.',
      'range',
    ),
    packs: ['C2'],
    question: 'What traveled together on one ship?',
    summary:
      'A ship carrying copper, tin, containers and luxury materials sank near the Anatolian coast. Objects found together supply stronger evidence of one shipment than similarity between isolated museum pieces. The wreck illuminates a network of production and exchange, while its surviving cargo does not disclose every port, owner or passenger with equal certainty.',
    sections: [
      sec(
        'Association is a kind of evidence',
        'INA describes copper and tin ingots, pottery and varied valuable materials in one wreck. The archaeological association matters: these things traveled together before the ship sank. Their origins, owners and destinations require additional analysis. Do not convert a list of materials into a fully known itinerary.',
        cite('uluburun', 'Cargo paragraphs'),
      ),
      sec(
        'The ship itself is part of the story',
        'Hull remains and anchors reveal construction and operation, not merely the goods being sold. The excavators describe cedar planking and pegged joints. Those material traces make specialized maritime work visible alongside elite consumption. The precise identity of people aboard is an interpretation from surviving effects, not a passenger list.',
        cite('uluburun', 'Hull, anchors and personal effects discussion'),
      ),
      sec(
        'Before the disruptions',
        'The wreck’s date precedes the changes around 1200 BCE. It demonstrates some earlier connections; it does not show all trade ceasing in one later year. Pair it with Hattusha to distinguish evidence of an operating network from an explanation of why particular political centers changed.',
        cite('uluburun', 'Date of wreck and cargo'),
        cite('hittite-drought', 'Regional variability and continued life discussion'),
      ),
    ],
    claims: [
      claim(
        'uluburun-range',
        'The excavators’ project account reports a wreck date around 1320 BCE ±15 years.',
        [cite('uluburun', 'Date of wreck header')],
      ),
      claim(
        'uluburun-cargo',
        'Copper and tin ingots formed part of the cargo found together.',
        [cite('uluburun', 'Main cargo paragraph')],
      ),
    ],
    objectIds: [],
    terms: ['port', 'archaeology', 'provenance'],
    dimensions: {
      'Surviving evidence': {
        text: 'A wreck preserves a group of associated objects; it provides a shipment context but not a complete itinerary.',
        citations: [cite('uluburun', 'Cargo and interpretation')],
      },
      'Work and production': {
        text: 'Hull construction, anchors and cargo connect seafaring skill with the movement of raw materials and finished goods.',
        citations: [cite('uluburun', 'Hull and cargo')],
      },
    },
    returnPrompt:
      'Why is finding two objects together different from finding two similar objects in separate museums?',
  }),
  subject({
    id: 'shang-ritual',
    name: 'Shang: ritual, writing and bronze',
    aliases: ['Shang Dynasty', 'Oracle bones'],
    kind: 'period',
    region: 'East Asia',
    place: 'Yellow River region; Anyang as a late center',
    coordinates: [114.35, 36.1],
    geographicPrecision:
      'Late Shang center locator, not the findspot of every bone or vessel.',
    interval: interval(
      -1600,
      -1046,
      'c. 1600–1046 BCE',
      'Conventional Shang period in the current museum sources; individual objects can have narrower dates.',
      'approximate',
    ),
    packs: ['C2'],
    question: 'What did people choose to ask and record?',
    summary:
      'Inscribed bones and ritual bronzes preserve selected activities of Shang society. They lead into questions about ancestors, authority, skilled production and the act of asking about the future. These are not records of every person’s thoughts. A royal or elite ritual archive can be unusually detailed while remaining highly selective about whose concerns survive.',
    sections: [
      sec(
        'A bone as a surface for words',
        'The selected object is catalogued as an inscribed oracle bone under the broad Shang period, without a narrower displayed object date. The museum’s music history discusses oracle-bone references to ritual dance and music. The atlas does not invent a translation of this particular specimen merely because its category is known.',
        cite('met-42045', 'Title, Period and Medium'),
        cite('chinese-music', 'Shang oracle-bone paragraph'),
      ),
      sec(
        'Bronze required organized skill',
        'The Shang–Zhou essay describes piece-mold casting: a model, a sectional mold and a core for hollow vessels. Technique required planning and skilled work. The elaborate designs served ritual settings, while the meaning of particular motifs can remain uncertain. Technical knowledge and symbolic interpretation need different evidence.',
        cite('shang-zhou', 'Piece-mold method; decorative motifs'),
      ),
      sec(
        'Contemporary does not mean one crisis',
        'Shang contexts overlap the eastern Mediterranean’s disruptions. That does not make Hattusha’s proposed environmental stress a global explanation. Place the records side by side to compare different institutions and sources, without inventing a shared collapse or a cultural-continuity edge.',
        cite('shang-zhou', 'Chronology'),
        cite('hittite-drought', 'Regional context and variability'),
      ),
    ],
    claims: [
      claim(
        'shang-period',
        'The current museum chronology places Shang approximately 1600–1046 BCE.',
        [cite('shang-zhou', 'Shang chronology paragraph')],
      ),
      claim(
        'shang-bone',
        'The selected specimen is identified as an oracle bone made of inscribed bone.',
        [cite('met-42045', 'Title and Medium')],
      ),
    ],
    objectIds: ['met-42045'],
    terms: ['ritual', 'inscription', 'dynasty'],
    dimensions: {
      'Surviving evidence': {
        text: 'An elite ritual record reveals selected questions; no translation of this particular bone is supplied without a source.',
        citations: [
          cite('met-42045', 'Catalogue'),
          cite('chinese-music', 'Oracle-bone references'),
        ],
      },
      'Work and production': {
        text: 'Piece-mold bronze casting required models, sectional molds and cores; motif meanings are not always known.',
        citations: [cite('shang-zhou', 'Casting technique and motifs')],
      },
    },
    returnPrompt:
      'How might a record of questions asked by rulers differ from a record made by farmers?',
  }),
  subject({
    id: 'kerma-potters',
    name: 'Kerma, Egypt and a traveling beaker',
    aliases: ['Kerma', 'Nubia'],
    kind: 'period',
    region: 'Africa',
    place: 'Upper Nubia; selected beaker found at Abydos in Egypt',
    coordinates: [30.41, 19.6],
    geographicPrecision:
      'Kerma regional anchor; the actual beaker findspot is Abydos, separately stated.',
    interval: interval(
      -2050,
      -1500,
      'c. 2050–1500 BCE',
      'Middle and Classical Kerma frame in the regional chronology; not the full history of Nubia.',
      'approximate',
    ),
    packs: ['C1', 'C2'],
    question: 'Can a pot identify the person buried beside it?',
    summary:
      'A thin-walled Kerma beaker has a red body, black upper surface and a lustrous boundary between them. Its manufacture required careful firing and finishing. This particular vessel was excavated at Abydos in Egypt. It shows the movement of material traditions, while the identity of the grave’s owner remains less certain than the pot’s archaeological location.',
    sections: [
      sec(
        'Controlled fire and skilled hands',
        'The catalogue explains hand-forming, red ocher, polishing and firing conditions that created the contrasting surfaces. Observe the vessel as an achievement of work and materials, rather than using “simple technology” as a judgment about its makers. The beaker’s catalogue date is approximately 1802–1640 BCE.',
        cite('met-545772', 'Description; Date'),
      ),
      sec(
        'Findspot is not identity',
        'The vessel was found in Abydos tomb 525. The museum notes that comparable Egyptian tombs contain both Kerma ceramics and Egyptian goods. It proposes, but does not establish, that some owners may have been traders from Kerma living in Egypt. Possession of an object does not automatically identify a person’s origin.',
        cite('met-545772', 'Final descriptive paragraph; Geography'),
      ),
      sec(
        'Neighbors had changing relationships',
        'The regional chronology describes Kerma as a trading partner and sometimes an adversary of Egypt. Those relationships changed across time. A ceramic style, a political entity and a person’s identity are different units; drawing one continuous cultural ribbon through all three would conceal the historical questions.',
        cite('kerma', 'Overview and Middle/Classical Kerma key event'),
      ),
    ],
    claims: [
      claim(
        'kerma-beaker-date',
        'The catalogue dates this beaker approximately 1802–1640 BCE.',
        [cite('met-545772', 'Date')],
      ),
      claim(
        'kerma-findspot',
        'The beaker was excavated in Abydos tomb 525; a Nubian identity for the owner is not certain.',
        [cite('met-545772', 'Geography; final descriptive paragraph')],
      ),
    ],
    objectIds: ['met-545772'],
    terms: ['provenance', 'inference', 'material culture'],
    dimensions: {
      'Surviving evidence': {
        text: 'A documented grave context securely locates the vessel; the owner’s identity is a more tentative inference.',
        citations: [cite('met-545772', 'Geography and interpretation')],
      },
      'Work and production': {
        text: 'Hand-forming, polishing and controlled firing produced a thin-walled vessel with contrasting surfaces.',
        citations: [cite('met-545772', 'Manufacture description')],
      },
    },
    returnPrompt:
      'What additional evidence would strengthen the proposal that the grave owner came from Kerma?',
  }),
  subject({
    id: 'olmec',
    name: 'Olmec communities and material worlds',
    aliases: ['Olmec', 'San Lorenzo', 'La Venta'],
    kind: 'society',
    region: 'Americas',
    place: 'Gulf Coast and connected Mesoamerican regions',
    coordinates: [-94.81, 17.75],
    geographicPrecision:
      'San Lorenzo regional anchor; cultural labels do not define one state or every object’s findspot.',
    interval: interval(
      -1200,
      -400,
      'c. 1200–400 BCE',
      'Cultural and artistic flourishing frame in Doyle’s essay; not one kingdom’s precise lifespan.',
      'approximate',
    ),
    packs: ['C2', 'C3'],
    question: 'What does a small figure reveal that a monument cannot?',
    summary:
      'Olmec-associated communities built substantial gathering places and made finely worked ceramic and stone objects. A small figure shifts attention toward adornment, bodies and social meaning. The label “Olmec” groups archaeological and artistic material; it should not turn all the people and places involved into a single, fully known state or an inevitable ancestor of every later society.',
    sections: [
      sec(
        'Making places together',
        'Doyle describes cooperation in building platforms and mounds at San Lorenzo while explicitly identifying gaps about food, residence and belief. Large structures establish coordinated investment, not a complete picture of the people who built them. Material movement must be investigated through actual provenance and context.',
        cite('olmec', 'San Lorenzo and research-limits paragraphs'),
      ),
      sec(
        'A body deliberately represented',
        'The ceramic female figure is dated 1200–900 BCE. The catalogue discusses adornment, hair and modified features as evidence for status and social identification, while some specific meanings remain proposals. Observe which features are exaggerated or carefully modeled. A representation is a choice, not a photograph of every person’s body or appearance.',
        cite('met-314609', 'Description; Date'),
      ),
      sec(
        'Scale changes the question',
        'Small figures can be held and moved, unlike monumental sculpture. The catalogue discusses proposed household and ritual contexts for figurines but attributes those interpretations to scholars. A fair account keeps such interpretations distinct from direct observation and avoids assigning one universal use to all figurines.',
        cite('met-314609', 'Discussion of Joyce and Marcus; handling and contexts'),
      ),
    ],
    claims: [
      claim(
        'olmec-frame',
        'Doyle uses approximately 1200–400 BCE for a major Olmec cultural and artistic flourishing.',
        [cite('olmec', 'Opening paragraph')],
      ),
      claim('olmec-figure-date', 'The selected ceramic figure is dated 1200–900 BCE.', [
        cite('met-314609', 'Date'),
      ]),
    ],
    objectIds: ['met-314609'],
    terms: ['material culture', 'ritual', 'inference'],
    dimensions: {
      'Surviving evidence': {
        text: 'Platforms and small figures preserve different scales of action; precise beliefs and functions can remain uncertain.',
        citations: [
          cite('olmec', 'Research limits'),
          cite('met-314609', 'Scholarly interpretations'),
        ],
      },
      'Work and production': {
        text: 'Coordinated building and ceramic modeling required different kinds of skilled and collective work.',
        citations: [
          cite('olmec', 'San Lorenzo and pottery'),
          cite('met-314609', 'Description'),
        ],
      },
    },
    returnPrompt:
      'How does changing from a large monument to a hand-held figure change the questions you can ask?',
  }),
  subject({
    id: 'lapita',
    name: 'Lapita: pottery and island voyaging',
    aliases: ['Lapita', 'Remote Oceania'],
    kind: 'society',
    region: 'Southeast Asia/Oceania',
    place: 'Bismarck Archipelago and routes into Remote Oceania',
    coordinates: [151.0, -5.0],
    geographicPrecision:
      'Broad emergence region; not one exact starting village or a territorial border.',
    interval: interval(
      -1500,
      -500,
      'c. 1500–500 BCE',
      'Broad pottery-style frame in the museum essay; regional settlement and later histories have different dates.',
      'approximate',
    ),
    packs: ['C2', 'C3'],
    question: 'How can pottery help trace journeys across water?',
    summary:
      'Repeated stamped patterns on pottery help archaeologists investigate connections among island communities. Lapita is an archaeological cultural complex, not a single empire. Its history includes skilled voyaging, settlement and changing ways to obtain food. Similar designs can be evidence to test, but they should be combined with dates, contexts and other material before reconstructing movement.',
    sections: [
      sec(
        'A pattern made from smaller marks',
        'The Met describes designs assembled with toothed tools pressed into clay before firing. Pots could serve food-related purposes, though intended use needs context. A broken sherd may preserve technique and pattern even when the whole vessel and its history are lost.',
        cite('lapita', 'Ceramic technique and proposed uses'),
      ),
      sec(
        'Different islands, different sequences',
        'Irwin places an early Lapita complex in the Bismarcks around 1500 BCE and movement toward Fiji and West Polynesia especially around 1100–800 BCE. Those ranges describe stages in a large region, not one simultaneous founding event. Some communities settled while others continued traveling.',
        cite('lapita-voyaging', 'Emergence and Lapita in Remote Oceania'),
      ),
      sec(
        'Food and the limits of a neat package',
        'Te Ara distinguishes evidence for transported plants and animals from debate about the earliest eastern settlers’ subsistence. They may not all have arrived with an identical farming system. Follow food, pottery and settlement evidence separately; no single artifact should be made to carry an entire population’s history.',
        cite('lapita-voyaging', 'Food and alternative foraging interpretation'),
      ),
    ],
    claims: [
      claim(
        'lapita-emergence',
        'Te Ara places the Lapita complex in the Bismarck Archipelago around 1500 BCE.',
        [cite('lapita-voyaging', 'Opening paragraph')],
      ),
      claim(
        'lapita-technique',
        'Repeating patterns were formed with toothed stamping tools before firing.',
        [cite('lapita', 'Ceramic technique')],
      ),
    ],
    objectIds: [],
    terms: ['material culture', 'archaeology', 'inference'],
    dimensions: {
      'Surviving evidence': {
        text: 'Dated pottery, settlement remains and food evidence must be considered together; a design alone cannot recover an entire voyage.',
        citations: [
          cite('lapita', 'Pottery'),
          cite('lapita-voyaging', 'Settlement and food'),
        ],
      },
      'Work and production': {
        text: 'Ceramic technique and seafaring knowledge supported communities whose subsistence strategies could differ.',
        citations: [
          cite('lapita', 'Technique'),
          cite('lapita-voyaging', 'Alternative subsistence interpretations'),
        ],
      },
    },
    returnPrompt:
      'What would you want to know before treating two similar pottery designs as evidence of a journey?',
  }),
];
export const bronzeJourney: Journey = {
  id: 'networks-disruption',
  title: 'Connected worlds, different disruptions',
  question: 'What changed around 1200 BCE—and what did not?',
  duration: '25–40 minutes',
  introduction:
    'Begin before the eastern Mediterranean disruptions, then compare evidence from other regions. This is a regional historical investigation inside a wider world, not one global collapse story.',
  stops: [
    {
      subject: 'uluburun',
      year: -1320,
      title: 'One shipment with many materials',
      narrative:
        'Distinguish objects found together in a wreck from a fully reconstructed route.',
    },
    {
      subject: 'hattusha-change',
      year: -1200,
      title: 'A dated stress is not a whole explanation',
      narrative:
        'Separate a tree-ring drought finding, political transformation and the changing occupation of a capital.',
      compare: 'uluburun',
    },
    {
      subject: 'kerma-potters',
      year: -1700,
      title: 'Material can travel without settling identity',
      narrative:
        'Inspect a Kerma vessel excavated in Egypt. Keep the pot’s context separate from the proposed origin of a person.',
      object: 'met-545772',
    },
    {
      subject: 'shang-ritual',
      year: -1200,
      title: 'A different set of recorded concerns',
      narrative:
        'Explore ritual writing and skilled casting without imposing Anatolia’s chronology on China.',
      object: 'met-42045',
    },
    {
      subject: 'olmec',
      year: -1100,
      title: 'Look beyond the same network',
      narrative:
        'Inspect a small ceramic figure and think about how its scale differs from communal monuments.',
      object: 'met-314609',
    },
    {
      subject: 'lapita',
      year: -1100,
      title: 'Connections across an island world',
      narrative:
        'Ask how dated patterns, settlements and food remains can support different accounts of voyaging.',
    },
  ],
  conclusion:
    'A network can be demonstrated without knowing every route. A political center can change without all its people vanishing. A dated drought can matter without explaining everything. Elsewhere, other communities faced their own histories and choices.',
  evidence: {
    prompt: 'What can the Hittite drought study support?',
    options: [
      {
        text: 'A severe environmental stress occurred near the political transformation; direct causation remains unproved.',
        supported: true,
        feedback:
          'The authors explicitly preserve that distinction. Other political, social and regional evidence still matters.',
      },
      {
        text: 'Exactly the same disaster ended every society in the world in 1200 BCE.',
        supported: false,
        feedback:
          'The evidence is regional, and other societies had different chronologies. A shared date on an atlas creates no shared cause.',
      },
      {
        text: 'Every place at Hattusha was occupied and destroyed simultaneously.',
        supported: false,
        feedback:
          'The archaeological abstract emphasizes changing areas of occupation and warns against treating the combined plan as one moment.',
      },
    ],
    citations: [
      cite('hittite-drought', 'Discussion and causation limit'),
      cite('hattusha-research', 'Abstract'),
    ],
  },
  returnPrompt:
    'Explain one connection we can demonstrate, one proposed cause we must qualify, and one distant history that should not be folded into the same story.',
};
