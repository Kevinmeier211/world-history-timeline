import { subject, interval, claim, cite, sec } from './content-helpers';
import type {
  Citation,
  Subject,
  Section,
  Region,
  HistoricalInterval,
} from '../../src/atlas/model';
/** Concise authoring format; all prose and locators remain authored, never inferred from dates. */
export function dossier(r: {
  id: string;
  name: string;
  aliases?: string[];
  kind: Subject['kind'];
  region: Region;
  place: string;
  coordinates: [number, number];
  geo: string;
  dates: [number | null, number | null, string, string];
  precision?: HistoricalInterval['precision'];
  packs: string[];
  question: string;
  summary: string;
  sections: [string, string, string, string][];
  fact: [string, string, string];
  supportingFactCitations?: Citation[];
  factCheckedOn?: string;
  objects?: string[];
  terms?: string[];
  dimensions: [string, string, string, string][];
  prompt: string;
}): Subject {
  const sections: Section[] = r.sections.map(([title, text, source, locator]) =>
    sec(title, text, cite(source, locator)),
  );
  return subject({
    id: r.id,
    name: r.name,
    aliases: r.aliases ?? [],
    kind: r.kind,
    region: r.region,
    place: r.place,
    coordinates: r.coordinates,
    geographicPrecision: r.geo,
    interval: interval(...r.dates, r.precision ?? 'approximate'),
    packs: r.packs,
    question: r.question,
    summary: r.summary,
    sections,
    claims: [
      {
        ...claim(`${r.id}-checked`, r.fact[0], [
          cite(r.fact[1], r.fact[2]),
          ...(r.supportingFactCitations ?? []),
        ]),
        ...(r.factCheckedOn && { checkedOn: r.factCheckedOn }),
      },
    ],
    objectIds: r.objects ?? [],
    terms: r.terms ?? ['evidence', 'inference'],
    dimensions: Object.fromEntries(
      r.dimensions.map(([name, text, source, locator]) => [
        name,
        { text, citations: [cite(source, locator)] },
      ]),
    ),
    returnPrompt: r.prompt,
  });
}
