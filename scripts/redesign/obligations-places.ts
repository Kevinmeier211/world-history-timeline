import type { Corpus, PlaceStudy } from '../../src/atlas/model';
import { cite } from './content-helpers';
const studies: Record<string, PlaceStudy> = {
  'song-art': {
    title: 'Two Song capital areas, separate from a bowl’s provenance',
    description:
      'Approximate modern city-area locators distinguish northern and southern court settings. They are not the bowl’s findspot, kiln or itinerary. No historical boundary or ceramic shipment is traced.',
    bounds: [112.5, 29, 122.3, 36.2],
    background: 'coastline',
    points: [
      {
        id: 'kaifeng',
        label: 'Kaifeng / Bianliang — northern capital area',
        coordinates: [114.31, 34.8],
        text: 'The Northern Song capital before the 1127 loss to Jurchen Jin. A city-area point does not locate a particular office or the selected bowl.',
        citations: [
          cite('song', 'Northern capital'),
          cite('song-phases', '1125–1234 entry'),
        ],
      },
      {
        id: 'hangzhou',
        label: 'Hangzhou — southern capital area',
        coordinates: [120.16, 30.27],
        text: 'Southern Song court setting after the northern loss. The modern generalized coast is orientation, not a reconstructed twelfth-century shoreline.',
        citations: [cite('song-phases', 'Southern Song and Hangzhou')],
      },
    ],
    features: [],
  },
  'mali-networks': {
    title: 'Niger-region settlements: older work and changing powers',
    description:
      'Approximate settlement-area points distinguish Jenne-jeno, Timbuktu and Gao. They do not reconstruct a Mali capital, fixed boundary or caravan itinerary. Cairo and Majorca, named in the account, lie outside this regional view.',
    bounds: [-5.5, 12.5, 1.4, 18.2],
    points: [
      {
        id: 'jenne-jeno',
        label: 'Jenne-jeno — older urban history',
        coordinates: [-4.55, 13.89],
        text: 'A deliberately rounded site-area locator for a long-lived settlement studied archaeologically. Its urban development preceded the selected Mali frame; no particular pot or workshop is pinpointed.',
        citations: [cite('sahel', 'Ancient Mali; Archaeology')],
      },
      {
        id: 'timbuktu',
        label: 'Timbuktu — scholarly and political histories',
        coordinates: [-3, 16.77],
        text: 'The exhibition links Musa’s return with Islamic study and later describes changing power. The point is not a certain imperial capital or a surveyed medieval outline.',
        citations: [cite('sahel', 'Islam; Songhay')],
      },
      {
        id: 'gao',
        label: 'Gao — distinct settlement and later power',
        coordinates: [-0.05, 16.27],
        text: 'A major exchange setting with histories before and beyond the Mali frame. Shared regional orientation does not make each settlement governed identically.',
        citations: [cite('sahel', 'Songhay')],
      },
    ],
    features: [],
  },
  'inca-weaving': {
    title: 'An Andean household study, separate from the tunic',
    description:
      'Approximate locators orient Cusco and the Yanawilka/Vilcashuamán research region. They are not the selected tunic’s findspot or an inferred journey. No royal road or food route is traced; the tunic’s broader existing Peru point stays distinct.',
    bounds: [-75, -14.4, -71.2, -12.9],
    points: [
      {
        id: 'cusco',
        label: 'Cusco — capital area',
        coordinates: [-71.97, -13.52],
        text: 'A religious and political center in the museum synthesis. This city-area locator does not place a particular weaving household.',
        citations: [cite('inka-regional', 'Ambiente y Localización')],
      },
      {
        id: 'yanawilka',
        label: 'Yanawilka — studied household settlement',
        coordinates: [-73.989, -13.626],
        text: 'Rounded from the article’s site coordinates. Four excavated domestic structures supplied tools for starch study; no connection to the Met tunic is demonstrated.',
        citations: [cite('yanawilka-food', 'Introduction coordinates; Methods')],
      },
      {
        id: 'vilcashuaman',
        label: 'Vilcashuamán — provincial center',
        coordinates: [-73.95, -13.65],
        text: 'Approximate town-area locator near the study settlement. The article distinguishes the center, nearby stores and Yanawilka; these points do not reconstruct a surveyed ancient boundary.',
        citations: [cite('yanawilka-food', 'Landscape and settlement location')],
      },
    ],
    features: [],
  },
};
export function applyObligationPlaces(corpus: Corpus) {
  for (const [id, study] of Object.entries(studies))
    corpus.subjects.find((s) => s.id === id)!.placeStudy = study;
}
