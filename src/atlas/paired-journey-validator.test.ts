/** Reject unfinished paired journeys while accepting a fully authored comparison. */
import { describe, expect, it } from 'vitest';
import raw from '../../public/atlas/corpus.json';
import type { Corpus } from './model';
import { validateCorpus } from './validate';
import { pairedJourneyFixture } from './paired-journey-fixture';

const fixture = () => pairedJourneyFixture(raw as unknown as Corpus);

describe('complete authored paired journeys', () => {
  it('accepts two distinct dossiers with an authored pair and full cited structures', () => {
    const { corpus } = fixture();
    expect(validateCorpus(corpus, true)).toEqual([]);
  });
  it('accepts the authored pair in either order and a deliberate text-source family card', () => {
    const { corpus, journey, subjects } = fixture();
    const pair = corpus.comparisons!.find((p) =>
      subjects.every((id) => p.subjects.includes(id)),
    )!;
    pair.subjects.reverse();
    journey.familyEvidence!.object = null;
    expect(validateCorpus(corpus, true)).toEqual([]);
  });
  it('keeps the existing three-or-more-stop rule without imposing the paired family requirement', () => {
    const { corpus } = fixture();
    const existing = corpus.journeys.find(
      (j) => j.id !== 'paired-journey-fixture' && j.stops.length >= 3,
    )!;
    delete existing.familyEvidence;
    expect(validateCorpus(corpus, true)).toEqual([]);
  });
  it.each([0, 1])('rejects %i stops', (count) => {
    const { corpus, journey } = fixture();
    journey.stops = journey.stops.slice(0, count);
    delete journey.leadObject;
    journey.familyEvidence!.object = null;
    expect(validateCorpus(corpus)).toContain(
      'paired-journey-fixture: unfinished investigation',
    );
  });
  it('rejects two stops at the same dossier', () => {
    const { corpus, journey } = fixture();
    journey.stops[1] = { ...journey.stops[0]! };
    delete journey.leadObject;
    journey.familyEvidence!.object = null;
    expect(validateCorpus(corpus)).toContain(
      'paired-journey-fixture: unfinished investigation',
    );
  });
  it('rejects an unpaired or unrelated pair of dossiers', () => {
    const { corpus, subjects } = fixture();
    corpus.comparisons = corpus.comparisons!.filter(
      (pair) => !subjects.every((id) => pair.subjects.includes(id)),
    );
    expect(validateCorpus(corpus)).toContain(
      'paired-journey-fixture: unfinished investigation',
    );
  });
  it('requires an actual authored comparison question', () => {
    const { corpus, subjects } = fixture();
    corpus.comparisons!.find((pair) =>
      subjects.every((id) => pair.subjects.includes(id)),
    )!.question = ' ';
    expect(validateCorpus(corpus)).toContain(
      'paired-journey-fixture: unfinished investigation',
    );
  });
  it.each([
    'title',
    'question',
    'duration',
    'introduction',
    'conclusion',
    'returnPrompt',
  ] as const)('rejects a blank %s', (field) => {
    const { corpus, journey } = fixture();
    journey[field] = ' ';
    expect(validateCorpus(corpus)).toContain(
      'paired-journey-fixture: unfinished investigation',
    );
  });
  it('rejects an unfinished stop or invalid view year', () => {
    for (const value of ['narrative', 'year'] as const) {
      const { corpus, journey } = fixture();
      if (value === 'narrative') journey.stops[0]!.narrative = ' ';
      else journey.stops[0]!.year = Number.NaN;
      expect(validateCorpus(corpus)).toContain(
        'paired-journey-fixture: unfinished investigation',
      );
    }
  });
  it('rejects missing or incomplete family evidence', () => {
    for (const value of [
      'missing',
      'title',
      'claim',
      'notice',
      'text',
      'citations',
      'return',
      'feedback',
    ] as const) {
      const { corpus, journey } = fixture();
      if (value === 'missing') delete journey.familyEvidence;
      else if (value === 'title') journey.familyEvidence!.title = ' ';
      else if (value === 'claim') journey.familyEvidence!.claimPrompt = ' ';
      else if (value === 'notice') journey.familyEvidence!.notice = [' '];
      else if (value === 'text') journey.familyEvidence!.text = ' ';
      else if (value === 'return') journey.familyEvidence!.returnPrompt = ' ';
      else if (value === 'feedback') journey.familyEvidence!.feedback = ' ';
      else journey.familyEvidence!.citations = [];
      expect(validateCorpus(corpus)).toContain(
        'paired-journey-fixture: unfinished investigation',
      );
    }
  });
  it('rejects incomplete reasoning or missing evidence citations', () => {
    for (const value of [
      'prompt',
      'options',
      'answer',
      'text',
      'feedback',
      'citations',
    ] as const) {
      const { corpus, journey } = fixture();
      if (value === 'prompt') journey.evidence.prompt = ' ';
      else if (value === 'options') journey.evidence.options = [];
      else if (value === 'answer')
        journey.evidence.options.forEach((o) => {
          o.supported = false;
        });
      else if (value === 'text') journey.evidence.options[0]!.text = ' ';
      else if (value === 'feedback') journey.evidence.options[0]!.feedback = ' ';
      else journey.evidence.citations = [];
      expect(validateCorpus(corpus)).toContain(
        'paired-journey-fixture: unfinished investigation',
      );
    }
  });
  it('retains citation and object validity checks', () => {
    const { corpus, journey } = fixture();
    journey.familyEvidence!.citations = [
      { source: 'missing-fixture-source', locator: 'Unknown source' },
    ];
    journey.stops[1]!.object = 'missing-fixture-object';
    const errors = validateCorpus(corpus);
    expect(
      errors.some((e) => e.includes('unresolved citation missing-fixture-source')),
    ).toBe(true);
    expect(errors).toContain('paired-journey-fixture: missing object');
  });
  it('retains citation-locator requirements', () => {
    const { corpus, journey } = fixture();
    journey.evidence.citations = [{ source: 'met-9198', locator: '' }];
    expect(validateCorpus(corpus)).toContain(
      'paired-journey-fixture: unresolved citation met-9198',
    );
  });
});
