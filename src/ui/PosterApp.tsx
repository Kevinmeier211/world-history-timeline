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
  const [sheetHeight, setSheetHeight] = useState<number | undefined>(undefined);
  const onSheet = useCallback((sheet: SheetSize) => {
    setSheetHeight((prev) =>
      prev !== undefined && Math.abs(prev - sheet.height) < 0.5 ? prev : sheet.height,
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
      <PosterFrame lens={lens} sheetHeight={view === 'chart' ? sheetHeight : undefined}>
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
