import { cite, claim, interval, metEssay, sec, subject } from './content-helpers';
import type { Subject, Source, Pack, Journey } from '../../src/atlas/model';
export const classicalSources: Source[] = [
  metEssay(
    'nimrud',
    'Nimrud',
    'nimrud',
    'Capital history, palace imagery and chronology; royal claims are not adopted as neutral reports.',
    'Michael Seymour',
    '2016-04',
  ),
  metEssay(
    'assyrian-court',
    'The Assyrian Sculpture Court',
    'the-assyrian-sculpture-court',
    'Palace reliefs, quarry labor and modern gallery reconstruction.',
    'Michael Seymour',
    '2022-10',
  ),
  {
    id: 'ashoka',
    title: 'Mauryan Empire',
    author: 'Jason Neelis',
    institution: 'University of Washington, Silk Road Seattle',
    url: 'https://depts.washington.edu/silkroad/exhibit/mauryans/essay.html',
    type: 'scholarship',
    accessed: '2026-10-26',
    scope:
      'Ashoka c268–232 BCE; languages, inscriptions, patronage and dharma; differing later genealogies.',
  },
  {
    id: 'agora-women',
    title: 'Women in the Athenian Agora',
    author: 'Susan I. Rotroff and Robert D. Lamberton',
    institution: 'American School of Classical Studies at Athens, Picture Book 26',
    url: 'https://www.ascsa.edu.gr/uploads/media/WomenInTheAthenianAgora.pdf',
    published: '2006',
    accessed: '2026-10-26',
    type: 'archaeology',
    scope:
      'Introduction and printed pp7–11 (PDF pp8–12): images, legal exclusion, work and public space; literary prescriptions versus lived activity.',
  },
  metEssay(
    'hydria',
    'Greek Hydriai (Water Jars) and Their Artistic Decoration',
    'greek-hydriai-water-jars-and-their-artistic-decoration',
    'Handles, use and painted fountain scenes.',
    'Colette Hemingway and Seán Hemingway',
    '2007-07',
  ),
  {
    id: 'shabti-context',
    title: 'Shabti of Seti I',
    institution: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/art/collection/search/544763',
    accessed: '2026-10-26',
    type: 'catalogue',
    scope:
      'General funerary substitution and tools; contextual example, not a translation of Taharqo’s figure.',
  },
];
export const classicalSubjects: Subject[] = [
  subject({
    id: 'nimrud-palace',
    name: 'Nimrud: power on palace walls',
    aliases: ['Assyria', 'Ashurnasirpal II', 'Kalhu'],
    kind: 'period',
    region: 'West/Central Asia',
    place: 'Nimrud, northern Iraq',
    coordinates: [43.33, 36.1],
    geographicPrecision: 'Palace-site locator; no Assyrian imperial border.',
    interval: interval(
      -883,
      -859,
      'Reign of Ashurnasirpal II, 883–859 BCE',
      'Selected palace-building and representational context; not the full duration of Assyria or Nimrud.',
    ),
    packs: ['C3'],
    question: 'Whose account of power survives on a palace wall?',
    summary:
      'At Kalhu, now called Nimrud, carved stone and inscriptions presented royal authority to people entering a palace. Protective figures and the king’s achievements belonged to a carefully made environment. These surfaces reveal choices about representing rule; they cannot speak equally for everyone governed by that king.',
    sections: [
      sec(
        'Making an environment',
        'The Northwest Palace was built under Ashurnasirpal II. Stone reliefs and protective figures framed movement through royal rooms. Quarrying, transporting and carving large slabs required labor. The museum gallery draws on that environment but combines material from different rooms; it is not an untouched palace interior.',
        cite('nimrud', 'Northwest Palace'),
        cite('assyrian-court', 'Palace arrangement, stone and gallery reconstruction'),
      ),
      sec(
        'A royal voice',
        'The repeated Standard Inscription lists titles and achievements. A ruler’s declaration is primary evidence of how he wanted authority understood. It is not an independent confirmation of every victory, benefit or quantity. Images of ritual protection and power should be read with that purpose in mind.',
        cite('nimrud', 'Reliefs and Standard Inscription'),
      ),
      sec(
        'An institution has a history',
        'Nimrud served as a capital in the ninth and eighth centuries BCE. Later rulers moved the royal center to other cities. A new capital, the end of an empire and the disappearance of a population are distinct claims. This dossier’s dates identify the selected royal context, not every occupation at the site.',
        cite('nimrud', 'Capital chronology and later history'),
      ),
    ],
    claims: [
      claim(
        'nimrud-reconstruction',
        'The present gallery combines palace material rather than preserving one original room.',
        [cite('assyrian-court', 'Gallery reconstruction')],
      ),
    ],
    objectIds: ['met-322614'],
    terms: ['primary-source', 'inference'],
    dimensions: {
      'Authority and participation': {
        text: 'Royal images and inscriptions give privileged access to the ruler’s representation of power.',
        citations: [cite('nimrud', 'Standard Inscription')],
      },
      'Surviving evidence': {
        text: 'Architectural context and carved texts must be distinguished from a modern display.',
        citations: [cite('assyrian-court', 'Reconstruction')],
      },
    },
    returnPrompt:
      'What question could a palace inscription answer well, and what question would need a different source?',
  }),
  subject({
    id: 'ashoka-messages',
    name: 'Ashoka: messages carved in stone',
    aliases: ['Maurya', 'Mauryan Empire', 'Dhamma'],
    kind: 'period',
    region: 'South Asia',
    place: 'South Asia; locator at Sarnath, one pillar site',
    coordinates: [83.02, 25.38],
    geographicPrecision:
      'One inscription-site context; messages were distributed across a much wider area.',
    interval: interval(
      -268,
      -232,
      'Ashoka, c. 268–232 BCE',
      'Reign convention used by Neelis. Other chronologies place accession earlier; not exact dates for every edict.',
      'approximate',
    ),
    packs: ['C3'],
    question: 'What changes when a ruler speaks to people in different languages?',
    summary:
      'Ashoka’s inscriptions are public statements about conduct and government. They use regional languages and scripts, including Greek and Aramaic in the northwest. They are unusually direct evidence of royal intentions, while intentions and results still require different evidence.',
    sections: [
      sec(
        'Words across regions',
        'Neelis places Ashoka’s reign around 268–232 BCE. Inscriptions use varieties of Prakrit; Greek and Aramaic examples come from Kandahar. A message addressed across regions could change language without proving that everyone understood it in the same way.',
        cite('ashoka', 'Reign dates and inscription languages'),
      ),
      sec(
        'Conduct and conquest',
        'Rock Edict XIII expresses remorse over the conquest of Kalinga. The edicts promote dharma, a moral and administrative program. Ashoka supported Buddhist institutions, but his use of dharma cannot simply be equated with a complete statement of Buddhist doctrine; other religious communities also received patronage.',
        cite('ashoka', 'Kalinga, dharma, Buddhist and Ajivika patronage'),
      ),
      sec(
        'Read a declaration critically',
        'These statements let us investigate what a king chose to announce. Their existence does not measure compliance in every village. Compare the communicative setting with Nimrud’s palace texts: who could encounter a message, in what language, and under whose authority? This is an analytical comparison, not a claim that one king copied the other.',
        cite('ashoka', 'Inscriptions as contemporary evidence'),
        cite('nimrud', 'Standard Inscription'),
      ),
    ],
    claims: [
      claim(
        'ashoka-language',
        'The inscriptions include regional Prakrits and northwestern Greek and Aramaic examples.',
        [cite('ashoka', 'Languages and Kandahar')],
      ),
    ],
    objectIds: [],
    terms: ['primary-source', 'patronage'],
    dimensions: {
      'Authority and participation': {
        text: 'A royal moral and administrative message addressed different regional audiences; reception cannot be assumed.',
        citations: [cite('ashoka', 'Dharma and languages')],
      },
      'Surviving evidence': {
        text: 'Contemporary inscriptions offer a royal voice; later genealogies disagree about subsequent rulers.',
        citations: [cite('ashoka', 'Inscriptions and succession traditions')],
      },
    },
    returnPrompt:
      'How would you test whether a publicly announced policy changed daily life?',
  }),
  subject({
    id: 'athens-water',
    name: 'Athens: who worked in public?',
    aliases: ['Athenian democracy', 'Greek women', 'Agora'],
    kind: 'period',
    region: 'Europe',
    place: 'Athens, Greece',
    coordinates: [23.72, 37.98],
    geographicPrecision:
      'Agora/city locator; no map of citizen residence or political rights.',
    interval: interval(
      -600,
      -300,
      'Sixth–fourth centuries BCE',
      'Analytical window joining an Archaic vase to Classical evidence. These phases are distinguished in the text; not a single unchanging social system.',
    ),
    packs: ['C3'],
    question:
      'Can an excluded political voice still be present in a city’s public life?',
    summary:
      'A water jar shows women gathered at a fountain. Excavated objects and written accounts open different views of work, status and public space. Classical Athenian political participation was restricted to citizen men; that restriction does not mean other people were absent from the city’s streets or economy.',
    sections: [
      sec(
        'A pot before the familiar democracy',
        'The selected hydria dates to about 510–500 BCE. Its painted scene belongs around the transition to democracy, rather than supplying a photograph of every later household. The vase combines a water-carrying form with a representation of people doing that work.',
        cite('met-247244', 'Date and fountain-house description'),
      ),
      sec(
        'Hands, weight and daily work',
        'Two side handles helped lift a hydria; a back handle helped pour. Fetching water brought people into shared space. The Agora study distinguishes literary preferences about respectable behavior from evidence of free and enslaved women working outside households. Status and wealth affected who did which tasks.',
        cite('hydria', 'Opening paragraph on handles and use'),
        cite('agora-women', 'Printed pp7–8, At the Fountain House'),
      ),
      sec(
        'Rules are not a complete social portrait',
        'Texts written by privileged men often present ideals or arguments. Rotroff and Lamberton set them beside images and archaeological evidence, noting women’s professions and legal disabilities. An account of democratic institutions needs this wider social history to avoid turning political exclusion into historical invisibility.',
        cite(
          'agora-women',
          'Introduction; printed pp9–11, Classical Women and Public Space',
        ),
      ),
    ],
    claims: [
      claim(
        'athens-space',
        'Restriction of formal political participation did not mean that women were absent from public work.',
        [cite('agora-women', 'Printed pp7–11')],
      ),
    ],
    objectIds: ['met-247244'],
    terms: ['primary-source', 'archaeology'],
    dimensions: {
      'Authority and participation': {
        text: 'Citizen men held formal political participation; women’s public work and differing statuses complicate any claim of universal equality.',
        citations: [cite('agora-women', 'Printed pp7–11')],
      },
      'Work and production': {
        text: 'Water provision linked household labor to public infrastructure.',
        citations: [
          cite('hydria', 'Handles and water carrying'),
          cite('met-247244', 'Description'),
        ],
      },
    },
    returnPrompt:
      'What might a political constitution leave out of a history of ordinary life?',
  }),
  subject({
    id: 'taharqo',
    name: 'Taharqo: a Kushite king’s afterlife',
    aliases: ['Taharqa', 'Nubia', 'Twenty-fifth Dynasty'],
    kind: 'period',
    region: 'Africa',
    place: 'Nuri and the Nile valley; present-day Sudan and Egypt',
    coordinates: [31.9, 18.56],
    geographicPrecision:
      'Nuri locator; the selected figure’s association with Taharqo’s pyramid is probable, not an exact documented findspot here.',
    interval: interval(
      -690,
      -664,
      'Taharqo’s reign, c. 690–664 BCE',
      'Catalogue reign dates; the figure is attributed to this period, not one exact production year.',
    ),
    packs: ['C3'],
    question: 'How can a funerary object connect royal power, work and belief?',
    summary:
      'Taharqo belonged to the Kushite dynasty that ruled Egypt. His burial was in Nubia. A stone shabti attributed to his reign connects royal identity with expectations of work after death, showing how a political history crossing the Nile valley also belongs to a history of belief and skilled making.',
    sections: [
      sec(
        'Across modern borders',
        'The museum assigns the figure to Dynasty 25 and Taharqo’s reign, about 690–664 BCE. It probably came from his pyramid at Nuri. The word “probably” matters: a likely attribution is not the same as a fully recorded excavation context.',
        cite('met-544883', 'Date, geography and provenance wording'),
      ),
      sec(
        'Work imagined after death',
        'Shabtis were intended as substitutes for tasks required of the deceased in the afterlife. The Met’s Seti I example explains this general funerary role and its tools. That context helps frame the question; it is not a supplied translation of the inscription on Taharqo’s particular figure.',
        cite('shabti-context', 'Description and Book of the Dead chapter 6'),
      ),
      sec(
        'What survives selectively',
        'A royal funerary figure gives access to elite commemoration and craft. It cannot establish what every person in Nubia believed or how every household lived. Compare its setting with a palace relief, keeping their different audiences, locations and uses visible.',
        cite('met-544883', 'Material and royal identity'),
        cite('nimrud', 'Palace relief context'),
      ),
    ],
    claims: [
      claim(
        'taharqo-date',
        'The visible catalogue dates Taharqo’s figure to c.690–664 BCE, with a probable Nuri association.',
        [cite('met-544883', 'Date and Geography')],
        'The API end bound repeats 690 BCE; the displayed catalogue range governs the local correction.',
      ),
    ],
    objectIds: ['met-544883'],
    terms: ['provenance', 'inference'],
    dimensions: {
      'Authority and participation': {
        text: 'Royal burial and named kingship survive through an elite funerary object, with no claim to represent every household.',
        citations: [cite('met-544883', 'Description')],
      },
      'Surviving evidence': {
        text: 'A probable findspot and catalogue date have different certainty from a recorded excavation.',
        citations: [cite('met-544883', 'Geography and Date')],
      },
    },
    returnPrompt:
      'Which part of an object label is certain, and which part is an informed attribution?',
  }),
  subject({
    id: 'chavin-textile',
    name: 'A Chavín textile: traveling images?',
    aliases: ['Chavin', 'Andean textiles'],
    kind: 'object',
    region: 'Americas',
    place: 'Peru; said to come from the southern coast',
    coordinates: [-75.2, -14.5],
    geographicPrecision:
      'Broad reported regional origin, not an excavated site coordinate.',
    interval: interval(
      -400,
      -200,
      'Fourth–third centuries BCE',
      'Current object catalogue dating, reflecting research cited in 2023; not the lifespan of a Chavín state.',
    ),
    packs: ['C3'],
    question: 'How might a portable image connect places?',
    summary:
      'Painted cotton carries a fanged figure with claws and serpent-like elements. The catalogue relates its imagery to carvings at Chavín de Huántar. Similar imagery and a portable material invite an investigation of circulation, while an uncertain findspot limits how precisely this object’s journey can be reconstructed.',
    sections: [
      sec(
        'Look at the material',
        'The textile combines cotton with iron-earth pigments. Its central figure shares features with imagery associated with Chavín de Huántar. Those similarities support comparison across media; they do not identify an individual painter, worshipper or traveler.',
        cite('met-315784', 'Description and materials'),
      ),
      sec(
        'Dates can be revised',
        'The current museum record places this textile in the fourth–third centuries BCE and cites recent technical research. An older cultural label or a different monument’s dates should not overwrite that object chronology. A tradition, a site and one surviving textile are different historical units.',
        cite('met-315784', 'Date and references, Burger et al. 2023'),
      ),
      sec(
        'A route remains a question',
        'The textile is said to come from the southern Peruvian coast. That wording preserves uncertainty. Portability may help explain how images could circulate, but this specimen supplies no documented itinerary. Compare it with Uluburun’s excavated association to see why different evidence supports different kinds of connection.',
        cite('met-315784', 'Provenance and discussion of portable imagery'),
        cite('uluburun', 'Cargo association'),
      ),
    ],
    claims: [
      claim(
        'chavin-provenance',
        'The southern coastal origin is reported rather than a secure excavation context.',
        [cite('met-315784', 'Geography and description')],
      ),
    ],
    objectIds: ['met-315784'],
    terms: ['provenance', 'inference'],
    dimensions: {
      'Surviving evidence': {
        text: 'A portable textile with a reported regional origin supports iconographic comparison more securely than a precise travel route.',
        citations: [cite('met-315784', 'Description and provenance')],
      },
      'Work and production': {
        text: 'Cotton and painted mineral pigments combined textile making with image making.',
        citations: [cite('met-315784', 'Medium and description')],
      },
    },
    returnPrompt:
      'What could turn a proposed movement of imagery into a demonstrated connection?',
  }),
];
export const classicalJourney: Journey = {
  id: 'voices-power',
  title: 'Power, work and whose voice survives',
  question: 'Who could make a message last?',
  duration: '25–40 minutes',
  introduction:
    'Read a palace wall, a ruler’s edicts, a water jar, a royal burial figure and a textile. Ask who made each record and what it leaves silent.',
  stops: [
    {
      subject: 'nimrud-palace',
      year: -870,
      title: 'Enter a royal setting',
      narrative:
        'Inspect the protective imagery and distinguish the palace from its modern museum arrangement.',
      object: 'met-322614',
    },
    {
      subject: 'ashoka-messages',
      year: -250,
      title: 'Address people across regions',
      narrative:
        'Compare two royal messages without turning a similarity into a claim of copying.',
      compare: 'nimrud-palace',
    },
    {
      subject: 'athens-water',
      year: -500,
      title: 'Put daily work in public space',
      narrative:
        'Look at the handles and painted fountain scene. Separate political rights from participation in everyday work.',
      object: 'met-247244',
    },
    {
      subject: 'taharqo',
      year: -675,
      title: 'Read a qualified attribution',
      narrative:
        'Keep probable findspot, royal identity and funerary purpose distinct.',
      object: 'met-544883',
    },
    {
      subject: 'chavin-textile',
      year: -300,
      title: 'Follow a question instead of inventing a route',
      narrative:
        'Portable imagery suggests circulation; what evidence would locate this particular journey?',
      object: 'met-315784',
    },
    {
      subject: 'qin-administration',
      year: -216,
      title: 'A decree meets everyday practice',
      narrative:
        'Compare an announced standard with excavated administrative documents; uniform rules did not guarantee identical practice.',
    },
    {
      subject: 'dongson',
      year: -300,
      title: 'Hear another material tradition',
      narrative:
        'Compare skilled bronze making and debated purposes with the evidence encountered so far.',
    },
  ],
  conclusion:
    'Lasting records are selective. A ruler’s announcement, a work scene and a funerary object preserve different voices. Serious comparison keeps audience, material, dates and uncertainty visible.',
  evidence: {
    prompt: 'Which reading best respects the evidence?',
    options: [
      {
        text: 'A royal declaration tells us what a ruler announced; its effects need additional evidence.',
        supported: true,
        feedback:
          'Purpose and reception are different questions. A surviving statement is strong evidence of a message, not proof of universal compliance.',
      },
      {
        text: 'Similar images prove that every maker followed the same route.',
        supported: false,
        feedback:
          'Similarity alone supplies neither a traveler nor an itinerary. Provenance and dated contexts matter.',
      },
      {
        text: 'Political exclusion means people did no public work.',
        supported: false,
        feedback:
          'The Agora study distinguishes formal rights from the broader evidence of work and presence.',
      },
    ],
    citations: [
      cite('ashoka', 'Edicts'),
      cite('agora-women', 'Printed pp7–11'),
      cite('met-315784', 'Provenance'),
    ],
  },
  returnPrompt:
    'Choose a record and name a person whose experience it might leave out.',
};
export const classicalPack: Pack = {
  id: 'C3',
  title: 'States, ideas and everyday voices',
  start: -1000,
  end: -1,
  anchor: -300,
  question:
    'How did power, techniques and systems of thought change across different regions?',
  orientation:
    'Different materials preserve different voices. Royal texts, ritual objects, household work and portable images make an uneven archive. Compare the purposes and audiences of those records while keeping each region’s chronology distinct.',
  journey: 'voices-power',
  comparison: ['nimrud-palace', 'ashoka-messages'],
  geography:
    'Move from Mesopotamia to South Asia, Athens and the Nile, then across Andean and island worlds. These are comparisons; no connecting line is inferred from contemporaneity.',
  limits:
    'Selected contexts offer depth rather than a catalogue of all empires or philosophies. Achaemenid, Greek, Indian and Chinese intellectual histories extend well beyond these cases.',
  coverage: {
    Americas: {
      status: 'researched',
      reason:
        'Chavín textile, Olmec and Colima material histories; not all American regions.',
      subjects: ['chavin-textile', 'olmec', 'colima'],
    },
    Africa: {
      status: 'limited',
      reason:
        'Kushite royal and funerary history; areas beyond the Nile need fuller treatment.',
      subjects: ['taharqo'],
    },
    Europe: {
      status: 'researched',
      reason:
        'Athenian public work and unequal political participation; not a general European history.',
      subjects: ['athens-water'],
    },
    'West/Central Asia': {
      status: 'researched',
      reason: 'Nimrud palace communication and its modern reconstruction.',
      subjects: ['nimrud-palace'],
    },
    'South Asia': {
      status: 'researched',
      reason: 'Mauryan royal messages, languages and limits of reception.',
      subjects: ['ashoka-messages'],
    },
    'East Asia': {
      status: 'researched',
      reason:
        'Qin measures and primary research on local administrative practice; Western Han and other intellectual traditions remain limited.',
      subjects: ['qin-administration'],
    },
    'Southeast Asia/Oceania': {
      status: 'researched',
      reason:
        'Dong Son material and Lapita cultural traditions with uncertain functions and distinct dates.',
      subjects: ['dongson', 'lapita'],
    },
  },
};
