import { confidenceGlyph, verificationClass } from '../state/focusTip.ts';
import { useFocus } from '../state/focus.ts';

export function Tooltip() {
  const tip = useFocus();
  if (!tip.active) return null;
  return (
    <div
      className="ribbon-tip"
      role="tooltip"
      style={{ left: tip.x + 12, top: tip.y + 12 }}
    >
      <span className={`verify-dot ${verificationClass(tip.verification)}`} />
      <span className="ribbon-tip-name">{tip.name}</span>
      <span className="ribbon-tip-dates">{tip.dates}</span>
      <span className="confidence-glyph" aria-label={tip.confidence}>
        {confidenceGlyph(tip.confidence)}
      </span>
    </div>
  );
}
