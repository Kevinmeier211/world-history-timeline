import type {
  Corpus,
  HistoricalContext,
  Journey,
  Source,
  Subject,
} from '../../src/atlas/model';
import { cite, claim, interval, sec, subject } from './content-helpers';
import { applyCitizenshipPlaces } from './citizenship-places';
import { citizenshipMedia } from './citizenship-media';

const consulted = '2026-10-28';
const source = (
  id: string,
  title: string,
  institution: string,
  url: string,
  type: Source['type'],
  scope: string,
): Source => ({ id, title, institution, url, type, scope, accessed: consulted });
export const citizenshipSources: Source[] = [
  source(
    'indonesia-proclamation-archive',
    'Naskah Sumber Arsip Presiden RI: Sukarno',
    'Arsip Nasional Republik Indonesia (ANRI)',
    'https://anri.go.id/download/naskah-sumber-arsip-seri-presiden-ri-sukarno-1586395026',
    'archive',
    '2015 archival volume: indexed description identifies Sukarno’s handwritten proclamation draft on printed p. 7 (PDF p. 13), ANRI Teks Proklamasi I. Description and attribution consulted through the web PDF; direct download returned 403 and the screenshot service did not return viewable pixels. The separately credited typed facsimile was visually inspected. This volume is not used as a general biography or a complete history of the revolution.',
  ),
  source(
    'indonesia-transfer',
    'Soevereiniteitsoverdracht Indonesië, 1949',
    'Nationaal Archief, Netherlands',
    'https://www.nationaalarchief.nl/beleven/onderwijs/bronnenbox/soevereiniteitsoverdracht-indonesie-1949',
    'archive',
    'Full Dutch archival teaching page consulted: 1945 proclamation, disputed sovereignty, negotiations, federal settlement and 27 December 1949 transfer. The archive’s transfer vocabulary describes the Dutch legal act; it does not replace Indonesia’s 1945 proclamation date. Exact Linggajati signing day is not adopted from this summary.',
  ),
  source(
    'indonesia-war',
    '1945–1949: Van Nederlands-Indië naar Indonesië',
    'Nederlands Instituut voor Militaire Historie',
    'https://www.nimh.nl/militaire-geschiedenis-van-nederland/historische-overzichten/tijdlijn/1945-1949-van-nederlands-indie-naar-indonesie',
    'scholarship',
    'Full Dutch military-history timeline consulted, especially 1945, July 1947, December 1948, May/December 1949 and 1950. An institutional account of Dutch operations and diplomacy, not a survey of Indonesian civilian experiences. Colonial euphemisms are identified rather than used as neutral labels.',
  ),
  source(
    'indonesia-newguinea',
    '70 jaar soevereiniteitsoverdracht aan Indonesië',
    'Nationaal Archief, Netherlands',
    'https://www.nationaalarchief.nl/beleven/nieuws/70-jaar-soevereiniteitsoverdracht-aan-indonesie',
    'archive',
    'Full account consulted for the 27 December 1949 federal transfer and explicit exclusion of Netherlands New Guinea. No modern territorial boundary is reconstructed.',
  ),
  source(
    'ghana-parliament',
    'History of Parliament',
    'Parliament of Ghana',
    'https://www.parliament.gh/history',
    'archive',
    'Full institutional history consulted for changing legislative representation, the 1951 assembly, independence in 1957 and the 1960 republic. Its national institutional perspective is paired with a contemporary debate and a later historical synthesis.',
  ),
  source(
    'ghana-nkrumah',
    'Biography of Osagyefo Dr. Kwame Nkrumah',
    'Kwame Nkrumah Memorial Park, Ghana',
    'https://knmp.gov.gh/new/biography-of-osagyefo-dr-kwame-nkrumah/',
    'archive',
    'Full commemorative biography consulted for UGCC, CPP, Positive Action, imprisonment and the move to government. The institution commemorates Nkrumah; its account is not treated as an independent assessment of all his policies.',
  ),
  source(
    'ghana-debate-1957',
    'Legislative Assembly Debates, 4–5 March 1957: Government Policy Statement',
    'Parliament of Ghana repository',
    'https://repository.parliament.gh/server/api/core/bitstreams/80115299-0bdd-4c73-9fbb-6e1285eb7327/content',
    'primary',
    'Original scan downloaded successfully and visually read: cover, printed columns 7–8 and 23–26 (PDF pp. 12, 20–21). Nkrumah’s policy statement is dated 5 March, before midnight independence; it is not the separate outdoor independence speech. Only those pages are used. No whole-volume OCR or transcription is claimed.',
  ),
  {
    ...source(
      'ghana-country-study',
      'Ghana: A Country Study',
      'Federal Research Division, Library of Congress',
      'https://tile.loc.gov/storage-services/master/frd/frdcstdy/gh/ghanacountrystud00berr_0/ghanacountrystud00berr_0.pdf',
      'scholarship',
      'LaVerle Berry, editor, 1995. Historical Setting, printed pp. 26–36 (PDF pp. 70–80), consulted for organizing, regional opposition, constitutional change and repression. Later US government synthesis with dated terminology and interpretive judgments; used alongside Ghanaian institutions and primary records. No unqualified “first independent African country” claim is adopted.',
    ),
    published: '1995',
    author: 'LaVerle Berry, editor',
  },
  source(
    'sa-mandela-constitution',
    'Address at the mural celebrating adoption of the new constitution, 8 May 1996',
    'Office of the President; Department of Justice, South Africa',
    'https://www.justice.gov.za/legislation/constitution/history/MEDIA/MANDELA.PDF',
    'primary',
    'Both pages consulted. Issued speech text marked “check against delivery”; this is the May adoption celebration, not the December signing. Used as a statement of political purpose, not measured outcomes or proof of verbatim delivery.',
  ),
  source(
    'sa-certification',
    'Certification of the New Constitution: procedure for objections',
    'Constitutional Court, South Africa',
    'https://www.justice.gov.za/legislation/constitution/history/CERTIF/COC20056.PDF',
    'primary',
    'A. Chaskalson, 20 May 1996, both pages consulted: 34 principles, written objections, languages, deadline, copies and limits of certification jurisdiction. This procedural statement alone does not establish the Court’s later judgment.',
  ),
  source(
    'sa-constitutional-negotiation',
    'The path to a Government of National Unity',
    'Nelson Mandela Foundation, The Presidential Years',
    'https://tpy.nelsonmandela.org/pages/part-i-democratic-breakthrough/forming-the-government-of-national-unity/3-1-the-path-to-a-government-of-national-unity',
    'archive',
    'Full account consulted for negotiations, interim arrangements, the 1994 government, May 1996 adoption and October amendment after Constitutional Court review. Not an account of every negotiating party or all political violence.',
  ),
  source(
    'sa-constitution-hill',
    'History of Constitution Hill',
    'Constitution Hill, South Africa',
    'https://www.constitutionhill.org.za/pages/history',
    'archive',
    'Full heritage-site account consulted for apartheid-era imprisonment, resistance and the later decision to locate the Court at the former prison complex. The present Court building opened in 2004, outside this atlas’s 2000 endpoint; it is not shown as the site of 1996 hearings.',
  ),
  source(
    'indonesia-proclamation-image',
    'Proklamasi.png: typed proclamation facsimile',
    'Wikimedia Commons; Indonesian government document',
    'https://commons.wikimedia.org/wiki/File:Proklamasi.png',
    'catalogue',
    'File page and actual 399 × 268 image inspected. Typed facsimile with Sukarno/Hatta signatures; different from the handwritten ANRI draft. Record asserts Indonesian government-work public-domain status. The digital upload date is not the document date. Low-resolution copy; no invented restoration.',
  ),
  source(
    'ghana-stamp-image',
    'Ghana Independence overprint on Gold Coast 1s stamp, 1957',
    'Wikimedia Commons',
    'https://commons.wikimedia.org/wiki/File:Ghana_Independence_overprint_on_Gold_Coast_1s_stamp_1957.jpg',
    'catalogue',
    'File page, public-domain UK government-work rationale and 611 × 460 scan inspected. Overprint dated 6 March 1957; cocoa-pod scene and Elizabeth II remain visible underneath. Scan uploaded by Philafrenzy, 2016; no inference of a particular worker’s identity or earnings.',
  ),
  source(
    'sa-voting-image',
    'Mandela voting in 1994',
    'Paul Weinberg; Wikimedia Commons',
    'https://commons.wikimedia.org/wiki/File:Mandela_voting_in_1994.jpg',
    'catalogue',
    'File page, permission record and 538 × 800 photograph inspected. Paul Weinberg, official IEC photographer; Ohlange School, Inanda near Durban, April 1994. Used under CC BY-SA 3.0 with credit and licence link, not labelled public domain.',
  ),
];
const reviewed = (limits: string[]): Subject['review'] => ({
  consultedOn: consulted,
  reviewer:
    'Codex source consultation and self-review; not independent historian approval',
  scope:
    'Bounded local teaching account; cited source passages and image records consulted.',
  limitations: limits,
});
const fact = (id: string, text: string, sourceId: string, locator: string) => ({
  ...claim(id, text, [cite(sourceId, locator)]),
  checkedOn: consulted,
});
const dimension = (text: string, sourceId: string, locator: string) => ({
  text,
  citations: [cite(sourceId, locator)],
});

