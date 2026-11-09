import type {
  Citation,
  Corpus,
  HistoricalContext,
  Source,
  Subject,
} from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const sources: Source[] = [
  {
    id: 'tiriti-tepapa-texts',
    title: 'The full text of Te Tiriti o Waitangi | The Treaty of Waitangi',
    institution:
      'Museum of New Zealand Te Papa Tongarewa; Treaty2U partnership with Archives New Zealand and the National Library',
    url: 'https://www.tepapa.govt.nz/digital-museum/explore-digital-museum/treaty-waitangi/treaty-close/full-text-te-tiriti-o',
    type: 'primary',
    published: '2008',
    accessed: consulted,
    scope:
      'Complete exposed Māori transcription, original English transcription and separate modern Kawharu English translation read, including preambles, articles 1–3 and closing formulas. Te Papa attributes the transcriptions to handwritten originals, Archives reference IA9/9; no independent palaeographic verification of all original sheets/signatures. It distinguishes the English Waikato-Manukau signing text from the Māori text signed at Waitangi. Web content originated in Treaty2U in 2008 and was reviewed in 2020; these are not document dates. Te Papa attributes its Kawharu translation to the 1988 Royal Commission on Social Policy report; the underlying volume was not read. Other institutions give differing modern translation/bibliography dates, recorded separately rather than silently reconciled. No full document or image reproduced; selected terms and attributed paraphrases only. No new translation made.',
  },
  {
    id: 'tiriti-archive-sheets',
    title: 'Te Tiriti o Waitangi original documents: selected sheets and signatures',
    institution: 'Archives New Zealand, Te Rua Mahara o te Kāwanatanga',
    url: 'https://www.archives.govt.nz/discover-our-stories/the-treaty-of-waitangi/the-sheets-and-signatures-of-te-tiriti-o-waitangi',
    type: 'archive',
    accessed: consulted,
    scope:
      'Selected English introduction and sheet 1 Waitangi, sheet 3 Waikato-Manukau, sheet 4 Printed and sheet 7 Herald-Bunbury descriptions read, plus the sheet 2 final-signing paragraph. The Māori counterpart text was exposed but was not independently translated or line-collated. Sheet 3 initial signing date is unknown; late March/early April receipt, 11 April witnessing and 26 April Manukau signing are distinct. Āwhitu is a likely location, not a verified precise spot. Selected southward signings and Nohorua’s request for a witness were read in this institutional account, not the original voyage journal. The Waimate date and initial Waitangi signature counts differ from other institutional pages; no exact disputed count/date adopted. All nine sheet images and signature biographies were not read. No source map, image, route or border copied. Page publication date unstated; item-specific Flickr rights and dated-image metadata are separately recorded, not assumed covered by a generic website licence.',
  },
  {
    id: 'tiriti-tribunal-text-editions',
    title: 'Māori and English texts: statutory transcriptions and Kawharu commentary',
    author:
      'I. H. Kawharu (modern translation and commentary); Waitangi Tribunal (published text editions)',
    institution: 'Waitangi Tribunal',
    url: 'https://waitangitribunal.govt.nz/en/about/the-treaty/maori-and-english-versions',
    type: 'primary',
    accessed: consulted,
    scope:
      'Complete exposed English and Māori text editions, separate modern English translation and all eleven commentary notes read. The site identifies the first two as taken from the first schedule to the Treaty of Waitangi Act 1975, not newly transcribed directly from all 1840 sheets. Kawharu’s commentary is an attributed scholarly interpretation, including the article 3 tikanga problem; it is not a statement from every signatory. The page’s reference combines a 1989 date with Waitangi Revisited and its later editor set; no original book was read to establish or correct that bibliography. Archives separately labels a translation 1975 and Te Papa cites a 1988 report. A living webpage publication date and the translation’s first composition date remain unestablished. No current legislation/jurisprudence comparison, full text reproduction, independent translation or image reuse claimed.',
  },
  {
    id: 'tiriti-signing-records',
    title:
      'Treaty signatories and signing locations: selected record guidance and northern signings',
    institution: 'Manatū Taonga, Ministry for Culture and Heritage, NZHistory',
    url: 'https://nzhistory.govt.nz/politics/treaty/making-the-treaty/treaty-of-waitangi-signing-locations',
    type: 'archive',
    accessed: consulted,
    scope:
      'Introduction to the nine sheets/1877 facsimile numbering and selected linked Waitangi 6 February, Mangungu 12 February and Te Wherowhero biography text read. Related URLs: /politics/treaty/location/waitangi/6-february-1840; /politics/treaty/location/mangungu/12-february-1840; /politics/declaration/signatory/te-wherowhero. Lists preserve uncertain names and later researched affiliations; facsimile numbers are not necessarily signing order. Nene/Heke support at Waitangi, disagreement at Mangungu and Te Wherowhero’s refusal/continued engagement are attributed institutional accounts. Original journals, speeches, full biographies’ cited scholarship and the 1877 volume were not freshly read. No complete database, signatory total or survey coordinate verification claimed. Text licence displayed CC BY-NC 3.0 New Zealand; no image reuse proposed. Publication day unstated on consulted pages.',
  },
  {
    id: 'tiriti-proclamation',
    title:
      'The Treaty of Waitangi trail: 21 May proclamation transcript and circulation',
    institution: 'Museum of New Zealand Te Papa Tongarewa; Treaty2U partnership',
    url: 'https://www.tepapa.govt.nz/digital-museum/explore-digital-museum/treaty-waitangi/treaty-close/treaty-waitangi-trail',
    type: 'primary',
    published: '2008',
    accessed: consulted,
    scope:
      'Complete exposed proclamation transcript and selected signing/refusal/circulation narrative read. Transcript is the published 21 May 1840 proclamation asserting sovereignty over all the islands; it is not a record of every rangatira consenting. The source’s latitude wording is not adopted as geographic-coordinate evidence. Primary proclamation image is credited to Alexander Turnbull Library, 1/2-081956-F; linked catalogue reader exposed no usable record body, and pixels were not inspected/reused. The gifts bill was exposed as a mediated transcript, not independently checked against the original; no quantitative inference adopted. Treaty2U content originally 2008, reviewed 2020. No current constitutional/legal-status opinion or complete voyage history claimed.',
  },
  {
    id: 'tiriti-te-raki-2014',
    title: 'Report on Stage 1 of the Te Paparahi o Te Raki Inquiry Released',
    institution: 'Waitangi Tribunal',
    url: 'https://waitangitribunal.govt.nz/en/news/report-on-stage-1-of-the-te-paparahi-o-te-raki-inquiry-released',
    type: 'primary',
    published: '2014-11-14',
    accessed: consulted,
    scope:
      'Complete official release and question-and-answer text read, not the full two-part report or evidentiary record. The finding concerns meaning/effect for February 1840 signings at Waitangi, Waimate and Mangungu in the Bay of Islands/Hokianga, not every district or later signing. The release concludes those rangatira did not cede sovereignty and agreed to distinct spheres of authority; it expressly does not determine how/when the Crown acquired present sovereignty or the Treaty’s present meaning. Waimate dated 10 February and Waitangi count 43–46 differ from Archives’ 9 February/42–45. Those discrepancies are recorded; no census-like total or invented reconciliation. Modern finding date is separate from 1840 events. No court/tribunal record update beyond this historical release claimed.',
  },
  {
    id: 'tiriti-te-raki-2022',
    title: 'Tribunal releases report on Te Paparahi o Te Raki inquiry',
    institution: 'Waitangi Tribunal',
    url: 'https://waitangitribunal.govt.nz/en/news/tribunal-releases-report-on-te-paparahi-o-te-raki-inquiry',
    type: 'primary',
    published: '2022-12-23',
    accessed: consulted,
    scope:
      'Complete exposed official release read. It describes the pre-publication part 1 stage 2 report on Te Raki interactions 1840–1900. Adopted reading is limited to attributed findings about May proclamations, unclear explanation of sole Crown authority, Northern War 1844–46 and imposed land/governance processes. The full report, hearing evidence, later final edition, individual claims, recommendations and present implementation were not read/renewed. No unqualified national extrapolation, exact land-loss statistic, current deprivation measure or completed-redress claim adopted. Stage 1 and stage 2 answer different questions; modern publication date is not a historical phase date.',
  },
  {
    id: 'tiriti-kawanatanga-scholarship',
    title: 'Kāwanatanga – Māori engagement with the state: selected pages 1–3',
    author: 'Paul Meredith; Rawinia Higgins',
    institution: 'Te Ara, the Encyclopedia of New Zealand; Manatū Taonga',
    url: 'https://teara.govt.nz/en/kawanatanga-maori-engagement-with-the-state/page-1',
    type: 'scholarship',
    published: '2015-10-20',
    accessed: consulted,
    scope:
      'Actual pages 1 Defining kāwanatanga, 2 Implementing kāwanatanga and 3 Containing Māori opposition text and displayed footnotes read; story footer gives published 20 October 2015, updated 1 August 2016. An associated photo caption carries a different story-publication metadata date; no image borrowed. Selected explanation of terms, early limits of colonial administration, 1844 Native Exemption Ordinance, armed enforcement and later institutions provides attributed Māori scholarship. The full page 4, original ordinances/newspapers, 1976 facsimile volume, 1989 Kawharu book and cited tribunal report were not read. The source’s shorthand English wording is not substituted for the separately consulted complete English treaty transcription. No universal Māori interpretation or current legal guidance claimed. Text marked CC BY-NC 4.0; all non-text subject to separate conditions, no figures/maps reused.',
  },
  {
    id: 'tiriti-onuku-runanga',
    title: 'Ōnuku Rūnanga: home and Treaty place',
    institution: 'Ōnuku Marae / Ōnuku Rūnanga',
    url: 'https://www.onuku.nz/home-new/',
    type: 'primary',
    accessed: consulted,
    scope:
      'Selected welcome, Ōnuku Rūnanga self-description and historical-place paragraph read. The community identifies the 30 May 1840 signing within the Ngāi Tahu takiwā and the 1998 Crown apology there. The page is undated; no footer year used as publication date. Current marae self-description is not an 1840 building plan, surveyed signing spot or statement for all iwi. The underlying settlement statute, original signing journal, linked gallery, tours and full local history were not read. No photograph, contact detail or source geometry copied. Permission for image reuse not established.',
  },
  {
    id: 'tiriti-ngaitahu-tipa-2025',
    title:
      'Justin Tipa: Hui Whakaū I Te Tiriti ki Ōnuku Waitangi Day 2025 commemoration speech',
    author: 'Justin Tipa',
    institution: 'Te Rūnanga o Ngāi Tahu',
    url: 'https://ngaitahu.iwi.nz/connect-2/connect/news-and-stories/ngai-tahu-kaiwhakahaere-justin-tipa-hui-whakau-i-te-tiriti-ki-onuku-waitangi-day-2025-commemoration-speech/',
    type: 'primary',
    published: '2025-02-06',
    accessed: consulted,
    scope:
      'Header/date and selected transcript passages on Ōnuku/Iwikau/Tīkao, Ngāi Tahu experience, rangatiratanga, constitutional monarchy and collective versus individual rights read. The posted text is a named 2025 political/commemorative perspective, not a contemporary 1840 transcript or universal Māori position. Tipa’s role is described as at that speech; current 2026 office not checked. Video was not played, full audio was not independently transcribed and Ngāi Tahu’s broader positions were not audited. References to contemporary bills, court proceedings and outcomes were not updated or adopted as current facts. No image reused; no broad endorsement/assent inferred.',
  },
];

