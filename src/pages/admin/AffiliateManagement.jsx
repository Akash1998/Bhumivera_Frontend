import { useCallback, useEffect, useState } from 'react';
import { affiliate as affiliateApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoaderCircle, Save, Users } from 'lucide-react';

const DEFAULTS = {
  enabled: 1,
  reward_mode: 'wallet_coupon',
  wallet_reward_amount: 500,
  referred_reward_amount: 500,
  wallet_reward_per_order_limit: 100,
  coupon_discount_type: 'fixed',
  coupon_discount_value: 100,
  coupon_min_order_amount: 0,
  coupon_valid_days: 30,
  referral_redemption_tiers: [
    { min_order_amount: 799, referral_amount: 250 },
  ],
};

const readData = response => response?.data?.config || response?.data?.data || response?.data || {};
const money = value => `₹${(Number(value) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function AffiliateManagement() {
  const [config, setConfig] = useState(DEFAULTS);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [queueError, setQueueError] = useState('');
  const [saveError, setSaveError] = useState('');
  const { showToast } = useToast() || {};

  const load = useCallback(async (showLoader = true, includeConfig = true) => {
    if (showLoader) setLoading(true);
    const requests = [
      includeConfig ? affiliateApi.getAdminConfig() : Promise.resolve(null),
      affiliateApi.getAdminReferrals({ limit: 50 }),
    ];
    const [settingsResult, referralsResult] = await Promise.allSettled(requests);
    const errors = [];
    if (includeConfig) {
      if (settingsResult.status === 'fulfilled') {
        setConfig({ ...DEFAULTS, ...readData(settingsResult.value) });
        setSettingsLoaded(true);
        setSettingsError('');
      } else {
        const error = settingsResult.reason;
        const message = error?.normalized?.message || error?.response?.data?.message || error?.message || 'could not load.';
        setSettingsError(message);
        errors.push(`Settings: ${message}`);
      }
    }
    if (referralsResult.status === 'fulfilled') {
      setReferrals(referralsResult.value.data?.referrals || []);
      setQueueError('');
    } else {
      const error = referralsResult.reason;
      const message = error?.normalized?.message || error?.response?.data?.message || error?.message || 'could not load.';
      setQueueError(message);
      errors.push(`Referral queue: ${message}`);
    }
    if (errors.length) {
      if (showLoader) showToast?.(errors.join(' '), 'error');
    }
    if (showLoader) setLoading(false);
  }, [showToast]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const timer = window.setInterval(() => load(false, false), 15000);
    return () => window.clearInterval(timer);
  }, [load]);

  const change = (key, value) => setConfig(current => ({ ...current, [key]: value }));

  const save = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await affiliateApi.updateAdminConfig({
        ...config,
        enabled: Boolean(config.enabled),
        wallet_reward_amount: Number(config.wallet_reward_amount),
        referred_reward_amount: Number(config.referred_reward_amount),
        wallet_reward_per_order_limit: Number(config.wallet_reward_per_order_limit),
        coupon_discount_value: Number(config.coupon_discount_value),
        coupon_min_order_amount: Number(config.coupon_min_order_amount),
        coupon_valid_days: Number(config.coupon_valid_days),
        referral_redemption_tiers: config.referral_redemption_tiers.map(tier => ({
          min_order_amount: Number(tier.min_order_amount),
          referral_amount: Number(tier.referral_amount),
        })),
      });
      setConfig({ ...DEFAULTS, ...readData(response) });
      setSettingsLoaded(true);
      setSettingsError('');
      setSaveError('');
      showToast?.('Referral rewards saved.', 'success');
    } catch (error) {
      const message = error.normalized?.message || error.response?.data?.message || error.message || 'Could not save referral rewards.';
      setSaveError(message);
      showToast?.(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const decide = async (referral, decision) => {
    const reason = decision === 'rejected'
      ? window.prompt('Why is this referral not approved? This reason will be recorded for the admin review.')
      : null;
    if (decision === 'rejected' && (reason === null || reason.trim().length < 5)) {
      if (reason !== null) showToast?.('Enter a reason of at least 5 characters.', 'error');
      return;
    }
    setProcessingId(referral.claim_id);
    try {
      await affiliateApi.decideAdminReferral(referral.claim_id, { decision, reason });
      showToast?.(decision === 'approved' ? 'Referral approved and reward issued.' : 'Referral marked as not approved.', 'success');
      await load(false, false);
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not review this referral.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const reissueCoupon = async referral => {
    if (!window.confirm('Disable the old referral coupon and issue a replacement code for the remaining referral balance?')) return;
    setProcessingId(referral.claim_id);
    try {
      const response = await affiliateApi.reissueAdminReferralCoupon(referral.claim_id);
      showToast?.(`Replacement coupon ${response.data?.couponCode || ''} issued.`, 'success');
      await load(false, false);
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not reissue this referral coupon.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p role="status" className="flex items-center gap-2 text-sm text-slate-400"><LoaderCircle size={16} className="animate-spin"/>Loading referral settings…</p>;

  const tiers = Array.isArray(config.referral_redemption_tiers)
    ? [...config.referral_redemption_tiers].sort((a, b) => Number(a.min_order_amount) - Number(b.min_order_amount))
    : [];
  const rewardDescription = config.reward_mode === 'wallet_coupon'
    ? `Inviter: ${money(config.wallet_reward_amount)} restricted referral balance. New customer: ${money(config.referred_reward_amount)} restricted referral balance.`
    : config.reward_mode === 'wallet'
      ? `Inviter: ${money(config.wallet_reward_amount)} spendable wallet balance.`
      : `Inviter: ${config.coupon_discount_type === 'percentage' ? `${config.coupon_discount_value}% off` : `${money(config.coupon_discount_value)} off`} by coupon.`;

  return (
    <div className="max-w-4xl space-y-6 text-slate-100">
      <header>
        <h3 className="text-lg font-semibold text-white">Referral engine</h3>
        <p className="mt-1 text-sm leading-6 text-slate-400">Control referral rewards and review sign-ups. Rewards are issued on approval, or automatically one hour after email verification.</p>
      </header>
      {settingsError && (
        <p role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
          <span>Current settings could not be loaded: {settingsError} Saving is disabled until settings load successfully.</span>
          <button type="button" onClick={() => load()} className="rounded-md border border-rose-200/30 px-3 py-1.5 font-semibold">Retry settings</button>
        </p>
      )}
      {saveError && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{saveError}</p>}
      {queueError && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">Referral queue could not be loaded: {queueError}</p>}

      {settingsLoaded && (
        <section aria-label="Current referral reward preview" className="space-y-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.05] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-semibold text-white">Current reward per approved referral</h4>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${Number(config.enabled) ? 'bg-emerald-300/10 text-emerald-200' : 'bg-slate-400/10 text-slate-300'}`}>{Number(config.enabled) ? 'Program on' : 'Program off'}</span>
          </div>
          <p className="text-sm text-slate-200">{rewardDescription}</p>
          {config.reward_mode === 'wallet_coupon' && (
            <>
              <p className="text-xs leading-relaxed text-slate-400">For each order, the highest minimum subtotal reached sets the maximum referral balance that can be used. Actual use is limited by the customer’s remaining balance and eligible order total. Welcome bonuses are separate.</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-emerald-100">
                {tiers.map((tier, index) => <li key={`${tier.min_order_amount}-${index}`}>Orders from {money(tier.min_order_amount)}: up to {money(tier.referral_amount)} referral balance</li>)}
              </ul>
            </>
          )}
        </section>
      )}

      <form onSubmit={save} className="space-y-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <fieldset disabled={!settingsLoaded} className="space-y-5">
        <label className="flex items-start gap-3 text-sm text-white">
          <input type="checkbox" checked={Boolean(Number(config.enabled))} onChange={event => change('enabled', event.target.checked ? 1 : 0)} className="mt-0.5 h-4 w-4 accent-emerald-400"/>
          <span><strong>Referral rewards are on</strong><span className="mt-1 block text-xs text-slate-400">Turn this off to stop issuing new rewards. Existing rewards remain in customer accounts.</span></span>
        </label>

        <label className="block text-sm font-medium text-white">How should each referral be rewarded?
          <select value={config.reward_mode} onChange={event => change('reward_mode', event.target.value)} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2">
            <option value="wallet">Spendable wallet balance only</option>
            <option value="coupon">Coupon only</option>
            <option value="wallet_coupon">Restricted referral balance, auto-applied to orders</option>
          </select>
        </label>

        {['wallet', 'wallet_coupon'].includes(config.reward_mode) && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-white">{config.reward_mode === 'wallet_coupon' ? 'Referrer order-only balance (₹)' : 'Referrer spendable wallet reward (₹)'}
              <input type="number" min="0" max="100000" step="0.01" required value={config.wallet_reward_amount} onChange={event => change('wallet_reward_amount', event.target.value)} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2"/>
            </label>
            {config.reward_mode === 'wallet_coupon' && <label className="block text-sm font-medium text-white">New customer order-only balance (₹)
              <input type="number" min="0" max="100000" step="0.01" required value={config.referred_reward_amount} onChange={event => change('referred_reward_amount', event.target.value)} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2"/>
            </label>}
          </div>
        )}

        {config.reward_mode === 'wallet_coupon' && (
          <section className="space-y-3 rounded-lg border border-white/10 p-3">
            <div><h4 className="text-sm font-semibold text-white">Order redemption limits</h4><p className="mt-1 text-xs text-slate-400">The highest minimum cart subtotal reached sets the per-order referral-balance cap. The actual amount is also limited by the customer’s remaining balance and eligible order total. Welcome bonuses are separate.</p></div>
            {config.referral_redemption_tiers.map((tier, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                <label className="text-xs text-slate-300">Minimum cart subtotal (₹)<input type="number" min="0" max="1000000" step="0.01" required value={tier.min_order_amount} onChange={event => setConfig(current => ({ ...current, referral_redemption_tiers: current.referral_redemption_tiers.map((item, itemIndex) => itemIndex === index ? { ...item, min_order_amount: event.target.value } : item) }))} className="admin-glass-control mt-1 w-full rounded-lg px-2.5 py-2"/></label>
                <label className="text-xs text-slate-300">Max referral balance per order (₹)<input type="number" min="0.01" max="100000" step="0.01" required value={tier.referral_amount} onChange={event => setConfig(current => ({ ...current, referral_redemption_tiers: current.referral_redemption_tiers.map((item, itemIndex) => itemIndex === index ? { ...item, referral_amount: event.target.value } : item) }))} className="admin-glass-control mt-1 w-full rounded-lg px-2.5 py-2"/></label>
                <button type="button" aria-label="Remove redemption tier" disabled={config.referral_redemption_tiers.length <= 1} onClick={() => setConfig(current => ({ ...current, referral_redemption_tiers: current.referral_redemption_tiers.filter((_, itemIndex) => itemIndex !== index) }))} className="mb-0.5 rounded-lg border border-rose-300/20 px-3 py-2 text-xs text-rose-200 disabled:opacity-40">Remove</button>
              </div>
            ))}
            <button type="button" disabled={config.referral_redemption_tiers.length >= 10} onClick={() => change('referral_redemption_tiers', [...config.referral_redemption_tiers, { min_order_amount: '', referral_amount: '' }])} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">Add order tier</button>
          </section>
        )}

        {config.reward_mode === 'coupon' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-white">Coupon discount
              <div className="mt-2 flex gap-2">
                <select value={config.coupon_discount_type} onChange={event => change('coupon_discount_type', event.target.value)} className="admin-glass-control min-w-0 flex-1 rounded-lg px-3 py-2">
                  <option value="fixed">Fixed ₹</option><option value="percentage">Percent %</option>
                </select>
                <input type="number" min="0.01" max={config.coupon_discount_type === 'percentage' ? 100 : 100000} step="0.01" required value={config.coupon_discount_value} onChange={event => change('coupon_discount_value', event.target.value)} className="admin-glass-control w-28 rounded-lg px-3 py-2"/>
              </div>
            </label>
            <label className="block text-sm font-medium text-white">Minimum order for coupon (₹)
              <input type="number" min="0" step="0.01" required value={config.coupon_min_order_amount} onChange={event => change('coupon_min_order_amount', event.target.value)} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2"/>
            </label>
            <label className="block text-sm font-medium text-white">Coupon validity (days)
              <input type="number" min="1" max="365" step="1" required value={config.coupon_valid_days} onChange={event => change('coupon_valid_days', event.target.value)} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2"/>
            </label>
          </div>
        )}

        <button disabled={saving || !settingsLoaded} type="submit" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#071a12] disabled:opacity-50">
          <Save size={15}/>{saving ? 'Saving…' : 'Save referral rewards'}
        </button>
        </fieldset>
      </form>

      <section className="space-y-3">
        <header className="flex items-center gap-2">
          <Users size={17} className="text-emerald-300"/>
          <h3 className="font-semibold text-white">Referral review queue</h3>
          <span className="text-xs text-slate-500">Refreshes every 15 seconds</span>
        </header>
        {referrals.length === 0 ? <p className="rounded-xl border border-white/10 p-4 text-sm text-slate-400">No one has joined through a referral yet.</p> : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs text-slate-400"><tr><th className="p-3">Invited by</th><th className="p-3">Verified customer</th><th className="p-3">Status</th><th className="p-3">Reward / action</th></tr></thead>
              <tbody className="divide-y divide-white/10">
                {referrals.map(row => <tr key={row.claim_id}>
                  <td className="p-3"><span className="block text-white">{row.referrer_name}</span><span className="text-xs text-slate-500">{row.referrer_email}</span></td>
                  <td className="p-3"><span className="block text-white">{row.referred_name}</span><span className="text-xs text-slate-500">{row.referred_email}</span><span className="mt-1 block text-[11px] text-slate-500">Verified {new Date(row.verified_at).toLocaleString()}</span></td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${row.status === 'pending' ? 'bg-amber-300/10 text-amber-200' : row.status === 'rejected' ? 'bg-rose-300/10 text-rose-200' : 'bg-emerald-300/10 text-emerald-200'}`}>
                      {row.status === 'pending' ? 'Verified · waiting review' : row.status === 'auto_approved' ? 'Auto-approved' : row.status === 'approved' ? 'Approved by admin' : 'Rejected'}
                    </span>
                    {row.status === 'pending' && <span className="mt-1 block text-[11px] text-slate-500">Auto-approval at {new Date(row.auto_approve_at).toLocaleTimeString()}</span>}
                    {row.decision_reason && <span className="mt-1 block max-w-48 text-xs text-rose-200">{row.decision_reason}</span>}
                  </td>
                  <td className="p-3">
                    {row.status === 'pending' ? (
                      <div className="flex flex-wrap gap-2">
                        <button type="button" disabled={processingId === row.claim_id} onClick={() => decide(row, 'approved')} className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50">{processingId === row.claim_id ? 'Saving…' : 'Approve reward'}</button>
                        <button type="button" disabled={processingId === row.claim_id} onClick={() => decide(row, 'rejected')} className="rounded-lg border border-rose-300/20 px-3 py-2 text-xs font-semibold text-rose-200 disabled:opacity-50">Reject</button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300">{[
                        Number(row.wallet_amount) > 0
                          ? row.wallet_bucket === 'referral'
                            ? `₹${Number(row.wallet_amount).toFixed(2)} restricted referral balance`
                            : `₹${Number(row.wallet_amount).toFixed(2)} spendable wallet`
                          : '',
                        Number(row.referred_wallet_amount) > 0
                          ? `₹${Number(row.referred_wallet_amount).toFixed(2)} new-customer referral balance`
                          : '',
                        row.coupon_code ? `Coupon ${row.coupon_code}` : '',
                      ].filter(Boolean).join(' · ') || 'No reward issued'}
                      {row.wallet_bucket === 'referral' && row.coupon_code && Number(row.referral_wallet_balance) > 0 && (
                        <button type="button" disabled={processingId === row.claim_id} onClick={() => reissueCoupon(row)} className="mt-2 block rounded-lg border border-amber-300/20 px-2 py-1 text-xs font-semibold text-amber-200 disabled:opacity-50">
                          {processingId === row.claim_id ? 'Reissuing…' : 'Reissue lost coupon'}
                        </button>
                      )}
                      </span>
                    )}
                  </td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
