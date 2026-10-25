import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, AlertCircle, Eye, Flame, FlaskConical, MapPin, Sparkles, TrendingUp } from 'lucide-react';

const INDIAN_PURCHASE_LOCATIONS = [
  'Bodakdev, Ahmedabad (Gujarat)',
  'Koregaon Park, Pune (Maharashtra)',
  'Bandra West, Mumbai (Maharashtra)',
  'Indiranagar, Bengaluru (Karnataka)',
  'C-Scheme, Jaipur (Rajasthan)',
  'Salt Lake, Kolkata (West Bengal)',
  'Jubilee Hills, Hyderabad (Telangana)',
  'Vasant Vihar, New Delhi',
  'Fort Kochi, Kerala',
  'Sector 17, Chandigarh',
  'Alwarpet, Chennai (Tamil Nadu)',
  'Gomti Nagar, Lucknow (Uttar Pradesh)',
  'Vijay Nagar, Indore (Madhya Pradesh)',
  'Miramar, Panaji (Goa)',
  'Rajpur Road, Dehradun (Uttarakhand)',
];

export default function ScarcitySimulationBadge({
  snapshot,
  productName,
  sampleActivityEnabled = false,
  compact = false,
}) {
  if (!snapshot?.enabled) return null;

  const baseRemaining = snapshot.outOfStock ? 0 : snapshot.remaining;
  const baseSoldToday = Number(snapshot.simulatedSoldToday ?? snapshot.soldToday) || 0;
  const dailyCap = snapshot.dailyCap || 250;

  // Track stock reduction strictly via timeline
  const [activeRemaining, setActiveRemaining] = useState(baseRemaining);
  const [activeSoldToday, setActiveSoldToday] = useState(baseSoldToday);
  const [recentOrderEvent, setRecentOrderEvent] = useState(null);

  const lastSoldRef = useRef(baseSoldToday);
  const hasMountedRef = useRef(false);

  // Sync with snapshot updates without jumping
  useEffect(() => {
    setActiveRemaining(baseRemaining);
    setActiveSoldToday(baseSoldToday);

    // Only trigger order line if mounted and timeline soldToday actually incremented while watching
    if (hasMountedRef.current && baseSoldToday > lastSoldRef.current) {
      const loc = INDIAN_PURCHASE_LOCATIONS[
        Math.floor(Math.random() * INDIAN_PURCHASE_LOCATIONS.length)
      ];
      setRecentOrderEvent({
        location: loc,
        time: 'Just now',
        id: Date.now(),
      });

      const timer = setTimeout(() => {
        setRecentOrderEvent(null);
      }, 7000);
      return () => clearTimeout(timer);
    }

    lastSoldRef.current = baseSoldToday;
    hasMountedRef.current = true;
  }, [baseSoldToday, baseRemaining]);

  // Dynamic live viewers: starts at 77+, refreshes every 45s within 5 to 200 range
  const [viewerCount, setViewerCount] = useState(77);

  const driftStateRef = useRef({
    direction: Math.random() > 0.5 ? 1 : -1,
    ticksRemainingInTrend: 2 + Math.floor(Math.random() * 2), // 2-3 ticks before direction change
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const state = driftStateRef.current;
        state.ticksRemainingInTrend -= 1;

        // When trend expires, reverse direction with new random trend length
        if (state.ticksRemainingInTrend <= 0) {
          state.direction = -state.direction;
          state.ticksRemainingInTrend = 1 + Math.floor(Math.random() * 3); // 1-3 ticks in new direction
        }

        // Varied step between 4 and 16 for natural organic shifts every 45 seconds
        const step = Math.floor(Math.random() * 13) + 4;
        let next = prev + state.direction * step;

        // Keep strictly within 5 to 200 bounds with smooth turnaround
        if (next >= 190) {
          next = 182 - Math.floor(Math.random() * 10);
          state.direction = -1;
          state.ticksRemainingInTrend = 2 + Math.floor(Math.random() * 2);
        } else if (next <= 15) {
          next = 20 + Math.floor(Math.random() * 10);
          state.direction = 1;
          state.ticksRemainingInTrend = 2 + Math.floor(Math.random() * 2);
        }

        return Math.min(200, Math.max(5, next));
      });
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const percentageSold = Math.min(
    100,
    Math.round((activeSoldToday / Math.max(1, dailyCap)) * 100)
  );

  return (
    <section
      aria-label="Illustrative inventory simulation"
      className={`relative overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-br from-[#071a12]/95 via-[#0b2419]/90 to-[#05140e]/95 text-amber-50 shadow-xl backdrop-blur-md ${
        compact ? 'p-3' : 'p-4 sm:p-5'
      }`}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#D4AF37]/10 blur-2xl" />

      <div className="flex items-start gap-3">
        <div className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#FCE096]">
          <FlaskConical size={15} aria-hidden="true" />
          {!snapshot.paused && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Top row: Label + Bolder RED Live Viewers Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-200">
              Illustrative inventory simulation
            </p>

            {/* Bolder & RED live viewing indicator with pulsing RED radar dot + 45s refresh note */}
            {!snapshot.paused && !snapshot.outOfStock && (
              <div className="flex flex-col items-end gap-0.5">
                <span
                  data-testid="live-viewers-badge"
                  className="inline-flex items-center gap-1.5 rounded-full bg-rose-950/80 border border-rose-500/70 px-3 py-1 text-[11px] font-black text-rose-100 shadow-[0_0_14px_rgba(244,63,94,0.45)]"
                >
                  <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-90" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
                  </span>
                  <Eye size={12} className="text-rose-300 stroke-[2.5]" aria-hidden="true" />
                  <span className="font-black tracking-wide text-rose-100">
                    {viewerCount}+ people are viewing
                  </span>
                </span>
                <span className="text-[9px] font-medium text-rose-300/80 tracking-wide pr-1">
                  refreshes every 45 seconds
                </span>
              </div>
            )}
          </div>

          {snapshot.paused ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-200">
              <Activity size={13} aria-hidden="true" /> Simulation paused
            </p>
          ) : (
            <>
              {/* Units count */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs font-semibold">
                <span className="text-white">
                  Illustrative units remaining:{' '}
                  <strong className="text-lg font-black text-[#FCE096] transition-all duration-300">
                    {activeRemaining}
                  </strong>{' '}
                  / <span className="text-slate-400">{dailyCap}</span>
                </span>
                <span className="text-slate-300">
                  Simulated units sold today:{' '}
                  <strong className="text-[#FCE096]">{activeSoldToday}</strong>
                </span>
              </div>

              {/* Depletion Progress Bar */}
              <div className="mt-2.5 space-y-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-black/40 border border-white/10 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-[#D4AF37] to-amber-400 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                    style={{ width: `${percentageSold}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>Pacing: {percentageSold}% claimed today</span>
                  <span>Cap: {dailyCap} daily visual max</span>
                </div>
              </div>

              {/* TIMELINE-TRIGGERED PURCHASE LINE:
                  Only triggered when the 24-hour timeline actually advances and reduces stock! */}
              {recentOrderEvent && (
                <div className="mt-3 rounded-xl border border-[#D4AF37]/50 bg-gradient-to-r from-[#0d2a1d] to-[#071a12] p-2.5 text-xs text-amber-100 shadow-md animate-in fade-in slide-in-from-top-1 duration-300">
                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#FCE096]">
                      ⚡
                    </span>
                    <p className="leading-snug">
                      A verified shopper in{' '}
                      <strong className="text-[#FCE096]">{recentOrderEvent.location}</strong> just ordered{' '}
                      <strong className="text-emerald-300">1x unit</strong> of{' '}
                      <span className="italic text-slate-200">{productName || 'this formulation'}</span>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {snapshot.outOfStock && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-lg bg-rose-950/40 border border-rose-400/30 px-2.5 py-1 text-xs font-bold text-rose-200">
              <AlertCircle size={13} aria-hidden="true" /> Simulated as out of stock only
            </p>
          )}

          {sampleActivityEnabled && snapshot.sampleActivity?.length > 0 && (
            <div className="mt-3 border-t border-[#D4AF37]/25 pt-2.5 text-[11px] leading-relaxed text-amber-100/90">
              <p className="flex items-center gap-1 font-bold uppercase tracking-wider text-amber-200 text-[10px]">
                <Sparkles size={11} className="text-[#D4AF37]" />
                Fictional sample shoppers · Not real orders
              </p>
              <ul className="mt-1.5 space-y-1">
                {snapshot.sampleActivity.slice(0, 3).map(activity => (
                  <li key={`${activity.buyer}-${activity.time}`} className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-1 w-1 rounded-full bg-[#D4AF37]" />
                    <span>
                      {activity.buyer} · {productName || 'Sample product'} · {activity.city} · {activity.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
