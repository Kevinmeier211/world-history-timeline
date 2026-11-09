/** OUTPUT-ONLY WWII split proposal. No IDs or audience UI have been adopted.
 * Source-facsimile/access gates and AGE-ENTRY-PROPOSAL.json remain binding review inputs.
 * Intended imports are scripts/redesign-relative, for later explicit root adoption.
 */
import type { Corpus, HistoricalContext, Source, Subject } from '../../src/atlas/model';

export const worldWarTwoSplitSources: Source[] = [
  {
    id: 'ww2',
    title: 'World War II: In Depth',
    institution: 'United States Holocaust Memorial Museum',
    url: 'https://encyclopedia.ushmm.org/content/en/article/world-war-ii-in-depth',
    type: 'scholarship',
    accessed: '2026-10-29',
    scope:
      '26 October 2026 recorded consultation: Asian expansion 1931/1937, European war 1939, occupation and 1945 endings; selected context, not all campaigns. 29 October 2026 renewal: actual selected web text, opening contextual paragraph, German and Japanese Expansion (1931/1937), Invasion of Poland (1939), War in the Pacific (Singapore), Defeat of Germany and Defeat of Japan (1945). Campaigns elsewhere and casualty lists are not the proposed regional content.',
  },
  {
    id: 'holocaust',
    title: 'Introduction to the Holocaust',
    institution: 'United States Holocaust Memorial Museum',
    url: 'https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust',
    type: 'scholarship',
    accessed: '2026-10-29',
    scope:
      '26 October 2026 recorded consultation: 1933–1945 persecution and genocide; six million Jews murdered, other targeted groups, choices and varied experiences. 29 October 2026 renewal: actual opening definition and Key Facts only. The earlier scope remains a dated prior consultation; Jewish responses/rescue sections were not freshly reread in this pass.',
  },
  {
    id: 'war-teaching-guidelines',
    title: 'Guidelines for Teaching About the Holocaust',
    institution: 'United States Holocaust Memorial Museum',
    url: 'https://www.ushmm.org/teach/fundamentals/guidelines-for-teaching-the-holocaust',
    type: 'scholarship',
    accessed: '2026-10-29',
    scope:
      'Actual selected web text: precise terminology, distinct experiences, source authorship/audience, avoidance of pain comparisons and romanticizing rescue, historical context and ordinary lives, responsible methods and rejection of simulation/games. Planning guidance, not a historical witness account or evidence of tested family usability.',
  },
  {
    id: 'war-age-guidance',
    title: 'Age Appropriateness: Teaching the Holocaust to Grade Six and Above',
    institution: 'United States Holocaust Memorial Museum',
    url: 'https://www.ushmm.org/teach/fundamentals/age-appropriateness',
    type: 'scholarship',
    accessed: '2026-10-29',
    scope:
      'Actual selected main paragraph under Teaching the Holocaust to Grade Six and Above. This is guidance for Holocaust education, not a universal age certification for every other atrocity inquiry.',
  },
  {
    id: 'nanjing-yale-project',
    title: 'The Nanking Massacre Project: archival introduction',
    institution: 'Yale Divinity School Library',
    url: 'https://divinity-adhoc.library.yale.edu/nanking/about.html',
    type: 'archive',
    accessed: '2026-10-29',
    scope:
      'Actual public project introduction: December 1937 invasion and 1937–1938 collection, selection of Western missionary/businessmen accounts, incomplete lens and archive provenance. The redesigned landing identifies its content as not updated. No entire document collection or photo gallery consulted.',
    author:
      'Karl Muth; introduction based in part on Martha Lund Smalley, editor, American Missionary Eyewitnesses',
  },
  {
    id: 'nanjing-vautrin-biography',
    title: 'Minnie Vautrin: biographical and archival entry',
    institution: 'Yale Divinity School Library',
    url: 'https://divinity-adhoc.library.yale.edu/Nanking/Vautrin.html',
    type: 'archive',
    accessed: '2026-10-29',
    scope:
      'Actual selected biography and collection description: education work and Ginling College, papers in Record Groups 8/11 and Film Ms 62. The 1937–1940 diary is identified separately; biographical retrospective and historical diary dates are not interchangeable.',
  },
  {
    id: 'nanjing-vautrin-diary',
    title: 'Vautrin’s diary: selected December 1937 entries',
    institution: 'Yale Divinity School Library; Minnie Vautrin papers',
    url: 'https://divinity-adhoc.library.yale.edu/nanking/vautrin.pdf',
    type: 'primary',
    accessed: '2026-10-29',
    scope:
      'Actual selected local PDF pixels read: printed p 97/PDFp 107, dated 6 December 1937 preparation of buildings; printed p 111/PDFp 121, closing 14 December and beginning 15 December gate-admission entry. Entire rendered pages were visible; adopted claims remain the selected work/admission paragraphs. Pagination probes printedp 90/PDF 100, p 98/PDF 108, p 110/PDF 120 were also actually viewed to establish the 10-page offset; no new historical content was added from those probes. Earlier public indexed text from printedp 93 andp 118 was read but those pages were not visually checked. Public 555-page image-only PDF downloaded and byte-verified; bounded pdftotext pages 95–130 returned no readable body text. This is not a full diary reading, inspected handwritten original or verified typing/publication date. Typed pages include corrections and parenthetical later notes; PDF metadata creation 2005 does not date historical events or prove the transcript’s preparation date.',
    author: 'Minnie Vautrin',
  },
  {
    id: 'nanjing-tsen-excerpts',
    title: 'Tsen Shui-fang’s December 1937 diary: published translated excerpts',
    institution:
      'Facing History & Ourselves; excerpts from Southern Illinois University Press edition',
    url: 'https://test.facinghistory.org/resource-library/nanjing-safety-zone',
    type: 'primary',
    accessed: '2026-10-29',
    scope:
      'Actual public search-returned curated text read: dated 17 December and 21 December diary excerpts and footnote 2 identifying Hu Hualing and Zhang Lianhong, The Undaunted Women of Nanking (2010), pp 35–79. Library catalogue identifies them as editors/annotators/translators. These are mediated English excerpts, not an inspected Chinese diary or full 2010 volume. The canonical www.facinghistory.org resource URL returned 403; no login/paywall/captcha workaround attempted. The public test-domain indexed excerpt has not been treated as a stable independently preserved full edition.',
    published: '2018-11-30',
    author:
      'Tsen Shui-fang; Hua-ling Hu and Zhang Lian-hong, editors/translators; curated by Facing History & Ourselves',
  },
  {
    id: 'singapore-household-records',
    title: 'Personal Records of War and Occupation',
    institution: 'National Archives of Singapore',
    url: 'https://corporate.nas.gov.sg/discover-archives/media/personal-records/',
    type: 'archive',
    accessed: '2026-10-29',
    scope:
      'Actual selected web text: Of things to come; On Inflation; Of births and deaths; captions for Acc 25/1992 NA 1834 and Acc 20/2 NA 1135. It identifies passbook owner Lee Hiok Khuang and a separate Lee Siew Hong collection. The household text says Tay Yew Hoon while caption says Tay Yen Hoon collection; names must not be silently harmonized. The page header is 25 October 2015 but an appended call concerns 12 March 2022. The page is not all dated 2015. Direct reproduction download 403; no pixels inspected.',
    published: '2015-10-25',
  },
  {
    id: 'singapore-wartime-victuals',
    title: 'Wartime Victuals: Surviving the Japanese Occupation',
    institution: 'National Library Board Singapore, BiblioAsia',
    url: 'https://biblioasia.nlb.gov.sg/all-sections/vol-15-issue-1-apr-jun-2019-wartime-victuals/',
    type: 'scholarship',
    accessed: '2026-10-29',
    scope:
      'Actual selected article sections: prewar production/import dependence, Queuing Up for Food, selected Growing Your Own Food paragraphs and endnotes 11/14/17. Actual published primary excerpts include Lee Tian Soo recollection, interview by Low Lay Ling 14 May 1983, NAS 000265, Reel 3/7, p.31; the original flipviewer link returned only password/viewer shell, with no transcript/audio read or authentication attempted. Provisions card caption identifies Mak Kit collection and excludes rice, sugar, salt. The composed card/banknote image download 403; no source pixels inspected. Primary English excerpts are mediated by this 2019 essay, not complete interviews. Article body Tan Cheng Hwee vs note 11 Tan Chen Hwee is retained as a source discrepancy, not silently corrected.',
    published: '2019-04-04',
    author: 'Lee Geok Boi',
  },
  {
    id: 'warsaw-oneg-overview',
    title: 'The Oneg Shabbat Archive',
    institution: 'United States Holocaust Memorial Museum',
    url: 'https://encyclopedia.ushmm.org/content/en/article/the-oneg-shabbat-archive',
    type: 'scholarship',
    accessed: '2026-10-29',
    scope:
      'Actual selected web article sections Key Facts, The Archivists, Creating a Historical Record, Burying the Archive and Recovering the Archive. Photos/artifact captions encountered as metadata only, not visual inspection or licensed-image adoption. Article mentions January 1943 burial in Creating and February 1943 in Burying; the proposal uses year 1943 rather than silently reconciling the month.',
  },
  {
    id: 'warsaw-testaments-2019',
    title: 'Monday, August 3,4p.m.: We’ll be burying the last part in a moment',
    institution: 'Emanuel Ringelblum Jewish Historical Institute',
    url: 'https://www.jhi.pl/en/articles/monday-august-3-4-pm-well-be-burying-the-last-part-in-a-moment,6184',
    type: 'primary',
    accessed: '2026-10-29',
    scope:
      'Actual whole relevant English HTML body: biographical introductions and displayed excerpts of Nachum Grzywacz 30 July/3 August 1942; Dawid Graber 3 August 1942; Izrael Lichtensztajn 31 July 1942. Anna Majchrowska article, English translation Olga Drenda, page dated 1 August 2019. Selected paraphrases use named authors and dates. Graber’s text reports 20 July start; USHMM gives 22 July. The proposal says summer 1942 and preserves each primary dating as the author’s wording, without quietly rewriting it.2019 page cites volumes 23/5; current series page labels Life and Work of Gela Seksztajn asvol 4. Full volumes and manuscripts not read.',
    published: '2019-08-01',
    author:
      'Nachum Grzywacz, Dawid Graber, Izrael Lichtensztajn; article Anna Majchrowska; English translation Olga Drenda',
  },
  {
    id: 'ww2-nanjing-location',
    title: 'Nanjing: Getty Thesaurus of Geographic Names 7001892',
    institution: 'Getty Research Institute',
    url: 'https://www.getty.edu/vow/TGNFullDisplay?english=Y&find=&nation=&place=&subjectid=7001892',
    type: 'catalogue',
    accessed: '2026-10-29',
    scope:
      'Actual record ID/name and coordinate fields.32.0617 N/118.7778 E rounded to city-reference[118.78,32.06], with longitude first. No campus gate, SafetyZone boundary, historic site alignment or measured plan claimed.',
  },
  {
    id: 'ww2-singapore-location',
    title: 'Singapore: NGA GEOnet names record UFI-73635',
    institution: 'National Geospatial-Intelligence Agency',
    url: 'https://geonames.nga.mil/geon-ags/rest/services/RESEARCH/GIS_OUTPUT/MapServer/0/5647011/htmlPopup?f=html',
    type: 'catalogue',
    accessed: '2026-10-29',
    scope:
      'Actual name/UFI/feature and decimal coordinate fields 1.293056 N/103.855833 E. Rounded to city-reference[103.86,1.29], longitude first. Not the owner’s house, ration shop, administrative boundary or camp.',
  },
  {
    id: 'ww2-warsaw-location',
    title: 'Warsaw: GeoNames 756135',
    institution: 'GeoNames',
    url: 'https://www.geonames.org/756135/warsaw.html',
    type: 'catalogue',
    accessed: '2026-10-29',
    scope:
      'Actual ID/name and coordinate fields 52.22977 N/21.01178 E. Rounded to city-reference[21.01,52.23], longitude first. Does not locate 68Nowolipki, a burial box, historic ghetto perimeter or route.',
  },
  {
    id: 'nanjing-vautrin-letter-1938',
    title: 'Minnie Vautrin: 4 January 1938 letter, selected archival copy',
    institution: 'Yale Divinity School Library, Nanking Massacre Project',
    author: 'Minnie Vautrin',
    url: 'https://divinity-adhoc.library.yale.edu/Nanking/Images/NMP0317.pdf',
    type: 'primary',
    accessed: '2026-10-29',
    scope:
      'Actual selected public indexed text: datedheading and printedp 3 letter paragraphs describing campus rounds shared with Mary, meetings and lack of correspondence. Public PDF opens as 3pages with no readable web-extracted lines. Source-page pixel check deferred during performance hold. 4 January 1938 is the letter’s creation date, not a verified publication or scan date. Only the selected letter material is used; The indexed heading says COPY; no handwritten original was inspected. No full correspondence collection consulted.',
  },
];

