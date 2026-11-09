import type { Corpus, HistoricalContext, Source, Subject } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'middle-niger-urbanism-1981',
    title: 'The Inland Niger Delta before the Empire of Mali: Evidence from Jenne-Jeno',
    author: 'Roderick J. McIntosh; Susan Keech McIntosh',
    institution:
      'The Journal of African History 22(1), pp. 1–22; Cambridge University Press',
    url: 'https://www.cambridge.org/core/journals/journal-of-african-history/article/abs/inland-niger-delta-before-the-empire-of-mali-evidence-from-jennejeno/111CBA0644CA0D9EE7B3210C7A8F50F6',
    type: 'archaeology',
    published: '1981-01',
    accessed: consulted,
    scope:
      'Exposed Extract and author/issue/pages/DOI metadata read. Original issue January 1981, pp. 1–22, DOI 10.1017/S0021853700018983; displayed online date 22 January 2009 is separate. Selected early occupation, urban apogee 750–1100, neighboring settlements, staple foods and imported materials passages used. The complete 22-page article, its figures and original excavation records were not read. No settlement-density estimate, reconstructed trade route or precise material-source attribution adopted. Copyright Cambridge University Press 1981; no figure or source text reproduced.',
  },
  {
    id: 'middle-niger-recent-excavations',
    title: 'Results of recent excavations at Jenné-jeno and Djenné, Mali',
    author: 'Susan Keech McIntosh; Roderick J. McIntosh',
    institution:
      'Rice University, Department of Anthropology; conference paper hosted by the authors’ institution',
    url: 'https://anthropology.rice.edu/sites/g/files/bxs3341/files/inline-files/djennemuseumsite.pdf',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Selected text of the 12-page PDF: pp. 1–9, bibliography p. 11 and figure captions p. 12 read; only page images 5–6 visually inspected. Front matter names the February 2001 Bamako congress and says the paper is to appear in its proceedings; the surviving file cites a 2003 article. Exact version/publication date is unestablished, so no numeric publication date is assigned. Selected coring, changing domestic/funerary/artisanal uses, import distribution, erosion and non-simultaneous furnace concentrations used. Preliminary links between the growth of Djenné and decline of Jenné-jeno remain hypotheses. The 1999 colonial dispensary material is not evidence for medieval forced labor. Original field records, complete cited monographs and Clark’s underlying study were not read. Figure captions were read but figure pixels were not inspected or reused; no licence for a source plan was established. Raw PDF retained for local research only.',
  },
  {
    id: 'middle-niger-keita-2020',
    title: 'Excavating Empires of the Sahel: In Conversation with Daouda Keïta',
    author:
      'Daouda Keïta, interviewed by Isabella Garces; Will Fenstermaker and Isabella Garces, published interview',
    institution: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/perspectives/sahel-daouda-keita-archaeology-interview',
    type: 'primary',
    published: '2020-02-26',
    accessed: consulted,
    scope:
      'Published English interview body, header, translation note and selected caption read. The interview was conducted in French, translated and edited; no original recording or French transcript independently checked. Keïta speaks as a Malian archaeologist and museum director in 2020, not as a newly verified 2026 officeholder. Selected comments on community knowledge of land, accessible writing, cultural banks, artistic conception and critical cross-reading of oral history/archaeology used. Broad claims about borders, migration and named statuette identifications are not adopted. The separately captioned Musée national du Mali reclining figure R 88-19-275 is not Met accession 1981.218; its pixels were not inspected/reused. No universal community assent or endorsement inferred. Catalogue prose and interview images are not assumed CC0; no new image copied.',
  },
];

const renewals: Record<string, { date: string; text: string }> = {
  'met-314362': {
    date: '2026-10-26',
    text: 'Visible opening description, Artwork Details, Public Domain label and selected Met Open Access introduction read on 29 October. Thirteenth century, terracotta, Inland Niger Delta/Mali, accession 1981.218 and the 1981 purchase credit were confirmed. The narrative’s Jenne-jeno attribution is not a controlled excavated locus or contextual association for this specimen. Anxiety/prayer and illness are interpretive possibilities, not an adopted biography, diagnosis or established function. Actual unchanged front/back images and thumbnail were inspected and hashed; no remote-original byte parity or modern exposure date established. Provenance/reference tab contents and full audio were not freshly read; transcript unavailable. Direct raw HTML returned 429 and was not retried or bypassed; the official API web request was inaccessible. Earlier provenance consultation is retained separately. Existing CC0-image rights remain; no new image or catalogue-prose reuse claimed.',
  },
  'sahel-visual': {
    date: '2026-10-28',
    text: 'Header and selected Middle Niger/McIntosh paragraphs reread on 29 October in Alisa LaGamma and Hakimah Abdul-Fattah’s article dated 10 September 2020. Use remains an attributed archaeological argument about centralized state hierarchy; it does not establish a society without rules, inequality or leadership. Earlier Mansa Musa consultation, its date conflict and access limits remain separately retained, not freshly renewed. The full article and linked McIntosh/Gomez books were not read anew.',
  },
};

