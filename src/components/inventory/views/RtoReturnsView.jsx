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
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> Return & RTO Hub
            </span>
            <span className="text-xs text-slate-500">{rtoOrders.length} Cases Recorded</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">
            Undelivered Courier Shipments & Unboxing QC Grading
          </h3>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search RTO order, AWB, reason..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
          />
        </div>
      </div>

      {/* RTO Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Order Number</th>
                <th className="px-4 py-3">Customer & Location</th>
                <th className="px-4 py-3">Courier AWB</th>
                <th className="px-4 py-3">Courier RTO Reason / Notes</th>
                <th className="px-4 py-3 text-center">QC Grade</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rtoOrders.length > 0 ? (
                rtoOrders.map((order) => {
                  const isProcessed = Boolean(order.rtoProcessedAt);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                        <div className="text-[10px] font-sans font-normal text-slate-400">
                          {order.items?.length || 1} SKU(s) • ₹{order.total}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{order.customerName}</div>
                        <div className="text-[10px] text-slate-500">{order.customerPhone}</div>
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] font-bold text-indigo-700">
                        {order.trackingNumber || 'N/A'}
                        <div className="text-[10px] font-sans text-slate-400 uppercase">{order.courier || 'Courier'}</div>
                      </td>

                      <td className="px-4 py-3 max-w-xs">
                        <span className="text-slate-700 line-clamp-2">
                          {order.rtoReason || 'Customer Door Locked / Address Incomplete'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        {order.rtoRestockMode ? (
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.rtoRestockMode === 'vault'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.rtoRestockMode === 'shop'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            Restocked: {order.rtoRestockMode}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Awaiting Inspection
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onOpenReturnQc(order)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
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
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    <RotateCcw className="w-8 h-8 mx-auto text-slate-300 mb-2" />
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