const indonesia = subject({
  id: 'indonesia-independence',
  name: 'Indonesia: a proclamation and a contested independence',
  aliases: [
    'Sukarno',
    'Soekarno',
    'Hatta',
    'Indonesian Revolution',
    'Dutch East Indies',
    'decolonization',
    'sovereignty',
  ],
  kind: 'process',
  region: 'Southeast Asia/Oceania',
  place: 'Indonesian archipelago; proclamation at Jakarta',
  coordinates: [106.83, -6.19],
  geographicPrecision:
    'Jakarta is the proclamation locator. It does not represent the location of every struggle or the extent of Republican control.',
  interval: interval(
    1945,
    1950,
    'Proclamation in 1945; federal settlement in 1949; unitary state in 1950',
    'Selected revolution and constitutional transition, not the entire history of Indonesian nationalism or the end of all territorial disputes.',
    'range',
  ),
  packs: ['C8'],
  contextIds: ['indonesia-revolution-context'],
  question: 'What had to happen after independence was proclaimed?',
  summary:
    'A short proclamation in Jakarta on 17 August 1945 declared Indonesian independence in the name of the Indonesian people. Turning that claim into recognized and functioning government took years of struggle. War, diplomacy and disagreement over a federal or unitary state made 1945, 1949 and 1950 different milestones in the same unfinished political process.',
  sections: [
    sec(
      'A document that acted',
      'Sukarno and Mohammad Hatta announced independence after Japan’s surrender. The proclamation did more than report a change: it asserted the authority to make one. Its brevity is striking. The text declares independence, then turns to the practical transfer of power. The signatures claim to speak for a people, yet the sheet cannot tell us how every community understood that claim. Read the typed facsimile beside the handwritten draft preserved by Indonesia’s national archives: related versions of a political act, not two different independence dates.',
      cite('indonesia-proclamation-archive', 'Printed p. 7, proclamation manuscript'),
      cite('indonesia-proclamation-image', 'Typed facsimile and description'),
      cite('indonesia-war', '17 August 1945'),
    ),
    sec(
      'A republic had to survive',
      'The Netherlands did not initially accept the Republic’s independence. Dutch attempts to restore colonial authority met armed resistance and negotiations. The Dutch military-history timeline describes offensives in July 1947 and December 1948; their official label, “police actions,” made colonial war sound like internal policing. In the second offensive Dutch forces took Yogyakarta, then the Republican capital, and arrested Republican leaders. Holding a city and removing leaders did not settle the question of legitimate government. Resistance and international pressure continued.',
      cite('indonesia-war', '21 July 1947; 19 December 1948; 7 May 1949'),
    ),
    sec(
      'Negotiating the shape of the state',
      'Negotiations concerned both relations with the Netherlands and the organization of power within the archipelago. Agreements discussed a federation joining the Republic and other states. This mattered because a federal constitution could distribute authority among several governments, while Republican supporters of a unitary state wanted a different arrangement. The Round Table Conference in The Hague in 1949 produced a settlement under which the Netherlands transferred sovereignty to the United States of Indonesia on 27 December. This was recognition and a legal transfer after the 1945 proclamation, not the moment Indonesians first claimed independence.',
      cite(
        'indonesia-transfer',
        'Linggajati, Round Table Conference and sovereignty transfer',
      ),
    ),
    sec(
      'Two limits to a neat ending',
      'The 1949 transfer excluded Netherlands New Guinea, the western part of the island of New Guinea. A map of today’s Indonesia would therefore misrepresent the settlement if presented as its exact territory. The federal structure was itself short-lived: a unitary republic replaced it in 1950. That change did not make all local interests identical or resolve the New Guinea dispute. Follow the places and phases below as selected evidence of changing authority; the case ends in 1950 to keep the inquiry manageable.',
      cite('indonesia-newguinea', 'Exclusion of Nieuw-Guinea from the transfer'),
      cite('indonesia-war', '27 December 1949 and subsequent unitary state'),
    ),
    sec(
      'Power also needed resources and institutions',
      'The Dutch military-history account connects the 1947 offensive to financial pressure and the aim of taking important production areas on Java and Sumatra. Control of resources mattered alongside diplomatic recognition. The later transfer also involved practical institutions: naval duties and equipment passed to Indonesian control, with training for Indonesian personnel. The colonial army was dissolved in 1950; some soldiers entered Indonesia’s army and others were demobilized. Creating a state required decisions about people, equipment and chains of command. These institutional records illuminate that work, while local civilian experiences still need sources beyond the military account.',
      cite(
        'indonesia-war',
        '21 July 1947; transfer to the Indonesian navy; 26 July 1950',
      ),
    ),
  ],
  deeperReading: [
    sec(
      'Three meanings of a date',
      'The proclamation date records a claim to sovereign authority. The 1949 settlement records a negotiated change in Dutch recognition and power. The 1950 constitutional change records how the new state was organized internally. These events answer different questions. A reader who asks only when independence “really happened” risks losing the actors’ disagreements: the Republic already claimed independence while Dutch authorities still sought a colonial settlement. Keep the dates together, but keep their verbs distinct—proclaimed, transferred, reorganized.',
      cite('indonesia-proclamation-archive', 'Printed p. 7'),
      cite('indonesia-transfer', '1945 proclamation and 1949 transfer'),
      cite('indonesia-war', '1950 unitary-state paragraph'),
    ),
    sec(
      'Read the archive’s point of view',
      'An archive preserves evidence and also arranges it. The Dutch National Archives teaching page is organized around a transfer of sovereignty, with documents from Dutch institutions and negotiations. ANRI’s facsimile places the proclamation within an Indonesian presidential archive. Comparing them does not require treating every statement as equally reliable or choosing one national story wholesale. Ask instead which act each institution makes central, who produced the record, and which question the record can answer. A signed document supports a claim about its words and signatories more directly than a claim about unanimous public consent.',
      cite('indonesia-transfer', 'Teaching-page document selection'),
      cite('indonesia-proclamation-archive', 'Volume title and proclamation facsimile'),
    ),
    sec(
      'Compare institutions, not a universal timetable',
      'Ghana’s 1957 independence and Indonesia’s 1945 proclamation belong in a comparative inquiry, but neither supplies a schedule that every colony followed. In Indonesia a war and a federal settlement separated proclamation from Dutch recognition. Ghana’s case follows mass organizing, elections and constitutional negotiations under British rule. A useful comparison asks how movements became governments and what powers changed hands. It does not assume the two cases had the same violence, territorial problem or social coalition.',
      cite('indonesia-war', '1945–1950 timeline'),
      cite('ghana-country-study', 'Printed pp. 26–30'),
    ),
  ],
  claims: [
    fact(
      'indonesia-dates',
      'Indonesia proclaimed independence on 17 August 1945; the Dutch transfer to a federal United States of Indonesia followed on 27 December 1949.',
      'indonesia-transfer',
      'Proclamation and transfer sections',
    ),
  ],
  objectIds: ['indonesia-proclamation'],
  terms: ['decolonization', 'primary-source', 'sovereignty', 'federation'],
  dimensions: {
    'Authority and participation': dimension(
      'A Republican declaration preceded Dutch recognition; war and negotiations concerned both sovereignty and federal arrangements.',
      'indonesia-transfer',
      'Proclamation, negotiations and transfer',
    ),
    'Surviving evidence': dimension(
      'A proclamation records a political claim. Military and diplomatic archives help trace its contested implementation, while civilian experience needs further local evidence.',
      'indonesia-war',
      '1945–1950 chronology',
    ),
    'Change and continuity': dimension(
      'Proclamation in 1945, a federal settlement in 1949 and a unitary state in 1950 were distinct changes.',
      'indonesia-war',
      '17 August 1945; 27 December 1949; 1950',
    ),
  },
  familyActivity: {
    title: 'Put the verbs on the timeline',
    duration: '10–15 minutes',
    steps: [
      'Find the two signatures in the proclamation. Who is claiming to speak?',
      'Write three cards: proclaimed (1945), federal transfer (1949), unitary state (1950). Put them in order.',
      'Explain why moving all three cards to 1945 would change the history.',
    ],
    explanation:
      'The proclamation is a real political act. It does not make subsequent war, negotiations or constitutional choices disappear.',
  },
  evidenceReading: {
    title: 'Read a proclamation as an action',
    introduction:
      'The following is a short editorial paraphrase, not a full translation. Inspect the typed facsimile above; the ANRI source supplies the handwritten draft.',
    items: [
      {
        label: 'Declaration — paraphrase',
        text: 'The Indonesian people declare their independence.',
        interpretation:
          'This asserts collective authority. It does not measure how much territory the new government controlled that day.',
        citations: [
          cite('indonesia-proclamation-image', 'Typed facsimile, first sentence'),
        ],
      },
      {
        label: 'Transfer of power — paraphrase',
        text: 'Matters concerning the transfer of power are to be arranged carefully and promptly.',
        interpretation:
          'The document itself points forward to work still to be done. Later agreements can be studied without turning the proclamation into a mere prediction.',
        citations: [
          cite('indonesia-proclamation-image', 'Typed facsimile, second sentence'),
        ],
      },
    ],
  },
  review: reviewed([
    'Indonesian local and civilian histories remain thin; Dutch institutional narratives supply much of the military and diplomatic sequence.',
    'The displayed typed facsimile is small. Its signatures and layout are visible, but the paraphrase does not claim to reproduce every word.',
    'No exact casualty total, reconstructed border or complete account of the New Guinea dispute is provided.',
  ]),
  returnPrompt:
    'Choose one date and explain exactly what changed—and which question that date cannot answer.',
});

