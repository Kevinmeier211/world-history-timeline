import type { Corpus, Journey, Media } from '../../src/atlas/model';
import { cite, interval } from './content-helpers';
import { applyImagesWorkChavin, ChavinAnnotationDraft } from './images-work-chavin';
import { applyImagesWorkTeotihuacan } from './images-work-teotihuacan';
import { applyImagesWorkMoche } from './images-work-moche';
import { applyImagesWorkPlaces } from './images-work-places';

const ccBy = 'https://creativecommons.org/licenses/by/4.0/';
const guides: Media[] = [
  {
    id: 'teotihuacan-household-guide',
    subject: 'teotihuacan',
    title: 'Tlajinga: work and shared space',
    source: 'teot-patt-households',
    accession: 'Chronos original teaching guide, 29 October 2026',
    creator: 'Chronos / Codex; independently drawn teaching symbols',
    date: interval(
      2026,
      2026,
      'Teaching guide made 29 October 2026',
      'Modern creation date. The source describes excavated spaces from different phases; this guide is neither an ancient object nor a plan of one occupation.',
      'exact',
    ),
    representedDate:
      'Selected Teotihuacan residential and production evidence, mainly third–sixth centuries CE; no single architectural phase reconstructed',
    place:
      'Tlajinga, Teotihuacan; relationships described by the project, not measured locations',
    material: 'Original SVG teaching diagram',
    image: '/atlas/media/teotihuacan-household-guide.svg',
    thumbnail: '/atlas/media/teotihuacan-household-guide-thumb.webp',
    width: 600,
    height: 360,
    printWidthMm: 145,
    alt: 'Two modern panels connect blade making in rooms of Compound 17 with shared courtyards. A separate line notes drains connected to the street. No measured room arrangement is shown.',
    caption:
      'The Tlajinga project describes obsidian production in Compound 17 and shared courtyards and drains in the investigated compounds. This original guide connects activities and spaces without copying a source plan. The connecting line is a teaching relationship, not a street, an artifact route or a claim that every task occurred simultaneously.',
    printCaption:
      'Modern relationship guide: blade making, shared courtyards and drainage. No measured plan or single occupation reconstructed.',
    notice: [
      'Find one making task and one shared space.',
      'Which further evidence would show who maintained a drain?',
    ],
    rights: 'CC BY 4.0; original teaching artwork.',
    licenseUrl: ccBy,
    credit:
      'Chronos / Codex, 2026. Original guide; historical sources cited in the dossier.',
    printCredit: 'Chronos / Codex, 2026. Original guide.',
    sourceImage: '/atlas/media/teotihuacan-household-guide.svg',
    depiction: 'explanatory diagram',
    relevance:
      'Makes relationships between production, homes and shared facilities legible while distinguishing a conceptual guide from archaeological geometry.',
    additionalImages: [],
  },
  {
    id: 'moche-evidence-guide',
    subject: 'moche',
    title: 'Moche: compare two kinds of evidence',
    source: 'moche-production-2009',
    accession: 'Chronos original teaching guide, 29 October 2026',
    creator: 'Chronos / Codex; independently drawn teaching symbols',
    date: interval(
      2026,
      2026,
      'Teaching guide made 29 October 2026',
      'Modern creation date, separate from each museum vessel and each excavated production context.',
      'exact',
    ),
    representedDate:
      'Separate Moche object and excavated production histories within the first millennium CE; no universal sequence or common findspot supplied',
    place: 'Modern comparison guide; no ancient workshop or vessel route located',
    material: 'Original SVG teaching diagram',
    image: '/atlas/media/moche-evidence-guide.svg',
    thumbnail: '/atlas/media/moche-evidence-guide-thumb.webp',
    width: 600,
    height: 360,
    printWidthMm: 145,
    alt: 'Two modern panels contrast observing a vessel’s form and surface with excavated tools and production debris. A line invites comparison rather than implying that these museum vessels came from a known workshop.',
    caption:
      'A vessel permits close observation of form and surface. Excavated tools, debris and working spaces can support different claims about making. Bernier distinguishes a partly excavated fineware workshop from a utilitarian production area identified through surface evidence. These categories are not the known find context of either selected Met vessel; the drawing copies no source plan or ancient motif.',
    printCaption:
      'Modern evidence guide: compare a vessel’s appearance with separately excavated production traces; no common findspot implied.',
    notice: [
      'What can you observe on an object’s surface?',
      'What additional evidence could locate its production?',
    ],
    rights: 'CC BY 4.0; original teaching artwork.',
    licenseUrl: ccBy,
    credit:
      'Chronos / Codex, 2026. Original guide; historical sources cited in the dossier.',
    printCredit: 'Chronos / Codex, 2026. Original guide.',
    sourceImage: '/atlas/media/moche-evidence-guide.svg',
    depiction: 'explanatory diagram',
    relevance:
      'Separates image interpretation from archaeological evidence for production, without inventing a firing recipe, workshop plan or quota.',
    additionalImages: [],
  },
];
const sourceMap: Media = {
  id: 'teotihuacan-tlajinga-map',
  subject: 'teotihuacan',
  source: 'teot-tlajinga-2026',
  title: 'Teotihuacan and Tlajinga: a composite archaeological map',
  accession: 'Carballo and colleagues 2026, Figure 1; DOI 10.1017/laq.2026.10207',
  creator:
    'David M. Carballo and colleagues; mapping based on TMP (Millon, Drewitt and Cowgill 1973), PATT fieldwork and Widmer and Storey 1993',
  date: interval(
    null,
    null,
    'Modern composite map; published in 2026, drawing date unstated',
    'Publication dates the article, not every mapping observation or the drawing’s creation. The figure combines a 1973 mapping base with later fieldwork; no single occupation date follows.',
    'unknown',
  ),
  representedDate:
    'Teotihuacan archaeological city and Tlajinga district, combining multiple research and occupation phases',
  place: 'Teotihuacan and its southern Tlajinga district, central Mexico',
  material:
    'Published archaeological mapping figure; supplied PNG converted losslessly to WebP',
  image: '/atlas/media/teotihuacan-tlajinga-map.webp',
  thumbnail: '/atlas/media/teotihuacan-tlajinga-map-thumb.webp',
  width: 1650,
  height: 2345,
  printWidthMm: 85,
  alt: 'Two-panel composite archaeological map. The upper city map places Tlajinga south of the main monuments and shows a north arrow and 1 km scale. The district detail places Compounds 17 and 18 east of the Street of the Dead, with platform complexes and plazas west, San Lorenzo River to the north and a 200 m scale. No geographic coordinate grid is printed.',
  caption:
    'Figure 1 combines the Teotihuacan Mapping Project base with later PATT and Widmer/Storey fieldwork. Upper panel: city reference with north arrow and 1 km scale. Lower panel: southern Tlajinga, San Lorenzo River, Street of the Dead, Compounds 17, 18 and 33, and the platform group, with a 200 m scale. This is a composite locator map, not a single-phase household plan. Its small original labels need enlargement; the readable text here retains the key spatial relationships. No numerical compound coordinates or political boundary are inferred.',
  printCaption:
    'Composite city/district map, published 2026. Tlajinga lies south of the core; Compounds 17/18 lie east of its street, the platform group west. Source labels remain small; enlarge the original for detail.',
  notice: [
    'Find Tlajinga (7) in the upper city map, then Compounds 17 and 18 in the lower detail.',
    'Compare domestic compounds with the platform group without making all outlines one ancient phase.',
  ],
  rights:
    'CC BY-NC 4.0; non-commercial reuse only. © The Author(s), 2026. Commercial use requires permission from Cambridge University Press or the rights holder(s).',
  licenseUrl: 'https://creativecommons.org/licenses/by-nc/4.0/',
  credit:
    'David M. Carballo, Luis Barba Pingarrón, Agustin Ortiz, Jorge Blancas, A. Gabriel Vicencio, Daniela Hernández Sariñana and Jorge Nukyen Archer Velasco, 2026, Figure 1, DOI 10.1017/laq.2026.10207. Cambridge University Press for the Society for American Archaeology. Based on TMP 1973 with PATT and Widmer/Storey 1993 modifications. PNG converted losslessly to WebP, without cropping or enhancement.',
  printCredit:
    'Carballo and colleagues, 2026, Fig. 1, DOI 10.1017/laq.2026.10207; TMP/PATT/Widmer–Storey mapping. Lossless format conversion.',
  sourceImage:
    'https://static.cambridge.org/binary/version/id/urn%3Acambridge.org%3Aid%3Abinary%3A20260918030654389-0775%3AS1045663526102077%3AS1045663526102077_fig1.png?pub-status=live',
  depiction: 'later depiction',
  relevance:
    'Locates the studied neighborhood and the different architectural settings discussed in the household and production account. Mapping conventions, composite chronology and small labels remain explicit.',
  additionalImages: [],
};
const journey: Journey = {
  id: 'images-spaces-work',
  title: 'Images, spaces and work',
  question: 'How can objects and excavated spaces explain people’s work?',
  duration: '20–30 minutes',
  introduction:
    'Compare Chavín textile making, Teotihuacan household production and distinct Moche object and excavation histories. This inquiry crosses places and centuries; its thematic order does not establish contact, a route or a continuous political tradition.',
  stops: [
    {
      subject: 'chavin-textile',
      year: -300,
      object: 'met-315784',
      title: 'Observe a surface before extending its story',
      narrative:
        'Use the four modern numbered notes on the unchanged photograph. Separate crossing threads, painted forms and broken edges from the catalogue’s material identification and motif interpretation. The reported southern-coastal origin does not locate manufacture or prove a journey from the highland centre.',
    },
    {
      subject: 'teotihuacan',
      year: 400,
      object: 'teotihuacan-household-guide',
      title: 'Connect making with household and shared space',
      narrative:
        'At Tlajinga, cores and production debris support blade making; courtyards and drains show how homes connected to shared facilities. The guide explains relationships rather than measured architecture. Different buildings and samples retain their own dates; these remains do not supply a recovered city constitution.',
    },
    {
      subject: 'moche',
      year: 400,
      object: 'moche-evidence-guide',
      title: 'Compare an object with excavated production evidence',
      narrative:
        'Inspect the two vessels as well as the guide. Workshop and domestic evidence from named archaeological settings adds labor and exchange questions, while the museum objects retain their unknown precise findspots. Northern and southern interpretations do not become one uniform Moche kingdom.',
    },
  ],
  conclusion:
    'Useful explanations connect a specific activity with material evidence: making a fabric, producing cutting tools, preparing food or working clay. Context helps explain organization, while an object’s appearance, an excavated workshop and a regional model answer different questions. Keep those sources connected without giving one object the provenance or certainty of another.',
  evidence: {
    prompt:
      'What would most directly strengthen a claim that a particular vessel was made in a particular workshop?',
    options: [
      {
        text: 'A similar motif appears on a distant textile.',
        supported: false,
        feedback:
          'Shared imagery invites comparison, but does not locate this vessel’s manufacture.',
      },
      {
        text: 'The vessel and workshop share the same broad cultural label.',
        supported: false,
        feedback:
          'A regional label can span different places, phases and production arrangements.',
      },
      {
        text: 'A documented archaeological context and production analysis that match the particular vessel.',
        supported: true,
        feedback:
          'Object-specific contextual and production evidence could test that attribution. Neither selected Met vessel currently has that demonstrated workshop link in this inquiry.',
      },
      {
        text: 'A modern line joins the panels in our teaching guide.',
        supported: false,
        feedback:
          'The line organizes a comparison. It is not excavated evidence or a historical route.',
      },
    ],
    citations: [
      cite(
        'moche-production-2009',
        'Archaeological workshop evidence; Cerámica utilitaria; Cerámica fina o ritual',
      ),
      cite(
        'met-316721',
        'Artwork Details and Description: broad attribution, no excavated workshop',
      ),
    ],
  },
  returnPrompt:
    'Choose one activity, show the evidence that supports it, and name one additional source that could explain who organized or performed the work.',
  leadObject: 'met-315784',
  printSourcesPerPage: 2,
  familyEvidence: {
    title: 'What can you show in this photograph?',
    object: 'met-315784',
    text: 'The photograph shows a fragment of painted cloth. Crossing threads, red forms and incomplete edges are visible. The museum identifies cotton and painting, interprets related figures, and says the cloth is reported to come from Peru’s southern coast. The modern numbered notes point to surviving details; they leave missing cloth blank.',
    citations: [
      cite(
        'met-315784',
        'Description paragraphs 1–5; Artwork Details; existing photograph',
      ),
    ],
    notice: [
      'Find the pale fabric and a red painted form.',
      'Point to an incomplete edge; leave the missing part blank.',
    ],
    claimPrompt:
      'Name one thing you can show in the photograph and one thing you would need another source to establish.',
    returnPrompt:
      'Return with a new question about making, using or moving the cloth. Say which source might help.',
    feedback:
      'Visible threads, forms and edges support observations. A maker’s name, the original complete design, chemical ingredients and a travel route require additional evidence; the catalogue supplies qualified interpretations rather than those missing records.',
  },
};
export function applyImagesWork(c: Corpus): void {
  applyImagesWorkChavin(c);
  applyImagesWorkTeotihuacan(c);
  applyImagesWorkMoche(c);
  applyImagesWorkPlaces(c);
  const textile = c.media.find((m) => m.id === 'met-315784')!;
  textile.hasAnnotations = true;
  textile.licenseUrl = 'https://creativecommons.org/publicdomain/zero/1.0/';
  textile.annotations = {
    createdOn: '2026-10-29',
    credit: 'Chronos / Codex, 2026.',
    rights:
      'Modern annotations: CC BY 4.0. The underlying photograph has separate credit and rights.',
    licenseUrl: ccBy,
    items: ChavinAnnotationDraft,
  };
  textile.caption +=
    ' Four numbered modern annotations point to surviving details; the underlying photograph is unchanged and no missing design has been restored.';
  textile.printCaption =
    'Painted cotton fragment, fourth–third centuries BCE. Modern notes mark surviving details; reported origin supplies no route.';
  textile.printCredit =
    'The Met, 1987.394.704. Bequest of Jane Costello Goldberg, 1986.';
  c.subjects.find((s) => s.id === 'chavin-textile')!.dimensions['material-work'] = {
    text: 'Weaving supplied a surface and painting supplied imagery. Visible detail and attributed catalogue interpretation do not identify the makers, workshop or rules organizing their labor.',
    citations: [
      cite('met-315784', 'Medium; Description paragraphs 1–5'),
      cite('chavin-weaving-abstraction', 'Printed pp. 4 and 8–9'),
    ],
  };
  c.sources.push({
    id: 'images-work-guides',
    title: 'Household connections and production evidence: original teaching guides',
    institution: 'Chronos Atlas / Codex',
    author: 'Chronos / Codex',
    url: ccBy,
    type: 'scholarship',
    published: '2026-10-29',
    accessed: '2026-10-29',
    scope:
      'Two original modern diagrams, independently drawn for the Tlajinga household/shared-space relationships and the distinction between a museum object’s appearance and separate production evidence. Historical support: PATT Household Archaeology and Domestic Economy, Carballo and colleagues 2026 selected space-use discussion, Bernier 2009 workshop/consumption sections and Chapdelaine 2009 pp. 183–190. No source plan, figure, ancient motif, surveyed footprint, exact firing recipe, quota or artifact route copied or traced. Teaching connectors express relationships and comparison, not simultaneous architecture or historical transmission. Artwork CC BY 4.0; underlying source rights remain separate.',
  });
  for (const m of [...guides, sourceMap]) {
    c.media.push(m);
    const s = c.subjects.find((s) => s.id === m.subject)!;
    s.objectIds = [...s.objectIds, m.id];
  }
  const reportSource = c.sources.find((s) => s.id === 'teot-tlajinga-2026')!;
  reportSource.scope +=
    ' Figure 1 is reused locally with its article licence and complete attribution; supplied 1650 × 2345 PNG converted losslessly to WebP without cropping, enhancement or changed pixels. Its key relationships have an authored readable text equivalent; small original labels are not claimed to satisfy the typography standard for original teaching guides.';
  c.journeys.push(journey);
  c.glossary.push(
    {
      id: 'plain-weave',
      name: 'Plain weave',
      definition:
        'A way of making cloth. The crosswise thread (weft) passes over one lengthwise thread (warp) and under the next. On the return row, the pattern reverses. A diagram shows the method. Identifying the weave of a particular cloth requires examining its threads.',
    },
    {
      id: 'residential-compound',
      name: 'Residential compound',
      definition:
        'A connected group of rooms and open spaces used for living and other activities. An archaeological compound may include production, storage and gathering; its walls do not by themselves identify one nuclear family or its legal status.',
    },
  );
  for (const id of ['teotihuacan', 'moche']) {
    const s = c.subjects.find((s) => s.id === id)!;
    s.terms = [...new Set([...s.terms, 'residential-compound'])];
  }
  const chavin = c.subjects.find((s) => s.id === 'chavin-textile')!;
  chavin.terms = [...new Set([...chavin.terms, 'plain-weave'])];
  const p = c.packs.find((p) => p.id === 'C4')!;
  p.investigations = [
    ...(p.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['teotihuacan', 'moche'],
      start: -400,
      end: 850,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Separate the highland centre from the textile’s reported southern-coastal origin. Central Mexican urban evidence and distinct Peruvian valley contexts retain their own locations; no route connects them.',
      limits:
        'Two household/production accounts and a focused textile inquiry. Source frames do not replace case intervals; the Tlajinga map combines phases. Wider labor, gender, regional and political histories and human acceptance remain open.',
    },
  ];
  p.coverage.Americas.reason =
    'Teotihuacan and Moche now add selected household, workshop and regional evidence, with original teaching guides and distinct reference histories. The earlier Chavín textile provides a focused annotated comparison rather than a contemporary case or proof of contact. Wider American histories remain selective.';
}
