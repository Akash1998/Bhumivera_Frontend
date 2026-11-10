import React, { useState, useMemo, useEffect } from 'react';
import {
  Barcode,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  QrCode,
  Wallet,
  Receipt,
  UserCheck,
  CheckCircle2,
  Printer,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function PosTerminalView({
  items = [],
  posCart = [],
  setPosCart,
  onCheckout,
  checkoutLoading,
  upiQrDataUrl,
  posPaymentMode,
  setPosPaymentMode,
  posPaidAmount,
  setPosPaidAmount,
  posCustomerForm,
  setPosCustomerForm,
  posDiscount,
  setPosDiscount,
  posTaxRate,
  onPullMobileScanner,
  scannerQueueCount = 0,
}) {
  const [scanInput, setScanInput] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.cat).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [items]);

  // Filtered catalog products for POS grid
  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    return items.filter(i => {
      const matchCat = selectedCategory === 'ALL' || i.cat === selectedCategory;
      const matchQ =
        !q ||
        i.name?.toLowerCase().includes(q) ||
        i.sku?.toLowerCase().includes(q) ||
        i.barcode?.includes(q) ||
        i.gstHsnCode?.includes(q);
      return matchCat && matchQ;
    });
  }, [items, productSearch, selectedCategory]);

  // Cart Totals
  const totals = useMemo(() => {
    const subTotal = posCart.reduce((sum, item) => sum + Number(item.p) * Number(item.q), 0);
    const disc = Math.max(0, Number(posDiscount) || 0);
    const taxable = Math.max(0, subTotal - disc);
    const rate = Math.max(0, Number(posTaxRate) || 0);
    const taxAmt = Math.round((taxable * rate) / 100);
    const grandTotal = taxable + taxAmt;
    return { subTotal, disc, taxable, taxAmt, grandTotal };
  }, [posCart, posDiscount, posTaxRate]);

  // Barcode Scan Handler
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const raw = scanInput.trim();
    if (!raw) return;

    const matched = items.find(
      i =>
        i.barcode === raw ||
        i.sku?.toLowerCase() === raw.toLowerCase() ||
        i.qrCodePayload?.includes(raw)
    );

    if (matched) {
      addToCart(matched);
      setScanInput('');
    } else {
      alert(`No formulation found matching code "${raw}"`);
    }
  };

  const addToCart = (product) => {
    setPosCart(prev => {
      const idx = prev.findIndex(c => c.id === product.id || c.sku === product.sku);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], q: next[idx].q + 1 };
        return next;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            productId: product.productId,
            sku: product.sku,
            name: product.name,
            q: 1,
            p: Number(product.price) || Number(product.sellingPrice) || 0,
            uom: product.uom || 'Pcs',
            gstHsnCode: product.gstHsnCode || '30049011',
            gstRate: product.gstRate || 5,
          },
        ];
      }
    });
  };

  const updateCartQty = (idx, delta) => {
    setPosCart(prev => {
      const next = [...prev];
      const newQty = next[idx].q + delta;
      if (newQty <= 0) {
        return next.filter((_, i) => i !== idx);
      }
      next[idx] = { ...next[idx], q: newQty };
      return next;
    });
  };

  const removeFromCart = (idx) => {
    setPosCart(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-150 w-full max-w-full overflow-x-hidden">
      {/* Left Column: Fast Barcode Input & Catalog Grid (7 Cols) */}
      <div className="lg:col-span-7 space-y-4 min-w-0">
        {/* Barcode Scanner Input */}
        <div className="bg-[#0c261b] p-4 rounded-2xl border border-emerald-500/30 shadow-lg flex items-center gap-3">
          <form onSubmit={handleBarcodeSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Barcode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Scan EAN-13 Barcode or Type SKU (Enter to add)..."
                autoFocus
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none font-mono placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl transition shadow-sm"
            >
              Add Item
            </button>
          </form>

          {scannerQueueCount > 0 && (
            <button
              onClick={onPullMobileScanner}
              className="px-3 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold shrink-0 hover:bg-amber-500/30 transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Pull Scanned ({scannerQueueCount})
            </button>
          )}
        </div>

        {/* Catalog Search & Filter Tabs */}
        <div className="bg-[#0c261b] p-3 rounded-2xl border border-emerald-500/30 shadow-lg space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search formulations by name, SKU, or HSN (30049011)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#071711] text-white border border-emerald-500/40 rounded-xl focus:border-emerald-400 focus:outline-none placeholder-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-[11px] whitespace-nowrap font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                    : 'bg-[#071711] text-slate-300 hover:text-white hover:bg-emerald-950/50 border border-emerald-500/25'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto pr-1">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              className="bg-[#0c261b] p-3.5 rounded-xl border border-emerald-500/30 shadow-sm hover:border-emerald-400 hover:shadow-emerald-950/40 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300">
                  <span className="truncate">{p.sku}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    HSN:{p.gstHsnCode || '30049011'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition line-clamp-2 mt-1">
                  {p.name}
                </h4>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-emerald-500/20">
                <span className="text-sm font-black text-white font-mono">₹{p.price}</span>
                <span className="text-[10px] text-slate-300 font-medium">{p.qty || p.physicalStock} in stock</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Active Cart & Checkout (5 Cols) */}
      <div className="lg:col-span-5 bg-[#0c261b] p-5 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col justify-between h-full min-h-[580px]">
        {/* Cart Header */}
        <div className="border-b border-emerald-500/20 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Active Register Bill</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
            {posCart.reduce((sum, i) => sum + i.q, 0)} Items
          </span>
        </div>

        {/* Customer Quick Lookup */}
        <div className="py-2.5 border-b border-emerald-500/20 grid grid-cols-2 gap-2 text-xs">
          <input
            type="text"
            value={posCustomerForm.name}
            onChange={(e) => setPosCustomerForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Shopper Name"
            className="px-2.5 py-1.5 bg-[#071711] text-white border border-emerald-500/40 rounded-lg text-xs placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
          />
          <input
            type="text"
            value={posCustomerForm.phone}
            onChange={(e) => setPosCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone Number"
            className="px-2.5 py-1.5 bg-[#071711] text-white border border-emerald-500/40 rounded-lg text-xs font-mono placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 max-h-[260px]">
          {posCart.length > 0 ? (
            posCart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#071711] border border-emerald-500/30 text-xs"
              >
                <div className="flex-1 mr-2 min-w-0">
                  <div className="font-bold text-white truncate">{item.name}</div>
                  <div className="text-[10px] font-mono text-emerald-300 flex items-center gap-2 mt-0.5">
                    <span>₹{item.p} × {item.q}</span>
                    <span className="text-slate-400">|</span>
                    <span className="bg-emerald-500/15 px-1 py-0.2 rounded text-[9px] text-emerald-400 font-bold">
                      HSN: {item.gstHsnCode || '30049011'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateCartQty(idx, -1)}
                    className="p-1 rounded bg-[#0c261b] border border-emerald-500/40 hover:bg-emerald-900/40 text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-black font-mono px-1.5 text-white">{item.q}</span>
                  <button
                    onClick={() => updateCartQty(idx, 1)}
                    className="p-1 rounded bg-[#0c261b] border border-emerald-500/40 hover:bg-emerald-900/40 text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(idx)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Cart is currently empty. Scan or tap a formulation to add.
            </div>
          )}
        </div>

        {/* Payment Modes & Totals */}
        <div className="border-t border-emerald-500/20 pt-3 space-y-3">
          {/* Payment Method Selector */}
          <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
            {['Cash', 'UPI', 'Card', 'NetBanking'].map((mode) => (
              <button
                key={mode}
                onClick={() => setPosPaymentMode(mode)}
                className={`py-2 rounded-xl border text-center transition font-bold ${
                  posPaymentMode === mode
                    ? 'border-emerald-400 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                    : 'border-emerald-500/30 bg-[#071711] text-slate-300 hover:text-white hover:bg-emerald-950/40'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Quick Cash Tender Chips */}
          {posPaymentMode === 'Cash' && totals.grandTotal > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-[10px] text-emerald-300 font-bold uppercase">Quick Cash:</span>
              <button
                type="button"
                onClick={() => setPosPaidAmount(String(totals.grandTotal))}
                className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold hover:bg-emerald-500/30"
              >
                Exact ₹{totals.grandTotal}
              </button>
              {[500, 1000, 2000].filter(a => a >= totals.grandTotal).map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setPosPaidAmount(String(amt))}
                  className="px-2 py-0.5 rounded bg-[#071711] text-white border border-emerald-500/30 text-[10px] font-mono hover:bg-emerald-950/40"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          )}

          {/* Dynamic UPI QR Code Preview */}
          {posPaymentMode === 'UPI' && upiQrDataUrl && (
            <div className="bg-[#071711] border border-emerald-500/30 rounded-xl p-3 text-center space-y-1.5">
              <img
                src={upiQrDataUrl}
                alt="Dynamic UPI QR"
                className="w-28 h-28 mx-auto rounded-lg shadow-md border-2 border-emerald-400/50"
              />
              <div className="text-[10px] text-emerald-300 font-bold">
                Scan with GPay / PhonePe / Paytm • Exact Amount ₹{totals.grandTotal}
              </div>
            </div>
          )}

          {/* Summary Breakdown */}
          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white">₹{totals.subTotal}</span>
            </div>
            {totals.taxAmt > 0 && (
              <div className="flex justify-between">
                <span>GST ({posTaxRate}%)</span>
                <span className="font-mono text-white">₹{totals.taxAmt}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-white pt-1.5 border-t border-emerald-500/20">
              <span>Grand Total</span>
              <span className="font-mono text-emerald-400 text-lg">₹{totals.grandTotal}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={onCheckout}
            disabled={checkoutLoading || posCart.length === 0}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black uppercase tracking-wider rounded-xl transition shadow-xl shadow-emerald-950/60 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            {checkoutLoading ? 'Processing Checkout...' : `Collect ₹${totals.grandTotal} & Print Receipt`}
          </button>
        </div>
      </div>
    </div>
  );
}
