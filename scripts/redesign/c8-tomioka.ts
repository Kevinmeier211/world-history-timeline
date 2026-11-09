import type {
  Corpus,
  HistoricalContext,
  PlaceStudy,
  Source,
  Subject,
} from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'tomioka-instructors-2022',
    title:
      'The Training and Education of Female Silk-reeling Instructors in Meiji Japan',
    author: 'Sashinami Akiko',
    institution:
      'Accessing Technical Education in Modern Japan, chapter 10, pp. 252–278; Amsterdam University Press',
    url: 'https://www.cambridge.org/core/books/abs/accessing-technical-education-in-modern-japan/training-and-education-of-female-silkreeling-instructors-in-meiji-japan/19E4E7FDA00863441050602D501C9A19',
    type: 'scholarship',
    published: '2022-05-26',
    accessed: consulted,
    scope:
      'Exposed Summary/Introduction paragraphs and chapter/author/publisher/pages/DOI metadata read. Print year 2022; displayed online date 26 May 2022. DOI 10.1017/9781912961269.012. Selected text describes sorting cocoons, drawing and joining filaments, reeling at machine speed and women teaching other women. The full chapter, its figure 1, original training records and linked translation notes were not consulted. The broad historical gender allocation is not adopted as universal household practice. No source image, machine geometry or modern replication copied; no figure reuse licence established.',
  },
  {
    id: 'tomioka-labour-adaptation-1994',
    title: 'Silk-reeling Technology and Female Labour',
    author: 'Masanori Nakamura; Corrado Molteni',
    institution:
      'Technology Change and Female Labour in Japan, chapter 1; United Nations University Press; hosted by IDE/JETRO',
    url: 'https://d-arch.ide.go.jp/je_archive/english/society/book_jes7_d02.html',
    type: 'scholarship',
    published: '1994',
    accessed: consulted,
    scope:
      'Selected opening/process framing; Tomioka recruitment and Rokkūsha/Nakayamasha adaptation passages; selected Suwa working-hours, Factory Act exceptions, 1917 applications and Okaya recollection; and notes 11, 41–45 read in the institutional English HTML. The opening process sequence is explicitly about c.1910–1920s and is not redated to 1872. Wada is named Hide in this chapter; the separately consulted NDL record uses Ei(ko). Her recollection is mediated through the authors and their cited 1978 edition, pp. 21–22. The unnamed Okaya worker’s 1917 experience is mediated through a 1981 publication cited at note 45, p. 56; the authors cite a 1919 annual reporting on 1917 at note 44. No original Japanese memoir, 1903 survey, legislation, inspection annual, 1981 interview volume or full underlying tables inspected. No complete book/PDF, image, plan or machine diagram consulted/copied. Suwa and Matsushiro evidence is not a Tomioka payroll or universal factory history.',
  },
  {
    id: 'tomioka-wada-ndl',
    title:
      'Construction of large scale government operated factories: Tomioka and Wada Ei(ko)',
    institution: 'National Diet Library, Modern Japan and France digital exhibition',
    url: 'https://www.ndl.go.jp/france/en/part1/s2_1.html',
    type: 'archive',
    accessed: consulted,
    scope:
      'Selected Tomioka subsection, Wada biographical paragraph and displayed bibliographic entries read. Wada joined in April 1873, left in July 1874, taught at Saijō/Rokkōsha and became a prefectural-mill instructor in 1878. NDL states that she wrote memories from 1907 onward and records their edited 1931 publication as Tomioka Kōki/Tomioka Nikki. The original Japanese memoir and 1931/1978 editions were not read or independently translated. The linked old OPAC endpoint failed after redirect; it was not retried. Other industries/chapters are outside this renewal. The web page’s publication date is unstated; 1931 is the memoir edition’s date. The NDL brackets the selected Kuniteru print as [1872]. No claim of direct, contemporary diary access or a representative account of every worker.',
  },
  {
    id: 'tomioka-arafune-2020',
    title: 'Arafune Cold Storage',
    institution:
      'Japan Tourism Agency, JTA Sightseeing Database; associated board Gunma Prefecture',
    url: 'https://www.mlit.go.jp/tagengo-db/en/R2-00051.html',
    type: 'archive',
    published: 'FY 2020 prepared; exact publication day unstated',
    accessed: consulted,
    scope:
      'FY Prepared metadata and complete exposed English interpretation read, especially Preparing for storage. First units operated in 1905; three existed by 1914. The text describes cooled storage, marked egg cards, testing, labels/cataloguing and returning cards when needed. Its current visitor interpretation is not an original 1905 inventory or measured historical temperature series. The absolute summer-temperature claim, exact total capacity and possible prehistoric cold-storage use are not adopted. No building reconstruction, transport route, photograph, source geometry or source image copied. Linked English PDF/Word files were not read.',
  },
  {
    id: 'tomioka-factory-act-archives',
    title: 'March 1911: the Factory Act is established (工場法が成立する)',
    institution: 'National Archives of Japan, Japan’s Progress digital exhibition',
    url: 'https://www.archives.go.jp/ayumi/kobetsu/m44_1911_02.html',
    type: 'archive',
    accessed: consulted,
    scope:
      'Short Japanese institutional explanatory paragraph, title, cabinet-file identifier 類01128 and displayed links read. Editorial English paraphrase: promulgation 28 March 1911, protective provisions and initial factory-size scope, implementation September 1916. No full original statute, cabinet file, imperial signed original, page-image transcription or current legal guidance consulted. The institutional caption distinguishes enactment from implementation; it does not prove compliance at any selected factory. The page’s publication date is unstated; its footer copyright is not a publication date. No source image reused.',
  },
  {
    id: 'tomioka-unesco-coordinates',
    title: 'Tomioka Silk Mill and Related Sites: geographical data',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/1449/maps/',
    type: 'archive',
    accessed: consulted,
    scope:
      'Actual four-row current Geographical data table read: IDs 1449-001 through 1449-004, named components and north/east degrees/minutes/seconds. These are published modern property-reference points to the displayed second, not exact historical workstations, boundaries, routes or origins of all cocoons. Current Tajima coordinates N36 14 48/E139 14 21 differ by one second each from the older nomination table exposed in search; no survey correction inferred. No source map or nomination plan copied/traced. The linked 2014 inscribed-property map and 249 MB nomination were not read. Direct local capture returned 403; this consultation used the readable web response.',
  },
  {
    id: 'tomioka-ndl-print',
    title: 'Jōshū Tomioka seishijō no zu: NDL print and catalogue',
    author:
      'Ichiyōsai Kuniteru (Utagawa Kuniteru II), artist; National Diet Library catalogue',
    institution: 'National Diet Library, Japan',
    url: 'https://www.ndl.go.jp/en/landmarks/sights/tomiokaseishijo',
    type: 'catalogue',
    accessed: consulted,
    scope:
      'Actual landmark text, two linked image identities, embedded NDL catalogue record R100000039-I1305876 and its linked public IIIF manifest read. Catalogue: 上州富岡製絲塲之圖, Ichiyōsai Kuniteru, Daikokuya Heikichi, [Meiji 5 (1872)], call number 寄別7-4-2-5, nishiki-e in three sheets. Manifest identifies DOI 10.11501/1305876 and Access Restrictions PDM. The exhibition’s composed image was downloaded at its supplied 2984×1466 resolution and visually inspected as a complete image; the displayed inspection was resized to 2048×1006 by the tool. All three individual IIIF sheet images were not read/stitched. Scan/composition creation date unstated. No independent seal/signature reading or print-state investigation. NDL Image Bank About and Utilizing content §§2.1–2.2 explicitly permit public-domain image reuse, including this named landmarks exhibition, with source credit; general terms read. MAFF separately dates a visibly comparable impression to 1873; this difference remains explicit rather than silently redating the NDL copy. This is a published artistic representation, not a photograph or a complete worker roster.',
  },
  {
    id: 'tomioka-maff-prints',
    title: 'Nishiki-e: selected Tomioka interior caption',
    institution: 'Ministry of Agriculture, Forestry and Fisheries, Japan',
    url: 'https://www.maff.go.jp/j/meiji150/you/04.html',
    type: 'catalogue',
    accessed: consulted,
    scope:
      'Selected introduction and exterior/interior Tomioka headings/captions read in Japanese; English discussion is editorial paraphrase. The interior heading 上州富岡製糸場之図 gives Meiji 6 (1873), whereas the selected NDL impression is bracketed [1872]. Its linked 960×596 source photograph was inspected only to establish comparable composition and visibly different impression/color presentation. No exact print-state or copy-identity equivalence established. MAFF directs image-use permission inquiries to the Okaya Silk Museum. This MAFF copy is research-only, not the proposed reusable NDL image. Other listed prints, linked books and complete object histories not consulted. Page publication day unstated; modern photographic exposure date unstated.',
  },
];

