import type { Corpus, PlaceStudy } from '../../src/atlas/model';
import { cite } from './content-helpers';
const studies: Record<string, PlaceStudy> = {
  'qin-administration': {
    title: 'Qin: a capital, a royal project and a county archive',
    description:
      'Three approximate locators distinguish institutions at different scales. Liye is the excavated archive site; Xianyang is the capital orientation and the Lishan tomb a separate royal project. No imperial boundary, road or movement of a particular document is reconstructed.',
    bounds: [107.8, 27.8, 110.7, 35.3],
    points: [
      {
        id: 'xianyang',
        label: 'Xianyang — capital orientation',
        coordinates: [108.8, 34.4],
        text: 'UNESCO relates the mausoleum’s layout to the Qin capital Xianyang. This is a broad capital-area locator, not a surveyed palace precinct.',
        citations: [cite('qin-mausoleum', 'Criterion iv: Xianyang')],
      },
      {
        id: 'lishan',
        label: 'Lishan — royal mausoleum',
        coordinates: [109.25, 34.38],
        text: 'The mausoleum project began before the imperial case window. A tomb’s material program and the work of an administrative county archive are different evidence.',
        citations: [
          cite('qin-mausoleum', 'Brief synthesis: location and project chronology'),
        ],
      },
      {
        id: 'liye',
        label: 'Liye / Qianling — excavated records',
        coordinates: [109.3, 28.8],
        text: 'Documents recovered at Liye are associated with Qianling county. They offer a local test of practice, not a sample of every office across the empire. The unprovenanced Yuelu collection is not assigned this findspot.',
        citations: [cite('qin-practice', 'Printed pp. 147–150')],
      },
    ],
    features: [],
  },
  'ashoka-messages': {
    title: 'Ashoka: regional audiences and different messages',
    background: 'coastline',
    description:
      'Selected inscription settings and a capital orientation. The map distinguishes a geographic distribution from a territorial outline or messenger’s route. The main atlas locator at Sarnath is one pillar-site context; these points examine other settings.',
    bounds: [63, 15, 89, 35],
    points: [
      {
        id: 'pataliputra',
        label: 'Pataliputra — royal centre',
        coordinates: [85.14, 25.61],
        text: 'Neelis identifies Pataliputra, near modern Patna, as a Mauryan capital. A royal centre does not establish the place where every inscription was drafted or heard.',
        citations: [cite('ashoka', 'Opening paragraph and distribution')],
      },
      {
        id: 'kandahar',
        label: 'Kandahar — Greek and Aramaic material',
        coordinates: [65.71, 31.62],
        text: 'Neelis discusses Greek and Aramaic inscriptions here in the northwestern regional setting. This evidence is not supplied by the 1925 edition, which predates the discoveries.',
        citations: [cite('ashoka', 'Inscriptions and Kandahar')],
      },
      {
        id: 'girnar',
        label: 'Girnar — Rock Edict II',
        coordinates: [70.52, 21.52],
        text: 'The Girnar version announces practical provision, planting and wells. This point locates the inscription setting; it does not map every facility named in the royal claim.',
        citations: [cite('ashoka-edicts-1925', 'Printed pp. 3–4, Girnar II')],
      },
      {
        id: 'dhauli',
        label: 'Dhauli — Separate Edict I',
        coordinates: [85.84, 20.19],
        text: 'The local Separate Edict addresses judicial officials at Tosali. Do not transfer the remorse passage of Major Rock Edict XIII to this rock; the local set substitutes different messages.',
        citations: [
          cite(
            'ashoka-edicts-1925',
            'Printed pp. 95–96 and introduction on regional sets',
          ),
        ],
      },
    ],
    features: [],
  },
  'athens-water': {
    title: 'Athens: public places did different work',
    description:
      'Approximate place locators separate a mixed civic/commercial square, an excavated fountain building and the Assembly’s meeting place. No exact ancient street, household route or simultaneous building plan is drawn. The pictured fountain is not securely identified with this excavated building.',
    bounds: [23.715, 37.969, 23.73, 37.98],
    points: [
      {
        id: 'agora',
        label: 'Agora — work and civic institutions',
        coordinates: [23.723, 37.9754],
        text: 'Commercial, religious and administrative activities shared the Agora. Being present here did not itself confer formal political eligibility.',
        citations: [
          cite('athens-sites', 'Historical description'),
          cite('agora-women', 'Printed pp. 9–11'),
        ],
      },
      {
        id: 'southeast-fountain',
        label: 'Southeast Fountain House — water provision',
        coordinates: [23.7246, 37.9739],
        text: 'The Agora book marks the excavated fountain on its end-of-fifth-century plan. Its possible association with an earlier Würzburg vase is qualified; that vase is not the selected Met hydria.',
        citations: [cite('agora-women', 'Printed map p. 2, feature 8; pp. 6–8')],
      },
      {
        id: 'pnyx',
        label: 'Pnyx — Assembly setting',
        coordinates: [23.7195, 37.9716],
        text: 'The site account distinguishes meetings on the Pnyx from the Agora’s many uses. Formal participation concerned a restricted citizen group, not every person who supplied or worked in the city.',
        citations: [
          cite('athens-sites', 'Pnyx and Agora'),
          cite('athens-constitution', 'Parts 42–43'),
        ],
      },
    ],
    features: [],
  },
};
export function applyGovernmentPlaces(corpus: Corpus) {
  for (const [id, study] of Object.entries(studies))
    corpus.subjects.find((s) => s.id === id)!.placeStudy = study;
}
