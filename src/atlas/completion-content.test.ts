import { describe, expect, it } from 'vitest';
import { createBaseCorpus } from '../../scripts/redesign/content-base';
import { contentStages } from '../../scripts/redesign/content-pipeline';
import { applyCompletionBronze } from '../../scripts/redesign/content-completion-bronze';
import { applyCompletionKuk } from '../../scripts/redesign/content-completion-kuk';
import { regionalSnapshot } from './snapshot';
import { validateCorpus } from './validate';

const before = createBaseCorpus();
for (const stage of contentStages.filter(
  (s) => !s.id.startsWith('content-completion-') && !s.id.startsWith('orientations-'),
))
  stage.apply(before);
const after = structuredClone(before);
applyCompletionBronze(after);
applyCompletionKuk(after);

describe('bounded early chapter additions', () => {
  it('adds only the reviewed reference/source scope and two contextual links', () => {
    expect(after.sources.slice(0, before.sources.length)).toEqual(before.sources);
    expect(after.contexts!.slice(0, before.contexts!.length)).toEqual(before.contexts);
    expect(after.sources.length - before.sources.length).toBe(5);
    expect(after.contexts!.length - before.contexts!.length).toBe(2);
    for (const old of before.subjects) {
      const current = after.subjects.find((s) => s.id === old.id)!;
      if (['uluburun', 'lapita'].includes(old.id)) {
        expect({ ...current, contextIds: old.contextIds }).toEqual(old);
        expect(current.contextIds!.slice(0, old.contextIds!.length)).toEqual(
          old.contextIds,
        );
      } else expect(current).toEqual(old);
    }
    for (const key of [
      'media',
      'journeys',
      'relations',
      'comparisons',
      'glossary',
    ] as const)
      expect(after[key]).toEqual(before[key]);
  });
  it('provides the missing 1200 BCE European and 2400 BCE New Guinea references', () => {
    expect(
      regionalSnapshot(after, -1200, 'Europe')[0]!.frames.some(
        (f) => f.id === 'europe-bronze-settings',
      ),
    ).toBe(true);
    expect(
      regionalSnapshot(after, -2400, 'Southeast Asia/Oceania')[0]!.frames.some(
        (f) => f.id === 'kuk-wetland-context',
      ),
    ).toBe(true);
  });
  it('does not extend the Kuk reference into unsupported earlier chapter dates', () => {
    expect(
      regionalSnapshot(after, -3000, 'Southeast Asia/Oceania')[0]!.frames.some(
        (f) => f.id === 'kuk-wetland-context',
      ),
    ).toBe(false);
    expect(after.subjects.find((s) => s.id === 'lapita')!.interval).toEqual(
      before.subjects.find((s) => s.id === 'lapita')!.interval,
    );
  });
  it('keeps valid dates, sources and next-reading targets', () => {
    expect(validateCorpus(after)).toEqual([]);
  });
  it('does not mutate shared base imports across compilation runs', () => {
    const original = createBaseCorpus();
    const independent = createBaseCorpus();
    original.subjects[0]!.name = 'Mutation must remain isolated';
    expect(independent.subjects[0]!.name).not.toBe(original.subjects[0]!.name);
  });
});
