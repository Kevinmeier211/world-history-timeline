/**
 * Borobudur: source-qualified built form, reliefs, upkeep and communities.
 * Modern source images retain their own creation dates and CC BY-SA 3.0 rights.
 * No measured archaeological plan or required ancient itinerary is reconstructed.
 */
import type {
  Corpus,
  HistoricalContext,
  Media,
  PlaceStudy,
  Source,
} from '../../src/atlas/model';
import { cite, interval, sec } from './content-helpers';

const consulted = '2026-10-29';
const ccSa = 'https://creativecommons.org/licenses/by-sa/3.0/';

export const borobudurSources: Source[] = [
  {
    id: 'borobudur-roof-study-2022',
    title:
      'Roof typology of wooden-constructed buildings on the reliefs of Borobudur Temple',
    author: 'Hari Setyawan',
    institution: 'Berkala Arkeologi 42(2), 137–164; BRIN',
    url: 'https://ejournal.brin.go.id/berkalaarkeologi/article/view/4177',
    type: 'archaeology',
    published: '2022-12-26',
    accessed: consulted,
    scope:
      'DOI 10.30883/jba.v42i2.983. Selected web-PDF text consulted: printed pp. 137–143 / PDF 1–7 and pp. 161–162 / PDF 25–26, with adjacent conclusion text encountered. Header gives original publication 26 December 2022 in the November 2022 issue; landing-page posting/citation date 23 March 2024 is separate. Methods, relief-location/reading convention, Table 1, interpreted functions and limitations read; no PDF page pixels, full 28-page consultation, source figure or original wooden building inspected. The roof-only typology cannot recover complete dimensions or structures from one-face depictions. Abstract says at least six roof types while conclusion lists seven; no total adopted. Article-specific CC BY-NC-SA 4.0, not the generic footer licence; separately credited third-party figures are not cleared or copied.',
  },
  {
    id: 'borobudur-karmawibhangga-2016',
    title: 'Identification of Karmawibhangga Reliefs at Candi Borobudur',
    author: 'Hariani Santiko',
    institution: 'Amerta 34(2), 129–138; BRIN',
    url: 'https://ejournal.brin.go.id/amerta/article/view/3400',
    type: 'archaeology',
    published: '2016',
    accessed: consulted,
    scope:
      'Landing-page abstract, original 2016 issue/copyright, author and licence metadata only consulted. Platform posting is 19 January 2024; it is not the original research date. Abstract interprets Karmawibhangga through religious-text comparison and local cultural adaptation using a ninth–tenth-century cultural frame. This does not silently redate UNESCO construction or the unchanged 700–900 case. Linked full PDF, underlying T80/T81 texts and panel pixels not consulted. Article landing page states CC BY-SA 4.0; no figure copied or adopted for panel-specific observation.',
  },
  {
    id: 'borobudur-inscription-context-2018',
    title: 'PRASASTI: inscriptions and religious upkeep',
    author: 'ihwan',
    institution: 'BorobudurPedia; Museum & Cagar Budaya – Warisan Dunia Borobudur',
    url: 'https://borobudurpedia.id/ensiklopedia/prasasti/',
    type: 'scholarship',
    published: '2018-11-13',
    accessed: consulted,
    scope:
      'Complete short institutional encyclopedia entry and current portal footer consulted. General sīma/tax-privilege and religious-upkeep discussion, and the entry’s interpretation linking Tri Tepusan 842, Sri Kahulunan and Kamulan/Bhumi Sambhara to Borobudur adopted with attribution. This is not a newly consulted complete inscription translation or secure individual-founder biography. Sri Kahulunan is not silently equated with a named princess; actual revenue, compliance, labor conditions and a village route are not recovered. Portal reserves copyright; no inscription image or drawing copied.',
  },
  {
    id: 'borobudur-kayumwungan-edition',
    title: 'Kayumwungan charter of the Veṇuvanavihāra (746 Śaka)',
    author: 'Arlo Griffiths, digital editor',
    institution: 'DHARMA / dharmalekha',
    url: 'https://dharmalekha.info/texts/INSIDENKKayumwungan',
    type: 'primary',
    accessed: consulted,
    scope:
      'Edition metadata, selected visible Sanskrit/Old Javanese edition and English translations of stanzas 12 and 14 consulted; visible version 28 August 2026, last modification 26 August 2026. No fresh independent translation of the edition attempted. This selected English translation does not cover the complete Old Javanese grant section. Kayumwungan is a different record from the 842 Tri Tepusan inscription interpreted in the BorobudurPedia entry; the documents and evidentiary scopes are not conflated. Linked De Casparis, Long and Sarkar publications not consulted. No rights-cleared inscription image or complete translated foundation account supplied.',
  },
  {
    id: 'borobudur-drainage-2018',
    title: 'DRAINASE: Borobudur water disposal and restoration',
    author: 'Balai Konservasi Borobudur',
    institution: 'BorobudurPedia; Museum & Cagar Budaya – Warisan Dunia Borobudur',
    url: 'https://borobudurpedia.id/ensiklopedia/drainase/',
    type: 'archaeology',
    published: '2018-11-09',
    accessed: consulted,
    scope:
      'Complete short entry consulted, especially the two Borobudur-specific paragraphs after the general definition and caption identifying second-restoration drainage. Earlier rainwater disposal through jaladwara is distinguished from a new pipe/infiltration/control-basin system introduced in the second restoration. UNESCO supplies the 1973–1983 restoration interval separately. No exact pipe layout, original untouched system, modern engineering performance or drainage-figure reuse established. Copyright reserved; linked image not downloaded, traced or cleared.',
  },
  {
    id: 'borobudur-community-architecture-2026',
    title:
      'UNESCO Holds Vernacular Architecture Exhibition “Omah Jawa Mbuduran” at Borobudur World Heritage Site',
    institution: 'UNESCO',
    url: 'https://www.unesco.org/en/articles/unesco-holds-vernacular-architecture-exhibition-omah-jawa-mbuduran-borobudur-world-heritage-site',
    type: 'archive',
    published: '2026-01-08',
    accessed: consulted,
    scope:
      'Complete short article, updated 9 January 2026, consulted. Distinguishes July 2024–February 2025 documentation, 14–20 December 2025 exhibition at Balkondes Giritengah and January 2026 publication. Builders, carpenters, potters and cultural practitioners participate in present-day architectural/material knowledge. Named speakers and project purpose read; no claim of unchanged eighth-century houses, unbroken craft genealogy or universal community agreement. No article photograph copied or specific photo-reuse licence verified.',
  },
  {
    id: 'borobudur-monitoring-mission-2024',
    title:
      'Report on the Joint World Heritage Centre/ICOMOS Reactive Monitoring Mission: Borobudur Temple Compounds (C592)',
    author: 'Himalchuli Gurung, Hiroko Shiokawa and Richard Mackay, mission team',
    institution: 'UNESCO World Heritage Centre / ICOMOS',
    url: 'https://whc.unesco.org/document/221180',
    type: 'archive',
    accessed: consulted,
    scope:
      'Mission 2–6 December 2024; exact report-release date not independently established. Selected web-PDF text only: cover/contents/intro/executive-summary portions, §§1.5–1.7 pp. 15–17, selected §3.3.2 pp. 36–41 and §3.6 pp. 52–54. No 81-page full consultation or PDF pixels claimed. Modern Cultural Axis Path project, mediated resident/vendor concerns and recommendations distinguished from an ancient itinerary, all community views or completed implementation. Varying reported vendor totals not harmonized. Photographs have individual/State Party credits; no open reuse licence established and none copied.',
  },
  {
    id: 'borobudur-component-locations',
    title: 'Borobudur Temple Compounds: geographical data for serial components',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/592/maps/',
    type: 'archive',
    accessed: consulted,
    scope:
      'Component-list coordinate rows 592-001 Borobudur, 592-002 Mendut and 592-003 Pawon consulted. Published DMS coordinates arithmetically converted to decimal, not field-surveyed anew. They are modern serial-property reference points, not exact entrances, excavated features, ancient boundaries or evidence of a movement route. Listed 2012 clarification maps were not opened/copied; disclaimer and coordinate table are distinct from an inspected archaeological plan.',
  },
  {
    id: 'borobudur-plan-image',
    title: 'Borobudur Ground Plan: modern schematic',
    author: 'Indon',
    institution: 'Creator-supplied Wikimedia Commons file record',
    url: 'https://commons.wikimedia.org/wiki/File:Borobudur_Ground_Plan.png',
    type: 'catalogue',
    published: '2007',
    accessed: consulted,
    scope:
      'Creator/date/own-work/licence record consulted and actual 800×800 PNG pixels inspected and hashed. Modern stepped-square/circular schematic with stair-like projections, no north arrow, scale, gallery labels or colour legend. No underlying measured survey was inspected or established in the record. Offered under GFDL and CC BY-SA 3.0; the latter is selected. The separate 2009 replacement diagram’s own record flags a niche-count error; it is rejected as a verified inventory, not substituted here. No geometry traced or new original artwork claimed. Source SHA-256 353f5c0fcd994ad5496ab6066a4abe46f23b923b8ed1461be5cf5a741c8e6182.',
  },
  {
    id: 'borobudur-photo-image',
    title: 'Borobudur: conserved monument photograph, June 2008',
    author: 'Gunawan Kartapranata',
    institution: 'Creator-supplied Wikimedia Commons file record',
    url: 'https://commons.wikimedia.org/wiki/File:Borobudur-Nothwest-view.jpg',
    type: 'catalogue',
    published: '2008',
    accessed: consulted,
    scope:
      'Creator/own-work/date/licence record and original 2816×1108 JPEG pixels inspected and hashed. Current date 12 June 2008 conflicts with displayed original-capture metadata 7 June 2008; only June 2008/year 2008 adopted. Current title/description northwest conflicts with original upload comment northeast; no compass view adopted. Photograph offered under CC BY-SA 3.0 and GFDL; CC BY-SA 3.0 selected. Separate public-domain status of the building is not a public-domain photo licence. Source SHA-256 905aec75d7af12e2466512134d4e647a573fa4a0bb09b143d251f5664cd80128. Conserved site overview; fine relief stories unreadable at this scale.',
  },
];

