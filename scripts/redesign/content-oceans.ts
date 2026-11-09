import { cite, claim, interval, metEssay, sec, subject } from './content-helpers';
import type { Source, Subject, Relation, Journey } from '../../src/atlas/model';
export const oceanSources: Source[] = [
  metEssay(
    'ivories',
    'Afro-Portuguese Ivories',
    'afro-portuguese-ivories',
    'Commissioning, training and European collections; its sweeping claim of equal power is not adopted.',
    'Emma George Ross',
    '2002-10',
  ),
  metEssay(
    'kongo-christianity',
    'Christianity and Kongo Visual Culture',
    'christianity-kongo-visual-culture',
    '1491 baptism; translation; uneven practice; provenance and dating limits.',
    'Carlos Almeida',
    '2026-06-30',
  ),
  metEssay(
    'galleon',
    'The Manila Galleon Trade (1565–1815)',
    'the-manila-galleon-trade-1565-1815',
    'Route, cargoes and Mexican artistic responses. No quantitative silver estimate is adopted.',
    'Johanna Hecht',
    '2003-10',
  ),
  metEssay(
    'ming',
    'Ming Dynasty (1368–1644)',
    'ming-dynasty-1368-1644',
    'Decorative arts, West Asian exchange and court Bureau of Design.',
    'Department of Asian Art',
    '2002-10',
  ),
  metEssay(
    'mughal',
    'The Art of the Mughals before 1600',
    'the-art-of-the-mughals-before-1600',
    'Akbar’s reign, Gujarat access and collaborative royal atelier.',
    'Department of Islamic Art',
    '2002-10',
  ),
  {
    id: 'interwoven',
    title: 'Interwoven Globe: The Worldwide Textile Trade, 1500–1800',
    url: 'https://www.metmuseum.org/exhibitions/listings/2013/interwoven-globe',
    institution: 'The Metropolitan Museum of Art',
    type: 'scholarship',
    accessed: '2026-10-26',
    scope:
      'Portugal and India chronology: 1488; 1497–99; Goa 1510. Overview on commissioned trade textiles. Broad teleological claims of first global community are not adopted.',
  },
  {
    id: 'banda-archive',
    title: 'Genocide op Banda (1621)',
    url: 'https://www.nationaalarchief.nl/beleven/onderwijs/bronnenbox/hoe-ging-het-verder-op-banda',
    institution: 'Nationaal Archief, Netherlands',
    type: 'archive',
    accessed: '2026-10-26',
    scope:
      'Banda-eilanden; Genocide op Banda; original letter of Coen to Heren XVII, 6 May 1621, VOC archive 1.04.02, inventory 1073. Precise casualty totals are not adopted.',
  },
  {
    id: 'point-reyes',
    title: '16th Century Contact Materials Collection',
    url: 'https://www.nps.gov/pore/learn/historyculture/collections-museum-cultural-archeology-contact.htm',
    institution: 'US National Park Service, Point Reyes National Seashore',
    type: 'archaeology',
    published: '2021-08-27',
    accessed: '2026-10-26',
    scope:
      'Chinese porcelain identifications, San Agustín wreck in 1595, and distinction from tentative Drake attribution.',
  },
  {
    id: 'mexico-conquest',
    title:
      '1521: 500 años del inicio de la resistencia de los pueblos indígenas de México ante el colonialismo español',
    url: 'https://www.gob.mx/agn/es/articulos/1521-500-anos-del-inicio-de-la-resistencia-de-los-pueblos-indigenas-de-mexico-ante-el-colonialismo-espanol?idiom=es',
    institution: 'Archivo General de la Nación, México',
    type: 'archive',
    published: '2021-08-13',
    accessed: '2026-10-26',
    scope:
      'Indexed institutional text consulted: April 1519 landing; 13 August 1521 capture; crucial Indigenous allies and continuing resistance. Direct page returned 403; no claims drawn from inaccessible remainder.',
  },
];
oceanSources.push({
  id: 'banda-museum',
  title: 'De geschiedenis van de Banda-eilanden',
  url: 'https://www.hetscheepvaartmuseum.nl/doen/tentoonstellingen/i-love-banda/de-geschiedenis',
  institution: 'Het Scheepvaartmuseum',
  type: 'scholarship',
  accessed: '2026-10-26',
  scope:
    'Existing Asian trade; 1621 violence and displacement; enslaved plantation labor. No casualty total adopted.',
});
export const oceanSubjects: Subject[] = [
  subject({
    id: 'benin-ivory',
    name: 'Benin ivory and Portuguese patrons',
    aliases: ['Saltcellar with Portuguese Figures'],
    kind: 'object',
    region: 'Africa',
    place: 'Court of Benin(?), present-day Nigeria',
    coordinates: [5.62, 6.34],
    geographicPrecision:
      'Court attribution is qualified by the museum; not a precise workshop or findspot.',
    interval: interval(
      1525,
      1600,
      'c. 1525–1600 CE',
      'Catalogue date of the selected saltcellar; not the kingdom’s founding or end.',
      'range',
    ),
    packs: ['C7'],
    question: 'Who is looking at whom?',
    summary:
      'An ivory carver in Benin depicted Portuguese men with elaborate clothes and weapons. The object was made for a foreign patron, yet its visual choices belong to an African artistic setting. Look at rank, pose and texture. This encounter was more than Europeans observing Africa: African makers interpreted their visitors and shaped what patrons could take home.',
    sections: [
      sec(
        'Visitors made into an image',
        'Four Portuguese figures surround the receptacle. Two richly dressed men face outward while their attendants are shown differently. The museum links the detailed dress and regalia to Benin court art. The object therefore contains an interpretation of social rank, not a transparent likeness of all Portuguese travelers.',
        cite('met-309900', 'Description, first two paragraphs'),
      ),
      sec(
        'Commission, skill and audience',
        'Ross describes patrons requesting works, sometimes bringing models, while artists learned through workshops and apprenticeship. The saltcellar’s proposed place among a set for a patron’s table remains tentative. Material, form and destination help explain why skilled labor took this shape. Calling it simply “European influence” would leave the maker’s decisions out of the account.',
        cite('ivories', 'Patronage and apprenticeship paragraphs'),
        cite('met-309900', 'Proposed set paragraph'),
      ),
      sec(
        'An encounter is not one universal relationship',
        'The selected object supports a specific commission and visual exchange. It does not establish equal power in every African-European relationship or turn later colonial conquest into the inevitable next step. Read it beside Kongo’s different political and religious encounter. These histories require their own evidence and cannot be collapsed into one line of descent.',
        cite('ivories', 'Commissioning discussion'),
        cite(
          'kongo-christianity',
          'Opening discussion of Kongo rulers and local adoption',
        ),
      ),
    ],
    claims: [
      claim('benin-salt-date', 'The saltcellar is dated approximately 1525–1600.', [
        cite('met-309900', 'Artwork Details'),
      ]),
      claim(
        'benin-maker',
        'The museum attributes the work to a Benin ivory carver and identifies Portuguese figures.',
        [cite('met-309900', 'Description and qualified artist attribution')],
      ),
    ],
    objectIds: ['met-309900'],
    terms: ['regalia', 'material culture', 'provenance'],
    dimensions: {
      'Audience and making': {
        text: 'An African carver interpreted Portuguese figures in an object made for a patron’s table; a proposed set remains tentative.',
        citations: [cite('met-309900', 'Description')],
      },
      'Surviving evidence': {
        text: 'The ivory preserves pose, dress and technical choices. It does not supply every negotiation or the maker’s spoken explanation.',
        citations: [
          cite('met-309900', 'Description'),
          cite('ivories', 'Commissioning'),
        ],
      },
    },
    returnPrompt:
      'What changes when you describe the object as an African interpretation of Portuguese visitors?',
  }),
  subject({
    id: 'kongo-translation',
    name: 'Kongo: translating Christianity',
    aliases: ['Kongo Kingdom', 'Mbanza Kongo', 'Afonso I'],
    kind: 'process',
    region: 'Africa',
    place: 'Mbanza Kongo and surrounding Central African regions',
    coordinates: [14.25, -6.27],
    geographicPrecision:
      'Capital locator, not a boundary of Christian belief or a crucifix findspot.',
    interval: interval(
      1491,
      null,
      'From the royal baptism of 1491 CE',
      'A documented starting episode for this investigation. No single terminal year is assigned to an evolving religious tradition.',
      'exact',
    ),
    packs: ['C6', 'C7'],
    question: 'Can adopting a symbol change its meaning?',
    summary:
      'Kongo rulers and communities did more than receive a ready-made European religion. They translated Christian concepts into existing categories and used new forms to express local concerns and authority. The process was uneven. Surviving crucifixes open a history of interpretation, diplomacy and faith whose social meanings cannot be read from one symbol alone.',
    sections: [
      sec(
        'A documented encounter',
        'Almeida dates the baptism of Nzinga Nkuwu to 1491. His son Afonso supported teaching, rituals and multilingual intermediaries. A Portuguese–Kikongo catechism appeared in 1624. Translation involved people making choices about words and meanings, rather than the automatic replacement of one culture by another.',
        cite('kongo-christianity', 'Opening three paragraphs'),
      ),
      sec(
        'Forms interpreted locally',
        'The cast-brass crucifix belongs to a broad sixteenth–seventeenth-century range. Almeida shows how local visual practices affected crosses and figures. Adoption varied with region and status. The presence of a Christian form does not tell us that every user understood it in the same way or that earlier practices disappeared.',
        cite('met-318323', 'Date, Culture, Medium'),
        cite('kongo-christianity', 'Uneven adoption; crucifix analysis'),
      ),
      sec(
        'Coercion and the limits of collections',
        'The same wider Atlantic history involved enslavement and forced movement. Religious affiliation did not reliably protect people from capture. At the object level, Almeida emphasizes that missing provenance and precise dating make neat stylistic sequences insecure. A museum display groups surviving things; it is not a full account of what people believed, who suffered, or what was lost.',
        cite('kongo-christianity', 'Final provenance/dating discussion'),
        cite('kongo-interview', 'Discussion of slave trade and political fragility'),
      ),
    ],
    claims: [
      claim('kongo-baptism', 'Nzinga Nkuwu accepted baptism in 1491.', [
        cite('kongo-christianity', 'Opening paragraph'),
      ]),
      claim(
        'kongo-dating',
        'Missing provenance and precise dating limit firm sequences for surviving crucifixes.',
        [cite('kongo-christianity', 'Final paragraph')],
      ),
    ],
    objectIds: ['met-318323'],
    terms: ['ritual', 'enslavement', 'provenance'],
    dimensions: {
      'Audience and making': {
        text: 'Local makers and users reinterpreted Christian symbols. Practices differed by region and social position.',
        citations: [cite('kongo-christianity', 'Adoption and crucifix discussion')],
      },
      'Surviving evidence': {
        text: 'Crosses, accounts and a bilingual catechism offer unequal access to belief; many objects lack precise provenance.',
        citations: [cite('kongo-christianity', 'Opening and final paragraphs')],
      },
    },
    returnPrompt:
      'Why is translation more than substituting one word—or one symbol—for another?',
  }),
  subject({
    id: 'portuguese-voyage',
    name: 'An ocean route to Calicut',
    aliases: ['Vasco da Gama', 'Portugal', 'Indian Ocean'],
    kind: 'process',
    region: 'Europe',
    place: 'Lisbon, Cape route and Calicut (Kozhikode)',
    coordinates: [-9.14, 38.72],
    geographicPrecision:
      'Departure locator; the route is explained through named places, not an exact ship track.',
    interval: interval(
      1497,
      1499,
      '1497–1499 CE',
      'Dates of da Gama’s voyage in the consulted chronology; not the beginning of Indian Ocean exchange.',
      'exact',
    ),
    packs: ['C6', 'C7'],
    question: 'A new route for whom?',
    summary:
      'Da Gama’s voyage connected Portugal to Calicut around Africa. That was a change in European access to an already active ocean of merchants, ports and textiles. Describing it as the discovery of trade would erase those earlier participants. Follow what newcomers sought, how they entered existing networks, and how commerce became entangled with armed power.',
    sections: [
      sec(
        'A route with an audience',
        'The Interwoven Globe chronology dates the voyage to 1497–99 and the arrival at Calicut to 1498. Its regional timelines also identify Indian textile commerce. Start by asking whose perspective makes a route “new.” A European departure date is not a founding date for all the places visited.',
        cite(
          'interwoven',
          'Portugal chronology, 1497–99; India chronology, 1498 and 1506',
        ),
      ),
      sec(
        'Ports and force',
        'The chronology records the Portuguese conquest of Goa in 1510. An ocean connection could therefore involve seizure and political control as well as negotiated sale. Do not use the same unqualified arrow for all of these actions. Lisbon, Calicut and Goa belong to connected but distinct histories.',
        cite('interwoven', 'India chronology, 1510'),
      ),
      sec(
        'What textiles make visible',
        'Trade cloth moved designs as well as fiber. Commissioning and imitation connected makers and buyers with different preferences. The museum’s examples also connect cloth to the trade in enslaved people. A richly patterned textile can therefore lead into labor and coercion; luxury and suffering are not separate ocean histories.',
        cite('interwoven', 'Exhibition Overview, trade textiles and human cargo'),
      ),
    ],
    claims: [
      claim(
        'gama-voyage',
        'The consulted chronology dates da Gama’s Calicut voyage to 1497–99.',
        [cite('interwoven', 'Portugal chronology')],
      ),
      claim('goa-conquest', 'The Portuguese conquered Goa in 1510.', [
        cite('interwoven', 'India chronology, 1510'),
      ]),
    ],
    objectIds: [],
    terms: ['port', 'colonialism', 'enslavement'],
    dimensions: {
      'Movement and exchange': {
        text: 'The voyage changed Portuguese access to existing Indian Ocean commerce; later conquest of Goa shows the role of force.',
        citations: [cite('interwoven', 'India and Portugal chronologies')],
      },
      'Surviving evidence': {
        text: 'A compiled chronology identifies episodes; it does not supply the experience of every sailor, port worker or merchant.',
        citations: [cite('interwoven', 'Regional chronologies')],
      },
    },
    returnPrompt:
      'How would you retell the same arrival from the perspective of an existing merchant in Calicut?',
  }),
  subject({
    id: 'manila-network',
    name: 'Silver, porcelain and the Pacific',
    aliases: ['Manila galleon', 'Acapulco', 'New Spain'],
    kind: 'process',
    region: 'Americas',
    place: 'Acapulco, Manila and Chinese production centers',
    coordinates: [-99.88, 16.85],
    geographicPrecision:
      'Acapulco port locator. Schematic connection is not a voyage reconstruction.',
    interval: interval(
      1565,
      1815,
      '1565–1815 CE',
      'Historical range of the galleon trade. The C7 display clips at 1800; that is not its end.',
      'exact',
    ),
    packs: ['C7', 'C8'],
    question: 'How far can a fragment take us?',
    summary:
      'Porcelain, silk and other goods traveled through Manila to Acapulco, while American silver moved toward Asian markets. A fragment can make a large network concrete, especially when its archaeological context is known. Mexican ceramics also show local responses to imported designs. Movement changed objects and communities; it did not turn every place into a passive destination.',
    sections: [
      sec(
        'A network across an ocean',
        'Hecht describes cargo moving through the Philippines to Mexico, then sometimes across Mexico and onward to Spain. Some goods remained in the Americas. The route depended on several ports and transfers. It is more precise to describe that mechanism than to place a single magical line between “China” and “Europe.”',
        cite('galleon', 'Main route and cargo paragraphs'),
      ),
      sec(
        'A wreck gives material context',
        'Point Reyes preserves porcelain associated with early contact and the 1595 wreck of San Agustín. The National Park Service distinguishes production types and dates. Its alternative suggestion about porcelain left by Drake remains tentative. Material attribution, wreck context and a proposed historical episode are different levels of evidence.',
        cite('point-reyes', 'Porcelain identification and 1595 shipwreck paragraphs'),
      ),
      sec(
        'Later local transformations',
        'The selected Mexican jar is dated approximately 1680–1700, after the journey’s 1450–1650 focus. It belongs to the later life of the network, not a scene fixed at 1600. Hecht uses Mexican ceramics to discuss responses to Asian wares. Compare material and decoration while keeping the particular jar’s catalogue facts separate from a claim about every workshop.',
        cite('met-9198', 'Artwork Details'),
        cite('galleon', 'Mexican ceramics discussion'),
      ),
    ],
    claims: [
      claim('galleon-range', 'The Manila galleon trade is dated 1565–1815.', [
        cite('galleon', 'Title and route discussion'),
      ]),
      claim(
        'agustin-wreck',
        'San Agustín was wrecked in Drakes Bay in 1595 with porcelain aboard.',
        [cite('point-reyes', 'Shipwreck paragraph')],
      ),
    ],
    objectIds: ['met-9198'],
    terms: ['port', 'provenance', 'archaeology'],
    dimensions: {
      'Audience and making': {
        text: 'Chinese goods moved into American markets, where imported wares also informed local ceramics. Individual workshop histories still require object evidence.',
        citations: [cite('galleon', 'Route and ceramics')],
      },
      'Surviving evidence': {
        text: 'Wreck-associated fragments give archaeological context; the Mexican jar shows a later phase, not cargo identified from the 1595 wreck.',
        citations: [
          cite('point-reyes', 'Shipwreck'),
          cite('met-9198', 'Date and Geography'),
        ],
      },
    },
    returnPrompt:
      'Why can an excavated fragment establish some connections more securely than a beautiful unprovenanced object?',
  }),
  subject({
    id: 'ming-workshops',
    name: 'Ming workshops and court design',
    aliases: ['Ming China', 'Jingdezhen'],
    kind: 'period',
    region: 'East Asia',
    place: 'China; Jingdezhen ceramic production',
    coordinates: [117.2, 29.3],
    geographicPrecision:
      'Production center locator, not a boundary of artistic influence.',
    interval: interval(
      1368,
      1644,
      '1368–1644 CE',
      'Conventional Ming dynastic period. Individual works and trade routes retain their own dates.',
      'exact',
    ),
    packs: ['C6', 'C7'],
    question: 'Who decided what a beautiful object should look like?',
    summary:
      'Ming decorative arts combined workshop skill, court requirements and inherited forms shaped by exchange. The jar with carp in a lotus pond makes that work visible in porcelain and colored decoration. A dynasty’s art was not one uniform style. Court taste, production technique and markets help explain different choices within a shared political period.',
    sections: [
      sec(
        'Materials and close looking',
        'The selected jar combines underglaze cobalt blue with colors applied over the glaze. Its catalogue dates it to the middle sixteenth century and associates it with the Jiajing period. Notice fish and plants before assigning symbolism. Technical identification and a proposed meaning are different claims.',
        cite('met-42549', 'Title; Date, Period and Medium'),
      ),
      sec(
        'A court and a design system',
        'The museum’s Ming essay identifies a court Bureau of Design that established standards for imperial decorative production. It also describes West Asian connections in the earlier development of blue-and-white porcelain and cloisonné. Imported ideas did not remove the agency of local makers; court regulation did not make every produced object an imperial commission.',
        cite('ming', 'Final decorative-arts paragraphs'),
      ),
      sec(
        'A comparison of intended audiences',
        'Set the jar beside the Benin saltcellar. Both involve specialized materials and meaningful decoration, but the selected sources identify different settings: imperial ceramic production and a work for a foreign patron. Ask what each account actually establishes about audience. Do not infer a documented trade journey for this jar from the existence of Pacific porcelain commerce.',
        cite('met-42549', 'Catalogue entry'),
        cite('met-309900', 'Commission and proposed set'),
        cite('ming', 'Bureau of Design paragraph'),
      ),
    ],
    claims: [
      claim('ming-dates', 'The Ming period is conventionally dated 1368–1644.', [
        cite('ming', 'Title'),
      ]),
      claim(
        'ming-jar',
        'The selected jar is mid-sixteenth-century Jingdezhen porcelain with underglaze and overglaze decoration.',
        [cite('met-42549', 'Date and Medium')],
      ),
    ],
    objectIds: ['met-42549'],
    terms: ['dynasty', 'material culture', 'inference'],
    dimensions: {
      'Audience and making': {
        text: 'The catalogue places this jar in Jiajing-era ceramic production; the Ming essay documents a court Bureau of Design for imperial wares.',
        citations: [
          cite('met-42549', 'Period and catalogue'),
          cite('ming', 'Final paragraph'),
        ],
      },
      'Surviving evidence': {
        text: 'The vessel preserves material and decoration; it is not identified here as a specific galleon cargo.',
        citations: [cite('met-42549', 'Artwork Details')],
      },
    },
    returnPrompt:
      'What would you need to show that a particular pot was made for a particular buyer?',
  }),
  subject({
    id: 'mughal-books',
    name: 'Akbar’s books and translators',
    aliases: ['Mughal India', 'Akbar', 'Harivamsa'],
    kind: 'period',
    region: 'South Asia',
    place: 'Mughal courts at Fatehpur Sikri and Lahore',
    coordinates: [74.35, 31.55],
    geographicPrecision:
      'Lahore is the probable place of the selected painting; the court moved.',
    interval: interval(
      1556,
      1605,
      '1556–1605 CE',
      'Akbar’s reign; not the entire Mughal state’s lifespan.',
      'exact',
    ),
    packs: ['C7'],
    question: 'What happens when a story meets a new language and audience?',
    summary:
      'A painting of Krishna sheltering villagers belonged to a courtly translation project under Akbar. Persian and Indian artists, including Muslims and Hindus, worked within the royal atelier. Their books show deliberate acts of interpretation. Court patronage could bring traditions into contact while remaining an expression of imperial power, rather than a picture of everyone’s religious life.',
    sections: [
      sec(
        'A scene, not a photograph',
        'The painting represents Krishna holding up Mount Govardhan to shelter villagers from rain. Its production around 1590–95 is different from the time represented in the sacred story. We can study the scene’s composition and patronage without claiming that the painting is eyewitness evidence for the narrated event.',
        cite('met-448183', 'Description; Date'),
      ),
      sec(
        'Translation and artistic invention',
        'The object record places the translation and illustration of Hindu epics and the Harivamsa within Akbar’s reign. The artists needed new compositions rather than simply inheriting an established Iranian manuscript design for these works. Translation occurred in words and images together.',
        cite('met-448183', 'Opening description'),
      ),
      sec(
        'An imperial workshop in a connected region',
        'The Mughal essay describes a collaborative atelier and Akbar’s access to Gujarat’s commercial centers and the Arabian Sea. A religiously diverse workshop is evidence about selected artists and patronage, not proof of equal power for all communities. Comparing it with Kongo’s translation history reveals different institutions and surviving sources rather than one universal model of exchange.',
        cite('mughal', 'Gujarat and royal atelier paragraphs'),
        cite('kongo-christianity', 'Translation and uneven adoption'),
      ),
    ],
    claims: [
      claim('akbar-range', 'Akbar reigned 1556–1605.', [
        cite('mughal', 'Akbar paragraph'),
      ]),
      claim(
        'harivamsa-production',
        'The selected folio is dated approximately 1590–95 and depicts Krishna sheltering villagers.',
        [cite('met-448183', 'Date; Description')],
      ),
    ],
    objectIds: ['met-448183'],
    terms: ['dynasty', 'iconography', 'evidence'],
    dimensions: {
      'Audience and making': {
        text: 'A royal atelier translated and illustrated sacred narratives for a courtly project; artists drew on several traditions.',
        citations: [cite('mughal', 'Royal atelier'), cite('met-448183', 'Description')],
      },
      'Surviving evidence': {
        text: 'A manuscript page preserves a historical representation of a sacred story; its making date is not the story’s date.',
        citations: [cite('met-448183', 'Description and Date')],
      },
    },
    returnPrompt:
      'What can a painting establish about its makers and patrons, even when it cannot verify the events in its story?',
  }),
  subject({
    id: 'banda-1621',
    name: 'Banda: monopoly and forced displacement',
    aliases: ['Banda Islands', 'VOC', 'Dutch East India Company'],
    kind: 'process',
    region: 'Southeast Asia/Oceania',
    place: 'Banda Islands, present-day Indonesia',
    coordinates: [129.9, -4.52],
    geographicPrecision: 'Island-group locator, not a battle map.',
    interval: interval(
      1621,
      1621,
      '1621 CE',
      'The dated conquest investigated here; Bandanese history extends before and after this event.',
      'exact',
    ),
    packs: ['C7'],
    question: 'Whose account survives when trade becomes conquest?',
    summary:
      'Bandanese people traded with several visiting groups. The Dutch East India Company sought control of nutmeg and mace. In 1621 its campaign under Jan Pieterszoon Coen brought killing, enslavement and displacement. A surviving company letter is evidence of colonial decisions and resistance, but it is not a neutral account of the people attacked.',
    sections: [
      sec(
        'A demand for exclusive trade',
        'The Dutch National Archives describes attempts to obtain a monopoly and the inhabitants’ refusal to accept company terms. A monopoly means trying to exclude other buyers and sellers. This was a struggle over who could make decisions about trade and place, not merely the discovery of a spice.',
        cite('banda-archive', 'Genocide op Banda section'),
      ),
      sec(
        'Read the official’s purposes',
        'Coen’s letter of 6 May 1621 describes terrain, resistance, food and company manpower. In the archive’s transcription, he discusses driving opponents out through hunger. Such a document makes a policy visible. It also requires source criticism: an official reporting to superiors chooses how to portray his own decisions and those resisting him.',
        cite(
          'banda-archive',
          'Original letter: VOC archive 1.04.02, inventory 1073; transcription',
        ),
      ),
      sec(
        'Keep consequences and uncertainty visible',
        'The archive characterizes the campaign as genocide and records mass death, flight and enslavement. This atlas uses a non-graphic introduction and does not repeat a precise casualty total as settled fact. The survival of an official letter gives the company disproportionate space in the record; a fuller history must seek Bandanese lives and memory beyond that author’s frame.',
        cite(
          'banda-museum',
          'Monopolie op handel; eerste op slavernij gebaseerde kolonie',
        ),
        cite('banda-archive', 'Letter context'),
      ),
    ],
    claims: [
      claim('banda-campaign', 'Coen led the VOC campaign against Banda in 1621.', [
        cite('banda-archive', 'Genocide op Banda'),
      ]),
      claim('banda-letter', 'The archive presents Coen’s report dated 6 May 1621.', [
        cite('banda-archive', 'Letter caption, inventory 1073'),
      ]),
    ],
    objectIds: [],
    terms: ['colonialism', 'enslavement', 'archive'],
    dimensions: {
      Authority: {
        text: 'The VOC sought exclusive spice commerce through coercive control. Bandanese resistance appears even in the company record.',
        citations: [cite('banda-archive', 'Genocide section and letter')],
      },
      'Surviving evidence': {
        text: 'The letter is a colonial official’s account to his superiors. Its perspective must be analyzed rather than accepted as neutral.',
        citations: [cite('banda-archive', 'Coen letter, 6 May 1621')],
      },
    },
    returnPrompt:
      'Which question can Coen’s letter help answer, and whose experience does it leave harder to recover?',
  }),
];
oceanSources.push({
  id: 'kongo-interview',
  title: 'Kongo Christianity: The Intersection of Two Worlds',
  url: 'https://www.metmuseum.org/perspectives/kongo-christianity-intersection-two-worlds',
  institution: 'The Metropolitan Museum of Art',
  author: 'Cécile Fromont, interview',
  type: 'scholarship',
  accessed: '2026-10-26',
  scope:
    'Early Christian history; discussion of Atlantic enslavement, conversion and political fragility.',
});
export const oceanRelations: Relation[] = [
  {
    id: 'pacific-exchange',
    notBefore: 1565,
    from: 'ming-workshops',
    to: 'manila-network',
    type: 'trade',
    date: 'From 1565; selected later material through 1700',
    explanation:
      'Chinese wares moved through Manila to Acapulco in a network exchanging Asian goods and American silver. The selected Ming jar is contextual evidence for production, not identified cargo of a particular voyage.',
    citations: [
      cite('galleon', 'Main route paragraph'),
      cite('point-reyes', 'Cargo and wreck discussion'),
    ],
    status: 'published',
    route: [
      [117.2, 29.3],
      [120.98, 14.6],
      [150, 30],
      [180, 38],
      [-150, 38],
      [-120, 34],
      [-99.88, 16.85],
    ],
  },
];
export const oceanJourney: Journey = {
  id: 'ocean-connections',
  title: 'Ocean connections, 1450–1650',
  question: 'Who gained, who made, and who paid for ocean connections?',
  duration: '30–45 minutes, or one encounter at a time',
  introduction:
    'Follow a route into an ocean that already had merchants and communities. Inspect African ivory, a Mughal manuscript and Chinese porcelain, then ask how patronage, translation, colonial force and resistance produced different kinds of connection.',
  stops: [
    {
      subject: 'portuguese-voyage',
      year: 1498,
      title: 'A new route for whom?',
      narrative:
        'Locate Portugal and Calicut. Explain what changed for European access while preserving the existing lives and commerce of Indian Ocean ports.',
    },
    {
      subject: 'benin-ivory',
      year: 1550,
      title: 'African artists picture their visitors',
      narrative:
        'Look closely at rank, dress and pose. The commission links makers and patrons; do not assume the artist simply copied a European world.',
      object: 'met-309900',
    },
    {
      subject: 'kongo-translation',
      year: 1600,
      title: 'Translation makes new meanings',
      narrative:
        'Study a crucifix and the history of interpreters. Separate a ruler’s baptism, local practices and the long life of a religious tradition.',
      object: 'met-318323',
    },
    {
      subject: 'mughal-books',
      year: 1595,
      title: 'A story becomes a courtly book',
      narrative:
        'Observe Krishna sheltering the villagers. Distinguish the production of this painting from the sacred story it represents.',
      object: 'met-448183',
    },
    {
      subject: 'ming-workshops',
      year: 1550,
      title: 'Court design and skilled work',
      narrative:
        'Inspect the jar’s fish and plants. Compare production and intended audiences with Benin ivory; a material resemblance cannot provide a shipping history.',
      object: 'met-42549',
      compare: 'benin-ivory',
    },
    {
      subject: 'manila-network',
      year: 1600,
      title: 'An ocean network and its later echoes',
      narrative:
        'Trace China, Manila and Acapulco. The Mexican jar shown in the dossier is later, around 1680–1700. Use archaeological wreck evidence for the earlier network; keep the chronology visible.',
      relation: 'pacific-exchange',
    },
    {
      subject: 'banda-1621',
      year: 1621,
      title: 'Read a company letter against its grain',
      narrative:
        'The VOC’s surviving account describes policy and resistance. Consider the author’s purpose and the people whose voices are not preserved in this letter. Connections could be coercive, and people contested them.',
    },
  ],
  conclusion:
    'Ocean connections were made through skilled work, interpretation and political decisions. They also involved conquest, enslavement and resistance. A specific commission, a translation, a wreck and an official letter support different claims. No single arrow can explain all of them.',
  evidence: {
    prompt: 'What is a defensible use of Coen’s 1621 letter?',
    options: [
      {
        text: 'Treat it as a neutral account of every Bandanese person’s experience.',
        supported: false,
        feedback:
          'The author was a company official writing to superiors. His purposes and omissions matter.',
      },
      {
        text: 'Use it to investigate company policy and resistance, while seeking other perspectives.',
        supported: true,
        feedback:
          'The letter supports a limited analysis of decisions and reported resistance; it cannot replace the experiences of those attacked.',
      },
      {
        text: 'Assume that profitable exchange benefited everyone equally.',
        supported: false,
        feedback:
          'The documented killing, enslavement and displacement directly challenge that assumption.',
      },
    ],
    citations: [cite('banda-archive', 'Coen letter and contextual discussion')],
  },
  returnPrompt:
    'Choose two ocean connections. How did their mechanisms, power relationships and surviving evidence differ?',
};
