import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const factoryWorkSources: Source[] = [
  {
    id: 'factory-act-1833-primary',
    title:
      'An Act to regulate the Labour of Children and young Persons in the Mills and Factories of the United Kingdom',
    institution: 'UK Parliament; original print hosted by legislation.gov.uk',
    url: 'https://www.legislation.gov.uk/ukpga/Will4/3-4/103/pdfs/ukpga_18330103_en.pdf',
    type: 'primary',
    published: '29 August 1833; 3 & 4 William IV, chapter 103',
    accessed: consulted,
    scope:
      'Official original-version page metadata/PDF link and OGL notice read. Selected exposed PDF clauses I–II, VI–VIII, XI–XIII, XVII–XVIII and XX–XXIV consulted; actual complete page pixels 1, 3, 6 and 7 viewed. Not all 16 pages, every exemption/penalty, subsequent amendments or a full legal commentary. On PDF 3/printed 1327, clause VIII body says Nine Hours while its marginal heading says Eight Hours; no single unqualified daily-hours headline or silent correction is adopted. PDF 1 verifies title/date and powered-process scope; PDF 3 verifies phasing and the silk exception; PDF 6 inspection/register powers; PDF 7 school choice and vouchers. Certification clauses at PDF 4 were read as exposed text, not separately viewed pixels. XHTML was unsupported by the web reader; ordinary same-URL retrieval exposed its actual linked PDF, not an access-control bypass. The PDF has xref warnings but rendered legibly without modification. Official footer offers OGL v3 except where otherwise stated; no Crown emblem, facsimile or source artwork reused as media.',
  },
  {
    id: 'factory-inspection-1836',
    title: 'Factory Inspectors Report, 1836: Taylor, Ibbotson & Co. extract',
    institution:
      'The National Archives, source 1 educational transcription of British Parliamentary Papers',
    url: 'https://cdn.nationalarchives.gov.uk/documents/education/factory-actdoc.pdf#page=9',
    type: 'primary',
    published:
      '1836 record as identified by the institution; transcription publication date unestablished',
    accessed: '2026-11-04',
    scope:
      'The National Archives lesson PDF identifies British Parliamentary Papers (1836), p. 353 on printed p. 8. Its transcript on printed p. 9 describes repeated questioning, examination of a time book and the inspector’s intention to punish. It gives no book findings, individual ages, complete meal-break lengths or eventual penalty. The previous direct HTML endpoint returned 403. No original parliamentary volume or full inspector series was consulted.',
  },
  {
    id: 'factory-hansard-1836',
    title: 'Factories Regulations Bill: Commons debate, 9 May 1836',
    institution: 'UK Parliament, Historic Hansard, volume 33, columns 737–788',
    url: 'https://api.parliament.uk/historic-hansard/commons/1836/may/09/factories-regulations-bill',
    type: 'primary',
    published: '1836-05-09',
    accessed: consulted,
    scope:
      'Selected actual parliamentary transcription: Poulett Thomson opening at columns 737–740; selected Ashley response at 741–748; Charles Villiers at 765–766; Hindley at 767–773, especially reported inspector benefits and certification difficulty. Not the whole debate, underlying report series, original interviews or petition files. Hindley, not Strutt, quotes Howell describing instances of benefit from limiting children’s hours and stopping night work. These are mediated quotations in an argument, not an independently collated compliance series. No petition, population, health, age, fraud-fraction or wage numerics adopted; forecasts are not treated as realized outcomes and medical/racial analogies are not repeated. Villiers’s household-income argument is attributed, not every parent’s view. Historic parliamentary record; no source audio, image or edition layout reused.',
  },
  {
    id: 'factory-quarry-bank-context',
    title: 'History of Quarry Bank: selected production, homes and apprenticeship',
    institution: 'National Trust, custodian of Quarry Bank',
    url: 'https://www.nationaltrust.org.uk/visit/cheshire-greater-manchester/quarry-bank/history-of-quarry-bank',
    type: 'archive',
    published: 'Undated current institutional account',
    accessed: consulted,
    scope:
      'Selected actual Building an early industrial community and Child labour prose, with the industrial-community captions encountered. Water-frame/water-wheel/steam-assistance, cottages/apprentice housing, shared chores/basic learning and food/clothing/lodging in exchange for work are used as this mill’s broader context. The Thomas Royley 1785 indenture caption was read but its handwriting/source photograph was not inspected or adopted as independently transcribed primary evidence. Not all factory households or the entire site archive. The page’s before-1833/no-legal-protection and first-Factory-Act shorthand is excluded: earlier Acts are acknowledged in the 1833 statute itself. No workforce/household counts, ages/hours, medical claims, broad deskilling conclusion or precise plantation figures adopted. Source photographs carry copyright credits; no free reuse licence verified or image promised.',
  },
  {
    id: 'factory-spinning-process',
    title: 'Spinning Mule, Y1974.61: catalogue and general making explanation',
    institution: 'Science Museum Group Collection',
    url: 'https://collection.sciencemuseumgroup.org.uk/objects/co8405253/spinning-mule',
    type: 'archive',
    published: 'Undated current catalogue; listed machine made in 1927',
    accessed: consulted,
    scope:
      'Actual catalogue title/date/maker/object number, general explanation of spinning, skilled operators, a hot/noisy spinning room and broken-thread repair/cleanup, and rights notices read. The catalogued Platt Brothers machine was made in Oldham in 1927, distinct from the 1833–1836 case. Its general process explanation does not make that machine or its photographs evidence from the earlier period. No source-photo pixels, physical machine, museum demonstration or machine plan inspected. Legal ages/hours, stronger/finer/most-common claims, dimensions, output totals and uniform workforce composition are excluded. Title/made/maker/details are CC0; description and other text CC BY 4.0. Displayed photographs carry CC BY-NC-SA 4.0 and Science Museum copyright; no photo reused, exposure date or fresh asset promise established.',
  },
];

