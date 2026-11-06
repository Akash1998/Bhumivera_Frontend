import React from 'react';
import { X, Printer, Truck, FileText, CheckCircle2 } from 'lucide-react';

export default function ManifestPrintModal({ manifest, onClose }) {
  if (!manifest) return null;

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
                <Truck className="w-3.5 h-3.5" /> Courier Handover Manifest
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">{manifest.manifestCode}</span>
            </div>
            <h3 className="text-lg font-black text-white mt-1 tracking-wide">
              {manifest.courier?.toUpperCase()} Dispatch Handover Sheet
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              {manifest.totalShipments} Shipments • Gross Weight: {manifest.totalWeightKg} KG • Dispatcher: @{manifest.generatedBy}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-md transition"
            >
              <Printer className="w-4 h-4" /> Print Manifest
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Parcels Table */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="border border-emerald-500/30 rounded-xl overflow-hidden bg-[#071711]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#040e0a] text-emerald-300 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-500/30">
                <tr>
                  <th className="px-4 py-3 text-center w-12">#</th>
                  <th className="px-4 py-3">AWB Tracking #</th>
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Recipient Customer</th>
                  <th className="px-4 py-3">Destination City &amp; PIN</th>
                  <th className="px-4 py-3 text-center">Mode</th>
                  <th className="px-4 py-3 text-right">Invoice Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/15">
                {(manifest.shipments || []).map((s, idx) => (
                  <tr key={idx} className="hover:bg-emerald-950/40 transition">
                    <td className="px-4 py-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-mono font-black text-emerald-300">{s.trackingNumber}</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">{s.orderNumber}</td>
                    <td className="px-4 py-3 font-semibold text-slate-200">{s.customerName}</td>
                    <td className="px-4 py-3 text-slate-300">{s.destinationCity} ({s.pincode})</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {s.paymentMode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-black text-white">₹{s.declaredValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-500/30 bg-[#071711] flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-6">
            <div>
              <span className="font-bold text-emerald-400">Driver Signature:</span>
              <span className="border-b border-dashed border-slate-500 w-36 inline-block ml-2" />
            </div>
            <div>
              <span className="font-bold text-emerald-400">Warehouse Lead:</span>
              <span className="border-b border-dashed border-slate-500 w-36 inline-block ml-2" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 rounded-xl font-bold transition shadow-sm"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
}
