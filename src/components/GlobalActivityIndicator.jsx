import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { getActivitySnapshot, subscribeActivity } from '../utils/networkActivity';

const BAR_DELAY_MS = 250;
const OVERLAY_DELAY_MS = 500;
const SLOW_MS = 4000;
const VERY_SLOW_MS = 10000;

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

  const showBar = activity.total > 0 && activity.oldestMs >= BAR_DELAY_MS;
  const showOverlay = activity.mutations > 0 && activity.oldestMs >= OVERLAY_DELAY_MS;
  const slow = activity.total > 0 && activity.oldestMs >= SLOW_MS;
  const verySlow = activity.total > 0 && activity.oldestMs >= VERY_SLOW_MS;

  return (
    <>
      {showBar && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[10000] overflow-hidden pointer-events-none" role="progressbar" aria-label="Loading">
          <div className="h-full w-1/3 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400" style={{ animation: 'bv-activity-slide 1.1s ease-in-out infinite' }} />
        </div>
      )}

      {showOverlay && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-[1px] cursor-wait" role="status" aria-live="polite">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-[#071a12]/95 px-5 py-4 text-white shadow-2xl">
            <span className="h-6 w-6 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
            <div>
              <p className="text-sm font-bold">{activity.label || 'Working on it…'}</p>
              <p className="text-xs text-emerald-100/70">
                {verySlow ? 'Still working — the network is very slow. Please do not click again.' : slow ? 'Network is slow. Please wait…' : 'Please wait, do not click again.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!showOverlay && slow && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[10000] rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-slate-900 shadow-xl pointer-events-none">
          {verySlow ? 'Network is very slow — still loading…' : 'Slow network — loading is taking longer than usual…'}
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

      <style>{`@keyframes bv-activity-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }`}</style>
    </>
  );
}
