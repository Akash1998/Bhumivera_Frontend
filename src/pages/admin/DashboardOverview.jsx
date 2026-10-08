import { createElement, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import {
  Activity, AlertCircle, ArrowRight, BarChart3, Box, CalendarDays,
  Package, RefreshCw, Settings, ShoppingCart, Star, Tag, Users, Zap
} from 'lucide-react';
import { analytics } from '../../services/api';

const dateRanges = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: '1y', label: '1 year' }
];

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});
const count = new Intl.NumberFormat('en-IN');
const formatMoney = value => currency.format(Number(value) || 0);

const modules = [
  { title: 'Products', description: 'Catalogue, pricing, and stock', icon: Box, href: '/admin/dashboard/products', color: 'text-emerald-200 bg-emerald-400/10' },
  { title: 'Customers', description: 'Customer accounts and activity', icon: Users, href: '/admin/dashboard/users', color: 'text-sky-200 bg-sky-400/10' },
  { title: 'Orders', description: 'Review and fulfil orders', icon: ShoppingCart, href: '/admin/dashboard/orders', color: 'text-violet-200 bg-violet-400/10' },
  { title: 'Reviews', description: 'Moderate ratings and photos', icon: Star, href: '/admin/dashboard/reviews', color: 'text-amber-200 bg-amber-400/10' },
  { title: 'Promotions', description: 'Coupons and campaign offers', icon: Zap, href: '/admin/dashboard/coupons', color: 'text-rose-200 bg-rose-400/10' },
  { title: 'Settings', description: 'Store and platform settings', icon: Settings, href: '/admin/dashboard/settings', color: 'text-slate-200 bg-white/10' }
];

function DashboardTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/10 bg-[#071a14]/95 px-3 py-2.5 shadow-xl">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-emerald-300">{formatMoney(point.revenue)}</p>
      <p className="mt-1 text-xs text-slate-400">{count.format(Number(point.orders) || 0)} orders</p>
    </div>
  );
}

