import {
  AXIS_END,
  AXIS_START,
  LEFT_GUTTER,
  PLOT_WIDTH,
  RIGHT_GUTTER,
} from '../layout/constants.ts';
import { yOfYear } from '../layout/drift.ts';
import { formatYear } from '../lib/years.ts';
import { POSTER_ERAS } from '../ui/frame.ts';
import { axisMarks } from './axis.ts';

const PLOT_RIGHT = LEFT_GUTTER + PLOT_WIDTH;

export function Guides({ scale }: { scale: number }) {
  const marks = axisMarks(scale);
  const labelSet = new Set(marks.labels);
  return (
    <g className="guides">
      {POSTER_ERAS.map((era, index) => {
        const y0 = yOfYear(era.start);
        const y1 = yOfYear(era.end);
        const mid = (y0 + y1) / 2;
        const left = LEFT_GUTTER / 2;
        const right = PLOT_RIGHT + RIGHT_GUTTER / 2;
        return (
          <g key={era.id}>
            <rect
              className={index % 2 === 0 ? 'era-band' : 'era-band era-band-quiet'}
              x={0}
              y={y0}
              width={PLOT_RIGHT + RIGHT_GUTTER}
              height={Math.max(0, y1 - y0)}
            />
            <text
              className="era-name"
              x={left}
              y={mid}
              transform={`rotate(-90 ${left} ${mid})`}
            >
              {era.name}
            </text>
            <text
              className="era-name"
              x={right}
              y={mid}
              transform={`rotate(-90 ${right} ${mid})`}
            >
              {era.name}
            </text>
          </g>
        );
      })}
      {marks.ticks.map((year) => {
        const y = yOfYear(year);
        const major = year % 500 === 0 || year === AXIS_START || year === AXIS_END;
        return (
          <g key={year}>
            <line
              className={major ? 'grid-major' : 'grid-minor'}
              x1={LEFT_GUTTER}
              x2={PLOT_RIGHT}
              y1={y}
              y2={y}
            />
            {labelSet.has(year) ? (
              <text className="axis-label" x={LEFT_GUTTER + 8} y={y} dy="-4">
                {formatYear(year)}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}
