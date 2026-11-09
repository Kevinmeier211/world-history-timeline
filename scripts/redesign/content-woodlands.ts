import { dossier } from './editorial';
import { cite } from './content-helpers';
import type { Journey, Source, Subject } from '../../src/atlas/model';
const accessed = '2026-10-27';
const source = (
  id: string,
  title: string,
  institution: string,
  url: string,
  type: Source['type'],
  scope: string,
  author?: string,
): Source => ({ id, title, institution, url, type, scope, author, accessed });
export const woodlandSources: Source[] = [
  source(
    'ocmu-floor-image',
    'Earth Lodge floor: interior photograph',
    'National Park Service',
    'https://www.nps.gov/ocmu/index.htm',
    'catalogue',
    'Specific image-carousel item Earth Lodge floor, filename 3C79797E-1DD8-B71B-0B467EFC07A0E785.jpg, explicitly credited NPS. Original 526×339, exposure date not supplied. Its older 1015 caption is checked against the newer study; no general homepage claim is used as archaeological verification.',
  ),
  source(
    'ocmu-earthlodge',
    'Earth Lodge',
    'National Park Service',
    'https://www.nps.gov/places/ocmulgee-mounds-earth-lodge.htm',
    'archaeology',
    'Reconstructed walls/ceiling from the late 1930s, surviving clay floor, council-chamber interpretation and older 1015 date. NPS/Martinson exterior photograph credited. The older date is read against the newer collaborative study, not adopted as an exact construction year.',
  ),
  source(
    'ocmu-chronology',
    'Collaborative Archaeology, Public Parks, and the Importance of Chronology at Ocmulgee Mounds National Historical Park',
    'American Antiquity 91(1), 183–206; Cambridge University Press',
    'https://doi.org/10.1017/aaq.2025.10106',
    'archaeology',
    'Thompson et al., online 19 December 2025 / January 2026 issue. The Earthlodge and Council Houses; Results: Earthlodge; Discussion. Older 1015 median, roof timber cut sometime after c.1160, possible earlier structure, modeled Middle Plateau occupation and limits of abandonment claims. No exact replacement construction year or single site-wide occupation span is inferred.',
    'Victor D. Thompson, Jennifer Birch, Raelynn Butler and colleagues',
  ),
  source(
    'ocmu-muscogee',
    'The Muscogee Nation',
    'National Park Service',
    'https://www.nps.gov/ocmu/learn/historyculture/the-muscogee-nation.htm',
    'scholarship',
    'Early Interactions: dalwa/town, settlement and surrounding villages, councils and a confederacy of towns; nineteenth-century forced removal and later political institutions. Broad town/population quantities are not repeated.',
  ),
  source(
    'muscogee-councilhouse',
    'The Council House: History',
    'Muscogee (Creek) Nation, Creek Nation Council House',
    'https://www.creekcouncilhouse.net/history',
    'primary',
    'Council House as a bridge between southeastern homelands and Indian Territory; 1878 governmental building, later dispossession and recovery. Used for historical continuity, not as a date for the Ocmulgee Earthlodge.',
  ),
  source(
    'laine-chronology',
    'A Centennial Ambiguity: the Date of the Jean-Baptiste Lainé (Mantle), Ontario, Site',
    'Radiocarbon 64(2), 279–308; Cambridge University Press',
    'https://doi.org/10.1017/RDC.2022.23',
    'archaeology',
    'Manning and Birch 2022: abstract; Introduction; short-lived samples and Figure 2; Discussion/Conclusions. Earlier 1500–1530 attribution, calibration ambiguity near 1500/1600 and preferred c.1595–1626 model. Abstract/body express probability ranges differently, so the atlas does not attach one confidence percentage or treat bounds as directly observed founding/abandonment dates. Article and original Figure 2 are CC BY 4.0.',
    'Sturt W. Manning and Jennifer Birch',
  ),
  source(
    'laine-wendat',
    'Jean-Baptiste Lainé: public interpretation',
    'Town of Whitchurch-Stouffville; Wendat Nation, Onyionhwentsïio’ Office',
    'https://townofws.ca/play/museum/exhibits/jean-baptiste-laine/',
    'primary',
    'Signs 1–2 expressly credit summaries to the Wendat Nation; signs 3–5 explain the reclaimed site name, late-sixteenth/early-seventeenth-century village, farming/trade/diplomacy and three-sisters fields. Estimated population and artifact quantities are not treated as settled measurements.',
  ),
  source(
    'canandaigua-archive',
    'Ratified Indian Treaty 21: Six Nations, Konondaigua, 11 November 1794',
    'National Archives / Indigenous Digital Archive Treaties Explorer',
    'https://digitreaties.org/treaties/treaty/12013172/',
    'archive',
    'NAID 12013172. Treaty signed 11 November 1794, with U.S. instrument of ratification dated 21 January 1795. Full recto scan includes incorporated treaty, names/seals and ratification; verso is not a second treaty. Public archival reproduction of an eighteenth-century federal document.',
  ),
  source(
    'canandaigua-onondaga',
    'The Canandaigua Treaty of 1794',
    'Onondaga Nation',
    'https://www.onondaganation.org/government/the-canandaigua-treaty-of-1794/',
    'primary',
    'Haudenosaunee Decision and treaty text, particularly Articles I–III and VII: diplomacy, peace, land acknowledgments and redress. Community historical framing is distinguished from the text’s promises. No current legal-status advice or assertion of complete enforcement.',
    'Deyhow ähda·dih — Bradley Powless',
  ),
  source(
    'onondaga-wampum',
    'Wampum',
    'Onondaga Nation',
    'https://www.onondaganation.org/culture/wampum/',
    'primary',
    'Opening explanation: shell bead-making, speakers and remembered agreements, council invitations, responsibilities and living history. A picture of beads alone does not transcribe an agreement; no restricted belt image is reproduced.',
  ),
  source(
    'phoenix-catalogue',
    'Cherokee Phoenix, New Echota, 1828–1829',
    'Library of Congress',
    'https://www.loc.gov/item/sn83020866',
    'archive',
    'About this Newspaper: 1825 commission for English/Cherokee type, Sequoyah’s 1821 syllabary, first issue 21 February 1828, printed laws/news and 1832 editorial disagreement. Specific resignation season differs among summaries; only the shared 1832 year is used.',
  ),
  source(
    'phoenix-photo',
    'Cherokee Phoenix, New Echota, Georgia',
    'Library of Congress; image also reproduced by NPS',
    'https://www.loc.gov/item/97512373/',
    'archive',
    'Summary identifies the title page from 10 April 1828; LC-USZ62-115659. No known restrictions on publication. The source image visibly reads April 10, 1828, vol.1 no.8. This is not the February first issue; photographic reproduction date is not supplied.',
  ),
  source(
    'phoenix-constitution',
    'Constitution of the Cherokee Nation, printed 21 February 1828',
    'Cherokee Phoenix; Western Carolina University transcription',
    'https://www.wcu.edu/library/DigitalCollections/CherokeePhoenix/Vol1/no01/constitution-of-the-cherokee-nation-page-1-column-2a-page-2-column-3a.html',
    'primary',
    'Vol.1 no.1, p.1 col.2a–p.2 col.3a. July 1827 constitution; Article I land/common property, Article II departments, Article III §§4 and 7 limits on office and voting by sex/status/ancestry. Historical exclusions are described without adopting its racist terminology.',
  ),
  source(
    'cherokee-nation-history',
    'The History of the Cherokee Nation',
    'Cherokee Nation',
    'https://www.cherokee.gov/about-the-nation/history/',
    'primary',
    'Conflicts with Georgia and Forced Removal, Internal Conflict, and Reunification: 1827 constitution, unauthorized 1835 signatories, forced removal from 1838 and 1839 political reorganization. No mortality total, current legal-status claim or implication that all Cherokee people followed one route.',
  ),
  source(
    'rice-linde',
    'Wild rice / Linde',
    'Library of Congress',
    'https://www.loc.gov/pictures/collection/cph/item/2020637524/',
    'archive',
    'Carl Gustave Linde, catalogued [1913], LC-DIG-ds-14380. Ojibwe person in a canoe beside other canoes in rice grasses; Ontario location probable and person not named. No known restrictions on publication. Photographer, uncertain location and catalogue date retained.',
    'Carl Gustave Linde',
  ),
  source(
    'rice-goodberry',
    'Manoomin: The Good Berry',
    'Great Lakes Indian Fish & Wildlife Commission; Saginaw Chippewa Indian Tribe archive',
    'https://www.scit-nsn.gov/planning/pdf/2017/resources/glifwc/Wild%20Rice/Goodberry_Brochure.pdf',
    'primary',
    'PDF pp.2 and 5–6: cultural/food significance; Harvesting and Processing based on Lac du Flambeau students Jeff Allen, Raelle Allen, Gabrielle Poupart and Bill Eckerstorfer; drying, parching, hulling and winnowing. Undated brochure is later interpretation, not a 1913 transcript. Nutritional superiority claims, yields and harvesting regulations are not adopted.',
  ),
  source(
    'rice-stcroix',
    'Manoomin',
    'St. Croix Chippewa Indians of Wisconsin',
    'https://stcroixojibwe-nsn.gov/manoomin/',
    'primary',
    '20 September 2022, opening cultural account: oral tradition and physical/spiritual sustenance. Used as later community interpretation; contemporary permit/season/equipment rules are outside this historical dossier.',
  ),
  source(
    'rice-glifwc',
    'Ganawenindiwag Manoomin Anishinaabeg',
    'Great Lakes Indian Fish & Wildlife Commission',
    'https://glifwc.org/stewardship/ganawenindiwag-manoomin-anishinaabeg',
    'primary',
    'Manoomin and Anishinaabeg; finishing steps; traditional ecological knowledge and research. Distinguish drying/parching/hulling/winnowing, community observation and environmental care. No present yield, regulatory or abundance estimate is projected into 1913.',
  ),
];
export const woodlandSubjects: Subject[] = [
  dossier({
    id: 'ocmulgee-council',
    name: 'Ocmulgee: a council building, a revised date and continuing ties',
    aliases: ['Ocmulgee', 'Muscogee', 'Creek', 'Earth Lodge', 'Earthlodge'],
    kind: 'place',
    region: 'Americas',
    place: 'Ocmulgee, beside the Ocmulgee River, present-day Macon, Georgia',
    coordinates: [-83.596, 32.839],
    geo: 'Locator for one ancestral place, not a boundary for all Muscogee towns or the findspot of every dated sample.',
    dates: [
      null,
      null,
      'Earthlodge construction chronology under revision',
      'No settled construction/use endpoints are plotted. The older 1015 label is a median of early radiocarbon determinations; newer roof-wood evidence indicates cutting sometime after c.1160 and leaves possible earlier construction unresolved. Neither observation dates the lifespan of Muscogee people or the whole Ocmulgee site.',
    ],
    precision: 'disputed',
    packs: ['C6'],
    question:
      'How can a building bring people together while its history remains open to revision?',
    summary:
      'Ocmulgee’s Earthlodge joins surviving clay, reconstructed walls and roof, archaeological interpretation and Muscogee connections to an ancestral place. Its arranged seating helps investigate a public gathering space. New dating work changes the familiar story, while community collaboration challenges the idea that a gap in an old chart proves that people abandoned a place forever.',
    sections: [
      [
        'Separate the surviving building from the reconstruction',
        'NPS identifies the clay floor as surviving ancient material, while the walls and ceiling were reconstructed in the late 1930s. The exterior photograph therefore shows an interpretation protecting an archaeological interior. It cannot reveal the exact ancient roof or who sat in each seat. Read the structure’s arrangement as evidence for gathering; a reconstructed doorway is not an untouched medieval entrance.',
        'ocmu-earthlodge',
        'Reconstruction paragraph: surviving floor and late-1930s walls/ceiling',
      ],
      [
        'A precise-looking date may hide an older method',
        'The collaborative study explains that 1015 is a median from older radiocarbon work. Newly analyzed roof wood instead indicates cutting sometime after about 1160; cane samples may also reflect an earlier structure. A latest preserved tree ring is not automatically the day a building was completed. This account retains the disagreement without drawing a false span between two unlike dates.',
        'ocmu-chronology',
        'Results: Earthlodge; Discussion: Earthlodge and Public Buildings',
      ],
      [
        'Gathering was part of political life',
        'The seating around the room and the more prominent platform support interpretation as a public council space. Elsewhere, NPS describes Muscogee political organization through towns, surrounding villages and councils. These are useful questions about organization rather than a recovered roll call for this particular room. Ancestral connections do not establish that every later office or custom already existed in exactly the same form.',
        'ocmu-chronology',
        'Earthlodge and Council Houses: seating and public-building interpretation',
      ],
      [
        'An archaeological gap is not a vanished people',
        'The study questions a simple site-wide abandonment story and works with Muscogee collaborators. Community history at the Council House in Okmulgee traces a bridge from southeastern homelands through forced removal to renewed political life in Indian Territory. That later building is not the Ocmulgee Earthlodge. Together these accounts invite a better question: what changed in a particular place, and what evidence shows continuing relationships?',
        'muscogee-councilhouse',
        'The Council House: bridge from southeastern homelands; governmental role from 1878',
      ],
    ],
    fact: [
      'The familiar 1015 construction label and newer roof-wood evidence answer different dating questions; the Earthlodge has no settled exact construction year in this atlas.',
      'ocmu-chronology',
      'Discussion: older median date, timber after c.1160 and possible earlier structure',
    ],
    objects: ['ocmulgee-floor', 'ocmulgee-exterior'],
    terms: [
      'evidence',
      'inference',
      'radiocarbon',
      'reconstruction',
      'terminus-post-quem',
    ],
    dimensions: [
      [
        'Work and materials',
        'Surviving clay, wooden supports and a modern protective reconstruction require different explanations.',
        'ocmu-earthlodge',
        'Ancient floor and reconstructed walls/ceiling',
      ],
      [
        'Knowledge and belonging',
        'Community collaboration and council-house history keep an ancestral place within a history of political continuity and change.',
        'muscogee-councilhouse',
        'Council House as a bridge from southeastern homelands',
      ],
      [
        'Evidence and authority',
        'Revised sample analysis can change a familiar institutional date without making a new exact birthday.',
        'ocmu-chronology',
        'Earthlodge results and discussion',
      ],
    ],
    prompt:
      'Choose one visible feature and one dating claim. What would you need to know before calling each ancient, reconstructed or uncertain?',
  }),
  dossier({
    id: 'wendat-laine',
    name: 'Wendat village life: Jean-Baptiste Lainé and the problem of dating',
    aliases: [
      'Wendat',
      'Huron-Wendat',
      'Jean-Baptiste Lainé',
      'Mantle',
      'longhouse',
      'Three Sisters',
    ],
    kind: 'place',
    region: 'Americas',
    place: 'Jean-Baptiste Lainé site, Whitchurch-Stouffville, Ontario',
    coordinates: [-79.232, 43.957],
    geo: 'Site-area locator in southern Ontario, not the boundary of all Wendat homelands or the location of every later Wendat community.',
    dates: [
      1595,
      1626,
      'Preferred modeled village range, c.1595–1626 CE',
      'Manning and Birch 2022 prefer a model around 1600 over the older c.1500–1530 estimate. These bounds summarize a model, not directly observed foundation and abandonment years. The article describes probability ranges differently in its abstract/body; no single confidence percentage is asserted here.',
    ],
    precision: 'range',
    packs: ['C7'],
    question: 'What changes when a village’s date moves by about a century?',
    summary:
      'The Jean-Baptiste Lainé site opens a history of Wendat farming, building, trade and diplomacy. Its public interpretation includes accounts supplied by the Wendat Nation. A scientific dating dispute also shows why a pottery style or the scarcity of European objects should not by itself determine a village’s calendar date. Communities remain more than labels in a sequence of excavations.',
    sections: [
      [
        'Begin with a community, not an old field name',
        'The public interpretation identifies the site as a late-sixteenth- to early-seventeenth-century ancestral Wendat village. It explains the change from Mantle to Jean-Baptiste Lainé, honoring a Wendat veteran. The Nation supplied the opening heritage summaries. A renamed site is not a newly invented past: the name makes visible whose heritage archaeologists are investigating.',
        'laine-wendat',
        'Signs 1–4: Nation-authored summaries, name and ancestral village',
      ],
      [
        'Village life joined fields and wider relationships',
        'The interpretation places Wendat villages beside fields of corn, squash and beans, with farming alongside fishing, hunting, gathering, trade and diplomacy. These activities needed repeated work, stored knowledge and relationships beyond one house. They do not make all Iroquoian-speaking peoples one nation. Nor does the survival of a decorated pot establish the daily experience or authority of every resident.',
        'laine-wendat',
        'Signs 1 and 5: farming, exchange and three-sisters fields',
      ],
      [
        'Two date clusters do not make a century-long village',
        'Manning and Birch show that short-lived plant samples alone can fit calendar positions near either 1500 or 1600 because the calibration curve is not a straight ruler. Figure 2 displays that ambiguity. The two clusters represent alternative calendar placements, not proof of continuous occupation between them. Their fuller analysis uses additional constraints, including wood charcoal, to prefer a range around 1595–1626.',
        'laine-chronology',
        'Figure 2; Possible Constraints on Site Dating; Discussion/Conclusions',
      ],
      [
        'A changed calendar changes the historical question',
        'The older estimate used material styles and the scarcity of European goods in its reasoning. The newer placement complicates assumptions about when communities moved and how objects circulated. It does not prove a direct encounter with a particular European visitor. Compare the model with the Nation’s heritage account: scientific dating and community interpretation address related questions, but neither reduces a living people to a single archaeological site.',
        'laine-chronology',
        'Introduction: earlier attribution and community-sequence assumptions; Conclusions',
      ],
    ],
    fact: [
      'The preferred c.1595–1626 range is a modeled placement for an ancestral Wendat village; the earlier c.1500–1530 attribution is retained as a superseded interpretation rather than silently mixed into one span.',
      'laine-chronology',
      'Abstract, Introduction and Conclusions: alternative placements and preferred model',
    ],
    objects: ['laine-radiocarbon-2022'],
    terms: [
      'evidence',
      'inference',
      'radiocarbon',
      'calibration',
      'terminus-post-quem',
    ],
    dimensions: [
      [
        'Work and materials',
        'Fields, village buildings and exchange joined farming with other skilled work; no artifact can stand for every resident.',
        'laine-wendat',
        'Signs 1, 4 and 5',
      ],
      [
        'Knowledge and belonging',
        'The site’s name and public account include Wendat authority over how ancestral heritage is presented.',
        'laine-wendat',
        'Signs 1–3 and acknowledgements',
      ],
      [
        'Evidence and authority',
        'A modern probability plot compares dating models; it is not an ancient drawing or a population graph.',
        'laine-chronology',
        'Figure 2 and caption',
      ],
    ],
    prompt:
      'Explain why two peaks on a dating graph are different from a settlement lasting all the years between them.',
  }),
  dossier({
    id: 'haudenosaunee-canandaigua',
    name: 'Haudenosaunee diplomacy: Canandaigua, wampum and a promise',
    aliases: [
      'Haudenosaunee',
      'Iroquois',
      'Six Nations',
      'Canandaigua',
      'Konondaigua',
      'Onondaga',
      'wampum',
    ],
    kind: 'document',
    region: 'Americas',
    place: 'Canandaigua, present-day New York; six distinct Haudenosaunee nations',
    coordinates: [-77.281, 42.887],
    geo: 'Negotiation-place locator, not the limits of Haudenosaunee lands. The archival document does not turn six nations into one uniform experience.',
    dates: [
      1794,
      1795,
      'Treaty signed 11 November 1794; U.S. ratification 21 January 1795',
      'The bounds connect two documented actions, not the founding or ending of the Haudenosaunee or the duration of the promises. Treaty text, ratification instrument and later community interpretation have distinct dates and roles.',
    ],
    precision: 'exact',
    packs: ['C7'],
    question:
      'What makes a promise between nations—and what would show that it was kept?',
    summary:
      'At Canandaigua, Haudenosaunee representatives and a United States agent negotiated peace and land commitments. The surviving document records promises, names and seals. Onondaga accounts place diplomacy beside wampum, speakers and responsibilities. Neither a sheet of paper nor a photograph of beads can alone show how every agreement was understood or carried out.',
    sections: [
      [
        'Read the actions and their dates separately',
        'The archive identifies a treaty signed on 11 November 1794 and a U.S. instrument of ratification dated 21 January 1795. The displayed recto incorporates treaty text, names and seals within that ratification document. Its opening Washington heading is therefore not evidence that the treaty was first negotiated in 1795. The two acts belong in a sequence, with no invented endpoint for the nations concerned.',
        'canandaigua-archive',
        'NAID 12013172: Contains and full recto scan',
      ],
      [
        'Land and peace were concrete commitments',
        'Articles I–III establish peace and address particular nations’ lands. Onondaga’s account places the decision to negotiate within a history of war, damaged communities and pressure from U.S. expansion. The document is evidence of commitments made in those circumstances. It is not proof that every later official respected them, or that every person experienced negotiation as an equal choice.',
        'canandaigua-onondaga',
        'Haudenosaunee Decision; treaty Articles I–III',
      ],
      [
        'Wampum works with speakers and memory',
        'Onondaga explains the labor of shaping, smoothing and drilling shell beads. It describes wampum as a record carried through spoken agreements, remembered histories and council responsibilities. A woven pattern does not decode itself for an outside observer. Reading the paper with this account broadens what counts as political knowledge without pretending that an image license gives unrestricted authority over every community meaning.',
        'onondaga-wampum',
        'Opening paragraphs: bead-making, living record, speakers and council invitations',
      ],
      [
        'A promise needs an inquiry into performance',
        'Article VII provides a way to address injuries rather than allowing private retaliation to break the peace. That clause helps distinguish what the parties said should happen from what actually followed. To evaluate performance, a historian would need evidence of particular disputes and responses beyond the treaty alone. This historical investigation offers no ruling on present-day land claims or legal enforcement.',
        'canandaigua-onondaga',
        'Treaty Article VII: complaints and redress',
      ],
    ],
    fact: [
      'The treaty’s 1794 signing and the U.S. ratification in January 1795 are separate actions recorded in the same archival file; neither date establishes complete performance of its promises.',
      'canandaigua-archive',
      'File contents, creation date and ratification instrument',
    ],
    objects: ['canandaigua-ratification'],
    terms: ['evidence', 'inference', 'primary-source', 'wampum', 'ratification'],
    dimensions: [
      [
        'Work and materials',
        'Manuscript production, seals and shell-bead work are distinct material parts of diplomacy.',
        'onondaga-wampum',
        'Bead-making and agreements',
      ],
      [
        'Knowledge and belonging',
        'Community speakers, memory and responsibilities explain meanings a document image cannot supply alone.',
        'onondaga-wampum',
        'Living record, speakers and council use',
      ],
      [
        'Evidence and authority',
        'Treaty clauses establish commitments; proving their fulfillment requires further records of conduct.',
        'canandaigua-onondaga',
        'Articles I–III and VII',
      ],
    ],
    prompt:
      'Choose one promise in the treaty. What different source would help you investigate whether people acted on it?',
  }),
  dossier({
    id: 'cherokee-print',
    name: 'Cherokee printing: language, political debate and forced removal',
    aliases: [
      'Cherokee',
      'Cherokee Phoenix',
      'Sequoyah',
      'New Echota',
      'syllabary',
      'Trail of Tears',
      'Elias Boudinot',
    ],
    kind: 'process',
    region: 'Americas',
    place:
      'New Echota and southeastern Cherokee homelands; forced removal to Indian Territory',
    coordinates: [-84.908, 34.541],
    geo: 'The locator marks New Echota’s printing and political context. It is not a single removal route or a claim that all Cherokee people left the southeast.',
    dates: [
      1821,
      1839,
      'Selected language/printing/removal inquiry, 1821–1839',
      'Sequoyah’s syllabary, newspaper publication and political reorganization frame the inquiry. The April 1828 image is not the February first issue. Forced removal from 1838 and the 1839 constitution do not mark the end of Cherokee people, language or printing.',
    ],
    packs: ['C8'],
    question:
      'How could a newspaper support a nation’s voice without guaranteeing safety or equality?',
    summary:
      'Cherokee printing connected language, practical production and political argument. The Phoenix printed Cherokee and English material in a time of severe pressure on the Nation’s lands. Its pages are evidence of agency and disagreement, while the story of forced removal shows the limits of a printed appeal. Reading closely also reveals exclusions within the political promises themselves.',
    sections: [
      [
        'A writing system needed a printing workshop',
        'The LOC account traces Sequoyah’s syllabary to 1821 and the Nation’s commission for Cherokee and English type to 1825. The first Phoenix appeared on 21 February 1828. Type, paper, ink, editorial decisions and distribution turned a writing system into a printed public voice. Cherokee was not simply English written with decorative symbols: a syllabary represents spoken syllables.',
        'phoenix-catalogue',
        'About this Newspaper: syllabary, type commission and first issue',
      ],
      [
        'Look at one issue before calling it the first',
        'The reproduced title portion visibly dates to 10 April 1828, matching the LOC image record. It establishes that this particular issue appeared; it is not a photograph of the first February issue. The separate February transcription prints the July 1827 constitution, including national land and governmental provisions. Publication date, constitutional adoption and a modern photographic reproduction are different events.',
        'phoenix-photo',
        'LOC 97512373: title page, 10 April 1828; image masthead',
      ],
      [
        'A national voice still contained unequal rights',
        'The constitution printed in the first issue divided governmental powers and asserted national land interests. Article III also restricted council eligibility and voting by sex, freedom and ancestry, excluding people of African descent from office. It therefore cannot support a story of equal political rights for everyone. The newspaper’s editors and national leadership also disagreed over removal in 1832. A printed national voice was neither universal consent nor every resident’s experience.',
        'phoenix-constitution',
        'Article I; Article II; Article III §§4 and 7',
      ],
      [
        'Coercion did not erase political continuity',
        'The Cherokee Nation’s history explains that the 1835 New Echota signatories lacked national authority and that U.S. troops enforced removal from 1838. Survivors joined earlier western migrants, with political reorganization under a new constitution in 1839. These events involved conflict, loss and continued nationhood. A newspaper could organize an argument; it could not by itself make officials honor promises or prevent forced displacement.',
        'cherokee-nation-history',
        'Conflicts with Georgia; Forced Removal, Internal Conflict, and Reunification',
      ],
    ],
    fact: [
      'Cherokee and English printing began in the Phoenix in February 1828; the displayed April issue and the later forced-removal history must be read as separate evidence, not one undifferentiated event.',
      'phoenix-catalogue',
      'First issue date and bilingual publication history',
    ],
    objects: ['phoenix-april-1828'],
    terms: ['evidence', 'inference', 'syllabary', 'forced-relocation', 'enslavement'],
    dimensions: [
      [
        'Work and materials',
        'Type, paper, ink and editorial work made a written language and national debate visible in print.',
        'phoenix-catalogue',
        'Type commission, language and newspaper contents',
      ],
      [
        'Knowledge and belonging',
        'A national publication could support political identity while containing disagreement and excluding people from rights.',
        'phoenix-constitution',
        'Article III §§4 and 7',
      ],
      [
        'Evidence and authority',
        'Printed assertions of land and government need to be compared with the later record of coercion and reorganization.',
        'cherokee-nation-history',
        'Forced Removal and Reunification',
      ],
    ],
    prompt:
      'What does a newspaper page establish directly? Name one political promise and one experience it cannot establish for every reader.',
  }),
  dossier({
    id: 'ojibwe-manoomin',
    name: 'Ojibwe manoomin: work, water and knowledge beyond a photograph',
    aliases: [
      'Ojibwe',
      'Ojibwa',
      'Anishinaabe',
      'Anishinaabeg',
      'manoomin',
      'wild rice',
      'Chippewa',
    ],
    kind: 'period',
    region: 'Americas',
    place: 'Great Lakes rice waters; archival photograph probably Ontario',
    coordinates: [-87, 47],
    geo: 'Broad Great Lakes orientation point only. The LOC record says the photograph is probably Ontario; it supplies no secure lake or village identification.',
    dates: [
      1913,
      1913,
      'Archival photograph catalogued [1913]; a longer-lived practice',
      'The bracketed catalogue date anchors one document, not the origin or endpoint of manoomin harvesting. Later Ojibwe accounts interpret work, knowledge and continuity; they are not transcripts of the pictured person’s words.',
    ],
    precision: 'approximate',
    packs: ['C8'],
    question:
      'How much work—and whose knowledge—lies outside the edge of a photograph?',
    summary:
      'A photograph attributed to Carl Gustave Linde shows a person and canoes among wild-rice grasses. It offers a view of material surroundings, not a complete account of gathering food. Ojibwe accounts explain harvesting, finishing, relationships and care for rice waters. The comparison makes room for knowledge a camera could not record, without inventing a biography for an unnamed person.',
    sections: [
      [
        'Begin with the archive’s limits',
        'LOC catalogues the image to 1913 and probably Ontario, identifying an Ojibwe person without giving a personal name. The canoes and plants are visible. The exact lake, the person’s intentions and a full harvesting sequence are not. The catalogue’s older terminology remains in its source record; the atlas does not use one unnamed individual as a portrait of every Anishinaabe community.',
        'rice-linde',
        'Title, creator, bracketed date, summary and uncertain location',
      ],
      [
        'Gathering depends on careful technique',
        'The GLIFWC brochure credits Lac du Flambeau students’ account of harvesting. It describes canoe movement and light ricing sticks, then drying, parching, hulling and winnowing. Grain in a canoe is not yet the same material as finished food. These linked tasks make work visible beyond the attractive waterside scene. The later account helps ask questions of the photograph; it does not identify that individual’s exact tools or routine.',
        'rice-goodberry',
        'PDF pp.5–6, Harvesting and Processing; student authorship',
      ],
      [
        'Food carries relationships as well as calories',
        'St. Croix’s community account describes manoomin as physical and spiritual sustenance and recounts an oral tradition of finding food growing on water. This is an attributed community explanation, not a calendar date derived from a photograph. Its significance cannot be reduced to a nutritional ranking. Shared words and related practices also do not erase differences among Ojibwe communities or other Great Lakes peoples.',
        'rice-stcroix',
        'Opening cultural account, 20 September 2022',
      ],
      [
        'Care for a food landscape is skilled work',
        'GLIFWC’s explanation brings community observation and research together in care for manoomin. It distinguishes the finishing steps and the knowledge needed to understand rice waters. Those later explanations are evidence of continued attention, not proof of unchanged conditions since 1913. A photograph alone cannot measure former abundance or establish why one rice bed changed. Those questions need particular environmental and community records.',
        'rice-glifwc',
        'Traditional knowledge, research and finishing sections',
      ],
    ],
    fact: [
      'The Linde photograph is catalogued [1913] with a probable Ontario location and an unnamed Ojibwe person; it does not by itself establish the complete harvesting process or a precise community biography.',
      'rice-linde',
      'Catalogue date and summary',
    ],
    objects: ['rice-linde-1913'],
    terms: ['evidence', 'inference', 'manoomin', 'winnowing', 'provenance'],
    dimensions: [
      [
        'Work and materials',
        'Harvesting and finishing involve several different operations, not only a canoe trip.',
        'rice-goodberry',
        'Harvesting, drying, parching, hulling and winnowing',
      ],
      [
        'Knowledge and belonging',
        'Community accounts place a food plant within remembered relationships and responsibilities.',
        'rice-stcroix',
        'Opening cultural account',
      ],
      [
        'Evidence and authority',
        'An unnamed archival photograph and later community explanations establish different kinds of knowledge.',
        'rice-linde',
        'Catalogue summary and qualified location',
      ],
    ],
    prompt:
      'Name two visible observations, one explanation supplied by Ojibwe accounts, and one question neither source answers.',
  }),
].map((s) => {
  if (s.id === 'ocmulgee-council') {
    s.sections[0]!.citations.push(
      cite(
        'ocmu-floor-image',
        'Specific Earth Lodge floor carousel item, NPS credit and absent exposure date',
      ),
    );
    s.sections[2]!.citations.push(
      cite('ocmu-muscogee', 'Early Interactions: towns, villages and councils'),
    );
    s.sections[3]!.citations.push(
      cite(
        'ocmu-chronology',
        'Discussion: chronology, abandonment and Muscogee collaboration',
      ),
    );
    s.interval.alternatives = [
      {
        label:
          'NPS retains 1015, an older median date; this is not a directly observed construction year.',
        citations: [
          cite('ocmu-earthlodge', 'Older date label'),
          cite('ocmu-chronology', 'Discussion: older median'),
        ],
      },
      {
        label:
          'New roof-wood evidence indicates cutting sometime after c.1160; possible earlier construction remains unresolved.',
        citations: [cite('ocmu-chronology', 'Earthlodge results and discussion')],
      },
    ];
  }
  if (s.id === 'wendat-laine') {
    s.sections[3]!.citations.push(
      cite('laine-wendat', 'Signs 1–2: Nation-authored heritage summaries'),
    );
    s.interval.alternatives = [
      {
        label:
          'Earlier c.1500–1530 attribution relied partly on material styles and scarce European goods; the 2022 analysis prefers a later model.',
        citations: [cite('laine-chronology', 'Introduction and Conclusions')],
      },
    ];
  }
  if (s.id === 'haudenosaunee-canandaigua')
    s.dimensions['Work and materials']!.citations.push(
      cite('canandaigua-archive', 'Full recto scan: text and seals'),
    );
  if (s.id === 'cherokee-print') {
    s.sections[1]!.citations.push(
      cite('phoenix-constitution', 'First-issue transcription and July 1827 adoption'),
    );
    s.sections[2]!.citations.push(
      cite('phoenix-catalogue', '1832 editorial disagreement'),
    );
    s.claims[0]!.citations.push(
      cite('phoenix-photo', 'April 10 issue identification'),
      cite('cherokee-nation-history', 'Forced removal and reorganization'),
    );
  }
  if (s.id === 'ojibwe-manoomin')
    s.dimensions['Evidence and authority']!.citations.push(
      cite('rice-goodberry', 'Later community-authored harvesting interpretation'),
    );
  return { ...s, claims: s.claims.map((c) => ({ ...c, checkedOn: accessed })) };
});
export const woodlandJourney: Journey = {
  id: 'eastern-woodlands',
  printSourcesPerPage: 3,
  title: 'Eastern Woodlands: communities, knowledge and power',
  question: 'How do places, food and records help people sustain a community?',
  duration: '35–50 minutes',
  printBreakAfter: [3],
  introduction:
    'Begin with an ancestral council place, look back to a separate Ohio earthwork network, then investigate a Wendat village, Haudenosaunee diplomacy, Cherokee printing and Ojibwe rice work. These selected histories cross centuries. Eastern Woodlands is a broad geographic frame, not one people, government or path of development.',
  stops: [
    {
      subject: 'ocmulgee-council',
      year: 1200,
      title: 'Separate old clay from a new roof',
      narrative:
        'Inspect the surviving clay and reconstructed shelter, then investigate the revised dating. The reading year is a context, not a settled construction date.',
      object: 'ocmulgee-floor',
    },
    {
      subject: 'hopewell-earthworks',
      year: 200,
      title: 'Look back to a different gathering landscape',
      narrative:
        'Return to an earlier Ohio network. Compare forms of gathering without making Hopewell the founder of every later woodland society.',
    },
    {
      subject: 'wendat-laine',
      year: 1600,
      title: 'Let new evidence move a date',
      narrative:
        'Put village work beside the calibration problem. Two possible date clusters do not mean a village existed continuously between them.',
      object: 'laine-radiocarbon-2022',
      compare: 'ocmulgee-council',
    },
    {
      subject: 'haudenosaunee-canandaigua',
      year: 1794,
      title: 'Ask what a promise establishes',
      narrative:
        'Separate negotiation, the treaty clauses, U.S. ratification and Onondaga explanations of wampum. Identify the further evidence needed to test a promise.',
      object: 'canandaigua-ratification',
    },
    {
      subject: 'cherokee-print',
      year: 1828,
      title: 'Read political voice and exclusions together',
      narrative:
        'Compare printed assertions with the treaty. A national newspaper can document agency, disagreement and unequal rights, while later removal tests the limits of written promises.',
      object: 'phoenix-april-1828',
      compare: 'haudenosaunee-canandaigua',
    },
    {
      subject: 'ojibwe-manoomin',
      year: 1913,
      title: 'Find the work beyond the camera',
      narrative:
        'Use Ojibwe accounts to investigate harvesting, finishing and care for rice waters. Keep the archive’s unnamed person and probable location explicit.',
      object: 'rice-linde-1913',
    },
  ],
  conclusion:
    'Council spaces, village fields, spoken agreements, printed pages and rice waters connected practical work with responsibilities and authority. The evidence is uneven, and the histories are distinct. Neither a revised archaeological date, a printed promise nor forced movement establishes the disappearance of a people. Carry one specific question back to its sources.',
  evidence: {
    prompt:
      'Which explanation respects both the records and the people whose histories they concern?',
    options: [
      {
        text: 'Treaties and newspapers record particular commitments and arguments; investigating their effects requires further evidence.',
        supported: true,
        feedback:
          'Canandaigua’s clauses state promises. The Cherokee constitution records both national assertions and exclusions. Neither text proves equal rights, complete consent or successful enforcement for everyone.',
      },
      {
        text: 'A reconstructed building and an exact-looking date let us recover every ancient decision with certainty.',
        supported: false,
        feedback:
          'Ocmulgee distinguishes surviving clay from reconstructed walls and roof. The newer study revises the older date and leaves questions open. A dating model does not recover the words spoken in a council.',
      },
      {
        text: 'A photograph of rice canoes tells us the full work of every Eastern Woodlands community.',
        supported: false,
        feedback:
          'The archive qualifies person and place. Ojibwe accounts explain several harvesting and finishing operations, but one image cannot represent every community, century or food system.',
      },
    ],
    citations: [
      cite('canandaigua-onondaga', 'Articles I–III and VII'),
      cite('phoenix-constitution', 'Articles I–III, especially III §§4 and 7'),
      cite('ocmu-chronology', 'Earthlodge results and discussion'),
      cite('rice-goodberry', 'Harvesting and Processing, PDF pp.5–6'),
    ],
  },
  returnPrompt:
    'Keep an observation, a supported explanation and a question. Revisit this place or record with another type of source.',
};
