/**
 * Ribbon label fitting. A fake measurer is injected in tests. The canvas
 * measurer is for the browser, where Barlow Condensed is the ribbon face.
 */

export interface TextMeasurer {
  /** Advance width of `text` at `fontSize`, in design px. */
  measure(text: string, fontSize: number): number;
}

export interface LabelBox {
  /** Ribbon box width in design px. */
  w: number;
  /** Ribbon box height in design px. */
  h: number;
}

export interface FittedLabel {
  text: string;
  /** Font size in design px, from 10 to 15. */
  size: number;
  orient: 'rotated' | 'horizontal';
  /** True when the drawn text ends in an ellipsis. */
  truncated: boolean;
}

const MIN_SIZE = 10;
const MAX_SIZE = 15;
const PAD = 8;
const ELLIPSIS = '…';

function sizesFor(thickness: number): number[] {
  const start = Math.floor(Math.min(MAX_SIZE, 0.62 * thickness));
  const sizes: number[] = [];
  for (let size = start; size >= MIN_SIZE; size -= 1) sizes.push(size);
  return sizes;
}

function candidates(name: string, shortName: string | undefined): string[] {
  const texts = [name.trim()];
  const short = shortName?.trim() ?? '';
  if (short && short !== texts[0]) texts.push(short);
  return texts.filter((text) => text.length > 0);
}

function ellipsize(text: string, limit: number, measure: TextMeasurer): string | null {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  let chosen: string | null = null;
  for (let count = 1; count < words.length; count += 1) {
    const candidate = `${words.slice(0, count).join(' ')}${ELLIPSIS}`;
    if (measure.measure(candidate, MIN_SIZE) > limit) break;
    chosen = candidate;
  }
  return chosen;
}

/**
 * Fit a ribbon label inside `box`. Rotation follows Appendix G. The full name
 * is tried at every size before the short name. A word-boundary ellipsis is
 * the last drawn form. Null means the label is hover-only.
 */
export function labelFit(
  name: string,
  shortName: string | undefined,
  box: LabelBox,
  measure: TextMeasurer,
): FittedLabel | null {
  const orient: FittedLabel['orient'] = box.h >= 1.4 * box.w ? 'rotated' : 'horizontal';
  const thickness = orient === 'rotated' ? box.w : box.h;
  const length = orient === 'rotated' ? box.h : box.w;
  const limit = length - PAD;
  if (limit <= 0) return null;
  const texts = candidates(name, shortName);
  const sizes = sizesFor(thickness);
  for (const text of texts) {
    for (const size of sizes) {
      if (measure.measure(text, size) <= limit) {
        return { text, size, orient, truncated: false };
      }
    }
  }
  for (const text of texts) {
    const truncated = ellipsize(text, limit, measure);
    if (truncated) return { text: truncated, size: MIN_SIZE, orient, truncated: true };
  }
  return null;
}

/** Browser measurer. A missing canvas, or a zero width, uses half an em. */
export function canvasTextMeasurer(
  fontFamily = '"Barlow Condensed", sans-serif',
): TextMeasurer {
  let context: CanvasRenderingContext2D | null | undefined;
  return {
    measure(text, fontSize) {
      const fallback = text.length * fontSize * 0.5;
      if (typeof document === 'undefined') return fallback;
      if (context === undefined) {
        context = document.createElement('canvas').getContext('2d');
      }
      if (!context) return fallback;
      context.font = `600 ${fontSize}px ${fontFamily}`;
      const width = context.measureText(text).width;
      if (!Number.isFinite(width) || width <= 0) return fallback;
      return width;
    },
  };
}
