import React from 'react';
import { X, Printer, CheckCircle, MapPin, Package, ArrowRight } from 'lucide-react';

export default function WavePicklistModal({ picklist, onClose }) {
  if (!picklist) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                WMS Wave Picking Engine
              </span>
              <span className="text-xs font-mono text-slate-500">{picklist.waveId}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Consolidated Warehouse Walk-Route Picklist
            </h3>
            <p className="text-xs text-slate-500">
              {picklist.orderCount} Orders Aggregated • {picklist.totalItemsToPick} Total Units • {picklist.totalUniqueSkus} Unique SKUs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              <Printer className="w-4 h-4" /> Print Picklist
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Picklist Walk Path Table */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Optimal Walk Route:</strong> Items are pre-sorted by Zone, Rack, Shelf, and Bin to minimize walking distance across the warehouse.
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Bin & Location</th>
                  <th className="px-3 py-2.5">SKU & Barcode</th>
                  <th className="px-3 py-2.5">Product Name</th>
                  <th className="px-3 py-2.5 text-center">Pick Qty</th>
                  <th className="px-3 py-2.5">Order Breakdown</th>
                  <th className="px-3 py-2.5 text-center">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {picklist.walkPath?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="px-3 py-2.5 font-mono">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        {item.binCode}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.zone} • Rack {item.rack}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono">
                      <div className="font-semibold text-slate-800">{item.sku}</div>
                      <div className="text-[10px] text-slate-400">{item.barcode}</div>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-slate-800">
                      {item.name}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.totalPickQuantity}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-600">
                      <div className="flex flex-wrap gap-1">
                        {item.orderAllocations?.map((alloc, aIdx) => (
                          <span
                            key={aIdx}
                            className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-700"
                          >
                            #{alloc.orderId}: {alloc.quantity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">Generated at: {new Date(picklist.generatedAt).toLocaleString()}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
          >
            Close & Start Picking
          </button>
        </div>
      </div>
    </div>
  );
}