export const middleNigerWorkContext: HistoricalContext = {
  id: 'middle-niger-settlement-evidence',
  title: 'Middle Niger settlements: food, craft and changing places',
  region: 'Africa',
  interval: {
    start: 400,
    end: 1400,
    label: 'Selected archaeological phases, approximately 400–1400 CE',
    precision: 'approximate',
    note: 'A selected frame for excavated settlement evidence, not the whole lifespan of Middle Niger communities or of Jenné-jeno. Earlier occupation reaches the third century BCE in the 1981 extract; later people and places continued. The original thirteenth-century object interval remains separate. Neither site chronology nor modern acquisition dates establish this unprovenanced figure’s findspot or purpose.',
  },
  subjectIds: ['middle-niger'],
  summary:
    'Food production, exchange, building and furnace work connected settlements whose uses changed through time. The evidence invites comparison between forms of urban organization without supplying this figure’s missing biography.',
  citations: [
    cite('middle-niger-urbanism-1981', 'Exposed Extract'),
    cite('middle-niger-recent-excavations', 'PDF pp. 3–7'),
  ],
  phases: [
    {
      year: 400,
      label: 'Approximately 400–950: changing uses within the settlement',
      title: 'Places for living, work and burial',
      text: 'The report places cemetery/ritual areas in selected sectors during Phase III, approximately 400–950. Later house-floor burials have a different distribution. These excavated patterns are not a recovered setting for the Met figure.',
      citations: [
        cite('middle-niger-recent-excavations', 'PDF pp. 4–5: Phase III and IV uses'),
      ],
    },
    {
      year: 750,
      label: 'Approximately 750–1100: an urban high point',
      title: 'A town within a settled landscape',
      text: 'The 1981 article’s extract describes Jenné-jeno’s urban apogee in this range, alongside other large settlements. Staple foods and exchange belong to this account of urban growth; the clay figure is dated later.',
      citations: [
        cite(
          'middle-niger-urbanism-1981',
          'Exposed Extract: chronology and staple products',
        ),
      ],
    },
    {
      year: 1200,
      label: 'After approximately 1200: a proposed change in settlement focus',
      title: 'Testing a relationship between two places',
      text: 'Cores in Djenné yielded no pottery earlier than approximately 1000–1200. The excavators propose a relationship between its growth and Jenné-jeno’s decline after 1200, explicitly requiring more work. A preliminary sample does not establish the foundation date of every neighborhood.',
      citations: [
        cite(
          'middle-niger-recent-excavations',
          'PDF p. 3: preliminary coring and hypothesis',
        ),
      ],
    },
    {
      year: 1400,
      label: 'By approximately 1400: the reported end of occupation at Jenné-jeno',
      title: 'A site ending is not a people disappearing',
      text: 'The excavators use abandonment by 1400 for this site. That boundary does not end the history of the region or date every object attributed to it. Djenné’s different occupation history remains a separate inquiry.',
      citations: [cite('middle-niger-recent-excavations', 'PDF p. 3')],
    },
  ],
};

/** Unkeyed until a later bounded integration chooses a supported shared dimension. */
export const middleNigerWorkDimension: Subject['dimensions'][string] = {
  text: 'Excavated houses, granaries and furnace areas indicate building, storage and craft work across changing settlements. Their timing matters: the furnace concentrations did not all operate together, and none supplies this figure’s original setting.',
  citations: [
    cite(
      'middle-niger-recent-excavations',
      'PDF pp. 6–7: chronological and spatial variability',
    ),
  ],
};

