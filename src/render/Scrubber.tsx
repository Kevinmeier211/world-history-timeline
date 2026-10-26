import { useEffect, useLayoutEffect, useMemo, useRef, useState, type Ref } from 'react';

import { clientDataset } from '../data/clientDataset.ts';
import { yOfYear } from '../layout/drift.ts';
import { formatYear } from '../lib/years.ts';
import {
  designYFromClient,
  FAMILY_MACRO,
  lineOffset,
  MACRO_REGIONS,
  yearAtDesignY,
  worldAtYear,
  type RegionSnapshot,
} from './scrub.ts';

export function ScrubberView({
  year,
  locked,
  regions,
  onLock,
  onUnlock,
  onPick,
  lineRef,
}: {
  year: number;
  locked: boolean;
  regions: readonly RegionSnapshot[];
  onLock: () => void;
  onUnlock: () => void;
  onPick: (id: string) => void;
  lineRef?: Ref<HTMLDivElement>;
}) {
  const label = formatYear(year);
  return (
    <div ref={lineRef} className="scrubber">
      <div className="scrub-line" />
      <div className="scrub-readout">
        <span>{label}</span>
        {locked ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onUnlock();
            }}
          >
            Unlock
          </button>
        ) : (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onLock();
            }}
          >
            Lock year
          </button>
        )}
      </div>
      {locked ? (
        <section className="scrub-card" aria-label={`World in ${label}`}>
          <h3>World in {label}</h3>
          <ul>
            {regions.map((region) => (
              <li key={region.id}>
                <span className="scrub-region">{region.name}</span>
                {region.polities.length === 0 ? (
                  <span>None</span>
                ) : (
                  region.polities.map((polity) => (
                    <button
                      key={polity.id}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onPick(polity.id);
                      }}
                    >
                      {polity.name}
                    </button>
                  ))
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export function Scrubber({
  scale,
  scrollTop,
  onPick,
}: {
  scale: number;
  scrollTop: number;
  onPick: (id: string) => void;
}) {
  const anchor = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const yearRef = useRef<number | null>(null);
  const lockedRef = useRef(false);
  const [year, setYear] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const regions = useMemo(
    () =>
      year == null || !locked
        ? []
        : worldAtYear(year, clientDataset().polities, MACRO_REGIONS, FAMILY_MACRO),
    [locked, year],
  );

  useEffect(() => {
    const host = anchor.current?.closest('.stage-host');
    if (!(host instanceof HTMLElement) || !(scale > 0)) return;
    const onMove = (event: PointerEvent) => {
      if (lockedRef.current) return;
      if (event.target instanceof Element && event.target.closest('.scrubber')) return;
      const svg = host.querySelector('svg.stage');
      if (!(svg instanceof SVGSVGElement)) return;
      const rect = svg.getBoundingClientRect();
      const next = yearAtDesignY(designYFromClient(event.clientY, rect.top, scale, 0));
      if (next === yearRef.current) return;
      yearRef.current = next;
      setYear(next);
    };
    const onLeave = (event: PointerEvent) => {
      if (lockedRef.current) return;
      const next = event.relatedTarget;
      if (next instanceof Node && host.contains(next)) return;
      yearRef.current = null;
      setYear(null);
    };
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [scale]);

  useLayoutEffect(() => {
    const el = line.current;
    const host = anchor.current?.closest('.stage-host');
    if (!el || !(host instanceof HTMLElement) || year == null || !(scale > 0)) return;
    const svg = host.querySelector('svg.stage');
    if (!(svg instanceof SVGSVGElement)) return;
    const rect = svg.getBoundingClientRect();
    const top = lineOffset(yOfYear(year), rect.top, scale, 0, 0);
    el.style.top = `${top}px`;
    el.style.left = `${rect.left}px`;
    el.style.width = `${rect.width}px`;
    el.dataset.side = top > window.innerHeight * 0.55 ? 'above' : 'below';
    el.style.visibility = 'visible';
    void scrollTop;
  }, [locked, scale, scrollTop, year]);

  return (
    <div ref={anchor} className="scrub-anchor">
      {year != null ? (
        <ScrubberView
          year={year}
          locked={locked}
          regions={regions}
          lineRef={line}
          onLock={() => {
            lockedRef.current = true;
            setLocked(true);
          }}
          onUnlock={() => {
            lockedRef.current = false;
            setLocked(false);
          }}
          onPick={onPick}
        />
      ) : null}
    </div>
  );
}
