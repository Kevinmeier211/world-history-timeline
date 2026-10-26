import { watermarkD } from './watermark.generated.ts';

/** Faint land, drawn in design px. Opacity and multiply live in the stylesheet. */
export function Watermark() {
  return (
    <g className="watermark">
      <path d={watermarkD} />
    </g>
  );
}
