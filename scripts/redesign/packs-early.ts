import type { Pack } from '../../src/atlas/model';
export const earlyPack: Pack = {
  id: 'C1',
  title: 'Communities, cities and the evidence of work',
  start: -3300,
  end: -2000,
  anchor: -2400,
  question:
    'How do we know about early communities, work, exchange and political organization?',
  orientation:
    'Begin with things people made and places they built. A grain account, a tomb wall, a reservoir, a carved jade and a stone household preserve different kinds of human activity. Some societies built large cities; others organized life differently. Their histories are contemporary without forming a single ladder toward civilization.',
  journey: 'cities-evidence',
  comparison: ['uruk-accounts', 'dholavira'],
  geography:
    'Move among southern Mesopotamia, the Nile Valley, Gujarat, the lower Yangtze, coastal Peru and Orkney. River systems, arid landscapes and island settings invite different questions. The selected object’s place attribution is kept separate from the location of a wider society.',
  limits:
    'This is a selective investigation of archaeological and institutional evidence. Many communities beyond these places are absent. Large monuments and durable materials survive unevenly; they cannot stand for all early human life.',
  coverage: {
    Americas: {
      status: 'limited',
      reason:
        'Caral-Supe supplies substantive Andean material; other American regions are not yet treated in this window.',
      subjects: ['caral'],
    },
    Africa: {
      status: 'limited',
      reason:
        'Old Kingdom Egypt is examined through funerary evidence; wider African farming, pastoral and household histories remain a major extension.',
      subjects: ['old-kingdom'],
    },
    Europe: {
      status: 'limited',
      reason:
        'Skara Brae brings a non-state household setting into view; it is not a survey of European Neolithic communities.',
      subjects: ['skara-brae'],
    },
    'West/Central Asia': {
      status: 'researched',
      reason:
        'Uruk’s accounting and urban work are examined with specific objects and source limits; other cities are not merged into one state.',
      subjects: ['uruk-accounts'],
    },
    'South Asia': {
      status: 'researched',
      reason:
        'Dholavira’s waterworks and workshops plus a regionally attributed Indus seal; the seal is not assigned a false Dholavira findspot.',
      subjects: ['dholavira'],
    },
    'East Asia': {
      status: 'researched',
      reason:
        'Liangzhu’s city, waterworks and jade; city, culture and object chronologies remain separate.',
      subjects: ['liangzhu'],
    },
    'Southeast Asia/Oceania': {
      status: 'not covered',
      reason:
        'No dossier is released for this cell. Farming and community histories here require their own archaeological treatment; later Lapita and Đông Sơn entries are not backdated to fill it.',
      subjects: [],
    },
  },
};
