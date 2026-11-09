import type { Corpus, HistoricalContext, Subject } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const renewals: Record<string, string> = {
  'ozette-museum':
    'Complete visible Ozette Archaeological Site body reread: winter 1969–70 exposure, April 1970 collaboration, Makah oral history, reported 500±50 BP, six longhouses, eleven-year excavation, retained collection and the Tribe’s wish to curate/interpret it. The report’s BP expression is not converted to a calendar year; eleven years is not used to invent an exact excavation-end date. No original assay/calibration table or excavation report consulted. The page retains a pandemic closure banner whose current applicability was not verified; it is not adopted as current visiting advice. No source-image pixels, house plan, new media licence or permission to enter/copy a restricted collection established.',
  'makah-canoes':
    'Complete visible public Canoeing body reread, with use confined to Makah Canoe Construction and Ensuring a Safe Journey. The construction account describes hollowing red cedar, water/heated rocks, steaming and flaring while retaining straight-grain strength; replaceable protective hardwood gunwales are specifically linked to Ozette finds. The ordered material-work paraphrase is this public account, not a newly documented workshop, a construction manual or a recovered complete excavated canoe. The absence of sails in deposits remains an absence with unknown historical beginning. Navigation is described at the source’s general level without charting a route or restricted site. The visible 30 November 2023 webpage timestamp is not an ancient construction date or independently verified first publication date. Source photos/pixels and new reproduction permission were not inspected or adopted.',
};

/** A public-account reading sequence, not source geometry or a new reconstruction. */
export const ozetteMaterialWorkSequence = [
  {
    label: 'Shape the cedar',
    text: 'The Tribe’s public account describes hollowing a red-cedar log. This stage removes material, but the desired final width was not obtained simply by carving away every part of the sides.',
    interpretation:
      'Material removal is one part of making. The source’s account of construction should not be assigned automatically to every object or household.',
    citations: [cite('makah-canoes', 'Makah Canoe Construction, first paragraph')],
  },
  {
    label: 'Use heat to change the shape',
    text: 'Water and heated rocks supplied steam; the softened sides could be flared while retaining straight-grain strength. This explains a material decision in the account, not a measured procedure recovered from the later photograph.',
    interpretation:
      'The reason for using heat concerns wood structure. No exact temperature, tool kit, timing or measured geometry is supplied here.',
    citations: [cite('makah-canoes', 'Makah Canoe Construction, first paragraph')],
  },
  {
    label: 'Protect a part that wears',
    text: 'The account identifies hardwood gunwales laced to canoe sides found at Ozette. These protective strips took wear from paddling and could be replaced. Maintenance belongs alongside initial making.',
    interpretation:
      'This passage specifically connects a replaceable protective part with Ozette finds. It does not identify the later photograph’s boat as an excavated specimen.',
    citations: [cite('makah-canoes', 'Makah Canoe Construction, Ozette gunwales')],
  },
];

export const ozetteKnowledgeContext: HistoricalContext = {
  id: 'ozette-research-community-custody',
  title: 'Ozette: exposure, collaboration and community custody',
  region: 'Americas',
  interval: {
    start: 1969,
    end: 1970,
    precision: 'range',
    label: 'Selected exposure and excavation-start frame, winter 1969–70 to April 1970',
    note: 'A modern research/custody frame from the Makah museum account, not a date for the houses, the whole excavation, the cultural center’s founding or the village’s life. The original disputed burial estimates remain c. 1560 or 1700, and the reported 500±50 BP is not silently converted. The c. 1910/copyright 1911 photograph is different later evidence.',
  },
  subjectIds: ['ozette-makah'],
  summary:
    'The museum’s account connects exposed wooden belongings with a collaboration initiated through the Tribe. Makah oral history and the decision to keep the collection on the reservation matter to how this material is interpreted.',
  citations: [
    cite('ozette-museum', 'Complete visible Ozette Archaeological Site body'),
  ],
  phases: [
    {
      year: 1969,
      label: 'Winter 1969–70: storm exposure',
      title: 'A bank slump exposed preserved wooden material',
      text: 'MCRC describes a storm exposing belongings at the village site. A hiker contacted the Makah Tribe, and the Tribe contacted Washington State University. This modern exposure is not the ancient burial event or the beginning of Makah knowledge of the place.',
      citations: [cite('ozette-museum', 'Storm exposure and contact sequence')],
    },
    {
      year: 1970,
      label: 'April 1970: collaborative excavation began',
      title: 'Study and care followed the community’s connection to the site',
      text: 'The museum dates the excavation’s start to April 1970. Its account places oral history alongside recovered evidence and states that the Tribe kept the collection on the reservation. It gives no exact museum-founding date here; that later institution is not silently assigned to April 1970.',
      citations: [
        cite('ozette-museum', 'Excavation start, oral history and collection custody'),
      ],
    },
  ],
};

/** Unkeyed for later integration; all original dimension texts stay exact. */
export const ozetteKnowledgeDimension: Subject['dimensions'][string] = {
  text: 'The Tribe’s public canoe account connects cedar shaping, heat, grain strength and replaceable wear-protection. Ozette’s preserved wooden material supports questions about making and maintenance; oral history and community custody shape the inquiry. The later photograph does not document the whole sequence or a specific excavated canoe.',
  citations: [
    cite('makah-canoes', 'Makah Canoe Construction'),
    cite('ozette-museum', 'Preservation, oral history and tribal custody'),
    cite('makah-loc', 'Retained 27 October catalogue scope'),
  ],
};

