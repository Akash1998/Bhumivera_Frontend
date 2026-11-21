import React, { useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, QrCode, ShieldCheck, Trash2 } from 'lucide-react';
import {
  computeStandaloneA4QrLayout,
  createUniqueQrCode,
  getStandaloneQrPageCount,
  MAX_QRS,
  MAX_QRS_PER_A4_PAGE,
  MAX_QR_SIZE_MM,
} from '../../utils/standaloneQrUtils';

function downloadCsv(items) {
  const rows = [
    ['Code', 'Generated At'],
    ...items.map(item => [item.code, item.generatedAt.toISOString()]),
  ];
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `bhumivera-qr-codes-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function StandaloneQrGenerator() {
  const [quantity, setQuantity] = useState('30');
  const [items, setItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const pages = useMemo(() => {
    const result = [];
    for (let offset = 0; offset < items.length; offset += MAX_QRS_PER_A4_PAGE) {
      const pageItems = items.slice(offset, offset + MAX_QRS_PER_A4_PAGE);
      result.push({ items: pageItems, layout: computeStandaloneA4QrLayout(pageItems.length) });
    }
    return result;
  }, [items]);

  const handleGenerate = async event => {
    event.preventDefault();
    const count = Number(quantity);
    if (!Number.isSafeInteger(count) || count < 1 || count > MAX_QRS) {
      setError(`Enter a whole number between 1 and ${MAX_QRS}.`);
      setNotice('');
      return;
    }
    if (items.length + count > MAX_QRS) {
      setError(`You can keep up to ${MAX_QRS} codes in this session. Export or clear the current list before generating more.`);
      setNotice('');
      return;
    }

    setIsGenerating(true);
    setError('');
    setNotice('');
    try {
      const existingCodes = new Set(items.map(item => item.code));
      const generatedAt = new Date();
      const newItems = await Promise.all(
        Array.from({ length: count }, async () => {
          const code = createUniqueQrCode(existingCodes);
          const qrDataUrl = await QRCode.toDataURL(code, {
            width: 512,
            margin: 1,
            errorCorrectionLevel: 'M',
          });
          return { code, qrDataUrl, generatedAt };
        }),
      );
      setItems(previous => [...previous, ...newItems]);
      setNotice(`${newItems.length} standalone QR ${newItems.length === 1 ? 'code' : 'codes'} generated. Export the CSV to keep a copy for manual Genuinity portal linking.`);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Could not generate QR codes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCsv = () => {
    try {
      downloadCsv(items);
      setError('');
      setNotice('CSV exported. Keep it with your packaging records for manual portal linking.');
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Could not export the QR code list.');
      setNotice('');
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (printError) {
      setError(printError instanceof Error ? printError.message : 'Could not open A4 print preview.');
      setNotice('');
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(items.map(item => item.code).join('\n'));
      setNotice('QR codes copied to clipboard.');
      setError('');
    } catch {
      setError('Could not access the clipboard. Download the CSV to copy your codes.');
      setNotice('');
    }
  };

  return (
    <div className="standalone-qr-generator space-y-6 text-slate-100">
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        @media print {
          body * { visibility: hidden !important; }
          .standalone-qr-print, .standalone-qr-print * { visibility: visible !important; }
          .standalone-qr-print { display: block !important; position: absolute; inset: 0; width: 210mm; }
          .standalone-qr-print-page {
            box-sizing: border-box; width: 210mm; height: 297mm; padding: 5mm;
            page-break-after: always; break-after: page; overflow: hidden;
          }
          .standalone-qr-print-page:last-child { page-break-after: auto; break-after: auto; }
          .standalone-qr-print-grid { display: grid !important; height: 100%; }
          .standalone-qr-print-cell {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            min-width: 0; overflow: hidden; color: #111;
          }
          .standalone-qr-print-cell img { display: block; object-fit: contain; }
          .standalone-qr-print-code {
            max-width: 100%; margin-top: 1mm; overflow: hidden; font: 7pt monospace;
            text-align: center; white-space: nowrap;
          }
        }
      `}</style>

      <header className="admin-glass-panel rounded-2xl border border-emerald-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-300">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Packaging & authenticity</p>
            <h1 className="mt-1 text-2xl font-black text-white">Standalone QR codes</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Generate unique product-authenticity codes without choosing a product or batch. Each QR contains only its code;
              link the codes to products in the Genuinity portal when you are ready.
            </p>
          </div>
        </div>
      </header>

      <section className="admin-glass-panel rounded-2xl border border-slate-700/70 p-6">
        <form onSubmit={handleGenerate} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="max-w-xs flex-1 text-sm font-semibold text-slate-200">
            Number of QR codes
            <input
              type="number"
              min="1"
              max={MAX_QRS}
              step="1"
              value={quantity}
              onChange={event => setQuantity(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
            />
          </label>
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60"
          >
            <QrCode size={18} />
            {isGenerating ? 'Generating…' : 'Generate QR codes'}
          </button>
        </form>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          Codes are generated securely in this browser and are not registered or linked automatically. Export the CSV before leaving this page.
          A4 sheets size each QR up to {MAX_QR_SIZE_MM} mm and add pages as needed.
        </p>
        {error && <p role="alert" className="mt-4 rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</p>}
        {notice && <p role="status" className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-3 text-sm text-emerald-200">{notice}</p>}
      </section>

      {items.length > 0 && (
        <section className="admin-glass-panel rounded-2xl border border-slate-700/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">{items.length} codes ready</h2>
              <p className="mt-1 text-sm text-slate-400">{getStandaloneQrPageCount(items.length)} A4 {pages.length === 1 ? 'sheet' : 'sheets'} · QR codes are not linked to products or batches</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleCopyAll} className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-emerald-400">
                Copy codes
              </button>
              <button type="button" onClick={handleDownloadCsv} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-emerald-400">
                <Download size={16} /> Export CSV
              </button>
              <button type="button" onClick={handlePrint} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-300">
                <Printer size={16} /> Print A4 sheets
              </button>
              <button
                type="button"
                onClick={() => {
                  setItems([]);
                  setNotice('');
                  setError('');
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-950/40"
              >
                <Trash2 size={16} /> Clear
              </button>
            </div>
          </div>

          <div className="mt-5 max-h-80 overflow-auto rounded-xl border border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-900 text-xs uppercase text-slate-400">
                <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Generated at</th></tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.code} className="border-t border-slate-800">
                    <td className="px-4 py-2 font-mono text-emerald-200">{item.code}</td>
                    <td className="px-4 py-2 text-slate-400">{item.generatedAt.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="standalone-qr-print hidden" aria-hidden="true">
        {pages.map(({ items: pageItems, layout }, pageIndex) => (
          <section className="standalone-qr-print-page" key={`page-${pageIndex + 1}`}>
            <div
              className="standalone-qr-print-grid"
              style={{
                gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
                gap: `${layout.gapMm}mm`,
              }}
            >
              {pageItems.map(item => (
                <div className="standalone-qr-print-cell" key={item.code}>
                  <img src={item.qrDataUrl} alt="" style={{ width: `${layout.qrSizeMm}mm`, height: `${layout.qrSizeMm}mm` }} />
                  <span className="standalone-qr-print-code">{item.code}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
