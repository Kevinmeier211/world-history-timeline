/** Selected source-qualified industry account, adopted after the Pacific checkpoint. */
import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const hineIndustrySources: Source[] = [
  {
    id: 'hine-nclc-collection',
    title: 'National Child Labor Committee Collection: background and caption records',
    author: 'Barbara Orbach Natanson',
    institution: 'Library of Congress, Prints and Photographs Division',
    url: 'https://www.loc.gov/static/collections/national-child-labor-committee/about-this-collection/overview.html',
    type: 'archive',
    accessed: '2026-11-04',
    scope:
      'On 4 November the Library’s complete collection overview was retrieved. The Photo Captions describes transcribed cards, typed strips and later annotations, and leaves the identity of the compiler uncertain. Earlier consultation on 29 October: selected official indexed page text actually read: Background and Scope, The Photographs, The Photo Captions, and the caption-method portions of Arrangement and Access. Direct-page retrieval returned 403; the institutional text was exposed in the search result, not an independently downloaded page or the original caption-card pixels. The account dates NCLC founding to 1904, Hine’s work from 1908, distribution through reports/publications/exhibits and his exhibits role from 1913. It explicitly leaves the caption-card compiler uncertain and warns that caption accuracy is not easily verified. No linked Kaplan volume, reports, complete album, employment census or photograph-to-legislation causal analysis read; no new image copied.',
  },
  {
    id: 'hine-mollahan-group',
    title: 'Spinners & doffers in Mollahan Mills, Newberry, South Carolina',
    author: 'Lewis Wickes Hine (photograph attribution in the catalogue)',
    institution: 'Library of Congress, National Child Labor Committee collection',
    url: 'https://www.loc.gov/item/2018674903/',
    type: 'primary',
    accessed: consulted,
    scope:
      'Official indexed catalogue title/caption only: group described as spinners and doffers in Mollahan Mills, Newberry; caption dated 3 December 1908 and names Sara R. Hine as witness. Direct item retrieval returned 403. The title’s claim about other small workers is the caption writer’s assertion, not a measured age distribution. Full Notes, original caption-card pixels, image pixels and item-specific rights were not inspected in this renewal. No new photograph is reproduced, no age/name transferred to the selected child and no numerical prevalence inferred.',
  },
  {
    id: 'hine-photographic-technique',
    title: 'Focusing on Lewis Hine’s Photographic Technique',
    author: 'Ryan Brubacher',
    institution: 'Library of Congress, Picture This; posted by Barbara Orbach Natanson',
    url: 'https://blogs.loc.gov/picturethis/2019/01/focusing-on-lewis-hines-photographic-technique/',
    type: 'archive',
    published: '2019-01-31',
    accessed: consulted,
    scope:
      'Selected introduction and depth-of-field discussion/comparisons actually read, including the distinction between documentary work and aesthetic choices. Author attribution is the named guest author, not merely the blog account that posted it. The particular linked Newberry Mills group is a different photograph from the selected Mollahan image. No linked source-image pixels, camera archive, optical measurement or claim about the exact camera/aperture used for the selected photograph established. No image reused.',
  },
  {
    id: 'hine-keating-owen-1916',
    title: 'Keating-Owen Child Labor Act: historical transcript and selected context',
    institution: 'United States Congress; National Archives, Record Group 11',
    url: 'https://www.archives.gov/milestone-documents/keating-owen-child-labor-act',
    type: 'primary',
    published: '1916-09-01',
    accessed: consulted,
    scope:
      'Institutional historical introduction and transcript sections 1–7 actually read; the page identifies the enrolled act, 1 September 1916, and is marked reviewed 8 February 2022. Selected use concerns interstate/foreign product shipment, age/hour conditions, inspection authority, certificates and the one-year delay before effect. These are the act’s provisions, not evidence of universal compliance or a ban on every kind of child work. The historical summary supplies the 1918 constitutional reversal; the judgment itself and linked act-facsimile pixels were not read. No current legal advice, census estimate, broad claim about the first ever child-labor law or causal effect of this photograph adopted; no image reused.',
  },
  {
    id: 'hine-federal-administration-1921',
    title:
      'Administration of the First Federal Child-Labor Law: selected administrative evidence',
    institution:
      'United States Department of Labor, Children’s Bureau; FRASER, Federal Reserve Bank of St. Louis',
    url: 'https://fraser.stlouisfed.org/title/administration-first-federal-child-labor-law-8365/fulltext',
    type: 'primary',
    published: '1921',
    accessed: consulted,
    scope:
      'FRASER’s HTML transcription/OCR of Bureau Publication 78, Legal Series 6/Industrial Series 6: title/1921 imprint; Julia C. Lathrop’s 1 December 1920 transmittal (printed pp.7–9); Introduction p.11; Part I pp.13–17 on scope and certificates; and the South Carolina inspection account pp.75–76 actually read. Adjacent OCR text was exposed during location, but no whole-volume or complete state-series consultation is claimed. The linked PDF returned a maintenance page, so no facsimile pixels or tabular OCR independently checked. Selected prose records spring 1918 inspections of 64 South Carolina establishments, underage employment in nine, missing certificates and later visits; this inspected sample does not establish statewide prevalence or identify the 1908 child. The report is an institutional account of its own administration, including continuation under different powers after 3 June 1918; its self-assessment is not independent outcome evaluation. No figure or form reproduced.',
  },
];

