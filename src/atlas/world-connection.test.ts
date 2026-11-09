import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { Corpus, Relation } from './model';
import { WorldContext } from './WorldContext';

vi.mock('./AtlasMap', () => ({
  AtlasMap: ({ relation }: { relation?: Relation }) =>
    createElement('div', { 'data-testid': 'map', 'data-route': relation?.id }),
}));
const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
afterEach(cleanup);
function world(id: string, year: number) {
  const relation = corpus.relations.find((item) => item.id === id)!;
  return render(
    createElement(WorldContext, {
      corpus,
      year,
      relation,
      region: 'all',
      selected: relation.from,
      pack: corpus.packs.find(
        (pack) => pack.id === (id === 'pacific-exchange' ? 'C7' : 'C4'),
      )!,
      openSubject: vi.fn(),
      goYear: vi.fn(),
      previewSubject: vi.fn(),
      showTimeline: vi.fn(),
    }),
  );
}
it.each([
  ['palmyra-network', 200],
  ['pacific-exchange', 1600],
] as const)(
  'keeps %s source explanation and limits beside its visible route',
  (id, year) => {
    world(id, year);
    const relation = corpus.relations.find((item) => item.id === id)!;
    const panel = screen.getByRole('region', {
      name: 'Evidence for the mapped connection',
    });
    expect(panel).toHaveTextContent(relation.date);
    expect(panel).toHaveTextContent(relation.explanation);
    expect(panel).toHaveTextContent('not an exact journey or a boundary');
    expect(screen.getByTestId('map')).toHaveAttribute('data-route', id);
    for (const citation of relation.citations) {
      const source = corpus.sources.find((item) => item.id === citation.source)!;
      expect(
        within(panel).getByRole('link', { name: source.title + ' ↗', hidden: true }),
      ).toHaveAttribute('href', source.url);
      expect(panel).toHaveTextContent(citation.locator);
    }
  },
);
it.each([1550, 1700])(
  'does not imply that the selected cases support a route at %i',
  (year) => {
    world('pacific-exchange', year);
    expect(
      screen.queryByRole('region', { name: 'Evidence for the mapped connection' }),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('map')).not.toHaveAttribute('data-route');
  },
);