export function applyKnowledgeOzette(c: Corpus): void {
  const subject = c.subjects.find((row) => row.id === 'ozette-makah');
  if (!subject) throw Error('Missing preserved Ozette dossier');
  for (const [id, text] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw Error(`Missing prior source ${id}`);
    const marker = 'Selected 29 October 2026 Ozette renewal:';
    if (!source.scope.includes(marker))
      source.scope = `Prior consultation (2026-10-27) retained: ${source.scope} ${marker} ${text}`;
    if (id === 'ozette-museum' && !source.scope.includes('4 November')) {
      source.scope +=
        ' On 4 November the oral history and reported radiocarbon age were checked against the museum’s account.';
    }
    source.accessed = id === 'ozette-museum' ? '2026-11-04' : consulted;
  }
  c.contexts ??= [];
  const context = c.contexts.findIndex((row) => row.id === ozetteKnowledgeContext.id);
  if (context < 0) c.contexts.push(ozetteKnowledgeContext);
  else c.contexts[context] = ozetteKnowledgeContext;
  subject.contextIds = [
    ...new Set([...(subject.contextIds ?? []), ozetteKnowledgeContext.id]),
  ];
  const title = 'A sequence of material decisions';
  subject.sections = [
    ...subject.sections.filter((row) => row.title !== title),
    sec(
      title,
      'Read the Tribe’s construction account in three stages: shape cedar, use steam to flare the sides, then protect the edges that take wear. The account explains why retaining the grain matters and identifies replaceable hardwood gunwales on canoe sides found at Ozette. Making was not finished forever when a canoe first floated: parts could wear and be renewed. This sequence is publicly described knowledge, not a reconstruction of the boat in the later photograph.',
      cite('makah-canoes', 'Makah Canoe Construction'),
    ),
  ];
  subject.deeperReading = [
    sec(
      'A material sequence is not a newly recovered scene',
      'The Tribe’s public account explains how steam and wood grain connect: flaring softened sides avoids weakening them by cutting across the grain. It also names protective strips that could be replaced after paddling wear. These are reasons for choices and maintenance, rather than a picture of one recorded carver’s day. Only the gunwale statement is explicitly attached to Ozette finds in this passage. Neither the account nor the preserved later photograph supplies the dimensions, maker, work duration or full history of a particular excavated canoe.',
      cite('makah-canoes', 'Makah Canoe Construction'),
    ),
    sec(
      'Custody and permission are part of interpretation',
      'The Makah museum presents the recovered collection through oral history and the Tribe’s desire to care for and interpret it. The museum connects the houses and household objects to a place Makah people remember and care for today. The setting and the age of the slide answer different questions. Researchers have proposed different calendar dates for the burial. A later photograph can show a canoe at the time the camera was used, while the excavated fittings carry evidence of earlier work.',
      cite('ozette-museum', 'Tribal collection custody and interpretation'),
      cite('ozette-dating-discussion', 'Printed p. 84, contrasting burial estimates'),
      cite('ozette-architecture', 'Retained 27 October burial/architecture scope'),
      cite('ozette-wsu', 'Retained 27 October event-correlation scope'),
      cite('makah-loc', 'Retained 27 October photograph scope'),
    ),
  ];
  subject.evidenceReading = {
    title: 'Shape, steam and replace: read a public material-work account',
    introduction:
      'These three editorial paraphrases form a material-work reading sequence. They use the Tribe’s public explanation, not a copied plan, new experiment or instruction to reproduce a cultural object.',
    items: ozetteMaterialWorkSequence,
  };
  subject.familyActivity = {
    title: 'A part that can be renewed',
    duration: 'About 8 minutes',
    steps: [
      'Look at the later photograph. Describe the person, long pole and boat without calling it a view of the buried village. Keep its qualified place and later date attached.',
      'Read this capsule from the Tribe’s public account: makers hollowed red cedar, then steamed the sides so they could flare while retaining the strength of the grain. Canoe sides found at Ozette had protective hardwood edge strips called gunwales. The strips took paddling wear and were easy to replace.',
      'Make three text cards: “shape,” “change with heat” and “protect and replace.” Put the capsule’s statements in order. Explain why a replaceable strip could help maintain a canoe. Which parts of this sequence can the photograph alone prove?',
    ],
    explanation:
      'The capsule supplies the sequence and the grain-strength explanation. Replacing a worn protective strip could renew that part without replacing the whole side. The photograph permits a description of a later boat and named person; it cannot show past heating, prove the construction sequence or identify an excavated Ozette canoe. The task uses public explanatory text without copying a design or carrying out a construction procedure.',
  };
  subject.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author checking; not independent historian or Makah community approval',
    scope:
      'The Tribe’s public account explains canoe construction and the care of the collection. The 4 November review pairs the museum’s description of the slide with the archaeological dating discussion on printed p. 84 of Gavin and colleagues’ report. The modern excavation has a separate chronology.',
    limitations: [
      'The c. 1560/1700 burial alternatives and 500±50 BP remain distinct reported claims; no new calendar conversion, assay inspection, calibration or earthquake correlation is performed. Village life and contemporary Makah knowledge are not reduced to a disaster date.',
      'The SAH, WSU and Library of Congress pages returned 403 during this consultation and were not retried or bypassed. Their complete 27 October source records, access dates and qualifications remain unchanged. Only the museum and Tribe’s accessible public bodies receive selected renewals.',
      'The later photograph was actually inspected but not freshly verified against an accessible LOC catalogue. Exact exposure place/date, boat identity and a connection to any excavated specimen remain qualified; all original rights/date fields and image bytes are retained.',
      'The material-work sequence is a paraphrase of a public tribal account, not a copied plan, source geometry, experimental reconstruction or permission to reproduce restricted knowledge. No new image, annotation, route, numeric locator, museum reproduction or visit instruction is supplied. A stale closure banner is not current visiting advice.',
    ],
  };
}
