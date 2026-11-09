import type {
  Corpus,
  Subject,
  Source,
  HistoricalContext,
  Journey,
  Citation,
} from '../../src/atlas/model';
import { cite, interval, sec } from './content-helpers';
import { applyExchangePlaces } from './exchange-places';
import { exchangeMedia } from './exchange-media';
const consulted = '2026-10-28';
const reviewer =
  'Codex source consultation and self-review; not independent historian approval';
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
    'palmyra-tax',
    'The Tax Law of Palmyra: Evidence for Economic History in a City of the Roman East',
    'Journal of Roman Studies 74 (1984), 157–180; available excerpt hosted by Ostia Antica',
    'https://doi.org/10.2307/299013',
    'scholarship',
    'Publisher opening extract consulted. An eight-page original-paper excerpt, printed pp. 173–180, was downloaded; pp. 173–175 and selected tariff passages read, p. 175 visually inspected. Local economy, council decree, Greek/Palmyrene versions and editorial supplements; not the whole 24-page article, original stone or a new translation. The municipal tariff is not a list of every caravan journey.',
    'J. F. Matthews',
    '1984',
  ),
  source(
    'palmyra-getty',
    'The Legacy of Ancient Palmyra: Ancient Palmyra',
    'Getty Research Institute',
    'https://www.getty.edu/research/exhibitions_events/exhibitions/palmyra/ancient_palmyra.html',
    'scholarship',
    'Trade, inscriptions, funerary sculpture and Roman/later sections read. Caravan honorific inscriptions, bilingual public writing, and the separate 272/273 sieges are used. No population total, universal religious tolerance, willful language-suppression claim or direct travel from every network endpoint adopted. Images/maps linked, not reproduced.',
    'Frances Terpak and Peter Louis Bonfitto',
  ),
  source(
    'palmyra-literacy',
    'The Brother and the Sister, the Tablet, the Epitaph, and their Tutor',
    'Centre for the Study of Manuscript Cultures, University of Hamburg; Artefact of the Month 31',
    'https://www.csmc.uni-hamburg.de/publications/aom/031-en.html',
    'scholarship',
    'Full illustrated essay read. It concerns Berlin 27/65, a different relief with Yarhai and Mainat. Hypothetical literacy/education readings and the ambiguous tutor/guardian/steward term retain their qualifications. Neither the tablet, names nor proposed schooling are transferred to Met 02.29.1. Source photographs are not reproduced.',
    'Łukasz Sokołowski',
  ),
  source(
    'kushan-inscriptions',
    'Bactrian Historical Inscriptions of the Kushan Period',
    'The Silk Road 10 (2012), 76–80; university-hosted copy',
    'https://edspace.american.edu/silkroadjournal/wp-content/uploads/sites/984/2017/09/SilkRoad_10_2012_simswilliams.pdf',
    'primary',
    'Five-page original PDF downloaded. Introduction and translated inscriptions, especially Rabatak and Surkh Kotal, read; pp. 77 and 79 visually inspected. An editor’s English translations, not a new original-language reading. Uncertain words, possible year-six reference, disputed absolute chronology and versions remain explicit. No imperial polygon or universal language/religious policy reconstructed. The earlier foundation-host download failed; the university copy succeeded.',
    'Nicholas Sims-Williams',
    '2012',
  ),
  source(
    'aksum-world',
    '“Ethiopia” and the World, 330–1500 CE: introduction and early Aksum',
    'Cambridge University Press, Elements in the Global Middle Ages',
    'https://doi.org/10.1017/9781009106115',
    'scholarship',
    'Publisher’s eight-page excerpt downloaded and read, especially pp. 3 and 5–8; p. 6 visually inspected. Greek/Ge’ez and three-script distinction, first-century Periplus/Adulis, uncertain Zoskales identity, and separate Adulis monuments/transmission. Not the full 88-page book, Casson’s complete edition, an original manuscript or a fresh translation. Broad ancient names are not mapped onto modern national borders.',
    'Yonatan Binyam and Verena Krebs',
    '2024',
  ),
  source(
    'beta-samati',
    'Beta Samati: discovery and excavation of an Aksumite town',
    'Antiquity 93 (2019), 1534–1552; Cambridge University Press',
    'https://doi.org/10.15184/aqy.2019.84',
    'archaeology',
    'Original nineteen-page PDF and publisher HTML downloaded. Site/chronology, excavation methods, Area A, selected Area B material and Discussion/Conclusions read. Figures 3 and 4 inspected; Figure 4 is reproduced under the article’s CC BY 4.0 licence with figure credit. Food preparation, small-scale metal/glass work, mixed coin dates and dated deposits remain distinct. Original radiocarbon data/supplement and every stratigraphic association were not independently reanalysed. The author-repository PDF returned 403; the publisher copy succeeded.',
    'Michael J. Harrower, Ioana A. Dumitru and colleagues',
    '2019',
  ),
];
const dim = (text: string, citations: Citation[]) => ({ text, citations });
const review = (limitations: string[]): Subject['review'] => ({
  consultedOn: consulted,
  reviewer,
  scope:
    'Bounded C4 account with main/deeper/evidence reading, family entry, separately phased reference context and sourced geographic study.',
  limitations,
});
function palmyra(s: Subject) {
  s.contextIds = ['palmyra-civic-context'];
  s.summary =
    'A family memorial, a public tariff and caravan inscriptions make different people visible in Palmyra. Stone carving and kinship display belonged to a city whose officials regulated local exchange while merchants worked through wider networks. Reading these records together connects family choices, civic institutions and ordinary transactions. Their differences matter: a named portrait does not identify a caravan leader, and a tax rule does not describe every journey.';
  s.sections = [
    sec(
      'Names made a family memorable',
      'The selected relief identifies Zabdibol, his son Mokimu and daughters Tadmur and Alayyat. Its Aramaic inscription also sets out the father’s ancestry. A reclining figure, smaller companions, clothing and objects turn kinship into a durable image within a tomb. The Met interprets the stone as probably closing a family burial niche. Commissioning and carving such a memorial required resources and skilled work. Its carefully arranged banquet presents a chosen remembrance, rather than recording an ordinary meal or the household’s entire membership.',
      cite('met-322375', 'Inscription, banquet description and burial marker'),
    ),
    sec(
      'The city regulated recurring transactions',
      'In 137 CE the council published revised tax rules alongside older provisions to address disputes about charges. Greek and Palmyrene Aramaic versions made civic decisions visible in different forms of writing. The tariff includes local goods and services, not merely distant luxuries. Matthews discusses mobile clothing sellers, workshops and produce moving between villages and the city. Such evidence brings routine exchange into a history otherwise dominated by monumental tombs and famous caravans. The regulation shows what officials sought to organize; it does not establish universal compliance.',
      cite('palmyra-tax', 'Opening extract; printed pp. 173–175'),
    ),
    sec(
      'Long-distance exchange needed its own evidence',
      'Honorific inscriptions commemorating caravan leaders and supporters provide a separate record of commercial organization. The Getty discussion connects trading communities beyond the city with river and overland movement. A network depended on storage, distribution and intermediaries, not just a line between famous capitals. The named family in this relief is not thereby proved to have financed those journeys. Compare a family’s claim to remembered identity with a public record praising someone’s commercial contribution: each selects a different accomplishment and audience.',
      cite('palmyra-getty', 'Trade: caravan inscriptions and trading communities'),
      cite('trade', 'Trading posts and distribution'),
    ),
    sec(
      'One city held more than one kind of writing',
      'Public bilingual texts and private funerary inscriptions had different purposes. An inscription can preserve a name, obligation or civic decision without measuring how many residents could read. Children’s images sometimes support questions about education, but another relief’s writing tablet cannot be transferred to this family. The two sieges of 272 and 273 damaged the city and changed its position. They did not erase all later habitation. This longer sequence lets the second–third-century object remain a bounded family inquiry within a changing city.',
      cite(
        'palmyra-literacy',
        'Different Berlin relief and qualified literacy interpretation',
      ),
      cite('palmyra-getty', 'Inscriptions; Roman and Later Periods'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Compare inscriptions without merging their people',
      'Sokołowski studies a different relief, Berlin 27/65, depicting a boy and girl with inscriptions. His account proposes that a handled tablet could signal education and discusses a word that may mean tutor, guardian or household steward. These are interpretations of that object, not a biography supplied for Zabdibol’s children. The selected Met stone has its own names and composition. Comparing the two shows how image, text and an interpreter’s contextual knowledge work together; it cannot establish every child’s literacy, actual curriculum or age. The source’s hypotheses about languages learned and private teaching remain hypotheses.',
      cite('palmyra-literacy', 'Tablet, mrbyth and final qualifications'),
      cite('met-322375', 'Inscription'),
    ),
    sec(
      'Do not reduce an oasis city to a transit stop',
      'Local production, grazing, markets and village supplies belong alongside long-distance commerce. Matthews’s excerpt warns against treating the tariff as if it concerned only caravans. Meanwhile, honorific records favor people worth commemorating publicly. The two source groups should therefore be compared rather than ranked as interchangeable measures of prosperity. A household able to purchase carved stone is also not a representative sample of all households. Further work should examine archaeological neighborhoods, workshops, gendered labor and enslaved people, and distinguish fiscal categories from what people actually experienced. None of the sources consulted here yields a defensible city-wide income or literacy rate.',
      cite('palmyra-tax', 'Printed p. 173: local economy'),
      cite('palmyra-getty', 'Trade and funerary sculpture'),
    ),
  ];
  s.familyActivity = {
    title: 'Build a family tree from the supplied names',
    duration: 'About 5 minutes',
    steps: [
      'Count the four figures. Describe one visible difference before naming anyone.',
      'Use the inscription paraphrase below to connect Zabdibol with Mokimu, Tadmur and Alayyat. Keep the father’s ancestors separate from his children.',
      'Choose which source could answer a tax question: this family inscription or the civic tariff. Explain your choice.',
    ],
    explanation:
      'Names and relationships come from the museum’s reading of the inscription. Clothing or pose alone does not prove an occupation, caravan journey or every relationship in the household.',
  };
  s.evidenceReading = {
    title: 'Different inscriptions answer different questions',
    introduction:
      'These are source paraphrases, not fresh translations or a combined ancient document.',
    items: [
      {
        label: 'The selected memorial names kin',
        text: 'The Met identifies Zabdibol, his son Mokimu, daughters Tadmur and Alayyat, and a line of paternal ancestors.',
        interpretation:
          'The supplied reading supports named relationships. It does not identify this family’s occupation or a route taken by its members.',
        citations: [
          cite('met-322375', 'Inscription translation and descriptive paragraphs'),
        ],
      },
      {
        label: 'A civic decree addresses charges',
        text: 'The 137 tariff sets revised and earlier fiscal provisions in a public civic context.',
        interpretation:
          'A municipal regulation is different evidence from the honorific inscriptions associated with caravans. The Greek text also has gaps and editorial supplements.',
        citations: [
          cite(
            'palmyra-tax',
            'Printed pp. 174–175 and editorial conventions on p. 173',
          ),
        ],
      },
      {
        label: 'A different child holds a tablet',
        text: 'The Hamburg essay discusses two children on Berlin 27/65 and offers a qualified interpretation of a writing tablet.',
        interpretation:
          'Those children and their proposed education do not become the biography of the Met relief’s figures. An image of a tablet is not a city-wide literacy survey.',
        citations: [
          cite(
            'palmyra-literacy',
            'Berlin inventory and hypothetical education reading',
          ),
        ],
      },
    ],
  };
  s.dimensions['Work and coordination'] = dim(
    'Kinship display, civic fiscal decisions and caravan commemoration organized different relationships. The tariff concerns recurring local transactions; distant commercial roles require their own records.',
    [cite('palmyra-tax', 'Printed pp. 173–175'), cite('palmyra-getty', 'Trade')],
  );
  s.review = review([
    'No full audit of the tax law or a new Aramaic translation.',
    'The Seland caravan-families article was discoverable but its full text was blocked; it is not treated as read or used to identify the selected family.',
    'More neighborhood, workshop, gender and enslavement evidence and independent source review remain.',
  ]);
}
function kushan(s: Subject) {
  s.contextIds = ['kushan-temples-context'];
  s.summary =
    'Kushan coins and temple inscriptions show rulers presenting authority and people carrying out practical work. A coin’s images, an inscription’s account of earlier events and a named well repair have different dates and purposes. Keeping them separate reveals religious patronage and maintenance within a connected region. A royal message could circulate on money, while a sanctuary still needed a dependable water supply and people to build, repair and record it.';
  s.sections = [
    sec(
      'A small object carried a royal presentation',
      'The selected Met gold coin is catalogued around 130 CE and attributed to Gandhara. Its two photographs let us compare figures, attributes and surrounding letters. A ruler chose an image for a monetary object; that is different from documenting everyone’s beliefs. The catalogue’s general description discusses several rulers’ coins, so an example named in that paragraph should not automatically identify this specimen’s reverse. Neither a shared weight convention nor an image proves an individual coin travelled to Rome. Circulation requires find evidence belonging to the particular object.',
      cite(
        'met-39385',
        'Date, general coinage paragraph, two views and object details',
      ),
    ),
    sec(
      'A temple inscription remembered earlier commands',
      'At Rabatak, a Bactrian inscription describes royal orders concerning a temple, divine images and images of Kanishka and his predecessors. The account connects kingship with a dynasty and named officials. Sims-Williams distinguishes events assigned to the ruler’s first year from the later creation of the surviving record: possible references to year six make a first-year inscription date unsafe. Translation also preserves uncertain readings. This is evidence for a particular royal commemoration, not a complete map of conquest or a statement that all residents practiced one religion.',
      cite(
        'kushan-inscriptions',
        'Printed pp. 76–78, Rabatak introduction and translation',
      ),
    ),
    sec(
      'A sanctuary had to be kept supplied',
      'The Surkh Kotal inscription describes a water problem and building works begun in year 31 of the Kanishka era, conventionally placed around 158/159 CE. In the translation, Nukunzuk is credited with a well and water provision. A concluding version names Burzmihr in the work and Mihraman as the writer. These names shift attention from royal images to the people through whom a project was carried out and recorded. Some technical terms remain uncertain; the text does not supply a complete engineering plan, payroll or account from every worker.',
      cite('kushan-inscriptions', 'Printed pp. 78–79, SK 4 and version M'),
    ),
    sec(
      'Chronology changes the comparison',
      'Berlin’s catalogue dates a different Kanishka coin to approximately 127/128–150/151 and explicitly notes disputed dating. The older Met overview uses an earlier reign chronology. This account keeps those sources visible rather than forcing them into one exact accession year. The first-year narrative, the surviving inscription and the selected coin are related kinds of evidence with separate clocks. Peshawar, Mathura and the Bactrian temple region also had distinct local settings; the regional map locates them without inventing imperial borders or the coin’s itinerary.',
      cite('kanishka-chronology', 'Date and disputed chronology note'),
      cite('kushan', 'Older Kanishka chronology and capitals'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Language and script are different decisions',
      'Bactrian is an Iranian language written here using Greek-derived letters. Sims-Williams discusses an uncertain sentence about an edict and a change of language, alongside coin evidence. It should not become an unqualified decree that every subject spoke or read the same language. The Rabatak text’s divine list, royal ancestors and named officials form a specific commemorative setting. The region also supported Buddhist institutions and art, but that wider history is not reducible to one sanctuary or the imagery of one coin. A next inquiry should compare dated local inscriptions and archaeological contexts rather than making every temple a Buddhist monastery.',
      cite('kushan-inscriptions', 'Printed pp. 76–78 and uncertain translation'),
      cite('kushan', 'Gandhara and Buddhist art'),
    ),
    sec(
      'Named builders are visible, but not everyone is',
      'The translated Surkh Kotal record attributes actions to an official and preserves additional names in its concluding versions. This is valuable evidence of how work was credited, not proof that the senior official personally performed every task. The document’s copies differ, and terms for the lifting equipment and some titles remain uncertain. A historical explanation can identify water provision as a practical problem while declining to invent the machine’s dimensions or the workers’ legal status. The source also distinguishes the date of the works from the later inscription. Maintenance and commemoration are different actions even when one record connects them.',
      cite(
        'kushan-inscriptions',
        'Printed pp. 78–79, versions and editorial question marks',
      ),
    ),
  ];
  s.familyActivity = {
    title: 'Separate a royal image from a practical task',
    duration: 'About 5 minutes',
    steps: [
      'Inspect both coin photographs. Describe one visible feature on each side without guessing a name from dress alone.',
      'Read the well-repair paraphrase below. Identify a problem, an action and someone named in the record.',
      'Explain why a coin image and a maintenance inscription tell different parts of the story.',
    ],
    explanation:
      'The activity compares supplied evidence. It does not identify the coin’s findspot, reproduce a complete inscription or invent a model of the well.',
  };
  s.evidenceReading = {
    title: 'Keep the event, object and record apart',
    introduction:
      'Paraphrases follow the catalogues and Sims-Williams’s translated texts. No new Bactrian transcription is supplied.',
    items: [
      {
        label: 'The coin has its own catalogue identity',
        text: 'Met 99.35.3024 is dated around 130 CE. Berlin 18202384 is a different coin with a broader proposed ruler chronology.',
        interpretation:
          'The Berlin specimen’s weight, deity description or provenance should not be transferred to the Met object. Catalogue attribution is not a documented circulation trail.',
        citations: [
          cite('met-39385', 'Artwork Details'),
          cite('kanishka-chronology', 'Date, obverse/reverse and accession'),
        ],
      },
      {
        label: 'Year one is remembered in a later record',
        text: 'Rabatak recounts first-year events; its possible year-six reference leads the editor to place the surviving inscription no earlier than around 132/133.',
        interpretation:
          'The statement concerns an interpretation and a lower bound, not an exact carving year. Uncertain words remain marked in the source translation.',
        citations: [cite('kushan-inscriptions', 'Printed pp. 76–78')],
      },
      {
        label: 'A well connects officials, builders and writing',
        text: 'Surkh Kotal credits water works under Nukunzuk; version M also names Burzmihr and Mihraman.',
        interpretation:
          'This supports a specific maintenance story. It does not make all work the official’s own manual labor or resolve every technical term.',
        citations: [
          cite('kushan-inscriptions', 'Printed p. 79, works and version M conclusion'),
        ],
      },
    ],
  };
  s.dimensions['Work and coordination'] = dim(
    'Temple maintenance required water provision, attributed responsibility and written commemoration. A ruler’s image and the practical upkeep of a sanctuary preserve different parts of coordination.',
    [cite('kushan-inscriptions', 'Printed pp. 78–79')],
  );
  s.review = review([
    'No new Bactrian reading, full numismatic sequence or original excavation-volume audit.',
    'Ruler chronology, uncertain words/titles and named workers’ wider social positions remain qualified.',
    'More household, agricultural and Buddhist institutional evidence and independent review remain.',
  ]);
}
function aksum(s: Subject) {
  s.contextIds = ['aksum-red-sea-context'];
  s.summary =
    'Aksum’s highland city, Adulis on the Red Sea and an inland town did different work in a connected economy. A merchant-oriented text describes exchange; excavated food-processing equipment, craft debris and coins reveal activities away from the capital’s monuments. These sources also belong to different centuries. The early port account, later royal inscriptions and Beta Samati’s late deposits should be compared through time, rather than assembled into one scene at 200 CE.';
  s.sections = [
    sec(
      'The inland city was not itself a harbor',
      'The first-century Periplus describes Adulis and an inland connection to Aksum. Binyam and Krebs explain how this merchant-oriented account links a coastal outlet with inland exchange and distinguishes goods for different buyers. It is not simply a list of royal luxuries. The account’s identification of a ruler called Zoskales is debated; the passage cannot define precise first-century imperial borders. The map therefore separates the highland city, the port and a later archaeological research area, without tracing one ship’s voyage or an exact mountain road.',
      cite('aksum-world', 'Excerpt pp. 5–7: Periplus, Adulis and Zoskales'),
    ),
    sec(
      'Inland work sustained more than monuments',
      'At Beta Samati, excavators found food-storage and preparation evidence alongside small-scale metal and glass-working debris in Area A. Grinding stones, ordinary pottery and changes in the use of a space make recurring work visible. The authors interpret slag and glass wasters as evidence of production. These findings complicate the assumption that all glass in the region was imported. They come from a particular town and dated layers, not a census of every Aksumite household. The nearby basilica belongs to another area and a sequence of building phases.',
      cite('beta-samati', 'Printed pp. 1540–1543: methods, Area A and selected Area B'),
    ),
    sec(
      'An old coin can occur in a later deposit',
      'The reproduced excavation photograph presents five coins, each shown on two sides. They include different rulers and dates, not five contemporary issues. The authors combine coin identification with pottery and radiocarbon evidence when interpreting the upper deposits. A coin’s manufacture, use, deposition and modern excavation are separate events. An older specimen does not automatically date an entire layer, and the photograph alone cannot establish how long each coin circulated. The published chronology for Armah is itself discussed with an alternative; the account does not turn that debate into a single secure year.',
      cite('beta-samati', 'Printed pp. 1541–1542, Figure 4 and Armah chronology'),
    ),
    sec(
      'Royal language and local change need separate clocks',
      'Fourth-century royal inscriptions use Greek and Ge’ez in more than one script. Binyam and Krebs distinguish language from script and warn that the ancient name Ethiopia had shifting uses. A royal conversion also does not identify every resident’s beliefs. Coins, inscriptions, domestic material and the basilica illuminate different changes. The older Roman grape-shaped bottle remains a type comparison: this museum specimen is not documented as excavated at Aksum. The new excavation photograph supplies a different kind of evidence with an actual reported find context.',
      cite('aksum-world', 'Excerpt pp. 3–4'),
      cite('beta-samati', 'Printed pp. 1536 and 1541–1542'),
      cite('aksum', 'Roman glass comparison'),
      cite('met-256732', 'Catalogue identity'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A building plan is not a single frozen household',
      'The excavators distinguish Area A’s residential/workshop activities from Area B’s basilica and identify phases within them. Because walls continue into unexcavated ground, they use space rather than assuming every enclosed-looking area was a complete room. This matters when explaining who cooked, stored goods or made things: an excavated assemblage has a location and history, but it is not an unposed portrait of one family. The study also reports food consumption near the basilica. Sacred, administrative and ordinary activities can intersect without becoming identical. More work is needed before assigning specific households or a complete production organization.',
      cite(
        'beta-samati',
        'Printed pp. 1540–1545 and 1549: methods, areas and food consumption',
      ),
    ),
    sec(
      'Inscription, copy and modern interpretation are distinct sources',
      'Binyam and Krebs discuss two different Adulis monuments whose texts survive through Cosmas’s later account. One commemorated a Hellenistic ruler; another recorded the claims of an Aksumite ruler centuries later. They should not become one monument, one king or a contemporary first-century witness. Their discussion also distinguishes two languages from three scripts in fourth-century royal texts, refining an older museum shorthand. The excerpt consulted here is only eight pages of a larger book. Its discussion of political claims should not be converted into exact boundaries, universal language use or a history of all communities in the region.',
      cite('aksum-world', 'Excerpt pp. 3 and 7–8'),
    ),
  ];
  s.familyActivity = {
    title: 'Give a coin more than one date',
    duration: 'About 5 minutes',
    steps: [
      'In the excavation image, find five columns. Each pairs two views of a coin; do not count the ten photographs as ten objects.',
      'Use the evidence note to separate an older coin from the later deposits discussed by the excavators.',
      'Put these actions in a possible order: a coin is made, used, enters the ground, and is excavated and photographed. Explain what the image alone leaves unknown.',
    ],
    explanation:
      'The figure was published in 2019; the coins and deposits are much older. Dates of manufacture and context must be read together. The exercise does not supply an exact circulation history for any specimen.',
  };
  s.evidenceReading = {
    title: 'Exchange, manufacture and find context',
    introduction:
      'These are paraphrases of the consulted scholarship, not newly translated ancient texts or an independent reanalysis of the excavation.',
    items: [
      {
        label: 'A port account has a particular audience',
        text: 'The Periplus discussion describes Adulis in a merchant-oriented account, including goods for different buyers and links inland.',
        interpretation:
          'It is a first-century witness, not a description of every later phase. Zoskales’s relationship to Aksum remains uncertain.',
        citations: [cite('aksum-world', 'Excerpt pp. 5–7')],
      },
      {
        label: 'Production leaves material traces',
        text: 'The excavators report metal slag and glass wasters in Area A alongside domestic material.',
        interpretation:
          'This supports local work at Beta Samati and challenges treating every glass item as an import. It does not identify the origin of every glass object in the kingdom.',
        citations: [
          cite('beta-samati', 'Printed pp. 1541 and 1548: production evidence'),
        ],
      },
      {
        label: 'Five coins have different histories',
        text: 'From left to right the source identifies Armah, Armah, an anonymous ruler, pre-Christian Ezana and MHDYS. Coin types are considered with pottery and radiocarbon dates.',
        interpretation:
          'These coins are not one issue of 200 CE. The authors discuss late upper deposits and alternative Armah dating; the picture is not a self-sufficient layer date.',
        citations: [cite('beta-samati', 'Printed pp. 1541–1542, Figure 4')],
      },
    ],
  };
  s.dimensions.authority = dim(
    'Royal inscriptions make claims in particular languages and scripts. The inland excavation supplies different evidence for work and local change; neither establishes every resident’s identity or beliefs.',
    [
      cite('aksum-world', 'Excerpt pp. 3–4'),
      cite('beta-samati', 'Printed pp. 1540–1543'),
    ],
  );
  s.dimensions['Work and coordination'] = dim(
    'A highland center, coastal outlet and inland production/consumption sites performed different tasks. Named exchange points do not by themselves reconstruct a particular trader’s route.',
    [
      cite('aksum-world', 'Excerpt pp. 5–7'),
      cite('beta-samati', 'Area A and Discussion'),
    ],
  );
  s.terms.push('stratigraphy');
  s.review = review([
    'Only the eight-page Binyam/Krebs excerpt was consulted, not the full book or complete critical Periplus edition.',
    'Excavation associations, radiocarbon calibration, coin chronology and all original inscriptions were not independently reanalysed.',
    'More agricultural, regional, gender and enslavement evidence and independent review remain.',
  ]);
}
const phase = (
  year: number,
  label: string,
  title: string,
  text: string,
  citations: Citation[],
) => ({ year, label, title, text, citations });
const contexts: HistoricalContext[] = [
  {
    id: 'palmyra-civic-context',
    title: 'Palmyra: families, civic rules and changing power',
    region: 'West/Central Asia',
    interval: interval(
      1,
      300,
      'First–third centuries CE: selected civic orientation',
      'Rounded teaching frame, not Palmyra’s foundation or disappearance. The memorial retains its separate second–third-century date range.',
      'approximate',
    ),
    summary:
      'Distinguish family memorials, civic transactions and caravan commemoration within a city that continued after third-century conflict.',
    subjectIds: ['palmyra'],
    citations: [
      cite('palmyra-tax', 'Opening extract and pp. 173–175'),
      cite('palmyra-getty', 'Trade; Roman and Later Periods'),
    ],
    phases: [
      phase(
        50,
        'Mid-first century CE (orientation)',
        'A trading city in a wider setting',
        'The Met describes Palmyra’s prosperity and caravan setting by this period. This viewing point is not an exact foundation date.',
        [cite('met-322375', 'Mid-first-century city context')],
      ),
      phase(
        137,
        '137 CE',
        'A public fiscal decision',
        'A council decree and revised tariff address recurring charges. The regulation’s civic scope is distinct from caravan itineraries.',
        [cite('palmyra-tax', 'Opening extract; pp. 174–175')],
      ),
      phase(
        200,
        'Second–third centuries CE: object window',
        'The selected family memorial',
        'The broad catalogue range does not identify an exact year for carving, commissioning or the deaths represented.',
        [cite('met-322375', 'Date and description')],
      ),
      phase(
        272,
        '272 CE',
        'Aurelian recaptures Palmyra',
        'The Getty account distinguishes this siege from the following year’s conflict. The portrait is not evidence of the family’s role in either event.',
        [cite('palmyra-getty', 'Roman and Later Periods')],
      ),
      phase(
        273,
        '273 CE',
        'Another siege and later habitation',
        'A second rebellion and siege damaged the city. The same account describes continued habitation afterward; this is not a date of complete disappearance.',
        [cite('palmyra-getty', 'Roman and Later Periods')],
      ),
    ],
  },
  {
    id: 'kushan-temples-context',
    title: 'Kushan rule: coin images, temple orders and maintenance',
    region: 'South Asia',
    interval: interval(
      1,
      300,
      'First–third centuries CE: selected Kushan frame',
      'Analytical orientation, not newly asserted foundation/dissolution dates. Absolute ruler chronology and some inscription readings remain debated.',
      'approximate',
    ),
    summary:
      'Keep an era’s proposed starting point, events described retrospectively, object catalogues and later building works on separate clocks.',
    subjectIds: ['kushan-contexts'],
    citations: [
      cite('kushan-inscriptions', 'Printed pp. 76–79'),
      cite('kanishka-chronology', 'Date and dispute note'),
    ],
    phases: [
      phase(
        105,
        'Possibly c. 104/105 CE',
        'A date in an unnamed era',
        'Sims-Williams discusses a possible conversion of Dasht-e Nawur’s year 279 and identifies Vima Taktu. The conversion depends on the proposed era and remains conditional.',
        [cite('kushan-inscriptions', 'Printed p. 76')],
      ),
      phase(
        127,
        'c. 127/128 CE: proposed era start',
        'A chronology used for comparison',
        'The editor and Berlin catalogue use this revised framework. It does not turn every accession or coin date into an exact settled year.',
        [
          cite('kushan-inscriptions', 'Printed p. 76'),
          cite('kanishka-chronology', 'Date'),
        ],
      ),
      phase(
        133,
        'Probably no earlier than c. 132/133 CE',
        'The Rabatak record',
        'The text remembers first-year events but may refer to year six. A lower bound on the record differs from the date of its narrated commands.',
        [cite('kushan-inscriptions', 'Printed pp. 76–78')],
      ),
      phase(
        159,
        'Not before c. 158/159 CE',
        'Surkh Kotal and water works',
        'The editor dates the works’ year 31 in this proposed absolute framework. The inscription itself may be later, and technical readings remain qualified.',
        [cite('kushan-inscriptions', 'Printed pp. 78–79')],
      ),
    ],
  },
  {
    id: 'aksum-red-sea-context',
    title: 'Aksum, Adulis and inland work through time',
    region: 'Africa',
    interval: interval(
      1,
      700,
      'First–seventh centuries CE: selected connections and excavated phases',
      'A reference window for these sources, not exact founding/abandonment or the full lifespan of Aksum. The original dossier retains its first–eighth-century convention.',
      'approximate',
    ),
    summary:
      'An early port account, fourth-century royal writing and later inland deposits describe different phases. They do not all illustrate 200 CE.',
    subjectIds: ['aksum'],
    citations: [
      cite('aksum-world', 'Excerpt pp. 3–8'),
      cite('beta-samati', 'Chronology, Area A and Discussion'),
    ],
    phases: [
      phase(
        50,
        'Mid-first century CE (viewing anchor)',
        'The merchant-oriented account',
        'The Periplus discussion places Adulis and inland exchange in this period; the viewing year is not a precise composition date or an imperial border.',
        [cite('aksum-world', 'Excerpt pp. 5–7')],
      ),
      phase(
        200,
        '200 CE: chapter viewing anchor',
        'Keep later evidence dated',
        'The chapter opens a changing world. The major stelae and the reproduced excavated coins retain later dates; none is silently assigned to this exact year.',
        [
          cite('aksum', 'Stelae chronology'),
          cite('beta-samati', 'Figure 4 and coin chronology'),
        ],
      ),
      phase(
        350,
        'Fourth century CE (orientation)',
        'Royal writing and changing religion',
        'Greek and Ge’ez occur in multiple scripts. The excavation study places Ezana’s conversion broadly in the mid-fourth century while cautioning about its non-elite effects.',
        [cite('aksum-world', 'Excerpt p. 3'), cite('beta-samati', 'Printed p. 1536')],
      ),
      phase(
        600,
        'Late sixth–seventh-century deposits',
        'Coins and everyday work',
        'The excavation combines coin types, pottery and radiocarbon evidence to interpret later deposits. Armah’s proposed dates have an alternative discussed in the source.',
        [cite('beta-samati', 'Printed pp. 1541–1542')],
      ),
      phase(
        650,
        'Around the mid-seventh century CE',
        'Latest dated occupation in this excavation',
        'The latest dated charcoal samples inform a phase of habitation. This rounded viewing point does not establish the last resident’s departure or the end of the kingdom.',
        [cite('beta-samati', 'Printed p. 1540, Table 2')],
      ),
    ],
  },
];
const journey: Journey = {
  id: 'objects-work-exchange',
  title: 'Objects, work and exchange',
  question: 'What turns an object into evidence of a connection?',
  duration: 'About 20–30 minutes',
  printSourcesPerPage: 3,
  introduction:
    'Compare a Palmyrene family memorial, Kushan coins and temple records, and Aksumite excavated material. This thematic inquiry crosses different dates and contexts. It is not one traveller’s route, a list of identical economies or proof of direct contact between every stop.',
  stops: [
    {
      subject: 'palmyra',
      object: 'met-322375',
      year: 200,
      title: 'Begin with named people',
      narrative:
        'Read the family inscription, then distinguish it from civic tax rules and public caravan commemoration. A name on this memorial does not supply an occupation or journey.',
    },
    {
      subject: 'kushan-contexts',
      object: 'met-39385',
      year: 159,
      title: 'Separate presentation from upkeep',
      narrative:
        'Compare a royal coin with the temple-maintenance account. The selected object, earlier commands and surviving records have different dates; a named official is not every worker.',
    },
    {
      subject: 'aksum',
      object: 'beta-samati-coins',
      year: 600,
      title: 'Ask where the object was found',
      narrative:
        'The excavation photograph shows five coins with different issue dates. Read them with deposit evidence and nearby domestic/craft traces, keeping the earlier port account on its own clock.',
      compare: 'kushan-contexts',
    },
  ],
  conclusion:
    'Connections become historical explanations through specific practices and evidence: civic regulation, distribution, maintenance, local production and recorded finds. Similar objects or overlapping dates alone do not reconstruct a journey.',
  evidence: {
    prompt:
      'What further evidence would best support a claim that this named Palmyrene family financed a particular caravan?',
    options: [
      {
        text: 'Their memorial and the caravan records belong to the same city.',
        supported: false,
        feedback:
          'A shared city supplies context. It does not identify the family’s occupation or participation in a particular journey.',
      },
      {
        text: 'A dated record identifying these family members and their financial role in that caravan.',
        supported: true,
        feedback:
          'The claim names particular people and an activity. It needs evidence linking those people with that activity, read with its date and purpose. The pictured family inscription alone supplies no caravan role.',
      },
      {
        text: 'Their clothing and banquet look expensive.',
        supported: false,
        feedback:
          'A chosen display of resources does not establish how the family earned or invested them. Clothing and a banquet cannot identify a caravan investment.',
      },
    ],
    citations: [
      cite('met-322375', 'Family inscription and burial marker'),
      cite('palmyra-getty', 'Trade: caravan inscriptions and trading communities'),
    ],
  },
  returnPrompt:
    'Choose two records. Explain the work or relationship each makes visible, then name evidence needed before drawing a route between their places.',
};
export function applyExchange(corpus: Corpus) {
  corpus.sources.push(...sources);
  palmyra(corpus.subjects.find((s) => s.id === 'palmyra')!);
  kushan(corpus.subjects.find((s) => s.id === 'kushan-contexts')!);
  aksum(corpus.subjects.find((s) => s.id === 'aksum')!);
  corpus.contexts = [...(corpus.contexts ?? []), ...contexts];
  corpus.media.push(...exchangeMedia);
  corpus.subjects.find((s) => s.id === 'aksum')!.objectIds.unshift('beta-samati-coins');
  corpus.journeys.push(journey);
  corpus.journeys.find((j) => j.id === 'world-200')!.printSourcesPerPage = 3;
  corpus.glossary.push({
    id: 'stratigraphy',
    name: 'Stratigraphy',
    definition:
      'The sequence and relationships of archaeological layers and features. An object’s manufacture date and the date or history of the deposit containing it are different questions.',
  });
  for (const id of ['palmyra', 'kushan-contexts']) {
    const s = corpus.subjects.find((s) => s.id === id)!;
    if (!s.terms.includes('inscription')) s.terms.push('inscription');
  }
  for (const id of [
    'trade',
    'met-322375',
    'met-39385',
    'kushan',
    'kanishka-chronology',
    'aksum',
    'met-256732',
  ])
    corpus.sources.find((s) => s.id === id)!.accessed = consulted;
  corpus.sources.find((s) => s.id === 'kushan')!.scope =
    'Older Met essay reread for Gandhara, urban/religious life and Peshawar/Mathura setting. Its early Kanishka chronology is retained as a source discrepancy, not adopted as the current precise framework. No exact imperial polygon or universal tolerance claim used.';
  corpus.sources.find((s) => s.id === 'aksum')!.scope =
    'Architecture, residential differences, Adulis and type comparison reread. The selected Roman glass specimen is not an Aksum find. Third/fourth-century stelae retain separate dates. Older language/script shorthand is refined by Binyam/Krebs; exclusivity claims about African writing are not adopted.';
  for (const id of ['met-322375', 'met-39385'])
    corpus.media.find((m) => m.id === id)!.licenseUrl =
      'https://creativecommons.org/publicdomain/zero/1.0/';
  corpus.media.find((m) => m.id === 'met-39385')!.notice = [
    'Describe a visible feature on each of the two photographed sides.',
    'Distinguish this accession from other coins described in the catalogue’s general paragraph.',
    'A place attribution does not establish this specimen’s circulation.',
  ];
  corpus.media.find((m) => m.id === 'met-39385')!.alt =
    'Gold coin with a standing figure and surrounding letters. The alternate photograph shows another standing figure beside an animal.';
  const pack = corpus.packs.find((p) => p.id === 'C4')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['kushan-contexts', 'aksum'],
      start: 1,
      end: 700,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Separate a city and its named exchange settings, Kushan regional centers and a temple-inscription region, and Aksum’s highland, coastal and inland research contexts. One schematic Palmyra trading-post sequence is qualified; the learning path is not a route.',
      limits:
        'Three expanded cases supplement Rome/Han and the existing C4 chapter. Larger regional frameworks, workshop/household histories and independent historical/family acceptance remain incomplete.',
    },
  ];
  pack.coverage['West/Central Asia'].reason =
    'Expanded Palmyra account separates family memorials, local civic regulation and caravan records. Wider Roman eastern provinces, Parthian/Sasanian histories and diverse households remain limited.';
  pack.coverage['South Asia'].reason =
    'Expanded Kushan account separates coin catalogues, chronology disputes and temple maintenance in Bactria. The wider subcontinent, agricultural/household contexts and Buddhist institutions remain selective.';
  pack.coverage.Africa.reason =
    'Expanded Aksum account distinguishes early Adulis exchange, changing royal writing and later excavated inland work. Africa beyond these selected northeast settings remains inadequately covered.';
  applyExchangePlaces(corpus);
}
