/** Inspected NDL print metadata; source and derivative provenance are receipted. */
import type { Corpus, Media } from '../../src/atlas/model';

export const tomiokaReelingPrint: Media = {
  id: 'tomioka-reeling-print',
  title: 'Jōshū Tomioka seishijō no zu: Tomioka Silk Mill interior',
  subject: 'tomioka',
  source: 'tomioka-ndl-print',
  accession: '寄別7-4-2-5; NDL Digital Collections PID 1305876',
  creator:
    'Ichiyōsai Kuniteru (Utagawa Kuniteru II), artist; Daikokuya Heikichi, publisher',
  date: {
    start: 1872,
    end: 1872,
    label: '[1872], bracketed NDL catalogue attribution',
    precision: 'approximate',
    note: 'NDL brackets the selected impression as Meiji 5 [1872]. MAFF dates a comparable impression 1873, but the exact copy/state relationship has not been established; that other date does not independently date this NDL copy. No seal/signature transcription or precise publication day is verified. The exact October 1872 mill-opening case is separate. The modern digitization/composition date is unstated.',
  },
  representedDate:
    'An artistic representation of early Tomioka mill work. A particular shift, individual identities and the exact moment represented are unestablished; this is not a photographic exposure date or a measured survey.',
  place:
    'Tomioka, Gunma, Japan, depicted workplace; catalogue publisher in Tokyo. No artist visit or measured room geometry established.',
  material:
    'Color woodblock print (nishiki-e), three-sheet composition; modern digital reproduction',
  image: '/atlas/media/tomioka-reeling-print.webp',
  thumbnail: '/atlas/media/tomioka-reeling-print-thumb.webp',
  width: 1600,
  height: 786,
  printWidthMm: 160,
  alt: 'Published woodblock-print interior with two receding rows of people and reeling equipment on either side of a central passage. Brick walls, windows and repeated blue roof supports enclose the scene; the supplied composition retains visible divisions between its three sheets. This is an artistic depiction, not a photograph.',
  caption:
    'Ichiyōsai Kuniteru’s print arranges workers and equipment in two rows beneath repeated roof supports. NDL catalogues this impression as [1872]; MAFF dates a comparable impression 1873 without establishing the NDL copy’s date. The published depiction supports observation of its drawn arrangement, not a measured floor plan or a photograph of every shift. Individual identities, working hours and freedom remain unestablished; modern digitization date unstated.',
  printCaption:
    'Published interior depiction, NDL attribution [1872]. Workers and equipment form two rows. This is not a photograph or measured plan; a comparable MAFF impression dated 1873 does not independently date this copy.',
  notice: [
    'Find the two rows of workers and equipment and the passage between them.',
    'Describe a roof support. Which questions about a worker’s hours or choices need a different source?',
  ],
  rights:
    'Public domain: PDM status in the NDL IIIF manifest. Separately, NDL’s named-exhibition reproduction guidance permits reuse with source credit. PDM is a rights-status mark, not a newly granted copyright licence.',
  licenseUrl: 'https://www.ndl.go.jp/en/use/reproduction',
  credit:
    'Ichiyōsai Kuniteru (Utagawa Kuniteru II), Jōshū Tomioka seishijō no zu, published by Daikokuya Heikichi; source: National Diet Library, Japan, 寄別7-4-2-5, DOI 10.11501/1305876. Public domain; NDL reproduction terms.',
  printCredit:
    'Ichiyōsai Kuniteru; publisher Daikokuya Heikichi. Source: National Diet Library, Japan, DOI 10.11501/1305876. Public domain; NDL reproduction terms.',
  sourceImage: 'https://ndlsearch.ndl.go.jp/files/imagebank/dc/1305876_1.jpg',
  depiction: 'contemporary document',
  relevance:
    'Makes workers, equipment and a constructed workplace visible through a published representation. Training, employment conditions and enforcement require separately dated records rather than an inference from orderly composition.',
  datingNote:
    'Use the selected NDL impression’s bracketed [1872] attribution. Keep the comparable MAFF 1873 impression, unknown print-state relationship and unknown modern digitization date explicit; do not infer an exact publication day or replace the October 1872 case event.',
};

export function applyIndustryMedia(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'tomioka');
  if (!s) throw Error('Tomioka media candidate requires the inherited case');
  if (!c.sources.some((row) => row.id === tomiokaReelingPrint.source))
    throw Error('Apply the selected Tomioka source module before its media candidate');
  const existing = c.media.find((row) => row.id === tomiokaReelingPrint.id);
  if (existing && JSON.stringify(existing) !== JSON.stringify(tomiokaReelingPrint))
    throw Error('Tomioka candidate ID conflicts with different media metadata');
  if (!existing) c.media.push(tomiokaReelingPrint);
  // The inherited list is empty. Adoption explicitly EXTENDS it; it does not
  // preserve the whole empty list. Existing IDs remain in their prior order.
  s.objectIds = [...new Set([...s.objectIds, tomiokaReelingPrint.id])];
}