export const worldWarTwoFrameworkContext: HistoricalContext = {
  id: 'war-occupation-persecution-context',
  title: 'Different war and persecution chronologies, 1931–1945',
  region: 'Europe',
  interval: {
    start: 1931,
    end: 1945,
    label: 'Selected Asian and European war/persecution frame, 1931–1945',
    note: 'A comparative orientation, not a new interval for world-war-two, one universal war start or a single policy imposed on all regions. The whole original 1933–1945 case remains intact.',
    precision: 'range',
  },
  summary:
    'Japanese conquest, European warfare and the Holocaust have connected histories with different beginnings. Read regional institutions, people and records within their own dates.',
  subjectIds: ['world-war-two'],
  citations: [
    {
      source: 'ww2',
      locator:
        'German and Japanese Expansion; Invasion of Poland; Defeat of Germany; Defeat of Japan',
    },
    {
      source: 'holocaust',
      locator: 'Opening definition and Key Facts',
    },
  ],
  phases: [
    {
      year: 1931,
      title: 'Japan invades Manchuria',
      text: 'USHMM locates this conquest in September 1931; it precedes the later European war.',
      citations: [
        {
          source: 'ww2',
          locator: 'German and Japanese Expansion',
        },
      ],
    },
    {
      year: 1933,
      title: 'The Holocaust’s persecution frame begins',
      text: 'USHMM uses 1933–1945 for the evolving persecution and murder of European Jews. The original dossier keeps this frame.',
      citations: [
        {
          source: 'holocaust',
          locator: 'Opening definition and Key Facts',
        },
      ],
    },
    {
      year: 1937,
      title: 'War expands in China',
      text: 'The museum dates Japan’s invasion of China proper to July 1937.',
      citations: [
        {
          source: 'ww2',
          locator: 'German and Japanese Expansion',
        },
      ],
    },
    {
      year: 1939,
      title: 'Germany invades Poland',
      text: 'The museum places the start of World War II in Europe at Germany’s 1 September 1939 invasion.',
      citations: [
        {
          source: 'ww2',
          locator: 'Invasion of Poland',
        },
      ],
    },
    {
      year: 1945,
      title: 'Different surrender dates',
      text: 'Germany’s defeat in May and Japan’s formal surrender in September are distinct events within 1945.',
      citations: [
        {
          source: 'ww2',
          locator: 'Defeat of Germany; Defeat of Japan',
        },
      ],
    },
  ],
};