const ghana = subject({
  id: 'ghana-independence',
  name: 'Ghana: from organizing for independence to governing',
  aliases: [
    'Gold Coast',
    'Kwame Nkrumah',
    'CPP',
    'Positive Action',
    'Pan-Africanism',
    'decolonization',
    'cocoa',
  ],
  kind: 'process',
  region: 'Africa',
  place: 'Gold Coast and independent Ghana; Accra',
  coordinates: [-0.2, 5.55],
  geographicPrecision:
    'Accra is a political and archival anchor, not a map of every movement or the boundaries of colonial jurisdictions.',
  interval: interval(
    1948,
    1960,
    'Political mobilization, 1948–1957; republic in 1960',
    'Selected route to independence and early constitutional choices. Earlier resistance and later Ghanaian history extend beyond this inquiry.',
    'range',
  ),
  packs: ['C8'],
  contextIds: ['ghana-independence-context'],
  question: 'How did people turn a demand for self-government into a government?',
  summary:
    'On a 1957 stamp, “Ghana Independence” is printed across an older Gold Coast design. The new words announce a political change; the cocoa workers and royal portrait underneath invite questions about what continued. Independence on 6 March 1957 followed years of organizing, elections and argument over who should govern, how power should be shared and what freedom should accomplish.',
  sections: [
    sec(
      'Grievances became organized politics',
      'After the Second World War, shortages, inflation and difficult employment conditions sharpened discontent in the Gold Coast. Farmers, veterans and urban residents had different grievances. The United Gold Coast Convention, founded in 1947, demanded self-government and recruited Nkrumah as its general secretary. Unrest in 1948 prompted detention of leaders and a new constitutional inquiry. This sequence connects everyday pressures with institutional change without making every protest the work of one party or one leader.',
      cite('ghana-country-study', 'Printed pp. 26–28'),
      cite('ghana-nkrumah', 'Return to the Gold Coast and UGCC'),
    ),
    sec(
      'A party needed people and communication',
      'Nkrumah broke with the UGCC and formed the Convention People’s Party in 1949. Its call for immediate self-government appealed to workers, farmers, young people and others dissatisfied with gradual change. Market women were important supporters and channels of communication through local trading networks. The party’s strength therefore depended on repeated work—organizing meetings, spreading messages and sustaining support—as well as public speeches. The 1950 Positive Action campaign called for strikes and nonviolent resistance; disturbances and arrests followed, and Nkrumah was imprisoned.',
      cite('ghana-country-study', 'Printed pp. 27–28'),
      cite('ghana-nkrumah', 'CPP and Positive Action'),
    ),
    sec(
      'Winning office was not yet independence',
      'The CPP won the 1951 election while Nkrumah was still in prison. He was released and invited to lead government business. Constitutional changes in 1952 and 1954 increased elected ministers’ responsibility, but defense and foreign affairs remained with the colonial governor. This distinction matters: African ministers could administer much of the country while Britain retained important powers. Elections, participation in government and national independence were connected steps, not interchangeable labels.',
      cite('ghana-country-study', 'Printed pp. 28–29'),
      cite('ghana-debate-1957', '5 March 1957, printed column 23; PDF p. 20'),
    ),
    sec(
      'Independence did not mean one opinion',
      'The CPP favored a centralized state. The Asante-based National Liberation Movement advocated a federation with more regional power and worked with the Northern People’s Party. After the contested 1956 election, a legislative motion sought independence. On 6 March 1957 the Gold Coast became independent Ghana; Nkrumah remained prime minister. Elizabeth II was initially head of state, represented by a governor-general. The 1960 constitution made Ghana a republic. The royal portrait on the independence stamp is therefore evidence worth investigating, not simply a printing mistake.',
      cite('ghana-country-study', 'Printed pp. 29–30, 33'),
      cite('ghana-parliament', '1957 and 1960 constitutional changes'),
      cite('ghana-stamp-image', 'Stamp scan, design and overprint'),
    ),
    sec(
      'What should political freedom provide?',
      'In his parliamentary statement on the eve of independence, Nkrumah linked national policy to economic and social development and to the freedom of other African peoples. He pointed to cocoa farming and resources for development, including Tema Harbour. These were political claims and priorities presented by a prime minister, not an independent audit of prosperity. The stamp’s cocoa scene helps pose the next questions: who produced export income, who decided how to spend it, and which communities gained services or influence?',
      cite('ghana-debate-1957', 'Printed columns 25–26; PDF p. 21'),
      cite('ghana-stamp-image', 'Cocoa-pod design'),
    ),
    sec(
      'Follow the promise into the institutions',
      'Early independence also brought restrictions on opposition. The 1958 Preventive Detention Act permitted detention without trial, and Ghana formally became a one-party state in 1964. These developments complicate an account that stops at celebration. National sovereignty and freedom to challenge a government are different historical questions. Investigating both preserves the achievement of ending colonial rule while asking how power was exercised afterward.',
      cite('ghana-country-study', 'Printed pp. 32–33 and 36'),
    ),
  ],
  deeperReading: [
    sec(
      'A stamp is a small public surface',
      'The overprint places a new national name and a date on an existing postal design. Under it remain the words Gold Coast, Elizabeth II’s profile and a scene labelled Breaking Cocoa Pods. You can observe those elements directly. Interpreting them requires a second step: the independence constitution retained the monarchy, while cocoa connected people’s agricultural work to public revenue and plans for development. The stamp is useful evidence of what officials circulated, but its tidy composition does not show wages, land tenure or how actual workers felt about independence.',
      cite('ghana-stamp-image', 'Image and description'),
      cite('ghana-country-study', 'Printed p. 30'),
      cite('ghana-debate-1957', 'Printed column 26'),
    ),
    sec(
      'A primary voice and a later account',
      'Nkrumah spoke to the Legislative Assembly late on 5 March 1957, with independence expected at midnight. His government policy statement explains the powers he intended to assume and the place he wanted Ghana to occupy internationally. A later country study can follow subsequent legislation and conflict, but it has its own authorship, date and judgments. Read the two for different purposes: one shows a leader making an argument at a decisive moment; the other organizes later evidence into an explanation. Neither cancels the need for opponents’ accounts and local histories.',
      cite('ghana-debate-1957', 'Printed columns 23–26'),
      cite('ghana-country-study', 'Historical Setting, printed pp. 26–36'),
    ),
    sec(
      'Where this account needs widening',
      'The country study describes regional opposition and disagreement over the incorporation of British Togoland, but a detailed border history needs the plebiscite records and situated Ewe accounts. They are not supplied here. Likewise, market women appear as political organizers in the synthesis without individual voices in the sources displayed. Those are specific next research tasks. Ghana’s inclusion strengthens one modern African inquiry; it cannot stand in for the many different routes to independence elsewhere on the continent.',
      cite('ghana-country-study', 'Printed pp. 28–30'),
    ),
  ],
  claims: [
    fact(
      'ghana-dates',
      'Ghana became independent on 6 March 1957 and a republic in 1960; independence did not initially end the monarchy.',
      'ghana-country-study',
      'Printed pp. 30 and 33',
    ),
  ],
  objectIds: ['ghana-independence-stamp'],
  terms: ['decolonization', 'sovereignty', 'federation', 'primary-source'],
  dimensions: {
    'Authority and participation': dimension(
      'Mass organizing and elections brought the CPP into office before independence; regional opponents contested the distribution of power.',
      'ghana-country-study',
      'Printed pp. 27–30',
    ),
    'Surviving evidence': dimension(
      'An overprinted stamp shows a public design; a policy statement records intended priorities. Neither establishes how every household experienced independence.',
      'ghana-debate-1957',
      'Printed columns 23–26',
    ),
    'Change and continuity': dimension(
      'Independence in 1957 retained a monarchy; the republic followed in 1960, and later repression requires a separate assessment of political freedom.',
      'ghana-country-study',
      'Printed pp. 30–36',
    ),
    'Work and production': dimension(
      'Market women helped carry political messages, while cocoa production figured in national development arguments.',
      'ghana-country-study',
      'Printed p. 28',
    ),
  },
  familyActivity: {
    title: 'Find the new words and the older picture',
    duration: '10–15 minutes',
    steps: [
      'Describe the stamp before reading its caption. Find the old name, new name, date, portrait and work scene.',
      'Make two columns: things you can see; things you need another source to explain.',
      'Use the account to explain why a royal portrait and independence could appear together in 1957.',
    ],
    explanation:
      'An object can carry several layers of history. Observation supplies questions; a dated constitutional account helps answer them.',
  },
  evidenceReading: {
    title: 'Read the eve-of-independence debate',
    introduction:
      'These editorial paraphrases come from the scanned Legislative Assembly debate of 5 March 1957, not the separate outdoor independence speech. The page and column numbers allow a precise return to the source.',
    items: [
      {
        label: 'Which powers changed hands? — paraphrase',
        text: 'Nkrumah describes internal self-government while defense and foreign affairs still belonged to the governor; he says he will take those portfolios at independence.',
        interpretation:
          'The speaker identifies a concrete institutional change. Holding elected office before 1957 was not the same as controlling all state powers.',
        citations: [cite('ghana-debate-1957', 'Columns 23–24; PDF p. 20')],
      },
      {
        label: 'What should independence do? — paraphrase',
        text: 'He argues for development of national resources and support for African peoples seeking freedom and social progress.',
        interpretation:
          'This tells us what the prime minister publicly advocated. Whether policies achieved those aims needs evidence from later budgets, services, political institutions and people’s lives.',
        citations: [cite('ghana-debate-1957', 'Columns 25–26; PDF p. 21')],
      },
    ],
  },
  review: reviewed([
    'The parliamentary scan was visually consulted at the cited pages; no complete transcription or exhaustive debate review is claimed.',
    'Named market organizers, opposition voices, local economic evidence and the British Togoland/Ewe history need further research.',
    'The Library of Congress study dates to 1995; its evaluative language is not adopted wholesale. No claim that Ghana was the first independent African state is made.',
  ]),
  returnPrompt:
    'Name one power that changed in 1957 and one kind of freedom that still needs its own evidence.',
});

