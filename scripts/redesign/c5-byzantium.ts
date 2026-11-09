import type {
  Corpus,
  HistoricalContext,
  MediaAnnotation,
  Source,
} from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

/** Selected source scopes for the bounded Constantinople material-work inquiry. */
const sources: Source[] = [
  {
    id: 'byzantium-ivory-work-2007',
    title: 'Byzantine Ivories',
    author: 'Edmund C. Ryder',
    institution: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/essays/byzantine-ivories',
    type: 'scholarship',
    published: '2007-10-01',
    accessed: consulted,
    scope:
      'Selected opening Constantinople commerce/material paragraphs and later ivory-image production, object/assembly and supply discussion; contributor/publication metadata checked. Supplies a broader tenth–eleventh-century medium and urban context, not a traced tusk, route, workshop, patron or labour arrangement for accession 17.190.44. General bone/wood-core assembly discussion is not a technical finding about this particular icon. Supply, price and causal explanations retain the author’s qualifications. The essay’s 324 capital and 711–843 controversy shorthand does not replace Brooks’s 330 dedication and two iconoclastic episodes. Linked Cutler monograph and original technical reports not read. No essay image, layout or geometry copied; publication prose is not covered by a blanket collection-image licence.',
  },
  {
    id: 'byzantium-hades-reading-1974',
    title: 'Hades Stabbed by the Cross of Christ',
    author: 'Margaret English Frazer',
    institution: 'The Metropolitan Museum Journal 9, pp. 153–161',
    url: 'https://www.metmuseum.org/met-publications/hades-stabbed-by-the-cross-of-christ-the-metropolitan-museum-journal-v-9-1974',
    type: 'scholarship',
    published: '1974',
    accessed: consulted,
    scope:
      'Publisher metadata and selected publisher-PDF text, printed pp. 153, 155–156 and 159–160 (PDF pp. 1, 3–4 and 7–8), actually read: disputed Hades/Adam identification, abbreviated inscription, comparative imagery and mediated hymn discussion for this exact icon. Not all nine pages, PDF figure pixels or underlying patristic/hymn originals and editions. Frazer’s comparative argument supports Hades; this is not a fresh Greek translation, universally settled identification or eyewitness proof of a particular ceremony. Free publisher PDF does not establish an open illustration licence; no page or figure reused.',
  },
  {
    id: 'byzantium-yenikapi-project',
    title: 'Yenikapı Byzantine Shipwrecks Project',
    author: 'Institute of Nautical Archaeology',
    institution: 'Institute of Nautical Archaeology / Texas A&M University',
    url: 'https://nauticalarch.org/projects/yenikapi-byzantine-shipwrecks-project/',
    type: 'archaeology',
    accessed: consulted,
    scope:
      'Selected project introduction, harbour history, preservation and organizational paragraphs, gallery captions and bibliography metadata read. Undated living page; no claim that its present-tense roles or progress were verified for 2026. Supplies Theodosian Harbour context and 2004–2013 excavation, with organic ship remains preserved in waterlogged sediments. Gallery dating shorthand remains distinct from the selected detailed paper’s construction/context discussion. Image pixels, linked dissertations and laboratory reports were not read. No photograph/plan reuse licence established, no figure copied or traced and no selected-icon cargo or workshop association established.',
  },
  {
    id: 'byzantium-yenikapi-2015',
    title:
      'Eight Byzantine Shipwrecks from the Theodosian Harbour Excavations at Yenikapı in Istanbul, Turkey: an introduction',
    author: 'Cemal Pulak; Rebecca Ingram; Michael Jones',
    institution: 'International Journal of Nautical Archaeology 44(1), pp. 39–73',
    url: 'https://nauticalarch.org/wp-content/uploads/2015/08/ijna12083.pdf',
    type: 'archaeology',
    published: '2015',
    accessed: consulted,
    scope:
      'Selected actual PDF text: abstract/introduction and harbour-history opening, printed pp. 39–40 (PDF pp. 1–2); YK14 discussion, printed pp. 53–55 (PDF pp. 15–17); exposed Table 2 text, printed p. 47 (PDF p. 9). DOI 10.1111/1095-9270.12083. Not the entire 35-page paper, actual figure pixels, original dissertations or timber/resin laboratory reports. YK14 records fitted/joined planks, wooden treenails and iron nails, grass/pine-pitch caulking, reused pieces and repeated repairs. Pottery-layer late-ninth/early-tenth dating differs from first-half-ninth-century construction suggested by wood dating and a dated timber likely associated with the ship. No recovered cargo or ballast reported. Wood age, construction, use, context/deposition and modern 2007 excavation/2009–2012 documentation remain distinct; probable storm/rapid-burial explanation is qualified. No specific worker status, wage, recovered ivory cargo, route or singular city-collapse event inferred. PDF copyright 2014 Authors/Nautical Archaeology Society is distinct from the 2015 print issue. Figure 13 plan credited S. Matthews; no open adaptation licence found and no source plan or photograph copied or traced.',
  },
];

