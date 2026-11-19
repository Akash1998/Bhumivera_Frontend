import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Printer,
  X,
  Layers,
  Calendar,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Download,
  Sparkles,
  Grid,
  Sliders,
} from 'lucide-react';

/**
 * Generates a compact, standalone product QR payload (BV-QR:<SKU>)
 * so mobile cameras can focus and decode in <10ms without dense URL modules.
 */
export function buildStandaloneProductQr(sku, batchNo = '') {
  const cleanSku = String(sku || 'BV-PRODUCT').trim().toUpperCase();
  if (batchNo && String(batchNo).trim()) {
    return `BV-QR:${cleanSku}:${String(batchNo).trim()}`;
  }
  return `BV-QR:${cleanSku}`;
}

async function buildHighResolutionQr(payload) {
  const svg = await QRCode.toString(payload, {
    type: 'svg',
    width: 1080,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel: 'M',
  });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeSvgText(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[character]);
}

function wrapSvgText(value, maxLength, maxLines = 2) {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  words.forEach(word => {
    if (line && `${line} ${word}`.length > maxLength) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  });
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, maxLength - 1)}…`;
  }
  return lines;
}

function buildLabeledQrSvg(qrDataUrl, { name, sku, price }) {
  if (!qrDataUrl) return '';
  const qrSvgSource = decodeURIComponent(qrDataUrl.slice(qrDataUrl.indexOf(',') + 1));
  const qrDocument = new DOMParser().parseFromString(qrSvgSource, 'image/svg+xml');
  const qrSvg = qrDocument.documentElement;
  if (qrSvg.localName !== 'svg' || qrDocument.querySelector('parsererror')) {
    throw new Error('Could not prepare the high-quality QR download.');
  }

  const nameLines = wrapSvgText(name, 44);
  const nameText = nameLines.map((line, index) =>
    `<text x="540" y="${1070 + index * 46}" text-anchor="middle" font-family="Arial,sans-serif" font-size="38" font-weight="700" fill="#111">${escapeSvgText(line)}</text>`
  ).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1340" viewBox="0 0 1080 1340">
    <title>Bhumivera product QR — ${escapeSvgText(name)}</title>
    <desc>High-quality product QR with name, SKU, price, and scan payload.</desc>
    <rect width="1080" height="1340" fill="#fff"/>
    <svg x="40" y="20" width="1000" height="1000" viewBox="${escapeSvgText(qrSvg.getAttribute('viewBox') || '0 0 1080 1080')}" shape-rendering="crispEdges">${qrSvg.innerHTML}</svg>
    ${nameText}
    <text x="540" y="1180" text-anchor="middle" font-family="monospace" font-size="30" font-weight="700" fill="#334155">${escapeSvgText(sku)} · ₹${escapeSvgText(price)}</text>
  </svg>`;
}

/**
 * Fits the requested batch on one A4 sheet, maximizing QR size within that constraint.
 */
export function computeOptimalA4QrLayout(requestedCount = 24, showLabel = true) {
  const totalCount = Math.max(1, Math.min(500, Math.trunc(Number(requestedCount) || 24)));
  const printableWidthMm = 202;
  const printableHeightMm = 289;
  const pagePaddingMm = 1;
  const gapMm = 1;
  const labelAllowanceMm = showLabel ? 8 : 2;
  let bestLayout = null;

  for (let cols = 1; cols <= totalCount; cols += 1) {
    const rows = Math.ceil(totalCount / cols);
    const cellWidthMm = (printableWidthMm - pagePaddingMm - (cols - 1) * gapMm) / cols;
    const cellHeightMm = (printableHeightMm - pagePaddingMm - (rows - 1) * gapMm) / rows;
    const qrSizeMm = Math.max(1, Math.min(38, Math.floor(Math.min(cellWidthMm - 1, cellHeightMm - labelAllowanceMm))));
    const capacity = cols * rows;
    const shapeDifference = Math.abs(cellWidthMm - (cellHeightMm - labelAllowanceMm));

    if (
      !bestLayout ||
      qrSizeMm > bestLayout.qrSizeMm ||
      (qrSizeMm === bestLayout.qrSizeMm && capacity < bestLayout.capacity) ||
      (qrSizeMm === bestLayout.qrSizeMm && capacity === bestLayout.capacity && shapeDifference < bestLayout.shapeDifference)
    ) {
      bestLayout = { cols, rows, cellWidthMm, cellHeightMm, qrSizeMm, capacity, shapeDifference };
    }
  }

  return {
    totalCount,
    cols: bestLayout.cols,
    rows: bestLayout.rows,
    perPage: totalCount,
    totalPages: 1,
    gapMm,
    cellWidthMm: Number(bestLayout.cellWidthMm.toFixed(1)),
    cellHeightMm: Number(bestLayout.cellHeightMm.toFixed(1)),
    qrSizeMm: bestLayout.qrSizeMm,
    maxQrMm: 38,
    showLabel: Boolean(showLabel),
  };
}

