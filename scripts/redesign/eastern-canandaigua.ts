/** Output-only leaf proposal. The complete inherited case and media stay intact. */
import type { Corpus, HistoricalContext, Source, Subject } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const canandaiguaCommunitySources: Source[] = [
  {
    id: 'canandaigua-washington-orders-1779',
    title: 'George Washington to Major General John Sullivan, 31 May 1779',
    author:
      'George Washington; scholarly transcription edited by the Washington Papers project',
    institution: 'Founders Online, National Archives / University of Virginia Press',
    url: 'https://founders.archives.gov/documents/Washington/03-20-02-0661',
    type: 'primary',
    published: '1779-05-31',
    accessed: consulted,
    scope:
      'Actual letter title/date; opening orders concerning settlements and crops; later paragraphs on peace negotiation and limited authority; source/editorial notes. The official page cites Revolutionary War Series 20, pp.716–719; the printed volume and original manuscript pixels were not independently consulted. Instructions establish intentions, not completion or universal experience of all Six Nations. The historical letter is public-domain text; modern editorial annotations explicitly retain University of Virginia copyright. No facsimile, modern annotation, numerical destruction total, source hostile characterization or route geometry copied.',
  },
  {
    id: 'canandaigua-oneida-cloth',
    title:
      'Treaty of Canandaigua Anniversary Nov. 11: cloth and a continuing relationship',
    institution: 'Oneida Indian Nation',
    url: 'https://www.oneidaindiannation.org/treaty-of-canandaigua-anniversary-nov-11',
    type: 'primary',
    accessed: consulted,
    scope:
      'Actual short official page body: anniversary, reported annual treaty/annuity cloth and diminished individual share as a continuing government-to-government symbol. The prior dotcom URL redirects to the Nation’s dotorg domain. Original publication date is not established; copyright 2026 is not a historical delivery date. This is a particular Nation’s public account, not an independently audited every-year/all-nations delivery series. Oldest-valid-treaty ranking and simplified Washington-signing language are not adopted as independent chronology or legal conclusions. Copyright retained; no open reuse licence verified, short attributed paraphrase only and no photo or cloth sample copied.',
  },
  {
    id: 'canandaigua-onondaga-belt',
    title: 'George Washington Belt: Onondaga account of diplomatic meaning',
    institution: 'Onondaga Nation',
    url: 'https://www.onondaganation.org/culture/wampum/george-washington-belt/',
    type: 'primary',
    accessed: consulted,
    scope:
      'Selected actual public introduction, diplomatic-protocol explanation and figure/longhouse description expressing peace and friendship. No belt image pixels inspected/reused or independent manufacture/transfer date established. The page’s simplified belt/paper ratification sequence, Congress terminology and Manifest Destiny wording are not adopted as independently verified procedure or eighteenth-century terminology. No open licence established; attributed explanation only, no belt recreation, pattern tutorial or claim of unrestricted cultural authority. Online publication date unknown.',
  },
  {
    id: 'onondaga-powless-return-1989',
    title: 'The Day that 12 Wampum Belts Returned to Onondaga',
    author: 'Chief Irving Powless Jr.',
    institution: 'Onondaga Nation',
    url: 'https://www.onondaganation.org/culture/the-day-that-12-wampum-belts-returned-to-onondaga/',
    type: 'primary',
    accessed: consulted,
    scope:
      'Actual heading/account date 21 October 1989 and byline; opening Albany agreement account, practical longhouse preparation, arrival/custody, named officials, collar return and responsibility for interpretation. Ceremonial descriptions encountered in the exposed page are excluded from adoption; no song, sacred speech or performance instructions copied. Embedded video and photo pixels not inspected. This participant account does not establish every belt’s return, the complete inventory or fulfillment of every treaty obligation; the transfer agreement was not independently read. Online publication date unknown and distinct from the account date. Copyright retained; no open reuse licence established; short attributed paraphrase only.',
  },
];

