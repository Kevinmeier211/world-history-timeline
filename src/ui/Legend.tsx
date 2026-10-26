import { useEffect } from 'react';

import families from '../data/families.json';
import { READING_KEY } from './reading.ts';

export interface LegendFamily {
  id: string;
  name: string;
  color: string;
}

export function legendFamilies(): LegendFamily[] {
  return families.map((family) => ({
    id: family.id,
    name: family.name,
    color: family.color,
  }));
}

export function Legend({
  families: rows,
  onClose,
}: {
  families: readonly LegendFamily[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="legend-layer">
      <button
        type="button"
        className="legend-backdrop"
        aria-label="Close reading key"
        onClick={onClose}
      />
      <div
        className="legend-pop"
        id="reading-key"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reading-title"
        tabIndex={-1}
      >
        <div className="legend-head">
          <h2 id="reading-title">How to read this</h2>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <ul className="legend-points">
          {READING_KEY.map((point) => (
            <li key={point.id}>
              <strong>{point.title}. </strong>
              {point.body}
            </li>
          ))}
        </ul>
        <h3>Lineages</h3>
        <ul className="legend-families">
          {rows.map((family) => (
            <li key={family.id}>
              <span
                className="legend-swatch"
                style={{ backgroundColor: family.color }}
              />
              {family.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
