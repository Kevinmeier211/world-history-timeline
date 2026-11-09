/** Isolated unit fixture; never product content. */
import type { Corpus, Journey } from './model';

export function pairedJourneyFixture(base: Corpus) {
  const corpus = structuredClone(base);
  const subjects = ['banda-1621', 'manila-network'] as const;
  corpus.comparisons ??= [];
  if (
    !corpus.comparisons.some((pair) =>
      subjects.every((id) => pair.subjects.includes(id)),
    )
  )
    corpus.comparisons.push({
      id: 'paired-journey-fixture-comparison',
      subjects: [...subjects],
      question: 'What can these separate source contexts establish about work?',
    });
  const citations = [
    { source: 'met-9198', locator: 'Catalogue date and object identification' },
    { source: 'banda-archive', locator: 'Colonial source context and policy' },
  ];
  const journey: Journey = {
    id: 'paired-journey-fixture',
    title: 'A complete paired investigation fixture',
    question: 'What can these distinct records establish?',
    duration: '10 minutes',
    introduction:
      'This fixture supplies two source contexts without inferring a connection.',
    stops: [
      {
        subject: subjects[0],
        year: 1621,
        title: 'A dated official source',
        narrative: 'Read the purpose and limits of a particular official record.',
      },
      {
        subject: subjects[1],
        object: 'met-9198',
        year: 1690,
        title: 'A separately dated object',
        narrative:
          'Keep the catalogue identification separate from an unestablished voyage.',
      },
    ],
    conclusion:
      'Different sources establish different things and need explicit associations.',
    returnPrompt: 'Return with one evidence question.',
    evidence: {
      prompt: 'Which conclusion follows from separately identified records?',
      options: [
        {
          text: 'Keep their source contexts separate.',
          supported: true,
          feedback:
            'A documented association is needed to connect particular movements.',
        },
        {
          text: 'Chronological overlap proves the same movement.',
          supported: false,
          feedback: 'Overlap does not identify a particular object in a movement.',
        },
      ],
      citations,
    },
    leadObject: 'met-9198',
    familyEvidence: {
      title: 'A supplied source capsule',
      object: 'met-9198',
      text: 'A catalogue identifies the Mexican jar. Separate colonial records describe official policies; their source contexts remain distinct.',
      citations,
      notice: ['Find a repeated border in the supplied image.'],
      claimPrompt:
        'Describe a visible arrangement and ask what another record would establish.',
      returnPrompt: 'Return with one further source question.',
      feedback:
        'A picture, catalogue and official record support different observations.',
    },
  };
  corpus.journeys.push(journey);
  const pack = corpus.packs.find((p) => p.id === 'C7')!;
  pack.investigations ??= [];
  pack.investigations.push({
    title: journey.title,
    journey: journey.id,
    comparison: [...subjects],
    start: 1621,
    end: 1690,
  });
  return { corpus, journey, subjects };
}
