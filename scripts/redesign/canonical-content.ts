import c1 from './content-canonical/C1.json';
import c2 from './content-canonical/C2.json';
import c3 from './content-canonical/C3.json';
import c4 from './content-canonical/C4.json';
import c5 from './content-canonical/C5.json';
import c6 from './content-canonical/C6.json';
import c7 from './content-canonical/C7.json';
import c8 from './content-canonical/C8.json';
import sources from './content-canonical/sources.json';
import shared from './content-canonical/shared.json';
import manifest from './content-canonical/manifest.json';
import { assembleCanonicalCorpus } from './canonical-assembly';

const partitions = {
  C1: c1,
  C2: c2,
  C3: c3,
  C4: c4,
  C5: c5,
  C6: c6,
  C7: c7,
  C8: c8,
  sources,
  shared,
};

/** Read the authored chapter/shared files; each caller receives an independent corpus. */
export function createCanonicalCorpus() {
  return assembleCanonicalCorpus(partitions, manifest);
}
