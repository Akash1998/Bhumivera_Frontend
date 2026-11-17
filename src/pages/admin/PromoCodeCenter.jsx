import { lazy, Suspense, useState } from 'react';
import { LoaderCircle, Tag, Users } from 'lucide-react';

const CreatorPromos = lazy(() => import('./PromoterProgramManagement'));
const StoreCoupons = lazy(() => import('./CouponManagement'));

const panels = [
  {
    id: 'creators',
    label: 'Creator promo codes',
    description: 'Manage creator accounts, promo names, discounts, and use limits.',
    icon: Users,
  },
  {
    id: 'coupons',
    label: 'Store coupons',
    description: 'Create and manage regular customer coupons with the existing coupon tools.',
    icon: Tag,
  },
];

export default function PromoCodeCenter() {
  const [activePanel, setActivePanel] = useState('creators');
  const selected = panels.find(panel => panel.id === activePanel) || panels[0];
  const Panel = activePanel === 'creators' ? CreatorPromos : StoreCoupons;

  return (
    <main className="space-y-5 p-4 text-slate-100 md:p-6">
      <header className="border-b border-white/10 pb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">One place for every promo code</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Promo codes</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
          Creator promos stay connected to creator accounts and order tracking. Store coupons keep using the regular coupon system.
        </p>
      </header>

      <nav aria-label="Promo code panels" className="grid gap-3 md:grid-cols-2">
        {panels.map(panel => {
          const Icon = panel.icon;
          const active = panel.id === activePanel;
          return (
            <button
              key={panel.id}
              type="button"
              aria-pressed={active}
              onClick={() => setActivePanel(panel.id)}
              className={`rounded-xl border p-4 text-left transition ${active ? 'border-emerald-300/50 bg-emerald-300/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'}`}
            >
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <Icon size={17} className="text-emerald-200" aria-hidden="true"/>
                {panel.label}
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">{panel.description}</span>
            </button>
          );
        })}
      </nav>

      <section aria-labelledby="promo-panel-title" className="min-w-0 rounded-xl border border-white/10 bg-white/[0.025]">
        <header className="border-b border-white/10 px-4 py-4 sm:px-5">
          <h3 id="promo-panel-title" className="text-lg font-semibold text-white">{selected.label}</h3>
          {activePanel === 'creators' && (
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Creators can change their promo code name in their account. Discount values and use limits remain admin-controlled.
            </p>
          )}
        </header>
        <Suspense fallback={<p role="status" className="flex items-center gap-2 p-5 text-sm text-slate-400"><LoaderCircle size={16} className="animate-spin"/>Loading {selected.label.toLowerCase()}…</p>}>
          <Panel/>
        </Suspense>
      </section>
    </main>
  );
}
