import React from 'react';
import { X, Printer, CheckCircle, MapPin, Package, ArrowRight, ShieldCheck } from 'lucide-react';

export default function WavePicklistModal({ picklist, onClose }) {
  if (!picklist) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0c261b] text-white rounded-2xl shadow-2xl border border-emerald-500/40 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-emerald-500/30 flex items-center justify-between bg-[#071711]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> WMS Wave Picking Engine (FIFO / FEFO)
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">{picklist.waveId}</span>
            </div>
            <h3 className="text-lg font-black text-white mt-1 tracking-wide">
              Consolidated Warehouse Walk-Route Picklist
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              {picklist.orderCount} Orders Aggregated • {picklist.totalItemsToPick} Total Units • {picklist.totalUniqueSkus} Unique SKUs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-md transition"
            >
              <Printer className="w-4 h-4" /> Print Picklist
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pick Rows Grouped by Zone & Bin Walk Path */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="border border-emerald-500/30 rounded-xl overflow-hidden bg-[#071711]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#040e0a] text-emerald-300 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-500/30">
                <tr>
                  <th className="px-4 py-3">Location (Bin &amp; Shelf)</th>
                  <th className="px-4 py-3">Formulation &amp; SKU</th>
                  <th className="px-4 py-3">HSN Code</th>
                  <th className="px-4 py-3 text-center">Batch (FEFO)</th>
                  <th className="px-4 py-3 text-center">Pick Qty</th>
                  <th className="px-4 py-3">Destination Orders</th>
                  <th className="px-4 py-3 text-center w-12">Picked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/15">
                {(picklist.picklist || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-emerald-950/40 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-300">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item.binCode}</span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-sans mt-0.5">{item.rackLocation}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-white line-clamp-1">{item.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{item.sku}</div>
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                      {item.gstHsnCode || '30049011'}
                    </td>

                    <td className="px-4 py-3 text-center font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                        {item.batchNo || 'FIFO-AUTO'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-mono font-black text-sm">
                        {item.totalPickQuantity}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(item.orders || []).map((o, oIdx) => (
                          <span
                            key={oIdx}
                            className="px-1.5 py-0.5 rounded bg-[#0c261b] text-slate-200 border border-emerald-500/30 font-mono text-[9px]"
                          >
                            #{o.orderNumber} ({o.qty})
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-emerald-500/50 text-emerald-600 focus:ring-emerald-500 bg-[#0c261b] w-4 h-4 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-500/30 bg-[#071711] flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-400">Picker Signature:</span>
            <span className="border-b border-dashed border-slate-500 w-36 inline-block" />
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 rounded-xl font-bold transition shadow-sm"
          >
            Close Picklist
          </button>
        </div>
      </div>
    </div>
  );
}