function deepenSouthAfrica(s: Subject) {
  // Preserve the existing stable ID, 1994–1997 case dates, location and notebook references.
  s.contextIds = ['south-africa-democracy-context'];
  s.aliases = [
    ...new Set([
      ...s.aliases,
      'Bill of Rights',
      'Constitutional Court',
      'citizenship',
      '1994 election',
    ]),
  ];
  s.summary =
    'Paul Weinberg’s photograph shows Nelson Mandela casting his ballot in the 1994 election. It records one person exercising a right in a transformed political system. The constitution-making that followed asked a further question: how could a government chosen by the majority be bound to protect dignity, equality and the rights of people who opposed it?';
  s.sections = [
    sec(
      'The system being challenged',
      'Apartheid organized racial domination through law and administration. After the National Party came to power in 1948, it intensified an older history of segregation and exclusion. Restrictions on residence, movement and political participation shaped ordinary life as well as elections. Constitution Hill’s former prisons offer material evidence of that coercion: its history records incarceration and resistance, including anti-pass protests by women. A constitutional transition thus concerned much more than replacing the people at the top of government.',
      cite('sa-constitution-hill', 'Apartheid and resistance sections'),
    ),
    sec(
      'Negotiation and an election',
      'Political organizing, resistance and negotiations preceded the 1994 election. Talks did not produce instant agreement: the process worked through competing demands and interim arrangements. An interim constitution supplied the framework for the election and a Government of National Unity. Mandela’s vote at Ohlange School in Inanda became an enduring image of the transition. It is one photographed act within a national election, not a picture of every voter’s experience or evidence that economic inequalities had ended.',
      cite(
        'sa-constitutional-negotiation',
        'Negotiations, interim constitution and Government of National Unity',
      ),
      cite('sa-voting-image', 'Photograph description and authorship'),
    ),
    sec(
      'A majority needed constitutional limits',
      'Elected representatives also formed a Constitutional Assembly to write the new constitution. In May 1996 Mandela celebrated both majority government and constitutional protection for opposition. That pairing is central: winning an election should confer powers to govern, while leaving opponents able to organize and challenge the government. Public participation reached beyond those who could vote, including children. The speech describes the President’s view of this process; the precise protections must be read in the constitutional text itself.',
      cite('sa-mandela-constitution', '8 May 1996 address, pp. 1–2'),
    ),
    sec(
      'Adoption, review, signing and commencement',
      'The Assembly adopted a text on 8 May 1996, but adoption was not the final step. The Constitutional Court had to certify compliance with 34 principles inherited from the interim settlement. The text was amended in October after Court review. Mandela signed the constitution at Sharpeville on 10 December 1996, and it came into effect on 4 February 1997. These dates explain why the case spans 1994–1997. They should not be flattened into a single moment when all democratic institutions were complete.',
      cite('sa-certification', '20 May 1996 statement, paragraphs 1–5'),
      cite('sa-constitutional-negotiation', 'May adoption and October amendment'),
      cite('sa-transition', '1996 signing and 1997 commencement'),
    ),
    sec(
      'Read the rights carefully',
      'The Bill of Rights protects equality before the law and human dignity. Its political-rights section specifies rights of citizens, including voting rights of adult citizens. Other provisions use “everyone.” The wording and qualifications matter: access to adequate housing and health care involves reasonable measures and progressive realization within available resources, while the basic-education provision is worded differently. A list that reduces all of these to a promise of immediate identical provision would misstate the text.',
      cite('sa-rights', 'Sections 7, 9, 10, 19, 26, 27 and 29'),
    ),
    sec(
      'A commitment creates questions to investigate',
      'The constitution provides standards against which institutions can be challenged. It does not supply a measurement of whether a household obtained housing, a child reached school or an official acted fairly. Those outcomes need later records and people’s accounts. The transformation studied here ended apartheid rule and established a different constitutional order; it was not South Africa’s first independence from Britain. Compare it with Ghana and Indonesia by asking who could exercise and contest power, while retaining those different histories.',
      cite('sa-rights', 'Sections 7–8 and 38, duties, application and enforcement'),
      cite('sa-transition', '1994–1997 milestones'),
    ),
  ];
  s.deeperReading = [
    sec(
      'An invitation with a defined purpose',
      'The Court’s May 1996 statement invited written objections to certification from people beyond the political parties. Objections could be in any official language, but had to identify a constitutional provision or omission and the principle it violated. The Court said its role was to assess compliance, not whether it considered the constitution wise. This was a particular avenue of participation with a defined legal question. It should not be confused with a general referendum on the whole text.',
      cite('sa-certification', 'Paragraphs 5–7'),
    ),
    sec(
      'The practical conditions of participation',
      'The same notice required a written objection of no more than 1,000 words, 25 copies and delivery by a stated deadline. These details make participation tangible: someone needed to compose, reproduce and deliver an argument. They suggest questions about access, literacy and assistance, but the notice alone does not measure who was excluded or how many people participated. Compare the procedural record with Mandela’s celebratory speech. One establishes the rules of an opportunity; the other presents a political interpretation of public involvement.',
      cite('sa-certification', 'Paragraphs 5–6'),
      cite('sa-mandela-constitution', 'Public participation, pp. 1–2'),
    ),
    sec(
      'Read a famous photograph without making it carry everything',
      'The photograph’s author and setting are known: Paul Weinberg, an official election photographer, recorded Mandela voting at Ohlange School near Durban. The image lets us inspect the ballot, box, people and room. It cannot show all the negotiations that enabled the vote, nor what happened after the shutter closed. A useful sequence therefore pairs the image with the interim settlement, the final constitution and later evidence about implementation. Political hope belongs to the history; claiming that the image proves every hope was fulfilled does not.',
      cite('sa-voting-image', 'Description, author and permission'),
      cite('sa-constitutional-negotiation', 'Interim settlement and constitution'),
    ),
  ];
  s.objectIds = [...new Set([...s.objectIds, 'mandela-voting'])];
  s.claims = [
    fact(
      'south-africa-distinct-dates',
      'The constitution was signed on 10 December 1996 and came into effect on 4 February 1997, after the 1994 democratic transition.',
      'sa-transition',
      '1994, 1996 and 1997 milestones',
    ),
  ];
  s.dimensions = {
    'Authority and participation': dimension(
      'An elected majority governed within a constitutional settlement that protected opposition and made power subject to legal limits.',
      'sa-mandela-constitution',
      'Majority government and opposition, p. 1',
    ),
    'Surviving evidence': dimension(
      'A voting photograph, an issued speech, procedural rules and the constitutional text answer different questions about the transition.',
      'sa-certification',
      'Certification procedure, paragraphs 1–7',
    ),
    'Change and continuity': dimension(
      'Election, constitution adoption, signing and commencement mark distinct changes; realization of rights requires further outcome evidence.',
      'sa-transition',
      '1994–1997 timeline',
    ),
  };
  s.familyActivity = {
    title: 'A right, a rule and a real result',
    duration: '10–15 minutes',
    steps: [
      'Describe the voting photograph without using the caption. Then identify what the caption adds.',
      'Read the equality and education paraphrases below. Give an example of an institution each could affect.',
      'Choose one example and name the evidence you would need to find out whether people actually benefited.',
    ],
    explanation:
      'A commitment can matter greatly before every problem is solved. Distinguish the right, the institution responsible and the evidence of an outcome.',
  };
  s.evidenceReading = {
    title: 'Read who holds a right and how it is worded',
    introduction:
      'These are editorial paraphrases of the Bill of Rights, not quotations or a complete legal guide. Follow the section links and compare their wording.',
    items: [
      {
        label: 'Equality and dignity — paraphrase',
        text: 'Everyone is equal before the law and has inherent dignity that must be respected and protected.',
        interpretation:
          'The subject is everyone. A historical inquiry can ask how institutions were required to change, then separately investigate their conduct.',
        citations: [cite('sa-rights', 'Sections 9–10')],
      },
      {
        label: 'Political participation — paraphrase',
        text: 'Citizens have political rights; every adult citizen has the right to vote in elections for a legislative body and to stand for public office.',
        interpretation:
          'This provision specifies citizenship and adulthood for voting. Do not silently replace its wording with a claim that every resident had every political right.',
        citations: [cite('sa-rights', 'Section 19')],
      },
      {
        label: 'Social rights — compare the wording',
        text: 'The text treats access to housing and health care, and the right to basic education, in separately worded provisions.',
        interpretation:
          'Sections 26 and 27 expressly qualify state measures by resources and progressive realization. Section 29(1)(a) does not use that same formula. Reading the differences is part of understanding the promise.',
        citations: [cite('sa-rights', 'Sections 26–27 and 29(1)(a)')],
      },
    ],
  };
  s.review = reviewed([
    'This is a selected transition account, not a comprehensive history of apartheid, resistance, negotiating parties or political violence.',
    'No independent assessment of rights implementation is claimed. The constitutional passages are read as historical commitments.',
    'The 8 May 1996 speech is an issued text marked check against delivery, not verified audio or a transcript of the December signing.',
  ]);
  s.returnPrompt =
    'Use one constitutional section to explain a commitment, then identify what evidence would test its effect in practice.';
}

