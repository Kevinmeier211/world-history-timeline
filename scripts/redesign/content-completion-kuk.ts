import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';

const sources: Source[] = [
  {
    id: 'completion-kuk-sequence',
    title: 'An Introduction to the Investigations at Kuk Swamp',
    author: 'Jack Golson',
    institution: 'ANU Press',
    published: '2017',
    url: 'https://press-files.anu.edu.au/downloads/press/n2540/html/ch01.xhtml',
    type: 'archaeology',
    accessed: '2026-11-04',
    scope:
      'Consulted chapter text, the explicit AD 1950 calibration convention, and Table 1.2. Original laboratory measurements were not reanalysed. Early and late Phase 3 ranges are distinct; calendar conversions are rounded orientation values, not exact event dates.',
  },
  {
    id: 'completion-kuk-ditches',
    title: 'Phase 3: The Emergence of Ditches',
    author: 'Tim Denham, Jack Golson and Philip Hughes',
    institution: 'ANU Press',
    published: '2017',
    url: 'https://press-files.anu.edu.au/downloads/press/n2540/html/ch13.xhtml?page=22&referer=',
    type: 'archaeology',
    accessed: '2026-11-04',
    scope:
      'Consulted the Phase 3 account, regional discussion and Tables 13.1–13.2. Supports wetland drainage, differences in dating precision and the distinction from later Lapita chronology. No published photograph, map or cultural knowledge is reproduced; no contemporary community endorsement is implied.',
  },
];
const context: HistoricalContext = {
  id: 'kuk-wetland-context',
  title: 'Kuk: drainage and cultivation in New Guinea',
  region: 'Southeast Asia/Oceania',
  interval: {
    start: -2400,
    end: -450,
    precision: 'range',
    label: 'c. 2400–450 BCE · selected Phase 3 evidence',
    note: 'Rounded orientation for the Phase 3 sequence, not proof of cultivation in every field in every intervening year. The published early range is 4350–3980 calibrated years before 1950 (about 2400–2030 BCE); the late range is 2700–2400 (about 750–450 BCE). This is a highland New Guinea setting, not a history of all Southeast Asia or Oceania.',
  },
  summary:
    'At Kuk in the upper Wahgi Valley, buried ditch networks show people altering wet ground for cultivation. Archaeologists distinguish early and later drainage episodes and compare Kuk with other highland sites. Draining soil could make land usable, but the surviving cuts do not name the workers, settle their land rights or reveal every crop. This agricultural history should be read alongside, rather than absorbed into, the later island settlements associated with Lapita pottery.',
  subjectIds: ['lapita'],
  citations: [
    {
      source: 'completion-kuk-sequence',
      locator: 'The choice of Kuk; calibration convention; Table 1.2 and notes',
    },
    {
      source: 'completion-kuk-ditches',
      locator:
        'Phase 3 subphases; Tables 13.1–13.2; The emergence of ditches in highland New Guinea',
    },
  ],
  phases: [
    {
      year: -2400,
      title: 'Early Phase 3: a dated range',
      text: 'The early ditch-network range is approximately 2400–2030 BCE. The opening year is a rounded edge of that range, not a known day when ditch digging began.',
      citations: [
        {
          source: 'completion-kuk-sequence',
          locator: 'Table 1.2: early Phase 3; AD 1950 convention',
        },
      ],
    },
    {
      year: -750,
      title: 'Later drainage evidence',
      text: 'The table places a later subphase around 750–450 BCE. The interval between the published subphases must not become a fabricated continuous list of annual events.',
      citations: [
        { source: 'completion-kuk-sequence', locator: 'Table 1.2: late Phase 3' },
      ],
    },
    {
      year: -450,
      title: 'An archaeological boundary, not the end of a people',
      text: 'The selected late range ends here. The authors distinguish later phases and warn that other sites lack enough evidence to establish the same pattern of abandonment. Changing a field system does not by itself establish the disappearance of a community.',
      citations: [
        {
          source: 'completion-kuk-ditches',
          locator: 'Regional processes: cessation at Kuk and limits at other sites',
        },
      ],
    },
  ],
};

export function applyCompletionKuk(corpus: Corpus) {
  corpus.sources.push(...structuredClone(sources));
  (corpus.contexts ??= []).push(structuredClone(context));
  const lapita = corpus.subjects.find((s) => s.id === 'lapita');
  if (lapita) (lapita.contextIds ??= []).push(context.id);
  const first = corpus.packs.find((p) => p.id === 'C1');
  if (first)
    first.coverage['Southeast Asia/Oceania'].reason =
      'A sourced Kuk reference supplies a highland New Guinea agricultural setting from about 2400 BCE. Earlier C1 dates and mainland Southeast Asian settings still need research. The later Lapita dossier is a comparison, not contemporary C1 settlement evidence.';
}
