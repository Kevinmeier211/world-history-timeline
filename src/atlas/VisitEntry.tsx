import { useState } from 'react';
import { readResume } from './visit-state';
import { readLocation, type Location } from './navigation';
export function VisitEntry({
  moment,
  investigate,
  navigate,
}: {
  moment: () => void;
  investigate: () => void;
  navigate: (location: Location) => void;
}) {
  const [intro, setIntro] = useState(() => {
    try {
      return localStorage.getItem('chronos.intro-dismissed') !== '1';
    } catch {
      return true;
    }
  });
  const [resume, setResume] = useState(readResume);
  const [message, setMessage] = useState('');
  function dismiss() {
    setIntro(false);
    try {
      localStorage.setItem('chronos.intro-dismissed', '1');
    } catch {
      /* Dismissal still works for this visit. */
    }
  }
  return (
    <section className="visit-entry" aria-label="Start or continue">
      <div className="actions">
        <button onClick={moment}>Explore this moment</button>
        <button onClick={investigate}>Try one investigation stop</button>
        {resume && (
          <button onClick={() => navigate(readLocation(resume))}>
            Continue previous reading
          </button>
        )}
        <button
          aria-expanded={intro}
          onClick={() => (intro ? dismiss() : setIntro(true))}
        >
          {intro ? 'Hide introduction' : 'How to use this atlas'}
        </button>
      </div>
      {intro && (
        <div>
          <p>
            Choose a moment, read a case, and ask what its evidence can show.
            Investigations connect several cases. Save your thinking in the notebook and
            return to it later. For ages 10–14, explore together with an adult; adults
            can follow the same evidence independently.
          </p>
          <p>
            Reading position is saved on this device. Question drafts stay in this tab
            across reloads; export your notebook to keep a separate backup.
          </p>
          {resume && (
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('chronos.resume');
                  setResume(null);
                } catch {
                  setMessage(
                    'The reading position could not be reset in browser storage.',
                  );
                }
              }}
            >
              Reset reading position
            </button>
          )}
        </div>
      )}
      {message && <p role="status">{message}</p>}
    </section>
  );
}
