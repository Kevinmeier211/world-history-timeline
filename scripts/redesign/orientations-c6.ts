import { addSourceConsultation } from './content-helpers';
import type {
  Corpus,
  RegionalOrientation,
  Region,
  Section,
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
  const id = `C6-R${n}`;
  return {
    id,
    chapter: 'C6',
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
        year: 1250,
        text: snapshot.text,
        citations: snapshot.citations,
      },
    ],
  };
}
export const c6Orientations = [
  reading(
    1,
    'Americas',
    'Cahokia and Chaco: communities through urban change',
    'How do buildings and workshop traces change a history centred on monuments?',
    [
      s(
        'Neighbourhoods and gathering places',
        'Cahokia’s neighbourhood archaeology and Chaco’s great houses offer different views of organized work. Large public structures depended on recurring activities in homes and working places. Their size alone does not establish identical government, labour recruitment or social rank.',
        ref(
          'cahokia-neighborhoods-2019',
          'Published abstract and neighbourhood interpretation',
        ),
        ref('chaco-pueblo-period', 'Architecture; Environment and Subsistence'),
      ),
      s(
        'Making things leaves a sequence',
        'At Cahokia, unfinished copper and workshop evidence reveal steps in production. At Chaco, masonry and timber record construction over generations. These practical traces answer questions about materials and skill, while the identities and conditions of every worker remain unknown.',
        ref('cahokia-copper-2011', 'Production sequence and workshop evidence'),
        ref('chaco-history', 'Great-house construction'),
      ),
      s(
        'Changing centres did not end Indigenous histories',
        'Chaco’s major building projects and later changes have separate dates. Cahokia’s local soil study tests a particular environmental explanation; it does not establish one cause for every urban change. Continuing community relationships must also be distinguished from the dates assigned to an archaeological investigation.',
        ref('chaco-history', 'Changes in the 1100s and 1200s; associated peoples'),
        ref('cahokia-soils-2021', 'Results and limits'),
        ref('cahokia-peoria-visit-2022', 'Attributed community visit account'),
      ),
    ],
    'Two North American urban/regional settings, not a complete account of the Americas. The later Inka reading broadens comparison elsewhere in the chapter but does not establish Inka imperial institutions in 1250.',
    'Households and makers appear beside monumental architecture. Attributed living-community accounts have their own dates and do not imply universal agreement or approval of this atlas.',
    ['cahokia-neighborhoods-making-context', 'chaco-community-work-context'],
    ['cahokia-city', 'chaco-communities'],
    'What evidence is needed before explaining two cities’ changes with the same environmental cause?',
    'Test the proposed mechanism against local dated observations at each place. Similar outcomes or broad overlap do not establish one shared cause, and urban change does not establish the disappearance of a people.',
    s(
      '1250 CE',
      'Around 1250 CE falls within Cahokia’s selected urban investigation frame but after Pueblo Bonito’s main construction range of about 850–1150. Chaco’s later changes are part of the comparison, not a claim that its entire great-house programme remained unchanged in 1250.',
      ref('cahokia-soils-2021', 'Urban investigation frame'),
      ref('chaco-bonito', 'Construction chronology'),
      ref('chaco-history', 'Twelfth–thirteenth-century change'),
    ),
  ),
  reading(
    2,
    'Africa',
    'Middle Niger, Kilwa and Great Zimbabwe: different urban landscapes',
    'How did inland production and coastal exchange support different kinds of towns?',
    [
      s(
        'Three regions, several institutions',
        'Middle Niger settlements, the Swahili port of Kilwa and Great Zimbabwe occupy different environments. The selected Middle Niger figure has a thirteenth-century catalogue date; Kilwa’s prosperity grew through coastal exchange, while Great Zimbabwe’s hill settlement and later enclosures have their own building sequences.',
        ref('met-314362', 'Date and attribution'),
        ref('orientation-kilwa', 'Brief synthesis: occupation and exchange'),
        ref('orientation-zimbabwe', 'Brief synthesis: Hill Ruins and Great Enclosure'),
      ),
      s(
        'Common work and distant materials',
        'Middle Niger excavation accounts distinguish changing domestic and craft uses of space. Kilwa’s coral-and-lime buildings and Great Zimbabwe’s granite masonry make skilled construction visible in different materials. Imported ceramics or beads establish wider connections, but not a complete itinerary for every object.',
        ref(
          'middle-niger-recent-excavations',
          'Selected domestic and artisanal sequences',
        ),
        ref('orientation-kilwa', 'Brief synthesis: materials and urban complex'),
        ref('orientation-zimbabwe', 'Brief synthesis: masonry and excavated imports'),
      ),
      s(
        'Do not make every surviving monument simultaneous',
        'Kilwa’s Husuni Kubwa palace belongs to the early fourteenth century, after 1250. UNESCO also dates Great Zimbabwe’s Great Enclosure to the fourteenth century. The earlier settings remain meaningful without backdating their most familiar later structures.',
        ref('orientation-kilwa', 'Brief synthesis: Husuni Kubwa c1310–1333'),
        ref('orientation-zimbabwe', 'Brief synthesis: Great Enclosure chronology'),
      ),
    ],
    'Three selected regions, not a single African political system. The exact provenance of the museum figure is limited; imports are not proof that outsiders founded these settlements. Disputed or unsupported single-cause abandonment claims are excluded.',
    'Ordinary vessels, workspaces and construction materials broaden the view beyond rulers and imported luxuries. Surviving evidence does not provide every worker’s account.',
    ['middle-niger-settlement-evidence', 'mali-networks-context'],
    ['middle-niger', 'mali-networks'],
    'Can a fourteenth-century palace illustrate the layout of a port in 1250?',
    'Use it only as an explicitly later comparison. Find earlier phases or settlement evidence for 1250; a site’s long occupation range does not date every building.',
    s(
      '1250 CE',
      'Around 1250 CE falls within Kilwa’s thirteenth–fourteenth-century prosperity and the occupation of Great Zimbabwe’s hill settlement. Husuni Kubwa and the Great Enclosure are later. The selected Middle Niger figure is broadly thirteenth-century, without a precisely documented 1250 find context.',
      ref('orientation-kilwa', 'Occupation versus palace dates'),
      ref('orientation-zimbabwe', 'Hill and enclosure dates'),
      ref('met-314362', 'Date and provenance'),
    ),
  ),
  reading(
    3,
    'Europe',
    'Provins, Fontenay and changing Constantinople',
    'How did spaces for exchange, production and worship organize different work?',
    [
      s(
        'A fair town and a rural monastery',
        'Provins developed spaces for fairs, goods storage and related trades. Fontenay combined religious and residential buildings with a bakery and ironworks in a rural setting. These institutions brought people and resources together in different ways; neither represents every European town or village.',
        ref('orientation-provins', 'Brief synthesis: fairs and urban functions'),
        ref('orientation-fontenay', 'Brief synthesis: communal and working buildings'),
      ),
      s(
        'Buildings supported a process',
        'Provins’s cellars, warehouses and trading spaces supported storage and exchange. At Fontenay, the ironworks and provision of water and agricultural land place practical production beside worship. An ideal of monastic self-sufficiency should not be mistaken for proof that no goods or labour came from outside.',
        ref(
          'orientation-provins',
          'Brief synthesis: storage and productive activities',
        ),
        ref('orientation-fontenay', 'Brief synthesis and Integrity'),
      ),
      s(
        'Political rule changed on a different schedule',
        'Constantinople was under Latin rule from 1204 to 1261, while Byzantine states continued elsewhere. A 1250 label therefore cannot describe the city as under uninterrupted Byzantine government. Fontenay’s later alterations and Provins’s later changes likewise require dates beyond their medieval beginnings.',
        ref('byzantium', 'Period of the Latin Occupation'),
        ref('orientation-fontenay', 'Authenticity: later transformations'),
        ref('orientation-provins', 'Integrity and Authenticity'),
      ),
    ],
    'A French fair town, a Burgundian monastery and an eastern political comparison. The sources explain selected institutional forms; they are not a complete account of rural labour obligations or every resident’s rights.',
    'Merchant spaces and monastic buildings preserve institutional priorities. They reveal tasks without fully recording dependent workers, women or people excluded from these institutions.',
    ['constantinople-material-work-context'],
    ['byzantium'],
    'What can a storehouse tell you, and what would require a written or excavated record of its use?',
    'Its form can support a storage interpretation. Identifying particular goods, owners, workers and quantities requires additional evidence; do not turn capacity or institutional ideals into an actual inventory.',
    s(
      '1250 CE',
      'Around 1250 CE follows the medieval development of Provins’s fairs and Fontenay’s twelfth-century church and ironworks. Constantinople was then under Latin rule, before the Byzantine recovery of 1261. Later restored fabric must remain separately labelled.',
      ref('orientation-provins', 'Brief synthesis: eleventh-century fairs'),
      ref(
        'orientation-fontenay',
        'Church 1139–1147 and late-twelfth-century ironworks',
      ),
      ref('byzantium', 'Latin Occupation 1204–1261'),
    ),
  ),
  reading(
    4,
    'West/Central Asia',
    'Karakorum and Baghdad: work under changing imperial power',
    'How can a connected empire also move people through coercion?',
    [
      s(
        'A steppe capital and an older Iraqi city',
        'Karakorum in the Mongolian steppe and Baghdad in Iraq offer different urban histories. The Bonn excavation project distinguishes a tradition of Chinggis Khan’s camp from documented construction under Ögedei in 1235. Baghdad’s Abbasid history began much earlier and was not ended by the Mongols until 1258.',
        ref(
          'orientation-karakorum',
          'Historical introduction: camp and 1235 construction',
        ),
        ref('abbasid', 'Capital chronology and 1258 conquest'),
      ),
      s(
        'Streets and workshops required maintenance',
        'Karakorum’s excavators describe roads, repeated building phases, ovens and working areas. These traces add a material record to the traveller William of Rubruck’s account. They do not justify assigning an ethnicity to every craft object or treating a visitor’s description as a complete census.',
        ref(
          'orientation-karakorum',
          'Excavations: roads, buildings and workshop evidence',
        ),
      ),
      s(
        'Skilled movement could be forced',
        'The project’s account identifies the goldsmith Guillaume Boucher as a prisoner brought from the European campaigns, working for the Mongol court when Rubruck visited in 1254. Artistic exchange therefore cannot simply be described as free movement or mutual benefit. His named experience is specific, not the biography of every craft worker.',
        ref('orientation-karakorum', 'Rubruck and Guillaume Boucher paragraph'),
      ),
      s(
        'Later conquest belongs after the snapshot',
        'Hülegü’s conquest of Baghdad in 1258 transformed the political setting. Later Ilkhanid patronage belongs to a subsequent history. Keeping those dates separate lets us discuss destructive conquest and changing artistic production without describing Baghdad as already conquered in 1250.',
        ref('orientation-mongol-transition', 'Hülegü and Baghdad paragraph'),
      ),
    ],
    'A cross-regional steppe/West Asian comparison; Karakorum is located in present-day Mongolia, not relabelled as a West Asian city. No uniform Mongol culture, exact imperial boundary or harmless universal exchange is inferred.',
    'A named captive artisan makes coercion visible alongside skill. Excavation and a mediated traveller account preserve different evidence and leave many residents unnamed.',
    ['abbasid-iraq-context'],
    ['abbasid-craft'],
    'Why is the presence of artisans from several places not enough to call their movement voluntary?',
    'Look for evidence about captivity, recruitment and obligations. Use Boucher’s reported captivity as one documented example while preserving uncertainty for other people.',
    s(
      '1250 CE',
      'By 1250 CE Karakorum’s documented 1235 building programme lay in the past, while Baghdad remained before the Mongol conquest of 1258. Rubruck’s 1254 visit is a later observation, not an eyewitness report from this exact year.',
      ref('orientation-karakorum', '1235 construction and 1254 visit'),
      ref('orientation-mongol-transition', 'Baghdad conquered in 1258'),
    ),
  ),
  reading(
    5,
    'South Asia',
    'Delhi and Chola temples: authority expressed in layered buildings',
    'What can reused material and later additions tell us about changing institutions?',
    [
      s(
        'Two architectural settings',
        'The Qutb complex near Delhi and the Chola temples at Thanjavur, Gangaikondacholisvaram and Darasuram preserve different religious and political settings. Delhi’s mosque and minaret were developed by successive rulers; the southern temples belong to distinct eleventh–twelfth-century projects.',
        ref('orientation-qutb', 'Description and Brief synthesis'),
        ref('orientation-chola', 'Description: three temple projects'),
      ),
      s(
        'Material has a history before its present position',
        'The Qutb mosque incorporates carved elements from earlier Hindu and Jain temples. A reused pillar therefore has an earlier production context and a later architectural setting. Reuse is evidence of transformation under new rulers; its presence alone cannot recover every maker’s intention or every affected community’s experience.',
        ref('orientation-qutb', 'Brief synthesis: carved pillars and cladding'),
      ),
      s(
        'Maintenance extends beyond a founding ruler',
        'The Chola temples continue as places of worship, according to the heritage account. Sculpture, building fabric and repeated ritual have different histories. Nalanda offers a separately linked institutional comparison about residence, provision and repairs, not evidence that all temples and monasteries shared one labour system.',
        ref('orientation-chola', 'Brief synthesis: living temples and ritual'),
        ref('nalanda', 'Integrity and Authenticity'),
      ),
      s(
        'The complete complex is later than its first phase',
        'The Alai Darwaza gateway at Delhi dates to 1311, after the 1250 snapshot. It cannot be used to reconstruct the early thirteenth-century complex without that distinction. The different Chola temple dates similarly prevent a single construction date for all three.',
        ref('orientation-qutb', 'Description: Alai Darwaza 1311'),
        ref('orientation-chola', 'Description: eleventh–twelfth-century projects'),
      ),
    ],
    'Selected Delhi and Tamil-region monuments, not all South Asian institutions or Indian Ocean exchange. No precise political border, universally shared religious experience or contemporary legal claim is made.',
    'Royal commissions and religious buildings are prominent. Carving and repair reveal skilled work while the accounts of many labourers, cultivators and affected worshippers remain absent.',
    ['nalanda-institution-context'],
    ['nalanda'],
    'A carved pillar is older than the building in which it now stands. Which date belongs on its label?',
    'Give both the earlier element’s supported date and its later reuse context, with uncertainty where needed. Neither the new building date nor the original carving date alone tells the whole history.',
    s(
      '1250 CE',
      'Around 1250 CE is after the early Qutb building phases and the selected eleventh–twelfth-century Chola temple projects. Delhi’s Alai Darwaza of 1311 is still later. These local sequences do not establish one regional political or religious system.',
      ref('orientation-qutb', 'Early thirteenth-century frame versus 1311 gateway'),
      ref('orientation-chola', 'Description: temple dates'),
    ),
  ),
  reading(
    6,
    'East Asia',
    'Song, Mongol and Ming settings: production across political change',
    'How do we distinguish a craft history from a dynasty’s dates?',
    [
      s(
        'Northern and southern settings',
        'The Song court’s move south after 1127 separated the earlier Kaifeng setting from the later court at Hangzhou. Northern territories had different rulers. The later Yuan and Ming labels belong to subsequent political histories rather than one continuous Song territory.',
        ref('song-phases', 'Timeline; 1125–1234 and 1127–1279 entries'),
      ),
      s(
        'Households, markets and administration',
        'The linked Song reading compares skilled ceramic production, market exchange and proposals about crop loans. A bowl and an administrative proposal answer different questions: one records a made object, the other an intended intervention. Neither establishes the actual debts or living conditions of every household.',
        ref('song-markets', 'Selected market account'),
        ref('song-crop-loans', 'Translated proposal'),
        ref('song-governance', 'Administrative aims'),
      ),
      s(
        'A later workshop history',
        'Mongol conquest ended Southern Song rule in 1279, after the Yuan name had been adopted in 1271. Ming rule began in 1368. The linked Ming workshop inquiry uses later objects and production evidence; it can illuminate comparison without moving a Ming vessel into a thirteenth-century display.',
        ref('song-phases', '1260–1368 political sequence'),
        ref('ming', 'Opening dynastic chronology'),
      ),
    ],
    'A focused Chinese political and production inquiry; it does not cover all East Asia. The source chronology’s erroneous Huizong/Mongol attribution is excluded, and broad period labels do not date every workshop.',
    'Official proposals and elite collected objects preserve selected perspectives. Market and production evidence help recover wider work without establishing universal access or prosperity.',
    ['song-institutions-context', 'ming-kilns-markets-context'],
    ['song-art', 'ming-workshops'],
    'Why can a later dynasty’s vessel be useful for comparison but misleading as an illustration of 1250?',
    'Retain the vessel’s own date and label it as later. Compare techniques or institutions with supported earlier evidence rather than using a dynasty’s general fame to override object chronology.',
    s(
      '1250 CE',
      'Around 1250 CE belongs to Southern Song rule in the south alongside Mongol power farther north. It precedes the Yuan name of 1271, the final conquest of Southern Song in 1279 and the Ming beginning in 1368. Those later labels cannot be substituted for the selected year.',
      ref('song-phases', 'Timeline and entries: 1206, 1260 and 1368'),
    ),
  ),
  reading(
    7,
    'Southeast Asia/Oceania',
    'Angkor landscapes and the dating of settlement in Aotearoa',
    'How does a modelled date range differ from a recorded arrival?',
    [
      s(
        'Two different investigations',
        'Angkor’s temples, water structures and settlement evidence describe a mainland urban landscape. Research on settlement in Aotearoa asks a different question using archaeological dates and models. Their shared place in this chapter does not imply a voyage linking them or a common political history.',
        ref('angkor', 'Brief synthesis: settlement and hydraulic structures'),
        ref('voyaging-chronology-2022', 'Abstract and Timing of Polynesian Arrival'),
      ),
      s(
        'Several kinds of knowledge',
        'Angkor’s landscape studies combine mapping with archaeological evidence rather than treating every canal as contemporary. In the voyaging reading, archaeological chronologies are compared with attributed accounts of navigational learning. A modern teaching account is evidence of practice and transmission, not a medieval logbook.',
        ref('angkor-lidar', 'Mapping and landscape interpretation'),
        ref(
          'voyaging-tuaupiki-2022',
          'Attributed narrative and environmental-knowledge research',
        ),
        ref('voyaging-pvs-modern', 'Modern methods and teaching history'),
      ),
      s(
        'An estimate is not a precise event',
        'The 2022 Aotearoa study reports modelled arrival ranges of 1250–1275 for the North Island and 1280–1295 for the South Island. These are probability intervals, not named landfalls. The earlier rat-seed study and the later modelling approach use different evidence and methods, which should remain visible.',
        ref(
          'voyaging-chronology-2022',
          'Abstract; model intervals and probability convention',
        ),
        ref('voyaging-rat-seeds-2008', 'Results and Conclusions'),
      ),
    ],
    'Separate Cambodian and Aotearoa settings. The model interval does not establish human presence at every year inside it, and no exact canoe route or first arrival date is drawn.',
    'Landscape archaeology and attributed living navigational knowledge answer different questions. Neither represents every community’s account, and modern practice is not silently backdated.',
    ['angkor-landscape', 'voyaging-dating-knowledge-context'],
    ['angkor', 'polynesian-voyaging'],
    'If an arrival model gives 1250–1275, can the caption say people definitely arrived in 1250?',
    'No. Report the range, model and probability convention. The lower bound is not an observed event; distinguish archaeological inference from a dated eyewitness record.',
    s(
      '1250 CE',
      'Around 1250 CE lies within Angkor’s regional history. For Aotearoa, 1250 is the beginning of a published North Island model interval of 1250–1275, not a verified arrival in this year. The South Island interval of 1280–1295 is later and remains separate.',
      ref('angkor', 'Description: regional chronology'),
      ref('voyaging-chronology-2022', 'Abstract and Timing of Polynesian Arrival'),
    ),
  ),
];
export function applyC6Orientations(corpus: Corpus) {
  const sources: Omit<Corpus['sources'][number], 'accessed'>[] = [
    {
      id: 'orientation-kilwa',
      title: 'Ruins of Kilwa Kisiwani and Ruins of Songo Mnara',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/144/',
      scope:
        'Brief synthesis: Kilwa occupation/prosperity, building materials and c1310–1333 Husuni Kubwa. Songo Mnara not independently backdated to 1250. No exhaustive trade route, all-Indian-Ocean control, first/oldest claim or image reuse.',
    },
    {
      id: 'orientation-zimbabwe',
      title: 'Great Zimbabwe National Monument',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/364/',
      scope:
        'Brief synthesis: Hill Ruins occupation, fourteenth-century Great Enclosure, masonry and excavated imports. Queen of Sheba legend, erroneous nineteenth-century Valley Ruins label, population total and single-cause abandonment account not adopted. No source image reuse.',
    },
    {
      id: 'orientation-provins',
      title: 'Provins, Town of Medieval Fairs',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/873/',
      scope:
        'Brief synthesis, Integrity and Authenticity: eleventh-century fairs, trade/storage functions and productive activities. No precise calendar of 1250 fairs, first international trade claim or image reuse.',
    },
    {
      id: 'orientation-fontenay',
      title: 'Cistercian Abbey of Fontenay',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/165/',
      scope:
        'Brief synthesis, Integrity and Authenticity: foundation 1119, church 1139–1147, late-twelfth-century ironworks, water/agricultural setting, later alterations. Self-sufficiency treated as an institutional ideal rather than a complete economic audit. No image reuse.',
    },
    {
      id: 'orientation-karakorum',
      title: 'Karakorum, the Capital of the Mongol World Empire',
      institution:
        'University of Bonn, Institute of Archaeology and Cultural Anthropology',
      type: 'archaeology',
      url: 'https://www.iak.uni-bonn.de/de/institut/abteilungen/vor-und-fruehgeschichtliche-archaeologie/projekte-1/karakorum',
      scope:
        'Project introduction, 1235 construction, mediated Rubruck/Boucher account and selected excavation paragraphs on roads, phases and workshop features consulted. Former palace-area identification revised to Buddhist temple, not adopted as a proven palace. No complete excavation publication, original traveller manuscript, figure pixels or images reused.',
    },
    {
      id: 'orientation-mongol-transition',
      title: 'The Legacy of Genghis Khan',
      institution: 'The Metropolitan Museum of Art',
      author: 'Stefano Carboni and Qamar Adamjee',
      published: '2003-10',
      type: 'scholarship',
      url: 'https://www.metmuseum.org/fr/essays/the-legacy-of-genghis-khan',
      scope:
        'English account at this URL: Hülegü, Baghdad conquest 1258 and subsequent Ilkhanid setting. Uniform Mongol sensibility, purely nomadic origins and universal beneficial-exchange claims not adopted. No source images reused.',
    },
    {
      id: 'orientation-qutb',
      title: 'Qutb Minar and its Monuments, Delhi',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/233',
      scope:
        'English Description and Brief synthesis retrieved without trailing slash after slash URL returned 503. Selected early complex, reused Hindu/Jain elements, successive rulers and Alai Darwaza 1311. Broad minaret 1199–1503 phrasing not used as one uninterrupted construction project. Ideological intentions, first/oldest claims and exact original-material count not adopted. No image reuse.',
    },
    {
      id: 'orientation-chola',
      title: 'Great Living Chola Temples',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/250/',
      scope:
        'English Description and opening Brief synthesis: three eleventh–twelfth-century temple projects, Gangaikondacholisvaram 1035 and continuing ritual account. No maximal territorial claim, universal worship experience, complete inscription audit or image reuse.',
    },
  ];
  corpus.sources.push(
    ...sources.map((source) => ({ ...source, accessed: '2026-11-04' })),
  );
  addSourceConsultation(
    corpus,
    'song-phases',
    '2026-11-04',
    'Additional consultation 4 November: Timeline and selected 1125–1234, 1127–1279, 1206, 1260 and 1368 entries rechecked for the 1250 snapshot. Inaccurate Huizong/Mongol attribution remains excluded; no dynasty-wide border or exact workshop date inferred.',
  );
  addSourceConsultation(
    corpus,
    'voyaging-chronology-2022',
    '2026-11-04',
    'Additional consultation 4 November: Institutional abstract rechecked for North Island 1250–1275 and South Island 1280–1295 ranges. Earlier selected PDF consultation remains distinct; no exact 1250 landfall inferred.',
  );
  (corpus.orientations ??= []).push(...structuredClone(c6Orientations));
}
