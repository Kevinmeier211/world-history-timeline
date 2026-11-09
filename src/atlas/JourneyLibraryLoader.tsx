import { useEffect, useLayoutEffect, useState, type ComponentProps } from 'react';
import type { JourneyLibrary } from './JourneyLibrary';

/** The exploration entrance does not need to download the full route chooser. */
export function JourneyLibraryLoader({
  onReady,
  ...props
}: ComponentProps<typeof JourneyLibrary> & { onReady?: () => void }) {
  const [Library, setLibrary] = useState<typeof JourneyLibrary | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    import('./JourneyLibrary').then(
      (module) => {
        if (active) setLibrary(() => module.JourneyLibrary);
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, []);
  useLayoutEffect(() => {
    if (Library || failed) onReady?.();
  }, [Library, failed, onReady]);
  if (Library) return <Library {...props} />;
  return (
    <section aria-label="Investigations" role="status" data-reading-ready={failed}>
      <h1 data-reading-title tabIndex={-1}>
        {failed
          ? 'The investigation library could not open'
          : 'Opening investigations…'}
      </h1>
      {failed && (
        <>
          <p>Your notebook is still available. Reload to try the library again.</p>
          <button onClick={() => window.location.reload()}>Reload atlas</button>
        </>
      )}
    </section>
  );
}
