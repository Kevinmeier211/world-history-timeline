import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import type { Corpus } from '../../src/atlas/model';
import { format, resolveConfig } from 'prettier';
import { buildMediaBootstrap } from './bootstrap-media';
import { buildJourneyBootstrap } from './bootstrap-journeys';
import { buildPackBootstrap } from './bootstrap-packs';
import { validateCorpus } from '../../src/atlas/validate';
import { createCanonicalCorpus } from './canonical-content';

export async function compile({
  corpus = createCanonicalCorpus(),
  directory = 'public/atlas',
  manifestDirectory = 'output/redesign/manifests',
}: {
  corpus?: Corpus;
  directory?: string;
  manifestDirectory?: string;
} = {}) {
  const issues = validateCorpus(corpus);
  if (issues.length) throw Error(issues.join('\n'));
  // Validate complete rich delivery, including per-view descriptions, before file writes.
  const mediaBootstrap = buildMediaBootstrap(corpus);
  const journeyBootstrap = buildJourneyBootstrap(corpus);
  const dir = directory;
  await fs.mkdir(path.join(dir, 'subjects'), { recursive: true });
  await fs.writeFile(path.join(dir, 'corpus.json'), JSON.stringify(corpus));
  const mediaRecordsDir = path.join(dir, 'media-records');
  // This directory contains only generated delivery records. Never clean the
  // neighbouring image, reference, research or earlier export directories.
  await fs.rm(mediaRecordsDir, { recursive: true, force: true });
  await fs.mkdir(mediaRecordsDir, { recursive: true });
  const mediaFormatting = await resolveConfig(
    path.join(mediaRecordsDir, 'record.json'),
  );
  await Promise.all(
    mediaBootstrap.records.map(async (record) =>
      fs.writeFile(
        path.join(mediaRecordsDir, `${record.subject}.json`),
        await format(JSON.stringify(record), { ...mediaFormatting, parser: 'json' }),
      ),
    ),
  );
  const journeyRecordsDir = path.join(dir, 'journey-records');
  // Generated delivery only; canonical journeys and all print fields stay intact.
  await fs.rm(journeyRecordsDir, { recursive: true, force: true });
  await fs.mkdir(journeyRecordsDir, { recursive: true });
  const journeyFormatting = await resolveConfig(
    path.join(journeyRecordsDir, 'record.json'),
  );
  await Promise.all(
    journeyBootstrap.records.map(async (record) =>
      fs.writeFile(
        path.join(journeyRecordsDir, `${record.journey}.json`),
        await format(JSON.stringify(record), { ...journeyFormatting, parser: 'json' }),
      ),
    ),
  );
  await fs.writeFile(
    path.join(dir, 'search.json'),
    JSON.stringify(
      corpus.subjects.map((s) => ({
        id: s.id,
        text:
          [...s.sections, ...(s.deeperReading ?? [])]
            .map((section) => `${section.title} ${section.text}`)
            .join(' ') +
          ' ' +
          (s.evidenceReading?.items
            .map((item) => `${item.label} ${item.text} ${item.interpretation}`)
            .join(' ') ?? ''),
      })),
    ),
  );
  // Titles, institutions and URLs stay out of the first-paint file. The phone
  // useful-view budget cannot download every bibliography field before the
  // gallery or timeline appears. Scopes remain in source-scopes.json.
  const sourceRecords = corpus.sources.map((s) => ({ ...s, scope: '' }));
  await fs.writeFile(
    path.join(dir, 'source-records.json'),
    JSON.stringify(sourceRecords),
  );
  await fs.writeFile(
    path.join(dir, 'index.json'),
    JSON.stringify({
      ...corpus,
      orientations: undefined,
      orientationChapters: [...new Set(corpus.orientations?.map((o) => o.chapter))],
      regionalSnapshots: undefined,
      regionalSnapshotsDeferred: true,
      contextDetailsDeferred: true,
      mediaDetailsDeferred: true,
      journeyDetailsDeferred: true,
      mediaRevision: mediaBootstrap.revision,
      contexts: corpus.contexts?.map((context) => ({
        ...context,
        phases: context.phases.map((phase) => ({
          ...phase,
          // Step navigation uses years; qualified labels arrive with full reading.
          label: undefined,
          title: '',
          text: '',
          citations: [],
        })),
      })),
      journeys: journeyBootstrap.journeys,
      packs: buildPackBootstrap(corpus.packs),
      media: mediaBootstrap.media,
      sources: corpus.sources.map((s) => ({ id: s.id, scope: '' })),
      subjects: corpus.subjects.map((s) => ({
        ...s,
        sections: [],
        claims: [],
        dimensions: {},
        deeperReading: undefined,
        familyActivity: undefined,
        evidenceReading: undefined,
        placeStudy: undefined,
        review: undefined,
      })),
    }),
  );
  await fs.writeFile(
    path.join(dir, 'contexts.json'),
    JSON.stringify(corpus.contexts ?? []),
  );
  await fs.writeFile(
    path.join(dir, 'regional-snapshots.json'),
    JSON.stringify(corpus.orientations?.flatMap((o) => o.snapshots) ?? []),
  );
  await fs.writeFile(
    path.join(dir, 'orientations.json'),
    JSON.stringify(corpus.orientations ?? []),
  );
  await fs.writeFile(
    path.join(dir, 'source-scopes.json'),
    JSON.stringify(Object.fromEntries(corpus.sources.map((s) => [s.id, s.scope]))),
  );
  for (const s of corpus.subjects)
    await fs.writeFile(path.join(dir, 'subjects', `${s.id}.json`), JSON.stringify(s));
  await fs.mkdir(manifestDirectory, { recursive: true });
  await fs.writeFile(
    path.join(manifestDirectory, 'sources.json'),
    JSON.stringify(corpus.sources, null, 2),
  );
  await fs.writeFile(
    path.join(manifestDirectory, 'media.json'),
    JSON.stringify(corpus.media, null, 2),
  );
  console.log(
    `Compiled ${corpus.subjects.length} subjects, ${corpus.packs.length} pack(s), ${corpus.media.length} objects. Release contract validation remains separate.`,
  );
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await compile();
