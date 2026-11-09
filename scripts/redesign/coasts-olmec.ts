import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, interval, sec } from './content-helpers';

const consulted = '2026-10-28';
const sampling = 'olmec-sampling-2020';
const housing = 'olmec-housing-2018';
const workshops = 'olmec-workshops-2021';
const regional = 'olmec-regional-inah';
const foodways = 'olmec-foodways-2012';
const foodMethods = 'olmec-food-methods-2018';

const sources: Source[] = [
  {
    id: sampling,
    title:
      'De la antropología demográfica a la arqueología demográfica: el estudio de las poblaciones extintas',
    institution: 'Estudios Demográficos y Urbanos 35(1), pp. 117–152',
    author: 'Virginia Arieta Baizabal',
    published: '2020 journal issue',
    url: 'https://scielo.org.mx/pdf/educm/v35n1/2448-6515-educm-35-01-117.pdf',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'DOI 10.24201/edu.v35i1.1851. Selected printed pp. 130, 132, 134–135 and 138–142 read in text; actual page pixels inspected for printed pp. 130/PDF 14, 132/PDF 16, 134/PDF 18, 135/PDF 19, 138/PDF 22, 140/PDF 24 and 141/PDF 25. Not the entire 36-page article. Publisher access returned 403 and the web PDF request timed out; the bounded SciELO PDF download succeeded. Landscape, staged construction, rejected surface-mound estimate, floor recognition, spatial/chronological grouping and modern household analogy are distinguished. The Arenas 1800–1400, Terrazas 1400–1200 and BAV 1200–1000 BCE scheme is source-specific, not a replacement for the case interval or INAH museum peaks. Precise population, rank, labour obligations and a sole demographic-collapse explanation are not adopted. The article reports 2,602 tests and 1,651 floors; differing counts in the 2018 excerpt and 2021 briefing are not silently reconciled or used here. Cover states CC BY-NC-ND 4.0; no map, plan or source figure reproduced or traced.',
  },
  {
    id: housing,
    title: 'Población y vivienda en San Lorenzo',
    institution: 'Arqueología Mexicana 150, pp. 32–39 / Editorial Raíces',
    author: 'Virginia Arieta Baizabal',
    published: 'March–April 2018',
    url: 'https://arqueologiamexicana.mx/mexico-antiguo/poblacion-y-vivienda-en-san-lorenzo',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Only the public researcher excerpt read, especially La antigüedad and La identificación de viviendas en San Lorenzo, followed by the paragraphs describing hand-auger samples and location/soil/time data. The complete paid pp. 32–39 article was not acquired or read. Deep earthen architecture, wetland/high-ground setting and sampling method support the account. Its 1,609-floor count is not merged with the 2020 article’s 1,651 floors. Copyright Editorial Raíces; no photograph, reconstruction drawing or source geometry copied or traced.',
  },
  {
    id: workshops,
    title:
      'Revelan complejidad urbana y organizativa de la cultura Olmeca en sus primeros siglos',
    institution: 'Universidad Nacional Autónoma de México, DGCS bulletin 420',
    author: 'UNAM-DGCS, reporting Ann Marie Cyphers Tomic',
    published: '17 May 2021',
    url: 'https://www.dgcs.unam.mx/boletin/bdboletin/2021_420.html',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Selected public institutional briefing paragraphs read, including A partir de 1990, the staged plateau account, Nuestra reconstrucción del Palacio Rojo and Dentro del Palacio. A direct web request timed out; indexed text and a subsequently saved HTML copy were consulted. A researcher lecture reported by university press is distinct from the excavation report. Reported unfinished sculpture, tools and abrasives are separated from interpretations of room function, ruler supervision, restricted access, cosmology and economic primacy. Exact labour/population estimates and the briefing’s 2,603-sample count are not adopted. No university photograph or reconstructed image copied; no reusable image licence verified.',
  },
  {
    id: regional,
    title: 'Sala Introductoria, Museo de Sitio de La Venta',
    institution: 'Instituto Nacional de Antropología e Historia',
    url: 'https://lugares.inah.gob.mx/es/pagina-de-elemento/1682',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Introductoria paragraphs 1–5 and Aviso legal read. Multiple southern Gulf sculpture localities, conventional San Lorenzo 1200–900 BCE and La Venta 800–400 BCE peaks, and the incompletely understood wider regional relationships. These are museum peak conventions, not exact occupation boundaries or proof of one political succession. They are not silently reconciled with the 2020 San Lorenzo construction scheme. No civilizational priority, universal mother-culture account or single polity inferred. Portal defaults to CC BY-NC-ND 4.0; factual paraphrase and link only, no source image copied or adapted.',
  },
  {
    id: foodways,
    title:
      'Regional Variation in the Importance and Uses of Maize in the Early and Middle Formative Olmec Heartland: New Archaeobotanical Data from the San Carlos Homestead, Southern Veracruz',
    institution: 'Latin American Antiquity 23(4), pp. 509–532',
    author: 'Amber M. VanDerwarker and Robert P. Kruger',
    published: 'December 2012; Cambridge online hosting 20 January 2017',
    url: 'https://doi.org/10.7183/1045-6635.23.4.509',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Cambridge publisher abstract and article metadata only; full article, methods, tables and figures not read. The abstract compares macrobotanical evidence at the San Carlos homestead, La Joya and Tres Zapotes, reporting differences in maize and fruit frequencies. The authors’ interpretation concerning wetland access and developing sociopolitical settings remains attributed. No unconsulted sample sizes, species list, exact diet percentage or all-Olmec subsistence system adopted. The 2017 online date is not the original 2012 publication or fieldwork date. Copyright Society for American Archaeology; no source figure or table reproduced.',
  },
  {
    id: foodMethods,
    title: 'La temprana alimentación olmeca',
    institution: 'Arqueología Mexicana 150, pp. 26–31 / Editorial Raíces',
    author:
      'Judith Zurita Noguera, Luis Fernando Hernández Lara and María Arnaud Salas',
    published: 'March–April 2018',
    url: 'https://arqueologiamexicana.mx/mexico-antiguo/la-temprana-alimentacion-olmeca',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Public researcher excerpt opening and Técnicas de estudio read, not the complete paid pp. 26–31 article. Complementary faunal, plant and vessel-residue evidence, preservation and domestic/ceremonial/productive contexts. The isotope study described as in progress in 2018 is not treated as completed results. No precise menu or universal crop package inferred. Copyright Editorial Raíces; no illustration copied.',
  },
];

