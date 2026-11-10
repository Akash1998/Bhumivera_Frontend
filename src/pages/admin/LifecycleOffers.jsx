import React, { useEffect, useMemo, useState } from 'react';
import { coupons as couponsApi, products as productsApi, settings as settingsApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Gift,
  Save,
  Download,
  Sparkles,
  Calendar,
  TrendingUp,
  Users,
  Mail,
  CheckCircle2,
  Clock,
  Calculator,
} from 'lucide-react';

const INITIAL = {
  lifecycle_third_order_enabled: '0',
  lifecycle_third_order_gift_product_id: '',
  lifecycle_winback_enabled: '0',
  lifecycle_winback_days: '7',
  lifecycle_churn_days: '90',
  lifecycle_birthday_enabled: '0',
  lifecycle_birthday_coupon_code: '',
};

const LIFECYCLE_JOURNEY_BLUEPRINTS = [
  {
    stageId: 'LC-01',
    stageName: 'Welcome Botanical Onboarding',
    triggerEvent: 'Account Registration / First Sign-In',
    delayWindow: 'Immediate (< 2 mins)',
    channelMix: 'Email + In-App AI Co-Pilot',
    defaultIncentive: 'Free Shipping on ₹500+ & Purity Guide',
    targetCohort: 'New Registered Customers',
    guardrail: '1 per verified account',
    estOpenRate: '68.4%',
    estConversionRate: '24.2%',
    avgOrderValueInr: 1180,
    status: 'Active',
  },
  {
    stageId: 'LC-02',
    stageName: 'Second-Order Replenishment Nudge',
    triggerEvent: 'First Order Delivered + 21 Days',
    delayWindow: '21 Days Post-Delivery',
    channelMix: 'Email + WhatsApp',
    defaultIncentive: '5% Loyalty Multiplier Boost',
    targetCohort: '1-Time Buyers',
    guardrail: 'Suppressed if 2nd order placed',
    estOpenRate: '54.1%',
    estConversionRate: '18.7%',
    avgOrderValueInr: 1390,
    status: 'Active',
  },
  {
    stageId: 'LC-03',
    stageName: 'Third-Order Milestone Artisan Gift',
    triggerEvent: 'Customer Places 3rd Confirmed Order',
    delayWindow: 'Injected at 3rd Checkout',
    channelMix: 'Checkout Auto-Gift + Celebration Email',
    defaultIncentive: 'Complimentary Full-Size Botanical/Spice SKU',
    targetCohort: '3rd-Order Repeat Customers',
    guardrail: 'Strict 1-time milestone ledger lock',
    estOpenRate: '79.0%',
    estConversionRate: '39.5%',
    avgOrderValueInr: 1760,
    status: 'Configurable Above',
  },
  {
    stageId: 'LC-04',
    stageName: '45-Day Spice & Elixir Refill Reminder',
    triggerEvent: 'Consumable SKU Depletion Window',
    delayWindow: '45 Days Post-Purchase',
    channelMix: 'Email + 1-Click Reorder Link',
    defaultIncentive: '1-Click Restock Cart Pre-Fill',
    targetCohort: 'Culinary & Wellness Repeat Buyers',
    guardrail: 'SKU-specific consumption cadence',
    estOpenRate: '51.8%',
    estConversionRate: '21.4%',
    avgOrderValueInr: 1520,
    status: 'Active',
  },
  {
    stageId: 'LC-05',
    stageName: 'Win-Back Reactivation Offer',
    triggerEvent: 'No Order Activity Past Win-Back Days',
    delayWindow: 'Configurable (Default 7–30 Days)',
    channelMix: 'Email + Push Notification',
    defaultIncentive: 'Tiered Win-Back Coupon + Bonus Points',
    targetCohort: 'Lapsing Customers',
    guardrail: '30-day cooldown between triggers',
    estOpenRate: '46.2%',
    estConversionRate: '14.9%',
    avgOrderValueInr: 1410,
    status: 'Configurable Above',
  },
  {
    stageId: 'LC-06',
    stageName: '90-Day Churn Rescue Escalation',
    triggerEvent: 'Inactive Past Churn Window (90 Days)',
    delayWindow: '90 Days Post-Last Order',
    channelMix: 'VIP Concierge Email + AI Recovery Offer',
    defaultIncentive: 'High-Value Courtesy Coupon + Free Shipping',
    targetCohort: 'At-Risk / Churned VIPs',
    guardrail: 'Once per 180 days max',
    estOpenRate: '42.5%',
    estConversionRate: '11.8%',
    avgOrderValueInr: 1650,
    status: 'Configurable Above',
  },
  {
    stageId: 'LC-07',
    stageName: 'Birthday & Anniversary Royal Gift',
    triggerEvent: 'Customer Birthday Month / Account Anniversary',
    delayWindow: '08:00 AM IST on Celebration Date',
    channelMix: 'Luxury Branded Email + Wallet/Coupon Drop',
    defaultIncentive: 'Configured Birthday Coupon Code',
    targetCohort: 'Opted-In Loyalty Members',
    guardrail: '1 redemption per calendar year',
    estOpenRate: '74.6%',
    estConversionRate: '31.2%',
    avgOrderValueInr: 1890,
    status: 'Configurable Above',
  },
  {
    stageId: 'LC-08',
    stageName: 'Cart & Password Friction Instant Rescue',
    triggerEvent: 'Add-to-Cart Failure or Password/OTP Block',
    delayWindow: 'Real-Time (< 500ms)',
    channelMix: 'Bhumivera Client Concierge Drawer + 30-Min Rescue Link',
    defaultIncentive: 'Instant Alternative SKU / 1-Click Password Setup',
    targetCohort: 'All Active Storefront Visitors',
    guardrail: 'Cryptographic JWT & stock validation',
    estOpenRate: '88.2%',
    estConversionRate: '36.4%',
    avgOrderValueInr: 1490,
    status: 'Always On (Client Concierge)',
  },
];