const context: HistoricalContext = {
  id: 'constantinople-material-work-context',
  title: 'Constantinople: portable images and harbour work',
  region: 'Europe',
  interval: {
    start: 843,
    end: 1204,
    label: '843–1204 CE: a selected Middle Byzantine reference frame',
    precision: 'approximate',
    note: 'Follows Brooks’s Middle Byzantine convention, with the substantive urban inquiry bounded to ninth–eleventh-century evidence. This is not a new lifespan or territorial boundary for Byzantium: the complete original case remains 330–1453, including Latin rule in Constantinople during 1204–1261. Earlier timber evidence may predate this reference frame; a phase marker is not a precise construction, sinking or production year.',
  },
  summary:
    'An ivory panel and separately excavated ship timbers reveal carving, fitting, joining and repair in a working capital. Object interpretation, archaeological context and political change answer different questions.',
  subjectIds: ['byzantium'],
  citations: [
    cite('byzantium', 'Middle Byzantium: 843–1204 convention'),
    cite('met-464428', 'Description; Artwork Details'),
    cite('byzantium-yenikapi-2015', 'Printed pp. 53–55: YK14'),
    cite('byzantium-ivory-work-2007', 'Ivory images in the tenth–eleventh centuries'),
  ],
  phases: [
    {
      year: 843,
      label: '843: images return after the second iconoclastic episode',
      title: 'A period convention follows a contested practice',
      text: 'Brooks distinguishes image controversies in 726–787 and 815–843 and describes the reintroduction of images in 843. Icons appeared in different materials and settings, while their relationship to sacred subjects was debated. This boundary organizes a reference period; it does not mean every image, viewer or workshop followed one uninterrupted practice.',
      citations: [
        cite('icons', 'Definition of Iconoclasm; Icons after Iconoclasm'),
        cite('byzantium', 'Middle Byzantium period convention'),
      ],
    },
    {
      year: 900,
      label: 'Late ninth–early tenth centuries: YK14’s pottery-layer context',
      title: 'One wreck has several chronological questions',
      text: 'The excavators initially associated YK14 with pottery dated to the late ninth or early tenth century. Wood dating and a timber likely associated with the ship suggested construction in the first half of the ninth century, potentially before this reference begins. Fitted planks and repeated repairs belong to its material history. The marker 900 is an approximate orientation to the reported context, not an exact construction, repair or sinking year. No cargo or ballast was recovered.',
      citations: [
        cite(
          'byzantium-yenikapi-2015',
          'Printed pp. 53–55; Table 2, p. 47: YK14 chronology and repairs',
        ),
      ],
    },
    {
      year: 950,
      label: 'Mid-tenth century: the selected ivory panel',
      title: 'Carving makes a portable devotional image',
      text: 'The Met dates accession 17.190.44 to the mid-tenth century and attributes it probably to Constantinople. Its central panel has carved figures and an openwork architectural frame; missing wings once made a triptych. Probable private devotional use is the catalogue’s interpretation. The atlas retains the existing 925–975 search envelope, without treating 950 as a known manufacture year or identifying an original household, carver or workshop.',
      citations: [
        cite('met-464428', 'Description; Artwork Details: Date and Geography'),
      ],
    },
    {
      year: 1000,
      label: 'Tenth–eleventh centuries: ivory images and other objects',
      title: 'One medium served more than one purpose',
      text: 'Ryder discusses ivory religious images alongside secular caskets and varied forms of assembly. The broader medium connects material supply with skilled making and use. It does not identify this panel’s source tusk, assembly materials, patron or labour arrangement. The marker 1000 locates the author’s broad production discussion; it is not a dated output total or a new date for the selected icon.',
      citations: [
        cite(
          'byzantium-ivory-work-2007',
          'Tenth–eleventh-century production, religious images and secular caskets',
        ),
      ],
    },
    {
      year: 1204,
      label: '1204: Latin rule interrupts the Constantinople capital story',
      title: 'Political change does not supply one cultural endpoint',
      text: 'Crusaders took Constantinople in 1204. Brooks distinguishes Latin rule there until 1261 from Byzantine centres elsewhere, followed by the return of Byzantine rule to Constantinople. This ends the selected Middle Byzantine reference convention, not all making, religious practice or Roman self-identification. The full case continues to the 1453 capture of Constantinople and retains its qualification about other territories.',
      citations: [cite('byzantium', 'Latin Occupation; Late Byzantium')],
    },
  ],
};

