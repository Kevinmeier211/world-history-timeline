import type { Source } from '../src/data/schema/index.ts';

export function sourcesMarkdown(sources: readonly Source[]): string {
  const sorted = [...sources].sort((a, b) => a.id.localeCompare(b.id));
  const lines = [
    '# Sources',
    '',
    'Generated from `src/data/sources.json`. Do not edit by hand.',
    'Each URL returned HTTP 200 on 2026-10-25. Gemini bibliography entries [1]–[37] are not included; see `docs/QUESTIONS.md` (Q-01, Q-02).',
    '',
    '| id | kind | publisher | title | url |',
    '| --- | --- | --- | --- | --- |',
  ];
  for (const source of sorted) {
    const cells = [
      source.id,
      source.kind,
      source.publisher,
      source.title,
      source.url,
    ].map((cell) => cell.replaceAll('|', '\\|'));
    lines.push(`| ${cells.join(' | ')} |`);
  }
  lines.push('');
  return lines.join('\n');
}
