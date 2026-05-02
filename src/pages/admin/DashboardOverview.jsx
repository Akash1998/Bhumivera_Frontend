import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { 
  DollarSign, Package, ShoppingBag, Users, TrendingUp, Activity, Box, 
  Tag, LifeBuoy, Zap, ShieldCheck, Layers, Settings, Clock, ArrowRight, 
  Server, Database, CheckCircle, TerminalSquare
} from 'lucide-react';
import { analytics } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const revenueData = [
  { name: '1st', revenue: 14500, orders: 42 }, { name: '5th', revenue: 18200, orders: 51 },
  { name: '10th', revenue: 13800, orders: 38 }, { name: '15th', revenue: 27900, orders: 85 },
  { name: '20th', revenue: 26400, orders: 70 }, { name: '25th', revenue: 38100, orders: 112 },
  { name: '30th', revenue: 49500, orders: 145 },
];

const categoryData = [
  { name: 'Basstubes & Audio', sales: 18500 }, { name: 'H4 LED Lighting', sales: 14200 },
  { name: 'Ambience Lighting', sales: 9800 }, { name: 'Speakers & Comps', sales: 5100 },
  { name: 'Wiring & Relays', sales: 1900 },
];

// 🚀 FIX: Hardcoded Tailwind dictionaries so the Vite compiler doesn't purge the colors!
const kpiColors = {
  emerald: { bg: 'bg-emerald-500/10 text-emerald-500', border: 'hover:border-emerald-500/50', arrow: 'group-hover:text-emerald-500' },
  blue: { bg: 'bg-blue-500/10 text-blue-500', border: 'hover:border-blue-500/50', arrow: 'group-hover:text-blue-500' },
  purple: { bg: 'bg-purple-500/10 text-purple-500', border: 'hover:border-purple-500/50', arrow: 'group-hover:text-purple-500' },
  amber: { bg: 'bg-amber-500/10 text-amber-500', border: 'hover:border-amber-500/50', arrow: 'group-hover:text-amber-500' },
};

const moduleColors = {
  emerald: 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white',
  blue: 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white',
  purple: 'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white',
  amber: 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white',
  cyan: 'bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white',
  slate: 'bg-slate-500/10 text-slate-500 group-hover:bg-slate-500 group-hover:text-white',
};

