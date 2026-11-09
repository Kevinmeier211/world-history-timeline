import type { Corpus, Source, Subject, HistoricalContext } from '../../src/atlas/model';
import { cite, sec, interval } from './content-helpers';

const date = '2026-10-27';
const source = (
  id: string,
  title: string,
  institution: string,
  url: string,
  scope: string,
  type: Source['type'] = 'scholarship',
  accessed = date,
): Source => ({ id, title, institution, url, scope, type, accessed });
export const exemplarSources: Source[] = [
  source(
    'rome-severans',
    'The Severan Dynasty (193–235)',
    'The Metropolitan Museum of Art',
    'https://www.metmuseum.org/essays/the-severan-dynasty-193-235',
    'Museum essay consulted: dynastic representation, military patronage and the citizenship grant. A broad grant did not erase differences in wealth, gender or legal condition.',
  ),
  source(
    'rome-educators',
    'Roman Art: A Resource for Educators',
    'The Metropolitan Museum of Art',
    'https://resources.metmuseum.org/resources/metpublications/pdf/Roman_Art_A_Resource_for_Educators.pdf',
    'Search-indexed PDF text consulted, printed pages 130 and 149: occupations, agriculture, legal status and freed people. Direct PDF download returned a verification page; no complete-volume consultation claimed.',
  ),
  source(
    'han-agriculture',
    'Chao Cuo: Memorial on the Encouragement of Agriculture',
    'Asia for Educators, Columbia University',
    'https://afe.easia.columbia.edu/main_pop/ps/ps_china-chaocuo-agriculture.htm',
    'Indexed five-page teaching PDF consulted; introduction and translated memorial, especially pp. 3–5. Translation from Sources of Chinese Tradition (1999), pp. 355–357. A Western Han policy argument dated 178 BCE, not an Eastern Han census. The earlier PDF URL returned 404. On 4 November the university’s full HTML teaching edition was retrieved and read, including the final paragraph of the longer excerpt on grain, rank and pardons. Its edition and page range match the previous consultation.',
    'primary',
    '2026-11-04',
  ),
  source(
    'han-salt',
    'A Record of the Debate on Salt and Iron',
    'Asia for Educators, Columbia University',
    'https://afe.easia.columbia.edu/main_pop/ps/ps_china-debate-salt-iron.htm',
    'Full teaching page consulted: introduction and translated excerpts from Sources of Chinese Tradition (1999), pp. 360–363. Literary record of a court debate in 81 BCE; neither verbatim audio nor a direct account of conditions in 200 CE.',
    'primary',
  ),
  source(
    'angkor-lidar',
    'Uncovering archaeological landscapes at Angkor using lidar',
    'Evans and colleagues · PNAS (2013)',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC3732978/',
    'Full article consulted: abstract, methods, urban landscapes and figures. DOI 10.1073/pnas.1306539110. Lidar reveals ground topography; interpretation and dating require other evidence.',
    'archaeology',
  ),
  source(
    'angkor-network',
    'The demise of Angkor: Systemic vulnerability of urban infrastructure to climatic variations',
    'Penny and colleagues · Science Advances (2018)',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC6192684/',
    'Full article consulted: water distribution network, model, results and discussion; especially Figs. 1–2. DOI 10.1126/sciadv.aau4029. A model of network vulnerability supports a contributing mechanism, not a complete causal explanation. CC BY-NC 4.0.',
    'archaeology',
  ),
  source(
    'angkor-occupation',
    'Temple occupation and the tempo of collapse at Angkor Wat, Cambodia',
    'Carter and colleagues · PNAS (2019)',
    'https://doi.org/10.1073/pnas.1821879116',
    'Publisher-indexed article sections consulted: life history of the temple, timing of change, and occupation of excavated mounds. Findings concern specific excavations; they are not a census of all Angkor.',
    'archaeology',
  ),
  source(
    'angkor-nasa',
    'Angkor Ruins',
    'NASA Earth Observatory',
    'https://science.nasa.gov/earth/earth-observatory/angkor-ruins-4995/',
    '2004 ASTER image and caption consulted for the relative positions of Angkor Wat, Angkor Thom and the barays. A modern observation, not a medieval city plan. Image use follows NASA educational media guidelines with the full supplied credit.',
    'primary',
  ),
  source(
    'partition-oral',
    'Oral Histories',
    'The Partition Museum, Amritsar and Delhi',
    'https://www.partitionmuseum.org/oral-history',
    'Public written summaries consulted for Sunil Chandra Ghosh, Hamida, Ila Banerjee and Ijaz Khan. Full interviews were not independently transcribed or translated; the atlas explicitly uses the museum summaries.',
    'archive',
  ),
  source(
    'partition-map',
    'Punjab boundaries and a Sikh boundary demand, 1947',
    'The National Archives, United Kingdom',
    'https://www.nationalarchives.gov.uk/image/b87fc06c-fab5-4526-a1e9-1909a75bce84/',
    'Teaching image and supplied transcript consulted; CO 1054/76, source 3a. The solid and dashed lines distinguish an awarded border and a demand. The atlas links to the original scan. The National Archives requires Image Library permission for public reproduction.',
    'primary',
  ),
];