export const canandaiguaDiplomacyContext: HistoricalContext = {
  id: 'canandaigua-recovery-negotiation-context',
  title: 'War damage, negotiation and the material work of peace',
  region: 'Americas',
  interval: {
    start: 1779,
    end: 1795,
    label: 'Selected war-to-ratification frame, 1779–1795 CE',
    precision: 'range',
    note: 'A selected window connecting dated destructive orders, the treaty and its separate U.S. ratification. It is not the founding, ending or complete history of the Haudenosaunee. The whole 1794–1795 case interval stays unchanged. The 1989 custody account and undated present Nation accounts are later evidence clocks outside this frame.',
  },
  summary:
    'Destroying crops and homes threatened the work sustaining communities. Negotiation addressed land, peace, supplies and complaint procedures. Putting agreements into practice required further actions that the written treaty alone cannot establish.',
  subjectIds: ['haudenosaunee-canandaigua'],
  citations: [
    cite(
      'canandaigua-washington-orders-1779',
      '31 May 1779, opening settlement/crop orders',
    ),
    cite('canandaigua-onondaga', 'Haudenosaunee Decision; Articles II,VI,VII'),
    cite('canandaigua-archive', 'Creation date and Contains: treaty and ratification'),
  ],
  phases: [
    {
      year: 1779,
      label: '31 May 1779: instructions target settlements and crops',
      title: 'Read an order as an intended action',
      text: 'Washington instructed Sullivan to destroy settlements, ruin crops and prevent further planting. The letter establishes this program; Powless’s separate Onondaga account describes damage and displacement. The order is not itself an inventory of completed destruction.',
      citations: [
        cite('canandaigua-washington-orders-1779', 'Opening orders;31 May 1779'),
        cite('canandaigua-onondaga', 'Sullivan Campaign'),
      ],
    },
    {
      year: 1794,
      label: '11 November 1794: treaty commitments are recorded',
      title: 'Peace includes land, material support and redress',
      text: 'The treaty records peace and land acknowledgments, provision for continuing purchases and skilled work, and a complaint procedure. These are commitments with specified roles, rather than proof of all later conduct.',
      citations: [
        cite('canandaigua-onondaga', 'Articles I–III,VI,VII and dated signature block'),
      ],
    },
    {
      year: 1795,
      label: '21 January 1795: a separate U.S. ratification',
      title: 'One archival recto carries distinct dated actions',
      text: 'The archive identifies the incorporated 1794 treaty and an instrument signed by Washington and Randolph on 21 January 1795. The document’s opening heading does not move the negotiations into 1795 or make ratification evidence of complete performance.',
      citations: [
        cite(
          'canandaigua-archive',
          'Contains entry; full recto and lower ratification',
        ),
      ],
    },
  ],
};

export const canandaiguaWorkDimension: Subject['dimensions'][string] = {
  text: 'The agreement linked peace to land, supplies and skilled work; Nation accounts describe continuing care and responsibilities. Promised provision and documented practice need different evidence.',
  citations: [
    cite('canandaigua-onondaga', 'Articles II,VI,VII'),
    cite('canandaigua-oneida-cloth', 'Annual treaty cloth and its meaning'),
    cite(
      'onondaga-powless-return-1989',
      'Albany agreement, preparation and custody account',
    ),
  ],
};

