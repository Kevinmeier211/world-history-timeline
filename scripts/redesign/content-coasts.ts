import type { Corpus, Journey } from '../../src/atlas/model';
import { cite } from './content-helpers';
import { applyOlmec } from './coasts-olmec';
import { applyLapita } from './coasts-lapita';
import { applyPovertyPoint } from './coasts-poverty';
import { applyCoastPlaces } from './coasts-places';
import { applyCoastMedia } from './coasts-media';

const journey: Journey = {
  id: 'clay-work-local-histories',
  title: 'Clay, work and local histories',
  question: 'How can clay reveal practical work and connections?',
  duration: '30–40 minutes',
  introduction:
    'Compare heating objects, a small represented body and the making of patterned pottery. Each investigation connects materials with practical work and its own local history. This thematic order is not a travel route, a claim of contact between these places or a single sequence of civilizational stages.',
  leadObject: 'lapita-stamp-guide',
  printSourcesPerPage: 2,
  stops: [
    {
      subject: 'poverty-point',
      year: -1400,
      object: 'pp-cooking-objects',
      title: 'A small object could supply stored heat',
      narrative:
        'Observe the heating-object shapes, then read how the account connects them to cooking. Set that work beside building and maintaining the plaza. The modern terrain image and excavated deposits answer different questions about the place.',
    },
    {
      subject: 'olmec',
      year: -1000,
      object: 'met-314609',
      compare: 'poverty-point',
      title: 'A represented body shows a different use of clay',
      narrative:
        'Look at the figure’s ornaments and modeled details before proposing a social meaning. Its missing excavated findspot matters. Compare a portable figure with earth building and the revised dating of supposed households at San Lorenzo.',
    },
    {
      subject: 'lapita',
      year: -900,
      object: 'lapita-stamp-guide',
      compare: 'poverty-point',
      title: 'A repeated operation could build a larger pattern',
      narrative:
        'Follow the original modern stamp-action guide. Then distinguish the museum’s plaster cast, ancient ceramic samples and scientific studies of materials, dates and diet. Similar decoration starts an inquiry; it does not recover a canoe’s itinerary.',
    },
  ],
  conclusion:
    'Clay could supply heat, represent a body or become a useful decorated container. Making and using these forms involved different skills and social settings. Material observations, dated contexts and carefully chosen comparisons explain more than assigning every similar object one use or one origin.',
  evidence: {
    prompt:
      'What next investigation would best test a ceramic-transfer interpretation?',
    citations: [
      cite('lapita-rove-temper', 'Published abstract: local and nonlocal temper'),
      cite('lapita-nukuleka-uth', 'Sample Context; Results'),
      cite('lapita-teouma-diet', 'Isotope reconstruction and Conclusions'),
      cite('met-314215-cast', 'Date; Medium; catalogue details'),
    ],
    options: [
      {
        text: 'Date a coral tool from the same island.',
        supported: false,
        feedback:
          'A well-contextualized dated tool can improve settlement chronology. It does not directly identify the ceramic’s material source or distinguish a carried vessel from local production.',
      },
      {
        text: 'Compare the sherd’s minerals with local and nonlocal source samples, alongside its dated context.',
        supported: true,
        feedback:
          'Material comparison directly tests provenance. Nonlocal fabric can strengthen a transfer interpretation, while movement of raw ingredients remains an alternative to consider; no individual carrier or exact itinerary follows automatically.',
      },
      {
        text: 'Compare burial protein-isotope values with food baselines.',
        supported: false,
        feedback:
          'That is useful for a different question about dietary protein. It does not directly test where the pottery’s clay or temper originated.',
      },
      {
        text: 'Match decorative bands on a modern plaster cast.',
        supported: false,
        feedback:
          'A cast can help compare represented surface detail. Its plaster is not the ancient vessel’s fabric, so it cannot supply that vessel’s clay composition or prove ceramic transfer.',
      },
    ],
  },
  returnPrompt:
    'Choose one practical task and one proposed connection. Name the evidence that supports each, then choose a further test that would answer the remaining question.',
  familyEvidence: {
    title: 'Small actions make a larger pattern',
    object: 'lapita-stamp-guide',
    text: 'The museum essay describes potters pressing toothed tools into clay before firing. This original modern guide uses a hypothetical tool and pattern to explain that operation. It does not reproduce a recovered ancient tool, motif or vessel. The separate museum photograph shows a modern plaster cast.',
    citations: [cite('lapita', 'Ceramic technique and proposed vessel uses')],
    notice: [
      'Find the teeth, the single impression and the repeated marks. An adult can read the labels aloud.',
      'Draw one small paper mark, then repeat it to make a band of your own.',
    ],
    claimPrompt:
      'Explain how repetition made your pattern. What else would you need before claiming that a pot traveled?',
    returnPrompt:
      'Come back to the pattern and add a question about the material or place where the object was found.',
    feedback:
      'The guide supports explaining a making operation. Similar marks alone do not date a vessel, establish its material source or identify a voyage; those require different evidence.',
  },
};

