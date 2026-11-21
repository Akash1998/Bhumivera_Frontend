import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Printer,
  X,
  Layers,
  Tag,
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
    width: 8192,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel: 'M',
  });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getComboComponentProducts(combo, catalog) {
  const components = Array.isArray(combo?.comboComponents) ? combo.comboComponents : [];
  return components
    .map(component => {
      const componentId = component.product_id ?? component.id;
      const componentSlug = String(component.slug || '').trim();
      return catalog.find(product =>
        (componentId != null && String(product.productId ?? product.id ?? product.metaId) === String(componentId)) ||
        (componentSlug && String(product.slug || '').trim() === componentSlug)
      );
    })
    .filter((product, index, products) =>
      product && products.findIndex(candidate => String(candidate.id || candidate.metaId || candidate.sku) === String(product.id || product.metaId || product.sku)) === index
    );
}

function getComboComponentLabels(combo, catalog) {
    const components = Array.isArray(combo?.comboComponents) ? combo.comboComponents : [];
    return components.map(component => {
      const componentId = component.product_id ?? component.id;
      const componentSlug = String(component.slug || '').trim();
      const product = catalog.find(item =>
        (componentId != null && String(item.productId ?? item.id ?? item.metaId) === String(componentId)) ||
        (componentSlug && String(item.slug || '').trim() === componentSlug)
      );
      if (!product) return '';
      const quantity = Math.max(1, Number(component.quantity) || 1);
      return `${product.name}${quantity > 1 ? ` ×${quantity}` : ''}`;
    }).filter(Boolean);
}

export function computeQrSheetLayout(pageWidthMm = 210, pageHeightMm = 297) {
  const qrSizeMm = 19;
  const marginMm = 4;
  const gapMm = 1;
  const width = Math.min(1000, Math.max(50, Number(pageWidthMm) || 210));
  const height = Math.min(1000, Math.max(50, Number(pageHeightMm) || 297));
  const cols = Math.max(1, Math.floor((width - 2 * marginMm + gapMm) / (qrSizeMm + gapMm)));
  const rows = Math.max(1, Math.floor((height - 2 * marginMm + gapMm) / (qrSizeMm + gapMm)));

  return {
    cols,
    rows,
    capacity: cols * rows,
    marginMm,
    gapMm,
    qrSizeMm,
    pageWidthMm: width,
    pageHeightMm: height,
  };
}

