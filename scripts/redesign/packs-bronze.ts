import type { Pack } from '../../src/atlas/model';
export const bronzePack: Pack = {
  id: 'C2',
  title: 'Networks, resources and disruption',
  start: -2000,
  end: -1000,
  anchor: -1200,
  question:
    'How did regional societies interact, depend on resources and respond to disruption?',
  orientation:
    'Copper, tin, pottery, food and stories moved through particular networks. Communities also depended on landscapes, institutions and skilled work. Around 1200 BCE some eastern Mediterranean political centers changed dramatically. That regional investigation belongs beside other histories, with evidence for both disruption and continuity.',
  journey: 'networks-disruption',
  comparison: ['hattusha-change', 'uluburun'],
  geography:
    'The main network case lies in Anatolia and the eastern Mediterranean. Move separately to the Nile, China, Mesoamerica and island Oceania. Earlier Caral and Dholavira contexts remain accessible where their occupation ranges overlap this window.',
  limits:
    'This chapter is selective. It does not establish one universal Bronze Age, a single cause of political change, or a global event in one exact year. European, inland South Asian and African regions beyond the selected Nile case need fuller accounts.',
  coverage: {
    Americas: {
      status: 'limited',
      reason:
        'Olmec material and later Caral occupation; other American communities are not represented equally.',
      subjects: ['olmec', 'caral'],
    },
    Africa: {
      status: 'limited',
      reason:
        'Kerma-Egypt exchange and craft evidence; other African regions require separate histories.',
      subjects: ['kerma-potters'],
    },
    Europe: {
      status: 'limited',
      reason:
        'Aegean connections appear in the excavators’ interpretation of Uluburun cargo and personal effects. No standalone European society dossier is released for this window.',
      subjects: ['uluburun'],
    },
    'West/Central Asia': {
      status: 'researched',
      reason:
        'Uluburun association, Hattusha archaeology and a primary drought study test connections and causal limits.',
      subjects: ['uluburun', 'hattusha-change'],
    },
    'South Asia': {
      status: 'limited',
      reason:
        'Dholavira’s later occupation provides an overlap with C1; it is not a full account of regional change after urban transitions.',
      subjects: ['dholavira'],
    },
    'East Asia': {
      status: 'limited',
      reason:
        'Shang ritual evidence and production; no presumption of the same crisis as Anatolia.',
      subjects: ['shang-ritual'],
    },
    'Southeast Asia/Oceania': {
      status: 'researched',
      reason:
        'Lapita pottery, food and settlement evidence provide a non-state island investigation; mainland Southeast Asia remains limited.',
      subjects: ['lapita'],
    },
  },
};
