import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { posterWorld, SCALE_MAX, SCALE_MIN } from '../camera/camera.ts';
import { useView } from '../state/view.ts';
import { benchRibbonCount, padRibbons } from './bench.ts';
import { Minimap } from './Minimap.tsx';
import { useFoldedPaint } from './useFoldedPaint.ts';
import { Scrubber } from './Scrubber.tsx';
import { bindPinch } from './pinch.ts';
import { Stage } from './Stage.tsx';
import { useMilestones } from './useMilestones.ts';
import { Tooltip } from './Tooltip.tsx';
import { ZoomBar } from './ZoomBar.tsx';
import { cameraFromScroll, stageScale } from './visible.ts';
import {
  anchoredScroll,
  approachScroll,
  cameraScale,
  chartCommand,
  clampScroll,
  isTypingTarget,
  overlayOffsets,
  panScroll,
  scrollFromMinimap,
  scrollTopForYear,
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

export function ChartViewport({
  onSheet,
  onOpen,
}: {
  onSheet: (sheet: SheetSize) => void;
  onOpen?: (id: string | null) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const milestones = useMilestones();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [overlay, setOverlay] = useState<OverlayOffsets | null>(null);
  const [zoom, setZoom] = useState(1);
  const selectedId = useView((state) => state.link.sel);
  const lens = useView((state) => state.link.lens ?? 'all');
  const fold = useView((state) => state.link.fold);
  const pin = useView((state) => state.link.pin);
  const flyYear = useView((state) => state.link.y);
  const flown = useRef<string | null>(null);
  const world = posterWorld();
  const paint = useFoldedPaint(fold, pin);
  const bench = benchRibbonCount(
    typeof window === 'undefined' ? '' : window.location.search,
  );
  const ribbons = useMemo(
    () => (bench > 0 ? padRibbons(paint.ribbons, bench) : paint.ribbons),
    [bench, paint.ribbons],
  );

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
  const hashZoom = useView((state) => state.link.z);
  const scale = cameraScale(fit, zoom, hashZoom);
  const laidOut = metrics !== null;

  useEffect(() => {
    if (!laidOut || flyYear === undefined) return;
    const key = `${flyYear}:${selectedId ?? ''}`;
    if (flown.current === key) return;
    const scroller = scrollerOf(host.current);
    if (!scroller) return;
    const target = scrollTopForYear(
      flyYear,
      scale,
      scroller.clientHeight,
      world.height * scale,
    );
    let frame = 0;
    let cancelled = false;
    const done = () => {
      if (!cancelled) flown.current = key;
    };
    const reduced =
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      scroller.scrollTop = target;
      done();
      return () => {
        cancelled = true;
      };
    }
    const from = scroller.scrollTop;
    const start = performance.now();
    const step = (now: number) => {
      if (cancelled) return;
      const next = approachScroll(from, target, now - start, false);
      scroller.scrollTop = next;
      if (next === target) done();
      else frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    const stop = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
    scroller.addEventListener('wheel', stop, { once: true, passive: true });
    return () => {
      stop();
      scroller.removeEventListener('wheel', stop);
    };
  }, [flyYear, laidOut, scale, selectedId, world.height]);
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
    const current = useView.getState().link;
    if (current.z !== undefined) {
      useView.getState().setLink({ ...current, z: cameraScale(1, next) }, 'replace');
    }
  };

  const scaleNow = useRef(scale);
  const applyNow = useRef(applyScale);
  useEffect(() => {
    scaleNow.current = scale;
    applyNow.current = applyScale;
  });

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    return bindPinch(
      el,
      () => scaleNow.current,
      (next) => {
        applyNow.current(next);
      },
    );
  }, []);

  const clearHashZoom = () => {
    const current = useView.getState().link;
    if (current.z === undefined) return;
    const next = { ...current };
    delete next.z;
    useView.getState().setLink(next, 'replace');
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"]')) return;
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
    <div
      className="stage-host"
      ref={host}
      data-ribbon-count={ribbons.length}
      data-scale={scale}
    >
      {metrics ? (
        <Stage
          camera={camera}
          viewport={{ width: metrics.width, height: Math.max(metrics.portHeight, 1) }}
          scale={scale}
          world={world}
          ribbons={ribbons}
          labels={paint.labels}
          connectors={paint.connectors}
          bands={paint.bands}
          callouts={paint.callouts}
          selectedId={selectedId}
          milestones={milestones.marks}
          lens={lens}
          onSelect={(id) => {
            const current = useView.getState().link;
            useView.getState().setLink({ ...current, sel: id }, 'replace');
            onOpen?.(id);
          }}
          onClear={() => {
            const current = useView.getState().link;
            if (current.sel !== undefined) {
              const next = { ...current };
              delete next.sel;
              useView.getState().setLink(next, 'replace');
            }
            onOpen?.(null);
          }}
        />
      ) : null}
      <Tooltip />
      <Scrubber
        scale={scale}
        scrollTop={metrics?.scrollTop ?? 0}
        onPick={(id) => {
          const current = useView.getState().link;
          useView.getState().setLink({ ...current, sel: id }, 'replace');
          onOpen?.(id);
        }}
        milestones={milestones.marks}
        onAddMilestone={milestones.add}
        onRemoveMilestone={milestones.remove}
        onYear={(next) => {
          const scroller = scrollerOf(host.current);
          if (!scroller) return;
          scroller.scrollTop = scrollTopForYear(
            next,
            scale,
            scroller.clientHeight,
            world.height * scale,
          );
        }}
      />
      {metrics && overlay ? (
        <div
          className="chart-chrome"
          style={{ top: overlay.top, right: overlay.right, bottom: overlay.bottom }}
        >
          <Minimap
            world={world}
            ribbons={ribbons}
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
            onFit={() => {
              const current = useView.getState().link;
              if (current.z !== undefined) {
                const scroller = scrollerOf(host.current);
                if (scroller) {
                  scroller.scrollTop = clampScroll(
                    anchoredScroll(
                      scroller.scrollTop,
                      scroller.clientHeight,
                      scale,
                      fit,
                    ),
                    world.height * fit,
                    scroller.clientHeight,
                  );
                }
                clearHashZoom();
              }
              setZoom(1);
            }}
            onOverview={() => {
              const scroller = scrollerOf(host.current);
              const port =
                scroller?.clientHeight ?? metrics?.portHeight ?? world.height;
              const next = Math.min(
                SCALE_MAX,
                Math.max(SCALE_MIN, port / world.height),
              );
              setZoom(fit > 0 ? next / fit : 1);
              clearHashZoom();
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
