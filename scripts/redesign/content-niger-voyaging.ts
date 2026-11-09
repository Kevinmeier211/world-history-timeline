import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

/**
 * Superseded narrower account. Do not apply it.
 * Prepared drafts already existed at
 * output/c6-evidence-preflight-2026-10-29/middle-niger/evidence-middle-niger.ts
 * and output/c6-evidence-preflight-2026-10-29/voyaging/c6-voyaging.ts.
 * Those consultations are reused by applyRemainingReading.
 * This file keeps the 29 October search-exposed Met/Te Ara replacement,
 * including its Kupe/Toi and 1999 reference, so that choice stays visible.
 * Reusing either draft is not a fresh source audit. Nothing in this file is called.
 */
export function applyNigerVoyaging(c: Corpus): void {
  applyMiddleNiger(c);
  applyPolynesianVoyaging(c);
}

function renew(c: Corpus, id: string, marker: string, text: string): Source {
  const source = c.sources.find((row) => row.id === id);
  if (!source) throw new Error(`Missing inherited source ${id}`);
  if (!source.scope.includes(marker)) {
    source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker}${text}`;
    source.accessed = consulted;
  }
  return source;
}

const middleNigerContext: HistoricalContext = {
  id: 'middle-niger-urban-study-context',
  title: 'One exhibition account of Jenne-jeno, 250 BCE–1400 CE',
  region: 'Africa',
  interval: {
    start: -250,
    end: 1400,
    label: 'Exhibition essay’s stated study span, 250 BCE–1400 CE',
    precision: 'range',
    note: 'These years come from the Met exhibition essay’s account of Jenne-jeno. They are not the thirteenth-century catalogue date of the seated figure, not a single abandonment year, and not a reconciled city biography. The essay also describes abandonment as a range from the early thirteenth century to 1400. The complete 1200–1300 object interval remains unchanged.',
  },
  summary:
    'A Met exhibition essay describes a long urban history at Jenne-jeno and reads it without assuming a centralized state. That account is wider than the date of one terracotta figure, whose original setting is still unresolved.',
  subjectIds: ['middle-niger'],
  citations: [
    cite('sahel', 'Archaeology: Jenne-jeno study span and abandonment window'),
    cite('sahel-visual', 'McIntosh and Middle Niger urbanism'),
  ],
  phases: [
    {
      year: -250,
      label: '250 BCE: the essay’s stated start of the urban study',
      title: 'A city is described before any one sculpture',
      text: 'The exhibition essay says Jenne-jeno was settled as early as the third century BCE and presents excavation as a study from 250 BCE to 1400 CE. It describes floodplain crops, an outer wall, mud-brick houses and an ethnically diverse population. It also points to beads and other items from as far as East and Southeast Asia as signs of exchange. These are the essay’s claims. They do not identify who modeled a later figure or where that figure was found.',
      citations: [
        cite(
          'sahel',
          'Archaeology: third century BCE, 250 BCE–1400, wall and exchange',
        ),
      ],
    },
    {
      year: 1200,
      label: '1200: the figure’s century meets one abandonment window',
      title: 'An object date is not a city’s ending',
      text: 'The seated figure is catalogued in the thirteenth century. The same essay places Jenne-jeno’s abandonment between the early thirteenth century and 1400, and says figurative sculpture became more common in that period. It says the few pieces from controlled excavations were built into house foundations as household shrines or were deliberately discarded. That pattern is not a findspot for this figure. Other institutional endings are not given new numbers here, and none of them is used as the figure’s production date.',
      citations: [
        cite('met-314362', 'Retained thirteenth-century catalogue date'),
        cite('sahel', 'Archaeology: abandonment window and excavated figures'),
      ],
    },
    {
      year: 1400,
      label: '1400: one side of the essay’s closing window',
      title: 'No centralized state is not the same as no authority',
      text: 'The year 1400 is the late side of the exhibition essay’s abandonment window and the end of its stated study span. LaGamma and Abdul-Fattah report Roderick McIntosh’s reading that Middle Niger settlement traces, including Jenne-jeno, show no evidence of a centralized state hierarchy. His 2005 book is named in that article and was not read for this account. Lack of that kind of evidence does not mean the city had no rules, inequality or leadership.',
      citations: [
        cite('sahel', 'Archaeology: study span through 1400'),
        cite('sahel-visual', 'McIntosh 2005 study, named but not read'),
      ],
    },
  ],
};

function applyMiddleNiger(c: Corpus): void {
  renew(
    c,
    'sahel',
    'Middle Niger selected renewal, 2026-10-29: ',
    'Search-exposed Archaeology passage of the exhibition essay, not a new full-page audit and not an excavation report. Used for the essay’s third-century BCE settlement, 250 BCE–1400 study span, floodplain, outer wall, mud-brick houses, diverse population, long-distance beads, abandonment from the early thirteenth century to 1400, scarce controlled-excavation figures, and the essay’s political self-governance interpretation. The 1977 start of the McIntosh excavations is the essay’s research date, not a city event. No figure, plan or map was copied.',
  );
  renew(
    c,
    'sahel-visual',
    'Middle Niger selected renewal, 2026-10-29: ',
    'Search-exposed Middle Niger paragraph: McIntosh’s analysis of Jenne-jeno and other Middle Niger sites found no evidence of centralized state hierarchy; the 2005 book is named and its customized terms are not quoted because the book was not read. Mansa Musa portrait discussion was not reopened.',
  );
  c.contexts ??= [];
  const at = c.contexts.findIndex((row) => row.id === middleNigerContext.id);
  if (at < 0) c.contexts.push(middleNigerContext);
  else c.contexts[at] = middleNigerContext;
  const s = c.subjects.find((row) => row.id === 'middle-niger');
  if (!s) throw new Error('Missing inherited Middle Niger case');
  s.contextIds = [...new Set([...(s.contextIds ?? []), middleNigerContext.id])];
  s.summary =
    'A thirteenth-century terracotta figure curls around a raised knee. Its modeling is visible, and its sitter, purpose and findspot are not. A Met exhibition essay gives Jenne-jeno a much longer urban history and argues against reading every such city as a kingdom. That history does not date this figure, and this figure does not prove how the city was governed.';
  s.sections = [
    sec(
      'Look at the figure before naming a life',
      'The bent posture and raised markings can be described. Anxiety, prayer, scarification and illness are guesses about a person whose name is unknown. The catalogue date is the thirteenth century, and the catalogue itself limits what controlled archaeology can say about the original meaning of works like this. Accession 1981.218 identifies a museum object. It does not identify a household, a shrine or a sitter.',
      cite('met-314362', 'Description, date and interpretive limits'),
    ),
    sec(
      'The essay’s city is older than the figure',
      'The exhibition’s archaeology passage says Jenne-jeno was settled as early as the third century BCE. It describes crops from the floodplain, an outer wall, crowded mud-brick houses and a diverse population, and it treats beads from East and Southeast Asia as signs of exchange. Those sentences are one institutional synthesis. They are not a site report read for this pass, and they do not draw a trade route for this sculpture.',
      cite('sahel', 'Archaeology: settlement, houses and exchange'),
    ),
    sec(
      'A missing kingdom is an argument, not an empty city',
      'The essay says the McIntosh excavations, begun in 1977, support a reading of economic connection and political self-governance, rather than explaining the city as the result of outside stimulation alone. The related Met article reports no evidence of a centralized state hierarchy. Self-governance, as the essay uses it, is an interpretation of settlement traces. It does not name officials, and it does not mean everyone had the same power.',
      cite('sahel', 'Archaeology: self-governance interpretation'),
      cite('sahel-visual', 'No evidence of centralized state hierarchy'),
    ),
    sec(
      'Keep the figure’s century separate from the city’s ending',
      'The essay places abandonment between the early thirteenth century and 1400, the same broad era as the figure and as an increase in figurative sculpture. It says the few sculptures from controlled excavations were placed in house foundations as shrines or were thrown away. This figure is not one of those excavated pieces. Published accounts do not agree on a single ending, and neither an abandonment window nor a museum date is the lifespan of the people who lived there.',
      cite('met-314362', 'Thirteenth-century object date'),
      cite('sahel', 'Abandonment window and excavated figures'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A research date is not a foundation date',
      'The essay dates the McIntosh excavations from 1977 and describes about three decades of work. That is when archaeologists studied the tell. It is not when the city began, and it is not the date of the terracotta. The 2005 book named in the article would be the place to read McIntosh’s own terms. Those terms are not supplied here because the book was not opened.',
      cite('sahel', '1977 excavation start'),
      cite('sahel-visual', '2005 book named, not read'),
    ),
    sec(
      'What the figure still cannot answer',
      'A public-domain museum photograph can show posture and marks. It cannot show whether the person was alive or imagined, or whether the object was a shrine, a discard or something else. The essay’s two settings for excavated figures are a warning against choosing one story for every Middle Niger sculpture. Provenance in the catalogue remains narrower than a biography.',
      cite('met-314362', 'Provenance and meaning limits'),
      cite('sahel', 'Household shrine or deliberate discard'),
    ),
  ];
  s.evidenceReading = {
    title: 'One object, one essay, two different clocks',
    introduction:
      'The figure and the city essay can sit beside each other only if their dates and their kinds of evidence stay apart.',
    items: [
      {
        label: 'The catalogue dates an object',
        text: 'The Met dates this seated figure to the thirteenth century and limits claims about its original meaning.',
        interpretation:
          'Use it for the object’s date and for visible pose. Do not turn markings into a diagnosis or a named life.',
        citations: [cite('met-314362', 'Date and description')],
      },
      {
        label: 'The essay dates a study of a city',
        text: 'The exhibition essay gives Jenne-jeno a study span from 250 BCE to 1400 CE and an abandonment window ending in 1400.',
        interpretation:
          'This is a synthesis of archaeological research. It is not a find record for accession 1981.218.',
        citations: [cite('sahel', 'Archaeology study span')],
      },
      {
        label: 'Hierarchy is a negative claim',
        text: 'The article reports that McIntosh found no evidence of centralized state hierarchy at these Middle Niger sites.',
        interpretation:
          'A negative archaeological claim is not a full political history. It blocks one model. It does not describe every form of authority.',
        citations: [cite('sahel-visual', 'Middle Niger paragraph')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Describe the figure without inventing a person',
    duration: '10–15 minutes',
    steps: [
      'Point to the raised knee and one other visible feature. Do not decide what the person feels.',
      'Put the figure’s thirteenth-century date on one card and the essay’s much longer city span on another.',
      'Say one thing the city essay can support, and one thing it cannot say about this object.',
      'Write a question that would need an excavation record rather than the museum page.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the museum figure is a thirteenth-century terracotta whose original use is uncertain. A separate exhibition essay describes Jenne-jeno as a city studied from about 250 BCE to 1400 CE and says researchers found no evidence of a centralized state. The essay is not a label for this figure. Do not stage a shrine, a market or a court.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Grok selected source consultation of search-exposed Met pages; not independent historian or community approval',
    scope:
      'The existing figure and the already cited Met exhibition and perspective essays. The object interval, identity, claims, dimensions and image stay in place. A separate reference span carries the essay’s city dates.',
    limitations: [
      'The object page was not reopened on 29 October 2026. Its earlier catalogue scope is retained, and no new visual detail was added.',
      'The exhibition sentences used here were search-exposed, not a fresh download of the whole essay. McIntosh’s 2005 book and the excavation monographs were not read. No second institution’s abandonment year was given a new number.',
      'No trade route, shrine identification, population count or image was added. This figure is not claimed as one of the controlled-excavation pieces.',
    ],
  };
}

const polynesianContext: HistoricalContext = {
  id: 'polynesian-settlement-practice-context',
  title: 'Settlement estimates and later practiced navigation, c.1250–1999',
  region: 'Southeast Asia/Oceania',
  interval: {
    start: 1250,
    end: 1999,
    label: 'Archaeological settlement window and selected later voyages, c.1250–1999',
    precision: 'range',
    note: 'The case interval remains the Te Ara settlement estimate of about 1250–1300 CE. Genealogical arithmetic, disputed early traditions, and the 1980 and 1999 canoe voyages are later or different clocks. None of them is an exact medieval landfall, and the modern voyages are not that landfall.',
  },
  summary:
    'Te Ara places permanent settlement of Aotearoa in a short archaeological window and also records other ways of dating arrival. Star navigation is taught knowledge. Twentieth-century voyages show that non-instrument navigation can be practiced again. They do not recover one thirteenth-century track.',
  subjectIds: ['polynesian-voyaging'],
  citations: [
    cite('nz-settlement', 'Summary and genealogical-dating page'),
    cite('navigation', 'Ocean voyaging and later canoe voyages'),
  ],
  phases: [
    {
      year: 1250,
      label: 'c.1250: the archaeological settlement window opens',
      title: 'Most evidence points to a late arrival',
      text: 'Te Ara says there is a lot of evidence that people from East Polynesia reached New Zealand around 1250–1300 CE. In the 1990s some rat bones were dated to about 50–150 CE. Because rats are not native and cannot swim so far, those dates once suggested an earlier human visit. Te Ara says most scientists now think that early date is inaccurate. The case keeps 1250–1300 and does not add a second settlement from the rat bones.',
      citations: [cite('nz-settlement', 'Story summary and the rat-bone debate')],
    },
    {
      year: 1300,
      label: 'c.1300: radiocarbon and a genealogical calculation',
      title: 'Two dating methods can sit near each other',
      text: 'On the genealogical-dating page, Te Ara says radiocarbon evidence indicates permanent settlement around 1300. It also says that many tribal genealogies counted in the early 2000s placed settlement 24 to 27 generations back. At an assumed 25 years per generation, that arithmetic gives 1325–1400. Te Ara says the two results broadly agree, and it says the agreement might be coincidence. The 25-year step is an assumption, not a measured generation.',
      citations: [cite('nz-settlement', 'Genealogical dating page')],
    },
    {
      year: 1325,
      label: '1325: one edge of the genealogical arithmetic',
      title: 'Traditions of earlier explorers stay disputed',
      text: 'The same page records traditions that Kupe, and in some accounts Toi, arrived before the main settlement canoes. It also records historians who argue that those early-arrival accounts grew from European ideas or other Pacific sources, and it says the traditions can instead place Kupe and Toi as real people around 1300–1400 or later. Te Ara does not decide between those readings. It says discovery may have come before large-scale settlement. That remains a suggestion, not a coastline that can be drawn.',
      citations: [
        cite('nz-settlement', 'Kupe, Toi and the unsettled early-arrival debate'),
      ],
    },
    {
      year: 1980,
      label: '1980: a modern non-instrument voyage',
      title: 'Revived practice is not the medieval voyage',
      text: 'Te Ara’s star-compass caption says that in the early 1970s the Polynesian Voyaging Society found Mau Piailug of Satawal, who could navigate without instruments. He guided Hōkūleʻa from Hawaiʻi to Tahiti. Nainoa Thompson repeated that journey in 1980. The page presents this as a revival of celestial navigation, drawing on Micronesian knowledge. It is not a dated canoe arrival in Aotearoa, and it is not a recovered medieval route.',
      citations: [
        cite('navigation', 'Star-compass caption: Piailug and Thompson, 1980'),
      ],
    },
    {
      year: 1999,
      label: '1999: a starred voyage from Rarotonga',
      title: 'A recent crossing shows a method, not a first landfall',
      text: 'Te Ara records that Te Au-o-Tonga sailed from Rarotonga to New Zealand in 1999, navigating by the stars. A completed modern voyage can show that the method is practicable and demanding. It cannot be traced backward into one thirteenth-century path, and it does not choose among the archaeological and genealogical dates above.',
      citations: [cite('navigation', 'Te Au-o-Tonga, Rarotonga to New Zealand, 1999')],
    },
  ],
};

function applyPolynesianVoyaging(c: Corpus): void {
  renew(
    c,
    'nz-settlement',
    'Voyaging selected renewal, 2026-10-29: ',
    'Search-exposed Te Ara story summary and genealogical-dating page. Used for the 1250–1300 arrival statement, the 1990s rat-bone dates of about 50–150 CE and the later judgment that they are inaccurate, radiocarbon settlement around 1300, the 24–27 generation count at an assumed 25 years, and the unresolved Kupe and Toi disagreement. No diagram or photograph copied. Page 2 was not claimed as a full earlier consultation.',
  );
  renew(
    c,
    'navigation',
    'Voyaging selected renewal, 2026-10-29: ',
    'Search-exposed canoe-navigation summary, ocean-voyaging page, locating-land page, star-compass caption and Te Au-o-Tonga caption. Used for memory and song as the form of route knowledge, back-sighting, star steering, swell steering, land signs, Mau Piailug, Hōkūleʻa, Nainoa Thompson in 1980, and the 1999 Rarotonga voyage. No song text, star-compass diagram, photograph or track was copied. The print URL remains this source.',
  );
  c.contexts ??= [];
  const at = c.contexts.findIndex((row) => row.id === polynesianContext.id);
  if (at < 0) c.contexts.push(polynesianContext);
  else c.contexts[at] = polynesianContext;
  const s = c.subjects.find((row) => row.id === 'polynesian-voyaging');
  if (!s) throw new Error('Missing inherited Polynesian voyaging case');
  s.contextIds = [...new Set([...(s.contextIds ?? []), polynesianContext.id])];
  s.summary =
    'Te Ara places the settlement of Aotearoa around 1250–1300 CE and keeps other dating methods beside that estimate. Rāwiri Taonui describes navigation as memorized knowledge of stars, swells and land signs. Later voyages, including Hōkūleʻa in 1980 and Te Au-o-Tonga in 1999, show practiced non-instrument sailing. They are not a map of the first crossing.';
  s.sections = [
    sec(
      'Archaeology and genealogies answer nearby questions',
      'The settlement story says people from East Polynesia arrived around 1250–1300, and that most scientists now reject rat-bone dates of about 50–150 CE as evidence of a much earlier visit. The next page says radiocarbon work points to permanent settlement around 1300. Genealogies of 24 to 27 generations, counted at 25 years each, give 1325–1400. Te Ara treats the closeness as broad agreement and allows that it may be coincidence. Neither method names a single canoe’s landing day.',
      cite('nz-settlement', 'Summary; genealogical dating; rat-bone debate'),
    ),
    sec(
      'Early names remain an argument',
      'Traditions identify Kupe, and sometimes Toi, before the main migration canoes. Te Ara also records historians who think those early arrivals were shaped by European or other Pacific ideas, and a reading in which both people belong around 1300–1400 or later. Accounts of voyagers finding people already in the North Island are part of the same discussion. They can suggest that discovery came before large settlement. They do not supply a track along the coast.',
      cite('nz-settlement', 'Kupe, Toi and prior occupation in tradition'),
    ),
    sec(
      'A route could be learned without a chart',
      'Taonui says voyage routes were kept in memory or song and lined up from mountains, rocks and trees to known star paths, a method he calls back-sighting. Navigators steered toward a horizon star and chose another when the first rose too high or set. Seven to twelve stars could carry a night, with the moon and planets such as Kōpō, Venus, and Pareārau, Jupiter. At dawn the sun took over. When cloud hid the sky, canoes held an angle to the long swells raised by the trade winds. A change in the canoe’s motion meant the course had changed. This is a description of taught skill. It is not a reconstruction of one medieval passage to Aotearoa.',
      cite('navigation', 'Ocean voyaging: memory, stars and swells'),
    ),
    sec(
      'Land could be noticed before it was seen',
      'Taonui says fishing birds, cloud color and wave patterns could tell navigators that land was ahead. He gives land-swell distances as a general method: bounce-back waves might be felt about 50 kilometres from a small island and as far as 300 kilometres from a land mass the size of New Zealand. Those are his stated ranges, not a measurement taken from a dated thirteenth-century landing. A tradition that whales, or the ancestor Paikea, guided a canoe is a tradition. It is not used here as the method that dates settlement.',
      cite('navigation', 'Locating land: birds, clouds, swells and tradition'),
    ),
    sec(
      'Modern voyages test a method',
      'The star-compass caption separates a twentieth-century revival from the settlement era. Mau Piailug, from Satawal, guided Hōkūleʻa between Hawaiʻi and Tahiti, and Nainoa Thompson sailed that route again in 1980. Te Au-o-Tonga reached New Zealand from Rarotonga in 1999 by the stars. These voyages show that non-instrument navigation is learnable and recent. They do not choose between 1250 and a genealogical generation count, and they do not draw the path of the first canoes.',
      cite('navigation', '1980 Hōkūleʻa voyage; 1999 Te Au-o-Tonga'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A generation count hides an assumption',
      'Twenty-five years per generation is a modern average used to turn whakapapa into calendar years. A different average would move 1325–1400. Te Ara already treats the match with radiocarbon dates as something that might be coincidence. Oral tradition also carries names, relationships and meanings that a radiocarbon range does not. Comparing them is useful only while each keeps its own kind of certainty.',
      cite('nz-settlement', 'Genealogical dating: 25-year assumption'),
    ),
    sec(
      'Do not turn a diagram into an ancient instrument',
      'The star compass in the Te Ara caption belongs to the Hōkūleʻa story and to Mau Piailug’s teaching. A Māori star compass is described there as houses around the horizon. Neither diagram was copied, and neither is a surviving instrument from about 1250. Song is named as one way routes were remembered. No song is reproduced. Absence of a paper chart is not absence of knowledge, and a modern diagram is not the medieval voyage.',
      cite('navigation', 'Star-compass caption; routes preserved in song'),
    ),
  ];
  s.evidenceReading = {
    title: 'Three clocks for one ocean',
    introduction:
      'Settlement dates, navigational skill and recent canoe voyages come from different pages and different centuries.',
    items: [
      {
        label: 'A settlement window',
        text: 'Te Ara’s summary places arrival around 1250–1300 and sets aside the early rat-bone dates.',
        interpretation:
          'The case interval follows that window. It is not a day of landfall and not the beginning of Māori identity.',
        citations: [cite('nz-settlement', 'Story summary')],
      },
      {
        label: 'A method without a dated track',
        text: 'Taonui describes stars, swells and memory as the means of ocean navigation.',
        interpretation:
          'The description supports skilled practice. It does not identify which star path a particular thirteenth-century canoe used.',
        citations: [cite('navigation', 'Ocean voyaging')],
      },
      {
        label: 'A voyage with its own year',
        text: 'Te Au-o-Tonga sailed from Rarotonga to New Zealand in 1999, and Thompson’s Hōkūleʻa voyage was in 1980.',
        interpretation:
          'Use these years for modern practice. Do not slide them back onto the settlement estimate.',
        citations: [cite('navigation', '1980 and 1999 voyage captions')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Separate a skill from a landing date',
    duration: '10–15 minutes',
    steps: [
      'Name one sign a navigator could use by day and one by night. Use the capsule, not a copied diagram.',
      'Place 1250–1300, the genealogical count, and 1999 on three separate cards.',
      'Explain why a canoe sailed in 1999 cannot show the exact path of the first arrival.',
      'Write one question this page cannot answer about a named ancestor.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: Te Ara estimates settlement around 1250–1300 CE. Taonui describes navigation by remembered star paths and by ocean swells when the sky is hidden. A 1980 voyage and a 1999 voyage show later practice. Do not stage a voyage, copy a star compass, or sing a route.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Grok selected consultation of search-exposed Te Ara pages; not independent Māori, navigator or historian approval',
    scope:
      'The existing Te Ara settlement and canoe-navigation sources. The 1250–1300 case interval stays exact. A longer reference frame holds genealogical arithmetic and two modern voyages.',
    limitations: [
      'The pages were search-exposed on 29 October 2026, not a full reread of every Te Ara subpage or the print layout as one document. No image, diagram or song was copied.',
      'Canoe-tradition narratives and the NZ History voyaging page were not adopted. Kupe and Toi remain disputed in the Te Ara text itself.',
      'Land-swell distances are Taonui’s general figures. They are not a measurement from a thirteenth-century landing. No exact medieval track is drawn.',
    ],
  };
}
