import { memo } from 'react';

import type { LabelPaint } from './ribbonInk.ts';

function LabelView({ label }: { label: LabelPaint }) {
  if (!label.fitted) return null;
  const cx = label.x + label.width / 2;
  const cy = label.y + label.height / 2;
  const rotated = label.orientation === 'rotated';
  const glyphs = rotated ? label.glyphs : undefined;
  return (
    <g className="ribbon-label-wrap" data-label={label.polityId}>
      {label.leader ? (
        <line
          className="ribbon-leader"
          x1={label.leader.x1}
          y1={label.leader.y1}
          x2={label.leader.x2}
          y2={label.leader.y2}
        />
      ) : null}
      {glyphs && glyphs.length > 0 ? (
        <g role="img" aria-label={label.text}>
          {glyphs.map((glyph, index) => (
            <text
              key={`${glyph.char}-${index}`}
              className="ribbon-label"
              x={glyph.x}
              y={glyph.y}
              fontSize={label.fontSize}
              fill={label.fill}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(90 ${glyph.x} ${glyph.y})`}
              aria-hidden="true"
            >
              {glyph.char}
            </text>
          ))}
        </g>
      ) : (
        <text
          className="ribbon-label"
          x={rotated ? cx : label.x}
          y={rotated ? cy : label.y}
          fontSize={label.fontSize}
          fill={label.fill}
          textAnchor={rotated ? 'middle' : 'start'}
          dominantBaseline={rotated ? 'middle' : 'hanging'}
          transform={rotated ? `rotate(90 ${cx} ${cy})` : undefined}
        >
          {label.text}
        </text>
      )}
    </g>
  );
}

export const RibbonLabel = memo(LabelView);
