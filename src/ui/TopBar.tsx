import {
  LENSES,
  VIEWS,
  isLensId,
  isViewId,
  themeLabel,
  type LensId,
  type ThemeChoice,
  type ViewId,
} from './frame.ts';

export interface TopBarProps {
  query: string;
  onQuery: (value: string) => void;
  searchOpen: boolean;
  onSearchFocus: () => void;
  lens: LensId;
  onLens: (lens: LensId) => void;
  view: ViewId;
  onView: (view: ViewId) => void;
  theme: ThemeChoice;
  onTheme: () => void;
}

export function TopBar({
  query,
  onQuery,
  searchOpen,
  onSearchFocus,
  lens,
  onLens,
  view,
  onView,
  theme,
  onTheme,
}: TopBarProps) {
  return (
    <header className="top-bar">
      <p className="top-bar-title">{'Chronos Atlas'}</p>
      <form
        className="bar-search"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label className="sr-only" htmlFor="poster-search">
          Search
        </label>
        <input
          id="poster-search"
          type="search"
          value={query}
          placeholder="Name or year"
          aria-controls={searchOpen ? 'search-dialog' : undefined}
          onFocus={onSearchFocus}
          onChange={(event) => {
            onQuery(event.target.value);
          }}
        />
      </form>
      <label className="bar-field">
        <span className="bar-label">Lens</span>
        <select
          value={lens}
          onChange={(event) => {
            if (isLensId(event.target.value)) onLens(event.target.value);
          }}
        >
          {LENSES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="bar-field">
        <span className="bar-label">View</span>
        <select
          value={view}
          onChange={(event) => {
            if (isViewId(event.target.value)) onView(event.target.value);
          }}
        >
          {VIEWS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <button type="button" aria-label={`Theme: ${theme}`} onClick={onTheme}>
        {themeLabel(theme)}
      </button>
    </header>
  );
}
