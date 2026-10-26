import { pinchScale, pointerDistance } from './navigate.ts';

/** Two-finger pinch on `el`. A mouse pointer does not zoom. */
export function bindPinch(
  el: HTMLElement,
  readScale: () => number,
  apply: (scale: number) => void,
): () => void {
  const points = new Map<number, { x: number; y: number }>();
  let origin = { distance: 0, scale: 1 };
  const place = (event: PointerEvent) => {
    points.set(event.pointerId, { x: event.clientX, y: event.clientY });
  };
  const fingers = () => {
    const [a, b] = [...points.values()];
    if (!a || !b || points.size !== 2) return null;
    return { a, b };
  };
  const onDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') return;
    place(event);
    const pair = fingers();
    if (!pair) return;
    origin = { distance: pointerDistance(pair.a, pair.b), scale: readScale() };
  };
  const onMove = (event: PointerEvent) => {
    if (!points.has(event.pointerId)) return;
    place(event);
    const pair = fingers();
    if (!pair) return;
    event.preventDefault();
    apply(pinchScale(origin.scale, origin.distance, pointerDistance(pair.a, pair.b)));
  };
  const onUp = (event: PointerEvent) => {
    points.delete(event.pointerId);
  };
  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onUp);
  return () => {
    el.removeEventListener('pointerdown', onDown);
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerup', onUp);
    el.removeEventListener('pointercancel', onUp);
  };
}