const context: HistoricalContext = {
  id: 'olmec-centres-context',
  title: 'Gulf Coast communities and changing centres',
  region: 'Americas',
  interval: interval(
    -1800,
    -400,
    'c. 1800–400 BCE: selected settlement and regional-centre frames',
    'A teaching window combining the 2020 San Lorenzo construction scheme with INAH’s conventional La Venta peak. It is not one continuous polity or one universal sequence. The original c. 1200–400 BCE case interval and the figure’s separate 1200–900 BCE catalogue range remain unchanged.',
  ),
  summary:
    'Selected construction phases at San Lorenzo and a different monumental setting at La Venta broaden the small-object inquiry. Their source conventions remain visible rather than becoming one origin story or exact political succession.',
  subjectIds: ['olmec'],
  citations: [
    cite(sampling, 'Printed pp. 135 and 140–141: construction scheme'),
    cite(regional, 'Introductoria, conventional centre peaks'),
    cite('olmec', 'San Lorenzo and La Venta paragraphs'),
  ],
  phases: [
    {
      year: -1800,
      label: 'c. 1800–1400 BCE: San Lorenzo project’s Arenas phase',
      title: 'Earlier settlement and prepared floors',
      text: 'The 2020 account groups earlier settlement and building evidence within this construction phase, before the retained dossier’s starting date. It is not an origin date for all Olmec communities.',
      citations: [cite(sampling, 'Printed pp. 135 and 140 / PDF 19 and 24')],
    },
    {
      year: -1400,
      label: 'c. 1400–1200 BCE: San Lorenzo project’s Terrazas phase',
      title: 'Earth building enlarges the settlement',
      text: 'The source describes substantial filling and residential terrace construction. Its approximate phase labels do not identify every builder or establish one labour-recruitment system.',
      citations: [cite(sampling, 'Printed pp. 135 and 141 / PDF 19 and 25')],
    },
    {
      year: -1200,
      label: 'c. 1200–1000 BCE: San Lorenzo project’s BAV phase',
      title: 'A source-specific peak-phase scheme',
      text: 'The project assigns this interval to its later construction phase. INAH instead uses a conventional 1200–900 BCE San Lorenzo peak; the conventions are recorded separately rather than silently harmonized.',
      citations: [
        cite(sampling, 'Printed pp. 135 and 141 / PDF 19 and 25'),
        cite(regional, 'Introductoria, paragraph on two peaks'),
      ],
    },
    {
      year: -800,
      label: 'c. 800–400 BCE: INAH’s conventional La Venta peak',
      title: 'A different monumental setting',
      text: 'INAH places La Venta’s peak here. Platforms and buried greenstone offerings belong to a different centre; this range is neither its complete occupation nor proof of an exact political transfer from San Lorenzo.',
      citations: [
        cite(regional, 'Introductoria, paragraph on two peaks'),
        cite('olmec', 'After about 900 B.C.; In fact, the growth of La Venta'),
      ],
    },
    {
      year: -400,
      label: 'End of this selected frame',
      title: 'Material histories continue elsewhere',
      text: 'Doyle describes continued sculpture and ceramic production at centres including Tres Zapotes after La Venta’s monumental phase. This teaching endpoint does not date the disappearance of a people.',
      citations: [cite('olmec', 'Large stone sculpture at La Venta paragraph')],
    },
  ],
};

