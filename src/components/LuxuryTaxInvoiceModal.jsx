import React, { useMemo, useState } from 'react';
import {
  Award,
  Building2,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  FileSpreadsheet,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
  Truck,
  UserCheck,
  X,
} from 'lucide-react';

const INDIAN_STATES_MAP = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra and Nagar Haveli and Daman and Diu',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
};

const STATE_NAME_TO_CODE = Object.fromEntries(
  Object.entries(INDIAN_STATES_MAP).map(([code, name]) => [name.toLowerCase(), code])
);

export function formatInr(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function amountToIndianWords(amount) {
  const numeric = Math.abs(Number(amount || 0));
  if (!Number.isFinite(numeric) || numeric === 0) return 'Rupees Zero Only';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const twoDigits = n => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    return `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ''}`;
  };

  const threeDigits = n => {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    return [h > 0 ? `${ones[h]} Hundred` : '', twoDigits(rem)].filter(Boolean).join(' ');
  };

  const rupeesInt = Math.floor(numeric);
  const paiseInt = Math.round((numeric - rupeesInt) * 100);
  let rem = rupeesInt;
  const parts = [];

  const crore = Math.floor(rem / 10000000);
  rem %= 10000000;
  if (crore > 0) parts.push(`${threeDigits(crore)} Crore`);

  const lakh = Math.floor(rem / 100000);
  rem %= 100000;
  if (lakh > 0) parts.push(`${twoDigits(lakh)} Lakh`);

  const thousand = Math.floor(rem / 1000);
  rem %= 1000;
  if (thousand > 0) parts.push(`${twoDigits(thousand)} Thousand`);

  if (rem > 0) parts.push(threeDigits(rem));

  const rupeeText = parts.length ? parts.join(' ') : 'Zero';
  const paiseText = paiseInt > 0 ? ` and Paise ${twoDigits(paiseInt)}` : '';
  return `Rupees ${rupeeText}${paiseText} Only`;
}

const escapeHtml = value =>
  String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

/**
 * Normalizes either an issued GST Document (`gst_documents`) OR a raw Order
 * object (`orders`) into a unified 10X Luxury Tax Invoice data model.
 */
