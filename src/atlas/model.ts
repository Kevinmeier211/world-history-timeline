/** Release content is independent of the inherited research corpus. */
export const regions = [
  'Americas',
  'Africa',
  'Europe',
  'West/Central Asia',
  'South Asia',
  'East Asia',
  'Southeast Asia/Oceania',
] as const;
export type Region = (typeof regions)[number];
export type ReviewState = 'draft' | 'sourced' | 'checked' | 'published' | 'held';
export interface Citation {
  source: string;
  locator: string;
}
export interface Source {
  id: string;
  title: string;
  institution: string;
  author?: string;
  url: string;
  type: 'catalogue' | 'scholarship' | 'archive' | 'archaeology' | 'primary';
  published?: string;
  accessed: string;
  scope: string;
}
export interface HistoricalInterval {
  start: number | null;
  end: number | null;
  ongoing?: boolean;
  precision: 'exact' | 'approximate' | 'range' | 'unknown' | 'disputed';
  label: string;
  note: string;
  alternatives?: { label: string; citations: Citation[] }[];
}
export interface Claim {
  id: string;
  text: string;
  citations: Citation[];
  status: ReviewState;
  uncertainty?: string;
  checkedBy: string;
  checkedOn: string;
}
export interface Section {
  title: string;
  text: string;
  citations: Citation[];
}
export interface Subject {
  contextIds?: string[];
  deeperReading?: Section[];
  familyActivity?: {
    title: string;
    duration: string;
    steps: string[];
    explanation: string;
  };
  evidenceReading?: {
    title: string;
    introduction: string;
    items: {
      label: string;
      text: string;
      interpretation: string;
      citations: Citation[];
    }[];
  };
  placeStudy?: PlaceStudy;
  review?: {
    consultedOn: string;
    reviewer: string;
    scope: string;
    limitations: string[];
  };
  id: string;
  name: string;
  aliases: string[];
  kind:
    | 'political entity'
    | 'society'
    | 'period'
    | 'place'
    | 'process'
    | 'object'
    | 'document';
  region: Region;
  place: string;
  coordinates: [number, number];
  geographicPrecision: string;
  interval: HistoricalInterval;
  packs: string[];
  question: string;
  summary: string;
  sections: Section[];
  claims: Claim[];
  objectIds: string[];
  terms: string[];
  dimensions: Record<string, { text: string; citations: Citation[] }>;
  /** Stable comparison identifiers retained in the lightweight index. */
  dimensionKeys?: string[];
  status: ReviewState;
  returnPrompt: string;
}
export interface MediaAnnotation {
  id: string;
  label: string;
  /** Position on the uncropped source image, not a geographic point. */
  x: number;
  y: number;
  text: string;
  citations: Citation[];
}
export interface MediaAnnotations {
  createdOn: string;
  credit: string;
  rights: string;
  licenseUrl: string;
  items: MediaAnnotation[];
}
export interface Media {
  /** Bootstrap flag keeps the image wrapper stable while reading notes load. */
  hasAnnotations?: true;
  /** Modern editorial layer; underlying photograph bytes remain unchanged. */
  annotations?: MediaAnnotations;
  licenseUrl?: string;
  /** Optional print size for small source scans; does not imply higher resolution. */
  printWidthMm?: number;
  printCaption?: string;
  printCredit?: string;
  id: string;
  title: string;
  subject: string;
  source: string;
  accession: string;
  creator: string;
  date: HistoricalInterval;
  representedDate?: string;
  place: string;
  material: string;
  image: string;
  thumbnail: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  notice: string[];
  rights: string;
  credit: string;
  sourceImage: string;
  depiction:
    | 'object photograph'
    | 'contemporary document'
    | 'later depiction'
    | 'explanatory diagram'
    | 'modern terrain model'
    | 'archive reference card'
    | 'annotated excavation photograph'
    | 'satellite image';
  relevance: string;
  datingNote?: string;
  additionalImages?: string[];
  /** Optional one-to-one descriptions for additionalImages, never borrowed from the primary. */
  additionalImageAlts?: string[];
}
/** Reading-only fields delivered separately from a bootstrap media summary. */
export type MediaDetailKey =
  | 'caption'
  | 'notice'
  | 'creator'
  | 'place'
  | 'material'
  | 'representedDate'
  | 'relevance'
  | 'datingNote'
  | 'additionalImages'
  | 'additionalImageAlts'
  | 'printWidthMm'
  | 'annotations';
