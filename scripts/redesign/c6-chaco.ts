/** Selected Chaco sources and reading layers; shared inquiry integration is separate. */
import type {
  Corpus,
  HistoricalContext,
  Media,
  Source,
  Subject,
} from '../../src/atlas/model';
import { cite, interval, sec } from './content-helpers';

const consulted = '2026-10-29';

export const chacoSources: Source[] = [
  {
    id: 'chaco-pueblo-period',
    title: 'Pueblo Period: architecture, subsistence and regional interpretations',
    institution: 'National Park Service, Chaco Culture National Historical Park',
    url: 'https://www.nps.gov/chcu/learn/historyculture/pueblo-period.htm',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Selected opening AD 700–1300 convention, Architecture, Environment and Subsistence, Society and Politics, and Regional system passages read. Page updated 24 February 2015. Rubble-core/coursed-veneer construction and smaller habitation/storage compounds support practical explanation. Food supply, water-feature purpose and political institutions remain debated. Older hierarchical typology, room/population ratios and absence-of-elite claims are not adopted as current consensus. The linked 2006 volume and excavation datasets were not read. No source image or plan copied.',
  },
  {
    id: 'chaco-roads',
    title: 'Chacoan Roads',
    institution: 'National Park Service, Chaco Culture National Historical Park',
    url: 'https://www.nps.gov/chcu/learn/historyculture/chacoan-roads.htm',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Short main body on engineered alignments, carved steps/masonry ramps, identified segments, limited continuity and practical/ceremonial interpretations read; updated 24 February 2015. Many segments are discontinuous and their use remains interpreted. No guessed continuous track, universal ritual itinerary, exact timber convoy, origin route or political boundary. Beam totals/distances and cited walking experiments were not independently checked. No photograph or road-map geometry copied.',
  },
  {
    id: 'chaco-preservation',
    title: 'Preservation: exposed masonry and skilled care',
    institution: 'National Park Service, Chaco Culture National Historical Park',
    url: 'https://www.nps.gov/chcu/learn/historyculture/preservation.htm',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Selected deterioration/treatment-decision body, late 1930s Civilian Conservation Corps Indian Division/local Navajo preservation history and 2010 repair caption read. Updated 9 December 2023. Exposure and loss of roofs/plaster affect surviving masonry; affiliated tribes’ views are among preservation considerations. Present-tense staff descriptions are not verified 2026 employment claims, universal community agreement or unchanged ancient practice. No staff portrait, original photograph or full conservation dossier reused.',
  },
  {
    id: 'chaco-treatment',
    title: 'Treatment Techniques and Methods',
    institution: 'National Park Service, Chaco Culture National Historical Park',
    url: 'https://www.nps.gov/chcu/learn/historyculture/treatment-techniques-and-methods.htm',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Complete short main body and NPS-photo caption read; updated 24 February 2015. Mortar repair, stone replacement, capping, backfilling and protective measures concern modern treatment, not a new diagnosis/date of every photographed stone. No historical roof or missing upper storey reconstructed; no source photograph copied.',
  },
  {
    id: 'chaco-nps-ownership',
    title: 'NPS Disclaimer: Ownership and Maps',
    institution: 'National Park Service',
    url: 'https://www.nps.gov/aboutus/disclaimer.htm',
    type: 'archive',
    accessed: consulted,
    scope:
      'Ownership and Maps sections read; updated 5 March 2025. Official-duty federal works are generally public domain, with acknowledgement requested. Third-party copyright, trademarks/logos and map-provider exceptions remain; NPS hosting alone is not a blanket licence. The existing corner-doorway item’s specific NPS Photo credit is separately renewed. No logo or third-party image reused.',
  },
  {
    id: 'chaco-plan-1850',
    title: 'General ground plan of the Pueblo Bonito, Cañon of Chaco: Plate 37 / No. 6',
    institution:
      'David Rumsey Map Collection, Stanford Libraries; file record hosted by Wikimedia Commons',
    author:
      'Published with Lieut. J. H. Simpson’s expedition report; lithography P. S. Duval, Philadelphia; individual drafter not verified',
    url: 'https://commons.wikimedia.org/wiki/File:General_ground_plan_of_the_Pueblo_Bonito._Canon_of_Chaco._No._6._P.S._Duval%27s_Lith._Steam_Press._Philada._(to_accompany)_Reports_(IA_dr_general-ground-plan-of-the-pueblo-bonito-canon-of-chaco-no-6-ps-duval-0380041).jpg',
    type: 'primary',
    published: '1850',
    accessed: consulted,
    scope:
      'File metadata, underlying military-report context, licence notices and actual 1536×1098 JPEG pixels inspected. Plate 37/No. 6, room rows, Open Court, circular features labelled Estufa, true/magnetic-meridian marks, ruined portions and approximate Circuit about 1300 feet inscription observed. No measured scale bar or complete single-phase archaeological survey. This 1850 record of ruins is not an ancient blueprint or a room-use census. Direct Rumsey item cache-missed; full 250-page volume and other plates not read. Volume contributors are not automatically the individual drawing’s authors. Commons PDM/expired original copyright and provider CC BY-NC-SA 3.0 notices remain separate; no geometry traced. Source scan SHA-256 d646191beb55f6c2ff0857a0926ec56a48d88b78290f8209180274265fa52836.',
  },
  {
    id: 'chaco-rumsey-rights',
    title: 'David Rumsey Map Collection: Copyright and Permissions',
    institution: 'David Rumsey Map Collection / Cartography Associates',
    url: 'https://www.davidrumsey.com/about/copyright-and-permissions',
    type: 'archive',
    accessed: consulted,
    scope:
      'Current permission/credit paragraphs and linked Creative Commons deed read. Requested attribution names David Rumsey Map Collection, David Rumsey Map Center, Stanford University Libraries. The link resolves to CC BY-NC-SA 3.0. The page also describes broader publication use, including for-profit publishers; both statements are retained without claiming universal reconciliation or commercial permission. Conservative provider licence is retained alongside the underlying 1850 work’s separate public-domain status. No rights holder contacted; no new proprietary geometry claimed.',
  },
];

