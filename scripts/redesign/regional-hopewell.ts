import type {
  Corpus,
  HistoricalContext,
  Media,
  PlaceStudy,
  Source,
} from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'hopewell-farming',
    title: 'Hopewell Farming',
    institution: 'National Park Service',
    url: 'https://www.nps.gov/hocu/learn/historyculture/hopewell-farming.htm',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      'Introductory text before Eastern Agricultural Complex Plants heading; no individual linked plant articles consulted. No quantified diet shares, uniform household crop list or seasonal labor calendar established. Its shifting-cultivation explanation is qualified and unnecessary for this draft. NPS text; no gardening illustration/photo copied. Page updated 30 September 2025.',
  },
  {
    id: 'hopewell-hopeton-research',
    title: 'Archeology at Hopewell Culture National Historical Park',
    institution: 'National Park Service; Midwest Archeological Center project account',
    url: 'https://www.nps.gov/articles/archeology-at-hopewell-culture-national-historical-park.htm',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      'Introduction; Early Observations; An Endangered Resource; Ongoing Research, especially 2001–02 trenches and burned-log estimate. No named article author or publication date beyond update shown. No calibrated probability range, lab code or sample context details beyond reported trench. Do not date all walls or the site from one sample. NPS text; no excavation/remains photograph copied. Page updated 20 July 2020; this is a report of 2001–02 investigations, not current project progress.',
  },
  {
    id: 'hopewell-hopeton',
    title: 'Hopeton Earthworks',
    institution: 'National Park Service',
    url: 'https://www.nps.gov/hocu/learn/historyculture/hopeton-earthworks.htm',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      'Introduction; Ceremonial Gatherings; Grand & Purposeful Construction; Slow Demise; Respecting a Shared National Heritage; Site Map & Trail Map caption. Top illustration caption says circa 1864 while second says 1848; do not merge illustrations or assign a creation date from filename. Avoid exact alignments, measurements and post-spacing not independently needed here. NPS text; modern map credit NPS/Tom Engberg plus nomination outline; images not copied from this page. Page updated 10 July 2024.',
  },
  {
    id: 'hopewell-myaamia-2023',
    title: 'Aatotankiki Myaamiaki / Miami Nation News, Vol. 17 No. 2, Fall 2023',
    institution: 'Miami Tribe of Oklahoma; Myaamia Publications',
    url: 'https://www.miamination.com/wp-content/uploads/2023/03/Vol-17-No-2-Fall-3-2023-Final.pdf',
    type: 'primary',
    accessed: '2026-10-29',
    scope:
      'PDF text edition only: printed p. 3A Hopewell paragraphs beginning Some of you may have already heard; p. 5A named article; publication masthead on p. 2A. PDF has 16 spreads; selected passages occur PDF pages 2 and 3. No whole-issue reading or page-image inspection claimed. Modern voices do not establish unchanged ancient beliefs or a specimen-to-modern-nation lineage. Do not copy unrelated community/private-event information or photographs. Broader period differs from NPS 1–400 focus. Published by Sovereign Miami Tribe of Oklahoma for enrolled citizens, publicly downloadable. No open reuse licence identified; paraphrase with attribution, no figure copying.',
    author:
      'Chief Douglas Lankford, p. 3A; Logan York, Tribal Historic Preservation Officer, p. 5A',
    published: 'Fall 2023',
  },
  {
    id: 'hopewell-unesco-locations',
    title: 'Hopewell Ceremonial Earthworks: Maps / Geographical data (8)',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/1689/maps/',
    type: 'archive',
    accessed: '2026-10-29',
    scope:
      'Full eight-row geographical table and nomination disclaimer; published center coordinates transcribed in DMS and arithmetically converted for rounded orientation points. Not ancient political boundaries, precise shooting/excavation locations or evidence of routes. Keep original subject coordinate unchanged. Factual coordinates transcribed with attribution; no UNESCO map image copied.',
  },
  {
    id: 'hopewell-squier-davis-catalogue',
    title: 'Ancient Monuments of the Mississippi Valley',
    institution: 'Smithsonian Libraries and Archives',
    url: 'https://repository.si.edu/items/1718fb41-78c6-4063-841f-a46f72b03ad4',
    type: 'catalogue',
    accessed: '2026-10-29',
    scope:
      'Smithsonian catalogue metadata only: title, 1848, authors, publisher, series and handle 10088/7486. No 29.58 MB book download or whole-volume consultation. NPS Mound City reproduction separately inspected. The catalogue renders Davis’s given name as Edward; creator attribution retains E. H. Davis / Edwin Hamilton rather than silently adopting that variant. Exact plate number not verified. Original U.S. 1848 publication public domain; no modern scholarly reprint introduction copied.',
    author: 'E.G. Squier and E.H. Davis',
    published: '1848',
  },
  {
    id: 'hopewell-nps-ownership',
    title: 'Disclaimer: Ownership and Maps',
    institution: 'National Park Service',
    url: 'https://www.nps.gov/aboutus/disclaimer.htm',
    type: 'archive',
    accessed: '2026-10-29',
    scope:
      'Ownership and Maps sections: official-duty U.S. Government works are generally public domain unless otherwise indicated; third-party content remains separately governed. This does not establish every hosted asset is government-owned; Arrowhead/marks excluded. Policy source only.',
  },
  {
    id: 'hopewell-newark-center',
    title: 'About Us / FAQ',
    institution: 'Newark Earthworks Center, The Ohio State University',
    url: 'https://earthworks.osu.edu/about',
    type: 'scholarship',
    accessed: '2026-10-29',
    scope:
      'Our History; FAQ What is the Hopewell Culture? Is it an American Indian nation?; attributed John Low comment; no linked books read. Page mixes current and stale program statistics/nomination wording; do not use visitor or world-site counts. John Low is attributed by the FAQ; do not infer current director role. Institutional text consultation; no open image licence established.',
  },
];

