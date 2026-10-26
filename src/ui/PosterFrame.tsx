import type { CSSProperties, ReactNode } from 'react';

import {
  POSTER_ERAS,
  POSTER_KICKER,
  POSTER_TITLE,
  eraShare,
  gutterPx,
  posterSpan,
  type LensId,
} from './frame.ts';

function EraGutter({ hidden }: { hidden?: boolean }) {
  return (
    <ol
      className="era-gutter"
      aria-label={hidden ? undefined : 'Eras'}
      aria-hidden={hidden || undefined}
    >
      {POSTER_ERAS.map((era) => (
        <li key={era.id} style={{ flexGrow: eraShare(era) }}>
          {era.name}
        </li>
      ))}
    </ol>
  );
}

export function PosterFrame({
  lens,
  children,
}: {
  lens: LensId;
  children?: ReactNode;
}) {
  const style = { '--gutter': `${gutterPx()}px` } as CSSProperties;
  return (
    <div className="poster-frame" data-lens={lens} style={style}>
      <header className="title-band">
        <p className="title-kicker">{POSTER_KICKER}</p>
        <h1>{POSTER_TITLE}</h1>
        <p className="title-span">{posterSpan()}</p>
      </header>
      <div className="poster-body">
        <EraGutter />
        <div className="chart-well" role="region" aria-label="Chart">
          {children}
        </div>
        <EraGutter hidden />
      </div>
    </div>
  );
}
