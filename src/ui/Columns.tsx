import { useEffect } from 'react';

import { columnChoices } from '../layout/columns.ts';

export function Columns({
  open,
  fold,
  pin,
  onFold,
  onPin,
  onClose,
}: {
  open: boolean;
  fold: readonly string[];
  pin: readonly string[];
  onFold: (id: string) => void;
  onPin: (id: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const rows = columnChoices();
  const regions = rows.filter((row) => row.kind === 'region');
  const families = rows.filter((row) => row.kind === 'family');
  return (
    <div className="columns-pop" id="columns-panel" role="region" aria-label="Columns">
      <div className="legend-head">
        <h2>Columns</h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <p className="columns-note">Fold hides a column. Pin shows only what you pin.</p>
      <ColumnList
        title="Regions"
        rows={regions}
        fold={fold}
        pin={pin}
        onFold={onFold}
        onPin={onPin}
      />
      <ColumnList
        title="Families"
        rows={families}
        fold={fold}
        pin={pin}
        onFold={onFold}
        onPin={onPin}
      />
    </div>
  );
}

function ColumnList({
  title,
  rows,
  fold,
  pin,
  onFold,
  onPin,
}: {
  title: string;
  rows: readonly { id: string; name: string }[];
  fold: readonly string[];
  pin: readonly string[];
  onFold: (id: string) => void;
  onPin: (id: string) => void;
}) {
  return (
    <>
      <h3>{title}</h3>
      <ul className="columns-list">
        {rows.map((row) => (
          <li key={row.id}>
            <span>{row.name}</span>
            <button
              type="button"
              aria-pressed={fold.includes(row.id)}
              onClick={() => onFold(row.id)}
            >
              {`Fold ${row.name}`}
            </button>
            <button
              type="button"
              aria-pressed={pin.includes(row.id)}
              onClick={() => onPin(row.id)}
            >
              {`Pin ${row.name}`}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
