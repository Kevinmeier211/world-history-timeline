import type { HistoricalContext, Source, Subject } from '../../src/atlas/model';
import { cite, interval, sec } from './content-helpers';

const consulted = '2026-10-28';
const book = 'caral-project-2005';
const starch = 'caral-starch-2023';
const phasesLocator = 'PDF p. 15, printed p. 13: cultural-process scheme';
const shicrasLocator = 'PDF p. 21, printed p. 19: Fibras vegetales y shicras';
const renewalLocator = 'PDF p. 43, printed p. 41: room subdivision and renewal';
const foodLocator = 'PDF p. 16, printed p. 14: Organización económica';
const housesLocator = 'PDF pp. 38–39, printed pp. 36–37: Viviendas';

export const caralSources: Source[] = [
  {
    id: book,
    title: 'La civilización de Caral-Supe: 5000 años de Identidad Cultural en el Perú',
    institution:
      'Proyecto Especial Arqueológico Caral-Supe / Instituto Nacional de Cultura',
    author: 'Ruth Shady Solís',
    published: '2005',
    url: 'https://www.zonacaral.gob.pe/downloads/publicaciones/libro-caral-supe-5000-anos-identidad-cultural-2005-espanol.pdf',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Selected passages, not the whole 52-page booklet: actual PDF pp. 15, 16, 21, 38–39 and 43 visually inspected for the phase scheme, complementary economic work, shicras, residence variation, and subdivision/covering/renewal. Corresponding printed pages are 13, 14, 19, 36–37 and 41. Extracted text includes adjacent-page bleed and duplicated material; cited pagination was checked against actual pixels. Political titles, tribute, kinship, universal priority and exact state-formation claims are not treated as recovered contemporary records. No source plan, photograph or other figure reproduced. No earthquake-performance claim adopted.',
  },
  {
    id: starch,
    title:
      'Analysis of starch grains trapped in human dental calculus in Áspero, Peru during the Initial Formative Period (3000–1800 BCE)',
    institution: 'Scientific Reports 13, 14143',
    author:
      'Marco Yseki, Luis Pezo-Lanfranco, Marco Machacuay, Pedro Novoa and Ruth Shady',
    published: '29 August 2023',
    url: 'https://www.nature.com/articles/s41598-023-41015-6',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Accessible publisher HTML: selected Introduction, Results, Discussion, Conclusions and Material and methods, including Study area, Burial contexts and sample extraction. Twenty teeth from nine Áspero individuals and one Caral individual; only three burial contexts directly AMS-dated, with contextual chronology for the others. CAR 391 is separately dated 2398–2038 cal BCE. Study area uses a narrower Caral orientation, 2860–1970 cal BCE; it does not replace the preserved UNESCO case range or government alternative. Sample ubiquity and starch counts are not dietary percentages for Caral; the study does not establish maize-beer fermentation. Linked tables, supplementary material and figure pixels were not independently inspected in full. Article CC BY 4.0 subject to individual credit exclusions; no article image, map or micrograph reproduced.',
  },
];

export const caralContext: HistoricalContext = {
  id: 'caral-community-context',
  title: 'Caral-Supe: settlement, food and renewed buildings',
  region: 'Americas',
  interval: interval(
    -3000,
    -1800,
    'c. 3000–1800 BCE: selected settlement and building sequence',
    'Broad orientation follows UNESCO. The phase labels adapt the 2005 project scheme; anchors are not exact construction dates for every building or universal political transitions. The case retains its complete original interval and alternative 1900 BCE endpoint.',
  ),
  summary:
    'A settlement landscape changed through construction, enlargement and renewal. The 2005 project scheme offers one phased account, rather than a recovered timetable for every household.',
  subjectIds: ['caral'],
  citations: [
    cite('caral', 'Integrity and Authenticity: development range'),
    cite(book, phasesLocator),
  ],
  phases: [
    {
      year: -3000,
      label: 'About 3000–2600 BCE: 2005 project scheme',
      title: 'Settlements and public spaces grow',
      text: 'The project groups settlement growth and substantial public building within this broad early phase. The anchor is not one founding year.',
      citations: [cite(book, phasesLocator)],
    },
    {
      year: -2600,
      label: 'About 2600–2300 BCE: 2005 project scheme',
      title: 'Buildings and their relationships are redesigned',
      text: 'The scheme describes remodeling and the addition of circular plazas. Its political interpretation is not an independently established date of state formation.',
      citations: [cite(book, phasesLocator)],
    },
    {
      year: -2300,
      label: 'About 2300–2100 BCE: two grouped project subdivisions',
      title: 'Enlargement and further remodeling',
      text: 'This editorial phase groups the project’s 2300–2200 and 2200–2100 subdivisions; it does not erase their separate labels in the source.',
      citations: [cite(book, phasesLocator)],
    },
    {
      year: -2100,
      label: 'About 2100–1800 BCE: 2005 project scheme',
      title: 'Later renewal, covering and ending',
      text: 'The project places renewed construction, the covering of some components and abandonment within its final broad phase. No single terminal event is asserted.',
      citations: [cite(book, phasesLocator)],
    },
    {
      year: -1800,
      label: 'End of this selected UNESCO orientation',
      title: 'A teaching window ends',
      text: 'UNESCO’s development range ends here; the existing case also records the Peruvian orientation’s different 1900 BCE endpoint. Neither is a precise date for every last activity.',
      citations: [
        cite('caral', 'Integrity and Authenticity'),
        cite('caral-peru', 'Opening orientation, previously consulted'),
      ],
    },
  ],
};

