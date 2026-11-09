import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildPackBootstrap } from '../../scripts/redesign/bootstrap-packs';
import { createCanonicalCorpus } from '../../scripts/redesign/canonical-content';
import type { Corpus, RuntimeCorpus } from './model';

const full: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const index: RuntimeCorpus = JSON.parse(
  readFileSync('public/atlas/index.json', 'utf8'),
);

describe('chapter investigation bootstrap', () => {
  it('keeps every invitation journey in exact authored order without print prose', () => {
    const projected = buildPackBootstrap(full.packs);
    expect(index.packs).toEqual(projected);
    expect(projected.map((pack) => pack.id)).toEqual(full.packs.map((pack) => pack.id));
    for (const [position, pack] of projected.entries()) {
      const original = full.packs[position]!;
      expect(pack.investigations).toEqual(
        original.investigations?.map(({ journey }) => ({ journey })),
      );
      expect([
        pack.journey,
        ...(pack.investigations ?? []).map((entry) => entry.journey),
      ]).toEqual([
        original.journey,
        ...(original.investigations ?? []).map((entry) => entry.journey),
      ]);
      const { investigations: _runtime, ...runtimeFields } = pack;
      const { investigations: _full, ...fullFields } = original;
      expect(runtimeFields).toEqual(fullFields);
    }
  });

  it('preserves complete canonical investigation records for the full corpus and print', () => {
    const original = structuredClone(full.packs);
    buildPackBootstrap(full.packs);
    expect(full.packs).toEqual(original);
    expect(full.packs).toEqual(createCanonicalCorpus().packs);
    const authored = full.packs.flatMap((pack) => pack.investigations ?? []);
    expect(authored.length).toBeGreaterThan(0);
    expect(
      authored.every((entry) => entry.title && entry.comparison.length === 2),
    ).toBe(true);
    expect(
      authored.some((entry) => entry.orientation && entry.geography && entry.limits),
    ).toBe(true);
  });
});
