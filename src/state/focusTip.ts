import type { Confidence, Verification } from '../data/schema/primitives.ts';

/** A mark that is not color alone. Approximate dates already carry "c." in the range. */
export function confidenceGlyph(confidence: Confidence): string {
  if (confidence === 'secure') return '●';
  if (confidence === 'conventional') return '○';
  if (confidence === 'approximate') return 'c.';
  return '?';
}

export function verificationClass(verification: Verification): string {
  if (verification === 'cross-checked') return 'verify-cross';
  if (verification === 'primary-checked') return 'verify-primary';
  return 'verify-unverified';
}

/** Other lineages fade. The focused family, and an empty focus, stay solid. */
export function ribbonDimmed(
  ribbonFamily: string,
  focusFamily: string | null,
): boolean {
  return focusFamily !== null && focusFamily !== ribbonFamily;
}
