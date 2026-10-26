import { useEffect, useMemo, useRef, useState } from 'react';

import { foldDuration } from '../layout/interpolate.ts';
import { paintFrame } from './foldPaint.ts';
import { posterFor, type PosterPaint } from './posterModel.ts';

const NO_PIN: readonly string[] = [];

function prefersReducedMotion(): boolean {
  if (typeof window.matchMedia !== 'function') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** Solved paint for the current columns. Ribbons tween unless motion is reduced. */
export function useFoldedPaint(
  fold: readonly string[],
  pin: readonly string[] | undefined,
): PosterPaint {
  const pinned = pin ?? NO_PIN;
  const target = useMemo(() => posterFor(fold, pinned), [fold, pinned]);
  const reduced = useReducedMotion();
  const ms = foldDuration(reduced);
  const animate = ms > 0 && typeof requestAnimationFrame === 'function';
  const [shown, setShown] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    if (!animate) {
      fromRef.current = target;
      if (typeof requestAnimationFrame !== 'function') return;
      const id = requestAnimationFrame(() => {
        setShown((prev) => (prev === target ? prev : target));
      });
      return () => cancelAnimationFrame(id);
    }
    const from = fromRef.current;
    if (from === target) return;
    const started = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / ms);
      if (t >= 1) {
        fromRef.current = target;
        setShown(target);
        return;
      }
      const next = paintFrame(from, target, t);
      fromRef.current = next;
      setShown(next);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [animate, ms, target]);

  return animate ? shown : target;
}