export function normalizeInvoiceDocument(inputDoc, businessProfile = null) {
  if (!inputDoc) return null;

  // Case 1: Already a GST document from /api/gst/documents
  if (inputDoc.document_number && inputDoc.line_items) {
    const seller =
      typeof inputDoc.seller_snapshot === 'string'
        ? JSON.parse(inputDoc.seller_snapshot)
        : inputDoc.seller_snapshot || businessProfile || {};
    const buyer =
      typeof inputDoc.buyer_snapshot === 'string'
        ? JSON.parse(inputDoc.buyer_snapshot)
        : inputDoc.buyer_snapshot || {};
    const lines =
      typeof inputDoc.line_items === 'string'
        ? JSON.parse(inputDoc.line_items)
        : inputDoc.line_items || [];
    const addr = buyer.address && typeof buyer.address === 'object' ? buyer.address : {};

    const sellerStateCode = String(seller.state_code || '19').padStart(2, '0');
    const posCode = String(inputDoc.place_of_supply_code || buyer.state_code || sellerStateCode).padStart(2, '0');
    const posName = INDIAN_STATES_MAP[posCode] || buyer.place_of_supply || addr.state || 'West Bengal';
    const isInterstate = sellerStateCode !== posCode;
    const totalTax = Number(inputDoc.cgst || 0) + Number(inputDoc.sgst || 0) + Number(inputDoc.igst || 0);
    const rawOrd = inputDoc.order_number || inputDoc.order_id;
    const formattedOrderNumber = String(rawOrd || '').toUpperCase().startsWith('BHVM')
      ? String(rawOrd).toUpperCase()
      : `BHVM${rawOrd}`;

    // Build HSN breakup if not already attached
    const hsnMap = new Map();
    for (const line of lines) {
      const hsn = String(line.hsn_sac || '33049990');
      const rate = Number(line.gst_rate || 18);
      const key = `${hsn}|${rate}`;
      const existing = hsnMap.get(key) || {
        hsn_sac: hsn,
        gst_rate: rate,
        quantity: 0,
        taxable_value: 0,
        cgst_rate: isInterstate ? 0 : rate / 2,
        cgst: 0,
        sgst_rate: isInterstate ? 0 : rate / 2,
        sgst: 0,
        igst_rate: isInterstate ? rate : 0,
        igst: 0,
        total_tax: 0,
        total: 0,
      };
      existing.quantity += Number(line.quantity || 0);
      existing.taxable_value += Number(line.taxable_value || 0);
      existing.cgst += Number(line.cgst || 0);
      existing.sgst += Number(line.sgst || 0);
      existing.igst += Number(line.igst || 0);
      existing.total_tax += Number(line.cgst || 0) + Number(line.sgst || 0) + Number(line.igst || 0);
      existing.total += Number(line.total || 0);
      hsnMap.set(key, existing);
    }

    return {
      id: inputDoc.id,
      document_number: inputDoc.document_number,
      document_type: inputDoc.document_type || 'invoice',
      original_document_number: inputDoc.original_document_number || null,
      status: inputDoc.status || 'issued',
      issue_date: String(inputDoc.issue_date || inputDoc.created_at || new Date().toISOString()).slice(0, 10),
      order_id: inputDoc.order_id,
      formatted_order_number: formattedOrderNumber,
      supply_type: inputDoc.supply_type || (buyer.gstin ? 'B2B' : 'B2CS'),
      is_interstate: isInterstate,
      reverse_charge: 'N',
      place_of_supply_code: posCode,
      place_of_supply_name: posName,
      payment_mode: inputDoc.payment_mode || 'ONLINE',
      payment_status: inputDoc.payment_status || 'PAID',
      payment_id: inputDoc.payment_id || '',
      coupon_code: inputDoc.coupon_code || '',
      order_discount: Number(inputDoc.order_discount || 0),
      shipping_cost: Number(inputDoc.shipping_cost || 0),
      seller: {
        legal_name: seller.legal_name || 'Bhumivera Botanicals Pvt. Ltd.',
        trade_name: seller.trade_name || 'BHUMIVERA BOTANICALS',
        gstin: seller.gstin || '19AAACB0000A1Z5',
        pan_number: seller.pan_number || (seller.gstin ? seller.gstin.slice(2, 12) : 'AAACB0000A'),
        address: seller.address || 'Asansol, West Bengal — 713301, India',
        state_code: sellerStateCode,
        state_name: seller.state_name || 'West Bengal',
        email: seller.email || 'concierge@bhumivera.com',
        phone: seller.phone || '+91 8000-BHUMIVERA',
        authorized_signatory: seller.authorized_signatory || 'Authorized Signatory — Bhumivera',
        logo_url: seller.logo_url || '/logo.webp',
      },
      buyer: {
        name: buyer.name || inputDoc.customer_name || 'Valued Customer',
        email: buyer.email || inputDoc.customer_email || '',
        phone: buyer.phone || inputDoc.customer_phone || '',
        gstin: buyer.gstin || inputDoc.buyer_gstin || null,
        address_lines:
          typeof buyer.address === 'string'
            ? [buyer.address]
            : [
                addr.street_address || addr.address_line1 || addr.address || addr.line1,
                addr.line2 || addr.address_line2,
                [addr.city, addr.state || posName, addr.postal_code || addr.pincode].filter(Boolean).join(', '),
                addr.country || 'India',
              ].filter(Boolean),
      },
      line_items: lines,
      hsn_breakup: inputDoc.hsn_breakup || Array.from(hsnMap.values()),
      taxable_value: Number(inputDoc.taxable_value || 0),
      cgst: Number(inputDoc.cgst || 0),
      sgst: Number(inputDoc.sgst || 0),
      igst: Number(inputDoc.igst || 0),
      total_tax: totalTax,
      total: Number(inputDoc.total || 0),
      amount_in_words: inputDoc.amount_in_words || amountToIndianWords(inputDoc.total),
      sha512_signature: inputDoc.sha512_signature || `BV512-${inputDoc.document_number}-${inputDoc.order_id}`,
      reason: inputDoc.reason || '',
    };
  }

  // Case 2: Raw Order object from OrderManagement / Profile / OrderSuccess
  const profile = businessProfile || {};
  const rawAddr =
    typeof inputDoc.address_snapshot === 'string'
      ? (() => {
          try {
            return JSON.parse(inputDoc.address_snapshot);
          } catch {
            return {};
          }
        })()
      : inputDoc.address_snapshot || inputDoc.shippingAddress || inputDoc.address || {};

  const sellerStateCode = String(profile.state_code || '19').padStart(2, '0');
  const buyerStateRaw = String(rawAddr.state || rawAddr.state_name || 'West Bengal').trim().toLowerCase();
  const posCode = STATE_NAME_TO_CODE[buyerStateRaw] || sellerStateCode;
  const posName = INDIAN_STATES_MAP[posCode] || rawAddr.state || 'West Bengal';
  const isInterstate = sellerStateCode !== posCode;

  const orderTotal = Number(inputDoc.total || inputDoc.total_amount || 0);
  const shippingGross = Number(inputDoc.shipping_cost || inputDoc.shippingCost || 0);
  const rawItems = Array.isArray(inputDoc.items) ? inputDoc.items : [];
  const lineItems = [];
  let taxableTotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;

  const itemsToProcess = rawItems.length
    ? rawItems
    : [
        {
          name: 'Bhumivera Botanical Order Package',
          sku: 'BV-PKG',
          gst_hsn_code: '33049990',
          gst_rate: 18,
          quantity: 1,
          price: Math.max(0, orderTotal - shippingGross),
        },
      ];

  for (const item of itemsToProcess) {
    const qty = Number(item.quantity || 1);
    const rate = Number(item.gst_rate ?? 18);
    const gross = Number(item.price || 0) * qty;
    const taxable = Math.round((gross / (1 + rate / 100)) * 100) / 100;
    const tax = Math.round((gross - taxable) * 100) / 100;
    const cgst = isInterstate ? 0 : Math.round((tax / 2) * 100) / 100;
    const sgst = isInterstate ? 0 : Math.round((tax - cgst) * 100) / 100;
    const igst = isInterstate ? tax : 0;

    taxableTotal += taxable;
    cgstTotal += cgst;
    sgstTotal += sgst;
    igstTotal += igst;

    lineItems.push({
      description: item.name || item.product_name || 'Botanical Formulation',
      sku: item.sku || '',
      hsn_sac: item.gst_hsn_code || '33049990',
      quantity: qty,
      unit_price_inclusive: Number(item.price || 0),
      gst_rate: rate,
      taxable_value: taxable,
      cgst,
      sgst,
      igst,
      total: gross,
    });
  }

  if (shippingGross > 0) {
    const rate = Number(profile.shipping_gst_rate ?? 18);
    const taxable = Math.round((shippingGross / (1 + rate / 100)) * 100) / 100;
    const tax = Math.round((shippingGross - taxable) * 100) / 100;
    const cgst = isInterstate ? 0 : Math.round((tax / 2) * 100) / 100;
    const sgst = isInterstate ? 0 : Math.round((tax - cgst) * 100) / 100;
    const igst = isInterstate ? tax : 0;
    taxableTotal += taxable;
    cgstTotal += cgst;
    sgstTotal += sgst;
    igstTotal += igst;
    lineItems.push({
      description: 'Shipping & Secure Botanical Packaging',
      sku: 'SHIP-SAC',
      hsn_sac: profile.shipping_sac || '996812',
      quantity: 1,
      unit_price_inclusive: shippingGross,
      gst_rate: rate,
      taxable_value: taxable,
      cgst,
      sgst,
      igst,
      total: shippingGross,
    });
  }

  const rawOrdNum = inputDoc.order_number || inputDoc.orderNumber || inputDoc.id;
  const formattedOrderNumber = String(rawOrdNum || '').toUpperCase().startsWith('BHVM')
    ? String(rawOrdNum).toUpperCase()
    : `BHVM${rawOrdNum}`;

  const hsnMap = new Map();
  for (const line of lineItems) {
    const key = `${line.hsn_sac}|${line.gst_rate}`;
    const existing = hsnMap.get(key) || {
      hsn_sac: line.hsn_sac,
      gst_rate: line.gst_rate,
      quantity: 0,
      taxable_value: 0,
      cgst_rate: isInterstate ? 0 : line.gst_rate / 2,
      cgst: 0,
      sgst_rate: isInterstate ? 0 : line.gst_rate / 2,
      sgst: 0,
      igst_rate: isInterstate ? line.gst_rate : 0,
      igst: 0,
      total_tax: 0,
      total: 0,
    };
    existing.quantity += line.quantity;
    existing.taxable_value += line.taxable_value;
    existing.cgst += line.cgst;
    existing.sgst += line.sgst;
    existing.igst += line.igst;
    existing.total_tax += line.cgst + line.sgst + line.igst;
    existing.total += line.total;
    hsnMap.set(key, existing);
  }

  const finalTotal = orderTotal > 0 ? orderTotal : taxableTotal + cgstTotal + sgstTotal + igstTotal;

  return {
    id: inputDoc.id,
    document_number: inputDoc.invoice_number || `BV-${new Date().getFullYear()}-${String(inputDoc.id || 1).padStart(5, '0')}`,
    document_type: 'invoice',
    original_document_number: null,
    status: 'issued',
    issue_date: String(inputDoc.created_at || inputDoc.createdAt || new Date().toISOString()).slice(0, 10),
    order_id: inputDoc.id,
    formatted_order_number: formattedOrderNumber,
    supply_type: rawAddr.gstin ? 'B2B' : 'B2CS',
    is_interstate: isInterstate,
    reverse_charge: 'N',
    place_of_supply_code: posCode,
    place_of_supply_name: posName,
    payment_mode: inputDoc.payment_mode || inputDoc.paymentMode || 'ONLINE',
    payment_status: inputDoc.payment_status || inputDoc.paymentStatus || 'PAID',
    payment_id: inputDoc.payment_id || '',
    coupon_code: inputDoc.coupon_code || '',
    order_discount: Number(inputDoc.discount || 0),
    shipping_cost: shippingGross,
    seller: {
      legal_name: profile.legal_name || 'Bhumivera Botanicals Pvt. Ltd.',
      trade_name: profile.trade_name || 'BHUMIVERA BOTANICALS',
      gstin: profile.gstin || '19AAACB0000A1Z5',
      pan_number: profile.pan_number || 'AAACB0000A',
      address: profile.address || 'Asansol, West Bengal — 713301, India',
      state_code: sellerStateCode,
      state_name: profile.state_name || 'West Bengal',
      email: profile.email || 'concierge@bhumivera.com',
      phone: profile.phone || '+91 8000-BHUMIVERA',
      authorized_signatory: profile.authorized_signatory || 'Authorized Signatory — Bhumivera',
      logo_url: profile.logo_url || '/logo.webp',
    },
    buyer: {
      name: rawAddr.full_name || inputDoc.user_name || inputDoc.customer_name || inputDoc.customerName || 'Valued Customer',
      email: rawAddr.email || inputDoc.user_email || inputDoc.customer_email || inputDoc.customerEmail || '',
      phone: rawAddr.phone || rawAddr.phone_number || inputDoc.customer_phone || inputDoc.customerPhone || '',
      gstin: rawAddr.gstin || null,
      address_lines: [
        rawAddr.street_address || rawAddr.address_line1 || rawAddr.address || rawAddr.line1,
        rawAddr.line2 || rawAddr.address_line2,
        [rawAddr.city, rawAddr.state || posName, rawAddr.pincode || rawAddr.postal_code].filter(Boolean).join(', '),
        rawAddr.country || 'India',
      ].filter(Boolean),
    },
    line_items: lineItems,
    hsn_breakup: Array.from(hsnMap.values()),
    taxable_value: taxableTotal,
    cgst: cgstTotal,
    sgst: sgstTotal,
    igst: igstTotal,
    total_tax: cgstTotal + sgstTotal + igstTotal,
    total: finalTotal,
    amount_in_words: amountToIndianWords(finalTotal),
    sha512_signature: `BV512-${formattedOrderNumber}-${Math.round(finalTotal * 100)}`,
    reason: '',
  };
}