const renewals: Record<string, string> = {
  'treaty-signing':
    'Selected English sections on drafting, 5–6 February discussion/signing, circulating copies, early September endpoint, refusals/uneven opportunity and 21 May sovereignty proclamations read on 29 October. Original Māori paragraph bodies were exposed but not independently translated. No full journals, all signature biographies, complete nine-sheet palaeography or source images inspected. British assertions are identified as claims of authority, not proof of universal assent. Prior 26 October scope remains separately retained.',
  'treaty-texts':
    'Selected English explanation plus complete exposed original English transcription and separately headed Kawharu modern English back-translation read on 29 October. The current page does not expose a complete original signed Māori transcription; that was read separately at Te Papa. Its modern back-translation heading says 1975, whereas Te Papa attributes its version to 1988 and the Tribunal page gives a 1989/bibliography combination. No first-creation date for Kawharu’s translation or silent correction inferred. Articles 1 and 2 remain compared in context; this renewal does not claim an independent Māori translation or current legal adjudication. Complete prior 26 October scope retained.',
};

export const tiritiAuthorityContext: HistoricalContext = {
  id: 'tiriti-agreement-assertion-enforcement',
  title: 'Te Tiriti: negotiation, asserted authority and early enforcement',
  region: 'Southeast Asia/Oceania',
  interval: {
    start: 1840,
    end: 1846,
    precision: 'range',
    label: 'Selected negotiations and early colonial conflicts, 1840–1846',
    note: 'A bounded frame from the first signings through the Northern War, not the Treaty’s lifespan, the whole colonization of Aotearoa or a common outcome for all iwi and hapū. The original exact 1840 case interval remains unchanged. Earlier He Whakaputanga, later land institutions, twentieth-century inquiries and a 2025 speech have separate dates. The close of this frame does not end Māori authority or continuing disputes.',
  },
  subjectIds: ['tiriti'],
  summary:
    'Making copies, interpreting words and gathering marks did not settle how authority would work. Crown proclamations and subsequent enforcement need evidence distinct from the signing record.',
  citations: [
    cite('tiriti-archive-sheets', 'Selected sheet descriptions'),
    cite('tiriti-proclamation', '21 May proclamation transcript'),
    cite('tiriti-te-raki-2022', 'Northern War findings in official release'),
  ],
  phases: [
    {
      year: 1840,
      label: '5–6 February 1840: discussion and the first signing',
      title: 'An agreement is heard, debated and marked',
      text: 'Rangatira heard the Māori text and verbal explanations at Waitangi before the first signatures on 6 February. Supporting and opposing speeches concerned authority, land and relations with newcomers. A later complete text does not preserve every spoken assurance.',
      citations: [
        cite(
          'treaty-signing',
          'Initial discussions; proposed Treaty; first signatures',
        ),
        cite('tiriti-signing-records', 'Waitangi, 6 February 1840'),
      ],
    },
    {
      year: 1840,
      label: 'March–April 1840: different sheets and regional decisions',
      title: 'One English sheet does not stand for every signing',
      text: 'The Waikato-Manukau sheet is in English. Its first signing date is uncertain; an 11 April witness note is distinct from a 26 April Manukau signing. Some rangatira signed while Te Wherowhero declined. Neither choice describes every Waikato or Ngāti Whātua position.',
      citations: [
        cite('tiriti-archive-sheets', 'Sheet 3: initial-date uncertainty and Manukau'),
      ],
    },
    {
      year: 1840,
      label: '21 May 1840: Hobson proclaims sovereignty',
      title: 'The Crown announces a claim before circulation ends',
      text: 'The proclamation asserts British sovereignty over the islands while sheets are still circulating. Ōnuku’s 30 May signing followed this announcement. A proclamation records what the Crown claimed; it does not establish every community’s consent or prove the promises were fulfilled.',
      citations: [
        cite('tiriti-proclamation', 'Proclamation; circulation'),
        cite('tiriti-onuku-runanga', '30 May 1840 historical-place paragraph'),
      ],
    },
    {
      year: 1840,
      label: 'Early September 1840: the recorded signing process ends',
      title: 'Absence and refusal remain part of the record',
      text: 'The source records a final signing near Kāwhia on 3 September. The sheets did not reach every community, and some rangatira refused. The end of collecting marks was not an agreement on every interpretation or a referendum of all inhabitants.',
      citations: [
        cite('tiriti-proclamation', 'End of the road'),
        cite('treaty-signing', 'Gathering more signatures'),
      ],
    },
    {
      year: 1844,
      label: '1844–1846: disputes and the Northern War',
      title: 'Enforcing authority changes people’s lives',
      text: 'Hōne Heke and his followers challenged British authority by cutting the flagstaff at Kororāreka. Armed conflict followed. The Tribunal’s later Te Raki inquiry found serious Crown breaches in this period, including attacks on pā and kāinga and harm to non-combatants. These are district-specific historical findings, not a story of one uniform Māori response.',
      citations: [
        cite('tiriti-kawanatanga-scholarship', 'Page 2: Armed enforcement'),
        cite('tiriti-te-raki-2022', 'Northern War 1844–46 summary'),
      ],
    },
  ],
};

