import { includesYear } from './chronology';
import { projectInterval } from './geometry';
import { intervalKind } from './interval-kind';
import type { HistoricalInterval } from './model';
import type { TimelineAxis } from './TimelineFrames';

export function TimelineCaseMarks({
  interval,
  axis,
  year,
}: {
  interval: HistoricalInterval;
  axis: TimelineAxis;
  year: number;
}) {
  const kind = intervalKind(interval);
  if (kind === 'undated') return null;
  const { start, end, precision } = interval;
  const { window } = axis;
  const current = includesYear(interval, year) ? ' spans-year' : '';
  if (kind === 'rival-dates') {
    const dates = [start!, end!].filter(
      (date) => date >= window.start && date <= window.end,
    );
    return dates.length ? (
      dates.map((date) => (
        <span
          key={date}
          className={`living-rival-date${date === year ? current : ''}`}
          style={{ left: `${axis.position(date)}%` }}
        />
      ))
    ) : (
      <OutsideWindow />
    );
  }

  const startsBefore = kind === 'open-ended' && start! < window.start;
  const bar = projectInterval(
    start,
    end,
    startsBefore ? { ...window, start: start! } : window,
  );
  if (!bar) return <OutsideWindow />;
  const fade = ['approximate', 'range', 'disputed'].includes(precision);
  return (
    <span
      className={`living-bar${current}${bar.unknownEnd ? ' living-open-end' : ''}`}
      data-precision={precision}
      style={{
        left: `${bar.left}%`,
        width: bar.unknownEnd ? undefined : `max(3px, ${bar.width}%)`,
      }}
    >
      {fade && !bar.clippedStart && !startsBefore && (
        <span className="living-date-fade fade-start" />
      )}
      {fade && !bar.clippedEnd && !bar.unknownEnd && (
        <span className="living-date-fade fade-end" />
      )}
      {(bar.clippedStart || startsBefore) && <span>‹</span>}
      {bar.clippedEnd && <span className="living-clipped-end">›</span>}
    </span>
  );
}

function OutsideWindow() {
  return <span className="living-outside">Outside this window</span>;
}
