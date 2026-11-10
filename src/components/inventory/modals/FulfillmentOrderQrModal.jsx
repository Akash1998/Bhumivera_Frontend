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

const currency = value => `₹${(Number(value) || 0).toLocaleString('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

const amountInIndianWords = amount => {
  const belowTwenty = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensWords = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const underThousand = number => {
    const value = Math.floor(number);
    const parts = [];
    if (value >= 100) parts.push(`${belowTwenty[Math.floor(value / 100)]} Hundred`);
    const remainder = value % 100;
    if (remainder >= 20) parts.push(`${tensWords[Math.floor(remainder / 10)]}${remainder % 10 ? ` ${belowTwenty[remainder % 10]}` : ''}`);
    else if (remainder > 0) parts.push(belowTwenty[remainder]);
    return parts.join(' ');
  };
  let rupees = Math.max(0, Math.floor(Number(amount) || 0));
  const paise = Math.round(((Number(amount) || 0) - rupees) * 100);
  const groups = [
    [10000000, 'Crore'],
    [100000, 'Lakh'],
    [1000, 'Thousand'],
    [1, ''],
  ];
  const words = [];
  groups.forEach(([divisor, label]) => {
    if (rupees >= divisor) {
      const count = Math.floor(rupees / divisor);
      rupees %= divisor;
      words.push(`${underThousand(count)}${label ? ` ${label}` : ''}`);
    }
  });
  return `${words.join(' ') || 'Zero'} Rupees${paise ? ` and ${underThousand(paise)} Paise` : ''} Only`;
};

const encodeOrderManifest = order => {
  const manifest = [
    2,
    order.id,
    order.orderNumber || String(order.id),
    order.status || 'pending',
    order.customerName || 'Customer',
    (order.items || []).map(item => [
      item.id || item.orderItemId,
      item.name || 'Product',
      item.sku || '',
      item.barcode || item.sku || '',
      Number(item.quantity) || 1,
    ]),
  ];
  const bytes = new TextEncoder().encode(JSON.stringify(manifest));
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return `BV-PWA2:${btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')}`;
};

const buildInvoiceRows = order => {
  const items = Array.isArray(order.items) ? order.items : [];
  const rawNetTotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const itemNetTotal = Math.max(0, (Number(order.total ?? order.totalAmount) || 0) - (Number(order.shippingCost) || 0));
  const allocation = rawNetTotal > 0 ? itemNetTotal / rawNetTotal : 1;
  return items.map(item => {
    const quantity = Number(item.quantity) || 1;
    const mrp = Number(item.mrp) || Number(item.price) || 0;
    const net = (Number(item.price) || 0) * quantity * allocation;
    const rate = Number(item.gstRate) || 5;
    const taxable = net / (1 + rate / 100);
    const tax = net - taxable;
    return {
      ...item,
      quantity,
      mrpTotal: mrp * quantity,
      discount: Math.max(0, mrp * quantity - net),
      taxable,
      rate,
      tax,
      net,
    };
  });
};

