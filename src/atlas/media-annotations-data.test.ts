import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type {
  Corpus,
  Media,
  MediaAnnotations,
  MediaDetails,
  MediaSummary,
} from './model';
import {
  isCompleteMedia,
  mediaDetailKeys,
  mergeMediaDetails,
  parseMediaDetails,
} from './media-details';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const original = corpus.media.find((media) => media.id === 'nimrud-palace-plan')!;
const revision = 'annotation-fixture-revision';
const printOnly = new Set(['printCaption', 'printCredit']);
const detailKeys = new Set<string>(mediaDetailKeys);

function annotationSet(): MediaAnnotations {
  return {
    createdOn: '2026-10-29',
    credit:
      'Test fixture: modern editorial annotations, separate from the source image.',
    rights: 'Test annotation layer: CC BY 4.0.',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    items: [
      {
        id: 'first-test-detail',
        label: '1',
        x: 0.25,
        y: 0.5,
        text: 'First fixture observation; these coordinates are not an authored historical locator.',
        citations: [{ source: original.source, locator: 'Project plan caption' }],
      },
      {
        id: 'second-test-detail',
        label: '2',
        x: 0.75,
        y: 0.4,
        text: 'Second fixture observation, retained separately from the image attribution.',
        citations: [{ source: original.source, locator: 'Project image credit' }],
      },
    ],
  };
}
function fullMedia(): Media {
  return {
    ...structuredClone(original),
    hasAnnotations: true,
    annotations: annotationSet(),
  };
}
function summary(full = fullMedia()): MediaSummary {
  return Object.fromEntries(
    Object.entries(full).filter(([key]) => !detailKeys.has(key) && !printOnly.has(key)),
  ) as unknown as MediaSummary;
}
function details(full = fullMedia()): MediaDetails {
  return {
    id: full.id,
    ...Object.fromEntries(Object.entries(full).filter(([key]) => detailKeys.has(key))),
  } as MediaDetails;
}
function envelope(row: unknown = details()) {
  return { subject: original.subject, revision, media: [row] };
}
function parse(row: unknown) {
  return parseMediaDetails(envelope(row), original.subject, revision);
}
function withSet(value: unknown) {
  return { ...details(), annotations: value };
}

