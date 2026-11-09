/** Output-only source-qualified leaf. No image, route or current harvest rules added. */
import type { Corpus, HistoricalContext, Source, Subject } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';
export const ojibweManoominSources: Source[] = [
  {
    id: 'rice-treaty-1837',
    title: 'Treaty with the Chippewa, 29 July 1837: selected cession and rice clause',
    institution: 'Historical United States treaty text; GLIFWC document reproduction',
    url: 'https://glifwc.org/sites/default/files/uploads/documents/2024-11/TreatyChippewa07291837Print.pdf',
    type: 'primary',
    published: '1837-07-29',
    accessed: consulted,
    scope:
      'Actual selected extracted text from the three-page historical-document PDF: treaty heading/date, Article 1 cession lead, Article 5 rice clause, Article 6 and dated close. Printed p492 corresponds to PDFp2. Preceding treaty signatories and later lists encountered but not adopted. No source-page pixels or original manuscript independently inspected. Article 5 concerns particular U.S. ceded lands/rivers/lakes, not the unknown probably-Ontario photograph location or every later implementation/current legal outcome. The proclamation date shown separately is not the treaty’s signing date. Historical treaty text is public domain; no source-page image or modern design reused. The 2024 upload directory is not the historical or scan date.',
  },
  {
    id: 'rice-glifwc-institution',
    title: 'GLIFWC: creation, reserved rights and intertribal stewardship',
    institution: 'Great Lakes Indian Fish & Wildlife Commission',
    url: 'https://glifwc.org/about-us',
    type: 'primary',
    accessed: consulted,
    scope:
      'Actual selected opening 1984 creation/stewardship account, reserved-rights explanation and member-governance paragraph. The linked 1837 treaty was separately read at selected text scope. Other treaty PDFs, 1854 Senate report, films, books, pictographic petition, maps and current legal/regulatory generalizations were not independently consulted/adopted. The institution describes rights as retained, not newly given by the United States. Current page prose is not a 1913 witness account or the date community care began; no homogeneous government/treaty regime assigned to all Ojibwe peoples or Ontario waters. Copyright retained, publication date unknown; short attributed paraphrase and no image/video reuse.',
  },
];

export const ojibweManoominContext: HistoricalContext = {
  id: 'ojibwe-rice-rights-care-context',
  title: 'Manoomin work, selected treaty evidence and intertribal care',
  region: 'Americas',
  interval: {
    start: 1837,
    end: 1984,
    label:
      'Selected U.S. treaty, separate photograph and stewardship frame, 1837–1984 CE',
    precision: 'range',
    note: 'The bounds connect an 1837 U.S. treaty and the 1984 creation of GLIFWC; they do not date manoomin’s origins or all Ojibwe history. The whole original bracketed [1913] photographic case remains unchanged. Its probable Ontario setting is separate from the U.S. ceded territories; neither treaty jurisdiction nor a legal identity is assigned to the unnamed person. Later public accounts/brochure have their own dates and scopes.',
  },
  summary:
    'Gathering, finishing and caring for rice waters involve knowledge and repeated work. A treaty clause, an archival photograph and an intertribal institution document different aspects of that history without making every Great Lakes community one legal or political setting.',
  subjectIds: ['ojibwe-manoomin'],
  citations: [
    cite('rice-treaty-1837', 'Heading/date; Article 5, printed p.492/PDFp2'),
    cite(
      'rice-linde',
      'Actual catalogue: bracketed date and probable Ontario location',
    ),
    cite(
      'rice-glifwc-institution',
      'Opening1984 institutional account and reserved rights',
    ),
  ],
  phases: [
    {
      year: 1837,
      label: '29 July 1837: a particular treaty names gathering wild rice',
      title: 'Retained rights concern specified places and parties',
      text: 'Article 5 addresses hunting, fishing and gathering wild rice within the ceded territory. GLIFWC explains that the Ojibwe retained rights rather than receiving the origin of those rights from the United States. The text does not identify the later photograph’s setting or prove every implementation.',
      citations: [
        cite('rice-treaty-1837', 'Article 5; Article 6 and dated close, printed p.492'),
        cite('rice-glifwc-institution', 'Reserved-rights explanation'),
      ],
    },
    {
      year: 1913,
      label: 'Catalogued [1913]: a separately situated photograph',
      title: 'One archival scene leaves questions open',
      text: 'LOC assigns the bracketed date and a probable Ontario location. The person is unnamed and the exact lake unknown. The picture does not transfer the U.S. treaty’s geography or legal framework to this person.',
      citations: [cite('rice-linde', 'About This Item: creator/date/summary')],
    },
    {
      year: 1984,
      label: '1984: GLIFWC is created',
      title: 'An institution supports continuing tribal responsibilities',
      text: 'GLIFWC’s account dates its creation to 1984 and describes resource assessments and stewardship supporting member tribes. The brochure also identifies rice-bed protection and enhancement from that year. This dates an institution, not the beginning of Indigenous knowledge or care.',
      citations: [
        cite('rice-glifwc-institution', 'Opening1984 creation and stewardship'),
        cite('rice-goodberry', 'PDFp4,Management'),
      ],
    },
  ],
};

