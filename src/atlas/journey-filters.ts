import type { JourneySummary, RuntimeCorpus } from './model';
import { regions } from './model';
import { normalizeSearch } from './search-index';
import chapterLearning from './chapter-learning.json';
import learningThemes from './learning-themes.json';

export interface JourneyFilters {
  query: string;
  chapter: string;
  region: string;
  duration: string;
  theme: string;
  track: 'adult' | 'family';
}

export const defaultJourneyFilters: JourneyFilters = {
  query: '',
  chapter: 'all',
  region: 'all',
  duration: 'all',
  theme: 'all',
  track: 'adult',
};

export function normalizeJourneyFilters(
  value: Partial<JourneyFilters> = {},
): JourneyFilters {
  return {
    query: typeof value.query === 'string' ? value.query.slice(0, 200) : '',
    chapter: /^C[1-8]$/.test(value.chapter ?? '') ? value.chapter! : 'all',
    region: regions.some((region) => region === value.region) ? value.region! : 'all',
    duration: ['40', '50'].includes(value.duration ?? '') ? value.duration! : 'all',
    theme: learningThemes.some((theme) => theme.id === value.theme)
      ? value.theme!
      : 'all',
    track: value.track === 'family' ? 'family' : 'adult',
  };
}

export function matchesJourneyFilters(
  journey: JourneySummary,
  corpus: RuntimeCorpus,
  filters: JourneyFilters,
): boolean {
  const stops = journey.stops.map((stop) =>
    corpus.subjects.find((subject) => subject.id === stop.subject),
  );
  const theme = learningThemes.find((row) => row.id === filters.theme);
  const durations = (journey.duration.match(/\d+/g) ?? []).map(Number);
  const familyActivity =
    journey.hasFamilyActivity ||
    ('familyEvidence' in journey && !!journey.familyEvidence) ||
    chapterLearning.some((row) => row.journey === journey.id);
  return (
    (!filters.query.trim() ||
      normalizeSearch(
        `${journey.title} ${journey.question} ${journey.introduction}`,
      ).includes(normalizeSearch(filters.query))) &&
    (filters.chapter === 'all' ||
      stops.some((subject) => subject?.packs.includes(filters.chapter))) &&
    (filters.region === 'all' ||
      stops.some((subject) => subject?.region === filters.region)) &&
    (filters.duration === 'all' ||
      (durations.length > 0 && Math.max(...durations) <= Number(filters.duration))) &&
    (!theme || theme.journeys.includes(journey.id)) &&
    (filters.track === 'adult' || familyActivity)
  );
}