export function applyEvidenceMiddleNiger(c: Corpus): void {
  const subject = c.subjects.find((row) => row.id === 'middle-niger');
  if (!subject) throw Error('Missing preserved Middle Niger dossier');
  for (const source of sources)
    if (!c.sources.some((row) => row.id === source.id)) c.sources.push(source);
  for (const [id, renewal] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw Error(`Missing prior source ${id}`);
    const marker = 'Selected 29 October 2026 Middle Niger renewal:';
    if (!source.scope.includes(marker))
      source.scope = `Prior consultation (${renewal.date}) retained: ${source.scope} ${marker} ${renewal.text}`;
    source.accessed = consulted;
  }
  if (!c.contexts) c.contexts = [];
  const context = c.contexts.findIndex((row) => row.id === middleNigerWorkContext.id);
  if (context < 0) c.contexts.push(middleNigerWorkContext);
  else c.contexts[context] = middleNigerWorkContext;
  subject.contextIds = [
    ...new Set([...(subject.contextIds ?? []), middleNigerWorkContext.id]),
  ];
  subject.summary =
    'A skilled clay figure and an excavated city answer different questions. Looking closely reveals a maker’s choices; settlement layers reveal food, building and craft work without recovering the figure’s lost biography.';
  subject.sections = [
    sec(
      'A maker’s choices remain visible',
      'A clay body bends around a raised knee; the head rests sideways, and arms draw the composition together. The back view shows raised oval forms and rows of small depressions. These are choices made in shaping a terracotta figure. Its maker gave a compact object a complicated posture. The museum dates it to the thirteenth century, but neither posture nor markings identify a named sitter, a feeling, an illness or a particular ritual. The broad Inland Niger Delta attribution does not supply a controlled excavation context.',
      cite(
        'met-314362',
        'Artwork Details; actual front/back images; interpretive limits',
      ),
    ),
    sec(
      'Food and materials supported urban life',
      'Jenné-jeno’s archaeology reaches far earlier than this object. Roderick and Susan McIntosh’s 1981 article describes a town growing among other settlements, with an urban high point around 750–1100. Its account connects rice, fish and fish oil with the region’s economy, alongside exchanged materials. People sustaining a town needed food as well as objects arriving from elsewhere. This makes cultivation, fishing and provisioning part of the urban story; imported valuables alone do not explain how a large community lived.',
      cite(
        'middle-niger-urbanism-1981',
        'Exposed Extract: settlements, staples and exchange',
      ),
    ),
    sec(
      'Places for work changed',
      'Later excavation reporting distinguishes domestic, burial and craft uses in different places and periods. Houses and granaries point to building and storage; furnace concentrations mark work involving heat. Dating showed that the sampled furnace areas were not all used together. A present-day scatter therefore cannot simply become a picture of simultaneous specialist neighborhoods. Reading the sequence helps recover people making and remaking places, rather than freezing the region at the date of the figure.',
      cite(
        'middle-niger-recent-excavations',
        'PDF pp. 4–7: changing uses and non-simultaneous activity',
      ),
    ),
    sec(
      'Organization is a question to investigate',
      'The Met’s Sahel essay presents McIntosh’s interpretation of urbanism without centralized state hierarchy. That is an argument to assess, not proof that everyone was equal or that leadership was absent. A figure, a household deposit and a settlement survey offer different scales of evidence. Keeping those scales distinct makes room for forms of cooperation that a single royal biography could obscure.',
      cite('sahel-visual', 'Selected Middle Niger/McIntosh discussion'),
    ),
  ];
  subject.deeperReading = [
    sec(
      'What survives affects the comparison',
      'The excavation report found limited variation in imported materials across sampled units and considered what that might mean for wealth. The authors also note that valuable textiles might not have survived. Erosion removed parts of the later occupation. A measure made from surviving imports cannot settle every kind of inequality, and an absent deposit may reflect loss rather than an unused place. The report’s proposed connection between Jenné-jeno’s decline and Djenné’s growth likewise remains a hypothesis, not an established movement of every household.',
      cite(
        'middle-niger-recent-excavations',
        'PDF pp. 3 and 5: hypotheses, erosion and import distribution',
      ),
    ),
    sec(
      'Knowledge of a place has living custodians',
      'In a 2020 interview, Malian archaeologist Daouda Keïta stresses local knowledge of land, accessible accounts and community participation in caring for heritage. He also calls for critical comparison between oral histories and archaeological remains. His published account was translated and edited from French. It offers an attributed perspective on how research should work, not a statement made by every community or an explanation of this particular figure. The Met’s 1981 purchase credit adds a modern acquisition date; it does not reconstruct the object’s earlier custody or an ancient owner.',
      cite(
        'middle-niger-keita-2020',
        'Local communities; oral histories and archaeological evidence; translation note',
      ),
      cite('met-314362', 'Artwork Details: purchase credit'),
    ),
  ];
  subject.evidenceReading = {
    title: 'A visible form, a dated sequence and an attributed voice',
    introduction:
      'These are editorial paraphrases and interpretations of different sources, not quotations or newly recovered information about a named person.',
    items: [
      {
        label: 'Object photograph and catalogue',
        text: 'The photographs show a bent body and patterned back. The catalogue identifies terracotta and a thirteenth-century date, while offering possible readings of the posture.',
        interpretation:
          'A visible detail can support a precise description without proving an emotion, diagnosis or use. The catalogue narrative’s Jenne-jeno attribution is not a recorded excavation locus for this specimen.',
        citations: [
          cite('met-314362', 'Actual images; Artwork Details and description'),
        ],
      },
      {
        label: 'Furnaces need a sequence',
        text: 'The excavation report discusses furnace concentrations at several mound sites. Its dating results indicate that these activity areas were not simultaneous.',
        interpretation:
          'Spatial separation alone cannot establish a single contemporary system of specialist districts. Chronology changes the organization that can reasonably be inferred.',
        citations: [
          cite(
            'middle-niger-recent-excavations',
            'PDF pp. 6–7: Clark’s preliminary findings',
          ),
        ],
      },
      {
        label: 'An archaeologist’s account of collaboration',
        text: 'Keïta’s 2020 interview links knowledge of land and heritage care with the participation of local communities; he asks researchers to compare oral sources critically with material evidence.',
        interpretation:
          'This is a named, translated and edited modern perspective. It does not supply universal community approval, a medieval constitution or the missing biography of Met accession 1981.218.',
        citations: [
          cite(
            'middle-niger-keita-2020',
            'Local-community and oral-source questions; translation note',
          ),
        ],
      },
    ],
  };
  subject.familyActivity = {
    title: 'Describe, compare, leave room',
    duration: 'About 8 minutes',
    steps: [
      'Look at the front and back views. Describe two shapes or marks without giving the person a feeling, a name or a diagnosis.',
      'Read this source capsule: the museum dates the figure to the thirteenth century. Excavated settlement traces include houses, granaries and furnace areas, but the sampled furnace areas were not all used at once. The figure has no established controlled findspot in those excavations.',
      'Complete two sentences: “The photographs show …” and “The settlement evidence suggests work such as …”. Then name one question that neither source answers about this person-shaped object.',
    ],
    explanation:
      'A head resting against a knee and raised marks are visible. Building, storing food and working with heat come from the supplied archaeology capsule, not from the posture. Who made the figure, why it was made and what the person represents remain open. Different evidence can explain a place without inventing an individual life.',
  };
  subject.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author checking; not independent historian, Malian community or conservator approval',
    scope:
      'A bounded reading: the unchanged object is paired with selected excavator reporting and an attributed Malian archaeological perspective. The complete original case interval, claims, object order, dimensions, identity, coordinates, image metadata and pixels remain preserved. The added reference is a separate selected archaeological frame.',
    limitations: [
      'The object’s controlled findspot, original function, maker, sitter, earlier custody and modern photographic date remain unestablished. Catalogue emotion/illness suggestions are not diagnoses or adopted biography.',
      'The 1981 paper was read only through its exposed extract. The selected Rice report has an uncertain surviving version/publication date; its fieldwork, conference and cited-publication dates remain distinct. Underlying full monographs and field records were not consulted.',
      'Modern furnace/household interpretations are sampled and dated; no single simultaneous, ethnic or occupational district plan is reconstructed. The colonial dispensary labor discussion is outside the medieval account.',
      'The inherited entry noted differing institutional endings for Jenné-jeno. This selected consultation did not freshly establish a second ending: the inspected excavation report and current Met text use by 1400. Neither dates the figure or a population’s disappearance.',
      'Keïta’s interview is translated and edited; no original French recording/transcript or universal community endorsement checked. Fresh provenance-tab consultation was unavailable after the recorded access failure. No new media, surveyed locator, route, source plan or annotation is supplied.',
    ],
  };
}
