import type { Corpus, HistoricalContext, Source, Subject } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';
const institution = 'Pitquhirnikkut Ilihautiniq / Kitikmeot Heritage Society';

const sources: Source[] = [
  {
    id: 'inuinnait-1880s',
    title: 'Patterns of Change: 1880s',
    institution,
    url: 'https://www.kitikmeotheritage.ca/patternsofchange-1880s',
    type: 'primary',
    accessed: consulted,
    scope:
      'Visible English body read: seasonal sea-ice sealing and summer caribou/fish harvesting; copper/bone needles, sinew and caribou/seal skins; parka forms. This is the community-directed exhibit’s selected historical account, not a newly read nineteenth-century diary or a measured date for the pictured Jenness plate. Inuinnaqtun text was exposed but not independently translated. Religious/amulet passages and captioned source images are not reproduced or turned into a making activity. The exhibit’s 1880s label dates its represented historical frame, not its modern reconstruction or webpage publication. Web publication date and new image reuse rights unestablished.',
  },
  {
    id: 'inuinnait-1930s',
    title: 'Patterns of Change: 1930s',
    institution,
    url: 'https://www.kitikmeotheritage.ca/patternsofchange-1930s',
    type: 'primary',
    accessed: consulted,
    scope:
      'Visible English body read: community account of changes beginning in the 1920s, trading posts, purchased materials, fox-fur exchange, cotton outer covers, duffle-wool lining, fur trim and replacement of copper/bone tools by steel. Selected material-work explanation only. The longer proposed Hawaii/missionary transmission and every-household wealth/rank inference are not adopted. Caption text was read but photograph pixels were not inspected/reused. Inuinnaqtun text was not independently translated. 1930s is the exhibit’s represented period; webpage publication date unknown.',
  },
  {
    id: 'inuinnait-1950s',
    title: 'Patterns of Change: 1950s',
    institution,
    url: 'https://www.kitikmeotheritage.ca/patternsofchange-1950s',
    type: 'primary',
    accessed: consulted,
    scope:
      'Visible English body read: community account of economic/resource pressure, Canadian government decisions about settlement, wage work and schooling, continued outpost hunting/fishing, DEW-Line access to ready-made supplies and hand-crank sewing machines. Used as an attributed historical interpretation, not new disease incidence, a complete legal/residential-school history or an identical experience for every family. Photographic captions were read but source pixels/permissions were not inspected for new reuse. No new photograph adopted; 1950s is the represented period, not the webpage’s publication date.',
  },
  {
    id: 'inuinnait-2010s',
    title: 'Patterns of Change: 2010s',
    institution,
    url: 'https://www.kitikmeotheritage.ca/patternsofchange-2010s',
    type: 'primary',
    accessed: consulted,
    scope:
      'Visible English body read: institutional first-person explanation of renewed interest, synthetic/foreign fabrics, retained cuts/designs, fur trim and making by Inuinnait. This is an attributed community-directed exhibit account, not a survey establishing universal preferences or a claim about every maker in 2026. No independent Inuinnaqtun translation, audio or image-pixel inspection; no new media licence established. 2010s is the represented exhibit frame; exact webpage publication date unknown.',
  },
  {
    id: 'inuinnait-dance-clothing-guide',
    title: 'The Art of Inuinnait Drum Dancing: selected clothing pages',
    author: 'Ted Strauss and Brendan Griebel; translation credited to Emily Angulalik',
    institution,
    url: 'https://www.kitikmeotheritage.ca/_files/ugd/56a2ca_df65f075fc104be3bb52a1f5b302d9a8.pdf',
    type: 'primary',
    accessed: consulted,
    scope:
      'Selected English PDF text read: cover/credit pages and contents; printed p. 1 introductory scope; p. 31 clothing preparation, work/dance distinction and late-summer hides; p. 34 June Klengenberg profile and its 2011 photograph caption. These printed pages are PDF indices 0–2, 4, 34 and 37 in the 47-page file. The exact publication date is not established; the 2011 photograph, source’s age description and prospective recording references do not securely date this edition or establish a present-day biography. Named profile summarized with attribution; no original interview recording or transcript checked. Full book, cited Jenness/Rasmussen works, songs, ritual instruction and complete historical chapters not newly consulted. Exposed adjacent symbolic/ritual passages are not adopted as a family activity. Figure pixels were not inspected/reused; no source diagram, song or new photo copied and no new reuse licence established.',
  },
];

