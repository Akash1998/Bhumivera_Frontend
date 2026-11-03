import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { getActivitySnapshot, subscribeActivity } from '../utils/networkActivity';

const BAR_DELAY_MS = 400;
const SAVING_DELAY_MS = 700;
const SLOW_MS = 8000;
const VERY_SLOW_MS = 20000;

// Only blame the user's network when the browser says it is actually slow; otherwise the server is the likely cause.
const isSlowConnection = () => {
  if (typeof navigator === 'undefined') return false;
  const c = navigator.connection;
  return Boolean(c && (c.saveData || /^(slow-2g|2g|3g)$/.test(c.effectiveType || '')));
};

export default function GlobalActivityIndicator() {
  const activity = useSyncExternalStore(subscribeActivity, getActivitySnapshot, getActivitySnapshot);
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [backOnline, setBackOnline] = useState(false);

  useEffect(() => {
    let timer;
    const goOffline = () => { setOnline(false); setBackOnline(false); };
    const goOnline = () => {
      setOnline(true);
      setBackOnline(true);
      timer = setTimeout(() => setBackOnline(false), 3000);
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  const busy = activity.total > 0;
  const showBar = busy && activity.oldestMs >= BAR_DELAY_MS;
  const showSaving = activity.mutations > 0 && activity.oldestMs >= SAVING_DELAY_MS;
  const slow = busy && activity.oldestMs >= SLOW_MS;
  const verySlow = busy && activity.oldestMs >= VERY_SLOW_MS;
  const slowNetwork = isSlowConnection();

  let notice = null;
  if (showSaving) {
    notice = { title: activity.label || 'Working on it…', text: verySlow ? 'Still working — please keep this page open.' : '' };
  } else if (slow) {
    notice = {
      title: verySlow ? 'Still loading…' : slowNetwork ? 'Slow connection detected' : 'Just a moment…',
      text: verySlow
        ? 'This is taking longer than usual. Hang tight.'
        : slowNetwork ? 'Content is loading — thanks for your patience.' : 'Getting things ready for you.',
    };
  }

  return (
    <>
      {showBar && (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[10000] overflow-hidden pointer-events-none" role="progressbar" aria-label="Loading">
          <div className="h-full w-1/3 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400" style={{ animation: 'bv-activity-slide 1.1s ease-in-out infinite' }} />
        </div>
      )}

      {notice && (
        <div
          className="fixed left-1/2 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[10000] pointer-events-none max-w-[calc(100vw-2rem)]"
          role="status"
          aria-live="polite"
          style={{ transform: 'translateX(-50%)', animation: 'bv-activity-fade 0.25s ease-out' }}
        >
          <div className="flex items-center gap-3 rounded-full border border-emerald-500/25 bg-[#071a12]/90 px-4 py-2.5 text-white shadow-xl backdrop-blur">
            <span className="h-4 w-4 shrink-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight">{notice.title}</p>
              {notice.text && <p className="text-[11px] leading-tight text-emerald-100/70">{notice.text}</p>}
            </div>
          </div>
        </div>
      )}

      {!online && (
        <div className="fixed bottom-0 inset-x-0 z-[10001] bg-red-600 px-4 py-2 text-center text-xs font-bold text-white">
          You are offline. Changes will not be saved until your connection returns.
        </div>
      )}
      {online && backOnline && (
        <div className="fixed bottom-0 inset-x-0 z-[10001] bg-emerald-600 px-4 py-2 text-center text-xs font-bold text-white">
          Back online.
        </div>
      )}

      <style>{`
        @keyframes bv-activity-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        @keyframes bv-activity-fade { from { opacity: 0; margin-bottom: -8px; } to { opacity: 1; margin-bottom: 0; } }
        @media (prefers-reduced-motion: reduce) { [role="progressbar"] > div { animation: none !important; width: 100% !important; } }
      `}</style>
    </>
  );
}
