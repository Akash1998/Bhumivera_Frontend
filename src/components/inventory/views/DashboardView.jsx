import React from 'react';
import {
  Boxes,
  Truck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  TrendingUp,
  CreditCard,
  Barcode,
  ArrowUpRight,
  ShieldCheck,
  PackageCheck,
  Clock,
} from 'lucide-react';

export default function DashboardView({
  dashMetrics,
  velocityData,
  setActiveView,
  onOpenWavePicklist,
}) {
  const pendingOrders = dashMetrics?.pendingDispatch || 0;
  const packedOrders = dashMetrics?.packedCount || 0;
  const lowStockCount = dashMetrics?.lowStockCount || 0;
  const posRevToday = dashMetrics?.posRevToday || 0;
  const onlineRevToday = dashMetrics?.onlineRevToday || 0;
  const totalRevToday = posRevToday + onlineRevToday;

  const criticalForecasts = velocityData?.forecasts?.filter(f => f.status === 'REORDER_CRITICAL' || f.status === 'OUT_OF_STOCK') || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Welcome & Health Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High-Velocity WMS Core Active
              </span>
              <span className="text-xs text-slate-400">Hub: Flagship Maison — Asansol</span>
            </div>
            <h2 className="text-2xl font-black mt-2 tracking-tight">
              Warehouse Operations & Dispatch Command
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              FEFO batch allocation, wave picking walk-paths, and zero-roundtrip POS synchronization.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveView('online')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/30"
            >
              <Truck className="w-4 h-4" /> Fulfill Orders ({pendingOrders})
            </button>
            <button
              onClick={() => setActiveView('sale')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/30"
            >
              <CreditCard className="w-4 h-4" /> Retail POS Terminal
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Dispatches */}
        <div
          onClick={() => setActiveView('online')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Fulfillment</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{pendingOrders}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            {packedOrders} packed ready for carrier handover
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => setActiveView('inv')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{lowStockCount}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            Requires supplier reorder replenishment
          </div>
        </div>

        {/* POS Revenue Today */}
        <div
          onClick={() => setActiveView('rep')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">POS Sales Today</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{posRevToday.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Offline retail walk-in counter revenue
          </div>
        </div>

        {/* Total Omnichannel Today */}
        <div
          onClick={() => setActiveView('rep')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-400 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Omnichannel Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{totalRevToday.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">
            Combined Online Store + Offline POS
          </div>
        </div>
      </div>

      {/* AI Velocity & Days-of-Cover (DOC) Reorder Forecaster */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                AI Inventory Velocity & Days-of-Cover (DOC)
              </h3>
              <p className="text-xs text-slate-500">
                Predictive run-rate analysis based on 30-day order velocity and supplier lead times
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('inv')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View Full Stock Velocity <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {criticalForecasts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {criticalForecasts.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{item.sku}</span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-100 text-rose-700">
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-rose-100">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Physical Stock</span>
                    <span className="font-bold text-slate-800">{item.currentStock} units</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Daily Velocity</span>
                    <span className="font-bold text-slate-800">{item.dailyRunRate}/day</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Days of Cover</span>
                    <span className="font-bold text-rose-600 font-mono">{item.daysOfCover}d left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-800">
            <PackageCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              All product lines maintain healthy stock velocity buffers (&gt;30 days cover). No emergency supplier stockouts imminent.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
