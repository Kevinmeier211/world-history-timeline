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
export const northAmericanSources: Source[] = [
  source(
    'pp-nps',
    'Monumental Earthworks of Poverty Point: World Heritage Site',
    'National Park Service',
    'https://www.nps.gov/articles/000/monumental-earthworks-of-poverty-point-world-heritage-site.htm',
    'archaeology',
    'Site setting, hunter-fisher-gatherers, earthworks and the 1700–1100 BCE construction/use frame.',
  ),
  source(
    'pp-louisiana',
    'Poverty Point',
    'Louisiana Division of Archaeology',
    'https://www.crt.state.la.us/dataprojects/archaeology/povertypoint/assets/poverty-point-pdf-1.0.pdf',
    'archaeology',
    'Printed pp1–4, 6–11, 22–25: dated site, chronology, food, materials, trade, pottery and heating objects. Copyrighted photographs are consulted, not copied.',
  ),
  source(
    'pp-gibson',
    'Poverty Point: A Culture of the Lower Mississippi Valley',
    'Louisiana Archaeological Survey and Antiquities Commission; Project Gutenberg digital edition',
    'https://www.gutenberg.org/cache/epub/62948/pg62948-images.html',
    'archaeology',
    'Anthropological Study 7, first printing 1983/corrected printing 1985; Food Preparation pp20–22 and Figure 10. Older regional synthesis distinguished from the narrower main-site dates. Digital catalogue explicitly identifies public-domain status in the USA.',
    'Jon L. Gibson',
  ),
  source(
    'hopewell-nps',
    'History & Culture: Hopewell Culture',
    'National Park Service',
    'https://www.nps.gov/hocu/learn/historyculture/index.htm',
    'archaeology',
    '1–400 CE Ohio focus; Hopewell as a broad network among different Native American groups, not a single tribe or state.',
  ),
  source(
    'hopewell-moundcity',
    'Mound City Group',
    'National Park Service',
    'https://www.nps.gov/hocu/learn/historyculture/mound-city-group.htm',
    'archaeology',
    'Introduction and Ceremonial Gatherings: modern restorations, intact base layers, documentary/field research, and lack of permanent settlement inside the enclosure.',
  ),
  source(
    'hopewell-moundgroup',
    'Hopewell Mound Group',
    'National Park Service',
    'https://www.nps.gov/hocu/learn/historyculture/hopewell-mound-group.htm',
    'archaeology',
    'Survey illustration credited to Squier and Davis 1848; New to Science, A List of Superlatives, and Archeological Expeditions: landowner-derived name, nonlocal materials, 2001 magnetometry and older defensive interpretation.',
  ),
  source(
    'hopewell-nps-photo',
    'Mound City Group: NPS gallery photograph',
    'National Park Service',
    'https://www.nps.gov/media/photo/gallery-item.htm?gid=9C9CFD95-D0C6-48A1-899B-A6F9C81D6BB5&id=d829d8d4-bdb5-458d-bb2b-f849817b20a0',
    'catalogue',
    'Gallery metadata identifies Mound City, NPS credit, 11 January 2013 image creation, Public domain and Full granting rights. Original 2048×1536 image selected for inspection.',
  ),
  source(
    'hopewell-unesco',
    'Hopewell Ceremonial Earthworks',
    'UNESCO World Heritage Centre',
    'https://whc.unesco.org/en/list/1689/',
    'archaeology',
    'Description: eight ceremonial enclosure complexes, geometric design, astronomical alignments and nonlocal raw materials. The date description is relative; this dossier uses the NPS 1–400 CE focus.',
  ),
  source(
    'chaco-history',
    'History & Culture: The Center of Chacoan Culture',
    'National Park Service',
    'https://www.nps.gov/chcu/learn/historyculture/index.htm',
    'archaeology',
    'Great-house construction from the mid/late 800s; labor/materials, gathering-place accounts, changes in the 1100s/1200s, migration and traditionally associated peoples.',
  ),
  source(
    'chaco-bonito',
    'Pueblo Bonito',
    'National Park Service',
    'https://www.nps.gov/chcu/planyourvisit/pueblo-bonito.htm',
    'archaeology',
    'Construction in stages approximately 850–1150 CE. This building interval is distinct from the wider regional 850–1250 frame.',
  ),
  source(
    'chaco-nps-photo',
    'Places To Go: Pueblo Bonito corner doorway',
    'National Park Service',
    'https://www.nps.gov/chcu/planyourvisit/placestogo.htm',
    'catalogue',
    'Pueblo Bonito image caption identifies a corner doorway and credits NPS Photo; photographic date and individual maker not supplied.',
  ),
  source(
    'chaco-cacao',
    'Evidence of cacao use in the Prehispanic American Southwest',
    'PNAS 106(7), 2110–2113; PMC2650116',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC2650116/',
    'primary',
    'doi:10.1073/pnas.0812817106. Abstract; sample selection, chemical methods/results and Discussion: five vessel-fragment samples, three positive probable cylinder jars; stylistic dating c1000–1125 CE. Does not identify an exact trade route or universal access. Figure 1 has separate copyright and is not reproduced.',
    'Patricia L. Crown and W. Jeffrey Hurst',
  ),
  source(
    'chaco-pueblo-council',
    'All Pueblo Council of Governors Resolution APCG 2025-02',
    'All Pueblo Council of Governors',
    'https://indianpueblo.org/wp-content/uploads/APCG_Reso2025-02-Chaco-RMPA.pdf',
    'primary',
    'Page 1, second WHEREAS clause: continuing spiritual, historical and cultural significance of Greater Chaco for Pueblos and Tribes including Hopi. Cited as a dated community statement, not a current land-law status report.',
  ),
  source(
    'cahokia-unesco',
    'Cahokia Mounds State Historic Site',
    'UNESCO World Heritage Centre',
    'https://whc.unesco.org/en/list/198/',
    'archaeology',
    'Description and Brief synthesis: broader occupation 800–1400, urban peak 1050–1150, residential/public/work areas and reconstruction. The selected urban investigation is c1050–1400; no exact population count adopted.',
  ),
  source(
    'cahokia-illinois',
    'About the Cahokia Initiative',
    'University of Illinois, Cahokia Initiative',
    'https://cahokia.web.illinois.edu/about/',
    'archaeology',
    'Urban core and wider Greater Cahokia; organized earthmoving around 1050 CE, neighborhoods and archaeological scale. Interpretive claims are attributed, not used to invent imperial borders.',
  ),
  source(
    'cahokia-after',
    'After Cahokia: Indigenous Repopulation and Depopulation of the Horseshoe Lake Watershed AD 1400–1900',
    'American Antiquity 85(2), 263–278',
    'https://www.cambridge.org/core/journals/american-antiquity/article/after-cahokia-indigenous-repopulation-and-depopulation-of-the-horseshoe-lake-watershed-ad-14001900/C678D62BE9FAB07C9283D62BE9757685',
    'primary',
    '2020, doi:10.1017/aaq.2019.103. Abstract and study design: sediment fecal-stanol reconstruction with archaeological/historical/environmental evidence; regional post-1400 population interpretation, not a direct census. Paired with the 2021 critique.',
    'A. J. White, Samuel E. Munoz, Sissel Schroeder and Lora R. Stevens',
  ),
  source(
    'cahokia-critique',
    'Questioning the Native American Population Rebound in the Horseshoe Lake Watershed from AD 1500 to AD 1700',
    'American Antiquity 86(1), 199–202; Illinois Experts',
    'https://experts.illinois.edu/en/publications/questioning-the-native-american-population-rebound-in-the-horsesh/',
    'scholarship',
    '2021, doi:10.1017/aaq.2020.74. Authors’ abstract: disputes White et al.’s population/identity interpretation and alternative explanations of stanols. Only abstract-level claims are used.',
    'B. Jacob Skousen and Michael Aiuvalasit',
  ),
  source(
    'cahokia-loc-1907',
    'Illinois, Cahokia Mound, October 16, 1907',
    'Library of Congress',
    'https://www.loc.gov/pictures/item/97505973/',
    'catalogue',
    'Photomechanical print, c1907; copyright credit National Photographic Library; LOT 3889 / LC-USZ62-118522. Image is later documentation. U.S. publication copyright is expired.',
  ),
  source(
    'nps-media-rights',
    'Disclaimer: Ownership',
    'National Park Service',
    'https://www.nps.gov/aboutus/disclaimer.htm',
    'archive',
    'Ownership section: NPS-created government works generally public domain unless otherwise indicated; third-party material may be restricted. Only explicitly NPS-credited images selected.',
  ),
];
export const northAmericanSubjects: Subject[] = [
  dossier({
    id: 'poverty-point',
    name: 'Poverty Point: earthworks, food and exchange',
    aliases: ['Lower Mississippi', 'Poverty Point culture'],
    kind: 'place',
    region: 'Americas',
    place: 'Macon Ridge, northeastern Louisiana, United States',
    coordinates: [-91.407, 32.636],
    geo: 'Main archaeological-site locator; not the boundary of a people or exchange network.',
    dates: [
      -1700,
      -1100,
      'Main earthwork complex, c. 1700–1100 BCE',
      'Main-site construction/use frame from NPS and Louisiana. The wider Poverty Point archaeological tradition has broader dates; these are not the lifespan of an Indigenous people.',
    ],
    packs: ['C2'],
    question:
      'Could people build a monumental place without depending on crop agriculture?',
    summary:
      'On an elevated ridge above river lowlands, people created a landscape of curved earthen ridges, mounds and gathering space. They hunted, fished and gathered food while moving stone and other materials over long distances. Poverty Point challenges a simple ladder in which farming must always come first and monuments or coordinated work must come later.',
    sections: [
      [
        'A place made through work',
        'The complex developed over centuries. Its builders took advantage of Macon Ridge’s elevation beside the floodplain rather than choosing an empty, featureless space. Moving and placing earth required repeated decisions and cooperation. Archaeology can show construction and use, but a mound’s size does not by itself identify a king, a tax system or the exact way workers were organized.',
        'pp-nps',
        'Site setting and residential/ceremonial earthworks, 1700–1100 BCE',
      ],
      [
        'Meals belong in the history',
        'Food remains and tools connect the large landscape to ordinary skilled work. Louisiana’s archaeological account describes hunting, fishing and gathering rather than reliance on cultivated crops. Baked-earth heating objects could replace cooking stones in earth ovens. Experimental cooking helps test that interpretation. The photograph shown here presents several shapes; it does not preserve the recipe or tell us who prepared a particular meal.',
        'pp-louisiana',
        'Printed pp22–25: Food and Poverty Point Objects',
      ],
      [
        'Materials traveled; people made choices',
        'The local landscape supplied useful earth but not all the stone people wanted. The state archaeological account describes nonlocal stone and river travel. Material identification supports exchange and movement; it cannot automatically reconstruct a single trader’s journey or prove one ruler controlled the whole network. A repaired or reused tool also asks a different question from a spectacular mound: how did people manage valued materials in daily work?',
        'pp-louisiana',
        'Printed pp6–11: Trade and Travel and stone sources',
      ],
      [
        'Keep the site and the tradition separate',
        'Poverty Point is a modern site name, not a surviving name chosen by all its builders. The main complex’s c1700–1100 BCE window is narrower than the regional archaeological tradition discussed in Gibson’s older study. Treating these as different definitions avoids extending a settlement merely to match every associated object. The heating objects in Figure 10 have no individual dates or findspots supplied in that illustration, and are labeled accordingly.',
        'pp-gibson',
        'Introduction; regional tradition; Food Preparation, pp20–22 and Figure 10',
      ],
    ],
    fact: [
      'The selected earthwork complex was made by hunter-fisher-gatherers in the c1700–1100 BCE frame, rather than by a society known here to depend on crop agriculture.',
      'pp-nps',
      'Earthwork complex and subsistence description',
    ],
    objects: ['pp-cooking-objects'],
    terms: ['evidence', 'inference', 'earthwork', 'experimental-archaeology'],
    dimensions: [
      [
        'Work and coordination',
        'Earthmoving and food preparation reveal coordinated and household work; the exact governing arrangements are not established by mound size.',
        'pp-nps',
        'Earthworks and subsistence',
      ],
      [
        'Evidence and its limits',
        'Materials, food remains and heating objects support practical questions; an individually undated illustration cannot supply an exact production year.',
        'pp-gibson',
        'Food Preparation and Figure 10',
      ],
    ],
    prompt:
      'Explain how a cooking tool and an earthwork could answer different questions about the same community.',
  }),
  dossier({
    id: 'hopewell-earthworks',
    name: 'Ohio Hopewell: gathering places and distant materials',
    aliases: ['Hopewell', 'Mound City', 'Hopewell Mound Group'],
    kind: 'process',
    region: 'Americas',
    place: 'Ohio River tributaries; locator at Mound City Group, Ohio, United States',
    coordinates: [-82.99, 39.376],
    geo: 'One ceremonial site within a wider network; neither a tribal capital nor an imperial border.',
    dates: [
      1,
      400,
      'Selected Ohio ceremonial networks, c. 1–400 CE',
      'NPS focus for these earthworks. Hopewell is an archaeological network label; the bounds do not date the existence of every related community.',
    ],
    packs: ['C4'],
    question: 'How could dispersed communities create shared monumental places?',
    summary:
      'People built geometric enclosures and mounds and gathered materials from far beyond present-day Ohio. Archaeologists use Hopewell to describe linked practices among different Native American groups. The word does not identify a single tribe, empire or city. A gathering place can help make a community even when people do not all live permanently inside its walls.',
    sections: [
      [
        'A network, not one named nation',
        'NPS describes shared economic, political and spiritual practices among different groups in the eastern woodlands. Mica, copper, marine shell and obsidian connect local finds to distant sources. Those materials demonstrate contacts, but several kinds of movement may have been involved. We should not turn every material source into a direct road, assign a uniform language, or make Hopewell the personal name of all the builders.',
        'hopewell-nps',
        'Broad network, different Native American groups and materials',
      ],
      [
        'Gathering and residence are different',
        'At Mound City, NPS reports no evidence of full-time residence within the enclosure. Archaeology suggests people lived in dispersed households and met at ceremonial complexes. The large works therefore ask us to investigate cooperation beyond a permanently crowded town. At Hopewell Mound Group, later magnetometry also found no evidence for long-term settlement inside the great enclosure.',
        'hopewell-moundcity',
        'Ceremonial Gatherings: residence and dispersed households',
      ],
      [
        'What a plan can and cannot show',
        'A later survey records geometry, relationships and the observer’s choices. NPS documents an early defensive interpretation and nineteenth-century mapping before modern investigations. The name Hopewell came from a later landowner. Compare the 1848 plan with the present view: neither one is an unmediated picture of every ancient ceremony. Geometry and alignments can be studied without pretending that the entire meaning of a sacred place is now known.',
        'hopewell-moundgroup',
        'New to Science; Archeological Expeditions, 1820/1848/2001',
      ],
      [
        'A restored landscape has a history',
        'The 2013 photograph shows the Mound City landscape. NPS states that the visible walls and mounds are modern restorations based on surviving bases, documentary evidence and fieldwork. That does not make the ancient construction unreal. It means the material we see now includes preservation and interpretation. This atlas shows a landscape and a survey rather than treating funerary objects as anonymous decorative trophies.',
        'hopewell-moundcity',
        'Introduction: modern restorations and surviving base layers',
      ],
    ],
    fact: [
      'The visible earthworks at Mound City are modern restorations informed by ancient base layers, documents and field research.',
      'hopewell-moundcity',
      'Introduction, paragraph on all visible mounds and walls',
    ],
    objects: ['hopewell-restored-mound', 'hopewell-survey-1848'],
    terms: ['earthwork', 'archaeological-tradition', 'evidence', 'inference'],
    dimensions: [
      [
        'Work and coordination',
        'Dispersed households could gather at shared ceremonial places; a large enclosure need not be a permanently inhabited town.',
        'hopewell-moundcity',
        'Ceremonial Gatherings',
      ],
      [
        'Evidence and its limits',
        'Survey plans, nonlocal materials, excavation and restoration each answer different questions.',
        'hopewell-moundgroup',
        'Archeological Expeditions and nonlocal materials',
      ],
    ],
    prompt:
      'What evidence would distinguish a permanent settlement from a gathering place? Include one limit of the visible landscape.',
  }),
  dossier({
    id: 'chaco-communities',
    name: 'Chaco: building, gathering and continuing histories',
    aliases: ['Ancestral Puebloan', 'Pueblo Bonito', 'Chaco Canyon'],
    kind: 'place',
    region: 'Americas',
    place: 'Chaco Canyon, San Juan Basin, New Mexico, United States',
    coordinates: [-107.96, 36.06],
    geo: 'Pueblo Bonito site locator. The regional Chacoan system extended beyond this point; no fixed political border is drawn.',
    dates: [
      850,
      1250,
      'Selected Chaco regional context, c. 850–1250 CE',
      'Regional frame. Pueblo Bonito construction c850–1150 and changes in the 1100s/1200s are distinct; this endpoint does not end Pueblo peoples or their ties to Chaco.',
    ],
    packs: ['C5', 'C6'],
    question:
      'What connects a stone building, a traded ingredient and a living cultural landscape?',
    summary:
      'Ancestral Pueblo people built great houses with planned masonry, timber and ceremonial spaces in an environment with limited rainfall. Chaco linked communities across the San Juan Basin and beyond. Archaeological chemistry adds evidence of cacao movement, while Pueblo accounts and contemporary community statements insist that this landscape’s history does not end when a regional center changes.',
    sections: [
      [
        'Constructing a place to gather',
        'Pueblo Bonito was built in stages over roughly three centuries. Quarrying, shaping and placing stone, obtaining timber and organizing rooms were different kinds of work. NPS distinguishes this building history from Chaco’s broader regional system and describes a gathering place where peoples and clans shared knowledge and ceremonies. The surviving walls show impressive construction; they cannot, on their own, tell us the identity of every worker or occupant.',
        'chaco-history',
        'Great houses, construction, gathering and descendants’ accounts',
      ],
      [
        'A chemical result with a limited reach',
        'Crown and Hurst’s 2009 study selected fragments representing five vessels from Pueblo Bonito. Three probable cylinder-jar samples yielded theobromine, interpreted as cacao evidence. The sherds were dated stylistically to about 1000–1125 CE. This supports movement of a tropical ingredient into the Southwest. It does not identify each intermediary, establish a precise route, or prove that every household drank the same beverage. The published study’s vessel photograph has separate copyright and is not reproduced here.',
        'chaco-cacao',
        'Sample selection and HPLC-MS results, pp. 2110–2112',
      ],
      [
        'Changing centers are not disappearing peoples',
        'New construction slowed and Chaco’s regional role changed in the 1100s and 1200s. Migration and reorganization are different from extinction. NPS describes continued connections with other centers and with modern Southwest communities. Our c850–1250 window defines a selected regional context; the narrower c850–1150 dates for Pueblo Bonito describe construction of a building, not the duration of all Pueblo history.',
        'chaco-bonito',
        'Construction in stages, 850–1150 CE',
      ],
      [
        'Whose evidence belongs in the account?',
        'A 2025 resolution of the All Pueblo Council of Governors describes Greater Chaco’s continuing spiritual, historical and cultural significance to Pueblos and Tribes including Hopi. It is a community-authored source about living relationships with the landscape, not an archaeological date for a wall. Reading it alongside material evidence helps prevent the mistaken story that ancient construction left no connected people. The resolution is cited in its dated context, without claiming its policy requests describe current law.',
        'chaco-pueblo-council',
        'Page 1, second WHEREAS clause; dated resolution',
      ],
    ],
    fact: [
      'The 2009 analysis detected theobromine in three of five tested vessel-fragment samples; the result supports cacao use at Pueblo Bonito, not universal access or an exact route.',
      'chaco-cacao',
      'Sample selection and Results, three probable cylinder-jar samples',
    ],
    objects: ['chaco-corner-door'],
    terms: ['evidence', 'inference', 'biomarker', 'kiva'],
    dimensions: [
      [
        'Work and coordination',
        'Masonry, timber acquisition, water management and gathering practices connect skilled work to a regional center.',
        'chaco-history',
        'Great-house construction and regional system',
      ],
      [
        'Evidence and its limits',
        'Surviving buildings, chemical residues and community statements establish different kinds of knowledge; none supplies a complete census or route map.',
        'chaco-cacao',
        'Sample selection, results and implications',
      ],
    ],
    prompt:
      'Explain one conclusion supported by the cacao analysis and one stronger claim it cannot establish.',
  }),
  dossier({
    id: 'cahokia-city',
    name: 'Cahokia: city life and the problem of disappearance',
    aliases: ['Cahokia', 'Mississippian', 'Monks Mound', 'Greater Cahokia'],
    kind: 'place',
    region: 'Americas',
    place:
      'Mississippi River floodplain near present-day Collinsville, Illinois, United States',
    coordinates: [-90.062, 38.661],
    geo: 'Cahokia core-site locator; Greater Cahokia and other Mississippian communities are not merged into one state.',
    dates: [
      1050,
      1400,
      'Selected urban context, c. 1050–1400 CE',
      'Urban investigation frame used in the 2020 study; UNESCO describes broader occupation from c800 and an urban peak c1050–1150. The boundary does not assert that Indigenous life ended here.',
    ],
    packs: ['C6'],
    question: 'How do we tell the end of an urban center from the end of a people?',
    summary:
      'Cahokia was a large settlement with earthen monuments, neighborhoods, public spaces and working areas connected to a much wider region. Its history includes concentrated authority and ordinary labor. Archaeologists continue to debate later regional population patterns. Calling the city’s decline a vanished civilization would erase both differences in the evidence and later Indigenous histories.',
    sections: [
      [
        'A city larger than one mound',
        'Monks Mound dominates many images, but UNESCO also identifies residential, public and specialized activity areas. The city’s working life cannot be reduced to a monumental silhouette. The Illinois research program studies a wider urban landscape with multiple precincts. This dossier locates the core and asks how concentrated settlement was built; it does not draw an empire around every place with related Mississippian material.',
        'cahokia-illinois',
        'Greater Cahokia, urban core and earthmoving around 1050 CE',
      ],
      [
        'Work, food and unequal power',
        'Agriculture, earthmoving, building and making things sustained the settlement. UNESCO interprets Cahokia as a complex chiefdom with surrounding centers and villages. That interpretation supports investigating unequal authority, but a site plan does not identify the conditions of every worker. The regional label Mississippian covers many communities and times. A similar ceramic form or mound is not proof that every maker was governed from Cahokia.',
        'cahokia-unesco',
        'Description and Brief synthesis: agricultural society, chiefdom and activity areas',
      ],
      [
        'What happened after the city changed?',
        'White and colleagues used lake-sediment fecal stanols together with archaeological, historical and environmental evidence to argue for renewed Indigenous population around Horseshoe Lake after the urban decline. Skousen and Aiuvalasit challenged that reconstruction and the attribution of particular populations, citing alternative explanations and regional datasets. This disagreement concerns how indirect evidence supports population history. A lake proxy is not a direct count, and this atlas does not choose a precise post-1400 population curve as settled fact.',
        'cahokia-after',
        'Abstract and population-reconstruction design; read with the paired critique',
      ],
      [
        'A later photograph and a continuing question',
        'The 1907 print shows a surviving mound long after the urban era, not an occupied medieval city. Its missing houses and people cannot be treated as proof that the wider landscape was empty. Compare the photograph, excavated activity areas and the disputed environmental reconstruction. The critical account keeps the city, the broader region, later populations and modern interpretations separate.',
        'cahokia-critique',
        'Authors’ abstract: archaeological/historical datasets and alternative stanol explanations',
      ],
    ],
    fact: [
      'The post-1400 Horseshoe Lake population reconstruction is debated; the proxy should not be presented as an uncontested census or a certain identification of a people.',
      'cahokia-critique',
      'Abstract, critique of population and identity interpretation',
    ],
    objects: ['cahokia-view-1907'],
    terms: ['evidence', 'inference', 'proxy', 'chiefdom'],
    dimensions: [
      [
        'Work and coordination',
        'Concentrated settlement combined monumental construction, agriculture, neighborhoods and specialized work under unequal authority.',
        'cahokia-unesco',
        'Description and Brief synthesis',
      ],
      [
        'Evidence and its limits',
        'A later photograph shows surviving landforms; excavation and contested lake proxies address a broader urban and regional history.',
        'cahokia-critique',
        'Abstract and alternative proxy explanations',
      ],
    ],
    prompt:
      'Distinguish the city’s changing role, a regional population estimate and the continuing history of Indigenous peoples.',
  }),
].map((s) => {
  if (s.id === 'hopewell-earthworks')
    s.sections[1]!.citations.push(
      cite('hopewell-moundgroup', 'Archeological Expeditions: 2001 magnetometry'),
    );
  if (s.id === 'chaco-communities')
    s.sections[2]!.citations.push(
      cite(
        'chaco-history',
        'Changes in the 1100s/1200s, migration and continuing connections',
      ),
    );
  if (s.id === 'cahokia-city')
    s.sections[2]!.citations.push(
      cite(
        'cahokia-critique',
        'Authors’ abstract: alternative explanations and regional datasets',
      ),
    );
  return { ...s, claims: s.claims.map((c) => ({ ...c, checkedOn: accessed })) };
});
export const northAmericanJourney: Journey = {
  id: 'north-american-communities',
  title: 'Earth, food and gathering in Indigenous North America',
  question:
    'How can we investigate community life without making every monument into the same kind of state?',
  duration: '25–40 minutes',
  introduction:
    'Travel across different centuries and landscapes north of Mesoamerica. These are comparisons among distinct communities, not stages in one people’s development or a route connecting all four sites. Notice food, work, gathering and the limits of the surviving record.',
  stops: [
    {
      subject: 'poverty-point',
      year: -1500,
      title: 'Start with a meal and a mound',
      narrative:
        'Inspect heating objects and ask how food preparation belonged to a monumental landscape built by hunter-fisher-gatherers. Individual objects in the later publication are not precisely dated.',
      object: 'pp-cooking-objects',
    },
    {
      subject: 'hopewell-earthworks',
      year: 200,
      title: 'Gather without living inside the walls',
      narrative:
        'Distinguish a ceremonial enclosure from a permanent town. Compare a modern restoration with an 1848 survey; both need interpretation.',
      object: 'hopewell-restored-mound',
    },
    {
      subject: 'chaco-communities',
      year: 1100,
      title: 'Test a connection through a trace ingredient',
      narrative:
        'Read the cacao analysis as evidence of movement, then separate that result from an exact route or a claim about every household.',
      object: 'chaco-corner-door',
    },
    {
      subject: 'cahokia-city',
      year: 1150,
      title: 'Look beyond one monumental view',
      narrative:
        'Investigate neighborhoods and work, then consider the debate about population after the urban center changed. Compare Cahokia with Chaco without assuming contact or identical government.',
      object: 'cahokia-view-1907',
      compare: 'chaco-communities',
    },
  ],
  conclusion:
    'Food, skilled work, exchange and gathering took different forms across North America. Monumental building does not require one universal governing system. Changes in a center’s role do not establish the disappearance of a people, and later photographs must be read alongside archaeology and community accounts.',
  evidence: {
    prompt: 'Which statement stays within the Chaco cacao study’s evidence?',
    options: [
      {
        text: 'Residues in selected Pueblo Bonito vessel fragments support cacao use and ingredient movement, while access and exact routes remain uncertain.',
        supported: true,
        feedback:
          'The study selected five samples and detected theobromine in three probable cylinder-jar fragments. Its evidence does not map every intermediary or describe every household.',
      },
      {
        text: 'The result proves that all Chaco residents drank cacao daily and that we know the precise road it followed.',
        supported: false,
        feedback:
          'A small vessel-fragment sample cannot establish universal daily consumption or an exact itinerary.',
      },
      {
        text: 'Because a city or ceremonial center changed, all related Indigenous peoples must have disappeared.',
        supported: false,
        feedback:
          'A building phase, a regional population interpretation and a people’s continuing history are distinct. Pueblo community statements and the Cahokia debate help keep them separate.',
      },
    ],
    citations: [
      cite('chaco-cacao', 'Sample selection and results, pp. 2110–2112'),
      cite('chaco-pueblo-council', 'Page 1, continuing significance'),
      cite('cahokia-critique', 'Abstract'),
    ],
  },
  returnPrompt:
    'Choose one object or landscape. State an observation, a supported explanation and one thing it cannot tell you.',
};
