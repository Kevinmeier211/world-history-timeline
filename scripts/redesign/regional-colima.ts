import type {
  Corpus,
  HistoricalContext,
  MediaAnnotation,
  Source,
} from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'colima-models-2016',
    title: 'Architectural Models from the Ancient Americas',
    author: 'Joanne Pillsbury',
    institution: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/essays/architectural-models-from-the-ancient-americas',
    type: 'scholarship',
    published: '2016-08-01',
    accessed: consulted,
    scope:
      'Selected opening architectural-effigy discussion, western Mexico paragraphs on accession 1995.63.5, shaft-tomb offerings and Nayarit house/feast models, and concluding comparison; contributor and publication date checked. Not the linked Design for Eternity catalogue, other books or underlying excavation dossiers. The account supplies regional funerary interpretations, not the selected Colima model’s missing excavation record. Possible family, feast and ancestor relationships are not testimony from every household. This is a separate 2016 essay from the inherited 6 November 2015 models source. Its current object card gives 200 BCE–200 CE; the 2015 caption retains 200 BCE–300 CE. Article text is not covered by a blanket image licence; no source layout or geometry copied.',
  },
  {
    id: 'colima-western-polities-2026',
    title: 'Gender, Identity, and Power in the Shaft Tombs of Western Mesoamerica',
    author: 'Martha Lorenza López Mestas Camberos',
    institution: 'The Metropolitan Museum of Art; contributor, Centro INAH Jalisco',
    url: 'https://www.metmuseum.org/essays/gender-identity-power-tombs-mesoamerica',
    type: 'scholarship',
    published: '2026-06-22',
    accessed: consulted,
    scope:
      'Main essay paragraphs after the Spanish link: 300 BCE–400 CE regional framing, shaft-tomb offerings, stylistic variation, autonomous villages/small chiefdoms and the author’s social, political and funerary-sculpture interpretations; contributor/citation checked. Linked 2011 dissertation, excavation inventories, osteological data and bibliography were not read. Political, gender, religious and ancestor readings remain attributed interpretations; neither shared imagery nor stylistic difference supplies a surveyed boundary or direct statement of each household’s beliefs. No image pixels from this essay inspected or reused and no blanket image licence adopted.',
  },
  {
    id: 'colima-shaft-tombs-inah',
    title: 'Tumbas de tiro',
    author: 'Alfonso Cabrera Macedo',
    institution: 'Centro INAH Colima; Lugares INAH',
    url: 'https://lugares.inah.gob.mx/es/node/5233',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Complete short institutional article and Aviso legal read. Describes shaft access, underground chambers, varied offerings and extended burials alongside shaft tombs; distinguishes the museum’s modern full-scale tomb reproduction. Undated page. Its local Comala frame is 200–400 CE and its wider shaft-tomb orientation runs roughly 500 BCE to 500/600 CE; these are this source’s conventions, not a redating of accession 1995.63.5. No underlying excavation report or museum reconstruction pixels inspected. Portal default is CC BY-NC-ND 4.0 unless otherwise indicated; no source photograph, reconstruction or geometry copied, altered or traced.',
  },
  {
    id: 'colima-nayarit-offerings-inah',
    title: 'Tumbas de Tiro Valles del Sureste',
    institution: 'Museo Regional de Nayarit; Lugares INAH',
    url: 'https://lugares.inah.gob.mx/es/pagina-de-elemento/2234',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Complete short room description and Aviso legal read. Describes regional variants with one or several underground chambers and includes architectural models among offerings. Identifies museum representations of Santa Catarina and La Playa contexts in Nayarit, not the selected Met object’s findspot. Undated page; no actual illustration pixels or original excavation records inspected. Portal default CC BY-NC-ND 4.0; no source illustration or plan reused or traced.',
  },
  {
    id: 'colima-huitzilapa-1996',
    title:
      'Datos preliminares sobre el descubrimiento de una tumba de tiro en el sitio de Huitzilapa, Jalisco',
    author: 'Jorge Ramos de la Vega; M. Lorenza López Mestas Camberos',
    institution: 'Ancient Mesoamerica 7(1), pp. 121–134; Cambridge University Press',
    url: 'https://www.cambridge.org/core/journals/ancient-mesoamerica/article/abs/datos-preliminares-sobre-el-descubrimiento-de-una-tumba-de-tiro-en-el-sitio-de-huitzilapa-jalisco/EB3FD35434C6ACAEEEBA65663D5F1069',
    type: 'archaeology',
    published: '1996',
    accessed: consulted,
    scope:
      'Exposed publisher abstract, authors/affiliations and issue/pages/DOI/copyright metadata read. DOI 10.1017/S0956536100001334; Spring 1996 issue is distinct from the 10 October 2008 online posting. Excavators describe an unlooted shaft tomb at Huitzilapa in the Magdalena basin, central Jalisco, and a radiocarbon series clustering in the first century CE. Full 14-page paper, individual sample/laboratory/calibration tables, figures and measured plan were not read. This is a separately excavated regional comparison, not the Colima model’s provenance. Copyright Cambridge University Press 1996; no source image reused.',
  },
  {
    id: 'colima-huitzilapa-organics-2006',
    title:
      'Organic Offerings, Paper, and Fibers from the Huitzilapa Shaft Tomb, Jalisco, Mexico',
    author: 'Bruce F. Benz; Lorenza López Mestas C.; Jorge Ramos de la Vega',
    institution: 'Ancient Mesoamerica 17(2), pp. 283–296; Cambridge University Press',
    url: 'https://www.cambridge.org/core/journals/ancient-mesoamerica/article/abs/organic-offerings-paper-and-fibers-from-the-huitzilapa-shaft-tomb-jalisco-mexico/41566F34B95E68B4F00FC499BACA573F',
    type: 'archaeology',
    published: '2006',
    accessed: consulted,
    scope:
      'Complete exposed publisher abstract, author metadata, issue/pages/DOI/copyright read. DOI 10.1017/S0956536106060196; July 2006 issue is distinct from the 19 March 2007 online posting. Abstract discusses microscopy of organic materials around six interments in two chambers: cotton/agave fibres and paper, with food identifications limited to broad classes or kingdoms. Its approximate 74 CE calibrated/averaged date is attributed to the 1996 study, not a freshly checked sample table. Status and craft-specialization readings are authors’ interpretations. Full methods/results, microscopy images, sample tables and original laboratory data were not consulted. Copyright Cambridge University Press 2006; no image copied.',
  },
];

