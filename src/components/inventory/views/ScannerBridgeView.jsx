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
  CreditCard,
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
    <div className="space-y-6 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-[#0c261b] p-6 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> Native Android Scanner Link
            </span>
            <span className="text-xs text-emerald-300 font-mono">CameraX 60 FPS Sub-15ms Engine</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-white tracking-wide">
            Pair Bhumivera Scanner APK with Active Desktop Register
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Scan the pairing QR code using the Bhumivera Android Scanner app. Items scanned by warehouse workers or roaming cashiers are buffered in real-time and can be pulled into this register with one click.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onRegenerateKey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Rotate Pairing Key
            </button>
            <span className="text-xs text-emerald-300 font-mono font-bold">Key: {pairingKey || '••••••••'}</span>
          </div>
        </div>

        {/* Pairing QR Code Graphic */}
        <div className="bg-[#071711] border-2 border-dashed border-emerald-500/40 p-4 rounded-2xl text-center shrink-0 shadow-lg">
          {pairingQrUrl ? (
            <img
              src={pairingQrUrl}
              alt="Pairing QR"
              className="w-36 h-36 rounded-xl mx-auto shadow-md border-2 border-emerald-400/50"
            />
          ) : (
            <div className="w-36 h-36 flex items-center justify-center text-slate-400 text-xs font-mono">
              Generating Link QR...
            </div>
          )}
          <div className="text-[11px] font-bold text-emerald-300 mt-2">Scan via Native Scanner</div>
          <div className="text-[10px] text-slate-400 font-mono">Session: REG-POS-01</div>
        </div>
      </div>

      {/* Live Buffered Scans Table */}
      <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden w-full max-w-full">
        <div className="p-4 border-b border-emerald-500/20 flex items-center justify-between bg-[#071711]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-black uppercase text-white tracking-wide">
              Incoming Hardware Scanner Buffer ({scannerQueue.length})
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {scannerQueue.length > 0 && (
              <>
                <button
                  onClick={onPullQueueToPos}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Pull to Active POS Cart ({scannerQueue.length})
                </button>
                <button
                  onClick={onClearQueue}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition"
                  title="Clear Buffer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[#040e0a] text-emerald-300 uppercase font-bold text-[10px] tracking-wider border-b border-emerald-500/30">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Scanned Product</th>
                <th className="px-4 py-3">SKU &amp; HSN</th>
                <th className="px-4 py-3 text-center">Quantity</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Scanning Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/15">
              {scannerQueue.length > 0 ? (
                scannerQueue.map((item, idx) => (
                  <tr key={idx} className="hover:bg-emerald-950/30 transition">
                    <td className="px-4 py-3 font-mono text-slate-300">
                      {new Date(item.scannedAt || Date.now()).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{item.productName}</td>
                    <td className="px-4 py-3 font-mono">
                      <span className="text-emerald-300 font-bold">{item.sku}</span>
                      <span className="text-[10px] text-slate-400 ml-2">HSN: {item.gstHsnCode || '30049011'}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-black text-white">{item.quantity || 1}</td>
                    <td className="px-4 py-3 text-right font-mono font-black text-white">₹{item.unitPrice}</td>
                    <td className="px-4 py-3 text-right text-slate-300 font-mono text-[11px]">
                      {item.scannedBy || 'Android Scanner'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-300">
                    <Smartphone className="w-8 h-8 mx-auto text-emerald-400/60 mb-2" />
                    No items in scanner buffer. Pull triggers on mobile scan.
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
