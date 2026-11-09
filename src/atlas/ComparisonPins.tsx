import type { Subject } from './model';

export interface ComparePinControls {
  ids: string[];
  toggle: (id: string) => void;
}

export function ComparePinButton({
  subject,
  pins,
}: {
  subject: Subject;
  pins: ComparePinControls;
}) {
  const pinned = pins.ids.includes(subject.id);
  return (
    <button
      className="case-pin"
      aria-label={`Pin to compare: ${subject.name}`}
      aria-pressed={pinned}
      disabled={pins.ids.length === 2 && !pinned}
      onClick={() => pins.toggle(subject.id)}
    >
      Pin to compare
    </button>
  );
}

export function ComparePinTray({
  names,
  compare,
  clear,
}: {
  names: string[];
  compare: () => void;
  clear: () => void;
}) {
  const announcement =
    names.length === 1
      ? `Pinned: ${names[0]}. Pin one more to compare.`
      : names.length === 2
        ? `Pinned: ${names[0]} and ${names[1]}.`
        : '';
  return (
    <div className={names.length ? 'compare-pin-tray' : undefined}>
      <p role="status" className={names.length ? undefined : 'sr-only'}>
        {announcement}
      </p>
      {names.length > 0 && (
        <div className="compare-pin-actions">
          <button aria-label="Clear comparison pins" onClick={clear}>
            Clear
          </button>
          {names.length === 2 && <button onClick={compare}>Compare</button>}
        </div>
      )}
    </div>
  );
}