const contexts: HistoricalContext[] = [
  {
    id: 'rome-early-empire',
    title: 'Roman imperial rule: Augustus to Diocletian',
    region: 'Europe',
    interval: interval(
      -27,
      284,
      '27 BCE–284 CE · an early imperial frame',
      'This orientation ends with Diocletian’s accession, not the end of Rome. The featured Severan case remains 193–235 CE.',
      'exact',
    ),
    summary:
      'The Severans came after two centuries of imperial government. Changes of ruling family did not create a new society each time; the court, army, provinces and cities continued to interact.',
    subjectIds: ['roman-world'],
    citations: [cite('rome', 'Julio-Claudians; Severans; Diocletian sections')],
    phases: [
      {
        year: -27,
        title: 'Augustus',
        text: 'The Senate grants Octavian the title Augustus. Republican offices continue within a political system dominated by an emperor.',
        citations: [cite('rome', 'The Julio-Claudians')],
      },
      {
        year: 193,
        title: 'A new ruling family',
        text: 'Septimius Severus wins power through civil conflict. This is the start of the focused case, not of the empire.',
        citations: [cite('rome-severans', 'Opening history')],
      },
      {
        year: 212,
        title: 'Citizenship expands',
        text: 'Caracalla extends citizenship broadly among the empire’s free inhabitants. Legal inclusion does not mean equal power.',
        citations: [cite('rome-severans', 'Caracalla and citizenship')],
      },
      {
        year: 235,
        title: 'The Severan dynasty ends',
        text: 'Alexander Severus is killed; Roman imperial government continues through repeated struggles over succession.',
        citations: [cite('rome', 'Soldier-Emperors')],
      },
      {
        year: 284,
        title: 'A different arrangement of power',
        text: 'Diocletian becomes emperor and later reorganizes administration and imperial leadership.',
        citations: [cite('rome', 'Diocletian, Constantine, and the Late Empire')],
      },
    ],
  },
  {
    id: 'han-and-xin',
    title: 'Han, interruption and restoration',
    region: 'East Asia',
    interval: interval(
      -206,
      220,
      '206 BCE–220 CE · Han with the Xin interruption',
      'A conventional broad frame. Han rule was interrupted; the featured Eastern Han period is 25–220 CE.',
      'exact',
    ),
    summary:
      'An imperial tradition can survive a change of capital and a break in dynastic rule. Earlier arguments about farming and government help explain institutions, but must be dated separately from the later tomb models.',
    subjectIds: ['eastern-han'],
    citations: [cite('han', 'Western Han and Eastern Han paragraphs')],
    phases: [
      {
        year: -206,
        title: 'Western Han begins',
        text: 'The museum’s conventional chronology begins in 206 BCE. Chang’an becomes the western capital.',
        citations: [cite('han', 'Opening history')],
      },
      {
        year: -178,
        title: 'Grain and government',
        text: 'Chao Cuo proposes using rewards and rank to encourage grain deliveries to the state.',
        citations: [cite('han-agriculture', 'Introduction; pp. 3–5')],
      },
      {
        year: -81,
        title: 'A disagreement at court',
        text: 'Officials and scholars debate state monopolies and the resources needed for frontier defense.',
        citations: [cite('han-salt', 'Introduction and translated debate')],
      },
      {
        year: 9,
        title: 'The interruption',
        text: 'Wang Mang’s Xin regime interrupts Han rule. The broad frame is not one uninterrupted dynasty.',
        citations: [cite('han', 'Transition between Western and Eastern Han')],
      },
      {
        year: 25,
        title: 'Eastern Han',
        text: 'Restored Han rulers govern from Luoyang. The architectural models belong to this later setting.',
        citations: [
          cite('han', 'Eastern Han opening'),
          cite('met-49519', 'Period and date'),
        ],
      },
      {
        year: 220,
        title: 'Dynastic rule ends',
        text: 'The Han period ends; this boundary does not end Chinese communities, farming or cultural traditions.',
        citations: [cite('han', 'Closing chronology')],
      },
    ],
  },
  {
    id: 'angkor-landscape',
    title: 'A landscape made and remade',
    region: 'Southeast Asia/Oceania',
    interval: interval(
      800,
      1500,
      'Approximately ninth–fifteenth centuries CE',
      'Capital-era orientation only. Angkor Wat’s religious use and local habitation continue beyond this frame.',
    ),
    summary:
      'Reservoirs, temples and settlements accumulated across many reigns. The phase labels below are broad periods, not exact construction dates for every feature.',
    subjectIds: ['angkor'],
    citations: [
      cite('angkor', 'Brief synthesis'),
      cite('angkor-occupation', 'The Life History of the Angkor Wat Temple'),
    ],
    phases: [
      {
        year: 800,
        label: 'Ninth century',
        title: 'Successive centers',
        text: 'Early centers and water works precede the most familiar stone monuments.',
        citations: [cite('angkor-network', 'Angkor’s water distribution network')],
      },
      {
        year: 1050,
        label: 'Eleventh century',
        title: 'West Baray',
        text: 'A major reservoir adds to a landscape already shaped by earlier projects.',
        citations: [cite('angkor-nasa', 'Western Baray paragraph')],
      },
      {
        year: 1125,
        label: 'Early twelfth century',
        title: 'Angkor Wat',
        text: 'The temple associated with Suryavarman II forms part of a wider inhabited landscape.',
        citations: [
          cite('angkor-occupation', 'The Life History of the Angkor Wat Temple'),
        ],
      },
      {
        year: 1200,
        label: 'Late twelfth century',
        title: 'Reorganization',
        text: 'New projects, including the Jayatataka reservoir, modify the network rather than starting it anew.',
        citations: [cite('angkor-network', 'Water distribution network')],
      },
      {
        year: 1400,
        label: 'Fourteenth–fifteenth centuries',
        title: 'Stress and transformation',
        text: 'Climate variability, infrastructure damage and changing political and economic relationships form overlapping explanations.',
        citations: [
          cite('angkor-network', 'Discussion'),
          cite('angkor-occupation', 'Timing and Tempo of Collapse'),
        ],
      },
    ],
  },
  {
    id: 'partition-transition',
    title: 'Partition before and after August 1947',
    region: 'South Asia',
    interval: interval(
      1945,
      1950,
      '1945–1950 · a selected transition and aftermath',
      'A teaching window, not the lifespan of India or Pakistan and not an end date for displacement or memory.',
      'range',
    ),
    summary:
      'Negotiations, violence, independence, boundary announcements and rebuilding home occurred on different timetables. The 1947 case stays dated 1947; this wider frame makes the aftermath visible at 1950.',
    subjectIds: ['partition-1947'],
    citations: [
      cite('partition', 'Background; sources 1–6'),
      cite('partition-oral', 'Ila Banerjee summary'),
    ],
    phases: [
      {
        year: 1945,
        title: 'An official explanation',
        text: 'A British official’s notes explain conflict through “communal” differences and defend British rule. That framing is itself evidence to examine.',
        citations: [cite('partition', 'Source 4: WO 208/755')],
      },
      {
        year: 1946,
        title: 'An appeal before the border',
        text: 'Santokh Singh writes about Sikh concerns in June 1946, before the eventual boundary is known.',
        citations: [cite('partition', 'Source 3b: CAB 127/106')],
      },
      {
        year: 1947,
        label: '3 June 1947',
        title: 'The partition plan',
        text: 'Mountbatten, Nehru and Jinnah announce a transfer to two governments on an accelerated timetable.',
        citations: [cite('partition', 'Background')],
      },
      {
        year: 1947,
        label: '14–17 August 1947',
        title: 'Independence, then the boundary announcement',
        text: 'Independence ceremonies on 14/15 August precede the announcement of the boundary awards on 17 August.',
        citations: [cite('partition', 'Regions affected by partition')],
      },
      {
        year: 1947,
        label: 'September 1947',
        title: 'Movement and violence continue',
        text: 'The High Commissioner reports attacks on refugee groups travelling in both directions in Punjab.',
        citations: [cite('partition', 'Source 1: telegram, 23 September; DO 142/416')],
      },
      {
        year: 1950,
        title: 'A later departure in Bengal',
        text: 'The museum’s account of Ila Banerjee describes her family leaving in 1950. This is one testimony, not a date for all migration from Bengal.',
        citations: [cite('partition-oral', 'Ila Banerjee summary')],
      },
    ],
  },
];