/** Image identity, provenance, dates and accessible fallback remain immediate. */
export type MediaSummary = Omit<Media, MediaDetailKey | 'printCaption' | 'printCredit'>;
export type MediaDetails = Pick<Media, MediaDetailKey> & { id: string };
export interface Relation {
  notBefore?: number;
  id: string;
  from: string;
  to: string;
  type: 'trade' | 'conquest' | 'transmission' | 'political transition' | 'resistance';
  date: string;
  explanation: string;
  citations: Citation[];
  status: ReviewState;
  route?: [number, number][];
}
export interface Stop {
  subject: string;
  year: number;
  title: string;
  narrative: string;
  object?: string;
  compare?: string;
  relation?: string;
}
export interface EvidenceQuestion {
  prompt: string;
  options: { text: string; feedback: string; supported: boolean }[];
  citations: Citation[];
}
export interface Journey {
  /** A short source summary makes a family task answerable on its printed sheet. */
  familyEvidence?: {
    title: string;
    text: string;
    citations: Citation[];
    /** null deliberately uses a text source card; undefined retains the usual image. */
    object?: string | null;
    notice: string[];
    /** Open task supplied with this sheet, independent of the web quiz's options. */
    claimPrompt: string;
    returnPrompt?: string;
    feedback?: string;
  };
  /** Explicit lead for print and family material, independent of corpus storage order. */
  leadObject?: string;
  /** Authored print pagination; indices follow completed stops, not historical dates. */
  printBreakAfter?: number[];
  /** Explicit bibliography pages and grouping; never changes source content. */
  printSourcesPerPage?: number;
  id: string;
  title: string;
  question: string;
  duration: string;
  introduction: string;
  stops: Stop[];
  conclusion: string;
  evidence: EvidenceQuestion;
  returnPrompt: string;
}
/** Immediate list, navigation and notebook provenance, without deferred prose. */
export type StopSummary = Omit<Stop, 'narrative'>;
export type JourneySummary = Pick<
  Journey,
  'id' | 'title' | 'question' | 'duration' | 'introduction' | 'returnPrompt'
> & {
  stops: StopSummary[];
  evidence: Pick<EvidenceQuestion, 'citations'>;
  /** Derived from an authored family source task in the full corpus. */
  hasFamilyActivity?: boolean;
  /** Per-journey delivery revision; absent on canonical full-corpus records. */
  detailsRevision?: string;
};
export interface JourneyDetails {
  id: string;
  stops: { index: number; narrative: string }[];
  conclusion: string;
  evidence: Pick<EvidenceQuestion, 'prompt' | 'options'>;
}
export interface Pack {
  featuredSubjects?: string[];
  investigations?: Investigation[];
  displayWindow?: { start: number; end: number };
  id: string;
  title: string;
  start: number;
  end: number;
  anchor: number;
  question: string;
  orientation: string;
  journey: string;
  comparison: [string, string];
  geography: string;
  limits: string;
  coverage: Record<
    Region,
    {
      status: 'researched' | 'limited' | 'not covered';
      reason: string;
      subjects: string[];
    }
  >;
}
/** Authored companion inquiry; date bounds describe the inquiry, not a new polity. */
export interface Investigation {
  title: string;
  journey: string;
  comparison: [string, string];
  start?: number;
  end?: number;
  question?: string;
  orientation?: string;
  geography?: string;
  limits?: string;
}
/** Runtime invitations need only the authored journey identity, in authored order. */
export type InvestigationSummary = Pick<Investigation, 'journey'>;
export type RuntimePack = Omit<Pack, 'investigations'> & {
  investigations?: InvestigationSummary[];
};
export interface GlossaryTerm {
  id: string;
  name: string;
  definition: string;
}
export interface Corpus<
  M extends MediaSummary = Media,
  J extends JourneySummary = Journey,
  P extends RuntimePack = Pack,
> {
  /** Bootstrap contexts retain dates and summaries; phase prose loads on reading. */
  contextDetailsDeferred?: boolean;
  /** Rich media loads at the dossier boundary; full corpus/print stays complete. */
  mediaDetailsDeferred?: true;
  mediaRevision?: string;
  /** Selected journeys load their narratives and quiz; navigation stays immediate. */
  journeyDetailsDeferred?: true;
  contexts?: HistoricalContext[];
  /** Full chapter reading is delivered separately from the first-paint index. */
  orientations?: RegionalOrientation[];
  orientationChapters?: string[];
  regionalSnapshots?: RegionalSnapshotReading[];
  regionalSnapshotsDeferred?: boolean;
  comparisons?: ComparisonDefinition[];
  subjects: Subject[];
  sources: Source[];
  media: M[];
  relations: Relation[];
  packs: P[];
  journeys: J[];
  glossary: GlossaryTerm[];
}
export type RuntimeCorpus = Corpus<MediaSummary, JourneySummary, RuntimePack>;
/** A curated view-year explanation is not a new continuous historical interval. */
export interface RegionalSnapshotReading {
  orientation: string;
  region: Region;
  year: number;
  text: string;
  citations: Citation[];
}
export interface RegionalOrientation {
  id: string;
  chapter: string;
  region: Region;
  title: string;
  question: string;
  summary: Section;
  sections: Section[];
  scope: string;
  perspectives: string;
  contextIds: string[];
  subjectIds: string[];
  activity: { prompt: string; response: string };
  snapshots: RegionalSnapshotReading[];
}
/** A sourced orientation frame, distinct from a case study or an object's date. */
export interface HistoricalContext {
  id: string;
  title: string;
  region: Region;
  interval: HistoricalInterval;
  summary: string;
  citations: Citation[];
  subjectIds: string[];
  phases: {
    year: number;
    label?: string;
    title: string;
    text: string;
    citations: Citation[];
  }[];
}
/** Geographic coordinates are approximate locators, never reconstructed borders. */
export interface PlaceStudy {
  background?: 'coastline';
  crossesAntimeridian?: boolean;
  title: string;
  description: string;
  bounds: [number, number, number, number];
  points: {
    id: string;
    label: string;
    coordinates: [number, number];
    text: string;
    citations: Citation[];
  }[];
  features: {
    label: string;
    kind: 'water' | 'route' | 'area';
    points: [number, number][];
    note: string;
    citations: Citation[];
  }[];
}
export interface ComparisonDefinition {
  id: string;
  subjects: [string, string];
  question: string;
}
export interface SearchEntry {
  id: string;
  text: string;
}
