import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { AlertCircle, Printer, X } from 'lucide-react';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
})[character]);

export default function FulfillmentOrderQrModal({ order, onClose }) {
  const [qrUrl, setQrUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!order?.id) return undefined;
    let active = true;
    QRCode.toDataURL(`ORD:${order.id}`, { width: 240, margin: 2, errorCorrectionLevel: 'M' })
      .then(url => {
        if (active) setQrUrl(url);
      })
      .catch(generationError => {
        if (active) setError(generationError.message || 'Could not generate the fulfillment QR.');
      });
    return () => {
      active = false;
    };
  }, [order?.id]);

  const printSlip = () => {
    if (!qrUrl) return;
    const printWindow = window.open('', '_blank', 'width=800,height=700');
    if (!printWindow) {
      setError('Allow pop-ups to print the order bill and fulfillment QR.');
      return;
    }
    const address = order.fullFormattedAddress || order.shippingAddress ||
      [order.line1, order.line2, order.landmark, order.city, order.state, order.pincode].filter(Boolean).join(', ');
    const items = (order.items || []).map(item => `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.sku || '')}</td>
        <td>${Number(item.quantity) || 1}</td>
        <td>₹${(Number(item.price) || 0).toFixed(2)}</td>
      </tr>
    `).join('');
    printWindow.document.write(`
      <!doctype html>
      <html><head><title>Order ${escapeHtml(order.orderNumber || order.id)}</title>
        <style>
          *{box-sizing:border-box}body{font:14px Arial,sans-serif;color:#111;margin:24px auto;max-width:760px;padding:0 24px}
          header{border-bottom:2px solid #166534;padding-bottom:12px;margin-bottom:16px}
          .layout{display:flex;justify-content:space-between;gap:20px}.details{line-height:1.6}.qr{text-align:center}
          .qr img{width:160px;height:160px}table{border-collapse:collapse;width:100%;margin-top:20px}
          th,td{border-bottom:1px solid #cbd5e1;padding:8px;text-align:left}th{background:#f1f5f9}
          .total{text-align:right;font-size:18px;font-weight:bold;margin-top:14px}
          @media print{body{margin:0;max-width:none}}
        </style>
      </head><body>
        <header><h1>Bhumivera · Order Bill &amp; Fulfillment Slip</h1><strong>Order #${escapeHtml(order.orderNumber || order.id)}</strong></header>
        <div class="layout">
          <div class="details"><strong>${escapeHtml(order.customerName || 'Customer')}</strong><br/>
            ${escapeHtml(order.customerPhone || '')}<br/>${escapeHtml(address || '')}
          </div>
          <div class="qr"><img src="${qrUrl}" alt="Fulfillment QR"/><div><strong>ORD:${escapeHtml(order.id)}</strong></div></div>
        </div>
        <table><thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Price</th></tr></thead><tbody>${items}</tbody></table>
        <div class="total">Total: ₹${Number(order.total ?? order.totalAmount) || 0}</div>
        <script>window.print()</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="fulfillment-qr-title" className="w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-[#0c261b] p-5 text-white shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 id="fulfillment-qr-title" className="font-black">Order #{order.orderNumber || order.id}</h2>
            <p className="text-xs text-slate-400">Print this slip for the PWA packer. The QR contains only the order reference.</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-lg p-2 text-slate-300 hover:bg-white/10"><X size={18} /></button>
        </div>
        {error && <p role="alert" className="mb-3 flex items-center gap-2 rounded-lg bg-rose-400/10 p-3 text-xs text-rose-100"><AlertCircle size={15} />{error}</p>}
        {qrUrl ? (
          <div className="flex flex-col items-center rounded-xl bg-white p-4 text-slate-900">
            <img src={qrUrl} alt={`Fulfillment QR for order ${order.orderNumber || order.id}`} className="h-52 w-52" />
            <strong className="font-mono">ORD:{order.id}</strong>
          </div>
        ) : <p className="py-10 text-center text-sm text-slate-300">Generating order QR…</p>}
        <button type="button" disabled={!qrUrl} onClick={printSlip} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 font-black text-emerald-950 disabled:opacity-50">
          <Printer size={16} /> Print order bill &amp; fulfillment QR
        </button>
      </section>
    </div>
  );
}