export const proposedWorldWarTwoRegionalSubjects: Subject[] = [
  {
    id: 'nanjing-civilian-refuge',
    name: 'A college as civilian refuge in Nanjing',
    aliases: ['Ginling College refuge', 'Nanking civilian protection'],
    kind: 'process',
    region: 'East Asia',
    place: 'Nanjing; modern city reference, not a campus gate or Safety Zone boundary',
    coordinates: [118.78, 32.06],
    geographicPrecision:
      'Rounded from Getty TGN 7001892 coordinates 32.0617 N/118.7778 E. City reference only; no campus plan, measured boundary, household or route inferred.',
    interval: {
      start: 1937,
      end: 1938,
      label: 'Selected Ginling refuge records, December 1937–January 1938',
      note: 'Year-scale case frame from dated December 1937 diary entries and a 4 January 1938 letter. This is not a newly fixed interval for every Nanjing atrocity, all occupation or every refugee’s residence. Later translated publication dates remain separate.',
      precision: 'range',
    },
    packs: ['C 8'],
    question:
      'How did people make a college into a refuge, and what limited their protection?',
    summary:
      'During Japanese invasion and mass violence in Nanjing, Ginling’s existing campus and its workers became part of civilian refuge. Minnie Vautrin and Tsen Shui-fang recorded practical work and different judgments about protection. Their accounts remain particular, partial and differently mediated.',
    sections: [
      {
        title: 'A college already had people and spaces',
        text: 'Ginling was a place of education before it became a refuge during Japanese invasion and the Nanjing Massacre. Yale’s biographical entry describes Vautrin’s education work there. Begin with an existing institution and its workers, rather than imagining that refuge was created by one person arriving in an empty space.',
        citations: [
          {
            source: 'nanjing-vautrin-biography',
            locator: 'Selected education/Ginling biography',
          },
          {
            source: 'nanjing-yale-project',
            locator:
              'Project introduction, opening invasion/massacre and archival scope paragraphs',
          },
        ],
      },
      {
        title: 'Making room required work',
        text: 'In her 6 December 1937 diary entry, Vautrin described Mr Chen and Mr Li directing furniture into an attic and preparing buildings. She still needed to organize how space would be assigned. A week later, her 15 December entry described a long day at the gate admitting refugees. Rooms, bedding, food and time mattered alongside an announced place of safety.',
        citations: [
          {
            source: 'nanjing-vautrin-diary',
            locator: '6 December 1937, printedp 97;15 December 1937, printed p.111',
          },
        ],
      },
      {
        title: 'Different judgments inside the refuge',
        text: 'Tsen Shui-fang, a Chinese colleague at Ginling, also kept a diary. The consulted English excerpt for 21 December records her distrust of promised protection and concern about reports to Japanese officials. This is her dated judgment under occupation, not the American diarist’s voice and not a statement about every Japanese person. Preserving disagreement makes the work of protection more intelligible than a simple rescue story.',
        citations: [
          {
            source: 'nanjing-tsen-excerpts',
            locator:
              'Translated 21 December 1937 excerpt; footnote 2, citing 2010 editionpp 35–79',
          },
        ],
      },
      {
        title: 'Protection needed repeated care',
        text: 'In a 4 January 1938 letter, Vautrin described sharing demanding campus rounds with Mary after Mrs Tsen and she persuaded Mary to stay with them. Help depended on repeated tasks and other people’s time. The letter also described disrupted communication. These accounts document effort under danger; they do not prove that a campus boundary or a promise made anyone secure.',
        citations: [
          {
            source: 'nanjing-vautrin-letter-1938',
            locator:
              '4 January 1938 letter, printedp 3, shared rounds and communication paragraphs',
          },
        ],
      },
    ],
    deeperReading: [
      {
        title: 'Ask who observed what',
        text: 'The diary records Vautrin’s own gate work, but it also records information brought by other people. An estimate of the crowd is not a verified census. Tsen’s skepticism supplies a second, Chinese perspective, but one diary is not the whole civilian population. The purpose of comparing these accounts is to clarify different observations and judgments, not to make a learner decide how the writers should have faced danger.',
        citations: [
          {
            source: 'nanjing-vautrin-diary',
            locator: '15 December 1937, printed p.111',
          },
          {
            source: 'nanjing-tsen-excerpts',
            locator: '21 December 1937 translated excerpt',
          },
        ],
      },
      {
        title: 'Keep creation and later transmission separate',
        text: 'The English Tsen passage is a selected translated excerpt from a 2010 edition, curated on a page dated 2018. Her Chinese original and that whole volume were not read. Vautrin’s diary and letter have their own wartime dates; their digital copies do not make the web-upload date a historical event. Access limits narrow what this inquiry can claim.',
        citations: [
          {
            source: 'nanjing-tsen-excerpts',
            locator: 'Dated excerpt; footnote 2 and curation date',
          },
          {
            source: 'nanjing-vautrin-diary',
            locator: 'Selected dated entries',
          },
          {
            source: 'nanjing-vautrin-letter-1938',
            locator: 'Dated heading and copy',
          },
        ],
      },
    ],
    evidenceReading: {
      title: 'Preparation, judgment and continuing work',
      introduction:
        'Use attributed passages and their dates. No reenactment, imagined diary or comparison of suffering is needed.',
      items: [
        {
          label: 'Preparing space',
          text: 'Vautrin’s 6 December entry describes clearing furniture and preparing buildings.',
          interpretation:
            'It establishes particular work in progress, not a measured plan, final capacity or universal safety.',
          citations: [
            {
              source: 'nanjing-vautrin-diary',
              locator: '6 December 1937, printedp 97',
            },
          ],
        },
        {
          label: 'A Chinese diarist’s judgment',
          text: 'The translated 21 December Tsen excerpt questions promises of protection.',
          interpretation:
            'Identify speaker, circumstance and the later English version. Do not merge her judgment with Vautrin’s.',
          citations: [
            {
              source: 'nanjing-tsen-excerpts',
              locator: '21 December 1937 excerpt and footnote 2',
            },
          ],
        },
        {
          label: 'A later wartime letter',
          text: 'Vautrin’s 4 January 1938 letter describes sharing campus rounds with Mary.',
          interpretation:
            'The task continued across days and depended on several people. Effort is different from proof of successful protection for every refugee.',
          citations: [
            {
              source: 'nanjing-vautrin-letter-1938',
              locator: 'Printedp 3, shared-rounds paragraph',
            },
          ],
        },
      ],
    },
    claims: [],
    objectIds: [],
    terms: ['archive'],
    dimensions: {},
    dimensionKeys: [],
    status: 'sourced',
    returnPrompt:
      'Which passage describes work, which records a judgment, and what remains unknown about the people seeking refuge?',
    contextIds: ['nanjing-refuge-record-context'],
    review: {
      consultedOn: '2026-10-29',
      reviewer:
        'Codex author-team source preparation; not independent historian or educator approval',
      scope:
        'Selected dated records and their archival/translated versions. Original world-war-two framework remains distinct; no source image adopted.',
      limitations: [
        'Selected Yale PDF pixels for printed 97/111 are checked; the separate 4 January 1938 letter remains selected indexed text only, not an inspected full facsimile.',
        'Tsen’s Chinese original/full 2010 translated volume unread; canonical FacingHistory URL 403, selected public indexed excerpt only.',
        'No complete Nanjing account, campus boundary, refugee census or universal protection claim.',
        'No generic young-family pathway or age-gating implementation; older-reader entry requires educator review.',
      ],
    },
  },
  {
    id: 'singapore-household-food',
    name: 'Household records and food under occupation in Singapore',
    aliases: ['OccupiedSingapore', 'Syonan household records'],
    kind: 'process',
    region: 'Southeast Asia/Oceania',
    place: 'Singapore; modern city reference, not a named household or shop',
    coordinates: [103.86, 1.29],
    geographicPrecision:
      'Rounded from NGA UFI-73635 coordinates 1.293056 N/103.855833 E. City reference only; no house, ration shop, camp, historic border or route located.',
    interval: {
      start: 1942,
      end: 1945,
      label: 'Singapore occupation and selected food/household records,1942–1945',
      note: 'Year-scale frame for the Japanese occupation as used by NAS/NLB. A 1941 British registration rule is prior context;1943–1945 documents and 1983 oral-history recording retain their own dates. This case does not date every household’s experience.',
      precision: 'range',
    },
    packs: ['C 8'],
    question:
      'What can household records and remembered food work tell us about occupation?',
    summary:
      'Registration, rationing and obtaining food connected military government with household work. A passbook, an administrative list and Lee Tian Soo’s later recollection preserve different evidence; none describes every resident.',
    sections: [
      {
        title: 'Work before the occupation',
        text: 'Before occupation, Singapore’s food economy included small businesses making noodles, bread and tofu as well as rural gardening and livestock work. Imported ingredients and transport connected these activities to a wider port economy. War disrupted those supplies; household food work began from existing skills and businesses, rather than from an empty city.',
        citations: [
          {
            source: 'singapore-wartime-victuals',
            locator: 'Opening prewar-food paragraphs, lines 35–44',
          },
        ],
      },
      {
        title: 'An entitlement and a meal are different',
        text: 'NLB’s account explains that household registration supported ration cards. The provisions-card caption names cereal, soap, matches and meat while expressly excluding rice, sugar and salt. This is evidence of an allocation system, not proof of a full meal. The article distinguishes published controlled prices from what residents could actually obtain.',
        citations: [
          {
            source: 'singapore-wartime-victuals',
            locator: 'Queuing Up for Food, lines 56–63; Mak Kit cardcaption',
          },
        ],
      },
      {
        title: 'One person’s work and recollection',
        text: 'Lee Tian Soo later recalled keeping chickens as a student in Chinatown and finding feed when scraps were scarce. NLB publishes the excerpt from a 14 May 1983 interview. It records one person’s remembered activity; it is not a contemporaneous diary, a household survey or an instruction for children to copy.',
        citations: [
          {
            source: 'singapore-wartime-victuals',
            locator:
              'Growing Your Own Food, Lee Tian Soo; endnote 17, NAS 000265, Reel 3/7, p.31',
          },
        ],
      },
      {
        title: 'Read the household paperwork closely',
        text: 'NAS describes a passbook belonging to Lee Hiok Khuang, in the Lee Siew Hong collection, with deposits dated 1944 and 1945. Another record tracks changes to a named household. Such documents preserve transactions and administrative categories. They do not automatically explain purchasing power, actual food intake or the causes of an individual loss. A later archivist’s description must remain distinguishable from the record itself.',
        citations: [
          {
            source: 'singapore-household-records',
            locator: 'On Inflation, lines 33–37; Of births and deaths, lines 39–44',
          },
        ],
      },
    ],
    deeperReading: [
      {
        title: 'Different times and purposes',
        text: 'A 1941 British rule for identity cards preceded the Japanese occupation. NAS then presents occupation household forms and the later passbook. Treat these as separately situated records: registering a person, recording a deposit and recalling food work had different purposes. Neither the size of a later deposit nor a printed entitlement alone tells us how well a household ate.',
        citations: [
          {
            source: 'singapore-household-records',
            locator: 'Of things to come; On Inflation; Of births and deaths',
          },
        ],
      },
      {
        title: 'The version we can read',
        text: 'The 1983 recording survives within an archive; the passage consulted here is NLB’s 2019 published selection. Original audio and full transcript were not accessible in this pass, and the card/passbook images could not be inspected. The inquiry therefore uses attributed text capsules. It does not invent handwriting details, a transcription or a representative voice for all Singapore residents.',
        citations: [
          {
            source: 'singapore-wartime-victuals',
            locator: 'Lee Tian Soo excerpt; endnote 17',
          },
          {
            source: 'singapore-household-records',
            locator: 'Document descriptions and captions',
          },
        ],
      },
    ],
    evidenceReading: {
      title: 'Paper categories, transactions and recollection',
      introduction:
        'Read the supplied descriptions as different kinds of evidence. Source-purpose questions can be answered without pretending to experience occupation.',
      items: [
        {
          label: 'Provisions card',
          text: 'The published caption identifies a household purchasing card and specifies excluded goods.',
          interpretation:
            'It describes an administrative entitlement; it does not establish actual purchases. The image itself was not inspected.',
          citations: [
            {
              source: 'singapore-wartime-victuals',
              locator: 'Mak Kit cardcaption, lines 58–60',
            },
          ],
        },
        {
          label: 'Passbook',
          text: 'NAS identifies dated deposits in one owner’s passbook.',
          interpretation:
            'A transaction record is not a price index or a complete household budget.',
          citations: [
            {
              source: 'singapore-household-records',
              locator: 'On Inflation, lines 33–37',
            },
          ],
        },
        {
          label: 'Retrospective voice',
          text: 'Lee Tian Soo’s remembered work is published as an excerpt from an interview recorded in 1983.',
          interpretation:
            'Preserve speaker, recording date and later editorial selection; do not turn the excerpt into a wartime transcript.',
          citations: [
            {
              source: 'singapore-wartime-victuals',
              locator: 'Lee Tian Soo; endnote 17, NAS 000265, Reel 3/7, p.31',
            },
          ],
        },
      ],
    },
    claims: [],
    objectIds: [],
    terms: ['archive'],
    dimensions: {},
    dimensionKeys: [],
    status: 'sourced',
    returnPrompt:
      'Which record would you need to test whether a stated entitlement became food on a household’s table?',
    contextIds: ['singapore-household-record-context'],
    review: {
      consultedOn: '2026-10-29',
      reviewer:
        'Codex author-team source preparation; not independent historian or educator approval',
      scope:
        'Selected NAS administrative-record descriptions and NLB’s attributed primary oral-history excerpt; no new image.',
      limitations: [
        'Original household/card/passbook pixels and full interview unread; no visual transcription claimed.',
        'Record-owner/collection spellings remain as the source gives them.',
        'No present medical/nutrition advice, hunger exercise, occupation simulation or citywide statistical inference.',
        'Older-reader entry proposal is separate and not implemented.',
      ],
    },
  },
  {
    id: 'warsaw-oneg-shabbat',
    name: 'Making the Oneg Shabbat archive in occupied Warsaw',
    aliases: ['RingelblumArchive', 'OynegShabes'],
    kind: 'process',
    region: 'Europe',
    place: 'Warsaw; modern city reference, not the archive’s burial sites',
    coordinates: [21.01, 52.23],
    geographicPrecision:
      'Rounded from GeoNames 756135 coordinates 52.22977 N/21.01178 E. City reference only; not 68Nowolipki, 34Świętojerska, a burial box, ghetto perimeter or route.',
    interval: {
      start: 1939,
      end: 1943,
      label: 'Selected Warsaw archive-making frame,1939–1943',
      note: 'From Ringelblum’s 1939 chronicle through wartime collecting and concealment in 1943. Recovery in 1946/1950 and 2019 English publication are separate later events; this is not the whole Holocaust’s interval.',
      precision: 'range',
    },
    packs: ['C 8'],
    question: 'How did people organize records of their own lives under persecution?',
    summary:
      'Teachers, students and other contributors gathered evidence while Nazi occupation threatened their lives. Their archive preserves work, relationships and culture as well as persecution; surviving documents remain partial.',
    sections: [
      {
        title: 'Lives and work before the archive',
        text: 'Izrael Lichtensztajn taught and wrote children’s stories before the war. Dawid Graber and Nachum Grzywacz had studied at the Ber Borochov school. These histories matter: contributors were people with education, work and relationships before Nazi persecution, rather than anonymous figures created by the archive’s later fame.',
        citations: [
          {
            source: 'warsaw-testaments-2019',
            locator: 'Biographical introductions toGrzywacz, Graber andLichtensztajn',
          },
        ],
      },
      {
        title: 'Make records through existing networks',
        text: 'USHMM dates Emanuel Ringelblum’s personal chronicle to October 1939 and organized archive work after the ghetto was sealed in November 1940. Soup kitchens, house committees and underground schools supplied contacts and material. Recording required ordinary practical work: finding informants, checking projects, sorting papers and keeping them safe.',
        citations: [
          {
            source: 'warsaw-oneg-overview',
            locator: 'Key Facts; The Archivists',
          },
        ],
      },
      {
        title: 'A voice intended to reach beyond the present',
        text: 'In his 31 July 1942 testament, Lichtensztajn asked that his wife, the painter Gela Seksztajn, and their daughter be remembered. Graber’s 3 August text described gathering and burying evidence during deportation. These writings express particular people’s intentions. They do not show that the writers knew the future or that their work could prevent their murder.',
        citations: [
          {
            source: 'warsaw-testaments-2019',
            locator:
              'Lichtensztajn 31 July 1942; Graber 3 August 1942, translatedOlga Drenda',
          },
        ],
      },
      {
        title: 'Keep more than a record of destruction',
        text: 'The collection included everyday material such as tickets and cultural announcements alongside reports of persecution. Two caches were recovered after the war; another remained missing. Their survival permits questions about how people lived and documented events, while the losses limit what we can reconstruct. An archive is evidence of organized action, not a complete voice for every Jew in Warsaw.',
        citations: [
          {
            source: 'warsaw-oneg-overview',
            locator: 'Creating a Historical Record; Recovering the Archive',
          },
        ],
      },
    ],
    deeperReading: [
      {
        title: 'Read a testament as a dated act',
        text: 'The English passages here are selected translations published by JHI in 2019, not full manuscripts. A writer’s request to be remembered is evidence of that request and its audience. It does not entitle a modern reader to supply an imagined diary entry or decide what the writer should have done.',
        citations: [
          {
            source: 'warsaw-testaments-2019',
            locator: 'Dated testaments; EnglishtranslationOlga Drenda',
          },
        ],
      },
      {
        title: 'A record’s survival has its own history',
        text: 'The archive’s wartime concealment and its postwar recovery have different dates. USHMM describes recovery in 1946 and 1950. Later institutions organize and translate the papers again. Selection, damage, missing material and translation shape the accessible record; none cancels the value of the named testimony. Source criticism should clarify what survives without implying that these people spoke for everyone.',
        citations: [
          {
            source: 'warsaw-oneg-overview',
            locator: 'Burying the Archive; Recovering the Archive',
          },
          {
            source: 'warsaw-testaments-2019',
            locator: 'Translation/edition note',
          },
        ],
      },
    ],
    evidenceReading: {
      title: 'Authorship, intention and survival',
      introduction:
        'Use named records and their dates. Do not put yourself in the writer’s place or invent missing testimony.',
      items: [
        {
          label: 'A teacher’s request',
          text: 'Lichtensztajn’s 31 July 1942 testament asks for remembrance of his wife and daughter.',
          interpretation:
            'Read family relationships and an intended future audience; do not turn the request into a generic statement by all victims.',
          citations: [
            {
              source: 'warsaw-testaments-2019',
              locator: 'Lichtensztajn 31 July 1942',
            },
          ],
        },
        {
          label: 'Practical archive work',
          text: 'The museum describes collection through welfare, house and school networks.',
          interpretation:
            'An archive was organized work, not simply an accidental pile of papers.',
          citations: [
            {
              source: 'warsaw-oneg-overview',
              locator: 'The Archivists',
            },
          ],
        },
        {
          label: 'Later English edition',
          text: 'JHI names Olga Drenda as English translator of the displayed passages.',
          interpretation:
            '1942 creation and 2019 publication are separate. Full originals were not consulted.',
          citations: [
            {
              source: 'warsaw-testaments-2019',
              locator: 'Author/translation credits and displayed dated excerpts',
            },
          ],
        },
      ],
    },
    claims: [],
    objectIds: [],
    terms: ['archive', 'genocide'],
    dimensions: {},
    dimensionKeys: [],
    status: 'sourced',
    returnPrompt:
      'What does a named author’s request let us say, and what must remain unknown?',
    contextIds: ['warsaw-archive-occupation-context'],
    review: {
      consultedOn: '2026-10-29',
      reviewer:
        'Codex author-team source preparation; not independent historian or educator approval',
      scope:
        'Selected USHMM article and JHI English primary excerpts with named authors, dates and translator. No image reused.',
      limitations: [
        'Not full primary manuscripts, Polish volumes or comprehensive Warsaw history.',
        'JHI’s 2019 edition note and current catalogue volume numbering differ; no silent harmonization.',
        'Graber’s text reports a 20 July deportation start; museum overview gives 22 July. Narrative uses summer 1942.',
        'USHMM section prose differsJanuary/February 1943 for one burial; phases use year only.',
        'Older-reader activity remains an unimplemented audience/entry proposal; no educator or community acceptance.',
      ],
    },
  },
];

