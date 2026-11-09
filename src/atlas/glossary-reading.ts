import type { GlossaryTerm } from './model';
export interface GlossaryPart {
  text: string;
  term?: GlossaryTerm;
}
const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[-\s\u2010\u2011]+/g, ' ')
    .trim();
const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Exact named terms only; conserve every character and annotate once per reading group. */
export function glossaryReading(
  texts: string[],
  terms: GlossaryTerm[],
): GlossaryPart[][] {
  const names = new Map<string, GlossaryTerm>();
  for (const term of terms) {
    for (const name of term.name
      .split('/')
      .map((s) => s.trim())
      .filter(Boolean))
      if (!names.has(normalize(name))) names.set(normalize(name), term);
  }
  if (!names.size) return texts.map((text) => [{ text }]);
  const patterns = [...names.keys()]
    .sort((a, b) => b.length - a.length)
    .map((name) =>
      escapePattern(name)
        .replace(/['’‘]/g, "['’‘]")
        .replace(/[-\s\u2010\u2011]+/g, '[-\\s\\u2010\\u2011]+'),
    );
  const pattern = new RegExp(
    '(^|[^\\p{L}\\p{N}_])(' + patterns.join('|') + ')(?=$|[^\\p{L}\\p{N}_])',
    'giu',
  );
  const used = new Set<string>();
  return texts.map((text) => {
    const parts: GlossaryPart[] = [];
    let offset = 0;
    for (const match of text.matchAll(pattern)) {
      const term = names.get(normalize(match[2]!))!;
      if (used.has(term.id)) continue;
      const start = match.index + match[1]!.length;
      if (start > offset) parts.push({ text: text.slice(offset, start) });
      parts.push({ text: match[2]!, term });
      offset = start + match[2]!.length;
      used.add(term.id);
    }
    if (offset < text.length || !parts.length) parts.push({ text: text.slice(offset) });
    return parts;
  });
}
