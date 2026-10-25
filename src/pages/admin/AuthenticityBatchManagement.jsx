import React, { useCallback, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  AlertCircle,
  Eye,
  EyeOff,
  FileDown,
  FlaskConical,
  LoaderCircle,
  Plus,
  Printer,
  QrCode,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { products as productsApi, serials as serialsApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

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

const formatDate = value => value ? String(value).slice(0, 10) : '—';

export default function AuthenticityBatchManagement() {
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [detailsDraft, setDetailsDraft] = useState([]);
  const { showToast } = useToast() || {};
  const [form, setForm] = useState({
    productId: '',
    count: 88,
    prefix: 'BHMV',
    manufactureDate: '',
    expiryDate: '',
    details: DETAIL_STARTERS.map(label => createDetail(label)),
  });

  const loadRegistry = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [productResponse, batchResponse] = await Promise.all([
        productsApi.getAllAdmin(),
        serialsApi.getBatches(),
      ]);
      const productRows = productResponse.data?.products ||
        productResponse.data?.data ||
        productResponse.data;
      if (!Array.isArray(productRows)) throw new Error('The product list response was invalid.');
      setProducts(productRows);
      setBatches(Array.isArray(batchResponse.data?.batches) ? batchResponse.data.batches : []);
      setForm(current => ({
        ...current,
        productId: current.productId || String(productRows[0]?.id || productRows[0]?._id || ''),
      }));
    } catch (loadError) {
      console.error('[AUTHENTICITY_BATCH_REGISTRY_LOAD]', loadError);
      setError(loadError.response?.data?.message || 'Could not load products and authenticity batches.');
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

  const handleCreateBatch = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const details = form.details
        .filter(detail => detail.label.trim() && detail.value.trim())
        .map(({ label, value, visible }) => ({ label: label.trim(), value: value.trim(), visible }));
      const response = await serialsApi.createBatch({ ...form, count: Number(form.count), details });
      const batch = response.data?.batch;
      if (!batch?.id || !Array.isArray(batch.serials)) {
        throw new Error('The batch was created but the response did not include its label codes.');
      }
      setSelectedBatch(batch);
      setDetailsDraft(normalizeBatchDetails(batch.details));
      setForm(current => ({
        ...current,
        count: 88,
        manufactureDate: '',
        expiryDate: '',
        details: DETAIL_STARTERS.map(label => createDetail(label)),
      }));
      showToast?.(`Created ${batch.batchNumber} with ${batch.serials.length} unique product codes.`, 'success');
      await loadRegistry();
    } catch (createError) {
      console.error('[AUTHENTICITY_BATCH_CREATE]', createError);
      showToast?.(createError.response?.data?.message || createError.message || 'Could not create the batch.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openBatch = async batchSummary => {
    setError('');
    try {
      const response = await serialsApi.getBatch(batchSummary.id);
      const batch = response.data?.batch;
      if (!batch) throw new Error('Batch details were missing from the response.');
      setSelectedBatch(batch);
      setDetailsDraft(normalizeBatchDetails(batch.details));
    } catch (batchError) {
      console.error('[AUTHENTICITY_BATCH_DETAIL]', batchError);
      setError(batchError.response?.data?.message || 'Could not load this batch.');
    }
  };

  const saveVisibility = async () => {
    if (!selectedBatch) return;
    setSavingDetails(true);
    try {
      const details = detailsDraft.map(({ label, value, visible }) => ({ label, value, visible }));
      const response = await serialsApi.updateBatchDetails(selectedBatch.id, details);
      setDetailsDraft(normalizeBatchDetails(response.data?.details));
      setSelectedBatch(current => ({ ...current, details: response.data?.details || [] }));
      await loadRegistry();
      showToast?.('Public batch details updated.', 'success');
    } catch (saveError) {
      console.error('[AUTHENTICITY_BATCH_DETAILS_SAVE]', saveError);
      showToast?.(saveError.response?.data?.message || 'Could not update public batch details.', 'error');
    } finally {
      setSavingDetails(false);
    }
  };

  const printBatchLabels = async () => {
    if (!selectedBatch?.serials?.length) return;
    setPrinting(true);
    try {
      const labels = await Promise.all(selectedBatch.serials.map(async item => {
        const verificationUrl = new URL('/verify', window.location.origin);
        verificationUrl.searchParams.set('serial', item.serial_number);
        const dataUrl = await QRCode.toDataURL(verificationUrl.toString(), {
          errorCorrectionLevel: 'Q',
          margin: 1,
          width: 180,
          color: { dark: '#11120F', light: '#FFFFFF' },
        });
        return { serialNumber: item.serial_number, dataUrl };
      }));
      setPrintLabels(labels);
      window.setTimeout(() => {
        window.print();
        setPrinting(false);
      }, 150);
    } catch (printError) {
      console.error('[AUTHENTICITY_LABEL_QR_GENERATION]', printError);
      showToast?.('Could not create QR labels for this batch. Please try again.', 'error');
      setPrinting(false);
    }
  };

  const [printLabels, setPrintLabels] = useState([]);

  return (
    <div className="authenticity-admin space-y-7 pb-10 text-slate-200">
      <header className="flex flex-col gap-4 border-b border-[#D4AF37]/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D4AF37]">Production traceability</p>
          <h1 className="mt-2 flex items-center gap-3 font-serif text-3xl font-bold text-white">
            <ShieldCheck className="text-[#D4AF37]" /> Authenticity &amp; Batch Registry
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Create traceable product batches, add real production and test data, and print unique QR stickers for verification.
          </p>
        </div>
        <button type="button" onClick={() => void loadRegistry()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-[#D4AF37]/50">
          <RefreshCw size={15} /> Refresh registry
        </button>
      </header>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-400/30 bg-rose-950/20 p-4 text-sm text-rose-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <section className="rounded-3xl border border-[#D4AF37]/25 bg-[#10241f]/80 p-5 shadow-xl sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-3 text-[#FCE096]"><Plus size={19} /></span>
          <div>
            <h2 className="font-serif text-xl font-semibold text-white">Create a production batch</h2>
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
                value={form.productId}
                onChange={event => setForm(current => ({ ...current, productId: event.target.value }))}
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
                required type="number" min="1" max="1000" step="1"
                value={form.count}
                onChange={event => setForm(current => ({ ...current, count: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]"
              />
            </label>
            <label className="space-y-2 text-xs font-semibold text-slate-300">
              Code prefix
              <input
                required type="text" minLength="2" maxLength="8" pattern="[A-Za-z0-9]{2,8}"
                value={form.prefix}
                onChange={event => setForm(current => ({ ...current, prefix: event.target.value.toUpperCase() }))}
                className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 font-mono text-sm text-[#FCE096] outline-none focus:border-[#D4AF37]"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-xs font-semibold text-slate-300">
              Manufacture date
              <input required type="date" value={form.manufactureDate} onChange={event => setForm(current => ({ ...current, manufactureDate: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]" />
            </label>
            <label className="space-y-2 text-xs font-semibold text-slate-300">
              Expiry date
              <input required type="date" min={form.manufactureDate || undefined} value={form.expiryDate} onChange={event => setForm(current => ({ ...current, expiryDate: event.target.value }))} className="w-full rounded-xl border border-slate-700 bg-[#081b15] p-3 text-sm text-white outline-none focus:border-[#D4AF37]" />
            </label>
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-white"><FlaskConical size={16} className="text-[#D4AF37]" /> Batch information shown after scanning</h3>
                <p className="mt-1 text-[11px] text-slate-400">Blank entries are not saved. All entered entries are public by default; control visibility per entry.</p>
              </div>
              <button type="button" onClick={() => setForm(current => ({ ...current, details: [...current.details, createDetail()] }))} disabled={form.details.length >= 40} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-200 hover:border-[#D4AF37]/50 disabled:opacity-50">
                <Plus size={14} /> Add detail
              </button>
            </div>
            <div className="space-y-3">
              {form.details.map((detail, index) => (
                <div key={detail.id} className="grid gap-3 rounded-xl border border-slate-800 bg-[#081b15]/70 p-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto_auto] sm:items-center">
                  <input
                    aria-label={`Batch detail ${index + 1} label`}
                    maxLength="100"
                    value={detail.label}
                    onChange={event => setForm(current => ({ ...current, details: current.details.map((entry, entryIndex) => entryIndex === index ? { ...entry, label: event.target.value } : entry) }))}
                    placeholder="Detail name (e.g. Calibrated pH)"
                    className="min-w-0 rounded-lg border border-slate-700 bg-[#11120F] px-3 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                  <textarea
                    aria-label={`Batch detail ${index + 1} value`}
                    maxLength="2000"
                    rows="2"
                    value={detail.value}
                    onChange={event => setForm(current => ({ ...current, details: current.details.map((entry, entryIndex) => entryIndex === index ? { ...entry, value: event.target.value } : entry) }))}
                    placeholder="Actual result or traceability detail"
                    className="min-w-0 resize-y rounded-lg border border-slate-700 bg-[#11120F] px-3 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                  <label className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    <input type="checkbox" checked={detail.visible} onChange={event => setForm(current => ({ ...current, details: current.details.map((entry, entryIndex) => entryIndex === index ? { ...entry, visible: event.target.checked } : entry) }))} className="accent-[#D4AF37]" />
                    Show
                  </label>
                  <button type="button" aria-label={`Remove batch detail ${index + 1}`} onClick={() => setForm(current => ({ ...current, details: current.details.filter((_, entryIndex) => entryIndex !== index) }))} className="justify-self-end rounded-lg p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving || activeProducts.length === 0} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FCE096] px-6 text-xs font-black uppercase tracking-widest text-[#11120F] hover:brightness-105 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
            {saving ? <LoaderCircle size={17} className="animate-spin" /> : <QrCode size={17} />}
            {saving ? 'Creating secure batch…' : 'Create batch & unique codes'}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-white">Saved production batches</h2>
          <p className="mt-1 text-xs text-slate-400">Review scan-page visibility and print QR labels for a saved batch.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-sm text-slate-400">
            <LoaderCircle className="animate-spin text-[#D4AF37]" size={18} /> Loading batch registry…
          </div>
        ) : batches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-sm text-slate-400">
            No production batches yet. Create your first batch above.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#10241f]/75">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-800 bg-[#081b15] text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-4">Batch / product</th>
                  <th className="px-4 py-4">Manufactured</th>
                  <th className="px-4 py-4">Expires</th>
                  <th className="px-4 py-4">Codes</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {batches.map(batch => (
                  <tr key={batch.id} className="hover:bg-white/[0.025]">
                    <td className="px-4 py-4">
                      <div className="font-mono text-xs font-bold text-[#FCE096]">{batch.batch_number}</div>
                      <div className="mt-1 text-xs text-slate-300">{batch.product_name} {batch.sku ? `· ${batch.sku}` : ''}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-300">{formatDate(batch.manufacture_date)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-300">{formatDate(batch.expiry_date)}</td>
                    <td className="px-4 py-4 text-xs text-slate-300">{batch.generated_count} / {batch.unit_count}</td>
                    <td className="px-4 py-4 text-right">
                      <button type="button" onClick={() => void openBatch(batch)} className="inline-flex items-center gap-2 rounded-lg border border-[#D4AF37]/30 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#FCE096] hover:bg-[#D4AF37]/10">
                        <Eye size={14} /> Details &amp; labels
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedBatch && (
        <section className="batch-label-controls rounded-3xl border border-[#D4AF37]/25 bg-[#10241f]/80 p-5 shadow-xl sm:p-7">
          <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Selected batch</p>
              <h2 className="mt-2 break-all font-mono text-lg font-bold text-[#FCE096]">{selectedBatch.batch_number || selectedBatch.batchNumber}</h2>
              <p className="mt-1 text-sm text-slate-300">{selectedBatch.product_name || selectedBatch.productName} · {selectedBatch.serials.length} unique labels</p>
            </div>
            <button type="button" onClick={() => void printBatchLabels()} disabled={printing || !selectedBatch.serials.length} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-xs font-black uppercase tracking-wider text-[#11120F] hover:bg-[#FCE096] disabled:opacity-60">
              {printing ? <LoaderCircle size={16} className="animate-spin" /> : <Printer size={16} />}
              {printing ? 'Preparing labels…' : 'Print A4 QR labels'}
            </button>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#D4AF37]/15 bg-[#081b15]/70 p-4 text-xs leading-relaxed text-slate-300">
            <FileDown size={17} className="mt-0.5 shrink-0 text-[#D4AF37]" />
            <p>Print layout: A4 portrait, 5 mm page margins, 8 × 11 grid, 25 × 25 mm labels. Use 100% / actual-size scale in the print dialog; disable browser headers and footers.</p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-white">Public scan-page details</h3>
            <p className="mt-1 text-xs text-slate-400">Show all recorded details by default. Hide any item you do not want customers to see.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {detailsDraft.map((detail, index) => (
                <label key={detail.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#081b15]/70 p-3">
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-slate-200">{detail.label}</span>
                    <span className="mt-1 block truncate text-[11px] text-slate-500">{detail.value || 'No value recorded'}</span>
                  </span>
                  <span className={`inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${detail.visible ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {detail.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    <input
                      type="checkbox"
                      checked={detail.visible}
                      onChange={event => setDetailsDraft(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, visible: event.target.checked } : item))}
                      aria-label={`${detail.visible ? 'Hide' : 'Show'} ${detail.label} on the public scan page`}
                      className="accent-[#D4AF37]"
                    />
                  </span>
                </label>
              ))}
              {detailsDraft.length === 0 && <p className="text-xs text-slate-500">No additional batch details are recorded.</p>}
            </div>
            <button type="button" onClick={() => void saveVisibility()} disabled={savingDetails} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-200 hover:border-[#D4AF37]/40 disabled:opacity-60">
              {savingDetails ? <LoaderCircle size={14} className="animate-spin" /> : <Save size={14} />}
              Save scan-page visibility
            </button>
          </div>
        </section>
      )}

      <div className="print-label-pages" aria-hidden="true">
        {Array.from({ length: Math.ceil(printLabels.length / 88) }, (_, pageIndex) => (
          <div className="print-label-page" key={pageIndex}>
            {printLabels.slice(pageIndex * 88, (pageIndex + 1) * 88).map(label => (
              <div className="print-label" key={label.serialNumber}>
                <img src={label.dataUrl} alt="" />
                <span>{label.serialNumber}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
