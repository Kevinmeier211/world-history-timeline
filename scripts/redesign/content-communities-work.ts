import type { Corpus, Journey } from '../../src/atlas/model';
import { cite } from './content-helpers';
import {
  applyCommunitiesChaco,
  chacoHistoricalPlan,
  chacoWorkDimension,
} from './c6-chaco';
import { applyCommunitiesCahokia, cahokiaWorkDimension } from './c6-cahokia';
import {
  applyCommunitiesOcmulgee,
  ocmulgeeFeaturePlanDraft,
  ocmulgeeWorkDimension,
} from './c6-ocmulgee';

const journey: Journey = {
  id: 'buildings-food-continuity',
  title: 'Buildings, food and continuing connections',
  question: 'How can buildings and food help explain communities through change?',
  duration: '20–30 minutes',
  introduction:
    'Compare building, food and material work at Chaco, Cahokia and Ocmulgee. A later plan, a 1907 print and an excavation record answer different questions. Present-day community statements have named speakers and contexts. This order organizes an inquiry; it does not establish contact, a travel route or one shared institution.',
  stops: [
    {
      subject: 'chaco-communities',
      object: 'chaco-plan-1850',
      year: 1000,
      title: 'Connect building and provisioning through different evidence',
      narrative:
        'Look for room marks and an open space in the 1850 record of Pueblo Bonito’s ruins. The plan’s publication is much later than the selected case. Archaeological accounts add masonry, smaller habitation and storage spaces, while the earlier food study tests particular vessel samples. None identifies every occupant or turns all constructed alignments into a recovered journey. Attributed Pueblo statements establish continuing significance.',
    },
    {
      subject: 'cahokia-city',
      object: 'cahokia-view-1907',
      year: 1100,
      title: 'Build a neighborhood explanation from particular records',
      narrative:
        'Keep the 1907 print separate from archaeological evidence of neighborhoods, making and local environmental change. Ask which observations support a proposed explanation and which people or tasks remain unknown. Changing settlement patterns do not establish the disappearance of a people; attributed contemporary perspectives supply their own contexts.',
    },
    {
      subject: 'ocmulgee-council',
      object: 'ocmulgee-earthlodge-feature-plan',
      year: 1200,
      title: 'Date materials and keep building histories distinct',
      narrative:
        'Use the published feature drawing to distinguish surviving floor features, fallen roof material and a later reconstructed shelter. The roof-wood constraint after about 1160 does not supply a completion day. A separately modeled maize sample concerns the Middle Plateau rather than use of this room. The disputed case retains its unknown endpoints, while current Muscogee statements explain continuing relationships.',
    },
  ],
  conclusion:
    'Buildings, food and materials reveal work at different scales. Explain a particular observation through its site, sample, date and source. Then ask how the explanation changes when another record or an attributed community account enters the inquiry. Neither a single building nor a display interval supplies the whole history of a people.',
  evidence: {
    prompt: 'Which explanation uses the supplied Pueblo Bonito plan carefully?',
    options: [
      {
        text: 'Its drawn room groupings can be compared with archaeological descriptions of building and habitation; the later sheet does not identify every ancient occupant.',
        supported: true,
        feedback:
          'The 1850 plan records visible ruins through a particular observer. Separate archaeological evidence can help explain work and use without treating the sheet as a complete occupied phase.',
      },
      {
        text: 'Every room shown was built and occupied at the same time in 1850.',
        supported: false,
        feedback:
          'Publication in 1850 dates the record. The plan does not establish one simultaneous ancient construction or occupation event.',
      },
      {
        text: 'A similar circular feature elsewhere proves that the same governing institution organized both sites.',
        supported: false,
        feedback:
          'A resemblance invites a question. A particular institutional connection needs separately dated and associated evidence.',
      },
    ],
    citations: [
      cite('chaco-plan-1850', 'Inspected Plate 37 / No. 6 and file record'),
      cite(
        'chaco-pueblo-period',
        'Architecture: great houses and smaller habitation sites',
      ),
    ],
  },
  returnPrompt:
    'Name one kind of work, identify its supporting record and ask whose experience or which date remains to be explained.',
  leadObject: 'chaco-plan-1850',
  printSourcesPerPage: 2,
  familyEvidence: {
    title: 'A later drawing, a question about work',
    object: 'chaco-plan-1850',
    text: 'This plan was published in 1850 as a record of ruins at Pueblo Bonito. Rows of room marks surround an open space, with broken areas on one side. Its small labels are the recorder’s words. It does not show every room occupied at one ancient moment.',
    citations: [cite('chaco-plan-1850', 'Inspected source plan and file record')],
    notice: [
      'Find an open space and a row of room marks.',
      'Point to an area the drawing shows as broken or ruined.',
    ],
    claimPrompt:
      'Describe a visible relationship. What other evidence would help explain building, storing food or living in these spaces?',
    returnPrompt:
      'Return with a new question about how people built, provisioned or maintained a place.',
    feedback:
      'The drawing supports observations about its room marks, open space and recorded ruins. Explaining particular workers, food stores, room uses and ancient dates requires additional evidence.',
  },
};

export function applyCommunitiesWork(c: Corpus): void {
  applyCommunitiesChaco(c);
  applyCommunitiesCahokia(c);
  applyCommunitiesOcmulgee(c);
  for (const media of [chacoHistoricalPlan, ocmulgeeFeaturePlanDraft]) {
    c.media.push(media);
    c.subjects.find((s) => s.id === media.subject)!.objectIds.push(media.id);
  }
  for (const [id, dimension] of [
    ['chaco-communities', chacoWorkDimension],
    ['cahokia-city', cahokiaWorkDimension],
    ['ocmulgee-council', ocmulgeeWorkDimension],
  ] as const) {
    const subject = c.subjects.find((s) => s.id === id)!;
    subject.dimensions = { 'place-work': dimension, ...subject.dimensions };
    subject.dimensionKeys = Object.keys(subject.dimensions);
  }
  c.glossary.push({
    id: 'masonry',
    name: 'Masonry',
    definition:
      'Building with stone, brick or similar units. Facing stones and a rubble core can perform different tasks within one wall; its materials alone do not identify every builder or the institution organizing the work.',
  });
  const chaco = c.subjects.find((s) => s.id === 'chaco-communities')!;
  chaco.terms = [...new Set([...chaco.terms, 'masonry'])];
  c.journeys.push(journey);
  const pack = c.packs.find((p) => p.id === 'C6')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['cahokia-city', 'ocmulgee-council'],
      start: 700,
      end: 1715,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Three distinct North American settings retain their original qualified locators. A Chaco ruin plan and an Ocmulgee feature drawing concern particular buildings; neither supplies a route between the cases or a new surveyed map.',
      limits:
        'Selected building, food and material inquiries, not complete societal histories. All full case intervals remain; Ocmulgee’s disputed endpoints remain unknown. Modern depictions, archaeological samples and attributed living relationships have separate dates and evidentiary scopes.',
    },
  ];
}