/** Modern observation targets on the unchanged 1152 × 1600 photograph. */
export const byzantiumAnnotationDraft: MediaAnnotation[] = [
  {
    id: 'openwork-canopy',
    label: 'Openwork above the figures',
    x: 0.51,
    y: 0.21,
    text: 'Openings pierce the carved frame above the central figure. The museum describes an architectural canopy with columns carved in openwork. This is an ivory representation, not a measured plan of a known building.',
    citations: [cite('met-464428', 'Description; unchanged photograph, upper frame')],
  },
  {
    id: 'projecting-relief',
    label: 'A figure projects from the background',
    x: 0.5,
    y: 0.5,
    text: 'The central body projects in front of the flatter surface behind it. A carver left material for the figure while removing material around it. The photograph does not establish a specific tool, exact carving depth, maker or workshop.',
    citations: [cite('met-464428', 'Existing photograph, central relief figure')],
  },
  {
    id: 'inscription-argument',
    label: 'Letters beside a debated figure',
    x: 0.62,
    y: 0.76,
    text: 'Greek-letter lines appear near the reclining lower figure. Frazer compared the abbreviated inscription, other images and hymns to argue for Hades rather than Adam. Identifying the figure requires that cited interpretation; it is not an unassisted translation from this photograph.',
    citations: [
      cite('met-464428', 'Description; existing photograph, lower inscription'),
      cite('byzantium-hades-reading-1974', 'Printed pp. 153, 155–156 and 159–160'),
    ],
  },
];

