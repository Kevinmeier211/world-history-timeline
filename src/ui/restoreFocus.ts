import { useEffect, useRef } from 'react';

/** Move focus into a panel, and put it back where it was when the panel closes. */
export function useRestoreFocus<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement;
    ref.current
      ?.querySelector<HTMLElement>('button, [href], input, select, textarea')
      ?.focus();
    return () => {
      if (previous instanceof HTMLElement && document.contains(previous))
        previous.focus();
    };
  }, [active]);
  return ref;
}
