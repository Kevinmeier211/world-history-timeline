import type { Corpus, HistoricalContext, Journey } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';
import { putWW1Sources, ww1ConsultedOn, ww1SplitSources } from './war-one-sources';

export const ww1DecisionWorkContext: HistoricalContext = {
  id: 'ww1-decisions-work-context',
  title: 'War decisions, correspondence, work and selected aftermath',
  region: 'Europe',
  interval: {
    start: 1914,
    end: 1919,
    label: 'Selected decision, work and aftermath records,1914–1919',
    precision: 'range',
    note: 'The original whole 1914–1918 case is preserved.1919 belongs to selected retrospective administration and cemetery-care records, not a universal extension/end of fighting. The regional cases have their own intervals; source publication/transcription dates do not become wartime events.',
  },
  summary:
    'A European crisis involved contested government decisions, followed by mobilization through states and empires. Selected regional records make communication, civilian work, coercive recruitment and household consequences visible without making them one experience.',
  subjectIds: ['world-war-one'],
  citations: [
    cite('ww1-grey-debate-1914', 'Selected Grey/MacDonald statements'),
    cite('ww1-birtley-care-letter', '31 January 1919'),
    cite('ww1-watkins-transcript', 'Report’s 1914–1919 scope'),
  ],
  phases: [
    {
      year: 1914,
      label: '1914: decisions debated in public',
      title: 'One government’s arguments are contested',
      text: 'In the 3 AugustCommons discussion, Grey sets out the government’s position and MacDonald challenges the case for intervention. These are situated public arguments, not all diplomacy or a referendum of every population drawn into war.',
      citations: [cite('ww1-grey-debate-1914', 'cc 1809–1814/1829–1831')],
    },
    {
      year: 1916,
      label: '1916: selected letters and factory records',
      title: 'Mobilization reaches different kinds of work',
      text: 'Named Indian correspondence and Birtley planning/factory records reveal different practical settings. Their shared war years do not establish a common journey, meeting or causal chain between the people described.',
      citations: [
        cite('ww1-indian-censor-edition', 'PDF pp. 70/72'),
        cite('ww1-birtley-transfer-records', 'Selected 1916 records'),
      ],
    },
    {
      year: 1917,
      label: '1917: recruitment and a separate public appeal',
      title: 'Power and persuasion have different forms',
      text: 'The selected South Nyeri research examines coercive recruitment. The existing USposter is a separate 1917 appeal to women. Neither source stands for the people or choices in the other setting.',
      citations: [
        cite('ww1-nyeri-labour-research', 'South Nyeri 1917'),
        cite('war-poster', 'Retained 1917 poster consultation'),
      ],
    },
    {
      year: 1918,
      label: '1918: original major-war endpoint',
      title: 'One timeline boundary does not settle every aftermath',
      text: 'The conventional major-war interval remains 1914–1918. Regional fighting, movement and political consequences did not all begin or stop together; later care and administrative records have their own dates.',
      citations: [
        cite('ww1', 'Retained global-war scope'),
        cite('ww1-birtley-care-letter', 'Opening/departure context'),
      ],
    },
    {
      year: 1919,
      label: '1919: selected work of recording and care',
      title: 'Aftermath appears in particular documents',
      text: 'Debauche’s care letter and Watkins’ retrospective report answer different questions after the selected wartime years. They cannot establish every household’s outcome or completion of all requested work.',
      citations: [
        cite('ww1-birtley-care-letter', '31 January 1919'),
        cite('ww1-watkins-transcript', 'Title/selected sections'),
      ],
    },
  ],
};

export const ww1FrameFamilyEvidence: NonNullable<Journey['familyEvidence']> = {
  title: 'A public appeal asks for a response',
  object: 'loc-war-poster',
  text: 'This 1917 USposter calls on women to serve and uses a sword marked Service. It is a public persuasive appeal. Its words and images show the response sought by the publisher; they do not record what every woman did or what choices people had in other countries.',
  citations: [cite('war-poster', 'Retained original image/title/date consultation')],
  notice: [
    'Find the audience named in the appeal.',
    'Identify a word or image used to encourage a response.',
  ],
  claimPrompt:
    'Explain one thing the appeal establishes and one question about actual participation that needs another source.',
  returnPrompt:
    'Compare the purpose and audience of the next public message with its evidence of actual outcomes.',
  feedback:
    'A persuasive appeal supports a claim about its intended response. A diary, work record or other evidence is needed to examine what particular people actually did.',
};