export function applyCaral(s: Subject) {
  if (s.id !== 'caral') return;
  s.contextIds = [...new Set([...(s.contextIds ?? []), caralContext.id])];
  s.objectIds = [...new Set([...s.objectIds, 'caral-renewal-diagram'])];
  s.summary =
    'Caral’s platforms and circular courts depended on work beyond the finished monument. Food had to reach people, materials had to be prepared, and buildings were repeatedly changed. A project account of construction fill and a modern food study let us investigate those tasks at different scales, without turning one building or sampled individual into a complete picture of society.';
  s.sections = [
    sec(
      'A built place within a valley',
      'Caral occupies a dry terrace above the Supe Valley in coastal Peru. Platform buildings and sunken circular courts sit within a wider settlement landscape. People constructed and altered these places over centuries. UNESCO’s approximate 3000–1800 BCE development range describes a sequence, rather than one founding date or a date for every wall. Built gathering places help us ask how people assembled and organized work; their scale alone does not identify the person directing each task.',
      cite('caral', 'Description; Brief synthesis; Integrity and Authenticity'),
    ),
    sec(
      'Food and equipment linked valley and coast',
      'The project account connects valley cotton and gourds with fishing equipment, containers and floats, while marine foods reached inland Caral. Growing materials, making equipment and moving food linked different kinds of work. The account reports hooks and nets at coastal Áspero and Bandurria, rather than fishing tools at Caral. That distinction helps investigate exchange without assigning every task to the inland settlement.',
      cite(book, foodLocator),
    ),
    sec(
      'Covering an old room made new construction possible',
      'A shicra is a woven plant-fiber bag. Stone-filled examples formed part of construction fill. The project also describes rooms being subdivided, covered and renewed. An earlier space could remain beneath later construction, becoming part of a building’s material history. Making bags, handling stone and arranging fill were different practical tasks. The modern guide separates stages to explain this relationship; it is not a surveyed plan, a measured cross-section or a drawing of one identified room.',
      cite(book, shicrasLocator),
      cite(book, renewalLocator),
    ),
    sec(
      'Household spaces combined several activities',
      'The project describes residential compounds combining domestic, manufacturing, social and ritual activities. Peripheral rooms formed clusters, while residences near public buildings differed in scale, layout and finishes. Platforms, benches and hearths help investigate how space supported different tasks. The identification of some occupants as higher-status officials is a project interpretation from those differences, rather than an excavated list of names and offices.',
      cite(book, housesLocator),
    ),
    sec(
      'Organization needs more than a political label',
      'The project scheme describes building changes across broad phases. UNESCO interprets the monumental layout through political and ceremonial organization. Compare those interpretations with particular remains: a covered room supports rebuilding, while a food trace supports a different inquiry. Together they bring maintenance and provision into an account of large-scale construction, without recovering every household’s obligations or whether particular workers could refuse a task.',
      cite(book, phasesLocator),
      cite('caral', 'Brief synthesis and architectural criteria'),
      cite(starch, 'Discussion: limits of dietary inference'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Keep the sampled people and places visible',
      'The food study analyzed twenty teeth from nine Áspero individuals and one Caral individual. Three burial contexts had direct AMS dates; the others used contextual chronology. This distinction matters when an argument connects a food trace to a particular period. The Caral individual, CAR 391, is discussed separately at 2398–2038 cal BCE. A regional title or a broad period label cannot turn this selected group into a sample of every Caral household or assign every result to the inland site.',
      cite(
        starch,
        'Material and methods: Burial contexts and extraction; Discussion: CAR 391',
      ),
    ),
    sec(
      'A recovered starch is not a measured portion',
      'Different plants and preparation methods do not leave identical microscopic records. Starch presence, the number of recovered grains and occurrence across sampled individuals therefore answer different questions. The authors explain why these measures cannot simply become dietary percentages. They also distinguish possible damage from a confirmed preparation method: one altered grain does not establish maize-beer production. Reading the method alongside the result makes the evidence more useful, because it shows what another analysis would need to test.',
      cite(starch, 'Discussion: methodological limits and fermentation; Conclusions'),
    ),
    sec(
      'Read a project interpretation alongside its observations',
      'The project booklet connects buildings and renewal with a wider account of social organization. Its phased scheme is an archaeological interpretation, rather than an ancient official’s surviving schedule. Ask which observations support a proposed relationship and which additional record would test it. Differences between a public layout, a buried space and a food sample need not be resolved into one uniform institution. They can instead guide a more specific inquiry into how resources, maintenance and people’s work sustained a changing settlement.',
      cite(book, phasesLocator),
      cite(book, renewalLocator),
      cite('caral', 'Brief synthesis'),
    ),
  ];
  s.evidenceReading = {
    title: 'Match the scale of a claim to its record',
    introduction:
      'An archaeological project account, a modern teaching guide and a selected laboratory sample do different work.',
    items: [
      {
        label: 'A reported construction sequence',
        text: 'The project describes room subdivision, covering and renewal.',
        interpretation:
          'This supports a changing building history, without identifying every builder or a complete system of labor recruitment.',
        citations: [cite(book, renewalLocator)],
      },
      {
        label: 'A modern functional guide',
        text: 'The guide separates an earlier space, construction fill and later building.',
        interpretation:
          'It explains a relationship from the account. Its shapes and spacing do not reproduce a surveyed ancient room or a source figure.',
        citations: [cite(book, shicrasLocator), cite(book, renewalLocator)],
      },
      {
        label: 'A selected sample from two sites',
        text: 'The dental-calculus study analyzed twenty teeth from nine Áspero individuals and one Caral individual.',
        interpretation:
          'Keep site, date and sample size visible. Starch counts supply neither percentages of all Caral meals nor proof of maize-beer fermentation.',
        citations: [
          cite(starch, 'Material and methods: Burial contexts and extraction'),
          cite(starch, 'Discussion and Conclusions'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Find the earlier space beneath a later building',
    duration: 'About 5 minutes with the modern guide',
    steps: [
      'Find the earlier space, the construction fill and the later building in the supplied guide.',
      'Explain which work must happen before building above the filled space. Name two different tasks.',
      'Describe one excavation observation that could test this sequence, while keeping the guide separate from an actual measured plan.',
    ],
    explanation:
      'Covering and rebuilding connect different stages. The modern guide helps explain that relationship; it does not identify the people doing the work or reconstruct one named room.',
  };
  s.dimensions.maintenance = {
    text: 'Subdividing, filling and renewing space required repeated work; stone-filled fiber bags formed part of construction fill. The account does not identify every builder or obligation.',
    citations: [cite(book, shicrasLocator), cite(book, renewalLocator)],
  };
  s.dimensionKeys = Object.keys(s.dimensions);
  s.returnPrompt =
    'Choose a construction record or food sample. Explain the work it helps investigate and the scale of claim it can support.';
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex source consultation and self-review; not independent historian approval',
    scope:
      'Bounded main/deeper/evidence reading, family inquiry and phased reference context. Selected project pages and article passages; original modern construction guide supplied separately.',
    limitations: [
      'The entire original case interval, disputed endpoint note and 1900 BCE alternative are preserved. The 2005 project phases are broad interpretive groupings, not exact universal political transitions.',
      'Only selected booklet pages underpin this expansion. Adjacent-page bleed in extracted text required actual-page checks. Residential variation is descriptive; the identification of occupants’ rank or office remains an attributed interpretation.',
      'The dental-calculus sample comprises nine Áspero individuals and one Caral individual, twenty teeth. No dietary percentages for all Caral households or confirmed maize-beer production inferred.',
      'No complete voluntary/coerced labor system, named political titles, tribute regime, recruitment record or earthquake-performance claim established.',
      'No source figure copied. The separately supplied guide is modern and functional, not an inspected measured site plan. Geographic work, wider household histories and source interpretations still require review.',
      'No independent historian, real adult/family, screen-reader, physical-device or physical-print acceptance established.',
    ],
  };
}