describe('annotated media delivery contract', () => {
  it('round-trips complete nested notes from a real image and actual source through JSON', () => {
    expect(original).toBeDefined();
    expect(corpus.sources.some((source) => source.id === original.source)).toBe(true);
    const full = fullMedia();
    const brief = summary(full);
    const row = details(full);
    expect(brief).toHaveProperty('hasAnnotations', true);
    expect(brief).not.toHaveProperty('annotations');
    expect(row).toHaveProperty('annotations', full.annotations);
    expect(row).not.toHaveProperty('hasAnnotations');
    const payload = JSON.parse(JSON.stringify(envelope(row)));
    const before = structuredClone({ full, brief, payload });
    const result = mergeMediaDetails(
      parseMediaDetails(payload, original.subject, revision),
      [brief],
    )[0]!;
    expect(result).toEqual(
      Object.fromEntries(Object.entries(full).filter(([key]) => !printOnly.has(key))),
    );
    expect(result.annotations).toEqual(annotationSet());
    expect(isCompleteMedia(result)).toBe(true);
    expect({ full, brief, payload }).toEqual(before);
    result.annotations!.items[0]!.citations[0]!.locator = 'Caller-only edit';
    expect(payload.media[0].annotations.items[0].citations[0].locator).toBe(
      'Project plan caption',
    );
  });

  it('preserves image identity, full date, attribution and licence independently of layer rights', () => {
    const full = fullMedia();
    const result = mergeMediaDetails(parse(details(full)), [summary(full)])[0]!;
    for (const key of [
      'id',
      'subject',
      'source',
      'accession',
      'date',
      'image',
      'thumbnail',
      'width',
      'height',
      'alt',
      'credit',
      'rights',
      'licenseUrl',
      'sourceImage',
    ] as const)
      expect(result[key]).toEqual(original[key]);
    expect(result.annotations!.licenseUrl).not.toBe(result.licenseUrl);
    expect(result.annotations!.credit).not.toBe(result.credit);
    expect(result.annotations!.createdOn).toBe('2026-10-29');
    expect(result.date).toEqual(original.date);
  });

  it('rejects a missing promised set and an unexpected unpromised set', () => {
    const { annotations: _annotations, ...unannotatedDetails } = details();
    expect(() => mergeMediaDetails(parse(unannotatedDetails), [summary()])).toThrow(
      'incomplete',
    );
    const { hasAnnotations: _flag, ...unpromised } = summary();
    expect(() => mergeMediaDetails(parse(details()), [unpromised])).toThrow(
      'incomplete',
    );
    const missing = { ...fullMedia(), annotations: undefined };
    expect(isCompleteMedia(missing)).toBe(false);
    expect(isCompleteMedia({ ...fullMedia(), hasAnnotations: undefined })).toBe(false);
  });

  it('continues to accept genuinely unannotated media without inventing a flag or layer', () => {
    const full = structuredClone(original);
    const result = mergeMediaDetails(parse(details(full)), [summary(full)])[0]!;
    expect(result).not.toHaveProperty('annotations');
    expect(result).not.toHaveProperty('hasAnnotations');
    expect(isCompleteMedia(result)).toBe(true);
  });

  it.each(['id', 'label'] as const)('rejects duplicate annotation %s values', (key) => {
    const notes = annotationSet();
    notes.items[1]![key] = notes.items[0]![key];
    expect(() => parse(withSet(notes))).toThrow('incomplete');
  });

  it.each(['x', 'y'] as const)('requires finite normalized %s coordinates', (key) => {
    for (const invalid of [
      -0.001,
      1.001,
      NaN,
      Infinity,
      -Infinity,
      undefined,
      null,
      '0.5',
    ]) {
      const notes = annotationSet();
      const item = { ...notes.items[0], [key]: invalid };
      expect(() => parse(withSet({ ...notes, items: [item] }))).toThrow('incomplete');
    }
    for (const boundary of [0, 1]) {
      const notes = annotationSet();
      notes.items[0]![key] = boundary;
      expect(parse(withSet(notes))[0]!.annotations!.items[0]![key]).toBe(boundary);
    }
  });

  it.each(['credit', 'rights', 'licenseUrl', 'createdOn'] as const)(
    'requires annotation %s rather than borrowing image metadata',
    (key) => {
      for (const invalid of [undefined, null, '', ' \n ', 2026])
        expect(() => parse(withSet({ ...annotationSet(), [key]: invalid }))).toThrow(
          'incomplete',
        );
    },
  );

  it.each(['2026-13-01', '2026-02-30', '29 October 2026', '2026-10-29T00:00:00Z'])(
    'rejects invalid or non-calendar creation date %s',
    (createdOn) => {
      expect(() => parse(withSet({ ...annotationSet(), createdOn }))).toThrow(
        'incomplete',
      );
    },
  );

  it.each(['javascript:alert(1)', '//example.test/licence', '/licence', 'licence'])(
    'rejects a non-HTTP annotation licence %s',
    (licenseUrl) => {
      expect(() => parse(withSet({ ...annotationSet(), licenseUrl }))).toThrow(
        'incomplete',
      );
    },
  );

  it('requires nonempty items, labelled explanatory text and source citations', () => {
    const notes = annotationSet();
    const item = notes.items[0]!;
    for (const items of [undefined, null, [], {}, new Array(1)])
      expect(() => parse(withSet({ ...notes, items }))).toThrow('incomplete');
    for (const key of ['id', 'label', 'text'])
      expect(() =>
        parse(withSet({ ...notes, items: [{ ...item, [key]: '' }] })),
      ).toThrow('incomplete');
    for (const citations of [
      undefined,
      null,
      [],
      {},
      [null],
      new Array(1),
      [{ source: original.source }],
      [{ source: '', locator: 'Caption' }],
      [{ source: original.source, locator: ' ' }],
    ])
      expect(() =>
        parse(withSet({ ...notes, items: [{ ...item, citations }] })),
      ).toThrow('incomplete');
  });

  it.each([
    'hasAnnotations',
    'source',
    'date',
    'image',
    'credit',
    'rights',
    'licenseUrl',
    'unknown',
  ])('rejects retained or unknown delta field %s', (key) => {
    expect(() => parse({ ...details(), [key]: 'Injected' })).toThrow('incomplete');
  });

  it('rejects unknown nested fields instead of admitting extra retained metadata', () => {
    const notes = annotationSet();
    const item = notes.items[0]!;
    for (const annotations of [
      { ...notes, sourceImage: 'https://example.test/replacement' },
      { ...notes, items: [{ ...item, image: 'replacement.webp' }] },
      {
        ...notes,
        items: [{ ...item, citations: [{ ...item.citations[0], subject: 'other' }] }],
      },
    ])
      expect(() => parse(withSet(annotations))).toThrow('incomplete');
  });
});
