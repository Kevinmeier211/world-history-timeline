import { readFileSync, writeFileSync } from 'node:fs';

import { z } from 'zod';

import { sourceSchema } from '../src/data/schema/index.ts';
import { sourcesMarkdown } from './sources-md.ts';

const sources = z
  .array(sourceSchema)
  .parse(JSON.parse(readFileSync('src/data/sources.json', 'utf8')));
writeFileSync('LICENSES/SOURCES.md', sourcesMarkdown(sources));
console.log(`wrote LICENSES/SOURCES.md (${sources.length} sources)`);
