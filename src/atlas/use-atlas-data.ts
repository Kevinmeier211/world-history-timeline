import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { loadCorpus, loadSourceRecords } from './data';
import type { RuntimeCorpus } from './model';

export function useAtlasData() {
  const [corpus, setCorpus] = useState<RuntimeCorpus | null>(null);
  const [error, setError] = useState('');
  const [bibliography, setBibliography] = useState<
    'idle' | 'loading' | 'failed' | 'ready'
  >('idle');
  const [bibliographyAttempt, setBibliographyAttempt] = useState(0);
  const bibliographyNotice = useRef<HTMLDivElement>(null);
  const bibliographyRetry = useRef<HTMLButtonElement>(null);
  const restoreBibliographyFocus = useRef(false);
  const recoveryLocation = useRef('');
  const recoveryListeners = useRef<(() => void) | null>(null);
  const finishRecovery = useCallback(() => {
    restoreBibliographyFocus.current = false;
    recoveryListeners.current?.();
    recoveryListeners.current = null;
  }, []);
  const retryBibliography = useCallback(() => {
    restoreBibliographyFocus.current = true;
    recoveryLocation.current = window.location.href;
    setBibliographyAttempt((attempt) => attempt + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadCorpus().then(
      (loaded) => {
        if (!cancelled) setCorpus(loaded);
      },
      (reason: Error) => {
        if (!cancelled) setError(reason.message);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // First-paint metadata waits for the initial image and browser idle time.
    // Navigation is deliberately absent from this effect: failures need Retry.
    if (!corpus || corpus.sources.some((source) => source.url)) return;
    let cancelled = false;
    let scheduled = false;
    let idle: number | null = null;
    let imageWait: number | null = null;
    const updateMetadata = (update: () => void) => {
      // Initial bibliography work must yield to reading and dialog interactions.
      // Explicit recovery stays urgent so its status and focus remain immediate.
      if (bibliographyAttempt > 0) update();
      else startTransition(update);
    };
    const start = () => {
      if (cancelled) return;
      updateMetadata(() => setBibliography('loading'));
      loadSourceRecords(corpus.sources.map((source) => source.id)).then(
        (sources) => {
          if (cancelled) return;
          updateMetadata(() => {
            setCorpus((current) => (current ? { ...current, sources } : current));
            setBibliography('ready');
          });
        },
        () => {
          if (!cancelled) updateMetadata(() => setBibliography('failed'));
        },
      );
    };
    const stop = () => {
      cancelled = true;
      if (idle !== null) window.cancelIdleCallback(idle);
      if (imageWait !== null) window.clearTimeout(imageWait);
    };
    if (bibliographyAttempt > 0) {
      start();
      return stop;
    }
    const schedule = () => {
      if (cancelled || scheduled) return;
      scheduled = true;
      if (imageWait !== null) window.clearTimeout(imageWait);
      if (typeof window.requestIdleCallback === 'function')
        idle = window.requestIdleCallback(start, { timeout: 1500 });
      else start();
    };
    const image = document.querySelector(
      '.living-preview img, .meanwhile-preview img, .story-gallery img, .era-anchors img',
    );
    if (image instanceof HTMLImageElement && !image.complete) {
      image.addEventListener('load', schedule, { once: true });
      image.addEventListener('error', schedule, { once: true });
      // A removed or stalled image may never emit either event. Keep the
      // first-image preference bounded, then use the normal idle scheduling.
      imageWait = window.setTimeout(schedule, 1500);
      return () => {
        stop();
        image.removeEventListener('load', schedule);
        image.removeEventListener('error', schedule);
      };
    }
    schedule();
    return stop;
  }, [corpus, bibliographyAttempt]);

  useEffect(() => {
    if (!restoreBibliographyFocus.current) return;
    const focusChanged = (event: FocusEvent) => {
      if (!bibliographyNotice.current?.contains(event.target as Node)) finishRecovery();
    };
    // These listeners exist only during an explicit recovery. New navigation
    // or interaction takes priority, including during the final font/frame wait.
    document.addEventListener('focusin', focusChanged);
    document.addEventListener('pointerdown', finishRecovery);
    document.addEventListener('keydown', finishRecovery);
    window.addEventListener('popstate', finishRecovery);
    window.addEventListener('hashchange', finishRecovery);
    const stop = () => {
      document.removeEventListener('focusin', focusChanged);
      document.removeEventListener('pointerdown', finishRecovery);
      document.removeEventListener('keydown', finishRecovery);
      window.removeEventListener('popstate', finishRecovery);
      window.removeEventListener('hashchange', finishRecovery);
    };
    recoveryListeners.current = stop;
    return stop;
  }, [bibliographyAttempt, bibliography, finishRecovery]);

  useLayoutEffect(() => {
    if (!restoreBibliographyFocus.current) return;
    if (recoveryLocation.current !== window.location.href) {
      finishRecovery();
      return;
    }
    if (bibliography === 'loading') {
      bibliographyNotice.current?.focus();
      return;
    }
    if (bibliography === 'failed') {
      (bibliographyRetry.current ?? bibliographyNotice.current)?.focus();
      finishRecovery();
      return;
    }
    if (bibliography !== 'ready') return;
    let cancelled = false;
    // Corpus recovery also schedules reading focus. Restore after that frame
    // and font loading, while allowing cleanup to cancel either pending frame.
    let frame = requestAnimationFrame(async () => {
      await document.fonts.ready;
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        if (
          cancelled ||
          !restoreBibliographyFocus.current ||
          recoveryLocation.current !== window.location.href ||
          document.querySelector('dialog[open]')
        ) {
          if (!cancelled) finishRecovery();
          return;
        }
        finishRecovery();
        const target =
          document.querySelector<HTMLElement>('[data-reading-title]') ??
          document.querySelector<HTMLElement>('[data-context-title]') ??
          document.querySelector<HTMLElement>('.story-gallery h2') ??
          document.querySelector<HTMLElement>('.skip-link');
        if (!target) return;
        if (target.tabIndex < 0) target.tabIndex = -1;
        target.focus();
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [bibliography, finishRecovery]);

  return {
    corpus,
    error,
    bibliography,
    bibliographyNotice,
    bibliographyRetry,
    retryBibliography,
  };
}
