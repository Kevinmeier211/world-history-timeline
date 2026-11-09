import type {
  Corpus,
  HistoricalContext,
  PlaceStudy,
  Source,
} from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'dongson-vnmh-2014',
    title: 'Dong Son Culture in Vietnam: 90 years of discovery and study (part 1)',
    author: 'Nguyen Van Doan; English translation Tran Trang',
    institution: 'Vietnam National Museum of History',
    url: 'https://baotanglichsuquocgia.vn/en/Articles/3188/16665/dong-son-culture-in-vietnam-90-years-of-discovery-and-study-part-1.html',
    type: 'archaeology',
    published: '2014-07-28',
    accessed: consulted,
    scope:
      'Selected opening chronology, section 1 Chronology and periods of development, section 2 Distribution and byline consulted on 29 October 2026. The seventh-century-BCE through first/second-century-CE archaeological-culture convention and its early/middle/late stages are attributed to this museum account, not imposed on the miniature catalogue or every drum tradition. National/state continuity, progressive ranking and homogeneous identity are not adopted as recovered facts. Distribution-map captions were read, but no reusable licence was established and no map copied or traced. Linked publications and original regional excavation datasets were not consulted.',
  },
  {
    id: 'dongson-ngoc-lu-2013',
    title: 'The Ngoc Lu drum (Lsb.5722)',
    author: 'Dương Hà',
    institution: 'Vietnam National Museum of History',
    url: 'https://vnmh.com.vn/en/Articles/1004/13749/the-ngoc-lu-drum-lsb-5722.html',
    type: 'catalogue',
    published: '2013-02-27',
    accessed: consulted,
    scope:
      'Selected object/date, dimensions, discovery/later-use paragraphs and byline consulted on 29 October 2026. The c.third–second-century-BCE date, 63 cm height and 79.3 cm face diameter belong to LSb.5722. This account places discovery in Ngọc Lũ in 1893–1894 and later ceremonial use at Như Trác; the museum’s 2023 English account reverses those place roles. The conflict is preserved rather than resolved into an exact findspot. Aesthetic superlatives, national continuity and literal readings of depicted activities are not adopted. Photograph pixels and a reusable image licence were not established; no image copied.',
  },
  {
    id: 'dongson-ngoc-lu-2023',
    title: 'National Treasures: The Ngọc Lũ drum',
    institution: 'Vietnam National Museum of History',
    url: 'https://vnmh.com.vn/en/Articles/1004/73640/national-treasures-the-ngoc-lu-drum.html',
    type: 'catalogue',
    published: '2023-01-03',
    accessed: consulted,
    scope:
      'Selected LSb.5722 identification/dimensions, malformed English date line and discovery/transfer paragraph consulted on 29 October 2026. This account places chance discovery during Trần Thủy embankment works at Như Trác in 1893, followed by use at Ngọc Lũ communal house and April 1903 museum transfer. The 2013 museum account gives the opposite discovery/later-use village sequence. The English “2500–2000 BCE N” date is unusable and was not silently corrected or converted from another page. No exact ancient findpoint, movement route or new chronology follows. Museum photographs were not copied or reuse-cleared.',
  },
  {
    id: 'dongson-co-loa-2021',
    title: 'CỔ LOA BRONZE DRUM',
    institution: 'Cổ Loa heritage site; Thăng Long–Hà Nội heritage conservation',
    url: 'https://thanhcoloa.vn/en/co-loa-bronze-drum',
    type: 'archaeology',
    published: '2021-12-23',
    accessed: consulted,
    scope:
      'Opening English find/deposition paragraph consulted on 29 October 2026: 1982 Mả Tre discovery, Chợ village, southwest of the South Gate between middle and inner ramparts; described as buried upside down containing nearly 200 artifacts, including agricultural implements, weapons, jars, coins and bronze scraps. The broad “over 2,000 BP” date wording is retained without an exact calendar conversion. Decorative/social and national-priority interpretations are not treated as direct observation or a universal function. No named owner, army, burial, recycling operation or precise deposition event inferred. No reusable photograph licence established; no photograph copied.',
  },
  {
    id: 'dongson-phu-chanh-2008',
    title:
      'The Phu Chanh site: cultural evolution and interaction in the later prehistory of southern Vietnam',
    author: 'Bui Chi Hoang',
    institution:
      'Center for Archaeological Studies, Southern Institute of Social Sciences; Bulletin of the Indo-Pacific Prehistory Association 28, 67–72',
    url: 'https://journals.lib.washington.edu/index.php/BIPPA/article/view/12017',
    type: 'archaeology',
    published: '2008-06-19',
    accessed: consulted,
    scope:
      'Selected primary report text consulted on 29 October 2026; DOI 10.7152/bippa.v28i0.12017. Actual downloaded PDF pages 1, 3, 4 and 6 (printed 67, 69, 70, 72) inspected: waterlogged discovery zone, farmer discoveries versus 2000 excavation/2001 survey, presumed graves with no bones, Pit 6 jar/drum association, selected tools, drum sizes, reassignment of wooden objects to weaving equipment and four wood BP results. Pages 2 and 5 figure pixels not inspected. The text calls the deposits presumed burials; acid soil preserved no bones. Specific Pit 6 evidence is used instead of harmonizing inconsistencies between the summary categories and individual pit descriptions. Wood BP values lack supplied calibrated ranges and differ from a later official treasure record. No individual gender, occupation, political title, universal use or demonstrated route inferred. No reusable figure licence found on article/about/submissions pages; figures viewed but not copied or traced.',
  },
  {
    id: 'dongson-phu-chanh-treasure',
    title: 'Mộ chum gỗ nắp trống đồng Phú Chánh',
    institution: 'Cục Di sản văn hóa (Department of Cultural Heritage)',
    url: 'https://dsvh.gov.vn/mo-chum-go-nap-trong-dong-phu-chanh-3088',
    type: 'catalogue',
    accessed: consulted,
    scope:
      'Selected official material/dimensions/date block and descriptive paragraphs consulted on 29 October 2026. Drum assigned second–first centuries BCE, height 40 cm and face 47.5 cm; wood C14 result given as 2,100 ±40 years without a calibrated calendar convention. This is not silently substituted for the four different wood results in the 2008 excavation report. Carved-wood description supports material work; rank/wealth and first-in-world interpretations are not adopted as demonstrated facts. No individual author or publication date supplied in consulted page. Department copyright/source-acknowledgement wording does not establish an explicit image reuse licence; no photograph copied.',
  },
  {
    id: 'dongson-luy-lau-2016',
    title: 'Khai quật di tích thành cổ Luy Lâu năm 2015: những kết quả quan trọng',
    author: 'Thu Nhuần',
    institution: 'Vietnam National Museum of History',
    url: 'https://baotanglichsuquocgia.vn/vi/Articles/3090/18909/khai-quat-di-tich-thanh-co-luy-lau-nam-2015-nhung-ket-qua-quan-trong.html',
    type: 'archaeology',
    published: '2016-01-17',
    accessed: consulted,
    scope:
      'Selected mould/casting-equipment paragraphs, competing chronological assessments and byline consulted on 29 October 2026. Inner/outer clay mould fragments, crucible/furnace-related remains and slag support production evidence. The report distinguishes second–third-century typological dating from excavators’ approximately fourth-century dating by associated material; no exact manufacture year harmonized from these. National-continuity conclusion omitted. No identification of the selected miniature’s maker, workshop or complete casting recipe. Museum photographs not copied; no reusable image licence established.',
  },
  {
    id: 'dongson-luy-lau-2024',
    title: 'Hội nghị báo cáo sơ bộ kết quả khai quật di tích thành cổ Luy Lâu năm 2024',
    author: 'Lê Chiến – Đinh Huyền; photographs Chu Mạnh Quyền',
    institution: 'Vietnam National Museum of History',
    url: 'https://baotanglichsuquocgia.vn/vi/Articles/3090/75114/hoi-nghi-bao-cao-so-bo-ket-qua-khai-quat-di-tich-thanh-co-luy-lau-nam-2024.html',
    type: 'archaeology',
    published: '2024-12-20',
    accessed: consulted,
    scope:
      'Selected opening location, preliminary excavation findings, workshop-discard/mould-equipment and phase paragraphs plus byline consulted on 29 October 2026. Report locates Luy Lâu in Thanh Khương using 2024 administrative wording; this does not independently verify 2026 status. Dense discarded moulds, crucibles, furnace-related remains and slag with Six Dynasties material are discussed as third–sixth centuries CE. Inner/outer moulds represent different drum parts. Preliminary account, not complete excavation/laboratory publication; largest/priority rhetoric not adopted. Later production extends beyond the unchanged case endpoint 300 and is not the miniature’s workshop attribution. Photograph acquisition dates and reusable image licence not verified; no source image copied or traced.',
  },
  {
    id: 'dongson-co-loa-location',
    title: 'The Complex of Co Loa Ancient Citadel: geographic reference',
    institution:
      'Viet Nam National Commission for UNESCO; State Party Tentative List submission hosted by UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/tentativelists/7056/',
    type: 'archive',
    published: '2026-10-16',
    accessed: consulted,
    scope:
      'Submission identity/date, Coordinates header, disclaimer and first description paragraph consulted on 29 October 2026. Published complex point 21°06′47″N, 105°52′24″E converted arithmetically to decimal latitude 21.1130555556, longitude 105.8733333333. It is not the exact Mả Tre drum findspot or reconstructed perimeter. A Tentative List submission is the State Party’s responsibility, not World Heritage inscription or UNESCO historical endorsement. No UNESCO map or photograph copied.',
  },
  ...[
    {
      id: 'dongson-phu-chanh-location',
      title: 'GeoNames 9091518: Xã Phú Chánh',
      url: 'https://www.geonames.org/9091518/xa-phu-chanh.html',
      detail:
        'WGS84 latitude 11.06758, longitude 106.70371; named locality reference for the Phú Chánh discovery zone, not Pit 6 or an exact farmer findspot.',
    },
    {
      id: 'dongson-ngoc-lu-location',
      title: 'GeoNames 8564075: Xã Ngọc Lũ',
      url: 'https://www.geonames.org/8564075/xa-ngoc-lu.html',
      detail:
        'WGS84 latitude 20.52107, longitude 106.08045; named locality in the Bình Lục area, not the different Ngọc Lũ in Phú Thọ, exact communal house or disputed discovery point.',
    },
    {
      id: 'dongson-nhu-trac-location',
      title: 'GeoNames 1572009: Như Trác',
      url: 'https://www.geonames.org/1572009/nhu-trac.html',
      detail:
        'WGS84 latitude 20.58333, longitude 106.1; named populated-place reference, not the exact Trần Thủy embankment or a ceremonial building.',
    },
    {
      id: 'dongson-luy-lau-location',
      title: 'GeoNames 8340699: Xã Thanh Khương',
      url: 'https://www.geonames.org/8340699/xa-thanh-khuong.html',
      detail:
        'WGS84 latitude 21.03929, longitude 106.051; Thanh Khương locality reference for the Luy Lâu area, not an excavated mould deposit, trench or citadel boundary.',
    },
  ].map((row): Source => ({
    id: row.id,
    title: row.title,
    institution: 'GeoNames contributors',
    url: row.url,
    type: 'archive',
    accessed: consulted,
    scope: `${row.detail} Actual primary HTML Coordinates and JSON-LD fields read on 29 October 2026 after web-cache misses; retained HTML captures document the values. Gazetteer administrative classifications and names do not establish current 2026 boundary/status or archaeological precision. GeoNames about page confirms WGS84; export terms require attribution and supply data as-is without accuracy/timeliness warranty. About page links CC BY 4.0; export terms say CC-BY without version. No background map copied.`,
  })),
];

