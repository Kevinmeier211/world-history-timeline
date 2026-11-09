import { dossier } from './editorial';
import { cite } from './content-helpers';
import type { Journey, Source, Subject } from '../../src/atlas/model';
const accessed = '2026-10-27';
const source = (
  id: string,
  title: string,
  institution: string,
  url: string,
  scope: string,
  author?: string,
  type: Source['type'] = 'scholarship',
): Source => ({ id, title, institution, url, scope, author, type, accessed });
export const westCentralSources: Source[] = [
  source(
    'stonepaste-tech',
    'Ceramic Technology in the Seljuq Period: Stonepaste in Syria and Iran in the Eleventh Century',
    'The Metropolitan Museum of Art',
    'https://www.metmuseum.org/essays/seljuq-stonepaste-syria-iran-eleventh-century',
    'Rugiadi, 2021. Opening technical definition of quartz, glass frit and refined clay; used for material explanation and glossary, not to date the later Iznik object.',
    'Martina Rugiadi',
  ),
  source(
    'ottoman-before',
    'The Art of the Ottomans before 1600',
    'The Metropolitan Museum of Art',
    'https://www.metmuseum.org/essays/the-art-of-the-ottomans-before-1600',
    'Yalman/Komaroff, 2002. Paragraphs on rebuilding Istanbul, multifunctional foundations, Sinan and provincial production centers. Evaluative superlatives are not adopted.',
    'Suzan Yalman, based on Linda Komaroff',
  ),
  source(
    'ottoman-after',
    'The Art of the Ottomans after 1600',
    'The Metropolitan Museum of Art',
    'https://www.metmuseum.org/essays/the-art-of-the-ottomans-after-1600',
    'Sardar, 2003. Court payments and makers’ open-market incentives; Ahmet III’s patronage and the 1748–55 Nur-u Osmaniye Mosque. The broad decline narrative is not treated as a universal account.',
    'Marika Sardar',
  ),
  source(
    'isfahan-capital',
    'Isfahan vii. Safavid Period',
    'Encyclopaedia Iranica XIII/6, pp650–657',
    'https://www.iranicaonline.org/articles/isfahan-vii-safavid-period/',
    'Sections Isfahan as the Safavid Capital and new commercial center: 1597–98 proclamation, mobile court, square, shops, caravansaries and bazaar. Political capital is not identical to permanent royal residence.',
    'Masashi Haneda and Rudi Matthee',
  ),
  source(
    'isfahan-art',
    'Shah ‘Abbas and the Arts of Isfahan',
    'The Metropolitan Museum of Art',
    'https://www.metmuseum.org/essays/shah-cabbas-and-the-arts-of-isfahan',
    'Sardar, 2003. Capital transfer, workshops and patronage. Its abbreviated relocation account is read with Ghougassian’s documented coercion; not used to claim voluntary migration or an exact number of potters.',
    'Marika Sardar',
  ),
  source(
    'safavid-silk',
    'Silk Textiles from Safavid Iran, 1501–1722',
    'The Metropolitan Museum of Art',
    'https://www.metmuseum.org/essays/silk-textiles-from-safavid-iran-1501-1722',
    'Munroe, 2012. Urban/private workshops, northern raw-silk producers, court workshops, weavers/dyers/embroiderers and weaving techniques. Later aesthetic-decline judgments are not adopted as fact.',
    'Nazanin Hedayat Munroe',
  ),
  source(
    'julfa-forced',
    'Julfa i. Safavid Period',
    'Encyclopaedia Iranica XV/2–3, pp217–231',
    'https://www.iranicaonline.org/articles/julfa-i-safavid-period/',
    'Origin, settlement, and population; 1604 deportation and 1605 New Julfa construction; trade, privileges and later restrictions. Broad deportee totals are not repeated as settled quantities.',
    'Vazken S. Ghougassian',
  ),
  source(
    'bukhara-unesco',
    'Historic Centre of Bukhara',
    'UNESCO World Heritage Centre',
    'https://whc.unesco.org/en/list/602/',
    'Brief synthesis: sixteenth-century rebuilding, commercial structures and seventeenth-century institutions; inherited earlier monuments distinguished from later building.',
    '',
    'archaeology',
  ),
  source(
    'bukhara-monuments',
    'Bukhara v. Archaeology and Monuments',
    'Encyclopaedia Iranica IV/5, pp525–527',
    'https://www.iranicaonline.org/articles/bukhara-v/',
    'Shaibanid 1500–98 and Janid 1599–1785 periods: bazaar/caravansary/reservoir construction, Mir-i Arab 1535–36, Qush Madrasa 1566–67/1589–90, textile merchants and restoration.',
    'Galina A. Pugachenkova and Edvard V. Rtveladze',
    'archaeology',
  ),
  source(
    'zand-history',
    'Zand Dynasty',
    'Encyclopaedia Iranica',
    'https://www.iranicaonline.org/articles/zand-dynasty/',
    'Perry, 2000/updated 2016. 1751–94 dynasty, Karim Khan 1751–79, Shiraz residence from 1765, limits of rule, commercial policy, warfare and succession.',
    'John R. Perry',
  ),
  source(
    'zand-karim',
    'Karim Khan Zand',
    'Encyclopaedia Iranica XV/6, pp561–564',
    'https://www.iranicaonline.org/articles/karim-khan-zand/',
    'The Wakil at Shiraz, 1765–79; title and political limits; merchants, rebuilding, gardens, bazaar and artisans. Courtly reminiscence is attributed, not used as evidence of universal prosperity.',
    'John R. Perry',
  ),
];
export const westCentralSubjects: Subject[] = [
  dossier({
    id: 'ottoman-workshops',
    name: 'Ottoman workshops: writing, clay and markets',
    aliases: ['Ottoman Empire', 'Istanbul', 'Iznik', 'Suleiman', 'Süleyman', 'Sinan'],
    kind: 'period',
    region: 'West/Central Asia',
    place: 'Istanbul and Iznik, present-day Türkiye; locator at Istanbul',
    coordinates: [28.978, 41.008],
    geo: 'Capital/workshop context, not an Ottoman territorial polygon or a precise route between individual makers.',
    dates: [
      1500,
      1755,
      'Selected Ottoman art and urban contexts, c. 1500–1755',
      'A bounded investigation of sixteenth-century work, seventeenth-century markets and eighteenth-century building, ending with the cited 1748–55 mosque example. These are not the Ottoman Empire’s founding or dissolution dates.',
    ],
    packs: ['C7'],
    question:
      'How did skilled work serve both public authority and people buying things?',
    summary:
      'A calligraphic emblem, a painted dish and a mosque complex belonged to different kinds of work in Ottoman society. Court patronage mattered, but the empire’s makers were not all confined to a palace. Istanbul, Iznik and other centers supported production, exchange and religious institutions. Looking at the objects closely helps separate a ruler’s claims from the decisions and labor of those who made and used them.',
    sections: [
      [
        'Making authority visible',
        'A tughra was an emblem used on official documents and other expressions of a sultan’s authority. The Met explains that a specialist drew its standard form and an illuminator could decorate it. In the example associated with Süleyman, writing and ornament work together. Its phrase of victory is evidence of royal representation, not independent proof that a ruler always won, or that every reader could interpret the emblem easily.',
        'met-449533',
        'Description: content, specialist draughtsman and illuminator; visible catalogue date c1555–60',
      ],
      [
        'A dish is not a decree',
        'Iznik makers used stonepaste and painted decoration beneath a transparent glaze. The two-bird dish is dated c1575–90, although the API’s search envelope is wider. The museum’s discussion describes adaptation of admired Chinese ceramics into distinctive local forms and colors. That supports a history of artistic exchange, not a claim that this dish was made in China or that its particular buyer is known.',
        'met-451490',
        'Artwork Details and audio transcript, Overview: Iznik Ceramics',
      ],
      [
        'Cities, institutions and work',
        'The Ottoman capital’s building programs combined worship, education, social provision and commercial activity. Provincial centers mattered too: the Met identifies Iznik ceramics and Bursa silks rather than assigning all production to Istanbul. Buildings required many kinds of work beyond the celebrated designer. Court commissions and pious foundations can be investigated through their institutions; the fame of a patron does not tell us every worker’s conditions.',
        'ottoman-before',
        'Istanbul rebuilding, multifunctional complexes, Sinan and provincial artistic/commercial centers',
      ],
      [
        'Markets and changing patronage',
        'Sardar’s account of the seventeenth century describes makers finding open-market work more rewarding than court payments that had not kept pace. Its broad economic explanation should not be mistaken for the complete history of every workshop. Eighteenth-century rulers continued commissioning books, fountains and mosques; the Nur-u Osmaniye was built in 1748–55. This changing record is more useful than an unbroken golden-age-then-decay story.',
        'ottoman-after',
        'Court prices and open-market incentives; Ahmet III and Nur-u Osmaniye, 1748–55',
      ],
    ],
    fact: [
      'The visible catalogue dates the Iznik dish c1575–90 and the tughra c1555–60; the museum API’s wider search envelopes do not replace these object dates.',
      'met-451490',
      'Visible date and Artwork Details',
    ],
    objects: ['met-451490', 'met-449533'],
    terms: ['patronage', 'stonepaste', 'tughra', 'evidence'],
    dimensions: [
      [
        'Work and patronage',
        'Court specialists, provincial ceramic makers and market clients belonged to intersecting systems of production; patronage was not the only source of work.',
        'ottoman-after',
        'Court payments and open-market incentives',
      ],
      [
        'Authority and unequal power',
        'Official emblems and major foundations represented power; their survival does not measure every person’s understanding or benefit.',
        'met-449533',
        'Description of official uses and specialist production',
      ],
      [
        'Surviving evidence',
        'The dish and emblem have defined catalogue dates; their original users and reception require further evidence.',
        'met-451490',
        'Description and Artwork Details',
      ],
    ],
    prompt:
      'Compare the dish with the tughra. What can each show about work, and what would you need to know about its users?',
  }),
  dossier({
    id: 'isfahan-silk',
    name: 'Isfahan and New Julfa: silk, city and forced movement',
    aliases: ['Safavid', 'Safavid Iran', 'Isfahan', 'New Julfa', 'Shah Abbas'],
    kind: 'period',
    region: 'West/Central Asia',
    place: 'Isfahan and New Julfa, Iran',
    coordinates: [51.677, 32.655],
    geo: 'City locator; New Julfa lies south of the river. Carpet workshops were also in Yazd and Kashan; an individual carpet is not securely assigned to this point.',
    dates: [
      1598,
      1722,
      'Selected Safavid capital phase, 1597–98 to 1722',
      'Start follows the conventional 1597–98 capital transfer, plotted at 1598. The endpoint marks the selected capital phase, not Isfahan’s existence or every later Safavid dynastic claim.',
    ],
    packs: ['C7'],
    question: 'Who made a prosperous capital—and whose movement was coerced?',
    summary:
      'Isfahan’s squares, workshops and markets connected court authority with craft and long-distance trade. Silk involved growers, dyers, weavers, merchants and consumers. New Julfa’s Armenian community became important to this economy after forced deportation from the old town. Keeping that coercion visible changes the meaning of a beautiful carpet: wealth and artistic skill did not arise outside politics or unequal power.',
    sections: [
      [
        'A capital grows within an older city',
        'The conventional transfer of the Safavid capital falls in 1597–98. Haneda and Matthee distinguish a gradual transformation from a single instant of creation, and a mobile royal household from a modern permanently resident government. The new square, shops, caravansaries and covered bazaar formed a commercial and governmental center alongside older urban life. The city did not begin when the shah selected it.',
        'isfahan-capital',
        'Isfahan as the Safavid Capital: proclamation, mobile household, new square and commercial center',
      ],
      [
        'Silk has a chain of work',
        'Raw silk from northern provinces passed through several kinds of labor before becoming luxurious cloth. Munroe distinguishes rural producers, court workshops and private urban workshops, including dyers, weavers and embroiderers. Designers planned repeated patterns, while weaving transformed threads into a surface. The Doria carpet shows costly material and repeated design; its museum record names several cities for the type rather than proving where this individual carpet was woven.',
        'safavid-silk',
        'Workshop organization, Caspian raw silk and weaving processes',
      ],
      [
        'Trade cannot erase deportation',
        'Ghougassian describes the destruction of Old Julfa and forced Armenian movement during the Ottoman–Safavid war in 1604. New Julfa took shape at Isfahan in 1605. Some merchants later gained privileges and built institutions, but later commercial achievement does not make the initial movement voluntary. The record also distinguishes wealthier merchants from other deportees and describes changing restrictions. No single experience stands for everyone moved by the state.',
        'julfa-forced',
        'Origin, settlement, and population: 1604 deportation, 1605 settlement, privileges and restrictions',
      ],
      [
        'Check the collecting name',
        'The carpet type was once attributed to Poland and called Polonaise. The Met now identifies Iranian production in workshops including Isfahan, Yazd and Kashan. A later label can preserve collecting history while misleading us about manufacture. We can inspect the silk and metallic brocading without inventing a named weaver, an exact export itinerary, or a specific workshop that the catalogue does not establish.',
        'met-451028',
        'Description: pair, nineteenth-century misattribution and Iranian workshop centers',
      ],
    ],
    fact: [
      'New Julfa’s later commercial importance followed forced relocation in 1604 and settlement at Isfahan in 1605; prosperity does not establish voluntary migration.',
      'julfa-forced',
      'Origin, settlement, and population, 1604–1605',
    ],
    objects: ['met-451028'],
    terms: ['patronage', 'forced-relocation', 'caravansary', 'evidence'],
    dimensions: [
      [
        'Work and patronage',
        'Rural silk producers, private workshops, court production and merchant networks contributed different forms of work.',
        'safavid-silk',
        'Producer and workshop organization',
      ],
      [
        'Authority and unequal power',
        'State promotion of trade coexisted with forced Armenian relocation, privileges and changing restrictions.',
        'julfa-forced',
        '1604 deportation and New Julfa institutions',
      ],
      [
        'Surviving evidence',
        'A carpet type can be connected to Iranian centers without assigning this individual work to one certain city or maker.',
        'met-451028',
        'Misattribution and workshop centers',
      ],
    ],
    prompt:
      'Explain how a history of a luxury object changes when you include its materials, makers and coerced movements.',
  }),
  dossier({
    id: 'bukhara-books',
    name: 'Bukhara: books, markets and water',
    aliases: [
      'Bukhara',
      'Bokhara',
      'Shaybanid',
      'Shaibanid',
      'Janid',
      'Uzbek khanates',
    ],
    kind: 'period',
    region: 'West/Central Asia',
    place: 'Bukhara, present-day Uzbekistan',
    coordinates: [64.429, 39.774],
    geo: 'Urban locator; the manuscript is probably attributed to Bukhara, not securely documented at a named workshop. No khanate borders are reconstructed.',
    dates: [
      1500,
      1785,
      'Selected Shaibanid and Janid urban contexts, c. 1500–1785',
      'Investigation spans the two periods described in the archaeological source, not the founding or end of Bukhara. Individual buildings and manuscript stages have their own dates.',
    ],
    packs: ['C7'],
    question: 'What changes when a book, a market and a reservoir are read together?',
    summary:
      'Bukhara was a place of government, learning and trade long before 1500. Sixteenth- and seventeenth-century building added madrasas, commercial spaces and water infrastructure to that older city. A manuscript probably painted there lets us look at a different kind of skilled work. Its copied text, later painting and much older poem remind us that a book does not have only one date or one place.',
    sections: [
      [
        'An older city, active new building',
        'UNESCO identifies much of Bukhara’s surviving urban fabric with Uzbek rule from the sixteenth century onward, alongside earlier monuments. Pugachenkova and Rtveladze describe active building under the Shaibanids and Janids: bazaars, caravansaries and reservoirs as well as religious institutions. Trade with Russia expanded during these periods. This evidence does not support treating Central Asia as a static space between other empires.',
        'bukhara-monuments',
        'Shaibanid 1500–98 and Janid 1599–1785 periods; trade and urban construction',
      ],
      [
        'Learning and exchange used built spaces',
        'The Mir-i Arab madrasa dates to 1535–36 in the archaeological account. Other foundations and covered commercial structures followed. Rooms for students, markets for merchants and reservoirs for water served different activities within the same city. Their presence helps us ask about daily work and infrastructure, but does not give us the biography or experiences of every student, seller or water carrier.',
        'bukhara-monuments',
        'Mir-i Arab; Qush Madrasa; domed commercial structures and reservoirs',
      ],
      [
        'Several makers and several moments',
        'The illustrated Bustan folio is attributed to Shaikh Zada. The catalogue says the manuscript was likely copied in Herat, then illustrated for an Uzbek patron, probably in Bukhara in the 1530s. Sa‘di’s poem is older still, completed in 1257. Text composition, copying and painting are separate acts. The qualified terms likely and probably are part of the evidence, not inconveniences to be removed for a tidier map.',
        'met-452671',
        'Description and Artwork Details: poem, copying, patron and attribution',
      ],
      [
        'A reception is a literary image',
        'Patterned textiles, architecture and expensive objects help create the depicted scene. They are evidence of choices made by the artist and patron, not a photograph of every Bukharan household. Comparing this book with Iznik ceramics or Isfahan textiles can expose shared questions about skill, patronage and use. Similarity alone does not prove a direct transfer between two particular workshops.',
        'met-452671',
        'Description: reception, luxury goods and Herat/Bukhara stylistic context',
      ],
    ],
    fact: [
      'The manuscript’s copying in Herat and later illustration probably in Bukhara are qualified catalogue attributions, not a single certain place and production date.',
      'met-452671',
      'Description, manuscript stages and probably Bukhara in the 1530s',
    ],
    objects: ['met-452671'],
    terms: ['patronage', 'madrasa', 'caravansary', 'evidence'],
    dimensions: [
      [
        'Work and patronage',
        'Book copying and illustration, commercial buildings and religious foundations reveal different makers and patrons in an active urban setting.',
        'bukhara-monuments',
        'Madrasa and commercial construction',
      ],
      [
        'Authority and unequal power',
        'An illustrated book made for an Uzbek patron gives privileged access to a cultivated elite’s representation; it does not speak equally for all urban residents.',
        'met-452671',
        'Uzbek patron and reception scene',
      ],
      [
        'Surviving evidence',
        'Copying, painting and literary composition belong to separate moments; place attribution remains qualified.',
        'met-452671',
        'Description and Artwork Details',
      ],
    ],
    prompt:
      'Make a three-part chronology for this book: the poem, the copying and the painting. Mark what is certain and what is attributed.',
  }),
  dossier({
    id: 'zand-iran',
    name: 'Later eighteenth-century Iran: Shiraz, power and lacquer',
    aliases: ['Zand', 'Karim Khan', 'Shiraz', 'Muhammad Baqir'],
    kind: 'period',
    region: 'West/Central Asia',
    place: 'Shiraz and western Iran; object attributed only to Iran',
    coordinates: [52.583, 29.592],
    geo: 'Shiraz is the political context, not a proven manufacturing location for the displayed case. No uniform national territory is implied.',
    dates: [
      1751,
      1794,
      'Selected Zand political and material contexts, 1751–1794',
      'Dynastic convention follows Perry. Karim Khan’s residence in Shiraz from 1765–1779 is narrower; the 1789 case belongs after his death and is not assigned to his personal use.',
    ],
    packs: ['C7'],
    question:
      'Can a small case reveal work and taste without becoming a portrait of an entire reign?',
    summary:
      'After the disruptions of the earlier eighteenth century, Karim Khan made Shiraz a center of rule and building. Merchants and artisans contributed to urban life, while campaigns and political limits remained part of that history. A lacquer case dated 1789 carries the investigation beyond Karim Khan’s lifetime. Its practical compartments and painted courtly scene offer different kinds of evidence.',
    sections: [
      [
        'A title and its limits',
        'Perry describes Karim Khan’s rule from 1751 to 1779 and his residence at Shiraz from 1765. He used the title wakil, or deputy, rather than shah. This language matters for political representation, but it does not make his government a modern elected system. His authority did not include all territories associated with earlier Iranian rulers, and military campaigns remained a means of enforcing power.',
        'zand-history',
        'Karim Khan, the Wakil: dates, title, territory and campaigns',
      ],
      [
        'Building and buying in Shiraz',
        'The scholarly account describes merchants from Europe and India, rebuilding, gardens, a covered bazaar and artisans drawn to Shiraz. Such work helps explain a capital beyond its ruling household. At the same time, a court observer’s pleasant reminiscence cannot establish that every resident prospered. Buildings, commercial agreements and personal narratives must each be read for the question they can actually answer.',
        'zand-karim',
        'The Wakil at Shiraz, 1765–79: commerce, rebuilding, artisans and Donboli’s recollection',
      ],
      [
        'The case is dated after the ruler’s death',
        'The Met attributes the lacquer case to Muhammad Baqir and dates it 1204 AH/1789 CE. It therefore cannot be labeled a possession made for Karim Khan, who died in 1779, without separate provenance. Its drawer was arranged for a dressing set, while the painted lid includes a courtly gathering. A function, an artistic subject and a named maker are three different claims.',
        'met-681122',
        'Description and Artwork Details: maker, 1204 AH/1789 CE, compartments and scene',
      ],
      [
        'Observe closely without inventing a story',
        'The outside’s birds and flowers differ from the gathering inside. Both involve skilled surface-making as well as the work of constructing a useful container. The museum identifies Iran but not a secure city of manufacture. We can compare this late-eighteenth-century object with the earlier carpet and manuscript without inventing an unbroken workshop lineage, a particular party, or a known purchaser.',
        'met-681122',
        'Description, Geography and material',
      ],
    ],
    fact: [
      'The case is dated 1789, ten years after Karim Khan’s death in 1779; its catalogue does not assign it to his use or identify a secure Shiraz workshop.',
      'met-681122',
      'Artwork Details: dated 1204 AH/1789 CE; Geography Iran',
    ],
    objects: ['met-681122'],
    terms: ['patronage', 'lacquer', 'evidence', 'inference'],
    dimensions: [
      [
        'Work and patronage',
        'A named lacquer painter and a practical case reveal skilled production, while urban accounts document merchants and artisans.',
        'met-681122',
        'Artist, material and function',
      ],
      [
        'Authority and unequal power',
        'The title deputy represented authority differently from shah; it did not remove territorial limits or military coercion.',
        'zand-history',
        'Karim Khan’s title, territorial limits and campaigns',
      ],
      [
        'Surviving evidence',
        'The case’s date, maker attribution and practical compartments are documented; purchaser, exact workshop and depicted occasion are not.',
        'met-681122',
        'Description and Artwork Details',
      ],
    ],
    prompt:
      'Separate three claims about the case: what it held, what its painting shows, and whose possession it was. Which remain unknown?',
  }),
].map((s) => {
  if (s.id === 'ottoman-workshops') {
    s.claims[0]!.citations.push(cite('met-449533', 'Visible catalogue date c1555–60'));
    s.sections[1]!.citations.push(
      cite('stonepaste-tech', 'Opening material definition'),
    );
  }
  if (s.id === 'zand-iran')
    s.claims[0]!.citations.push(cite('zand-history', 'Karim Khan, death in 1779'));
  return { ...s, claims: s.claims.map((c) => ({ ...c, checkedOn: accessed })) };
});
export const westCentralJourney: Journey = {
  id: 'west-central-workshops',
  title: 'Books, silk and power: West/Central Asia, 1500–1800',
  question:
    'How did makers and urban communities work within—and beyond—courtly power?',
  duration: '25–40 minutes',
  introduction:
    'Move from Central Asian bookmaking to Ottoman workshops, Safavid Isfahan and later-eighteenth-century Iran. These linked questions do not imply one empire, one identity or a direct route between every object. Follow production, patronage and the people missing from courtly images.',
  stops: [
    {
      subject: 'bukhara-books',
      year: 1530,
      title: 'Give the book more than one date',
      narrative:
        'Separate Sa‘di’s poem, copying likely in Herat and painting probably in Bukhara. Keep the catalogue’s uncertainty visible.',
      object: 'met-452671',
    },
    {
      subject: 'ottoman-workshops',
      year: 1580,
      title: 'Put a dish beside an emblem of power',
      narrative:
        'Inspect the birds on the Iznik dish, then choose the tughra. Compare material, use and specialized work rather than treating every object as a palace commission.',
      object: 'met-451490',
    },
    {
      subject: 'isfahan-silk',
      year: 1630,
      title: 'Follow labor and forced movement',
      narrative:
        'Read the carpet as costly craft within a wider silk economy. Bring New Julfa’s 1604 forced relocation into the account, and compare state patronage with the Ottoman case.',
      object: 'met-451028',
      compare: 'ottoman-workshops',
    },
    {
      subject: 'zand-iran',
      year: 1789,
      title: 'Keep the later eighteenth century in view',
      narrative:
        'Open the lacquer case and its additional views. Its date falls after Karim Khan’s death. A practical object and an idealized courtly image do not establish the same facts.',
      object: 'met-681122',
      compare: 'isfahan-silk',
    },
  ],
  conclusion:
    'Courts could commission beautiful work while makers also worked for markets and urban institutions. Silk connected farming, skilled production and commerce with coercion and unequal power. A literary painting, official emblem and practical case reveal different things; none can stand alone for everyone’s experience.',
  evidence: {
    prompt:
      'Which account best respects both the silk evidence and the history of New Julfa?',
    options: [
      {
        text: 'Luxury production involved several forms of work, and New Julfa’s later commercial importance does not make the 1604 deportation voluntary.',
        supported: true,
        feedback:
          'The workshop account identifies multiple producers and skills. Ghougassian separately documents forced relocation, later settlement and unequal privileges.',
      },
      {
        text: 'A beautiful carpet proves everyone involved was prosperous and free to move.',
        supported: false,
        feedback:
          'An object’s quality does not establish its makers’ freedom or the conditions of every worker. The documented deportation directly challenges that inference.',
      },
      {
        text: 'The name Polonaise proves the carpet was woven in Poland.',
        supported: false,
        feedback:
          'The catalogue explains the older misattribution and identifies Iranian production centers, while leaving this individual carpet’s precise workshop unresolved.',
      },
    ],
    citations: [
      cite('safavid-silk', 'Workshop organization and skilled production'),
      cite('julfa-forced', '1604 deportation and 1605 settlement'),
      cite('met-451028', 'Description: misattribution and centers'),
    ],
  },
  returnPrompt:
    'Choose one luxury object and explain a chain of work around it. Identify one person or experience the object alone cannot recover.',
};
