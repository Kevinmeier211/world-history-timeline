import type {
  Corpus,
  HistoricalContext,
  PlaceStudy,
  Source,
} from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const bandaExchangeSources: Source[] = [
  {
    id: 'banda-pala-1621',
    title: '1621: violence and depopulation on and around Banda',
    institution: 'Westfries Museum, PALA',
    author: 'Tristan Mostert, in cooperation with Wim Manuhutu',
    url: 'https://pala.westfriesmuseum.nl/1621-2/1621-article/?lang=en',
    type: 'scholarship',
    published:
      'Exhibition-linked 2021 account; exact article date unestablished; website footer ©2024',
    accessed: consulted,
    scope:
      'Selected actual English prose: first Dutch visit/trade, treaty claims and escalation, Further persecution and diaspora, and Spectres and rumours. Not the whole colonial record, all treaties or linked bibliography. Exact population, captive and casualty totals and graphic descriptions are not adopted. Descriptions of images were not source-image pixel inspection; no picture, map, audio or video copied. This authored museum account distinguishes a monopoly claim from practice and traces continuing persecution and diaspora activity after 1621. It is not independent approval of this atlas or testimony from every Bandanese community.',
  },
  {
    id: 'banda-wandan-statement-2021',
    title: 'Statement of Protest addressed to Gemeente Hoorn',
    institution:
      'Named Banda Ely-Elat diaspora representatives; hosted by Westfries Museum PALA',
    author: 'Signatories identifying themselves as descendants of Wandan',
    url: 'https://pala.westfriesmuseum.nl/wp-content/uploads/2021/04/01.-Letter-to-Gemeente-Hoorn-May-8th-2021.pdf',
    type: 'primary',
    published: '2021-05-08, document date',
    accessed: consulted,
    scope:
      'Actual exposed English PDF text: statement on pages 1–2, dated 8 May 2021, with opening signatory attribution. Later names/contact lists encountered but personal contact details are not adopted. The statement is direct evidence of these authors’ modern self-identification, grievances and protest against Coen’s public commemoration; its casualty/survivor estimates are not treated as a verified census. It does not establish universal community representation or approval of this atlas. Screenshot attempts cache-missed: no page pixels, signatures or document artwork inspected/reused. No reuse licence established; editorial paraphrase only. No message sent.',
  },
  {
    id: 'banda-farid-commemoration',
    title: 'Commemorating the Banda genocide in 1621: For what and who?',
    institution: 'Westfries Museum PALA',
    author:
      'Muhammad Farid, Lecturer in Social History and Head of Hatta-Sjahrir College, Banda Naira, as identified by the page',
    url: 'https://pala.westfriesmuseum.nl/banda-genocide/',
    type: 'primary',
    published:
      'Exhibition-linked 2021 contribution; exact page publication date unestablished; footer ©2024',
    accessed: consulted,
    scope:
      'Byline and selected actual English passages in Banda after Coen and Commemorating the Genocide for What and Who, especially the author’s stated purposes for historical writing, remembrance and protecting Banda’s future. Earlier historical narrative was encountered but is not adopted wholesale. Psychological motives, precise totals, graphic descriptions, broad economic causation and universal claims of social harmony are excluded. Farid’s preference for contextualizing colonial symbols remains his attributed proposal; it is not merged into the protest statement’s position. No cited books, source-photo pixels, song text or video independently consulted/reused. No reuse licence established; short paraphrase only.',
  },
  {
    id: 'banda-language-tana-2019',
    title: 'Kabata dan Bahasa Tana di Kepulauan Banda',
    institution: 'Kantor Bahasa Maluku; current Balai Bahasa Provinsi Maluku website',
    author: 'Faradika Darman',
    url: 'https://balaibahasaprovinsimaluku.kemendikdasmen.go.id/2019/05/kabata-dan-bahasa-tana-di-kepulauan-banda/',
    type: 'scholarship',
    published: '2019-05 URL; exact publication day unestablished',
    accessed: consulted,
    scope:
      'Byline and selected explanatory prose on everyday/ritual language, the entrusted performer and explicit restrictions on documenting some Kabata. This is a technical staff member’s institutional article, not permission from every community or an exhaustive current language survey. Its precise survivor estimate is excluded. Song examples encountered on the page are not copied, transcribed, translated for performance, recorded or taught here. No ritual image/audio adopted; only attributed paraphrase of explanatory and access-limit prose. The local consultation record omits the examples rather than capturing them as reusable content.',
  },
  {
    id: 'banda-gazetteer-2021',
    title:
      'Gazeter Republik Indonesia, Edisi 1 Tahun 2021: selected Banda island records',
    institution: 'Badan Informasi Geospasial, Indonesia',
    url: 'https://sinar.big.go.id/assets/document/gazeter/gazeter_1643095453.pdf',
    type: 'archive',
    published: '2021 edition',
    accessed: consulted,
    scope:
      'Three actual exposed coordinate rows only: Banda Besar at PDF 250, Neira at PDF 604 and Rhun at PDF 686; exposed printed locators 235, 589 and 671. Not the entire 876-page volume, which was not read or downloaded. The DMS values are converted arithmetically into modern island-reference points; they are not settlement, plantation, landing, battle or ritual locations. Administrative text remains a 2021 record, not a claim about 2026 boundaries. Page screenshot attempts cache-missed, so no table pixels inspected. ©BIG2021; only numeric facts and names used. No table/map image, coastline, boundary or route geometry copied. The malformed coordinate string in a separate UNESCO Tentative List submission is not corrected or used.',
  },
];

