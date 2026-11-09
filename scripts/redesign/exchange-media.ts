import type { Media } from '../../src/atlas/model';
import { interval } from './content-helpers';
export const exchangeMedia: Media[] = [
  {
    id: 'beta-samati-coins',
    title: 'Five excavated coins from Beta Samati, two views each',
    subject: 'aksum',
    source: 'beta-samati',
    accession: 'Harrower et al. (2019), Figure 4; excavation Area A',
    creator: 'Figure by Ioana A. Dumitru; published by Harrower and colleagues',
    date: interval(
      2019,
      2019,
      'Excavation figure published 2019',
      'Publication date of the modern figure, separate from the coins and their archaeological deposits.',
      'exact',
    ),
    representedDate:
      'Coins span approximately fourth–seventh centuries CE; the source discusses alternative Armah chronology.',
    place:
      'Beta Samati, northern Ethiopia; reported excavated context, not Adulis or the selected Roman bottle’s findspot',
    material:
      'Modern photograph assembling two views of each of five archaeological coins',
    image: '/atlas/media/beta-samati-coins.webp',
    thumbnail: '/atlas/media/beta-samati-coins-thumb.webp',
    width: 1583,
    height: 919,
    printWidthMm: 165,
    alt: 'Five columns of corroded coins on a dark background, with two views per column and a photographic scale below. The source identifies two Armah coins, an anonymous coin, a pre-Christian Ezana coin and an MHDYS coin from left to right.',
    caption:
      'Five coins, each shown on two sides, from Beta Samati. Their issue dates differ; the excavators interpret them with pottery and dated deposits. This is not one issue of 200 CE.',
    printCaption:
      'Five excavated coins, two views each. Different issue dates must be read with deposit context; the figure was published in 2019.',
    notice: [
      'Count five paired columns, rather than ten separate coins.',
      'Compare manufacture, use, deposition and modern excavation dates.',
      'The photographic ruler does not make every screen or print reproduction life-size.',
    ],
    rights: 'CC BY 4.0; Figure 4 from Harrower et al., Antiquity 93 (2019), 1534–1552.',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    credit:
      'Figure by I. Dumitru, in M. J. Harrower et al., Antiquity 93 (2019), Figure 4. © Antiquity Publications Ltd 2019. CC BY 4.0.',
    printCredit:
      'I. Dumitru / Harrower et al., Antiquity 93 (2019), fig. 4. CC BY 4.0.',
    sourceImage:
      'https://static.cambridge.org/binary/version/id/urn:cambridge.org:id:binary-alt:20191209150711-56673-optimisedImage-S0003598X1900084X_fig4.jpg',
    depiction: 'object photograph',
    relevance:
      'Provides an excavated Aksumite example for questions about coin types, object dates, deposition and local work. The Roman bottle remains a separate type comparison.',
  },
];