const renewals: Record<string, string> = {
  'inuinnait-patterns':
    'Visible English Creating Patterns of Change body and selected captions reread; associated Objects body also read at https://www.kitikmeotheritage.ca/patternsofchange-objects. Confirmed 2017 initiation, named Elders Mary Avalak, Mabel Etegik and Annie Atighioyak, workshops 2017–19, researched reconstructions, material/tool procurement, language work and publicly offered pattern-library access. The paragraph’s generic thirty-year-increment wording is not treated as arithmetic for every named era. Individual sewing patterns were not opened, traced or copied. Captions name museum research trips but no linked museum record was independently read. No new image licence or source-photo pixels adopted; modern research/reconstruction dates stay distinct from represented periods and the old expedition photograph.',
  'inuinnait-history':
    'Visible English A History of Inuinnait Parkas body reread. The exhibit explicitly uses modern community-workshop parkas to interpret material/style change and continuing connections with land, resources and people. Its first-person institutional account is attributed rather than universalized. Exposed Inuinnaqtun/French text was not independently translated. The five era links were inspected selectively through the separately recorded English pages; the 1980s body was not newly read. Exact publication date unknown; no image licence inferred.',
  'jenness-1922':
    'Internet Archive catalogue metadata reread: 1922 publication, Ottawa F. A. Acland, Canadian Arctic Expedition, English language, Southern Party 1913–16 and the scan’s distinct modern metadata. The existing full printed Plate I pixels were actually inspected, including the caption naming Ikpakhuak and Higilak and dancing costume. The title-page wording remains the retained prior consultation, not a freshly inspected title-page image. No complete report, new exposure date, exposure location, individual photographer, garment maker or wearer testimony established. The original plate/thumbnail and all media fields remain exact; the inherited publication-based rights statement is retained rather than newly adjudicated.',
};

export const inuinnaitKnowledgeContext: HistoricalContext = {
  id: 'inuinnait-clothing-community-history',
  title: 'Inuinnait clothing: seasonal work, new supplies and teaching',
  region: 'Americas',
  interval: {
    start: 1880,
    end: 2019,
    precision: 'approximate',
    label: 'Selected represented periods and community research, 1880s–2019',
    note: 'A bounded frame following selected community-directed exhibit periods and the separately dated 2017–19 research workshops, not the beginning/end of Inuinnait clothing or people. The original case remains the Southern Party window 1913–16. The photograph’s exact exposure is unknown and its 1922 publication date remains separate. Reconstructed garments were made in modern workshops rather than in the periods they represent.',
  },
  subjectIds: ['inuinnait-sewing'],
  summary:
    'Preparing skins, choosing supplies and teaching patterns made clothing an ongoing practical task. The community exhibit explains material changes alongside outside pressures and continued making by Inuinnait.',
  citations: [
    cite('inuinnait-1880s', 'English seasonal/material account'),
    cite('inuinnait-1930s', 'English material-change account'),
    cite('inuinnait-1950s', 'English settlement/work and sewing account'),
    cite('inuinnait-patterns', 'Workshops 2017–19'),
  ],
  phases: [
    {
      year: 1880,
      label: '1880s: a represented clothing and seasonal-work frame',
      title: 'Land, harvest and making were connected',
      text: 'The community exhibit links winter sea-ice sealing and summer caribou/fish harvests with the materials of clothing. Its selected 1880s account describes copper/bone needles, sinew thread and skins. The displayed parka was researched and made much later; 1880 is not its actual manufacture date.',
      citations: [
        cite('inuinnait-1880s', 'English body'),
        cite('inuinnait-patterns', 'Modern reconstruction methods'),
      ],
    },
    {
      year: 1913,
      label: '1913–16 observations; photograph published in 1922',
      title: 'An expedition record names two people',
      text: 'The report’s Southern Party window frames the selected case. Plate I names Ikpakhuak and Higilak in dancing costume. Publication and fieldwork context do not independently establish the exposure’s exact date or location, and the photograph does not identify who sewed these particular garments.',
      citations: [
        cite(
          'jenness-1922',
          'Retained title-page scope; actual Plate I; archive metadata',
        ),
      ],
    },
    {
      year: 1930,
      label: '1930s: the exhibit traces changes beginning in the 1920s',
      title: 'Purchased materials entered clothing work',
      text: 'The exhibit connects fox-fur exchange and trading posts with cotton covers, wool linings and steel tools. These selected changes concern access, work and choices; they do not mean every household adopted the same garment at one moment.',
      citations: [
        cite('inuinnait-1930s', 'English body: exchange, materials and tools'),
      ],
    },
    {
      year: 1950,
      label: '1950s: settlement pressures and new supplies',
      title: 'Making continued amid imposed changes',
      text: 'PI/KHS describes government-directed changes in housing, work and schooling alongside continued hunting/fishing in outpost camps. Its clothing account includes ready-made supplies and hand-crank sewing machines. This attributed period account does not recover an identical experience for every family.',
      citations: [
        cite('inuinnait-1950s', 'English body: government decisions and clothing'),
      ],
    },
    {
      year: 2017,
      label: '2017–19: researching, sewing and teaching',
      title: 'Elders and learners made an exhibit for the future',
      text: 'Mary Avalak, Mabel Etegik and Annie Atighioyak led the sewing program. Participants researched five historical parkas, prepared hides, made patterns and sewed modern reconstructions while documenting language and supporting new making for family and friends.',
      citations: [
        cite('inuinnait-patterns', 'Creating Patterns of Change and Objects bodies'),
      ],
    },
  ],
};

