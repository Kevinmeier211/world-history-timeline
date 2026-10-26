import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Dossier } from './Dossier.tsx';
import type { DossierModel } from './dossier.ts';
import { loadWikiExtract, resetWikiCache, wikiSummaryUrl } from './wiki.ts';

const model: DossierModel = {
  id: 'rome',
  name: 'Roman Republic',
  dates: 'c. 509–27 BCE',
  confidence: 'Approximate',
  summary: 'A republic on the Tiber.',
  keyFacts: [],
  rulers: [],
  lineage: [],
  callouts: [],
  sources: [],
  verification: 'Not yet cross-checked',
  mediaNote: 'No image is attached.',
  wikipediaTitle: 'Roman_Republic',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

describe('wikipedia extract', () => {
  afterEach(() => {
    cleanup();
    resetWikiCache();
    vi.unstubAllGlobals();
  });

  it('caches a summary and drops a failed response', async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ title: 'Roman Republic', extract: '  A republic. ' }),
    );
    const first = await loadWikiExtract('Roman_Republic', fetchImpl);
    const second = await loadWikiExtract('Roman_Republic', fetchImpl);
    expect(first).toEqual({ title: 'Roman Republic', extract: 'A republic.' });
    expect(second).toEqual(first);
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(wikiSummaryUrl('Roman Republic')).toContain('Roman%20Republic');

    const failing = vi.fn(async () => jsonResponse({}, 404));
    await expect(loadWikiExtract('Missing', failing)).rejects.toThrow(/wikipedia 404/);
    expect(failing).toHaveBeenCalledOnce();
  });

  it('shows the extract, and a failure, under the Wikipedia label', async () => {
    const user = userEvent.setup();
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ title: 'Roman Republic', extract: 'Senate and consuls.' }),
    );
    vi.stubGlobal('fetch', fetchImpl);
    const view = render(createElement(Dossier, { model, onClose: () => {} }));
    await user.click(screen.getByRole('button', { name: 'From Wikipedia' }));
    const note = await screen.findByRole('region', { name: 'From Wikipedia' });
    expect(note).toHaveTextContent('Senate and consuls.');
    expect(screen.getByRole('heading', { name: 'From Wikipedia' })).toBeInTheDocument();
    view.unmount();

    resetWikiCache();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({}, 503)),
    );
    render(createElement(Dossier, { model, onClose: () => {} }));
    await user.click(screen.getByRole('button', { name: 'From Wikipedia' }));
    expect(await screen.findByText('Wikipedia did not respond.')).toBeInTheDocument();
  });

  it('aborts the request when the dossier closes', async () => {
    const user = userEvent.setup();
    let signal: AbortSignal | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) => {
        signal = init?.signal ?? undefined;
        return new Promise(() => undefined);
      }),
    );
    const view = render(createElement(Dossier, { model, onClose: () => {} }));
    await user.click(screen.getByRole('button', { name: 'From Wikipedia' }));
    expect(screen.getByText('Loading the Wikipedia extract.')).toBeInTheDocument();
    view.unmount();
    expect(signal?.aborted).toBe(true);
  });
});
