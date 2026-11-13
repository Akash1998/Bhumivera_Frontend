import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  Calculator,
  CheckCircle2,
  Coins,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react';
import { affiliate as affiliateApi } from '../../services/api';

const PERIODS = [
  ['7d', 'Last 7 days'],
  ['30d', 'Last 30 days'],
  ['90d', 'Last 90 days'],
  ['month', 'This month'],
  ['all', 'All time'],
];
const EMPTY_PARTNERS = [];

const money = value => `₹${(Number(value) || 0).toLocaleString('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

const formatDate = value => value ? new Date(value).toLocaleString() : '—';
const formatPercent = value => `${(Number(value) || 0).toFixed(2)}%`;

const MetricCard = ({ icon: Icon, label, value, detail }) => (
  <article className="rounded-xl border border-[#244A38] bg-[#0b1c14] p-4">
    <div className="flex items-center justify-between gap-2 text-[#9BB0A5]">
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      {React.createElement(Icon, { size: 16, className: 'text-[#D4AF37]' })}
    </div>
    <p className="mt-2 text-xl font-bold text-white">{value}</p>
    {detail && <p className="mt-1 text-[10px] text-[#9BB0A5]">{detail}</p>}
  </article>
);

function Pagination({ page, total, limit, onChange }) {
  const pages = Math.max(1, Math.ceil((Number(total) || 0) / limit));
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-3 text-xs text-[#9BB0A5]">
      <span>Page {page} of {pages} · {total} records</span>
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded border border-[#315541] px-2 py-1 text-white disabled:opacity-40">Previous</button>
      <button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)} className="rounded border border-[#315541] px-2 py-1 text-white disabled:opacity-40">Next</button>
    </div>
  );
}

export default function PromoterAnalyticsDashboard({ config }) {
  const [period, setPeriod] = useState('30d');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [performance, setPerformance] = useState(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [detailTab, setDetailTab] = useState('customers');
  const [orderPage, setOrderPage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);
  const [payoutReferences, setPayoutReferences] = useState({});
  const [payingCommissionId, setPayingCommissionId] = useState(null);
  const [eligibleProducts, setEligibleProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productError, setProductError] = useState('');
  const [scenario, setScenario] = useState({
    partnerId: '',
    scenarioMode: 'sales_target',
    referredPeople: '',
    conversionPercent: '',
    salesTarget: '',
    paymentMode: 'online',
    basket: [],
  });
  const [scenarioResult, setScenarioResult] = useState(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [scenarioError, setScenarioError] = useState('');

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await affiliateApi.getAdminAnalytics({ period });
      setAnalytics(data);
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Could not load promoter analytics.');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);
  useEffect(() => {
    let active = true;
    affiliateApi.getAdminEligibleProducts()
      .then(({ data }) => {
        if (active) setEligibleProducts(data.products || []);
      })
      .catch(loadError => {
        if (active) setProductError(loadError.response?.data?.message || 'Could not load products with inventory costs.');
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    setOrderPage(1);
    setCustomerPage(1);
  }, [selectedPartnerId, period, debouncedSearch]);

  const loadPerformance = useCallback(async () => {
    if (!selectedPartnerId) {
      setPerformance(null);
      return;
    }
    setPerformanceLoading(true);
    try {
      const { data } = await affiliateApi.getAdminPartnerPerformance(selectedPartnerId, {
        period,
        search: debouncedSearch,
        orderPage,
        customerPage,
        limit: 20,
      });
      setPerformance(data);
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Could not load promoter customer and order details.');
      setPerformance(null);
    } finally {
      setPerformanceLoading(false);
    }
  }, [selectedPartnerId, period, debouncedSearch, orderPage, customerPage]);

  useEffect(() => { loadPerformance(); }, [loadPerformance]);

  const partners = analytics?.partners || EMPTY_PARTNERS;
  const selectedPartner = useMemo(
    () => partners.find(partner => String(partner.id) === String(selectedPartnerId)),
    [partners, selectedPartnerId]
  );
  const summary = analytics?.summary || {};
  const textInputClass = 'w-full rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2 text-sm text-white outline-none focus:border-[#D4AF37]';
  const tableClass = 'w-full min-w-[760px] text-left text-xs';

  const runScenario = async event => {
    event.preventDefault();
    setScenarioLoading(true);
    setScenarioError('');
    setScenarioResult(null);
    try {
      const { data } = await affiliateApi.simulateAdminScenario({
        ...scenario,
        partnerId: scenario.partnerId || null,
        referredPeople: Number(scenario.referredPeople),
        conversionPercent: scenario.scenarioMode === 'conversion' ? Number(scenario.conversionPercent) : 0,
        salesTarget: scenario.scenarioMode === 'sales_target' ? Number(scenario.salesTarget) : 0,
        basket: scenario.basket.map(item => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      });
      setScenarioResult(data);
    } catch (simulationError) {
      setScenarioError(simulationError.response?.data?.message || 'Could not calculate this scenario.');
    } finally {
      setScenarioLoading(false);
    }
  };

  const recordPayout = async order => {
    const reference = String(payoutReferences[order.commission_id] || '').trim();
    if (reference.length < 3) {
      setError('Enter the bank/UPI transfer reference before recording a payout.');
      return;
    }
    setPayingCommissionId(order.commission_id);
    setError('');
    try {
      await affiliateApi.payAdminCommission(order.commission_id, { reference });
      setPayoutReferences(current => ({ ...current, [order.commission_id]: '' }));
      await Promise.all([loadPerformance(), loadAnalytics()]);
    } catch (payoutError) {
      setError(payoutError.response?.data?.message || 'Could not record this payout.');
    } finally {
      setPayingCommissionId(null);
    }
  };

  const periodControl = (
    <label className="flex items-center gap-2 text-xs text-[#9BB0A5]">
      Report range
      <select value={period} onChange={event => setPeriod(event.target.value)} className="rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2 text-xs text-white">
        {PERIODS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
  );

  return (
    <div className="space-y-5">
      <section className="space-y-4 rounded-2xl border border-[#244A38] bg-[#102219] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2"><BarChart3 className="text-[#D4AF37]" size={18}/><h2 className="font-serif text-lg font-bold text-white">Promoter performance</h2></div>
            <p className="mt-1 text-xs text-[#9BB0A5]">Actual attributed orders, buyer accounts, commission status, and recorded transfers. A referred customer appears after an affiliate-coded order; anonymous link visits are not customer records. No sample activity is included.</p>
          </div>
          <div className="flex items-center gap-2">{periodControl}<button type="button" onClick={loadAnalytics} disabled={loading} aria-label="Refresh promoter analytics" className="rounded-lg border border-[#315541] p-2 text-white disabled:opacity-50"><RefreshCw size={14} className={loading ? 'animate-spin' : ''}/></button></div>
        </div>
        {error && <div role="alert" className="flex gap-2 rounded-lg border border-rose-400/30 bg-rose-950/30 p-3 text-xs text-rose-200"><AlertCircle size={15}/>{error}</div>}
        {loading && !analytics ? <p className="py-8 text-center text-sm text-[#9BB0A5]">Loading real promoter activity…</p> : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={Users} label="Promoters" value={partners.length}/>
              <MetricCard icon={Users} label="Referred customers" value={Number(summary.referred_customers || 0).toLocaleString('en-IN')}/>
              <MetricCard icon={ShoppingBag} label="Attributed orders" value={Number(summary.attributed_orders || 0).toLocaleString('en-IN')}/>
              <MetricCard icon={BarChart3} label="Discounted merchandise sales" value={money(summary.discounted_merchandise_sales)} detail="After recorded discounts; merchandise only"/>
              <MetricCard icon={Coins} label="Commissions pending delivery" value={money(summary.pending_commission)}/>
              <MetricCard icon={Coins} label="Promoter commission / sales" value={formatPercent(summary.commission_percent_of_sales)} detail="Actual commissions divided by discounted merchandise sales"/>
              <MetricCard icon={Wallet} label="Available payout balance" value={money(summary.payable_commission)} detail="Delivered commissions awaiting manual payout"/>
              <MetricCard icon={Wallet} label="Actual payouts in range" value={money(summary.amount_paid)} detail={`${Number(summary.payout_count || 0)} recorded transfers`}/>
              <MetricCard icon={CheckCircle2} label="Average retained margin" value={formatPercent(summary.average_retained_margin)} detail="Contribution margin from actual snapshots"/>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#244A38]">
              <table className={tableClass}>
                <thead className="bg-[#0b1c14] text-[10px] uppercase tracking-wider text-[#9BB0A5]">
                  <tr><th className="p-3">Promoter / offer</th><th>Status</th><th>Customers</th><th>Orders</th><th>Sales after discount</th><th>Commission / sales</th><th>Pending</th><th>Payable now</th><th>Paid lifetime</th></tr>
                </thead>
                <tbody className="divide-y divide-[#244A38]">
                  {partners.map(partner => (
                    <tr key={partner.id} className={`cursor-pointer transition hover:bg-white/[0.03] ${String(selectedPartnerId) === String(partner.id) ? 'bg-[#D4AF37]/10' : ''}`} onClick={() => setSelectedPartnerId(String(partner.id))}>
                      <td className="p-3"><strong className="text-white">{partner.user_name || partner.user_email}</strong><span className="mt-1 block text-[#9BB0A5]">{partner.referral_code || 'No code'} · {partner.discount_percent}% off · {partner.commission_share_percent}% share</span></td>
                      <td className="capitalize">{partner.status}</td>
                      <td>{Number(partner.referred_customers || 0).toLocaleString('en-IN')}</td>
                      <td>{Number(partner.attributed_orders || 0).toLocaleString('en-IN')}</td>
                      <td>{money(partner.discounted_merchandise_sales)}</td>
                      <td>{formatPercent(partner.commission_percent_of_sales)}</td>
                      <td>{money(partner.pending_commission)}</td>
                      <td>{money(partner.payable_amount)}</td>
                      <td>{money(partner.lifetime_paid_amount)}</td>
                    </tr>
                  ))}
                  {!loading && partners.length === 0 && <tr><td colSpan="9" className="p-6 text-center text-[#9BB0A5]">No promoter accounts yet. Add one below or approve a submitted application; order analytics appear after attributed purchases.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-[#244A38] bg-[#102219] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2"><Users className="text-[#D4AF37]" size={18}/><h2 className="font-serif text-lg font-bold text-white">Promoter account drill-down</h2></div>
            <p className="mt-1 text-xs text-[#9BB0A5]">Select a promoter to see registered customers who placed attributed orders, plus every order’s cost and earnings breakdown.</p>
          </div>
          <select aria-label="Select promoter" value={selectedPartnerId} onChange={event => setSelectedPartnerId(event.target.value)} className="min-w-60 rounded-lg border border-[#315541] bg-[#0b1c14] px-3 py-2 text-xs text-white">
            <option value="">Select a promoter</option>
            {partners.map(partner => <option key={partner.id} value={partner.id}>{partner.user_name || partner.user_email} · {partner.referral_code || 'pending'}</option>)}
          </select>
        </div>
        {selectedPartner && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={Users} label="Unique referred buyers" value={Number(performance?.summary?.referred_customers || 0).toLocaleString('en-IN')}/>
              <MetricCard icon={ShoppingBag} label="Orders in range" value={Number(performance?.summary?.attributed_orders || 0).toLocaleString('en-IN')}/>
              <MetricCard icon={Coins} label="Pending / payable now" value={`${money(performance?.summary?.pending_commission)} / ${money(selectedPartner.payable_amount)}`}/>
              <MetricCard icon={BarChart3} label="Retained contribution margin" value={formatPercent(performance?.summary?.average_retained_margin)}/>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button type="button" onClick={() => setDetailTab('customers')} className={`rounded-lg px-3 py-2 text-xs font-bold ${detailTab === 'customers' ? 'bg-[#D4AF37] text-[#102219]' : 'border border-[#315541] text-white'}`}>Referred customer accounts</button>
                <button type="button" onClick={() => setDetailTab('orders')} className={`rounded-lg px-3 py-2 text-xs font-bold ${detailTab === 'orders' ? 'bg-[#D4AF37] text-[#102219]' : 'border border-[#315541] text-white'}`}>Order-level earnings</button>
              </div>
              <label className="flex min-w-56 items-center gap-2 rounded-lg border border-[#315541] px-3 py-2 text-[#9BB0A5]">
                <Search size={14}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search customer or order" className="w-full bg-transparent text-xs text-white outline-none"/>
              </label>
            </div>
            {performanceLoading ? <p className="py-8 text-center text-sm text-[#9BB0A5]">Loading promoter details…</p> : !performance ? (
              <p className="py-8 text-center text-sm text-[#9BB0A5]">Could not load promoter details.</p>
            ) : detailTab === 'customers' ? (
              <>
                <div className="overflow-x-auto rounded-xl border border-[#244A38]">
                  <table className={tableClass}>
                    <thead className="bg-[#0b1c14] text-[10px] uppercase tracking-wider text-[#9BB0A5]"><tr><th className="p-3">Referred customer</th><th>Orders</th><th>Merchandise sales</th><th>Revenue ex GST</th><th>Commission attributed</th><th>Commission / sales</th><th>Last order</th></tr></thead>
                    <tbody className="divide-y divide-[#244A38]">
                      {performance.customers.map(customer => (
                        <tr key={customer.customer_id}>
                          <td className="p-3"><strong className="text-white">{customer.customer_name || 'Customer'}</strong><span className="block text-[#9BB0A5]">{customer.customer_email}</span></td>
                          <td>{Number(customer.order_count || 0)}</td><td>{money(customer.discounted_merchandise_sales)}</td><td>{money(customer.revenue_ex_tax)}</td><td>{money(customer.attributed_commission)}</td><td>{formatPercent(customer.commission_percent_of_sales)}</td><td>{formatDate(customer.last_order_at)}</td>
                        </tr>
                      ))}
                      {performance.customers.length === 0 && <tr><td colSpan="7" className="p-6 text-center text-[#9BB0A5]">No referred customer orders in this period.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <Pagination page={performance.customerPage} total={performance.customerCount} limit={performance.limit} onChange={setCustomerPage}/>
              </>
            ) : (
              <>
                <div className="overflow-x-auto rounded-xl border border-[#244A38]">
                  <table className="w-full min-w-[1420px] text-left text-xs">
                    <thead className="bg-[#0b1c14] text-[10px] uppercase tracking-wider text-[#9BB0A5]"><tr><th className="p-3">Order / customer / items</th><th>Order &amp; payment status</th><th>Subtotal / discount</th><th>Revenue ex GST</th><th>Product cost</th><th>Fee / fulfillment / RTO</th><th>Promoter earning</th><th>Retained margin</th><th>Payment record</th></tr></thead>
                    <tbody className="divide-y divide-[#244A38]">
                      {performance.orders.map(order => (
                        <tr key={order.commission_id}>
                          <td className="p-3"><strong className="text-white">#{order.order_id} · {order.customer_name || 'Customer'}</strong><span className="block text-[#9BB0A5]">{order.customer_email}</span><span className="block max-w-[340px] whitespace-normal text-[#9BB0A5]">{order.item_summary || 'Items unavailable'}</span><span className="block text-[#718A7D]">{formatDate(order.order_created_at)}</span></td>
                          <td className="capitalize">{order.order_status} · {order.payment_mode}<span className="block text-[#9BB0A5]">Commission {order.commission_status}</span></td>
                          <td>{money(order.order_subtotal)}<span className="block text-[#9BB0A5]">−{money(order.discount_amount)}</span></td>
                          <td>{money(order.revenue_ex_tax)}</td><td>{money(order.product_cost)}</td>
                          <td>{money(order.payment_fee)}<span className="block text-[#9BB0A5]">{money(order.fulfillment_cost)} / {money(order.rto_reserve)}</span></td>
                          <td className="font-bold text-[#FCE096]">{money(order.commission_amount)}<span className="block text-[#9BB0A5]">{order.commission_share_percent}% share · {formatPercent(order.commission_percent_of_sales)} of sales</span></td>
                          <td>{formatPercent(order.retained_margin_percent)}<span className="block text-[#9BB0A5]">Kept {money(order.retained_profit)}</span></td>
                          <td>
                            {order.commission_status === 'approved' ? (
                              <div className="flex min-w-52 gap-1">
                                <input aria-label={`Payout reference for order ${order.order_id}`} value={payoutReferences[order.commission_id] || ''} onChange={event => setPayoutReferences(current => ({ ...current, [order.commission_id]: event.target.value }))} placeholder="Transfer reference" className="w-32 rounded border border-[#315541] bg-[#0b1c14] px-2 py-1.5 text-white"/>
                                <button type="button" disabled={payingCommissionId === order.commission_id} onClick={() => recordPayout(order)} className="rounded bg-[#D4AF37] px-2 py-1.5 font-bold text-[#102219] disabled:opacity-50">{payingCommissionId === order.commission_id ? '…' : 'Mark paid'}</button>
                              </div>
                            ) : order.payout_amount ? (
                              <span className="text-emerald-200">{money(order.payout_amount)}<span className="block text-[#9BB0A5]">{order.payout_reference} · {formatDate(order.paid_at)}</span></span>
                            ) : <span className="text-[#9BB0A5]">{order.commission_status === 'pending' ? 'Payable after delivery' : order.commission_status}</span>}
                          </td>
                        </tr>
                      ))}
                      {performance.orders.length === 0 && <tr><td colSpan="9" className="p-6 text-center text-[#9BB0A5]">No attributed orders in this period.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <Pagination page={performance.orderPage} total={performance.orderCount} limit={performance.limit} onChange={setOrderPage}/>
              </>
            )}
          </>
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="space-y-3 rounded-2xl border border-[#244A38] bg-[#102219] p-5">
          <div className="flex items-center gap-2"><Coins className="text-[#D4AF37]" size={18}/><h2 className="font-serif text-lg font-bold text-white">Weekly commission activity</h2></div>
          <p className="text-xs text-[#9BB0A5]">Grouped by attributed order date. Pending is not yet payable; approved is eligible for manual payout; reversals are shown separately.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs"><thead className="text-[10px] uppercase text-[#9BB0A5]"><tr><th className="py-2">Order week</th><th>Orders</th><th>Pending</th><th>Approved</th><th>Paid</th><th>Reversed</th></tr></thead><tbody className="divide-y divide-[#244A38]">
              {(analytics?.weeklyEarnings || []).map(row => <tr key={row.period_key}><td className="py-2 text-white">{row.period_label}</td><td>{Number(row.order_count)}</td><td>{money(row.pending_amount)}</td><td>{money(row.payable_amount)}</td><td>{money(row.paid_amount)}</td><td>{money(row.reversed_amount)}</td></tr>)}
              {!analytics?.weeklyEarnings?.length && <tr><td colSpan="6" className="py-4 text-[#9BB0A5]">No attributed weekly orders.</td></tr>}
            </tbody></table>
          </div>
        </article>
        <article className="space-y-3 rounded-2xl border border-[#244A38] bg-[#102219] p-5">
          <div className="flex items-center gap-2"><Coins className="text-[#D4AF37]" size={18}/><h2 className="font-serif text-lg font-bold text-white">Monthly commission activity</h2></div>
          <p className="text-xs text-[#9BB0A5]">Shows actual commission states by order month, not guaranteed future income.</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs"><thead className="text-[10px] uppercase text-[#9BB0A5]"><tr><th className="py-2">Order month</th><th>Orders</th><th>Pending</th><th>Approved</th><th>Paid</th><th>Reversed</th></tr></thead><tbody className="divide-y divide-[#244A38]">
              {(analytics?.monthlyEarnings || []).map(row => <tr key={row.period_label}><td className="py-2 text-white">{row.period_label}</td><td>{Number(row.order_count)}</td><td>{money(row.pending_amount)}</td><td>{money(row.payable_amount)}</td><td>{money(row.paid_amount)}</td><td>{money(row.reversed_amount)}</td></tr>)}
              {!analytics?.monthlyEarnings?.length && <tr><td colSpan="6" className="py-4 text-[#9BB0A5]">No attributed monthly orders.</td></tr>}
            </tbody></table>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="space-y-3 rounded-2xl border border-[#244A38] bg-[#102219] p-5">
          <div className="flex items-center gap-2"><Wallet className="text-[#D4AF37]" size={18}/><h2 className="font-serif text-lg font-bold text-white">Actual weekly payouts</h2></div>
          <p className="text-xs text-[#9BB0A5]">Only recorded transfers are shown. Weekly/monthly rows are reporting periods, not automatic payout schedules.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs"><thead className="text-[10px] uppercase text-[#9BB0A5]"><tr><th className="py-2">Week</th><th>Transfers</th><th>Amount paid</th></tr></thead><tbody className="divide-y divide-[#244A38]">
              {(analytics?.weeklyPayouts || []).map(row => <tr key={row.period_key}><td className="py-2 text-white">{row.period_label}</td><td>{Number(row.payout_count)}</td><td>{money(row.amount_paid)}</td></tr>)}
              {!analytics?.weeklyPayouts?.length && <tr><td colSpan="3" className="py-4 text-[#9BB0A5]">No recorded weekly payouts.</td></tr>}
            </tbody></table>
          </div>
        </article>
        <article className="space-y-3 rounded-2xl border border-[#244A38] bg-[#102219] p-5">
          <div className="flex items-center gap-2"><Wallet className="text-[#D4AF37]" size={18}/><h2 className="font-serif text-lg font-bold text-white">Actual monthly payouts</h2></div>
          <p className="text-xs text-[#9BB0A5]">Payout totals are grouped by the transfer date recorded in the ledger.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs"><thead className="text-[10px] uppercase text-[#9BB0A5]"><tr><th className="py-2">Month</th><th>Transfers</th><th>Amount paid</th></tr></thead><tbody className="divide-y divide-[#244A38]">
              {(analytics?.monthlyPayouts || []).map(row => <tr key={row.period_label}><td className="py-2 text-white">{row.period_label}</td><td>{Number(row.payout_count)}</td><td>{money(row.amount_paid)}</td></tr>)}
              {!analytics?.monthlyPayouts?.length && <tr><td colSpan="3" className="py-4 text-[#9BB0A5]">No recorded monthly payouts.</td></tr>}
            </tbody></table>
          </div>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#244A38] bg-[#102219] p-5">
        <div className="flex items-center gap-2"><Calculator className="text-[#D4AF37]" size={18}/><h2 className="font-serif text-lg font-bold text-white">Earnings scenario calculator</h2></div>
        <p className="text-xs leading-5 text-[#9BB0A5]">Use real active products and their inventory costs to estimate a basket. Choose either a total sales target or an assumed conversion rate; the panel does not invent a conversion rate or add demo activity.</p>
        <form onSubmit={runScenario} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Promoter rate
            <select value={scenario.partnerId} onChange={event => setScenario(current => ({ ...current, partnerId: event.target.value }))} className={textInputClass}>
              <option value="">Use program default rates</option>
              {partners.map(partner => <option key={partner.id} value={partner.id}>{partner.user_name || partner.user_email} · {partner.referral_code || 'no code'}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">People referred
            <input required type="number" min="1" max="10000000" step="1" value={scenario.referredPeople} onChange={event => setScenario(current => ({ ...current, referredPeople: event.target.value }))} className={textInputClass} placeholder="Enter your assumption"/>
          </label>
          <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Estimate from
            <select value={scenario.scenarioMode} onChange={event => setScenario(current => ({ ...current, scenarioMode: event.target.value }))} className={textInputClass}>
              <option value="sales_target">Total sales target</option>
              <option value="conversion">Conversion-rate assumption</option>
            </select>
          </label>
          {scenario.scenarioMode === 'sales_target' ? (
            <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Total merchandise sales target after discount (incl. GST)
              <input required type="number" min="0" max="1000000000" step="0.01" value={scenario.salesTarget} onChange={event => setScenario(current => ({ ...current, salesTarget: event.target.value }))} className={textInputClass} placeholder="Enter your sales target"/>
            </label>
          ) : (
            <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Expected conversion % (assumption)
              <input required type="number" min="0" max="100" step="0.1" value={scenario.conversionPercent} onChange={event => setScenario(current => ({ ...current, conversionPercent: event.target.value }))} className={textInputClass} placeholder="Enter your assumption"/>
            </label>
          )}
          <label className="space-y-1 text-[10px] font-semibold text-[#9BB0A5]">Payment mode
            <select value={scenario.paymentMode} onChange={event => setScenario(current => ({ ...current, paymentMode: event.target.value }))} className={textInputClass}>
              <option value="online">Online</option><option value="COD">COD</option><option value="WALLET">Wallet</option>
            </select>
          </label>
          <div className="flex items-end"><button type="submit" disabled={scenarioLoading || productsLoading || eligibleProducts.length === 0 || scenario.basket.length === 0 || scenario.basket.some(item => !item.productId)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-xs font-bold text-[#102219] disabled:opacity-50"><Calculator size={14}/>{scenarioLoading ? 'Calculating…' : 'Calculate scenario'}</button></div>
          </div>
          <div className="space-y-2 rounded-xl border border-[#244A38] bg-[#0b1c14] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><h3 className="text-sm font-bold text-white">Average customer basket</h3><p className="mt-1 text-[10px] text-[#9BB0A5]">Select products with positive inventory cost. Prices, tax rates, and costs are loaded from the live catalog and inventory.</p></div>
            <button type="button" disabled={productsLoading || eligibleProducts.length === 0} onClick={() => setScenario(current => ({ ...current, basket: [...current.basket, { productId: '', quantity: '1' }] }))} className="inline-flex items-center gap-1 rounded-lg border border-[#315541] px-3 py-2 text-xs font-bold text-[#FCE096] disabled:opacity-40"><Plus size={14}/>Add item</button>
          </div>
          {productsLoading && <p className="text-xs text-[#9BB0A5]">Loading priced inventory…</p>}
          {productError && <p role="alert" className="text-xs text-rose-200">{productError}</p>}
          {!productsLoading && !productError && eligibleProducts.length === 0 && <p className="text-xs text-amber-100">No active catalog products with a positive inventory cost are available for the forecast.</p>}
          {scenario.basket.map((item, index) => (
            <div key={`${index}-${item.productId}`} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_120px_40px]">
              <select required aria-label={`Basket product ${index + 1}`} value={item.productId} onChange={event => setScenario(current => ({ ...current, basket: current.basket.map((line, lineIndex) => lineIndex === index ? { ...line, productId: event.target.value } : line) }))} className={textInputClass}>
                <option value="">Choose a live catalog product</option>
                {eligibleProducts.map(product => <option key={product.id} value={product.id}>{product.name} · sale {money(product.selling_price)} · cost {money(product.cost_price)} · GST {formatPercent(product.gst_rate)}</option>)}
              </select>
              <input required aria-label={`Quantity per basket for item ${index + 1}`} type="number" min="1" max="100" step="1" value={item.quantity} onChange={event => setScenario(current => ({ ...current, basket: current.basket.map((line, lineIndex) => lineIndex === index ? { ...line, quantity: event.target.value } : line) }))} className={textInputClass} placeholder="Qty / order"/>
              <button type="button" aria-label={`Remove basket item ${index + 1}`} onClick={() => setScenario(current => ({ ...current, basket: current.basket.filter((_, lineIndex) => lineIndex !== index) }))} className="flex items-center justify-center rounded-lg border border-rose-400/30 text-rose-200"><Trash2 size={15}/></button>
            </div>
          ))}
          {scenario.basket.length === 0 && <p className="rounded-lg border border-dashed border-[#315541] px-3 py-4 text-center text-xs text-[#9BB0A5]">Add the products and quantities that represent one average order.</p>}
          </div>
        </form>
        {scenarioError && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-950/30 p-3 text-xs text-rose-200">{scenarioError}</p>}
        {scenarioResult && (
          <div className="space-y-3 rounded-xl border border-[#315541] bg-[#0b1c14] p-4">
            {scenarioResult.belowMinimum && <p role="alert" className="rounded-lg border border-amber-400/30 bg-amber-950/20 p-3 text-xs text-amber-100">Average discounted merchandise order is below the {money(scenarioResult.minimumOrderAmount)} site minimum. Orders at this average cannot be placed, so projected promoter commission is zero.</p>}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={ShoppingBag} label="Expected orders" value={Number(scenarioResult.assumptions.expectedOrders).toFixed(1)} detail={`${Number(scenarioResult.assumptions.referredPeople)} referrals · ${formatPercent(scenarioResult.assumptions.impliedConversionPercent)} ${scenarioResult.assumptions.scenarioMode === 'conversion' ? 'assumed' : 'implied'} conversion`}/>
              <MetricCard icon={BarChart3} label="Average order value" value={money(scenarioResult.assumptions.averageOrderValue)} detail="After promoter discount, merchandise only"/>
              <MetricCard icon={Coins} label="Estimated promoter commission" value={money(scenarioResult.result.commission)} detail={scenarioResult.result.eligible ? `${scenarioResult.assumptions.commissionSharePercent}% of contribution, margin-capped` : 'Not commission-eligible under these assumptions'}/>
              <MetricCard icon={CheckCircle2} label="Estimated retained margin" value={formatPercent(scenarioResult.result.retainedMarginPercent)} detail={`Floor ${formatPercent(config.minimum_retained_margin_percent)}`}/>
            </div>
            <div className="overflow-x-auto rounded-lg border border-[#244A38]">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead className="bg-[#102219] text-[10px] uppercase text-[#9BB0A5]"><tr><th className="p-3">Basket product</th><th>Qty / order</th><th>Sale price</th><th>Unit cost</th><th>GST</th></tr></thead>
                <tbody className="divide-y divide-[#244A38]">
                  {scenarioResult.assumptions.basket.map(item => <tr key={item.productId}><td className="p-3 text-white">{item.name}</td><td>{item.quantity}</td><td>{money(item.unitPrice)}</td><td>{money(item.unitCost)}</td><td>{formatPercent(item.gstRate)}</td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="grid gap-2 text-xs sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Sales before promoter discount', scenarioResult.assumptions.merchandiseSubtotal],
                ['Promoter customer discount', scenarioResult.assumptions.totalDiscount],
                ['Sales after discount', scenarioResult.assumptions.totalMerchandiseSales],
                ['Revenue excluding GST', scenarioResult.result.revenueExcludingTax],
                ['Inventory product cost', scenarioResult.result.productCost],
                ['Fulfillment cost', scenarioResult.result.fulfillmentCost],
                ['RTO reserve', scenarioResult.result.rtoReserve],
                ['Online payment fee', scenarioResult.result.gatewayFee],
                ['Contribution before promoter', scenarioResult.result.contributionProfit],
                ['Promoter commission', scenarioResult.result.commission],
                ['Retained contribution', scenarioResult.result.retainedProfit],
                ['Average retained margin', formatPercent(scenarioResult.result.retainedMarginPercent)],
              ].map(([label, value]) => <div key={label} className="flex justify-between gap-2 rounded-lg border border-[#244A38] px-3 py-2"><span className="text-[#9BB0A5]">{label}</span><strong className="text-white">{typeof value === 'string' && value.includes('%') ? value : money(value)}</strong></div>)}
            </div>
            <p className="text-[10px] leading-5 text-[#9BB0A5]">Forecast only. The result uses the selected live catalog basket and inventory costs, current promoter/program rates, and the entered conversion or sales-target assumption. It does not guarantee purchases or delivery. Actual commissions use each real order’s locked items, tax, costs, and status, and are paid manually after delivery.</p>
          </div>
        )}
      </section>
    </div>
  );
}
