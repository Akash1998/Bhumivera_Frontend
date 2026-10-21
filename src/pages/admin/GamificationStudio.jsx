import { useEffect, useState } from 'react';
import { settings as settingsApi } from '../../services/api';
import { Flame, Gift, LoaderCircle, Plus, Save, Sparkles, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const HOOKS = [
  ['spin_after_purchase', 'Post-order coupon spin'],
  ['abandoned_cart_email', 'Cart exit email capture'],
  ['seasonal_countdown', 'Seasonal sale countdown'],
];

const DEFAULT_SPIN_REWARDS = [
  { label: '₹50 off', description: '', termsAndConditions: '', rewardType: 'discount', discountType: 'fixed', discountValue: 50, minimumOrderAmount: 500, maxDiscount: '', chance: 80, expiryDays: 30 },
  { label: '5% off (up to ₹200)', description: '', termsAndConditions: '', rewardType: 'discount', discountType: 'percentage', discountValue: 5, minimumOrderAmount: 500, maxDiscount: 200, chance: 85, expiryDays: 30 },
  { label: '₹100 off', description: '', termsAndConditions: '', rewardType: 'discount', discountType: 'fixed', discountValue: 100, minimumOrderAmount: 599, maxDiscount: '', chance: 20, expiryDays: 30 },
  { label: '10% off (up to ₹500)', description: '', termsAndConditions: '', rewardType: 'discount', discountType: 'percentage', discountValue: 10, minimumOrderAmount: 1000, maxDiscount: 500, chance: 40, expiryDays: 30 },
  { label: '₹500 off', description: '', termsAndConditions: '', rewardType: 'discount', discountType: 'fixed', discountValue: 500, minimumOrderAmount: 2000, maxDiscount: '', chance: 5, expiryDays: 30 },
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
    settingsApi.getGamification().then(({ data }) => {
      if (!active) return;
      const gamification = data || {};
      setValues(gamification);
      if (gamification.gamification_order_spin_rewards) {
        try {
          const parsedRewards = JSON.parse(gamification.gamification_order_spin_rewards);
          if (Array.isArray(parsedRewards) && parsedRewards.length >= 1 && parsedRewards.length <= 12) {
            setSpinRewards(parsedRewards.map(reward => ({
              ...reward,
              rewardType: reward.rewardType || 'discount',
              maxDiscount: reward.maxDiscount ?? '',
            })));
          } else {
            throw new Error('Saved spin reward configuration must contain between 1 and 12 rewards.');
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
    if (
      spinRewards.length < 1 ||
      spinRewards.length > 12 ||
      !spinRewards.some(reward => Number.isInteger(Number(reward.chance)) && Number(reward.chance) > 0) ||
      spinRewards.some(reward => !Number.isInteger(Number(reward.chance)) || Number(reward.chance) < 0 || Number(reward.chance) > 100000)
    ) {
      showToast?.('Configure 1–12 rewards and give at least one reward a positive chance weight.', 'error');
      return;
    }
    setSavingSpinRewards(true);
    try {
      await settingsApi.update({
        gamification_order_spin_rewards: JSON.stringify(spinRewards.map(reward => ({
          ...reward,
          chance: Number(reward.chance),
          ...(reward.rewardType === 'points'
            ? { points: Number(reward.points) }
            : {
              minimumOrderAmount: Number(reward.minimumOrderAmount),
              expiryDays: Number(reward.expiryDays),
              ...(reward.rewardType === 'discount' ? {
                discountValue: Number(reward.discountValue),
                maxDiscount: reward.maxDiscount === '' ? null : Number(reward.maxDiscount),
              } : {}),
            }),
        }))),
      });
      showToast?.('Spin rewards and chance weights saved.', 'success');
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not save spin rewards.', 'error');
    } finally {
      setSavingSpinRewards(false);
    }
  };

  const updateSpinReward = (index, key, value) => {
    setSpinRewards(current => current.map((reward, rewardIndex) => (
      rewardIndex === index
        ? { ...reward, [key]: value, ...(key === 'rewardType' && value === 'points' ? { points: reward.points || 100 } : {}) }
        : reward
    )));
  };

  const addSpinReward = () => {
    if (spinRewards.length >= 12) return;
    setSpinRewards(current => [...current, {
      label: 'New reward',
      description: '',
      termsAndConditions: '',
      rewardType: 'discount',
      discountType: 'fixed',
      discountValue: 50,
      minimumOrderAmount: 0,
      maxDiscount: '',
      chance: 0,
      expiryDays: 30,
    }]);
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
            <div><h3 className="text-sm font-bold text-white">Post-order spin rewards</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">Customers can spin once after an eligible order. Configure 1–12 discount coupons, free-shipping codes, or loyalty-point awards. Relative weights are converted into odds automatically; they do not need to total 100. Coupons are added to the customer’s next-cart offers.</p></div>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${chanceTotal > 0 ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-400/10 text-amber-200'}`}>Total weight: {chanceTotal}</span>
        </div>
        <div className="grid gap-3 xl:grid-cols-2">
          {spinRewards.map((reward, index) => (
            <fieldset key={index} className="grid gap-3 rounded-xl border border-white/10 bg-black/10 p-3 sm:grid-cols-2">
              <legend className="px-1 text-xs font-bold text-emerald-200">Prize {index + 1}</legend>
              <button type="button" onClick={() => setSpinRewards(current => current.filter((_, rewardIndex) => rewardIndex !== index))} disabled={spinRewards.length <= 1} aria-label={`Remove reward ${index + 1}`} className="inline-flex items-center gap-1 text-xs text-rose-300 disabled:opacity-40"><Trash2 size={13}/>Remove</button>
              <label className="text-[11px] font-semibold text-slate-400 sm:col-span-2">Reward shown to customer
                <input value={reward.label} maxLength={120} onChange={event => updateSpinReward(index, 'label', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"/>
              </label>
              <label className="text-[11px] font-semibold text-slate-400 sm:col-span-2">Reward description
                <textarea value={reward.description || ''} maxLength={255} rows={2} onChange={event => updateSpinReward(index, 'description', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50" placeholder="Explain what the customer receives"/>
              </label>
              <label className="text-[11px] font-semibold text-slate-400 sm:col-span-2">Terms and conditions
                <textarea value={reward.termsAndConditions || ''} maxLength={2000} rows={3} onChange={event => updateSpinReward(index, 'termsAndConditions', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50" placeholder="Add any restrictions or redemption conditions"/>
              </label>
              <label className="text-[11px] font-semibold text-slate-400">Reward type
                <select value={reward.rewardType || 'discount'} onChange={event => updateSpinReward(index, 'rewardType', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50">
                  <option value="discount">Discount coupon</option><option value="free_shipping">Free shipping coupon</option><option value="points">Loyalty points</option>
                </select>
              </label>
              {reward.rewardType === 'points' ? <>
                <label className="text-[11px] font-semibold text-slate-400">Points awarded
                  <input type="number" min="1" max="100000" step="1" value={reward.points ?? 100} onChange={event => updateSpinReward(index, 'points', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"/>
                </label>
              </> : <>
              {reward.rewardType === 'discount' && <>
              <label className="text-[11px] font-semibold text-slate-400">Discount type
                <select value={reward.discountType} onChange={event => updateSpinReward(index, 'discountType', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50">
                  <option value="fixed">Fixed amount (₹)</option><option value="percentage">Percentage</option>
                </select>
              </label>
              <label className="text-[11px] font-semibold text-slate-400">Discount value
                <input type="number" min="0.01" max={reward.discountType === 'percentage' ? 100 : undefined} step="0.01" value={reward.discountValue} onChange={event => updateSpinReward(index, 'discountValue', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"/>
              </label>
              <label className="text-[11px] font-semibold text-slate-400">Maximum discount (₹, optional)
                <input type="number" min="0" step="1" value={reward.maxDiscount ?? ''} disabled={reward.discountType === 'fixed'} onChange={event => updateSpinReward(index, 'maxDiscount', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50 disabled:opacity-40"/>
              </label>
              </>}
              <label className="text-[11px] font-semibold text-slate-400">Minimum order (₹)
                <input type="number" min="0" step="1" value={reward.minimumOrderAmount ?? 0} onChange={event => updateSpinReward(index, 'minimumOrderAmount', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"/>
              </label>
              <label className="text-[11px] font-semibold text-slate-400">Relative win weight
                <input type="number" min="0" max="100000" step="1" value={reward.chance} onChange={event => updateSpinReward(index, 'chance', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"/>
              </label>
              <label className="text-[11px] font-semibold text-slate-400">Reward expiry (days)
                <input type="number" min="1" max="365" step="1" value={reward.expiryDays} onChange={event => updateSpinReward(index, 'expiryDays', event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50"/>
              </label>
              </>}
            </fieldset>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addSpinReward} disabled={spinRewards.length >= 12} className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 px-4 py-2.5 text-sm font-bold text-emerald-200 disabled:opacity-50"><Plus size={16}/>Add reward</button>
          <button type="button" onClick={saveSpinRewards} disabled={savingSpinRewards || chanceTotal < 1} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
            {savingSpinRewards ? <LoaderCircle size={16} className="animate-spin"/> : <Save size={16}/>}
            Save rewards
          </button>
        </div>
      </section>
    </div>
  );
}
