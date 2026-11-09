import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, Media } from './model';
import { buildMediaBootstrap } from '../../scripts/redesign/bootstrap-media';
import { mediaDetailKeys, mergeMediaDetails, parseMediaDetails } from './media-details';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const webRecord = (media: Media) => {
  const { printCaption: _caption, printCredit: _credit, ...web } = media;
  return JSON.parse(JSON.stringify(web));
};

describe('compiled media delivery', () => {
  it('rejects authoring output that the reader would report as incomplete', () => {
    const incomplete = structuredClone(corpus);
    incomplete.media[0]!.notice = [];
    expect(() => buildMediaBootstrap(incomplete)).toThrow(/incomplete/);
  });
  it('preserves every retained field, including date qualifications and notebook accession', () => {
    const result = buildMediaBootstrap(corpus);
    expect(result.media.map((m) => m.id)).toEqual(corpus.media.map((m) => m.id));
    const omitted = new Set<string>([
      ...mediaDetailKeys,
      'printCaption',
      'printCredit',
    ]);
    corpus.media.forEach((original, index) => {
      const summary = result.media[index]!;
      for (const [field, value] of Object.entries(original)) {
        if (omitted.has(field)) expect(summary).not.toHaveProperty(field);
        else expect(summary).toHaveProperty(field, value);
      }
      expect(summary.date).toEqual(original.date);
      expect(summary.accession).toBe(original.accession);
      expect(summary.credit).toBe(original.credit);
      expect(summary.rights).toBe(original.rights);
    });
  });

  it('reconstructs all canonical web records in existing display order', () => {
    const result = buildMediaBootstrap(corpus);
    expect(result.records).toHaveLength(
      corpus.subjects.filter((subject) => subject.objectIds.length).length,
    );
    const covered = new Set<string>();
    for (const record of result.records) {
      const subject = corpus.subjects.find((s) => s.id === record.subject)!;
      const summaries = result.media.filter((m) => subject.objectIds.includes(m.id));
      const parsed = parseMediaDetails(
        JSON.parse(JSON.stringify(record)),
        record.subject,
        result.revision,
      );
      const resolved = mergeMediaDetails(parsed, summaries);
      expect(resolved.map(webRecord)).toEqual(
        corpus.media.filter((m) => subject.objectIds.includes(m.id)).map(webRecord),
      );
      resolved.forEach((m) => covered.add(m.id));
    }
    expect(covered).toEqual(new Set(corpus.media.map((m) => m.id)));
  });

  it('invalidates stale prose or changed subject membership deterministically', () => {
    const baseline = buildMediaBootstrap(corpus);
    expect(buildMediaBootstrap(structuredClone(corpus)).revision).toBe(
      baseline.revision,
    );
    const prose = structuredClone(corpus);
    prose.media[0]!.caption += ' A changed interpretation.';
    expect(buildMediaBootstrap(prose).revision).not.toBe(baseline.revision);
    const membership = structuredClone(corpus);
    const subject = membership.subjects.find((s) => !s.objectIds.length)!;
    subject.objectIds.push(membership.media[0]!.id);
    const changed = buildMediaBootstrap(membership);
    expect(changed.revision).not.toBe(baseline.revision);
    expect(changed.records.find((r) => r.subject === subject.id)?.media).toHaveLength(
      1,
    );
  });

  it('keeps print-only wording out of delivery revisions and source attribution current', () => {
    const baseline = buildMediaBootstrap(corpus);
    const changed = structuredClone(corpus);
    changed.media[0]!.printCaption = 'A print-only caption change.';
    changed.media[0]!.printCredit = 'A print-only credit change.';
    changed.media[0]!.credit = 'A renewed item-specific credit.';
    const result = buildMediaBootstrap(changed);
    expect(result.revision).toBe(baseline.revision);
    expect(result.media[0]!.credit).toBe(changed.media[0]!.credit);
    expect(corpus.media[0]!.credit).not.toBe(changed.media[0]!.credit);
  });
});
