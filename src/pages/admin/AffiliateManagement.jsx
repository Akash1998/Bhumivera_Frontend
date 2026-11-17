import { useCallback, useEffect, useMemo, useState } from 'react';
import { affiliate as affiliateApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Calculator, CheckCircle2, Download, Gift, LoaderCircle,
  Save, Search, ShieldCheck, Users
} from 'lucide-react';

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
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [queueError, setQueueError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [queueSearch, setQueueSearch] = useState('');
  const [queueStatusFilter, setQueueStatusFilter] = useState('all');
  const [simCartSubtotal, setSimCartSubtotal] = useState('899');
  const [simWalletBalance, setSimWalletBalance] = useState('500');
  const [grantForm, setGrantForm] = useState({ email: '', amount: '', bucket: 'referral', reason: '' });
  const [granting, setGranting] = useState(false);
  const [grantNotice, setGrantNotice] = useState('');
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

  const bulkApprovePending = async () => {
    const pendingIds = referrals.filter(r => r.status === 'pending').map(r => r.claim_id);
    if (!pendingIds.length) return;
    setBulkProcessing(true);
    try {
      if (affiliateApi.bulkDecideAdminReferrals) {
        await affiliateApi.bulkDecideAdminReferrals({ claimIds: pendingIds, decision: 'approved' });
      } else {
        for (const claimId of pendingIds) {
          await affiliateApi.decideAdminReferral(claimId, { decision: 'approved', reason: null });
        }
      }
      showToast?.(`Approved ${pendingIds.length} pending referral(s).`, 'success');
      await load(false, false);
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not bulk approve pending referrals.', 'error');
    } finally {
      setBulkProcessing(false);
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

  const submitManualGrant = async event => {
    event.preventDefault();
    if (!affiliateApi.issueAdminManualReferralGrant) return;
    setGranting(true);
    setGrantNotice('');
    try {
      const { data } = await affiliateApi.issueAdminManualReferralGrant({
        email: grantForm.email.trim(),
        amount: Number(grantForm.amount),
        bucket: grantForm.bucket,
        reason: grantForm.reason.trim(),
      });
      setGrantNotice(`Credited ₹${Number(data.grant?.amount || grantForm.amount).toFixed(2)} (${grantForm.bucket}) to ${grantForm.email}.`);
      setGrantForm({ email: '', amount: '', bucket: 'referral', reason: '' });
      showToast?.('Manual referral grant issued.', 'success');
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Could not issue manual referral grant.', 'error');
    } finally {
      setGranting(false);
    }
  };

  const tiers = useMemo(() => (
    Array.isArray(config.referral_redemption_tiers)
      ? [...config.referral_redemption_tiers].sort((a, b) => Number(a.min_order_amount) - Number(b.min_order_amount))
      : []
  ), [config.referral_redemption_tiers]);

  const queueSummary = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let inviterCredits = 0;
    let friendCredits = 0;
    for (const r of referrals) {
      if (r.status === 'pending') pending += 1;
      else if (r.status === 'rejected') rejected += 1;
      else approved += 1;
      inviterCredits += Number(r.wallet_amount || 0);
      friendCredits += Number(r.referred_wallet_amount || 0);
    }
    return { total: referrals.length, pending, approved, rejected, inviterCredits, friendCredits };
  }, [referrals]);

  const filteredReferrals = useMemo(() => {
    const q = queueSearch.trim().toLowerCase();
    return referrals.filter(row => {
      if (queueStatusFilter !== 'all' && row.status !== queueStatusFilter) return false;
      if (!q) return true;
      return (
        String(row.referrer_name || '').toLowerCase().includes(q) ||
        String(row.referrer_email || '').toLowerCase().includes(q) ||
        String(row.referred_name || '').toLowerCase().includes(q) ||
        String(row.referred_email || '').toLowerCase().includes(q) ||
        String(row.coupon_code || '').toLowerCase().includes(q)
      );
    });
  }, [referrals, queueSearch, queueStatusFilter]);

  const simulatedRedemption = useMemo(() => {
    const subtotal = Math.max(0, Number(simCartSubtotal) || 0);
    const balance = Math.max(0, Number(simWalletBalance) || 0);
    const matchingTier = [...tiers]
      .reverse()
      .find(tier => subtotal >= (Number(tier.min_order_amount) || 0));
    const maxCap = matchingTier ? Number(matchingTier.referral_amount) || 0 : 0;
    const applied = Math.min(balance, subtotal, maxCap);
    return {
      matchingTier,
      maxCap,
      applied,
      netPayable: Math.max(0, subtotal - applied),
    };
  }, [simCartSubtotal, simWalletBalance, tiers]);

  const exportReferralsCsv = () => {
    if (!filteredReferrals.length) return;
    const headers = ['Claim ID', 'Inviter Name', 'Inviter Email', 'Referred Name', 'Referred Email', 'Status', 'Inviter Credit', 'Friend Credit', 'Coupon Code', 'Verified At'];
    const lines = [
      headers.join(','),
      ...filteredReferrals.map(r => [
        r.claim_id,
        `"${String(r.referrer_name || '').replace(/"/g, '""')}"`,
        r.referrer_email,
        `"${String(r.referred_name || '').replace(/"/g, '""')}"`,
        r.referred_email,
        r.status,
        Number(r.wallet_amount || 0).toFixed(2),
        Number(r.referred_wallet_amount || 0).toFixed(2),
        r.coupon_code || '',
        r.verified_at || '',
      ].join(',')),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bhumivera-customer-referrals.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p role="status" className="flex items-center gap-2 text-sm text-slate-400"><LoaderCircle size={16} className="animate-spin"/>Loading referral settings…</p>;

  const rewardDescription = config.reward_mode === 'wallet_coupon'
    ? `Inviter: ${money(config.wallet_reward_amount)} restricted referral balance. New customer: ${money(config.referred_reward_amount)} restricted referral balance.`
    : config.reward_mode === 'wallet'
      ? `Inviter: ${money(config.wallet_reward_amount)} spendable wallet balance.`
      : `Inviter: ${config.coupon_discount_type === 'percentage' ? `${config.coupon_discount_value}% off` : `${money(config.coupon_discount_value)} off`} by coupon.`;

  return (
    <div className="max-w-5xl space-y-6 p-4 text-slate-100 md:p-6">
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

      {referrals.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verified Claims</span>
            <p className="mt-1 text-xl font-bold text-white">{queueSummary.total}</p>
            <span className="text-[11px] text-emerald-300">{queueSummary.approved} approved · {queueSummary.pending} pending</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Review</span>
            <p className="mt-1 text-xl font-bold text-amber-200">{queueSummary.pending}</p>
            <span className="text-[11px] text-slate-400">Auto-approves 60m post-verify</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inviter Credits Issued</span>
            <p className="mt-1 text-xl font-bold text-emerald-200">{money(queueSummary.inviterCredits)}</p>
            <span className="text-[11px] text-slate-400">In loaded queue</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">New Customer Credits</span>
            <p className="mt-1 text-xl font-bold text-emerald-200">{money(queueSummary.friendCredits)}</p>
            <span className="text-[11px] text-slate-400">Order-only welcome credits</span>
          </div>
        </div>
      )}

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

      {config.reward_mode === 'wallet_coupon' && (
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Calculator size={16} className="text-emerald-300"/>
            <h4 className="text-sm font-semibold text-white">Customer Checkout Redemption Simulator</h4>
          </div>
          <p className="mt-1 text-xs text-slate-400">Preview how much restricted referral wallet balance auto-applies for a given cart subtotal under the tiers above.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="text-xs text-slate-300">
              Sample Cart Subtotal (₹)
              <input type="number" min="0" value={simCartSubtotal} onChange={e => setSimCartSubtotal(e.target.value)} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm text-white"/>
            </label>
            <label className="text-xs text-slate-300">
              Customer Referral Balance (₹)
              <input type="number" min="0" value={simWalletBalance} onChange={e => setSimWalletBalance(e.target.value)} className="admin-glass-control mt-1 w-full rounded-lg px-3 py-2 text-sm text-white"/>
            </label>
            <div className="flex flex-col justify-center rounded-lg border border-emerald-400/20 bg-emerald-950/20 p-3 text-xs">
              <span className="text-slate-400">Auto-Applied Referral Discount:</span>
              <strong className="mt-0.5 text-base text-emerald-300">−{money(simulatedRedemption.applied)}</strong>
              <span className="text-[11px] text-slate-400">Customer pays {money(simulatedRedemption.netPayable)}</span>
            </div>
          </div>
        </section>
      )}

      {affiliateApi.issueAdminManualReferralGrant && (
        <form onSubmit={submitManualGrant} className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-emerald-300"/>
            <h4 className="text-sm font-semibold text-white">Issue Manual Referral / Goodwill Credit</h4>
          </div>
          {grantNotice && <p className="rounded-lg border border-emerald-400/30 bg-emerald-950/20 p-2.5 text-xs text-emerald-200">{grantNotice}</p>}
          <div className="grid gap-3 sm:grid-cols-4">
            <input required type="email" value={grantForm.email} onChange={e => setGrantForm(c => ({ ...c, email: e.target.value }))} placeholder="Customer email" className="admin-glass-control rounded-lg px-3 py-2 text-xs text-white"/>
            <input required type="number" min="1" max="100000" step="0.01" value={grantForm.amount} onChange={e => setGrantForm(c => ({ ...c, amount: e.target.value }))} placeholder="Amount (₹)" className="admin-glass-control rounded-lg px-3 py-2 text-xs text-white"/>
            <select value={grantForm.bucket} onChange={e => setGrantForm(c => ({ ...c, bucket: e.target.value }))} className="admin-glass-control rounded-lg px-3 py-2 text-xs text-white">
              <option value="referral">Order-only referral balance</option>
              <option value="cash">Spendable cash wallet</option>
            </select>
            <input required minLength={5} value={grantForm.reason} onChange={e => setGrantForm(c => ({ ...c, reason: e.target.value }))} placeholder="Audit reason (min 5 chars)" className="admin-glass-control rounded-lg px-3 py-2 text-xs text-white"/>
          </div>
          <button type="submit" disabled={granting} className="rounded-lg border border-emerald-400/40 bg-emerald-400/15 px-3.5 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-400/25 disabled:opacity-50">
            {granting ? 'Issuing credit…' : 'Issue Audited Credit'}
          </button>
        </form>
      )}

      <section className="space-y-3">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users size={17} className="text-emerald-300"/>
            <h3 className="font-semibold text-white">Referral review queue</h3>
            <span className="text-xs text-slate-500">Refreshes every 15 seconds</span>
          </div>
          {referrals.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-400">
                <Search size={13}/>
                <input
                  value={queueSearch}
                  onChange={e => setQueueSearch(e.target.value)}
                  placeholder="Search inviter or friend…"
                  className="bg-transparent text-xs text-white outline-none"
                />
              </label>
              <select value={queueStatusFilter} onChange={e => setQueueStatusFilter(e.target.value)} className="rounded-lg border border-white/15 bg-slate-900 px-2.5 py-1.5 text-xs text-white">
                <option value="all">All statuses</option>
                <option value="pending">Pending review</option>
                <option value="approved">Approved</option>
                <option value="auto_approved">Auto-approved</option>
                <option value="rejected">Rejected</option>
              </select>
              {queueSummary.pending > 1 && (
                <button type="button" disabled={bulkProcessing} onClick={bulkApprovePending} className="rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-slate-950 disabled:opacity-50">
                  {bulkProcessing ? 'Approving…' : `Approve All Pending (${queueSummary.pending})`}
                </button>
              )}
              <button type="button" onClick={exportReferralsCsv} className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-slate-200">
                <Download size={13}/> Export CSV
              </button>
            </div>
          )}
        </header>
        {filteredReferrals.length === 0 ? <p className="rounded-xl border border-white/10 p-4 text-sm text-slate-400">No one has joined through a referral yet.</p> : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs text-slate-400"><tr><th className="p-3">Invited by</th><th className="p-3">Verified customer</th><th className="p-3">Status</th><th className="p-3">Reward / action</th></tr></thead>
              <tbody className="divide-y divide-white/10">
                {filteredReferrals.map(row => <tr key={row.claim_id}>
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