const renewals: Record<string, string> = {
  tomioka:
    'Brief synthesis, criteria and selected integrity/authenticity paragraphs read on 29 October. Use is limited to differentiated sericulture/reeling functions, adaptation and distinct component histories; the criterion’s wholly successful-transfer language is not adopted as proof of every worker’s welfare. 2014 is inscription, not the creation date of every site. Historic management statements are not renewed 2026 enforcement claims. No full nomination, source plan or photograph inspected/reused; direct local capture returned 403 but the selected web text was readable.',
  'tomioka-local':
    'Selected English Tomioka/Women Mill Workers/Farmhouses/Cold Storage text read on 29 October: local building skills and October 1872 opening, trainers/dormitories, 1863 Tajima farmhouse ventilation, 1884 Takayama-sha school and egg-storage functions. Institutional claims about recruitment and women’s bodies are not adopted as universal experience or biological fact. No original worker records or payroll read. Current residency, universal temperature limits and blanket improved-life claims are not renewed. No source image or geometry copied; the living page has no stated publication date.',
};

export const tomiokaWorkContext: HistoricalContext = {
  id: 'tomioka-skill-work-context',
  title: 'Silk work: learning, adaptation and the limits of protection',
  region: 'East Asia',
  interval: {
    start: 1872,
    end: 1916,
    label: 'Selected mill, training, storage and legal changes, 1872–1916',
    precision: 'range',
    note: 'A selected source frame from Tomioka’s opening to Factory Act implementation, extending four years beyond the Meiji period. It is not the mill’s operating lifespan or the beginning/end of Japanese industrialization. The earlier 1863 farmhouse and a later 1917 worker recollection are explicitly contextual comparisons. The original exact October 1872 case remains unchanged. Memoir writing/publication, modern scholarship, heritage listing and digitization have separate dates.',
  },
  summary:
    'Imported machinery depended on trained hands, local materials and people raising silkworms. Learning and technical change could coexist with restrictive working arrangements and incomplete legal protection.',
  subjectIds: ['tomioka'],
  citations: [
    cite('tomioka-local', 'Tomioka; Farmhouses'),
    cite('tomioka-arafune-2020', 'Preparing for storage'),
    cite('tomioka-factory-act-archives', 'Explanatory paragraph'),
  ],
  phases: [
    {
      year: 1872,
      label: 'October 1872: the model mill opens',
      title: 'A new mill uses established regional skills',
      text: 'French machinery and advice met Japanese building work and an existing sericultural region. Opening the mill did not create the whole production system in one year or determine every employee’s later experience.',
      citations: [cite('tomioka-local', 'Tomioka Silk Mill')],
    },
    {
      year: 1874,
      label: '1874: trained workers teach at another mill',
      title: 'Learning can travel through people',
      text: 'The NDL places Wada Ei(ko)’s departure from Tomioka in July 1874 and subsequent teaching at Saijō, later Rokkōsha. Nakamura and Molteni discuss material changes at that separate Matsushiro mill through her later recollection. This is not an account freshly written during the visit or a reconstruction of Tomioka’s equipment.',
      citations: [
        cite('tomioka-wada-ndl', 'Wada biographical paragraph'),
        cite('tomioka-labour-adaptation-1994', 'Rokkūsha adaptation; note 11'),
      ],
    },
    {
      year: 1884,
      label: '1884: Takayama-sha becomes a school',
      title: 'Controlling a living crop requires practice',
      text: 'Students learned sericulture through practical rearing. Ventilation, warmth and humidity mattered to silkworms before cocoons reached a reel. The school’s date is distinct from the mill’s opening and from Tajima’s earlier 1863 farmhouse.',
      citations: [cite('tomioka-local', 'Farmhouses and sericulture school')],
    },
    {
      year: 1905,
      label: '1905: Arafune’s first storage units operate',
      title: 'Storage changes the timing of work',
      text: 'Keeping eggs cool delayed hatching. Labels and catalogues helped staff return egg cards when needed. These early twentieth-century facilities did not exist at the mill’s 1872 opening, and their later functional association is not a mapped shipment itinerary.',
      citations: [cite('tomioka-arafune-2020', 'Preparing for storage')],
    },
    {
      year: 1911,
      label: '28 March 1911: Factory Act promulgation',
      title: 'Making a law and applying it have different dates',
      text: 'The National Archives distinguishes the 1911 law from its later implementation. Protective provisions had a defined initial scope, rather than instantly covering every person working with silk.',
      citations: [cite('tomioka-factory-act-archives', 'Explanatory paragraph')],
    },
    {
      year: 1916,
      label: 'September 1916: implementation begins',
      title: 'Protection needs evidence of how it works',
      text: 'The law came into force after a five-year delay. Nakamura and Molteni describe exceptions affecting silk-reeling and evidence of continuing long hours in Nagano. This is a qualified regional comparison, not a finding that every Tomioka shift violated or complied with the law.',
      citations: [
        cite('tomioka-factory-act-archives', 'Implementation date'),
        cite('tomioka-labour-adaptation-1994', 'Factory Act exceptions; notes 44–45'),
      ],
    },
  ],
};

