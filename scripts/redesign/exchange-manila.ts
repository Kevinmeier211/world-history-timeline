import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const manilaExchangeSources: Source[] = [
  {
    id: 'manila-shipbuilding-1618-1619',
    title: 'Selected Philippine shipbuilding documents, 1618–1619',
    institution:
      'Blair and Robertson, The Philippine Islands, volume XVIII; Project Gutenberg ebook 15564',
    author:
      'Alonso Fajardo de Tenza and Sebastian de Pineda; English translation by James A. Robertson',
    url: 'https://www.gutenberg.org/files/15564/15564-h/15564-h.htm',
    type: 'primary',
    published:
      'Fajardo letter, 10 August 1618; Pineda report editorially attributed [Mexico? 1619]; edition preface August 1904; ebook released 6 April 2005',
    accessed: consulted,
    scope:
      'Selected actual English text: Fajardo’s royal-shipbuilding, agricultural/community burdens and contrasting smaller private/inter-island ships paragraphs; Pineda’s woodcutters/carpenters/master tasks, pay arrears/flight and Indigenous/Chinese smiths passages. Document headings, translator/source attribution and selected edition metadata read. Not the whole volume, entire reports, original Spanish manuscripts or an independent translation. Officials discuss royal service, expense and labor control; their criticism is not workers’ own testimony or universal opposition to slavery. Reported wages do not prove payment, and claimed voluntary private construction concerns smaller regional ships, not every galleon. No exact workforce, mortality rate, wage conversion or compliance inferred. HTML page markers conflict with the contents list, so citations use titles and passage openings rather than newly verified printed pages. Public-domain historical text; no plate or plan copied.',
  },
  {
    id: 'manila-tamal-huye-project',
    title:
      'The Archeology of Sixteenth-Century Cross-Cultural Encounters in Point Reyes National Seashore',
    institution: 'US National Park Service; Tamál-Húye project account',
    url: 'https://www.nps.gov/articles/cross-cultural-encounters-in-point-reyes-national-seashore.htm',
    type: 'archaeology',
    published: 'Displayed update 2023-05-20; original account date unestablished',
    accessed: consulted,
    scope:
      'Selected project opening/partnership, 1595 encounter, previous archaeology, methodological and alternative-use model passages read. The account reports partnership with Federated Indians of Graton Rancheria; this is not current community approval of the atlas. Its 1573 trade-start shorthand is not substituted for the preserved 1565–1815 convention. The voyage/wreck, village contexts and proposed uses are different evidence. Models under investigation are not all established outcomes; its research-status statements are not a fresh 2026 field update. No original chronicle, full excavation report, underlying oral-history edition, complete cargo manifest, source-image pixels, artist reconstruction or map geometry consulted/reused.',
  },
  {
    id: 'manila-santo-cristo-2022',
    title:
      'Un aporte a la historia económica del Pacífico: El Galeón de Manila de 1726',
    institution: 'Universidad Pablo de Olavide, Americanía 15, pp. 258–285',
    author: 'José Luis Caño Ortigosa and Fabio Yuchung Lee',
    url: 'https://doi.org/10.46661/americania.6387',
    type: 'scholarship',
    published: '2022-08-02; issue labelled January–June 2022',
    accessed: consulted,
    scope:
      'Selected actual exposed PDF text: registration context/note 5 at PDF 4; declared-value limits at PDF 6 and 10; selected methods at PDF 11; cargo/Julián Ignacio prose at PDF 13–14. Selected appendix row text was encountered but no counts, conversions or table alignment adopted. The paper cites AGI Filipinas 232, Cavite register dated 26 June 1726, for the Santo Cristo’s Cavite-Manila–Acapulco voyage. This is mediated registration evidence, not an original manuscript, independently collated full manifest, arrival receipt or final sale. The complete 28-page article, bibliography and tables were not read. Web page screenshots cache-missed and direct local PDF capture returned 503; no page pixels inspected or retry/bypass attempted. Publisher metadata and CC BY-NC-SA 4.0 notice read; no page, table, figure or geometry reused. The separate inaccessible 2018 paper is not included in this consultation.',
  },
];

