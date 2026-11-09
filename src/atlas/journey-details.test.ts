import { describe, expect, it } from 'vitest';
import type { Journey, JourneyDetails, JourneySummary } from './model';
import {
  assertJourneyRequest,
  isCompleteJourney,
  mergeJourneyDetails,
  parseJourneyDetails,
} from './journey-details';

const revision = 'a'.repeat(64);
const otherRevision = 'b'.repeat(64);
const summary = (): JourneySummary => ({
  id: 'working-places',
  title: 'Working places',
  question: 'What can materials tell us?',
  duration: '15–20 minutes',
  introduction: 'Compare different sources without inferring contact.',
  returnPrompt: 'Which source could test your claim?',
  detailsRevision: revision,
  stops: [
    { subject: 'alpha', year: -200, title: 'Inspect a surface', object: 'object-a' },
    {
      subject: 'beta',
      year: 100,
      title: 'Read a repair',
      compare: 'alpha',
      relation: 'recorded-contact',
    },
  ],
  evidence: { citations: [{ source: 'catalogue-a', locator: 'Description' }] },
});
const details = (): JourneyDetails => ({
  id: 'working-places',
  stops: [
    { index: 0, narrative: 'Look at the visible surface.' },
    { index: 1, narrative: 'Distinguish making from later maintenance.' },
  ],
  conclusion: 'Keep each object and source context distinct.',
  evidence: {
    prompt: 'Which claim is supported?',
    options: [
      {
        text: 'The surface has marks.',
        feedback: 'The marks are visible.',
        supported: true,
      },
      {
        text: 'The marks identify the maker.',
        feedback: 'A name requires another source.',
        supported: false,
      },
    ],
  },
});
const envelope = () => {
  const { id, ...reading } = details();
  return { journey: id, revision: revision, ...reading };
};
const parse = (value: unknown) =>
  parseJourneyDetails(value, 'working-places', revision);

