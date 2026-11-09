import type { ComparisonDefinition, Corpus } from '../../src/atlas/model';
import { dimensionKey } from '../../src/atlas/comparisons';

const pairs: [string, string, string][] = [
  [
    'factory-reform',
    'tomioka',
    'How can learning a production skill differ from putting worker protection into practice?',
  ],
  [
    'banda-1621',
    'manila-network',
    'Whose work is visible in these commercial and colonial records, and whose experience needs other evidence?',
  ],
  [
    'isfahan-silk',
    'bukhara-books',
    'Which records explain the work supporting city life, and whose experience remains unknown?',
  ],
  [
    'isfahan-silk',
    'zand-iran',
    'How can an object’s attribution be kept separate from a city’s households and political history?',
  ],
  [
    'ming-workshops',
    'ottoman-workshops',
    'What distinguishes evidence of court demand from evidence of making and buying?',
  ],
  [
    'mughal-books',
    'ottoman-workshops',
    'How do writing and decoration connect specialized work with patrons and audiences?',
  ],
  [
    'chaco-communities',
    'ocmulgee-council',
    'How can building records and particular samples explain work without dating a whole people?',
  ],
  [
    'cahokia-city',
    'ocmulgee-council',
    'How do local evidence and attributed community accounts change explanations of settlement?',
  ],
  [
    'byzantium',
    'borobudur',
    'How can evidence for making, supporting and maintaining a place reveal different institutions?',
  ],
  [
    'byzantium',
    'maya-vessel',
    'How do a portable image, an owner’s name and separate work contexts support different explanations?',
  ],
  [
    'dongson',
    'hopewell-earthworks',
    'How do documented deposits and later place records change an explanation of shared material forms?',
  ],
  [
    'colima',
    'hopewell-earthworks',
    'What can visible form, an excavated association and a later reconstruction each establish about a place?',
  ],
  [
    'chavin-textile',
    'teotihuacan',
    'How does evidence for making differ between a portable fragment and an excavated neighborhood?',
  ],
  [
    'chavin-textile',
    'moche',
    'Which observations support a making technique, and which further evidence could locate its makers?',
  ],
  [
    'indonesia-independence',
    'ghana-independence',
    'Which powers changed at independence, and what remained contested?',
  ],
  [
    'ghana-independence',
    'south-africa-rights',
    'How does a change in government differ from a guarantee of political rights?',
  ],
  [
    'roman-world',
    'eastern-han',
    'How did empires turn local work into imperial power?',
  ],
  [
    'eastern-han',
    'colima',
    'What does a model building preserve about the world of its makers?',
  ],
  [
    'roman-world',
    'palmyra',
    'How do personal portraits and imperial images make status visible?',
  ],
  [
    'palmyra',
    'kushan-contexts',
    'How do objects reveal communities within wider networks?',
  ],
  [
    'kushan-contexts',
    'aksum',
    'How do coin images and excavated coin contexts answer different questions?',
  ],
  [
    'palmyra',
    'aksum',
    'How do local transactions and inland work complicate a history told only through distant trade?',
  ],
  [
    'aksum',
    'portuguese-voyage',
    'How does a port connect inland power to maritime exchange?',
  ],
  [
    'teotihuacan',
    'moche',
    'What kinds of work become visible through surviving material?',
  ],
  [
    'dongson',
    'shang-ritual',
    'How can bronze communicate ideas as well as display skilled work?',
  ],
  [
    'benin-ivory',
    'ming-workshops',
    'How do makers respond to patrons and distant audiences?',
  ],
  [
    'kongo-translation',
    'mughal-books',
    'How are religious ideas remade through local languages and materials?',
  ],
  [
    'manila-network',
    'ming-workshops',
    'What changes when crafted objects circulate across an ocean?',
  ],
  [
    'banda-1621',
    'haitian-revolution',
    'How do sources reveal coercion and struggles over freedom?',
  ],
  [
    'uruk-accounts',
    'dholavira',
    'How do accounts and waterworks make different kinds of urban work visible?',
  ],
  [
    'uruk-accounts',
    'old-kingdom',
    'Whose work becomes visible in a record or an image?',
  ],
  ['dholavira', 'liangzhu', 'How did communities organize work around water?'],
  [
    'caral',
    'skara-brae',
    'What can built spaces tell us about gathering and household work?',
  ],
  [
    'old-kingdom',
    'caral',
    'How did food production and building renewal require continuing work, and which records make it visible?',
  ],
  [
    'old-kingdom',
    'skara-brae',
    'How can we distinguish commemoration, occupied space and later rebuilding when investigating daily work?',
  ],
  [
    'uluburun',
    'shang-ritual',
    'How do cargo and ritual objects reveal different stages of skilled work?',
  ],
  [
    'hattusha-change',
    'uluburun',
    'What can a capital and a shipwreck tell us about changing networks?',
  ],
  ['kerma-potters', 'olmec', 'How do material choices reveal skills and connections?'],
  [
    'lapita',
    'polynesian-voyaging',
    'What evidence supports an account of movement across water?',
  ],
  [
    'olmec',
    'poverty-point',
    'How did different uses of clay connect skilled work with social or practical needs?',
  ],
  [
    'lapita',
    'poverty-point',
    'How can material observations and dated contexts distinguish a making technique, a practical use and a proposed connection?',
  ],
  [
    'qin-administration',
    'ashoka-messages',
    'How did a common rule become local administrative work?',
  ],
  [
    'ashoka-messages',
    'athens-water',
    'How do public messages and public work reveal different political powers?',
  ],
  [
    'nimrud-palace',
    'ashoka-messages',
    'How do rulers address different audiences in stone?',
  ],
  [
    'athens-water',
    'qin-administration',
    'How does everyday work test a government’s claims?',
  ],
  ['taharqo', 'maya-vessel', 'How can an object express rank and religious authority?'],
  [
    'chavin-textile',
    'inca-weaving',
    'How do textiles join skilled work to social meaning?',
  ],
  [
    'byzantium',
    'tang-city',
    'How do capitals and institutions change within long political histories?',
  ],
  [
    'abbasid-craft',
    'song-art',
    'How do materials and institutions shape artistic production?',
  ],
  [
    'tang-city',
    'abbasid-craft',
    'How do capitals organize access, skill and resources while political authority changes?',
  ],
  [
    'abbasid-craft',
    'nalanda',
    'How do different institutions support skilled work and learning?',
  ],
  [
    'borobudur',
    'nalanda',
    'How can a built place organize religious life and learning?',
  ],
  [
    'mali-networks',
    'middle-niger',
    'What different forms of authority can an urban network support?',
  ],
  [
    'song-art',
    'inca-weaving',
    'How can we test a claim that an obligation benefited the people doing the work?',
  ],
  [
    'portuguese-voyage',
    'benin-ivory',
    'How did makers and intermediaries shape an encounter beyond a patron’s or captain’s instructions?',
  ],
  [
    'portuguese-voyage',
    'kongo-translation',
    'What distinguishes enabling communication from establishing free choice or protection?',
  ],
  [
    'mali-networks',
    'inca-weaving',
    'What can royal images and finished objects reveal about workers, and whose voices are missing?',
  ],
  ['angkor', 'dholavira', 'How does water shape a city’s work and organization?'],
  [
    'factory-reform',
    'hine-labor',
    'What is the difference between documenting work and changing its conditions?',
  ],
  ['tomioka', 'hine-labor', 'How do factory systems organize skill and labor?'],
  [
    'tiriti',
    'partition-1947',
    'What separates an official document from people’s experience of political change?',
  ],
  [
    'partition-1947',
    'south-africa-rights',
    'What does a new political settlement promise, and what must be investigated afterward?',
  ],
  [
    'world-war-one',
    'world-war-two',
    'How do institutions and choices turn conflict into mass violence?',
  ],
  ['sputnik', 'tomioka', 'How does technical change depend on organized work?'],
  [
    'poverty-point',
    'hopewell-earthworks',
    'What does coordinated earthmoving show, and what remains uncertain?',
  ],
  [
    'chaco-communities',
    'cahokia-city',
    'How can archaeology test explanations of gathering and change?',
  ],
  [
    'ottoman-workshops',
    'isfahan-silk',
    'How do patrons, markets and unequal power shape craft?',
  ],
  [
    'bukhara-books',
    'zand-iran',
    'How do changing patrons affect books and decorative arts?',
  ],
  [
    'bering-sea-carvers',
    'inuinnait-sewing',
    'How do tools and clothing carry skilled knowledge?',
  ],
  [
    'ozette-makah',
    'kwakwakawakw-potlatch',
    'How do surviving belongings relate to community knowledge and authority?',
  ],
  [
    'blackfoot-bison',
    'hidatsa-villages',
    'How do communities coordinate food, work and seasonal knowledge?',
  ],
  [
    'ocmulgee-council',
    'wendat-laine',
    'What can a public building and a village reveal about collective life?',
  ],
  [
    'haudenosaunee-canandaigua',
    'cherokee-print',
    'How do words and records carry political responsibilities?',
  ],
  [
    'ojibwe-manoomin',
    'inuinnait-sewing',
    'How do material work and knowledge connect across generations?',
  ],
  [
    'nimrud-palace',
    'taharqo',
    'How do royal images, work claims and excavated production answer different questions about authority?',
  ],
  [
    'kerma-potters',
    'taharqo',
    'What can different materials and find contexts tell us about skilled work and institutions?',
  ],
];
export const authoredComparisons: ComparisonDefinition[] = pairs.map(
  ([a, b, question]) => ({
    id: `${a}--${b}`,
    subjects: [a, b],
    question,
  }),
);
const featured: Record<string, string[]> = {
  C1: ['uruk-accounts', 'dholavira', 'liangzhu'],
  C2: ['hattusha-change', 'shang-ritual', 'poverty-point'],
  C3: ['qin-administration', 'ashoka-messages', 'athens-water'],
  C4: ['roman-world', 'eastern-han', 'colima'],
  C5: ['tang-city', 'nalanda', 'maya-vessel'],
  C6: ['angkor', 'mali-networks', 'cahokia-city'],
  C7: ['ottoman-workshops', 'mughal-books', 'kongo-translation'],
  C8: ['partition-1947', 'ghana-independence', 'indonesia-independence'],
};
export function applyEditorialNavigation(corpus: Corpus) {
  corpus.comparisons = authoredComparisons;
  for (const s of corpus.subjects) {
    s.dimensions = Object.fromEntries(
      Object.entries(s.dimensions).map(([key, value]) => [dimensionKey(key), value]),
    );
    s.dimensionKeys = Object.keys(s.dimensions);
  }
  for (const p of corpus.packs) p.featuredSubjects = featured[p.id];
  const concepts: Record<string, string[]> = {
    borobudur: ['Buddhism', 'Buddhist temple'],
    nalanda: ['Buddhism', 'education', 'monastery'],
    'abbasid-craft': ['Islamic history', 'Islam', 'Baghdad'],
    'kongo-translation': ['Christianity'],
    'haitian-revolution': ['slavery', 'abolition'],
    'banda-1621': ['colonialism', 'forced labor', 'slavery'],
    'qin-administration': ['government', 'standardization'],
  };
  for (const s of corpus.subjects)
    s.aliases = [...new Set([...s.aliases, ...(concepts[s.id] ?? [])])];
}
