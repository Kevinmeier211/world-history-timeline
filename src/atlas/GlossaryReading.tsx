import { useEffect, useId, useRef } from 'react';
import type { GlossaryTerm } from './model';
import type { GlossaryPart } from './glossary-reading';

export function GlossaryText({
  parts,
  define,
}: {
  parts: GlossaryPart[];
  define: (term: GlossaryTerm, trigger: HTMLButtonElement) => void;
}) {
  return parts.map((part, i) =>
    part.term ? (
      <button
        type="button"
        className="inline-term"
        data-term={part.term.id}
        key={i}
        aria-haspopup="dialog"
        aria-label={`Define ${part.term.name}`}
        onClick={(event) => define(part.term!, event.currentTarget)}
      >
        {part.text}
      </button>
    ) : (
      part.text
    ),
  );
}

export function GlossaryDefinition({
  term,
  dismiss,
}: {
  term: GlossaryTerm | null;
  dismiss: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId(),
    description = useId();
  useEffect(() => {
    if (!term || !dialog.current) return;
    const node = dialog.current;
    const overflow = document.body.style.overflow;
    const gutter = document.documentElement.style.scrollbarGutter;
    const scroll = window.scrollY;
    document.documentElement.style.scrollbarGutter = 'stable';
    document.body.style.overflow = 'hidden';
    if (!node.open) node.showModal();
    return () => {
      document.body.style.overflow = overflow;
      document.documentElement.style.scrollbarGutter = gutter;
      if (node.isConnected) window.scrollTo({ top: scroll, behavior: 'instant' });
    };
  }, [term]);
  return (
    <dialog
      className="glossary-dialog"
      ref={dialog}
      aria-labelledby={title}
      aria-describedby={description}
      onClose={dismiss}
    >
      <header>
        <h2 id={title}>{term?.name}</h2>
        <button type="button" onClick={() => dialog.current?.close()}>
          Back to reading
        </button>
      </header>
      <p id={description}>{term?.definition}</p>
    </dialog>
  );
}
