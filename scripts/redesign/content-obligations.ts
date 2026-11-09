import type {
  Corpus,
  Subject,
  Source,
  HistoricalContext,
  Journey,
} from '../../src/atlas/model';
import { cite, interval, sec } from './content-helpers';
import { obligationMedia } from './obligations-media';
import { applyObligationPlaces } from './obligations-places';
const consulted = '2026-10-28';
const source = (
  id: string,
  title: string,
  institution: string,
  url: string,
  type: Source['type'],
  scope: string,
  author = institution,
  published?: string,
): Source => ({
  id,
  title,
  institution,
  url,
  type,
  scope,
  author,
  published,
  accessed: consulted,
});
const sources: Source[] = [
  source(
    'song-crop-loans',
    'Memorial on the Crop Loans Measure, 1069: selected translation',
    'Columbia University, Asia for Educators; Sources of Chinese Tradition',
    'https://afe.easia.columbia.edu/main_pop/ps/ps_china-wang-anshi-crop-loans.htm',
    'primary',
    'Short and longer selections, editorial conclusion and translation attribution read. The longer selection dates the fiscal commission memorial to 1069; this date is used without adopting the introduction’s appointment chronology. English translation from de Bary and Bloom, 2nd ed., vol. 1 (1999), pp. 617–618, not the Chinese original or full book. Policy justification and reported adoption do not measure voluntary participation, debt or harvest outcomes. No translation or source figure reproduced.',
    'Wang Anshi / fiscal administration commission; English selection edited by Wm. Theodore de Bary and Irene Bloom',
    '1069; English edition 1999',
  ),
  source(
    'song-markets',
    'The Song Dynasty in China: Commercialization',
    'Columbia University, Asia for Educators',
    'https://afe.easia.columbia.edu/songdynasty-module/econ-rev-commercial.html',
    'scholarship',
    'Main commercialization page read, including Robert Hymes excerpt, market/guild, cash-crop and water-transport passages. Selected teaching synthesis, not a household dataset or the full 1997 course. The Marco Polo passage concerns the Yuan period and is not adopted as Song traffic evidence. No universal prosperity, world ranking, market volume or scroll image is adopted.',
    'Asia for Educators; includes Robert Hymes, 1997 course excerpt',
  ),
  source(
    'song-governance',
    'Structures of Governance in Song Dynasty China, 960–1279 CE: introduction excerpt',
    'Cambridge University Press & Assessment',
    'https://assets.cambridge.org/97810092/35594/excerpt/9781009235594_excerpt.pdf',
    'scholarship',
    'Publisher’s ten-page excerpt available; introduction pp. 1–8 read through the opening political-economy discussion. Not the full monograph. Hartman argues against limiting government to an emperor and elite literati, emphasizing clerks, military institutions, taxation and competing historical narratives. His interpretive model is attributed, not presented as scholarly consensus. Revenue percentages and claims of a world-first fiscal state are not adopted; no source illustration reproduced.',
    'Charles Hartman',
  ),
  source(
    'caravans-fragments',
    'Caravans of Gold, Fragments in Time: An Introduction',
    'Princeton University Press / The Block Museum of Art',
    'https://assets.press.princeton.edu/chapters/s14202.pdf',
    'scholarship',
    'Fifteen-page publisher chapter excerpt available; printed pp. 23–30 read, particularly pp. 26–29 on domestic ceramics, local/interregional work, fragmented evidence and slavery. Not the entire exhibition book or excavation reports. The foreign map’s wealth language is attributed, not a measured ranking. No gold tonnage, population estimate or precise empire boundary adopted. No copyrighted chapter figures reproduced.',
    'Kathleen Bickford Berzock',
    '2019',
  ),
  source(
    'catalan-musa-detail',
    'Catalan Atlas: supplied detail depicting Mansa Musa; image and rights record',
    'Wikimedia Commons; Bibliothèque nationale de France, MS Espagnol 30',
    'https://commons.wikimedia.org/wiki/File:Catalan_Atlas_BNF_Sheet_6_Mansa_Musa.jpg',
    'archive',
    'Original 3712×2647 JPEG downloaded and visually inspected. The file is already a detail of the atlas, not the complete panel. Commons attributes Abraham Cresques and conventional 1375 date; attribution retained as uncertain. Record marks a faithful reproduction of public-domain two-dimensional art with PD-Art / Public Domain Mark 1.0, with jurisdiction caveat. BnF/Gallica original catalogue fetch returned 403; no full catalogue consultation or global CC0 grant claimed. Derivatives only resize and encode the supplied detail, with no further crop, retouch or invented legibility.',
    'Attributed to Abraham Cresques; BnF / Gallica digital reproduction',
  ),
  source(
    'catalan-block',
    'Atlas of Maritime Charts (The Catalan Atlas), object 26',
    'The Block Museum of Art, Northwestern University, Caravans of Gold',
    'https://caravans.library.northwestern.edu/works/26/',
    'catalogue',
    'Complete short object page read. Attribution is Abraham Cresques (?) and the commission is qualified as possible. Used for Majorcan production, conventional 1375 date, foreign court audience and the interpretation of royal gold imagery. Translated wealth caption is paraphrased as the map’s claim; neither a portrait made from life nor an audited fortune is asserted. Physical panel dimensions are not transferred to the supplied image detail.',
  ),
  source(
    'inka-labor',
    'Building the Road: Mit’a and Ayni—Labor and Reciprocity',
    'Smithsonian National Museum of the American Indian',
    'https://americanindian.si.edu/inkaroad/inkauniverse/inkaroadexpansion/building-road.html',
    'scholarship',
    'Building-the-road page and Mit’a/Ayni paragraphs read as a public exhibition synthesis. Used for rotating state labor, roads and provisioning in a reciprocal idiom. Universal language about every household and balanced exchange is not adopted as a measured outcome. No identical work term, universal consent or assurance of welfare inferred. No image, audio or original chronicler text reproduced.',
  ),
  source(
    'inka-road-users',
    'Who used the Inka Road?',
    'Smithsonian National Museum of the American Indian',
    'https://americanindian.si.edu/inkaroad/engineering/question/who-used-inka-road.html',
    'scholarship',
    'Complete short text read: official travelers, messengers, work parties and permission for ordinary travelers. A statement of regulated access is not proof that all actual movement was controlled. No traffic count or road-length total adopted.',
  ),
  source(
    'inka-colcas',
    'Colcas: transcript with Jorge Flores Ochoa and Ramiro Matos',
    'Smithsonian National Museum of the American Indian',
    'https://americanindian.si.edu/inkaroad/engineering/video/colcas.html',
    'scholarship',
    'Displayed transcript read, not video watched. Flores Ochoa and Matos discuss storage of food, textiles, tools and weapons and collection/redistribution. Their explanation is not a census of stores or a guarantee that everyone was happy or protected from hunger. No source frame copied.',
    'Jorge Flores Ochoa and Ramiro Matos',
  ),
  source(
    'inka-regional',
    'Inka: environment, economy, art and history',
    'Museo Chileno de Arte Precolombino',
    'https://museo.precolombino.cl/aprende/pueblos-culturas/culturas-precolombinas/andes-centrales/inka/',
    'scholarship',
    'Spanish environment, economy, art, social-organization and settlement sections read. Used for Cusco, regional ecologies, rotating labor and local versions of imperial forms. Simplified equal three-part divisions, population totals, categorical social labels and uniform imperial policy are not adopted. This is a museum synthesis, not the original local records or a fresh translation of chronicles.',
  ),
  source(
    'guaman-poma-context',
    'Chronicle of Guaman Poma: manuscript introduction',
    'Royal Danish Library',
    'https://www.kb.dk/en/find-materials/collections/manuscript-collection/chronicle-guaman-poma',
    'archive',
    'Library’s indexed English manuscript introduction read; subsequent direct fetch timed out. Describes an Indigenous author’s colonial critique and reform proposals addressed to Felipe III, manuscript in Spanish with Quechua passages. Not a reading of all 1,200 manuscript pages, a new translation or direct observation of preconquest life. NMAI’s separate displayed Guaman Poma captions and Crayla Alfaro transcript were also consulted for orientation; no manuscript drawing is reproduced.',
    'Royal Danish Library; manuscript by Felipe Guaman Poma de Ayala',
  ),
  source(
    'yanawilka-food',
    'Food and Labour under Imperial Rule: Unravelling the Food Landscape of Transplanted Workers (mitmaqkuna) in the Inka Empire',
    'Cambridge Archaeological Journal 35(1), 207–226',
    'https://doi.org/10.1017/S0959774324000258',
    'archaeology',
    'Original article HTML read in selected sections: abstract, introduction/social categories, local landscape, methods, results opening, and discussion/conclusions. Four domestic structures and 53 stone tools; nine tools were analysed twice, not nine extra independent tools. Starch evidence and potential contamination are explicit. Authors distinguish rotating mit’a from resettled mitmaqkuna; non-local foods do not establish one route or free travel. Supplemental data and figures were not independently reanalysed or reproduced. The selected Met tunic is not from this excavation.',
    'Di Hu, Víctor Felix Vásquez Sánchez, Teresa Esperanza Rosales Tham, Katherine L. Chiou, Rob Cuthrell and Kylie E. Quave',
    'Online 13 November 2024; journal issue February 2025',
  ),
];
const review = (limitations: string[]): Subject['review'] => ({
  consultedOn: consulted,
  reviewer:
    'Codex source consultation and self-review; not independent historian approval',
  scope:
    'Bounded C6 account with main/deeper/evidence reading, family entry, phased context, sourced place study and inspected/modern media.',
  limitations,
});
function song(s: Subject) {
  s.contextIds = ['song-institutions-context'];
  s.summary =
    'Song institutions joined court service, commercial activity and skilled production. A tea bowl makes material work visible; a proposal about crop loans exposes a different relationship between officials and farming households. Neither stands for everyone’s experience. Northern and Southern Song had different capital settings, while neighboring states and changing borders prevent a single unchanging picture of China.';
  s.sections = [
    sec(
      'A bowl begins with work, rather than a dynasty label',
      'This Jian-ware bowl is stoneware with a dark, streaked glaze conventionally called hare’s fur. Its catalogue date is the eleventh–twelfth century, a range spanning more than one political phase. Forming a vessel and controlling its fired surface required practical skill. The photograph shows a finished object; it does not identify its potter, fuel supply, purchaser or a shipment to the capital. A name for a ware is not a complete workshop history.',
      cite('met-42455', 'Artwork details, accession 91.1.226 and supplied image'),
    ),
    sec(
      'Market exchange depended on other people’s tasks',
      'The Columbia teaching account describes markets spreading through cities and the countryside, specialized producers and water transport for bulky goods such as grain. Growing for sale linked a household’s choices to buyers and prices. Boats still needed loading, routes and provisioning. Commercial activity therefore involved several kinds of work, beyond making a fine bowl. The presence of markets does not by itself establish that every cultivator became wealthier or had equal bargaining power.',
      cite(
        'song-markets',
        'Robert Hymes excerpt; grain transport and cash-cropping passages',
      ),
    ),
    sec(
      'A proposal tried to alter the timing of debt',
      'In the 1069 crop-loan memorial, the fiscal commission proposed using public reserves to lend before harvest and accept repayment with later tax instalments. It also described buying grain when prices were low and selling when high to moderate price swings. For a household, receiving resources before a crop was ready could matter as much as an annual total. This is the policy’s stated rationale. Whether officials made borrowing voluntary, and how repayment worked after poor harvests, require evidence beyond the proposal.',
      cite(
        'song-crop-loans',
        'Longer selection: 1069 memorial, reserves, loans and repayment',
      ),
    ),
    sec(
      'Court culture did not exhaust government',
      'The Met essay contrasts imperial painting patronage with scholar-official expression. Such cultural differences help explain competing ideals, but offices also collected taxes, kept records and provisioned military forces. Hartman argues that accounts focused only on elite literati leave other political workers out. Read the bowl, a court ideal and a fiscal proposal together without making them interchangeable evidence. A ceramic surface cannot tell us whether a named loan was repaid.',
      cite('song', 'Painting academy and scholar-official paragraphs'),
      cite(
        'song-governance',
        'Introduction pp. 3–5: political actors and fiscal/military work',
      ),
    ),
    sec(
      'The southern court belongs to a later phase',
      'The conventional Northern Song frame ends in 1127, when the court lost its northern capital to the Jurchen Jin. Southern Song government was centered at Hangzhou; it ended with the Mongol conquest in 1279. These transitions changed political geography. They did not make a bowl’s broad date exact or turn the whole region into one uninterrupted jurisdiction.',
      cite('song-phases', 'Chronology: 1125–1234 entry and Northern/Southern frames'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Follow a reserve through the proposed cycle',
      'The memorial joins three things often separated in a summary: grain stocks, cash and the timing of tax collection. Loans used reserves to address a seasonal shortage, then brought repayment into an official collection cycle. It also allowed delay after disaster. The diagram maps these proposed relationships, not a measured flow of grain or money. A government’s justification explains why its authors wanted a measure adopted. Local accounts, petitions and disputes would test what a particular household actually faced.',
      cite(
        'song-crop-loans',
        'Longer selection: kinds of reserves, tax instalments and disaster deferral',
      ),
    ),
    sec(
      'A capital move does not date a ceramic',
      'Keep the dynasty’s phase labels separate from the object’s range. The catalogue’s eleventh–twelfth-century description remains useful even without assigning the bowl to one side of 1127. Kaifeng and Hangzhou are approximate capital-area locators; neither point is the bowl’s documented findspot or production kiln. Nor does selecting a year on the atlas narrow the museum’s date. This distinction allows a material investigation to sit within a longer political account without supplying missing provenance.',
      cite('met-42455', 'Date and medium'),
      cite('song-phases', 'Northern/Southern Song and Hangzhou'),
    ),
    sec(
      'Who appears in a history of government?',
      'Hartman’s introduction reviews sharply different modern interpretations of Song governance. His own argument broadens attention to clerks and military officials, as well as the monarch and literati. This is an interpretive intervention, not a settled vote among historians. It prompts a practical question: whose work disappears when the surviving voices belong mostly to highly educated officials? A household budget or a clerk’s register could answer questions that a painting or policy defense leaves open.',
      cite(
        'song-governance',
        'Introduction pp. 1–5: contending interpretations and political participation',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'Distinguish a proposal, an object and an interpretation',
    introduction:
      'The sources do different jobs. None supplies a census of ordinary experience.',
    items: [
      {
        label: 'A seasonal policy',
        text: 'The 1069 memorial proposes lending before harvest and repayment with later tax collections.',
        interpretation:
          'This explains intended timing, not the observed debt or consent of every household.',
        citations: [cite('song-crop-loans', 'Longer selection')],
      },
      {
        label: 'A finished surface',
        text: 'The Met identifies stoneware with hare’s-fur glaze and an eleventh–twelfth-century range.',
        interpretation:
          'Material and date attribution do not identify the maker, buyer or loan used to make it.',
        citations: [cite('met-42455', 'Artwork details')],
      },
      {
        label: 'A modern historical argument',
        text: 'Hartman challenges a political history limited to emperor and literati.',
        interpretation:
          'An attributed interpretation helps frame questions without becoming a contemporary Song witness.',
        citations: [cite('song-governance', 'Introduction pp. 3–5')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Put a harvest between borrowing and repayment',
    duration: 'About 5 minutes',
    steps: [
      'Trace the diagram from reserves to a household before harvest.',
      'Place an imaginary harvest between receiving and repaying. Explain why that timing could matter.',
      'Name one thing you would ask a farmer before deciding whether the proposed loan helped.',
    ],
    explanation:
      'The diagram explains a proposal. A farmer’s experience of choice, harvest and collection could test its promises.',
  };
  s.dimensions.obligation = {
    text: 'A fiscal proposal would connect reserves, household seasonal need and tax collection. Its language of benefit needs testing against actual borrowing, repayment and official practice.',
    citations: [cite('song-crop-loans', 'Longer selection')],
  };
  s.review = review([
    'No local crop-loan registers, household budgets, original Chinese consultation or independent assessment of implementation.',
    'The bowl’s maker, kiln, customer and journey remain unknown. The Met chronology’s erroneous Huizong/Mongol sentence is not adopted; its Jurchen/Jin entry supplies the distinct 1127 phase.',
    'Wider rural, gender, military and neighboring-state histories remain selective.',
  ]);
}
function mali(s: Subject) {
  // The pilgrimage source does not support the separate foreign-image claim.
  s.claims
    .find((claim) => claim.id === 'mali-networks-checked')!
    .citations.push(
      cite('catalan-block', 'Object 26: possible commission and royal imagery'),
    );
  s.contextIds = ['mali-networks-context'];
  s.summary =
    'Mali’s rulers depended on a landscape of farming, fishing, making and exchange. The resources displayed by a court came through many people’s work. Oral histories, excavated fragments and foreign depictions preserve different parts of that world. Mansa Musa’s pilgrimage is one dated episode within changing political networks, not the origin of West African urban life or its only important story.';
  s.sections = [
    sec(
      'Begin below the royal throne',
      'The supplied atlas detail makes a seated ruler and a gold-colored object prominent. Ordinary work is largely absent. Berzock’s archaeological synthesis instead describes unglazed pots used for cooking, storing food and carrying commodities such as grain and fish. Iron tools, metalworking and regional exchange supported daily life. A rare imported fragment is striking, but the common broken vessel can be more direct evidence of repeated household tasks. Neither should be discarded because it lacks a royal name.',
      cite('catalan-musa-detail', 'Inspected supplied detail'),
      cite('caravans-fragments', 'Printed pp. 26–29: domestic ceramics and materials'),
    ),
    sec(
      'Cities had histories before this empire',
      'Jenne-jeno developed long before the conventional Mali frame. Archaeology identifies a diverse urban population and specialized work without an obvious royal palace at its center. This challenges a story in which urban life arrived only with foreign traders or a named conquering king. It does not establish one uniform political system across all places later associated with Mali. A settlement’s local organization and an empire’s wider claims operate at different scales.',
      cite('sahel', 'Ancient Mali and Middle Niger Civilization; Archaeology'),
    ),
    sec(
      'Exchange required relationships and could impose violence',
      'River-basin production and pastoral movement linked different environments. Saharan exchange added longer connections, including salt, cloth, metals and gold. Muslim merchants and scholars participated in relationships that also crossed religious differences. These were not exclusively equal or voluntary exchanges: enslaved people were transported through the same wider networks. Goods circulating and rulers prospering do not establish the security or freedom of all those doing the work.',
      cite('sahel', 'Introduction; Trade and Islam'),
      cite(
        'caravans-fragments',
        'Printed pp. 27–28: accounts, slavery and material evidence',
      ),
    ),
    sec(
      'A pilgrimage and a later map have separate dates',
      'Mansa Musa passed through Cairo on pilgrimage in 1324. The atlas, conventionally dated about 1375 and attributed to Abraham Cresques, was made in Majorca. It presents him with a crown, a throne and gold. Those signs make wealth and rulership legible to a foreign court audience. They are not a portrait made from life, an inventory of his treasury or a neutral map of political boundaries. The image tells us how news of Mali could be selected and pictured elsewhere.',
      cite('sahel', 'Islam: 1324 pilgrimage'),
      cite('catalan-block', 'Object 26 attribution, audience and imagery'),
      cite('sahel-visual', 'Malian Emperor Mansa Musa section'),
    ),
    sec(
      'Remembering also involved living work',
      'Mande jeliw have carried genealogies, praise and Sunjata narratives through performance. These living traditions changed with audiences and circumstances. They should not be treated as a single frozen transcript of the thirteenth century, or dismissed because they are oral. Compare their purposes with foreign accounts and archaeological contexts before deciding what a particular claim can establish.',
      cite('sahel', 'Epics'),
      cite('caravans-fragments', 'Printed p. 27: written/oral accounts and fragments'),
    ),
  ];
  s.deeperReading = [
    sec(
      'An atlas is a made argument about the world',
      'The supplied image is already a detail, not the whole atlas panel. Its larger ruler, gold, place signs and intersecting lines invite attention to particular resources and powers. Ask who made that selection and who could read it. The Block catalogue qualifies both the Cresques attribution and a possible royal commission. Keeping those qualifications does not make the image unusable: it makes an interpretation more precise. The accompanying text’s claim of extraordinary wealth belongs to the map, not to an audited modern ranking.',
      cite('catalan-block', 'Object 26'),
      cite('catalan-musa-detail', 'File description and original image'),
      cite('sahel-visual', 'Foreign visual language, Mansa Musa section'),
    ),
    sec(
      'Context changes what a fragment can say',
      'A pot fragment with a documented excavation context can connect material, use and date. An object removed without a record loses part of that relationship. Berzock’s chapter places common wares alongside rare imports to avoid making distant commerce the whole economy. This does not let us assign every sherd to a Mali royal workshop. A regional archaeological assemblage and a named ruler’s reign must be joined by evidence, rather than by sharing a place on a modern map.',
      cite(
        'caravans-fragments',
        'Printed pp. 27–29: fragmented sources and ceramic assemblages',
      ),
    ),
    sec(
      'A broad interval contains uneven changes',
      'The case keeps its approximate 1230–1600 exhibition frame. It does not announce an exact foundation or sudden extinction. The rise of Songhay overlapped later Mali histories; every settlement did not change allegiance on a single year. Likewise, the Met’s exhibition labels Musa’s passage through Cairo in 1324, while its later interview describes the pilgrimage as 1325. Here 1324 remains the Cairo anchor; the source wording difference stays documented rather than silently replacing the original case date.',
      cite('sahel', 'Introduction, Islam and Songhay sections'),
      cite('sahel-visual', 'Malian Emperor Mansa Musa section'),
    ),
  ];
  s.evidenceReading = {
    title: 'Look for the people missing from the royal image',
    introduction:
      'A foreign depiction, living narratives and excavated material are compared without making one erase the others.',
    items: [
      {
        label: 'Crown and gold',
        text: 'The supplied detail gives the seated ruler a crown, staff and gold-colored round object.',
        interpretation:
          'These are visible devices of royal representation, not measurements of personal wealth.',
        citations: [
          cite('catalan-musa-detail', 'Inspected image'),
          cite('catalan-block', 'Interpretation'),
        ],
      },
      {
        label: 'Pots and food',
        text: 'Berzock discusses unglazed vessels used in household and regional provisioning.',
        interpretation:
          'Common material helps recover ordinary work. No particular potter or royal order is identified by the atlas.',
        citations: [cite('caravans-fragments', 'Printed pp. 26–29')],
      },
      {
        label: 'A performed past',
        text: 'The museum account describes jeliw and continuing Sunjata performances.',
        interpretation:
          'A living tradition has its own contexts and purposes; this dossier does not claim to have heard or translated a particular performance.',
        citations: [cite('sahel', 'Epics')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Find three signs, then supply a missing task',
    duration: 'About 5 minutes',
    steps: [
      'In the supplied map detail, find the crown, staff and gold-colored round object.',
      'Read about food vessels. Name one task that supported life but is absent from the royal image.',
      'Finish two sentences: “The image shows…” and “To learn about the worker I would need…”.',
    ],
    explanation:
      'The map makes a ruler visible. Its omissions invite another source, rather than proving that ordinary work was unimportant.',
  };
  s.dimensions.obligation = {
    text: 'Royal wealth and wider exchange rested on productive work and unequal relationships. A foreign royal image is weak evidence for particular household obligations; archaeology and accounts must supply different tests.',
    citations: [
      cite('caravans-fragments', 'Printed pp. 26–29'),
      cite('catalan-block', 'Object 26'),
    ],
  };
  s.review = review([
    'No newly consulted jeli performance, original Arabic account or complete excavation report; local institutions and ordinary producers remain unevenly represented.',
    'BnF/Gallica catalogue access was blocked. Public-domain reproduction statement comes from the inspected Commons record, with jurisdiction caveat; no full panel or newly recovered text claimed.',
    'Approximate political chronology and pilgrimage source wording differences are retained; no exact boundary, audited wealth ranking or universal centralized administration.',
  ]);
}
function inka(s: Subject) {
  s.contextIds = ['inka-labor-context'];
  s.summary =
    'An Inca-attributed tunic joins skilled textile work to a larger question: how did households, specialists and state demands fit together? The finished garment and its broad date do not identify a worker’s obligations. Roads, stores, later accounts and household archaeology provide other evidence. They also expose differences between what authorities claimed, what people supplied and what particular communities could do.';
  s.sections = [
    sec(
      'Start with the garment’s construction',
      'The Met describes two woven pieces sewn together, camelid hair, striped areas and a jagged design. It interprets parts of that design as added by needle darning rather than woven into the structure. Making cloth involved several decisions and skills, not decoration alone. The catalogue compares highland techniques with central-coast traditions. This is an attribution based on features; it does not provide the maker’s name, an exact findspot or the garment’s recorded path between regions.',
      cite('met-313152', 'Description and artwork details, accession 1979.206.954'),
    ),
    sec(
      'Work could be demanded in different ways',
      'Museum accounts explain mit’a as rotating labor required by the state. Agricultural work, road building and military tasks drew on people whose households also needed continuing care and production. Textile work could involve domestic makers and specialists; an obligation should not be imagined as the same job for everyone. The conceptual diagram separates household work, state demands and provisioning. It does not identify which arrangement produced this particular tunic.',
      cite('inka-labor', 'Mit’a and Ayni'),
      cite('inka-regional', 'Economía, Arte and Organización Social'),
    ),
    sec(
      'Roads and stores joined movement to authority',
      'NMAI describes official travelers, messengers and work parties using the roads, with ordinary travelers requiring permission. Flores Ochoa and Matos explain stores holding food and textiles as well as tools and weapons. Collecting, keeping and distributing supplies required continuing labor. Such arrangements could support workers and military forces while concentrating control. An institutional explanation is not proof that all households consented, received equal returns or avoided hunger.',
      cite('inka-road-users', 'Who used the Inka Road?'),
      cite('inka-colcas', 'Displayed transcript'),
    ),
    sec(
      'Household evidence complicates a total-control story',
      'At Yanawilka, a settlement of resettled laborers near Vilcashuamán, researchers studied starch on stone tools from four domestic structures. Their results include foods that could not all have grown locally. These traces indicate wider food connections even in an area of strong state presence. The authors leave open whether some foods moved through direct exchange or controlled traffic. This is a particular archaeological study, not the selected tunic’s excavation or a diet for every Inca subject.',
      cite('yanawilka-food', 'Methods; Discussion and conclusions'),
    ),
    sec(
      'The object range crosses a political rupture',
      'The tunic’s 1450–1550 catalogue range extends across the Spanish invasion. It remains an object date, rather than the empire’s full lifespan or an exact production year. Later Indigenous criticism also matters: Guaman Poma’s manuscript addressed colonial exploitation and proposed reform. Its early-seventeenth-century perspective cannot be relabeled an eyewitness account of every preconquest textile workshop.',
      cite('met-313152', 'Date'),
      cite('guaman-poma-context', 'Library manuscript introduction'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Rotating service and resettlement are different',
      'The Yanawilka study distinguishes mit’a, involving turns of service, from mitmaqkuna, communities resettled away from ancestral homes. Both could support imperial goals, but their consequences for household life differed. A temporary absence and a long-term relocation are not interchangeable. The article also discusses women assigned to textile and food work through state institutions. These categories help ask about constraint and skill without assigning a biography to an unprovenanced garment. Regional investigation is still necessary.',
      cite('yanawilka-food', 'Introduction: terms and Inka cosmopolitanism'),
    ),
    sec(
      'A plant trace is not an itinerary',
      'The researchers analysed 53 stone tools; nine were tested in both recovery rounds. Those repeat analyses do not add nine independent tools. Starch identification uses modern comparison material, with possible indirect contact and contamination discussed explicitly. The interpretation of non-local foods concerns access, not a traced journey or a named trader. Even the authors’ conclusion leaves alternatives for how food moved. Archaeological observations can test an account of restricted travel while still leaving mechanisms unresolved.',
      cite('yanawilka-food', 'Methods, Results opening and Discussion'),
    ),
    sec(
      'Indigenous authorship belongs in its own context',
      'Guaman Poma wrote and drew under colonial rule, criticizing exploitation and addressing proposals to a Spanish king. The Royal Danish Library describes Spanish text with Quechua passages. That audience and purpose shaped the work; Indigenous authorship does not make it a transparent transcript of earlier life. Here the library introduction has been consulted, not the entire manuscript. Reading selected original pages with appropriate language expertise is a next research task, rather than an achievement claimed by linking a digitization.',
      cite('guaman-poma-context', 'Manuscript introduction'),
    ),
  ];
  s.evidenceReading = {
    title: 'Separate skill, obligation and observed household traces',
    introduction:
      'The garment, institutional explanations and a local excavation are related questions, not one continuous provenance.',
    items: [
      {
        label: 'A constructed textile',
        text: 'The catalogue describes separate woven pieces, seams and added pattern work.',
        interpretation:
          'These features support discussion of skill, not identification of a worker’s consent or labor category.',
        citations: [cite('met-313152', 'Description')],
      },
      {
        label: 'Turning service into supplies',
        text: 'Museum accounts describe rotating work and stores used for several kinds of goods.',
        interpretation:
          'Provisioning and obligation belong together, but equal returns cannot be assumed.',
        citations: [
          cite('inka-labor', 'Mit’a/Ayni'),
          cite('inka-colcas', 'Transcript'),
        ],
      },
      {
        label: 'Food beyond the local environment',
        text: 'The Yanawilka authors identify non-local foods through starch analysis.',
        interpretation:
          'They leave direct exchange and state-controlled movement as alternatives. The tunic has no demonstrated connection to this site.',
        citations: [cite('yanawilka-food', 'Discussion and conclusions')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Follow work that the finished cloth hides',
    duration: 'About 5 minutes',
    steps: [
      'Find stripes, the jagged pattern and the neck opening in the tunic photograph.',
      'Use the work diagram to name a task before the garment was finished and a separate task supplying people with food.',
      'Explain why a beautiful garment does not tell us whether its maker could choose the work.',
    ],
    explanation:
      'Visible skill and evidence of obligation answer different questions. We need other records to connect this garment to a particular worker.',
  };
  s.dimensions.obligation = {
    text: 'Rotating service, resettlement and textile work were distinct arrangements. Provisioning does not establish equal choice or returns; the selected tunic cannot be assigned a particular obligation without provenance.',
    citations: [
      cite('inka-labor', 'Mit’a/Ayni'),
      cite('yanawilka-food', 'Introduction and Discussion'),
      cite('met-313152', 'Description'),
    ],
  };
  s.review = review([
    'No complete Guaman Poma manuscript or original-language chronicle consultation; workers’ voices remain mediated and regional.',
    'Selected article sections, not independent starch identification, supplementary data analysis or a universal household model.',
    'No exact maker, findspot, journey or state commission assigned to the tunic; no claim that all reciprocal obligations were equal or voluntary.',
  ]);
}
const phase = (
  year: number,
  label: string,
  title: string,
  text: string,
  source: string,
  locator: string,
) => ({ year, label, title, text, citations: [cite(source, locator)] });
const contexts: HistoricalContext[] = [
  {
    id: 'song-institutions-context',
    title: 'Song institutions: northern and southern phases',
    region: 'East Asia',
    interval: interval(
      960,
      1279,
      '960–1279 CE: Northern and Southern Song',
      'Conventional dynastic frame; distinct neighboring states and changing control remain. It is not the lifespan of all Chinese institutions.',
    ),
    summary:
      'The two capital phases, a 1069 proposal and an independently dated bowl remain distinct.',
    subjectIds: ['song-art'],
    citations: [
      cite('song-phases', 'Chronology'),
      cite('song-crop-loans', '1069 memorial'),
    ],
    phases: [
      phase(
        960,
        '960 CE: conventional beginning',
        'Northern Song frame',
        'The capital setting is Kaifeng; neighboring Liao and later Jin histories remain distinct.',
        'song-phases',
        'Northern Song and neighboring states',
      ),
      phase(
        1069,
        '1069 CE',
        'Crop loans are proposed',
        'A fiscal memorial sets out seasonal lending and repayment. Its intended benefits are not an outcome study.',
        'song-crop-loans',
        'Longer selection date and proposals',
      ),
      phase(
        1127,
        '1127 CE',
        'A northern loss and southern court',
        'The Jurchen Jin take the northern capital; the Southern Song phase follows. This is not the Mongol conquest.',
        'song-phases',
        '1125–1234 entry',
      ),
      phase(
        1279,
        '1279 CE',
        'Mongol conquest ends the Southern Song',
        'A dynastic endpoint does not end Chinese material work or every institution.',
        'song-phases',
        'Southern Song and Yuan frames',
      ),
    ],
  },
  {
    id: 'mali-networks-context',
    title: 'Mali and West African networks: changing scales and voices',
    region: 'Africa',
    interval: interval(
      1230,
      1600,
      'About 1230–1600 CE: broad exhibition frame',
      'Approximate reference orientation, not exact founding/extinction or a fixed empire boundary.',
    ),
    summary:
      'Older urban histories, Sunjata traditions, a pilgrimage, a foreign image and overlapping later powers have separate dates.',
    subjectIds: ['mali-networks'],
    citations: [
      cite('sahel', 'Introduction and Ancient Mali'),
      cite('catalan-block', 'Object 26'),
    ],
    phases: [
      phase(
        1230,
        'Early thirteenth century: approximate anchor',
        'A Mali political frame',
        'Sunjata traditions concern beginnings; urban work at Jenne-jeno has a much older history.',
        'sahel',
        'Epics; Ancient Mali',
      ),
      phase(
        1324,
        '1324 CE: Cairo pilgrimage anchor',
        'Mansa Musa travels via Cairo',
        'This is a dated episode, not the origin of regional networks or a measured fortune.',
        'sahel',
        'Islam',
      ),
      phase(
        1375,
        'About 1375 CE: conventional atlas date',
        'Mali pictured in Majorca',
        'A foreign royal image is made later than the pilgrimage; attribution remains qualified.',
        'catalan-block',
        'Object 26',
      ),
      phase(
        1464,
        'Later fifteenth century: orientation',
        'Overlapping Songhay power',
        'The exhibition’s Songhay frame overlaps later Mali histories; this anchor is not an exact transfer of every settlement.',
        'sahel',
        'Introduction and Songhay',
      ),
      phase(
        1600,
        'About 1600 CE: selected endpoint',
        'A reference window ends',
        'The broad display frame does not mean all institutions, communities or memories suddenly disappear.',
        'sahel',
        'Introduction',
      ),
    ],
  },
  {
    id: 'inka-labor-context',
    title: 'Inca labor and authority: garment, state and colonial account',
    region: 'Americas',
    interval: interval(
      1400,
      1615,
      'Fifteenth century–about 1615: selected institutional and source window',
      'Rounded early boundary and later manuscript endpoint; not the empire’s exact lifespan or the tunic’s manufacture range.',
    ),
    summary:
      'Imperial work, a 1450–1550 garment range, Spanish invasion and later Indigenous criticism answer different questions.',
    subjectIds: ['inca-weaving'],
    citations: [
      cite('met-313152', 'Date'),
      cite('guaman-poma-context', 'Manuscript introduction'),
      cite('inka-labor', 'Mit’a/Ayni'),
    ],
    phases: [
      phase(
        1450,
        '1450–1550 CE: catalogue range',
        'The tunic’s broad date begins',
        'This date belongs to a material attribution; it does not supply an individual maker or exact political phase.',
        'met-313152',
        'Date',
      ),
      phase(
        1500,
        'Around 1500 CE: viewing anchor',
        'Roads, work and stores',
        'A rounded orientation for institutions described in these sources, not the foundation year of every road or store.',
        'inka-labor',
        'Building the Road',
      ),
      phase(
        1532,
        '1530s: Spanish invasion and rupture',
        'Colonial conditions change the setting',
        'The viewing anchor orients the invasion period; the garment’s broad date does not determine whether it was made before or after it.',
        'guaman-poma-context',
        'Conquest and colonial history',
      ),
      phase(
        1550,
        '1550 CE: catalogue range ends',
        'An object range ends',
        'This is not the disappearance of Andean weaving or Indigenous communities.',
        'met-313152',
        'Date',
      ),
      phase(
        1615,
        'About 1615 CE',
        'Guaman Poma’s colonial critique',
        'A later Indigenous manuscript addresses exploitation and reform, rather than witnessing every preconquest workshop.',
        'guaman-poma-context',
        'Manuscript and audience',
      ),
    ],
  },
];
const journey: Journey = {
  id: 'work-obligation-voices',
  leadObject: 'song-loan-diagram',
  title: 'Work, obligation and historical voices',
  question: 'Who supplied the work, and who gets to describe its benefits?',
  duration: 'About 20–30 minutes',
  printSourcesPerPage: 3,
  introduction:
    'Compare a Song fiscal proposal, Mali’s royal image and household production, and Inca textile work and provisioning. The selected dates are a thematic inquiry, not a route, a single causal sequence or evidence of contact among these objects.',
  stops: [
    {
      subject: 'song-art',
      object: 'song-loan-diagram',
      year: 1069,
      title: 'Follow the proposed timing',
      narrative:
        'Trace resources before harvest and repayment later. What would you ask a household before accepting the policy’s promised benefit?',
    },
    {
      subject: 'mali-networks',
      object: 'catalan-musa-detail',
      year: 1375,
      title: 'Look below the royal image',
      narrative:
        'Describe visible royal signs, then use the account of common pottery to identify work the image omits.',
      compare: 'song-art',
    },
    {
      subject: 'inca-weaving',
      object: 'met-313152',
      year: 1500,
      title: 'Separate skill from choice',
      narrative:
        'Find construction features in the garment. Distinguish them from evidence about rotating service, resettlement and provisioning.',
      compare: 'mali-networks',
    },
  ],
  conclusion:
    'Proposals, royal images and finished objects can conceal different parts of work. Add household evidence and distinct voices before judging benefits or choices.',
  evidence: {
    prompt:
      'Which evidence would best test whether the proposed Song loan helped a particular household?',
    options: [
      {
        text: 'The official memorial says the policy would benefit people.',
        supported: false,
        feedback:
          'That explains the authors’ justification, not the household’s actual experience.',
      },
      {
        text: 'Dated local borrowing and repayment records, read alongside that household’s circumstances.',
        supported: true,
        feedback:
          'These could test timing, terms, harvest conditions and collection against the promise. Surviving records still need interpretation.',
      },
      {
        text: 'The Mali map depicts a ruler holding gold.',
        supported: false,
        feedback:
          'A foreign royal image cannot establish the outcome of a particular Song loan.',
      },
    ],
    citations: [
      cite('song-crop-loans', 'Longer selection'),
      cite('catalan-block', 'Object 26'),
    ],
  },
  returnPrompt:
    'Choose one case. Explain a practical task, name the voice describing it, and identify evidence needed before saying the arrangement benefited its workers.',
};
export function applyObligations(corpus: Corpus) {
  corpus.sources.push(...sources);
  song(corpus.subjects.find((s) => s.id === 'song-art')!);
  mali(corpus.subjects.find((s) => s.id === 'mali-networks')!);
  inka(corpus.subjects.find((s) => s.id === 'inca-weaving')!);
  corpus.contexts = [...(corpus.contexts ?? []), ...contexts];
  corpus.media.push(...obligationMedia);
  corpus.journeys.push(journey);
  corpus.glossary.push(
    {
      id: 'mita',
      name: 'Mit’a',
      definition:
        'Rotating labor service required by Inca authorities. It differs from permanent or semi-permanent resettlement; provisioning does not by itself establish equal choice or returns.',
    },
    {
      id: 'jeli',
      name: 'Jeli / jeliw',
      definition:
        'A Mande specialist in oral traditions and performance, with roles including genealogy, praise and diplomacy. Jeliw is plural; particular performances have their own dates, audiences and purposes.',
    },
  );
  corpus.subjects.find((s) => s.id === 'song-art')!.objectIds.push('song-loan-diagram');
  corpus.subjects
    .find((s) => s.id === 'mali-networks')!
    .objectIds.push('catalan-musa-detail');
  corpus.subjects
    .find((s) => s.id === 'inca-weaving')!
    .objectIds.push('inka-work-diagram');
  corpus.subjects.find((s) => s.id === 'mali-networks')!.terms.push('jeli');
  corpus.subjects.find((s) => s.id === 'inca-weaving')!.terms.push('mita');
  const renewed: Record<string, string> = {
    song: 'Full main Northern Song essay read: painting academy, court patronage and scholar-official expression. No universal prosperity or cultural ranking adopted. This art-historical synthesis does not describe every political worker or household.',
    'song-phases':
      'China 1000–1400 chronology overview and dated entries read. Northern/Southern Song and Liao/Jin distinctions retained. The overview’s erroneous claim that Huizong lost the empire to Mongols is excluded; the 1125–1234 entry identifies Jurchen Jin and 1127. No invention priority, industrial totals or plague-origin claim adopted.',
    sahel:
      'Selected complete exhibition sections read: Introduction, Epics, Trade and Islam, Ancient Mali, Archaeology and Songhay. Used for approximate political frame, older urbanism, production, 1324 Cairo pilgrimage and changing powers. No trans-Saharan numerical total, blanket peaceful-Islam claim, universal uniform administration or exact empire boundary adopted. Original excavations and particular jeli performances were not independently consulted.',
    'sahel-visual':
      'Selected Mansa Musa and Middle Niger discussion read in LaGamma/Abdul-Fattah’s 2020 article. Used for foreign royal visual language, not an audited fortune. Its 1325 pilgrimage wording differs from exhibition’s 1324 Cairo anchor; difference documented without changing the original case. Linked Gomez/McIntosh books and entire article not claimed as read.',
    'met-42455':
      'Current object details and existing supplied image inspected: accession 91.1.226, eleventh–twelfth century, stoneware with hare’s-fur glaze, Jian ware, Public Domain. No maker, exact kiln, buyer or shipment inferred. Existing image bytes retained.',
    'met-313152':
      'Full main description and artwork details read; existing image inspected. Accession 1979.206.954, camelid hair, two woven pieces, seams and interpreted needle-darned patterns, 1450–1550 range. Highland/coast feature comparisons are attributions, not exact findspot or proven travel. The catalogue’s upper/lower terminology is not transferred into visual orientation claims; no state work order, maker identity or link to Yanawilka inferred; original image bytes retained.',
  };
  for (const [id, scope] of Object.entries(renewed)) {
    const s = corpus.sources.find((x) => x.id === id)!;
    s.scope = scope;
    s.accessed = consulted;
  }
  for (const id of ['met-42455', 'met-313152'])
    corpus.media.find((m) => m.id === id)!.licenseUrl =
      'https://creativecommons.org/publicdomain/zero/1.0/';
  const bowl = corpus.media.find((m) => m.id === 'met-42455')!;
  bowl.alt =
    'Dark round tea bowl with a narrow elliptical view into its interior and fine brown streaks across the visible outer glaze.';
  const tunic = corpus.media.find((m) => m.id === 'met-313152')!;
  tunic.alt =
    'Wide tunic with a central neck opening, red and gold jagged bands against dark cloth, and contrasting black and pale areas toward the fringed bottom edge.';
  tunic.caption =
    'A camelid-hair tunic dated 1450–1550. Its historical range remains intact across chapter boundaries.';
  const pack = corpus.packs.find((p) => p.id === 'C6')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['song-art', 'inca-weaving'],
      start: 960,
      end: 1615,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Capital areas in Song China, separate Niger-bend settlements and an Andean household-study region are approximate locators. No object journey, empire border or shared contact route is reconstructed.',
      limits:
        'Three bounded expansions leave broader simultaneous-world coverage, regional variation and independent/family acceptance open.',
    },
  ];
  pack.coverage['East Asia'].reason =
    'Expanded Song case separates northern/southern government, seasonal lending, markets and ceramic evidence. Wider states, labor outcomes and rural histories remain selective.';
  pack.coverage.Africa.reason =
    'Expanded Mali case connects ordinary production, older urbanism, oral traditions, pilgrimage and a foreign royal image. Local administration, producers’ voices and wider African coverage remain selective.';
  pack.coverage.Americas.reason =
    'Expanded Inca case distinguishes textile skill, rotating service, resettlement, stores and a particular household excavation. Broader Americas and local labor variation remain selective.';
  applyObligationPlaces(corpus);
}