export const dongsonContext: HistoricalContext = {
  id: 'dongson-selected-contexts',
  title: 'Đông Sơn traditions: selected find, use and production contexts',
  region: 'Southeast Asia/Oceania',
  interval: {
    start: -700,
    end: 600,
    label: 'c.700 BCE–600 CE: selected traditions and later production evidence',
    precision: 'approximate',
    note: 'Source-qualified teaching frame, not one continuous polity or universal drum chronology. The 2014 museum archaeological-culture scheme ends in the first/second centuries CE; later Luy Lâu production has a separate third–sixth-century interpretation. The complete miniature case stays c.500 BCE–300 CE, including its original note and precision. Later manufacture does not extend or redetermine that case.',
  },
  summary:
    'A shared bronze form enters different local settings. Find associations, later uses and production remains help distinguish those histories without drawing one state or a demonstrated movement route.',
  subjectIds: ['dongson'],
  citations: [
    cite('dongson-vnmh-2014', '1. Chronology and periods of development'),
    cite('dongson-luy-lau-2024', 'Workshop-discard and phase interpretation'),
    cite('met-39209', 'Description; Artwork Details: Date'),
  ],
  phases: [
    {
      year: -700,
      label: 'Seventh–sixth centuries BCE: museum early-stage convention',
      title: 'A broad archaeological frame precedes the miniature’s range',
      text: 'The 2014 museum account identifies an early stage in varied upland, midland and delta settings. This attributed convention supplies orientation; it neither establishes a precise founding year nor dates the selected miniature to this stage.',
      citations: [
        cite('dongson-vnmh-2014', '1. Chronology: early stage'),
        cite('met-39209', 'Artwork Details: Date'),
      ],
    },
    {
      year: -500,
      label: 'Fifth–third centuries BCE: museum middle-stage convention',
      title: 'Regional settings and particular objects need separate dates',
      text: 'The museum describes an extension into river and delta settings during its middle stage. Its broad scheme does not override the separate c.third–second-century-BCE date assigned to Ngọc Lũ in the 2013 object record, or the selected miniature’s wider catalogue interval.',
      citations: [
        cite('dongson-vnmh-2014', '1. Chronology: middle stage'),
        cite('dongson-ngoc-lu-2013', 'Opening object/date line'),
      ],
    },
    {
      year: -200,
      label: 'Second/first centuries BCE–first/second CE: museum late convention',
      title: 'Different deposits supply local histories',
      text: 'The source’s late-stage wording overlaps centuries rather than fixing one transition year. Phú Chánh’s official drum date and its wood results are different kinds of evidence; the excavation report calls the site about 2,000 years old. These conventions do not establish an exact shared year of use.',
      citations: [
        cite('dongson-vnmh-2014', '1. Chronology: late stage'),
        cite('dongson-phu-chanh-treasure', 'Date block'),
        cite('dongson-phu-chanh-2008', 'p.72: site and wood dates'),
      ],
    },
    {
      year: 200,
      label: 'Third–sixth centuries CE: later Luy Lâu production evidence',
      title: 'Manufacture has a later reference of its own',
      text: 'The 2024 preliminary field account associates mould and casting discard with Six Dynasties material. This later production interpretation extends beyond the case endpoint 300. The 2016 report separately distinguished typological dating from an approximately fourth-century associated layer. Neither identifies the Met miniature’s workshop.',
      citations: [
        cite('dongson-luy-lau-2024', 'Workshop-discard and phase interpretation'),
        cite('dongson-luy-lau-2016', 'Typology and associated-layer dating'),
        cite('met-39209', 'Artwork Details: Date and regional attribution'),
      ],
    },
  ],
};

