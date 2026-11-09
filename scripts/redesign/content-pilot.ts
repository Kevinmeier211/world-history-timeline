import { cite, claim, interval, metEssay, sec, subject } from './content-helpers';
import type { Source, Subject, Relation, Journey } from '../../src/atlas/model';
export const pilotSources: Source[] = [
  metEssay(
    'han',
    'Han Dynasty (206 B.C.–220 A.D.)',
    'han-dynasty-206-b-c-220-a-d',
    'Eastern Han paragraphs: Luoyang, trade and diplomacy.',
    'Department of Asian Art',
    '2000-10',
  ),
  metEssay(
    'models',
    'Modeling the World: Ancient Architectural Models Now on View',
    'unused',
    'Han and Colima paragraphs; current catalogue discrepancy.',
    'Joanne Pillsbury',
    '2015-11-06',
  ),
  metEssay(
    'rome',
    'The Roman Empire (27 B.C.–393 A.D.)',
    'the-roman-empire-27-b-c-393-a-d',
    'Severans and late empire sections; title does not define the lifespan of Roman state identity.',
    'Christopher Lightfoot',
    '2000-10',
  ),
  metEssay(
    'trade',
    'Trade between the Romans and the Empires of Asia',
    'trade-between-the-romans-and-the-empires-of-asia',
    'Trading posts; Palmyra–Ctesiphon; monsoon sea routes.',
    'Department of Ancient Near Eastern Art',
    '2000-10',
  ),
  metEssay(
    'kushan',
    'Kushan Empire (ca. Second Century B.C.–Third Century A.D.)',
    'kushan-empire-ca-second-century-b-c-third-century-a-d',
    'Trade, Gandhara and royal coinage. Older chronology is not silently harmonized with the current coin record.',
    'Department of Asian Art',
    '2000-10',
  ),
  metEssay(
    'parthia',
    'The Parthian Empire (247 B.C.–224 A.D.)',
    'the-parthian-empire-247-b-c-224-a-d',
    'History; Parthian Art sections.',
    'Department of Ancient Near Eastern Art',
    '2000-10',
  ),
  metEssay(
    'aksum',
    'Monumental Architecture of the Aksumite Empire',
    'monumental-architecture-and-stelae-of-the-aksumite-empire',
    'Opening history; residential and funerary architecture.',
    'Kristen Windmuller-Luna',
    '2015-04',
  ),
  metEssay(
    'teotihuacan',
    'Teotihuacan',
    'teotihuacan',
    'Introduction; City Layout and Monumental Architecture.',
    'Trenton Barnes',
    '2024-03',
  ),
  metEssay(
    'moche',
    'Moche Decorated Ceramics',
    'moche-decorated-ceramics',
    'Opening, production and uses of pottery.',
    'Hélène Bernier',
    '2009-08',
  ),
  {
    id: 'kanishka-chronology',
    title: 'Kushan: Kanishka I, coin 18202384',
    url: 'https://ikmk.smb.museum/object?id=18202384&lang=en',
    institution: 'Münzkabinett, Staatliche Museen zu Berlin',
    type: 'catalogue',
    accessed: '2026-10-26',
    scope:
      'Date ca. 127/128–150/151; further information explicitly notes disputed Kushan dating.',
  },
];
pilotSources.find((s) => s.id === 'models')!.url =
  'https://www.metmuseum.org/perspectives/modeling-the-world-ancient-architectural-models';
