import { useEffect, useState } from 'react';
import { asset } from './data';
type ExportRow = {
  id: string;
  title: string;
  kind: string;
  chapter: string;
  path: string;
  pages: number;
  bytes: number;
  paper: string;
  revision: string;
};
export function PrintCatalog() {
  const [files, setFiles] = useState<ExportRow[]>([]);
  const [state, setState] = useState('Loading available downloads…');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  useEffect(() => {
    let active = true;
    fetch(asset('/atlas/exports/catalog.json'))
      .then((r) => {
        if (!r.ok) throw Error('unavailable');
        return r.json();
      })
      .then((data: { files: ExportRow[] }) => {
        if (active) {
          setFiles(data.files);
          setState('');
        }
      })
      .catch(() => {
        if (active)
          setState(
            'Downloads are unavailable in this build. You can still print an individual investigation from its reading page.',
          );
      });
    return () => {
      active = false;
    };
  }, []);
  const visible = files.filter(
    (f) =>
      (kind === 'all' || f.kind === kind) &&
      `${f.title} ${f.chapter}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="download-catalog">
      <h1>Choose a reader or activity sheet</h1>
      <p>
        Start with one investigation or chapter. These local review PDFs include source
        notes; independent historical and physical-print review remain open.
      </p>
      <label>
        Find a download
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <label htmlFor="download-format">Format</label>
      <select
        id="download-format"
        value={kind}
        onChange={(e) => setKind(e.target.value)}
      >
        <option value="all">All formats</option>
        {[...new Set(files.map((f) => f.kind))].map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <p role="status">
        {state ||
          `${visible.length} ${visible.length === 1 ? 'download matches' : 'downloads match'}.`}
      </p>
      <ul>
        {visible.map((f) => (
          <li key={f.id}>
            <a href={asset(f.path)} download>
              {f.title}
            </a>
            <p>
              {f.chapter} · {f.kind} · {f.pages} pages ·{' '}
              {(f.bytes / 1_000_000).toFixed(2)} MB · {f.paper} · {f.revision}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
