import { useEffect, useId, useRef } from 'react';
import { includesYear } from './chronology';
import { projectInterval } from './geometry';
import type { HistoricalContext, RuntimeCorpus, Subject } from './model';
import { ReferenceFrame } from './ReferenceFrame';

export interface TimelineAxis {
  window: { start: number; end: number };
  ticks: number[];
  position: (year: number) => number;
  line: number;
}

export function TimelineGrid({ axis }: { axis: TimelineAxis }) {
  return (
    <>
      {axis.ticks.map((tick) => (
        <span
          className="living-gridline"
          key={tick}
          style={{ left: `${axis.position(tick)}%` }}
        />
      ))}
      {axis.line >= 0 && axis.line <= 100 && (
        <span className="living-year-line" style={{ left: `${axis.line}%` }} />
      )}
    </>
  );
}

function frameBands(frames: HistoricalContext[], year: number, axis: TimelineAxis) {
  const bands = frames
    .flatMap((frame) => {
      const { start, end } = frame.interval;
      const bar = projectInterval(start, end, axis.window);
      return bar ? [{ frame, bar, active: includesYear(frame.interval, year) }] : [];
    })
    .sort((a, b) => Number(b.active) - Number(a.active) || a.bar.left - b.bar.left);
  const lanes: (typeof bands)[] = [[], [], []];
  const overflow: HistoricalContext[] = [];
  for (const band of bands) {
    const lane = lanes.find((row) =>
      row.every(
        ({ bar }) =>
          bar.left + bar.width < band.bar.left ||
          band.bar.left + band.bar.width < bar.left,
      ),
    );
    if (lane) lane.push(band);
    else overflow.push(band.frame);
  }
  return { lanes: lanes.filter((lane) => lane.length), overflow };
}

export function TimelineFrames({
  frames,
  year,
  axis,
  openNotes,
}: {
  frames: HistoricalContext[];
  year: number;
  axis: TimelineAxis;
  openNotes: (frames: HistoricalContext[], trigger: HTMLButtonElement) => void;
}) {
  const { lanes, overflow } = frameBands(frames, year, axis);
  if (!lanes.length) return null;
  const mobileOverflow = [
    ...lanes
      .slice(1)
      .flat()
      .map(({ frame }) => frame),
    ...overflow,
  ];
  const more = (hidden: HistoricalContext[], mode: string) =>
    hidden.length > 0 && (
      <button
        className={`timeline-frame-more timeline-frame-more-${mode}`}
        aria-haspopup="dialog"
        aria-label={`Show ${hidden.length} more historical frames`}
        onClick={(event) => openNotes(hidden, event.currentTarget)}
      >
        +{hidden.length} more
      </button>
    );
  return (
    <div className="living-frame-grid">
      <div className="timeline-frame-options">
        {more(overflow, 'desktop')}
        {more(mobileOverflow, 'mobile')}
      </div>
      <div className="timeline-frame-lanes">
        {lanes.map((lane, index) => (
          <div className="timeline-frame-lane" key={index}>
            {lane.map(({ frame, bar }) => {
              const title = frame.title.split(':')[0]!;
              return (
                <button
                  key={frame.id}
                  className={`timeline-frame-band${frame.interval.precision === 'exact' ? '' : ' timeline-frame-hatched'}`}
                  data-frame={frame.id}
                  aria-label={`Wider frame: ${title}, ${frame.interval.label}`}
                  aria-haspopup="dialog"
                  style={{ left: `${bar.left}%`, width: `max(3px, ${bar.width}%)` }}
                  onClick={(event) => openNotes([frame], event.currentTarget)}
                >
                  <span className="timeline-frame-label" aria-hidden="true">
                    {title}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FrameNotes({
  corpus,
  frames,
  openSubject,
  close,
}: {
  corpus: RuntimeCorpus;
  frames: HistoricalContext[] | null;
  openSubject: (subject: Subject) => void;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  useEffect(() => {
    if (frames && !dialog.current?.open) dialog.current?.showModal();
  }, [frames]);
  return (
    <dialog
      className="timeline-frame-notes"
      ref={dialog}
      aria-labelledby={title}
      onClose={close}
    >
      <header>
        <h2 id={title}>A wider historical frame</h2>
        <button onClick={() => dialog.current?.close()}>Close frame notes</button>
      </header>
      {frames?.map((frame) => (
        <ReferenceFrame
          key={frame.id}
          frame={frame}
          corpus={corpus}
          openSubject={(subject) => {
            dialog.current?.close();
            openSubject(subject);
          }}
        />
      ))}
    </dialog>
  );
}
