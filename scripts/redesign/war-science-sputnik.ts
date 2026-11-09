import type { Corpus, HistoricalContext, Journey, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const sputnikScienceSources: Source[] = [
  {
    id: 'sputnik-korolev-proposal',
    title:
      'Proposals of First Launches of Artificial Earth Satellites before the Beginning of the International Year of Geophysics [1957]',
    author: 'Sergey P. Korolev; obtained, edited and translated by Asif A. Siddiqi',
    institution: 'NASA History Office, English translated document edition',
    url: 'https://www.nasa.gov/history/sputnik/russ4.html',
    type: 'primary',
    published: '1957-01-05 proposal; NASA edition last updated 2007-08-01',
    accessed: consulted,
    scope:
      'Editorial introduction, opening request, delay paragraphs and numbered proposals 1–4 actually read. This is Siddiqi’s credited English edited translation, not a newly collated Russian facsimile. Proposed April–June launches, interministerial coordination, tracking and press information are requests; they do not prove completion. Its incorrect account of a supposed September 1956 US satellite attempt is not adopted as US history; Siddiqi’s separate historical essay identifies that intelligence as erroneous. Technical propulsion/trajectory specifications are not reproduced as an engineering guide. No document image/audio copied; original manuscript pixels and source-image reuse rights not established.',
  },
  {
    id: 'sputnik-siddiqi-igy',
    title: 'Korolev, Sputnik, and The International Geophysical Year',
    author: 'Asif A. Siddiqi',
    institution:
      'NASA-hosted historical essay; Reconsidering Sputnik conference proceedings',
    url: 'https://www.nasa.gov/history/sputnik/siddiqi.html',
    type: 'scholarship',
    published: '1997 conference paper; NASA HTML edition date unverified',
    accessed: consulted,
    scope:
      'Selected Conception/IGY, Labor and Birth passages: Object D delay versus simpler PS-1; battery and transmitter specialization; calculation/testing/tracking work; official naming/secrecy and the dated public announcement. NTRS 19980003950 catalogue confirms proceedings publication 1 October 1997 and public distribution; it labels the collection US-government public-use material while the indexed individual paper carries ©1997 Siddiqi, so no figure/artwork reuse is inferred. Linked Russian archival records, memoirs, bibliography and full proceedings were not independently read. Reconstructed feelings, personnel dialogue and memoir quotations are not newly verified contemporary speech. No operational recipe, whole-program labor census or individual worker’s conditions inferred.',
  },
  {
    id: 'sputnik-commons-1957',
    title: 'Earth Satellites, House of Commons, 29 October 1957',
    institution: 'UK Parliament, Historic Hansard',
    url: 'https://api.parliament.uk/historic-hansard//commons/1957/oct/29/earth-satellites',
    type: 'primary',
    published: '1957-10-29 debate; modern digital transcription',
    accessed: consulted,
    scope:
      'HC Deb vol. 575, columns 30–32, questions 49–50 and follow-ups actually read. Mr Bottomley and Sir I. Fraser ask different questions; the Prime Minister’s replies describe IGY observations and distinguish strategic rocket capacity from the satellite. Claims of observations beginning within 24 hours and their interpretation are attributed official statements, not independently audited observing logs or the opinion of the British population. Satellite and accompanying carrier rocket remain distinct. No original audio or parliamentary-page facsimile inspected; no illustration reused.',
  },
  {
    id: 'sputnik-pravda-catalogue',
    title:
      'Сообщение ТАСС о запуске первого искусственного спутника Земли. 5 октября 1957 г.',
    author: 'TASS; modern catalogue compiled by Vadim Bobrov',
    institution:
      'Electronic Library of Historical Documents; Russian State Library newspaper holdings identified',
    url: 'https://docs.historyrussia.org/ru/nodes/481352-soobschenie-tass-o-zapuske-pervogo-iskusstvennogo-sputnika-zemli-5-oktyabrya-1957-g',
    type: 'archive',
    published: 'Pravda 1957-10-05, no. 278(14307), p.1; record compiled 2025-02-12',
    accessed: consulted,
    scope:
      'Catalogue fields actually read: TASS authorship, Pravda date/issue/page, Russian State Library newspaper department and source edition First Piloted Flight, book 1, 2011. Announcement scan link cache-missed; no full Russian announcement transcription, newspaper-pixel inspection or independent English translation claimed. A second EBID record reproduces the bibliography of a 1971 TASS/central-press compilation; that complete collection was not read. No scan or rights-cleared image adopted.',
  },
  {
    id: 'sputnik-garf-commemoration',
    title: 'Интернет-проект «Советский спутник – первый в мире!»',
    institution: 'State Archive of the Russian Federation (GARF)',
    url: 'https://statearchive.ru/953',
    type: 'archive',
    published: '2017-11-22 modern project notice',
    accessed: consulted,
    scope:
      'Selected dated project description and its short Russian quotation attributed to the TASS launch announcement actually read. This modern archive notice frames the achievement as a contribution to world science and culture; the claim is attributed rhetoric, not a measured social-benefit outcome. English wording is an editorial paraphrase of the exposed Russian, not a new critical translation. The linked Rosarkhiv project timed out and RGANTD inventory returned 502; none of its 192 documents or audio/film is claimed newly inspected. No image/scan copied; page copyright does not supply an open illustration licence.',
  },
];

export const sputnikScienceContext: HistoricalContext = {
  id: 'sputnik-work-observation-context',
  title: 'Satellite projects, observation and institutions: selected 1955–1958 records',
  region: 'West/Central Asia',
  interval: {
    start: 1955,
    end: 1958,
    label: 'Selected satellite planning, launch and institutional responses, 1955–1958',
    precision: 'approximate',
    note: 'A bounded reference inquiry around an exact 1957 event, not the lifetime of Sputnik 1 or a complete 1945–1991 Cold War account. The registry’s broader institutional framework remains open. Later webpage editions, archive catalogues and anniversary exhibits are source-publication clocks, not ancient/event phases.',
  },
  summary:
    'An international scientific program gave satellite work a shared timetable while state priorities organized funding, secrecy and competition. A proposal, a completed launch and later arguments about observation or institutions establish different things.',
  subjectIds: ['sputnik'],
  citations: [
    cite('sputnik', 'Background;1957–1958 timeline'),
    cite('sputnik-korolev-proposal', 'Opening request;proposals 1–4'),
    cite('sputnik-commons-1957', 'HC Deb 575,cc 30–32'),
  ],
  phases: [
    {
      year: 1955,
      label: '1955: a public US satellite program for the IGY',
      title: 'A common scientific timetable also became competitive',
      text: 'NASA’s account dates the White House satellite announcement to July 1955 and the Vanguard selection to September. These are program decisions before the launch; the IGY itself ran from July 1957 through December 1958.',
      citations: [cite('sputnik', 'Background:IGY and 1955 program')],
    },
    {
      year: 1957,
      label: 'January 1957: Korolev requests a simpler project',
      title: 'A plan names organizations and a hoped-for date',
      text: 'The 5 January proposal requests April–June launches, coordination across ministries and a radio/optical tracking system. The launch actually occurred in October. Proposed work and completed work must be checked against different records.',
      citations: [
        cite(
          'sputnik-korolev-proposal',
          'Editorial introduction;opening request;proposals 1–4',
        ),
      ],
    },
    {
      year: 1957,
      label: 'October 1957: launch, announcement and observation',
      title: 'One event entered several institutional arguments',
      text: 'The 4 October launch is distinct from the Pravda announcement catalogued for 5 October and the 29 October Commons debate. The debate records both observation work and disagreement over national priorities, without standing for all British responses.',
      citations: [
        cite('sputnik', 'Opening'),
        cite('sputnik-pravda-catalogue', 'Pravda 1957-10-05,p.1'),
        cite('sputnik-commons-1957', 'HC Deb 575,cc 30–32'),
      ],
    },
    {
      year: 1958,
      label: '1958: new US institutions; IGY continues',
      title: 'Institutional changes followed rather than defined the launch',
      text: 'NASA’s timeline distinguishes the July Space Act, NASA opening in October and the IGY ending in December. These later decisions belong to the reference frame; the case retains its exact 1957 launch interval.',
      citations: [
        cite('sputnik', 'Background;1958 timeline:July 29,October 1,December 31'),
      ],
    },
  ],
};

export const sputnikWorkDimension = {
  text: 'A simpler spacecraft still required specialized components, calculation, testing and ground observation. The proposal’s coordination requests and the later technical history expose organization; neither supplies every technician’s conditions or proves that priority brought equal benefits.',
  citations: [
    cite('sputnik-korolev-proposal', 'Proposals 1–3'),
    cite('sputnik-siddiqi-igy', 'Labor;Birth:selected component and tracking passages'),
  ],
};

export const sputnikFamilyEvidence: NonNullable<Journey['familyEvidence']> = {
  title: 'A plan, an event and a response',
  object: null,
  text: 'On 5 January 1957 Korolev requested permission for simpler satellite launches in April–June and asked for ministries, scientists and tracking equipment to be coordinated. Sputnik 1 launched on 4 October. A Commons debate on 29 October asked about Britain’s priorities and described work observing the satellite and its carrier rocket. These are paraphrases of a credited English translation, NASA’s chronology and a parliamentary transcription. The January request does not certify that its schedule was met; the debate is not everyone’s opinion.',
  citations: [
    cite('sputnik-korolev-proposal', 'Opening request;proposals 1–3'),
    cite('sputnik', 'Opening'),
    cite('sputnik-commons-1957', 'Questions 49–50;replies,cc 30–32'),
  ],
  notice: [
    'Find the proposed date and the actual launch date.',
    'Name one kind of work the proposal asks people to organize.',
  ],
  claimPrompt:
    'Explain why a proposal and a completed launch need different evidence. Use the dates and one named kind of work in the capsule.',
  returnPrompt:
    'When another case announces a goal, ask which later record could show what was achieved.',
  feedback:
    'The January text establishes a request and its intended schedule; the launch chronology establishes an event. Tracking or parliamentary records then show situated observation and interpretation. None establishes that every observer agreed or benefited.',
};

export function applyWarScienceSputnik(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'sputnik');
  if (!s) throw new Error('Sputnik continuation requires the existing dossier');
  for (const row of sputnikScienceSources) {
    const i = c.sources.findIndex((v) => v.id === row.id);
    if (i < 0) c.sources.push(row);
    else c.sources[i] = row;
  }
  for (const id of ['sputnik', 'sputnik-records']) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw new Error(`Missing retained source ${id}`);
    const marker = `Sputnik selected consultation, ${consulted}: `;
    if (!source.scope.includes(marker)) {
      const scope =
        id === 'sputnik'
          ? 'Opening, Background and selected 1955–1958 timeline entries reread: exact 4 October launch, IGY timetable, US program decisions and NASA institutional dates. The image caption explicitly identifies a replica; no image pixels, launch footage or audio recording were inspected or adopted. Broad claims about a homogeneous public response are not used as a universal opinion survey. No full linked publications/bibliography read.'
          : 'Online catalogue descriptions reread, especially the October 1957 National Science Board response,NAID 12060499 and distinct dated conference/press records. One-page statement PDF opened but this browser text route exposed no body; a screenshot request did not expose usable pixels in the returned capture. No actual statement wording, signature or original-page reading newly claimed. Archive introduction’s generalization about Americans is not adopted as every person’s response.';
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker}${scope}`;
      source.accessed = consulted;
    }
  }
  c.contexts ??= [];
  const i = c.contexts.findIndex((row) => row.id === sputnikScienceContext.id);
  if (i < 0) c.contexts.push(sputnikScienceContext);
  else c.contexts[i] = sputnikScienceContext;
  s.contextIds = [...new Set([...(s.contextIds ?? []), sputnikScienceContext.id])];
  s.summary =
    'Sputnik 1’s radio signal joined spacecraft, ground observers and competing institutions. Soviet planners simplified a delayed scientific project, then organized a launch that also drew political attention. A translated proposal, technical history and British parliamentary debate show different kinds of work and interpretation around the exact 1957 event.';
  s.sections = [
    sec(
      'A signal depended on work on Earth',
      'On 4 October 1957 the Soviet Union placed Sputnik 1 in orbit. Its radio transmission could be monitored from the ground. Making that signal possible required more than assembling a sphere: people had to supply power, build transmitters, calculate motion and check whether a launch had achieved an orbit. Scientific observation and state competition shared parts of this infrastructure. NASA places the launch within the International Geophysical Year, whose coordinated investigations gave scientists a timetable extending through 1958.',
      cite('sputnik', 'Opening;Background:IGY'),
      cite('sputnik-siddiqi-igy', 'Labor;Birth:selected calculation/tracking passages'),
    ),
    sec(
      'Simplifying the spacecraft changed the organization',
      'Historian Asif Siddiqi distinguishes the delayed, more elaborate Object D scientific satellite from the simpler PS-1 that became Sputnik 1. The smaller project concentrated manufacture in Korolev’s design bureau while specialist organizations supplied batteries and radio transmitters. Simplification changed the tasks and dependencies; it did not remove them. A component had to work with other components, and tests had to connect the spacecraft with ground equipment. This is a history of coordinated technical choices rather than a single inventor acting alone.',
      cite(
        'sputnik-siddiqi-igy',
        'Labor:PS-1 component organizations;Birth:radio testing',
      ),
    ),
    sec(
      'The Soviet proposal made a request, not a result',
      'In the 5 January 1957 proposal, Korolev sought permission for launches in April–June. The credited English translation asks for ministries and scientists to cooperate, a coordination commission and equipment for radio and optical tracking. Those requests reveal what planners wanted organized. October’s actual launch also reveals that the hoped-for schedule was not the outcome. A separately catalogued TASS announcement appeared in Pravda on 5 October. GARF’s later project notice quotes its claim to benefit world science and culture. That is a public claim of significance, separate from evidence of the launch or its benefits.',
      cite('sputnik-korolev-proposal', 'Opening request;proposals 1–4'),
      cite('sputnik-pravda-catalogue', 'Pravda 1957-10-05,p.1'),
      cite(
        'sputnik-garf-commemoration',
        'Dated project notice;attributed TASS quotation',
      ),
    ),
    sec(
      'Observers argued about what the achievement meant',
      'The 29 October Commons debate supplies a response outside the US archive. Questions about Britain falling behind met a reply emphasizing observations for the IGY, including radio astronomy. The Prime Minister distinguished the satellite from the strategic possibilities of its carrier rocket. A scientific observation, an argument about resources and a security concern could therefore surround the same event. These speakers do not stand for everyone in Britain, the Soviet Union or elsewhere. Their differences give us a way to investigate political meaning without assuming one worldwide reaction or an automatic improvement in everyday life.',
      cite(
        'sputnik-commons-1957',
        'Questions 49–50 and follow-ups,HC Deb 575,cc 30–32',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'Follow the work beyond the visible object',
      'The sphere attracts attention, but the records distribute the work among component producers, coordinating bodies and observers. The proposal treats tracking equipment as part of preparing the project, rather than an optional response after launch. Hansard then records the Prime Minister describing British observation work on both the satellite and its accompanying rocket. Keeping these objects distinct matters: a sighting or tracking claim needs an identified target. The debate can establish what an official reported, while an observing log would be needed to check a particular instrument’s detection.',
      cite('sputnik-korolev-proposal', 'Proposal 3:tracking'),
      cite('sputnik-commons-1957', 'Observations and carrier-rocket replies,cc 31–32'),
    ),
    sec(
      'Read each source at its own date and for its purpose',
      'The January request aimed to obtain authority and resources before the launch. Its foreign-intelligence claims are not automatically correct: Siddiqi identifies the supposed 1956 US satellite attempt as erroneous. The later historical essay uses records and memoirs that became available after the event; this account does not turn its reconstructed dialogue into a newly heard 1957 recording. The Russian catalogue identifies a 5 October newspaper publication, while GARF’s dated 2017 notice is an anniversary interpretation. Their relationship helps explain how evidence travels through translation, cataloguing and commemoration. It does not merge all these stages into one original artifact. A fuller account needs workers’ records, Soviet and other publics’ varied responses, and the broader institutions of the Cold War; the selected 1955–1958 frame leaves those tasks visible.',
      cite('sputnik-korolev-proposal', 'Editorial credit;US-intelligence paragraphs'),
      cite('sputnik-siddiqi-igy', 'Labor:erroneous intelligence;historical method'),
      cite('sputnik-pravda-catalogue', 'Document/source-edition/catalogue dates'),
      cite('sputnik-garf-commemoration', '2017-11-22 notice'),
    ),
  ];
  s.evidenceReading = {
    title: 'Request, announcement and parliamentary response',
    introduction:
      'The supplied English account distinguishes a translated planning document, archive metadata and a parliamentary transcription. No original Soviet broadcast, complete newspaper scan or worker interview has been newly inspected.',
    items: [
      {
        label: 'A proposal has an intended future',
        text: 'Korolev’s 5 January request names April–June launches and coordination/tracking tasks. The actual launch date is 4 October.',
        interpretation:
          'The mismatch lets us distinguish an intended schedule from a completed event. The request supplies organizational aims, not proof that every proposed arrangement worked as written.',
        citations: [
          cite('sputnik-korolev-proposal', 'Opening request;proposals 1–3'),
          cite('sputnik', 'Opening'),
        ],
      },
      {
        label: 'An announcement also claims significance',
        text: 'The Russian catalogue identifies a TASS announcement in Pravda on 5 October. GARF’s 2017 notice quotes its claim of a contribution to world science and culture.',
        interpretation:
          'The catalogue dates a publication and the notice supplies attributed rhetoric. Neither proves equal worldwide benefit or replaces inspection of the complete 1957 newspaper page.',
        citations: [
          cite('sputnik-pravda-catalogue', 'Pravda date/issue/page fields'),
          cite('sputnik-garf-commemoration', 'Attributed TASS quotation'),
        ],
      },
      {
        label: 'The debate contains more than one question',
        text: 'Commons questions concern national priorities and observation. The reply separates scientific tracking from the carrier rocket’s potential strategic effect.',
        interpretation:
          'These are named institutional positions in a dated exchange, not a poll of British people or evidence that every visible object was the satellite itself.',
        citations: [
          cite('sputnik-commons-1957', 'Questions 49–50 and follow-ups,cc 30–32'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Sort a plan, an event and an interpretation',
    duration: 'About 10 minutes',
    steps: [
      'Read the supplied source capsule and make three headings: proposed work, completed event and response.',
      'Place the January request, October launch and Commons exchange under the headings. Compare the hoped-for date with the actual one.',
      'Name one job or coordination task. Explain why completing a spacecraft also required work on the ground.',
      'Write one supported sentence and one further question about who benefited. Do not invent a technician’s words or claim everyone reacted alike.',
    ],
    explanation: `Source capsule — editorial paraphrase: ${sputnikFamilyEvidence.text} This text supplies the dates and tasks needed; no absent photograph, sound recording or historical role-play is required.`,
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian, Soviet/Russian-community or family acceptance',
    scope:
      'Organized technical work, a credited translated Soviet proposal, Russian institutional publication metadata/commemoration and one non-US parliamentary reception. Five new selected source records and two precisely retained-and-renewed catalogue/overview scopes. Original exact 1957 interval/label/note/precision, claims, dimensions, identity, terms and empty object list preserved. No new image, route, map, relation or universal reception claim.',
    limitations: [
      'The registry’s 1945–1991 Cold War reference remains open. This selected 1955–1958 frame is a bounded implementation proposal, not coverage of the entire Cold War, all scientific institutions or every Soviet republic’s experience.',
      'NASA hosts Siddiqi’s credited English edited translation. The original Russian proposal and cited archival records were not independently collated. Incorrect intelligence about a supposed 1956 US satellite attempt is not adopted as US history.',
      'Direct Russian institutional consultation comprises the EBID catalogue and GARF’s 2017 notice. The Pravda scan cache-missed, Rosarkhiv pages timed out and RGANTD returned 502. No complete 1957 announcement, original broadcast/audio, technical drawing or 192-document project inspection is claimed.',
      'The Eisenhower Library statement is retained as catalogue-level consultation. Its one-page PDF exposed no usable body/pixels in this route; no fresh National Science Board quotation or signature reading is supplied.',
      'Hansard records particular questions and official replies, not all British people’s responses or independently checked observing logs. Christchurch library access presented robot verification; newspaper search snippets are not adopted as full articles.',
      'The dossier has no existing media and none is added. NASA’s replica caption does not date a photograph or establish an original-flight image. TASS’s 2017 simulated broadcast is not a 1957 recording. No rights-cleared new image, audio or diagram is promised.',
      'Workers’ conditions, varied Soviet/Kazakh and other publics’ responses and broader postwar institutions need further source work. Independent historical/community review, family usability, screen-reader/device behavior and physical printing remain open.',
    ],
  };
}