const sections: Record<
  string,
  Pick<
    Subject,
    'summary' | 'sections' | 'deeperReading' | 'familyActivity' | 'evidenceReading'
  >
> = {
  'roman-world': {
    summary:
      'Around 200 CE, Rome’s emperor governed a Mediterranean world through soldiers, officials, cities and unequal social relationships. A gem of Julia Domna shows a ruling family presenting itself; a painted boy from Egypt brings a different life into view. Their contrast opens a larger question: how could an empire connect many communities without making their lives the same?',
    familyActivity: {
      title: 'Two portraits, two kinds of power',
      duration: '5 minutes together',
      steps: [
        'Look at Julia Domna’s gem, then select the portrait of Eutyches below.',
        'Name two things you can see before reading the captions: material, clothing, writing or pose.',
        'After reading, decide which object helps you ask about a ruling family and which about personal remembrance. What would you still need to know?',
      ],
      explanation:
        'Both pictures present identities, but a dynastic gem and a mummy portrait had different settings. Appearance alone cannot establish an owner’s wealth, a viewer’s opinion or the experience of everyone in the empire.',
    },
    sections: [
      sec(
        'A family claiming the right to rule',
        'Septimius Severus came to power in 193 CE after civil conflict. His family’s background reached beyond Italy: he came from Leptis Magna in North Africa, and Julia Domna from Syria. Public monuments and portraits presented the dynasty as legitimate. The beryl gem makes this political language unusually intimate: a face cut into a small valuable material. It identifies a member of the imperial family, but its survival cannot show how widely ordinary people encountered this particular image. Military support and the appearance of dynastic continuity worked together; neither guaranteed an orderly succession.',
        cite('rome-severans', 'Septimius Severus and dynastic representation'),
        cite('met-251870', 'Description; date and material'),
      ),
      sec(
        'Governing beyond the palace',
        'Rome was a center of authority, not a model of every place under its rule. Emperors worked through officials and provincial institutions, while the army could defend a ruler or help replace one. Caracalla’s grant in 212 extended Roman citizenship broadly among free inhabitants. Citizenship was a legal relationship, not a promise of the same income, influence or protection for everyone. The court therefore belongs in a history of empire, but so do the provincial communities through which authority was exercised and contested.',
        cite('rome', 'Julio-Claudians; provincial participation'),
        cite('rome-severans', 'Military officers; Caracalla’s citizenship grant'),
      ),
      sec(
        'The work that supported imperial life',
        'Agriculture sustained towns, armies and households. Landowners drew income from estates; tenants, enslaved people and other workers performed much of the labor. Cities also depended on craftspeople, sellers, builders and service workers. The Met’s educators’ guide distinguishes legal position from economic position: an occupation alone does not tell us whether someone was enslaved, freed or freeborn. That distinction changes how we read splendid objects. A finely made portrait records skilled labor and a purchaser’s choice, while leaving many of the people behind its production unnamed.',
        cite('rome-educators', 'Printed p. 130: Occupations'),
      ),
      sec(
        'One person in Roman Egypt',
        'Eutyches’ portrait belongs to an earlier moment, about 100–150 CE, rather than exactly 200. The museum describes a Greek inscription, Roman clothing and an Egyptian funerary setting. It identifies him as a freedman, although parts of the writing are disputed. These elements can coexist in one person’s commemoration; they need not be sorted into mutually exclusive cultural boxes. Unlike Julia Domna’s image, this portrait was attached to a mummy. Comparing the two asks how identity was presented in different settings, without treating a boy’s burial as a miniature version of imperial propaganda.',
        cite('met-547951', 'Description, inscription and dating'),
      ),
    ],
    deeperReading: [
      sec(
        'What does freedom change?',
        'A freed person had previously been enslaved. Manumission changed legal condition, but it did not automatically confer the social standing of a freeborn aristocrat. Funerary portraits could make family relationships and a newly acquired position visible. Eutyches’ inscription is therefore consequential evidence, yet uncertainty in its reading matters. Use the museum’s interpretation as an interpretation attached to a particular object, not a complete biography. A productive next inquiry would pair several inscriptions with their archaeological settings and legal context.',
        cite('rome-educators', 'Printed p. 149: Freedmen and funerary monuments'),
        cite('met-547951', 'Inscription and disputed reading'),
      ),
      sec(
        'Compare a system, not a stereotype',
        'Rome and Han can be compared through agricultural production, authority and the evidence left by privileged households. The comparison does not require them to have identical laws or offices. Start with a common question—how did rulers obtain resources?—then identify the different evidence available. A Roman portrait does not measure grain revenue; a Han tomb granary does not supply tax accounts. The shared comparison topics are invitations to investigate institutions, rather than a claim that every object answers every question.',
        cite('rome-educators', 'Occupations'),
        cite('han-agriculture', 'Introduction; grain and government'),
        cite('models', 'Han models and estates'),
      ),
      sec(
        'Why the timeline has two dates',
        'The Severan window isolates a family and a political episode. The broader Roman frame begins with Augustus and ends here with Diocletian’s accession as a useful change of phase. Neither the ending of the Severans in 235 nor this frame’s ending in 284 means that Roman life stopped. Eutyches’ earlier portrait is deliberately dated separately as comparative evidence. This lets us connect continuity and change without pretending all the displayed objects were made at once.',
        cite('rome', 'Severans; Diocletian'),
        cite('met-547951', 'Date'),
      ),
    ],
    evidenceReading: {
      title: 'Read the evidence at three scales',
      introduction:
        'These are questions and paraphrases, not quotations from an ancient witness.',
      items: [
        {
          label: 'Object',
          text: 'A small engraved image identifies Julia Domna.',
          interpretation:
            'It can support an inquiry into representation and skilled production. Its presence in a modern collection does not measure its original audience.',
          citations: [cite('met-251870', 'Description')],
        },
        {
          label: 'Inscription',
          text: 'The museum reads Eutyches’ name and status from writing on his portrait; some wording is disputed.',
          interpretation:
            'Distinguish visible marks, a translation and a reconstructed biography. They carry different degrees of certainty.',
          citations: [cite('met-547951', 'Inscription discussion')],
        },
        {
          label: 'Political history',
          text: 'The army and ruling family both mattered to Severan authority.',
          interpretation:
            'This contextual explanation comes from historical scholarship. It is not something the gem proves on its own.',
          citations: [cite('rome-severans', 'Political history')],
        },
      ],
    },
  },
  'eastern-han': {
    summary:
      'A clay tower is an entry into an imperial society sustained by fields, stored grain, households and officials. Eastern Han rulers governed from Luoyang, but the models buried with wealthy people show a different scale of organization: the estate. Read them beside earlier arguments about revenue and farming to see how political power depended on resources—and how differently an owner and a government adviser could describe the same world.',
    familyActivity: {
      title: 'Keep an estate working',
      duration: '5 minutes together',
      steps: [
        'Find the tower, granary and well using the object choices.',
        'For each model, name something a real household would need: food, water, materials, maintenance or labor.',
        'Choose one need that the model makes visible and one person or task it leaves out.',
      ],
      explanation:
        'A tower draws attention to security and status, but an estate also needs food and water. The models are burial provisions, not a full inventory of a working farm or every family’s home.',
    },
    sections: [
      sec(
        'The model is not the building',
        'The glazed tower’s roofs, platforms and openings invite close observation. Yet this is pottery made for a tomb, not a reduced photograph of a house. Its broad museum date spans the first through early third century CE. The funerary setting links the object to hopes for continued provision after death. It may also express the standing of the household that commissioned it. Those two readings can coexist: an object can take part in a religious practice while presenting a desirable social world.',
        cite('met-49519', 'Description; period, date and medium'),
      ),
      sec(
        'An estate is a network of work',
        'Look beyond the tower to the granary and well. Joanne Pillsbury’s account of architectural models connects such objects with agricultural estates and provision for their owners. Storage links one harvest to later meals; a well makes water available; buildings require materials and upkeep. These are relationships we can investigate through the ensemble, rather than assume from a single imposing tower. The burial record is selective. It makes an owner’s wishes especially visible while rarely naming the people whose routine work sustained those comforts.',
        cite('models', 'Han architectural models; agricultural structures'),
        cite('met-52010', 'Granary description'),
        cite('met-52527', 'Well description'),
      ),
      sec(
        'A court needs food as well as obedience',
        'Earlier Han advisers connected rural production with the resources of government. In a memorial dated 178 BCE, Chao Cuo urged the ruler to reward grain deliveries with rank or relief from penalties. His reasoning joined status, stored supplies and frontier needs. This is a policy proposal from Western Han, centuries before many of the featured models. It does not describe the rules on a particular Eastern Han estate. It does reveal a problem that a tomb model cannot answer alone: how could the state persuade or compel resources to move beyond a household?',
        cite('han-agriculture', 'Introduction; translated memorial, pp. 3–5'),
      ),
      sec(
        'Rule could be argued over',
        'A record of the court debate in 81 BCE places two positions side by side. Scholars criticized state monopolies as a pursuit of profit that harmed proper government and farming. The imperial secretary defended revenue as necessary to support frontier protection. Neither position is a neutral account of all livelihoods. Both turn material resources into an argument about legitimate rule. Together they make Han government more intelligible than an image of an emperor simply issuing commands: officials disagreed about means, costs and moral purposes.',
        cite('han-salt', 'Translated positions of the literati and Sang Hongyang'),
      ),
      sec(
        'A later capital in a connected world',
        'Eastern Han rule, conventionally dated 25–220 CE, centered on Luoyang after an earlier western phase and an interruption under Wang Mang. Court histories and museum scholarship place the dynasty within wider diplomatic and trading networks. The clay tower does not establish that its owner travelled those routes. Keep three scales in view: a burial object, the household world it evokes, and the political institutions that shaped resource demands. A change at one scale need not transform all the others immediately.',
        cite('han', 'Western and Eastern Han; Luoyang; diplomacy'),
        cite('met-49519', 'Period'),
      ),
    ],
    deeperReading: [
      sec(
        'Whose judgment about farmers?',
        'Chao Cuo contrasts hard-pressed farmers with prosperous merchants and proposes that state rewards should make grain more valuable. Treat that contrast as persuasion by an official addressing a ruler. It is evidence of what he wanted policy to do, not a representative survey of merchants’ or farmers’ experiences. His argument can guide a new question: who was able to deliver a surplus and obtain the rewards? The memorial by itself cannot establish the answer for every household.',
        cite('han-agriculture', 'Translated memorial, pp. 4–5'),
      ),
      sec(
        'Why use an earlier debate?',
        'The salt and iron discussion predates Eastern Han. It belongs here as an explicitly earlier example of how officials linked revenue, the frontier and moral authority. It should not be used to assert that the same monopoly arrangements continued unchanged in 200 CE. The record is also a composed text transmitted through later editions and a modern translation. To read it well, identify the speaker, the policy defended, the audience and the burdens each side emphasizes.',
        cite('han-salt', 'Introduction and translated debate'),
      ),
      sec(
        'Rome and Han: similar problems, different evidence',
        'Both investigations connect concentrated power to the work of many people. Their surviving objects answer different questions: the Roman portraits foreground a named identity, while the Han building models foreground provision and a desirable household environment. The distinction is about this selection of evidence, not everything either society produced. A fair comparison keeps the questions constant while allowing the answers and uncertainties to differ. Similarity also establishes no direct contact between these particular objects or owners.',
        cite('models', 'Han models'),
        cite('met-251870', 'Julia Domna identification'),
        cite('met-547951', 'Eutyches identification'),
      ),
    ],
    evidenceReading: {
      title: 'Separate object, proposal and debate',
      introduction:
        'The short readings below paraphrase sources; each has its own date and purpose.',
      items: [
        {
          label: 'The tower: Eastern Han',
          text: 'A pottery building was placed in a burial setting.',
          interpretation:
            'Religious provision and household status are useful questions. It is not a government document or a scale survey of a real estate.',
          citations: [cite('met-49519', 'Description')],
        },
        {
          label: 'The memorial: 178 BCE',
          text: 'Chao Cuo proposes rewards for supplying grain.',
          interpretation:
            'An official is recommending an intervention. Ask who could benefit, rather than treating the recommendation as proof that the outcome occurred everywhere.',
          citations: [cite('han-agriculture', 'Introduction; p. 3')],
        },
        {
          label: 'The debate: 81 BCE',
          text: 'Critics emphasize moral government and farming; the official defending monopolies emphasizes the cost of frontier security.',
          interpretation:
            'The disagreement exposes a tradeoff. Neither speaker should be mistaken for the voice of the entire population.',
          citations: [cite('han-salt', 'Translated debate')],
        },
      ],
    },
  },
  angkor: {
    summary:
      'Angkor was a landscape of temples, settlements, fields and water works built and altered over centuries. Stone monuments survive conspicuously; traces of less durable buildings and infrastructure require other ways of looking. Satellite observation, lidar, excavation and network models help us ask how the city worked, why it changed, and why the story cannot end with an empty jungle.',
    familyActivity: {
      title: 'Follow water through a city',
      duration: '5 minutes together',
      steps: [
        'On the satellite image, find a large dark rectangle and smaller square enclosures. Read the caption before deciding what they are.',
        'Use the place map to locate West Baray, Angkor Thom and Angkor Wat.',
        'Imagine that a connecting channel carries too much water. Explain how a problem in one place could affect a place farther away.',
      ],
      explanation:
        'A connected water system can distribute benefits and problems. This is a question about how networks behave, not a demonstration that a single flood ended Angkor.',
    },
    sections: [
      sec(
        'Begin outside the famous temple',
        'Angkor Wat belongs to a much larger settlement landscape. UNESCO includes reservoirs, canals, roads and successive capital plans within its account of the site. The water works mattered alongside ceremonial buildings: they connected places, helped manage seasonal water and supported cultivation. Different rulers added or altered projects. A modern visitor sees remains from many phases together, so the visible landscape must not be mistaken for a single design built in one reign. Our map separates several locations to make those relationships easier to investigate.',
        cite('angkor', 'Brief synthesis; criteria'),
        cite('angkor-network', 'Angkor’s water distribution network'),
      ),
      sec(
        'How a water network works',
        'Reservoirs store water; channels move it; embankments and control points influence where it goes. The 2018 study describes a system serving flood regulation and agriculture, accumulated through repeated construction and modification. Connections matter as much as individual structures. A reservoir cannot supply a place if its connecting channel no longer functions. Maintenance is therefore part of urban history: excavation, clearing and repair are recurring work, not just the exceptional achievement of building a monument. Religious and political importance does not remove these material demands.',
        cite(
          'angkor-network',
          'Angkor’s water distribution network; modeling framework',
        ),
      ),
      sec(
        'Seeing traces beneath vegetation',
        'Many buildings were made of perishable materials, leaving subtler traces than stone temples. The 2013 lidar study used airborne laser scanning to model ground surfaces beneath vegetation. Roads, ponds, occupation mounds and organized layouts became easier to recognize. Lidar does not directly show the people who once lived there or tell us the year of every feature. It changes what can be mapped, then archaeology has to connect those forms to activities and dates. A seemingly isolated temple can become part of a much larger urban pattern.',
        cite(
          'angkor-lidar',
          'Introduction; airborne laser scanning and urban landscapes',
        ),
      ),
      sec(
        'Stress can travel through connections',
        'Penny and colleagues tested a model derived from archaeological mapping. At a branching channel, stronger flow can erode one branch and attract still more water. Another branch receives less, deposits sediment and loses capacity. In the model, sufficiently large disturbances can produce cascading changes elsewhere in the network. This is a possible mechanism linking unusual water flows to infrastructure damage. It does not reproduce every historical decision or establish that water damage alone caused political change. The authors argue for a contributing vulnerability, in combination with climatic variation.',
        cite('angkor-network', 'Fig. 2; model results and discussion'),
      ),
      sec(
        'Transformation did not empty the landscape',
        'The history of particular places complicates a single abandonment date. Excavations around Angkor Wat found changing occupation of its habitation mounds, while inscriptions and modifications attest to the temple’s continuing importance. Political relocation, religious change, trade and climate belong in the discussion together. UNESCO also describes villages and cultivation in the present heritage landscape. The end of a capital phase is not the end of everyone’s relationship with a place. Asking what continued is as important as asking what failed.',
        cite('angkor-occupation', 'Timing and Tempo of Collapse; occupation layers'),
        cite('angkor', 'Living communities and villages'),
      ),
    ],
    deeperReading: [
      sec(
        'A mechanism is not a complete cause',
        'A model is valuable because it makes assumptions explicit enough to test. Here channels become connections in a network, and changing flow alters their capacities through erosion and sedimentation. That abstraction allows researchers to examine how local change might spread. It also leaves out much of social life: who organized repairs, how communities responded, and how political priorities changed. The historical interpretation is strongest when the modeled mechanism is tested against independently dated archaeological and environmental evidence. It is weaker if the model is retold as a witnessed sequence of events.',
        cite('angkor-network', 'Modeling framework; results; discussion'),
      ),
      sec(
        'Four instruments, four questions',
        'The satellite image is a modern view of surface patterns. Lidar models ground elevation and exposes subtle forms beneath vegetation. Excavation investigates deposits and material remains in selected places. A network model tests the behavior of a simplified system. These approaches complement one another precisely because they do different work. Seeing a rectangular reservoir from space does not date its construction; finding an occupation layer does not map every household. Begin with the question, then choose the evidence suited to answering it.',
        cite('angkor-nasa', 'Image acquisition and interpretation'),
        cite('angkor-lidar', 'Methods'),
        cite('angkor-occupation', 'Excavation and radiocarbon sequence'),
        cite('angkor-network', 'Modeling framework'),
      ),
      sec(
        'Do not turn 1431 into an on/off switch',
        'The Angkor Wat study places local changes within a much longer sequence and cautions against treating conventional political chronology as a universal date of abandonment. People could leave one precinct, continue worship at another and alter the use of surrounding mounds. Our broad ninth–fifteenth-century frame organizes a capital-era investigation; it is not a claim that the settlement was created in 800 or emptied in 1500. Continuing communities belong to the history of the place, not only to an epilogue about modern tourism.',
        cite(
          'angkor-occupation',
          'Fifteenth Century Angkor and Beyond; The Life History of the Angkor Wat Temple',
        ),
        cite('angkor', 'Brief synthesis and villages'),
      ),
    ],
    evidenceReading: {
      title: 'Follow a causal claim',
      introduction:
        'An evidence chain should make each step visible. These are explanatory paraphrases of the research.',
      items: [
        {
          label: 'Observation',
          text: 'Archaeological mapping records connected water-management features.',
          interpretation:
            'A mapped connection is evidence about infrastructure. Its exact date and changing use still require investigation.',
          citations: [cite('angkor-network', 'Fig. 1 and network reconstruction')],
        },
        {
          label: 'Test',
          text: 'The model changes flow through a reconstructed network and tracks damage.',
          interpretation:
            'The model tests a mechanism under its assumptions; it does not replay a recorded medieval flood.',
          citations: [cite('angkor-network', 'Fig. 2 and modeling framework')],
        },
        {
          label: 'Interpretation',
          text: 'Network vulnerability could have contributed to Angkor’s transformation.',
          interpretation:
            'The careful claim leaves room for political, economic and religious explanations and for continued occupation.',
          citations: [
            cite('angkor-network', 'Discussion'),
            cite('angkor-occupation', 'Timing and Tempo of Collapse'),
          ],
        },
      ],
    },
  },
  'partition-1947': {
    summary:
      'Independence ended British rule and opened new political futures in 1947. Partition also divided Punjab and Bengal, separated neighbors and placed families in danger. Official plans, an annotated boundary map, a September telegram and later testimony tell different parts of the story. Read them together to understand how a change of sovereignty could coincide with uncertainty about home, safety and belonging.',
    familyActivity: {
      title: 'A border and a home',
      duration: '5 minutes together',
      steps: [
        'Use the linked map or the description on its reference card. The solid line marks the awarded border. The dashed line marks a demand. Which one tells you where the new boundary ran?',
        'Choose a familiar place: a school, a family home or a market. Discuss what a political map would and would not tell someone about it.',
        'Read the short account of mutual help below. Ask what this adds to an official report. Skip descriptions of violence if they are unsuitable for the reader.',
      ],
      explanation:
        'The activity concerns evidence and belonging. It does not ask a child to role-play forced migration or assume what a survivor felt.',
    },
    sections: [
      sec(
        'Several decisions, not one instant',
        'Demands for independence and disagreements about political representation preceded the final division. The National Archives describes an accelerated transfer announced on 3 June 1947 to two governments, India and Pakistan. Independence ceremonies on 14 and 15 August came before the boundary announcement on 17 August. These dates mark different actions. A legal or ceremonial beginning did not ensure that a family knew which side its home would fall on, could travel safely, or could rely on familiar public services.',
        cite('partition', 'Background; regions affected by partition'),
      ),
      sec(
        'Why Punjab and Bengal need separate attention',
        'Partition divided two very different regional settings, far apart on the subcontinent. The linked archival map of Punjab marks the awarded boundary and a Sikh demand with different line styles. It records a political disagreement, not simply a neutral line on empty land. Lahore, Amritsar and other places carried religious, commercial and personal attachments that a boundary could cut across. Bengal should not be treated as a smaller copy of Punjab. Its different local histories and later movements require their own evidence, which the locator map and oral-history examples begin to introduce.',
        cite('partition', 'Source 3a and accompanying explanation'),
        cite('partition-map', 'Map key and transcript'),
        cite('partition-oral', 'Ila Banerjee summary'),
      ),
      sec(
        'What an official report can reveal',
        'On 23 September the UK High Commissioner sent a telegram describing attacks on refugee convoys and columns in Punjab, including groups moving in opposite directions. Its numbered paragraphs organize places, incidents and reported casualties for officials. This format provides time-specific information, but it also reduces people to administrative categories. The report’s title, “Communal disturbances,” deserves examination: does that language explain who organized violence, who failed to protect people, or why a particular group was vulnerable? A document can be useful and incomplete at the same time.',
        cite('partition', 'Source 1: DO 142/416, telegram sent 23 September 1947'),
      ),
      sec(
        'The work of rebuilding a life',
        'The National Archives’ oral testimony from Iqbal Singh’s aunt connects displacement to schooling, money, language and the meaning of home. She recalls having to learn Hindi, the different schools affordable for girls and boys, and her father’s persistent longing for the home left behind. When her family occupied a house left by Mr Ansari, she also imagined his loss. These memories make visible consequences that a boundary map cannot show. They are a later personal account, shaped by recollection, rather than a statistical description of all refugees.',
        cite(
          'partition',
          'Source 6: Learning Hindi; My father and Mr Ansari transcripts',
        ),
      ),
      sec(
        'Neighbors cannot be reduced to categories',
        'The Partition Museum’s written summaries include Sunil Chandra Ghosh remembering help from Hamid Miyan and Hamida remembering shelter provided by a Hindu washerman. These accounts add acts of assistance across religious difference to a history of violence and displacement. They do not cancel the violence or establish how common such help was. They do prevent us from assuming that a religious category determines every individual’s actions. The atlas uses the museum’s published summaries; it does not claim to have verified full interview transcripts.',
        cite('partition-oral', 'Sunil Chandra Ghosh and Hamida summaries'),
      ),
    ],
    deeperReading: [
      sec(
        'Read the map as an argument',
        'The solid and dashed boundaries in CO 1054/76 have different meanings. One records the boundary as fixed in August 1947; the other records a demand running toward the Chenab. A reader who ignores the key could mistake both for official borders at different dates. The map’s Punjab focus is also a limit: it cannot explain the whole subcontinent. Pair it with Santokh Singh’s June 1946 letter about Sikh concerns and ask which attachments a population-based territorial settlement could fail to accommodate. The letter is an appeal to a powerful recipient, not an impartial survey of everyone’s position.',
        cite('partition-map', 'Map key'),
        cite('partition', 'Source 3b: CAB 127/106'),
      ),
      sec(
        'Authority, responsibility and hindsight',
        'Lord Ismay’s personal note admits that danger was anticipated while describing the eventual scale as beyond what authorities expected. Read that statement in light of his position close to Mountbatten. He is explaining a crisis in which he had responsibilities, so his account deserves comparison with other evidence. The National Army Museum adds soldiers’ concerns about family safety and the division of military units. Together, these sources show that the institutions supposed to maintain order were themselves undergoing disruption. They do not make violence inevitable or remove responsibility from actors who organized or permitted it.',
        cite('partition', 'Source 2: DO 121/69'),
        cite('partition-army', 'Law and order; Indian Army divided'),
      ),
      sec(
        'After August: different clocks',
        'The museum’s summary of Ila Banerjee places her family’s departure from East Bengal in 1950. Ijaz Khan’s account describes his father’s later return to Jalandhar and the welcome from former neighbors. These examples complicate any timeline that ends all movement and relationships in August 1947. The selected wider frame runs through 1950 to make an aftermath visible, not to close it. Rebuilding employment, education, possessions and social ties could take far longer; each requires local sources rather than an invented uniform timetable.',
        cite('partition-oral', 'Ila Banerjee and Ijaz Khan summaries'),
        cite('partition', 'Source 6 transcripts'),
      ),
    ],
    evidenceReading: {
      title: 'Read an official document beside a personal account',
      introduction:
        'The two short quotations below come from the National Archives’ published transcripts. The remaining reading is a clearly labelled paraphrase.',
      items: [
        {
          label: 'Telegram heading · 23 September 1947',
          text: '“Communal disturbances.”',
          interpretation:
            'This administrative heading groups events by a category. The numbered entries then report attacks on non-Muslim and Muslim refugees. Ask what the heading emphasizes and what explanation it leaves out.',
          citations: [
            cite(
              'partition',
              'Source 1: DO 142/416, telegram heading and Punjab paragraphs',
            ),
          ],
        },
        {
          label: 'Remembering home · later oral testimony',
          text: '“Mr. Ansari must be missing his home, which became our home.”',
          interpretation:
            'The speaker recognizes that the house her family gained was also a home another family lost. Her memory makes an ethical and personal connection across the border.',
          citations: [
            cite('partition', 'Source 6: My father and Mr Ansari, final sentence'),
          ],
        },
        {
          label: 'A later migration · museum summary, paraphrased',
          text: 'Ila Banerjee’s family left in 1950, after initially remaining in East Bengal.',
          interpretation:
            'One chronology can challenge an overly tidy endpoint. It cannot establish the timing or reasons for every family’s departure.',
          citations: [cite('partition-oral', 'Ila Banerjee summary')],
        },
      ],
    },
  },
};