const contexts: HistoricalContext[] = [
  {
    id: 'indonesia-revolution-context',
    title: 'Indonesia: revolution, recognition and the form of the state',
    region: 'Southeast Asia/Oceania',
    interval: interval(
      1945,
      1950,
      'Selected transition, 1945–1950',
      'A bounded reference frame, not the lifetime of Indonesia or an end to all disputes.',
      'range',
    ),
    summary:
      'Independence was proclaimed in 1945, contested through war and diplomacy, recognized in a federal transfer in 1949 and followed by a unitary state in 1950.',
    citations: [
      cite('indonesia-war', '1945–1950 timeline'),
      cite('indonesia-transfer', 'Negotiations and transfer'),
    ],
    subjectIds: ['indonesia-independence'],
    phases: [
      {
        year: 1945,
        label: '17 August 1945',
        title: 'Proclamation',
        text: 'Sukarno and Hatta proclaim independence in Jakarta.',
        citations: [cite('indonesia-proclamation-archive', 'Printed p. 7')],
      },
      {
        year: 1947,
        label: 'July 1947',
        title: 'Dutch offensive',
        text: 'The first major Dutch offensive is officially described as a “police action”; the term obscures the colonial war.',
        citations: [cite('indonesia-war', '21 July 1947')],
      },
      {
        year: 1948,
        label: 'December 1948',
        title: 'Yogyakarta taken',
        text: 'A second offensive takes the Republican capital and arrests leaders; the conflict continues.',
        citations: [cite('indonesia-war', '19 December 1948')],
      },
      {
        year: 1949,
        label: '27 December 1949',
        title: 'Federal transfer',
        text: 'The Netherlands transfers sovereignty to a federal United States of Indonesia, excluding Netherlands New Guinea.',
        citations: [cite('indonesia-newguinea', 'Transfer and New Guinea exclusion')],
      },
      {
        year: 1950,
        title: 'Unitary republic',
        text: 'The federal arrangement is replaced by a unitary state. The New Guinea dispute remains outside this settlement.',
        citations: [cite('indonesia-war', '1950 unitary state')],
      },
    ],
  },
  {
    id: 'ghana-independence-context',
    title: 'Ghana: organizing, independence and the early republic',
    region: 'Africa',
    interval: interval(
      1948,
      1964,
      'Selected political sequence, 1948–1964',
      'The reference frame extends beyond the 1948–1960 case to show the later one-party turn; it is not Ghana’s full history.',
      'range',
    ),
    summary:
      'Mobilization and elections increased African control of government before independence in 1957. A republic followed in 1960; opposition rights require their own history.',
    citations: [cite('ghana-country-study', 'Printed pp. 26–36')],
    subjectIds: ['ghana-independence'],
    phases: [
      {
        year: 1948,
        title: 'Unrest and constitutional inquiry',
        text: 'Postwar grievances and unrest prompt a new constitutional process.',
        citations: [cite('ghana-country-study', 'Printed pp. 26–28')],
      },
      {
        year: 1949,
        title: 'CPP formed',
        text: 'Nkrumah establishes a new party seeking immediate self-government.',
        citations: [cite('ghana-country-study', 'Printed pp. 27–28')],
      },
      {
        year: 1951,
        title: 'Election and entry into government',
        text: 'The CPP wins; Nkrumah leaves prison to lead government business under a colonial constitutional framework.',
        citations: [cite('ghana-country-study', 'Printed pp. 28–29')],
      },
      {
        year: 1957,
        label: '6 March 1957',
        title: 'Independence',
        text: 'Ghana becomes independent, initially retaining the monarchy.',
        citations: [cite('ghana-country-study', 'Printed p. 30')],
      },
      {
        year: 1960,
        label: '1 July 1960',
        title: 'Republic',
        text: 'A president replaces the monarch as head of state.',
        citations: [cite('ghana-country-study', 'Printed p. 33')],
      },
      {
        year: 1964,
        title: 'One-party state',
        text: 'Constitutional change formalizes one-party rule. This later milestone qualifies a story that stops with liberation.',
        citations: [cite('ghana-country-study', 'Printed p. 36')],
      },
    ],
  },
  {
    id: 'south-africa-democracy-context',
    title: 'South Africa: apartheid rule and a constitutional transition',
    region: 'Africa',
    interval: interval(
      1948,
      1997,
      'Selected frame, 1948–1997',
      'Apartheid intensified earlier segregation. This frame ends at constitutional commencement, not the end of inequality or South African history.',
      'range',
    ),
    summary:
      'Resistance and negotiations led to the 1994 election and a constitution that bound government to rights. Adoption, Court review, signing and commencement were separate steps.',
    citations: [
      cite('sa-constitution-hill', 'Apartheid and resistance'),
      cite('sa-transition', '1994–1997 milestones'),
    ],
    subjectIds: ['south-africa-rights'],
    phases: [
      {
        year: 1948,
        title: 'Apartheid government',
        text: 'The National Party comes to power and intensifies racial segregation and exclusion.',
        citations: [cite('sa-constitution-hill', 'Apartheid-era history')],
      },
      {
        year: 1993,
        title: 'Interim settlement',
        text: 'An interim constitutional arrangement provides a framework for the election and for drafting a new constitution.',
        citations: [
          cite('sa-constitutional-negotiation', 'Interim constitution and GNU'),
        ],
      },
      {
        year: 1994,
        label: 'April 1994',
        title: 'Democratic election',
        text: 'The election brings a Government of National Unity and elected representatives who also undertake constitution-making.',
        citations: [
          cite('sa-constitutional-negotiation', '1994 election and assembly'),
        ],
      },
      {
        year: 1996,
        label: '8 May 1996',
        title: 'Text adopted',
        text: 'Assembly adoption is followed by a required Constitutional Court certification process.',
        citations: [cite('sa-certification', 'Paragraphs 1–5')],
      },
      {
        year: 1996,
        label: 'October 1996',
        title: 'Text amended',
        text: 'Amendments follow Court review.',
        citations: [cite('sa-constitutional-negotiation', 'October amendment')],
      },
      {
        year: 1996,
        label: '10 December 1996',
        title: 'Signed at Sharpeville',
        text: 'Mandela signs the constitution.',
        citations: [cite('sa-transition', '1996 milestone')],
      },
      {
        year: 1997,
        label: '4 February 1997',
        title: 'Comes into effect',
        text: 'Commencement is a distinct milestone from signing.',
        citations: [cite('sa-transition', '1997 milestone')],
      },
    ],
  },
];

