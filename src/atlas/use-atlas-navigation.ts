import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { formatYear } from '../lib/years';
import { locationQuery, readBrowserLocation, type Location } from './navigation';

export type ReadingTarget =
  'title' | 'evidence' | 'context' | 'object' | 'journey' | 'preview' | 'activity';

const selectors: Record<ReadingTarget, string> = {
  title: '[data-reading-title]',
  evidence: '[data-evidence-title]',
  context: '[data-context-title]',
  object: '.dossier .image-open',
  journey: '[data-journey-title]',
  preview: '.story-preview h2',
  activity: '.family-start > summary',
};
const browserLocation = () =>
  readBrowserLocation(window.location.search, window.location.hash);

interface ReadingPosition {
  x: number;
  y: number;
  selector: string | null;
  label: string | null;
}

// Scope the selector to the current DOM. A saved selector is used only when its
// accessible text still matches after the destination has finished loading.
function focusSelector(element: Element | null): string | null {
  if (!(element instanceof HTMLElement) || element === document.body) return null;
  if (element.id) return '#' + CSS.escape(element.id);
  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current !== document.body) {
    const tag = current.tagName.toLowerCase();
    const siblings: Element[] = current.parentElement
      ? [...current.parentElement.children].filter(
          (sibling) => sibling.tagName === current!.tagName,
        )
      : [];
    parts.unshift(tag + ':nth-of-type(' + (siblings.indexOf(current) + 1) + ')');
    current = current.parentElement;
  }
  return 'body > ' + parts.join(' > ');
}

function focusLabel(element: Element | null) {
  return element?.getAttribute('aria-label') ?? element?.textContent?.trim() ?? null;
}

