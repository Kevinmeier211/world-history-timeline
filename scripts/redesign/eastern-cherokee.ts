/** Output-only leaf draft. Preserves the April issue, whole case and prior claims. */
import type { Corpus, HistoricalContext, Source, Subject } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';
export const cherokeePrintSources: Source[] = [
  {
    id: 'phoenix-boudinot-letter-1832',
    title:
      'Cherokee Phoenix: Elias Boudinot’s letter to the editor and a separate reader response',
    author:
      'Elias Boudinot: letter dated 10 September 1832; adjacent correspondent separately attributed',
    institution: 'Cherokee Phoenix; Western Carolina University, Hunter Library',
    url: 'https://www.wcu.edu/library/DigitalCollections/CherokeePhoenix/Vol5/no04/cherokee-phoenix-page-2-column-1b-5b.html',
    type: 'primary',
    published: '1832-09-15',
    accessed: consulted,
    scope:
      'Actual primary HTML transcription, Vol5 no4,p2 cols1b–5b: To the Editor letter, Boudinot byline/New Echota10September1832 date, and opening of a separately dated 7 September reply about Rocky Mountain’s public inquiry and Ross’s message. Boudinot reports assistant S. Foreman’s six-month service, illness and an unfilled vacancy because the Council made no provision. This is an attributed staffing account, not a payroll audit; adjacent writers are not all Boudinot. No original page, microfilm or complete issue collated and no equal-content/readership inference. Historical 1832 text is public domain; no image, whole article or modern page apparatus copied.',
  },
  {
    id: 'phoenix-reprinted-comment-1832',
    title:
      'Cherokee Phoenix: a reprinted Christian Soldier comment on continuing the newspaper',
    author:
      'Christian Soldier, Boston newspaper; reprinted by the Cherokee Phoenix; named writer unknown',
    institution: 'Cherokee Phoenix; Western Carolina University, Hunter Library',
    url: 'https://www.wcu.edu/library/DigitalCollections/CherokeePhoenix/Vol5/no07/cherokee-phoenix-page-2-column-4a.html',
    type: 'primary',
    published: '1832-10-06',
    accessed: consulted,
    scope:
      'Actual introductory attribution and reprinted comment following the separately signed A SPECTATOR contribution, Vol5 no7,p2 col4a. It reports resignation/financial difficulty and argues for maintaining publication. WCU’s transcription-fidelity warning read. This is mediated reporting, not Boudinot’s letter, Ross’s complete original message or independent proof of all resignation causes. The existing shared 1832 year remains; conflicting seasons are not resolved. No source page/microfilm collated; no earlier court narrative attributed to the reprinted comment. Historical 1832 text is public domain; short paraphrase, no image or extended transcription copied.',
  },
  {
    id: 'cherokee-freedmen-public-history',
    title: 'Cherokee Freedmen: selected slavery, removal and constitutional history',
    institution: 'Visit Cherokee Nation',
    url: 'https://visitcherokeenation.com/culture/cherokee-freedmen/',
    type: 'primary',
    accessed: consulted,
    scope:
      'Actual public Slavery in Cherokee Nation prose and timeline entries 1827,1835,1838–1839 and 6 September 1839. Elite slaveholding, forced removal and labor after arrival are the selected account; possible translation and a proposed widening class divide retain the source’s inferential status and are not converted into certain biographies. Later emancipation/current-citizenship sections were encountered but no current legal ruling, numerical population estimate, full later history or independent archive/interview consultation claimed. Credited Oklahoma Historical Society images were not inspected/reused; no open licence verified. Short attributed paraphrase only; online publication date unknown.',
  },
];