export const tomiokaWorkDimension: Subject['dimensions'][string] = {
  text: 'Reeling joined trained handwork with machinery; sericulture, teaching and cold storage solved different practical problems. Learning could spread while the conditions and protection of workers remained unequal and source-specific.',
  citations: [
    cite('tomioka-instructors-2022', 'Exposed Summary/Introduction'),
    cite('tomioka-local', 'Farmhouses'),
    cite(
      'tomioka-labour-adaptation-1994',
      'Selected adaptation and working-hours passages',
    ),
  ],
};

export const tomiokaPlaceStudy: PlaceStudy = {
  title: 'Four places with different jobs and dates',
  description:
    'Published UNESCO component-reference points, displayed to the source table’s nearest second, orient a regional inquiry. The mill, farmhouse, school and cold-storage site had different histories. Points are modern property locators, not historical workstations or proof that a particular batch traveled between them. No shipment route, border or reconstructed site plan is drawn. The original case locator is preserved separately.',
  bounds: [138.6, 36.18, 139.27, 36.28],
  points: [
    {
      id: 'tomioka-mill-reference',
      label: 'Tomioka Silk Mill',
      coordinates: [138.887778, 36.255278],
      text: 'UNESCO 1449-001: E138°53′16″, N36°15′19″. The government mill opened in October 1872. This property-reference point does not identify an individual reel or worker.',
      citations: [
        cite('tomioka-unesco-coordinates', '1449-001'),
        cite('tomioka-local', 'Tomioka Silk Mill'),
      ],
    },
    {
      id: 'tajima-farm-reference',
      label: 'Tajima Yahei Sericulture Farm',
      coordinates: [139.239167, 36.246667],
      text: 'UNESCO 1449-002: E139°14′21″, N36°14′48″. The current table’s point is used explicitly; an older nomination search excerpt differs by one second in each coordinate. The 1863 farmhouse’s ventilation belongs to a history earlier than the model mill.',
      citations: [
        cite('tomioka-unesco-coordinates', '1449-002'),
        cite('tomioka-local', 'Farmhouses: Tajima'),
      ],
    },
    {
      id: 'takayama-school-reference',
      label: 'Takayama-sha Sericulture School',
      coordinates: [139.031667, 36.203333],
      text: 'UNESCO 1449-003: E139°1′54″, N36°12′12″. The farm became a school in 1884. Learning to manage warmth, airflow and humidity supported raising silkworms; it was a different task from reeling.',
      citations: [
        cite('tomioka-unesco-coordinates', '1449-003'),
        cite('tomioka-local', 'Farmhouses: Takayama-sha'),
      ],
    },
    {
      id: 'arafune-storage-reference',
      label: 'Arafune Cold Storage',
      coordinates: [138.635278, 36.246667],
      text: 'UNESCO 1449-004: E138°38′7″, N36°14′48″. The first units operated in 1905. Cooling postponed hatching; labels and catalogues supported returning egg cards when needed. This locator does not establish a particular delivery route.',
      citations: [
        cite('tomioka-unesco-coordinates', '1449-004'),
        cite('tomioka-arafune-2020', 'Preparing for storage'),
      ],
    },
  ],
  features: [],
};

