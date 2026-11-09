/** Local cities continuation from the sealed workshops checkpoint. */
import type { Corpus, Journey } from '../../src/atlas/model';
import { cite } from './content-helpers';
import { applyCitiesIsfahanPlaces } from './c7-isfahan-places';
import { applyCitiesIsfahan, isfahanUrbanWorkDimension } from './cities-isfahan';
import { applyCitiesBukhara, bukharaWorkDimension } from './c7-bukhara';
import { applyCitiesZand, zandCitiesDimension } from './c7-zand';

const journey: Journey = {
  id: 'households-books-city-work',
  title: 'Households, books and city work',
  question: 'Whose work supported city life?',
  duration: '20–30 minutes',
  introduction:
    'Compare a manuscript folio, a carpet and a dressing case with separately sourced accounts of teaching, water, correspondence and building. Each object has its own production history. The comparison does not establish contact among these objects, a shared workshop or a route between the stops.',
  stops: [
    {
      subject: 'bukhara-books',
      object: 'met-452671',
      year: 1530,
      title: 'Separate a painted reception from the work supporting a city',
      narrative:
        'The catalogue distinguishes a manuscript probably copied in Herat from its later illustration, probably in Bukhara. The painting makes patterns and arrangements visible. Other records explain teaching, endowed property and water maintenance; a literary scene does not identify every worker or household’s access to these resources.',
    },
    {
      subject: 'isfahan-silk',
      object: 'met-451028',
      year: 1700,
      title: 'Read commercial coordination alongside forced relocation',
      narrative:
        'Keep the carpet’s uncertain individual production centre separate from Isfahan and New Julfa’s documented urban relationships. Coercion in 1604 and settlement in 1605 preceded particular later commercial and household records. A 1700 merchant letter and a 1747 family letter, later than the 1598–1722 case, expose coordination and separation; neither identifies this carpet’s weavers, buyer or shipment.',
    },
    {
      subject: 'zand-iran',
      object: 'met-681122',
      year: 1789,
      title: 'Keep an object’s attribution distinct from a political reference',
      narrative:
        'The case is dated 1789, after Karim Khan’s death. Its supplied views show painted outer surfaces, a mirror and fitted storage. The catalogue describes an inner-lid gathering absent from these views. Separately dated accounts of building, merchants and artisans in Shiraz do not locate this case’s workshop or establish universal prosperity.',
    },
  ],
  conclusion:
    'Explain one task with a particular source. Then identify whose labor, household or access remains unknown. Material objects, institutional accounts and letters answer different questions; a capital, patron or decorated scene does not stand for all city life.',
  evidence: {
    prompt:
      'What can the supplied Bukhara manuscript photograph and its catalogue establish?',
    options: [
      {
        text: 'The arrangement is visible; the catalogue distinguishes likely copying and painting stages, with qualified places and dates.',
        supported: true,
        feedback:
          'Looking and catalogue research supply different evidence. The literary scene does not become a record of every household or worker.',
      },
      {
        text: 'The reception shows exactly how every household lived and obtained water.',
        supported: false,
        feedback:
          'A selected literary scene cannot establish universal living conditions. Water supply and access require other records.',
      },
      {
        text: 'A manuscript painted in Bukhara proves the three selected objects travelled together.',
        supported: false,
        feedback:
          'A catalogue attribution does not supply a documented shipment or contact among these objects.',
      },
    ],
    citations: [
      cite(
        'met-452671',
        'Catalogue: description, date and qualified copying/painting places',
      ),
    ],
  },
  returnPrompt:
    'Name a supporting task, its source and one person or household whose experience remains unknown.',
  leadObject: 'met-452671',
  printSourcesPerPage: 2,
  familyEvidence: {
    title: 'A book made in stages',
    object: 'met-452671',
    text: 'This photograph shows a painted manuscript page with seated and standing figures among patterned surfaces. The Met distinguishes likely copying in Herat from later illustration, probably in Bukhara. The older poem, copying and painting have separate dates. The literary scene does not represent every household.',
    citations: [
      cite(
        'met-452671',
        'Description; qualified production stages and supplied photograph',
      ),
    ],
    notice: [
      'Find two different patterned surfaces.',
      'Point to a painted object that would require skilled work; keep its unseen maker unknown.',
    ],
    claimPrompt:
      'Describe a visible pattern. Which source identifies the likely copying and painting places?',
    returnPrompt:
      'Return with a question about a task or household the picture cannot explain.',
    feedback:
      'The arrangement is visible. The making stages and qualified places come from catalogue research. This literary scene does not identify every maker or household.',
  },
};

export function applyCities(c: Corpus): void {
  applyCitiesIsfahan(c);
  applyCitiesIsfahanPlaces(c);
  applyCitiesBukhara(c);
  applyCitiesZand(c);
  // Descriptions are specific to the unchanged supplied views; catalogue text
  // about the unpictured inner surface remains explicitly attributed.
  Object.assign(
    c.media.find((row) => row.id === 'met-681122')!,
    {
      alt: 'Bird-and-flower decorated case shown with its mirror exposed and a fitted drawer partly extended.',
      caption:
        'Muhammad Baqir’s Iranian case is dated 1204 AH/1789 CE. These views show outer birds and flowers, a mirror and fitted dressing storage. The catalogue also describes an inner-lid courtly gathering, which these photographs do not show. No secure Shiraz workshop, purchaser or actual depicted event is established.',
      printCaption:
        'Dated 1789, after Karim Khan’s death. These views show birds, flowers, a mirror and fitted storage. The catalogue’s inner-lid gathering is absent here; a secure Shiraz workshop remains unknown.',
      additionalImageAlts: [
        'Birds among flowers and foliage on the bordered rectangular case lid.',
        'Empty fitted drawer with shaped recesses for dressing implements and painted borders.',
      ],
    },
  );
  for (const [id, dimension] of [
    ['isfahan-silk', isfahanUrbanWorkDimension],
    ['bukhara-books', bukharaWorkDimension],
    ['zand-iran', zandCitiesDimension],
  ] as const) {
    const subject = c.subjects.find((row) => row.id === id)!;
    subject.dimensions = { 'place-work': dimension, ...subject.dimensions };
    subject.dimensionKeys = Object.keys(subject.dimensions);
  }
  c.journeys.push(journey);
  const pack = c.packs.find((row) => row.id === 'C7')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['isfahan-silk', 'bukhara-books'],
      start: 1500,
      end: 1794,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'Separate urban settings retain their source-qualified locators and verbal relationships. No route, neighborhood boundary, object workshop or household location is reconstructed from this comparison.',
      limits:
        'Selected letters, making, teaching, endowment, maintenance and political references; not complete urban or household histories. Full case and object intervals remain distinct from the later 1747 letter and the catalogue-described scene absent from supplied Zand views.',
    },
  ];
}
