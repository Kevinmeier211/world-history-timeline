import type { PictogramName } from './pictograms.ts';
import { localMediaHref } from '../lib/localMedia.ts';
import { Pictogram } from './Pictogram.tsx';

/** Reserved plate box. A local derivative replaces the pictogram. Nothing is hotlinked. */
export function Plate({
  id,
  x,
  y,
  width,
  height,
  name,
  icon,
  href,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: PictogramName;
  icon: number;
  href?: string;
}) {
  const local = localMediaHref(href);
  const iconSize = Math.max(1, Math.min(icon, width, height));
  return (
    <g data-plate={id} data-lazy="viewport" transform={`translate(${x} ${y})`}>
      <rect
        className="callout-plate plate-reserve"
        width={width}
        height={height}
        rx={2}
      />
      {local ? (
        <image
          className="plate-image"
          href={local}
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <g
          transform={`translate(${(width - iconSize) / 2} ${(height - iconSize) / 2})`}
        >
          <Pictogram name={name} size={iconSize} />
        </g>
      )}
    </g>
  );
}
