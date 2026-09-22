import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, ShoppingBag, Users, TrendingUp, Box, Tag, 
  LifeBuoy, Zap, Layers, Settings, ArrowRight, Server, Database, Activity 
} from 'lucide-react';
import { analytics } from '../../services/api';

const kpiColors = {
  emerald: { bg: 'bg-emerald-500/10 text-emerald-500', border: 'hover:border-emerald-500/50', arrow: 'group-hover:text-emerald-500' },
  blue: { bg: 'bg-blue-500/10 text-blue-500', border: 'hover:border-blue-500/50', arrow: 'group-hover:text-blue-500' },
  purple: { bg: 'bg-purple-500/10 text-purple-500', border: 'hover:border-purple-500/50', arrow: 'group-hover:text-purple-500' },
  amber: { bg: 'bg-amber-500/10 text-amber-500', border: 'hover:border-amber-500/50', arrow: 'group-hover:text-amber-500' }
};

const moduleColors = {
  emerald: 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white',
  blue: 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white',
  purple: 'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white',
  amber: 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white',
  cyan: 'bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white',
  slate: 'bg-slate-500/10 text-slate-500 group-hover:bg-slate-500 group-hover:text-white'
};

const categoryTailwindColors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-slate-500'];

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState({
    metrics: null,
    chartData: [],
    categoryData: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';

  useEffect(() => {
    let m = true;
    const f = async () => {
      try {
        setLoading(true);
        const r = await analytics.getDashboard();
        if (m) {
          const payload = r.data || {};
          setDashboardData({
            metrics: payload.metrics || {},
            chartData: payload.chartData || [],
            categoryData: payload.categoryData || []
          });
        }
      } catch (e) {
        console.error("Failed to sync actual dashboard data:", e);
        // Removed fake data fallback constraint met
      } finally {
        if (m) setLoading(false);
      }
    };
    f();
    return () => m = false;
  }, []);

  const nav = (p) => { navigate(p); window.scrollTo(0, 0); };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 bg-slate-950">
      <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-emerald-500 font-mono uppercase text-xs tracking-[0.3em] animate-pulse">Syncing Telemetry...</p>
    </div>
  );

  const stats = dashboardData.metrics || {};

  const topKPIs = [
    { label: 'Gross Revenue', value: `₹${Number(stats.revenue || 0).toLocaleString()}`, icon: DollarSign, route: '/admin/dashboard/analytics', colorKey: 'emerald', trend: 'Active' },
    { label: 'Fulfillment Pipeline', value: stats.orders || '0', icon: ShoppingBag, route: '/admin/dashboard/orders', colorKey: 'blue', trend: 'Active' },
    { label: 'New Customer Intake', value: stats.newCustomers || '0', icon: Users, route: '/admin/dashboard/users', colorKey: 'purple', trend: 'Active' },
    { label: 'Active SKUs', value: stats.totalProducts || '0', icon: Box, route: '/admin/dashboard/products', colorKey: 'amber', trend: 'Stable' }
  ];

  const adminModules = [
    { title: 'Hardware Registry', desc: 'Manage assets & products', icon: Box, route: '/admin/dashboard/products', colorKey: 'emerald' },
    { title: 'Customer Base', desc: 'Identity & Access', icon: Users, route: '/admin/dashboard/users', colorKey: 'blue' },
    { title: 'Order Operations', desc: 'Fulfillment processing', icon: ShoppingBag, route: '/admin/dashboard/orders', colorKey: 'purple' },
    { title: 'Flash Scheduler', desc: 'Temporal pricing', icon: Zap, route: '/admin/dashboard/flash-sales', colorKey: 'amber' },
    { title: 'Review Matrix', desc: 'Reputation management', icon: LifeBuoy, route: '/admin/dashboard/reviews', colorKey: 'cyan' },
    { title: 'Core Configuration', desc: 'Platform settings', icon: Settings, route: '/admin/dashboard/settings', colorKey: 'slate' }
  ];

  // Mathematical safety against Division by Zero for CSS layout constraints
  const maxR = Math.max(...(dashboardData.chartData.length ? dashboardData.chartData.map(d => Number(d.revenue)) : [1]), 1);
  const maxC = Math.max(...(dashboardData.categoryData.length ? dashboardData.categoryData.map(d => Number(d.sales)) : [1]), 1);

  return (
    <div className="p-4 md:p-8 space-y-10 bg-slate-950 min-h-screen text-slate-300 font-sans overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            Good {greeting}, <span className="text-emerald-500">Architect</span>
          </h1>
          <p className="text-slate-500 font-mono mt-2 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
            <Server size={12} className="text-emerald-500"/> Core Telemetry Online
          </p>
        </div>
      </div>

      {/* KPI Cards (Glassmorphism) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topKPIs.map((s, i) => {
          const c = kpiColors[s.colorKey];
          return (
            <div key={i} onClick={() => nav(s.route)} className={`group bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl ${c.border} shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden`}>
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${c.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon size={20}/>
                </div>
                <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-mono shadow-inner">
                  <TrendingUp size={12} className="text-emerald-500"/> {s.trend}
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tighter mb-1 font-mono group-hover:text-emerald-400 transition-colors">{s.value}</h3>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center justify-between">
                  {s.label}
                  <ArrowRight size={14} className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${c.arrow}`}/>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Real Revenue Velocity Chart */}
        <div className="xl:col-span-2 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-xl overflow-hidden flex flex-col">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Activity className="text-emerald-500" size={16}/> Sales Velocity (30 Days)
          </h3>
          <div className="flex-1 flex items-end gap-2 h-64 relative mt-8">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[100, 75, 50, 25, 0].map(v => (
                <div key={v} className="w-full border-t border-slate-800/50 flex items-center">
                  <span className="text-[9px] font-mono text-slate-600 -mt-2 ml-1">
                    {v === 0 ? '0' : `₹${((maxR * (v / 100)) / 1000).toFixed(1)}k`}
                  </span>
                </div>
              ))}
            </div>
            {dashboardData.chartData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-xs uppercase tracking-widest">
                No telemetry available for timeframe
              </div>
            )}
            {dashboardData.chartData.map((d, i) => {
              const height = `${(Number(d.revenue) / maxR) * 100}%`;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10 group">
                  <div 
                    className="w-full max-w-[40px] bg-emerald-500/20 hover:bg-emerald-500/80 border-t-2 border-emerald-500 transition-all duration-500 rounded-t-sm relative shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
                    style={{ height }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur border border-emerald-500/30 text-white text-[10px] font-mono py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      ₹{Number(d.revenue).toLocaleString()} <br/>
                      <span className="text-emerald-400 text-[8px]">{d.orders} orders</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-2 truncate w-full text-center px-1">{d.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real Inventory Movement */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-1">
            <Tag className="text-blue-500" size={16}/> Top Moving Categories
          </h3>
          <div className="flex-1 w-full space-y-5 justify-center flex flex-col mt-6">
            {dashboardData.categoryData.length === 0 && (
               <div className="text-center text-slate-500 font-mono text-xs uppercase tracking-widest">
                 Awaiting Order Flow
               </div>
            )}
            {dashboardData.categoryData.map((d, i) => {
              const width = `${(Number(d.sales) / maxC) * 100}%`;
              const barColor = categoryTailwindColors[i % categoryTailwindColors.length];
              return (
                <div key={i} className="w-full">
                  <div className="flex justify-between text-[10px] mb-1.5 font-bold">
                    <span className="text-slate-300 uppercase tracking-wider truncate mr-2">{d.name}</span>
                    <span className="text-slate-500 font-mono">₹{Number(d.sales).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-950/80 shadow-inner h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className={`h-full ${barColor} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{ width }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operational Control */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-6">
        <div className="xl:col-span-3 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Database size={14} className="text-blue-500"/> Operational Modules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminModules.map((m, i) => (
              <div key={i} onClick={() => nav(m.route)} className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-xl hover:border-slate-600 hover:bg-slate-800/30 transition-all duration-300 cursor-pointer group flex items-start gap-4">
                <div className={`p-2.5 rounded-lg transition-colors duration-300 ${moduleColors[m.colorKey]}`}>
                  <m.icon size={18}/>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                    {m.title}
                    <ArrowRight size={14} className="text-slate-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"/>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono leading-tight">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
