declare module 'culori' {
  export type Color = string | { mode: string };

  export function parse(color: string): { mode: string } | undefined;

  export function differenceCiede2000(): (a: Color, b: Color) => number;

  export function wcagContrast(a: string, b: string): number;

  export function filterDeficiencyDeuter(severity?: number): (color: Color) => Color;

  export function filterDeficiencyProt(severity?: number): (color: Color) => Color;

  export function filterDeficiencyTrit(severity?: number): (color: Color) => Color;
}
