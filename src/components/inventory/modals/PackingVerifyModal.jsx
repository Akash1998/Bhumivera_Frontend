import React, { useState } from 'react';
import { X, Barcode, CheckCircle2, AlertTriangle, ShieldCheck, Printer, ArrowRight } from 'lucide-react';
import api from '../../../services/api';

export default function PackingVerifyModal({ order, onClose, onPackComplete, reqConfig }) {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [verifiedItems, setVerifiedItems] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const orderItems = order.items || [];
  const totalQuantity = orderItems.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);
  const totalVerified = Object.values(verifiedItems).reduce((sum, count) => sum + count, 0);
  const isComplete = totalVerified >= totalQuantity;

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.post(
        '/inventory-software/fulfillment/verify-pack',
        { orderId: order.id, barcode: code },
        reqConfig
      );

      if (res.data?.verified) {
        const matchedProduct = res.data.product;
        setVerifiedItems(prev => {
          const currentCount = prev[matchedProduct.productId] || 0;
          return { ...prev, [matchedProduct.productId]: currentCount + 1 };
        });
        setBarcodeInput('');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || `Barcode "${code}" does not belong to Order #${order.orderNumber}!`);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishPacking = () => {
    if (onPackComplete) {
      onPackComplete(order.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0c261b] text-white rounded-2xl shadow-2xl border border-emerald-500/40 max-w-xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-emerald-500/30 flex items-center justify-between bg-[#071711]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High-Accuracy Packing Audit
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">#{order.orderNumber}</span>
            </div>
            <h3 className="text-base font-black text-white mt-1 tracking-wide uppercase">
              Barcode Scan-to-Verify &amp; Seal Box
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Zero-defect dispatch: Every physical formulation must be scanned before generating carrier label.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span>Verification Progress</span>
              <span className={isComplete ? 'text-emerald-400 font-black' : 'text-slate-200'}>
                {totalVerified} of {totalQuantity} Units Scanned
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#071711] rounded-full overflow-hidden border border-emerald-500/25">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isComplete ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(100, (totalVerified / Math.max(1, totalQuantity)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Barcode Scanner Input */}
          {!isComplete && (
            <form onSubmit={handleScanSubmit} className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300">
                Scan Physical Product Barcode / EAN-13
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Barcode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Scan product barcode..."
                    autoFocus
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none font-mono placeholder-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !barcodeInput.trim()}
                  className="px-4 py-2 text-xs font-black uppercase bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition disabled:opacity-50 shadow-md"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          )}

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Order Items Checklist */}
          <div className="border border-emerald-500/30 rounded-xl overflow-hidden divide-y divide-emerald-500/15 bg-[#071711]">
            {orderItems.map((item, idx) => {
              const countVerified = verifiedItems[item.productId] || 0;
              const isItemDone = countVerified >= Number(item.quantity);

              return (
                <div
                  key={idx}
                  className={`p-3 text-xs flex items-center justify-between transition ${
                    isItemDone ? 'bg-emerald-950/30' : 'bg-[#071711]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-300">
                      Required: <strong className="text-emerald-300">{item.quantity}</strong> Unit(s) • HSN: {item.gstHsnCode || '30049011'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-white">
                      {countVerified} / {item.quantity}
                    </span>
                    {isItemDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-emerald-500/40 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Success Banner */}
          {isComplete && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black uppercase text-white">100% Items Verified Match</h4>
              <p className="text-xs text-slate-300">
                All formulations in Order #{order.orderNumber} have been verified. Ready for box sealing &amp; 4×6″ courier label print.
              </p>
              <button
                onClick={handleFinishPacking}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-lg transition"
              >
                <Printer className="w-4 h-4" /> Seal Box &amp; Mark Packed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
