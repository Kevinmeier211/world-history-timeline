import { dossier } from './editorial';
import { metEssay, cite, claim } from './content-helpers';
import type { Source } from '../../src/atlas/model';
export const qinSources: Source[] = [
  metEssay(
    'qin',
    'Qin Dynasty (221–206 BCE)',
    'qin-dynasty-221-206-b-c',
    'Imperial frame and administration; no unverified quantities or claims about uniform implementation.',
    'Department of Asian Art',
    '2000-10',
  ),
  {
    id: 'qin-quan',
    title: 'Eight-catty Bronze Quan',
    institution: 'National Museum of China',
    url: 'https://en.chnmuseum.cn/collections_577/collection_highlights_608/artifacts_handed___down_from_ancient_times_612/202008/t20200827_247511.html',
    type: 'catalogue',
    accessed: '2026-10-26',
    scope:
      'Weight used on a balance; edict inscription from the First Emperor’s 26th year. Modern gram conversion is not generalized to every weight.',
  },
  {
    id: 'qin-measure',
    title: 'Oval Liang Measure by imperial decree of 26th year',
    institution: 'National Palace Museum, Taipei',
    url: 'https://theme.npm.edu.tw/selection/Article.aspx?lang=2&sNo=04001146',
    type: 'catalogue',
    accessed: '2026-10-26',
    scope:
      'Inscribed measure and 221 BCE decree; museum’s221–207 dynastic frame differs from Met 221–206 convention.',
  },
  {
    id: 'qin-practice',
    title:
      'The pragmatics of standardization: document standards and their implementation in Qin administration',
    author: 'Thies Staack',
    institution: 'Bulletin of SOAS 86(1), 147–173, Cambridge University Press',
    url: 'https://doi.org/10.1017/S0041977X23000228',
    type: 'scholarship',
    published: '2023-06-29',
    accessed: '2026-10-26',
    scope:
      'Primary research, abstract, introduction and§4 conclusions: Liye documents, uneven adherence to standards, pragmatic local choices and limits of generalization. No invented quantities or translations.',
  },
];
export const qinSubject = dossier({
  id: 'qin-administration',
  name: 'Qin: a standard and its everyday use',
  aliases: ['First Emperor', 'Qin Shihuangdi', 'Liye'],
  kind: 'period',
  region: 'East Asia',
  place: 'Qin imperial administration; local evidence at Liye, Hunan, China',
  coordinates: [109.3, 28.8],
  geo: 'Liye administrative-document site, not an imperial capital or a reconstructed boundary.',
  dates: [
    -221,
    -206,
    'Imperial Qin frame, 221–206 BCE',
    'Met convention; National Palace Museum and the administrative study use 221–207 BCE. This is a period convention, not an exact date for every surviving object or document.',
  ],
  packs: ['C3'],
  question: 'Does an imperial standard mean everyone followed it in the same way?',
  summary:
    'Qin rulers sought to standardize writing, currency and measures. Inscribed measuring objects make that policy tangible. Wooden administrative documents from Liye reveal another scale of history: the practical decisions of people doing routine government work.',
  sections: [
    [
      'A decree on a working object',
      'The National Museum of China describes a bronze balance weight bearing the First Emperor’s standardization edict. The National Palace Museum records a related decree on a capacity measure, dated to 221 BCE. These are different devices; neither supplies a universal biography of every merchant or official.',
      'qin-quan',
      'Description: balance weight and edict',
    ],
    [
      'Read what the ruler claimed',
      'The Palace Museum’s account of the measure describes an inscription announcing conquest, imperial title and a common standard. Its claim to have brought peace is part of the ruler’s message, not a neutral verdict about everyone’s experience. A policy can be communicated materially without proving universal compliance.',
      'qin-measure',
      'Description and edict content',
    ],
    [
      'Local practice is another question',
      'Staack compares excavated Liye documents with prescribed formats. Some features were followed more consistently than others. His conclusion describes pragmatic choices shaped by local circumstances and central requirements, while warning that other regions need more evidence. Standardization was a process with uneven practice, not a switch that made every office identical.',
      'qin-practice',
      'Abstract;§1 introduction;§4 conclusions',
    ],
  ],
  fact: [
    'Liye documents show uneven adherence to prescribed document standards; the study does not establish identical practice throughout the empire.',
    'qin-practice',
    '§4 conclusions',
  ],
  terms: ['inscription', 'primary-source', 'inference'],
  dimensions: [
    [
      'Authority and participation',
      'Imperial standards expressed central requirements; local officials made practical choices.',
      'qin-practice',
      '§4 conclusions',
    ],
    [
      'Surviving evidence',
      'Inscribed measures document announced standards; administrative documents let researchers test practice.',
      'qin-measure',
      'Edict description',
    ],
  ],
  prompt:
    'What evidence would distinguish an announced standard from the way people used it?',
});

qinSubject.interval.alternatives = [
  {
    label:
      '221–207 BCE in the National Palace Museum label and Staack’s study; this atlas uses the Met’s 221–206 BCE convention.',
    citations: [
      cite('qin-measure', 'Dynasty label'),
      cite('qin-practice', 'Abstract period frame'),
    ],
  },
];
qinSubject.claims.push(
  claim(
    'qin-period-frame',
    'The Met uses 221–206 BCE for imperial Qin; other consulted sources use 221–207 BCE.',
    [cite('qin', 'Essay title'), cite('qin-measure', 'Dynasty label')],
  ),
);
