import { regions } from '../../src/atlas/model';
import type { Pack, GlossaryTerm } from '../../src/atlas/model';
export const glossary: GlossaryTerm[] = [
  [
    'genocide',
    'Under the Genocide Convention, genocide involves specified acts committed with the intent to destroy all or part of a national, ethnic, racial or religious group because it is that group. The acts include killing members, seriously harming them, and forcibly transferring children of the group to another group.',
  ],
  [
    'primary-source',
    'Original evidence directly connected to the historical question, such as an object, record or first-hand account. A memoir or oral history recorded later can also be a primary source. Its date, purpose, memory and mediation still need examination.',
  ],
  [
    'patronage',
    'Support or commissioning of work by a person or institution, shaping what makers could produce.',
  ],
  [
    'tomb',
    'A place prepared for the dead. Its objects may reflect the beliefs and resources of those arranging the burial.',
  ],
  [
    'estate',
    'A substantial property and the land, buildings and labor that sustain it.',
  ],
  [
    'afterlife',
    'Beliefs about an existence after death. Historians study how people represented and practiced these beliefs.',
  ],
  [
    'evidence',
    'Information used to support or challenge an account of the past. Objects, written records and spoken testimony can all provide evidence. Each needs to be understood in context.',
  ],
  [
    'inference',
    'An explanation drawn from evidence rather than something directly observed.',
  ],
  [
    'chronology',
    'The ordering and dating of events. Dates can be approximate, disputed or revised.',
  ],
  [
    'ritual',
    'An action or sequence given particular shared significance, often repeated in a religious or social setting.',
  ],
  [
    'dynasty',
    'A sequence of rulers associated with one family; it is not the same thing as a whole society.',
  ],
  [
    'empire',
    'A political formation ruling over diverse territories and peoples, often through conquest and unequal power.',
  ],
  [
    'freedman',
    'A formerly enslaved man. The label identifies a past legal status, not the full experience of a person.',
  ],
  ['caravan', 'People and pack animals traveling together, often carrying goods.'],
  [
    'inscription',
    'Words deliberately written or cut on a surface. The author’s purposes and audience matter.',
  ],
  [
    'coinage',
    'Coins and the practices through which authorities issue and people use them.',
  ],
  [
    'provenance',
    'The recorded history of an object’s ownership. A findspot is a different question: where it was discovered.',
  ],
  ['port', 'A place where vessels land and goods or people enter a wider network.'],
  ['stele', 'An upright stone monument, often carved or inscribed.'],
  ['archaeology', 'Study of the past through material remains and their contexts.'],
  [
    'irrigation',
    'Directing water to fields. The channels and their maintenance involve both environments and people.',
  ],
  [
    'tribute',
    'Goods or labor demanded by a political authority. Its precise form varies by setting.',
  ],
  ['iconography', 'The study of imagery and its meanings in a particular context.'],
  ['regalia', 'Objects that represent office, rank or authority.'],
  ['material culture', 'Things people make and use, studied as part of social life.'],
  [
    'enslavement',
    'The coercive treatment of people as property, denying freedom and exploiting their work.',
  ],
  [
    'colonialism',
    'Control of people and territories by an outside power, involving unequal political and economic relationships.',
  ],
  [
    'decolonization',
    'Processes of ending colonial rule; political independence did not automatically end every inequality.',
  ],
  [
    'archive',
    'A collection of records, shaped by decisions about what was created, kept, lost and made accessible.',
  ],
  [
    'industrialization',
    'Changes in production involving machines, energy, workplaces and labor organization; timing and effects differ by region.',
  ],
].map(([id, definition]) => ({
  id: id!,
  name: id!.replaceAll('-', ' '),
  definition: definition!,
}));
const coverage = Object.fromEntries(
  regions.map((r) => [
    r,
    {
      status: 'not covered',
      reason: 'This pilot does not yet provide a dossier for this regional cell.',
      subjects: [],
    },
  ]),
) as unknown as Pack['coverage'];
coverage['Americas'] = {
  status: 'researched',
  reason:
    'Three distinct contexts: Colima, Teotihuacan and northern coastal Peru; not all American societies.',
  subjects: ['colima', 'teotihuacan', 'moche'],
};
coverage['Africa'] = {
  status: 'limited',
  reason:
    'Aksum is substantive; Roman Egypt appears through Eutyches. Other African regions remain outside this chapter.',
  subjects: ['aksum', 'roman-world'],
};
coverage['Europe'] = {
  status: 'limited',
  reason:
    'Roman imperial representation; northern and eastern European communities need later expansion.',
  subjects: ['roman-world'],
};
coverage['West/Central Asia'] = {
  status: 'limited',
  reason:
    'Palmyra and intermediary exchange; uneven archaeological and textual visibility.',
  subjects: ['palmyra'],
};
coverage['South Asia'] = {
  status: 'limited',
  reason: 'Kushan/Gandhara contexts; not a survey of the subcontinent.',
  subjects: ['kushan-contexts'],
};
coverage['East Asia'] = {
  status: 'limited',
  reason:
    'Eastern Han and selected tomb models; neighboring societies are not represented equally.',
  subjects: ['eastern-han'],
};
coverage['Southeast Asia/Oceania'] = {
  status: 'limited',
  reason: 'Đông Sơn material traditions; no Oceanian dossier in this pilot.',
  subjects: ['dongson'],
};
export const pilotPack: Pack = {
  id: 'C4',
  title: 'Contemporary worlds',
  start: 1,
  end: 500,
  anchor: 200,
  question:
    'What did distant societies share—and which connections can we demonstrate?',
  orientation:
    'Around 200 CE, cities, farms, ports and households existed within many different political and cultural settings. Some regions were linked through specific networks of trade and movement. Elsewhere, a useful comparison does not imply contact. Begin with real objects, locate their date ranges, and ask what each can support.',
  journey: 'world-200',
  comparison: ['eastern-han', 'colima'],
  geography:
    'Locate the Mediterranean, Red Sea, Central and South Asia, China, Vietnam, Mexico and northern Peru. Dots are regional or city locators, not boundaries. Objects retain their catalogue ranges, including later phases.',
  limits:
    'An anchor year is a way into a changing world. This chapter is selective, especially for Africa beyond Aksum, South Asia beyond Gandhara and Oceania. Different evidence survives in different regions.',
  coverage,
};
export const oceanPack: Pack = {
  id: 'C7',
  displayWindow: { start: 1450, end: 1800 },
  title: 'Ocean connections and unequal power',
  start: 1500,
  end: 1800,
  anchor: 1600,
  question: 'How did ocean exchange reshape work, belief, power and resistance?',
  orientation:
    'Ships joined ports through goods, money, stories and people. These connections were made by artists, translators, sailors and workers as well as rulers. Some were negotiated; others depended on conquest, enslavement and forced displacement. Begin in the 1450–1650 context, then follow selected consequences into the later eighteenth century.',
  journey: 'ocean-connections',
  comparison: ['benin-ivory', 'ming-workshops'],
  geography:
    'Portugal, Benin, Kongo, South Asia, China, Manila, Mexico and Banda belong to different networks. The journey includes the earlier 1497–99 voyage as context and labels a Mexican jar made after 1650. Schematic routes do not establish a particular object’s itinerary.',
  limits:
    'This chapter samples African, Asian, European and American encounters. It is not a complete history of Atlantic slavery, Indigenous resistance or the Indian Ocean. West/Central Asian and Oceanian perspectives need fuller treatment.',
  coverage: {
    Americas: {
      status: 'limited',
      reason:
        'Acapulco, Pacific cargoes and later Mexican ceramics; Indigenous and enslaved American experiences need fuller dossiers.',
      subjects: ['manila-network'],
    },
    Africa: {
      status: 'researched',
      reason:
        'Distinct Benin commissions and Kongo translation histories; other regions remain outside this investigation.',
      subjects: ['benin-ivory', 'kongo-translation'],
    },
    Europe: {
      status: 'limited',
      reason:
        'Portuguese access and armed expansion; the VOC appears through Banda’s colonial records.',
      subjects: ['portuguese-voyage', 'banda-1621'],
    },
    'West/Central Asia': {
      status: 'not covered',
      reason:
        'The consulted Mughal and Ming sources identify connections with Persian traditions and West Asian markets, but no standalone regional dossier is released in this pack.',
      subjects: [],
    },
    'South Asia': {
      status: 'limited',
      reason:
        'Akbar’s atelier and Indian Ocean ports; regional labor and inland communities are not comprehensively represented.',
      subjects: ['mughal-books', 'portuguese-voyage'],
    },
    'East Asia': {
      status: 'limited',
      reason:
        'Ming production and Pacific exchange; not a general survey of China, Japan or Korea.',
      subjects: ['ming-workshops'],
    },
    'Southeast Asia/Oceania': {
      status: 'researched',
      reason:
        'Banda and Manila represent different roles in ocean networks. Oceania is not covered by a dossier in this pack.',
      subjects: ['banda-1621', 'manila-network'],
    },
  },
};
