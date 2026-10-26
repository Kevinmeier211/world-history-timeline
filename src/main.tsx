import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-serif-4/600.css';
import './styles/tokens.css';

const root = document.getElementById('root');
if (!root) throw new Error('missing root');
const mount: HTMLElement = root;

const legacy = new URLSearchParams(window.location.search).has('v1');

async function boot(): Promise<void> {
  if (legacy) {
    await import('./styles/app.css');
    const { App } = await import('./App');
    ReactDOM.createRoot(mount).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    return;
  }
  const { PosterApp } = await import('./ui/PosterApp');
  ReactDOM.createRoot(mount).render(
    <React.StrictMode>
      <PosterApp />
    </React.StrictMode>,
  );
}

void boot();
