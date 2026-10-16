import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award,
  Building2,
  CheckCircle2,
  CheckSquare,
  Download,
  Eye,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wand2,
} from 'lucide-react';
import api from '../../services/api';
import LuxuryTaxInvoiceModal, {
  buildPrintableLuxuryInvoiceHtml,
  formatInr,
  normalizeInvoiceDocument,
} from '../../components/LuxuryTaxInvoiceModal';

const ADMIN = { adminAuth: true };
const localDate = date =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const today = () => localDate(new Date());
const monthStart = date => `${date.slice(0, 7)}-01`;

const INDIAN_STATES = [
  ['01', 'Jammu and Kashmir'], ['02', 'Himachal Pradesh'], ['03', 'Punjab'], ['04', 'Chandigarh'],
  ['05', 'Uttarakhand'], ['06', 'Haryana'], ['07', 'Delhi'], ['08', 'Rajasthan'],
  ['09', 'Uttar Pradesh'], ['10', 'Bihar'], ['11', 'Sikkim'], ['12', 'Arunachal Pradesh'],
  ['13', 'Nagaland'], ['14', 'Manipur'], ['15', 'Mizoram'], ['16', 'Tripura'],
  ['17', 'Meghalaya'], ['18', 'Assam'], ['19', 'West Bengal'], ['20', 'Jharkhand'],
  ['21', 'Odisha'], ['22', 'Chhattisgarh'], ['23', 'Madhya Pradesh'], ['24', 'Gujarat'],
  ['26', 'Dadra and Nagar Haveli and Daman and Diu'], ['27', 'Maharashtra'], ['29', 'Karnataka'],
  ['30', 'Goa'], ['31', 'Lakshadweep'], ['32', 'Kerala'], ['33', 'Tamil Nadu'],
  ['34', 'Puducherry'], ['35', 'Andaman and Nicobar Islands'], ['36', 'Telangana'],
  ['37', 'Andhra Pradesh'], ['38', 'Ladakh'],
];

const emptyExpense = {
  incurred_on: today(),
  vendor_name: '',
  supplier_gstin: '',
  document_reference: '',
  category: 'Operating expense',
  description: '',
  taxable_value: '',
  cgst: '',
  sgst: '',
  igst: '',
  total: '',
  itc_eligible: false,
};

const datePresets = preset => {
  const now = new Date();
  const end = localDate(now);
  if (preset === 'month') return { from: monthStart(end), to: end };
  if (preset === 'quarter') {
    const quarterIndex = Math.floor(((now.getMonth() - 3 + 12) % 12) / 3);
    const quarterMonth = (3 + quarterIndex * 3) % 12;
    const quarterYear = now.getFullYear() - (now.getMonth() < 3 ? 1 : 0);
    const from = localDate(new Date(quarterYear, quarterMonth, 1));
    return { from, to: end };
  }
  const fiscalStartYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return { from: `${fiscalStartYear}-04-01`, to: `${fiscalStartYear + 1}-03-31` };
};

