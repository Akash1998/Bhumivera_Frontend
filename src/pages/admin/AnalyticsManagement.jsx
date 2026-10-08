import { createElement, useCallback, useEffect, useState } from 'react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import {
  Activity, AlertCircle, BarChart3,
  CalendarDays, Download, IndianRupee, Package, RefreshCw, ShoppingCart, Users
} from 'lucide-react';
import { analytics } from '../../services/api';

const periods = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: '1y', label: '1 year' }
];

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const number = new Intl.NumberFormat('en-IN');
const formatMoney = value => money.format(Number(value) || 0);
const formatAxisMoney = value => {
  const amount = Number(value) || 0;
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}k`;
  return `₹${amount}`;
};

function MetricCard({ title, value, caption, icon: Icon, tone }) {
  const tones = {
    emerald: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    blue: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
    violet: 'border-violet-400/20 bg-violet-400/10 text-violet-300',
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-300'
  };

  return (
    <article className="admin-glass-panel min-w-0 rounded-2xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400">{title}</p>
          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{caption}</p>
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${tones[tone]}`}>
          {createElement(Icon, { size: 20, 'aria-hidden': true })}
        </span>
      </div>
    </article>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/10 bg-[#071a14]/95 px-3 py-2.5 shadow-xl">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-emerald-300">{formatMoney(point.value)}</p>
      <p className="mt-1 text-xs text-slate-400">{number.format(Number(point.orders) || 0)} orders</p>
    </div>
  );
}