const journey: Journey = {
  printSourcesPerPage: 4,
  id: 'independence-citizenship',
  title: 'Independence, citizenship and the work after a promise',
  question: 'What changes on a political turning point—and what still has to be built?',
  duration: '35–50 minutes',
  introduction:
    'Follow four investigations in chronological order. They are comparisons of political change, not a claim that one caused the next. Read a proclamation, a border timetable, a stamp and a voting photograph; ask who gained power, who could participate and what remained unsettled.',
  stops: [
    {
      subject: 'indonesia-independence',
      year: 1945,
      title: 'A proclamation begins a struggle',
      narrative:
        'Inspect the signatures and the short text. Use the phases to distinguish the declaration from Dutch recognition and the later unitary state.',
      object: 'indonesia-proclamation',
      compare: 'ghana-independence',
    },
    {
      subject: 'partition-1947',
      year: 1947,
      title: 'A political date and a disrupted home',
      narrative:
        'Follow the independence and boundary-announcement sequence. Use the place study to ask why a national milestone did not settle every family’s security.',
    },
    {
      subject: 'ghana-independence',
      year: 1957,
      title: 'New words on an older design',
      narrative:
        'Find what changed on the stamp and what remained underneath. Then read the debate to identify the powers that changed hands at independence.',
      object: 'ghana-independence-stamp',
      compare: 'indonesia-independence',
    },
    {
      subject: 'south-africa-rights',
      year: 1996,
      title: 'Bind a government to rights',
      narrative:
        'Move from the 1994 voting photograph to the 1996 constitutional text. Distinguish the right to govern from the rights that constrain government.',
      object: 'mandela-voting',
      compare: 'ghana-independence',
    },
  ],
  conclusion:
    'A proclamation, a transfer of sovereignty, an election and a constitutional right do different work. Each can change institutions without settling every question of safety, participation or material life. Explain the particular mechanism before comparing outcomes.',
  evidence: {
    prompt: 'Which conclusion best uses the evidence encountered on this journey?',
    options: [
      {
        text: 'A national independence date establishes when everyone gained equal rights and secure livelihoods.',
        supported: false,
        feedback:
          'The documents identify political changes. They do not measure every person’s rights, safety or livelihood.',
      },
      {
        text: 'Different milestones change different powers; later outcomes need evidence beyond the announcement or image.',
        supported: true,
        feedback:
          'The proclamation, stamp, border timetable and constitution let you identify specific changes and ask a separate question about their effects.',
      },
      {
        text: 'Because these transitions involved institutions, ordinary people played no part in them.',
        supported: false,
        feedback:
          'The Ghana account describes organizing networks, and the South African sources discuss public participation. Institutional history also involves people’s work.',
      },
    ],
    citations: [
      cite('indonesia-transfer', '1945 and 1949 milestones'),
      cite('ghana-debate-1957', 'Columns 23–26'),
      cite('sa-rights', 'Sections 7, 19, 26–29'),
    ],
  },
  returnPrompt:
    'Choose two cases. Name the power that changed, the evidence for that change and one outcome that needs more investigation.',
};