export const borobudurContext: HistoricalContext = {
  id: 'central-java-religious-landscapes',
  title: 'Central Java: religious buildings, stories and support',
  region: 'Southeast Asia/Oceania',
  interval: {
    start: 700,
    end: 1000,
    label: 'Eighth–tenth centuries: selected construction and relief-study frames',
    precision: 'approximate',
    note: 'Teaching frame combines UNESCO’s eighth–ninth-century monumental construction with Santiko’s attributed ninth–tenth-century cultural frame for Karmawibhangga interpretation. These overlap rather than form universal successive stages. They do not extend the complete 700–900 case, date every relief or establish a continuous polity, universal itinerary or an exact end of use. Modern conservation/community sources are explicitly later reading, not ancient phases.',
  },
  summary:
    'Stone galleries, religious narratives and support for upkeep are different parts of a religious landscape. Source-specific dates and interpretations help explain their relationship while leaving individual patrons, households and visitors incompletely known.',
  subjectIds: ['borobudur'],
  citations: [
    cite('borobudur', 'Brief synthesis: construction and associated monuments'),
    cite('borobudur-karmawibhangga-2016', 'Abstract: cultural frame'),
    cite('borobudur-inscription-context-2018', 'Tri Tepusan interpretation'),
  ],
  phases: [
    {
      year: 700,
      label: 'Eighth–ninth centuries: broad construction frame',
      title: 'A hill, carved galleries and upper platforms',
      text: 'UNESCO places monumental construction broadly in these centuries under the Syailendra dynasty. Square terraces and circular upper platforms organize a building around a natural hill. The source’s broad frame supplies orientation rather than exact beginning and completion years for each part.',
      citations: [
        cite('borobudur', 'Brief synthesis: location, construction and form'),
      ],
    },
    {
      year: 800,
      label: 'Ninth–tenth centuries: one study’s cultural frame',
      title: 'Religious narratives represented in local settings',
      text: 'Santiko’s abstract interprets Karmawibhangga through religious-text comparison and Javanese cultural adaptation, using a ninth–tenth-century frame. This is a study-specific interpretive setting, not a new construction date or an independently verified date for every depicted building.',
      citations: [cite('borobudur-karmawibhangga-2016', 'Abstract only')],
    },
    {
      year: 842,
      label: '842: an attributed land-and-upkeep interpretation',
      title: 'Religious support enters an inscription account',
      text: 'BorobudurPedia connects Tri Tepusan, Sri Kahulunan and land privileges for a religious foundation with Borobudur. This modern institutional interpretation is kept distinct from a complete primary translation, a securely named founder or proof of collected revenue. It does not derive from the different Kayumwungan edition’s two consulted English stanzas.',
      citations: [
        cite('borobudur-inscription-context-2018', 'Tri Tepusan and sīma discussion'),
        cite('borobudur-kayumwungan-edition', 'Translation: stanzas 12 and 14 only'),
      ],
    },
  ],
};