export function applyOlmec(c: Corpus) {
  const s = c.subjects.find((subject) => subject.id === 'olmec');
  if (!s) throw new Error('The Olmec baseline dossier is missing');
  for (const source of sources) {
    const existing = c.sources.findIndex((item) => item.id === source.id);
    if (existing < 0) c.sources.push(source);
    else c.sources[existing] = source;
  }
  const renewed: Record<string, string> = {
    olmec:
      'Doyle’s February 2017 essay body read again on 28 October 2026: the 1200–400 BCE artistic frame; San Lorenzo earth building and pottery; El Manatí; changes in prominent centres; La Venta platforms and greenstone offerings; continuing production at other centres. Further-reading books and linked excavation reports not read. Artistic labels are not one state, and priority/inevitable-lineage rhetoric is not adopted. The complete original case interval is retained. Essay copyright is distinct from the existing open-access object image.',
    'met-314609':
      'Description paragraphs 1–7, Artwork Details, Public Domain and Open Access statements read again on 28 October 2026; the existing local 821×1600 image was actually inspected. Accession 1983.424: ceramic, 17 cm, 1200–900 BCE, Mexico/Mesoamerica/Olmec peoples catalogue attribution. No excavated findspot supplied. Adornment and modeled features are distinguished from the catalogue’s status, modification, life-stage and ritual interpretations, including its comparisons with Tlatilco and Joyce/Marcus. No named occupant, San Lorenzo household or universal use inferred. Public-domain/Met CC0 image bytes retained; catalogue prose has separate rights.',
  };
  for (const [id, scope] of Object.entries(renewed)) {
    const source = c.sources.find((item) => item.id === id);
    if (!source) throw new Error(`The existing Olmec source ${id} is missing`);
    source.accessed = consulted;
    source.scope = scope;
  }

  s.summary =
    'Olmec-associated communities reshaped ground, made containers and figures, and worked stone in different Gulf Coast settings. A small ceramic body, buried floors and workshop traces expose different kinds of activity. Comparing them connects spectacular objects to practical work while preserving each source’s scale and uncertainty.';
  s.sections = [
    sec(
      'Build a place to live',
      'At San Lorenzo, people enlarged raised ground with earth filling and terraces. Making a settlement required repeated work moving and spreading material, alongside building homes and places to gather. The construction history reaches earlier than this dossier’s c. 1200–400 BCE artistic frame. A settlement’s phases and an object-based teaching window answer different questions; neither defines every community called Olmec.',
      cite(sampling, 'Printed pp. 130, 135 and 140–141; selected actual pages'),
      cite('olmec', 'After the spread of maize agriculture paragraph'),
    ),
    sec(
      'Work leaves different traces',
      'Earth buildings are less immediately conspicuous than colossal stone heads. Prepared floors nevertheless reveal investment in living spaces and different construction materials. Researcher Ann Marie Cyphers reports unfinished sculptures, tools and abrasive remains near the building called the Red Palace. These connect spectacular stone objects to skilled production. Her reconstruction combines residential, production, storage and ritual spaces; those are interpretations rather than a surviving list of workers and offices. Potters also varied clay, shape and surface treatment to make bowls, rounded containers and figures.',
      cite(housing, 'La identificación de viviendas; public excerpt'),
      cite(workshops, 'Nuestra reconstrucción; Dentro del Palacio'),
      cite('olmec', 'Potters at San Lorenzo; Ceramic arts at San Lorenzo'),
    ),
    sec(
      'Food belonged to particular places',
      'Supplying a settlement also meant using its surroundings. Researchers investigate food through plant and animal remains and vessel residues, which preserve differently. A separate study compared the San Carlos homestead with La Joya and Tres Zapotes and found differing maize and fruit frequencies. Its abstract relates variation to wetland access and developing political settings. Such differences make it harder to picture all Olmec households using the same crop in the same way. They do not supply a measured menu for this figure’s maker.',
      cite(foodMethods, 'Técnicas de estudio; public excerpt'),
      cite(foodways, 'Publisher abstract only'),
    ),
    sec(
      'A small body changes the question',
      'The 17-centimetre ceramic figure focuses attention on bodily display: modeled hands, feet, coiffure and prominent ear ornaments. The museum links adornment to possible social identification and discusses interpretations of intimate ritual handling. A small figure could be held and repositioned, unlike a large fixed monument. Its catalogue supplies no excavated findspot, so it cannot furnish a San Lorenzo household biography.',
      cite('met-314609', 'Description; Artwork Details'),
    ),
    sec(
      'Several centres had different histories',
      'San Lorenzo was not the whole story. INAH distinguishes its conventional 1200–900 BCE peak from La Venta’s 800–400 BCE peak. La Venta’s platforms and buried greenstone offerings show a different monumental setting. Shared materials and styles invite regional comparison while leaving room for distinct communities, histories and practices.',
      cite(regional, 'Introductoria, paragraphs on localities and centre peaks'),
      cite('olmec', 'After about 900 B.C.; In fact, the growth of La Venta'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Why a house count changes',
      'A visible mound can look like a convenient household counter. At San Lorenzo an early estimate used low mounds as supposed Olmec dwellings; later work assigned those mounds to the much later Late or Terminal Classic period and rejected the estimate. The correction changed which population the evidence could describe. Merely counting more carefully would not have solved the dating error.',
      cite(sampling, 'Printed p. 134 / PDF 18: rejected surface-mound estimate'),
    ),
    sec(
      'From a sample to an estimate',
      'Researchers turned to buried surfaces. Excavations helped identify prepared floors; auger samples recorded soil, depth and position. Analysts then grouped evidence by construction phase and location to identify concentrations consistent with buildings. This is a chain of interpretation, not a photograph of every occupied house. A floor may survive without its entire room, and a group of sampled floors still needs a defensible explanation. Estimating inhabitants adds another step: the 2020 study discusses an analogy with households in the local modern community of Tenochtitlán and explicitly acknowledges that ancient and present domestic groups are different. An estimate therefore joins archaeological observations to assumptions about how people shared space.',
      cite(housing, 'Esta técnica; Esta gran cantidad; public excerpt'),
      cite(sampling, 'Printed pp. 135 and 138–140; selected actual pages'),
    ),
    sec(
      'Read the body with the same care',
      'The figure raises a parallel problem. Ear ornaments are visible; their wearer’s precise office is not. The museum proposes meanings through comparison with other figurines and burials, including evidence from Tlatilco. Those comparisons supply possibilities rather than this object’s missing findspot. Asking what an observation can support lets small objects and large settlements illuminate ordinary lives without turning either into a complete picture of one uniform society.',
      cite('met-314609', 'Description: Tlatilco, Joyce and Marcus interpretations'),
    ),
  ];
  s.evidenceReading = {
    title: 'A surface is not yet an ancient household',
    introduction:
      'These are authored paraphrases and interpretations. Their different steps connect a historical question to the particular record that could answer it.',
    items: [
      {
        label: 'A consequential dating correction',
        text: 'An early population estimate treated low surface mounds as Olmec dwellings. Later work dated the mounds to the much later Late or Terminal Classic period and rejected that estimate.',
        interpretation:
          'The correction changes the population the mounds can describe. Counting them more precisely cannot repair a sample assigned to the wrong period.',
        citations: [cite(sampling, 'Printed p. 134 / PDF 18')],
      },
      {
        label: 'A sampled floor and a further assumption',
        text: 'Excavated floor characteristics helped identify buried surfaces in auger samples. Analysts grouped evidence by phase and location, then used further assumptions to estimate inhabitants.',
        interpretation:
          'Keep a recorded layer, an inferred building and an occupancy estimate distinct. Combining all floors from different periods would not directly count one phase’s simultaneous residents.',
        citations: [cite(sampling, 'Printed pp. 135, 138 and 140 / PDF 19, 22 and 24')],
      },
      {
        label: 'A visible ornament and a proposed meaning',
        text: 'The selected figure has conspicuous ear ornaments and modeled bodily features. Its catalogue discusses possible social meanings by comparison with other evidence.',
        interpretation:
          'Visible details support observation. They do not supply this object’s excavated household, a named office or one universal ritual use for all figurines.',
        citations: [cite('met-314609', 'Description; Artwork Details')],
      },
    ],
  };
  s.familyActivity = {
    title: 'Look, propose, qualify',
    duration: 'About 5 minutes with the supplied figure photograph',
    steps: [
      'Point to two visible details on the ceramic figure. An adult can read the description aloud.',
      'Use the museum account to propose how one detail might make the represented body socially distinctive. Separate the observation from the proposed meaning.',
      'Name one question that the photograph cannot answer because the catalogue gives no excavated findspot. Point, talk, draw or write.',
    ],
    explanation:
      'Ear ornaments, coiffure and modeled bodily details are observations. Status or life-stage meanings remain interpretations. The photograph does not identify this figure’s household, an individual or its exact use.',
  };
  s.dimensions.maintenance = {
    text: 'Preparing floors and enlarging earthen terraces required work through successive construction phases. This records repeated material investment, without recovering a labour roster or every worker’s obligations.',
    citations: [
      cite(sampling, 'Printed pp. 135 and 140–141: floors and construction phases'),
      cite(housing, 'La identificación de viviendas; public excerpt'),
    ],
  };
  s.dimensionKeys = Object.keys(s.dimensions);
  s.contextIds = [...new Set([...(s.contextIds ?? []), context.id])];
  c.contexts = [
    ...(c.contexts ?? []).filter((item) => item.id !== context.id),
    context,
  ];
  s.returnPrompt =
    'Compare one small figure detail with a building or workshop trace. What work or social meaning can each help investigate, and what further evidence would test the interpretation?';
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex source consultation and self-review; not independent historian approval',
    scope:
      'Bounded Gulf Coast account, deeper source interpretation, photograph-based family task and source-qualified reference phases. Existing ceramic figure and the complete original case interval retained. No new media or place study added in this module.',
    limitations: [
      'San Lorenzo’s 2020 construction scheme, INAH museum peak conventions, the original case interval and the figure’s catalogue date answer different questions and remain separate.',
      'Only selected 2020 article pages and public 2018 excerpts were consulted. Paid complete articles, the 2014 digital atlas, the 2020 population book and full excavation reports were not read.',
      'The 2012 foodways paper was consulted only in publisher abstract and metadata. No unconsulted sample sizes, precise diet percentages or universal subsistence package adopted.',
      'The UNAM account reports a researcher’s lecture. Finds, proposed room functions and conclusions about political control are not interchangeable. Exact labour, population, status and collapse claims remain outside this expansion.',
      'The catalogue supplies no excavated findspot for the selected figure. Social identification, life-stage and ritual proposals are attributed interpretations, not recovered household biographies.',
      'No universal mother-culture origin, one Gulf Coast polity, precise political succession, language, ethnicity or new relationship with Lapita or Poverty Point inferred.',
      'No independent historian, real adult/family, screen-reader, physical-device or physical-print acceptance established.',
    ],
  };
}
