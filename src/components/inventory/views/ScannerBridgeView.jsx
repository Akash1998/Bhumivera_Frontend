import React from 'react';
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  Trash2,
  Zap,
  RefreshCw,
  ShieldCheck,
  CreditCard,
  Printer,
  Package,
  Power,
  PauseCircle,
  PlayCircle,
  Clock,
  Users,
} from 'lucide-react';

export default function ScannerBridgeView({
  pairingQrUrl,
  pairingKey,
  scannerQueue = [],
  onPullQueueToPos,
  onClearQueue,
  onRegenerateKey,
  hoursRemaining = 12,
  expiresAt = null,
  sessionCode = 'STAFF-AKASH',
  scannerConnected = false,
  scannerIdlePaused = false,
  remainingIdleSeconds = 600,
  onConnectScanner,
  onDisconnectScanner,
  operatorName = 'Akash',
  onChangeOperatorName,
  onOpenBatchQrModal = null,
  onOpenPackageFinder = null,
}) {
  const formatIdleTime = secs => {
    const s = Math.max(0, Number(secs) || 0);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const handlePrintPlacard = () => {
    if (!pairingQrUrl) {
      alert('Click "Connect Scanner" first to activate your session and generate the pairing QR code.');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please enable pop-ups to print the Station Placard.');
      return;
    }
    const expiryFormatted = expiresAt ? new Date(expiresAt).toLocaleString('en-IN') : '12 hours from pairing';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bhumivera Staff Scanner Station Placard - ${sessionCode}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            body { background: #fff; color: #000; padding: 15mm; display: flex; justify-content: center; }
            .dock-card {
              width: 160mm;
              border: 3px solid #000;
              border-radius: 6mm;
              padding: 8mm;
              text-align: center;
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
            .sub-title { font-size: 11pt; font-weight: 800; color: #222; margin-bottom: 1mm; }
            .station-badge {
              display: inline-block;
              background: #000;
              color: #fff;
              font-size: 11pt;
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
            .qr-wrapper img { width: 50mm; height: 50mm; display: block; }
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
            .dock-footer {
              margin-top: 4mm;
              font-size: 7.5pt;
              color: #555;
              font-weight: 700;
              border-top: 1px solid #000;
              padding-top: 2mm;
            }
          </style>
        </head>
        <body>
          <div class="dock-card">
            <div class="brand-header">BHUMIVERA AUSHADH</div>
            <div class="sub-title">STAFF SCANNER &amp; POS TERMINAL PAIRING</div>
            <div class="station-badge">STAFF: ${operatorName.toUpperCase()} • SESSION: ${sessionCode}</div>
            <div class="qr-wrapper">
              <img src="${pairingQrUrl}" alt="Pairing QR" />
            </div>
            <div class="security-banner">
              ⚡ ON-DEMAND CONNECTION • 10-MINUTE IDLE AUTO-SLEEP (KEY VALID UNTIL ${expiryFormatted.toUpperCase()})
            </div>
            <div class="steps-box">
              <div><b>1. Click Connect in Software:</b> Connection only starts when activated on screen.</div>
              <div><b>2. Scan This QR in Bombera/Bhumivera Scanner App:</b> Pairs your phone to ${operatorName}'s terminal.</div>
              <div><b>3. 10-Minute Idle Auto-Sleep:</b> Automatically disconnects after 10m of no scans to save SQL &amp; RAM.</div>
              <div><b>4. Seamless Resume:</b> Reconnect anytime to resume your exact cart, drafts, and order progress!</div>
            </div>
            <div class="dock-footer">
              Flagship Logistics Hub: Asansol (ASN-01) | Zero Idle SQL Overhead | Multi-Staff Order Lock Active
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
      {/* Staff Identity & Multi-Operator Isolation Bar */}
      <div className="bg-[#071711] p-4 rounded-2xl border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black uppercase text-white flex items-center gap-2">
              <span>Active Staff Operator &amp; Dedicated Terminal Session</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                {sessionCode}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Each staff member gets an isolated scanner connection &amp; automatic Order ID lock so two staff never bill the same order.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-emerald-300">Staff Name:</span>
          {['Akash', 'Priya C', 'Rahul', 'Vikram', 'Karan'].map(name => (
            <button
              key={name}
              type="button"
              onClick={() => onChangeOperatorName && onChangeOperatorName(name)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                operatorName?.toLowerCase() === name.toLowerCase()
                  ? 'bg-emerald-600 text-white border-emerald-300 shadow-sm'
                  : 'bg-[#0c261b] text-slate-300 border-emerald-500/30 hover:text-white'
              }`}
            >
              {name}
            </button>
          ))}
          <input
            type="text"
            value={operatorName}
            onChange={e => onChangeOperatorName && onChangeOperatorName(e.target.value)}
            placeholder="Custom Staff Name"
            className="px-2.5 py-1 rounded-lg bg-[#0c261b] border border-emerald-500/40 text-xs font-bold text-white w-32 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Main Connection & Pairing Banner */}
      <div className="bg-[#0c261b] p-6 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 border ${
                scannerConnected
                  ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              {scannerConnected
                ? 'Connected to Bombera/Bhumivera Scanner'
                : scannerIdlePaused
                ? 'Paused after 10m Inactivity (0 SQL/RAM Usage)'
                : 'Offline / Not Connected (On-Demand Mode)'}
            </span>

            {scannerConnected && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-200 border border-teal-500/40 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-teal-400" /> Auto-Disconnect in {formatIdleTime(remainingIdleSeconds)} if idle
              </span>
            )}
          </div>

          <h2 className="text-xl lg:text-2xl font-black text-white tracking-wide">
            On-Demand Mobile Scanner Bridge ({operatorName})
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {scannerConnected
              ? `Your scanner session (${sessionCode}) is actively connected. If there is no scanning or billing activity for 10 minutes, the connection will automatically pause so it never hits SQL or wastes RAM. You can resume anytime from the exact same place.`
              : `To save memory and prevent unnecessary SQL database hits, the scanner does NOT connect automatically on login. Click "Connect / Resume Scanner" below when you are ready to scan and bill.`}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2.5">
            {!scannerConnected ? (
              <button
                type="button"
                onClick={onConnectScanner}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/50 rounded-xl transition shadow-lg"
              >
                <PlayCircle className="w-4 h-4" />
                {scannerIdlePaused || pairingKey ? 'Resume Scanner Connection (Restore State)' : 'Connect Scanner Now'}
              </button>
            ) : (
              <button
                type="button"
                onClick={onDisconnectScanner}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black uppercase text-amber-200 bg-amber-950/70 hover:bg-amber-900 border border-amber-500/50 rounded-xl transition shadow-md"
              >
                <PauseCircle className="w-4 h-4 text-amber-400" /> Pause / Disconnect Scanner
              </button>
            )}

            {scannerConnected && (
              <button
                type="button"
                onClick={handlePrintPlacard}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition shadow-md"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" /> Print Station Pairing QR
              </button>
            )}

            {onOpenBatchQrModal && (
              <button
                type="button"
                onClick={onOpenBatchQrModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition shadow-sm"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" /> Generate Standalone Product QRs (A4)
              </button>
            )}

            {onOpenPackageFinder && (
              <button
                type="button"
                onClick={onOpenPackageFinder}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-teal-200 bg-teal-950/60 hover:bg-teal-900/80 border border-teal-500/50 rounded-xl transition shadow-sm"
              >
                <Package className="w-3.5 h-3.5 text-teal-400" /> Lost Package Finder
              </button>
            )}

            {scannerConnected && (
              <button
                type="button"
                onClick={onRegenerateKey}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-xl transition shadow-sm"
                title="Force regenerate pairing key"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Rotate Key
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-300 font-mono">
            <span className="text-slate-400">Operator:</span>
            <span className="font-bold text-white bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">
              {operatorName}
            </span>
            <span className="text-slate-400 ml-1">Session:</span>
            <span className="font-bold text-white bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">
              {sessionCode}
            </span>
            <span className="text-slate-400 ml-1">Key:</span>
            <span className="font-bold text-emerald-300">
              {pairingKey ? `${pairingKey.slice(0, 14)}...` : 'Click Connect'}
            </span>
          </div>
        </div>

        {/* Pairing QR Code Graphic */}
        <div className="bg-[#071711] border-2 border-dashed border-emerald-500/40 p-4 rounded-2xl text-center shrink-0 shadow-lg flex flex-col items-center min-w-[200px]">
          {scannerConnected && pairingQrUrl ? (
            <>
              <img
                src={pairingQrUrl}
                alt="Station Dock Pairing QR"
                className="w-36 h-36 rounded-xl mx-auto shadow-md border-2 border-emerald-400/50 cursor-pointer hover:opacity-90 transition"
                onClick={handlePrintPlacard}
                title="Scan with Bombera/Bhumivera Scanner App to connect"
              />
              <div className="text-[11px] font-black text-emerald-300 mt-2 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active • Sleeps in {formatIdleTime(remainingIdleSeconds)}
              </div>
              <button
                type="button"
                onClick={handlePrintPlacard}
                className="text-[10px] text-teal-300 hover:text-white underline font-bold mt-0.5"
              >
                Click QR to Print Placard
              </button>
            </>
          ) : (
            <div className="w-40 h-40 flex flex-col items-center justify-center text-slate-300 text-xs p-2 space-y-2">
              <Power className="w-8 h-8 text-amber-400" />
              <div className="font-bold text-white text-[11px]">
                {scannerIdlePaused ? 'Session Paused (10m Idle)' : 'Scanner Not Connected'}
              </div>
              <button
                type="button"
                onClick={onConnectScanner}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase"
              >
                {scannerIdlePaused ? 'Resume Session' : 'Click to Connect'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Buffered Scans Table */}
      <div className="bg-[#0c261b] rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden w-full max-w-full">
        <div className="p-4 border-b border-emerald-500/20 flex items-center justify-between bg-[#071711]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-black uppercase text-white tracking-wide">
              Live Scanned Items Queue ({scannerQueue.length}) — Auto-Syncs to POS Billing
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {scannerQueue.length > 0 && (
              <>
                <button
                  onClick={onPullQueueToPos}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Open in POS Cart ({scannerQueue.length})
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
                      {new Date(item.created_at || item.scannedAt || Date.now()).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      <div>{item.product_name || item.productName}</div>
                      {item.batchNo && (
                        <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-950/50 px-1.5 py-0.5 rounded border border-teal-500/30">
                          Batch: {item.batchNo}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span className="text-emerald-300 font-bold">{item.sku}</span>
                      <span className="text-[10px] text-slate-400 ml-2">HSN: {item.gst_hsn_code || item.gstHsnCode || '30049011'}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-black text-white">{item.quantity || 1}</td>
                    <td className="px-4 py-3 text-right font-mono font-black text-white">₹{item.unit_price ?? item.unitPrice}</td>
                    <td className="px-4 py-3 text-right text-slate-300 font-mono text-[11px]">
                      {item.device_name || item.scannedBy || 'Bombera Scanner'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-300">
                    <Smartphone className="w-8 h-8 mx-auto text-emerald-400/60 mb-2" />
                    {scannerConnected
                      ? 'Connected & waiting for mobile QR scans. Every scanned product automatically appears in your POS bill.'
                      : 'Scanner is currently offline (saving SQL & RAM). Click "Connect Scanner Now" above to begin scanning.'}
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