export const factoryWorkContext: HistoricalContext = {
  id: 'factory-work-inspection-context',
  title: 'Textile work, schooling and inspection: selected 1833–1836 records',
  region: 'Europe',
  interval: {
    start: 1833,
    end: 1836,
    label: 'Selected statute and enforcement evidence, 1833–1836',
    precision: 'range',
    note: 'This reference is an evidence sequence around the unchanged case, not industrialization’s lifespan or a claim that all factories changed together. The Act’s passage and commencement provisions are different dates. Quarry Bank provides broader background; the Science Museum’s catalogued 1927 machine is later and is not placed within these phases.',
  },
  summary:
    'A rule needed people, records and institutions to operate. These selected sources distinguish covered work, statutory obligations, an inspector’s investigation and contested evidence of results.',
  subjectIds: ['factory-reform'],
  citations: [
    cite('factory-act-1833-primary', 'Title/date; clauses I, VII–VIII, XVII–XXI'),
    cite('factory-inspection-1836', 'Lesson PDF, printed p. 9, Source 1 transcript'),
    cite('factory-hansard-1836', '9 May 1836: selected debate passages'),
  ],
  phases: [
    {
      year: 1833,
      label: '1833: the Act is passed',
      title: '29 August dates a statute, not completed workplace change',
      text: 'The Act names powered textile processes and regulates children and young persons through restrictions, schooling, certification and inspection. Its exceptions and commencement provisions matter. Its title does not turn it into a ban on all child work or a complete protection for every worker.',
      citations: [
        cite(
          'factory-act-1833-primary',
          'PDF 1: title/date and clause I; selected provisions',
        ),
      ],
    },
    {
      year: 1834,
      label: '1834: selected provisions begin; others are phased',
      title: 'The date of passage differs from implementation dates',
      text: 'Clauses I and VII specify 1 January 1834 for their restrictions; clause VIII phases further age coverage over later months and contains a silk proviso. These are statutory instructions, not a measured series of compliance. The draft does not replace their detail with one universal daily-hours number.',
      citations: [
        cite('factory-act-1833-primary', 'PDF 1, clause I; PDF 3, clauses VII–VIII'),
      ],
    },
    {
      year: 1836,
      label: '1836: Parliament debates enforcement and alteration',
      title: 'Reports become evidence in a contested political decision',
      text: 'On 9 May, speakers disputed the law’s operation and a proposed change. Hindley quoted Inspector Howell describing instances of benefit, especially reduced night work; other speakers raised household earnings and practical difficulties. A parliamentary argument is not a neutral national compliance survey.',
      citations: [
        cite('factory-hansard-1836', 'Charles Villiers, cc765–766; Hindley, cc767–773'),
      ],
    },
    {
      year: 1836,
      label: '1836: an inspector describes a particular investigation',
      title: 'A reported complaint requires evidence about what followed',
      text: 'The institution dates the Taylor, Ibbotson & Co. extract to 1836. The inspector reports questioning boys, looking at a time book and intending punishment. The selected transcription does not provide ages, every break, the book’s findings or a completed penalty; it cannot alone measure all workplaces.',
      citations: [
        cite(
          'factory-inspection-1836',
          'Source 1 transcription and institutional date',
        ),
      ],
    },
  ],
};