export const bandaWorkContext: HistoricalContext = {
  id: 'banda-food-displacement-context',
  title: 'Banda: trade, coercion and continuing communities',
  region: 'Southeast Asia/Oceania',
  interval: {
    start: 1599,
    end: 1630,
    label: 'Selected trade and displacement evidence, 1599–1630',
    precision: 'range',
    note: 'A selected reference around the unchanged 1621 event case, not the beginning or end of Bandanese history. The final marker is a dated colonial observation of communities in Kei, not their first existence. The separate 2019 and 2021 sources concern modern language, remembrance and public claims; they are not eyewitness accounts of 1621.',
  },
  summary:
    'Monopoly required more than a contract: control of land, food and labor changed lives. Surviving communities continued work, relationships and remembrance beyond the campaign.',
  subjectIds: ['banda-1621'],
  citations: [
    cite('banda-archive', 'Handel; Genocide; Na de genocide'),
    cite('banda-pala-1621', 'Opening; Further persecution and diaspora'),
  ],
  phases: [
    {
      year: 1599,
      label: '1599: Dutch visitors enter an existing trading society',
      title: 'A trading port precedes the company’s monopoly',
      text: 'Mostert and Manuhutu describe the first Dutch visitors paying port dues and exchanging goods for nutmeg and mace. This encounter did not create Bandanese commerce or establish a monopoly in practice.',
      citations: [cite('banda-pala-1621', 'Opening: first Dutch visit, 1599')],
    },
    {
      year: 1609,
      label: '1609: occupation and fortification intensify conflict',
      title: 'Company trading claims acquire military force',
      text: 'The National Archives account places the occupation of Neira and construction of a fort in the escalation toward conquest. Treaties and company claims must be distinguished from the choices and trading practice of the communities targeted.',
      citations: [
        cite('banda-archive', 'Koloniale bezetting'),
        cite('banda-pala-1621', 'Treaty claims and escalation'),
      ],
    },
    {
      year: 1621,
      label: '1621: removal, hunger and enslavement',
      title: 'The event case examines a policy of forced displacement',
      text: 'The archive presents the council’s removal decision of 24 April and Coen’s report captioned 6 May. Its account characterizes the campaign as genocide. These records expose official purposes and resistance; they do not supply the full experience of those attacked or one settled casualty count.',
      citations: [
        cite(
          'banda-archive',
          'Genocide: 24 April decision; 6 May report and modern Dutch renderings',
        ),
      ],
    },
    {
      year: 1622,
      label: '1622: persecution and forced work continue',
      title: 'The campaign’s consequences exceed one year',
      text: 'Mostert and Manuhutu trace renewed persecution and forced transfers after 1621. Their account connects plantation production with the cultivation and processing knowledge of enslaved Bandanese people. The 1621 case date is not an endpoint for these consequences.',
      citations: [
        cite('banda-pala-1621', 'Further persecution and diaspora'),
        cite('banda-museum', 'Eerste op slavernij gebaseerde kolonie'),
      ],
    },
    {
      year: 1630,
      label: '1630: a colonial encounter records a community in Kei',
      title: 'Displacement is not disappearance',
      text: 'The PALA account reports that VOC visitors encountered Bandanese people in the Kei region in 1630. It also describes continuing diaspora trade and political initiatives. The record is evidence of presence at that encounter, not a precise migration route, founding date or complete family history.',
      citations: [cite('banda-pala-1621', 'Spectres and rumours: Kei, 1630')],
    },
  ],
};

