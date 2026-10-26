import type { CSSProperties } from 'react';

import type { Camera, Size, WorldBox } from '../camera/camera.ts';
import type { Milestone } from '../state/milestones.ts';
import type { LensId } from '../ui/frame.ts';
import { Arcs } from './Arcs.tsx';
import { MilestoneMarks } from './MilestoneMarks.tsx';
import { Bands } from './Bands.tsx';
import { Connectors } from './Connectors.tsx';
import { Guides } from './Guides.tsx';
import { Ribbons } from './Ribbons.tsx';
import { Watermark } from './Watermark.tsx';
import { Callouts } from './Callouts.tsx';
import type { CalloutViewModel } from './calloutView.ts';
import { labelsAtScale, sheetBoost } from './labelScale.ts';
import { lensOpacity } from './lensWeight.ts';
import type { BandPaint } from './bandInk.ts';
import type { ConnectorPaint } from './connectorInk.ts';
import type { LabelPaint, RibbonPaint } from './ribbonInk.ts';
import { useVisibleSpans } from './useVisibleSpans.ts';
import { VISIBLE_PAD, type YSpan } from './visible.ts';
import './stage.css';

export function Stage({
  camera,
  viewport,
  scale,
  world,
  spans = [],
  ribbons = [],
  labels = [],
  connectors = [],
  bands = [],
  callouts = [],
  padScreens = VISIBLE_PAD,
  selectedId,
  onSelect,
  onClear,
  lens = 'all',
  milestones = [],
}: {
  camera: Camera;
  viewport: Size;
  scale: number;
  world: WorldBox;
  spans?: readonly YSpan[];
  ribbons?: readonly RibbonPaint[];
  labels?: readonly LabelPaint[];
  connectors?: readonly ConnectorPaint[];
  bands?: readonly BandPaint[];
  callouts?: readonly CalloutViewModel[];
  padScreens?: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
  onClear?: () => void;
  lens?: LensId;
  milestones?: readonly Milestone[];
}) {
  const windows: YSpan[] = [
    ...spans,
    ...ribbons.map((ribbon) => ({ id: ribbon.id, y0: ribbon.y0, y1: ribbon.y1 })),
    ...connectors.map((connector) => ({
      id: connector.id,
      y0: connector.y0,
      y1: connector.y1,
    })),
    ...bands.map((band) => ({ id: band.id, y0: band.y, y1: band.y + band.height })),
    ...callouts.map((callout) => {
      const top = Math.min(callout.y, callout.plate?.y ?? callout.y);
      const bottom = Math.max(
        callout.y + callout.height,
        callout.plate ? callout.plate.y + callout.plate.height : 0,
      );
      return { id: callout.id, y0: top, y1: bottom };
    }),
  ];
  const shown = useVisibleSpans(camera, viewport, windows, padScreens);
  const shownIds = new Set(shown.map((span) => span.id));
  const extraIds = new Set(spans.map((span) => span.id));
  const drawnRibbons = ribbons.filter((ribbon) => shownIds.has(ribbon.id));
  const drawnLabels = labelsAtScale(
    labels.filter((label) => shownIds.has(label.polityId)),
    scale,
    selectedId,
  );
  const drawnConnectors = connectors.filter((connector) => shownIds.has(connector.id));
  const drawnBands = bands.filter((band) => shownIds.has(band.id));
  const drawnCallouts =
    sheetBoost(scale) >= 2
      ? []
      : callouts.filter((callout) => shownIds.has(callout.id));
  return (
    <svg
      className="stage"
      viewBox={`${world.x} ${world.y} ${world.width} ${world.height}`}
      width={world.width * scale}
      height={world.height * scale}
      role="group"
      aria-label="States and peoples chart"
      style={{ '--sheet-boost': String(sheetBoost(scale)) } as CSSProperties}
    >
      <rect
        className="stage-sheet"
        x={world.x}
        y={world.y}
        width={world.width}
        height={world.height}
        onClick={onClear}
      />
      <Guides scale={scale} />
      <Watermark />
      <Bands bands={drawnBands} lens={lens} />
      <Connectors connectors={drawnConnectors} opacity={lensOpacity(lens, 'polity')} />
      <Ribbons
        ribbons={drawnRibbons}
        labels={drawnLabels}
        selectedId={selectedId}
        onSelect={onSelect}
        opacity={lensOpacity(lens, 'polity')}
      />
      <Callouts callouts={drawnCallouts} />
      <Arcs lens={lens} />
      <MilestoneMarks marks={milestones} />
      {shown
        .filter((span) => extraIds.has(span.id))
        .map((span) => (
          <rect
            key={span.id}
            data-span={span.id}
            x={world.x}
            y={span.y0}
            width={world.width}
            height={Math.max(0, span.y1 - span.y0)}
          />
        ))}
    </svg>
  );
}
