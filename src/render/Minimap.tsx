import type { WorldBox } from '../camera/camera.ts';
import { minimapHeight, MINIMAP_WIDTH, viewportRect } from './navigate.ts';
import type { RibbonPaint } from './ribbonInk.ts';

export function Minimap({
  world,
  ribbons,
  scrollTop,
  portHeight,
  scale,
  onJump,
}: {
  world: WorldBox;
  ribbons: readonly RibbonPaint[];
  scrollTop: number;
  portHeight: number;
  scale: number;
  onJump: (fraction: number) => void;
}) {
  const height = minimapHeight(world.width, world.height);
  const view = viewportRect(scrollTop, portHeight, scale, world.height, height);
  return (
    <svg
      className="minimap"
      width={MINIMAP_WIDTH}
      height={height}
      viewBox={`${world.x} ${world.y} ${world.width} ${world.height}`}
      role="button"
      aria-label="Overview map"
      tabIndex={0}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        if (rect.height <= 0) return;
        onJump((event.clientY - rect.top) / rect.height);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onJump(0.5);
      }}
    >
      <rect
        className="minimap-sheet"
        x={world.x}
        y={world.y}
        width={world.width}
        height={world.height}
      />
      {ribbons.map((ribbon) => (
        <path
          key={ribbon.id}
          className="minimap-ribbon"
          d={ribbon.d}
          fill={ribbon.fill}
        />
      ))}
      <rect
        className="minimap-view"
        x={world.x}
        y={world.y + (view.y / height) * world.height}
        width={world.width}
        height={(view.height / height) * world.height}
      />
    </svg>
  );
}