const context: HistoricalContext = {
  id: 'colima-funerary-communities-context',
  title: 'Western Mexico: architecture, offerings and regional communities',
  region: 'Americas',
  interval: {
    start: -300,
    end: 400,
    label: 'c. 300 BCE–400 CE: selected western Mexican funerary context',
    precision: 'approximate',
    note: 'Uses López Mestas’s 2026 Late Preclassic/Early Classic orientation, not the lifespan or borders of one Colima state. The selected model’s complete case remains 200 BCE–200 CE; its 2015 essay caption ends at 300 CE. Regional shaft-tomb conventions, an excavated first-century-CE Huitzilapa context and the undated creation of modern photographs answer different questions. The endpoint does not end every western Mexican funerary practice.',
  },
  summary:
    'People made architectural miniatures and prepared funerary places within varied western Mexican communities. A possible vessel lid, regional offering traditions and a documented excavation reveal different parts of that work.',
  subjectIds: ['colima'],
  citations: [
    cite('colima-western-polities-2026', 'Opening 300 BCE–400 CE regional frame'),
    cite('met-317600', 'Description; Artwork Details: Date'),
    cite('colima-models-2016', 'Western Mexican architectural-model paragraphs'),
    cite('colima-huitzilapa-1996', 'Publisher abstract: first-century-CE series'),
  ],
  phases: [
    {
      year: -300,
      label: 'Around 300 BCE: beginning of the selected regional frame',
      title: 'Shared mortuary forms did not require one state',
      text: 'López Mestas describes western Mexican communities through a 300 BCE–400 CE orientation. Her account connects elaborate mortuary practices with different styles and autonomous villages or small chiefdoms. This is a regional interpretation of social relationships, not a founding date, common constitution or political border for everyone called Colima.',
      citations: [
        cite(
          'colima-western-polities-2026',
          'Opening regional frame; stylistic variation and political organization paragraphs',
        ),
      ],
    },
    {
      year: -200,
      label: '200 BCE–200 CE: the selected model’s catalogue range',
      title: 'An object carries its own dating question',
      text: 'The current Met record attributes this ceramic model to Colima and gives a broad 200 BCE–200 CE range. The date does not identify its maker, excavated tomb or precise year of manufacture. Roof, stair and platform can be observed in the supplied photograph while the proposed incense-burner-lid function remains an interpretation.',
      citations: [cite('met-317600', 'Description; Artwork Details')],
    },
    {
      year: 74,
      label: 'First century CE: the separately excavated Huitzilapa tomb',
      title: 'An excavation supplies an association',
      text: 'The 1996 excavators report radiocarbon clustering in the first century CE at Huitzilapa, in central Jalisco. The 2006 organic-study abstract reports an averaged/calibrated date around 74 CE through that earlier study and describes six interments in two chambers. These are site-specific findings; the original laboratory tables were not consulted, and no object route or Huitzilapa origin is assigned to the Colima model.',
      citations: [
        cite('colima-huitzilapa-1996', 'Publisher abstract: location and chronology'),
        cite(
          'colima-huitzilapa-organics-2006',
          'Publisher abstract: reported approximate date and interments',
        ),
      ],
    },
    {
      year: 200,
      label: '200 CE and 300 CE: two published endpoints for the same model',
      title: 'Keep a discrepancy visible',
      text: 'The current catalogue ends the selected model’s range at 200 CE. The opening caption in Pillsbury’s 6 November 2015 essay ends it at 300 CE. This atlas retains the current catalogue interval and records the older alternative. Neither endpoint dates the end of a people or all shaft-tomb offerings.',
      citations: [
        cite('met-317600', 'Artwork Details: Date'),
        cite('models', '2015 opening caption, accession 1995.63.5'),
      ],
    },
    {
      year: 400,
      label: 'Around 400 CE: end of this selected regional orientation',
      title: 'A teaching frame is not a universal ending',
      text: 'The selected reference follows the 2026 essay’s regional endpoint. The INAH Colima account has its own wider shaft-tomb orientation and a local Comala convention of 200–400 CE. These differing scopes should remain identified, rather than being merged into a single rise-and-fall story or used to redate the museum object.',
      citations: [
        cite('colima-western-polities-2026', 'Opening regional date convention'),
        cite('colima-shaft-tombs-inah', 'Regional chronology and Comala paragraph'),
      ],
    },
  ],
};