export const bandaPlaceStudy: PlaceStudy = {
  title: 'Banda: three modern island references',
  description:
    'Selected island-reference coordinates published by Indonesia’s geospatial agency in 2021. The labels orient the named places in the text; they are not a surveyed 1621 battle, plantation, settlement or diaspora map. No coast outline, political boundary, sailing track or route of flight is drawn.',
  bounds: [129.65, -4.59, 129.96, -4.48],
  points: [
    {
      id: 'banda-besar-reference',
      label: 'Banda Besar — island reference',
      coordinates: [129 + 54 / 60 + 34.99 / 3600, -(4 + 33 / 60 + 20.99 / 3600)],
      text: 'The gazetteer names Banda Besar as an island and supplies this reference coordinate. The archive also calls Banda Besar Lontor. This point does not locate a particular village, fortification, plantation or act of violence.',
      citations: [
        cite(
          'banda-gazetteer-2021',
          'PDF 250: Banda Besar, Pulau; 04°33′20.99″S 129°54′34.99″E',
        ),
        cite('banda-archive', 'Geografie: Banda Besar, also called Lontor'),
      ],
    },
    {
      id: 'banda-neira-reference',
      label: 'Neira — island reference',
      coordinates: [129 + 54 / 60 + 10.8 / 3600, -(4 + 30 / 60 + 43.99 / 3600)],
      text: 'A modern coordinate for the island Neira, not the precise town, Fort Nassau or a ship’s anchorage. It helps distinguish Neira from Banda Besar without reconstructing the campaign’s movements.',
      citations: [
        cite(
          'banda-gazetteer-2021',
          'PDF 604: Neira, Pulau; 04°30′43.99″S 129°54′10.80″E',
        ),
      ],
    },
    {
      id: 'banda-rhun-reference',
      label: 'Rhun / Run — island reference',
      coordinates: [129 + 40 / 60 + 52 / 3600, -(4 + 33 / 60 + 29 / 3600)],
      text: 'The 2021 gazetteer uses Rhun; historical accounts also use Run. This locates the named island only. It does not map a treaty boundary, later persecution site or a direct transaction with a place across the world.',
      citations: [
        cite(
          'banda-gazetteer-2021',
          'PDF 686: Rhun, Pulau; 04°33′29.00″S 129°40′52.00″E',
        ),
        cite('banda-pala-1621', 'Spectres and rumours: Run'),
      ],
    },
  ],
  features: [],
};