export const proposedWorldWarTwoRegionalContexts: HistoricalContext[] = [
  {
    id: 'nanjing-refuge-record-context',
    title: 'Nanjing’s Ginling refuge: selected dated records',
    region: 'East Asia',
    interval: {
      start: 1937,
      end: 1938,
      label: 'Selected refuge preparation and care records,1937–1938',
      note: 'December diary entries and aJanuary letter define this selected evidence frame, not the whole period of occupation or all civilian experiences. Publication/translation dates are outside the historical phases.',
      precision: 'range',
    },
    summary:
      'Buildings and staff supplied resources for refuge. The records document preparation, admission, contested promises and repeated care without turning those acts into complete protection.',
    subjectIds: ['nanjing-civilian-refuge'],
    citations: [
      {
        source: 'nanjing-yale-project',
        locator: 'Project introduction and limited archival lens',
      },
      {
        source: 'nanjing-vautrin-diary',
        locator: 'SelectedDecember 1937 entries',
      },
      {
        source: 'nanjing-tsen-excerpts',
        locator: '21 December 1937',
      },
      {
        source: 'nanjing-vautrin-letter-1938',
        locator: '4 January 1938',
      },
      {
        source: 'ww2-nanjing-location',
        locator:
          'Published name/ID and numeric coordinate fields; rounded modern city reference only',
      },
    ],
    phases: [
      {
        year: 1937,
        label: '6 December 1937',
        title: 'Preparing college space',
        text: 'Vautrin described clearing furniture and organizing buildings for refuge.',
        citations: [
          {
            source: 'nanjing-vautrin-diary',
            locator: '6 December 1937, printedp 97',
          },
        ],
      },
      {
        year: 1937,
        label: '15 December 1937',
        title: 'Admitting people at the gate',
        text: 'Her diary described a long day admitting refugees; the crowd estimate remains the diarist’s estimate.',
        citations: [
          {
            source: 'nanjing-vautrin-diary',
            locator: '15 December 1937, printed p.111',
          },
        ],
      },
      {
        year: 1937,
        label: '21 December 1937',
        title: 'A promise is questioned',
        text: 'Tsen’s translated excerpt records skepticism about promised protection.',
        citations: [
          {
            source: 'nanjing-tsen-excerpts',
            locator: '21 December 1937 excerpt',
          },
        ],
      },
      {
        year: 1938,
        label: '4 January 1938',
        title: 'Sharing continuing work',
        text: 'A letter described sharing campus rounds and interrupted communication.',
        citations: [
          {
            source: 'nanjing-vautrin-letter-1938',
            locator: 'Printedp 3 and datedheading',
          },
        ],
      },
    ],
  },
  {
    id: 'singapore-household-record-context',
    title: 'Singapore registration, occupation and selected household records',
    region: 'Southeast Asia/Oceania',
    interval: {
      start: 1941,
      end: 1945,
      label: 'Registration and occupation evidence,1941–1945',
      note: 'The prior 1941 British rule is distinguished from 1942–1945 Japanese occupation. Modern archive descriptions and the 1983 interview are outside this historical phase window.',
      precision: 'range',
    },
    summary:
      'Different governments used registration, while households worked within changing supply and monetary conditions. The selected documents have narrower dates than the occupation.',
    subjectIds: ['singapore-household-food'],
    citations: [
      {
        source: 'singapore-household-records',
        locator: 'Of things to come; On Inflation; Of births and deaths',
      },
      {
        source: 'singapore-wartime-victuals',
        locator: 'Opening and Queuing Up for Food',
      },
      {
        source: 'ww2-singapore-location',
        locator:
          'Published name/ID and numeric coordinate fields; rounded modern city reference only',
      },
    ],
    phases: [
      {
        year: 1941,
        title: 'British identity-card rule',
        text: 'NAS dates compulsory identity cards for non-military residents to 1941, before the occupation.',
        citations: [
          {
            source: 'singapore-household-records',
            locator: 'Of things to come, line 31',
          },
        ],
      },
      {
        year: 1942,
        title: 'Occupation and rationing',
        text: 'NLB’s 1942–1945 occupation frame situates household ration registration; an entitlement does not prove receipt.',
        citations: [
          {
            source: 'singapore-wartime-victuals',
            locator: 'Opening; Queuing Up for Food',
          },
        ],
      },
      {
        year: 1944,
        title: 'A dated passbook entry',
        text: 'NAS describes a 19 May 1944 deposit; it is a single account entry, not a citywide purchasing-power measure.',
        citations: [
          {
            source: 'singapore-household-records',
            locator: 'On Inflation',
          },
        ],
      },
      {
        year: 1945,
        title: 'A later entry within the occupation’s final year',
        text: 'NAS describes another deposit on 13 August 1945. The comparison does not supply a complete price series.',
        citations: [
          {
            source: 'singapore-household-records',
            locator: 'On Inflation',
          },
        ],
      },
    ],
  },
  {
    id: 'warsaw-archive-occupation-context',
    title: 'Warsaw’s occupation, archive organization and concealment',
    region: 'Europe',
    interval: {
      start: 1939,
      end: 1943,
      label: 'Selected Warsaw archive frame,1939–1943',
      note: 'Begins with a personal chronicle and ends with wartime concealment. It does not absorb the 1946/1950 recoveries or 2019 translations into wartime phases.',
      precision: 'range',
    },
    summary:
      'The archive grew through networks of welfare, cultural and educational work under Nazi occupation. The selected dated acts are not the full history of WarsawJewry.',
    subjectIds: ['warsaw-oneg-shabbat'],
    citations: [
      {
        source: 'warsaw-oneg-overview',
        locator: 'Key Facts; Creating a Historical Record; Burying the Archive',
      },
      {
        source: 'warsaw-testaments-2019',
        locator: '3 August 1942 burial and dated testaments',
      },
      {
        source: 'ww2-warsaw-location',
        locator:
          'Published name/ID and numeric coordinate fields; rounded modern city reference only',
      },
    ],
    phases: [
      {
        year: 1939,
        title: 'A personal chronicle begins',
        text: 'USHMM dates Ringelblum’s initial chronicle to October 1939.',
        citations: [
          {
            source: 'warsaw-oneg-overview',
            locator: 'Key Facts',
          },
        ],
      },
      {
        year: 1940,
        title: 'Organized work after the ghetto is sealed',
        text: 'The museum places the organized archive after November 1940 sealing; welfare and educational networks supplied material.',
        citations: [
          {
            source: 'warsaw-oneg-overview',
            locator: 'Key Facts; The Archivists',
          },
        ],
      },
      {
        year: 1942,
        title: 'Named writers prepare and conceal records',
        text: 'The 31 July and 3 August testaments accompany collection and concealment during the summer deportation.',
        citations: [
          {
            source: 'warsaw-testaments-2019',
            locator:
              'Lichtensztajn 31 July 1942; Graber 3 August 1942; article opening',
          },
        ],
      },
      {
        year: 1943,
        title: 'Further concealment',
        text: 'More material was buried in 1943. Museum sections differ over the month of one cache, so this phase retains year-level precision.',
        citations: [
          {
            source: 'warsaw-oneg-overview',
            locator: 'Creating a Historical Record; Burying the Archive',
          },
        ],
      },
    ],
  },
];

