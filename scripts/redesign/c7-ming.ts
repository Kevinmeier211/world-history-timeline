import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const mingWorkshopSources: Source[] = [
  {
    id: 'ming-palace-production-2016',
    title:
      'Porcelain from the Ming and Qing Dynasty Imperial Kilns: Archaeological Finds at the Palace Museum and in Jingdezhen',
    institution:
      'The Palace Museum; Jingdezhen Ceramic Archaeology Institute and partners',
    url: 'https://intl.dpm.org.cn/exhibition/details/63304.html',
    type: 'archaeology',
    published: '2016–2017 exhibition; webpage publication date unstated',
    accessed: consulted,
    scope:
      'Complete short exhibition body, organizers and 25 October 2016–26 February 2017 dates read. Institutional account of official designs, inspection, permitted distribution and destruction/burial of rejected or damaged imperial wares. Its closed-cycle model is not a universal description of private kilns, every century or successful enforcement. No full catalogue, original administrative record, field report or source image inspected; no defect rate or completed-order total inferred. Palace Museum copyright retained; no photograph, poster or geometry reused.',
  },
  {
    id: 'ming-palace-kilns-2018',
    title:
      'Ceramics of the Ming Imperial Kilns: Comparing Excavated and Palace Museum Ceramics of the Jiajing, Longqing and Wanli Reigns',
    institution: 'The Palace Museum and Jingdezhen municipal government',
    author: 'English translation/editing: Adam J. Ensign and Kang Xiaolu',
    url: 'https://intl.dpm.org.cn/exhibition/details/63336.html',
    type: 'archaeology',
    published: '2018-11-06; exhibition 2018-11-07–2019-06-15',
    accessed: consulted,
    scope:
      'Complete exhibition body, credits and date fields read. Describes finds/excavations since the 1970s/1980s, comparison of fragments and collection objects, and changes across Jiajing, Longqing and Wanli production. Reports imperial operations ceased in 1608 while private production continued. Its later 1681 restart and explicit 1683 scholarly alternative are not reconciled or used as Ming endpoints. Broad quality/quantity decline and single political cause are not adopted as universal histories. No full catalogue, excavation dataset or source-image pixels consulted; no source artwork copied.',
  },
  {
    id: 'ming-npm-production',
    title: 'The Magic of Kneaded Clay: Ming Dynasty',
    institution: 'National Palace Museum, Taipei',
    url: 'https://www.npm.edu.tw/exh99/ceramics/html/page_en_05.html',
    type: 'scholarship',
    accessed: consulted,
    scope:
      'Complete short Ming Dynasty section and adjacent object caption read; webpage date not established from its URL. Early-Ming Longquan/Jingdezhen official wares, central models and superintendents, selected court supply, coexisting civilian kilns and later changes. Superlatives and blanket quality hierarchies are excluded. Not a worker census, precise founding date, original regulation or proof of enforcement. Linked catalogue/images not inspected; National Palace Museum copyright remains separate and no source image or diagram reused.',
  },
  {
    id: 'ming-cuhk-markets-2022',
    title: 'Enchanting Expeditions: Chinese Trade Porcelains across the Globe',
    institution:
      'Art Museum, The Chinese University of Hong Kong; Google Arts & Culture',
    author:
      'Based on Guanyu Wang’s exhibition catalogue; online team Lincoln Lam, Georgia Chu and Lucia Chan',
    url: 'https://artsandculture.google.com/story/enchanting-expeditions-chinese-trade-porcelains-across-the-globe-art-museum-the-chinese-university-of-hong-kong/rAXhy7Zg9ox7ow?hl=en',
    type: 'scholarship',
    published: '2022 exhibition content; story publication date unverified',
    accessed: consulted,
    scope:
      'Selected Thriving Country of China section, adjacent Jiajing/Wanli examples and story credits actually read. Links domestic demand, overseas customers and Jiajing-period allocation of court orders to capable private kilns. Other regional kiln products remain distinct. Full catalogue, source-object provenance, later Qing sections and actual story-image pixels not consulted. No shipment, exact route, individual buyer for accession 17.127.2 or single common court system inferred. No reusable photo/map licence established and no motif/geometry copied.',
  },
  {
    id: 'ming-workshop-texts-2013',
    title:
      'From Object to Concept: Global Consumption and the Transformation of Ming Porcelain',
    institution: 'Hong Kong University Press',
    author: 'Stacey Pierson',
    url: 'https://hkupress.hku.hk/image/catalog/pdf-preview/9789888139835.pdf',
    type: 'scholarship',
    published: '2013; ISBN 978-988-8139-83-5',
    accessed: consulted,
    scope:
      'Selected printed pp. 9–12/PDF 15–18 read in text and actual page pixels; adjacent p. 8 text encountered. Selected endnotes 50–63 read in exposed text, including Stephen Little’s 1996 translation attribution at PDF 33. Not the whole 66-page preview, complete book, Chinese editions, diary, Tiangong kaiwu or linked Little paper. Specialist production, an elite buyer and Shao Bao’s moralizing preparation account are mediated through Pierson. No exact workforce, daily schedule, loss rate, recipe or jar-maker identification adopted. © HKU Press 2013; no figure/page copied into the product.',
  },
];