/** Export for central map integration; these are references, not exact findpoints. */
export const dongsonPlaceStudy: PlaceStudy = {
  background: 'coastline',
  title: 'Selected Vietnamese find, use and production contexts',
  description:
    'Five geographic references orient four archaeological stories. The schematic modern coastline supplies orientation, not a reconstructed ancient shore. Complex and locality dots are not excavation coordinates. They do not count all Southeast Asian finds, show routes or define political borders. Modern discovery/use records and ancient dates remain separate; Ngọc Lũ and Như Trác retain conflicting recorded roles.',
  bounds: [104.5, 10, 108, 22.2],
  points: [
    {
      id: 'co-loa-complex-reference',
      label: 'Cổ Loa: Mả Tre group',
      coordinates: [105.8733333333, 21.1130555556],
      text: 'Published Cổ Loa complex reference, not the exact Mả Tre findspot. The site account records a 1982 drum discovery between middle and inner ramparts, containing agricultural implements, weapons and other objects. Its broad “over 2,000 BP” date is not an exact deposition year.',
      citations: [
        cite('dongson-co-loa-location', 'Coordinates; State Party disclaimer'),
        cite('dongson-co-loa-2021', 'Opening find-context paragraph'),
      ],
    },
    {
      id: 'ngoc-lu-locality-reference',
      label: 'Ngọc Lũ: discovery/use record',
      coordinates: [106.08045, 20.52107],
      text: 'Gazetteer locality reference, not an exact find or communal-house coordinate. The 2013 museum account places discovery here and later ceremonial use at Như Trác; the 2023 account instead makes Ngọc Lũ the later communal-house destination. Gazetteer classification does not verify current administrative status.',
      citations: [
        cite('dongson-ngoc-lu-location', 'Coordinates and JSON-LD'),
        cite('dongson-ngoc-lu-2013', 'Discovery/later-use paragraphs'),
        cite('dongson-ngoc-lu-2023', 'Discovery/transfer paragraph'),
      ],
    },
    {
      id: 'nhu-trac-locality-reference',
      label: 'Như Trác: use/discovery record',
      coordinates: [106.1, 20.58333],
      text: 'Named locality reference, not an exact embankment or ceremonial building. The 2023 account places chance discovery during embankment works here in 1893; the 2013 account instead identifies later ceremonial use here after discovery at Ngọc Lũ. These are conflicting modern histories, not two independent ancient finds or a demonstrated route.',
      citations: [
        cite('dongson-nhu-trac-location', 'Coordinates and JSON-LD'),
        cite('dongson-ngoc-lu-2013', 'Discovery/later-use paragraphs'),
        cite('dongson-ngoc-lu-2023', 'Discovery/transfer paragraph'),
      ],
    },
    {
      id: 'phu-chanh-locality-reference',
      label: 'Phú Chánh: jar and drum contexts',
      coordinates: [106.70371, 11.06758],
      text: 'Gazetteer locality point for a discovery zone described as nearly 3 km long, not Pit 6. The excavator records a drum over a wooden jar and other deposits with weaving equipment. Graves are presumed: no bones survived. The official drum date and differing wood BP values retain their source scopes; no buried person’s gender or occupation is established.',
      citations: [
        cite('dongson-phu-chanh-location', 'Coordinates and JSON-LD'),
        cite('dongson-phu-chanh-2008', 'pp.67, 69–70, 72'),
        cite('dongson-phu-chanh-treasure', 'Date block'),
      ],
    },
    {
      id: 'luy-lau-area-reference',
      label: 'Luy Lâu: later production',
      coordinates: [106.051, 21.03929],
      text: 'Thanh Khương gazetteer locality reference for the Luy Lâu area, not a workshop trench or citadel perimeter. The 2024 preliminary account interprets mould and casting discard with third–sixth-century-CE material. This later context extends beyond case endpoint 300 and does not locate the miniature’s workshop. Current administrative status is not inferred.',
      citations: [
        cite('dongson-luy-lau-location', 'Coordinates and JSON-LD'),
        cite('dongson-luy-lau-2024', 'Opening location; workshop-discard phase'),
      ],
    },
  ],
  features: [],
};

