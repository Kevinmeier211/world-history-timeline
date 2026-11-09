import type { Corpus, Journey } from '../../src/atlas/model';
import { cite } from './content-helpers';
import {
  oldKingdomSources,
  oldKingdomContext,
  applyOldKingdom,
} from './households-old-kingdom';
import { caralSources, caralContext, applyCaral } from './households-caral';
import { skaraSources, skaraContext, applySkara } from './households-skara';
import { householdPlaceSources, applyHouseholdPlaces } from './households-places';
import { householdMedia } from './households-media';

const journey: Journey = {
  id: 'homes-provision-renewal',
  title: 'Homes, provisions and renewal',
  question: 'What recurring work kept a place usable, and which records reveal it?',
  duration: '30–40 minutes',
  introduction:
    'Follow three investigations in thematic order: preparing food, renewing built space and maintaining a home. They are comparisons of work and evidence, not a travel route, a claim of contact or stages toward one origin of civilization. Each place retains its own chronology and institutions.',
  leadObject: 'skara-household-guide',
  printSourcesPerPage: 2,
  stops: [
    {
      subject: 'old-kingdom',
      year: -2450,
      title: 'A monument needed recurring provision',
      object: 'giza-provisioning-diagram',
      narrative:
        'Begin with the relationship between grain, food preparation and people doing work. Keep Giza’s excavated workplaces, the translated crew record and the selected Saqqara chapel wall distinct. A recurring task requires more than a finished monument.',
    },
    {
      subject: 'caral',
      year: -2400,
      title: 'An earlier room could enter later construction',
      object: 'caral-renewal-diagram',
      compare: 'old-kingdom',
      narrative:
        'Follow the guide from space through subdivision to fill and renewal. The project describes woven stone-filled bags and changing rooms; it does not supply every builder’s choices or one sequence for all buildings. Compare the material tasks before inferring the same institution.',
    },
    {
      subject: 'skara-brae',
      year: -2800,
      title: 'A house required continuing practical work',
      object: 'skara-household-guide',
      compare: 'caral',
      narrative:
        'Imagine bringing fuel from the entrance toward the hearth in the independently drawn feature guide. Then read how House 1 changed during modern rebuilding. Physical features support practical questions while their present arrangement also has a history.',
    },
  ],
  conclusion:
    'Preparing food, renewing buildings and maintaining domestic space depended on people, materials and organization. The evidence here makes particular relationships visible without identifying every worker or establishing a common government across these places.',
  evidence: {
    prompt:
      'How could we investigate the recurring work that kept these places usable?',
    citations: [
      cite('giza-provisioning', 'Excavated bakeries and modern experiment'),
      cite(
        'caral-project-2005',
        'Printed pp.19 and41 / PDF 21 and43: fill and renewal',
      ),
      cite(
        'skara-significance-2024',
        'Printed pp.67–69: House 1 features and rebuilding',
      ),
    ],
    options: [
      {
        text: 'Match a practical task to its specific record, then test the interpretation with further evidence.',
        supported: true,
        feedback:
          'A workplace, construction fill and a described house each support different questions. Their limits help choose a further source rather than erase the work they reveal.',
      },
      {
        text: 'Treat similar work as proof that one institution governed all three places.',
        supported: false,
        feedback:
          'Recurring tasks can be compared across distinct settings. Similarity does not establish shared government, contact or identical labor arrangements.',
      },
      {
        text: 'Read a modern guide as the exact arrangement experienced by every ancient resident.',
        supported: false,
        feedback:
          'The guides are modern and schematic. House phases, later alterations and different records require their own dates and explanations.',
      },
    ],
  },
  returnPrompt:
    'Choose one task. Explain who or what had to contribute, cite the record that supports it, and name one question needing further evidence.',
  familyEvidence: {
    title: 'A practical task in a changing room',
    object: 'skara-household-guide',
    text: 'HES describes House 1’s hearth, shelving and stone enclosures. Nineteenth-century rebuilding omitted recorded cells; a window is modern. This independently drawn guide uses selected feature relationships. It is not a measured plan or a complete ancient room.',
    citations: [
      cite('skara-significance-2024', 'Printed pp.67–69 / PDF 69–71: House 1'),
    ],
    notice: [
      'Find the entrance and hearth.',
      'Trace an imagined trip carrying fuel. An adult can read the labels aloud.',
    ],
    claimPrompt:
      'Explain one task the guide helps you imagine. What evidence would test how people actually used the room?',
    returnPrompt:
      'Compare one present feature with a record of its earlier arrangement.',
    feedback:
      'Features help explore a practical task. The guide does not identify an actual occupant, exact route, work role or unchanged ancient interior.',
  },
};

