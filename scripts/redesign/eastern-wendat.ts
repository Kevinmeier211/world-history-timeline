/** Output-only KEEP case draft; no asset, numerical reference phase or central adoption. */
import type { Corpus, Source, Subject } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const wendatCommunitySources: Source[] = [
  {
    id: 'wendat-community-history',
    title: 'Histoire & culture: selected public family and governance accounts',
    author: 'Nation Wendat / Conseil de la Nation',
    institution: 'Nation Wendat',
    url: 'https://www.wendake.ca/histoire-et-culture',
    type: 'primary',
    accessed: consulted,
    scope:
      'Selected actual French official HTML: Notre communauté; Notre influence; Gouvernance; Yahwatsira’ — la famille, berceau de la cohésion sociale; Un héritage matrilinéaire. These public sections explain historic longhouses, families/clans, transmission, diplomacy and the Nation’s present institutions in its own voice. No current population/territory/business totals, claim of influence on other constitutions, creation narrative, ceremonial knowledge or page image adopted. Search exposed an additional cached passage, which is not a basis for the text. This is a present institutional account, not testimony identifying a particular Lainé resident or house allocation around 1600. No explicit open reuse licence established; short attributed editorial paraphrase, no official or community-authorized translation claimed. No new image/audio copied and no community approval of the atlas inferred.',
  },
];

export const wendatWorkDimension: Subject['dimensions'][string] = {
  text: 'Community accounts explain farming, household cooperation and diplomacy; a dating model asks when this particular village was occupied. Neither kind of account replaces the other.',
  citations: [
    cite('laine-wendat', 'Who are the Wendat?; Northern Iroquoian Societies'),
    cite('wendat-community-history', 'Yahwatsira’ — la famille; Notre influence'),
    cite('laine-chronology', 'Figure 2 and end Discussion'),
  ],
};

/** KEEP inquiry: reviewed sources do not justify a new numerical phase window. */
export const wendatReferenceDisposition = {
  action: 'retain bounded case without a new HistoricalContext',
  reason:
    'Alternative modeled placements are not successive village phases. Modern 2011 naming, 2022 publication and present community interpretation belong in provenance; no broader numerical historical phase sequence is manufactured.',
} as const;

