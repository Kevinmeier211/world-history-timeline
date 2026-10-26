import type { CSSProperties, ReactNode } from 'react';

import { POSTER_KICKER, POSTER_TITLE, posterSpan, type LensId } from './frame.ts';

export function PosterFrame({
  lens,
  children,
  sheetHeight,
  sheetMinWidth,
  readingOpen = false,
  onReading,
  columnsOpen = false,
  onColumns,
  storiesOpen = false,
  onStories,
  eraOpen = false,
  onEra,
  chrome = true,
}: {
  lens: LensId;
  children?: ReactNode;
  sheetHeight?: number;
  sheetMinWidth?: number;
  readingOpen?: boolean;
  onReading?: () => void;
  columnsOpen?: boolean;
  onColumns?: () => void;
  storiesOpen?: boolean;
  onStories?: () => void;
  eraOpen?: boolean;
  onEra?: () => void;
  /** Title actions are screen chrome. Print leaves them off. */
  chrome?: boolean;
}) {
  const bodyStyle: CSSProperties = {};
  if (sheetHeight && sheetHeight > 0) bodyStyle.height = sheetHeight;
  if (sheetMinWidth && sheetMinWidth > 0) bodyStyle.minWidth = sheetMinWidth;
  return (
    <div className="poster-frame" data-lens={lens}>
      <header className="title-band">
        <p className="title-kicker">{POSTER_KICKER}</p>
        <h1>{POSTER_TITLE}</h1>
        <p className="title-span">{posterSpan()}</p>
        {chrome ? (
          <div className="title-actions">
            <button
              type="button"
              className="reading-open"
              aria-expanded={readingOpen}
              aria-controls="reading-key"
              onClick={onReading}
            >
              How to read this
            </button>
            {onColumns ? (
              <button
                type="button"
                className="reading-open"
                aria-expanded={columnsOpen}
                aria-controls="columns-panel"
                onClick={onColumns}
              >
                Columns
              </button>
            ) : null}
            {onStories ? (
              <button
                type="button"
                className="reading-open"
                aria-expanded={storiesOpen}
                aria-controls="story-panel"
                onClick={onStories}
              >
                Stories
              </button>
            ) : null}
            {onEra ? (
              <button
                type="button"
                className="reading-open"
                aria-expanded={eraOpen}
                aria-controls="era-panel"
                onClick={onEra}
              >
                Era reading
              </button>
            ) : null}
            <a className="reading-open" href="#/credits">
              Credits
            </a>
          </div>
        ) : null}
      </header>
      <div className="poster-scroll">
        <div
          className="poster-body"
          style={Object.keys(bodyStyle).length > 0 ? bodyStyle : undefined}
        >
          <div
            className="chart-well"
            id="chart"
            role="region"
            aria-label="Chart"
            tabIndex={-1}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