/** Draft positions on the unchanged 1600 × 1465 photograph, not map coordinates. */
export const colimaAnnotationDraft: MediaAnnotation[] = [
  {
    id: 'roof',
    label: 'A peaked roof',
    x: 0.49,
    y: 0.14,
    text: 'Two sloping surfaces meet at the roof’s high point. The catalogue calls this a temple model; this photograph does not identify a surviving full-size building or the roof’s original building material.',
    citations: [cite('met-317600', 'Description; existing main photograph, roof')],
  },
  {
    id: 'open-space',
    label: 'An opening beneath the roof',
    x: 0.47,
    y: 0.3,
    text: 'An open front lets us see space beneath the roof. No figure or complete ceremony is supplied by this view. The proposed incense-burner-lid use comes from the catalogue, rather than being proved by the opening alone.',
    citations: [
      cite('met-317600', 'Description; existing main photograph, open front'),
    ],
  },
  {
    id: 'platform',
    label: 'A raised platform',
    x: 0.63,
    y: 0.64,
    text: 'The roofed structure stands above a broad ceramic platform, with a small stair at its front. This makes levels and access visible in miniature; it does not supply an architectural scale, a known tomb or the missing body of a burner.',
    citations: [
      cite('met-317600', 'Description; existing main photograph, platform and stair'),
    ],
  },
];

