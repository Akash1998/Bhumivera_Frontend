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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Scan-to-Verify Packing Station
              </span>
              <span className="text-xs font-mono text-slate-500">Order #{order.orderNumber}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Verify SKUs Before Box Closure
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>Verification Progress</span>
              <span className={isComplete ? 'text-emerald-600 font-bold' : 'text-slate-800'}>
                {totalVerified} of {totalQuantity} Units Scanned
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isComplete ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(100, (totalVerified / Math.max(1, totalQuantity)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Barcode Scanner Input */}
          {!isComplete && (
            <form onSubmit={handleScanSubmit} className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Scan Physical Product Barcode / EAN-13
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Barcode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Scan product barcode..."
                    autoFocus
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !barcodeInput.trim()}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          )}

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Order Items Checklist */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {orderItems.map((item, idx) => {
              const countVerified = verifiedItems[item.productId] || 0;
              const isItemDone = countVerified >= Number(item.quantity);

              return (
                <div
                  key={idx}
                  className={`p-3 text-xs flex items-center justify-between transition ${
                    isItemDone ? 'bg-emerald-50/50' : 'bg-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-400">Required: {item.quantity} Unit(s)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {countVerified} / {item.quantity}
                    </span>
                    {isItemDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Success Banner */}
          {isComplete && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-emerald-900">100% Items Verified Match</h4>
              <p className="text-xs text-emerald-700">
                All SKUs in Order #{order.orderNumber} have been physically scanned and matched. Ready for box sealing & 4x6 shipping label print.
              </p>
              <button
                onClick={handleFinishPacking}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-200"
              >
                <Printer className="w-4 h-4" /> Seal Box & Mark Packed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
