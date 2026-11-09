import type { Corpus, RegionalOrientation, Section } from '../../src/atlas/model';
const ref = (source: string, locator: string) => ({ source, locator });
const section = (
  title: string,
  text: string,
  ...citations: Section['citations']
): Section => ({ title, text, citations });

export const c2Orientations: RegionalOrientation[] = [
  {
    id: 'C2-R1',
    chapter: 'C2',
    region: 'Americas',
    title: 'Earthwork communities in different American landscapes',
    question:
      'Does a large building project tell us how people obtained food or organized work?',
    summary: section(
      'Supe, the Gulf Coast and the lower Mississippi',
      'Caral’s later building history, San Lorenzo’s constructed landscape and Poverty Point’s earthworks belong to different places and sequences. Large public spaces make collective work visible. They do not require us to assume one farming system, one political structure or contact among all three communities.',
      ref('caral', 'Integrity: development range'),
      ref('olmec', 'San Lorenzo earth building'),
      ref('pp-nps', 'Earthworks, food and main-site dates'),
    ),
    sections: [
      section(
        'Provisioning does not have one recipe',
        'Poverty Point’s hunter-fisher-gatherer communities used varied local foods while obtaining materials from farther away. In the Gulf Coast account, pottery and earth building accompany a different environmental and social history. Monument size alone cannot tell us whether every builder farmed, how food was distributed, or whether all work was compulsory.',
        ref('pp-nps', 'Food resources and materials'),
        ref('olmec', 'San Lorenzo: pottery and monumental landscape'),
      ),
      section(
        'A place changes without every community ending',
        'Caral’s broad development frame ends before 1200 BCE. Poverty Point’s main complex belongs to about 1700–1100 BCE, while San Lorenzo and later La Venta have separately described peaks. The appearance of a new prominent centre should not be read as the disappearance of all people or craft production at the earlier one.',
        ref('caral', 'Integrity and Authenticity'),
        ref('pp-nps', '1700–1100 BCE frame'),
        ref('olmec', 'After about 900 B.C.; later production at other centres'),
      ),
    ],
    perspectives:
      'Earthmoving and food remains bring builders and provisioners into view, but most individual arrangements of work are unrecovered. Museum labels describe evidence categories, not a single American people.',
    scope:
      'Three selected settings, not a uniform American sequence. The old Caral record is a comparison across time, not a settlement extended into the 1200 BCE snapshot.',
    contextIds: [
      'caral-community-context',
      'olmec-centres-context',
      'poverty-earthworks-context',
    ],
    subjectIds: ['poverty-point', 'olmec', 'caral'],
    activity: {
      prompt:
        'A visitor says that large earthworks prove every community grew the same crops. Use one food record and one dated site to revise that claim.',
      response:
        'Use Poverty Point’s hunter-fisher-gatherer food evidence to separate subsistence from monument size. Then identify a particular site and date range; similar earthworks alone do not establish the same food system or contact.',
    },
    snapshots: [
      {
        orientation: 'C2-R1',
        region: 'Americas',
        year: -1200,
        text: 'Around 1200 BCE, Poverty Point and San Lorenzo provide distinct settlement settings. Caral’s retained development range has already ended. Compare the earthworks and evidence of provisioning without placing all three at one simultaneous peak.',
        citations: [
          ref('pp-nps', '1700–1100 BCE main-site frame'),
          ref(
            'olmec-regional-inah',
            'Introductoria: San Lorenzo 1200–900 BCE convention',
          ),
          ref('caral', 'Integrity: development endpoint'),
        ],
      },
    ],
  },
  {
    id: 'C2-R2',
    chapter: 'C2',
    region: 'Africa',
    title: 'Kerma and the Nile: goods, institutions and changing control',
    question: 'How can exchange and political domination leave different evidence?',
    summary: section(
      'A Nubian city and its northern neighbours',
      'Kerma’s craft production and imported burial goods reveal both local skill and exchange with Egypt. Relations also included conflict and diplomacy. The selected beaker makes ceramic work visible; it cannot stand for every household or for the full history of Nile politics.',
      ref('kerma', 'Key Events: c2050–1500 BCE'),
      ref('met-545772', 'Object description and date'),
    ),
    sections: [
      section(
        'Making goods and moving goods are different tasks',
        'The project identifies institutions, walls and tombs in successive Kerma phases. Imported objects in tombs show the movement and selective use of goods. They do not name every producer, trader or carrier, and elite burial equipment does not measure ordinary household access.',
        ref('kerma-history-project', 'Chronology: Middle and Classic Kerma'),
        ref('kerma', 'Key Events: imports and local burial equipment'),
      ),
      section(
        'The 1200 BCE setting comes after Kerma’s kingdom',
        'The museum places Upper Nubia under Egyptian control within a broad 1500–1070 BCE frame. It describes new settlements, temples and administration, including Napata near Jebel Barkal. This later institutional setting must be distinguished from Kerma’s earlier urban kingdom and the still earlier manufacture of the selected beaker.',
        ref('kerma', 'Upper Nubia timeline; Key Events c1550–1070 BCE'),
        ref('met-545772', 'Date: c1802–1640 BCE'),
      ),
    ],
    perspectives:
      'Tombs privilege selected elites; temples and administrative labels privilege institutions. Potters and other workers are visible through objects, without a complete record of their own accounts.',
    scope:
      'Selected Nile and Nubian settings, not all African communities. Differing project and museum Kerma endpoints remain in the linked dossier; no exact universal conquest year is imposed.',
    contextIds: ['kerma-city-context'],
    subjectIds: ['kerma-potters'],
    activity: {
      prompt:
        'Distinguish what an imported burial object shows from what an administrative chronology shows. Why is the beaker not a 1200 BCE object?',
      response:
        'An import supports movement and burial use of a good; the chronology describes a broader political arrangement. The beaker has its own earlier catalogue range, so it is a comparison rather than a contemporary object.',
    },
    snapshots: [
      {
        orientation: 'C2-R2',
        region: 'Africa',
        year: -1200,
        text: 'The selected Nile setting around 1200 BCE is Egyptian administration in Nubia, including temple and settlement development. Kerma’s earlier kingdom and the beaker remain earlier readings. Political control did not make every local person, craft or experience identical.',
        citations: [
          ref('kerma', 'Upper Nubia: c1500–1070 BCE; Key Events c1550–1070 BCE'),
        ],
      },
    ],
  },
  {
    id: 'C2-R3',
    chapter: 'C2',
    region: 'Europe',
    title: 'Palaces, workshops and farms across Bronze Age Europe',
    question: 'Whose work becomes visible when we look beyond a palace?',
    summary: section(
      'Crete, mainland Greece and Britain',
      'Cretan centres such as Knossos and Phaistos concentrated goods, craft activity and record keeping. Mainland Greek centres provide later workshop and administrative evidence. British farms and fields offer a different settlement pattern within a longer Bronze Age frame.',
      ref('completion-minoan-crete', 'Around 1900 B.C.; With the palaces'),
      ref('completion-mycenaean', 'Centres and workshops'),
      ref('completion-british-bronze', 'Settlements and fields'),
    ),
    sections: [
      section(
        'Records make some labour easier to see',
        'Clay records and specialized production show how some Aegean institutions organized resources. Britain’s round houses and field divisions instead draw attention to cultivation and household space. Different surviving evidence changes the questions we can answer; a place without palace records is not a place without skilled organization.',
        ref('completion-minoan-crete', 'Scripts and palace functions'),
        ref('completion-mycenaean', 'Linear B and workshop production'),
        ref('completion-british-bronze', 'Farms, houses and land divisions'),
      ),
      section(
        'Change was not synchronized',
        'The Cretan destruction horizon around 1450 BCE precedes the late-thirteenth-century destructions described for mainland centres. Britain’s broad Bronze Age sequence continues beyond both. The Uluburun cargo offers a comparison for circulating materials, not a proven route linking each of these selected places.',
        ref('completion-minoan-crete', 'From 1500 B.C.'),
        ref('completion-mycenaean', 'Final paragraph'),
        ref('completion-british-bronze', 'Period heading'),
        ref('uluburun', 'Cargo and date'),
      ),
    ],
    perspectives:
      'Institutional accounts favour the categories their record keepers needed. Farms and workshops expose other practical tasks, without supplying every worker’s voice or status.',
    scope:
      'Selected contrasting settings, not one European government or a common collapse. Uluburun is a cross-regional reading destination; no European origin or destination is assigned to its voyage.',
    contextIds: ['europe-bronze-settings'],
    subjectIds: ['uluburun'],
    activity: {
      prompt:
        'Choose a palace record and a field boundary as evidence. What work might each reveal, and why can neither prove one Europe-wide collapse?',
      response:
        'A record can identify institutional goods or labour categories; a field boundary can show organization of land. Each needs its own place and date. Neither extends a local destruction horizon to all European communities.',
    },
    snapshots: [
      {
        orientation: 'C2-R3',
        region: 'Europe',
        year: -1200,
        text: 'Around 1200 BCE, the mainland Greek account describes destruction and declining palace institutions. British farming landscapes belong to a different, longer sequence. This comparison shows uneven change; it does not establish one event or cause across Europe.',
        citations: [
          ref(
            'completion-mycenaean',
            'Final paragraph: late thirteenth-century destructions',
          ),
          ref('completion-british-bronze', 'Bronze Age chronology and settlement'),
        ],
      },
    ],
  },
  {
    id: 'C2-R4',
    chapter: 'C2',
    region: 'West/Central Asia',
    title: 'Hattusha and Uluburun: institutions on land and cargo at sea',
    question: 'How can a city and a shipwreck reveal different kinds of organization?',
    summary: section(
      'A capital and a cargo assemblage',
      'Hattusha’s palace, temples and archives reveal institutions within an Anatolian capital. The Uluburun wreck preserves a dated cargo off the southern coast of Anatolia. A city’s accumulated buildings and a ship’s lost load are different kinds of evidence, even when they belong within overlapping broad histories.',
      ref('hattusha-dai', 'Project overview: capital and cult centre'),
      ref('uluburun', 'Site and cargo overview'),
    ),
    sections: [
      section(
        'A cargo is not a complete trade network',
        'The wreck’s varied goods support questions about supply, loading and maritime exchange. They do not recover every port visited, the identity of all people aboard or a single merchant’s itinerary. Hattusha’s institutional evidence cannot fill those missing details merely because both places belong in an eastern Mediterranean inquiry.',
        ref('uluburun', 'Cargo assemblage and geographic setting'),
        ref('hattusha-research', 'Abstract: chronological urban development'),
      ),
      section(
        'An institutional ending is not every resident’s ending',
        'The DAI overview frames Hattusha’s capital history approximately from 1650 to 1180 BCE and also describes later occupation. Composite city plans gather different phases. Around 1200 BCE, the broad capital frame is relevant; a precise citywide destruction date or a single cause cannot be inferred from that range.',
        ref('hattusha-dai', 'Capital frame and later occupation'),
        ref('hattusha-research', 'Abstract'),
      ),
    ],
    perspectives:
      'Palace records favour institutional concerns, while a wreck records a loss. Neither gives an ordinary household census or a full account from the people who moved the goods.',
    scope:
      'Anatolian and maritime settings, not all West or Central Asia. The disputed drought/collapse causal claim is not used to fill this orientation; cargo origins and routes retain the dossier’s qualifications.',
    contextIds: ['hattusha-capital-context', 'uluburun-exchange-context'],
    subjectIds: ['hattusha-change', 'uluburun'],
    activity: {
      prompt:
        'A cargo contains materials from different regions. What does that support, and what additional evidence would be needed to draw a ship’s route?',
      response:
        'It supports circulation and assembly of goods. A route needs evidence for particular ports and voyage stages; a material’s origin alone cannot show each intermediate stop or identify the crew.',
    },
    snapshots: [
      {
        orientation: 'C2-R4',
        region: 'West/Central Asia',
        year: -1200,
        text: 'Around 1200 BCE lies near the end of Hattusha’s broad capital-era frame. Its buildings represent multiple phases. Uluburun’s earlier cargo provides a separate exchange comparison, not a shipwreck dated to this selected year or proof of one cause of political change.',
        citations: [
          ref('hattusha-dai', 'Capital frame c1650–1180 BCE'),
          ref('uluburun', 'Late Bronze Age wreck date'),
        ],
      },
    ],
  },
  {
    id: 'C2-R5',
    chapter: 'C2',
    region: 'South Asia',
    title: 'After major Indus cities: different settlement histories',
    question: 'How can we follow change without extending an earlier city’s lifespan?',
    summary: section(
      'Dholavira and Bhagwanpura',
      'Dholavira’s changing urban layout belongs to a long occupation ending before this chapter’s 1200 BCE snapshot. Bhagwanpura, in the Kurukshetra district, supplies a separately dated village sequence. Reading the two together shifts attention from a single urban ending to differently situated communities.',
      ref('dholavira', 'Description and criterion (iii)'),
      ref('orientation-bhagwanpura', 'Printed p43: Bhagwanpura sequence'),
    ),
    sections: [
      section(
        'Pottery changes within an occupied place',
        'Kenoyer summarizes Bhagwanpura’s Late Harappan phase as 1700–1300 BCE and its Painted Grey Ware phase as 1400–1000 BCE. Some layers contain both pottery traditions. Their overlap supports investigation of local change and interaction rather than a simple empty interval between two named cultures.',
        ref('orientation-bhagwanpura', 'Printed p43: chronology and mixed layers'),
      ),
      section(
        'A material label does not identify a language',
        'The chapter describes changing pottery and differently shaped houses. It also cautions that pottery cannot determine the inhabitants’ language or religion. Earlier urban water systems at Dholavira remain a useful comparison for practical organization, but they cannot be assigned to Bhagwanpura or carried forward to 1200 BCE.',
        ref(
          'orientation-bhagwanpura',
          'Printed p43: houses and limits of linguistic/religious identification',
        ),
        ref('dholavira', 'Water management and site range'),
      ),
    ],
    perspectives:
      'Settlement remains expose household activities without supplying individual testimony. Archaeological classifications are not direct statements of how inhabitants named themselves.',
    scope:
      'Two separately dated settings. Bhagwanpura’s dates follow the cited scholarly synthesis of the excavation; the entire excavation report has not been reviewed. Textual epic identification and racial interpretations are not adopted.',
    contextIds: ['dholavira-urban-context'],
    subjectIds: ['dholavira'],
    activity: {
      prompt:
        'Why can mixed pottery in a layer support a question about interaction without proving that everyone spoke the same language?',
      response:
        'The layer associates material traditions in a particular context. Speech and religious identity require different evidence. Also retain the possibility that deposit formation affects associations rather than assigning each pot to a distinct ethnic group.',
    },
    snapshots: [
      {
        orientation: 'C2-R5',
        region: 'South Asia',
        year: -1200,
        text: 'Around 1200 BCE falls within the cited 1400–1000 BCE Bhagwanpura phase. It is a later village setting, separate from Dholavira’s earlier urban occupation. The phase range does not date every house or pottery change to this exact year.',
        citations: [
          ref('orientation-bhagwanpura', 'Printed p43: site-specific phase chronology'),
          ref('dholavira', 'Description: occupation range'),
        ],
      },
    ],
  },
  {
    id: 'C2-R6',
    chapter: 'C2',
    region: 'East Asia',
    title: 'Yin Xu: craft, divination and royal institutions',
    question: 'What do royal records reveal, and whose experience do they leave out?',
    summary: section(
      'A focused late-Shang setting',
      'Yin Xu near Anyang contains palace and ancestral-shrine areas, tombs and evidence of specialized craft. Oracle-bone inscriptions preserve particular questions and divinatory practices. These records open a view into royal institutions; they do not represent all communities across East Asia.',
      ref('shang-yinxu', 'Description and Brief synthesis'),
      ref('shang-divination', 'Oracle bone and Shang divination'),
    ),
    sections: [
      section(
        'Objects and inscriptions answer different questions',
        'A bronze vessel can expose choices of form, casting and use in ritual settings. An oracle inscription records a different activity: posing and interpreting a divinatory question. The selected museum objects have their own catalogue attributions; neither should be assigned to a particular excavated tomb without provenance evidence.',
        ref('met-44781', 'Description, Date and Culture'),
        ref('met-42045', 'Description and catalogue attribution'),
      ),
      section(
        'The late capital is not the entire dynasty',
        'UNESCO dates Yin Xu’s late-capital frame to about 1300–1046 BCE. The broader Shang convention starts earlier. A change in dynasty around 1046 BCE should therefore be kept apart from transformations around 1200 BCE in distant Anatolia and the Aegean.',
        ref('shang-yinxu', 'Description: late-capital dates'),
        ref('shang-zhou', 'Shang and Zhou chronology'),
      ),
    ],
    perspectives:
      'Royal tombs and divination records favour court priorities. The labour of makers is visible through production, while ordinary residents’ own narratives remain much harder to recover.',
    scope:
      'A justified local focus: shrine, burial and craft contexts at one late capital let us compare evidence types closely. This does not claim continuous coverage of every East Asian region or dynasty.',
    contextIds: ['shang-centres-context'],
    subjectIds: ['shang-ritual'],
    activity: {
      prompt:
        'Compare what a vessel’s manufacture and an inscribed question can tell you. Name one thing neither establishes about an ordinary family.',
      response:
        'Manufacture can reveal materials and skilled production; an inscription can reveal a recorded institutional concern. Neither alone establishes an ordinary family’s diet, political choices or access to those objects.',
    },
    snapshots: [
      {
        orientation: 'C2-R6',
        region: 'East Asia',
        year: -1200,
        text: 'Around 1200 BCE lies within Yin Xu’s late-Shang capital frame. Palace, shrine, tomb and divination evidence offer related but distinct views of institutions. The later Shang–Zhou transition is not moved back to this snapshot date.',
        citations: [
          ref('shang-yinxu', 'Description: c1300–1046 BCE'),
          ref('shang-zhou', 'Shang–Zhou chronology'),
        ],
      },
    ],
  },
  {
    id: 'C2-R7',
    chapter: 'C2',
    region: 'Southeast Asia/Oceania',
    title: 'Kuk, An Sơn and Lapita: sequences across land and sea',
    question:
      'Why must farming, burial and island-settlement evidence keep separate dates?',
    summary: section(
      'Three independent archaeological settings',
      'Kuk’s highland cultivation history, An Sơn’s mainland settlement and burial sequence, and Lapita pottery in island communities preserve different activities. Bringing them together broadens the regional view without making them stages of one migration or one economy.',
      ref('completion-kuk-sequence', 'Table 1.2'),
      ref('orientation-an-son', 'Chronology'),
      ref('lapita-voyaging', 'Regional sequence'),
    ),
    sections: [
      section(
        'Local deposits record different work',
        'Kuk’s ditch networks concern water control. At An Sơn, occupation layers and later burials require separate dating. Pottery in Lapita settings can instead help investigate manufacture and circulation among island communities. Similar broad dates do not demonstrate that people at all three places followed the same farming or settlement practices.',
        ref('completion-kuk-ditches', 'Summary'),
        ref('orientation-an-son', 'Chronology: occupation and burial phases'),
        ref('lapita', 'Pottery and geographic distribution'),
      ),
      section(
        'Island sequences cannot be backdated as a group',
        'The institutional account places Lapita emergence in the Bismarcks around 1500 BCE and a broad movement toward Remote Oceania around 1100–800 BCE. Particular Tongan sites have their own modeled dates. The earlier part of this chapter must not be filled with later Tongan settlement evidence.',
        ref('lapita-voyaging', 'Opening; Lapita in Remote Oceania'),
        ref('lapita-tonga-dating', 'Bayesian Overlap Model and Discussion'),
      ),
    ],
    perspectives:
      'Archaeological evidence records actions through deposits and objects. It does not recover the identities of every cultivator, potter or voyager, and modern descendant communities are not interchangeable.',
    scope:
      'Selected highland, mainland and island histories. Overlapping intervals are not an established route linking Kuk, An Sơn and every Lapita settlement.',
    contextIds: ['kuk-wetland-context', 'lapita-islands-context'],
    subjectIds: ['lapita'],
    activity: {
      prompt:
        'A map labels every Lapita island as settled by 1200 BCE. Explain how you would check and revise it.',
      response:
        'Compare each island’s dated settlement evidence with the regional overview. Do not use the early Bismarck frame to backdate Tonga or every other island. Mark unverified or later local sequences separately.',
    },
    snapshots: [
      {
        orientation: 'C2-R7',
        region: 'Southeast Asia/Oceania',
        year: -1200,
        text: 'Around 1200 BCE belongs within the broad Bismarck Lapita frame and near the later boundary of An Sơn’s selected burial sequence. Remote Oceanian settlement and individual Tongan sites require their own later or overlapping dates. This snapshot does not establish one contemporaneous chain of settled islands.',
        citations: [
          ref('lapita-voyaging', 'Bismarck emergence and Remote Oceania 1100–800 BCE'),
          ref(
            'orientation-an-son',
            'Chronology: burials approximately 1500–1200 cal BCE',
          ),
        ],
      },
    ],
  },
];
export function applyC2Orientations(corpus: Corpus) {
  corpus.sources.push({
    id: 'orientation-bhagwanpura',
    title: 'Cultures and Societies of the Indus Tradition',
    author: 'Jonathan Mark Kenoyer',
    institution: 'Harappa Archaeological Research Project / Harappa.com',
    type: 'archaeology',
    accessed: '2026-11-04',
    url: 'https://www.harappa.com/sites/default/files/pdf/CulturesSocietiesIndusTrad.pdf',
    scope:
      'Selected printed p43 (PDF page23) consulted for the Bhagwanpura chronology, pottery overlap, houses and limits of identifying language or religion. A scholarly synthesis citing Joshi 1993, not fresh review of the complete original excavation. Broader genetic, migration, epic and ritual identifications are not adopted. No images reproduced.',
  });
  (corpus.orientations ??= []).push(...structuredClone(c2Orientations));
}
