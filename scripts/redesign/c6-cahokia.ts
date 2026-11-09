import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'cahokia-isas-urban-work',
    title: 'Cahokia',
    institution: 'Illinois State Archaeological Survey, University of Illinois',
    url: 'https://www.isas.illinois.edu/research_2/cahokia',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Selected main opening and Ancient Urbanism, Resource Management and Exploitation, Climate Change, and Corn and Cuisine paragraphs. Undated living institutional page; no current fieldwork-status claim. East St. Louis precinct homes/public/religious buildings and changing neighborhood organization provide a specific urban context. Estimated population/mound totals are not adopted as exact; the limestone/pottery/recipe connection is a hypothesis, not a recovered universal menu. Broad environmental assurances are limited by the separately cited local soil study, not extended to every waterway or resource. No source image pixels, linked excavation reports, surveyed neighborhood boundary or reuse licence established; no figure or map copied.',
  },
  {
    id: 'cahokia-neighborhoods-2019',
    title: '9 Elements of Cahokian Neighborhoods',
    author: 'Alleen Betzenhauser; Timothy R. Pauketat',
    institution:
      'Archaeological Papers of the American Anthropological Association 30(1), pp. 133–147; Wiley/AAA',
    url: 'https://anthrosource.onlinelibrary.wiley.com/doi/abs/10.1111/apaa.12118',
    type: 'archaeology',
    published: '2019-07-04',
    accessed: consulted,
    scope:
      'Publisher authors/affiliations, first-publication date, issue/pages/DOI and complete exposed abstract consulted. DOI 10.1111/apaa.12118. Full-text link redirected to the same abstract page; full 15-page paper, underlying excavations, tables, plans and linked bibliography not read. Abstract compares architectural diversity, density, position and craft debris in late-eleventh-century neighborhood formation. Residential classification and proposed religious/political/ethnic organization remain interpretations, not exact occupants, labor assignments, universal household beliefs or recovered neighborhood borders. No source figure pixels inspected or open adaptation licence established; no geometry copied or traced.',
  },
  {
    id: 'cahokia-copper-2011',
    title: 'Metallurgical analysis of copper artifacts from Cahokia',
    author:
      'Matthew L. Chastain; Alix C. Deymier-Black; John E. Kelly; James A. Brown; David C. Dunand',
    institution:
      'Journal of Archaeological Science 38(7), pp. 1727–1736; author-hosted copy, Northwestern University',
    url: 'https://www.dunand.northwestern.edu/pdf/chastain2011.pdf',
    type: 'archaeology',
    published: '2011',
    accessed: consulted,
    scope:
      'Selected actual PDF text: title/abstract/introduction and early Materials 2.1 selection statement, printed pp. 1727–1728 (PDF 1–2); discussion 4.2–4.6 and Conclusion 5, printed pp. 1734–1736 (PDF 8–10), with adjacent 4.1 text and table captions encountered. DOI 10.1016/j.jas.2011.03.004. Not a full ten-page/methods/laboratory-data consultation or figure/micrograph-pixel inspection. Eight unfinished pieces came from Perino’s 1956 Mound 34 backdirt; c.1200 workshop-house dating is attributed through earlier field reports, not newly calibrated. Modern replication and metallography support repeated hammering/annealing, without a recoverable total cycle count, exact ancient heating schedule, named worker, finishing technique or transport route. PDF ©2011 Elsevier Ltd, all rights reserved; no artifact photo, micrograph, plot or plan copied/traced.',
  },
  {
    id: 'cahokia-soils-2021',
    title:
      'Evaluating narratives of ecocide with the stratigraphic record at Cahokia Mounds State Historic Site, Illinois, USA',
    author: 'Caitlin G. Rankin; Casey R. Barrier; Timothy J. Horsley',
    institution: 'Illinois Experts; Geoarchaeology 36(3), pp. 369–387',
    url: 'https://experts.illinois.edu/en/publications/evaluating-narratives-of-ecocide-with-the-stratigraphic-record-at/',
    type: 'archaeology',
    published: '2021-05; first online 2021-02-12',
    accessed: consulted,
    scope:
      'Complete exposed institutional author-record abstract, author list, issue/pages, DOI and online/issue metadata read. DOI 10.1002/gea.21848. Full 19-page paper, profiles, samples, tables and figure pixels not consulted. A stable buried ground surface around a Cahokia Creek floodplain mound from Mississippian occupation to the mid-1800s does not support the tested wood-overuse/erosion/flooding mechanism there. This local finding does not rule out every environmental impact, flood or climate pressure, identify one cause of urban change or settle the separate Horseshoe Lake population-proxy disagreement. No source figure/plan copied and no figure permission inferred from the abstract.',
  },
  {
    id: 'cahokia-osage-history-2013',
    title: 'Osage Cultural History: Ancestral Osage Geography',
    author:
      'Dr. Andrea A. Hunter; underlying excerpt credited Andrea A. Hunter, James Munkres and Barker Fariss',
    institution: 'Osage Nation Historic Preservation Office',
    url: 'https://www.osagenation-nsn.gov/who-we-are/historic-preservation/osage-cultural-history',
    type: 'primary',
    published: '2013 report excerpt; webpage date unverified',
    accessed: consulted,
    scope:
      'Webpage title/excerpt provenance, selected Ancestral Osage Geography section and opening linguistic framing consulted. The page identifies a 2013 Clarksville Mound Group claim/report, pp. 1–60; that complete report and underlying archaeological/oral/linguistic sources were not read. Hunter connects ancestral Osage geography with Cahokia/St. Louis using several forms of knowledge. This named tribal-government account is attributed, not an assertion that all Cahokians had one modern identity, an adjudication of every affiliation or approval of this atlas. Clarksville is a different site/context; detailed funerary material is not used. No source map/image copied or reusable licence established.',
  },
  {
    id: 'cahokia-peoria-visit-2022',
    title: 'ISAS hosts Peoria Tribe visit to Cahokia Mounds',
    author: 'Elizabeth Watts Malouchos',
    institution: 'Prairie Research Institute News, University of Illinois',
    url: 'https://blogs.illinois.edu/view/7447/842733837',
    type: 'archive',
    published: '2022-07-22',
    accessed: consulted,
    scope:
      'Complete short article, byline/date, captions and photo-credit text consulted; actual photograph pixels not inspected. Reports a Peoria Tribe of Indians of Oklahoma Business Committee visit earlier that summer, discussion of nondestructive geophysics and stewardship. Article publication is not an exact visit date, and named roles are reported for 2022 rather than verified as current. University-authored account is not a verbatim tribal-government statement or universal assent to a particular interpretation or this atlas. Photos credited Robert Rohe; no open reuse licence established and no source photograph/map copied.',
  },
];