export function applyExemplars(corpus: Corpus) {
  for (const row of exemplarSources)
    if (!corpus.sources.some((s) => s.id === row.id)) corpus.sources.push(row);
  corpus.contexts = contexts;
  const archive = corpus.sources.find((s) => s.id === 'partition')!;
  archive.accessed = date;
  archive.scope =
    'Full teaching page and published transcripts consulted on 27 October 2026: sources 1–6, background and dates. British official records are read alongside later personal testimony. Transcript text available under OGL v3.0; public reproduction of the archive images requires separate permission from its Image Library. The atlas displays original reference cards. Earlier direct-access 403 limitation is superseded for this consultation.';
  for (const [id, content] of Object.entries(sections)) {
    const s = corpus.subjects.find((s) => s.id === id)!;
    Object.assign(s, content);
    s.contextIds = contexts.filter((c) => c.subjectIds.includes(id)).map((c) => c.id);
    s.review = {
      consultedOn: date,
      reviewer: 'Codex source consultation and self-review',
      scope:
        'Expanded explanation, chronology, evidence reading and comparison checked against the cited institutional and scholarly material.',
      limitations: [
        'Independent historian review and family testing remain open.',
        ...(id === 'partition-1947'
          ? [
              'Full survivor interviews were not transcribed; museum summaries are identified as such.',
              'Archive images are local educational copies; public image reproduction clearance remains open.',
            ]
          : []),
        ...(id === 'angkor'
          ? [
              'The water-network model is a contributing explanation, not proof of a single cause.',
            ]
          : []),
        ...(id === 'eastern-han'
          ? [
              'Earlier Western Han texts provide explicit historical context, not direct evidence for every Eastern Han practice.',
            ]
          : []),
      ],
    };
    s.claims.push({
      id: `${id}-expanded-reading`,
      text:
        id === 'partition-1947'
          ? 'The September telegram and later personal testimony address different scales of the aftermath.'
          : id === 'angkor'
            ? 'Water-network modeling and evidence of continuing occupation support a history of transformation rather than universal abandonment.'
            : id === 'eastern-han'
              ? 'The Western Han policy texts predate the Eastern Han tomb models and are dated separately.'
              : 'The Severan political period and the dates of individual portraits are distinct from the wider Roman imperial frame.',
      citations: content.sections.flatMap((s) => s.citations).slice(-3),
      status: 'published',
      checkedBy:
        'Codex source consultation and self-review; not independent historian approval',
      checkedOn: date,
    });
  }
  const rome = corpus.subjects.find((s) => s.id === 'roman-world')!;
  const han = corpus.subjects.find((s) => s.id === 'eastern-han')!;
  rome.dimensions = {
    authority: {
      text: 'An emperor relied on military support, officials and provincial institutions. Dynastic images asserted legitimacy; they did not replace the practical work of governing.',
      citations: [cite('rome-severans', 'Political history')],
    },
    production: {
      text: 'Agriculture supported urban and imperial life. Legal status and economic position were distinct; portraits do not measure the resources drawn from workers.',
      citations: [cite('rome-educators', 'Printed p. 130: Occupations')],
    },
    belief: {
      text: 'The Egyptian mummy portrait joins personal identity to funerary practice. Its context differs from an imperial gem.',
      citations: [cite('met-547951', 'Funerary context')],
    },
    evidence: {
      text: 'Named portraits, an inscription and historical scholarship answer different questions. Eutyches’ portrait predates the Severan case.',
      citations: [
        cite('met-547951', 'Date and inscription'),
        cite('met-251870', 'Description'),
      ],
    },
  };
  han.dimensions = {
    ...han.dimensions,
    authority: {
      text: 'Earlier Han court arguments connect government with grain, state revenue and frontier demands. These dated texts illuminate institutions without proving unchanged practice in Eastern Han.',
      citations: [
        cite('han-agriculture', 'Introduction'),
        cite('han-salt', 'Introduction'),
      ],
    },
    evidence: {
      text: 'Tomb models show selective provision for an afterlife. Earlier memorials and debates show proposals and disputes; neither source type is a census of households.',
      citations: [
        cite('models', 'Han models'),
        cite('han-agriculture', 'Introduction'),
      ],
    },
  };
  const partition = corpus.subjects.find((s) => s.id === 'partition-1947')!;
  partition.interval.label = 'Independence and partition, August 1947';
}
