import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, Media, MediaSummary } from './model';
import { buildMediaBootstrap } from '../../scripts/redesign/bootstrap-media';
import {
  isCompleteMedia,
  mergeMediaDetails,
  parseMediaDetails,
  validAdditionalImageAlts,
} from './media-details';
import { validateCorpus } from './validate';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
function fixture() {
  const c = structuredClone(corpus);
  const m = c.media.find((row) => row.id === 'met-681122')!;
  m.additionalImageAlts = ['Outer bird-and-flower surface.', 'Empty fitted drawer.'];
  return { c, m };
}
function compiled() {
  const { c, m } = fixture();
  const result = buildMediaBootstrap(c);
  const envelope = result.records.find((row) => row.subject === 'zand-iran')!;
  return { c, m, result, envelope };
}
const web = (m: Media) => {
  const { printCaption: _caption, printCredit: _credit, ...value } = m;
  return JSON.parse(JSON.stringify(value));
};

describe('Optional alternate image descriptions across full and deferred media', () => {
  it('reconstructs exact authored descriptions without expanding the bootstrap', () => {
    const { m, result, envelope } = compiled();
    const summaries = result.media.filter((row) => row.id === m.id);
    expect(summaries[0]).not.toHaveProperty('additionalImageAlts');
    expect(summaries[0]!.alt).toBe(m.alt);
    const restored = mergeMediaDetails(
      parseMediaDetails(envelope, envelope.subject, result.revision),
      summaries,
    );
    expect(restored.map(web)).toEqual([web(m)]);
    expect(restored[0]!.additionalImageAlts).not.toBe(m.additionalImageAlts);
    expect(isCompleteMedia(restored[0]!)).toBe(true);
  });

  it.each([
    [],
    ['One description only.'],
    [' ', 'Other.'],
    [12, 'Other.'],
    null,
    'Description',
    { first: 'Description' },
  ])(
    'rejects a malformed or misaligned array %j in sidecars and full corpus',
    (bad) => {
      const { c, m, result, envelope } = compiled();
      const invalid = JSON.parse(JSON.stringify(envelope));
      invalid.media[0].additionalImageAlts = bad;
      expect(() =>
        parseMediaDetails(invalid, envelope.subject, result.revision),
      ).toThrow(/incomplete/);
      const badMedia = { ...m, additionalImageAlts: bad };
      expect(validAdditionalImageAlts(badMedia)).toBe(false);
      expect(isCompleteMedia(badMedia as unknown as MediaSummary)).toBe(false);
      Object.assign(
        c.media.find((row) => row.id === m.id)!,
        { additionalImageAlts: bad },
      );
      expect(validateCorpus(c)).toContainEqual(
        expect.stringContaining('alternate image descriptions must align'),
      );
      expect(() => buildMediaBootstrap(c)).toThrow(/incomplete/);
    },
  );

  it('rejects descriptions without a valid corresponding path array', () => {
    const { result, envelope } = compiled();
    for (const additionalImages of [undefined, null, ['one.webp'], ['', 'two.webp']]) {
      const invalid = JSON.parse(JSON.stringify(envelope));
      if (additionalImages === undefined) delete invalid.media[0].additionalImages;
      else invalid.media[0].additionalImages = additionalImages;
      expect(() =>
        parseMediaDetails(invalid, envelope.subject, result.revision),
      ).toThrow(/incomplete/);
    }
  });

  it('supports legacy omission and an aligned empty optional array', () => {
    const { m, result, envelope } = compiled();
    const legacy = JSON.parse(JSON.stringify(envelope));
    delete legacy.media[0].additionalImageAlts;
    const parsed = parseMediaDetails(legacy, envelope.subject, result.revision);
    expect(parsed[0]).not.toHaveProperty('additionalImageAlts');
    expect(
      validAdditionalImageAlts({ additionalImages: [], additionalImageAlts: [] }),
    ).toBe(true);
    const legacyMedia = { ...m };
    delete legacyMedia.additionalImageAlts;
    expect(isCompleteMedia(legacyMedia)).toBe(true);
  });

  it('changes the rich revision for descriptions, while preserving print-only semantics', () => {
    const { c, m } = fixture();
    const first = buildMediaBootstrap(c);
    m.additionalImageAlts![1] = 'A revised source-specific drawer description.';
    const changed = buildMediaBootstrap(c);
    expect(changed.revision).not.toBe(first.revision);
    const revision = changed.revision;
    m.printCaption = 'A print-only wording change.';
    expect(buildMediaBootstrap(c).revision).toBe(revision);
  });

  it('does not permit a delta to replace the retained primary description', () => {
    const { result, envelope } = compiled();
    const invalid = JSON.parse(JSON.stringify(envelope));
    invalid.media[0].alt = 'A replacement primary description.';
    expect(() => parseMediaDetails(invalid, envelope.subject, result.revision)).toThrow(
      /incomplete/,
    );
  });
});
