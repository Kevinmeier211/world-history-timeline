import { Ribbon } from './Ribbon.tsx';
import { RibbonLabel } from './RibbonLabel.tsx';
import type { LabelPaint, RibbonPaint } from './ribbonInk.ts';

export function Ribbons({
  ribbons,
  labels,
  onSelect,
}: {
  ribbons: readonly RibbonPaint[];
  labels: readonly LabelPaint[];
  onSelect?: (id: string) => void;
}) {
  const faded = ribbons.filter((ribbon) => ribbon.fadePx > 0);
  return (
    <g className="ribbons">
      <defs>
        {faded.map((ribbon) => (
          <g key={ribbon.gradientId}>
            <linearGradient
              id={ribbon.gradientId}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={ribbon.y0}
              x2="0"
              y2={ribbon.y0 + ribbon.fadePx}
            >
              <stop offset="0" stopColor="var(--paper)" stopOpacity="1" />
              <stop offset="1" stopColor="var(--paper)" stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${ribbon.gradientId}-clip`}>
              <path d={ribbon.d} />
            </clipPath>
          </g>
        ))}
      </defs>
      {ribbons.map((ribbon) => (
        <Ribbon key={ribbon.id} ribbon={ribbon} onSelect={onSelect} />
      ))}
      {labels.map((label) => (
        <RibbonLabel key={label.polityId} label={label} />
      ))}
    </g>
  );
}