export const worldWarTwoOlderReaderActivities = [
  {
    subject: 'nanjing-civilian-refuge',
    audience:
      'Accompanied secondary-school/adult source inquiry, pending educator review; no generic four-year-old family sheet.',
    title: 'Work and judgment in two attributed records',
    duration: '12–15minutes',
    sourceCapsule:
      'Vautrin’s 6 December 1937 diary describes preparing buildings. The translated 21 December Tsen excerpt questions promised protection. The 4 January 1938 Vautrin letter describes shared campus rounds. These are different records and voices, not invented dialogue.',
    citations: [
      {
        source: 'nanjing-vautrin-diary',
        locator: '6 December 1937, printedp 97',
      },
      {
        source: 'nanjing-tsen-excerpts',
        locator: '21 December 1937 excerpt',
      },
      {
        source: 'nanjing-vautrin-letter-1938',
        locator: '4 January 1938, printedp 3',
      },
    ],
    steps: [
      'Identify which capsule reports practical work and which records a judgment about protection.',
      'For each, name the speaker, historical date and the version actually consulted.',
      'Write one limit: what would require another person’s account or another record?',
    ],
    expectedReasoning:
      'Preparing rooms and sharing work are documented actions; distrust is an attributed judgment. Neither creates a complete account of safety or every civilian’s experience.',
    exclusions: [
      'No refuge, escape, victim or soldier roleplay.',
      'No imagined diary or reconstructed private conversation.',
      'No graphic images, casualty arithmetic or scale of suffering.',
    ],
  },
  {
    subject: 'singapore-household-food',
    audience:
      'Older learners with an adult/educator; proposed secondary-school source task, not an age-tested family sheet.',
    title: 'Entitlement, transaction, recollection',
    duration: '12–15minutes',
    sourceCapsule:
      'The published provisions-card caption describes permitted purchases but excludes rice, sugar and salt. NAS describes dated deposits in one passbook. Lee Tian Soo recalled chicken-keeping in an interview recorded in 1983; that excerpt was published in 2019.',
    citations: [
      {
        source: 'singapore-wartime-victuals',
        locator: 'Cardcaption; Lee Tian Soo andendnote 17',
      },
      {
        source: 'singapore-household-records',
        locator: 'On Inflation',
      },
    ],
    steps: [
      'For each supplied description, name the kind of record and its purpose.',
      'Write one claim the record supports and one question requiring different evidence.',
      'Explain why a permission to purchase is insufficient to prove a meal.',
    ],
    expectedReasoning:
      'Administrative entitlement, recorded transaction and retrospective recollection answer different questions. Actual food obtained remains unknown from these capsules alone.',
    exclusions: [
      'No hunger/deprivation exercise or food substitution activity.',
      'No role assignment to occupied people or officials.',
      'No price/casualty arithmetic, medical advice or invented diary.',
    ],
  },
  {
    subject: 'warsaw-oneg-shabbat',
    audience:
      'Holocaust inquiry for grade 6and above as a starting guidance threshold; accompanied older-reader path requires educator assessment. Not the generic four-year-old family pathway.',
    title: 'What a named author wanted remembered',
    duration: '12–15minutes',
    sourceCapsule:
      'In a 31 July 1942 testament, teacher Izrael Lichtensztajn asked for his wife Gela Seksztajn and their daughter to be remembered. JHI publishes a selected English rendering translated byOlga Drenda in 2019.',
    citations: [
      {
        source: 'warsaw-testaments-2019',
        locator: 'Lichtensztajn 31 July 1942; translationcredits',
      },
    ],
    steps: [
      'Identify author, creation date, intended future audience and the later consulted version.',
      'Explain what the request shows about this person’s relationships and purpose.',
      'Name a question these few lines cannot answer; mark it unknown rather than inventing testimony.',
    ],
    expectedReasoning:
      'The request is a particular writer’s act. Its wartime date and later English publication date differ. It does not stand for every Jewish experience.',
    exclusions: [
      'No victim/perpetrator simulation or decision game.',
      'No imaginary last letter, testament or diary.',
      'No comparison of suffering or graphic image exercise.',
    ],
  },
];

