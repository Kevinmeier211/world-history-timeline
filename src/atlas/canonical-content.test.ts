import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createCanonicalCorpus } from '../../scripts/redesign/canonical-content';
import {
  assembleCanonicalCorpus,
  type ContentManifest,
} from '../../scripts/redesign/canonical-assembly';
import manifestData from '../../scripts/redesign/content-canonical/manifest.json';
import history from '../../docs/redesign/CONTENT-HISTORY-2026-11-05.json';
import { createBaseCorpus } from '../../scripts/redesign/content-base';
import { applyContentStages } from '../../scripts/redesign/content-pipeline';
import { validateCorpus } from './validate';

const released = readFileSync('public/atlas/corpus.json', 'utf8');
function inputs() {
  const manifest: ContentManifest = structuredClone(manifestData);
  const partitions: Record<
    string,
    Record<string, { id: string; [key: string]: unknown }[]>
  > = Object.fromEntries(
    [...new Set(Object.values(manifest.owners))].map((owner) => [
      owner,
      JSON.parse(
        readFileSync('scripts/redesign/content-canonical/' + owner + '.json', 'utf8'),
      ),
    ]),
  );
  return { manifest, partitions };
}

describe('canonical content ownership and assembly', () => {
  it('matches current delivery bytes and validates every citation and record contract', () => {
    const corpus = createCanonicalCorpus();
    expect(JSON.stringify(corpus)).toBe(released);
    expect(validateCorpus(corpus)).toEqual([]);
    expect(corpus.sources.map((source) => [source.id, source.scope])).toEqual(
      JSON.parse(released).sources.map((source: { id: string; scope: string }) => [
        source.id,
        source.scope,
      ]),
    );
  });

  it('retains the historical writer sequence as an independent frozen comparator', () => {
    const historical = createBaseCorpus();
    applyContentStages(historical);
    expect(createHash('sha256').update(JSON.stringify(historical)).digest('hex')).toBe(
      history.corpusSHA256,
    );
    // Intentional future canonical changes are checked against current delivery above.
    // The historical corpus remains an account of the migration, with its original hash.
  });

  it('returns fresh records and nested citations on every call', () => {
    const first = createCanonicalCorpus(),
      second = createCanonicalCorpus();
    first.subjects[0]!.name = 'Mutation probe';
    first.subjects[0]!.claims[0]!.citations[0]!.locator = 'Mutation probe';
    first.sources[0]!.scope = 'Mutation probe';
    expect(JSON.stringify(second)).toBe(released);
    expect(JSON.stringify(createCanonicalCorpus())).toBe(released);
  });

  it('preserves manifest order even when files and their local record arrays arrive differently', () => {
    const { manifest, partitions } = inputs();
    const reversed = Object.fromEntries(Object.entries(partitions).reverse());
    for (const partition of Object.values(reversed))
      for (const rows of Object.values(partition)) rows.reverse();
    expect(JSON.stringify(assembleCanonicalCorpus(reversed, manifest))).toBe(released);
  });

  it('rejects a duplicate, missing, unowned or misplaced record before assembly', () => {
    let { manifest, partitions } = inputs();
    const row = partitions.C1!.subjects![0]!;
    partitions.C1!.subjects!.push(structuredClone(row));
    expect(() => assembleCanonicalCorpus(partitions, manifest)).toThrow(
      /Duplicate canonical record/,
    );
    ({ manifest, partitions } = inputs());
    partitions.C1!.subjects!.shift();
    expect(() => assembleCanonicalCorpus(partitions, manifest)).toThrow(
      /Missing canonical record/,
    );
    ({ manifest, partitions } = inputs());
    partitions.C1!.subjects!.push({ ...row, id: 'unowned-probe' });
    expect(() => assembleCanonicalCorpus(partitions, manifest)).toThrow(
      /Unowned canonical record/,
    );
    ({ manifest, partitions } = inputs());
    partitions.C2!.subjects!.push(partitions.C1!.subjects!.shift()!);
    expect(() => assembleCanonicalCorpus(partitions, manifest)).toThrow(
      /Wrong canonical owner/,
    );
  });

  it('rejects incomplete or contradictory manifests and unexpected collections', () => {
    let { manifest, partitions } = inputs();
    const id = manifest.order.subjects![0]!;
    manifest.order.subjects!.push(id);
    expect(() => assembleCanonicalCorpus(partitions, manifest)).toThrow(
      /duplicate ordered record/,
    );
    ({ manifest, partitions } = inputs());
    delete manifest.owners['subjects/' + id];
    expect(() => assembleCanonicalCorpus(partitions, manifest)).toThrow(
      /Missing canonical owner/,
    );
    ({ manifest, partitions } = inputs());
    manifest.owners['subjects/unordered-probe'] = 'C1';
    expect(() => assembleCanonicalCorpus(partitions, manifest)).toThrow(
      /Owner without an ordered record/,
    );
    ({ manifest, partitions } = inputs());
    delete manifest.order.sources;
    expect(() => assembleCanonicalCorpus(partitions, manifest)).toThrow(
      /every corpus collection/,
    );
    ({ manifest, partitions } = inputs());
    partitions.C1!.unknown = [];
    expect(() => assembleCanonicalCorpus(partitions, manifest)).toThrow(
      /Invalid canonical collection/,
    );
  });
});
