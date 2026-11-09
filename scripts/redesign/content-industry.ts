/** Separate industry inquiries, integrated after the sealed Pacific candidate. */
import type { ComparisonDefinition, Corpus, Journey } from '../../src/atlas/model';
import { cite } from './content-helpers';
import {
  applyIndustryFactory,
  factoryWorkContext,
  factoryWorkDimension,
} from './industry-factory';
import {
  applyIndustryTomioka,
  tomiokaPlaceStudy,
  tomiokaWorkContext,
  tomiokaWorkDimension,
} from './c8-tomioka';
import {
  applyIndustryHine,
  hineIndustryContext,
  hineIndustryDimension,
} from './c8-hine';
import { applyIndustryMedia, tomiokaReelingPrint } from './industry-media';

export const industryJourney: Journey = {
  id: 'skills-records-protection',
  title: 'Skills, records and protection',
  question: 'How can we distinguish skilled work from effective protection?',
  duration: '20–30 minutes',
  introduction:
    'Compare a reported factory investigation, a published mill depiction and a reform photograph with their separately dated records. Each setting had its own workers, institutions and legal scope. These stops organize questions, not a route, a shared workforce or a single causal story from machines or images to protection.',
  stops: [
    {
      subject: 'factory-reform',
      year: 1836,
      title: 'Separate an investigative action from a completed result',
      narrative:
        'The 1833 Act’s selected clauses define powers and covered categories. The 1836 extract reports an inspector questioning boys, examining a time book and intending punishment. Ask what the selected record establishes and what would require evidence of what happened afterward. The extract does not supply every age, break, book finding or completed penalty, and a reported benefit elsewhere is not a census of all workplaces.',
    },
    {
      subject: 'tomioka',
      object: tomiokaReelingPrint.id,
      year: 1872,
      title: 'Connect the pictured workplace with learned skills',
      narrative:
        'Observe the print’s rows of people, equipment and roof supports as an artistic arrangement. Its NDL catalogue attribution is bracketed [1872]; the modern reproduction has another, unknown date. Separate sources explain women learning filament handling and teaching elsewhere, alongside regional farming, schooling and later cold storage. Neither the orderly picture nor technical learning establishes everyone’s working conditions. The 1911 law and its 1916 implementation are later, separate evidence.',
    },
    {
      subject: 'hine-labor',
      object: 'loc-hine',
      year: 1908,
      title: 'Keep photograph, caption and later administration distinct',
      narrative:
        'The case remains the particular photograph and caption dated 3 December 1908. Looking supports observations; the caption supplies Hine’s disputed workplace account. A later federal law and the Bureau’s report concern different dates and a defined administrative scope. They do not identify this child’s age, prove every mill complied or establish that this single photograph caused legislation. Ask which further record could test a particular claim.',
    },
  ],
  conclusion:
    'Explain a practical task with a particular source, then name the evidence needed to assess a worker’s protection. Training, an artistic arrangement, an investigative action and a legal rule answer related questions without becoming the same kind of proof. Preserve the people, places, dates and access limits of each record.',
  evidence: {
    prompt: 'Which conclusion distinguishes the supplied records carefully?',
    options: [
      {
        text: 'A source may explain a skill or report an investigation without proving effective protection for everyone.',
        supported: true,
        feedback:
          'The records have defined purposes and scopes. Evidence of training or an investigative action is not automatically a complete account of working conditions or outcomes.',
      },
      {
        text: 'Orderly rows in the Tomioka print prove that every worker could rest or leave whenever she wished.',
        supported: false,
        feedback:
          'A published artistic arrangement does not establish every worker’s hours or freedom. Those questions require appropriate records and attributed accounts.',
      },
      {
        text: 'The Hine photograph alone proves that it caused a later law and that every factory complied.',
        supported: false,
        feedback:
          'The photograph, caption, law and administration report have separate dates and evidentiary roles. A single image cannot supply that causal or universal outcome claim.',
      },
    ],
    citations: [
      cite(
        'factory-inspection-1836',
        'Selected Source 1 transcription: reported investigation',
      ),
      cite(
        'tomioka-instructors-2022',
        'Exposed Introduction: learned operations and teaching',
      ),
      cite('tomioka-ndl-print', 'Selected print composition and bracketed attribution'),
      cite(
        'hine-federal-administration-1921',
        'Selected printed pp.7–17 and75–76; later administrative account',
      ),
    ],
  },
  returnPrompt:
    'Name a practical task, the source explaining it and one separate question about working conditions that still needs evidence.',
  leadObject: tomiokaReelingPrint.id,
  printSourcesPerPage: 2,
  familyEvidence: {
    title: 'A drawing of work is one kind of record',
    object: tomiokaReelingPrint.id,
    text: 'This woodblock print arranges workers and equipment; it is not a photograph. NDL catalogues it as [1872]. A separate account describes learned silk reeling. The image does not establish hours or freedom.',
    citations: [
      cite('tomioka-ndl-print', 'Selected composition; NDL catalogue attribution'),
      cite(
        'tomioka-instructors-2022',
        'Exposed Introduction: learning reeling operations',
      ),
    ],
    notice: ['Find the two rows, the passage and a repeated roof support.'],
    claimPrompt:
      'Describe one pattern. What other source could explain a worker’s hours or choices?',
    returnPrompt: 'Return with one source you would seek to investigate that question.',
    feedback:
      'Rows and roof supports are visible. Working hours and freedom need other evidence. Separate records supply the print’s date and account of learning.',
  },
};

