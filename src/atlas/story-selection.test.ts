import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { RuntimeCorpus } from './model';
import { storyObject, storySelection } from './story-selection';
import {
  fullHistory,
  initialLocation,
  locationQuery,
  readLocation,
} from './navigation';

const corpus: RuntimeCorpus = JSON.parse(
  readFileSync('public/atlas/index.json', 'utf8'),
);
describe('visual exploration', () => {
  it('opens fresh visits on the living timeline and preserves explicit view links', () => {
    expect(readLocation('')).toMatchObject({ view: 'timeline', scale: 'era' });
    expect(readLocation('?view=stories').view).toBe('stories');
    expect(readLocation('?view=timeline').view).toBe('timeline');
    expect(readLocation('?view=world').view).toBe('world');
    expect(readLocation('?pack=C2&subject=uluburun').view).toBe('timeline');
    expect(fullHistory(initialLocation).view).toBe('timeline');
    const saved = {
      ...initialLocation,
      subject: 'colima',
      object: 'met-317600',
      scale: 'local' as const,
    };
    expect(readLocation(locationQuery(saved))).toEqual(saved);
  });
  it('offers historical media from every region without changing their own dates', () => {
    const selection = storySelection(corpus, null, 'all');
    expect(selection.entries).toHaveLength(77);
    expect(new Set(selection.featured.map(({ subject }) => subject.region)).size).toBe(
      7,
    );
    for (const { subject, object } of selection.featured) {
      expect(subject.objectIds).toContain(object!.id);
      expect(object!.depiction).not.toBe('explanatory diagram');
      expect(object!.date).toEqual(
        corpus.media.find((item) => item.id === object!.id)!.date,
      );
    }
  });
  it('keeps imageless and diagram-only cases in the chapter directory', () => {
    const selection = storySelection(corpus, 'C2', 'all');
    expect(selection.entries.map(({ subject }) => subject.id)).toContain('uluburun');
    expect(selection.featured.map(({ subject }) => subject.id)).not.toContain(
      'uluburun',
    );
    expect(selection.entries.map(({ subject }) => subject.id)).toEqual(
      corpus.subjects.filter((s) => s.packs.includes('C2')).map((s) => s.id),
    );
    for (const region of ['Africa', 'Europe', 'Americas']) {
      const regional = storySelection(corpus, 'C2', region);
      expect(regional.entries.every(({ subject }) => subject.region === region)).toBe(
        true,
      );
    }
  });
  it('prefers the photographed object while retaining explicit diagram navigation', () => {
    const lapita = corpus.subjects.find((s) => s.id === 'lapita')!;
    expect(lapita.objectIds[0]).toBe('lapita-stamp-guide');
    expect(storyObject(lapita, corpus.media)?.id).toBe('met-314215-cast');
    expect(
      storyObject(
        corpus.subjects.find((s) => s.id === 'uluburun')!,
        corpus.media,
      ),
    ).toBeUndefined();
  });
});
