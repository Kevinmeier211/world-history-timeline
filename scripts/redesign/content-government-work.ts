import type {
  Corpus,
  Subject,
  Source,
  HistoricalContext,
  Journey,
} from '../../src/atlas/model';
import { cite, interval, sec } from './content-helpers';
import { applyGovernmentPlaces } from './government-places';
import { governmentMedia } from './government-media';
const consulted = '2026-10-28';
const source = (
  id: string,
  title: string,
  institution: string,
  url: string,
  type: Source['type'],
  scope: string,
  author?: string,
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
    'qin-mausoleum',
    'Mausoleum of the First Qin Emperor',
    'UNESCO World Heritage Centre',
    'https://whc.unesco.org/en/list/441/',
    'archaeology',
    'English Description, Brief synthesis and criterion iv consulted for Lishan mausoleum, construction from 246 BCE, death in 210 and relationship to the capital Xianyang. No superlative, exact worker total, surveyed capital plan or imperial boundary adopted.',
  ),
  source(
    'ashoka-edicts-1925',
    'Inscriptions of Asoka: Girnar II and Dhauli Separate I',
    'Archaeological Survey of India; Clarendon Press; Internet Archive copy',
    'https://archive.org/details/InscriptionsOfAsoka.NewEditionByE.Hultzsch',
    'primary',
    'Hultzsch 1925 edition: OCR read for Girnar II (printed pp. 3–4), Dhauli Separate I (pp. 95–97) and introduction on regional versions. Exact source scans of p. 4 and pp. 95–96 retrieved and visually inspected. Editorial translation and ancient message are separate. No complete volume audit; this edition predates the Kandahar Greek/Aramaic discoveries. Scans remain private research, not public assets.',
    'E. Hultzsch, editor and translator',
    '1925',
  ),
  source(
    'athens-constitution',
    'The Athenian Constitution, parts 26, 42–43',
    'Project Gutenberg, ebook 26095',
    'https://www.gutenberg.org/ebooks/26095',
    'primary',
    'Kenyon English translation: parts 26, 42 and 43 consulted for the parentage rule, male enrollment scrutiny and institutional procedure. A late-fourth-century account attributed to Aristotle’s school, not a contemporary report of the selected Archaic vase. The c330 BCE orientation follows Forsdyke rather than the older MIT page header. No claim to have verified the original papyrus or every legal rule.',
    'Attributed to Aristotle; translated by F. G. Kenyon',
  ),
  source(
    'athens-status-research',
    'Slave Agency and Citizenship in Classical Athens',
    'Symposion 2017; Österreichische Akademie der Wissenschaften; author copy at University of Michigan',
    'https://lsa.umich.edu/content/dam/classics-assets/classicsdocuments/FORSDYKE/ForsdykeSymposion2017.pdf',
    'scholarship',
    'Downloaded author PDF with volume front matter. Printed pp. 345–349 read; p. 348 citizenship passage visually inspected. Argument about status claims and networks, 451/0 and 403 BCE law and c330 treatise context. Selected legal evidence does not provide a reliable frequency of successful passing or represent every enslaved person.',
    'Sara Forsdyke',
    '2018',
  ),
  source(
    'athens-sites',
    'Ancient Agora of Athens',
    'Hellenic Heritage; archaeological site and museum',
    'https://www.hh.gr/en/destinations/ancient-agora-athens/',
    'archaeology',
    'Historical description consulted: Agora’s mixed public uses, Bouleuterion, Tholos and State Archives, and Assembly place on the Pnyx. Modern visitor information is not used as ancient evidence. Approximate locators only; no street itinerary, exact building boundary or universal political participation inferred.',
  ),
];
const review = (limitations: string[]): Subject['review'] => ({
  consultedOn: consulted,
  reviewer:
    'Codex source consultation and self-review; not independent historian approval',
  scope:
    'Bounded C3 explanation with main/deeper/evidence reading, family entry, distinct reference phases and sourced geographic orientation.',
  limitations,
});
const dim = (text: string, source: string, locator: string) => ({
  text,
  citations: [cite(source, locator)],
});
function qin(s: Subject) {
  s.contextIds = ['qin-state-context'];
  s.summary =
    'An imperial standard needed people, materials and repeated work to become ordinary practice. Qin measuring objects announced central authority, while excavated wooden records show officials processing grain, reports and responsibilities in a conquered region. These sources let us compare what a government required with how an office worked. They preserve both coordination and constraint without making every official, worker or household identical.';
  s.sections = [
    sec(
      'A common rule travelled on different devices',
      'A balance weight compares mass; a capacity measure holds volume. Either could carry an imperial decree while doing a different job. The Palace Museum dates its measure’s decree to the First Emperor’s 26th year, 221 BCE. The text announces conquest, imperial title and common standards, with peace as a royal claim. An inscribed decree did not prove accuracy in every transaction.',
      cite('qin-quan', 'Description: balance weight and edict'),
      cite('qin-measure', 'Introduction: device and 221 BCE decree'),
    ),
    sec(
      'A local office had to make records usable',
      'At Liye, excavated wood documents are associated with Qianling county administration and date mainly to 222–208 BCE. Officials wrote, received and annotated records. Staack compares actual tablets with prescriptions about size and writing layout, and studies tallies used when grain was issued. Reliable recording required the relevant facts to remain identifiable even when their arrangement varied. This was practical work: preparing writing surfaces, recording responsibility and keeping information available for another official to process or check.',
      cite('qin-practice', 'Printed pp. 147–153; §3 grain disbursal tallies'),
    ),
    sec(
      'Making the writing surface was work too',
      'The paper connects the collection and preparation of wood with legal provisions and a fragment recording a person cutting tablets. It suggests that some stationery could have been made by assigned convict labor. That proposal matters because an archive depended on more people than the named scribes. The fragment does not identify the maker of every surviving tablet, and the labor arrangement remains a qualified reconstruction. Officials’ choices about materials and time should therefore be read alongside the unequal power that organized work.',
      cite(
        'qin-practice',
        'Printed p. 157, wood preparation and qualified convict-labor interpretation',
      ),
    ),
    sec(
      'Uniformity had practical limits',
      'Lengths and required information were more consistent than some widths or layouts. Staack proposes practical reasons: compatible documents were easier to handle, while using narrower wood or more writing could save resources. These are explanations tested against a local archive, not proof that every departure was resistance or every office enjoyed the same freedom. Even fines did not guarantee identical documents. The contrast between prescribed form and observed practice makes standardization a historical process that needs investigation.',
      cite('qin-practice', 'Printed pp. 169–170, Conclusions'),
    ),
  ];
  s.deeperReading = [
    sec(
      'The comparison uses sources with different histories',
      'The Liye records come from excavation; the Yuelu Academy manuscripts used for some prescribed formats were not archaeologically excavated. Staack explicitly says their exact provenance is unclear. Their contents and comparison with excavated material inform his argument, but they must not acquire a secure Liye findspot by being discussed beside that archive. The regional map locates the capital, Liye and the royal mausoleum; it does not mark Yuelu Academy as an ancient source location. A next inquiry should examine the relevant legal manuscripts and archaeological publications in greater detail.',
      cite('qin-practice', 'Printed pp. 149–150, §2.1 and provenance'),
    ),
    sec(
      'One archive gives a local test, not a census',
      'The study’s measured subsets depend on preservation and on what had been published with usable photographs. The differences it finds cannot be projected automatically to every Qin county. Even a named scribe’s preferred arrangement does not reveal all of that person’s training or choices. The author considers shortages of qualified staff and differing backgrounds as possible explanations. Following those questions requires additional archives and labor evidence, including people whose work produced records but who did not write an account of their own. Qin’s short imperial interval is also distinct from the longer history of the state and its projects.',
      cite('qin-practice', 'Printed pp. 150 and 169–170'),
      cite('qin-mausoleum', 'Construction from 246 BCE'),
    ),
  ];
  s.familyActivity = {
    title: 'Test what a record must preserve',
    duration: 'About 5 minutes',
    steps: [
      'In the diagram, separate a measuring device from a written record. Say what each helps someone do.',
      'Name three facts a grain record might need to preserve. Rearrange their order on paper without inventing an ancient inscription.',
      'Explain why changing the order is different from losing a fact.',
    ],
    explanation:
      'Your page is a modern demonstration. The source compares actual records with prescriptions; it does not say every variation was harmless or every official followed one layout.',
  };
  s.evidenceReading = {
    title: 'Compare an announcement, a prescription and a record',
    introduction:
      'The passages below are paraphrases of the museum accounts and Staack’s research, not newly translated Qin inscriptions.',
    items: [
      {
        label: 'A decree makes a claim',
        text: 'The inscribed capacity measure announces a common standard after conquest and the assumption of an imperial title.',
        interpretation:
          'This is evidence for a royal announcement attached to a device. A balance weight and a capacity measure are different objects, and neither measures universal compliance.',
        citations: [
          cite('qin-measure', 'Introduction, decree content'),
          cite('qin-quan', 'Function of a quan'),
        ],
      },
      {
        label: 'Provenance belongs to each manuscript group',
        text: 'Liye documents were excavated; the Yuelu Academy manuscript collection used for some regulations is unprovenanced.',
        interpretation:
          'Do not identify the regulation as an excavated Liye tablet or use the modern institution’s location as an ancient findspot.',
        citations: [cite('qin-practice', 'Printed pp. 149–150')],
      },
      {
        label: 'Variation has more than one possible explanation',
        text: 'Staack finds differences in material dimensions and arrangement alongside relatively stable required information.',
        interpretation:
          'His proposed pragmatic explanations are not a verdict on every official or on administration throughout the empire.',
        citations: [cite('qin-practice', 'Printed pp. 169–170')],
      },
    ],
  };
  s.dimensions['Work and coordination'] = dim(
    'Officials, writing-surface makers and recorded recipients connected standards with recurring administrative work. Local variation and coerced labor require their own evidence.',
    'qin-practice',
    'Printed pp. 157 and 169–170',
  );
  s.terms.push('standardization');
  s.returnPrompt =
    'Which feature of a local document would help distinguish a workable adaptation from a failure to record responsibility?';
  s.review = review([
    'The 27-page Staack paper was downloaded; specified sections, tables and source images were consulted, not every referenced Chinese edition.',
    'Some regulations derive from the unprovenanced Yuelu collection. Household experience, recruitment and the scale of coerced work need more evidence.',
    'No newly licensed photograph of an inscribed measure was added; the graphic is a modern comparison guide.',
  ]);
}
function ashoka(s: Subject) {
  s.contextIds = ['mauryan-messages-context'];
  s.summary =
    'Ashoka’s rule depended on people carrying, interpreting and acting on messages across regions. Rock and pillar inscriptions address moral conduct, officials and religious communities in different settings. They announce practical actions as well as ideals, but an announcement is not an inspection of its results. Reading selected edicts beside their places and audiences shows how royal government sought to work, and whose experiences still need other evidence.';
  s.sections = [
    sec(
      'A message needed a local audience',
      'Neelis describes regional Prakrit inscriptions and Greek and Aramaic material at Kandahar. Language and script are separate choices. Neither proves that everyone nearby could read the message; hearing and explanation are further questions. The geographic distribution shows attention to different audiences. It does not outline every territory controlled by the Mauryas or trace one messenger’s journey.',
      cite('ashoka', 'Inscriptions, languages, Pataliputra and Kandahar'),
    ),
    sec(
      'The announced actions were practical',
      'In Hultzsch’s English edition, Girnar Rock Edict II describes provision for people and cattle, planting useful herbs and digging wells and planting trees along roads. These are tasks requiring materials, people and continuing access, rather than an abstract slogan about kindness. Yet the royal statement alone does not identify every worker, demonstrate that every well was maintained or show how benefits were distributed. An account of implementation would need evidence from particular places and later use.',
      cite('ashoka-edicts-1925', 'Printed pp. 3–4, Girnar II, sections A–D'),
    ),
    sec(
      'Officials were told how to exercise power',
      'Dhauli Separate Edict I addresses judicial officials at Tosali. The translated text asks for impartial treatment and warns about anger, haste, fatigue and other obstacles to good judgment. This gives a concrete mechanism for royal instruction: address the people making decisions and tell them how their work should change. It also preserves the king’s paternal authority over subjects. It is not a grant of equal political participation, a record of every judgment or proof that abusive treatment stopped.',
      cite('ashoka-edicts-1925', 'Printed pp. 95–97, Dhauli Separate I'),
    ),
    sec(
      'Conquest and moral instruction belong together',
      'Rock Edict XIII expresses remorse over Kalinga’s conquest. The resulting account should keep warfare and the king’s moral presentation visible together, rather than turn remorse into proof that power no longer involved coercion. Neelis distinguishes the broader moral and administrative program of dhamma from a complete statement of Buddhist doctrine. Ashoka patronized Buddhist institutions and also supported other religious communities. Different inscriptions and audiences offer a more useful history than treating every carved message as one identical manifesto.',
      cite('ashoka', 'Kalinga, dhamma and religious patronage'),
      cite('ashoka-edicts-1925', 'Introduction: regional versions and separate edicts'),
    ),
  ];
  s.deeperReading = [
    sec(
      'The message at Dhauli is not the whole series',
      'The 1925 edition distinguishes the two Separate Edicts at Dhauli and Jaugada from the Major Rock Edicts found in other versions. Those local sets substitute the Separate Edicts for XI–XIII. The map therefore does not put the well-known remorse passage from XIII onto the Dhauli rock. A place, a version and an individual passage must stay connected. Hultzsch’s editorial English also belongs to 1925; it is not the language that an ancient audience saw on the stone. Later discoveries at Kandahar need the separate modern source used here.',
      cite(
        'ashoka-edicts-1925',
        'Introduction on XIV and regional sets; Dhauli Separate I',
      ),
      cite('ashoka', 'Kandahar languages'),
    ),
    sec(
      'Instructions let us ask about reception',
      'An order directed at officials can be unusually revealing about the difficulties a ruler wanted to address. A warning against hurry suggests an administrative concern, but it does not tell us how often decisions were rushed. The king’s claim to care for subjects is similarly different from a subject’s own account of treatment. To deepen this inquiry, seek regional archaeological evidence, inscriptions in their linguistic settings and accounts that can test access and enforcement. Later religious narratives should retain their own dates and purposes, rather than be inserted as eyewitness reports of the reign.',
      cite('ashoka-edicts-1925', 'Printed pp. 95–96, instructions and obstacles'),
      cite('ashoka', 'Literary traditions and uncertain succession'),
    ),
  ];
  s.familyActivity = {
    title: 'Match a message to its work',
    duration: 'About 5 minutes',
    steps: [
      'Find Girnar, Dhauli and Kandahar on the map. Match them with practical provision, instructions to officials or regional language.',
      'Choose one announced task. Name a person who would have to do something for it to happen.',
      'Finish: “The inscription announces ___; to find out what happened, I would look for ___.”',
    ],
    explanation:
      'A named place and a royal instruction are starting evidence. They do not show that every subject heard the same words or experienced the promised result.',
  };
  s.evidenceReading = {
    title: 'Read a royal instruction in its own setting',
    introduction:
      'These are paraphrases from a published English edition and a modern institutional synthesis; no ancient passage is silently assigned to a different rock.',
    items: [
      {
        label: 'Girnar II announces material provision',
        text: 'The translated edict describes useful planting, wells and trees along roads, as well as provision for people and cattle.',
        interpretation:
          'Its verbs express the ruler’s account of action. They do not count functioning facilities or independently establish their reach.',
        citations: [cite('ashoka-edicts-1925', 'Printed pp. 3–4, Girnar II')],
      },
      {
        label: 'Dhauli Separate I addresses officials',
        text: 'The translated instruction addresses judicial officials at Tosali and warns against anger, hurry and fatigue in their work.',
        interpretation:
          'This is a particular message to an administrative audience. It does not supply every subject’s view of justice or a measured change in outcomes.',
        citations: [cite('ashoka-edicts-1925', 'Printed pp. 95–96')],
      },
      {
        label: 'A regional set differs from another set',
        text: 'Dhauli and Jaugada carry two Separate Edicts in place of Major Rock Edicts XI–XIII.',
        interpretation:
          'The Kalinga remorse passage of XIII should not be labelled as the text on the selected Dhauli rock. Language, version and location need separate checks.',
        citations: [
          cite('ashoka-edicts-1925', 'Introduction: XIV and the regional sets'),
        ],
      },
    ],
  };
  s.dimensions['Work and coordination'] = dim(
    'Royal messages assigned practical and moral tasks to officials and subjects. Provision, communication and enforcement each required people; their outcomes need local evidence.',
    'ashoka-edicts-1925',
    'Girnar II; Dhauli Separate I',
  );
  s.terms.push('dhamma');
  s.returnPrompt =
    'What evidence from one named locality could test a royal announcement about provision or fair treatment?';
  s.review = review([
    'The selected Hultzsch passages were read in OCR and specified original scans; no full edition, original-language or complete inscription-site audit claimed.',
    'The 1925 edition predates the Kandahar material. Neelis supplies the separate language context. Translation choices and newer scholarship need further review.',
    'Implementation, local reception, workers’ voices and coercion require more regional evidence.',
  ]);
}
function athens(s: Subject) {
  s.contextIds = ['athens-civic-work-context'];
  s.summary =
    'Athenian public life combined decision-making, religious activity, markets and the work of supplying households. Those activities did not give everyone the same political powers. A water jar, excavated places, a constitutional account and later legal research illuminate different parts of that history. Together they make it possible to study participation and exclusion without erasing the people whose work kept the city functioning.';
  s.sections = [
    sec(
      'Start with the jar and its own date',
      'The Met hydria dates to about 510–500 BCE. Its front shows women with vessels at a fountain; combat appears on the shoulder. Two horizontal side handles helped lift a hydria, and a vertical back handle served dipping and pouring. The shape and painted work give concrete things to inspect. The scene is an artistic representation near the conventional transition to democracy, not a photograph of a fourth-century household or a label identifying each depicted person’s legal status.',
      cite('met-247244', 'Date, description and visible front image'),
      cite('hydria', 'Opening paragraph: handles and use'),
    ),
    sec(
      'Water connected households with public space',
      'Fetching water meant obtaining a necessary household resource outside the house. Rotroff and Lamberton compare images with literary accounts and discuss free and enslaved women carrying water, shopping and selling goods. Wealth and status affected who performed burdensome tasks and whose household could assign them to someone else. This evidence complicates elite male prescriptions about keeping respectable women at home. A fountain or market could be publicly used while access, work and power remained unequal.',
      cite('agora-women', 'Printed pp. 7–11, fountain house and public space'),
    ),
    sec(
      'Formal participation required eligibility',
      'The late-fourth-century Constitution of the Athenians describes male enrollment in local civic communities, or demes, at eighteen, with scrutiny of age, free status and parentage. Its account of the Council and Assembly explains procedures by which eligible citizens governed. Women, resident foreigners and enslaved people did not acquire those political powers simply by living or working in the city. Civic descent, religious roles, property and the franchise are distinct questions; exclusion from the Assembly is not evidence that a person had no public presence.',
      cite('athens-constitution', 'Parts 42–43'),
      cite('agora-women', 'Printed pp. 7–11'),
    ),
    sec(
      'Institutions occupied a changing city',
      'The Agora held commercial, religious and administrative activities; the Pnyx was a meeting place for the Assembly. Their different functions help distinguish being in public space from holding formal decision-making power. Neither the jar nor one constitutional description covers the whole sixth-to-fourth-century window. The parentage law and its later reestablishment belong to particular phases. A useful comparison follows how rules, institutions and everyday tasks intersected over time, rather than treating Athens as an unchanging community of equal participants.',
      cite('athens-sites', 'Historical description: Agora and Pnyx'),
      cite(
        'athens-status-research',
        'Printed pp. 348–349, 451/0 and 403 BCE; c330 account',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'Do not transfer another vessel’s inscriptions',
      'The Agora book illustrates a hydria of about 530 BCE in Würzburg, while the selected Met object is dated about 510–500. The authors discuss painted names, clothing and possible identification of the earlier scene with the Southeast Fountain House. Those details belong to their illustrated vessel and argument. They are not translations or a secure building identification for the Met jar. The map locates the excavated fountain building as a place to investigate water provision, not as proof of where this painted scene took place. Even apparently similar images require object-specific reading.',
      cite(
        'agora-women',
        'Printed pp. 6–8, Würzburg 304 and qualified fountain identification',
      ),
      cite('met-247244', 'Accession 06.1021.77'),
    ),
    sec(
      'Rules did not make every status claim simple',
      'Forsdyke uses legal procedures and disputes to examine how enslaved people could seek freedom or claim civic status, often through networks involving citizens. This brings agency and contested boundaries into an account that might otherwise stop at a list of exclusions. Her argument is an interpretation of selective legal evidence, not a count of successful claims or a complete social survey. Court speeches also have interested speakers and audiences. Set their purposes beside the constitutional account’s procedural description and the archaeological evidence of ordinary work; no single source preserves everyone’s experience.',
      cite('athens-status-research', 'Printed pp. 345–349'),
      cite('athens-constitution', 'Part 42'),
    ),
  ];
  s.familyActivity = {
    title: 'Separate work, place and political power',
    duration: 'About 5 minutes',
    steps: [
      'Find the jar’s side handles and the vessels in its painted scene. Describe the task without guessing anyone’s legal status.',
      'On the map, distinguish the Agora, the fountain building and the Pnyx. Which questions concern water, trade or Assembly meetings?',
      'Name one way a person could help a city function without being allowed to vote in its Assembly.',
    ],
    explanation:
      'The jar, constitution and excavated places belong to different dates and types of evidence. Work in public and formal political participation should be investigated together without making them identical.',
  };
  s.evidenceReading = {
    title: 'Whose activity does each record preserve?',
    introduction:
      'The passages are source paraphrases. The book’s Würzburg vase and the selected Met vase remain separate objects.',
    items: [
      {
        label: 'The selected jar has its own attribution',
        text: 'The Met dates 06.1021.77 to about 510–500 BCE and identifies women at a fountain house, with combat on the shoulder.',
        interpretation:
          'Describe visible containers and handles. Clothing and a represented task do not by themselves identify the figures as free, enslaved or enfranchised.',
        citations: [cite('met-247244', 'Date and Description')],
      },
      {
        label: 'The constitutional account is later',
        text: 'Part 42 describes male enrollment scrutiny at eighteen; part 43 describes the Council and Assembly.',
        interpretation:
          'Read it in its late-fourth-century context. Do not apply every procedure unchanged to the date of the Archaic vase.',
        citations: [
          cite('athens-constitution', 'Parts 42–43'),
          cite('athens-status-research', 'Printed p. 348, c330 context'),
        ],
      },
      {
        label: 'A social history tests an elite ideal',
        text: 'The Agora study sets male-authored prescriptions beside evidence of women’s water carrying, commerce and other activity.',
        interpretation:
          'Public work challenges claims of complete seclusion. It does not show that women shared the Assembly’s franchise or that free and enslaved experience was interchangeable.',
        citations: [cite('agora-women', 'Introduction; printed pp. 7–11')],
      },
    ],
  };
  s.dimensions['Work and coordination'] = dim(
    'Water provision and commercial work connected households with shared places, while civic procedures assigned political powers to a narrower group.',
    'agora-women',
    'Printed pp. 7–11',
  );
  s.terms.push('deme');
  s.returnPrompt =
    'Choose a place or object: what does it show about work, and what separate evidence would establish a person’s political eligibility?';
  s.review = review([
    'The Agora book’s introduction, printed map p. 2 and selected pp. 6–11 were consulted, not every chapter. Its illustrated hydria is not the Met vessel.',
    'The Kenyon translation and selected Forsdyke pages were read; no original papyrus audit, complete legal synthesis or population estimate.',
    'More household, gender, resident-foreigner and enslaved-person evidence and independent/human review remain.',
  ]);
}
const contexts: HistoricalContext[] = [
  {
    id: 'qin-state-context',
    title: 'Qin projects, imperial rule and local records',
    region: 'East Asia',
    interval: interval(
      -246,
      -206,
      'c. 246–206 BCE: selected Qin project and imperial orientation',
      'Opens with the mausoleum project’s reported start, not the founding of Qin. Case and alternate dynasty conventions remain separate.',
    ),
    summary:
      'A royal project began before imperial unification; the Liye archive has its own narrower dates. Do not turn one period label into the date of every object or document.',
    subjectIds: ['qin-administration'],
    citations: [
      cite('qin-mausoleum', 'Brief synthesis'),
      cite('qin-practice', 'Printed pp. 147–150'),
      cite('qin', 'Title'),
    ],
    phases: [
      {
        year: -246,
        label: 'From around 246 BCE',
        title: 'A royal project before the imperial frame',
        text: 'UNESCO dates the beginning of the mausoleum project here. The tomb and capital are different places.',
        citations: [cite('qin-mausoleum', 'Brief synthesis')],
      },
      {
        year: -222,
        label: '222–208 BCE: document range',
        title: 'The local records have their own clock',
        text: 'Staack dates most of the Liye documents to this range, beginning before the dossier’s imperial frame.',
        citations: [cite('qin-practice', 'Printed p. 148')],
      },
      {
        year: -221,
        label: '221 BCE: imperial unification convention',
        title: 'A common standard is announced',
        text: 'The capacity measure’s decree is attributed to the First Emperor’s 26th year. It is not the production date of all measuring devices.',
        citations: [cite('qin-measure', 'Decree date')],
      },
      {
        year: -210,
        label: '210 BCE',
        title: 'The First Emperor’s death',
        text: 'The death of a ruler, the end of his dynasty and the end of local administrative work are different boundaries.',
        citations: [cite('qin-mausoleum', 'Description')],
      },
      {
        year: -206,
        label: '207/206 BCE: different dynasty conventions',
        title: 'Preserve the difference',
        text: 'The Met’s 206 endpoint remains in the case; the National Palace Museum and Staack use 207. The atlas does not silently resolve that convention.',
        citations: [
          cite('qin', 'Title'),
          cite('qin-measure', 'Dynasty label'),
          cite('qin-practice', 'Abstract'),
        ],
      },
    ],
  },
  {
    id: 'mauryan-messages-context',
    title: 'Mauryan rule and Ashoka’s regional messages',
    region: 'South Asia',
    interval: interval(
      -320,
      -185,
      'c. 320–185 BCE: selected Mauryan orientation',
      'Rounded opening within the late-fourth-century setting described by Neelis; not a new exact accession date. Later succession traditions differ.',
    ),
    summary:
      'Place Ashoka’s reign within a longer dynasty and distinguish a regnal reference, a particular inscription and later traditions.',
    subjectIds: ['ashoka-messages'],
    citations: [cite('ashoka', 'Dynasty overview and succession')],
    phases: [
      {
        year: -320,
        label: 'Late fourth century BCE (orientation)',
        title: 'A dynasty before Ashoka',
        text: 'Neelis describes Chandragupta taking power from the Nandas at Pataliputra. The viewing year is a rounded orientation, not an exact date supplied by that account.',
        citations: [cite('ashoka', 'Opening paragraph')],
      },
      {
        year: -268,
        label: 'c. 268–232 BCE',
        title: 'The preserved reign convention',
        text: 'The original dossier keeps Neelis’s dates. Inscriptions use relative regnal dates and do not all belong to one calendar year.',
        citations: [cite('ashoka', 'Reign and inscriptions')],
      },
      {
        year: -260,
        label: 'Eighth regnal year; approximately 260 BCE',
        title: 'Kalinga in a royal account',
        text: 'This approximate viewing year derives from the retained reign convention. Edict XIII expresses remorse; Dhauli’s local set has different passages.',
        citations: [
          cite('ashoka', 'Eighth year and XIII'),
          cite('ashoka-edicts-1925', 'Introduction: regional sets'),
        ],
      },
      {
        year: -250,
        label: 'Mid-third century BCE (viewing anchor)',
        title: 'Read particular messages',
        text: 'Girnar II, Dhauli Separate I and Kandahar language evidence have separate settings. This anchor does not assign them all an exact issue date of 250 BCE.',
        citations: [
          cite('ashoka-edicts-1925', 'Girnar II; Dhauli Separate I'),
          cite('ashoka', 'Kandahar'),
        ],
      },
      {
        year: -185,
        label: 'Around 185 BCE',
        title: 'A later political transition',
        text: 'Neelis describes the overthrow of the last Mauryan ruler while noting differing succession traditions. It is not the endpoint of the life of Ashoka’s inscriptions.',
        citations: [cite('ashoka', 'Final paragraph')],
      },
    ],
  },
  {
    id: 'athens-civic-work-context',
    title: 'Athens: changing civic rules and public work',
    region: 'Europe',
    interval: interval(
      -600,
      -300,
      'Sixth–fourth centuries BCE: selected civic/work orientation',
      'Matches the analytical case window while separating the vase, changing eligibility rules and later procedural account. Neither boundary is the lifespan of Athens or democracy.',
    ),
    summary:
      'The Archaic vase, fifth-century rules and fourth-century institutional description are different evidence within a broad teaching window.',
    subjectIds: ['athens-water'],
    citations: [
      cite('met-247244', 'Date'),
      cite('agora-women', 'Printed pp. 7–11'),
      cite('athens-status-research', 'Printed pp. 348–349'),
    ],
    phases: [
      {
        year: -510,
        label: 'c. 510–500 BCE',
        title: 'The selected water jar',
        text: 'The Met vessel’s approximate date straddles a political transition; its scene is not an image of the later constitution.',
        citations: [cite('met-247244', 'Date')],
      },
      {
        year: -508,
        label: 'Around 508 BCE: conventional marker',
        title: 'An institutional transition',
        text: 'The Agora authors use this conventional democracy marker to distinguish their earlier vase from later texts. Institutions continued to change.',
        citations: [cite('agora-women', 'Printed p. 7')],
      },
      {
        year: -451,
        label: '451/0 BCE',
        title: 'A rule about civic descent',
        text: 'Forsdyke dates the two-parent citizenship rule here. Female civic descent and male formal participation must not be collapsed into one role.',
        citations: [cite('athens-status-research', 'Printed p. 348')],
      },
      {
        year: -403,
        label: '403 BCE',
        title: 'A rule reestablished',
        text: 'Forsdyke describes the parentage law’s reestablishment after interruption. The same eligibility rule was not simply unchanged across the whole case.',
        citations: [cite('athens-status-research', 'Printed p. 348')],
      },
      {
        year: -330,
        label: 'Around 330 BCE',
        title: 'The later procedural account',
        text: 'The Constitution of the Athenians describes institutions of its own period while also narrating earlier changes. This is not the date of the selected jar.',
        citations: [
          cite('athens-status-research', 'Printed p. 348'),
          cite('athens-constitution', 'Parts 42–43'),
        ],
      },
    ],
  },
];
const journey: Journey = {
  id: 'rules-messages-public-work',
  title: 'Rules, messages and public work',
  question: 'Who carried a rule into everyday life?',
  duration: 'About 20–30 minutes',
  printSourcesPerPage: 3,
  introduction:
    'Compare Qin administrative work, Ashoka’s regional messages and Athenian public life in thematic order. These different places and dates are not one political ladder, a travel itinerary or evidence of contact.',
  stops: [
    {
      subject: 'qin-administration',
      year: -216,
      title: 'Test a standard against local records',
      narrative:
        'Distinguish a measuring device, a prescribed document and an excavated record. Follow the people preparing and processing the materials.',
      compare: 'ashoka-messages',
    },
    {
      subject: 'ashoka-messages',
      year: -250,
      title: 'Connect a message with its audience',
      narrative:
        'Use the map to keep Girnar, Dhauli and Kandahar evidence separate. Name the work an instruction requires and the local evidence needed to test its results.',
      compare: 'qin-administration',
    },
    {
      subject: 'athens-water',
      year: -430,
      title: 'Separate public work from formal power',
      narrative:
        'Inspect the earlier jar, then read the later civic rules. Explain why supplying water or selling goods did not itself grant Assembly participation.',
      object: 'met-247244',
      compare: 'qin-administration',
    },
  ],
  conclusion:
    'Rules needed people and material work. A common standard, a royal instruction and a civic eligibility procedure are different institutions. Explain one mechanism, identify whose experience survives and ask what evidence could test the account.',
  evidence: {
    prompt: 'Which comparison respects both institutions and ordinary work?',
    options: [
      {
        text: 'Records and objects reveal different tasks and powers; announcements, local practice and political eligibility require separate evidence.',
        supported: true,
        feedback:
          'Yes. Identify the rule, the people doing the work and the evidence of implementation. A shared question does not erase differences in status or date.',
      },
      {
        text: 'Publishing a rule proves that every person experienced its promised result.',
        supported: false,
        feedback:
          'A decree or instruction preserves a claim. Local records, material use and people’s experience are needed to investigate its effects.',
      },
      {
        text: 'Anyone shown working in a public place must have held the same political rights.',
        supported: false,
        feedback:
          'Water provision, commerce and Assembly participation were different activities. The jar cannot identify each figure’s legal status or turn public work into universal franchise.',
      },
    ],
    citations: [
      cite('qin-practice', 'Printed pp. 169–170'),
      cite('ashoka-edicts-1925', 'Dhauli Separate I'),
      cite('athens-constitution', 'Parts 42–43'),
    ],
  },
  returnPrompt:
    'Choose two cases. Explain who had to do something for a rule to work, and name one source that could test what happened.',
};
export function applyGovernmentWork(corpus: Corpus) {
  corpus.sources.push(...sources);
  qin(corpus.subjects.find((s) => s.id === 'qin-administration')!);
  ashoka(corpus.subjects.find((s) => s.id === 'ashoka-messages')!);
  athens(corpus.subjects.find((s) => s.id === 'athens-water')!);
  corpus.contexts = [...(corpus.contexts ?? []), ...contexts];
  corpus.media.push(...governmentMedia);
  for (const m of governmentMedia)
    corpus.subjects.find((s) => s.id === m.subject)!.objectIds.push(m.id);
  corpus.journeys.push(journey);
  corpus.journeys.find((j) => j.id === 'voices-power')!.printSourcesPerPage = 3;
  corpus.glossary.push(
    {
      id: 'standardization',
      name: 'Standardization',
      definition:
        'An attempt to establish common units, forms or procedures. An announced standard and the way people use it are separate historical questions.',
    },
    {
      id: 'dhamma',
      name: 'Dhamma',
      definition:
        'In Ashoka’s messages, a moral and administrative program concerning conduct and government. Its uses need context and are not identical with a complete statement of Buddhist doctrine.',
    },
    {
      id: 'deme',
      name: 'Deme',
      definition:
        'A local civic community in ancient Attica. The late-fourth-century Athenian account describes scrutiny and enrollment of eligible young men among its members.',
    },
  );
  for (const id of [
    'qin',
    'qin-quan',
    'qin-measure',
    'qin-practice',
    'ashoka',
    'agora-women',
    'hydria',
    'met-247244',
  ])
    corpus.sources.find((s) => s.id === id)!.accessed = consulted;
  corpus.sources.find((s) => s.id === 'qin-practice')!.scope =
    '27-page original PDF downloaded. Introduction, §§2.1–2.2, selected material/wood discussion, §3 grain-tally discussion and Conclusions read; pp. 149, 153 and 169 visually inspected. Liye archive and unprovenanced Yuelu prescriptions remain distinct. No full Chinese-edition audit or empire-wide compliance estimate.';
  corpus.sources.find((s) => s.id === 'agora-women')!.scope =
    '60-page book downloaded; introduction, printed map p. 2 and selected pp. 6–11 read and inspected. The illustrated c530 BCE Würzburg hydria is not Met 06.1021.77. Qualified fountain attribution and differing free/enslaved experiences remain explicit. No full-volume audit or reproduced map/photo.';
  const jar = corpus.media.find((m) => m.id === 'met-247244')!;
  jar.licenseUrl = 'https://creativecommons.org/publicdomain/zero/1.0/';
  jar.notice = [
    'Locate the two side handles and the pictured containers.',
    'Compare the work shown with the function of the jar.',
    'The painted scene does not identify each figure’s legal status.',
  ];
  const pack = corpus.packs.find((p) => p.id === 'C3')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['qin-administration', 'ashoka-messages'],
      start: -600,
      end: -185,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Locate a capital and a county archive, separate regional inscriptions, and Athenian public places. The maps are approximate locators with no connecting transmission route or reconstructed borders.',
      limits:
        'Three expanded cases within a wider selective chapter. Qin legal provenance, regional reception and diverse Athenian work/status histories remain open; this does not complete global first-millennium BCE coverage.',
    },
  ];
  pack.coverage['East Asia'].reason =
    'Expanded Qin account separates measuring devices, prescriptions, excavated Liye practice and their distinct dates. Broader Chinese institutions, households and intellectual histories remain limited.';
  pack.coverage['South Asia'].reason =
    'Expanded Ashoka account distinguishes regional versions, audiences, practical instructions and unmeasured outcomes within a separate Mauryan frame. Wider South Asian coverage remains selective.';
  pack.coverage.Europe.reason =
    'Expanded Athenian account separates Archaic image, changing civic eligibility, public work and later constitutional description. Other Greek and European histories remain outside this bounded set.';
  applyGovernmentPlaces(corpus);
}
