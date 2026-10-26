import { memo, type KeyboardEvent, type PointerEvent } from 'react';

import { DESIGN_WIDTH } from '../layout/constants.ts';
import type { RibbonPaint } from './ribbonInk.ts';

function onKey(
  event: KeyboardEvent<SVGPathElement>,
  id: string,
  onSelect?: (id: string) => void,
) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  onSelect?.(id);
}

function RibbonView({
  ribbon,
  dimmed = false,
  onSelect,
  onHover,
  onLeave,
}: {
  ribbon: RibbonPaint;
  dimmed?: boolean;
  onSelect?: (id: string) => void;
  onHover?: (ribbon: RibbonPaint, x: number, y: number) => void;
  onLeave?: (event: PointerEvent<SVGPathElement>) => void;
}) {
  return (
    <g className={dimmed ? 'ribbon ribbon-dim' : 'ribbon'} data-polity={ribbon.id}>
      <path
        className="ribbon-body"
        d={ribbon.d}
        fill={ribbon.fill}
        stroke={ribbon.edge}
      />
      {ribbon.fadePx > 0 ? (
        <rect
          className="ribbon-fade"
          x={0}
          y={ribbon.y0}
          width={DESIGN_WIDTH}
          height={ribbon.fadePx}
          fill={`url(#${ribbon.gradientId})`}
          clipPath={`url(#${ribbon.gradientId}-clip)`}
        />
      ) : null}
      {ribbon.dashPath ? (
        <path
          className="ribbon-uncertain"
          d={ribbon.dashPath}
          fill="none"
          stroke={ribbon.edge}
          strokeDasharray={ribbon.dashArray}
        />
      ) : null}
      <path
        className="ribbon-hit"
        d={ribbon.d}
        tabIndex={0}
        role="button"
        aria-label={ribbon.ariaLabel}
        onClick={() => onSelect?.(ribbon.id)}
        onKeyDown={(event) => onKey(event, ribbon.id, onSelect)}
        onPointerEnter={(event) => onHover?.(ribbon, event.clientX, event.clientY)}
        onPointerMove={(event) => onHover?.(ribbon, event.clientX, event.clientY)}
        onPointerLeave={(event) => onLeave?.(event)}
      />
    </g>
  );
}

export const Ribbon = memo(RibbonView);
