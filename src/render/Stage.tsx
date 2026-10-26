import type { Camera, Size, WorldBox } from '../camera/camera.ts';
import { useVisibleSpans } from './useVisibleSpans.ts';
import { VISIBLE_PAD, type YSpan } from './visible.ts';
import './stage.css';

export function Stage({
  camera,
  viewport,
  scale,
  world,
  spans = [],
  padScreens = VISIBLE_PAD,
}: {
  camera: Camera;
  viewport: Size;
  scale: number;
  world: WorldBox;
  spans?: readonly YSpan[];
  padScreens?: number;
}) {
  const shown = useVisibleSpans(camera, viewport, spans, padScreens);
  return (
    <svg
      className="stage"
      viewBox={`${world.x} ${world.y} ${world.width} ${world.height}`}
      width={world.width * scale}
      height={world.height * scale}
      aria-hidden="true"
    >
      <rect
        className="stage-sheet"
        x={world.x}
        y={world.y}
        width={world.width}
        height={world.height}
      />
      {shown.map((span) => (
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
