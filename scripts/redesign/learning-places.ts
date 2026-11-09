import type { Corpus, PlaceStudy } from '../../src/atlas/model';
import { cite } from './content-helpers';
const studies: Record<string, PlaceStudy> = {
  'tang-city': {
    title: 'Chang’an and Luoyang: keep the city examples distinct',
    description:
      'Approximate modern city-area locators orient two settings in the sources. The Chang’an point is not a precise outline of either the Han or Sui/Tang city. The diagram’s ward is conceptual and is not plotted as an excavated neighborhood.',
    bounds: [107.5, 33.8, 113, 35.2],
    points: [
      {
        id: 'changan',
        label: 'Chang’an / Xi’an — capital area',
        coordinates: [108.94, 34.26],
        text: 'Waugh distinguishes the earlier Han city from the Sui rebuilding and Tang capital. This city-area locator does not collapse their boundaries or date modern walls to the Tang.',
        citations: [
          cite('tang-changan', 'Successive city locations and later structures'),
        ],
      },
      {
        id: 'luoyang',
        label: 'Luoyang — the house example’s setting',
        coordinates: [112.45, 34.62],
        text: 'Bai Juyi’s compound example in the NUS summary belongs to Luoyang. It is not a measured Chang’an house or proof that all wards had that arrangement.',
        citations: [cite('tang-wards', 'Bai Juyi paragraph')],
      },
    ],
    features: [],
  },
  'abbasid-craft': {
    title: 'Iraqi settings: two capitals and early Basra',
    description:
      'City-area locators distinguish court locations and a southern production/research region. The map reconstructs no ancient canal, workshop location, empire boundary or journey of the selected bowl.',
    bounds: [42.8, 29.5, 49, 35.5],
    points: [
      {
        id: 'baghdad',
        label: 'Baghdad — founded in 762',
        coordinates: [44.36, 33.31],
        text: 'The capital’s foundation precedes the later manuscript dated 1224. These dates do not describe one unchanged city or institution.',
        citations: [
          cite('abbasid', 'Opening paragraph'),
          cite('met-451400', 'Date and attribution'),
        ],
      },
      {
        id: 'samarra',
        label: 'Samarra — court setting, 836–892',
        coordinates: [43.87, 34.2],
        text: 'A phase of court residence differs from the whole Abbasid frame. Finds or styles associated with Samarra need not have been manufactured there.',
        citations: [
          cite('abbasid', 'Samarra and archaeological survival'),
          cite('basrah-fieldwork', 'Ceramic production evidence'),
        ],
      },
      {
        id: 'early-basra',
        label: 'Al-Zubayr area — early Basra research',
        coordinates: [47.7, 30.4],
        text: 'The deliberately rounded regional point orients Petersen’s early Basra study near al-Zubayr, southwest of the modern city. It is not a particular kiln findspot or precise ancient shoreline.',
        citations: [
          cite('basrah-fieldwork', 'Location and origins, ceramics and survey'),
        ],
      },
    ],
    features: [],
  },
  nalanda: {
    title: 'Nalanda and Tamralipti: two textual settings',
    background: 'coastline',
    description:
      'Approximate locators distinguish Nalanda from the Tamralipti/Tamluk region named in the translated account. The coast is a modern generalized outline, not a reconstructed seventh-century estuary. No journey line or complete route is implied.',
    bounds: [84.8, 21.5, 89, 26.2],
    points: [
      {
        id: 'nalanda',
        label: 'Nalanda — monastic and scholastic remains',
        coordinates: [85.44, 25.14],
        text: 'The locator orients the Bihar site. It does not identify an exact seventh-century room or make the protected boundary the full historical complex.',
        citations: [cite('nalanda', 'Brief synthesis and Integrity')],
      },
      {
        id: 'tamralipti',
        label: 'Tamralipti / Tamluk region — a different monastery',
        coordinates: [88, 22.3],
        text: 'Takakusu identifies Tamralipti with Tamluk. Pages 63–65 describe this setting before turning to Nalanda. The rounded point is regional, not an ancient harbor survey or the exact Bha-ra-ha monastery.',
        citations: [cite('yijing-1896', 'Printed pp. 63–65 and p. 154 note 1')],
      },
    ],
    features: [],
  },
};
export function applyLearningPlaces(corpus: Corpus) {
  for (const [id, study] of Object.entries(studies))
    corpus.subjects.find((s) => s.id === id)!.placeStudy = study;
}
