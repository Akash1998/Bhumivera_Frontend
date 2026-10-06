import { useEffect, useState } from 'react';
import { settings as settingsApi } from '../../services/api';
import { Flame, LoaderCircle, Save, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const HOOKS = [
  ['exit_intent_coupon', 'Exit-intent coupon'], ['social_viewers', 'Live product viewers'],
  ['first_order_badge', 'First-order badge'], ['third_order_gift', 'Third-order gift'],
  ['birthday_coupon', 'Birthday coupon'], ['spin_after_purchase', 'Post-purchase spin'],
  ['refer_earn', 'Refer and earn'], ['buy_three_save', 'Buy-three savings'],
  ['navbar_tier_bar', 'Navbar tier progress'], ['coupon_scarcity', 'Coupon scarcity'],
  ['login_streak', 'Login streak'], ['price_match_badge', 'Price-match badge'],
  ['category_buyers', 'Category buyers'], ['wishlist_price_drop', 'Wishlist price drop'],
  ['review_scratch_card', 'Review scratch card'], ['platinum_early_access', 'Platinum early access'],
  ['referral_leaderboard', 'Referral leaderboard'], ['complete_look', 'Complete the look'],
  ['low_stock_badge', 'Low-stock badge'], ['recently_viewed', 'Recently viewed rail'],
  ['free_delivery_nudge', 'Free-delivery nudge'], ['seasonal_countdown', 'Seasonal countdown'],
  ['cart_hold_timer', 'Cart hold timer'], ['abandoned_cart_email', 'Abandoned-cart capture'],
  ['social_proof_cart', 'Cart social proof'], ['personalized_upsell', 'Personalized upsell'],
  ['savings_summary', 'Savings summary'], ['delivery_slot_urgency', 'Delivery-slot urgency'],
  ['vip_ribbon', 'VIP ribbon'], ['wallet_express', 'Wallet express'],
  ['post_purchase_bump', 'Post-purchase bump'], ['coupon_auto_apply', 'Best-coupon auto apply'],
];

export default function GamificationStudio() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState('');
  const { showToast } = useToast() || {};

  useEffect(() => {
    let active = true;
    settingsApi.get().then(({ data }) => {
      if (active) setValues(data?.gamification || {});
    }).catch(error => {
      if (active) showToast?.(error.normalized?.message || 'Could not load gamification settings.', 'error');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [showToast]);

  const update = async (key, value) => {
    const previous = values[key];
    setValues(current => ({ ...current, [key]: String(value) }));
    setSavingKey(key);
    try {
      await settingsApi.update({ [key]: String(value) });
      showToast?.('Hook setting saved.', 'success');
    } catch (error) {
      setValues(current => ({ ...current, [key]: previous }));
      showToast?.(error.normalized?.message || 'Could not save hook setting.', 'error');
    } finally {
      setSavingKey('');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <header className="border-b border-slate-800 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Promotion controls</p>
        <h2 className="mt-2 text-2xl font-black text-white">Gamification Studio</h2>
        <p className="mt-1 text-sm text-slate-500">32 individually controlled customer hooks</p>
      </header>
      {loading ? <p className="text-sm text-slate-400">Loading hook settings…</p> : (
        <div className="divide-y divide-slate-800 border-y border-slate-800">
          {HOOKS.map(([slug, label]) => {
            const enabledKey = `gamification_${slug}_enabled`;
            const thresholdKey = `gamification_${slug}_threshold`;
            const enabled = values[enabledKey] === '1' || values[enabledKey] === 1;
            return (
              <section key={slug} className="grid gap-4 py-4 md:grid-cols-[minmax(0,1fr)_180px_160px] md:items-center">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300"><Sparkles size={17}/></span>
                  <div><h3 className="text-sm font-semibold text-white">{label}</h3><p className="mt-0.5 text-xs text-slate-500">{slug.replaceAll('_', ' ')}</p></div>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input type="checkbox" checked={enabled} disabled={savingKey === enabledKey} onChange={event => update(enabledKey, event.target.checked ? '1' : '0')} className="h-4 w-4 accent-emerald-400" />
                  {enabled ? 'Enabled' : 'Disabled'}
                </label>
                <label className="text-xs text-slate-400">Threshold
                  <input type="number" min="0" value={values[thresholdKey] ?? '0'} disabled={savingKey === thresholdKey} onChange={event => setValues(current => ({ ...current, [thresholdKey]: event.target.value }))} onBlur={event => update(thresholdKey, event.target.value)} className="mt-1 w-full border-b border-slate-700 bg-transparent px-1 py-2 text-sm text-white outline-none focus:border-emerald-400" />
                </label>
                {savingKey === enabledKey || savingKey === thresholdKey ? <span className="sr-only"><LoaderCircle className="animate-spin"/></span> : null}
              </section>
            );
          })}
        </div>
      )}
      <p className="flex items-center gap-2 text-xs text-slate-500"><Flame size={14}/> Changes are saved immediately.</p>
    </div>
  );
}