export const pilotSubjects: Subject[] = [
  subject({
    id: 'eastern-han',
    name: 'Eastern Han',
    aliases: ['Later Han', 'Han China'],
    kind: 'period',
    region: 'East Asia',
    place: 'Luoyang and Han-ruled regions of China',
    coordinates: [112.45, 34.62],
    geographicPrecision:
      'Capital locator; no territorial boundary or object findspot implied.',
    interval: interval(
      25,
      220,
      '25–220 CE',
      'Eastern phase of Han rule, not the beginning or end of Chinese society.',
      'exact',
    ),
    packs: ['C4'],
    question: 'Why put a building in a tomb?',
    summary:
      'A glazed clay tower opens a question about life and death. Eastern Han elites placed models of buildings in tombs. The models evoke estates, storage and security, while their burial setting points toward hopes for an afterlife. They are selective representations made for particular people: a miniature estate cannot tell us how every family lived.',
    sections: [
      sec(
        'Buildings for another life',
        'The tower’s platforms and roofs invite close looking before interpretation. Its museum date spans the first through early third century; the object was not necessarily made in our anchor year, 200 CE. The Met identifies pottery buildings as provisions for the afterlife. That context changes the question: this is neither a surviving house nor evidence that everyone lived in towers.',
        cite('met-49519', 'Description; Artwork Details: Date, Period and Medium'),
      ),
      sec(
        'Work behind an estate',
        'Curator Joanne Pillsbury connects Han models with wells, grain storage, animal pens and security on larger estates. A model could express the status of an owner and the wish for continued comfort after death. Read it alongside the granary and well models: the estate depended on food, water and labor, not simply imposing architecture. The people who sustained such places are less individually visible than the privileged people commemorated by these burials.',
        cite(
          'models',
          'Paragraphs beginning “The Met’s collection also includes” and “As with the Egyptian models”',
        ),
      ),
      sec(
        'A capital in a wider network',
        'Eastern Han rulers governed from Luoyang. The museum’s Han history describes expanded Central Asian trade and diplomatic visitors. Networks connected people through many intermediaries. The tower itself supplies no evidence that its owner traveled those routes, and it does not prove contact with the makers of a similar architectural model in Mexico.',
        cite('han', 'Eastern Han paragraphs on Luoyang, Ban Chao and diplomacy'),
      ),
    ],
    claims: [
      claim('han-dates', 'The Eastern Han period is dated 25–220 CE.', [
        cite('met-49519', 'Period: Eastern Han dynasty (25–220)'),
      ]),
      claim(
        'han-models',
        'Pottery building models in Eastern Han tombs could provide for an afterlife.',
        [cite('met-49519', 'Opening description')],
      ),
    ],
    objectIds: ['met-49519', 'met-52010', 'met-52527'],
    terms: ['tomb', 'estate', 'afterlife', 'evidence'],
    dimensions: {
      'Belief and expression': {
        text: 'Building models placed in tombs could provide for an afterlife; elite hopes are especially visible.',
        citations: [cite('models', 'Han architectural model paragraphs')],
      },
      'Work and production': {
        text: 'Models depict granaries, wells and animal pens, making estate provisioning visible without representing every household.',
        citations: [cite('models', 'Agricultural structures paragraph')],
      },
    },
    returnPrompt: 'What can a tomb model tell us—and what can it leave out?',
  }),
  subject({
    id: 'colima',
    name: 'Colima architectural models',
    aliases: ['Temple Model', 'West Mexico'],
    kind: 'society',
    region: 'Americas',
    place: 'Colima, western Mexico',
    coordinates: [-103.72, 19.24],
    geographicPrecision: 'Regional locator, not an excavation site.',
    interval: interval(
      -200,
      200,
      '200 BCE–200 CE',
      'Date of the selected temple model; not a lifespan assigned to an entire people.',
      'range',
    ),
    packs: ['C3', 'C4'],
    question: 'Does a small building have to be a toy?',
    summary:
      'This ceramic platform carries a roofed building, but its purpose may have been very different from a playhouse. The current catalogue suggests it once covered an incense burner. Set beside the Han tower, it helps us compare how buildings could be made meaningful in miniature without assuming identical beliefs or historical contact.',
    sections: [
      sec(
        'Observe before naming a purpose',
        'Look for the platform, the roof and the space between them. These are observations about the object’s form. Calling it the lid of an incense burner is an interpretation: the Met deliberately uses tentative language. Keep that difference visible when making a claim. Shape alone does not identify all the actions that once surrounded an object.',
        cite('met-317600', 'Opening description; Artwork Details'),
      ),
      sec(
        'Two published date ranges',
        'The current object record gives 200 BCE–200 CE. Pillsbury’s 2015 essay captions the same accession as 200 BCE–300 CE. This atlas uses the current catalogue range and preserves the older range in the object note. Neither date range establishes that this model and the Han tower were made in the same year.',
        cite('met-317600', 'Artwork Details: Date'),
        cite('models', 'Opening image caption, accession 1995.63.5'),
      ),
      sec(
        'Comparison has limits',
        'Architectural miniatures could be ritual vessels, offerings or representations of meaningful spaces. The comparison is a question about form, possible use and confidence. There is no evidence in these two records for contact between their makers. Similarity is a starting point for investigation; it cannot supply the missing historical mechanism.',
        cite('models', 'Opening and concluding discussion of architectural effigies'),
      ),
    ],
    claims: [
      claim(
        'colima-date',
        'The current catalogue dates accession 1995.63.5 to 200 BCE–200 CE.',
        [cite('met-317600', 'Artwork Details: Date')],
        'A 2015 essay ends the range at 300 CE; the current catalogue is followed.',
      ),
      claim(
        'colima-use',
        'The model may have served as an incense-burner lid.',
        [cite('met-317600', 'Opening description')],
        'Possible function, not a demonstrated universal use.',
      ),
    ],
    objectIds: ['met-317600'],
    terms: ['ritual', 'inference', 'chronology'],
    dimensions: {
      'Belief and expression': {
        text: 'The temple model may have covered an incense burner. Its precise function remains an interpretation.',
        citations: [cite('met-317600', 'Opening description')],
      },
      'Work and production': {
        text: 'The small building and platform are made of ceramic; the model represents architecture rather than preserving a full-size building.',
        citations: [cite('met-317600', 'Medium; description')],
      },
    },
    returnPrompt:
      'Which part of our explanation was an observation, and which was an interpretation?',
  }),
  subject({
    id: 'roman-world',
    name: 'The Roman world around 200',
    aliases: ['Roman Empire', 'Rome', 'Severans'],
    kind: 'period',
    region: 'Europe',
    place: 'Mediterranean world; Rome as locator',
    coordinates: [12.5, 41.9],
    geographicPrecision:
      'Rome is one center of an empire extending across several continents.',
    interval: interval(
      193,
      235,
      '193–235 CE',
      'Severan political period; this is not the full lifespan of Roman history.',
      'exact',
    ),
    packs: ['C4'],
    question: 'How did an imperial family make itself visible?',
    summary:
      'A tiny engraved portrait carries a large political message. Julia Domna, from Syria, became part of Rome’s ruling family. Her image circulated within a wider campaign of dynastic representation. The Roman world crossed the Mediterranean’s regional divisions; an emperor’s capital cannot stand in for all the people living under imperial rule.',
    sections: [
      sec(
        'Power seen at close range',
        'The portrait of Julia Domna is cut into beryl. The catalogue dates it approximately 200–210 CE. Its identification links the image to a woman from Syria who was wife of Septimius Severus and mother of Caracalla and Geta. A small object can carry a ruler’s identity beyond a palace. Its survival does not tell us how often an ordinary person saw such a gem.',
        cite('met-251870', 'Description; Date and Medium'),
      ),
      sec(
        'An army and a dynasty',
        'Septimius Severus took power in 193 after civil conflict. Lightfoot describes a regime grounded in military support and a ruling family with increasingly visible Syrian connections. Imperial stability was therefore political work, not an automatic feature of a colored ribbon on a timeline. A dynastic period is one useful window into the continuing state.',
        cite('rome', 'The Severans and the Soldier-Emperors, opening paragraph'),
      ),
      sec(
        'A wider human world',
        'The portrait of Eutyches from Roman Egypt combines a Greek inscription, a Roman tunic and Egyptian funerary practice. The museum identifies him as a freedman, while parts of the inscription remain disputed. His image resists treating “Roman” as one uniform culture. Compare this personal commemoration with Julia Domna’s dynastic image: both are portraits, but their settings and kinds of power differ.',
        cite(
          'met-547951',
          'Description: inscription, clothing, and mummy portrait use',
        ),
      ),
    ],
    claims: [
      claim(
        'severan-dates',
        'The Severan dynasty is presented here as a period beginning in 193 and ending in 235 CE.',
        [cite('rome', 'The Severans and the Soldier-Emperors')],
      ),
      claim(
        'julia-image',
        'Julia Domna’s portrait was distributed in dynastic representation.',
        [cite('met-251870', 'Description, last sentence')],
      ),
    ],
    objectIds: ['met-251870', 'met-547951', 'met-256732'],
    terms: ['dynasty', 'empire', 'freedman'],
    dimensions: {
      Authority: {
        text: 'Severan power relied heavily on the army and dynastic claims; portrait images helped represent that family.',
        citations: [cite('rome', 'Severans'), cite('met-251870', 'Description')],
      },
      'Surviving evidence': {
        text: 'An engraved elite portrait and an Egyptian funerary painting preserve different kinds of identity and social status.',
        citations: [
          cite('met-251870', 'Description'),
          cite('met-547951', 'Description'),
        ],
      },
    },
    returnPrompt: 'Why is “Roman” a political label as well as a cultural question?',
  }),
  subject({
    id: 'palmyra',
    name: 'Palmyra',
    aliases: ['Tadmor'],
    kind: 'place',
    region: 'West/Central Asia',
    place: 'Syrian desert, present-day Syria',
    coordinates: [38.27, 34.56],
    geographicPrecision: 'City locator; no exact itinerary for an individual merchant.',
    interval: interval(
      100,
      299,
      '2nd–3rd centuries CE',
      'Window of the selected funerary relief, not the city’s entire history.',
      'range',
    ),
    packs: ['C4'],
    question: 'Can a family portrait illuminate a trading city?',
    summary:
      'A reclining man and three children are named on a limestone funerary relief. Their commemoration belongs to Palmyra, a city on caravan routes between Roman Mediterranean ports and the Parthian world. The sculpture makes family identity and artistic choices visible. Its inscriptions tell us more about these people than an anonymous dot on a trade map could.',
    sections: [
      sec(
        'A family named in stone',
        'The relief identifies Zabdibol, a son named Mokimu and daughters Tadmur and Alayyat. The museum interprets the banquet scene as a marker that probably closed a family burial niche. Dress, jewelry and pose offered ways to commemorate the dead. The representation is intentional, rather than an unposed picture of a family meal.',
        cite('met-322375', 'Inscription and first descriptive paragraph'),
      ),
      sec(
        'Routes involve places and people',
        'The Met traces routes from Antioch through Palmyra toward Ctesiphon and beyond. Goods moved through trading posts and different forms of exchange; no single road or traveler linked every endpoint. Palmyra’s art drew on Iranian and Greco-Roman visual practices. A defensible connection needs both a mechanism and evidence, not merely overlapping dates.',
        cite('trade', 'Trading-post paragraph'),
        cite('met-322375', 'Palmyra and artistic traditions paragraphs'),
      ),
      sec(
        'Whose voices survive?',
        'A purchased stone memorial preserves the choices of a family able to commemorate itself this way. It is unusually informative about names and ancestry, but does not represent every worker, enslaved person or traveler in the city. Ask what an inscription, a surviving road and an excavated cargo could each add; they answer different questions.',
        cite('met-322375', 'Inscription; burial-compartment discussion'),
      ),
    ],
    claims: [
      claim(
        'palmyra-route',
        'Palmyra linked Roman-controlled Mediterranean ports with the Parthian Near East through caravan routes.',
        [cite('met-322375', 'Paragraph beginning “By the mid-first century”')],
      ),
      claim('palmyra-family', 'The relief names a man, his son and two daughters.', [
        cite('met-322375', 'Inscription translation'),
      ]),
    ],
    objectIds: ['met-322375'],
    terms: ['caravan', 'inscription', 'inference'],
    dimensions: {
      Authority: {
        text: 'The selected source illuminates a commemorating family and a trading city rather than defining an imperial dynasty.',
        citations: [cite('met-322375', 'Description')],
      },
      'Surviving evidence': {
        text: 'A funerary relief preserves named kin and a chosen visual identity; it is not a census of the city.',
        citations: [cite('met-322375', 'Inscription and burial marker discussion')],
      },
    },
    returnPrompt: 'What can a family inscription tell us that a route line cannot?',
  }),
  subject({
    id: 'kushan-contexts',
    name: 'Kushan worlds',
    aliases: ['Kushan Empire', 'Gandhara', 'Kanishka'],
    kind: 'political entity',
    region: 'South Asia',
    place: 'Gandhara and adjoining Central/South Asian regions',
    coordinates: [71.57, 34.01],
    geographicPrecision:
      'Peshawar regional anchor; not a precise coin findspot or territorial outline.',
    interval: interval(
      1,
      300,
      'Early centuries CE',
      'Focus window for imperial Kushan contexts; boundaries and rulers’ chronologies are debated.',
      'approximate',
    ),
    packs: ['C4'],
    question: 'What could a coin communicate?',
    summary:
      'Kushan rulers used gold coinage and images of rulers and deities in a region connected to both inland and maritime exchange. The selected Kanishka coin is catalogued around 130 CE. It is evidence of royal representation; by itself it cannot tell us the religion, income or travel history of everyone who handled Kushan money.',
    sections: [
      sec(
        'A ruler on a small surface',
        'Inspect the coin’s two sides. The museum describes Kushan gold coins as following a Roman weight standard and presenting rulers alongside different religious figures. A shared standard can matter for exchange, but the object does not prove an individual journey from Rome. A catalogue place attribution must also be distinguished from a documented excavation findspot.',
        cite('met-39385', 'Description; Artwork Details'),
      ),
      sec(
        'A crossroads with intermediaries',
        'The Met locates Kushan regions within both the sea trade of northwest India and overland routes toward China. Gandhara was not an empty bridge between bigger civilizations: it had urban and religious lives, crafts and varied communities. Connections created opportunities for exchange without turning all participants into one society.',
        cite('kushan', 'Opening and Gandhara paragraphs'),
      ),
      sec(
        'Chronology is a research question',
        'The older Met essay places Kanishka’s rule earlier than the chronology now used by Berlin’s coin catalogue, which gives approximately 127/128–150/151 and explicitly notes dispute. This atlas preserves the Met object date around 130 and avoids using an exact accession date to anchor every event in Kushan history. The early-centuries window is a contextual frame, not a pair of newly asserted founding and dissolution years.',
        cite('kushan', 'Kanishka paragraph'),
        cite('kanishka-chronology', 'Date; Further information'),
      ),
    ],
    claims: [
      claim(
        'kushan-connections',
        'Kushan-ruled regions participated in both overland and maritime exchange.',
        [cite('kushan', 'Opening paragraph')],
      ),
      claim(
        'kushan-coin-date',
        'The Met dates its Kanishka coin approximately 130 CE.',
        [cite('met-39385', 'Date')],
        'Kushan ruler chronologies have been revised and remain debated.',
      ),
    ],
    objectIds: ['met-39385'],
    terms: ['coinage', 'provenance', 'chronology'],
    dimensions: {
      Authority: {
        text: 'Coin images present rulers and religious figures; they communicate royal choices rather than a survey of everyone’s beliefs.',
        citations: [cite('met-39385', 'Description')],
      },
      'Surviving evidence': {
        text: 'Coinage supports questions about representation and monetary standards; circulation requires further find evidence.',
        citations: [cite('met-39385', 'Description')],
      },
    },
    returnPrompt: 'What additional evidence would show where a coin actually traveled?',
  }),
  subject({
    id: 'aksum',
    name: 'Aksum and Adulis',
    aliases: ['Axum', 'Aksumite Empire'],
    kind: 'political entity',
    region: 'Africa',
    place: 'Northern Ethiopia and Eritrea; Red Sea connections',
    coordinates: [38.72, 14.13],
    geographicPrecision: 'Aksum city locator; Adulis is a distinct coastal port.',
    interval: interval(
      1,
      800,
      '1st–8th centuries CE',
      'Broad conventional flourishing in the consulted architectural essay; not exact founding and extinction.',
      'approximate',
    ),
    packs: ['C4', 'C5'],
    question: 'How could an inland city connect to the sea?',
    summary:
      'Aksum’s highland center was connected through the port of Adulis to Red Sea exchange. Architecture, inscriptions and coins offer different routes into its history. Surviving monuments are not all contemporary with 200 CE: many famous stelae belong to the third and fourth centuries. Our anchor opens a wider sequence rather than freezing every object into one year.',
    sections: [
      sec(
        'Highland and coast',
        'Windmuller-Luna describes trade through Adulis as important to Aksum’s urban growth. The highland capital and coastal port performed different roles. A map should make that separation legible, rather than suggesting the capital itself was a harbor. The Roman grape-shaped bottle is a comparison for a type found at Aksum; the museum does not identify this particular bottle as excavated there.',
        cite('aksum', 'Opening paragraph; discussion of Roman glass'),
        cite('met-256732', 'Artwork Details'),
      ),
      sec(
        'Architecture and social difference',
        'The archaeological account distinguishes palaces and central pavilions from stone-and-mud houses on nearby slopes. Stelae and tombs show investment in commemoration. Monumental visibility should not erase ordinary housing or encourage us to assume that everyone occupied a palace.',
        cite('aksum', 'Residential center and dwellings paragraphs'),
      ),
      sec(
        'Change continues after 200',
        'Ezana’s conversion around 330 and the change in imagery on coins belong to a later phase. Multilingual inscriptions and different languages on coins reveal choices about audiences. These are specific forms of evidence for communication, not grounds for assuming every resident shared the same beliefs or language.',
        cite('aksum', 'Ezana, inscriptions and coinage paragraphs'),
      ),
    ],
    claims: [
      claim('aksum-port', 'Aksum’s trade connected through Adulis.', [
        cite('aksum', 'Opening paragraph'),
      ]),
      claim(
        'aksum-stelae',
        'Major stelae are dated indirectly to the third and fourth centuries.',
        [cite('aksum', 'Stelae chronology paragraph')],
        'Indirect dating; they cannot all illustrate an exact 200 CE scene.',
      ),
    ],
    objectIds: ['met-256732'],
    terms: ['port', 'stele', 'provenance'],
    dimensions: {
      'Movement and exchange': {
        text: 'The port of Adulis connected a highland center to Red Sea exchange.',
        citations: [cite('aksum', 'Opening paragraph')],
      },
      'Surviving evidence': {
        text: 'Architecture, inscriptions and coinage reveal different periods; Roman glass offers material evidence that must be tied to find context.',
        citations: [cite('aksum', 'Architecture and glass discussion')],
      },
    },
    returnPrompt: 'Why does a trading city need routes beyond its own streets?',
  }),
  subject({
    id: 'teotihuacan',
    name: 'Teotihuacan',
    kind: 'place',
    region: 'Americas',
    place: 'Basin of Mexico',
    coordinates: [-98.84, 19.69],
    geographicPrecision: 'Archaeological city locator.',
    interval: interval(
      -100,
      800,
      'c. 100 BCE–800 CE',
      'Broad city chronology in Barnes’s essay; buildings and population changed within it.',
      'approximate',
    ),
    packs: ['C3', 'C4', 'C5'],
    question: 'What can a city plan reveal about collective life?',
    summary:
      'Large platforms and a planned street grid gave Teotihuacan a powerful spatial order. Its later apartment compounds housed many kinds of residents. The city cannot be reduced to one known king or one family tree. Archaeology makes buildings and practices visible while leaving major questions about political authority open.',
    sections: [
      sec(
        'Different moments within a city',
        'The Met places major monumental construction around 100–250 CE, while apartment compounds developed especially around 250–550. The difference matters: a view anchored at 200 cannot silently display the later city as though nothing changed. This atlas uses the city’s broad range and labels its later objects honestly.',
        cite('teotihuacan', 'Introduction'),
      ),
      sec(
        'A face that may not have been worn',
        'The heavy greenstone mask has no open eye or mouth holes. Its catalogue therefore suggests attachment to another object, a figure or a bundle, rather than ordinary wearing by a living person. Possible ritual interpretations remain possibilities. It dates to the third–seventh centuries, so it introduces a later phase near the pilot rather than an artifact fixed at 200.',
        cite('met-312736', 'Description; Date'),
      ),
      sec(
        'Evidence without a named dynasty',
        'The ordered plan supports questions about labor and authority. Later burning and population decline changed the city, but the identities of those who burned central monuments are not established in the account. A missing royal name is a limit of surviving evidence, not proof that the city lacked political organization.',
        cite('teotihuacan', 'Introduction and City Layout'),
      ),
    ],
    claims: [
      claim(
        'teo-dates',
        'The city’s broad chronology is approximately 100 BCE–800 CE.',
        [cite('teotihuacan', 'Introduction')],
      ),
      claim(
        'teo-mask',
        'The mask probably was not worn by living people.',
        [
          cite(
            'met-312736',
            'Description: weight, perforations, closed eyes and mouth',
          ),
        ],
        'Its proposed attachment and religious meanings remain interpretations.',
      ),
    ],
    objectIds: ['met-312736'],
    terms: ['archaeology', 'inference'],
    dimensions: {
      'Work and production': {
        text: 'Monuments and later apartment compounds required organized building; their dates distinguish phases of urban life.',
        citations: [cite('teotihuacan', 'Introduction')],
      },
      'Surviving evidence': {
        text: 'Urban planning and objects survive more clearly than a sequence of named rulers.',
        citations: [cite('teotihuacan', 'City layout and political discussion')],
      },
    },
    returnPrompt: 'Why should we separate a city’s history into changing phases?',
  }),
  subject({
    id: 'moche',
    name: 'Moche communities',
    aliases: ['Mochica'],
    kind: 'society',
    region: 'Americas',
    place: 'Northern coastal Peru',
    coordinates: [-79.0, -8.15],
    geographicPrecision:
      'Regional locator near the Moche valley; not the origin of every vessel.',
    interval: interval(
      1,
      800,
      '1st–8th centuries CE',
      'Broad cultural flourishing; not a claim of one unchanging centralized state.',
      'approximate',
    ),
    packs: ['C4', 'C5'],
    question: 'What can a pot show about life—and imagination?',
    summary:
      'Moche potters shaped animals, people and narratives into vessels. On Peru’s dry northern coast, river irrigation supported communities with specialized crafts and powerful elites. The pots let us investigate work and belief, but their images cannot be read as photographs. Many were used by living people before becoming part of burials.',
    sections: [
      sec(
        'Water and skilled work',
        'Bernier places Moche communities in desert valleys irrigated by rivers descending from the Andes. Craft specialization and labor tribute formed part of social organization. Irrigation is an environmental and human relationship: a dry coast could sustain intensive production through coordinated use of river water.',
        cite('moche', 'Opening paragraphs'),
      ),
      sec(
        'An animal with more than one identity',
        'The snake bottle combines a serpent’s body with feline-looking features. The museum proposes a mythological creature; it explicitly leaves the meaning of snakes uncertain. A plausible association with regeneration is not a demonstrated explanation for every snake image. The stirrup-shaped spout is part of the vessel’s design and may also aid handling.',
        cite('met-316721', 'Description'),
      ),
      sec(
        'Uses before burial',
        'The ceramic essay distinguishes the production and uses of decorated vessels rather than treating every object as made only for a tomb. Repeated shapes and mold-making reveal technique; surviving images offer selected stories, not a complete record of childhood, work or belief. Compare a modeled figure bottle with a funerary portrait and ask what each medium makes easy to show.',
        cite('moche', 'Production and use paragraphs'),
        cite('met-307474', 'Artwork Details and description'),
      ),
    ],
    claims: [
      claim(
        'moche-range',
        'Moche society flourished on the northern Peruvian coast during the first–eighth centuries CE.',
        [cite('moche', 'Opening paragraph')],
      ),
      claim(
        'moche-snake',
        'The meaning of snakes on the selected bottle is uncertain.',
        [cite('met-316721', 'Final descriptive paragraph')],
      ),
    ],
    objectIds: ['met-316721', 'met-307474'],
    terms: ['irrigation', 'tribute', 'iconography'],
    dimensions: {
      'Work and production': {
        text: 'Irrigation supported coastal communities; specialized potters used modeled and painted imagery.',
        citations: [cite('moche', 'Opening and production paragraphs')],
      },
      'Surviving evidence': {
        text: 'Vessels preserve technical and imaginative choices, often with contexts of use or burial rather than a full account of all households.',
        citations: [cite('moche', 'Uses of ceramics')],
      },
    },
    returnPrompt:
      'How would you test whether a painted scene shows an everyday activity or a ritual?',
  }),
  subject({
    id: 'dongson',
    name: 'Đông Sơn drum traditions',
    aliases: ['Dong Son', 'Vietnam drums'],
    kind: 'society',
    region: 'Southeast Asia/Oceania',
    place: 'Northern Vietnam and wider Southeast Asian circulation',
    coordinates: [105.78, 19.82],
    geographicPrecision:
      'Regional origin anchor, not a known findspot for this miniature.',
    interval: interval(
      -500,
      300,
      'c. 500 BCE–300 CE',
      'Catalogue date of the miniature; wider drum traditions have their own chronologies.',
      'range',
    ),
    packs: ['C3', 'C4'],
    question: 'Does a widespread object mean one shared purpose?',
    summary:
      'Bronze drums and their miniatures open histories beyond a sequence of empires. Drums associated with Đông Sơn were distributed across mainland and island Southeast Asia. Their functions are debated. A miniature with frogs invites observation of technique and imagery while reminding us that the uses of a small burial object may differ from those of a full-size instrument.',
    sections: [
      sec(
        'A small object in a large distribution',
        'The Met describes drums produced in Vietnam and drums made elsewhere across a wide area. That distribution requires research into manufacture, movement and local use; it should not be turned into a map of one homogeneous people. This miniature stands only about ten centimeters high, much smaller than some full-sized drums.',
        cite('met-39209', 'Description; Dimensions'),
      ),
      sec(
        'Frogs are visible; purpose needs evidence',
        'The title identifies four frogs. The museum offers warfare, political regalia and funerary or ceremonial use as possible functions of the broader drum tradition. These alternatives should remain visible. We cannot infer one exact sound, ritual or belief from the image of a miniature.',
        cite('met-39209', 'Title and functional discussion'),
      ),
      sec(
        'Beyond state-shaped history',
        'Material traditions can link communities whose political histories are not well represented by continuous lists of rulers. Compare this bronze miniature with the ceramic Colima building: materials and forms differ, while both raise questions about scale and intended use. Resemblance or contemporaneity alone creates no relationship edge.',
        cite('met-39209', 'Description'),
        cite('met-317600', 'Description'),
      ),
    ],
    claims: [
      claim(
        'drum-date',
        'The selected miniature is catalogued approximately 500 BCE–300 CE.',
        [cite('met-39209', 'Date')],
      ),
      claim(
        'drum-function',
        'The function of Đông Sơn drums remains unclear in the consulted catalogue.',
        [cite('met-39209', 'Description')],
      ),
    ],
    objectIds: ['met-39209'],
    terms: ['regalia', 'material culture'],
    dimensions: {
      'Belief and expression': {
        text: 'Drums may have had political or ceremonial roles; a universal function is not established.',
        citations: [cite('met-39209', 'Description')],
      },
      'Work and production': {
        text: 'Bronze manufacture produced both large drums and miniatures; circulation extended beyond the production region.',
        citations: [cite('met-39209', 'Description')],
      },
    },
    returnPrompt:
      'What evidence would distinguish an instrument from a miniature made for burial?',
  }),
];
export const pilotRelations: Relation[] = [
  {
    id: 'palmyra-network',
    from: 'palmyra',
    to: 'kushan-contexts',
    type: 'trade',
    date: 'Early centuries CE',
    explanation:
      'The consulted account traces caravan connections through Palmyra, Ctesiphon, Ecbatana, Merv and Bactria. This is a network with intermediaries, not evidence that one merchant traveled the whole distance.',
    citations: [
      cite('trade', 'Trading-post and routes paragraphs'),
      cite('kushan', 'Opening paragraph'),
    ],
    status: 'published',
    route: [
      [38.27, 34.56],
      [44.58, 33.09],
      [48.51, 34.8],
      [62.18, 37.66],
      [66.9, 36.75],
      [71.57, 34.01],
    ],
  },
];
export const pilotJourney: Journey = {
  id: 'world-200',
  title: 'The world around 200 CE',
  question: 'At the same time—but connected how?',
  duration: '25–40 minutes, or one stop at a time',
  introduction:
    'Begin with a building small enough to hold, then travel through families, ports and distant communities. The date is an orientation point: objects retain their actual ranges. We will distinguish a shared moment from evidence of contact.',
  stops: [
    {
      subject: 'eastern-han',
      year: 200,
      title: 'A building for another life',
      narrative:
        'Look closely before reading. Name one feature you can see and one idea you are inferring. Then investigate why a model might enter a tomb.',
      object: 'met-49519',
    },
    {
      subject: 'roman-world',
      year: 200,
      title: 'A face of power',
      narrative:
        'A gem carries the portrait of a woman from Syria in Rome’s ruling family. Compare the scale of an object with the reach of its political message.',
      object: 'met-251870',
    },
    {
      subject: 'palmyra',
      year: 200,
      title: 'People between distant centers',
      narrative:
        'Read the names on a family memorial. Follow a sourced network through intermediate cities, and keep the family’s choices separate from the history of every traveler.',
      object: 'met-322375',
      relation: 'palmyra-network',
    },
    {
      subject: 'kushan-contexts',
      year: 200,
      title: 'A coin and its limits',
      narrative:
        'Inspect both sides of the Kanishka coin. Its catalogue date is earlier than our anchor. What does a royal image communicate, and what find evidence would establish circulation?',
      object: 'met-39385',
    },
    {
      subject: 'aksum',
      year: 200,
      title: 'Highland city, coastal port',
      narrative:
        'Locate Aksum and the Red Sea. Distinguish a Roman bottle used as a type comparison from an object actually excavated at Aksum. Notice how later monuments complicate a single-year snapshot.',
    },
    {
      subject: 'moche',
      year: 200,
      title: 'Life beyond the same network',
      narrative:
        'Cross to the north coast of Peru. Investigate irrigation and pottery without drawing a contact line from Eurasia. Then look at Teotihuacan’s different urban setting.',
      object: 'met-316721',
    },
    {
      subject: 'dongson',
      year: 200,
      title: 'Traditions beyond a royal ribbon',
      narrative:
        'Count the frogs, consider bronze manufacture and examine the catalogue’s competing explanations. A broad distribution does not establish a single use.',
      object: 'met-39209',
    },
    {
      subject: 'colima',
      year: 200,
      title: 'Two small buildings, different questions',
      narrative:
        'Compare with the Han tower. Separate visible form, proposed function and confidence. Choose a supported claim, then save a question to revisit.',
      object: 'met-317600',
      compare: 'eastern-han',
    },
  ],
  conclusion:
    'Our shared timeline placed distant societies in view without turning them into one connected world. Specific routes and objects supported some connections; comparison helped us ask questions elsewhere. A historical claim becomes stronger when it states its limits.',
  evidence: {
    prompt: 'Which claim follows from comparing the Han tower and Colima model?',
    options: [
      {
        text: 'Everyone in Eastern Han China lived in a tower.',
        supported: false,
        feedback:
          'An elite burial model cannot represent every household. We would need settlement and household evidence.',
      },
      {
        text: 'The models help investigate buildings, social meanings and possible ritual uses.',
        supported: true,
        feedback:
          'This is appropriately limited. The catalogues and curatorial account support these questions while preserving uncertainty.',
      },
      {
        text: 'Their resemblance proves trade between China and Mexico.',
        supported: false,
        feedback:
          'Similarity and overlapping dates establish neither contact nor a route. Evidence for an actual mechanism is missing.',
      },
    ],
    citations: [
      cite('met-49519', 'Description'),
      cite('met-317600', 'Description'),
      cite('models', 'Comparison of architectural effigies'),
    ],
  },
  returnPrompt:
    'What changed in your picture of the world around 200 CE? Name one supported connection and one comparison that does not imply contact.',
};
