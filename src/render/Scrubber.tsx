import { useEffect, useLayoutEffect, useMemo, useRef, useState, type Ref } from 'react';

import { clientDataset } from '../data/clientDataset.ts';
import { yOfYear } from '../layout/drift.ts';
import { formatYear } from '../lib/years.ts';
import { type Milestone } from '../state/milestones.ts';
import {
  designYFromClient,
  FAMILY_MACRO,
  LAPSE_MS,
  lineOffset,
  MACRO_REGIONS,
  nextLapseYear,
  yearAtDesignY,
  worldAtYear,
  type RegionSnapshot,
} from './scrub.ts';

function MilestoneForm({
  year,
  marks,
  onAdd,
  onRemove,
}: {
  year: number;
  marks: readonly Milestone[];
  onAdd: (year: number, label: string) => void;
  onRemove: (id: string) => void;
}) {
  const here = marks.filter((mark) => mark.year === year);
  return (
    <form
      className="milestone-form"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        onAdd(year, String(data.get('label') ?? ''));
        event.currentTarget.reset();
      }}
    >
      <label>
        Mark this year
        <input name="label" maxLength={48} />
      </label>
      <button type="submit">Add mark</button>
      {here.length > 0 ? (
        <ul>
          {here.map((mark) => (
            <li key={mark.id}>
              <span>{mark.label}</span>
              <button type="button" onClick={() => onRemove(mark.id)}>
                {`Remove ${mark.label}`}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}

export function ScrubberView({
  year,
  locked,
  playing,
  reduced,
  regions,
  onLock,
  onUnlock,
  onPlay,
  onPause,
  onPick,
  lineRef,
  milestones = [],
  onAddMilestone,
  onRemoveMilestone,
}: {
  year: number;
  locked: boolean;
  playing: boolean;
  reduced: boolean;
  regions: readonly RegionSnapshot[];
  onLock: () => void;
  onUnlock: () => void;
  onPlay: () => void;
  onPause: () => void;
  onPick: (id: string) => void;
  lineRef?: Ref<HTMLDivElement>;
  milestones?: readonly Milestone[];
  onAddMilestone?: (year: number, label: string) => void;
  onRemoveMilestone?: (id: string) => void;
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
        {playing ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPause();
            }}
          >
            Pause
          </button>
        ) : (
          <button
            type="button"
            disabled={reduced}
            onClick={(event) => {
              event.stopPropagation();
              onPlay();
            }}
          >
            Play
          </button>
        )}
      </div>
      {locked ? (
        <section className="scrub-card" aria-label={`World in ${label}`}>
          <h3>World in {label}</h3>
          {onAddMilestone && onRemoveMilestone ? (
            <MilestoneForm
              year={year}
              marks={milestones}
              onAdd={onAddMilestone}
              onRemove={onRemoveMilestone}
            />
          ) : null}
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

function prefersReducedMotion(): boolean {
  if (typeof window.matchMedia !== 'function') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function Scrubber({
  scale,
  scrollTop,
  onPick,
  onYear,
  milestones,
  onAddMilestone,
  onRemoveMilestone,
}: {
  scale: number;
  scrollTop: number;
  onPick: (id: string) => void;
  onYear?: (year: number) => void;
  milestones: readonly Milestone[];
  onAddMilestone: (year: number, label: string) => void;
  onRemoveMilestone: (id: string) => void;
}) {
  const anchor = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const yearRef = useRef<number | null>(null);
  const lockedRef = useRef(false);
  const onYearRef = useRef(onYear);
  const [year, setYear] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(prefersReducedMotion);
  const regions = useMemo(
    () =>
      year == null || !locked
        ? []
        : worldAtYear(year, clientDataset().polities, MACRO_REGIONS, FAMILY_MACRO),
    [locked, year],
  );

  useEffect(() => {
    onYearRef.current = onYear;
  }, [onYear]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      setReduced(query.matches);
      if (query.matches) setPlaying(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!playing || reduced) return;
    const id = window.setInterval(() => {
      const current = yearRef.current;
      if (current == null) return;
      const next = nextLapseYear(current);
      if (next == null) {
        setPlaying(false);
        return;
      }
      yearRef.current = next;
      setYear(next);
      onYearRef.current?.(next);
    }, LAPSE_MS);
    return () => window.clearInterval(id);
  }, [playing, reduced]);

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
          playing={playing}
          reduced={reduced}
          onPlay={() => {
            if (reduced || yearRef.current == null) return;
            lockedRef.current = true;
            setLocked(true);
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onUnlock={() => {
            lockedRef.current = false;
            setLocked(false);
            setPlaying(false);
          }}
          onPick={onPick}
          milestones={milestones}
          onAddMilestone={onAddMilestone}
          onRemoveMilestone={onRemoveMilestone}
        />
      ) : null}
    </div>
  );
}