describe('validated journey reading deltas', () => {
  it('reconstructs reading in caller stop order while preserving immediate fields', () => {
    const retained = summary();
    const input = envelope();
    input.stops.reverse();
    const before = structuredClone({ retained, input });
    const result = mergeJourneyDetails(parse(input), retained);
    const { detailsRevision: _revision, ...expected } = retained;
    expect(result).toEqual({
      ...expected,
      stops: expected.stops.map((stop, index) => ({
        ...stop,
        narrative: details().stops[index]!.narrative,
      })),
      conclusion: details().conclusion,
      evidence: { ...details().evidence, citations: retained.evidence.citations },
    });
    expect(isCompleteJourney(result)).toBe(true);
    expect({ retained, input }).toEqual(before);
    result.evidence.citations[0]!.locator = 'Caller edit';
    result.evidence.options[0]!.feedback = 'Caller feedback edit';
    result.stops[0]!.title = 'Caller title edit';
    expect(retained).toEqual(before.retained);
    expect(parse(input).evidence.options[0]!.feedback).toBe('The marks are visible.');
  });

  it.each([
    null,
    [],
    {},
    { ...envelope(), journey: 'other' },
    { ...envelope(), revision: otherRevision },
    { ...envelope(), extra: true },
    { ...envelope(), title: 'Replace retained title' },
    { ...envelope(), stops: null },
    { ...envelope(), stops: [] },
    { ...envelope(), stops: new Array(2) },
    { ...envelope(), conclusion: '' },
    { ...envelope(), conclusion: ' ' },
  ])('rejects invalid, stale or partial envelopes %#', (input) => {
    expect(() => parse(input)).toThrow('incomplete');
  });

  it.each(
    [
      [{ index: 0, narrative: 'Only one returned stop.' }],
      [
        { index: 0, narrative: 'First.' },
        { index: 0, narrative: 'Duplicate.' },
      ],
      [
        { index: -1, narrative: 'Negative.' },
        { index: 1, narrative: 'Second.' },
      ],
      [
        { index: 0.5, narrative: 'Fractional.' },
        { index: 1, narrative: 'Second.' },
      ],
      [
        { index: NaN, narrative: 'NaN.' },
        { index: 1, narrative: 'Second.' },
      ],
      [
        { index: Infinity, narrative: 'Infinite.' },
        { index: 1, narrative: 'Second.' },
      ],
      [
        { index: 0, narrative: 'First.' },
        { index: 2, narrative: 'Outside.' },
      ],
      [
        { index: 0, narrative: ' ' },
        { index: 1, narrative: 'Second.' },
      ],
      [
        { index: 0, narrative: 'First.', year: 200 },
        { index: 1, narrative: 'Second.' },
      ],
    ].map((stops) => ({ stops })),
  )('rejects missing, duplicate or malformed stop coverage %#', ({ stops }) => {
    expect(() =>
      mergeJourneyDetails(parse({ ...envelope(), stops }), summary()),
    ).toThrow('incomplete');
  });

  it.each([
    undefined,
    null,
    {},
    { ...envelope().evidence, prompt: '' },
    { ...envelope().evidence, options: [] },
    { ...envelope().evidence, options: new Array(2) },
    { ...envelope().evidence, citations: [] },
    {
      ...envelope().evidence,
      options: [{ text: 'A', feedback: 'Why', supported: false }],
    },
    {
      ...envelope().evidence,
      options: [{ text: 'A', feedback: 'Why', supported: true }],
    },
    {
      ...envelope().evidence,
      options: envelope().evidence.options.map((option) => ({
        ...option,
        supported: true,
      })),
    },
    {
      ...envelope().evidence,
      options: envelope().evidence.options.map((option) => ({
        ...option,
        supported: false,
      })),
    },
    { ...envelope().evidence, options: [{ text: 'A', feedback: '', supported: true }] },
    {
      ...envelope().evidence,
      options: [{ text: 'A', feedback: 'Why', supported: 'true' }],
    },
    {
      ...envelope().evidence,
      options: [{ text: 'A', feedback: 'Why', supported: true, source: 'wrong' }],
    },
  ])('rejects incomplete quiz or citation injection %#', (evidence) => {
    expect(() => parse({ ...envelope(), evidence })).toThrow('incomplete');
  });

  it('requires exact identity even for direct merges and cannot inject retained fields', () => {
    expect(() => mergeJourneyDetails({ ...details(), id: 'other' }, summary())).toThrow(
      'incomplete',
    );
    expect(() =>
      mergeJourneyDetails(
        { ...details(), title: 'Wrong' } as JourneyDetails,
        summary(),
      ),
    ).toThrow('incomplete');
    expect(() => parseJourneyDetails(envelope(), '', revision)).toThrow('incomplete');
    expect(() => parseJourneyDetails(envelope(), 'working-places', '')).toThrow(
      'incomplete',
    );
  });

  it.each(['id', 'title', 'question', 'duration', 'introduction', 'returnPrompt'])(
    'requires immediate nonblank %s before requesting',
    (key) => {
      for (const invalid of [undefined, null, '', ' ', 12])
        expect(() =>
          assertJourneyRequest({ ...summary(), [key]: invalid }, revision),
        ).toThrow('incomplete');
    },
  );

  it('requires the advertised revision and valid retained navigation/citations', () => {
    expect(() => assertJourneyRequest(summary(), revision)).not.toThrow();
    for (const invalidRevision of [undefined, '', otherRevision])
      expect(() =>
        assertJourneyRequest(
          { ...summary(), detailsRevision: invalidRevision },
          revision,
        ),
      ).toThrow('incomplete');
    for (const year of [0, 1.5, NaN, Infinity]) {
      const value = summary();
      value.stops[0]!.year = year;
      expect(() => assertJourneyRequest(value, revision)).toThrow('incomplete');
    }
    for (const invalid of [
      [],
      new Array(1),
      [{ source: 'x', locator: '' }],
      [{ source: 'x', locator: 'p1', extra: true }],
    ]) {
      const value = {
        ...summary(),
        evidence: { citations: invalid },
      } as JourneySummary;
      expect(() => assertJourneyRequest(value, revision)).toThrow('incomplete');
    }
    expect(() =>
      assertJourneyRequest({ ...summary(), stops: new Array(2) }, revision),
    ).toThrow('incomplete');
  });

  it.each([
    '',
    'revision-a',
    'a'.repeat(63),
    'a'.repeat(65),
    'A'.repeat(64),
    'g'.repeat(64),
    ` ${revision}`,
    `${revision}\n`,
  ])(
    'requires an exact lowercase SHA-256 revision before request or parsing %#',
    (invalidRevision) => {
      const advertised = { ...summary(), detailsRevision: invalidRevision };
      expect(() => assertJourneyRequest(advertised, invalidRevision)).toThrow(
        'incomplete',
      );
      expect(() =>
        parseJourneyDetails(
          { ...envelope(), revision: invalidRevision },
          'working-places',
          invalidRevision,
        ),
      ).toThrow('incomplete');
    },
  );

  it('does not accept an unmarked summary, blank narrative or missing quiz as complete', () => {
    const full = mergeJourneyDetails(details(), summary());
    expect(isCompleteJourney(full)).toBe(true);
    expect(isCompleteJourney(summary())).toBe(false);
    const blank = structuredClone(full);
    blank.stops[0]!.narrative = '';
    expect(isCompleteJourney(blank)).toBe(false);
    const missing = { ...full, evidence: { citations: full.evidence.citations } };
    expect(isCompleteJourney(missing)).toBe(false);
    expect(isCompleteJourney({ ...full, conclusion: '' } as Journey)).toBe(false);
  });
});
