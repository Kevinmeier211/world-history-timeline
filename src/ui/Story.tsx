import { useEffect } from 'react';

import { useRestoreFocus } from './restoreFocus.ts';
import type { StorySource } from './story.ts';

export interface StoryCard {
  tourTitle: string;
  index: number;
  count: number;
  title: string;
  narrative: string;
  sources: readonly StorySource[];
}

export function Story({
  open,
  tours,
  card,
  onChoose,
  onPrevious,
  onNext,
  onList,
  onClose,
}: {
  open: boolean;
  tours: readonly { id: string; title: string; subtitle?: string }[];
  card: StoryCard | null;
  onChoose: (id: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onList: () => void;
  onClose: () => void;
}) {
  const panel = useRestoreFocus<HTMLDivElement>(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="columns-pop story-pop"
      id="story-panel"
      role="region"
      aria-label="Stories"
      ref={panel}
    >
      <div className="legend-head">
        <h2>Stories</h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
      {card ? (
        <>
          <p className="story-step">{`Stop ${card.index + 1} of ${card.count}`}</p>
          <h3>{card.tourTitle}</h3>
          <h3>{card.title}</h3>
          <p className="story-narrative" aria-live="polite">
            {card.narrative}
          </p>
          {card.sources.length > 0 ? (
            <>
              <h3>Sources</h3>
              <ul className="story-sources">
                {card.sources.map((source) => (
                  <li key={source.id}>
                    {source.url ? (
                      <a href={source.url}>{source.title}</a>
                    ) : (
                      source.title
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <div className="columns-save">
            <button type="button" onClick={onPrevious} disabled={card.index <= 0}>
              Previous stop
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={card.index >= card.count - 1}
            >
              Next stop
            </button>
            <button type="button" onClick={onList}>
              All stories
            </button>
          </div>
        </>
      ) : (
        <ul className="columns-list">
          {tours.map((tour) => (
            <li key={tour.id}>
              <button type="button" onClick={() => onChoose(tour.id)}>
                {tour.title}
              </button>
              {tour.subtitle ? (
                <span className="story-step">{tour.subtitle}</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