/**
 * Generates standalone print-ready HTML for the Bhumivera Maison GST Tax Invoice.
 */
export function buildPrintableLuxuryInvoiceHtml(normalized) {
  if (!normalized) return '';
  const isCreditNote = normalized.document_type === 'credit_note';
  const docTitle = isCreditNote ? 'GST CREDIT NOTE' : 'TAX INVOICE';

  const linesRows = (normalized.line_items || [])
    .map((line, idx) => {
      const rate = Number(line.gst_rate || 0);
      const cgRate = normalized.is_interstate ? 0 : rate / 2;
      const sgRate = normalized.is_interstate ? 0 : rate / 2;
      const igRate = normalized.is_interstate ? rate : 0;
      return `
        <tr>
          <td style="text-align:center">${idx + 1}</td>
          <td>
            <div style="font-weight:800;color:#071510">${escapeHtml(line.description)}</div>
            ${line.sku ? `<div style="font-size:10px;color:#52665c">SKU: ${escapeHtml(line.sku)}</div>` : ''}
          </td>
          <td style="text-align:center;font-family:monospace;font-weight:700">${escapeHtml(line.hsn_sac || '33049990')}</td>
          <td style="text-align:center">${escapeHtml(line.quantity)} Nos</td>
          <td style="text-align:right;font-family:monospace">${formatInr(line.unit_price_inclusive || line.total)}</td>
          <td style="text-align:right;font-family:monospace">${formatInr(line.taxable_value)}</td>
          <td style="text-align:right;font-family:monospace">${formatInr(line.cgst)} <span style="font-size:9px;color:#52665c">(${cgRate}%)</span></td>
          <td style="text-align:right;font-family:monospace">${formatInr(line.sgst)} <span style="font-size:9px;color:#52665c">(${sgRate}%)</span></td>
          <td style="text-align:right;font-family:monospace">${formatInr(line.igst)} <span style="font-size:9px;color:#52665c">(${igRate}%)</span></td>
          <td style="text-align:right;font-family:monospace;font-weight:800">${formatInr(line.total)}</td>
        </tr>`;
    })
    .join('');

  const hsnRows = (normalized.hsn_breakup || [])
    .map(
      h => `
        <tr>
          <td style="font-family:monospace;font-weight:800">${escapeHtml(h.hsn_sac)}</td>
          <td style="text-align:center">${escapeHtml(h.quantity)}</td>
          <td style="text-align:center">${escapeHtml(h.gst_rate)}%</td>
          <td style="text-align:right;font-family:monospace">${formatInr(h.taxable_value)}</td>
          <td style="text-align:right;font-family:monospace">${formatInr(h.cgst)}</td>
          <td style="text-align:right;font-family:monospace">${formatInr(h.sgst)}</td>
          <td style="text-align:right;font-family:monospace">${formatInr(h.igst)}</td>
          <td style="text-align:right;font-family:monospace;font-weight:800">${formatInr(h.total_tax)}</td>
        </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(normalized.document_number)} — Bhumivera ${docTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #0b2419; background: #f4f1ea; margin: 0; padding: 24px; }
    .sheet { max-width: 960px; margin: 0 auto; background: #fff; border: 2px solid #0b2419; border-radius: 16px; overflow: hidden; }
    .banner { background: linear-gradient(135deg, #071510 0%, #0b2419 65%, #123828 100%); color: #fdfbf7; padding: 24px 28px; display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #d4af37; }
    .brand { display: flex; align-items: center; gap: 16px; }
    .crest { width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, #f5df88, #d4af37); color: #071510; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 22px; border: 2px solid #fff; position: relative; overflow: hidden; }
    .crest img { width: 100%; height: 100%; object-fit: contain; position: absolute; inset: 0; }
    .meta-strip { display: grid; grid-template-columns: repeat(5, 1fr); background: #f8f6f0; padding: 12px 24px; border-bottom: 1px solid #d5ded8; font-size: 12px; gap: 10px; }
    .meta-strip span { display: block; font-size: 9.5px; text-transform: uppercase; color: #52665c; font-weight: 700; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #d5ded8; }
    .party { padding: 16px 24px; font-size: 12px; line-height: 1.5; }
    .party:first-child { border-right: 1px solid #d5ded8; }
    .pill { display: inline-block; margin-top: 6px; padding: 3px 8px; background: #e9f5ee; border: 1px solid #8fd1ae; border-radius: 6px; font-family: monospace; font-weight: 800; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
    th { background: #0b2419; color: #f5df88; text-transform: uppercase; font-size: 9.5px; letter-spacing: 0.06em; padding: 9px 7px; border: 1px solid #183d2c; }
    td { padding: 8px 7px; border: 1px solid #dce3de; }
    .bottom-grid { display: grid; grid-template-columns: 1.35fr 0.95fr; border-top: 2px solid #0b2419; }
    .words { background: #f8f6f0; border-left: 4px solid #d4af37; padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; }
    .grand { background: #0b2419; color: #f5df88; padding: 12px 14px; border-radius: 10px; display: flex; justify-content: space-between; font-size: 16px; font-weight: 900; margin-top: 10px; }
    @media print { body { background: #fff; padding: 0; } .sheet { border-radius: 0; max-width: 100%; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="banner">
      <div class="brand">
        <div class="crest">
          <span>BV</span>
          <img src="${escapeHtml(normalized.seller.logo_url || '/logo.webp')}" alt="Bhumivera" onerror="this.style.display='none'" />
        </div>
        <div>
          <div style="font-family:Georgia,serif;font-size:24px;font-weight:800;letter-spacing:0.08em">${escapeHtml(normalized.seller.trade_name)}</div>
          <div style="color:#d4af37;font-size:10.5px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase">${escapeHtml(normalized.seller.legal_name)} · GST Compliant Tax Document</div>
        </div>
      </div>
      <div style="text-align:right">
        <div style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid #d4af37;color:#f5df88;font-size:11px;font-weight:800">${docTitle} · ${escapeHtml(normalized.supply_type)}</div>
        <div style="font-size:19px;font-weight:900;font-family:monospace;margin-top:6px">${escapeHtml(normalized.document_number)}</div>
      </div>
    </div>
    <div class="meta-strip">
      <div><span>Invoice Date</span><strong>${escapeHtml(normalized.issue_date)}</strong></div>
      <div><span>Order Reference</span><strong>${escapeHtml(normalized.formatted_order_number)} (#${escapeHtml(normalized.order_id)})</strong></div>
      <div><span>Place of Supply</span><strong>${escapeHtml(normalized.place_of_supply_code)} — ${escapeHtml(normalized.place_of_supply_name)}</strong></div>
      <div><span>Tax Regime</span><strong>${normalized.is_interstate ? 'Inter-State (IGST)' : 'Intra-State (CGST+SGST)'}</strong></div>
      <div><span>Payment</span><strong>${escapeHtml(String(normalized.payment_mode).toUpperCase())} (${escapeHtml(String(normalized.payment_status).toUpperCase())})</strong></div>
    </div>
    <div class="parties">
      <div class="party">
        <div style="font-size:10px;font-weight:900;text-transform:uppercase;color:#0f5132">Sold &amp; Issued By</div>
        <div style="font-size:14px;font-weight:800;margin:3px 0">${escapeHtml(normalized.seller.legal_name)}</div>
        <div>${escapeHtml(normalized.seller.address)}</div>
        <div>State: <strong>${escapeHtml(normalized.seller.state_name)} (${escapeHtml(normalized.seller.state_code)})</strong></div>
        <div class="pill">GSTIN: ${escapeHtml(normalized.seller.gstin)}</div>
      </div>
      <div class="party">
        <div style="font-size:10px;font-weight:900;text-transform:uppercase;color:#0f5132">Billed &amp; Shipped To</div>
        <div style="font-size:14px;font-weight:800;margin:3px 0">${escapeHtml(normalized.buyer.name)}</div>
        <div>${normalized.buyer.address_lines.map(escapeHtml).join('<br>')}</div>
        <div class="pill">${normalized.buyer.gstin ? `Buyer GSTIN: ${escapeHtml(normalized.buyer.gstin)}` : 'Unregistered Recipient (B2C)'}</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th><th>Description</th><th>HSN/SAC</th><th>Qty</th><th>Rate</th><th>Taxable</th><th>CGST</th><th>SGST</th><th>IGST</th><th>Total</th>
        </tr>
      </thead>
      <tbody>${linesRows}</tbody>
    </table>
    <div class="bottom-grid">
      <div style="padding:16px 22px;border-right:1px solid #d5ded8">
        <div class="words">
          <div style="font-size:9.5px;text-transform:uppercase;color:#52665c;font-weight:800">Amount in Words (INR)</div>
          <div style="font-size:12.5px;font-weight:800;margin-top:2px">${escapeHtml(normalized.amount_in_words)}</div>
        </div>
        <div style="font-size:10px;font-weight:900;text-transform:uppercase;color:#0f5132;margin-bottom:6px">HSN / SAC Tax Breakup</div>
        <table>
          <thead><tr><th>HSN/SAC</th><th>Qty</th><th>Rate</th><th>Taxable</th><th>CGST</th><th>SGST</th><th>IGST</th><th>Total Tax</th></tr></thead>
          <tbody>${hsnRows}</tbody>
        </table>
      </div>
      <div style="padding:16px 22px;background:#fbfaf6">
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px"><span>Taxable Value</span><strong>${formatInr(normalized.taxable_value)}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px"><span>CGST</span><strong>${formatInr(normalized.cgst)}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px"><span>SGST</span><strong>${formatInr(normalized.sgst)}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px"><span>IGST</span><strong>${formatInr(normalized.igst)}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px;border-top:1px dashed #ccc"><span>Total GST</span><strong>${formatInr(normalized.total_tax)}</strong></div>
        <div class="grand"><span>GRAND TOTAL</span><span>${formatInr(normalized.total)}</span></div>
        <div style="text-align:right;margin-top:22px;font-size:11px">
          <div>For <strong>${escapeHtml(normalized.seller.legal_name)}</strong></div>
          <div style="display:inline-block;border:2px double #0f5132;color:#0f5132;padding:4px 10px;border-radius:6px;font-weight:900;font-size:9.5px;margin:8px 0">✓ DIGITALLY VERIFIED</div>
          <div><strong>${escapeHtml(normalized.seller.authorized_signatory)}</strong></div>
        </div>
      </div>
    </div>
  </div>
  <script>window.onload = function() { window.print(); };</script>
</body>
</html>`;
}

export default function LuxuryTaxInvoiceModal({
  document: rawDocument,
  businessProfile = null,
  onClose,
}) {
  const [copied, setCopied] = useState(false);
  const invoice = useMemo(
    () => normalizeInvoiceDocument(rawDocument, businessProfile),
    [rawDocument, businessProfile]
  );

  if (!invoice) return null;

  const isCreditNote = invoice.document_type === 'credit_note';

  const handlePrint = () => {
    const html = buildPrintableLuxuryInvoiceHtml(invoice);
    const popup = window.open('', '_blank');
    if (!popup) {
      window.print();
      return;
    }
    popup.document.write(html);
    popup.document.close();
  };

  const handleDownloadHtml = () => {
    const html = buildPrintableLuxuryInvoiceHtml(invoice);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.document_number}_${invoice.formatted_order_number}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    const summary = [
      `Bhumivera ${isCreditNote ? 'GST Credit Note' : 'Tax Invoice'}: ${invoice.document_number}`,
      `Order: ${invoice.formatted_order_number} (#${invoice.order_id})`,
      `Date: ${invoice.issue_date}`,
      `Supplier GSTIN: ${invoice.seller.gstin}`,
      `Customer: ${invoice.buyer.name} (${invoice.buyer.gstin || 'B2C Unregistered'})`,
      `Place of Supply: ${invoice.place_of_supply_code} - ${invoice.place_of_supply_name}`,
      `Taxable Value: ${formatInr(invoice.taxable_value)}`,
      `CGST: ${formatInr(invoice.cgst)} | SGST: ${formatInr(invoice.sgst)} | IGST: ${formatInr(invoice.igst)}`,
      `Grand Total: ${formatInr(invoice.total)} (${invoice.amount_in_words})`,
    ].join('\n');
    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Tax Invoice ${invoice.document_number}`}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-5xl rounded-3xl border-2 border-[#d4af37]/50 bg-[#fdfbf7] text-[#071510] shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
      >
        {/* Top Action Toolbar */}
        <div className="bg-[#071510] text-[#fdfbf7] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#d4af37]/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles size={17} className="text-[#d4af37]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#d4af37]">
              Bhumivera Maison GST {isCreditNote ? 'Credit Note' : 'Tax Invoice'}
            </span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
              {invoice.supply_type} · {invoice.is_interstate ? 'IGST' : 'CGST + SGST'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10"
            >
              {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25"
            >
              <Download size={14} /> Download Invoice
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#d4af37] px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#071510] hover:bg-[#e5c247]"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close invoice preview"
              className="rounded-xl border border-white/15 bg-white/5 p-1.5 text-white/70 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Invoice Sheet */}
        <div className="overflow-y-auto flex-1">
          {/* Luxury Brand Header with Logo */}
          <div className="bg-gradient-to-r from-[#071510] via-[#0b2419] to-[#123828] text-[#fdfbf7] px-6 py-6 border-b-4 border-[#d4af37] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-[#f5df88] via-[#d4af37] to-[#9b7817] p-0.5 shadow-lg shrink-0 flex items-center justify-center border-2 border-white">
                <span className="font-serif text-xl font-black text-[#071510]">BV</span>
                <img
                  src={invoice.seller.logo_url || '/logo.webp'}
                  alt="Bhumivera Crest"
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="absolute inset-0 h-full w-full object-contain rounded-2xl bg-[#071510]/90 p-1.5"
                />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-black tracking-wider text-white">
                  {invoice.seller.trade_name}
                </h2>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d4af37] mt-0.5">
                  {invoice.seller.legal_name} · Authentic Botanical Luxury
                </p>
                <p className="text-xs text-emerald-100/80 mt-1">{invoice.seller.address}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37] bg-[#d4af37]/20 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-[#f5df88]">
                <FileCheck2 size={13} />
                {isCreditNote ? 'GST CREDIT NOTE' : 'TAX INVOICE'}
              </span>
              <div className="mt-2 font-mono text-xl font-black text-white">{invoice.document_number}</div>
              <div className="text-xs text-emerald-200/80">Issued: {invoice.issue_date}</div>
            </div>
          </div>

          {/* 5-Column Statutory Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[#f4f0e6] px-6 py-3.5 border-b border-[#d5ded8] text-xs">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#52665c]">Order Reference</span>
              <strong className="font-mono text-sm text-[#071510]">
                {invoice.formatted_order_number} (#{invoice.order_id})
              </strong>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#52665c]">Place of Supply</span>
              <strong className="text-[#071510]">
                {invoice.place_of_supply_code} — {invoice.place_of_supply_name}
              </strong>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#52665c]">Supply &amp; Regime</span>
              <strong className="text-[#071510]">
                {invoice.supply_type} · {invoice.is_interstate ? 'Inter-State (IGST)' : 'Intra-State (CGST+SGST)'}
              </strong>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#52665c]">Reverse Charge</span>
              <strong className="text-[#071510]">No ({invoice.reverse_charge})</strong>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#52665c]">Payment Status</span>
              <strong className="uppercase text-emerald-800">
                {invoice.payment_mode} · {invoice.payment_status}
              </strong>
            </div>
          </div>

          {/* Supplier & Buyer Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#d5ded8] bg-white">
            <div className="p-5 sm:p-6 border-b md:border-b-0 md:border-r border-[#d5ded8] space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-800">
                <Building2 size={13} /> Sold &amp; Issued By (Registered Supplier)
              </div>
              <div className="text-base font-black text-[#071510]">{invoice.seller.legal_name}</div>
              <div className="text-[#34463d]">{invoice.seller.address}</div>
              <div className="text-[#34463d]">
                State: <strong>{invoice.seller.state_name}</strong> (Code: <strong>{invoice.seller.state_code}</strong>)
              </div>
              {(invoice.seller.email || invoice.seller.phone) && (
                <div className="text-[#34463d]">
                  Contact: {[invoice.seller.email, invoice.seller.phone].filter(Boolean).join(' · ')}
                </div>
              )}
              <div className="pt-1 flex flex-wrap gap-2">
                <span className="rounded-md bg-emerald-50 border border-emerald-300 px-2.5 py-1 font-mono text-[11px] font-black text-[#071510]">
                  GSTIN: {invoice.seller.gstin}
                </span>
                {invoice.seller.pan_number && (
                  <span className="rounded-md bg-amber-50 border border-amber-300 px-2.5 py-1 font-mono text-[11px] font-black text-[#071510]">
                    PAN: {invoice.seller.pan_number}
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-800">
                <UserCheck size={13} /> Billed &amp; Shipped To (Recipient)
              </div>
              <div className="text-base font-black text-[#071510]">{invoice.buyer.name}</div>
              {invoice.buyer.address_lines.map((line, idx) => (
                <div key={idx} className="text-[#34463d]">
                  {line}
                </div>
              ))}
              {(invoice.buyer.phone || invoice.buyer.email) && (
                <div className="text-[#34463d]">
                  Contact: {[invoice.buyer.phone, invoice.buyer.email].filter(Boolean).join(' · ')}
                </div>
              )}
              <div className="pt-1 flex flex-wrap gap-2">
                <span className="rounded-md bg-emerald-50 border border-emerald-300 px-2.5 py-1 font-mono text-[11px] font-black text-[#071510]">
                  {invoice.buyer.gstin ? `Buyer GSTIN: ${invoice.buyer.gstin} (B2B)` : 'Unregistered Recipient (B2C Consumer)'}
                </span>
              </div>
              {isCreditNote && invoice.original_document_number && (
                <div className="pt-1 text-xs font-bold text-amber-800">
                  Original Invoice Reference: {invoice.original_document_number}
                </div>
              )}
            </div>
          </div>

          {/* Itemized Tax Table */}
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0b2419] text-[#f5df88] uppercase text-[10px] tracking-wider">
                  <th className="p-3 border border-[#183d2c] text-center">#</th>
                  <th className="p-3 border border-[#183d2c]">Item Description &amp; SKU</th>
                  <th className="p-3 border border-[#183d2c] text-center">HSN/SAC</th>
                  <th className="p-3 border border-[#183d2c] text-center">Qty</th>
                  <th className="p-3 border border-[#183d2c] text-right">Unit Price</th>
                  <th className="p-3 border border-[#183d2c] text-right">Taxable Value</th>
                  <th className="p-3 border border-[#183d2c] text-right">CGST</th>
                  <th className="p-3 border border-[#183d2c] text-right">SGST</th>
                  <th className="p-3 border border-[#183d2c] text-right">IGST</th>
                  <th className="p-3 border border-[#183d2c] text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce3de]">
                {(invoice.line_items || []).map((line, index) => {
                  const rate = Number(line.gst_rate || 0);
                  const cgRate = invoice.is_interstate ? 0 : rate / 2;
                  const sgRate = invoice.is_interstate ? 0 : rate / 2;
                  const igRate = invoice.is_interstate ? rate : 0;
                  return (
                    <tr key={index} className="hover:bg-[#f8faf9]">
                      <td className="p-3 border border-[#dce3de] text-center font-mono">{index + 1}</td>
                      <td className="p-3 border border-[#dce3de]">
                        <div className="font-bold text-[#071510]">{line.description}</div>
                        {line.sku && <div className="text-[10px] text-[#52665c]">SKU: {line.sku}</div>}
                      </td>
                      <td className="p-3 border border-[#dce3de] text-center font-mono font-bold">
                        {line.hsn_sac || '33049990'}
                      </td>
                      <td className="p-3 border border-[#dce3de] text-center font-semibold">{line.quantity} Nos</td>
                      <td className="p-3 border border-[#dce3de] text-right font-mono">
                        {formatInr(line.unit_price_inclusive || line.total)}
                      </td>
                      <td className="p-3 border border-[#dce3de] text-right font-mono">
                        {formatInr(line.taxable_value)}
                      </td>
                      <td className="p-3 border border-[#dce3de] text-right font-mono">
                        {formatInr(line.cgst)}
                        <span className="block text-[9.5px] text-[#52665c]">({cgRate}%)</span>
                      </td>
                      <td className="p-3 border border-[#dce3de] text-right font-mono">
                        {formatInr(line.sgst)}
                        <span className="block text-[9.5px] text-[#52665c]">({sgRate}%)</span>
                      </td>
                      <td className="p-3 border border-[#dce3de] text-right font-mono">
                        {formatInr(line.igst)}
                        <span className="block text-[9.5px] text-[#52665c]">({igRate}%)</span>
                      </td>
                      <td className="p-3 border border-[#dce3de] text-right font-mono font-black text-[#071510]">
                        {formatInr(line.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* HSN Breakup + Amount in Words + Totals */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-t-2 border-[#0b2419] bg-white">
            <div className="lg:col-span-7 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#d5ded8] space-y-4">
              <div className="rounded-xl bg-[#f8f6f0] border-l-4 border-[#d4af37] p-3.5">
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#52665c]">
                  Total Invoice Amount in Words (Indian Rupee System)
                </span>
                <strong className="text-sm text-[#071510]">{invoice.amount_in_words}</strong>
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-900 mb-2">
                  HSN / SAC Statutory Tax Summary
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-[#eef3f0] text-[#0b2419] font-bold">
                        <th className="p-2 border border-[#d5ded8]">HSN/SAC</th>
                        <th className="p-2 border border-[#d5ded8] text-center">Qty</th>
                        <th className="p-2 border border-[#d5ded8] text-center">Rate</th>
                        <th className="p-2 border border-[#d5ded8] text-right">Taxable</th>
                        <th className="p-2 border border-[#d5ded8] text-right">CGST</th>
                        <th className="p-2 border border-[#d5ded8] text-right">SGST</th>
                        <th className="p-2 border border-[#d5ded8] text-right">IGST</th>
                        <th className="p-2 border border-[#d5ded8] text-right">Total Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(invoice.hsn_breakup || []).map((h, i) => (
                        <tr key={i}>
                          <td className="p-2 border border-[#d5ded8] font-mono font-bold">{h.hsn_sac}</td>
                          <td className="p-2 border border-[#d5ded8] text-center">{h.quantity}</td>
                          <td className="p-2 border border-[#d5ded8] text-center">{h.gst_rate}%</td>
                          <td className="p-2 border border-[#d5ded8] text-right font-mono">{formatInr(h.taxable_value)}</td>
                          <td className="p-2 border border-[#d5ded8] text-right font-mono">{formatInr(h.cgst)}</td>
                          <td className="p-2 border border-[#d5ded8] text-right font-mono">{formatInr(h.sgst)}</td>
                          <td className="p-2 border border-[#d5ded8] text-right font-mono">{formatInr(h.igst)}</td>
                          <td className="p-2 border border-[#d5ded8] text-right font-mono font-bold">{formatInr(h.total_tax)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 sm:p-6 bg-[#fbfaf6] flex flex-col justify-between space-y-4">
              <div className="space-y-2 text-xs">
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-900">
                  Tax &amp; Settlement Summary
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#d5ded8]">
                  <span className="text-[#34463d]">Total Taxable Value</span>
                  <strong className="font-mono">{formatInr(invoice.taxable_value)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#d5ded8]">
                  <span className="text-[#34463d]">Central GST (CGST)</span>
                  <strong className="font-mono">{formatInr(invoice.cgst)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#d5ded8]">
                  <span className="text-[#34463d]">State GST (SGST)</span>
                  <strong className="font-mono">{formatInr(invoice.sgst)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#d5ded8]">
                  <span className="text-[#34463d]">Integrated GST (IGST)</span>
                  <strong className="font-mono">{formatInr(invoice.igst)}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#d5ded8]">
                  <span className="text-[#34463d] font-bold">Total GST Amount</span>
                  <strong className="font-mono text-emerald-900">{formatInr(invoice.total_tax)}</strong>
                </div>
                {invoice.order_discount > 0 && (
                  <div className="flex justify-between py-1 text-emerald-800">
                    <span>
                      Coupon / Promo Discount {invoice.coupon_code ? `(${invoice.coupon_code})` : ''}
                    </span>
                    <strong className="font-mono">-{formatInr(invoice.order_discount)}</strong>
                  </div>
                )}
                <div className="rounded-2xl bg-[#0b2419] text-[#f5df88] p-4 flex items-center justify-between text-base font-black shadow-md">
                  <span>GRAND TOTAL</span>
                  <span className="font-mono text-lg">{formatInr(invoice.total)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#d5ded8] flex items-end justify-between gap-4 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-950 text-[#d4af37]">
                    <QrCode size={28} />
                  </div>
                  <div className="text-[10px] text-[#52665c]">
                    <div className="font-bold text-[#071510]">Cryptographically Verified Tax Record</div>
                    <div className="font-mono">{String(invoice.sha512_signature).slice(0, 22)}…</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-[#34463d]">For <strong>{invoice.seller.legal_name}</strong></div>
                  <div className="my-1.5 inline-flex items-center gap-1 rounded border-2 border-double border-emerald-800 px-2.5 py-0.5 text-[9.5px] font-black uppercase tracking-widest text-emerald-900">
                    <ShieldCheck size={11} /> Digitally Signed
                  </div>
                  <div className="font-bold text-[#071510]">{invoice.seller.authorized_signatory}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
