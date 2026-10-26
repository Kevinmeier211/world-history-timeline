import { fontProblems, type FontRow } from '../pdf/parse.ts';

const ALWAYS = ['chronos', 'outlast', 'why it matters'] as const;

/** Phrases the reference text layer must contain. The colophon probe is checked only when that colophon contains it. */
export function referenceTextProblems(text: string, colophon: string): string[] {
  const lower = text.toLowerCase();
  const problems = ALWAYS.filter((phrase) => !lower.includes(phrase)).map(
    (phrase) => `pdftotext did not find ${phrase}`,
  );
  const probe = 'No image files are shipped.';
  if (colophon.includes(probe) && !text.includes(probe)) {
    problems.push(`pdftotext did not find ${probe}`);
  }
  return problems;
}

/** Fail when a requested shipped family is absent. Names are whatever pdffonts printed. */
export function referenceFontProblems(
  rows: readonly FontRow[],
  needles: readonly string[],
): string[] {
  const problems = fontProblems(rows);
  for (const needle of needles) {
    if (!rows.some((row) => row.name.includes(needle))) {
      problems.push(`pdffonts did not list a name containing ${needle}`);
    }
  }
  return problems;
}
