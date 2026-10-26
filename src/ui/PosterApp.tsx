import { useCallback, useEffect, useState } from 'react';

import { ChartViewport, type SheetSize } from '../render/ChartViewport.tsx';
import { PosterFrame } from './PosterFrame.tsx';
import { TopBar } from './TopBar.tsx';
import {
  applyTheme,
  nextTheme,
  type LensId,
  type ThemeChoice,
  type ViewId,
} from './frame.ts';
import './shell.css';

export function PosterApp() {
  const [query, setQuery] = useState('');
  const [lens, setLens] = useState<LensId>('all');
  const [view, setView] = useState<ViewId>('chart');
  const [theme, setTheme] = useState<ThemeChoice>('system');
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
  }, [theme]);

  return (
    <div className="poster-app">
      <TopBar
        query={query}
        onQuery={setQuery}
        lens={lens}
        onLens={setLens}
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
      >
        {view === 'table' ? (
          <p className="chart-note">
            Table view lists the same polities, one row each.
          </p>
        ) : (
          <ChartViewport onSheet={onSheet} />
        )}
      </PosterFrame>
    </div>
  );
}