/** Add selected source layers without changing case identity, dates or old claims. */
export function applyRegionalDongson(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'dongson');
  const miniature = c.sources.find((row) => row.id === 'met-39209');
  if (!s || !miniature) {
    throw new Error('Đông Sơn expansion requires the existing case and catalogue');
  }
  miniature.accessed = consulted;
  miniature.scope =
    'Visible official Title, Description paragraphs, Artwork Details and Public Domain statement reconsulted on 29 October 2026; Met Open Access policy separately checked. Bronze miniature 2000.284.57, height 10.2 cm, Vietnam attribution and ca.500 BCE–300 CE catalogue wording retained. Broader-tradition distribution, burial associations and possible warfare/regalia/ceremonial uses do not establish this particular miniature’s use or excavated provenance. Provenance tab was not freshly opened; no exact findspot supplied in consulted visible record. Existing 1600 ×1204 image and 480 ×361 thumbnail actually inspected/hashed against starting checkpoint and left byte-identical; photography date and current remote-image byte parity unverified. Public Domain image/CC0 policy does not turn the catalogue prose into an ancient source.';
  for (const source of sources) {
    const existing = c.sources.find((row) => row.id === source.id);
    if (existing) Object.assign(existing, source);
    else c.sources.push({ ...source });
  }
  const contextIndex = (c.contexts ?? []).findIndex(
    (row) => row.id === dongsonContext.id,
  );
  if (contextIndex < 0) {
    c.contexts = [...(c.contexts ?? []), dongsonContext];
  } else c.contexts![contextIndex] = dongsonContext;
  s.contextIds = [...new Set([...(s.contextIds ?? []), dongsonContext.id])];

  s.summary =
    'Bronze drums enter histories of making, depositing and reusing objects. A miniature, a group of bronze implements and a wooden-jar cover answer different questions. Selected Vietnamese contexts show that a repeated form could acquire local roles; wider circulation does not establish one purpose, people or polity.';
  s.sections = [
    sec(
      'Begin with the object’s actual scale',
      'The selected bronze miniature stands 10.2 cm high. Four frogs sit near its decorated upper rim, above a body that flares toward the base. Its small size matters when considering handling and use: Ngọc Lũ, a different drum, is 63 cm high. The Met describes both Vietnam-made drums and works made locally elsewhere across mainland and island Southeast Asia. That wider history does not identify this miniature’s place of discovery or establish whether it sounded in a ceremony.',
      cite('met-39209', 'Description; Artwork Details; existing photograph'),
      cite('dongson-ngoc-lu-2013', 'Dimensions'),
    ),
    sec(
      'Objects were gathered into particular groups',
      'At Mả Tre within Cổ Loa, a drum found in 1982 contained agricultural implements, weapons and other objects, including bronze scraps. The site record describes it as buried upside down. The association brings tools for different activities into one deposited group. It gives the drum a documented context beyond its decorated surface, although the account does not recover who assembled the group, why they deposited it, or how long the objects had been used.',
      cite('dongson-co-loa-2021', 'Opening find-context paragraph'),
    ),
    sec(
      'Wood, cloth and a drum belonged to another setting',
      'At waterlogged Phú Chánh, excavators recorded wooden containers, pottery and textile-related materials. In Pit 6, a drum was positioned over a wooden jar. Other deposits included wooden equipment later identified as parts of weaving apparatus, after comparison changed an earlier interpretation as elite equipment. Carving containers and working textiles thus enter the account alongside bronze. The excavator calls the pits presumed graves: no bones survived in the acid soil, so these objects cannot identify a particular buried person’s work or gender.',
      cite('dongson-phu-chanh-2008', 'pp.67, 69–70, 72'),
    ),
    sec(
      'Making leaves evidence beyond the finished drum',
      'At Luy Lâu, excavators found inner and outer mould fragments representing different drum parts, together with crucibles, furnace-related remains and slag. These remains connect shaped bronze to the preparation of moulds, heating metal and the disposal of workshop material. The 2024 preliminary account associates this evidence with third–sixth-century-CE material. This later production reference extends beyond the miniature’s case interval; it neither identifies its workshop nor supplies a recipe used for every drum.',
      cite('dongson-luy-lau-2024', 'Workshop-discard, equipment and phase paragraphs'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A named place can have more than one recorded role',
      'Ngọc Lũ is not a secure discovery coordinate simply because it names a drum. The museum’s 2013 account places discovery there and later ceremonial use at Như Trác. Its 2023 account instead describes discovery during embankment works at Như Trác and subsequent use at Ngọc Lũ communal house. Showing both locality references makes the disagreement inspectable. It does not create two ancient finds or prove a route. The later English date line is malformed and cannot supply a calendar chronology.',
      cite('dongson-ngoc-lu-2013', 'Discovery/later-use paragraphs'),
      cite('dongson-ngoc-lu-2023', 'Date line; discovery/transfer paragraph'),
    ),
    sec(
      'Material dates answer different questions',
      'The official Phú Chánh treasure record assigns its drum to the second–first centuries BCE and reports a wood radiocarbon result. The 2008 excavation paper lists four different wood BP results for the site. These are not interchangeable dates for making every associated object. Similarly, Luy Lâu’s 2016 account distinguishes dating by drum style from dating the layer’s associated materials. Keeping those steps separate allows later discoveries to change an explanation without shortening the miniature’s inherited range.',
      cite('dongson-phu-chanh-treasure', 'Date block'),
      cite('dongson-phu-chanh-2008', 'p.72: four wood BP results'),
      cite('dongson-luy-lau-2016', 'Typology and associated-layer dating'),
    ),
    sec(
      'Distribution needs local histories',
      'A map point can orient a documented association while leaving movement unresolved. These selected Vietnamese contexts do not represent the complete mainland and island distribution described by the Met. Similar forms may involve movement of objects, skills or ideas and local manufacture. Establishing a particular route or political relationship requires additional evidence; the shared form alone cannot choose between those histories.',
      cite('met-39209', 'Description: production and distribution'),
      cite('dongson-co-loa-2021', 'Find context'),
      cite('dongson-phu-chanh-2008', 'pp.69–70: particular associations'),
    ),
  ];
  s.evidenceReading = {
    title: 'What changes when an object has a documented context?',
    introduction:
      'These are editorial paraphrases of modern catalogue and archaeological accounts. Observation, associated finds and chronological interpretation do different work.',
    items: [
      {
        label: 'A miniature with a broad catalogue range',
        text: 'The Met identifies a 10.2 cm bronze miniature dated approximately 500 BCE–300 CE. Its discussion of the wider drum tradition offers several possible uses.',
        interpretation:
          'The photograph and dimensions establish visible form and scale. They do not establish this object’s original sound, owner, exact findspot or burial use. A possible function for larger drums cannot automatically be transferred to this miniature.',
        citations: [
          cite('met-39209', 'Description; Artwork Details; existing photograph'),
        ],
      },
      {
        label: 'A cover in a presumed burial assemblage',
        text: 'The Phú Chánh excavator records a drum over a wooden jar in Pit 6. No bones survived in the pits interpreted as graves; other deposits supplied wooden equipment reidentified through comparison with weaving tools.',
        interpretation:
          'The recorded association supports a local role for that drum, while “presumed” remains necessary for the burial interpretation. The wider materials support questions about craft, not a particular person’s gender, occupation or political title. They do not give the Met miniature the same use.',
        citations: [cite('dongson-phu-chanh-2008', 'pp.67, 69–70, 72')],
      },
      {
        label: 'Moulds and discard support making in a place',
        text: 'The Luy Lâu preliminary account describes inner and outer moulds with crucible, furnace-related and slag remains, associated with third–sixth-century-CE material.',
        interpretation:
          'Production remains support manufacture more directly than distant resemblance alone. Their later reference dates extend beyond the case endpoint 300, and the 2016 account distinguishes stylistic from associated-layer dating. No mine source, exact labor system, universal recipe or workshop for the selected miniature is established.',
        citations: [
          cite('dongson-luy-lau-2024', 'Workshop-discard and equipment paragraphs'),
          cite('dongson-luy-lau-2016', 'Typology and associated-layer dating'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'One form, different evidence cards',
    duration: '10–15 minutes',
    steps: [
      'Find the four frogs in the supplied photograph. Read the miniature’s 10.2 cm height; use a ruler to imagine that height without treating the photograph as life size.',
      'Read the source capsule with an adult if useful. Make two cards: Cổ Loa objects inside a drum, and Phú Chánh drum over a wooden jar. Label these as different drums and contexts.',
      'Choose one card. Write one claim it supports about that particular drum and one thing it does not establish about the photographed miniature.',
      'Add one discovery that would help answer the miniature’s use question, such as a securely recorded find context. Mark it as evidence still needed, not something already supplied.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the Cổ Loa site record describes a drum found with tools, weapons and other objects inside it. Bui Chi Hoang’s Phú Chánh report records a drum over a wooden jar in Pit 6; the pits are presumed graves because no bones survived. The Met supplies the miniature’s form, material and height but no exact excavated context in the consulted visible record. These cards support different local associations, not one universal purpose or a burial assignment for the miniature.',
  };
  s.dimensions['place-context'] = {
    text: 'A miniature’s catalogue attribution differs from a recorded group of implements, a drum over a wooden jar and later mould-production remains. Qualified local contexts explain variation without converting distribution into one route, purpose or polity.',
    citations: [
      cite('met-39209', 'Description; Artwork Details'),
      cite('dongson-co-loa-2021', 'Find context'),
      cite('dongson-phu-chanh-2008', 'pp.69–70'),
      cite('dongson-luy-lau-2024', 'Workshop-discard and phase interpretation'),
    ],
  };
  s.dimensionKeys = [
    ...new Set([...(s.dimensionKeys ?? Object.keys(s.dimensions)), 'place-context']),
  ];
  s.terms = [...new Set([...s.terms, 'archaeology', 'evidence', 'provenance'])];
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian approval',
    scope:
      'Layered account of scale, particular deposits, wood/textile work and later production, with three consequential evidence readings and a supplied-source family activity. A distinct source-qualified reference and separately exported locator map orient selected Vietnamese contexts. Original case identity, complete interval/date note/precision, claims, object order, existing dimensions and photograph bytes retained. No complete regional distribution or newly inferred relationship supplied.',
    limitations: [
      'The 2014 archaeological-culture scheme, particular drum dates, the inherited miniature interval and later Luy Lâu production remain separate. No exact founding/ending event or universal typological sequence is recovered. The reference extends to 600 only to include explicitly later evidence; the complete case remains −500..300.',
      'The 2013 and 2023 museum accounts conflict on Ngọc Lũ/Như Trác discovery and later-use roles. The 2023 English date is malformed and unusable. Neither locality reference identifies an exact embankment, communal house or ancient findpoint; no directed route resolves the disagreement.',
      'Phú Chánh consultation covers selected report text and actual printed pages 67, 69, 70 and 72, not all figure pixels or original excavation/laboratory datasets. Presumed graves have no surviving bones. Wood BP values/source conventions differ and were not converted to calibrated ranges. Weaving comparison does not identify an individual’s gender, status or occupation.',
      'Luy Lâu sources are selected institutional preliminary accounts. Later mould/casting evidence supports local production but not the selected miniature’s workshop, a complete process, mine source, output quantity or labor system. Technical 2026 sample analyses and inaccessible 2020 article were not adopted into this account.',
      'Five geographic references cover four stories, not five independent ancient finds or the full Southeast Asian distribution. Cổ Loa is a published complex point; four GeoNames points are locality references, not excavation coordinates or fresh verification of current administrative status. No borders, movement arrows, common polity or homogeneous people inferred.',
      'The selected Met photograph and thumbnail were actually inspected and remain byte-identical; camera acquisition date and remote-current byte parity were not verified. No other source map, plan, motif or photograph was copied, traced or reuse-cleared. Optional later artwork requires separate metadata/rights and visual validation.',
      'The previously rejected Nanzan destination was not retried or bypassed. Timor 2019 remains abstract-only and supplies no mapped findspot here. Wider mainland/island histories, local voices and the miniature’s exact archaeological provenance remain open.',
      'Independent historian/community source review, real adult/family use, human screen-reader and physical-device behavior, physical print and acceptance remain open.',
    ],
  };
}
