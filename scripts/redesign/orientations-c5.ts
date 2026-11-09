import { addSourceConsultation } from './content-helpers';
import type {
  Corpus,
  RegionalOrientation,
  Section,
  Region,
} from '../../src/atlas/model';
const ref = (source: string, locator: string) => ({ source, locator });
const s = (
  title: string,
  text: string,
  ...citations: Section['citations']
): Section => ({ title, text, citations });
function reading(
  n: number,
  region: Region,
  title: string,
  question: string,
  sections: Section[],
  scope: string,
  perspectives: string,
  contextIds: string[],
  subjectIds: string[],
  prompt: string,
  response: string,
  snapshot: Section,
): RegionalOrientation {
  const id = `C5-R${n}`;
  return {
    id,
    chapter: 'C5',
    region,
    title,
    question,
    summary: sections[0]!,
    sections: sections.slice(1),
    scope,
    perspectives,
    contextIds,
    subjectIds,
    activity: { prompt, response },
    snapshots: [
      {
        orientation: id,
        region,
        year: 850,
        text: snapshot.text,
        citations: snapshot.citations,
      },
    ],
  };
}
export const c5Orientations = [
  reading(
    1,
    'Americas',
    'Maya households and the beginnings of Chaco great houses',
    'How can we compare work without making different communities contemporary by assumption?',
    [
      s(
        'Courtly containers and village provision',
        'The selected Maya cup connects a named owner with food and imagery. Excavated Cerén households offer a different view: food production, part-time specialties and exchange. These settings bring makers and household provision into a history otherwise easily dominated by courtly objects.',
        ref('met-316711', 'Description: ownership and imagery'),
        ref(
          'maya-ceren-households-2000',
          'Publisher abstract: provisioning and specialties',
        ),
      ),
      s(
        'Building over generations',
        'Farther north, Pueblo Bonito was constructed in stages from about 850 to 1150 CE. Its rooms and masonry are the accumulated results of work over generations. A photograph of the whole structure therefore cannot show what stood at the beginning of construction.',
        ref('chaco-bonito', 'Construction paragraph: 850–1150 CE'),
      ),
      s(
        'Objects and buildings keep different clocks',
        'The Maya cup’s seventh–eighth-century catalogue date precedes the 850 CE snapshot. The Chaco cacao study’s sampled vessels are later, around 1000–1125. Comparing their evidence is useful, but neither supplies a documented cacao-drinking event at Chaco in 850 or a route taken by this Maya vessel.',
        ref('met-316711', 'Date'),
        ref('chaco-cacao', 'Sample selection and stylistic dates'),
      ),
    ],
    'A comparison of Maya court/village evidence and an Ancestral Puebloan building sequence. Neither is a summary of all American communities; the objects and deposits do not share one date.',
    'Courtly writing names an owner. Household archaeology and building remains reveal other tasks, while often leaving individual workers unnamed.',
    ['maya-courts-households-context', 'chaco-community-work-context'],
    ['maya-vessel', 'chaco-communities'],
    'Could a photograph of completed Pueblo Bonito illustrate the site as it looked in 850 CE?',
    'Use it to introduce the conserved site, with a clear caption. Reconstructing 850 requires evidence for the earliest building phases; the complete later footprint cannot be backdated.',
    s(
      '850 CE',
      'Around 850 CE marks the approximate beginning of Pueblo Bonito’s staged construction, not completion of the great house. The selected Maya cup is earlier; the sampled Chaco cacao vessels are later. Their comparison does not establish an exchange between those particular objects or communities in this year.',
      ref('chaco-bonito', 'Construction paragraph'),
      ref('met-316711', 'Date'),
      ref('chaco-cacao', 'Sample dates'),
    ),
  ),
  reading(
    2,
    'Africa',
    'Middle Niger towns and earlier Aksumite work',
    'Must a town begin with a palace or a foreign trading expedition?',
    [
      s(
        'Djenné-Djeno and its neighbours',
        'Excavations and settlement survey place Djenné-Djeno’s growth within the first millennium CE, with a high point around 750–1100. Nearby settlements were part of this urban landscape. This history precedes the Mali Empire explored in the linked dossier; the later royal map cannot explain the origins of these towns.',
        ref('middle-niger-urbanism-1981', 'Extract: growth and hinterland survey'),
        ref('orientation-djenne-urbanism', 'Summary: varied urban forms'),
      ),
      s(
        'Food and materials connected settlements',
        'The excavation report considers rice, fish and other local products alongside imported stone and iron. Urban exchange depended on supplies from a wider landscape, not only conspicuous imported luxuries. Its account challenges the idea that Middle Niger towns arose solely as an effect of later trans-Saharan trade.',
        ref(
          'middle-niger-urbanism-1981',
          'Extract: staples, imported materials and interpretation',
        ),
      ),
      s(
        'An earlier eastern comparison',
        'Beta Samati in the Aksumite highlands preserves food preparation and small-scale production in separately dated deposits. This provides an earlier comparison for urban work, not a second African town established as occupied in 850 by those deposits. The two regions should not be forced into one sequence of rise and decline.',
        ref('beta-samati', 'Area A; chronology and Discussion'),
      ),
      s(
        'Different town, different surviving fabric',
        'The UNESCO property includes Djenné-Djeno and other archaeological sites alongside the fabric of present Djenné. Later Islamic architecture must remain separate from the earlier settlement evidence. Buildings visible today are not automatically a picture of the ninth century.',
        ref(
          'orientation-djenne-heritage',
          'Brief synthesis: component sites and later town',
        ),
      ),
    ],
    'A Middle Niger focus with an explicitly earlier Horn comparison. The 1981 excavation report is consulted through its published extract, not a new analysis of all underlying finds. No continent-wide political model is inferred.',
    'Household remains and regional survey broaden the account beyond rulers. They do not recover every resident’s voice or prove that social differences were absent.',
    ['middle-niger-settlement-evidence', 'aksum-red-sea-context'],
    ['middle-niger', 'mali-networks', 'aksum'],
    'Which evidence would help distinguish a town supported by its hinterland from a story based only on imported treasures?',
    'Look for local food production, ordinary tools, settlement relationships and dated exchange evidence. Explain what imported material adds without treating it as the sole cause of urban life.',
    s(
      '850 CE',
      'Around 850 CE lies within the excavation report’s 750–1100 high point for Djenné-Djeno and nearby settlements. This supplies a Middle Niger urban setting before the later Mali Empire. Aksumite deposits and the architecture of present Djenné retain their separate chronologies.',
      ref('middle-niger-urbanism-1981', 'Extract: 750–1100 chronology'),
      ref('orientation-djenne-heritage', 'Brief synthesis: distinct components'),
    ),
  ),
  reading(
    3,
    'Europe',
    'Aachen and Constantinople: buildings, images and changing authority',
    'How can a building preserve several different political and religious moments?',
    [
      s(
        'Two court settings',
        'Aachen’s palace chapel formed part of Charlemagne’s residence. Constantinople combined imperial and church institutions with craft production. Comparing them draws attention to the ways built spaces and images helped present authority; it does not make their governments or communities identical.',
        ref('orientation-aachen', 'Brief synthesis: palace and chapel'),
        ref('byzantium', 'Early and Middle Byzantium'),
      ),
      s(
        'Working with material and inherited forms',
        'Aachen’s octagonal core, galleries and bronze fittings bring skilled construction into the story. In Constantinople, the linked dossier distinguishes ivory carving from the fitting and repair of excavated ships. A courtly building or luxury object required work, but does not alone disclose each worker’s status.',
        ref('orientation-aachen', 'Brief synthesis: form and fittings'),
        ref('byzantium-yenikapi-2015', 'Printed pp53–55: YK14'),
        ref('byzantium-ivory-work-2007', 'Production and material discussion'),
      ),
      s(
        'Later additions change what a visitor sees',
        'Aachen’s chapel was subsequently enlarged, and its present dome mosaic dates to 1880–1881. At Constantinople, disputes over religious images preceded the restoration of icons in 843. The selected tenth-century ivory is later than that transition; its date cannot be moved back to illustrate the precise moment.',
        ref('orientation-aachen', 'Brief synthesis: additions and mosaic'),
        ref('byzantium', 'Iconoclasm and Middle Byzantium'),
        ref('met-464428', 'Date'),
      ),
    ],
    'Two selected court and religious settings, not all of Europe. Aachen’s source offers overlapping early construction formulations; neither supplies a day-by-day schedule. No claim of a uniform European revival is adopted.',
    'Royal patronage and surviving religious objects are prominent; shipbuilding and material work expose additional activities without documenting all households.',
    ['constantinople-material-work-context'],
    ['byzantium'],
    'Which parts of a present-day building can safely be used to describe an earlier century?',
    'Identify separately dated fabric, later additions and restoration. Keep uncertain features labelled; a building’s foundation date is not the date of every visible element.',
    s(
      '850 CE',
      'By 850 CE Aachen’s early ninth-century chapel had been built, while Constantinople stood shortly after the 843 restoration of icons. The present Aachen mosaic and the selected Byzantine ivory belong to later dates and do not illustrate this exact year.',
      ref(
        'orientation-aachen',
        'Brief synthesis: 793–813 construction and 1880–1881 mosaic',
      ),
      ref('byzantium', 'Middle Byzantium: 843'),
      ref('met-464428', 'Date'),
    ),
  ),
  reading(
    4,
    'West/Central Asia',
    'Baghdad, Samarra and the work of Abbasid workshops',
    'What changes when a court moves but skilled production continues?',
    [
      s(
        'Cities with separate histories',
        'Baghdad was founded in 762; the Abbasid court was based at Samarra from 836 to 892. Their surviving evidence differs. Samarra’s remains are particularly important because early Abbasid Baghdad is less well preserved, rather than because one city contained all regional creativity.',
        ref('abbasid', 'Opening capital chronology and survival paragraphs'),
      ),
      s(
        'A finished surface required repeated work',
        'Lustre-painted pottery required investment in materials, fuel, skilled handling and firing. The Ashmolean account considers production centres and patronage as questions, not a settled identification of one inventor or workshop for every vessel. The selected bowl’s surface can begin an investigation without supplying its maker’s name.',
        ref('abbasid-workshops', 'Investment, production and centres'),
        ref('met-452833', 'Medium and attribution'),
      ),
      s(
        'Political authority and craft have different endpoints',
        'During the tenth century, local dynasties gained greater autonomy and Abbasid control changed. That political history does not establish that ceramic skill or book production ended everywhere. Objects, workshops, court residence and wider authority each need their own dated evidence.',
        ref('abbasid', 'Tenth-century political changes and later book production'),
      ),
    ],
    'A justified focus on two Iraqi capitals and their production questions. No universal Islamic culture, precise trade itinerary or single birthplace of a technique is inferred.',
    'Court commissions and museum collections preserve selected products. Kiln work and costly failures draw attention to makers, whose own accounts remain scarce.',
    ['abbasid-iraq-context'],
    ['abbasid-craft'],
    'Does a court’s departure date establish the date when all workshops in that city closed?',
    'No. Compare workshop deposits, dated products and other production records with the court chronology. Administrative change alone does not date each working place.',
    s(
      '850 CE',
      'In 850 CE the Abbasid court was in Samarra, within its 836–892 residence there. Baghdad’s founding in 762 and later changes in caliphal power are distinct events. A vessel’s broader catalogue range does not make it a documented product of this exact year.',
      ref('abbasid', 'Opening capital chronology'),
      ref('met-452833', 'Date'),
    ),
  ),
  reading(
    5,
    'South Asia',
    'Nalanda and Paharpur: sustaining places of learning',
    'What work made a residential learning community possible?',
    [
      s(
        'Two monastic settings',
        'Nalanda in Bihar and Paharpur in present-day Bangladesh bring residences, religious buildings and learning into one inquiry. Nalanda’s institutional history spans the fifth–thirteenth centuries; Paharpur’s foundation is associated with Dharmapala around the late eighth–early ninth century. Their buildings accumulated in phases.',
        ref('nalanda', 'Brief synthesis: institutional chronology'),
        ref('orientation-paharpur', 'Brief synthesis: foundation and building phases'),
      ),
      s(
        'Learning needed food, rooms and people',
        'Yijing’s seventh-century account describes support and routines at Nalanda, as well as teaching and explanation. At Paharpur, the archaeological description identifies kitchens and a refectory as well as cells and a shrine. These sources make provisioning part of institutional history, while answering different questions about daily life.',
        ref('yijing-1896', 'Printed pp65, 154–155 and 176–177'),
        ref('orientation-paharpur', 'Brief synthesis: ancillary buildings'),
      ),
      s(
        'An account is not a plan of every phase',
        'Yijing’s translated description cannot be matched room for room to Nalanda’s conserved ruins. Nor can Paharpur’s final count of cells be assumed for its foundation. Successive construction and documented repairs mean that a single plan can combine evidence from different times.',
        ref('nalanda', 'Integrity and Authenticity'),
        ref(
          'orientation-paharpur',
          'Brief synthesis: cells in the last building phases',
        ),
      ),
    ],
    'Two eastern monastic institutions, not all South Asian education or agriculture. Support from outside institutions is considered without inventing village routes, universal access or the experiences of every cultivator.',
    'Institutional and monastic accounts foreground learned residents and patrons. Food workers, cultivators and people excluded from residence are less directly represented.',
    ['nalanda-institution-context'],
    ['nalanda'],
    'Why should a final building plan and an earlier visitor’s account be compared rather than treated as identical?',
    'State each source’s date and purpose. Seek phase-specific evidence before identifying rooms or populations; describe support and routines without equating a later footprint with an earlier census.',
    s(
      '850 CE',
      'Around 850 CE falls within Nalanda’s monastic history and after the foundation period attributed to Paharpur. The complete later layouts are not securely dated to this year, and Yijing’s seventh-century observations remain earlier testimony.',
      ref('nalanda', 'Brief synthesis'),
      ref('orientation-paharpur', 'Foundation and final building phases'),
      ref('yijing-1896', 'Title chronology: 671–695'),
    ),
  ),
  reading(
    6,
    'East Asia',
    'Chang’an, Gyeongju and Nara: connected but distinct settings',
    'How can shared forms coexist with different political histories?',
    [
      s(
        'More than one capital',
        'Tang Chang’an, Silla Gyeongju and Nara preserve different combinations of court, religious and urban evidence. Nara’s monuments record links with China and Korea; Gyeongju’s palace and temple remains establish a Korean setting in its own right. Similar forms do not make one place a copy of another.',
        ref('tang', 'Chang’an and visiting communities'),
        ref('orientation-nara', 'Criterion ii; component parts'),
        ref('orientation-gyeongju', 'Brief synthesis: Wolseong and temple belts'),
      ),
      s(
        'Institutions organized movement and work',
        'The Chang’an reading describes neighbourhood gates, recruitment and translation as different forms of organized activity. At Nara, audience halls, residences and religious compounds served distinct purposes. Those arrangements raise questions about access and service, without proving that every rule was followed or every resident enjoyed equal standing.',
        ref('tang-wards', 'Wards and curfew'),
        ref('tang-changan', 'Xuanzang and translation'),
        ref('orientation-nara', 'Brief synthesis: palace functions'),
      ),
      s(
        'A capital’s move does not erase a place',
        'Nara’s capital period ended in 784. Its temples and shrines had histories beyond that political role, including the protection of the Kasugayama sacred forest from 841 described by UNESCO. The Korean chronology separately places Silla and Barhae alongside one another, then later political transitions. These changes cannot be collapsed into Tang’s 907 endpoint.',
        ref('orientation-nara', 'Description: 710–784; Authenticity: 841'),
        ref('orientation-korea', 'Timeline: Silla, Barhae and later regimes'),
        ref('tang', 'Title chronology'),
      ),
    ],
    'Selected Chinese, Korean and Japanese urban/religious settings. The label Unified Silla does not erase contemporary Barhae or establish one unchanging border; neither chronology supplies all East Asian experience.',
    'Elite tombs and monumental compounds dominate surviving displays. Administrative functions identify work without preserving every servant, artisan or visitor’s story.',
    ['tang-changan-context'],
    ['tang-city'],
    'Can a place still matter after it stops being the capital?',
    'Distinguish political residence from religious, productive and community uses. Use Nara’s earlier capital dates and later sacred-forest evidence as separate examples; do not infer abandonment from a capital move.',
    s(
      '850 CE',
      'Around 850 CE lies within Tang and Silla histories, while Barhae also existed. Nara was no longer Japan’s capital, but its religious landscape continued; UNESCO dates the Kasugayama forest prohibition from 841. The selected earlier Tang tomb figure retains its own catalogue date.',
      ref('tang', '618–907 chronology'),
      ref('orientation-korea', 'Timeline: Silla 676–935 and Barhae 698–926'),
      ref('orientation-nara', 'Description and Authenticity'),
      ref('met-44800', 'Date'),
    ),
  ),
  reading(
    7,
    'Southeast Asia/Oceania',
    'Central Java, early Angkor and a separate Tongan sequence',
    'How do we compare monument building with settlement that leaves different traces?',
    [
      s(
        'Religious landscapes in Java and Cambodia',
        'Borobudur belongs to an eighth–ninth-century construction frame in Central Java, alongside the associated Mendut and Pawon temples. Angkor’s wider archaeological landscape includes several capitals, temples and water structures accumulated over centuries. It is not one construction project with a single completion date.',
        ref('borobudur', 'Brief synthesis: construction and three monuments'),
        ref('angkor', 'Brief synthesis: successive plans and water structures'),
      ),
      s(
        'Building and upkeep were different tasks',
        'Carved stone, galleries and drainage made Borobudur a working built environment. The linked reading separates construction evidence from interpretations of religious upkeep in inscriptions. Modern repairs add another phase. Neither a later charter nor a restored surface supplies a complete account of the original workforce.',
        ref('borobudur-drainage-2018', 'Borobudur-specific paragraphs'),
        ref('borobudur-inscription-context-2018', 'Tri Tepusan upkeep interpretation'),
        ref('borobudur', 'Authenticity: restorations'),
      ),
      s(
        'An island comparison without an invented route',
        'Research at Tongan sites describes settlement continuing into later periods without pottery manufacture. That makes an instructive comparison: the end of a material tradition need not mean the end of a community. It does not connect Tonga to these particular temple projects or establish a precisely dated 850 CE floor.',
        ref('lapita-tonga-ceramic-change', 'Methods: continuity into aceramic periods'),
      ),
      s(
        'The famous later monument is not the early landscape',
        'Angkor’s ninth-century regional beginnings should not be illustrated as though the later Angkor Wat temple already existed. Borobudur’s broad construction dates likewise do not establish which relief or terrace was finished in 850. Each monument needs its own chronology within the regional comparison.',
        ref('angkor', 'Description: ninth–fifteenth-century frame; Angkor Wat'),
        ref('borobudur', 'Brief synthesis: construction range'),
      ),
    ],
    'Separate Javanese, Cambodian and Tongan histories. No mainland–Pacific voyage is inferred; the Oceanian evidence is settlement continuity at sampled sites rather than a dated event in the snapshot year.',
    'Monumental evidence favours religious patrons and skilled stone work. Tongan settlement evidence brings a different material record into view but does not recover every resident’s experience.',
    ['central-java-religious-landscapes', 'angkor-landscape'],
    ['borobudur', 'angkor', 'lapita'],
    'Does the disappearance of pottery prove that a community left its settlement?',
    'Look for independently dated evidence of later occupation. Explain the distinction between a material practice ending and people leaving; do not infer a replacement population from missing pots alone.',
    s(
      '850 CE',
      'Around 850 CE lies within Borobudur’s broad construction frame and the opening centuries of the Angkor regional frame. Later Angkor Wat is not backdated. The Tongan study separately documents continuity into aceramic periods, without identifying an event exactly in 850.',
      ref('borobudur', 'Brief synthesis: eighth–ninth centuries'),
      ref('angkor', 'Description: regional and temple dates'),
      ref('lapita-tonga-ceramic-change', 'Methods: settlement continuity'),
    ),
  ),
];
export function applyC5Orientations(corpus: Corpus) {
  const sources: Omit<Corpus['sources'][number], 'accessed'>[] = [
    {
      id: 'orientation-djenne-urbanism',
      title: 'Different cities: Jenne-jeno and African urbanism',
      institution: 'The Cambridge World History, pp364–380',
      author: 'Roderick J. McIntosh',
      published: '2015',
      type: 'scholarship',
      url: 'https://doi.org/10.1017/CHO9781139035606.022',
      scope:
        'Publisher Summary only: varied urban forms and power, clustered cities, and the distinction between Jenne-jeno and its descendant town. No full chapter or underlying excavations consulted.',
    },
    {
      id: 'orientation-djenne-heritage',
      title: 'Old Towns of Djenné',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/116/',
      scope:
        'Brief synthesis and criterion iii: archaeological components distinguished from present town fabric and later Islamic architecture. No modern house count transferred into the past, exact ninth-century footprint or image reuse.',
    },
    {
      id: 'orientation-aachen',
      title: 'Aachen Cathedral',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/3/',
      scope:
        'Description and Brief synthesis: early chapel, palace functions, form, fittings, later additions and 1880–1881 mosaic. Description commencement c790–800 and synthesis construction 793–813 retained as differing formulations. Erroneous eastern Holy Roman Empire wording, priority and universal-unification claims not adopted. No image reuse.',
    },
    {
      id: 'orientation-paharpur',
      title: 'Ruins of the Buddhist Vihara at Paharpur',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/322/',
      scope:
        'Brief synthesis: attributed late eighth–early ninth-century foundation, phased cells, kitchen/refectory and spatial arrangement. Criterion vi seventeenth-century endpoint conflicts with opening twelfth-century account and is not adopted. No complete excavation report, precise phase map or image reuse.',
    },
    {
      id: 'orientation-nara',
      title: 'Historic Monuments of Ancient Nara',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/870/',
      scope:
        'Description, Brief synthesis, criterion ii and Authenticity: 710–784 capital dates, institutional functions, China/Korea links, and Kasugayama prohibition from 841. Reconstructed buildings not presented as unchanged eighth-century fabric. No current legal assessment or image reuse.',
    },
    {
      id: 'orientation-gyeongju',
      title: 'Gyeongju Historic Areas',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/976/',
      scope:
        'Brief synthesis: Wolseong palace and temple belts, selected seventh–tenth-century remains. Overbroad claim of peninsula-wide Silla rule for almost a millennium and north-of-city wording for Namsan not adopted. No whole-peninsula boundary, complete inventory or image reuse.',
    },
    {
      id: 'orientation-korea',
      title: 'Korea, 500–1000 A.D.',
      institution: 'The Metropolitan Museum of Art',
      type: 'scholarship',
      url: 'https://www.metmuseum.org/it/toah/ht/06/eak',
      scope:
        'English Timeline content at this URL consulted for overlapping Silla 676–935 and Barhae 698–926, then later regimes. Overview single-government language is not used to erase Barhae or define an exact border. No source images reproduced.',
    },
  ];
  corpus.sources.push(
    ...sources.map((source) => ({ ...source, accessed: '2026-11-04' })),
  );
  for (const [id, scope] of [
    [
      'middle-niger-urbanism-1981',
      'Published Extract reconsulted for first-millennium urban growth, 750–1100 high point, hinterland settlements, staples and imported materials; complete article and original records remain unread.',
    ],
    [
      'chaco-bonito',
      'Construction paragraph reconsulted for staged construction 850–1150; no complete structure backdated to 850.',
    ],
    [
      'abbasid',
      'Opening capital dates and selected political-change/production paragraphs reconsulted. Court at Samarra 836–892 kept distinct from workshop lifetimes; universal-empire claims excluded.',
    ],
    [
      'nalanda',
      'Brief synthesis, Integrity and Authenticity reconsulted for institutional dates, successive construction and repair. Earlier site remains not treated as an earlier university founding.',
    ],
    [
      'byzantium',
      'Iconoclasm and Middle Byzantium paragraphs reconsulted for 843 restoration of icons, distinct from the selected tenth-century ivory. No universal claim about language-change timing adopted.',
    ],
    [
      'tang',
      'Title chronology and selected Chang’an/institution paragraphs reconsulted. Broad benevolence and universal access claims not adopted.',
    ],
    [
      'borobudur',
      'Brief synthesis and Authenticity reconsulted for eighth–ninth-century building, associated monuments and later repairs; no part-by-part 850 dating.',
    ],
    [
      'angkor',
      'Description and Brief synthesis reconsulted for broad regional frame, successive plans and separately dated later temples; no Angkor Wat in 850.',
    ],
  ] as const) {
    addSourceConsultation(
      corpus,
      id,
      '2026-11-04',
      `Additional consultation 4 November: ${scope}`,
    );
  }
  (corpus.orientations ??= []).push(...structuredClone(c5Orientations));
}
