import type { Corpus, Journey } from '../../src/atlas/model';
import { cite } from './content-helpers';
import { applyPlacesByzantium, byzantiumAnnotationDraft } from './c5-byzantium';
import { applyPlacesBorobudur, borobudurPhoto, borobudurPlan } from './c5-borobudur';
import { applyPlacesMaya, mayaAnnotationDraft, mayaPlaceStudy } from './c5-maya';

const journey: Journey = {
  id: 'places-patrons-work',
  title: 'Places, patrons and work',
  question: 'What links making and upkeep to people and institutions?',
  duration: '20–30 minutes',
  introduction:
    'Compare a Maya cup, Borobudur and selected work in Constantinople. Ownership, support and practical tasks need different evidence. These stops organize a comparison across regions; they do not establish contact, a travel route or one shared institution.',
  stops: [
    {
      subject: 'maya-vessel',
      object: 'met-316711',
      year: 750,
      title: 'An owner’s name does not identify every maker',
      narrative:
        'Find the inscribed forms, figure and rim using the modern observation notes. The catalogue’s uncertain name reading and possible geographic comparisons remain qualified. Courtly cups and the separate Cerén household account reveal different kinds of making, food and exchange; neither supplies this cup’s excavated findspot.',
    },
    {
      subject: 'borobudur',
      object: 'borobudur-schematic-plan',
      year: 800,
      title: 'Connect built forms with support and maintenance',
      narrative:
        'Compare square and circular forms in the modern schematic with the conserved monument photograph. Relief studies, an attributed land-and-upkeep interpretation and drainage research add work and institutions. The diagram has no north arrow or scale, and does not recover an ancient visitor’s itinerary.',
    },
    {
      subject: 'byzantium',
      object: 'met-464428',
      year: 950,
      title: 'Keep a portable image separate from a working harbour',
      narrative:
        'Observe the ivory’s frame, raised body and lower letters. Probable private devotion and alternative figure interpretations remain attributed scholarship. Separately excavated ship planks, caulking and repairs explain practical urban work, while timber and pottery-layer dates remain distinct. No ship is said to have carried this ivory.',
    },
  ],
  conclusion:
    'People shaped materials, maintained places and supplied resources through different relationships. A named owner is not necessarily a maker; an image is not a complete household history; a schematic is not a measured plan. Test an explanation by identifying the particular work, people and source association it requires.',
  evidence: {
    prompt: 'Which explanation best fits the supplied Borobudur schematic?',
    options: [
      {
        text: 'It helps locate square and circular forms; a required ancient walking route needs further dated evidence.',
        supported: true,
        feedback:
          'Visible relationships support observation. A modern diagram without north or scale cannot by itself establish what every ancient visitor did.',
      },
      {
        text: 'Its colours show the monument’s original paint scheme.',
        supported: false,
        feedback:
          'The creator’s modern colours have no supplied ancient-paint legend or analysis.',
      },
      {
        text: 'A similar image elsewhere proves that the same patron organized both places.',
        supported: false,
        feedback:
          'Resemblance invites comparison; a particular patron or institutional connection needs its own evidence.',
      },
    ],
    citations: [
      cite('borobudur-plan-image', 'Source diagram and file record'),
      cite('borobudur', 'Brief synthesis: built form and interpretation'),
    ],
  },
  returnPrompt:
    'Name one kind of work, identify its supporting evidence, and ask which person or institution remains to be explained.',
  leadObject: 'borobudur-schematic-plan',
  printSourcesPerPage: 2,
  familyEvidence: {
    title: 'Shapes we can see; routes we need to test',
    object: 'borobudur-schematic-plan',
    text: 'This modern schematic shows stepped square forms, circular upper forms and stair-like projections on four sides. It has no north arrow, scale or colour legend. It does not by itself establish an ancient route or paint scheme.',
    citations: [cite('borobudur-plan-image', 'Inspected diagram and file record')],
    notice: [
      'Point to one square form and one circular form.',
      'Find a stair-like projection; keep its compass direction unknown.',
    ],
    claimPrompt:
      'Describe a visible relationship. Name another source you would need to explain how people actually moved through the monument.',
    returnPrompt:
      'Return with a new question about building, maintaining or supporting a place.',
    feedback:
      'Shapes and projections can be shown. A required ancient route, compass direction, scale and original paint colours need evidence beyond this unlabelled modern schematic.',
  },
};

export function applyPlacesPatrons(c: Corpus): void {
  applyPlacesByzantium(c);
  applyPlacesBorobudur(c);
  applyPlacesMaya(c);
  c.subjects.find((s) => s.id === 'maya-vessel')!.placeStudy = {
    ...mayaPlaceStudy,
    background: 'coastline',
    description:
      mayaPlaceStudy.description +
      ' The schematic modern coastline supplies orientation, not an ancient shoreline.',
  };
  for (const media of [borobudurPhoto, borobudurPlan]) {
    c.media.push(media);
    c.subjects.find((s) => s.id === 'borobudur')!.objectIds.push(media.id);
  }
  for (const [id, items] of [
    ['met-464428', byzantiumAnnotationDraft],
    ['met-316711', mayaAnnotationDraft],
  ] as const) {
    const media = c.media.find((m) => m.id === id)!;
    media.hasAnnotations = true;
    media.licenseUrl = 'https://creativecommons.org/publicdomain/zero/1.0/';
    media.annotations = {
      createdOn: '2026-10-29',
      credit: 'Chronos / Codex, 2026.',
      rights:
        'Modern annotations: CC BY 4.0. The underlying photograph has separate credit and rights.',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      items: [...items],
    };
    media.caption +=
      ' Three modern numbered notes point to surviving features on the unchanged photograph; their observations remain separate from interpretation.';
  }
  c.media.find((m) => m.id === 'met-464428')!.printCaption =
    'Ivory, probably Constantinople; private use and the lower figure’s identity remain qualified.';
  c.media.find((m) => m.id === 'met-316711')!.printCaption =
    'Inscribed Maya cup. Modern notes locate visible forms; name readings and possible origin remain qualified.';
  c.journeys.push(journey);
  c.glossary.push(
    {
      id: 'relief',
      name: 'Relief',
      definition:
        'An image carved or modelled so that forms project from a background surface. A relief can organize a story on that surface; its interpretation and use require further evidence.',
    },
    {
      id: 'iconoclasm',
      name: 'Iconoclasm',
      definition:
        'Opposition to or destruction of images, especially in religious settings. Byzantine disputes involved particular periods and policies; the term does not describe every Christian view about images.',
    },
  );
  for (const id of ['byzantium', 'borobudur', 'maya-vessel']) {
    const s = c.subjects.find((s) => s.id === id)!;
    s.dimensions = { 'place-work': s.dimensions['place-work']!, ...s.dimensions };
    s.dimensionKeys = Object.keys(s.dimensions);
    s.terms = [...new Set([...s.terms, 'patronage'])];
    if (id !== 'maya-vessel') s.terms.push('relief');
    if (id === 'byzantium') s.terms.push('iconoclasm');
  }
  const p = c.packs.find((p) => p.id === 'C5')!;
  p.investigations = [
    ...(p.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['byzantium', 'borobudur'],
      start: 250,
      end: 1204,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Constantinople, Central Java and distinct Mesoamerican contexts retain separate histories. Cerén is a household comparison, not the cup’s findspot; three Java dots are modern component references, with no route drawn.',
      limits:
        'Selected work and support, not complete social histories. All original cases retain their full dates; object, sample, context, photo and modern diagram dates remain distinct. No common patron or contact is inferred.',
    },
  ];
}
