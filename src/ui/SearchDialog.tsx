import { useEffect, useState } from 'react';

import type { SearchHit } from '../search/query.ts';

const KIND: Record<SearchHit['kind'], string> = {
  polity: 'State',
  person: 'Person',
  callout: 'Note',
  band: 'Band',
};

export function SearchDialog({
  query,
  hits,
  recents,
  onClose,
  onPick,
  onQuery,
}: {
  query: string;
  hits: readonly SearchHit[];
  recents: readonly string[];
  onClose: () => void;
  onPick: (hit: SearchHit) => void;
  onQuery: (value: string) => void;
}) {
  const showingRecents = query.trim().length === 0;
  const count = showingRecents ? recents.length : hits.length;
  const [cursor, setCursor] = useState({ query, index: 0 });
  const active = cursor.query === query ? cursor.index : 0;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (count === 0) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setCursor({ query, index: Math.min(count - 1, active + 1) });
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setCursor({ query, index: Math.max(0, active - 1) });
        return;
      }
      if (event.key !== 'Enter') return;
      event.preventDefault();
      if (showingRecents) {
        const recent = recents[active];
        if (recent) onQuery(recent);
        return;
      }
      const hit = hits[active];
      if (hit) onPick(hit);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, count, hits, onClose, onPick, onQuery, query, recents, showingRecents]);

  return (
    <div className="search-pop" id="search-dialog" role="dialog" aria-label="Search">
      <div className="search-pop-head">
        <p>{showingRecents ? 'Recent searches' : 'Results'}</p>
        <button type="button" onClick={onClose}>
          Close search
        </button>
      </div>
      {showingRecents && recents.length === 0 ? (
        <p className="search-empty">
          Names, alternate names, or a year such as 44 BCE.
        </p>
      ) : null}
      {!showingRecents && hits.length === 0 ? (
        <p className="search-empty">No matches.</p>
      ) : null}
      <div role="listbox" aria-label={showingRecents ? 'Recent searches' : 'Results'}>
        {showingRecents
          ? recents.map((recent, index) => (
              <button
                key={recent}
                type="button"
                role="option"
                className="search-hit"
                aria-selected={index === active}
                onClick={() => onQuery(recent)}
              >
                {recent}
              </button>
            ))
          : hits.map((hit, index) => (
              <button
                key={`${hit.kind}:${hit.id}`}
                type="button"
                role="option"
                className="search-hit"
                aria-selected={index === active}
                onClick={() => onPick(hit)}
              >
                {`${KIND[hit.kind]}, ${hit.label}, ${hit.detail}`}
              </button>
            ))}
      </div>
    </div>
  );
}
