import type { RefObject } from 'react';
import { initialLocation, type Location } from './navigation';
import { asset } from './data';

export function AtlasHeader({
  location,
  dark,
  navigate,
  searchButton,
  openSearch,
  toggleTheme,
}: {
  location: Location;
  dark: boolean;
  navigate: (location: Location) => void;
  searchButton: RefObject<HTMLButtonElement | null>;
  openSearch: () => void;
  toggleTheme: () => void;
}) {
  return (
    <header className="app-header">
      <a
        className="brand"
        href="?"
        onClick={(e) => {
          e.preventDefault();
          navigate(initialLocation);
        }}
      >
        <span className="brand-mark" aria-hidden="true">
          C
        </span>
        <span>
          CHRONOS <small>A WORLD HISTORY ATLAS</small>
        </span>
      </a>
      <nav aria-label="Primary">
        {(['explore', 'journeys', 'notebook'] as const).map((d) => (
          <button
            key={d}
            aria-current={location.destination === d ? 'page' : undefined}
            onClick={() => navigate({ ...location, destination: d })}
          >
            {d[0]!.toUpperCase() + d.slice(1)}
          </button>
        ))}
      </nav>
      <button
        className="search-trigger"
        aria-label="Search the atlas"
        ref={searchButton}
        onClick={openSearch}
      >
        ⌕ <span>Search</span>
      </button>
      <button
        className="theme-button"
        aria-label={dark ? 'Use light appearance' : 'Use dark appearance'}
        onClick={toggleTheme}
      >
        {dark ? '☀' : '☾'}
      </button>
    </header>
  );
}

export function AtlasFooter({ packId }: { packId: string }) {
  return (
    <footer className="app-footer">
      <span>Chronos Atlas · A selective history, 3300 BCE–2000 CE</span>
      <details>
        <summary>Reading conventions, credits and exports</summary>
        <p>
          Chapter frames group questions, not universal stages of human development.
          Timeline bars show the duration of each case within the displayed window; row
          widths do not rank societies. Dates retain their documented precision. Dots
          locate broad places; schematic lines identify only supported connections.
        </p>
        <p>
          Content source consultation and self-review by Codex. No family testing or
          independent historian approval is claimed. Historical uncertainty and
          selective coverage are recorded in dossiers and chapter notes.
        </p>
        <p>
          Map: Natural Earth, via world-atlas, public domain. Object images: museum and
          archive material with individual rights statements and credits. No analytics
          or account system; notebook entries stay in browser storage.
        </p>
        <a href={asset('/atlas/corpus.json')} download>
          Download content and source manifest
        </a>
        <a href="?print=overview" target="_blank" rel="noreferrer">
          Open printable overview
        </a>
        <a href="?print=catalog" target="_blank" rel="noreferrer">
          Download readers and activity sheets
        </a>
        <a href={`?print=chapter&pack=${packId}`} target="_blank" rel="noreferrer">
          Print this chapter
        </a>
        <a href={`?print=family&pack=${packId}`} target="_blank" rel="noreferrer">
          Print an exploration sheet
        </a>
      </details>
    </footer>
  );
}
