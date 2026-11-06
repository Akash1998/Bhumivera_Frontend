import React from 'react';
import { X, Printer, Truck, FileText, CheckCircle2 } from 'lucide-react';

export default function ManifestPrintModal({ manifest, onClose }) {
  if (!manifest) return null;

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
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Courier Handover Manifest
              </span>
              <span className="text-xs font-mono text-slate-500">{manifest.manifestCode}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {manifest.courier?.toUpperCase()} Dispatch Handover Sheet
            </h3>
            <p className="text-xs text-slate-500">
              {manifest.totalShipments} Shipments • Estimated Gross Weight: {manifest.totalWeightKg} KG • Dispatcher: @{manifest.generatedBy}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Printer className="w-4 h-4" /> Print Manifest
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Parcels Table */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5 text-center">#</th>
                  <th className="px-3 py-2.5">Order ID</th>
                  <th className="px-3 py-2.5">Air Waybill (AWB)</th>
                  <th className="px-3 py-2.5">Customer / Destination</th>
                  <th className="px-3 py-2.5 text-center">Tender</th>
                  <th className="px-3 py-2.5 text-right">Collectable (COD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {manifest.parcels?.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="px-3 py-2 text-center text-slate-400 font-mono text-[10px]">{idx + 1}</td>
                    <td className="px-3 py-2 font-mono font-semibold text-slate-800">{p.orderNumber}</td>
                    <td className="px-3 py-2 font-mono font-bold text-indigo-700">{p.awb}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-800">{p.customerName}</div>
                      <div className="text-[10px] text-slate-400">{p.phone}</div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.paymentMode === 'cod' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.paymentMode}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-slate-800">
                      {p.collectableAmount > 0 ? `₹${p.collectableAmount.toLocaleString('en-IN')}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures Section */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 mt-6">
            <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center">
              <div className="h-14 flex items-center justify-center text-xs text-slate-400 italic">
                Warehouse Dispatcher Signature / Stamp
              </div>
              <div className="border-t border-slate-200 pt-2 text-xs font-semibold text-slate-700">
                Handed Over By (@{manifest.generatedBy})
              </div>
            </div>
            <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center">
              <div className="h-14 flex items-center justify-center text-xs text-slate-400 italic">
                Courier Driver Signature & Vehicle No.
              </div>
              <div className="border-t border-slate-200 pt-2 text-xs font-semibold text-slate-700">
                Received in Good Condition ({manifest.courier?.toUpperCase()})
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">Timestamp: {new Date(manifest.generatedAt).toLocaleString()}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
