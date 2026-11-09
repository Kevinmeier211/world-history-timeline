import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, Journey } from './model';
import { buildJourneyBootstrap } from '../../scripts/redesign/bootstrap-journeys';
import { mergeJourneyDetails, parseJourneyDetails } from './journey-details';

const corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8')) as Corpus;
const webJourney = (journey: Journey) => {
  const {
    familyEvidence: _family,
    leadObject: _lead,
    printBreakAfter: _breaks,
    printSourcesPerPage: _sources,
    ...web
  } = journey;
  return web;
};

describe('pure journey bootstrap projection', () => {
  it('reconstructs every current web journey exactly while leaving full/print corpus unchanged', () => {
    const before = structuredClone(corpus);
    const result = buildJourneyBootstrap(corpus);
    expect(corpus).toEqual(before);
    expect(result.journeys).toHaveLength(corpus.journeys.length);
    expect(result.records).toHaveLength(corpus.journeys.length);
    for (const [index, summary] of result.journeys.entries()) {
      const full = corpus.journeys[index]!;
      expect(summary.id).toBe(full.id);
      expect(summary).not.toHaveProperty('conclusion');
      expect(summary).not.toHaveProperty('familyEvidence');
      expect(summary).not.toHaveProperty('leadObject');
      expect(summary).not.toHaveProperty('printBreakAfter');
      expect(summary).not.toHaveProperty('printSourcesPerPage');
      expect(summary.evidence).toEqual({ citations: full.evidence.citations });
      expect(summary.stops.every((stop) => !Object.hasOwn(stop, 'narrative'))).toBe(
        true,
      );
      const record = result.records[index]!;
      expect(record.revision).toBe(summary.detailsRevision);
      expect(record.revision).toMatch(/^[a-f0-9]{64}$/);
      expect(
        mergeJourneyDetails(
          parseJourneyDetails(record, full.id, record.revision),
          summary,
        ),
      ).toEqual(webJourney(full));
    }
  });

  it('retains every navigation/list/save field including optional comparisons and relationships', () => {
    const result = buildJourneyBootstrap(corpus);
    for (const [index, summary] of result.journeys.entries()) {
      const full = corpus.journeys[index]!;
      for (const key of [
        'id',
        'title',
        'question',
        'introduction',
        'duration',
        'returnPrompt',
      ] as const)
        expect(summary[key]).toEqual(full[key]);
      expect(summary.stops).toEqual(
        full.stops.map(({ narrative: _narrative, ...stop }) => stop),
      );
    }
  });

  it('revises only a changed journey and covers retained membership/order as well as prose/quiz', () => {
    const original = buildJourneyBootstrap(corpus);
    const mutations: ((journey: Journey) => void)[] = [
      (journey) => {
        journey.stops[0]!.narrative += ' Added reading.';
      },
      (journey) => {
        journey.stops[0]!.year += 1;
      },
      (journey) => {
        journey.stops[0]!.object = 'different-object';
      },
      (journey) => {
        journey.stops.reverse();
      },
      (journey) => {
        journey.evidence.options[0]!.feedback += ' Added feedback.';
      },
      (journey) => {
        journey.evidence.citations[0]!.locator += ' Updated locator.';
      },
      (journey) => {
        journey.title += ' Updated title.';
      },
    ];
    for (const mutate of mutations) {
      const changed = structuredClone(corpus);
      mutate(changed.journeys[0]!);
      const result = buildJourneyBootstrap(changed);
      expect(result.journeys[0]!.detailsRevision).not.toBe(
        original.journeys[0]!.detailsRevision,
      );
      expect(result.journeys.slice(1).map((j) => j.detailsRevision)).toEqual(
        original.journeys.slice(1).map((j) => j.detailsRevision),
      );
    }
  });

  it('does not change a web revision for print-only metadata edits', () => {
    const changed = structuredClone(corpus);
    const journey = changed.journeys[0]!;
    journey.leadObject = 'another-print-lead';
    journey.printBreakAfter = [1];
    journey.printSourcesPerPage = 1;
    if (journey.familyEvidence) journey.familyEvidence.text += ' Print-only addition.';
    expect(buildJourneyBootstrap(changed)).toEqual(buildJourneyBootstrap(corpus));
  });

  it('rejects duplicate identity and an incomplete canonical journey before writing endpoints', () => {
    const duplicate = structuredClone(corpus);
    duplicate.journeys.push(duplicate.journeys[0]!);
    expect(() => buildJourneyBootstrap(duplicate)).toThrow(
      'Incomplete canonical journey',
    );
    const partial = structuredClone(corpus);
    partial.journeys[0]!.stops[0]!.narrative = '';
    expect(() => buildJourneyBootstrap(partial)).toThrow(
      'Incomplete canonical journey',
    );
  });
});
