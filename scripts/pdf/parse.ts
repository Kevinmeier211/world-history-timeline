export interface FontRow {
  name: string;
  type: string;
  embedded: boolean;
}

export interface PageBox {
  widthPt: number;
  heightPt: number;
  pages: number;
}

function tokenAt(line: string, at: number): string {
  let index = at;
  while (index < line.length && line[index] === ' ') index += 1;
  let end = index;
  while (end < line.length && line[end] !== ' ') end += 1;
  return line.slice(index, end);
}

/** Poppler `pdffonts` table. Column positions come from the header, not from spaces. */
export function parsePdfFonts(text: string): FontRow[] {
  const lines = text.split(/\r?\n/);
  const header = lines.find((line) => line.includes('name') && line.includes('emb'));
  if (!header) return [];
  const embAt = header.indexOf('emb');
  const typeAt = header.indexOf('type');
  const encodingAt = header.indexOf('encoding');
  const rows: FontRow[] = [];
  for (const line of lines) {
    if (line === header || line.trim().length === 0 || line.trim().startsWith('-'))
      continue;
    const flag = tokenAt(line, embAt);
    if (flag !== 'yes' && flag !== 'no') continue;
    const name = (typeAt > 0 ? line.slice(0, typeAt) : line).trim();
    if (name.length === 0) continue;
    const typeEnd = encodingAt > typeAt ? encodingAt : embAt;
    const type = typeAt > 0 ? line.slice(typeAt, typeEnd).trim() : '';
    rows.push({ name, type, embedded: flag === 'yes' });
  }
  return rows;
}

export function fontProblems(rows: readonly FontRow[]): string[] {
  if (rows.length === 0) return ['pdffonts listed no fonts'];
  return rows.filter((row) => !row.embedded).map((row) => `${row.name} emb=no`);
}

/** Poppler `pdfinfo`. Returns null when the page size or the page count is absent. */
export function parsePdfInfo(text: string): PageBox | null {
  const size = text.match(/Page size:\s+([0-9.]+)\s+x\s+([0-9.]+)\s+pts/);
  const pages = text.match(/Pages:\s+([0-9]+)/);
  const widthRaw = size?.[1];
  const heightRaw = size?.[2];
  const pagesRaw = pages?.[1];
  if (widthRaw === undefined || heightRaw === undefined || pagesRaw === undefined)
    return null;
  const widthPt = Number(widthRaw);
  const heightPt = Number(heightRaw);
  const count = Number(pagesRaw);
  if (
    !Number.isFinite(widthPt) ||
    !Number.isFinite(heightPt) ||
    !Number.isFinite(count)
  ) {
    return null;
  }
  return { widthPt, heightPt, pages: count };
}

export function pageSizeOk(
  box: PageBox,
  widthIn: number,
  heightIn: number,
  tolerancePt = 1,
): boolean {
  return (
    Math.abs(box.widthPt - widthIn * 72) <= tolerancePt &&
    Math.abs(box.heightPt - heightIn * 72) <= tolerancePt
  );
}

/**
 * The masthead is HTML text. CSS uppercases it, so the extract reads CHRONOS.
 * A hit means the page has a text layer, not only a document-info title.
 */
export function hasSelectableTitle(text: string): boolean {
  return text.toLowerCase().includes('chronos');
}
