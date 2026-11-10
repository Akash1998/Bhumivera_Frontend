import React from 'react';
import {
  Compass,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const metrics = [
  { label: 'Opted-in customers', value: '0' },
  { label: 'Recommendation CTR', value: '0%' },
  { label: 'Cart recoveries', value: '0' },
  { label: 'Attributed revenue', value: '₹0' },
];

export default function PersonalizationCenter() {
  return (
    <section aria-labelledby="personalization-title" className="space-y-8 text-slate-100">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
        <header className="flex items-start gap-3 max-w-3xl">
          <span className="rounded-lg bg-emerald-400/10 p-2.5 text-emerald-300">
            <Sparkles size={20} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#d4af37]">
              Personalization &amp; Recommendation Studio
            </p>
            <h3 id="personalization-title" className="mt-0.5 text-xl font-bold text-white">
              Automatic product suggestions
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Customer recommendations remain consent-gated. Admin reporting is not connected to a live telemetry source.
            </p>
          </div>
        </header>

        <Link
          to="/admin/dashboard/growth-offers"
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-[#d4af37]/40"
        >
          <Compass size={14} />
          Growth &amp; Offers Hub
        </Link>
      </div>

      <div
        role="status"
        className="flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
      >
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-amber-300" />
        <p>
          All personalization dashboard values are reset to 0. This is a display-only state; it does not delete customer
          consent, browsing, or recommendation records.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value }) => (
          <article key={label} className="rounded-2xl border border-white/10 bg-[#071a12]/80 p-4">
            <div className="text-xs text-slate-400">{label}</div>
            <div className="mt-2 text-2xl font-black text-white">{value}</div>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#071a12]/80 p-5">
        <h4 className="text-sm font-bold text-white">No admin telemetry available</h4>
        <p className="mt-1 text-sm leading-6 text-slate-400">
          Sample personas, cohort rows, attributed sales, and non-persistent configuration controls have been removed.
          Live values will appear here only after an admin reporting source is connected.
        </p>
      </div>
    </section>
  );
}
