import { useCallback, useEffect, useState } from 'react';

import { ChartViewport, type SheetSize } from '../render/ChartViewport.tsx';
import { useView } from '../state/view.ts';
import { Legend, legendFamilies } from './Legend.tsx';
import { PosterFrame } from './PosterFrame.tsx';
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

export function PosterApp() {
  const [query, setQuery] = useState('');
  const link = useView((state) => state.link);
  const setLink = useView((state) => state.setLink);
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
        onQuery={setQuery}
        lens={lens}
        onLens={(next) => setLink({ ...link, lens: next === 'all' ? undefined : next })}
        view={view}
        onView={setView}
        theme={theme}
        onTheme={() => {
          setTheme((current) => nextTheme(current));
        }}
      />
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
          <ChartViewport onSheet={onSheet} />
        )}
      </PosterFrame>
      {reading ? <Legend families={legendFamilies()} onClose={closeReading} /> : null}
    </div>
  );
}