export const ojibweWorkDimension: Subject['dimensions'][string] = {
  text: 'Canoe harvesting is one part of linked finishing and care for rice waters. Community knowledge, specific political responsibilities and environmental observation connect food work with decisions beyond the photographed moment.',
  citations: [
    cite(
      'rice-goodberry',
      'Student attribution; Harvesting and Processing; Management',
    ),
    cite('rice-glifwc', 'Program knowledge, habitat requirements and finishing'),
    cite('rice-glifwc-institution', 'Member tribes and stewardship role'),
  ],
};

export function applyEasternOjibwe(c: Corpus): void {
  c.contexts ??= [];
  const renewals = {
    'rice-linde':
      'Actual official catalogue title, creator, bracketed [1913], gelatin-silver medium, summary, call/reproduction numbers and rights advisory reread. Existing complete 1024×617 local image pixels inspected. The summary leaves the person unnamed and sex uncertain, and places the scene probably in Ontario; no exact lake or personal biography established. No known restrictions remains an advisory, not a blanket rights guarantee. Original full media record and image bytes retained; no fresh remote-image byte parity, print examination or exposure/digitization date verified.',
    'rice-goodberry':
      'Actual selected PDF text from the seven-page brochure: PDFp2 food/storage opening; PDFp4Management; PDFpp5–6 student attribution and Harvesting/Processing, including drying/parching/hulling/winnowing. The named Lac du Flambeau students are Jeff Allen, Raelle Allen, Gabrielle Poupart and Bill Eckerstorfer. No page/source-photo pixels or full linked insert inspected/reused. The 2017 URL folder does not establish publication date. No nutrition-ranking, exact yield/depth/tool-size, recipe, permit or season rule adopted. Later attributed methods, including some mechanization, are not assigned to the 1913 person or made universally unchanged.',
    'rice-glifwc':
      'Actual selected public program/knowledge, Habitat Requirements and finishing HTML reread. Rice chiefs, elders, member tribal departments and research are named as knowledge sources; flow, clarity, water fluctuations and pollution have distinct explanations. Drying/parching/hulling/winnowing remain separate operations. The linked 2023 climate assessment itself was not consulted, so no vulnerability ranking, numeric effect or all-lakes causal inference is adopted. No current yield/depth threshold, permit/season or private contact data used, and no source photograph copied. Modern conditions are not projected into 1913.',
  };
  for (const [id, text] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw Error(`Missing inherited manoomin source: ${id}`);
    const marker = `Eastern selected renewal, ${consulted}: `;
    if (!source.scope.includes(marker)) {
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker}${text}`;
      source.accessed = consulted;
    }
  }
  // The St.Croix request timed out; its prior 27 October scope/access remain exact.
  for (const source of ojibweManoominSources) {
    const existing = c.sources.find((row) => row.id === source.id);
    if (existing && JSON.stringify(existing) !== JSON.stringify(source))
      throw Error(`Manoomin source identity collision: ${source.id}`);
    if (!existing) c.sources.push(source);
  }
  const context = c.contexts.find((row) => row.id === ojibweManoominContext.id);
  if (context && JSON.stringify(context) !== JSON.stringify(ojibweManoominContext))
    throw Error('Manoomin context identity collision');
  if (!context) c.contexts.push(ojibweManoominContext);
  const s = c.subjects.find((row) => row.id === 'ojibwe-manoomin');
  if (!s) throw Error('Missing inherited manoomin case');
  s.contextIds = [...new Set([...(s.contextIds ?? []), ojibweManoominContext.id])];
  s.summary =
    'Food work extends beyond a photographed canoe. Attributed Ojibwe accounts connect gathering with drying, parching, hulling, winnowing and care for water. A specific U.S. treaty and GLIFWC’s later institutional account add political responsibilities without assigning their geography to the unnamed person probably photographed in Ontario. The picture, knowledge accounts and later environmental work answer different questions.';
  s.sections = [
    sec(
      'Begin with the place the photograph does not identify',
      'Carl Gustave Linde’s photograph shows a person in a canoe, other canoes and tall rice grasses. LOC catalogues the print to [1913] and probably Ontario, without naming the individual or identifying the lake. The visible surroundings give an entry into food work, not a complete harvesting sequence. The written title and photographer’s name are part of the print’s presentation. Neither the person’s exact tools nor an entire working day can be recovered from this one moment.',
      cite('rice-linde', 'About This Item; actual unchanged local photograph'),
    ),
    sec(
      'Gathering joined boat movement with careful handling',
      'The GLIFWC brochure credits a harvesting account to four Lac du Flambeau students. It describes moving a canoe through rice beds with poles and using light wooden sticks to bring kernels into the boat. These choices are explained through the harvester’s effort and care for plants. The account makes practical knowledge visible beyond the waterside scene. It is a later attributed explanation, however, not the photographed person’s testimony or proof that every community used an identical routine.',
      cite('rice-goodberry', 'PDFp5,student credit and Harvesting'),
    ),
    sec(
      'Harvested grain still needed several kinds of work',
      'Drying, parching, hulling and winnowing changed freshly gathered material into grain ready for storage. Drying and parching reduced moisture; parching also helped loosen the covering. Hulling removed that covering, and winnowing separated grain from chaff. Each operation addressed a different material problem. The brochure describes containers, surfaces and repeated handling, while GLIFWC notes that some finishing is now mechanized. A full account therefore includes workers and knowledge away from the canoe, with changes in equipment rather than a timeless, uniform technique.',
      cite('rice-goodberry', 'PDFpp5–6,Drying/Parching/Hulling/Winnowing'),
      cite('rice-glifwc', 'Finishing steps and mechanized finishing'),
    ),
    sec(
      'Care for rice waters requires observation',
      'GLIFWC links its work with rice chiefs, elders and member tribal resource departments as well as research. Its habitat explanation distinguishes water flow, clarity, changing levels and pollution. These are different conditions to investigate, not one universal reason for every declining bed. The brochure describes surveys, protection and restoration, connecting food work with care for a wider landscape. None of these later accounts measures the former abundance or water quality of the unknown lake in Linde’s photograph.',
      cite('rice-glifwc', 'Program knowledge and Habitat Requirements'),
      cite('rice-goodberry', 'PDFp4,Management and annual surveys'),
    ),
    sec(
      'Rights and institutions belong to particular settings',
      'Article 5 of the 1837 U.S. treaty explicitly addressed gathering wild rice within the territory ceded. GLIFWC explains such rights as reserved by the Ojibwe, not newly created by the United States. In 1984 Ojibwe treaty tribes created the Commission to support shared work while retaining their own governments. This provides a political history beside the food sequence. It does not assign a U.S. treaty regime to a person probably photographed in Canada, or turn every Anishinaabe community into one institution.',
      cite('rice-treaty-1837', 'Article 5,printed p.492/PDFp2'),
      cite(
        'rice-glifwc-institution',
        'Opening1984 account; reserved rights; member governance',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'A photograph and a treaty have different geographies',
      'The 1837 clause identifies land, rivers and lakes within a particular cession. The archive, by contrast, supplies only a probable Ontario location for the photograph. Their shared subject does not put them in the same jurisdiction. Keeping the source geographies separate allows a meaningful comparison: people required access to rice waters, but the political records of that access differed. GLIFWC’s institutional account describes member tribes retaining their own sovereignty; it does not speak for every community or replace Canadian records. An exact-lake claim would need additional provenance, and a claim about a particular person’s rights would need an identified person and appropriate political evidence.',
      cite('rice-treaty-1837', 'Article 1 cession lead; Article 5 rice clause'),
      cite('rice-linde', 'Qualified Ontario location and unnamed person'),
      cite(
        'rice-glifwc-institution',
        'Member governance and retained responsibilities',
      ),
    ),
    sec(
      'Care is a relationship and a continuing inquiry',
      'The Commission presents its rice program through reciprocal care between manoomin and people. It names community observations and ecological knowledge alongside research rather than treating a laboratory measurement as the only knowledge available. Its description of fluctuating water also resists a simple rule that more stability is always better: variation within a growing season and variation across years are different questions. That explanation suggests records to seek, such as dated local observations and environmental measurements. It does not diagnose the photographed bed. The later brochure and program page describe continuing work and some changed equipment; continuity does not mean every material condition or method stayed unchanged since 1913.',
      cite(
        'rice-glifwc',
        'Program purpose/knowledge; Habitat Requirements:Water Fluctuations; finishing',
      ),
      cite(
        'rice-goodberry',
        'Management; student account and mechanized finishing note',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'A scene, an attributed work sequence and a political clause',
    introduction:
      'These source capsules are editorial paraphrases. They distinguish visible observations from catalogue metadata, later community explanation and a treaty concerning a different setting.',
    items: [
      {
        label: 'Visible canoes do not name a lake or worker',
        text: 'The image shows a person, canoes and grasses. The catalogue supplies the bracketed [1913] date and probable Ontario location.',
        interpretation:
          'The date and location are qualified archive statements, not values measured from the picture. The image does not establish an exact lake, personal identity, harvested quantity or complete day’s work.',
        citations: [
          cite('rice-linde', 'Actual photograph; About This Item:date/summary'),
        ],
      },
      {
        label: 'Finishing adds work beyond the frame',
        text: 'The student-based brochure describes harvesting followed by drying, parching, hulling and winnowing. GLIFWC distinguishes these operations and notes some mechanization.',
        interpretation:
          'These later attributed accounts explain a sequence without becoming a transcript of the 1913 person’s actions. A tool or process cannot be assigned to that person merely because it appears in the later explanation.',
        citations: [
          cite('rice-goodberry', 'PDFpp5–6,student credit and Harvesting/Processing'),
          cite('rice-glifwc', 'Finishing29–38'),
        ],
      },
      {
        label: 'A clause identifies a political setting',
        text: 'The 1837 treaty names gathering wild rice within the ceded territory. GLIFWC dates its own creation to 1984 and explains the work of supporting member tribes.',
        interpretation:
          'These records concern specified U.S. treaty relationships and a later institution. They neither originated the practice nor establish the rights of an unidentified person probably photographed in Ontario. The clause is not proof of complete later implementation.',
        citations: [
          cite('rice-treaty-1837', 'Article 5 and dated close'),
          cite('rice-glifwc-institution', 'Opening1984 account and reserved rights'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'The work beyond the canoe',
    duration: '10–15 minutes',
    steps: [
      'Point to two visible features in the photograph. Put the probable place and bracketed date in a separate catalogue column.',
      'Read the source capsule. Make four written cards: drying, parching, hulling and winnowing. Put them after gathering in the supplied order.',
      'Match each finishing card with its purpose in the capsule. Explain why grain inside a canoe is not yet the same as food prepared for storage.',
      'Name one question about the person or water that neither the photograph nor this later work account can answer. Describe an additional source you would want.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: a later GLIFWC brochure credits Lac du Flambeau students’ account. Gathering is followed by drying to remove moisture, parching to prepare and preserve grain, hulling to remove its covering and winnowing to separate chaff. Some finishing is now mechanized. These explanations are supplied by later accounts, not by the unnamed person in the photograph. The exact lake, person’s words and former water quality remain unknown.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian, Ojibwe or family approval',
    scope:
      'The unchanged archival photo, selected named-student work account, current program explanation and separate U.S. historical treaty/institutional evidence connect food work, water and political responsibilities.',
    limitations: [
      'The whole original bracketed [1913] interval, note/precision, identity, broad coordinates, claims, dimensions, object order and full media record/pixels remain intact. The photograph’s probable Ontario location is not converted into a particular U.S. treaty territory.',
      'Selected catalogue/PDF/program text and the existing local image were actually inspected. No new scan, source-photo/figure reuse, original treaty manuscript, lake measurements, individual biography, full 2023 climate assessment or current harvesting instructions supplied.',
      'The St.Croix page timed out; its earlier 27 October scope/date are retained. The undated brochure and current institutional accounts are later evidence, not 1913 testimony. No universal continuity, yield, abundance, exact lake or all-bed environmental cause inferred.',
      'No new map, asset, planting/harvesting exercise, ceremonial performance or present legal ruling proposed. Independent specialist/community assessment, real family use, human accessibility/device checks and physical print acceptance remain open.',
    ],
  };
}
