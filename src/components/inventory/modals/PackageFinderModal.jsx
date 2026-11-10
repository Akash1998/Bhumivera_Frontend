import React, { useState } from 'react';
import {
  Search,
  Package,
  X,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  AlertTriangle,
  ArrowRight,
  User,
  Phone,
  Mail,
  Boxes,
} from 'lucide-react';
import api from '../../../services/api';

export default function PackageFinderModal({ isOpen, onClose, onSelectOrderForLabel, onNavigateToOrder, reqConfig }) {
  const [queryCode, setQueryCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [packageData, setPackageData] = useState(null);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const clean = queryCode.trim();
    if (!clean) return;
    setErrorMsg('');
    setPackageData(null);
    setLoading(true);

    try {
      const res = await api.get(`/inventory-software/package/lookup?code=${encodeURIComponent(clean)}`, reqConfig);
      if (res.data?.success && res.data.package) {
        setPackageData(res.data.package);
      } else {
        setErrorMsg(`No warehouse parcel found matching "${clean}".`);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || `Could not find parcel matching "${clean}".`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0c261b] text-white rounded-2xl shadow-2xl border-2 border-emerald-500/40 max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#071711] border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Package Finder &amp; Lost Parcel Detective
              </h3>
              <p className="text-[11px] text-slate-300">
                Scan or enter any misplaced carton QR, shipping AWB, or Order ID to instantly identify whose parcel this is.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 border-b border-emerald-500/20 bg-[#091f16]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                autoFocus
                value={queryCode}
                onChange={e => setQueryCode(e.target.value)}
                placeholder="Scan or enter Package QR (PKG:123), Order # (123456), or AWB Tracking..."
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none font-mono placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !queryCode.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Locate Parcel'}
            </button>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {packageData ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Top Parcel Summary Card */}
              <div className="bg-[#071711] border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-emerald-300">
                      {packageData.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {packageData.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Package Identifier: <span className="font-mono font-bold text-white">{packageData.packageCode}</span>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-emerald-500/20 sm:pl-4">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Courier &amp; AWB</div>
                  <div className="text-xs font-mono font-bold text-teal-300">{packageData.courier}</div>
                  <div className="text-[11px] font-mono text-slate-300">{packageData.trackingNumber}</div>
                </div>
              </div>

              {/* Recipient Consignee Information */}
              <div className="bg-[#071711] border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <div className="text-xs font-black uppercase text-emerald-300 flex items-center gap-1.5 border-b border-emerald-500/20 pb-2">
                  <User className="w-3.5 h-3.5 text-emerald-400" /> Recipient Details (Consignee)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Customer Name:</span>
                    <strong className="text-white text-sm">{packageData.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone &amp; Email:</span>
                    <span className="text-white font-mono">{packageData.customerPhone || 'N/A'}</span>
                    {packageData.customerEmail && (
                      <span className="text-slate-400 text-[11px] block">{packageData.customerEmail}</span>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[10px]">Destination Address:</span>
                    <span className="text-slate-200">
                      {packageData.shippingAddress}, {packageData.shippingCity}, {packageData.shippingState} - {packageData.shippingPincode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contents Table */}
              <div className="bg-[#071711] border border-emerald-500/30 rounded-xl overflow-hidden">
                <div className="p-3 border-b border-emerald-500/20 text-xs font-black uppercase text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-emerald-400" /> Package Contents ({packageData.itemsCount} Units)
                  </span>
                  <span className="font-mono text-white">Value: ₹{packageData.totalAmount}</span>
                </div>
                <div className="divide-y divide-emerald-500/15 text-xs">
                  {packageData.items?.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{it.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          SKU: {it.sku} • Bin: {it.binCode} • Batch: {it.batchNo}
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-black text-emerald-300">x{it.quantity}</div>
                        <div className="text-[10px] text-slate-400">₹{it.price} each</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                {onSelectOrderForLabel && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectOrderForLabel(packageData);
                      onClose();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5" /> Reprint 4×6″ Shipping Label
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold text-xs rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : !loading && (
            <div className="text-center py-10 text-slate-300 space-y-2">
              <Package className="w-10 h-10 mx-auto text-emerald-500/40" />
              <div className="text-xs font-bold text-white">No parcel searched yet</div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Scan any shipping barcode, 4x6" label QR, or enter the 6-digit Order ID above to locate the recipient and parcel dossier.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
