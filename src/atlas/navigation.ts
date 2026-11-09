import { regions } from './model';
import legacyTargets from './legacy-targets.json';
import { parseYearQuery } from '../lib/years';
import {
  defaultJourneyFilters,
  normalizeJourneyFilters,
  type JourneyFilters,
} from './journey-filters';
export interface Location {
  journeyFilters?: JourneyFilters;
  legacy: string | null;
  destination: 'explore' | 'journeys' | 'notebook';
  view: 'stories' | 'timeline' | 'world';
  scale: 'world' | 'era' | 'local';
  pack: string;
  year: number;
  region: string;
  subject: string | null;
  preview: string | null;
  object: string | null;
  evidence: boolean;
  compare: string | null;
  journey: string | null;
  step: number;
  returnTo: string | null;
}
export const initialLocation: Location = {
  legacy: null,
  destination: 'explore',
  view: 'timeline',
  scale: 'era',
  pack: 'C4',
  year: 200,
  region: 'all',
  subject: null,
  preview: null,
  object: null,
  evidence: false,
  compare: null,
  journey: null,
  step: 0,
  returnTo: null,
};
export function readLocation(search: string): Location {
  const q = new URLSearchParams(search);
  const rawYear = q.get('year') ?? '200';
  const year =
    parseYearQuery(rawYear) ??
    (/^-[1-9]\d{0,4}$/.test(rawYear) ? Number(rawYear) : 200);
  const journeyFilters = normalizeJourneyFilters({
    query: q.get('jq') ?? '',
    chapter: q.get('jchapter') ?? 'all',
    region: q.get('jregion') ?? 'all',
    duration: q.get('jduration') ?? 'all',
    theme: q.get('jtheme') ?? 'all',
    track: q.get('jtrack') === 'family' ? 'family' : 'adult',
  });
  const hasJourneyFilters = Object.keys(defaultJourneyFilters).some(
    (key) =>
      journeyFilters[key as keyof JourneyFilters] !==
      defaultJourneyFilters[key as keyof JourneyFilters],
  );
  return {
    ...initialLocation,
    ...(hasJourneyFilters ? { journeyFilters } : {}),
    legacy: q.get('legacy'),
    destination:
      q.get('page') === 'notebook'
        ? 'notebook'
        : q.get('page') === 'journeys'
          ? 'journeys'
          : 'explore',
    view:
      q.get('view') === 'world'
        ? 'world'
        : q.get('view') === 'stories'
          ? 'stories'
          : 'timeline',
    scale:
      q.get('scale') === 'local'
        ? 'local'
        : q.get('scale') === 'era' || !search
          ? 'era'
          : 'world',
    pack: /^C[1-8]$/.test(q.get('pack') ?? '') ? q.get('pack')! : 'C4',
    year,
    region: regions.some((r) => r === q.get('region')) ? q.get('region')! : 'all',
    subject: q.get('subject') ?? q.get('selected'),
    preview: q.get('preview'),
    object: q.get('object'),
    evidence: q.get('evidence') === '1',
    compare: q.get('compare'),
    journey: q.get('journey'),
    step: Number.isFinite(Number(q.get('step')))
      ? Math.max(0, Math.floor(Number(q.get('step'))))
      : 0,
    returnTo: q.get('return'),
  };
}
export function locationQuery(l: Location): string {
  const q = new URLSearchParams({
    page: l.destination,
    view: l.view,
    scale: l.scale,
    pack: l.pack,
    year: l.year < 0 ? `${-l.year} BCE` : `${l.year} CE`,
  });
  if (l.journeyFilters) {
    const filters = normalizeJourneyFilters(l.journeyFilters);
    const parameters = {
      query: 'jq',
      chapter: 'jchapter',
      region: 'jregion',
      duration: 'jduration',
      theme: 'jtheme',
      track: 'jtrack',
    };
    for (const key of Object.keys(parameters) as (keyof JourneyFilters)[]) {
      if (filters[key] !== defaultJourneyFilters[key])
        q.set(parameters[key], filters[key]);
    }
  }
  if (l.legacy) q.set('legacy', l.legacy);
  if (l.region !== 'all') q.set('region', l.region);
  for (const k of ['subject', 'preview', 'object', 'compare', 'journey'] as const)
    if (l[k]) q.set(k, l[k]);
  if (l.evidence) q.set('evidence', '1');
  if (l.journey) q.set('step', String(l.step));
  if (l.returnTo) q.set('return', l.returnTo);
  return `?${q}`;
}
export function goToTime(l: Location, year: number, pack: string): Location {
  return {
    ...l,
    year,
    pack,
    scale: 'era',
    subject: null,
    preview: null,
    object: null,
    compare: null,
    evidence: false,
    journey: null,
    returnTo: null,
  };
}

export function fullHistory(l: Location): Location {
  return {
    ...initialLocation,
    view: 'timeline',
    scale: 'world',
    year: l.year,
    pack: l.pack,
  };
}
export function worldContext(l: Location): Location {
  return {
    ...l,
    destination: 'explore',
    view: 'world',
    scale: 'local',
    region: 'all',
    compare: null,
    evidence: false,
  };
}

/** Preserve old copied links as explicitly explained replacements, never as silent historical equivalences. */
export function readBrowserLocation(search: string, hash: string): Location {
  const l = readLocation(search);
  if (search) return l;
  const q = new URLSearchParams(hash.replace(/^#/, ''));
  if (!q.has('sel') && !q.has('y')) return l;
  const y = Number(q.get('y')),
    legacy = q.get('sel');
  const base = {
    ...l,
    year: Number.isInteger(y) && y !== 0 ? y : 200,
    legacy,
    subject: legacy,
    scale: legacy ? ('local' as const) : ('era' as const),
  };
  const entry = legacy
    ? (
        legacyTargets as Record<
          string,
          {
            target: string;
            pack: string;
            region: string;
            start: number | null;
            end: number | null;
          }
        >
      )[legacy]
    : null;
  return entry
    ? {
        ...base,
        subject: entry.target,
        pack: entry.pack,
        region: entry.region,
        year:
          (entry.start !== null && base.year < entry.start) ||
          (entry.end !== null && base.year > entry.end)
            ? (entry.start ?? base.year)
            : base.year,
      }
    : base;
}
