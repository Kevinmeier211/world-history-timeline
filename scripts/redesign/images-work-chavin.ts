import type {
  Citation,
  Corpus,
  HistoricalContext,
  Source,
} from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const sources: Source[] = [
  {
    id: 'chavin-weaving-abstraction',
    title: 'Weaving Abstraction in Ancient and Modern Art',
    institution: 'The Metropolitan Museum of Art',
    author: 'Iria Candela and Joanne Pillsbury',
    url: 'https://www.metmuseum.org/met-publications/weaving-abstraction',
    type: 'scholarship',
    published: '2023',
    accessed: '2026-10-29',
    scope:
      'Selected text in Met Bulletin 81(2), Fall 2023: Embracing the Grid by Iria Candela and Joanne Pillsbury, printed p. 4 grid/warp/weft paragraph; Infinite Pattern: Weaving in the Ancient Andes by Joanne Pillsbury, printed pp. 8–9, Fig. 3 caption and adjacent paragraphs. Fig. 3 explicitly identifies 1987.394.704. Not the full Bulletin. PDF text only: screenshot calls did not return inspectable pixels; no PDF figure visual consultation claimed. General early plain-weave/backstrap discussion is not a measured weave or identified loom for this specimen. Preserve the current catalogue’s qualified southern-coastal provenance over the Bulletin’s stronger Ica/findspot wording. No specimen-matched radiocarbon table or Burger et al. 2023 study consulted. Publication rights reserved; no figure/layout copied. Separate collection-image CC0 rights support a modern annotation of the unchanged existing photograph. Publication year does not date photography.',
  },
  {
    id: 'chavin-center-met-chronology',
    title: 'Central and Southern Andes, 1000 B.C.–1 A.D.',
    institution: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/toah/ht/04/sac.html',
    type: 'scholarship',
    published: '2004-10',
    accessed: '2026-10-29',
    scope:
      'Selected Timeline/Overview and Key Events c.950, c.850 and c.500 BCE, plus c.400 BCE wording to distinguish a regional Karwa interpretation from this textile’s unproved findspot. Older museum synthesis, not renewed excavation chronology or primary laboratory data. Approximate dates remain attributed reference points; no two-building sequence, universal abandonment or textile itinerary adopted. Its 1000–500 BCE highland Chavín convention differs from UNESCO’s own two summary frames. No map, image or publication figure copied.',
  },
  {
    id: 'chavin-center-unesco',
    title: 'Chavin (Archaeological Site)',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/330/',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      'Selected English Description and Outstanding Universal Value: Brief Synthesis, plus displayed location metadata below Dossier330/Ancash Department, Huari Province, Chavin District: S9 35 33.981 W77 10 42.433. This is a UNESCO site-reference point, not a textile findspot, manufacture location or recovered route. Description gives 1500–300 BCE; Brief Synthesis instead gives 15th–5th centuries BCE. These conventions are retained separately, not harmonized. Stone buildings, plazas, galleries and carved imagery orient a ceremonial centre. No nomination dossier, measured plan or source image consulted/copied. Description displays CC-BY-SA IGO 3.0; this record paraphrases selected text and does not assume a blanket image licence.',
  },
  {
    id: 'met-open-access',
    title: 'Open Access at The Met',
    institution: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/hubs/open-access',
    type: 'archive',
    accessed: '2026-10-29',
    scope:
      'Selected opening paragraphs and Get Started/API description: public-domain collection images and basic data may be downloaded, shared and remixed under CC0. Checked alongside the selected object’s Public Domain statement. Does not make publication prose, third-party figures or every museum image CC0. Existing image bytes were inspected and retained; no current remote-image download or byte comparison performed.',
  },
];