export const manilaWorkContext: HistoricalContext = {
  id: 'manila-ships-people-context',
  title: 'Pacific exchange: a wreck, shipbuilding and a later Mexican jar',
  region: 'Southeast Asia/Oceania',
  interval: {
    start: 1565,
    end: 1726,
    label: 'Selected exchange and work records, 1565–1726',
    precision: 'range',
    note: 'An orientation for selected evidence, not the full trade’s duration or a universal voyage. The complete original case remains 1565–1815. The 1595 wreck, separate 1618/1619 official accounts, ca. 1680–1700 Mexican jar and a 1726 registered consignment are different records. The reference ends with that selected registration, not the trade’s endpoint.',
  },
  summary:
    'Commodity movement depended on ships, materials and people. A particular interrupted voyage and official reports make some work visible; a later Mexican jar belongs to a different episode within the longer exchange history.',
  subjectIds: ['manila-network'],
  citations: [
    cite('galleon', 'Title convention and short route/cargo account'),
    cite('point-reyes', 'San Agustín wreck, 1595'),
    cite('manila-shipbuilding-1618-1619', 'Selected Fajardo and Pineda passages'),
    cite('met-9198', 'Date and Geography'),
    cite('manila-santo-cristo-2022', 'PDF 4: voyage, register and note 5'),
  ],
  phases: [
    {
      year: 1565,
      label: '1565: the retained trade convention begins',
      title: 'A long commercial frame contains different episodes',
      text: 'The Met essay and Point Reyes collection account use the 1565–1815 convention. This opening marker does not identify a particular cargo or make every journey follow an identical track. The selected reference stops earlier than the complete case.',
      citations: [
        cite('galleon', 'Title: The Manila Galleon Trade (1565–1815)'),
        cite('point-reyes', 'Cargo and trade-period paragraph'),
      ],
    },
    {
      year: 1595,
      label: '1595: the San Agustín voyage is interrupted',
      title: 'A wreck and village finds give a particular context',
      text: 'The San Agustín, sailing from the Philippines toward Mexico, wrecked at tamál-húye, present-day Drakes Bay. Written accounts and objects recovered in Coast Miwok village contexts support a bounded inquiry. They do not turn the much later selected jar into wreck cargo or establish one exact route for the whole trade.',
      citations: [
        cite('point-reyes', 'Shipwreck and porcelain account'),
        cite(
          'manila-tamal-huye-project',
          'Sixteenth-Century Encounters; Previous Archeological Research',
        ),
      ],
    },
    {
      year: 1618,
      label: '1618: a governor reports burdens of royal shipbuilding',
      title: 'A colonial report links ships to fields and communities',
      text: 'Fajardo’s letter of 10 August 1618 describes workers drawn from cultivation, harsh conditions and contributions from their communities. His contrasting claim about consenting labor concerns smaller private ships for regional navigation. It is an official’s argument about royal service and cost, not a survey of every worker or a proof that instructions changed conditions.',
      citations: [
        cite(
          'manila-shipbuilding-1618-1619',
          'Fajardo letter: royal and private shipbuilding passages',
        ),
      ],
    },
    {
      year: 1619,
      label: '1619: Pineda’s report, as editorially attributed',
      title: 'Craft tasks and unpaid labor appear together',
      text: 'The edition attributes Pineda’s report to [Mexico? 1619]. It identifies woodcutting, carpentry, mast-making and smithing, while reporting pay arrears and people leaving. The report covers ships, galleys and defense; it does not provide one galleon’s complete crew or prove that its wage schedules were paid.',
      citations: [
        cite(
          'manila-shipbuilding-1618-1619',
          'Pineda: heading; Those who cut these woods; And because, they have; smiths',
        ),
      ],
    },
    {
      year: 1680,
      label: 'ca. 1680–1700: a separate Mexican jar',
      title: 'The selected object belongs to a later material history',
      text: 'The Met dates accession 11.87.36 to approximately 1680–1700 and identifies Mexican tin-glazed earthenware. This is later than the 1595 wreck and remains distinct from imported Chinese porcelain. The catalogue does not identify its particular buyer, contents or voyage.',
      citations: [
        cite('met-9198', 'Artwork Details: Date, Geography, Medium and Object Number'),
      ],
    },
    {
      year: 1726,
      label: '1726: a particular registered consignment',
      title: 'A named ship’s record gives a more specific connection',
      text: 'Caño Ortigosa and Lee study the Santo Cristo’s register dated at Cavite on 26 June 1726 for a voyage to Acapulco. Their discussion follows Julián Ignacio’s entry for lacquered furnishings, ceramics described as Japanese and personal belongings. The registration does not identify this Mexican jar or establish every good’s precise origin, route, sale or successful delivery.',
      citations: [
        cite(
          'manila-santo-cristo-2022',
          'PDF 4 note 5; PDF 14: Julián Ignacio discussion',
        ),
      ],
    },
  ],
};