export function applyCoasts(c: Corpus) {
  applyOlmec(c);
  applyLapita(c);
  applyPovertyPoint(c);
  applyCoastMedia(c);
  applyCoastPlaces(c);
  const olmec = c.subjects.find((s) => s.id === 'olmec')!;
  olmec.dimensions['material-work'] = {
    text: 'Potters varied clay, shape and surface treatment; a small modeled body makes adornment and handling visible at a different scale from a platform or workshop. Its exact use and excavated household remain uncertain.',
    citations: [
      cite('olmec', 'Potters at San Lorenzo; Ceramic arts'),
      cite('met-314609', 'Description; Artwork Details'),
    ],
  };
  for (const id of ['olmec', 'lapita', 'poverty-point']) {
    const s = c.subjects.find((s) => s.id === id)!;
    const material = s.dimensions['material-work']!;
    delete s.dimensions['material-work'];
    s.dimensions = { 'material-work': material, ...s.dimensions };
  }
  c.journeys.push(journey);
  c.glossary.push(
    {
      id: 'temper',
      name: 'Temper',
      definition:
        'Non-clay material, such as sand or plant fibers, mixed with clay to change how pottery behaves. Its composition can help investigate material sources, without identifying a particular carrier or voyage.',
    },
    {
      id: 'type-site',
      name: 'Type-site',
      definition:
        'A place whose name supplies the label for an archaeological category. Similar finds elsewhere still need their own dates and contexts; the name alone does not prove that practices spread outward from that place.',
    },
    {
      id: 'lidar',
      name: 'LiDAR',
      definition:
        'Light detection and ranging: measurements of light pulses used to model elevation. A ground-surface model can reveal forms, while excavation and dating help investigate their histories.',
    },
  );
  for (const [id, terms] of Object.entries({
    olmec: ['stratigraphy', 'inference'],
    lapita: ['temper', 'calibration', 'provisioning'],
    'poverty-point': ['type-site', 'lidar', 'stratigraphy', 'midden'],
  })) {
    const s = c.subjects.find((s) => s.id === id)!;
    s.terms = [...new Set([...s.terms, ...terms])];
  }
  const p = c.packs.find((p) => p.id === 'C2')!;
  p.investigations = [
    ...(p.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['olmec', 'poverty-point'],
      start: -1700,
      end: -400,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Gulf Coast reference centres, selected Pacific island settings across 180° and two Lower Mississippi sites: source-qualified locators, with no invented interregional route.',
      limits:
        'The three expansions retain their own case and reference dates. Abstract-only food/material sources, archaeological models, measured regional histories and independent/human acceptance remain qualified. Kerma and broader C2 regional frameworks remain open.',
    },
  ];
  p.coverage.Americas.reason =
    'Olmec and Poverty Point now have layered accounts, distinct phased contexts, geographic locators and material/source interpretation. These selected communities do not complete Gulf Coast, Lower Mississippi or wider American histories.';
  p.coverage['Southeast Asia/Oceania'].reason =
    'Lapita now joins pottery-making, provisioning and source-qualified island sequences, with a modern cast, original action guide and a correctly wrapped regional locator. Archaeological and linguistic reconstruction stay distinct; this is not a complete Pacific reference framework.';
}
