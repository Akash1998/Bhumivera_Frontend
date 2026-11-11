import React, { useMemo, useState } from 'react';
import { Minus, Plus, Printer, Search, ShoppingCart, Trash2 } from 'lucide-react';

export default function ManualPosTerminalView({
  items = [],
  posCart = [],
  setPosCart,
  onCheckout,
  onScanCode,
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
  operatorName,
}) {
  const [productSearch, setProductSearch] = useState('');
  const [scanCode, setScanCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = useMemo(() => (
    ['ALL', ...new Set(items.map(item => item.cat).filter(Boolean))]
  ), [items]);

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    return items.filter(item => {
      const matchesCategory = selectedCategory === 'ALL' || item.cat === selectedCategory;
      const matchesQuery = !query ||
        item.name?.toLowerCase().includes(query) ||
        item.sku?.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [items, productSearch, selectedCategory]);

  const totals = useMemo(() => {
    const subtotal = posCart.reduce((sum, item) => sum + Number(item.p) * Number(item.q), 0);
    const discount = Math.max(0, Number(posDiscount) || 0);
    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round((taxable * Math.max(0, Number(posTaxRate) || 0)) / 100);
    return { subtotal, discount, tax, total: taxable + tax };
  }, [posCart, posDiscount, posTaxRate]);

  const addToCart = product => {
    setPosCart(previous => {
      const index = previous.findIndex(item => item.id === product.id || item.sku === product.sku);
      if (index >= 0) {
        const next = [...previous];
        if (product.serialNumber && next[index].serialNumbers?.includes(product.serialNumber)) return previous;
        next[index] = { ...next[index], q: next[index].q + 1 };
        if (product.serialNumber) {
          next[index] = { ...next[index], serialNumbers: [...(next[index].serialNumbers || []), product.serialNumber] };
        }
        return next;
      }
      return [...previous, {
        id: product.id,
        productId: product.productId,
        sku: product.sku,
        name: product.name,
        q: 1,
        p: Number(product.price) || Number(product.sellingPrice) || 0,
        uom: product.uom || 'Pcs',
        gstHsnCode: product.gstHsnCode || '30049011',
        gstRate: product.gstRate || 5,
        serialNumbers: product.serialNumber ? [product.serialNumber] : [],
      }];
    });
  };

  const submitScannedCode = () => {
    const code = scanCode.trim();
    if (!code || !onScanCode) return;
    setScanCode('');
    onScanCode(code);
  };

  const updateQuantity = (index, delta) => {
    setPosCart(previous => {
      const next = [...previous];
      const quantity = next[index].q + delta;
      if (quantity <= 0) return next.filter((_, itemIndex) => itemIndex !== index);
      next[index] = { ...next[index], q: quantity };
      return next;
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
      <section className="space-y-4">
        <div className="rounded-2xl border border-emerald-500/30 bg-[#0c261b] p-4">
          <label className="block text-xs font-bold text-emerald-200" htmlFor="pos-item-qr">
            Scan an individual item QR / barcode
          </label>
          <input
            id="pos-item-qr"
            value={scanCode}
            onChange={event => setScanCode(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
                submitScannedCode();
              }
            }}
            placeholder="Scan or enter code, then press Enter"
            className="mt-2 min-h-11 w-full rounded-xl border border-emerald-500/40 bg-[#071711] px-3 text-sm text-white outline-none focus:border-emerald-300"
            autoComplete="off"
          />
          <p className="mt-2 text-[10px] text-slate-400">Unique item codes resolve to their registered product and can only be sold once.</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-[#0c261b] p-4">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
            <input
              value={productSearch}
              onChange={event => setProductSearch(event.target.value)}
              placeholder="Find a product by name or SKU"
              className="min-h-11 w-full rounded-xl border border-emerald-500/40 bg-[#071711] pl-9 pr-3 text-sm text-white outline-none focus:border-emerald-300"
            />
          </label>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.map(category => (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold ${
                  selectedCategory === category ? 'bg-emerald-500 text-emerald-950' : 'border border-white/10 bg-black/10 text-slate-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid max-h-[68vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
          {filteredProducts.map(product => {
            const available = Number(product.availableStock ?? product.qty ?? product.physicalStock ?? 0);
            return (
              <button
                type="button"
                key={product.id}
                disabled={available <= 0}
                onClick={() => addToCart(product)}
                className="flex min-h-32 flex-col justify-between rounded-xl border border-emerald-500/25 bg-[#0c261b] p-3 text-left transition hover:border-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span>
                  <span className="block truncate font-mono text-[10px] text-emerald-300">{product.sku}</span>
                  <span className="mt-1 line-clamp-2 block text-sm font-bold text-white">{product.name}</span>
                </span>
                <span className="mt-3 flex items-center justify-between gap-2">
                  <strong className="text-sm text-white">₹{Number(product.price) || Number(product.sellingPrice) || 0}</strong>
                  <span className="text-[10px] text-slate-400">{available} in stock</span>
                </span>
              </button>
            );
          })}
          {filteredProducts.length === 0 && <p className="col-span-full rounded-xl bg-[#0c261b] p-6 text-center text-sm text-slate-400">No matching products.</p>}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-emerald-500/30 bg-[#0c261b] p-4 text-white shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-emerald-300" size={18} />
            <h2 className="font-black">Manual Retail Bill</h2>
          </div>
          <span className="text-[10px] text-slate-400">Cashier: {operatorName}</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-300">Customer name
            <input value={posCustomerForm.name} onChange={event => setPosCustomerForm(previous => ({ ...previous, name: event.target.value }))} className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white outline-none focus:border-emerald-400" />
          </label>
          <label className="text-xs font-semibold text-slate-300">Phone number
            <input type="tel" value={posCustomerForm.phone} onChange={event => setPosCustomerForm(previous => ({ ...previous, phone: event.target.value }))} className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#071711] px-3 text-sm text-white outline-none focus:border-emerald-400" />
          </label>
          <label className="text-xs font-semibold text-slate-300 sm:col-span-2">Customer address
            <textarea rows={2} value={posCustomerForm.address || ''} onChange={event => setPosCustomerForm(previous => ({ ...previous, address: event.target.value }))} className="mt-1.5 w-full resize-y rounded-lg border border-white/10 bg-[#071711] px-3 py-2 text-sm text-white outline-none focus:border-emerald-400" />
          </label>
        </div>

        <div className="max-h-56 space-y-2 overflow-y-auto">
          {posCart.map((item, index) => (
            <div key={`${item.id}-${item.sku}`} className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/10 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{item.name}</p>
                <p className="font-mono text-[10px] text-slate-400">₹{item.p} × {item.q}</p>
                {item.serialNumbers?.length > 0 && <p className="mt-1 break-all font-mono text-[9px] text-emerald-300">Item codes: {item.serialNumbers.join(', ')}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button type="button" aria-label={`Decrease ${item.name}`} onClick={() => updateQuantity(index, -1)} className="rounded-md border border-white/10 p-1.5"><Minus size={13} /></button>
                <span className="min-w-5 text-center font-mono text-xs">{item.q}</span>
                <button type="button" aria-label={`Increase ${item.name}`} onClick={() => updateQuantity(index, 1)} className="rounded-md border border-white/10 p-1.5"><Plus size={13} /></button>
                <button type="button" aria-label={`Remove ${item.name}`} onClick={() => setPosCart(previous => previous.filter((_, itemIndex) => itemIndex !== index))} className="p-1.5 text-rose-300"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {posCart.length === 0 && <p className="py-5 text-center text-xs text-slate-400">Choose items from the product list to create a bill.</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-slate-300">Discount (₹)
            <input type="number" min="0" value={posDiscount} onChange={event => setPosDiscount(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-[#071711] px-3 py-2 text-sm text-white" />
          </label>
          <label className="text-xs text-slate-300">Paid amount (₹)
            <input type="number" min="0" value={posPaidAmount} onChange={event => setPosPaidAmount(event.target.value)} placeholder={String(totals.total)} className="mt-1 w-full rounded-lg border border-white/10 bg-[#071711] px-3 py-2 text-sm text-white" />
          </label>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-[11px]">
          {['Cash', 'UPI', 'Card', 'NetBanking'].map(mode => (
            <button type="button" key={mode} onClick={() => setPosPaymentMode(mode)} className={`rounded-lg border py-2 font-bold ${posPaymentMode === mode ? 'border-emerald-300 bg-emerald-500 text-emerald-950' : 'border-white/10 text-slate-300'}`}>{mode}</button>
          ))}
        </div>
        {posPaymentMode === 'UPI' && upiQrDataUrl && <img src={upiQrDataUrl} alt="UPI payment QR" className="mx-auto h-28 w-28 rounded-lg border border-emerald-400/40" />}

        <div className="space-y-1 border-t border-white/10 pt-3 text-xs">
          <div className="flex justify-between text-slate-300"><span>Subtotal</span><span>₹{totals.subtotal}</span></div>
          {totals.tax > 0 && <div className="flex justify-between text-slate-300"><span>GST ({posTaxRate}%)</span><span>₹{totals.tax}</span></div>}
          <div className="flex justify-between text-base font-black"><span>Total</span><span className="text-emerald-300">₹{totals.total}</span></div>
        </div>
        <button type="button" onClick={onCheckout} disabled={checkoutLoading || posCart.length === 0} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 font-black text-emerald-950 disabled:opacity-50">
          <Printer size={17} /> {checkoutLoading ? 'Generating bill…' : 'Generate bill & receipt'}
        </button>
        <p className="text-center text-[10px] leading-4 text-slate-500">Manual walk-in billing only. Scanner, order fulfillment, paused bills, and drafts are separate from this register.</p>
      </section>
    </div>
  );
}