/** Three published property references; no ancient route or source map copied. */
export const borobudurPlaceStudy: PlaceStudy = {
  title: 'Borobudur, Pawon and Mendut: three component references',
  description:
    'Published modern World Heritage component coordinates orient three distinct monuments. They are not exact entrances or archaeological findpoints. UNESCO describes the associated temples on an alignment; no connecting itinerary, path, political boundary or shared construction episode is reconstructed here. No coastline or unsourced ancient settlement is drawn.',
  bounds: [110.198, -7.613, 110.233, -7.6],
  points: [
    {
      id: 'borobudur-component-reference',
      label: 'Borobudur — monumental hill',
      coordinates: [110.2038611111, -7.6077780556],
      text: 'Coordinate converted from component 592-001: S7°36′28.001″, E110°12′13.9″. This serial-property reference is not a measured point on the 2007 schematic, an exact entrance or a replacement for the inherited approximate dossier anchor.',
      citations: [
        cite('borobudur-component-locations', 'Component 592-001 coordinate row'),
      ],
    },
    {
      id: 'pawon-component-reference',
      label: 'Pawon — associated temple',
      coordinates: [110.2196111111, -7.6060830556],
      text: 'Coordinate converted from component 592-003: S7°36′21.899″, E110°13′10.6″. UNESCO includes Pawon in the three-monument property. The reference locates the monument without establishing an ancient route, contemporary household or exact construction year.',
      citations: [
        cite('borobudur-component-locations', 'Component 592-003 coordinate row'),
        cite('borobudur', 'Brief synthesis: associated monuments'),
      ],
    },
    {
      id: 'mendut-component-reference',
      label: 'Mendut — associated temple',
      coordinates: [110.2301111111, -7.6048611111],
      text: 'Coordinate converted from component 592-002: S7°36′17.5″, E110°13′48.4″. This is a modern property reference. The 2024 monitoring mission discusses a modern Cultural Axis Path project; that project is not evidence for an ancient procession between these dots.',
      citations: [
        cite('borobudur-component-locations', 'Component 592-002 coordinate row'),
        cite(
          'borobudur-monitoring-mission-2024',
          '§3.3.2 pp. 36–41: modern Cultural Axis Path',
        ),
      ],
    },
  ],
  features: [],
};

