import { Plate } from './Plate.tsx';
import { Pictogram } from './Pictogram.tsx';
import {
  calloutBlurb,
  calloutType,
  textLengthFor,
  type CalloutViewModel,
} from './calloutView.ts';

function FittedText({
  text,
  x,
  y,
  width,
  fontSize,
  className,
}: {
  text: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  className: string;
}) {
  const length = textLengthFor(text, fontSize, width);
  return (
    <text
      className={className}
      x={x}
      y={y}
      fontSize={fontSize}
      textLength={length}
      lengthAdjust={length === undefined ? undefined : 'spacingAndGlyphs'}
      dominantBaseline="hanging"
    >
      {text}
    </text>
  );
}

/** Year tag, title, blurb, and a pictogram or a reserved plate, with a leader. */
export function Callout({ model }: { model: CalloutViewModel }) {
  const blurb = calloutBlurb(model.blurb);
  const type = calloutType(model.importance);
  const label = `${model.title}, ${model.yearLabel}. ${blurb}`;
  if (model.marker) {
    return (
      <g className="callout" data-callout={model.id} data-callout-marker="true">
        <circle
          className="callout-marker"
          cx={model.x + model.width / 2}
          cy={model.y + model.height / 2}
          r={Math.min(model.width, model.height) / 2}
          role="img"
          aria-label={label}
        />
      </g>
    );
  }
  const icon = model.plate ? 0 : type.icon;
  const textX = model.x + 6 + icon + (icon > 0 ? 4 : 0);
  const textW = Math.max(8, model.x + model.width - 6 - textX);
  return (
    <g className="callout" data-callout={model.id}>
      {model.leader ? (
        <line
          className="callout-leader"
          data-leader={model.id}
          x1={model.leader.x1}
          y1={model.leader.y1}
          x2={model.leader.x2}
          y2={model.leader.y2}
        />
      ) : null}
      <g data-callout-card={model.id} role="img" aria-label={label}>
        <rect
          className="callout-card"
          x={model.x}
          y={model.y}
          width={model.width}
          height={model.height}
          strokeWidth={type.rule}
          rx={2}
        />
        <clipPath id={`callout-clip-${model.id}`}>
          <rect x={model.x} y={model.y} width={model.width} height={model.height} />
        </clipPath>
        <g clipPath={`url(#callout-clip-${model.id})`}>
          {icon > 0 ? (
            <g
              transform={`translate(${model.x + 6} ${model.y + (model.height - icon) / 2})`}
            >
              <Pictogram name={model.pictogram} size={icon} />
            </g>
          ) : null}
          <FittedText
            className="callout-year"
            text={model.yearLabel}
            x={textX}
            y={model.y + 4}
            width={textW}
            fontSize={type.body}
          />
          <FittedText
            className="callout-title"
            text={model.title}
            x={textX}
            y={model.y + 16}
            width={textW}
            fontSize={type.title}
          />
          <FittedText
            className="callout-blurb"
            text={blurb}
            x={textX}
            y={model.y + 16 + type.title + 1}
            width={textW}
            fontSize={type.body}
          />
        </g>
      </g>
      {model.plate ? (
        <Plate
          id={model.id}
          x={model.plate.x}
          y={model.plate.y}
          width={model.plate.width}
          height={model.plate.height}
          name={model.pictogram}
          icon={type.icon}
        />
      ) : null}
    </g>
  );
}
