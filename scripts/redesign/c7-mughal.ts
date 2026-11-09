/** Selected Mughal book sources and reading layers; shared integration is separate. */
import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const mughalWorkshopSources: Source[] = [
  {
    id: 'mughal-workshops-va',
    title: 'The arts of the Mughal Empire: selected book-workshop passages',
    institution: 'Victoria and Albert Museum',
    url: 'https://www.vam.ac.uk/articles/the-arts-of-the-mughal-empire',
    type: 'scholarship',
    accessed: consulted,
    scope:
      'Selected Akbar/House of Books, Hamzanama project, Persian-speaking workshop/Translation Bureau/Baburnama, Harivamsa and Akbarnama passages actually read. Page updated 27 October 2025. The account distinguishes calligraphers, painters, illuminators and binders, and discusses design/colour work in a particular Akbarnama manuscript. No source image, map or volume copied/read as a whole; no named team transferred to the selected Met folio. The page incorrectly parenthesizes Ramayana as Razmnama in its Harivamsa section; that conflation is excluded. Its claim that Abu al-Fazl is always historically accurate, broad tolerance effects and evaluative superlatives are not adopted. Dates are attributed project conventions, not new exact production dates for every page.',
  },
  {
    id: 'mughal-workshop-network',
    title: 'Workshop as Network: A Case Study from Mughal South Asia',
    author: 'Yael Rice',
    institution: 'Artl@s Bulletin / Purdue University Libraries',
    url: 'https://docs.lib.purdue.edu/artlas/vol6/iss3/4/',
    type: 'scholarship',
    published: '2017',
    accessed: consulted,
    scope:
      'Publisher/repository abstract and bibliographic metadata only. Rice identifies contemporaneous marginal ascriptions distinguishing designer/colourist capacities and argues that changing collaboration teams across selected manuscript projects helped shape imperial style. The linked PDF returned 403 and was not retried or read. No full network chart, dataset, particular artist pairing, team total, wage, production schedule or attribution of the selected Harivamsa folio established. The abstract is explicitly the consultation boundary.',
  },
  {
    id: 'mughal-razmnama-commission',
    title: 'Add Or 2776–2783: eight leaves from a Razmnama manuscript',
    institution: 'British Library, interim Archives and Manuscripts Catalogue',
    url: 'https://searcharchives.bl.uk/catalog/032-003271913',
    type: 'catalogue',
    accessed: consulted,
    scope:
      'Title, Scope & Content and Note actually read: eight dispersed leaves dated c.1598; catalogue reports Akbar’s 1582 Persian-translation commission and first illustrated Jaipur copy c.1585–86. These are catalogue statements, not a new reading of the original colophon or the cited bibliography. No manuscript pixels, complete text or independent language/chronology analysis. The stated eighteen-month duration is not converted into an invented exact completion day. The former British Library blog URL returned 404 and was not substituted with an unofficial reprint.',
  },
  {
    id: 'mughal-razmnama-copy',
    title: 'Or 12076: Razmnāmah, translated into Persian by Naqīb Khān',
    institution: 'British Library, interim Archives and Manuscripts Catalogue',
    url: 'https://searcharchives.bl.uk/catalog/032-003283470',
    type: 'catalogue',
    accessed: consulted,
    scope:
      'Title, Scope & Content and selected catalogue fields/illustration list actually read. The record identifies Naqib Khan’s Persian translation, the last five books, a sub-imperial manuscript and its AH1007/1598 catalogue convention. Digital images are explicitly currently unavailable; no colophon pixels, whole manuscript or original Persian text read. No independent Hijri conversion or artist-name transfer to the selected Harivamsa folio. A later copy’s date is distinct from the 1582 translation commission and the story represented.',
  },
  {
    id: 'mughal-preface-politics',
    title:
      'The Sufi method behind the Mughal “Peace with All” religions: selected introduction',
    author: 'Christian Blake Pye',
    institution: 'Modern Asian Studies / Cambridge University Press',
    url: 'https://doi.org/10.1017/S0026749X21000275',
    type: 'scholarship',
    published: '2022',
    accessed: consulted,
    scope:
      'Selected actual PDF text, printed pp.902–904: abstract, introduction, Pye’s translated preface passage and notes 2–5 on Abu al-Fazl’s 1587 Razmnama preface, taḥqīq and imperial religious politics. Article-specific CC BY 4.0 notice read at p.902. Not the complete 22-page argument, original Persian edition, entire preface, independent translation or empirical policy outcomes. Pye’s opening gives 1554 as the reign start; this excluded mismatch does not alter the protected 1556–1605 case. Note 3 cautions that ṣulḥ-i kull terminology was applied retroactively; 1587 is not asserted as one complete policy’s start. No figure copied.',
  },
  {
    id: 'mughal-rahim-razmnama',
    title:
      'The White Horse Got Stuck to a Rock in Mount Vindhyachal: a later Razmnama folio',
    institution: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/art/collection/search/451317',
    type: 'catalogue',
    accessed: consulted,
    scope:
      'Opening description and selected Artwork Details/patron/date/accession 55.121.33 actually read. The 1616–17 copy made for Abd al-Rahim supplies a distinct later patronage example. No source-image pixels, provenance tab or complete manuscript consulted/reused; the named painter of this other work is not assigned to the selected Harivamsa. The description’s parenthetical Akbar end-year 1606 is an excluded mismatch, not a revision of the protected 1605 endpoint. Speculation about a painter being overwhelmed is not adopted.',
  },
];