const context: HistoricalContext = {
  id: 'cahokia-neighborhoods-making-context',
  title: 'Cahokia: neighborhoods, making and material evidence',
  region: 'Americas',
  interval: {
    start: 1050,
    end: 1200,
    label: 'Selected neighborhood and making evidence, c. 1050–1200 CE',
    precision: 'approximate',
    note: 'A bounded inquiry from the inherited urban reorganization orientation around 1050 through the copper paper’s attributed workshop context around 1200. It is not a new city lifespan, common ethnic identity or end of making. The complete original case remains 1050–1400. Soil evidence covers a broader span; the later population-proxy debate, 1907 print and modern community accounts keep their own dates.',
  },
  summary:
    'Homes, public buildings and craft debris help reveal urban relationships. Unfinished copper and a local soil test connect particular materials with particular questions, without making one photo or proxy a complete history of the city and its people.',
  subjectIds: ['cahokia-city'],
  citations: [
    cite(
      'cahokia-illinois',
      'Retained 27 October scope: urban reorganization around 1050',
    ),
    cite(
      'cahokia-neighborhoods-2019',
      'Publisher abstract: late-eleventh-century neighborhoods',
    ),
    cite('cahokia-copper-2011', 'Printed p. 1728: attributed c.1200 workshop context'),
  ],
  phases: [
    {
      year: 1050,
      label: 'Around 1050: the inherited urban-investigation orientation',
      title: 'Settlement includes more than a monumental core',
      text: 'The retained Illinois source scope places organized earthmoving and urban reorganization around 1050. A later ISAS research summary describes homes interspersed with public and religious buildings in the East St. Louis precinct. These are specific places within Greater Cahokia, not a border around every Mississippian community or proof of one household form.',
      citations: [
        cite(
          'cahokia-illinois',
          'Retained 27 October scope: urban core and reorganization',
        ),
        cite('cahokia-isas-urban-work', 'Ancient Urbanism paragraph'),
      ],
    },
    {
      year: 1100,
      label: 'Late eleventh century: neighborhoods being created and reconfigured',
      title: 'A building pattern needs an interpretation',
      text: 'Betzenhauser and Pauketat compare architectural diversity, density, placement and craft-production debris in neighborhoods at Cahokia and East St. Louis. Their abstract asks how to distinguish homes from other occupational zones and interprets social and religious organization. The marker 1100 orients the reported late-eleventh-century frame; it is not an exact construction year, count of residents or recovered household roster.',
      citations: [cite('cahokia-neighborhoods-2019', 'Publisher abstract')],
    },
    {
      year: 1200,
      label: 'Around 1200: an attributed Mound 34 workshop context',
      title: 'Small unfinished pieces reveal a working process',
      text: 'The 2011 copper paper attributes a workshop-house context to the early Moorehead phase around 1200 through previous field reports. Its eight studied pieces came from old excavation backdirt. Metallographic observations and modern comparisons support an interpretation of repeated hammering and annealing; they do not date each piece precisely or identify a named worker. This ends the selected evidence frame, not city life or Indigenous history.',
      citations: [cite('cahokia-copper-2011', 'Printed pp. 1727–1728; 1734–1736')],
    },
  ],
};

