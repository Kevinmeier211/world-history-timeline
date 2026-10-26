import { LEFT_GUTTER, PLOT_WIDTH } from '../layout/constants.ts';
import { yOfYear } from '../layout/drift.ts';
import { formatYear } from '../lib/years.ts';
import { placeMilestones, type Milestone } from '../state/milestones.ts';

const BOX_W = 168;
const BOX_H = 22;
const BOX_GAP = 4;

export function MilestoneMarks({ marks }: { marks: readonly Milestone[] }) {
  const placed = placeMilestones(marks);
  const x = LEFT_GUTTER + PLOT_WIDTH - BOX_W - 12;
  return (
    <g className="milestones">
      {placed.map((mark) => {
        const y = yOfYear(mark.year) - (mark.stack + 1) * (BOX_H + BOX_GAP);
        return (
          <g
            key={mark.id}
            role="img"
            aria-label={`${mark.label}, ${formatYear(mark.year)}`}
          >
            <rect
              className="milestone-box"
              x={x}
              y={y}
              width={BOX_W}
              height={BOX_H}
              fill="none"
              stroke="currentColor"
              strokeDasharray="4 3"
            />
            <text className="milestone-label" x={x + 6} y={y + 15}>
              {mark.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
