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
  Printer,
  Calendar,
  Layers,
} from 'lucide-react';

export default function ScannerBridgeView({
  pairingQrUrl,
  pairingKey,
  scannerQueue = [],
  onPullQueueToPos,
  onClearQueue,
  onRegenerateKey,
  daysRemaining = 90,
  expiresAt = null,
  sessionCode = 'REG-POS-01',
  onOpenBatchQrModal = null,
}) {
  const handlePrintPlacard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please enable pop-ups to print the Station Placard.');
      return;
    }

    const expiryFormatted = expiresAt ? new Date(expiresAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) : '90 Days from Activation';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bhumivera Warehouse Station Dock Placard - ${sessionCode}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            body { background: #fff; color: #000; padding: 15mm; display: flex; justify-content: center; }
            .dock-card {
              width: 160mm;
              border: 3px solid #000;
              border-radius: 6mm;
              padding: 8mm;
              text-align: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .brand-header {
              font-size: 18pt;
              font-weight: 900;
              letter-spacing: 2px;
              text-transform: uppercase;
              border-bottom: 2px solid #000;
              padding-bottom: 3mm;
              margin-bottom: 4mm;
            }
            .sub-title {
              font-size: 11pt;
              font-weight: 800;
              color: #222;
              margin-bottom: 1mm;
            }
            .station-badge {
              display: inline-block;
              background: #000;
              color: #fff;
              font-size: 12pt;
              font-weight: 900;
              padding: 2mm 6mm;
              border-radius: 4mm;
              margin-top: 2mm;
              margin-bottom: 5mm;
              font-family: monospace;
            }
            .qr-wrapper {
              margin: 4mm auto;
              width: 55mm;
              height: 55mm;
              border: 2px dashed #000;
              padding: 2.5mm;
              border-radius: 4mm;
            }
            .qr-wrapper img {
              width: 50mm;
              height: 50mm;
              display: block;
            }
            .security-banner {
              background: #f0fdf4;
              border: 1.5px solid #16a34a;
              color: #14532d;
              font-size: 8.5pt;
              font-weight: 800;
              padding: 2mm;
              border-radius: 3mm;
              margin: 4mm auto;
              max-width: 130mm;
            }
            .steps-box {
              text-align: left;
              background: #fafafa;
              border: 1px solid #ddd;
              padding: 4mm 6mm;
              border-radius: 3mm;
              margin: 4mm auto;
              font-size: 8.5pt;
              line-height: 1.6;
              max-width: 130mm;
            }
            .steps-box b { color: #000; }
            .dock-footer {
              margin-top: 4mm;
              font-size: 7.5pt;
              color: #555;
              font-weight: 700;
              border-top: 1px solid #000;
              padding-top: 2mm;
            }
            @media print {
              body { padding: 0; }
              .dock-card { border: 3px solid #000 !important; box-shadow: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="dock-card">
            <div class="brand-header">BHUMIVERA AUSHADH</div>
            <div class="sub-title">WAREHOUSE PACKING &amp; PICKING DOCK STATION</div>
            <div class="station-badge">TERMINAL: ${sessionCode}</div>
            
            <div class="qr-wrapper">
              <img src="${pairingQrUrl}" alt="Pairing QR" />
            </div>

            <div class="security-banner">
              🔒 90-DAY ENTERPRISE DEVICE TOKEN — VALID UNTIL ${expiryFormatted.toUpperCase()}
            </div>

            <div class="steps-box">
              <div><b>1. Open Scanner APK:</b> Launch Bhumivera Scanner on your Android device.</div>
              <div><b>2. Scan This Placard:</b> Point camera at the QR code above to link your phone.</div>
              <div><b>3. Auto-Login 90 Days:</b> Authenticates instantly; no login required for 90 days.</div>
              <div><b>4. Pick &amp; Pack:</b> Scan product barcodes/batch QRs to verify picks and push live bills!</div>
            </div>

            <div class="dock-footer">
              Flagship Logistics Hub: Asansol (ASN-01) | Sub-15ms CameraX Pipeline | AES-256 Encrypted Token
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 800);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-[#0c261b] p-6 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> Native Android Scanner 2.0
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-200 border border-teal-500/40 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> 90-Day Token Active ({daysRemaining} days left)
            </span>
          </div>

          <h2 className="text-xl lg:text-2xl font-black text-white tracking-wide">
            Warehouse Station Dock &amp; Mobile Scanner Link
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Scan this dock station QR code using the Bhumivera Android Scanner app. Once paired, the app stays securely authenticated for <b>90 days</b>. Warehouse staff can walk up, pick and pack items, scan batch QR stickers, and push items directly to desktop registers or packing verification buffers.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePrintPlacard}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/40 rounded-xl transition shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print Station Dock Placard
            </button>

            {onOpenBatchQrModal && (
              <button
                onClick={onOpenBatchQrModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition shadow-sm"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" /> Generate Product Batch QR
              </button>
            )}

            <button
              onClick={onRegenerateKey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-xl transition shadow-sm"
              title="Force regenerate pairing key and invalidate previous key"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Rotate Key
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-300 font-mono">
            <span className="text-slate-400">Terminal:</span>
            <span className="font-bold text-white bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">
              {sessionCode}
            </span>
            <span className="text-slate-400 ml-2">Key:</span>
            <span className="font-bold text-emerald-300">{pairingKey ? `${pairingKey.slice(0, 16)}...` : '••••••••'}</span>
          </div>
        </div>

        {/* Pairing QR Code Graphic */}
        <div className="bg-[#071711] border-2 border-dashed border-emerald-500/40 p-4 rounded-2xl text-center shrink-0 shadow-lg flex flex-col items-center">
          {pairingQrUrl ? (
            <img
              src={pairingQrUrl}
              alt="Station Dock Pairing QR"
              className="w-36 h-36 rounded-xl mx-auto shadow-md border-2 border-emerald-400/50 cursor-pointer hover:opacity-90 transition"
              onClick={handlePrintPlacard}
              title="Click to print station dock placard"
            />
          ) : (
            <div className="w-36 h-36 flex items-center justify-center text-slate-400 text-xs font-mono">
              Loading 90-Day Token...
            </div>
          )}
          <div className="text-[11px] font-black text-emerald-300 mt-2 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 90-Day Active Dock
          </div>
          <button
            onClick={handlePrintPlacard}
            className="text-[10px] text-teal-300 hover:text-white underline font-bold mt-0.5"
          >
            Click QR to Print Placard
          </button>
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
                    <td className="px-4 py-3 font-bold text-white">
                      <div>{item.productName}</div>
                      {item.batchNo && (
                        <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-950/50 px-1.5 py-0.5 rounded border border-teal-500/30">
                          Batch: {item.batchNo}
                        </span>
                      )}
                    </td>
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
