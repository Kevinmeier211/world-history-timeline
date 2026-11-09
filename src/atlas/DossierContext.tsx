import { useState, type ReactNode } from 'react';

export function DossierContext({ children }: { children: ReactNode }) {
  const [hasOpened, setHasOpened] = useState(false);
  return (
    <details
      className="dossier-context"
      id="dossier-world-context"
      onToggle={(event) => {
        if (event.currentTarget.open) setHasOpened(true);
      }}
    >
      <summary data-context-title>Show this moment in world context</summary>
      <div className="atlas-context">{hasOpened && children}</div>
    </details>
  );
}