export const hineIndustryContext: HistoricalContext = {
  id: 'hine-labor-reform-context',
  title:
    'Photographic investigation, child-labor rules and enforcement in the United States',
  region: 'Americas',
  interval: {
    start: 1904,
    end: 1918,
    label: 'Selected campaign and federal-administration frame, 1904–1918 CE',
    precision: 'range',
    note: 'An orientation frame from the NCLC’s founding through a particular federal act’s operation and constitutional reversal. It preserves the selected case’s complete 3 December 1908 interval. The 1921 report publication and 2019 institutional interpretation are later evidence clocks, not extensions of this frame. This is neither the beginning of all US labor organizing nor the end of child labor.',
  },
  summary:
    'Investigators made working conditions visible through photographs, captions, reports and exhibits. Enforcing age and hour rules required different work: checking evidence, issuing certificates and inspecting workplaces. A campaign, a statute and its administration answer different questions.',
  subjectIds: ['hine-labor'],
  citations: [
    cite('hine-nclc-collection', 'Background and Scope; The Photo Captions'),
    cite('hine-keating-owen-1916', 'Transcript, sections 1, 3, 5 and 7'),
    cite(
      'hine-federal-administration-1921',
      'Printed pp.11, 15–17 and 75–76; HTML transcription',
    ),
  ],
  phases: [
    {
      year: 1904,
      label: '1904: the institutional founding date',
      title: 'An organization assembles a reform campaign',
      text: 'The Library of Congress dates the NCLC’s founding to 1904. Its collection account describes investigation and publicity aimed at working children’s conditions. Founding one organization is not the origin of every labor campaign or proof that all families shared its program.',
      citations: [cite('hine-nclc-collection', 'Background and Scope')],
    },
    {
      year: 1908,
      label: '3 December 1908: the catalogued photograph date',
      title: 'A particular mill scene enters a documented series',
      text: 'The selected catalogue caption places the spinner at Mollahan Mills, Newberry, and reports the overseer’s denial. A separate group caption from that mill is also dated 3 December 1908. Related records allow comparison without making either picture a census, a verified age record or the same view.',
      citations: [
        cite('hine', 'Existing photo; indexed caption title, Hine 358 / nclc.01451'),
        cite('hine-mollahan-group', 'Indexed caption title, 3 December 1908'),
      ],
    },
    {
      year: 1913,
      label: '1913: a change in Hine’s NCLC role',
      title: 'Photographs circulate through exhibits as well as print',
      text: 'The collection account dates Hine’s promotion to head of the exhibits department to 1913. It describes photographs circulating in reports, publications, slide shows and displays. These uses explain intended audiences and publicity work; they do not measure each viewer’s response.',
      citations: [
        cite('hine-nclc-collection', 'Background and Scope: distribution and exhibits'),
      ],
    },
    {
      year: 1916,
      label: '1 September 1916: approval of a particular act',
      title: 'Congress links product shipment to age and hour conditions',
      text: 'The Keating-Owen Act restricted interstate or foreign shipment of specified products made under prohibited child-employment conditions. It authorized inspections and provided for certificates. Its enactment was a legal step with a defined reach, not a direct result established for this single photograph or proof of compliance.',
      citations: [
        cite(
          'hine-keating-owen-1916',
          'Transcript, sections 1, 3 and 5; approval line',
        ),
      ],
    },
    {
      year: 1917,
      label: '1 September 1917: the act takes effect',
      title: 'Age evidence becomes an administrative task',
      text: 'The Children’s Bureau report identifies this effective date. Its certificate discussion explains why trustworthy age evidence and coordination with state systems mattered. The report distinguishes those administrative arrangements from simply printing an age rule.',
      citations: [
        cite(
          'hine-federal-administration-1921',
          'Printed pp.11 and 15–17; HTML transcription',
        ),
      ],
    },
    {
      year: 1918,
      label: 'Spring 1918 inspections; 3 June constitutional decision',
      title: 'Inspection findings and a court ruling change the inquiry',
      text: 'The report records underage employment and certificate gaps in a defined South Carolina inspection sample before the act was declared unconstitutional on 3 June. It also records later investigations under other authority and longer hours at the South Carolina factories revisited. This is a particular observed sequence, not proof that every protection or inspection ceased.',
      citations: [
        cite(
          'hine-federal-administration-1921',
          'Printed pp.11 and 75–76; HTML transcription',
        ),
      ],
    },
  ],
};