const renewedScopes: Record<string, string> = {
  'hopewell-nps':
    'History & Culture introductory paragraphs renewed: narrow 1–400 CE inquiry, broad network among different Native American groups and listed nonlocal materials. Page updated 26 September 2025. No direct route, single tribe or state inferred.',
  'hopewell-moundcity':
    'Selected Introduction; Camp Sherman; Ceremonial Gatherings; Careful Construction; A National Park is Born; Site Map & Trail Map caption; respectful visiting and nineteenth-century canal paragraph. Page updated 14 May 2025. Relative construction order and possible repeated gatherings are distinguished from exactly dated episodes. The 450×607 Squier & Davis c.1848 plate reproduction was downloaded from the NPS image URL and its actual pixels inspected; selected for local reuse as the separate Mound City plan, with publication date distinct from ancient construction. Its scale/orientation marks and mapped canal are not converted into new measured coordinates or a single ancient phase. Original 1848 U.S. publication is public domain; Smithsonian catalogue metadata checked separately. The 960×853 modern NPS/Tom Engberg visitor map was also inspected in research only; it includes current infrastructure and credits a United States of America 2022 nomination outline. This source does not confer a blanket licence on other maps, photographs or nomination materials. Original Mound City photograph and older Hopewell Mound Group survey bytes remain unchanged.',
  'hopewell-moundgroup':
    'Selected Introduction, New to Science, A List of Superlatives, Remnants of a Glorious Past and Archeological Expeditions including 1820/1848/2001, plus 1848 survey caption. Existing 500×342 North Fork Works plan reproduction actually inspected unchanged. This is Hopewell Mound Group, not the Mound City winter-photo site. Inconsistent area figures on the page are not adopted. Survey publication and later fieldwork are not ancient construction episodes.',
  'hopewell-unesco':
    'Selected English Description and Outstanding Universal Value: Brief Synthesis, Criteria, Integrity and Authenticity renewed. The eight-component serial property and 1–400 CE OUV frame orient the inquiry; institutional nonhierarchical/egalitarian language is not treated as proof of a particular constitution. Web description displays CC BY-SA IGO 3.0; it is not a blanket image or nomination-map licence. No nomination volume or Benjamin Barnes essay was read. The separate geographical table is recorded under hopewell-unesco-locations.',
};

