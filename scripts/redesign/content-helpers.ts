import type {
  Citation,
  Corpus,
  Claim,
  HistoricalInterval,
  Section,
  Source,
  Subject,
} from '../../src/atlas/model';
export const consulted = '2026-10-26';
export const cite = (source: string, locator: string): Citation => ({
  source,
  locator,
});
export const interval = (
  start: number | null,
  end: number | null,
  label: string,
  note: string,
  precision: HistoricalInterval['precision'] = 'approximate',
): HistoricalInterval => ({ start, end, label, note, precision });
export const sec = (
  title: string,
  text: string,
  ...citations: Citation[]
): Section => ({ title, text, citations });
export const claim = (
  id: string,
  text: string,
  citations: Citation[],
  uncertainty?: string,
): Claim => ({
  id,
  text,
  citations,
  uncertainty,
  status: 'published',
  checkedBy:
    'Codex source consultation and self-review; not independent historian approval',
  checkedOn: consulted,
});
export const metEssay = (
  id: string,
  title: string,
  slug: string,
  scope: string,
  author?: string,
  published?: string,
): Source => ({
  id,
  title,
  url: `https://www.metmuseum.org/essays/${slug}`,
  institution: 'The Metropolitan Museum of Art',
  type: 'scholarship',
  accessed: consulted,
  scope,
  author,
  published,
});
export function subject(
  row: Omit<Subject, 'status' | 'aliases' | 'terms' | 'dimensions'> &
    Partial<Pick<Subject, 'aliases' | 'terms' | 'dimensions'>>,
): Subject {
  return { aliases: [], terms: [], dimensions: {}, status: 'published', ...row };
}

/** Keep module-owned source records intact when a later chapter adds a dated consultation. */
export function addSourceConsultation(
  corpus: Corpus,
  id: string,
  accessed: string,
  addendum: string,
) {
  const index = corpus.sources.findIndex((source) => source.id === id);
  const prior = corpus.sources[index];
  if (!prior) throw Error(`Unknown source for consultation: ${id}`);
  corpus.sources[index] = { ...prior, accessed, scope: prior.scope + ' ' + addendum };
}