/** Published place/date evidence only; this is not a map or a set of coordinates. */
export const tiritiSigningGeography: {
  place: string;
  date: string;
  qualification: string;
  citations: Citation[];
}[] = [
  {
    place: 'Waitangi, Bay of Islands',
    date: '6 February 1840',
    qualification:
      'Initial Māori-text signing; exact signature estimates differ among sources.',
    citations: [
      cite('treaty-signing', 'First signatures'),
      cite('tiriti-archive-sheets', 'Sheet 1'),
    ],
  },
  {
    place: 'Te Waimate / Waimate North',
    date: '9 or 10 February 1840: institutional discrepancy',
    qualification:
      'Archives gives 9 February; the 2014 Tribunal release gives 10 February. No exact day selected here.',
    citations: [
      cite('tiriti-archive-sheets', 'Sheet 1'),
      cite('tiriti-te-raki-2014', 'Questions and answers: signing places'),
    ],
  },
  {
    place: 'Mangungu, Hokianga',
    date: '12 February 1840',
    qualification:
      'Māori-text signing; no exact count adopted across differing institutional accounts.',
    citations: [
      cite('tiriti-signing-records', 'Mangungu, 12 February'),
      cite('tiriti-te-raki-2014', 'Questions and answers'),
    ],
  },
  {
    place: 'Waikato Heads',
    date: 'Late March or early April 1840; exact first date unknown',
    qualification:
      'English sheet; the 11 April witnessing note is not substituted for a known first-signing date.',
    citations: [cite('tiriti-archive-sheets', 'Sheet 3')],
  },
  {
    place: 'Manukau Harbour, likely Āwhitu',
    date: '26 April 1840',
    qualification:
      'English sheet; exact location qualified by the source, not a surveyed point.',
    citations: [cite('tiriti-archive-sheets', 'Sheet 3')],
  },
  {
    place: 'Ōnuku, Akaroa Harbour',
    date: '30 May 1840',
    qualification:
      'Herald-Bunbury Māori sheet; the local rūnanga locates this within the Ngāi Tahu takiwā.',
    citations: [
      cite('tiriti-archive-sheets', 'Sheet 7'),
      cite('tiriti-onuku-runanga', 'Historical-place paragraph'),
    ],
  },
  {
    place: 'Cloudy Bay / Te Koko a Kupe',
    date: '17 June 1840',
    qualification:
      'Nohorua’s request for a witness is an attributed archival account, not a freshly read original journal.',
    citations: [cite('tiriti-archive-sheets', 'Sheet 7: Nohorua')],
  },
  {
    place: 'Near Kāwhia',
    date: '3 September 1840',
    qualification:
      'Recorded final signing; a regional place description, not an exact plot or universal consent.',
    citations: [cite('tiriti-proclamation', 'End of the road')],
  },
];

