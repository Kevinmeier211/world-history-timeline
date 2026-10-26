import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { posterWorld, SCALE_MAX, SCALE_MIN } from '../camera/camera.ts';
import { Minimap } from './Minimap.tsx';
import { posterModel } from './posterModel.ts';
import { Stage } from './Stage.tsx';
import { Tooltip } from './Tooltip.tsx';
import { ZoomBar } from './ZoomBar.tsx';
import { cameraFromScroll, stageScale } from './visible.ts';
import {
  anchoredScroll,
  chartCommand,
  clampScroll,
  isTypingTarget,
  overlayOffsets,
  panScroll,
  scrollFromMinimap,
  sheetMinWidth,
  steppedScale,
  type OverlayOffsets,
} from './navigate.ts';

export interface SheetSize {
  height: number;
  minWidth: number;
}

interface Metrics {
  width: number;
  portHeight: number;
  scrollTop: number;
  scrollLeft: number;
}

function scrollerOf(host: HTMLElement | null): HTMLElement | null {
  const port = host?.closest('.poster-scroll');
  return port instanceof HTMLElement ? port : null;
}

export function ChartViewport({ onSheet }: { onSheet: (sheet: SheetSize) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [overlay, setOverlay] = useState<OverlayOffsets | null>(null);
  const [zoom, setZoom] = useState(1);
  const world = posterWorld();
  const paint = posterModel();

  useLayoutEffect(() => {
    const el = host.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const port = el.closest('.poster-scroll');
    const measure = () => {
      const scroller = port instanceof HTMLElement ? port : el;
      const width = scroller.clientWidth;
      if (width <= 0) return;
      const next = {
        width,
        portHeight: scroller.clientHeight,
        scrollTop: scroller.scrollTop,
        scrollLeft: scroller.scrollLeft,
      };
      setMetrics((prev) =>
        prev &&
        prev.width === next.width &&
        prev.portHeight === next.portHeight &&
        prev.scrollTop === next.scrollTop &&
        prev.scrollLeft === next.scrollLeft
          ? prev
          : next,
      );
      const rect = scroller.getBoundingClientRect();
      const nextOverlay = overlayOffsets(
        {
          top: rect.top,
          right: rect.left + scroller.clientLeft + scroller.clientWidth,
          bottom: rect.top + scroller.clientTop + scroller.clientHeight,
        },
        { width: window.innerWidth, height: window.innerHeight },
      );
      setOverlay((prev) =>
        prev &&
        prev.top === nextOverlay.top &&
        prev.right === nextOverlay.right &&
        prev.bottom === nextOverlay.bottom
          ? prev
          : nextOverlay,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (port instanceof HTMLElement) {
      observer.observe(port);
      port.addEventListener('scroll', measure, { passive: true });
    }
    return () => {
      observer.disconnect();
      if (port instanceof HTMLElement) port.removeEventListener('scroll', measure);
    };
  }, []);

  const fit = metrics ? stageScale(metrics.width, world.width) : 1;
  const scale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, fit * zoom));
  const camera = cameraFromScroll(
    metrics?.scrollLeft ?? 0,
    metrics?.scrollTop ?? 0,
    scale,
  );

  const applyScale = (next: number) => {
    const scroller = scrollerOf(host.current);
    if (scroller) {
      scroller.scrollTop = clampScroll(
        anchoredScroll(scroller.scrollTop, scroller.clientHeight, scale, next),
        world.height * next,
        scroller.clientHeight,
      );
    }
    setZoom(fit > 0 ? next / fit : 1);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const command = chartCommand(event.key, isTypingTarget(event.target));
      if (!command) return;
      const scroller = scrollerOf(host.current);
      if (!scroller) return;
      event.preventDefault();
      if (command === 'in' || command === 'out') {
        applyScale(steppedScale(scale, command === 'in' ? 1 : -1));
        return;
      }
      const next = panScroll(
        command,
        { top: scroller.scrollTop, left: scroller.scrollLeft },
        { width: scroller.clientWidth, height: scroller.clientHeight },
        { width: world.width * scale, height: world.height * scale },
      );
      scroller.scrollTop = next.top;
      scroller.scrollLeft = next.left;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useLayoutEffect(() => {
    if (!metrics) return;
    onSheet({
      height: world.height * scale,
      minWidth: sheetMinWidth(world.width * scale, metrics.width),
    });
  }, [metrics, onSheet, scale, world.height, world.width]);

  return (
    <div className="stage-host" ref={host}>
      {metrics ? (
        <Stage
          camera={camera}
          viewport={{ width: metrics.width, height: Math.max(metrics.portHeight, 1) }}
          scale={scale}
          world={world}
          ribbons={paint.ribbons}
          labels={paint.labels}
          connectors={paint.connectors}
          bands={paint.bands}
        />
      ) : null}
      <Tooltip />
      {metrics && overlay ? (
        <div
          className="chart-chrome"
          style={{ top: overlay.top, right: overlay.right, bottom: overlay.bottom }}
        >
          <Minimap
            world={world}
            ribbons={paint.ribbons}
            scrollTop={metrics.scrollTop}
            portHeight={metrics.portHeight}
            scale={scale}
            onJump={(fraction) => {
              const scroller = scrollerOf(host.current);
              if (!scroller) return;
              scroller.scrollTop = clampScroll(
                scrollFromMinimap(fraction, world.height, scroller.clientHeight, scale),
                world.height * scale,
                scroller.clientHeight,
              );
            }}
          />
          <ZoomBar
            onIn={() => applyScale(steppedScale(scale, 1))}
            onOut={() => applyScale(steppedScale(scale, -1))}
            onFit={() => setZoom(1)}
            onOverview={() => {
              const scroller = scrollerOf(host.current);
              const port =
                scroller?.clientHeight ?? metrics?.portHeight ?? world.height;
              const next = Math.min(
                SCALE_MAX,
                Math.max(SCALE_MIN, port / world.height),
              );
              setZoom(fit > 0 ? next / fit : 1);
              if (scroller) {
                scroller.scrollTop = 0;
                scroller.scrollLeft = 0;
              }
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
