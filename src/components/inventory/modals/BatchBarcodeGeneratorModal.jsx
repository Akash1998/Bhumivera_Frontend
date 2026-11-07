import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Printer,
  X,
  Layers,
  Calendar,
  Hash,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Sparkles,
  Barcode as BarcodeIcon,
} from 'lucide-react';

export default function BatchBarcodeGeneratorModal({
  isOpen,
  onClose,
  catalog = [],
  initialProduct = null,
  initialBatch = '',
}) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customSku, setCustomSku] = useState('');
  const [customName, setCustomName] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [mfgDate, setMfgDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [hsnCode, setHsnCode] = useState('30049011');
  const [gstRate, setGstRate] = useState('5');
  const [mrp, setMrp] = useState('699');
  const [sellingPrice, setSellingPrice] = useState('299');
  const [labelFormat, setLabelFormat] = useState('a4-sheet-24'); // 'a4-sheet-24' | 'a4-sheet-35' | 'a4-sheet-48' | 'thermal-50x25' | 'compact-38x25' | 'pallet-4x6'
  const [pureQrMode, setPureQrMode] = useState(true); // Default true: simple pure QR code with NO text, optimized for quick scanning
  const [printQuantity, setPrintQuantity] = useState(24);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Set default dates: mfg = today, expiry = today + 24 months
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMfgDate(`${yyyy}-${mm}-${dd}`);

    const exp = new Date(today);
    exp.setMonth(exp.getMonth() + 24);
    const expY = exp.getFullYear();
    const expM = String(exp.getMonth() + 1).padStart(2, '0');
    const expD = String(exp.getDate()).padStart(2, '0');
    setExpiryDate(`${expY}-${expM}-${expD}`);
  }, []);

  // When initial product or catalog changes, initialize selection
  useEffect(() => {
    if (!isOpen) return;

    if (initialProduct) {
      setSelectedProductId(String(initialProduct.id || initialProduct.metaId || ''));
      setCustomSku(initialProduct.sku || '');
      setCustomName(initialProduct.name || '');
      setMrp(String(initialProduct.mrp || initialProduct.price || '699'));
      setSellingPrice(String(initialProduct.price || initialProduct.sellingPrice || '299'));
      setHsnCode(initialProduct.gstHsnCode || initialProduct.hsn || '30049011');
      setGstRate(String(initialProduct.gstRate || '5'));
      setBatchNo(
        initialBatch ||
        initialProduct.batchNo ||
        `BV-BATCH-${new Date().getFullYear()}-${String(initialProduct.sku || 'ITEM').replace(/^BV-(LUX-)?/, '').slice(0, 4)}01`
      );
    } else if (catalog && catalog.length > 0) {
      const first = catalog[0];
      setSelectedProductId(String(first.id || first.metaId || ''));
      setCustomSku(first.sku || '');
      setCustomName(first.name || '');
      setMrp(String(first.mrp || first.price || '699'));
      setSellingPrice(String(first.price || first.sellingPrice || '299'));
      setHsnCode(first.gstHsnCode || first.hsn || '30049011');
      setGstRate(String(first.gstRate || '5'));
      setBatchNo(
        initialBatch ||
        first.batchNo ||
        `BV-BATCH-${new Date().getFullYear()}-${String(first.sku || 'ITEM').replace(/^BV-(LUX-)?/, '').slice(0, 4)}01`
      );
    }
  }, [isOpen, initialProduct, initialBatch, catalog]);

  // Handle changing product from dropdown
  const handleSelectProduct = (prodId) => {
    setSelectedProductId(prodId);
    const prod = catalog.find(p => String(p.id || p.metaId) === String(prodId));
    if (prod) {
      setCustomSku(prod.sku || '');
      setCustomName(prod.name || '');
      setMrp(String(prod.mrp || prod.price || '699'));
      setSellingPrice(String(prod.price || prod.sellingPrice || '299'));
      setHsnCode(prod.gstHsnCode || prod.hsn || '30049011');
      setGstRate(String(prod.gstRate || '5'));
      setBatchNo(
        prod.batchNo ||
        `BV-BATCH-${new Date().getFullYear()}-${String(prod.sku || 'ITEM').replace(/^BV-(LUX-)?/, '').slice(0, 4)}01`
      );
    }
  };

  // Generate Dual-Purpose QR Payload:
  // 1. Opens https://bhumivera.com/verify?code=BV:<SKU>:<BATCH> on regular customer phone cameras (100% Genuine Certificate)
  // 2. Resolved in <15ms by Bhumivera Scanner APK & USB laser scanners for POS billing & order packing
  const scannablePayload = customSku && batchNo ? `BV:${customSku.trim()}:${batchNo.trim()}` : (customSku || 'BV-PRODUCT');
  const qrUniversalPayload = `https://bhumivera.com/verify?code=${scannablePayload}`;

  // Generate QR Code data URL dynamically
  useEffect(() => {
    let active = true;
    if (!qrUniversalPayload) return;

    QRCode.toDataURL(qrUniversalPayload, {
      width: 420,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    }).then(url => {
      if (active) setQrDataUrl(url);
    }).catch(() => {});

    return () => { active = false; };
  }, [qrUniversalPayload]);

  if (!isOpen) return null;

  const handleCopyPayload = () => {
    navigator.clipboard?.writeText(scannablePayload);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups to print barcode labels.');
      return;
    }

    const totalCount = Math.max(1, Number(printQuantity) || 1);
    const labelsArray = Array.from({ length: totalCount });

    let labelHtml = '';

    if (pureQrMode) {
      // =========================================================================
      // PURE QR MODE (Optimized for Fast Camera & Scanner Reading • ZERO Text Clutter)
      // =========================================================================
      if (labelFormat.startsWith('a4-sheet') || labelFormat === 'a4-sheet') {
        let perPage = 24;
        let gridClass = 'a4-grid-4x6';

        if (labelFormat === 'a4-sheet-35') {
          perPage = 35;
          gridClass = 'a4-grid-5x7';
        } else if (labelFormat === 'a4-sheet-48') {
          perPage = 48;
          gridClass = 'a4-grid-6x8';
        }

        // Chunk into exact pages so each A4 page fits perfectly without overflowing
        const pages = [];
        for (let i = 0; i < totalCount; i += perPage) {
          pages.push(labelsArray.slice(i, i + perPage));
        }

        labelHtml = pages.map((pageItems) => `
          <div class="a4-page-grid ${gridClass}">
            ${pageItems.map(() => `
              <div class="a4-qr-cell">
                <img src="${qrDataUrl}" alt="QR" />
              </div>
            `).join('')}
          </div>
        `).join('');
      } else if (labelFormat === 'thermal-50x25') {
        labelHtml = labelsArray.map(() => `
          <div class="sticker-50x25-pure">
            <img src="${qrDataUrl}" alt="QR" class="thermal-pure-qr" />
          </div>
        `).join('');
      } else if (labelFormat === 'compact-38x25') {
        labelHtml = labelsArray.map(() => `
          <div class="sticker-38x25-pure">
            <img src="${qrDataUrl}" alt="QR" class="compact-pure-qr" />
          </div>
        `).join('');
      } else {
        // Pallet Master Carton Pure QR
        labelHtml = labelsArray.map(() => `
          <div class="pallet-pure">
            <img src="${qrDataUrl}" alt="QR" class="pallet-pure-qr" />
            <div class="pallet-pure-code">${scannablePayload}</div>
          </div>
        `).join('');
      }
    } else {
      // =========================================================================
      // DETAILED LABEL MODE (with Brand, SKU, Batch, HSN, MRP)
      // =========================================================================
      if (labelFormat === 'thermal-50x25') {
        labelHtml = labelsArray.map(() => `
          <div class="sticker-50x25">
            <div class="brand">BHUMIVERA AUSHADH</div>
            <div class="content-row">
              <div class="qr-col">
                <img src="${qrDataUrl}" alt="QR" />
                <div class="barcode-text">${scannablePayload}</div>
              </div>
              <div class="info-col">
                <div class="pname">${customName.replace(/\(.*?\)/g, '').trim()}</div>
                <div class="meta-line"><b>BATCH:</b> ${batchNo}</div>
                <div class="meta-line"><b>MFG:</b> ${mfgDate} | <b>EXP:</b> ${expiryDate}</div>
                <div class="meta-line"><b>HSN:</b> ${hsnCode} (GST ${gstRate}%)</div>
                <div class="price-line">MRP: ₹${mrp} (Incl. Taxes)</div>
              </div>
            </div>
          </div>
        `).join('');
      } else if (labelFormat === 'compact-38x25') {
        labelHtml = labelsArray.map(() => `
          <div class="sticker-38x25">
            <div class="brand">BHUMIVERA LUXURY</div>
            <div class="content-row">
              <img class="qr-small" src="${qrDataUrl}" alt="QR" />
              <div class="info-compact">
                <div class="pname-small">${customName.slice(0, 32)}</div>
                <div class="meta-small"><b>B:</b> ${batchNo}</div>
                <div class="meta-small"><b>EXP:</b> ${expiryDate} | HSN: ${hsnCode}</div>
                <div class="meta-small font-bold">MRP: ₹${mrp}</div>
              </div>
            </div>
          </div>
        `).join('');
      } else if (labelFormat === 'pallet-4x6') {
        labelHtml = labelsArray.map(() => `
          <div class="pallet-4x6">
            <div class="pallet-header">
              <div>
                <div class="pallet-brand">BHUMIVERA LOGISTICS HUB</div>
                <div class="pallet-sub">WAREHOUSE MASTER CARTON &amp; PALLET IDENTIFIER</div>
              </div>
              <div class="pallet-hub">ASANSOL HUB (ASN-01)</div>
            </div>
            <hr/>
            <div class="pallet-body">
              <div class="pallet-info">
                <div class="pallet-prod-name">${customName}</div>
                <div class="pallet-sku">SKU: <b>${customSku}</b></div>
                <div class="pallet-batch">BATCH NUMBER: <b>${batchNo}</b></div>
                <div class="pallet-dates">
                  <span>MFG DATE: <b>${mfgDate}</b></span>
                  <span style="margin-left: 20px;">EXPIRY DATE: <b>${expiryDate}</b></span>
                </div>
                <div class="pallet-tax">
                  <span>HSN CODE: <b>${hsnCode}</b></span>
                  <span style="margin-left: 20px;">GST RATE: <b>${gstRate}%</b></span>
                  <span style="margin-left: 20px;">MRP: <b>₹${mrp}</b></span>
                </div>
              </div>
              <div class="pallet-qr">
                <img src="${qrDataUrl}" alt="QR" />
                <div class="pallet-code">${scannablePayload}</div>
              </div>
            </div>
            <div class="pallet-footer">
              SCANNABLE BY BHUMIVERA NATIVE ANDROID SCANNER &amp; USB LASER TERMINAL | 90-DAY TRACEABLE
            </div>
          </div>
        `).join('');
      } else {
        // A4 Sheet Detailed Grid
        labelHtml = `
          <div class="a4-sheet">
            ${labelsArray.map(() => `
              <div class="a4-sticker">
                <div class="brand">BHUMIVERA</div>
                <div class="a4-row">
                  <img src="${qrDataUrl}" class="a4-qr" alt="QR" />
                  <div class="a4-info">
                    <div class="pname">${customName.slice(0, 26)}</div>
                    <div class="meta-line"><b>B:</b> ${batchNo}</div>
                    <div class="meta-line"><b>EXP:</b> ${expiryDate}</div>
                    <div class="meta-line">HSN: ${hsnCode}</div>
                    <div class="price-line">MRP: ₹${mrp}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    }

    const cssStyles = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
        body { background: #fff; color: #000; padding: 0; }
        
        /* A4 Pure QR Grid (Fits Exactly in 1 Page) */
        .a4-page-grid {
          width: 198mm;
          height: 284mm;
          margin: 0 auto;
          box-sizing: border-box;
          page-break-after: always;
          page-break-inside: avoid;
          display: grid;
          padding: 1mm;
        }
        .a4-page-grid:last-child {
          page-break-after: auto;
        }
        .a4-grid-4x6 {
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(6, 1fr);
          gap: 3mm;
        }
        .a4-grid-5x7 {
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(7, 1fr);
          gap: 2.5mm;
        }
        .a4-grid-6x8 {
          grid-template-columns: repeat(6, 1fr);
          grid-template-rows: repeat(8, 1fr);
          gap: 2mm;
        }
        .a4-qr-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #d1d5db;
          border-radius: 2mm;
          padding: 1.5mm;
          overflow: hidden;
          box-sizing: border-box;
        }
        .a4-grid-4x6 .a4-qr-cell img {
          width: 40mm;
          height: 40mm;
          max-width: 95%;
          max-height: 95%;
          object-fit: contain;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        .a4-grid-5x7 .a4-qr-cell img {
          width: 33mm;
          height: 33mm;
          max-width: 95%;
          max-height: 95%;
          object-fit: contain;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        .a4-grid-6x8 .a4-qr-cell img {
          width: 27mm;
          height: 27mm;
          max-width: 95%;
          max-height: 95%;
          object-fit: contain;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        /* Thermal Pure QR */
        .sticker-50x25-pure {
          width: 50mm;
          height: 25mm;
          page-break-after: always;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #ccc;
          overflow: hidden;
        }
        .thermal-pure-qr {
          width: 22mm;
          height: 22mm;
          object-fit: contain;
        }

        .sticker-38x25-pure {
          width: 38mm;
          height: 25mm;
          page-break-after: always;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #ccc;
          overflow: hidden;
        }
        .compact-pure-qr {
          width: 22mm;
          height: 22mm;
          object-fit: contain;
        }

        .pallet-pure {
          width: 4in;
          height: 6in;
          page-break-after: always;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid #000;
          padding: 8mm;
        }
        .pallet-pure-qr {
          width: 70mm;
          height: 70mm;
          object-fit: contain;
        }
        .pallet-pure-code {
          font-size: 11pt;
          font-family: monospace;
          font-weight: bold;
          margin-top: 4mm;
        }

        /* Legacy detailed labels */
        .sticker-50x25 {
          width: 50mm;
          height: 25mm;
          page-break-after: always;
          padding: 1.5mm 2mm;
          border: 1px dashed #ccc;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }
        .brand { font-size: 6.5pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; border-bottom: 0.5px solid #000; padding-bottom: 0.5mm; }
        .content-row { display: flex; align-items: center; justify-content: space-between; height: 100%; margin-top: 1mm; }
        .qr-col { text-align: center; width: 18mm; shrink: 0; }
        .qr-col img { width: 15mm; height: 15mm; display: block; margin: 0 auto; }
        .barcode-text { font-size: 4pt; font-family: monospace; font-weight: bold; margin-top: 0.5mm; word-break: break-all; }
        .info-col { width: 28mm; font-size: 5pt; line-height: 1.25; padding-left: 1mm; }
        .pname { font-weight: 900; font-size: 5.5pt; line-height: 1.15; max-height: 5.5mm; overflow: hidden; margin-bottom: 0.8mm; }
        .meta-line { font-size: 4.8pt; color: #111; }
        .price-line { font-size: 5.5pt; font-weight: 900; margin-top: 0.8mm; }

        .sticker-38x25 {
          width: 38mm;
          height: 25mm;
          page-break-after: always;
          padding: 1.5mm;
          border: 1px dashed #ccc;
          overflow: hidden;
        }
        .qr-small { width: 14mm; height: 14mm; }
        .info-compact { width: 20mm; font-size: 4.5pt; line-height: 1.2; padding-left: 1mm; }
        .pname-small { font-weight: 800; font-size: 4.8pt; overflow: hidden; max-height: 4mm; }
        .meta-small { font-size: 4.2pt; }

        .pallet-4x6 {
          width: 4in;
          height: 6in;
          page-break-after: always;
          padding: 8mm;
          border: 2px solid #000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .pallet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4mm; }
        .pallet-brand { font-size: 14pt; font-weight: 900; letter-spacing: 1px; }
        .pallet-sub { font-size: 7.5pt; font-weight: 700; color: #444; }
        .pallet-hub { font-size: 8.5pt; font-weight: 900; background: #000; color: #fff; padding: 1.5mm 3mm; border-radius: 2mm; }
        .pallet-body { display: flex; justify-content: space-between; align-items: center; margin: 6mm 0; }
        .pallet-info { width: 62%; font-size: 10pt; line-height: 1.6; }
        .pallet-prod-name { font-size: 13pt; font-weight: 900; line-height: 1.2; margin-bottom: 3mm; }
        .pallet-qr { width: 34%; text-align: center; }
        .pallet-qr img { width: 32mm; height: 32mm; }
        .pallet-code { font-size: 7pt; font-family: monospace; font-weight: bold; margin-top: 2mm; }
        .pallet-footer { font-size: 7pt; font-weight: 800; border-top: 1px solid #000; padding-top: 2mm; text-align: center; letter-spacing: 0.5px; }

        .a4-sheet {
          width: 210mm;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2mm;
          padding: 5mm;
          page-break-after: always;
        }
        .a4-sticker {
          height: 33mm;
          border: 1px dashed #bbb;
          padding: 2mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .a4-row { display: flex; align-items: center; justify-content: space-between; margin-top: 1mm; }
        .a4-qr { width: 17mm; height: 17mm; }
        .a4-info { width: 42mm; font-size: 6pt; line-height: 1.25; padding-left: 2mm; }

        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm 6mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            margin: 0;
            padding: 0;
          }
          .sticker-50x25, .sticker-38x25, .pallet-4x6, .a4-sheet, .sticker-50x25-pure, .sticker-38x25-pure, .pallet-pure {
            border: none !important;
          }
          .a4-qr-cell {
            border: 0.5px dashed #e2e8f0 !important;
          }
        }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bhumivera Batch Barcode Labels - ${customSku} - ${batchNo}</title>
          ${cssStyles}
        </head>
        <body>
          ${labelHtml}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 800);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0c261b] border-2 border-emerald-500/40 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-[#071711] border-b border-emerald-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide">
                  Batch &amp; Product Barcode/QR Generator Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/30 text-emerald-200 border border-emerald-500/40">
                  Android Scanner 2.0 Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Generate instant scannable labels for warehouse picking, packing, inventory audit, and retail POS checkout.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 2 Columns */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Product Picker */}
            <div>
              <label className="block text-xs font-black uppercase text-emerald-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" /> Select Catalog Formulation
              </label>
              <select
                value={selectedProductId}
                onChange={e => handleSelectProduct(e.target.value)}
                className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-400"
              >
                {catalog.map(item => (
                  <option key={item.id || item.metaId} value={String(item.id || item.metaId)}>
                    {item.name} ({item.sku || 'NO-SKU'}) — Stock: {item.availableStock ?? item.physicalStock ?? 0}
                  </option>
                ))}
              </select>
            </div>

            {/* SKU and Batch Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Product SKU</label>
                <input
                  type="text"
                  value={customSku}
                  onChange={e => setCustomSku(e.target.value)}
                  className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-300 focus:outline-none"
                  placeholder="BV-LUX-CFW-01"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Batch Code *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={batchNo}
                    onChange={e => setBatchNo(e.target.value)}
                    className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-400"
                    placeholder="BV-BATCH-2026-CF01"
                  />
                  <button
                    type="button"
                    onClick={() => setBatchNo(`BV-BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="absolute right-2 top-2 text-[10px] text-emerald-400 hover:text-emerald-300 font-bold"
                    title="Generate Random Batch"
                  >
                    Auto
                  </button>
                </div>
              </div>
            </div>

            {/* Mfg & Expiry Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" /> Mfg Date
                </label>
                <input
                  type="date"
                  value={mfgDate}
                  onChange={e => setMfgDate(e.target.value)}
                  className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" /> Expiry Date (FEFO)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            {/* HSN Code & GST Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">GST HSN Code</label>
                <input
                  type="text"
                  value={hsnCode}
                  onChange={e => setHsnCode(e.target.value)}
                  className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">GST Rate (%)</label>
                <input
                  type="text"
                  value={gstRate}
                  onChange={e => setGstRate(e.target.value)}
                  className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">MRP (₹)</label>
                <input
                  type="text"
                  value={mrp}
                  onChange={e => setMrp(e.target.value)}
                  className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            {/* PURE QR MODE TOGGLE (Checked by default for fast scanning & zero clutter) */}
            <div className="flex items-center justify-between p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl shadow-inner">
              <div className="space-y-0.5 pr-2">
                <div className="text-xs font-black uppercase text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Pure QR Code Only (No Text / Zero Clutter)
                </div>
                <p className="text-[11px] text-slate-300">
                  Optimized for quick scanning. Fits pure, large QR codes across a single A4 page with zero text clipping.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={pureQrMode}
                  onChange={e => setPureQrMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Label Media Type & Print Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Print Layout &amp; Media</label>
                <select
                  value={labelFormat}
                  onChange={e => {
                    const val = e.target.value;
                    setLabelFormat(val);
                    if (val === 'a4-sheet-24' || val === 'a4-sheet') setPrintQuantity(24);
                    else if (val === 'a4-sheet-35') setPrintQuantity(35);
                    else if (val === 'a4-sheet-48') setPrintQuantity(48);
                  }}
                  className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="a4-sheet-24">A4 Page — 24 Large QRs (4×6 Grid, 40mm Ultra-Fast Scan)</option>
                  <option value="a4-sheet-35">A4 Page — 35 Medium QRs (5×7 Grid, 33mm)</option>
                  <option value="a4-sheet-48">A4 Page — 48 Compact QRs (6×8 Grid, 27mm)</option>
                  <option value="thermal-50x25">Thermal Roll (50mm × 25mm / 2"×1")</option>
                  <option value="compact-38x25">Compact Roll (38mm × 25mm)</option>
                  <option value="pallet-4x6">Master Carton / Pallet (4" × 6")</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Print Quantity (Copies)</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={printQuantity}
                  onChange={e => setPrintQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-mono font-black text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Fill Sheet Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Quick Sheet Fill:</span>
              <button
                type="button"
                onClick={() => { setLabelFormat('a4-sheet-24'); setPrintQuantity(24); }}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition border ${
                  labelFormat === 'a4-sheet-24' && printQuantity === 24
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                    : 'bg-[#071711] text-emerald-300 border-emerald-500/30 hover:bg-emerald-950'
                }`}
              >
                📄 Fill 1 A4 Page (24 QRs)
              </button>
              <button
                type="button"
                onClick={() => { setLabelFormat('a4-sheet-24'); setPrintQuantity(48); }}
                className="px-2.5 py-1 text-[10px] font-bold bg-[#071711] text-slate-300 border border-emerald-500/30 hover:bg-emerald-950 rounded-lg transition"
              >
                📄 Fill 2 A4 Pages (48 QRs)
              </button>
              <button
                type="button"
                onClick={() => { setLabelFormat('a4-sheet-35'); setPrintQuantity(35); }}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition border ${
                  labelFormat === 'a4-sheet-35' && printQuantity === 35
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                    : 'bg-[#071711] text-emerald-300 border-emerald-500/30 hover:bg-emerald-950'
                }`}
              >
                📄 Fill 1 A4 Page (35 QRs)
              </button>
            </div>

            {/* Encoded Scannable String Display */}
            <div className="p-3 bg-[#071711] border border-emerald-500/30 rounded-xl flex items-center justify-between gap-2">
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">QR Encoded Payload:</span>
                <span className="text-xs font-mono font-bold text-white truncate block">{scannablePayload}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyPayload}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg flex items-center gap-1 shrink-0 transition"
              >
                {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Right Column: Live Printable Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between bg-[#071711] p-4 rounded-xl border border-emerald-500/30 space-y-4">
            <div className="w-full text-center">
              <span className="text-[11px] font-black uppercase text-emerald-300 tracking-wider flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Live Sticker Preview ({pureQrMode ? 'Pure QR' : labelFormat})
              </span>
            </div>

            {/* Sticker Graphic Container */}
            {pureQrMode ? (
              <div className="bg-white text-black p-4 rounded-xl shadow-2xl border-2 border-emerald-500 w-full max-w-[260px] flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-150">
                <div className="w-48 h-48 flex items-center justify-center p-1 bg-white">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Pure QR" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-mono">Generating QR...</div>
                  )}
                </div>
                <div className="mt-2 text-[9px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300 truncate max-w-full">
                  {scannablePayload}
                </div>
                <div className="mt-1.5 text-[8.5px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1 justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SINGLE A4 PAGE GRID OPTIMIZED
                </div>
              </div>
            ) : (
              <div className="bg-white text-black p-3 rounded-lg shadow-xl border border-slate-300 w-full max-w-[280px]">
                <div className="text-[8px] font-black uppercase tracking-wider border-b border-black pb-0.5 mb-1 text-center">
                  BHUMIVERA AUSHADH
                </div>
                <div className="flex items-center gap-2">
                  <div className="shrink-0 text-center">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="QR" className="w-16 h-16 border border-slate-300" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 flex items-center justify-center text-[8px]">QR</div>
                    )}
                    <span className="text-[6px] font-mono font-bold block truncate max-w-[70px]">
                      {customSku}
                    </span>
                  </div>
                  <div className="text-[7.5px] leading-tight space-y-0.5 overflow-hidden">
                    <div className="font-black truncate">{customName || 'Bhumivera Formulation'}</div>
                    <div><b>BATCH:</b> <span className="font-mono">{batchNo}</span></div>
                    <div><b>MFG:</b> {mfgDate} | <b>EXP:</b> {expiryDate}</div>
                    <div><b>HSN:</b> {hsnCode} (5% GST)</div>
                    <div className="font-black text-[8.5px] pt-0.5">MRP: ₹{mrp} (Incl. Taxes)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Info Notice */}
            <div className="w-full text-[11px] text-slate-300 bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-lg space-y-1">
              <div className="font-bold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fast Scanning Guarantee:
              </div>
              <p className="text-[10px] text-slate-300 leading-normal">
                {pureQrMode
                  ? 'Pure QR mode maximizes the QR matrix size to 40mm on A4 sheets with zero text, enabling sub-10ms camera decoding and effortless distance scanning.'
                  : 'Scanning this QR with the Bhumivera Scanner APK instantly resolves the product name, verifies the batch, checks FEFO expiry, and pushes it to POS / Packing Station in <15ms.'}
              </p>
            </div>

            {/* Print Action Buttons */}
            <div className="w-full pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print {printQuantity} Pure {printQuantity === 1 ? 'QR' : 'QRs'} (Single A4 Page)
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
