import { describe, expect, it } from 'vitest';

import { curationMarkdown, fromCleveland, fromMet } from './plan.ts';

describe('media plan', () => {
  it('keeps a Cleveland CC0 row with a creator and skips the rest', () => {
    const kept = fromCleveland({
      title: 'Portrait of a Woman',
      creation_date: '1635 or earlier',
      accession_number: '1944.90',
      url: 'https://clevelandart.org/art/1944.90',
      share_license_status: 'CC0',
      creators: [{ description: 'Rembrandt van Rijn (Dutch, 1606–1669)' }],
    });
    expect(kept?.kept).toBe(true);
    expect(kept?.licenseUrl).toBe('https://creativecommons.org/publicdomain/zero/1.0/');
    expect(kept?.creator).toContain('Rembrandt');

    const noCreator = fromCleveland({
      title: 'Paint Box of Vizier Amenemope',
      url: 'https://clevelandart.org/art/1914.680',
      share_license_status: 'CC0',
      creators: [],
      accession_number: '1914.680',
    });
    expect(noCreator?.kept).toBe(false);

    const met = fromMet({
      title: 'Cuneiform tablet',
      objectURL: 'https://www.metmuseum.org/art/collection/search/324238',
      isPublicDomain: true,
      accessionNumber: '52.119.12',
      artistDisplayName: '',
    });
    expect(met?.kept).toBe(false);
    expect(met?.licenseUrl).toBeUndefined();
    const doc = curationMarkdown([kept!, noCreator!, met!]);
    expect(doc).toContain('No image file was downloaded');
    expect(doc).toContain('Portrait of a Woman');
    expect(doc).not.toContain('.jpg');
  });
});
