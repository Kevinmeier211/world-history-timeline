import { describe, expect, it } from 'vitest';

import { bundledDataset } from './catalog.ts';
import type { Dataset } from './schema/index.ts';
import { adjacentLaneColorWarnings, validateDataset } from './validate.ts';

function base(): Dataset {
  const data = bundledDataset();
  data.sources.push({
    id: 'met_essay',
    title: 'Test essay',
    publisher: 'The Metropolitan Museum of Art',
    url: 'https://www.metmuseum.org/essays',
    accessedISO: '2026-10-25',
    kind: 'museum',
  });
  data.polities.push({
    id: 'akkad',
    name: 'Akkadian Empire',
    family: 'mesopotamian',
    start: -2334,
    end: -2154,
    confidence: 'approximate',
    importance: 4,
    weight: 0.6,
    kind: 'empire',
    anchor: [{ year: -2334, geo: [44.1, 33.1] }],
    summary:
      'A Mesopotamian empire whose dates stay approximate until two sources are checked.',
    keyFacts: [],
    sourceIds: ['met_essay'],
    verification: 'unverified',
  });
  return data;
}

describe('validateDataset', () => {
  it('accepts a small sourced roster and warns on ancient single-source orphans', () => {
    const result = validateDataset(base());
    expect(result.issues.filter((issue) => issue.level === 'error')).toEqual([]);
    expect(
      result.issues.some((issue) => issue.message.includes('fewer than two sources')),
    ).toBe(true);
    expect(
      result.issues.some((issue) => issue.message.includes('no inbound relation')),
    ).toBe(true);
    expect(result.coverage?.byFamily.mesopotamian).toBe(1);
  });

  it('fails duplicate ids, missing endpoints, and a relation year outside a life', () => {
    const data = base();
    data.relations.push({
      id: 'ghost',
      from: ['akkad'],
      to: ['missing_state'],
      year: 1900,
      type: 'conquest',
      sourceIds: ['no_such_source'],
      confidence: 'debated',
      verification: 'unverified',
    });
    data.polities.push({ ...data.polities[0]!, id: 'akkad' });
    const messages = validateDataset(data)
      .issues.filter((issue) => issue.level === 'error')
      .map((issue) => issue.message);
    expect(
      messages.some((message) => message.includes('duplicate polity id akkad')),
    ).toBe(true);
    expect(messages.some((message) => message.includes('missing_state'))).toBe(true);
    expect(messages.some((message) => message.includes('outside akkad'))).toBe(true);
    expect(messages.some((message) => message.includes('no_such_source'))).toBe(true);
  });

  it('rejects a dataset that fails the schema', () => {
    const result = validateDataset({ families: [] });
    expect(result.dataset).toBeNull();
    expect(result.issues.some((issue) => issue.level === 'error')).toBe(true);
    const reversed = base();
    reversed.polities[0] = { ...reversed.polities[0]!, start: -2154, end: -2334 };
    expect(validateDataset(reversed).dataset).toBeNull();
  });

  it('warns on an empty source url, a Wikipedia-only major entry, and a missing plate', () => {
    const data = base();
    data.sources[0] = { ...data.sources[0]!, url: '' };
    data.sources.push({
      id: 'wikipedia_akkad',
      title: 'Akkadian Empire',
      publisher: 'Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Akkadian_Empire',
      accessedISO: '2026-10-25',
      kind: 'encyclopedia',
    });
    data.polities[0] = {
      ...data.polities[0]!,
      importance: 4,
      sourceIds: ['wikipedia_akkad'],
      mediaId: 'missing_plate',
    };
    const messages = validateDataset(data).issues.map((issue) => issue.message);
    expect(messages.some((message) => message.includes('empty url'))).toBe(true);
    expect(messages.some((message) => message.includes('only Wikipedia'))).toBe(true);
    expect(messages.some((message) => message.includes('media missing_plate'))).toBe(
      true,
    );
  });

  it('counts the home macro-region and flags adjacent color repetition over 25%', () => {
    const result = validateDataset(base());
    expect(result.coverage?.byMacroRegion.west_central_asia).toBe(1);
    expect(result.coverage?.byMacroRegion.americas).toBe(0);
    expect(
      adjacentLaneColorWarnings([
        { leftColor: '#111111', rightColor: '#111111' },
        { leftColor: '#111111', rightColor: '#222222' },
        { leftColor: '#333333', rightColor: '#444444' },
        { leftColor: '#444444', rightColor: '#555555' },
      ]),
    ).toEqual([]);
    expect(
      adjacentLaneColorWarnings([
        { leftColor: '#AABBCC', rightColor: '#aabbcc' },
        { leftColor: '#111111', rightColor: '#111111' },
        { leftColor: '#222222', rightColor: '#333333' },
      ]).some((issue) => issue.message.includes('>25%')),
    ).toBe(true);
    expect(adjacentLaneColorWarnings([])).toEqual([]);
  });
});
