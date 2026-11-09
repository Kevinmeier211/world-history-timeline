import { toT } from '../lib/years';
import type { RuntimeCorpus } from './model';

/** Viewing points already described by the atlas, not inferred historical events. */
export function timeMoments(corpus: RuntimeCorpus, region: string): number[] {
  const dates = [
    -3300,
    2000,
    ...corpus.packs.map((p) => p.anchor),
    ...(corpus.contexts ?? [])
      .filter((c) => region === 'all' || c.region === region)
      .flatMap((c) => c.phases.map((p) => p.year)),
  ];
  return [...new Set(dates)]
    .filter((y) => Number.isInteger(y) && y !== 0 && y >= -3300 && y <= 2000)
    .sort((a, b) => toT(a) - toT(b));
}

export function adjacentMoments(moments: number[], year: number) {
  return {
    earlier: [...moments].reverse().find((y) => toT(y) < toT(year)),
    later: moments.find((y) => toT(y) > toT(year)),
  };
}
