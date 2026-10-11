import { useCallback, useEffect, useState } from 'react';
import { affiliate as affiliateApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoaderCircle, Save, Users } from 'lucide-react';

const DEFAULTS = {
  enabled: 1,
  reward_mode: 'wallet',
  wallet_reward_amount: 100,
  wallet_reward_per_order_limit: 100,
  coupon_discount_type: 'fixed',
  coupon_discount_value: 100,
  coupon_min_order_amount: 0,
  coupon_valid_days: 30,
};

const readData = response => response?.data?.config || response?.data?.data || response?.data || {};

export default function AffiliateManagement() {
  const [config, setConfig] = useState(DEFAULTS);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [loadError, setLoadError] = useState('');
  const { showToast } = useToast() || {};

  const load = useCallback(async (showLoader = true, includeConfig = true) => {
    if (showLoader) setLoading(true);
    setLoadError('');
    const requests = [
      includeConfig ? affiliateApi.getAdminConfig() : Promise.resolve(null),
      affiliateApi.getAdminReferrals({ limit: 50 }),
    ];
    const [settingsResult, referralsResult] = await Promise.allSettled(requests);
    const errors = [];
    if (includeConfig) {
      if (settingsResult.status === 'fulfilled') {
        setConfig({ ...DEFAULTS, ...readData(settingsResult.value) });
      } else {
        const error = settingsResult.reason;
        errors.push(`Settings: ${error?.normalized?.message || error?.response?.data?.message || error?.message || 'could not load.'}`);
      }
    }
    if (referralsResult.status === 'fulfilled') {
      setReferrals(referralsResult.value.data?.referrals || []);
    } else {
      const error = referralsResult.reason;
      errors.push(`Referral queue: ${error?.normalized?.message || error?.response?.data?.message || error?.message || 'could not load.'}`);
    }
    if (errors.length) {
      setLoadError(errors.join(' '));
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
        wallet_reward_per_order_limit: Number(config.wallet_reward_per_order_limit),
        coupon_discount_value: Number(config.coupon_discount_value),
        coupon_min_order_amount: Number(config.coupon_min_order_amount),
        coupon_valid_days: Number(config.coupon_valid_days),
      });
      setConfig({ ...DEFAULTS, ...readData(response) });
      setLoadError('');
      showToast?.('Referral rewards saved.', 'success');
    } catch (error) {
      const message = error.normalized?.message || error.response?.data?.message || error.message || 'Could not save referral rewards.';
      setLoadError(message);
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

  return (
    <div className="max-w-4xl space-y-6 text-slate-100">
      <header>
        <h3 className="text-lg font-semibold text-white">Referral engine</h3>
        <p className="mt-1 text-sm leading-6 text-slate-400">Review a customer’s verified sign-up. Approve now to issue the configured reward, reject with a reason, or take no action and the referral will auto-approve one hour after the customer verifies their email.</p>
      </header>
      {loadError && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{loadError}</p>}

      <form onSubmit={save} className="space-y-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <label className="flex items-start gap-3 text-sm text-white">
          <input type="checkbox" checked={Boolean(Number(config.enabled))} onChange={event => change('enabled', event.target.checked ? 1 : 0)} className="mt-0.5 h-4 w-4 accent-emerald-400"/>
          <span><strong>Referral rewards are on</strong><span className="mt-1 block text-xs text-slate-400">Turn this off to stop issuing new rewards. Existing rewards remain in customer accounts.</span></span>
        </label>

        <label className="block text-sm font-medium text-white">What should the referrer receive?
          <select value={config.reward_mode} onChange={event => change('reward_mode', event.target.value)} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2">
            <option value="wallet">Spendable wallet balance only</option>
            <option value="coupon">Coupon only</option>
            <option value="wallet_coupon">Restricted referral balance + personal coupon</option>
          </select>
        </label>

        {['wallet', 'wallet_coupon'].includes(config.reward_mode) && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-white">{config.reward_mode === 'wallet_coupon' ? 'Restricted referral credit per approved referral (₹)' : 'Spendable wallet reward per approved referral (₹)'}
              <input type="number" min="0" max="100000" step="0.01" required value={config.wallet_reward_amount} onChange={event => change('wallet_reward_amount', event.target.value)} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2"/>
            </label>
            {config.reward_mode === 'wallet_coupon' && (
              <label className="block text-sm font-medium text-white">Maximum referral balance used per order (₹)
                <input type="number" min="0.01" max="100000" step="0.01" required value={config.wallet_reward_per_order_limit} onChange={event => change('wallet_reward_per_order_limit', event.target.value)} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2"/>
                <span className="mt-1 block text-xs font-normal text-slate-400">The personal code is required. A ₹1,000 reward with a ₹100 limit can be used up to 10 times, until its balance or expiry runs out.</span>
              </label>
            )}
          </div>
        )}

        {['coupon', 'wallet_coupon'].includes(config.reward_mode) && (
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

        <button disabled={saving} type="submit" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#071a12] disabled:opacity-50">
          <Save size={15}/>{saving ? 'Saving…' : 'Save referral rewards'}
        </button>
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
                        row.coupon_code ? `Coupon ${row.coupon_code}` : '',
                      ].filter(Boolean).join(' · ') || 'No reward issued'}
                      {row.wallet_bucket === 'referral' && Number(row.referral_wallet_balance) > 0 && (
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
