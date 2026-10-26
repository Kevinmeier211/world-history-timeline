export interface DesignViolation {
  rule:
    | 'color-literal'
    | 'font-size'
    | 'infinite-animation'
    | 'icon-button-name'
    | 'remote-font';
  file: string;
  line: number;
  message: string;
}

/** Removed in T3.16. Rules themselves do not change. */
export const LEGACY_DESIGN_LINT_ALLOWLIST = [
  'src/App.tsx',
  'src/main.tsx',
  'src/components/',
  'src/styles/app.css',
  'src/utils/',
] as const;

const COLOR_RE =
  /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\s*\(/g;

const FONT_SIZE_RE =
  /font-size\s*:\s*([0-9]*\.?[0-9]+)\s*(px|rem)\b|fontSize\s*:\s*(?:['"]([0-9]*\.?[0-9]+)\s*(px|rem)['"]|([0-9]*\.?[0-9]+)\s*(?=,|\}|\s))/g;

const INFINITE_RE =
  /animation-iteration-count\s*:\s*infinite\b|animation\s*:[^;{}]*\binfinite\b/g;

const REMOTE_FONT_RE =
  /fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net|@import\s+url\(\s*['"]?https?:/gi;

const BUTTON_RE = /<button\b([^>]*)>([\s\S]*?)<\/button>/g;

export function isLegacyDesignPath(file: string): boolean {
  const norm = file.replaceAll('\\', '/').replace(/^\.\//, '');
  return LEGACY_DESIGN_LINT_ALLOWLIST.some((entry) =>
    entry.endsWith('/')
      ? norm.includes(entry)
      : norm === entry || norm.endsWith(`/${entry}`),
  );
}

export function isTokensFile(file: string): boolean {
  return file.replaceAll('\\', '/').endsWith('src/styles/tokens.css');
}

/** UI chrome is 13px; callouts 11px; chart labels and ticks 10px. */
export function fontSizeFloor(file: string): number {
  const norm = file.replaceAll('\\', '/').toLowerCase();
  if (norm.includes('/ui/') || norm.endsWith('ui.css') || norm.endsWith('.html'))
    return 13;
  if (norm.includes('callout')) return 11;
  return 10;
}

function lineOf(source: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < source.length; i += 1) {
    if (source[i] === '\n') line += 1;
  }
  return line;
}

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function push(
  out: DesignViolation[],
  file: string,
  source: string,
  index: number,
  rule: DesignViolation['rule'],
  message: string,
): void {
  out.push({ rule, file, line: lineOf(source, index), message });
}

function checkColors(file: string, source: string, out: DesignViolation[]): void {
  if (isTokensFile(file)) return;
  if (!/\.(css|tsx|html)$/.test(file)) return;
  for (const match of source.matchAll(COLOR_RE)) {
    const index = match.index ?? 0;
    push(
      out,
      file,
      source,
      index,
      'color-literal',
      `Color literal "${match[0]}" belongs in tokens.css.`,
    );
  }
}

function pxValue(amount: string, unit: string | undefined): number {
  const value = Number(amount);
  if (unit === 'rem') return value * 16;
  return value;
}

function checkFontSize(file: string, source: string, out: DesignViolation[]): void {
  if (!/\.(css|tsx|html)$/.test(file)) return;
  const floor = fontSizeFloor(file);
  for (const match of source.matchAll(FONT_SIZE_RE)) {
    const amount = match[1] ?? match[3] ?? match[5];
    const unit = match[2] ?? match[4] ?? 'px';
    if (!amount) continue;
    const px = pxValue(amount, unit);
    if (px + 1e-6 < floor) {
      const index = match.index ?? 0;
      push(
        out,
        file,
        source,
        index,
        'font-size',
        `font-size ${amount}${unit} is below the ${floor}px floor for this file.`,
      );
    }
  }
}

function checkInfinite(file: string, source: string, out: DesignViolation[]): void {
  if (!/\.(css|tsx)$/.test(file)) return;
  const lines = source.split('\n');
  for (const match of source.matchAll(INFINITE_RE)) {
    const index = match.index ?? 0;
    const line = lineOf(source, index);
    const nearby = lines.slice(Math.max(0, line - 4), line).join('\n');
    if (/spinner/i.test(nearby) || /spinner/i.test(file)) continue;
    push(
      out,
      file,
      source,
      index,
      'infinite-animation',
      'Infinite animation is only allowed on the loading spinner.',
    );
  }
}

function checkButtons(file: string, source: string, out: DesignViolation[]): void {
  if (!file.endsWith('.tsx')) return;
  for (const match of source.matchAll(BUTTON_RE)) {
    const attrs = match[1] ?? '';
    const inner = match[2] ?? '';
    const text = inner
      .replace(/<[^>]+>/g, '')
      .replace(/\{[^}]*\}/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();
    if (text.length > 0) continue;
    if (/\baria-label\s*=/.test(attrs) || /\baria-labelledby\s*=/.test(attrs)) continue;
    push(
      out,
      file,
      source,
      match.index ?? 0,
      'icon-button-name',
      'Icon-only button needs aria-label or aria-labelledby.',
    );
  }
}

function checkFonts(file: string, source: string, out: DesignViolation[]): void {
  if (!/\.(css|tsx|html|ts)$/.test(file)) return;
  for (const match of source.matchAll(REMOTE_FONT_RE)) {
    push(
      out,
      file,
      source,
      match.index ?? 0,
      'remote-font',
      `Remote font reference "${match[0]}" is not self-hosted.`,
    );
  }
}

export function lintDesignSource(file: string, raw: string): DesignViolation[] {
  const source = stripComments(raw);
  const out: DesignViolation[] = [];
  checkColors(file, source, out);
  checkFontSize(file, source, out);
  checkInfinite(file, source, out);
  checkButtons(file, raw, out);
  checkFonts(file, source, out);
  return out;
}
