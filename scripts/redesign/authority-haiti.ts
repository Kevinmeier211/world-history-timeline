import type { Corpus, HistoricalContext, Journey, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const haitiAuthoritySources: Source[] = [
  {
    id: 'haiti-manigat-1793',
    title:
      'Qu’est-ce que la liberté générale en 1793 ? Les nouveaux libres en quête d’un projet',
    author: 'Sabine Manigat',
    institution:
      'Annales historiques de la Révolution française 293–294, pp. 363–372; Persée',
    url: 'https://www.persee.fr/doc/ahrf_0003-4436_1993_num_293_1_1580',
    type: 'scholarship',
    published: '1993',
    accessed: consulted,
    scope:
      'Metadata and selected exposed French text of printed pp. 363–365: regional differences, war/negotiation and shifting alliances around emancipation. DOI 10.3406/ahrf.1993.1580. The entire ten-page article, linked primary editions and underlying records were not read. Attempts to open pp. 366/368/370 failed; their contents are not silently adopted. English wording here is editorial paraphrase, not a critical translation. No figure or image copied; no open adaptation licence established.',
  },
  {
    id: 'haiti-abolition-1794',
    title: '1794 : la première abolition',
    institution: 'Assemblée nationale, France',
    url: 'https://www2.assemblee-nationale.fr/15/evenements/2021/abolition-de-l-esclavage-1794-et-1848/1794-la-premiere-abolition',
    type: 'scholarship',
    published: '2021 dossier; page-specific publication date unverified',
    accessed: consulted,
    scope:
      'Selected Le débat à la Convention paragraphs on the northern 29 August 1793 proclamation, later provincial measures, Belley/Mills/Dufay delegation and 4 February 1794 abolition. Population totals, simplified individual biographies and graphic punishment descriptions not adopted. Session tabs returned the overview, not a complete 1794 parliamentary transcript. Légifrance exposed decree metadata but no body text; Princeton scan retrieval cache-missed. No claim of original decree-pixel inspection or universal immediate implementation. No source photograph reused.',
  },
  {
    id: 'haiti-vincent-letter-1797',
    title: 'Letter to Charles Humbert Marie Vincent signed by Toussaint Louverture',
    author: 'Toussaint Louverture; unidentified scribe',
    institution:
      'Smithsonian National Museum of African American History and Culture; Transcription Center project 26313',
    url: 'https://collections.si.edu/search/detail/edanmdm:nmaahc_2009.26.2ab?print=yes',
    type: 'primary',
    published: '1797-10-21, catalogue date',
    accessed: consulted,
    scope:
      'Object 2009.26.2ab catalogue/description/date/rights and volunteer French transcription pages 1–4 read, especially pp. 2–4 on Vincent as intermediary, racist accusations and attachment to France. Catalogue distinguishes an unidentified writer from Louverture’s signature. Transcription has uncertain readings; no complete critical edition/translation or image-pixel collation made. Its short independence-threat caption is not repeated as this letter’s verified wording; the different later 1797 Directory letter was not substituted. Catalogue states public domain; no scan adopted as atlas media and no current remote-image-byte parity claimed.',
  },
  {
    id: 'haiti-constitution-1801',
    title: 'Constitution de 1801',
    institution:
      'Haiti-Référence; modern French transcription with listed historical editions',
    url: 'https://www.haiti-reference.info/pages/plan/histoire-et-societe/documents-historiques/constitutions/1801-texte/',
    type: 'primary',
    published: '1801 text; webpage created 2002-12-01, revised 2022-05-08',
    accessed: consulted,
    scope:
      'Selected French transcription: articles 1,3–5,14–16,28,35 and closing approval/source-list statements. Article 3 abolition and French status coexist with agricultural work/mobility rules; these are provisions, not an enforcement audit or proof of consent/revenue payment. Modern introductory chronology and its Vincent/expedition sequence not adopted. The listed 1801 printings, Janvier/Madiou books and 2008 Haitian edition were not independently consulted. University of Perpignan body retrieval timed out; indexed matching articles are limited corroboration, not a full second-edition collation. No facsimile or image reused.',
  },
  {
    id: 'haiti-acte-transcription',
    title: 'Acte de l’indépendance',
    institution:
      'Haiti-Référence; modern French transcription citing later Haitian historical compilations',
    url: 'https://www.haiti-reference.info/pages/plan/histoire-et-societe/documents-historiques/acte-independance/',
    type: 'primary',
    published: '1804-01-01 text; webpage created 2000-07-09, revised 2023-12-29',
    accessed: consulted,
    scope:
      'Selected title/dateline, oath paragraphs and signatory headings. This modern transcription presents the generals’ Acte, not the entire three-part pamphlet or a surviving signed autograph. Listed Berrou, Chancy, Linstant and Madiou editions were not independently read. The text’s unanimity concerns the assembled generals; it is not evidence of a population-wide vote or every participant’s opinion. English account is editorial paraphrase of French, not an adopted published translation. No illustration, facsimile or source image copied.',
  },
  {
    id: 'haiti-print-authority-study',
    title:
      'Introduction: “We must live independent or die”: The Haitian Declaration of Independence in Atlantic Context',
    author: 'David Armitage; Julia Gaffield',
    institution:
      'Harvard-hosted author manuscript; marked forthcoming in a volume edited by Julia Gaffield',
    url: 'https://armitage.scholars.harvard.edu/sites/g/files/omnuum8006/files/armitage/files/haitidoi_0.pdf',
    type: 'scholarship',
    published: 'Author manuscript marked forthcoming 2015; upload date unverified',
    accessed: consulted,
    scope:
      'Selected PDF text pp. 17–20: three-part pamphlet/broadside, printed authority versus lost manuscript stage, government printing at Port-au-Prince, transmission, and representation/authorization. Title/byline and manuscript status also read. This is a 27-page author manuscript, not the whole edited volume or every cited archival record. No scholar’s authorship interpretation is adopted as a recovered verbatim Kreyòl speech. Columbia catalogue now access-denied; TNA Discovery robot verification prevented fresh original-catalogue inspection. No original 1804 print pixels or reproduction clearance established; earlier TNA reuse questions remain open. No PDF figure/image adapted.',
  },
];

export const haitiAuthorityContext: HistoricalContext = {
  id: 'haiti-emancipation-authority-context',
  title: 'Saint-Domingue and Haiti: emancipation, work and political authority',
  region: 'Americas',
  interval: {
    start: 1791,
    end: 1804,
    label: 'Selected revolutionary decisions and records,1791–1804',
    precision: 'approximate',
    note: 'A phased source inquiry, retaining the complete original case interval unchanged. The boundaries connect an uprising to independence, not the lifespan of Haitian people or a completed transition to equal land, work or political rights. Later recognition/debt and 1825 comparisons are not incorporated without separate verified sources.',
  },
  summary:
    'Resistance, provincial emancipation, military allegiances, constitutional work rules and independence were distinct changes. Their surviving records expose authority and practical stakes without recovering every cultivator’s experience or one uniform revolutionary intention.',
  subjectIds: ['haitian-revolution'],
  citations: [
    cite('haiti-manigat-1793', 'Printed pp. 363–365'),
    cite('haiti-constitution-1801', 'Articles 1,3,14–16'),
    cite('haiti-acte-transcription', 'Dateline and generals’ oath'),
  ],
  phases: [
    {
      year: 1791,
      label: '1791: uprising in the northern plantation region',
      title: 'Resistance did not begin everywhere in the same way',
      text: 'Manigat distinguishes the northern uprising from different struggles and alliances in the West and South. Enslaved people acted within changing military and political circumstances; a later independence outcome does not prove one identical starting program.',
      citations: [cite('haiti-manigat-1793', 'Printed pp. 363–365')],
    },
    {
      year: 1793,
      label: '1793: provincial emancipation measures',
      title: 'Local struggle preceded the metropolitan decree',
      text: 'The parliamentary account places Sonthonax’s northern proclamation on 29 August, followed by Polverel’s measures in other provinces. English Heritage’s brief overview instead says September for the northern measure. The discrepancy is retained in source notes; the provincial decisions are not collapsed into the separate 1794 decree.',
      citations: [
        cite('haiti-abolition-1794', 'Le débat: provincial measures'),
        cite('haiti', 'Selected renewed scope; compressed northern chronology'),
      ],
    },
    {
      year: 1794,
      label: '1794: the French Convention decrees colonial abolition',
      title: 'A rule still required political and military support',
      text: 'The institutional account describes deputies from Saint-Domingue reaching the Convention and the 4 February abolition decision. A decree changes the formal legal claim; it does not itself document implementation in every place or remove the military threats that followed.',
      citations: [
        cite('haiti-abolition-1794', 'Le débat: delegation and Convention decision'),
      ],
    },
    {
      year: 1797,
      label: '1797: Louverture’s letter to Vincent',
      title: 'A formerly enslaved leader defended a particular allegiance',
      text: 'The catalogued 21 October letter seeks Vincent’s advocacy with the Directory, challenges racist allegations and affirms attachment to France. It is a particular leader’s argument, not proof that every formerly enslaved person agreed or that independence was already a fixed 1791 objective.',
      citations: [
        cite('haiti-vincent-letter-1797', 'Catalogue date; transcript pp. 2–4'),
      ],
    },
    {
      year: 1801,
      label: '1801: abolition and controlled cultivation in one constitution',
      title: 'Status, labor and government power were different questions',
      text: 'Articles 1 and 3 retain a French connection while prohibiting slavery. Articles 14–16 insist on cultivation and authorize police regulation of cultivators’ movement. Article 28 grants Louverture life tenure. These provisions do not certify voluntary work, actual revenue shares or equal political participation.',
      citations: [cite('haiti-constitution-1801', 'Articles 1,3,14–16,28')],
    },
    {
      year: 1804,
      label: '1804: independence proclaimed at Gonaïves',
      title: 'An official act also organized authority',
      text: 'The Acte’s dateline is 1 January. Its assembled generals renounce France. The separately studied printed packet also authorizes Dessalines’s life governorship. An official declaration and a new allocation of state power do not amount to a direct record of every household’s freedom or consent.',
      citations: [
        cite('haiti-acte-transcription', 'Dateline and oath'),
        cite('haiti-print-authority-study', 'PDF pp. 17–20: contents and authority'),
      ],
    },
  ],
};

export const haitiWorkDimension = {
  text: 'Plantation production, military struggle and state-building made control of work a central conflict. Abolition could coexist with rules restricting cultivators’ movement; official promises and actual household conditions require different evidence.',
  citations: [
    cite('haiti-manigat-1793', 'Printed pp. 363–365'),
    cite('haiti-constitution-1801', 'Articles 3,14–16,35'),
  ],
};

export const haitiFamilyEvidence: NonNullable<Journey['familyEvidence']> = {
  title: 'Status, work and who speaks',
  object: null,
  text: 'The 1801 constitution prohibits slavery and describes people as free and French. Other articles insist on agricultural work, describe cultivators as sharing revenues and give the governor police authority over movement. The Acte dated 1 January 1804 records assembled generals renouncing France. These are paraphrases of French texts in modern transcriptions. A rule is not evidence that every worker received a share or agreed; the generals’ recorded agreement is not a population-wide vote.',
  citations: [
    cite('haiti-constitution-1801', 'Articles 1,3,14–16'),
    cite('haiti-acte-transcription', 'Dateline and generals’ oath'),
  ],
  notice: [
    'Find a statement about legal status, one about work and one about political separation.',
    'Who is described as agreeing in the 1804 record? What does the capsule leave unknown about cultivators?',
  ],
  claimPrompt:
    'Explain why declaring people free does not by itself establish freedom to choose where to work. Name the further evidence needed to learn about one cultivator’s experience.',
  returnPrompt:
    'Return to a promise in another case and ask what evidence would show how it worked in practice.',
  feedback:
    'The texts supply formal claims and powers. A cultivator’s account, contextual complaint, pay record or other case evidence would be needed to investigate experience; none is invented for this activity.',
};

export function applyAuthorityHaiti(c: Corpus): void {
  const s = c.subjects.find((row) => row.id === 'haitian-revolution');
  if (!s) throw new Error('Haiti continuation requires the existing dossier');
  for (const source of haitiAuthoritySources) {
    const index = c.sources.findIndex((row) => row.id === source.id);
    if (index < 0) c.sources.push(source);
    else c.sources[index] = source;
  }
  const original = c.sources.find((row) => row.id === 'haiti');
  if (!original) throw new Error('Missing retained English Heritage source');
  const marker = `Haiti selected consultation, ${consulted}: `;
  if (!original.scope.includes(marker)) {
    original.scope = `Prior consultation, ${original.accessed} (retained): ${original.scope} ${marker}Selected plantation/competing-interest and 1791/1794/1802/1804 paragraphs reread. Overview places the northern emancipation in September 1793, while the separately consulted parliamentary account gives 29 August; no exact month is silently taken from this compressed synthesis. Population/casualty totals, graphic descriptions, exclusive firstness claims and illustrations not adopted. The 1802 overview is not proof of a specific secret order or identical legal implementation throughout the French empire.`;
    original.accessed = consulted;
  }
  c.contexts ??= [];
  const contextIndex = c.contexts.findIndex(
    (row) => row.id === haitiAuthorityContext.id,
  );
  if (contextIndex < 0) c.contexts.push(haitiAuthorityContext);
  else c.contexts[contextIndex] = haitiAuthorityContext;
  s.contextIds = [...new Set([...(s.contextIds ?? []), haitiAuthorityContext.id])];
  s.summary =
    'Enslaved people’s resistance broke the plantation order, but emancipation, control of work and independence were distinct struggles. Regional research, a leader’s letter and constitutional rules show people making different political choices. The 1804 declaration severed French rule while also establishing authority; it does not speak directly for every household.';
  s.sections = [
    sec(
      'Resistance grew through different local struggles',
      'Sugar and coffee production depended on coerced work. In 1791, enslaved people challenged that order in the northern plantation region. Sabine Manigat’s research distinguishes this uprising from different conflicts in the West and South. Insurgent groups, free people of color, colonists and competing armies formed shifting alliances rather than one stable camp. War and negotiation created openings for people seeking liberty. Regional differences help explain how a struggle could change direction without assuming everyone began with the same plan for an independent nation.',
      cite('haiti', 'Transatlantic World; Beginning of Revolution'),
      cite('haiti-manigat-1793', 'Printed pp. 363–365'),
    ),
    sec(
      'Emancipation had to be defended and interpreted',
      'Provincial emancipation measures in 1793 preceded the French Convention’s 1794 colonial abolition decree. Deputies carried events in Saint-Domingue into metropolitan politics. Louverture, a formerly enslaved leader, offers one particular political voice. His 1797 letter asks Vincent to defend him before the Directory, rejects racist accusations and affirms attachment to France. The argument makes sense within that moment’s commitments. It does not turn him into the spokesman for every cultivator, nor make independence the inevitable meaning of all earlier resistance.',
      cite(
        'haiti-abolition-1794',
        'Le débat: provincial measures, delegation and decree',
      ),
      cite('haiti-vincent-letter-1797', 'Catalogue; transcript pp. 2–4'),
    ),
    sec(
      'Ending slavery did not settle control of work',
      'The 1801 constitution prohibits slavery and calls people free and French. It also insists that cultivation continue. Articles 15–16 picture an estate as a family led by its owner or representative, promise cultivators a share of revenues and treat changes of residence as a threat to production. The governor receives police powers to regulate them. This language connects agricultural output with political control: freedom from enslavement and freedom to leave a workplace were not treated as identical questions. The rules are evidence of a governing project, not proof that workers consented or received what was promised.',
      cite('haiti-constitution-1801', 'Articles 1,3,14–16,35'),
    ),
    sec(
      'Independence created another political settlement',
      'The French expedition of 1802 renewed the threat to emancipation and met resistance. Independence was proclaimed in 1804. The Acte records assembled generals renouncing France; its claim of agreement concerns that gathering. Armitage and Gaffield distinguish the official printed pamphlet and broadside from a lost manuscript stage. They also identify an accompanying oath making Dessalines governor general for life. Political separation and the defense of liberty therefore came with a new concentration of authority. Other records are needed for landholding, work and participation beyond the leaders’ declarations.',
      cite('haiti', 'Selected 1802–1804 sequence'),
      cite('haiti-acte-transcription', 'Dateline and oath'),
      cite(
        'haiti-declaration',
        'Printed p. 7, closing dateline of Dessalines’s address',
      ),
      cite('haiti-print-authority-study', 'PDF pp. 17–20'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A signature, a scribe and a printed name do different work',
      'The Smithsonian distinguishes the unidentified writer of the 1797 letter from Louverture’s signature. Its volunteer transcription contains uncertain readings, so the account paraphrases clear passages rather than claiming a complete critical translation. The museum’s brief independence-threat caption is not adopted as this letter’s verified wording. The 1804 document is a different object history: scholarship describes government printing, transmission and authorization. A name reproduced in print is not an autograph, and a printed proclamation is not a verbatim transcript of every speech at Gonaïves.',
      cite('haiti-vincent-letter-1797', 'Written by/Signed by; transcript pp. 2–4'),
      cite(
        'haiti-print-authority-study',
        'PDF pp. 18–20: manuscript stage and authorization',
      ),
    ),
    sec(
      'A constitution supplies a project, not a complete outcome',
      'Reading abolition beside cultivation rules exposes a concrete tension. The 1801 text promises a revenue share while restricting movement and assigning the governor enforcement powers. It does not supply each worker’s income, complaint, negotiation or response. Calling the estate a family is a governing metaphor, not evidence of kinship or voluntary agreement. Manigat’s regional account likewise warns against making one group’s situation stand for the whole colony. A fuller investigation needs cultivators’ and women’s accounts, local enforcement records and household evidence. Independence in 1804 did not make those questions disappear; this packet does not extend them into unverified 1825 financial claims.',
      cite('haiti-constitution-1801', 'Articles 14–16,35'),
      cite('haiti-manigat-1793', 'Printed pp. 363–365'),
    ),
  ];
  s.deeperReading.push(
    sec(
      'Read political changes forward through time',
      'Read the 1797 letter beside article 1 of the 1801 constitution and the 1804 oath. These records first join freedom with French allegiance, then mark a political separation. They do not establish one unchanging intention for every participant. Explaining that change requires the circumstances of each record, rather than assigning the final outcome backward to 1791.',
      cite('haiti-vincent-letter-1797', 'Transcript pp.2–4'),
      cite('haiti-constitution-1801', 'Articles1,3'),
      cite('haiti-acte-transcription', 'Generals’ oath'),
    ),
  );
  s.evidenceReading = {
    title: 'Political voices, work rules and a circulated act',
    introduction:
      'These are editorial paraphrases of French transcriptions and selected scholarship. They are not new critical translations, unmediated access to every enslaved voice or a collation of the original 1804 pamphlet.',
    items: [
      {
        label: 'A leader’s letter is an argument to a recipient',
        text: 'The 1797 Vincent letter seeks advocacy with the French Directory, contests racist allegations and affirms attachment to France.',
        interpretation:
          'It supplies a particular political position at that date. It is not the later Directory letter, a universal statement of formerly enslaved people’s views or evidence that independence was every insurgent’s fixed objective in 1791.',
        citations: [cite('haiti-vincent-letter-1797', 'Catalogue; transcript pp. 2–4')],
      },
      {
        label: 'An abolition clause coexists with work regulation',
        text: 'Article 3 of the 1801 constitution prohibits slavery; articles 14–16 protect continuing cultivation and empower regulation of cultivators’ movement.',
        interpretation:
          'The combination reveals a governing project and a tension within freedom. It does not establish consent, actual payments or identical enforcement on every estate.',
        citations: [cite('haiti-constitution-1801', 'Articles 3,14–16,35')],
      },
      {
        label: 'The act’s recorded agreement has a defined group',
        text: 'The modern French transcription identifies assembled generals as swearing the 1804 independence oath. Scholarship separately describes the official printed packet.',
        interpretation:
          'Recorded unanimity in that assembly does not establish a population-wide vote. The printed version, manuscript copies, modern transcription and lost manuscript stage must not be treated as one physical object.',
        citations: [
          cite('haiti-acte-transcription', 'Dateline; assembled generals and oath'),
          cite('haiti-print-authority-study', 'PDF pp. 17–20'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Separate a right, a work rule and a political decision',
    duration: 'About 10 minutes',
    steps: [
      'Read the supplied capsule together. Make three cards: legal status, control of work and political separation.',
      'Match the 1801 abolition clause, the cultivation/movement rules and the 1804 generals’ oath to the cards. Explain why two cards can describe the same constitution.',
      'Name the group whose agreement the 1804 text records. What source would you seek before claiming that every cultivator agreed or received a promised share?',
      'Write one supported statement and one remaining question. Do not invent a worker’s biography, wage or reply.',
    ],
    explanation: `Source capsule — editorial paraphrase: ${haitiFamilyEvidence.text} The task is answerable from this supplied text; no absent image or historical role-play is required. A household question needs a relevant account or record beyond the formal provisions.`,
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian or Haitian/community acceptance',
    scope:
      'Regional action, shifting emancipation, a named formerly enslaved leader’s mediated letter, constitutional work rules and the authority of an independence act. Six new selected records and one retained-and-renewed source scope. The 4 November review checked Dessalines’s dateline in the digitized official pamphlet, printed p. 7. No new map, media, image, route or historical relation.',
    limitations: [
      'At the October review the Columbia and TNA catalogue pages could not be reopened. On 4 November the closing dateline and printed name on p. 7 were checked directly against the digitized official pamphlet. This inspection covers one printed page. Image reproduction permission remains unresolved.',
      'The 1801 and 1804 French sources are modern transcriptions with listed editions, not original printings independently collated here. English prose is editorial paraphrase, not a critical or adopted published translation. The letter uses volunteer transcription with uncertain readings; no complete original-image collation.',
      'Only Manigat’s printed pp. 363–365 and the specified author-manuscript passages were consulted. Linked bibliography, full edited volume and later 1825 recognition/debt sources were not read or silently adopted.',
      'The northern 1793 proclamation date differs between the compressed English Heritage overview and the parliamentary account. The exact 29 August date is attributed to the latter; provincial measures and the 1794 decree remain separate.',
      'Formerly enslaved actors had different aims and situations. A leader’s letter, an assembly’s oath and official work rules do not recover every cultivator’s voice, women’s experience, actual income, household outcome or universal consent.',
      'No existing dossier image is present and no new asset is supplied. Earlier TNA reproduction-clearance questions remain unresolved; a public-domain statement on the separate Smithsonian letter does not clear TNA images.',
      'Independent historical/Haitian/community review, family usability, screen-reader/physical-device behavior and physical print remain open. Bot source consultation and leaf checks are not those acceptance tasks.',
    ],
  };
}