const context: HistoricalContext = {
  id: 'chavin-images-context',
  title: 'Chavín: a highland centre and portable images',
  region: 'Americas',
  interval: {
    start: -1500,
    end: -200,
    label: 'Selected source frames, c.1500–200 BCE',
    precision: 'approximate',
    note: 'An orientation spanning differing centre/tradition conventions and the selected later textile, not one state’s lifespan. UNESCO’s Description gives 1500–300 BCE, its Brief Synthesis 15th–5th centuries BCE; the older Met chronology labels highland Chavín 1000–500 BCE. Neither replaces the complete unchanged 400–200 BCE object case. Phase dates below are attributed approximate points, not a newly modeled building sequence.',
  },
  summary:
    'Stone buildings, galleries and carved images made Chavín de Huántar a highland ceremonial centre. Portable objects support comparisons across media and places, while each object keeps its own date and provenance.',
  subjectIds: ['chavin-textile'],
  citations: [
    cite('chavin-center-unesco', 'English Description; Brief Synthesis'),
    cite('chavin-center-met-chronology', 'Timeline; Overview'),
  ],
  phases: [
    {
      year: -950,
      label: 'Around 950 BCE in the Met’s 2004 chronology',
      title: 'A carved image within the centre',
      text: 'The museum places the Lanzón’s erection within the temple around this time. This is its approximate reference date, not a date for the textile.',
      citations: [cite('chavin-center-met-chronology', 'Key Events: c.950 BCE')],
    },
    {
      year: -850,
      label: 'Around 850 BCE in the Met’s 2004 chronology',
      title: 'Pilgrimage and specialist making',
      text: 'Its account describes pilgrims and resident artisans producing several media. It does not identify the makers of this surviving fragment.',
      citations: [cite('chavin-center-met-chronology', 'Key Events: c.850 BCE')],
    },
    {
      year: -500,
      label: 'Around 500 BCE in the Met’s 2004 chronology',
      title: 'A changing monumental setting',
      text: 'The museum describes declining Chavín power and changes at northern centres. Its convention is not proof that all related images or communities ended together.',
      citations: [cite('chavin-center-met-chronology', 'Key Events: c.500 BCE')],
    },
    {
      year: -400,
      label: 'Fourth–third centuries BCE: the selected catalogue range',
      title: 'This fragment has its own date',
      text: 'The current catalogue assigns this cloth a later range. It does not locate its production at the highland centre or document a journey from there.',
      citations: [cite('met-315784', 'Date; Description paragraphs2–4')],
    },
  ],
};

/** Targets refer to the unchanged 1600×832 photograph, not a restored design. */
export const ChavinAnnotationDraft: {
  id: string;
  label: string;
  x: number;
  y: number;
  text: string;
  citations: Citation[];
}[] = [
  {
    id: 'crossing-threads',
    label: 'Crossing threads',
    x: 0.55,
    y: 0.42,
    text: 'Crossed threads are visible in this pale area. This photograph does not establish thread counts or which direction was the warp.',
    citations: [
      cite(
        'met-315784',
        'Artwork Details: Textiles-Woven; existing photograph, pale area beside the central figure',
      ),
      cite(
        'chavin-weaving-abstraction',
        'Printed p. 4: grid/warp/weft paragraph; p. 8, Fig. 3',
      ),
    ],
  },
  {
    id: 'painted-form',
    label: 'Painted form',
    x: 0.65,
    y: 0.545,
    text: 'A broad red form lies across the fabric. The catalogue identifies painting; visible colour alone does not identify its chemical ingredients.',
    citations: [
      cite(
        'met-315784',
        'Description paragraphs2–4; existing photograph, red angular form at right',
      ),
    ],
  },
  {
    id: 'turning-boundary',
    label: 'A turning boundary',
    x: 0.31,
    y: 0.433,
    text: 'Follow the edge where red meets pale fabric. Its curve belongs to the visible image; identifying a supernatural face is a further interpretation.',
    citations: [
      cite(
        'met-315784',
        'Description paragraph4; existing photograph, curved red boundary near centre-left',
      ),
    ],
  },
  {
    id: 'fragmentary-edge',
    label: 'Fragmentary edge',
    x: 0.86,
    y: 0.62,
    text: 'Loose threads and an incomplete edge remain visible here. Keep missing parts blank: a proposed repeating composition is not a recovered complete cloth.',
    citations: [
      cite(
        'met-315784',
        'Existing photograph, right edge; Description paragraph5: proposed repetition',
      ),
      cite(
        'chavin-weaving-abstraction',
        'Printed pp. 8–9, Fig. 3 and adjacent pattern discussion',
      ),
    ],
  },
];

