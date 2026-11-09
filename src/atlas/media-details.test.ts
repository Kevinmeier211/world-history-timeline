import { describe, expect, it } from 'vitest';
import type { Media, MediaDetails, MediaSummary } from './model';
import {
  assertMediaRequest,
  isCompleteMedia,
  mergeMediaDetails,
  parseMediaDetails,
} from './media-details';

const summary = (id = 'image-a'): MediaSummary => ({
  id,
  title: `Image ${id}`,
  subject: 'alpha',
  source: 'catalogue',
  accession: `Record ${id}`,
  date: {
    start: -500,
    end: -400,
    label: '500–400 BCE',
    note: 'Catalogue range, not an exact year.',
    precision: 'range',
  },
  image: `/atlas/media/${id}.webp`,
  thumbnail: `/atlas/media/${id}-thumb.webp`,
  width: 600,
  height: 400,
  alt: 'A source object with visible marks.',
  rights: 'Item-specific rights.',
  credit: 'Museum and photographer.',
  licenseUrl: 'https://example.org/licence',
  sourceImage: 'https://example.org/original',
  depiction: 'object photograph',
});
const details = (id = 'image-a'): MediaDetails => ({
  id,
  caption: 'A carefully qualified source caption.',
  notice: ['Observe the marks.'],
  creator: 'Maker not recorded',
  place: 'Recorded place',
  material: 'Stone',
  relevance: 'Supports a bounded question.',
  representedDate: 'A separate represented period.',
  datingNote: 'Creation and representation are distinct.',
  additionalImages: ['/atlas/media/another-view.webp'],
  printWidthMm: 100,
});
const envelope = (media: unknown = [details()]) => ({
  subject: 'alpha',
  revision: 'revision-a',
  media,
});
const parse = (value: unknown) => parseMediaDetails(value, 'alpha', 'revision-a');

