import type { Corpus, PlaceStudy, Source } from '../../src/atlas/model';

/** Two published property references; deliberately not a complete urban plan. */
export const isfahanPlaceSources: Source[] = [
  {
    id: 'isfahan-square-unesco',
    title: 'Meidan Emam, Esfahan: published property reference',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/115/',
    type: 'archive',
    accessed: '2026-10-29',
    scope:
      'Selected description/criterion vi, authenticity and published N32 39 26.82 E51 40 40 coordinate read through exposed official text. This is a modern World Heritage property reference, not a seventeenth-century survey corner, household or workshop. No nomination/management PDF, cadastral boundary or photograph pixels read. Introductory Timurid-palace wording and an older management assertion are not adopted. Local capture returned 403; no alternate route retried. Coordinate facts are converted from displayed DMS; no source artwork or geometry copied.',
  },
  {
    id: 'isfahan-vank-tentative',
    title: 'Monastery of St. Amenaprkich (New Julfa Vank): submitted reference',
    institution:
      'Iranian Cultural Heritage, Handicrafts and Tourism Organization; UNESCO World Heritage Centre Tentative List 6385',
    url: 'https://whc.unesco.org/en/tentativelists/6385/',
    type: 'archive',
    published: 'State Party submission, 2019-02-01',
    accessed: '2026-10-29',
    scope:
      'Header, submission disclaimer and selected New Julfa context actually read. Numeric use is restricted to the published N32 38 06 E51 39 21 monastery reference, converted from DMS without substituting different decimal coordinates from secondary pages. Tentative submission is not World Heritage inscription or endorsement of every claim. It is not a quarter boundary/centroid, household or workshop. Hospitality/coexistence rhetoric and first/only artistic claims are not adopted or allowed to erase separately documented coercion. No nomination plan, building survey or source-image pixels consulted; no figure copied.',
  },
  {
    id: 'isfahan-bridges',
    title: 'Isfahan x. Monuments (5) Bridges',
    institution: 'Encyclopaedia Iranica XIV/1, pp. 35–38',
    author: 'Sussan Babaie',
    url: 'https://www.iranicaonline.org/articles/isfahan-x5-bridges/',
    type: 'scholarship',
    published: '2007-12-15; updated 2012-04-05',
    accessed: '2026-10-29',
    scope:
      'Current metadata and selected introduction/Allāhverdi Khan Bridge paragraphs read, especially the 1602–1607 construction range, Chaharbagh connection across the Zayandarud, northern royal/Meydan side, southern suburbs and New Julfa, with central animal passage and raised pedestrian sides. Other bridge text encountered is not a full river history. No plate pixels, original chronicle, cited Melville article or complete architectural survey consulted. No numeric bridge coordinate, river/avenue course, route or source geometry supplied; no image copied. This textual connection is not an itinerary for the selected carpet or deportees.',
  },
];

export const isfahanPlaceStudy: PlaceStudy = {
  title: 'Isfahan and New Julfa: two published property references',
  description:
    'Modern published references distinguish the royal-square area and Vank monastery in New Julfa. The accompanying text explains the river and named bridge connection. No river line, bridge point, quarter boundary, route or measured seventeenth-century street plan is drawn. Fuller household and workshop geography remains open.',
  bounds: [51.648, 32.628, 51.686, 32.664],
  points: [
    {
      id: 'isfahan-square-reference',
      label: 'Meidan Emam — published square reference',
      coordinates: [51.67777777777778, 32.65745],
      text: 'Converted UNESCO property-reference coordinate for the square, not a workshop address. Babaie describes Chaharbagh linking the royal/Meydan side with the southern suburbs across Allāhverdi Khan Bridge. The connection is explained in words because no measured route or river geometry is adopted here.',
      citations: [
        {
          source: 'isfahan-square-unesco',
          locator: 'Published coordinate: N32 39 26.82 E51 40 40',
        },
        {
          source: 'isfahan-bridges',
          locator: 'Allāhverdi Khan Bridge: royal/Meydan side and southern suburbs',
        },
      ],
    },
    {
      id: 'new-julfa-vank-reference',
      label: 'New Julfa — submitted Vank monastery reference',
      coordinates: [51.655833333333334, 32.635],
      text: 'Converted coordinate submitted by Iran for Vank monastery in New Julfa in 2019. It marks a specific property reference, not the extent of the Armenian quarter, a seventeenth-century household or an inscribed World Heritage property. Babaie identifies Allāhverdi Khan Bridge as a connection between New Julfa and the city; it does not locate the selected carpet’s makers.',
      citations: [
        {
          source: 'isfahan-vank-tentative',
          locator: 'Submission header: 1 February 2019; N32 38 06 E51 39 21',
        },
        {
          source: 'isfahan-bridges',
          locator: 'Allāhverdi Khan Bridge: New Julfa connection',
        },
      ],
    },
  ],
  features: [],
};

export function applyCitiesIsfahanPlaces(c: Corpus): void {
  for (const source of isfahanPlaceSources)
    if (!c.sources.some((row) => row.id === source.id)) c.sources.push(source);
  const s = c.subjects.find((row) => row.id === 'isfahan-silk');
  if (!s) throw new Error('Isfahan place study requires the existing case');
  s.placeStudy = isfahanPlaceStudy;
}
