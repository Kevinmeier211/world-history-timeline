import { useEffect, useState } from 'react';

import { creditsLines } from '../data/credits.ts';
import generated from '../data/media.generated.json';
import { isCreditsHash, restoreChartHash } from '../state/hashUrl.ts';
import { useView } from '../state/view.ts';

export function creditPageLines(imageCount: number): string[] {
  if (imageCount > 0) {
    throw new Error('shipped images are listed by the colophon generator');
  }
  return creditsLines([]);
}

export function CreditsPage({ onClose }: { onClose: () => void }) {
  const lines = creditPageLines(generated.images.length);
  return (
    <section className="credits-page" aria-label="Credits">
      <h2>Credits</h2>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <button type="button" onClick={onClose}>
        Back to the chart
      </button>
    </section>
  );
}

/** Opens from `#/credits` and leaves the chart link untouched. */
export function CreditsGate() {
  const [open, setOpen] = useState(
    () => typeof window !== 'undefined' && isCreditsHash(window.location.hash),
  );
  useEffect(() => {
    const sync = () => setOpen(isCreditsHash(window.location.hash));
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);
  if (!open) return null;
  return (
    <CreditsPage
      onClose={() => {
        restoreChartHash(useView.getState().link);
        setOpen(false);
      }}
    />
  );
}
