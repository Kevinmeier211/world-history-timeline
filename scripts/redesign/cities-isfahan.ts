import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const isfahanHouseholdSources: Source[] = [
  {
    id: 'julfa-merchant-correspondence-2026',
    title:
      'Records from a Luxurious Past: Gem Inventory of a Seventeenth-Century Armenian Merchant',
    institution: 'Gemological Institute of America, Gems & Gemology 62/1',
    author: 'Sona Tajiryan',
    url: 'https://www.gia.edu/gems-gemology/spring-2026-gem-merchant-inventory',
    type: 'scholarship',
    published: 'Spring 2026',
    accessed: consulted,
    scope:
      'Selected HTML abstract/opening provenance discussion, Girach-Mirman family-firm and Commenda Contracts and Agents paragraphs, and Turquoise correspondence with notes 44–45 read. The particular firm pooled funds in New Julfa in 1656; a translated 1700 letter discusses prices and obtaining turquoise. These are gem-trading examples, not this carpet’s transaction or every Julfan household. The 1688 inventory is mediated through a later Italian translation; its Armenian original is unaccounted for. No full article/appendix, complete 187-page booklet, original archive collation, inventory totals, mining-origin reconstruction or figure pixels consulted. No image, map, archival page or source geometry reused.',
  },
  {
    id: 'julfa-anna-letter-1747',
    title: 'A Lock of Hair: selected translation of Anna Khatoon’s letter',
    institution: 'UCLA, Richard Hovannisian Endowed Chair in Modern Armenian History',
    url: 'https://modernarmenianhistory.history.ucla.edu/2020/01/31/blog-6/',
    type: 'primary',
    published:
      'Letter dated 9 August 1747 in supplied translation; account dated 10 May 2015, site header 31 January 2020',
    accessed: consulted,
    scope:
      'Selected short scholarly account and English translation of letter 1534: Anna Khatoon/Annam’s New Julfa location, addressee, family greetings, request for a safe return, enclosed lock of hair and rendered date read. This 1747 comparison is later than the entire 1598–1722 atlas case, not testimony to the 1604 deportation. No independent Armenian translation, calendar conversion, original TNA letter-image inspection, complete letter or full family biography claimed. Hypotheses about a scribe, literacy or the hair’s purpose are not adopted as recovered fact. No letter, hair or tombstone photograph reused; no open image licence established.',
  },
];

export const isfahanHouseholdContext: HistoricalContext = {
  id: 'isfahan-julfa-households-context',
  title: 'New Julfa: forced settlement, work and surviving family records',
  region: 'West/Central Asia',
  interval: {
    start: 1604,
    end: 1747,
    label: 'Selected New Julfa records, 1604–1747; final letter is later comparison',
    precision: 'range',
    note: 'A frame for selected events and differently dated records, not a community’s lifespan or a political boundary. The complete Isfahan capital-phase case remains 1598–1722. The 1747 family letter is explicitly later than that case; a seventeenth-century carpet, an individual firm’s records and modern source publications have separate dates.',
  },
  summary:
    'Coerced movement and unequal households belong beside skilled making and commercial coordination. Dated records reveal particular people and relationships, without supplying one experience for all Armenians or identifying the selected carpet’s makers.',
  subjectIds: ['isfahan-silk'],
  citations: [
    cite(
      'julfa-forced',
      'Origin, settlement, and population; Society and administration',
    ),
    cite(
      'julfa-merchant-correspondence-2026',
      'Family firm and translated correspondence',
    ),
    cite('julfa-anna-letter-1747', 'Letter 1534: supplied translation and date'),
  ],
  phases: [
    {
      year: 1604,
      label: '1604: destruction and forced movement from Old Julfa',
      title: 'Commercial importance followed coercion',
      text: 'Ghougassian describes the destruction of Old Julfa and forced Armenian relocation during the Ottoman–Safavid war. Later privileges or prosperity do not make the movement voluntary. The account distinguishes the circumstances of merchants from those of other deportees; no settled mass-deportation total is supplied here.',
      citations: [cite('julfa-forced', 'Origin, settlement, and population: 1604')],
    },
    {
      year: 1605,
      label: '1605: settlement begins at New Julfa',
      title: 'A new quarter required buildings and everyday work',
      text: 'The Iranica account places the beginning of New Julfa’s settlement in early summer 1605 on the southern bank of the Zayandarud. Houses and churches formed part of a community built after forced movement. This date is distinct from the conventional 1597–98 capital transfer and does not date every surviving building.',
      citations: [
        cite('julfa-forced', 'Origin, settlement, and population: early summer 1605'),
        cite('isfahan-capital', 'Isfahan as the Safavid Capital: gradual development'),
      ],
    },
    {
      year: 1655,
      label: '1655–1659: a later movement of Armenian artisans',
      title: 'Settlement did not end state-directed displacement',
      text: 'Ghougassian identifies later expulsions of Armenian artisans from Isfahan and movement toward New Julfa in 1655–1659. This is a different episode from the 1604 deportation. It should not be merged into one journey or made the assumed biography of every craft household.',
      citations: [
        cite('julfa-forced', 'Origin, settlement, and population: 1655–1659'),
      ],
    },
    {
      year: 1656,
      label: '1656: funds pooled in one family firm',
      title: 'A particular business joined capital and travelling agents',
      text: 'Tajiryan’s selected account dates the Girach-Mirman brothers’ pooling of funds in New Julfa to 1656. It describes partnerships between capital holders and travelling agents, coordinated through commercial information. This particular gem-trading firm is not evidence for every household’s organization or a transaction involving the Doria carpet.',
      citations: [
        cite(
          'julfa-merchant-correspondence-2026',
          'Family-firm paragraph; Commenda Contracts and Agents',
        ),
      ],
    },
    {
      year: 1700,
      label: '1700: a translated letter negotiates turquoise prices',
      title: 'Information was part of commercial work',
      text: 'The paper presents a 1700 exchange between Herapet di Martin and Amirbēk di Vardan about the price and availability of turquoise. It exposes a practical disagreement, rather than a smooth, automatic flow of goods. The supplied translation does not establish a carpet shipment, complete route or the behavior of all merchants.',
      citations: [
        cite(
          'julfa-merchant-correspondence-2026',
          'Turquoise: translated 1700 correspondence; note 45',
        ),
      ],
    },
    {
      year: 1747,
      label: '1747: a later family letter, outside the atlas case interval',
      title: 'A household message adds another perspective on separation',
      text: 'The UCLA account supplies passages from Anna Khatoon’s letter to her husband, a textile merchant, including family news and a request for his safe return. Its rendered date is 9 August 1747. This is a later comparison with the 1598–1722 case, not an eyewitness account of 1604 or a voice representing every woman.',
      citations: [
        cite(
          'julfa-anna-letter-1747',
          'Letter 1534: author/addressee; translated last page',
        ),
      ],
    },
  ],
};

