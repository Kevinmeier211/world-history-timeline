import { useEffect, useState } from 'react';

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
      <PosterFrame lens={lens}>
        {view === 'table' ? (
          <p className="chart-note">
            Table view lists the same polities, one row each.
          </p>
        ) : null}
      </PosterFrame>
    </div>
  );
}
