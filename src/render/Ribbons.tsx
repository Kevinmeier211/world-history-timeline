import type { PointerEvent } from 'react';

import { useFocus } from '../state/focus.ts';
import { ribbonDimmed } from '../state/focusTip.ts';
import { Ribbon } from './Ribbon.tsx';
import { RibbonLabel } from './RibbonLabel.tsx';
import type { LabelPaint, RibbonPaint } from './ribbonInk.ts';

export function Ribbons({
  ribbons,
  labels,
  selectedId,
  onSelect,
  opacity = 1,
}: {
  ribbons: readonly RibbonPaint[];
  labels: readonly LabelPaint[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  opacity?: number;
}) {
  const focusFamily = useFocus((state) => (state.active ? state.familyId : null));
  const show = useFocus((state) => state.show);
  const hide = useFocus((state) => state.hide);
  const faded = ribbons.filter((ribbon) => ribbon.fadePx > 0);
  const leave = (event: PointerEvent<SVGPathElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Element && next.closest('.ribbon-hit')) return;
    hide();
  };
  return (
    <g className="ribbons" opacity={opacity}>
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
        <Ribbon
          key={ribbon.id}
          ribbon={ribbon}
          dimmed={ribbonDimmed(ribbon.familyId, focusFamily)}
          selected={ribbon.id === selectedId}
          onSelect={onSelect}
          onHover={(item, x, y) =>
            show({
              polityId: item.id,
              familyId: item.familyId,
              name: item.name,
              dates: item.dates,
              confidence: item.confidence,
              verification: item.verification,
              x,
              y,
            })
          }
          onLeave={leave}
        />
      ))}
      {labels.map((label) => (
        <RibbonLabel key={label.polityId} label={label} />
      ))}
    </g>
  );
}
