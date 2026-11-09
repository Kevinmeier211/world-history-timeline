import type { Corpus, Journey } from '../../src/atlas/model';
import { cite } from './content-helpers';
import { applyRegionalColima, colimaAnnotationDraft } from './regional-colima';
import { applyRegionalDongson, dongsonPlaceStudy } from './regional-dongson';
import {
  applyRegionalHopewell,
  hopewellPlaceStudy,
  hopewellMoundCityPlan,
} from './regional-hopewell';

const journey: Journey = {
  id: 'objects-places-associations',
  title: 'Objects, places and associations',
  question: 'How does a documented place change what an object can tell us?',
  duration: '20–30 minutes',
  introduction:
    'Compare a miniature drum, an architectural model and Ohio earthworks. Visible form, recorded deposits and later surveys answer different questions. Their thematic order establishes no contact, route or common political history.',
  stops: [
    {
      subject: 'dongson',
      object: 'met-39209',
      year: -200,
      title: 'Keep an object separate from another find',
      narrative:
        'Inspect the miniature’s scale and visible forms. Then use the selected Vietnam map to compare a drum containing other bronze objects, a presumed burial association and later production evidence. Each record has its own place and date; none establishes this miniature’s workshop or purpose.',
    },
    {
      subject: 'colima',
      object: 'met-317600',
      year: 1,
      title: 'Distinguish visible architecture from proposed use',
      narrative:
        'Find the roof, opening and raised platform using the modern notes. The catalogue proposes an incense-burner lid. Regional offerings and the excavated Huitzilapa tomb supply comparisons, while this model retains an unknown precise findspot and two published date ranges.',
    },
    {
      subject: 'hopewell-earthworks',
      object: 'hopewell-moundcity-1848',
      year: 300,
      title: 'Read the place and the date of a record',
      narrative:
        'Compare the Mound City survey with its separately dated restored-site photograph. The existing North Fork Works plan represents Hopewell Mound Group, a different site. Construction evidence at Hopeton and named contemporary Miami voices add distinct kinds of knowledge without making the surveys ancient eyewitness views.',
    },
  ],
  conclusion:
    'A useful explanation connects a particular claim with the evidence that can test it. A visible roof supports observation; a documented deposit supplies an association; a survey records a landscape at a later time. Keep an object’s unknown history open, and identify the people and methods behind later interpretation and care.',
  evidence: {
    prompt: 'Which claim is best supported by the supplied Colima evidence?',
    options: [
      {
        text: 'The photographed model has a roof and platform; the catalogue proposes that it may have been an incense-burner lid.',
        supported: true,
        feedback:
          'This distinguishes visible features from a qualified catalogue interpretation. Neither step supplies an exact tomb or an associated burner body.',
      },
      {
        text: 'Because another shaft tomb was excavated at Huitzilapa, this model came from that tomb.',
        supported: false,
        feedback:
          'A documented regional comparison does not transfer its findspot to a different object.',
      },
      {
        text: 'Similar model buildings demonstrate one government across western Mexico.',
        supported: false,
        feedback:
          'Shared forms can coexist with regional and political differences. A style is not a recovered constitution or boundary.',
      },
    ],
    citations: [
      cite('met-317600', 'Description; existing photograph'),
      cite('colima-huitzilapa-1996', 'Publisher abstract'),
      cite('colima-western-polities-2026', 'Political organization paragraphs'),
    ],
  },
  returnPrompt:
    'Choose one claim, identify its supporting object or place record, and ask for one additional source that could test it.',
  leadObject: 'met-317600',
  printSourcesPerPage: 2,
  familyEvidence: {
    title: 'See a roof. Test a use.',
    object: 'met-317600',
    text: 'The photograph shows a ceramic roof, opening and platform. The Met suggests a possible incense-burner lid. The consulted catalogue supplies no precise excavation findspot, associated burner body or residue result.',
    citations: [cite('met-317600', 'Description; existing photograph')],
    notice: [
      'Find the roof, opening and platform in the photograph.',
      'Separate what is visible from the proposed lid interpretation.',
    ],
    claimPrompt:
      'Make one claim you can show or support with the capsule. Name a further discovery that could test the proposed use.',
    returnPrompt:
      'Return to another object or place and ask which part of its history is observed, recorded or still unknown.',
    feedback:
      'The roof is visible. Lid use is a qualified interpretation. An associated burner body or securely documented use context could help test it; an exact tomb and common regional government are not supplied.',
  },
};

export function applyRegionalContexts(c: Corpus): void {
  applyRegionalDongson(c);
  applyRegionalColima(c);
  applyRegionalHopewell(c);
  c.subjects.find((s) => s.id === 'dongson')!.placeStudy = dongsonPlaceStudy;
  c.subjects.find((s) => s.id === 'hopewell-earthworks')!.placeStudy =
    hopewellPlaceStudy;
  c.media.push(hopewellMoundCityPlan);
  c.subjects
    .find((s) => s.id === 'hopewell-earthworks')!
    .objectIds.push(hopewellMoundCityPlan.id);
  const model = c.media.find((m) => m.id === 'met-317600')!;
  model.hasAnnotations = true;
  model.licenseUrl = 'https://creativecommons.org/publicdomain/zero/1.0/';
  model.annotations = {
    createdOn: '2026-10-29',
    credit: 'Chronos / Codex, 2026.',
    rights:
      'Modern annotations: CC BY 4.0. The underlying photograph has separate credit and rights.',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    items: colimaAnnotationDraft,
  };
  model.caption +=
    ' Three numbered modern notes point to visible architecture on the unchanged photograph; they do not reconstruct missing rooms or prove the proposed use.';
  model.printCaption =
    'Architectural model; possible incense-burner lid. Modern notes locate visible features.';
  c.journeys.push(journey);
  c.glossary.push({
    id: 'find-context',
    name: 'Find context',
    definition:
      'The recorded place and associations in which something was found, including its position, surrounding material and relationship to other features. A regional style or present museum location does not supply a precise archaeological find context.',
  });
  for (const id of ['dongson', 'colima', 'hopewell-earthworks']) {
    const s = c.subjects.find((s) => s.id === id)!;
    s.terms = [...new Set([...s.terms, 'find-context'])];
    s.dimensions = {
      'place-context': s.dimensions['place-context']!,
      ...s.dimensions,
    };
    s.dimensionKeys = [
      'place-context',
      ...(s.dimensionKeys ?? []).filter((key) => key !== 'place-context'),
    ];
  }
  const pack = c.packs.find((p) => p.id === 'C4')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['colima', 'hopewell-earthworks'],
      start: -500,
      end: 600,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Vietnamese locality/complex references and eight modern Ohio property centers retain distinct roles. The Colima model has no precise documented findspot; no route joins these regions.',
      limits:
        'Case intervals remain distinct. Later Luy Lâu production extends beyond the drum case. Surveys, restoration and contemporary stewardship retain modern dates; the Vietnam map is selected, not a full Southeast Asian distribution.',
    },
  ];
}