export const industryComparisonCandidates: ComparisonDefinition[] = [
  {
    id: 'factory-reform--tomioka',
    subjects: ['factory-reform', 'tomioka'],
    question:
      'How can learning a production skill differ from putting worker protection into practice?',
  },
];

export function applyIndustry(c: Corpus): void {
  applyIndustryFactory(c);
  applyIndustryTomioka(c);
  applyIndustryHine(c);
  const contexts = [factoryWorkContext, tomiokaWorkContext, hineIndustryContext];
  const contextIds = new Set(contexts.map((row) => row.id));
  c.contexts = [
    ...(c.contexts ?? []).filter((row) => !contextIds.has(row.id)),
    ...contexts,
  ];
  applyIndustryMedia(c);
  const tomioka = c.subjects.find((row) => row.id === 'tomioka')!;
  tomioka.placeStudy = tomiokaPlaceStudy;
  if (tomioka.review) {
    tomioka.review.scope = tomioka.review.scope.replace(
      'The separate place-study proposal uses four published modern UNESCO reference points; source plans and shipment routes are not reproduced.',
      'The local place study uses four published modern UNESCO reference points; source plans and shipment routes are not reproduced. The included NDL print extends the originally empty object list; its bracketed catalogue attribution, rights status and unknown modern digitization date remain distinct.',
    );
    tomioka.review.limitations = tomioka.review.limitations.map((text) =>
      text.startsWith('No inherited Tomioka media exist.')
        ? 'The included NDL print is an artistic representation with bracketed [1872] catalogue attribution; a comparable MAFF impression is dated 1873. Their exact copy/state relationship and the modern scan/exposure dates remain unverified. The MAFF image is research-only. No individual identity, exact shift, measured room plan, universal working conditions or new guide is inferred from the NDL image. Public-domain PDM status is separate from NDL’s expressly stated reproduction terms and required source credit.'
        : text,
    );
  }
  for (const [id, dimension] of [
    ['factory-reform', factoryWorkDimension],
    ['tomioka', tomiokaWorkDimension],
    ['hine-labor', hineIndustryDimension],
  ] as const) {
    const s = c.subjects.find((row) => row.id === id)!;
    const existing = s.dimensions['work-organization'];
    if (existing && JSON.stringify(existing) !== JSON.stringify(dimension))
      throw Error(`A prior work dimension would be replaced: ${id}`);
    s.dimensions = { 'work-organization': dimension, ...s.dimensions };
    s.dimensionKeys = Object.keys(s.dimensions);
  }
  c.comparisons ??= [];
  for (const candidate of industryComparisonCandidates) {
    const pair = [...candidate.subjects].sort().join('--');
    const existing = c.comparisons.find(
      (row) => [...row.subjects].sort().join('--') === pair,
    );
    if (existing) continue; // Earlier authored pair questions remain byte-exact.
    if (c.comparisons.some((row) => row.id === candidate.id))
      throw Error(`Comparison ID collision: ${candidate.id}`);
    c.comparisons.push(candidate);
  }
  const existingJourney = c.journeys.find((row) => row.id === industryJourney.id);
  if (
    existingJourney &&
    JSON.stringify(existingJourney) !== JSON.stringify(industryJourney)
  )
    throw Error('Industry journey ID conflicts with an earlier inquiry');
  if (!existingJourney) c.journeys.push(industryJourney);
  const pack = c.packs.find((row) => row.id === 'C8');
  if (!pack) throw Error('Industry continuation requires the inherited C8 pack');
  if (!(pack.investigations ?? []).some((row) => row.journey === industryJourney.id)) {
    pack.investigations = [
      ...(pack.investigations ?? []),
      {
        title: industryJourney.title,
        journey: industryJourney.id,
        comparison: ['factory-reform', 'tomioka'],
        start: 1833,
        end: 1918,
        question: industryJourney.question,
        orientation:
          'Compare a factory investigation, mill depiction and reform photograph with their dated records. Different institutions require separate evidence of workers’ protection.',
        geography:
          'Tomioka’s four published modern property references identify distinct regional functions. No border, route or shipment is reconstructed.',
        limits:
          'Original case dates, retrospective accounts, later laws and the NDL print’s bracketed date remain distinct. No universal conditions, shared legal regime or photograph-to-law causation is established.',
      },
    ];
  }
}
