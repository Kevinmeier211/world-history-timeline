import { readFileSync } from 'node:fs';
import path from 'node:path';

import { parseRunConfig } from '../runConfig.ts';

const text = readFileSync(path.resolve('docs/RUN_CONFIG.md'), 'utf8');
const config = parseRunConfig(text);

if (!config.ALLOW_MEDIA_DOWNLOAD) {
  console.log(
    'media:fetch: queued-gated (ALLOW_MEDIA_DOWNLOAD=false). No files downloaded.',
  );
  process.exit(0);
}

console.error(
  'media:fetch: switch is on, but the downloader is not implemented until T4.07.',
);
process.exit(1);
