import type {
  Corpus,
  Subject,
  Source,
  HistoricalContext,
  Journey,
} from '../../src/atlas/model';
import { cite, interval, sec } from './content-helpers';
import { applyEncounterPlaces } from './encounters-places';
import { encounterMedia } from './encounters-media';
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
    'benin-court-guilds',
    'The court arts and history of the Kingdom of Benin',
    'National Museums Scotland',
    'https://www.nms.ac.uk/discover-catalogue/the-court-arts-and-history-of-the-kingdom-of-benin',
    'scholarship',
    'Complete main article read. Used for Edo court, palace-controlled craft guilds, fifteenth/sixteenth-century expansion and Portuguese trade, and later 1897/1914 collection context. Oral foundation traditions remain traditions; no exact kingdom foundation, universal artistic arrangement or current ruler name adopted. Its commemorative heads are not the selected export saltcellar. No source image copied. The article does not establish that accession 1972.63a,b was taken in 1897.',
  ),
  source(
    'afonso-letters-1526',
    'Afonso I: selected letters of 6 July and 18 October 1526, English teaching transcription',
    'Oklahoma State University Libraries, Europe and Africa supplement',
    'https://open.library.okstate.edu/interculturalcommunication/chapter/europe-and-africa/',
    'primary',
    'Both dated letters in the primary-source supplement read; chapter narrative is not adopted. Host attributes the adapted chapter to Dan Allosso and Tom Williford, Modern World History (CC BY-NC-SA); the English translator/critical edition is not identified on the consulted supplement. No original Portuguese, autograph or archival collation consulted; no translation reproduced. July requests and October inspection rules remain distinct. Royal complaints and proposed restrictions do not establish universal abolition or enforcement, and are not enslaved people’s testimony. Original Pressbooks chapter checked without resolving translation provenance.',
    'Afonso I of Kongo; English translator unspecified by teaching host',
    '1526 letters; later English transcription',
  ),
  source(
    'gama-journal-1898',
    'A Journal of the First Voyage of Vasco da Gama, 1497–1499: selected English edition',
    'Hakluyt Society, 1898; Project Gutenberg eBook 46440',
    'https://www.gutenberg.org/cache/epub/46440/pg46440-images.html',
    'primary',
    'Downloaded English edition; opening pp. 1–2 and printed pp. 39–57 read for departure/editorial conventions, captivity, Malindi negotiation/pilot, crossing, multilingual encounters and Calicut audience. Anonymous journal; Álvaro Velho attribution not asserted. E. G. Ravenstein is translator/editor, 1898. Bracketed dates, headings and editorial matter are not silently treated as manuscript words. Narrator’s religious labels, insults, crowd estimates, crop identification and measures are not adopted as neutral facts. Not the Portuguese original, all voyage pages, every appendix or an Indian/African eyewitness account. No period image copied.',
    'Anonymous voyage participant; E. G. Ravenstein, English translator/editor',
    'Voyage 1497–1499; English edition 1898',
  ),
  source(
    'gama-manuscript-custody',
    'Roteiro of the first voyage of Vasco da Gama to India: Memory of the World nomination',
    'UNESCO / Biblioteca Pública Municipal do Porto',
    'https://media.unesco.org/sites/default/files/webform/mow001/portugal_first_voyage_vasco_da_gama_to_india.pdf',
    'archive',
    'Six-page nomination read, especially identification/authenticity pp. 2–3. MS 804 is a first-half-sixteenth-century copy (1500–1550) of an anonymous lost original, not an autograph shipboard log. Santa Cruz de Coimbra transfer in 1834 and first complete 1838 transcription distinguish custody from voyage date. Promotional first-globalization/first-East-West claims excluded. No manuscript folio or nomination image reproduced; a statement about manuscript copyright is not a licence for every modern PDF image.',
  ),
];
const review = (limitations: string[]): Subject['review'] => ({
  consultedOn: consulted,
  reviewer:
    'Codex source consultation and self-review; not independent historian approval',
  scope:
    'Bounded C7 main/deeper/evidence reading, family inquiry, phased context, sourced place study and inspected or modern media.',
  limitations,
});
function benin(s: Subject) {
  s.contextIds = ['benin-court-context'];
  s.summary =
    'An Edo carver made Portuguese figures support a container for salt. That combination joins skilled making, court institutions and a distant audience. Benin City, in present-day Nigeria, was the center of an existing kingdom, rather than a workshop waiting for European direction. The selected object’s broad date does not date the kingdom’s beginnings or identify a particular commission.';
  s.sections = [
    sec(
      'Look at the work supporting the bowl',
      'In the supplied photograph, a standing figure faces outward below the container. Patterned clothing, beads, a cross and a long weapon organize the surface; other figures turn around its sides. Carving a freestanding support and a vessel from ivory required planning around the material. The museum describes four figures around the whole object. This single view does not show every side equally. A reader can compare visible detail with a catalogue claim without pretending the photograph is a complete inspection.',
      cite('met-309900', 'Supplied image and main description, accession 1972.63a,b'),
    ),
    sec(
      'A court sustained specialized production',
      'National Museums Scotland describes palace-controlled craft guilds producing objects for the Oba and court ceremonies. This institutional setting matters: makers learned and practiced within relationships of authority, patronage and access to materials. Court art supported succession and remembrance as well as display. Those functions do not make every surviving ivory a royal altar object. This saltcellar is associated with an export market; the catalogue qualifies its attribution to the court of Benin with a question mark.',
      cite('benin-court-guilds', 'Royal craft guilds'),
      cite('met-309900', 'Artist and culture attribution'),
    ),
    sec(
      'A customer’s request still needed a maker’s decisions',
      'The Met’s ivory essay describes commissions and imported models alongside local carving traditions and training. A European customer might recognize clothing, Christian signs or a table vessel while an Edo maker decided how bodies, supports and textured surfaces worked together. The name “Master of the Heraldic Ship” is a modern attribution, not a recovered signature. Recognizing an audience therefore does not recover the customer’s instructions, the carver’s biography or the payment for this object.',
      cite('ivories', 'Commissioning and apprenticeship'),
      cite('met-309900', 'Attribution and iconography'),
    ),
    sec(
      'Exchange changed the court’s material possibilities',
      'Fifteenth- and sixteenth-century contacts brought traded cloth, coral and brass into Benin’s wider court economy. These materials could become meaningful in local regalia rather than keeping one fixed foreign meaning. The saltcellar instead uses ivory to picture outsiders. Together, these examples show selection and transformation in different directions. They do not establish that every negotiation was equal or that all members of society benefited. A patron’s desirable object is only one outcome of the relationships that sustained production.',
      cite('benin-court-guilds', 'Conquest and contact'),
      cite('ivories', 'Imported models and African production'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Follow an attribution without turning it into a person',
      'A conventional master name groups works through similarities that an art historian considers significant. It can help compare carving choices while leaving the maker’s actual name, assistants and workshop organization unresolved. The saltcellar’s catalogue range, about 1525–1600, is broad enough to frustrate a story about one meeting with a named visitor. Its retained media search envelope begins at 1520; that numeric envelope is not a newly discovered exact date. A useful account keeps both the qualified attribution and the catalogue wording visible.',
      cite('met-309900', 'Date, artist and culture fields'),
    ),
    sec(
      'Distinguish an export object from a later collection event',
      'Many export ivories reached European collections in early modern exchange. Separately, British forces invaded Benin in 1897, deposed its Oba and removed court belongings. The latter history is essential to understanding Benin collections, but it cannot establish this saltcellar’s custody without object-specific documentation. Its 1972 museum accession is a modern collection event, not its manufacture or proof of its earlier route. The consulted main catalogue view does not supply a complete provenance chain.',
      cite('ivories', 'European collections'),
      cite('benin-court-guilds', 'Benin under colonial rule'),
      cite('met-309900', 'Credit and accession'),
    ),
    sec(
      'Bring missing work into the question',
      'Ask how ivory was obtained, who learned the craft, who carried commissions and who received payment. These questions extend the account beyond a ruler and a foreign customer. The photograph cannot answer them by itself. Workshop, commercial and Edo historical evidence would help connect the finished carving to people’s choices and constraints. For example, an instruction might specify an intended design, while a payment record might reveal a different part of the relationship. Neither would substitute for the maker’s own account.',
      cite('ivories', 'Training and commissions'),
    ),
  ];
  s.evidenceReading = {
    title: 'Separate observation, attribution and custody',
    introduction:
      'Use three different statements without letting one stand in for the others.',
    items: [
      {
        label: 'Visible in this photograph',
        text: 'A front-facing figure, patterned clothing and a supported vessel can be inspected.',
        interpretation:
          'The view supplies evidence of carved form, not every side or an individual maker’s identity.',
        citations: [cite('met-309900', 'Supplied image')],
      },
      {
        label: 'A qualified museum attribution',
        text: 'The catalogue associates the work with the court of Benin (?) and a conventionally named master.',
        interpretation:
          'Keep the question mark and conventional name; neither is a signed workshop record.',
        citations: [cite('met-309900', 'Artist and culture')],
      },
      {
        label: 'A later historical context',
        text: 'The 1897 invasion changed Benin and displaced court objects.',
        interpretation:
          'That event alone cannot establish the route of this particular export ivory.',
        citations: [
          cite('benin-court-guilds', 'Benin under colonial rule'),
          cite('ivories', 'European collections'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Make three kinds of evidence cards',
    duration: 'About 5 minutes',
    steps: [
      'Point to one detail you can actually see in the photograph.',
      'Read the museum’s four-figure description. Explain why this one view cannot show every side equally.',
      'Sort three statements: a visible detail, a qualified attribution, and a question about who once owned it.',
    ],
    explanation:
      'A careful observer can describe the carving without inventing a maker’s name or a complete ownership story.',
  };
  s.dimensions.mediation = {
    text: 'Commissioning connected a distant audience to an Edo maker’s material and compositional decisions; exact instructions and payment are unknown.',
    citations: [
      cite('ivories', 'Models and commissions'),
      cite('met-309900', 'Attribution'),
    ],
  };
  s.review = review([
    'No Edo-language oral-history consultation, workshop ledger, named carver or object-specific complete custody chain.',
    'No assertion that this saltcellar was taken in 1897; catalogue attribution remains qualified and the inherited 1520–1600 media envelope is retained.',
    'Wider household, gender, ivory procurement, enslavement and regional histories need further scholarship.',
  ]);
}
function kongo(s: Subject) {
  s.contextIds = ['kongo-christian-context'];
  s.summary =
    'Kongo Christianity developed through local choices, teaching, translation and conflict. The royal baptism of 1491 marks one episode in that process, rather than an instant conversion of everyone. A brass crucifix and a ruler’s letters reveal different relationships: making religious meaning, negotiating royal power and struggling over enslavement. Neither source speaks for every Kongo community.';
  s.sections = [
    sec(
      'Translation required people who could question meanings',
      'Almeida describes Kongo students, nobles and clergy participating in education and communication with Portuguese visitors. A translator needed more than corresponding words: ideas about death, authority and religious practice could be understood differently. The bilingual Portuguese–Kikongo catechism of 1624 belongs to this longer work of explanation. It comes well after the baptism of Nzinga Nkuwu, who took the name João. Royal adoption did not make religious practice identical across regions, social groups or generations.',
      cite('kongo-christianity', 'Education, translation and uneven practice'),
    ),
    sec(
      'A maker composed an argument in brass',
      'The selected crucifix places Christ within a textured border, with smaller figures above, below and on the arms. Raised details and incised lines give bodies and clothing different surfaces. It is solid cast brass, dated broadly to the sixteenth–seventeenth century. Fromont interprets its composition through Christian imagery and Kongo ideas about passages between visible life and the dead. Her interpretation is an art historian’s argument; identifying a border or a figure in the photograph is a different kind of statement.',
      cite('met-318323', 'Image and artwork details'),
      cite('kongo-interview', 'Reading of accession 1999.295.7'),
    ),
    sec(
      'Afonso’s letters sought a response to kidnapping',
      'In a letter dated 6 July 1526, Afonso I complained that merchants’ goods and the seizure of people undermined his authority and endangered free people, including relatives of nobles. His October letter proposed that buyers submit captives to three trusted officials for investigation before export. This describes a ruler trying to intervene through correspondence and inspection. It does not prove that those rules worked. Nor should the October distinction between free people and captives be turned into a modern demand to abolish every form of enslavement.',
      cite('afonso-letters-1526', '6 July and 18 October 1526 selections'),
    ),
    sec(
      'Religious creativity existed amid unequal power',
      'Christian relationships could support diplomacy, learning and royal claims while Atlantic trafficking removed people and intensified insecurity. Afonso’s requests for teachers and medical practitioners in the selected letters show that his relations with Portugal were not reducible to one transaction. But a royal voice still differs from the testimony of a captive or a rural household. Read the crucifix and letters together to ask how people remade institutions while facing constraints, without making either religious exchange or violence the sole explanation of Kongo’s history.',
      cite('afonso-letters-1526', 'Requests and complaints'),
      cite('kongo-interview', 'Kongo and the transatlantic slave trade'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Separate a source’s voice from the edition carrying it',
      'The supplied letters are English teaching transcriptions. Their host identifies an adapted textbook chapter but does not name the English translator or critical edition for this supplement. That gap matters when wording carries an argument about free status, captivity or royal jurisdiction. Here the letters’ dated requests are paraphrased with that limit visible. No consultation of the original Portuguese or an archival autograph is claimed. A fuller account should collate a critical edition before leaning on a disputed phrase.',
      cite('afonso-letters-1526', 'Supplement and attribution'),
    ),
    sec(
      'Do not arrange uncertain objects into a simple evolution',
      'Almeida warns that imprecise dates and provenance make a linear story from European forms to increasingly local forms unreliable. A crucifix can incorporate several traditions at once; resemblance is not a clock. The broad 1500–1700 media range does not place this object at the 1491 baptism, the 1526 letters or the 1624 catechism. Those are separate source episodes. A material may also have traveled before casting, but this photograph cannot identify the origin of the brass.',
      cite('kongo-christianity', 'Dating and provenance limits'),
      cite('met-318323', 'Date and medium'),
    ),
    sec(
      'Leave room for disagreement and later change',
      'Fromont’s reading treats religious making as creative interpretation, rather than passive copying. Other evidence is still needed to learn who used this cross and what they understood. Later Capuchin missions and the movement associated with Kimpa Vita belong to changing political and religious settings; they cannot be projected backward onto every sixteenth-century practitioner. A reader can place these episodes on the reference sequence, then ask which voice is present in each: a missionary, a ruler, an artist interpreted through an object, or a later scholar.',
      cite('kongo-interview', 'Interpretation'),
      cite('kongo-christianity', 'Later missions and Kimpa Vita'),
    ),
  ];
  s.evidenceReading = {
    title: 'Read an object and a royal request differently',
    introduction:
      'Physical form, modern interpretation and a ruler’s complaint answer different questions.',
    items: [
      {
        label: 'An inspectable composition',
        text: 'Small figures occupy the arms, upper part and base of a brass cross.',
        interpretation:
          'Their arrangement is visible; their ritual significance requires an attributed interpretation and context.',
        citations: [
          cite('met-318323', 'Supplied image'),
          cite('kongo-interview', 'Crucifix interpretation'),
        ],
      },
      {
        label: 'A proposed inspection rule',
        text: 'The October 1526 letter asks that officials investigate free or captive status before export.',
        interpretation:
          'A proposed safeguard is not proof of enforcement, universal protection or a captive person’s account.',
        citations: [cite('afonso-letters-1526', '18 October selection')],
      },
      {
        label: 'Several separate dates',
        text: '1491 baptism, 1526 letters, a broad crucifix range and a 1624 catechism are distinct.',
        interpretation:
          'Shared religious history does not make the objects and documents witnesses to the same event.',
        citations: [
          cite('kongo-christianity', 'Chronology'),
          cite('afonso-letters-1526', 'Dates'),
          cite('met-318323', 'Date'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Describe first, then ask about meaning',
    duration: 'About 5 minutes',
    steps: [
      'Find the smaller figures and the patterned border in the cross.',
      'Say which part you can point to and which part needs the historian’s explanation.',
      'Compare the photograph with Afonso’s proposed inspection rule. Which could show a request, and which could show a carved or cast shape?',
    ],
    explanation:
      'An object’s form and a ruler’s request preserve different evidence; neither alone tells us how every person lived or believed.',
  };
  s.dimensions.mediation = {
    text: 'Kongo students, clergy, interpreters and artists actively reshaped religious communication; royal letters also sought intervention in trafficking, with enforcement unproven.',
    citations: [
      cite('kongo-christianity', 'Translation'),
      cite('afonso-letters-1526', 'Selected letters'),
    ],
  };
  s.review = review([
    'The English letter translation’s critical provenance remains unresolved; no original-language collation or enslaved person’s testimony consulted.',
    'No exact crucifix workshop, metal source, original user, use event or findspot established. Fromont’s reading is explicitly attributed.',
    'Regional practice, local clergy, women, rural life, political succession and rights outcomes remain selective.',
  ]);
}
function voyage(s: Subject) {
  s.objectIds = [...s.objectIds, 'voyage-mediation-diagram'];
  s.contextIds = ['ocean-encounters-context'];
  s.summary =
    'Da Gama’s 1497–1499 voyage connected Portugal with Indian Ocean ports that already had rulers, merchants, ships and multilingual intermediaries. Reaching Calicut depended on provisioning, pilots and negotiation as well as ocean sailing. An anonymous participant’s journal records both assistance and coercion. Its account is useful evidence of encounters, but its categories and judgments need scrutiny.';
  s.sections = [
    sec(
      'A sea crossing depended on work near the shore',
      'The selected journal passages describe negotiations at Malindi before the ships sailed across the Indian Ocean in 1498. Food, anchorage, boats and someone able to guide the crossing were practical requirements. The writer describes meetings with the local ruler and exchanges of gifts and messages. These scenes show a port’s existing political and maritime resources. They do not support a picture of Europeans navigating an empty ocean or arriving where no long-distance shipping had existed.',
      cite('gama-journal-1898', 'Printed pp. 39–46'),
    ),
    sec(
      'Help and coercion appear in the same account',
      'Before reaching Malindi, the narrator reports the seizure of people from a boat. The account later describes their return and the detention of the Malindi ruler’s servant while a pilot was sought. These episodes complicate a story built only from welcome and friendship. Receiving a pilot does not by itself prove that everyone involved acted freely. The selected passage does not name that pilot. Repeating a famous navigator’s name without evidence would replace an unidentified person’s work with a more convenient story.',
      cite('gama-journal-1898', 'Printed pp. 39–46'),
    ),
    sec(
      'Calicut required several kinds of interpretation',
      'After the crossing, people in local boats identified the coast. The journal then describes men from Tunis who could converse with a Portuguese envoy through languages including Castilian and Genoese. At the Calicut court, access to the ruler also depended on local officials and audience arrangements. Communication therefore passed through people with different skills and positions. A king’s messenger, a harbor pilot and a multilingual merchant did related work without becoming interchangeable representatives of one culture.',
      cite('gama-journal-1898', 'Printed pp. 47–57'),
    ),
    sec(
      'The visitor’s description could distort what he encountered',
      'The writer described religious buildings and practices through Christian terms familiar to him. The reader can notice that habit without accepting those labels as a neutral census of local belief. The modern diagram follows tasks in the selected narrative, while the map locates named places. Neither reconstructs an exact ship track. Portugal’s later conquest of Goa in 1510 is a different episode, beyond this voyage’s 1499 endpoint. Linking these dates explains change without making later domination an automatic outcome of one arrival.',
      cite('gama-journal-1898', 'Printed pp. 52–55'),
      cite('interwoven', 'Portugal and India chronologies; Goa 1510'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Read the journey and the surviving document on different clocks',
      'The Porto library’s nomination identifies the surviving manuscript as a copy made in the first half of the sixteenth century from an anonymous lost original. That is different from possessing the shipboard autograph. The English edition used here was translated and edited by E. G. Ravenstein in 1898. Its bracketed insertions and notes add another layer. A bracketed date should therefore not quietly become the narrator’s own precise dating. The selected passages were consulted, rather than every page of the voyage or its later appendices.',
      cite('gama-manuscript-custody', 'Identification and authenticity, pp. 2–3'),
      cite('gama-journal-1898', 'Editorial conventions and selected pp. 39–57'),
    ),
    sec(
      'Use local knowledge without inventing a complete biography',
      'A pilot’s expertise becomes visible when a ship needs guidance. An interpreter becomes visible when a visitor cannot communicate directly. The narrator often gives such workers less personal detail than he gives leaders. Their relative anonymity is a feature of the surviving account, not evidence that their knowledge mattered less. Comparing what the text records about a ruler, a detained servant and an unnamed pilot helps reveal how perspective distributes attention.',
      cite('gama-journal-1898', 'Printed pp. 41–49'),
    ),
    sec(
      'Follow another source before extending the route',
      'A journal selection cannot explain the whole Indian Ocean economy or the lives of people whose voices it filters. African and Indian records, port archaeology and critical maritime scholarship would test its descriptions. The map deliberately stops at sourced locators: connecting them with a smooth line would imply navigational precision the selected evidence does not supply. A useful next comparison would place a dated local port account beside this visitor’s description and ask what each author expected an audience to recognize, explain or overlook.',
      cite('gama-journal-1898', 'Scope of selected narrative'),
    ),
  ];
  s.evidenceReading = {
    title: 'Separate narrative, edition and geographical precision',
    introduction:
      'A close reading can identify necessary work while retaining the account’s perspective.',
    items: [
      {
        label: 'A narrator reports detention',
        text: 'The account describes holding the Malindi ruler’s servant while seeking a pilot.',
        interpretation:
          'Assistance in the same narrative does not establish that every encounter was voluntary.',
        citations: [cite('gama-journal-1898', 'Printed pp. 44–46')],
      },
      {
        label: 'A later surviving copy',
        text: 'The custodian dates the extant manuscript copy to 1500–1550.',
        interpretation:
          'Voyage date, manuscript-copy date and the 1898 English edition are separate.',
        citations: [
          cite('gama-manuscript-custody', 'Identification/authenticity pp. 2–3'),
        ],
      },
      {
        label: 'Named places, incomplete track',
        text: 'Malindi and Calicut locate selected encounters; Lisbon locates departure.',
        interpretation:
          'Approximate city points do not supply bearings, anchorages or an exact sailing line.',
        citations: [
          cite('gama-journal-1898', 'Selected narrative'),
          cite('interwoven', 'Portugal chronology'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Name the work behind an arrival',
    duration: 'About 5 minutes',
    steps: [
      'Follow the diagram from supplies and a pilot to conversation and a court audience.',
      'Choose one task that sailing alone could not complete. Explain whose knowledge it required.',
      'Find Malindi and Calicut on the map. Explain why the points do not show an exact ship track.',
    ],
    explanation:
      'A voyage depended on existing ports and people’s knowledge. The account also records coercion; useful assistance is not proof that everyone was free to choose.',
  };
  s.dimensions.mediation = {
    text: 'Pilots, envoys, multilingual intermediaries and court officials enabled movement and communication. The narrator also records detention; participation cannot be assumed voluntary.',
    citations: [cite('gama-journal-1898', 'Printed pp. 39–57')],
  };
  s.review = review([
    'No original Portuguese manuscript reading, full voyage edition, African or Indian contemporary account or complete Indian Ocean economic study.',
    'The selected journal does not identify the Malindi pilot; no Ibn Majid attribution, exact crossing track, modern anchorage or religious census inferred.',
    'The 1510 Goa phase is separate from the preserved 1497–1499 voyage. Wider port work, women, local merchants and subsequent military coercion need deeper sources.',
  ]);
}
const phase = (
  year: number,
  label: string,
  title: string,
  text: string,
  id: string,
  locator: string,
) => ({ year, label, title, text, citations: [cite(id, locator)] });
const contexts: HistoricalContext[] = [
  {
    id: 'benin-court-context',
    title: 'Benin court, makers and Atlantic encounters',
    region: 'Africa',
    interval: interval(
      1400,
      1700,
      'Fifteenth–seventeenth centuries: selected court and encounter window',
      'Rounded orientation, not the kingdom’s foundation or ending; later collection history is discussed separately.',
    ),
    summary:
      'Court production and Atlantic encounters have a broader frame than one export saltcellar.',
    subjectIds: ['benin-ivory'],
    citations: [
      cite('benin-court-guilds', 'Court and contact'),
      cite('met-309900', 'Date'),
    ],
    phases: [
      phase(
        1400,
        'Fifteenth century: rounded orientation',
        'An established court and its makers',
        'The court and craft traditions predate the selected saltcellar. This anchor is not an exact foundation year.',
        'benin-court-guilds',
        'Court history and craft guilds',
      ),
      phase(
        1500,
        'Fifteenth–sixteenth centuries: broad contact frame',
        'Expansion and traded materials',
        'Portuguese trade joined a changing court economy. The anchor is not the first contact’s exact date.',
        'benin-court-guilds',
        'Conquest and contact',
      ),
      phase(
        1525,
        'About 1525–1600: catalogue range',
        'The selected saltcellar',
        'Its dated attribution belongs to one object inquiry; no named commission is established.',
        'met-309900',
        'Date and attribution',
      ),
      phase(
        1700,
        'End of selected seventeenth-century window',
        'A teaching frame ends',
        'Benin’s court and artistic histories continue beyond this boundary.',
        'benin-court-guilds',
        'Later court history',
      ),
    ],
  },
  {
    id: 'kongo-christian-context',
    title: 'Kongo Christianity: translation, royal claims and disagreement',
    region: 'Africa',
    interval: interval(
      1491,
      1706,
      '1491–1706: selected religious and political episodes',
      'The baptism and Kimpa Vita episodes bound this reference window, not the lifespan of Kongo or its Christianity. The dossier retains its open ending.',
    ),
    summary:
      'Baptism, letters, religious teaching and later conflict are distinct source episodes.',
    subjectIds: ['kongo-translation'],
    citations: [
      cite('kongo-christianity', 'Chronology'),
      cite('afonso-letters-1526', 'Dated selections'),
    ],
    phases: [
      phase(
        1491,
        '1491 CE',
        'Nzinga Nkuwu receives baptism',
        'The royal episode does not establish universal or permanent adoption.',
        'kongo-christianity',
        'João / Nzinga Nkuwu',
      ),
      phase(
        1526,
        'July and October 1526',
        'Afonso writes about trafficking',
        'Distinct complaints and proposed inspections do not prove effective protection.',
        'afonso-letters-1526',
        'Both selections',
      ),
      phase(
        1624,
        '1624 CE',
        'Portuguese–Kikongo teaching text',
        'A bilingual catechism belongs to continued translation, not the start of every local religious practice.',
        'kongo-christianity',
        'Mateus Cardoso',
      ),
      phase(
        1645,
        '1645 CE',
        'Capuchin missions arrive',
        'A later missionary setting should not be projected onto the 1491 baptism.',
        'kongo-christianity',
        'Capuchins',
      ),
      phase(
        1706,
        '1706 CE',
        'Kimpa Vita is executed',
        'Conflict over a later religious movement ends this selected window; Kongo Christianity continues.',
        'kongo-christianity',
        'Kimpa Vita and Pedro IV',
      ),
    ],
  },
  {
    id: 'ocean-encounters-context',
    title: 'Indian Ocean encounters: voyage and later conquest',
    region: 'South Asia',
    interval: interval(
      1497,
      1510,
      '1497–1510: selected voyage and later Goa episode',
      'A short sequence, not the beginning of Indian Ocean commerce or the whole Portuguese presence.',
    ),
    summary:
      'Existing ports, a 1497–1499 voyage and a later conquest have separate histories.',
    subjectIds: ['portuguese-voyage'],
    citations: [
      cite('interwoven', 'Portugal and India chronologies'),
      cite('gama-journal-1898', 'Selected passages'),
    ],
    phases: [
      phase(
        1497,
        '1497 CE',
        'Departure from Portugal',
        'This begins the selected voyage, rather than maritime exchange between continents.',
        'interwoven',
        'Portugal 1497–99',
      ),
      phase(
        1498,
        '1498 CE',
        'Malindi and Calicut encounters',
        'Pilotage, negotiation, coercion and interpretation feature in the participant’s account.',
        'gama-journal-1898',
        'Printed pp. 39–57',
      ),
      phase(
        1499,
        '1499 CE',
        'The voyage frame ends',
        'A return date does not settle the later history of these ports.',
        'interwoven',
        'Portugal 1497–99',
      ),
      phase(
        1510,
        '1510 CE',
        'Portuguese conquest of Goa',
        'A later military episode, distinct from the first voyage and Calicut audience.',
        'interwoven',
        'India 1510',
      ),
    ],
  },
];
const journey: Journey = {
  id: 'makers-interpreters-encounters',
  leadObject: 'voyage-mediation-diagram',
  title: 'Makers, interpreters and unequal encounters',
  question: 'Whose knowledge made an encounter possible, and who could choose?',
  duration: 'About 20–30 minutes',
  printSourcesPerPage: 3,
  introduction:
    'Compare an ocean account, an Edo carving and Kongo religious making and royal letters. The selected dates organize a thematic inquiry, not a single causal route or evidence that these particular objects and voyagers met.',
  stops: [
    {
      subject: 'portuguese-voyage',
      object: 'voyage-mediation-diagram',
      year: 1498,
      title: 'Name the necessary work',
      narrative:
        'Identify a pilot, interpreter and court official. Find the account’s evidence that assistance and coercion could coexist.',
    },
    {
      subject: 'benin-ivory',
      object: 'met-309900',
      year: 1550,
      title: 'Follow a maker’s choices',
      narrative:
        'Point to carved details and distinguish a patron’s likely audience from unknown instructions or a named maker.',
      compare: 'portuguese-voyage',
    },
    {
      subject: 'kongo-translation',
      object: 'met-318323',
      year: 1624,
      title: 'Separate meaning from enforcement',
      narrative:
        'Compare the crucifix interpretation with Afonso’s earlier proposed inspection rule. Neither proves what everyone believed or what officials enforced.',
      compare: 'portuguese-voyage',
    },
  ],
  conclusion:
    'Objects and accounts show active makers and intermediaries. Their creativity does not erase coercion, and a ruler’s request does not supply every person’s voice.',
  evidence: {
    prompt: 'Which work does this guide identify beyond sailing?',
    options: [
      {
        text: 'Pilotage and interpretation helped an arrival become possible.',
        supported: true,
        feedback:
          'The guide identifies supplies and a pilot at Malindi, then interpreters and a court audience at Calicut. Useful assistance does not prove that everyone could choose freely.',
      },
      {
        text: 'Everyone involved could choose freely.',
        supported: false,
        feedback:
          'The guide explicitly leaves free choice unproven. The journal also records detention.',
      },
      {
        text: 'The arrow records the exact ship track.',
        supported: false,
        feedback:
          'The arrow follows the narrative sequence. It is not a reconstructed sailing course.',
      },
    ],
    citations: [cite('gama-journal-1898', 'Printed pp. 39–57')],
  },
  returnPrompt:
    'Choose a task, identify the source that reveals it, and explain what further evidence would help establish the worker’s choices.',
};
export function applyEncounters(corpus: Corpus) {
  corpus.sources.push(...sources);
  benin(corpus.subjects.find((s) => s.id === 'benin-ivory')!);
  kongo(corpus.subjects.find((s) => s.id === 'kongo-translation')!);
  voyage(corpus.subjects.find((s) => s.id === 'portuguese-voyage')!);
  corpus.contexts = [...(corpus.contexts ?? []), ...contexts];
  corpus.media.push(...encounterMedia);
  corpus.journeys.push(journey);
  const scopes: Record<string, string> = {
    ivories:
      'Complete main essay read again, 28 October 2026: commissioning/models, apprenticeship, elite ivory access and European collections. Sapi/Sierra Leone and Edo/Benin traditions kept distinct. Sweeping equality-of-power, literacy generalizations, workshop estimates and cultural essentialism not adopted. No source image reproduced or object-specific custody chain inferred.',
    'met-309900':
      'Main catalogue description, artwork details and existing image inspected again. Ivory saltcellar, accession 1972.63a,b, ca. 1525–1600; court of Benin (?) and modern conventional master attribution retained. Inherited media numeric envelope 1520–1600 preserved separately. Four figures described around whole object; single front view is incomplete. A proposed set/gift remains tentative and is not asserted. Provenance tab contents not consulted; no complete custody chain, named carver or 1897 removal inferred. Existing CC0 image bytes unchanged.',
    'met-318323':
      'Main description, artwork details and existing image inspected again: solid cast brass, 16th–17th century, accession 1999.295.7. Catalogue introduction’s early-sixteenth-century baptism wording conflicts with the 1491 date in Almeida; the introduction chronology is excluded. Existing photograph shows central Christ, four smaller figures and patterned border. Catalogue/audio/Fromont interpretations distinguished from visible form; no findspot, workshop, original user or metal origin inferred. Provenance tab body not consulted. Existing CC0 bytes unchanged; no audio played.',
    'kongo-christianity':
      'Full English essay body read through the Japanese-UI route https://www.metmuseum.org/ja/essays/christianity-kongo-visual-culture after English URL access failed (curl 429). Almeida, 30 June 2026: 1491 baptism, education/translation, 1624 catechism, uneven adoption, 1645 Capuchins, Kimpa Vita 1704/1706 and provenance/dating limits. Not the linked full books or original-language documents. Regional 40% enslavement figure and uniform linear Africanization claims excluded. Motifs from other crucifixes not transferred to this accession.',
    'kongo-interview':
      'Displayed Fromont interview text read: selected crucifix interpretation, multilingual actors, relations between political conflict and trafficking, and uncertainty about metallurgy. Not audio listened to, full monograph read or independent historical approval. Interpretations of ancestors/textile enclosure explicitly attributed; a possible European brass origin is not asserted for this object.',
    interwoven:
      'Overview and selected Portugal/India chronology entries renewed, 28 October 2026: voyage 1497–99, arrival 1498 and Goa conquest 1510. Broad first-global-community claim and erroneous implication that India only became an East/West trading center in 1498 excluded. Not a complete port history, itinerary reconstruction or reading of all exhibition objects. Original existing source identity preserved.',
  };
  for (const [id, scope] of Object.entries(scopes)) {
    const found = corpus.sources.find((x) => x.id === id)!;
    found.scope = scope;
    found.accessed = consulted;
  }
  for (const id of ['met-309900', 'met-318323'])
    corpus.media.find((m) => m.id === id)!.licenseUrl =
      'https://creativecommons.org/publicdomain/zero/1.0/';
  const ivory = corpus.media.find((m) => m.id === 'met-309900')!;
  ivory.alt =
    'Ivory vessel raised above standing figures. The front figure wears patterned clothing, beads and a cross, and holds a long weapon; other figures appear in partial side views. The upper rim has visible losses.';
  ivory.printCredit = 'The Met. Louis V. Bell and Rogers Funds, 1972.';
  ivory.printCaption = 'Portuguese figures; court of Benin (?) attribution.';
  const cross = corpus.media.find((m) => m.id === 'met-318323')!;
  cross.alt =
    'Brass cross with a central Christ figure, small seated figures on both arms, another figure above and a smaller figure below. Incised diagonal lines form a border around the cross.';
  const pack = corpus.packs.find((p) => p.id === 'C7')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['portuguese-voyage', 'kongo-translation'],
      start: 1491,
      end: 1706,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Approximate city and coast locators distinguish Lisbon, Malindi, Calicut, Benin City and Mbanza Kongo. No exact ship track, political border or object findspot is reconstructed.',
      limits:
        'Three expansions do not complete Atlantic/Indian Ocean histories or supply independent, family or original-language acceptance.',
    },
  ];
  pack.coverage.Africa.reason =
    'Expanded Benin and Kongo cases explain makers, religious translation and distinct royal evidence. Wider communities, collection histories and trafficking outcomes remain selective.';
  pack.coverage['South Asia'].reason =
    'Expanded Calicut encounter inquiry retains existing ports and intermediaries; broader Indian Ocean economies, local accounts and port histories remain selective.';
  applyEncounterPlaces(corpus);
}
