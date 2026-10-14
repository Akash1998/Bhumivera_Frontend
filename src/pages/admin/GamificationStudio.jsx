import { useEffect, useState } from 'react';
import { settings as settingsApi } from '../../services/api';
import { Flame, Gift, LoaderCircle, Save, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const HOOKS = [
  ['spin_after_purchase', 'Post-order coupon spin'],
  ['abandoned_cart_email', 'Cart exit email capture'],
  ['seasonal_countdown', 'Seasonal sale countdown'],
];

const DEFAULT_SPIN_REWARDS = [
  { label: '₹50 off', discountType: 'fixed', discountValue: 50, minimumOrderAmount: 500, maxDiscount: '', chance: 35, expiryDays: 30 },
  { label: '5% off (up to ₹200)', discountType: 'percentage', discountValue: 5, minimumOrderAmount: 500, maxDiscount: 200, chance: 25, expiryDays: 30 },
  { label: '₹100 off', discountType: 'fixed', discountValue: 100, minimumOrderAmount: 1000, maxDiscount: '', chance: 18, expiryDays: 30 },
  { label: '10% off (up to ₹500)', discountType: 'percentage', discountValue: 10, minimumOrderAmount: 1500, maxDiscount: 500, chance: 12, expiryDays: 30 },
  { label: '₹250 off', discountType: 'fixed', discountValue: 250, minimumOrderAmount: 2500, maxDiscount: '', chance: 7, expiryDays: 30 },
  { label: '₹500 off', discountType: 'fixed', discountValue: 500, minimumOrderAmount: 5000, maxDiscount: '', chance: 3, expiryDays: 30 },
];

export default function GamificationStudio() {
  const [values, setValues] = useState({});
  const [spinRewards, setSpinRewards] = useState(DEFAULT_SPIN_REWARDS);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState('');
  const [savingSpinRewards, setSavingSpinRewards] = useState(false);
  const { showToast } = useToast() || {};

  useEffect(() => {
    let active = true;
    settingsApi.get().then(({ data }) => {
      if (!active) return;
      const gamification = data?.gamification || {};
      setValues(gamification);
      if (gamification.gamification_order_spin_rewards) {
        try {
          const parsedRewards = JSON.parse(gamification.gamification_order_spin_rewards);
          if (Array.isArray(parsedRewards) && parsedRewards.length === 6) {
            setSpinRewards(parsedRewards.map(reward => ({
              ...reward,
              maxDiscount: reward.maxDiscount ?? '',
            })));
          }
        } catch (error) {
          console.error('[ADMIN_ORDER_SPIN_SETTINGS_PARSE]', error);
          showToast?.('Saved spin reward settings could not be read.', 'error');
        }
      }
    }).catch(error => {
      if (active) showToast?.(error.normalized?.message || 'Could not load gamification settings.', 'error');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [showToast]);

  const chanceTotal = spinRewards.reduce((sum, reward) => sum + (Number(reward.chance) || 0), 0);

  const saveSpinRewards = async () => {
    if (spinRewards.length !== 6 || chanceTotal !== 100) {
      showToast?.('Keep six rewards and make their chances total exactly 100%.', 'error');
      return;
    }
    setSavingSpinRewards(true);
    try {
      await settingsApi.update({
        gamification_order_spin_rewards: JSON.stringify(spinRewards.map(reward => ({
          ...reward,
          discountValue: Number(reward.discountValue),
          minimumOrderAmount: Number(reward.minimumOrderAmount),
          maxDiscount: reward.maxDiscount === '' ? null : Number(reward.maxDiscount),
          chance: Number(reward.chance),
          expiryDays: Number(reward.expiryDays),
        }))),
      });
      showToast?.('All six spin rewards and chances saved.', 'success');
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not save spin rewards.', 'error');
    } finally {
      setSavingSpinRewards(false);
    }
  };

  const updateSpinReward = (index, key, value) => {
    setSpinRewards(current => current.map((reward, rewardIndex) => (
      rewardIndex === index ? { ...reward, [key]: value } : reward
    )));
  };

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
        <p className="mt-1 text-sm text-slate-500">Live storefront mechanics</p>
      </header>
      {loading ? <p className="text-sm text-slate-400">Loading hook settings…</p> : (
        <div className="divide-y divide-slate-800 border-y border-slate-800">
          {HOOKS.map(([slug, label]) => {
            const enabledKey = `gamification_${slug}_enabled`;
            const enabled = values[enabledKey] === '1' || values[enabledKey] === 1;
            return (
              <section key={slug} className="grid gap-4 py-4 md:grid-cols-[minmax(0,1fr)_180px_minmax(180px,260px)] md:items-center">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300"><Sparkles size={17}/></span>
                  <div><h3 className="text-sm font-semibold text-white">{label}</h3><p className="mt-0.5 text-xs text-slate-500">{slug.replaceAll('_', ' ')}</p></div>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input type="checkbox" checked={enabled} disabled={savingKey === enabledKey} onChange={event => update(enabledKey, event.target.checked ? '1' : '0')} className="h-4 w-4 accent-emerald-400" />
                  {enabled ? 'Enabled' : 'Disabled'}
                </label>
                {slug === 'seasonal_countdown' ? (
                  <label className="text-xs text-slate-400">Countdown ends
                    <input type="datetime-local" value={values.seasonal_countdown_end_at || ''} disabled={savingKey === 'seasonal_countdown_end_at'} onChange={event => setValues(current => ({ ...current, seasonal_countdown_end_at: event.target.value }))} onBlur={event => update('seasonal_countdown_end_at', event.target.value)} className="mt-1 w-full border-b border-slate-700 bg-transparent px-1 py-2 text-sm text-white outline-none focus:border-emerald-400" />
                  </label>
                ) : <span className="text-xs text-slate-500">{savingKey === enabledKey ? <LoaderCircle size={14} className="animate-spin"/> : 'Connected to the storefront'}</span>}
              </section>
            );
          })}
        </div>
      )}
      <p className="flex items-center gap-2 text-xs text-slate-500"><Flame size={14}/> Changes are saved immediately.</p>
      <section className="space-y-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.035] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300"><Gift size={17}/></span>
            <div><h3 className="text-sm font-bold text-white">Post-order spin rewards</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">Customers can spin once after an eligible order. Rewards are personal-use coupons. Set six prizes; chances must total exactly 100%. Percentage discounts honor the optional maximum.</p></div>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${chanceTotal === 100 ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-400/10 text-amber-200'}`}>Chance total: {chanceTotal}%</span>
        </div>
        <div className="grid gap-3 xl:grid-cols-2">
          {spinRewards.map((reward, index) => (
            <fieldset key={index} className="grid gap-3 rounded-xl border border-white/10 bg-black/10 p-3 sm:grid-cols-2">
              <legend className="px-1 text-xs font-bold text-emerald-200">Prize {index + 1}</legend>
              <label className="text-[11px] font-semibold text-slate-400 sm:col-span-2">Reward shown to customer
                <input value={reward.label} maxLength={120} onChange={event => updateSpinReward(index, 'label', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"/>
              </label>
              <label className="text-[11px] font-semibold text-slate-400">Discount type
                <select value={reward.discountType} onChange={event => updateSpinReward(index, 'discountType', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50">
                  <option value="fixed">Fixed amount (₹)</option><option value="percentage">Percentage</option>
                </select>
              </label>
              <label className="text-[11px] font-semibold text-slate-400">Discount value
                <input type="number" min="0.01" max={reward.discountType === 'percentage' ? 100 : undefined} step="0.01" value={reward.discountValue} onChange={event => updateSpinReward(index, 'discountValue', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"/>
              </label>
              <label className="text-[11px] font-semibold text-slate-400">Minimum order (₹)
                <input type="number" min="0" step="1" value={reward.minimumOrderAmount} onChange={event => updateSpinReward(index, 'minimumOrderAmount', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"/>
              </label>
              <label className="text-[11px] font-semibold text-slate-400">Maximum discount (₹, optional)
                <input type="number" min="0" step="1" value={reward.maxDiscount ?? ''} disabled={reward.discountType === 'fixed'} onChange={event => updateSpinReward(index, 'maxDiscount', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50 disabled:opacity-40"/>
              </label>
              <label className="text-[11px] font-semibold text-slate-400">Win chance (%)
                <input type="number" min="0" max="100" step="1" value={reward.chance} onChange={event => updateSpinReward(index, 'chance', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"/>
              </label>
              <label className="text-[11px] font-semibold text-slate-400">Coupon expiry (days)
                <input type="number" min="1" max="365" step="1" value={reward.expiryDays} onChange={event => updateSpinReward(index, 'expiryDays', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"/>
              </label>
            </fieldset>
          ))}
        </div>
        <button type="button" onClick={saveSpinRewards} disabled={savingSpinRewards || chanceTotal !== 100} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
          {savingSpinRewards ? <LoaderCircle size={16} className="animate-spin"/> : <Save size={16}/>}
          Save six rewards
        </button>
      </section>
    </div>
  );
}