/** Licensed photograph of the conserved surviving monument. */
export const borobudurPhoto: Media = {
  id: 'borobudur-conserved-monument',
  subject: 'borobudur',
  source: 'borobudur-photo-image',
  title: 'Borobudur: a conserved monument in June 2008',
  accession: 'Gunawan Kartapranata, Borobudur-Nothwest-view.jpg, Wikimedia Commons',
  creator: 'Gunawan Kartapranata, photographer; ancient builders and carvers unnamed',
  date: interval(
    2008,
    2008,
    'Photograph made June 2008; exact day unresolved',
    'The current file record says 12 June 2008 while displayed original-capture metadata says 7 June 2008. June/year is retained without choosing between those days. The modern photograph date is distinct from broad eighth–ninth-century construction.',
    'range',
  ),
  representedDate:
    'Surviving monument with early fabric and modern conservation, photographed in 2008; not an eighth-century reconstruction',
  place: 'Borobudur, Kedu Valley, Central Java, Indonesia; compass view unresolved',
  material: 'Modern digital photograph of a stone monument',
  image: '/atlas/media/borobudur-conserved-monument.jpg',
  thumbnail: '/atlas/media/borobudur-conserved-monument-thumb.webp',
  width: 2816,
  height: 1108,
  printWidthMm: 145,
  alt: 'Wide photograph of a stepped stone monument, stairways, niches and a central stupa, with modern lawn, trees and visitors.',
  caption:
    'Photograph by Gunawan Kartapranata, June 2008. The visible stone terraces and upper stupa belong to a conserved surviving monument, not an untouched ancient surface or a new reconstruction. UNESCO documents twentieth-century restoration, including 1973–1983. Current source description and the original upload comment disagree on compass direction, so none is assigned. Fine relief narratives are not readable in this overview.',
  printCaption:
    'Conserved Borobudur photographed in June 2008, distinct from eighth–ninth-century construction. Exact day and compass view remain unresolved; fine reliefs are not legible in this overview.',
  notice: [
    'Find the changes between square terrace forms and circular upper forms using the plan as a separate guide.',
    'What evidence would distinguish earlier stonework from later conservation?',
  ],
  rights:
    'Gunawan Kartapranata; photograph CC BY-SA 3.0. Building-public-domain status is separate.',
  licenseUrl: ccSa,
  credit:
    'Gunawan Kartapranata, 2008, via Wikimedia Commons, CC BY-SA 3.0. Original photograph; source image retained without crop or retouching.',
  printCredit: 'Gunawan Kartapranata, 2008; CC BY-SA 3.0, via Wikimedia Commons.',
  sourceImage:
    'https://upload.wikimedia.org/wikipedia/commons/8/8c/Borobudur-Nothwest-view.jpg',
  depiction: 'object photograph',
  relevance:
    'Makes the conserved building’s overall form visible while separating camera date, historical construction and modern interventions.',
  datingNote:
    'The source date field and original-capture metadata differ by five days. The title/current description and original upload comment also disagree on northwest/northeast. Neither conflict is silently resolved.',
  additionalImages: [],
};

