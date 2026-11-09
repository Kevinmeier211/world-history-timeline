import type { Pack, RuntimePack } from '../../src/atlas/model';

/** Print-only investigation prose stays in corpus.json; invitations retain IDs. */
export function buildPackBootstrap(packs: Pack[]): RuntimePack[] {
  return packs.map((pack) => ({
    ...pack,
    investigations: pack.investigations?.map(({ journey }) => ({ journey })),
  }));
}