/** Shared integration chooses the comparison key; older dimensions stay intact. */
export const hineIndustryDimension = {
  text: 'Photographic investigation and publicity could expose a disputed workplace scene. Applying age and hour rules required a separate system of reliable records, certificates and inspection. Neither a reform image nor the existence of a statute alone proves workers’ ages or effective protection.',
  citations: [
    cite('hine', 'Photograph and indexed caption title'),
    cite('hine-nclc-collection', 'Background and Scope; The Photo Captions'),
    cite(
      'hine-federal-administration-1921',
      'Printed pp.15–17 and 75–76; HTML transcription',
    ),
  ],
};

export function applyIndustryHine(c: Corpus): void {
  c.contexts ??= [];
  const photograph = c.sources.find((source) => source.id === 'hine')!;
  photograph.scope =
    'Prior consultation, 2026-10-26 (retained): Lewis W. Hine, 3 December 1908, caption card and photograph, Hine 358; LC-DIG-nclc-01451; no known restrictions on publication. C8 access/visual check, 2026-10-29: existing local 1024×729 photograph actually viewed and main/thumbnail SHA256 verified; official indexed resource-title/caption text read, including the reported overseer statement, date and Sara R. Hine witness credit. Direct item and resource retrieval returned 403; full Notes/rights fields and original caption-card pixels were not freshly read. The inherited material/rights metadata is preserved rather than presented as newly verified. No exact age, name, hours, pay, biography, photograph-to-law causation or present remote-image byte parity established.';
  // Its accessed date remains 26 October: the full selected catalogue was not renewed.
  const research = c.sources.find((source) => source.id === 'hine-context')!;
  research.accessed = consulted;
  research.scope =
    'Prior consultation, 2026-10-26 (retained): Hine’s NCLC project, photographs and research context; no claim one image measures prevalence. C8 selected renewal, 2026-10-29: Kristi Finefield’s 2019 blog body on Virginia Tech students combining photographs with census/newspaper/labor-statistical research actually reread. It illustrates modern research questions and source combination; it is not a fresh census consultation, original worker testimony or an account of the selected Mollahan child. No linked items, books or original research records read through this blog and no image copied.';
  for (const source of hineIndustrySources)
    if (!c.sources.some((existing) => existing.id === source.id))
      c.sources.push(source);
  if (!c.contexts.some((context) => context.id === hineIndustryContext.id))
    c.contexts.push(hineIndustryContext);
  const s = c.subjects.find((subject) => subject.id === 'hine-labor')!;
  s.contextIds = [...new Set([...(s.contextIds ?? []), hineIndustryContext.id])];
  s.summary =
    'A photograph, its caption and an inspection report reveal different kinds of work. Hine’s mill scene became part of a reform campaign; the caption reports an overseer’s denial. Later officials checked age evidence and inspected workplaces to apply particular rules. Neither the child’s age nor effective protection follows from the image alone.';
  s.sections = [
    sec(
      'Machinery, a person and a chosen view',
      'A young figure stands in an aisle between long rows of spinning machinery. The repeated machine parts fill much of the image, while windows light one side of the room. Comparing the person’s height with the equipment makes the setting’s scale visible. Hine chose where to stand and when to expose the photograph. The supplied view documents this arrangement at one moment; it does not let us watch a complete task or reconstruct a working day.',
      cite('hine', 'Actual unchanged local photograph, LC-DIG-nclc-01451'),
    ),
    sec(
      'Investigation also required circulation',
      'The National Child Labor Committee employed Hine for investigative and photographic work from 1908. Photographs travelled through reports, the organization’s publications, newspapers, slide shows and exhibits. Making a case involved recording conditions and arranging evidence for audiences who might never enter the workplace. The Library of Congress describes Hine taking charge of the exhibits department in 1913. Photography belonged to a continuing campaign, alongside writing and display work; one image cannot measure the campaign’s reach or its effects.',
      cite(
        'hine-nclc-collection',
        'Background and Scope: hiring, distribution and exhibits',
      ),
    ),
    sec(
      'A caption records a contested explanation',
      'The selected caption says the child was tending her sides of the machinery, then reports an overseer saying, “She just happened in.” That is a conversation recorded in the campaign’s account, rather than speech audible in the photograph. Another Mollahan caption, dated the same day, identifies a group as spinners and doffers and names Sara R. Hine as witness. Together these records make a small evidence series: they show how work was described, without verifying ages or counting every child employed.',
      cite('hine', 'Indexed caption title: reported conversation; 3 December 1908'),
      cite(
        'hine-mollahan-group',
        'Indexed caption title: group, date and named witness',
      ),
    ),
    sec(
      'A rule needed records and inspectors',
      'The 1916 Keating-Owen Act addressed interstate and foreign shipment of specified products made under prohibited age or hour conditions. It authorized workplace inspections and provided for age certificates. The act took effect in September 1917. The Children’s Bureau’s later administration report explains why issuing a certificate was a job of checking evidence: a paper approved on unreliable information could leave inspectors having to establish age again. A statutory limit, a document and a verified fact were different things.',
      cite('hine-keating-owen-1916', 'Transcript, sections 1, 3, 5 and 7'),
      cite(
        'hine-federal-administration-1921',
        'Printed pp.11 and 15–17; HTML transcription',
      ),
    ),
    sec(
      'Inspection gives a bounded comparison',
      'In its spring 1918 South Carolina inspections, the Bureau reported twenty children under fourteen employed in nine of sixty-four establishments visited. It separately recorded missing federal certificates. These are findings from an inspected sample, not a statewide census or identification of this child ten years earlier. The act was declared unconstitutional in June 1918; later visits and state arrangements did not simply disappear. Following changes in working conditions therefore requires dated inspection evidence as well as photographs and the text of a law.',
      cite(
        'hine-federal-administration-1921',
        'Printed pp.11 and 75–76; HTML transcription',
      ),
    ),
  ];
  s.deeperReading = [
    sec(
      'The caption is evidence with its own history',
      'The Library of Congress transcribed titles, places and dates from caption cards received with the NCLC collection. Its collection account does not establish precisely who compiled every card. Typed strips, handwritten additions and later institutional annotations could share the same surface. Some cards were prepared after the photograph, or described a later revisit. The selected account credits a witness and preserves a reported denial, but neither feature independently checks every statement. The child’s own explanation, a verified age record and a complete employment history remain absent. Reading the caption critically does not require discarding it; it means naming whose account supplies each claim.',
      cite(
        'hine-nclc-collection',
        'The Photo Captions: compilation, witnesses and accuracy',
      ),
      cite('hine', 'Indexed caption title; earlier catalogue consultation retained'),
    ),
    sec(
      'A series expands questions without becoming a census',
      'A second caption can identify another kind of view or another description of work. It cannot turn a deliberately assembled reform collection into a random sample. The Library’s discussion of Hine’s technique also draws attention to choices of framing and focus across other photographs; those examples are not measurements of this image’s camera settings. Finefield’s later account shows students combining photographs with other records to investigate questions. Here, the enforcement report supplies a different source series with stated places, dates and administrative categories. Its authors were describing their own institution’s work, and missing papers were not automatically proof of underage employment. Comparing these sources reveals how claims were made and checked while keeping their populations, purposes and dates distinct.',
      cite('hine-mollahan-group', 'Indexed caption title only; image not inspected'),
      cite(
        'hine-photographic-technique',
        'Introduction and selected framing/focus comparisons',
      ),
      cite('hine-context', '2019 student research and source combination'),
      cite(
        'hine-federal-administration-1921',
        'Printed pp.15–17 and 75–76; HTML transcription',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'A scene, related captions and an enforcement record',
    introduction:
      'The following are visible observations and editorial paraphrases of identified records. The companion photograph itself is not supplied or newly inspected; its indexed caption title forms the second written record.',
    items: [
      {
        label: 'Visible machinery; a reported conversation',
        text: 'The supplied photograph shows a young figure beside spinning machinery. Its caption reports the overseer saying, “She just happened in,” after the picture was taken.',
        interpretation:
          'The machinery and relative scale can be examined directly. The denial depends on the caption’s account of a conversation. Neither provides a verified birth date, wage, full working day or the child’s own testimony. The caption’s argument should not become an invented biography.',
        citations: [
          cite('hine', 'Actual local photograph; indexed caption title, Hine 358'),
        ],
      },
      {
        label: 'A second caption gives a group description',
        text: 'LOC item 2018674903 describes spinners and doffers at Mollahan Mills, dates the caption 3 December 1908 and names Sara R. Hine as witness.',
        interpretation:
          'This supplies a related, separately identified record; it does not establish that the selected child appears in another view. A title naming occupations is evidence of how the group was described. Its assertion about other small workers does not verify their ages or establish a workforce count. Only indexed caption text was accessible in this consultation.',
        citations: [
          cite('hine-mollahan-group', 'Official indexed catalogue title/caption only'),
        ],
      },
      {
        label: 'A legal standard and an observed sample answer different questions',
        text: 'The 1916 act authorized inspection and age certificates. The Bureau’s 1921 report records underage employment and missing federal certificates as separate findings in its spring 1918 South Carolina inspection sample.',
        interpretation:
          'The law establishes a prescribed rule; the report describes particular administrative findings. Their difference makes enforcement assessable. Neither retrospectively proves the selected child’s age or that one photograph caused legislation. The report was read in HTML transcription; its linked PDF was unavailable.',
        citations: [
          cite('hine-keating-owen-1916', 'Transcript, sections 1, 3 and 5'),
          cite(
            'hine-federal-administration-1921',
            'Printed pp.15–17 and 75–76; HTML transcription',
          ),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What would you need to check?',
    duration: '10–15 minutes',
    steps: [
      'Find the person, the aisle and one repeated part of the machinery. Write one observation that another reader can point to in this photograph.',
      'Read the source capsule. Put the overseer’s reported explanation and the known photograph date in a caption column. Leave the child’s exact age unknown.',
      'Compare the caption’s account with the later certificate problem. Explain why having a paper and checking its evidence are different tasks.',
      'Make one supported claim and name one further record you would seek to investigate age or hours. Do not estimate the child’s age from appearance.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the catalogue dates this photograph to 3 December 1908 at Mollahan Mills, Newberry. Its caption reports that an overseer denied the child was working. A separate caption describes a group at that mill as spinners and doffers. These records do not verify this child’s exact age or hours. A later Children’s Bureau report explains that age certificates based on unreliable evidence could require inspectors to check ages again. A dated birth record could help investigate age; a dated work or inspection record could help investigate hours. None is supplied for this child.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian, worker or family approval',
    scope:
      'The unchanged photograph, a bounded indexed-caption series and selected primary federal administration evidence, with distinct campaign/legal/inspection clocks and a supplied family activity.',
    limitations: [
      'The complete 3 December 1908 case interval, identity, coordinates, older claims/dimensions, object order and original image bytes remain intact. No child name, exact age, hours, pay, biography or image-to-legislation causation recovered.',
      'Selected LOC catalogue/resource pages returned 403. Fresh consultation distinguishes actual existing photo pixels, official indexed caption text and earlier retained catalogue scope; companion image and original caption-card pixels were not inspected. Selected item-specific material and rights metadata were preserved, not renewed.',
      'The 1921 report was read at selected HTML transcription/OCR scope; its linked PDF returned a maintenance page. Its inspection sample and institutional self-account are not a statewide census, independent outcome evaluation or identification of the 1908 child.',
      'No new image, map, geographic study or inferred route is supplied. Contemporary independent specialist/worker-community review, real family use, human accessibility/device checks and physical print acceptance remain open.',
    ],
  };
}