export const chacoContext: HistoricalContext = {
  id: 'chaco-community-work-context',
  title: 'Chaco communities: building, provisioning and circulation',
  region: 'Americas',
  interval: {
    start: 700,
    end: 1300,
    label: 'Selected Pueblo-period orientation, c.700–1300 CE',
    precision: 'approximate',
    note: 'Uses the NPS Pueblo-period archaeological convention as orientation, not the beginning/end of Pueblo peoples or one government. The complete original 850–1250 case and Pueblo Bonito’s narrower 850–1150 construction frame stay unchanged. Food, building and regional interpretations overlap; modern preservation, 1850 recording and the 2025 council statement are later evidence, not ancient phases.',
  },
  summary:
    'Great houses, smaller habitation compounds, food practices and constructed alignments supply different scales of evidence. Their relationships can explain work without choosing one complete political model or ending living cultural ties at a display boundary.',
  subjectIds: ['chaco-communities'],
  citations: [
    cite(
      'chaco-pueblo-period',
      'Opening period convention; Architecture and Subsistence',
    ),
    cite('chaco-bonito', 'Construction in stages, 850–1150 CE'),
    cite('chaco-history', 'Regional change and continuing associations'),
  ],
  phases: [
    {
      year: 700,
      label: 'c.700–1300: an archaeological period convention',
      title: 'Smaller habitation and storage spaces enter the frame',
      text: 'The NPS Pueblo-period account describes smaller habitation compounds alongside later great houses, with storage rooms, pithouses, outdoor shelters and additions. This broad material convention is not a founding year, universal household sequence or the origin of present-day Pueblo communities.',
      citations: [
        cite('chaco-pueblo-period', 'Opening; Architecture: smaller habitation sites'),
      ],
    },
    {
      year: 850,
      label: 'c.850–1150: Pueblo Bonito’s staged construction frame',
      title: 'A building changed over generations',
      text: 'NPS places Pueblo Bonito’s planned construction in stages across roughly three centuries. Rubble cores, faced masonry and varied spaces involved different materials and tasks. These broad dates do not identify every room’s construction, workers or occupants, or extend one building’s chronology to the full regional system.',
      citations: [
        cite('chaco-bonito', 'Construction paragraph'),
        cite('chaco-pueblo-period', 'Architecture: great houses and masonry'),
      ],
    },
    {
      year: 1000,
      label: 'c.1000–1125: stylistic dating of the earlier cacao-study samples',
      title: 'A small material sample answers a particular food question',
      text: 'The retained 2009 study consultation records five vessel-fragment samples, three positive probable cylinder jars and stylistic dates around 1000–1125. This supports a limited ingredient-use inference; the marker 1000 is not a known drinking event, an absolute wall date, a universal menu or an exact import route. The earlier 27 October consultation remains dated.',
      citations: [
        cite(
          'chaco-cacao',
          'Prior consultation: sample selection, results and stylistic dating',
        ),
      ],
    },
    {
      year: 1150,
      label: '1100s–1200s: changing construction and regional roles',
      title: 'Reorganization continues beyond a monumental centre',
      text: 'NPS describes slower new construction and changing regional roles in these centuries, with migration and connections to other places. The marker 1150 is an approximate orientation, not a single collapse event. Neither the selected regional case’s 1250 edge nor this reference’s 1300 edge ends Pueblo peoples or their continuing relationships with Chaco.',
      citations: [
        cite('chaco-history', 'Changes in the 1100s/1200s and continuing connections'),
      ],
    },
  ],
};

