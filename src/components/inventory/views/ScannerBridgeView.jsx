import React from 'react';
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  Trash2,
  Zap,
  RefreshCw,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export default function ScannerBridgeView({
  pairingQrUrl,
  pairingKey,
  scannerQueue = [],
  onPullQueueToPos,
  onClearQueue,
  onRegenerateKey,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> Native Android Scanner Link
            </span>
            <span className="text-xs text-slate-500 font-mono">CameraX 60 FPS Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Pair Bhumivera Scanner APK with Active Desktop Register
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Scan the pairing QR code using the Bhumivera Android Scanner app. Items scanned by warehouse workers or roaming cashiers are buffered in real-time and can be pulled into this register with one click.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onRegenerateKey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Rotate Pairing Key
            </button>
            <span className="text-xs text-slate-400 font-mono">Key: {pairingKey || '••••••••'}</span>
          </div>
        </div>

        {/* Pairing QR Code Graphic */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-4 rounded-2xl text-center shrink-0">
          {pairingQrUrl ? (
            <img
              src={pairingQrUrl}
              alt="Scanner Pairing QR"
              className="w-36 h-36 mx-auto rounded-xl shadow-sm"
            />
          ) : (
            <div className="w-36 h-36 flex items-center justify-center text-slate-400 text-xs font-mono">
              Generating QR...
            </div>
          )}
          <span className="block text-[11px] font-bold text-slate-700 mt-2">
            Point Mobile Camera to Connect
          </span>
        </div>
      </div>

      {/* Live Scanned Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Live Scanned Items Buffer ({scannerQueue.length} Queued)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClearQueue}
              disabled={scannerQueue.length === 0}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
            >
              Clear Buffer
            </button>
            <button
              onClick={onPullQueueToPos}
              disabled={scannerQueue.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" /> Transfer to POS Bill
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">SKU & Barcode</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3 text-center">Quantity</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scannerQueue.length > 0 ? (
                scannerQueue.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : 'Just now'}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-800">
                      {item.sku}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {item.name || item.product_name}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-800">
                      {item.quantity || 1}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ₹{item.price || item.unit_price || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    <Smartphone className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No items in scanner buffer. Scan barcodes with the mobile app to see them appear here instantly.
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
