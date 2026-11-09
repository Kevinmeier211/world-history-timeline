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
  const id = `C7-R${n}`;
  return {
    id,
    chapter: 'C7',
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
        year: 1600,
        text: snapshot.text,
        citations: snapshot.citations,
      },
    ],
  };
}
export const c7Orientations = [
  reading(
    1,
    'Americas',
    'Andean makers and a Pacific encounter',
    'How did skilled work continue and change within colonial relationships?',
    [
      s(
        'Two different American settings',
        'Andean textiles and the 1595 wreck of the San Agustín at tamál-húye bring different kinds of evidence into view. Textile histories trace making across political change; Coast Miwok village archaeology investigates the use of objects from a particular maritime encounter. Neither supplies a single experience of colonization.',
        ref('orientation-andean-textiles', 'Colonial continuation and commissions'),
        ref('manila-tamal-huye-project', 'Project introduction; 1595 wreck'),
      ),
      s(
        'Continuity did not mean unchanged circumstances',
        'Indigenous Andean makers continued techniques and forms while producing new combinations of motifs and commissions for churches and private patrons. The selected earlier tunic remains dated to 1450–1550. Its survival is not proof that every maker’s working conditions remained the same in the colonial period.',
        ref('orientation-andean-textiles', 'Final colonial-period paragraphs'),
        ref('met-313152', 'Date and construction'),
      ),
      s(
        'An object can acquire another local use',
        'At Point Reyes, Asian and European materials from the wreck occur in Coast Miwok village contexts. Investigators consider how people selected and used them, rather than treating local communities as passive endpoints of a trade line. A found fragment does not by itself recover its user’s name or intention.',
        ref(
          'manila-tamal-huye-project',
          'Village archaeology and alternative-use models',
        ),
      ),
      s(
        'Later work records need their own date',
        'The Manila reading’s shipbuilding reports describe early-seventeenth-century burdens on Philippine communities. They explain another part of the system, but do not identify the labour history of every person aboard the ship wrecked in 1595. The later Haitian and Canandaigua investigations likewise belong to later moments in this chapter.',
        ref('manila-shipbuilding-1618-1619', 'Fajardo and Pineda reports'),
        ref('manila-tamal-huye-project', 'Voyage chronology'),
      ),
    ],
    'Selected Andean and northern Californian/Pacific settings. No common colonial experience, exact route for every object or unchanged Inka state in 1600 is inferred.',
    'Makers and Indigenous uses of imported material complicate elite and colonial narratives. The ship’s written record remains a mediated colonial perspective, supplemented by village archaeology.',
    ['inka-labor-context'],
    ['inca-weaving', 'manila-network'],
    'Does finding an imported fragment in a village prove that its residents used it as its makers intended?',
    'Describe the find context and any use traces first. Compare competing interpretations; origin establishes where it was made, not automatically how a later user understood it.',
    s(
      '1600 CE',
      'Around 1600 CE comes shortly after the San Agustín wreck of 1595, within an expanding Pacific colonial exchange system. Andean textile work also continued under colonial conditions. The selected 1450–1550 tunic and the later shipbuilding reports remain separately dated evidence.',
      ref('manila-tamal-huye-project', '1595 chronology'),
      ref('orientation-andean-textiles', 'Colonial continuation'),
      ref('met-313152', 'Date'),
    ),
  ),
  reading(
    2,
    'Africa',
    'Benin and Kongo: makers, translation and power',
    'How did African institutions shape objects made amid wider contacts?',
    [
      s(
        'Distinct courts and religious settings',
        'Benin’s court-supported craft production and Kongo’s changing Christian practices were different institutional histories. An ivory saltcellar and a brass crucifix preserve decisions about form and representation. Their foreign connections do not erase the agency of African makers, patrons or interpreters.',
        ref('benin-court-guilds', 'Royal craft guilds'),
        ref('kongo-christianity', 'Education, translation and uneven practice'),
        ref('met-309900', 'Attribution'),
        ref('met-318323', 'Description'),
      ),
      s(
        'Making and interpreting were skilled work',
        'The saltcellar’s carved support joins figures and a container in ivory. Kongo translation required discussion of meanings as well as words; the selected crucifix combines a Christian subject with a particular local composition. Neither object alone establishes how every resident understood the encounter.',
        ref('met-309900', 'Description'),
        ref('kongo-christianity', 'Translation and interpretation'),
        ref('kongo-interview', 'Reading of accession 1999.295.7'),
      ),
      s(
        'Connections included unequal power',
        'Court patronage controlled access to skilled production. The wider histories also include coercive exchange and enslavement, rather than a story of contact as equal benefit. The linked source-qualified accounts distinguish those relationships from the limited evidence supplied by one art object.',
        ref('benin-court-guilds', 'Court control and exchange'),
        ref(
          'afonso-letters-1526',
          '6 July and 18 October 1526: kidnapping, captives and proposed inspection',
        ),
      ),
      s(
        'Later texts are not evidence from the initial encounter',
        'Kongo’s Portuguese–Kikongo catechism of 1624 belongs well after the royal baptism of 1491 and after the 1600 snapshot. A broad sixteenth–seventeenth-century crucifix range is also not an exact production date. These clocks should remain separate.',
        ref('kongo-christianity', '1491 and 1624 chronology'),
        ref('met-318323', 'Date'),
      ),
    ],
    'Benin and Kongo are separate selected settings, not a single African court culture or a complete account of Atlantic slavery. Broad object dates do not establish a particular transaction in 1600.',
    'African makers, translators and patrons appear as participants with their own institutions. Elite objects still underrepresent many households and people subjected to coercion.',
    ['benin-court-context', 'kongo-christian-context'],
    ['benin-ivory', 'kongo-translation'],
    'Why should a later bilingual religious text not be treated as a transcript of an earlier conversion?',
    'Keep the text’s production date, purpose and translation work separate from the earlier episode. It can reveal later interpretation and teaching without reproducing the first encounter.',
    s(
      '1600 CE',
      'Around 1600 CE lies at the end of the selected Benin saltcellar’s approximate 1525–1600 range and within the broad date range of the Kongo crucifix. Neither is securely made in this exact year. The Kongo catechism of 1624 is a later comparison.',
      ref('met-309900', 'Date'),
      ref('met-318323', 'Date'),
      ref('kongo-christianity', '1624 catechism'),
    ),
  ),
  reading(
    3,
    'Europe',
    'Antwerp printing and later London experiments',
    'How did making and circulating records support new communities of inquiry?',
    [
      s(
        'A workshop left more than finished books',
        'The Plantin-Moretus complex in Antwerp preserves printing equipment, a library and business archives. These different records support questions about how books were made and circulated. The firm’s late-sixteenth-century work belonged to a wider European printing landscape that included Paris and Venice.',
        ref(
          'orientation-plantin',
          'Description: workshop, collections and printing centres',
        ),
      ),
      s(
        'A finished record depends on organized work',
        'Equipment and archives draw attention to production and coordination behind a printed page. The earlier Portuguese voyage reading offers a different record: a participant’s journal that later readers encounter through editing and translation. Neither a surviving press nor a printed travel account guarantees that every statement is correct.',
        ref('orientation-plantin', 'Description: equipment and archives'),
        ref('gama-journal-1898', 'Edition and translated voyage account'),
      ),
      s(
        'A later institution made checking a shared activity',
        'London’s Royal Society first met in 1660. Its account describes correspondence, observations, experiments and discussion, followed by publication. It also identifies early participants as exclusively male and drawn from professional and aristocratic groups. Organized inquiry was therefore a practice with restricted participation, not knowledge suddenly available on equal terms to everyone.',
        ref(
          'orientation-royal-society',
          'Early days: 1660 meeting, methods and membership',
        ),
      ),
    ],
    'A printing-house focus with a separately dated London comparison and an earlier travel-record destination. This is not a complete history of the Reformation, European science or all book readers.',
    'Workshop evidence makes production visible, while the Society’s own account identifies exclusions. Neither prominent founders nor surviving collections represent every contributor.',
    [],
    ['portuguese-voyage'],
    'Why does printing make a statement easier to circulate without proving it true?',
    'Separate production and distribution from verification. Ask who wrote the statement, what evidence supports it, how translation or editing changed it, and what another record could check.',
    s(
      '1600 CE',
      'Around 1600 CE belongs to the continuing Plantin-Moretus publishing enterprise, after Christophe Plantin’s death in 1589. The Royal Society’s first meeting in 1660 is later; it cannot be treated as an institution already operating at this snapshot.',
      ref('orientation-plantin', 'Plantin dates and firm continuation to 1867'),
      ref('orientation-royal-society', 'First meeting: 28 November 1660'),
    ),
  ),
  reading(
    4,
    'West/Central Asia',
    'Ottoman workshops, Bukhara books and a new Safavid capital',
    'Which kinds of work connected institutions without sharing one ruler or one chronology?',
    [
      s(
        'Several urban settings',
        'Ottoman production centres, Bukhara’s book and learning institutions, and Safavid Isfahan represent distinct settings. Isfahan’s late-sixteenth-century capital development took place within an older city. These histories overlap in time without forming one political system.',
        ref('ottoman-before', 'Production centres and foundations'),
        ref('bukhara-monuments', 'Madrasas and urban institutions'),
        ref('isfahan-capital', 'Isfahan as the Safavid Capital'),
      ),
      s(
        'Patronage depended on practical coordination',
        'A decorated document, a ceramic surface and a manuscript all required several tasks. Bukhara’s institutions also needed water and income; silk connected rural production with workshops and merchants. Naming a ruler or patron does not identify every maker or describe all working conditions.',
        ref('met-449533', 'Description'),
        ref('bukhara-irrigation-economy', 'Water supply'),
        ref('bukhara-juybari-endowments', 'Monuments and public works'),
        ref('safavid-silk', 'Production and weaving'),
      ),
      s(
        'New Julfa follows forced relocation',
        'Isfahan’s New Julfa history belongs to the forced movement of Armenian communities in the early seventeenth century. Commercial success in the later quarter cannot erase that coercion, and the quarter cannot be projected into the 1600 snapshot simply because Isfahan was already a capital.',
        ref('julfa-forced', 'Origin, settlement and population'),
        ref('isfahan-capital', 'Capital transfer'),
      ),
    ],
    'Selected Ottoman, Central Asian and Safavid urban histories. No uniform workshop, seamless trade route or exact political border is inferred; later Zand evidence belongs to another phase.',
    'Documents and commissions foreground patrons; water systems, material tasks and displacement add other relationships. Many workers’ names and experiences remain unrecorded.',
    [
      'ottoman-makers-markets-context',
      'bukhara-learning-water-work-context',
      'isfahan-julfa-households-context',
    ],
    ['ottoman-workshops', 'bukhara-books', 'isfahan-silk'],
    'Can a prosperous later trading quarter be used to describe the city before its inhabitants were relocated there?',
    'State the relocation and settlement dates first. Explain the later commercial institutions without backdating them or treating eventual prosperity as proof of voluntary migration.',
    s(
      '1600 CE',
      'Around 1600 CE follows Isfahan’s capital transfer of 1597–98 and overlaps selected Ottoman and Bukhara institutional histories. New Julfa’s early-seventeenth-century forced relocation and later merchant networks come afterward; they do not describe the quarter in 1600.',
      ref('isfahan-capital', 'Capital transfer'),
      ref('julfa-forced', 'Origin and settlement'),
      ref('bukhara-irrigation-economy', 'Shaibanid and Janid periods'),
    ),
  ),
  reading(
    5,
    'South Asia',
    'Mughal books, court residences and commercial connections',
    'How did a manuscript connect skilled people across languages and places?',
    [
      s(
        'Fatehpur Sikri, Lahore and a wider economy',
        'Akbar’s reign, 1556–1605, included a courtly manuscript workshop associated first with Fatehpur Sikri and then Lahore. Gujarat’s commercial centres added another setting within Mughal expansion. Court production was connected with a wider economy, without representing every household or region.',
        ref('mughal', 'Akbar, Gujarat and royal atelier paragraphs'),
      ),
      s(
        'A book was a collaborative object',
        'Painters, calligraphers, illuminators and binders performed distinct work. Translation made Sanskrit narratives available in Persian, while surviving records sometimes name contributors. A painting’s subject is not a record of a historical event, and a name attached to one manuscript cannot supply the maker of another.',
        ref('mughal-workshops-va', 'House of Books; Harivamsa'),
        ref('mughal-razmnama-copy', 'Title and Scope & Content'),
        ref('met-448183', 'Description'),
      ),
      s(
        'The court moved; the evidence has several dates',
        'Fatehpur Sikri’s main building programme preceded the move to Lahore in 1585 described by the museum. The selected manuscript page has its own catalogue range. A reign, a court residence, a translation project and a surviving copy therefore cannot share a single automatic date.',
        ref('mughal', 'Fatehpur Sikri 1571–1585 and Lahore'),
        ref('met-448183', 'Date'),
      ),
    ],
    'A justified focus on court book production across named residences, with Gujarat as a commercial context. It does not establish an agrarian census, universal literacy or the experience of every South Asian community.',
    'Named contributors help reveal collaboration beside royal patronage. Sources remain strongest for elite commissions and weaker for most producers and readers outside the court.',
    ['mughal-books-workshop-context'],
    ['mughal-books'],
    'Why should a translated story, its illustrated copy and a ruler’s reign receive separate dates?',
    'Identify the event or process each date describes. Translation, copying and illustration can happen at different times, and a reign only supplies an outer political frame.',
    s(
      '1600 CE',
      'Around 1600 CE falls near the end of Akbar’s reign of 1556–1605. The workshop history includes earlier work at Fatehpur Sikri and Lahore, but the selected page must retain its own catalogue range. Neither residence nor every illustrated book is dated simply by the reign.',
      ref('mughal', 'Akbar reign and workshop sequence'),
      ref('met-448183', 'Date'),
    ),
  ),
  reading(
    6,
    'East Asia',
    'Ming workshops and Momoyama Japan',
    'How did objects express authority while their makers worked within different institutions?',
    [
      s(
        'Separate production settings',
        'Ming ceramic production involved court orders as well as other buyers. In Japan, the Momoyama account connects decorated castles and objects with competing warlords and changing power. These were distinct settings, not one East Asian style or shared government.',
        ref('ming', 'Bureau of Design'),
        ref('ming-npm-production', 'Official production and supervision'),
        ref('orientation-momoyama', 'Political setting and decorated fortresses'),
      ),
      s(
        'A design still needed material work',
        'The selected Ming jar combines decoration below and above the glaze. Shaping, firing and surface work required coordinated skill. Japanese castle decoration and furnishings expressed another relationship between patrons and makers; visual splendour alone does not tell us the worker’s freedom or income.',
        ref('met-42549', 'Medium and supplied image'),
        ref('ming-workshop-texts-2013', 'Printed p 12: preparation'),
        ref('orientation-momoyama', 'Decoration, furnishings and garments'),
      ),
      s(
        'War and exchange were not opposites',
        'The museum’s Momoyama account describes continuing connections with China and Korea alongside Hideyoshi’s destructive invasions of Korea. It is therefore misleading to tell the period only through imported goods or artistic achievement. Later Tokugawa and Qing settings belong to subsequent political phases, not an unchanging 1600 map.',
        ref('orientation-momoyama', 'Final paragraph: invasions and overseas contacts'),
        ref('ming', '1368–1644 frame'),
      ),
    ],
    'Selected Chinese and Japanese production/patronage settings. The museum’s art-period convention 1573–1615 does not define every political transition; no total-isolation claim or uniformly beneficial exchange is adopted.',
    'Court and elite collections favour commissioned objects. The account keeps destructive war visible and does not infer ordinary experience from luxury surfaces.',
    ['ming-kilns-markets-context'],
    ['ming-workshops'],
    'Why should an account of artistic exchange also examine war and coercion?',
    'Ask how people, materials and techniques moved, and who bore the costs. A beautiful object does not establish voluntary movement or benefit for all participants.',
    s(
      '1600 CE',
      'Around 1600 CE falls within Ming rule and the museum’s Momoyama art-period frame in Japan. The selected Ming object has its own date; later Qing and Tokugawa institutions should not be imported into the snapshot as though their full later arrangements already existed.',
      ref('ming', '1368–1644 chronology'),
      ref('orientation-momoyama', '1573–1615 frame and political setting'),
      ref('met-42549', 'Date'),
    ),
  ),
  reading(
    7,
    'Southeast Asia/Oceania',
    'Banda and Manila: exchange, provision and coercion',
    'When does a trading relationship become an attempt to control people and food?',
    [
      s(
        'Two maritime settings',
        'Banda’s spice exchange connected island production with imported food. The Manila system linked Philippine and American settings through Pacific voyages. These networks involved different local communities and institutions; a map of moving goods cannot by itself explain their working conditions.',
        ref('banda-archive', 'Handel; Samenleving'),
        ref('galleon', 'Trade and cargo account'),
      ),
      s(
        'The first visit was not the later conquest',
        'The Westfries Museum account dates the first Dutch visit to Banda to 1599, before the VOC existed. It describes purchases and port fees before later treaty claims and violence. Keeping that sequence visible prevents the events of 1621 from replacing the islands’ earlier social and commercial history.',
        ref(
          'banda-pala-1621',
          'Opening 1599 visit; 1602 alliance and later escalation',
        ),
      ),
      s(
        'Control over trade could become control over survival',
        'The archive explains why restricting exchange endangered Banda’s food supply. Its 1621 records concern removal, destruction and coercion. The Manila shipbuilding accounts separately describe burdens on Philippine communities. Neither should be turned into a neutral story of efficient global connection.',
        ref('banda-archive', 'Handel; Genocide'),
        ref('manila-shipbuilding-1618-1619', 'Fajardo and Pineda labour accounts'),
      ),
      s(
        'A Pacific comparison needs its own record',
        'The 1595 San Agustín wreck in Coast Miwok territory supplies a particular Pacific encounter. It is not evidence of a Banda–California voyage or a history of all Oceanian islands. The two maritime inquiries remain separate even when they share questions about provisions and work.',
        ref('manila-tamal-huye-project', '1595 wreck and village evidence'),
      ),
    ],
    'Banda and the Philippine–American Pacific system, with no invented continuous route between them. The reading does not claim coverage of every Oceanian society or backdate VOC conquest to 1600.',
    'Colonial records dominate the archive and are read for their perspective. Bandanese communities and Philippine workers appear through different, uneven records rather than as anonymous cargo-route endpoints.',
    ['banda-food-displacement-context'],
    ['banda-1621', 'manila-network'],
    'Why is it misleading to label a 1599 encounter as the 1621 conquest?',
    'Keep initial purchases, subsequent coercive claims and the later conquest separately dated. Explain change over time without assuming that the first encounter already contained every later institution.',
    s(
      '1600 CE',
      'Around 1600 CE follows the first Dutch visit to Banda in 1599 and the San Agustín wreck in 1595. The VOC’s later creation and Banda conquest of 1621 have not yet occurred. This earlier exchange setting is independently described rather than produced by extending the 1621 case backward.',
      ref('banda-pala-1621', '1599 visit before VOC foundation'),
      ref('manila-tamal-huye-project', '1595 chronology'),
    ),
  ),
];
export function applyC7Orientations(corpus: Corpus) {
  const sources: Omit<Corpus['sources'][number], 'accessed'>[] = [
    {
      id: 'orientation-andean-textiles',
      title: 'Andean Textiles',
      institution: 'The Metropolitan Museum of Art',
      author: 'Julia McHugh',
      published: '2020-06',
      type: 'scholarship',
      url: 'https://www.metmuseum.org/es/essays/andean-textiles',
      scope:
        'English final colonial-period paragraphs consulted: continued Indigenous techniques, new motifs and commissions. Exact colonial object dates remain separate; first-art-form, universal sacredness and inferred evasion of clothing restrictions not adopted. No image reuse.',
    },
    {
      id: 'orientation-plantin',
      title: 'Plantin-Moretus House-Workshops-Museum Complex',
      institution: 'UNESCO World Heritage Centre',
      type: 'archaeology',
      url: 'https://whc.unesco.org/en/list/1185/',
      scope:
        'English Description: Antwerp printing enterprise, equipment/library/archives, Plantin death 1589 and continued firm activity until 1867. No greatest/most-prolific ranking, complete archive consultation or image reuse.',
    },
    {
      id: 'orientation-royal-society',
      title: 'History of the Royal Society',
      institution: 'The Royal Society',
      type: 'primary',
      url: 'https://royalsociety.org/about-us/history/',
      scope:
        'Institutional history sections on origins and early days: first meeting 28 November 1660, correspondence/experiments/publication, membership restrictions, Oldenburg and Hooke. Not a complete independent institutional history or claim of universal access; no image reuse.',
    },
    {
      id: 'orientation-momoyama',
      title: 'Momoyama Period (1573–1615)',
      institution: 'The Metropolitan Museum of Art',
      type: 'scholarship',
      url: 'https://www.metmuseum.org/essays/momoyama-period-1573-1615',
      scope:
        'Political setting, decoration/patronage and final overseas-contacts/invasions paragraph. Art-period convention kept separate from political events; total peace, universal class participation and beneficial-exchange claims not adopted. No source image reuse.',
    },
  ];
  corpus.sources.push(
    ...sources.map((source) => ({ ...source, accessed: '2026-11-04' })),
  );
  for (const [id, scope] of [
    [
      'mughal',
      'Selected Akbar 1556–1605, Gujarat, Fatehpur Sikri 1571–1585 and Lahore atelier paragraphs reconsulted; no universal inclusion or one date for every manuscript.',
    ],
    [
      'ming',
      'Title chronology and Bureau of Design paragraph reconsulted; no object dates inferred from dynasty alone.',
    ],
    [
      'banda-archive',
      'Handel, Samenleving, 1599 arrival and selected later coercion paragraphs reconsulted in Dutch; no entire archive consultation, translated primary manuscript or new population total claimed.',
    ],
    [
      'banda-pala-1621',
      'Opening 1599 first visit before VOC, 1602 alliance and subsequent treaty-escalation paragraphs reconsulted; no conquest in 1600.',
    ],
    [
      'manila-tamal-huye-project',
      'Project introduction, 1595 wreck and village-material paragraphs reconsulted; no voyage from Banda or precise later use of each fragment established.',
    ],
  ] as const) {
    addSourceConsultation(
      corpus,
      id,
      '2026-11-04',
      `Additional consultation 4 November: ${scope}`,
    );
  }
  (corpus.orientations ??= []).push(...structuredClone(c7Orientations));
}