/** Central integration can give this shared comparison concept its final key. */
export const chacoWorkDimension: Subject['dimensions'][string] = {
  text: 'Masonry, smaller habitation spaces, food evidence and built alignments reveal different kinds of work. Regional organization remains interpreted, while a dated Pueblo council statement establishes living significance without identifying every ancient institution or implying assent to this account.',
  citations: [
    cite('chaco-pueblo-period', 'Architecture; Environment and Subsistence'),
    cite('chaco-roads', 'Identified segments and function debate'),
    cite('chaco-pueblo-council', 'Page 1, second WHEREAS clause'),
  ],
};

/** Licensed source scan with publication, ancient-use and provider rights kept distinct. */
export const chacoHistoricalPlan: Media = {
  id: 'chaco-plan-1850',
  subject: 'chaco-communities',
  source: 'chaco-plan-1850',
  title: 'Pueblo Bonito: a nineteenth-century record of ruins',
  accession: 'Plate 37 / No. 6; David Rumsey image 0380.041',
  creator:
    'Lithography P. S. Duval; published with J. H. Simpson report; individual drafter unverified',
  date: interval(
    1850,
    1850,
    'Plan published 1850; digital scan creation date unstated',
    'Publication is distinct from ancient construction, a precise field-survey day and the modern scan. A 2026 file upload does not date the drawing or establish scan creation.',
    'exact',
  ),
  representedDate:
    'Nineteenth-century record of surviving ruins; no single ancient occupied phase reconstructed',
  place:
    'Pueblo Bonito, Chaco Canyon; historical source plan, not a modern georeferenced survey',
  material: 'Digital JPEG scan of a published coloured lithograph',
  image: '/atlas/media/chaco-plan-1850.jpg',
  thumbnail: '/atlas/media/chaco-plan-1850-thumb.webp',
  width: 1536,
  height: 1098,
  printWidthMm: 145,
  alt: 'Historical plan with rows of small rectangles around an open court, circular features labelled Estufa, ruined eastern portions and two meridian marks; no measured scale bar.',
  caption:
    'Published 1850 with a U.S. military expedition report, Plate 37/No. 6 records ruins at Pueblo Bonito. Visible labels include Open Court and Estufa; these are the recorder’s labels, not recovered ancient room names. True/magnetic-meridian marks and an approximate Circuit about 1300 feet note appear, but there is no measured scale bar. Regular room rows and ruined areas do not supply one complete occupied phase, a census or the functions of every room. The scan retains the original bounds; no source geometry is traced or restored.',
  printCaption:
    '1850 ruins record: room rows, Open Court and Estufa labels. No measured scale or single ancient phase.',
  notice: [
    'Find the open court, rectangular room marks and circular labelled features.',
    'Which observations belong to an 1850 record rather than a known ancient building plan?',
  ],
  rights:
    'Underlying 1850 work identified as public domain in Commons; provider scan licence CC BY-NC-SA 3.0 retained conservatively. These are separate rights statements; broader provider publication wording is not treated as universal commercial permission.',
  licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/3.0/',
  credit:
    'Published with Lieut. J. H. Simpson’s expedition report, 1850; lithography P. S. Duval, Philadelphia. David Rumsey Map Collection, David Rumsey Map Center, Stanford University Libraries; source file via Wikimedia Commons. CC BY-NC-SA 3.0 provider notice retained alongside underlying-public-domain status. Source bounds unchanged; no tracing or reconstruction.',
  printCredit:
    '1850 lithograph via David Rumsey Map Collection, Stanford University Libraries. Provider CC BY-NC-SA 3.0; original-public-domain notice separate.',
  sourceImage:
    'https://upload.wikimedia.org/wikipedia/commons/2/23/General_ground_plan_of_the_Pueblo_Bonito._Canon_of_Chaco._No._6._P.S._Duval%27s_Lith._Steam_Press._Philada._%28to_accompany%29_Reports_%28IA_dr_general-ground-plan-of-the-pueblo-bonito-canon-of-chaco-no-6-ps-duval-0380041%29.jpg',
  depiction: 'explanatory diagram',
  relevance:
    'Makes a dated observer’s spatial record inspectable while separating source labels, ruin conditions, modern scanning and ancient building/use questions.',
  datingNote:
    'The 1850 publication belongs to a military reconnaissance record, not ancient construction. Field observation and scan dates are not independently established; the complete source volume and direct Rumsey item were not read.',
  additionalImages: [],
};

