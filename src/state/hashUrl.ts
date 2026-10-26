import { SCALE_MAX, SCALE_MIN } from '../camera/camera.ts';
import { isLensId, type LensId } from '../ui/frame.ts';

/** Shareable view. Missing fields are the chart defaults. */
export interface ViewLink {
  y?: number;
  z?: number;
  sel?: string;
  lens?: LensId;
  fold: readonly string[];
}

export interface ViewTrail {
  entries: readonly string[];
  index: number;
}

const ID_RE = /^[a-z][a-z0-9_]*$/;

function formatZoom(zoom: number): string {
  const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, zoom));
  return String(Math.round(clamped * 1000) / 1000);
}

function cleanFold(ids: readonly string[]): string[] {
  return [...new Set(ids.filter((id) => ID_RE.test(id)))].sort((a, b) =>
    a.localeCompare(b),
  );
}

/** `#y=-221&z=1.4&sel=han&lens=trade&fold=chinese`, or empty when nothing is set. */
export function serializeView(view: ViewLink): string {
  const params = new URLSearchParams();
  if (view.y !== undefined && Number.isInteger(view.y) && view.y !== 0) {
    params.set('y', String(view.y));
  }
  if (view.z !== undefined && Number.isFinite(view.z))
    params.set('z', formatZoom(view.z));
  if (view.sel && ID_RE.test(view.sel)) params.set('sel', view.sel);
  if (view.lens && view.lens !== 'all') params.set('lens', view.lens);
  const fold = cleanFold(view.fold);
  if (fold.length > 0) params.set('fold', fold.join(','));
  const query = params.toString();
  return query ? `#${query}` : '';
}

/** Read a hash. Bad fields are dropped. Zoom is clamped to the camera range. */
export function parseView(hash: string): ViewLink {
  const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
  const view: ViewLink = { fold: [] };
  const year = Number(params.get('y'));
  if (Number.isInteger(year) && year !== 0) view.y = year;
  const zoom = Number(params.get('z'));
  if (Number.isFinite(zoom) && params.get('z')) {
    view.z = Number(formatZoom(zoom));
  }
  const sel = params.get('sel');
  if (sel && ID_RE.test(sel)) view.sel = sel;
  const lens = params.get('lens');
  if (lens && isLensId(lens) && lens !== 'all') view.lens = lens;
  view.fold = cleanFold((params.get('fold') ?? '').split(','));
  return view;
}

export function pushView(trail: ViewTrail, view: ViewLink): ViewTrail {
  const hash = serializeView(view);
  if (trail.entries[trail.index] === hash) return trail;
  const entries = trail.entries.slice(0, trail.index + 1);
  entries.push(hash);
  return { entries, index: entries.length - 1 };
}

export function replaceView(trail: ViewTrail, view: ViewLink): ViewTrail {
  const hash = serializeView(view);
  if (trail.entries.length === 0) return { entries: [hash], index: 0 };
  if (trail.entries[trail.index] === hash) return trail;
  const entries = trail.entries.slice();
  entries[trail.index] = hash;
  return { entries, index: trail.index };
}

export function backView(trail: ViewTrail): ViewTrail {
  if (trail.index <= 0) return trail;
  return { entries: trail.entries, index: trail.index - 1 };
}

export function forwardView(trail: ViewTrail): ViewTrail {
  if (trail.index >= trail.entries.length - 1) return trail;
  return { entries: trail.entries, index: trail.index + 1 };
}

export function viewAt(trail: ViewTrail): ViewLink {
  return parseView(trail.entries[trail.index] ?? '');
}

function sameHash(current: string, hash: string): boolean {
  return current === hash || (hash === '' && (current === '' || current === '#'));
}

/** Write the link into the address bar. `pushState` does not fire `hashchange`. */
export function publishView(view: ViewLink, mode: 'push' | 'replace' = 'push'): void {
  if (typeof window === 'undefined') return;
  const hash = serializeView(view);
  if (sameHash(window.location.hash, hash)) return;
  const url = `${window.location.pathname}${window.location.search}${hash}`;
  if (mode === 'replace') window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);
}

export function readLocationView(): ViewLink {
  if (typeof window === 'undefined') return { fold: [] };
  return parseView(window.location.hash);
}
