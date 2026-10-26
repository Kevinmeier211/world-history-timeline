import type { Camera, Size, WorldBox } from '../camera/camera.ts';
import { Connectors } from './Connectors.tsx';
import { Guides } from './Guides.tsx';
import { Ribbons } from './Ribbons.tsx';
import { Watermark } from './Watermark.tsx';
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
  padScreens = VISIBLE_PAD,
  onSelect,
}: {
  camera: Camera;
  viewport: Size;
  scale: number;
  world: WorldBox;
  spans?: readonly YSpan[];
  ribbons?: readonly RibbonPaint[];
  labels?: readonly LabelPaint[];
  connectors?: readonly ConnectorPaint[];
  padScreens?: number;
  onSelect?: (id: string) => void;
}) {
  const windows: YSpan[] = [
    ...spans,
    ...ribbons.map((ribbon) => ({ id: ribbon.id, y0: ribbon.y0, y1: ribbon.y1 })),
    ...connectors.map((connector) => ({
      id: connector.id,
      y0: connector.y0,
      y1: connector.y1,
    })),
  ];
  const shown = useVisibleSpans(camera, viewport, windows, padScreens);
  const shownIds = new Set(shown.map((span) => span.id));
  const extraIds = new Set(spans.map((span) => span.id));
  const drawnRibbons = ribbons.filter((ribbon) => shownIds.has(ribbon.id));
  const drawnLabels = labels.filter((label) => shownIds.has(label.polityId));
  const drawnConnectors = connectors.filter((connector) => shownIds.has(connector.id));
  return (
    <svg
      className="stage"
      viewBox={`${world.x} ${world.y} ${world.width} ${world.height}`}
      width={world.width * scale}
      height={world.height * scale}
      role="group"
      aria-label="States and peoples chart"
    >
      <rect
        className="stage-sheet"
        x={world.x}
        y={world.y}
        width={world.width}
        height={world.height}
      />
      <Guides scale={scale} />
      <Watermark />
      <Connectors connectors={drawnConnectors} />
      <Ribbons ribbons={drawnRibbons} labels={drawnLabels} onSelect={onSelect} />
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
