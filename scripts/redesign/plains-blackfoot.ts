import type { Corpus, HistoricalContext, Journey, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const blackfootCommunitySources: Source[] = [
  {
    id: 'blackfoot-collaborative-hunt',
    title: 'Buffalo Hunters and the Pisskan',
    institution:
      'Niitsitapiisini: Our Way of Life; Blackfoot collaborators and Glenbow Museum',
    url: 'https://www.glenbow.org/blackfoot/EN/html/buffalo_hunters_and_the_pisskan.htm',
    type: 'primary',
    published: 'Modern collaborative exhibition; page creation date not supplied',
    accessed: consulted,
    scope:
      'Selected public English Gathering the Buffalo and Drive Lanes sections actually read: preparation, timing and coordination with knowledge of animal behavior. Opening ceremony paragraphs were encountered but no song, ritual directions, sacred story, costume, animation or reenactment is reproduced. The first-person exhibition voice is collaborative interpretation, not an identified verbatim eighteenth-century witness. Artwork captions, including Gerald Tailfeathers’s 1960 painting, do not turn the page into a contemporary photograph of a hunt. Copyright policy limits downloaded material and third-party works; no image, story or source geometry copied.',
  },
  {
    id: 'blackfoot-collaborative-camp',
    title: 'Our Campsite: Work at the Pisskan',
    institution:
      'Niitsitapiisini: Our Way of Life; Blackfoot collaborators and Glenbow Museum',
    url: 'https://www.glenbow.org/blackfoot/EN/html/our_campsite.htm',
    type: 'primary',
    published: 'Modern collaborative exhibition; page creation date not supplied',
    accessed: consulted,
    scope:
      'Selected introduction, Butchering and Drying Meat, Cutting Hides and Boiling Bones text actually read, together with How We Lived with the Buffalo campsite paragraph (https://www.glenbow.org/blackfoot/EN/html/how_we_lived_with_the_buffalo.htm). Practical relations among quick processing, later hide preparation, water/fuel and food storage are paraphrased. This public teaching account is not a transcript of one dated hunt, a complete labor census or a food-preparation recipe. Captions range from 1960 artwork to later nineteenth/twentieth-century photographs; those source pixels were not inspected or adopted. No hot-stone/food-processing reenactment, source illustration or third-party photograph is reproduced.',
  },
  {
    id: 'blackfoot-collaborative-season',
    title: 'Gathering Berries: Hunting Buffalo and Drying Meat',
    institution:
      'Niitsitapiisini: Our Way of Life; Blackfoot collaborators and Glenbow Museum',
    url: 'https://www.glenbow.org/blackfoot/EN/html/gathering_berries.htm',
    type: 'primary',
    published: 'Modern collaborative exhibition; page creation date not supplied',
    accessed: consulted,
    scope:
      'Selected Camp Site During Summer, Hunting Buffalo and Drying Meat passages actually read. These place gathering and preparing winter food within movement among camps; they do not date every hunt or prescribe a universal seasonal calendar. The narrative’s first person is an exhibition voice, not newly recovered individual speech. Botanical/health claims and ceremonial instructions are not adopted. No 1874 camp photograph, 1960 artwork, animation or image copied; their captions are distinct modern evidence clocks.',
  },
  {
    id: 'blackfoot-collaborative-authorship',
    title: 'Niitsitapiisini: Our Way of Life — credits, source voice and terms',
    institution:
      'Blackfoot collaborators and Glenbow Museum; Virtual Museum of Canada project',
    url: 'https://www.glenbow.org/blackfoot/EN/html/credits.htm',
    type: 'archive',
    published:
      'Modern exhibition/project documentation; page-specific creation dates unverified',
    accessed: consulted,
    scope:
      'Credits and About this Site (https://www.glenbow.org/blackfoot/EN/html/about_this_site.htm) actually read: Blackfoot/Glenbow collaboration, named knowledge contributors and distinct website/toolkit teams. Selected Our World Who We Are/Our Language text read (https://www.glenbow.org/blackfoot/EN/html/our_world.htm): different Blackfoot-speaking groups and a Kainai version used for many words/concepts. Copyright Policy read (https://www.glenbow.org/blackfoot/EN/html/copyright_policy.htm): non-commercial private/educational availability, restrictions on modifications/downloaded third-party works and permission for other uses. No individual contributor is falsely assigned authorship of a specific unsigned sentence; public availability is not community assent to an atlas, a universal voice or an open media licence. No audiovisual performance, sacred story, image or map copied.',
  },
];

export const blackfootCommunityContext: HistoricalContext = {
  id: 'blackfoot-work-interpretation-context',
  title: 'Communal work and the later interpretation of a Blackfoot hunting landscape',
  region: 'Americas',
  interval: {
    start: 1700,
    end: 2008,
    label: 'Selected later-hunting frame and later source/heritage dates, 1700–2008',
    precision: 'approximate',
    note: 'The opening retains the atlas’s selected c.1700–1850 inquiry; it does not establish the first hunt. Later phases date heritage recognition, a photograph’s publication and an archaeological book, not continued hunting through 2008. The much longer site chronology and its interruption remain distinct; seasonal tasks are not assigned invented calendar years.',
  },
  summary:
    'Preparing and coordinating a hunt, processing materials and storing food connected a cliff with camps and household work. Community-authored teaching, a modern landscape view and archaeological interpretation supply different kinds of evidence across different dates.',
  subjectIds: ['blackfoot-bison'],
  citations: [
    cite('hsi-unesco', 'Brief synthesis:long site history and interruption'),
    cite('blackfoot-collaborative-season', 'Hunting Buffalo;Drying Meat'),
    cite('blackfoot-collaborative-authorship', 'Credits;About this Site'),
  ],
  phases: [
    {
      year: 1700,
      label: 'c.1700: opening of the selected atlas inquiry',
      title: 'A teaching boundary, not an origin',
      text: 'This opening inherits the dossier’s bounded later context. UNESCO describes a much older hunting landscape with an extended interruption; no particular eighteenth-century hunt or continuous identity of all earlier users is dated here.',
      citations: [
        cite('hsi-unesco', 'Brief synthesis:long chronology and interrupted hunting'),
      ],
    },
    {
      year: 1850,
      label: 'c.1850: UNESCO’s later use boundary for this site',
      title: 'A site endpoint does not end a people’s knowledge',
      text: 'UNESCO gives an approximate 1850 endpoint in its site-use description. The community teaching accounts explain continuing cultural knowledge; this site boundary is not the end of Blackfoot people, all bison hunting or every community’s history.',
      citations: [
        cite('hsi-unesco', 'Brief synthesis:approximately 5800 BP to AD 1850'),
        cite('hsi-blackfoot', 'IINI:continuing importance'),
      ],
    },
    {
      year: 1981,
      label: '1981: World Heritage inscription',
      title: 'Recognition is a later institutional event',
      text: 'The interpretive-site history and UNESCO identify 1981 inscription. This dates heritage recognition, not construction of drive lanes or the beginning of community care for the landscape.',
      citations: [
        cite('hsi-site-history', 'History of the Site'),
        cite('hsi-unesco', 'Date of inscription'),
      ],
    },
    {
      year: 2005,
      label: '2005: publication of the landscape photograph',
      title: 'A modern surface view has a particular source history',
      text: 'Commons records UM’s own photograph uploaded 17 July 2005 and a public-domain dedication. The picture is a later view, not a photograph of a hunt; camera metadata is not independent verification of an exact exposure date.',
      citations: [
        cite('hsi-image', 'File history;public-domain dedication;metadata caveat'),
      ],
    },
    {
      year: 2008,
      label: '2008: publication of Brink’s archaeological study',
      title: 'An experiment tests a question about processing',
      text: 'Brink’s chapter 7, printed pp. 195–198, distinguishes a modern grease-processing experiment from a recovered ancient meal. Its cattle bones and modern tools remain part of its method, rather than disappearing from the explanation.',
      citations: [cite('hsi-brink', 'Chapter 7, printed pp. 195–198')],
    },
  ],
};

export const blackfootCommunityWorkDimension = {
  text: 'A communal hunt connected preparation and coordinated movement with immediate processing, drying, storage and later hide work. Public Blackfoot collaborative accounts make this labor visible without turning one setting into every community’s fixed division of tasks.',
  citations: [
    cite('blackfoot-collaborative-hunt', 'Gathering the Buffalo;Drive Lanes'),
    cite('blackfoot-collaborative-camp', 'Work;Drying Meat;Cutting Hides'),
  ],
};

export const blackfootCommunityFamilyEvidence: NonNullable<Journey['familyEvidence']> =
  {
    title: 'The cliff and the work outside the picture',
    object: 'hsi-cliff-2005',
    text: 'This is a modern landscape photograph published in 2005, not a hunt in progress. The Blackfoot/Glenbow collaborative account describes quick processing at a camp, drying meat on frames and time-consuming preparation of hides. Water and fuel were also needed. These public teaching passages help explain work outside the photograph; they do not identify every historical worker or show buried archaeological layers.',
    citations: [
      cite('hsi-image', 'File history;modern landscape'),
      cite(
        'blackfoot-collaborative-camp',
        'Work;Butchering and Drying Meat;Cutting Hides;campsite needs',
      ),
    ],
    notice: [
      'Name two visible features of the landscape.',
      'Find one task in the capsule that the photograph cannot directly show.',
    ],
    claimPrompt:
      'Explain why the cliff alone cannot tell the whole story of a communal hunt. Use one visible feature and one supplied account of work, identifying which kind of evidence supports each.',
    returnPrompt:
      'When an image makes one moment dramatic, ask which preparation or maintenance lies outside its frame.',
    feedback:
      'Open grassland and rock/cliff forms are visible. Processing, ownership, timing and the identity of particular workers require other evidence. A modern footpath must not be labelled an ancient drive lane from this photograph alone.',
  };

export function applyPlainsBlackfoot(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'blackfoot-bison');
  if (!s) throw new Error('Blackfoot continuation requires the existing dossier');
  for (const row of blackfootCommunitySources) {
    const i = c.sources.findIndex((v) => v.id === row.id);
    if (i < 0) c.sources.push(row);
    else c.sources[i] = row;
  }
  const renewals: Record<string, string> = {
    'hsi-blackfoot':
      'Selected AWOH’TSOWOKOOTTSIYA/IINI/PIISTAAN passages reread: trade protocols, materials, hunting and processing. Page exposes a 2025-06-04 update string; that is a modern webpage clock, not a historical event. Broad/conflicting jump-use dates, quantities and a first-century-to 500–600 CE generalization are not adopted as the site chronology. Public introductory ceremonial text is not reproduced as directions or reenactment; no image downloaded.',
    'hsi-unesco':
      'Description, Brief synthesis and date-of-inscription fields reread: landscape components, long chronology with one lengthy interruption, approximate 5800 BP–1850 endpoint and 1981 inscription. No nomination dossier, boundary map, surveyed coordinates or chronology of every earlier user was newly verified. Copyright/licence applies to specified description text, not an inferred blanket image licence.',
    'hsi-site-history':
      'History of the Site, selected Social Structure and Seasonal Travel passages reread. Bands/organizations and seasonal food work supply a bounded interpretive account, not a universal/unchanging political constitution. Present-day demographic/legal, exact historic population and coercion-free-consensus generalizations are not adopted. Ceremonial instructions, modern building plan and trail map not copied.',
    'hsi-image':
      'File description/history, public-domain dedication/fallback grant and metadata caveat reread. UM upload 17 July 2005, 2016×1512 original catalogue dimensions; current 1600×1200 atlas derivative actually viewed and retained byte-identically. EXIF lists 25 April 2005 but the page cautions camera-clock reliability; the existing publication/exposure distinction and all media fields remain exact. No remote-byte equivalence or new asset claimed.',
  };
  for (const [id, text] of Object.entries(renewals)) {
    const r = c.sources.find((v) => v.id === id);
    if (!r) throw new Error(`Missing retained source ${id}`);
    const marker = `Blackfoot selected consultation, ${consulted}: `;
    if (!r.scope.includes(marker)) {
      r.scope = `Prior consultation, ${r.accessed} (retained): ${r.scope} ${marker}${text}`;
      r.accessed = consulted;
    }
  }
  c.contexts ??= [];
  const i = c.contexts.findIndex((r) => r.id === blackfootCommunityContext.id);
  if (i < 0) c.contexts.push(blackfootCommunityContext);
  else c.contexts[i] = blackfootCommunityContext;
  s.contextIds = [...new Set([...(s.contextIds ?? []), blackfootCommunityContext.id])];
  s.summary =
    'A communal bison hunt joined preparation, coordinated movement and the work of making food and materials usable. Blackfoot collaborative accounts connect the cliff with camp, fuel, water, drying and later hide work. This selected landscape and later historical window do not represent every Plains society or the beginning of bison knowledge.';
  s.sections = [
    sec(
      'Preparation connected people, animals and a place',
      'The cliff was one part of a working landscape. UNESCO identifies drive lanes, bone deposits and processing camps as well as the escarpment. The Blackfoot/Glenbow collaborative exhibition explains why knowledge of bison behavior, wind and terrain mattered to preparation. A successful communal hunt depended on people acting together at the right moment. The material traces and public teaching account thus answer different parts of the same question: how a gathering of people could organize work across a much larger area than a photograph shows.',
      cite('hsi-unesco', 'Brief synthesis:landscape components'),
      cite('blackfoot-collaborative-hunt', 'Gathering the Buffalo;Drive Lanes'),
      cite(
        'blackfoot-collaborative-camp',
        'How We Lived with the Buffalo:campsite needs',
      ),
    ),
    sec(
      'Coordination mattered before the animals reached the edge',
      'The collaborative account describes runners and others placed along drive lanes. Timing mattered: revealing people too early could turn a herd away. The interpretive-site history also describes organizations that regulated camp movement and communal hunting. These sources make planning and coordination visible without assuming a permanent farming settlement was required for social institutions. Their descriptions are situated interpretations, not a roster of one hunt or a fixed constitution shared by every Blackfoot group in every year.',
      cite('blackfoot-collaborative-hunt', 'Gathering the Buffalo;Drive Lanes'),
      cite('hsi-site-history', 'Social Structure:Societies'),
    ),
    sec(
      'Processing changed the pace and kinds of work',
      'After the hunt, work continued quickly at the camp. The exhibition explains cutting meat for drying, removing hides carefully and obtaining fat from bones. These activities needed water, fuel and equipment, linking the choice of campsite to practical demands. Hide preparation required more time than removing a hide and was not always completed during the communal hunt. Drying and storage extended the use of food beyond the immediate event. This sequence makes processing a central achievement rather than an invisible task after the dramatic moment.',
      cite(
        'blackfoot-collaborative-camp',
        'Work;Butchering and Drying Meat;Cutting Hides;Boiling Bones',
      ),
    ),
    sec(
      'Seasonal work and respectful relations connected households',
      'The collaborative seasonal account places berry gathering, camp movement and preparing winter food within a wider round of activities. Blackfoot Crossing describes bison providing clothing, shelter and tools as well as food, and trade conducted through protocols of respect. The sources also place these practical relations within spiritual responsibilities. Public descriptions help a reader understand that connection; they do not transfer authority to reproduce ceremonies. The c.1700–1850 case is a selected later inquiry. Much earlier archaeological use, later photographs and continuing community knowledge keep their own dates.',
      cite(
        'blackfoot-collaborative-season',
        'Camp Site During Summer;Hunting Buffalo;Drying Meat',
      ),
      cite('hsi-blackfoot', 'Trade;IINI'),
      cite('blackfoot-collaborative-authorship', 'About this Site;Credits'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Ask who made the teaching voice',
      'The Glenbow project credits Blackfoot collaborators and distinguishes the website, teacher-toolkit and gallery teams. Its public English first person presents a collaborative teaching account; an unsigned sentence should not be assigned to one named contributor or made into an eighteenth-century quotation. The language page also notes the use of a Kainai version for many terms. Blackfoot Crossing provides a separately situated Siksika account. Read these voices with their attribution rather than blending them into a generic Plains speaker. Acknowledging public knowledge does not authorize copying every image, story or performance.',
      cite(
        'blackfoot-collaborative-authorship',
        'Credits;About this Site;Our World:Our Language;Copyright Policy',
      ),
      cite('hsi-blackfoot', 'Page introduction;IINI'),
    ),
    sec(
      'Let different evidence change the question',
      'A modern surface photograph shows a cliff and grassland. It cannot expose buried processing deposits or tell us which individual carried out a task. Brink’s chapter 7 adds another method: a grease-processing experiment involving Piikani crew member Hazel Big Smoke, cattle bones and modern tools. Those conditions matter when judging what the experiment tests. It is neither an ancient meal nor an exact reenactment. Likewise, a modern painting or a later photograph captioned on the teaching website cannot silently become an image of the selected 1700–1850 case. What can the cliff, the experiment and the public Blackfoot teaching account each tell us about processing a hunt?',
      cite('hsi-image', 'Modern photograph and source history'),
      cite('hsi-brink', 'Chapter 7, printed pp. 195–198'),
      cite('blackfoot-collaborative-camp', 'Later artwork/photograph captions'),
    ),
  ];
  s.evidenceReading = {
    title: 'Landscape, public teaching and a limited experiment',
    introduction:
      'Read the photograph, attributed public community teaching and the previously consulted experiment as different evidence. Their dates and methods cannot be collapsed into a photograph of one historical hunt.',
    items: [
      {
        label: 'A visible cliff is not the entire archaeological landscape',
        text: 'The modern photograph shows rock, grassland and a path. UNESCO separately identifies drive lanes, layered deposits and processing camps.',
        interpretation:
          'The photograph can orient a viewer. It cannot by itself identify an ancient drive lane, expose buried layers or establish who used the site at every date.',
        citations: [
          cite('hsi-image', 'File and modern-view identity'),
          cite('hsi-unesco', 'Brief synthesis:components'),
        ],
      },
      {
        label: 'Processing has its own sequence and resources',
        text: 'The collaborative camp account distinguishes quick processing and drying from the time-consuming preparation of hides, and relates the camp to water and fuel.',
        interpretation:
          'This explains practical dependencies missing from a cliff-only story. It is a public teaching account rather than a labor census, exact recipe or individual witness to a dated event.',
        citations: [
          cite('blackfoot-collaborative-camp', 'Work;Cutting Hides;campsite needs'),
          cite('blackfoot-collaborative-authorship', 'About this Site;Credits'),
        ],
      },
      {
        label: 'An experiment keeps its modern conditions',
        text: 'Brink’s selected account concerns bone/grease experiments involving Hazel Big Smoke, cattle bones and modern tools.',
        interpretation:
          'The method can test practical interpretations. Replacing its materials or omitting the modern conditions would overstate what it establishes about every historical hunt.',
        citations: [cite('hsi-brink', 'Printed pp.195–198')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Put the work beyond the cliff into the explanation',
    duration: 'About 10 minutes',
    steps: [
      'Look at the photograph. Describe two visible features without assigning an ancient use to the modern path.',
      'Read the supplied source capsule. Write down processing, drying and hide preparation as tasks described by that account.',
      'Explain how one visible feature helps locate the setting and why one task needs a different source.',
      'Write a supported claim and a further question. Do not stage a hunt, copy a ceremony or pretend to speak for a historical worker.',
    ],
    explanation: `Source capsule — editorial paraphrase: ${blackfootCommunityFamilyEvidence.text} The activity asks for observation and source distinction; the supplied account provides its off-screen work evidence.`,
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected public-source consultation and internal author QA; not independent Blackfoot/community or historian acceptance',
    scope:
      'Preparation, coordination, processing and seasonal work through public Blackfoot collaborative teaching and separately attributed Siksika interpretation. Four new selected source records; four precisely renewed inherited sources. Brink’s dated 27 October selected-page scope remains unaltered, without claiming a fresh full-book read. Whole original identity, 1700–1850 interval/note/claims/dimensions/terms and every media field/pixel remain exact. No map, annotation, asset or relationship added.',
    limitations: [
      'Public introductory cultural material is not permission to reproduce a ceremony, restricted story, song, design, performance or hunting reenactment. No such reproduction is supplied. The Glenbow copyright conditions and third-party rights remain explicit; no new image is licensed or copied here.',
      'The collaborative exhibition does not assign every unsigned sentence to a named knowledge contributor. Its first-person narrative is not a recovered quotation from a dated 1700–1850 hunt, and the Kainai-oriented language choices are not made universal.',
      'Brink chapter 7, printed pp. 195–198 is reused at its retained 27 October consultation scope. No new full-book/linked source/experimental replication or source-figure inspection is claimed.',
      'Conflicting broad time/quantity generalizations on Blackfoot Crossing are not substituted for the qualified UNESCO site chronology or the original case dates. The approximate 1850 site boundary does not end community knowledge.',
      'The existing photograph was actually viewed and its two files hashed. Source/publication/exposure distinctions and all rights/metadata remain untouched. No photo recovers every marker, buried layer, historical participant or entire hunt.',
      'No precise new location, drive-lane survey, border or route is supplied. Independent historical/Blackfoot community review, family usability, accessibility/physical-device behavior and physical printing remain open; leaf checks cannot establish those acceptance tasks.',
    ],
  };
}