export function applyEasternCanandaigua(c: Corpus): void {
  c.contexts ??= [];
  const renewals = {
    'canandaigua-archive':
      'Actual exposed IDA metadata: NAID 12013172, creation date, Contains naming the 1794 treaty and21 January 1795 ratification, and partnership description. Existing local full 1021×1600 recto pixels actually inspected, including documentary layout, names/seals and lower ratification. No fresh remote PDF/verso pixels, independent manuscript transcription or modern scan date verified. Original full media record, public-domain reproduction metadata and image bytes retained.',
    'canandaigua-onondaga':
      'Actual Bradley Powless byline; Sullivan Campaign and Haudenosaunee Decision sections; preamble, Articles I–III,VI,VII, concluding annuity note and dated signature block. Community framing remains attributed, and the treaty’s prescribed acts remain separate from later conduct. Broad opening narrative not adopted wholesale; no numerical loss estimate, universal neutrality, contemporary legal ruling or Manifest Destiny period-term claim. No linked image pixels or belt reproduction used.',
    'onondaga-wampum':
      'Actual opening public prose on shaping/drilling beads, speakers and remembered agreements, council invitations, title responsibilities and custody/return lead. Belt-index descriptions encountered but no image pixels, ceremonial text, pattern transcription or making/performance instructions adopted. A public account does not establish open reuse rights or community approval of this atlas.',
  };
  for (const [id, text] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw Error(`Missing inherited Canandaigua source: ${id}`);
    const marker = `Eastern selected renewal, ${consulted}: `;
    if (!source.scope.includes(marker)) {
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker}${text}`;
      source.accessed = consulted;
    }
  }
  for (const source of canandaiguaCommunitySources) {
    const existing = c.sources.find((row) => row.id === source.id);
    if (existing && JSON.stringify(existing) !== JSON.stringify(source))
      throw Error(`Canandaigua source identity collision: ${source.id}`);
    if (!existing) c.sources.push(source);
  }
  const context = c.contexts.find((row) => row.id === canandaiguaDiplomacyContext.id);
  if (
    context &&
    JSON.stringify(context) !== JSON.stringify(canandaiguaDiplomacyContext)
  )
    throw Error('Canandaigua context identity collision');
  if (!context) c.contexts.push(canandaiguaDiplomacyContext);
  const s = c.subjects.find((row) => row.id === 'haudenosaunee-canandaigua');
  if (!s) throw Error('Missing inherited Canandaigua case');
  s.contextIds = [
    ...new Set([...(s.contextIds ?? []), canandaiguaDiplomacyContext.id]),
  ];
  s.summary =
    'Peace needed material work: protecting land, supplying goods, supporting skills and handling complaints. The Canandaigua document records commitments; Nation accounts explain speakers, wampum, cloth and continuing care. Reading these together distinguishes a promise from particular actions taken to maintain a relationship, without claiming that every commitment was fulfilled.';
  s.sections = [
    sec(
      'A household’s food supply could become a military target',
      'Washington’s 31 May 1779 instructions to Sullivan targeted settlements, crops and the ability to plant again. This was an intended attack on the work sustaining communities. Bradley Powless’s Onondaga account separately describes damaged homes and food stores, displacement and the later decision to negotiate. Reading order and community account together connects diplomacy with the practical question of sustaining life. The instruction itself does not establish how much was destroyed or make every Nation’s wartime experience identical.',
      cite(
        'canandaigua-washington-orders-1779',
        'Opening orders: settlements, crops and planting',
      ),
      cite('canandaigua-onondaga', 'Sullivan Campaign; Haudenosaunee Decision'),
    ),
    sec(
      'Peace involved goods, tools and skilled work',
      'The treaty acknowledged particular lands and prescribed material support. Article VI described an annual allowance for clothing, domestic animals, agricultural implements and other utensils, and for skilled workers living with or near the communities. It assigned application of the allowance to a superintendent. These provisions joined farming, making and the maintenance of peace. Their wording identifies a promised arrangement and responsible role; a delivery record or account of work would be needed to investigate a particular implementation.',
      cite('canandaigua-onondaga', 'Articles II–III; Article VI and concluding note'),
    ),
    sec(
      'Bead-making and speaking carried political knowledge',
      'Onondaga explains that shell pieces were shaped, smoothed and drilled to make wampum beads. Speakers connected agreements with strings or belts, and later speakers used them to remember the agreement and subsequent history. Council invitations also carried information. Making, keeping and speaking were related forms of skilled work. The Nation’s account of the Washington Belt explains its figures and longhouse through peace and friendship. That explanation comes from the account; an outside viewer cannot decode every meaning independently.',
      cite(
        'onondaga-wampum',
        'Opening bead-making, living-record and council paragraphs',
      ),
      cite(
        'canandaigua-onondaga-belt',
        'Diplomatic protocol and figure/longhouse explanation',
      ),
    ),
    sec(
      'The manuscript records more than one dated action',
      'The archive identifies the treaty signed 11 November 1794 and a separate U.S. ratification signed 21 January 1795. The displayed recto incorporates treaty text, names and seals within that later instrument. Its opening Washington heading therefore does not move the original negotiation into 1795. Preserving both dates lets us ask who made commitments, how they were recorded and what additional action followed. Neither the document’s formal appearance nor its seals establish that all its terms were subsequently observed.',
      cite(
        'canandaigua-archive',
        'Contains entry and full recto: treaty/names/seals/lower ratification',
      ),
    ),
    sec(
      'A continuing relationship requires particular evidence',
      'The Oneida Indian Nation reports recurring treaty-cloth deliveries and describes their continuing political meaning. Chief Irving Powless Jr.’s 1989 account describes another particular action: bringing wampum belts home and preparing a place for their care. These accounts concern different materials and events. They show why fulfillment cannot be reduced to signing a page. Evidence of one practice or return does not establish every land commitment, settle every dispute or erase the distinct responsibilities of the nations involved.',
      cite(
        'canandaigua-oneida-cloth',
        'Annual cloth and diminished share as a continuing symbol',
      ),
      cite(
        'onondaga-powless-return-1989',
        'Opening agreement; preparation and arrival/custody account',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'A return can be described by a participant',
      'Chief Irving Powless Jr. dates his account 21 October 1989 and identifies the leaders who went to Albany to sign the return agreement. He describes arranging a table, benches and chairs in the longhouse, bringing food and receiving the belts. Care required preparation as well as a formal transfer. He also reports Chief Jake Thomas distinguishing the belts’ availability from the lengthy work of explaining them. This is a named participant’s account, not an independent inventory audit. Its practical custody passages can be discussed without reproducing the sacred songs or ceremonies also described on the public page. To trace the custody of a particular belt, a reader would also need the transfer agreement and an inventory identifying that belt.',
      cite(
        'onondaga-powless-return-1989',
        'Byline/date; Albany agreement; preparation; named officials; Jake Thomas explanation',
      ),
    ),
    sec(
      'Material evidence has a defined scope',
      'The public Oneida account treats cloth as a symbol of a continuing government-to-government relationship and notes that individual portions have diminished. This is more specific than saying that nothing happened after the treaty, but it is narrower than an audited record of every delivery. Article VII offers another kind of question: it prescribes complaints and redress instead of private retaliation. Investigating a particular injury would require records of that complaint and response. The treaty, a Nation’s public account and a delivery receipt could therefore contribute different evidence to the same inquiry. None alone establishes complete performance or provides a present-day legal ruling.',
      cite(
        'canandaigua-oneida-cloth',
        'Annual cloth; diminished member share and continuing relationship',
      ),
      cite('canandaigua-onondaga', 'Article VII: complaints and redress'),
    ),
  ];
  s.evidenceReading = {
    title: 'A commitment, a record of practice and a named account',
    introduction:
      'These supplied source capsules are editorial paraphrases. Faded manuscript writing is supported by identified transcriptions; no learner must recover an entire clause from the image.',
    items: [
      {
        label: 'Two actions within one archival object',
        text: 'IDA identifies the 1794 treaty and21 January 1795 ratification in the same archival file. The supplied recto contains treaty text, names/seals and lower ratification.',
        interpretation:
          'The visible form and metadata support a sequence of documentary actions. They do not prove implementation or merge negotiation, signing and ratification into one date.',
        citations: [
          cite('canandaigua-archive', 'Metadata, Contains and actual full recto'),
        ],
      },
      {
        label: 'A prescribed allowance and an attributed continuing practice',
        text: 'Article VI prescribes purchases and support for skilled workers. The Oneida Indian Nation reports annual cloth and describes its meaning to the Nation.',
        interpretation:
          'A text specifies a commitment; a particular Nation’s account reports a continuing practice. The latter is not an independent every-year audit, proof of all land commitments or evidence of one uniform experience across the Confederacy.',
        citations: [
          cite('canandaigua-onondaga', 'Article VI and concluding annuity note'),
          cite(
            'canandaigua-oneida-cloth',
            'Annual treaty cloth and continuing relationship',
          ),
        ],
      },
      {
        label: 'A participant describes a specific return',
        text: 'Chief Irving Powless Jr.’s account dated 21 October 1989 describes an agreement in Albany, preparation at Onondaga and the arrival of returned belts.',
        interpretation:
          'This offers named, situated testimony about custody work. It neither supplies the unconsulted transfer agreement nor authorizes recreating ceremonies or interpreting every belt without its keepers.',
        citations: [
          cite(
            'onondaga-powless-return-1989',
            'Date/byline; opening agreement; preparation and arrival',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What would show that a promise was carried out?',
    duration: '10–15 minutes',
    steps: [
      'Find the main writing, the columns of names and seals, and the lower ratification in the supplied image. Describe its form without guessing unreadable words.',
      'Use the capsule to label the 1794 treaty and 1795 U.S. ratification as separate actions.',
      'Place the allowance and the reported cloth deliveries in two columns: a written commitment and a public Nation account of practice. Explain why the records answer different questions.',
      'Choose one promised purchase or kind of skilled work. Name the dated receipt, work account or community testimony you would want to investigate that particular action.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the treaty was signed 11 November 1794; this file also contains U.S. ratification dated 21 January 1795. Article VI provided an annual allowance for clothing, domestic animals, tools and skilled workers. A separate public Oneida Indian Nation account reports recurring treaty-cloth deliveries and their continuing significance. A clause records a commitment; a reported practice is further evidence, with its own scope. Neither proves that every treaty promise was kept.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian, Haudenosaunee or family approval',
    scope:
      'The unchanged ratification recto, selected treaty clauses and attributed Onondaga/Oneida accounts connect diplomatic materials, practical work and evidence of particular continuing actions.',
    limitations: [
      'The whole original1794–1795 interval, note/precision, identity, coordinates, claims, object order, dimensions and full media record/pixels remain intact. The separate 1779–1795 reference does not date the nations’ existence or end the promises.',
      'Only selected institutional text and the existing local recto pixels were consulted. No new belt image, ceremony, source map, survey, remote archival byte comparison, original transfer agreement or independent all-year delivery audit supplied.',
      'The 1989 participant account and undated current Nation pages have their own clocks outside the historical reference frame. Simplified belt/paper procedural chronology and contemporary legal conclusions are not adopted as verified rulings.',
      'No new place study, inferred route or belt recreation is proposed. Independent specialist/community assessment, real family use, human accessibility/device checks and physical print acceptance remain open.',
    ],
  };
}