export function applyEasternWendat(c: Corpus): void {
  const renewals = {
    'laine-chronology':
      'Selected actual official Cambridge full-text HTML: Abstract; Introduction opening; short-lived sample discussion and Figure 2 caption; Possible Constraints on Site Dating through the charcoal-constraint introduction; end Discussion. DOI retrieval returned an internal tool error; the official publisher article was opened normally after primary-source search. The abstract describes 1595–1626 with 95.4% probability while the end Discussion describes the bounds through 68.3% ranges. The entire existing interval/note retains that difference and assigns no single percentage. Article publication 29 April 2022 and CC BY4.0 declaration reread. Existing complete1600×1118 local Figure 2 pixels inspected; no new download, supplementary-material consultation, model execution, underlying excavation report or complete-table audit claimed.',
    'laine-wendat':
      'Selected actual official exposed HTML: Who are the Wendat? and The Jean-Baptiste Lainé Site is an eminent part of this heritage, each expressly crediting the Nation’s Onyionhwentsïio’ Office; What is the Jean-Baptiste Lainé Site?; What was uncovered by archaeologists?; Resources; Jean-Baptiste Lainé Site or Mantle Site?; Northern Iroquoian Societies; acknowledgements. The opened page has twelve signs while a search-cached version has the older six-sign arrangement. Current citations therefore use headings; earlier numbered locators remain dated prior scope. No population, diet/acreage, artifact or longhouse total newly adopted as a measurement. No source sign, crest, artifact, modern-longhouse or map pixels inspected/reused; no open image licence established.',
  };
  for (const [id, text] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw Error(`Missing inherited Wendat source: ${id}`);
    const marker = `Eastern KEEP selected renewal, ${consulted}: `;
    if (!source.scope.includes(marker)) {
      source.scope = `Prior consultation, ${source.accessed} (retained): ${source.scope} ${marker}${text}`;
      source.accessed = consulted;
    }
  }
  for (const source of wendatCommunitySources) {
    const existing = c.sources.find((row) => row.id === source.id);
    if (existing && JSON.stringify(existing) !== JSON.stringify(source))
      throw Error(`Wendat source identity collision: ${source.id}`);
    if (!existing) c.sources.push(source);
  }
  const s = c.subjects.find((row) => row.id === 'wendat-laine');
  if (!s) throw Error('Missing inherited Wendat case');
  s.summary =
    'A village depended on farming, building and relationships beyond one household. Public Wendat accounts explain that work and its political setting. A modern scientific graph asks a different question: when did this particular community occupy the Jean-Baptiste Lainé site? Its two calendar possibilities should not be mistaken for a century of continuous occupation.';
  s.sections = [
    sec(
      'A village joined households, fields and relationships',
      'The public interpretation places Wendat villages beside fields of corn, squash and beans, with farming alongside fishing, hunting, gathering, trade and diplomacy. These activities needed repeated work, stored knowledge and relationships beyond one house. House construction also required wood for frames and bark for coverings. They do not make all Iroquoian-speaking peoples one nation. Nor does the survival of a decorated pot establish the daily experience or authority of every resident.',
      cite(
        'laine-wendat',
        'Who are the Wendat?; What was uncovered by archaeologists?; Resources; Northern Iroquoian Societies',
      ),
    ),
    sec(
      'A reclaimed name identifies whose heritage is discussed',
      'The museum identifies the site as an ancestral Wendat village and explains its 2011 renaming from Mantle to Jean-Baptiste Lainé, honoring a Wendat veteran. The Nation supplied the opening heritage summaries. Its present public account also connects longhouses with families, clans and shared knowledge. These are attributed explanations of community life; they do not recover the names or experiences of every village resident.',
      cite(
        'laine-wendat',
        'Heritage summary; Jean-Baptiste Lainé Site or Mantle Site?',
      ),
      cite(
        'wendat-community-history',
        'Yahwatsira’ — la famille, berceau de la cohésion sociale',
      ),
    ),
    sec(
      'Two date clusters do not make a century-long village',
      'Manning and Birch show that short-lived plant samples alone can fit calendar positions near either 1500 or 1600 because the calibration curve is not a straight ruler. Figure 2 displays that ambiguity. The two clusters represent alternative calendar placements, not proof of continuous occupation between them. Their fuller analysis uses additional constraints, including wood charcoal, to prefer a range around 1595–1626.',
      cite(
        'laine-chronology',
        'Short-lived samples and Figure 2; Possible Constraints on Site Dating; end Discussion',
      ),
    ),
    sec(
      'A changed calendar changes the historical question',
      'The older estimate used material styles and the scarcity of European goods in its reasoning. The newer placement complicates assumptions about when communities moved and how objects circulated. It does not prove a direct encounter with a particular European visitor. Scientific dating and community interpretation address related questions, but neither reduces a living people to a single archaeological site.',
      cite(
        'laine-chronology',
        'Introduction; end Discussion, specific-site applicability',
      ),
      cite('laine-wendat', 'Nation-provided heritage summaries'),
    ),
  ];
  s.deeperReading = [
    sec(
      'Household knowledge is more than a point on an axis',
      'The present Nation Wendat describes historic longhouses as places joining families and clans through sharing and knowledge transmission. Its public discussion of matrilineal heritage explains membership through the maternal line and describes contemporary political responsibilities. These are the Nation’s own explanations, offered here with attribution rather than turned into an archaeological census. A modeled date can change which neighboring events a researcher considers; it cannot identify who taught a child, assigned a particular task or spoke for a household at this site.',
      cite(
        'wendat-community-history',
        'Yahwatsira’ — la famille; Un héritage matrilinéaire; Gouvernance',
      ),
    ),
    sec(
      'Keep the uncertainty attached to the number',
      'A village can have a short occupation and still be difficult to place on a calendar. The selected graph shows that distinction. Additional constraints support the authors’ preferred later placement, but the abstract and end Discussion describe its probability bounds differently. The disagreement matters because the model estimates a likely period of occupation; it cannot give the year the first house was built. Other sites require their own dating evidence.',
      cite(
        'laine-chronology',
        'Abstract; Figure 2; end Discussion, 1595–1626 and specific-site applicability',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'Read a model beside an attributed community account',
    introduction:
      'The supplied graph is a modern research figure. The following short source capsules distinguish its observation, the paper’s interpretation and a public community account.',
    items: [
      {
        label: 'Two groups of possible calendar placements',
        text: 'Figure 2 shows short-lived plant-sample models with separated groups near 1500 and 1600. Panel (a) uses an internal sequence. Panel (b) treats the samples as one phase.',
        interpretation:
          'The figure compares alternative placements. It does not count residents, show continuous occupation across the gap or present the paper’s later constrained result.',
        citations: [cite('laine-chronology', 'Figure 2, panels(a)/(b) and caption')],
      },
      {
        label: 'A preferred range retains its qualification',
        text: 'The paper prefers a later placement using further constraints. Its abstract and end Discussion attach different probability descriptions to 1595–1626.',
        interpretation:
          'The existing case preserves the range and the disagreement without claiming exact founding/abandonment years or one settled confidence percentage. The raw models were not rerun for this atlas.',
        citations: [
          cite(
            'laine-chronology',
            'Abstract; Possible Constraints on Site Dating; end Discussion',
          ),
        ],
      },
      {
        label: 'A public account explains social relationships',
        text: 'The Nation’s public family section connects historic longhouses with families, clans and knowledge transmission.',
        interpretation:
          'This is an attributed present account with its own purpose. Neither its public availability nor a licence on a research figure supplies community approval of this atlas or authority over every cultural meaning.',
        citations: [
          cite(
            'wendat-community-history',
            'Yahwatsira’ — la famille, berceau de la cohésion sociale',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Two possibilities, one question',
    duration: '10–15 minutes',
    steps: [
      'Find panel (b), the smaller right-hand graph. Point to its two separated groups of shaded peaks near 1500 and 1600 on the calendar axis.',
      'Describe one visible difference between two possible calendar placements and an unbroken occupation through all the intervening years.',
      'Read the source capsule. Name the additional kind of evidence the authors use, rather than guessing a population from the height of a peak.',
      'Write one question about household work that the graph cannot answer, and identify the public community account that addresses social relationships.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: this 2022 research figure models dates from short-lived plant remains. Its two calendar possibilities are alternatives. The paper uses additional wood-charcoal constraints to assess the preferred later placement. A separate public Nation Wendat account explains longhouses through families, clans and knowledge transmission. The graph is neither a population count nor a recovered account of one household.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian, Wendat or family approval',
    scope:
      'A source-sized KEEP inquiry joining the unchanged model figure, selected dating text and attributed public accounts of work and social relationships. No new numerical reference phases or media assets.',
    limitations: [
      'The entire original 1595–1626 interval, alternatives, note/precision, identity, coordinates, claims, object order, dimensions and media metadata/pixels remain intact. The abstract 95.4% and end-Discussion 68.3% descriptions are retained as a source difference, not silently reconciled.',
      'Only the listed publisher text sections and existing local Figure 2 pixels were reread. No complete supplement, underlying excavation report, model execution, artifact examination, fresh remote-image byte comparison or independent dating reanalysis supplied.',
      'The museum’s current twelve-sign page differs from its cached six-sign order. Current headings identify the selected passages; the earlier dated scope remains. Modern community interpretation is attributed and does not assign particular residents or offices to the village.',
      'No new geographical study, measured plan, route or numerical historical phase sequence is proposed. Independent specialist/community assessment, real family use, human accessibility/device checks and physical print acceptance remain open.',
    ],
  };
}
