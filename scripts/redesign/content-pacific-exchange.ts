/** Selected work and exchange accounts, adopted after the sealed cities candidate. */
import type { ComparisonDefinition, Corpus, Journey } from '../../src/atlas/model';
import { cite } from './content-helpers';
import { applyExchangeManila, manilaLaborDimension } from './exchange-manila';
import { applyExchangeBanda, bandaLaborDimension } from './exchange-banda';

/** Existing canonical key; this batch adds no runtime label or glossary term. */
export const pacificExchangeDimension = 'work-organization';

export const pacificExchangeComparison: ComparisonDefinition = {
  id: 'banda-1621--manila-network',
  subjects: ['banda-1621', 'manila-network'],
  question:
    'Whose work is visible in these commercial and colonial records, and whose experience needs other evidence?',
};

export const pacificExchangeJourney: Journey = {
  id: 'goods-work-coercion',
  title: 'Goods, work and coercion',
  question: 'What can particular records tell us about work behind exchange?',
  duration: '15–20 minutes',
  introduction:
    'Compare records of Banda’s 1621 conquest with a separate Pacific registration from 1726. Cultivation, provisioning, shipbuilding and transport involved people working within different relationships. The pictured Mexican jar has its own ca. 1680–1700 catalogue date. These stops support a comparison, not a shared route, a causal sequence or evidence of contact between the cases.',
  stops: [
    {
      subject: 'banda-1621',
      year: 1621,
      title: 'Read what controlling trade meant for land, food and work',
      narrative:
        'Banda’s spice commerce depended on cultivation, processing and food supplied through trade. The colonial council’s removal decision and Coen’s report expose policies used to impose company control. Later sources trace enslaved cultivation and continuing diaspora communities. A public statement from 2021 and Farid’s separately attributed essay add living purposes for remembrance; they are not 1621 eyewitness accounts or one universal community position. The three modern island-reference points orient names without reconstructing a campaign, plantation or path of flight.',
    },
    {
      subject: 'manila-network',
      object: 'met-9198',
      year: 1726,
      title: 'Keep a registered consignment separate from this jar',
      narrative:
        'This stop’s 1726 date belongs to the Santo Cristo’s Cavite register for a voyage toward Acapulco. The study follows Julián Ignacio’s entry, including lacquered furnishings and ceramics described as Japanese. Registration does not establish every object’s manufacture, arrival or sale. The pictured object is a Mexican tin-glazed earthenware jar dated ca. 1680–1700; it is not identified in that entry or as cargo from the different 1595 wreck. Earlier 1618/1619 reports explain skilled shipbuilding and community burdens, without supplying the working lives behind every shipment.',
    },
  ],
  conclusion:
    'Identify a particular task or policy and the record supporting your explanation. Then ask what further evidence would establish a worker’s experience or a completed movement. A register, an official intention, a material object and a living public claim supply different information; comparison does not join them into one voyage or outcome.',
  evidence: {
    prompt: 'Which conclusion is supported by these particular sources?',
    options: [
      {
        text: 'The records have distinct dates and purposes; none identifies this Mexican jar with the 1726 consignment or connects the two cases by one route.',
        supported: true,
        feedback:
          'The catalogue identifies the jar, the register documents a particular consignment and Banda’s records expose colonial purposes. A documented association is needed before assigning an object or person to a particular movement.',
      },
      {
        text: 'Because the jar’s date falls within the longer Pacific-trade period, the selected register establishes its voyage.',
        supported: false,
        feedback:
          'Chronological overlap does not identify an accession in a register. This jar’s catalogue and the selected entry do not supply that association.',
      },
      {
        text: 'The 1621 company records supply the experience of every Bandanese household and show that Bandanese history ended with the campaign.',
        supported: false,
        feedback:
          'The official perspective leaves other voices harder to recover. Later records and attributed living claims establish continuing histories without becoming a complete account of every household.',
      },
    ],
    citations: [
      cite('met-9198', 'Date, Geography and Medium; accession 11.87.36'),
      cite('point-reyes', 'San Agustín wreck, 1595; separate later object'),
      cite('manila-santo-cristo-2022', 'Selected PDF 4 note 5; PDF 14: Julián Ignacio'),
      cite('banda-archive', 'Koloniaal bronmateriaal; Genocide; Na de genocide'),
      cite('banda-wandan-statement-2021', 'PDF 1–2: identity, audience and date'),
    ],
  },
  returnPrompt:
    'Name one task, its source and a person’s experience or movement that still needs evidence.',
  leadObject: 'met-9198',
  printSourcesPerPage: 2,
  familyEvidence: {
    title: 'A jar and a shipping record',
    object: 'met-9198',
    text: 'The Met identifies this Mexican jar as tin-glazed earthenware, ca. 1680–1700. A study of the Santo Cristo’s 1726 register lists Julián Ignacio’s lacquered furnishings, ceramics described as Japanese, clothing and books. It does not identify this jar in that entry or establish successful delivery. These are editorial paraphrases.',
    citations: [
      cite('met-9198', 'Date, Geography and Medium; supplied photograph'),
      cite('manila-santo-cristo-2022', 'PDF 4 note 5; PDF 14: registered goods'),
    ],
    notice: ['Find a floral form and a repeated blue border, then read the two dates.'],
    claimPrompt:
      'Describe one pattern. What further record would identify this jar with a particular shipment?',
    returnPrompt: 'Return with one question about an unknown maker or movement.',
    feedback:
      'Looking supports a description of decoration. The catalogue identifies the jar; the register describes other goods. A voyage needs a documented association.',
  },
};