export default function BatchBarcodeGeneratorModal({
  isOpen,
  onClose,
  catalog = [],
  initialProduct = null,
  initialBatch = '',
}) {
  // Mode: 'all-products' (generate unique standalone QR for every product) | 'single-product'
  const [generationMode, setGenerationMode] = useState(initialProduct ? 'single-product' : 'all-products');
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

  // A4 auto-sizing vs thermal roll media
  const [mediaType, setMediaType] = useState('a4-auto'); // 'a4-auto' | 'thermal-50x25' | 'compact-38x25' | 'pallet-4x6'
  const [showCompactTag, setShowCompactTag] = useState(true); // Two-line product name + SKU under QR
  const [includeBatchInQr, setIncludeBatchInQr] = useState(false); // Standalone SKU QR by default for fastest scan
  const [printQuantity, setPrintQuantity] = useState(10);

  // Per-product selection & quantities for 'all-products' mode
  const [selectedProductMap, setSelectedProductMap] = useState({});
  const [qrMapBySku, setQrMapBySku] = useState({});
  const [singleQrDataUrl, setSingleQrDataUrl] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Set default dates
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

  // Initialize catalog selection
  useEffect(() => {
    if (!isOpen) return;

    if (initialProduct) {
      setGenerationMode('single-product');
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

    // Initialize all non-bundle products (or first 6+ products) as selected for All-Products mode
    if (catalog && catalog.length > 0) {
      const coreProducts = catalog.filter(p => !p.isBundle);
      const targetList = coreProducts.length > 0 ? coreProducts : catalog;
      const nextMap = {};
      targetList.forEach(p => {
        const key = String(p.id || p.metaId || p.sku);
        nextMap[key] = true;
      });
      setSelectedProductMap(nextMap);
    }
  }, [isOpen, initialProduct, initialBatch, catalog]);

  // Generate QR data URLs for all catalog products
  useEffect(() => {
    if (!isOpen || !catalog || catalog.length === 0) return;
    let active = true;

    async function generateAllProductQrs() {
      const entries = {};
      for (const item of catalog) {
        const sku = String(item.sku || `SKU-${item.id}`).trim().toUpperCase();
        const payload = buildStandaloneProductQr(sku, includeBatchInQr ? item.batchNo : '');
        try {
          const url = await buildHighResolutionQr(payload);
          entries[sku] = { url, payload };
        } catch {
          // ignore individual failure
        }
      }
      if (active) setQrMapBySku(entries);
    }

    generateAllProductQrs();
    return () => {
      active = false;
    };
  }, [isOpen, catalog, includeBatchInQr]);

  // Handle changing product from dropdown in single-product mode
  const handleSelectProduct = prodId => {
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

  // Single-product standalone QR payload
  const scannablePayload = useMemo(() => {
    return buildStandaloneProductQr(customSku || 'BV-PRODUCT', includeBatchInQr ? batchNo : '');
  }, [customSku, batchNo, includeBatchInQr]);

  useEffect(() => {
    let active = true;
    if (!scannablePayload) return;

    buildHighResolutionQr(scannablePayload)
      .then(url => {
        if (active) setSingleQrDataUrl(url);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [scannablePayload]);

  // Selected products in All-Products mode
  const activeAllProducts = useMemo(() => {
    return catalog.filter(p => selectedProductMap[String(p.id || p.metaId || p.sku)]);
  }, [catalog, selectedProductMap]);

  // Compute optimal A4 layout for current printQuantity
  const a4Layout = useMemo(() => {
    return computeOptimalA4QrLayout(printQuantity, showCompactTag);
  }, [printQuantity, showCompactTag]);

  const previewProduct = generationMode === 'all-products' ? activeAllProducts[0] : null;
  const previewSku = String(previewProduct?.sku || customSku || 'BV-PRODUCT').trim().toUpperCase();
  const previewQr = previewProduct ? qrMapBySku[previewSku]?.url : singleQrDataUrl;
  const previewName = previewProduct?.name || customName || 'Bhumivera Formulation';
  const previewPrice = previewProduct?.price || previewProduct?.sellingPrice || previewProduct?.mrp || sellingPrice;
  const previewPayload = previewProduct ? qrMapBySku[previewSku]?.payload : scannablePayload;
  const safeDownloadSku = previewSku.replace(/[^a-z0-9._-]+/gi, '-') || 'bhumivera-product';
  const labeledQrSvg = useMemo(
    () => buildLabeledQrSvg(previewQr, { name: previewName, sku: previewSku, price: previewPrice }),
    [previewQr, previewName, previewSku, previewPrice],
  );
  const downloadQrUrl = labeledQrSvg
    ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(labeledQrSvg)}`
    : '';

  if (!isOpen) return null;

  const handleToggleProductSelection = prod => {
    const key = String(prod.id || prod.metaId || prod.sku);
    setSelectedProductMap(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCopyPayload = () => {
    navigator.clipboard?.writeText(scannablePayload);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Build the exact list of sticker items to print based on mode and printQuantity
  const buildStickerItemsToPrint = () => {
    const totalCount = Math.max(1, Math.min(500, Number(printQuantity) || 1));

    if (generationMode === 'all-products' && activeAllProducts.length > 0) {
      // Distribute totalCount across all selected products evenly so each product gets its unique standalone QR code!
      const stickers = [];
      for (let i = 0; i < totalCount; i++) {
        const prod = activeAllProducts[i % activeAllProducts.length];
        const sku = String(prod.sku || `SKU-${prod.id}`).trim().toUpperCase();
        const qrInfo = qrMapBySku[sku];
        stickers.push({
          sku,
          name: prod.name || sku,
          price: prod.price || prod.sellingPrice || prod.mrp || 0,
          mrp: prod.mrp || prod.price || 0,
          batchNo: prod.batchNo || batchNo,
          hsnCode: prod.gstHsnCode || hsnCode || '30049011',
          qrDataUrl: qrInfo?.url || singleQrDataUrl,
          payload: qrInfo?.payload || buildStandaloneProductQr(sku),
        });
      }
      return stickers;
    }

    // Single product mode: repeat the selected product's standalone QR totalCount times
    return Array.from({ length: totalCount }, () => ({
      sku: customSku || 'BV-PRODUCT',
      name: customName || 'Bhumivera Formulation',
      price: sellingPrice,
      mrp,
      batchNo,
      hsnCode,
      qrDataUrl: singleQrDataUrl,
      payload: scannablePayload,
    }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups to print QR code sheets.');
      return;
    }

    const stickers = buildStickerItemsToPrint();
    const layout = computeOptimalA4QrLayout(stickers.length, showCompactTag);

    const escapeHtml = val =>
      String(val ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[ch]);

    let labelHtml = '';

    if (mediaType === 'a4-auto') {
      const pages = [];
      for (let i = 0; i < stickers.length; i += layout.perPage) {
        pages.push(stickers.slice(i, i + layout.perPage));
      }

      labelHtml = pages
        .map(
          pageItems => `
          <div class="a4-auto-page">
            ${pageItems
              .map(
                st => `
              <div class="a4-qr-cell">
                <img src="${st.qrDataUrl}" alt="${escapeHtml(st.sku)}" class="qr-img" />
                ${
                  showCompactTag
                    ? `
                  <div class="qr-caption-name">${escapeHtml(st.name.replace(/\(.*?\)/g, '').trim())}</div>
                  <div class="qr-caption-sku">${escapeHtml(st.sku)} · ₹${escapeHtml(st.price)}</div>
                `
                    : ''
                }
              </div>
            `
              )
              .join('')}
          </div>
        `
        )
        .join('');
    } else if (mediaType === 'thermal-50x25') {
      labelHtml = stickers
        .map(
          st => `
        <div class="sticker-50x25-pure">
          <img src="${st.qrDataUrl}" alt="QR" class="thermal-pure-qr" />
          ${showCompactTag ? `<div class="thermal-caption">${escapeHtml(st.sku)}</div>` : ''}
        </div>
      `
        )
        .join('');
    } else if (mediaType === 'compact-38x25') {
      labelHtml = stickers
        .map(
          st => `
        <div class="sticker-38x25-pure">
          <img src="${st.qrDataUrl}" alt="QR" class="compact-pure-qr" />
          ${showCompactTag ? `<div class="thermal-caption">${escapeHtml(st.sku)}</div>` : ''}
        </div>
      `
        )
        .join('');
    } else {
      labelHtml = stickers
        .map(
          st => `
        <div class="pallet-pure">
          <img src="${st.qrDataUrl}" alt="QR" class="pallet-pure-qr" />
          <div class="pallet-pure-code">${escapeHtml(st.name)}</div>
          <div class="pallet-pure-sku">${escapeHtml(st.payload)}</div>
        </div>
      `
        )
        .join('');
    }

    const cssStyles = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
        body { background: #fff; color: #000; padding: 0; }

        .a4-auto-page {
          width: 202mm;
          height: 289mm;
          margin: 0 auto;
          page-break-after: always;
          page-break-inside: avoid;
          display: grid;
          grid-template-columns: repeat(${layout.cols}, 1fr);
          grid-template-rows: repeat(${layout.rows}, 1fr);
          gap: ${layout.gapMm}mm;
          padding: 0.5mm;
          align-items: stretch;
        }
        .a4-auto-page:last-child {
          page-break-after: auto;
        }
        .a4-qr-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px dashed #cbd5e1;
          border-radius: 2.5mm;
          padding: 1mm;
          overflow: hidden;
          background: #fff;
        }
        .a4-qr-cell .qr-img {
          width: ${layout.qrSizeMm}mm;
          height: ${layout.qrSizeMm}mm;
          object-fit: contain;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          display: block;
        }
        .qr-caption-name {
          margin-top: 0.5mm;
          max-width: 100%;
          font-size: 5pt;
          font-weight: 800;
          color: #0f172a;
          text-align: center;
          line-height: 1.05;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow-wrap: anywhere;
          overflow: hidden;
          max-height: 2.1em;
        }
        .qr-caption-sku {
          max-width: 100%;
          font-size: 4.5pt;
          font-family: monospace;
          font-weight: 700;
          color: #334155;
          text-align: center;
          margin-top: 0.2mm;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sticker-50x25-pure {
          width: 50mm;
          height: 25mm;
          page-break-after: always;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px dashed #ccc;
          overflow: hidden;
        }
        .thermal-pure-qr { width: 20mm; height: 20mm; object-fit: contain; }
        .thermal-caption { font-size: 6pt; font-family: monospace; font-weight: 800; margin-top: 0.5mm; }

        .sticker-38x25-pure {
          width: 38mm;
          height: 25mm;
          page-break-after: always;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px dashed #ccc;
          overflow: hidden;
        }
        .compact-pure-qr { width: 20mm; height: 20mm; object-fit: contain; }

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
          text-align: center;
        }
        .pallet-pure-qr { width: 65mm; height: 65mm; object-fit: contain; }
        .pallet-pure-code { font-size: 12pt; font-weight: 900; margin-top: 4mm; }
        .pallet-pure-sku { font-size: 10pt; font-family: monospace; font-weight: 700; margin-top: 2mm; }

        @media print {
          @page {
            size: A4 portrait;
            margin: 4mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .a4-qr-cell {
            border: 0.5px dashed #cbd5e1 !important;
          }
        }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bhumivera Standalone Product QR Sheet (${stickers.length} QRs)</title>
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
      <div className="bg-[#0c261b] border-2 border-emerald-500/40 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-[#071711] border-b border-emerald-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide">
                  Standalone Product QR &amp; Smart A4 Auto-Sizing Print Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/30 text-emerald-200 border border-emerald-500/40">
                  Mobile Fast-Scan Optimized ({a4Layout.qrSizeMm}mm)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Generate unique standalone QR codes for all products (or any single product) with automatic A4 page sizing for 6, 10, 20, or any count you choose.
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

        {/* Mode Switcher Tabs */}
        <div className="px-6 pt-4 bg-[#0c261b] flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setGenerationMode('all-products');
                const count = activeAllProducts.length || 6;
                if (printQuantity < count) setPrintQuantity(count);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition border ${
                generationMode === 'all-products'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md'
                  : 'bg-[#071711] text-slate-300 border-emerald-500/30 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> All Products Unique QRs ({activeAllProducts.length} Products)
            </button>
            <button
              type="button"
              onClick={() => setGenerationMode('single-product')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition border ${
                generationMode === 'single-product'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md'
                  : 'bg-[#071711] text-slate-300 border-emerald-500/30 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" /> Single Product QR Sheet
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-300 bg-[#071711] px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Auto A4 Grid: <b>{a4Layout.cols}×{a4Layout.rows}</b> ({a4Layout.perPage}/page) • QR Size:{' '}
              <b>{a4Layout.qrSizeMm}mm×{a4Layout.qrSizeMm}mm</b> ({a4Layout.totalPages}{' '}
              {a4Layout.totalPages === 1 ? 'A4 Page' : 'A4 Pages'})
            </span>
          </div>
        </div>

        {/* Modal Body: Split 2 Columns */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Controls & Product Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {generationMode === 'all-products' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-emerald-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" /> Unique Standalone QR for Each Product ({activeAllProducts.length} Selected)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const all = {};
                        catalog.forEach(p => {
                          all[String(p.id || p.metaId || p.sku)] = true;
                        });
                        setSelectedProductMap(all);
                      }}
                      className="text-[10px] text-emerald-300 hover:text-white underline font-bold"
                    >
                      Select All ({catalog.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const coreOnly = {};
                        catalog.filter(p => !p.isBundle).slice(0, 6).forEach(p => {
                          coreOnly[String(p.id || p.metaId || p.sku)] = true;
                        });
                        setSelectedProductMap(coreOnly);
                        setPrintQuantity(6);
                      }}
                      className="text-[10px] text-teal-300 hover:text-white underline font-bold"
                    >
                      Select 6 Core Products
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[250px] overflow-y-auto pr-1">
                  {catalog.map(prod => {
                    const key = String(prod.id || prod.metaId || prod.sku);
                    const checked = Boolean(selectedProductMap[key]);
                    const sku = String(prod.sku || `SKU-${prod.id}`).toUpperCase();
                    const qrEntry = qrMapBySku[sku];
                    return (
                      <div
                        key={key}
                        onClick={() => handleToggleProductSelection(prod)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                          checked
                            ? 'bg-[#071711] border-emerald-400 shadow-sm'
                            : 'bg-[#071711]/40 border-slate-700 opacity-60 hover:opacity-90'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-0"
                        />
                        {qrEntry?.url ? (
                          <img src={qrEntry.url} alt={sku} className="w-10 h-10 rounded bg-white p-0.5 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-slate-800 shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">{prod.name}</div>
                          <div className="text-[10px] font-mono text-emerald-300 truncate">
                            {qrEntry?.payload || `BV-QR:${sku}`} • ₹{prod.price}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                {/* Single Product Picker */}
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
                        {item.name} ({item.sku || 'NO-SKU'}) — ₹{item.price} — Stock: {item.availableStock ?? item.physicalStock ?? item.qty ?? 0}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SKU and Batch Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Product SKU (Unique ID)</label>
                    <input
                      type="text"
                      value={customSku}
                      onChange={e => setCustomSku(e.target.value)}
                      className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-300 focus:outline-none"
                      placeholder="BV-LUX-CFW-01"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Batch Code (Optional)</label>
                    <input
                      type="text"
                      value={batchNo}
                      onChange={e => setBatchNo(e.target.value)}
                      className="w-full bg-[#071711] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-400"
                      placeholder="BV-BATCH-2026-CF01"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Print Quantity & A4 Auto-Adjust Controls */}
            <div className="p-4 bg-[#071711] border border-emerald-500/40 rounded-xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-emerald-300 mb-1">
                    Paper &amp; Auto-Size Format
                  </label>
                  <select
                    value={mediaType}
                    onChange={e => setMediaType(e.target.value)}
                    className="w-full bg-[#0c261b] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="a4-auto">A4 Paper — One-Page QR Grid (up to 38mm)</option>
                    <option value="thermal-50x25">Thermal Sticker Roll (50mm × 25mm)</option>
                    <option value="compact-38x25">Compact Sticker Roll (38mm × 25mm)</option>
                    <option value="pallet-4x6">Master Carton / Pallet (4&quot; × 6&quot;)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-emerald-300 mb-1">
                    How Many QR Codes to Print? (Custom Count)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={printQuantity}
                    onChange={e => setPrintQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full bg-[#0c261b] border border-emerald-400 rounded-xl px-3 py-2 text-sm font-mono font-black text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Instant Choice Chips: 6, 10, 12, 15, 20, 24, 30, 35, 48 */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">
                  Quick Print Count (Auto-Adjusts A4 Grid &amp; QR Size):
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { count: 6, label: '6 QRs (1 per Product)' },
                    { count: 10, label: '10 QRs' },
                    { count: 12, label: '12 QRs (2 per Product)' },
                    { count: 15, label: '15 QRs' },
                    { count: 20, label: '20 QRs' },
                    { count: 24, label: '24 QRs (1 A4 page)' },
                    { count: 35, label: '35 QRs (1 A4 page)' },
                    { count: 48, label: '48 QRs (1 A4 page)' },
                  ].map(preset => (
                    <button
                      key={preset.count}
                      type="button"
                      onClick={() => {
                        setMediaType('a4-auto');
                        setPrintQuantity(preset.count);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition border ${
                        printQuantity === preset.count
                          ? 'bg-emerald-600 text-white border-emerald-300 shadow-sm'
                          : 'bg-[#0c261b] text-emerald-200 border-emerald-500/30 hover:bg-emerald-900/60'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scannability & Label Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl">
                <div className="pr-2">
                  <div className="text-xs font-black text-emerald-300">Show Product Name &amp; SKU Tag</div>
                  <p className="text-[10px] text-slate-300">
                    Prints the product name in up to two compact lines under each QR.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={showCompactTag}
                  onChange={e => setShowCompactTag(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl">
                <div className="pr-2">
                  <div className="text-xs font-black text-emerald-300">Include Batch # in QR</div>
                  <p className="text-[10px] text-slate-300">
                    Off = Pure standalone SKU QR (<code className="font-mono">BV-QR:SKU</code>) for fastest mobile scan.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeBatchInQr}
                  onChange={e => setIncludeBatchInQr(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
              </div>
            </div>

            {/* Encoded Scannable String Display */}
            <div className="p-3 bg-[#071711] border border-emerald-500/30 rounded-xl flex items-center justify-between gap-2">
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                  Standalone QR Payload Format (Instant Mobile Scan):
                </span>
                <span className="text-xs font-mono font-bold text-white truncate block">
                  {generationMode === 'all-products'
                    ? `BV-QR:<PRODUCT_SKU> (${activeAllProducts.length} unique product QR codes)`
                    : scannablePayload}
                </span>
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
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Live Mobile-Scannable QR Preview ({a4Layout.qrSizeMm}mm on A4)
              </span>
            </div>

            <div className="bg-white text-black p-4 rounded-xl shadow-2xl border-2 border-emerald-500 w-full max-w-[260px] flex flex-col items-center justify-center text-center">
              <div className="w-44 h-44 flex items-center justify-center p-1 bg-white">
                {previewQr ? (
                  <img src={previewQr} alt={`Standalone Product QR for ${previewSku}`} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-mono">Generating QR...</div>
                )}
              </div>
              {showCompactTag && (
                <div className="mt-1.5 text-center max-w-full">
                  <div className="line-clamp-2 break-words text-[10px] font-black text-slate-900">
                    {previewName.replace(/\(.*?\)/g, '').trim()}
                  </div>
                  <div className="text-[9px] font-mono font-bold text-slate-700">
                    {previewSku} • ₹{previewPrice}
                  </div>
                </div>
              )}
              <div className="mt-1.5 text-[9px] font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300 truncate max-w-full">
                {previewPayload}
              </div>
            </div>

            {/* Smart A4 Auto-Sizing Summary Card */}
            <div className="w-full text-[11px] text-slate-300 bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-lg space-y-1">
              <div className="font-bold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Smart A4 Size Guarantee:
              </div>
              <p className="text-[10px] text-slate-300 leading-normal">
                Printing <b>{printQuantity}</b> QR codes on one A4 page in a{' '}
                <b>
                  {a4Layout.cols} columns × {a4Layout.rows} rows
                </b>{' '}
                with each QR code sized to exactly <b>{a4Layout.qrSizeMm}mm × {a4Layout.qrSizeMm}mm</b>. The QR artwork is vector-based for sharp printing.
              </p>
            </div>

            {/* Print Action Buttons */}
            <div className="w-full pt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                {generationMode === 'all-products'
                  ? `Print ${printQuantity} Unique Product QRs on A4 (${a4Layout.qrSizeMm}mm)`
                  : `Print ${printQuantity} Product QRs on A4 (${a4Layout.qrSizeMm}mm)`}
              </button>
              <a
                href={downloadQrUrl || undefined}
                download={`${safeDownloadSku}-qr.svg`}
                aria-disabled={!previewQr}
                className={`w-full py-2.5 border font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 ${
                  previewQr
                    ? 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 border-emerald-500/40'
                    : 'pointer-events-none opacity-50 bg-slate-800 text-slate-400 border-slate-600'
                }`}
              >
                <Download className="w-4 h-4" />
                Download Highest-Quality QR (SVG)
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold text-xs rounded-xl transition"
              >
                Close Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
