import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';

const accessed = '2026-11-04';
const sources: Source[] = [
  {
    id: 'completion-minoan-crete',
    title: 'Minoan Crete',
    institution: 'The Metropolitan Museum of Art',
    author: 'Colette Hemingway and Seán Hemingway',
    published: '2002-10-01',
    url: 'https://www.metmuseum.org/essays/minoan-crete',
    type: 'scholarship',
    accessed,
    scope:
      'Full institutional essay consulted. Supports selected Cretan palaces, administrative writing, exchange and the approximate 1450 BCE destruction horizon. The cause of that destruction is not treated as established. No original Linear A document or excavation archive was independently examined.',
  },
  {
    id: 'completion-mycenaean',
    title: 'Mycenaean Civilization',
    institution: 'The Metropolitan Museum of Art',
    author: 'Colette Hemingway and Seán Hemingway',
    published: '2003-10-01',
    url: 'https://www.metmuseum.org/essays/mycenaean-civilization',
    type: 'scholarship',
    accessed,
    scope:
      'Full institutional essay consulted. Supports the approximate 1600–1100 BCE cultural frame, named mainland centres, workshop products, Linear B and evidence from circulated vessels. The essay’s feudal-system label is not adopted; pottery distribution does not establish a particular ship’s crew or itinerary.',
  },
  {
    id: 'completion-british-bronze',
    title: 'British Collections by Archaeological Period: Bronze Age (2300 BC–800 BC)',
    institution: 'Ashmolean Museum, University of Oxford',
    published: '2012-01',
    url: 'https://britisharchaeology.ashmus.ox.ac.uk/collections/bronze-age.html',
    type: 'archaeology',
    accessed,
    scope:
      'Complete collection overview consulted. Supports the museum’s broad British periodization, continued stone/flint use, metal exchange, farm settlements and selected landscape evidence. This overview does not date every farm to the same year or establish a single European political system. Images are not copied.',
  },
];
const context: HistoricalContext = {
  id: 'europe-bronze-settings',
  title: 'Aegean centres and British farms: different Bronze Age settings',
  region: 'Europe',
  interval: {
    start: -1900,
    end: -1100,
    precision: 'approximate',
    label: 'c. 1900–1100 BCE · selected European settings',
    note: 'A teaching frame connecting separately dated evidence, not the lifespan of one society. Cretan palaces, mainland Greek centres and British farms did not share one government or one collapse. Britain’s broader museum periodization is c. 2300–800 BCE. The Uluburun link offers a dated cargo comparison; it does not identify that ship’s origin or destination.',
  },
  summary:
    'Around 1900 BCE, centres such as Knossos and Phaistos concentrated work, goods and record keeping on Crete. Mainland Greek workshops and palaces later provide a different set of records and objects. In Britain, farms, fields and round houses belonged to another settlement pattern; metal tools coexisted with stone and flint. These settings let us ask who organized production and how materials moved, without turning an Aegean palace history into the history of every European community.',
  subjectIds: ['uluburun'],
  citations: [
    {
      source: 'completion-minoan-crete',
      locator:
        'Paragraphs beginning Around 1900 B.C.; With the palaces; Much of the first half',
    },
    {
      source: 'completion-mycenaean',
      locator: 'Mainland centres, workshops, commerce and Linear B paragraphs',
    },
    {
      source: 'completion-british-bronze',
      locator: 'Bronze Age overview, first three paragraphs',
    },
  ],
  phases: [
    {
      year: -1900,
      title: 'Cretan centres and records',
      text: 'The museum dates the establishment of major Cretan palaces to around 1900 BCE. Administrative clay records and concentrated craft activity help explain their institutional role; agricultural redistribution remains a proposed function.',
      citations: [
        {
          source: 'completion-minoan-crete',
          locator: 'Around 1900 B.C.; With the palaces; The scripts',
        },
      ],
    },
    {
      year: -1600,
      title: 'A mainland Greek cultural frame',
      text: 'The selected museum overview begins its Mycenaean frame around 1600 BCE. Mycenae, Tiryns, Thebes and Athens are named centres. Vessels found far away support circulation of goods; they do not reveal every trader or the route of one voyage.',
      citations: [
        {
          source: 'completion-mycenaean',
          locator: 'Opening chronology; mainland centres; Wide-ranging commerce',
        },
      ],
    },
    {
      year: -1450,
      title: 'A Cretan destruction horizon',
      text: 'Archaeological destruction on Crete is placed around 1450 BCE in the consulted account. The source leaves responsibility uncertain. This date should not be merged with later mainland destruction or used as a universal end to European exchange.',
      citations: [
        { source: 'completion-minoan-crete', locator: 'From 1500 B.C. paragraph' },
      ],
    },
    {
      year: -1200,
      title: 'Different settings around the snapshot date',
      text: 'The mainland account describes destruction and decline in the late thirteenth century BCE. The British overview instead describes a much longer Bronze Age sequence of farms, field divisions and deposited objects. Comparing these accounts does not establish synchronized change or an identical cause.',
      citations: [
        {
          source: 'completion-mycenaean',
          locator: 'Final paragraph; late thirteenth-century destruction',
        },
        {
          source: 'completion-british-bronze',
          locator: 'Period heading; settlements, landscape divisions and deposition',
        },
      ],
    },
  ],
};

/** Deliberate editorial addition after the byte-identical assembly refactor. */
export function applyCompletionBronze(corpus: Corpus) {
  corpus.sources.push(...structuredClone(sources));
  (corpus.contexts ??= []).push(structuredClone(context));
  const cargo = corpus.subjects.find((s) => s.id === 'uluburun');
  if (cargo) (cargo.contextIds ??= []).push(context.id);
  const chapter = corpus.packs.find((p) => p.id === 'C2');
  if (chapter)
    chapter.coverage.Europe.reason =
      'A sourced reference compares selected Aegean centres and British farms. There is not yet a standalone European dossier in this chapter; Uluburun remains a separately dated cargo comparison in West/Central Asia.';
}
