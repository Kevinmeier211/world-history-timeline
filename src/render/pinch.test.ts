import { describe, expect, it } from 'vitest';

import { bindPinch } from './pinch.ts';

function point(type: string, id: number, x: number, y = 0): PointerEvent {
  return new PointerEvent(type, {
    pointerId: id,
    clientX: x,
    clientY: y,
    pointerType: id === 0 ? 'mouse' : 'touch',
    bubbles: true,
    cancelable: true,
  });
}

describe('pinch gesture', () => {
  it('scales with two touches and ignores the mouse', () => {
    const el = document.createElement('div');
    let scale = 2;
    const stop = bindPinch(
      el,
      () => scale,
      (next) => {
        scale = next;
      },
    );
    el.dispatchEvent(point('pointerdown', 1, 0));
    el.dispatchEvent(point('pointerdown', 2, 100));
    el.dispatchEvent(point('pointermove', 2, 200));
    expect(scale).toBe(4);
    el.dispatchEvent(point('pointerup', 1, 0));
    el.dispatchEvent(point('pointermove', 2, 400));
    expect(scale).toBe(4);
    el.dispatchEvent(point('pointerdown', 0, 0));
    el.dispatchEvent(point('pointermove', 0, 80));
    expect(scale).toBe(4);
    stop();
    el.dispatchEvent(point('pointerdown', 3, 0));
    el.dispatchEvent(point('pointerdown', 4, 50));
    el.dispatchEvent(point('pointermove', 4, 150));
    expect(scale).toBe(4);
  });
});