export const hopewellContext: HistoricalContext = {
  id: 'hopewell-gathering-context',
  title: 'Ohio gathering and earthwork construction',
  region: 'Americas',
  interval: {
    start: -100,
    end: 500,
    label: 'Selected wider orientation, c.100 BCE–500 CE',
    precision: 'approximate',
    note: 'Broader orientation follows the approximate 100 BCE–500 CE span of the Hopewell religious movement in Logan York’s 2023 article; Newark Earthworks Center’s archaeological-culture FAQ uses approximately 100 BCE–400 CE. Those are attributed conventions with different scopes, not a state’s lifespan or dates for every structure. The entire selected dossier interval remains byte-for-byte 1–400 CE.',
  },
  summary:
    'Households provisioned themselves while communities built, used and changed shared earthwork places. Different source frames and one sampled wall date help locate those activities without making every enclosure contemporary.',
  subjectIds: ['hopewell-earthworks'],
  citations: [
    {
      source: 'hopewell-myaamia-2023',
      locator: 'Logan York, p. 5A: broader 100 BCE–500 CE movement convention',
    },
    {
      source: 'hopewell-newark-center',
      locator: 'FAQ: approximately 100 BCE–400 CE archaeological-culture convention',
    },
    {
      source: 'hopewell-moundcity',
      locator: 'Ceremonial Gatherings; Careful Construction',
    },
  ],
  phases: [
    {
      year: -100,
      label: 'Around 100 BCE: start of a broader source frame',
      title: 'A wider orientation keeps its source',
      text: 'York’s 2023 article describes a Hopewell religious movement approximately 100 BCE–500 CE. The Newark Earthworks Center FAQ uses approximately 100 BCE–400 CE for its archaeological-culture convention. These are attributed frames with different scopes, not a founding date or one people’s complete lifespan.',
      citations: [
        {
          source: 'hopewell-myaamia-2023',
          locator: 'Logan York, p. 5A: broader period',
        },
        {
          source: 'hopewell-newark-center',
          locator: 'FAQ: What is the Hopewell Culture?',
        },
      ],
    },
    {
      year: 1,
      label: '1–400 CE: selected Mound City frame',
      title: 'Buildings, gatherings and later mound additions',
      text: 'NPS places Mound City construction within this broad interval. Its account describes a ceremonial building and clay floor, deliberate dismantling and earthen additions. The relative order does not supply numeric dates for individual operations; possible repeated gatherings remain qualified.',
      citations: [
        {
          source: 'hopewell-moundcity',
          locator: 'Ceremonial Gatherings; Careful Construction',
        },
      ],
    },
    {
      year: 300,
      label: 'Around 300 CE: one reported Hopeton wall estimate',
      title: 'A sampled wall has a narrower dating question',
      text: 'The NPS account of 2001–02 investigations associates burned logs in one trench with initial construction of one Hopeton enclosure wall around 300 CE. The reported estimate does not date all walls or every Ohio earthwork. Original laboratory and calibration details were not supplied on the consulted page.',
      citations: [
        {
          source: 'hopewell-hopeton-research',
          locator: 'Ongoing Research: wall trenches and burned-log estimate',
        },
      ],
    },
    {
      year: 400,
      label: '400 CE: end of the selected NPS case frame',
      title: 'A teaching bound does not end Indigenous presence',
      text: 'The selected NPS inquiry ends at 400 CE, while the wider context records York’s convention through approximately 500 CE. Neither endpoint establishes that every structure stopped being used together or that Indigenous people disappeared. Modern survey, restoration and contemporary statements are separately dated evidence outside these ancient phases.',
      citations: [
        {
          source: 'hopewell-nps',
          locator: 'History & Culture: 1–400 CE focus',
        },
        {
          source: 'hopewell-myaamia-2023',
          locator: 'Logan York, p. 5A: wider period',
        },
      ],
    },
  ],
};

