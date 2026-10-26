import { useMemo } from 'react';

import type { Camera, Size } from '../camera/camera.ts';
import { VISIBLE_PAD, cullY, visibleWorld, type YSpan } from './visible.ts';

export function useVisibleSpans<T extends YSpan>(
  camera: Camera,
  viewport: Size,
  items: readonly T[],
  padScreens = VISIBLE_PAD,
): readonly T[] {
  return useMemo(
    () => cullY(items, visibleWorld(camera, viewport, padScreens)),
    [camera, viewport, items, padScreens],
  );
}
