import { useEffect, useMemo } from 'react';

import families from '../data/families.json';
import { clientDataset } from '../data/clientDataset.ts';
import { formatYear } from '../lib/years.ts';
import { eraAt, politiesInEra } from './eraReading.ts';
import { POSTER_ERAS } from './frame.ts';
import { useRestoreFocus } from './restoreFocus.ts';

export function EraReading({
  open,
  year,
  onOpen,
  onClose,
}: {
  open: boolean;
  year: number;
  onOpen: (id: string, start: number) => void;
  onClose: () => void;
}) {
  const panel = useRestoreFocus<HTMLDivElement>(open);
  const era = eraAt(year, POSTER_ERAS);
  const rows = useMemo(
    () => politiesInEra(clientDataset().polities, families, era),
    [era],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !era) return null;
  return (
    <div
      className="columns-pop era-sheet"
      id="era-panel"
      role="region"
      aria-label="Era reading"
      ref={panel}
    >
      <div className="legend-head">
        <h2>{era.name}</h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <p className="story-step">{`${formatYear(era.start)} – ${formatYear(era.end)}`}</p>
      <ul className="era-cards">
        {rows.map((row) => (
          <li key={row.id}>
            <button type="button" onClick={() => onOpen(row.id, row.start)}>
              {row.name}
            </button>
            <span className="story-step">
              {`${formatYear(row.start)} – ${formatYear(row.end)}, ${row.familyName}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
