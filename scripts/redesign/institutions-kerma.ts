import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

/** Selected project text only; no unconsulted report or source artwork is adopted. */
const sources: Source[] = [
  {
    id: 'kerma-doukki-aibl',
    title:
      'Mission archéologique suisse-franco-soudanaise de Kerma-Doukki Gel (Soudan)',
    institution:
      'Académie des Inscriptions et Belles-Lettres; Kerma-Doukki Gel archaeological mission',
    url: 'https://aibl.fr/fouilles/mission-archeologique-suisse-franco-soudanaise-de-kerma-doukki-gel-soudan/',
    author: 'Séverine Marchi',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      "Selected consultation on 29 October 2026: Présentation paragraphs 1–3; La ville antique de Kerma paragraphs 1–3, including workshop paragraph; opening Le site de Doukki Gel paragraphs to the Classic Kerma nucleus. Selected text only, not complete project publications or figures. Author identification, selected bibliography and figure-credit list were additionally read in indexed AIBL text; no figure pixels inspected. Institutional mission summary, not a room-by-room excavation report No inspected measured plan or copied figure; functions are excavators' interpretations Proximity of workshops to cult areas does not alone prove a royal monopoly, individual worker status, production quotas or public distribution Newer account reports Kerma-period levels at Doukki Gel; do not repeat the older simplified claim that all occupation there began with Egyptian conquest A broad occupation sequence is not one continuous governing institution Figure credits identify Mission Kerma-Doukki Gel and individual creators (including M. Berti for city plan). No reusable licence verified. No image/plan downloaded, copied, traced or adapted. French text receives editorial English paraphrase.",
  },
  {
    id: 'kerma-city-project',
    title: 'Sites: City of Kerma',
    institution: 'Swiss archaeological mission of Kerma; kerma.ch project site',
    url: 'https://kerma.ch/en/site/',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      'Selected consultation on 29 October 2026: City of Kerma section, especially foundation/continuity paragraph, modified defences and house/courtyard descriptions. Selected Kerma Necropolis text and earlier Doukki Gel text encountered for scope comparison; later offering-production statements are not used for the second-millennium case. Undated older web synthesis with duplicated paragraph and unfinished image captions No full residential report or actual measured site-plan pixels consulted Do not generalize elite-neighbourhood interpretation to every resident Do not project Napatan/Meroitic bread/beer/meat offering workshops backward into this case Its conquest narrative and the History table use different endpoints; preserve source-specific date conventions No reusable image/plan licence verified; no source artwork copied.',
  },
  {
    id: 'kerma-history-project',
    title: 'History: Kerma region and kingdom',
    institution: 'Swiss archaeological mission of Kerma; kerma.ch project site',
    url: 'https://kerma.ch/en/history/',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      "Selected consultation on 29 October 2026: Location; Chronology table (Pre-Kerma through Egyptian occupation); selected Kingdom of Kerma paragraphs for food and ceramic-based periodization; selected Egyptian Occupation text only to identify transition/chronology limits. No original faunal/botanical sample dataset or excavation tables read Avoid source's strong environmental/wealth-driven collapse causation, warrior generalizations and aesthetic/priority rhetoric Pre-Kerma granaries belong to an earlier context and are not the city's contemporary storage count No dietary percentage, universal farming schedule or exact route introduced No source image/map copied; no reusable figure licence verified.",
  },
];