export const mingWorkshopsContext: HistoricalContext = {
  id: 'ming-kilns-markets-context',
  title: 'Ming ceramics: court orders, private kilns and changing demand',
  region: 'East Asia',
  interval: {
    start: 1368,
    end: 1644,
    label: 'Selected production changes within the Ming period, 1368–1644',
    precision: 'exact',
    note: 'Uses conventional dynastic boundaries to orient selected institutional changes, not the beginning/end of Jingdezhen pottery, private enterprise or makers’ lives. Reign ranges, an order for related jars and this object’s mid-sixteenth-century attribution remain distinct. A 1608 imperial-kiln stoppage is a reported institutional event, not the end of all production. Later Qing restart alternatives are outside this frame.',
  },
  summary:
    'Court models, inspection, private contracts and several markets connected different kinds of work. Their relationships changed; an object’s fine decoration does not establish its precise commission, maker or buyer.',
  subjectIds: ['ming-workshops'],
  citations: [
    cite('ming', 'Conventional Ming dates and final decorative-arts paragraphs'),
    cite('ming-npm-production', 'Early and late Ming production paragraphs'),
    cite('ming-palace-kilns-2018', 'Jiajing, Longqing and Wanli comparison'),
  ],
  phases: [
    {
      year: 1368,
      label: 'Early Ming: official production within a wider ceramic economy',
      title: 'Court supply depended on particular production arrangements',
      text: 'The marker begins the conventional Ming period, not a precisely dated workshop foundation. The National Palace Museum identifies both Longquan and Jingdezhen in early official supply, then describes court models, supervision and selected products. These are institutional relationships, not a statement that every ceramic was made for the ruler.',
      citations: [
        cite('ming', 'Title: Ming Dynasty (1368–1644)'),
        cite('ming-npm-production', 'First three Ming Dynasty paragraphs'),
      ],
    },
    {
      year: 1522,
      label: 'Jiajing period, 1522–1566: connected official and private work',
      title: 'An order could cross the boundary between kiln organizations',
      text: 'The CUHK account places allocation of court orders to capable private kilns in the Jiajing period when imperial capacity was insufficient. This broad reign marker does not date a specific contract or identify who made the selected jar. Its catalogue retains a mid-sixteenth-century attribution and a separate inherited search envelope.',
      citations: [
        cite('ming-cuhk-markets-2022', 'Thriving Country of China: court orders'),
        cite('met-42549', 'Artwork Details: Period and Date'),
      ],
    },
    {
      year: 1542,
      label: '1542: a written reference to jars with related pond scenes',
      title: 'A dated order is evidence for related production, not this jar’s batch',
      text: 'The Met cites contemporary records for jars with similar pond decoration in 1542. That catalogue-mediated reference belongs beside the material object, but does not make accession 17.127.2 a securely identified member of that order. No original Chinese order or complete factory ledger was consulted here.',
      citations: [cite('met-42549', 'Opening description: related jars in 1542')],
    },
    {
      year: 1608,
      label: '1608: a reported stoppage of imperial operations',
      title: 'A particular institution’s change did not end skilled production',
      text: 'The Palace Museum exhibition reports that imperial-kiln operations ceased in 1608 and describes flourishing private production afterward. This is an attributed institutional account, not a shutdown of every kiln or an end of Chinese ceramic culture. The conventional 1644 boundary ends this selected Ming frame; makers and production have later histories.',
      citations: [
        cite('ming-palace-kilns-2018', 'Wanli operations and private production'),
        cite('ming', 'Conventional Ming endpoint'),
      ],
    },
  ],
};

