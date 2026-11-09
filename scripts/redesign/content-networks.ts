import { dossier } from './editorial';
import { cite, metEssay } from './content-helpers';
import type { Source, Journey, Pack } from '../../src/atlas/model';
export const networkSources: Source[] = [
  {
    id: 'sahel',
    title: 'Sahel: Art and Empires on the Shores of the Sahara—Inside the Exhibition',
    institution: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/exhibitions/sahel-art-empire-sahara/inside-the-exhibition',
    type: 'scholarship',
    accessed: '2026-10-26',
    scope:
      'Sahelian narratives, oral history, mud construction, Mali frame and 1324 pilgrimage; contradictory forms of evidence remain visible. Large quantities and universal claims not adopted.',
  },
  {
    id: 'sahel-visual',
    title: 'Visualizing a Sahelian Past',
    institution: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/perspectives/visualizing-a-sahelian-past',
    type: 'scholarship',
    accessed: '2026-10-26',
    scope:
      'Mansa Musa’s European image and McIntosh’s interpretation of Middle Niger urbanism without centralized state hierarchy.',
  },
  {
    id: 'angkor',
    title: 'Angkor',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/668/',
    type: 'archaeology',
    accessed: '2026-10-26',
    scope:
      'Successive ninth–fifteenth-century capitals, hydraulic infrastructure and living communities; no single-cause collapse account adopted.',
  },
  metEssay(
    'song',
    'Northern Song Dynasty (960–1127)',
    'northern-song-dynasty-960-1127',
    'Court painting, scholars and interpretation of landscape; aesthetic rankings not adopted.',
    'Department of Asian Art',
    '2001-10',
  ),
  {
    id: 'song-phases',
    title: 'China, 1000–1400 CE',
    institution: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/zh/toah/ht/07/eac',
    type: 'scholarship',
    accessed: '2026-10-26',
    scope:
      'Northern/Southern Song and simultaneous Liao/Jin/Yuan frames; no implication of a uniform state across all territory.',
  },
  {
    id: 'nz-settlement',
    title: 'When was New Zealand first settled?',
    author: 'Geoff Irwin and Carl Walrond',
    institution: 'Te Ara, Ministry for Culture and Heritage, New Zealand',
    url: 'https://teara.govt.nz/en/when-was-new-zealand-first-settled',
    type: 'scholarship',
    accessed: '2026-10-26',
    scope:
      'Summary: c1250–1300 arrival estimate and revised early rat-bone dates. Older claims about other Pacific regions are not adopted.',
  },
  {
    id: 'navigation',
    title: 'Canoe navigation',
    author: 'Rāwiri Taonui',
    institution: 'Te Ara, Ministry for Culture and Heritage, New Zealand',
    url: 'https://teara.govt.nz/en/canoe-navigation/print',
    type: 'scholarship',
    accessed: '2026-10-26',
    scope:
      'Ocean voyaging, navigation by stars and swells, learning and route memory; no exact reconstructed medieval track.',
  },
];
export const networkSubjects = [
  dossier({
    id: 'mali-networks',
    name: 'Mali: pilgrimage, trade and historical voices',
    aliases: ['Mansa Musa', 'Sunjata', 'Sundiata'],
    kind: 'period',
    region: 'Africa',
    place: 'Western Sahel; locator at Timbuktu, Mali',
    coordinates: [-3.0, 16.77],
    geo: 'Regional orientation at a scholarly/trade center, not a certain imperial capital or border.',
    dates: [
      1230,
      1600,
      'Mali political frame, c.1230–1600 CE',
      'Broad exhibition convention; political influence and local autonomy changed. This is not an exact founding or extinction date.',
    ],
    packs: ['C6', 'C7'],
    question:
      'How do oral history, foreign images and material evidence change one another?',
    summary:
      'Mali’s history belongs to a wider Sahelian landscape of farming, skilled work, trade and religious life. Sunjata’s epic and accounts of Mansa Musa preserve different kinds of historical memory. A ruler pictured with gold in a European map is also evidence about the mapmaker’s expectations.',
    sections: [
      [
        'Many ways to preserve a past',
        'The exhibition puts archaeology, oral poetry, writing and art beside one another, acknowledging that they can conflict. Jeliw preserve and reshape living narratives, including the Sunjata epic. A performance is neither a neutral transcript of a thirteenth-century event nor a reason to dismiss oral knowledge.',
        'sahel',
        'Sahelian Narratives; Epics',
      ],
      [
        'A journey with wider consequences',
        'Mansa Musa’s pilgrimage through Cairo in 1324 connected Mali to wider Islamic networks. The account links his return with Timbuktu’s scholarship. This atlas avoids unsupported estimates of his modern net worth or a precise count of people and gold on the journey.',
        'sahel',
        'Trade and Islam: Mansa Musa',
      ],
      [
        'Who drew the ruler?',
        'The Met’s visual-history essay argues that Majorcan images translate Musa into European royal symbols. His crown, throne and gold tell us something about foreign perceptions. Those images should be compared with Sahelian material traditions rather than treated as direct portraits from his court.',
        'sahel-visual',
        'Malian Emperor Mansa Musa',
      ],
    ],
    fact: [
      'The exhibition dates the pilgrimage via Cairo to 1324; European royal imagery expresses a foreign viewpoint.',
      'sahel',
      'Trade and Islam',
    ],
    terms: ['archive', 'caravan', 'empire'],
    dimensions: [
      [
        'Authority and participation',
        'A political frame contains local autonomy and differing kinds of governance; it is not equivalent to every Sahelian community.',
        'sahel',
        'Sahelian Narratives',
      ],
      [
        'Surviving evidence',
        'Oral poetry, texts, material remains and foreign images can disagree productively.',
        'sahel',
        'Narratives and Epics',
      ],
    ],
    prompt:
      'How would you compare a story told in a community with an image made by an outsider?',
  }),
  dossier({
    id: 'middle-niger',
    name: 'Middle Niger: a figure without a known biography',
    aliases: ['Jenne-jeno', 'Djenné-Djenno'],
    kind: 'object',
    region: 'Africa',
    place: 'Inland Niger Delta, present-day Mali',
    coordinates: [-4.55, 13.9],
    geo: 'Broad regional/city orientation. No controlled excavation of this specimen is established in the released record.',
    dates: [
      1200,
      1300,
      'Thirteenth century CE',
      'Object catalogue date; not the foundation or abandonment of the city or the lifespan of its people.',
    ],
    packs: ['C6'],
    question: 'Can urban life be studied without assuming a centralized state?',
    summary:
      'A terracotta figure curls around a raised knee. Its skilled modeling offers an immediate material encounter while its original purpose remains uncertain. Middle Niger urbanism invites questions about communities and authority that cannot be answered by assigning every city a king.',
    sections: [
      [
        'Looking before naming',
        'The figure’s bent posture and raised markings are visible. Anxiety, prayer, scarification and illness are interpretations, not observations of a named person’s life. The catalogue acknowledges that controlled archaeology provides only limited knowledge of such works’ original meanings.',
        'met-314362',
        'Description and interpretive limits',
      ],
      [
        'Cities beyond one model',
        'The Met’s Sahel essay summarizes McIntosh’s argument that Middle Niger settlement traces lack evidence of centralized state hierarchy. This is an archaeological interpretation of organization; it does not mean there were no rules, inequalities or forms of leadership.',
        'sahel-visual',
        'McIntosh and Middle Niger urbanism',
      ],
      [
        'Keep uncertainties separate',
        'The object is dated to the thirteenth century. Published institutional accounts give conflicting broad endings for Jenne-jeno; neither date is used as this figure’s production date or a population’s disappearance. The regional attribution is useful while the precise original setting remains unresolved.',
        'met-314362',
        'Date, geography and limited contextual evidence',
      ],
    ],
    fact: [
      'The catalogue dates the figure to the thirteenth century and acknowledges uncertainty about original significance.',
      'met-314362',
      'Date and description',
    ],
    objects: ['met-314362'],
    terms: ['inference', 'provenance'],
    dimensions: [
      [
        'Authority and participation',
        'Middle Niger archaeology has been interpreted without assuming centralized state hierarchy.',
        'sahel-visual',
        'McIntosh discussion',
      ],
      [
        'Surviving evidence',
        'The object’s date is more securely specified than its original use or a named sitter.',
        'met-314362',
        'Description and Date',
      ],
    ],
    prompt:
      'Which visible detail can you describe without deciding what the person is thinking?',
  }),
  dossier({
    id: 'angkor',
    name: 'Angkor: water, temples and a living landscape',
    aliases: ['Khmer', 'Angkor Wat', 'Bayon'],
    kind: 'place',
    region: 'Southeast Asia/Oceania',
    place: 'Siem Reap region, Cambodia',
    coordinates: [103.86, 13.43],
    geo: 'Angkor Wat orientation within a wider group of capitals and settlements; no empire outline.',
    dates: [
      800,
      1500,
      'Successive capital landscapes, ninth–fifteenth centuries CE',
      'Broad archaeological frame, not one city plan, one reign or an exact date of universal abandonment.',
    ],
    packs: ['C5', 'C6'],
    question: 'What is missing when a city is pictured as only a temple?',
    summary:
      'Angkor joins monuments with reservoirs, canals, roads and successive urban plans. It also remains a landscape inhabited and cultivated by communities. A history centered only on famous stone temples misses the systems and work that connected them to daily life.',
    sections: [
      [
        'A connected built environment',
        'UNESCO describes hydraulic structures, communication routes and different capital plans alongside temples. Reservoirs and canals belong in the same investigation as monumental architecture. The combined site is evidence of successive projects, not a plan completed in one moment.',
        'angkor',
        'Brief synthesis',
      ],
      [
        'Power and symbolic space',
        'The architecture and layout register social ranking and religious values. Particular temples belong to different settings and phases. A common label such as “Angkor” should not flatten those differences or imply that each building served the same ritual purpose.',
        'angkor',
        'Brief synthesis and criteria',
      ],
      [
        'A living place',
        'The heritage account describes villages and rice cultivation within the park. The end of a capital phase did not make the landscape empty. Nor can the atlas infer a single cause of political transformation from the mere presence of water infrastructure.',
        'angkor',
        'Inhabited park paragraph',
      ],
    ],
    fact: [
      'Angkor includes successive urban plans and water infrastructure, and is a living inhabited landscape.',
      'angkor',
      'Brief synthesis and villages paragraph',
    ],
    terms: ['irrigation', 'archaeology'],
    dimensions: [
      [
        'Work and production',
        'Water management, communication and farming contextualize the monumental core.',
        'angkor',
        'Brief synthesis',
      ],
      [
        'Surviving evidence',
        'Successive plans should not be mistaken for one simultaneous city.',
        'angkor',
        'Successive capitals',
      ],
    ],
    prompt:
      'What evidence would you seek about the people who maintained canals and grew food?',
  }),
  dossier({
    id: 'song-art',
    name: 'Song worlds: a bowl and competing ideals',
    aliases: ['Northern Song', 'Southern Song', 'Kaifeng'],
    kind: 'period',
    region: 'East Asia',
    place: 'China; Northern capital at Kaifeng, later southern court',
    coordinates: [114.31, 34.8],
    geo: 'Kaifeng locator for the northern phase; the bowl’s Jian ware attribution is a different place of production.',
    dates: [
      960,
      1279,
      'Song dynastic frame, 960–1279 CE',
      'Northern Song 960–1127; Southern Song1127–1279. Simultaneous Liao and Jin states are distinct, not erased by this frame.',
    ],
    packs: ['C5', 'C6'],
    question: 'Can objects and paintings embody competing views of an ordered world?',
    summary:
      'Song court and scholar artists developed different purposes for painting. A small glazed bowl gives another scale of making and use. Neither an imperial ideal nor one surviving vessel represents every experience within this changing political landscape.',
    sections: [
      [
        'A phase is not the whole',
        'The northern court was based at Bianliang, modern Kaifeng. The chronological account distinguishes Northern and Southern Song and contemporary Liao and Jin rule. One large dynasty label should not imply uniform control of all the regions shown on a modern map.',
        'song-phases',
        'Timeline and Overview',
      ],
      [
        'Different purposes for images',
        'The Met essay describes court landscapes as images of ordered government, while scholar-artists also pursued personal expression and criticized court styles. Art was part of intellectual and political life, not a single timeless national aesthetic.',
        'song',
        'Court painting and scholar-artists',
      ],
      [
        'A bowl at hand',
        'The selected Jian ware tea bowl dates to the eleventh–twelfth centuries. Its streaked glaze gives the surface its “hare’s-fur” description. Its material and date are documented; the catalogue does not name a particular drinker or establish an exact journey to its modern collection.',
        'met-42455',
        'Date, medium and collection details',
      ],
    ],
    fact: [
      'The selected tea bowl is eleventh–twelfth-century Jian ware, separate from the full Song dynastic frame.',
      'met-42455',
      'Date and medium',
    ],
    objects: ['met-42455'],
    terms: ['dynasty', 'patronage'],
    dimensions: [
      [
        'Work and production',
        'A glazed stoneware vessel and commissioned paintings belong to different forms of skilled making.',
        'met-42455',
        'Medium',
      ],
      [
        'Authority and participation',
        'Court artists and scholar-artists could give painting different social purposes.',
        'song',
        'Court and literati discussion',
      ],
    ],
    prompt:
      'What does a style label explain, and what questions does it leave unanswered?',
  }),
  dossier({
    id: 'inca-weaving',
    name: 'Inca weaving: skill across highlands and coast',
    aliases: ['Inka', 'Uncu', 'Quechua'],
    kind: 'object',
    region: 'Americas',
    place: 'Peru; highland technique and coastal comparisons',
    coordinates: [-75.5, -12.8],
    geo: 'Broad Peruvian regional locator; no precise findspot or full itinerary is asserted.',
    dates: [
      1450,
      1550,
      'Tunic catalogue range, 1450–1550 CE',
      'A broad object range crossing the C6/C7 boundary and Spanish conquest; not the lifespan of the Inca state.',
    ],
    packs: ['C6', 'C7'],
    question: 'How can the way cloth is made reveal connections?',
    summary:
      'A tunic woven from camelid hair combines different structures and jagged patterns. The museum’s interpretation relates its technical features to highland production and its style to coastal finds. The cloth makes skilled work central to a history often told mainly through rulers and conquest.',
    sections: [
      [
        'Look at construction',
        'The tunic joins two loom pieces and combines different weaving structures. The catalogue interprets the jagged patterns as worked with a needle. Such details are evidence of making; a frontal image alone can hide the sequence of tasks required.',
        'met-313152',
        'Construction discussion',
      ],
      [
        'A regional argument',
        'The museum notes comparable tunics on Peru’s central coast and interprets this work’s technical features and camelid fiber as highland characteristics. These comparisons support a regional connection. They do not supply a named weaver or a documented route for this individual object.',
        'met-313152',
        'Geographic and technical comparison',
      ],
      [
        'Keep a crossing date range',
        'The catalogue range extends from 1450 to 1550. The timeline clips its display in each chapter while retaining both historical bounds. It cannot be assigned confidently to one side of conquest merely to fit a chapter’s visual organization.',
        'met-313152',
        'Date field',
      ],
    ],
    fact: [
      'The museum gives a 1450–1550 object range and interprets highland technique alongside coastal comparisons.',
      'met-313152',
      'Date and description',
    ],
    objects: ['met-313152'],
    terms: ['material culture', 'inference'],
    dimensions: [
      [
        'Work and production',
        'Combined textile structures and camelid fiber preserve evidence of skilled making.',
        'met-313152',
        'Medium and construction',
      ],
      [
        'Surviving evidence',
        'A regional comparison is more secure than a precise itinerary or named maker.',
        'met-313152',
        'Description and geography',
      ],
    ],
    prompt: 'What does a piece of clothing reveal that a list of rulers might miss?',
  }),
  dossier({
    id: 'polynesian-voyaging',
    name: 'Voyaging to Aotearoa: knowledge at sea',
    aliases: ['Māori', 'New Zealand', 'Waka'],
    kind: 'process',
    region: 'Southeast Asia/Oceania',
    place: 'East Polynesia and Aotearoa New Zealand',
    coordinates: [174.2, -41.0],
    geo: 'Destination-region locator; no exact reconstructed canoe track.',
    dates: [
      1250,
      1300,
      'Settlement estimate, c.1250–1300 CE',
      'Te Ara synthesis of arrival/settlement evidence. Not an exact first landfall or the beginning/end of Māori identity.',
    ],
    packs: ['C6'],
    question: 'How can practiced knowledge leave evidence without a stone monument?',
    summary:
      'Polynesian voyagers reached Aotearoa using developed seafaring knowledge. Archaeological dating and oral traditions address overlapping but different questions. Stars, swells and remembered directions show why absence of a written chart is not absence of sophisticated navigation.',
    sections: [
      [
        'Dating arrival',
        'Te Ara summarizes evidence for arrival around 1250–1300 CE. Earlier rat-bone dates were reassessed. The estimate concerns settlement evidence, not the full ancestral history carried in whakapapa or a securely dated single canoe landing.',
        'nz-settlement',
        'Story summary and rat-bone debate',
      ],
      [
        'Learning to read the sea',
        'Taonui describes routes preserved in memory and song, stars used for direction, and swells and winds used when skies were obscured. This is practiced, taught knowledge. These methods do not justify drawing one exact medieval route without supporting evidence.',
        'navigation',
        'Ocean voyaging and Navigation at sea',
      ],
      [
        'Different evidence, different questions',
        'Material traces can help date occupation; traditions preserve relationships, names and meanings that excavation alone cannot recover. A rigorous account can compare them without reducing every narrative to an exact modern calendar year or treating knowledge as real only when written.',
        'nz-settlement',
        'Full story: genealogical and archaeological dating',
      ],
    ],
    fact: [
      'Te Ara dates Polynesian settlement of Aotearoa to about 1250–1300 CE. Navigators learned to steer by stars and ocean swells.',
      'nz-settlement',
      'Story summary, first settlement and revised dating',
    ],
    supportingFactCitations: [
      cite('navigation', 'Ocean voyaging, Navigation at sea: stars and swells'),
    ],
    factCheckedOn: '2026-11-04',
    terms: ['evidence', 'chronology'],
    dimensions: [
      [
        'Work and production',
        'Canoe voyaging required construction, provisioning, memorized directions and practiced environmental reading.',
        'navigation',
        'Preparing to sail and Navigation at sea',
      ],
      [
        'Surviving evidence',
        'Archaeological settlement dates and ancestral traditions do not answer identical questions.',
        'nz-settlement',
        'Full story dating methods',
      ],
    ],
    prompt:
      'What knowledge in your own community is learned through practice rather than a written manual?',
  }),
];
export const networkJourney: Journey = {
  id: 'knowledge-networks',
  title: 'Cities, craft and knowledge in motion',
  question: 'What kinds of connection can we demonstrate?',
  duration: '30–45 minutes',
  introduction:
    'Investigate a pilgrimage, a modeled figure, water infrastructure, art, cloth and ocean knowledge. Keep different evidence for connection distinct.',
  stops: [
    {
      subject: 'mali-networks',
      year: 1324,
      title: 'A journey beyond a wealth story',
      narrative: 'Compare oral history, foreign imagery and material evidence.',
    },
    {
      subject: 'middle-niger',
      year: 1250,
      title: 'A city need not fit one political model',
      narrative: 'Inspect the figure’s posture before naming an emotion or a ruler.',
      object: 'met-314362',
    },
    {
      subject: 'angkor',
      year: 1200,
      title: 'Build beyond the temple',
      narrative: 'Put water, roads and farming into the urban landscape.',
    },
    {
      subject: 'song-art',
      year: 1100,
      title: 'Ideas can compete within one label',
      narrative: 'Explore court and scholarly purposes beside a glazed bowl.',
      object: 'met-42455',
    },
    {
      subject: 'inca-weaving',
      year: 1475,
      title: 'Read technique as evidence',
      narrative:
        'Compare a regional production argument with the uncertainty of an object’s precise itinerary.',
      object: 'met-313152',
    },
    {
      subject: 'polynesian-voyaging',
      year: 1280,
      title: 'Learn a route through practice',
      narrative: 'Separate settlement dating from the broader history of knowledge.',
    },
  ],
  conclusion:
    'Journeys, techniques, memories and infrastructures connect communities in different ways. Each needs its own evidence. A line on a map can summarize a supported connection; it cannot create one.',
  evidence: {
    prompt: 'Which connection is described at the right level of certainty?',
    options: [
      {
        text: 'The tunic’s technical features support regional comparison, while its exact individual route remains unknown.',
        supported: true,
        feedback:
          'The catalogue makes a technical and regional argument. It does not provide a complete object itinerary.',
      },
      {
        text: 'One long date range proves an object was made both before and after a conquest.',
        supported: false,
        feedback:
          'A date range expresses uncertainty about when it was made, not repeated production of the same object.',
      },
      {
        text: 'A navigation tradition requires a surviving written map to count as knowledge.',
        supported: false,
        feedback:
          'Taonui describes memorized and practiced ways of reading stars, swells and landmarks.',
      },
    ],
    citations: [
      cite('met-313152', 'Description'),
      cite('navigation', 'Ocean voyaging'),
    ],
  },
  returnPrompt:
    'Explain one demonstrated connection and one connection that remains a question.',
};
export const networkPack: Pack = {
  id: 'C6',
  title: 'Cities, craft and knowledge in motion',
  start: 1000,
  end: 1500,
  anchor: 1250,
  question: 'How were cities, trade, knowledge, power and everyday life connected?',
  orientation:
    'Skilled work and learned practices connect the histories of monuments, political institutions and daily life. Move between cities and voyages while asking which connections are demonstrated and which remain hypotheses.',
  journey: 'knowledge-networks',
  comparison: ['middle-niger', 'angkor'],
  geography:
    'The Sahel, Cambodia, China, the Andes and the Pacific receive new investigations. Byzantine and Abbasid institutions and Nalanda carry earlier histories into this window.',
  limits:
    'Coverage of European cities outside Byzantium, Central Asian pastoral communities and many Indian Ocean ports is limited. Comparison does not imply direct contact among all selected cases.',
  coverage: {
    Americas: {
      status: 'researched',
      reason:
        'Andean textile technique and regional comparison; North America remains limited.',
      subjects: ['inca-weaving'],
    },
    Africa: {
      status: 'researched',
      reason:
        'Mali networks and Middle Niger urbanism, including noncentralized interpretations.',
      subjects: ['mali-networks', 'middle-niger'],
    },
    Europe: {
      status: 'limited',
      reason:
        'Byzantium’s changing institutions and 1204/1261 phases; other European regions need fuller dossiers.',
      subjects: ['byzantium'],
    },
    'West/Central Asia': {
      status: 'limited',
      reason:
        'Abbasid continuation and contracted authority; no comprehensive Mongol or pastoral history.',
      subjects: ['abbasid-craft'],
    },
    'South Asia': {
      status: 'researched',
      reason: 'Nalanda’s later institutional phases and archaeology.',
      subjects: ['nalanda'],
    },
    'East Asia': {
      status: 'researched',
      reason: 'Song political phases, artistic ideas and ceramic work.',
      subjects: ['song-art'],
    },
    'Southeast Asia/Oceania': {
      status: 'researched',
      reason:
        'Angkor infrastructure and Polynesian settlement/navigation provide distinct state and non-state inquiries.',
      subjects: ['angkor', 'polynesian-voyaging'],
    },
  },
};