/** Keep a small object inquiry; add explanation without changing its identity. */
export function applyImagesWorkChavin(c: Corpus): void {
  const s = c.subjects.find((subject) => subject.id === 'chavin-textile');
  if (!s) throw new Error('Chavín inquiry requires the existing chavin-textile case');
  const catalogue = c.sources.find((source) => source.id === 'met-315784');
  if (!catalogue)
    throw new Error('Chavín inquiry requires the existing Met 315784 record');
  catalogue.accessed = '2026-10-29';
  catalogue.scope =
    'Renewed selected consultation 29 October 2026: visible Description paragraphs 1–5, References and Further Reading, Artwork Details and Public Domain statement for accession 1987.394.704. Provenance-tab heading visible, but complete custody-chain tab text was not supplied; no renewed full provenance-tab consultation claimed. Current southern-coastal origin remains said/reported; no precise excavated findspot, maker, workshop, original function or itinerary established. Burger et al. 2023 remains an unresolved abbreviated reference: no technical paper, specimen row, lab number or calibration consulted, and no independent redating claimed. Existing full 1600×832 photograph actually inspected; original image and thumbnail bytes retained without enhancement or remote-image byte comparison. Met CC0 policy checked separately. No source artwork restored or missing motif reconstructed.';
  for (const source of sources) {
    const existing = c.sources.find((row) => row.id === source.id);
    if (existing) Object.assign(existing, source);
    else c.sources.push({ ...source });
  }
  const contextIndex = (c.contexts ?? []).findIndex((row) => row.id === context.id);
  if (contextIndex < 0) c.contexts = [...(c.contexts ?? []), context];
  else c.contexts![contextIndex] = context;
  s.contextIds = [...new Set([...(s.contextIds ?? []), context.id])];
  s.summary =
    'Making this cloth joined two kinds of work: constructing a woven surface and painting an image upon it. Pale crossing threads and red forms remain visible together. The fragment lets us study those choices while keeping its incomplete edges and reported origin in view.';
  s.sections = [
    sec(
      'A surface was made before an image was painted',
      'The catalogue identifies cotton with refined iron-earth pigments. Look first at an unpainted patch: crossing threads make a fabric that could receive an image. Red forms pass over that surface. Weaving and painting offered different ways to shape what a viewer saw. The surviving cloth does not name the people who performed those tasks or show whether one person did both.',
      cite('met-315784', 'Medium; Description paragraphs 1–2; existing photograph'),
      cite('chavin-weaving-abstraction', 'Printed p. 8, Fig. 3 and adjacent paragraph'),
    ),
    sec(
      'A fragment can hold several ways of seeing',
      'Follow the red boundaries and compare curving forms with angular ones. The museum reads claws, serpents and paired profile heads, including an inverted head that contributes to a larger fanged image. Changing direction can change what the viewer notices. Its proposed repeating composition extends an interpretation beyond the surviving edges; the missing cloth should remain blank in an annotation.',
      cite('met-315784', 'Description paragraphs3–5'),
      cite(
        'chavin-weaving-abstraction',
        'Printed pp. 8–9, Fig. 3 and adjacent pattern discussion',
      ),
    ),
    sec(
      'Portable images invite a comparison across places',
      'The catalogue relates the imagery to stone carvings at Chavín de Huántar in the northern highlands. Cloth could carry an image in a different way from a fixed carving. This object is said to come from the southern coast, however, so its own itinerary remains unrecorded. Compare materials and motifs before proposing who moved it or who controlled its makers.',
      cite(
        'met-315784',
        'Description paragraphs 2–3: reported origin and motif parallels',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'Dating the cloth and the ceremonial centre',
      'The Met dates this fragment to the fourth or third century BCE. Archaeologists also date the buildings at Chavín de Huántar, where similar images appear on stone. That chronology helps place the carvings in history, but a shared image cannot tell us when this piece of cotton was woven. The catalogue mentions Burger and colleagues (2023) without a full citation. To check a laboratory date for this particular fragment, we would need a published measurement linked to its museum number, 1987.394.704.',
      cite(
        'met-315784',
        'Artwork Details, date and object number. Description paragraph 4 and visible reference list.',
      ),
      cite('chavin-center-met-chronology', 'Timeline; Key Events'),
    ),
    sec(
      'A weaving guide explains a principle',
      'A simple grid can show two sets of threads crossing and distinguish the fabric from a painted mark. Such a modern guide explains a general principle; it cannot supply this fragment’s missing thread counts, loom or original size. Likewise, identifying a repeated image does not identify every wearer, viewer or meaning. A useful annotation directs attention to surviving evidence while leaving those further questions open.',
      cite(
        'chavin-weaving-abstraction',
        'Printed p. 4: grid/warp/weft paragraph; p. 8, Fig. 3',
      ),
      cite('met-315784', 'Description paragraphs 1–2; existing photograph'),
    ),
  ];
  s.evidenceReading = {
    title: 'Observe a feature; identify the source of its explanation',
    introduction:
      'The photograph, catalogue and reference chronology support different statements. Keep visible features separate from material identification and historical interpretation.',
    items: [
      {
        label: 'Threads and red forms',
        text: 'The existing photograph shows crossing threads, red forms and incomplete edges. The catalogue identifies material and painting.',
        interpretation:
          'A visible colour supports description. Pigment chemistry, fibre identification and a production date need other evidence; no new analysis has been performed.',
        citations: [
          cite('met-315784', 'Existing photograph; Medium; Description paragraph2'),
        ],
      },
      {
        label: 'An image read at more than one scale',
        text: 'The museum identifies inverted profile forms contributing to a larger fanged figure and proposes repetition beyond the fragment.',
        interpretation:
          'These are attributed readings of surviving imagery. They do not authorize drawing a complete original cloth or assigning one certain use.',
        citations: [
          cite(
            'chavin-weaving-abstraction',
            'Printed pp. 8–9, Fig. 3 and adjacent pattern discussion',
          ),
        ],
      },
      {
        label: 'A comparison is not a route',
        text: 'Catalogue motif parallels link the inquiry to Chavín de Huántar; the southern-coastal origin is reported.',
        interpretation:
          'A portable material and related imagery make movement a useful question. They do not establish this object’s journey or a state controlling every place where similar images occur.',
        citations: [cite('met-315784', 'Description paragraphs2–3')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Find a thread; follow a form',
    duration: '10 minutes',
    steps: [
      'Look at the supplied photograph. Point to an unpainted patch where threads cross. Describe it without guessing a thread count.',
      'Find two red forms you think repeat. Follow one boundary with your finger above the screen or print; leave missing areas blank.',
      'An adult can read the caption. Name one observation you can show in the photograph and one explanation supplied by the museum. What remains unknown about where this cloth traveled?',
    ],
    explanation:
      'Crossed threads, visible forms and fragmentary edges are supplied evidence. Material identification, motif interpretation and reported provenance come from the catalogue; the photograph alone supplies no itinerary.',
  };
  s.review = {
    consultedOn: '2026-10-29',
    reviewer:
      'Codex source consultation and internal author review; not independent historian approval',
    scope:
      'Keep-sized object inquiry with selected institutional reference dates, close observation, a concrete family task and proposed non-destructive photograph callouts. Existing identity, complete case interval, claims, dimensions, object IDs and photograph bytes are preserved.',
    limitations: [
      'Burger et al. 2023 remains unidentified as a consulted technical study. No specimen-matched laboratory number, calibrated date, fibre/pigment result, thread count or loom is introduced. Existing catalogue date wording is retained without claiming an independently verified redating.',
      'Current catalogue says southern-coastal origin is reported. Stronger Ica/findspot wording in the selected Bulletin is not adopted. Complete provenance-tab text, excavation context, original function, individual makers and route remain unavailable or unknown.',
      'The 2004 Met chronology and UNESCO Description/Brief Synthesis use different conventions. Approximate dated reference points do not establish one state, a universal ending or a new architectural sequence. No full excavation report, nomination dossier or source plan consulted.',
      'Only selected Bulletin text was read; PDF-page pixels were not inspectable through the screenshot response. Existing local photograph pixels were inspected. New callouts must retain the original image bytes and distinguish the modern editorial overlay from the ancient object and unknown photography date; missing imagery remains blank.',
      'Independent historian/conservator/community review, family use, screen-reader behavior, physical devices and physical print remain open.',
    ],
  };
}
