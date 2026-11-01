import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileDown,
  FlaskConical,
  Layers,
  LoaderCircle,
  Plus,
  Printer,
  QrCode,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
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

const DETAIL_STARTERS = [
  'Laboratory report reference',
  'Calibrated pH',
  'Microbiological test',
  'Heavy metals test',
  'Active ingredients / composition',
  'Botanical origin / sourcing',
  'Extraction or processing notes',
  'Packaging / tamper inspection',
];

const createDetail = (label = '', value = '', visible = true) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  label,
  value,
  visible,
});

const normalizeBatchDetails = details => (Array.isArray(details) ? details : []).map(detail => ({
  ...detail,
  id: detail.id || createDetail().id,
  label: detail.label || '',
  value: detail.value || '',
  visible: detail.visible !== false,
}));

const formatDate = value => (value ? String(value).slice(0, 10) : '—');

export default function AuthenticityBatchManagement() {
  const [activeMode, setActiveMode] = useState('single'); // 'single' | 'batch'
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [genuinitySerials, setGenuinitySerials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSingle, setSavingSingle] = useState(false);
  const [savingBatch, setSavingBatch] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [detailsDraft, setDetailsDraft] = useState([]);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const { showToast } = useToast() || {};
  const printCanvasRef = useRef(null);

  // Single Serial / Custom QR Form State
  const [singleForm, setSingleForm] = useState({
    productId: '',
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

  // Bulk Batch Form State
  const [batchForm, setBatchForm] = useState({
    productId: '',
    count: 88,
    prefix: 'BHMV',
    manufactureDate: '',
    expiryDate: '',
    details: DETAIL_STARTERS.map(label => createDetail(label)),
  });

  const [printLabels, setPrintLabels] = useState([]);

  const loadRegistry = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [productResponse, batchResponse, genuinityResponse] = await Promise.allSettled([
        productsApi.getAllAdmin(),
        serialsApi.getBatches(),
        serialsApi.getGenuinityList(),
      ]);

      let productRows = [];
      if (productResponse.status === 'fulfilled') {
        productRows = productResponse.value.data?.products ||
          productResponse.value.data?.data ||
          productResponse.value.data || [];
        setProducts(Array.isArray(productRows) ? productRows : []);
      }

      if (batchResponse.status === 'fulfilled') {
        setBatches(Array.isArray(batchResponse.value.data?.batches) ? batchResponse.value.data.batches : []);
      }

      if (genuinityResponse.status === 'fulfilled') {
        setGenuinitySerials(Array.isArray(genuinityResponse.value.data?.list) ? genuinityResponse.value.data.list : []);
      }

      const initialProdId = String(productRows[0]?.id || productRows[0]?._id || '2');
      setSingleForm(prev => ({
        ...prev,
        productId: prev.productId || initialProdId,
      }));
      setBatchForm(prev => ({
        ...prev,
        productId: prev.productId || initialProdId,
      }));
    } catch (loadError) {
      console.error('[GENUINITY_REGISTRY_LOAD]', loadError);
      setError('Could not load products and authenticity batches.');
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

  // When product changes in single form, auto-fill standard formulation defaults
  const handleProductChange = (productId) => {
    const preset = PRODUCT_PRESETS[Number(productId)] || {};
    const dateStamp = new Date().toISOString().slice(2, 7).replace('-', '');
    setSingleForm(prev => ({
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

  // Generate QR Code data URL whenever a serial is generated or selected
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

  const handleCreateSingleQR = async (e) => {
    e.preventDefault();
    setSavingSingle(true);
    setError('');
    try {
      const response = await serialsApi.createGenuinityQR({
        productId: singleForm.productId,
        serialNumber: singleForm.serialNumber.trim(),
        batchNumber: singleForm.batchNumber.trim(),
        bottleSequence: singleForm.bottleSequence.trim(),
        manufactureDate: singleForm.manufactureDate,
        expiryDate: singleForm.expiryDate,
        calibratedPh: singleForm.calibratedPh.trim(),
        extractionTemp: singleForm.extractionTemp.trim(),
        microbiologicalAssay: singleForm.microbiologicalAssay.trim(),
        heavyMetals: singleForm.heavyMetals.trim(),
        disclosedActives: singleForm.disclosedActives.trim(),
        tamperCustody: singleForm.tamperCustody.trim(),
        originLot: singleForm.originLot.trim(),
        details: singleForm.additionalDetails,
      });

      const result = response.data;
      setGeneratedResult(result);
      await renderQRCodeImage(result.serialNumber || singleForm.serialNumber);

      showToast?.(
        `Generated QR code for serial ${result.serialNumber || singleForm.serialNumber}!`,
        'success'
      );

      await loadRegistry();
    } catch (createError) {
      console.error('[GENUINITY_SINGLE_CREATE_ERROR]', createError);
      setError(createError.response?.data?.message || createError.message || 'Could not generate QR code.');
      showToast?.(createError.response?.data?.message || 'Failed to create genuinity record.', 'error');
    } finally {
      setSavingSingle(false);
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    setSavingBatch(true);
    try {
      const details = batchForm.details
        .filter(detail => detail.label.trim() && detail.value.trim())
        .map(({ label, value, visible }) => ({ label: label.trim(), value: value.trim(), visible }));
      const response = await serialsApi.createBatch({ ...batchForm, count: Number(batchForm.count), details });
      const batch = response.data?.batch;
      if (!batch?.id || !Array.isArray(batch.serials)) {
        throw new Error('The batch was created but label codes were not returned.');
      }
      setSelectedBatch(batch);
      setDetailsDraft(normalizeBatchDetails(batch.details));
      setBatchForm(current => ({
        ...current,
        count: 88,
        manufactureDate: '',
        expiryDate: '',
        details: DETAIL_STARTERS.map(label => createDetail(label)),
      }));
      showToast?.(`Created batch ${batch.batchNumber} with ${batch.serials.length} codes.`, 'success');
      await loadRegistry();
    } catch (createError) {
      console.error('[BATCH_CREATE_ERROR]', createError);
      showToast?.(createError.response?.data?.message || 'Could not create the batch.', 'error');
    } finally {
      setSavingBatch(false);
    }
  };

  const selectGenuinityRecord = async (record) => {
    setGeneratedResult(record);
    await renderQRCodeImage(record.serialNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSerial = async (serialId, serialNumber) => {
    if (!window.confirm(`Delete serial record "${serialNumber}"? This cannot be undone.`)) return;
    try {
      await serialsApi.deleteGenuinitySerial(serialId);
      showToast?.(`Deleted serial ${serialNumber}`, 'success');
      if (generatedResult?.id === serialId) {
        setGeneratedResult(null);
        setQrDataUrl('');
      }
      await loadRegistry();
    } catch (delError) {
      showToast?.(delError.response?.data?.message || 'Failed to delete serial.', 'error');
    }
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

  const printSingleLabel = (serialCode, productName, batchCode) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the label.');
      return;
    }
    const verifyUrl = `${window.location.origin}/verify?code=${encodeURIComponent(serialCode)}`;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bhumivera Authenticity Sticker - ${serialCode}</title>
          <style>
            @page { size: 50mm 50mm; margin: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 6mm;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              background: #fff;
              color: #111;
              box-sizing: border-box;
              height: 100vh;
            }
            .brand { font-size: 9px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #b89728; }
            .sub { font-size: 7px; color: #666; margin-bottom: 4px; }
            img { width: 30mm; height: 30mm; margin: 2px 0; }
            .serial { font-family: monospace; font-size: 11px; font-weight: 900; letter-spacing: 0.05em; margin-top: 3px; }
            .batch { font-size: 7px; color: #777; margin-top: 1px; }
            .url { font-size: 6.5px; color: #999; margin-top: 2px; }
          </style>
        </head>
        <body>
          <div class="brand">BHUMIVERA</div>
          <div class="sub">100% Genuine · The Transparent Maison</div>
          <img src="${qrDataUrl}" alt="${serialCode}" />
          <div class="serial">${serialCode}</div>
          <div class="batch">${batchCode || ''}</div>
          <div class="url">Scan or verify at bhumivera.com/verify</div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const autoGenerateRandomSerial = () => {
    const selectedProd = products.find(p => String(p.id || p._id) === String(singleForm.productId));
    const prefix = PRODUCT_PRESETS[Number(singleForm.productId)]?.prefix || 'BHMV';
    const yy = String(new Date().getFullYear()).slice(-2);
    const mm = String(new Date().getMonth() + 1).padStart(2, '0');
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    setSingleForm(prev => ({
      ...prev,
      serialNumber: `${prefix}-${yy}${mm}-${rand}`,
    }));
  };

  const filteredSerials = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return genuinitySerials;
    return genuinitySerials.filter(s =>
      (s.serialNumber || '').toLowerCase().includes(q) ||
      (s.productName || '').toLowerCase().includes(q) ||
      (s.batchNumber || '').toLowerCase().includes(q)
    );
  }, [genuinitySerials, searchFilter]);

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
          <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
            Generate custom QR codes (e.g. serial <code className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[#FCE096]">123456</code>) with certified lab assay details. When scanned by any camera, it opens <strong className="text-white">bhumivera.com/verify?code=123456</strong> and auto-populates the customer verification certificate.
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

      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveMode('single')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition ${
            activeMode === 'single'
              ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#FCE096]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles size={15} /> Generate Single / Custom QR (e.g. 123456)
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('batch')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition ${
            activeMode === 'batch'
              ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#FCE096]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers size={15} /> Bulk Production Batches &amp; Sheets
        </button>
      </div>

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
                  {generatedResult.serialNumber}
                </h3>
                <p className="text-sm font-semibold text-white">
                  {generatedResult.productName || 'Bhumivera Product'}
                </p>
                <p className="font-mono text-xs text-slate-400">
                  Batch: <span className="text-white">{generatedResult.batchNumber}</span> · {generatedResult.bottleSequence || 'Single Bottle'}
                </p>
                <div className="rounded-lg border border-slate-800 bg-black/60 px-3 py-1.5 font-mono text-xs text-[#cbd5e1] break-all">
                  {`${window.location.origin}/verify?code=${encodeURIComponent(generatedResult.serialNumber)}`}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col gap-2.5">
              <button
                type="button"
                onClick={() => downloadQrPng(generatedResult.serialNumber)}
                className="btn-gold-luxury inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
              >
                <Download size={15} /> Download QR (PNG)
              </button>
              <button
                type="button"
                onClick={() => printSingleLabel(generatedResult.serialNumber, generatedResult.productName, generatedResult.batchNumber)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-[#10241f] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#FCE096] hover:bg-[#D4AF37]/20"
              >
                <Printer size={15} /> Print QR Sticker
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

      {/* TAB 1: SINGLE SERIAL / CUSTOM QR GENERATOR */}
      {activeMode === 'single' && (
        <section className="rounded-3xl border border-[#D4AF37]/25 bg-[#10241f]/80 p-5 shadow-xl sm:p-8">
          <div className="mb-6 flex items-start gap-3">
            <span className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-3 text-[#FCE096]">
              <Sparkles size={20} />
            </span>
            <div>
              <h2 className="font-serif text-xl font-semibold text-white">Generate Custom QR Code &amp; Share Genuinity Details</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                Enter any serial number (e.g. <strong className="text-[#FCE096]">123456</strong>) and customize the certified laboratory assay and extraction details. The generated QR will encode <code className="text-[#FCE096]">bhumivera.com/verify?code=123456</code> and will auto-verify on scan.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateSingleQR} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Product Selector */}
              <label className="space-y-1.5 text-xs font-semibold text-slate-300">
                Product Formulation
                <select
                  required
                  value={singleForm.productId}
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

              {/* Serial / QR Number */}
              <div className="space-y-1.5 text-xs font-semibold text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Serial / QR Number (Custom or Generated)</span>
                  <button
                    type="button"
                    onClick={autoGenerateRandomSerial}
                    className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
                  >
                    Random Code
                  </button>
                </div>
                <input
                  required
                  type="text"
                  value={singleForm.serialNumber}
                  onChange={e => setSingleForm(prev => ({ ...prev, serialNumber: e.target.value.toUpperCase() }))}
                  placeholder="e.g. 123456"
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 font-mono text-base font-bold text-[#FCE096] outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Batch Code */}
              <label className="space-y-1.5 text-xs font-semibold text-slate-300">
                Batch Code
                <input
                  required
                  type="text"
                  value={singleForm.batchNumber}
                  onChange={e => setSingleForm(prev => ({ ...prev, batchNumber: e.target.value.toUpperCase() }))}
                  placeholder="e.g. BATCH-04/26-SB"
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 font-mono text-sm text-white outline-none focus:border-[#D4AF37]"
                />
              </label>

              {/* Bottle Sequence */}
              <label className="space-y-1.5 text-xs font-semibold text-slate-300">
                Bottle Sequence / Bottle Number
                <input
                  type="text"
                  value={singleForm.bottleSequence}
                  onChange={e => setSingleForm(prev => ({ ...prev, bottleSequence: e.target.value }))}
                  placeholder="e.g. Bottle #083 of 250"
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                />
              </label>

              {/* Manufacture Date */}
              <label className="space-y-1.5 text-xs font-semibold text-slate-300">
                Packaging / Manufacture Date
                <input
                  required
                  type="date"
                  value={singleForm.manufactureDate}
                  onChange={e => setSingleForm(prev => ({ ...prev, manufactureDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                />
              </label>

              {/* Expiry Date */}
              <label className="space-y-1.5 text-xs font-semibold text-slate-300">
                Expiry Date
                <input
                  required
                  type="date"
                  value={singleForm.expiryDate}
                  onChange={e => setSingleForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                />
              </label>
            </div>

            {/* Genuinity & Laboratory Assay Details */}
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#081b15]/80 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <FlaskConical size={18} className="text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Certified Laboratory Assay &amp; Genuinity Details
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Calibrated pH Assay</span>
                  <input
                    type="text"
                    value={singleForm.calibratedPh}
                    onChange={e => setSingleForm(prev => ({ ...prev, calibratedPh: e.target.value }))}
                    placeholder="e.g. 5.42 pH (at 25.0°C Digital Electrode)"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-emerald-300 outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Extraction Temperature</span>
                  <input
                    type="text"
                    value={singleForm.extractionTemp}
                    onChange={e => setSingleForm(prev => ({ ...prev, extractionTemp: e.target.value }))}
                    placeholder="e.g. 26.4°C (Sub-28°C Cold-Pressed Verified)"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Microbiological Assay</span>
                  <input
                    type="text"
                    value={singleForm.microbiologicalAssay}
                    onChange={e => setSingleForm(prev => ({ ...prev, microbiologicalAssay: e.target.value }))}
                    placeholder="e.g. Total Aerobic Count < 10 CFU/ml · Zero Pathogens"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Heavy Metal Screen (ICP-MS)</span>
                  <input
                    type="text"
                    value={singleForm.heavyMetals}
                    onChange={e => setSingleForm(prev => ({ ...prev, heavyMetals: e.target.value }))}
                    placeholder="e.g. Pb <0.05 ppm · As <0.02 ppm · Hg ND (ICP-MS)"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300 sm:col-span-2">
                  <span className="font-semibold text-[#FCE096]">100% Disclosed Active Profile</span>
                  <textarea
                    rows="2"
                    value={singleForm.disclosedActives}
                    onChange={e => setSingleForm(prev => ({ ...prev, disclosedActives: e.target.value }))}
                    placeholder="e.g. 4.0% Sea Buckthorn, 5.0% Glycerin, 0.5% Manjistha, 0.5% Haridra, 0.5% Neem..."
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Artisanal Tamper Custody</span>
                  <input
                    type="text"
                    value={singleForm.tamperCustody}
                    onChange={e => setSingleForm(prev => ({ ...prev, tamperCustody: e.target.value }))}
                    placeholder="e.g. Artisanal Wax-Sealed & Gold-Foil Collar"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>

                <label className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-[#FCE096]">Botanical Origin &amp; Lot</span>
                  <input
                    type="text"
                    value={singleForm.originLot}
                    onChange={e => setSingleForm(prev => ({ ...prev, originLot: e.target.value }))}
                    placeholder="e.g. Ladakh Nubra Valley Cooperative Lot #LDK-SB-2026"
                    className="w-full rounded-xl border border-slate-700 bg-[#11120F] p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSingle || activeProducts.length === 0}
              className="btn-gold-luxury inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-7 text-xs font-black uppercase tracking-widest text-white shadow-xl hover:brightness-110 disabled:opacity-60 sm:w-auto"
            >
              {savingSingle ? <LoaderCircle size={17} className="animate-spin" /> : <QrCode size={17} />}
              {savingSingle ? 'Generating QR & Registering Genuinity…' : `Generate QR Code & Save Record (${singleForm.serialNumber || '123456'})`}
            </button>
          </form>
        </section>
      )}

      {/* TAB 2: BULK PRODUCTION BATCHES */}
      {activeMode === 'batch' && (
        <section className="rounded-3xl border border-[#D4AF37]/25 bg-[#10241f]/80 p-5 shadow-xl sm:p-8">
          <div className="mb-6 flex items-start gap-3">
            <span className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-3 text-[#FCE096]">
              <Layers size={19} />
            </span>
            <div>
              <h2 className="font-serif text-xl font-semibold text-white">Create a Bulk Production Batch</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Each unit receives its own unpredictable code linked to this batch. Enter only dates and test results supported by your production records.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateBatch} className="space-y-7">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <label className="space-y-2 text-xs font-semibold text-slate-300 xl:col-span-2">
                Product
                <select
                  required
                  value={batchForm.productId}
                  onChange={event => setBatchForm(current => ({ ...current, productId: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                >
                  <option value="" disabled>Select a product</option>
                  {activeProducts.map(product => (
                    <option key={product.id || product._id} value={product.id || product._id}>{product.name}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-300">
                Quantity
                <input
                  required
                  type="number"
                  min="1"
                  max="1000"
                  step="1"
                  value={batchForm.count}
                  onChange={event => setBatchForm(current => ({ ...current, count: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                />
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-300">
                Code prefix
                <input
                  required
                  type="text"
                  minLength="2"
                  maxLength="8"
                  pattern="[A-Za-z0-9]{2,8}"
                  value={batchForm.prefix}
                  onChange={event => setBatchForm(current => ({ ...current, prefix: event.target.value.toUpperCase() }))}
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 font-mono text-sm text-[#FCE096] outline-none focus:border-[#D4AF37]"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold text-slate-300">
                Manufacture date
                <input
                  required
                  type="date"
                  value={batchForm.manufactureDate}
                  onChange={event => setBatchForm(current => ({ ...current, manufactureDate: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                />
              </label>
              <label className="space-y-2 text-xs font-semibold text-slate-300">
                Expiry date
                <input
                  required
                  type="date"
                  min={batchForm.manufactureDate || undefined}
                  value={batchForm.expiryDate}
                  onChange={event => setBatchForm(current => ({ ...current, expiryDate: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={savingBatch || activeProducts.length === 0}
              className="btn-gold-luxury inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-widest text-white hover:brightness-105 disabled:opacity-60 sm:w-auto"
            >
              {savingBatch ? <LoaderCircle size={17} className="animate-spin" /> : <QrCode size={17} />}
              {savingBatch ? 'Creating secure batch…' : 'Create Batch & Generate Codes'}
            </button>
          </form>
        </section>
      )}

      {/* REGISTRY TABLE: SAVED GENUINITY SERIALS & QR CODES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-semibold text-white">Active Product QR &amp; Serial Registry</h2>
            <p className="mt-1 text-xs text-slate-400">All registered serials can be verified immediately via link or QR scan.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search serial, batch, or product..."
              className="w-full rounded-xl border border-slate-700 bg-[#081b15] py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

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
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-800 bg-[#081b15] text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-4">Serial / QR Number</th>
                  <th className="px-4 py-4">Product Formulation</th>
                  <th className="px-4 py-4">Batch / Sequence</th>
                  <th className="px-4 py-4">Manufacture / Expiry</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredSerials.map(record => (
                  <tr key={record.id} className="hover:bg-white/[0.025] transition">
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
                      <div className="text-[10px] text-slate-400">{record.bottleSequence || 'Single'}</div>
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
                        onClick={() => handleDeleteSerial(record.id, record.serialNumber)}
                        className="inline-flex items-center p-1.5 text-slate-500 hover:text-rose-400"
                        title="Delete serial"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