const rupees = value =>
  `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function GSTAccounting() {
  const [activeSection, setActiveSection] = useState('all'); // 'all' | 'invoices' | 'ready' | 'gstr' | 'products' | 'expenses' | 'profile' | 'audit'
  const [period, setPeriod] = useState(() => datePresets('month'));
  const [profile, setProfile] = useState({
    legal_name: 'Bhumivera Botanicals',
    trade_name: 'BHUMIVERA BOTANICALS',
    gstin: '',
    pan_number: '',
    cin_number: '',
    lut_number: '',
    address: '',
    state_code: '19',
    state_name: 'West Bengal',
    email: '',
    phone: '',
    invoice_prefix: 'BV',
    shipping_sac: '996812',
    shipping_gst_rate: '18',
    default_hsn_code: '33049990',
    default_gst_rate: '18',
    bank_name: '',
    bank_account_no: '',
    bank_ifsc: '',
    bank_branch: '',
    upi_id: '',
    authorized_signatory: 'Authorized Signatory — Bhumivera',
    logo_url: '/logo.webp',
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [report, setReport] = useState(null);
  const [expenseForm, setExpenseForm] = useState(null);

  // Filters & Selection
  const [productSearch, setProductSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('all'); // 'all' | 'invoice' | 'credit_note'
  const [supplyTypeFilter, setSupplyTypeFilter] = useState('all'); // 'all' | 'B2B' | 'B2CS' | 'B2CL'
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [useDefaultTaxFallback, setUseDefaultTaxFallback] = useState(true);
  const [bulkHsn, setBulkHsn] = useState('33049990');
  const [bulkGstRate, setBulkGstRate] = useState('18');

  // Luxury Invoice Modal State
  const [previewInvoiceDoc, setPreviewInvoiceDoc] = useState(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const requestParams = useMemo(() => ({ params: period, ...ADMIN }), [period]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [
        profileResponse,
        productsResponse,
        ordersResponse,
        documentsResponse,
        expensesResponse,
        reportResponse,
        auditResponse,
      ] = await Promise.all([
        api.get('/gst/profile', ADMIN),
        api.get('/gst/products', { params: { search: productSearch }, ...ADMIN }),
        api.get('/gst/orders-to-invoice', ADMIN),
        api.get('/gst/documents', requestParams),
        api.get('/gst/expenses', requestParams),
        api.get('/gst/reports', requestParams),
        api.get('/gst/audit', requestParams),
      ]);
      if (profileResponse.data) setProfile(current => ({ ...current, ...profileResponse.data }));
      setProducts(productsResponse.data || []);
      setOrders(ordersResponse.data || []);
      setDocuments(documentsResponse.data || []);
      setExpenses(expensesResponse.data || []);
      setReport(reportResponse.data || null);
      setAuditEvents(auditResponse.data || []);
    } catch (loadError) {
      setError(
        loadError.normalized?.message ||
          loadError.response?.data?.message ||
          'Could not load GST and accounting data.'
      );
    } finally {
      setLoading(false);
    }
  }, [productSearch, requestParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveProfile = async event => {
    event.preventDefault();
    setBusy('profile');
    setError('');
    setMessage('');
    try {
      const response = await api.put('/gst/profile', profile, ADMIN);
      setProfile(current => ({ ...current, ...response.data }));
      setMessage('GST business profile & invoice branding settings saved.');
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not save the GST profile.');
    } finally {
      setBusy('');
    }
  };

  const saveProductTax = async product => {
    setBusy(`product-${product.id}`);
    setError('');
    setMessage('');
    try {
      await api.put(
        `/gst/products/${product.id}/tax`,
        {
          gst_hsn_code: product.gst_hsn_code,
          gst_rate: product.gst_rate,
        },
        ADMIN
      );
      setMessage(`GST classification saved for ${product.name}. New orders will keep this tax snapshot.`);
      await loadData();
    } catch (saveError) {
      setError(saveError.response?.data?.message || `Could not save GST classification for ${product.name}.`);
    } finally {
      setBusy('');
    }
  };

  const handleBulkClassifyProducts = async (onlyUnset = true) => {
    setBusy('bulk-tax');
    setError('');
    setMessage('');
    try {
      const res = await api.post(
        '/gst/products/bulk-tax',
        {
          gst_hsn_code: bulkHsn,
          gst_rate: Number(bulkGstRate),
          onlyUnset,
          productIds: onlyUnset ? [] : products.map(p => p.id),
        },
        ADMIN
      );
      setMessage(res.data?.message || 'Bulk HSN & GST classification applied.');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not apply bulk HSN/GST classification.');
    } finally {
      setBusy('');
    }
  };

  const issueInvoice = async order => {
    if (
      !window.confirm(
        `Issue and permanently lock the tax invoice for order #${order.id} (${order.formatted_order_number || `BHVM${order.id}`})? Verify the customer state and HSN/GST rates first.`
      )
    )
      return;
    setBusy(`order-${order.id}`);
    setError('');
    setMessage('');
    try {
      const res = await api.post(
        `/gst/orders/${order.id}/invoice`,
        { useDefaultFallback: useDefaultTaxFallback },
        ADMIN
      );
      setMessage(`Tax invoice ${res.data?.document_number || ''} issued for order #${order.id}.`);
      await loadData();
    } catch (issueError) {
      setError(issueError.response?.data?.message || 'Could not issue invoice.');
    } finally {
      setBusy('');
    }
  };

  const handleBatchIssueInvoices = async () => {
    const targetIds = selectedOrderIds.length > 0 ? selectedOrderIds : orders.map(o => o.id);
    if (!targetIds.length) return;
    if (
      !window.confirm(
        `Issue official GST Tax Invoices for ${targetIds.length} order(s)? Issued documents are permanently locked.`
      )
    )
      return;
    setBusy('batch-invoice');
    setError('');
    setMessage('');
    try {
      const res = await api.post(
        '/gst/orders/batch-invoice',
        { orderIds: targetIds, useDefaultFallback: useDefaultTaxFallback },
        ADMIN
      );
      setSelectedOrderIds([]);
      setMessage(res.data?.message || `Batch issued ${res.data?.issuedCount || 0} invoice(s).`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Batch invoice issuance failed.');
    } finally {
      setBusy('');
    }
  };

  const saveExpense = async event => {
    event.preventDefault();
    setBusy('expense');
    setError('');
    setMessage('');
    const payload = {
      ...expenseForm,
      taxable_value: Number(expenseForm.taxable_value || 0),
      cgst: Number(expenseForm.cgst || 0),
      sgst: Number(expenseForm.sgst || 0),
      igst: Number(expenseForm.igst || 0),
      total: Number(expenseForm.total || 0),
    };
    try {
      if (expenseForm.id) await api.put(`/gst/expenses/${expenseForm.id}`, payload, ADMIN);
      else await api.post('/gst/expenses', payload, ADMIN);
      setExpenseForm(null);
      setMessage('Expense saved.');
      await loadData();
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not save expense.');
    } finally {
      setBusy('');
    }
  };

  const archiveExpense = async expense => {
    if (
      !window.confirm(
        `Archive expense ${expense.document_reference || `#${expense.id}`}? It will no longer be included in reports but remains stored.`
      )
    )
      return;
    setBusy(`expense-${expense.id}`);
    try {
      await api.delete(`/gst/expenses/${expense.id}`, ADMIN);
      setMessage('Expense archived; its record remains stored.');
      await loadData();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Could not archive expense.');
    } finally {
      setBusy('');
    }
  };

  const issueCreditNote = async document => {
    const reason = window.prompt(
      `Issue a full-value credit note against ${document.document_number}. Enter the reason:`
    );
    if (reason === null) return;
    setBusy(`credit-${document.id}`);
    setError('');
    setMessage('');
    try {
      await api.post(`/gst/documents/${document.id}/credit-note`, { reason }, ADMIN);
      setMessage(`Credit note issued for ${document.document_number}.`);
      await loadData();
    } catch (creditError) {
      setError(creditError.response?.data?.message || 'Could not issue credit note.');
    } finally {
      setBusy('');
    }
  };

  const openLuxuryInvoiceModal = async docOrId => {
    if (typeof docOrId === 'object' && docOrId?.line_items) {
      setPreviewInvoiceDoc(docOrId);
      return;
    }
    const id = typeof docOrId === 'object' ? docOrId.id : docOrId;
    setBusy(`view-${id}`);
    try {
      const { data } = await api.get(`/gst/documents/${id}`, ADMIN);
      setPreviewInvoiceDoc(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load invoice details.');
    } finally {
      setBusy('');
    }
  };

  const printDocument = async id => {
    setBusy(`print-${id}`);
    try {
      const { data } = await api.get(`/gst/documents/${id}`, ADMIN);
      const normalized = normalizeInvoiceDocument(data, profile);
      const html = buildPrintableLuxuryInvoiceHtml(normalized);
      const popup = window.open('', '_blank');
      if (!popup) {
        setPreviewInvoiceDoc(data);
        return;
      }
      popup.document.write(html);
      popup.document.close();
    } catch (printError) {
      setError(
        printError.message || printError.response?.data?.message || 'Could not open invoice for printing.'
      );
    } finally {
      setBusy('');
    }
  };

  const exportFile = async (format = 'xlsx') => {
    setBusy(`export-${format}`);
    setError('');
    try {
      const endpoint =
        format === 'csv'
          ? '/gst/reports/export.csv'
          : format === 'json'
          ? '/gst/reports/export.json'
          : '/gst/reports/export.xlsx';
      const response = await api.get(endpoint, {
        params: period,
        responseType: 'blob',
        ...ADMIN,
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download =
        format === 'csv'
          ? `Bhumivera_Master_GST_Register_${period.from}_${period.to}.csv`
          : format === 'json'
          ? `Bhumivera_GSTR1_Working_${period.from}_${period.to}.json`
          : `Bhumivera_GST_Working_Papers_${period.from}_${period.to}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage(`Exported ${format.toUpperCase()} GST report for ${period.from} to ${period.to}.`);
    } catch (exportError) {
      setError(exportError.response?.data?.message || `Could not export ${format.toUpperCase()} file.`);
    } finally {
      setBusy('');
    }
  };

  const updateProduct = (id, field, value) =>
    setProducts(current =>
      current.map(product => (product.id === id ? { ...product, [field]: value } : product))
    );

  // Filtered Lists
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      if (docTypeFilter !== 'all' && doc.document_type !== docTypeFilter) return false;
      if (supplyTypeFilter !== 'all' && (doc.supply_type || 'B2CS') !== supplyTypeFilter) return false;
      if (!docSearch.trim()) return true;
      const q = docSearch.toLowerCase();
      return (
        String(doc.document_number || '').toLowerCase().includes(q) ||
        String(doc.formatted_order_number || doc.order_id || '').toLowerCase().includes(q) ||
        String(doc.customer_name || '').toLowerCase().includes(q) ||
        String(doc.customer_email || '').toLowerCase().includes(q) ||
        String(doc.buyer_gstin || '').toLowerCase().includes(q) ||
        String(doc.place_of_supply_name || '').toLowerCase().includes(q) ||
        String(doc.hsn_codes_list || '').toLowerCase().includes(q)
      );
    });
  }, [documents, docSearch, docTypeFilter, supplyTypeFilter]);

  const filteredOrders = useMemo(() => {
    if (!orderSearch.trim()) return orders;
    const q = orderSearch.toLowerCase();
    return orders.filter(
      o =>
        String(o.id).includes(q) ||
        String(o.formatted_order_number || o.order_number || '').toLowerCase().includes(q) ||
        String(o.customer_name || '').toLowerCase().includes(q) ||
        String(o.customer_email || '').toLowerCase().includes(q) ||
        String(o.buyer_state || '').toLowerCase().includes(q)
    );
  }, [orders, orderSearch]);

  const unclassifiedProductCount = useMemo(
    () => products.filter(p => !p.gst_hsn_code || p.gst_rate === null || p.gst_rate === undefined).length,
    [products]
  );

  const gstr3b = report?.gstr3b || {};
  const gstr1 = report?.gstr1 || {};

  return (
    <div className="space-y-6 p-4 md:p-6 text-slate-100">
      {/* COMMAND HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 p-2 text-emerald-400">
              <FileText size={22} />
            </span>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                GST &amp; Books · 100X Tax &amp; Luxury Invoice Command Center
              </h2>
              <p className="text-xs text-slate-400">
                10X Branded GST Tax Invoices (with Logo, QR &amp; HSN Summary), GSTR-1 / GSTR-3B Working Tables, ITC Ledger &amp; 42-Column Master Exports
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy === 'export-xlsx'}
            onClick={() => exportFile('xlsx')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            <FileSpreadsheet size={15} /> Export 6-Sheet Excel (.xlsx)
          </button>
          <button
            type="button"
            disabled={busy === 'export-csv'}
            onClick={() => exportFile('csv')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#d4af37]/50 bg-[#d4af37]/15 px-3.5 py-2 text-xs font-bold text-[#f5df88] hover:bg-[#d4af37]/25 disabled:opacity-50"
          >
            <Download size={15} /> Export All 48 Columns (.csv)
          </button>
          <button
            type="button"
            disabled={busy === 'export-json'}
            onClick={() => exportFile('json')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50"
          >
            <FileCode2 size={15} /> Export GSTR-1 (.json)
          </button>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-bold text-white hover:border-emerald-400 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-emerald-400' : ''} /> Refresh
          </button>
        </div>
      </header>

      {/* STATUTORY COMPLIANCE BANNER */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100 flex items-start gap-3">
        <ShieldCheck size={18} className="text-amber-300 shrink-0 mt-0.5" />
        <div>
          <strong>Statutory &amp; CA Working Paper Notice:</strong> This module generates GST-compliant Tax Invoices, Credit Notes, HSN Summaries, and GSTR-1 / GSTR-3B working schedules. Issued documents are cryptographically signed (512-bit SHA-512) and locked against mutation; adjustments are recorded via linked Credit Notes.
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-200">
          {error}
        </div>
      )}
      {message && (
        <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-200">
          {message}
        </div>
      )}

      {/* PERIOD & DATE FILTER BAR */}
      <div className="rounded-2xl border border-slate-800 bg-[#10241f]/70 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Accounting Period:</span>
          {[
            ['month', 'This Month'],
            ['quarter', 'This Quarter'],
            ['year', 'Financial Year (Apr–Mar)'],
          ].map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => setPeriod(datePresets(preset))}
              className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-white hover:border-emerald-400"
            >
              {label}
            </button>
          ))}
          <input
            type="date"
            aria-label="Period From"
            value={period.from}
            onChange={event => setPeriod(value => ({ ...value, from: event.target.value }))}
            className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
          />
          <span className="text-xs text-slate-500">to</span>
          <input
            type="date"
            aria-label="Period To"
            value={period.to}
            onChange={event => setPeriod(value => ({ ...value, to: event.target.value }))}
            className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
          />
        </div>

        {/* Navigation Section Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            ['all', 'All Sections'],
            ['invoices', `Issued Invoices (${documents.length})`],
            ['ready', `Ready to Invoice (${orders.length})`],
            ['gstr', 'GSTR-1 & GSTR-3B Tables'],
            ['products', `Product HSN (${products.length})`],
            ['expenses', `Expenses & ITC (${expenses.length})`],
            ['profile', 'GST Profile & Logo'],
            ['audit', `Audit Log (${auditEvents.length})`],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeSection === id
                  ? 'bg-[#d4af37] text-[#071510]'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 7-CARD EXECUTIVE GST & P&L TELEMETRY STRIP */}
      {report && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {[
            ['Taxable Sales', report.sales?.taxable_sales, 'text-white'],
            ['CGST + SGST', Number(report.sales?.cgst || 0) + Number(report.sales?.sgst || 0), 'text-emerald-300'],
            ['IGST (Inter-State)', report.sales?.igst, 'text-cyan-300'],
            ['Total Outward GST', gstr3b.total_outward_tax ?? (Number(report.sales?.cgst || 0) + Number(report.sales?.sgst || 0) + Number(report.sales?.igst || 0)), 'text-amber-300'],
            ['Eligible ITC', report.expenses?.eligible_itc, 'text-emerald-400'],
            ['Net GST Payable', gstr3b.net_gst_payable ?? 0, 'text-[#f5df88]'],
            ['Estimated P&L', report.estimated_profit_loss, Number(report.estimated_profit_loss || 0) >= 0 ? 'text-emerald-300' : 'text-rose-300'],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-[#10241f]/80 p-3.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
              <div className={`mt-1.5 font-mono text-base font-black ${color}`}>{rupees(value)}</div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          SECTION 1: ISSUED TAX INVOICES & CREDIT NOTES (EXPANDED COLUMNS + LUXURY INVOICE VIEW)
         ===================================================================== */}
      {(activeSection === 'all' || activeSection === 'invoices') && (
        <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#d4af37]" />
                CA Working Papers &amp; Issued GST Documents ({filteredDocuments.length})
              </h3>
              <p className="text-xs text-slate-400">
                Every column is expanded below. Click <strong>Luxury Invoice</strong> on any row to view or print the 10X Branded Tax Invoice with Bhumivera Logo &amp; HSN Summary.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={docSearch}
                  onChange={e => setDocSearch(e.target.value)}
                  placeholder="Search Invoice #, BHVM Order #, Customer, GSTIN, State, HSN…"
                  className="w-64 rounded-xl border border-slate-700 bg-slate-950/80 pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>
              <select
                value={docTypeFilter}
                onChange={e => setDocTypeFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs text-white"
              >
                <option value="all">All Doc Types</option>
                <option value="invoice">Tax Invoices</option>
                <option value="credit_note">Credit Notes</option>
              </select>
              <select
                value={supplyTypeFilter}
                onChange={e => setSupplyTypeFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs text-white"
              >
                <option value="all">All Supply Types</option>
                <option value="B2B">B2B (With GSTIN)</option>
                <option value="B2CS">B2CS (Consumer)</option>
                <option value="B2CL">B2CL (Inter-State &gt;₹2.5L)</option>
              </select>
              <button
                type="button"
                disabled={busy === 'export-xlsx'}
                onClick={() => exportFile('xlsx')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 disabled:opacity-50"
              >
                <Download size={14} /> Export Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[1650px] text-left text-xs">
              <thead className="bg-slate-950/90 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3">Document No.</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Order # (BHVM)</th>
                  <th className="p-3">Supply</th>
                  <th className="p-3">Customer Name &amp; Contact</th>
                  <th className="p-3">Buyer GSTIN</th>
                  <th className="p-3">Place of Supply</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">HSN / Rate</th>
                  <th className="p-3 text-right">Taxable</th>
                  <th className="p-3 text-right">CGST</th>
                  <th className="p-3 text-right">SGST</th>
                  <th className="p-3 text-right">IGST</th>
                  <th className="p-3 text-right">Total Tax</th>
                  <th className="p-3 text-right">Grand Total</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredDocuments.map(document => {
                  const totalTax =
                    Number(document.cgst || 0) + Number(document.sgst || 0) + Number(document.igst || 0);
                  return (
                    <tr key={document.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-white">
                        {document.document_number}
                        {document.original_document_number && (
                          <span className="block text-[10px] text-amber-300">
                            Ref: {document.original_document_number}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            document.document_type === 'credit_note'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {document.document_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{String(document.issue_date).slice(0, 10)}</td>
                      <td className="p-3 font-mono font-semibold text-[#f5df88]">
                        {document.formatted_order_number || `BHVM${document.order_id}`}
                        <span className="block text-[10px] text-slate-500">ID #{document.order_id}</span>
                      </td>
                      <td className="p-3">
                        <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                          {document.supply_type || 'B2CS'}
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          {document.is_interstate ? 'Inter-State' : 'Intra-State'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{document.customer_name || 'Customer'}</div>
                        <div className="text-[10px] text-slate-400">
                          {[document.customer_email, document.customer_phone].filter(Boolean).join(' · ')}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-300">
                        {document.buyer_gstin || <span className="text-slate-500">URP (B2C)</span>}
                      </td>
                      <td className="p-3 text-slate-300">
                        <span className="font-mono font-bold text-white">{document.place_of_supply_code || '19'}</span> —{' '}
                        {document.place_of_supply_name || 'West Bengal'}
                      </td>
                      <td className="p-3">
                        <span className="uppercase font-semibold text-slate-200">
                          {document.payment_mode || 'ONLINE'}
                        </span>
                        <span className="block text-[10px] text-emerald-400 uppercase">
                          {document.payment_status || 'paid'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-300">
                        <div>{document.hsn_codes_list || '33049990'}</div>
                        <div className="text-[10px] text-slate-500">{document.gst_rates_list || '18%'}</div>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-200">{rupees(document.taxable_value)}</td>
                      <td className="p-3 text-right font-mono text-slate-300">{rupees(document.cgst)}</td>
                      <td className="p-3 text-right font-mono text-slate-300">{rupees(document.sgst)}</td>
                      <td className="p-3 text-right font-mono text-slate-300">{rupees(document.igst)}</td>
                      <td className="p-3 text-right font-mono font-semibold text-emerald-300">{rupees(totalTax)}</td>
                      <td className="p-3 text-right font-mono font-bold text-white">{rupees(document.total)}</td>
                      <td className="p-3 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openLuxuryInvoiceModal(document)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#d4af37] px-2.5 py-1.5 text-[11px] font-black text-[#071510] hover:bg-[#e5c247]"
                            title="Open 10X Luxury Branded GST Tax Invoice with Logo"
                          >
                            <Eye size={13} /> Luxury Invoice
                          </button>
                          <button
                            type="button"
                            title="Print"
                            onClick={() => printDocument(document.id)}
                            className="rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:border-emerald-400 hover:text-white"
                          >
                            <Printer size={14} />
                          </button>
                          {document.document_type === 'invoice' && (
                            <button
                              type="button"
                              disabled={busy === `credit-${document.id}`}
                              onClick={() => issueCreditNote(document)}
                              title="Create full-value credit note"
                              className="rounded-lg border border-amber-500/40 px-2 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/15 disabled:opacity-50"
                            >
                              Credit note
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredDocuments.length && (
                  <tr>
                    <td colSpan="17" className="py-8 text-center text-slate-500">
                      {loading ? 'Loading documents…' : 'No GST documents found in this period.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTION 2: READY TO INVOICE ORDERS & BATCH ISSUANCE (EXPANDED COLUMNS)
         ===================================================================== */}
      {(activeSection === 'all' || activeSection === 'ready') && (
        <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                Ready to Invoice — Shipped &amp; Delivered Orders ({filteredOrders.length})
              </h3>
              <p className="text-xs text-slate-400">
                Inspect order line items, customer state, and HSN readiness, or issue invoices in 1 click.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useDefaultTaxFallback}
                  onChange={e => setUseDefaultTaxFallback(e.target.checked)}
                  className="accent-emerald-400"
                />
                Auto-apply default HSN ({profile.default_hsn_code || '33049990'} @ {profile.default_gst_rate || 18}%) if item HSN is unset
              </label>

              <input
                type="text"
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                placeholder="Search Order #, Customer, State…"
                className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs text-white"
              />

              {filteredOrders.length > 0 && (
                <button
                  type="button"
                  disabled={busy === 'batch-invoice'}
                  onClick={handleBatchIssueInvoices}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#d4af37] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-[#071510] hover:bg-[#e5c247] disabled:opacity-50"
                >
                  <CheckSquare size={14} />
                  {selectedOrderIds.length > 0
                    ? `Batch Issue Selected (${selectedOrderIds.length})`
                    : `Batch Issue All (${filteredOrders.length})`}
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[1250px] text-left text-xs">
              <thead className="bg-slate-950/90 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length}
                      onChange={e =>
                        setSelectedOrderIds(e.target.checked ? filteredOrders.map(o => o.id) : [])
                      }
                    />
                  </th>
                  <th className="p-3">Order</th>
                  <th className="p-3">Order Date</th>
                  <th className="p-3">Customer &amp; Contact</th>
                  <th className="p-3">Destination State &amp; PIN</th>
                  <th className="p-3">Items Summary</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">HSN Readiness</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredOrders.map(order => {
                  const isChecked = selectedOrderIds.includes(order.id);
                  return (
                    <tr key={order.id} className="hover:bg-slate-900/40">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e =>
                            setSelectedOrderIds(prev =>
                              e.target.checked ? [...prev, order.id] : prev.filter(id => id !== order.id)
                            )
                          }
                        />
                      </td>
                      <td className="p-3 font-bold text-white">
                        #{order.id}
                        <span className="block font-mono text-[10px] text-[#f5df88]">
                          {order.formatted_order_number || `BHVM${order.id}`}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{String(order.created_at).slice(0, 10)}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">
                          {order.customer_name || order.customer_email || 'Customer'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {[order.customer_email, order.customer_phone].filter(Boolean).join(' · ')}
                        </div>
                      </td>
                      <td className="p-3 text-slate-300">
                        <div>{order.buyer_state || 'West Bengal'}</div>
                        <div className="text-[10px] text-slate-500">
                          {[order.buyer_city, order.buyer_pincode].filter(Boolean).join(' · ')}
                        </div>
                      </td>
                      <td className="p-3 max-w-xs truncate text-slate-300" title={order.items_summary}>
                        {order.items_summary || `${order.item_count || 1} item(s)`}
                      </td>
                      <td className="p-3">
                        <span className="uppercase font-semibold text-slate-200">{order.payment_mode || 'ONLINE'}</span>
                        <span className="block text-[10px] text-emerald-400 uppercase">{order.payment_status || 'paid'}</span>
                      </td>
                      <td className="p-3 capitalize text-slate-300">{order.status}</td>
                      <td className="p-3">
                        {order.is_ready_to_invoice ? (
                          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                            ✓ HSN Verified
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                            Uses Default HSN
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-100">{rupees(order.total)}</td>
                      <td className="p-3 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewInvoiceDoc(order)}
                            className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 hover:border-[#d4af37] hover:text-[#f5df88]"
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            disabled={busy === `order-${order.id}`}
                            onClick={() => issueInvoice(order)}
                            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                          >
                            Issue invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredOrders.length && (
                  <tr>
                    <td colSpan="11" className="py-6 text-center text-slate-500">
                      {loading ? 'Loading orders…' : 'No shipped/delivered orders need invoicing.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTION 3: GSTR-1 & GSTR-3B STATUTORY RETURN TABLES
         ===================================================================== */}
      {(activeSection === 'all' || activeSection === 'gstr') && report && (
        <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                GSTR-3B Liability &amp; GSTR-1 HSN / Place-of-Supply Schedules
              </h3>
              <p className="text-xs text-slate-400">
                Ready-to-reconcile tables for monthly/quarterly GST portal return preparation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* GSTR-3B Table 3.1 & Table 4 & Table 6 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#d4af37]">
                GSTR-3B Summary — Outward Tax vs. Input Tax Credit (ITC)
              </h4>
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2">Tax Head</th>
                    <th className="py-2 text-right">Outward Tax (3.1)</th>
                    <th className="py-2 text-right">Eligible ITC (4A)</th>
                    <th className="py-2 text-right">Net Tax Payable (6.1)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="py-2 font-sans font-semibold text-white">Integrated GST (IGST)</td>
                    <td className="py-2 text-right text-slate-200">{rupees(gstr3b.outward_igst)}</td>
                    <td className="py-2 text-right text-emerald-300">{rupees(gstr3b.itc_igst)}</td>
                    <td className="py-2 text-right font-bold text-[#f5df88]">{rupees(gstr3b.net_igst_payable)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-semibold text-white">Central GST (CGST)</td>
                    <td className="py-2 text-right text-slate-200">{rupees(gstr3b.outward_cgst)}</td>
                    <td className="py-2 text-right text-emerald-300">{rupees(gstr3b.itc_cgst)}</td>
                    <td className="py-2 text-right font-bold text-[#f5df88]">{rupees(gstr3b.net_cgst_payable)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans font-semibold text-white">State / UT GST (SGST)</td>
                    <td className="py-2 text-right text-slate-200">{rupees(gstr3b.outward_sgst)}</td>
                    <td className="py-2 text-right text-emerald-300">{rupees(gstr3b.itc_sgst)}</td>
                    <td className="py-2 text-right font-bold text-[#f5df88]">{rupees(gstr3b.net_sgst_payable)}</td>
                  </tr>
                  <tr className="bg-white/5 font-bold">
                    <td className="py-2.5 font-sans text-white">Total Statutory Liability</td>
                    <td className="py-2.5 text-right text-white">{rupees(gstr3b.total_outward_tax)}</td>
                    <td className="py-2.5 text-right text-emerald-300">{rupees(gstr3b.total_eligible_itc)}</td>
                    <td className="py-2.5 text-right text-[#d4af37]">{rupees(gstr3b.net_gst_payable)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* State-Wise Place of Supply Matrix */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-300">
                GSTR-1 Table 7 — State-Wise Place of Supply Summary
              </h4>
              <div className="overflow-x-auto max-h-56">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2">State</th>
                      <th className="py-2 text-center">Docs</th>
                      <th className="py-2 text-right">Taxable</th>
                      <th className="py-2 text-right">Total GST</th>
                      <th className="py-2 text-right">Invoice Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(gstr1.state_summary || []).map(st => (
                      <tr key={st.state_code}>
                        <td className="py-2 font-semibold text-white">
                          {st.state_code} — {st.state_name}
                        </td>
                        <td className="py-2 text-center font-mono text-slate-300">{st.document_count}</td>
                        <td className="py-2 text-right font-mono text-slate-200">{rupees(st.taxable_value)}</td>
                        <td className="py-2 text-right font-mono text-emerald-300">{rupees(st.total_tax)}</td>
                        <td className="py-2 text-right font-mono font-bold text-white">{rupees(st.total)}</td>
                      </tr>
                    ))}
                    {!(gstr1.state_summary || []).length && (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-slate-500">
                          No state supplies recorded in this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* GSTR-1 Table 12: HSN-Wise Summary */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-cyan-300">
              GSTR-1 Table 12 — HSN / SAC Outward Supplies Summary
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-xs">
                <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2">HSN / SAC</th>
                    <th className="py-2">UQC</th>
                    <th className="py-2 text-center">Total Qty</th>
                    <th className="py-2 text-center">GST Rate</th>
                    <th className="py-2 text-right">Taxable Value</th>
                    <th className="py-2 text-right">CGST</th>
                    <th className="py-2 text-right">SGST</th>
                    <th className="py-2 text-right">IGST</th>
                    <th className="py-2 text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(gstr1.hsn_summary || []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-2 font-bold text-white">{row.hsn_sac}</td>
                      <td className="py-2 text-slate-400">{row.uqc || 'NOS'}</td>
                      <td className="py-2 text-center text-slate-200">{row.quantity}</td>
                      <td className="py-2 text-center text-cyan-300">{row.gst_rate}%</td>
                      <td className="py-2 text-right text-slate-200">{rupees(row.taxable_value)}</td>
                      <td className="py-2 text-right text-slate-300">{rupees(row.cgst)}</td>
                      <td className="py-2 text-right text-slate-300">{rupees(row.sgst)}</td>
                      <td className="py-2 text-right text-slate-300">{rupees(row.igst)}</td>
                      <td className="py-2 text-right font-bold text-white">{rupees(row.total)}</td>
                    </tr>
                  ))}
                  {!(gstr1.hsn_summary || []).length && (
                    <tr>
                      <td colSpan="9" className="py-6 text-center font-sans text-slate-500">
                        No HSN summary lines for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTION 4: PRODUCT HSN/SAC & BULK GST RATE CLASSIFIER
         ===================================================================== */}
      {(activeSection === 'all' || activeSection === 'products') && (
        <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                Product HSN/SAC &amp; GST Rates ({products.length} Products · {unclassifiedProductCount} Unclassified)
              </h3>
              <p className="text-xs text-slate-400">
                Applies to new orders. Use the 1-Click Bulk Classifier below to assign default HSN &amp; GST rates instantly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950/80 px-2.5 py-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Default HSN:</span>
                <input
                  value={bulkHsn}
                  onChange={e => setBulkHsn(e.target.value)}
                  className="w-20 bg-transparent font-mono text-xs text-white outline-none"
                />
                <span className="text-[10px] font-bold uppercase text-slate-400">@</span>
                <input
                  type="number"
                  value={bulkGstRate}
                  onChange={e => setBulkGstRate(e.target.value)}
                  className="w-12 bg-transparent font-mono text-xs text-emerald-300 outline-none"
                />
                <span className="text-[10px] text-slate-400">%</span>
                <button
                  type="button"
                  disabled={busy === 'bulk-tax'}
                  onClick={() => handleBulkClassifyProducts(true)}
                  className="ml-1 inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                >
                  <Wand2 size={12} /> Auto-Fill Unset ({unclassifiedProductCount})
                </button>
              </div>

              <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-1.5">
                <Search size={15} className="text-slate-400" />
                <input
                  value={productSearch}
                  onChange={event => setProductSearch(event.target.value)}
                  placeholder="Search products"
                  className="w-40 bg-transparent text-xs text-white outline-none"
                />
              </label>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[750px] text-left text-xs">
              <thead className="bg-slate-950/90 text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3 text-right">Selling Price</th>
                  <th className="p-3">HSN</th>
                  <th className="p-3">GST rate (%)</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">{product.name}</td>
                    <td className="p-3 text-slate-400">{product.category_name || 'Botanical'}</td>
                    <td className="p-3 font-mono text-slate-400">{product.sku || '—'}</td>
                    <td className="p-3 text-right font-mono text-slate-200">
                      {rupees(product.discount_price || product.price)}
                    </td>
                    <td className="p-3">
                      <input
                        value={product.gst_hsn_code || ''}
                        onChange={event => updateProduct(product.id, 'gst_hsn_code', event.target.value)}
                        aria-label={`HSN code for ${product.name}`}
                        placeholder="33049990"
                        className="w-28 rounded border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-white"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={product.gst_rate ?? ''}
                        onChange={event => updateProduct(product.id, 'gst_rate', event.target.value)}
                        aria-label={`GST rate for ${product.name}`}
                        placeholder="18"
                        className="w-24 rounded border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-white"
                      />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        disabled={busy === `product-${product.id}`}
                        onClick={() => saveProductTax(product)}
                        className="rounded-lg border border-emerald-500/50 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
                {!products.length && (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-slate-500">
                      {loading ? 'Loading products…' : 'No products found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTION 5: EXPENSE & INPUT TAX CREDIT (ITC) REGISTER (EXPANDED COLUMNS)
         ===================================================================== */}
      {(activeSection === 'all' || activeSection === 'expenses') && (
        <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Expense &amp; Input Tax Credit (ITC) Register</h3>
              <p className="text-xs text-slate-400">
                Enter vendor purchase bills and mark input tax credit (ITC) eligibility for GSTR-3B offset.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setExpenseForm({ ...emptyExpense })}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950"
            >
              <Plus size={15} /> Add expense
            </button>
          </div>

          {expenseForm && (
            <form
              onSubmit={saveExpense}
              className="grid gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[
                ['incurred_on', 'Date', 'date'],
                ['vendor_name', 'Vendor', 'text'],
                ['supplier_gstin', 'Supplier GSTIN', 'text'],
                ['document_reference', 'Bill/reference no.', 'text'],
                ['category', 'Category (include COGS where applicable)', 'text'],
                ['description', 'Description', 'text'],
                ['taxable_value', 'Taxable value', 'number'],
                ['cgst', 'CGST', 'number'],
                ['sgst', 'SGST', 'number'],
                ['igst', 'IGST', 'number'],
                ['total', 'Total incl. GST', 'number'],
              ].map(([key, label, type]) => (
                <label key={key}>
                  <span className="mb-1 block text-xs text-slate-400">{label}</span>
                  <input
                    required={['incurred_on', 'vendor_name', 'category', 'description', 'total'].includes(key)}
                    type={type}
                    step={type === 'number' ? '0.01' : undefined}
                    value={expenseForm[key] ?? ''}
                    onChange={event =>
                      setExpenseForm(current => ({ ...current, [key]: event.target.value }))
                    }
                    className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-2 text-sm text-white"
                  />
                </label>
              ))}
              <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(expenseForm.itc_eligible)}
                  onChange={event =>
                    setExpenseForm(current => ({ ...current, itc_eligible: event.target.checked }))
                  }
                />{' '}
                ITC eligible (CA verified)
              </label>
              <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
                <button
                  disabled={busy === 'expense'}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50"
                >
                  {expenseForm.id ? 'Update expense' : 'Save expense'}
                </button>
                <button
                  type="button"
                  onClick={() => setExpenseForm(null)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[1050px] text-left text-xs">
              <thead className="bg-slate-950/90 text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Vendor / Reference</th>
                  <th className="p-3">Supplier GSTIN</th>
                  <th className="p-3">Category &amp; Description</th>
                  <th className="p-3 text-right">Taxable</th>
                  <th className="p-3 text-right">CGST</th>
                  <th className="p-3 text-right">SGST</th>
                  <th className="p-3 text-right">IGST</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">ITC</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {expenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-slate-900/40">
                    <td className="p-3 text-slate-300">{String(expense.incurred_on).slice(0, 10)}</td>
                    <td className="p-3 text-white font-semibold">
                      {expense.vendor_name}
                      <div className="text-[10px] font-mono text-slate-400">
                        {expense.document_reference || `EXP-${expense.id}`}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-300">{expense.supplier_gstin || 'URP'}</td>
                    <td className="p-3 text-slate-300">
                      <span className="font-semibold text-white">{expense.category}</span>
                      <span className="block text-[11px] text-slate-400">{expense.description}</span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-200">{rupees(expense.taxable_value)}</td>
                    <td className="p-3 text-right font-mono text-slate-300">{rupees(expense.cgst)}</td>
                    <td className="p-3 text-right font-mono text-slate-300">{rupees(expense.sgst)}</td>
                    <td className="p-3 text-right font-mono text-slate-300">{rupees(expense.igst)}</td>
                    <td className="p-3 text-right font-mono font-bold text-white">{rupees(expense.total)}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          expense.itc_eligible
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {expense.itc_eligible ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setExpenseForm({ ...expense, itc_eligible: Boolean(expense.itc_eligible) })
                        }
                        className="mr-2 rounded border border-slate-700 px-2.5 py-1 text-xs text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busy === `expense-${expense.id}`}
                        onClick={() => archiveExpense(expense)}
                        title="Archive expense"
                        className="rounded border border-rose-500/30 p-1.5 text-rose-300 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!expenses.length && (
                  <tr>
                    <td colSpan="11" className="py-6 text-center text-slate-500">
                      No expenses entered for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =====================================================================
          SECTION 6: GST BUSINESS PROFILE & LUXURY INVOICE BRANDING
         ===================================================================== */}
      {(activeSection === 'all' || activeSection === 'profile') && (
        <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5">
          <h3 className="mb-4 text-lg font-bold text-white">
            GST Business Profile &amp; 10X Luxury Invoice Branding
          </h3>
          <form onSubmit={saveProfile} className="grid gap-4 md:grid-cols-3">
            {[
              ['legal_name', 'Legal name', true],
              ['trade_name', 'Brand / Trade name on Invoice Header', false],
              ['gstin', 'GSTIN (15 characters)', true],
              ['pan_number', 'PAN Number', false],
              ['state_name', 'Registered state', true],
              ['state_code', 'GST state code (e.g. 19)', true],
              ['invoice_prefix', 'Invoice prefix (e.g. BV)', true],
              ['default_hsn_code', 'Default Product HSN Code', false],
              ['default_gst_rate', 'Default Product GST Rate (%)', false],
              ['shipping_sac', 'Shipping SAC', false],
              ['shipping_gst_rate', 'Shipping GST rate (%)', false],
              ['email', 'Business email', false],
              ['phone', 'Business phone', false],
              ['authorized_signatory', 'Authorized Signatory Title', false],
              ['logo_url', 'Invoice Brand Logo URL', false],
              ['address', 'Registered business address', true],
            ].map(([key, label, required]) => (
              <label key={key} className={key === 'address' ? 'md:col-span-3' : ''}>
                <span className="mb-1 block text-xs font-semibold text-slate-400">{label}</span>
                <input
                  required={required}
                  value={profile[key] ?? ''}
                  onChange={event => setProfile(current => ({ ...current, [key]: event.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
                />
              </label>
            ))}
            <div className="flex items-center gap-3 md:col-span-3">
              <button
                disabled={busy === 'profile'}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 font-bold text-slate-950 disabled:opacity-50"
              >
                <Save size={16} /> Save GST profile
              </button>
              <span className="text-xs text-slate-400">
                Your logo ({profile.logo_url || '/logo.webp'}), GSTIN, and signatory stamp appear on all printed and downloaded Tax Invoices.
              </span>
            </div>
          </form>
        </section>
      )}

      {/* =====================================================================
          SECTION 7: STATUTORY AUDIT TRAIL
         ===================================================================== */}
      {(activeSection === 'all' || activeSection === 'audit') && (
        <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5">
          <h3 className="mb-3 text-lg font-bold text-white">Statutory Audit History ({auditEvents.length})</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead className="bg-slate-950/90 text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="p-3">When</th>
                  <th className="p-3">Record</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Admin</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditEvents.map(event => (
                  <tr key={`${event.entity_type}-${event.id}`}>
                    <td className="p-3 text-slate-400">
                      {String(event.created_at).slice(0, 19).replace('T', ' ')}
                    </td>
                    <td className="p-3 text-slate-300">
                      {event.entity_type} #{event.entity_id}
                    </td>
                    <td className="p-3 font-semibold text-emerald-300">{event.action}</td>
                    <td className="p-3 text-slate-400">Admin #{event.performed_by}</td>
                    <td className="p-3 max-w-md truncate font-mono text-[11px] text-slate-400">
                      {JSON.stringify(event.details || {})}
                    </td>
                  </tr>
                ))}
                {!auditEvents.length && (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-500">
                      No changes recorded for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 10X LUXURY TAX INVOICE PREVIEW & PRINT MODAL */}
      {previewInvoiceDoc && (
        <LuxuryTaxInvoiceModal
          document={previewInvoiceDoc}
          businessProfile={profile}
          onClose={() => setPreviewInvoiceDoc(null)}
        />
      )}
    </div>
  );
}