export const cherokeePrintContext: HistoricalContext = {
  id: 'cherokee-print-government-context',
  title: 'Printed government, coercion and renewed publication',
  region: 'Americas',
  interval: {
    start: 1827,
    end: 1844,
    label: 'Selected constitution-to-renewed-newspaper frame, 1827–1844 CE',
    precision: 'range',
    note: 'A selected sequence from the 1827 constitution through the Advocate’s 1844 establishment in Tahlequah. The whole original 1821–1839 inquiry remains unchanged. Neither end dates Cherokee nationhood, language, printing or the end of enslavement. The 1828 April photograph, February first-issue transcription and 1832 reprints retain separate issue dates.',
  },
  summary:
    'Print carried laws, practical staffing concerns and disagreement to readers. Forced removal disrupted lives and government without ending publication or nationhood; the renewal of institutions did not create equal rights for everyone.',
  subjectIds: ['cherokee-print'],
  citations: [
    cite(
      'phoenix-constitution',
      'Publication heading and July 1827 adoption; Article III',
    ),
    cite('phoenix-boudinot-letter-1832', 'Boudinot letter; separate reader reply'),
    cite(
      'cherokee-nation-history',
      'Conflicts with Georgia; Forced Removal and Reunification, including1844 Advocate',
    ),
    cite(
      'cherokee-freedmen-public-history',
      'Slavery in Cherokee Nation;1839 timeline entry',
    ),
  ],
  phases: [
    {
      year: 1827,
      label: 'July 1827: a written constitution',
      title: 'National authority includes political exclusions',
      text: 'The later first-issue transcription identifies a constitution formed at New Echota in July 1827. It describes national land and divided government while restricting office and voting by sex, freedom and ancestry.',
      citations: [
        cite(
          'phoenix-constitution',
          'Adoption heading; ArticlesI–III, especiallyIII sections 4 and 7',
        ),
      ],
    },
    {
      year: 1828,
      label: '1828: separate newspaper issues',
      title: 'Preserve publication and object identities',
      text: 'The February 21 first-issue transcription carries the constitution. The unchanged supplied photograph identifies the April 10 title portion, vol. 1 no. 8; it is not the February first issue and has an unknown later photographic-reproduction date.',
      citations: [
        cite('phoenix-constitution', 'Vol. 1 no. 1 metadata'),
        cite('phoenix-photo', 'Retained catalogue scope; actual unchanged masthead'),
      ],
    },
    {
      year: 1832,
      label: 'September/October 1832: staffing and publication are debated',
      title: 'The newspaper contains different speakers',
      text: 'Boudinot’s dated letter discusses assistance and a vacancy. A separate correspondent debates how to seek Ross’s views, while an October reprint urges continued publication. These pieces are distinct from a single uncontested editorial voice.',
      citations: [
        cite(
          'phoenix-boudinot-letter-1832',
          'September 15 issue: letter and separate September 7 reply',
        ),
        cite(
          'phoenix-reprinted-comment-1832',
          'October 6 issue: Christian Soldier attribution and comment',
        ),
      ],
    },
    {
      year: 1835,
      label: '1835: contested treaty authority',
      title: 'Signatures are not universal consent',
      text: 'The Cherokee Nation’s historical account states that New Echota signatories lacked authority under Nation law. The account distinguishes their act from the position of the majority who opposed relinquishing their homelands.',
      citations: [
        cite('cherokee-nation-history', 'Conflicts with the State of Georgia'),
      ],
    },
    {
      year: 1838,
      label: '1838–1839: forced removal',
      title: 'Political pressure becomes coercive movement',
      text: 'The Nation’s account describes U.S. troops enforcing removal. Its public Freedmen history includes people enslaved by Cherokee citizens in this forced movement. No single route or uniform legal position is inferred for everyone.',
      citations: [
        cite(
          'cherokee-nation-history',
          'Forced Removal, Internal Conflict, and Reunification',
        ),
        cite(
          'cherokee-freedmen-public-history',
          'Slavery in Cherokee Nation;1838–1839 timeline',
        ),
      ],
    },
    {
      year: 1839,
      label: '1839: reorganization without universal equality',
      title: 'Political continuity includes continuing conflict',
      text: 'A new constitution reorganized the Nation after removal and earlier western migration. The public Freedmen history records continuing racial inequality. The date does not mark the end of internal conflict or slavery.',
      citations: [
        cite(
          'cherokee-nation-history',
          'Reunification under a new constitution; persistent disputes',
        ),
        cite('cherokee-freedmen-public-history', 'September 6, 1839 timeline entry'),
      ],
    },
    {
      year: 1844,
      label: '1844: the Cherokee Advocate is established',
      title: 'Publication resumes in a changed setting',
      text: 'The Cherokee Nation’s account identifies the bilingual Advocate in Tahlequah alongside rebuilt institutions. It is evidence of continued publication, not proof that removal’s consequences or political exclusions were resolved.',
      citations: [
        cite(
          'cherokee-nation-history',
          'Tahlequah and 1844 Cherokee Advocate paragraph',
        ),
      ],
    },
  ],
};

