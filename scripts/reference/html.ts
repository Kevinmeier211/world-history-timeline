import type { Geography } from '../../src/data/schema/geography.ts';
import { READING_KEY, type ReadingPoint } from '../../src/ui/reading.ts';

import { compareEras, compareRegions, eraLabel, regionName } from './order.ts';

export interface ReferenceNote {
  eraId: string;
  macroRegion: string;
  entries: { range: string; text: string; sourceIds: readonly string[] }[];
  whyItMatters: string;
  connections?: readonly string[];
}

export interface ReferenceSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  accessedISO: string;
  kind: string;
}

/** Absolute URLs of the shipped woff2 files. Omitted faces are not claimed. */
export interface ReferenceFaces {
  barlow700: string;
  barlow800: string;
  sans400: string;
  sans600: string;
  serif600: string;
}

export interface ReferencePageInput {
  notes: readonly ReferenceNote[];
  sources: readonly ReferenceSource[];
  geography: Geography;
  colophon: string;
  reading?: readonly ReadingPoint[];
  faces?: ReferenceFaces;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function faceRule(family: string, weight: number, href: string): string {
  if (href.length === 0) return '';
  const url = href.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
  return `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};src:url("${url}") format("woff2");}`;
}

function faceCss(faces: ReferenceFaces | undefined): string {
  if (!faces) return '';
  return [
    faceRule('Barlow Condensed', 700, faces.barlow700),
    faceRule('Barlow Condensed', 800, faces.barlow800),
    faceRule('Source Sans 3', 400, faces.sans400),
    faceRule('Source Sans 3', 600, faces.sans600),
    faceRule('Source Serif 4', 600, faces.serif600),
  ].join('');
}

const PAGE_CSS = `
@page { size: 8.5in 11in; margin: 0.6in; }
html { background: #f1e8d2; color: #2a241c; }
body { margin: 0; font-family: "Source Sans 3", sans-serif; font-size: 10.5pt; line-height: 1.35; }
h1, h2, h3, h4 { font-family: "Barlow Condensed", sans-serif; font-weight: 700; line-height: 1.1; margin: 0 0 6pt; }
h1 { font-weight: 800; font-size: 22pt; }
h2 { font-size: 16pt; margin-top: 14pt; }
h3 { font-size: 13pt; margin-top: 10pt; }
h4 { font-size: 11pt; margin-top: 6pt; }
p, ul, table { margin: 0 0 8pt; }
table { width: 100%; border-collapse: collapse; }
th, td { vertical-align: top; text-align: left; padding: 2pt 8pt 2pt 0; border-bottom: 0.4pt solid #cdbf9f; }
th { font-size: 9.5pt; letter-spacing: 0.04em; }
.why { font-family: "Source Serif 4", serif; font-weight: 600; }
.lede { max-width: 40em; }
pre { white-space: pre-wrap; font-family: "Source Sans 3", sans-serif; font-size: 10.5pt; }
.region { break-inside: avoid; }
.sources { padding-left: 1.1em; }
.sources li { margin: 0 0 5pt; overflow-wrap: break-word; }
.date { white-space: nowrap; }
`;

function noteTable(note: ReferenceNote): string {
  const body = note.entries
    .map((entry) => {
      const sources = entry.sourceIds.map((id) => escapeHtml(id)).join(', ');
      return `<tr><td>${escapeHtml(entry.range)}</td><td>${escapeHtml(entry.text)}</td><td>${sources}</td></tr>`;
    })
    .join('');
  return `<table><thead><tr><th>Range</th><th>Note</th><th>Sources</th></tr></thead><tbody>${body}</tbody></table>`;
}

function connectionList(note: ReferenceNote): string {
  const links = note.connections ?? [];
  if (links.length === 0) return '';
  const items = links.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
  return `<h4>Connections</h4><ul class="connections">${items}</ul>`;
}

function regionBlock(note: ReferenceNote, geography: Geography): string {
  const name = regionName(note.macroRegion, geography);
  return `<section class="region"><h3>${escapeHtml(name)}</h3>${noteTable(note)}<p class="why">Why it matters. ${escapeHtml(note.whyItMatters)}</p>${connectionList(note)}</section>`;
}

function eraBlocks(notes: readonly ReferenceNote[], geography: Geography): string {
  const eraIds = [...new Set(notes.map((note) => note.eraId))].sort(compareEras);
  if (eraIds.length === 0) return '<p>No era notes are stored.</p>';
  return eraIds
    .map((eraId) => {
      const regions = notes
        .filter((note) => note.eraId === eraId)
        .sort((a, b) => compareRegions(a.macroRegion, b.macroRegion, geography));
      const body = regions.map((note) => regionBlock(note, geography)).join('');
      return `<section class="era"><h2>${escapeHtml(eraLabel(eraId))}</h2>${body}</section>`;
    })
    .join('');
}

function readingSection(points: readonly ReadingPoint[]): string {
  const body = points
    .map(
      (point) => `<h3>${escapeHtml(point.title)}</h3><p>${escapeHtml(point.body)}</p>`,
    )
    .join('');
  return `<section id="reading-key"><h2>How to read this</h2>${body}</section>`;
}

function sourceList(sources: readonly ReferenceSource[]): string {
  if (sources.length === 0) return '<p>No sources are stored.</p>';
  const ordered = [...sources].sort((a, b) => {
    const title = a.title.localeCompare(b.title);
    return title !== 0 ? title : a.id.localeCompare(b.id);
  });
  const items = ordered
    .map((source) => {
      const url = source.url.length > 0 ? ` ${escapeHtml(source.url)}` : '';
      return `<li><strong>${escapeHtml(source.title)}</strong> ${escapeHtml(source.publisher)}. ${escapeHtml(source.id)}, ${escapeHtml(source.kind)}, accessed <span class="date">${escapeHtml(source.accessedISO)}</span>.${url}</li>`;
    })
    .join('');
  return `<ul class="sources">${items}</ul>`;
}

/** Letter HTML for the expanded reference. Connections are the stored list only. */
export function referenceHtml(input: ReferencePageInput): string {
  const reading = input.reading ?? READING_KEY;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Chronos Atlas — Expanded Reference</title><style>${faceCss(input.faces)}${PAGE_CSS}</style></head><body><header><h1>Expanded Reference</h1><p class="lede">Chronos Atlas. Era and region notes, the source list, the reading key, and the credits colophon, taken from the dataset.</p></header>${eraBlocks(input.notes, input.geography)}${readingSection(reading)}<section id="sources"><h2>Sources</h2>${sourceList(input.sources)}</section><section id="colophon"><h2>Credits</h2><pre>${escapeHtml(input.colophon)}</pre></section></body></html>`;
}
