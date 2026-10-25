import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle, FlaskConical, TrendingUp, Sparkles } from 'lucide-react';

export default function ScarcitySimulationBadge({
  snapshot,
  productName,
  sampleActivityEnabled = false,
  compact = false,
  liveDecrement = 0,
}) {
  if (!snapshot?.enabled) return null;

  const baseRemaining = snapshot.outOfStock ? 0 : snapshot.remaining;
  // Apply live visual simulated decrement if any, bounded at 0
  const simulatedRemaining = Math.max(0, baseRemaining - (liveDecrement || 0));
  const baseSoldToday = Number(snapshot.simulatedSoldToday ?? snapshot.soldToday) || 0;
  const simulatedSoldToday = baseSoldToday + (liveDecrement || 0);

  const dailyCap = snapshot.dailyCap || 250;
  const percentageSold = Math.min(100, Math.round((simulatedSoldToday / Math.max(1, dailyCap)) * 100));

  return (
    <section
      aria-label="Illustrative inventory simulation"
      className={`relative overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-br from-[#071a12]/95 via-[#0b2419]/90 to-[#05140e]/95 text-amber-50 shadow-xl backdrop-blur-md ${
        compact ? 'p-3' : 'p-4 sm:p-5'
      }`}
    >
      {/* Ambient decorative glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#D4AF37]/10 blur-2xl" />

      <div className="flex items-start gap-2.5">
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
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-200">
              Illustrative inventory simulation
            </p>
            {!snapshot.paused && !snapshot.outOfStock && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2 py-0.5 text-[9px] font-bold text-[#FCE096]">
                <TrendingUp size={10} /> Active Run
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-relaxed text-amber-50/90">
            Simulated counters only. They are not live stock, customer orders, or buyer identities.
          </p>

          {snapshot.paused ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-200">
              <Activity size={13} aria-hidden="true" /> Simulation paused
            </p>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs font-semibold">
                <span className="text-white">
                  Illustrative units remaining:{' '}
                  <strong className="text-lg font-black text-[#FCE096] transition-all duration-300">
                    {simulatedRemaining}
                  </strong>{' '}
                  / <span className="text-slate-400">{dailyCap}</span>
                </span>
                <span className="text-slate-300">
                  Simulated units sold today:{' '}
                  <strong className="text-[#FCE096]">{simulatedSoldToday}</strong>
                </span>
              </div>

              {/* Visual Stock Depletion Bar */}
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
