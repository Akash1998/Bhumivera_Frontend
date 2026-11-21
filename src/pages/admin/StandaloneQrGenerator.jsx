import React, { useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { Download, QrCode, ShieldCheck, Trash2 } from 'lucide-react';
import {
  calculateQrSheetLayout,
  createUniqueQrCode,
  MAX_PAGE_LENGTH_MM,
  PAPER_FORMATS,
  QR_CELL_HEIGHT_MM,
  QR_CELL_WIDTH_MM,
  QR_SIZE_MM,
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

async function createPdf(items, layout, onProgress) {
  const document = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [layout.widthMm, layout.heightMm],
    compress: true,
    precision: 16,
  });
  document.setFillColor(0, 0, 0);

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const column = index % layout.columns;
    const row = Math.floor(index / layout.columns);
    const qr = QRCode.create(item.code, { errorCorrectionLevel: 'M' });
    const moduleCount = qr.modules.size;
    const moduleSizeMm = QR_SIZE_MM / (moduleCount + 8);
    const x = layout.offsetXmm + column * QR_CELL_WIDTH_MM + (QR_CELL_WIDTH_MM - QR_SIZE_MM) / 2 + moduleSizeMm * 4;
    const y = layout.offsetYmm + row * QR_CELL_HEIGHT_MM + moduleSizeMm * 4;

    for (let qrRow = 0; qrRow < moduleCount; qrRow += 1) {
      let runStart = -1;
      for (let qrColumn = 0; qrColumn <= moduleCount; qrColumn += 1) {
        const isDark = qrColumn < moduleCount && Boolean(qr.modules.data[qrRow * moduleCount + qrColumn]);
        if (isDark && runStart < 0) runStart = qrColumn;
        if (!isDark && runStart >= 0) {
          document.rect(
            x + runStart * moduleSizeMm,
            y + qrRow * moduleSizeMm,
            (qrColumn - runStart) * moduleSizeMm,
            moduleSizeMm,
            'F',
          );
          runStart = -1;
        }
      }
    }

    if ((index + 1) % 32 === 0 && index + 1 < items.length) {
      onProgress(index + 1);
      await new Promise(resolve => window.setTimeout(resolve, 0));
    }
  }

  return document;
}

export default function StandaloneQrGenerator() {
  const [paperFormat, setPaperFormat] = useState('A4');
  const [pageHeightMm, setPageHeightMm] = useState(String(PAPER_FORMATS.A4.heightMm));
  const [items, setItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const pageSize = PAPER_FORMATS[paperFormat];
  const layout = useMemo(() => {
    try {
      return calculateQrSheetLayout(pageSize.widthMm, pageHeightMm);
    } catch {
      return null;
    }
  }, [pageSize.widthMm, pageHeightMm]);

  const handlePaperFormatChange = event => {
    const nextFormat = event.target.value;
    setPaperFormat(nextFormat);
    setPageHeightMm(String(PAPER_FORMATS[nextFormat].heightMm));
    setError('');
  };

  const handleGenerate = async () => {
    if (!layout) {
      setError(`Enter a page length between ${QR_CELL_HEIGHT_MM} and ${MAX_PAGE_LENGTH_MM} mm.`);
      setNotice('');
      return;
    }
    if (items.length && !window.confirm('Generating a new sheet replaces the current QR list. Export the CSV first if you still need those codes. Continue?')) {
      return;
    }

    setIsGenerating(true);
    setError('');
    setNotice('');
    try {
      const existingCodes = new Set();
      const generatedAt = new Date();
      const generatedItems = [];

      for (let index = 0; index < layout.qrCount; index += 1) {
        const code = createUniqueQrCode(existingCodes);
        generatedItems.push({ code, generatedAt });
      }

      setItems(generatedItems);
      const pdf = await createPdf(generatedItems, layout, generated => {
        setNotice(`Preparing vector PDF… ${generated} / ${layout.qrCount} QRs`);
      });
      const date = generatedAt.toISOString().slice(0, 10);
      pdf.save(`bhumivera-${paperFormat.toLowerCase()}-qr-sheet-${date}.pdf`);
      setNotice(`Created a ${paperFormat} PDF with ${layout.qrCount} plain QR codes. Export the CSV to keep their IDs for manual Genuinity portal linking.`);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Could not generate the QR sheet PDF.');
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
    <div className="space-y-6 text-slate-100">
      <header className="admin-glass-panel rounded-2xl border border-emerald-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-300">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Packaging & authenticity</p>
            <h1 className="mt-1 text-2xl font-black text-white">Standalone QR codes</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Generate a full A4 or A3 sheet of unique QR codes. Codes are independent of products and batches; link them to the
              Genuinity portal manually when ready.
            </p>
          </div>
        </div>
      </header>

      <section className="admin-glass-panel rounded-2xl border border-slate-700/70 p-6">
        <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
          <label className="text-sm font-semibold text-slate-200">
            Paper size
            <select
              value={paperFormat}
              onChange={handlePaperFormatChange}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
            >
              <option value="A4">A4 · 210 × 297 mm</option>
              <option value="A3">A3 · 297 × 420 mm</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-200">
            Page length (mm)
            <input
              type="number"
              min={QR_CELL_HEIGHT_MM}
              max={MAX_PAGE_LENGTH_MM}
              step="1"
              value={pageHeightMm}
              onChange={event => {
                setPageHeightMm(event.target.value);
                setError('');
              }}
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-400"
            />
          </label>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !layout}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60"
          >
            <QrCode size={18} />
            {isGenerating ? 'Building high-resolution PDF…' : `Generate full sheet HQ PDF`}
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-300">
          {layout ? (
            <p>
              {paperFormat} · {pageSize.widthMm} × {layout.heightMm} mm · {layout.columns} columns × {layout.rows} rows ·
              {' '}{layout.qrCount} codes per sheet
            </p>
          ) : (
            <p>Page length must be at least {QR_CELL_HEIGHT_MM} mm.</p>
          )}
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Each cell is {QR_CELL_WIDTH_MM} × {QR_CELL_HEIGHT_MM} mm. The QR artwork stays square at {QR_SIZE_MM} × {QR_SIZE_MM} mm
            for reliable scanning. The PDF uses vector QR modules for sharp printing at any resolution and contains no text or labels.
            CSV export keeps the code-to-packaging list.
          </p>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          QR images are generated at high resolution and placed at exact millimetre dimensions in the PDF. Export the code list before
          leaving this page; codes are not saved to the server or linked automatically.
        </p>
        {error && <p role="alert" className="mt-4 rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</p>}
        {notice && <p role="status" className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-3 text-sm text-emerald-200">{notice}</p>}
      </section>

      {items.length > 0 && (
        <section className="admin-glass-panel rounded-2xl border border-slate-700/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">{items.length} codes generated</h2>
              <p className="mt-1 text-sm text-slate-400">Code list for manual Genuinity portal linking · not printed on the PDF</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleCopyAll} className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-emerald-400">
                Copy codes
              </button>
              <button type="button" onClick={handleDownloadCsv} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-emerald-400">
                <Download size={16} /> Export CSV
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
    </div>
  );
}