export const tiritiAuthorityDimension: Subject['dimensions'][string] = {
  text: 'The Māori and English texts, spoken assurances and regional decisions shaped different expectations of authority. A Crown proclamation and later enforcement must be examined separately from a signature or a document’s claim that agreement was understood.',
  citations: [
    cite('tiriti-tepapa-texts', 'Articles 1–2 and closing formulas'),
    cite('tiriti-te-raki-2014', 'Meaning/effect and geographic scope'),
    cite('tiriti-proclamation', '21 May transcript'),
  ],
};

export function applyAuthorityTiriti(c: Corpus): void {
  const subject = c.subjects.find((row) => row.id === 'tiriti');
  if (!subject) throw Error('Missing preserved Tiriti dossier');
  for (const source of sources)
    if (!c.sources.some((row) => row.id === source.id)) c.sources.push(source);
  for (const [id, text] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw Error(`Missing original source ${id}`);
    const marker = 'Selected 29 October 2026 Tiriti renewal:';
    if (!source.scope.includes(marker))
      source.scope = `Prior consultation (2026-10-26) retained: ${source.scope} ${marker} ${text}`;
    source.accessed = consulted;
  }
  if (!c.contexts) c.contexts = [];
  const position = c.contexts.findIndex((row) => row.id === tiritiAuthorityContext.id);
  if (position < 0) c.contexts.push(tiritiAuthorityContext);
  else c.contexts[position] = tiritiAuthorityContext;
  subject.contextIds = [
    ...new Set([...(subject.contextIds ?? []), tiritiAuthorityContext.id]),
  ];
  subject.summary =
    'Rangatira debated words, sought assurances and made different decisions as Treaty sheets circulated. The Māori text, the original English text and later translations need separate labels. Promises of authority and protection must also be tested against subsequent Crown actions.';
  subject.sections = [
    sec(
      'An agreement took work',
      'Te Tiriti was made through drafting, translation, speeches, questions and marks. Henry Williams and his son Edward translated an English draft into Māori before the Waitangi hui. Rangatira discussed land and the authority of the proposed governor, rather than merely witnessing a ceremony. Those who signed on 6 February 1840 signed or marked the Māori text. Missionaries and officials then carried copies elsewhere. Reading the documents matters, but so do the explanations and assurances through which people encountered them.',
      cite('treaty-signing', 'Drafting; 5–6 February discussion and signing'),
      cite('tiriti-te-raki-2014', 'How was the Treaty made?'),
    ),
    sec(
      'Keep three kinds of text distinct',
      'The original English article 1 claims a transfer of sovereignty. The Māori article uses kāwanatanga; article 2 guarantees tino rangatiratanga over lands, villages and taonga. In his later scholarly translation, Hugh Kawharu renders the first term as government and the retained authority as chieftainship. His English translation is not the English document of 1840. Comparing articles 1 and 2 together raises a practical question: who would make decisions, and what authority and resources would communities retain?',
      cite(
        'tiriti-tepapa-texts',
        'Original Māori/English articles 1–2; separate Kawharu translation',
      ),
      cite('tiriti-kawanatanga-scholarship', 'Page 1: terms in context'),
    ),
    sec(
      'Sheets record different decisions',
      'The surviving set contains nine sheets, including one English sheet and a printed Māori sheet. Colenso’s printing helped circulate the wording; the surviving printed sheet’s signing dates are unknown. Making copies expanded the document’s reach while leaving different local discussions to be reconstructed. Some Waikato rangatira signed the English sheet; Te Wherowhero declined. At Ōnuku, in the Ngāi Tahu takiwā, the Māori Herald-Bunbury sheet was signed on 30 May. Elsewhere, Ngāti Toa rangatira Nohorua wanted his son-in-law to witness his signature because of what future land loss might mean for their descendants. Such decisions concerned relationships and accountability. An identifying mark cannot by itself tell us every assurance heard, every person represented or every expectation held.',
      cite('tiriti-archive-sheets', 'Introduction; sheets 3, 4 and 7'),
      cite('tiriti-onuku-runanga', 'Historical-place paragraph'),
    ),
    sec(
      'A claim of power is not its fulfilment',
      'Hobson proclaimed British sovereignty on 21 May, before circulation ended. That announcement asserted authority; it did not turn non-signing communities into consenting signatories. Nor did signing ensure that protection would follow. In its 2014 Te Raki findings, the Tribunal concluded that the northern rangatira signing in February had not ceded sovereignty. Its later inquiry described serious Crown breaches during the Northern War, including military attacks on settlements. These findings have named districts and historical scopes. They invite examination of what people were promised and what government subsequently did.',
      cite('tiriti-proclamation', '21 May proclamation; ongoing circulation'),
      cite('tiriti-te-raki-2014', 'Geographic and temporal scope'),
      cite('tiriti-te-raki-2022', 'Northern War findings in official release'),
    ),
  ];
  subject.deeperReading = [
    sec(
      'Translation remains an attributed interpretation',
      'The complete published Māori transcription, English text and Kawharu translation are available through the sources. The capsules here select articles 1 and 2; they do not reproduce the whole agreement. Article 3 also needs attention: Kawharu’s commentary examines tikanga and cautions against assuming that British citizenship language carried identical meanings in both languages. The 2014 Tribunal considered spoken explanations as well as text. Its conclusion concerned February signings in the Bay of Islands and Hokianga, not every signing throughout the country or a ruling on the Crown’s present sovereignty. A later institutional translation helps a reader compare; it cannot stand in for the voice of each rangatira.',
      cite('tiriti-tepapa-texts', 'All three articles and modern translation'),
      cite('tiriti-tribunal-text-editions', 'Kawharu commentary note 11'),
      cite('tiriti-te-raki-2014', 'Scope and basis for conclusions'),
    ),
    sec(
      'Place and speaker change the question',
      'Ōnuku Rūnanga describes the signing place as a continuing home and a place for Ngāi Tahu discussion. In a 2025 commemorative speech there, Justin Tipa connected the signatories Iwikau and Tīkao with descendants caring for that gathering. He distinguished collective rangatiratanga from individual citizenship rights and described Ngāi Tahu’s position within a constitutional monarchy. This is a named, dated Ngāi Tahu perspective, not the single Māori answer to every constitutional question. Read alongside the geographically bounded Te Raki inquiry, it shows why evidence needs a place, an audience and a date. Neither source supplies permission to speak for every iwi or hapū.',
      cite('tiriti-onuku-runanga', 'Rūnanga self-description'),
      cite(
        'tiriti-ngaitahu-tipa-2025',
        'Ōnuku memory; collective rights and constitutional position',
      ),
    ),
  ];
  subject.evidenceReading = {
    title: 'Original wording, recorded marks and a later finding',
    introduction:
      'The passages below are selected terms and editorial paraphrases. Original document, published transcription, modern translation and later historical finding remain distinct.',
    items: [
      {
        label: 'Two originals and a later translation',
        text: 'The Māori transcription’s article 1 includes “te Kawanatanga katoa”; article 2 includes “te tino rangatiratanga”. The original English article 1 speaks of sovereignty. Kawharu’s separately labelled translation uses government for the first term.',
        interpretation:
          'Compare the powers being discussed and the guarantees being retained. A translation is an interpretation with an author; it is not a newly discovered original English promise. Māori terms in running explanation use modern macrons; the short quoted transcription retains the source’s spelling.',
        citations: [
          cite('tiriti-tepapa-texts', 'Māori/English articles 1–2; later translation'),
        ],
      },
      {
        label: 'A number beside a name',
        text: 'NZHistory explains that the 1877 facsimiles number signatories for reference. Those numbers need not match signing order, and some identities and affiliations depend on later research.',
        interpretation:
          'A mark, catalogue number and later biographical identification are different evidence. Avoid turning an uncertain name or a blank region on a signing map into proof of agreement or refusal.',
        citations: [
          cite(
            'tiriti-signing-records',
            'Introduction: facsimile numbers and uncertainty',
          ),
        ],
      },
      {
        label: 'A proclamation and a bounded inquiry',
        text: 'The 21 May proclamation announces Crown sovereignty. The Tribunal’s 2014 release reaches a different conclusion about what the February northern signatories had agreed to transfer.',
        interpretation:
          'The first records a claim made by the Crown; the second is a later inquiry into the agreement’s meaning in a specified region and month. Neither is a tally of every community’s consent, and neither alone shows how authority was enforced.',
        citations: [
          cite('tiriti-proclamation', 'Full exposed proclamation transcript'),
          cite('tiriti-te-raki-2014', 'Conclusion and scope'),
        ],
      },
    ],
  };
  subject.familyActivity = {
    title: 'Label the kind of evidence',
    duration: 'About 10 minutes',
    steps: [
      'Read three supplied capsules: A—the 1840 English article 1 claims sovereignty. B—the Māori text uses kāwanatanga, translated by Kawharu as government, and article 2 guarantees tino rangatiratanga. C—Hobson’s 21 May proclamation asserts Crown sovereignty while signing continued.',
      'Label the original text, the later translation inside a capsule, and the later proclamation. Underline a claim about governing and circle a promise about retained authority.',
      'Ask two questions before calling this universal agreement: which community and occasion are we discussing, and what evidence would show that its promises were carried out? Use the supplied Ōnuku/Te Wherowhero examples to explain why one answer cannot fit every place.',
    ],
    explanation:
      'A and the Māori wording in B are two 1840 texts; Kawharu’s English wording inside B is later interpretation. C is a Crown assertion, not another community’s signature. A promise and its fulfilment require different evidence. The examples show both signing and refusal without assigning either position to all Māori.',
  };
  subject.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author checking; not independent Māori-language, historian, iwi or hapū approval',
    scope:
      'Complete published transcriptions were read; learner capsules select articles 1–2 and a later proclamation. Source-qualified early enforcement and named modern Māori perspectives deepen the unchanged 1840 case. Original identity, complete interval/note/precision, claims, dimensions, coordinates and empty object list remain preserved.',
    limitations: [
      'No independent Māori translation, complete palaeography of the nine sheets, full original voyage journals or all signatory identities checked. Published transcriptions, later statutory editions and modern back-translations are labelled separately.',
      'Kawharu bibliographic attributions differ: Archives labels 1975; Te Papa cites a 1988 report; the current Tribunal page combines 1989 with a later title/editor set. No original composition/publication date for the translation is inferred. The underlying books/reports were not read to resolve that discrepancy.',
      'Waimate’s day and initial signature counts differ among institutional sources. The English sheet’s first signing date is unknown; a witness date is not substituted. The geography is a sourced place/date table, not surveyed coordinates, a complete itinerary, iwi borders or evidence that every region was reached.',
      'Tribunal sources here are official 2014/2022 summaries, not the complete evidentiary reports. Their district, month and historical limits are retained. No current legal claim, contemporary political bill status or completed redress is adjudicated or updated.',
      'The 2025 Tipa speech is a named Ngāi Tahu political perspective; its video and underlying legal references were not independently checked. It does not supply universal Māori assent or approval of this account.',
      'No current media exist for this case. Official Flickr sheet metadata were researched but pixels were not inspected or adopted; item-specific noncommercial/no-derivatives and no-overlay guidance prevents treating a generic website licence as unrestricted image permission. No new image or annotation supplied.',
    ],
  };
}
