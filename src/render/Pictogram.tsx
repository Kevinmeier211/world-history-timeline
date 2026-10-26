import {
  PICTOGRAM_STROKE,
  PICTOGRAM_VIEW,
  PICTOGRAMS,
  type PictogramName,
} from './pictograms.ts';

/** One line icon from the in-house set. Stroke stays 1.5px on screen. */
export function Pictogram({
  name,
  size = PICTOGRAM_VIEW,
}: {
  name: PictogramName;
  size?: number;
}) {
  return (
    <svg
      className="pictogram"
      viewBox={`0 0 ${PICTOGRAM_VIEW} ${PICTOGRAM_VIEW}`}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d={PICTOGRAMS[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth={PICTOGRAM_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
