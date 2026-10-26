import { useMemo } from 'react';

import { identityCamera, posterWorld } from '../camera/camera.ts';
import { CropMarks } from '../print/CropMarks.tsx';
import {
  fitPrint,
  paperSizeIn,
  posterTypeBoost,
  PRINT_BLEED_IN,
  PRINT_MARGIN_IN,
  type PrintRequest,
} from '../print/sheet.ts';
import { PrintBoostProvider } from '../render/printBoost.tsx';
import { posterFor } from '../render/posterModel.ts';
import { Stage } from '../render/Stage.tsx';
import { PosterFrame } from './PosterFrame.tsx';
import './shell.css';

/** Static sheet. Screen chrome stays on `/`. */
export function PrintPoster({ request }: { request: PrintRequest }) {
  const world = useMemo(() => posterWorld(), []);
  const fit = useMemo(
    () => fitPrint(request.sheet, world.width, world.height),
    [request.sheet, world.height, world.width],
  );
  const boost = useMemo(
    () => posterTypeBoost(world.width, world.height),
    [world.height, world.width],
  );
  const paint = useMemo(() => posterFor(), []);
  const camera = useMemo(() => identityCamera(), []);
  const sheet = request.sheet;
  const bleed = request.bleed;
  const paper = paperSizeIn(sheet, bleed);
  return (
    <div
      className="poster-print"
      data-print={sheet.id}
      data-bleed={bleed ? '1' : '0'}
      style={{ width: `${paper.widthIn}in`, height: `${paper.heightIn}in` }}
    >
      <div
        className="poster-print-sheet"
        style={
          bleed
            ? {
                position: 'absolute',
                left: `${PRINT_BLEED_IN}in`,
                top: `${PRINT_BLEED_IN}in`,
                width: `${sheet.widthIn}in`,
                height: `${sheet.heightIn}in`,
                padding: `${PRINT_MARGIN_IN}in`,
              }
            : { padding: `${PRINT_MARGIN_IN}in` }
        }
      >
        <PosterFrame lens="all" chrome={false}>
          <PrintBoostProvider boost={boost}>
            <Stage
              camera={camera}
              viewport={{ width: world.width, height: world.height }}
              scale={1}
              world={world}
              ribbons={paint.ribbons}
              labels={paint.labels}
              connectors={paint.connectors}
              bands={paint.bands}
              callouts={paint.callouts}
              print={{
                boost,
                widthIn: fit.chartWidthIn,
                heightIn: fit.chartHeightIn,
              }}
            />
          </PrintBoostProvider>
        </PosterFrame>
      </div>
      {bleed ? (
        <CropMarks
          paperWidthIn={paper.widthIn}
          paperHeightIn={paper.heightIn}
          trimWidthIn={sheet.widthIn}
          trimHeightIn={sheet.heightIn}
        />
      ) : null}
    </div>
  );
}
