import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Award, FlaskConical, Gift, LoaderCircle, Megaphone, Users } from 'lucide-react';

const LoyaltyMembers = lazy(() => import('./LoyaltyMembers'));
const CouponManagement = lazy(() => import('./CouponManagement'));
const FlashSalesManagement = lazy(() => import('./FlashSalesManagement'));
const MinCartValueCenter = lazy(() => import('./MinCartValueCenter'));
const CartRulesEngine = lazy(() => import('./CartRulesEngine'));
const GamificationStudio = lazy(() => import('./GamificationStudio'));
const LifecycleOffers = lazy(() => import('./LifecycleOffers'));
const PersonalizationCenter = lazy(() => import('./PersonalizationCenter'));
const LoyaltyTierForge = lazy(() => import('./LoyaltyTierForge'));

const groups = [
  {
    id: 'offers',
    label: 'Offers & checkout',
    icon: Megaphone,
    features: [
      { id: 'coupons', label: 'Coupons', purpose: 'Give customers a code for a price discount.', steps: 'Create a code, choose its discount and dates, then save it.', component: CouponManagement },
      { id: 'flash-sales', label: 'Flash sales', purpose: 'Discount selected products for a limited time.', steps: 'Create a sale, select products, set the start and end time, then save.', component: FlashSalesManagement },
      { id: 'min-cart-value', label: 'Cart minimums', purpose: 'Offer a benefit when a cart reaches a certain value.', steps: 'Set the minimum amount, choose benefits, and save the rule.', component: MinCartValueCenter },
      { id: 'cart-rules', label: 'Cart rules', purpose: 'Set conditions for discounts, free shipping, gifts, or bonus points.', steps: 'Choose the cart conditions and customer group, then create the rule.', component: CartRulesEngine },
    ],
  },
  {
    id: 'loyalty',
    label: 'Clientele Privilege & Tiers',
    icon: Award,
    features: [
      { id: 'loyalty-matrix', label: 'Matrix controls', purpose: 'Set point earning, redemption safeguards, lifetime tiers, and real tier benefits.', steps: 'Configure the program and redemption caps, then define each tier’s qualifying points and checkout benefits.', component: LoyaltyTierForge },
      { id: 'loyalty', label: 'Members & points', purpose: 'Review member balances and make reasoned point adjustments.', steps: 'Search a member and record a points or lifetime-tier adjustment with a reason.', component: LoyaltyMembers },
      { id: 'gamification', label: 'Reward activities', purpose: 'Enable activities such as reward spins and sale countdowns.', steps: 'Turn an activity on or off. Changes are saved as you make them.', component: GamificationStudio },
    ],
  },
  {
    id: 'customer-growth',
    label: 'Customer growth',
    icon: Users,
    features: [
      { id: 'lifecycle-offers', label: 'Lifecycle offers', purpose: 'Offer a gift or coupon for events such as a birthday or a returning customer.', steps: 'Choose when the offer applies, select its gift or coupon, then save.', component: LifecycleOffers },
      { id: 'personalization', label: 'Personalized suggestions', purpose: 'Show signed-in customers products related to their views, saved items, reviews, and orders.', steps: 'Suggestions run automatically. There are no extra settings to configure.', component: PersonalizationCenter },
      { id: 'ab-experiments', label: 'A/B experiments', purpose: 'Compare two versions of an offer or page to see which works better.', unavailable: 'This feature is not ready. The system does not yet record which customers saw each version or measure results, so it cannot report a reliable winner.' },
    ],
  },
];

const allFeatures = groups.flatMap(group => group.features);