export const cherokeePrintWorkDimension: Subject['dimensions'][string] = {
  text: 'Typesetting, language knowledge and editing sustained a national publication, while its constitution restricted participation and some leaders relied on enslaved labor. Production, political authority and equal rights must be investigated separately.',
  citations: [
    cite('phoenix-catalogue', 'Retained type/publication history'),
    cite('phoenix-boudinot-letter-1832', 'Boudinot’s staffing account'),
    cite('phoenix-constitution', 'Article III sections 4 and 7'),
    cite('cherokee-freedmen-public-history', 'Slavery in Cherokee Nation'),
  ],
};

export function applyEasternCherokee(c: Corpus): void {
  c.contexts ??= [];
  const renewals = {
    'phoenix-constitution':
      'Actual selected WCU HTML transcription: first-issue date/page-column metadata, July 1827 formation, Article I section2, Article II, Article III sections 4 and 7. Adjacent clauses exposed but no complete constitution continuation or first issue independently collated. WCU expressly warns that transcript accuracy cannot be guaranteed and advises checking originals for exact quotations. No facsimile/microfilm pixels freshly inspected; discriminatory clauses critically paraphrased rather than repeated as narrator terminology.',
    'cherokee-nation-history':
      'Actual selected institutional prose: 1817/1819 land/migration background; Conflicts with the State of Georgia; Forced Removal, Internal Conflict, and Reunification through the 1844 Advocate paragraph. Distinct unauthorized 1835 signatories, 1838 coercion, 1839 political reorganization and later continued disputes retained. Later Civil War material encountered but no full later history/current legal ruling or mortality total adopted. No removal roster, full court judgment, map or source-image pixels consulted through this page.',
  };
  for (const [id, text] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw Error(`Missing inherited Cherokee source: ${id}`);
    const marker = `Eastern selected renewal, ${consulted}: `;
    if (!source.scope.includes(marker)) {
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker}${text}`;
      source.accessed = consulted;
    }
  }
  // Both LOC endpoints returned 403. Their prior scope/access/rights are retained.
  for (const source of cherokeePrintSources) {
    const existing = c.sources.find((row) => row.id === source.id);
    if (existing && JSON.stringify(existing) !== JSON.stringify(source))
      throw Error(`Cherokee source identity collision: ${source.id}`);
    if (!existing) c.sources.push(source);
  }
  const context = c.contexts.find((row) => row.id === cherokeePrintContext.id);
  if (context && JSON.stringify(context) !== JSON.stringify(cherokeePrintContext))
    throw Error('Cherokee context identity collision');
  if (!context) c.contexts.push(cherokeePrintContext);
  const s = c.subjects.find((row) => row.id === 'cherokee-print');
  if (!s) throw Error('Missing inherited Cherokee print case');
  s.contextIds = [...new Set([...(s.contextIds ?? []), cherokeePrintContext.id])];
  s.summary =
    'A national newspaper required type, language knowledge, workers and money. Its pages also carried disagreement about who should speak and what to do under pressure. Reading print beside the constitution and a public Freedmen history shows Cherokee political agency without mistaking national sovereignty for equal rights or a newspaper for protection against forced removal.';
  s.sections = [
    sec(
      'A writing system became practical print work',
      'Sequoyah’s syllabary and the Nation’s commission for Cherokee and English type made publication possible. Editors selected and prepared material, and the press arranged it into columns for readers. The supplied masthead visibly joins Cherokee characters, an eagle device and an English title. It belongs to 10 April 1828, not the February first issue. Its limited resolution supports looking at that arrangement; cited transcriptions supply particular passages rather than pretending every tiny word can be recovered from this image.',
      cite(
        'phoenix-catalogue',
        'Retained syllabary/type commission and first-issue history',
      ),
      cite(
        'phoenix-photo',
        'Actual unchanged April 10 masthead; retained catalogue identity',
      ),
    ),
    sec(
      'Maintaining a newspaper required people and provision',
      'In a letter dated 10 September 1832, Elias Boudinot described having an assistant, S. Foreman, for only six months. He said illness ended that assistance and the Council made no provision for replacing him. This is the former editor’s account of a practical staffing problem. An October issue reprinted a Boston newspaper’s response to resignation and financial difficulty, urging continued publication. These distinct pieces show people arguing over how to sustain a paper, not one voice or an independently verified payroll.',
      cite(
        'phoenix-boudinot-letter-1832',
        'To the Editor letter, September 10, published September 15',
      ),
      cite(
        'phoenix-reprinted-comment-1832',
        'Christian Soldier attribution and reprinted comment, October 6',
      ),
    ),
    sec(
      'Readers debated access to political arguments',
      'Another September correspondent responded to a public inquiry about Principal Chief John Ross’s message and his hopes for defending Cherokee rights. The reply asked why the question had been posed in English rather than taken to the leaders in Cherokee. It also referred readers to a previously published message. Language, public circulation and confidence in leaders were therefore part of the argument itself. The selected text is an attributed exchange; it does not measure every reader’s literacy or erase disagreements over removal.',
      cite(
        'phoenix-boudinot-letter-1832',
        'Separately dated September 7 reply concerning Rocky Mountain and Ross’s message',
      ),
    ),
    sec(
      'Political defense coexisted with enslavement and exclusion',
      'The constitution printed in the first issue asserted national land and governmental authority, while restricting office and voting by sex, freedom and ancestry. The Nation’s public Freedmen history identifies elite slaveholding and explains that enslaved Black people also endured removal and worked after arrival in Indian Territory. Defending a nation against dispossession did not make its internal rights equal. Neither the language of liberty nor national reconstruction supplies the experiences or consent of everyone whose labor helped sustain it.',
      cite(
        'phoenix-constitution',
        'Article I section2; Article II; Article III sections 4 and 7',
      ),
      cite(
        'cherokee-freedmen-public-history',
        'Slavery in Cherokee Nation; 1827 and 1838–1839 timeline',
      ),
    ),
    sec(
      'Removal did not end nationhood or publication',
      'The Cherokee Nation’s history distinguishes unauthorized 1835 signatories from the people who opposed leaving, and describes U.S. troops enforcing removal from 1838. A new constitution followed in 1839 amid continuing conflict. In 1844 the bilingual Cherokee Advocate began in Tahlequah. These were acts of political and practical rebuilding, not an end to inequality. Print could sustain an argument and transmit information; its existence could not by itself make outside officials respect the Nation’s commitments or protect every resident from coercion.',
      cite(
        'cherokee-nation-history',
        'Conflicts with Georgia; Forced Removal and Reunification, including1844 Advocate',
      ),
      cite('cherokee-freedmen-public-history', 'September 6, 1839 timeline entry'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A page can contain several layers of authorship',
      'The September issue places Boudinot’s dated letter beside a separate reader’s reply. Their positions and subjects should not be merged. The October comment adds another layer: it is introduced as material from the Christian Soldier, a Boston newspaper, and then reprinted in the Phoenix. It reports a resignation and recommends sustaining publication, but it is not the original resignation letter or Ross’s complete message. Identifying writer, intermediary, issue and date matters before using a passage as evidence of a political position. WCU’s transcriptions make these exchanges accessible while explicitly leaving exact wording subject to checking against original pages.',
      cite(
        'phoenix-boudinot-letter-1832',
        'Byline/date and separately dated correspondent',
      ),
      cite(
        'phoenix-reprinted-comment-1832',
        'Reprint attribution; transcription-fidelity notice',
      ),
    ),
    sec(
      'Rebuilding has more than one history',
      'The public Freedmen account connects the forced movement of enslaved people with labor on homes and farms after arrival. It proposes that elite access to enslaved labor widened economic differences; that interpretation should remain attributed rather than become a measured account of every household. Its timeline also describes continuing inequality under the 1839 constitution. Reading this beside the Nation’s account of institutional continuity changes the question from whether the Nation survived to who could exercise rights within it. Neither a government’s resilience nor its newspaper’s bilingual form guarantees equal political participation. No present-day citizenship ruling or complete individual biography follows from these selected historical sources.',
      cite(
        'cherokee-freedmen-public-history',
        'Slavery in Cherokee Nation; September 6, 1839 timeline',
      ),
      cite(
        'cherokee-nation-history',
        '1839 reorganization and 1844 rebuilding/publication',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'One issue image and several separately identified texts',
    introduction:
      'The small supplied photograph supports masthead observations. These editorial paraphrases identify the separate texts used for political and social interpretation; they are not all printed on the displayed April page.',
    items: [
      {
        label: 'The image identifies a particular issue',
        text: 'The masthead visibly dates this title portion to 10 April 1828. A different first-issue transcription is dated 21 February 1828 and prints the July 1827 constitution.',
        interpretation:
          'A source image, publication event and constitutional adoption have separate dates. Seeing two writing systems does not establish equal content, universal literacy or complete readability of tiny text.',
        citations: [
          cite('phoenix-photo', 'Actual masthead; retained catalogue identity'),
          cite('phoenix-constitution', 'Publication/adoption heading'),
        ],
      },
      {
        label: 'A letter and a reprint make different claims',
        text: 'Boudinot’s September letter reports staffing and Council provision. The October text is introduced as a Boston newspaper’s comment urging publication to continue.',
        interpretation:
          'The first is an attributed self-report; the second is a mediated comment. Neither is a complete staffing ledger, the full resignation correspondence or proof every reader agreed.',
        citations: [
          cite('phoenix-boudinot-letter-1832', 'To the Editor letter, September 10'),
          cite(
            'phoenix-reprinted-comment-1832',
            'Christian Soldier attribution and comment',
          ),
        ],
      },
      {
        label: 'Liberty in a preamble is not equal participation',
        text: 'The constitution’s office and voting clauses restricted participation. The public Freedmen history includes enslaved people in removal and rebuilding.',
        interpretation:
          'These sources challenge a claim that a national public voice represented everyone on equal terms. Historical discriminatory categories are described critically; no contemporary legal determination is offered.',
        citations: [
          cite('phoenix-constitution', 'Article III sections 4 and 7'),
          cite(
            'cherokee-freedmen-public-history',
            'Slavery in Cherokee Nation;1827/1838–1839 entries',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'A visible page and a separate passage',
    duration: '10–15 minutes',
    steps: [
      'Find the two kinds of lettering, the eagle and the date on the supplied masthead. Describe one feature another reader can point to.',
      'Read the capsule and place the July 1827 constitution, February 1828 first issue and April 1828 supplied image on three separate cards.',
      'Explain why two writing systems on a page do not prove that everyone could vote or hold office. Use the supplied constitutional capsule rather than guessing from the tiny body text.',
      'Write a question the image cannot answer about a reader or worker, and name a kind of further source you would seek.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: this image shows the 10 April 1828 issue. A separate 21 February 1828 transcription prints the July 1827 constitution. That constitution asserted national government but restricted office and voting by sex, freedom and ancestry, excluding people of African descent. A masthead can show a date and forms of printing; it cannot establish everyone’s political rights, reading ability or experience. The 650-pixel original is not offered as a readable copy of every article.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian, Cherokee/Freedmen or family approval',
    scope:
      'The unchanged April masthead, selected primary transcriptions and attributed Nation/Freedmen accounts connect practical print production, disagreement, political exclusions and continued publication after removal.',
    limitations: [
      'The whole original 1821–1839 interval, note/precision, identity, coordinates, claims, dimensions, original object order and full media record/pixels remain unchanged. The separate 1827–1844 reference does not end Cherokee history or enslavement.',
      'Both LOC endpoints returned 403. Their earlier dated scopes and rights metadata are retained rather than presented as fresh catalogue consultation. The existing local 650×492 image was actually inspected; no modern reproduction date or fresh remote-image byte parity established.',
      'WCU transcriptions were read at the identified passages, not independently collated with microfilm or original page images. Reprinted comments and anonymous/dated adjacent correspondents remain separate. The shared 1832 resignation year is retained without resolving conflicting seasonal summaries.',
      'No new image, route or geographic study, Freedmen interview, exact readership, complete political history, current legal ruling or inferred equality supplied. Independent scholarly/community assessment, real family use, human accessibility/device checks and physical print acceptance remain open.',
    ],
  };
}