/** Modern serial-property references only; no inferred route or ancient border. */
export const hopewellPlaceStudy: PlaceStudy = {
  title: 'Eight component places in a wider Ohio landscape',
  description:
    'These are modern UNESCO serial-property center references, rounded to 0.001 degree for orientation. They are neither ancient boundaries nor exact excavation/photo positions. Separate points do not establish a direct route or common construction date; the dossier’s original coarse locator remains unchanged.',
  bounds: [-84.2, 39.15, -82.3, 40.12],
  points: [
    {
      id: 'hopewell-1689-001',
      label: 'Octagon Earthworks',
      coordinates: [-82.446, 40.054],
      text: 'Modern inscribed-property center reference, UNESCO 1689-001. Published DMS: N 40 3 13.17 W 82 26 45.82. Decimal conversion rounded to 0.001 degree; not an ancient political center or exact excavation point.',
      citations: [
        {
          source: 'hopewell-unesco-locations',
          locator: 'Geographical data (8), 1689-001 Octagon Earthworks row',
        },
      ],
    },
    {
      id: 'hopewell-1689-002',
      label: 'Great Circle Earthworks',
      coordinates: [-82.43, 40.041],
      text: 'Modern inscribed-property center reference, UNESCO 1689-002. Published DMS: N 40 2 28.44 W 82 25 48.43. Decimal conversion rounded to 0.001 degree; not an ancient political center or exact excavation point.',
      citations: [
        {
          source: 'hopewell-unesco-locations',
          locator: 'Geographical data (8), 1689-002 Great Circle Earthworks row',
        },
      ],
    },
    {
      id: 'hopewell-1689-003',
      label: 'Hopeton Earthworks',
      coordinates: [-82.979, 39.385],
      text: 'Modern inscribed-property center reference, UNESCO 1689-003. Published DMS: N 39 23 5.25 W 82 58 44.96. Decimal conversion rounded to 0.001 degree; not an ancient political center or exact excavation point.',
      citations: [
        {
          source: 'hopewell-unesco-locations',
          locator: 'Geographical data (8), 1689-003 Hopeton Earthworks row',
        },
      ],
    },
    {
      id: 'hopewell-1689-004',
      label: 'Mound City',
      coordinates: [-83.004, 39.376],
      text: 'Modern inscribed-property center reference, UNESCO 1689-004. Published DMS: N 39 22 35.36 W 83 0 14.36. Decimal conversion rounded to 0.001 degree; not an ancient political center or exact excavation point.',
      citations: [
        {
          source: 'hopewell-unesco-locations',
          locator: 'Geographical data (8), 1689-004 Mound City row',
        },
      ],
    },
    {
      id: 'hopewell-1689-005',
      label: 'High Bank Works',
      coordinates: [-82.918, 39.299],
      text: 'Modern inscribed-property center reference, UNESCO 1689-005. Published DMS: N 39 17 54.82 W 82 55 6.56. Decimal conversion rounded to 0.001 degree; not an ancient political center or exact excavation point.',
      citations: [
        {
          source: 'hopewell-unesco-locations',
          locator: 'Geographical data (8), 1689-005 High Bank Works row',
        },
      ],
    },
    {
      id: 'hopewell-1689-006',
      label: 'Hopewell Mound Group',
      coordinates: [-83.093, 39.361],
      text: 'Modern inscribed-property center reference, UNESCO 1689-006. Published DMS: N 39 21 39.54 W 83 5 36.14. Decimal conversion rounded to 0.001 degree; not an ancient political center or exact excavation point.',
      citations: [
        {
          source: 'hopewell-unesco-locations',
          locator: 'Geographical data (8), 1689-006 Hopewell Mound Group row',
        },
      ],
    },
    {
      id: 'hopewell-1689-007',
      label: 'Seip Earthworks',
      coordinates: [-83.22, 39.237],
      text: 'Modern inscribed-property center reference, UNESCO 1689-007. Published DMS: N 39 14 14.89 W 83 13 11.37. Decimal conversion rounded to 0.001 degree; not an ancient political center or exact excavation point.',
      citations: [
        {
          source: 'hopewell-unesco-locations',
          locator: 'Geographical data (8), 1689-007 Seip Earthworks row',
        },
      ],
    },
    {
      id: 'hopewell-1689-008',
      label: 'Fort Ancient',
      coordinates: [-84.093, 39.403],
      text: 'Modern inscribed-property center reference, UNESCO 1689-008. Published DMS: N 39 24 12.1 W 84 5 33.18. Decimal conversion rounded to 0.001 degree; not an ancient political center or exact excavation point.',
      citations: [
        {
          source: 'hopewell-unesco-locations',
          locator: 'Geographical data (8), 1689-008 Fort Ancient row',
        },
      ],
    },
  ],
  features: [],
};

