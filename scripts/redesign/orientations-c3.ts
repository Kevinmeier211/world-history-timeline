import { addSourceConsultation } from './content-helpers';
import type {
  Corpus,
  RegionalOrientation,
  Section,
  Source,
} from '../../src/atlas/model';
const ref = (source: string, locator: string) => ({ source, locator });
const section = (
  title: string,
  text: string,
  ...citations: Section['citations']
): Section => ({ title, text, citations });
const sources: Source[] = [
  {
    id: 'orientation-meroe',
    title: 'Archaeological Sites of the Island of Meroe',
    institution: 'UNESCO World Heritage Centre',
    type: 'archaeology',
    accessed: '2026-11-04',
    url: 'https://whc.unesco.org/en/list/1336/',
    scope:
      'English Brief synthesis and Authenticity consulted: three settings, production, water management and the third-century BCE royal-burial transition. Composite remains are not all dated to 300 BCE; no claim that all Kushite rule of Egypt was based at Meroe. Civilizational disappearance and ranking rhetoric not adopted. No images reproduced.',
  },
  {
    id: 'orientation-achaemenid',
    title: 'The Achaemenid Persian Empire (550–330 B.C.)',
    institution: 'The Metropolitan Museum of Art',
    type: 'scholarship',
    accessed: '2026-11-04',
    url: 'https://www.metmuseum.org/essays/the-achaemenid-persian-empire-550-330-b-c',
    scope:
      'Selected paragraphs on roads, satraps, Susa/Persepolis, royal reliefs and conquest consulted. Reliefs treated as royal representation, not proof of unanimous consent. No images reproduced; unrelated military dates and priority claims not adopted.',
  },
  {
    id: 'orientation-hellenistic',
    title: 'Art of the Hellenistic Age and the Hellenistic Tradition',
    institution: 'The Metropolitan Museum of Art',
    author: 'Colette Hemingway and Seán Hemingway',
    type: 'scholarship',
    accessed: '2026-11-04',
    url: 'https://www.metmuseum.org/essays/art-of-the-hellenistic-age-and-the-hellenistic-tradition',
    scope:
      'Selected opening narrative paragraphs on Alexander’s death, successor kingdoms, Greek alliances and patronage; later paragraph on first-century BCE Rome. Not every later dynasty assigned to 300 BCE; no universal cultural replacement, unconsulted excavation or image reuse.',
  },
  {
    id: 'orientation-warring-states',
    title: 'China, 1000 B.C.–1 A.D.',
    institution: 'The Metropolitan Museum of Art',
    type: 'scholarship',
    accessed: '2026-11-04',
    url: 'https://www.metmuseum.org/toah/ht/04/eac.html',
    scope:
      'Timeline, 770 BCE entry, c400–200 BCE Chu art entry and Western Han entry consulted. Warring States 475–221 BCE and Qin 221–206 follow the timeline. The erroneous 206 BCE heading introducing Qin in Key Events is explicitly not adopted; Chu geographic wording, modern-border equivalence and artistic priority claims not adopted.',
  },
];
export const c3Orientations: RegionalOrientation[] = [
  {
    id: 'C3-R1',
    chapter: 'C3',
    region: 'Americas',
    title: 'Ceremonial places and the histories of particular objects',
    question:
      'How do we connect a portable image to a place without inventing its findspot?',
    summary: section(
      'Chavín and Gulf Coast centres',
      'Chavín’s galleries, plazas and carved imagery offer one Andean ceremonial setting. San Lorenzo and La Venta offer distinct Gulf Coast histories of earth building and offerings. Comparing them asks how objects and built spaces shaped collective activity, without proposing one American religion or a connection demonstrated by resemblance alone.',
      ref('chavin-center-unesco', 'Brief synthesis: galleries, plazas and imagery'),
      ref('olmec', 'San Lorenzo and La Venta'),
    ),
    sections: [
      section(
        'An object travels with a different record',
        'The selected Chavín-style textile is a museum object with its own attribution and date. It is not automatically an excavated furnishing from the highland ceremonial centre. Likewise, a regional ceramic attribution does not place the selected Olmec figure in a known San Lorenzo household. Object catalogues and site histories must be linked with evidence, not just a shared label.',
        ref('met-315784', 'Artwork Details and attribution'),
        ref('met-314609', 'Artwork Details: geography and date'),
      ),
      section(
        'A coastal setting at the later date',
        'For around 300 BCE, the Met’s Andean chronology describes Paracas Peninsula burials wrapped in layers of cloth and embroidered textiles. This is a coastal funerary setting with its own evidence. It supplies a dated comparison without extending the Chavín centre’s disputed endpoint or assigning the selected museum textile to a Paracas burial.',
        ref('chavin-center-met-chronology', 'Key Events c300 BCE: funerary bundles'),
      ),
      section(
        'Different endpoints change a snapshot',
        'UNESCO’s Chavín Description uses 1500–300 BCE, while its Brief synthesis gives the fifteenth through fifth centuries BCE. The discrepancy remains visible. The Gulf Coast account describes changes in prominent centres and continuing production elsewhere. Neither account supports the disappearance of every community at a single boundary.',
        ref('chavin-center-unesco', 'Description versus Brief synthesis'),
        ref('olmec', 'La Venta and subsequent production'),
      ),
    ],
    perspectives:
      'Ceremonial architecture and collected objects favour durable, selected remains. The people who made textiles, carried materials or maintained spaces are not represented by a complete set of personal accounts.',
    scope:
      'Two named regional settings, with later Colima as a separate reading destination. The Chavín date conflict is unresolved; a broad cultural label cannot settle the chronology of every building.',
    contextIds: [
      'chavin-images-context',
      'olmec-centres-context',
      'colima-funerary-communities-context',
    ],
    subjectIds: ['chavin-textile', 'olmec', 'colima'],
    activity: {
      prompt:
        'A caption places the museum textile inside Chavín’s temple in 300 BCE. Identify the two independent evidence checks that caption needs.',
      response:
        'Check excavation provenance before assigning the textile to the temple, and check its own date against the site’s conflicting chronology. Stylistic similarity alone supplies neither a findspot nor a precise year.',
    },
    snapshots: [
      {
        orientation: 'C3-R1',
        region: 'Americas',
        year: -300,
        text: 'Around 300 BCE, the museum chronology describes textile-wrapped burials on the Paracas Peninsula. This coastal setting supplies a dated comparison. Chavín’s conflicting summary endpoints remain unresolved; the selected museum textile is not assigned to a Paracas burial, and the later Colima case is not backdated.',
        citations: [
          ref('chavin-center-met-chronology', 'Key Events c300 BCE: funerary bundles'),
          ref('chavin-center-unesco', 'Description and Brief synthesis'),
          ref('met-317600', 'Date and catalogue attribution'),
        ],
      },
    ],
  },
  {
    id: 'C3-R2',
    chapter: 'C3',
    region: 'Africa',
    title: 'Kushite institutions from Kawa to the Meroe region',
    question:
      'How can temples, workshops and burial places reveal changes in royal organization?',
    summary: section(
      'Several centres, separate histories',
      'Taharqo’s temple projects at Kawa and Sanam belong to an earlier Kushite royal setting. Meroe, Naqa and Musawwarat es-Sufra provide a broader view of urban, religious and productive spaces. Their remains span many centuries and should not be collapsed into one ruler’s reign.',
      ref('kawa-work-2024', 'Printed pp132–133: Kawa work crews'),
      ref('orientation-meroe', 'Brief synthesis: three components'),
    ),
    sections: [
      section(
        'Royal claims and working materials',
        'Kawa’s inscriptions claim arrangements for craftspeople and construction. Those are royal statements about work, not the workers’ own testimony. The later Meroe-region evidence includes production and water installations as well as temples and tombs, widening the questions beyond the image of a king alone.',
        ref('kawa-work-2024', 'Printed pp132–133: royal construction account'),
        ref('orientation-meroe', 'Brief synthesis: production and reservoirs'),
      ),
      section(
        'A change of burial centre is not a single population move',
        'UNESCO places most royal burials at Meroe from the third century BCE onward. That transition comes long after Taharqo’s reign. It helps orient a change in royal practice, but does not date every monument or imply that all households moved at once.',
        ref('orientation-meroe', 'Brief synthesis: third-century BCE burials'),
        ref('met-544883', 'Taharqo reign and shabti date'),
      ),
    ],
    perspectives:
      'Monuments and royal inscriptions foreground rulers. Workshops and water systems make other work visible, while leaving individual obligations and experiences incompletely recorded.',
    scope:
      'Selected Nile and Kushite centres. No claim that all surviving Meroe-region monuments already existed in 300 BCE; the earlier shabti retains its own date and probable provenance.',
    contextIds: ['kushite-temple-work-context'],
    subjectIds: ['taharqo'],
    activity: {
      prompt:
        'Explain why a royal inscription and an excavated workshop might support different statements about a building project.',
      response:
        'An inscription records what a ruler claimed to organize. Workshop remains support particular production activities. Use both while keeping the royal voice, archaeological interpretation and missing workers’ testimony distinct.',
    },
    snapshots: [
      {
        orientation: 'C3-R2',
        region: 'Africa',
        year: -300,
        text: 'Around 300 BCE marks the approach to the third-century BCE shift toward most royal burials at Meroe in UNESCO’s account. It is a broad transition marker, not an exact relocation event. Taharqo’s seventh-century BCE objects are earlier comparisons.',
        citations: [
          ref('orientation-meroe', 'Brief synthesis: royal-burial chronology'),
          ref('met-544883', 'Date'),
        ],
      },
    ],
  },
  {
    id: 'C3-R3',
    chapter: 'C3',
    region: 'Europe',
    title: 'Public work and power in changing Greek settings',
    question: 'Is using public space the same as having a share in government?',
    summary: section(
      'Athens and the later Hellenistic world',
      'Athenian water carrying brings household work into public space. Formal civic participation followed narrower rules. Later Hellenistic kingdoms and alliances place those questions within changing political settings, rather than extending one version of Athenian democracy across all Greek communities.',
      ref('agora-women', 'Printed pp7–11'),
      ref('athens-constitution', 'Parts42–43'),
      ref('orientation-hellenistic', 'Successor kingdoms and Greek alliances'),
    ),
    sections: [
      section(
        'Necessary work and political eligibility differ',
        'The hydria’s fountain scene can prompt questions about obtaining water. Literary and archaeological interpretation includes both free and enslaved women in public activity. The constitutional account’s male civic enrollment rules answer a different question: who could qualify for particular political roles.',
        ref('met-247244', 'Description and date'),
        ref('agora-women', 'Printed pp7–11'),
        ref('athens-constitution', 'Part42'),
      ),
      section(
        'Patronage shifts with political settings',
        'After Alexander’s death in 323 BCE, successor rulers and Greek alliances shaped a different political landscape. Royal commissions supported buildings, sculpture and luxury production. Later, Rome became another centre employing Greek artists. These changes in patrons do not establish an identical experience for every craft worker.',
        ref(
          'orientation-hellenistic',
          'Opening chronology; patronage; first-century BCE Rome',
        ),
      ),
    ],
    perspectives:
      'The evidence separates people doing essential work from the narrower categories represented in political institutions. Images and official descriptions do not recover every excluded person’s experience.',
    scope:
      'Athens is the close local inquiry; Hellenistic kingdoms and later Rome are dated comparisons. The sixth-century BCE jar is not a direct view of public life in 300 BCE.',
    contextIds: ['athens-civic-work-context'],
    subjectIds: ['athens-water'],
    activity: {
      prompt:
        'Give one reason a person might be visible at a public fountain but absent from a list of eligible political participants.',
      response:
        'Public work and residence do not by themselves establish the citizenship, status, age or gender eligibility described for particular institutions. A strong response distinguishes the image’s subject from the constitutional rule.',
    },
    snapshots: [
      {
        orientation: 'C3-R3',
        region: 'Europe',
        year: -300,
        text: 'Around 300 BCE falls after Alexander’s death and within the emerging Hellenistic political setting. Earlier Athenian objects and institutional descriptions offer comparisons, not proof that every Greek city retained the same arrangements at this date.',
        citations: [
          ref('orientation-hellenistic', '323 BCE and successor kingdoms'),
          ref('met-247244', 'Date: c510–500 BCE'),
        ],
      },
    ],
  },
  {
    id: 'C3-R4',
    chapter: 'C3',
    region: 'West/Central Asia',
    title: 'Royal centres and the work of governing across distance',
    question:
      'How do buildings and images present power differently from administrative arrangements?',
    summary: section(
      'Nimrud, Susa and Persepolis',
      'Nimrud’s palace reliefs present an Assyrian royal setting. Later Achaemenid building at Susa and Persepolis presents another imperial history. Their images help investigate how rulers represented power, while roads, governors and palace work raise practical questions about maintaining institutions.',
      ref('nimrud', 'Northwest Palace'),
      ref('orientation-achaemenid', 'Darius: roads, satraps and building projects'),
    ),
    sections: [
      section(
        'An image of agreement is a claim',
        'At Persepolis, reliefs show people from different parts of the empire approaching or supporting the king. The arrangement presents imperial order. It cannot establish that every represented community agreed with the ruler or that obligations were experienced equally.',
        ref(
          'orientation-achaemenid',
          'Persepolis reliefs and the impression of harmony',
        ),
      ),
      section(
        'Successor kingdoms need a new date frame',
        'Alexander’s conquest ended Achaemenid rule; after his death, successor kingdoms emerged, including the Seleucids in the Near East. The 300 BCE setting therefore cannot be represented simply by extending Ashurnasirpal II’s Nimrud or the Achaemenid court into the future.',
        ref('orientation-achaemenid', 'Darius III and Alexander'),
        ref('orientation-hellenistic', 'Opening: division and Seleucids'),
      ),
    ],
    perspectives:
      'Royal monuments privilege the court’s desired image. Labour, tribute and administration involved people whose perspectives are only partly recoverable through those monuments.',
    scope:
      'Selected royal centres and a successor-era orientation, not a complete West/Central Asian history. Similar palace imagery does not prove identical institutions or unbroken dynastic continuity.',
    contextIds: ['nimrud-government-context'],
    subjectIds: ['nimrud-palace'],
    activity: {
      prompt:
        'A relief depicts orderly tribute bearers. Write one observation and one claim that the relief cannot establish on its own.',
      response:
        'Observe the represented arrangement and figures. Do not treat the image as evidence of universal consent or equal obligations; those require other records and perspectives.',
    },
    snapshots: [
      {
        orientation: 'C3-R4',
        region: 'West/Central Asia',
        year: -300,
        text: 'Around 300 BCE belongs to the successor-kingdom setting after Alexander, including Seleucid power in the Near East. The Assyrian and Achaemenid palace readings are earlier institutional comparisons, not courts still ruling at this date.',
        citations: [
          ref('orientation-hellenistic', 'Opening: successors and Seleucids'),
          ref('orientation-achaemenid', 'End of Achaemenid rule'),
        ],
      },
    ],
  },
  {
    id: 'C3-R5',
    chapter: 'C3',
    region: 'South Asia',
    title: 'Mauryan government before and during Ashoka',
    question:
      'How does an official message differ from evidence that its instructions were followed?',
    summary: section(
      'Pataliputra and audiences farther away',
      'Candragupta Maurya established rule from Pataliputra before Ashoka’s reign. Later inscriptions carried Ashoka’s policies to differently situated audiences, including Greek and Aramaic material at Kandahar. A capital, a message and its recipients are related but distinct parts of government.',
      ref('ashoka', 'Opening dynastic history; languages and inscriptions'),
    ),
    sections: [
      section(
        'Messages needed language, materials and people',
        'Writing in different languages made official messages available in different settings. It did not mean that everyone could read them or that officials carried out every instruction. The linked edicts let readers inspect specific announced actions and compare royal ideals with the practical problem of implementation.',
        ref('ashoka', 'Prakrit, Greek and Aramaic messages'),
        ref(
          'ashoka-edicts-1925',
          'Girnar II, printed pp3–4; Dhauli Separate I, pp95–97',
        ),
      ),
      section(
        'Do not backdate the later ruler',
        'The university account places Candragupta’s transfer of power to Bindusara around 297–298 BCE and Ashoka’s reign around 268–232 BCE. The 300 BCE snapshot therefore precedes Ashoka’s inscriptions. Later evidence can illuminate a developing institution without becoming contemporary evidence for its earlier phase.',
        ref('ashoka', 'Candragupta–Bindusara succession; Ashoka chronology'),
      ),
    ],
    perspectives:
      'Royal proclamations preserve the ruler’s chosen presentation. Recipients, officials and communities could have different experiences that the inscription itself does not settle.',
    scope:
      'A justified institutional focus connecting a capital and differently addressed borderland messages. Not all South Asian communities were governed or addressed in the same way; later religious traditions remain distinct from contemporary inscriptions.',
    contextIds: ['mauryan-messages-context'],
    subjectIds: ['ashoka-messages'],
    activity: {
      prompt:
        'An edict announces wells along roads. What is the difference between proving the announcement and proving its full implementation?',
      response:
        'The inscription supports that the ruler announced the policy. Dating and examining wells, administrative records and local evidence would be needed to assess where and how it was implemented.',
    },
    snapshots: [
      {
        orientation: 'C3-R5',
        region: 'South Asia',
        year: -300,
        text: 'Around 300 BCE belongs to the early Mauryan setting under Candragupta, shortly before the source’s approximate transfer to Bindusara. Ashoka’s later inscriptions are a next reading, not evidence already issued at this snapshot date.',
        citations: [
          ref(
            'ashoka',
            'Opening paragraphs: succession c297–298 BCE; Ashoka c268–232 BCE',
          ),
        ],
      },
    ],
  },
  {
    id: 'C3-R6',
    chapter: 'C3',
    region: 'East Asia',
    title: 'From competing states to imperial administration',
    question:
      'What changes when rules and records must work across a larger territory?',
    summary: section(
      'Qin, Chu and later imperial centres',
      'The Warring States frame includes competing polities rather than a single Qin empire. Chu’s lacquer and silk-painting evidence adds a distinct setting to the later Qin administrative inquiry. Court histories, craft objects and local records each expose different activities.',
      ref('orientation-warring-states', 'Timeline; 770 BCE and c400–200 BCE entries'),
    ),
    sections: [
      section(
        'Common rules required practical handling',
        'The later Qin inquiry compares devices for measuring different quantities and wood documents used in county administration. The Liye records show that applying common requirements still involved choices about materials, layout and handling. A decree and its local paperwork need to be studied together.',
        ref('qin-measure', 'Description and decree date'),
        ref('qin-practice', 'Printed pp. 147–153 and 169–170'),
      ),
      section(
        'The empire follows the snapshot',
        'The museum’s Warring States convention runs from 475 to 221 BCE; imperial Qin follows in 221–206 BCE. Western Han then developed its capital at Chang’an. These changes do not make the later documents, tombs or capital features contemporary with 300 BCE.',
        ref('orientation-warring-states', 'Timeline; Western Han entry'),
        ref('qin', 'Dynastic title and administration'),
      ),
    ],
    perspectives:
      'Administrative documents preserve tasks and categories useful to officials. Craft and material choices reveal other work, while leaving many workers’ own accounts unrecorded.',
    scope:
      'Selected Chinese state and administrative settings, not all East Asia. The museum chronology’s inconsistent Qin Key Events heading is not adopted; its timeline and separate Qin essay establish the imperial dates.',
    contextIds: ['qin-state-context'],
    subjectIds: ['qin-administration'],
    activity: {
      prompt:
        'Explain why a later imperial measuring device cannot demonstrate that all states used one system in 300 BCE.',
      response:
        'Its date belongs to the later imperial frame. Establishing earlier uniformity would require contemporary evidence across the separate states, not a backward projection from an imperial decree.',
    },
    snapshots: [
      {
        orientation: 'C3-R6',
        region: 'East Asia',
        year: -300,
        text: 'Around 300 BCE lies within the Warring States period, before imperial Qin. Chu and Qin provide distinct political settings; the later standardization and Liye paperwork are comparisons across a transition, not documents from this selected year.',
        citations: [
          ref('orientation-warring-states', 'Timeline:475–221 BCE; Chu entry'),
          ref('qin-practice', 'Liye document dates, printed pp147–153'),
        ],
      },
    ],
  },
  {
    id: 'C3-R7',
    chapter: 'C3',
    region: 'Southeast Asia/Oceania',
    title: 'Bronze deposits and changing island pottery traditions',
    question:
      'Why does a change in objects not automatically mean the disappearance of a people?',
    summary: section(
      'Vietnamese contexts and Tongan sequences',
      'Đông Sơn-associated drums occur in different kinds of deposits. Tonga’s earlier decorated pottery and later plainware provide a separate island history. Comparing them makes the relationship between an object category, a dated deposit and a community an explicit question.',
      ref('dongson-vnmh-2014', 'Regional cultural overview'),
      ref('lapita-tonga-ceramic-change', 'Abstract; Discussion'),
    ),
    sections: [
      section(
        'Find context changes the question',
        'A drum containing tools at Cổ Loa and a drum associated with a wooden container at Phú Chánh do not provide identical evidence of use. The small museum drum has another collection history. Their dates and contexts must be established independently before drawing conclusions about shared ritual or ordinary work.',
        ref('dongson-co-loa-2021', 'Find context'),
        ref('dongson-phu-chanh-2008', 'Printed pp67,69–70,72'),
        ref('met-39209', 'Description and catalogue attribution'),
      ),
      section(
        'A ceramic endpoint is not a human endpoint',
        'The Tongan study argues that ceramic manufacture had ceased by about 400 BCE after a period of plainware production. That is a claim about a material practice. It does not establish the end of settlement or the disappearance of island communities, and it cannot be used as a uniform Pacific boundary.',
        ref(
          'lapita-tonga-ceramic-change',
          'Abstract; Discussion: latest phase boundary',
        ),
      ),
    ],
    perspectives:
      'Objects preserve selected activities and deposits. Neither a museum classification nor the absence of later pottery gives a full account of how people identified themselves.',
    scope:
      'Separate mainland and island comparisons, with no contact inferred between them. Later Phú Chánh and Luy Lâu evidence is not moved into the 300 BCE snapshot; it remains available in the dossier with its own dates.',
    contextIds: ['dongson-selected-contexts', 'lapita-islands-context'],
    subjectIds: ['dongson', 'lapita'],
    activity: {
      prompt:
        'Rewrite “pottery stops, so the people vanished” using the evidence and one unanswered question.',
      response:
        'The study dates a change or end in ceramic manufacture. Ask what other settlement, food or material evidence could establish later community life; the pottery sequence alone cannot answer that question.',
    },
    snapshots: [
      {
        orientation: 'C3-R7',
        region: 'Southeast Asia/Oceania',
        year: -300,
        text: 'Around 300 BCE falls within the broad Đông Sơn-associated frame. Individual drums and deposits still need their own dates. In Tonga it is later than the study’s proposed end of pottery manufacture; that material boundary does not demonstrate that island communities ended.',
        citations: [
          ref('dongson-vnmh-2014', 'Cultural chronology'),
          ref(
            'lapita-tonga-ceramic-change',
            'Abstract and Discussion: manufacture ceased by c400 BCE',
          ),
        ],
      },
    ],
  },
];
export function applyC3Orientations(corpus: Corpus) {
  addSourceConsultation(
    corpus,
    'chavin-center-met-chronology',
    '2026-11-04',
    'Additional consultation 4 November 2026: Timeline and Key Events c300 BCE on Paracas funerary bundles. This older museum synthesis provides a bounded coastal comparison, not a new excavation model or a findspot for the selected Chavín-style textile.',
  );
  corpus.sources.push(...structuredClone(sources));
  (corpus.orientations ??= []).push(...structuredClone(c3Orientations));
}