export const manilaLaborDimension = {
  text: 'Oceanic exchange required material preparation, shipbuilding, repair and transport. Official reports expose skilled tasks and burdens placed on communities, while a particular wreck and a later jar answer different questions. A cargo route does not establish consent, uniform conditions or every object’s itinerary.',
  citations: [
    cite(
      'manila-shipbuilding-1618-1619',
      'Selected work, payment and community-burden passages',
    ),
    cite('point-reyes', 'Particular wreck context'),
    cite('met-9198', 'Separate later date and material'),
  ],
};

export function applyExchangeManila(c: Corpus): void {
  for (const source of manilaExchangeSources)
    if (!c.sources.some((row) => row.id === source.id)) c.sources.push(source);
  for (const [id, scope] of [
    [
      'galleon',
      'Complete short exposed body, title, Johanna Hecht contributor and October 2003 date reread. Cargo, transfers and broad Mexican artistic responses are selected; the estimated silver fraction is not adopted. No linked book, source-image pixels, particular jar-maker/buyer or universal cargo itinerary consulted. No source route geometry copied.',
    ],
    [
      'point-reyes',
      'Complete short collection body, image captions as text and 27 August 2021 update reread. Porcelain identifications, 1595 San Agustín wreck and explicitly tentative Drake-deposit suggestion remain distinct. No original specialist analysis, complete catalogue, exact cargo manifest or source-image pixels read. Aesthetic rankings and certain Drake attribution are excluded; no route map copied.',
    ],
    [
      'met-9198',
      'Visible title/date, selected Artwork Details and Public Domain/Open Access notices reread. Mexico, tin-glazed earthenware, gift and accession 11.87.36 retained; actual existing 1600×1600 image inspected unchanged. Current provenance/other tabs not reread. No exact manufacturing city, named maker, original contents, buyer, voyage, exposure date or fresh remote-image parity verified; earlier provenance scope remains dated.',
    ],
  ] as const) {
    const source = c.sources.find((row) => row.id === id)!;
    const marker = 'Manila work selected renewal, 2026-10-29:';
    if (!source.scope.includes(marker)) {
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker} ${scope}`;
      source.accessed = consulted;
    }
  }
  c.contexts ??= [];
  if (!c.contexts.some((row) => row.id === manilaWorkContext.id))
    c.contexts.push(manilaWorkContext);
  const s = c.subjects.find((row) => row.id === 'manila-network');
  if (!s) throw new Error('Manila continuation requires the existing case');
  s.contextIds = [...new Set([...(s.contextIds ?? []), manilaWorkContext.id])];
  s.summary =
    'Silver and manufactured goods crossed the Pacific through a system supported by skilled and coerced work. One wreck, colonial shipbuilding reports and a later Mexican jar make different parts of that history concrete. Their contexts explain some connections while leaving particular makers, labor experiences and object journeys unresolved.';
  s.sections = [
    sec(
      'Moving goods required several kinds of work',
      'The Manila trade joined American silver with Asian manufactured goods, including porcelain and silk. Hecht describes transfers through the Philippines and Acapulco, with some goods staying in the Americas and others crossing Mexico for onward shipment. This was a system of transactions and transport, not a single journey made by every object. Ships also required prepared timber and metalwork. Pineda’s report names people cutting and planing wood, shaping masts and forging nails: useful skills without which a trading connection could not remain afloat.',
      cite('galleon', 'Short route, cargo and American-market account'),
      cite(
        'manila-shipbuilding-1618-1619',
        'Pineda: woodcutters, masters and smiths passages',
      ),
    ),
    sec(
      'Royal construction placed burdens on communities',
      'In 1618 Governor Fajardo reported that royal shipbuilding drew people away from their fields. He described harsh work and contributions from neighbors to support workers whose royal pay was small. Pineda’s separately attributed 1619 report lists different skilled tasks, then describes arrears and people leaving. A stated wage was not necessarily money received. These officials sought changes that would sustain royal service and reduce expense. Their accounts expose burdens without supplying the workers’ own full testimony or establishing identical conditions in every yard and year.',
      cite(
        'manila-shipbuilding-1618-1619',
        'Fajardo: royal shipbuilding; Pineda: pay arrears and flight',
      ),
    ),
    sec(
      'Follow one interrupted voyage',
      'The San Agustín carried Chinese goods from the Philippines toward Mexico in 1595. It wrecked at tamál-húye, present-day Drakes Bay, where Coast Miwok communities already lived. Porcelain recovered in village contexts gives this episode a material setting beyond a captain’s account. The NPS project compares excavation records and written sources while investigating how local people selected and used introduced objects. Proposed practical and ceremonial uses remain interpretations to test, rather than one meaning assigned to every fragment.',
      cite('point-reyes', 'San Agustín wreck and porcelain identification'),
      cite(
        'manila-tamal-huye-project',
        'Encounter, village archaeology and alternative-use models',
      ),
    ),
    sec(
      'A later jar is another episode',
      'The supplied jar is Mexican tin-glazed earthenware, dated approximately 1680–1700. Its blue and pale decoration includes repeated panels and floral forms. It is not Chinese porcelain or cargo from the 1595 wreck. Hecht uses Mexican ceramics to discuss local responses to imported wares, while the catalogue supplies this jar’s material and date. The picture does not name its potters, buyer or original contents. Comparing it with wreck evidence explains why a known archaeological context can establish connections that an attractive surface alone cannot.',
      cite('met-9198', 'Actual supplied image; Date, Geography and Medium'),
      cite('galleon', 'Mexican ceramic responses'),
    ),
    sec(
      'A registered consignment gives a narrower connection',
      'Caño Ortigosa and Lee study the Santo Cristo’s 1726 Cavite register for a voyage to Acapulco. Julián Ignacio’s entry joins lacquered furnishings and ceramics described as Japanese with clothing and books. This particular record makes loading and ownership discussable. The authors also warn that declared values omit entries. Registration is evidence for an intended commercial movement, without supplying every good’s actual manufacture, final buyer or successful delivery.',
      cite(
        'manila-santo-cristo-2022',
        'PDF 4 note 5; PDF 6 and 10: declared-value limits; PDF 14: Julián Ignacio',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'An official’s criticism has a purpose',
      'Fajardo contrasts royal construction with smaller private ships, whose workers he describes as paid and consenting. His proposed permission concerns regional navigation, not proof that all Pacific galleon building was voluntary. He also considers buying enslaved people elsewhere for galley service. Criticism of one damaging arrangement therefore does not make the letter a program of freedom for everyone. Pineda similarly writes to the king about preserving the colony and improving royal provision. His technical knowledge and complaints help explain work while leaving the workers’ different aims harder to recover. Both accounts are read here through an old English edition, without an independent check of their Spanish manuscripts.',
      cite(
        'manila-shipbuilding-1618-1619',
        'Fajardo: private/regional ships and proposed galley labor; Pineda heading/purpose',
      ),
    ),
    sec(
      'A fragment has more than one possible explanation',
      'The Tamál-Húye project account reports collaboration with Federated Indians of Graton Rancheria. Its use of several kinds of evidence is valuable without becoming community approval of this atlas. A fragment’s location, wear and association with other objects matter when evaluating possible uses. The project’s models are research questions, not a claim that each imported vessel became a tool or ritual object. The later Mexican jar raises another limit: a collecting record and a photograph are not the same as an excavated wreck association. Keeping those contexts separate makes comparison more informative.',
      cite(
        'manila-tamal-huye-project',
        'Project partnership and methodological/alternative-use sections',
      ),
      cite('met-9198', 'Selected catalogue and supplied photograph'),
    ),
    sec(
      'A shipping record has its own omissions',
      'The Santo Cristo study shows why a declared value cannot automatically measure the entire shipment. Named entries allow a bounded inquiry, while omitted contents, mixed measures and incomplete values limit totals. Original registration and arrival records still need independent comparison.',
      cite('manila-santo-cristo-2022', 'PDF 6, 10–11 and 14: registration limits'),
    ),
  ];
  s.evidenceReading = {
    title: 'Separate cargo, working conditions and a later object',
    introduction:
      'These are editorial paraphrases. A ship’s documented episode, reports by colonial officials and a museum object each establish different things.',
    items: [
      {
        label: 'An excavated fragment has a context to investigate',
        text: 'The Point Reyes account associates porcelain finds with a 1595 wreck and Coast Miwok village contexts, while keeping a separate Drake-deposit suggestion tentative.',
        interpretation:
          'Context can support a particular connection without recovering every use, owner or cargo item. A proposed ceremonial or practical interpretation is not automatically a demonstrated function for each fragment. The selected Mexican jar is much later.',
        citations: [
          cite(
            'point-reyes',
            'Porcelain identification, San Agustín and tentative Drake attribution',
          ),
          cite('manila-tamal-huye-project', 'Alternative-use models'),
        ],
      },
      {
        label: 'A reported wage is not proof of payment or consent',
        text: 'Pineda identifies skilled tasks and pay schedules but also reports arrears and people leaving. Fajardo describes burdens on royal workers and their communities.',
        interpretation:
          'The complaints expose relationships behind shipbuilding. Their authors serve colonial government, not a neutral survey of workers. Fajardo’s distinction for smaller private regional ships cannot be transferred to every oceanic vessel or taken as proof of enforcement.',
        citations: [
          cite(
            'manila-shipbuilding-1618-1619',
            'Selected Fajardo and Pineda labor passages',
          ),
        ],
      },
      {
        label: 'A later Mexican jar is not a recovered shipment',
        text: 'The supplied photograph shows patterned panels and floral forms. The Met identifies Mexican tin-glazed earthenware, ca. 1680–1700, accession 11.87.36.',
        interpretation:
          'Surface arrangement is observable; date, material and geography use catalogue research. Neither establishes its buyer, original contents or voyage. The date alone prevents putting it aboard the San Agustín in 1595.',
        citations: [cite('met-9198', 'Actual photograph; Artwork Details')],
      },
    ],
  };
  s.familyActivity = {
    title: 'One jar, two dates and a question about work',
    duration: '10–15 minutes',
    steps: [
      'Find one repeated panel and a floral form in the supplied jar image. Describe how they fit the curved body without guessing a maker.',
      'Read the source capsule. Make cards for visible observation, catalogue identification and a dated written or archaeological account.',
      'Sort “the panels repeat,” “the jar is Mexican earthenware” and “the San Agustín wrecked in 1595.” Explain why the later jar cannot be that wreck’s cargo.',
      'Write one supported statement about making or movement, then one question about a worker that these records cannot answer.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the Met identifies this jar as Mexican tin-glazed earthenware, made approximately 1680–1700. The NPS describes a different episode: the San Agustín wrecked in 1595 while travelling from the Philippines toward Mexico. Official reports from 1618 and 1619 describe skilled shipbuilding and burdens on workers and communities. Those reports do not identify this jar’s potters, and its image cannot establish working conditions or a voyage.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian or relevant community approval',
    scope:
      'A wreck episode, translated official work reports, a later Mexican jar and a particular registered consignment. Three selected rereads retain earlier scopes; three new source records keep method, purpose and dates separate. Original case, claims, object order, dimensions and image bytes remain intact.',
    limitations: [
      'Full case 1565–1815, selected reference 1565–1726, wreck 1595, reports 1618/1619, jar ca. 1680–1700 and 1726 consignment are separate. The C7 display edge does not end the trade.',
      'Only selected old English translations were read; no independent Spanish manuscripts, worker petitions, complete cargo manifest or original excavation datasets consulted. Officials’ accounts are not universal labor histories.',
      'The NPS project’s alternative-use models and reported partnership are not all proved outcomes or approval of this atlas. Its update is 2023, not a fresh 2026 field report; the differing 1573 shorthand is excluded.',
      'No new source image, plan, numeric point or precise voyage line adopted. Whole-paper challenges/access failures remain documented without bypass.',
      'The 1726 registration study was read in selected exposed PDF text; page images and original manuscript were not inspected. It is not a delivery receipt, the selected jar’s shipment or a complete quantified trade series.',
      'Independent specialist/community review, real family use, human accessibility/device behavior and physical print acceptance remain open.',
    ],
  };
}
