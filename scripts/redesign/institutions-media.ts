import type { Corpus, Media, Source } from '../../src/atlas/model';
import { interval } from './content-helpers';
const ccBy = 'https://creativecommons.org/licenses/by/4.0/';
const ccSa = 'https://creativecommons.org/licenses/by-sa/3.0/';
const source: Source = {
  id: 'institutions-guides',
  title: 'Making and reading evidence: original teaching guides',
  institution: 'Chronos Atlas / Codex',
  author: 'Chronos / Codex',
  url: 'https://creativecommons.org/licenses/by/4.0/',
  type: 'scholarship',
  published: '2026-10-29',
  accessed: '2026-10-29',
  scope:
    'Two original modern SVG guides: shaping, polishing and firing in the Kerma catalogue account, and the distinction between a royal claim, an administrative order and evidence of an outcome. Independent teaching symbols; no source figure, ancient glyph, vessel profile, measured kiln or palace geometry copied or traced. Historical sources remain separately cited in the dossiers. CC BY 4.0 applies to the original artwork, not to every cited source or the separately licensed BSAI/BISI palace plan.',
};
function guide(
  id: string,
  subject: string,
  title: string,
  caption: string,
  notice: string[],
): Media {
  return {
    id,
    subject,
    title,
    source: subject === 'kerma-potters' ? 'met-545772' : 'nimrud-captives-letter',
    accession: 'Chronos original teaching guide, 29 October 2026',
    creator: 'Chronos / Codex; independently drawn teaching symbols',
    date: interval(
      2026,
      2026,
      'Teaching guide made 29 October 2026',
      'Modern creation date, distinct from the historical sources being explained.',
      'exact',
    ),
    representedDate:
      subject === 'kerma-potters'
        ? 'The Met dates the comparison beaker to c. 1802–1640 BCE. The panels explain manufacture without dating an individual firing.'
        : 'A ninth-century BCE royal inscription and a letter assigned to the reign of Tiglath-pileser III (744–727 BCE). The letter has no exact date.',
    place: 'Modern teaching guide; no ancient workshop or record reconstructed',
    material: 'Original SVG diagram',
    image: `/atlas/media/${id}.svg`,
    thumbnail: `/atlas/media/${id}-thumb.webp`,
    width: 600,
    height: 360,
    printWidthMm: 145,
    alt:
      subject === 'kerma-potters'
        ? 'Three panels show a vessel outline under Shape, a polishing tool at the rim under Polish, and heat marks above a dark-topped vessel under Fire. The arrows connect making tasks.'
        : 'An icon of a written claim and an icon of a written order lead to a question mark under Outcome. The arrows ask what additional evidence could show that provisions arrived.',
    caption,
    printCaption:
      subject === 'kerma-potters'
        ? 'Original guide to shaping, polishing and controlled firing; no measured ancient kiln or vessel reconstructed.'
        : 'Original modern guide distinguishing a claim, an order and evidence of an outcome; not an ancient record.',
    notice,
    rights: 'CC BY 4.0; original teaching artwork.',
    licenseUrl: ccBy,
    credit:
      'Chronos / Codex, 2026. Original teaching guide; historical sources cited in dossier.',
    printCredit: 'Chronos / Codex, 2026. Original guide.',
    sourceImage: `/atlas/media/${id}.svg`,
    depiction: 'explanatory diagram',
    relevance:
      'Provides legible modern symbols for an evidence question, with source images and their different rights retained separately.',
    additionalImages: [],
  };
}
const media: Media[] = [
  guide(
    'kerma-making-guide',
    'kerma-potters',
    'Kerma pottery: skilled making',
    'Hand shaping, surface coating/polishing and controlled firing are distinct kinds of work in the Met catalogue account. These generic symbols explain operations; they are not a measured vessel profile, excavated kiln, temperature record or complete firing schedule. Teaching colors do not constitute a material analysis.',
    [
      'Find the three action labels.',
      'Which surface observation could you compare with the photographed vessel?',
    ],
  ),
  guide(
    'institution-evidence-guide',
    'nimrud-palace',
    'Claims, instructions and outcomes',
    'A royal inscription can establish a claim; an administrative letter can establish an instruction. Further evidence is needed to show an outcome. These modern icons are not copies or translations of ancient documents, and the arrows connect questions rather than historical events.',
    [
      'Find the claim, the order and the question.',
      'What evidence would show that supplies were actually received?',
    ],
  ),
  {
    id: 'nimrud-palace-plan',
    subject: 'nimrud-palace',
    source: 'nimrud-palace-project',
    title: 'Northwest Palace: a composite excavated plan',
    accession:
      'Nimrud Project, Image 1; caption cites Oates and Oates 2001, figures 15 and 33',
    creator: 'BSAI/BISI; individual drafter not named in the linked caption',
    date: interval(
      null,
      null,
      'Modern archaeological plan; online image date unstated',
      'The project caption cites a 2001 publication; this does not establish the drawing’s creation date. The composite includes multiple periods of building and later features.',
      'unknown',
    ),
    representedDate:
      'Northwest Palace complex and later features, ninth–seventh centuries BCE; not one 883–859 BCE snapshot',
    place: 'Kalhu / Nimrud, northern Iraq; excavated palace complex',
    material: 'Modern archaeological plan, supplied JPEG converted losslessly to WebP',
    image: '/atlas/media/nimrud-palace-plan.webp',
    thumbnail: '/atlas/media/nimrud-palace-plan-thumb.webp',
    width: 460,
    height: 926,
    printWidthMm: 80,
    alt: 'Tall composite palace plan with room labels, a north arrow, a scale bar to 50 metres and later features labeled at its upper and lower edges.',
    caption:
      'Composite excavated plan of the Northwest Palace complex. The project account identifies throne room B, anteroom F and central courtyard Y. A north arrow points toward the upper edge; the bar marks a scale to 50 m. “Sargon prism” at the top and “Adadnerari III Palace” at the bottom label later features. This is not a single 883–859 BCE snapshot. Small original room labels need zoom; this text supplies the principal reading.',
    notice: [
      'Locate B, F and Y using the caption.',
      'Which labels warn that the drawing includes later features?',
    ],
    rights:
      'CC BY-SA 3.0; BSAI/BISI image released courtesy of BISI through the Nimrud Project.',
    licenseUrl: ccSa,
    credit:
      'BSAI/BISI, via Eleanor Robson, The Northwest Palace, Nimrud Project / Oracc, funded by AHRC. Project caption cites Oates and Oates 2001, figs 15 and 33. Lossless format conversion; drawing uncropped and unaltered.',
    sourceImage:
      'https://oracc.museum.upenn.edu/nimrud/images/ancientcity/nwpalace-plan.jpg',
    depiction: 'explanatory diagram',
    relevance:
      'Pairs the royal relief with a phase-qualified source plan and readable architectural explanation.',
    additionalImages: [],
  },
  {
    id: 'sanam-workshop-view',
    subject: 'taharqo',
    source: 'sanam-production-2026',
    title: 'Sanam: an excavated faience workshop',
    accession: 'Lemos and colleagues 2026, Figure 4',
    creator:
      'Rennan Lemos, Kathryn Howley, Siobhan Shinn and Shadia Abdu Rabo; figure by the authors',
    date: interval(
      2026,
      2026,
      'Excavation view published in 2026; exact photograph date unstated',
      'The article reports 2018–2020 excavations. Publication and fieldwork seasons do not establish the exact acquisition date of this image.',
      'exact',
    ),
    representedDate:
      'Workshop context broadly Early–Middle Napatan; abstract uses mid-seventh-century BCE, while pottery parallels span wider intervals',
    place: 'Sanam, Sudan; excavated production area',
    material: 'Modern annotated orthophoto of an excavation',
    image: '/atlas/media/sanam-workshop-view.webp',
    thumbnail: '/atlas/media/sanam-workshop-view-thumb.webp',
    width: 1063,
    height: 1115,
    printWidthMm: 145,
    alt: 'Annotated excavation photograph showing three firing pits, two basins, collapsed mudbrick and a five-metre scale bar.',
    caption:
      'The excavators annotate three firing pits, two basins and collapsed mudbrick, with a 5 m scale bar. No north arrow is supplied. This modern excavation view supports a spatial account of production; it is not an ancient plan or a picture of a known firing day. The broad workshop chronology does not identify a particular ruler’s commission or establish the origin of the Met granite figure. Original bounds retained without cropping or enhancement.',
    notice: [
      'Find the three pits and two basins.',
      'Which parts are photographed remains and which are the excavators’ annotations?',
    ],
    rights: '© The authors, 2026. CC BY 4.0.',
    licenseUrl: ccBy,
    credit:
      'Lemos, Howley, Shinn and Abdu Rabo, Crafting power in Kush, Antiquity (2026), Figure 4, figure by the authors. DOI 10.15184/aqy.2026.10434. WebP format conversion; original bounds retained.',
    sourceImage:
      'https://static.cambridge.org/binary/version/id/urn%3Acambridge.org%3Aid%3Abinary%3A20261009050642161-0498%3AS0003598X26104347%3AS0003598X26104347_fig4.png?pub-status=live',
    depiction: 'annotated excavation photograph',
    relevance:
      'Makes a material production space visible while retaining the excavators’ chronology and interpretation limits.',
    additionalImages: [],
  },
  {
    id: 'sanam-mould-match',
    subject: 'taharqo',
    source: 'sanam-production-2026',
    title: 'A faience fragment and its matching mould',
    accession: 'Lemos and colleagues 2026, Figure 10',
    creator:
      'Ancient makers not recorded; photograph credited to the article’s authors',
    date: interval(
      null,
      null,
      'Sanam shabti fragment and mould; individual manufacture years unknown',
      'The workshop has a broad archaeological chronology. This uninscribed faience fragment is not assigned to Taharqo or substituted for the Met granite shabti. The photograph was published in 2026; its exact acquisition date is unstated.',
      'unknown',
    ),
    representedDate:
      'Early–Middle Napatan production context, with the article’s different ceramic-dating conventions retained',
    place:
      'Sanam, Sudan. Shabti fragment from the workshop, mould from inside the temple.',
    material: 'Faience fragment and clay negative mould, photographed together',
    image: '/atlas/media/sanam-mould-match.webp',
    thumbnail: '/atlas/media/sanam-mould-match-thumb.webp',
    width: 512,
    height: 469,
    printWidthMm: 100,
    alt: 'Small green uninscribed faience figure fragment at left, matching clay negative mould at right and a segmented scale with no readable unit.',
    caption:
      'The excavators match a faience shabti fragment found in the workshop to a mould found inside the temple. The fragment is uninscribed; it does not name Taharqo. The small original scale has no readable unit, so no centimetre measurement is inferred. This is a different material and object from the selected Met granite figure. The 512-pixel source retains its natural-size ceiling; format conversion adds no recovered detail.',
    notice: [
      'Compare the raised shape with the hollow mould.',
      'Why does a match support making, while leaving the buyer or royal name uncertain?',
    ],
    rights: '© The authors, 2026. CC BY 4.0.',
    licenseUrl: ccBy,
    credit:
      'Lemos, Howley, Shinn and Abdu Rabo, Crafting power in Kush, Antiquity (2026), Figure 10, photograph by the authors. DOI 10.15184/aqy.2026.10434. WebP format conversion; no crop or upscaling.',
    sourceImage:
      'https://static.cambridge.org/binary/version/id/urn%3Acambridge.org%3Aid%3Abinary%3A20261009050642161-0498%3AS0003598X26104347%3AS0003598X26104347_fig10.png?pub-status=live',
    depiction: 'object photograph',
    relevance:
      'Shows a consequential material match without attributing an uninscribed faience object to a named king or granite workshop.',
    additionalImages: [],
  },
];
export function applyInstitutionMedia(c: Corpus) {
  c.sources.push(source);
  c.media.push(...media);
  for (const m of media)
    c.subjects.find((s) => s.id === m.subject)!.objectIds.push(m.id);
  for (const id of ['met-545772', 'met-322614', 'met-544883'])
    c.media.find((m) => m.id === id)!.licenseUrl =
      'https://creativecommons.org/publicdomain/zero/1.0/';
  c.media.find((m) => m.id === 'met-322614')!.alt =
    'Carved gypsum panel showing an eagle-headed winged figure in patterned clothing, holding a bucket beneath a band of cuneiform.';
}
