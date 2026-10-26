import { useCallback, useEffect, useMemo, useState } from 'react';

import { clientDataset } from '../data/clientDataset.ts';
import { ChartViewport, type SheetSize } from '../render/ChartViewport.tsx';
import {
  pushRecent,
  recordsFromDataset,
  searchRecords,
  type SearchHit,
} from '../search/query.ts';
import { useView } from '../state/view.ts';
import type { ViewLink } from '../state/hashUrl.ts';
import { Dossier } from './Dossier.tsx';
import { dossierFor } from './dossier.ts';
import { Legend, legendFamilies } from './Legend.tsx';
import { PosterFrame } from './PosterFrame.tsx';
import { SearchDialog } from './SearchDialog.tsx';
import { TopBar } from './TopBar.tsx';
import {
  applyTheme,
  nextTheme,
  readStoredTheme,
  writeStoredTheme,
  type LensId,
  type ThemeChoice,
  type ViewId,
} from './frame.ts';
import './shell.css';

function browserStorage(): Storage | null {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function typingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

export function PosterApp() {
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [dossierId, setDossierId] = useState<string | null>(null);
  const [recents, setRecents] = useState<readonly string[]>([]);
  const link = useView((state) => state.link);
  const setLink = useView((state) => state.setLink);
  const catalog = useMemo(() => recordsFromDataset(clientDataset()), []);
  const hits = useMemo(() => searchRecords(catalog, query), [catalog, query]);
  const dossier = useMemo(
    () => (dossierId ? dossierFor(dossierId, clientDataset()) : null),
    [dossierId],
  );
  const lens: LensId = link.lens ?? 'all';
  const [view, setView] = useState<ViewId>('chart');
  const [theme, setTheme] = useState<ThemeChoice>(() =>
    readStoredTheme(browserStorage()),
  );
  const [reading, setReading] = useState(false);
  const closeReading = useCallback(() => setReading(false), []);
  const [sheet, setSheet] = useState<SheetSize>({ height: 0, minWidth: 0 });
  const onSheet = useCallback((next: SheetSize) => {
    setSheet((prev) =>
      Math.abs(prev.height - next.height) < 0.5 &&
      Math.abs(prev.minWidth - next.minWidth) < 0.5
        ? prev
        : next,
    );
  }, []);

  useEffect(() => {
    applyTheme(theme, document.documentElement);
    writeStoredTheme(theme, browserStorage());
  }, [theme]);

  useEffect(() => {
    if (!searchOpen) return;
    const field = document.getElementById('poster-search');
    if (!(field instanceof HTMLInputElement)) return;
    field.focus();
    field.select();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      if (typingTarget(event.target) || document.querySelector('[role="dialog"]'))
        return;
      event.preventDefault();
      setSearchOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const pickHit = useCallback(
    (hit: SearchHit) => {
      setRecents((prev) => pushRecent(prev, query));
      setQuery('');
      const current = useView.getState().link;
      const next: ViewLink = { ...current, y: hit.year };
      if (hit.polityId) next.sel = hit.polityId;
      setLink(next);
      setSearchOpen(false);
    },
    [query, setLink],
  );

  useEffect(() => {
    useView.getState().readHash();
    const onHash = () => useView.getState().readHash();
    window.addEventListener('hashchange', onHash);
    window.addEventListener('popstate', onHash);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('popstate', onHash);
    };
  }, []);

  return (
    <div className="poster-app">
      <TopBar
        query={query}
        onQuery={(value) => {
          setQuery(value);
          setSearchOpen(true);
        }}
        searchOpen={searchOpen}
        onSearchFocus={() => setSearchOpen(true)}
        lens={lens}
        onLens={(next) => setLink({ ...link, lens: next === 'all' ? undefined : next })}
        view={view}
        onView={setView}
        theme={theme}
        onTheme={() => {
          setTheme((current) => nextTheme(current));
        }}
      />
      {searchOpen ? (
        <SearchDialog
          query={query}
          hits={hits}
          recents={recents}
          onClose={() => setSearchOpen(false)}
          onPick={pickHit}
          onQuery={(value) => setQuery(value)}
        />
      ) : null}
      <PosterFrame
        lens={lens}
        sheetHeight={view === 'chart' ? sheet.height : undefined}
        sheetMinWidth={view === 'chart' ? sheet.minWidth : 0}
        readingOpen={reading}
        onReading={() => setReading(true)}
      >
        {view === 'table' ? (
          <p className="chart-note">
            Table view lists the same polities, one row each.
          </p>
        ) : (
          <ChartViewport onSheet={onSheet} onOpen={setDossierId} />
        )}
      </PosterFrame>
      {reading ? <Legend families={legendFamilies()} onClose={closeReading} /> : null}
      {dossier ? <Dossier model={dossier} onClose={() => setDossierId(null)} /> : null}
    </div>
  );
}
