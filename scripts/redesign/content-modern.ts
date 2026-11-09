import { dossier } from './editorial';
import { cite } from './content-helpers';
import type { Source, Journey, Pack } from '../../src/atlas/model';
const source = (
  id: string,
  title: string,
  institution: string,
  url: string,
  type: Source['type'],
  scope: string,
  accessed = '2026-10-26',
): Source => ({ id, title, institution, url, type, scope, accessed });
export const modernSources: Source[] = [
  source(
    'factory-act',
    '1833 Factory Act',
    'The National Archives, United Kingdom',
    'https://cdn.nationalarchives.gov.uk/documents/education/factory-actdoc.pdf',
    'archive',
    'Legislative summary on p. 2. The report extract and transcript on pp. 8–9 come from British Parliamentary Papers (1836), p. 353. The inspectors recount evidence about one firm.',
    '2026-11-04',
  ),
  source(
    'hine',
    'A little spinner in the Mollahan Mills, Newberry, South Carolina',
    'Library of Congress, National Child Labor Committee collection',
    'https://www.loc.gov/item/2018674890/',
    'primary',
    'Lewis W. Hine, 3 December 1908, caption card and photograph, Hine 358; LC-DIG-nclc-01451; no known restrictions on publication.',
  ),
  source(
    'hine-context',
    'The Faces of Child Labor',
    'Library of Congress, Kristi Finefield',
    'https://blogs.loc.gov/picturethis/2019/11/the-faces-of-child-labor/',
    'archive',
    'Hine’s NCLC project, photographs and research context; no claim one image measures prevalence.',
  ),
  source(
    'tomioka',
    'Tomioka Silk Mill and Related Sites',
    'UNESCO World Heritage Centre',
    'https://whc.unesco.org/en/list/1449/',
    'archaeology',
    'Integrated production, local sericultural traditions and imported/adapted technology.',
  ),
  source(
    'tomioka-local',
    'Tomioka Silk Mill and Related Sites',
    'Gunma Prefecture, Japan',
    'https://worldheritage.pref.gunma.jp/tomikinu/index.php/en/',
    'archive',
    'Government mill opened October 1872; Japanese carpenters and French design; silk-producing region and training.',
  ),
  source(
    'haiti',
    'The Haitian Revolution',
    'English Heritage',
    'https://www.english-heritage.org.uk/visit/places/portchester-castle/history-and-stories/the-haitian-revolution/',
    'scholarship',
    '1791 uprising, emancipation and 1804 independence; plantation labor and competing interests. No unsupported population/casualty totals.',
  ),
  source(
    'haiti-declaration',
    'Liberté, ou la mort: Armée indigène',
    'University of Florida Digital Collections, copy held by The National Archives (UK)',
    'https://ufdcimages.uflib.ufl.edu/UF/00/09/95/42/00001/00003_Page_8.jpg',
    'primary',
    'Printed address, p. 7 (digital leaf 8 of UF00099542). The closing dateline names Gonaïves and 1 January 1804. Dessalines’s name appears in print below it.',
    '2026-11-04',
  ),
  source(
    'treaty-signing',
    'The Treaty of Waitangi and how it happened',
    'Archives New Zealand',
    'https://www.archives.govt.nz/discover-our-stories/the-treaty-of-waitangi/the-treaty-of-waitangi-and-how-it-happened',
    'archive',
    '6 February 1840 initial signing, circulating sheets, signatures and refusals; not universal consent on one day.',
  ),
  source(
    'treaty-texts',
    'What te Tiriti o Waitangi says in English and te reo Māori',
    'Archives New Zealand',
    'https://www.archives.govt.nz/discover-our-stories/the-treaty-of-waitangi/what-te-tiriti-o-waitangi-says-in-english-and-te-reo-maori',
    'primary',
    'Paired texts and explanation of article 1 governance/sovereignty and article 2 authority/property differences.',
  ),
  source(
    'partition',
    'Partition of British India',
    'The National Archives, United Kingdom',
    'https://www.nationalarchives.gov.uk/education/teaching-resources/partition-of-british-india/',
    'archive',
    'Indexed primary archival teaching account: August14/15 independence and August17 border announcement; DO142/416 identified. Direct page403, no unsupported quotation from the file.',
  ),
  source(
    'partition-army',
    'Independence and Partition,1947',
    'National Army Museum',
    'https://www.nam.ac.uk/explore/independence-and-partition-1947',
    'archive',
    'Museum account with soldiers’ letters/oral testimony and Last Indian Army Order14 August 1947. British military perspective acknowledged; no universal explanation or exact refugee total adopted.',
  ),
  source(
    'sa-rights',
    'Constitution: Chapter 2, Bill of Rights',
    'Department of Justice, South Africa',
    'https://www.justice.gov.za/legislation/constitution/chp02.html',
    'primary',
    'Sections 7,9,10,29: equality, dignity, education and state duties. Read as legal commitments, not measured implementation.',
  ),
  source(
    'sa-transition',
    'Milestones of20 Years of Freedom',
    'South African Government',
    'https://www.gov.za/issues/20years/milestones-20-years-freedom',
    'archive',
    '1994 transition and 1996 signing/1997 commencement; later events not used as proof that rights were fully realized.',
  ),
  source(
    'ww1',
    'Key facts about the First World War',
    'Imperial War Museums',
    'https://www.iwm.org.uk/history/first-world-war/key-facts',
    'scholarship',
    'Institutional indexed text and UKWebArchive capture consulted; global fronts and imperial participation. Direct page403. No numerical casualty claim.',
  ),
  source(
    'ww1-indian-service-geography',
    'British Indian Army: Soldiers of the First World War',
    'National Army Museum, in partnership with the United Service Institution of India',
    'https://www.nam.ac.uk/whats-on/british-indian-army-soldiers-first-world-war',
    'scholarship',
    'The 2023 exhibition account identifies East Africa and Mesopotamia among the campaigns where the Indian Army served.',
    '2026-11-04',
  ),
  source(
    'ww1-decisions',
    'The outbreak of the First World War in 1914',
    'Imperial War Museums',
    'https://www.iwm.org.uk/history/first-world-war/outbreak',
    'scholarship',
    'Institutional indexed/archived account: choices during July crisis, nationalism, militarism and empires; inevitability rejected.',
  ),
  source(
    'war-poster',
    'Woman your country needs you!',
    'Library of Congress',
    'https://www.loc.gov/item/2002708941/',
    'primary',
    '1917 recruiting poster, State and National Councils of Defense imagery; rights and original lettering. A recruiting appeal is not a record of every woman’s response.',
  ),
  source(
    'ww2',
    'World War II: In Depth',
    'United States Holocaust Memorial Museum',
    'https://encyclopedia.ushmm.org/content/en/article/world-war-ii-in-depth',
    'scholarship',
    'Asian expansion 1931/1937, European war 1939, occupation and 1945 endings; selected context, not all campaigns.',
  ),
  source(
    'holocaust',
    'Introduction to the Holocaust',
    'United States Holocaust Memorial Museum',
    'https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust',
    'scholarship',
    '1933–1945 persecution and genocide; six million Jews murdered, other targeted groups, choices and varied experiences.',
  ),
  source(
    'sputnik',
    'The Dawn of the Space Age',
    'NASA History Office',
    'https://www.nasa.gov/history/dawn-of-the-space-age/',
    'archive',
    '4 October 1957 Soviet launch and scientific/political/military significance; no equivalence of technology and social progress.',
  ),
  source(
    'sputnik-records',
    'Sputnik and the Space Race',
    'Eisenhower Presidential Library',
    'https://www.eisenhowerlibrary.gov/research/online-documents/sputnik-and-space-race',
    'primary',
    'October 1957 National Science Board response, NAID12060499; archive descriptions consulted, no invented document quotation.',
  ),
];
export const modernSubjects = [
  dossier({
    id: 'factory-reform',
    name: 'Factory reform: a law and the work of enforcement',
    aliases: ['Industrial Revolution', 'Factory Act1833'],
    kind: 'process',
    region: 'Europe',
    place: 'British textile factories; locator near Manchester',
    coordinates: [-2.24, 53.48],
    geo: 'Regional industrial anchor, not a location for every inspector’s report.',
    dates: [
      1833,
      1836,
      'Act in 1833; inspector evidence in 1836',
      'Selected law-and-enforcement investigation, not the beginning/end of industrialization or child labor.',
    ],
    packs: ['C8'],
    question: 'Does passing a law mean a workplace has changed?',
    summary:
      'Machines reorganized production and the pace of work, but protection for workers depended on institutions as well as invention. Britain’s 1833 textile-factory law set restrictions on children’s work. An inspector’s later report asks us to test the distance between a rule and its enforcement.',
    sections: [
      [
        'Read the rule precisely',
        'The archival summary describes age restrictions, certificates, reduced hours and schooling for children in textile factories. Its scope matters: a rule about particular factories is not an immediate ban on all child work across an empire.',
        'factory-act',
        'Opening legislative summary',
      ],
      [
        'Look after the announcement',
        'The 1836 inspector extract was written after the law. It is evidence for investigating enforcement and continued problems. One report cannot alone measure compliance everywhere, but it prevents the easy assumption that a legal milestone instantly transformed practice.',
        'factory-act',
        'Source 1, 1836 report and teachers’ notes',
      ],
      [
        'Machines are part of a social system',
        'The source sequence joins production to childhood, schooling and government inspection. Compare the later American photograph to ask what additional evidence would establish a change in working conditions. Different countries and decades should not be folded into one universal factory experience.',
        'factory-act',
        'Source sequence and legislative timeline',
      ],
    ],
    fact: [
      'The archival investigation pairs the 1833 law with an 1836 inspector report to test enforcement.',
      'factory-act',
      'Teacher’s Notes, p. 3, and Source 1, pp. 8–9',
    ],
    factCheckedOn: '2026-11-04',
    terms: ['industrialization', 'evidence'],
    dimensions: [
      [
        'Work and production',
        'Textile production involved children’s labor and contested regulation.',
        'factory-act',
        'Legislative summary',
      ],
      [
        'Authority and participation',
        'A written restriction required inspection and implementation, whose success needs evidence.',
        'factory-act',
        'Teachers’ notes',
      ],
    ],
    prompt:
      'What evidence would convince you that a workplace protection actually worked?',
  }),
  dossier({
    id: 'hine-labor',
    name: 'A child in a cotton mill: photograph and caption',
    aliases: ['Lewis Hine', 'NCLC', 'Child labor'],
    kind: 'document',
    region: 'Americas',
    place: 'Newberry, South Carolina, United States',
    coordinates: [-81.62, 34.27],
    geo: 'Named mill town from Hine’s caption, not the child’s home address.',
    dates: [
      1908,
      1908,
      '3 December 1908',
      'Date of photograph and caption; not a known birth date, age or whole working life.',
    ],
    precision: 'exact',
    packs: ['C8'],
    question: 'What does a photograph show, and what does its caption claim?',
    summary:
      'Lewis Hine photographed a young person beside spinning machinery for the National Child Labor Committee. His caption records an overseer’s denial that she was working. The image and accompanying statement are related evidence with different authorship and limits.',
    sections: [
      [
        'Look before reading',
        'The photograph places a child-sized figure beside a long row of spinning machinery. It lets us examine scale, clothing and setting. A single image cannot directly establish age, hours, pay or how typical the scene was.',
        'hine',
        'Photograph LC-DIG-nclc-01451',
      ],
      [
        'A caption makes an argument',
        'Hine recorded that the overseer said she had merely come in. That is Hine’s account of a conversation, preserved on an NCLC caption card. The disagreement makes source purpose visible: a reform campaigner and a mill overseer had different interests in explaining the same scene.',
        'hine',
        'Caption card, Hine no. 358',
      ],
      [
        'Use a series and other records',
        'The Library’s project account sets these photographs within a longer reform effort. To investigate prevalence or change, compare other photographs, employment records, laws and inspection. Evidence can be powerful without answering every question by itself.',
        'hine-context',
        'Project scope and research example',
      ],
    ],
    fact: [
      'The catalogue dates the photograph to 3 December 1908 and identifies its caption as an NCLC caption card.',
      'hine',
      'Created/Published and Notes',
    ],
    objects: ['loc-hine'],
    terms: ['primary-source', 'archive', 'industrialization'],
    dimensions: [
      [
        'Work and production',
        'The image documents a particular cotton-mill setting; hours and pay need other records.',
        'hine',
        'Photograph and caption',
      ],
      [
        'Surviving evidence',
        'Photograph and reformer’s caption should be examined separately before being combined.',
        'hine',
        'Notes and caption',
      ],
    ],
    prompt:
      'Write one observation from the image and one claim that depends on the caption.',
  }),
  dossier({
    id: 'tomioka',
    name: 'Tomioka: adapting an industrial system',
    aliases: ['Meiji Japan', 'Silk reeling'],
    kind: 'place',
    region: 'East Asia',
    place: 'Gunma Prefecture, Japan',
    coordinates: [138.89, 36.25],
    geo: 'Mill-site locator within a regional production system.',
    dates: [
      1872,
      1872,
      'Model mill opened October 1872',
      'Opening event; the mill and associated techniques continued afterward. This is not an endpoint for Japanese industrialization.',
    ],
    precision: 'exact',
    packs: ['C8'],
    question: 'What does it take to move a technology between places?',
    summary:
      'Tomioka joined imported French machinery and advice with Japanese building work and established silk-producing knowledge. Industrialization involved adaptation, training and supply networks. It was more than unpacking a foreign machine.',
    sections: [
      [
        'Build on an existing region',
        'Gunma’s local account places the government mill’s opening in October 1872. Japanese carpenters built to French designs, combining timber frames, brick and Japanese finishes. The surrounding silk-producing region supplied experience as well as raw material.',
        'tomioka-local',
        'Tomioka Silk Mill section',
      ],
      [
        'Follow the whole process',
        'UNESCO treats the mill with farming, training and egg-storage sites as an integrated system. A machine depended on biological production, preservation, instruction and skilled work. The related sites were developed at different moments, not all opened together in 1872.',
        'tomioka',
        'Description and Brief synthesis',
      ],
      [
        'Ask about people as well as output',
        'The local account describes women recruited to operate the reeling machines, training by French women, and dormitory life. This places workers within the production story. A model factory’s institutional account still cannot establish every worker’s experience or prove that mechanization always improved life.',
        'tomioka-local',
        'Women Mill Workers',
      ],
    ],
    fact: [
      'The mill opened in October 1872, combining French technical input with Japanese construction and regional silk expertise.',
      'tomioka-local',
      'Tomioka Silk Mill',
    ],
    terms: ['industrialization', 'inference'],
    dimensions: [
      [
        'Work and production',
        'Imported machinery worked within local farming, training and construction networks.',
        'tomioka',
        'Brief synthesis',
      ],
      [
        'Surviving evidence',
        'Industrial heritage documents a production system more directly than every worker’s experience.',
        'tomioka',
        'Integrity and composition',
      ],
    ],
    prompt: 'What local skills would a newly imported machine still depend on?',
  }),
  dossier({
    id: 'haitian-revolution',
    name: 'Haiti: freedom fought for in a plantation world',
    aliases: ['Saint-Domingue', 'Toussaint Louverture', 'Dessalines'],
    kind: 'process',
    region: 'Americas',
    place: 'Saint-Domingue/Haiti, Caribbean',
    coordinates: [-72.68, 19.45],
    geo: 'Gonaïves declaration-region locator; the revolution involved many places and changing alliances.',
    dates: [
      1791,
      1804,
      'Revolutionary investigation, 1791–1804',
      'Uprising to independence; not the end of the consequences of slavery or colonial power.',
    ],
    packs: ['C7', 'C8'],
    question: 'Who made freedom, and why was it contested?',
    summary:
      'Enslaved people’s resistance transformed Saint-Domingue, a French plantation colony. Revolutionary promises, emancipation, competing armies and attempts to restore slavery shaped a long struggle. Haiti declared independence in 1804; freedom was achieved through action, not simply granted by a distant declaration.',
    sections: [
      [
        'Labor and competing claims',
        'English Heritage places the 1791 uprising within plantation production and wider Atlantic conflict. Free people of color, white elites and enslaved people did not have identical interests. A story of “the revolution” needs those differences as well as its shared struggle against domination.',
        'haiti',
        'Transatlantic World and Beginning of Revolution',
      ],
      [
        'Emancipation was contested',
        'France abolished slavery in its colonies in 1794. Napoleon’s 1802 effort to restore colonial control and slavery met resistance in Saint-Domingue. The sequence shows that a formal emancipation could be threatened; maintaining freedom required further struggle.',
        'haiti',
        '1793–1804 sequence',
      ],
      [
        'A declaration in its own archive',
        'The printed address closes with a dateline at Gonaïves on 1 January 1804. Dessalines’s name appears in type beneath it. This record establishes a political claim and its date; it is not a complete account of every participant or of the inequalities that followed.',
        'haiti-declaration',
        'Printed p. 7, closing dateline and attribution',
      ],
    ],
    fact: [
      'The printed pamphlet dates Dessalines’s address at Gonaïves on 1 January 1804.',
      'haiti-declaration',
      'Printed p. 7 (digital leaf 8), final dateline above Dessalines’s name',
    ],
    factCheckedOn: '2026-11-04',
    terms: ['enslavement', 'colonialism', 'primary-source'],
    dimensions: [
      [
        'Authority and participation',
        'Enslaved people’s resistance and differing revolutionary interests shaped independence.',
        'haiti',
        'Beginning of Revolution',
      ],
      [
        'Surviving evidence',
        'A declaration establishes a political statement; other records are needed for the lives of its many participants.',
        'haiti-declaration',
        'Printed p. 7, final appeal and attribution',
      ],
    ],
    prompt: 'Why is the history of freedom longer than the date of one declaration?',
  }),
  dossier({
    id: 'tiriti',
    name: 'Te Tiriti o Waitangi: texts, signatures and authority',
    aliases: ['Treaty of Waitangi', 'Māori', '1840'],
    kind: 'document',
    region: 'Southeast Asia/Oceania',
    place: 'Waitangi and signing places across Aotearoa New Zealand',
    coordinates: [174.08, -35.27],
    geo: 'Initial signing locator; sheets circulated to other places and did not reach every community.',
    dates: [
      1840,
      1840,
      'Initial signing 6 February 1840; further signings through 1840',
      'Document/signing chronology, not the beginning or end of Māori identity or agreement on every later interpretation.',
    ],
    precision: 'exact',
    packs: ['C8'],
    question: 'What happens when two texts promise different things?',
    summary:
      'Te Tiriti exists in Māori and English texts with consequential differences. Signatures were gathered at many places over months, and some rangatira declined or had no opportunity to sign. One date and one translated sentence cannot stand for universal consent.',
    sections: [
      [
        'Signing was a process',
        'The Waitangi signing began on 6 February 1840. Archives New Zealand describes sheets circulating and signatures continuing into September. The Māori text received most signatures. The record includes uncertainty, refusal and uneven opportunity, which a single celebratory date can conceal.',
        'treaty-signing',
        'Initial signing and circulating sheets',
      ],
      [
        'Read both texts',
        'Archives New Zealand explains the distinction between kāwanatanga, governance, and sovereignty in article 1, and tino rangatiratanga, authority, in article 2. The paired texts are not exact equivalents. Translation is part of the historical issue rather than a clerical detail to smooth away.',
        'treaty-texts',
        'Articles 1 and2',
      ],
      [
        'Consent needs a context',
        'A signature establishes a mark on a particular sheet, not identical understandings among all signatories. Ask what was explained, which text was heard, and what authority people expected to retain. This dossier preserves the textual issue without pretending to adjudicate every later legal claim.',
        'treaty-signing',
        'Discussion, doubts and refusals',
      ],
    ],
    fact: [
      'The Māori and English texts differ significantly over governance, sovereignty and retained authority.',
      'treaty-texts',
      'Articles 1 and2',
    ],
    terms: ['primary-source', 'colonialism'],
    dimensions: [
      [
        'Authority and participation',
        'Many signings, refusals and absent opportunities complicate any claim of uniform consent.',
        'treaty-signing',
        'Circulation and refusal',
      ],
      [
        'Surviving evidence',
        'Two language versions require comparison in context.',
        'treaty-texts',
        'Articles 1 and2',
      ],
    ],
    prompt:
      'What would you ask before saying that everyone understood an agreement in the same way?',
  }),
  dossier({
    id: 'partition-1947',
    name: '1947: independence and the disruption of home',
    aliases: ['India', 'Pakistan', 'Partition', 'Bengal', 'Punjab'],
    kind: 'process',
    region: 'South Asia',
    place: 'British India, especially Punjab and Bengal',
    coordinates: [74.87, 31.63],
    geo: 'Punjab-region anchor. No present-day sovereignty or detailed partition boundary is drawn.',
    dates: [
      1947,
      1947,
      'Independence and partition,August 1947',
      'Selected transition; neither national identity nor displacement began and ended in one month.',
    ],
    precision: 'exact',
    packs: ['C8'],
    question: 'How can political independence and personal insecurity happen together?',
    summary:
      'The end of British rule created India and Pakistan in 1947 while partition divided Punjab and Bengal. People celebrated political freedom amid forced movement and violence. A border on paper and a family’s ability to reach safety are different historical questions.',
    sections: [
      [
        'Decisions and dates',
        'The National Archives account distinguishes independence on 14 and15 August from the border announcement on 17 August. People could celebrate without knowing exactly where the line would fall. That sequence matters more than pretending a cleanly drawn line produced a settled reality.',
        'partition',
        'Regions affected by partition',
      ],
      [
        'Whose experience survives?',
        'The National Army Museum brings soldiers’ letters and later oral testimony into its account. They describe concern for families and divided units. This evidence adds individual experience, while its British military collection cannot speak for all civilians or all political movements.',
        'partition-army',
        'Law and order; Indian Army divided',
      ],
      [
        'An ending and a beginning',
        'Partition involved large-scale displacement and intercommunal violence, not only a transfer of government. This investigation avoids an unsupported exact death or refugee total. Letters, maps, administrative records and survivor accounts would need to be read together for fuller local histories.',
        'partition-army',
        'Partition and displacement sections',
      ],
    ],
    fact: [
      'The archival account separates independence on 14/15 August from the border announcement on 17 August 1947.',
      'partition',
      'Regions affected by partition',
    ],
    terms: ['decolonization', 'archive'],
    dimensions: [
      [
        'Authority and participation',
        'Political transfer and border decisions affected people who did not control the timetable.',
        'partition',
        'Background and border announcement',
      ],
      [
        'Surviving evidence',
        'Military letters and later testimony preserve particular viewpoints, not a universal civilian account.',
        'partition-army',
        'Letters and oral testimony',
      ],
    ],
    prompt:
      'What question would a family’s story add to a political map of independence?',
  }),
  dossier({
    id: 'south-africa-rights',
    name: 'South Africa: making rights a constitutional commitment',
    aliases: ['Apartheid', 'Mandela', 'Constitution1996'],
    kind: 'process',
    region: 'Africa',
    place: 'South Africa; Sharpeville signing context',
    coordinates: [27.87, -26.69],
    geo: 'Constitution-signing locality; a national political process extended far beyond this point.',
    dates: [
      1994,
      1997,
      'Democratic transition and final constitution, 1994–1997',
      'Selected transition:1996 signing and 1997 commencement are distinct. Not the end of every inequality or of the work of implementation.',
    ],
    packs: ['C8'],
    question: 'What is the difference between promising a right and realizing it?',
    summary:
      'South Africa’s transition from apartheid led to a democratic constitutional order. The final constitution names equality, dignity and education among its commitments. Reading those promises closely opens an investigation of institutions, participation and the continuing work required to make rights effective.',
    sections: [
      [
        'A process with distinct dates',
        'The government chronology distinguishes the 1994 transition, Mandela’s10 December 1996 signing of the final constitution and its 4 February 1997 commencement. Adoption, signature and implementation are not interchangeable dates.',
        'sa-transition',
        '1994;1996;1997 entries',
      ],
      [
        'Read a precise commitment',
        'Chapter 2 identifies equality in section 9, dignity in section 10 and education in section 29. Section 7 assigns duties to respect, protect, promote and fulfill rights. These are legal commitments with specific language, not a measurement showing that every person already enjoyed equal conditions.',
        'sa-rights',
        'Sections 7,9,10,29',
      ],
      [
        'Bring the question back to daily life',
        'A constitution structures the relationship between people and public power. To investigate its effects, one would need evidence about institutions and lived experience as well as the text. Compare factory reform: a legal milestone and effective realization answer different questions.',
        'sa-rights',
        'Section 7 duties and application',
      ],
    ],
    fact: [
      'The final constitution was signed in December 1996 and came into effect in February 1997.',
      'sa-transition',
      '1996–1997 entries',
    ],
    terms: ['decolonization', 'primary-source'],
    dimensions: [
      [
        'Authority and participation',
        'Constitutional duties set standards for public institutions after apartheid.',
        'sa-rights',
        'Sections 7 and9',
      ],
      [
        'Surviving evidence',
        'The text demonstrates commitments; implementation requires different evidence.',
        'sa-rights',
        'Sections 7 and29',
      ],
    ],
    prompt: 'Choose one right and name evidence that could help test its realization.',
  }),
  dossier({
    id: 'world-war-one',
    name: '1914–1918: a global war made by decisions',
    aliases: ['First World War', 'WWI', 'Great War'],
    kind: 'process',
    region: 'Europe',
    place: 'European crisis with global imperial fronts and labor',
    coordinates: [18.41, 43.86],
    geo: 'Sarajevo as crisis anchor; this point cannot represent every front or colonial participant.',
    dates: [
      1914,
      1918,
      'Conventional war frame, 1914–1918',
      'Major-war frame; regional fighting and political consequences did not all start or stop on the same day.',
    ],
    packs: ['C8'],
    question:
      'How did a European crisis become a war involving people around the world?',
    summary:
      'Leaders made decisions during a crisis within a world of competing states and empires. Soldiers, workers and civilians across regions became involved. The war belongs to histories of imperial power, mobilization and ordinary life as well as armies.',
    sections: [
      [
        'Contingency matters',
        'IWM’s account traces diplomatic and military decisions after the Sarajevo assassination. Alliances, nationalism, militarism and imperial competition shaped those choices. They did not make each decision automatic; a timeline arrow should not turn a contingent outcome into destiny.',
        'ww1-decisions',
        'July crisis and concluding explanation',
      ],
      [
        'A wider geography',
        'The museum emphasizes fighting beyond the Western Front, including eastern Europe, Africa and the Middle East. Empires drew colonial populations into war. A map of Europe alone would hide important participants and unequal relations of power.',
        'ww1',
        'Key fact1: global war',
      ],
      [
        'Mobilization has a voice',
        'A 1917 American poster calls women to service. It is evidence of a recruiting appeal and its imagined audience. It cannot tell us how every woman responded or which rights they enjoyed. Compare its public claim with other records of work, participation and exclusion.',
        'war-poster',
        'Title, date and original poster',
      ],
    ],
    fact: [
      'Indian troops served in Mesopotamia and East Africa during the First World War.',
      'ww1-indian-service-geography',
      'Exhibition description, paragraph listing the major campaigns',
    ],
    factCheckedOn: '2026-11-04',
    objects: ['loc-war-poster'],
    terms: ['empire', 'primary-source'],
    dimensions: [
      [
        'Authority and participation',
        'Governments and empires mobilized people with unequal control over decisions for war.',
        'ww1',
        'Global war',
      ],
      [
        'Surviving evidence',
        'A recruiting poster preserves a persuasive appeal rather than a neutral account of participation.',
        'war-poster',
        'Original image',
      ],
    ],
    prompt:
      'How can a map or poster make some participants visible and others invisible?',
  }),
  dossier({
    id: 'world-war-two',
    name: 'War, occupation and genocide',
    aliases: ['Second World War', 'WWII', 'Holocaust', 'Shoah'],
    kind: 'process',
    region: 'Europe',
    place: 'Europe, Asia and wider war zones; locator at Berlin',
    coordinates: [13.4, 52.52],
    geo: 'Nazi state-capital anchor; persecution and war extended far beyond it. No locator implies all victims lived here.',
    dates: [
      1933,
      1945,
      'Persecution 1933–1945; wider war contexts 1937/1939–1945',
      'Holocaust frame differs from war chronology: Japanese expansion inChina precedes European war in 1939. Not a single universal start for all regions.',
    ],
    packs: ['C8'],
    question:
      'How did institutions turn prejudice and conquest into persecution and mass murder?',
    summary:
      'Nazi Germany and its allies and collaborators persecuted and murdered six million European Jews in the Holocaust. Other groups were also targeted. War and occupation extended state violence across regions. This history requires attention to victims’ lives, decisions and institutions, rather than treating suffering as an anonymous total.',
    sections: [
      [
        'Distinguish connected chronologies',
        'USHMM dates the Holocaust 1933–1945. Its war account describes Japan’s 1931 Manchurian conquest and 1937 invasion of China, and Germany’s September 1939 invasion of Poland. These histories connect, but an atlas should not erase earlier Asian warfare to fit one European date.',
        'ww2',
        'German and Japanese Expansion; Invasion of Poland',
      ],
      [
        'Name the crime accurately',
        'The Holocaust was a systematic, state-sponsored persecution and genocide of European Jews by the Nazi regime, its allies and collaborators. Discrimination and exclusion intensified into mass murder. The museum also documents persecution and murder of other groups; their histories should not be erased or collapsed into one undifferentiated category.',
        'holocaust',
        'Definition, key facts and other victims',
      ],
      [
        'People were more than their persecution',
        'The museum’s individual histories and testimony offer ways to study lives and choices beyond a statistic. Its account distinguishes perpetrators, collaborators, bystanders and people who resisted or helped. A serious explanation asks how institutions and decisions enabled violence without claiming it was inevitable.',
        'holocaust',
        'Who was responsible; Jewish responses and rescue discussion',
      ],
    ],
    fact: [
      'USHMM identifies six million European Jews murdered in the Holocaust and a 1933–1945 frame distinct from the European war’s 1939 start.',
      'holocaust',
      'Opening definition and chronology',
    ],
    terms: ['genocide', 'archive'],
    dimensions: [
      [
        'Authority and participation',
        'State institutions, occupation and collaboration enabled systematic persecution; responses varied.',
        'holocaust',
        'Perpetrators and responses',
      ],
      [
        'Surviving evidence',
        'Documents and individual testimony must be read together; a total is not a biography.',
        'holocaust',
        'Individual experiences and definition',
      ],
    ],
    prompt:
      'Why should a history of victims preserve their lives and names as well as describe the crime?',
  }),
  dossier({
    id: 'sputnik',
    name: 'Sputnik: a signal heard around a divided world',
    aliases: ['Cold War', 'Space Race', 'Soviet Union'],
    kind: 'process',
    region: 'West/Central Asia',
    place: 'Launched from Soviet Central Asia, present-day Kazakhstan',
    coordinates: [63.34, 45.92],
    geo: 'Baikonur launch-region locator; no exact trajectory or ground track is reconstructed.',
    dates: [
      1957,
      1957,
      'Sputnik 1 launched 4 October 1957',
      'Launch date, not the whole satellite lifetime, Cold War or history of spaceflight.',
    ],
    precision: 'exact',
    packs: ['C8'],
    question: 'Why can a scientific achievement also become a political event?',
    summary:
      'The Soviet Union’s first artificial satellite transmitted a radio signal from orbit. The event belonged both to scientific investigation and Cold War competition. Its reception shows how the meaning of a technology depends on institutions, public expectations and military concerns.',
    sections: [
      [
        'An event and its wider setting',
        'NASA dates the launch to 4 October 1957 and places it within new scientific, technological, political and military developments. The satellite’s signal was a particular achievement; it did not establish that one society had solved all social or political problems.',
        'sputnik',
        'Opening and historical significance',
      ],
      [
        'Look at the response',
        'The Eisenhower Library preserves contemporary responses, including the National Science Board’sOctober 1957 statement. These records let us investigate how officials interpreted the event. An American archive is one viewpoint on a Soviet achievement, not the whole world’s reaction.',
        'sputnik-records',
        'National Science Board response, NAID12060499',
      ],
      [
        'Compare without a progress ladder',
        'A factory machine, an ancient water system and a satellite meet different needs under different institutions. Technological capacity does not automatically tell us about equality, freedom or wellbeing. Ask who funded a project, who worked on it, who benefited and what other priorities it displaced.',
        'sputnik',
        'Political, military and scientific context',
      ],
    ],
    fact: [
      'The Soviet Union launched Sputnik 1 on 4 October 1957.',
      'sputnik',
      'Opening',
    ],
    terms: ['primary-source', 'inference'],
    dimensions: [
      [
        'Work and production',
        'The launch depended on organized scientific and technical work in a state competition.',
        'sputnik',
        'Historical context',
      ],
      [
        'Surviving evidence',
        'Contemporary American responses provide one situated reception of the launch.',
        'sputnik-records',
        'October 1957 records',
      ],
    ],
    prompt:
      'What evidence would you need before saying a new technology made life better for everyone?',
  }),
];
const workJourney: Journey = {
  id: 'machines-work',
  title: 'Machines, work and who can choose',
  question: 'Who shaped the conditions of work?',
  duration: '25–35 minutes',
  introduction:
    'Compare resistance to coerced plantation labor, regulation, adaptation of machinery and a reform photograph. These are related questions with distinct legal and historical contexts.',
  stops: [
    {
      subject: 'haitian-revolution',
      year: 1804,
      title: 'Freedom required struggle',
      narrative: 'Distinguish emancipation, its threatened reversal and independence.',
    },
    {
      subject: 'factory-reform',
      year: 1836,
      title: 'Look after the law was passed',
      narrative: 'Use inspection to test implementation.',
    },
    {
      subject: 'tomioka',
      year: 1872,
      title: 'Importing a machine is only a beginning',
      narrative: 'Find the local skills and wider supply system.',
    },
    {
      subject: 'hine-labor',
      year: 1908,
      title: 'Separate photograph and caption',
      narrative: 'Describe what is visible, then consider the competing accounts.',
      object: 'loc-hine',
      compare: 'factory-reform',
    },
  ],
  conclusion:
    'Work changed through resistance, law, institutions, skilled adaptation and campaigning. Mechanization alone does not explain who had freedom, protection or control.',
  evidence: {
    prompt: 'What can the Hine image and caption establish most directly?',
    options: [
      {
        text: 'A particular photographed setting and Hine’s recorded account of an overseer’s response.',
        supported: true,
        feedback:
          'The photograph and caption have different evidentiary roles. Hours, age and prevalence need further records.',
      },
      {
        text: 'Every child in every factory worked exactly the same hours.',
        supported: false,
        feedback: 'One image cannot establish a universal quantity or experience.',
      },
    ],
    citations: [cite('hine', 'Photograph and caption')],
  },
  returnPrompt:
    'Name one change in production and one separate question about power over work.',
};
const rightsJourney: Journey = {
  id: 'promises-rights',
  title: 'Political freedom and the meaning of a promise',
  question: 'Who understood, shaped and benefited from political change?',
  duration: '25–40 minutes',
  introduction:
    'Read two treaty texts, a border timetable and a constitution. Ask who could participate and how a political commitment reaches everyday life.',
  stops: [
    {
      subject: 'tiriti',
      year: 1840,
      title: 'Read both texts',
      narrative:
        'Preserve consequential translation differences and the process of signing.',
    },
    {
      subject: 'partition-1947',
      year: 1947,
      title: 'A new border meets a household',
      narrative: 'Keep independence, border announcement and displacement distinct.',
    },
    {
      subject: 'south-africa-rights',
      year: 1996,
      title: 'A commitment with duties',
      narrative:
        'Read a specific right, then ask how implementation could be investigated.',
      compare: 'tiriti',
    },
  ],
  conclusion:
    'Political statements have audiences, language and consequences. Their texts matter, and so do participation, institutions and lived experience.',
  evidence: {
    prompt: 'Which statement respects the distinction between promise and outcome?',
    options: [
      {
        text: 'A constitutional right states a commitment; evidence of implementation must be investigated separately.',
        supported: true,
        feedback:
          'The legal text is strong evidence of the obligation. It does not itself measure whether everyone can exercise the right.',
      },
      {
        text: 'A signature proves identical understanding and universal consent.',
        supported: false,
        feedback:
          'The treaty record includes differing texts, refusals and uneven opportunities to sign.',
      },
    ],
    citations: [
      cite('sa-rights', 'Section 7'),
      cite('treaty-signing', 'Signing process'),
    ],
  },
  returnPrompt: 'Choose a promise and explain whose experience would help test it.',
};
const warJourney: Journey = {
  id: 'war-signals',
  title: 'Global war, state power and a new signal',
  question:
    'How do decisions and institutions connect large events to individual lives?',
  duration: '25–40 minutes',
  introduction:
    'This non-graphic investigation names persecution and genocide directly. Read with an adult when helpful, and pause whenever you wish.',
  stops: [
    {
      subject: 'world-war-one',
      year: 1917,
      title: 'Look beyond one front',
      narrative: 'Read a recruiting appeal as persuasion within a global imperial war.',
      object: 'loc-war-poster',
    },
    {
      subject: 'world-war-two',
      year: 1942,
      title: 'Distinguish connected histories',
      narrative: 'Keep war chronology, genocide and individual experience visible.',
    },
    {
      subject: 'sputnik',
      year: 1957,
      title: 'An achievement with several meanings',
      narrative:
        'Investigate scientific success and a particular archive of political responses.',
    },
  ],
  conclusion:
    'Events did not happen by themselves. Institutions and choices connected science, state power, propaganda and violence. People’s lives should not disappear behind either triumphal images or totals.',
  evidence: {
    prompt:
      'Why does this atlas keep more than one starting date for the Second World War context?',
    options: [
      {
        text: 'War in Asia and war in Europe had different chronologies, while the Holocaust has its own 1933–1945 frame.',
        supported: true,
        feedback:
          'USHMM distinguishes these connected histories. One regional starting date cannot stand for all of them.',
      },
      {
        text: 'All regions entered the same conflict simultaneously in 1939.',
        supported: false,
        feedback:
          'The source describes Japanese conquest in 1931/1937 before Germany’s1939 invasion of Poland.',
      },
    ],
    citations: [
      cite('ww2', 'German and Japanese Expansion'),
      cite('holocaust', 'Chronology'),
    ],
  },
  returnPrompt:
    'What does a public image encourage you to see, and what evidence would broaden that view?',
};
export const modernJourneys = [workJourney, rightsJourney, warJourney];
export const modernPack: Pack = {
  id: 'C8',
  title: 'Industry, empire and struggles over the future',
  start: 1800,
  end: 2000,
  anchor: 1947,
  displayWindow: { start: 1791, end: 2000 },
  question:
    'How did industry, empire, resistance, mass politics, war, decolonization and technology shape ordinary lives?',
  orientation:
    'Three investigations connect work and machines, political promises, and war and technology. Begin with a photograph or document, then follow the institutions and choices around it. The chapter’s2000 boundary clips the view; it does not end ongoing societies.',
  journey: 'machines-work',
  comparison: ['factory-reform', 'hine-labor'],
  geography:
    'Cases connect Britain, the Caribbean and United States, Japan, Aotearoa, South Asia, South Africa, European/global wars and Soviet Central Asia. No single nation supplies a universal path into modern life.',
  limits:
    'Selective investigations, not a complete modern survey. Latin America beyond Haiti, China’s twentieth century, Middle Eastern national movements, African regions beyond South Africa and post-1960 computing need fuller treatment. War coverage explains major contexts and genocide without cataloguing every campaign.',
  coverage: {
    Americas: {
      status: 'researched',
      reason:
        'Haiti resistance and independence; US child-labor reform evidence. Other regions limited.',
      subjects: ['haitian-revolution', 'hine-labor'],
    },
    Africa: {
      status: 'researched',
      reason:
        'South African transition, constitutional rights and implementation questions; not the whole continent’s decolonization.',
      subjects: ['south-africa-rights'],
    },
    Europe: {
      status: 'researched',
      reason:
        'Factory regulation, global war and state persecution, with contextual limits.',
      subjects: ['factory-reform', 'world-war-one', 'world-war-two'],
    },
    'West/Central Asia': {
      status: 'limited',
      reason:
        'Soviet Central Asian launch context and Cold War reception; local Kazakh experience and wider regional politics need fuller accounts.',
      subjects: ['sputnik'],
    },
    'South Asia': {
      status: 'researched',
      reason:
        'Independence, partition, border chronology and ordinary-life disruption.',
      subjects: ['partition-1947'],
    },
    'East Asia': {
      status: 'researched',
      reason:
        'Tomioka’s adapted industrial system, and Japanese/Chinese wartime chronology in the global-war case.',
      subjects: ['tomioka', 'world-war-two'],
    },
    'Southeast Asia/Oceania': {
      status: 'researched',
      reason:
        'Te Tiriti texts, consent and signing processes; Southeast Asian decolonization remains limited.',
      subjects: ['tiriti'],
    },
  },
};