export default function GrowthOffersHub() {
  const navigate = useNavigate();
  const { tab } = useParams();
  const initialFeature = allFeatures.find(feature => feature.id === (tab === 'loyalty-tiers' ? 'loyalty-matrix' : tab)) || allFeatures[0];
  const [selectedId, setSelectedId] = useState(initialFeature.id);
  const [activeGroup, setActiveGroup] = useState(groups.find(group => group.features.some(feature => feature.id === initialFeature.id))?.id || groups[0].id);
  const [mobileShowingTool, setMobileShowingTool] = useState(false);
  const selected = allFeatures.find(feature => feature.id === selectedId) || allFeatures[0];
  const Tool = selected.component;

  useEffect(() => {
    if (tab === 'loyalty-tiers') {
      navigate('/admin/dashboard/loyalty-matrix', { replace: true });
      return;
    }
    const feature = allFeatures.find(item => item.id === tab);
    if (feature) {
      setSelectedId(feature.id);
      setActiveGroup(groups.find(group => group.features.some(item => item.id === feature.id))?.id || groups[0].id);
      setMobileShowingTool(true);
    }
  }, [tab, navigate]);

  const chooseFeature = feature => {
    setSelectedId(feature.id);
    setMobileShowingTool(true);
    if (feature.id !== tab) navigate(`/admin/dashboard/${feature.id}`, { replace: true });
  };

  const chooseGroup = group => {
    setActiveGroup(group.id);
    const firstFeature = group.features[0];
    chooseFeature(firstFeature);
  };

  return (
    <main className="space-y-5 text-slate-100">
      <header className="border-b border-white/10 pb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Simple promotion controls</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Growth & offers</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">Pick a group, pick one tool, then follow the short instructions. Only the selected tool opens here.</p>
      </header>

      <nav aria-label="Growth tool groups" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {groups.map(group => {
          const Icon = group.icon;
          const active = group.id === activeGroup;
          return (
            <button key={group.id} type="button" aria-pressed={active} onClick={() => chooseGroup(group)} className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 py-3 text-left ${active ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'}`}>
              <Icon size={18} aria-hidden="true"/>
              <span className="text-sm font-semibold">{group.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)]">
        <nav aria-label={`${groups.find(group => group.id === activeGroup)?.label || 'Growth'} tools`} className={`${mobileShowingTool ? 'hidden lg:block' : 'block'} space-y-2`}>
          {groups.find(group => group.id === activeGroup)?.features.map(feature => (
            <button key={feature.id} type="button" aria-current={feature.id === selected.id ? 'page' : undefined} onClick={() => chooseFeature(feature)} className={`w-full rounded-xl border px-4 py-3 text-left ${feature.id === selected.id ? 'border-emerald-400/40 bg-emerald-400/10 text-white' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'}`}>
              <span className="block text-sm font-semibold">{feature.label}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">{feature.purpose}</span>
            </button>
          ))}
        </nav>

        <section aria-labelledby="growth-tool-title" className={`${mobileShowingTool ? 'block' : 'hidden lg:block'} min-w-0 rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-5`}>
          <button type="button" onClick={() => setMobileShowingTool(false)} className="mb-4 text-xs font-semibold text-emerald-300 lg:hidden">← All tools</button>
          <header className="mb-5 border-b border-white/10 pb-4">
            <h2 id="growth-tool-title" className="text-lg font-semibold text-white">{selected.label}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400"><strong className="text-slate-300">What it does:</strong> {selected.purpose}</p>
            {selected.steps && <p className="mt-1 text-sm leading-6 text-slate-400"><strong className="text-slate-300">How to use it:</strong> {selected.steps}</p>}
          </header>
          {selected.unavailable ? (
            <div role="status" className="flex gap-3 rounded-lg border border-amber-300/20 bg-amber-300/5 p-4">
              <FlaskConical size={18} className="mt-0.5 shrink-0 text-amber-200" aria-hidden="true"/>
              <p className="text-sm leading-6 text-amber-100">{selected.unavailable}</p>
            </div>
          ) : (
            <Suspense fallback={<p role="status" className="flex items-center gap-2 text-sm text-slate-400"><LoaderCircle size={16} className="animate-spin"/>Loading {selected.label.toLowerCase()}…</p>}>
              <Tool/>
            </Suspense>
          )}
        </section>
      </div>
      <p className="flex items-center gap-2 text-xs text-slate-500"><Gift size={14}/> Only real, connected actions are shown. A/B experiments are marked unavailable until results can be measured.</p>
    </main>
  );
}