export function applyIndustryTomioka(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'tomioka');
  if (!s) throw new Error('Tomioka continuation requires the inherited case');
  for (const [id, scope] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw new Error(`Missing inherited Tomioka source: ${id}`);
    const marker = 'Tomioka selected consultation, 2026-10-29:';
    if (!source.scope.includes(marker))
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker} ${scope}`;
    source.accessed = consulted;
  }
  for (const source of sources) {
    const index = c.sources.findIndex((row) => row.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  c.contexts = [
    ...(c.contexts ?? []).filter((row) => row.id !== tomiokaWorkContext.id),
    tomiokaWorkContext,
  ];
  s.contextIds = [...new Set([...(s.contextIds ?? []), tomiokaWorkContext.id])];
  s.summary =
    'Tomioka’s imported machinery depended on trained women, local building work and people raising silkworms. Later teaching, adaptation and storage extended the inquiry beyond the model mill; evidence of working conditions and legal protection needs its own dates and places.';
  s.sections = [
    sec(
      'A machine still needs practiced hands',
      'When the government mill opened in October 1872, machinery arrived within an existing silk-producing region. Japanese carpenters constructed buildings that joined French design with local timber, brick and plaster work. Inside, women learned demanding operations. Sashinami describes sorting cocoons, finding and drawing their filaments from hot water, joining them into raw silk and winding at the speed of powered machinery. Reliable output depended on attention and practice. A reel could organize motion without making the worker’s judgment unnecessary. French instructors and Japanese women trained by them helped others acquire these skills.',
      cite('tomioka-local', 'Tomioka Silk Mill; Women Mill Workers'),
      cite('tomioka-instructors-2022', 'Exposed Summary/Introduction'),
    ),
    sec(
      'Workers carried knowledge elsewhere',
      'One learner became a teacher. The National Diet Library records Wada Ei(ko) at Tomioka from April 1873 to July 1874, followed by instruction at another mill and, in 1878, a prefectural appointment. Her career makes women active participants in moving techniques. At the separate Rokkōsha mill in Matsushiro, imported arrangements were reworked using local materials. Nakamura and Molteni explain how other mills also replaced expensive components and combined different technical models. Adaptation involved decisions about construction, power and handling, rather than simply copying a complete French factory. Wada’s remembered comparison was written much later.',
      cite('tomioka-wada-ndl', 'Wada biographical paragraph'),
      cite(
        'tomioka-labour-adaptation-1994',
        'Rokkūsha and Nakayamasha adaptation; note 11',
      ),
    ),
    sec(
      'The crop has its own timetable',
      'Silk work also depended on keeping silkworms alive and producing cocoons. The region’s farmhouse experiments managed airflow, warmth and humidity. Takayama-sha became a school in 1884, joining teaching with practical rearing. Arafune’s first cold-storage units began operating in 1905. Cooling delayed eggs hatching; marked cards, testing, labels and catalogues helped organize storage and return. Such work changed when a living crop could be raised. The four heritage components therefore explain connected functions with different beginnings. They are not four parts opened together in 1872, nor proof of one recovered shipment between them.',
      cite('tomioka-local', 'Farmhouses and sericulture school'),
      cite('tomioka-arafune-2020', 'Preparing for storage'),
      cite('tomioka', 'Brief synthesis'),
    ),
    sec(
      'Training and protection are different questions',
      'Learning a valuable skill did not settle who controlled working time. Tomioka’s institutional account describes dormitories and trainers. Broader evidence from Suwa concerns other workplaces and must stay located there. The Factory Act was promulgated in 1911 but implemented only in September 1916. Its initial scope and exceptions matter when asking what protection meant in practice. Buildings, production and a model institution’s aims cannot alone tell us whether every worker could rest, leave or benefit equally.',
      cite('tomioka-local', 'Women Mill Workers'),
      cite('tomioka-factory-act-archives', 'Explanatory paragraph'),
      cite(
        'tomioka-labour-adaptation-1994',
        'Selected working-hours and exceptions passages',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'A recollection has more than one date',
      'Wada’s experience and its publication are separate evidence. The NDL says that she began writing memories in 1907; an edited book appeared in 1931. Nakamura and Molteni’s 1994 English chapter quotes a later Japanese edition when discussing her visit to Rokkōsha. Their chapter calls her Wada Hide, while the NDL uses Ei(ko). Here the biographical and technical accounts remain attributed to their sources. The original Japanese memoir and those editions have not been independently read or translated. The comparison shows what one remembered about adapting materials, without becoming a contemporary inspection of every reel.',
      cite('tomioka-wada-ndl', 'Wada entry and 1931 edition'),
      cite('tomioka-labour-adaptation-1994', 'Rokkūsha account; note 11'),
    ),
    sec(
      'Implementation is not a completed outcome',
      'The National Archives separates the 1911 law from its 1916 implementation. Nakamura and Molteni describe provisions allowing extended hours in silk-reeling. They also mediate a woman’s recollection of long days at an Okaya mill in 1917, the year after implementation. Their note leads to a 1981 publication; that original interview volume was not read here. The factory-inspection annual they cite is another record, not this woman’s own speech. Together these materials make a useful question: what happened after a rule existed? They do not supply a complete compliance history for Tomioka or speak for every worker. A model mill, a law and a worker’s retrospective account each require a different kind of interpretation.',
      cite('tomioka-factory-act-archives', 'Explanatory paragraph'),
      cite(
        'tomioka-labour-adaptation-1994',
        'Factory Act, Okaya recollection and notes 44–45',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'Hands, memories and rules',
    introduction:
      'These are editorial paraphrases of selected passages. A training account, a later recollection and an institutional legal caption answer different questions.',
    items: [
      {
        label: 'Technical skill is part of production',
        text: 'Sashinami’s exposed introduction describes women learning to sort cocoons, join filaments and reel at machine speed, then teaching other women.',
        interpretation:
          'Machinery and human practice worked together. The passage does not count every trainee, recover each woman’s consent or establish every factory’s conditions.',
        citations: [cite('tomioka-instructors-2022', 'Summary/Introduction')],
      },
      {
        label: 'A memory can explain a comparison',
        text: 'The NDL dates Wada’s Tomioka employment to 1873–74 and her memory-writing from 1907. The 1994 chapter uses her later account when comparing materials at Rokkōsha.',
        interpretation:
          'Experience, remembering, editing and translation have different dates. The original Japanese memoir was not freshly read, and Rokkōsha’s equipment is not silently transferred to Tomioka.',
        citations: [
          cite('tomioka-wada-ndl', 'Wada entry'),
          cite('tomioka-labour-adaptation-1994', 'Adaptation; note 11'),
        ],
      },
      {
        label: 'A law needs an implementation history',
        text: 'The National Archives gives 1911 promulgation and September 1916 implementation. The labor chapter discusses exceptions and a later recollection of long working days at Okaya.',
        interpretation:
          'The legal dates establish different steps. The recollection supplies a particular remembered experience through a later publication, rather than proving uniform compliance or violation at every mill.',
        citations: [
          cite('tomioka-factory-act-archives', 'Explanatory paragraph'),
          cite('tomioka-labour-adaptation-1994', '1916–17 discussion; notes 44–45'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What would a machine still need?',
    duration: '10–15 minutes',
    steps: [
      'Use the supplied capsule to name three jobs: tending silkworms, reeling silk and keeping egg cards in cool storage. Explain why one machine could not do all three.',
      'If the contemporary mill print is included, find two rows of people and equipment, and the roof supports. Describe what is drawn. If it is not available, use the capsule’s description of those features.',
      'Make date cards for 1872, 1884 and 1905. Match the mill, school and cold storage to them. Explain why the school and storage cannot be things opened with the mill in 1872.',
      'Sort two questions: What arrangement does the artist show? Could every worker leave or rest when she wanted? Decide which needs more evidence, then return to the opening question about moving technology.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: Tomioka opened in October 1872. Reeling required women to handle filaments and learn machine-paced work; other tasks included raising silkworms. Takayama-sha became a practical sericulture school in 1884, and Arafune’s first cold-storage units operated in 1905. Cooling helped delay hatching, while labels and catalogues organized egg cards. The NDL’s contemporary interior print arranges workers and equipment in two receding rows beneath roof supports. It is an artist’s published representation, not a photograph, payroll or complete account of freedom and rest. The NDL brackets its impression [1872]; MAFF dates a comparable impression 1873. The date match is mill/1872, school/1884, storage/1905. The image can support observations about its drawn arrangement; questions about workers’ choices require appropriate records and attributed accounts.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian, worker/community or family approval',
    scope:
      'Selected positive explanation of training, adaptation, regional sericulture/storage and the distinction between legislation and implementation. Two inherited source scopes renewed with their prior dated consultation retained; eight new selected source records. The complete exact opening interval, identity, original claim and dimensions remain unchanged. The reference frame reaches 1916 and distinguishes later recollection/publication. The separate place-study proposal uses four published modern UNESCO reference points; source plans and shipment routes are not reproduced.',
    limitations: [
      'The original Japanese Wada memoir, 1931/1978 editions, 1981 Okaya interview volume, 1903 surveys, original Factory Act and inspection annual were not read. English reminiscences are mediated through identified scholarship; the institutional Japanese legal caption is editorially paraphrased, not an independent statute translation.',
      'The 2022 chapter was read only at its exposed Introduction/Summary and metadata; the complete chapter and figure were unavailable in this consultation. The 1994 source was read at selected HTML passages, not as a fresh complete book, original experiment or universal workforce census. Suwa, Okaya and Matsushiro evidence is not a Tomioka payroll or recovered equipment list.',
      'No inherited Tomioka media exist. A separately inspected public-domain NDL print is an artistic representation with bracketed [1872] attribution; a comparable MAFF impression is dated 1873. Their exact print-state relationship and modern scan/exposure dates remain unverified. The MAFF image is research-only. No source image, object ID or new guide is added by this module.',
      'UNESCO coordinates identify modern component-reference points to the displayed second. The older/current Tajima difference is retained explicitly; no historical border, route, workstation or particular batch connection inferred. The large nomination, linked map and full heritage-management documentation were not consulted.',
      'Internal author checking does not establish independent historian approval, real adult/family usability, human screen-reader behavior, physical-device or print quality. No historical worker/community assent or modern partner endorsement is represented.',
    ],
  };
}