function renew(c: Corpus, id: string, scope: string): void {
  const row = c.sources.find((source) => source.id === id);
  if (!row) throw new Error(`Missing inherited Chaco source: ${id}`);
  const marker = 'Chaco selected renewal, 2026-10-29:';
  if (!row.scope.includes(marker))
    row.scope = `Prior consultation, ${row.accessed} (retained): ${row.scope} ${marker} ${scope}`;
  row.accessed = consulted;
}

export function applyCommunitiesChaco(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'chaco-communities');
  if (!s) throw new Error('Missing inherited Chaco case');
  for (const source of chacoSources) {
    const existing = c.sources.find((row) => row.id === source.id);
    if (existing) Object.assign(existing, source);
    else c.sources.push({ ...source });
  }
  renew(
    c,
    'chaco-history',
    'Selected Center of Chacoan Culture body and traditionally associated peoples list reconsulted; page updated 15 January 2026. Multi-generation construction, attributed gathering interpretation, 1100s/1200s change and continuing relationships. Institutional labels are interpretations, not a definitive population count, state boundary or universal descendant view. No linked tribal page or present land-policy status independently verified; no third-party image reused.',
  );
  renew(
    c,
    'chaco-bonito',
    'Selected construction paragraph and page/update/photo credit metadata, updated 18 December 2017. Planned construction in stages 850–1150 CE is distinct from the unchanged 850–1250 regional case and broader Pueblo-period convention. No room-by-room dating, current visitor condition or source photograph reuse inferred.',
  );
  renew(
    c,
    'chaco-nps-photo',
    'Specific Places To Go Pueblo Bonito image 10 caption/alt and NPS Photo credit reconsulted, plus selected nearby Casa Rinconada community description. Updated 17 October 2024. Existing 1600×1200 image actually inspected/hashed unchanged; exposure date/individual maker and current remote-original byte parity unknown. Modern preservation and original masonry are not separated stone-by-stone from pixels. Other named/third-party page images not copied; NPS Ownership exceptions retained.',
  );
  renew(
    c,
    'chaco-pueblo-council',
    'Resolution APCG 2025-02, page 1 header and first/second WHEREAS clauses reconsulted in text and actual page pixels; four-page PDF saved but remaining page pixels/policy clauses not adopted. Dated council-authored continuing-significance statement, not an archaeological wall date, current-law report, universal community agreement or assent to the atlas. No logo/illustration reused; no explicit open licence established.',
  );
  // chaco-cacao deliberately retains its actual27October source scope/access date.
  // Fresh full-text access returned a challenge,so no renewed reading is claimed.
  const index = (c.contexts ?? []).findIndex((row) => row.id === chacoContext.id);
  if (index < 0) c.contexts = [...(c.contexts ?? []), chacoContext];
  else c.contexts![index] = chacoContext;
  s.contextIds = [...new Set([...(s.contextIds ?? []), chacoContext.id])];
  s.summary =
    'Chaco’s buildings required stonework, timber, food and repeated care. Great houses, smaller habitation compounds and constructed alignments reveal different scales of work. Their institutional meaning remains debated, while a dated Pueblo council statement makes continuing relationships with the landscape explicit.';
  s.sections = [
    sec(
      'Materials made different spaces possible',
      'Rows of stones and wood spanning openings are visible in the supplied Pueblo Bonito photograph. The NPS architectural account describes great-house walls built with rubble cores and carefully coursed outer masonry. These were different parts of a construction, not simply a decorated flat surface. Builders also arranged rooms, plazas and circular spaces. Pueblo Bonito’s staged construction frame stretches approximately 850–1150 CE: making a large building involved successive work rather than one completed moment. The photograph cannot date every part or name its builders.',
      cite(
        'chaco-nps-photo',
        'Inspected corner-doorway photograph and current caption',
      ),
      cite(
        'chaco-pueblo-period',
        'Architecture: great houses and core/veneer construction',
      ),
      cite('chaco-bonito', 'Staged construction paragraph'),
    ),
    sec(
      'Smaller houses belong beside the monuments',
      'The same NPS account describes smaller habitation sites with storage rooms, pithouses, outdoor shelters and later room additions. Such spaces place keeping supplies and carrying out household activities beside monumental construction. Their smaller scale matters: a great house should not stand in for every home in the canyon. NPS discusses the great houses as possible public architecture used for gathering and ceremony. That interpretation opens a question about how residents and visitors shared work; it does not recover every room’s function or choose one settled government model.',
      cite('chaco-pueblo-period', 'Architecture: smaller habitation sites'),
      cite('chaco-history', 'Public-architecture and gathering interpretations'),
    ),
    sec(
      'Food connected fields, storage and gathering',
      'People living and gathering in this landscape needed food as well as buildings. The NPS subsistence account discusses rainfall variation, stored plant remains and water-control features. It presents competing explanations for the balance between local cultivation and supplies brought from outside. Directing seasonal water, keeping crops and preparing food were practical tasks; their precise scale and organization remain questions. A material found in selected vessels can document an ingredient, while evidence for staple farming must address different fields, samples and environmental conditions.',
      cite('chaco-pueblo-period', 'Environment and Subsistence'),
      cite('chaco-cacao', 'Earlier consultation: sample and interpretation limits'),
    ),
    sec(
      'Built connections have more than one possible use',
      'Carved steps, masonry stairways and ramps show work invested in moving through the landscape. NPS also explains that many identified road segments do not form a demonstrably continuous route. Some may have had ceremonial or symbolic roles alongside practical uses. New construction and Chaco’s regional role changed in the 1100s and 1200s; this does not end Pueblo histories. A 2025 All Pueblo Council of Governors resolution describes continuing spiritual, historical and cultural significance. It is an attributed statement of living relationships, not proof that every person endorses one archaeological explanation.',
      cite('chaco-roads', 'Identified segments and function debate'),
      cite('chaco-history', 'Changing regional roles and continuing connections'),
      cite('chaco-pueblo-council', 'Page 1, second WHEREAS clause'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A photograph contains preservation history',
      'The surviving walls need care after exposure. NPS describes water, freeze–thaw cycles and lost roofs or plaster as causes of deterioration. Modern treatment can include mortar repair, replacement stones, capping and backfilling. Its account also documents local Navajo crews working in the late 1930s preservation programme. These are skilled activities with their own dates. They make the present photograph useful evidence of a conserved structure, without letting us classify every visible stone as ancient or modern by appearance alone.',
      cite(
        'chaco-preservation',
        'Deterioration, treatment decisions and CCC-ID history',
      ),
      cite('chaco-treatment', 'Treatment list'),
    ),
    sec(
      'A small chemical sample does not become a universal menu',
      'The retained Crown and Hurst consultation records five vessel-fragment samples from Pueblo Bonito. Three probable cylinder-jar samples yielded theobromine, interpreted as cacao evidence; stylistic dating places the sherds around 1000–1125 CE. This supports an ingredient-use inference and raises questions about preparation and movement. It does not identify all intermediaries, an exact route, every household’s access or the main source of staple calories. The study’s separately copyrighted vessel figure is not reproduced.',
      cite(
        'chaco-cacao',
        'Prior 27 October consultation: sample selection, results and dating',
      ),
    ),
    sec(
      'Institutional descriptions need named perspectives',
      'A gathering place, a redistribution centre and a political centre are interpretations that call for different evidence. They need not explain every structure or century alike. The council resolution contributes another kind of record: a dated statement that Greater Chaco remains culturally significant. Reading it alongside archaeological questions neither makes contemporary peoples disappear at a timeline boundary nor treats them as unanimous witnesses to one reconstruction. Fuller specialist and community review remains necessary.',
      cite('chaco-history', 'Regional questions and descendants’ accounts'),
      cite('chaco-pueblo-council', 'Page 1, second WHEREAS clause'),
    ),
  ];
  s.evidenceReading = {
    title: 'Visible work, chemical traces and a dated community statement',
    introduction:
      'These are editorial paraphrases of different sources. A photograph, a small analytical sample and a community-authored document answer different questions; none is a complete census or a recovered route.',
    items: [
      {
        label: 'Masonry faces are visible; the whole building system is interpreted',
        text: 'The supplied photograph shows arranged stone courses and wood over openings. NPS separately describes rubble-core/faced masonry and modern conservation treatments.',
        interpretation:
          'The photograph supports close observation of materials and arrangement. It does not expose every core, identify all modern repairs, restore missing floors or establish each room’s use, occupants or original construction year.',
        citations: [
          cite('chaco-nps-photo', 'Actual image pixels and caption'),
          cite('chaco-pueblo-period', 'Architecture'),
          cite('chaco-treatment', 'Modern treatment list'),
        ],
      },
      {
        label: 'Three positive samples support a bounded ingredient inference',
        text: 'The earlier checked 2009 study tested fragments representing five vessels; three probable cylinder jars yielded theobromine, interpreted as cacao evidence.',
        interpretation:
          'Presence in these samples is not evidence of universal access, a fixed serving event, an exact route or a field’s crop yield. The actual earlier 27 October consultation is retained; the 29 October consultation did not reread inaccessible full text or reproduce its separately copyrighted figure.',
        citations: [
          cite('chaco-cacao', 'Earlier sample-selection and results consultation'),
        ],
      },
      {
        label: 'A council speaks about continuing significance',
        text: 'Page 1 of APCG 2025-02 describes Greater Chaco’s continuing spiritual, historical and cultural significance to many Pueblos and Tribes including Hopi.',
        interpretation:
          'This is a dated community-authored statement about living relationships. It does not date a wall, represent each individual’s view, establish current law or imply community assent to this atlas or one archaeological interpretation.',
        citations: [
          cite(
            'chaco-pueblo-council',
            'Page 1, second WHEREAS clause; actual page pixels',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What work can a wall help us explain?',
    duration: '10–15 minutes',
    steps: [
      'Find rows of differently sized stones and wood spanning an opening in the supplied photograph. Describe what is visible before naming a room’s purpose.',
      'Read the source capsule with an adult if useful. Make three cards: visible construction, a chemical finding and a dated community statement. Match each claim to its kind of evidence.',
      'Write one supported sentence about a building task. Add a question about a room’s use or an ingredient’s route that the photograph cannot answer.',
      'Explain why a selected timeline endpoint does not show that Pueblo peoples or their relationships with Chaco ended.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: NPS describes great-house masonry with cores and faced stonework, alongside smaller habitation/storage compounds and modern preservation. The earlier checked Crown/Hurst study reports three positive probable cylinder-jar samples among five tested vessel fragments, not a universal drink or exact route. APCG 2025-02 p. 1 describes Chaco’s continuing cultural significance. Stone courses can be observed; hidden cores, ingredient identification and contemporary statements require their respective sources. None names every builder or proves one room’s use.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian, archaeologist or community approval',
    scope:
      'Selected NPS accounts, the retained cacao consultation, a council statement and an 1850 ruin plan support this layered inquiry. Earlier case dates, image bytes and dated source scopes remain.',
    limitations: [
      'NPS c.700–1300, Pueblo Bonito c.850–1150, the 850–1250 case and c.1000–1125 sample dates are separate conventions, not a lifespan for Pueblo peoples.',
      'Food supply, water works and regional institutions remain debated. Earlier NPS typologies do not establish a universal household model, political hierarchy, census or crop yield.',
      'Cacao retains its 27 October consultation. Fresh cacao/isotope access challenges and USGS/2012 food-source failures supplied no new complete methods, figures or crop-provenance review. Detailed access scopes remain in the bibliography.',
      'APCG 2025-02 was consulted at p.1/header/first two WHEREAS clauses and selected page pixels only. It supplies an attributed statement, not current-law verification, universal agreement or approval of this atlas. No logo or figure reused.',
      'Discontinuous alignments and interpreted functions do not recover an exact road, border or timber convoy. No route between the inquiry’s stops or new numeric locator is supplied.',
      'The unchanged doorway photo has unknown exposure date, individual maker and current remote-original parity. Pixels do not date individual repairs. Separately credited NPS-hosted images retain separate rights.',
      'The 1850 ruin record has no measured scale bar or single ancient phase. Underlying-public-domain and provider CC BY-NC-SA 3.0 notices remain distinct; no tracing. The direct Rumsey item and full volume were not read.',
      'Independent scholarly/community review, real family use, human screen-reader, physical-device and physical-print acceptance remain open.',
    ],
  };
  // Preserve s.interval,claims,identity,old dimensions,object IDs/order and media.
  // Shared inquiry integration supplies the dimension and licensed source plan.
}
