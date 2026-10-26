import type { CSSProperties, ReactNode } from 'react';

import { POSTER_KICKER, POSTER_TITLE, posterSpan, type LensId } from './frame.ts';

export function PosterFrame({
  lens,
  children,
  sheetHeight,
}: {
  lens: LensId;
  children?: ReactNode;
  sheetHeight?: number;
}) {
  const bodyStyle: CSSProperties | undefined =
    sheetHeight && sheetHeight > 0 ? { height: sheetHeight } : undefined;
  return (
    <div className="poster-frame" data-lens={lens}>
      <header className="title-band">
        <p className="title-kicker">{POSTER_KICKER}</p>
        <h1>{POSTER_TITLE}</h1>
        <p className="title-span">{posterSpan()}</p>
      </header>
      <div className="poster-scroll">
        <div className="poster-body" style={bodyStyle}>
          <div className="chart-well" role="region" aria-label="Chart">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