export const worldWarTwoFrameworkUpdate = {
  additionalSections: [
    {
      title: 'Ginling’s workers prepared rooms and disagreed about safety',
      text: 'Ginling College in Nanjing was already a place of education when Japanese invasion made its campus part of civilian refuge. In her 6 December 1937 diary, Minnie Vautrin described Mr Chen and Mr Li directing furniture into an attic and preparing buildings. She still needed to decide how space would be assigned. Her 15 December entry describes a long day at the gate admitting refugees. Rooms, bedding, food and time mattered alongside an announced place of safety. Tsen Shui-fang, a Chinese colleague, kept her own diary. The consulted English excerpt for 21 December records her distrust of promised protection and her concern about reports to Japanese officials. That is her dated judgment, not Vautrin’s voice and not a statement about every Japanese person. In a 4 January 1938 letter, Vautrin described sharing campus rounds with Mary after Mrs Tsen and she persuaded Mary to stay. The letter also describes disrupted communication. These records document effort under danger. They do not prove that a campus boundary made anyone secure. An estimate of a crowd is not a census.',
      citations: [
        {
          source: 'nanjing-vautrin-biography',
          locator: 'Selected education and Ginling biography',
        },
        {
          source: 'nanjing-vautrin-diary',
          locator: '6 December 1937, printed p. 97; 15 December 1937, printed p. 111',
        },
        {
          source: 'nanjing-tsen-excerpts',
          locator: 'Translated 21 December 1937 excerpt; footnote 2',
        },
        {
          source: 'nanjing-vautrin-letter-1938',
          locator: '4 January 1938, printed p. 3',
        },
      ],
    },
    {
      title: 'A card, a passbook and a recollection answer different questions',
      text: 'In occupied Singapore, household registration supported ration cards. The published provisions-card caption names cereal, soap, matches and meat and expressly excludes rice, sugar and salt. That is an administrative entitlement, not proof of a meal. The National Archives of Singapore describes a passbook of Lee Hiok Khuang, in the Lee Siew Hong collection, with deposits dated 1944 and 1945. A deposit is a transaction, not a complete household budget. Lee Tian Soo later recalled keeping chickens as a student in Chinatown and looking for feed when scraps were scarce. The National Library Board publishes that excerpt from an interview recorded on 14 May 1983. The page used here was published in 2019. The recollection is one person’s memory. It is not a wartime diary, and the original interview was not read.',
      citations: [
        {
          source: 'singapore-wartime-victuals',
          locator: 'Provisions-card caption; Lee Tian Soo excerpt and endnote 17',
        },
        {
          source: 'singapore-household-records',
          locator: 'On Inflation; passbook deposits dated 1944 and 1945',
        },
      ],
    },
    {
      title: 'A named writer asked that his family be remembered',
      text: 'Izrael Lichtensztajn taught and wrote children’s stories before the war. In a testament dated 31 July 1942 he asked that his wife, the painter Gela Seksztajn, and their daughter be remembered. Dawid Graber’s 3 August 1942 text describes gathering and burying evidence during deportation. Emanuel Ringelblum’s personal chronicle is dated from October 1939, and organized archive work followed the sealing of the Warsaw ghetto in November 1940. The English passages used here are a selected 2019 rendering by Olga Drenda for the Jewish Historical Institute, not the manuscripts. A request shows this writer’s relationships and purpose. It does not stand for every Jewish experience, and it does not show that the writers knew the future.',
      citations: [
        {
          source: 'warsaw-testaments-2019',
          locator:
            'Lichtensztajn, 31 July 1942; Graber, 3 August 1942; translation by Olga Drenda',
        },
        {
          source: 'warsaw-oneg-overview',
          locator: 'Key Facts; The Archivists',
        },
      ],
    },
  ],
  deeperReading: [
    {
      title: 'Keep the speaker, the date and the version apart',
      text: 'Vautrin’s diary and letter have wartime dates. Their digital copies do not make an upload date a historical event. The English Tsen passage is a selected translation from a 2010 edition, on a page dated 2018. Her Chinese manuscript and that whole volume were not read. Lee Tian Soo’s words were recorded in 1983 and published as an excerpt in 2019. The original National Archives of Singapore interview remains unread, and the card and passbook images were not inspected. Lichtensztajn’s testament is dated 31 July 1942. The consulted English is Drenda’s 2019 translation. Graber’s text reports a 20 July start for the deportation he describes, while the United States Holocaust Memorial Museum gives 22 July. Both dates stay as the sources state them. None of these versions supplies an unread manuscript.',
      citations: [
        {
          source: 'nanjing-tsen-excerpts',
          locator: 'Dated excerpt; footnote 2 and curation date',
        },
        {
          source: 'nanjing-vautrin-diary',
          locator: '6 and 15 December 1937',
        },
        {
          source: 'singapore-wartime-victuals',
          locator: 'Lee Tian Soo excerpt and endnote 17',
        },
        {
          source: 'warsaw-testaments-2019',
          locator: 'Translation by Olga Drenda; dated primary excerpts',
        },
      ],
    },
    {
      title: 'What each record lets us ask',
      text: 'At Ginling, a diary and a letter show how people organized shelter and disagreed about safety. Reading the translated excerpts leaves some of Tsen’s wording and context beyond reach. In Singapore, a household card lists provisions, while a later interview recalls someone’s experience. To find out what a household actually received, we would need evidence of distribution. In Warsaw, people chose what to collect and bury so that others could learn about lives under persecution. Ask who created each record, who could use it and what the people who made it hoped would follow.',
      citations: [
        {
          source: 'nanjing-tsen-excerpts',
          locator: 'Footnote 2: 2010 edition, selected pages only',
        },
        {
          source: 'singapore-household-records',
          locator: 'Document descriptions; original interviews unread',
        },
        {
          source: 'warsaw-oneg-overview',
          locator: 'Creating a Historical Record',
        },
      ],
    },
  ],
  evidenceReading: {
    title: 'Work, entitlement and a request to be remembered',
    introduction:
      'These are editorial paraphrases of consulted records. Do not invent a diary, act out refuge or persecution, or compare suffering.',
    items: [
      {
        label: 'Preparing space at Ginling',
        text: 'Vautrin’s 6 December 1937 diary describes Mr Chen and Mr Li moving furniture and preparing buildings. Her 15 December entry describes a day at the gate admitting refugees.',
        interpretation:
          'The diary establishes particular work in progress. It does not measure the campus, count every refugee or prove that the place was safe.',
        citations: [
          {
            source: 'nanjing-vautrin-diary',
            locator: '6 December 1937, printed p. 97; 15 December 1937, printed p. 111',
          },
        ],
      },
      {
        label: 'Tsen Shui-fang’s judgment',
        text: 'The translated excerpt for 21 December 1937 records Tsen’s distrust of promised protection.',
        interpretation:
          'Name the speaker, the occupation circumstance and the later English version. Do not merge her judgment with Vautrin’s. The Chinese original was not read.',
        citations: [
          {
            source: 'nanjing-tsen-excerpts',
            locator: '21 December 1937 excerpt and footnote 2',
          },
        ],
      },
      {
        label: 'Shared rounds after the new year',
        text: 'Vautrin’s 4 January 1938 letter describes sharing campus rounds with Mary.',
        interpretation:
          'The work continued across days and depended on several people. Effort is not proof that protection succeeded.',
        citations: [
          {
            source: 'nanjing-vautrin-letter-1938',
            locator: '4 January 1938, printed p. 3',
          },
        ],
      },
      {
        label: 'A provisions card is not a meal',
        text: 'The published caption identifies a household purchasing card and lists goods it excludes, including rice, sugar and salt.',
        interpretation:
          'The caption describes an entitlement. It does not establish what was bought. The card image was not inspected.',
        citations: [
          {
            source: 'singapore-wartime-victuals',
            locator: 'Provisions-card caption',
          },
        ],
      },
      {
        label: 'One passbook and one memory',
        text: 'The archives describe 1944 and 1945 deposits in Lee Hiok Khuang’s passbook. Lee Tian Soo’s published excerpt recalls keeping chickens. The interview was recorded on 14 May 1983.',
        interpretation:
          'A transaction and a later recollection have different purposes. Neither is a wartime diary or a survey of Singapore households. The original interview was not read.',
        citations: [
          {
            source: 'singapore-household-records',
            locator: 'On Inflation',
          },
          {
            source: 'singapore-wartime-victuals',
            locator: 'Lee Tian Soo excerpt; endnote 17',
          },
        ],
      },
      {
        label: 'Lichtensztajn’s request',
        text: 'On 31 July 1942 Izrael Lichtensztajn asked that his wife, Gela Seksztajn, and their daughter be remembered.',
        interpretation:
          'The request is this writer’s act. The consulted English is Olga Drenda’s 2019 translation. It does not speak for every Jewish experience, and it is not permission to invent the testimony that was not read.',
        citations: [
          {
            source: 'warsaw-testaments-2019',
            locator: 'Lichtensztajn, 31 July 1942; translation by Olga Drenda',
          },
        ],
      },
    ],
  },
  familyActivity: {
    title: 'Read the source capsules with an adult',
    duration: 'About 15 minutes, for an older reader',
    steps: [
      'Do this with an adult. Do not act out refuge, occupation, hunger or persecution, and do not write an imagined diary or testament.',
      'From the Ginling capsules, name the speaker on 6 December 1937, 21 December 1937 and 4 January 1938. Write one thing that record can establish and one thing it cannot.',
      'Separate the Singapore provisions card, the 1944–1945 passbook deposits and Lee Tian Soo’s 1983 recollection. Explain why permission to purchase is not proof of a meal.',
      'Read Lichtensztajn’s 31 July 1942 request in the 2019 English rendering. State who he asks to be remembered, then mark one question the rendering cannot answer.',
    ],
    explanation:
      'Vautrin records preparation and shared campus rounds. Tsen’s translated excerpt questions promised protection. The Singapore card states an entitlement that excludes rice, sugar and salt. The passbook records deposits. Lee Tian Soo’s chicken-keeping is a memory recorded in 1983. Lichtensztajn asks that Gela Seksztajn and their daughter be remembered. These are particular records. They are not a young child’s activity, a role to play or a complete history of Nanjing, Singapore or Warsaw.',
  },
  review: {
    consultedOn: '2026-10-29',
    reviewer:
      'Prepared 29 October 2026 capsules reused on the existing dossier. This repair did not perform a fresh source audit and is not independent historian or educator approval.',
    scope:
      'Bounded explanations and source capsules for Ginling, Singapore household records and the Oneg Shabbat testament, placed on world-war-two. The original 1933–1945 interval, identity, claims, objectIds and comparison dimensions stay in place. No regional dossier was added.',
    limitations: [
      'Partial: nanjing-civilian-refuge, singapore-household-food and warsaw-oneg-shabbat remain unadopted case IDs. These capsules are not comprehensive city histories.',
      'Next task: read Tsen Shui-fang’s Chinese manuscript or the full 2010 translated volume, and the original National Archives of Singapore interviews, before any regional split is proposed again.',
      'The 4 January 1938 letter remains the prepared indexed text, not a newly inspected facsimile. Card and passbook images were not inspected. Graber’s 20 July wording and the museum’s 22 July date are both retained.',
      'No source image, route or boundary was added. The older-reader activity forbids role-play, invented testimony and graphic imagery. No age gate, educator acceptance or family testing is claimed.',
      'Reusing the prepared drafts is not a new consultation. Independent historical review, screen-reader acceptance, physical devices and physical print remain open.',
    ],
  },
};

