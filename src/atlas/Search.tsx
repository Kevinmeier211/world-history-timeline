import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ComponentProps, Ref } from 'react';
import type { RuntimeCorpus, SearchEntry, Subject } from './model';
import { parseYearNumber, formatYear } from '../lib/years';
import { loadSearchIndex } from './data';
import {
  normalizeSearch,
  createSubjectSearch,
  explainSearchMatch,
} from './search-index';
export function Search({
  corpus,
  close,
  openSubject,
  goYear,
  startJourney,
}: {
  corpus: RuntimeCorpus;
  close: () => void;
  openSubject: (s: Subject) => void;
  goYear: (year: number) => void;
  startJourney: (id: string) => void;
}) {
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(12);
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    dialog.current?.showModal();
    dialog.current?.querySelector<HTMLInputElement>('input')?.focus();
  }, []);
  useEffect(() => {
    let active = true;
    loadSearchIndex()
      .then((data) => {
        if (active) setEntries(data);
      })
      .catch((reason) => {
        if (active) setError(String(reason.message));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const findSubjects = useMemo(
    () => createSubjectSearch(corpus.subjects, entries),
    [corpus.subjects, entries],
  );
  const year = parseYearNumber(q);
  const zeroYear = year === 0;
  const query = zeroYear ? '' : normalizeSearch(q);
  const hits = query ? findSubjects(q) : [];
  const journeys = query
    ? corpus.journeys.filter((j) =>
        normalizeSearch(`${j.title} ${j.question} ${j.introduction}`).includes(query),
      )
    : [];
  const terms = query
    ? corpus.glossary.filter((term) =>
        normalizeSearch(`${term.name} ${term.definition}`).includes(query),
      )
    : [];
  return (
    <dialog ref={dialog} className="search-dialog" onCancel={close} onClose={close}>
      <div className="search-head">
        <h2>Find a place, idea or date</h2>
        <button onClick={close}>Close search</button>
      </div>
      <label htmlFor="atlas-search">Subject, concept or year</label>
      <input
        id="atlas-search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setLimit(12);
        }}
        placeholder="Try Buddhism, water, Han, or 1200 BCE"
        type="search"
      />
      {!query && !zeroYear && (
        <p>
          Search the explanations, names and glossary, or enter a date to explore the
          world at that time.
        </p>
      )}
      {loading && (
        <p role="status">Opening full-text search… Names and summaries are ready.</p>
      )}
      {error && <p role="status">{error}</p>}
      {year !== null && !zeroYear && (
        <button className="year-hit" onClick={() => goYear(year)}>
          Go to {formatYear(year)}
        </button>
      )}
      <p role="status" className="search-count">
        {zeroYear ? (
          'There is no year zero. Try 1 BCE or 1 CE.'
        ) : query ? (
          <>
            {year !== null && `Go to ${formatYear(year)} by date. `}
            {hits.length} subjects · {journeys.length} investigations · {terms.length}{' '}
            glossary terms
          </>
        ) : null}
      </p>
      <div className="search-results">
        {hits.slice(0, limit).map((s) => {
          const match = explainSearchMatch(s, entries, q);
          return (
            <button key={s.id} onClick={() => openSubject(s)}>
              <strong>{s.name}</strong>
              <span>
                {s.kind} · {s.interval.label} · {s.region}
              </span>
              <small>
                {match.label}: {match.text}
              </small>
            </button>
          );
        })}
      </div>
      {hits.length > limit && (
        <button onClick={() => setLimit(limit + 12)}>
          Show more subjects ({hits.length - limit} remaining)
        </button>
      )}
      {journeys.length > 0 && (
        <section className="search-group">
          <h3>Investigations</h3>
          {journeys.map((j) => (
            <button key={j.id} onClick={() => startJourney(j.id)}>
              {j.title}
              <small>
                {j.duration} · {j.question}
              </small>
            </button>
          ))}
        </section>
      )}
      {terms.length > 0 && (
        <section className="search-group">
          <h3>Words and ideas</h3>
          {terms.map((term) => (
            <details key={term.id}>
              <summary>{term.name}</summary>
              <p>{term.definition}</p>
              {corpus.subjects
                .filter((s) => s.terms.includes(term.id))
                .map((s) => (
                  <button key={s.id} onClick={() => openSubject(s)}>
                    {s.name}
                  </button>
                ))}
            </details>
          ))}
        </section>
      )}
      {query &&
        !loading &&
        !hits.length &&
        !journeys.length &&
        !terms.length &&
        year === null && (
          <p>
            No match in the current selection. A missing result may mean the topic has
            not been researched here. Try a broader place or idea, or a date for nearby
            context.
          </p>
        )}
    </dialog>
  );
}

export type SearchHandle = { open: () => void; close: () => void };

/** Opening a dialog must not rebuild the underlying gallery or timeline. */
export function SearchLayer({
  ref,
  ...props
}: ComponentProps<typeof Search> & { ref: Ref<SearchHandle> }) {
  const [open, setOpen] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [],
  );
  return open ? (
    <Search
      {...props}
      close={() => {
        setOpen(false);
        props.close();
      }}
    />
  ) : null;
}
