import type { Corpus, HistoricalContext, Journey, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const hidatsaCommunitySources: Source[] = [
  {
    id: 'hidatsa-maxidiwiac-1917',
    title: 'Agriculture of the Hidatsa Indians: An Indian Interpretation',
    author:
      'Maxi´diwiac (Buffalobird-woman); Edward Goodbird, interpreter; Gilbert Livingstone Wilson, editor/credited author',
    institution:
      'University of Minnesota, November 1917; selected text in Project Gutenberg ebook 60313',
    url: 'https://www.gutenberg.org/cache/epub/60313/pg60313-images.html',
    type: 'primary',
    published: 'November 1917; Gutenberg edition 2019-09-17, updated 2024-10-17',
    accessed: consulted,
    scope:
      'Title/edition credits; Foreword printed pp. 1–5, especially method pp. 3–5; selected chapter IX pp. 105–106 tool recollections, chapter X pp. 108–111 remembered garden-map scope, and chapter XI pp. 113–115 garden boundaries, permission/fallowing and age-dependent help in fields actually read as digital English text. Wilson describes 1912 dictation translated by Goodbird and later corrections; this is mediated recollection, not an original audio transcript or a direct 1600–1845 Big Hidatsa field diary. His claims of unchanged culture, a representative woman standing for all people, and pre-Columbian equivalence are not adopted. Ceremonial stories, songs, recipes and diagram measurements are not reproduced. Figure 36 pixels (700×475) were inspected separately with its explicit approximate/incomplete scope at p. 108; no measured geometry was extracted. No complete facsimile or linked bibliography is claimed read. LOC 17027877 indexed catalogue lists Wilson, Waheenee and Goodbird and public-domain/free-reuse status; direct LOC returned 403. No new media is added by this module.',
  },
  {
    id: 'hidatsa-river-changes',
    title: 'The River',
    institution:
      'Knife River Indian Villages National Historic Site, National Park Service',
    url: 'https://www.nps.gov/knri/learn/historyculture/the-river.htm',
    type: 'scholarship',
    published: 'Webpage last updated 2020-06-05',
    accessed: consulted,
    scope:
      'Selected historical river/trade, 1837 smallpox and 1845 relocation paragraphs; The Rivers Today selected 1944 authorization/1953 Garrison Dam completion and displacement discussion. No original ship log, whole epidemic study, legal treaty/dam act or engineering/flood map independently read. Later dam construction and 1954 household relocation in MHA’s account retain different dates. Distances, acreage fractions, universal last-departure language and demographic totals are not adopted. Modern visitor map is not a historical route/boundary; no new numerical geography or image copied.',
  },
];

export const hidatsaCommunityContext: HistoricalContext = {
  id: 'hidatsa-gardens-relocation-context',
  title: 'Hidatsa gardens, village relocation and continuing knowledge',
  region: 'Americas',
  interval: {
    start: 1600,
    end: 1954,
    label: 'Selected village, recollection and displacement records, 1600–1954',
    precision: 'approximate',
    note: 'Big Hidatsa’s original c.1600–1845 case remains exact. Later Like-a-Fishhook recollections, 1917 publication, 1953 dam completion and 1954 relocation belong to this separate reference. Different villages have distinct occupations; no continuous occupation of one place or end of Hidatsa people is implied.',
  },
  summary:
    'Women’s cultivation, houses and storage supported households and exchange. Disease, relocation and government projects changed the settings in which people carried this knowledge; later records do not become direct witnesses to every earlier village.',
  subjectIds: ['hidatsa-villages'],
  citations: [
    cite('knife-village', 'Selected Big Hidatsa occupation'),
    cite('mha-history', 'Village & Relocations; Elbowoods & Garrison Dam Relocations'),
    cite('hidatsa-maxidiwiac-1917', 'Foreword; chapter X garden context'),
  ],
  phases: [
    {
      year: 1600,
      label: 'c.1600: selected Big Hidatsa occupation begins',
      title: 'One village has its own frame',
      text: 'NPS places establishment of Big Hidatsa around 1600. Neighboring Awatixa villages have different histories; this is not the beginning of Hidatsa people or all cultivation in the region.',
      citations: [
        cite('knife-village', 'Village establishment and continuing importance'),
      ],
    },
    {
      year: 1837,
      label: '1837: epidemic and village reorganization',
      title: 'A trading region also carried danger',
      text: 'MHA’s selected history describes the smallpox epidemic and subsequent consolidation of village survivors. NPS connects the epidemic with river travel. The accounts do not supply one identical household experience or a precise mortality total adopted here.',
      citations: [
        cite('mha-history', 'The Hidatsa Proper: 1837–1845'),
        cite('hidatsa-river-changes', 'Selected 1837 epidemic paragraph'),
      ],
    },
    {
      year: 1845,
      label: '1845: Like-a-Fishhook established upriver',
      title: 'Relocation did not end community knowledge',
      text: 'MHA identifies Núeta and Hiraacá establishing Like-a-Fishhook. This changes the place of residence and the case’s village frame; it does not end gardening, family relationships or Hidatsa identity.',
      citations: [
        cite('mha-history', 'Village & Relocations: 1845'),
        cite('knife-village', 'Relocation and continuing importance'),
      ],
    },
    {
      year: 1917,
      label: '1917: publication of a woman’s mediated agricultural account',
      title: 'Remembered gardens are later evidence',
      text: 'The University of Minnesota book presents Maxi´diwiac’s recollections through Goodbird’s interpretation and Wilson’s editing. The foreword describes 1912 recording and later corrections. Her Like-a-Fishhook memories are not a direct transcript of earlier Big Hidatsa life.',
      citations: [
        cite(
          'hidatsa-maxidiwiac-1917',
          'Title;Foreword pp. 3–5; chapter X pp. 108–111',
        ),
      ],
    },
    {
      year: 1953,
      label: '1953: Garrison Dam completed, in NPS’s account',
      title: 'River engineering changed the conditions of life',
      text: 'The NPS account describes the dam and flooding of reservation land despite tribal objections. The construction milestone is separate from MHA’s date for completed relocation the following year.',
      citations: [cite('hidatsa-river-changes', 'The Rivers Today')],
    },
    {
      year: 1954,
      label: '1954: relocation completed, in MHA’s account',
      title: 'Displacement disrupted bottomland households',
      text: 'MHA describes families moved from fertile bottomlands, communities dismantled and people scattered across new tracts. Its account places relocation completion in fall 1954. These losses do not authorize a story that the communities vanished.',
      citations: [
        cite('mha-history', 'Elbowoods & Garrison Dam Relocations: fall 1954'),
      ],
    },
  ],
};

export const hidatsaCommunityWorkDimension = {
  text: 'Cultivation, drying/storage and earthlodge work connected household authority with exchange. A named woman’s later recollections add garden boundaries, permission and flexible use of fields; they do not establish one unchanging rule for all earlier villages.',
  citations: [
    cite('knife-subsistence', 'Women’s Influence; Processing Foods; Food Storage'),
    cite('knife-women', 'Construction and ownership'),
    cite('hidatsa-maxidiwiac-1917', 'Chapter XI, pp. 113–115'),
  ],
};

export const hidatsaCommunityFamilyEvidence: NonNullable<Journey['familyEvidence']> = {
  title: 'Tools, crops and evidence of work',
  object: 'knife-garden-tools',
  text: 'The image illustrates a hoe with a bison shoulder blade attached to wood and a separate wooden digging stick. It is a teaching illustration, not a dated excavated tool photograph. The community-authored NPS guide describes women preparing soil, growing corn, beans, squash and sunflowers, drying crops and storing food. The image helps explain materials and form; the supplied account explains work and authority that shape alone cannot establish.',
  citations: [
    cite(
      'knife-subsistence',
      'Teacher’s Note; tool illustration; Women’s Influence; Processing Foods',
    ),
  ],
  notice: [
    'Find the part associated with an animal and the parts made from wood.',
    'Which task in the capsule could these illustrated tools help explain?',
  ],
  claimPrompt:
    'Explain how the illustration and supplied community account answer different questions about garden work. Name one thing the image cannot establish about a particular historical tool or worker.',
  returnPrompt:
    'When a tool appears in another case, ask which material evidence and which account explain its use.',
  feedback:
    'Form and materials can help explain the illustrated hoe and digging stick. A maker, exact date, excavation context or universal assignment of work cannot be recovered from the image alone.',
};

export function applyPlainsHidatsa(c: Corpus): void {
  const s = c.subjects.find((r) => r.id === 'hidatsa-villages');
  if (!s) throw new Error('Hidatsa continuation requires the existing dossier');
  for (const row of hidatsaCommunitySources) {
    const i = c.sources.findIndex((r) => r.id === row.id);
    if (i < 0) c.sources.push(row);
    else c.sources[i] = row;
  }
  const scopes: Record<string, string> = {
    'knife-village':
      'Selected establishment/1845 relocation/continuing cultural importance text reread; page updated 10 April 2015. Big Hidatsa’s frame is not transferred to Lower Hidatsa or Awatixa/Sakakawea. Village/lodge/population estimates and visitor distances not newly adopted. No source map or original photo byte-parity claim.',
    'knife-subsistence':
      'Teacher’s Note and selected Women’s Influence, Processing Foods, Food Storage, Hunting and Foraging paragraphs reread. Named MHA-community authorship remains explicit. Public descriptions of prayers/songs and purchased sacred rights were encountered but are not reproduced or reenacted. Tool illustration and student-made cache model remain explanatory images with their own roles, not ancient excavated artifacts. No recipe, nutritional efficacy or universal gender division inferred.',
    'knife-women':
      'Selected women’s construction/ownership/maintenance, clan cooperation, experienced supervision and surviving-depression/reconstructed-lodge passages reread. Page updated 22 September 2023. The NPS Photo label is explicit; original 650×433 atlas photograph actually viewed unchanged. No exposure date, exact labor duration, household count or universal social constitution newly adopted. Linked music/story videos not played or copied.',
    'mha-history':
      'Selected Three Affiliated Tribes, The Hidatsa Proper, Village & Relocations and Elbowoods & Garrison Dam Relocations passages reread. Distinct peoples’ histories and 1845/1954 changes are kept separate. The current page incorporates attributed older outsider passages, including extinction language and incompatible dates/counts; those are not adopted as present-day community facts or harmonized silently. Current treaty/dam payment, acreage and legal-status details not independently verified or reproduced. Linked sacred traditions, full source books and current 2025 GIS map not copied.',
  };
  for (const [id, text] of Object.entries(scopes)) {
    const r = c.sources.find((v) => v.id === id);
    if (!r) throw new Error(`Missing retained source ${id}`);
    const marker = `Hidatsa selected consultation, ${consulted}: `;
    if (!r.scope.includes(marker)) {
      r.scope = `Prior consultation, ${r.accessed} (retained): ${r.scope} ${marker}${text}`;
      r.accessed = consulted;
    }
  }
  c.contexts ??= [];
  const i = c.contexts.findIndex((r) => r.id === hidatsaCommunityContext.id);
  if (i < 0) c.contexts.push(hidatsaCommunityContext);
  else c.contexts[i] = hidatsaCommunityContext;
  s.contextIds = [...new Set([...(s.contextIds ?? []), hidatsaCommunityContext.id])];
  s.summary =
    'Women’s gardens, houses and food stores helped make Hidatsa villages places of household work and regional exchange. Cultivation joined hunting and gathering rather than replacing them. Community-authored teaching and a named woman’s later recollections explain knowledge and authority while distinguishing Big Hidatsa from subsequent homes, displacement and continuing life.';
  s.sections = [
    sec(
      'Gardens produced food and possibilities for exchange',
      'The community-authored NPS guide places women’s cultivation at the center of village economic life. Preparing land, tending corn, beans, squash and sunflowers, then drying and storing food required a connected sequence of work. Stored crops could sustain a household beyond harvest and supply exchange with visitors. Hunting and gathering also contributed to the food base. A village was therefore more than a cluster of buildings: fields, drying spaces and storage linked its residents to the surrounding land and other communities.',
      cite(
        'knife-subsistence',
        'Teacher’s Note; Women’s Influence; Processing Foods; Food Storage;Hunting and Foraging',
      ),
    ),
    sec(
      'An earthlodge joined construction with household authority',
      'NPS describes women constructing, owning and maintaining earthlodges through clan cooperation and experienced supervision. Gathering building material and making a supporting framework were practical tasks connected with knowledge and responsibility. Drying racks and cache pits extended this work into food storage. The standing interpretive lodge helps explain a structure, while shallow depressions mark former houses at Big Hidatsa. These are different forms of evidence. Neither the modern building nor the tool illustration establishes every historical resident, tool maker or ownership arrangement by appearance alone.',
      cite(
        'knife-women',
        'Construction/ownership; clan cooperation; depressions and reconstruction',
      ),
      cite('knife-subsistence', 'Food Storage; tool illustration'),
    ),
    sec(
      'The river brought visitors and changing pressures',
      'River travel helped make the villages places of exchange. Goods, visitors and disease moved through these relationships; the NPS historical account connects the 1837 smallpox epidemic with a steamboat arrival. MHA’s history describes village survivors consolidating and the 1845 move to Like-a-Fishhook. Such changes altered residence and community organization. The Big Hidatsa occupation frame ends at that move, not at the end of a people. The different Mandan, Hidatsa and Arikara histories should be read together without erasing their distinctions.',
      cite('hidatsa-river-changes', 'Historical river/trade and 1837 paragraphs'),
      cite(
        'mha-history',
        'Three Affiliated Tribes;The Hidatsa Proper;Village & Relocations',
      ),
    ),
    sec(
      'Later voices explain continuity through changed settings',
      'Maxi´diwiac, also known as Buffalobird-woman, describes garden boundaries, permission to use adjoining ground and letting fields rest in an account published in 1917. Her memories concern Like-a-Fishhook, after the selected Big Hidatsa occupation. They add a particular woman’s knowledge rather than a timeless rule for all earlier villages. Twentieth-century government projects brought further displacement. MHA’s account describes families moved from fertile bottomlands as the Garrison Dam transformed their landscape. That later history belongs to the separate reference, alongside the knowledge and communities that continued.',
      cite(
        'hidatsa-maxidiwiac-1917',
        'Foreword; chapter X, pp. 108–111; chapter XI, pp. 113–115',
      ),
      cite('mha-history', 'Elbowoods & Garrison Dam Relocations'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A named account still has an interpreter and editor',
      'Wilson’s foreword describes recording Maxi´diwiac’s account through Edward Goodbird’s translation in 1912 and reading earlier notes back for corrections during later visits. He also explains arranging the material and its English idiom. This makes authorship and mediation part of the evidence. The account is not an unedited sound recording. Nor should Wilson’s ambition to recover an unchanged earlier culture become our conclusion. A woman’s detailed recollection can preserve decisions, relationships and expertise without representing every person or directly describing the 1600 village.',
      cite('hidatsa-maxidiwiac-1917', 'Foreword, printed pp. 3–5'),
    ),
    sec(
      'Field knowledge includes boundaries and limits of memory',
      'In her account, adjoining gardeners shared work along a boundary and sought permission before planting it. She describes resting fields flexibly, rather than following one fixed timetable. Her explanation of a garden map also names its limits: approximate positions and fields near her own family, not every garden. These statements help us ask how knowledge and use of land were negotiated. They do not create a measured survey of Big Hidatsa. The book also describes Goodbird making a model hoe under her direction from a steer shoulder blade. That identified model must not be silently equated with the separate NPS tool illustration. The modern lodge photograph and teaching-tool illustration have different limits again: they explain structures and materials without becoming dated household artifacts. A fuller account needs more women’s and families’ histories, source-specific plans and the circumstances of each later relocation.',
      cite('hidatsa-maxidiwiac-1917', 'Chapters IX–XI, pp. 105–106, 108–111, 113–115'),
      cite('knife-women', 'Reconstructed earthlodge'),
      cite('knife-subsistence', 'Tool illustration and community authorship'),
    ),
  ];
  s.evidenceReading = {
    title: 'Garden work, a mediated voice and different place histories',
    introduction:
      'The supplied images are a modern reconstruction and teaching illustration. Community-authored text and a later named recollection add evidence of work and authority that image form alone cannot recover.',
    items: [
      {
        label: 'A teaching tool is not an accessioned ancient implement',
        text: 'The NPS guide identifies a shoulder-blade hoe and digging stick, and describes women’s work producing crops for use and trade.',
        interpretation:
          'Read materials and form with the account of work. The illustration does not supply a particular maker, exact production date, findspot or an unchanged division of labor for every household.',
        citations: [
          cite(
            'knife-subsistence',
            'Teacher’s Note; Women’s Influence; tool illustration',
          ),
        ],
      },
      {
        label: 'A named woman describes permission and adaptable practice',
        text: 'Maxi´diwiac’s later recollections describe neighbors’ garden boundaries, permission and flexible periods of resting fields.',
        interpretation:
          'These are particular remembered arrangements, mediated through translation and editing. They should not become a timeless land law or direct evidence for every Big Hidatsa garden before 1845.',
        citations: [
          cite('hidatsa-maxidiwiac-1917', 'Foreword, pp. 3–5; chapter XI, pp. 113–115'),
        ],
      },
      {
        label: 'Relocation changes the setting without ending the people',
        text: 'Big Hidatsa’s selected occupation ends in 1845. MHA separately describes Like-a-Fishhook and the later Garrison Dam relocations.',
        interpretation:
          'An occupation endpoint, a dam-construction milestone and household relocation are different changes. Keeping their dates separate prevents a vanished-people story and preserves the work of continuity.',
        citations: [
          cite('knife-village', '1845 relocation'),
          cite('hidatsa-river-changes', 'The Rivers Today'),
          cite(
            'mha-history',
            'Village & Relocations; Elbowoods & Garrison Dam Relocations',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Explain a tool with a source',
    duration: 'About 10 minutes',
    steps: [
      'Look at the teaching illustration. Identify its animal and plant materials from the supplied explanation.',
      'Read the capsule and connect one illustrated tool with preparing soil. Name another task in the sequence of growing and storing food.',
      'Separate what the image shows from what the community account says about work.',
      'Write one supported claim and one question requiring a dated tool, household account or another source. Do not infer a universal rule from shape alone.',
    ],
    explanation: `Source capsule — editorial paraphrase: ${hidatsaCommunityFamilyEvidence.text} Describe one supported connection between material, tool and garden work, then identify the additional evidence needed to explain a particular household.`,
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent MHA/community or historian acceptance',
    scope:
      'Women’s cultivation, household construction/storage, exchange and changing settings through renewed community/NPS accounts and a selected mediated named recollection. Two new substantive source records and four dated renewals preserve prior scopes. The complete original 1600–1845 interval/note/claims/dimensions/terms and all old media fields/pixels remain exact. No media object, annotation, placeStudy, route or relationship is added.',
    limitations: [
      'The 1917 account presents later Like-a-Fishhook memories through Goodbird’s translation and Wilson’s editing. Selected text/edition metadata, not the complete facsimile, was consulted. Original manuscript/audio and the complete 1987 annotated reissue were not read; LOC direct access returned 403 and its catalogue description is indexed evidence only.',
      'Wilson’s unchanged-culture/representative-person/pre-Columbian projections are not adopted. The NPS teaching guide and MHA webpage also contain broad or inherited outsider passages; no extinction language, population total, universal household experience or harmonized contradictory date is adopted.',
      'Different source dates remain separate: c.1600–1845 Big Hidatsa; later Like-a-Fishhook recollections and 1917 publication;1953 dam completion in NPS and fall 1954 relocation completion in MHA. No law/treaty, dam-compensation or demographic claim is independently certified.',
      'No village-plan media is included by this module. The identified Lower Hidatsa plan concerns a different occupation and lacks established creator/creation-date/image ownership in its page description. A remembered Like-a-Fishhook garden map is a separate potential source, not a measured Big Hidatsa survey. Any visual adoption requires its own inspected pixels, rights and date/geometry proposal.',
      'Both existing images were actually viewed and all four files hashed. Exposure/creation dates remain unknown where the original records say unknown. The standing lodge is a reconstruction and the tool image explanatory; no new rights, artwork source or ancient findspot is inferred.',
      'Public introductory accounts do not grant permission to reproduce restricted songs, stories, sacred rights or ceremonies. None is copied or reenacted. Independent historical/community review, family usability, screen-reader/device behavior and physical print acceptance remain open.',
    ],
  };
}