export const factoryWorkDimension = {
  text: 'Textile work linked machine operation with homes, subsistence and schooling. Statutory protection depended on covered categories, usable records and investigation. A complaint, an inspection power and a completed improvement are different evidence; neither one complaint nor one reported benefit measures every workplace.',
  citations: [
    cite('factory-quarry-bank-context', 'Production, housing and apprenticeships'),
    cite('factory-act-1833-primary', 'Clauses XVII–XXI'),
    cite('factory-inspection-1836', 'Particular investigation'),
    cite('factory-hansard-1836', 'Hindley quoting Howell, c768'),
  ],
};

export function applyIndustryFactory(c: Corpus): void {
  for (const source of factoryWorkSources)
    if (!c.sources.some((row) => row.id === source.id)) c.sources.push(source);
  c.contexts ??= [];
  if (!c.contexts.some((row) => row.id === factoryWorkContext.id))
    c.contexts.push(factoryWorkContext);
  const s = c.subjects.find((row) => row.id === 'factory-reform');
  if (!s) throw new Error('Factory continuation requires the existing case');
  s.contextIds = [...new Set([...(s.contextIds ?? []), factoryWorkContext.id])];
  s.summary =
    'Textile production joined machinery with skilled tasks, household needs and children’s time. The 1833 Act created obligations and inspection powers; later records let us investigate their operation. Protection required evidence and continuing work, with results that cannot be read directly from the date a law passed.';
  s.sections = [
    sec(
      'Threads and machines still required people',
      'Spinning turned cotton into yarn, but machinery still needed people to repair broken threads and clear waste. The Science Museum’s account describes skilled work within a hot, noisy production process. Quarry Bank supplies a particular background: the National Trust describes cotton spinning brought under one roof, with a water wheel powering machinery and a steam engine later assisting it. This organized power, materials and workers together. The history of one mill helps explain production without making every textile process or workplace identical.',
      cite(
        'factory-spinning-process',
        'General spinning, repair and cleanup explanation',
      ),
      cite('factory-quarry-bank-context', 'Building an early industrial community'),
    ),
    sec(
      'Work and household arrangements were connected',
      'At Quarry Bank, apprentices received lodging, clothing and food in exchange for work; their lives included shared housing, chores and learning. Mill cottages linked other workers’ homes with the industrial community. These were arrangements that organized daily life as well as production. Children’s earnings were also politically contested. In 1836 Charles Villiers argued that restricting work could remove means of subsistence from families. His speech identifies a household-income argument, not proof that every family wanted the same work or hours.',
      cite(
        'factory-quarry-bank-context',
        'Apprentice housing, cottages and Child labour',
      ),
      cite('factory-hansard-1836', 'Charles Villiers, cc765–766'),
    ),
    sec(
      'The Act created a system of obligations',
      'The Act dated 29 August 1833 named powered textile processes and regulated children and young persons. Different provisions began at different times, with industry exceptions. The Act used certificates for defined age groups and school-attendance vouchers for children within its schooling provisions. Employment therefore depended on specified documents as well as a spoken promise. Parents or guardians had a role in choosing a school, with provision for an inspector to act when needed. Keeping records and providing schooling therefore became part of making protection operate. The statute supplied requirements; its existence did not establish that every certificate was accurate or every lesson useful.',
      cite('factory-act-1833-primary', 'Clauses I, VII–VIII, XI–XIII and XVIII–XXI'),
    ),
    sec(
      'An inspector had to investigate what happened',
      'The law empowered inspectors to enter operating mills, question people and require records. In the extract identified as an 1836 report, an inspector describes boys at Taylor, Ibbotson & Co. reporting work from Friday morning into Saturday afternoon, with breaks. He says he repeated his questions and went to look at the time book, then stated that he intended punishment. That sequence reveals investigative work. The extract does not give the book’s findings or a completed prosecution, so an intention cannot be counted as an enforced penalty.',
      cite('factory-act-1833-primary', 'PDF 6: clauses XVII–XVIII'),
      cite('factory-inspection-1836', 'Lesson PDF, printed p. 9, Source 1 transcript'),
    ),
    sec(
      'Results needed comparison',
      'A reported complaint does not prove that protection achieved nothing. In the 1836 Commons debate, Hindley quoted Inspector Howell describing instances of benefit, particularly stopping children’s night work. These reported observations also fall short of a national success rate. Read together, the records turn a legislative milestone into an inquiry about institutions, particular workplaces and outcomes.',
      cite('factory-hansard-1836', 'Hindley quoting Howell, c768'),
      cite('factory-inspection-1836', 'Limits of the selected case'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Read a provision before making a headline',
      'The statute’s categories and exceptions matter. Clause VII’s restriction on younger children excepts silk manufacture, while further coverage is phased. Certification clauses refer to a child’s strength and appearance, rather than supplying a modern independently verified birth record. The selected scan itself requires care: clause VIII’s body says Nine Hours, while its marginal heading says Eight Hours. This account keeps that difference visible and avoids turning an uncertain shorthand into a single universal daily limit. Further edition and legal-history collation remains open.',
      cite('factory-act-1833-primary', 'PDF 3: clauses VII–VIII; PDF 4: XI–XIII'),
    ),
    sec(
      'Follow the chain from testimony to outcome',
      'The boys reach us through an inspector’s selected report. Their consistent answers are evidence he says he collected, while looking at a time book is an action he reports taking. Neither tells us the book’s contents, the boys’ ages or what a court eventually did. The extract also leaves meal-break lengths incomplete, so it cannot support an exact net-work calculation. A conviction record, follow-up inspection and later testimony could answer different questions about enforcement. They have not been consulted here and must not be invented.',
      cite(
        'factory-inspection-1836',
        'Questioning, time book, breaks and intended punishment',
      ),
    ),
    sec(
      'Parliament selected evidence for an argument',
      'Hindley quoted inspectors while opposing a proposed alteration; Villiers emphasized family subsistence. Their choices explain political purposes without making either speaker the voice of all workers. Howell’s reported benefits and the particular complaint remain different observations. The museum’s much later 1927 spinning mule supplies general process interpretation, not an image or workplace record from 1833.',
      cite('factory-hansard-1836', 'Charles Villiers; Hindley'),
      cite('factory-spinning-process', '1927 catalogue date and general explanation'),
    ),
  ];
  s.evidenceReading = {
    title: 'A rule, an investigation and evidence of change',
    introduction:
      'These are editorial paraphrases of selected sources. The statute, the inspector’s account and the parliamentary quotations do different jobs.',
    items: [
      {
        label: 'A statutory obligation describes what should happen',
        text: 'The Act empowers inspection and the keeping of employment and school-attendance records. Its named processes, exceptions and phased provisions define its scope.',
        interpretation:
          'This supports a claim about the institutional design of protection. It does not establish that a workplace complied or a document was accurate. The body/margin hours discrepancy is preserved in deeper reading, rather than hidden inside a universal summary.',
        citations: [
          cite('factory-act-1833-primary', 'Clauses I, VII–VIII and XVII–XXI'),
        ],
      },
      {
        label: 'Checking a book is not the same as reporting its result',
        text: 'The inspector says he questioned the boys, heard consistent accounts, looked at a time book and intended punishment.',
        interpretation:
          'The extract makes his method and judgment visible. It does not state what the book contained, prove every age-specific breach or report a completed penalty. More evidence is needed to connect investigation with outcome.',
        citations: [
          cite(
            'factory-inspection-1836',
            'Lesson PDF, printed p. 9, Source 1 transcript',
          ),
        ],
      },
      {
        label: 'One complaint and one reported benefit have different limits',
        text: 'In the Commons debate, Hindley quotes Howell reporting instances where limiting work and ending night work benefited children.',
        interpretation:
          'That is evidence quoted within a political argument, not a complete national measurement. It prevents equating the particular Taylor, Ibbotson complaint with zero improvement everywhere, while leaving the extent and durability of change open.',
        citations: [
          cite('factory-hansard-1836', 'Hindley, c768'),
          cite('factory-inspection-1836', 'Particular case'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'A rule is the start of a test',
    duration: '10–15 minutes',
    steps: [
      'Read the source capsule with an adult. Make cards headed Rule, Investigation and Outcome still to check.',
      'Sort the power to examine records, the inspector’s questioning of boys, his looking at a time book and his intention to punish. Explain which are reported actions and which are powers or intentions.',
      'Name one record that could help establish what happened afterwards. Say what you would look for in it, without inventing its contents.',
      'Write a conclusion that allows both the reported complaint and instances of benefit to remain visible. Explain why neither measures every workplace.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the 1833 Act gave inspectors powers to question people and require records in covered workplaces. In the extract dated 1836, an inspector says he heard boys’ consistent accounts of prolonged work, looked at a time book and intended punishment. The extract does not tell us the book’s findings or a completed penalty. In a separate parliamentary debate, Hindley quoted Howell reporting instances of benefit, especially stopping night work. The activity asks what each record establishes; it does not require an exact hours calculation, graphic reenactment or an invented child’s diary.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian or family acceptance',
    scope:
      'Production and household background, selected primary statute provisions, a specifically limited inspector transcription and selected parliamentary debate. The 4 November review also checked the inspector extract against the National Archives lesson PDF. No media, asset or place study added.',
    limitations: [
      'The complete original 1833–1836 interval, approximate precision and note remain intact. The selected reference shares those bounds but does not date industrialization. The Act’s passage, staged commencements, particular report and debate are different evidence; the 1927 museum machine is later.',
      'Only selected Act clauses and four complete page images were inspected, not the entire 16-page statute, every exemption, subsequent amendments or a full legal history. The clause VIII body/margin discrepancy remains explicit; no unqualified single daily-hours limit or contemporary legal advice offered.',
      'The National Archives lesson identifies the extract as British Parliamentary Papers (1836), p. 353. Printed p. 9 gives the transcript. The original volume, full report, time book, individual ages and outcome of the threatened penalty remain unverified.',
      'Parliamentary quotations are mediated by speakers’ choices. No full inspector series, worker interview collection, original family wage books or national compliance rate consulted. Household-income claims remain attributed rather than universal.',
      'Quarry Bank is a particular broader background, not a representative sample. Its present account’s first-Act/no-protection shorthand and medical, demographic and legal numerics are excluded. Its indenture was encountered as a caption, not independently read handwriting.',
      'No source image, historical plan, numeric locator, new explanatory diagram or per-view image claim adopted. Independent specialist review, real adult/family use, human accessibility/device testing and physical print acceptance remain open.',
    ],
  };
}
