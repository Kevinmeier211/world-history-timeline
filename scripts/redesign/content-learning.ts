import type {
  Corpus,
  Subject,
  Source,
  HistoricalContext,
  Journey,
  Citation,
} from '../../src/atlas/model';
import { cite, interval, sec } from './content-helpers';
import { applyLearningPlaces } from './learning-places';
import { learningMedia } from './learning-media';
const consulted = '2026-10-28';
const source = (
  id: string,
  title: string,
  institution: string,
  url: string,
  type: Source['type'],
  scope: string,
  author: string,
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
    'tang-changan',
    'Chang’an (Xian)',
    'University of Washington, Silk Road Seattle',
    'https://depts.washington.edu/silkroad/exhibit/tang/essay2.html',
    'scholarship',
    'Full university essay downloaded and read, including the distinct Han/Sui sites, Xuanzang’s return, later pagoda rebuilding and the 845 persecutions. Waugh’s synthesis is not Xiong’s full monograph. No population total, exact modern/ancient city identity or blanket religious tolerance adopted; images not reproduced.',
    'Daniel C. Waugh',
  ),
  source(
    'tang-wards',
    'Cityscape of the Ordinary in Tang period Chang’an',
    'National University of Singapore, East Asian Institute, In Focus seminar summary',
    'https://research.nus.edu.sg/eai/wp-content/uploads/2019/10/2019-09-17-InFocus-HengChyeKiang.pdf',
    'scholarship',
    'One-page indexed PDF text read in the web tool. Direct download returned a 212-byte challenge page, not a PDF; screenshot failed. Summary of Heng Chye Kiang’s seminar, not the full 2014 article or his reconstruction files. Used for walled wards, gates, curfew and explicit conjectural reconstruction limits; no density/household totals or measured plan adopted.',
    'Seminar summary reporting Heng Chye Kiang',
    '17 September 2019',
  ),
  source(
    'abbasid-workshops',
    'Abbasid Ceramics: investment, production and centres of innovation',
    'Ashmolean Museum, University of Oxford, Islamic Ceramics Online',
    'https://islamicceramics.ashmolean.org/Abbasid/ceramics.htm',
    'scholarship',
    'Course page downloaded; investment/production, dating frameworks, centres and lustre technique passages read. Mariam Rosser-Owen’s 2000–2001 teaching synthesis draws on Hallett and others; their full theses were not consulted. Kilns, skill, fuel and costly failures support an original conceptual diagram. Court sponsorship and a single production centre are hypotheses, not settled facts. The page’s erroneous Red Sea description of Basra and speculative invention narrative are not adopted. No source figure copied.',
    'Mariam Rosser-Owen',
    '2000–2001',
  ),
  source(
    'basrah-fieldwork',
    'Early Islamic Basrah (Iraq)',
    'Fondation Max van Berchem, archaeological project report',
    'https://maxvanberchem.org/en/scientific-activities/projects/archeology/8-francais/170-early-islamic-basrah-iraq',
    'archaeology',
    'Full project page downloaded; settlement/topography, ceramics and 2017–2018 survey sections read. Early Basra near al-Zubayr is distinct from modern Basra. Report qualifies reported kiln finds, competing production centres and surface evidence; no precise ancient canal or boundary traced and no analysis transferred to the selected Met bowl.',
    'Andrew Petersen',
  ),
  source(
    'murwab-ceramics',
    'Petrographic analysis of ceramics from Murwab, an early Islamic site in Qatar',
    'Proceedings of the Seminar for Arabian Studies 51 (2022), 55–70',
    'https://archaeopresspublishing.com/ojs/index.php/PSAS/article/download/985/975',
    'archaeology',
    'Sixteen-page original PDF downloaded. Summary, introduction/methods and conclusions read: study of 134 selected common generally unglazed sherds, not the Met lustre bowl. Provenance is preliminary and concerns sampled material from Murwab, Qatar. The paper reports petrography in detail; chemical data are preliminary, not a fully published chemical dataset. The paper does not prove the selected Iraq-attributed bowl’s workshop or route. Figures are not reproduced.',
    'José C. Carvajal López, Alexandrine Guérin and Myrto Georgakopoulou',
    '2022',
  ),
  source(
    'yijing-1896',
    'A Record of the Buddhist Religion as Practised in India and the Malay Archipelago (A.D. 671–695)',
    'Clarendon Press, Oxford, 1896; scanned copy',
    'https://www.sabrizain.org/malaya/library/itsing.pdf',
    'primary',
    'Original 1896 English edition downloaded. Selected introduction and printed pp. 62–65, 154–155 and 176–177 read; pp. 65, 154 and 177 visually inspected. Yijing’s seventh-century account through Takakusu’s translation and textual notes, not a fresh Chinese reading or a whole-book review. Tamralipti’s guest/room rules on pp. 63–64 are not transferred to Nalanda. Nalanda resident totals have textual variants; no exact census or eight-hall match to today’s ruins is asserted.',
    'Yijing; translated and annotated by J. Takakusu',
    '1896',
  ),
  source(
    'nalanda-photo',
    'Nalanda Ruins (41): photographer’s record',
    'Wikimedia Commons; original work by Sumit Surai',
    'https://commons.wikimedia.org/wiki/File:Nalanda_Ruins_(41).jpg',
    'archive',
    'Original 3280×2464 image downloaded and visually inspected. Record gives 9 October 2023, Sumitsurai and CC BY-SA 4.0; categorised as Monastery 1. It documents conserved brick remains, not an occupied seventh-century room, an original roof or an independently dated teaching space. No individual brick dated from appearance; copyright licence is separate from UNESCO description licence.',
    'Sumit Surai / Sumitsurai',
    '9 October 2023',
  ),
  source(
    'met-451400',
    '“Preparing Medicine from Honey”, from a Dispersed Manuscript of an Arabic Translation of De Materia Medica',
    'The Metropolitan Museum of Art',
    'https://www.metmuseum.org/art/collection/search/451400',
    'catalogue',
    'Description and artwork details read: accession 57.51.21, ‘Abdullah ibn al-Fadl, dated 621 AH/1224 CE, attributed to Baghdad. Used as a later manuscript example of copying/illustration, not an eighth-century original translation, observed hospital, clinical recommendation or proof of universal literacy. Image linked, not reproduced. The page’s first-century BCE dating of Dioscorides is not adopted.',
    'The Metropolitan Museum of Art',
  ),
];
const review = (limitations: string[]): Subject['review'] => ({
  consultedOn: consulted,
  reviewer:
    'Codex source consultation and self-review; not independent historian approval',
  scope:
    'Bounded C5 account with main/deeper/evidence reading, family entry, phased context, sourced geography and modern explanatory media.',
  limitations,
});
const dim = (text: string, citations: Citation[]) => ({ text, citations });
function tang(s: Subject) {
  s.contextIds = ['tang-changan-context'];
  s.summary =
    'Chang’an joined court government, neighborhoods, markets and religious communities. People moved through a built environment that organized access as well as exchange. A tomb musician presents one carefully made image of courtly life; it cannot stand for the city’s whole population. The capital and its institutions changed within the Tang dynasty’s long conventional frame.';
  s.sections = [
    sec(
      'An inherited capital needed people to make it work',
      'The Tang did not begin with an empty landscape. A new capital had been built under the preceding Sui, south of the earlier Han city. Rulers inherited government institutions as well as streets and buildings. Offices needed people who could read and write; the examination system offered some educated men a route into service. Access still depended on education and social position. A recruitment procedure describes one way of staffing government, rather than demonstrating that every resident could participate equally.',
      cite('tang-changan', 'Sui rebuilding and distinct earlier Han site'),
      cite('tang', 'Sui inheritance and examination recruitment'),
    ),
    sec(
      'Walls and gates shaped an ordinary errand',
      'The NUS seminar summary describes walled residential wards, gates, markets and a curfew that restricted movement. Going out for supplies therefore depended on more than distance: opening times and permission mattered. The diagram separates a ward, a public street and a market as functional settings. It gives no surveyed route or uniform house plan. The summary explicitly calls reconstructed ward interiors conjectural; their residents did not all occupy identical compounds.',
      cite('tang-wards', 'One-page summary, ward/curfew and reconstruction paragraphs'),
    ),
    sec(
      'A musician is an image made for a tomb',
      'The earthenware figure holds an implement with ribbons or strings which the Met compares with castanets. Pigment and shaped clothing give the figure a specific visual character. Its catalogue classification is tomb pottery. Someone selected, made and placed an image of performance for a funerary setting; this is different evidence from a performer’s own testimony. The sculpture supplies neither a personal name nor a record of wages. Its seventh–eighth-century date is narrower than the whole Tang frame.',
      cite('met-44800', 'Description, date, medium and classification'),
    ),
    sec(
      'Religious communities and government changed together',
      'Xuanzang returned to the capital in 645 with texts that he subsequently translated. The university account distinguishes the pagoda first built in 652 from rebuilding in 701–704. Translation and storage required sustained institutional work, beyond the moment of arrival. Different religious communities lived in the capital, but their presence did not guarantee permanent security. Persecutions in 845 and the dynasty’s continuation after a major mid-eighth-century rebellion prevent a single timeless picture of openness or stable court authority.',
      cite('tang-changan', 'Xuanzang, pagoda phases and 845 persecutions'),
      cite('tang', 'Final paragraph: continuing dynasty after rebellion'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A reconstruction can test a question without filling every gap',
      'A regular grid does not reveal who lived behind each wall. The NUS summary distinguishes evidence about wards from conjectures about their interiors. Its example of Bai Juyi’s compound belongs to Luoyang; it is not a measured house in Chang’an. Use the diagram to ask how gates organized access, then seek dated records of actual movement. Geometry alone cannot show that every rule was obeyed.',
      cite('tang-wards', 'One-page summary, Bai Juyi and conjectural reconstruction'),
    ),
    sec(
      'A city’s surviving buildings run on different clocks',
      'The university essay carries the reader from the Han and Sui capitals to Tang religious buildings and later Ming structures. This makes a practical method: identify which phase a surviving feature belongs to before using it to picture a whole city. A building first founded in one year can contain substantial later rebuilding. Similarly, a tomb object can illuminate representation without locating its original workshop or the household of a living performer. Comparing these sources requires several dated histories, not one illustration labeled “Tang life.”',
      cite('tang-changan', 'Successive capitals and later surviving structures'),
      cite('met-44800', 'Object date and classification'),
    ),
    sec(
      'Two kinds of learning served different tasks',
      'Compare recruiting an officeholder with translating returned scriptures. The first selects people for government service; the second makes a body of writing available through another language. Both require learned work, but sharing a capital does not make their audiences, purposes or opportunities identical. The tomb musician adds another form of skilled activity represented in the city’s wider courtly culture. Ask who could enter each setting and whose own voice survives. The comparison broadens institutional history beyond a ruler’s list of achievements.',
      cite('tang', 'Examination recruitment'),
      cite('tang-changan', 'Xuanzang and translation'),
      cite('met-44800', 'Funerary representation'),
    ),
  ];
  s.evidenceReading = {
    title: 'Read a plan, an object and a dated account differently',
    introduction:
      'These are source paraphrases and modern teaching interpretations, not translated ancient regulations.',
    items: [
      {
        label: 'Walled wards in a seminar summary',
        text: 'Heng’s seminar summary describes gates and curfew; reconstruction of interiors remains conjectural.',
        interpretation:
          'A spatial rule helps explain constrained movement. It does not supply the pictured musician’s address.',
        citations: [cite('tang-wards', 'Ward and reconstruction paragraphs')],
      },
      {
        label: 'A catalogue classifies a figure',
        text: 'Met 1978.345 is seventh–eighth-century tomb pottery with pigment and a percussion-like implement.',
        interpretation:
          'Catalogue identification and visible features support a funerary representation of performance, not a personal biography.',
        citations: [cite('met-44800', 'Description and Artwork Details')],
      },
      {
        label: 'A building was rebuilt',
        text: 'The pagoda’s first foundation and its early-eighth-century rebuilding are separate in Waugh’s account.',
        interpretation:
          'A founding date does not date all standing fabric. A modern photograph needs the same care.',
        citations: [cite('tang-changan', 'Dayan pagoda paragraph')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Plan an errand through a gate',
    duration: 'About 5 minutes',
    steps: [
      'Find the ward, gate, street and market in the supplied diagram.',
      'Trace an imagined daytime errand with a finger. Which opening must the person pass?',
      'Close that gate with a finger. Explain what additional information would be needed before saying the errand could still happen.',
    ],
    explanation:
      'The diagram is a modern functional guide. It helps ask about access and timing; it does not reconstruct a named resident’s actual trip.',
  };
  s.dimensions.coordination = dim(
    'Neighborhood gates, government recruitment and religious translation organize different kinds of work; their rules do not establish universal access or compliance.',
    [
      cite('tang', 'Institutions'),
      cite('tang-wards', 'Wards and curfew'),
      cite('tang-changan', 'Xuanzang'),
    ],
  );
  s.review = review([
    'No original Tang legal-code or household-register consultation; the ward source is a one-page seminar summary, not the full study.',
    'No surveyed city/ward reconstruction, named musician biography or renewed verification of every Tang event.',
    'Wider rural society, taxation, military households, women’s lived experiences and late-Tang transformations need further research.',
  ]);
}
function abbasid(s: Subject) {
  s.contextIds = ['abbasid-iraq-context'];
  s.summary =
    'Cities, workshops and books followed different rhythms within Abbasid-era Iraq. A bowl makes skilled surface work visible, while its unknown workshop remains a question. Baghdad’s founding, the court’s move to Samarra and later changes in political control did not make one continuous administrative system. Reading craft beside urban and scholarly institutions gives a fuller history than the dynasty label alone.';
  s.sections = [
    sec(
      'A capital concentrated demands and opportunities',
      'Baghdad was founded in 762, after the Abbasids had taken power in 750. The court moved to Samarra in 836 and returned to Baghdad in 892. Building, supplying and decorating those places created work for many kinds of maker. Yet a find at a palace need not have been produced nearby or commissioned personally by a ruler. The two capitals are separate settings in a longer history, and the wider population’s work cannot be reduced to court consumption.',
      cite('abbasid', 'Capital foundation, moves and archaeological survival'),
    ),
    sec(
      'The bowl’s surface required decisions and skill',
      'The selected tenth-century vessel is earthenware with lustre painting over an opaque white glaze. A seated man, plants and birds organize its decoration; the catalogue reads a blessing on its foot. Making such surfaces involved ingredients, skilled potters, kilns, fuel and attention, including failures. The process diagram separates the ceramic body, glazed surface and controlled lustre firing. It explains a technical task without assigning a recipe, temperature or named workshop to this accession.',
      cite('met-452833', 'Description, medium, inscription and Iraq attribution'),
      cite('abbasid-workshops', 'Investment and lustre-technique discussion'),
    ),
    sec(
      'A production place needs more than a style name',
      'Pottery found at Samarra is not automatically pottery made there. Kiln debris and material comparisons provide different evidence from a vessel’s decoration. Petersen’s fieldwork report discusses Basra-region finds while retaining uncertainties about their original recovery and the possibility of several southern Iraqi production centers. Early Basra near al-Zubayr also differs from the modern city farther east. Neither this regional research nor the bowl’s Iraq attribution identifies the selected object’s precise workshop, owner or journey.',
      cite('basrah-fieldwork', 'Ceramics, settlement history and 2017–2018 survey'),
      cite('met-452833', 'Geography: attributed to Iraq'),
    ),
    sec(
      'Books also depended on skilled production',
      'A manuscript leaf attributed to Baghdad and dated 621 AH/1224 CE names ‘Abdullah ibn al-Fadl. It belongs to an Arabic version of a much older Greek treatise and combines writing with illustration. This later object makes copying, interpretation and presentation visible. Its date is not the beginning of translation into Arabic, and an illustrated setting is not an observed hospital interior. The example extends the account beyond pottery without treating every city or century as one scholarly institution.',
      cite('met-451400', 'Description and artwork details; 57.51.21'),
    ),
    sec(
      'Political authority changed before the final date',
      'The caliphs’ power narrowed as other rulers gained control; Baghdad’s capture by the Buyids in 945 and Seljuqs in 1055 differs from the Mongol sack in 1258. The conventional endpoint cannot stand in for centuries of unchanged rule. Crafts, books and institutions therefore need their own dated evidence.',
      cite('abbasid', 'Changing authority and later Baghdad'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Ordinary pottery broadens the question',
      'A 2022 study examined 134 selected common, generally unglazed sherds from Murwab in Qatar. Petrography addresses materials and possible origins; chemical results and provenance suggestions remain preliminary. This concerns a different settlement and different sampled pots, not chemical testing of the selected Met bowl. It shows why an account centered on a glittering museum vessel should also ask about cooking, storage and household supply. The sample does not count every pot or identify the movements of every household.',
      cite('murwab-ceramics', 'Printed pp. 55–56 and conclusions p. 68'),
    ),
    sec(
      'Old explanations remain questions to test',
      'Rosser-Owen’s course discusses theories connecting costly innovation with court sponsorship and overseas trade. Petersen’s report explicitly qualifies production-center arguments and warns that collected surface sherds only indicate, rather than securely date, occupation. Keep these kinds of inference visible: a hypothesis about investment, evidence about a clay fabric and an object’s museum attribution do different work. None alone establishes who paid a potter, whether a particular worker migrated or how one vessel reached a consumer.',
      cite('abbasid-workshops', 'Investment and centres of innovation'),
      cite('basrah-fieldwork', 'Ceramics and surface material'),
    ),
    sec(
      'A century-wide object date can cross a political change',
      'The selected bowl’s tenth-century date spans the 945 change in Baghdad’s control. That range cannot establish whether it was made before or after the takeover, still less identify a patron from the ruling dynasty. Ask what additional dating or ownership evidence would narrow the question. The manuscript’s 1224 date supplies a different degree of precision for another object and task. A dynastic label groups material for study; it cannot replace the dates and circumstances of manufacture, use and survival.',
      cite('met-452833', 'Tenth-century date'),
      cite('abbasid', 'Buyid control in 945'),
      cite('met-451400', 'Dated 621 AH/1224 CE'),
    ),
  ];
  s.evidenceReading = {
    title: 'Do not merge findplace, manufacture and a dynastic name',
    introduction:
      'Paraphrases distinguish catalogue attribution, field observations and an independently dated manuscript.',
    items: [
      {
        label: 'The vessel has an attribution',
        text: 'The Met dates 1977.126 to the tenth century and attributes it to Iraq.',
        interpretation:
          'This is broader than a known workshop or excavated palace context. The catalogue locates the blessing on the foot; the two supplied photographs show the decorated interior, not that inscription.',
        citations: [cite('met-452833', 'Description and geography')],
      },
      {
        label: 'Fieldwork tests places of production',
        text: 'Petersen reports kiln-related material and competing production-center interpretations around early Basra.',
        interpretation:
          'Evidence from clay and kilns cannot be transferred automatically to every similar-looking bowl.',
        citations: [cite('basrah-fieldwork', 'Ceramics')],
      },
      {
        label: 'A book has a much later date',
        text: 'Accession 57.51.21 is dated 1224 CE and attributed to Baghdad.',
        interpretation:
          'A copy/illustration date is distinct from the underlying treatise and earlier translation work. Its pictured activity is not direct observation.',
        citations: [cite('met-451400', 'Artwork details and description')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Follow the work behind a shining surface',
    duration: 'About 5 minutes',
    steps: [
      'Look at the bowl, then the supplied production diagram. Name one visible decoration.',
      'Point to a step a finished photograph cannot show: preparing material, firing or controlling the kiln.',
      'Say which question needs workshop evidence rather than the photograph.',
    ],
    explanation:
      'The activity distinguishes visible features from inferred production. It supplies no ancient recipe and does not identify the workshop of this particular bowl.',
  };
  s.dimensions.coordination = dim(
    'Craft production and book copying require organized skill and resources, while court locations and effective political control change over time.',
    [
      cite('abbasid', 'Capital and political phases'),
      cite('abbasid-workshops', 'Production investment'),
      cite('met-451400', 'Artwork details'),
    ],
  );
  s.review = review([
    'Selected museum objects and reports do not cover Abbasid agriculture, fiscal administration, slave labor, urban conflict or scholarly institutions comprehensively.',
    'Hallett’s thesis, the underlying Basra petrographic datasets and original manuscript text have not been independently reanalysed.',
    'Early Basra topography remains qualified; the source’s modern canals and surface finds do not supply a securely reconstructed ninth-century route.',
  ]);
}
function nalanda(s: Subject) {
  s.contextIds = ['nalanda-institution-context'];
  s.summary =
    'At Nalanda, living together made learning possible. Residential buildings, worship, teaching, food and support from outside the monastery belonged to an institution that changed across centuries. Yijing’s seventh-century account makes some routines visible, through an 1896 English translation. Excavated and conserved brick remains answer different questions from that account; a modern photograph cannot show a complete ancient timetable.';
  s.sections = [
    sec(
      'A long institutional history differs from older site remains',
      'UNESCO’s detailed synthesis distinguishes earlier archaeology from the monastic and scholastic establishment of the fifth–thirteenth centuries. The surviving buildings developed through construction phases rather than one founding design. Viharas provided residential and educational infrastructure beside religious buildings and shrines. Bringing these functions together allowed people to remain, learn and worship, but the excavated portion is smaller than the historical complex. Neither a protected-area boundary nor a modern university analogy defines the institution’s whole past.',
      cite('nalanda', 'Brief synthesis, criteria and Integrity'),
    ),
    sec(
      'Learning required support beyond a teaching hall',
      'On printed page 65, Yijing’s translated account says Nalanda held lands associated with villages granted by generations of kings. This connects study with continuing support from outside the residential buildings. The passage does not describe every cultivator’s obligations or the distribution of the proceeds. Endowment is therefore a starting question about resources and dependence, not proof that all the people sustaining the monastery shared its privileges. The account’s praise of discipline also serves the author’s argument for better monastic practice.',
      cite('yijing-1896', 'Printed p. 65: Nalanda and endowed villages'),
    ),
    sec(
      'A daily practice needed coordination and other workers',
      'The translated account describes chanting carried from hall to hall because a large community could not assemble easily in one place. Lay assistants and children accompany the chant leader with incense and flowers. This is a concrete way to coordinate worship across several spaces, and it brings people besides senior scholars into view. Resident totals vary across the text traditions noted by the translator. These passages should not become an exact population chart or a room-by-room match with today’s excavated ruins.',
      cite('yijing-1896', 'Printed pp. 154–155 and textual notes'),
    ),
    sec(
      'Study meant learning and explaining, not merely storing texts',
      'Yijing’s learning discussion moves from grammatical study toward composition, reasoning and Buddhist analysis. It names Nalanda and Valabhi as settings where students learn from teachers and instruct others. Such activity depended on skilled people who could explain and debate, rather than a collection of books alone. This selected passage is not a syllabus for every century or every resident. An account intended to explain and commend practices to distant readers also needs reading for its purpose.',
      cite(
        'yijing-1896',
        'Printed pp. 176–177: stages of learning, Nalanda and Valabhi',
      ),
    ),
    sec(
      'The photograph belongs to another date',
      'The 2023 photograph shows brick walls and openings in conserved remains. It is evidence of what a visitor could see then. UNESCO describes documented consolidation and added protective layers. Appearance alone cannot assign each brick to a historical phase or identify this photographed space as Yijing’s teaching room.',
      cite('nalanda-photo', 'Original image and photographer record'),
      cite('nalanda', 'Authenticity and conservation'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Keep Tamralipti and Nalanda apart',
      'Pages 63–64 describe room allocation, guest treatment and a teacher’s disciplinary case before page 65 identifies these as customs at Bha-ra-ha monastery in Tamralipti. The text then turns separately to Nalanda. Transferring every earlier detail to Nalanda would erase the author’s own transition. Page 154 makes another explicit move between the two settings. Identify the place named in a passage before using an attractive detail to fill a gap in an institutional story.',
      cite('yijing-1896', 'Printed pp. 62–65 and 154'),
    ),
    sec(
      'Translation and conservation each add an interpretive layer',
      'Takakusu’s 1896 edition includes textual variants and explanations of terms for monastic assistants. Its wording is not a transparent recording of every seventh-century voice. Read reported observation, recommended practice and a translator’s note separately. Archaeology introduces other layers: excavation exposes parts of a changing complex, and conservation protects what survives. UNESCO calls for continued documentation of repairs. A responsible account can explain a routine while leaving the workers’ own perspectives, land arrangements and an exact room identification unresolved.',
      cite('yijing-1896', 'Printed pp. 65, 154–155 and notes'),
      cite('nalanda', 'Authenticity and further documentation'),
    ),
    sec(
      'Follow support from a grant toward daily life',
      'An endowed resource could sustain residence and learning only through continuing work and arrangements for supply. The account names generations of royal donors, while saying much less about the people producing that support. Follow the explanatory chain from a grant to resources and then to the tasks residents could perform. Its missing links matter: the selected passage does not specify every tenure agreement, payment or cultivator’s experience. Land records and evidence of provisioning would test those questions more directly than another view of a monument.',
      cite('yijing-1896', 'Printed p. 65: royal grants and Nalanda support'),
    ),
  ];
  s.evidenceReading = {
    title: 'Read the named place before borrowing the detail',
    introduction:
      'Selected paraphrases from an old English translation are kept apart from archaeological observation and modern conservation.',
    items: [
      {
        label: 'The account changes its setting',
        text: 'At page 65 the preceding rituals are assigned to Tamralipti; Nalanda follows separately with endowed lands.',
        interpretation:
          'The earlier guest and room rules are not silently made Nalanda’s regulations.',
        citations: [cite('yijing-1896', 'Printed pp. 63–65')],
      },
      {
        label: 'People move between halls',
        text: 'The Nalanda passage describes a chant leader accompanied by assistants and children.',
        interpretation:
          'This explains a practice involving several roles, not an exact census or a map of excavated buildings.',
        citations: [cite('yijing-1896', 'Printed pp. 154–155')],
      },
      {
        label: 'A photograph records conserved ruins',
        text: 'Sumit Surai’s image dates to 9 October 2023. UNESCO describes archaeological fabric and protective additions.',
        interpretation:
          'The visible opening is not independently identified as a classroom. A modern photograph does not date all its bricks.',
        citations: [
          cite('nalanda-photo', 'Date and original photograph'),
          cite('nalanda', 'Authenticity'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Separate a visible doorway from an imagined day',
    duration: 'About 5 minutes',
    steps: [
      'In the supplied photograph, find a doorway, brick courses and the open sky.',
      'Read the short account of chanting from hall to hall. Name a person or task the photograph does not show.',
      'Make two sentences: “I can see…” and “The written account describes…”.',
    ],
    explanation:
      'Both observation and a source account matter. They belong to different dates and do not identify this particular space as a teaching or chanting hall.',
  };
  s.dimensions.coordination = dim(
    'Residence, support from endowed lands, teaching and distributed chanting joined different people’s work. The account and excavated spaces have distinct dates and limits.',
    [
      cite('yijing-1896', 'Printed pp. 65, 154–155 and 176–177'),
      cite('nalanda', 'Brief synthesis and Integrity'),
    ],
  );
  s.review = review([
    'Selected translated passages, not the entire original Chinese text, full travel corpus or primary endowment charters.',
    'No exact medieval population, census, complete curriculum or room-by-room archaeological identification; workers’ and villagers’ own perspectives remain thin.',
    'No precise destruction year is adopted. Institutional changes across the full fifth–thirteenth-century span need further research.',
  ]);
}
const phase = (
  year: number,
  dateLabel: string,
  title: string,
  text: string,
  citations: Citation[],
) => ({ year, label: dateLabel, title, text, citations });
const contexts: HistoricalContext[] = [
  {
    id: 'tang-changan-context',
    title: 'Chang’an before, within and after the Tang frame',
    region: 'East Asia',
    interval: interval(
      581,
      907,
      'Sui rebuilding and Tang capital: selected phases, 581–907 CE',
      'A reference window for these sources, not the lifespan of Xi’an or a claim that all fabric dates to 581.',
      'approximate',
    ),
    summary:
      'A rebuilt Sui capital, Tang government, religious translation and later disruptions have separate dates.',
    subjectIds: ['tang-city'],
    citations: [
      cite('tang-changan', 'Successive capitals and Tang periods'),
      cite('tang', 'Political frame'),
    ],
    phases: [
      phase(
        581,
        '581 onward: Sui accession and rebuilding',
        'A new capital follows an older city',
        'The source places the decision to build a new capital under the Sui; this viewing year marks that transition, not a fully completed city.',
        [cite('tang-changan', 'Sui rebuilding paragraph')],
      ),
      phase(
        618,
        '618 CE',
        'Tang dynastic frame begins',
        'An inherited urban and institutional setting precedes the new dynasty.',
        [cite('tang', 'Sui inheritance')],
      ),
      phase(
        645,
        '645 CE',
        'Xuanzang returns with texts',
        'The return differs from the following work of translation and storage.',
        [cite('tang-changan', 'Xuanzang paragraph')],
      ),
      phase(
        652,
        '652 CE; rebuilding 701–704',
        'A pagoda has more than one date',
        'A first foundation does not date all the standing structure.',
        [cite('tang-changan', 'Dayan pagoda paragraph')],
      ),
      phase(
        755,
        'Mid-eighth century: orientation',
        'Rebellion and weakened authority',
        'This viewing anchor locates a major disruption; the dynasty continued afterward.',
        [cite('tang', 'Final paragraph')],
      ),
      phase(
        845,
        '845 CE',
        'Religious persecutions',
        'The account describes persecution affecting multiple religious communities. Prior presence did not guarantee lasting security.',
        [cite('tang-changan', 'Religious communities paragraph')],
      ),
      phase(
        907,
        '907 CE: conventional dynastic endpoint',
        'A dynasty ends; a city continues changing',
        'This is not Xi’an’s final date or the date of every later monument.',
        [cite('tang', 'Dynastic frame'), cite('tang-changan', 'Later city')],
      ),
    ],
  },
  {
    id: 'abbasid-iraq-context',
    title: 'Abbasid-era Iraq: capitals, workshops and changing control',
    region: 'West/Central Asia',
    interval: interval(
      750,
      1258,
      '750–1258 CE: selected Iraq-centered phases',
      'A teaching frame matching the conventional dynastic case, not uninterrupted uniform sovereignty or the full history of Iraqi cities.',
      'approximate',
    ),
    summary:
      'Baghdad and Samarra, production evidence and a dated manuscript belong to different moments within changing political authority.',
    subjectIds: ['abbasid-craft'],
    citations: [
      cite('abbasid', 'Capitals and political phases'),
      cite('met-451400', 'Date and attribution'),
    ],
    phases: [
      phase(
        750,
        '750 CE',
        'Abbasid rule begins',
        'This precedes Baghdad’s foundation.',
        [cite('abbasid', 'Opening paragraph')],
      ),
      phase(
        762,
        '762 CE',
        'Baghdad is founded',
        'The new capital concentrates political and cultural activity.',
        [cite('abbasid', 'Opening paragraph')],
      ),
      phase(
        836,
        '836–892 CE',
        'The court at Samarra',
        'A capital phase differs from the whole dynastic span and from the selected tenth-century bowl.',
        [cite('abbasid', 'Opening paragraph'), cite('met-452833', 'Date')],
      ),
      phase(
        945,
        '945 CE',
        'Buyid control of Baghdad',
        'Caliphal authority changes; later Seljuq control begins in 1055.',
        [cite('abbasid', 'Political fragmentation paragraph')],
      ),
      phase(
        1224,
        '621 AH / 1224 CE',
        'A manuscript is copied and illustrated',
        'The dated leaf is attributed to Baghdad; this is not a first translation date or observed hospital scene.',
        [cite('met-451400', 'Artwork details and description')],
      ),
      phase(
        1258,
        '1258 CE',
        'Mongol sack of Baghdad',
        'This endpoint does not retrospectively make earlier political control uniform; later nominal caliphs in Egypt fall outside this case.',
        [cite('abbasid', 'Later Baghdad and Mamluk Egypt')],
      ),
    ],
  },
  {
    id: 'nalanda-institution-context',
    title: 'Nalanda: institutional history, an account and conserved remains',
    region: 'South Asia',
    interval: interval(
      400,
      1300,
      'Fifth–thirteenth centuries CE: monastic and scholastic frame',
      'Rounded century boundaries; earlier archaeological remains and modern conservation retain separate dates. No exact foundation or destruction year is asserted.',
      'approximate',
    ),
    summary:
      'The institutional frame, seventh-century textual evidence and a modern photograph answer different questions.',
    subjectIds: ['nalanda'],
    citations: [
      cite('nalanda', 'Brief synthesis'),
      cite('yijing-1896', 'Selected Nalanda passages'),
    ],
    phases: [
      phase(
        400,
        'Fifth century CE: rounded boundary',
        'A monastic and scholastic institution',
        'UNESCO distinguishes the institutional frame from earlier archaeology at the site.',
        [cite('nalanda', 'Brief synthesis')],
      ),
      phase(
        680,
        'Later seventh century CE: viewing anchor',
        'Yijing describes practices',
        'This approximate viewing year places selected accounts; it is not a precise observation date for every passage or building.',
        [cite('yijing-1896', 'Introduction and selected Nalanda passages')],
      ),
      phase(
        1200,
        'Thirteenth century CE: rounded orientation',
        'Sack and abandonment in the broad synthesis',
        'The source uses a century-scale account. This viewing point is not an exact destruction date.',
        [cite('nalanda', 'Brief synthesis')],
      ),
      phase(
        1300,
        'End of the selected century-scale frame',
        'Keep later excavation separate',
        'Excavation, conservation and the 2023 photograph are modern episodes, not the medieval institution’s continuation.',
        [cite('nalanda', 'Authenticity'), cite('nalanda-photo', 'Photograph date')],
      ),
    ],
  },
];
const journey: Journey = {
  id: 'spaces-skills-learning',
  leadObject: 'tang-access-diagram',
  title: 'Spaces, skills and learning',
  question: 'How do institutions organize access and everyday work?',
  duration: 'About 20–30 minutes',
  printSourcesPerPage: 3,
  introduction:
    'Compare access through Chang’an’s gates, skilled production in Abbasid-era Iraq, and living and learning at Nalanda. These selected dates form a thematic inquiry, not a single itinerary, a direct causal sequence or proof of contact among the pictured objects.',
  stops: [
    {
      subject: 'tang-city',
      object: 'tang-access-diagram',
      year: 700,
      title: 'Begin with a gate',
      narrative:
        'Trace the conceptual errand, then compare it with the tomb musician. A functional guide and a funerary image answer different questions.',
    },
    {
      subject: 'abbasid-craft',
      object: 'met-452833',
      year: 950,
      title: 'Read skill behind a surface',
      narrative:
        'Distinguish visible decoration, production tasks and evidence needed to identify a workshop. Court locations and political control changed.',
      compare: 'tang-city',
    },
    {
      subject: 'nalanda',
      object: 'nalanda-brick-photo',
      year: 680,
      title: 'Find the work that supports study',
      narrative:
        'Read the named Nalanda passages. Separate the seventh-century account, an institutional frame and the modern photograph.',
      compare: 'abbasid-craft',
    },
  ],
  conclusion:
    'Institutions work through particular arrangements: gates, resources, skilled workers, support and teaching. Their stated rules, pictured activities and actual practice need different evidence.',
  evidence: {
    prompt:
      'What evidence would best test whether residents could actually make the errand shown in the Chang’an diagram after a ward gate closed?',
    options: [
      {
        text: 'The diagram shows a straight street.',
        supported: false,
        feedback:
          'A street’s shape does not establish permission or actual movement after closing.',
      },
      {
        text: 'Dated rules about gates together with records or archaeological evidence of actual access.',
        supported: true,
        feedback:
          'The claim concerns a particular time and practice. Rules establish intended arrangements; further evidence tests how access worked.',
      },
      {
        text: 'The tomb figure has detailed clothing.',
        supported: false,
        feedback:
          'The figure is evidence of funerary representation. It does not establish a route through a closed gate.',
      },
    ],
    citations: [
      cite('tang-wards', 'Gates, curfew and reconstruction limits'),
      cite('met-44800', 'Classification'),
    ],
  },
  returnPrompt:
    'Choose one institution. Explain a practical task and who helped perform it, then name evidence needed before claiming everyone had the same access.',
};
export function applyLearning(corpus: Corpus) {
  corpus.glossary.push({
    id: 'endowment',
    name: 'Endowment',
    definition:
      'A grant of land, property or resources intended to support an institution over time. Its terms and the work supplying that support need their own evidence.',
  });
  corpus.sources.push(...sources);
  tang(corpus.subjects.find((s) => s.id === 'tang-city')!);
  abbasid(corpus.subjects.find((s) => s.id === 'abbasid-craft')!);
  nalanda(corpus.subjects.find((s) => s.id === 'nalanda')!);
  corpus.contexts = [...(corpus.contexts ?? []), ...contexts];
  corpus.media.push(...learningMedia);
  corpus.journeys.push(journey);
  corpus.subjects.find((s) => s.id === 'nalanda')!.terms.push('endowment');
  corpus.subjects
    .find((s) => s.id === 'tang-city')!
    .objectIds.unshift('tang-access-diagram');
  corpus.subjects
    .find((s) => s.id === 'abbasid-craft')!
    .objectIds.push('abbasid-work-diagram');
  corpus.subjects
    .find((s) => s.id === 'nalanda')!
    .objectIds.push('nalanda-brick-photo');
  for (const id of ['tang', 'abbasid', 'nalanda', 'met-44800', 'met-452833'])
    corpus.sources.find((s) => s.id === id)!.accessed = consulted;
  for (const id of ['met-44800', 'met-452833'])
    corpus.media.find((m) => m.id === id)!.licenseUrl =
      'https://creativecommons.org/publicdomain/zero/1.0/';
  corpus.media.find((m) => m.id === 'met-452833')!.notice = [
    'Describe the seated figure, cup, branch and birds in the decorated interior.',
    'The two supplied photographs show the interior; neither shows the foot inscription.',
    'Distinguish a visible feature from the catalogue’s reading of the blessing on the foot.',
  ];
  for (const id of ['tang-city', 'abbasid-craft', 'nalanda']) {
    const s = corpus.subjects.find((s) => s.id === id)!;
    if (!s.terms.includes('patronage')) s.terms.push('patronage');
  }
  const pack = corpus.packs.find((p) => p.id === 'C5')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['abbasid-craft', 'nalanda'],
      start: 400,
      end: 1300,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Separate Chang’an’s successive city settings, Baghdad/Samarra/early Basra, and Nalanda from the different textual setting at Tamralipti. Locator maps are approximate; conceptual diagrams are not measured plans or routes.',
      limits:
        'Three bounded expansions do not comprehensively cover the wider regions, rural production, social inequalities or every institution. Actual family and independent historical acceptance remain open.',
    },
  ];
  pack.coverage['East Asia'].reason =
    'Expanded Tang/Chang’an account separates government, wards, translation, tomb representation and change. Wider East Asia and rural/tax/military household histories remain selective.';
  pack.coverage['West/Central Asia'].reason =
    'Expanded Abbasid Iraq account separates changing capitals and authority, workshop evidence, ordinary wares and a later manuscript. Wider urban/fiscal/slave labor histories and the full region remain limited.';
  pack.coverage['South Asia'].reason =
    'Expanded Nalanda account connects selected translated practices, resources and residential learning, retaining archaeological/conservation phases. The wider subcontinent and institutional history remain incomplete.';
  applyLearningPlaces(corpus);
}