/** Root owns lossless asset generation and appending this separate optional plan. */
export const hopewellMoundCityPlan: Media = {
  id: 'hopewell-moundcity-1848',
  subject: 'hopewell-earthworks',
  source: 'hopewell-moundcity',
  title: 'Mound City in a plan published in 1848',
  accession: 'Squier and Davis 1848; NPS reproduction Mound-City-450.jpg',
  creator: 'Ephraim George Squier and Edwin Hamilton Davis',
  date: {
    start: 1848,
    end: 1848,
    label: 'Published 1848',
    precision: 'exact',
    note: 'The surveyors dated the drawing 1846. Plate XIX appeared in the 1848 volume. The modern reproduction has no stated date.',
  },
  representedDate:
    'Ancient earthwork features recorded within a nineteenth-century landscape; individual construction phases not established by this sheet',
  place: 'Mound City Group and neighboring recorded features, Ohio, United States',
  material: 'Digital reproduction of a printed historical survey plan',
  image: '/atlas/media/hopewell-moundcity-1848.webp',
  thumbnail: '/atlas/media/hopewell-moundcity-1848-thumb.webp',
  width: 450,
  height: 607,
  additionalImages: [],
  alt: 'Historical plan showing the Mound City enclosure and mound symbols beside the Scioto River, with a canal to the left, another circular work below, and printed scale and orientation marks.',
  caption:
    'Squier and Davis surveyed Mound City in 1846 and published the plan in 1848 as Plate XIX. The enclosure and mound symbols appear beside the Scioto River; a canal and other recorded features share the sheet. This is a later survey, not a single ancient construction phase. It is a different plan from the existing North Fork Works image of Hopewell Mound Group. The small source reproduction retains its original limits.',
  printCaption:
    'Mound City, surveyed in 1846 and published in 1848. Ancient features and a nineteenth-century canal share the sheet. The separate North Fork Works plan records Hopewell Mound Group.',
  printCredit:
    'E. G. Squier and E. H. Davis, 1848; NPS reproduction. Original publication public domain.',
  printWidthMm: 55,
  notice: [
    'Find the Mound City enclosure and the Scioto River.',
    'Which feature belongs to the nineteenth-century survey landscape?',
    'What can this plan tell us about spatial relationships without dating each mound?',
  ],
  relevance:
    'Adds a same-site historical plan for Mound City while retaining the distinct Hopewell Mound Group survey and the modern restored-landscape photograph.',
  rights: 'Public domain; original survey published in the United States in 1848',
  credit:
    'E. G. Squier and E. H. Davis, Ancient Monuments of the Mississippi Valley (1848), reproduced by the National Park Service. Original publication is public domain; no source pixels restored or newly recovered detail claimed.',
  licenseUrl: 'https://www.nps.gov/aboutus/disclaimer.htm',
  sourceImage:
    'https://www.nps.gov/hocu/learn/historyculture/images/Mound-City-450.jpg',
  depiction: 'later depiction',
  datingNote:
    '1848 is the original publication year. The NPS digital reproduction’s creation date is not established; ancient features and later survey landscape must be distinguished.',
};