const context: HistoricalContext = {
  id: 'kerma-city-context',
  title: 'Kerma: a Nubian capital, production and changing relationships',
  region: 'Africa',
  interval: {
    start: -2500,
    end: -1500,
    label: 'c.2500–1500 BCE: selected Kerma urban history',
    precision: 'approximate',
    note: 'A selected regional reference, separate from the complete unchanged c.2050–1500 BCE case and the beaker’s c.1802–1640 BCE date. Archaeological phase conventions differ between the project and museum sources. The broad endpoint orients later political transition rather than dating one exact destruction event. No continuous Kerma-to-Taharqo polity is implied.',
  },
  summary:
    'Households, craft installations and political/religious buildings make work and institutions visible across a changing Nubian capital.',
  subjectIds: ['kerma-potters'],
  citations: [
    { source: 'kerma-doukki-aibl', locator: 'Présentation; La ville antique de Kerma' },
    { source: 'kerma-history-project', locator: 'Chronology' },
    { source: 'kerma', locator: 'Key Events' },
  ],
  phases: [
    {
      year: -2500,
      label: 'Around 2500 BCE: broad urban foundation frame',
      title: 'A city and its institutions develop',
      text: 'The city account places foundation around 2500 BCE. The earlier Pre-Kerma agglomeration has its own evidence; direct settlement continuity remains unproved.',
      citations: [
        {
          source: 'kerma-city-project',
          locator: 'City of Kerma: foundation paragraph',
        },
      ],
    },
    {
      year: -2050,
      label: 'Around 2050–1750 BCE: project Middle Kerma convention',
      title: 'Walls and institutional space',
      text: 'The project table associates this phase with fortifications, palaces and princely tombs. These are broad archaeological assignments, not an exact schedule for each building.',
      citations: [
        { source: 'kerma-history-project', locator: 'Chronology table: Middle Kerma' },
      ],
    },
    {
      year: -1750,
      label: 'Around 1750 BCE onward: differing Classical frames',
      title: 'Expansion and monumental institutions',
      text: 'The project associates Classic Kerma with expanded defences, temples and royal tombs and ends it around 1480 BCE. The Met’s Classical range instead ends around 1550 BCE. The selected beaker retains its own 1802–1640 BCE catalogue range.',
      citations: [
        { source: 'kerma-history-project', locator: 'Chronology table: Classic Kerma' },
        { source: 'kerma', locator: 'Key Events' },
        { source: 'met-545772', locator: 'Date' },
      ],
    },
    {
      year: -1500,
      label: 'Around 1500 BCE: reference endpoint and later transition',
      title: 'Political control changes across a wider interval',
      text: 'This is the selected teaching boundary, not a single exact conquest date. The project distinguishes a final transition around 1480–1450 BCE; the Met places Egyptian campaigns within its broader 1550–1070 BCE entry, with southern control by about 1450 BCE.',
      citations: [
        { source: 'kerma-history-project', locator: 'Kingdom of Kerma: Final Kerma' },
        { source: 'kerma', locator: 'Key Events: c.1550–1070 BCE' },
      ],
    },
  ],
};

const renewedScopes: Record<string, string> = {
  kerma:
    "Upper/Lower Nubia date labels, Overview and selected Key Events c.2050–1500 and c.1550–1070 BCE reconsulted 29 October 2026. Existing combined case interval remains complete and unchanged. Classical c.1750–1550 is this chronology's convention, distinct from project endpoints. Trade/conflict/diplomacy and later conquest are selected synthesis; aesthetic superlatives and unrelated cultural identity equations not adopted. No map copied or precise journey reconstructed.",
  'met-545772':
    'Selected Description and Artwork Details reconsulted on 29 October 2026; accession 20.2.45, visible date c.1802–1640 BCE and Abydos tomb 525 retained. Public Domain statement and official Met CC0 policy checked. Existing 1265 × 1600 local photograph actually inspected. Full excavation report, linked catalogues and API date correction not newly checked. Owner-as-trader remains a proposal; tentative coating interpretation stays qualified.',
};