/** Licensed source schematic, not a new original or measured archaeological plan. */
export const borobudurPlan: Media = {
  id: 'borobudur-schematic-plan',
  subject: 'borobudur',
  source: 'borobudur-plan-image',
  title: 'Borobudur: a modern schematic of square and circular forms',
  accession: 'Indon, Borobudur Ground Plan.png, Wikimedia Commons',
  creator: 'Indon; modern own-work diagram',
  date: interval(
    2007,
    2007,
    'Modern schematic made in 2007',
    'Creator-provided year, separate from eighth–ninth-century construction. Exact drawing day and an underlying measured survey were not established.',
    'exact',
  ),
  representedDate:
    'Schematic organization of Borobudur’s surviving forms; no single ancient phase, measured survey or visitor itinerary represented',
  place: 'Borobudur, Central Java; schematic has no north arrow or scale',
  material: 'Modern colour PNG diagram; source pixels unaltered',
  image: '/atlas/media/borobudur-schematic-plan.png',
  thumbnail: '/atlas/media/borobudur-schematic-plan-thumb.webp',
  width: 800,
  height: 800,
  printWidthMm: 105,
  alt: 'Modern coloured schematic with stepped concentric square forms, circular upper forms and stair-like projections on four sides; no north arrow or scale.',
  caption:
    'Indon’s 2007 own-work schematic helps distinguish square and circular forms and stair-like projections on four sides. It supplies no north arrow, scale, gallery labels or colour legend. No underlying measured archaeological survey was inspected; the colours do not establish ancient paint. Read the source-qualified relief convention in the dossier separately. The diagram does not prove a required ancient route, exact relief location or niche count.',
  printCaption:
    'Modern 2007 schematic, not a measured archaeological plan. Square/circular forms and stair-like projections are visible; no north arrow, scale or colour legend. No ancient itinerary or niche inventory is established.',
  notice: [
    'Find one square form and one circular form.',
    'Which orientation or movement claim would need evidence beyond this schematic?',
  ],
  rights:
    'Indon; CC BY-SA 3.0. This source diagram is not new Chronos CC BY 4.0 artwork.',
  licenseUrl: ccSa,
  credit:
    'Indon, 2007, Borobudur Ground Plan, via Wikimedia Commons, CC BY-SA 3.0. Source diagram retained without tracing or redrawing.',
  printCredit: 'Indon, 2007; CC BY-SA 3.0, via Wikimedia Commons. Modern schematic.',
  sourceImage:
    'https://upload.wikimedia.org/wikipedia/commons/3/37/Borobudur_Ground_Plan.png',
  depiction: 'explanatory diagram',
  relevance:
    'Provides a qualified source diagram for comparing built forms without inventing an original measured plan or forcing a ritual itinerary.',
  datingNote:
    'Modern creation year and represented historical construction are distinct. No measured survey, exact ancient phase or archaeological niche inventory is established.',
  additionalImages: [],
};

