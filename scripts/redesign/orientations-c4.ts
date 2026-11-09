import { addSourceConsultation } from './content-helpers';
import type {
  Corpus,
  RegionalOrientation,
  Section,
  Region,
} from '../../src/atlas/model';
const ref = (source: string, locator: string) => ({ source, locator });
const s = (
  title: string,
  text: string,
  ...citations: Section['citations']
): Section => ({ title, text, citations });
function reading(
  n: number,
  region: Region,
  title: string,
  question: string,
  sections: Section[],
  scope: string,
  perspectives: string,
  contextIds: string[],
  subjectIds: string[],
  prompt: string,
  response: string,
  snapshot: Section,
): RegionalOrientation {
  const id = `C4-R${n}`;
  return {
    id,
    chapter: 'C4',
    region,
    title,
    question,
    summary: sections[0]!,
    sections: sections.slice(1),
    scope,
    perspectives,
    contextIds,
    subjectIds,
    activity: { prompt, response },
    snapshots: [
      {
        orientation: id,
        region,
        year: 200,
        text: snapshot.text,
        citations: snapshot.citations,
      },
    ],
  };
}
export const c4Orientations = [
  reading(
    1,
    'Americas',
    'Households and shared places across American communities',
    'How did household work support larger gathering places?',
    [
      s(
        'Teotihuacan, Ohio and Moche valleys',
        'Teotihuacan’s neighbourhoods, Ohio’s earthwork gathering places and Moche valley communities reveal different relationships between domestic work and shared institutions. Their surviving buildings and objects do not establish one political system or contact among all three settings.',
        ref('teotihuacan', 'Residential Architecture'),
        ref('hopewell-moundcity', 'Ceremonial Gatherings'),
        ref('moche', 'Opening geography and production'),
      ),
      s(
        'Monuments depended on everyday work',
        'Apartment compounds at Teotihuacan bring household activities into an urban history often dominated by monuments. At Mound City, construction and ceremonial gathering form another setting for collective effort. Moche household archaeology instead supplies local sequences of production and domestic space. Monument size alone does not reveal who assigned the work.',
        ref('teotihuacan', 'Residential Architecture'),
        ref('hopewell-moundcity', 'Careful Construction'),
        ref('moche-households-2009', 'Printed pp183–190'),
      ),
      s(
        'Later buildings cannot fill an earlier moment',
        'These places changed over centuries. The full apartment history at Teotihuacan, a particular earthwork wall, and a later Moche household deposit are not all dated to 200 CE. The Bering Strait reading begins later still; it extends the chapter’s inquiry without supplying a northern case for this exact snapshot.',
        ref('teotihuacan', 'Urban chronology'),
        ref('hopewell-moundcity', 'Construction sequence'),
        ref('met-717577', 'Artwork Details: date'),
      ),
    ],
    'Three selected settings, with later Bering evidence kept separate. Local building episodes and sampled deposits retain their own dates.',
    'Household and production remains make ordinary tasks visible without recovering each worker’s status or testimony.',
    [
      'teotihuacan-neighborhood-context',
      'hopewell-gathering-context',
      'moche-valleys-work-context',
    ],
    ['teotihuacan', 'hopewell-earthworks', 'moche'],
    'Compare an apartment compound and an earthwork enclosure. What would you need before claiming both used identical labour arrangements?',
    'Describe the distinct activities and local contexts. Seek evidence of recruitment, obligations and organization at each place; similar large projects do not establish identical institutions.',
    s(
      '200 CE',
      'Around 200 CE, Teotihuacan, Ohio gathering traditions and Moche valley communities provide distinct regional settings. The broad overlap permits comparison, not the assignment of every later apartment, mound or workshop to this year.',
      ref('teotihuacan', 'Urban chronology'),
      ref('hopewell-newark-center', 'FAQ: archaeological chronology'),
      ref('moche', 'Chronology and regional setting'),
    ),
  ),
  reading(
    2,
    'Africa',
    'Aksum, Adulis and the Meroe region',
    'How can inland work and exchange be read alongside royal monuments?',
    [
      s(
        'Ports and inland centres',
        'Adulis was a coastal outlet connected with inland Aksum in an early merchant account. Farther northwest, Meroe and its associated centres preserve a different Nile-region history. These settings broaden the view beyond a single port or monumental capital.',
        ref('aksum-world', 'Excerpt pp5–7: Adulis and inland connection'),
        ref('orientation-meroe', 'Brief synthesis: three components'),
      ),
      s(
        'Moving goods required work in particular places',
        'The merchant account describes exchange from a commercial perspective. Meroe-region remains include production and water installations alongside temples and burials. Such evidence makes provisioning and skilled work part of institutional history without supplying the route of every traded object.',
        ref('aksum-world', 'Excerpt pp5–7'),
        ref('orientation-meroe', 'Brief synthesis: production and reservoirs'),
      ),
      s(
        'An excavated deposit has several dates',
        'Beta Samati’s later deposits combine objects with different manufacture dates. The investigators use coins, pottery and radiocarbon evidence together. These later inland findings are useful for following change, but cannot all be projected back to 200 CE or treated as one contemporary assemblage.',
        ref('beta-samati', 'Printed pp1540–1543; Figure4 and upper-deposit chronology'),
      ),
    ],
    'Separate Horn/Red Sea and Nile settings. The first-century account and later inland deposits are dated comparisons around a broad regional frame, not a census of Africa in 200 CE.',
    'Merchant and royal records favour particular interests. Food preparation and production debris expose additional work while leaving many individual voices absent.',
    ['aksum-red-sea-context'],
    ['aksum'],
    'An old coin appears in a later deposit. Which dates must you distinguish before using it to date the whole site?',
    'Separate manufacture, circulation, deposition and excavation. Compare stratigraphy, pottery and independent dates before assigning the deposit or site a date.',
    s(
      '200 CE',
      'Around 200 CE falls within the selected Aksumite and Meroe-region histories. The early Adulis account offers preceding evidence of coastal–inland exchange; Beta Samati’s later finds are follow-through, not objects automatically deposited in this year.',
      ref('aksum', 'Aksumite architectural chronology'),
      ref('orientation-meroe', 'Brief synthesis: Kushite frame'),
      ref('beta-samati', 'Chronology and upper deposits'),
    ),
  ),
  reading(
    3,
    'Europe',
    'Roman households, provincial power and later change',
    'How did legal status and practical work differ across an empire? ',
    [
      s(
        'Rome and its provinces',
        'The Severan court connected people and places beyond Italy: Septimius Severus came from Leptis Magna, and Julia Domna from Syria. Governing involved armies and provincial institutions as well as a court. Rome was a centre of authority, not a model for every household under its rule.',
        ref('rome-severans', 'Dynastic origins and provincial officers'),
      ),
      s(
        'Occupation did not determine legal status',
        'Agriculture, craft and services supported towns and armies. The museum guide distinguishes occupations from the legal positions of enslaved, freed and freeborn people. Two people doing similar work could therefore have very different rights and opportunities.',
        ref('rome-educators', 'Printed p130: Occupations'),
      ),
      s(
        'Institutions changed after the snapshot',
        'The grant of citizenship in 212 CE and the later development of Constantinople belong after 200 CE. The Middle Byzantine ivory in the linked reading is much later still. These are opportunities to compare changing institutions, not reasons to widen the Severan object’s date.',
        ref('rome-severans', 'Caracalla and citizenship'),
        ref('byzantium', 'Constantine and period divisions'),
        ref('met-464428', 'Artwork Details: date'),
      ),
    ],
    'A Roman imperial focus connecting Rome with provincial settings; later Constantinople is a dated comparison. It does not represent every European community.',
    'Elite portraits favour ruling families; work and legal categories help recover other positions without making everyone’s experience equivalent.',
    ['rome-early-empire'],
    ['roman-world', 'byzantium'],
    'Why does naming a person’s job not establish that person’s rights?',
    'Use the distinction between occupation and legal status. Work of the same kind could be performed by people with different status; a stronger claim needs evidence about the particular person.',
    s(
      '200 CE',
      'Around 200 CE belongs to Severan rule. Caracalla’s later citizenship grant in 212 CE has not yet occurred, and Constantinople’s later imperial history is not backdated. The portrait and household inquiry remain grounded in their own ranges.',
      ref('rome-severans', 'Severan chronology; citizenship in 212 CE'),
      ref('met-251870', 'Date'),
    ),
  ),
  reading(
    4,
    'West/Central Asia',
    'Palmyra and Parthian centres: exchange within political settings',
    'What can a trading city tell us beyond a line on a route map?',
    [
      s(
        'Palmyra and Ctesiphon',
        'Palmyra’s family memorials and civic rules give a local view of transactions and public life. Ctesiphon was a principal Parthian royal residence farther east. Their histories invite comparison of civic and royal institutions without making Palmyra merely a stop on an invented itinerary.',
        ref('palmyra-getty', 'Trade; Roman and Later Periods'),
        ref('parthia', 'History: Ctesiphon'),
      ),
      s(
        'Exchange had rules and patrons',
        'Palmyra’s tax text records particular regulated transactions, rather than all trade everywhere. The Parthian account connects wealth and artistic patronage, while acknowledging that much art from the capitals is lost. Surviving edge-region objects cannot simply stand in for every missing capital context.',
        ref('palmyra-tax', 'Opening extract and pp173–175'),
        ref('parthia', 'Parthian Art: patronage and preservation'),
      ),
      s(
        'A later political transition',
        'Parthian rule ended with the Sasanian takeover in the early third century CE. That change follows the 200 CE snapshot. Palmyra’s own later conflicts and continuing history must also retain separate dates, rather than become one universal regional collapse.',
        ref('parthia', 'Title dates and History ending'),
        ref('palmyra-getty', 'Roman and Later Periods'),
      ),
    ],
    'Selected Syrian and Mesopotamian settings. No continuous caravan itinerary or uniform political history is inferred from objects or regional overlap.',
    'Family memorials and civic rules preserve different priorities from royal accounts. Traders, carriers and workers remain unevenly represented.',
    ['palmyra-civic-context'],
    ['palmyra'],
    'Why is a tax rule evidence of a civic arrangement but not a complete record of every transaction?',
    'It states selected rules or categories. Establishing actual compliance and the full volume or routes of exchange requires other evidence.',
    s(
      '200 CE',
      'Around 200 CE, Palmyra’s civic setting coexists with the late Parthian world. The Sasanian takeover of 224 CE comes later. These dates locate distinct institutions; they do not supply a journey taken by every object.',
      ref('palmyra-tax', 'Civic tax setting'),
      ref('parthia', '247 BCE–224 CE chronology'),
    ),
  ),
  reading(
    5,
    'South Asia',
    'Kushan images, temple orders and practical maintenance',
    'How did a royal command become work at a particular sanctuary?',
    [
      s(
        'Rabatak and Surkh Kotal',
        'The Rabatak inscription records royal and dynastic instructions concerning a temple. Surkh Kotal’s inscription concerns a water problem and building work. These named settings let us compare the announcement of authority with practical maintenance.',
        ref('kushan-inscriptions', 'Printed pp76–79: Rabatak and SK4'),
      ),
      s(
        'Named intermediaries matter',
        'The Surkh Kotal account credits Nukunzuk with work on water provision; a version also names Burzmihr and the writer Mihraman. Such details shift attention from the ruler’s image to people involved in carrying out and recording a project. They remain statements in an inscription, not a complete workforce account.',
        ref('kushan-inscriptions', 'Printed pp78–79: SK4 and version M'),
      ),
      s(
        'The remembered event and the surviving record',
        'Sims-Williams separates Rabatak’s account of first-year orders from possible indications of a later inscription date. The selected coin has another catalogue date. Reading them together requires several clocks rather than one date for every expression of Kushan rule.',
        ref('kushan-inscriptions', 'Printed pp76–78: dating discussion'),
        ref('met-39385', 'Date and description'),
      ),
    ],
    'A justified institutional focus across two sanctuaries in present-day Afghanistan and a separately catalogued coin. It does not cover all South Asia or resolve every debated Kanishka-era convention.',
    'Inscriptions name some officials and a writer but do not preserve every builder’s or worshipper’s account.',
    ['kushan-temples-context'],
    ['kushan-contexts'],
    'How would you label an inscription that remembers an earlier command?',
    'State the command’s reported date separately from the proposed date of the surviving inscription. Keep the dating debate visible rather than making the record contemporary by assumption.',
    s(
      '200 CE',
      'Around 200 CE lies within the broad Kushan frame. The selected coin and sanctuary inscriptions refer to separately dated earlier events and records; they are evidence for an institutional history, not proof that those works occurred in this year.',
      ref('kushan', 'Chronological frame'),
      ref('kushan-inscriptions', 'Printed pp76–79'),
    ),
  ),
  reading(
    6,
    'East Asia',
    'Han capitals and the work represented in tomb models',
    'How do models and policy proposals illuminate different parts of household production?',
    [
      s(
        'Chang’an, Luoyang and represented estates',
        'The Han account distinguishes a western capital phase from the restored Eastern Han court. Tomb models of towers, granaries and wells introduce another scale: the resources and buildings associated with estates. These are representations made for funerary use, not measured plans of one surviving farm.',
        ref('han', 'Western Han and Eastern Han paragraphs'),
        ref('models', 'Han agricultural structures'),
      ),
      s(
        'Storage and water supported repeated work',
        'A granary points toward keeping food available beyond harvest; a well toward access to water. Together with the tower, the models invite questions about provision and household standing. Their presence in a tomb does not recover exact crop yields, ownership arrangements or workers’ conditions.',
        ref('met-52010', 'Description'),
        ref('met-52527', 'Description'),
        ref('met-49519', 'Description and date'),
      ),
      s(
        'After Han, several political centres',
        'After 220 CE, the museum chronology distinguishes Wei, Wu and Shu, followed by Jin and later overlapping northern and southern regimes. These categories describe changing political arrangements, not the disappearance of farming or skilled work. Later political histories need their own evidence rather than an extension of the Eastern Han label.',
        ref('orientation-post-han', 'Timeline; Key Events c220–589 CE'),
      ),
      s(
        'Earlier policy is not a later estate ledger',
        'Chao Cuo’s 178 BCE proposal connected grain deliveries with rank and penalties. It is much earlier than many Eastern Han models. The Han frame ends in 220 CE, after this chapter’s snapshot; neither the earlier proposal nor that later boundary dates every model or household.',
        ref('han-agriculture', 'Introduction; translated memorial pp3–5'),
        ref('han', 'Eastern Han chronology'),
      ),
    ],
    'A focused Chinese imperial and household inquiry with distinct capitals and evidence types. It does not stand for every East Asian community or turn funerary objects into literal buildings.',
    'Models express selected expectations of provision and standing; policy prose foregrounds an adviser’s concerns. Farm workers’ own testimony is less visible.',
    ['han-and-xin'],
    ['eastern-han'],
    'Compare the evidence supplied by a model granary and an adviser’s proposal about grain.',
    'The model represents a structure and expectations of provision; the proposal recommends an administrative action. Neither alone proves the actual yield or rules of a particular estate.',
    s(
      '200 CE',
      'Around 200 CE belongs to Eastern Han, before the conventional 220 CE endpoint. Broadly dated tomb models support a household-provisioning inquiry. Chao Cuo’s much earlier proposal remains a comparison, not a regulation documented for this year.',
      ref('han', 'Eastern Han chronology'),
      ref('met-49519', 'Date'),
      ref('han-agriculture', 'Introduction:178 BCE'),
    ),
  ),
  reading(
    7,
    'Southeast Asia/Oceania',
    'Mekong exchange, bronze working and Tongan settlement',
    'How can a regional overview and an excavated workshop answer different questions?',
    [
      s(
        'Óc Eo and northern Vietnamese contexts',
        'The national museum places Óc Eo in the lower Mekong and delta, within a broad first–seventh-century CE setting of exchange. Northern drum finds and later Luy Lâu production evidence belong to different places and dates. Their comparison should not turn them into one city or one political system.',
        ref('orientation-oc-eo', 'Main account: geography and chronology'),
        ref('dongson-luy-lau-2024', 'Workshop and phase paragraphs'),
      ),
      s(
        'Exchange and production need different evidence',
        'The museum overview describes ports and interregional exchange. At Luy Lâu, moulds and production debris supply a more local question about how bronze objects were made. A regional trade description does not date each workshop or identify the route of a particular drum.',
        ref('orientation-oc-eo', 'Main account: exchange and port'),
        ref('dongson-luy-lau-2024', 'Moulds, crucibles and workshop discard'),
      ),
      s(
        'Island settlement after pottery',
        'The Tongan study describes occupation continuing from ceramic into later aceramic periods at its sampled sites. Holopeka, Fakala’a and Moisa began in the plainware phase and continued later. This independently researched island sequence distinguishes settlement from pottery manufacture; it is not evidence for contact with the Mekong.',
        ref(
          'lapita-tonga-ceramic-change',
          'Methods: site continuity and three exceptions',
        ),
      ),
      s(
        'Displayed objects can be later than the opening frame',
        'The Óc Eo page lists coins and rings dated to the fifth–sixth centuries and a wooden Buddhist statue to the fifth–seventh. Those objects cannot illustrate 200 CE simply because the regional heading begins in the first century. Later workshop evidence must be handled with the same care.',
        ref('orientation-oc-eo', 'Artifact captions: coins, rings, wooden statue'),
        ref('dongson-luy-lau-2024', 'Phase interpretation'),
      ),
    ],
    'Separate mainland and Tongan settings. The study describes settlement continuity into later aceramic periods, not a precisely dated 200 CE floor or evidence of contact with Vietnam. The Óc Eo overview does not establish exact borders or a first port.',
    'Museum overviews and archaeological finds expose different scales of work, but neither records all inhabitants’ experiences.',
    ['dongson-selected-contexts'],
    ['dongson'],
    'Why should a fifth-century coin remain outside a display specifically labelled 200 CE?',
    'Its own catalogue date takes precedence over a broad regional heading. Use it as an explicitly later comparison, or find evidence independently dated to the selected moment.',
    s(
      '200 CE',
      'Around 200 CE falls within the museum’s broad lower-Mekong Óc Eo frame. Its displayed fifth–seventh-century objects and later Luy Lâu workshop finds are not backdated. Tongan research separately describes settlement continuing into later aceramic periods; it does not identify an exact event in this year.',
      ref('orientation-oc-eo', 'Main chronology versus artifact captions'),
      ref('dongson-luy-lau-2024', 'Phase paragraphs'),
      ref('lapita-tonga-ceramic-change', 'Methods: settlement continuity'),
    ),
  ),
];
export function applyC4Orientations(corpus: Corpus) {
  corpus.sources.push(
    {
      id: 'orientation-post-han',
      title: 'China, 1–500 A.D.',
      institution: 'The Metropolitan Museum of Art',
      type: 'scholarship',
      accessed: '2026-11-04',
      url: 'https://www.metmuseum.org/toah/ht/05/eac.html',
      scope:
        'Timeline and Key Events c220–589 CE consulted for Three Kingdoms, Jin and overlapping northern/southern regimes. The inaccurate Sima Jian/Wu attribution in the c265 CE entry is not adopted; national-consciousness, universal warfare and artistic priority claims are not adopted. No images reproduced.',
    },
    {
      id: 'orientation-oc-eo',
      title: 'Oc Eo – Phu Nam Cultures (1st – 7th centuries AD.)',
      institution: 'Vietnam National Museum of History',
      type: 'catalogue',
      accessed: '2026-11-04',
      url: 'https://vnmh.com.vn/en/Articles/4214/oc-eo-phu-nam-cultures-1st-7th-centuries-ad',
      scope:
        'Main geography/exchange paragraphs and displayed artifact captions consulted. Broad first–seventh-century regional frame is distinct from later coins, rings and statues. Institutional overview, not a complete excavation chronology; political rankings, maximal territory and first-port claims not adopted. No images reproduced.',
    },
  );
  addSourceConsultation(
    corpus,
    'parthia',
    '2026-11-04',
    'Additional consultation 4 November: selected History and opening Parthian Art paragraphs on Ctesiphon, dynastic transition, patronage and uneven preservation. No complete object survey, precise border map, route reconstruction or image reuse.',
  );
  addSourceConsultation(
    corpus,
    'lapita-tonga-ceramic-change',
    '2026-11-04',
    'Additional consultation 4 November: Methods paragraphs on sampled-site continuity into later aceramic periods and the Holopeka, Fakala’a and Moisa exceptions. This supports a bounded later-settlement comparison, not a precisely dated 200 CE event.',
  );
  (corpus.orientations ??= []).push(...structuredClone(c4Orientations));
}
