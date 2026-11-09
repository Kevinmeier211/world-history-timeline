import type { SearchEntry, Subject } from './model';
export const normalizeSearch = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

/** Select an unchanged passage from the indexed material, never generated prose. */
export function explainSearchMatch(
  subject: Subject,
  entries: SearchEntry[],
  input: string,
) {
  const tokens = normalizeSearch(input).match(/[\p{L}\p{N}]+/gu) ?? [];
  const fields = [
    { label: 'Name', text: subject.name },
    ...subject.aliases.map((text) => ({ label: 'Also called', text })),
    { label: 'Question', text: subject.question },
    { label: 'Place', text: subject.place },
    { label: 'Summary', text: subject.summary },
    {
      label: 'Reading excerpt',
      text: entries.find((e) => e.id === subject.id)?.text ?? '',
    },
  ];
  const ranked = fields.map((field) => ({
    ...field,
    score: tokens.filter((token) =>
      (normalizeSearch(field.text).match(/[\p{L}\p{N}]+/gu) ?? []).some((word) =>
        word.startsWith(token),
      ),
    ).length,
  }));
  const best = ranked.sort((a, b) => b.score - a.score)[0];
  if (!best?.score) return { label: 'Question', text: subject.question };
  if (best.text.length <= 200) return best;
  // Use actual string positions after finding the first matching original word.
  const match = [...best.text.matchAll(/[\p{L}\p{N}]+/gu)].find((word) =>
    tokens.some((token) => normalizeSearch(word[0]).startsWith(token)),
  );
  const start = Math.max(0, (match?.index ?? 0) - 60);
  const end = Math.min(best.text.length, start + 200);
  return {
    label: best.label,
    text: `${start ? '…' : ''}${best.text.slice(start, end)}${end < best.text.length ? '…' : ''}`,
  };
}
/** Prepare immutable reading data once; each keystroke only evaluates the query. */
export function createSubjectSearch(subjects: Subject[], entries: SearchEntry[]) {
  const words = (text: string) => text.match(/[\p{L}\p{N}]+/gu) ?? [];
  const body = new Map(entries.map((entry) => [entry.id, normalizeSearch(entry.text)]));
  const prepared = subjects.map((subject) => {
    const names = [subject.name, ...subject.aliases].map(normalizeSearch);
    const title = normalizeSearch(
      [
        subject.name,
        ...subject.aliases,
        subject.question,
        subject.place,
        subject.region,
      ].join(' '),
    );
    const text = `${title} ${normalizeSearch(subject.summary)} ${body.get(subject.id) ?? ''}`;
    return {
      subject,
      names,
      title,
      text,
      textWords: words(text),
      nameWords: names.flatMap(words),
    };
  });
  return (input: string) => {
    const query = normalizeSearch(input);
    if (!query) return [];
    const tokens = words(query);
    if (!tokens.length) return [];
    return prepared
      .map(({ subject, names, title, text, textWords, nameWords }) => {
        const score = !tokens.every((token) =>
          textWords.some((word) => word.startsWith(token)),
        )
          ? 0
          : names.includes(query)
            ? 100
            : tokens.every((token) => nameWords.includes(token))
              ? 80
              : tokens.every((token) =>
                    nameWords.some((word) => word.startsWith(token)),
                  )
                ? 60
                : title.includes(query)
                  ? 40
                  : text.includes(query)
                    ? 20
                    : 10;
        return { subject, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.subject.name.localeCompare(b.subject.name))
      .map((result) => result.subject);
  };
}
export function searchSubjects(
  subjects: Subject[],
  entries: SearchEntry[],
  input: string,
) {
  return createSubjectSearch(subjects, entries)(input);
}
