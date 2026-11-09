import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Dossier } from './Dossier';
import type { Location } from './navigation';
import type { RuntimeCorpus, Subject } from './model';

vi.mock('./data', () => ({
  loadSubject: vi.fn(async () => {
    throw new Error('Use the corpus subject.');
  }),
  loadMediaDetails: vi.fn(),
  loadReferenceContexts: vi.fn(),
  loadSourceScopes: vi.fn(),
}));

afterEach(() => cleanup());

function subject(id: string, contextIds: string[]): Subject {
  return {
    id,
    name: id,
    aliases: [],
    kind: 'process',
    region: 'Europe',
    place: 'A named place',
    coordinates: [0, 0],
    geographicPrecision: 'A locator, not a route.',
    interval: {
      start: 1900,
      end: 1901,
      label: '1900–1901',
      note: 'Case dates stay distinct from any reference.',
      precision: 'range',
    },
    packs: ['C8'],
    question: 'What can this record show?',
    summary: 'A short summary for the contents check.',
    sections: [{ title: 'One section', text: 'Section prose.', citations: [] }],
    claims: [],
    objectIds: [],
    terms: [],
    dimensions: {},
    status: 'published',
    returnPrompt: 'What remains unknown?',
    deeperReading: [{ title: 'A deeper limit', text: 'Deeper prose.', citations: [] }],
    contextIds,
  };
}

function corpus(row: Subject): RuntimeCorpus {
  return {
    subjects: [row],
    sources: [],
    media: [],
    relations: [],
    packs: [],
    journeys: [],
    glossary: [],
    contexts: row.contextIds?.length
      ? [
          {
            id: row.contextIds[0]!,
            title: 'A reference frame',
            region: 'Europe',
            interval: {
              start: 1890,
              end: 1910,
              label: '1890–1910',
              note: 'This reference is wider than the case.',
              precision: 'range',
            },
            summary: 'Reference summary.',
            subjectIds: [row.id],
            citations: [],
            phases: [
              {
                year: 1900,
                label: '1900',
                title: 'A phase',
                text: 'Phase prose.',
                citations: [],
              },
            ],
          },
        ]
      : [],
  };
}

function location(id: string): Location {
  return {
    legacy: null,
    destination: 'explore',
    view: 'stories',
    preview: null,
    scale: 'era',
    pack: 'C8',
    year: 1900,
    region: 'all',
    subject: id,
    object: null,
    evidence: false,
    compare: null,
    journey: null,
    step: 0,
    returnTo: null,
  };
}

function open(row: Subject) {
  return render(
    createElement(Dossier, {
      corpus: corpus(row),
      location: location(row.id),
      close: () => undefined,
      navigate: () => undefined,
      openSubject: () => undefined,
      save: () => undefined,
      onReady: () => undefined,
    }),
  );
}

describe('Investigation contents links', () => {
  it('links Time and place only when the reference section exists', () => {
    const view = open(subject('with-reference', ['sample-context']));
    const link = screen.getByRole('link', { name: 'Time and place' });
    expect(link.getAttribute('href')).toBe('#wider-context');
    expect(view.container.querySelector('#wider-context')).not.toBeNull();
    expect(view.container.querySelector('#deeper-reading')).not.toBeNull();
    expect(view.container.querySelector('#main-explanation')).not.toBeNull();
  });

  it('does not offer a Wendat reference destination that was not authored', () => {
    const view = open(subject('wendat-laine', []));
    expect(screen.queryByRole('link', { name: 'Time and place' })).toBeNull();
    expect(view.container.querySelector('#wider-context')).toBeNull();
    expect(view.container.querySelector('#deeper-reading')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Go deeper' }).getAttribute('href')).toBe(
      '#deeper-reading',
    );
  });
});