export function applyPacificExchange(c: Corpus): void {
  applyExchangeManila(c);
  applyExchangeBanda(c);
  // Reviewed against the existing photo and catalogue; all other fields stay exact.
  const jar = c.media.find((row) => row.id === 'met-9198');
  if (!jar) throw new Error('Pacific inquiry requires the existing Mexican jar');
  jar.caption =
    'Mexican tin-glazed earthenware, ca. 1680–1700. This accession is not identified as cargo from the 1595 San Agustín wreck or the 1726 Santo Cristo register.';
  jar.notice = [
    'Find a floral form inside a panel and a repeated blue border.',
    'What record would identify this jar with a particular shipment?',
  ];
  jar.relevance =
    'Mexican ceramic making compared with separately documented Pacific exchange. Its catalogue does not establish a particular voyage.';
  for (const [id, dimension] of [
    ['manila-network', manilaLaborDimension],
    ['banda-1621', bandaLaborDimension],
  ] as const) {
    const subject = c.subjects.find((row) => row.id === id)!;
    const previous = { ...subject.dimensions };
    delete previous[pacificExchangeDimension];
    subject.dimensions = { [pacificExchangeDimension]: dimension, ...previous };
    subject.dimensionKeys = Object.keys(subject.dimensions);
  }
  c.comparisons ??= [];
  const existingPair = c.comparisons.some(
    (pair) =>
      pair.subjects.includes('banda-1621') && pair.subjects.includes('manila-network'),
  );
  if (!existingPair) c.comparisons.push(pacificExchangeComparison);
  if (!c.journeys.some((row) => row.id === pacificExchangeJourney.id))
    c.journeys.push(pacificExchangeJourney);
  const pack = c.packs.find((row) => row.id === 'C7')!;
  pack.investigations ??= [];
  if (!pack.investigations.some((row) => row.journey === pacificExchangeJourney.id))
    pack.investigations.push({
      title: pacificExchangeJourney.title,
      journey: pacificExchangeJourney.id,
      comparison: ['banda-1621', 'manila-network'],
      start: 1621,
      end: 1726,
      question: pacificExchangeJourney.question,
      orientation: pacificExchangeJourney.introduction,
      geography:
        'Banda’s three modern island references and the existing Pacific case locator have different source roles. This comparison draws no sailing track, campaign line, plantation extent, political boundary or connection between the cases.',
      limits:
        'The selected stop dates do not replace the complete Manila case 1565–1815 or the exact Banda 1621 case. The jar’s ca. 1680–1700 date, selected 1595/1618/1619/1726 records, separate Banda reference 1599–1630 and public 2021 statement retain their own contexts. A registration is not an arrival receipt, and a colonial intention is not every household’s experience. Original case identities, claims, old comparison meanings and image bytes remain intact.',
    });
}
