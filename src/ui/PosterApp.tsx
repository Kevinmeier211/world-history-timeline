import { useCallback, useEffect, useMemo, useState } from 'react';

import { columnChoices, withFold, withPin } from '../layout/columns.ts';
import { clientDataset } from '../data/clientDataset.ts';
import families from '../data/families.json';
import { ChartViewport, type SheetSize } from '../render/ChartViewport.tsx';
import {
  pushRecent,
  recordsFromDataset,
  searchRecords,
  type SearchHit,
} from '../search/query.ts';
import {
  applyPreset,
  readCompares,
  saveCompare,
  writeCompares,
  type CompareSet,
} from '../state/compares.ts';
import { useView } from '../state/view.ts';
import type { ViewLink } from '../state/hashUrl.ts';
import { Columns } from './Columns.tsx';
import { Dossier } from './Dossier.tsx';
import { Story } from './Story.tsx';
import { applyStop, matchStop, storySources, tourStops } from './story.ts';
import { buildTableRows } from './table.ts';
import { TableView } from './TableView.tsx';
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
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyTourId, setStoryTourId] = useState<string | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const attachTo = useMemo(() => {
    const map = new Map<string, string>();
    for (const callout of clientDataset().callouts) {
      if (callout.attachTo) map.set(callout.id, callout.attachTo);
    }
    return map;
  }, []);
  const storyTour =
    clientDataset().tours.find((tour) => tour.id === storyTourId) ?? null;
  const stops = useMemo(
    () => (storyTour ? tourStops(storyTour, attachTo) : []),
    [attachTo, storyTour],
  );
  const matched = matchStop(stops, link);
  const shownIndex = matched >= 0 ? matched : storyIndex;
  const shownStop = stops[shownIndex];
  const tableRows = useMemo(
    () =>
      buildTableRows(
        clientDataset().polities,
        clientDataset().callouts,
        families,
        link.fold,
        link.pin ?? [],
      ),
    [link.fold, link.pin],
  );
  const storyCard =
    storyTour && shownStop
      ? {
          tourTitle: storyTour.title,
          index: shownIndex,
          count: stops.length,
          title: shownStop.title,
          narrative: shownStop.narrative,
          sources: storySources(shownStop.sourceIds, clientDataset().sources),
        }
      : null;
  const [compares, setCompares] = useState<readonly CompareSet[]>(() =>
    readCompares(browserStorage()),
  );
  const closeReading = useCallback(() => setReading(false), []);
  const closeColumns = useCallback(() => setColumnsOpen(false), []);
  const applyColumns = useCallback(
    (next: { fold: string[]; pin: string[] }) => {
      const current = useView.getState().link;
      const linkNext: ViewLink = { ...current, fold: next.fold };
      if (next.pin.length > 0) linkNext.pin = next.pin;
      else delete linkNext.pin;
      setLink(linkNext);
    },
    [setLink],
  );
  const applyPresetId = useCallback(
    (id: string) => {
      const preset = clientDataset().presets.find((item) => item.id === id);
      if (!preset) return;
      const regions = columnChoices()
        .filter((row) => row.kind === 'region')
        .map((row) => row.id);
      const applied = applyPreset(preset, regions);
      const current = useView.getState().link;
      const next: ViewLink = { ...current, fold: applied.fold };
      if (applied.pin.length > 0) next.pin = applied.pin;
      else delete next.pin;
      if (applied.y !== undefined) next.y = applied.y;
      setLink(next);
    },
    [setLink],
  );
  const applyCompare = useCallback(
    (id: string) => {
      const row = compares.find((item) => item.id === id);
      if (!row) return;
      applyColumns({ fold: [...row.fold], pin: [...row.pin] });
    },
    [applyColumns, compares],
  );
  const chooseStory = useCallback(
    (id: string) => {
      const tour = clientDataset().tours.find((item) => item.id === id);
      const stop = tour ? tourStops(tour, attachTo)[0] : undefined;
      if (!tour || !stop) return;
      setStoryTourId(id);
      setStoryIndex(0);
      setLink(applyStop(useView.getState().link, stop));
    },
    [attachTo, setLink],
  );
  const stepStory = useCallback(
    (delta: number) => {
      const nextIndex = Math.min(stops.length - 1, Math.max(0, shownIndex + delta));
      const stop = stops[nextIndex];
      if (!stop || nextIndex === shownIndex) return;
      setStoryIndex(nextIndex);
      setLink(applyStop(useView.getState().link, stop));
    },
    [setLink, shownIndex, stops],
  );
  const saveCurrent = useCallback(
    (name: string) => {
      const current = useView.getState().link;
      const next = saveCompare(compares, name, current.pin ?? [], current.fold);
      setCompares(writeCompares(browserStorage(), next));
    },
    [compares],
  );
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
        onReading={() => {
          setReading(true);
          setColumnsOpen(false);
          setStoryOpen(false);
        }}
        columnsOpen={columnsOpen}
        onColumns={() => {
          setColumnsOpen((open) => !open);
          setReading(false);
          setStoryOpen(false);
        }}
        storiesOpen={storyOpen}
        onStories={() => {
          setStoryOpen((open) => !open);
          setColumnsOpen(false);
          setReading(false);
        }}
      >
        {view === 'table' ? (
          <TableView
            rows={tableRows}
            onOpen={(row) => {
              const current = useView.getState().link;
              const next: ViewLink = { ...current, y: row.start };
              const selected = row.kind === 'polity' ? row.id : row.attachTo;
              if (selected) next.sel = selected;
              setLink(next);
              if (row.kind === 'polity') setDossierId(row.id);
            }}
          />
        ) : (
          <ChartViewport onSheet={onSheet} onOpen={setDossierId} />
        )}
      </PosterFrame>
      {reading ? <Legend families={legendFamilies()} onClose={closeReading} /> : null}
      <Columns
        open={columnsOpen}
        fold={link.fold}
        pin={link.pin ?? []}
        onClose={closeColumns}
        onFold={(id) => applyColumns(withFold(link.fold, link.pin ?? [], id))}
        onPin={(id) => applyColumns(withPin(link.fold, link.pin ?? [], id))}
        presets={clientDataset().presets}
        compares={compares}
        onPreset={applyPresetId}
        onCompare={applyCompare}
        onSave={saveCurrent}
      />
      <Story
        open={storyOpen}
        tours={clientDataset().tours}
        card={storyCard}
        onChoose={chooseStory}
        onPrevious={() => stepStory(-1)}
        onNext={() => stepStory(1)}
        onList={() => setStoryTourId(null)}
        onClose={() => {
          setStoryOpen(false);
          setStoryTourId(null);
        }}
      />
      {dossier ? <Dossier model={dossier} onClose={() => setDossierId(null)} /> : null}
    </div>
  );
}