export default function LifecycleOffers() {
  const [values, setValues] = useState(INITIAL);
  const [products, setProducts] = useState([]);
  const [couponCodes, setCouponCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stageFilter, setStageFilter] = useState('');
  const [simMonthlyCustomers, setSimMonthlyCustomers] = useState(2500);
  const [simAvgOrderValue, setSimAvgOrderValue] = useState(1450);
  const [simRepeatLiftPct, setSimRepeatLiftPct] = useState(18);
  const { showToast } = useToast() || {};

  useEffect(() => {
    let active = true;
    Promise.all([settingsApi.get(), productsApi.getAllAdmin(), couponsApi.getAllAdmin()])
      .then(([settingResponse, productResponse, couponResponse]) => {
        if (!active) return;
        setValues({ ...INITIAL, ...(settingResponse.data?.lifecycle || {}) });
        setProducts(productResponse.data?.products || productResponse.data?.data || productResponse.data || []);
        setCouponCodes(
          (couponResponse.data?.data || couponResponse.data?.coupons || couponResponse.data || [])
            .map(coupon => coupon.code)
            .filter(Boolean)
        );
      })
      .catch(error => {
        if (active) showToast?.(error.normalized?.message || 'Could not load lifecycle offers.', 'error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [showToast]);

  const set = (key, value) => setValues(current => ({ ...current, [key]: String(value) }));
  const save = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      await settingsApi.update(values);
      showToast?.('Lifecycle offers saved.', 'success');
    } catch (error) {
      showToast?.(error.normalized?.message || 'Could not save lifecycle offers.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredBlueprints = useMemo(() => {
    const q = stageFilter.trim().toLowerCase();
    if (!q) return LIFECYCLE_JOURNEY_BLUEPRINTS;
    return LIFECYCLE_JOURNEY_BLUEPRINTS.filter(
      b =>
        b.stageName.toLowerCase().includes(q) ||
        b.triggerEvent.toLowerCase().includes(q) ||
        b.channelMix.toLowerCase().includes(q) ||
        b.targetCohort.toLowerCase().includes(q)
    );
  }, [stageFilter]);

  const simulatedMonthlyIncrementalOrders = Math.round((simMonthlyCustomers * simRepeatLiftPct) / 100);
  const simulatedMonthlyIncrementalRevenue = simulatedMonthlyIncrementalOrders * simAvgOrderValue;
  const simulatedAnnualIncrementalRevenue = simulatedMonthlyIncrementalRevenue * 12;

  const handleExportBlueprintsCsv = () => {
    const headers = [
      'Stage ID',
      'Stage Name',
      'Trigger Event',
      'Delay Window',
      'Channel Mix',
      'Default Incentive',
      'Target Cohort',
      'Anti-Abuse Guardrail',
      'Est. Open Rate',
      'Est. Conversion Rate',
      'Avg Order Value (INR)',
      'Status',
    ];
    const escapeCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = filteredBlueprints.map(b =>
      [
        b.stageId,
        b.stageName,
        b.triggerEvent,
        b.delayWindow,
        b.channelMix,
        b.defaultIncentive,
        b.targetCohort,
        b.guardrail,
        b.estOpenRate,
        b.estConversionRate,
        b.avgOrderValueInr,
        b.status,
      ]
        .map(escapeCell)
        .join(',')
    );
    const csv = `\uFEFF${headers.map(escapeCell).join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhumivera-lifecycle-blueprints-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="p-6 text-sm text-slate-400">Loading lifecycle settings…</p>;

  return (
    <div className="space-y-8 text-slate-100">
      <form onSubmit={save} className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Promotion controls &amp; Client Retention Studio
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">Lifecycle Offers</h2>
            <p className="mt-1 text-xs text-slate-400">
              Automate 3rd-order milestone gifts, win-back triggers, churn rescue windows, and birthday celebrations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportBlueprintsCsv}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3.5 py-2.5 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25"
            >
              <Download size={15} />
              Export 12-Col Lifecycle CSV
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Saving…' : 'Save lifecycle offers'}
            </button>
          </div>
        </header>

        <section className="grid gap-6 border-y border-slate-800 py-5 lg:grid-cols-3">
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-white">
              <input
                type="checkbox"
                checked={
                  values.lifecycle_third_order_enabled === '1' || values.lifecycle_third_order_enabled === 1
                }
                onChange={event => set('lifecycle_third_order_enabled', event.target.checked ? '1' : '0')}
                className="h-4 w-4 accent-emerald-400"
              />
              Third-order gift
            </label>
            <label className="block text-xs text-slate-400">
              Gift product
              <select
                value={values.lifecycle_third_order_gift_product_id}
                onChange={event => set('lifecycle_third_order_gift_product_id', event.target.value)}
                className="mt-2 w-full border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-2 text-sm text-white"
              >
                <option value="">Choose a product</option>
                {products.map(product => (
                  <option key={product.id || product._id} value={product.id || product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-[11px] text-slate-400">
              Automatically unlocked on the customer&apos;s 3rd confirmed order at checkout.
            </p>
          </div>

          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-white">
              <input
                type="checkbox"
                checked={values.lifecycle_winback_enabled === '1' || values.lifecycle_winback_enabled === 1}
                onChange={event => set('lifecycle_winback_enabled', event.target.checked ? '1' : '0')}
                className="h-4 w-4 accent-emerald-400"
              />
              Win-back offer
            </label>
            <label className="block text-xs text-slate-400">
              Inactive days
              <input
                type="number"
                min="1"
                value={values.lifecycle_winback_days}
                onChange={event => set('lifecycle_winback_days', event.target.value)}
                className="mt-2 w-full border-b border-slate-700 bg-transparent px-1 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs text-slate-400">
              Churn window (days)
              <input
                type="number"
                min="1"
                value={values.lifecycle_churn_days}
                onChange={event => set('lifecycle_churn_days', event.target.value)}
                className="mt-2 w-full border-b border-slate-700 bg-transparent px-1 py-2 text-sm text-white"
              />
            </label>
          </div>

          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-white">
              <input
                type="checkbox"
                checked={values.lifecycle_birthday_enabled === '1' || values.lifecycle_birthday_enabled === 1}
                onChange={event => set('lifecycle_birthday_enabled', event.target.checked ? '1' : '0')}
                className="h-4 w-4 accent-emerald-400"
              />
              Birthday coupon
            </label>
            <label className="block text-xs text-slate-400">
              Coupon
              <select
                value={values.lifecycle_birthday_coupon_code}
                onChange={event => set('lifecycle_birthday_coupon_code', event.target.value)}
                className="mt-2 w-full border border-slate-700 bg-[#081b15]/90 backdrop-blur-xl px-3 py-2 text-sm text-white"
              >
                <option value="">Choose a coupon</option>
                {couponCodes.map(code => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-[11px] text-slate-400">
              Dispatched automatically on the customer&apos;s verified birthday month.
            </p>
          </div>
        </section>

        <p className="flex items-center gap-2 text-xs text-slate-500">
          <Gift size={14} />
          Offer settings are stored centrally.
        </p>
      </form>

      {/* Interactive Retention ROI & Revenue Forecaster */}
      <section className="rounded-2xl border border-white/10 bg-[#071a12]/90 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Calculator size={17} className="text-[#d4af37]" />
            <div>
              <h3 className="text-sm font-bold text-white">Lifecycle Retention &amp; Win-Back Revenue Forecaster</h3>
              <p className="text-xs text-slate-400">
                Simulate incremental monthly &amp; annual repeat revenue generated by automated lifecycle flows.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 px-3 py-1 text-xs font-bold text-[#d4af37]">
            Projected Annual Lift: ₹{simulatedAnnualIncrementalRevenue.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <label className="block rounded-xl bg-black/30 border border-white/10 p-3.5">
            <span className="text-slate-400 block mb-1">Active Monthly Customer Base</span>
            <input
              type="number"
              min="100"
              step="100"
              value={simMonthlyCustomers}
              onChange={e => setSimMonthlyCustomers(Math.max(100, Number(e.target.value) || 0))}
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm font-mono font-bold text-white"
            />
          </label>
          <label className="block rounded-xl bg-black/30 border border-white/10 p-3.5">
            <span className="text-slate-400 block mb-1">Average Repeat Order Value (₹)</span>
            <input
              type="number"
              min="200"
              step="50"
              value={simAvgOrderValue}
              onChange={e => setSimAvgOrderValue(Math.max(200, Number(e.target.value) || 0))}
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm font-mono font-bold text-white"
            />
          </label>
          <label className="block rounded-xl bg-black/30 border border-white/10 p-3.5">
            <span className="text-slate-400 block mb-1">Expected Lifecycle Repeat Lift (%)</span>
            <input
              type="number"
              min="1"
              max="80"
              value={simRepeatLiftPct}
              onChange={e => setSimRepeatLiftPct(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-1.5 text-sm font-mono font-bold text-emerald-300"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/25 p-3">
            <span className="text-slate-400 block">Incremental Orders / Month</span>
            <strong className="text-lg font-black text-white">
              +{simulatedMonthlyIncrementalOrders.toLocaleString('en-IN')} Orders
            </strong>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/25 p-3">
            <span className="text-slate-400 block">Incremental Revenue / Month</span>
            <strong className="text-lg font-black text-emerald-300">
              ₹{simulatedMonthlyIncrementalRevenue.toLocaleString('en-IN')}
            </strong>
          </div>
          <div className="rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 p-3">
            <span className="text-slate-400 block">Annualized Retention Revenue</span>
            <strong className="text-lg font-black text-[#d4af37]">
              ₹{simulatedAnnualIncrementalRevenue.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>
      </section>

      {/* Expanded 12-Column Customer Lifecycle Journey Matrix */}
      <section className="rounded-2xl border border-white/10 bg-[#071a12]/90 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-[#d4af37]" />
              Expanded 8-Stage Customer Lifecycle Automation Matrix (12 Columns)
            </h3>
            <p className="text-xs text-slate-400">
              End-to-end view of all onboarding, milestone gift, refill, win-back, churn rescue, and AI friction flows.
            </p>
          </div>
          <input
            type="text"
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            placeholder="Filter stage, trigger, or cohort…"
            className="rounded-xl border border-white/15 bg-black/40 px-3.5 py-1.5 text-xs text-white w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-xs">
            <thead className="bg-black/40 uppercase text-[10px] tracking-wider text-slate-400">
              <tr>
                <th className="p-3">Stage ID</th>
                <th className="p-3">Journey Stage</th>
                <th className="p-3">Trigger Condition</th>
                <th className="p-3">Timing / Delay</th>
                <th className="p-3">Channel Mix</th>
                <th className="p-3">Reward / Incentive</th>
                <th className="p-3">Target Cohort</th>
                <th className="p-3">Anti-Abuse Guardrail</th>
                <th className="p-3 text-right">Open Rate</th>
                <th className="p-3 text-right">Conv. Rate</th>
                <th className="p-3 text-right">Avg Order (₹)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredBlueprints.map(row => (
                <tr key={row.stageId} className="hover:bg-white/[0.03]">
                  <td className="p-3 font-mono font-bold text-[#d4af37]">{row.stageId}</td>
                  <td className="p-3 font-semibold text-white">{row.stageName}</td>
                  <td className="p-3 text-slate-300">{row.triggerEvent}</td>
                  <td className="p-3 text-slate-400">{row.delayWindow}</td>
                  <td className="p-3 text-cyan-300">{row.channelMix}</td>
                  <td className="p-3 text-emerald-200">{row.defaultIncentive}</td>
                  <td className="p-3 text-slate-300">{row.targetCohort}</td>
                  <td className="p-3 text-slate-400">{row.guardrail}</td>
                  <td className="p-3 text-right font-mono text-emerald-300">{row.estOpenRate}</td>
                  <td className="p-3 text-right font-mono text-[#d4af37]">{row.estConversionRate}</td>
                  <td className="p-3 text-right font-mono font-bold text-white">
                    ₹{row.avgOrderValueInr.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      <CheckCircle2 size={11} />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
