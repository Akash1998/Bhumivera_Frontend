import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Archive,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function RtoReturnsView({
  orders = [],
  onOpenReturnQc,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Orders that are cancelled or marked RTO
  const rtoOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return orders.filter(o => {
      const isRto = ['cancelled', 'rto_delivered', 'rto_initiated', 'refunded'].includes(o.status) || Boolean(o.rtoReason);
      const matchQ =
        !q ||
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.trackingNumber?.toLowerCase().includes(q) ||
        o.rtoReason?.toLowerCase().includes(q);
      return isRto && matchQ;
    });
  }, [orders, searchTerm]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-[#0c261b] p-5 rounded-2xl border border-emerald-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/25 text-rose-300 border border-rose-500/40 flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> Return &amp; RTO Hub
            </span>
            <span className="text-xs text-slate-300 font-bold">{rtoOrders.length} Cases Recorded</span>
          </div>
          <h3 className="text-base font-black text-white mt-1 uppercase tracking-wide">
            Undelivered Courier Shipments &amp; Unboxing QC Grading
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">
            Systematic inspection: Grade A (re-vaulted), Grade B (clearance display), Grade C (quarantine).
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search RTO order, AWB, reason..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none font-medium placeholder-slate-400"
          />
        </div>
      </div>

      {/* RTO Cases Table */}
      <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-[#071711] text-emerald-300 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-500/30">
              <tr>
                <th className="px-4 py-3">Order Number</th>
                <th className="px-4 py-3">Customer &amp; Phone</th>
                <th className="px-4 py-3">Courier AWB</th>
                <th className="px-4 py-3">Courier RTO Reason / Notes</th>
                <th className="px-4 py-3 text-center">QC Grade</th>
                <th className="px-4 py-3 text-right">Inspection Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/15">
              {rtoOrders.length > 0 ? (
                rtoOrders.map((order) => {
                  const isProcessed = Boolean(order.rtoProcessedAt);

                  return (
                    <tr key={order.id} className="hover:bg-emerald-950/30 transition">
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        {order.orderNumber}
                        <div className="text-[10px] font-sans font-normal text-slate-300">
                          {order.items?.length || 1} SKU(s) • ₹{order.total}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{order.customerName}</div>
                        <div className="text-[10px] text-slate-300 font-mono">{order.customerPhone}</div>
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] font-bold text-emerald-300">
                        {order.trackingNumber || 'N/A'}
                        <div className="text-[10px] font-sans text-slate-400 uppercase">{order.courier || 'Courier'}</div>
                      </td>

                      <td className="px-4 py-3 max-w-xs">
                        <span className="text-slate-200 line-clamp-2">
                          {order.rtoReason || 'Customer Door Locked / Address Incomplete'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        {order.rtoRestockMode && order.rtoRestockMode !== 'NONE' ? (
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.rtoRestockMode === 'RESTOCKED' || order.rtoRestockMode === 'vault'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : order.rtoRestockMode === 'shop'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}>
                            Restocked: {order.rtoRestockMode}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30 font-bold">
                            Awaiting Inspection
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onOpenReturnQc(order)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-black uppercase tracking-wider transition shadow-sm"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          {isProcessed ? 'Re-inspect' : 'QC Unbox'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-300">
                    <RotateCcw className="w-8 h-8 mx-auto text-emerald-400/60 mb-2" />
                    No undelivered RTO returns pending inspection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