export default function FulfillmentOrderQrModal({ order, storeConfig = {}, onClose }) {
  const [qrUrl, setQrUrl] = useState('');
  const [paymentQrUrl, setPaymentQrUrl] = useState('');
  const [error, setError] = useState('');
  const canPrintInvoice = ['shipped', 'out_for_delivery', 'delivered'].includes(String(order?.status || '').toLowerCase()) &&
    Boolean(order?.courier && order?.trackingNumber && order?.trackingUrl);

  useEffect(() => {
    if (!order?.id) return undefined;
    let active = true;
    setError('');
    const total = Number(order.total ?? order.totalAmount) || 0;
    const upiId = String(storeConfig.upiId || '').trim();
    const paymentPayload = upiId
      ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(storeConfig.storeName || 'Bhumivera')}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Invoice ${order.invoiceNumber || order.orderNumber || order.id}`)}`
      : `https://bhumivera.com/verify?order=${encodeURIComponent(order.orderNumber || order.id)}`;
    Promise.all([
      QRCode.toDataURL(encodeOrderManifest(order), { width: 1080, margin: 4, errorCorrectionLevel: 'M' }),
      QRCode.toDataURL(paymentPayload, { width: 600, margin: 4, errorCorrectionLevel: 'M' }),
    ]).then(([manifestUrl, payUrl]) => {
      if (active) {
        setQrUrl(manifestUrl);
        setPaymentQrUrl(payUrl);
      }
    }).catch(generationError => {
      if (active) setError(generationError.message || 'Could not generate the invoice QR codes.');
    });
    return () => {
      active = false;
    };
  }, [order, storeConfig.storeName, storeConfig.upiId]);

  const printSlip = () => {
    if (!qrUrl || !paymentQrUrl) return;
    if (!canPrintInvoice) {
      setError('Printing is available after the courier, tracking/AWB number, and tracking link are saved on the shipped order.');
      return;
    }
    const printWindow = window.open('', '_blank', 'width=900,height=900');
    if (!printWindow) {
      setError('Allow pop-ups to print the tax invoice and fulfillment QR.');
      return;
    }

    const address = order.fullFormattedAddress || order.shippingAddress ||
      [order.line1, order.line2, order.landmark, order.city, order.state, order.pincode].filter(Boolean).join(', ');
    const rows = buildInvoiceRows(order);
    const isIntraState = !order.state || /west bengal|wb/i.test(order.state);
    const hsnTotals = new Map();
    rows.forEach(row => {
      const hsn = row.gstHsnCode || '30049011';
      const current = hsnTotals.get(hsn) || { taxable: 0, tax: 0, rate: row.rate };
      current.taxable += row.taxable;
      current.tax += row.tax;
      hsnTotals.set(hsn, current);
    });
    const rowsHtml = rows.map((item, index) => `
      <tr>
        <td class="center">${index + 1}</td>
        <td><strong>${escapeHtml(item.name)}</strong><small>SKU: ${escapeHtml(item.sku || '-')}</small></td>
        <td class="center">${escapeHtml(item.gstHsnCode || '30049011')}</td>
        <td class="center">${item.quantity}</td>
        <td class="num">${currency(item.mrpTotal)}</td>
        <td class="num">${currency(item.discount)}</td>
        <td class="num">${currency(item.taxable)}</td>
        <td class="center">${item.rate}%</td>
        <td class="num">${currency(item.tax)}</td>
        <td class="num">${currency(item.net)}</td>
      </tr>
    `).join('');
    const hsnHtml = [...hsnTotals.entries()].map(([hsn, values]) => `
      <tr><td>${escapeHtml(hsn)}</td><td class="num">${currency(values.taxable)}</td><td class="center">${values.rate}%</td>
      ${isIntraState
        ? `<td class="num">${currency(values.tax / 2)}</td><td class="num">${currency(values.tax / 2)}</td>`
        : `<td class="num">${currency(values.tax)}</td>`}
      <td class="num">${currency(values.tax)}</td></tr>
    `).join('');
    const mrpTotal = rows.reduce((sum, item) => sum + item.mrpTotal, 0);
    const discountTotal = rows.reduce((sum, item) => sum + item.discount, 0);
    const taxableTotal = rows.reduce((sum, item) => sum + item.taxable, 0);
    const taxTotal = rows.reduce((sum, item) => sum + item.tax, 0);
    const shipping = Number(order.shippingCost) || 0;
    const total = Number(order.total ?? order.totalAmount) || 0;
    const roundOff = Number((total - taxableTotal - taxTotal - shipping).toFixed(2));
    const invoiceDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
      : new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    const sellerName = storeConfig.storeName || 'Bhumivera Organics India Private Limited';
    const sellerAddress = storeConfig.address || 'G.T. Road, Gopalpur, Asansol, West Bengal - 713304, India';
    const sellerPhone = storeConfig.phone || '';
    const sellerEmail = storeConfig.email || 'billing@bhumivera.com';
    const gstin = storeConfig.gstin || '';

    printWindow.document.write(`
      <!doctype html>
      <html><head><title>Tax Invoice ${escapeHtml(order.invoiceNumber || order.orderNumber || order.id)}</title>
        <style>
          *{box-sizing:border-box}body{font:10px Arial,sans-serif;color:#17221e;margin:0;padding:18px;max-width:100%;overflow-x:hidden}
          .sheet{width:100%;max-width:900px;margin:auto;border:1px solid #87958f;padding:18px;overflow:hidden}
          .head{display:grid;grid-template-columns:1fr 175px;gap:14px;border-bottom:2px solid #234f3d;padding-bottom:12px}
          .brand{display:flex;gap:12px;align-items:center}.brand img{width:62px;height:62px;object-fit:contain}
          h1{font-size:21px;letter-spacing:1.5px;color:#234f3d;margin:0 0 4px}.muted{color:#5d6a64;line-height:1.5}
          .title{text-align:right}.title h2{font-size:16px;margin:4px 0;color:#17221e}.title strong{font-size:11px}
          .two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin:12px 0}
          .box{border:1px solid #c3cdc8;padding:8px;line-height:1.5}.box h3{margin:0 0 4px;font-size:10px;text-transform:uppercase;color:#234f3d}
          table{width:100%;max-width:100%;table-layout:fixed;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #abb8b1;padding:5px 4px;vertical-align:top;overflow-wrap:anywhere}
          th{background:#e8efeb;font-size:8px;text-transform:uppercase}.center{text-align:center}.num{text-align:right;white-space:nowrap}
          small{display:block;color:#66736c;margin-top:3px}.bottom{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,255px);gap:14px;margin-top:8px}
          .amount{text-align:right;font-size:12px;font-weight:bold}.amount .grand{font-size:16px;color:#234f3d;border-top:2px solid #234f3d;padding-top:7px;margin-top:6px}
          .qrbox{display:flex;min-width:0;align-items:center;gap:12px;border:1px solid #c3cdc8;padding:8px;margin-top:10px;overflow:hidden}.qrbox img{flex:none;width:140px;height:140px;object-fit:contain;image-rendering:pixelated}.qrbox span{min-width:0;overflow-wrap:anywhere}
          .qrbox.pack img{width:240px;height:240px}.foot{border-top:1px solid #abb8b1;margin-top:14px;padding-top:9px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;line-height:1.5}
          .sign{text-align:right;padding-top:25px}.note{font-size:8px;color:#5d6a64;margin-top:8px}
          @media(max-width:680px){body{padding:8px}.sheet{padding:10px}.head,.two,.bottom,.foot{grid-template-columns:minmax(0,1fr)}.title{text-align:left}.bottom .amount{text-align:left}.qrbox.pack img{width:200px;height:200px}table{font-size:7px}th,td{padding:3px 2px;word-break:break-word}}
          @media print{body{padding:0}.sheet{border:0;max-width:none;padding:8mm}.qrbox.pack{break-inside:avoid}.qrbox.pack img{width:240px;height:240px}button{display:none}}
        </style>
      </head><body><main class="sheet">
        <header class="head">
          <div class="brand"><img src="${window.location.origin}/assets/bhumivera-luxury-crest-logo.webp" alt="Bhumivera"/>
            <div><h1>BHUMIVERA</h1><strong>${escapeHtml(sellerName)}</strong><div class="muted">${escapeHtml(sellerAddress)}<br/>${escapeHtml(sellerPhone)} · ${escapeHtml(sellerEmail)}<br/>GSTIN: <strong>${escapeHtml(gstin || 'Not configured')}</strong></div></div>
          </div>
          <div class="title"><h2>TAX INVOICE</h2><div>Invoice No.</div><strong>${escapeHtml(order.invoiceNumber || `BV/${order.id}`)}</strong><div style="margin-top:5px">Invoice Date: ${escapeHtml(invoiceDate)}</div><div>Payment: ${escapeHtml(order.paymentMode || 'Online')} · ${escapeHtml(order.paymentStatus || 'pending')}</div></div>
        </header>
        <section class="two">
          <div class="box"><h3>Bill To</h3><strong>${escapeHtml(order.customerName || 'Customer')}</strong><br/>${escapeHtml(order.customerPhone || '')}<br/>${escapeHtml(order.customerEmail || '')}</div>
          <div class="box"><h3>Ship To</h3>${escapeHtml(address || 'Address not provided')}<br/>${escapeHtml(order.customerPhone || '')}</div>
        </section>
        <table><thead><tr><th>#</th><th>Description</th><th>HSN/SAC</th><th>Qty</th><th>MRP</th><th>Discount</th><th>Taxable</th><th>GST</th><th>Tax Amt</th><th>Amount</th></tr></thead><tbody>${rowsHtml}</tbody></table>
        <div class="bottom">
          <div>
            <strong>GST Summary by HSN</strong>
            <table><thead><tr><th>HSN</th><th>Taxable</th><th>Rate</th>${isIntraState ? '<th>CGST</th><th>SGST</th>' : '<th>IGST</th>'}<th>Total Tax</th></tr></thead><tbody>${hsnHtml}</tbody></table>
            <div class="note">${isIntraState ? 'Intra-state supply: CGST and SGST apply.' : 'Inter-state supply: IGST applies.'} Goods once sold are subject to applicable return and consumer protection policies.</div>
          </div>
          <div class="box amount">
            <div>Total MRP: ${currency(mrpTotal)}</div><div>Discount: -${currency(discountTotal)}</div>
            <div>Taxable Value: ${currency(taxableTotal)}</div><div>${isIntraState ? 'CGST + SGST' : 'IGST'}: ${currency(taxTotal)}</div>
            <div>Shipping: ${currency(shipping)}</div><div>Round Off: ${currency(roundOff)}</div>
            <div class="grand">Invoice Total: ${currency(total)}</div><div>Amount in words: ${escapeHtml(amountInIndianWords(total))}</div><div>Amount received / payable as per payment mode</div>
            <div class="qrbox"><img src="${paymentQrUrl}" alt="Payment or order verification QR"/><span><strong>SCAN TO PAY / VERIFY</strong><br/>UPI: ${escapeHtml(storeConfig.upiId || 'Not configured')}<br/>Order: ${escapeHtml(order.orderNumber || order.id)}</span></div>
          </div>
        </div>
        <div class="qrbox pack"><img src="${qrUrl}" alt="Self-contained fulfillment QR"/><span><strong>FULFILLMENT QR</strong><br/>Scan in Bhumivera PWA. Contains the order manifest for local packing; inventory is updated only when the packer uploads.</span></div>
        <footer class="foot"><div><strong>Declaration</strong><br/>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.<div class="note">This is a computer-generated invoice. Please retain it for your records.</div></div><div class="sign">For ${escapeHtml(sellerName)}<br/><br/><strong>Authorised Signatory</strong></div></footer>
      </main><script>window.print()</script></body></html>
    `);
    printWindow.document.close();
  };

  const qrPayloadLength = (() => {
    try { return encodeOrderManifest(order).length; } catch { return 0; }
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="fulfillment-qr-title" className="w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-[#0c261b] p-5 text-white shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 id="fulfillment-qr-title" className="font-black">Tax Invoice · {order.invoiceNumber || order.orderNumber || order.id}</h2>
            <p className="text-xs text-slate-400">Compact packing QR with order and item codes; scanning it does not fetch from SQL.</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-lg p-2 text-slate-300 hover:bg-white/10"><X size={18} /></button>
        </div>
        {error && <p role="alert" className="mb-3 flex items-center gap-2 rounded-lg bg-rose-400/10 p-3 text-xs text-rose-100"><AlertCircle size={15} />{error}</p>}
        {storeConfig.gstin && storeConfig.gstin !== '19AAPCB0235J1ZJ' && (
          <p role="status" className="mb-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-100">
            Invoice GSTIN uses Inventory Store Settings ({storeConfig.gstin}), which differs from the supplied invoice reference. Verify the legal GSTIN before issuing tax invoices.
          </p>
        )}
        {!canPrintInvoice && (
          <p role="status" className="mb-3 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-xs text-sky-100">
            The fulfillment QR is ready to scan from this screen. Invoice PDF/printing stays locked until courier, tracking/AWB, and the tracking link are saved at shipment.
          </p>
        )}
        {qrUrl ? (
          <div className="flex flex-col items-center rounded-xl bg-white p-4 text-slate-900">
            <img src={qrUrl} alt={`Fulfillment manifest QR for order ${order.orderNumber || order.id}`} className="h-80 w-80 max-w-full object-contain [image-rendering:pixelated]" />
            <strong className="font-mono">Order {order.orderNumber || order.id}</strong>
            <span className="mt-1 text-[10px] text-slate-500">{qrPayloadLength.toLocaleString()} character compact manifest · 1080 px QR</span>
          </div>
        ) : <p className="py-10 text-center text-sm text-slate-300">Generating invoice and fulfillment QR…</p>}
        <button type="button" disabled={!qrUrl || !paymentQrUrl || !canPrintInvoice} onClick={printSlip} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 font-black text-emerald-950 disabled:opacity-50">
          <Printer size={16} /> {canPrintInvoice ? 'Print Tax Invoice & Fulfillment QR' : 'Printing unlocks after shipment details'}
        </button>
      </section>
    </div>
  );
}
