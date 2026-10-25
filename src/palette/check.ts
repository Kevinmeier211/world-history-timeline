import {
  differenceCiede2000,
  filterDeficiencyDeuter,
  filterDeficiencyProt,
  filterDeficiencyTrit,
  parse,
  wcagContrast,
  type Color,
} from 'culori';

export interface PaletteFamily {
  id: string;
  color: string;
  xZones: readonly string[];
}

export interface PaletteTheme {
  name: string;
  ink: string;
  paper: string;
}

export interface PaletteIssue {
  kind: 'deltaE' | 'contrast';
  message: string;
}

const deltaE = differenceCiede2000();
const simulations = {
  normal: (color: Color) => color,
  deuteranopia: filterDeficiencyDeuter(1),
  protanopia: filterDeficiencyProt(1),
  tritanopia: filterDeficiencyTrit(1),
} as const;

function mustParse(color: string): Color {
  const parsed = parse(color);
  if (!parsed) throw new Error(`Unreadable color ${color}`);
  return parsed;
}

export const MIN_DELTA_E = 12;
export const MIN_CONTRAST = 4.5;

export function sharesZone(a: PaletteFamily, b: PaletteFamily): boolean {
  return a.xZones.some((zone) => b.xZones.includes(zone));
}

export function pairDeltaE(
  a: string,
  b: string,
  mode: keyof typeof simulations = 'normal',
): number {
  const simulate = simulations[mode];
  return deltaE(simulate(mustParse(a)), simulate(mustParse(b)));
}

export function bestContrast(
  color: string,
  theme: PaletteTheme,
): { ink: string; ratio: number } {
  const onInk = wcagContrast(color, theme.ink);
  const onPaper = wcagContrast(color, theme.paper);
  return onInk >= onPaper
    ? { ink: theme.ink, ratio: onInk }
    : { ink: theme.paper, ratio: onPaper };
}

export function paletteIssues(
  families: readonly PaletteFamily[],
  themes: readonly PaletteTheme[],
): PaletteIssue[] {
  const issues: PaletteIssue[] = [];
  for (let i = 0; i < families.length; i += 1) {
    const left = families[i];
    if (!left) continue;
    for (const theme of themes) {
      const contrast = bestContrast(left.color, theme);
      if (contrast.ratio < MIN_CONTRAST) {
        issues.push({
          kind: 'contrast',
          message: `${left.id} on ${theme.name} reaches only ${contrast.ratio.toFixed(2)}:1`,
        });
      }
    }
    for (let j = i + 1; j < families.length; j += 1) {
      const right = families[j];
      if (!right || !sharesZone(left, right)) continue;
      for (const mode of Object.keys(simulations) as (keyof typeof simulations)[]) {
        const distance = pairDeltaE(left.color, right.color, mode);
        if (distance < MIN_DELTA_E) {
          issues.push({
            kind: 'deltaE',
            message: `${left.id} vs ${right.id} ${mode} ΔE ${distance.toFixed(2)} < ${MIN_DELTA_E}`,
          });
        }
      }
    }
  }
  return issues;
}

export function paletteMatrix(families: readonly PaletteFamily[]): string[] {
  const lines: string[] = [];
  for (let i = 0; i < families.length; i += 1) {
    const left = families[i];
    if (!left) continue;
    for (let j = i + 1; j < families.length; j += 1) {
      const right = families[j];
      if (!right || !sharesZone(left, right)) continue;
      const cells = (Object.keys(simulations) as (keyof typeof simulations)[])
        .map(
          (mode) =>
            `${mode.slice(0, 3)} ${pairDeltaE(left.color, right.color, mode).toFixed(1)}`,
        )
        .join('  ');
      lines.push(`${left.id} × ${right.id}: ${cells}`);
    }
  }
  return lines;
}