describe('validated rich-media deltas', () => {
  it('reconstructs complete media in summary order without changing retained data or inputs', () => {
    const summaries = [summary('image-a'), summary('image-b')];
    const payload = envelope([details('image-b'), details('image-a')]);
    const before = structuredClone({ summaries, payload });
    const result = mergeMediaDetails(parse(payload), summaries);
    expect(result).toEqual(summaries.map((s) => ({ ...s, ...details(s.id) })));
    expect(result.every(isCompleteMedia)).toBe(true);
    for (const [i, s] of summaries.entries())
      for (const [key, value] of Object.entries(s))
        expect(result[i]![key as keyof Media]).toEqual(value);
    expect({ summaries, payload }).toEqual(before);
    result[0]!.notice.push('A caller edit.');
    expect(parse(payload)[1]!.notice).toEqual(['Observe the marks.']);
  });

  it.each([
    null,
    [],
    {},
    { ...envelope(), subject: 'beta' },
    { ...envelope(), revision: 'old-revision' },
    { ...envelope(), media: null },
    { ...envelope(), media: {} },
    { ...envelope(), unexpected: true },
  ])('rejects an invalid or stale envelope %#', (payload) => {
    expect(() => parse(payload)).toThrow('incomplete');
  });

  it.each(['caption', 'creator', 'place', 'material', 'relevance', 'id'])(
    'requires nonblank %s',
    (field) => {
      for (const invalid of [undefined, null, 17, '', ' \n '])
        expect(() => parse(envelope([{ ...details(), [field]: invalid }]))).toThrow(
          'incomplete',
        );
    },
  );

  it.each([null, [], 'look', [null], [2], [''], [' \n '], new Array(1)])(
    'rejects empty or malformed notice array %#',
    (notice) => {
      expect(() => parse(envelope([{ ...details(), notice }]))).toThrow('incomplete');
    },
  );

  it('accepts absent optional fields and a legitimately empty additional-images array', () => {
    const minimal = {
      id: 'image-a',
      caption: 'Caption',
      notice: ['Observe a detail.'],
      creator: 'Unrecorded',
      place: 'Place',
      material: 'Stone',
      relevance: 'Question',
    };
    expect(mergeMediaDetails(parse(envelope([minimal])), [summary()])).toEqual([
      { ...summary(), ...minimal },
    ]);
    expect(
      parse(envelope([{ ...details(), additionalImages: [] }]))[0]!.additionalImages,
    ).toEqual([]);
  });

  it.each(['representedDate', 'datingNote'])(
    'validates optional %s when supplied',
    (field) => {
      for (const invalid of [null, 12, '', ' '])
        expect(() => parse(envelope([{ ...details(), [field]: invalid }]))).toThrow(
          'incomplete',
        );
    },
  );

  it.each([null, 'image.webp', [null], [3], [''], [' '], new Array(1)])(
    'rejects malformed additional-image array %#',
    (additionalImages) => {
      expect(() => parse(envelope([{ ...details(), additionalImages }]))).toThrow(
        'incomplete',
      );
    },
  );

  it.each([null, '100', 0, -1, NaN, Infinity])(
    'rejects invalid print width %s',
    (printWidthMm) => {
      expect(() => parse(envelope([{ ...details(), printWidthMm }]))).toThrow(
        'incomplete',
      );
    },
  );

  it.each([
    'date',
    'source',
    'rights',
    'credit',
    'licenseUrl',
    'image',
    'subject',
    'title',
    'accession',
    'printCaption',
    'printCredit',
    'unknown',
    '__proto__',
  ])(
    'rejects unrequested delta field %s rather than overwriting retained metadata',
    (key) => {
      const row = details();
      Object.defineProperty(row, key, { value: 'poisoned', enumerable: true });
      expect(() => parse(envelope([row]))).toThrow('incomplete');
    },
  );

  it('requires unique exact requested coverage, not only a set of returned IDs', () => {
    expect(() => parse(envelope([details(), details()]))).toThrow('incomplete');
    expect(() => parse(envelope(new Array(1)))).toThrow('incomplete');
    for (const rows of [[], [details('other')], [details(), details('other')]])
      expect(() => mergeMediaDetails(parse(envelope(rows)), [summary()])).toThrow(
        'incomplete',
      );
    expect(() => mergeMediaDetails([details(), details()], [summary()])).toThrow(
      'incomplete',
    );
    expect(() => mergeMediaDetails([details()], [summary(), summary()])).toThrow(
      'incomplete',
    );
  });

  it('projects a direct merge through the whitelist even for an unchecked caller value', () => {
    const unchecked = { ...details(), rights: 'wrong', date: { start: 2026 } };
    const result = mergeMediaDetails([unchecked], [summary()])[0]!;
    expect(result.rights).toBe(summary().rights);
    expect(result.date).toEqual(summary().date);
  });

  it('checks caller summaries and nonblank request identity before loading', () => {
    expect(() => assertMediaRequest('', 'r', [])).toThrow('incomplete');
    expect(() => assertMediaRequest('alpha', '', [])).toThrow('incomplete');
    expect(() => assertMediaRequest('alpha', 'r', [summary(), summary()])).toThrow(
      'incomplete',
    );
    expect(() =>
      assertMediaRequest('alpha', 'r', [{ ...summary(), credit: '' }]),
    ).toThrow('incomplete');
    expect(() =>
      assertMediaRequest('alpha', 'r', [
        { ...summary(), date: { ...summary().date, start: 0 } },
      ]),
    ).toThrow('incomplete');
  });

  it('proves full-media completeness instead of trusting a missing deferred flag', () => {
    const full: Media = {
      ...summary(),
      ...details(),
      printCaption: 'Print caption',
      printCredit: 'Print credit',
    };
    expect(isCompleteMedia(full)).toBe(true);
    expect(isCompleteMedia(summary())).toBe(false);
    for (const invalid of [
      { ...full, caption: '' },
      { ...full, notice: null },
      { ...full, material: ' ' },
      { ...full, printWidthMm: -1 },
      { ...full, date: { ...full.date, end: -600 } },
      { ...full, licenseUrl: '' },
      { ...full, printCredit: 1 },
    ])
      expect(isCompleteMedia(invalid as unknown as MediaSummary)).toBe(false);
  });
});
