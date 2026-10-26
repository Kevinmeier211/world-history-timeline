import { LEFT_GUTTER, PLOT_WIDTH, RIGHT_GUTTER } from '../layout/constants.ts';
import type { BandHatch, BandPaint } from './bandInk.ts';

const PLOT_RIGHT = LEFT_GUTTER + PLOT_WIDTH;

function HatchDefs({ hatches }: { hatches: ReadonlySet<BandHatch> }) {
  return (
    <defs>
      {hatches.has('horizontal') ? (
        <pattern
          id="band-horizontal"
          width="8"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <line className="band-hatch-line" x1="0" y1="2" x2="8" y2="2" />
        </pattern>
      ) : null}
      {hatches.has('dots') ? (
        <pattern id="band-dots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle className="band-dot" cx="1.5" cy="1.5" r="0.7" />
        </pattern>
      ) : null}
      {hatches.has('collapse') ? (
        <pattern
          id="band-collapse"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line className="band-hatch-line" x1="0" y1="0" x2="0" y2="6" />
        </pattern>
      ) : null}
      {hatches.has('war') ? (
        <pattern
          id="band-war"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <line className="band-hatch-line" x1="0" y1="0" x2="0" y2="6" />
        </pattern>
      ) : null}
    </defs>
  );
}

export function Bands({ bands }: { bands: readonly BandPaint[] }) {
  const hatches = new Set(
    bands.map((band) => band.hatch).filter((hatch) => hatch !== 'none'),
  );
  return (
    <g className="cross-bands">
      <HatchDefs hatches={hatches} />
      {bands.map((band) => {
        const cx = PLOT_RIGHT + RIGHT_GUTTER / 2;
        const cy = band.y + band.height / 2;
        return (
          <g
            key={band.id}
            className={`cross-band cross-band-${band.type}`}
            data-band={band.id}
          >
            <rect
              className="band-wash"
              x={band.x}
              y={band.y}
              width={band.width}
              height={band.height}
            />
            {band.hatch !== 'none' ? (
              <rect
                className="band-hatch"
                x={band.x}
                y={band.y}
                width={band.width}
                height={band.height}
                fill={`url(#band-${band.hatch})`}
              />
            ) : null}
            {band.label ? (
              <text
                className="band-label"
                x={band.rotated ? cx : PLOT_RIGHT + 6}
                y={band.rotated ? cy : band.y + 12}
                textAnchor={band.rotated ? 'middle' : 'start'}
                dominantBaseline={band.rotated ? 'middle' : 'hanging'}
                transform={band.rotated ? `rotate(-90 ${cx} ${cy})` : undefined}
              >
                {band.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}
