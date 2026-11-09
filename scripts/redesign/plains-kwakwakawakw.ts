import type { Corpus, HistoricalContext, Journey, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const kwakwakawakwCommunitySources: Source[] = [
  {
    id: 'umista-return-voices',
    title: 'Our Masks Come Home',
    institution: 'U’mista Cultural Society, Living Tradition virtual exhibition',
    author: 'U’mista Cultural Society; film credited to Barbara Cranmer',
    url: 'https://umistapotlatch.ca/nos_masques_come_home-our_masks_come_home-eng.php',
    type: 'primary',
    accessed: consulted,
    scope:
      'Selected public English transcript on return, museum conditions and community display; captions for Agnes Alfred, Florence and Sean Matilpi, Sam Scow and the 23 September 2003 headdress return; English Meaning of U’mista and Return of the Collection text. Exact creation/interview date of the modern film is not supplied; 1980 and 2003 captions date particular represented events, not the webpage or every photograph. No film/audio downloaded or played, original negotiation files read, ceremonial image copied or exact relationship resolved beyond the caption. The page leaves Agnes Alfred’s grandfather/uncle identification uncertain; this is not silently resolved. Inconsistent arrest totals and current complete-return totals are not adopted. Selected webpage text/captions, not every gallery, photograph pixel or linked bibliography, consulted.',
  },
  {
    id: 'umista-public-exhibit-credits',
    title: 'Living Tradition: credits and copyright statement',
    institution: 'U’mista Cultural Society / Virtual Museum of Canada',
    url: 'https://umistapotlatch.ca/credits-eng.php',
    type: 'primary',
    accessed: consulted,
    scope:
      'Credits: project team, Barbara/Barb Cranmer film-making, educational/language consultants and credited Smithsonian excerpts; copyright statement at https://umistapotlatch.ca/droit_dauteur-copyright-eng.php actually read. Non-commercial study/research with acknowledgment is permitted in that statement; commercial reuse requires written consent. No blanket image/film, cultural-rights or unrestricted reproduction permission inferred. Dynamic 2026 copyright footer is not an original creation date. Linked lessons, restricted meanings, songs, templates and virtual galleries are not adopted or copied. This record documents attribution and limits, not independent community endorsement of this atlas.',
  },
];

export const kwakwakawakwCommunityContext: HistoricalContext = {
  id: 'kwakwakawakw-witnesses-return-context',
  title: 'Kwakwaka’wakw witnesses, prohibition and particular returns',
  region: 'Americas',
  interval: {
    start: 1884,
    end: 2003,
    label: 'Selected law, community institution and return records, 1884–2003',
    precision: 'approximate',
    note: 'The complete original 1884–1980 case remains unchanged. Later returns in this reference do not move its endpoint, establish that every belonging returned or date the origins of potlatch. The 1884 amendment and 1885 commencement are distinct; 1980 opening and a particular 2003 return are separate events.',
  },
  summary:
    'Witnesses, family work and care for belongings give potlatch its consequences in the public explanations selected here. Prohibition, confiscation and return changed circumstances without making government or museum custody the sole authority over community knowledge.',
  subjectIds: ['kwakwakawakw-potlatch'],
  citations: [
    cite('umista-history', 'Witnesses, 1884 law and return negotiations'),
    cite('umista-ban', 'Start and End of the Potlatch Ban'),
    cite('umista-return-voices', 'Return of the Collection; 2003 caption'),
  ],
  phases: [
    {
      year: 1884,
      label: '1884: amendment in U’mista’s history',
      title: 'A law targets an institution',
      text: 'U’mista dates the amendment to 1884. This is a government action against an existing practice, not the beginning of potlatch or evidence that people stopped participating.',
      citations: [cite('umista-history', '1884 legislation')],
    },
    {
      year: 1885,
      label: '1885: law takes effect in Living Tradition’s account',
      title: 'Commencement is a different date',
      text: 'Living Tradition gives 1 January 1885 for the prohibition taking effect. The two dates answer different questions about the legislation.',
      citations: [cite('umista-ban', 'The Start of the Potlatch Ban')],
    },
    {
      year: 1921,
      label: '1921: Dan Cranmer’s Village Island potlatch',
      title: 'A particular gathering and later prosecution',
      text: 'The community history places Dan Cranmer’s potlatch at Village Island and describes prosecutions and confiscation afterward. The title page published in the same year is a different document, not a record of that gathering.',
      citations: [
        cite('umista-history', 'Dan Cranmer and Village Island'),
        cite('hunt-boas-1921', 'Retained 1921 title-page consultation'),
      ],
    },
    {
      year: 1922,
      label: '1922: surrender and detention in the community accounts',
      title: 'Belongings were taken under pressure',
      text: 'The public accounts connect coerced surrender of belongings with sentences after the potlatch. Vera Newman and Chief Bill Cranmer describe particular family experiences and the pressure exerted. Their statements do not become an identical experience for every family.',
      citations: [cite('umista-ban', 'Impact transcript and named speaker captions')],
    },
    {
      year: 1951,
      label: '1951: prohibition removed',
      title: 'A legal change does not instantly repair harm',
      text: 'Living Tradition dates the removal to 1951; Barb Cranmer describes the continuing fear and the time needed to feel secure participating openly. The legal milestone and family confidence are different changes.',
      citations: [cite('umista-ban', 'The End of the Potlatch Ban')],
    },
    {
      year: 1974,
      label: '1974: U’mista Cultural Society formed',
      title: 'Return requires organized negotiation',
      text: 'The Society’s history dates its formation to 22 March 1974. The return account describes families and communities planning institutions to house belongings; this is not proof that all return negotiations were already completed.',
      citations: [
        cite('umista-about', 'The Society'),
        cite('umista-return-voices', 'Return of the Collection'),
      ],
    },
    {
      year: 1980,
      label: '1980: U’mista opens',
      title: 'A home for care, language and history',
      text: 'U’mista opened in November 1980. The public return page identifies family members with returned belongings at that opening, while the wider account describes decisions about where family treasures would be held.',
      citations: [
        cite('umista-about', 'Facility opening'),
        cite('umista-return-voices', '1980 captions; Return of the Collection'),
      ],
    },
    {
      year: 2003,
      label: '2003: a particular headdress return in the source caption',
      title: 'Return histories continue beyond the case',
      text: 'The public caption records Chief William T. Cranmer with Aube Elléouët on 23 September 2003 and says she returned a headdress surrendered by Chief Sam Scow in 1922. This is one documented return account, not a complete chain of custody or the end of repatriation.',
      citations: [
        cite(
          'umista-return-voices',
          'Chief William T. Cranmer and Aube Elléouët, 23 September 2003',
        ),
      ],
    },
  ],
};

export const kwakwakawakwCommunityWorkDimension = {
  text: 'Family preparation, food and gifts support invited witnesses; later return involved negotiation and decisions about care for particular belongings. Public explanations identify these responsibilities without licensing a reenactment or making all nations’ practices identical.',
  citations: [
    cite('kwak-amnh', 'P’a̱sa: witness role and extended-family preparation'),
    cite('umista-return-voices', 'Return of the Collection'),
  ],
};

export const kwakwakawakwCommunityFamilyEvidence: NonNullable<
  Journey['familyEvidence']
> = {
  title: 'Read the credit before making a claim',
  object: 'hunt-title-1921',
  text: 'The title page identifies George Hunt’s collected data and names Franz Boas as author. It was published in 1921; the annual-report period 1913–14 is a separate date. These credits show how the publication presents its sources. The page does not show Dan Cranmer’s potlatch, identify every contributor or supply permission to repeat a ceremony.',
  citations: [
    cite(
      'hunt-boas-1921',
      'Retained title pages: ethnographic credit and report/publication dates',
    ),
  ],
  notice: [
    'Find both personal names and the different words describing their roles.',
    'Name a question about the book that this page answers.',
  ],
  claimPrompt:
    'Explain what the page establishes about published credit, then name one question about community knowledge or a particular potlatch that requires another source.',
  returnPrompt:
    'When another record names an author, look for who supplied knowledge and who may remain uncredited.',
  feedback:
    'The page establishes a published attribution, not every act of collaboration or authority over the lives described. It is not a picture or transcript of the 1921 confiscations.',
};

export function applyPlainsKwakwakawakw(c: Corpus): void {
  const s = c.subjects.find((r) => r.id === 'kwakwakawakw-potlatch');
  if (!s) throw new Error('Kwakwaka’wakw continuation requires the existing dossier');
  for (const row of kwakwakawakwCommunitySources) {
    const i = c.sources.findIndex((r) => r.id === row.id);
    if (i < 0) c.sources.push(row);
    else c.sources[i] = row;
  }
  const scopes: Record<string, string> = {
    'umista-history':
      'Selected witnesses/life changes, Dan Cranmer’s attributed recollection of Village Island, 1921/1922 confiscation, 1951 removal and late-1950s/1960s–1980 return negotiation paragraphs reread. Chief Jimmy Sewid, councils, Elders and oldest living descendants are identified in this source; no blanket consensus, full original files, present legal status, arrest total or current outstanding total adopted. Later 1988/2002 returns encountered but not silently inserted at the original 1980 endpoint. No ceremonial images copied.',
    'umista-about':
      'Selected mandate, November 1980 facility opening and 22 March 1974 Society incorporation reread. Current staffing, prices, visitor information and legal governance details not adopted; no complete current restitution or cultural-permission claim.',
    'umista-ban':
      'Public English Impact transcript, named Vera Newman and Chief Bill Cranmer captions, Start and End sections reread. Particular family recollections and retrospective interpretation are attributed. Inconsistent prison totals elsewhere on the page are not resolved or repeated. 1884 amendment and 1885 commencement remain distinct. No audio/video played or downloaded; no song, ceremonial description, image, costume or reenactment reproduced.',
    'kwak-amnh':
      'Selected Trevor Isaac welcome/consulting attribution, P’a̱sa witness role and extended-family food/gift preparation, Barb Cranmer public transcript and Potlatch Ban sections reread. Shared regional tradition is not identical nations or universal practice; exact group counts and preparation duration are not adopted. Page’s unlabelled Woman/Man transcript roles are not independently renamed; named attribution for the selected Vera Newman/Bill Cranmer statements comes from U’mista’s own captions. No film, object photograph, origin story, residential-school narrative or territorial image copied.',
  };
  for (const [id, text] of Object.entries(scopes)) {
    const r = c.sources.find((v) => v.id === id);
    if (!r) throw new Error(`Missing retained source ${id}`);
    const marker = `Kwakwaka’wakw selected consultation, ${consulted}: `;
    if (!r.scope.includes(marker)) {
      r.scope = `Prior consultation, ${r.accessed} (retained): ${r.scope} ${marker}${text}`;
      r.accessed = consulted;
    }
  }
  c.contexts ??= [];
  const i = c.contexts.findIndex((r) => r.id === kwakwakawakwCommunityContext.id);
  if (i < 0) c.contexts.push(kwakwakawakwCommunityContext);
  else c.contexts[i] = kwakwakawakwCommunityContext;
  s.contextIds = [
    ...new Set([...(s.contextIds ?? []), kwakwakawakwCommunityContext.id]),
  ];
  s.summary =
    'In the public Kwakwaka’wakw accounts selected here, guests witness consequential family events, while preparation, food and gifts make responsibilities visible. Canadian prohibition attacked these relationships. Particular recollections and return histories explain why a law, a museum’s custody and a community’s authority are different forms of evidence.';
  s.sections = [
    sec(
      'Preparation supports people who witness',
      'A potlatch requires work before invited people arrive. The AMNH presentation, made with Kwakwaka’wakw contributors, describes extended families gathering food and gifts. Guests help verify claims about family history and inherited standing; gifts acknowledge their presence as witnesses. U’mista describes events including naming, marriage, leadership and death. This makes preparation consequential social work, rather than an unexplained pile of possessions. The public accounts give an entry into these responsibilities without turning every Northwest Coast nation’s institutions into one identical practice.',
      cite('kwak-amnh', 'P’a̱sa: preparation, witnesses and family work'),
      cite('umista-history', 'Witnesses and life changes'),
    ),
    sec(
      'Prohibition changed the risks of participation',
      'U’mista distinguishes the 1884 amendment from the law taking effect on 1 January 1885. Continued potlatching shows that government prohibition did not erase community authority. After Dan Cranmer’s 1921 gathering at Village Island, prosecutions and confiscations followed. The pressure reached families and their belongings. In the public Impact transcript, Vera Newman recalls fear and a family’s experience of imprisonment. Chief Bill Cranmer explains the pressure to surrender belongings to keep members from jail. These are particular accounts, not a single experience assigned to everyone.',
      cite('umista-history', '1884 legislation; Village Island'),
      cite(
        'umista-ban',
        'Impact transcript; named Vera Newman and Chief Bill Cranmer captions; Start',
      ),
    ),
    sec(
      'Return required organization and family decisions',
      'Removing the prohibition in 1951 did not bring the belongings home automatically. U’mista’s history names Chief Jimmy Sewid and band councils among those pursuing return. Meetings involved Elders and representatives, and negotiations addressed where treasures would be cared for. The history says oldest living descendants of original owners were to decide where their belongings would be held. The return account describes planning museums at Alert Bay and Cape Mudge. Building institutions was part of sustained work to recover care and decision-making.',
      cite(
        'umista-history',
        'Late 1950s/1960s efforts; 1973–1975 meetings; descendants’ decisions',
      ),
      cite('umista-return-voices', 'Return of the Collection'),
    ),
    sec(
      'A returned belonging has a particular history',
      'U’mista opened in 1980, the endpoint of the original case. Its public captions connect returned belongings with named relatives, including Florence Matilpi and her grandson Sean with a headdress belonging to her grandfather. Another caption records a 2003 headdress return connected with Chief Sam Scow. These accounts extend beyond an anonymous museum category. They do not establish every missing link in custody or imply that all belongings returned by 1980. Continuing community knowledge also exceeds what the old title page can tell us.',
      cite('umista-about', '1980 opening'),
      cite(
        'umista-return-voices',
        'Florence and Sean Matilpi, 1980; William T. Cranmer and Aube Elléouët, 2003',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'A publication credit and a community account answer different questions',
      'The existing title page names George Hunt’s collected data and Franz Boas’s authorship. Its publication date is 1921, while the annual report covers 1913–14. Reading those credits is useful evidence of how the publication represents its making. It cannot show every conversation, contributor or obligation behind the knowledge. It also does not document the Village Island gathering merely because the dates overlap. Read it beside the attributed community accounts rather than allowing a government imprint to decide whose interpretation counts.',
      cite('hunt-boas-1921', 'Retained part 2 title-page consultation'),
      cite(
        'umista-public-exhibit-credits',
        'Named project team, film-maker and educational/language consultants',
      ),
    ),
    sec(
      'Care after return is more than a change of address',
      'The return transcript explains that museum construction was made a condition of returning part of the collection. It also describes the community’s choices about how belongings should be housed, including why some contributors opposed locking them into cases again. That explanation belongs to a particular public account; it does not grant visitors unrestricted access to every meaning or ceremony. A named caption can connect a returned treasure with a family, while still leaving parts of its history uncertain. The Agnes Alfred caption, for example, gives grandfather or uncle as alternative relationships. Keeping that uncertainty is more useful than inventing a complete biography. Public study can examine these records without copying a ceremonial image or asking a family to perform someone else’s responsibilities.',
      cite('umista-return-voices', 'Return transcript; Agnes Alfred caption'),
      cite(
        'umista-public-exhibit-credits',
        'Copyright statement and attribution limits',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'Witnessing, published credit and the work of return',
    introduction:
      'A legal milestone, a public family recollection, a title-page credit and a return caption support different kinds of claims. None replaces all the others.',
    items: [
      {
        label: 'A particular speaker explains the pressure',
        text: 'U’mista’s Impact page names Vera Newman and Chief Bill Cranmer beside statements about fear, family imprisonment and surrender under pressure.',
        interpretation:
          'Attribute their accounts and identify their retrospective setting. They explain consequences that a date of legislation cannot show; they are not a census of every family’s experience.',
        citations: [cite('umista-ban', 'Impact transcript; named speaker captions')],
      },
      {
        label: 'A printed attribution is evidence of published credit',
        text: 'The title page names Hunt’s data and Boas’s authorship; the old report period and 1921 publication are distinct.',
        interpretation:
          'This page establishes what the publication credits. It does not show the 1921 potlatch, recover every contributor or confer exclusive authority over community knowledge.',
        citations: [
          cite('hunt-boas-1921', 'Retained ethnographic and annual-report title pages'),
        ],
      },
      {
        label: 'A return caption locates a particular family history',
        text: 'U’mista identifies Florence and Sean Matilpi with a returned headdress in 1980 and separately records the 2003 return associated with Sam Scow.',
        interpretation:
          'Keep each identified relationship, represented date and source role distinct. These captions are not a complete collection inventory, permission to reproduce every image or proof all restitution was finished.',
        citations: [
          cite(
            'umista-return-voices',
            '1980 Matilpi caption; 2003 Cranmer/Elléouët caption',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Read the page and separate the claim',
    duration: 'About 10 minutes',
    steps: [
      'Find George Hunt and Franz Boas on the supplied title page, then compare the different words used for their roles.',
      'Read the capsule and distinguish the publication year from the report period.',
      'Write a claim the page supports about credit, followed by a question it cannot answer about a community event or contributor.',
      'Read one attributed community account in the dossier. Explain what it adds without pretending that you witnessed the historical event or performing a ceremony.',
    ],
    explanation: `Source capsule — editorial paraphrase: ${kwakwakawakwCommunityFamilyEvidence.text}`,
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected public source consultation and internal author QA; not independent Kwakwaka’wakw/community or historian acceptance',
    scope:
      'Family preparation and witnesses; particular public recollections of pressure and confiscation; community-directed care and named return accounts. Two new records and four selected dated renewals retain all preceding scopes. The old Hunt/Boas record remains at its prior title-page consultation because current LOC access returned 403. Exact original case identity, complete 1884–1980 interval/note, claims/dimensions/terms and all media fields/bytes are preserved. No new media, annotation, placeStudy, route or historical relationship added.',
    limitations: [
      'Selected public English text/transcripts and source captions were consulted; no original film/audio played, original court/negotiation files inspected, full ethnography read or private family testimony obtained. A 2026 copyright footer does not date the film or photograph.',
      'U’mista’s pages give inconsistent imprisonment totals. No count is adopted or silently harmonized. Named speakers’ retrospective accounts do not become identical experiences or approval by all Kwakwaka’wakw nations.',
      'The actual existing title-page pixels were viewed unchanged. LOC’s current catalogue returned 403; its prior 27 October consultation is retained, not newly dated. The page is a printed document, not a photograph of confiscation, and its historic title is not a universal name for the peoples.',
      'Source captions, not original photographic pixels, establish the selected 1980 and 2003 return examples. No new ceremonial image is downloaded or reproduced. No complete chain of custody or current outstanding return total is claimed.',
      'The wider reference reaches a particular 2003 return account while the original case ends in 1980. Neither endpoint dates potlatch’s origin, end of community authority or completion of every return.',
      'Public introductory teaching and copyright status do not authorize reproducing restricted ceremony, songs, stories or meanings. This account does not supply reenactment instructions or unrestricted visual rights. Independent community/historian review and integrated family, screen-reader/device and physical-print acceptance remain open.',
    ],
  };
}