export const mughalWorkshopContext: HistoricalContext = {
  id: 'mughal-books-workshop-context',
  title: 'Mughal book projects: making, translation and changing patrons',
  region: 'South Asia',
  interval: {
    start: 1562,
    end: 1617,
    label: 'Selected manuscript-project orientation, c.1562–1617 CE',
    precision: 'approximate',
    note: 'A selected project frame from the V&A’s approximate Hamzanama production convention to a separately catalogued 1616–17 Razmnama patronage example. It does not replace the complete 1556–1605 Akbar case, the selected folio’s visible ca.1590–95 date or its inherited 1565–1620 numeric search envelope. Translation, illustration, copying, a preface and sacred narrative time are different clocks. Court workshops do not represent every reader or religious community.',
  },
  summary:
    'Successive commissions brought translation, writing and painting together. Changing projects and patrons connect the selected folio to a longer bookmaking inquiry without assigning one team, audience or political effect to every surviving page.',
  subjectIds: ['mughal-books'],
  citations: [
    cite('mughal-workshops-va', 'The Hamzanama; House of Books'),
    cite('mughal-rahim-razmnama', 'Description; date and named patron'),
  ],
  phases: [
    {
      year: 1562,
      label: 'c.1562–1577: an approximate production convention',
      title: 'A large illustrated project brings specialists together',
      text: 'The V&A places the Hamzanama project approximately within these years while acknowledging contradictory contemporary volume counts and unstated exact dates. It describes writing, calligraphy and painting as related work. This is another manuscript project, not the selected Harivamsa folio or its recovered team.',
      citations: [cite('mughal-workshops-va', 'The Hamzanama: project and dating')],
    },
    {
      year: 1582,
      label: '1582: the commission reported in the catalogue',
      title: 'A Sanskrit epic enters a Persian translation project',
      text: 'The British Library catalogue dates Akbar’s commission of the Mahabharata’s Persian translation to 1582 and the first illustrated Jaipur copy to c.1585–86. Commission, translation and a later manuscript copy are not one date; neither dates the epic’s narrated events.',
      citations: [cite('mughal-razmnama-commission', 'Scope & Content: Note')],
    },
    {
      year: 1585,
      label: '1585: a change in principal residence',
      title: 'The court atelier is associated with Lahore',
      text: 'The Met’s essay describes Akbar adopting Lahore as his principal residence in 1585 and places the royal atelier first at Fatehpur Sikri, then Lahore. The selected painting’s own catalogue still says probably Lahore. A court move does not convert that qualified attribution into a proven findspot or a precise itinerary.',
      citations: [
        cite('mughal', 'Fatehpur Sikri/Lahore and royal atelier paragraphs'),
        cite('met-448183', 'Geography: probably Lahore'),
      ],
    },
    {
      year: 1587,
      label: '1587: the preface discussed by Pye',
      title: 'Translation is framed through imperial religious authority',
      text: 'Pye interprets Abu al-Fazl’s dated Razmnama preface as linking inquiry into religious truth with Akbar’s sovereign authority. This is an interpretation of an elite text, not measurement of universal agreement or a date when one fully formed policy began.',
      citations: [cite('mughal-preface-politics', 'Printed pp.902–904; note 3')],
    },
    {
      year: 1590,
      label: 'c.1590–95: the selected folio’s visible catalogue date',
      title: 'A Harivamsa story is made visible in paint',
      text: 'The Met dates the selected Krishna/Govardhan folio approximately to 1590–95. The V&A separately places completion of the Harivamsa’s Persian translation around 1590, with illustrations added. These accounts do not identify an exact day, all stages of this leaf or the historical date of a sacred event.',
      citations: [
        cite('met-448183', 'Date; opening description'),
        cite('mughal-workshops-va', 'The Harivamsa'),
      ],
    },
    {
      year: 1616,
      label: '1616–17: a different copy and named patron',
      title: 'A courtier supports a later illustrated book',
      text: 'A separately catalogued Razmnama folio belongs to a 1616–17 project for Abd al-Rahim, a commander and literary patron. It shows patronage continuing beyond the Akbar case. Its patron, painter and page history are not transferred to the selected Harivamsa.',
      citations: [cite('mughal-rahim-razmnama', 'Description; Date and Patron')],
    },
  ],
};