function Metric({ label, value, detail, icon: Icon, color }) {
  return (
    <article className="admin-glass-panel rounded-2xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400">{label}</p>
          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${color}`}>
          {createElement(Icon, { size: 20, 'aria-hidden': true })}
        </span>
      </div>
    </article>
  );
}

export default function DashboardOverview() {
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState({ metrics: {}, chartData: [], categoryData: [] });
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const loadDashboard = useCallback(async ({ quiet = false } = {}) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const response = await analytics.getDashboard(period);
      const payload = response.data || {};
      setDashboard({
        metrics: payload.metrics || {},
        chartData: (Array.isArray(payload.chartData) ? payload.chartData : []).map(item => ({
          name: item.name,
          revenue: Number(item.revenue) || 0,
          orders: Number(item.orders) || 0
        })),
        categoryData: (Array.isArray(payload.categoryData) ? payload.categoryData : []).map(item => ({
          name: item.name,
          revenue: Number(item.sales) || 0
        }))
      });
    } catch (loadError) {
      console.error('Failed to load dashboard data:', loadError);
      setError(loadError.response?.data?.message || 'Dashboard data could not be loaded. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics = dashboard.metrics || {};
  const hasChartData = dashboard.chartData.some(item => item.revenue > 0 || item.orders > 0);
  const chartPeak = Math.max(...dashboard.chartData.map(item => item.revenue), 1);
  const maxCategory = Math.max(...dashboard.categoryData.map(item => item.revenue), 1);

  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-5 pb-8 text-slate-200 sm:space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950/70 via-[#10241f]/80 to-[#071a14]/80 p-4 shadow-xl sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-300">
            <Activity size={16} aria-hidden="true" />
            Store performance
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{greeting}</h1>
          <p className="mt-1 text-sm text-slate-400">A clear snapshot of your store, orders, and revenue.</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => loadDashboard({ quiet: true })}
            disabled={loading || refreshing}
            className="admin-glass-control inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold hover:bg-white/10 disabled:opacity-60 sm:flex-none"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard/analytics')}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-bold text-emerald-950 transition hover:bg-emerald-300 sm:flex-none"
          >
            <BarChart3 size={16} aria-hidden="true" />
            View analytics
          </button>
        </div>
      </header>

      <section aria-label="Dashboard date range" className="admin-glass-panel flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <CalendarDays size={17} className="text-emerald-300" aria-hidden="true" />
          Dashboard period
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex" role="group" aria-label="Dashboard date range">
          {dateRanges.map(range => (
            <button
              key={range.id}
              type="button"
              aria-pressed={period === range.id}
              onClick={() => setPeriod(range.id)}
              className={`min-h-11 rounded-xl border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                period === range.id
                  ? 'border-emerald-300/50 bg-emerald-300/15 text-emerald-200'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {range.label}
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
          <button type="button" onClick={() => loadDashboard()} className="min-h-11 rounded-xl border border-rose-300/20 px-4 text-sm font-semibold text-rose-100 hover:bg-rose-300/10">
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="admin-glass-panel flex min-h-64 items-center justify-center rounded-2xl" role="status">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <RefreshCw size={18} className="animate-spin text-emerald-300" aria-hidden="true" />
            Loading your store data…
          </div>
        </div>
      ) : (
        <>
          <section aria-label="Store metrics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Revenue" value={formatMoney(metrics.revenue)} detail="Excludes cancelled orders" icon={Activity} color="text-emerald-200 bg-emerald-400/10" />
            <Metric label="Orders" value={count.format(Number(metrics.orders) || 0)} detail="In selected period" icon={ShoppingCart} color="text-sky-200 bg-sky-400/10" />
            <Metric label="New customers" value={count.format(Number(metrics.newCustomers) || 0)} detail="Joined in selected period" icon={Users} color="text-violet-200 bg-violet-400/10" />
            <Metric label="Pending orders" value={count.format(Number(metrics.pendingOrders) || 0)} detail="Awaiting processing" icon={Package} color="text-amber-200 bg-amber-400/10" />
          </section>

          <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
            <article className="admin-glass-panel min-w-0 rounded-2xl p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white sm:text-lg">Revenue trend</h2>
                  <p className="mt-1 text-xs text-slate-400">Order revenue by day, or by month for one year</p>
                </div>
                <span className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">INR · ₹</span>
              </div>
              <div className="h-64 min-w-0 sm:h-80" aria-label="Revenue chart">
                {hasChartData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboard.chartData} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dashboardRevenueFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34d399" stopOpacity={0.32} />
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
                      <YAxis
                        domain={[0, chartPeak]}
                        tickFormatter={value => {
                          if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
                          if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
                          if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
                          return `₹${value}`;
                        }}
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={58}
                      />
                      <Tooltip content={<DashboardTooltip />} cursor={{ stroke: 'rgba(52,211,153,0.35)' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={3} fill="url(#dashboardRevenueFill)" activeDot={{ r: 5, fill: '#a7f3d0', stroke: '#064e3b', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="grid h-full place-items-center rounded-xl border border-dashed border-white/10 text-center">
                    <div>
                      <BarChart3 className="mx-auto text-slate-500" size={28} aria-hidden="true" />
                      <p className="mt-2 text-sm font-semibold text-slate-300">No orders in this period</p>
                      <p className="mt-1 text-xs text-slate-500">Your revenue trend will appear here.</p>
                    </div>
                  </div>
                )}
              </div>
            </article>

            <article className="admin-glass-panel rounded-2xl p-4 sm:p-5">
              <div className="mb-5">
                <h2 className="text-base font-bold text-white sm:text-lg">Revenue by category</h2>
                <p className="mt-1 text-xs text-slate-400">Best-performing categories</p>
              </div>
              {dashboard.categoryData.length ? (
                <div className="space-y-5">
                  {dashboard.categoryData.map((category, index) => (
                    <div key={`${category.name}-${index}`}>
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <span className="min-w-0 break-words text-sm font-medium text-slate-200">{category.name}</span>
                        <span className="shrink-0 text-sm font-semibold text-emerald-200">{formatMoney(category.revenue)}</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-300" style={{ width: `${Math.max(category.revenue / maxCategory * 100, 2)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid min-h-48 place-items-center text-center text-sm text-slate-500">
                  Category performance will appear here once orders are placed.
                </div>
              )}
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard/analytics')}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06]"
              >
                Detailed analytics <ArrowRight size={16} aria-hidden="true" />
              </button>
            </article>
          </section>
        </>
      )}

      <section className="admin-glass-panel rounded-2xl p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Tag size={17} className="text-emerald-300" aria-hidden="true" />
          <div>
            <h2 className="text-base font-bold text-white">Quick access</h2>
            <p className="mt-1 text-xs text-slate-400">Go directly to common admin tasks.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map(module => (
            <button
              key={module.title}
              type="button"
              onClick={() => navigate(module.href)}
              className="group flex min-h-[76px] items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-left transition hover:border-emerald-300/25 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${module.color}`}>
                <module.icon size={19} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-100">{module.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-400">{module.description}</span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-emerald-200" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
