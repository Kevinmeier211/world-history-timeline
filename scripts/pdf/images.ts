export interface ImageDpi {
  xPpi: number;
  yPpi: number;
}

function tokenAt(line: string, at: number): string {
  let index = at;
  while (index < line.length && line[index] === ' ') index += 1;
  let end = index;
  while (end < line.length && line[end] !== ' ') end += 1;
  return line.slice(index, end);
}

/** Poppler `pdfimages -list`. No rows means the page has no images. */
export function parsePdfImages(text: string): ImageDpi[] {
  const lines = text.split(/\r?\n/);
  const header = lines.find((line) => line.includes('x-ppi') && line.includes('y-ppi'));
  if (!header) return [];
  const xAt = header.indexOf('x-ppi');
  const yAt = header.indexOf('y-ppi');
  const rows: ImageDpi[] = [];
  for (const line of lines) {
    if (!/^\s*\d/.test(line)) continue;
    const xPpi = Number(tokenAt(line, xAt));
    const yPpi = Number(tokenAt(line, yAt));
    if (Number.isFinite(xPpi) && Number.isFinite(yPpi)) rows.push({ xPpi, yPpi });
  }
  return rows;
}

export function imageProblems(rows: readonly ImageDpi[], minPpi: number): string[] {
  return rows
    .filter((row) => row.xPpi < minPpi || row.yPpi < minPpi)
    .map((row) => `image ${row.xPpi} x ${row.yPpi} ppi is below ${minPpi}`);
}