export default function AnalyticsManagement() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState('30d');
  const [error, setError] = useState('');
  const [data, setData] = useState({ metrics: {}, revenue: [], categories: [], products: [] });

  const fetchAnalytics = useCallback(async ({ quiet = false } = {}) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const [dashboardResult, productResult] = await Promise.all([
        analytics.getDashboard(timeframe),
        analytics.getProducts(timeframe)
      ]);
      const dashboard = dashboardResult.data || {};
      const productsPayload = productResult.data?.data;

      setData({
        metrics: dashboard.metrics || {},
        revenue: (Array.isArray(dashboard.chartData) ? dashboard.chartData : []).map(item => ({
          label: item.name,
          value: Number(item.revenue) || 0,
          orders: Number(item.orders) || 0
        })),
        categories: (Array.isArray(dashboard.categoryData) ? dashboard.categoryData : []).map(item => ({
          name: item.name,
          amount: Number(item.sales) || 0
        })),
        products: (Array.isArray(productsPayload) ? productsPayload : []).map(item => ({
          id: item.id,
          name: item.name,
          category: item.category_name || 'Uncategorised',
          units: Number(item.total_sold) || 0,
          revenue: Number(item.revenue) || 0
        }))
      });
    } catch (fetchError) {
      console.error('Failed to load analytics:', fetchError);
      setError(fetchError.response?.data?.message || 'Analytics could not be loaded. Check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const exportReport = () => {
    const rows = [
      ['Section', 'Name', 'Orders / Units', 'Revenue (INR)'],
      ...data.revenue.map(item => ['Daily revenue', item.label, item.orders, item.value]),
      ...data.products.map(item => ['Product', item.name, item.units, item.revenue])
    ];
    const csv = rows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `bhumivera-analytics-${timeframe}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const metrics = data.metrics || {};
  const totalOrders = Number(metrics.orders) || 0;
  const averageOrder = Number(metrics.avgOrderValue) || 0;
  const hasChartData = data.revenue.some(item => item.value > 0 || item.orders > 0);

  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-5 pb-8 text-slate-200 sm:space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950/70 via-[#10241f]/80 to-[#071a14]/80 p-4 shadow-xl sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
            <BarChart3 size={16} aria-hidden="true" />
            Business overview
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Analytics</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
            Revenue, orders, and product performance in Indian Rupees.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <button
            type="button"
            onClick={() => fetchAnalytics({ quiet: true })}
            disabled={refreshing || loading}
            className="admin-glass-control inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            onClick={exportReport}
            disabled={loading || (!data.revenue.length && !data.products.length)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-bold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} aria-hidden="true" />
            Export CSV
          </button>
        </div>
      </header>

      <section aria-label="Select reporting period" className="admin-glass-panel flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <CalendarDays size={17} className="text-emerald-300" aria-hidden="true" />
          Reporting period
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex" role="group" aria-label="Reporting period">
          {periods.map(period => (
            <button
              key={period.id}
              type="button"
              aria-pressed={timeframe === period.id}
              onClick={() => setTimeframe(period.id)}
              className={`min-h-11 rounded-xl border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                timeframe === period.id
                  ? 'border-emerald-300/50 bg-emerald-300/15 text-emerald-200'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-rose-400/20 bg-rose-950/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-sm text-rose-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => fetchAnalytics()} className="min-h-11 rounded-xl border border-rose-300/20 px-4 text-sm font-semibold text-rose-100 hover:bg-rose-300/10">
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="admin-glass-panel flex min-h-64 items-center justify-center rounded-2xl" role="status">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <RefreshCw size={18} className="animate-spin text-emerald-300" aria-hidden="true" />
            Loading your business data…
          </div>
        </div>
      ) : (
        <>
          <section aria-label="Key business metrics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Revenue" value={formatMoney(metrics.revenue)} caption="Excludes cancelled orders" icon={IndianRupee} tone="emerald" />
            <MetricCard title="Orders" value={number.format(totalOrders)} caption="Non-cancelled orders" icon={ShoppingCart} tone="blue" />
            <MetricCard title="Average order value" value={formatMoney(averageOrder)} caption="Revenue divided by orders" icon={Activity} tone="violet" />
            <MetricCard title="New customers" value={number.format(Number(metrics.newCustomers) || 0)} caption="Joined in this period" icon={Users} tone="amber" />
          </section>

          <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
            <article className="admin-glass-panel min-w-0 rounded-2xl p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white sm:text-lg">Revenue over time</h2>
                  <p className="mt-1 text-xs text-slate-400">Daily totals, or monthly totals for the one-year view</p>
                </div>
                <span className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                  INR · ₹
                </span>
              </div>
              <div className="h-64 min-w-0 sm:h-80" aria-label="Revenue chart">
                {hasChartData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.revenue} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34d399" stopOpacity={0.32} />
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                      <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
                      <YAxis tickFormatter={formatAxisMoney} tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} width={58} />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(52,211,153,0.35)' }} />
                      <Area type="monotone" dataKey="value" stroke="#34d399" strokeWidth={3} fill="url(#revenueFill)" activeDot={{ r: 5, fill: '#a7f3d0', stroke: '#064e3b', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="grid h-full place-items-center rounded-xl border border-dashed border-white/10 text-center">
                    <div>
                      <BarChart3 className="mx-auto text-slate-500" size={28} aria-hidden="true" />
                      <p className="mt-2 text-sm font-semibold text-slate-300">No orders in this period</p>
                      <p className="mt-1 text-xs text-slate-500">Revenue data will appear here when orders are placed.</p>
                    </div>
                  </div>
                )}
              </div>
            </article>

            <article className="admin-glass-panel rounded-2xl p-4 sm:p-5">
              <div className="mb-5">
                <h2 className="text-base font-bold text-white sm:text-lg">Revenue by category</h2>
                <p className="mt-1 text-xs text-slate-400">Top categories for this period</p>
              </div>
              {data.categories.length ? (
                <div className="space-y-5">
                  {data.categories.map((category, index) => {
                    const peak = Math.max(...data.categories.map(item => item.amount), 1);
                    return (
                      <div key={`${category.name}-${index}`}>
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <span className="min-w-0 break-words text-sm font-medium text-slate-200">{category.name}</span>
                          <span className="shrink-0 text-sm font-semibold text-emerald-200">{formatMoney(category.amount)}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                          <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-300" style={{ width: `${Math.max(category.amount / peak * 100, 2)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid min-h-48 place-items-center text-center text-sm text-slate-500">Category sales will appear here.</div>
              )}
            </article>
          </section>

          <section className="admin-glass-panel overflow-hidden rounded-2xl">
            <div className="flex flex-col gap-1 border-b border-white/10 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
              <div>
                <h2 className="text-base font-bold text-white sm:text-lg">Top products</h2>
                <p className="mt-1 text-xs text-slate-400">Sorted by units sold in the selected period</p>
              </div>
              <span className="text-xs text-slate-500">{data.products.length} products</span>
            </div>
            {data.products.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold sm:px-5">Product</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Category</th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold">Units sold</th>
                      <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-5">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {data.products.map(product => (
                      <tr key={product.id} className="hover:bg-white/[0.03]">
                        <td className="max-w-[360px] px-4 py-3.5 font-medium text-slate-100 sm:px-5">{product.name}</td>
                        <td className="px-4 py-3.5 text-slate-400">{product.category}</td>
                        <td className="px-4 py-3.5 text-right tabular-nums text-slate-300">{number.format(product.units)}</td>
                        <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-emerald-200 sm:px-5">{formatMoney(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid min-h-40 place-items-center px-4 text-center text-sm text-slate-500">
                <div><Package className="mx-auto mb-2" size={24} aria-hidden="true" />No product sales found for this period.</div>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