/** Expand the existing inquiry; preserve its complete identity, interval and media order. */
export function applyRegionalHopewell(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'hopewell-earthworks');
  if (!s) throw new Error('Hopewell continuation requires hopewell-earthworks');
  for (const source of sources) {
    const index = c.sources.findIndex((row) => row.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  for (const [id, scope] of Object.entries(renewedScopes)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw new Error(`Hopewell continuation requires ${id}`);
    const marker = 'Hopewell selected renewal, 2026-10-29:';
    if (!source.scope.includes(marker)) {
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker} ${scope}`;
    }
    source.accessed = consulted;
  }
  // The dynamic gallery exposed only generic usage text in this renewal.
  // Keep hopewell-nps-photo's earlier asset-specific metadata/access date intact.
  c.contexts = [
    ...(c.contexts ?? []).filter((row) => row.id !== hopewellContext.id),
    hopewellContext,
  ];
  s.contextIds = [...new Set([...(s.contextIds ?? []), hopewellContext.id])];
  s.summary =
    'People provisioned households, built ceremonial structures, moved selected soils and returned to shared places. Historical plans, a restored landscape, one dated Hopeton wall investigation and named contemporary Myaamia accounts explain different parts of that work and its continuing significance.';
  s.sections = [
    sec(
      'Shared places and everyday provision',
      'In the Ohio tributary valleys, Indigenous communities made gathering places whose shapes still organize the landscape. The atlas follows selected works between 1 and 400 CE; Hopewell is an archaeological label for linked practices among different groups. It does not supply the builders’ own collective name. Monumental work could bring people together without requiring everyone to live permanently inside one enclosure. Shared construction and repeated meetings are part of the explanation for how dispersed communities made public places.',
      cite('hopewell-nps', 'History & Culture: 1–400 CE focus and broad network'),
      cite('hopewell-moundcity', 'Ceremonial Gatherings'),
    ),
    sec(
      'Food work sustained other work',
      'Building depended on ordinary ways of sustaining life. The NPS account describes hunting, fishing and gathering alongside cultivated annual plants. Sunflower, squash and goosefoot were among the crops grown in Ohio before maize and beans became established later. Fields near homes, produced and gathered foods and knowledge of local environments supported households as well as other activities. The account connects household food work with the energy needed to build and use shared places.',
      cite(
        'hopewell-farming',
        'Introductory paragraphs before Eastern Agricultural Complex Plants',
      ),
    ),
    sec(
      'Building, dismantling and adding earth',
      'At Mound City, a mound could follow a ceremonial building. Builders erected poles and bark over a plastered clay floor, and fires burned in clay basins. Some ceremonies honored the dead. The building was later deliberately dismantled before earth was added. Alternating deposits of clay and sand show planned material work. NPS suggests mound building may have continued through several gatherings; the layers do not count the meetings or identify a single commander.',
      cite('hopewell-moundcity', 'Careful Construction'),
    ),
    sec(
      'A wall preserves a particular sequence',
      'Hopeton provides another construction example. The NPS report of investigations in 2001–02 describes trenches across enclosure walls. Builders first stripped topsoil and then brought in other soils in layers. A burned-log sample led the report to place the beginning of one sampled wall around 300 CE. The work therefore involved choosing, moving and placing material. That reported estimate belongs to a particular wall investigation, rather than dating every enclosure or every community.',
      cite(
        'hopewell-hopeton-research',
        'Ongoing Research: 2001–02 trenches, soil layers and burned-log estimate',
      ),
    ),
    sec(
      'Materials, skill and continuing responsibility',
      'Copper, mica, shell and obsidian connected Ohio ceremonial objects with distant material sources. Their presence establishes movement, while leaving several possible chains of exchange and travel. Modern knowledge also includes people who care for these places. Writing in the Miami Tribe’s 2023 newspaper, Chief Douglas Lankford encouraged Myaamia people to visit the earthworks respectfully within their homelands. Logan York, identified there as the Tribe’s Historic Preservation Officer, described the builders’ abilities and pride in their recognition. These are named contemporary perspectives on responsibility and ancestral achievement.',
      cite('hopewell-nps', 'History & Culture: nonlocal materials'),
      cite(
        'hopewell-myaamia-2023',
        'The Chief Report, p. 3A, Hopewell paragraphs; Logan York, p. 5A',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'A plan is a dated act of recording',
      'The winter photograph and North Fork Works plan show different sites. The photograph records restored Mound City; the 1848 survey records Hopewell Mound Group. The latter includes a large enclosure, a smaller square and internal forms, alongside the nineteenth-century landscape. Its geometry is useful evidence, but its title and publication date belong to later observers. The name Hopewell came from a landowner. NPS’s account follows changing investigations, from earlier defensive readings to mapping and later magnetometry; these interpretations should remain distinguishable.',
      cite(
        'hopewell-moundgroup',
        'New to Science; Archeological Expeditions; 1848 North Fork Works illustration',
      ),
    ),
    sec(
      'Compare records without flattening time',
      'The separate 1848 Mound City plate supports a same-site comparison with the winter photograph. It shows the enclosure beside the Scioto River and a canal, with another circular work farther down the sheet. The canal belongs to the surveyors’ landscape, not the ancient building episode. The modern visitor map adds trails, parking and interpretation. Neither document is a single ancient phase. At Hopeton, later plowing and quarrying changed what remained above ground, while survey and excavation answer different spatial questions.',
      cite(
        'hopewell-moundcity',
        'Squier & Davis, c.1848 illustration; Site Map & Trail Map',
      ),
      cite('hopewell-hopeton', 'Slow Demise; Grand & Purposeful Construction'),
    ),
    sec(
      'Names and period boundaries need attribution',
      'The period labels have different scopes. Newark Earthworks Center’s FAQ places its archaeological culture around 100 BCE–400 CE; York’s 2023 article describes a wider Hopewell religious movement around 100 BCE–500 CE. The selected NPS inquiry remains 1–400 CE. None of these frames ends Indigenous presence or makes all structures contemporary. The Myaamia statements concern return and recognition in 2023, rather than preserving transcripts of ancient ceremonies.',
      cite('hopewell-newark-center', 'FAQ: What is the Hopewell Culture?'),
      cite(
        'hopewell-myaamia-2023',
        'p. 5A, broader period; p. 3A, homelands and respect',
      ),
      cite('hopewell-nps', 'Selected 1–400 CE focus'),
    ),
  ];
  s.evidenceReading = {
    title: 'A plan, a sampled wall and contemporary voices',
    introduction:
      'These supplied passages are editorial paraphrases. Spatial records, excavation results and named modern statements answer different questions; none replaces the others.',
    items: [
      {
        label: 'The North Fork Works plan and winter photograph record different sites',
        text: 'The 1848 North Fork Works plan records Hopewell Mound Group. The 2013 winter photograph shows restored Mound City. NPS describes documentary research and surviving bases behind the visible Mound City restorations.',
        interpretation:
          'Compare what kinds of evidence the images supply, rather than overlaying them as matching views. A historical plan, a modern restoration and a photograph each have their own dates. Neither records every ancient construction episode or ceremony.',
        citations: [
          {
            source: 'hopewell-moundgroup',
            locator: '1848 illustration; Archeological Expeditions',
          },
          {
            source: 'hopewell-moundcity',
            locator: 'Introduction; A National Park is Born',
          },
          {
            source: 'hopewell-nps-photo',
            locator:
              'Earlier 2026-10-27 asset-specific consultation; retained 2013 metadata',
          },
        ],
      },
      {
        label: 'One trench supplies a relative order and a reported date',
        text: 'The NPS project account, updated 20 July 2020, reports investigations carried out in 2001–02. Trenches crossing Hopeton’s square enclosure revealed topsoil removal followed by added soil layers. It associates a burned-log result in one trench with initial construction of one wall around 300 CE.',
        interpretation:
          'Stratigraphy supports an order of operations. The reported wood date constrains one investigation; its rounded estimate is not a calibrated probability interval supplied here. It cannot make all walls simultaneous. Nor does a material sequence identify the organization that recruited every worker.',
        citations: [
          {
            source: 'hopewell-hopeton-research',
            locator:
              'Ongoing Research, paragraph beginning Excavations during 2001 and 2002 and following paragraph',
          },
        ],
      },
      {
        label: 'Myaamia authors address responsibility and recognition',
        text: 'Chief Douglas Lankford’s 2023 report encourages respectful visits to the earthworks within Myaamia homelands. Logan York’s article in the same issue describes ancestral achievement and his participation in World Heritage recognition.',
        interpretation:
          'These are attributed contemporary perspectives published by the Miami Tribe of Oklahoma. They support an account of living relationships with these places; they are not transcripts of ancient beliefs, archaeological proof of one direct lineage or statements for all Native peoples.',
        citations: [
          {
            source: 'hopewell-myaamia-2023',
            locator: 'The Chief Report, p. 3A, Hopewell paragraphs; Logan York, p. 5A',
          },
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Follow the work before the mound',
    duration: '10–15 minutes',
    steps: [
      'Read the supplied source capsule together. Draw three boxes and give each reported stage a work verb.',
      'Choose two different materials in the capsule. Explain where each belongs in the sequence, without inventing a building size or a thickness for a layer.',
      'Make one claim about how people prepared a shared place. Name the supplied detail supporting it, then explain what further evidence would be needed to count the gatherings.',
      'If you compare the two older images, say their site names first: the winter photograph is Mound City; the North Fork Works plan is Hopewell Mound Group. They are not matching views of one place.',
    ],
    explanation:
      'Source capsule — editorial paraphrase of NPS Careful Construction: at Mound City, builders erected a poles-and-bark ceremonial building with a plastered clay floor. The building was deliberately dismantled before earthen mound additions. NPS reports layers and suggests building may have happened through repeated gatherings. Preparing a floor, dismantling and moving material are supported kinds of work; the capsule gives neither a counted schedule nor an identified commander. The separate historical plan is a later spatial record, not a picture of those operations.',
  };
  s.review = {
    consultedOn: '2026-10-29',
    reviewer:
      'Codex selected source consultation and internal author review; not independent historian or community approval',
    scope:
      'Work and gathering account, attributed wider context, three evidence readings, supplied family source capsule and separately sourced Mound City plan. Complete original identity, interval, claims, prior dimensions and original object order retained.',
    limitations: [
      'NPS construction descriptions and its 2001–02 Hopeton project account were consulted, not the original field notebooks or raw radiocarbon calibration tables. Around 300 CE belongs to one reported sampled-wall investigation; wood/sample age and all-site construction must not be conflated.',
      'Broader religious-movement and archaeological-culture conventions differ across York and Newark Earthworks Center. They remain attributed, while the original complete 1–400 CE case is unchanged. No exact Mound City phase dates, work-party counts, labor calendar or centralized state reconstructed.',
      'Contemporary 2023 Myaamia authors represent named perspectives on recognition, homelands and respect. Their statements are outside ancient phases and do not establish identical ancient beliefs or a lineage proved by artifacts. No protected or unrelated community material reproduced.',
      'Both inherited image pixels and two selected plan/map reproductions were actually inspected. The old NPS gallery source retains its 27 October asset-specific consultation; this renewal exposed only generic usage text. No current remote-byte parity or fresh asset-specific 2013 metadata verification claimed. Small historical scans stay small. The modern visitor map was inspected in research only; it is not the adopted 1848 survey.',
      'The Smithsonian catalogue was consulted as metadata, not the full book. The full UNESCO nomination and Benjamin Barnes essay were unavailable at the selected access scope and not read. Eastern Shawnee full-page and large Absentee Shawnee newsletter access gaps remain documented.',
      'Independent historian/community review, actual adult/family use, human screen-reader behavior, physical devices and physical print quality remain open.',
    ],
  };
  s.dimensions['place-context'] = {
    text: 'Mound City’s reported construction sequence, a Hopeton wall trench, Hopewell Mound Group’s historical plan and contemporary Myaamia statements locate different kinds of evidence. A modern property-center point or shared earthwork form does not establish a direct route, one building date or one state.',
    citations: [
      {
        source: 'hopewell-moundcity',
        locator: 'Careful Construction',
      },
      {
        source: 'hopewell-hopeton-research',
        locator: 'Ongoing Research',
      },
      {
        source: 'hopewell-moundgroup',
        locator: '1848 illustration; Archeological Expeditions',
      },
      {
        source: 'hopewell-myaamia-2023',
        locator: 'Printed pp. 3A and 5A',
      },
    ],
  };
  s.dimensionKeys = [
    ...new Set([...(s.dimensionKeys ?? Object.keys(s.dimensions)), 'place-context']),
  ];
}
