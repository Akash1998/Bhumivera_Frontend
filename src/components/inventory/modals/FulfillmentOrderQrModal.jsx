import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { AlertCircle, Printer, X } from 'lucide-react';
import { getInvoiceNumber } from '../../../utils/invoiceNumber';

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
    const invoiceNumber = getInvoiceNumber(order);
    const upiId = String(storeConfig.upiId || '').trim();
    const paymentPayload = upiId
      ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(storeConfig.storeName || 'Bhumivera')}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Invoice ${invoiceNumber}`)}`
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
    const rowsHtml = rows.map(item => `
      <tr>
        <td><strong>${escapeHtml(item.name)}</strong><small>SKU: ${escapeHtml(item.sku || '-')} · HSN: ${escapeHtml(item.gstHsnCode || '30049011')}</small></td>
        <td class="center">${item.quantity}</td>
        <td class="num">${currency(item.mrpTotal)}</td>
        <td class="num">${currency(item.discount)}</td>
        <td class="num">${currency(item.taxable)}</td>
        <td class="center">${item.rate}%<small>${currency(item.tax)}</small></td>
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
    const logoUrl = `${window.location.origin}/logo.webp`;
    const courierName = order.courier || 'Courier not recorded';
    const trackingNumber = order.trackingNumber || 'Not recorded';
    const invoiceNumber = getInvoiceNumber(order);

    printWindow.document.write(`
      <!doctype html>
      <html><head><title>Tax Invoice ${escapeHtml(invoiceNumber)}</title>
        <style>
          *{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;color:#111;font:9px Arial,Helvetica,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
          body{padding:12px}.sheet{width:100%;max-width:194mm;min-height:281mm;margin:0 auto;border:1.5px solid #111;padding:7mm;overflow:hidden;position:relative}
          .head{display:grid;grid-template-columns:1fr 170px;gap:12px;align-items:center;border-bottom:2px solid #111;padding:0 0 9px}
          .brand{display:flex;gap:12px;align-items:center}.brand img{width:24mm;height:24mm;object-fit:contain;filter:grayscale(1) contrast(1.35)}
          h1{font-size:20px;letter-spacing:2.4px;margin:0 0 4px}.muted{color:#333;line-height:1.45}
          .title{text-align:right}.title h2{font-size:17px;letter-spacing:1.2px;margin:2px 0 7px}.invoice-no{display:inline-block;border:1px solid #111;padding:5px 8px;font-size:10px;font-weight:bold}.invoice-meta{margin-top:6px;line-height:1.6;color:#333}
          .section-label{font-size:8px;font-weight:bold;text-transform:uppercase;letter-spacing:.8px;margin:0 0 5px}
          .two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:9px;margin:10px 0}
          .box{border:1px solid #333;padding:8px;line-height:1.5}.box h3{margin:0 0 5px;font-size:8px;text-transform:uppercase;letter-spacing:.7px;border-bottom:1px solid #aaa;padding-bottom:4px}
          table{width:100%;max-width:100%;table-layout:fixed;border-collapse:collapse;margin:7px 0}
          th,td{border:1px solid #555;padding:4px 3px;vertical-align:top;overflow-wrap:anywhere}
          th{background:#e8e8e8;font-size:7px;text-transform:uppercase;letter-spacing:.25px}td{font-size:8px}.center{text-align:center}.num{text-align:right;white-space:nowrap}
          small{display:block;color:#333;margin-top:2px;font-size:7px}.bottom{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,215px);gap:10px;margin-top:8px}
          .amount{text-align:right;font-size:8px;font-weight:bold}.amount-row{display:flex;justify-content:space-between;gap:8px;margin:4px 0}.amount .grand{font-size:12px;border-top:1.5px solid #111;padding-top:6px;margin-top:6px}
          .shipline{margin-top:8px;border:1px solid #333;padding:7px 8px;line-height:1.5;display:flex;justify-content:space-between;gap:10px}.shipline strong{font-size:7px;text-transform:uppercase;letter-spacing:.6px}.shipvalue{text-align:right;font-weight:bold}
          .qrbox{display:flex;min-width:0;align-items:center;gap:8px;border:1px solid #333;padding:6px;margin-top:7px;overflow:hidden;line-height:1.4}.qrbox img{flex:none;width:20mm;height:20mm;object-fit:contain;image-rendering:pixelated}.qrbox span{min-width:0;overflow-wrap:anywhere}
          .closing{display:grid;grid-template-columns:36mm minmax(0,1fr) 44mm;align-items:center;gap:9px;margin-top:10px;padding:8px;border:1px solid #444;background:#f7f7f4;break-inside:avoid}
          .closing .qrbox{margin:0;border:0;padding:0;justify-content:center}.closing .qrbox.pack img{width:30mm;height:30mm}
          .gratitude{font-size:8px;line-height:1.5}.gratitude h3{margin:0 0 4px;font-size:9px;text-transform:uppercase;letter-spacing:.6px}.quote{font-size:10px;font-style:italic;font-weight:bold;margin:5px 0}
          .signature{text-align:center;border-left:1px solid #999;padding-left:7px}.signature .script{font-family:"Segoe Script","Brush Script MT",cursive;font-size:17px;font-style:italic;line-height:1.2}.signature strong{display:block;margin-top:3px;font-size:8px}.signature small{font-size:7px}
          .foot{border-top:1px solid #333;margin-top:8px;padding-top:6px;display:grid;grid-template-columns:1fr;gap:6px;line-height:1.4}
          .note{font-size:7px;color:#333;margin-top:5px}
          @page{size:A4 portrait;margin:0}
          @media(max-width:680px){body{padding:6px}.sheet{min-height:0;padding:5mm}.head{grid-template-columns:1fr 130px}.two,.bottom,.foot{gap:5px}.bottom{grid-template-columns:minmax(0,1fr) minmax(0,180px)}.closing{grid-template-columns:32mm minmax(0,1fr);gap:6px}.signature{grid-column:1/-1;border-left:0;border-top:1px solid #999;padding:6px 0 0}.closing .qrbox.pack img{width:27mm;height:27mm}table{font-size:6px}th,td{padding:2px}}
          @media print{html,body{width:210mm;height:297mm;padding:0}body{display:flex;justify-content:center;align-items:flex-start}.sheet{width:194mm;height:281mm;max-width:none;min-height:0;margin:8mm auto;padding:6mm;border:1.2px solid #111;break-inside:avoid;page-break-inside:avoid}.head,.two,.bottom,.foot,.shipline,.qrbox,.closing,table{break-inside:avoid;page-break-inside:avoid}button{display:none}}
        </style>
      </head><body><main class="sheet">
        <header class="head">
          <div class="brand"><img src="${escapeHtml(logoUrl)}" alt="Bhumivera logo"/>
            <div><h1>BHUMIVERA</h1><strong>${escapeHtml(sellerName)}</strong><div class="muted">${escapeHtml(sellerAddress)}<br/>${escapeHtml(sellerPhone)} · ${escapeHtml(sellerEmail)}<br/>GSTIN: <strong>${escapeHtml(gstin || 'Not configured')}</strong></div></div>
          </div>
          <div class="title"><h2>TAX INVOICE</h2><div class="invoice-no">${escapeHtml(invoiceNumber)}</div><div class="invoice-meta">Order: <strong>${escapeHtml(order.orderNumber || order.id)}</strong><br/>Date: ${escapeHtml(invoiceDate)}<br/>Payment: ${escapeHtml(order.paymentMode || 'Online')} · ${escapeHtml(order.paymentStatus || 'pending')}</div></div>
        </header>
        <section class="two">
          <div class="box"><h3>Bill to</h3><strong>${escapeHtml(order.customerName || 'Customer')}</strong><br/>${escapeHtml(order.customerPhone || '')}<br/>${escapeHtml(order.customerEmail || '')}</div>
          <div class="box"><h3>Ship to</h3>${escapeHtml(address || 'Address not provided')}<br/>${escapeHtml(order.customerPhone || '')}</div>
        </section>
        <p class="section-label">Order items</p>
        <table><thead><tr><th style="width:33%">Product / SKU / HSN</th><th style="width:7%">Qty</th><th style="width:12%">MRP</th><th style="width:12%">Discount</th><th style="width:14%">Taxable</th><th style="width:10%">GST</th><th style="width:12%">Amount</th></tr></thead><tbody>${rowsHtml}</tbody></table>
        <div class="bottom">
          <div>
            <p class="section-label">Tax summary by HSN</p>
            <table><thead><tr><th>HSN</th><th>Taxable</th><th>Rate</th>${isIntraState ? '<th>CGST</th><th>SGST</th>' : '<th>IGST</th>'}<th>Total Tax</th></tr></thead><tbody>${hsnHtml}</tbody></table>
            <div class="note">${isIntraState ? 'Intra-state supply: CGST and SGST apply.' : 'Inter-state supply: IGST applies.'} Goods once sold are subject to applicable return and consumer protection policies.</div>
          </div>
          <div class="box amount">
            <p class="section-label">Payment summary</p>
            <div class="amount-row"><span>Total MRP</span><span>${currency(mrpTotal)}</span></div>
            <div class="amount-row"><span>Discount</span><span>−${currency(discountTotal)}</span></div>
            <div class="amount-row"><span>Taxable value</span><span>${currency(taxableTotal)}</span></div>
            <div class="amount-row"><span>${isIntraState ? 'CGST + SGST' : 'IGST'}</span><span>${currency(taxTotal)}</span></div>
            <div class="amount-row"><span>Shipping</span><span>${currency(shipping)}</span></div>
            <div class="amount-row"><span>Round off</span><span>${currency(roundOff)}</span></div>
            <div class="grand amount-row"><span>Invoice total</span><span>${currency(total)}</span></div>
            <div class="note">${escapeHtml(amountInIndianWords(total))}</div>
            <div class="qrbox"><img src="${paymentQrUrl}" alt="Payment or order verification QR"/><span><strong>PAY / VERIFY</strong><br/>UPI: ${escapeHtml(storeConfig.upiId || 'Not configured')}<br/>Order: ${escapeHtml(order.orderNumber || order.id)}</span></div>
          </div>
        </div>
        <section class="shipline"><div><strong>Shipped by</strong><br/>${escapeHtml(courierName)}</div><div class="shipvalue"><strong>Tracking / AWB</strong><br/>${escapeHtml(trackingNumber)}</div></section>
        <section class="closing">
          <div class="qrbox pack"><img src="${qrUrl}" alt="Order fulfillment QR code"/></div>
          <div class="gratitude">
            <h3>Thank you for choosing a kinder way</h3>
            <div>Your thoughtful choice supports a more nature-conscious future. We are grateful to have you with us on this journey.</div>
            <div class="quote">“Small choices, rooted in care, help the whole Earth bloom.”</div>
            <div>With heartfelt thanks, Team Bhumivera</div>
          </div>
          <div class="signature">
            <div class="script">Akash Prasad</div>
            <strong>Akash Prasad</strong>
            <small>Authorised Signatory</small>
          </div>
        </section>
        <footer class="foot"><div><strong>Invoice declaration</strong> · We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.<div class="note">Computer-generated tax invoice. Please retain for your records.</div></div></footer>
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
            <h2 id="fulfillment-qr-title" className="font-black">Tax Invoice · {getInvoiceNumber(order)}</h2>
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
