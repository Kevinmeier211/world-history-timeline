import { useRef, useState } from 'react';
import { formatYear } from '../lib/years';
import {
  coverageGap,
  distanceFromInterval,
  includesYear,
  nearbyDateLabel,
  nearbyYearLimit,
} from './chronology';
import { ComparePinButton, type ComparePinControls } from './ComparisonPins';
import { explorationObject, regionalStartingPoints } from './exploration';
import { intervalKind } from './interval-kind';
import { ObjectImage } from './MediaFigure';
import {
  regions,
  type HistoricalContext,
  type RuntimeCorpus,
  type Subject,
} from './model';
import type { Location } from './navigation';
import { TimelineCaseMarks } from './TimelineCaseMarks';
import {
  FrameNotes,
  TimelineFrames,
  TimelineGrid,
  type TimelineAxis,
} from './TimelineFrames';

export function LivingTimelineChart({
  corpus,
  available,
  axis,
  location,
  year,
  selected,
  openSubject,
  previewSubject,
  pins,
}: {
  corpus: RuntimeCorpus;
  available: Subject[];
  axis: TimelineAxis;
  location: Location;
  year: number;
  selected?: Subject;
  openSubject: (subject: Subject) => void;
  previewSubject: (id: string) => void;
  pins?: ComparePinControls;
}) {
  const [showAll, setShowAll] = useState(false);
  const [frameNotes, setFrameNotes] = useState<HistoricalContext[] | null>(null);
  const frameTrigger = useRef<HTMLButtonElement>(null);
  const starting = regionalStartingPoints(available, year);
  const rows = regions
    .filter((region) => location.region === 'all' || location.region === region)
    .map((region) => {
      const active = available
        .filter(
          (subject) =>
            subject.region === region && includesYear(subject.interval, year),
        )
        .sort(
          (a, b) =>
            (a.interval.start ?? a.interval.end!) -
            (b.interval.start ?? b.interval.end!),
        );
      const near =
        selected?.region === region &&
        distanceFromInterval(selected.interval, year) <= nearbyYearLimit
          ? selected
          : starting.find((subject) => subject.region === region);
      const cases =
        location.scale !== 'local' && active.length
          ? active.slice(0, 4)
          : near
            ? [near]
            : [];
      const frames = corpus.contexts?.filter((frame) => frame.region === region) ?? [];
      return {
        region,
        cases,
        frames,
        covered:
          cases.length > 0 ||
          frames.some((frame) => includesYear(frame.interval, year)),
      };
    });
  const caseCount = rows.reduce((count, row) => count + row.cases.length, 0);
  const renderCase = (subject: Subject) => (
    <div key={subject.id} className="living-case">
      <LivingCaseTrack
        subject={subject}
        corpus={corpus}
        year={year}
        axis={axis}
        selected={subject.id === selected?.id}
        previewSubject={previewSubject}
      />
      {pins && <ComparePinButton subject={subject} pins={pins} />}
    </div>
  );
  return (
    <section
      className="living-chart"
      aria-label="Case studies and wider frames on a proportional time axis"
    >
      <div className="living-axis">
        <span>Places &amp; people</span>
        <div>
          {axis.ticks.map((tick) => (
            <span key={tick} style={{ left: `${axis.position(tick)}%` }}>
              {formatYear(tick)}
            </span>
          ))}
        </div>
      </div>
      {showAll
        ? available.map(renderCase)
        : rows.map(({ region, cases, frames, covered }) => (
            <section key={region} className="living-region" data-region={region}>
              <h2>{region}</h2>
              {covered ? (
                <>
                  <TimelineFrames
                    frames={frames}
                    year={year}
                    axis={axis}
                    openNotes={(notes, trigger) => {
                      frameTrigger.current = trigger;
                      setFrameNotes(notes);
                    }}
                  />
                  {cases.map(renderCase)}
                </>
              ) : (
                <p className="living-coverage coverage-gap" data-region={region}>
                  {coverageGap}
                </p>
              )}
            </section>
          ))}
      <div className="living-legend">
        <p>The vertical line marks {formatYear(year)}.</p>
        <ul aria-label="Timeline legend">
          <li className="legend-frame">Wider frame</li>
          <li className="legend-case">Case study</li>
          <li className="legend-approximate">Approximate dates</li>
          <li className="legend-gap">Not yet covered</li>
        </ul>
      </div>
      {available.length > caseCount && (
        <button
          className="living-show-all"
          aria-expanded={showAll}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll
            ? 'Show regional starting points'
            : `Browse all ${available.length} case studies in this view`}
        </button>
      )}
      <FrameNotes
        corpus={corpus}
        frames={frameNotes}
        openSubject={(subject) => {
          frameTrigger.current = null;
          openSubject(subject);
        }}
        close={() => {
          frameTrigger.current?.focus({ preventScroll: true });
          frameTrigger.current = null;
          setFrameNotes(null);
        }}
      />
    </section>
  );
}

function LivingCaseTrack({
  subject,
  corpus,
  axis,
  year,
  selected,
  previewSubject,
}: {
  subject: Subject;
  corpus: RuntimeCorpus;
  axis: TimelineAxis;
  year: number;
  selected: boolean;
  previewSubject: (id: string) => void;
}) {
  const object = explorationObject(subject, corpus.media);
  const kind = intervalKind(subject.interval);
  const { precision } = subject.interval;
  const nearby = nearbyDateLabel(subject.interval, year);
  return (
    <button
      className="living-track"
      data-subject={subject.id}
      data-region={subject.region}
      aria-pressed={selected}
      onClick={() => previewSubject(subject.id)}
    >
      <span className="living-label">
        {object && (
          <span className="living-thumb">
            <ObjectImage
              object={object}
              thumb
              fallbackControls={false}
              description=""
            />
          </span>
        )}
        <span>
          <small>{subject.region}</small>
          <strong>{subject.name}</strong>
          <small>
            {subject.interval.label}
            {precision === 'disputed' && <span aria-hidden="true"> ?</span>}
            <span className="sr-only">. Date precision: {precision}.</span>
            {kind === 'open-ended' && (
              <span className="sr-only"> No end date assigned.</span>
            )}
          </small>
          {kind === 'undated' && (
            <small className="undated-chip">Undated: chronology under revision</small>
          )}
          {nearby && <small>Nearby reading · {nearby}</small>}
        </span>
      </span>
      <span className="living-duration" aria-hidden="true">
        <TimelineGrid axis={axis} />
        <TimelineCaseMarks interval={subject.interval} axis={axis} year={year} />
      </span>
    </button>
  );
}
