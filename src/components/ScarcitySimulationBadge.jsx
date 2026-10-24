import React from 'react';
import { Activity, AlertCircle, FlaskConical } from 'lucide-react';

export default function ScarcitySimulationBadge({
  snapshot,
  productName,
  sampleActivityEnabled = false,
  compact = false,
}) {
  if (!snapshot?.enabled) return null;

  const simulatedRemaining = snapshot.outOfStock ? 0 : snapshot.remaining;
  const simulatedSoldToday = Number(snapshot.simulatedSoldToday ?? snapshot.soldToday) || 0;

  return (
    <section
      aria-label="Illustrative inventory simulation"
      className={`rounded-xl border border-amber-300/40 bg-amber-950/45 text-amber-50 ${
        compact ? 'p-3' : 'p-4 sm:p-5'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <FlaskConical size={16} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.13em] text-amber-200">
            Illustrative inventory simulation
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-50/90">
            Simulated counters only. They are not live stock, customer orders, or buyer identities.
          </p>
          {snapshot.paused ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-200">
              <Activity size={13} aria-hidden="true" /> Simulation paused
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
              <span>
                Illustrative units remaining: <strong>{simulatedRemaining}</strong> / {snapshot.dailyCap}
              </span>
              <span>
                Simulated units sold today: <strong>{simulatedSoldToday}</strong>
              </span>
            </div>
          )}
          {snapshot.outOfStock && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber-200">
              <AlertCircle size={13} aria-hidden="true" /> Simulated as out of stock only
            </p>
          )}
          {sampleActivityEnabled && snapshot.sampleActivity?.length > 0 && (
            <div className="mt-2 border-t border-amber-300/20 pt-2 text-[11px] leading-relaxed text-amber-100/85">
              <p className="font-bold uppercase tracking-wide">Fictional sample shoppers · Not real orders</p>
              <ul className="mt-1 space-y-1">
                {snapshot.sampleActivity.slice(0, 3).map(activity => (
                  <li key={`${activity.buyer}-${activity.time}`}>
                    {activity.buyer} · {productName || 'Sample product'} · {activity.city} · {activity.time}
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