export const isfahanUrbanWorkDimension = {
  text: 'Squares, shops, caravansaries, workshops and households supported different kinds of work. New Julfa’s commercial institutions followed coerced relocation; a particular merchant firm and family letter expose coordination and separation without identifying this carpet’s makers or making every household prosperous.',
  citations: [
    cite('isfahan-capital', 'New commercial centre and named urban relationships'),
    cite('julfa-forced', 'Forced settlement and Society and administration'),
    cite('julfa-merchant-correspondence-2026', 'Family firm and correspondence'),
    cite('julfa-anna-letter-1747', 'Later family letter'),
  ],
};

export function applyCitiesIsfahan(c: Corpus): void {
  for (const source of isfahanHouseholdSources)
    if (!c.sources.some((row) => row.id === source.id)) c.sources.push(source);
  for (const [id, scope] of [
    [
      'isfahan-capital',
      'Selected Isfahan as the Safavid Capital paragraphs reconsulted: conventional 1597–98 proclamation, mobile-court caveat, gradual development, new square/bazaar/commercial centre southwest of the older centre, and New Julfa south of the river. No measured street plan, household census, complete chronicle or linked figure consulted. Direct local capture returned 403; exposed official article text was read without retry or generate-PDF workaround.',
    ],
    [
      'julfa-forced',
      'Selected Origin, settlement, and population and Society and administration paragraphs reconsulted, including 1604 coercion/1605 settlement, 1655–1659 artisan moves, different kinds of craft/service work and particular 1652/1659/1697 wills. Original Armenian chronicle, wills and cited architectural study not independently read. No settled deportee total, universal household experience or present community assent inferred. Direct local capture returned 403 without alternate-route retry; figures not reused.',
    ],
    [
      'safavid-silk',
      'Selected exposed essay body on rural raw-silk producers, urban private/court workshops, makers and weaving/design, plus author/date reconsulted. Its compressed sentence joining the 1598 capital change to Armenian relocation is not adopted: 1604 coercion and 1605 settlement remain separately dated from Ghougassian. Broad aesthetic-decline judgments are excluded. Cloth techniques are not all assigned to this knotted-pile carpet. No linked book, image or original state account consulted.',
    ],
    [
      'met-451028',
      'Opening description, visible Artwork Details and Public Domain statement reconsulted; actual existing 757×1600 carpet image inspected unchanged. The paired type, nineteenth-century Polonaise misattribution, several Iranian production centres, material identification and accession remain distinct from a certain individual workshop, weaver, buyer or route. Current provenance/other tabs, paired-carpet pixels, remote-image parity and exposure date not verified.',
    ],
  ] as const) {
    const source = c.sources.find((row) => row.id === id)!;
    const marker = 'Isfahan household selected renewal, 2026-10-29:';
    if (!source.scope.includes(marker)) {
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker} ${scope}`;
      source.accessed = consulted;
    }
  }
  if (!c.contexts!.some((row) => row.id === isfahanHouseholdContext.id))
    c.contexts!.push(isfahanHouseholdContext);
  const s = c.subjects.find((row) => row.id === 'isfahan-silk')!;
  s.contextIds = [...new Set([...(s.contextIds ?? []), isfahanHouseholdContext.id])];
  s.summary =
    'Isfahan’s prosperity joined urban building, rural silk, skilled making, commerce and household work. New Julfa’s institutions developed after forced relocation. The carpet, merchant correspondence and a later family letter make different relationships visible without identifying one common experience, a particular weaver or a route for this object.';
  s.sections = [
    sec(
      'A new centre within an older city',
      'Isfahan did not begin with the conventional capital transfer of 1597–98. Haneda and Matthee describe gradual development and a mobile royal household. A new governmental and commercial centre grew southwest of the older one. Shops, caravansaries, bathhouses and coffeehouses gathered around the royal square and adjacent bazaar; the older centre remained important. A bazaar entrance stood at the square’s north end. This relationship makes the square one connection within a larger city, rather than a picture of its entire economy. These named relationships explain how buying, lodging and service work shared urban space. New Julfa lay south of the Zayandarud, rather than inside every picture of the royal square.',
      cite(
        'isfahan-capital',
        'Isfahan as the Safavid Capital: new commercial centre and urban quarters',
      ),
    ),
    sec(
      'Silk connected several kinds of making',
      'Munroe distinguishes rural raw-silk producers, private urban workshops and court production. Dyers, weavers, embroiderers and designers contributed different skills. Repeated patterns required coordination between design and material work. The Met identifies the selected Doria carpet as silk pile with metal-wrapped thread, made with knotting and brocading. This is a particular carpet technique, not every cloth process in the essay. The type is associated with several Iranian centres, including Isfahan, Yazd and Kashan; its appearance cannot name the individual workshop or weavers.',
      cite('safavid-silk', 'Producer/workshop and pattern/weaving paragraphs'),
      cite('met-451028', 'Opening description; Artwork Details: Medium'),
    ),
    sec(
      'A prosperous quarter followed forced movement',
      'In 1604, state-directed destruction and deportation uprooted Armenians from Old Julfa. Settlement at New Julfa began in 1605. Ghougassian distinguishes mercantile deportees from other displaced people and identifies later movements of artisans. Houses, churches, craft and service work helped make the new community. Painters and metalworkers appear beside gardeners, porters and other laborers in the account. Privileges for some merchants and later commercial achievement do not turn coercion into voluntary migration or establish equal wealth and freedom within the quarter.',
      cite(
        'julfa-forced',
        'Origin, settlement, and population; Society and administration',
      ),
    ),
    sec(
      'Commerce required relationships and information',
      'Tajiryan’s study describes the Girach-Mirman brothers pooling funds in New Julfa in 1656. Their particular gem-trading business paired capital with travelling agents and correspondence. A translated 1700 letter about turquoise exposes disagreement over prices and the difficulty of obtaining goods. Negotiating and sharing information were work, alongside transporting or making things. This example does not document a silk transaction or the selected carpet’s journey. Reading it beside the urban and craft accounts adds practical coordination without reducing the city to a ruler’s building program.',
      cite(
        'julfa-merchant-correspondence-2026',
        'Family firm; Commenda Contracts and Agents; Turquoise correspondence',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'A household could contain unequal dependencies',
      'Ghougassian’s synthesis draws on fragmentary histories, colophons, letters and community records. Its particular seventeenth-century wills reveal houses, commercial holdings, servants and enslaved dependants; some grants of freedom were delayed until the owner’s death. These examples make dependence part of a prosperous community’s history. They do not supply an average household, establish that every servant was enslaved or make all residents wealthy merchants. The original wills were not independently consulted here. An account of collective institutions therefore needs questions about who controlled property and whose work sustained it.',
      cite(
        'julfa-forced',
        'Society and administration: sources, occupations and particular wills',
      ),
    ),
    sec(
      'A later family voice changes the question',
      'The UCLA account presents Anna Khatoon’s letter from New Julfa to her husband, a textile merchant. Its supplied translation includes family greetings, a request for his safe return and an enclosed lock of hair. The rendered date, 9 August 1747, is later than the entire 1598–1722 case. This comparison brings separation and family communication into view without becoming testimony to the 1604 deportation. It is one mediated voice, not every woman’s experience. Together with commercial correspondence, it suggests that letters could carry different concerns within distant trade relationships. The original manuscript and Armenian translation were not independently checked, and the author’s hypotheses about literacy or the hair’s purpose remain hypotheses.',
      cite(
        'julfa-anna-letter-1747',
        'Author/addressee; selected translation and last-page date',
      ),
      cite(
        'julfa-merchant-correspondence-2026',
        'Commercial correspondence and information',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'A carpet, a business disagreement and a later family message',
    introduction:
      'These are editorial paraphrases of different records. The supplied image supports observation; catalogue and translated documents supply other claims. Their dates and limits remain separate.',
    items: [
      {
        label: 'An attractive surface is not a workshop address',
        text: 'The photograph shows repeated curving forms, a central field and borders. The catalogue identifies silk pile, metal-wrapped thread and an Iranian type once wrongly called Polonaise.',
        interpretation:
          'Visible arrangement can be checked in the image. Material, attribution and collecting history require the catalogue. Several centres are named for the type; this does not establish an Isfahan address, Armenian maker, named buyer or exact export route for accession 50.190.5.',
        citations: [
          cite(
            'met-451028',
            'Actual supplied photograph; opening description and Artwork Details',
          ),
        ],
      },
      {
        label: 'A translated disagreement reveals coordination',
        text: 'Tajiryan presents a 1700 exchange between Herapet di Martin and Amirbēk di Vardan concerning turquoise prices and obtaining supplies.',
        interpretation:
          'The particular exchange makes negotiation and information visible. It is a gem-trading example, not a carpet shipment or an account of every Julfan firm. The selected paper and translation were consulted; the original Armenian archive was not independently collated.',
        citations: [
          cite(
            'julfa-merchant-correspondence-2026',
            'Turquoise: translated 1700 correspondence; note 45',
          ),
        ],
      },
      {
        label: 'A later letter offers a particular household perspective',
        text: 'The UCLA account supplies translated passages from Anna Khatoon’s family letter, including greetings, a request for her husband’s safe return and the date rendered as 9 August 1747.',
        interpretation:
          'Its later date matters: this is outside the atlas case, not eyewitness evidence for 1604. One letter cannot stand for every woman, household or displaced person. No independent translation, calendar conversion or explanation of the enclosed hair’s purpose was established here.',
        citations: [
          cite(
            'julfa-anna-letter-1747',
            'Letter 1534: selected English translation and last-page date',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What can a carpet show—and what needs another record?',
    duration: '10–15 minutes',
    steps: [
      'Look at the supplied carpet image. Point to a repeated curving form and a border. Describe their arrangement without guessing the maker’s identity.',
      'Read the source capsule together. Make three cards: visible observation, catalogue identification and a dated written account.',
      'Place “the border repeats a form,” “the carpet uses silk pile” and “New Julfa settlement followed forced movement” with the records that support them.',
      'Write one supported statement about work or movement and one question about a household or maker that these records cannot answer.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the Met identifies this as a seventeenth-century Iranian carpet type, made with silk pile and metal-wrapped thread, without securely assigning it to one workshop. Ghougassian dates forced movement from Old Julfa to 1604 and the start of New Julfa settlement to 1605. A particular merchant firm’s records show commercial coordination; a family letter dated 1747 is a later comparison outside the case. The carpet image cannot establish those events or identify all the people who made it.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian or Armenian community approval',
    scope:
      'Urban relationships, making, forced settlement and particular commercial/household records. Four selected rereads retain earlier dated scopes; two new textual sources distinguish scholarship and a supplied translation. Three further source records support two modern published property references and a verbal bridge connection. Original case, claims, comparison texts, object order and image bytes remain intact.',
    limitations: [
      'The 1598–1722 case, 1601–1700 carpet envelope, selected 1604–1747 record frame and modern publications are separate. The 1747 letter is later comparison, not 1604 testimony.',
      'No original chronicle, will, archival inventory or Armenian letter independently collated. Selected translations and institutional scholarship do not represent all residents, workers or women.',
      'The Met essay’s compressed 1598 relocation sentence is excluded; the separately sourced 1604/1605 sequence is retained. No settled deportee total, individual carpet workshop, buyer or itinerary inferred.',
      'Two modern published property-reference points are adopted, with a textual bridge relationship. No measured street or river plan, bridge coordinate, quarter boundary, household or workshop location, route, copied figure or new image is adopted. Local Iranica captures returned 403; exposed article text was consulted without bypass.',
      'Independent historical/community review, real family use, human screen-reader/device behavior and physical print acceptance remain open.',
    ],
  };
}