/** Own URL transitions and deferred focus without capturing notebook or UI drafts. */
export function useAtlasNavigation(ready: boolean) {
  const [location, setLocation] = useState(browserLocation);
  const [yearText, setYearText] = useState(() => formatYear(browserLocation().year));
  const locationKey = useRef(locationQuery(location));
  const positions = useRef(new Map<string, ReadingPosition>());
  const routes = useRef(new Map<string, ReadingPosition>());
  const entryKey = useRef<string | null>(null);
  const pointerOrigin = useRef<HTMLElement | null>(null);
  const restoration = useRef<ReadingPosition | null>(null);
  const focusGeneration = useRef(0);
  const frame = useRef<number | null>(null);
  const refineControls = useRef<HTMLDetailsElement>(null);
  const readingTarget = useRef<ReadingTarget | null>(
    location.journey
      ? 'journey'
      : location.subject
        ? location.evidence
          ? 'evidence'
          : 'title'
        : null,
  );

  const cancelPendingFocus = useCallback(() => {
    focusGeneration.current++;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);

  const rememberPosition = useCallback(() => {
    if (restoration.current || document.querySelector('dialog[open]')) return;
    const active = pointerOrigin.current?.isConnected
      ? pointerOrigin.current
      : document.activeElement;
    const snapshot = {
      x: window.scrollX,
      y: window.scrollY,
      selector: focusSelector(active),
      label: focusLabel(active),
    };
    if (entryKey.current) positions.current.set(entryKey.current, snapshot);
    routes.current.set(locationKey.current, snapshot);
  }, []);

  const focusReading = useCallback(() => {
    const generation = focusGeneration.current;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(async () => {
      frame.current = null;
      await document.fonts.ready;
      if (generation !== focusGeneration.current) return;
      if (document.querySelector('dialog[open]')) {
        readingTarget.current = null;
        restoration.current = null;
        return;
      }
      const requested = readingTarget.current;
      if (!requested) return;
      const requestedTarget = document.querySelector<HTMLElement>(selectors[requested]);
      const contextDisclosure =
        requested === 'context'
          ? requestedTarget?.closest<HTMLDetailsElement>('.dossier-context')
          : null;
      // Journey headings come from the retained summary, before dossier prose loads.
      const readyJourney =
        requested === 'journey' && requestedTarget && !restoration.current;
      if (
        !readyJourney &&
        !contextDisclosure &&
        document.querySelector('[data-reading-ready="false"]')
      )
        return;
      if (contextDisclosure) contextDisclosure.open = true;
      if (requested === 'activity') {
        const details = document.querySelector<HTMLDetailsElement>('.family-start');
        if (details) details.open = true;
      }
      const saved = restoration.current;
      const previousTarget = saved?.selector
        ? document.querySelector<HTMLElement>(saved.selector)
        : null;
      const target =
        (previousTarget && focusLabel(previousTarget) === saved?.label
          ? previousTarget
          : null) ??
        requestedTarget ??
        document.querySelector<HTMLElement>('main h1') ??
        document.querySelector<HTMLElement>('main');
      if (!target) return;
      if (saved) {
        let disclosure = target.closest('details');
        while (disclosure) {
          disclosure.open = true;
          disclosure = disclosure.parentElement?.closest('details') ?? null;
        }
      }
      if (
        !target.hasAttribute('tabindex') &&
        !target.matches('button, input, select, textarea, a[href], summary')
      )
        target.tabIndex = -1;
      target.focus({ preventScroll: true });
      if (saved) {
        window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
      } else {
        const surface =
          requested === 'title' || requested === 'context' || requested === 'journey'
            ? (target.closest(
                '.dossier, .comparison, .chapter-intro, .timeline-intro, .page-reading, .journey-context',
              ) ?? target)
            : target;
        surface.scrollIntoView({
          block: requested === 'preview' ? 'nearest' : 'start',
          behavior: 'instant',
        });
      }
      readingTarget.current = null;
      restoration.current = null;
    });
  }, []);

  useLayoutEffect(() => {
    if (ready) focusReading();
  }, [ready, location, focusReading]);

  useEffect(() => {
    const ensureEntry = () => {
      const state = window.history.state;
      if (typeof state?.chronosEntry === 'string') return state.chronosEntry as string;
      const id = crypto.randomUUID();
      window.history.replaceState({ ...state, chronosEntry: id }, '');
      return id;
    };
    entryKey.current = ensureEntry();
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const pop = () => {
      const restored = browserLocation();
      const key = locationQuery(restored);
      // Same-route anchors retain their native focus and scroll behavior.
      const entry = ensureEntry();
      if (key === locationKey.current && entry === entryKey.current) return;
      entryKey.current = entry;
      pointerOrigin.current = null;
      cancelPendingFocus();
      locationKey.current = key;
      restoration.current = positions.current.get(entry) ?? null;
      readingTarget.current = restored.evidence
        ? 'evidence'
        : restored.journey
          ? 'journey'
          : 'title';
      setLocation(restored);
      setYearText(formatYear(restored.year));
    };
    const pointer = (event: PointerEvent) => {
      // WebKit mouse activation can blur a focused button before its click handler.
      // Retain the activated control as the origin for the subsequent return.
      pointerOrigin.current =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(
              'button, a[href], input, select, textarea, summary',
            )
          : null;
    };
    const keyboard = () => {
      pointerOrigin.current = null;
    };
    const focusChanged = (event: FocusEvent) => {
      // WebKit may focus a tabindex-bearing ancestor during mouse activation.
      // That native focus move still belongs to the pointed-to control; a later
      // move elsewhere supersedes it (for example, keyboard or scripted focus).
      if (
        event.target instanceof Element &&
        !event.target.contains(pointerOrigin.current)
      )
        pointerOrigin.current = null;
      rememberPosition();
    };
    document.addEventListener('pointerdown', pointer);
    document.addEventListener('keydown', keyboard);
    window.addEventListener('popstate', pop);
    window.addEventListener('scroll', rememberPosition, { passive: true });
    document.addEventListener('focusin', focusChanged);
    return () => {
      cancelPendingFocus();
      window.history.scrollRestoration = previousRestoration;
      window.removeEventListener('popstate', pop);
      window.removeEventListener('scroll', rememberPosition);
      document.removeEventListener('focusin', focusChanged);
      document.removeEventListener('pointerdown', pointer);
      document.removeEventListener('keydown', keyboard);
    };
  }, [rememberPosition, cancelPendingFocus]);

  const navigate = useCallback(
    (next: Location, replace = false) => {
      rememberPosition();
      pointerOrigin.current = null;
      cancelPendingFocus();
      if (refineControls.current) refineControls.current.open = false;
      const previous = browserLocation();
      const query = locationQuery(next);
      const changingStop =
        next.journey &&
        (next.journey !== previous.journey || next.step !== previous.step);
      // Returning from a comparison, notebook or another route restores the
      // previously visited reading surface, including its keyboard origin.
      const returning =
        !changingStop &&
        (previous.destination !== next.destination ||
          (!!previous.compare && !next.compare) ||
          (previous.subject !== next.subject && !!next.subject));
      restoration.current = returning ? (routes.current.get(query) ?? null) : null;
      readingTarget.current = changingStop
        ? 'journey'
        : next.subject &&
            next.subject === previous.subject &&
            next.destination === previous.destination &&
            !next.compare &&
            !previous.compare
          ? next.evidence !== previous.evidence
            ? 'evidence'
            : next.object !== previous.object
              ? 'object'
              : next.view !== previous.view && next.view === 'world'
                ? 'context'
                : 'title'
          : 'title';
      if (replace || query === locationKey.current)
        window.history.replaceState(window.history.state, '', query);
      else {
        const id = crypto.randomUUID();
        window.history.pushState({ chronosEntry: id }, '', query);
        entryKey.current = id;
      }
      locationKey.current = query;
      setLocation({ ...next });
      setYearText(formatYear(next.year));
    },
    [rememberPosition, cancelPendingFocus],
  );

  useEffect(() => {
    if (window.location.hash && location.legacy)
      window.history.replaceState(window.history.state, '', locationQuery(location));
  }, [location]);

  const requestReadingTarget = useCallback(
    (target: ReadingTarget | null) => {
      if (target === null) cancelPendingFocus();
      restoration.current = null;
      readingTarget.current = target;
    },
    [cancelPendingFocus],
  );

  return {
    location,
    yearText,
    setYearText,
    navigate,
    requestReadingTarget,
    focusReading,
    refineControls,
  };
}
