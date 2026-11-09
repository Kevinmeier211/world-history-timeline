import { useEffect, useLayoutEffect, useState, type ComponentProps } from 'react';
import type { WorldContext } from './WorldContext';

/** Load geographic data and map controls only when the world view is selected. */
export function WorldContextLoader({
  onReady,
  ...props
}: ComponentProps<typeof WorldContext> & { onReady?: () => void }) {
  const [World, setWorld] = useState<typeof WorldContext | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    import('./WorldContext').then(
      (module) => {
        if (active) setWorld(() => module.WorldContext);
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
    if (World || failed) onReady?.();
  }, [World, failed, onReady]);
  if (World) return <World {...props} />;
  const Heading = props.inDossier ? 'h2' : 'h1';
  return (
    <section
      className="world-context"
      role="status"
      data-reading-ready={props.inDossier ? undefined : failed}
    >
      <Heading
        data-context-title={props.inDossier ? undefined : true}
        data-reading-title={props.inDossier ? undefined : true}
        tabIndex={props.inDossier ? undefined : -1}
      >
        {failed ? 'The world view could not open' : 'Opening the world view…'}
      </Heading>
      {failed && (
        <>
          <p>
            The timeline and notebook are still available. Reload to try the world view
            again.
          </p>
          <button onClick={() => props.showTimeline(props.year, props.selected)}>
            ← Living timeline
          </button>
          <button onClick={() => window.location.reload()}>Reload atlas</button>
        </>
      )}
    </section>
  );
}
