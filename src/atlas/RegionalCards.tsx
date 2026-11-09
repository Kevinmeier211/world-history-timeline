import { formatYear } from '../lib/years';
import { coverageGap, nearbyDateLabel } from './chronology';
import { ComparePinButton, type ComparePinControls } from './ComparisonPins';
import { explorationObject } from './exploration';
import { ObjectImage } from './MediaFigure';
import type { Region, RuntimeCorpus, Subject } from './model';

export function RegionalCards({
  corpus,
  year,
  rows,
  cards,
  selected,
  previewSubject,
  pins,
}: {
  corpus: RuntimeCorpus;
  year: number;
  rows: { region: Region; status: 'supported-frame' | 'frame-gap' }[];
  cards: Subject[];
  selected?: string;
  previewSubject: (id: string) => void;
  pins?: ComparePinControls;
}) {
  return (
    <section className="meanwhile-stories" aria-label="Regional starting points">
      <div className="meanwhile-stories-heading">
        <h2>Elsewhere in the world</h2>
        <p>Each case and image keeps its own dates.</p>
      </div>
      <div className="meanwhile-cards">
        {rows.map(({ region, status }) => {
          const subject = cards.find((card) => card.region === region);
          if (!subject) {
            const hasFrame = status === 'supported-frame';
            return (
              <article
                className={
                  hasFrame ? 'meanwhile-coverage' : 'meanwhile-coverage coverage-gap'
                }
                key={region}
                data-region={region}
              >
                <h3>{region}</h3>
                <p>{hasFrame ? 'Wider historical frame available.' : coverageGap}</p>
              </article>
            );
          }
          const object = explorationObject(subject, corpus.media);
          const nearby = nearbyDateLabel(subject.interval, year);
          return (
            <div className="meanwhile-card-cell" key={region} data-region={region}>
              <button
                className="meanwhile-card"
                data-region={region}
                data-subject={subject.id}
                aria-pressed={subject.id === selected}
                onClick={() => previewSubject(subject.id)}
              >
                {object && (
                  <span className="meanwhile-card-image">
                    <ObjectImage object={object} thumb fallbackControls={false} />
                  </span>
                )}
                <span className="meanwhile-card-copy">
                  <span className="eyebrow">{region}</span>
                  <strong>{subject.name}</strong>
                  <span>{subject.question}</span>
                  <small>
                    {nearby
                      ? `Nearby reading · ${nearby}`
                      : `Case spans ${formatYear(year)}`}
                  </small>
                  <small>Case: {subject.interval.label}</small>
                  {object && <small>Pictured: {object.date.label}</small>}
                </span>
              </button>
              {pins && <ComparePinButton subject={subject} pins={pins} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