export default function BatchBarcodeGeneratorModal({
  isOpen,
  onClose,
  catalog = [],
  initialProduct = null,
}) {
  // Mode: 'all-products' (generate unique standalone QR for every product) | 'single-product'
  const [generationMode, setGenerationMode] = useState(initialProduct ? 'single-product' : 'all-products');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customSku, setCustomSku] = useState('');
  const [paperSize, setPaperSize] = useState('a4');
  const [paperWidthMm, setPaperWidthMm] = useState('210');
  const [paperHeightMm, setPaperHeightMm] = useState('297');

  // Per-product selection & quantities for 'all-products' mode
  const [selectedProductMap, setSelectedProductMap] = useState({});
  const [qrMapBySku, setQrMapBySku] = useState({});
  const [singleQrDataUrl, setSingleQrDataUrl] = useState('');
  const [qrGenerationError, setQrGenerationError] = useState('');
  // Initialize catalog selection
  useEffect(() => {
    if (!isOpen) return;

    const comboComponentProducts = initialProduct?.isBundle
      ? getComboComponentProducts(initialProduct, catalog)
      : [];
    if (initialProduct?.isBundle) {
      setGenerationMode('all-products');
    } else if (initialProduct) {
      setGenerationMode('single-product');
      setSelectedProductId(String(initialProduct.id || initialProduct.metaId || ''));
      setCustomSku(initialProduct.sku || '');
    } else if (catalog && catalog.length > 0) {
      const first = catalog[0];
      setSelectedProductId(String(first.id || first.metaId || ''));
      setCustomSku(first.sku || '');
    }

    // Initialize all non-bundle products (or first 6+ products) as selected for All-Products mode
    if (catalog && catalog.length > 0) {
      const coreProducts = catalog.filter(p => !p.isBundle);
      const targetProducts = initialProduct?.isBundle ? comboComponentProducts : coreProducts;
      const nextMap = {};
      targetProducts.forEach(p => {
        const key = String(p.id || p.metaId || p.sku);
        nextMap[key] = true;
      });
      setSelectedProductMap(nextMap);
    }
  }, [isOpen, initialProduct, catalog]);

  // Generate QR data URLs for all catalog products
  useEffect(() => {
    if (!isOpen || !catalog || catalog.length === 0) return;
    let active = true;
    setQrGenerationError('');

    async function generateAllProductQrs() {
      const entries = {};
      try {
        for (const item of catalog) {
          const sku = String(item.sku || `SKU-${item.id}`).trim().toUpperCase();
          const payload = buildStandaloneProductQr(sku);
          const url = await buildHighResolutionQr(payload);
          entries[sku] = { url, payload };
        }
        if (active) setQrMapBySku(entries);
      } catch (error) {
        if (active) {
          setQrGenerationError(`Could not generate product QR codes: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    generateAllProductQrs();
    return () => {
      active = false;
    };
  }, [isOpen, catalog]);

  // Handle changing product from dropdown in single-product mode
  const handleSelectProduct = prodId => {
    setSelectedProductId(prodId);
    const prod = catalog.find(p => String(p.id || p.metaId) === String(prodId));
    if (prod) {
      setCustomSku(prod.sku || '');
    }
  };

  const scannablePayload = useMemo(
    () => buildStandaloneProductQr(customSku || 'BV-PRODUCT'),
    [customSku],
  );

  useEffect(() => {
    let active = true;
    if (!scannablePayload) return;
    setQrGenerationError('');

    buildHighResolutionQr(scannablePayload)
      .then(url => {
        if (active) setSingleQrDataUrl(url);
      })
      .catch(error => {
        if (active) {
          setQrGenerationError(`Could not generate the QR code: ${error instanceof Error ? error.message : String(error)}`);
        }
      });

    return () => {
      active = false;
    };
  }, [scannablePayload]);

  // Selected products in All-Products mode
  const activeAllProducts = useMemo(() => {
    return catalog.filter(p => selectedProductMap[String(p.id || p.metaId || p.sku)]);
  }, [catalog, selectedProductMap]);

  const qrLayout = useMemo(
    () => computeQrSheetLayout(paperWidthMm, paperHeightMm),
    [paperWidthMm, paperHeightMm],
  );
  const qrAssetsReady = generationMode === 'all-products'
    ? activeAllProducts.length > 0 && activeAllProducts.every(product => {
      const sku = String(product.sku || `SKU-${product.id}`).trim().toUpperCase();
      return Boolean(qrMapBySku[sku]?.url);
    })
    : Boolean(singleQrDataUrl);

  const previewProduct = generationMode === 'all-products' ? activeAllProducts[0] : null;
  const previewSku = String(previewProduct?.sku || customSku || 'BV-PRODUCT').trim().toUpperCase();
  const previewQr = previewProduct ? qrMapBySku[previewSku]?.url : singleQrDataUrl;
  const selectedQrProduct = previewProduct || catalog.find(product =>
    String(product.id || product.metaId || '') === String(selectedProductId)
  ) || initialProduct;
  const comboPreviewComponents = selectedQrProduct?.isBundle
    ? getComboComponentProducts(selectedQrProduct, catalog)
    : [];
  const comboContents = getComboComponentLabels(selectedQrProduct, catalog).join(', ');

  if (!isOpen) return null;

  const handleToggleProductSelection = prod => {
    if (prod.isBundle) {
      const components = getComboComponentProducts(prod, catalog);
      if (components.length === 0) return;
      setSelectedProductMap(previous => {
        const next = { ...previous };
        const allSelected = components.every(component =>
          Boolean(next[String(component.id || component.metaId || component.sku)])
        );
        components.forEach(component => {
          const key = String(component.id || component.metaId || component.sku);
          if (allSelected) delete next[key];
          else next[key] = true;
        });
        return next;
      });
      return;
    }
    const key = String(prod.id || prod.metaId || prod.sku);
    setSelectedProductMap(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Fill the selected sheet with plain QR artwork at its fixed physical size.
  const buildStickerItemsToPrint = () => {
    const totalCount = qrLayout.capacity;

    if (generationMode === 'all-products' && activeAllProducts.length > 0) {
      const stickers = [];
      for (let i = 0; i < totalCount; i++) {
        const prod = activeAllProducts[i % activeAllProducts.length];
        const sku = String(prod.sku || `SKU-${prod.id}`).trim().toUpperCase();
        const qrInfo = qrMapBySku[sku];
        stickers.push({
          qrDataUrl: qrInfo?.url || singleQrDataUrl,
        });
      }
      return stickers;
    }

    // Single product mode: repeat the selected product's standalone QR totalCount times
    return Array.from({ length: totalCount }, () => ({
      qrDataUrl: singleQrDataUrl,
    }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups to print QR code sheets.');
      return;
    }

    const stickers = buildStickerItemsToPrint();
    const pages = [];
    for (let i = 0; i < stickers.length; i += qrLayout.capacity) {
      pages.push(stickers.slice(i, i + qrLayout.capacity));
    }

    const sheetHtml = pages.map(pageItems => `
      <main class="qr-sheet">
        ${pageItems.map(st => `<img src="${st.qrDataUrl}" alt="" class="qr-img" />`).join('')}
      </main>
    `).join('');

    const cssStyles = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; background: #fff; }
        .qr-sheet {
          width: ${qrLayout.pageWidthMm}mm;
          height: ${qrLayout.pageHeightMm}mm;
          padding: ${qrLayout.marginMm}mm;
          page-break-after: always;
          page-break-inside: avoid;
          display: grid;
          grid-template-columns: repeat(${qrLayout.cols}, ${qrLayout.qrSizeMm}mm);
          grid-template-rows: repeat(${qrLayout.rows}, ${qrLayout.qrSizeMm}mm);
          gap: ${qrLayout.gapMm}mm;
          align-content: start;
          justify-content: start;
          overflow: hidden;
        }
        .qr-sheet:last-child {
          page-break-after: auto;
        }
        .qr-img {
          width: ${qrLayout.qrSizeMm}mm;
          height: ${qrLayout.qrSizeMm}mm;
          object-fit: contain;
          shape-rendering: crispEdges;
          display: block;
        }
        @media print {
          @page { size: ${qrLayout.pageWidthMm}mm ${qrLayout.pageHeightMm}mm; margin: 0; }
          html, body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bhumivera QR Sheet</title>
          ${cssStyles}
        </head>
        <body>
          ${sheetHtml}
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
                  Plain 19mm Product QR Print Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/30 text-emerald-200 border border-emerald-500/40">
                  19mm Vector QR
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Plain QR codes at exact print size. Choose A4, A3, or enter custom paper dimensions before generating a print-ready PDF.
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
              onClick={() => setGenerationMode('all-products')}
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
              disabled={Boolean(initialProduct?.isBundle)}
              onClick={() => setGenerationMode('single-product')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition border disabled:cursor-not-allowed disabled:opacity-40 ${
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
              Auto Grid: <b>{qrLayout.cols}×{qrLayout.rows}</b> ({qrLayout.capacity}/page) • QR:{' '}
              <b>{qrLayout.qrSizeMm}mm × {qrLayout.qrSizeMm}mm</b>
            </span>
          </div>
        </div>

        {/* Modal Body: Split 2 Columns */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Controls & Product Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {generationMode === 'all-products' ? (
              <div className="space-y-3">
                {initialProduct?.isBundle && (
                  <p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-950/30 px-3 py-2 text-xs leading-5 text-emerald-100">
                    No combo QR is needed. Pack this combo by scanning each included product’s existing QR: {getComboComponentLabels(initialProduct, catalog).join(', ') || 'component products'}.
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-emerald-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" /> Unique Standalone QR for Each Product ({activeAllProducts.length} Selected)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const all = {};
                        catalog.filter(p => !p.isBundle).forEach(p => {
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
                    const componentProducts = prod.isBundle ? getComboComponentProducts(prod, catalog) : [];
                    const checked = prod.isBundle
                      ? componentProducts.length > 0 && componentProducts.every(component =>
                        Boolean(selectedProductMap[String(component.id || component.metaId || component.sku)])
                      )
                      : Boolean(selectedProductMap[key]);
                    const sku = String(prod.sku || `SKU-${prod.id}`).toUpperCase();
                    const qrProduct = prod.isBundle ? componentProducts[0] : prod;
                    const qrEntry = qrMapBySku[String(qrProduct?.sku || sku).toUpperCase()];
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
                            {prod.isBundle
                              ? `Component QR labels (${componentProducts.length} existing products)`
                              : `${qrEntry?.payload || `BV-QR:${sku}`}`}
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
                    {catalog.filter(item => !item.isBundle).map(item => (
                      <option key={item.id || item.metaId} value={String(item.id || item.metaId)}>
                        {item.name} ({item.sku || 'NO-SKU'}) — ₹{item.price} — Stock: {item.availableStock ?? item.physicalStock ?? item.qty ?? 0}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
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
                </div>
              </>
            )}

            {/* Paper dimensions determine the full-page QR count. */}
            <div className="p-4 bg-[#071711] border border-emerald-500/40 rounded-xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="qr-paper-size" className="block text-[11px] font-black uppercase text-emerald-300 mb-1">
                    Paper Size
                  </label>
                  <select
                    id="qr-paper-size"
                    value={paperSize}
                    onChange={e => {
                      const nextSize = e.target.value;
                      setPaperSize(nextSize);
                      if (nextSize === 'a4') {
                        setPaperWidthMm('210');
                        setPaperHeightMm('297');
                      } else if (nextSize === 'a3') {
                        setPaperWidthMm('297');
                        setPaperHeightMm('420');
                      }
                    }}
                    className="w-full bg-[#0c261b] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="a3">A3 (297 × 420 mm)</option>
                    <option value="custom">Custom dimensions</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="qr-paper-width" className="block text-[11px] font-black uppercase text-emerald-300 mb-1">
                    Paper Width (mm)
                  </label>
                  <input
                    id="qr-paper-width"
                    type="number"
                    min="50"
                    max="1000"
                    value={paperWidthMm}
                    onChange={e => {
                      setPaperSize('custom');
                      setPaperWidthMm(e.target.value);
                    }}
                    className="w-full bg-[#0c261b] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="qr-paper-length" className="block text-[11px] font-black uppercase text-emerald-300 mb-1">
                    Paper Length (mm)
                  </label>
                  <input
                    id="qr-paper-length"
                    type="number"
                    min="50"
                    max="1000"
                    value={paperHeightMm}
                    onChange={e => {
                      setPaperSize('custom');
                      setPaperHeightMm(e.target.value);
                    }}
                    className="w-full bg-[#0c261b] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-300">
                QR size is fixed at 19 × 19 mm. The grid updates automatically: {qrLayout.capacity} QRs per page ({qrLayout.cols} columns × {qrLayout.rows} rows).
              </p>
            </div>

            {qrGenerationError && <p role="alert" className="text-xs text-red-300">{qrGenerationError}</p>}

          </div>

          {/* Right Column: Live Printable Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between bg-[#071711] p-4 rounded-xl border border-emerald-500/30 space-y-4">
            <div className="w-full text-center">
              <span className="text-[11px] font-black uppercase text-emerald-300 tracking-wider flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Plain QR Preview (19 × 19 mm on paper)
              </span>
            </div>

            <div className="bg-white text-black p-4 rounded-xl shadow-2xl border-2 border-emerald-500 w-full max-w-[260px] flex items-center justify-center">
              <div className="w-44 h-44 flex items-center justify-center p-1 bg-white">
                {previewQr ? (
                  <img src={previewQr} alt="" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-mono">Generating QR...</div>
                )}
              </div>
            </div>

            {selectedQrProduct?.isBundle && (
              <p role={comboPreviewComponents.length ? 'status' : 'alert'} className="w-full rounded border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold leading-4 text-emerald-950">
                {comboPreviewComponents.length
                  ? `No combo QR is needed. Scan each component’s existing product QR: ${comboContents}.`
                  : 'Combo contents could not be matched to inventory SKUs. Refresh inventory and try again.'}
              </p>
            )}

            <div className="w-full text-[11px] text-slate-300 bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-lg space-y-1">
              <p className="text-[10px] text-slate-300 leading-normal">
                {paperSize.toUpperCase()} sheet: <b>{qrLayout.pageWidthMm} × {qrLayout.pageHeightMm} mm</b>. A full page holds <b>{qrLayout.capacity}</b> QR codes ({qrLayout.cols} columns × {qrLayout.rows} rows). 8K SVG vector artwork stays crisp when zoomed; print at <b>100% / Actual size</b>.
              </p>
            </div>

            <div className="w-full pt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePrint}
                disabled={!qrAssetsReady}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                {qrAssetsReady ? 'Generate Full-page HQ PDF' : 'Generating QR Codes…'}
              </button>
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
