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
export const northernSources: Source[] = [
  source(
    'met-717577',
    'Harpoon counterweight',
    'The Metropolitan Museum of Art',
    'https://www.metmuseum.org/art/collection/search/717577',
    'catalogue',
    '2019.456.17: visible date 300–500 CE, Old Bering Sea III attribution, walrus ivory, function, engraving and Public Domain image statement. This object date is not a settled regional chronology.',
  ),
  source(
    'bering-whaling',
    'How did whaling start in the Bering Sea?',
    'National Park Service; World Archaeology 51(3), 454–483',
    'https://www.nps.gov/articles/beringwhalingorigins.htm',
    'scholarship',
    'Published abstract of Mason/Rasic 2020: revised marine-carbon chronology, OBS florescence 650–1250, earlier Okvik/Ipiutak 300–600, walrus haul-outs and social/technological explanations. Abstract-level claims only; not a new date determination for the Met object.',
    'Owen K. Mason and Jeffrey T. Rasic',
  ),
  source(
    'birnirk-context',
    'Birnirk National Historic Landmark',
    'National Park Service',
    'https://www.nps.gov/places/birnirk-site.htm',
    'archaeology',
    'Archaeological type-site and tool comparisons; cultural relationships are interpretations, not a single named state or an individual maker identification. Relative-date summaries are not used to redetermine this object.',
  ),
  source(
    'inuinnait-patterns',
    'Patterns of Change: Creating Patterns of Change',
    'Pitquhirnikkut Ilihautiniq / Kitikmeot Heritage Society',
    'https://www.kitikmeotheritage.ca/patternsofchange-exhibition-eng',
    'primary',
    'Project origins 2017; Elders Mary Avalak, Mabel Etegik and Annie Atighioyak, workshops 2017–19, researched historical parkas, language/pattern knowledge and transmission. A later community interpretation, not the date of the pictured expedition photograph.',
  ),
  source(
    'inuinnait-history',
    'A History of Inuinnait Parkas',
    'Pitquhirnikkut Ilihautiniq / Kitikmeot Heritage Society',
    'https://www.kitikmeotheritage.ca/patternsofchange-history',
    'primary',
    'A History of Inuinnait Parkas: changing fashion, techniques and materials, continued connections with land and people; exhibit garments are researched modern reconstructions, not original nineteenth-century clothing.',
  ),
  source(
    'jenness-1922',
    'The Life of the Copper Eskimos',
    'Report of the Canadian Arctic Expedition 1913–18, vol. XII; Internet Archive copy',
    'https://archive.org/details/lifeofcoppereski00jenn',
    'primary',
    'Ottawa, F.A.Acland, 1922. Title page: Southern Party 1913–16 and government publication. Frontispiece, Plate I: Ikpakhuak and Higilak in full dancing costume. Historic title/caption terminology retained in source record; exposure date and individual photographer not specified on the plate.',
    'Diamond Jenness',
  ),
  source(
    'ozette-museum',
    'Ozette Archaeological Site',
    'Makah Cultural & Research Center',
    'https://makahmuseum.com/about/ozette-archaeological-site/',
    'primary',
    'Storm exposure 1969–70; excavation from April 1970; oral history of a great slide, reported 500±50 BP radiocarbon age, preserved household material, tribal custody and interpretation. Relative radiocarbon age is not silently converted to an exact calendar date.',
  ),
  {
    id: 'ozette-dating-discussion',
    title: 'Paleoenvironmental Change on the Olympic Peninsula, Washington',
    institution:
      'Universities of Oregon and Washington, final report to Olympic National Park',
    author:
      'Daniel G. Gavin, David M. Fisher, Erin M. Herring, Ariana White and Linda B. Brubaker',
    type: 'scholarship',
    url: 'https://www.depts.washington.edu/pnwcesu/reports/J8W07100028_Final_Report.pdf#page=91',
    accessed: '2026-11-04',
    scope:
      'Printed p. 84 reviews an earlier estimate around 1500 CE and a proposed link to the 1700 earthquake. The authors explain the uncertainty in linking the slide to a specific earthquake.',
  },
  source(
    'ozette-architecture',
    'Ozette Archaeological Site',
    'Society of Architectural Historians, SAH Archipedia',
    'https://sah-archipedia.org/buildings/WA-01-009-0042',
    'scholarship',
    'Differing 1560/1700 CE burial estimates, wooden household assemblage, continued village occupation into 1920s, excavation and museum/replica distinction. Neither date is treated as the lifespan of the settlement.',
  ),
  source(
    'ozette-wsu',
    'The Home of My Family: Ozette, the Makahs, and Doc Daugherty',
    'Washington State University Magazine',
    'https://magazine.wsu.edu/2009/05/01/the-home-of-my-family-ozette-the-makahs-and-doc-daugherty/',
    'scholarship',
    '2009 account: likely 1700 earthquake/slide interpretation and collaboration with Makah people. Proposed event correlation is not certainty about each buried house.',
  ),
  source(
    'makah-canoes',
    'Makah Canoeing: construction and a safe journey',
    'Makah Tribe',
    'https://makah.com/makah-tribal-info/canoeing/',
    'primary',
    'Makah Canoe Construction and Ensuring a Safe Journey: red cedar, steaming, replaceable hardwood gunwales at Ozette, absence of sails in deposits, weather/navigation knowledge. The absence of excavated sails does not date their introduction.',
  ),
  source(
    'makah-loc',
    'Light House Joe beside a boat, Neah Bay(?)',
    'Library of Congress',
    'https://www.loc.gov/item/94501684/',
    'archive',
    'Asahel Curtis photograph, c. 1910/copyright 1911; LOT 12766, LC-USZ62-109749. Person named in catalogue; location qualified. Later community documentation, not a photograph of the buried Ozette households. Original U.S. publication copyright expired.',
    'Asahel Curtis',
  ),
  source(
    'hsi-unesco',
    'Head-Smashed-In Buffalo Jump',
    'UNESCO World Heritage Centre',
    'https://whc.unesco.org/en/list/158/',
    'archaeology',
    'Brief synthesis: drive lanes, cliff, stratified bone deposits and butchering camps; long use with a lengthy hiatus, approximately 5800 BP to 1850 CE. Historical cultural interpretation does not identify every earlier hunter as one named group.',
  ),
  source(
    'hsi-blackfoot',
    'Our Culture: Trade, Iini and Piistaan',
    'Blackfoot Crossing Historical Park / Siksika Nation',
    'https://blackfootcrossing.ca/our-culture/',
    'primary',
    'AWOH’TSOWOKOOTTSIYA, IINI and PIISTAAN: protocols of trade, bison materials, hunting on foot and with horses, cairns/drive lanes and processing. Inconsistent broad date/quantity generalizations elsewhere on the page are not used as chronology.',
  ),
  source(
    'hsi-brink',
    'Imagining Head-Smashed-In: Aboriginal Buffalo Hunting on the Northern Plains',
    'Athabasca University Press',
    'https://www.aupress.ca/app/uploads/120137_99Z_Brink_2008-Imagining_Head_Smashed_In.pdf',
    'archaeology',
    '2008, chapter 7, especially printed pp. 195–198: Hazel Big Smoke, bone-breaking and hide-lined boiling experiments using cattle bones and modern tools. Experimental interpretation distinguished from a recovered ancient meal. No copyrighted book illustrations reproduced.',
    'Jack Brink',
  ),
  source(
    'hsi-image',
    'Head-Smashed-In landscape photograph',
    'Wikimedia Commons; photographer UM',
    'https://commons.wikimedia.org/wiki/File:Head-Smashed-In.jpg',
    'catalogue',
    'UM’s own photograph, uploaded 17 July 2005, 2016×1512. Creator’s explicit worldwide public-domain release consulted. Modern landscape, not an actual historic hunt; exact exposure date not independently established.',
    'UM',
  ),
  source(
    'knife-village',
    'Hidatsa Village',
    'National Park Service',
    'https://www.nps.gov/knri/learn/historyculture/hidatsa-village.htm',
    'archaeology',
    'Big Hidatsa site founded around 1600, relocation 1845, earthlodge remains and continuing significance. Bounds are this village’s selected occupation, not Hidatsa existence. Population/lodge estimates are not repeated as settled counts.',
  ),
  source(
    'knife-subsistence',
    'Subsistence: Tribal Nutrition & Health',
    'Mandan Hidatsa Arikara Nation members; National Park Service teacher guide',
    'https://www.nps.gov/articles/subsistence.htm',
    'primary',
    'Teacher’s Note identifies community authorship. Women’s Influence, Processing Foods and Food Storage: garden tools, corn/beans/squash/sunflowers, trade, drying and cache pits; hunting/foraging alongside cultivation. NPS-credited tool illustration is explanatory, not an excavated dated implement.',
  ),
  source(
    'knife-women',
    'Hidatsa Women & Earthlodges of the Upper Missouri River',
    'National Park Service',
    'https://www.nps.gov/articles/knri-hidatsa-women-earthlodges-cultural-landscape.htm',
    'archaeology',
    'Women’s construction, ownership and maintenance, clan cooperation and expert supervision; surviving depressions and reconstructed earthlodge distinguished; continuing community knowledge. NPS Photo credit checked.',
  ),
  source(
    'mha-history',
    'MHA Nation History',
    'Mandan, Hidatsa, and Arikara Nation',
    'https://www.mhanation.com/history/',
    'primary',
    'Three Affiliated Tribes and Village & Relocations: separate groups/clans/ceremonial systems, agriculture/hunting/trade, 1845 Like-a-Fishhook move. No conflation of distinct peoples, no adoption of a single observer’s population count.',
  ),
  source(
    'umista-history',
    'The History of the Potlatch Collection',
    'U’mista Cultural Centre',
    'https://www.umista.ca/pages/collection-history',
    'primary',
    'Potlatch witnesses, 1884 legislation, 1921 Dan Cranmer potlatch and confiscation, 1951 removal of prohibition, community-directed return/custody negotiations. Later events/current outstanding totals are not represented as the 1980 endpoint or a present legal status.',
  ),
  source(
    'umista-about',
    'About U’mista',
    'U’mista Cultural Centre',
    'https://www.umista.ca/pages/about-us',
    'primary',
    'Community cultural preservation and the opening of the cultural centre in 1980; source scope limited to its historical account, not current operations.',
  ),
  source(
    'kwak-amnh',
    'Kwakwa̱ka̱’wakw: Potlatch and the Potlatch Ban',
    'American Museum of Natural History; Indigenous consulting curators and filmmakers',
    'https://www.amnh.org/exhibitions/permanent/northwest-coast/kwakwakawakw',
    'primary',
    'Trevor Isaac introduction; Barb Cranmer transcript on identity/potlatch and ban; feast dish interpretation. Nations within the language group distinguished. Third-party film and ceremonial object photographs are not downloaded.',
  ),
  source(
    'hunt-boas-1921',
    'Ethnology of the Kwakiutl, based on data collected by George Hunt',
    'Bureau of American Ethnology, 35th Annual Report; Library of Congress',
    'https://www.loc.gov/item/21020998/',
    'primary',
    '1921 Government Printing Office publication, part 2 title pages; ethnographic title explicitly credits George Hunt and Franz Boas. Report period 1913–14 is distinct from publication 1921. LOC identifies these digitized books as public domain/free to reuse. Historical terminology is not the atlas’s universal name for these nations.',
    'George Hunt; Franz Boas',
  ),
];
northernSources.push(
  source(
    'umista-ban',
    'Potlatch Ban: Living Tradition',
    'U’mista Cultural Society / Virtual Museum of Canada',
    'https://umistapotlatch.ca/potlatch_interdire-potlatch_ban-eng.php',
    'primary',
    'The Start of the Potlatch Ban: 1 January 1885 effective date; continuing practice and 1951 removal. Distinguish 1884 amendment from its commencement. No inconsistent arrest/imprisonment totals are adopted.',
  ),
);
export const northernSubjects: Subject[] = [
  dossier({
    id: 'bering-sea-carvers',
    name: 'Bering Sea carvers: a tool, a design and an uncertain chronology',
    aliases: [
      'Old Bering Sea',
      'Old Bering Sea III',
      'Arctic ivory',
      'harpoon counterweight',
    ],
    kind: 'object',
    region: 'Americas',
    place: 'Bering Strait region; object catalogued to Alaska',
    coordinates: [-169, 65.5],
    geo: 'Broad regional locator only. The catalogue names Alaska but no secure workshop or individual use-site; this point is not a border or excavated findspot.',
    dates: [
      300,
      500,
      'Catalogue object date, 300–500 CE; regional chronology debated',
      'Dates follow the current Met object record 2019.456.17. They do not define the Old Bering Sea tradition’s beginning/end. Mason and Rasic propose a later regional florescence; no new radiocarbon date for this individual object is supplied.',
    ],
    packs: ['C4'],
    question:
      'What can a beautifully made tool establish—and what must remain uncertain?',
    summary:
      'A small walrus-ivory counterweight belonged to the technology of hunting at sea. Its curves and engraving connect practical work with careful visual design. Yet a museum label and a regional archaeological chronology answer different questions. We can inspect a specific surviving object without making its maker represent every Arctic community or turning a disputed chronology into a single fixed story.',
    sections: [
      [
        'A component, not the whole hunting system',
        'The Met identifies this carving as a counterweight or stabilizer associated with a harpoon. Walrus ivory could be cut and engraved into a compact, shaped component. The object alone cannot show the complete shaft, line, boat, prey or sequence of a particular hunt. Identifying one tool part is a beginning for investigating work, rather than a recovered account of one hunter’s success.',
        'met-717577',
        'Description: counterweight/stabilizer, walrus ivory and harpoon use',
      ],
      [
        'Design takes skill; meaning takes evidence',
        'Follow the curving lines across the surface. The catalogue cautiously suggests animal features at the top and outer edges. That suggestion is not a certain identification of every form or a transcription of the carver’s beliefs. Shape and ornament both involved decisions, but an attractive object does not establish equal wealth or tell us who was entitled to make, own or interpret it.',
        'met-717577',
        'Description: engraved curvilinear designs and possible animal features',
      ],
      [
        'Two kinds of date should not be collapsed',
        'The museum gives this object 300–500 CE. In the research abstract published by NPS, Mason and Rasic discuss corrections for marine carbon and propose an Old Bering Sea florescence of 650–1250, with earlier related contexts. These are different evidential claims: an object catalogue attribution and a revision of regional dating. This atlas retains both with their scopes. It neither silently redates the carving nor calls the whole question settled.',
        'bering-whaling',
        'Abstract, chronology revision and marine-carbon correction',
      ],
      [
        'A region of relationships, not one frozen people',
        'The same research investigates walrus haul-out sites, seafaring technology, movement and relationships between communities. NPS’s Birnirk account explains how archaeologists compare tool styles at a type-site. Such labels organize material evidence; they are not the names of one timeless Arctic state. This investigation does not use a carved tool to invent a direct genealogy for every later Inuit, Iñupiat or Yupik community.',
        'birnirk-context',
        'Birnirk type-site and archaeological comparisons',
      ],
    ],
    fact: [
      'The Met dates this counterweight 300–500 CE, while Mason/Rasic’s later regional chronology concerns a different level of evidence; the latter does not individually redetermine this carving’s date.',
      'met-717577',
      'Visible date, attribution and object 2019.456.17',
    ],
    objects: ['met-717577'],
    terms: [
      'evidence',
      'inference',
      'archaeological-tradition',
      'marine-reservoir-effect',
    ],
    dimensions: [
      [
        'Work and materials',
        'Carving, engraving and fitting ivory components required practiced knowledge; one surviving part does not recover an entire hunt.',
        'met-717577',
        'Material and function',
      ],
      [
        'Knowledge and belonging',
        'Regional archaeological labels help compare artifacts; they are not one people’s unchanged political identity.',
        'birnirk-context',
        'Type-site explanation',
      ],
      [
        'Evidence and custody',
        'Object attribution and regional dating are distinct, partly uncertain claims.',
        'bering-whaling',
        'Abstract and revised chronology',
      ],
    ],
    prompt:
      'Name one visible feature, one supported functional interpretation and one claim this object cannot establish.',
  }),
  dossier({
    id: 'inuinnait-sewing',
    name: 'Inuinnait clothing: skill, identity and change',
    aliases: [
      'Inuinnait',
      'Copper Inuit',
      'Copper Eskimos',
      'Ikpakhuak',
      'Higilak',
      'Inuit clothing',
    ],
    kind: 'period',
    region: 'Americas',
    place: 'Coronation Gulf and Victoria Island region, Canadian Arctic',
    coordinates: [-110, 68.5],
    geo: 'Broad regional locator for the expedition context, not an exact exposure site or the boundary of all Inuit homelands.',
    dates: [
      1913,
      1916,
      'Selected expedition context, 1913–1916',
      'This is the Southern Party observation window named in Jenness’s 1922 report, not the lifespan of Inuinnait clothing or peoples. The photograph is individually undated and was published in 1922. Later community research interprets this history without extending the selected interval.',
    ],
    packs: ['C8'],
    question:
      'How does clothing carry practical knowledge and identity through change?',
    summary:
      'Clothing made for Arctic life joins technical skill, appearance and relationships. A historical photograph names Ikpakhuak and Higilak wearing dancing costume. It gives a specific view rather than a universal Arctic outfit. Community-led research into Inuinnait parkas adds knowledge of patterns, materials and language that a photograph cannot supply on its own.',
    sections: [
      [
        'Begin with named people, a caption and a date',
        'The frontispiece of Jenness’s 1922 report identifies Ikpakhuak and Higilak in dancing costume. The title page names the expedition’s Southern Party 1913–16. Publication, fieldwork and the exposure are three different dates; the plate does not give an exact day. Clothing presented for this photograph should not be relabeled every person’s daily working outfit. Nor can a still image show how each garment felt or was made.',
        'jenness-1922',
        'Frontispiece Plate I and title page',
      ],
      [
        'Materials and stitches embody decisions',
        'Patterns of Change describes researched reconstructions made in community workshops, with different historical materials, tools and styles. Its earliest reconstructed parka used materials from the land and locally worked copper tools; later examples incorporated imported supplies and sewing machines. These are carefully researched modern garments. They help ask how makers adapted techniques, without pretending a new reconstruction is an untouched nineteenth-century object.',
        'inuinnait-patterns',
        'Creating Patterns of Change: researched 1880/1930/1950 reconstructions',
      ],
      [
        'A changed material is not an ended culture',
        'The community’s history of parkas reads changing fashion and technique alongside ongoing ties to land, resources and people. Imported fabric or a different cut does not prove that makers lost their identity, just as an older form does not imply that everyone lived identically. Inuinnait is the community context here. Other Inuit, Iñupiat, Inuvialuit and Yupik histories cannot simply be substituted for it.',
        'inuinnait-history',
        'A History of Inuinnait Parkas, English explanation',
      ],
      [
        'Who teaches the meaning of an old image?',
        'Elders Mary Avalak, Mabel Etegik and Annie Atighioyak guided the 2017–19 sewing workshops. The project linked language documentation with learning and making for families. That later community work is evidence about knowledge transmission, not a new date for the old photograph. An expedition observer’s categories can therefore be read alongside living expertise. Historical terminology remains in the source title, while the atlas identifies the specific community.',
        'inuinnait-patterns',
        'Elders-in-Residence, 2017–19 workshops and language/pattern library',
      ],
    ],
    fact: [
      'The 1922 frontispiece identifies Ikpakhuak and Higilak in dancing costume; its publication date and the 1913–16 expedition window do not establish an exact exposure date.',
      'jenness-1922',
      'Frontispiece Plate I and title page',
    ],
    objects: ['inuinnait-plate-1922'],
    terms: ['evidence', 'inference', 'provenance', 'reconstruction'],
    dimensions: [
      [
        'Work and materials',
        'Pattern-making and sewing combine material choices, tools and experienced skill; reconstructed garments document research rather than original manufacture.',
        'inuinnait-patterns',
        'Creating Patterns of Change',
      ],
      [
        'Knowledge and belonging',
        'Changing materials can accompany continuing community identity and knowledge.',
        'inuinnait-history',
        'History of Inuinnait Parkas',
      ],
      [
        'Evidence and custody',
        'The named historical photograph and community-led reconstruction answer different questions.',
        'jenness-1922',
        'Frontispiece and title page',
      ],
    ],
    prompt:
      'What could you observe in the photograph, and what would you need to ask an experienced maker to understand?',
  }),
  dossier({
    id: 'ozette-makah',
    name: 'Ozette: Makah households, cedar and community custody',
    aliases: ['Ozette', 'Makah', 'Northwest Coast', 'Neah Bay'],
    kind: 'place',
    region: 'Americas',
    place: 'Ozette, near Cape Alava, Olympic Peninsula, Washington',
    coordinates: [-124.73, 48.15],
    geo: 'Village-site locator. The archival photograph is catalogued to Neah Bay(?) and is not a view of a buried Ozette house.',
    dates: [
      1560,
      1700,
      'Reported house-burial estimates: c. 1560 or 1700; disputed',
      'Bounds describe differing published estimates for burial of houses, not the village’s occupation or a 140-year-long slide. SAH lists 1560/1700; WSU discusses 1700 as likely; the Makah museum reports 500±50 BP radiocarbon age, which is not silently converted to a calendar year.',
    ],
    precision: 'disputed',
    packs: ['C7'],
    question:
      'What survives when wooden things are buried—and who should interpret them?',
    summary:
      'Mud preserved wooden household belongings at Ozette unusually well. Cedar working, food getting, storage and life in large houses can be investigated together. Makah oral history and the community’s custody of the recovered material are central to this account. The burial chronology is disputed, and later photographs of Makah life are labeled as later evidence.',
    sections: [
      [
        'Preservation changes what history can see',
        'The Makah museum describes a storm exposing wooden artifacts in 1969–70 and a collaborative excavation beginning in April 1970. Normally perishable material survived in the mud. A rich wooden assemblage can correct a picture dominated by stone tools, but survival is still selective. What was preserved beneath part of the village is not a complete inventory of everything used by every Makah household.',
        'ozette-museum',
        'Storm exposure, April 1970 excavation and waterlogged preservation',
      ],
      [
        'A canoe joins craft and environmental knowledge',
        'The Tribe’s construction account describes hollowing cedar and steaming the sides rather than cutting away all their strength. Replaceable hardwood strips protected canoe sides found at Ozette. Navigation also relied on weather, swells and landmarks. Those are connected forms of expertise, not a choice between technology and knowledge. The account says sails were not found in the deposits; that absence does not securely date the invention or arrival of sails.',
        'makah-canoes',
        'Makah Canoe Construction and Ensuring a Safe Journey',
      ],
      [
        'Do not give the slide a false birthday',
        'Published accounts do not all give the same burial date. SAH presents 1560 or 1700; WSU discusses a likely relationship with the 1700 earthquake. The Makah museum reports a radiocarbon estimate in years BP. These claims require attention to samples, calibration and event correlation. The plotted range marks disagreement between reported calendar estimates. It is neither the village’s entire history nor an exact duration of a disaster.',
        'ozette-architecture',
        'Mudslide paragraph: 1560 or 1700; continued village occupation',
      ],
      [
        'Belongings stayed in the community',
        'Makah oral history described a great slide before excavation. The museum explains that recovered material remained on the reservation and that the cultural center arose from the Tribe’s wish to curate and interpret it. This changes the question from who discovered a lost people to how different forms of evidence are studied together. The later Curtis photograph names Light House Joe; it does not depict the ancient burial event or identify a particular excavated canoe.',
        'ozette-museum',
        'Oral history, tribal custody and creation of MCRC',
      ],
    ],
    fact: [
      'Makah oral history recalls a slide that buried part of Ozette. Researchers disagree about when it happened. The village has a longer history than the burial of these houses.',
      'ozette-museum',
      'Ozette Archaeological Site, oral history and reported radiocarbon age of 500 ± 50 BP',
    ],
    supportingFactCitations: [
      cite(
        'ozette-dating-discussion',
        'Printed p. 84, midden age and competing burial estimates',
      ),
    ],
    factCheckedOn: '2026-11-04',
    objects: ['makah-loc-1910'],
    terms: [
      'evidence',
      'inference',
      'waterlogged-preservation',
      'radiocarbon',
      'provenance',
    ],
    dimensions: [
      [
        'Work and materials',
        'Woodworking, household work and seafaring depended on material skill and knowledge of local conditions.',
        'makah-canoes',
        'Construction and safe navigation',
      ],
      [
        'Knowledge and belonging',
        'Makah oral history and tribal interpretation belong alongside excavation; recovered material remained with the Tribe.',
        'ozette-museum',
        'Oral history and tribal custody',
      ],
      [
        'Evidence and custody',
        'Waterlogged material, disputed burial dates and a later archival photograph establish different facts.',
        'ozette-architecture',
        'Burial alternatives and excavation',
      ],
    ],
    prompt:
      'Compare a wooden object preserved in mud with a later photograph. What different questions could each answer?',
  }),
  dossier({
    id: 'blackfoot-bison',
    name: 'Blackfoot bison knowledge and the work of a communal hunt',
    aliases: [
      'Head-Smashed-In',
      'Blackfoot',
      'Siksika',
      'Niitsitapi',
      'buffalo jump',
      'Plains bison',
    ],
    kind: 'period',
    region: 'Americas',
    place: 'Head-Smashed-In, southern Alberta; wider Blackfoot cultural context',
    coordinates: [-113.624, 49.75],
    geo: 'One communal-hunting landscape, not all Blackfoot territory or every Plains society. Earlier site users are not assigned an individual identity from a landscape photograph.',
    dates: [
      1700,
      1850,
      'Selected later hunting context, c. 1700–1850',
      'A bounded historical investigation, not the beginning of bison hunting or the site’s full chronology. UNESCO describes approximately 5800 BP to 1850 CE use with a lengthy hiatus. Earlier layers and later Blackfoot community histories are not compressed into these bounds.',
    ],
    packs: ['C7', 'C8'],
    question: 'How much coordinated work lies beyond the dramatic moment at the cliff?',
    summary:
      'A communal bison hunt depended on reading the land and animals, coordinating people and processing food. The cliff was one part of a much larger landscape of drive lanes, camps and skilled work. Blackfoot accounts place bison within material and spiritual relationships. Archaeology and experiments can investigate those activities without making one site represent every Plains community.',
    sections: [
      [
        'The cliff is only one part of the system',
        'UNESCO identifies drive lanes, the cliff, layered bone deposits and butchering camps. Taken together, these features support an interpretation of repeated communal hunting. A modern view cannot show every cairn or the organization of a particular event. The site has a long history with a substantial interruption. Our later historical window is not a claim of uninterrupted use by one unchanged group for thousands of years.',
        'hsi-unesco',
        'Brief synthesis: landscape components, long chronology and hiatus',
      ],
      [
        'Bison supplied more than a meal',
        'Blackfoot Crossing explains bison’s importance for food, clothing, shelter, tools and ceremonial life. Its account also distinguishes hunting on foot from later horse-assisted practices and describes trading through protocols of respect. These are named Blackfoot perspectives, not a generic Plains identity. The survival of a bone or hide does not by itself recover the responsibilities surrounding its use.',
        'hsi-blackfoot',
        'IINI, AWOH’TSOWOKOOTTSIYA and PIISTAAN',
      ],
      [
        'Processing required knowledge and time',
        'In chapter 7, Brink describes excavated processing evidence and experiments in obtaining grease from broken bones. Piikani crew member Hazel Big Smoke contributed to that work. The experiment used cattle bones and modern tools, not a perfectly reproduced ancient kitchen. Its value is testing practical interpretations and making overlooked labor visible. It does not establish the exact recipe or outcome of every historic hunt.',
        'hsi-brink',
        'Printed pp. 195–198: Hazel Big Smoke and bone-boiling experiments',
      ],
      [
        'A mobile life is not a life without institutions',
        'The interpretive-site history describes seasonal movement, bands and organizations that coordinated communal hunting. Such arrangements differed from a permanently occupied farming village. Compare this landscape with Hidatsa garden and storage work: both involved planning and shared knowledge. Neither one is a lower stage on a ladder toward the other, and a comparison does not prove direct contact between the particular places shown.',
        'hsi-site-history',
        'Social Structure and Seasonal Travel',
      ],
    ],
    fact: [
      'Head-Smashed-In includes drive lanes, a jump, bone deposits and processing camps; the landscape supports a history of coordinated hunting rather than an isolated cliff event.',
      'hsi-unesco',
      'Brief synthesis: component features',
    ],
    objects: ['hsi-cliff-2005'],
    terms: ['evidence', 'inference', 'seasonal-round', 'experimental-archaeology'],
    dimensions: [
      [
        'Work and materials',
        'Herd knowledge, coordinated movement and food/hide processing made the hunt more than a moment at the cliff.',
        'hsi-blackfoot',
        'IINI and PIISTAAN',
      ],
      [
        'Knowledge and belonging',
        'Blackfoot accounts locate bison within social and spiritual responsibilities; other Plains communities had distinct histories.',
        'hsi-blackfoot',
        'IINI and trade protocols',
      ],
      [
        'Evidence and custody',
        'Layers, landscape and limited experiments test different questions; no one photograph recovers an entire hunt.',
        'hsi-brink',
        'Chapter 7, pp. 195–198',
      ],
    ],
    prompt:
      'Draw or describe three kinds of work around a communal hunt. Separate what survives archaeologically from what needs other evidence.',
  }),
  dossier({
    id: 'hidatsa-villages',
    name: 'Hidatsa villages: gardens, earthlodges and exchange',
    aliases: [
      'Hidatsa',
      'Big Hidatsa',
      'Knife River',
      'Awadi',
      'Mandan Hidatsa Arikara',
    ],
    kind: 'place',
    region: 'Americas',
    place: 'Big Hidatsa Village and the Knife–Missouri river confluence, North Dakota',
    coordinates: [-101.386, 47.353],
    geo: 'Locator for a selected Hidatsa village landscape; neighboring Mandan and Arikara histories remain distinct. The displayed earthlodge is a modern reconstruction.',
    dates: [
      1600,
      1845,
      'Big Hidatsa village occupation, c. 1600–1845',
      'NPS’s selected village frame. 1845 marks relocation to Like-a-Fishhook, not the end of Hidatsa people, gardening or earthlodge knowledge. Other Knife River villages have their own different starting dates.',
    ],
    packs: ['C7', 'C8'],
    question:
      'What changes when women’s gardens and houses are placed at the center of Plains history?',
    summary:
      'Hidatsa life along the Missouri joined gardening, bison hunting, storage and exchange. Women’s work in fields and earthlodges helped sustain households and trading relationships. The history of one village does not stand for all Plains societies. Nor does relocation mean the end of a people: community-authored histories trace continuity through upheaval.',
    sections: [
      [
        'A particular village has particular dates',
        'NPS dates Big Hidatsa Village to around 1600–1845. Its visible depressions mark houses that once formed a settlement. Different Hidatsa groups and neighboring villages had distinct histories; the region did not begin in 1600. In 1845, Hidatsa and surviving Mandan people established Like-a-Fishhook upriver. These are movements and reorganizations, not proof that the communities disappeared.',
        'knife-village',
        'Establishment around 1600, relocation 1845 and continuing significance',
      ],
      [
        'Garden work helped make a regional economy',
        'The community-authored teacher guide identifies women’s crops, tools and exchange. Corn, beans, squash and sunflowers required clearing, planting, tending and harvesting. Crops could be exchanged with other Native communities and European traders. This account undermines a picture in which every Plains person lived only by mounted hunting. Hunting and gathering remained important alongside agriculture; these activities need not be assigned to separate evolutionary stages.',
        'knife-subsistence',
        'Teacher’s Note; Women’s Influence and Hunting and Foraging',
      ],
      [
        'An earthlodge is also a system of knowledge',
        'NPS describes women constructing, owning and maintaining earthlodges through clan cooperation and experienced supervision. Practical skill and sacred knowledge belonged together in that account. Drying racks and cache pits extended food work beyond harvest. The present reconstructed lodge helps explain structure, but its modern roof and doorway should not be mistaken for an untouched seventeenth-century house.',
        'knife-women',
        'Women’s construction/ownership, clan cooperation and reconstructed lodge',
      ],
      [
        'Continuity does not erase disruption',
        'The MHA Nation’s history keeps Mandan, Hidatsa and Arikara identities, origin accounts and ceremonial systems distinct, while describing village relocation and shared survival. Disease and pressure changed communities; neither a harmonious timeless village nor a vanished people is an adequate story. Read the archaeological place together with community accounts. A trading center’s importance does not prove identical experience or equal power for every resident and visitor.',
        'mha-history',
        'Three Affiliated Tribes; Village & Relocations, 1845',
      ],
    ],
    fact: [
      'Big Hidatsa’s c. 1600–1845 occupation is a village history; 1845 relocation did not end Hidatsa people or their knowledge.',
      'knife-village',
      'Village occupation and continuing cultural importance',
    ],
    objects: ['knife-earthlodge', 'knife-garden-tools'],
    terms: ['evidence', 'inference', 'cache-pit', 'reconstruction'],
    dimensions: [
      [
        'Work and materials',
        'Gardens, storage, house construction, hunting and trade supported a settled river community.',
        'knife-subsistence',
        'Women’s Influence, Processing Foods and Food Storage',
      ],
      [
        'Knowledge and belonging',
        'Women’s ownership, clan cooperation and skilled supervision were part of earthlodge life.',
        'knife-women',
        'Construction, ownership and clan knowledge',
      ],
      [
        'Evidence and custody',
        'Depressions and community accounts explain village history; the standing interpretive lodge is reconstructed.',
        'knife-women',
        'Remaining depressions and modern earthlodge',
      ],
    ],
    prompt:
      'Compare this farming village with a communal bison-hunting landscape. Name a real difference, a shared need for knowledge and a limit in the evidence.',
  }),
  dossier({
    id: 'kwakwakawakw-potlatch',
    name: 'Kwakwaka’wakw potlatch: witnesses, prohibition and return',
    aliases: [
      'Kwakwaka’wakw',
      'Kwakwa̱ka̱’wakw',
      'Kwakiutl',
      'U’mista',
      'potlatch',
      'Dan Cranmer',
    ],
    kind: 'process',
    region: 'Americas',
    place: 'Northern Vancouver Island and adjacent mainland; locator at Alert Bay',
    coordinates: [-126.929, 50.59],
    geo: 'Alert Bay is a cultural-center locator, not a border or a claim that every Kwakwaka’wakw nation shares one origin. 1921’s potlatch took place at Village Island.',
    dates: [
      1884,
      1980,
      'Selected legislation and cultural-center history, 1884–1980',
      'The 1884 legislation, effective in 1885, and 1980 opening of U’mista frame this inquiry, not the existence of potlatch or the end of return efforts. Prohibition was removed in 1951; practices continued during it. Later returns are not projected backward into 1980.',
    ],
    packs: ['C8'],
    question:
      'Can a government ban a practice without ending its authority for a community?',
    summary:
      'U’mista explains the potlatch through history, responsibilities, witnesses and gifts. Canadian prohibition targeted more than an entertainment. Arrests and confiscation after Dan Cranmer’s 1921 potlatch moved treasured belongings into collections elsewhere. Continuing practice and community-directed return show why a museum object’s location cannot be treated as the end of its history.',
    sections: [
      [
        'Guests also witness consequential events',
        'U’mista describes potlatches marking changes such as names, marriage, leadership and death. Invited people act as witnesses, with gifts acknowledging that role. Barb Cranmer’s account in the AMNH presentation connects performance with ancestry and identity. These are specific Kwakwaka’wakw explanations. Calling every Northwest Coast gathering the same ceremony would erase differences between peoples and their institutions.',
        'umista-history',
        'Potlatch meaning, witnesses and gifts',
      ],
      [
        'A law and a lived practice are different facts',
        'The cultural center traces legislation to 1884; its Living Tradition account gives 1 January 1885 for the law taking effect. It describes continued potlatching despite persecution. Dan Cranmer hosted a potlatch at Village Island in 1921; prosecutions and confiscation followed. The legal restriction therefore cannot be read as proof that the ceremony vanished. This is a historical account of the prohibition, not a statement of current Canadian law or a claim that every community experienced enforcement identically.',
        'umista-history',
        '1884 legislation; 1921 Village Island potlatch and confiscation',
      ],
      [
        'Read the book’s credits as evidence',
        'The 1921 ethnography names George Hunt as the source of collected data and Franz Boas as author. Its annual-report period 1913–14 is not its publication date. That title page documents how knowledge entered a government publication; it does not give the institution exclusive authority over the lives described. Read such records beside community accounts. The historical word in the book’s title is not a substitute for every nation’s own name.',
        'hunt-boas-1921',
        'Part 2 ethnographic title and annual-report title pages',
      ],
      [
        'Return involves people and decisions',
        'U’mista’s account describes efforts by families, Elders and councils to recover confiscated belongings and determine where they should be cared for. The cultural centre opened in 1980, after the prohibition had been removed in 1951. Our endpoint marks that institution’s opening; it does not assert that every belonging had returned. A published photograph or an available image license also cannot establish unrestricted cultural rights to every ceremonial meaning.',
        'umista-about',
        'Cultural preservation and 1980 opening',
      ],
    ],
    fact: [
      'The 1884 legislation did not end potlatching; U’mista documents continuing practice, confiscations following the 1921 potlatch and the 1951 removal of the prohibition.',
      'umista-history',
      'Prohibition, continued practice, Village Island and 1951 revision',
    ],
    objects: ['hunt-title-1921'],
    terms: ['evidence', 'inference', 'provenance', 'repatriation', 'potlatch'],
    dimensions: [
      [
        'Work and materials',
        'Made belongings, food and gifts participate in social responsibilities; they are more than interchangeable decorations.',
        'umista-history',
        'Potlatch witnesses and treasured belongings',
      ],
      [
        'Knowledge and belonging',
        'Witnesses, names and responsibilities give the ceremony significance that a ban did not erase.',
        'kwak-amnh',
        'Barb Cranmer transcript: Potlatch Means to Give',
      ],
      [
        'Evidence and custody',
        'Government publications, confiscation records and community-directed return expose different forms of authority over collections.',
        'umista-history',
        'Return negotiations and descendant decisions',
      ],
    ],
    prompt:
      'What is the difference between a law prohibiting a ceremony, evidence that people continued it, and a community deciding where belongings should be kept?',
  }),
].map((s) => {
  if (s.id === 'bering-sea-carvers') {
    s.claims[0]!.citations.push(
      cite(
        'bering-whaling',
        'Abstract: regional chronology and marine-carbon correction',
      ),
    );
    s.sections[3]!.citations.push(
      cite(
        'bering-whaling',
        'Walrus sites, migration and social/technological explanations',
      ),
    );
  }
  if (s.id === 'inuinnait-sewing') {
    s.dimensions['Evidence and custody']!.citations.push(
      cite('inuinnait-patterns', 'Community-led researched reconstructions'),
    );
  }
  if (s.id === 'ozette-makah') {
    s.interval.alternatives = [
      {
        label:
          'SAH reports 1560 or 1700 CE burial estimates; neither is village occupation.',
        citations: [cite('ozette-architecture', 'Mudslide dating paragraph')],
      },
      {
        label:
          'Makah museum reports 500±50 BP radiocarbon age; WSU discusses likely 1700 correlation. These have different methods/scopes.',
        citations: [
          cite('ozette-museum', 'Reported radiocarbon age'),
          cite('ozette-wsu', 'Likely 1700 event interpretation'),
        ],
      },
    ];
    s.sections[2]!.citations.push(
      cite('ozette-museum', '500±50 BP radiocarbon wording'),
      cite('ozette-wsu', '1700 interpretation'),
      cite(
        'ozette-dating-discussion',
        'Printed p. 84, earlier c. 1500 estimate and proposed 1700 correlation',
      ),
    );
    s.sections[3]!.citations.push(
      cite('makah-loc', 'Photograph title, date and qualified location'),
    );
    s.dimensions['Evidence and custody']!.citations.push(
      cite('makah-loc', 'Later photograph: date and qualified location'),
    );
  }
  if (s.id === 'hidatsa-villages') {
    s.sections[0]!.citations.push(cite('mha-history', '1845 relocation'));
    s.sections[2]!.citations.push(cite('knife-subsistence', 'Food Storage'));
  }
  if (s.id === 'kwakwakawakw-potlatch') {
    s.sections[0]!.citations.push(
      cite('kwak-amnh', 'Barb Cranmer transcript: Potlatch Means to Give'),
    );
    s.sections[1]!.citations.push(
      cite('umista-ban', 'The Start of the Potlatch Ban, effective 1 January 1885'),
    );
    s.sections[3]!.citations.push(
      cite('umista-history', '1951 revision and return negotiations'),
    );
  }
  return {
    ...s,
    claims: s.claims.map((c) => ({
      ...c,
      checkedOn: c.checkedOn === '2026-10-26' ? accessed : c.checkedOn,
    })),
  };
});
northernSources.push(
  source(
    'hsi-site-history',
    'About the Jump: Blackfoot history',
    'Head-Smashed-In Buffalo Jump interpretive site',
    'https://headsmashedin.ca/about-jump',
    'scholarship',
    'Social Structure and Seasonal Travel: bands, coordinated hunts and seasonal round; not used for a timeless population, universal political form or current demographic/legal claim.',
  ),
);
export const northernJourney: Journey = {
  id: 'northern-knowledge',
  printBreakAfter: [3],
  title: 'Arctic, coast and Plains: work, knowledge and belonging',
  question: 'How do different communities sustain life and pass on knowledge?',
  duration: '35–50 minutes',
  introduction:
    'Travel across six selected contexts, from a Bering Sea carving to gardens, clothing and community-directed collections. The stops span different centuries and distinct peoples. This is an investigation of shared questions, not an ancient itinerary or a ladder from one way of life to another.',
  stops: [
    {
      subject: 'bering-sea-carvers',
      year: 400,
      title: 'Start with one tool, not a whole people',
      narrative:
        'Inspect the counterweight. Separate its visible form, the museum’s functional interpretation and the unresolved relationship between object dating and regional chronology.',
      object: 'met-717577',
    },
    {
      subject: 'ozette-makah',
      year: 1700,
      title: 'Ask what mud preserved',
      narrative:
        'Read Makah accounts of cedar work, oral history and custody. The displayed photograph is later community documentation; the house-burial date remains disputed.',
      object: 'makah-loc-1910',
    },
    {
      subject: 'blackfoot-bison',
      year: 1750,
      title: 'Move beyond the moment at the cliff',
      narrative:
        'Find the work of coordinating a hunt and processing food. Keep a later landscape photograph and a limited cooking experiment distinct from an ancient event.',
      object: 'hsi-cliff-2005',
    },
    {
      subject: 'hidatsa-villages',
      year: 1780,
      title: 'Put gardens and women’s work in the picture',
      narrative:
        'Investigate growing, storing and exchanging food beside hunting. Compare the village with Ozette: similar needs do not make the communities identical.',
      object: 'knife-earthlodge',
      compare: 'ozette-makah',
    },
    {
      subject: 'inuinnait-sewing',
      year: 1915,
      title: 'Read clothing with its makers’ knowledge',
      narrative:
        'Begin with named people in a photograph, then read the community-led study of patterns, materials and language. Changing clothes need not mean an ended culture.',
      object: 'inuinnait-plate-1922',
    },
    {
      subject: 'kwakwakawakw-potlatch',
      year: 1980,
      title: 'Ask who keeps and interprets belongings',
      narrative:
        'Separate a ban from the practice it targeted, and publication from community authority. Learn why 1980 is an institutional milestone, not the end of a people or of return efforts.',
      object: 'hunt-title-1921',
      compare: 'inuinnait-sewing',
    },
  ],
  conclusion:
    'Hunting, gardening, woodworking, sewing and witnessing drew on distinct systems of skill and responsibility. Material traces establish some facts; community accounts and careful source reading establish others. Similar needs never make these peoples interchangeable, and neither a relocation nor a legal prohibition proves that a culture ended.',
  evidence: {
    prompt:
      'Which comparison best respects both the material evidence and the community accounts?',
    options: [
      {
        text: 'Hidatsa gardens and Makah cedar work sustained different communities; material traces and community accounts answer complementary questions.',
        supported: true,
        feedback:
          'The community-authored subsistence guide documents Hidatsa garden/storage work. Makah sources explain cedar techniques and custody. These specific histories support comparison without proving identical institutions or direct contact.',
      },
      {
        text: 'A photograph of one Arctic outfit or one bison jump can describe how all northern peoples lived.',
        supported: false,
        feedback:
          'The photograph names particular people in dancing costume. Plains evidence includes village agriculture as well as communal hunting. Neither image supplies a universal regional identity.',
      },
      {
        text: 'Once a village moved or potlatching was banned, the people and their knowledge ceased to exist.',
        supported: false,
        feedback:
          'The MHA history traces relocation and continuity. U’mista documents potlatching during prohibition and community efforts to recover belongings. Administrative dates are not the lifespan of a people.',
      },
    ],
    citations: [
      cite('knife-subsistence', 'Women’s Influence and Food Storage'),
      cite('makah-canoes', 'Makah Canoe Construction'),
      cite('umista-history', 'Continued practice and return efforts'),
    ],
  },
  returnPrompt:
    'Choose one northern object or landscape. Keep one observation, one supported explanation and one question that requires another kind of evidence.',
};
