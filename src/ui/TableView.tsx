import { useEffect, useMemo, useRef, useState } from 'react';

import { formatYear } from '../lib/years.ts';
import {
  filterTable,
  rowWindow,
  sortTable,
  TABLE_ROW_PX,
  type TableRow,
  type TableSortKey,
} from './table.ts';

const COLUMNS: readonly { key: TableSortKey | 'kind'; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'start', label: 'Starts' },
  { key: 'end', label: 'Ends' },
  { key: 'family', label: 'Family' },
  { key: 'importance', label: 'Importance' },
  { key: 'kind', label: 'Kind' },
];

export function TableView({
  rows,
  onOpen,
}: {
  rows: readonly TableRow[];
  onOpen: (row: TableRow) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<TableSortKey>('start');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);
  const shown = useMemo(
    () => sortTable(filterTable(rows, query), sortKey, sortDir),
    [query, rows, sortDir, sortKey],
  );
  const window = rowWindow(shown.length, scrollTop, height);

  useEffect(() => {
    const port = scroller.current;
    if (!port || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      setHeight(port.clientHeight);
      setScrollTop(port.scrollTop);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(port);
    return () => observer.disconnect();
  }, []);

  const toggle = (key: TableSortKey) => {
    if (sortKey === key) setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="table-view">
      <p className="chart-note">Table view lists the same polities, one row each.</p>
      <input
        className="table-filter"
        type="search"
        aria-label="Filter table"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          if (scroller.current) scroller.current.scrollTop = 0;
          setScrollTop(0);
        }}
      />
      <div
        role="table"
        aria-label="Polities and callouts"
        aria-rowcount={shown.length + 1}
        aria-colcount={COLUMNS.length}
      >
        <div role="row" className="table-row table-head" aria-rowindex={1}>
          {COLUMNS.map((column) => {
            const sortable = column.key !== 'kind';
            const active = sortable && sortKey === column.key;
            return (
              <div
                key={column.key}
                role="columnheader"
                aria-sort={
                  active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
              >
                {sortable ? (
                  <button
                    type="button"
                    onClick={() => toggle(column.key as TableSortKey)}
                  >
                    {column.label}
                  </button>
                ) : (
                  column.label
                )}
              </div>
            );
          })}
        </div>
        <div
          className="table-scroll"
          ref={scroller}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          {shown.length === 0 ? (
            <p className="chart-note">No rows match.</p>
          ) : (
            <div className="table-body" style={{ height: shown.length * TABLE_ROW_PX }}>
              {shown.slice(window.start, window.end).map((row, offset) => {
                const index = window.start + offset;
                return (
                  <div
                    key={`${row.kind}:${row.id}`}
                    role="row"
                    className="table-row"
                    aria-rowindex={index + 2}
                    style={{ top: index * TABLE_ROW_PX }}
                  >
                    <div role="cell">
                      <button type="button" onClick={() => onOpen(row)}>
                        {row.name}
                      </button>
                    </div>
                    <div role="cell">{formatYear(row.start)}</div>
                    <div role="cell">{formatYear(row.end)}</div>
                    <div role="cell">{row.familyName}</div>
                    <div role="cell">{String(row.importance)}</div>
                    <div role="cell">
                      {row.kind === 'polity' ? 'Polity' : 'Callout'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