export function applyCitizenship(corpus: Corpus) {
  corpus.sources.push(...citizenshipSources);
  corpus.subjects.push(indonesia, ghana);
  deepenSouthAfrica(corpus.subjects.find((s) => s.id === 'south-africa-rights')!);
  corpus.contexts = [...(corpus.contexts ?? []), ...contexts];
  corpus.media.push(...citizenshipMedia);
  corpus.journeys.push(journey);
  const rights = corpus.sources.find((s) => s.id === 'sa-rights')!;
  rights.accessed = consulted;
  rights.scope =
    'Chapter 2 consulted: sections 7–10, 19, 26–29 and 38. Distinguishes everyone/citizens and different qualifications on social rights. Historical reading of constitutional commitments, not a measurement of implementation or legal advice.';
  corpus.glossary.push(
    {
      id: 'sovereignty',
      name: 'sovereignty',
      definition:
        'A claim to supreme political authority, including independence from another state. A declaration, recognition by other states and effective control can have different dates and histories.',
    },
    {
      id: 'federation',
      name: 'federation',
      definition:
        'A political arrangement in which powers are divided between a central government and constituent governments. Its actual distribution of authority must be read in the particular constitution or agreement.',
    },
  );
  const pack = corpus.packs.find((p) => p.id === 'C8')!;
  pack.investigations = [
    ...(pack.investigations ?? []),
    {
      title: 'Independence and citizenship, 1945–1997',
      journey: journey.id,
      comparison: ['indonesia-independence', 'ghana-independence'],
      start: 1945,
      end: 1997,
      question: journey.question,
      orientation:
        'A focused route through Indonesia, Partition, Ghana and South Africa. Compare different political milestones and their consequences.',
      geography:
        'Selected places in South and Southeast Asia and Africa. The map locates inquiries; it does not reconstruct borders or imply a route connecting the four transitions.',
      limits:
        'A four-case inquiry, not a complete account of decolonization or a global snapshot of 1950. Other African and Asian experiences, the Americas and Cold War institutions need further work.',
    },
  ];
  pack.coverage['Africa'].subjects.push('ghana-independence');
  pack.coverage['Africa'].reason +=
    ' Ghana adds a sourced independence and early-government inquiry; these cases do not supply a continent-wide modern framework.';
  pack.coverage['Southeast Asia/Oceania'].subjects.push('indonesia-independence');
  pack.coverage['Southeast Asia/Oceania'].reason +=
    ' Indonesia adds the selected 1945–1950 revolution and constitutional transition, not region-wide decolonization.';
  applyCitizenshipPlaces(corpus);
}
