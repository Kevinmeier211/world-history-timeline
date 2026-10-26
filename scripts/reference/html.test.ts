import { describe, expect, it } from 'vitest';

import { bundledGeography } from '../../src/data/catalog.ts';
import { colophonText } from '../../src/data/credits.ts';
import { datasetSchema } from '../../src/data/schema/index.ts';
import { loadDataset } from '../load-dataset.ts';
import { referenceHtml, type ReferenceNote, type ReferenceSource } from './html.ts';
import { eraLabel } from './order.ts';
import { referenceFontProblems, referenceTextProblems } from './text.ts';

const geography = bundledGeography();

const oneNote: ReferenceNote = {
  eraId: 'era_custom',
  macroRegion: 'americas',
  entries: [{ range: '1–2', text: 'One stored line.', sourceIds: ['src_a'] }],
  whyItMatters: 'A stored reason with a <mark>.',
  connections: ['Only this connection.'],
};

const oneSource: ReferenceSource = {
  id: 'src_a',
  title: 'A <handbook>',
  publisher: 'Press & Co',
  url: '',
  accessedISO: '2026-10-25',
  kind: 'handbook',
};

describe('reference html', () => {
  it('prints stored notes, escapes text, and does not add a connection', () => {
    const html = referenceHtml({
      notes: [oneNote],
      sources: [oneSource],
      geography,
      colophon: colophonText([]),
      reading: [
        {
          id: 'peoples',
          title: 'Peoples outlast states',
          body: 'A people can continue after the state that ruled them ends.',
        },
      ],
    });
    expect(html).toContain('era_custom');
    expect(eraLabel('era_custom')).toBe('era_custom');
    expect(html).toContain('Americas');
    expect(html).toContain(
      '<ul class="connections"><li>Only this connection.</li></ul>',
    );
    expect(html.match(/<ul class="connections">/g)).toHaveLength(1);
    expect(html).toContain('A &lt;handbook&gt;');
    expect(html).toContain('Press &amp; Co');
    expect(html).toContain('a &lt;mark&gt;');
    expect(html).toContain('Peoples outlast states');
    expect(html).toContain('No image files are shipped.');
    expect(html).not.toContain('A <handbook>');
  });

  it('orders known eras and leaves an unknown region id as stored', () => {
    const html = referenceHtml({
      notes: [
        { ...oneNote, eraId: 'era_1800_2000', macroRegion: 'europe' },
        { ...oneNote, eraId: 'era_3300bce_2000', macroRegion: 'not_a_region' },
      ],
      sources: [],
      geography,
      colophon: 'Chronos Atlas',
    });
    const early = html.indexOf('3300–2000 BCE');
    const late = html.indexOf('1800–2000 CE');
    expect(early).toBeGreaterThan(-1);
    expect(early).toBeLessThan(late);
    expect(html).toContain('>not_a_region<');
    expect(html).toContain('No sources are stored.');
  });

  it('includes a stored why-it-matters line, a source title, the reading key, and the colophon', () => {
    const dataset = datasetSchema.parse(loadDataset());
    const html = referenceHtml({
      notes: dataset.notes,
      sources: dataset.sources,
      geography,
      colophon: colophonText([]),
    });
    const why = dataset.notes.find((note) =>
      note.whyItMatters.includes('independence dates'),
    );
    const source = dataset.sources.find((row) => row.id === 'british_library');
    expect(why?.whyItMatters).toBeTruthy();
    expect(source?.title).toBeTruthy();
    expect(html).toContain(why?.whyItMatters ?? '');
    expect(html).toContain(source?.title ?? '');
    expect(html).toContain('Peoples outlast states');
    expect(html).toContain('No image files are shipped.');
    expect(html).toContain('West and Central Asia');
  });
});

describe('reference text checks', () => {
  it('requires the reading key and the colophon sentence when that colophon is used', () => {
    const colophon = colophonText([]);
    expect(referenceTextProblems('CHRONOS outlast why it matters', colophon)).toEqual([
      'pdftotext did not find No image files are shipped.',
    ]);
    const full = `Chronos\noutlast\nWhy it matters\n${colophon}`;
    expect(referenceTextProblems(full, colophon)).toEqual([]);
  });

  it('names a missing shipped face from the pdffonts rows', () => {
    const rows = [
      { name: 'AAAAAA+BarlowCondensed-Bold', type: 'CID TrueType', embedded: true },
    ];
    expect(referenceFontProblems(rows, ['BarlowCondensed', 'SourceSans'])).toEqual([
      'pdffonts did not list a name containing SourceSans',
    ]);
    expect(
      referenceFontProblems([{ name: 'X', type: 'Type 1', embedded: false }], []),
    ).toEqual(['X emb=no']);
  });
});