/** Add reading and a distinct reference without changing the bounded case or object. */
export function applyKermaInstitutions(c: Corpus) {
  const s = c.subjects.find((subject) => subject.id === 'kerma-potters');
  if (!s)
    throw new Error('Kerma institutions require the existing kerma-potters dossier');
  for (const id of Object.keys(renewedScopes)) {
    if (!c.sources.some((source) => source.id === id)) {
      throw new Error(`Kerma institutions require existing source ${id}`);
    }
  }
  for (const [id, scope] of Object.entries(renewedScopes)) {
    const source = c.sources.find((row) => row.id === id)!;
    source.scope = scope;
    source.accessed = '2026-10-29';
  }
  for (const source of sources) {
    const existing = c.sources.find((row) => row.id === source.id);
    if (existing) Object.assign(existing, source);
    else c.sources.push({ ...source });
  }
  const contextIndex = (c.contexts ?? []).findIndex((row) => row.id === context.id);
  if (contextIndex < 0) c.contexts = [...(c.contexts ?? []), context];
  else c.contexts![contextIndex] = context;
  s.contextIds = [...new Set([...(s.contextIds ?? []), context.id])];
  s.summary =
    'A carefully finished beaker opens a wider inquiry into Nubian production, households and institutions. At Kerma, excavated craft installations and residential spaces place skilled work beside government and worship. This particular vessel was found at Abydos in Egypt; its documented context and the proposed identity of its owner remain different questions.';
  s.sections = [
    sec(
      'Skilled hands controlled contrasting surfaces',
      'The beaker’s dark upper surface and red body began with choices about clay, finishing and fire. The Met describes hand-forming, red ocher and polishing before firing. Inverting vessels in combustible material helped create reducing conditions for the black top and interior. These were connected operations that makers had to manage. The irregular boundary is visible in the photograph; the proposed coating and firing explanation come from the catalogue, rather than being established by color alone.',
      cite('met-545772', 'Description paragraphs1–2'),
    ),
    sec(
      'A capital organized different kinds of work',
      'Kerma was an independent Nubian capital with institutions beyond pottery production. Excavators identified residential quarters, royal buildings, administrative spaces, a circular audience hall and chapels around the principal temple. Craft installations occurred in several areas, especially near places of worship. Metalworking, faience and ceramics belonged to this setting. Placing those activities together shows how making, meeting and religious practice occupied an organized city; it does not establish that a king personally directed every workshop or that every worker had the same status.',
      cite(
        'kerma-doukki-aibl',
        'La ville antique de Kerma: urban buildings and workshops',
      ),
    ),
    sec(
      'Provisioning linked homes with the surrounding land',
      'The project’s residential account describes buildings arranged around courtyards, with kitchens, silos and other domestic annexes. Storing supplies and preparing meals gave household work a place in the city’s fabric. The broader livelihood account includes herding, plant resources, hunting and fishing. This setting helps explain why a finished vessel belongs in a history of production and provision, alongside the monumental buildings. It does not tell us the contents of this particular beaker, the share of each food in a diet or who performed each household task.',
      cite('kerma-city-project', 'City of Kerma: house and courtyard paragraph'),
      cite('kerma-history-project', 'Kingdom of Kerma: livelihood paragraph'),
    ),
    sec(
      'An Egyptian findspot opens a further question',
      'The selected vessel has its own history: the museum dates it around 1802–1640 BCE and records its discovery in Abydos tomb 525. Kerma ceramics and Egyptian goods occur together in comparable graves. The museum proposes that some owners might have been traders from Kerma living in Egypt. That possibility makes an interesting research question, but the ceramic tradition does not identify an individual’s birthplace, language or occupation. The documented grave is firmer evidence than the proposed biography.',
      cite('met-545772', 'Date; Geography; Description paragraph3'),
    ),
    sec(
      'Exchange and political relationships changed',
      'The Met’s regional chronology describes both trade and conflict between Kerma and Egypt. Imported objects entered elite tombs beside locally made equipment, while rulers negotiated alliances and contested control farther north. Later Egyptian campaigns changed the political setting. Keeping this sequence visible gives objects a changing institutional context instead of treating Nubia as a timeless source of distinctive pottery. Neither a traveled vessel nor a later Kushite royal name proves that the same government continued unchanged from Kerma to Taharqo’s much later reign.',
      cite('kerma', 'Key Events: c.2050–1500 and c.1550–1070 BCE'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Excavation changed the institutional explanation',
      'Reisner initially interpreted the deffufa and adjacent structures as an Egyptian trading establishment. The mission account explains how later excavation identified the religious centre of an independent Nubian capital. This change matters: evidence of Egyptian goods does not make the city an Egyptian institution. Urban layout and local production can alter an explanation built too narrowly around imported objects.',
      cite(
        'kerma-doukki-aibl',
        'La ville antique de Kerma: initial interpretation and renewed excavation',
      ),
    ),
    sec(
      'A courtyard is evidence at a particular scale',
      'Kitchens and silos make provision visible within residential arrangements. They do not supply a household census or a complete administrative budget. The older project website also discusses later bread, beer and meat-offering workshops at Doukki Gel. Those belong to Napatan and Meroitic contexts: carrying their functions backward would replace Kerma’s evidence with a different period’s institutions.',
      cite(
        'kerma-city-project',
        'City of Kerma: houses; Doukki Gel: Napatan/Meroitic annexes',
      ),
    ),
    sec(
      'Different clocks describe different investigations',
      'The preserved case covers approximately 2050–1500 BCE. The project table separates Middle Kerma around 2050–1750 from Classic Kerma around 1750–1480; the Met uses a Classical convention around 1750–1550. These are published archaeological frames, not the beaker’s own date. Its catalogue range stays 1802–1640 BCE even where a style label and a phase boundary overlap imperfectly. No new chronological model has been run here.',
      cite('kerma-history-project', 'Chronology table and ceramic-based periodization'),
      cite('kerma', 'Key Events: c.2050–1500 BCE'),
      cite('met-545772', 'Date and title'),
    ),
    sec(
      'Follow work without inventing its organization',
      'A workshop near a temple suggests a relationship worth investigating. To explain control over supplies or skilled labor, seek dated storage evidence, material analyses and records that identify actual arrangements. The excavated proximity alone does not settle ownership or obligation. This distinction makes comparison with later palaces and royal funerary institutions productive while keeping their different dates and social settings intact.',
      cite('kerma-doukki-aibl', 'La ville antique de Kerma: workshop locations'),
    ),
  ];
  s.evidenceReading = {
    title: 'Separate an observation, a record and a proposal',
    introduction:
      'The following are editorial paraphrases and source interpretations, not ancient quotations.',
    items: [
      {
        label: 'The photographed surface',
        text: 'The photograph shows a dark upper area, red lower body and irregular transition band. The catalogue supplies a manufacturing explanation.',
        interpretation:
          'Visible color is an observation; a firing method needs further evidence. The catalogue’s tentative coating explanation must remain tentative.',
        citations: [
          {
            source: 'met-545772',
            locator: 'Description paragraphs1–2; actual local photograph inspected',
          },
        ],
      },
      {
        label: 'A documented grave and a possible trader',
        text: 'Abydos tomb 525 is the recorded findspot. A trader from Kerma living in Egypt is the museum’s proposal for some comparable grave owners.',
        interpretation:
          'An object’s location does not automatically identify the buried person. Additional contextual and biographical evidence would have to test the proposal.',
        citations: [
          { source: 'met-545772', locator: 'Geography; Description paragraph3' },
        ],
      },
      {
        label: 'Institutions reconstructed through excavation',
        text: 'The mission identifies temples, houses, administrative buildings and craft installations in the capital.',
        interpretation:
          'Their spatial relationship informs an institutional account. It does not supply a payroll, production quota or proof of identical worker status.',
        citations: [
          {
            source: 'kerma-doukki-aibl',
            locator: 'La ville antique de Kerma: urban buildings and workshops',
          },
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Describe a surface; test a story',
    duration: '10–15 minutes',
    steps: [
      'Look at the supplied beaker photograph. Draw its outline and mark the dark area, red area and boundary between them. An adult can read the caption aloud.',
      'Read the supplied findspot statement. Label your sketch with the recorded place, Abydos tomb 525, separately from what you can see.',
      'Explain why the photograph and findspot do not tell you the buried person’s origin. Add one question that another record could help answer.',
    ],
    explanation:
      'The task separates direct observation, catalogue context and a possible biography. No reproduction or real clay firing is required.',
  };
  s.dimensions['material-work'] = {
    text: 'Controlled forming, finishing and firing belonged to a wider urban setting of craft, household provision and institutions. Workshop location, imported objects and a distinctive ceramic style require different evidence for organization and identity.',
    citations: [
      { source: 'met-545772', locator: 'Manufacture description' },
      { source: 'kerma-doukki-aibl', locator: 'La ville antique de Kerma' },
      { source: 'kerma-city-project', locator: 'City of Kerma: houses' },
    ],
  };
  s.dimensionKeys = Object.keys(s.dimensions);
  s.terms = [...new Set([...s.terms, 'provisioning'])];
  s.review = {
    consultedOn: '2026-10-29',
    reviewer:
      'Codex source consultation and author self-review; not independent historian approval',
    scope:
      'Selected account of Kerma manufacture, households and institutions, with a photograph-based family activity, original making guide, regional locators and a separate c.2500–1500 BCE reference. The bibliography details consultation and reuse limits.',
    limitations: [
      'The unchanged c.2050–1500 BCE case and the beaker’s c.1802–1640 BCE Abydos tomb 525 context remain distinct. Project Middle 2050–1750 and Classic 1750–1480 BCE conventions differ from the Met’s Classical 1750–1550 BCE; no endpoint is harmonized.',
      'Consultation covers selected project/institutional web text, excluding excavation volumes, the original Abydos grave report, household census and full faunal/botanical datasets. Cereal-storage and copper papers remain inaccessible; snippets are not full-paper consultation.',
      'Manufacture follows the catalogue; its glaze-like coating stays tentative. The photograph proves neither firing recipe nor contents. A possible trader remains an interpretation; birthplace, language, occupation, precise production place and travel route are unknown.',
      'Workshop proximity proves neither royal monopoly, quotas, worker status nor gendered tasks. Household/food explanation remains selective. Later Napatan/Meroitic offering workshops are not projected backward. Newer Kerma-period Doukki Gel levels remain distinct from the older founding narrative. Comparison with Taharqo establishes no continuous government.',
      'Project plan pixels were not inspected; figure reuse was not licensed or attempted. Met CC0 policy and the existing photograph were checked; original photograph/thumbnail bytes remain unchanged, without fresh source-image download or byte comparison.',
      'Independent historian/community, family, screen-reader, device and physical-print acceptance remain open.',
    ],
  };
}