/** Unkeyed until a later bounded integration chooses a common comparison. */
export const inuinnaitKnowledgeDimension: Subject['dimensions'][string] = {
  text: 'Preparing skins, making patterns and sewing connect seasonal resources with experienced decisions. Imported cloth, steel tools and machines changed available means, while Elders-led workshops researched earlier techniques and supported new making. The old photograph alone cannot recover this work sequence.',
  citations: [
    cite('inuinnait-dance-clothing-guide', 'Printed p. 31'),
    cite('inuinnait-1930s', 'English material/tool account'),
    cite('inuinnait-1950s', 'Hand-crank sewing machines'),
    cite('inuinnait-patterns', 'Community research and workshops'),
  ],
};

export function applyKnowledgeInuinnait(c: Corpus): void {
  const subject = c.subjects.find((row) => row.id === 'inuinnait-sewing');
  if (!subject) throw Error('Missing preserved Inuinnait dossier');
  for (const source of sources)
    if (!c.sources.some((row) => row.id === source.id)) c.sources.push(source);
  for (const [id, text] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw Error(`Missing prior source ${id}`);
    const marker = 'Selected 29 October 2026 Inuinnait renewal:';
    if (!source.scope.includes(marker))
      source.scope = `Prior consultation (2026-10-27) retained: ${source.scope} ${marker} ${text}`;
    source.accessed = consulted;
  }
  c.contexts ??= [];
  const context = c.contexts.findIndex(
    (row) => row.id === inuinnaitKnowledgeContext.id,
  );
  if (context < 0) c.contexts.push(inuinnaitKnowledgeContext);
  else c.contexts[context] = inuinnaitKnowledgeContext;
  subject.contextIds = [
    ...new Set([...(subject.contextIds ?? []), inuinnaitKnowledgeContext.id]),
  ];
  subject.summary =
    'Making clothes connected seasonal harvesting, prepared materials, skilled hands and relationships. A named expedition photograph shows two people in dancing costume; community-directed research explains practical work and change that the image alone cannot recover.';
  subject.sections = [
    sec(
      'Work begins before a seam',
      'The community’s Patterns of Change exhibit connects clothing to seasonal life: sealing on winter sea ice and smaller summer groups harvesting caribou and fish. Its 1880s account names copper and bone needles, caribou sinew thread, and caribou and seal skins. Materials had to become usable clothing through work. The public drum-dancing guide describes scraping, drying, cleaning and softening skins before sewing. A garment therefore joins harvesting and preparation with the experienced decisions of its maker; its finished pattern is only part of that work.',
      cite('inuinnait-1880s', 'English seasonal/material account'),
      cite('inuinnait-dance-clothing-guide', 'Printed p. 31: skin preparation'),
    ),
    sec(
      'Clothes suited to an activity',
      'The same guide distinguishes thick travelling clothes from lighter garments suited to dancing. It links late-summer caribou hides with the lightness and softness wanted for dance clothing. In the historical photograph, contrasting bands, different hood shapes and hanging details are visible. The caption names Ikpakhuak and Higilak in dancing costume. These particular clothes should not become a universal picture of daily Arctic work, and the photograph does not reveal who made each garment or which hide was used.',
      cite('inuinnait-dance-clothing-guide', 'Printed p. 31: work and dance clothing'),
      cite('jenness-1922', 'Actual Plate I and caption'),
    ),
    sec(
      'New supplies changed the choices',
      'For its 1930s frame, PI/KHS describes cotton outer covers, duffle-wool linings and steel tools entering clothing work through exchange. Its 1950s account adds ready-made supplies and hand-crank sewing machines. Change also involved pressure: the community account describes government decisions about settlement, wage work and distant schooling where children were forbidden to practise their language and culture. Other families continued hunting and fishing in outpost camps. Access to new cloth was part of a changing social world, rather than proof that everyone freely chose the same transition.',
      cite('inuinnait-1930s', 'English exchange/material/tool account'),
      cite(
        'inuinnait-1950s',
        'English body: government decisions, outposts and clothing',
      ),
    ),
    sec(
      'Makers research and teach',
      'Between 2017 and 2019, Elders Mary Avalak, Mabel Etegik and Annie Atighioyak guided community workshops researching five historical parkas. Participants prepared hides, made patterns and sewed garments using period-appropriate supplies. Language work accompanied the making, and learners were encouraged to use their knowledge for family and friends. The exhibit presents these as modern researched reconstructions. Its 2010s account emphasizes continuing making by Inuinnait, including new fabrics alongside familiar cuts and fur trim. Knowledge can be maintained through adaptation as well as careful reconstruction.',
      cite('inuinnait-patterns', 'Creating Patterns of Change and Objects bodies'),
      cite('inuinnait-2010s', 'English body: continuing making and materials'),
    ),
  ];
  subject.deeperReading = [
    sec(
      'Keep the dates attached to the right evidence',
      'The case interval remains 1913–16, the expedition’s selected Southern Party window. The complete printed plate was published in 1922; it gives no exact exposure date. An exhibit parka representing the 1880s is different again: community participants researched and made it in 2017–19. Those three clocks cannot be exchanged. Nor does the later guide’s general description of dance clothing prove the precise material, maker or preparation of each garment in the photograph. The source comparison explains plausible kinds of work while keeping the named image’s missing details visible.',
      cite('jenness-1922', 'Archive metadata and actual Plate I'),
      cite('inuinnait-patterns', 'Research/workshop dates and represented eras'),
      cite('inuinnait-dance-clothing-guide', 'Printed p. 31'),
    ),
    sec(
      'Read makers through the source that offers their knowledge',
      'The public guide profiles June Klengenberg as a seamstress sharing knowledge with grandchildren and her community; its photograph caption dates the pictured dance coat to a 2011 occasion. That account is not a new interview, proof of her present circumstances or testimony about the older plate. The exhibit’s named Elders likewise organize a particular teaching project, rather than standing for every Inuit community. Here their institution’s English explanations are used with attribution. No audio was transcribed, no independent Inuinnaqtun translation was made, and no pattern or ceremonial design was copied. Learning about work does not require claiming ownership of its designs.',
      cite(
        'inuinnait-dance-clothing-guide',
        'Printed p. 34: attributed profile and caption',
      ),
      cite('inuinnait-patterns', 'Named Elders and publicly offered library'),
    ),
  ];
  subject.evidenceReading = {
    title: 'A photograph, a preparation account and a researched reconstruction',
    introduction:
      'These are editorial paraphrases of selected sources. The named people, represented periods, publication dates and modern research dates remain distinct.',
    items: [
      {
        label: 'The complete printed plate',
        text: 'Plate I names Ikpakhuak and Higilak in dancing costume. The preserved page shows contrasting bands, two different hood shapes and hanging details.',
        interpretation:
          'The visible garment features can be described without identifying every material, maker or symbolic meaning. The 1922 publication date does not settle the exposure date, and dancing costume is not every person’s daily outfit.',
        citations: [
          cite('jenness-1922', 'Actual full Plate I; archive publication metadata'),
        ],
      },
      {
        label: 'Preparation and seasonal properties',
        text: 'The community-published guide describes preparing skins before sewing and connects late-summer hides with the lighter clothing wanted for dancing.',
        interpretation:
          'This explains why preparation and timing matter to a maker. It does not establish the harvest season of each skin in the old photograph or supply a complete pattern for reproducing a ceremonial outfit.',
        citations: [cite('inuinnait-dance-clothing-guide', 'Printed p. 31')],
      },
      {
        label: 'Making an exhibit is also knowledge work',
        text: 'PI/KHS describes Elders-led workshops in 2017–19 researching period materials, preparing hides, making patterns, sewing parkas and documenting language.',
        interpretation:
          'The resulting garments are modern researched reconstructions. They can show a process of learning without being mislabeled as originals made in the 1880s, 1930s or 1950s.',
        citations: [
          cite('inuinnait-patterns', 'Creating Patterns of Change and Objects bodies'),
        ],
      },
    ],
  };
  subject.familyActivity = {
    title: 'Follow a material and check its clock',
    duration: 'About 8 minutes',
    steps: [
      'Look at the complete plate. Describe one difference between the two hoods and one contrasting band. Read the printed caption before deciding what kind of clothing is shown.',
      'Read this capsule: the community exhibit’s 1880s account names copper/bone needles, sinew and skins; its 1930s account names cotton covers, wool linings and steel tools. Elders-led workshops in 2017–19 researched and sewed modern parkas representing earlier periods. The photograph was published in 1922 and its exact exposure is undated.',
      'Choose one material/tool change from the capsule. Write what a maker would need to learn or obtain. Then sort “represented 1880s,” “published 1922” and “made in the workshops 2017–19” into three different evidence labels. Can the photograph alone prove your chosen change?',
    ],
    explanation:
      'Cotton, wool or a steel needle would require access to those supplies and knowledge of how to use them; the capsule supplies that change. The photograph supports description of the visible clothes, rather than an entire account of production. A parka representing the 1880s can have been made in 2017–19. Publication in 1922 does not give the exposure’s exact date. No copied cultural design or reconstructed ceremony is needed for this comparison.',
  };
  subject.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author checking; not independent historian, Inuinnait community or maker approval',
    scope:
      'A bounded registry DEEPEN account of seasonal/material work, attributed community interpretation and teaching. The full original 1913–16 interval, identity, claims, comparison texts, coordinates, object order, plate metadata and both image files remain preserved. The broader selected reference does not extend the case interval.',
    limitations: [
      'The old photograph’s exact exposure date/location, individual photographer, garment makers, exact materials and wearer testimony remain unestablished. The complete plate and caption are retained; the image is not a universal Arctic outfit.',
      'Community web publication dates and the selected drum-dancing guide’s edition date remain unknown. Its 2011 caption and older age wording do not establish current biography. Only selected English text was used; no original interviews, audio, independent Inuinnaqtun translation or complete cited historical sources were checked.',
      'The community institution’s account of outside pressures and adaptation is attributed. It does not represent every household’s experience or substitute for a complete history of schooling, settlement, health or other Inuit peoples.',
      'No new photograph, pattern, tracing, source-plan copy, annotation, cultural-design reproduction, numeric geography or route is supplied. Public pattern-library access is not converted into a blanket licence for all photographs or designs. Existing publication-based rights remain unchanged.',
    ],
  };
}
