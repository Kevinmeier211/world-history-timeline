import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-serif-4/600.css';
import './styles/tokens.css';
import { AtlasRoot } from './ui/root';

const root = document.getElementById('root');
if (!root) throw new Error('missing root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AtlasRoot search={window.location.search} />
  </React.StrictMode>,
);