export const cahokiaWorkDimension = {
  text: 'Homes and public buildings formed changing neighborhoods, while unfinished copper and local soil evidence reveal particular tasks and environmental questions. Material patterns require context before they become claims about households, authority or regional population.',
  citations: [
    cite('cahokia-neighborhoods-2019', 'Publisher abstract'),
    cite('cahokia-copper-2011', 'Selected material and process discussion'),
    cite('cahokia-soils-2021', 'Institutional author-record abstract'),
  ],
};

export function applyCommunitiesCahokia(c: Corpus): void {
  const s = c.subjects.find((subject) => subject.id === 'cahokia-city');
  if (!s) throw new Error('Cahokia continuation requires the existing case');
  for (const source of sources) {
    const index = c.sources.findIndex((existing) => existing.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  c.contexts = [
    ...(c.contexts ?? []).filter((existing) => existing.id !== context.id),
    context,
  ];
  s.contextIds = [...new Set([...(s.contextIds ?? []), context.id])];
  s.summary =
    'Neighborhoods, buildings and skilled work made Cahokia a lived city. Excavated spaces, unfinished copper and local soil evidence explain different parts of that life. A much later photograph and attributed Osage and Peoria accounts keep urban change distinct from the disappearance of Indigenous peoples.';
  s.sections = [
    sec(
      'Homes within an urban landscape',
      'People made a city through more than the building of mounds. In an excavated neighborhood of Greater Cahokia’s East St. Louis precinct, homes were interspersed with public and religious buildings. Betzenhauser and Pauketat compare architectural diversity, density, placement and craft debris to investigate how neighborhoods were created and reconfigured. Identifying a home or workshop requires context, rather than treating every building outline as an identical household. ISAS also connects new pottery forms and limestone with possible ways of preparing maize: an interpretation of material evidence, rather than a complete recovered menu.',
      cite('cahokia-isas-urban-work', 'Ancient Urbanism; Corn and Cuisine paragraphs'),
      cite('cahokia-neighborhoods-2019', 'Publisher abstract'),
    ),
    sec(
      'Making sheet copper',
      'Near Mound 34, skilled making can be investigated through small metal remains. Chastain and colleagues studied eight unfinished copper pieces from earlier excavation backdirt. Their analysis and modern experiments support repeated hammering and annealing, a heating process that softens worked copper for further shaping. Material examination therefore helps explain a sequence of tasks, beyond calling an object a prestige good. The pieces reveal a stage in making sheet, rather than a completed ornament or the identity and working conditions of its maker.',
      cite('cahokia-copper-2011', 'Printed pp. 1727–1728; 1734–1736'),
    ),
    sec(
      'Testing an environmental explanation',
      'Building, cooking and making used resources. Their effects can be investigated through soils as well as through the objects left behind. Rankin, Barrier and Horsley tested a proposed chain from excessive wood use to erosion and flooding. Their abstract reports a stable buried ground surface around one Cahokia Creek floodplain mound, extending from Mississippian occupation to the nineteenth century. That local finding does not support the expected mechanism there. It also does not settle every environmental question or turn one measured place into a history of the entire region.',
      cite('cahokia-soils-2021', 'Institutional author-record abstract'),
    ),
    sec(
      'Later records and living relationships',
      'The supplied 1907 print shows a surviving earthwork and planted ground, long after the urban era. Its open view cannot count medieval houses or demonstrate an empty later region. In the Osage Nation’s published preservation account, Andrea Hunter connects ancestral history with the Cahokia and St. Louis area. A university report describes Peoria government representatives discussing research and stewardship during a 2022 visit. These attributed accounts make continuing relationships visible. They do not assign every ancient resident one identity or imply that communities have approved this atlas.',
      cite(
        'cahokia-loc-1907',
        'Retained 27 October catalogue scope; unchanged photograph',
      ),
      cite('cahokia-osage-history-2013', 'Selected Ancestral Osage Geography section'),
      cite(
        'cahokia-peoria-visit-2022',
        'Visit, consultation and stewardship paragraphs',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'What one piece cannot reveal',
      'The copper study’s material was unfinished and recovered from old backdirt, rather than eight intact ornaments found in use. The authors explain that microstructure records recent working and heating, while earlier cycles can be obscured. Modern replication tests whether a proposed process can produce similar evidence. It does not recover a precise ancient schedule, total work hours or the organization of every craft household. The c.1200 workshop attribution comes through previous field reports, not a fresh date measured on each metal piece.',
      cite(
        'cahokia-copper-2011',
        'Printed pp. 1728, 1734–1736: selection and inference limits',
      ),
    ),
    sec(
      'A soil profile and a lake proxy answer different questions',
      'The inherited 2020 White study and 2021 Skousen–Aiuvalasit critique disagree about post-1400 population reconstruction around Horseshoe Lake and the attribution of particular populations. Their previously documented scopes remain in place; no new exact population curve is adopted here. The soil study tests a different mechanism at a different location. Neither evidence stream becomes a direct census, and one local negative result cannot erase all resource pressures. Keep the question, sampled setting and interpretive step connected.',
      cite('cahokia-after', 'Retained 27 October abstract/design scope'),
      cite('cahokia-critique', 'Retained 27 October author-abstract scope'),
      cite('cahokia-soils-2021', 'Institutional author-record abstract'),
    ),
    sec(
      'Named accounts are not interchangeable',
      'Hunter’s geography is presented within an Osage preservation report excerpt. The Peoria visit is described by a university author. Their speakers, purposes and dates differ. Neither is permission to treat all Indigenous histories as one account, and a meeting about research does not establish agreement with every archaeological interpretation.',
      cite('cahokia-osage-history-2013', 'Excerpt provenance and selected geography'),
      cite(
        'cahokia-peoria-visit-2022',
        'Byline; visit and research-discussion paragraphs',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'A later view, a material process and a local environmental test',
    introduction:
      'These passages are editorial paraphrases. Photographed form, excavated association and tested inference provide different kinds of explanation; none supplies a complete population history.',
    items: [
      {
        label: 'A photograph records its own moment',
        text: 'The supplied print is dated 1907 and shows a surviving mound in a planted landscape. Archaeological accounts separately describe homes, public buildings and craft activity.',
        interpretation:
          'The visible rows belong to this later view; they do not identify medieval crops, houses or population. Missing structures in a photograph are not proof that a people disappeared.',
        citations: [
          cite(
            'cahokia-loc-1907',
            'Retained catalogue/date scope; unchanged photograph',
          ),
          cite('cahokia-isas-urban-work', 'Ancient Urbanism paragraph'),
        ],
      },
      {
        label: 'Material examination tests a sequence',
        text: 'The copper researchers combine examination of unfinished pieces with modern replication to support repeated working and heating.',
        interpretation:
          'A process can be supported without recovering an exact schedule, worker identity or completed product. Old backdirt and a workshop-context attribution are not the same as finding an object on a dated household floor.',
        citations: [cite('cahokia-copper-2011', 'Printed pp. 1728, 1734–1736')],
      },
      {
        label: 'An explanation needs its predicted evidence',
        text: 'Rankin and colleagues report a stable buried surface where a proposed wood-overuse mechanism predicted erosion and flooding.',
        interpretation:
          'That contrast tests a local explanation. It does not prove every landscape was unaffected or resolve the separate Horseshoe Lake population debate. State which place and process the evidence can address.',
        citations: [
          cite('cahokia-soils-2021', 'Institutional author-record abstract'),
          cite('cahokia-critique', 'Retained author-abstract scope'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What belongs to the picture, and what needs another source?',
    duration: '10–15 minutes',
    steps: [
      'Find the surviving mound, a tree and a repeated row pattern in the supplied print. Describe the shapes without naming a crop or an ancient building.',
      'Ask an adult to read the capsule. Sort these claims: rows are visible; researchers infer a copper-working process; the picture counts everyone who lived here. Which is an observation, a supported interpretation and an unsupported claim?',
      'Draw two connected cards labelled working and heating. Use the capsule to explain why a repeated task can be inferred without knowing its exact number of repetitions.',
      'Write a question about a household or neighborhood that this photograph cannot answer. Name the kind of evidence you would seek next.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: this is a 1907 view of a surviving earthwork, not an image of the occupied medieval city. Excavations elsewhere in the urban landscape identify homes among public and religious buildings. A study of eight unfinished copper pieces and modern comparisons supports repeated working and heating, but not an exact cycle count or a named maker. Rows are visible in the print; the working process needs separate material evidence; a complete population count is not supplied. A household question would need contextual excavation or another relevant record, rather than an invented building added to the picture.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian or community approval',
    scope:
      'Neighborhoods, material work and local environmental inference, one bounded source-qualified reference, three evidence readings and an answerable later-image/source-capsule task. Six new selected sources consulted on 29 October. The five inherited catalogue/regional/proxy records retain their documented 27 October scopes and access dates. Complete original 1050–1400 interval, identity, claims, old comparison texts, object order and existing image bytes preserved.',
    limitations: [
      'The 2019 neighborhood paper and 2021 soil study were consulted at exposed abstract/metadata level, not complete excavation, profile, sample or household datasets. Spatial and social interpretations do not identify every resident, belief, worker or political relationship.',
      'Copper consultation covers selected introduction/early material-selection and discussion/conclusion text, not full methods, original field records, complete laboratory data or figure pixels. Unfinished pieces from old backdirt do not recover an exact ancient heating schedule, complete cycle count, maker identity or source route.',
      'The LoC catalogue request returned 403 and the inherited Illinois About page timed out; neither was freshly renewed. The 2020/2021 Horseshoe Lake disagreement and UNESCO scope were retained without a new comprehensive consultation. No exact population curve or single cause of urban change adopted.',
      'Osage geography is an attributed selected excerpt from a 2013 preservation report, not a full report or a newly adjudicated affiliation. The 2022 Peoria visit is a university-authored account, not blanket community assent. No external community contact or approval of this atlas is represented.',
      'The unchanged 1907 print was inspected at original detail. Current remote-image parity, photography/printing biography beyond the retained catalogue, precise new geographic points and a reusable archaeological plan remain unverified. No new source figure, plan or micrograph copied or traced. Independent historian/community, real family, human screen-reader and physical-device/print acceptance remain open.',
    ],
  };
  s.dimensions['place-work'] = cahokiaWorkDimension;
  s.dimensionKeys = [
    ...new Set([...(s.dimensionKeys ?? Object.keys(s.dimensions)), 'place-work']),
  ];
}
