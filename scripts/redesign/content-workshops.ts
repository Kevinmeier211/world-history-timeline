import type { Corpus, Journey } from '../../src/atlas/model';
import { cite } from './content-helpers';
import { applyWorkshopsMing, mingWorkDimension } from './c7-ming';
import { applyWorkshopsOttoman, ottomanWorkDimension } from './c7-ottoman';
import { applyWorkshopsMughal, mughalWorkshopDimension } from './c7-mughal';

const journey: Journey = {
  id: 'makers-patrons-markets',
  title: 'Makers, patrons and markets',
  question: 'How did makers, patrons and markets organize work?',
  duration: '20–30 minutes',
  introduction:
    'Compare a Ming jar, a Süleiman tughra and a Mughal manuscript folio. Shaping, decoration, writing and translation involved different working relationships. Catalogue identifications, institutional accounts and technical studies supply different evidence. These stops organize a comparison; they do not establish a shared workshop, patron or route.',
  stops: [
    {
      subject: 'ming-workshops',
      object: 'met-42549',
      year: 1550,
      title: 'Separate a pictured object from an order for similar work',
      narrative:
        'Observe the jar’s fish, plants and repeated decoration. The catalogue supplies its technical identification. Wider accounts distinguish official models, supervision, private production and markets. The 1542 record concerns similar jars; it does not identify this accession’s batch, every worker, a fulfilled order or a particular voyage.',
    },
    {
      subject: 'ottoman-workshops',
      object: 'met-449533',
      year: 1560,
      title: 'Distinguish specialist writing, ceramic work and buying',
      narrative:
        'Keep the decorated tughra separate from the ceramic dish and the separately catalogued 1549 signed lamp. A named decorator identifies one relationship, not every maker. Excavation and technical abstracts add limited material evidence; the mediated 1670s market account concerns another time and source. None supplies one universal recipe or the complete experience of an Ottoman workshop.',
    },
    {
      subject: 'mughal-books',
      object: 'met-448183',
      year: 1592,
      title: 'Connect translation and painting through particular projects',
      narrative:
        'The selected folio is catalogued around 1590–95. Compare its representation with accounts of translation, writing, painting and the House of Books. Project names, teams, copies and attributed preface arguments have distinct dates and evidentiary limits. Courtly sponsorship does not prove equal power among participants, a universal audience or every worker’s identity.',
    },
  ],
  conclusion:
    'Explain a particular task and the relationship that supported it. Then distinguish what an object shows, what a catalogue identifies and what another record says about commissioning, buying or translation. A named patron, decorator or project does not recover every working life.',
  evidence: {
    prompt:
      'Which explanation best fits the supplied photograph of the Ming jar and its source account?',
    options: [
      {
        text: 'The arrangement is visible; its material identification and connection to wider production require the catalogue and other records.',
        supported: true,
        feedback:
          'Looking and technical identification answer different questions. A broader account of orders and markets does not name this jar’s individual maker or buyer.',
      },
      {
        text: 'The record of similar jars in 1542 proves this accession came from that exact batch.',
        supported: false,
        feedback:
          'The supplied record concerns similar work. Identifying a particular batch needs an additional documented association.',
      },
      {
        text: 'Repeated decorative forms prove that one patron and workshop organized all three cases.',
        supported: false,
        feedback:
          'Resemblance supports comparison. A shared patron or workshop requires its own evidence, with particular dates and people.',
      },
    ],
    citations: [
      cite('met-42549', 'Catalogue: material, date and record for similar jars'),
      cite('ming-palace-production-2016', 'Design, inspection and distribution'),
    ],
  },
  returnPrompt:
    'Name one task, identify its supporting source and ask which worker, audience or working relationship remains to be explained.',
  leadObject: 'met-42549',
  printSourcesPerPage: 2,
  familyEvidence: {
    title: 'A visible pattern, a question about work',
    object: 'met-42549',
    text: 'The Met identifies a mid-sixteenth-century Jingdezhen porcelain jar with cobalt under the glaze and coloured enamels above it. Fish, plants and repeated borders can be observed in the photograph. The technical identification uses catalogue research; the image does not name every maker or buyer.',
    citations: [cite('met-42549', 'Catalogue: date, material and supplied photograph')],
    notice: [
      'Find a fish, a plant and a repeated border.',
      'Point to an arrangement a decorator could have worked on; keep the unseen side unknown.',
    ],
    claimPrompt:
      'Describe a visible pattern. Which other source would help explain who shaped, decorated, ordered or bought the jar?',
    returnPrompt: 'Return with a new question about one task or working relationship.',
    feedback:
      'The picture shows arrangement. The catalogue identifies materials. Naming workers, buyers or a particular order needs more evidence; a record for similar jars does not identify this batch.',
  },
};

export function applyWorkshops(c: Corpus): void {
  applyWorkshopsMing(c);
  applyWorkshopsOttoman(c);
  applyWorkshopsMughal(c);
  for (const [id, dimension] of [
    ['ming-workshops', mingWorkDimension],
    ['ottoman-workshops', ottomanWorkDimension],
    ['mughal-books', mughalWorkshopDimension],
  ] as const) {
    const subject = c.subjects.find((s) => s.id === id)!;
    subject.dimensions = { 'work-organization': dimension, ...subject.dimensions };
    subject.dimensionKeys = Object.keys(subject.dimensions);
    subject.terms = [...new Set([...subject.terms, 'workshop', 'patronage'])];
  }
  c.glossary.push({
    id: 'workshop',
    name: 'Workshop',
    definition:
      'A setting or group in which people produce or prepare work. Size, training, ownership and the division of tasks vary; a catalogue’s workshop attribution does not identify every maker.',
  });
  c.journeys.push(journey);
  const pack = c.packs.find((p) => p.id === 'C7')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['ming-workshops', 'ottoman-workshops'],
      start: 1368,
      end: 1700,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Distinct Chinese, Ottoman and Mughal production and court settings retain their original qualified locators. Material or design comparison does not supply a reconstructed route or shared workshop.',
      limits:
        'Selected making, commissioning, buying and translation, not complete labor histories. Original case and object intervals remain; reference phases, similar-object records, later market accounts and modern experiments have separate scopes and dates.',
    },
  ];
}