export function applyRegionalColima(c: Corpus): void {
  for (const source of sources) {
    const index = c.sources.findIndex((existing) => existing.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  const met = c.sources.find((source) => source.id === 'met-317600')!;
  met.accessed = consulted;
  met.scope =
    'Selected visible Description, Artwork Details and Public Domain label renewed 29 October 2026 for accession 1995.63.5: ceramic, Colima/Mexico regional attribution, 200 BCE–200 CE, 17.8 × 17.8 × 11.4 cm and Bunshaft bequest credit. Proposed incense-burner lid remains tentative. Complete provenance-tab text was not exposed; no excavated findspot, maker, workshop, associated burner body or residue result established. Existing main and additional local photo pixels inspected unchanged; current remote-image byte parity and photography date were not verified. Met Open Access policy separately checked for public-domain collection-image CC0 rights, not a blanket licence for essay text. No original object conservation/technical report or linked bibliography read.';
  const models = c.sources.find((source) => source.id === 'models')!;
  const renewalMarker = 'Colima renewal, 2026-10-29:';
  if (!models.scope.includes(renewalMarker)) {
    models.scope = `Prior consultation, 2026-10-26 (retained): ${models.scope} ${renewalMarker} opening caption for accession 1995.63.5, contrast between architectural prototypes and ancient ritual vessels, selected Precolumbian discussion and concluding comparison. The 6 November 2015 caption retains 200 BCE–300 CE, while the current object catalogue ends at 200 CE. This additional selected Colima consultation does not claim a comprehensive fresh verification of the shared Han or other model sections. Linked catalogue and Further Reading books were not read.`;
  }
  models.accessed = consulted;
  c.contexts = [
    ...(c.contexts ?? []).filter((existing) => existing.id !== context.id),
    context,
  ];
  const s = c.subjects.find((subject) => subject.id === 'colima')!;
  s.contextIds = [...new Set([...(s.contextIds ?? []), context.id])];
  s.summary =
    'A ceramic roof, stair and platform make architecture portable. The Met proposes that this model once formed an incense-burner lid. Western Mexican offering traditions and a separately excavated shaft tomb help explain how people connected made objects, funerary places and social relationships, while leaving this model’s precise findspot and use unresolved.';
  s.sections = [
    sec(
      'Making architecture portable',
      'Look at the roof, the space beneath it and the stair rising from the platform. A maker brought these parts together in a ceramic object only 17.8 centimeters high. The miniature emphasizes levels and an approach to the roofed space. It does not give a scale for a full-size building or preserve every wall, material and activity. The catalogue calls it a temple model, but it identifies no particular surviving building, maker or workshop. Describing what the clay represents is a first step toward asking what people did with it.',
      cite('met-317600', 'Description; Artwork Details; existing photograph'),
    ),
    sec(
      'A possible vessel component',
      'The museum suggests that the model may have served as an incense-burner lid. If so, architecture was made part of a vessel and its use, rather than a working prototype for builders. This interpretation connects form with an action that the photograph alone cannot recover. No associated burner body or residue result is supplied. Pillsbury compares ancient miniatures with several intentions and functions; a similar building shape need not mean a toy, an identical ritual or contact between the makers of distant objects.',
      cite('met-317600', 'Description: possible incense-burner lid'),
      cite('models', '2015 opening caption; prototype and ritual-vessel discussion'),
    ),
    sec(
      'Preparing places and gifts',
      'In parts of western Mexico, people excavated underground funerary chambers reached by a vertical shaft. Preparing these places involved work on the ground as well as making and arranging offerings. INAH describes vessels, architectural models, stone and shell objects among regional deposits, with differences in chamber form and number. Pillsbury places western Mexican models within this offering tradition and discusses relationships between living people and the dead. Such contexts explain why a small building could carry social significance. They do not establish that this particular model came from a known tomb.',
      cite('colima-shaft-tombs-inah', 'Shaft/chamber and offering descriptions'),
      cite('colima-nayarit-offerings-inah', 'Chamber variants and listed offerings'),
      cite('colima-models-2016', 'Western Mexican model and offering paragraphs'),
    ),
    sec(
      'A region of different communities',
      'Shared mortuary forms did not make one Colima state. López Mestas describes autonomous villages and small chiefdoms alongside regional differences in ceramic styles. Her account interprets offerings and sculpture as ways of expressing status and relationships with ancestors. These are arguments about social life, rather than direct testimony from every household. Keep the selected model’s own broad date and uncertain history visible when using regional evidence: its architecture starts an inquiry, while excavation and comparison test the explanation.',
      cite(
        'colima-western-polities-2026',
        'Stylistic variation, political organization and funerary interpretation paragraphs',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'One excavated place supplies an association',
      'Huitzilapa, in central Jalisco’s Magdalena basin, offers a different kind of evidence from a regional museum attribution. The excavators’ 1996 abstract describes an unlooted shaft tomb and radiocarbon dates clustering in the first century CE. The 2006 organic-study abstract discusses six interments in two chambers. These associations connect objects and people within a documented place. Only the exposed abstracts were consulted here; the complete excavation record and original dating tables were not read. Huitzilapa is a comparison, not the selected model’s newly discovered origin.',
      cite('colima-huitzilapa-1996', 'Publisher abstract'),
      cite('colima-huitzilapa-organics-2006', 'Publisher abstract'),
    ),
    sec(
      'Materials reveal work with different levels of certainty',
      'The organic-study authors examined burial materials with light and scanning electron microscopy. They report cotton and agave fibres and paper, while many presumed food offerings could be identified only as broad animal or plant categories. Such remains bring clothing, wrapping and the provision of gifts into the explanation. The authors interpret differences as evidence of status. Material identification and social meaning are different steps; neither supplies a complete menu, each participant’s intentions or a universal funerary belief.',
      cite('colima-huitzilapa-organics-2006', 'Publisher abstract: methods and limits'),
    ),
    sec(
      'One model retains two published ranges',
      'The current catalogue gives 200 BCE–200 CE. Pillsbury’s 2015 caption gives 200 BCE–300 CE for the same accession. The case keeps the current catalogue range and records the older alternative. These broad dates do not turn the model into an exactly dated witness to the Huitzilapa burial or establish one shared ceremony.',
      cite('met-317600', 'Artwork Details: Date'),
      cite('models', '2015 opening caption, accession 1995.63.5'),
    ),
  ];
  s.evidenceReading = {
    title: 'Visible architecture, proposed use and excavated context',
    introduction:
      'These source passages are editorial paraphrases. A photograph, a catalogue interpretation and an excavation association support different kinds of explanation.',
    items: [
      {
        label: 'The catalogue proposes a use',
        text: 'The Met describes a roofed structure on a platform and suggests that it may once have been an incense-burner lid.',
        interpretation:
          'Roof and platform can be located in the photograph. The proposed lid function requires interpretation; the supplied views do not establish an associated burner body, residue, exact ritual or excavated tomb. Keep “may” in the explanation.',
        citations: [cite('met-317600', 'Description; Artwork Details')],
      },
      {
        label: 'An excavated association answers another question',
        text: 'The Huitzilapa excavators report an unlooted shaft tomb and first-century-CE radiocarbon clustering. The organic-study abstract describes materials around six interments in two chambers.',
        interpretation:
          'This connects evidence with a documented place and burial context. It is stronger contextual evidence than assigning a precise findspot from a style label, but it does not place the selected Colima model there. Full dating tables and excavation figures were not consulted.',
        citations: [
          cite('colima-huitzilapa-1996', 'Publisher abstract'),
          cite('colima-huitzilapa-organics-2006', 'Publisher abstract'),
        ],
      },
      {
        label: 'Regional traditions contain variation',
        text: 'INAH describes different chamber forms and offerings; López Mestas interprets western Mexico through varied styles and autonomous villages or small chiefdoms.',
        interpretation:
          'Repeated practices can connect communities without proving one state, one political border or identical household beliefs. The political account is attributed scholarship, while a particular object still needs its own history.',
        citations: [
          cite('colima-nayarit-offerings-inah', 'Chamber variants and offerings'),
          cite('colima-western-polities-2026', 'Political organization paragraphs'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'A roof we can see; a use we need to test',
    duration: '10–15 minutes',
    steps: [
      'Find the roof, a stair and an opening in the supplied photograph. Describe each without adding missing rooms or people.',
      'Open the additional photograph. Find one feature visible in both views, and explain one difference caused by the camera angle.',
      'Ask an adult to read the capsule. Sort these statements: the object has a roof; it may be an incense-burner lid; we know its exact tomb. Which is visible, which is a source interpretation, and which remains unknown?',
      'Make one claim that the supplied evidence supports. Name a further discovery that would help test the lid explanation, without inventing it.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the Met identifies a ceramic architectural model and suggests a possible incense-burner lid. Western Mexican models occur among funerary offerings, but the consulted record does not supply this model’s precise excavation findspot. The roof is visible, the lid is a proposed use, and an exact tomb is not established. An associated burner body or a securely documented use context could help test the explanation; neither is supplied here. A different camera angle does not represent another ancient period.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian approval',
    scope:
      'Layered object inquiry, regional funerary context, three evidence readings and an answerable image/source-capsule activity. Complete original case interval, identity, claims, object order and prior comparison texts retained. Shared models source preserves the earlier scope and adds a separately identified Colima renewal.',
    limitations: [
      'Huitzilapa papers were consulted at exposed publisher-abstract level, not full excavation/laboratory reports or individual radiocarbon tables. Linked books, original INAH dossiers and the complete Met provenance tab were not read.',
      'Possible lid use, unknown precise findspot, maker and workshop remain distinct from regional shaft-tomb offerings. No single Colima state, universal household belief, reconstructed missing building or contact route inferred. Source-specific chronological conventions and the 2015 caption alternative remain identified.',
      'Both existing local photographs were inspected unchanged; photography date and current remote-image byte parity remain unverified. No source plan or image copied or traced and no new numerical geographic locator accepted. Any draft observation notes require separate modern annotation credit/date/licence before adoption.',
      'Independent historian/community review, real adult/family use, human screen-reader and physical-device/print acceptance remain open.',
    ],
  };
  s.dimensions['place-context'] = {
    text: 'A model’s visible architecture and proposed vessel use differ from an excavated funerary association. Regional shaft-tomb offerings supply context without identifying this object’s tomb or one shared political authority.',
    citations: [
      cite('met-317600', 'Description and regional Artwork Details'),
      cite('colima-huitzilapa-1996', 'Publisher abstract: excavated context'),
      cite('colima-western-polities-2026', 'Political organization paragraphs'),
    ],
  };
  s.dimensionKeys = [
    ...new Set([...(s.dimensionKeys ?? Object.keys(s.dimensions)), 'place-context']),
  ];
  s.terms = [...new Set([...s.terms, 'archaeology', 'evidence'])];
}