export const mingWorkDimension = {
  text: 'Porcelain joined shaping, surface decoration, official designs, inspection and buying. Court supervision and private production could overlap; neither a reign mark nor a beautiful surface identifies every worker, a fulfilled commission or a particular customer.',
  citations: [
    cite('met-42549', 'Catalogue technical identification'),
    cite('ming-palace-production-2016', 'Design, inspection and distribution'),
    cite('ming-cuhk-markets-2022', 'Private production and court orders'),
  ],
};

export function applyWorkshopsMing(c: Corpus): void {
  for (const row of mingWorkshopSources)
    if (!c.sources.some((source) => source.id === row.id)) c.sources.push(row);
  for (const [id, scope] of [
    [
      'ming',
      'Title, author/date and final two decorative-arts paragraphs reconsulted through exposed official web text: inherited West Asian connections and court Bureau of Design. No linked ordinance or bureau archive read. Direct local capture returned 429; no alternate route retried. Essay images not reused.',
    ],
    [
      'met-42549',
      'Visible opening technical description, Artwork Details and Public Domain label reconsulted through official web text; existing local image actually inspected unchanged. Similar-jar 1542 order and other-jars red-over-yellow evidence remain catalogue-mediated, not this accession’s proven batch or new pigment analysis. Current provenance-tab contents not read; earlier scope remains dated. Direct local capture returned 429 without retry. Camera date and remote byte parity unverified.',
    ],
  ] as const) {
    const source = c.sources.find((row) => row.id === id)!;
    const marker = 'Ming workshop selected renewal, 2026-10-29:';
    if (!source.scope?.includes(marker)) {
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope ?? ''} ${marker} ${scope}`;
      source.accessed = consulted;
    }
  }
  if (!c.contexts!.some((row) => row.id === mingWorkshopsContext.id))
    c.contexts!.push(mingWorkshopsContext);
  const s = c.subjects.find((row) => row.id === 'ming-workshops')!;
  s.contextIds = [...new Set([...(s.contextIds ?? []), mingWorkshopsContext.id])];
  s.summary =
    'Making Ming porcelain connected skilled surface work with designs, supervision and customers. Court orders mattered alongside private kilns and several markets. The selected fish jar makes materials inspectable, while changing production arrangements explain why a dynasty’s ceramics cannot be reduced to one style, maker or audience.';
  s.sections = [
    sec(
      'A surface joins different kinds of work',
      'The fish jar combines a shaped porcelain body with decoration at different layers. The Met identifies cobalt painting beneath the glaze and coloured enamels above it. Look at how fish, plants and repeated borders fit the curved surface. Shaping, applying decoration and obtaining a finished vessel are connected tasks. The catalogue identifies the material and a broad production context; the photograph alone cannot reveal every technical step or name a maker. Pierson’s discussion of an official’s account follows quarried material through crushing, washing and preparation for shaping. Work began before the painted surface existed. Preparing usable material and controlling form made later decoration possible; a finished jar joins activities that a single photograph cannot separate.',
      cite('met-42549', 'Artwork Details: Medium; supplied photograph'),
      cite(
        'ming-workshop-texts-2013',
        'Printed p. 12 / PDF 18: mediated preparation account',
      ),
    ),
    sec(
      'An official order needed more than a design',
      'The court coordinated some decorative production through a Bureau of Design. The National Palace Museum describes models, appointed supervisors and selection of finished pieces for court use. Its early-Ming account includes both Longquan and Jingdezhen, rather than one city standing for all ceramics. Designs helped specify what to make, but production also required people to turn those requirements into objects. Official supervision was a relationship among institutions and workshops, not an explanation that removes the makers’ practical decisions.',
      cite('ming', 'Final paragraph: Bureau of Design'),
      cite('ming-npm-production', 'Early official production and supervision'),
    ),
    sec(
      'Inspection and buying linked different organizations',
      'The Palace Museum’s archaeological exhibition account describes inspection of imperial wares and disposal of rejected pieces. Such fragments matter alongside objects preserved in collections: they record selection as part of production. Private kilns also made porcelain. CUHK’s museum account explains that, during the Jiajing period, capable private producers could receive court orders beyond imperial capacity. Domestic buyers and overseas customers created other demand. Court and market work therefore cannot always be sorted into two isolated worlds.',
      cite('ming-palace-production-2016', 'Quality testing and disposal'),
      cite('ming-cuhk-markets-2022', 'Thriving Country of China'),
    ),
    sec(
      'Demand and institutions changed',
      'The Palace Museum compares excavated fragments with surviving objects across the Jiajing, Longqing and Wanli reigns. It describes changing ranges of designs and reports imperial operations stopping in 1608, while private kilns continued. A change at the imperial works was not the end of pottery making. These shifts help answer who influenced an object’s appearance: patrons, administrators, buyers and skilled producers all enter the account. The selected jar remains a mid-sixteenth-century work, without an invented buyer, shipping route or complete workshop biography.',
      cite('ming-palace-kilns-2018', 'Reign comparison and reported 1608 stoppage'),
      cite('met-42549', 'Mid-sixteenth-century catalogue attribution'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Selection changes the objects that survive',
      'The Palace Museum brings production fragments into comparison with collected vessels. Its inspection account makes rejected and damaged wares part of the explanation, rather than treating an intact museum object as a complete record of making. Comparing these different survivals can test design classifications and production histories. The exhibition summaries do not provide a measured rejection rate or account for every object that circulated.',
      cite('ming-palace-production-2016', 'Inspection and disposal account'),
      cite('ming-palace-kilns-2018', 'Excavated fragments beside collection objects'),
    ),
    sec(
      'Related evidence does not identify a particular object',
      'The Met mentions a 1542 order for similar pond-scene jars. A relationship of subject and period is useful without proving this jar belonged to that batch. Its technical account also draws on wear in comparable jars when explaining colour layers. Keep that comparative argument separate from a new analysis of this vessel. A reign mark helps frame attribution; it does not supply the names and experiences of all makers.',
      cite('met-42549', 'Opening technical description and related-jar records'),
    ),
    sec(
      'An institutional account is a question to investigate',
      'The museum’s controlled-production account describes standards and permitted distribution. It does not establish that every instruction was followed. The market account adds contracted work and customers beyond the palace. Reading them together explains why private and official activities could intersect without identifying every transaction. Overseas sales also do not assign a particular voyage to every surviving pot. Further workshop, labor and commercial records are needed to explain conditions and changing bargaining power.',
      cite('ming-palace-production-2016', 'Institutional production model'),
      cite('ming-cuhk-markets-2022', 'Selected private-kiln and market account'),
    ),
  ];
  s.evidenceReading = {
    title: 'A material identification, an account of work and a production history',
    introduction:
      'These are editorial paraphrases. Visible colours, technical catalogue information, a translated official’s essay and archaeological comparisons have different purposes and limits.',
    items: [
      {
        label: 'The surface can be observed; its technique needs identification',
        text: 'The photograph shows fish, plants and borders on a rounded jar. The catalogue identifies underglaze cobalt and overglaze enamels, and cites records for similar jars in 1542.',
        interpretation:
          'A visible pattern and technical attribution support different claims. The related order does not identify this jar’s batch, maker, customer or voyage; comparative colour evidence is not a newly performed assay of this object.',
        citations: [cite('met-42549', 'Actual image, technical description and Date')],
      },
      {
        label: 'An official’s analogy is a purposeful account of work',
        text: 'Pierson presents Shao Bao’s description of preparation through Stephen Little’s translation. The official turns ceramic making into an analogy for moral development.',
        interpretation:
          'This mediated viewpoint makes work discussable without becoming the speech of every worker, a chemical recipe or a measured schedule. The original Chinese edition and full translation source were not independently consulted.',
        citations: [
          cite('ming-workshop-texts-2013', 'Printed pp. 11–12; PDF 17–18; note 56'),
        ],
      },
      {
        label: 'Fragments and collected objects reveal selection and change',
        text: 'The Palace Museum compares excavated kiln material with collection objects and describes changes across three later-Ming reigns.',
        interpretation:
          'A mixed archaeological and collection record helps investigate production. It does not measure all output or prove one uniform decline. The reported 1608 imperial stoppage must stay distinct from continuing private work.',
        citations: [
          cite('ming-palace-kilns-2018', 'Excavation comparison and later reigns'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'A visible pattern, a question about making',
    duration: '10–15 minutes',
    steps: [
      'Point to one fish, one plant and one repeated border in the supplied photograph. Trace their arrangement in the air without counting the unseen side.',
      'Read the source capsule together. Make cards for visible observation, technical identification and evidence about orders or buying.',
      'Match “fish and plants fit around the body” and “cobalt lies under the glaze” to the right cards. Explain which needs the catalogue.',
      'Write one supported statement and one question about the makers or buyer that the picture cannot answer.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the Met identifies the jar as mid-sixteenth-century Jingdezhen porcelain with cobalt under the glaze and coloured enamels above it. The pictured arrangement can be observed. Its material identification uses catalogue research. Museum accounts describe court models, supervision, private kilns and several markets; they do not name this jar’s individual maker or buyer. A record for similar jars is not proof of this object’s batch or voyage.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected institutional/scholarly source consultation and internal author QA; not independent historian or craft specialist approval',
    scope:
      'Layered inquiry into makers, supervision, markets and changes within Ming ceramic production. Selected official catalogue/essay rereads retain previous dated scopes; five new source records distinguish museum archaeological summaries and selected scholarly text. The entire original dynasty interval, identity, claims, earlier comparison meanings, object order and image bytes remain intact.',
    limitations: [
      'The complete 1368–1644 case, visible mid-sixteenth-century/Jiajing attribution, inherited 1534–1566 object search envelope and unknown camera date remain separate. No exact workshop foundation, firing day or completed batch assigned.',
      'The Met’s 1542 reference concerns related jars and its colour explanation uses comparable examples. Original administrative order, new pigment analysis and present provenance-tab contents were not read. Direct local Met captures returned 429; actual exposed official web text was consulted without retrying another route.',
      'Palace/National Palace Museum exhibition accounts are institutional syntheses, not complete field datasets or proof that all rules were enforced. Broad quality/quantity decline and universal private/imperial hierarchies are not adopted. The later 1681/1683 restart alternatives remain outside the Ming frame.',
      'Pierson consultation is limited to selected printed pp. 9–12 and selected source notes; no full-book or original Chinese-text read, independent translation, exact workforce, wage, loss rate, working-day reconstruction or worker self-description claimed.',
      'The CUHK market account does not identify this jar’s customer, shipment or route. No newly inferred contact with other workpack cases, geographic points, territorial borders or measured workshop plan supplied.',
      'Existing jar pixels were actually inspected and retained. Remote-image parity and exposure date remain unverified. Source exhibition pictures and book figures are not copied or traced; no new visual asset or annotation promised.',
      'Independent historical/craft and relevant community review, real family use, human screen-reader/physical-device behavior and physical print quality remain open.',
    ],
  };
  s.terms = [...new Set([...s.terms, 'patronage'])];
  // Root integrates a shared comparison dimension and any separately reviewed visuals.
}