export const worldWarTwoSourceWorkDimension: Subject['dimensions'][string] = {
  text: 'Making shelter, obtaining food and preserving records involved different institutions and tasks under occupation. Source purpose, who is speaking and the limits of what survived matter before comparing these selected inquiries.',
  citations: [
    {
      source: 'nanjing-vautrin-diary',
      locator: '6 and 15 December 1937, selected entries',
    },
    {
      source: 'singapore-household-records',
      locator: 'On Inflation; Of births and deaths',
    },
    {
      source: 'warsaw-testaments-2019',
      locator: 'Displayed dated testaments and biographical introductions',
    },
  ],
};

/** A local proposal transform for preservation/leaf QA, not product adoption or age gating. */
export function applyWorldWarTwoSplitProposal(c: Corpus): void {
  const framework = c.subjects.find((s) => s.id === 'world-war-two');
  if (!framework) throw new Error('Missing preserved world-war-two framework');
  for (const row of worldWarTwoSplitSources) {
    const at = c.sources.findIndex((s) => s.id === row.id);
    if (at < 0) c.sources.push(structuredClone(row));
    else c.sources[at] = structuredClone(row);
  }
  c.contexts ??= [];
  for (const row of [
    worldWarTwoFrameworkContext,
    ...proposedWorldWarTwoRegionalContexts,
  ]) {
    const at = c.contexts.findIndex((context) => context.id === row.id);
    if (at < 0) c.contexts.push(structuredClone(row));
    else c.contexts[at] = structuredClone(row);
  }
  const addedTitles = new Set(
    worldWarTwoFrameworkUpdate.additionalSections.map((s) => s.title),
  );
  framework.sections = [
    ...framework.sections.filter((s) => !addedTitles.has(s.title)),
    ...structuredClone(worldWarTwoFrameworkUpdate.additionalSections),
  ];
  framework.deeperReading = structuredClone(worldWarTwoFrameworkUpdate.deeperReading);
  framework.review = structuredClone(worldWarTwoFrameworkUpdate.review);
  framework.contextIds = [
    ...new Set([...(framework.contextIds ?? []), worldWarTwoFrameworkContext.id]),
  ];
  // No original identity, full interval, claims, objectIds, old dimensions or bytes replaced.
  for (const row of proposedWorldWarTwoRegionalSubjects) {
    const at = c.subjects.findIndex((subject) => subject.id === row.id);
    if (at < 0) c.subjects.push(structuredClone(row));
    else c.subjects[at] = structuredClone(row);
  }
  // Older-reader activities intentionally remain separate exports. Subject.familyActivity is unset.
  // No journey, comparison, relationship, asset, poster, registry or runtime routing is changed here.
}
