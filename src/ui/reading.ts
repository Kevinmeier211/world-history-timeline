/** Our reading key. The wording is ours; the ideas follow §4.14. */

export interface ReadingPoint {
  id: string;
  title: string;
  body: string;
}

export const READING_KEY: readonly ReadingPoint[] = [
  {
    id: 'width',
    title: 'Width',
    body: 'A wider ribbon was more prominent in its day. Width is not land area and not a head count.',
  },
  {
    id: 'color',
    title: 'Color',
    body: 'Color names a lineage. Related polities share a hue. Color does not paint a region of the map.',
  },
  {
    id: 'uncertain',
    title: 'Uncertain beginnings',
    body: 'A faded or dashed top means the opening year is approximate or debated.',
  },
  {
    id: 'links',
    title: 'Dashed links',
    body: 'A dashed connector is a disputed succession or cultural continuity, not a clean handoff of power.',
  },
  {
    id: 'circa',
    title: 'Approximate dates',
    body: 'A c. before a year means that date is approximate.',
  },
  {
    id: 'peoples',
    title: 'Peoples outlast states',
    body: 'A people can continue after the state that ruled them ends.',
  },
];

export function readingText(): string {
  return READING_KEY.map((point) => `${point.title}. ${point.body}`).join('\n');
}
