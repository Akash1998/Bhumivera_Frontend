import { lazy, Suspense, useState } from 'react';
import { Award, Gift, LoaderCircle, Megaphone, Users } from 'lucide-react';

const LoyaltyManagement = lazy(() => import('./LoyaltyManagement'));
const CouponManagement = lazy(() => import('./CouponManagement'));
const FlashSalesManagement = lazy(() => import('./FlashSalesManagement'));
const MinCartValueCenter = lazy(() => import('./MinCartValueCenter'));
const CartRulesEngine = lazy(() => import('./CartRulesEngine'));
const GamificationStudio = lazy(() => import('./GamificationStudio'));
const LifecycleOffers = lazy(() => import('./LifecycleOffers'));
const PersonalizationCenter = lazy(() => import('./PersonalizationCenter'));
const LoyaltyTierForge = lazy(() => import('./LoyaltyTierForge'));

const sections = [
  {
    id: 'offers',
    label: 'Offers & checkout',
    description: 'Set discounts and rules that help customers complete an order.',
    icon: Megaphone,
    features: [
      { id: 'coupons', label: 'Coupons', purpose: 'Create discount codes and choose when, where, and how often they can be used.', component: CouponManagement },
      { id: 'flash-sales', label: 'Flash sales', purpose: 'Run a sale for selected products during a set time.', component: FlashSalesManagement },
      { id: 'cart-minimums', label: 'Cart minimums', purpose: 'Set a minimum order amount and add benefits like a discount, gift, or free shipping.', component: MinCartValueCenter },
      { id: 'cart-rules', label: 'Cart rules', purpose: 'Choose simple conditions for who gets a discount, gift, free shipping, or bonus points.', component: CartRulesEngine },
    ],
  },
  {
    id: 'loyalty',
    label: 'Loyalty & referrals',
    description: 'Reward repeat customers and manage ways people share your store.',
    icon: Award,
    features: [
      { id: 'loyalty', label: 'Loyalty', purpose: 'See members and manage how customers earn and use points.', component: LoyaltyManagement },
      { id: 'loyalty-tiers', label: 'Loyalty tiers', purpose: 'Set point levels and benefits for each membership tier.', component: LoyaltyTierForge },
      { id: 'gamification', label: 'Reward activities', purpose: 'Turn storefront activities like reward spins and sale countdowns on or off.', component: GamificationStudio },
    ],
  },
  {
    id: 'customer-growth',
    label: 'Customer growth',
    description: 'Bring customers back and improve their shopping experience.',
    icon: Users,
    features: [
      { id: 'lifecycle', label: 'Lifecycle offers', purpose: 'Set gifts or coupons for moments such as a third order, a birthday, or an inactive customer.', component: LifecycleOffers },
      { id: 'personalization', label: 'Personalized suggestions', purpose: 'See how homepage recommendations are chosen for each signed-in customer.', component: PersonalizationCenter },
    ],
  },
];

export default function GrowthOffersHub() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [openFeature, setOpenFeature] = useState(sections[0].features[0].id);
  const section = sections.find(item => item.id === activeSection) || sections[0];

  const changeSection = id => {
    const nextSection = sections.find(item => item.id === id);
    setActiveSection(id);
    setOpenFeature(nextSection.features[0].id);
  };

  return (
    <main className="space-y-5 text-slate-100">
      <header className="border-b border-white/10 pb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Admin tools</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Growth & offers</h1>
        <p className="mt-1 text-sm text-slate-400">Choose a section, then open the tool you need. Start with Offers & checkout for discounts and cart settings.</p>
      </header>

      <nav aria-label="Growth and offers sections" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {sections.map(item => {
          const Icon = item.icon;
          const selected = item.id === activeSection;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="growth-offers-panel"
              onClick={() => changeSection(item.id)}
              className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${selected ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'}`}
            >
              <Icon size={18} aria-hidden="true"/>
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <section id="growth-offers-panel" role="tabpanel" className="space-y-3">
        <div className="pb-1">
          <h2 className="text-lg font-semibold text-white">{section.label}</h2>
          <p className="mt-1 text-sm text-slate-400">{section.description}</p>
        </div>

        {section.features.map(feature => {
          const Feature = feature.component;
          const expanded = openFeature === feature.id;
          return (
            <article key={feature.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`growth-feature-${feature.id}`}
                onClick={() => setOpenFeature(expanded ? '' : feature.id)}
                className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left hover:bg-white/[0.04]"
              >
                <span>
                  <span className="block text-sm font-semibold text-white">{feature.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-400">{feature.purpose}</span>
                  {feature.note && <span className="mt-1 block text-xs text-amber-200">{feature.note}</span>}
                </span>
                <span aria-hidden="true" className="pt-0.5 text-lg leading-none text-emerald-300">{expanded ? '−' : '+'}</span>
              </button>
              {expanded && (
                <div id={`growth-feature-${feature.id}`} className="border-t border-white/10 p-4">
                  <Suspense fallback={<p role="status" className="flex items-center gap-2 text-sm text-slate-400"><LoaderCircle size={16} className="animate-spin"/>Opening {feature.label.toLowerCase()}…</p>}>
                    <Feature/>
                  </Suspense>
                </div>
              )}
            </article>
          );
        })}
      </section>
      <p className="flex items-center gap-2 text-xs text-slate-500"><Gift size={14}/> Open a tool to see its settings. Changes are saved inside that tool.</p>
    </main>
  );
}
