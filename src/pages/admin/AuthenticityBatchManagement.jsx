import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  FlaskConical,
  Layers,
  LoaderCircle,
  MinusSquare,
  Plus,
  Printer,
  QrCode,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Square,
  Trash2,
  X,
} from 'lucide-react';
import { products as productsApi, serials as serialsApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const PRODUCT_PRESETS = {
  1: {
    prefix: 'BV-CFW',
    batchCode: 'BATCH-04/26-CH',
    bottleSequence: 'Bottle #041 of 250',
    calibratedPh: '5.45 pH (at 25.0°C Digital Electrode)',
    extractionTemp: '25.8°C (Sub-28°C Cold-Compounded)',
    microbiologicalAssay: 'Total Aerobic Microbial Count < 10 CFU/ml (Absent of Pathogens)',
    heavyMetals: 'Lead <0.05 ppm · Arsenic <0.02 ppm · Mercury ND (ICP-MS)',
    disclosedActives: '3.0% Activated Charcoal, 5.0% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% HA, 0.1% Niacinamide',
    tamperCustody: 'Artisanal Wax-Sealed & Gold-Foil Neck Collar · 214.5g Verified',
    originLot: 'Ayurvedic Certified Botanical Forest Harvest Lot #CH-2026',
  },
  2: {
    prefix: 'BV-SBFW',
    batchCode: 'BATCH-04/26-SB',
    bottleSequence: 'Bottle #083 of 250',
    calibratedPh: '5.42 pH (at 25.0°C Digital Electrode)',
    extractionTemp: '26.4°C (Sub-28°C Cold-Pressed Verified)',
    microbiologicalAssay: 'Total Aerobic Microbial Count < 10 CFU/ml (Zero Pathogens)',
    heavyMetals: 'Lead <0.05 ppm · Arsenic <0.02 ppm · Mercury ND (ICP-MS)',
    disclosedActives: '4.0% Sea Buckthorn, 5.0% Botanical Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber, 0.1% HA, 0.1% Niacinamide',
    tamperCustody: 'Artisanal Wax-Sealed & Gold-Foil Neck Collar · 214.5g Gravimetric Verified',
    originLot: 'Ladakh Nubra Valley Cooperative Lot #LDK-SB-2026',
  },
  3: {
    prefix: 'BV-SH21',
    batchCode: 'BATCH-04/26-SH',
    bottleSequence: 'Bottle #112 of 250',
    calibratedPh: '5.18 pH (at 25.0°C Digital Electrode)',
    extractionTemp: '26.2°C (Sub-28°C Cold-Pressed Verified)',
    microbiologicalAssay: 'Total Aerobic Count < 10 CFU/ml (Zero Pathogens)',
    heavyMetals: 'Lead <0.05 ppm · Arsenic <0.02 ppm · Mercury ND (ICP-MS)',
    disclosedActives: '25mg Reetha, 20mg Amla, 10mg Triphala, 10mg Bhringraj, 10mg Rosemary Oil, 10mg Neem, 10mg Aloe, 5mg Shikakai',
    tamperCustody: 'Artisanal Wax-Sealed & Gold-Foil Collar · 258.0g Verified',
    originLot: 'Western Ghats Botanical Sanctuary Lot #WG-BOT-2026',
  },
  4: {
    prefix: 'BV-CSOAP',
    batchCode: 'BATCH-04/26-CS',
    bottleSequence: 'Bar #056 of 300',
    calibratedPh: '5.50 pH (Cold-Process Saponification)',
    extractionTemp: 'Sub-28°C Cold-Compounded',
    microbiologicalAssay: 'Total Aerobic Count < 10 CFU/g (Passed)',
    heavyMetals: 'Lead <0.05 ppm · Arsenic <0.02 ppm (ICP-MS Passed)',
    disclosedActives: 'Activated Charcoal, Pure Aloe Vera, Detergent-Free Ayurvedic Soap Base',
    tamperCustody: 'Artisanal Hand-Stamp & Eco-Wax Seal',
    originLot: 'Organic Certified Cleansing Compound Lot #CS-2026',
  },
  5: {
    prefix: 'BV-ASOAP',
    batchCode: 'BATCH-04/26-AS',
    bottleSequence: 'Bar #072 of 300',
    calibratedPh: '5.50 pH (Cold-Process Saponification)',
    extractionTemp: 'Sub-28°C Cold-Compounded',
    microbiologicalAssay: 'Total Aerobic Count < 10 CFU/g (Passed)',
    heavyMetals: 'Lead <0.05 ppm · Arsenic <0.02 ppm (ICP-MS Passed)',
    disclosedActives: 'Cold-Pressed Aloe Vera, Organic Neem, Sacred Tulsi Leaf Extract',
    tamperCustody: 'Artisanal Hand-Stamp & Eco-Wax Seal',
    originLot: 'Organic Certified Botanical Compound Lot #AS-2026',
  },
  6: {
    prefix: 'BV-TULSI',
    batchCode: 'BATCH-04/26-TL',
    bottleSequence: 'Bottle #019 of 250',
    calibratedPh: '5.35 pH (Phyto-Extract Assay)',
    extractionTemp: '25.5°C Multi-Species Phyto-Extraction',
    microbiologicalAssay: 'Zero Pathogens · Total Aerobic < 5 CFU/ml',
    heavyMetals: 'Lead <0.01 ppm · Arsenic <0.01 ppm (ICP-MS Passed)',
    disclosedActives: '9.0ml per 10ml concentrated extract of 7 Tulsi varieties (Van, Sweet, Marua, Bisva, Kala, Rama & Lemon Tulsi)',
    tamperCustody: 'Tamper-Evident Dropper Seal & Neck Collar',
    originLot: 'Himalayan Foothills Sacred Groves Lot #TUL-7S-2026',
  },
};

const getSequencePreview = (seed, count) => {
  const n = Number(count) || 1;
  const cleanSeed = String(seed || '').trim().toUpperCase();
  if (n <= 1) return cleanSeed || 'Auto-generated single code';

  if (/^\d+$/.test(cleanSeed)) {
    const startNum = BigInt(cleanSeed);
    const endNum = (startNum + BigInt(n - 1)).toString().padStart(cleanSeed.length, '0');
    return `${cleanSeed} … ${endNum} (${n} sequential codes)`;
  }
  const match = cleanSeed.match(/^(.*?)(\d+)$/);
  if (match) {
    const prefix = match[1];
    const numPart = match[2];
    const startNum = BigInt(numPart);
    const endNum = (startNum + BigInt(n - 1)).toString().padStart(numPart.length, '0');
    return `${cleanSeed} … ${prefix}${endNum} (${n} sequential codes)`;
  }
  const prefix = cleanSeed || 'BHMV';
  const padLen = Math.max(3, String(n).length);
  return `${prefix}-${String(1).padStart(padLen, '0')} … ${prefix}-${String(n).padStart(padLen, '0')} (${n} codes)`;
};

export default function AuthenticityBatchManagement() {
  const [products, setProducts] = useState([]);
  const [genuinitySerials, setGenuinitySerials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSerialIds, setSelectedSerialIds] = useState([]);
  const [showAssayDetails, setShowAssayDetails] = useState(true);
  const { showToast } = useToast() || {};

  // Unified Form State: Single & Bulk in One
  const [form, setForm] = useState({
    productId: '',
    count: 1, // Default 1, can be 1, 30, 100, 110, etc.
    serialNumber: '123456',
    batchNumber: 'BATCH-04/26-SB',
    bottleSequence: 'Bottle #083 of 250',
    manufactureDate: new Date().toISOString().slice(0, 10),
    expiryDate: new Date(Date.now() + 2 * 365.25 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    calibratedPh: '5.42 pH (at 25.0°C Digital Electrode)',
    extractionTemp: '26.4°C (Sub-28°C Cold-Pressed Verified)',
    microbiologicalAssay: 'Total Aerobic Count < 10 CFU/ml · Zero Pathogens',
    heavyMetals: 'Pb <0.05 ppm · As <0.02 ppm · Hg ND (ICP-MS)',
    disclosedActives: '4.0% Sea Buckthorn, 5.0% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem, 0.5% Cucumber',
    tamperCustody: 'Artisanal Wax-Sealed & Gold-Foil Neck Collar · 214.5g Verified',
    originLot: 'Ladakh Nubra Valley Cooperative Lot #LDK-SB-2026',
    additionalDetails: [],
  });

  const loadRegistry = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [productResponse, genuinityResponse] = await Promise.allSettled([
        productsApi.getAllAdmin(),
        serialsApi.getGenuinityList(),
      ]);

      let productRows = [];
      if (productResponse.status === 'fulfilled') {
        productRows = productResponse.value.data?.products ||
          productResponse.value.data?.data ||
          productResponse.value.data || [];
        setProducts(Array.isArray(productRows) ? productRows : []);
      }

      if (genuinityResponse.status === 'fulfilled') {
        setGenuinitySerials(Array.isArray(genuinityResponse.value.data?.list) ? genuinityResponse.value.data.list : []);
      }

      const initialProdId = String(productRows[0]?.id || productRows[0]?._id || '2');
      setForm(prev => ({
        ...prev,
        productId: prev.productId || initialProdId,
      }));
    } catch (loadError) {
      console.error('[GENUINITY_REGISTRY_LOAD]', loadError);
      setError('Could not load products and authenticity registry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRegistry();
  }, [loadRegistry]);

  const activeProducts = useMemo(
    () => products.filter(product => !product.status || String(product.status).toLowerCase() === 'active'),
    [products]
  );

  // When product selection changes, auto-fill standard formulation defaults
  const handleProductChange = (productId) => {
    const preset = PRODUCT_PRESETS[Number(productId)] || {};
    const dateStamp = new Date().toISOString().slice(2, 7).replace('-', '');
    setForm(prev => ({
      ...prev,
      productId,
      batchNumber: preset.batchCode || `BATCH-${dateStamp}-${productId}`,
      bottleSequence: preset.bottleSequence || 'Bottle #001 of 250',
      calibratedPh: preset.calibratedPh || '5.3–5.5 pH (Skin-Identical)',
      extractionTemp: preset.extractionTemp || 'Sub-28°C Cold-Pressed Verified',
      microbiologicalAssay: preset.microbiologicalAssay || 'Total Aerobic Count < 10 CFU/ml · Zero Pathogens',
      heavyMetals: preset.heavyMetals || 'Pb <0.05 ppm · As <0.02 ppm · Hg ND (ICP-MS)',
      disclosedActives: preset.disclosedActives || '100% Active Ingredients Disclosed',
      tamperCustody: preset.tamperCustody || 'Artisanal Wax-Sealed & Gold-Foil Collar',
      originLot: preset.originLot || 'Certified Indian Botanical Harvest',
    }));
  };

  // Generate QR Code data URL for live result card
  const renderQRCodeImage = useCallback(async (serialCode) => {
    try {
      const origin = window.location.origin;
      const verifyUrl = `${origin}/verify?code=${encodeURIComponent(serialCode)}`;
      const dataUrl = await QRCode.toDataURL(verifyUrl, {
        errorCorrectionLevel: 'Q',
        margin: 2,
        width: 320,
        color: { dark: '#070a0e', light: '#ffffff' },
      });
      setQrDataUrl(dataUrl);
    } catch (qrErr) {
      console.error('[QR_GEN_ERROR]', qrErr);
    }
  }, []);

  // Handle Unified Generation (Single or Bulk)
  const handleGenerateQRs = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const requestedCount = Math.max(1, Math.min(1000, Number(form.count) || 1));
    try {
      const response = await serialsApi.createGenuinityQR({
        productId: form.productId,
        count: requestedCount,
        serialNumber: form.serialNumber.trim(),
        batchNumber: form.batchNumber.trim(),
        bottleSequence: form.bottleSequence.trim(),
        manufactureDate: form.manufactureDate,
        expiryDate: form.expiryDate,
        calibratedPh: form.calibratedPh.trim(),
        extractionTemp: form.extractionTemp.trim(),
        microbiologicalAssay: form.microbiologicalAssay.trim(),
        heavyMetals: form.heavyMetals.trim(),
        disclosedActives: form.disclosedActives.trim(),
        tamperCustody: form.tamperCustody.trim(),
        originLot: form.originLot.trim(),
        details: form.additionalDetails,
      });

      const result = response.data;
      setGeneratedResult(result);
      await renderQRCodeImage(result.serialNumber || form.serialNumber);

      showToast?.(
        requestedCount > 1
          ? `Generated & registered ${result.count || requestedCount} QR codes successfully!`
          : `Generated QR code for serial ${result.serialNumber || form.serialNumber}!`,
        'success'
      );

      await loadRegistry();
    } catch (createError) {
      console.error('[GENUINITY_CREATE_ERROR]', createError);
      setError(createError.response?.data?.message || createError.message || 'Could not generate QR code.');
      showToast?.(createError.response?.data?.message || 'Failed to create genuinity records.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const autoGenerateRandomSerial = () => {
    const prefix = PRODUCT_PRESETS[Number(form.productId)]?.prefix || 'BHMV';
    const yy = String(new Date().getFullYear()).slice(-2);
    const mm = String(new Date().getMonth() + 1).padStart(2, '0');
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    setForm(prev => ({
      ...prev,
      serialNumber: `${prefix}-${yy}${mm}-${rand}`,
    }));
  };

  // A4 Sticker Sheet Print System (11 Columns x 10 Rows = 110 capacity per page, 0.5cm border)
  const printA4StickerSheets = async (serialsToPrint) => {
    if (!serialsToPrint || serialsToPrint.length === 0) {
      showToast?.('No QR codes selected to print.', 'warning');
      return;
    }

    setPrinting(true);
    try {
      const origin = window.location.origin;
      const qrItems = [];
      for (let i = 0; i < serialsToPrint.length; i++) {
        const item = serialsToPrint[i];
        const serialCode = typeof item === 'string' ? item : (item.serialNumber || item.serial || String(item));
        const verifyUrl = `${origin}/verify?code=${encodeURIComponent(serialCode)}`;
        // Vector SVG scales exactly to the print size, avoiding blurry/shifted modules
        const svg = await QRCode.toString(verifyUrl, {
          type: 'svg',
          errorCorrectionLevel: 'M',
          margin: 0,
          color: { dark: '#000000', light: '#ffffff' },
        });
        const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        qrItems.push({
          serial: serialCode,
          qrUrl: dataUrl,
          productName: item.productName || 'Bhumivera Product',
          batchNumber: item.batchNumber || '',
        });
      }

      // 11 Columns x 10 Rows = 110 stickers per A4 page
      const STICKERS_PER_PAGE = 110;
      const pages = [];
      for (let i = 0; i < qrItems.length; i += STICKERS_PER_PAGE) {
        pages.push(qrItems.slice(i, i + STICKERS_PER_PAGE));
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to open the sticker print sheet.');
        return;
      }

      const pagesHtml = pages.map((pageItems, pageIdx) => {
        const cellsHtml = pageItems.map(item => `
          <div class="sticker-cell">
            <div class="sticker-brand">BHUMIVERA</div>
            <img class="sticker-qr" src="${item.qrUrl}" alt="${item.serial}" />
            <div class="sticker-serial">${item.serial}</div>
            <div class="sticker-tag">100% GENUINE</div>
          </div>
        `).join('');

        return `
          <div class="a4-sheet ${pageIdx < pages.length - 1 ? 'page-break' : ''}">
            <div class="sticker-grid">
              ${cellsHtml}
            </div>
          </div>
        `;
      }).join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Bhumivera A4 QR Sticker Sheet (${serialsToPrint.length} Stickers)</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 0.5cm; /* 0.5 cm border on all sides */
              }
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              html, body {
                width: 100%;
                margin: 0;
                padding: 0;
                background: #fff;
                color: #000;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              }
              .a4-sheet {
                width: 200mm; /* 210mm - 2*5mm */
                min-height: 287mm; /* 297mm - 2*5mm */
                max-height: 287mm;
                display: block;
                overflow: hidden;
              }
              .page-break {
                page-break-after: always;
                break-after: page;
              }
              .sticker-grid {
                display: grid;
                grid-template-columns: repeat(11, 18.18mm);
                grid-auto-rows: 28.5mm;
                column-gap: 0;
                row-gap: 0;
                width: 200mm;
              }
              .sticker-cell {
                width: 18.18mm;
                height: 28.5mm;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 0 0.4mm;
                overflow: hidden;
                outline: 0.35px dashed rgba(0, 0, 0, 0.28);
                outline-offset: -0.35px;
              }
              .sticker-brand {
                font-size: 4pt;
                font-weight: 900;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #000;
                line-height: 1;
                margin-bottom: 0.6mm;
              }
              .sticker-qr {
                width: 14.5mm;
                height: 14.5mm;
                display: block;
                flex: none;
                margin: 0 auto;
              }
              .sticker-serial {
                font-family: "Courier New", Courier, monospace;
                font-size: 5pt;
                font-weight: 900;
                color: #000;
                letter-spacing: -0.02em;
                line-height: 1.1;
                margin-top: 0.6mm;
                max-width: 17.5mm;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .sticker-tag {
                font-size: 3.5pt;
                font-weight: 800;
                color: #444;
                letter-spacing: 0.04em;
                line-height: 1;
                margin-top: 0.4mm;
                text-transform: uppercase;
              }
              @media screen {
                body {
                  background: #0f172a;
                  padding: 30px;
                }
                .screen-header {
                  max-width: 200mm;
                  margin: 0 auto 20px auto;
                  background: #10241f;
                  border: 1px solid #d4af37;
                  border-radius: 12px;
                  padding: 14px 20px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  color: #fff;
                }
                .screen-btn {
                  background: #d4af37;
                  color: #000;
                  font-weight: 800;
                  border: none;
                  padding: 8px 18px;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 13px;
                  text-transform: uppercase;
                }
                .a4-sheet {
                  background: #fff;
                  margin: 0 auto 25px auto;
                  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            <div class="screen-header">
              <div>
                <strong>Bhumivera A4 Sticker Sheet</strong> — ${serialsToPrint.length} QR Stickers (11 Columns × 10 Rows = 110 Capacity per page)
              </div>
              <button class="screen-btn" onclick="window.print()">Print A4 Stickers</button>
            </div>
            ${pagesHtml}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 400);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      showToast?.(`Prepared ${serialsToPrint.length} stickers for A4 printing.`, 'success');
    } catch (err) {
      console.error('[PRINT_ERROR]', err);
      showToast?.('Failed to prepare sticker sheet: ' + err.message, 'error');
    } finally {
      setPrinting(false);
    }
  };

  const selectGenuinityRecord = async (record) => {
    setGeneratedResult(record);
    await renderQRCodeImage(record.serialNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyVerificationLink = (serialCode) => {
    const link = `${window.location.origin}/verify?code=${encodeURIComponent(serialCode)}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      showToast?.(`Copied link: ${link}`, 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const downloadQrPng = (serialCode) => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `bhumivera-qr-${serialCode || 'code'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast?.(`Downloaded QR code for ${serialCode}`, 'success');
  };

  // Filtered serials based on search
  const filteredSerials = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return genuinitySerials;
    return genuinitySerials.filter(s =>
      (s.serialNumber || '').toLowerCase().includes(q) ||
      (s.productName || '').toLowerCase().includes(q) ||
      (s.batchNumber || '').toLowerCase().includes(q)
    );
  }, [genuinitySerials, searchFilter]);

  // Bulk Selection Handlers
  const isAllSelected = useMemo(() => {
    return filteredSerials.length > 0 && selectedSerialIds.length === filteredSerials.length;
  }, [filteredSerials, selectedSerialIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedSerialIds([]);
    } else {
      setSelectedSerialIds(filteredSerials.map(s => s.id));
    }
  };

  const toggleSelectSerial = (id) => {
    setSelectedSerialIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSingleSerial = async (serialId, serialNumber) => {
    if (!window.confirm(`Delete serial record "${serialNumber}"? This cannot be undone.`)) return;
    try {
      await serialsApi.deleteGenuinitySerial(serialId);
      showToast?.(`Deleted serial ${serialNumber}`, 'success');
      setSelectedSerialIds(prev => prev.filter(x => x !== serialId));
      if (generatedResult?.id === serialId) {
        setGeneratedResult(null);
        setQrDataUrl('');
      }
      await loadRegistry();
    } catch (delError) {
      showToast?.(delError.response?.data?.message || 'Failed to delete serial.', 'error');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedSerialIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedSerialIds.length} selected serial(s)? This cannot be undone.`)) return;
    try {
      await serialsApi.bulkDeleteGenuinitySerials({ serialIds: selectedSerialIds });
      showToast?.(`Deleted ${selectedSerialIds.length} serials successfully.`, 'success');
      setSelectedSerialIds([]);
      setGeneratedResult(null);
      await loadRegistry();
    } catch (delError) {
      showToast?.(delError.response?.data?.message || 'Failed to delete selected serials.', 'error');
    }
  };

  const handleDeleteAllFiltered = async () => {
    if (filteredSerials.length === 0) return;
    if (!window.confirm(`Are you sure you want to permanently delete ALL ${filteredSerials.length} listed serials?`)) return;
    try {
      const allIds = filteredSerials.map(s => s.id);
      await serialsApi.bulkDeleteGenuinitySerials({ serialIds: allIds });
      showToast?.(`Deleted ${allIds.length} serials successfully.`, 'success');
      setSelectedSerialIds([]);
      setGeneratedResult(null);
      await loadRegistry();
    } catch (delError) {
      showToast?.(delError.response?.data?.message || 'Failed to delete all serials.', 'error');
    }
  };

  const handlePrintSelected = () => {
    const selectedRecords = filteredSerials.filter(s => selectedSerialIds.includes(s.id));
    printA4StickerSheets(selectedRecords);
  };

  const handlePrintAllFiltered = () => {
    printA4StickerSheets(filteredSerials);
  };

  return (
    <div className="authenticity-admin space-y-7 pb-16 text-slate-200">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-[#D4AF37]/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#10241f] px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FCE096]">
            <ShieldCheck size={13} className="text-[#D4AF37]" /> Authentic Product Verification System
          </div>
          <h1 className="mt-2.5 flex items-center gap-3 font-serif text-3xl font-bold text-white">
            <QrCode className="text-[#D4AF37]" /> Serial Numbers &amp; QR Genuinity Panel
          </h1>
          <p className="mt-1.5 max-w-3xl text-xs sm:text-sm leading-relaxed text-slate-300">
            Unified QR generator for single orders (e.g. <code className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[#FCE096]">123456</code>) or bulk production (e.g. 100 QR codes). Automatically registers certified laboratory assay details. Any phone camera scan opens <strong className="text-white">bhumivera.com/verify?code=123456</strong> and auto-populates the customer genuinity certificate.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadRegistry()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-[#D4AF37]/50"
        >
          <RefreshCw size={15} /> Refresh Registry
        </button>
      </header>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-400/30 bg-rose-950/20 p-4 text-sm text-rose-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {/* LIVE GENERATED QR RESULT CARD */}
      {generatedResult && qrDataUrl && (
        <section className="relative overflow-hidden rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#070a0e] via-[#0d1c14] to-[#10241f] p-6 shadow-[0_0_50px_rgba(212,175,55,0.2)] sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#D4AF37]/15 blur-3xl" />
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="rounded-2xl border-2 border-[#D4AF37] bg-white p-3 shadow-xl">
                <img src={qrDataUrl} alt={generatedResult.serialNumber} className="h-44 w-44 object-contain" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  <CheckCircle2 size={13} /> Genuinity QR Generated &amp; Active
                </span>
                <h3 className="font-mono text-2xl font-bold tracking-tight text-[#FCE096]">
                  {generatedResult.count && generatedResult.count > 1
                    ? `${generatedResult.count} QR Codes Generated (${generatedResult.serialNumber} …)`
                    : generatedResult.serialNumber}
                </h3>
                <p className="text-sm font-semibold text-white">
                  {generatedResult.productName || 'Bhumivera Formulation'}
                </p>
                <p className="font-mono text-xs text-slate-400">
                  Batch: <span className="text-white">{generatedResult.batchNumber}</span> · {generatedResult.bottleSequence || 'Certified'}
                </p>
                <div className="rounded-lg border border-slate-800 bg-black/60 px-3 py-1.5 font-mono text-xs text-[#cbd5e1] break-all">
                  {`${window.location.origin}/verify?code=${encodeURIComponent(generatedResult.serialNumber)}`}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col gap-2.5">
              {generatedResult.serials && generatedResult.serials.length > 1 ? (
                <button
                  type="button"
                  disabled={printing}
                  onClick={() => printA4StickerSheets(generatedResult.serials.map(s => ({ serialNumber: s, productName: generatedResult.productName, batchNumber: generatedResult.batchNumber })))}
                  className="btn-gold-luxury inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
                >
                  <Printer size={15} /> Print All {generatedResult.serials.length} Stickers (A4 Sheet)
                </button>
              ) : (
                <button
                  type="button"
                  disabled={printing}
                  onClick={() => printA4StickerSheets([{ serialNumber: generatedResult.serialNumber, productName: generatedResult.productName, batchNumber: generatedResult.batchNumber }])}
                  className="btn-gold-luxury inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
                >
                  <Printer size={15} /> Print Sticker (A4 Sheet)
                </button>
              )}
              <button
                type="button"
                onClick={() => downloadQrPng(generatedResult.serialNumber)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-[#10241f] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#FCE096] hover:bg-[#D4AF37]/20"
              >
                <Download size={15} /> Download QR PNG
              </button>
              <button
                type="button"
                onClick={() => copyVerificationLink(generatedResult.serialNumber)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-slate-500"
              >
                {copiedLink ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                {copiedLink ? 'Copied to Clipboard!' : 'Copy Verify Link'}
              </button>
              <a
                href={`/verify?code=${encodeURIComponent(generatedResult.serialNumber)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-5 py-3 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:bg-emerald-900/40"
              >
                <ExternalLink size={15} /> Test Live Verification
              </a>
            </div>
          </div>
        </section>
      )}

      {/* UNIFIED GENERATOR: COMBINE BULK AND SINGLE INTO ONE */}
      <section className="rounded-3xl border border-[#D4AF37]/25 bg-[#10241f]/80 p-5 shadow-xl sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-3 text-[#FCE096]">
            <Sparkles size={20} />
          </span>
          <div>
            <h2 className="font-serif text-xl font-semibold text-white">Unified QR Code &amp; Genuinity Generator</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              Generate <strong>1 single QR</strong> (e.g. serial <code className="text-[#FCE096]">123456</code>) or <strong>100 bulk QR codes</strong> at once. Automatically generates the verification link, embeds certified assay records, and prepares A4 sticker sheets.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateQRs} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Product Formulation Selector */}
            <label className="space-y-1.5 text-xs font-semibold text-slate-300">
              Product Formulation
              <select
                required
                value={form.productId}
                onChange={e => handleProductChange(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
              >
                <option value="" disabled>Select a formulation</option>
                {activeProducts.map(p => (
                  <option key={p.id || p._id} value={p.id || p._id}>
                    {p.name} {p.sku ? `(${p.sku})` : ''}
                  </option>
                ))}
              </select>
            </label>

            {/* Quantity Input (1 or 100 or custom) */}
            <div className="space-y-1.5 text-xs font-semibold text-slate-300">
              <div className="flex items-center justify-between">
                <span>Quantity to Generate</span>
                <span className="text-[10px] font-mono text-[#FCE096]">
                  {Number(form.count) === 1 ? 'Single QR' : `${form.count} Bulk QRs`}
                </span>
              </div>
              <input
                required
                type="number"
                min="1"
                max="1000"
                step="1"
                value={form.count}
                onChange={e => setForm(prev => ({ ...prev, count: e.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 font-mono text-base font-bold text-white outline-none focus:border-[#D4AF37]"
              />
              {/* Quick Quantity Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[1, 10, 30, 50, 100, 110].map(qty => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, count: qty }))}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition ${
                      Number(form.count) === qty
                        ? 'bg-[#D4AF37] text-black shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {qty === 1 ? '1 (Single)' : qty === 110 ? '110 (Full A4)' : qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Serial / Starting Number */}
            <div className="space-y-1.5 text-xs font-semibold text-slate-300">
              <div className="flex items-center justify-between">
                <span>{Number(form.count) > 1 ? 'Starting Serial / Prefix' : 'Serial / QR Number'}</span>
                <button
                  type="button"
                  onClick={autoGenerateRandomSerial}
                  className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
                >
                  Auto Generate
                </button>
              </div>
              <input
                required
                type="text"
                value={form.serialNumber}
                onChange={e => setForm(prev => ({ ...prev, serialNumber: e.target.value.toUpperCase() }))}
                placeholder={Number(form.count) > 1 ? 'e.g. 123456 or BV-001' : 'e.g. 123456'}
                className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 font-mono text-base font-bold text-[#FCE096] outline-none focus:border-[#D4AF37]"
              />
              <div className="text-[11px] font-mono text-slate-400 truncate">
                Preview: <span className="text-[#FCE096]">{getSequencePreview(form.serialNumber, form.count)}</span>
              </div>
            </div>

            {/* Batch Code */}
            <label className="space-y-1.5 text-xs font-semibold text-slate-300">
              Batch Code
              <input
                required
                type="text"
                value={form.batchNumber}
                onChange={e => setForm(prev => ({ ...prev, batchNumber: e.target.value.toUpperCase() }))}
                placeholder="e.g. BATCH-04/26-SB"
                className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 font-mono text-sm text-white outline-none focus:border-[#D4AF37]"
              />
            </label>

            {/* Bottle Sequence */}
            <label className="space-y-1.5 text-xs font-semibold text-slate-300">
              Bottle Sequence / Notes
              <input
                type="text"
                value={form.bottleSequence}
                onChange={e => setForm(prev => ({ ...prev, bottleSequence: e.target.value }))}
                placeholder={Number(form.count) > 1 ? `Batch of ${form.count} bottles` : 'e.g. Bottle #083 of 250'}
                className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
              />
            </label>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1 text-xs font-semibold text-slate-300">
                Manufacture
                <input
                  required
                  type="date"
                  value={form.manufactureDate}
                  onChange={e => setForm(prev => ({ ...prev, manufactureDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-xs text-white outline-none focus:border-[#D4AF37]"
                />
              </label>
              <label className="space-y-1 text-xs font-semibold text-slate-300">
                Expiry Date
                <input
                  required
                  type="date"
                  value={form.expiryDate}
                  onChange={e => setForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-xs text-white outline-none focus:border-[#D4AF37]"
                />
              </label>
            </div>
          </div>

          {/* Genuinity & Laboratory Assay Details Accordion */}
          <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#081b15]/80 p-5 space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer border-b border-slate-800 pb-3"
              onClick={() => setShowAssayDetails(!showAssayDetails)}
            >
              <div className="flex items-center gap-2">
                <FlaskConical size={18} className="text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Certified Laboratory Assay &amp; Genuinity Records
                </h3>
              </div>
              <button type="button" className="text-slate-400 hover:text-white">
                {showAssayDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {showAssayDetails && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Calibrated pH Assay</span>
                  <input
                    type="text"
                    value={form.calibratedPh}
                    onChange={e => setForm(prev => ({ ...prev, calibratedPh: e.target.value }))}
                    placeholder="e.g. 5.42 pH (at 25.0°C Digital Electrode)"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-emerald-300 outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Extraction Temperature</span>
                  <input
                    type="text"
                    value={form.extractionTemp}
                    onChange={e => setForm(prev => ({ ...prev, extractionTemp: e.target.value }))}
                    placeholder="e.g. 26.4°C (Sub-28°C Cold-Pressed Verified)"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Microbiological Assay</span>
                  <input
                    type="text"
                    value={form.microbiologicalAssay}
                    onChange={e => setForm(prev => ({ ...prev, microbiologicalAssay: e.target.value }))}
                    placeholder="e.g. Total Aerobic Count < 10 CFU/ml · Zero Pathogens"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Heavy Metal Screen (ICP-MS)</span>
                  <input
                    type="text"
                    value={form.heavyMetals}
                    onChange={e => setForm(prev => ({ ...prev, heavyMetals: e.target.value }))}
                    placeholder="e.g. Pb <0.05 ppm · As <0.02 ppm · Hg ND (ICP-MS)"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300 sm:col-span-2">
                  <span className="font-semibold text-[#FCE096]">100% Disclosed Active Profile</span>
                  <textarea
                    rows="2"
                    value={form.disclosedActives}
                    onChange={e => setForm(prev => ({ ...prev, disclosedActives: e.target.value }))}
                    placeholder="e.g. 4.0% Sea Buckthorn, 5.0% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem..."
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Artisanal Tamper Custody</span>
                  <input
                    type="text"
                    value={form.tamperCustody}
                    onChange={e => setForm(prev => ({ ...prev, tamperCustody: e.target.value }))}
                    placeholder="e.g. Artisanal Wax-Sealed & Gold-Foil Collar"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Botanical Origin &amp; Lot</span>
                  <input
                    type="text"
                    value={form.originLot}
                    onChange={e => setForm(prev => ({ ...prev, originLot: e.target.value }))}
                    placeholder="e.g. Ladakh Nubra Valley Cooperative Lot #LDK-SB-2026"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || activeProducts.length === 0}
            className="btn-gold-luxury inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-8 text-xs font-black uppercase tracking-widest text-white shadow-xl hover:brightness-110 disabled:opacity-60 sm:w-auto"
          >
            {saving ? <LoaderCircle size={17} className="animate-spin" /> : <QrCode size={17} />}
            {saving
              ? 'Generating & Registering Genuinity…'
              : Number(form.count) > 1
                ? `⚡ Generate ${form.count} QR Codes & Save Batch (${getSequencePreview(form.serialNumber, form.count)})`
                : `✨ Generate QR Code & Save Record (${form.serialNumber || '123456'})`}
          </button>
        </form>
      </section>

      {/* REGISTRY SECTION: SEARCH, BULK SELECTION, A4 PRINTING & TABLE */}
      <section className="space-y-4">
        {/* Registry Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-white">Active Product QR &amp; Serial Registry</h2>
            <p className="mt-1 text-xs text-slate-400">
              Showing {filteredSerials.length} of {genuinitySerials.length} registered QR serials.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Search serial, batch, product..."
                className="w-full rounded-xl border border-slate-700 bg-[#081b15] py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Print All Filtered */}
            <button
              type="button"
              disabled={printing || filteredSerials.length === 0}
              onClick={handlePrintAllFiltered}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/50 bg-[#10241f] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#FCE096] hover:bg-[#D4AF37]/20 disabled:opacity-50"
              title="Print all currently listed QR codes on A4 sticker sheets"
            >
              <Printer size={14} /> Print All ({filteredSerials.length}) QRs
            </button>

            {/* Delete All Filtered */}
            <button
              type="button"
              disabled={filteredSerials.length === 0}
              onClick={handleDeleteAllFiltered}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-900/60 bg-rose-950/40 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-rose-300 hover:bg-rose-900/40 disabled:opacity-50"
              title="Delete all listed serials"
            >
              <Trash2 size={14} /> Delete All
            </button>
          </div>
        </div>

        {/* Sticky Bulk Action Toolbar (When 1+ items selected) */}
        {selectedSerialIds.length > 0 && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border-2 border-[#D4AF37] bg-[#071610] p-4 text-xs shadow-2xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center rounded-lg bg-[#D4AF37] px-2.5 py-1 font-mono text-xs font-black text-black">
                {selectedSerialIds.length}
              </span>
              <span className="font-semibold text-white">
                serial{selectedSerialIds.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={printing}
                onClick={handlePrintSelected}
                className="btn-gold-luxury inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md"
              >
                <Printer size={14} /> Print Selected Stickers (A4)
              </button>
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-950/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-300 hover:bg-rose-900/80"
              >
                <Trash2 size={14} /> Delete Selected ({selectedSerialIds.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedSerialIds([])}
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 hover:text-white"
              >
                Deselect
              </button>
            </div>
          </div>
        )}

        {/* Registry Table */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-sm text-slate-400">
            <LoaderCircle className="animate-spin text-[#D4AF37]" size={18} /> Loading genuinity registry…
          </div>
        ) : filteredSerials.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-sm text-slate-400">
            No serials found matching your search. Generate your first QR code above!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#10241f]/75">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-slate-800 bg-[#081b15] text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="w-10 px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-slate-400 hover:text-[#D4AF37]"
                      title={isAllSelected ? 'Deselect all' : 'Select all'}
                    >
                      {isAllSelected ? (
                        <CheckSquare size={16} className="text-[#D4AF37]" />
                      ) : selectedSerialIds.length > 0 ? (
                        <MinusSquare size={16} className="text-[#D4AF37]" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-4">Serial / QR Number</th>
                  <th className="px-4 py-4">Product Formulation</th>
                  <th className="px-4 py-4">Batch / Sequence</th>
                  <th className="px-4 py-4">Manufacture / Expiry</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredSerials.map(record => {
                  const isSelected = selectedSerialIds.includes(record.id);
                  return (
                    <tr
                      key={record.id}
                      className={`transition ${isSelected ? 'bg-[#D4AF37]/10' : 'hover:bg-white/[0.025]'}`}
                    >
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectSerial(record.id)}
                          className="text-slate-400 hover:text-[#D4AF37]"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-[#D4AF37]" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-mono text-xs font-bold text-[#FCE096]">{record.serialNumber}</div>
                        <div className="mt-0.5 text-[10px] text-emerald-400">Active · Available</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-semibold text-white">{record.productName}</div>
                        {record.sku && <div className="text-[10px] text-slate-400">{record.sku}</div>}
                      </td>
                      <td className="px-4 py-4 text-xs">
                        <div className="font-mono text-slate-200">{record.batchNumber}</div>
                        <div className="text-[10px] text-slate-400">{record.bottleSequence || 'Single Bottle'}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-300">
                        <div>Mfg: {record.manufactureDate}</div>
                        <div className="text-[10px] text-slate-400">Exp: {record.expiryDate}</div>
                      </td>
                      <td className="px-4 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => selectGenuinityRecord(record)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FCE096] hover:bg-[#D4AF37]/20"
                        >
                          <QrCode size={13} /> View QR
                        </button>
                        <button
                          type="button"
                          onClick={() => printA4StickerSheets([record])}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-[#FCE096] hover:border-[#D4AF37]"
                          title="Print this sticker on A4 sheet"
                        >
                          <Printer size={13} /> Print
                        </button>
                        <button
                          type="button"
                          onClick={() => copyVerificationLink(record.serialNumber)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-white"
                        >
                          <Copy size={13} /> Link
                        </button>
                        <a
                          href={`/verify?code=${encodeURIComponent(record.serialNumber)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 hover:bg-emerald-900/30"
                        >
                          <ExternalLink size={13} /> Test
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteSingleSerial(record.id, record.serialNumber)}
                          className="inline-flex items-center p-1.5 text-slate-500 hover:text-rose-400"
                          title="Delete serial"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