function renewSelectedSource(
  c: Corpus,
  id: string,
  scope: string,
  published?: string,
): void {
  const source = c.sources.find((existing) => existing.id === id);
  if (!source) throw new Error(`Missing inherited Byzantium source: ${id}`);
  const marker = 'Byzantium selected renewal, 2026-10-29:';
  if (!source.scope.includes(marker)) {
    source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker} ${scope}`;
  }
  source.accessed = consulted;
  if (published) source.published = published;
}

export function applyPlacesByzantium(c: Corpus): void {
  const s = c.subjects.find((subject) => subject.id === 'byzantium');
  if (!s) throw new Error('Missing inherited Byzantium subject');
  for (const source of sources) {
    const index = c.sources.findIndex((existing) => existing.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  renewSelectedSource(
    c,
    'byzantium',
    'Sarah T. Brooks’s byline, publication 1 October 2001/revision 1 October 2009, selected opening/Beginning, Middle, Latin Occupation and Late political/identity passages: Roman self-identification, 330 dedication convention, 843–1204 period convention, 1204–1261 Latin rule, return in 1261 and capture of Constantinople in 1453. Not every object card, linked book or full Late subsection freshly read. Fixed borders, a uniform economy and exact later Mistra/Trebizond endpoints are not adopted; older later-territory wording was not separately verified. No source figure or plan copied.',
    '2001-10-01; revised 2009-10-01',
  );
  renewSelectedSource(
    c,
    'icons',
    'Sarah T. Brooks’s byline, publication 1 October 2001/revision 1 August 2009, selected Definition, Form and Function, Definition of Iconoclasm, Source of Debate and Icons after Iconoclasm: materials/settings, opening triptychs, attributed devotional theology, 726–787 and 815–843 episodes and 843 reintroduction. Immediate causes remain contested. No original imperial laws, councils, hymns or linked books freshly read; no universal destruction or household-belief claim. No image reused or blanket essay licence inferred.',
    '2001-10-01; revised 2009-08-01',
  );
  renewSelectedSource(
    c,
    'met-464428',
    'Visible Description paragraphs, Artwork Details and Public Domain label for accession 17.190.44 renewed: mid-tenth century, probably Constantinople, elephant ivory, 15.1 × 8.9 × 0.8 cm, Morgan gift in 1917; central triptych panel, missing wings and probable private devotional use. Complete provenance/inscription-tab bodies were not exposed. Maker, workshop, room, personal patron, excavated findspot, source tusk and transport route remain unknown. Existing 1152 × 1600 photograph inspected at original detail unchanged; photography date and current remote-image byte parity unverified. Met Open Access introduction/basic image policy separately read: public-domain collection-image CC0 does not licence every publication figure or essay. No original conservation/technical report or underlying bibliography read.',
  );
  c.contexts = [
    ...(c.contexts ?? []).filter((existing) => existing.id !== context.id),
    context,
  ];
  s.contextIds = [...new Set([...(s.contextIds ?? []), context.id])];
  s.summary =
    'Carvers shaped portable ivory images while shipbuilders fitted and repaired wooden hulls in Constantinople’s harbour. A mid-tenth-century icon and separately excavated ship remains reveal concrete work within a changing Roman capital, without supplying one workshop, household or uninterrupted political story.';
  s.sections = [
    sec(
      'Carving a portable image',
      'A carver shaped figures, columns and a pierced canopy in a small ivory panel. Removing material opened spaces through the frame; leaving material raised figures from the background. The surviving panel is 15.1 centimeters high. The Met attributes it probably to Constantinople and interprets it as a private devotional object, once completed by two folding wings. Those missing parts remind us that making an image also involved arranging how it could be opened, seen and closed. The photograph reveals the carving, while the catalogue supplies the material identification and proposed use.',
      cite('met-464428', 'Description; Artwork Details; existing photograph'),
      cite('icons', 'Form and Function: triptychs'),
    ),
    sec(
      'Fitting and maintaining a working hull',
      'At the Theodosian Harbour, ship remains reveal another kind of skilled work. The published study of the wreck called YK14 records fitted planks, wooden treenails and iron nails. Grass and pine pitch helped seal seams. Fitting parts together and sealing seams were different tasks in making a working hull. Repairs included reused pieces and renewed caulking: keeping a vessel working required attention after its first construction. These traces explain tasks through materials that survived in wet ground. They are a separately excavated urban context, not the ivory’s known journey. No cargo was recovered that could identify what this particular ship carried.',
      cite(
        'byzantium-yenikapi-2015',
        'Printed pp. 53–55: YK14 construction and repairs',
      ),
      cite('byzantium-yenikapi-project', 'Harbour excavation and organic preservation'),
    ),
    sec(
      'Using and interpreting images',
      'Portable images joined material work to religious practice. Brooks describes icons made in several media and used in different settings; triptych wings could open and close around a central image. Their relationship to sacred subjects was debated. The selected ivory belongs after the reintroduction of images in 843, rather than to the capital’s foundation. Its Crucifixion scene invites attention to figures and inscriptions, but identifying every figure requires interpretation. Probable private devotion does not identify an original room, owner or the beliefs of every inhabitant.',
      cite('icons', 'Definition; Form and Function; Icons after Iconoclasm'),
      cite('met-464428', 'Description; Date'),
    ),
    sec(
      'Keeping the wider history in view',
      'The people modern historians call Byzantine identified themselves as Romans. The case begins with Constantinople’s conventional dedication date in 330. Its capital story changes sharply in 1204, when crusaders took the city; Byzantine rule returned there in 1261. The case ends with the Ottoman capture of Constantinople in 1453; other Byzantine territories continued longer. Carving and hull repair illuminate bounded parts of that long history. A single timeline band cannot make them evidence for one unchanging territory, culture or form of government.',
      cite('byzantium', 'Opening; Beginning; Latin Occupation; Late Byzantium'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Construction and deposition are different clocks',
      'The YK14 report first discusses pottery-layer dating to the late ninth or early tenth century. Wood dating, including a timber likely associated with the ship, suggested construction in the first half of the ninth century. Repairs then belong between making and final deposition. The authors’ reasoning does not turn a dated piece of wood into a known launch day or make every component equally old. The reference marker around 900 locates a reported archaeological context. It does not redate construction to 843, establish an exact sinking year or reveal a cargo.',
      cite('byzantium-yenikapi-2015', 'Printed pp. 53–55; Table 2, p. 47'),
    ),
    sec(
      'An inscription supports an argument',
      'The reclining figure below the cross has been read as Hades or Adam. Margaret English Frazer argued for Hades by comparing the abbreviated inscription with other imagery and hymns. Her reading links the figure with an interpretation of Christ’s victory over death. It is an example of a scholar bringing several kinds of evidence together. The hymn passages remain mediated through her article: this reading supplies no new Greek translation, eyewitness ceremony or claim that every viewer understood the image alike.',
      cite('byzantium-hades-reading-1974', 'Printed pp. 153, 155–156 and 159–160'),
      cite('met-464428', 'Description: reclining figure'),
    ),
    sec(
      'A medium does not identify a workshop',
      'Ryder places ivory images alongside secular caskets and discusses material supply and assembly. That context expands the kinds of work we can ask about. It does not locate this panel’s carver, identify its tusk or establish a particular workshop’s materials and labour arrangements.',
      cite('byzantium-ivory-work-2007', 'Production, assembly and supply paragraphs'),
    ),
  ];
  s.evidenceReading = {
    title: 'Carved surfaces, repaired timbers and an interpreted figure',
    introduction:
      'These passages are editorial paraphrases. Visible form, an excavation association and a scholarly argument answer different questions; no ship is identified as the ivory’s carrier.',
    items: [
      {
        label: 'A catalogue connects form with probable use',
        text: 'The Met identifies elephant ivory, a surviving central triptych panel and probable private devotional use, with production probably in Constantinople.',
        interpretation:
          'The supplied photograph lets us examine openwork and relief. Material, date and probable use come from the catalogue. Missing wings and a likely setting do not establish a named household, patron or workshop; the photograph’s modern creation date is unknown.',
        citations: [
          cite('met-464428', 'Description; Artwork Details; existing photograph'),
        ],
      },
      {
        label: 'Excavated repairs make maintenance visible',
        text: 'The YK14 report describes fitted and joined planks, caulking and repeated repairs, including reused pieces. Its construction estimate differs from pottery-layer dating.',
        interpretation:
          'Material associations can explain work and successive changes. Wood age, original construction, repair and deposition must be distinguished. No recovered cargo connects the wreck to the selected ivory, and the selected report does not identify individual workers or wages.',
        citations: [
          cite('byzantium-yenikapi-2015', 'Printed pp. 53–55; Table 2, p. 47'),
        ],
      },
      {
        label: 'An identification is tested by comparison',
        text: 'Frazer considers Hades and Adam as alternative readings of the reclining figure and uses an abbreviated inscription, other images and hymns to support Hades.',
        interpretation:
          'The conclusion is an attributed comparative argument. It is more than naming a figure from its position, while remaining different from a new direct translation, universal agreement or proof of a particular performance.',
        citations: [
          cite('byzantium-hades-reading-1974', 'Printed pp. 153, 155–156 and 159–160'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What can an image show about work?',
    duration: '10–15 minutes',
    steps: [
      'Find an opening through the carved frame, a figure projecting from the background and a line of letters in the supplied photograph. Describe each before naming its meaning.',
      'Ask an adult to read the capsule. Sort three statements: the frame has openings; the panel was probably used privately; a ship carried this exact ivory. Which is visible, which is a source interpretation, and which is not established?',
      'Use the capsule to name two tasks recorded on the excavated ship. Explain why a repair can belong to a later stage than first construction.',
      'Write one supported sentence about making and one question that needs another source. Keep the image and the separately excavated ship distinct.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the Met identifies a mid-tenth-century elephant-ivory panel, probably made in Constantinople and probably used privately. Missing side panels once completed a triptych. In a separate harbour excavation, the YK14 report records joining planks, sealing seams with caulking and repeated repairs. No cargo was recovered to connect that ship with this ivory. The openings are visible, probable private use is the museum’s interpretation, and transport on this ship is not established. Joining and sealing are two supported tasks; repairs show work after initial making, without supplying an exact repair date.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian approval',
    scope:
      'Bounded urban/material-work reading, one source-qualified 843–1204 reference with a ninth–eleventh-century focus, three evidence readings and an answerable photograph/source-capsule activity. Complete original 330–1453 case interval, identity, claims, object order and earlier dimension texts retained; existing photograph bytes preserved. Selected renewals preserve prior dated source scopes. Modern image observations distinguish visible carving and letters from catalogue use and scholarly interpretation.',
    limitations: [
      'Met Description/Artwork Details/Public Domain and selected institutional essays were read, not complete provenance/inscription tabs, technical examination or linked books. Maker, patron, household, workshop, tusk source and transport route remain unknown; probable private use and probably Constantinople stay qualified.',
      'YK14 consultation is limited to printed pp. 39–40 and 53–55 and exposed Table 2 on p. 47, not the entire paper, underlying dissertations, laboratory reports or actual figure pixels. Timber association, construction, pottery context, repairs and modern excavation are different clocks; no selected-icon cargo or exact sinking date established.',
      'Frazer consultation covers selected text on pp. 153, 155–156 and 159–160, not the whole article, original Greek editions or figure pixels. Hades remains an attributed argument. The official Dumbarton Oaks household/monastic-document lead was inaccessible; no alternative mirror or original household document was read.',
      'Existing photograph pixels were inspected unchanged. Photography date and current remote-image byte parity remain unverified. No new source plan or image reused or traced, numerical geographic locator accepted or missing triptych wings restored. The modern observation layer has its own date, credit and licence, separate from the ancient object and photograph. Small-screen and printed legibility require inspection of the final exports.',
      'Independent historian/conservator/community review, real adult/family use, human screen-reader and physical-device/print acceptance remain open.',
    ],
  };
  s.dimensions['place-work'] = {
    text: 'A probable Constantinopolitan ivory image reveals carved form and an interpreted devotional use; separately excavated harbour timbers reveal fitting, sealing and repair. Together they explain kinds of urban work without identifying one workshop, transport route or universal household practice.',
    citations: [
      cite('met-464428', 'Description; Artwork Details'),
      cite('byzantium-yenikapi-2015', 'Printed pp. 53–55: YK14'),
      cite('byzantium-ivory-work-2007', 'Production and material discussion'),
    ],
  };
  s.dimensionKeys = [
    ...new Set([...(s.dimensionKeys ?? Object.keys(s.dimensions)), 'place-work']),
  ];
}
