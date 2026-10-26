export function ZoomBar({
  onIn,
  onOut,
  onFit,
  onOverview,
}: {
  onIn: () => void;
  onOut: () => void;
  onFit: () => void;
  onOverview: () => void;
}) {
  return (
    <div className="zoom-bar">
      <button type="button" aria-label="Zoom in" onClick={onIn}>
        +
      </button>
      <button type="button" aria-label="Zoom out" onClick={onOut}>
        −
      </button>
      <button type="button" aria-label="Fit width" onClick={onFit}>
        Fit
      </button>
      <button type="button" aria-label="Overview" onClick={onOverview}>
        Overview
      </button>
    </div>
  );
}