export function applyWW1Frame(c: Corpus): void {
  const s = c.subjects.find((v) => v.id === 'world-war-one');
  if (!s) throw new Error('WWI continuation requires the original frame');
  putWW1Sources(
    c,
    ww1SplitSources.map((v) => v.id),
  );
  c.contexts ??= [];
  const i = c.contexts.findIndex((v) => v.id === ww1DecisionWorkContext.id);
  if (i < 0) c.contexts.push(ww1DecisionWorkContext);
  else c.contexts[i] = ww1DecisionWorkContext;
  s.contextIds = [...new Set([...(s.contextIds ?? []), ww1DecisionWorkContext.id])];
  s.summary =
    'A crisis became a war through governments’ decisions, military action and imperial power. Sustaining it required communication, factories, transport, food and care. Selected regional records reveal unequal participation and different household consequences. They explain how a global war reached ordinary life while preserving disagreement and gaps in whose voices survive.';
  s.sections = [
    sec(
      'Decisions were argued, not automatic',
      'The retained museum account explains diplomatic and military choices after the Sarajevo assassination. The newly selected Commons record offers a closer view of one government’s public argument. On 3 August 1914, Grey says earlier Anglo-French conversations had left decisions open, then argues for Britain’s response to the crisis. MacDonald disputes the case for intervention. Their disagreement makes choice visible, but neither speech is a neutral record of every negotiation or all public opinion. A minister’s justification should be read as an argument made at a particular moment.',
      cite('ww1-decisions', 'Retained July-crisis consultation'),
      cite('ww1-grey-debate-1914', 'cc 1810–1814/1829–1831'),
    ),
    sec(
      'Empires connected campaigns to labour and households',
      'Indian troops served in East Africa and Mesopotamia. Armies depended on people who moved food and supplies as well as those who fought. Colonial administration could convert an army’s demand for labour into district recruitment quotas. Watkins’ later report describes that process in East Africa and reports compulsory powers. The people drawn into such work did not all control the decisions that created it. Transport also required food and organization: workers moving supplies had needs of their own. This explains one mechanism of imperial mobilization, rather than assigning an identical experience to an entire continent.',
      cite(
        'ww1-indian-service-geography',
        'Exhibition description, list of major campaigns',
      ),
      cite('ww1-watkins-transcript', 'Paras 88–93/110–114'),
    ),
    sec(
      'A factory or letter reveals another practical setting',
      'The records on this page are bounded selections, not separate dossiers. On 10 April 1916 a Birtley conference grouped men as soldiers withdrawn from the Belgian army, men described as réformés, and civilians, and it proposed travel, food, identity papers and lists of names. The 11 April interview changed who would organize the first group’s journey and superseded that Class 1 transport plan. These are planning records, not proof that a named person completed the journey. On 31 January 1919 Hubert Debauche wrote to Albert Edward Prowse about cemetery care and asked for an enclosure. A requested wall is not a completed wall. In a translated extract dated 19 February 1916, Natha Singh, a clerk at Rouen, writes to Hari Ram Singh in Simla about leave in London, public buildings, and expensive food and lodging. A colonial censor selected the passage. A modern project transcribed the English report extract. It is not the complete original letter. The same edition also includes Tirka Ram’s 28 February complaint, an 18 March censor response, and Gugan Singh’s April letters. In East Africa, O. F. Watkins’ 1919 report says military authorities requested labour and civil authorities selected recruitment areas and quotas, and it reports compulsory powers from 1915. It also describes disputes about maize flour, purchasing and ration changes. The report covers 4 August 1914 to 15 September 1919. Its 2021 transcription is a later copy. Watkins had run the organization he described. A September 1917 South Nyeri episode, known through a missionary account published in 1918, and 1918 famine pressure in the Kikuyu reserve are connected pressures, not one cause. Ngũgĩ wa Thiong’o’s memoir, published in 2010 and read here on a 2011 webpage, recounts alternative family stories about his father avoiding the draft. He was born after the war. That memory is not a carrier’s diary.',
      cite(
        'ww1-birtley-transfer-records',
        'Selected planning and 10–11 April 1916 records',
      ),
      cite('ww1-birtley-care-letter', '31 January 1919'),
      cite('ww1-indian-library-story', 'Mediation and named 1916 examples'),
      cite('ww1-nyeri-labour-research', 'Selected South Nyeri episode'),
    ),
    sec(
      'A public appeal does not measure its own success',
      'The existing 1917 American poster calls women to service. It shows the intended audience and desired response, not what every woman did or the rights she could exercise. Its public confidence differs from the questions an administrative report, private concern or later family memory can preserve. Read these sources together by asking who made each record, for whom, and what survives. The original 1914–1918 boundary remains a useful major-war frame while particular departures, records and consequences continue beyond it.',
      cite('war-poster', 'Retained 1917 poster consultation'),
      cite('ww1-birtley-care-letter', 'Selected 1919 care record'),
    ),
  ];
  s.deeperReading = [
    sec(
      'A record can participate in the power it describes',
      'Grey’s speech seeks support; a recruiting poster seeks participation; a censor’s report gathers selected information; an official retrospective account defends an organization’s record. These purposes shape what each source makes visible. They do not make every detail useless, nor do they turn an official category into a person’s complete experience. Compare a specific statement with its genre and audience. Where a source quotes another voice, keep the speaker and the person selecting or translating it separate. This permits useful claims without pretending that one record exhausts the event.',
      cite('ww1-grey-debate-1914', 'Selected public arguments'),
      cite('war-poster', 'Appeal'),
      cite('ww1-indian-library-story', 'Report purpose'),
      cite('ww1-watkins-transcript', 'PDF p. 2 method'),
    ),
    sec(
      'Each record has a purpose and a limit',
      'Natha Singh’s 19 February 1916 extract is a censored, translated report of one clerk’s leave in London, not every Indian soldier’s experience. The British Library originals were not collated. The Birtley conference and interview organize movement and categories of men. Debauche’s 31 January 1919 letter asks for cemetery care. The family archive that preserves those papers privileges a management viewpoint, and a request does not prove the enclosure was built. Watkins’ report explains quotas, compulsory powers and food disputes from inside the organization he ran. It is not African consensus, and its racialized explanations are not adopted. Ngũgĩ’s later family memory can challenge that official voice without becoming an eyewitness account. These selections do not meet, share a route or stand for every front. The proposed regional case IDs were not created. Wider regional histories and independent review remain open.',
      cite('ww1-indian-censor-edition', 'PDF pp. 70 and 72; selected copy limits'),
      cite('ww1-birtley-transfer-records', '10–11 April 1916; provenance, page 15'),
      cite('ww1-birtley-care-letter', '31 January 1919'),
      cite('ww1-watkins-transcript', 'Paras 88–93 and 110–114; PDF p. 2'),
      cite('ww1-nyeri-labour-research', 'South Nyeri 1917; 1918 famine paragraphs'),
      cite('ww1-ngugi-family-memory', '2010 memoir; 2011 webpage'),
    ),
  ];
  s.evidenceReading = {
    title: 'A decision, an appeal and a selected record',
    introduction:
      'The existing poster remains an American 1917 object. It is not substituted for an Indian letter, Belgian workplace image or East African record.',
    items: [
      {
        label: 'A public decision has an opposing argument',
        text: 'Grey’s 3 August 1914 statement and MacDonald’s response put different positions before the Commons.',
        interpretation:
          'The disagreement is evidence against treating participation as an automatic or unanimous outcome. The speakers do not stand for every government, colonized population or voter.',
        citations: [cite('ww1-grey-debate-1914', 'cc 1810–1814/1829–1831')],
      },
      {
        label: 'A poster asks rather than records',
        text: 'The 1917 USposter addresses women and calls for service.',
        interpretation:
          'Identify persuasion and intended audience. Actual work, consent, refusal, rights or outcomes require other records; do not project the poster into another region.',
        citations: [cite('war-poster', 'Retained original image/title/date')],
      },
      {
        label: 'A censored letter is not the whole correspondence',
        text: 'In the translated extract dated 19 February 1916, Natha Singh, a clerk at Rouen, writes to Hari Ram Singh in Simla about visiting London on leave, seeing public buildings, and finding food and lodging expensive.',
        interpretation:
          'A colonial censor selected the passage, and a modern project transcribed the English report extract. This is not the complete original letter, and it is not every soldier’s leave. Tirka Ram’s 28 February complaint, the 18 March censor response and Gugan Singh’s April letters are further selected rows, not one viewpoint.',
        citations: [cite('ww1-indian-censor-edition', 'PDF p. 70, f.7v; PDF p. 72')],
      },
      {
        label: 'A plan and a request leave completion open',
        text: 'The 10 April 1916 Birtley conference proposes travel, food, identity papers and name lists for soldiers withdrawn from the army, men described as réformés, and civilians. The 11 April interview supersedes the Class 1 transport plan. On 31 January 1919 Debauche asks Prowse for an enclosure around the cemetery.',
        interpretation:
          'Planning records do not prove a named person finished the journey. A requested wall is not a completed wall. The surviving family papers privilege management.',
        citations: [
          cite('ww1-birtley-transfer-records', '10 April and 11 April 1916'),
          cite('ww1-birtley-care-letter', '31 January 1919'),
        ],
      },
      {
        label: 'An official report is not a carrier’s diary',
        text: 'Watkins’ 1919 report says the army requested labour, civil authorities chose recruitment areas and quotas, and compulsory powers dated from 1915. It also describes disputes about maize flour, purchasing and rations. Its own span is 4 August 1914 to 15 September 1919.',
        interpretation:
          'The 2021 transcription is a later copy. Watkins had run the organization, so the report defends an official system. South Nyeri in 1917 and 1918 famine pressure in the Kikuyu reserve are connected pressures, not one cause. Ngũgĩ, born after the war, preserves alternative family stories about his father avoiding the draft. That 2010 memoir, read on a 2011 webpage, is not a wartime diary.',
        citations: [
          cite('ww1-watkins-transcript', 'Paras 88–93 and 110–114'),
          cite('ww1-nyeri-labour-research', 'South Nyeri 1917; 1918 famine paragraphs'),
          cite('ww1-ngugi-family-memory', '2010 memoir; 2011 webpage'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'Read an appeal with an adult',
    duration: 'About 10 minutes',
    steps: [
      'Look at the existing poster. Younger children can identify whom it addresses; older children can discuss its intended response.',
      'Read the supplied capsule and distinguish an appeal from evidence of what happened.',
      'Use one evidence note on this page. Compare that record’s purpose with the poster without acting out war, recruitment or displacement.',
      'Write one supported claim and one question requiring another source.',
    ],
    explanation: `Source capsule — editorial paraphrase: ${ww1FrameFamilyEvidence.text}`,
  };
  s.review = {
    consultedOn: ww1ConsultedOn,
    reviewer:
      'Codex selected source authoring and internal QA; not independent historian or educator/family acceptance',
    scope:
      'The existing 1914–1918 case now carries bounded capsules from the prepared correspondence, Birtley and East Africa drafts. Those drafts were reused here and were not freshly audited. The original ID, name, interval, note, claims, dimensions, object order and media bytes stay exact.',
    limitations: [
      'Both current IWM direct pages returned 403 during the prepared consultation; their previously recorded indexed or archive consultation is retained unchanged, not renewed as full text. No complete July-crisis diplomatic archive or single-cause explanation is claimed.',
      'Partial: the regional case IDs ww1-indian-mail, ww1-birtley-belgians and ww1-east-african-carriers were not created. The capsules on this page are selections. Next task: independent review of the Hansard columns, the unread British Library originals, the uncollated Birtley family papers, and the unread Watkins typescript and appendices before any regional dossier is proposed again.',
      'No new visual is attached. The old poster remains a separate 1917 US appeal. The optional Birtley photograph was not adopted.',
      'No contact, route or relationship is inferred among these records. The family activity uses one capsule on this page. It does not add graphic imagery, recruitment role-play or a comparison of suffering. No age gate or family acceptance is claimed.',
      'This repair reuses the 29 October 2026 prepared drafts. It is not a fresh source audit. Independent historian and community review, screen-reader acceptance, physical devices and physical print remain open.',
    ],
  };
}
