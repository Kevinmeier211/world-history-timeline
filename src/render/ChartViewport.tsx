import { useLayoutEffect, useRef, useState } from 'react';

import { posterWorld } from '../camera/camera.ts';
import { posterModel } from './posterModel.ts';
import { Stage } from './Stage.tsx';
import { cameraFromScroll, stageScale } from './visible.ts';

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

export function ChartViewport({ onSheet }: { onSheet: (sheet: SheetSize) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const world = posterWorld();
  const paint = posterModel();

  useLayoutEffect(() => {
    const el = host.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const port = el.closest('.poster-scroll');
    const measure = () => {
      const width = el.clientWidth;
      if (width <= 0) return;
      const scroller = port instanceof HTMLElement ? port : el;
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

  const scale = metrics ? stageScale(metrics.width, world.width) : 1;
  const camera = cameraFromScroll(
    metrics?.scrollLeft ?? 0,
    metrics?.scrollTop ?? 0,
    scale,
  );

  useLayoutEffect(() => {
    if (!metrics) return;
    onSheet({ height: world.height * scale, minWidth: 0 });
  }, [metrics, onSheet, scale, world.height]);

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
    </div>
  );
}
