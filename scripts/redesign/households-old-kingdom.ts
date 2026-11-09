import type { Source, Subject, HistoricalContext } from '../../src/atlas/model';
import { cite } from './content-helpers';
export const oldKingdomSources: Source[] = [
  {
    id: 'giza-settlement',
    title: 'The Lost City of the Pyramids (Heit el-Ghurab)',
    institution: 'Ancient Egypt Research Associates',
    url: 'https://aeraweb.org/projects/lost-city/',
    type: 'archaeology',
    accessed: '2026-10-28',
    scope:
      'Main project account and gallery captions read: Fourth Dynasty settlement, craft/provisioning spaces, administrators, seasonal transport, silos and dismantling. Excavators’ interpretation retained; Khufu association is qualified. Not every linked field report read. No complete household census, individual recruitment status or exact ration quantities established. Giza is separate from the selected Saqqara wall. Source plans/photos not copied; no reusable image licence verified.',
  },
  {
    id: 'giza-provisioning',
    title: 'Feeding Pyramid Workers',
    institution: 'Ancient Egypt Research Associates',
    url: 'https://aeraweb.org/feeding-pyramid-workers/',
    type: 'archaeology',
    accessed: '2026-10-28',
    scope:
      'Main account read: excavated bakeries, molds, vats, hearths, ash, household-scale replication and fuel; 1993 experimental technique/results and admitted recipe/mold limits. Observed remains, reconstructed process and modern experiment distinguished. Not an exact ancient recipe, measured diet for every worker or proof of individual status. Original relationship diagram uses factual tasks; no source figure copied.',
  },
  {
    id: 'giza-cult-town',
    title: 'Khentkawes Town and the Menkaure Valley Temple',
    institution: 'Ancient Egypt Research Associates',
    url: 'https://aeraweb.org/projects/kkt-mvt/',
    type: 'archaeology',
    accessed: '2026-10-28',
    scope:
      'Main project account read: Fourth–Sixth Dynasty orientation, construction/cult settlement interpretation, three temple occupation phases, flood/repair/reuse, cattle longbones in earlier excavation spoil, basin and silo complex. Proposed resident identities, bone interpretation and climate links remain qualified. No precise year assigned to every phase; no universal ending or complete household experience. Photographs/plans not reproduced.',
  },
  {
    id: 'merer-logbook',
    title:
      'The logbook of Merer: selected English annex to Les papyrus de la mer Rouge I',
    institution: 'Institut français d’archéologie orientale, MIFAO 136',
    author: 'Pierre Tallet; English annex translated by Colin Clement',
    url: 'https://www.ifao.egnet.net/uploads/publications/divers/MIFAO136_ann_01.pdf',
    type: 'primary',
    published: '2017 edition; late Khufu-reign records',
    accessed: '2026-10-28',
    scope:
      'Edition title/back-cover and selected English annex printed pp. 149–154 (PDF 5–10) read; printed p. 150 visually inspected. Translation of Papyrus A/B entries and selected synthesis, not Egyptian originals, all French volume, all English annex or reproduced papyrus pixels. Gaps, brackets and uncertain restorations retained. Food passage is a mission to obtain provisions; restored return wording is not made certain. Does not explain raising every block or identify Merer’s crew as Heit el-Ghurab residents. No translation or source figure reproduced.',
  },
];
export const oldKingdomContext: HistoricalContext = {
  id: 'old-kingdom-work-context',
  title: 'Old Kingdom institutions, provisioning and changing service',
  region: 'Africa',
  interval: {
    start: -2649,
    end: -2130,
    label: 'c. 2649–2130 BCE: selected Old Kingdom orientation',
    precision: 'approximate',
    note: 'Uses the current Met essay’s convention, not the lifetime of Egypt or the date of the chapel wall. The wall remains c. 2465–2389 BCE; Giza construction support and later cult service belong to their own phases.',
  },
  summary:
    'Royal building and funerary service required continuing material and administrative work; institutions and political relationships changed across the period.',
  subjectIds: ['old-kingdom'],
  citations: [
    {
      source: 'old-kingdom',
      locator: 'Current title; Dynasty 3–6 sections',
    },
    {
      source: 'giza-settlement',
      locator: 'Fourth Dynasty project account',
    },
    {
      source: 'giza-cult-town',
      locator: 'Fourth–Sixth Dynasty orientation',
    },
  ],
  phases: [
    {
      year: -2649,
      label: 'Dynasty 3, c. 2649–2575 BCE: period convention',
      title: 'Monuments and funerary institutions',
      text: 'The Met frames Djoser’s Saqqara complex within a changing royal and elite funerary landscape. This orientation is earlier than the selected chapel wall.',
      citations: [
        {
          source: 'old-kingdom',
          locator: 'Dynasty 3',
        },
      ],
    },
    {
      year: -2575,
      label: 'Dynasty 4, c. 2575–2465 BCE: broad frame',
      title: 'Construction needs provision',
      text: 'Giza settlements and the late-Khufu logbook reveal distinct kinds of support work. A period anchor does not date one continuous crew or identify Merer’s team with the excavated settlement.',
      citations: [
        {
          source: 'old-kingdom',
          locator: 'Dynasty 4',
        },
        {
          source: 'giza-settlement',
          locator: 'Era and main account',
        },
        {
          source: 'merer-logbook',
          locator: 'Edition metadata; English annex pp. 150–151',
        },
      ],
    },
    {
      year: -2465,
      label: 'c. 2465–2389 BCE: selected wall’s catalogue range',
      title: 'An elite chapel and ongoing service',
      text: 'The Saqqara wall depicts offerings and activities within commemoration. Its purpose and present arrangement differ from an excavated workplace and from a contemporary crew’s administrative entry.',
      citations: [
        {
          source: 'met-543914',
          locator: 'Description; Artwork Details',
        },
      ],
    },
    {
      year: -2323,
      label: 'Later Old Kingdom: Dynasty 6 begins c. 2323 BCE in Met convention',
      title: 'Repair, reuse and changing authority',
      text: 'AERA describes renewed cult buildings and settlement reuse. The Met discusses increasing provincial officials’ prominence and debated political change. Neither source supports one uniform ending for every place.',
      citations: [
        {
          source: 'giza-cult-town',
          locator: 'Rebuilding and reoccupation',
        },
        {
          source: 'old-kingdom',
          locator: 'Dynasty 6 and end of Old Kingdom',
        },
      ],
    },
  ],
};
export function applyOldKingdom(s: Subject) {
  s.summary =
    'An elite chapel wall at Saqqara shows offerings, music and a game. Behind such representations lay work: growing and processing food, moving materials, keeping records and sustaining institutions. Settlement archaeology at Giza and a crew’s logbook open different windows onto that organization, at their own places and dates.';
  s.sections = [
    {
      title: 'Providing for the dead',
      text: 'Nikauhor and Sekhemhathor’s wall belongs to a funerary chapel, not an occupied household. Its false doors marked places for offerings and prayers. Images of offerings were intended to provide for the dead. The museum interprets the pictured senet game as a possible afterlife journey. It also identifies displaced and erased elements: this particular wall changed before reaching its present arrangement.',
      citations: [
        {
          source: 'met-543914',
          locator: 'Description; audio transcript; Artwork Details',
        },
        {
          source: 'old-kingdom',
          locator: 'Dynasty 3 offering chapels; Dynasty 5 daily-life scenes',
        },
      ],
    },
    {
      title: 'A building project needed a town',
      text: 'At Giza, AERA’s excavations investigate a Fourth Dynasty settlement supporting royal construction. Workshops, kitchens, storage areas and administrators’ houses made different tasks depend on one another. Tools needed making and repair; people needed shelter and meals. Materials arrived by waterways during inundation and by other transport at different times. These remains concern Giza, not the selected Saqqara chapel.',
      citations: [
        {
          source: 'giza-settlement',
          locator: 'Main account: crafts, provisioning, transport and royal silos',
        },
      ],
    },
    {
      title: 'Grain was only a beginning',
      text: 'Stored grain still had to become food. Excavated bread molds, floor-set vats, hearths and ash help AERA investigate mixing and baking. The project interprets large production as repeated small bakery units within a royal institution. Preparing meals therefore required equipment, fuel and continuing labor, alongside agricultural production. A silo alone could not feed a workforce.',
      citations: [
        {
          source: 'giza-provisioning',
          locator:
            'Pyramid builders’ diet; Two Giza bakeries; Hearths and depressions; Bakery attachment',
        },
      ],
    },
    {
      title: 'A crew’s days in a record',
      text: 'The logbook associated with Inspector Merer records hauling, loading, sailing and overnight stops while carrying stone from Tura toward Khufu’s project. One entry also records a boat sent to obtain food from Heliopolis. Such administrative writing joins movement to provisioning rather than simply celebrating a finished monument. The surviving record does not explain how every block was raised or establish every crew member’s freedom.',
      citations: [
        {
          source: 'merer-logbook',
          locator:
            'English annex, printed pp. 150–151, Papyrus B sections BI–BIV and summary',
        },
      ],
    },
    {
      title: 'Work continued after construction',
      text: 'Institutions changed as projects ended. AERA interprets settlement near Menkaure’s temple and Khentkawes’ monument as a shift toward maintaining deceased rulers’ cults. Rebuilding, abandonment and reoccupation complicate a single ending story. Ritual service still required buildings, people and supplies. This proposed local sequence is neither the history of every Egyptian settlement nor a precise timetable for every resident.',
      citations: [
        {
          source: 'giza-cult-town',
          locator:
            'Opening settlement interpretation; Menkaure Valley Temple; Khentkawes Town',
        },
      ],
    },
    {
      title: 'Keep the kinds of evidence together',
      text: 'A tomb image, excavated workplace and administrative record reveal different parts of organized work. Read them together without making one stand for the whole period. The Old Kingdom frame contains changing officials, institutions and regional power. Asking who supplied, managed and benefited from work makes those changes more concrete than treating pyramids as timeless symbols.',
      citations: [
        {
          source: 'old-kingdom',
          locator:
            'Introduction; Dynasty 5 social change; Dynasty 6 provinces and debated political change',
        },
      ],
    },
  ];
  s.deeperReading = [
    {
      title: 'An experiment is a further source',
      text: 'In 1993, AERA and National Geographic recreated a bakery near Saqqara to test questions raised by Giza’s remains. The experiment used approximations of ancient molds and tried combinations of flour and yeast. It helped investigate heating and covering pots, but the team acknowledged an unsatisfactory recipe and possible differences in mold thickness. Modern success or failure does not recover one exact ancient meal. Compare the excavated object, the scene used for interpretation and the experimental conditions before deciding what was established.',
      citations: [
        {
          source: 'giza-provisioning',
          locator:
            'Experimental technique; Experimental results; Experimental taste test',
        },
      ],
    },
    {
      title: 'What a translated logbook preserves',
      text: 'The selected English annex is Colin Clement’s translation accompanying Pierre Tallet’s 2017 publication, not a new reading of the Egyptian original. Brackets, gaps and question marks distinguish restoration from surviving words. Repeated days make scheduling and movements legible, while personal experiences remain much less visible. The papyri were found at the Red Sea site of Wadi el-Jarf; entries describing Tura and Giza should not be relocated there. Nor should Merer’s crew simply be identified with the inhabitants of the excavated Giza settlement.',
      citations: [
        {
          source: 'merer-logbook',
          locator:
            'Edition cover/back-cover; English annex pp. 149–154, translation and geographical discussion',
        },
      ],
    },
    {
      title: 'An offering and the people sustaining it',
      text: 'At Menkaure’s temple, AERA recovered predominantly cattle longbone fragments from earlier excavation spoil. The project interprets these as remains of offerings passed on to staff, drawing a connection between royal commitments and material provision. This is an archaeological argument, not a surviving list of everyone’s meals. Redeposited material needs particular caution about context. The example also connects commemoration with daily maintenance: keeping a cult active could sustain people and work long after a ruler’s death, even as buildings were repaired and reused.',
      citations: [
        {
          source: 'giza-cult-town',
          locator:
            'Recovered spoil, cattle bones and interpretation of pekher offerings',
        },
      ],
    },
  ];

  s.contextIds = ['old-kingdom-work-context'];
  s.objectIds = [...s.objectIds, 'giza-provisioning-diagram'];
  s.evidenceReading = {
    title: 'An image, a record and a tested reconstruction',
    introduction:
      'These are editorial summaries and interpretations, not quotations. Follow the precise source locators to distinguish the records.',
    items: [
      {
        label: 'An administrative entry — paraphrase',
        text: 'The selected Merer entry records a crew loading stone, sailing and spending the night at named places. Another entry records a food mission.',
        interpretation:
          'A daily work record reveals tasks and scheduling. Restoration brackets still matter; it is not a construction manual or a measure of every worker’s choices.',
        citations: [
          cite(
            'merer-logbook',
            'English annex, printed p. 150, Papyrus B sections BI–BII',
          ),
        ],
      },
      {
        label: 'Recovered remains and a modern experiment',
        text: 'AERA recovered vats, molds, hearths and ash at Giza. A 1993 experiment tested possible baking arrangements.',
        interpretation:
          'Keep an excavated object, a proposed use and a modern experiment distinct. The team’s admitted recipe and mold differences prevent claiming one recovered exact meal.',
        citations: [
          cite(
            'giza-provisioning',
            'Two Giza bakeries; Experimental technique and results',
          ),
        ],
      },
      {
        label: 'A changing chapel wall',
        text: 'The catalogue identifies offering niches, a displaced stela and traces of an erased scene.',
        interpretation:
          'The wall’s history includes changes and modern arrangement. Visible activities belong to commemoration, rather than a census of occupied households.',
        citations: [cite('met-543914', 'Description and audio transcript')],
      },
    ],
  };
  s.familyActivity = {
    title: 'What else did a building project need?',
    duration: '10–15 minutes',
    steps: [
      'Trace grain storage, preparation and people in the modern provisioning guide. An adult can read the labels aloud.',
      'Name another task needed to turn grain into a meal, using the explanation. Point, talk, draw or write.',
      'Compare that guide with one activity on the chapel wall. Which source would help test how the task was actually performed?',
    ],
    explanation:
      'A finished monument depended on recurring work. The diagram explains relationships; it is not an exact ancient recipe, measured ration or surveyed workplace.',
  };
  s.dimensions.maintenance = {
    text: 'Preparing food, repairing tools and maintaining cult service sustained institutions beyond the moment of construction. Settlement, experiment and administrative evidence remain distinct.',
    citations: [
      cite('giza-provisioning', 'Bakeries and food preparation'),
      cite('giza-cult-town', 'Construction to cult-service interpretation'),
    ],
  };
  s.review = {
    consultedOn: '2026-10-28',
    reviewer:
      'Codex source consultation and self-review; not independent historian approval',
    scope:
      'Bounded main/deeper/evidence account, family task, phased institutional context and original provisioning guide, preserving the selected Saqqara wall and case interval.',
    limitations: [
      'This is not a comprehensive account of farming, gender, recruitment, provincial institutions or every worker’s legal status.',
      'The translated logbook and Giza settlement are separate records; the identity of their crews is not established.',
      'AERA project interpretations and modern bakery experiment remain attributed; no exact ancient recipe, complete ration schedule or universal ending is claimed.',
      'The chapel’s catalogue date, period convention, later excavation and modern diagram creation date remain distinct.',
    ],
  };
}
