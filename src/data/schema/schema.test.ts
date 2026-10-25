import { describe, expect, it } from 'vitest';

import {
  bandSchema,
  calloutSchema,
  mediaSchema,
  politySchema,
  relationSchema,
  sourceSchema,
  tourSchema,
  wordCount,
} from './index.ts';

const HASH = 'a'.repeat(64);

function polity(overrides: Record<string, unknown> = {}) {
  return {
    id: 'old_kingdom',
    name: 'Old Kingdom',
    family: 'nile_egyptian',
    start: -2686,
    end: -2181,
    confidence: 'conventional',
    importance: 5,
    weight: 0.8,
    kind: 'period',
    anchor: [{ year: -2686, geo: [31.1, 29.9] }],
    summary:
      'Early Egyptian state centered on the Memphite court and pyramid building.',
    keyFacts: ['Pyramid age'],
    sourceIds: ['met_egypt'],
    verification: 'unverified',
    ...overrides,
  };
}

describe('polity schema', () => {
  it('accepts a minimal valid polity', () => {
    expect(politySchema.safeParse(polity()).success).toBe(true);
  });

  it('rejects a reversed span, year 0, a missing source, and a long summary', () => {
    expect(politySchema.safeParse(polity({ start: -2181, end: -2686 })).success).toBe(
      false,
    );
    expect(politySchema.safeParse(polity({ start: 0, end: 10 })).success).toBe(false);
    expect(politySchema.safeParse(polity({ sourceIds: [] })).success).toBe(false);
    expect(politySchema.safeParse(polity({ importance: 6 })).success).toBe(false);
    const long = Array.from({ length: 61 }, () => 'word').join(' ');
    expect(wordCount(long)).toBe(61);
    expect(politySchema.safeParse(polity({ summary: long })).success).toBe(false);
  });

  it('rejects an anchor with no geography', () => {
    expect(politySchema.safeParse(polity({ anchor: [{ year: -2686 }] })).success).toBe(
      false,
    );
  });
});

describe('relation, callout, and band schemas', () => {
  it('checks relation shares and callout length', () => {
    expect(
      relationSchema.safeParse({
        id: 'rome_split',
        from: ['roman_empire'],
        to: ['western_rome', 'eastern_rome'],
        year: 395,
        type: 'split',
        share: [0.4, 0.6],
        sourceIds: ['cambridge_rome'],
        confidence: 'conventional',
        verification: 'unverified',
      }).success,
    ).toBe(true);
    expect(
      relationSchema.safeParse({
        id: 'bad_share',
        from: ['roman_empire'],
        to: ['western_rome'],
        year: 395,
        type: 'split',
        share: [0.7, 0.7],
        sourceIds: ['cambridge_rome'],
        confidence: 'conventional',
        verification: 'unverified',
      }).success,
    ).toBe(false);
    const blurb =
      'This blurb is intentionally too long for a chart callout and must fail the fourteen word cap.';
    expect(wordCount(blurb)).toBeGreaterThan(14);
    expect(
      calloutSchema.safeParse({
        id: 'pyramids',
        title: 'Giza pyramids',
        year: -2560,
        kind: 'monument',
        importance: 5,
        blurb,
        sourceIds: ['met_egypt'],
        confidence: 'approximate',
        verification: 'unverified',
      }).success,
    ).toBe(false);
  });

  it('rejects a band that ends before it starts', () => {
    expect(
      bandSchema.safeParse({
        id: 'bronze',
        title: 'Bronze Age',
        start: -1200,
        end: -3300,
        scope: 'global',
        type: 'era',
        importance: 5,
        description: 'A long era of bronze metallurgy across several regions.',
        sourceIds: ['unesco'],
        verification: 'unverified',
      }).success,
    ).toBe(false);
  });
});

describe('source, media, and tour schemas', () => {
  it('allows an empty unresolved URL and rejects a malformed one', () => {
    const base = {
      id: 'met_egypt',
      title: 'Egypt in the Old Kingdom',
      publisher: 'The Metropolitan Museum of Art',
      accessedISO: '2026-10-25',
      kind: 'museum',
    };
    expect(sourceSchema.safeParse({ ...base, url: '' }).success).toBe(true);
    expect(sourceSchema.safeParse({ ...base, url: 'not-a-url' }).success).toBe(false);
  });

  it('requires approval for share-alike licenses and a real content hash', () => {
    const item = {
      id: 'giza_plate',
      src: 'media/giza.webp',
      credit: {
        creator: 'Unknown',
        title: 'Pyramid',
        date: 'Old Kingdom',
        institution: 'Museum',
      },
      license: 'CC-BY-SA',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      licenseApproved: false,
      retrieved: '2026-10-25',
      sha256: HASH,
      crop: { ratio: '3:2', focal: [0.5, 0.4] },
      alt: 'Stone pyramid against a clear sky.',
      caption: 'Pyramid, Old Kingdom, Egypt.',
      depiction: 'photo',
    };
    expect(mediaSchema.safeParse(item).success).toBe(false);
    expect(mediaSchema.safeParse({ ...item, licenseApproved: true }).success).toBe(
      true,
    );
    expect(
      mediaSchema.safeParse({ ...item, license: 'PD', sha256: 'nope' }).success,
    ).toBe(false);
  });

  it('rejects a tour narrative over 70 words', () => {
    const narrative = Array.from({ length: 71 }, () => 'word').join(' ');
    expect(
      tourSchema.safeParse({
        id: 'axial',
        title: 'Axial Age',
        waypoints: [
          {
            title: 'Start',
            year: -500,
            narrative,
            sourceIds: ['unesco'],
          },
        ],
      }).success,
    ).toBe(false);
  });
});
