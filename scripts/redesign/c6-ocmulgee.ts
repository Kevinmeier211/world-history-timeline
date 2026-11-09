import type { Corpus, HistoricalContext, Media, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';
const article =
  'https://www.cambridge.org/core/journals/american-antiquity/article/collaborative-archaeology-public-parks-and-the-importance-of-chronology-at-ocmulgee-mounds-national-historical-park/307E03D57888AA1911F264D1B7A45A80';

const sources: Source[] = [
  {
    id: 'ocmu-household-work',
    title: 'Mississippian Culture: mounds, community and material work',
    institution: 'National Park Service, Ocmulgee Mounds',
    url: 'https://www.nps.gov/ocmu/learn/historyculture/mississippian-culture.htm',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Selected Mounds and Buildings, Community and Culture paragraphs actually read: staged earth construction, cultivation with wood/bone/stone tools, stored food in baskets and pottery, and coiling/modeling local clay. The short page was read for its broader framing, but older 900 arrival/1200 abandonment shorthand, mandatory strong-leader explanations, population totals and universal gender assignments are not adopted. These practical-work descriptions are a park synthesis, not a recovered household census or a dated crop inventory for the Earthlodge. No separately credited Dean Quigley or other source image copied.',
  },
  {
    id: 'ocmu-earthlodge-bulletin',
    title: 'The Earth Lodge: A Ceremonial Council Chamber',
    institution: 'National Park Service, Ocmulgee Mounds',
    url: 'https://www.nps.gov/ocmu/learn/historyculture/upload/Accessible-Earth-Lodge.pdf',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Both PDF pages read as extracted text: Overview, Architecture, Interior and continued Interior/Uses. The selected account uses room/log-support form, smaller rectangular homes, clay features and the bulletin’s explicit reconsideration of seat-size/status interpretation. Its older 1015 and population labels are not adopted as settled. Solar-calendar and spiritual explanations remain proposals; sacred-practice descriptions are not reproduced or made into a family reenactment. No PDF page pixels or bulletin photograph inspected/copied. No creation/publication year identified in the consulted text; no new measurement made from it.',
  },
  {
    id: 'ocmu-mvskoke-research-2026',
    title: 'Mvskoke citizens collaborate on Cambridge article',
    institution: 'Mvskoke Media',
    author: 'Braden Harper; reported statements of RaeLynn Butler and Turner Hunt',
    url: 'https://www.mvskokemedia.com/mvskoke-citizens-collaborate-on-cambridge-article/',
    type: 'primary',
    published: '2026-07-23',
    accessed: consulted,
    scope:
      'Article body, byline/date and Collaborative Research paragraphs actually read, including attributed Butler/Hunt statements about mutual benefit, Indigenous knowledge, historical narratives and continuing connections. No linked conference presentation, Arizona dating-method page or article photograph pixels consulted. The headline’s 1160 shorthand is not an exact construction date. Attributed current views do not establish approval by every descendant Nation/citizen, or approval of this atlas. Brief paraphrase only; article copyright and separately credited photographs remain distinct, with no open photo reuse licence claimed.',
  },
  {
    id: 'ocmu-earthlodge-plan',
    title: 'Ocmulgee Earthlodge: published feature drawing and excavation photographs',
    institution: 'American Antiquity 91(1), 183–206; Cambridge University Press',
    author:
      'Victor D. Thompson and University of Georgia Laboratory of Archaeology; drawing redrawn/adapted from Fairbanks 1946, Figure X',
    url: article,
    type: 'archaeology',
    published: '2025-12-19 online; January 2026 issue',
    accessed: consulted,
    scope:
      'Actual complete Figure 3 composite downloaded and visually inspected at 1600×1725: two excavation/timber photographs and a labelled feature drawing with bench seats, fallen roof posts, hearth, bird platform, cane entrance, internal supports, north symbol and 0–6 feet scale. The HTML caption has an internal panel mismatch: one clause calls C Council Chamber 2 excavations, while the actual C panel is the bird-platform drawing and the following caption sentence identifies a D-1 Earthlodge drawing. Use only that qualified D-1 feature-plan identification, never assign the drawing to Council Chamber 2. Article-specific CC BY 4.0 and Thompson/UGA courtesy/adaptation credit inspected; no restrictive separate Figure 3 credit seen. No original Fairbanks volume/WPA field notebook or other figure pixels consulted. No new survey, trace or source-plan crop performed in this packet.',
  },
];

const renewals: Record<string, string> = {
  'ocmu-earthlodge':
    'Complete visible Quick Facts/description and NPS/Martinson exterior credit read on 29 October 2026. The page, updated 15 August 2026, still gives 1015; its late-1930s CCC/WPA reconstruction and surviving clay are kept separate. No new exposure date or remote-image parity. The old date remains challenged by the collaborative study, not adopted as a settled construction year.',
  'ocmu-floor-image':
    'Specific Earth Lodge floor carousel caption and NPS credit read on the current homepage, updated 18 September 2026. It still says carbon dated 1015. The existing 526×339 local image was actually viewed without enlargement or modification; no exposure date or new remote-image byte parity supplied. The gallery text is not used to settle the building chronology or verify the entire site.',
  'ocmu-chronology':
    'Selected actual publisher HTML: title/authors/affiliations, Abstract, Introduction, The Earthlodge and Council Houses, Understanding the Broader Occupational History, Methods/Materials sampling opening, Results for Earthlodge/Council Chamber 2/Middle Plateau, selected Discussion and Conclusions. Figure 3 caption and actual downloaded pixels also inspected; its panel-reference inconsistency is recorded in the separate visual-source scope. Online publication 19 December 2025 differs from January 2026 issue; article-specific CC BY 4.0 and Authors 2025 copyright checked. Not every pretreatment paragraph, table cell, figure, reference or supplementary file read. No independent calibration/model rerun, exact replacement building date, settled migration route or complete community size inferred.',
  'ocmu-muscogee':
    'Early Interactions paragraphs on dalwa/town, surrounding villages, councils and town autonomy, and later removal/political-history paragraphs read on the page updated 23 October 2023. Broad population/death totals, current institutional quantities and universal office continuity are not adopted. Later town institutions do not supply the roll call of this medieval room. No National Geographic or other separately credited image copied.',
  'muscogee-councilhouse':
    'Complete The Council House history text read: bridge from southeastern homelands, Okmulgee in 1868, governmental use from 1878, dispossession/sale in 1919, recovery in 2010 and renovation in 2018. Home-page statement of Muscogee (Creek) Nation ownership also consulted. This is a separate Oklahoma building, not the Georgia Earthlodge. Photo carousel pixels not viewed or reused; no open image licence established. No unbroken identical architectural/political form or universal community assent inferred.',
};

export const ocmulgeeContext: HistoricalContext = {
  id: 'ocmulgee-public-buildings-context',
  title: 'Ocmulgee: public buildings and a changing settlement history',
  region: 'Americas',
  interval: {
    start: 1000,
    end: 1715,
    label: 'Selected post-1000 public-building and Middle Plateau inquiry, to 1715',
    precision: 'approximate',
    note: 'A source-qualified research frame for selected buildings and settlement evidence, not an Earthlodge construction/use interval. The study situates its inquiry after about 1000; 1715 is a documented trading-house boundary used for the Middle Plateau model, not the end of every Ocmulgee community or Muscogee history. The original disputed null/null case and both original alternatives remain intact. Modern excavation, reconstruction and community publications belong outside these phases.',
  },
  summary:
    'Built gathering places, household work and retained archaeological collections support different inquiries. Dating particular samples changes explanations of construction and occupation, while living Muscogee relationships are not reduced to the presence or absence of one archaeological layer.',
  subjectIds: ['ocmulgee-council'],
  citations: [cite('ocmu-chronology', 'Ocmulgee Mounds; Results and Discussion')],
  phases: [
    {
      year: 1100,
      label: 'Around 1100: an approximate interpretation for Council Chamber 2',
      title: 'Another public building enters the comparison',
      text: 'The authors discuss Council Chamber 2 as approximately contemporary with the Earthlodge, while its model remains imprecise. This is a separate building and an attributed model interpretation; it is not a new start date for the Earthlodge or proof that every public building was used together.',
      citations: [
        cite(
          'ocmu-chronology',
          'Results: Council Chamber 2; Discussion: The Earthlodge and Public Buildings',
        ),
      ],
    },
    {
      year: 1160,
      label: 'After about 1160: a timber constraint, not a completion date',
      title: 'A retained roof timber revises the familiar chronology',
      text: 'The selected roof-wood model places cutting sometime after about 1160. Preserved rings and their analysis constrain this material; they do not identify the day people finished the room. The authors retain a possible earlier structure from other observations and cane evidence.',
      citations: [
        cite(
          'ocmu-chronology',
          'Results: Earthlodge; Discussion: The Earthlodge and Public Buildings',
        ),
      ],
    },
    {
      year: 1324,
      label: '1324–1415 at 68%: a modeled maize-sample range',
      title: 'A short-lived sample tests a claimed occupation gap',
      text: 'Middle Plateau maize sample UGA 61307 has a reported modeled range of 1324–1415 at 68% and 1315–1425 at 95%. The authors could not resolve its double peak. This sample challenges a simple abandonment story in that area; it does not recover a settlement census or date use of the Earthlodge.',
      citations: [
        cite('ocmu-chronology', 'Results: Middle Plateau, UGA 61307 paragraph'),
      ],
    },
    {
      year: 1715,
      label: '1715: a documented boundary for one modeled area',
      title: 'A trading-house history helps constrain earlier features',
      text: 'The study uses the recorded destruction of the Macon Trading House in 1715 as a boundary for the Middle Plateau analysis. It describes relocation to other sites in the valley. This is not a disappearance date for people, a universal end of use or a newly reconstructed route.',
      citations: [
        cite(
          'ocmu-chronology',
          'Understanding the Broader Occupational History; Results: Middle Plateau',
        ),
      ],
    },
  ],
};

/** Full published composite only. Root may assess a labelled plan-only crop later. */
export const ocmulgeeFeaturePlanDraft: Media = {
  id: 'ocmulgee-earthlodge-feature-plan',
  subject: 'ocmulgee-council',
  source: 'ocmu-earthlodge-plan',
  title: 'Ocmulgee D-1 feature record',
  accession:
    'Thompson et al., Figure 3; D-1 drawing adapted from Fairbanks 1946, Figure X',
  creator:
    'Victor D. Thompson / University of Georgia Laboratory of Archaeology; adapted from Fairbanks',
  date: {
    start: null,
    end: null,
    label:
      'Modern published composite; drawing and exposure dates not separately supplied',
    note: 'Article published online 19 December 2025 and in the January 2026 issue. Those dates do not establish creation/exposure dates for the adapted drawing or archival photographs. Its cited Fairbanks publication is 1946, not an ancient construction date.',
    precision: 'unknown',
  },
  representedDate:
    'Excavation-state features of the D-1 Earthlodge and retained fallen timber, not a standing-roof reconstruction or one precisely dated ancient event',
  place:
    'Ocmulgee D-1 Earthlodge; no new geographic coordinate or plan georegistration',
  material:
    'Modern published composite of archival photographs and an adapted feature drawing',
  image: '/atlas/media/ocmulgee-earthlodge-figure3.png',
  thumbnail: '/atlas/media/ocmulgee-earthlodge-figure3-thumb.webp',
  width: 1600,
  height: 1725,
  printWidthMm: 170,
  alt: 'Two excavation and timber photographs above a circular feature drawing labelled with bench seats, fallen roof posts, a central fire pit, bird-shaped platform, cane entrance and internal supports; a north symbol and zero-to-six-feet scale sit beside it.',
  caption:
    'Excavated D-1 features, not a standing roof. Panel C’s Council Chamber 2 caption conflicts with its D-1 identification. Publication in 2025/2026 does not date the images or features.',
  printCaption:
    'Published D-1 feature drawing with excavation photographs. Fallen roof posts are not a standing roof. North/scale belong to the source drawing; its panel-caption inconsistency is recorded in the full source note.',
  notice: [
    'Follow the source labels from the entrance to the hearth, bench seats and bird-shaped platform.',
    'Which marks record fallen material rather than a completed standing building?',
  ],
  relevance:
    'Supplies an actually inspected labelled archaeological feature record, without substituting the modern protective exterior for the excavated floor or claiming a new measured survey.',
  credit:
    'Thompson et al., 2025/2026, Figure 3. Courtesy Victor D. Thompson and University of Georgia Laboratory of Archaeology; drawing adapted from Fairbanks 1946, Figure X.',
  printCredit:
    'Thompson et al., Fig. 3; courtesy Thompson/UGA; drawing after Fairbanks 1946, Fig. X.',
  rights:
    'The article publishes the composite under CC BY 4.0. The figure credits its archival photographs and adapted drawing without separately licensing those components.',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  sourceImage:
    'https://static.cambridge.org/binary/version/id/urn%3Acambridge.org%3Aid%3Abinary%3A20260130085358436-0047%3AS0002731625101066%3AS0002731625101066_fig3.png?pub-status=live',
  depiction: 'explanatory diagram',
  datingNote:
    'Keep original/publication, excavation, surviving-feature and modern reconstruction dates separate. No figure-creation year, exact roof completion or photographic exposure dates supplied.',
  additionalImages: [],
};

/** Root integration chooses the common comparison key; earlier dimensions stay intact. */
export const ocmulgeeWorkDimension = {
  text: 'Molded clay, practical household production and public gathering places reveal related kinds of work. Their interpretation depends on a particular room, sample, source and community relationship; neither one revised date nor one later council building supplies an unchanged institution for all people and periods.',
  citations: [
    cite('ocmu-household-work', 'Community and Culture paragraphs'),
    cite('ocmu-chronology', 'The Earthlodge and Council Houses; Discussion'),
    cite(
      'ocmu-mvskoke-research-2026',
      'Collaborative Research: Butler and Hunt statements',
    ),
  ],
};

export function applyCommunitiesOcmulgee(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'ocmulgee-council');
  if (!s) throw new Error('Ocmulgee continuation requires the existing disputed case');
  for (const [id, scope] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw new Error(`Ocmulgee continuation requires source ${id}`);
    const marker = 'Ocmulgee selected renewal, 2026-10-29:';
    if (!source.scope.includes(marker))
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker} ${scope}`;
    source.accessed = consulted;
  }
  for (const source of sources) {
    const index = c.sources.findIndex((row) => row.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  c.contexts = [
    ...(c.contexts ?? []).filter((row) => row.id !== ocmulgeeContext.id),
    ocmulgeeContext,
  ];
  s.contextIds = [...new Set([...(s.contextIds ?? []), ocmulgeeContext.id])];
  s.summary =
    'People shaped clay, raised supports, stored food and made places for gathering at Ocmulgee. Surviving features, retained samples and current Muscogee perspectives make different parts of that history visible. A revised timber date changes the inquiry without replacing the building’s disputed case with an invented construction span.';
  s.sections = [
    sec(
      'Making a room for gathering',
      'Building the Earthlodge joined several materials and tasks. People shaped clay into a floor, seats and a bird-shaped platform, while timber supported the roof. Its circular form differed from the smaller rectangular homes described in the park bulletin. A central hearth and arranged places to sit brought people into a shared space. The published feature drawing also records fallen roof posts: excavation preserves a building’s changes, rather than displaying every part as it originally stood.',
      cite('ocmu-earthlodge-bulletin', 'PDF p. 1, Architecture and Interior'),
      cite('ocmu-earthlodge-plan', 'Figure 3: labelled D-1 feature drawing'),
    ),
    sec(
      'Food and containers supported other work',
      'Daily production helped sustain life around the public buildings. The NPS account describes Macon Plateau farmers cultivating with wood, bone and stone tools, storing food in baskets and pottery, and forming pots from local clay. These activities turned plants and materials into supplies that could be kept and used. They extend the explanation beyond monumental building, while remaining a park synthesis rather than an inventory of one family’s meals or a roster of the Earthlodge’s builders.',
      cite('ocmu-household-work', 'Community and Culture paragraphs'),
    ),
    sec(
      'Different gathering places suggest different relationships',
      'Archaeologists identified more than one large public building at Ocmulgee. The collaborative study compares the Earthlodge with Council Chamber 2 and considers whether overlapping use could support smaller groups within the wider settlement. Meeting, debating and maintaining shared places could involve several communities. That remains an interpretation, not proof that one chief directed every task, that every lodge had the same function or that the occupants of each seat can be named.',
      cite(
        'ocmu-chronology',
        'The Earthlodge and Council Houses; Discussion: The Earthlodge and Public Buildings',
      ),
    ),
    sec(
      'Retained material makes new questions possible',
      'Researchers returned to wood and cane retained from the earlier excavations. Their analysis places cutting of a selected roof timber after about 1160, while other evidence leaves an earlier structure possible. The familiar 1015 label comes from older radiocarbon work. Those observations answer different questions. The clay floor survives beneath walls and ceiling reconstructed in the late 1930s; neither the exterior photograph nor a laboratory estimate supplies the day a complete room was finished.',
      cite(
        'ocmu-chronology',
        'Methods/Materials sampling; Results: Earthlodge; Discussion',
      ),
      cite('ocmu-earthlodge', 'Reconstruction paragraph and older 1015 label'),
    ),
    sec(
      'Living relationships shape research',
      'In Braden Harper’s 2026 report, RaeLynn Butler explains collaboration through mutual benefit and the value of Muscogee knowledge. Turner Hunt describes an opportunity to reframe histories that excluded Native voices. Their attributed perspectives help explain why the questions matter now. The Muscogee Nation’s Council House museum in Okmulgee presents a separate history of government, forced displacement and recovery. It is a later Oklahoma institution, connected through people and memory, rather than the same building transported from Georgia.',
      cite(
        'ocmu-mvskoke-research-2026',
        'Collaborative Research: Butler and Hunt statements',
      ),
      cite('muscogee-councilhouse', 'The Council House history'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A timber constraint is not a building birthday',
      'A tree grows before anyone cuts or uses it. The new Earthlodge analysis compares retained growth rings and radiocarbon measurements to constrain the timber’s history. The authors describe cutting sometime after about 1160, not a precisely observed construction event. An earlier cane sample and a reported burned layer leave earlier building work possible. Retaining the original disputed interval allows the different materials and interpretations to remain open to review.',
      cite(
        'ocmu-chronology',
        'Results: Earthlodge; Discussion: The Earthlodge and Public Buildings',
      ),
    ),
    sec(
      'A feature plan can record change',
      'The source drawing distinguishes bench seats, internal supports, hearth and entrance from fallen roof material. Read its labels as an interpreted excavation record. The modern exterior shelter protects ancient clay, but its roof cannot be used as an untouched ancient model. The NPS bulletin also questions an earlier inference that seat size mapped social rank. A visible difference can prompt a question without recovering its social meaning or the words spoken in the room.',
      cite('ocmu-earthlodge-plan', 'Figure 3 labels and caption qualification'),
      cite(
        'ocmu-earthlodge-bulletin',
        'PDF p. 2, Interior continued: seat-width interpretation',
      ),
    ),
    sec(
      'Continuity does not require an unchanged settlement',
      'The Middle Plateau dates challenge a simple occupation gap, but the study cannot yet distinguish a larger settlement from a few farmsteads throughout that period. A laboratory model is therefore not a census. The Council House’s own history follows a distinct later institution through governmental use, dispossession and regained control. Butler’s and Hunt’s current statements add their own priorities; they are not reconstructed ancient speeches or evidence that every descendant community endorses one account.',
      cite('ocmu-chronology', 'Results: Middle Plateau; Conclusions'),
      cite(
        'muscogee-councilhouse',
        'Governmental use, dispossession and recovery paragraphs',
      ),
      cite(
        'ocmu-mvskoke-research-2026',
        'Collaborative Research: Butler and Hunt statements',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'Surviving clay, dated wood and attributed voices',
    introduction:
      'These passages paraphrase the consulted sources. A photograph, an archaeological drawing, a laboratory model and present-day statements support different explanations.',
    items: [
      {
        label: 'The floor and the shelter have different histories',
        text: 'NPS identifies the clay floor as surviving material and the walls and ceiling as a late-1930s reconstruction. Its feature record includes arranged seats, a hearth and a raised bird-shaped platform.',
        interpretation:
          'The interior photograph supplies a visible clay-and-timber comparison; the source drawing adds feature relationships. Neither supplies an unchanged ancient roof, a roll call or a recovered discussion. The exterior is a modern protective building.',
        citations: [
          cite('ocmu-earthlodge', 'Reconstruction paragraph'),
          cite('ocmu-earthlodge-plan', 'Figure 3 feature labels'),
        ],
      },
      {
        label: 'The new date concerns a selected sample',
        text: 'The study places cutting of selected roof wood after about 1160 and retains a possible earlier building. It explains the old 1015 label as a median from earlier radiocarbon work.',
        interpretation:
          'A material date constrains a construction explanation without fixing its exact beginning or end. Other samples and assumptions matter; the original disputed case must not become a span drawn between unlike dates.',
        citations: [
          cite(
            'ocmu-chronology',
            'Results: Earthlodge; Discussion: older median and possible earlier structure',
          ),
        ],
      },
      {
        label: 'Current participants explain the value of collaboration',
        text: 'Harper attributes to Butler a model of research in which participants benefit and Muscogee knowledge matters; Hunt describes reframing narratives that previously excluded Native voices.',
        interpretation:
          'These are named contemporary perspectives reported by Mvskoke Media. Attribute them rather than turning them into an ancient belief, a universal position or approval of this atlas. No article photograph or protected knowledge is reproduced.',
        citations: [
          cite(
            'ocmu-mvskoke-research-2026',
            'Collaborative Research: Butler and Hunt statements',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Clay, shelter and two different kinds of evidence',
    duration: '10–15 minutes',
    steps: [
      'In the supplied interior photograph, find a raised clay feature and a wooden support. Describe where they are without guessing a person’s role.',
      'Compare the exterior photograph. Name one feature visible outside and one question about the floor that the outside view cannot answer.',
      'Read the source capsule together. Make two cards: a visible material and a dating claim that needs analysis.',
      'Make one supported statement. Ask what further evidence would be needed to identify a particular participant or the words spoken in the room.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: NPS distinguishes surviving archaeological clay from walls and roof reconstructed in the late 1930s. The older 1015 label is disputed by a collaborative study of retained samples. Selected roof wood was cut after about 1160, while an earlier structure remains possible. The photograph can show material and position; it cannot by itself supply the roof’s construction year, a list of participants or a conversation. Current Muscogee relationships are represented through attributed sources, not invented speeches.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected primary/institutional consultation and internal author review; not independent historian or community approval',
    scope:
      'Selected practical building and household work, three evidence readings, a supplied two-photograph family activity, separately qualified reference phases and an inspected published feature drawing. The entire original disputed interval, both alternatives/citations, identity, claims, old object order, dimensions and image bytes remain intact. A sample date and a research frame do not replace the unresolved building chronology.',
    limitations: [
      'No settled Earthlodge construction/use span supplied. The old 1015 median, later roof-timber constraint, possible earlier structure and distinct area/sample models must not be combined into an invented exact interval.',
      'The current NPS place page, gallery and bulletin still retain older date language. Practical-work passages do not establish a population count, universal gendered division of labor, necessary centralized chief or identical function for every structure.',
      'Selected publisher HTML and Figure 3 pixels were consulted; not the entire printed volume, every table/figure, original Fairbanks/WPA records, raw sample or supplementary model file. No independent calibration rerun. Council Chamber 2 and Middle Plateau estimates remain separate from the selected room.',
      'Figure 3 has an internal caption/panel mismatch. The inspected bird-platform drawing is used only as the qualified D-1 feature record, not a Council Chamber 2 plan. Its excavation-state fallen roof material is not a standing-roof reconstruction; no new survey or unrecorded plan crop is claimed.',
      'Both existing photographs retain their original bytes and unknown exposure dates. The small 526×339 interior scan gains no newly recovered detail. The included source composite has article-specific CC BY 4.0 and full source/adaptation credit; its modern creation/exposure dates are not supplied by publication dates.',
      'Butler and Hunt are named contemporary perspectives; the Council House is a distinct later Oklahoma institution. Neither collaboration nor an archaeological model supplies universal descendant assent, an unchanged institution, a geographic route or recovered ancient speech.',
      'Independent historian/community review, real family use, human screen-reader behavior, physical-device testing and physical print quality remain open.',
    ],
  };
}
