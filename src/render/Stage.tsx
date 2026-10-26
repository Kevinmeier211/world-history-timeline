import type { Camera, Size, WorldBox } from '../camera/camera.ts';
import { Guides } from './Guides.tsx';
import { Watermark } from './Watermark.tsx';
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
      role="img"
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
