import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Barcode,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Printer,
  Edit3,
  Plus,
  Trash2,
  Save,
  QrCode,
  Volume2,
  PackageCheck,
  RotateCcw,
} from 'lucide-react';
import api from '../../../services/api';

// Web Audio API feedback for industrial warehouse environment
const playSuccessChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, ctx.currentTime); // A6
    osc.frequency.exponentialRampToValueAtTime(2637, ctx.currentTime + 0.12); // E7
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio context may require prior user interaction
  }
};

const playMismatchAlarm = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime); // A3 low harsh buzz
    osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    // Audio context may require prior user interaction
  }
};

export default function PackingVerifyModal({ order, onClose, onPackComplete, reqConfig }) {
  const [orderItems, setOrderItems] = useState(order?.items || []);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [verifiedItems, setVerifiedItems] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [rejectedBarcode, setRejectedBarcode] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin live order editor mode
  const [isAdminEditMode, setIsAdminEditMode] = useState(false);
  const [editableItems, setEditableItems] = useState([]);
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(299);
  const [savingOrder, setSavingOrder] = useState(false);

  // Printable pick slip / Order QR modal view
  const [showPickSlip, setShowPickSlip] = useState(false);
  const [orderQrUrl, setOrderQrUrl] = useState('');

  useEffect(() => {
    if (order?.items) {
      setOrderItems(order.items);
      setEditableItems(order.items.map(it => ({ ...it })));
    }
  }, [order]);

  // Generate Order QR code for the pick slip
  useEffect(() => {
    if (!order?.id) return;
    const orderToken = `ORD:${order.id}`;
    QRCode.toDataURL(orderToken, {
      width: 180,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then(url => setOrderQrUrl(url))
      .catch(err => console.error('Failed to generate order QR', err));
  }, [order?.id]);

  if (!order) return null;

  const totalQuantity = orderItems.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);
  const totalVerified = Object.values(verifiedItems).reduce((sum, count) => sum + count, 0);
  const isComplete = totalVerified >= totalQuantity && totalQuantity > 0;

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;
    setErrorMsg('');
    setRejectedBarcode('');
    setLoading(true);

    try {
      const res = await api.post(
        '/inventory-software/fulfillment/verify-pack',
        { orderId: order.id, barcode: code },
        reqConfig
      );

      if (res.data?.verified) {
        playSuccessChime();
        const matchedProduct = res.data.product;
        setVerifiedItems(prev => {
          const currentCount = prev[matchedProduct.productId] || 0;
          return { ...prev, [matchedProduct.productId]: currentCount + 1 };
        });
        setBarcodeInput('');
      }
    } catch (err) {
      playMismatchAlarm();
      const errText = err.response?.data?.message || `Barcode "${code}" does not belong to Order #${order.orderNumber}!`;
      setErrorMsg(errText);
      setRejectedBarcode(code);
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

  // Admin live item modification
  const handleItemQtyChange = (index, delta) => {
    setEditableItems(prev => {
      const copy = [...prev];
      const target = { ...copy[index] };
      const current = Number(target.quantity) || 1;
      const next = Math.max(1, current + delta);
      target.quantity = next;
      copy[index] = target;
      return copy;
    });
  };

  const handleRemoveItem = (index) => {
    setEditableItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddNewItem = () => {
    if (!newItemName.trim()) return;
    const item = {
      productId: Date.now(),
      sku: newItemSku.trim() || `BV-${Date.now().toString().slice(-6)}`,
      name: newItemName.trim(),
      quantity: Number(newItemQty) || 1,
      price: Number(newItemPrice) || 299,
      gstHsnCode: '30049011',
    };
    setEditableItems(prev => [...prev, item]);
    setNewItemSku('');
    setNewItemName('');
    setNewItemQty(1);
    setNewItemPrice(299);
  };

  const handleSaveAdminOrderItems = async () => {
    if (editableItems.length === 0) {
      alert('Order must contain at least 1 item.');
      return;
    }
    setSavingOrder(true);
    try {
      const res = await api.put(
        `/inventory-software/orders/${order.id}/items`,
        { items: editableItems },
        reqConfig
      );
      if (res.data?.success) {
        setOrderItems(res.data.items || editableItems);
        setIsAdminEditMode(false);
        setErrorMsg('');
        setRejectedBarcode('');
        // Reset verified counts to re-verify updated order
        setVerifiedItems({});
        playSuccessChime();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order items.');
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0c261b] text-white rounded-2xl shadow-2xl border border-emerald-500/40 max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-emerald-500/30 flex items-center justify-between bg-[#071711]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High-Accuracy Packing Audit
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">#{order.orderNumber}</span>
              <span className="text-xs text-slate-300 font-medium">({order.customerName})</span>
            </div>
            <h3 className="text-sm font-black text-white mt-1 tracking-wide uppercase">
              Zero-Defect Warehouse Packing Station
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPickSlip(!showPickSlip)}
              className="text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-800/60 border border-emerald-500/40 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition"
            >
              <QrCode className="w-3.5 h-3.5" /> {showPickSlip ? 'Close Token' : 'Order QR Token'}
            </button>
            <button
              onClick={() => setIsAdminEditMode(!isAdminEditMode)}
              className="text-xs font-bold text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-800/60 border border-amber-500/40 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" /> {isAdminEditMode ? 'Done Editing' : 'Admin Edit Items'}
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Printable Order Pick Slip / QR Token Box */}
          {showPickSlip && (
            <div className="p-4 bg-white text-black rounded-xl shadow-lg border-2 border-emerald-500 flex flex-col md:flex-row items-center gap-4 justify-between animate-in fade-in duration-200">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                  Bhumivera Warehouse Packing Manifest Token
                </div>
                <div className="text-lg font-black tracking-tight">Order #{order.orderNumber}</div>
                <div className="text-xs text-slate-700">
                  Customer: <strong>{order.customerName}</strong> ({order.customerPhone})
                </div>
                <div className="text-xs text-slate-700">
                  Address: {order.city}, {order.state} - {order.pincode}
                </div>
                <div className="text-[11px] font-mono font-bold text-emerald-900 mt-1">
                  Expected Items: {orderItems.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                </div>
              </div>
              <div className="flex flex-col items-center shrink-0">
                {orderQrUrl ? (
                  <img src={orderQrUrl} alt="Order QR" className="w-32 h-32 object-contain border border-black p-1" />
                ) : (
                  <div className="w-32 h-32 border border-black flex items-center justify-center text-xs font-mono">Generating QR...</div>
                )}
                <div className="text-[10px] font-black font-mono tracking-wider mt-1 uppercase text-black">
                  ORD:{order.id}
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="mt-2 text-[10px] font-black bg-black text-white px-3 py-1 rounded shadow uppercase tracking-wider flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" /> Print Token Slip
                </button>
              </div>
            </div>
          )}

          {/* Admin Live Order Item Editor */}
          {isAdminEditMode && (
            <div className="p-4 bg-[#071711] border-2 border-amber-500/50 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4" /> Live Manifest Editor (Warehouse Admin Control)
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Add or remove items on the fly. The scanner immediately updates to accept newly added items.
                  </p>
                </div>
                <button
                  onClick={handleSaveAdminOrderItems}
                  disabled={savingOrder}
                  className="px-3.5 py-1.5 text-xs font-black uppercase bg-amber-500 hover:bg-amber-400 text-black rounded-lg flex items-center gap-1.5 shadow transition disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" /> {savingOrder ? 'Saving...' : 'Save & Sync Manifest'}
                </button>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                {editableItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-white/10 text-xs">
                    <div className="flex-1">
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">SKU: {item.sku || 'N/A'} • ₹{item.price}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleItemQtyChange(idx, -1)}
                          className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-0.5 font-mono font-bold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleItemQtyChange(idx, 1)}
                          className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Product Form */}
              <div className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
                <div className="text-[11px] font-bold text-amber-200 uppercase">Add Product to Order:</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Product Name (e.g. Gun / Face Wash)"
                    className="sm:col-span-2 px-2.5 py-1.5 bg-black/50 border border-white/20 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={newItemSku}
                    onChange={(e) => setNewItemSku(e.target.value)}
                    placeholder="SKU (e.g. BV-GUN-01)"
                    className="px-2.5 py-1.5 bg-black/50 border border-white/20 rounded-lg text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewItem}
                    disabled={!newItemName.trim()}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span>Verification Checklist Progress</span>
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
                Scan Item Barcode / QR Code (or paste code)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Barcode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="Scan product barcode (e.g. BV-LUX-CFW-01 or BV:...)..."
                    autoFocus
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none font-mono placeholder-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !barcodeInput.trim()}
                  className="px-5 py-2.5 text-xs font-black uppercase bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition disabled:opacity-50 shadow-md shrink-0"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          )}

          {/* MIS-PICK ALERT BANNER (High Visibility Red) */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-950/70 border-2 border-rose-500 rounded-xl text-xs text-rose-200 flex items-start gap-3 animate-bounce">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-black uppercase tracking-wider text-white">
                  ⛔ Mis-Pick Blocked: Item Not Allowed in Order
                </div>
                <div>{errorMsg}</div>
                {rejectedBarcode && (
                  <div className="text-[10px] font-mono text-rose-300">
                    Scanned: <span className="font-bold underline">{rejectedBarcode}</span> • Please pick items from the checklist below!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items Checklist */}
          <div className="border border-emerald-500/30 rounded-xl overflow-hidden divide-y divide-emerald-500/15 bg-[#071711]">
            <div className="p-2.5 bg-black/40 text-[11px] font-black uppercase tracking-wider text-emerald-400 flex justify-between">
              <span>Required Formulations Manifest</span>
              <span>Scanned / Target</span>
            </div>
            {orderItems.map((item, idx) => {
              const countVerified = verifiedItems[item.productId] || 0;
              const isItemDone = countVerified >= Number(item.quantity);

              return (
                <div
                  key={idx}
                  className={`p-3 text-xs flex items-center justify-between transition ${
                    isItemDone ? 'bg-emerald-950/40' : 'bg-[#071711]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{item.name}</span>
                      {isItemDone && (
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Complete
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono">
                      SKU: <strong className="text-emerald-300">{item.sku || 'N/A'}</strong> • HSN: {item.gstHsnCode || '30049011'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-white">
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

          {/* 100% Complete Banner */}
          {isComplete && (
            <div className="p-5 bg-gradient-to-r from-emerald-950/60 to-[#071711] border-2 border-emerald-500 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-black uppercase text-white">100% Items Verified &amp; Packed</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                All items for Order #{order.orderNumber} have been accurately verified. Zero dispatch error guaranteed. Ready to seal box and generate 4×6″ carrier label.
              </p>
              <button
                onClick={handleFinishPacking}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-xl transition"
              >
                <PackageCheck className="w-4 h-4" /> Seal Box &amp; Mark Order Packed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