export const bandaLaborDimension = {
  text: 'Nutmeg and mace commerce depended on cultivation, processing and food supplied through trade. Colonial monopoly imposed land and labor arrangements through violence and enslavement; Bandanese knowledge remained necessary to production. Continuing communities and modern claims cannot be reduced to the company’s account of control.',
  citations: [
    cite('banda-archive', 'Handel; Na de genocide'),
    cite('banda-museum', 'Eerste op slavernij gebaseerde kolonie'),
    cite('banda-wandan-statement-2021', 'PDF 1–2: self-identification and protest'),
  ],
};

export function applyExchangeBanda(c: Corpus): void {
  for (const source of bandaExchangeSources)
    if (!c.sources.some((row) => row.id === source.id)) c.sources.push(source);
  for (const [id, scope] of [
    [
      'banda-archive',
      'Selected actual exposed page prose: geography, trade/food, orang kaya, colonial-source limits, the 24 April 1621 council decision and 6 May report transcriptions/modern Dutch renderings, and later forced cultivation knowledge, diaspora and memorial. No original manuscript collation, source-map pixels, complete archive, precise casualty/escape totals or entire political constitution consulted. Existing original-letter attribution remains dated; current page captions do not constitute renewed inspection of manuscript pixels. No cultural object or song reproduced.',
    ],
    [
      'banda-museum',
      'Complete short exposed historical body reread, especially monopoly and plantation/enslaved-work sections. Exact casualty totals, simplified Run-for-Manhattan exchange, global firstness and complete twentieth-century history are excluded. No source-image pixels or linked records read. Website ©2026 is not the historical or original publication date; no image copied.',
    ],
  ] as const) {
    const source = c.sources.find((row) => row.id === id)!;
    const marker = 'Banda work selected renewal, 2026-10-29:';
    if (!source.scope.includes(marker)) {
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker} ${scope}`;
      source.accessed = consulted;
    }
  }
  c.contexts ??= [];
  if (!c.contexts.some((row) => row.id === bandaWorkContext.id))
    c.contexts.push(bandaWorkContext);
  const s = c.subjects.find((row) => row.id === 'banda-1621');
  if (!s) throw new Error('Banda continuation requires the existing case');
  s.contextIds = [...new Set([...(s.contextIds ?? []), bandaWorkContext.id])];
  s.placeStudy = bandaPlaceStudy;
  s.summary =
    'Banda’s spice commerce depended on cultivation, skilled processing and imported food. The VOC’s campaign imposed monopoly through killing, enslavement and displacement. Colonial records expose policy; continuing Bandanese communities and attributed modern voices show why the story cannot end with the company’s claim to control.';
  s.sections = [
    sec(
      'Spice commerce supported a society',
      'Nutmeg and mace were products of work and exchange before the VOC sought to monopolize them. The National Archives account explains that Bandanese commerce brought food as well as income: much food came from outside the islands. It describes orang kaya as merchants with political authority, whose important decisions involved discussion with villagers. Mostert and Manuhutu describe Dutch visitors in 1599 paying port dues and exchanging goods in an existing trading society. Exclusive buying rights threatened relationships on which people’s living depended.',
      cite('banda-archive', 'Handel; Samenleving'),
      cite('banda-pala-1621', 'Opening: trade and first Dutch visit'),
    ),
    sec(
      'A monopoly claim became control over food and place',
      'A contract did not automatically stop people trading with other buyers. Forts and military force became means of imposing company claims. In 1621 the VOC council ordered people removed from Banda Besar; Coen’s report discusses using hunger against those resisting in the hills. The archive presents these policies within an account of genocide. The decisions connect commerce with access to food, homes and freedom. An official report makes those purposes legible while leaving the people targeted far less able to explain themselves in the same collection.',
      cite('banda-pala-1621', 'Treaty claims and escalation'),
      cite('banda-archive', 'Genocide: removal decision and report'),
    ),
    sec(
      'Plantation production depended on people’s knowledge',
      'After the conquest, the company allocated land to colonial settlers and organized production through perken, or plantation plots. The archive’s account distinguishes settlers who received land from the enslaved people compelled to cultivate it. Enslaved people brought from several regions worked them. Bandanese survivors were also forced to cultivate and transfer knowledge about the trees; this was not an empty landscape awaiting productive newcomers. Cultivation and processing still required expertise. Mostert and Manuhutu trace further persecution after 1621, but also communities in Seram, Makassar and Kei maintaining relationships and political initiatives. Forced displacement changed society without ending Bandanese lives or making the company’s claim to complete control reliable.',
      cite('banda-museum', 'Eerste op slavernij gebaseerde kolonie'),
      cite('banda-archive', 'Na de genocide'),
      cite('banda-pala-1621', 'Further persecution and diaspora; Kei'),
    ),
    sec(
      'Living people continue to interpret the past',
      'In a public statement dated 8 May 2021, named representatives identifying themselves as Wandan descendants in Banda Ely-Elat connected ancestral dispossession with a protest against Coen’s commemoration in Hoorn. Their words are evidence of their present claim, not every community’s single opinion. Muhammad Farid, a Banda-based educator, separately argues that remembrance should support honest historical writing and protection of Banda’s future. These are people addressing audiences and seeking consequences. Reading them alongside the company’s account changes whose purposes a history must explain.',
      cite('banda-wandan-statement-2021', 'PDF 1–2: statement and date'),
      cite('banda-farid-commemoration', 'Commemorating the Genocide for What and Who'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Different records make different kinds of claims',
      'The National Archives explicitly warns that its Banda collection, as known to the institution, does not contain Bandanese voices. A council decision can establish what officials advised without becoming a family’s testimony of removal. Likewise, a modern protest is not an eyewitness account of 1621. It makes a different historical fact accessible: named descendants publicly contest how their ancestors and a colonial governor are remembered. Farid’s proposal to contextualize colonial symbols and the statement’s opposition to a public statue need not be flattened into agreement. Identify each speaker, date, audience and purpose before asking where their accounts meet or differ.',
      cite('banda-archive', 'Koloniaal bronmateriaal'),
      cite('banda-wandan-statement-2021', 'PDF 1–2'),
      cite('banda-farid-commemoration', 'Commemorating: colonial symbols and purpose'),
    ),
    sec(
      'Continuity does not give unrestricted access',
      'Faradika Darman, writing for the Maluku language office, distinguishes everyday language from ritual language and describes the role of people entrusted to perform Kabata. The article also states that some ritual material must not be documented. A fuller history should respect that limit instead of treating every living tradition as freely extractable classroom content. This account therefore does not reproduce or ask families to perform sacred songs. Publicly offered statements can be read on their own terms while unconsulted or restricted knowledge remains outside the account. The three island markers have a similarly bounded purpose: modern published coordinates orient names, but do not recover a village household, a path of flight or anyone’s cultural authority.',
      cite(
        'banda-language-tana-2019',
        'Ritual language, Natu and documentation limits',
      ),
      cite('banda-gazetteer-2021', 'Selected modern island-reference rows'),
    ),
  ];
  s.evidenceReading = {
    title: 'Policy, consequence and a living public claim',
    introduction:
      'These source capsules are editorial paraphrases. Their dates and purposes remain different; no graphic passage, ritual text or precise casualty estimate is reproduced.',
    items: [
      {
        label: 'An order exposes a policy, not every experience',
        text: 'The archive transcribes the council’s 24 April 1621 advice to remove named communities and presents Coen’s 6 May report about forcing opponents out through hunger.',
        interpretation:
          'The record supports a conclusion about official intentions and the means proposed. It does not prove that every instruction occurred exactly as written or provide the households’ own testimony. The archive identifies that imbalance in its collection.',
        citations: [
          cite('banda-archive', 'Koloniaal bronmateriaal; Genocide transcriptions'),
        ],
      },
      {
        label: 'A claim of control does not erase continuing communities',
        text: 'The PALA account contrasts colonial claims of near-total destruction with later records of Bandanese people maintaining communities, trade and political contacts outside the islands.',
        interpretation:
          'Following later evidence changes a story that would end in 1621. It establishes continuing activity without tracing each family’s migration, settling one population total or reconstructing a universal route.',
        citations: [cite('banda-pala-1621', 'Spectres and rumours')],
      },
      {
        label: 'A dated public statement is a modern source in its own right',
        text: 'The 8 May 2021 authors identify themselves as descendants of Wandan living in Banda Ely-Elat and address a protest to Hoorn about the public commemoration of Coen.',
        interpretation:
          'This is evidence of these signatories’ self-identification, grievances and intended audience. Their voice need not stand for every Bandanese person, and their historical estimates are not adopted as a verified census. Reading a public statement does not confer permission to copy restricted traditions or claim community approval.',
        citations: [
          cite('banda-wandan-statement-2021', 'PDF 1–2: identity, audience and date'),
          cite('banda-language-tana-2019', 'Limits on documenting some Kabata'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Two dates, two purposes and a careful conclusion',
    duration: '10–15 minutes',
    steps: [
      'Read the two source capsules with an adult. Put 1621 and 2021 on separate cards; do not turn the distance between them into a claim that nothing happened in between.',
      'For each card, name the speaker and decision or change being sought. Identify the intended audience when the capsule gives it; otherwise mark that as an unanswered question. Point to the words supporting each answer.',
      'Use the three island-reference labels to distinguish Banda Besar, Neira and Rhun. Explain why these points cannot show a particular family’s journey or a battle.',
      'Write one supported claim and one question that would require another freely offered source. Do not invent a victim’s diary, reenact violence or perform a sacred song.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: in 1621 the VOC council advised removing communities from Banda Besar; an official report discusses using hunger against resistance. These are colonial officials’ records. In a separate public statement dated 8 May 2021, named Banda Ely-Elat representatives identifying themselves as Wandan descendants addressed Hoorn’s municipal authorities to protest Coen’s public commemoration. The later statement makes its authors’ living claim visible. It is not a 1621 eyewitness report or proof of every community’s opinion. The activity asks about purpose and evidence, without graphic detail or restricted ritual material.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian, Bandanese community or family acceptance',
    scope:
      'Selected colonial transcriptions and institutional accounts are read beside attributed public modern voices, with practical work and food explained. Two dated prior scopes remain intact; five new source records provide bounded history, statements, access limits and three modern island references. Original event interval, identity, claims, object order and dimensions are preserved; no media added.',
    limitations: [
      'The complete case remains exactly 1621; selected reference 1599–1630 and modern 2019/2021 language and remembrance sources have different clocks. A 1630 colonial observation is not a community’s founding date.',
      'No original manuscript collation, complete treaty/plantation register, worker testimony series or precise casualty/population reconstruction consulted. The earlier letter provenance remains a dated prior consultation; current transcriptions are not newly inspected manuscript pixels.',
      'The public protest represents its named authors; Farid’s essay is separately attributed. Neither is universal community assent or approval of this atlas. Sacred song text and examples are not reproduced or performed.',
      'Only three selected gazetteer rows were read from exposed PDF text; page screenshots cache-missed. Modern island-reference points are not settlement, plantation, campaign or diaspora geometry. The malformed UNESCO coordinate string and inaccessible GeoNames/NGA pages were not used.',
      'Van Donkersgoed’s 2023 publisher abstract was read but its full-text download returned 403; Kaartinen’s abstract is an optional lead, not a full ethnographic consultation. No blocked-source workaround or linked bibliography adopted as read.',
      'No source photo, historical plan, artwork or new explanatory image adopted. Independent specialist/community review, real adult/family use, human accessibility/device behavior and physical print acceptance remain open.',
    ],
  };
}