/** Shared integration chooses a comparison key; older dimensions remain intact. */
export const mughalWorkshopDimension = {
  text: 'Translation, writing, painting and binding connected specialized work with a patron’s literary and political aims. Surviving project records reveal some roles and changing teams; the selected leaf does not identify every worker or prove equal power among communities.',
  citations: [
    cite('mughal-workshops-va', 'House of Books; The Akbarnama'),
    cite('mughal-workshop-network', 'Publisher abstract only'),
    cite('mughal-preface-politics', 'Printed pp.902–904'),
  ],
};

export function applyWorkshopsMughal(c: Corpus): void {
  c.contexts ??= [];
  const catalogue = c.sources.find((s) => s.id === 'met-448183')!;
  catalogue.accessed = consulted;
  catalogue.scope =
    'Prior consultation, 2026-10-26 (retained): Accession 28.63.1; Description, Artwork Details, provenance and Public Domain image statement. Mughal selected renewal, 2026-10-29: Visible opening description, date, geography/material/dimensions/accession/credit in Artwork Details and Public Domain statement actually reread. Probably Lahore remains qualified; ca.1590–95 does not replace the inherited 1565–1620 search envelope or date the sacred narrative. Existing local 1164×1600 folio pixels actually viewed and both old image hashes verified unchanged. No current remote-image byte parity or photographic exposure year established. Provenance tab not reread in this renewal; the page says audio transcript unavailable. No attribution inferred from unrelated neighbouring works.';
  const essay = c.sources.find((s) => s.id === 'mughal')!;
  essay.accessed = consulted;
  essay.scope =
    'Prior consultation, 2026-10-26 (retained): Akbar’s reign, Gujarat access and collaborative royal atelier. Mughal selected renewal, 2026-10-29: Selected Akbar reign, Gujarat, court religious-discussion, Fatehpur Sikri/Lahore and collaborative atelier paragraphs actually reread in the 1 October 2002 Department of Islamic Art essay. Akbar’s 1556–1605 reign, Lahore principal residence from 1585 and artists with different training supply court orientation. No linked books, original court texts or exact selected-folio maker, audience size, religious equality, shipping route or contact with other workpack cases established. Evaluative superlatives are not adopted.';
  for (const source of mughalWorkshopSources)
    if (!c.sources.some((existing) => existing.id === source.id))
      c.sources.push(source);
  if (!c.contexts.some((context) => context.id === mughalWorkshopContext.id))
    c.contexts.push(mughalWorkshopContext);
  const s = c.subjects.find((subject) => subject.id === 'mughal-books')!;
  s.contextIds = [...new Set([...(s.contextIds ?? []), mughalWorkshopContext.id])];
  s.summary =
    'Making an illustrated book joined translation, writing, painting and patronage. Akbar’s court gathered specialists with different languages and artistic training. In the selected Harivamsa folio, Krishna shelters villagers beneath a mountain. The page connects a sacred narrative with a late-sixteenth-century imperial book project; it does not describe every reader, maker or religious community.';
  s.sections = [
    sec(
      'A composition makes the story visible',
      'In the painting, the mountain forms a broad canopy above a central figure with a raised arm. People and cattle gather below, while rocky slopes and animals fill the upper field. The museum identifies Krishna protecting the villagers of Braj from Indra’s rain. Choosing where bodies, rocks and shelter fit was part of making the narrative visible. This is an illustrated sacred story, made around 1590–95, rather than an eyewitness record of that event.',
      cite('met-448183', 'Actual existing photo pixels; opening description and Date'),
    ),
    sec(
      'Different skills made a book possible',
      'Bookmaking brought several kinds of skilled work together. The V&A describes the House of Books as both a library and a place of manuscript production, with painters, calligraphers, illuminators and binders. Persian translations made Sanskrit works available in the court’s literary language. The British Library’s record for another manuscript names Naqib Khan as translator of the Mahabharata into Persian. Translation, writing and image-making were related tasks; they were not necessarily performed by a single author or painter.',
      cite('mughal-workshops-va', 'House of Books; The Harivamsa'),
      cite('mughal-razmnama-copy', 'Title and Scope & Content'),
    ),
    sec(
      'Language and patronage shaped an audience',
      'A Persian book could address readers who did not know the original language. The V&A explains this change of audience through the Persian translation of Babur’s Turki memoirs, alongside translations of Sanskrit works. Commissions also presented the ruler as a source of knowledge. Historian Christian Blake Pye reads Abu al-Fazl’s 1587 Razmnama preface as joining religious inquiry with Akbar’s imperial authority. Bringing traditions into a court project therefore involved political choices, alongside intellectual curiosity and artistic work.',
      cite('mughal-workshops-va', 'The Baburnama; The Harivamsa'),
      cite('mughal-preface-politics', 'Printed pp.902–904'),
    ),
    sec(
      'Teams and patrons changed',
      'Some manuscript margins preserve working attributions. Yael Rice’s research abstract distinguishes designers and colourists, and argues that changing teams helped produce an imperial style across selected projects. That supplies a mechanism for collaboration beyond calling a page beautiful. Patronage also continued after Akbar: a separate Razmnama folio dated 1616–17 was made for the commander Abd al-Rahim. Different commissions could bring familiar stories to further courtly settings without making this selected leaf evidence for everyone’s religious life.',
      cite(
        'mughal-workshop-network',
        'Publisher abstract only: roles and changing teams',
      ),
      cite('mughal-rahim-razmnama', 'Description; Date and Patron'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A named role is not a recovered working day',
      'Marginal attributions can distinguish a person who designed an image from another who applied its colours. The V&A explains this division in its particular Akbarnama manuscript; some faces were assigned to a specialist. Rice’s abstract treats collaborations as changing networks rather than one permanent pair. These records can make skilled people visible, but they do not provide this folio’s complete team, hours, pay or working conditions. The selected Met catalogue does not name its maker, and that absence remains.',
      cite('mughal-workshops-va', 'The Akbarnama: tarh and amal attributions'),
      cite('mughal-workshop-network', 'Publisher abstract only'),
      cite('met-448183', 'Selected visible Artwork Details: no maker named'),
    ),
    sec(
      'A preface has a speaker and a purpose',
      'Pye interprets taḥqīq in Abu al-Fazl’s preface as an inquiry into or realization of religious truth, connected to a Sufi intellectual tradition and the emperor’s authority. This is a scholar’s reading of an elite argument, not modern laboratory verification or a measurement of popular agreement. Pye also notes that later peace terminology was applied retroactively. A translated preface can illuminate how power was justified without proving that each subject enjoyed equal power or understood the project alike.',
      cite('mughal-preface-politics', 'Printed pp.902–904; especially p.903 note 3'),
    ),
    sec(
      'Copies reach us through different histories',
      'The British Library describes dispersed Razmnama leaves around 1598 and a surviving final volume catalogued separately. Its records identify a later copy, not the first commission. The catalogue’s attribution to Naqib Khan concerns textual translation; it does not name the painter of the supplied Harivamsa leaf. Digital manuscript images are currently unavailable, so no colophon reading is claimed here. Such gaps change what can be checked, even when the catalogue remains informative.',
      cite('mughal-razmnama-commission', 'Scope & Content and Note'),
      cite('mughal-razmnama-copy', 'Title; Scope & Content; Digitised Content'),
    ),
  ];
  s.evidenceReading = {
    title: 'A visible story, working attributions and an imperial argument',
    introduction:
      'These are editorial paraphrases and observations, not newly translated manuscript passages. They distinguish what the supplied page shows from what other project records and a scholarly interpretation can support.',
    items: [
      {
        label: 'The painting arranges shelter; the catalogue identifies the story',
        text: 'A raised arm, the overhead mountain, gathered people and cattle can be observed in the supplied image. The Met identifies Krishna sheltering the villagers of Braj from Indra’s rain.',
        interpretation:
          'Visible arrangement supports a claim about how an image tells a story. Identifying that sacred narrative uses the catalogue. Neither supplies an event year, eyewitness testimony, the painter’s name or a census of people living near a Mughal court.',
        citations: [
          cite('met-448183', 'Actual existing photo pixels; opening description'),
        ],
      },
      {
        label: 'Working labels can reveal a division of skill',
        text: 'Rice’s abstract identifies marginal ascriptions that distinguish designer and colourist capacities. The V&A explains corresponding design/colour roles in another Akbarnama manuscript.',
        interpretation:
          'These sources support an account of divided and collaborative work. They do not authorize attaching that other manuscript’s named hands to this folio. Rice’s full PDF was inaccessible, so the network charts and dataset were not inspected or reconstructed.',
        citations: [
          cite('mughal-workshop-network', 'Publisher abstract only'),
          cite('mughal-workshops-va', 'The Akbarnama: working attributions'),
        ],
      },
      {
        label: 'A prefatory argument connects inquiry with rule',
        text: 'Pye’s selected introduction discusses Abu al-Fazl’s 1587 preface as framing the translation through religious truth and Akbar’s sovereign authority.',
        interpretation:
          'That is an attributed interpretation of an elite text’s purpose. It helps explain language politics and patronage, rather than establishing universal tolerance, every reader’s response or present-day approval of a ruler. The original Persian preface was not independently translated here.',
        citations: [cite('mughal-preface-politics', 'Printed pp.902–904')],
      },
    ],
  };
  s.familyActivity = {
    title: 'How does a picture make shelter visible?',
    duration: '10–15 minutes',
    steps: [
      'Find the central figure’s raised arm, the broad mountain above and one group of people or animals below. Describe their positions before naming the story.',
      'Read the source capsule with an adult if useful. Separate two cards: something visible in the painting, and information supplied by the museum or workshop account.',
      'Make one supported claim about how the composition shows shelter. Add a question about the translator, painter or audience that the picture cannot answer alone.',
      'Explain why making this leaf around 1590–95 does not give a historical year for the sacred story it represents.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the museum identifies Krishna holding up Mount Govardhan to shelter villagers from Indra’s rain. It dates the selected leaf approximately 1590–95 and attributes its making probably to Lahore, without naming a maker. Other court book projects combined translation, calligraphy, painting, illumination and binding. Those roles explain kinds of work, not the exact team for this page. A visible raised arm and sheltered figures support an observation; names, dates and workshop history require their respective records.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian or community approval',
    scope:
      'Court bookmaking, translation, language politics and changing patronage, with a separately dated project context, three evidence readings and an activity answerable from the unchanged folio and supplied source capsule.',
    limitations: [
      'The complete 1556–1605 case, older claims/dimensions, identity, object order and original image bytes remain intact. The visible ca.1590–95 object date, inherited 1565–1620 numeric envelope, probable Lahore attribution and sacred narrative time remain distinct.',
      'Rice was consulted at abstract/metadata scope only; its PDF returned 403. British Library manuscript images and the former blog are unavailable. The original Persian preface, complete volumes, inaccessible Translation and State chapter and exact folio team were not read or recovered.',
      'V&A’s Ramayana/Razmnama conflation and conflicting reign years in two other sources are excluded; no source typo revises the protected reign. Workshop diversity and a prefatory argument do not prove equal power, every audience’s response or contact with other workpack cases.',
      'Independent specialist/community review, real family use, human screen-reader/physical-device behavior and physical print acceptance remain open.',
    ],
  };
}
