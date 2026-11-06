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
  Warehouse,
  FileCheck2,
  ScanLine,
  FileSpreadsheet,
  Settings,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardView({
  dashMetrics,
  velocityData,
  setActiveView,
  onOpenWavePicklist,
}) {
  const pendingOrders = Number(dashMetrics?.pendingDispatch || 0);
  const packedOrders = Number(dashMetrics?.packedCount || 0);
  const lowStockCount = Number(dashMetrics?.lowStockCount || 0);
  const posRevToday = Number(dashMetrics?.posRevToday || 0);
  const onlineRevToday = Number(dashMetrics?.onlineRevToday || 0);
  const totalRevToday = posRevToday + onlineRevToday;

  const criticalForecasts =
    velocityData?.forecasts?.filter(
      f => f.status === 'REORDER_CRITICAL' || f.status === 'OUT_OF_STOCK'
    ) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Top Welcome & Health Banner */}
      <div className="bg-gradient-to-r from-[#0c261b] via-[#103323] to-[#071a12] rounded-2xl p-6 text-white border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-300" /> High-Velocity WMS Core Active
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Hub: Bhumivera Flagship Maison — Asansol
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Strict FIFO / FEFO Allocation
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black mt-2 tracking-tight text-white">
              Warehouse Operations &amp; Dispatch Command
            </h2>
            <p className="text-xs text-slate-200 mt-1 max-w-2xl font-medium">
              Autonomous FEFO batch allocation, consolidated wave picklists, and zero-roundtrip retail POS synchronization.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => setActiveView('online')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-emerald-950/60"
            >
              <Truck className="w-4 h-4" /> Fulfill Orders ({pendingOrders})
            </button>
            <button
              onClick={() => setActiveView('sale')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#103323] hover:bg-[#16442f] text-emerald-300 border border-emerald-500/40 text-xs font-black rounded-xl transition shadow-lg"
            >
              <CreditCard className="w-4 h-4" /> Launch Retail POS Terminal
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Interactive KPI Cards (All Clickable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Dispatches */}
        <div
          onClick={() => setActiveView('online')}
          role="button"
          tabIndex={0}
          className="bg-[#0c261b] p-5 rounded-2xl border border-emerald-500/30 shadow-lg hover:border-emerald-400 hover:scale-[1.01] hover:shadow-emerald-950/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300">Pending Fulfillment</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white group-hover:text-emerald-300 transition">{pendingOrders}</div>
          <div className="text-[11px] text-amber-300 font-bold mt-1.5 flex items-center gap-1">
            <span>{packedOrders} packed ready for carrier handover</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-300 ml-auto" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => setActiveView('inv')}
          role="button"
          tabIndex={0}
          className="bg-[#0c261b] p-5 rounded-2xl border border-emerald-500/30 shadow-lg hover:border-rose-400 hover:scale-[1.01] hover:shadow-rose-950/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-rose-300">Low Stock SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white group-hover:text-rose-300 transition">{lowStockCount}</div>
          <div className="text-[11px] text-rose-300 font-bold mt-1.5 flex items-center gap-1">
            <span>{lowStockCount > 0 ? 'Requires supplier reorder replenishment' : 'All product stocks healthy'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-300 ml-auto" />
          </div>
        </div>

        {/* POS Revenue Today */}
        <div
          onClick={() => setActiveView('rep')}
          role="button"
          tabIndex={0}
          className="bg-[#0c261b] p-5 rounded-2xl border border-emerald-500/30 shadow-lg hover:border-emerald-400 hover:scale-[1.01] hover:shadow-emerald-950/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300">POS Sales Today</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white group-hover:text-emerald-300 transition">
            ₹{posRevToday.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-300 font-bold mt-1.5 flex items-center gap-1">
            <span>Offline retail walk-in counter revenue</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300 ml-auto" />
          </div>
        </div>

        {/* Total Omnichannel Today */}
        <div
          onClick={() => setActiveView('rep')}
          role="button"
          tabIndex={0}
          className="bg-[#0c261b] p-5 rounded-2xl border border-emerald-500/30 shadow-lg hover:border-teal-400 hover:scale-[1.01] hover:shadow-teal-950/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-300 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal-300">Omnichannel Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white group-hover:text-teal-300 transition">
            ₹{totalRevToday.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-teal-300 font-bold mt-1.5 flex items-center gap-1">
            <span>Combined Online Store + Offline POS</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-teal-300 ml-auto" />
          </div>
        </div>
      </div>

      {/* Quick Operation Command Hub */}
      <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> One-Click Warehouse Operation Hub
          </h3>
          <span className="text-[11px] text-slate-300 font-medium">99% Automated Dispatch Engine</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveView('online')}
            className="p-3 rounded-xl bg-[#071711] border border-emerald-500/30 hover:border-emerald-400 text-left hover:bg-[#0e2c1f] transition group"
          >
            <Truck className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition" />
            <div className="font-bold text-white text-xs">Fulfillment</div>
            <div className="text-[10px] text-slate-300">{pendingOrders} pending dispatch</div>
          </button>

          <button
            onClick={() => setActiveView('sale')}
            className="p-3 rounded-xl bg-[#071711] border border-emerald-500/30 hover:border-emerald-400 text-left hover:bg-[#0e2c1f] transition group"
          >
            <CreditCard className="w-5 h-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition" />
            <div className="font-bold text-white text-xs">POS Terminal</div>
            <div className="text-[10px] text-slate-300">GST billing + UPI QR</div>
          </button>

          <button
            onClick={() => setActiveView('inv')}
            className="p-3 rounded-xl bg-[#071711] border border-emerald-500/30 hover:border-emerald-400 text-left hover:bg-[#0e2c1f] transition group"
          >
            <Boxes className="w-5 h-5 text-teal-400 mb-1.5 group-hover:scale-110 transition" />
            <div className="font-bold text-white text-xs">Catalog Stock</div>
            <div className="text-[10px] text-slate-300">Live website sync</div>
          </button>

          <button
            onClick={() => setActiveView('keeper')}
            className="p-3 rounded-xl bg-[#071711] border border-emerald-500/30 hover:border-emerald-400 text-left hover:bg-[#0e2c1f] transition group"
          >
            <Warehouse className="w-5 h-5 text-indigo-400 mb-1.5 group-hover:scale-110 transition" />
            <div className="font-bold text-white text-xs">Bins &amp; Zones</div>
            <div className="text-[10px] text-slate-300">Physical stock map</div>
          </button>

          <button
            onClick={() => setActiveView('grn')}
            className="p-3 rounded-xl bg-[#071711] border border-emerald-500/30 hover:border-emerald-400 text-left hover:bg-[#0e2c1f] transition group"
          >
            <FileCheck2 className="w-5 h-5 text-amber-400 mb-1.5 group-hover:scale-110 transition" />
            <div className="font-bold text-white text-xs">Inward GRN</div>
            <div className="text-[10px] text-slate-300">Post supplier batch</div>
          </button>

          <button
            onClick={() => setActiveView('ret')}
            className="p-3 rounded-xl bg-[#071711] border border-emerald-500/30 hover:border-emerald-400 text-left hover:bg-[#0e2c1f] transition group"
          >
            <RotateCcw className="w-5 h-5 text-rose-400 mb-1.5 group-hover:scale-110 transition" />
            <div className="font-bold text-white text-xs">RTO &amp; QC</div>
            <div className="text-[10px] text-slate-300">Grade &amp; restock return</div>
          </button>
        </div>
      </div>

      {/* AI Velocity & Days-of-Cover (DOC) Reorder Forecaster */}
      <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                AI Inventory Velocity &amp; Days-of-Cover (DOC) Reorder Forecaster
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                Autonomous run-rate modeling based on 30-day velocity and FIFO batch consumption
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('inv')}
            className="text-xs font-bold text-emerald-300 hover:text-white flex items-center gap-1 transition"
          >
            View Master Inventory &amp; HSN Codes <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {criticalForecasts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {criticalForecasts.slice(0, 6).map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/20 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-300 uppercase">{item.sku}</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500/25 text-rose-300 border border-rose-500/40">
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1.5 border-t border-rose-500/20">
                  <div>
                    <span className="text-slate-300 block text-[10px]">Physical Stock</span>
                    <span className="font-bold text-white">{item.currentStock} units</span>
                  </div>
                  <div>
                    <span className="text-slate-300 block text-[10px]">Daily Velocity</span>
                    <span className="font-bold text-white">{item.dailyRunRate}/day</span>
                  </div>
                  <div>
                    <span className="text-slate-300 block text-[10px]">Days of Cover</span>
                    <span className="font-black text-rose-400 font-mono">{item.daysOfCover}d left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
            <PackageCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">
              All formulation stocks maintain healthy run-rate buffers (&gt;30 days cover). No emergency supplier replenishment required.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