export function applyPlacesBorobudur(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'borobudur');
  const existingSource = c.sources.find((row) => row.id === 'borobudur');
  if (!s || !existingSource) {
    throw new Error('Borobudur expansion requires the existing case and UNESCO source');
  }
  const renewalMarker = 'Borobudur selected renewal, 2026-10-29:';
  if (!existingSource.scope.includes(renewalMarker)) {
    existingSource.scope = `Prior consultation, ${existingSource.accessed} (retained): ${existingSource.scope} ${renewalMarker} Selected current English Brief synthesis, integrity/authenticity and protection/management paragraphs reconsulted on 29 October 2026. Broad eighth–ninth-century construction, hill/form/reliefs, attributed cosmology and Syailendra setting, associated Mendut/Pawon monuments, uncertain tenth–fifteenth-century end-of-use wording, and two twentieth-century restorations including 1973–1983. Not exact part-by-part construction dates, a securely named individual founder, all visitor behavior or an ancient route. Management prose contains prospective 2012 wording and does not establish current 2026 legal implementation. UNESCO description CC BY-SA IGO 3.0 does not clear every linked image/map. Component coordinates are separately sourced; no linked 2012 map or nomination plan inspected.`;
  }
  existingSource.accessed = consulted;
  for (const source of borobudurSources) {
    const existing = c.sources.find((row) => row.id === source.id);
    if (existing) Object.assign(existing, source);
    else c.sources.push({ ...source });
  }
  const contextIndex = (c.contexts ?? []).findIndex(
    (row) => row.id === borobudurContext.id,
  );
  if (contextIndex < 0) c.contexts = [...(c.contexts ?? []), borobudurContext];
  else c.contexts![contextIndex] = borobudurContext;
  s.contextIds = [...new Set([...(s.contextIds ?? []), borobudurContext.id])];
  s.placeStudy = borobudurPlaceStudy;

  s.summary =
    'Borobudur joins a built hill, carved stories and spaces for movement. Builders and carvers organized stone surfaces while upkeep linked religious institutions to resources and people. Evidence for those relationships comes from the monument, modern studies, attributed inscription interpretation and later conservation; each answers a different question.';
  s.sections = [
    sec(
      'A building organized around a hill',
      'UNESCO describes five concentric square terraces below three circular platforms and a crowning stupa, built around a natural hill. Walls and balustrades carry reliefs; seventy-two openwork stupas surround the central upper stupa and change the surrounding forms. Stonework and carving therefore made both spaces to enter and surfaces to attend to. UNESCO relates the arrangement to Buddhist cosmology. A modern schematic helps distinguish its shapes, but supplies neither a measured survey nor a record of any visitor’s thoughts.',
      cite('borobudur', 'Brief synthesis: form and cosmological interpretation'),
      cite('borobudur-plan-image', 'Inspected source pixels and file record'),
    ),
    sec(
      'Stories included recognizable kinds of buildings',
      'Hari Setyawan’s study examines wooden-building roofs represented in the reliefs. It compares forms and story settings to interpret dwellings, storage buildings, halls and monastic spaces. Those settings make practical activities part of a religious narrative world: sheltering, gathering and storing matter alongside carved figures. The study locates Lalitavistara on the upper first-gallery wall and Gandavyuha on later gallery walls. Reading a sequence means attending to a scene’s position as well as its carved content. Comparing those locations makes the relationship between a story and an architectural surface inspectable. These are interpretations of depicted architecture, not recovered floor plans or a census of the households living beside the monument.',
      cite(
        'borobudur-roof-study-2022',
        'Printed pp. 140–143 and 161–162 / PDF 4–7 and 25–26',
      ),
    ),
    sec(
      'Moving water required continued work',
      'Rain falling on terraces had to leave the structure. The conservation encyclopedia describes earlier drainage through jaladwara, or water spouts, toward lower levels and the hill. It distinguishes this from pipes, infiltration wells and inspection basins introduced during the second restoration. Water disposal connects the monument’s form with recurrent inspection and repair. The 2008 photograph consequently shows a surviving conserved building; it cannot separate all early stones from twentieth-century interventions by appearance alone.',
      cite('borobudur-drainage-2018', 'Borobudur-specific drainage paragraphs'),
      cite('borobudur', 'Authenticity: twentieth-century restoration'),
      cite('borobudur-photo-image', 'Inspected 2008 source photograph'),
    ),
    sec(
      'Support reached beyond the carved stone',
      'Religious upkeep also needed resources. BorobudurPedia interprets the 842 Tri Tepusan inscription as land privileges supporting a religious foundation connected with Borobudur. That account offers a concrete way to ask how surrounding production could contribute to maintenance, without recovering every payment or naming a certain founder. In the present landscape, a December 2025 exhibition documented builders, carpenters, potters and other practitioners sharing local architectural knowledge. Their work gives neighboring communities a visible role today, without making their houses unchanged survivals from the construction centuries.',
      cite('borobudur-inscription-context-2018', 'Sīma and Tri Tepusan interpretation'),
      cite(
        'borobudur-community-architecture-2026',
        'Documentation initiative and December 2025 exhibition',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'A reading convention is evidence with a purpose',
      'Setyawan describes an east-start clockwise convention for reading and numbering reliefs, retaining an earlier sequence while adding quadrant codes. That convention helps locate passages for comparison; Table 1 associates galleries and walls or balustrades with narrative cycles. It does not turn the unlabelled schematic into a measured panel plan or show that every ancient visitor followed a single mandatory itinerary. A numbered research sequence and an individual’s religious experience are different questions.',
      cite(
        'borobudur-roof-study-2022',
        'Printed pp. 141–143 / PDF 5–7: method and Table 1',
      ),
    ),
    sec(
      'Patronage needs the right document and translation',
      'The 842 interpretation above comes from a modern institutional encyclopedia. The separately consulted Kayumwungan digital edition supplies English only for stanzas 12 and 14, not its complete Old Javanese grant section. It is also a different inscription. These limited translated stanzas cannot silently become a full Tri Tepusan translation or a secure Borobudur foundation biography. UNESCO’s broad Syailendra attribution remains distinct from identifying one patron, collecting actual revenues or recovering labor conditions.',
      cite('borobudur-inscription-context-2018', 'Tri Tepusan interpretation'),
      cite(
        'borobudur-kayumwungan-edition',
        'Edition metadata; Translation: stanzas 12 and 14',
      ),
      cite('borobudur', 'Brief synthesis: construction setting'),
    ),
    sec(
      'A living landscape includes disagreement',
      'The December 2024 monitoring mission heard vendor and resident concerns about access, relocation and benefits, and recommended further engagement. Those mediated accounts complicate any picture of a monument with one unanimous surrounding community. The later architecture exhibition documents another form of participation, not proof that every concern was resolved. Likewise, a modern Cultural Axis Path project linking the monuments cannot establish an ancient procession. Source date, purpose and the people represented remain part of the explanation.',
      cite('borobudur-monitoring-mission-2024', '§3.6 pp. 52–54; §3.3.2 pp. 36–41'),
      cite('borobudur-community-architecture-2026', 'Event and project chronology'),
    ),
  ];
  s.evidenceReading = {
    title: 'What can a plan, a story and an upkeep account establish?',
    introduction:
      'The following are editorial paraphrases of distinct modern sources. Source images, architectural interpretation and limited inscription consultation must not be merged into one eyewitness account.',
    items: [
      {
        label: 'A schematic organizes forms, not a visitor’s experience',
        text: 'Indon’s 2007 schematic shows square and circular forms and stair-like projections. It has no north arrow or scale. Setyawan separately records an east-start clockwise relief-reading convention.',
        interpretation:
          'The diagram supports visible form comparisons; the study supplies a documented research/reading convention. Neither recovers one required ancient itinerary, exact panel coordinates or every visitor’s thoughts. No inspected measured survey lies behind this adoption.',
        citations: [
          cite('borobudur-plan-image', 'Inspected source pixels and file metadata'),
          cite('borobudur-roof-study-2022', 'Printed pp. 141–143 / PDF 5–7'),
        ],
      },
      {
        label: 'Depicted roofs require comparison and interpretation',
        text: 'Setyawan compares roof forms and story settings to interpret several kinds of wooden buildings, including dwellings and storage or gathering places. The study explicitly limits what a partial depiction can recover.',
        interpretation:
          'Architectural distinctions make practical settings legible in narratives. A scene is not a measured household plan, a population count or direct proof of the homes beside Borobudur. The study’s inconsistent six/seven roof-type totals are not resolved by the reader or adopted as a count.',
        citations: [
          cite(
            'borobudur-roof-study-2022',
            'Printed pp. 140–143 and 161–162; abstract versus conclusion',
          ),
        ],
      },
      {
        label: 'An upkeep interpretation is not a complete foundation record',
        text: 'BorobudurPedia connects Tri Tepusan 842 and Sri Kahulunan with land privileges for religious upkeep. The different Kayumwungan edition has only two consulted English stanzas, outside a complete translated grant section.',
        interpretation:
          'The institutional interpretation supports a question about resources sustaining religion. It does not establish a certain founder, fulfilled payments or a complete local labor system. The partial English edition cannot fill those gaps by being treated as the same document.',
        citations: [
          cite('borobudur-inscription-context-2018', 'Tri Tepusan and sīma paragraphs'),
          cite(
            'borobudur-kayumwungan-edition',
            'English Translation: stanzas 12 and 14 only',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Forms, movement and evidence still needed',
    duration: '10–15 minutes',
    steps: [
      'Look at the supplied modern schematic. Find one square form and one circular form; describe how they differ without using a compass direction.',
      'Read the source capsule with an adult if useful. Make two cards: a visible form in the diagram, and the reading convention described by the study.',
      'Write a claim the diagram supports about the building’s shapes. Then write one thing it cannot establish about an ancient visitor’s route or thoughts.',
      'Compare the conserved-site photograph. Name one visible feature and one question about earlier construction or later repairs that would need another source.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: UNESCO describes square terraces below circular platforms. Setyawan’s relief study records an east-start clockwise reading/numbering convention. Indon’s 2007 schematic has no north arrow or scale and is not an inspected measured archaeological plan. Kartapranata’s 2008 photograph shows the conserved monument after major modern work. The diagram and photograph support form observations; they do not require an invented ancient visitor or prove one compulsory route.',
  };
  s.dimensions['place-work'] = {
    text: 'Carved galleries, water disposal and religious upkeep linked different kinds of work. Source-specific form, interpretation and conservation evidence explain a built religious landscape without reconstructing one labor system, secure founder or universal itinerary.',
    citations: [
      cite('borobudur', 'Brief synthesis; Authenticity'),
      cite('borobudur-drainage-2018', 'Borobudur-specific paragraphs'),
      cite('borobudur-inscription-context-2018', 'Religious upkeep interpretation'),
    ],
  };
  s.dimensionKeys = [
    ...new Set([...(s.dimensionKeys ?? Object.keys(s.dimensions)), 'place-work']),
  ];
  s.terms = [...new Set([...s.terms, 'archaeology', 'ritual', 'evidence'])];
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian approval',
    scope:
      'Layered account of built form, relief interpretation, drainage, attributed patronage evidence and neighboring communities. Three evidence readings, a supplied-source family activity, separate source-qualified context and three component reference points. Full existing case identity, 700–900 interval including note/precision, claims and earlier dimensions retained. The modern source photograph and schematic retain separate creation dates, rights and interpretive limits; no measured archaeological plan or required ancient itinerary is reconstructed.',
    limitations: [
      'UNESCO’s broad construction, Santiko’s study-specific cultural frame, attributed 842 interpretation, uncertain tenth–fifteenth-century end-of-use wording and modern restoration remain different dates. The 700–1000 reference does not extend the unchanged 700–900 case or assert one polity.',
      'Setyawan consultation covers selected web-PDF text, not all 28 pages or figure pixels. Roof-only/partial depictions do not recover household dimensions, a census, exact material structures or a full village. Inconsistent six/seven roof-type totals remain unresolved; no type count adopted.',
      'Only the Santiko abstract was read; underlying Buddhist texts and full article were not consulted. Its cultural frame is attributed rather than a new date for every relief or the complete building.',
      'Tri Tepusan patronage/upkeep is a modern institutional interpretation, not a complete freshly read primary translation. Kayumwungan is a different record with only stanzas 12/14 available in the consulted English translation. No secure individual founder, exact labor system, actual revenue or compliance inferred.',
      'Three UNESCO component coordinates are geographic references, not entrances, excavated points, a measured monument plan, household locations, ancient boundary or movement route. The modern Cultural Axis Path project cannot supply a guessed ancient itinerary.',
      'Indon’s 2007 diagram is a source schematic with no north/scale/legend; no underlying measured survey was inspected. Source geometry is not traced into an original guide. The separate 2009 diagram with a flagged niche-count error is rejected as a verified inventory. No close-up relief image or complete measured archaeological plan adopted.',
      'The two source images were actually inspected and hashed; source pixels are retained in research captures. Their CC BY-SA 3.0 photograph/diagram rights remain distinct from building public-domain status and any future original artwork. The 2008 photograph’s exact day and compass direction remain conflicting; no unsupported resolution supplied.',
      'The 2024 mission report was consulted only in selected web-PDF sections, not all 81 pages or image pixels. Community voices are mediated and incomplete; recommendations are not completed implementation. The 2025 exhibition and 2026 article do not establish unbroken ancient-household continuity.',
      'Source consultation and internal author checks do not establish independent historian/community approval, real family usability, human screen-reader or physical-device behavior, or physical print quality. Those acceptance tasks remain open; automated validation is recorded separately in the dated candidate receipt.',
    ],
  };
  // Shared workpack integration appends the licensed media. Preserve this case’s
  // complete interval, identity, claims, earlier dimensions and object order.
}