export function applyHouseholds(c: Corpus) {
  c.sources.push(
    ...oldKingdomSources,
    ...caralSources,
    ...skaraSources,
    ...householdPlaceSources,
  );
  applyOldKingdom(c.subjects.find((s) => s.id === 'old-kingdom')!);
  applyCaral(c.subjects.find((s) => s.id === 'caral')!);
  applySkara(c.subjects.find((s) => s.id === 'skara-brae')!);
  c.contexts = [...(c.contexts ?? []), oldKingdomContext, caralContext, skaraContext];
  c.media.push(...householdMedia);
  c.journeys.push(journey);
  applyHouseholdPlaces(c);
  for (const id of ['old-kingdom', 'caral', 'skara-brae']) {
    const s = c.subjects.find((s) => s.id === id)!;
    const maintenance = s.dimensions.maintenance!;
    delete s.dimensions.maintenance;
    s.dimensions = { maintenance, ...s.dimensions };
  }
  c.glossary.push(
    {
      id: 'provisioning',
      name: 'Provisioning',
      definition:
        'Organizing and supplying the food and other materials needed by people or institutions. Storage, preparation and delivery involve different tasks.',
    },
    {
      id: 'shicra',
      name: 'Shicra',
      definition:
        'A woven plant-fiber bag. Stone-filled examples occur in Caral’s construction deposits; their presence alone does not establish how every worker was recruited or required to contribute.',
    },
    {
      id: 'midden',
      name: 'Midden',
      definition:
        'An accumulation of discarded material and occupation deposits. Its contents and layers can help investigate activities, but need their own context and chronology.',
    },
  );
  for (const [id, terms] of Object.entries({
    'old-kingdom': ['provisioning', 'experimental-archaeology'],
    caral: ['shicra', 'stratigraphy'],
    'skara-brae': ['midden', 'reconstruction', 'radiocarbon'],
  })) {
    const s = c.subjects.find((s) => s.id === id)!;
    s.terms = [...new Set([...s.terms, ...terms])];
  }
  const scopes: Record<string, string> = {
    'old-kingdom':
      'Current 2019 Tara Prakash essay title and full Dynasty 3–6 body read again, 28 October 2026: period convention, funerary evidence selection, monuments, elite officials and debated provincial/political change. Displayed title remains c. 2649–2130 BCE while slug retains an older endpoint. Exact reign chronology, single-cause collapse and the wider unconsulted books are not silently adopted. Existing complete case interval/note retained.',
    'met-543914':
      'Description, Artwork Details, audio transcript and Public Domain statement read again; existing 1600×630 image inspected. Accession 08.201.2a–g: c. 2465–2389 BCE, Saqqara tomb QS 915, couple’s roles, offering niches, displaced stela and erased scene. Museum interpretation of senet kept attributed; no complete household census or precise reconstruction of the wall’s original arrangement inferred. CC0 image bytes retained; no audio played.',
    caral:
      'UNESCO Description, Brief synthesis and Integrity/Authenticity renewed, 28 October 2026: platform/court architecture and development range 3000–1800 BCE. Institutional claims about state formation, hierarchy and priority remain interpretations rather than measured household arrangements or civilizational rankings. Large nomination PDF/plans not consulted; no source photograph copied. The separate prior government endpoint remains qualified in the preserved case interval.',
    'skara-houses':
      'Current HES visitor account read again: village furniture/slabs/midden, artifacts and ending. Its general covered-passage/workshop wording is qualified by the detailed 2024 statement: passages changed, some roofing was later and Structure 8’s date/function are uncertain. No claim of universal peacefulness from absent weapons. No source photograph copied.',
    'skara-tool':
      'Prior consulted HES record used 3180–2500 BCE structured dates and 3100–2400 BCE narrative, as preserved in the unchanged case interval/note. Current old URL redirects to Trove object 9194; Summary and Further details read again on 28 October 2026. Summary still gives 3100–2400 BC and uncertain hand-held-rake function; current numeric Date made displays 3179 to 2498. The differing values are recorded without invented reconciliation or case-date revision. X.HA.668 sandstone and National Museums Scotland loan retained. Image permission is required; no object image copied or visually inspected in this pass.',
  };
  for (const [id, scope] of Object.entries(scopes)) {
    const s = c.sources.find((s) => s.id === id)!;
    s.scope = scope;
    s.accessed = '2026-10-28';
  }
  c.sources.find((s) => s.id === 'caral-peru')!.scope +=
    ' Renewal attempt on 28 October 2026 returned 418; this retains the prior consulted orientation, not a newly read page.';
  c.media.find((m) => m.id === 'met-543914')!.licenseUrl =
    'https://creativecommons.org/publicdomain/zero/1.0/';
  const pack = c.packs.find((p) => p.id === 'C1')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['caral', 'skara-brae'],
      start: -3180,
      end: -1800,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Saqqara/Giza/Memphis, the Supe Valley and Orkney: distinct site and regional locators, not an ancient connecting route.',
      limits:
        'These three expansions preserve different periods and institutions. Broader household/recruitment research, the measured Skara site-plan task and independent/human acceptance remain open.',
    },
  ];
  pack.coverage.Africa.reason =
    'The selected Saqqara wall now connects to a bounded source-based account of provisioning, Giza institutions and changing cult service. Wider Nile farming, households, gender and provincial histories remain selective.';
  pack.coverage.Americas.reason =
    'Caral now has settlement, food-evidence and construction-renewal explanation with phased context. One Supe study and selected project pages do not complete wider American or household histories.';
  pack.coverage.Europe.reason =
    'Skara Brae now has household/landscape interpretation, source-qualified phases and an original feature guide. Wider Neolithic Europe, measured plans and independent archaeological review remain open.';
}
