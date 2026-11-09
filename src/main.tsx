import React from 'react';
import './styles/tokens.css';
import ReactDOM from 'react-dom/client';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-serif-4/400.css';
import '@fontsource/source-serif-4/600.css';
import './atlas/font-subset-priority.css';

import { Atlas } from './atlas/App';
const PrintAtlas = React.lazy(() =>
  import('./atlas/PrintAtlas').then((m) => ({ default: m.PrintAtlas })),
);
const printMode = new URLSearchParams(window.location.search).get('print');

const root = document.getElementById('root');
if (!root) throw new Error('missing root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {printMode ? (
      <React.Suspense fallback={<p>Preparing print view…</p>}>
        <PrintAtlas />
      </React.Suspense>
    ) : (
      <Atlas />
    )}
  </React.StrictMode>,
);
