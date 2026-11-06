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
        i.barcode?.includes(q);
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

    // Resolve in items
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
      alert(`No product found matching barcode "${raw}"`);
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-150">
      {/* Left Column: Fast Barcode Input & Catalog Grid (7 Cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Barcode Scanner Input */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <form onSubmit={handleBarcodeSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Barcode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Scan EAN-13 Barcode or Type SKU (Enter to add)..."
                autoFocus
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              Add
            </button>
          </form>

          {scannerQueueCount > 0 && (
            <button
              onClick={onPullMobileScanner}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition shrink-0 animate-pulse"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              Pull Scanned ({scannerQueueCount})
            </button>
          )}
        </div>

        {/* Product Search & Category Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Filter catalog products..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
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
              className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="text-[10px] font-mono text-slate-400 truncate">{p.sku}</div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-2 mt-0.5">
                  {p.name}
                </h4>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-black text-slate-900">₹{p.price}</span>
                <span className="text-[10px] text-slate-500">{p.qty || p.physicalStock} in stock</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Active Cart & Checkout (5 Cols) */}
      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full min-h-[580px]">
        {/* Cart Header */}
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Active Register Bill</h3>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            {posCart.reduce((sum, i) => sum + i.q, 0)} Items
          </span>
        </div>

        {/* Customer Quick Lookup */}
        <div className="py-2.5 border-b border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <input
            type="text"
            value={posCustomerForm.name}
            onChange={(e) => setPosCustomerForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Shopper Name"
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
          />
          <input
            type="text"
            value={posCustomerForm.phone}
            onChange={(e) => setPosCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone Number"
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
          />
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 max-h-[260px]">
          {posCart.length > 0 ? (
            posCart.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex-1 mr-2">
                  <div className="font-bold text-slate-900 truncate">{item.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">
                    ₹{item.p} × {item.q}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateCartQty(idx, -1)}
                    className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold font-mono px-1 text-slate-900">{item.q}</span>
                  <button
                    onClick={() => updateCartQty(idx, 1)}
                    className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Cart is currently empty. Scan a product barcode to begin.
            </div>
          )}
        </div>

        {/* Payment Modes & Totals */}
        <div className="border-t border-slate-200 pt-3 space-y-3">
          {/* Payment Method Selector */}
          <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
            {['Cash', 'UPI', 'Card', 'NetBanking'].map((mode) => (
              <button
                key={mode}
                onClick={() => setPosPaymentMode(mode)}
                className={`py-2 rounded-xl border text-center transition ${
                  posPaymentMode === mode
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Dynamic UPI QR Code Preview */}
          {posPaymentMode === 'UPI' && upiQrDataUrl && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
              <img
                src={upiQrDataUrl}
                alt="Dynamic UPI QR"
                className="w-28 h-28 mx-auto rounded-lg shadow-sm"
              />
              <div className="text-[10px] text-slate-500 font-medium">
                Scan with any UPI App (GPay, PhonePe, Paytm) • Exact Amount ₹{totals.grandTotal}
              </div>
            </div>
          )}

          {/* Summary Breakdown */}
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono">₹{totals.subTotal}</span>
            </div>
            {totals.taxAmt > 0 && (
              <div className="flex justify-between">
                <span>GST ({posTaxRate}%)</span>
                <span className="font-mono">₹{totals.taxAmt}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>Grand Total</span>
              <span className="font-mono text-emerald-700">₹{totals.grandTotal}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={onCheckout}
            disabled={checkoutLoading || posCart.length === 0}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/30 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            {checkoutLoading ? 'Processing Checkout...' : `Collect ₹${totals.grandTotal} & Print Receipt`}
          </button>
        </div>
      </div>
    </div>
  );
}
