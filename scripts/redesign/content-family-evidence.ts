import type { Corpus, Journey } from '../../src/atlas/model';
import { cite } from './content-helpers';
/** Presentation of existing cited accounts, not a new historical consultation. */
const notes: Record<string, NonNullable<Journey['familyEvidence']>> = {
  'cities-evidence': {
    title: 'Read a record of grain',
    object: 'met-327384',
    text: 'The museum interprets this tablet as a probable account of barley and emmer, dated about 3100–2900 BCE. Missing verbs limit a precise reading. Visible marks and a catalogue interpretation supply different kinds of information.',
    citations: [cite('met-327384', 'Description and Artwork Details')],
    notice: [
      'Find a repeated mark.',
      'Separate what you see from the museum’s interpretation.',
    ],
    claimPrompt:
      'Explain what this tablet might record. What makes a precise reading uncertain?',
    returnPrompt: 'Name another record that could help identify a recipient.',
    feedback:
      'The marks survive; their precise meaning needs interpretation. A probable grain account does not identify every recipient or describe all household work.',
  },
  'networks-disruption': {
    claimPrompt:
      'Explain what was measured and what remains unproved about political decisions.',
    returnPrompt:
      'Name another source that could test a connection between drought and political decisions.',
    feedback:
      'The study supports severe environmental stress near a political transformation. It does not directly measure why leaders acted or prove a single cause.',
    title: 'Read a study summary',
    object: null,
    text: 'Researchers studied tree rings and carbon isotopes in juniper timbers from Gordion. They identified severe drought around 1198–1196 BCE, with ±3-year dating uncertainty. These measurements concern environmental conditions, rather than decisions made at Hattusha.',
    citations: [
      cite('hittite-drought', 'Printed pp. 719–722: Gordion, dating and causation'),
    ],
    notice: [
      'Name what was measured and where.',
      'What further evidence would help connect environmental stress with political decisions?',
    ],
  },
  'institutions-images': {
    claimPrompt:
      'Use the summary to explain why the photograph and the institution need different dates.',
    returnPrompt:
      'Find another example where a photograph’s date differs from the history it helps investigate.',
    feedback:
      'Earlier archaeology and the dated institution concern different things. A 2023 photograph does not turn conserved remains into one complete ancient moment.',
    title: 'Two dates for different things',
    object: 'nalanda-brick-photo',
    text: 'UNESCO distinguishes earlier remains at Nalanda from the fifth–thirteenth-century monastic and scholastic institution. This photograph records conserved brick remains in 2023; it does not show every building at one ancient moment.',
    citations: [cite('nalanda', 'Brief synthesis; Authenticity')],
    notice: [
      'Find walls and openings in the photograph.',
      'Which date belongs to a photograph, and which range describes an institution?',
    ],
  },
  'knowledge-networks': {
    claimPrompt:
      'Describe a visible pattern. Explain why regional comparisons do not establish this garment’s individual route.',
    returnPrompt:
      'Name one record that could help establish the tunic’s individual journey.',
    feedback:
      'Technical comparison supports connections among traditions. An individual route still needs provenance or other dated records.',
    title: 'Compare features without inventing a route',
    object: 'met-313152',
    text: 'The museum compares this tunic’s materials, construction and patterns with highland and coastal traditions. Its broad 1450–1550 date and regional comparisons do not name a weaver or reconstruct this garment’s individual journey.',
    citations: [cite('met-313152', 'Description and artwork details')],
    notice: [
      'Point to a pattern you can see.',
      'What would you need to establish this particular garment’s route?',
    ],
  },
  'ocean-connections': {
    claimPrompt:
      'Explain whose decisions this report describes and whose perspective you would seek next.',
    returnPrompt: 'Name another perspective you would seek before retelling the event.',
    feedback:
      'The letter can reveal company policy and resistance. Its official’s perspective does not replace the experiences of people attacked.',
    title: 'Read a company official’s report',
    object: null,
    text: 'Coen wrote to the Dutch East India Company’s directors on 6 May 1621. The archive’s transcription describes resistance, food and company manpower, including the use of hunger against opponents. An official reported his own decisions to superiors.',
    citations: [cite('banda-archive', 'Coen letter; VOC 1.04.02, inventory 1073')],
    notice: [
      'Who wrote the report, and for whom?',
      'Whose account would you add before telling the whole history?',
    ],
  },
  'war-signals': {
    claimPrompt: 'Choose two dates and explain the different histories they mark.',
    returnPrompt: 'Retell two of these histories with their own dates and meanings.',
    feedback:
      'War in Asia, war in Europe and the Holocaust have connected but distinct chronologies. One date cannot stand for all of them.',
    title: 'Read the dates separately',
    object: null,
    text: 'USHMM describes Japan’s 1931 conquest of Manchuria, its 1937 invasion of China and Germany’s September 1939 invasion of Poland. The Holocaust has a distinct 1933–1945 frame. These connected histories do not share one starting date.',
    citations: [
      cite('ww2', 'German and Japanese Expansion; Invasion of Poland'),
      cite('holocaust', 'Definition and chronology'),
    ],
    notice: [
      'Put the dates in order, keeping their different meanings.',
      'Explain why one region’s starting date cannot describe all these histories.',
    ],
  },
  'north-american-communities': {
    claimPrompt:
      'Name one study finding and explain why it cannot show what every household drank.',
    returnPrompt:
      'What additional samples or records could help investigate who had access to cacao?',
    feedback:
      'Selected fragments support cacao use and ingredient movement. They do not establish universal access, an exact route or the purpose of every room.',
    title: 'A building photograph and a separate study',
    object: 'chaco-corner-door',
    text: 'A 2009 study tested fragments representing five Pueblo Bonito vessels. Three probable cylinder-jar samples yielded theobromine, interpreted as cacao evidence. This is a selected sample. The architecture photograph is not a picture of the tested fragments or the chemical analysis.',
    citations: [cite('chaco-cacao', 'Sample selection and results, pp. 2110–2112')],
    notice: [
      'Separate what the photograph shows from what the study measured.',
      'Could these samples establish what every household drank?',
    ],
  },
  'west-central-workshops': {
    claimPrompt:
      'Explain why the carpet and the relocation account answer different questions about work and freedom.',
    returnPrompt: 'Name a source that could reveal one worker’s choices.',
    feedback:
      'Later trade cannot make the 1604 deportation voluntary. A carpet does not identify every worker’s freedom or circumstances.',
    title: 'Craft and movement need different evidence',
    object: 'met-451028',
    text: 'Ghougassian describes forced Armenian relocation in 1604 and settlement at New Julfa in 1605. Later commercial importance does not make that movement voluntary. The carpet shows costly craft; it is not a record of every worker’s freedom.',
    citations: [
      cite('julfa-forced', 'Origin, settlement and population, 1604–1605'),
      cite('met-451028', 'Description and production centers'),
    ],
    notice: [
      'Describe a feature of the carpet.',
      'Which separate source would you use to explain the forced relocation?',
    ],
  },
  'northern-knowledge': {
    claimPrompt:
      'Name one task from each community. What can the photograph alone leave unknown?',
    returnPrompt: 'Seek a community-authored source about one chosen task.',
    feedback:
      'Makah cedar work and Hidatsa gardens concern distinct communities. A later photograph cannot alone establish all their practices or prove contact.',
    title: 'Keep community accounts distinct',
    object: 'makah-loc-1910',
    text: 'A community-authored Hidatsa guide describes women’s gardening and storage. Makah accounts explain cedar work and canoe construction. This later photograph cannot show all those tasks or make the communities one people.',
    citations: [
      cite('knife-subsistence', 'Women’s Influence; Food Storage'),
      cite('makah-canoes', 'Makah Canoe Construction'),
    ],
    notice: [
      'Name the different communities in the source summary.',
      'Which tasks need evidence beyond this photograph?',
    ],
  },
  'eastern-woodlands': {
    claimPrompt:
      'Distinguish the signing date, ratification date and evidence needed to test a promise.',
    returnPrompt: 'Find a later record that could test one promise.',
    feedback:
      'Treaty clauses state commitments; later evidence is needed to test performance. Ratification alone establishes neither complete consent nor successful enforcement.',
    title: 'A written commitment needs an outcome inquiry',
    object: 'canandaigua-ratification',
    text: 'Canandaigua’s clauses state peace and land commitments. The treaty was signed in November 1794; this U.S. ratification instrument is dated January 1795. Recording and ratifying promises did not by themselves establish how every later official acted.',
    citations: [
      cite('canandaigua-archive', 'NAID 12013172: contents and recto'),
      cite('canandaigua-onondaga', 'Articles I–III and VII'),
    ],
    notice: ['Name what each date records.', 'What would help test one promise?'],
  },
  'voices-power': {
    title: 'A palace object in a museum',
    object: 'met-322614',
    text: 'The museum identifies a protective figure from Ashurnasirpal II’s palace at Nimrud, about 883–859 BCE. Its present museum setting differs from its original room. The surviving carving does not record every person’s response to it.',
    citations: [
      cite('met-322614', 'Description and Artwork Details'),
      cite('assyrian-court', 'Palace arrangement and gallery reconstruction'),
    ],
    notice: [
      'Describe a feature of the figure.',
      'What does the caption add about its setting?',
    ],
    claimPrompt:
      'Name the original setting. What further evidence would help establish how a person encountered this figure there?',
    returnPrompt:
      'Name a question about its makers or viewers that needs another source.',
    feedback:
      'Material, scale and setting can shape a message. The surviving relief does not reveal every maker’s circumstances or prove how all viewers understood it.',
  },
  'world-200': {
    title: 'One model, a wider inquiry',
    object: 'met-49519',
    text: 'The museum dates this pottery tower to the first–early third century and identifies a burial context. It is a model of architecture, not a surviving occupied home. Its range does not date it precisely to 200 CE.',
    citations: [cite('met-49519', 'Description; Period, Date and Medium')],
    notice: [
      'Point to a feature that resembles a building.',
      'Find the date range in the caption.',
    ],
    claimPrompt:
      'Describe a building feature. Explain why this model cannot show what every household’s home looked like.',
    returnPrompt: 'Find another dated model before making a comparison.',
    feedback:
      'A burial model raises questions about buildings and representation. Another place needs its own evidence; similar dates or shapes do not establish contact.',
  },
  'machines-work': {
    title: 'A photograph and a caption',
    object: 'loc-hine',
    text: 'Lewis Hine made this photograph on 3 December 1908. His caption supplies information and reports an overseer’s denial. The image and written report have different evidentiary roles; age, hours and pay cannot all be read from the photograph.',
    citations: [cite('hine', 'Photograph LC-DIG-nclc-01451; caption card, Hine 358')],
    notice: [
      'Describe the person’s position beside the machinery.',
      'Name something the caption adds.',
    ],
    claimPrompt:
      'Separate one visible observation from one question about age, hours or pay that needs another record.',
    returnPrompt: 'Name a record that could help answer your question.',
    feedback:
      'The photograph records a scene; Hine’s caption reports more. Neither one scene nor its caption measures conditions for every worker.',
  },
  'promises-rights': {
    title: 'Read a commitment — editorial paraphrase',
    object: null,
    text: 'South Africa’s Bill of Rights protects everyone’s equality before the law. It separately gives political rights to citizens, including the right of adult citizens to vote. This is a paraphrase, not the full constitutional wording or a measure of outcomes.',
    citations: [cite('sa-rights', 'Sections 9 and 19')],
    notice: [
      'Who holds each right in the paraphrase?',
      'Separate the commitment from evidence of an outcome.',
    ],
    claimPrompt:
      'Choose one commitment. What later evidence could help test whether a person could exercise it?',
    returnPrompt: 'Read the linked section and compare its exact wording.',
    feedback:
      'The text establishes a commitment with particular wording. People’s experiences and later institutional records help test its exercise; the commitment alone does not measure that outcome.',
  },
  'independence-citizenship': {
    title: 'A declaration and a separate outcome',
    object: 'indonesia-proclamation',
    text: 'The proclamation announces independence and addresses a transfer of power. This typed facsimile differs from the handwritten archival draft. The declaration alone does not show who controlled every place afterward.',
    citations: [
      cite(
        'indonesia-proclamation-archive',
        'Printed p. 7: proclamation draft and context',
      ),
      cite('indonesia-proclamation-image', 'Typed facsimile and description'),
    ],
    notice: [
      'Find the signatures and dated line.',
      'Use this summary when the small scan is hard to read.',
    ],
    claimPrompt:
      'Explain what is declared. Name a later source needed before claiming control of every place.',
    returnPrompt: 'Compare a declaration with evidence about its implementation.',
    feedback:
      'A declaration records an announcement; later evidence tests control and people’s experiences. Independence and equal rights need distinct dated inquiries.',
  },
  'cities-work-water': {
    title: 'Grain and the work of recording',
    object: 'met-327384',
    text: 'The museum reads this tablet as a probable grain account. Recording grain could help organize distribution, but missing verbs limit the exact interpretation. This object does not supply a complete list of households or explain every recipient’s circumstances.',
    citations: [cite('met-327384', 'Description and Artwork Details')],
    notice: [
      'Find repeated and different marks.',
      'Which parts of the explanation depend on interpretation?',
    ],
    claimPrompt:
      'Explain one practical use for a grain record. Name a question about its recipients that remains unanswered.',
    returnPrompt: 'Compare this record with a water structure using evidence for each.',
    feedback:
      'A grain account supports an inquiry into organization. A precise reading, recipients’ identities and their experiences still need evidence beyond the surviving marks.',
  },
  'institutions-shipment-ritual': {
    title: 'Visible features, qualified attribution',
    object: 'met-44781',
    text: 'This bronze gong has a spout, handle and worked animal forms. The museum dates it to the thirteenth–eleventh century BCE and gives Henan Province, possibly Anyang. The catalogue does not establish an excavated tomb or named owner.',
    citations: [
      cite('met-44781', 'Description and Artwork Details; qualified place attribution'),
    ],
    notice: [
      'Find the spout and handle.',
      'Describe an animal form before interpreting its meaning.',
    ],
    claimPrompt:
      'Use the spout and handle to explain a possible action. What remains uncertain about its owner or findspot?',
    returnPrompt: 'Name a record that could establish a secure find context.',
    feedback:
      'Visible features support a discussion of pouring. Cultural attribution and a qualified place are different from documented excavation or identification of an owner.',
  },
  'rules-messages-public-work': {
    title: 'A pictured task is not a census',
    object: 'met-247244',
    text: 'The museum identifies women at a fountain on this water jar, dated about 510–500 BCE. The painted scene represents work. It does not identify each figure’s legal status or measure how everyone in Athens obtained water.',
    citations: [cite('met-247244', 'Description and Artwork Details')],
    notice: [
      'Find the pictured containers and fountain.',
      'Distinguish the jar’s function from the scene painted on it.',
    ],
    claimPrompt:
      'Describe the work shown. Why can this scene alone not establish each figure’s political rights?',
    returnPrompt: 'Name another source needed to investigate status or water access.',
    feedback:
      'The scene makes a task visible. A representation does not supply every person’s status, a household census or a measure of later practice.',
  },
  'objects-work-exchange': {
    title: 'Named people, a separate trade question',
    object: 'met-322375',
    text: 'The museum describes a Palmyrene family’s funerary relief with named figures and ancestors in an Aramaic inscription. Naming people on a burial marker does not by itself connect those people with a particular caravan.',
    citations: [
      cite('met-322375', 'Description: family inscription and burial marker'),
    ],
    notice: [
      'Describe how the figures are arranged.',
      'What does naming people add to the record?',
    ],
    claimPrompt:
      'What dated evidence would connect these named people with one particular caravan?',
    returnPrompt: 'Choose another record and ask what work it can establish.',
    feedback:
      'A specific claim needs a record linking the named people with that activity. The family inscription alone supplies no caravan role or route.',
  },
  'spaces-skills-learning': {
    title: 'A modern guide to a practical constraint',
    object: 'tang-access-diagram',
    text: 'This modern diagram uses a ward gate, public street and market to pose an imagined errand. The cited seminar summary describes gates and curfew. The guide is schematic, not a measured plan or a record of one resident’s actual journey.',
    citations: [
      cite('tang-wards', 'Walled wards, gates, curfew and reconstruction limits'),
    ],
    notice: [
      'Trace the imagined errand to the gate.',
      'Find the boundary that constrains movement.',
    ],
    claimPrompt:
      'What evidence would test whether a resident could actually pass after the gate closed?',
    returnPrompt: 'Compare an intended rule with evidence about daily practice.',
    feedback:
      'A gate and curfew describe intended arrangements. Further dated evidence is needed to test enforcement, exceptions and a particular resident’s access.',
  },
  'work-obligation-voices': {
    title: 'Read a proposal before claiming a result',
    object: 'song-loan-diagram',
    text: 'The modern guide follows the 1069 crop-loan proposal: resources before harvest and repayment later. A policy argument describes an intended arrangement. The arrows do not measure a particular household’s harvest, debt or freedom to participate.',
    citations: [cite('song-crop-loans', 'Longer selection: provision and repayment')],
    notice: [
      'Find when resources arrive and repayment follows.',
      'Keep the proposal separate from a measured result.',
    ],
    claimPrompt:
      'Name a household record that could test whether this timing and repayment helped.',
    returnPrompt:
      'Explain what your chosen record could reveal and still leave unknown.',
    feedback:
      'Loan terms, collection records and household accounts could test a proposal against experience. They still need dates, context and interpretation.',
  },
  'makers-interpreters-encounters': {
    title: 'Read the tasks in a narrative',
    object: 'voyage-mediation-diagram',
    text: 'The guide follows the journal’s account: supplies and a pilot at Malindi, then interpreters and a court audience at Calicut. The account also describes detention. A narrative sequence is not an exact sailing route; assistance alone does not establish free choice.',
    citations: [
      cite('gama-journal-1898', 'Selected English edition, printed pp. 39–57'),
    ],
    notice: ['Name a task beyond sailing.', 'Find the place assigned to that task.'],
    claimPrompt:
      'Explain why the assistance described here does not establish everyone’s freedom to choose.',
    returnPrompt: 'Name evidence that could help establish one worker’s choices.',
    feedback:
      'The account identifies useful work and also describes detention. Assistance and coercion need attention together; one narrator does not supply every participant’s experience.',
  },
};
export function applyFamilyEvidence(corpus: Corpus) {
  for (const [id, note] of Object.entries(notes))
    corpus.journeys.find((j) => j.id === id)!.familyEvidence = note;
}
