import { CROP_MARK_PT, cropSegments } from './crop.ts';

/** Corner marks for the 24×36 bleed sheet. The viewBox is inches. */
export function CropMarks({
  paperWidthIn,
  paperHeightIn,
  trimWidthIn,
  trimHeightIn,
}: {
  paperWidthIn: number;
  paperHeightIn: number;
  trimWidthIn: number;
  trimHeightIn: number;
}) {
  const lines = cropSegments(paperWidthIn, paperHeightIn, trimWidthIn, trimHeightIn);
  return (
    <svg
      className="crop-marks"
      viewBox={`0 0 ${paperWidthIn} ${paperHeightIn}`}
      aria-hidden="true"
    >
      {lines.map((line) => (
        <line
          key={`${line.x1}-${line.y1}-${line.x2}-${line.y2}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="currentColor"
          strokeWidth={CROP_MARK_PT / 72}
        />
      ))}
    </svg>
  );
}
