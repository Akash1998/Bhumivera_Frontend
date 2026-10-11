import { useCallback, useEffect, useState } from 'react';
import { affiliate as affiliateApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoaderCircle, Save, Users } from 'lucide-react';

const DEFAULTS = {
  enabled: 1,
  reward_mode: 'wallet',
  wallet_reward_amount: 100,
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
  const { showToast } = useToast() || {};

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsResponse, referralsResponse] = await Promise.all([
        affiliateApi.getAdminConfig(),
        affiliateApi.getAdminReferrals({ limit: 50 }),
      ]);
      setConfig({ ...DEFAULTS, ...readData(settingsResponse) });
      setReferrals(referralsResponse.data?.referrals || []);
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not load referral settings.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const change = (key, value) => setConfig(current => ({ ...current, [key]: value }));

  const save = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await affiliateApi.updateAdminConfig({
        ...config,
        enabled: Boolean(config.enabled),
        wallet_reward_amount: Number(config.wallet_reward_amount),
        coupon_discount_value: Number(config.coupon_discount_value),
        coupon_min_order_amount: Number(config.coupon_min_order_amount),
        coupon_valid_days: Number(config.coupon_valid_days),
      });
      setConfig({ ...DEFAULTS, ...readData(response) });
      showToast?.('Referral rewards saved.', 'success');
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not save referral rewards.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p role="status" className="flex items-center gap-2 text-sm text-slate-400"><LoaderCircle size={16} className="animate-spin"/>Loading referral settings…</p>;

  return (
    <div className="max-w-4xl space-y-6 text-slate-100">
      <header>
        <h3 className="text-lg font-semibold text-white">Refer a friend</h3>
        <p className="mt-1 text-sm leading-6 text-slate-400">Customers can share unlimited links. A reward is issued only after a referred customer’s first order is delivered. Referral credit and discount coupons cannot be withdrawn as cash.</p>
      </header>

      <form onSubmit={save} className="space-y-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <label className="flex items-start gap-3 text-sm text-white">
          <input type="checkbox" checked={Boolean(Number(config.enabled))} onChange={event => change('enabled', event.target.checked ? 1 : 0)} className="mt-0.5 h-4 w-4 accent-emerald-400"/>
          <span><strong>Referral rewards are on</strong><span className="mt-1 block text-xs text-slate-400">Turn this off to stop issuing new rewards. Existing rewards remain in customer accounts.</span></span>
        </label>

        <label className="block text-sm font-medium text-white">What should the referrer receive?
          <select value={config.reward_mode} onChange={event => change('reward_mode', event.target.value)} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2">
            <option value="wallet">Wallet balance only</option>
            <option value="coupon">Coupon only</option>
            <option value="wallet_coupon">Wallet balance and coupon</option>
          </select>
        </label>

        {['wallet', 'wallet_coupon'].includes(config.reward_mode) && (
          <label className="block max-w-sm text-sm font-medium text-white">Wallet reward per delivered referral (₹)
            <input type="number" min="0" max="100000" step="0.01" required value={config.wallet_reward_amount} onChange={event => change('wallet_reward_amount', event.target.value)} className="admin-glass-control mt-2 w-full rounded-lg px-3 py-2"/>
          </label>
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
          <h3 className="font-semibold text-white">Recent referrals</h3>
          <span className="text-xs text-slate-500">Latest 50 sign-ups</span>
        </header>
        {referrals.length === 0 ? <p className="rounded-xl border border-white/10 p-4 text-sm text-slate-400">No one has joined through a referral yet.</p> : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs text-slate-400"><tr><th className="p-3">Invited by</th><th className="p-3">New customer</th><th className="p-3">Reward status</th><th className="p-3">Reward</th></tr></thead>
              <tbody className="divide-y divide-white/10">
                {referrals.map(row => <tr key={row.referred_id}>
                  <td className="p-3"><span className="block text-white">{row.referrer_name}</span><span className="text-xs text-slate-500">{row.referrer_email}</span></td>
                  <td className="p-3"><span className="block text-white">{row.referred_name}</span><span className="text-xs text-slate-500">{row.referred_email}</span></td>
                  <td className="p-3">{row.rewarded_at ? 'Order delivered' : 'Waiting for first delivered order'}</td>
                  <td className="p-3">{row.rewarded_at ? [Number(row.wallet_amount) > 0 ? `₹${Number(row.wallet_amount).toFixed(2)} wallet` : '', row.coupon_code ? 'Coupon issued' : ''].filter(Boolean).join(' + ') : '—'}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