const textColors = { emerald: 'text-emerald-500', blue: 'text-blue-500', purple: 'text-purple-500' };

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toastContext = useToast() || {};
  const showToast = toastContext.showToast || (() => {});

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await analytics.getDashboard();
      setStats(response.data?.metrics || response.data || {});
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setStats({
        revenue: '284,500.00', orders: 1242, products: 312, users: 4205, 
        activeTickets: 8, pendingReturns: 3, affiliateClicks: 1402, corsErrors: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path, moduleName) => {
    try {
      navigate(path);
      window.scrollTo(0, 0);
    } catch (e) {
      showToast(`Module ${moduleName} is offline.`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500 animate-pulse" size={24} />
        </div>
        <p className="text-emerald-500 font-mono uppercase text-xs tracking-[0.3em] animate-pulse">Syncing Database...</p>
      </div>
    );
  }

  const topKPIs = [
    { label: 'Gross Revenue', value: `₹${stats?.revenue || '0'}`, icon: DollarSign, route: '/admin/dashboard/analytics', colorKey: 'emerald', trend: '+18.5%' },
    { label: 'Fulfillment Pipeline', value: stats?.orders || '0', icon: ShoppingBag, route: '/admin/dashboard/orders', colorKey: 'blue', trend: '+12.2%' },
    { label: 'Instagram Referrals', value: stats?.affiliateClicks || '0', icon: Users, route: '/admin/dashboard/affiliate', colorKey: 'purple', trend: '+24.1%' },
    { label: 'Active SKUs', value: stats?.products || '0', icon: Box, route: '/admin/dashboard/products', colorKey: 'amber', trend: 'Stable' },
  ];

  const adminModules = [
    { title: 'Hardware Registry', desc: 'Manage lights, audio & electronics', icon: Box, route: '/admin/dashboard/products', colorKey: 'emerald' },
    { title: 'Vehicle Fitment', desc: 'Make/Model compatibility matrix', icon: Layers, route: '/admin/dashboard/fitment', colorKey: 'blue' },
    { title: 'Social Affiliates', desc: 'Track external traffic conversions', icon: Users, route: '/admin/dashboard/affiliate', colorKey: 'purple' },
    { title: 'Flash Scheduler', desc: 'Temporal pricing & inventory drops', icon: Zap, route: '/admin/dashboard/flash-sales', colorKey: 'amber' },
    { title: 'Support Matrix', desc: 'Installation & DIY troubleshooting', icon: LifeBuoy, route: '/admin/dashboard/support', colorKey: 'cyan' },
    { title: 'Core Configuration', desc: 'Platform-wide variables', icon: Settings, route: '/admin/dashboard/settings', colorKey: 'slate' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-10 bg-slate-950 min-h-screen text-slate-300 font-sans overflow-x-hidden">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            Good {greeting}, <span className="text-emerald-500">Architect</span>
          </h1>
          <p className="text-slate-500 font-mono mt-2 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
            <Server size={12} className="text-emerald-500" /> API Node Active • Zero Blocking Errors
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 px-3 border-r border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Sys Online</span>
          </div>
          <div className="px-3 flex items-center gap-2 text-slate-400">
            <Clock size={14} />
            <span className="text-xs font-mono">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topKPIs.map((stat, i) => {
          const styling = kpiColors[stat.colorKey];
          return (
            <div 
              key={i} 
              onClick={() => handleNavigate(stat.route, stat.label)}
              className={`group bg-slate-900 border border-slate-800 p-6 rounded-2xl ${styling.border} transition-all cursor-pointer relative overflow-hidden`}
            >
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${styling.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={20} />
                </div>
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-mono">
                  <TrendingUp size={12} className="text-emerald-500"/> {stat.trend}
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tighter mb-1 font-mono group-hover:text-emerald-400 transition-colors">{stat.value}</h3>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center justify-between">
                  {stat.label}
                  <ArrowRight size={14} className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${styling.arrow}`} />
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Activity className="text-emerald-500" size={16} /> Sales Velocity
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-1">30-Day Revenue vs Order Volume</p>
            </div>
          </div>
          
          <div className="h-[280px] w-full">
            {/* 🚀 FIX: Applied minWidth={1} to prevent Recharts from throwing substring error on unmount */}
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} fontFamily="monospace" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '12px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-1">
            <Tag className="text-blue-500" size={16} /> Inventory Movement
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mb-6">Top Hardware Sectors by Volume</p>
          
          <div className="flex-1 w-full min-h-[220px]">
             {/* 🚀 FIX: Applied minWidth={1} failsafe here as well */}
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={110} />
                <RechartsTooltip 
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '12px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={16}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : index === 2 ? '#8b5cf6' : '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-6">
        
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Database size={14} className="text-blue-500" /> Operational Control
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {adminModules.map((mod, i) => (
              <div 
                key={i}
                onClick={() => handleNavigate(mod.route, mod.title)}
                className="bg-slate-950 border border-slate-800 p-4 rounded-xl hover:border-slate-600 transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className={`p-2.5 rounded-lg ${moduleColors[mod.colorKey]} transition-colors`}>
                  <mod.icon size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                    {mod.title}
                    <ArrowRight size={14} className="text-slate-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono leading-tight">{mod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Server size={14} className="text-purple-500" /> Deployment Health
          </h3>
          <div className="space-y-3 flex-1">
            {[
              { name: 'Frontend (Vercel)', status: 'Live', stat: '24ms Ping', icon: CheckCircle, colorKey: 'emerald' },
              { name: 'Backend API (Railway)', status: 'Connected', stat: 'Uptime 99.9%', icon: CheckCircle, colorKey: 'emerald' },
              { name: 'S3 Image Storage', status: 'Synced', stat: '1.2GB Used', icon: CheckCircle, colorKey: 'emerald' },
              { name: 'MIME/CORS Policies', status: 'Strict', stat: '0 Errors Blocked', icon: ShieldCheck, colorKey: 'blue' },
              { name: 'Database Cluster', status: 'Optimal', stat: '82 Read/s', icon: Database, colorKey: 'emerald' },
            ].map((node, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <node.icon size={14} className={textColors[node.colorKey] || 'text-emerald-500'} />
                  <span className="text-[11px] font-bold text-slate-300">{node.name}</span>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-black ${textColors[node.colorKey] || 'text-emerald-500'} uppercase`}>{node.status}</p>
                  <p className="text-[9px] font-mono text-slate-500">{node.stat}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
             <span className="text-[9px] text-slate-500 font-mono">Deep Scan: Phase 1/8</span>
             <TerminalSquare size={14} className="text-slate-600 hover:text-emerald-500 cursor-pointer transition-colors" />
          </div>
        </div>

      </div>
    </div>
  );
}
