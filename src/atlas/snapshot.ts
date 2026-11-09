import { regions, type RuntimeCorpus } from './model';
import { distanceFromInterval, worldAtTime } from './chronology';

export const snapshotYears = [
  -2400, -1200, -300, 200, 850, 1250, 1600, 1800, 1900, 1947, 1950, 2000,
];

/** Selected view year never changes case, evidence, or reference intervals. */
export function regionalSnapshot(corpus: RuntimeCorpus, year: number, region: string) {
  const selection = worldAtTime(corpus, year, region);
  return regions
    .filter((r) => region === 'all' || r === region)
    .map((r) => {
      const frames = selection.contexts.filter((frame) => frame.region === r);
      const reading = (
        corpus.regionalSnapshots ??
        corpus.orientations?.flatMap((o) => o.snapshots) ??
        []
      ).find((entry) => entry.region === r && entry.year === year);
      const cases = selection.current.filter((subject) => subject.region === r);
      const nearby = selection.nearby
        .filter((subject) => subject.region === r)
        .map((subject) => ({
          subject,
          yearsFromCase: distanceFromInterval(subject.interval, year),
        }));
      return {
        region: r,
        selectedYear: year,
        status:
          frames.length || reading
            ? ('supported-frame' as const)
            : ('frame-gap' as const),
        reading,
        frames,
        cases,
        nearby,
      };
    });
}
