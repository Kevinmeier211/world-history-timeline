import { dossier } from './editorial';
import { cite, metEssay } from './content-helpers';
import type { Source, Journey, Pack } from '../../src/atlas/model';
export const medievalSources: Source[] = [
  metEssay(
    'byzantium',
    'Byzantium (ca.330–1453)',
    'byzantium-ca-330-1453',
    'Roman identity, changes in government and 1204–61 interruption; no single fixed border.',
    'Sarah T. Brooks',
    '2001; revised 2009',
  ),
  metEssay(
    'icons',
    'Icons and Iconoclasm in Byzantium',
    'icons-and-iconoclasm-in-byzantium',
    'Definition, use, debates and later images; proposed causes remain contested.',
    'Sarah T. Brooks',
    '2001; revised 2009',
  ),
  metEssay(
    'tang',
    'Tang Dynasty (618–907)',
    'tang-dynasty-618-906',
    'Institutional continuity from Sui, capital contacts and mid-eighth-century rebellion. Evaluative superlatives and universal benevolence are not adopted.',
    'Department of Asian Art',
    '2001-10',
  ),
  metEssay(
    'abbasid',
    'The Art of the Abbasid Period (750–1258)',
    'the-art-of-the-abbasid-period-750-1258',
    'Baghdad and Samarra chronology; ceramic technique and changing political authority. No “universal empire” conclusion adopted.',
    'Suzan Yalman, based on Linda Komaroff',
    '2001-10',
  ),
  {
    id: 'borobudur',
    title: 'Borobudur Temple Compounds',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/592/',
    type: 'archaeology',
    accessed: '2026-10-26',
    scope:
      'Brief synthesis: eighth–ninth-century construction, tiers, Buddhist cosmology and modern restoration.',
  },
  {
    id: 'nalanda',
    title: 'Archaeological Site of Nalanda Mahavihara',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/1502/',
    type: 'archaeology',
    accessed: '2026-10-26',
    scope:
      'Brief synthesis and Authenticity: fifth–thirteenth-century institution distinguished from earlier remains; construction layers and documented repairs.',
  },
];
export const medievalSubjects = [
  dossier({
    id: 'byzantium',
    name: 'Byzantium: Romans across changing centuries',
    aliases: ['Eastern Roman Empire', 'Byzantine Empire', 'Constantinople'],
    kind: 'political entity',
    region: 'Europe',
    place: 'Constantinople, present-day Istanbul; territories varied',
    coordinates: [28.98, 41.01],
    geo: 'Capital locator on the Bosporus; no single imperial boundary.',
    dates: [
      330,
      1453,
      'Conventional frame, 330–1453 CE',
      'New capital in 330 to Ottoman capture in 1453. Constantinople was under Latin rule 1204–1261; Byzantine states continued elsewhere. Not an uninterrupted single territorial unit.',
    ],
    packs: ['C4', 'C5', 'C6'],
    question: 'Can political change and cultural continuity coexist?',
    summary:
      'People modern historians call Byzantine identified themselves as Romans. Constantinople connected government, religion and craft across changing territories. That history continued far beyond the end of western imperial rule; a 476 endpoint would erase centuries of evidence.',
    sections: [
      [
        'A name across time',
        'Brooks uses 330, the dedication of Constantinople, as a conventional beginning. Roman law and imperial institutions continued while language, territory and religious life changed. “Byzantine” is a later historical label, not a claim that the inhabitants suddenly ceased being Roman.',
        'byzantium',
        'Opening and Beginning of Byzantium',
      ],
      [
        'A small image with a large context',
        'The selected tenth-century ivory was probably a private devotional object. Its missing wings once formed a triptych. It belongs after the image controversies, not to the founding of the capital. Sacred images appeared in many materials and settings; the relationship between an image and its sacred subject was debated.',
        'met-464428',
        'Date, missing wings and probable use',
      ],
      [
        'Continuity is not sameness',
        'Crusaders took Constantinople in 1204; Byzantine rule returned there in 1261. The city fell to the Ottomans in 1453, while some other Byzantine territories endured longer. This frame names a tradition of imperial government with major interruptions and rival centers, not one unchanging state-shaped block.',
        'byzantium',
        'Latin Occupation and Late Byzantium',
      ],
    ],
    fact: [
      'The medieval inhabitants described themselves as Romans; Constantinople’s 1204–1261 Latin occupation interrupts a simple continuous-capital story.',
      'byzantium',
      'Opening; Latin Occupation',
    ],
    objects: ['met-464428'],
    terms: ['empire', 'iconography', 'chronology'],
    dimensions: [
      [
        'Authority and participation',
        'Imperial and church institutions changed; Roman self-identification persisted across the modern label.',
        'byzantium',
        'Early and Middle Byzantium',
      ],
      [
        'Surviving evidence',
        'A tenth-century devotional object represents a particular practice, not every century of imperial life.',
        'met-464428',
        'Description and date',
      ],
    ],
    prompt:
      'What does a single long timeline band conceal about a changing political identity?',
  }),
  dossier({
    id: 'tang-city',
    name: 'Tang China: a capital and its many connections',
    aliases: ['Tang dynasty', 'Chang’an'],
    kind: 'period',
    region: 'East Asia',
    place: 'Chang’an, present-day Xi’an, China',
    coordinates: [108.94, 34.26],
    geo: 'Capital locator; no claim that one city represents all Tang society.',
    dates: [
      618,
      907,
      'Tang dynastic frame, 618–907 CE',
      'Conventional dynasty dates; individual objects and political disruptions have their own chronology.',
    ],
    packs: ['C5'],
    question: 'What does a tomb figure reveal about the living city?',
    summary:
      'Chang’an received merchants, religious travelers and envoys from many regions. The Tang inherited institutions from the Sui and faced internal disruption. An earthenware court figure opens a more selective view: the resources and ideals represented in an elite burial.',
    sections: [
      [
        'Institutions and visitors',
        'The Met account describes institutional continuities from Sui government and visitors from regions including India, Persia, Korea and Japan. An examination system offered some educated men a route into office. That possibility did not make participation universal or remove every social advantage.',
        'tang',
        'Opening and seventh-century institutions',
      ],
      [
        'A represented person',
        'The selected court lady dates broadly to the seventh–eighth century. Earthenware and surviving pigment give material form to dress and posture. The catalogue does not identify her as a named individual; an image’s careful appearance should not be converted into a biography.',
        'met-44800',
        'Title, date and medium',
      ],
      [
        'A dynasty contains change',
        'The An Lushan rebellion weakened court authority in the eighth century, yet Tang government continued afterward. Neither a flourishing capital nor a political crisis should stand for every place throughout the whole dynasty. Compare the figure’s burial setting with the Han models of buildings, separated by several centuries.',
        'tang',
        'Final paragraph on rebellion and restored government',
      ],
    ],
    fact: [
      'The dynasty continued after the mid-eighth-century rebellion, despite weakened court authority.',
      'tang',
      'Final paragraph',
    ],
    objects: ['met-44800'],
    terms: ['dynasty', 'tomb'],
    dimensions: [
      [
        'Authority and participation',
        'Government institutions included examination-based recruitment for some educated men; this is not universal access.',
        'tang',
        'Seventh-century institutions',
      ],
      [
        'Surviving evidence',
        'A tomb figure preserves an elite representational context rather than a named person’s complete life.',
        'met-44800',
        'Artwork details',
      ],
    ],
    prompt:
      'What would you need to learn about people who could not afford such a burial?',
  }),
  dossier({
    id: 'abbasid-craft',
    name: 'Abbasid Iraq: cities, surfaces and changing power',
    aliases: ['Baghdad', 'Samarra', 'Abbasid Caliphate'],
    kind: 'period',
    region: 'West/Central Asia',
    place: 'Baghdad and Samarra, Iraq',
    coordinates: [44.36, 33.31],
    geo: 'Baghdad locator; Samarra lies north along the Tigris. No fixed caliphal boundary.',
    dates: [
      750,
      1258,
      'Abbasid rule in Baghdad: conventional frame, 750–1258 CE',
      'Baghdad founded 762; court at Samarra 836–892. Authority changed substantially; later nominal caliphs in Egypt are outside this frame.',
    ],
    packs: ['C5', 'C6'],
    question: 'Can a craft tradition spread while political unity weakens?',
    summary:
      'Baghdad and Samarra were centers of patronage and skilled work. Carved surfaces and luster-painted pottery connect technical experimentation to wider exchanges. Their history continued through shifts in political control, so a dynasty’s long dates cannot imply constant unified rule.',
    sections: [
      [
        'More than one capital',
        'Baghdad was founded in 762. Samarra served as the court’s capital in 836–892. Its surviving remains are especially useful because little early Abbasid Baghdad survives above ground. The archaeological record’s unevenness affects which city is easiest to picture today.',
        'abbasid',
        'Capital foundations and survival',
      ],
      [
        'Light on clay',
        'The tenth-century bowl is attributed to Iraq. Luster painting on opaque white glaze produces a metallic-looking surface. Its figures and blessing inscription complicate any claim that all Islamic art avoided people or consisted of one form. A bowl’s setting differs from a religious building’s.',
        'met-452833',
        'Description, inscription and medium',
      ],
      [
        'Authority and technique diverge',
        'Regional dynasties gained autonomy; Abbasid caliphs’ effective political power contracted. Artistic techniques could circulate despite political fragmentation. The 1258 sack of Baghdad is an important political rupture, not a date on which every person, skill or religious institution vanished.',
        'abbasid',
        'Tenth-century fragmentation and 1258',
      ],
    ],
    fact: [
      'Baghdad’s 762 foundation and Samarra’s 836–892 capital phase are different from the full dynastic frame.',
      'abbasid',
      'First paragraph',
    ],
    objects: ['met-452833'],
    terms: ['patronage', 'dynasty'],
    dimensions: [
      [
        'Work and production',
        'Luster-painted pottery required specialized surface techniques; the selected vessel is attributed to Iraq.',
        'met-452833',
        'Medium and geography',
      ],
      [
        'Surviving evidence',
        'Samarra’s archaeology is particularly important because early Baghdad survives unevenly.',
        'abbasid',
        'Survival of capitals',
      ],
    ],
    prompt:
      'How might the destruction or survival of buildings shape the history we tell?',
  }),
  dossier({
    id: 'borobudur',
    name: 'Borobudur: a landscape for Buddhist ideas',
    aliases: ['Java', 'Syailendra'],
    kind: 'place',
    region: 'Southeast Asia/Oceania',
    place: 'Kedu Valley, Central Java, Indonesia',
    coordinates: [110.2, -7.61],
    geo: 'Temple-site locator; no inference of a regional political boundary.',
    dates: [
      700,
      900,
      'Built in the eighth–ninth centuries CE',
      'Broad construction frame from UNESCO, not exact building dates or the entire duration of use.',
    ],
    packs: ['C5'],
    question: 'How can movement through a building teach an idea?',
    summary:
      'Borobudur brings terraces, reliefs and stupas into a constructed hill landscape. Its organization gives physical form to Buddhist cosmology. The surviving monument is evidence both of an earlier religious project and of later conservation decisions.',
    sections: [
      [
        'An arranged ascent',
        'UNESCO describes square terraces below circular platforms and a crowning stupa. This arrangement is associated with Buddhist cosmological spheres. Architecture could shape movement and attention; this interpretation does not prove every visitor’s private thoughts.',
        'borobudur',
        'Brief synthesis: form and cosmology',
      ],
      [
        'A local monumental project',
        'Construction belongs broadly to the eighth and ninth centuries under the Syailendra dynasty in Central Java. A shared religion did not make buildings everywhere identical. Here stone relief and a hill setting created a particular environment for religious practice.',
        'borobudur',
        'Construction and location',
      ],
      [
        'A conserved past',
        'The site’s present appearance includes major modern restoration, notably UNESCO-supported work in the 1970s. A photograph taken today would show a conserved monument, not an untouched eighth-century surface. Compare it with Nalanda’s construction layers and documented repairs.',
        'borobudur',
        'Restoration history',
      ],
    ],
    fact: [
      'The monumental construction dates broadly to the eighth–ninth centuries, and its present form includes modern restoration.',
      'borobudur',
      'Description and Brief synthesis',
    ],
    terms: ['ritual', 'archaeology'],
    dimensions: [
      [
        'Surviving evidence',
        'A conserved monumental site combines early fabric with later intervention.',
        'borobudur',
        'Restoration history',
      ],
      [
        'Work and production',
        'Terraces, carved reliefs and stupas required coordinated building and carving.',
        'borobudur',
        'Architectural description',
      ],
    ],
    prompt:
      'How would you distinguish a building’s original construction, later use and modern restoration?',
  }),
  dossier({
    id: 'nalanda',
    name: 'Nalanda: living and learning together',
    aliases: ['Mahavihara', 'Bihar'],
    kind: 'place',
    region: 'South Asia',
    place: 'Nalanda, Bihar, India',
    coordinates: [85.44, 25.14],
    geo: 'Monastic archaeological-site locator; not a map of every associated learning network.',
    dates: [
      400,
      1300,
      'Monastic and scholastic institution, fifth–thirteenth centuries CE',
      'UNESCO Brief synthesis distinguishes this institution from earlier site remains reaching the third century BCE. End expressed by century, not an exact destruction year.',
    ],
    packs: ['C5', 'C6'],
    question: 'What can rooms and repairs reveal about learning?',
    summary:
      'Nalanda’s residential and religious buildings joined organized learning to monastic life. Successive construction layers reveal change rather than one frozen plan. Its archaeological dates must be separated from claims about when a particular educational institution operated.',
    sections: [
      [
        'Two chronologies on one site',
        'UNESCO’s short description mentions remains from the third century BCE onward. Its detailed synthesis identifies the monastic-scholastic establishment from the fifth to thirteenth centuries CE. These statements refer to different historical units and should not be collapsed into one founding date.',
        'nalanda',
        'Description versus Brief synthesis',
      ],
      [
        'A changing built institution',
        'Residential viharas, shrines, stupas and later aligned buildings preserve changing forms of collective life. The fabric gives evidence for an organized physical setting. Room plans alone cannot reconstruct every lesson, student’s experience or intellectual disagreement.',
        'nalanda',
        'Brief synthesis and Integrity',
      ],
      [
        'Repair is part of the record',
        'UNESCO’s authenticity account distinguishes construction layers and conservation, including documented capping and supports. Today’s visible ruins have been excavated and stabilized. Reading their history requires asking what belongs to the institution’s successive phases and what was added to preserve it.',
        'nalanda',
        'Authenticity, conservation and documentation',
      ],
    ],
    fact: [
      'The detailed UNESCO synthesis dates the scholastic institution to the fifth–thirteenth centuries, while earlier archaeological remains have a longer chronology.',
      'nalanda',
      'Brief synthesis',
    ],
    terms: ['archaeology', 'chronology'],
    dimensions: [
      [
        'Surviving evidence',
        'Construction layers and documented repairs distinguish historical change from modern conservation.',
        'nalanda',
        'Integrity and Authenticity',
      ],
      [
        'Work and production',
        'Residential and religious infrastructure supported organized monastic learning.',
        'nalanda',
        'Brief synthesis',
      ],
    ],
    prompt:
      'What could an excavated school building tell you, and what would require a written or oral account?',
  }),
  dossier({
    id: 'maya-vessel',
    name: 'A Maya drinking vessel: text, food and rank',
    aliases: ['Maya courts', 'Cacao', 'Kaan Took’'],
    kind: 'object',
    region: 'Americas',
    place: 'Mesoamerica; proposed Tabasco association',
    coordinates: [-92.8, 18.1],
    geo: 'Broad hypothesized region; no precise excavated findspot is claimed.',
    dates: [
      600,
      800,
      'Seventh–eighth centuries CE',
      'Catalogue object range; not a lifespan for Maya peoples, who continue today.',
    ],
    packs: ['C5'],
    question: 'What can a name on a cup tell us—and what does it leave open?',
    summary:
      'An incised vessel combines a named owner, a ruler’s image and imagery associated with agricultural fertility. It connects food and royal identity. Its inscription does not identify a polity, and its proposed regional origin remains an argument rather than a recorded excavation.',
    sections: [
      [
        'Words and pictures together',
        'The catalogue reads a short ownership text naming a ruler, with part of the name uncertain. Image and inscription overlap physically on the vessel. This relationship makes the cup a useful example of writing acting within a composition, rather than a detached caption.',
        'met-316711',
        'Ownership text and text-image discussion',
      ],
      [
        'Food and representation',
        'The museum interprets the vessel in relation to cacao drinking and royal feasts. Fertility imagery connects the represented ruler with the maize cycle. These are interpretations of a particular elite object, not a menu or belief statement for every Maya household.',
        'met-316711',
        'Function and agricultural imagery',
      ],
      [
        'A proposed origin',
        'The inscription supplies no named polity. The catalogue proposes a Tabasco association using names and ceramic comparisons, while its modern collection history begins outside an excavated context. Keep an argued regional attribution separate from a secure findspot.',
        'met-316711',
        'Regional hypothesis and collection history',
      ],
    ],
    fact: [
      'The cup’s ownership text does not specify the ruler’s polity; the regional attribution is a hypothesis.',
      'met-316711',
      'Polity and Tabasco discussion',
    ],
    objects: ['met-316711'],
    terms: ['inscription', 'provenance'],
    dimensions: [
      [
        'Authority and participation',
        'An elite owner’s name and imagery connect rank with food and fertility; other voices are less directly represented.',
        'met-316711',
        'Text and image',
      ],
      [
        'Surviving evidence',
        'The proposed regional origin rests on comparisons rather than a documented excavation of this vessel.',
        'met-316711',
        'Regional hypothesis',
      ],
    ],
    prompt:
      'Which evidence would strengthen or weaken the proposed regional attribution?',
  }),
];
export const medievalJourney: Journey = {
  id: 'institutions-images',
  title: 'Institutions, images and the work of continuity',
  question: 'What continues when political power changes?',
  duration: '30–45 minutes',
  introduction:
    'Move among capitals, a cup, a temple and a learning community. Look for changes within long historical labels.',
  stops: [
    {
      subject: 'byzantium',
      year: 950,
      title: 'Roman identity beyond 476',
      narrative:
        'Read the long frame and its interruptions. Inspect a much later devotional object.',
      object: 'met-464428',
    },
    {
      subject: 'abbasid-craft',
      year: 950,
      title: 'Craft across changing authority',
      narrative: 'Distinguish a dynasty, a capital phase and the date of a bowl.',
      object: 'met-452833',
    },
    {
      subject: 'tang-city',
      year: 750,
      title: 'A selective image of society',
      narrative:
        'Explore a capital’s contacts while questioning what an elite burial represents.',
      object: 'met-44800',
    },
    {
      subject: 'maya-vessel',
      year: 750,
      title: 'A name without a named polity',
      narrative:
        'Read the difference between ownership, interpretation and a secure findspot.',
      object: 'met-316711',
    },
    {
      subject: 'borobudur',
      year: 850,
      title: 'Ideas built into a landscape',
      narrative:
        'Investigate movement and cosmology, then distinguish construction from restoration.',
    },
    {
      subject: 'nalanda',
      year: 850,
      title: 'Learning needs a place to live',
      narrative:
        'Compare two religious built environments and their surviving construction layers.',
      compare: 'borobudur',
    },
  ],
  conclusion:
    'Institutions can survive political transitions, but survival does not mean sameness. Buildings, objects and texts preserve different scales of change.',
  evidence: {
    prompt: 'Why should Nalanda’s early remains and institutional dates be separated?',
    options: [
      {
        text: 'A site can contain earlier activity than the particular institution being investigated.',
        supported: true,
        feedback:
          'The detailed synthesis distinguishes the fifth–thirteenth-century institution from earlier remains.',
      },
      {
        text: 'Any ancient object proves a modern-style university operated from the earliest date.',
        supported: false,
        feedback:
          'The kind of institution and the meaning of the earliest archaeological remains need separate evidence.',
      },
    ],
    citations: [cite('nalanda', 'Description and Brief synthesis')],
  },
  returnPrompt:
    'Choose a long historical label and explain one important change inside it.',
};
export const medievalPack: Pack = {
  id: 'C5',
  title: 'Communities and institutions in transition',
  start: 500,
  end: 1000,
  anchor: 850,
  question:
    'How did institutions, beliefs and regional networks change after political transitions?',
  orientation:
    'Large political labels contain changing communities. Investigate how people made images, shared food, organized learning and built religious environments while political power shifted.',
  journey: 'institutions-images',
  comparison: ['borobudur', 'nalanda'],
  geography:
    'Capitals on the Bosporus, Tigris and in northern China sit beside Mesoamerican vessel traditions, South Asian monastic life and Central Javanese architecture.',
  limits:
    'Western Europe beyond Byzantium, inland Africa, North America and many smaller communities need fuller treatment. The selected cases do not define one universal medieval stage.',
  coverage: {
    Americas: {
      status: 'researched',
      reason:
        'Maya text, food and rank, with earlier Moche and Teotihuacan contexts accessible.',
      subjects: ['maya-vessel', 'moche', 'teotihuacan'],
    },
    Africa: {
      status: 'limited',
      reason:
        'Later Aksum context reaches this window; no new dedicated sub-Saharan dossier for these centuries.',
      subjects: ['aksum'],
    },
    Europe: {
      status: 'researched',
      reason:
        'Roman/Byzantine identity, changing political phases and devotional practice.',
      subjects: ['byzantium'],
    },
    'West/Central Asia': {
      status: 'researched',
      reason: 'Abbasid capitals, technique and changing authority.',
      subjects: ['abbasid-craft'],
    },
    'South Asia': {
      status: 'researched',
      reason:
        'Nalanda’s institution, physical organization and archaeological chronology.',
      subjects: ['nalanda'],
    },
    'East Asia': {
      status: 'researched',
      reason: 'Tang institutions, capital contacts and tomb representation.',
      subjects: ['tang-city'],
    },
    'Southeast Asia/Oceania': {
      status: 'researched',
      reason:
        'Borobudur’s Javanese monumental religious environment; island Oceania remains limited in this window.',
      subjects: ['borobudur'],
    },
  },
};
