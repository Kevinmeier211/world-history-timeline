import type { Corpus, Journey } from '../../src/atlas/model';
import { cite } from './content-helpers';
import { applyKermaInstitutions } from './institutions-kerma';
import { applyNimrudInstitutions } from './institutions-nimrud';
import { applyTaharqoInstitutions } from './institutions-taharqo';
import { applyInstitutionMedia } from './institutions-media';
import { applyInstitutionPlaces } from './institutions-places';
const letter = cite(
  'nimrud-captives-letter',
  'Online translation: commands to provide for captives and warning against neglect; editorial date (732)',
);
const royal = cite(
  'nimrud-standard-inscription',
  'Translation lines 15b–17a: conquest and settlement claims',
);
const journey: Journey = {
  id: 'makers-supplies-royal-claims',
  title: 'Makers, supplies and royal claims',
  question: 'Who made and supplied things for powerful places?',
  duration: '20–30 minutes',
  introduction:
    'Compare a carefully finished vessel, a palace environment and royal funerary objects. Each place depended on materials, skills and provision, but the evidence gives different views of work and authority. This thematic inquiry crosses separate centuries and institutions; it is not a journey, a single tradition of kingship or proof of contact between these particular cases.',
  stops: [
    {
      subject: 'kerma-potters',
      year: -1800,
      title: 'Making a surface required skill',
      object: 'kerma-making-guide',
      narrative:
        'Inspect the beaker and the original modern guide. Explain shaping, polishing and controlled firing, then distinguish the Kerma capital from this vessel’s recorded Abydos grave. A findspot alone does not identify its potter, owner’s origin or route.',
    },
    {
      subject: 'nimrud-palace',
      year: -870,
      title: 'A palace joined images, rooms and resources',
      object: 'institution-evidence-guide',
      narrative:
        'Use the separate relief, composite source plan and royal inscription to ask how a palace represented power. Then read the much later archive letter about provisions for captives. Its editorial date is around 732 BCE, not the 883–859 BCE relief interval; an instruction does not prove fulfilment.',
    },
    {
      subject: 'taharqo',
      year: -675,
      title: 'Royal claims and excavated making answer different questions',
      object: 'met-544883',
      narrative:
        'Read the granite shabti within the selected reign, then compare Kawa’s workforce claims and the separately dated Sanam workshop. A matching faience mould and uninscribed fragment support making; they do not identify where the granite figure was manufactured.',
    },
  ],
  conclusion:
    'Institutions could gather resources, organise skilled work and claim authority over people. Excavated objects and spaces, royal inscriptions and administrative orders reveal different parts of those practices. Explain a concrete task first, then ask whose account survives and what would establish its result.',
  evidence: {
    prompt:
      'How could you investigate whether an official provision order was carried out?',
    options: [
      {
        text: 'Count protective figures on an earlier palace wall as proof that every captive received food.',
        feedback:
          'Protective imagery explains a represented environment; it is not a record of provisions received.',
        supported: false,
      },
      {
        text: 'Date every palace letter to the reign shown by the oldest relief.',
        feedback:
          'A long-used building preserves records from different reigns. The later letter retains its own editorial date.',
        supported: false,
      },
      {
        text: 'Compare the dated order with independent delivery or recipient evidence, if available.',
        feedback:
          'The order establishes what was instructed. Further dated evidence could investigate fulfilment while retaining gaps and the voices represented by each record.',
        supported: true,
      },
      {
        text: 'Treat the number of storerooms as the quantity delivered to each person.',
        feedback:
          'A plan can explain space and access. It cannot by itself supply an individual delivery record.',
        supported: false,
      },
    ],
    citations: [letter, royal],
  },
  returnPrompt:
    'Choose one making task and one claim about its organisation. Name the supporting evidence, whose voice it preserves and a further source that could improve the explanation.',
  leadObject: 'institution-evidence-guide',
  printSourcesPerPage: 2,
  familyEvidence: {
    title: 'An order needs checking',
    text: 'A letter from Nimrud’s palace archive orders provisions for captives and warns against neglect. Its proposed date, around 732 BCE, is later than the selected 883–859 BCE relief. It preserves an official order, not a recipient’s report that food arrived. The modern guide distinguishes claim, order and outcome.',
    object: 'institution-evidence-guide',
    citations: [letter],
    notice: [
      'Find the three labels in the modern guide.',
      'Describe the difference between being told to provide something and showing that it was received.',
    ],
    claimPrompt:
      'What evidence would help you check whether people received the ordered supplies?',
    returnPrompt:
      'Return with another possible source. Explain which part of the question it could answer.',
    feedback:
      'A separate delivery record or recipient account could help investigate fulfilment. The instruction alone does not show that provisions reached people; unavailable evidence should remain a gap.',
  },
};
export function applyInstitutions(c: Corpus) {
  applyKermaInstitutions(c);
  applyNimrudInstitutions(c);
  applyTaharqoInstitutions(c);
  c.sources.push({
    id: 'faience-material',
    title: 'Egyptian Faience: Technology and Production',
    author: 'Carolyn Riccardelli',
    institution: 'Department of Objects Conservation, The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/essays/egyptian-faience-technology-and-production',
    type: 'scholarship',
    published: '2017-12',
    accessed: '2026-10-29',
    scope:
      'Selected Technical Description of Faience and Making Faience passages consulted for a silica/quartz-rich core, glaze and the distinction from ordinary clay pottery; general hand modelling and clay-mould shaping. Not the linked books, experiments, full chemical datasets or an analysis of the Sanam objects. No exact Sanam composition, firing temperature, color recipe or unique glazing method inferred; no essay photograph copied.',
  });
  applyInstitutionPlaces(c);
  applyInstitutionMedia(c);
  c.journeys.push(journey);
  c.glossary.push(
    {
      id: 'faience',
      name: 'Faience',
      definition:
        'A manufactured, usually quartz-rich material with a glazed surface. Ancient Egyptian and Kushite faience is distinct from a granite carving or ordinary clay pottery; a mould and production debris can help investigate its making.',
    },
    {
      id: 'shabti',
      name: 'Shabti',
      definition:
        'A funerary figure intended to substitute for work required of the deceased in the afterlife. Its name, material, inscription and find context need their own evidence; a royal example does not represent every household’s beliefs.',
    },
  );
  const taharqo = c.subjects.find((s) => s.id === 'taharqo')!;
  taharqo.terms = [...new Set([...taharqo.terms, 'faience', 'shabti'])];
  const p = c.packs.find((p) => p.id === 'C3')!;
  p.investigations = [
    ...(p.investigations ?? []),
    {
      title: journey.title,
      journey: journey.id,
      comparison: ['nimrud-palace', 'taharqo'],
      start: -2050,
      end: -600,
      question: journey.question,
      orientation: journey.introduction,
      geography:
        'A Nubian capital and the beaker’s Egyptian findspot, selected Assyrian royal centres and separate Nuri/Sanam settings. Thematic comparison across different times; no connecting route or reconstructed border.',
      limits:
        'Three bounded expansions preserve their case, reference, object and source dates. A composite small-source palace plan, mediated royal translations, the later archive letter and broad workshop chronology retain their limits. Wider labor histories and independent/human acceptance remain open.',
    },
  ];
  p.coverage.Africa.reason =
    'Taharqo now has temple, production and funerary-labor explanation with a distinct phased context, original figure, inspected workshop photographs and local source-qualified references. Kerma offers a separately dated comparative bridge, not an unbroken polity or a complete African framework.';
  p.coverage['West/Central Asia'].reason =
    'Nimrud now pairs royal imagery with a primary settlement claim, a later captive-provision letter and a licensed composite palace plan. These distinct sources deepen work and authority without completing Assyrian social or regional history.';
}
